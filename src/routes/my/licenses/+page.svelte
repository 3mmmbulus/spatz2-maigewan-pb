<script lang="ts">
	import { onMount, tick, onDestroy } from 'svelte';
	import { siteInfo } from '$lib/data.js';
	import { formatFriendlyDate, timeSince } from '$lib/utils';
	import Icon from '@iconify/svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { useSidebar } from '$lib/components/ui/sidebar/index.js';
	import { animateMainStagger } from '$lib/animations';
	import { gsap } from 'gsap';
	import ScrollIndicator from '$lib/components/ui/ScrollIndicator.svelte';
	import ScrollToTopButton from '$lib/components/ui/ScrollToTopButton.svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { pb } from '$lib/pocketbase';
	import { toast } from 'svelte-sonner';

	interface Props {
		data: any;
	}

	let { data }: Props = $props();
	let sidebar = useSidebar();
	let mounted = $state(false);
	let hidden = $state(true);
	let filter = $state('');
	let sortOption = $state('all');
	let showScrollToTop = $state(false);
	let copiedId = $state<string | null>(null);
	let resetDialogOpen = $state(false);
	let selectedLicense = $state<any>(null);
	let isResetting = $state(false);

	// 状态颜色映射
	function getStatusVariant(status: string) {
		switch (status) {
			case 'active':
				return 'default';
			case 'expired':
				return 'destructive';
			case 'suspended':
				return 'secondary';
			default:
				return 'outline';
		}
	}

	// 状态文本映射
	function getStatusText(status: string) {
		switch (status) {
			case 'active':
				return '激活';
			case 'expired':
				return '已过期';
			case 'suspended':
				return '已暂停';
			default:
				return status;
		}
	}

	// 格式化日期
	function formatDate(dateString: string) {
		if (!dateString) return '-';
		const date = new Date(dateString);
		return date.toLocaleDateString('zh-CN', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	// 检查是否即将过期(30天内)
	function isExpiringSoon(expireDate: string) {
		if (!expireDate) return false;
		const expire = new Date(expireDate);
		const now = new Date();
		const daysUntilExpire = Math.floor((expire.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
		return daysUntilExpire > 0 && daysUntilExpire <= 30;
	}

	// 复制授权码到剪贴板
	async function copyLicenseKey(licenseKey: string, licenseId: string) {
		try {
			await navigator.clipboard.writeText(licenseKey);
			copiedId = licenseId;
			toast.success('授权码已复制到剪贴板');
			setTimeout(() => {
				copiedId = null;
			}, 2000);
		} catch (err) {
			toast.error('复制失败，请手动复制');
		}
	}

	// 打开重置对话框
	function openResetDialog(license: any) {
		selectedLicense = license;
		resetDialogOpen = true;
	}

	// 重置设备ID
	async function resetDeviceId() {
		if (!selectedLicense) return;
		
		isResetting = true;
		try {
			await pb.collection('maigewan_licenses').update(selectedLicense.id, {
				device_id: ''
			});
			
			toast.success('设备ID已重置，您现在可以更换服务器授权');
			
			// 更新本地数据
			const index = data.licenses.findIndex((l: any) => l.id === selectedLicense.id);
			if (index !== -1) {
				data.licenses[index].device_id = '';
			}
			
			resetDialogOpen = false;
			selectedLicense = null;
		} catch (err: any) {
			console.error('重置失败:', err);
			toast.error(err.message || '重置失败，请稍后重试');
		} finally {
			isResetting = false;
		}
	}

	// 过滤和排序授权
	let filteredLicenses = $derived(
		(() => {
			let result = data.licenses.filter((license: any) =>
				license.license_key.toLowerCase().includes(filter.toLowerCase())
			);
			
			switch (sortOption) {
				case 'active':
					return result.filter((l: any) => l.status === 'active');
				case 'expired':
					return result.filter((l: any) => l.status === 'expired');
				case 'suspended':
					return result.filter((l: any) => l.status === 'suspended');
				case 'all':
				default:
					return result;
			}
		})()
	);

	const handleScroll = () => {
		const shouldShow = window.scrollY > 100;
		if (shouldShow !== showScrollToTop) {
			showScrollToTop = shouldShow;
			if (showScrollToTop) {
				gsap.to('.scroll-to-top-btn', {
					opacity: 1,
					y: 0,
					duration: 1,
					ease: 'power4.out'
				});
			} else {
				gsap.to('.scroll-to-top-btn', {
					opacity: 0,
					y: 20,
					duration: 1,
					ease: 'power4.out'
				});
			}
		}
	};

	onMount(async () => {
		mounted = true;
		await tick();
		hidden = false;
		window.addEventListener('scroll', handleScroll);
		animateMainStagger();

		if (typeof window !== 'undefined') {
			const { ScrollTrigger } = await import('gsap/ScrollTrigger');
			gsap.registerPlugin(ScrollTrigger);

			gsap.fromTo(
				'.animate-title-my',
				{ opacity: 0, y: -10 },
				{
					opacity: 1,
					y: 0,
					duration: 0.5,
					ease: 'power4.out'
				}
			);
			
			gsap.fromTo(
				'.animate-title-licenses',
				{ opacity: 0, x: -50 },
				{
					opacity: 1,
					x: 0,
					duration: 1,
					ease: 'power4.out'
				}
			);

			gsap.fromTo(
				'.animate-filter',
				{ opacity: 0, scale: 0.95 },
				{
					opacity: 1,
					scale: 1,
					duration: 1,
					ease: 'power4.out'
				}
			);

			gsap.fromTo(
				'.animate-list',
				{ opacity: 0, y: 20 },
				{
					opacity: 1,
					delay: 0.25,
					y: 0,
					duration: 1,
					ease: 'power4.out'
				}
			);

			ScrollTrigger.refresh();
		}
	});

	onDestroy(() => {
		if (typeof window !== 'undefined') {
			window.removeEventListener('scroll', handleScroll);
		}
	});
</script>

<svelte:head>
	<title>我的授权 - {siteInfo.name}</title>
	<meta name="description" content="查看和管理您的 Maigewan CMS 授权许可证。" />
</svelte:head>

<ScrollIndicator />

<div class={`${hidden ? 'opacity-0' : ''} mx-auto max-w-5xl`}>
	<Button
		onclick={() => window.history.back()}
		size="sm"
		variant="outline"
		class="group/backButton mb-5 flex items-center gap-2"
	>
		<Icon
			icon="mdi:arrow-left"
			class="h-5 w-5 transition-all duration-300 md:group-hover/backButton:-translate-x-1"
		/>
		<span class="text-sm">返回</span>
	</Button>

	<div
		class={`${sidebar.state === 'expanded' ? 'lg:border lg:p-5' : 'md:border md:p-5'} animate-item rounded-lg`}
	>
		<div class="mb-5">
			<h1 class="flex items-center gap-2 text-6xl font-bold text-primary">
				<span class="animate-title-my">我的</span>
				<span class="animate-title-licenses font-thin text-primary/50">授权</span>
			</h1>
			<p class="mt-2 text-sm text-muted-foreground">
				管理您的 Maigewan CMS 授权许可证
			</p>
		</div>

		<!-- 搜索和过滤 -->
		<div class="sticky top-[57px] z-50 mb-5 bg-background pt-2">
			<div
				class="animate-filter mb-5 flex items-center rounded-lg border bg-background px-2 focus-within:ring-0 focus-within:ring-offset-1"
			>
				<Icon icon="material-symbols:search" class="h-7 w-7" />
				<Input
					type="text"
					class="border-none p-2 outline-none focus-visible:shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
					placeholder="搜索授权密钥..."
					bind:value={filter}
				/>
			</div>

			<div class="flex items-center justify-between border-b pb-2">
				<div class="text-xl font-thin text-muted-foreground">
					{filter ? '匹配结果' : '授权总数'}:
					<span class="text-foreground">{filteredLicenses.length}</span>
				</div>

				<div class="flex items-center gap-2">
					<Button
						size="sm"
						variant={sortOption === 'all' ? 'default' : 'ghost'}
						onclick={() => (sortOption = 'all')}
						class="text-xs transition-all duration-300"
					>
						全部
						<Icon icon="mdi:format-list-bulleted" class="ml-1 h-4 w-4" />
					</Button>
					<Button
						size="sm"
						variant={sortOption === 'active' ? 'default' : 'ghost'}
						onclick={() => (sortOption = 'active')}
						class="text-xs transition-all duration-300"
					>
						激活
						<Icon
							icon="mdi:check-circle"
							class={`${sortOption === 'active' ? 'text-success' : ''} ml-1 h-4 w-4`}
						/>
					</Button>
					<Button
						size="sm"
						variant={sortOption === 'expired' ? 'default' : 'ghost'}
						onclick={() => (sortOption = 'expired')}
						class="text-xs transition-all duration-300"
					>
						过期
						<Icon
							icon="mdi:alert-circle"
							class={`${sortOption === 'expired' ? 'text-destructive' : ''} ml-1 h-4 w-4`}
						/>
					</Button>
				</div>
			</div>
		</div>

		<!-- 授权列表 -->
		<div class="animate-list flex flex-col">
			{#if filteredLicenses && filteredLicenses.length > 0}
				{#each filteredLicenses as license}
					<div
						class="license-item group relative border-t p-4 transition-all duration-200 hover:bg-secondary/50"
					>
						<div class="flex items-start justify-between gap-4">
							<!-- 左侧:授权信息 -->
							<div class="flex-1 space-y-4">
								<!-- 标题行 - 授权码 -->
								<div class="flex items-center gap-3">
									<Icon icon="mdi:key-variant" class="h-6 w-6 text-primary" />
									<div class="flex items-center gap-2">
										<code
											class="rounded bg-muted px-3 py-1.5 font-mono text-sm text-primary"
											title={license.license_key}
										>
											{license.license_key}
										</code>
										<Button
											size="sm"
											variant="ghost"
											class="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100"
											onclick={() => copyLicenseKey(license.license_key, license.id)}
										>
											{#if copiedId === license.id}
												<Icon icon="mdi:check" class="h-4 w-4 text-success" />
											{:else}
												<Icon icon="mdi:content-copy" class="h-4 w-4" />
											{/if}
										</Button>
									</div>
									<Badge variant={getStatusVariant(license.status)}>
										{getStatusText(license.status)}
									</Badge>
									{#if license.expire_date && isExpiringSoon(license.expire_date)}
										<Badge variant="outline" class="text-orange-500">
											<Icon icon="mdi:clock-alert" class="mr-1 h-3 w-3" />
											即将过期
										</Badge>
									{/if}
								</div>

								<!-- 详细信息网格 -->
								<div class="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
									<!-- 设备ID -->
									<div class="flex items-center gap-2 text-muted-foreground">
										<Icon icon="mdi:devices" class="h-4 w-4 flex-shrink-0" />
										<span class="flex-shrink-0">设备ID:</span>
										<span class="truncate text-foreground" title={license.device_id || '未绑定'}>
											{license.device_id || '未绑定'}
										</span>
									</div>

									<!-- 过期时间 -->
									<div class="flex items-center gap-2 text-muted-foreground">
										<Icon icon="mdi:calendar-clock" class="h-4 w-4 flex-shrink-0" />
										<span class="flex-shrink-0">到期时间:</span>
										<span class="text-foreground">
											{license.expire_date ? formatDate(license.expire_date) : '无限期'}
										</span>
									</div>

									<!-- 购买日期 -->
									<div class="flex items-center gap-2 text-muted-foreground">
										<Icon icon="mdi:cart" class="h-4 w-4 flex-shrink-0" />
										<span class="flex-shrink-0">购买日期:</span>
										<span class="text-foreground">
											{license.purchase_date ? formatDate(license.purchase_date) : '未记录'}
										</span>
									</div>

									<!-- 首次激活时间 -->
									<div class="flex items-center gap-2 text-muted-foreground">
										<Icon icon="mdi:check-circle" class="h-4 w-4 flex-shrink-0" />
										<span class="flex-shrink-0">首次激活:</span>
										<span class="text-foreground">
											{license.first_activated_at ? formatDate(license.first_activated_at) : '未激活'}
										</span>
									</div>

									<!-- 首次请求IP -->
									<div class="flex items-center gap-2 text-muted-foreground">
										<Icon icon="mdi:ip-network" class="h-4 w-4 flex-shrink-0" />
										<span class="flex-shrink-0">首次IP:</span>
										<span class="text-foreground">
											{license.first_request_ip || '无记录'}
										</span>
									</div>

									<!-- 最近请求IP -->
									<div class="flex items-center gap-2 text-muted-foreground">
										<Icon icon="mdi:ip" class="h-4 w-4 flex-shrink-0" />
										<span class="flex-shrink-0">最近IP:</span>
										<span class="text-foreground">
											{license.last_request_ip || '无记录'}
										</span>
									</div>

									<!-- 最近请求时间 -->
									<div class="flex items-center gap-2 text-muted-foreground md:col-span-2">
										<Icon icon="mdi:clock-outline" class="h-4 w-4 flex-shrink-0" />
										<span class="flex-shrink-0">最近使用:</span>
										<span class="text-foreground">
											{#if license.last_request_at}
												{#if mounted}
													{timeSince(formatFriendlyDate(license.last_request_at))}
												{:else}
													{formatDate(license.last_request_at)}
												{/if}
											{:else}
												从未使用
											{/if}
										</span>
									</div>
								</div>

								<!-- 备注 -->
								{#if license.note}
									<div class="rounded border border-muted bg-muted/30 p-3">
										<div class="mb-1 flex items-center gap-1 text-xs text-muted-foreground">
											<Icon icon="mdi:note-text" class="h-3 w-3" />
											<span>备注:</span>
										</div>
										<p class="text-sm text-foreground">{license.note}</p>
									</div>
								{/if}

								<!-- 底部时间戳 -->
								<div class="flex items-center gap-4 border-t pt-3 text-xs text-muted-foreground">
									<div class="flex items-center gap-1">
										<Icon icon="mdi:clock-plus" class="h-3 w-3" />
										<span>
											创建于
											{#if mounted}
												{timeSince(formatFriendlyDate(license.created))}
											{:else}
												{formatDate(license.created)}
											{/if}
										</span>
									</div>
									{#if license.updated !== license.created}
										<div class="flex items-center gap-1">
											<Icon icon="mdi:clock-edit" class="h-3 w-3" />
											<span>
												更新于
												{#if mounted}
													{timeSince(formatFriendlyDate(license.updated))}
												{:else}
													{formatDate(license.updated)}
												{/if}
											</span>
										</div>
									{/if}
								</div>
							</div>

							<!-- 右侧:操作按钮 -->
							<div class="flex flex-col gap-2">
								<Button
									size="sm"
									variant="outline"
									class="gap-2 whitespace-nowrap"
									onclick={() => openResetDialog(license)}
									disabled={!license.device_id}
								>
									<Icon icon="mdi:refresh" class="h-4 w-4" />
									重置设备
								</Button>
							</div>
						</div>
					</div>
				{/each}
			{:else}
				<div class="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
					<Icon icon="mdi:key-off" class="mb-4 h-16 w-16 text-muted-foreground/50" />
					<h3 class="mb-2 text-lg font-semibold">
						{filter ? '未找到匹配的授权' : '暂无授权'}
					</h3>
					<p class="mb-4 text-sm text-muted-foreground">
						{filter ? '尝试使用其他关键词搜索' : '您目前还没有任何授权许可证'}
					</p>
					{#if !filter}
						<Button href="/contact" variant="default">
							<Icon icon="mdi:cart" class="mr-2 h-4 w-4" />
							购买授权
						</Button>
					{/if}
				</div>
			{/if}
		</div>
	</div>
</div>

<!-- 重置设备ID确认对话框 -->
<AlertDialog.Root bind:open={resetDialogOpen}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title class="flex items-center gap-2">
				<Icon icon="mdi:alert-circle" class="h-5 w-5 text-orange-500" />
				确认重置授权码?
			</AlertDialog.Title>
			<AlertDialog.Description class="space-y-2">
				<p>重置后您可以更换服务器授权!</p>
				{#if selectedLicense}
					<div class="mt-4 rounded-lg border bg-muted/30 p-3">
						<div class="mb-2 text-xs text-muted-foreground">当前授权信息:</div>
						<div class="space-y-1 text-sm">
							<div class="flex items-center gap-2">
								<Icon icon="mdi:key-variant" class="h-4 w-4" />
								<code class="text-xs">{selectedLicense.license_key}</code>
							</div>
							{#if selectedLicense.device_id}
								<div class="flex items-center gap-2">
									<Icon icon="mdi:devices" class="h-4 w-4" />
									<span class="text-xs text-muted-foreground">设备: {selectedLicense.device_id}</span>
								</div>
							{/if}
						</div>
					</div>
				{/if}
				<p class="text-xs text-muted-foreground">
					注意: 重置后原设备将无法继续使用此授权，您需要重新激活。
				</p>
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel disabled={isResetting}>取消</AlertDialog.Cancel>
			<AlertDialog.Action
				onclick={resetDeviceId}
				disabled={isResetting}
				class="bg-orange-500 hover:bg-orange-600"
			>
				{#if isResetting}
					<Icon icon="mdi:loading" class="mr-2 h-4 w-4 animate-spin" />
					重置中...
				{:else}
					<Icon icon="mdi:refresh" class="mr-2 h-4 w-4" />
					确认重置
				{/if}
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>

{#if showScrollToTop === true}
	<div class="flex justify-center">
		<ScrollToTopButton />
	</div>
{/if}
