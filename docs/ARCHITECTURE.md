# Architecture

## Request flow

The Builder is a static web application. It stores the complete Configuration in the URL and requests the same SVG endpoint that a Profile Owner will embed in GitHub.

```text
Builder URL
    |
    v
Validated Configuration
    |
    +--> Live SVG preview
    |
    +--> Copyable README markup
             |
             v
        GitHub Camo cache
             |
             v
    /v1/stack.svg Worker route
```

Cloudflare serves the Builder, fonts, and Tool Catalog as static assets. Only `/v1/*` invokes Worker code.

## Renderer properties

- Pure request-to-SVG function
- No account state, cookies, database, KV, R2, or remote fetches
- Allowlisted Tool IDs and enum-only presentation values
- Maximum 100 Tools and 8,192-character input URL
- SVG path data bundled at build time
- Output size bounded by the Tool and URL limits
- One-year immutable caching for successful responses
- No caching for invalid configurations
- Explicit `image/svg+xml` and `nosniff` headers

The track repeats the selected sequence until one segment exceeds the viewport. A second identical segment follows it. The renderer animates the parent group by exactly one segment width, which creates a seamless loop even when a Stack contains only two Tools.

Speed is measured in approximate pixels per second rather than seconds per Tool. Labels therefore do not make differently sized Stacks appear to move at wildly different rates.

## Accessibility

The embed receives an image-level accessible name listing the selected Tools. Animated output contains a `prefers-reduced-motion` rule that replaces the moving track with a static all-tools strip.

An image embedded in GitHub cannot provide a dependable pause control. The Builder therefore offers infinite, one-pass, and static Motion Modes. Infinite motion is the signature default, but the project does not claim strict compliance with WCAG 2.2.2 for that mode.

## Reliability

GitHub proxies remote README images through Camo. Camo reduces repeated origin traffic but can keep stale images. README Stack avoids mutating any successful renderer URL. Configuration changes produce a different query string, and renderer changes that alter output require a new path such as `/v2/stack.svg`.

The public service should maintain a canary README containing animated, static, light, dark, transparent, short, and maximum-size fixtures.
