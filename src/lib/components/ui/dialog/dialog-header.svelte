<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "$lib/utils.js";

	interface Props extends HTMLAttributes<HTMLDivElement> {
		children?: import('svelte').Snippet;
	}

	let { children, class: className, ...restProps }: Props = $props();
</script>

<div class={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...restProps}>
	{@render children?.()}
</div>

