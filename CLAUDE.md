# CLAUDE.md

Guidance for Claude Code when working with this repository.

## Project Overview

`klaudiu.sh` is the error documentation and redirect service for klaudiush.
Currently serves as a URL shortener redirecting error codes to GitHub documentation.
Future plans include hosting full documentation on this domain.

## Commands

```bash
task build        # Build the redirect binary
task test         # Run tests
task lint         # Run linter
task check        # Run lint + test
task run          # Run locally on :8080
task fmt          # Format code
task clean        # Clean build artifacts
```

## Architecture

Simple HTTP redirect service:

- `cmd/redirect/main.go` - Entry point, starts HTTP server on PORT (default 8080)
- `internal/redirect/handler.go` - Request handler with redirect logic

### Redirect Rules

| Path Pattern | Destination                                                                 |
|:-------------|:----------------------------------------------------------------------------|
| `/`          | `https://github.com/smykla-labs/klaudiush`                                  |
| `/GIT001`    | `https://github.com/smykla-labs/klaudiush/blob/main/docs/errors/GIT001.md`  |
| `/FILE001`   | `https://github.com/smykla-labs/klaudiush/blob/main/docs/errors/FILE001.md` |
| `/SEC001`    | `https://github.com/smykla-labs/klaudiush/blob/main/docs/errors/SEC001.md`  |
| Other        | 404 Not Found                                                               |

Supported error code prefixes: `GIT`, `FILE`, `SEC` (case-insensitive, normalized to uppercase).

## Deployment

Deployed on fly.io as `klaudiu-sh` app.

```bash
fly deploy              # Deploy to fly.io
fly logs                # View logs
fly status              # Check app status
```

### Custom Domain

Domain `klaudiu.sh` configured via:

```bash
fly certs add klaudiu.sh
fly ips list            # Get IP addresses for DNS
```

## Development

**Tools** (mise): Go 1.25.4, golangci-lint 2.6.2, task 3.45.5

Run `mise install` to set up the development environment.

## Testing

```bash
task test               # Run all tests
go test -v ./...        # Verbose output
```
