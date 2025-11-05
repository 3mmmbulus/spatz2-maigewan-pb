<script lang="ts">
	import { AlertDialog as AlertDialogPrimitive } from "bits-ui";
	import { buttonVariants } from "$lib/components/ui/button/index.js";
	import { cn } from "$lib/utils.js";

	type $$Props = AlertDialogPrimitive.ActionProps;

	let className: $$Props["class"] = undefined;
	export { className as class };

	interface Props extends AlertDialogPrimitive.ActionProps {
		children?: import('svelte').Snippet;
	}

	let { children, ...restProps }: Props = $props();
</script>

<AlertDialogPrimitive.Action
	class={cn(buttonVariants(), className)}
	{...restProps}
>
	{#snippet child({ props })}
		{@render children?.()}
	{/snippet}
</AlertDialogPrimitive.Action>
