<script lang="ts">
	import { siteConfig } from '$lib/config';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import {
		GitBranch,
		FileCheck,
		ShieldCheck,
		Settings,
		Terminal,
		Zap,
		ArrowRight
	} from '@lucide/svelte';
</script>

<svelte:head>
	<title>klaudiush - validation dispatcher for Claude Code hooks</title>
</svelte:head>

<div class="space-y-16">
	<section class="space-y-6 py-16 text-center">
		<h1 class="font-mono text-4xl font-bold tracking-tight">klaudiush</h1>
		<p class="text-xl text-muted-foreground">Validation dispatcher for Claude Code hooks</p>
		<p class="mx-auto max-w-xl text-base text-muted-foreground">
			Intercepts tool invocations and enforces git workflow standards, commit conventions, and code
			quality rules before execution.
		</p>
		<div class="flex items-center justify-center gap-3">
			<Button href="#install">Install</Button>
			<Button variant="outline" href={siteConfig.github} target="_blank" rel="noopener noreferrer"
				>GitHub</Button
			>
			<Button variant="outline" href="/e/">Error docs</Button>
		</div>
	</section>

	<section class="space-y-6">
		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			<Card.Root>
				<Card.Header class="pb-3">
					<div class="flex items-center gap-2">
						<GitBranch class="h-5 w-5 text-muted-foreground" />
						<Card.Title class="text-base">Git workflow</Card.Title>
					</div>
				</Card.Header>
				<Card.Content>
					<p class="text-sm text-muted-foreground">
						Commit message format, required flags (-sS), staging validation, push policies, branch
						naming, PR checks.
					</p>
				</Card.Content>
			</Card.Root>

			<Card.Root>
				<Card.Header class="pb-3">
					<div class="flex items-center gap-2">
						<FileCheck class="h-5 w-5 text-muted-foreground" />
						<Card.Title class="text-base">File quality</Card.Title>
					</div>
				</Card.Header>
				<Card.Content>
					<p class="text-sm text-muted-foreground">
						Shellcheck, markdownlint, terraform fmt, tflint, actionlint, gofumpt, ruff, oxlint,
						rustfmt.
					</p>
				</Card.Content>
			</Card.Root>

			<Card.Root>
				<Card.Header class="pb-3">
					<div class="flex items-center gap-2">
						<ShieldCheck class="h-5 w-5 text-muted-foreground" />
						<Card.Title class="text-base">Secret detection</Card.Title>
					</div>
				</Card.Header>
				<Card.Content>
					<p class="text-sm text-muted-foreground">
						25+ regex patterns for AWS, GitHub tokens, private keys, connection strings. Optional
						gitleaks integration.
					</p>
				</Card.Content>
			</Card.Root>

			<Card.Root>
				<Card.Header class="pb-3">
					<div class="flex items-center gap-2">
						<Settings class="h-5 w-5 text-muted-foreground" />
						<Card.Title class="text-base">Dynamic rules</Card.Title>
					</div>
				</Card.Header>
				<Card.Content>
					<p class="text-sm text-muted-foreground">
						TOML configuration, glob/regex pattern matching, priority system, per-validator scoping.
						No code changes needed.
					</p>
				</Card.Content>
			</Card.Root>

			<Card.Root>
				<Card.Header class="pb-3">
					<div class="flex items-center gap-2">
						<Terminal class="h-5 w-5 text-muted-foreground" />
						<Card.Title class="text-base">Bash parsing</Card.Title>
					</div>
				</Card.Header>
				<Card.Content>
					<p class="text-sm text-muted-foreground">
						AST parsing via mvdan.cc/sh. Command chains, pipes, subshells, redirections, heredocs,
						file write detection.
					</p>
				</Card.Content>
			</Card.Root>

			<Card.Root>
				<Card.Header class="pb-3">
					<div class="flex items-center gap-2">
						<Zap class="h-5 w-5 text-muted-foreground" />
						<Card.Title class="text-base">Performance</Card.Title>
					</div>
				</Card.Header>
				<Card.Content>
					<p class="text-sm text-muted-foreground">
						&lt;100ms cold start, &lt;100us parser, &lt;50ms per validator, &lt;500ms full chain,
						&lt;1ms per rule evaluation.
					</p>
				</Card.Content>
			</Card.Root>
		</div>
	</section>

	<section id="install" class="space-y-6">
		<h2 class="text-2xl font-semibold">Installation</h2>
		<div class="grid gap-4 sm:grid-cols-2">
			<div class="space-y-2">
				<p class="text-sm font-medium">Homebrew</p>
				<pre
					class="rounded-lg border border-[oklch(0.9_0.005_67)] bg-[oklch(0.97_0.003_67)] p-4 font-mono text-sm text-[oklch(0.25_0.01_67)]"><code
						>brew tap smykla-skalski/tap
brew install klaudiush</code
					></pre>
			</div>
			<div class="space-y-2">
				<p class="text-sm font-medium">Install script</p>
				<pre
					class="rounded-lg border border-[oklch(0.9_0.005_67)] bg-[oklch(0.97_0.003_67)] p-4 font-mono text-sm text-[oklch(0.25_0.01_67)]"><code
						>curl -fsSL https://klaudiu.sh/install | sh</code
					></pre>
			</div>
		</div>
		<div class="space-y-2">
			<p class="text-sm text-muted-foreground">Then run the setup wizard:</p>
			<pre
				class="rounded-lg border border-[oklch(0.9_0.005_67)] bg-[oklch(0.97_0.003_67)] p-4 font-mono text-sm text-[oklch(0.25_0.01_67)]"><code
					>klaudiush init --global
klaudiush doctor</code
				></pre>
		</div>
		<p class="text-sm text-muted-foreground">
			Also available via Nix and from source. See the <a
				href="{siteConfig.github}#readme"
				target="_blank"
				rel="noopener noreferrer"
				class="underline underline-offset-2 hover:text-foreground">GitHub README</a
			> for all options.
		</p>
	</section>

	<section class="space-y-4">
		<h2 class="text-2xl font-semibold">Claude Code configuration</h2>
		<p class="text-sm text-muted-foreground">
			Add to <code
				class="rounded border border-[oklch(0.9_0.005_67)] bg-[oklch(0.96_0.005_67)] px-1.5 py-0.5 font-mono text-xs text-[oklch(0.25_0.01_67)]"
				>~/.claude/settings.json</code
			>:
		</p>
		<pre
			class="rounded-lg border border-[oklch(0.9_0.005_67)] bg-[oklch(0.97_0.003_67)] p-4 font-mono text-sm text-[oklch(0.25_0.01_67)]"><code
				>{`{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash|Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "klaudiush validate"
          }
        ]
      }
    ]
  }
}`}</code
			></pre>
	</section>

	<section class="flex justify-center">
		<Card.Root class="w-full max-w-lg text-center">
			<Card.Header>
				<Card.Title>Error reference</Card.Title>
				<Card.Description>
					Browse all error codes with explanations and fix instructions.
				</Card.Description>
			</Card.Header>
			<Card.Content>
				<Button href="/e/" class="gap-2">
					Browse errors
					<ArrowRight class="h-4 w-4" />
				</Button>
			</Card.Content>
		</Card.Root>
	</section>
</div>
