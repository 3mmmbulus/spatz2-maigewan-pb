<script lang="ts">
	import { AlertDialog as AlertDialogPrimitive } from "bits-ui";
	import * as AlertDialog from "./index.js";
	import { cn, flyAndScale } from "$lib/utils.js";

	interface Props extends AlertDialogPrimitive.ContentProps {
		children?: import('svelte').Snippet;
		transition?: AlertDialogPrimitive.ContentProps["transition"];
		transitionConfig?: AlertDialogPrimitive.ContentProps["transitionConfig"];
	}

	let { 
		children, 
		class: className, 
		transition = flyAndScale, 
		transitionConfig = undefined,
		...restProps 
	}: Props = $props();
</script>

<AlertDialog.Portal>
	<AlertDialog.Overlay />
	<AlertDialogPrimitive.Content
		{transition}
		{transitionConfig}
		class={cn(
			"bg-background fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border p-6 shadow-lg sm:rounded-lg md:w-full pointer-events-auto",
			className
		)}
		{...restProps}
	>
		{@render children?.()}
	</AlertDialogPrimitive.Content>
</AlertDialog.Portal>

