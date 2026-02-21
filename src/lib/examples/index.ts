export interface ExampleCategory {
	slug: string;
	title: string;
	subtitle: string;
	icon: string;
	description: string;
	group: string;
	relatedGuide?: string;
}

export interface ExampleGroup {
	key: string;
	title: string;
}

export const exampleGroups: ExampleGroup[] = [
	{ key: 'configuration', title: 'Configuration' },
	{ key: 'plugins', title: 'Plugins' }
];

export const exampleCategories: ExampleCategory[] = [
	{
		slug: 'config',
		title: 'General',
		subtitle: 'Validators, crash dumps, and project overrides',
		icon: 'FileSliders',
		description: 'Complete, minimal, and language-specific configs.',
		group: 'configuration',
		relatedGuide: 'configuration'
	},
	{
		slug: 'backup',
		title: 'Backup',
		subtitle: 'Retention and storage presets',
		icon: 'Archive',
		description: 'Presets for minimal, production, and development environments.',
		group: 'configuration',
		relatedGuide: 'backup'
	},
	{
		slug: 'rules',
		title: 'Rules',
		subtitle: 'Pattern matching and actions',
		icon: 'Settings',
		description: 'Glob/regex patterns, org policies, and allow lists.',
		group: 'configuration',
		relatedGuide: 'rules'
	},
	{
		slug: 'exceptions',
		title: 'Exceptions',
		subtitle: 'Bypass policies and rate limits',
		icon: 'ShieldOff',
		description: 'From permissive dev setups to strict production policies.',
		group: 'configuration',
		relatedGuide: 'exceptions'
	},
	{
		slug: 'plugins',
		title: 'Plugins',
		subtitle: 'Exec plugin reference implementation',
		icon: 'Puzzle',
		description: 'Shell script plugin with JSON protocol and tests.',
		group: 'plugins',
		relatedGuide: 'plugins'
	}
];

export function findExampleCategory(slug: string): ExampleCategory | undefined {
	return exampleCategories.find((c) => c.slug === slug);
}
