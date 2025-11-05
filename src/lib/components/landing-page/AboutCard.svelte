<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import Icon from '@iconify/svelte';
	import ParticleGrid from '$lib/components/magic-ui/ParticleGrid.svelte';

	import { onDestroy, onMount, tick } from 'svelte';

	let theme: any = $state();

	let gsapInstance: any;
	let ScrollTriggerInstance: any;
	let imageContainer: any = $state();
	let section1Container: any = $state();

	let heroHidden = $state(true);
	const initializeAnimations = () => {
		tick();
		heroHidden = false;

		gsapInstance.from('.particle-grid', {
			duration: 3,
			delay: 0.1,
			opacity: 0,
			scale: 0.95,
			y: 20,
			ease: 'power2.out',
			scrollTrigger: {
				trigger: '.section1',
				toggleActions: 'play none none none'
			}
		});

		gsapInstance.from('.section1', {
			duration: 1,
			delay: 0.1,
			opacity: 0,
			y: 20,
			ease: 'power2.out',
			scrollTrigger: {
				trigger: '.section1',
				start: 'top 80%',
				toggleActions: 'play none none none'
			}
		});

		gsapInstance.from('.section2', {
			duration: 1,
			delay: 0.1,
			opacity: 0,
			scale: 0.9,
			ease: 'power2.out',
			scrollTrigger: {
				trigger: '.section2',
				start: 'top 80%',
				toggleActions: 'play none none none'
			}
		});
	};

	const initializeObserver = () => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add('visible');
						entry.target.classList.remove('invisible');
						observer.unobserve(entry.target);
					}
				});
			},
			{
				threshold: 0.5
			}
		);

		if (imageContainer) {
			observer.observe(imageContainer);
		}

		if (section1Container) {
			observer.observe(section1Container);
		}
	};

	onMount(() => {
		// get current theme
		theme = localStorage.getItem('mode-watcher-mode');
		console.log('theme', theme);
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

			initializeObserver();
		}
	});

	onDestroy(() => {
		if (typeof window !== 'undefined' && ScrollTriggerInstance) {
			ScrollTriggerInstance.getAll().forEach((trigger: any) => trigger.kill());
		}
	});
</script>

<div
	id="about"
	class={` ${heroHidden ? 'opacity-0' : ''} relative mx-auto flex w-full max-w-5xl flex-col items-center justify-center gap-5 rounded-lg py-40 transition-all duration-300 md:flex-row md:gap-0`}
>
	{#if theme}
		<ParticleGrid
			color={`${theme === 'dark' ? '#e5e5e5' : '#171717'}`}
			className="absolute inset-0 z-0 particle-grid opacity-[15%]"
			refresh={true}
			quantity={150}
		/>
	{/if}

	<div class="flex w-full flex-col-reverse gap-20 md:flex-row md:gap-0">
		<div
			class="section1 invisible relative flex w-full justify-center"
			bind:this={section1Container}
		>
			<div class="flex w-full max-w-sm flex-col gap-5 p-5 text-center md:max-w-sm">
				<div class="text-lg font-thin italic text-foreground/80 md:text-xl">
					"Maigewan CMS 致力于为站长提供最专业的SEO优化解决方案。我们深耕搜索引擎优化多年,精通Bing、百度、谷歌等主流搜索引擎的排名算法。丰富的CMS模板、强大的SEO自定义功能,让您的网站轻松获得更好的排名。"
				</div>
				<div class="flex items-center justify-center gap-5">
					<a href="/auth/register">
						<Button
							size="lg"
							class="group/readMoreButton flex w-full items-center gap-2 md:w-fit"
							variant="outline"
						>
							<div>开始使用</div>
							<Icon
								icon="mdi:arrow-right"
								class="h-5 w-5 transition-transform duration-300 lg:group-hover/readMoreButton:translate-x-1"
							/>
						</Button>
					</a>
				</div>
			</div>
		</div>

		<div class="section2 relative flex w-full flex-col items-center justify-center">
			<div
				class="invisible relative mx-auto flex h-52 w-52 items-center justify-center rounded-lg transition-opacity duration-500 ease-in-out md:h-64 md:w-64"
				bind:this={imageContainer}
			>
				<a href="https://maigewan.com" class="">
					<img
						src="/logo.svg"
						alt="Maigewan CMS"
						class="z-10 h-full w-full object-contain p-4 shadow transition-shadow duration-300 hover:shadow-lg"
					/>
					<div class="mt-2 flex w-full justify-center text-2xl font-thin">Maigewan CMS</div>
				</a>
			</div>
		</div>
	</div>
</div>
