<script lang="ts">
</script>

<section id="overview" class="space-y-3">
	<h2 class="text-xl font-semibold">Overview</h2>
	<p class="text-muted-foreground">
		Every TOML config option has a corresponding environment variable. Variables use the
		<code>KLAUDIUSH_</code> prefix and follow the TOML structure with underscores replacing
		dots. Environment variables take precedence over config files but are overridden by
		CLI flags.
	</p>
</section>

<section id="klaudiush-vars" class="space-y-4">
	<h2 class="text-xl font-semibold">KLAUDIUSH_ variables</h2>
	<h3 class="text-lg font-medium">Git Add</h3>
	<div class="overflow-x-auto">
		<table class="w-full text-sm">
			<colgroup><col style="width: 60%" /><col style="width: 40%" /></colgroup>
<tbody class="text-muted-foreground border-y border-border">
				<tr class="border-b border-border/50"><td class="py-2 pr-4"><code>KLAUDIUSH_VALIDATORS_GIT_ADD_ENABLED</code></td><td class="py-2">Enable git add validator</td></tr>
				<tr><td class="py-2 pr-4"><code>KLAUDIUSH_VALIDATORS_GIT_ADD_BLOCKED_PATTERNS</code></td><td class="py-2">Comma-separated blocked file patterns</td></tr>
			</tbody>
		</table>
	</div>

	<h3 class="text-lg font-medium">Git Commit</h3>
	<div class="overflow-x-auto">
		<table class="w-full text-sm">
			<colgroup><col style="width: 60%" /><col style="width: 40%" /></colgroup>
<tbody class="text-muted-foreground border-y border-border">
				<tr class="border-b border-border/50"><td class="py-2 pr-4"><code>KLAUDIUSH_VALIDATORS_GIT_COMMIT_ENABLED</code></td><td class="py-2">Enable git commit validator</td></tr>
				<tr class="border-b border-border/50"><td class="py-2 pr-4"><code>KLAUDIUSH_VALIDATORS_GIT_COMMIT_REQUIRED_FLAGS</code></td><td class="py-2">Required commit flags (e.g. <code>"-s,-S"</code>)</td></tr>
				<tr class="border-b border-border/50"><td class="py-2 pr-4"><code>KLAUDIUSH_VALIDATORS_GIT_COMMIT_MESSAGE_TITLE_MAX_LENGTH</code></td><td class="py-2">Max commit title length (default 50)</td></tr>
				<tr class="border-b border-border/50"><td class="py-2 pr-4"><code>KLAUDIUSH_VALIDATORS_GIT_COMMIT_MESSAGE_BODY_MAX_LINE_LENGTH</code></td><td class="py-2">Max commit body line length (default 72)</td></tr>
				<tr class="border-b border-border/50"><td class="py-2 pr-4"><code>KLAUDIUSH_VALIDATORS_GIT_COMMIT_MESSAGE_CHECK_CONVENTIONAL_COMMITS</code></td><td class="py-2">Enforce conventional commit format</td></tr>
				<tr><td class="py-2 pr-4"><code>KLAUDIUSH_VALIDATORS_GIT_COMMIT_MESSAGE_REQUIRE_SCOPE</code></td><td class="py-2">Require scope in conventional commits</td></tr>
			</tbody>
		</table>
	</div>

	<h3 class="text-lg font-medium">Git Push</h3>
	<div class="overflow-x-auto">
		<table class="w-full text-sm">
			<colgroup><col style="width: 60%" /><col style="width: 40%" /></colgroup>
<tbody class="text-muted-foreground border-y border-border">
				<tr><td class="py-2 pr-4"><code>KLAUDIUSH_VALIDATORS_GIT_PUSH_ENABLED</code></td><td class="py-2">Enable git push validator</td></tr>
			</tbody>
		</table>
	</div>

	<h3 class="text-lg font-medium">Git PR</h3>
	<div class="overflow-x-auto">
		<table class="w-full text-sm">
			<colgroup><col style="width: 60%" /><col style="width: 40%" /></colgroup>
<tbody class="text-muted-foreground border-y border-border">
				<tr class="border-b border-border/50"><td class="py-2 pr-4"><code>KLAUDIUSH_VALIDATORS_GIT_PR_ENABLED</code></td><td class="py-2">Enable git PR validator</td></tr>
				<tr><td class="py-2 pr-4"><code>KLAUDIUSH_VALIDATORS_GIT_PR_TITLE_MAX_LENGTH</code></td><td class="py-2">Max PR title length (default 50)</td></tr>
			</tbody>
		</table>
	</div>

	<h3 class="text-lg font-medium">Git Branch</h3>
	<div class="overflow-x-auto">
		<table class="w-full text-sm">
			<colgroup><col style="width: 60%" /><col style="width: 40%" /></colgroup>
<tbody class="text-muted-foreground border-y border-border">
				<tr class="border-b border-border/50"><td class="py-2 pr-4"><code>KLAUDIUSH_VALIDATORS_GIT_BRANCH_ENABLED</code></td><td class="py-2">Enable git branch validator</td></tr>
				<tr><td class="py-2 pr-4"><code>KLAUDIUSH_VALIDATORS_GIT_BRANCH_PROTECTED_BRANCHES</code></td><td class="py-2">Comma-separated protected branch names</td></tr>
			</tbody>
		</table>
	</div>

	<h3 class="text-lg font-medium">Markdown</h3>
	<div class="overflow-x-auto">
		<table class="w-full text-sm">
			<colgroup><col style="width: 60%" /><col style="width: 40%" /></colgroup>
<tbody class="text-muted-foreground border-y border-border">
				<tr class="border-b border-border/50"><td class="py-2 pr-4"><code>KLAUDIUSH_VALIDATORS_FILE_MARKDOWN_ENABLED</code></td><td class="py-2">Enable markdown validator</td></tr>
				<tr><td class="py-2 pr-4"><code>KLAUDIUSH_VALIDATORS_FILE_MARKDOWN_TIMEOUT</code></td><td class="py-2">Markdown validator timeout</td></tr>
			</tbody>
		</table>
	</div>

	<h3 class="text-lg font-medium">Shellscript</h3>
	<div class="overflow-x-auto">
		<table class="w-full text-sm">
			<colgroup><col style="width: 60%" /><col style="width: 40%" /></colgroup>
<tbody class="text-muted-foreground border-y border-border">
				<tr class="border-b border-border/50"><td class="py-2 pr-4"><code>KLAUDIUSH_VALIDATORS_FILE_SHELLSCRIPT_ENABLED</code></td><td class="py-2">Enable shellscript validator</td></tr>
				<tr><td class="py-2 pr-4"><code>KLAUDIUSH_VALIDATORS_FILE_SHELLSCRIPT_TIMEOUT</code></td><td class="py-2">Shellscript validator timeout</td></tr>
			</tbody>
		</table>
	</div>

	<h3 class="text-lg font-medium">Terraform</h3>
	<div class="overflow-x-auto">
		<table class="w-full text-sm">
			<colgroup><col style="width: 60%" /><col style="width: 40%" /></colgroup>
<tbody class="text-muted-foreground border-y border-border">
				<tr class="border-b border-border/50"><td class="py-2 pr-4"><code>KLAUDIUSH_VALIDATORS_FILE_TERRAFORM_ENABLED</code></td><td class="py-2">Enable terraform validator</td></tr>
				<tr><td class="py-2 pr-4"><code>KLAUDIUSH_VALIDATORS_FILE_TERRAFORM_CHECK_FORMAT</code></td><td class="py-2">Check terraform formatting</td></tr>
			</tbody>
		</table>
	</div>

	<h3 class="text-lg font-medium">Workflow</h3>
	<div class="overflow-x-auto">
		<table class="w-full text-sm">
			<colgroup><col style="width: 60%" /><col style="width: 40%" /></colgroup>
<tbody class="text-muted-foreground border-y border-border">
				<tr class="border-b border-border/50"><td class="py-2 pr-4"><code>KLAUDIUSH_VALIDATORS_FILE_WORKFLOW_ENABLED</code></td><td class="py-2">Enable workflow validator</td></tr>
				<tr><td class="py-2 pr-4"><code>KLAUDIUSH_VALIDATORS_FILE_WORKFLOW_ENFORCE_DIGEST_PINNING</code></td><td class="py-2">Enforce digest pinning in workflows</td></tr>
			</tbody>
		</table>
	</div>

	<h3 class="text-lg font-medium">Other</h3>
	<div class="overflow-x-auto">
		<table class="w-full text-sm">
			<colgroup><col style="width: 60%" /><col style="width: 40%" /></colgroup>
<tbody class="text-muted-foreground border-y border-border">
				<tr class="border-b border-border/50"><td class="py-2 pr-4"><code>KLAUDIUSH_USE_SDK_GIT</code></td><td class="py-2">Use go-git SDK instead of git CLI</td></tr>
				<tr class="border-b border-border/50"><td class="py-2 pr-4"><code>KLAUDIUSH_LOG_FILE</code></td><td class="py-2">Custom log file path (overrides XDG state directory)</td></tr>
				<tr><td class="py-2 pr-4"><code>KLACK</code></td><td class="py-2">Exception token (<code>EXC:CODE:reason</code>)</td></tr>
			</tbody>
		</table>
	</div>
</section>

<section id="standard-vars" class="space-y-4">
	<h2 class="text-xl font-semibold">Standard variables</h2>
	<p class="text-muted-foreground">
		klaudiush also respects these standard environment variables:
	</p>
	<div class="overflow-x-auto">
		<table class="w-full text-sm">
			<colgroup><col style="width: 60%" /><col style="width: 40%" /></colgroup>
<tbody class="text-muted-foreground border-y border-border">
				<tr class="border-b border-border/50"><td class="py-2 pr-4"><code>NO_COLOR</code></td><td class="py-2">Disable colored output (any non-empty value)</td></tr>
				<tr class="border-b border-border/50"><td class="py-2 pr-4"><code>GH_TOKEN</code></td><td class="py-2">GitHub API token for workflow validator and self-update (avoids rate limits)</td></tr>
				<tr class="border-b border-border/50"><td class="py-2 pr-4"><code>GITHUB_TOKEN</code></td><td class="py-2">Alias for GH_TOKEN. Falls back to <code>gh auth token</code> if neither is set</td></tr>
				<tr class="border-b border-border/50"><td class="py-2 pr-4"><code>XDG_CONFIG_HOME</code></td><td class="py-2">XDG config base directory (default <code>~/.config</code>)</td></tr>
				<tr class="border-b border-border/50"><td class="py-2 pr-4"><code>XDG_DATA_HOME</code></td><td class="py-2">XDG data base directory (default <code>~/.local/share</code>)</td></tr>
				<tr><td class="py-2 pr-4"><code>XDG_STATE_HOME</code></td><td class="py-2">XDG state base directory (default <code>~/.local/state</code>)</td></tr>
			</tbody>
		</table>
	</div>
</section>

<section id="precedence" class="space-y-4">
	<h2 class="text-xl font-semibold">Precedence</h2>
	<p class="text-muted-foreground">
		From highest to lowest precedence:
	</p>
	<ol class="list-decimal space-y-1 pl-6 text-sm text-muted-foreground">
		<li>CLI flags (<code>--disable=commit</code>)</li>
		<li>Environment variables (<code>KLAUDIUSH_VALIDATORS_GIT_COMMIT_ENABLED=false</code>)</li>
		<li>Project config (<code>.klaudiush/config.toml</code>)</li>
		<li>Global config (<code>$XDG_CONFIG_HOME/klaudiush/config.toml</code>)</li>
		<li>Built-in defaults</li>
	</ol>
	<h3 class="text-lg font-medium">Value types</h3>
	<div class="overflow-x-auto">
		<table class="w-full text-sm">
			<thead>
				<tr class="border-b border-border">
					<th class="py-2 pr-4 text-left font-medium">Type</th>
					<th class="py-2 pr-4 text-left font-medium">Format</th>
					<th class="py-2 text-left font-medium">Example</th>
				</tr>
			</thead>
			<tbody class="text-muted-foreground">
				<tr class="border-b border-border/50"><td class="py-2 pr-4">Boolean</td><td class="py-2 pr-4"><code>true</code>, <code>1</code>, <code>yes</code>, <code>on</code> (or <code>false</code>, <code>0</code>, <code>no</code>, <code>off</code>)</td><td class="py-2"><code>KLAUDIUSH_VALIDATORS_GIT_COMMIT_ENABLED=true</code></td></tr>
				<tr class="border-b border-border/50"><td class="py-2 pr-4">Duration</td><td class="py-2 pr-4"><code>10s</code>, <code>30s</code>, <code>1m</code>, <code>5m30s</code></td><td class="py-2"><code>KLAUDIUSH_VALIDATORS_FILE_MARKDOWN_TIMEOUT=10s</code></td></tr>
				<tr><td class="py-2 pr-4 whitespace-nowrap">String list</td><td class="py-2 pr-4">Comma-separated, no spaces</td><td class="py-2"><code>KLAUDIUSH_VALIDATORS_GIT_COMMIT_REQUIRED_FLAGS="-s,-S"</code></td></tr>
			</tbody>
		</table>
	</div>
</section>

<style>
	code:not(pre code) {
		background: oklch(0.96 0.005 67);
		border: 1px solid oklch(0.9 0.005 67);
		border-radius: 0.25rem;
		padding: 0.15em 0.35em;
		font-size: 0.85em;
		font-weight: 500;
		color: oklch(0.25 0.01 67);
		display: inline-block;
		vertical-align: middle;
		white-space: nowrap;
	}
</style>
