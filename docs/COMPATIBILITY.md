# Compatibility

Automated tests verify local rendering. The public service uses self-contained SVG because GitHub proxies remote README images through Camo and does not formally guarantee animated SVG behavior in every browser.

## Canary fixtures

- Default animated dark Marquee
- Light Marquee through a `picture` source
- Transparent Marquee
- Static Motion Mode
- One-pass Motion Mode
- Two-Tool short Stack
- 100-Tool maximum Stack
- Names hidden
- Reduced-motion static presentation
- Invalid Tool error tile

## Browser matrix

- Current Chrome, signed in and signed out of GitHub
- Current Firefox
- Current Safari
- Desktop and narrow mobile widths
- System light and dark modes
- Reduced motion enabled and disabled

## Release checks

- GitHub Camo returns the correct MIME type and displays the image.
- The animation has no visible seam over multiple loops.
- Light and dark `picture` sources switch correctly.
- Reduced motion exposes a useful view of every selected Tool.
- Static and error output remains legible when GitHub scales it.
- Changing the Configuration creates a new Camo URL and output.
- Existing versioned URLs do not change after a deployment.
