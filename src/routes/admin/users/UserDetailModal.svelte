<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import Icon from '@iconify/svelte';
	import { pb } from '$lib/pocketbase';
	import { toast } from 'svelte-sonner';

	interface Props {
		user: any;
		open: boolean;
		onClose: () => void;
		onLicenseGenerated?: () => void;
	}

	let { user, open = $bindable(false), onClose, onLicenseGenerated }: Props = $props();

	let userLicenses = $state<any[]>([]);
	let isLoadingLicenses = $state(false);
	let isGenerating = $state(false);
	let updatingLicenseId = $state<string | null>(null);

	// 格式化日期 - 只显示年月日
	function formatDate(dateString: string) {
		const date = new Date(dateString);
		return new Intl.DateTimeFormat('zh-CN', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit'
		}).format(date);
	}

	// 获取状态显示
	function getStatusText(status: string) {
		const statusMap: Record<string, string> = {
			active: '激活',
			expired: '过期',
			prohibit: '禁用'
		};
		return statusMap[status] || status;
	}

	// 获取状态颜色
	function getStatusVariant(status: string): any {
		const variantMap: Record<string, string> = {
			active: 'default',
			expired: 'secondary',
			prohibit: 'destructive'
		};
		return variantMap[status] || 'secondary';
	}

	// 加载用户授权列表
	async function loadUserLicenses() {
		if (!user?.id) return;

		isLoadingLicenses = true;
		try {
			const licenses = await pb.collection('maigewan_licenses').getFullList({
				filter: `userRef = "${user.id}"`,
				sort: '-created'
			});
			userLicenses = licenses;
		} catch (err) {
			console.error('Failed to load user licenses:', err);
			toast.error('加载授权列表失败');
			userLicenses = [];
		} finally {
			isLoadingLicenses = false;
		}
	}

	// 生成随机授权码 - 8段格式,每段5个字符
	function generateLicenseKey(): string {
		const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
		const segments = 8; // 改为 8 段
		const segmentLength = 5;
		const parts: string[] = [];

		for (let i = 0; i < segments; i++) {
			let segment = '';
			for (let j = 0; j < segmentLength; j++) {
				segment += chars.charAt(Math.floor(Math.random() * chars.length));
			}
			parts.push(segment);
		}

		return parts.join('-');
	}

	// 检查授权码是否已存在
	async function isLicenseKeyUnique(licenseKey: string): Promise<boolean> {
		try {
			const existing = await pb.collection('maigewan_licenses').getFirstListItem(
				`license_key = "${licenseKey}"`
			);
			return false; // 找到了,说明不唯一
		} catch {
			return true; // 没找到,说明是唯一的
		}
	}

	// 为用户生成授权码
	async function generateLicenseForUser() {
		if (!user?.id) return;

		isGenerating = true;
		try {
			// 生成唯一的授权码(最多尝试 10 次)
			let licenseKey = '';
			let attempts = 0;
			const maxAttempts = 10;

			while (attempts < maxAttempts) {
				licenseKey = generateLicenseKey();
				const isUnique = await isLicenseKeyUnique(licenseKey);
				if (isUnique) {
					break;
				}
				attempts++;
			}

			if (attempts >= maxAttempts) {
				throw new Error('无法生成唯一授权码,请稍后重试');
			}

			// 创建授权记录 - 只传入必需字段
			const newLicense = await pb.collection('maigewan_licenses').create({
				userRef: user.id,
				license_key: licenseKey,
				status: 'active'
			});

			toast.success('授权码生成成功!');

			// 重新加载授权列表
			await loadUserLicenses();

			// 触发回调
			if (onLicenseGenerated) {
				onLicenseGenerated();
			}
		} catch (err) {
			console.error('Failed to generate license:', err);
			// 显示更详细的错误信息
			const errorMessage = err?.response?.message || err?.message || '生成授权码失败';
			toast.error(errorMessage);
		} finally {
			isGenerating = false;
		}
	}

	// 复制授权码
	function copyLicenseKey(key: string) {
		navigator.clipboard.writeText(key);
		toast.success('授权码已复制到剪贴板');
	}

	// 切换授权码状态(封禁/解封)
	async function toggleLicenseStatus(licenseId: string, currentStatus: string) {
		if (updatingLicenseId) return;

		updatingLicenseId = licenseId;
		try {
			const newStatus = currentStatus === 'prohibit' ? 'active' : 'prohibit';
			await pb.collection('maigewan_licenses').update(licenseId, {
				status: newStatus
			});

			// 更新本地列表
			const index = userLicenses.findIndex((l) => l.id === licenseId);
			if (index !== -1) {
				userLicenses[index].status = newStatus;
				userLicenses = userLicenses; // 触发响应式更新
			}

			toast.success(newStatus === 'prohibit' ? '已封禁该授权码' : '已解封该授权码');
		} catch (err) {
			console.error('Failed to update license status:', err);
			toast.error('操作失败,请稍后重试');
		} finally {
			updatingLicenseId = null;
		}
	}

	// 监听弹窗打开状态,自动加载授权列表
	$effect(() => {
		if (open && user?.id) {
			loadUserLicenses();
		}
	});
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="max-h-[90vh] max-w-4xl overflow-y-auto">
		<Dialog.Header>
			<Dialog.Title class="flex items-center gap-2">
				<Icon icon="mdi:account" class="h-6 w-6" />
				用户详情
			</Dialog.Title>
			<Dialog.Description>查看和管理用户的授权信息</Dialog.Description>
		</Dialog.Header>

		{#if user}
			<!-- 用户基本信息 -->
			<div class="space-y-4">
				<div class="rounded-lg border bg-card p-4">
					<h3 class="mb-3 font-semibold">基本信息</h3>
					<div class="grid gap-3 md:grid-cols-2">
						<div>
							<span class="text-sm text-muted-foreground">用户名:</span>
							<span class="ml-2 font-medium">@{user.username}</span>
						</div>
						<div>
							<span class="text-sm text-muted-foreground">邮箱:</span>
							<span class="ml-2 font-medium">{user.email}</span>
						</div>
						<div>
							<span class="text-sm text-muted-foreground">角色:</span>
							{#if user.role === 'admin'}
								<Badge variant="destructive" class="ml-2">管理员</Badge>
							{:else}
								<Badge variant="secondary" class="ml-2">普通用户</Badge>
							{/if}
						</div>
						<div>
							<span class="text-sm text-muted-foreground">认证状态:</span>
							{#if user.verified}
								<Badge variant="default" class="ml-2">已认证</Badge>
							{:else}
								<Badge variant="secondary" class="ml-2">未认证</Badge>
							{/if}
						</div>
						<div>
							<span class="text-sm text-muted-foreground">注册时间:</span>
							<span class="ml-2 text-sm">{formatDate(user.created)}</span>
						</div>
						<div>
							<span class="text-sm text-muted-foreground">最后活跃:</span>
							<span class="ml-2 text-sm">{formatDate(user.updated)}</span>
						</div>
					</div>
				</div>

				<!-- 授权列表 -->
				<div class="rounded-lg border bg-card p-4">
					<div class="mb-3 flex items-center justify-between">
						<h3 class="font-semibold">授权列表 ({userLicenses.length})</h3>
						<Button size="sm" onclick={generateLicenseForUser} disabled={isGenerating}>
							{#if isGenerating}
								<Icon icon="mdi:loading" class="mr-2 h-4 w-4 animate-spin" />
								生成中...
							{:else}
								<Icon icon="mdi:key-plus" class="mr-2 h-4 w-4" />
								生成授权码
							{/if}
						</Button>
					</div>

					{#if isLoadingLicenses}
						<div class="flex items-center justify-center py-8">
							<Icon icon="mdi:loading" class="h-8 w-8 animate-spin text-muted-foreground" />
						</div>
					{:else if userLicenses.length > 0}
						<div class="space-y-2">
							{#each userLicenses as license (license.id)}
								<div class="flex items-center justify-between gap-3 rounded-md border p-3">
									<div class="flex-1 space-y-1">
										<div class="flex items-center gap-2">
											<button
												onclick={() => copyLicenseKey(license.license_key)}
												class="group flex items-center gap-1 font-mono text-sm hover:text-primary"
												title="点击复制"
											>
												<Icon
													icon="mdi:key"
													class="h-4 w-4 text-muted-foreground group-hover:text-primary"
												/>
												<span class="max-w-xs truncate">{license.license_key}</span>
												<Icon
													icon="mdi:content-copy"
													class="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100"
												/>
											</button>
										</div>
										<div class="flex gap-4 text-xs text-muted-foreground">
											{#if license.device_id}
												<span title="设备ID">
													<Icon icon="mdi:devices" class="inline h-3 w-3" />
													{license.device_id}
												</span>
											{:else}
												<span class="text-orange-500">
													<Icon icon="mdi:alert-circle" class="inline h-3 w-3" />
													未使用
												</span>
											{/if}
											<span title="购买时间">
												<Icon icon="mdi:calendar" class="inline h-3 w-3" />
												{formatDate(license.created)}
											</span>
										</div>
									</div>

									<!-- 右侧操作区 -->
									<div class="flex items-center gap-2">
										<!-- 状态标签 -->
										<Badge variant={getStatusVariant(license.status)}>
											{getStatusText(license.status)}
										</Badge>

										<!-- 封禁/解封按钮 -->
										<Button
											size="sm"
											variant={license.status === 'prohibit' ? 'outline' : 'destructive'}
											onclick={() => toggleLicenseStatus(license.id, license.status)}
											disabled={updatingLicenseId === license.id}
										>
											{#if updatingLicenseId === license.id}
												<Icon icon="mdi:loading" class="h-4 w-4 animate-spin" />
											{:else if license.status === 'prohibit'}
												<Icon icon="mdi:lock-open" class="h-4 w-4" />
												解封
											{:else}
												<Icon icon="mdi:lock" class="h-4 w-4" />
												封禁
											{/if}
										</Button>
									</div>
								</div>
							{/each}
						</div>
					{:else}
						<div class="py-8 text-center text-muted-foreground">
							<Icon icon="mdi:key-off" class="mx-auto mb-2 h-12 w-12" />
							<p>该用户暂无授权</p>
							<p class="mt-1 text-sm">点击上方按钮为用户生成授权码</p>
						</div>
					{/if}
				</div>
			</div>
		{/if}

		<Dialog.Footer>
			<Button variant="outline" onclick={onClose}>关闭</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
