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
		klaudiush is a validation dispatcher for Claude Code hooks. It intercepts tool calls
		(git commits, file writes, bash commands) and validates them against configurable rules
		before they execute. This guide covers install, hook setup, and your first
		validated commit.
	</p>
</section>

<section id="install" class="space-y-4">
	<h2 class="text-xl font-semibold">Install klaudiush</h2>
	<p class="text-muted-foreground">
		The fastest way to install is Homebrew on macOS/Linux. The install script works on any
		platform. See the <a href="/docs/installation" class="underline underline-offset-2 hover:text-foreground">installation guide</a> for
		Nix, from-source builds, and other options.
	</p>
	<CodeBlock html={codeSnippets.install} />
	<p class="text-muted-foreground">
		After installing, run the init command to create a global config file. The interactive
		prompts detect your git author info and set up defaults.
	</p>
	<CodeBlock html={codeSnippets.initGlobal} />
</section>

<section id="configure-hook" class="space-y-4">
	<h2 class="text-xl font-semibold">Configure the hook</h2>
	<p class="text-muted-foreground">
		Claude Code needs to know about klaudiush. Add hook entries to your
		<code>~/.claude/settings.json</code> file. The PreToolUse hooks run before tool calls,
		and the Notification hook handles bell notifications.
	</p>
	<CodeBlock html={codeSnippets.hookConfig} />
	<Callout type="info" title="Hook timeout">
		<p>File validators (markdown, terraform, shellcheck) run external tools. Set the hook
		timeout to at least 30 seconds if you enable them.</p>
	</Callout>
</section>

<section id="first-validation" class="space-y-4">
	<h2 class="text-xl font-semibold">First validation</h2>
	<p class="text-muted-foreground">
		With the hook configured, klaudiush runs automatically when Claude Code uses tools.
		Try a git commit - klaudiush validates the command, commit message, and staging area.
	</p>
	<CodeBlock html={codeSnippets.firstCommit} />
	<p class="text-muted-foreground">
		If validation fails, Claude Code sees the error code, a message explaining the issue,
		and a fix hint. It can then self-correct and retry with a valid command.
	</p>
</section>

<section id="whats-next" class="space-y-3">
	<h2 class="text-xl font-semibold">What's next</h2>
	<p class="text-muted-foreground">
		You have a working setup with default validators. From here you can:
	</p>
	<ul class="list-disc space-y-1 pl-6 text-sm text-muted-foreground">
		<li>Customize validation with <a href="/docs/rules" class="underline underline-offset-2 hover:text-foreground">dynamic rules</a></li>
		<li>Add project-specific config with <a href="/docs/configuration" class="underline underline-offset-2 hover:text-foreground">TOML configuration</a></li>
		<li>Extend validation with <a href="/docs/plugins" class="underline underline-offset-2 hover:text-foreground">exec plugins</a></li>
		<li>Browse all <a href="/docs/cli" class="underline underline-offset-2 hover:text-foreground">CLI commands</a></li>
	</ul>
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
