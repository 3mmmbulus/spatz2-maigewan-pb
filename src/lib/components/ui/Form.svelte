<script lang="ts">
	import * as Form from '$lib/components/ui/form/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Textarea } from '$lib/components/ui/textarea';
	import { formSchema } from '$lib/schema';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { enhance, applyAction } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import Icon from '@iconify/svelte';
	import { animateMainStagger } from '$lib/animations';

	let { action, data }: any = $props();

	let isSubmitting: boolean = $state(false);

	const form = superForm(data, {
		validators: zodClient(formSchema)
	});

	let { form: formData } = form;

	$effect(() => {
		animateMainStagger();
	});
</script>

<div class="animate-item flex w-full items-center justify-center">
	<div class="w-full max-w-md">
		<div class="contact-header flex flex-col items-start gap-2">
			<div class="flex items-center gap-5">
				<div class="text-5xl font-bold md:text-7xl">联系我们</div>
				<Icon
					icon="material-symbols:android-chat"
					class="contact-title-icon text-5xl md:text-7xl"
				/>
			</div>
		</div>
	</div>
</div>

<div class="animate-item mx-auto w-full max-w-md">
	<form
		method="POST"
		{action}
		class="contact-form"
		use:enhance={({ cancel }) => {
			if (isSubmitting) return cancel(); // Prevent multiple submissions
			isSubmitting = true;

			return async ({ result }) => {
				if (result.type === 'success') {
					toast.success('表单提交成功！', {
						description: '我们会尽快回复您，通常在24小时内。'
					});
				} else {
					toast.error('表单提交失败', {
						description: '请检查您的输入并重试。'
					});
				}

				// await update();
				applyAction(result);
				isSubmitting = false;
			};
		}}
	>
		<div class="mb-2 flex items-center gap-2 md:gap-5">
			<Form.Field {form} name="firstName" class="w-full">
				<Form.Control let:attrs>
					<Form.Label>名字</Form.Label>
					<Input {...attrs} bind:value={$formData.firstName} />
				</Form.Control>
			</Form.Field>

			<Form.Field {form} name="lastName" class="w-full">
				<Form.Control let:attrs>
					<Form.Label>姓氏</Form.Label>
					<Input {...attrs} bind:value={$formData.lastName} />
				</Form.Control>
			</Form.Field>
		</div>

		<div class="flex items-center gap-2 md:gap-5">
			<Form.Field {form} name="firstName" class="w-full">
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="lastName" class="w-full">
				<Form.FieldErrors />
			</Form.Field>
		</div>

		<Form.Field {form} name="email">
			<Form.Control let:attrs>
				<Form.Label>邮箱</Form.Label>
				<Input {...attrs} bind:value={$formData.email} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<div class="mb-2 flex items-center gap-2 md:gap-5">
			<Form.Field {form} name={'type'} class="w-full">
				<Form.Control let:attrs>
					<Form.Label>类型</Form.Label>
					<Select.Root name="type" type="single" bind:value={$formData.type}>
						<Select.Trigger {...attrs}>
							{$formData.type}
						</Select.Trigger>
						<Select.Content>
							{#each ['问题反馈', '功能建议', '一般咨询'] as item}
								<Select.Item label={item} value={item}>{item}</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				</Form.Control>
			</Form.Field>

			<Form.Field {form} name={'priority'} class="w-full">
				<Form.Control let:attrs>
					<Form.Label>优先级</Form.Label>
					<Select.Root name="priority" type="single" bind:value={$formData.priority}>
						<Select.Trigger {...attrs}>
							{$formData.priority}
						</Select.Trigger>

						<Select.Content>
							{#each ['0', '1', '2', '3'] as item}
								<Select.Item label={item} value={item}>{item}</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				</Form.Control>
			</Form.Field>
		</div>

		<div class="flex items-start gap-2 md:gap-5">
			<Form.Field {form} name="type" class="w-full">
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="priority" class="w-full">
				<Form.FieldErrors />
			</Form.Field>
		</div>

		<Form.Field {form} name="message">
			<Form.Control let:attrs>
				<Form.Label>留言</Form.Label>
				<Textarea {...attrs} bind:value={$formData.message} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Button disabled={isSubmitting} size="lg" class="group/sendButton mt-5 w-full">
			<div class="flex items-center gap-2">
				<div>发送</div>
				<Icon
					icon={`${isSubmitting ? 'mingcute:loading-fill' : 'mdi:arrow-right'}`}
					class={`${isSubmitting ? 'animate-spin' : ''} h-5 w-5 transition-transform duration-300 lg:group-hover/sendButton:translate-x-1`}
				/>
			</div>
		</Form.Button>

		<p class="mt-5 text-center text-xs text-muted-foreground">
			点击继续即表示您同意我们的
			<a href="/terms" class="underline underline-offset-4 hover:text-primary">
				服务条款
			</a>
			和
			<a href="/privacy" class="underline underline-offset-4 hover:text-primary">
				隐私政策
			</a>
			。
		</p>
	</form>
</div>
