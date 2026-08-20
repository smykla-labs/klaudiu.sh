<script lang="ts">
	import { siteConfig } from '$lib/config';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import CopyButton from '$lib/components/CopyButton.svelte';
	import HeroBackground from '$lib/components/HeroBackground.svelte';
	import {
		GitBranch,
		FileCheck,
		ShieldCheck,
		Settings,
		Terminal,
		Zap,
		ArrowRight
	} from '@lucide/svelte';
	import GithubIcon from '$lib/components/GithubIcon.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>klaudiush - validation dispatcher for Claude Code hooks</title>
</svelte:head>

<div class="relative space-y-16">
	<HeroBackground />
	<section class="relative py-16 text-center">
		<div class="space-y-6">
			<h1 class="font-mono text-4xl font-bold tracking-tight">klaudiush</h1>
			<p class="text-xl text-muted-foreground">Validation dispatcher for Claude Code hooks</p>
			<p class="mx-auto max-w-xl text-base text-muted-foreground">
				Intercepts tool invocations and enforces git workflow standards and code
				quality rules before execution.
			</p>
			<div class="flex items-center justify-center gap-3">
				<Button href="#install">Install</Button>
				<Button variant="outline" href="/docs/">Docs</Button>
				<Button variant="outline" href="/e/">Error docs</Button>
				<Button
					variant="outline"
					href={siteConfig.github}
					target="_blank"
					rel="noopener noreferrer"><GithubIcon class="h-4 w-4" /> GitHub</Button
				>
			</div>
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
						~60ms cold start, &lt;25us parser, &lt;50ms per validator, &lt;115ms full chain,
						&lt;11us per rule evaluation.
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
				<div class="shiki-block group relative">
					<!-- eslint-disable-next-line svelte/no-at-html-tags -- server-highlighted code -->
					{@html data.brewHtml}
					<CopyButton />
				</div>
			</div>
			<div class="space-y-2">
				<p class="text-sm font-medium">Install script</p>
				<div class="shiki-block group relative">
					<!-- eslint-disable-next-line svelte/no-at-html-tags -- server-highlighted code -->
					{@html data.curlHtml}
					<CopyButton />
				</div>
			</div>
		</div>
		<div class="space-y-2">
			<p class="text-sm text-muted-foreground">Then run the setup wizard (registers the hook and creates config):</p>
			<div class="shiki-block group relative">
				<!-- eslint-disable-next-line svelte/no-at-html-tags -- server-highlighted code -->
				{@html data.setupHtml}
				<CopyButton />
			</div>
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

	<section>
		<div class="grid gap-4 sm:grid-cols-3">
			<Card.Root class="text-center">
				<Card.Header>
					<Card.Title>Documentation</Card.Title>
					<Card.Description>
						Guides for rules, backups, plugins, and exceptions.
					</Card.Description>
				</Card.Header>
				<Card.Content>
					<Button href="/docs/" class="gap-2">
						Browse docs
						<ArrowRight class="h-4 w-4" />
					</Button>
				</Card.Content>
			</Card.Root>
			<Card.Root class="text-center">
				<Card.Header>
					<Card.Title>Examples</Card.Title>
					<Card.Description>
						Ready-to-use config files, rules, and plugin templates.
					</Card.Description>
				</Card.Header>
				<Card.Content>
					<Button href="/docs/examples/" class="gap-2">
						Browse examples
						<ArrowRight class="h-4 w-4" />
					</Button>
				</Card.Content>
			</Card.Root>
			<Card.Root class="text-center">
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
		</div>
	</section>
</div>

<style>
	.shiki-block :global(pre) {
		background: oklch(0.97 0.003 67) !important;
		border: 1px solid oklch(0.9 0.005 67);
		border-radius: 0.5rem;
		padding: 1em 1.25em;
		overflow-x: auto;
		font-size: 0.875rem;
		line-height: 1.65;
		margin: 0;
	}

	.shiki-block :global(code) {
		background: none;
		border: none;
		padding: 0;
		font-size: inherit;
		font-weight: 400;
	}

	.shiki-block :global(.line:empty::after) {
		content: ' ';
	}
</style>
