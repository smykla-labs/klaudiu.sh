function createSvg(paths: string[]): SVGSVGElement {
	const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	svg.setAttribute('width', '14');
	svg.setAttribute('height', '14');
	svg.setAttribute('viewBox', '0 0 24 24');
	svg.setAttribute('fill', 'none');
	svg.setAttribute('stroke', 'currentColor');
	svg.setAttribute('stroke-width', '2');
	svg.setAttribute('stroke-linecap', 'round');
	svg.setAttribute('stroke-linejoin', 'round');

	for (const d of paths) {
		if (d.startsWith('M') || d.startsWith('m')) {
			const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
			path.setAttribute('d', d);
			svg.appendChild(path);
		} else {
			// rect attributes: width height x y rx ry
			const parts = d.split(' ');
			const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
			rect.setAttribute('width', parts[0]);
			rect.setAttribute('height', parts[1]);
			rect.setAttribute('x', parts[2]);
			rect.setAttribute('y', parts[3]);
			rect.setAttribute('rx', parts[4]);
			rect.setAttribute('ry', parts[5]);
			svg.appendChild(rect);
		}
	}

	return svg;
}

const COPY_PATHS = ['14 14 8 8 2 2', 'M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2'];
const CHECK_PATHS = ['M20 6 9 17 4 12'];

function setCopyIcon(btn: HTMLButtonElement) {
	btn.replaceChildren(createSvg(COPY_PATHS));
	btn.style.color = 'oklch(0.55 0.01 67)';
}

function setCheckIcon(btn: HTMLButtonElement) {
	btn.replaceChildren(createSvg(CHECK_PATHS));
	btn.style.color = 'oklch(0.45 0.16 145)';
}

function createCopyButton(pre: Element): HTMLButtonElement {
	const btn = document.createElement('button');
	btn.setAttribute('aria-label', 'Copy to clipboard');
	setCopyIcon(btn);

	Object.assign(btn.style, {
		position: 'absolute',
		right: '0.5rem',
		top: '0.5rem',
		borderRadius: '0.375rem',
		border: '1px solid oklch(0.9 0.005 67)',
		background: 'oklch(0.94 0.005 67 / 0.9)',
		padding: '0.375rem',
		opacity: '0',
		transition: 'opacity 150ms',
		cursor: 'pointer'
	});

	btn.addEventListener('mouseenter', () => {
		btn.style.background = 'oklch(0.90 0.005 67)';
	});

	btn.addEventListener('mouseleave', () => {
		btn.style.background = 'oklch(0.94 0.005 67 / 0.9)';
	});

	btn.addEventListener('click', async () => {
		const text = pre.textContent?.replace(/\n$/, '') ?? '';
		await navigator.clipboard.writeText(text);
		setCheckIcon(btn);
		setTimeout(() => setCopyIcon(btn), 2000);
	});

	return btn;
}

function processPreElements(node: HTMLElement) {
	const pres = node.querySelectorAll('pre:not([data-copy-added])');
	pres.forEach((pre) => {
		pre.setAttribute('data-copy-added', '');

		const wrapper = document.createElement('div');
		wrapper.style.position = 'relative';
		pre.parentNode?.insertBefore(wrapper, pre);
		wrapper.appendChild(pre);

		const btn = createCopyButton(pre);
		wrapper.appendChild(btn);

		wrapper.addEventListener('mouseenter', () => {
			btn.style.opacity = '1';
		});
		wrapper.addEventListener('mouseleave', () => {
			btn.style.opacity = '0';
		});
	});
}

export function copyCode(node: HTMLElement) {
	let processing = false;

	function addButtons() {
		if (processing) return;
		processing = true;
		processPreElements(node);
		processing = false;
	}

	addButtons();

	const observer = new MutationObserver(() => addButtons());
	observer.observe(node, { childList: true, subtree: true });

	return {
		destroy() {
			observer.disconnect();
		}
	};
}
