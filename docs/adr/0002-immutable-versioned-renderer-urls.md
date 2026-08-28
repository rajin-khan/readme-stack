# Keep renderer URLs immutable and versioned

Every successful Stack Marquee URL represents permanent output, and incompatible renderer changes use a new path such as `/v2/stack.svg`. This makes GitHub Camo and edge caching safe and keeps old profile embeds stable, at the cost of maintaining old renderer behavior after future releases.
