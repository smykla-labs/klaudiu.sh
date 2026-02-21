<script lang="ts">
	function rand(seed: number): number {
		const x = Math.sin(seed * 9301 + 49297) * 233280;
		return x - Math.floor(x);
	}

	interface Line {
		d: string;
		opacity: number;
		width: number;
		color: string;
	}

	const colors = [
		'oklch(0.72 0.01 67)',
		'oklch(0.68 0.01 67)',
		'oklch(0.65 0.01 67)',
		'oklch(0.70 0.005 67)',
		'oklch(0.60 0.01 67)',
		'oklch(0.75 0.005 67)',
		'oklch(0.62 0.01 67)'
	];

	// Perpendicular to ~65° diagonal
	const perpX = -0.906;
	const perpY = 0.423;

	const SAMPLES = 36; // enough points to capture smooth curves

	function curvyPath(
		sx: number,
		sy: number,
		ex: number,
		ey: number,
		waves: number,
		amp: number,
		phase: number
	): string {
		// Generate sample points along the diagonal with sine wave displacement
		const pts: { x: number; y: number }[] = [];
		for (let s = 0; s <= SAMPLES; s++) {
			const t = s / SAMPLES;
			const baseX = sx + (ex - sx) * t;
			const baseY = sy + (ey - sy) * t;
			const wave = Math.sin(t * Math.PI * 2 * waves + phase) * amp;
			pts.push({
				x: baseX + wave * perpX,
				y: baseY + wave * perpY
			});
		}

		// Catmull-Rom to cubic bezier for smooth curve through all points
		let d = `M${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
		for (let i = 0; i < pts.length - 1; i++) {
			const p0 = pts[Math.max(i - 1, 0)];
			const p1 = pts[i];
			const p2 = pts[i + 1];
			const p3 = pts[Math.min(i + 2, pts.length - 1)];

			const tension = 0.3;
			const cx1 = p1.x + (p2.x - p0.x) * tension;
			const cy1 = p1.y + (p2.y - p0.y) * tension;
			const cx2 = p2.x - (p3.x - p1.x) * tension;
			const cy2 = p2.y - (p3.y - p1.y) * tension;

			d += ` C${cx1.toFixed(1)} ${cy1.toFixed(1)},${cx2.toFixed(1)} ${cy2.toFixed(1)},${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
		}
		return d;
	}

	function generateLines(): Line[] {
		const lines: Line[] = [];
		const cs = 1000;

		const baseStartX = -500;
		const baseStartY = -100;
		const baseEndX = 2200;
		const baseEndY = 600;

		const waveAmp = 60 + rand(cs + 4) * 30;
		const waves = 2.0 + rand(cs + 5) * 1.0;
		const phase = rand(cs + 6) * Math.PI * 2;

		const linesInCluster = 100 + Math.floor(rand(cs + 7) * 20);
		const startSpacing = 54; // wider at the top
		const endSpacing = 4.5; // converging at the bottom

		for (let i = 0; i < linesInCluster; i++) {
			const ls = cs + i * 10;
			const t_start = i * startSpacing;
			const t_end = i * endSpacing;

			const sx = baseStartX + perpX * t_start;
			const sy = baseStartY + perpY * t_start;
			const ex = baseEndX + perpX * t_end;
			const ey = baseEndY + perpY * t_end;

			const d = curvyPath(sx, sy, ex, ey, waves, waveAmp, phase);

			const progress = i / linesInCluster; // 0 at start, 1 at end
			lines.push({
				d,
				opacity: 0.06 + progress * 0.12 + rand(ls + 10) * 0.06,
				width: 0.7 + rand(ls + 11) * 1.0,
				color: colors[Math.floor(rand(ls + 12) * colors.length)]
			});
		}

		return lines;
	}

	const lines = generateLines();
</script>

<div class="hero-bg" aria-hidden="true">
	<svg viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style="overflow: visible">
		{#each lines as line (line.d)}
			<path d={line.d} stroke={line.color} stroke-width={line.width} opacity={line.opacity} />
		{/each}
	</svg>
</div>

<style>
	.hero-bg {
		position: absolute;
		top: -5.5rem;
		left: 50%;
		transform: translateX(-50%);
		width: 100vw;
		height: 900px;
		z-index: -1;
		overflow: hidden;
		pointer-events: none;
		mask-image: linear-gradient(to bottom, black 50%, transparent 100%);
		-webkit-mask-image: linear-gradient(to bottom, black 50%, transparent 100%);
	}

	.hero-bg svg {
		width: 100%;
		height: 100%;
	}
</style>
