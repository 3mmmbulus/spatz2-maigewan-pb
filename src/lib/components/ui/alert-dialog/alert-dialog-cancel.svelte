<script lang="ts">
	import { AlertDialog as AlertDialogPrimitive } from "bits-ui";
	import { buttonVariants } from "$lib/components/ui/button/index.js";
	import { cn } from "$lib/utils.js";

	type $$Props = AlertDialogPrimitive.CancelProps;

	let className: $$Props["class"] = undefined;
	export { className as class };

	interface Props extends AlertDialogPrimitive.CancelProps {
		children?: import('svelte').Snippet;
	}

	let { children, ...restProps }: Props = $props();
</script>

<AlertDialogPrimitive.Cancel
	class={cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0", className)}
	{...restProps}
>
	{#snippet child({ props })}
		{@render children?.()}
	{/snippet}
</AlertDialogPrimitive.Cancel>
