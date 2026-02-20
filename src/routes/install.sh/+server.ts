import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const INSTALL_SCRIPT = resolve('klaudiush/install.sh');

export async function GET() {
	const content = await readFile(INSTALL_SCRIPT, 'utf-8');
	return new Response(content, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8'
		}
	});
}
