<script module lang="ts">
	export type TreeNode = {
		name: string;
		comment?: string;
		children?: TreeNode[];
	};
</script>

<script lang="ts">
	import FileTree from './FileTree.svelte';
	import { FolderOpen, FileText } from '@lucide/svelte';

	interface Props {
		nodes: TreeNode[];
		root?: boolean;
	}

	let { nodes, root = true }: Props = $props();
</script>

{#if root}
	<div class="filetree-container">
		<ul class="filetree text-sm root">
			{#each nodes as node, i (node.name)}
				{@const isLast = i === nodes.length - 1}
				<li class:last={isLast}>
					<span class="row">
						{#if node.children}
							<FolderOpen class="icon text-amber-600" />
						{:else}
							<FileText class="icon text-muted-foreground" />
						{/if}
						<span class="font-mono">{node.name}</span>
						{#if node.comment}
							<span class="text-muted-foreground">- {node.comment}</span>
						{/if}
					</span>
					{#if node.children && node.children.length > 0}
						<FileTree nodes={node.children} root={false} />
					{/if}
				</li>
			{/each}
		</ul>
	</div>
{:else}
	<ul class="filetree text-sm">
		{#each nodes as node, i (node.name)}
			{@const isLast = i === nodes.length - 1}
			<li class:last={isLast}>
				<span class="row">
					{#if node.children}
						<FolderOpen class="icon text-amber-600" />
					{:else}
						<FileText class="icon text-muted-foreground" />
					{/if}
					<span class="font-mono">{node.name}</span>
					{#if node.comment}
						<span class="text-muted-foreground">- {node.comment}</span>
					{/if}
				</span>
				{#if node.children && node.children.length > 0}
					<FileTree nodes={node.children} root={false} />
				{/if}
			</li>
		{/each}
	</ul>
{/if}

<style>
	.filetree-container {
		background: oklch(0.97 0.003 67);
		border: 1px solid oklch(0.9 0.005 67);
		border-radius: 0.5rem;
		padding: 1em 1.25em;
	}

	.filetree {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.filetree:not(.root) {
		padding-left: 20px;
	}

	.filetree:not(.root) > li {
		position: relative;
	}

	/* vertical line from parent down through children */
	.filetree:not(.root) > li::before {
		content: '';
		position: absolute;
		left: -14px;
		top: 0;
		bottom: 0;
		width: 1px;
		background: var(--color-border);
	}

	/* stop vertical line at the middle of last item */
	.filetree:not(.root) > li.last::before {
		bottom: calc(100% - 14px);
	}

	/* horizontal branch from vertical line to icon */
	.filetree:not(.root) > li::after {
		content: '';
		position: absolute;
		left: -14px;
		top: 14px;
		width: 10px;
		height: 1px;
		background: var(--color-border);
	}

	.row {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		line-height: 28px;
	}

	.row :global(.icon) {
		width: 16px;
		height: 16px;
		flex-shrink: 0;
	}
</style>
