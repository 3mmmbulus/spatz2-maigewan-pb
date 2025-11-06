<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { siteInfo } from '$lib/data.js';
	import { formatFriendlyDate, timeSince } from '$lib/utils';
	import Icon from '@iconify/svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { useSidebar } from '$lib/components/ui/sidebar/index.js';
	import { animateMainStagger } from '$lib/animations';
	import { gsap } from 'gsap';
	import ScrollIndicator from '$lib/components/ui/ScrollIndicator.svelte';

	interface Props {
		data: any;
	}

	let { data }: Props = $props();
	let sidebar = useSidebar();
	let mounted = $state(false);
	let hidden = $state(true);

	// 格式化日期
	function formatDate(dateString: string) {
		if (!dateString) return '-';
		const date = new Date(dateString);
		return date.toLocaleDateString('zh-CN', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit'
		});
	}

	// 获取登录状态徽章
	function getStatusBadge(success: boolean) {
		return success ? 'default' : 'destructive';
	}

	// 获取登录状态文本
	function getStatusText(success: boolean) {
		return success ? '成功' : '失败';
	}

	// 获取登录状态图标
	function getStatusIcon(success: boolean) {
		return success ? 'mdi:check-circle' : 'mdi:close-circle';
	}

	onMount(async () => {
		mounted = true;
		await tick();
		hidden = false;
		animateMainStagger();

		if (typeof window !== 'undefined') {
			const { ScrollTrigger } = await import('gsap/ScrollTrigger');
			gsap.registerPlugin(ScrollTrigger);

			gsap.fromTo(
				'.animate-title',
				{ opacity: 0, y: -10 },
				{
					opacity: 1,
					y: 0,
					duration: 0.5,
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
</script>

<svelte:head>
	<title>登录日志 - {siteInfo.name}</title>
	<meta name="description" content="查看您的登录历史记录和安全日志。" />
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
			<h1 class="animate-title flex items-center gap-2 text-6xl font-bold text-primary">
				<Icon icon="material-symbols:history" class="h-12 w-12" />
				<span>登录日志</span>
			</h1>
			<p class="mt-2 text-sm text-muted-foreground">
				查看您的登录历史记录和安全日志
			</p>
		</div>

		<!-- 统计信息 -->
		<div class="mb-5 grid grid-cols-1 gap-4 md:grid-cols-3">
			<div class="rounded-lg border bg-card p-4">
				<div class="flex items-center gap-2 text-muted-foreground">
					<Icon icon="mdi:login" class="h-5 w-5" />
					<span class="text-sm">总登录次数</span>
				</div>
				<p class="mt-2 text-2xl font-bold text-foreground">{data.loginLogs.length}</p>
			</div>

			<div class="rounded-lg border bg-card p-4">
				<div class="flex items-center gap-2 text-muted-foreground">
					<Icon icon="mdi:check-circle" class="h-5 w-5 text-success" />
					<span class="text-sm">成功登录</span>
				</div>
				<p class="mt-2 text-2xl font-bold text-success">
					{data.loginLogs.filter((log: any) => log.success).length}
				</p>
			</div>

			<div class="rounded-lg border bg-card p-4">
				<div class="flex items-center gap-2 text-muted-foreground">
					<Icon icon="mdi:close-circle" class="h-5 w-5 text-destructive" />
					<span class="text-sm">失败登录</span>
				</div>
				<p class="mt-2 text-2xl font-bold text-destructive">
					{data.loginLogs.filter((log: any) => !log.success).length}
				</p>
			</div>
		</div>

		<!-- 日志列表 -->
		<div class="animate-list flex flex-col">
			{#if data.loginLogs && data.loginLogs.length > 0}
				<div class="mb-3 flex items-center justify-between border-b pb-2">
					<div class="text-xl font-thin text-muted-foreground">
						登录记录: <span class="text-foreground">{data.loginLogs.length}</span>
					</div>
				</div>

				{#each data.loginLogs as log}
					<div
						class="group relative border-t p-4 transition-all duration-200 hover:bg-secondary/50"
					>
						<div class="flex items-start justify-between gap-4">
							<!-- 左侧：日志信息 -->
							<div class="flex flex-1 items-start gap-3">
								<!-- 状态图标 -->
								<div class="flex-shrink-0 pt-1">
									<Icon
										icon={getStatusIcon(log.success)}
										class={`h-6 w-6 ${log.success ? 'text-success' : 'text-destructive'}`}
									/>
								</div>

								<!-- 日志详情 -->
								<div class="flex-1 space-y-2">
									<!-- 标题行 -->
									<div class="flex items-center gap-2">
										<Badge variant={getStatusBadge(log.success)}>
											{getStatusText(log.success)}
										</Badge>
										<span class="text-sm text-muted-foreground">
											{#if mounted}
												{timeSince(formatFriendlyDate(log.created))}
											{:else}
												{formatDate(log.created)}
											{/if}
										</span>
									</div>

									<!-- IP地址 -->
									<div class="flex items-center gap-2 text-sm">
										<Icon icon="mdi:ip" class="h-4 w-4 text-muted-foreground" />
										<span class="font-mono text-foreground">{log.ip}</span>
									</div>

									<!-- 详细时间 -->
									<div class="flex items-center gap-2 text-xs text-muted-foreground">
										<Icon icon="mdi:clock-outline" class="h-3 w-3" />
										<span>{formatDate(log.created)}</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				{/each}
			{:else}
				<div
					class="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center"
				>
					<Icon icon="material-symbols:history" class="mb-4 h-16 w-16 text-muted-foreground/50" />
					<h3 class="mb-2 text-lg font-semibold">暂无登录记录</h3>
					<p class="mb-4 text-sm text-muted-foreground">您还没有任何登录历史记录</p>
				</div>
			{/if}
		</div>
	</div>
</div>
