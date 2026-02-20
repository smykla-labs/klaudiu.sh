<script lang="ts">
	import CodeBlock from '$lib/components/CodeBlock.svelte';

	interface Props {
		codeSnippets: Record<string, string>;
	}

	let { codeSnippets }: Props = $props();
</script>

<section id="overview" class="space-y-3">
	<h2 class="text-xl font-semibold">Overview</h2>
	<p class="text-muted-foreground">
		klaudiush is invoked as a Claude Code hook. It reads JSON from stdin, validates the
		operation, and writes JSON to stdout. The CLI also includes commands for configuration
		management, diagnostics, and auditing.
	</p>
</section>

<section id="global-flags" class="space-y-4">
	<h2 class="text-xl font-semibold">Global flags</h2>
	<p class="text-muted-foreground">
		These flags apply to the root command and affect all operations.
	</p>
	<CodeBlock html={codeSnippets.rootFlags} />

	<div class="overflow-x-auto">
		<table class="w-full text-sm">
			<thead>
				<tr class="border-b border-border">
					<th class="py-2 pr-4 text-left font-medium">Flag</th>
					<th class="py-2 text-left font-medium">Description</th>
				</tr>
			</thead>
			<tbody class="text-muted-foreground">
				<tr class="border-b border-border/50"><td class="py-2 pr-4"><code>--hook-type</code></td><td class="py-2">Hook event type: PreToolUse, PostToolUse, Notification</td></tr>
				<tr class="border-b border-border/50"><td class="py-2 pr-4"><code>--debug</code></td><td class="py-2">Enable debug logging to dispatcher.log</td></tr>
				<tr class="border-b border-border/50"><td class="py-2 pr-4"><code>--trace</code></td><td class="py-2">Enable verbose trace logging</td></tr>
				<tr class="border-b border-border/50"><td class="py-2 pr-4"><code>--config</code></td><td class="py-2">Custom project config path</td></tr>
				<tr class="border-b border-border/50"><td class="py-2 pr-4"><code>--global-config</code></td><td class="py-2">Custom global config path</td></tr>
				<tr class="border-b border-border/50"><td class="py-2 pr-4"><code>--disable</code></td><td class="py-2">Comma-separated list of validators to disable</td></tr>
				<tr><td class="py-2 pr-4"><code>--no-color</code></td><td class="py-2">Disable colored output</td></tr>
			</tbody>
		</table>
	</div>
</section>

<section id="init" class="space-y-4">
	<h2 class="text-xl font-semibold">init</h2>
	<p class="text-muted-foreground">
		Create a configuration file with interactive prompts. Detects your git author info
		and sets up defaults. Project configs are automatically added to <code>.git/info/exclude</code>.
	</p>
	<CodeBlock html={codeSnippets.init} />

	<div class="overflow-x-auto">
		<table class="w-full text-sm">
			<thead>
				<tr class="border-b border-border">
					<th class="py-2 pr-4 text-left font-medium">Flag</th>
					<th class="py-2 text-left font-medium">Description</th>
				</tr>
			</thead>
			<tbody class="text-muted-foreground">
				<tr class="border-b border-border/50"><td class="py-2 pr-4"><code>--global, -g</code></td><td class="py-2">Create global config at ~/.klaudiush/config.toml</td></tr>
				<tr class="border-b border-border/50"><td class="py-2 pr-4"><code>--force, -f</code></td><td class="py-2">Overwrite existing config (creates backup first)</td></tr>
				<tr><td class="py-2 pr-4"><code>--no-tui</code></td><td class="py-2">Non-interactive mode with defaults</td></tr>
			</tbody>
		</table>
	</div>
</section>

<section id="validate" class="space-y-4">
	<h2 class="text-xl font-semibold">validate</h2>
	<p class="text-muted-foreground">
		The root command with <code>--hook-type</code> runs validation. This is what Claude Code
		calls via the hook. You can test it manually by piping JSON to stdin.
	</p>
	<CodeBlock html={codeSnippets.validate} />
</section>

<section id="backup" class="space-y-4">
	<h2 class="text-xl font-semibold">backup</h2>
	<p class="text-muted-foreground">
		Manage configuration backups. Automatic backups are created on config changes.
		Manual backups can be tagged for easy identification.
	</p>
	<CodeBlock html={codeSnippets.backup} />
</section>

<section id="doctor" class="space-y-4">
	<h2 class="text-xl font-semibold">doctor</h2>
	<p class="text-muted-foreground">
		Run diagnostic checks on your setup. Checks binary availability, hook registration,
		config validity, backup health, and tool dependencies.
	</p>
	<CodeBlock html={codeSnippets.doctor} />
</section>

<section id="audit" class="space-y-4">
	<h2 class="text-xl font-semibold">audit</h2>
	<p class="text-muted-foreground">
		Manage the exception audit log. View entries, filter by error code or outcome,
		and clean up old data.
	</p>
	<CodeBlock html={codeSnippets.audit} />
</section>

<section id="version" class="space-y-4">
	<h2 class="text-xl font-semibold">version</h2>
	<p class="text-muted-foreground">
		Print version info including commit hash, build date, Go version, and platform.
	</p>
	<CodeBlock html={codeSnippets.version} />
</section>

<section id="completion" class="space-y-4">
	<h2 class="text-xl font-semibold">completion</h2>
	<p class="text-muted-foreground">
		Generate shell completion scripts. Supports bash, zsh, fish, and PowerShell.
	</p>
	<CodeBlock html={codeSnippets.completion} />
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
