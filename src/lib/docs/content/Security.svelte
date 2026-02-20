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
		klaudiush validates Claude Code operations to prevent security issues before they happen.
		Built-in secret detection, file write protection, shell safety checks, and GitHub Actions
		workflow validation run automatically without configuration.
	</p>
</section>

<section id="secret-detection" class="space-y-4">
	<h2 class="text-xl font-semibold">Secret detection</h2>
	<p class="text-muted-foreground">
		The secrets validator checks file content against 25+ regex patterns for common
		credential formats. It catches secrets before they're committed.
	</p>
	<CodeBlock html={codeSnippets.secretPatterns} />
	<p class="text-muted-foreground">
		For extra coverage, enable gitleaks integration. klaudiush runs its built-in patterns
		first, then optionally delegates to gitleaks for additional checks.
	</p>
	<CodeBlock html={codeSnippets.gitleaksConfig} />
	<p class="text-muted-foreground">
		To allow secrets in test fixtures, use the
		<a href="/docs/rules" class="underline underline-offset-2 hover:text-foreground">rules engine</a>
		with an allow action scoped to test directories, or the
		<a href="/docs/exceptions" class="underline underline-offset-2 hover:text-foreground">exception workflow</a>
		for one-off bypasses.
	</p>
</section>

<section id="plugin-sandboxing" class="space-y-4">
	<h2 class="text-xl font-semibold">Plugin sandboxing</h2>
	<p class="text-muted-foreground">
		Exec plugins run as child processes with configurable timeouts. Each plugin declares
		what events and tools it handles via predicates - it only receives matching events.
	</p>
	<CodeBlock html={codeSnippets.pluginSecurity} />
	<p class="text-muted-foreground">
		Plugins communicate over stdin/stdout using JSON. They can't access klaudiush internals
		or modify other plugins' results. A crashing plugin is treated the same as any other
		crash - the operation proceeds.
	</p>
</section>

<section id="security-model" class="space-y-4">
	<h2 class="text-xl font-semibold">Security model</h2>
	<p class="text-muted-foreground">
		klaudiush runs as a Claude Code PreToolUse hook. It receives the tool call before
		execution and can block it by returning a deny response. This means:
	</p>
	<ul class="list-disc space-y-1 pl-6 text-sm text-muted-foreground">
		<li>Secrets are caught before they're written to disk or committed</li>
		<li>Dangerous shell commands are blocked before execution</li>
		<li>Git operations are validated before they run</li>
		<li>File writes to sensitive paths are prevented</li>
	</ul>
	<p class="text-muted-foreground">
		Built-in protections include bash AST parsing (detects file writes via redirects, tee,
		cp, mv), path protection (blocks <code>/tmp</code> writes), and backtick detection
		(catches unquoted command substitution).
	</p>
	<Callout type="warning" title="Not a security boundary">
		<p>klaudiush validates Claude Code tool calls. It does not sandbox the Claude Code process
		itself. A determined user can bypass klaudiush by modifying the hook configuration.</p>
	</Callout>
</section>

<section id="reporting" class="space-y-4">
	<h2 class="text-xl font-semibold">Vulnerability reporting</h2>
	<p class="text-muted-foreground">
		If you discover a security vulnerability in klaudiush, report it privately. Do not
		open a public GitHub issue.
	</p>
	<CodeBlock html={codeSnippets.reporting} />
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
