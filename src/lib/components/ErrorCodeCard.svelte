<script lang="ts">
	import type { ErrorCategory } from '$lib/config';
	import { Badge } from '$lib/components/ui/badge';
	import * as Card from '$lib/components/ui/card';

	interface Props {
		code: string;
		title: string;
		category: ErrorCategory;
	}

	let { code, title, category }: Props = $props();
</script>

<a href="/e/{code}" class="block">
	<Card.Root class="transition-shadow hover:shadow-md">
		<Card.Header class="pb-3">
			<div class="flex items-center gap-2">
				<Card.Title class="font-mono text-base">{code}</Card.Title>
				<Badge variant="outline" class="text-xs">{category}</Badge>
			</div>
		</Card.Header>
		<Card.Content>
			<p class="text-sm text-muted-foreground">{title}</p>
		</Card.Content>
	</Card.Root>
</a>
