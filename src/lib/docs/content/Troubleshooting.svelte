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
		This page covers common issues and how to diagnose them. Start with the doctor command
		for automated checks, then move to manual debugging if needed.
	</p>
</section>

<section id="doctor" class="space-y-4">
	<h2 class="text-xl font-semibold">Doctor command</h2>
	<p class="text-muted-foreground">
		The doctor command runs automated diagnostics across six categories: binary availability,
		hook registration, config validity, backup health, tool dependencies, and XDG directory
		layout.
	</p>
	<CodeBlock html={codeSnippets.doctorCommand} />
	<p class="text-muted-foreground">
		The <code>--fix</code> flag attempts to automatically resolve detected issues. It creates
		backups before making any changes.
	</p>
</section>

<section id="common-issues" class="space-y-4">
	<h2 class="text-xl font-semibold">Common issues</h2>

	<h3 class="text-lg font-medium">klaudiush not running on tool calls</h3>
	<p class="text-muted-foreground">
		Check that the hook is registered in <code>~/.claude/settings.json</code> and that
		the <code>klaudiush</code> binary is on your PATH.
	</p>
	<CodeBlock html={codeSnippets.hookCheck} />

	<h3 class="text-lg font-medium">Validator not triggering</h3>
	<p class="text-muted-foreground">
		Verify the validator is enabled in your config. Use <code>debug config</code> to see
		the loaded configuration and check the <code>enabled</code> flag.
	</p>
	<CodeBlock html={codeSnippets.debugConfig} />

	<h3 class="text-lg font-medium">Config not loading</h3>
	<p class="text-muted-foreground">
		Common causes: TOML syntax errors, wrong field names, invalid duration format
		(use <code>"10s"</code> not <code>10</code>). Run <code>klaudiush debug config</code>
		to see parsing errors.
	</p>

	<h3 class="text-lg font-medium">File validators timing out</h3>
	<p class="text-muted-foreground">
		File validators (markdown, shellscript, terraform) run external tools. If these tools
		are slow or missing, the validator can time out. Check that the tools are installed and
		increase the timeout in your config if needed.
	</p>

	<Callout type="info" title="Severity matters">
		<p>Validators with <code>severity = "warning"</code> log issues but don't block operations.
		Set <code>severity = "error"</code> (the default) to make them block.</p>
	</Callout>
</section>

<section id="crash-dumps" class="space-y-4">
	<h2 class="text-xl font-semibold">Crash dumps</h2>
	<p class="text-muted-foreground">
		klaudiush has automatic panic recovery. If the dispatcher crashes, it writes a dump
		to <code>$XDG_DATA_HOME/klaudiush/crash_dumps/</code> (default
		<code>~/.local/share/klaudiush/crash_dumps/</code>) and exits with code 3 (so
		Claude Code allows the operation through).
	</p>
	<CodeBlock html={codeSnippets.crashDumps} />
</section>

<section id="debug-logging" class="space-y-4">
	<h2 class="text-xl font-semibold">Debug logging</h2>
	<p class="text-muted-foreground">
		Enable debug or trace logging to see what klaudiush is doing. Logs are written to
		<code>$XDG_STATE_HOME/klaudiush/dispatcher.log</code> (default
		<code>~/.local/state/klaudiush/dispatcher.log</code>). Set the
		<code>KLAUDIUSH_LOG_FILE</code> environment variable to write logs to a custom path
		instead. The old symlink at <code>~/.claude/hooks/dispatcher.log</code> still works
		after migration.
	</p>
	<CodeBlock html={codeSnippets.debugLogging} />
</section>

<style>
	code:not(pre code) {
		background: oklch(0.96 0.005 67);
		border: 1px solid oklch(0.9 0.005 67);
		border-radius: 0.25rem;
		padding: 0.15em 0.35em;
		font-size: 0.85em;
		font-weight: 500;
		color: oklch(0.25 0.01 67);
		display: inline-block;
		vertical-align: middle;
	}
</style>
