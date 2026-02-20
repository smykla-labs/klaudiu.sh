export interface GuideInfo {
	slug: string;
	title: string;
	subtitle: string;
	icon: string;
	description: string;
}

export interface AdrInfo {
	id: string;
	title: string;
	status: 'proposed' | 'accepted' | 'deprecated';
	date: string;
}

export const guides: GuideInfo[] = [
	{
		slug: 'rules',
		title: 'Dynamic rules',
		subtitle: 'Configure validation without code changes',
		icon: 'Settings',
		description: 'TOML config, glob/regex pattern matching, priority system, per-validator scoping.'
	},
	{
		slug: 'backup',
		title: 'Backup system',
		subtitle: 'Version history with delta compression',
		icon: 'Archive',
		description: 'Automatic snapshots, retention policies, checksum validation, CLI commands.'
	},
	{
		slug: 'plugins',
		title: 'Plugin development',
		subtitle: 'Extend validation with exec plugins',
		icon: 'Puzzle',
		description: 'JSON stdin/stdout protocol, predicate matching, bash and Python examples.'
	},
	{
		slug: 'sessions',
		title: 'Session tracking',
		subtitle: 'Fast-fail for poisoned sessions',
		icon: 'Activity',
		description: 'Session poisoning, unpoison tokens, audit logging, SESS001 error.'
	},
	{
		slug: 'exceptions',
		title: 'Exception workflow',
		subtitle: 'Bypass validation with audit trail',
		icon: 'ShieldOff',
		description: 'Token format, per-code policies, rate limiting, JSONL audit.'
	}
];

export const adrs: AdrInfo[] = [
	{ id: '0001', title: 'JSON stdout output', status: 'accepted', date: '2026-02-19' }
];

export function findGuide(slug: string): GuideInfo | undefined {
	return guides.find((g) => g.slug === slug);
}

export function findAdr(id: string): AdrInfo | undefined {
	return adrs.find((a) => a.id === id);
}
