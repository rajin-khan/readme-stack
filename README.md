<p align="center">
  <a href="https://stack.rajinkhan.com">
    <img src="./public/brand/favicon.svg" width="72" alt="README Stack logo">
  </a>
</p>

<h1 align="center">README Stack</h1>

<p align="center">Turn the tools you use into a scrolling stack for your GitHub profile.</p>

<p align="center">
  <a href="https://stack.rajinkhan.com"><strong>Build your stack</strong></a>
  ·
  <a href="#use-it-in-one-line">Use the URL</a>
  ·
  <a href="#customize-the-svg">Options</a>
  ·
  <a href="./CONTRIBUTING.md">Contribute</a>
</p>

<p align="center">
  <a href="https://github.com/rajin-khan/readme-stack/actions/workflows/ci.yml"><img src="https://github.com/rajin-khan/readme-stack/actions/workflows/ci.yml/badge.svg" alt="CI status"></a>
  <a href="./LICENSE"><img src="https://img.shields.io/github/license/rajin-khan/readme-stack?color=171717" alt="MIT license"></a>
  <a href="https://stack.rajinkhan.com"><img src="https://img.shields.io/badge/Cloudflare-Worker-F38020?logo=cloudflare&logoColor=white" alt="Runs on Cloudflare Workers"></a>
</p>

<p align="center">
  <a href="https://stack.rajinkhan.com/?i=typescript,react,nextdotjs,tailwindcss,cloudflare,github">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://stack.rajinkhan.com/v1/stack.svg?i=typescript,react,nextdotjs,tailwindcss,cloudflare,github&amp;t=dark">
      <source media="(prefers-color-scheme: light)" srcset="https://stack.rajinkhan.com/v1/stack.svg?i=typescript,react,nextdotjs,tailwindcss,cloudflare,github&amp;t=light">
      <img alt="Scrolling stack with TypeScript, React, Next.js, Tailwind CSS, Cloudflare, and GitHub" src="https://stack.rajinkhan.com/v1/stack.svg?i=typescript,react,nextdotjs,tailwindcss,cloudflare,github&amp;t=light">
    </picture>
  </a>
</p>

## Make yours

Open [stack.rajinkhan.com](https://stack.rajinkhan.com), choose your tools, arrange them, and copy the finished GitHub markup. The preview updates while you work.

There is no account to create and no token, package, or GitHub Action to configure.

## Use it in one line

You can also write the image URL yourself. Paste this into a profile README and replace the tool IDs:

```md
[![My stack](https://stack.rajinkhan.com/v1/stack.svg?i=typescript,react,nextdotjs,tailwindcss)](https://stack.rajinkhan.com)
```

The part after `i=` is an ordered, comma-separated list. The hosted URL returns the finished SVG directly.

## Made for profile READMEs

- 345 tools sourced from [Simple Icons](https://simpleicons.org) and [Devicon](https://devicon.dev)
- Tool names on by default, so the stack stays readable beyond the logos
- Dark, light, and transparent treatments
- Infinite, one-pass, and static motion
- A useful static strip for readers who prefer reduced motion
- Shareable builder URLs and immutable versioned image URLs
- Self-contained SVG output with no third-party requests at render time

Stacks can contain 2 to 24 tools. Duplicate IDs are removed, invalid input returns a readable SVG error, and the service does not inspect GitHub accounts or repositories.

## Match GitHub's theme

The builder can copy a `picture` snippet that switches automatically between light and dark treatments:

```html
<a href="https://stack.rajinkhan.com/?i=typescript,react,nextdotjs,tailwindcss">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://stack.rajinkhan.com/v1/stack.svg?i=typescript,react,nextdotjs,tailwindcss&amp;t=dark">
    <source media="(prefers-color-scheme: light)" srcset="https://stack.rajinkhan.com/v1/stack.svg?i=typescript,react,nextdotjs,tailwindcss&amp;t=light">
    <img alt="My stack: TypeScript, React, Next.js, and Tailwind CSS" src="https://stack.rajinkhan.com/v1/stack.svg?i=typescript,react,nextdotjs,tailwindcss&amp;t=light">
  </picture>
</a>
```

The image links back to its builder configuration, so you can edit the same stack later.

## Customize the SVG

Add options to the hosted image URL:

```text
https://stack.rajinkhan.com/v1/stack.svg?i=typescript,react,nextdotjs&s=slow&d=right
```

| Parameter | Controls | Accepted values | Default |
| --- | --- | --- | --- |
| `i` | Ordered tool IDs | 2 to 24 comma-separated IDs | README Stack default |
| `t` | Treatment | `dark`, `light`, `transparent` | `dark` |
| `s` | Speed | `slow`, `normal`, `fast` | `normal` |
| `d` | Direction | `left`, `right` | `left` |
| `g` | Spacing | `compact`, `comfortable` | `comfortable` |
| `l` | Tool names | `on`, `off` | `on` |
| `m` | Motion | `infinite`, `once`, `static` | `infinite` |
| `z` | Tool size | `small`, `large` | `large` |

Use the [builder](https://stack.rajinkhan.com) to search valid tool IDs. Successful `/v1/stack.svg` URLs are immutable, so an existing profile embed will not silently change when a future renderer version ships.

## Development

You need Node.js 22 or newer and pnpm 9 or newer.

```sh
git clone https://github.com/rajin-khan/readme-stack.git
cd readme-stack
pnpm install --frozen-lockfile
pnpm build
pnpm dev
```

Open `http://127.0.0.1:4173`. Run the full check before opening a pull request:

```sh
pnpm build
pnpm check
pnpm test
WRANGLER_LOG_PATH=/tmp/readme-stack-wrangler.log pnpm exec wrangler deploy --dry-run
```

The Wrangler dry run does not contact or change a Cloudflare account.

## Project notes

- [Contributing](./CONTRIBUTING.md) explains the local workflow and pull request checks.
- [Tool catalog policy](./docs/TOOL_CATALOG.md) covers logo sources, additions, and corrections.
- [Compatibility](./docs/COMPATIBILITY.md) records supported GitHub and browser behavior.
- [Architecture](./docs/ARCHITECTURE.md) describes the builder, renderer, and generated catalog.
- [Security model](./docs/SECURITY.md) documents the public renderer's input boundary.
- [Domain language](./CONTEXT.md) keeps product terms consistent.

## License and trademarks

README Stack is available under the [MIT License](./LICENSE). Simple Icons data is distributed under CC0-1.0 and Devicon under MIT. Product names and logos belong to their owners. Inclusion does not imply endorsement.
