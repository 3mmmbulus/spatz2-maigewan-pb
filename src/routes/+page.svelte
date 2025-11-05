<script lang="ts">
	import type { PageData } from './$types.js';
	import SpatzLanding from '$lib/components/ui/SpatzLanding.svelte';
	import { siteInfo } from '$lib/data.js';
	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
</script>

<svelte:head>
	<title>{siteInfo.name} - 专业的SEO站群优化系统</title>
	<meta
		name="description"
		content="Maigewan CMS - 专业的站群优化系统,支持Bing、百度、谷歌SEO优化,丰富的模板和自定义SEO标签功能。"
	/>
</svelte:head>

<div class="flex flex-col gap-10 md:gap-20">
	<!-- 无论是否登录,都显示首页内容 -->
	<SpatzLanding formData={data.form} />
</div>
