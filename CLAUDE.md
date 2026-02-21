# CLAUDE.md

Guidance for Claude Code when working with this repository.

## Project overview

`klaudiu.sh` is the website for klaudiush - a validation dispatcher for Claude Code hooks.
Project landing page at `/`, error docs at `/e/`, documentation at `/docs/`.
Error doc markdown lives in the `klaudiush/` git submodule. Changelog is read from `klaudiush/CHANGELOG.md`.

## Commands

```bash
task dev          # Start dev server (localhost:5173)
task build        # Build for production
task preview      # Preview production build
task test         # Run unit tests
task test:unit    # Run unit tests
task test:e2e     # Run e2e tests (Playwright)
task lint         # Run linter
task check        # Typecheck + lint
task fmt          # Format code
task clean        # Clean build artifacts
```

## Architecture

SvelteKit app with adapter-node, deployed on fly.io.

- `src/routes/+page.svelte` - Project landing page
- `src/routes/e/+page.svelte` - Error docs listing with category cards and error code grid
- `src/routes/e/+page.server.ts` - Error docs listing loader
- `src/routes/e/[code]/+page.server.ts` - Error doc page loader (validates code, loads markdown)
- `src/routes/e/[code]/+page.svelte` - Error doc page renderer
- `src/lib/errors/index.ts` - Error code validation, parsing, markdown loading
- `src/lib/config.ts` - Site metadata, category definitions
- `src/routes/docs/+page.svelte` - Docs hub with guide cards and ADR list
- `src/routes/docs/[slug]/+page.svelte` - Guide detail page (rules, backup, plugins, sessions, exceptions)
- `src/routes/docs/[slug]/+page.server.ts` - Guide loader (validates slug, highlights code)
- `src/routes/docs/changelog/` - Changelog (rendered from submodule CHANGELOG.md)
- `src/routes/docs/adr/` - ADR listing and detail pages
- `src/routes/docs/examples/` - Examples listing and category pages
- `src/lib/examples/index.ts` - Example category registry
- `src/lib/examples/loader.server.ts` - Filesystem scanner for example files
- `src/lib/docs/index.ts` - Guide and ADR registries
- `src/lib/docs/content/` - Per-guide Svelte content components
- `src/lib/components/` - Shared components (Navbar, Footer, CategoryCard, DocCard, etc.)
- `src/lib/components/ui/` - shadcn-svelte generated components
- `klaudiush/` - Git submodule with error doc markdown (docs/errors/) and CHANGELOG.md

### Routing

| Path               | Result                                           |
|:-------------------|:-------------------------------------------------|
| `/`                | Project landing page                             |
| `/docs/`                     | Documentation hub (grouped sections)             |
| `/docs/getting-started`      | Getting started guide                            |
| `/docs/installation`         | Installation guide                               |
| `/docs/rules`                | Dynamic rules guide                              |
| `/docs/backup`               | Backup system guide                              |
| `/docs/plugins`              | Plugin development guide                         |
| `/docs/sessions`             | Session tracking guide                           |
| `/docs/exceptions`           | Exception workflow guide                         |
| `/docs/cli`                  | CLI reference                                    |
| `/docs/configuration`        | Configuration guide                              |
| `/docs/environment-variables`| Environment variables reference                  |
| `/docs/troubleshooting`      | Troubleshooting guide                            |
| `/docs/faq`                  | FAQ                                              |
| `/docs/security`             | Security guide                                   |
| `/docs/architecture`         | Architecture overview                            |
| `/docs/migration`            | Migration guide                                  |
| `/docs/changelog`            | Changelog (from submodule CHANGELOG.md)          |
| `/docs/examples/`           | Example configs listing                          |
| `/docs/examples/config`     | Config example files                             |
| `/docs/adr/`                 | ADR listing                                      |
| `/docs/adr/0001`             | Individual ADR page                              |
| `/schema/v1/config.json`     | JSON Schema for config (from submodule)          |
| `/e/`                        | Error docs listing                               |
| `/e/GIT001`                  | Renders GIT001.md from submodule                 |
| `/e/git001`                  | Same (case-insensitive, normalized to uppercase) |
| `/e/INVALID001`              | 404 - invalid prefix                             |
| `/anything-else`             | 404                                              |

Supported prefixes: `GIT`, `FILE`, `SEC`, `SHELL`, `GH`, `PLUG`, `SESS` (pattern: `^(GIT|FILE|SEC|SHELL|GH|PLUG|SESS)\d{3}$`)

## Stack

Svelte 5, SvelteKit, Tailwind CSS v4, shadcn-svelte (stone theme), mdsvex, TypeScript, Vitest, Playwright

## Deployment

Deployed on fly.io as `klaudiu-sh` app.

```bash
fly deploy              # Deploy to fly.io
fly logs                # View logs
fly status              # Check app status
```

## Development

Tools (mise): Node.js 24, pnpm 10, task 3.45.5

Run `mise install` to set up the development environment.

## Testing

```bash
task test:unit          # Unit tests (Vitest)
task test:e2e           # E2E tests (Playwright)
pnpm test:unit -- --watch  # Watch mode
```
