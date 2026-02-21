<script lang="ts">
	import FileTree from './FileTree.svelte';
	import { FolderOpen, FileText } from '@lucide/svelte';

	export type TreeNode = {
		name: string;
		comment?: string;
		children?: TreeNode[];
	};

	interface Props {
		nodes: TreeNode[];
		root?: boolean;
		prefix?: boolean[];
	}

	let { nodes, root = true, prefix = [] }: Props = $props();

</script>

<ul class="text-sm">
	{#each nodes as node, i}
		{@const isLast = i === nodes.length - 1}
		<li>
			<span class="inline-flex items-center gap-1.5">
				{#if !root}
					{#each prefix as hasContinuation}
						<span class="inline-flex w-4 shrink-0 justify-center font-mono text-border"
							>{hasContinuation ? '│' : ''}</span
						>
					{/each}
					<span class="inline-flex w-4 shrink-0 justify-center font-mono text-border"
						>{isLast ? '└' : '├'}</span
					>
				{/if}
				{#if node.children}
					<FolderOpen class="h-4 w-4 shrink-0 text-amber-600" />
				{:else}
					<FileText class="h-4 w-4 shrink-0 text-muted-foreground" />
				{/if}
				<span class="font-mono">{node.name}</span>
				{#if node.comment}
					<span class="text-muted-foreground">- {node.comment}</span>
				{/if}
			</span>
			{#if node.children && node.children.length > 0}
				<FileTree nodes={node.children} root={false} prefix={[...prefix, !isLast]} />
			{/if}
		</li>
	{/each}
</ul>
