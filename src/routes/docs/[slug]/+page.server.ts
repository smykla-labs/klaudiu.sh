import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { findGuide } from '$lib/docs';
import { highlightCode } from '$lib/highlight.server';

const codeSnippetsBySlug: Record<string, Record<string, { code: string; lang: string }>> = {
	rules: {
		quickStart: {
			lang: 'toml',
			code: `[rules]
enabled = true

[[rules.rules]]
name = "block-main-push"
description = "Block direct pushes to main"
priority = 100

[rules.rules.match]
validator_type = "git.push"
branch_pattern = "main"
remote = "origin"

[rules.rules.action]
type = "block"
message = "Direct push to main is not allowed. Use a pull request."`
		},
		globalRule: {
			lang: 'toml',
			code: `# ~/.klaudiush/config.toml
[[rules.rules]]
name = "warn-force-push"
description = "Flag force pushes"
priority = 50

[rules.rules.match]
validator_type = "git.push"
command_pattern = "*--force*"

[rules.rules.action]
type = "warn"
message = "Force push detected. Check that you have the latest changes."`
		},
		debugRules: {
			lang: 'bash',
			code: `klaudiush --debug`
		},
		ruleConfig: {
			lang: 'toml',
			code: `[[rules.rules]]
name = "my-rule"           # unique identifier
description = "What this rule does"
enabled = true             # default: true
priority = 100             # higher = evaluated first

[rules.rules.match]
# all non-empty conditions must match (AND logic)
validator_type = "git.push"
branch_pattern = "main"

[rules.rules.action]
type = "block"             # block | warn | allow
message = "Reason for the block"`
		},
		globPatterns: {
			lang: 'toml',
			code: `# Match any file in docs directory
file_pattern = "docs/*"

# Match markdown files in any subdirectory
file_pattern = "**/*.md"

# Match feature branches
branch_pattern = "feat/*"`
		},
		regexPatterns: {
			lang: 'toml',
			code: `# Match semantic version branches
branch_pattern = "^release/v[0-9]+\\\\.[0-9]+$"

# Match terraform files
file_pattern = ".*\\\\.(tf|tfvars)$"`
		},
		actions: {
			lang: 'toml',
			code: `# Block - stops the operation
[rules.rules.action]
type = "block"
message = "This operation is not allowed"

# Warn - logs a warning, operation proceeds
[rules.rules.action]
type = "warn"
message = "This operation might cause issues"

# Allow - skips further rules and built-in validation
[rules.rules.action]
type = "allow"`
		},
		allowTestSecrets: {
			lang: 'toml',
			code: `[[rules.rules]]
name = "allow-test-secrets"
description = "Allow secrets in test fixtures"
priority = 1000

[rules.rules.match]
validator_type = "secrets.secrets"
file_pattern = "**/test/**"

[rules.rules.action]
type = "allow"`
		},
		requireTicket: {
			lang: 'toml',
			code: `[[rules.rules]]
name = "require-ticket-main"
description = "Require JIRA ticket in commits to main"
priority = 100

[rules.rules.match]
validator_type = "git.commit"
branch_pattern = "main"

[rules.rules.action]
type = "block"
message = "Commits to main must reference a JIRA ticket (e.g., JIRA-123)"`
		},
		blockOrgOrigin: {
			lang: 'toml',
			code: `[[rules.rules]]
name = "block-org-origin"
description = "Block push to origin in org repos"
priority = 100

[rules.rules.match]
validator_type = "git.push"
repo_pattern = "**/myorg/**"
remote = "origin"

[rules.rules.action]
type = "block"
message = "Organization repos use 'upstream'. Push to your fork."`
		},
		exceptionsIntegration: {
			lang: 'toml',
			code: `# Add a reference to enable exception bypass
[rules.rules.action]
type = "block"
message = "Direct push to main is not allowed"
reference = "RULE001"

# Then configure the exception policy
[exceptions.policies.RULE001]
enabled = true
allow_exception = true
require_reason = true`
		}
	},
	backup: {
		config: {
			lang: 'toml',
			code: `[backup]
enabled = true
auto_backup = true
max_backups = 10
max_age = "720h"     # 30 days
async_backup = true`
		},
		listBackups: {
			lang: 'bash',
			code: `# List all backups
klaudiush backup list

# Filter by project
klaudiush backup list --project /path/to/project

# Global config only
klaudiush backup list --global`
		},
		restore: {
			lang: 'bash',
			code: `# Preview restore
klaudiush backup restore abc123def456 --dry-run

# Restore (creates backup of current config first)
klaudiush backup restore abc123def456

# Force restore without backup
klaudiush backup restore abc123def456 --force`
		},
		storageLayout: {
			lang: 'text',
			code: `~/.klaudiush/.backups/
\u251c\u2500\u2500 global/
\u2502   \u251c\u2500\u2500 snapshots/
\u2502   \u2502   \u251c\u2500\u2500 001_20250102_150405.full.toml
\u2502   \u2502   \u2514\u2500\u2500 002_20250102_160000.full.toml
\u2502   \u2514\u2500\u2500 metadata.json
\u251c\u2500\u2500 projects/
\u2502   \u2514\u2500\u2500 Users_bart_project1/
\u2502       \u251c\u2500\u2500 snapshots/
\u2502       \u2514\u2500\u2500 metadata.json
\u251c\u2500\u2500 audit.jsonl
\u2514\u2500\u2500 .retention`
		},
		retention: {
			lang: 'toml',
			code: `[backup]
max_backups = 10       # max snapshots per config
max_age = "720h"       # 30 days
max_size = 52428800    # 50MB total storage`
		},
		doctor: {
			lang: 'bash',
			code: `# Validate backup system
klaudiush doctor --category backup

# Auto-fix issues
klaudiush doctor --category backup --fix`
		}
	},
	plugins: {
		bashPlugin: {
			lang: 'bash',
			code: `#!/usr/bin/env bash
set -euo pipefail

# Handle --info flag (metadata request)
if [[ "\${1:-}" == "--info" ]]; then
  echo '{"name":"my-plugin","version":"1.0.0","description":"My custom validator"}'
  exit 0
fi

# Read validation request from stdin
read -r request
tool_name=$(echo "$request" | jq -r '.tool_name')
command=$(echo "$request" | jq -r '.command // empty')

# Validation logic
if [[ "$tool_name" == "Bash" ]] && [[ "$command" == *"sudo"* ]]; then
  cat <<EOF
{"passed":false,"should_block":true,"message":"sudo commands are not allowed","error_code":"NO_SUDO"}
EOF
  exit 0
fi

echo '{"passed":true,"should_block":false}'`
		},
		install: {
			lang: 'bash',
			code: `chmod +x my-plugin.sh
mkdir -p ~/.klaudiush/plugins
cp my-plugin.sh ~/.klaudiush/plugins/`
		},
		pluginConfig: {
			lang: 'toml',
			code: `[plugins]
enabled = true

[[plugins.plugins]]
name = "my-plugin"
type = "exec"
path = "~/.klaudiush/plugins/my-plugin.sh"

[plugins.plugins.predicate]
event_types = ["PreToolUse"]
tool_types = ["Bash"]`
		},
		testPlugin: {
			lang: 'bash',
			code: `./my-plugin.sh --info
echo '{"tool_name":"Bash","command":"sudo rm -rf /"}' | ./my-plugin.sh
echo '{"tool_name":"Bash","command":"ls"}' | ./my-plugin.sh`
		},
		predicates: {
			lang: 'toml',
			code: `# Git commits only
[plugins.plugins.predicate]
event_types = ["PreToolUse"]
tool_types = ["Bash"]
command_patterns = ["^git commit"]

# Go file writes
[plugins.plugins.predicate]
event_types = ["PreToolUse"]
tool_types = ["Write", "Edit"]
file_patterns = ["**/*.go"]

# Catch-all (matches everything)
[plugins.plugins.predicate]`
		},
		pythonPlugin: {
			lang: 'python',
			code: `#!/usr/bin/env python3
import sys, json

def main():
    if len(sys.argv) > 1 and sys.argv[1] == "--info":
        print(json.dumps({"name": "python-validator", "version": "1.0.0",
                          "description": "Example Python validator"}))
        return

    request = json.load(sys.stdin)
    tool_name = request.get("tool_name", "")
    file_path = request.get("file_path", "")

    if tool_name in ("Write", "Edit") and file_path.endswith(".exe"):
        print(json.dumps({"passed": False, "should_block": True,
                          "message": "Binary files (.exe) are not allowed",
                          "error_code": "NO_BINARIES"}))
        return

    print(json.dumps({"passed": True, "should_block": False}))

if __name__ == "__main__":
    main()`
		}
	},
	sessions: {
		config: {
			lang: 'toml',
			code: `[session]
enabled = true
state_file = "~/.klaudiush/session_state.json"
max_session_age = "24h"`
		},
		lifecycle: {
			lang: 'text',
			code: `1. git commit -m "fix"         # Missing -sS flag
   \u2192 Denied: [GIT001] Missing signoff flag
   \u2192 Session poisoned with GIT001

2. git status                  # Next command
   \u2192 Denied: [SESS001] Session poisoned by GIT001

3. KLACK="SESS:GIT001" git commit -sS -m "fix"
   \u2192 Session unpoisoned, command proceeds to validation`
		},
		unpoison: {
			lang: 'bash',
			code: `# Environment variable (recommended)
KLACK="SESS:GIT001" git commit -sS -m "fix"

# Shell comment
git commit -sS -m "fix"  # SESS:GIT001

# Multiple codes
KLACK="SESS:GIT001,GIT002" git push origin feature`
		},
		auditConfig: {
			lang: 'toml',
			code: `[session.audit]
enabled = true
log_file = "~/.klaudiush/session_audit.jsonl"
max_size_mb = 10
max_age_days = 30`
		},
		auditView: {
			lang: 'bash',
			code: `# View recent entries
tail ~/.klaudiush/session_audit.jsonl | jq

# Filter by action
jq 'select(.action == "Unpoison")' ~/.klaudiush/session_audit.jsonl

# Filter by session
jq 'select(.session_id == "abc-123")' ~/.klaudiush/session_audit.jsonl`
		}
	},
	exceptions: {
		config: {
			lang: 'toml',
			code: `[exceptions]
enabled = true

[exceptions.policies.GIT019]
enabled = true
allow_exception = true
require_reason = true
min_reason_length = 10
description = "Exception for pushing to protected branches"`
		},
		usage: {
			lang: 'bash',
			code: `# Shell comment format
git push origin main  # EXC:GIT019:Emergency+hotfix+for+production

# Environment variable format
KLACK="EXC:GIT019:Emergency+hotfix" git push origin main`
		},
		tokenPlacement: {
			lang: 'bash',
			code: `# Shell comment (recommended)
git push origin main  # EXC:GIT019:Emergency+hotfix

# Environment variable
KLACK="EXC:SEC001:Test+fixture" git commit -sS -m "Add test data"`
		},
		policyConfig: {
			lang: 'toml',
			code: `[exceptions.policies.GIT019]
enabled = true
allow_exception = true
require_reason = true
min_reason_length = 15
valid_reasons = ["emergency hotfix", "approved by lead", "security patch"]
max_per_hour = 5
max_per_day = 20
description = "Exception for pushing to protected branches"`
		},
		rateLimits: {
			lang: 'toml',
			code: `[exceptions.rate_limit]
enabled = true
max_per_hour = 10  # global, all codes combined
max_per_day = 50

# Per-code limits are set in the policy entry
[exceptions.policies.GIT019]
max_per_hour = 2
max_per_day = 5`
		},
		auditCommands: {
			lang: 'bash',
			code: `# List all entries
klaudiush audit list

# Filter by error code
klaudiush audit list --error-code GIT019

# Filter by outcome
klaudiush audit list --outcome allowed

# View statistics
klaudiush audit stats

# Remove old entries
klaudiush audit cleanup`
		},
		rulesIntegration: {
			lang: 'toml',
			code: `# Custom rule with exception support
[[rules.rules]]
name = "block-production-deploy"
priority = 100

[rules.rules.match]
command_pattern = "*kubectl apply*production*"

[rules.rules.action]
type = "block"
message = "Production deployments require approval"
reference = "DEPLOY001"

# Exception policy for that reference
[exceptions.policies.DEPLOY001]
enabled = true
require_reason = true
min_reason_length = 20
valid_reasons = ["approved by SRE", "emergency rollback"]`
		},
		strictPolicy: {
			lang: 'toml',
			code: `[exceptions.policies.SEC003]
enabled = true
allow_exception = false
description = "Never allow exceptions for private key commits"`
		},
		testFixtureSecrets: {
			lang: 'toml',
			code: `[exceptions.policies.SEC001]
enabled = true
require_reason = true
valid_reasons = ["test fixture", "mock data", "example config"]
description = "Allow secrets in test files"`
		},
		requireExplicitPolicy: {
			lang: 'toml',
			code: `# Without this, any error code can be bypassed by default
[exceptions]
require_explicit_policy = true

# Only codes with an explicit policy entry can now be bypassed
[exceptions.policies.GIT019]
allow_exception = true
require_reason = true`
		},
		tokenParsing: {
			lang: 'bash',
			code: [
				'# Word boundary required - token must start after whitespace',
				'git push origin main  # EXC:GIT019:reason        <- matches',
				'git push origin main  # NOEXC:GIT019:reason       <- no match',
				'',
				'# Variable expansion is rejected - only literal strings work',
				'KLACK="EXC:${CODE}:reason" git push    # <- token not found',
				'KLACK="EXC:$(echo GIT019):reason" git push  # <- token not found',
				'',
				'# When both are present, env var wins',
				'KLACK="EXC:GIT019:Env+reason" git push  # EXC:GIT019:Comment+reason'
			].join('\n')
		},
		debugCommands: {
			lang: 'bash',
			code: `# Show exception policies for current project
klaudiush debug exceptions

# Include current rate limit counters
klaudiush debug exceptions --state`
		}
	}
};

export const load: PageServerLoad = async ({ params }) => {
	const guide = findGuide(params.slug);
	if (!guide) {
		error(404, { message: `Guide not found: ${params.slug}` });
	}

	const snippetDefs = codeSnippetsBySlug[params.slug];
	if (!snippetDefs) {
		error(404, { message: `Guide not found: ${params.slug}` });
	}

	const entries = Object.entries(snippetDefs);
	const highlighted = await Promise.all(
		entries.map(async ([key, { code, lang }]) => {
			const html = await highlightCode(code, lang);
			return [key, html] as const;
		})
	);

	const codeSnippets: Record<string, string> = Object.fromEntries(highlighted);

	return {
		guide,
		codeSnippets
	};
};
