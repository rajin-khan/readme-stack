# Security model

The renderer accepts public unauthenticated GET requests. Its narrow input grammar is the main defense.

- Tool selection uses allowlisted IDs only.
- Presentation values use fixed enums.
- The renderer does not fetch user-provided URLs.
- The renderer does not accept user SVG, HTML, CSS, JavaScript, fonts, or text labels.
- Duplicate Tool IDs are removed.
- Stack length and URL length are capped.
- Successful output is deterministic and immutable.
- Invalid input returns a bounded SVG error tile with `no-store` caching.
- SVG text is XML-escaped.
- The response sets `X-Content-Type-Options: nosniff`.

Before launch, configure Cloudflare monitoring for Worker request usage. Do not add a database, upload endpoint, arbitrary color parser, or remote asset proxy without a separate threat review.
