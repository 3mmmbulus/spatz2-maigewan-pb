<script lang="ts">
	import type { PageData } from './$types.js';
	import Form from '$lib/components/ui/Form.svelte';
	import { siteInfo } from '$lib/data.js';
	import { useSidebar } from '$lib/components/ui/sidebar/index.js'; // Adjust the path as needed
	interface Props {
		data: PageData;
	}

	let sidebar = useSidebar();

	let { data }: Props = $props();
</script>

<svelte:head>
	<title>联系我们 : {siteInfo.name}</title>
	<meta
		name="description"
		content="联系我们了解更多关于 Maigewan CMS 的服务信息。我们致力于为客户提供专业的SEO站群优化解决方案。"
	/>
</svelte:head>
<div
	class={`${sidebar.state === 'expanded' ? 'lg:flex-row lg:justify-center lg:border lg:shadow-lg' : 'md:flex-row md:justify-center md:border md:shadow-lg'} animate-item flex w-full flex-col justify-center gap-5 rounded-lg p-5`}
>
	<Form data={data.form} action={'/contact?'} />
</div>
