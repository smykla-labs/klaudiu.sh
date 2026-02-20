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
		slug: 'getting-started',
		title: 'Getting started',
		subtitle: 'Zero to first validation in five minutes',
		icon: 'Rocket',
		description: 'Install klaudiush, configure the Claude Code hook, and run your first validated commit.'
	},
	{
		slug: 'installation',
		title: 'Installation',
		subtitle: 'All install methods and shell setup',
		icon: 'Download',
		description: 'Homebrew, install.sh, Nix flake, from source. Shell completion for bash, zsh, and fish.'
	},
	{
		slug: 'rules',
		title: 'Dynamic rules',
		subtitle: 'Validation rules without code changes',
		icon: 'Settings',
		description: 'TOML config, glob/regex patterns, priority rules, per-validator scoping.'
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
	},
	{
		slug: 'cli',
		title: 'CLI reference',
		subtitle: 'Every command, flag, and argument',
		icon: 'Terminal',
		description: 'Full command tree for klaudiush. Init, validate, backup, doctor, audit, and more.'
	},
	{
		slug: 'configuration',
		title: 'Configuration',
		subtitle: 'TOML schema and precedence rules',
		icon: 'FileSliders',
		description: 'Config file format, deep merge behavior, global vs project config, all config keys.'
	},
	{
		slug: 'environment-variables',
		title: 'Environment variables',
		subtitle: 'Every KLAUDIUSH_ var and standard vars',
		icon: 'Variable',
		description: 'All environment variables that affect klaudiush behavior. KLAUDIUSH_ prefixed and standard vars.'
	},
	{
		slug: 'troubleshooting',
		title: 'Troubleshooting',
		subtitle: 'Common issues and the doctor command',
		icon: 'Wrench',
		description: 'Fixes for common problems, doctor command diagnostics, crash dump analysis.'
	},
	{
		slug: 'faq',
		title: 'FAQ',
		subtitle: 'Frequently asked questions',
		icon: 'CircleHelp',
		description: 'What happens when klaudiush crashes? How to disable a validator? And more.'
	},
	{
		slug: 'security',
		title: 'Security',
		subtitle: 'Practices, detection, and reporting',
		icon: 'Shield',
		description: 'Secret detection, plugin sandboxing, vulnerability reporting, security model.'
	},
	{
		slug: 'architecture',
		title: 'Architecture',
		subtitle: 'Dispatcher flow and system design',
		icon: 'Workflow',
		description: 'Validation dispatcher pipeline, validator registry, parallel execution, parser system.'
	},
	{
		slug: 'migration',
		title: 'Migration guide',
		subtitle: 'Version upgrades and breaking changes',
		icon: 'ArrowUpCircle',
		description: 'Breaking changes by version, JSON stdout migration, upgrade steps.'
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
