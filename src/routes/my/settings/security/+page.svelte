<script lang="ts">
	import Input from '$lib/components/ui/Input.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import Icon from '@iconify/svelte';
	interface Props {
		form: any;
	}

	let { form }: Props = $props();
</script>

<div class="flex h-full w-full flex-col">
	<div class="w-full">
		<form action="?/updatePassword" method="POST" class="flex w-full flex-col space-y-2">
			<div class="text-2xl font-bold lowercase sm:text-3xl md:text-5xl">修改密码</div>
			<div class="divider"></div>
			<Input
				id="oldPassword"
				type="password"
				required
				errors={form?.errors?.oldPassword}
				placeholder="当前密码"
			/>
			<Input
				id="password"
				type="password"
				required
				errors={form?.errors?.password}
				placeholder="新密码"
			/>
			<Input
				id="passwordConfirm"
				type="password"
				required
				errors={form?.errors?.passwordConfirm}
				placeholder="确认密码"
			/>

			<div class="">
				<a href="/auth/reset-password">忘记密码？</a>
				<div class="mt-2 w-full max-w-lg">
					<Button variant="success" class="flex items-center gap-2 lowercase" type="submit">
						<Icon icon="material-symbols:sync" class="h-5 w-5" />
						<div>更新密码</div>
					</Button>
				</div>
			</div>
		</form>
	</div>
</div>
