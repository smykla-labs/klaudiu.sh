<script lang="ts">
	import { goto } from '$app/navigation';
	import { isValidErrorCode, normalizeCode } from '$lib/errors';
	import { Input } from '$lib/components/ui/input';
	import { Search } from '@lucide/svelte';

	let query = $state('');

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && query.trim()) {
			const code = normalizeCode(query.trim());
			if (isValidErrorCode(code)) {
				goto(`/e/${code}`);
			}
		}
	}
</script>

<div class="relative">
	<Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
	<Input
		type="text"
		placeholder="Search error codes (e.g. GIT001)"
		class="pl-10"
		bind:value={query}
		onkeydown={handleKeydown}
	/>
</div>
