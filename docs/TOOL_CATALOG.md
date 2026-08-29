# Tool catalog policy

The Tool Catalog is curated. Breadth matters, but a broken or legally careless logo damages every README that embeds it.

## Sources

The build currently accepts marks from:

- Simple Icons 16.28.0
- Devicon 2.17.0
- Checked-in official project assets
- Neutral glyphs made for README Stack when no reusable canonical logo exists

Both packages are pinned and were published more than seven days before installation. Checked-in additions record their source and provider in `data/custom-tools.mjs`. Neutral glyphs must not imitate a protected logo. The renderer never downloads a logo during a request.

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
- Rights status: `licensed`, `brand-guidelines`, `catalog-source`, or `neutral`
- License or use basis
- Public notice or policy URL

The build adds this record to every generated entry. `pnpm check` fails if any Tool has missing or unknown rights metadata. `catalog-source` means README Stack received the artwork through a pinned icon package. It does not mean the package granted trademark rights.

## Adding a Tool

1. Add its canonical source title to the relevant category in `data/tool-seeds.mjs`.
2. If neither pinned package supplies it, add a reviewed entry to `data/custom-tools.mjs` using an official project asset or a clearly labeled neutral glyph.
3. Run `pnpm build`.
4. Confirm it is not listed in `public/catalog-meta.json` under `missing`.
5. Inspect the Tool in dark, light, and transparent Treatments.
6. Verify the source's trademark or brand guidance.
7. Add an explicit rights record to `data/tool-rights.mjs` when the provider defaults do not describe the asset accurately.
8. Add required attribution to `THIRD_PARTY_NOTICES.md`.
9. Run `pnpm check` and `pnpm test`.

Do not accept arbitrary SVG uploads, arbitrary remote logo URLs, scraped marks with unknown provenance, or a mark whose brand owner prohibits the intended use.

Official source does not mean free to redistribute. If the source terms are unclear, use an original neutral glyph or leave the Tool out until the owner gives permission.

## Removal and correction

Honor brand-owner correction and removal requests. Changing or removing a Tool can affect existing immutable embeds, so catalog corrections that alter existing output require a renderer version change unless the old mark creates an immediate security or legal problem.
