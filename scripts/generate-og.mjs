import { chromium } from '@playwright/test';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// --- Ported from HeroBackground.svelte (same seed, same output) ---

function rand(seed) {
	const x = Math.sin(seed * 9301 + 49297) * 233280;
	return x - Math.floor(x);
}

const colors = [
	'oklch(0.55 0.06 190)',
	'oklch(0.50 0.06 190)',
	'oklch(0.48 0.05 190)',
	'oklch(0.52 0.04 195)',
	'oklch(0.45 0.06 185)',
	'oklch(0.58 0.04 195)',
	'oklch(0.46 0.05 190)'
];

const perpX = -0.906;
const perpY = 0.423;
const SAMPLES = 36;

function curvyPath(sx, sy, ex, ey, waves, amp, phase) {
	const pts = [];
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

function generateLines() {
	const lines = [];
	const cs = 1000;

	const baseStartX = 100;
	const baseStartY = -60;
	const baseEndX = 2800;
	const baseEndY = 900;

	const waveAmp = 60 + rand(cs + 4) * 30;
	const waves = 2.0 + rand(cs + 5) * 1.0;
	const phase = rand(cs + 6) * Math.PI * 2;

	const linesInCluster = 100 + Math.floor(rand(cs + 7) * 20);
	const startSpacing = 36;
	const endSpacing = 4.5;

	for (let i = 0; i < linesInCluster; i++) {
		const ls = cs + i * 10;
		const t_start = i * startSpacing;
		const t_end = i * endSpacing;

		const sx = baseStartX + perpX * t_start;
		const sy = baseStartY + perpY * t_start;
		const ex = baseEndX + perpX * t_end;
		const ey = baseEndY + perpY * t_end;

		const d = curvyPath(sx, sy, ex, ey, waves, waveAmp, phase);

		const progress = i / linesInCluster;
		lines.push({
			d,
			opacity: 0.12 + progress * 0.20 + rand(ls + 10) * 0.10,
			width: 0.7 + rand(ls + 11) * 1.0,
			color: colors[Math.floor(rand(ls + 12) * colors.length)]
		});
	}

	return lines;
}

// --- Build inline SVG paths ---

const lines = generateLines();
const pathElements = lines
	.map(
		(l) =>
			`<path d="${l.d}" stroke="${l.color}" stroke-width="${l.width}" opacity="${l.opacity}" fill="none"/>`
	)
	.join('\n');

// --- Full HTML page at OG dimensions, rendered by a real browser ---

const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=block" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1200px;
    height: 630px;
    background: oklch(0.20 0.04 190);
    font-family: 'Inter', sans-serif;
    overflow: hidden;
    position: relative;
  }
  .hero-bg {
    position: absolute;
    inset: 0;
    z-index: 0;
  }
  .hero-bg svg {
    width: 100%;
    height: 100%;
  }
  .content {
    position: absolute;
    inset: 0;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding-bottom: 16px;
  }
  .title {
    font-size: 80px;
    font-weight: 700;
    color: oklch(0.93 0.005 67);
    letter-spacing: -1px;
  }
  .subtitle {
    font-size: 28px;
    font-weight: 400;
    color: oklch(0.65 0.01 67);
  }
</style>
</head>
<body>
  <div class="hero-bg">
    <svg viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg">
      ${pathElements}
    </svg>
  </div>
  <div class="content">
    <div class="title">klaudiush</div>
    <div class="subtitle">Validation dispatcher for Claude Code hooks</div>
  </div>
</body>
</html>`;

// --- Screenshot with Playwright ---

const browser = await chromium.launch();
const page = await browser.newPage({
	viewport: { width: 1200, height: 630 },
	deviceScaleFactor: 1
});

await page.setContent(html, { waitUntil: 'networkidle' });

const outPath = join(__dirname, '..', 'static', 'og.png');
await page.screenshot({ path: outPath, type: 'png' });
await browser.close();

console.log(`Wrote ${outPath}`);
