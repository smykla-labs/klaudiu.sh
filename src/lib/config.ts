export const siteConfig = {
	name: 'klaudiush',
	description: 'Validation dispatcher for Claude Code hooks',
	github: 'https://github.com/smykla-skalski/klaudiush'
} as const;

export type ErrorCategory = 'GIT' | 'FILE' | 'SEC' | 'SHELL' | 'GH' | 'PLUG' | 'SESS';

export interface CategoryInfo {
	name: string;
	prefix: ErrorCategory;
	description: string;
}

export const categories: CategoryInfo[] = [
	{
		name: 'Git',
		prefix: 'GIT',
		description: 'Git workflow and commit validation errors'
	},
	{
		name: 'File',
		prefix: 'FILE',
		description: 'File linting and validation errors'
	},
	{
		name: 'Security',
		prefix: 'SEC',
		description: 'Secret detection and security errors'
	},
	{
		name: 'Shell',
		prefix: 'SHELL',
		description: 'Shell command validation errors'
	},
	{
		name: 'GitHub',
		prefix: 'GH',
		description: 'GitHub CLI validation errors'
	},
	{
		name: 'Plugin',
		prefix: 'PLUG',
		description: 'Plugin security errors'
	},
	{
		name: 'Session',
		prefix: 'SESS',
		description: 'Session tracking errors'
	}
];
