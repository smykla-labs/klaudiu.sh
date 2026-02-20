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
	},
	'getting-started': {
		install: {
			lang: 'bash',
			code: `# macOS / Linux (Homebrew)
brew install smykla-skalski/tap/klaudiush

# Or use the install script
curl -sSfL https://klaudiu.sh/install.sh | sh`
		},
		initGlobal: {
			lang: 'bash',
			code: `# Create global config with interactive prompts
klaudiush init --global

# Verify setup
klaudiush doctor`
		},
		hookConfig: {
			lang: 'json',
			code: `{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [{ "type": "command", "command": "klaudiush --hook-type PreToolUse" }]
      },
      {
        "matcher": "Write",
        "hooks": [{ "type": "command", "command": "klaudiush --hook-type PreToolUse" }]
      },
      {
        "matcher": "Edit",
        "hooks": [{ "type": "command", "command": "klaudiush --hook-type PreToolUse" }]
      }
    ],
    "Notification": [
      {
        "matcher": "",
        "hooks": [{ "type": "command", "command": "klaudiush --hook-type Notification" }]
      }
    ]
  }
}`
		},
		firstCommit: {
			lang: 'bash',
			code: `# Try a commit - klaudiush validates automatically
git commit -sS -m "feat(api): add user endpoint"

# If validation fails, you'll see the error code and fix hint
# Example: [GIT001] Missing signoff flag. Add -sS to your commit command.`
		}
	},
	installation: {
		homebrew: {
			lang: 'bash',
			code: `brew install smykla-skalski/tap/klaudiush`
		},
		installScript: {
			lang: 'bash',
			code: `# Default install to ~/.local/bin
curl -sSfL https://klaudiu.sh/install.sh | sh

# Specific version
curl -sSfL https://klaudiu.sh/install.sh | sh -s -- -v v1.18.0

# Custom install directory
curl -sSfL https://klaudiu.sh/install.sh | sh -s -- -b /usr/local/bin`
		},
		nix: {
			lang: 'bash',
			code: `# Run directly
nix run github:smykla-skalski/klaudiush?dir=nix

# Install to profile
nix profile install github:smykla-skalski/klaudiush?dir=nix`
		},
		nixHomeManager: {
			lang: 'nix',
			code: `{
  inputs.klaudiush.url = "github:smykla-skalski/klaudiush?dir=nix";

  # In your home-manager config:
  imports = [ inputs.klaudiush.homeManagerModules.default ];
  programs.klaudiush.enable = true;
}`
		},
		fromSource: {
			lang: 'bash',
			code: `git clone https://github.com/smykla-skalski/klaudiush.git
cd klaudiush
task build:prod
# Binary installed to ~/.local/bin/klaudiush`
		},
		completion: {
			lang: 'bash',
			code: `# Bash
klaudiush completion bash | sudo tee /usr/local/etc/bash_completion.d/klaudiush

# Zsh
klaudiush completion zsh | sudo tee /usr/local/share/zsh/site-functions/_klaudiush

# Fish
klaudiush completion fish > ~/.config/fish/completions/klaudiush.fish`
		},
		verify: {
			lang: 'bash',
			code: `klaudiush --version
klaudiush doctor`
		}
	},
	cli: {
		rootFlags: {
			lang: 'bash',
			code: `klaudiush --hook-type PreToolUse    # Required: hook event type
klaudiush --debug                   # Enable debug logging
klaudiush --trace                   # Enable trace logging
klaudiush --config ./custom.toml    # Custom project config path
klaudiush --global-config ~/.config/klaudiush.toml
klaudiush --disable commit,markdown # Disable specific validators
klaudiush --no-color                # Disable colored output`
		},
		init: {
			lang: 'bash',
			code: `# Initialize project config (interactive)
klaudiush init

# Initialize global config
klaudiush init --global

# Overwrite existing config (creates backup first)
klaudiush init --force

# Non-interactive mode
klaudiush init --no-tui`
		},
		validate: {
			lang: 'bash',
			code: `# Validate via hook (normal usage - called by Claude Code)
echo '{"tool_name":"Bash","command":"git commit -m fix"}' | klaudiush --hook-type PreToolUse`
		},
		backup: {
			lang: 'bash',
			code: `klaudiush backup list                      # List all backups
klaudiush backup list --global             # Global config backups only
klaudiush backup list --json               # JSON output
klaudiush backup create --tag "pre-refactor"  # Manual backup
klaudiush backup restore abc123 --dry-run  # Preview restore
klaudiush backup restore abc123            # Restore snapshot
klaudiush backup delete abc123             # Delete snapshot
klaudiush backup prune                     # Remove old backups
klaudiush backup status                    # Show backup system status`
		},
		doctor: {
			lang: 'bash',
			code: `klaudiush doctor                    # Run all checks
klaudiush doctor --verbose          # Detailed output
klaudiush doctor --fix              # Auto-fix issues
klaudiush doctor --category config  # Check specific category`
		},
		audit: {
			lang: 'bash',
			code: `klaudiush audit list                       # List all entries
klaudiush audit list --error-code GIT019   # Filter by code
klaudiush audit list --outcome allowed     # Filter by outcome
klaudiush audit list --json                # JSON output
klaudiush audit stats                      # Show statistics
klaudiush audit cleanup                    # Remove old entries`
		},
		debug: {
			lang: 'bash',
			code: `klaudiush debug config                    # Show loaded config
klaudiush debug config --validator git.commit  # Single validator
klaudiush debug rules                     # Show validation rules
klaudiush debug rules --validator git.push    # Rules for one validator
klaudiush debug exceptions                # Show exception config
klaudiush debug exceptions --state        # Include rate limit counters
klaudiush debug crash list                # List crash dumps
klaudiush debug crash view <id>           # View crash dump
klaudiush debug crash clean               # Clean crash dumps
klaudiush debug crash clean --dry-run     # Preview cleanup`
		},
		completion: {
			lang: 'bash',
			code: `klaudiush completion bash        # Generate bash completions
klaudiush completion zsh         # Generate zsh completions
klaudiush completion fish        # Generate fish completions
klaudiush completion powershell  # Generate PowerShell completions`
		},
		version: {
			lang: 'bash',
			code: `$ klaudiush version
klaudiush v1.20.0
  commit:  a1b2c3d
  built:   2026-02-20T10:00:00Z
  go:      go1.24.0
  os/arch: darwin/arm64`
		}
	},
	configuration: {
		fileLocations: {
			lang: 'text',
			code: `~/.klaudiush/config.toml          # Global config (all projects)
.klaudiush/config.toml            # Project config (this repo)
klaudiush.toml                    # Alternative project config location`
		},
		cliOverrides: {
			lang: 'bash',
			code: `klaudiush --config=./my-config.toml --hook-type PreToolUse
klaudiush --disable=commit,markdown --hook-type PreToolUse
klaudiush --global-config=~/.config/klaudiush.toml --hook-type PreToolUse`
		},
		envOverrides: {
			lang: 'bash',
			code: `KLAUDIUSH_VALIDATORS_GIT_COMMIT_ENABLED=false
KLAUDIUSH_VALIDATORS_GIT_COMMIT_MESSAGE_TITLE_MAX_LENGTH=72
KLAUDIUSH_VALIDATORS_FILE_MARKDOWN_ENABLED=false
KLAUDIUSH_USE_SDK_GIT=false`
		},
		fullConfig: {
			lang: 'toml',
			code: `[validators.git.commit]
enabled = true
required_flags = ["-s", "-S"]
check_staging_area = true
enable_message_validation = true

[validators.git.commit.message]
title_max_length = 50
body_max_line_length = 72
check_conventional_commits = true
valid_types = ["feat", "fix", "docs", "style", "refactor", "perf", "test", "build", "ci", "chore", "revert"]
require_scope = true

[validators.git.push]
enabled = true

[validators.git.pr]
enabled = true
title_max_length = 50

[validators.git.branch]
enabled = true
protected_branches = ["main", "master"]

[validators.file.markdown]
enabled = true
timeout = "10s"

[validators.file.shellscript]
enabled = true
timeout = "10s"

[validators.file.terraform]
enabled = true
check_format = true
use_tflint = true

[validators.file.workflow]
enabled = true
enforce_digest_pinning = true

[validators.shell.backtick]
enabled = true
check_all_commands = false

[validators.notification.bell]
enabled = true`
		},
		deepMerge: {
			lang: 'toml',
			code: `# Global: ~/.klaudiush/config.toml
[validators.git.commit.message]
title_max_length = 50
require_scope = true

# Project: .klaudiush/config.toml
[validators.git.commit.message]
title_max_length = 72

# Result after merge:
# title_max_length = 72  (project wins)
# require_scope = true   (preserved from global)`
		}
	},
	'environment-variables': {
		gitVars: {
			lang: 'bash',
			code: `# Git Add
KLAUDIUSH_VALIDATORS_GIT_ADD_ENABLED=true
KLAUDIUSH_VALIDATORS_GIT_ADD_BLOCKED_PATTERNS="tmp/*,*.secret"

# Git Commit
KLAUDIUSH_VALIDATORS_GIT_COMMIT_ENABLED=true
KLAUDIUSH_VALIDATORS_GIT_COMMIT_REQUIRED_FLAGS="-s,-S"
KLAUDIUSH_VALIDATORS_GIT_COMMIT_MESSAGE_TITLE_MAX_LENGTH=50
KLAUDIUSH_VALIDATORS_GIT_COMMIT_MESSAGE_BODY_MAX_LINE_LENGTH=72
KLAUDIUSH_VALIDATORS_GIT_COMMIT_MESSAGE_CHECK_CONVENTIONAL_COMMITS=true
KLAUDIUSH_VALIDATORS_GIT_COMMIT_MESSAGE_REQUIRE_SCOPE=true

# Git Push
KLAUDIUSH_VALIDATORS_GIT_PUSH_ENABLED=true

# Git PR
KLAUDIUSH_VALIDATORS_GIT_PR_ENABLED=true
KLAUDIUSH_VALIDATORS_GIT_PR_TITLE_MAX_LENGTH=50

# Git Branch
KLAUDIUSH_VALIDATORS_GIT_BRANCH_ENABLED=true
KLAUDIUSH_VALIDATORS_GIT_BRANCH_PROTECTED_BRANCHES="main,master"`
		},
		fileVars: {
			lang: 'bash',
			code: `KLAUDIUSH_VALIDATORS_FILE_MARKDOWN_ENABLED=true
KLAUDIUSH_VALIDATORS_FILE_MARKDOWN_TIMEOUT=10s
KLAUDIUSH_VALIDATORS_FILE_SHELLSCRIPT_ENABLED=true
KLAUDIUSH_VALIDATORS_FILE_SHELLSCRIPT_TIMEOUT=10s
KLAUDIUSH_VALIDATORS_FILE_TERRAFORM_ENABLED=true
KLAUDIUSH_VALIDATORS_FILE_TERRAFORM_CHECK_FORMAT=true
KLAUDIUSH_VALIDATORS_FILE_WORKFLOW_ENABLED=true
KLAUDIUSH_VALIDATORS_FILE_WORKFLOW_ENFORCE_DIGEST_PINNING=true`
		},
		standardVars: {
			lang: 'bash',
			code: `NO_COLOR=1              # Disable colored output
KLAUDIUSH_USE_SDK_GIT=true   # Use go-git SDK instead of CLI
GH_TOKEN=...            # GitHub API token for workflow validator`
		},
		valueTypes: {
			lang: 'bash',
			code: `# Boolean values: true, 1, yes, on (or false, 0, no, off)
KLAUDIUSH_VALIDATORS_GIT_COMMIT_ENABLED=true

# Duration values: 10s, 30s, 1m, 5m30s
KLAUDIUSH_VALIDATORS_FILE_MARKDOWN_TIMEOUT=10s

# String lists: comma-separated, no spaces
KLAUDIUSH_VALIDATORS_GIT_COMMIT_REQUIRED_FLAGS="-s,-S"
KLAUDIUSH_VALIDATORS_GIT_BRANCH_PROTECTED_BRANCHES="main,master,develop"`
		}
	},
	troubleshooting: {
		doctorCommand: {
			lang: 'bash',
			code: `# Run all diagnostic checks
klaudiush doctor

# Detailed output
klaudiush doctor --verbose

# Auto-fix detected issues
klaudiush doctor --fix

# Check specific category
klaudiush doctor --category config
klaudiush doctor --category hook
klaudiush doctor --category backup`
		},
		debugConfig: {
			lang: 'bash',
			code: `# See what config is loaded
klaudiush debug config

# Check specific validator
klaudiush debug config --validator git.commit

# View active rules
klaudiush debug rules`
		},
		crashDumps: {
			lang: 'bash',
			code: `# List crash dumps
klaudiush debug crash list

# View a specific crash dump
klaudiush debug crash view <id>

# Clean old crash dumps
klaudiush debug crash clean`
		},
		debugLogging: {
			lang: 'bash',
			code: `# Enable debug logging
klaudiush --debug --hook-type PreToolUse

# Enable trace logging (verbose)
klaudiush --trace --hook-type PreToolUse

# View logs
tail -f ~/.claude/hooks/dispatcher.log`
		},
		hookCheck: {
			lang: 'bash',
			code: `# Verify hook is registered
cat ~/.claude/settings.json | jq '.hooks'

# Test hook manually
echo '{"tool_name":"Bash","command":"git status"}' | klaudiush --hook-type PreToolUse`
		}
	},
	faq: {
		disableValidator: {
			lang: 'bash',
			code: `# CLI flag (highest precedence)
klaudiush --disable=commit,markdown --hook-type PreToolUse

# Environment variable
KLAUDIUSH_VALIDATORS_GIT_COMMIT_ENABLED=false

# Config file
# [validators.git.commit]
# enabled = false`
		},
		disableConfig: {
			lang: 'toml',
			code: `[validators.git.commit]
enabled = false`
		},
		exceptionUsage: {
			lang: 'bash',
			code: `# Shell comment
git push origin main  # EXC:GIT019:Emergency+hotfix

# Environment variable
KLACK="EXC:SEC001:Test+fixture" git commit -sS -m "msg"`
		},
		exceptionConfig: {
			lang: 'toml',
			code: `[exceptions]
enabled = true

[exceptions.policies.GIT019]
enabled = true
allow_exception = true
require_reason = true`
		},
		completionSetup: {
			lang: 'bash',
			code: `klaudiush completion bash | sudo tee /usr/local/etc/bash_completion.d/klaudiush
klaudiush completion zsh | sudo tee /usr/local/share/zsh/site-functions/_klaudiush
klaudiush completion fish > ~/.config/fish/completions/klaudiush.fish`
		}
	},
	security: {
		secretPatterns: {
			lang: 'text',
			code: `AWS access keys          AKIA[0-9A-Z]{16}
AWS secret keys          [0-9a-zA-Z/+]{40}
GitHub tokens            ghp_/gho_/ghs_/ghu_/github_pat_ prefixed
Private keys             BEGIN (RSA|DSA|EC|OPENSSH) PRIVATE KEY
Connection strings       mongodb://, postgres://, mysql://, redis://
API keys                 Stripe (sk_live_), Twilio, SendGrid, etc.`
		},
		gitleaksConfig: {
			lang: 'toml',
			code: `[validators.secrets]
enabled = true
use_gitleaks = true    # Optional: use gitleaks for extra coverage`
		},
		pluginSecurity: {
			lang: 'toml',
			code: `[[plugins.plugins]]
name = "my-plugin"
type = "exec"
path = "~/.klaudiush/plugins/my-plugin.sh"
timeout = "5s"    # Execution timeout

[plugins.plugins.predicate]
event_types = ["PreToolUse"]
tool_types = ["Bash"]`
		},
		reporting: {
			lang: 'text',
			code: `Contact: bartek@smykla.com

Do NOT report vulnerabilities via public GitHub issues.

Timeline:
  1. Acknowledgment within 48 hours
  2. Investigation and fix development
  3. Release with fix
  4. Coordinated public disclosure`
		}
	},
	architecture: {
		flow: {
			lang: 'text',
			code: `Claude Code JSON \u2192 CLI \u2192 JSON Parser \u2192 Dispatcher \u2192 Registry \u2192 Validators \u2192 Result

1. Claude Code sends hook event as JSON to stdin
2. CLI parses flags, loads config, initializes subsystems
3. JSON parser converts event to hook.Context
4. Dispatcher checks session state, runs matched validators
5. Registry matches validators via predicates
6. Validators return Pass/Fail/Warn with error codes
7. JSON response written to stdout`
		},
		directoryLayout: {
			lang: 'text',
			code: `klaudiush/
\u251c\u2500\u2500 cmd/klaudiush/          # CLI entry point
\u251c\u2500\u2500 pkg/
\u2502   \u251c\u2500\u2500 hook/               # Event types, Context
\u2502   \u251c\u2500\u2500 parser/             # Bash/Git/command parsing
\u2502   \u251c\u2500\u2500 config/             # Configuration models
\u2502   \u2514\u2500\u2500 logger/             # Structured logging
\u2514\u2500\u2500 internal/
    \u251c\u2500\u2500 dispatcher/         # Validation orchestration
    \u251c\u2500\u2500 validator/          # Validator interface, registry
    \u251c\u2500\u2500 validators/         # All validator implementations
    \u2502   \u251c\u2500\u2500 git/            # Git-specific validators
    \u2502   \u251c\u2500\u2500 file/           # File format validators
    \u2502   \u251c\u2500\u2500 secrets/        # Secret detection
    \u2502   \u251c\u2500\u2500 shell/          # Shell command validators
    \u2502   \u2514\u2500\u2500 notification/   # Notification validators
    \u251c\u2500\u2500 rules/              # Dynamic validation rules
    \u251c\u2500\u2500 exceptions/         # Exception workflow
    \u251c\u2500\u2500 session/            # Session tracking
    \u251c\u2500\u2500 config/             # Configuration loading
    \u251c\u2500\u2500 doctor/             # Diagnostic system
    \u2514\u2500\u2500 backup/             # Config backup system`
		},
		hookOutput: {
			lang: 'json',
			code: `{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": "[GIT001] Missing signoff flag. Add -sS to your commit command.",
    "additionalContext": "..."
  },
  "systemMessage": "..."
}`
		},
		predicates: {
			lang: 'text',
			code: `Predicate types:
  EventTypeIs     Match hook event (PreToolUse, PostToolUse, Notification)
  ToolTypeIs       Match tool name (Bash, Write, Edit)
  CommandContains  Match command substring
  FileExtensionIs  Match file extension (.md, .tf, .go)
  FilePathMatches  Match file path pattern

Composable:
  And(p1, p2)     Both must match
  Or(p1, p2)      Either matches
  Not(p)          Inverts match`
		}
	},
	migration: {
		jsonMigration: {
			lang: 'text',
			code: `Before (v1.17 and earlier):
  Block: exit code 2, formatted text to stderr
  Allow: exit code 0

After (v1.18+):
  Block: exit 0, JSON stdout with permissionDecision: "deny"
  Allow: exit 0, JSON stdout with permissionDecision: "allow"
  Crash: exit 3 (panic recovery)`
		},
		jsonOutput: {
			lang: 'json',
			code: `{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": "[GIT001] Message for the model",
    "additionalContext": "Extra context"
  },
  "systemMessage": "Message for the user"
}`
		},
		upgradeSteps: {
			lang: 'bash',
			code: `# 1. Update klaudiush
brew upgrade klaudiush
# or
curl -sSfL https://klaudiu.sh/install.sh | sh

# 2. Verify version
klaudiush version

# 3. Run doctor to check setup
klaudiush doctor

# 4. Test validation still works
echo '{"tool_name":"Bash","command":"git commit -m fix"}' | klaudiush --hook-type PreToolUse`
		},
		selfUpdate: {
			lang: 'bash',
			code: `# Check for updates
klaudiush update --check

# Update to latest
klaudiush update

# Update to specific version
klaudiush update --version v1.20.0`
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
