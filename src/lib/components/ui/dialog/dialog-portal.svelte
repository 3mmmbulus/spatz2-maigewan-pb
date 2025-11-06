<script lang="ts">
	import { Dialog as DialogPrimitive } from "bits-ui";
	
	interface Props extends DialogPrimitive.PortalProps {
		children?: import('svelte').Snippet;
	}

	let { children, ...restProps }: Props = $props();
</script>

<DialogPrimitive.Portal {...restProps}>
	{@render children?.()}
</DialogPrimitive.Portal>

