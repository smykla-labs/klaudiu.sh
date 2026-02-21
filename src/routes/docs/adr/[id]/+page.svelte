<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import DocSidebar from '$lib/components/DocSidebar.svelte';
	import { ArrowLeft } from '@lucide/svelte';

	let { data } = $props();

	const statusVariant = $derived(
		data.adr.status === 'accepted'
			? 'default'
			: data.adr.status === 'deprecated'
				? 'destructive'
				: 'secondary'
	);
</script>

<svelte:head>
	<title>ADR-{data.adr.id}: {data.adr.title} - klaudiush</title>
</svelte:head>

<div class="flex gap-10">
	<DocSidebar />

	<div class="min-w-0 flex-1 space-y-8">
		<div>
			<Button variant="ghost" href="/docs/adr/" class="mb-4 gap-2 pl-2">
				<ArrowLeft class="h-4 w-4" />
				All ADRs
			</Button>
		</div>

		<div class="space-y-1">
			<div class="flex items-center gap-3">
				<h1 class="font-mono text-2xl font-bold">ADR-{data.adr.id}</h1>
				<Badge variant={statusVariant}>{data.adr.status}</Badge>
			</div>
			<p class="text-lg text-muted-foreground">{data.adr.title}</p>
			<p class="text-sm text-muted-foreground">{data.adr.date}</p>
		</div>

		{#if data.adr.id === '0001'}
			<div class="space-y-6 text-sm leading-relaxed text-muted-foreground">
				<section class="space-y-3">
					<h2 class="text-xl font-semibold text-foreground">Context</h2>
					<p>
						klaudiush originally communicated validation failures by writing formatted text to
						stderr and exiting with code 2. This had two problems:
					</p>
					<ol class="list-decimal space-y-2 pl-6">
						<li>
							Claude Code conflates exit-code-2 hook blocks with user permission denials, causing the
							model to stop and ask the user for approval instead of fixing the error and retrying.
						</li>
						<li>
							Using <code>systemMessage</code> alone (without <code>permissionDecisionReason</code>)
							means Claude receives only a generic "Hook denied this tool" message and never sees the
							actual validation error.
						</li>
					</ol>
				</section>

				<section class="space-y-3">
					<h2 class="text-xl font-semibold text-foreground">Decision</h2>
					<p>
						Switch entirely to JSON stdout, always exit 0. Exit code 2 is removed. Only exit 3
						(crash/panic) remains non-zero.
					</p>
					<p>
						The JSON structure uses <code>permissionDecision</code> (<code>"allow"</code> or
						<code>"deny"</code>), <code>permissionDecisionReason</code> with the error code and fix hint
						for Claude to self-correct, and <code>additionalContext</code> to tell Claude this is an
						automated check, not a user denial.
					</p>
				</section>

				<section class="space-y-3">
					<h2 class="text-xl font-semibold text-foreground">Consequences</h2>
					<p>
						Claude sees the actual error and fix hint, enabling self-correction. Exception bypasses
						are cleaner: <code>"allow"</code> with context instead of block-then-convert. Single
						exit code eliminates the conflation with user permission denials.
					</p>
					<p>
						Any external tooling that checked for exit code 2 must be updated to parse JSON stdout.
					</p>
				</section>
			</div>
		{:else if data.adr.id === '0002'}
			<div class="space-y-6 text-sm leading-relaxed text-muted-foreground">
				<section class="space-y-3">
					<h2 class="text-xl font-semibold text-foreground">Context</h2>
					<p>
						All klaudiush file paths were hardcoded to <code>~/.klaudiush/</code> or
						<code>~/.claude/hooks/</code>. Each component (exceptions, crashdump, patterns, plugins)
						had its own tilde expansion code - five duplicate implementations across the codebase with
						no single place managing paths.
					</p>
					<p>
						The <a
							href="https://specifications.freedesktop.org/basedir-spec/latest/"
							class="underline">XDG Base Directory Specification</a
						> is the standard convention for organizing user-level files by purpose (config vs data vs
						state vs cache). Most CLI tools on Linux and macOS follow it.
					</p>
				</section>

				<section class="space-y-3">
					<h2 class="text-xl font-semibold text-foreground">Decision</h2>
					<p>
						Adopt XDG with automatic migration from legacy paths. A new <code>internal/xdg/</code> package
						becomes the single source of truth for every path klaudiush touches on disk.
					</p>
					<div class="overflow-x-auto">
						<table class="w-full text-left text-xs">
							<thead>
								<tr class="border-b border-border">
									<th class="pb-2 pr-4 font-semibold text-foreground">XDG var</th>
									<th class="pb-2 pr-4 font-semibold text-foreground">Default</th>
									<th class="pb-2 font-semibold text-foreground">klaudiush subdir</th>
								</tr>
							</thead>
							<tbody>
								<tr class="border-b border-border/50">
									<td class="py-1.5 pr-4"><code>XDG_CONFIG_HOME</code></td>
									<td class="py-1.5 pr-4"><code>~/.config</code></td>
									<td class="py-1.5"><code>klaudiush/</code></td>
								</tr>
								<tr class="border-b border-border/50">
									<td class="py-1.5 pr-4"><code>XDG_DATA_HOME</code></td>
									<td class="py-1.5 pr-4"><code>~/.local/share</code></td>
									<td class="py-1.5"><code>klaudiush/</code></td>
								</tr>
								<tr>
									<td class="py-1.5 pr-4"><code>XDG_STATE_HOME</code></td>
									<td class="py-1.5 pr-4"><code>~/.local/state</code></td>
									<td class="py-1.5"><code>klaudiush/</code></td>
								</tr>
							</tbody>
						</table>
					</div>
					<p>
						On first run after upgrade, klaudiush detects <code>~/.klaudiush/</code>, moves files to
						their XDG locations, and leaves symlinks at the legacy paths for backward compatibility.
						Migration is idempotent.
					</p>
					<p>
						<code>xdg.ResolveFile(xdgPath, legacyPath)</code> checks the XDG location first and falls
						back to the legacy path if the file exists only there. New files always go to XDG paths.
					</p>
				</section>

				<section class="space-y-3">
					<h2 class="text-xl font-semibold text-foreground">Consequences</h2>
					<p>
						Five tilde expansion implementations replaced by one package. XDG env vars
						(<code>XDG_CONFIG_HOME</code>, etc.) work as expected. <code>KLAUDIUSH_LOG_FILE</code> added
						for custom log location. <code>klaudiush doctor --category xdg</code> detects and fixes
						path issues.
					</p>
					<p>
						Symlinks remain at legacy locations after migration. Users who scripted against
						<code>~/.klaudiush/</code> paths need to update - symlinks cover config and log, but not
						all paths.
					</p>
				</section>
			</div>
		{/if}
	</div>
</div>

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
