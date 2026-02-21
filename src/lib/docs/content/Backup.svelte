<script lang="ts">
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';

	interface Props {
		codeSnippets: Record<string, string>;
	}

	let { codeSnippets }: Props = $props();
</script>

<section id="overview" class="space-y-3">
	<h2 class="text-xl font-semibold">Overview</h2>
	<p class="text-muted-foreground">
		The backup system creates versioned snapshots of your configuration files before each write.
		If a config is deleted or broken, you can restore it from any previous snapshot.
	</p>
	<p class="text-muted-foreground">
		Backups are automatic and deduplication prevents storing identical content twice.
		Everything lives in <code>$XDG_DATA_HOME/klaudiush/backups/</code> (default
		<code>~/.local/share/klaudiush/backups/</code>) so there's one place to manage all
		your configs.
	</p>
</section>

<section id="quick-start" class="space-y-4">
	<h2 class="text-xl font-semibold">Quick start</h2>
	<p class="text-muted-foreground">
		Backups are enabled by default. You can tune behavior in <code>.klaudiush/config.toml</code>:
	</p>
	<CodeBlock html={codeSnippets.config} />
	<h3 class="text-lg font-medium">View backups</h3>
	<CodeBlock html={codeSnippets.listBackups} />
	<h3 class="text-lg font-medium">Restore a config</h3>
	<CodeBlock html={codeSnippets.restore} />
	<Callout type="tip" title="Dry run first">
		<p>Use <code>--dry-run</code> to preview what restore will do before changing anything.</p>
	</Callout>
</section>

<section id="storage" class="space-y-4">
	<h2 class="text-xl font-semibold">Storage architecture</h2>
	<p class="text-muted-foreground">
		All backups live in a centralized directory. Global config and per-project configs are
		separated into their own snapshot directories.
	</p>
	<CodeBlock html={codeSnippets.storageLayout} />
	<p class="text-muted-foreground">
		Each snapshot is a complete copy of the config file (full snapshots). A SHA256 checksum is stored
		alongside the content for integrity validation on restore.
	</p>
</section>

<section id="cli-commands" class="space-y-4">
	<h2 class="text-xl font-semibold">CLI commands</h2>
	<div class="overflow-x-auto">
		<table class="w-full text-sm">
			<thead>
				<tr class="border-b border-border">
					<th class="py-2 pr-4 text-left font-medium">Command</th>
					<th class="py-2 text-left font-medium">Description</th>
				</tr>
			</thead>
			<tbody class="text-muted-foreground">
				<tr class="border-b border-border/50"><td class="py-2 pr-4"><code>backup list</code></td><td class="py-2">List snapshots, filter by project or global</td></tr>
				<tr class="border-b border-border/50"><td class="py-2 pr-4"><code>backup create</code></td><td class="py-2">Create a manual snapshot with optional tag</td></tr>
				<tr class="border-b border-border/50"><td class="py-2 pr-4"><code>backup restore</code></td><td class="py-2">Restore from a snapshot (backs up current first)</td></tr>
				<tr class="border-b border-border/50"><td class="py-2 pr-4"><code>backup delete</code></td><td class="py-2">Delete one or more snapshots</td></tr>
				<tr class="border-b border-border/50"><td class="py-2 pr-4"><code>backup prune</code></td><td class="py-2">Remove old snapshots per retention policy</td></tr>
				<tr class="border-b border-border/50"><td class="py-2 pr-4"><code>backup status</code></td><td class="py-2">Show storage stats</td></tr>
				<tr><td class="py-2 pr-4"><code>backup audit</code></td><td class="py-2">View the audit log of operations</td></tr>
			</tbody>
		</table>
	</div>
</section>

<section id="retention" class="space-y-4">
	<h2 class="text-xl font-semibold">Retention policies</h2>
	<p class="text-muted-foreground">
		Three policies control how long snapshots are kept. When multiple policies are set,
		all must pass for a snapshot to be retained.
	</p>
	<CodeBlock html={codeSnippets.retention} />
	<p class="text-muted-foreground">
		Run <code>klaudiush backup prune --dry-run</code> to preview which snapshots would be deleted.
	</p>
</section>

<section id="deduplication" class="space-y-3">
	<h2 class="text-xl font-semibold">Deduplication</h2>
	<p class="text-muted-foreground">
		Before creating a snapshot, the system computes a SHA256 hash and checks if that hash already
		exists. If the content hasn't changed, it returns the existing snapshot ID instead of creating
		a duplicate. This keeps storage lean even with frequent auto-backups.
	</p>
</section>

<section id="doctor" class="space-y-4">
	<h2 class="text-xl font-semibold">Doctor integration</h2>
	<p class="text-muted-foreground">
		The <code>doctor</code> command checks your backup setup - directories, metadata, and checksums.
	</p>
	<CodeBlock html={codeSnippets.doctor} />
	<p class="text-muted-foreground">
		With <code>--fix</code>, doctor repairs the backup directory structure and removes corrupted snapshots.
	</p>
</section>

<style>
	code {
		background: oklch(0.96 0.005 67);
		border: 1px solid oklch(0.9 0.005 67);
		border-radius: 0.25rem;
		padding: 0.15em 0.35em;
		font-size: 0.85em;
		font-weight: 500;
		color: oklch(0.25 0.01 67);
	}
</style>
