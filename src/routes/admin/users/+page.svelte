<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Icon from '@iconify/svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Badge } from '$lib/components/ui/badge';
	import Avatar from '$lib/components/ui/Avatar.svelte';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
	import UserDetailModal from './UserDetailModal.svelte';

	gsap.registerPlugin(ScrollTrigger);

	const { data }: any = $props();

	let searchQuery = $state(data.search || '');
	let isSearching = $state(false);
	let selectedUser = $state<any>(null);
	let isModalOpen = $state(false);

	// 格式化日期
	function formatDate(dateString: string) {
		const date = new Date(dateString);
		return new Intl.DateTimeFormat('zh-CN', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit'
		}).format(date);
	}

	// 相对时间显示
	function timeSince(dateString: string) {
		const date = new Date(dateString);
		const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

		let interval = seconds / 31536000;
		if (interval > 1) return Math.floor(interval) + ' 年前';
		interval = seconds / 2592000;
		if (interval > 1) return Math.floor(interval) + ' 个月前';
		interval = seconds / 86400;
		if (interval > 1) return Math.floor(interval) + ' 天前';
		interval = seconds / 3600;
		if (interval > 1) return Math.floor(interval) + ' 小时前';
		interval = seconds / 60;
		if (interval > 1) return Math.floor(interval) + ' 分钟前';
		return Math.floor(seconds) + ' 秒前';
	}

	// 搜索处理
	async function handleSearch() {
		isSearching = true;
		const params = new URLSearchParams($page.url.searchParams);
		
		if (searchQuery.trim()) {
			params.set('search', searchQuery.trim());
		} else {
			params.delete('search');
		}
		params.set('page', '1'); // 重置到第一页

		await goto(`?${params.toString()}`, { replaceState: false });
		isSearching = false;
	}

	// 分页处理
	function goToPage(pageNum: number) {
		const params = new URLSearchParams($page.url.searchParams);
		params.set('page', pageNum.toString());
		goto(`?${params.toString()}`, { replaceState: false });
	}

	// 清空搜索
	function clearSearch() {
		searchQuery = '';
		handleSearch();
	}

	// 打开用户详情弹窗
	function openUserDetail(user: any) {
		selectedUser = user;
		isModalOpen = true;
	}

	// 关闭弹窗
	function closeModal() {
		isModalOpen = false;
		selectedUser = null;
	}

	// 授权生成成功回调
	function handleLicenseGenerated() {
		// 可以在这里添加刷新逻辑或显示提示
		console.log('License generated successfully');
	}

	// 动画效果
	onMount(() => {
		const items = document.querySelectorAll('.animate-item');
		gsap.from(items, {
			opacity: 0,
			y: 20,
			duration: 0.6,
			stagger: 0.1,
			ease: 'power2.out'
		});
	});
</script>

<svelte:head>
	<title>管理用户 - Maigewan CMS</title>
	<meta name="description" content="管理系统所有用户" />
</svelte:head>

<div class="container mx-auto max-w-7xl px-4 py-8">
	<!-- 页面标题 -->
	<div class="animate-item mb-8 flex items-center justify-between">
		<div>
			<h1 class="flex items-center gap-2 text-3xl font-bold">
				<Icon icon="material-symbols:supervisor-account" class="h-8 w-8 text-primary" />
				管理用户
			</h1>
			<p class="mt-2 text-muted-foreground">
				共 {data.totalItems} 个用户
			</p>
		</div>
		<Button variant="outline" onclick={() => goto('/')}>
			<Icon icon="mdi:arrow-left" class="mr-2 h-4 w-4" />
			返回首页
		</Button>
	</div>

	<!-- 搜索栏 -->
	<div class="animate-item mb-6">
		<form
			onsubmit={(e) => {
				e.preventDefault();
				handleSearch();
			}}
			class="flex gap-2"
		>
			<div class="relative flex-1">
				<Input
					type="text"
					placeholder="搜索用户名、邮箱或姓名..."
					bind:value={searchQuery}
					class="pr-10"
				/>
				{#if searchQuery}
					<button
						type="button"
						onclick={clearSearch}
						class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
					>
						<Icon icon="mdi:close-circle" class="h-5 w-5" />
					</button>
				{/if}
			</div>
			<Button type="submit" disabled={isSearching}>
				{#if isSearching}
					<Icon icon="mdi:loading" class="mr-2 h-4 w-4 animate-spin" />
				{:else}
					<Icon icon="mdi:magnify" class="mr-2 h-4 w-4" />
				{/if}
				搜索
			</Button>
		</form>
	</div>

	<!-- 用户列表 -->
	{#if data.users && data.users.length > 0}
		<div class="animate-item space-y-4">
			{#each data.users as user (user.id)}
				<div
					class="group rounded-lg border bg-card p-4 shadow-sm transition-all duration-200 hover:shadow-md"
				>
					<div class="flex items-center gap-4">
						<!-- 头像 -->
						<a href={`/users/${user.id}`} class="shrink-0">
							<div class="relative">
								<div
									class="relative flex h-12 w-12 shrink-0 overflow-hidden rounded-full transition-transform duration-300 group-hover:scale-105"
								>
									{#if user.avatar}
										<img
											src={`https://admin.maigewan.com/api/files/${user.collectionId}/${user.id}/${user.avatar}?thumb=100x100`}
											alt={user.username}
											class="aspect-square h-full w-full object-cover"
										/>
									{:else}
										<img
											src={`https://ui-avatars.com/api/?name=${user.username}&background=random`}
											alt={user.username}
											class="aspect-square h-full w-full object-cover"
										/>
									{/if}
								</div>
							</div>
						</a>

						<!-- 用户信息 -->
						<div class="min-w-0 flex-1">
							<div class="flex items-center gap-2">
								<a
									href={`/users/${user.id}`}
									class="truncate font-semibold hover:text-primary"
								>
									@{user.username}
								</a>
								{#if user.verified}
									<Icon icon="material-symbols:verified" class="h-4 w-4 text-info" />
								{/if}
								
								<!-- 角色标签 -->
								{#if user.role === 'admin'}
									<Badge variant="destructive" class="text-xs">管理员</Badge>
								{:else}
									<Badge variant="secondary" class="text-xs">普通用户</Badge>
								{/if}
							</div>
							
							<p class="truncate text-sm text-muted-foreground">
								{user.email || '未设置邮箱'}
							</p>

							{#if user.name}
								<p class="truncate text-sm text-muted-foreground">
									{user.name}
								</p>
							{/if}
						</div>

						<!-- 时间信息 -->
						<div class="hidden text-right text-sm md:block">
							<p class="text-muted-foreground" title={formatDate(user.created)}>
								注册: {timeSince(user.created)}
							</p>
							<p class="text-muted-foreground" title={formatDate(user.updated)}>
								活跃: {timeSince(user.updated)}
							</p>
						</div>

						<!-- 操作按钮 -->
						<div class="flex gap-2">
							<Button
								variant="default"
								size="sm"
								onclick={() => openUserDetail(user)}
								title="查看详情"
							>
								<Icon icon="mdi:account-details" class="mr-1 h-4 w-4" />
								详情
							</Button>
							<Button
								variant="outline"
								size="sm"
								onclick={() => goto(`/users/${user.id}`)}
								title="访问主页"
							>
								<Icon icon="mdi:eye" class="h-4 w-4" />
							</Button>
						</div>
					</div>
				</div>
			{/each}
		</div>

		<!-- 分页 -->
		{#if data.totalPages > 1}
			<div class="animate-item mt-8 flex justify-center gap-2">
				<Button
					variant="outline"
					size="sm"
					disabled={data.currentPage === 1}
					onclick={() => goToPage(data.currentPage - 1)}
				>
					<Icon icon="mdi:chevron-left" class="h-4 w-4" />
					上一页
				</Button>

				<div class="flex items-center gap-2">
					{#each Array.from({ length: Math.min(5, data.totalPages) }, (_, i) => {
						const start = Math.max(1, Math.min(data.currentPage - 2, data.totalPages - 4));
						return start + i;
					}) as pageNum}
						<Button
							variant={pageNum === data.currentPage ? 'default' : 'outline'}
							size="sm"
							onclick={() => goToPage(pageNum)}
						>
							{pageNum}
						</Button>
					{/each}
				</div>

				<Button
					variant="outline"
					size="sm"
					disabled={data.currentPage === data.totalPages}
					onclick={() => goToPage(data.currentPage + 1)}
				>
					下一页
					<Icon icon="mdi:chevron-right" class="h-4 w-4" />
				</Button>
			</div>
		{/if}
	{:else}
		<!-- 空状态 -->
		<div class="animate-item flex flex-col items-center justify-center py-16 text-center">
			<Icon icon="mdi:account-search" class="mb-4 h-24 w-24 text-muted-foreground" />
			<h3 class="mb-2 text-xl font-semibold">未找到用户</h3>
			<p class="mb-4 text-muted-foreground">
				{#if data.search}
					没有找到匹配 "{data.search}" 的用户
				{:else}
					系统中还没有任何用户
				{/if}
			</p>
			{#if data.search}
				<Button variant="outline" onclick={clearSearch}>
					清空搜索
				</Button>
			{/if}
		</div>
	{/if}
</div>

<!-- 用户详情弹窗 -->
<UserDetailModal
	user={selectedUser}
	bind:open={isModalOpen}
	onClose={closeModal}
	onLicenseGenerated={handleLicenseGenerated}
/>
