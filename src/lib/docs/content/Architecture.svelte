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
		klaudiush is a Go binary validation dispatcher. Claude Code sends hook
		events as JSON to stdin, klaudiush validates the operation through a pipeline of
		matchers and validators, and returns a JSON response to stdout. The whole process runs
		synchronously in under 500ms.
	</p>
	<CodeBlock html={codeSnippets.flow} />
</section>

<section id="hook-integration" class="space-y-4">
	<h2 class="text-xl font-semibold">Hook integration</h2>
	<p class="text-muted-foreground">
		klaudiush plugs into Claude Code's hook system. Claude Code fires hooks at specific
		points during tool execution, and klaudiush is the hook handler. The contract is
		JSON in on stdin, JSON out on stdout.
	</p>
	<CodeBlock html={codeSnippets.hookContract} />
	<p class="text-muted-foreground">
		There are three hook event types:
	</p>
	<CodeBlock html={codeSnippets.hookEvents} />
	<p class="text-muted-foreground">
		PreToolUse is where most validation happens. The dispatcher decides whether to allow
		or deny the operation before Claude Code executes it. PostToolUse hooks are
		observational - they can log or notify but can't block anything. Notification hooks
		handle session-level events like the dock bounce bell.
	</p>
</section>

<section id="dispatcher" class="space-y-4">
	<h2 class="text-xl font-semibold">Dispatcher flow</h2>
	<p class="text-muted-foreground">
		The dispatcher orchestrates the validation pipeline:
	</p>
	<ol class="list-decimal space-y-1 pl-6 text-sm text-muted-foreground">
		<li>Parse the JSON hook event into a <code>hook.Context</code></li>
		<li>Check session state - if poisoned, deny immediately with SESS001</li>
		<li>Evaluate dynamic rules - an <code>allow</code> rule short-circuits everything</li>
		<li>Check exception tokens - if valid, convert block to warning</li>
		<li>Query the registry for validators matching this context</li>
		<li>Run matched validators (and matched plugins) in parallel, collect results</li>
		<li>Build the JSON response with error codes, messages, and fix hints</li>
	</ol>
	<p class="text-muted-foreground">
		The response always exits 0 (except crashes which exit 3). Blocking is communicated
		via <code>permissionDecision: "deny"</code> in the JSON output rather than exit codes.
	</p>
	<CodeBlock html={codeSnippets.hookOutput} />
	<Callout type="info" title="Why exit 0 for denials?">
		<p>Claude Code treats a non-zero exit as a hook failure and falls through to allow
		the operation. Using exit 0 with JSON-level deny ensures blocks are respected.
		Exit 3 is reserved for crashes (fail-open).</p>
	</Callout>
</section>

<section id="error-codes" class="space-y-4">
	<h2 class="text-xl font-semibold">Error code system</h2>
	<p class="text-muted-foreground">
		Every validation failure produces an error code that maps to a documentation page.
		Codes follow a strict format: a category prefix followed by a three-digit sequence
		number.
	</p>
	<CodeBlock html={codeSnippets.errorCodeAnatomy} />
	<p class="text-muted-foreground">
		Error codes appear in deny messages as <code>[GIT001] Human-readable message</code>.
		The code links to <code>/e/GIT001</code> on this site, where the full explanation
		and fix steps live. The model (and the user) always gets a direct link to the fix.
	</p>
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
	<p class="text-muted-foreground">
		AST parsing lets klaudiush catch things like <code>echo secret > .env</code>
		or <code>cat key | tee /etc/creds</code> - it sees redirect targets and pipe
		destinations, not just the command name. Regex misses these because the dangerous
		part is the structure around the command, not the command itself.
	</p>
</section>

<section id="rules-engine" class="space-y-4">
	<h2 class="text-xl font-semibold">Rules engine</h2>
	<p class="text-muted-foreground">
		Dynamic rules let you modify validation behavior without writing code. Rules are
		evaluated before built-in validators and can allow, block, or warn on specific
		operations. See the <a href="/docs/rules" class="underline underline-offset-2 hover:text-foreground">rules guide</a> for configuration details.
	</p>
	<CodeBlock html={codeSnippets.ruleEval} />
	<p class="text-muted-foreground">
		The <code>allow</code> action short-circuits the entire pipeline. Once a rule allows
		an operation, no built-in validators or other rules run. Use it to whitelist things
		like test fixture secrets or force pushes to personal forks.
	</p>
</section>

<section id="session-system" class="space-y-4">
	<h2 class="text-xl font-semibold">Session system</h2>
	<p class="text-muted-foreground">
		Session tracking adds fast-fail behavior. When a command is denied, the session becomes
		"poisoned" and all subsequent commands fail immediately with
		<a href="/e/SESS001" class="underline underline-offset-2 hover:text-foreground">SESS001</a>
		until the violation is acknowledged. This prevents Claude from wasting API calls
		retrying queued commands that would all fail for the same reason.
	</p>
	<CodeBlock html={codeSnippets.sessionStates} />
	<p class="text-muted-foreground">
		Unpoisoning requires explicitly acknowledging every error code that caused the poison,
		using a <code>SESS:CODE</code> token. Sessions also expire naturally based on
		<code>max_session_age</code> (default 24h). See the
		<a href="/docs/sessions" class="underline underline-offset-2 hover:text-foreground">sessions guide</a> for configuration.
	</p>
</section>

<section id="exception-system" class="space-y-4">
	<h2 class="text-xl font-semibold">Exception pipeline</h2>
	<p class="text-muted-foreground">
		Exceptions let you bypass specific validators with an audit trail. The pipeline
		parses tokens from the command, evaluates them against per-code policies, checks rate
		limits, and either converts blocks to warnings or rejects the exception. See the
		<a href="/docs/exceptions" class="underline underline-offset-2 hover:text-foreground">exceptions guide</a> for the full workflow.
	</p>
	<CodeBlock html={codeSnippets.exceptionEval} />
	<Callout type="warning" title="Exceptions are not a backdoor">
		<p>Every exception attempt is logged to a JSONL audit trail - allowed or denied.
		Policies can restrict which codes are bypassable, require specific reasons, and
		enforce hourly/daily rate limits.</p>
	</Callout>
</section>

<section id="plugin-system" class="space-y-4">
	<h2 class="text-xl font-semibold">Plugin system</h2>
	<p class="text-muted-foreground">
		Plugins are external executables that add custom validation. They communicate over
		stdin/stdout using JSON and are isolated from klaudiush internals. See the
		<a href="/docs/plugins" class="underline underline-offset-2 hover:text-foreground">plugin guide</a> for development details.
	</p>
	<CodeBlock html={codeSnippets.pluginProtocol} />
	<p class="text-muted-foreground">
		Each plugin runs as a child process. Plugins are matched to events using the same
		predicate system as built-in validators, and their results get merged into the
		final response.
	</p>
	<CodeBlock html={codeSnippets.pluginLifecycle} />
	<p class="text-muted-foreground">
		A crashing or timed-out plugin is treated the same as any other crash - the operation
		is allowed (fail-open). Plugins can't access klaudiush internals or modify other
		plugins' results.
	</p>
</section>

<section id="config-loading" class="space-y-4">
	<h2 class="text-xl font-semibold">Config loading</h2>
	<p class="text-muted-foreground">
		Configuration uses <code>koanf</code> for hierarchical loading with deep merge.
		Five sources load in precedence order, later sources win on conflict. The full load
		takes under 45 microseconds.
	</p>
	<CodeBlock html={codeSnippets.configPrecedence} />
	<p class="text-muted-foreground">
		Deep merge means a project config only needs to override the specific keys it cares
		about - everything else falls through from global config or defaults. See the
		<a href="/docs/configuration" class="underline underline-offset-2 hover:text-foreground">configuration guide</a> for the full TOML schema.
	</p>
</section>

<section id="backup-system" class="space-y-4">
	<h2 class="text-xl font-semibold">Backup system</h2>
	<p class="text-muted-foreground">
		Config changes are automatically snapshotted before writes. Each snapshot is a full
		TOML dump with a SHA-256 checksum, stored separately for global and per-project scope.
		Retention policies keep storage bounded.
	</p>
	<CodeBlock html={codeSnippets.backupFlow} />
	<p class="text-muted-foreground">
		Restoring a backup creates a backup of the current config first (safety net), then
		overwrites with the selected snapshot. See the
		<a href="/docs/backup" class="underline underline-offset-2 hover:text-foreground">backup guide</a> for CLI commands and retention tuning.
	</p>
</section>

<section id="crash-recovery" class="space-y-4">
	<h2 class="text-xl font-semibold">Crash recovery</h2>
	<p class="text-muted-foreground">
		klaudiush wraps the entire dispatch path in a panic recovery handler. If anything
		panics, it writes a crash dump and exits 3 instead of crashing uncontrolled. This
		is a deliberate fail-open design - a bug in klaudiush should never permanently block
		a developer's workflow.
	</p>
	<CodeBlock html={codeSnippets.crashRecovery} />
	<p class="text-muted-foreground">
		Crash dumps are stored at <code>~/.klaudiush/crashes/</code> and can be inspected
		with <code>klaudiush debug crash list</code> and <code>klaudiush debug crash view</code>.
		Secrets in the hook event payload are redacted before writing the dump.
	</p>
</section>

<section id="source-layout" class="space-y-4">
	<h2 class="text-xl font-semibold">Source layout</h2>
	<p class="text-muted-foreground">
		The Go source is split between <code>pkg/</code> (public API types) and
		<code>internal/</code> (implementation). Validators live in category subdirectories
		under <code>internal/validators/</code>.
	</p>
	<CodeBlock html={codeSnippets.directoryLayout} />
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
