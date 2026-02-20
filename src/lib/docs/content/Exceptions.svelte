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
		The exception workflow lets Claude Code bypass specific validation denials when an exception
		policy exists, Claude includes an acknowledgment token, and rate limits haven't been exceeded.
		Every exception is logged in a JSONL audit trail.
	</p>
</section>

<section id="quick-start" class="space-y-4">
	<h2 class="text-xl font-semibold">Quick start</h2>
	<p class="text-muted-foreground">
		Enable exceptions and define a policy for the error code you want to bypass:
	</p>
	<CodeBlock html={codeSnippets.config} />
	<p class="text-muted-foreground">
		When Claude encounters a deny response, it can include a token to bypass the block:
	</p>
	<CodeBlock html={codeSnippets.usage} />
</section>

<section id="token-format" class="space-y-4">
	<h2 class="text-xl font-semibold">Token format</h2>
	<p class="text-muted-foreground">
		Exception tokens follow this format: <code>EXC:&lt;ERROR_CODE&gt;:&lt;URL_ENCODED_REASON&gt;</code>
	</p>
	<h3 class="text-lg font-medium">Placement</h3>
	<p class="text-muted-foreground">
		Tokens can go in a shell comment (recommended) or an environment variable:
	</p>
	<CodeBlock html={codeSnippets.tokenPlacement} />
	<Callout type="info" title="URL encoding">
		<p>Reasons must be URL-encoded: spaces become <code>+</code>, <code>#</code> becomes
		<code>%23</code>, etc. This avoids shell parsing issues.</p>
	</Callout>
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
				<tr class="border-b border-border/50"><td class="py-2 pr-4"><code>min_reason_length</code></td><td class="py-2 pr-4">10</td><td class="py-2">Minimum reason length</td></tr>
				<tr class="border-b border-border/50"><td class="py-2 pr-4"><code>valid_reasons</code></td><td class="py-2 pr-4">[]</td><td class="py-2">Pre-approved reasons (case-insensitive)</td></tr>
				<tr class="border-b border-border/50"><td class="py-2 pr-4"><code>max_per_hour</code></td><td class="py-2 pr-4">0</td><td class="py-2">Hourly limit (0 = unlimited)</td></tr>
				<tr><td class="py-2 pr-4"><code>max_per_day</code></td><td class="py-2 pr-4">0</td><td class="py-2">Daily limit (0 = unlimited)</td></tr>
			</tbody>
		</table>
	</div>
</section>

<section id="rate-limiting" class="space-y-4">
	<h2 class="text-xl font-semibold">Rate limiting</h2>
	<p class="text-muted-foreground">
		Global and per-code rate limits cap how often exceptions can be used. Both must pass for
		an exception to go through.
	</p>
	<CodeBlock html={codeSnippets.rateLimits} />
	<p class="text-muted-foreground">
		Hourly windows reset on the hour, daily windows at midnight. State persists across restarts.
	</p>
</section>

<section id="audit" class="space-y-4">
	<h2 class="text-xl font-semibold">Audit logging</h2>
	<p class="text-muted-foreground">
		Every exception attempt - allowed or denied - is logged in JSONL format at
		<code>~/.klaudiush/exception_audit.jsonl</code>. Entries include the error code, reason,
		command, and whether the exception was allowed.
	</p>
	<CodeBlock html={codeSnippets.auditCommands} />
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
