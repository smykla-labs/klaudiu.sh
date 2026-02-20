<script lang="ts">
	import { Separator } from '$lib/components/ui/separator';
	import { siteConfig } from '$lib/config';
</script>

<footer class="mt-auto">
	<Separator />
	<div class="mx-auto max-w-5xl px-4 py-6">
		<p class="text-center text-sm text-muted-foreground">
			&copy; {new Date().getFullYear()} Smykla Skalski Labs
		</p>
	</div>
</footer>
