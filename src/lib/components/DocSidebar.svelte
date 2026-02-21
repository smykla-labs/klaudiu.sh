<script lang="ts">
	import { page } from '$app/stores';
	import { guides } from '$lib/docs';
	import { onMount } from 'svelte';

	interface TocEntry {
		id: string;
		label: string;
	}

	interface Props {
		toc?: TocEntry[];
	}

	let { toc = [] }: Props = $props();

	let activeId = $state('');

	onMount(() => {
		if (toc.length === 0) return;

		const ids = toc.map((e) => e.id);

		const onScroll = () => {
			const offset = 96; // approximate navbar + breathing room
			let current = ids[0] ?? '';
			for (const id of ids) {
				const el = document.getElementById(id);
				if (el && el.getBoundingClientRect().top <= offset) {
					current = id;
				}
			}
			activeId = current;
		};

		window.addEventListener('scroll', onScroll, { passive: true });
		onScroll();

		return () => window.removeEventListener('scroll', onScroll);
	});
</script>

<aside class="hidden w-56 shrink-0 lg:block">
	<nav class="sticky top-8 space-y-6">
		<div>
			<p class="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
				Guides
			</p>
			<ul class="space-y-1">
				{#each guides as guide (guide.slug)}
					{@const active = $page.url.pathname === `/docs/${guide.slug}`}
					<li>
						<a
							href="/docs/{guide.slug}"
							class="block rounded-md px-2 py-1.5 text-sm transition-colors
								{active
								? 'bg-accent font-medium text-accent-foreground'
								: 'text-muted-foreground hover:text-foreground'}"
						>
							{guide.title}
						</a>
					</li>
				{/each}
			</ul>
		</div>

		<div>
			<p class="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
				Other
			</p>
			<ul class="space-y-1">
				<li>
					<a
						href="/docs/changelog"
						class="block rounded-md px-2 py-1.5 text-sm transition-colors
							{$page.url.pathname === '/docs/changelog'
							? 'bg-accent font-medium text-accent-foreground'
							: 'text-muted-foreground hover:text-foreground'}"
					>
						Changelog
					</a>
				</li>
				<li>
					<a
						href="/docs/examples/"
						class="block rounded-md px-2 py-1.5 text-sm transition-colors
							{$page.url.pathname.startsWith('/docs/examples')
							? 'bg-accent font-medium text-accent-foreground'
							: 'text-muted-foreground hover:text-foreground'}"
					>
						Examples
					</a>
				</li>
				<li>
					<a
						href="/docs/adr/"
						class="block rounded-md px-2 py-1.5 text-sm transition-colors
							{$page.url.pathname.startsWith('/docs/adr')
							? 'bg-accent font-medium text-accent-foreground'
							: 'text-muted-foreground hover:text-foreground'}"
					>
						ADRs
					</a>
				</li>
			</ul>
		</div>

		{#if toc.length > 0}
			<div>
				<p class="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
					On this page
				</p>
				<ul class="space-y-1">
					{#each toc as entry (entry.id)}
						{@const active = activeId === entry.id}
						<li>
							<a
								href="#{entry.id}"
								class="block px-2 py-1 text-xs transition-colors
									{active
									? 'font-medium text-foreground'
									: 'text-muted-foreground hover:text-foreground'}"
							>
								{entry.label}
							</a>
						</li>
					{/each}
				</ul>
			</div>
		{/if}
	</nav>
</aside>
