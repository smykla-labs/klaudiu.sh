<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import DocSidebar from '$lib/components/DocSidebar.svelte';
	import { Button } from '$lib/components/ui/button';
	import {
		ArrowLeft,
		FileSliders,
		Archive,
		Settings,
		ShieldOff,
		Puzzle,
		type IconProps
	} from '@lucide/svelte';
	import type { Component } from 'svelte';

	let { data } = $props();

	const iconMap: Record<string, Component<IconProps>> = {
		FileSliders,
		Archive,
		Settings,
		ShieldOff,
		Puzzle
	};
</script>

<svelte:head>
	<title>Examples - klaudiush</title>
</svelte:head>

<div class="flex gap-10">
	<DocSidebar />

	<div class="min-w-0 flex-1 space-y-8">
		<div>
			<Button variant="ghost" href="/docs/" class="mb-4 gap-2 pl-2">
				<ArrowLeft class="h-4 w-4" />
				All docs
			</Button>
		</div>

		<div class="space-y-1">
			<h1 class="text-2xl font-bold tracking-tight">Examples</h1>
			<p class="text-lg text-muted-foreground">
				Ready-to-use configs and reference implementations.
			</p>
		</div>

		{#each data.groups as group (group.key)}
			{@const groupCategories = data.categories.filter((c) => c.group === group.key)}
			{#if groupCategories.length > 0}
				<section class="space-y-4">
					<h2 class="text-lg font-semibold">{group.title}</h2>
					<div class="grid gap-4 sm:grid-cols-2">
						{#each groupCategories as category (category.slug)}
							{@const Icon = iconMap[category.icon]}
							<a href="/docs/examples/{category.slug}" class="block h-full no-underline">
								<Card.Root class="h-full cursor-pointer transition-shadow hover:shadow-md">
									<Card.Header class="pb-3">
										<div class="flex items-center gap-2">
											{#if Icon}
												<Icon class="h-5 w-5 text-muted-foreground" />
											{/if}
											<Card.Title class="text-base">{category.title}</Card.Title>
											<span
												class="ml-auto rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
											>
												{category.fileCount} {category.fileCount === 1 ? 'file' : 'files'}
											</span>
										</div>
										<Card.Description>{category.subtitle}</Card.Description>
									</Card.Header>
									<Card.Content>
										<p class="line-clamp-2 text-sm text-muted-foreground">
											{category.description}
										</p>
									</Card.Content>
								</Card.Root>
							</a>
						{/each}
					</div>
				</section>
			{/if}
		{/each}
	</div>
</div>
