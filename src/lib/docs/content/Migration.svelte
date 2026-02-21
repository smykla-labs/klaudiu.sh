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
		This page documents breaking changes between versions and how to upgrade. klaudiush
		follows semantic versioning - breaking changes only happen in minor version bumps
		during the pre-1.0 phase.
	</p>
</section>

<section id="v1-24" class="space-y-4">
	<h2 class="text-xl font-semibold">
		<a href="https://github.com/smykla-skalski/klaudiush/releases/tag/v1.24.0" class="underline underline-offset-2 hover:text-foreground">v1.24.0</a>
		- XDG base directory migration
	</h2>
	<p class="text-muted-foreground">
		v1.24.0 moves all global/user-level paths to follow the
		<a href="https://specifications.freedesktop.org/basedir-spec/latest/" class="underline underline-offset-2 hover:text-foreground">XDG Base Directory</a>
		specification. Files that previously lived under <code>~/.klaudiush/</code> are
		split across config, data, and state directories.
	</p>
	<div class="overflow-x-auto">
		<table class="w-full text-sm">
			<thead>
				<tr class="border-b border-border">
					<th class="py-2 pr-4 text-left font-medium">Old path</th>
					<th class="py-2 text-left font-medium">New path (XDG)</th>
				</tr>
			</thead>
			<tbody class="text-muted-foreground">
				<tr class="border-b border-border/50"><td class="py-2 pr-4"><code>~/.klaudiush/config.toml</code></td><td class="py-2"><code>$XDG_CONFIG_HOME/klaudiush/config.toml</code></td></tr>
				<tr class="border-b border-border/50"><td class="py-2 pr-4"><code>~/.claude/hooks/dispatcher.log</code></td><td class="py-2"><code>$XDG_STATE_HOME/klaudiush/dispatcher.log</code></td></tr>
				<tr class="border-b border-border/50"><td class="py-2 pr-4"><code>~/.klaudiush/exceptions/state.json</code></td><td class="py-2"><code>$XDG_DATA_HOME/klaudiush/exceptions/state.json</code></td></tr>
				<tr class="border-b border-border/50"><td class="py-2 pr-4"><code>~/.klaudiush/exception_audit.jsonl</code></td><td class="py-2"><code>$XDG_STATE_HOME/klaudiush/exception_audit.jsonl</code></td></tr>
				<tr class="border-b border-border/50"><td class="py-2 pr-4"><code>~/.klaudiush/crash_dumps/</code></td><td class="py-2"><code>$XDG_DATA_HOME/klaudiush/crash_dumps/</code></td></tr>
				<tr class="border-b border-border/50"><td class="py-2 pr-4"><code>~/.klaudiush/patterns/</code></td><td class="py-2"><code>$XDG_DATA_HOME/klaudiush/patterns/</code></td></tr>
				<tr class="border-b border-border/50"><td class="py-2 pr-4"><code>~/.klaudiush/.backups/</code></td><td class="py-2"><code>$XDG_DATA_HOME/klaudiush/backups/</code></td></tr>
				<tr><td class="py-2 pr-4"><code>~/.klaudiush/plugins/</code></td><td class="py-2"><code>$XDG_DATA_HOME/klaudiush/plugins/</code></td></tr>
			</tbody>
		</table>
	</div>
	<CodeBlock html={codeSnippets.xdgDefaults} />

	<h3 class="text-lg font-medium">What happens on upgrade</h3>
	<p class="text-muted-foreground">
		On first run after upgrade, klaudiush detects the old <code>~/.klaudiush/</code>
		directory and moves files to their XDG locations. The migration is automatic and
		idempotent - running it twice is safe.
	</p>
	<ul class="list-disc space-y-1 pl-6 text-sm text-muted-foreground">
		<li>Files are moved, not copied</li>
		<li>Symlinks are created at <code>~/.klaudiush/config.toml</code> and
			<code>~/.claude/hooks/dispatcher.log</code> for backward compatibility</li>
		<li>Files that already exist at the destination are skipped</li>
		<li>Custom absolute paths in your config are not affected</li>
		<li>Project-local paths (<code>.klaudiush/config.toml</code>, <code>.klaudiush/patterns.json</code>,
			<code>.klaudiush/plugins/</code>) are unchanged</li>
	</ul>

	<h3 class="text-lg font-medium">Verifying the migration</h3>
	<p class="text-muted-foreground">
		Run the XDG doctor category to check migration status and directory permissions:
	</p>
	<CodeBlock html={codeSnippets.xdgDoctor} />

	<Callout type="info" title="New environment variable">
		<p><code>KLAUDIUSH_LOG_FILE</code> overrides the log file location. When set,
		klaudiush writes logs to this path instead of the XDG state directory.</p>
	</Callout>
</section>

<section id="v1-18" class="space-y-4">
	<h2 class="text-xl font-semibold">
		<a href="https://github.com/smykla-skalski/klaudiush/releases/tag/v1.18.0" class="underline underline-offset-2 hover:text-foreground">v1.18.0</a>
		- JSON stdout output
	</h2>
	<p class="text-muted-foreground">
		v1.18.0 changed how klaudiush communicates with Claude Code. Instead of exit codes,
		it uses JSON stdout for all responses.
	</p>
	<CodeBlock html={codeSnippets.jsonMigration} />
	<Callout type="warning" title="Exit code change">
		<p>If you have scripts that check for exit code 2, they need to parse JSON stdout
		instead. Exit code 2 is no longer used.</p>
	</Callout>
	<p class="text-muted-foreground">
		The reason for this change: Claude Code conflates exit code 2 with user denials.
		With JSON output, the model gets structured error information and can self-correct.
		See <a href="/docs/adr/0001" class="underline underline-offset-2 hover:text-foreground">ADR-0001</a> for
		the full rationale.
	</p>

	<h3 class="text-lg font-medium">JSON output format</h3>
	<p class="text-muted-foreground">
		The JSON output includes separate fields for model-facing and user-facing messages:
	</p>
	<CodeBlock html={codeSnippets.jsonOutput} />

	<div class="overflow-x-auto">
		<table class="w-full text-sm">
			<thead>
				<tr class="border-b border-border">
					<th class="py-2 pr-4 text-left font-medium">Field</th>
					<th class="py-2 text-left font-medium">Purpose</th>
				</tr>
			</thead>
			<tbody class="text-muted-foreground">
				<tr class="border-b border-border/50"><td class="py-2 pr-4"><code>permissionDecision</code></td><td class="py-2">deny or allow - replaces exit code</td></tr>
				<tr class="border-b border-border/50"><td class="py-2 pr-4"><code>permissionDecisionReason</code></td><td class="py-2">Error code and message for the model to self-correct</td></tr>
				<tr class="border-b border-border/50"><td class="py-2 pr-4"><code>additionalContext</code></td><td class="py-2">Extra context the model can use</td></tr>
				<tr><td class="py-2 pr-4"><code>systemMessage</code></td><td class="py-2">Message shown to the user in the terminal</td></tr>
			</tbody>
		</table>
	</div>
</section>

<section id="upgrade-steps" class="space-y-4">
	<h2 class="text-xl font-semibold">Upgrade steps</h2>
	<p class="text-muted-foreground">
		For most users, upgrading is just updating the binary. Configuration files are
		backwards-compatible - all existing configs continue to work.
	</p>
	<CodeBlock html={codeSnippets.upgradeSteps} />
	<p class="text-muted-foreground">
		klaudiush also has a self-update command:
	</p>
	<CodeBlock html={codeSnippets.selfUpdate} />
	<p class="text-muted-foreground">
		On first run after upgrade, klaudiush automatically backs up your existing config
		before applying any changes. You can restore the backup with
		<code>klaudiush backup restore</code> if anything goes wrong.
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
