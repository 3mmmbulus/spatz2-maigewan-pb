<script lang="ts">
	import { siteInfo } from '$lib/data';
	interface Props {
		data: any;
	}

	let { data }: Props = $props();
</script>

<svelte:head>
	<title>服务条款 - {siteInfo.name}</title>
	<meta name="description" content="Maigewan CMS 服务条款,规范使用我们的内容管理系统。" />
</svelte:head>

<main class="mx-auto max-w-4xl p-8">
	<h1 class="mb-4 text-3xl font-bold">服务条款</h1>

	<p class="mb-4">最后更新时间: 2025年11月5日</p>

	<section class="mt-8">
		<h2 class="mb-2 text-2xl font-semibold">1. 服务简介</h2>
		<p>
			欢迎使用 {siteInfo.name}！本服务条款规范您对我们网站和内容管理系统的使用。访问或使用我们的服务即表示您同意遵守这些条款。Maigewan CMS 是一个专业的网站内容管理系统,旨在帮助用户合法、规范地管理网站内容并进行搜索引擎优化。
		</p>
	</section>

	<section class="mt-8">
		<h2 class="mb-2 text-2xl font-semibold">2. 用户信息收集</h2>
		<p>
			当您填写我们的表单时,我们会收集您提供的个人信息,包括但不限于姓名、电子邮箱、联系方式和留言内容。我们承诺严格保护您的个人隐私,所收集的信息仅用于提供更好的服务。
		</p>
	</section>

	<section class="mt-8">
		<h2 class="mb-2 text-2xl font-semibold">3. 信息使用说明</h2>
		<p>
			我们使用收集的信息来回复您的咨询、提供CMS服务、改进我们的网站功能。我们可能会使用您的信息向您发送系统更新、功能介绍和服务通知。我们不会将您的信息用于任何非法或不当用途。
		</p>
	</section>

	<section class="mt-8">
		<h2 class="mb-2 text-2xl font-semibold">4. 合法使用承诺</h2>
		<p>
			使用 Maigewan CMS 的用户必须承诺:
		</p>
		<ul class="ml-6 mt-2 list-disc space-y-2">
			<li>仅将本系统用于合法、正当的网站内容管理和SEO优化</li>
			<li>不得使用本系统发布、传播任何违反法律法规的内容</li>
			<li>不得利用本系统进行任何形式的网络欺诈、诈骗或其他非法活动</li>
			<li>不得使用本系统发布色情、暴力、赌博等违法违规内容</li>
			<li>遵守搜索引擎的服务条款和网站管理规范</li>
			<li>尊重知识产权,不得侵犯他人版权和商标权</li>
		</ul>
	</section>

	<section class="mt-8">
		<h2 class="mb-2 text-2xl font-semibold">5. 信息共享政策</h2>
		<p>
			我们不会与第三方共享您的个人信息,除非在以下情况下:
		</p>
		<ul class="ml-6 mt-2 list-disc space-y-2">
			<li>为提供服务所必需</li>
			<li>法律法规要求披露</li>
			<li>保护我们或他人的合法权益所必需</li>
			<li>经您明确授权同意</li>
		</ul>
	</section>

	<section class="mt-8">
		<h2 class="mb-2 text-2xl font-semibold">6. 信息安全保护</h2>
		<p>
			我们采取合理的技术和管理措施来保护您提供的信息,防止未经授权的访问、使用或泄露。我们使用加密技术保护敏感数据,并定期审查我们的安全措施。
		</p>
	</section>

	<section class="mt-8">
		<h2 class="mb-2 text-2xl font-semibold">7. 服务限制与终止</h2>
		<p>
			如果我们发现用户违反本服务条款,特别是将系统用于非法目的,我们有权立即终止服务并保留追究法律责任的权利。我们致力于维护健康、合法的网络环境。
		</p>
	</section>

	<section class="mt-8">
		<h2 class="mb-2 text-2xl font-semibold">8. 条款变更通知</h2>
		<p>
			我们可能会不定期更新这些服务条款。任何变更都将通过在网站上发布新条款的方式通知您。继续使用我们的服务即表示您接受更新后的条款。
		</p>
	</section>

	<section class="mt-8">
		<h2 class="mb-2 text-2xl font-semibold">9. 联系我们</h2>
		<p>
			如果您对本服务条款有任何疑问,或需要报告违规行为,请通过以下方式联系我们: <a
				href={`mailto:${siteInfo.email}`}
				class="underline hover:text-primary">{siteInfo.email}</a
			>。我们将在收到您的咨询后尽快回复。
		</p>
	</section>
</main>
