<script lang="ts">
	import { page } from '$app/stores';
	import * as Alert from '$lib/components/ui/alert';
	import { Button } from '$lib/components/ui/button';
	import { CircleAlert } from '@lucide/svelte';
</script>

<svelte:head>
	<title>{$page.status} - klaudiush</title>
</svelte:head>

<div class="flex flex-col items-center justify-center gap-6 py-20">
	<Alert.Root variant="destructive" class="max-w-md">
		<CircleAlert class="h-4 w-4" />
		<Alert.Title>{$page.status}</Alert.Title>
		<Alert.Description>
			{$page.error?.message || 'Something went wrong'}
		</Alert.Description>
	</Alert.Root>

	<Button href="/">Back to home</Button>
</div>
