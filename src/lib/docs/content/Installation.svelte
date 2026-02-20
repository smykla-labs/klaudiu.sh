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
		klaudiush ships as a single binary with no runtime dependencies. Pick the install method
		that fits your setup. All methods put the <code>klaudiush</code> binary on your PATH.
	</p>
</section>

<section id="homebrew" class="space-y-4">
	<h2 class="text-xl font-semibold">Homebrew</h2>
	<p class="text-muted-foreground">
		The recommended method for macOS and Linux. Installs from the official Homebrew tap
		with automatic updates via <code>brew upgrade</code>.
	</p>
	<CodeBlock html={codeSnippets.homebrew} />
</section>

<section id="install-script" class="space-y-4">
	<h2 class="text-xl font-semibold">Install script</h2>
	<p class="text-muted-foreground">
		The install script detects your platform (Linux, macOS, Windows), architecture
		(amd64, arm64), downloads the binary from GitHub releases, and verifies SHA256
		checksums. Default install directory is <code>~/.local/bin</code>.
	</p>
	<CodeBlock html={codeSnippets.installScript} />
	<Callout type="warning" title="PATH check">
		<p>The script warns if the install directory isn't in your PATH. Add it to your
		shell profile if needed.</p>
	</Callout>
</section>

<section id="nix" class="space-y-4">
	<h2 class="text-xl font-semibold">Nix flake</h2>
	<p class="text-muted-foreground">
		Run directly or install to your Nix profile. The flake supports all platforms via
		the overlay system.
	</p>
	<CodeBlock html={codeSnippets.nix} />
	<p class="text-muted-foreground">
		For Home Manager integration, import the module and enable the program:
	</p>
	<CodeBlock html={codeSnippets.nixHomeManager} />
</section>

<section id="from-source" class="space-y-4">
	<h2 class="text-xl font-semibold">From source</h2>
	<p class="text-muted-foreground">
		Requires Go 1.24+ and <a href="https://taskfile.dev" class="underline underline-offset-2 hover:text-foreground">Task</a>.
		Builds with optimizations and installs to <code>~/.local/bin</code>.
	</p>
	<CodeBlock html={codeSnippets.fromSource} />
</section>

<section id="shell-completion" class="space-y-4">
	<h2 class="text-xl font-semibold">Shell completion</h2>
	<p class="text-muted-foreground">
		Generate and install tab completions for your shell. Completions cover all commands,
		subcommands, and flags.
	</p>
	<CodeBlock html={codeSnippets.completion} />
</section>

<section id="updating" class="space-y-4">
	<h2 class="text-xl font-semibold">Updating</h2>
	<p class="text-muted-foreground">
		klaudiush has a built-in self-update command that downloads the release from GitHub,
		verifies the SHA256 checksum, and atomically replaces the binary.
	</p>
	<CodeBlock html={codeSnippets.selfUpdate} />
	<p class="text-muted-foreground text-sm">
		Homebrew users can also update via <code>brew upgrade klaudiush</code>. The self-update
		command resolves symlinks, so it works correctly with Homebrew installs.
	</p>
</section>

<section id="verify" class="space-y-4">
	<h2 class="text-xl font-semibold">Verify installation</h2>
	<p class="text-muted-foreground">
		Check that the binary is available and run the doctor command to verify your setup.
	</p>
	<CodeBlock html={codeSnippets.verify} />
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
