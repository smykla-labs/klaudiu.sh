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
		klaudiush is a Go binary that acts as a validation dispatcher. Claude Code sends hook
		events as JSON to stdin, klaudiush validates the operation through a pipeline of
		matchers and validators, and returns a JSON response to stdout. The whole process runs
		synchronously in under 115ms<sup><a href="#footnote-1" class="text-muted-foreground hover:text-foreground">1</a></sup>.
	</p>
	<CodeBlock html={codeSnippets.flow} />
	<ol class="list-decimal space-y-1 pl-6 text-sm text-muted-foreground">
		<li>Claude Code sends hook event as JSON to stdin</li>
		<li>CLI parses flags, loads config, initializes subsystems</li>
		<li>JSON parser converts event to <code>hook.Context</code></li>
		<li>Dispatcher runs matched validators</li>
		<li>Registry matches validators via predicates</li>
		<li>Validators return Pass/Fail/Warn with error codes</li>
		<li>JSON response written to stdout</li>
	</ol>
</section>

<section id="dispatcher" class="space-y-4">
	<h2 class="text-xl font-semibold">Dispatcher flow</h2>
	<p class="text-muted-foreground">
		The dispatcher orchestrates the validation pipeline:
	</p>
	<ol class="list-decimal space-y-1 pl-6 text-sm text-muted-foreground">
		<li>Parse the JSON hook event into a <code>hook.Context</code></li>
		<li>Check exception tokens - if valid, convert block to warning</li>
		<li>Query the registry for validators matching this context</li>
		<li>Run matched validators and collect results</li>
		<li>Build the JSON response with error codes, messages, and fix hints</li>
	</ol>
	<p class="text-muted-foreground">
		The response always exits 0 (except crashes which exit 3). Blocking is communicated
		via <code>permissionDecision: "deny"</code> in the JSON output rather than exit codes.
	</p>
	<CodeBlock html={codeSnippets.hookOutput} />
</section>

<section id="validators" class="space-y-4">
	<h2 class="text-xl font-semibold">Validator registry</h2>
	<p class="text-muted-foreground">
		Validators register themselves with predicates that describe what events they handle.
		The registry matches incoming events against these predicates and only runs relevant
		validators.
	</p>
	<CodeBlock html={codeSnippets.predicates} />
	<p class="text-muted-foreground">
		Each validator returns a <code>Result</code> with a status (Pass, Fail, Warn), an error
		code, a human-readable message, and a fix hint. Error codes map to documentation pages
		at <code>/e/CODE</code>.
	</p>

	<h3 class="text-lg font-medium">Built-in validators</h3>
	<div class="overflow-x-auto">
		<table class="w-full text-sm">
			<thead>
				<tr class="border-b border-border">
					<th class="py-2 pr-4 text-left font-medium">Category</th>
					<th class="py-2 text-left font-medium">Validators</th>
				</tr>
			</thead>
			<tbody class="text-muted-foreground">
				<tr class="border-b border-border/50"><td class="py-2 pr-4">Git</td><td class="py-2">commit, push, PR, branch, add, no-verify, fetch, merge</td></tr>
				<tr class="border-b border-border/50"><td class="py-2 pr-4">File</td><td class="py-2">markdown, shellscript, terraform, workflow, gofumpt, python, javascript, rust</td></tr>
				<tr class="border-b border-border/50"><td class="py-2 pr-4">Secrets</td><td class="py-2">25+ regex patterns, optional gitleaks</td></tr>
				<tr class="border-b border-border/50"><td class="py-2 pr-4">Shell</td><td class="py-2">backtick detection (legacy and comprehensive modes)</td></tr>
				<tr><td class="py-2 pr-4">Notification</td><td class="py-2">bell (ASCII 7 to /dev/tty for dock bounce)</td></tr>
			</tbody>
		</table>
	</div>
</section>

<section id="parallel-execution" class="space-y-3">
	<h2 class="text-xl font-semibold">Parallel execution</h2>
	<p class="text-muted-foreground">
		Validators run independently and don't share state. The dispatcher collects all results
		before building the response. File validators that call external tools (shellcheck,
		terraform fmt, actionlint) have configurable timeouts to prevent hanging.
	</p>
</section>

<section id="parsers" class="space-y-3">
	<h2 class="text-xl font-semibold">Parser system</h2>
	<p class="text-muted-foreground">
		klaudiush includes parsers for bash commands and git operations. The bash parser uses
		<code>mvdan.cc/sh</code> for AST parsing - it understands redirects, pipes, subshells,
		and command substitution at a structural level rather than with regex. The git parser
		extracts commands, flags, and arguments from git CLI invocations.
	</p>
</section>

<section id="config-loading" class="space-y-4">
	<h2 class="text-xl font-semibold">Config loading</h2>
	<p class="text-muted-foreground">
		Configuration uses <code>koanf</code> for hierarchical loading with deep merge. Sources
		load in order (defaults, global config, project config, env vars, CLI flags) and merge
		with later sources winning on conflict. The full load completes in under 45 microseconds.
	</p>
	<CodeBlock html={codeSnippets.directoryLayout} />
</section>

<footer class="border-t border-border pt-4 mt-8">
	<p id="footnote-1" class="text-xs text-muted-foreground">
		<sup>1</sup> Measured on Apple M3 Max, CLI git backend, hyperfine mean over 30 runs.
		Full git commit validation (pass, all validators) completes in 112ms +/- 6ms.
	</p>
</footer>

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
