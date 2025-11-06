<script lang="ts">
	import { AlertDialog as AlertDialogPrimitive } from "bits-ui";

	interface Props extends AlertDialogPrimitive.PortalProps {
		children?: import('svelte').Snippet;
	}

	let { children, ...restProps }: Props = $props();
</script>

<AlertDialogPrimitive.Portal {...restProps}>
	{@render children?.()}
</AlertDialogPrimitive.Portal>

