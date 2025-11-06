<script lang="ts">
	import { Dialog as DialogPrimitive } from "bits-ui";
	import { fade } from "svelte/transition";
	import { cn } from "$lib/utils.js";

	interface Props extends DialogPrimitive.OverlayProps {
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

<DialogPrimitive.Overlay
	{transition}
	{transitionConfig}
	class={cn("bg-background/80 fixed inset-0 z-40 backdrop-blur-sm pointer-events-none", className)}
	{...restProps}
/>

