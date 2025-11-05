<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { fade } from 'svelte/transition';
	import { Input } from '$lib/components/ui/input';
	import { registerUserSchema, type RegisterUserSchema } from '$lib/schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import Icon from '@iconify/svelte';
	import { enhance, applyAction } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import { onDestroy, onMount, tick } from 'svelte';
	import { siteInfo } from '$lib/data.js';
	interface Props {
		data: any;
	}

	let { data }: Props = $props();

	let isSubmitting = $state(false);

	const form = superForm(data.form, {
		validators: zodClient(registerUserSchema)
	});

	const { form: formData } = form;

	let gsapInstance: any;
	let ScrollTriggerInstance: any;

	const initializeAnimations = async () => {
		await tick(); // Wait for the DOM to update

		gsapInstance.from('.contact-header', {
			duration: 1,
			opacity: 0,
			y: -10,
			ease: 'power2.out',
			scrollTrigger: {
				trigger: '.contact-header',
				start: 'top 80%',
				toggleActions: 'play none none none'
			}
		});

		gsapInstance.from('.contact-form', {
			duration: 1,
			opacity: 0,
			y: 10,
			ease: 'power2.out',
			scrollTrigger: {
				trigger: '.contact-form',
				start: 'top 80%',
				toggleActions: 'play none none none'
			}
		});

		gsapInstance.from('.contact-title-icon', {
			duration: 1,
			opacity: 0,
			y: -10,
			scale: 0.8,
			ease: 'power2.out'
		});
	};

	onMount(() => {
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

<svelte:head>
	<title>注册 : {siteInfo.name}</title>
	<meta
		name="description"
		content={`注册 ${siteInfo.name} 账户,管理您的网站授权信息。`}
	/>
</svelte:head>
<div
	class="flex h-full w-full flex-col justify-center gap-5 rounded-lg p-5 sm:min-h-full md:flex-col md:justify-center md:border-none md:shadow-none"
>
	<div class="flex w-full items-center justify-center">
		<div class="w-full max-w-xs">
			<div class="contact-header flex flex-col items-start gap-2">
				<div class="flex w-full items-center justify-center gap-5">
					<div class="text-5xl font-bold">注册</div>
					<Icon icon="material-symbols:login" class="contact-title-icon text-5xl" />
				</div>
			</div>
		</div>
	</div>

	<div class="mx-auto w-full max-w-xs">
		<form
			method="POST"
			action="/auth/register?"
			class="contact-form"
			use:enhance={({ cancel }) => {
				if (isSubmitting) return cancel(); // Prevent multiple submissions
				isSubmitting = true;

				return async ({ result, update }) => {
					// console.log('Registration result:', result);
					if (result.type === 'redirect' && result.location === '/auth/login') {
						toast.success('注册成功!', {
							description: '现在您可以使用新账户登录了。'
						});
					}

					// else {
					// 	toast.error('提交失败', {
					// 		description: '请检查您的输入后重试。'
					// 	});
					// }

					await update();
					isSubmitting = false;
				};
			}}
		>
			<Form.Field {form} name="email">
				<Form.Control let:attrs>
					<Form.Label>邮箱</Form.Label>
					<Input {...attrs} bind:value={$formData.email} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="password">
				<Form.Control let:attrs>
					<Form.Label>密码</Form.Label>
					<Input {...attrs} type="password" bind:value={$formData.password} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="passwordConfirm">
				<Form.Control let:attrs>
					<Form.Label>确认密码</Form.Label>
					<Input {...attrs} type="password" bind:value={$formData.passwordConfirm} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<div class="mt-5">
				{#if $formData.password}
					<div
						in:fade={{ duration: 500 }}
						class="alert mb-2 flex rounded border border-primary p-2 text-sm"
					>
						<Icon icon="material-symbols:encrypted" class="h-10 w-10 text-primary" />
						<div class="text-left">
							您的密码将被加密保护,任何人都无法读取。
						</div>
					</div>
				{/if}

				<Form.Button disabled={isSubmitting} size="lg" class="group/sendButton w-full">
					<div class="flex items-center gap-2">
						<div>注册</div>
						<Icon
							icon={`${isSubmitting ? 'mingcute:loading-fill' : 'mdi:plus'}`}
							class={`${isSubmitting ? 'animate-spin' : ''} h-5 w-5 transition-transform duration-300 lg:group-hover/sendButton:rotate-90`}
						/>
					</div>
				</Form.Button>
			</div>

			<p class="mt-5 text-center text-sm text-muted-foreground">
				已有账户? <a
					href="/auth/login"
					class="underline underline-offset-4 hover:text-primary">登录</a
				>
			</p>
		</form>
	</div>
</div>
