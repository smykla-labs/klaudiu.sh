<script lang="ts">
	import { siteConfig } from '$lib/config';
	import { Github } from '@lucide/svelte';
	import { Separator } from '$lib/components/ui/separator';
</script>

<nav class="border-b border-border bg-background">
	<div class="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
		<a href="/" class="font-mono text-lg font-bold tracking-tight">{siteConfig.name}</a>
		<div class="flex items-center gap-4">
			<a href="/docs/" class="text-sm text-muted-foreground hover:text-foreground">Docs</a>
			<a href="/e/" class="text-sm text-muted-foreground hover:text-foreground">Errors</a>
			<Separator orientation="vertical" class="h-4" />
			<a
				href={siteConfig.github}
				target="_blank"
				rel="noopener noreferrer"
				class="text-muted-foreground hover:text-foreground"
			>
				<Github class="h-5 w-5" />
			</a>
		</div>
	</div>
</nav>
