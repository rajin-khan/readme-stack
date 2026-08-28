<p align="center">
  <img src="./public/brand/favicon.svg" width="64" alt="README Stack handwritten S icon">
</p>

# README Stack

README Stack creates a scrolling SVG of the tools someone uses. It is made for GitHub profile READMEs.

The project currently runs locally. The `stack.rajinkhan.com` links will work after it is deployed to Cloudflare.

## What is included

- A searchable catalog of 345 tools from Simple Icons and Devicon
- Six presets
- Stacks with 2-24 tools
- Dark, light, and transparent backgrounds
- Three speeds, two directions, two spacing levels, two tool sizes, and optional names
- Looping, one-pass, and still modes
- A useful static strip when the viewer prefers reduced motion
- Animated and static SVG output
- GitHub light and dark mode markup using `picture`
- Immutable versioned renderer URLs
- Validation error images instead of broken embeds
- A Cloudflare Worker with Static Assets configuration

## Run locally

Requirements:

- Node.js 22 or newer
- pnpm 9 or newer

```sh
pnpm install
pnpm build
pnpm dev
```

Open `http://127.0.0.1:4173`.

## Verify

```sh
pnpm build
pnpm check
pnpm test
WRANGLER_LOG_PATH=/tmp/readme-stack-wrangler.log pnpm exec wrangler deploy --dry-run
```

The dry run does not contact or change a Cloudflare account.

## Renderer API

```text
/v1/stack.svg?i=typescript,react,nextdotjs
```

Supported parameters:

| Parameter | Meaning | Values |
| --- | --- | --- |
| `i` | Ordered tool IDs | 2-24 comma-separated IDs |
| `t` | Background | `dark`, `light`, `transparent` |
| `s` | Speed | `slow`, `normal`, `fast` |
| `d` | Direction | `left`, `right` |
| `g` | Spacing | `compact`, `comfortable` |
| `l` | Tool names | `on`, `off` |
| `m` | Motion | `infinite`, `once`, `static` |
| `z` | Tool size | `small`, `large` |

Every successful URL is treated as immutable. A renderer change that alters existing output must use a new versioned path.

## Project boundaries

Version one has no accounts, database, repository scanning, dependency imports, arbitrary uploads, external image URLs, custom CSS, annotations, theme marketplace, live GitHub API calls, or on-demand GIF rendering.

The ownership split and deployment gates are documented in [PLAN.md](./PLAN.md). Canonical product terms live in [CONTEXT.md](./CONTEXT.md).

## License and trademarks

The application is licensed under MIT. Simple Icons data is distributed under CC0-1.0 and Devicon under MIT. Product names and logos remain the property of their owners. Inclusion does not imply endorsement.

See [Tool catalog policy](./docs/TOOL_CATALOG.md) before adding or changing a Tool.
