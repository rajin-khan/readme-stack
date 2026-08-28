# Tool catalog policy

The Tool Catalog is curated. Breadth matters, but a broken or legally careless logo damages every README that embeds it.

## Sources

The build currently accepts marks from:

- Simple Icons 16.28.0
- Devicon 2.17.0

Both packages are pinned and were published more than seven days before installation. The renderer never downloads a logo during a request.

## Required metadata

Every generated Tool must have:

- A stable lowercase ID
- Display name
- Category
- Search aliases
- Renderable SVG path or SVG body
- Source URL
- Provider and version
- Brand color when the source supplies one

## Adding a Tool

1. Add its canonical source title to the relevant category in `data/tool-seeds.mjs`.
2. Run `pnpm build`.
3. Confirm it is not listed in `public/catalog-meta.json` under `missing`.
4. Inspect the Tool in dark, light, and transparent Treatments.
5. Verify the source's trademark or brand guidance.
6. Run `pnpm check` and `pnpm test`.

Do not accept arbitrary SVG uploads, arbitrary remote logo URLs, scraped marks with unknown provenance, or a mark whose brand owner prohibits the intended use.

## Removal and correction

Honor brand-owner correction and removal requests. Changing or removing a Tool can affect existing immutable embeds, so catalog corrections that alter existing output require a renderer version change unless the old mark creates an immediate security or legal problem.
