<script lang="ts">
	import type { GuideInfo } from '$lib/docs';
	import * as Card from '$lib/components/ui/card';
	import {
		Settings,
		Archive,
		Puzzle,
		Activity,
		ShieldOff,
		type IconProps
	} from '@lucide/svelte';
	import type { Component } from 'svelte';

	interface Props {
		guide: GuideInfo;
	}

	let { guide }: Props = $props();

	const iconMap: Record<string, Component<IconProps>> = {
		Settings,
		Archive,
		Puzzle,
		Activity,
		ShieldOff
	};

	const Icon = $derived(iconMap[guide.icon]);
</script>

<a href="/docs/{guide.slug}" class="block no-underline">
	<Card.Root class="cursor-pointer transition-shadow hover:shadow-md">
		<Card.Header class="pb-3">
			<div class="flex items-center gap-2">
				{#if Icon}
					<Icon class="h-5 w-5 text-muted-foreground" />
				{/if}
				<Card.Title class="text-base">{guide.title}</Card.Title>
			</div>
			<Card.Description>{guide.subtitle}</Card.Description>
		</Card.Header>
		<Card.Content>
			<p class="text-sm text-muted-foreground">{guide.description}</p>
		</Card.Content>
	</Card.Root>
</a>
