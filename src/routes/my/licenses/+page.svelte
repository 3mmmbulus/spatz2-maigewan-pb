<script lang="ts">
	import { onMount } from 'svelte';
	import { siteInfo } from '$lib/data.js';
	import { formatFriendlyDate, timeSince } from '$lib/utils';
	import Icon from '@iconify/svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { useSidebar } from '$lib/components/ui/sidebar/index.js';
	import { animateMainStagger } from '$lib/animations';

	interface Props {
		data: any;
	}

	let { data }: Props = $props();
	let sidebar = useSidebar();

	onMount(() => {
		animateMainStagger();
	});

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
			day: '2-digit'
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
</script>

<svelte:head>
	<title>我的授权 - {siteInfo.name}</title>
	<meta name="description" content="查看和管理您的 Maigewan CMS 授权许可证。" />
</svelte:head>

<div class="mx-auto max-w-5xl">
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
			<h1 class="flex items-center gap-2 text-4xl font-bold text-primary">
				<Icon icon="mdi:key-variant" class="h-10 w-10" />
				<span>我的授权</span>
			</h1>
			<p class="mt-2 text-sm text-muted-foreground">
				管理您的 Maigewan CMS 授权许可证
			</p>
		</div>

		{#if data.licenses && data.licenses.length > 0}
			<div class="grid gap-4 md:grid-cols-2">
				{#each data.licenses as license}
					<div
						class="animate-item rounded-lg border bg-card p-4 transition-all duration-300 hover:shadow-md"
					>
						<div class="mb-3 flex items-start justify-between">
							<div class="flex items-center gap-2">
								<Icon icon="mdi:key" class="h-5 w-5 text-primary" />
								<h3 class="font-semibold">授权密钥</h3>
							</div>
							<Badge variant={getStatusVariant(license.status)}>
								{getStatusText(license.status)}
							</Badge>
						</div>

						<div class="space-y-2 text-sm">
							<div class="flex items-center gap-2">
								<span class="text-muted-foreground">密钥:</span>
								<code
									class="rounded bg-muted px-2 py-1 font-mono text-xs"
									title={license.license_key}
								>
									{license.license_key?.slice(0, 20)}...
								</code>
							</div>

							{#if license.device_id}
								<div class="flex items-center gap-2">
									<Icon icon="mdi:devices" class="h-4 w-4 text-muted-foreground" />
									<span class="text-muted-foreground">设备ID:</span>
									<span class="truncate text-xs">{license.device_id}</span>
								</div>
							{/if}

							{#if license.expire_date}
								<div class="flex items-center gap-2">
									<Icon icon="mdi:calendar-clock" class="h-4 w-4 text-muted-foreground" />
									<span class="text-muted-foreground">过期时间:</span>
									<span class={isExpiringSoon(license.expire_date) ? 'text-orange-500' : ''}>
										{formatDate(license.expire_date)}
									</span>
									{#if isExpiringSoon(license.expire_date)}
										<Badge variant="outline" class="text-xs text-orange-500">即将过期</Badge>
									{/if}
								</div>
							{/if}

							{#if license.purchase_date}
								<div class="flex items-center gap-2">
									<Icon icon="mdi:cart" class="h-4 w-4 text-muted-foreground" />
									<span class="text-muted-foreground">购买时间:</span>
									<span>{formatDate(license.purchase_date)}</span>
								</div>
							{/if}

							{#if license.first_activated_at}
								<div class="flex items-center gap-2">
									<Icon icon="mdi:check-circle" class="h-4 w-4 text-muted-foreground" />
									<span class="text-muted-foreground">首次激活:</span>
									<span>{formatDate(license.first_activated_at)}</span>
								</div>
							{/if}

							{#if license.last_request_at}
								<div class="flex items-center gap-2">
									<Icon icon="mdi:clock-outline" class="h-4 w-4 text-muted-foreground" />
									<span class="text-muted-foreground">最后使用:</span>
									<span>{timeSince(formatFriendlyDate(license.last_request_at))}</span>
								</div>
							{/if}

							{#if license.note}
								<div class="mt-3 rounded bg-muted p-2">
									<div class="mb-1 flex items-center gap-1 text-xs text-muted-foreground">
										<Icon icon="mdi:note-text" class="h-3 w-3" />
										<span>备注:</span>
									</div>
									<p class="text-xs">{license.note}</p>
								</div>
							{/if}
						</div>

						<div class="mt-4 flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
							<span>创建于 {timeSince(formatFriendlyDate(license.created))}</span>
							{#if license.last_request_ip}
								<span class="flex items-center gap-1">
									<Icon icon="mdi:ip" class="h-3 w-3" />
									{license.last_request_ip}
								</span>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<div class="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
				<Icon icon="mdi:key-off" class="mb-4 h-16 w-16 text-muted-foreground/50" />
				<h3 class="mb-2 text-lg font-semibold">暂无授权</h3>
				<p class="mb-4 text-sm text-muted-foreground">
					您目前还没有任何授权许可证
				</p>
				<Button href="/contact" variant="default">
					<Icon icon="mdi:cart" class="mr-2 h-4 w-4" />
					购买授权
				</Button>
			</div>
		{/if}
	</div>
</div>
