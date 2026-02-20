<script lang="ts">
	import CodeBlock from '$lib/components/CodeBlock.svelte';

	interface Props {
		codeSnippets: Record<string, string>;
	}

	let { codeSnippets }: Props = $props();
</script>

<section id="general" class="space-y-4">
	<h2 class="text-xl font-semibold">General</h2>

	<h3 class="text-lg font-medium">Do I need a config file?</h3>
	<p class="text-muted-foreground">
		No. All validators have sensible defaults. A config file is only needed when you
		want to change defaults, add custom rules, or configure features like backup and
		exceptions.
	</p>

	<h3 class="text-lg font-medium">What happens when klaudiush crashes?</h3>
	<p class="text-muted-foreground">
		klaudiush has automatic panic recovery. If it crashes, it writes a crash dump to
		<code>~/.klaudiush/crash_dumps/</code>, exits with code 3, and Claude Code allows the
		operation through. Your workflow is never blocked by a klaudiush crash.
	</p>

	<h3 class="text-lg font-medium">How fast is klaudiush?</h3>
	<p class="text-muted-foreground">
		Config loading takes under 45 microseconds. Individual validators run in under 50ms.
		The full validation chain typically completes in under 500ms. File validators that
		call external tools (shellcheck, terraform) are the slowest and have configurable
		timeouts.
	</p>

	<h3 class="text-lg font-medium">What's the difference between global and project config?</h3>
	<p class="text-muted-foreground">
		Global config (<code>~/.klaudiush/config.toml</code>) applies to all projects - use it
		for your personal preferences. Project config (<code>.klaudiush/config.toml</code>)
		applies to one repository and overrides global settings - use it for team standards.
	</p>
</section>

<section id="validators" class="space-y-4">
	<h2 class="text-xl font-semibold">Validators</h2>

	<h3 class="text-lg font-medium">How do I disable a validator?</h3>
	<p class="text-muted-foreground">
		Three ways, in order of precedence:
	</p>
	<CodeBlock html={codeSnippets.disableValidator} />
	<p class="text-muted-foreground">Or in your config file:</p>
	<CodeBlock html={codeSnippets.disableConfig} />

	<h3 class="text-lg font-medium">What's the difference between "error" and "warning" severity?</h3>
	<p class="text-muted-foreground">
		Error severity blocks the operation - Claude Code sees a deny response and can't proceed.
		Warning severity logs the issue but allows the operation through. The default is error.
	</p>

	<h3 class="text-lg font-medium">Why is my commit message rejected?</h3>
	<p class="text-muted-foreground">
		Common reasons: title exceeds 50 characters (configurable via <code>title_max_length</code>),
		missing scope when <code>require_scope = true</code>, invalid conventional commit type,
		or missing signoff flag (<code>-s</code>). Check the error code in the response for the
		specific issue.
	</p>
</section>

<section id="configuration" class="space-y-4">
	<h2 class="text-xl font-semibold">Configuration</h2>

	<h3 class="text-lg font-medium">How do I validate my config file?</h3>
	<p class="text-muted-foreground">
		Run <code>klaudiush debug config</code> to see the loaded config and any parsing errors.
		The <code>klaudiush doctor --category config</code> command also checks config validity.
	</p>

	<h3 class="text-lg font-medium">Can I use regex in patterns?</h3>
	<p class="text-muted-foreground">
		Yes. The rule engine auto-detects glob vs regex patterns. If the pattern contains anchors
		(<code>^</code>, <code>$</code>), character classes (<code>[</code>), or quantifiers
		(<code>+</code>, <code>.*</code>), it's treated as regex. Otherwise it's a glob.
	</p>

	<h3 class="text-lg font-medium">How do I bypass a validation error?</h3>
	<p class="text-muted-foreground">
		Use the <a href="/docs/exceptions" class="underline underline-offset-2 hover:text-foreground">exception workflow</a>
		with tokens in your command:
	</p>
	<CodeBlock html={codeSnippets.exceptionUsage} />
	<p class="text-muted-foreground">
		You need to configure an exception policy for the error code:
	</p>
	<CodeBlock html={codeSnippets.exceptionConfig} />
</section>

<section id="troubleshooting" class="space-y-4">
	<h2 class="text-xl font-semibold">Troubleshooting</h2>

	<h3 class="text-lg font-medium">How do I get shell completions?</h3>
	<CodeBlock html={codeSnippets.completionSetup} />

	<h3 class="text-lg font-medium">Where are logs and state files stored?</h3>
	<p class="text-muted-foreground">
		Logs go to <code>~/.claude/hooks/dispatcher.log</code>. Session state is at
		<code>~/.klaudiush/session_state.json</code>. Audit logs are at
		<code>~/.klaudiush/session_audit.jsonl</code> and
		<code>~/.klaudiush/exception_audit.jsonl</code>.
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
