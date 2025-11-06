<script lang="ts">
	import { Dialog as DialogPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	interface Props extends DialogPrimitive.TitleProps {
		children?: import('svelte').Snippet;
	}

	let { children, class: className, ...restProps }: Props = $props();
</script>

<DialogPrimitive.Title
	class={cn("text-lg font-semibold leading-none tracking-tight", className)}
	{...restProps}
>
	{@render children?.()}
</DialogPrimitive.Title>

