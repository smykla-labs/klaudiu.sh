<script lang="ts">
	import type { AdrInfo } from '$lib/docs';
	import { Badge } from '$lib/components/ui/badge';
	import * as Card from '$lib/components/ui/card';

	interface Props {
		adr: AdrInfo;
	}

	let { adr }: Props = $props();

	const statusVariant = $derived(
		adr.status === 'accepted' ? 'default' : adr.status === 'deprecated' ? 'destructive' : 'secondary'
	);
</script>

<a href="/docs/adr/{adr.id}" class="block h-full no-underline">
	<Card.Root class="h-full cursor-pointer transition-shadow hover:shadow-md">
		<Card.Header class="pb-3">
			<div class="flex items-center justify-between">
				<Card.Title class="font-mono text-base">ADR-{adr.id}</Card.Title>
				<Badge variant={statusVariant}>{adr.status}</Badge>
			</div>
			<Card.Description class="line-clamp-2 h-[3em]">{adr.title}</Card.Description>
		</Card.Header>
		<Card.Content>
			<p class="text-xs text-muted-foreground">{adr.date}</p>
		</Card.Content>
	</Card.Root>
</a>
