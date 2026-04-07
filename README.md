# har-cli

`har-cli` is a Bun-based command-line tool for analyzing HAR files and extracting request URIs for permission whitelisting and regression loops.

## Features

- Scan one or more HAR files exported from Chrome DevTools
- Filter entries with an expression such as `body.status == 1 and http.status == 403`
- Output normalized request targets as `path`, `url`, or `prefix`
- Deduplicate output by default
- Generate Fish shell completion
- Build and install with `just`

## Requirements

- Bun 1.3.x
- just 1.14+

## Build

```bash
just build
```

The compiled binary is written to `dist/har-cli`.

## Install

```bash
just install
```

This installs:

- `~/.local/bin/har-cli`
- `~/.config/fish/completions/har-cli.fish`

## Usage

```bash
har-cli sample.har
```

Default filter:

```text
http.status == 403 or body.status == 1
```

Custom filter:

```bash
har-cli sample.har --where 'body.status == 1 and http.status == 403'
```

Output full URL:

```bash
har-cli sample.har --select url
```

Output prefix aggregation:

```bash
har-cli sample.har --select prefix --prefix-depth 2
```

Structured JSON output:

```bash
har-cli sample.har --format json
```

## Expression Context

The filter expression can access these fields:

- `http.status`
- `http.method`
- `request.url`
- `request.path`
- `response.mimeType`
- `body`
- `uri.url`
- `uri.path`

Supported operators:

- `==`, `!=`, `>`, `>=`, `<`, `<=`
- `and`, `or`, `not`
- `&&`, `||`, `!`

If the response body is not valid JSON, `body` is `undefined`.

## Help and Completion

```bash
har-cli help
har-cli --help
har-cli completions fish
```

Example Fish setup:

```fish
har-cli completions fish > ~/.config/fish/completions/har-cli.fish
```

## Development

```bash
just clean
just build
just install
bun test
bun run typecheck
```

## License

This project is licensed under the GNU General Public License v3.0 only. See [LICENSE](./LICENSE).
