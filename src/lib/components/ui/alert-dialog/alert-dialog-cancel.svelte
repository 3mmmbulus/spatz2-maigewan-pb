<script lang="ts">
	import { AlertDialog as AlertDialogPrimitive } from "bits-ui";
	import { buttonVariants } from "$lib/components/ui/button/index.js";
	import { cn } from "$lib/utils.js";

	interface Props extends AlertDialogPrimitive.CancelProps {
		children?: import('svelte').Snippet;
	}

	let { children, class: className, ...restProps }: Props = $props();
</script>

<AlertDialogPrimitive.Cancel
	class={cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0 pointer-events-auto cursor-pointer", className)}
	{...restProps}
>
	{#snippet child({ props })}
		<button {...props} type="button">
			{@render children?.()}
		</button>
	{/snippet}
</AlertDialogPrimitive.Cancel>


