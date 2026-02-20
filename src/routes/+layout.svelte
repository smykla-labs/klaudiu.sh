<script lang="ts">
	import '../app.css';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();
</script>

<svelte:head>
	<title>klaudiush</title>
	<meta name="description" content="Validation dispatcher for Claude Code hooks" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://klaudiu.sh" />
	<meta property="og:title" content="klaudiush" />
	<meta property="og:description" content="Validation dispatcher for Claude Code hooks" />
	<meta property="og:image" content="https://klaudiu.sh/og.png" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="klaudiush" />
	<meta name="twitter:description" content="Validation dispatcher for Claude Code hooks" />
	<meta name="twitter:image" content="https://klaudiu.sh/og.png" />
</svelte:head>

<div class="flex min-h-screen flex-col">
	<Navbar />
	<main class="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
		{@render children()}
	</main>
	<Footer />
</div>
