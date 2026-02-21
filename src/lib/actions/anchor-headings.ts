function slugify(text: string): string {
	return (text || '')
		.toLowerCase()
		.trim()
		.replace(/[^\w\s-]/g, '')
		.replace(/[\s_]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

function processHeadings(node: HTMLElement) {
	const headings = node.querySelectorAll<HTMLHeadingElement>('h2, h3, h4, h5, h6');
	const usedIds = new Set<string>();

	for (const heading of headings) {
		if (heading.querySelector('.heading-anchor')) continue;

		let targetId = heading.id;

		if (!targetId) {
			const section = heading.closest('section[id]');
			if (section) {
				targetId = section.id;
			} else {
				targetId = slugify(heading.textContent || '');
				if (!targetId) continue;
				let uniqueId = targetId;
				let counter = 1;
				while (usedIds.has(uniqueId)) {
					uniqueId = `${targetId}-${counter++}`;
				}
				targetId = uniqueId;
				heading.id = targetId;
			}
		}

		usedIds.add(targetId);

		heading.style.position = 'relative';

		const anchor = document.createElement('a');
		anchor.href = `#${targetId}`;
		anchor.className = 'heading-anchor';
		anchor.setAttribute('aria-label', 'Link to this section');
		anchor.textContent = '#';

		Object.assign(anchor.style, {
			position: 'absolute',
			left: '-1.5em',
			color: 'oklch(0.55 0.01 67)',
			textDecoration: 'none',
			opacity: '0',
			transition: 'opacity 150ms',
			fontWeight: '400'
		});

		heading.addEventListener('mouseenter', () => {
			anchor.style.opacity = '1';
		});
		heading.addEventListener('mouseleave', () => {
			anchor.style.opacity = '0';
		});

		heading.prepend(anchor);
	}
}

export function anchorHeadings(node: HTMLElement) {
	processHeadings(node);

	const observer = new MutationObserver(() => processHeadings(node));
	observer.observe(node, { childList: true, subtree: true });

	return {
		destroy() {
			observer.disconnect();
		}
	};
}
