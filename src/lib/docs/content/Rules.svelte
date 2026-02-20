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
		The rule engine lets you define validation behavior through TOML files. Rules can block operations
		based on patterns (repository, branch, file, command), warn about risky actions, or allow
		operations that built-in validators would normally block.
	</p>
	<p class="text-muted-foreground">
		The engine auto-detects glob and regex patterns, evaluates rules by priority (highest first),
		merges project config over global config, and stops on the first matching rule by default.
	</p>
</section>

<section id="quick-start" class="space-y-4">
	<h2 class="text-xl font-semibold">Quick start</h2>
	<p class="text-muted-foreground">
		Create a rule file at <code>.klaudiush/config.toml</code> in your project root. Here's
		a rule that blocks direct pushes to main:
	</p>
	<CodeBlock html={codeSnippets.quickStart} />
	<p class="text-muted-foreground">
		Global rules go in <code>~/.klaudiush/config.toml</code> and apply to all projects. Project
		rules override global rules when they share the same name.
	</p>
	<CodeBlock html={codeSnippets.globalRule} />
	<p class="text-muted-foreground">Verify your rules load with debug logging:</p>
	<CodeBlock html={codeSnippets.debugRules} />
</section>

<section id="rule-config" class="space-y-4">
	<h2 class="text-xl font-semibold">Rule configuration</h2>
	<p class="text-muted-foreground">
		Each rule has a unique name, optional priority, match conditions, and an action. All match
		conditions use AND logic - every non-empty condition must match for the rule to fire.
	</p>
	<CodeBlock html={codeSnippets.ruleConfig} />
	<Callout type="info" title="Priority">
		<p>Rules evaluate from highest priority to lowest. When <code>stop_on_first_match</code> is
		true (the default), the first matching rule wins.</p>
	</Callout>
</section>

<section id="pattern-matching" class="space-y-4">
	<h2 class="text-xl font-semibold">Pattern matching</h2>
	<p class="text-muted-foreground">
		The engine detects glob vs regex automatically. If the pattern contains anchors
		(<code>^</code>, <code>$</code>), character classes (<code>[</code>), or quantifiers
		(<code>+</code>, <code>.*</code>), it's treated as regex. Otherwise, it's a glob.
	</p>
	<h3 class="text-lg font-medium">Glob patterns</h3>
	<CodeBlock html={codeSnippets.globPatterns} />
	<h3 class="text-lg font-medium">Regex patterns</h3>
	<CodeBlock html={codeSnippets.regexPatterns} />
</section>

<section id="match-conditions" class="space-y-4">
	<h2 class="text-xl font-semibold">Match conditions</h2>
	<p class="text-muted-foreground">
		Combine these conditions freely. Omitted conditions match everything.
	</p>

	<div class="overflow-x-auto">
		<table class="w-full text-sm">
			<thead>
				<tr class="border-b border-border">
					<th class="py-2 pr-4 text-left font-medium">Condition</th>
					<th class="py-2 text-left font-medium">Description</th>
				</tr>
			</thead>
			<tbody class="text-muted-foreground">
				<tr class="border-b border-border/50"><td class="py-2 pr-4"><code>validator_type</code></td><td class="py-2">Filter by validator (<code>git.push</code>, <code>git.*</code>, <code>*</code>)</td></tr>
				<tr class="border-b border-border/50"><td class="py-2 pr-4"><code>repo_pattern</code></td><td class="py-2">Match repository root path</td></tr>
				<tr class="border-b border-border/50"><td class="py-2 pr-4"><code>branch_pattern</code></td><td class="py-2">Match branch name</td></tr>
				<tr class="border-b border-border/50"><td class="py-2 pr-4"><code>file_pattern</code></td><td class="py-2">Match file path</td></tr>
				<tr class="border-b border-border/50"><td class="py-2 pr-4"><code>command_pattern</code></td><td class="py-2">Match bash command</td></tr>
				<tr class="border-b border-border/50"><td class="py-2 pr-4"><code>content_pattern</code></td><td class="py-2">Match file content (always regex)</td></tr>
				<tr class="border-b border-border/50"><td class="py-2 pr-4"><code>tool_type</code></td><td class="py-2">Match hook tool type (<code>Bash</code>, <code>Write</code>, etc.)</td></tr>
				<tr><td class="py-2 pr-4"><code>event_type</code></td><td class="py-2">Match hook event (<code>PreToolUse</code>)</td></tr>
			</tbody>
		</table>
	</div>
</section>

<section id="actions" class="space-y-4">
	<h2 class="text-xl font-semibold">Actions</h2>
	<p class="text-muted-foreground">
		Three action types determine what happens when a rule matches:
	</p>
	<CodeBlock html={codeSnippets.actions} />
	<Callout type="warning" title="allow rules skip validation">
		<p>An <code>allow</code> action bypasses built-in validators entirely. Use it for test
		fixtures and trusted paths, not as a general escape hatch.</p>
	</Callout>
</section>

<section id="precedence" class="space-y-4">
	<h2 class="text-xl font-semibold">Configuration precedence</h2>
	<p class="text-muted-foreground">
		Rules load from multiple sources, highest priority first:
	</p>
	<ol class="list-decimal space-y-1 pl-6 text-sm text-muted-foreground">
		<li>CLI flags</li>
		<li>Environment variables (<code>KLAUDIUSH_*</code>)</li>
		<li>Project config (<code>.klaudiush/config.toml</code>)</li>
		<li>Global config (<code>~/.klaudiush/config.toml</code>)</li>
		<li>Built-in defaults</li>
	</ol>
	<p class="text-muted-foreground">
		Rules with the same name merge (project wins). Rules with different names combine into one list.
	</p>
</section>

<section id="validators" class="space-y-4">
	<h2 class="text-xl font-semibold">Validator types</h2>
	<div class="overflow-x-auto">
		<table class="w-full text-sm">
			<thead>
				<tr class="border-b border-border">
					<th class="py-2 pr-4 text-left font-medium">Type</th>
					<th class="py-2 text-left font-medium">Description</th>
				</tr>
			</thead>
			<tbody class="text-muted-foreground">
				<tr class="border-b border-border/50"><td class="py-2 pr-4"><code>git.push</code></td><td class="py-2">Push operations</td></tr>
				<tr class="border-b border-border/50"><td class="py-2 pr-4"><code>git.commit</code></td><td class="py-2">Commit operations</td></tr>
				<tr class="border-b border-border/50"><td class="py-2 pr-4"><code>git.add</code></td><td class="py-2">Add operations</td></tr>
				<tr class="border-b border-border/50"><td class="py-2 pr-4"><code>git.pr</code></td><td class="py-2">Pull request operations</td></tr>
				<tr class="border-b border-border/50"><td class="py-2 pr-4"><code>file.*</code></td><td class="py-2">All file validators (markdown, shell, terraform, etc.)</td></tr>
				<tr class="border-b border-border/50"><td class="py-2 pr-4"><code>secrets.secrets</code></td><td class="py-2">Secret detection</td></tr>
				<tr><td class="py-2 pr-4"><code>*</code></td><td class="py-2">All validators</td></tr>
			</tbody>
		</table>
	</div>
</section>

<section id="examples" class="space-y-4">
	<h2 class="text-xl font-semibold">Examples</h2>
	<h3 class="text-lg font-medium">Allow secrets in test files</h3>
	<CodeBlock html={codeSnippets.allowTestSecrets} />
	<h3 class="text-lg font-medium">Require ticket reference for commits to main</h3>
	<CodeBlock html={codeSnippets.requireTicket} />
	<h3 class="text-lg font-medium">Block origin push in org repos</h3>
	<CodeBlock html={codeSnippets.blockOrgOrigin} />
</section>

<section id="exceptions" class="space-y-3">
	<h2 class="text-xl font-semibold">Exceptions integration</h2>
	<p class="text-muted-foreground">
		Rules that block operations can support exception bypasses. Add a <code>reference</code> field
		to the action, then configure an <a href="/docs/exceptions" class="underline underline-offset-2 hover:text-foreground">exception policy</a>
		for that reference.
	</p>
	<CodeBlock html={codeSnippets.exceptionsIntegration} />
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
