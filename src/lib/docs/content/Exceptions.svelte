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
		The exception workflow lets Claude Code bypass specific validation blocks with an explicit
		acknowledgment token. When klaudiush blocks a command, adding an <code>EXC:</code> token
		to the command overrides the block. Every attempt, allowed or denied, is logged to disk
		before the result is returned. Rate limits and per-code policies apply.
	</p>
	<p class="text-muted-foreground">
		By default, any error code can be bypassed if a valid token is provided. Set
		<code>require_explicit_policy = true</code> to restrict bypasses to codes that have an
		explicit policy entry.
	</p>
</section>

<section id="quick-start" class="space-y-4">
	<h2 class="text-xl font-semibold">Quick start</h2>
	<p class="text-muted-foreground">
		Enable exceptions and define a policy for the error code you want to bypass:
	</p>
	<CodeBlock html={codeSnippets.config} />
	<p class="text-muted-foreground">
		When Claude encounters a block, it can add a token to bypass it:
	</p>
	<CodeBlock html={codeSnippets.usage} />
</section>

<section id="how-it-works" class="space-y-4">
	<h2 class="text-xl font-semibold">How it works</h2>
	<p class="text-muted-foreground">
		When a validator returns a blocking error, the dispatcher runs the exception check before
		returning the result to Claude Code:
	</p>
	<ol class="list-decimal space-y-2 pl-6 text-sm text-muted-foreground">
		<li>Validator returns a blocking error with an error code (e.g., <code>GIT019</code>)</li>
		<li>klaudiush scans the command for an exception token - env var first, then shell comment</li>
		<li>Token error code must exactly match the blocking error code</li>
		<li>Policy check: <code>allow_exception</code> must be true, reason rules must pass</li>
		<li>Rate limit check: global and per-code limits both must pass</li>
		<li>If all checks pass: block becomes a warning tagged <code>[BYPASSED]</code>, audit entry written</li>
		<li>If any check fails: original block stands, audit entry written with denial reason</li>
	</ol>
	<Callout type="info">
		<p>A successfully bypassed block becomes a non-blocking warning, so Claude Code can
		continue. A failed bypass or missing token leaves the original block in place.</p>
	</Callout>
</section>

<section id="token-format" class="space-y-4">
	<h2 class="text-xl font-semibold">Token format</h2>
	<p class="text-muted-foreground">
		Exception tokens follow this format: <code>EXC:&lt;ERROR_CODE&gt;:&lt;URL_ENCODED_REASON&gt;</code>
	</p>
	<h3 class="text-lg font-medium">Placement</h3>
	<p class="text-muted-foreground">
		Tokens can go in a shell comment (recommended) or the <code>KLACK</code> environment
		variable. When both are present, the env var takes priority.
	</p>
	<CodeBlock html={codeSnippets.tokenPlacement} />
	<Callout type="info" title="URL encoding">
		<p>Reasons must be URL-encoded: spaces become <code>+</code>, <code>#</code> becomes
		<code>%23</code>, etc. This avoids shell parsing issues.</p>
	</Callout>
	<h3 class="text-lg font-medium">Parsing rules</h3>
	<p class="text-muted-foreground">
		Two constraints prevent accidental or injected matches:
	</p>
	<CodeBlock html={codeSnippets.tokenParsing} />
	<ul class="list-disc space-y-2 pl-6 text-sm text-muted-foreground">
		<li>
			The token must start at a word boundary (after whitespace or at the start of a
			comment). <code>NOEXC:GIT019:reason</code> does not match because there is no
			whitespace before <code>EXC:</code>.
		</li>
		<li>
			Only literal strings are accepted. Tokens containing <code>$&#123;...&#125;</code>
			or <code>$(...)</code> are rejected entirely.
		</li>
	</ul>
</section>

<section id="policies" class="space-y-4">
	<h2 class="text-xl font-semibold">Policy configuration</h2>
	<p class="text-muted-foreground">
		Each error code gets its own policy with independent settings:
	</p>
	<CodeBlock html={codeSnippets.policyConfig} />

	<div class="overflow-x-auto">
		<table class="w-full text-sm">
			<thead>
				<tr class="border-b border-border">
					<th class="py-2 pr-4 text-left font-medium">Option</th>
					<th class="py-2 pr-4 text-left font-medium">Default</th>
					<th class="py-2 text-left font-medium">Description</th>
				</tr>
			</thead>
			<tbody class="text-muted-foreground">
				<tr class="border-b border-border/50"><td class="py-2 pr-4"><code>allow_exception</code></td><td class="py-2 pr-4">true</td><td class="py-2">Allow exceptions for this code</td></tr>
				<tr class="border-b border-border/50"><td class="py-2 pr-4"><code>require_reason</code></td><td class="py-2 pr-4">false</td><td class="py-2">Require justification</td></tr>
				<tr class="border-b border-border/50"><td class="py-2 pr-4"><code>min_reason_length</code></td><td class="py-2 pr-4">10</td><td class="py-2">Minimum reason length in runes, not bytes</td></tr>
				<tr class="border-b border-border/50"><td class="py-2 pr-4"><code>valid_reasons</code></td><td class="py-2 pr-4">[]</td><td class="py-2">Pre-approved reasons (exact match, case-insensitive)</td></tr>
				<tr class="border-b border-border/50"><td class="py-2 pr-4"><code>max_per_hour</code></td><td class="py-2 pr-4">0</td><td class="py-2">Hourly limit (0 = unlimited)</td></tr>
				<tr><td class="py-2 pr-4"><code>max_per_day</code></td><td class="py-2 pr-4">0</td><td class="py-2">Daily limit (0 = unlimited)</td></tr>
			</tbody>
		</table>
	</div>

	<h3 class="text-lg font-medium">Requiring explicit policies</h3>
	<p class="text-muted-foreground">
		By default, any error code can be bypassed as long as a valid token is provided. Set
		<code>require_explicit_policy = true</code> in the <code>[exceptions]</code> block to
		restrict bypasses to codes that have an explicit policy entry. Tokens for unconfigured
		codes are denied.
	</p>
	<CodeBlock html={codeSnippets.requireExplicitPolicy} />

	<h3 class="text-lg font-medium">Reason matching</h3>
	<p class="text-muted-foreground">
		When <code>valid_reasons</code> is set, the decoded reason must exactly match one of the
		listed values (case-insensitive). Prefix matching is not used - <code>"Emergency hotfix
		for prod"</code> does not satisfy approved reason <code>"Emergency hotfix"</code>.
		Length is counted in runes, so CJK characters and emoji each count as one.
	</p>
</section>

<section id="rate-limiting" class="space-y-4">
	<h2 class="text-xl font-semibold">Rate limiting</h2>
	<p class="text-muted-foreground">
		Global and per-code rate limits cap how often exceptions can be used. Both must pass for
		a bypass to succeed. Global limits apply across all error codes combined; per-code limits
		are set in the policy entry.
	</p>
	<CodeBlock html={codeSnippets.rateLimits} />
	<p class="text-muted-foreground">
		Hourly windows reset on the hour. Daily windows reset at local midnight, not UTC, so
		limits turn over when the day changes in the user's timezone. Rate limit state is
		per-project: each project gets its own counters at
		<code>~/.klaudiush/exceptions/state_&lt;hash&gt;.json</code>, derived from the project
		directory path. One project's exception usage does not affect another.
	</p>
</section>

<section id="audit" class="space-y-4">
	<h2 class="text-xl font-semibold">Audit logging</h2>
	<p class="text-muted-foreground">
		Every exception attempt - allowed or denied - is appended as a JSON line to
		<code>~/.klaudiush/exception_audit.jsonl</code>. The audit log is global across all
		projects. Entries are fsynced to disk before returning, so no bypass goes unrecorded
		even if the process exits immediately after.
	</p>
	<p class="text-muted-foreground">Each entry includes:</p>
	<ul class="list-disc space-y-1 pl-6 text-sm text-muted-foreground">
		<li><code>timestamp</code>, <code>error_code</code>, <code>validator_name</code></li>
		<li><code>allowed</code> (bool), <code>reason</code>, <code>denial_reason</code></li>
		<li><code>source</code> - <code>"comment"</code> or <code>"env_var"</code></li>
		<li><code>command</code> (truncated to 200 chars), <code>working_dir</code>, <code>repository</code></li>
	</ul>
	<CodeBlock html={codeSnippets.auditCommands} />
	<p class="text-muted-foreground">
		Audit log rotation is configured under <code>[exceptions.audit]</code>: <code>max_size_mb</code>,
		<code>max_age_days</code>, and <code>max_backups</code> control when and how old log
		files are rotated. <code>audit cleanup</code> manually removes entries older than
		<code>max_age_days</code>.
	</p>
</section>

<section id="debug" class="space-y-4">
	<h2 class="text-xl font-semibold">Debug commands</h2>
	<p class="text-muted-foreground">
		Use <code>debug exceptions</code> to inspect the active policy configuration for the
		current project. Add <code>--state</code> to also show current rate limit counters.
	</p>
	<CodeBlock html={codeSnippets.debugCommands} />
</section>

<section id="rules-integration" class="space-y-4">
	<h2 class="text-xl font-semibold">Integration with rules</h2>
	<p class="text-muted-foreground">
		Custom <a href="/docs/rules" class="underline underline-offset-2 hover:text-foreground">rules</a>
		can support exception bypasses by adding a <code>reference</code> to the block action.
		Built-in validator error codes (<code>GIT001</code>-<code>GIT024</code>,
		<code>FILE001</code>-<code>FILE005</code>, <code>SEC001</code>-<code>SEC005</code>)
		work the same way.
	</p>
	<CodeBlock html={codeSnippets.rulesIntegration} />
</section>

<section id="examples" class="space-y-4">
	<h2 class="text-xl font-semibold">Examples</h2>
	<h3 class="text-lg font-medium">Strict policy (no exceptions)</h3>
	<CodeBlock html={codeSnippets.strictPolicy} />
	<h3 class="text-lg font-medium">Test fixture secrets</h3>
	<CodeBlock html={codeSnippets.testFixtureSecrets} />
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
