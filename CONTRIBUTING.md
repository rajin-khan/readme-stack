# Contributing to README Stack

Bug fixes, accessibility improvements, documentation corrections, and carefully reviewed Tool additions are welcome.

## Before you start

- Search the existing issues before opening a new one.
- Use the Tool request template for catalog additions.
- Read the [Tool catalog policy](./docs/TOOL_CATALOG.md) before changing a logo or its metadata.
- Keep the renderer deterministic. A request must not depend on a database, live API, or remote image.
- Existing `/v1/stack.svg` output is immutable. Any intentional visual change to an existing URL needs a new renderer version.

## Local setup

You need Node.js 22 or newer and pnpm 9 or newer.

```sh
git clone https://github.com/rajin-khan/readme-stack.git
cd readme-stack
pnpm install --frozen-lockfile
pnpm build
pnpm dev
```

The local builder runs at `http://127.0.0.1:4173`.

## Make a change

Keep pull requests focused. If a change affects generated catalog files, update the source in `data/tool-seeds.mjs` and run `pnpm build` instead of editing generated output by hand.

Before opening a pull request, run:

```sh
pnpm build
pnpm check
pnpm test
WRANGLER_LOG_PATH=/tmp/readme-stack-wrangler.log pnpm exec wrangler deploy --dry-run
```

Then inspect the affected SVG in dark, light, and transparent treatments. Motion changes also need a reduced-motion check.

## Pull requests

Explain what changed and why. Include before-and-after images for visual changes and list any renderer URLs whose output changes. By submitting a contribution, you agree that it can be released under the repository's MIT License.

For security problems, do not open a public issue. Use [GitHub's private vulnerability reporting](https://github.com/rajin-khan/readme-stack/security/advisories/new).
