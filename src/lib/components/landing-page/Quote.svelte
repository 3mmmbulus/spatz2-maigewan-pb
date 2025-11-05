<script lang="ts">
	import { onDestroy, onMount, tick } from 'svelte';
	import Particles from '$lib/components/magic-ui/Particles.svelte';
	import GlobeSection from '../ui/GlobeSection.svelte';

	// 使用固定的SEO成功案例文案,而不是调用API
	let quote: string = $state(
		'通过 Maigewan CMS 专业的站群优化方案,我们的网站在百度、谷歌、Bing三大搜索引擎的排名都获得了显著提升。丰富的模板库和自定义SEO标签功能,让优化工作事半功倍。\n\n— 成功案例分享'
	);

	let theme: any = $state();

	let gsapInstance: any;
	let ScrollTriggerInstance: any;

	const initializeAnimations = () => {
		tick();

		const isLargeScreen = window.matchMedia('(min-width: 768px)').matches;
		if (isLargeScreen) {
			gsapInstance.from('.quote-animation', {
				duration: 3,
				opacity: 0,
				scale: 0.95,
				ease: 'power2.out',
				scrollTrigger: {
					trigger: '.quote-animation',
					start: 'top 90%',
					toggleActions: 'play none none none'
				}
			});
		} else {
			gsapInstance.from('.quote-animation', {
				duration: 3,
				opacity: 0,
				// y: -50,
				ease: 'power2.out',
				scrollTrigger: {
					trigger: '.quote-animation',
					start: 'top 90%',
					toggleActions: 'play none none none'
				}
			});
		}
	};

	onMount(() => {
		theme = localStorage.getItem('mode-watcher-mode');
		if (typeof window !== 'undefined') {
			import('gsap').then(({ gsap }) => {
				import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
					gsap.registerPlugin(ScrollTrigger);
					gsapInstance = gsap;
					ScrollTriggerInstance = ScrollTrigger;
					initializeAnimations();
					ScrollTriggerInstance.refresh();
				});
			});
		}
	});

	onDestroy(() => {
		if (typeof window !== 'undefined' && ScrollTriggerInstance) {
			ScrollTriggerInstance.getAll().forEach((trigger: any) => trigger.kill());
		}
	});

</script>

<div class="quote-animation relative mx-auto flex h-full min-h-[525px] w-full justify-center pt-40">
	<Particles
		className="particles-animation absolute inset-0 h-full z-0 particle-grid"
		color={`${theme === 'light' ? '#e5e5e5' : '#525252'}`}
	/>
	<div class="w-full max-w-lg text-2xl md:text-3xl">
		<div class="px-2 font-thin italic leading-normal md:px-0">
			<div>
				{#each quote.split('\n') as line}
					<span
						class={`block ${line.trim().startsWith('—') ? 'mb-5 mt-10 text-right' : ''}`}
						>{line.trim()}</span
					>
				{/each}
			</div>

			<GlobeSection />
		</div>
	</div>
</div>
