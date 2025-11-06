<script lang="ts">
	import { AlertDialog as AlertDialogPrimitive } from "bits-ui";
	import { fade } from "svelte/transition";
	import { cn } from "$lib/utils.js";

	interface Props extends AlertDialogPrimitive.OverlayProps {
		transition?: typeof fade;
		transitionConfig?: { duration: number };
	}

	let {
		class: className,
		transition = fade,
		transitionConfig = { duration: 150 },
		...restProps
	}: Props = $props();
</script>

<AlertDialogPrimitive.Overlay
	{transition}
	{transitionConfig}
	class={cn("bg-background/80 fixed inset-0 z-40 backdrop-blur-sm pointer-events-none", className)}
	{...restProps}
/>
