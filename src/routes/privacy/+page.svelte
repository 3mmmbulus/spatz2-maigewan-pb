<script>
	import { siteInfo } from '$lib/data';
	/** @type {{data: any}} */
	let { data } = $props();
</script>

<svelte:head>
	<title>隐私政策 - {siteInfo.name}</title>
	<meta name="description" content="Maigewan CMS 隐私政策,保护您的个人信息安全。" />
</svelte:head>

<main class="mx-auto max-w-4xl space-y-8 p-8">
	<h1 class="mb-4 text-3xl font-bold">隐私政策</h1>

	<p class="mb-4">最后更新时间: 2025年11月5日</p>

	<section class="space-y-4">
		<h2 class="mb-2 text-2xl font-semibold">1. 政策简介</h2>
		<p>
			欢迎使用 {siteInfo.name}！本隐私政策说明我们如何收集、使用、披露和保护您在访问我们网站时的信息。我们承诺严格遵守相关法律法规,保护您的隐私权益。
		</p>
	</section>

	<section class="space-y-4">
		<h2 class="mb-2 text-2xl font-semibold">2. 我们收集的信息</h2>
		<p>
			我们可能通过多种方式收集您的信息。我们在网站上可能收集的信息包括:
		</p>
		<ul class="ml-6 list-disc space-y-2">
			<li>
				<strong>个人信息:</strong> 当您在网站注册或参与网站相关活动时自愿提供的可识别个人身份的信息,例如您的姓名、邮寄地址、电子邮箱、电话号码,以及人口统计信息,如年龄、性别、居住地和兴趣爱好等。这些信息仅用于提供更好的CMS服务。
			</li>
			<li>
				<strong>衍生数据:</strong> 当您访问网站时,我们的服务器自动收集的信息,例如您的IP地址、浏览器类型、操作系统、访问时间,以及您在访问本网站之前和之后直接查看的页面。这些数据帮助我们改进服务质量。
			</li>
			<li>
				<strong>使用数据:</strong> 关于您如何使用 Maigewan CMS 功能的信息,包括您创建的网站数量、使用的模板类型和SEO优化设置等。这些信息帮助我们了解用户需求并改进系统功能。
			</li>
		</ul>
	</section>

	<section class="space-y-4">
		<h2 class="mb-2 text-2xl font-semibold">3. 信息使用方式</h2>
		<p>
			准确的信息能让我们为您提供流畅、高效和个性化的体验。具体而言,我们可能将通过网站收集的信息用于以下目的:
		</p>
		<ul class="ml-6 list-disc space-y-2">
			<li>回复您的表单提交和咨询请求</li>
			<li>向您的电子邮箱发送系统更新、功能介绍和服务通知</li>
			<li>为您创建个人档案,使未来访问网站时获得更个性化的体验</li>
			<li>提高网站和CMS系统的运行效率</li>
			<li>监控和分析使用情况和趋势,以改进您的网站体验</li>
			<li>提供技术支持和客户服务</li>
			<li>优化我们的SEO工具和模板库功能</li>
		</ul>
	</section>

	<section class="space-y-4">
		<h2 class="mb-2 text-2xl font-semibold">4. 信息披露说明</h2>
		<p>
			在某些情况下,我们可能会共享我们收集到的关于您的信息。您的信息可能在以下情况下被披露:
		</p>
		<ul class="ml-6 list-disc space-y-2">
			<li>
				<strong>法律要求或权利保护:</strong> 如果我们认为披露您的信息对于回应法律程序、调查或补救潜在的政策违规行为,或保护他人的权利、财产和安全是必要的,我们可能会按照任何适用的法律、规则或法规的允许或要求共享您的信息。
			</li>
			<li>
				<strong>业务转让:</strong> 在公司合并、资产出售、融资或收购我们全部或部分业务的协商过程中或完成后,我们可能会共享或转让您的信息。
			</li>
			<li>
				<strong>服务提供商:</strong> 我们可能与第三方服务提供商共享您的信息,以便他们代表我们执行服务(如托管、数据分析、技术支持等),但这些提供商仅限于在提供服务所需的范围内使用您的信息。
			</li>
		</ul>
	</section>

	<section class="space-y-4">
		<h2 class="mb-2 text-2xl font-semibold">5. 信息安全保障</h2>
		<p>
			我们采用行政、技术和物理安全措施来帮助保护您的个人信息。虽然我们已采取合理措施来保护您提供给我们的个人信息,但请注意,尽管我们付出了努力,没有任何安全措施是完美或不可攻破的,也没有任何数据传输方法可以保证不会被拦截或其他类型的滥用。
		</p>
		<p class="mt-2">
			我们的安全措施包括但不限于:
		</p>
		<ul class="ml-6 list-disc space-y-2">
			<li>使用SSL/TLS加密技术保护数据传输</li>
			<li>定期更新和修补系统安全漏洞</li>
			<li>限制员工访问个人信息的权限</li>
			<li>定期进行安全审计和风险评估</li>
		</ul>
	</section>

	<section class="space-y-4">
		<h2 class="mb-2 text-2xl font-semibold">6. 未成年人保护政策</h2>
		<p>
			我们不会故意从18岁以下的儿童那里征集信息或向其进行营销。如果我们得知在未经父母同意验证的情况下收集了18岁以下儿童的个人信息,我们将尽快删除该信息。如果您认为我们可能拥有来自或关于18岁以下儿童的任何信息,请通过以下联系方式与我们联系。
		</p>
	</section>

	<section class="space-y-4">
		<h2 class="mb-2 text-2xl font-semibold">7. 数据保留与删除</h2>
		<p>
			我们仅在实现本隐私政策中所述目的所需的时间内保留您的个人信息,除非法律要求或允许更长的保留期。当您不再需要使用我们的服务时,您可以请求删除您的账户和相关数据。
		</p>
	</section>

	<section class="space-y-4">
		<h2 class="mb-2 text-2xl font-semibold">8. 您的隐私权利</h2>
		<p>
			根据适用的数据保护法律,您可能拥有以下权利:
		</p>
		<ul class="ml-6 list-disc space-y-2">
			<li>访问和获取您的个人信息副本的权利</li>
			<li>更正不准确或不完整的个人信息的权利</li>
			<li>删除您的个人信息的权利</li>
			<li>限制或反对处理您的个人信息的权利</li>
			<li>数据可携带的权利</li>
		</ul>
	</section>

	<section class="space-y-4">
		<h2 class="mb-2 text-2xl font-semibold">9. 隐私政策变更</h2>
		<p>
			我们可能会不定期更新本隐私政策,以反映我们实践的变化或出于其他运营、法律或监管原因。任何变更将在本页面上发布,重大变更我们会通过电子邮件或网站通知的方式告知您。
		</p>
	</section>

	<section class="space-y-4">
		<h2 class="mb-2 text-2xl font-semibold">10. 联系我们</h2>
		<p>
			如果您对本隐私政策有任何疑问或意见,或希望行使您的隐私权利,请通过以下方式联系我们: <a
				href={`mailto:${siteInfo.email}`}
				class="underline hover:text-primary">{siteInfo.email}</a
			>。我们将在合理时间内回复您的请求。
		</p>
	</section>
</main>
