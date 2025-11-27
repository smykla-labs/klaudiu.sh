# klaudiu.sh

Error documentation and redirect service for [klaudiush](https://github.com/smykla-labs/klaudiush).

## Overview

This service powers the `https://klaudiu.sh` domain, providing:

- **URL shortening** for klaudiush error codes (e.g., `https://klaudiu.sh/GIT001`)
- **Future**: Full error documentation site

## Error Code Redirects

| URL                          | Redirects To                                                                            |
|:-----------------------------|:----------------------------------------------------------------------------------------|
| `https://klaudiu.sh/`        | klaudiush project homepage                                                              |
| `https://klaudiu.sh/GIT001`  | [GIT001.md](https://github.com/smykla-labs/klaudiush/blob/main/docs/errors/GIT001.md)   |
| `https://klaudiu.sh/FILE001` | [FILE001.md](https://github.com/smykla-labs/klaudiush/blob/main/docs/errors/FILE001.md) |
| `https://klaudiu.sh/SEC001`  | [SEC001.md](https://github.com/smykla-labs/klaudiush/blob/main/docs/errors/SEC001.md)   |

Supported prefixes: `GIT`, `FILE`, `SEC` (case-insensitive)

## Development

### Prerequisites

- [mise](https://mise.jdx.dev/) for tool management
- Run `mise install` to set up Go, golangci-lint, and task

### Commands

```bash
task build    # Build binary
task test     # Run tests
task lint     # Run linter
task run      # Run locally on :8080
```

## Deployment

Deployed on [fly.io](https://fly.io) with automatic deployments on push to main.

### Manual Deployment

```bash
fly deploy
```

## License

MIT License. See [LICENSE](LICENSE) for details.
