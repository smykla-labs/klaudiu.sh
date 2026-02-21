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
		This page documents breaking changes between versions and how to upgrade. klaudiush
		follows semantic versioning - breaking changes only happen in minor version bumps
		during the pre-1.0 phase.
	</p>
</section>

<section id="v0-2" class="space-y-4">
	<h2 class="text-xl font-semibold">v1.17 to v1.18</h2>
	<p class="text-muted-foreground">
		v1.18 changed how klaudiush communicates with Claude Code. Instead of exit codes,
		it now uses JSON stdout for all responses. This is the only breaking change so far.
	</p>
	<CodeBlock html={codeSnippets.jsonMigration} />
	<Callout type="warning" title="Exit code change">
		<p>If you have scripts that check for exit code 2, they need to parse JSON stdout
		instead. Exit code 2 is no longer used.</p>
	</Callout>
	<p class="text-muted-foreground">
		The reason for this change: Claude Code conflates exit code 2 with user denials.
		With JSON output, the model gets structured error information and can self-correct.
		See <a href="/docs/adr/0001" class="underline underline-offset-2 hover:text-foreground">ADR-0001</a> for
		the full rationale.
	</p>
</section>

<section id="json-stdout" class="space-y-4">
	<h2 class="text-xl font-semibold">JSON stdout migration</h2>
	<p class="text-muted-foreground">
		The new JSON output format includes separate fields for model-facing and user-facing
		messages:
	</p>
	<CodeBlock html={codeSnippets.jsonOutput} />

	<div class="overflow-x-auto">
		<table class="w-full text-sm">
			<thead>
				<tr class="border-b border-border">
					<th class="py-2 pr-4 text-left font-medium">Field</th>
					<th class="py-2 text-left font-medium">Purpose</th>
				</tr>
			</thead>
			<tbody class="text-muted-foreground">
				<tr class="border-b border-border/50"><td class="py-2 pr-4"><code>permissionDecision</code></td><td class="py-2">deny or allow - replaces exit code</td></tr>
				<tr class="border-b border-border/50"><td class="py-2 pr-4"><code>permissionDecisionReason</code></td><td class="py-2">Error code and message for the model to self-correct</td></tr>
				<tr class="border-b border-border/50"><td class="py-2 pr-4"><code>additionalContext</code></td><td class="py-2">Extra context the model can use</td></tr>
				<tr><td class="py-2 pr-4"><code>systemMessage</code></td><td class="py-2">Message shown to the user in the terminal</td></tr>
			</tbody>
		</table>
	</div>
</section>

<section id="upgrade-steps" class="space-y-4">
	<h2 class="text-xl font-semibold">Upgrade steps</h2>
	<p class="text-muted-foreground">
		For most users, upgrading is just updating the binary. Configuration files are
		backwards-compatible - all existing configs continue to work.
	</p>
	<CodeBlock html={codeSnippets.upgradeSteps} />
	<p class="text-muted-foreground">
		klaudiush also has a self-update command:
	</p>
	<CodeBlock html={codeSnippets.selfUpdate} />
	<p class="text-muted-foreground">
		On first run after upgrade, klaudiush automatically backs up your existing config
		before applying any changes. You can restore the backup with
		<code>klaudiush backup restore</code> if anything goes wrong.
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
