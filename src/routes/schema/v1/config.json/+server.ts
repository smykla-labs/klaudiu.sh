import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const SCHEMA_PATH = resolve('klaudiush/schema/config.v1.schema.json');

export async function GET() {
	const content = await readFile(SCHEMA_PATH, 'utf-8');
	return new Response(content, {
		headers: {
			'Content-Type': 'application/schema+json; charset=utf-8'
		}
	});
}
