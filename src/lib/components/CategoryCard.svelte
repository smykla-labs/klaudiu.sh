<script lang="ts">
	import type { CategoryInfo } from '$lib/config';
	import { Badge } from '$lib/components/ui/badge';
	import * as Card from '$lib/components/ui/card';

	interface Props {
		category: CategoryInfo;
		count: number;
	}

	let { category, count }: Props = $props();
</script>

<Card.Root class="transition-shadow hover:shadow-md">
	<Card.Header>
		<div class="flex items-center justify-between">
			<Card.Title class="text-lg">{category.name}</Card.Title>
			<Badge variant="secondary">{category.prefix}</Badge>
		</div>
		<Card.Description>{category.description}</Card.Description>
	</Card.Header>
	<Card.Content>
		<p class="text-sm text-muted-foreground">
			{count} error {count === 1 ? 'code' : 'codes'}
		</p>
	</Card.Content>
</Card.Root>
