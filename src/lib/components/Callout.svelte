<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Info, AlertTriangle, Lightbulb } from '@lucide/svelte';
	import type { Component } from 'svelte';
	import type { IconProps } from '@lucide/svelte';

	interface Props {
		type?: 'info' | 'warning' | 'tip';
		title?: string;
		children: Snippet;
	}

	let { type = 'info', title, children }: Props = $props();

	const config: Record<string, { icon: Component<IconProps>; border: string; bg: string }> = {
		info: { icon: Info, border: 'border-l-blue-400', bg: 'bg-blue-50/50' },
		warning: { icon: AlertTriangle, border: 'border-l-amber-400', bg: 'bg-amber-50/50' },
		tip: { icon: Lightbulb, border: 'border-l-emerald-400', bg: 'bg-emerald-50/50' }
	};

	const current = $derived(config[type]);
	const Icon = $derived(current.icon);
</script>

<div class="my-4 rounded-r-lg border border-l-4 {current.border} {current.bg} p-4">
	<div class="flex items-start gap-3">
		<Icon class="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
		<div class="min-w-0 text-sm">
			{#if title}
				<p class="mb-1 font-medium">{title}</p>
			{/if}
			<div class="text-muted-foreground [&_p]:my-1">
				{@render children()}
			</div>
		</div>
	</div>
</div>
