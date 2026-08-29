# README Stack build plan

## Outcome

Ship a free tool for making a scrolling tech stack for a GitHub profile README.

## Codex-owned work

Codex completes and verifies these items locally before asking Rajin to touch an external service:

- Define the versioned Configuration grammar and validation limits.
- Build a deterministic, self-contained SVG renderer with no runtime network calls.
- Build the Tool Catalog pipeline with provenance and aliases.
- Seed roughly 300 reviewed developer Tools.
- Build the responsive Builder with search, presets, ordering, removal, undo, and live preview.
- Add light, dark, and transparent Treatments.
- Add the agreed Presentation Controls and Motion Modes.
- Generate Markdown and HTML `picture` snippets with meaningful alt text.
- Add static and animated SVG endpoints.
- Add error SVGs for invalid requests.
- Add automated renderer, input, catalog, and browser tests.
- Add a local preview server and permanent compatibility fixtures.
- Add Cloudflare Worker configuration without deploying it.
- Write the README, self-hosting instructions, asset policy, and launch checklist.
- Run design, accessibility, security, performance, and reduced-motion checks.

## Rajin-owned work

Rajin handles only actions that require an external account, domain ownership, or a public decision:

- Confirm access to the existing Cloudflare account.
- Confirm that `rajinkhan.com` can use Cloudflare DNS or provide another domain.
- Create or select the public GitHub repository when asked.
- Connect the repository to Cloudflare when local work is ready.
- Keep the Cloudflare DNS records for the Vercel portfolio and the README Stack custom domain healthy.
- Approve any Cloudflare permission prompt or account-level setting.
- Put the final embed into the GitHub profile README after the public URL works.
- Approve the public product name after the naming check.

Codex will provide exact click-by-click instructions for each item when it becomes necessary. Rajin should not create a database, KV namespace, R2 bucket, paid Worker plan, Vercel project, or new domain for version one.

## Handoff gates

### Local product gate: complete

The Builder, renderer, tests, documentation, responsive checks, and local visual QA are complete.

### Cloudflare gate: complete

The repository deploys through Cloudflare Workers Builds. The public address is `https://stack.rajinkhan.com`.

### GitHub compatibility gate

Rajin places a supplied test snippet in a public canary README if Codex cannot create the repository directly. Codex verifies GitHub Camo behavior across browsers and adjusts the renderer if needed.

### Launch gate

Rajin approves the final name and makes the repository public. Codex prepares launch copy, examples, contribution templates, and the profile embed.

## Version-one boundary

Version one includes manual selection, roughly 300 Tools, six presets, 2-24 Tool Stacks, controlled visual options, animated and static SVG, a linked Builder configuration, and MIT-licensed self-hosting.

It excludes accounts, a database, repository scanning, package-file imports, arbitrary uploads, arbitrary SVG or image URLs, custom CSS, annotations, a theme marketplace, live GitHub API data, and on-demand GIF generation.
