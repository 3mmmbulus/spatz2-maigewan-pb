<script lang="ts">
	import { Dialog as DialogPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	interface Props extends DialogPrimitive.DescriptionProps {
		children?: import('svelte').Snippet;
	}

	let { children, class: className, ...restProps }: Props = $props();
</script>

<DialogPrimitive.Description
	class={cn("text-muted-foreground text-sm", className)}
	{...restProps}
>
	{@render children?.()}
</DialogPrimitive.Description>

