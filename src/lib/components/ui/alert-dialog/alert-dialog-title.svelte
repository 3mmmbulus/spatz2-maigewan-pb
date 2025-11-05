<script lang="ts">
	import { AlertDialog as AlertDialogPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	interface Props extends AlertDialogPrimitive.TitleProps {
		children?: import('svelte').Snippet;
		level?: AlertDialogPrimitive.TitleProps["level"];
	}

	let { children, class: className, level = "h3", ...restProps }: Props = $props();
</script>

<AlertDialogPrimitive.Title class={cn("text-lg font-semibold", className)} {level} {...restProps}>
	{@render children?.()}
</AlertDialogPrimitive.Title>
