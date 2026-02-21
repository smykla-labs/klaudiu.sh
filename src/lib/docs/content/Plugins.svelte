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
		Plugins let you add custom validation logic to klaudiush. They're standalone executables
		that communicate via JSON over stdin/stdout. Bash scripts, Python, Go binaries - anything
		that can read stdin and write JSON works.
	</p>
	<p class="text-muted-foreground">
		Each invocation is a fresh process. Plugins are stateless by default and changes to the
		script take effect immediately without a restart.
	</p>
</section>

<section id="quick-start" class="space-y-4">
	<h2 class="text-xl font-semibold">Quick start</h2>
	<h3 class="text-lg font-medium">1. Write a plugin</h3>
	<CodeBlock html={codeSnippets.bashPlugin} />
	<h3 class="text-lg font-medium">2. Install and configure</h3>
	<CodeBlock html={codeSnippets.install} />
	<CodeBlock html={codeSnippets.pluginConfig} />
	<h3 class="text-lg font-medium">3. Test it</h3>
	<CodeBlock html={codeSnippets.testPlugin} />
</section>

<section id="protocol" class="space-y-4">
	<h2 class="text-xl font-semibold">Protocol reference</h2>
	<p class="text-muted-foreground">
		klaudiush calls your plugin in two ways: <code>--info</code> for metadata, and stdin JSON
		for validation requests.
	</p>
	<h3 class="text-lg font-medium">Info request</h3>
	<p class="text-muted-foreground">
		Called with <code>--info</code> to get plugin metadata. Return JSON with <code>name</code>
		and <code>version</code> fields.
	</p>
	<h3 class="text-lg font-medium">Validate request</h3>
	<p class="text-muted-foreground">
		klaudiush writes a JSON object to stdin. Fields present depend on the tool:
	</p>
	<div class="overflow-x-auto">
		<table class="w-full text-sm">
			<thead>
				<tr class="border-b border-border">
					<th class="py-2 pr-4 text-left font-medium">Field</th>
					<th class="py-2 pr-4 text-left font-medium">Present when</th>
					<th class="py-2 text-left font-medium">Description</th>
				</tr>
			</thead>
			<tbody class="text-muted-foreground">
				<tr class="border-b border-border/50"><td class="py-2 pr-4"><code>event_type</code></td><td class="py-2 pr-4">Always</td><td class="py-2"><code>PreToolUse</code>, <code>PostToolUse</code></td></tr>
				<tr class="border-b border-border/50"><td class="py-2 pr-4"><code>tool_name</code></td><td class="py-2 pr-4">Always</td><td class="py-2"><code>Bash</code>, <code>Write</code>, <code>Edit</code>, etc.</td></tr>
				<tr class="border-b border-border/50"><td class="py-2 pr-4"><code>command</code></td><td class="py-2 pr-4">Bash tool</td><td class="py-2">Shell command being run</td></tr>
				<tr class="border-b border-border/50"><td class="py-2 pr-4"><code>file_path</code></td><td class="py-2 pr-4">Write/Edit/Read</td><td class="py-2">Path to the file</td></tr>
				<tr class="border-b border-border/50"><td class="py-2 pr-4"><code>content</code></td><td class="py-2 pr-4">Write tool</td><td class="py-2">Content being written</td></tr>
				<tr><td class="py-2 pr-4"><code>config</code></td><td class="py-2 pr-4">If configured</td><td class="py-2">Plugin-specific config from TOML</td></tr>
			</tbody>
		</table>
	</div>

	<h3 class="text-lg font-medium">Validate response</h3>
	<p class="text-muted-foreground">Return a JSON object with your validation result:</p>
	<div class="overflow-x-auto">
		<table class="w-full text-sm">
			<thead>
				<tr class="border-b border-border">
					<th class="py-2 pr-4 text-left font-medium">Field</th>
					<th class="py-2 pr-4 text-left font-medium">Required</th>
					<th class="py-2 text-left font-medium">Description</th>
				</tr>
			</thead>
			<tbody class="text-muted-foreground">
				<tr class="border-b border-border/50"><td class="py-2 pr-4"><code>passed</code></td><td class="py-2 pr-4">Yes</td><td class="py-2">Whether validation passed</td></tr>
				<tr class="border-b border-border/50"><td class="py-2 pr-4"><code>should_block</code></td><td class="py-2 pr-4">Yes</td><td class="py-2">Whether to block the operation</td></tr>
				<tr class="border-b border-border/50"><td class="py-2 pr-4"><code>message</code></td><td class="py-2 pr-4">No</td><td class="py-2">Human-readable result message</td></tr>
				<tr class="border-b border-border/50"><td class="py-2 pr-4"><code>error_code</code></td><td class="py-2 pr-4">No</td><td class="py-2">Unique error identifier</td></tr>
				<tr><td class="py-2 pr-4"><code>fix_hint</code></td><td class="py-2 pr-4">No</td><td class="py-2">Short fix suggestion</td></tr>
			</tbody>
		</table>
	</div>
	<Callout type="warning" title="Always exit 0">
		<p>Communicate validation failures through JSON, not exit codes. Non-zero exits cause
		fail-open behavior - the operation proceeds and the error is logged.</p>
	</Callout>
</section>

<section id="predicates" class="space-y-4">
	<h2 class="text-xl font-semibold">Predicate matching</h2>
	<p class="text-muted-foreground">
		Predicates control when your plugin is invoked. All conditions must match (AND logic).
		Omitting a predicate means "match all" for that dimension.
	</p>
	<CodeBlock html={codeSnippets.predicates} />
</section>

<section id="python-example" class="space-y-4">
	<h2 class="text-xl font-semibold">Python example</h2>
	<p class="text-muted-foreground">
		Same protocol, different language. This plugin blocks binary file writes:
	</p>
	<CodeBlock html={codeSnippets.pythonPlugin} />
</section>

<section id="best-practices" class="space-y-3">
	<h2 class="text-xl font-semibold">Best practices</h2>
	<ul class="list-disc space-y-2 pl-6 text-sm text-muted-foreground">
		<li>Return early for non-matching contexts instead of doing unnecessary work.</li>
		<li>Use narrow predicates so the plugin is only spawned when relevant.</li>
		<li>Keep startup fast - each invocation is a fresh process.</li>
		<li>Set reasonable timeouts: 1-5s for fast checks, 10-30s for external APIs.</li>
		<li>Only write the JSON response to stdout. Diagnostics go to stderr.</li>
		<li>Use <code>error_code</code> for programmatic handling and doc links.</li>
	</ul>
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
