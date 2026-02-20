export const siteConfig = {
	name: 'klaudiush',
	description: 'Validation dispatcher for Claude Code hooks',
	github: 'https://github.com/smykla-skalski/klaudiush'
} as const;

export type ErrorCategory = 'GIT' | 'FILE' | 'SEC';

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
	}
];
