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
		Session tracking adds fast-fail behavior to Claude Code sessions. When klaudiush denies a
		command, subsequent commands in the same session are immediately rejected with a reference
		to the original error. This prevents Claude from wasting time evaluating queued commands
		one by one.
	</p>
</section>

<section id="the-problem" class="space-y-3">
	<h2 class="text-xl font-semibold">The problem</h2>
	<p class="text-muted-foreground">
		Without session tracking, Claude Code continues executing queued commands after a denial.
		Each command fails independently, with delays between each failure. The session tracking
		system short-circuits this: once a command is denied, the session is "poisoned" and all
		subsequent commands fail immediately with error
		<a href="/e/SESS001" class="underline underline-offset-2 hover:text-foreground">SESS001</a>.
	</p>
</section>

<section id="configuration" class="space-y-4">
	<h2 class="text-xl font-semibold">Configuration</h2>
	<p class="text-muted-foreground">
		Session tracking is enabled by default. The defaults work well for most setups:
	</p>
	<CodeBlock html={codeSnippets.config} />
	<Callout type="info">
		<p>Sessions expire automatically after <code>max_session_age</code>. If Claude Code
		resumes an expired session, it starts fresh in a clean state.</p>
	</Callout>
</section>

<section id="lifecycle" class="space-y-4">
	<h2 class="text-xl font-semibold">Session lifecycle</h2>
	<p class="text-muted-foreground">
		Sessions move through three states:
	</p>
	<ol class="list-decimal space-y-2 pl-6 text-sm text-muted-foreground">
		<li><strong>Clean</strong> - new sessions start here, commands are validated normally</li>
		<li><strong>Poisoned</strong> - a validator returned a blocking error, all subsequent commands fail with SESS001</li>
		<li><strong>Unpoisoned</strong> - violations acknowledged, session returns to clean state</li>
	</ol>
	<CodeBlock html={codeSnippets.lifecycle} />
</section>

<section id="unpoisoning" class="space-y-4">
	<h2 class="text-xl font-semibold">Unpoisoning a session</h2>
	<p class="text-muted-foreground">
		To unpoison a session, acknowledge the violations that caused it. The token format is
		<code>SESS:&lt;CODE1&gt;[,&lt;CODE2&gt;,...]</code>.
	</p>
	<CodeBlock html={codeSnippets.unpoison} />
	<Callout type="warning" title="All codes required">
		<p>When a session is poisoned by multiple violations, you must acknowledge all codes.
		Partial acknowledgment is rejected.</p>
	</Callout>
</section>

<section id="audit" class="space-y-4">
	<h2 class="text-xl font-semibold">Audit logging</h2>
	<p class="text-muted-foreground">
		Poison and unpoison events are logged in JSONL format for troubleshooting. Audit logging
		is enabled by default.
	</p>
	<CodeBlock html={codeSnippets.auditConfig} />
	<h3 class="text-lg font-medium">Viewing audit logs</h3>
	<CodeBlock html={codeSnippets.auditView} />
</section>

<section id="troubleshooting" class="space-y-4">
	<h2 class="text-xl font-semibold">Troubleshooting</h2>
	<h3 class="text-lg font-medium">Session still poisoned after fixing the error</h3>
	<p class="text-muted-foreground">
		Fixing the original error doesn't automatically unpoison the session. Add an unpoison
		token to your next command, or start a new Claude Code session.
	</p>
	<h3 class="text-lg font-medium">Session tracking not working</h3>
	<p class="text-muted-foreground">
		If commands don't fast-fail after a denial, check that <code>enabled = true</code> in
		your config. If Claude Code doesn't provide a <code>session_id</code>, klaudiush falls
		back to its original behavior without tracking.
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
