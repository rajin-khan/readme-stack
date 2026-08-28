# Stack Marquee

Stack Marquee helps developers present a deliberately chosen tool stack as a moving visual in a GitHub profile README. It is a focused profile component, not a general README generator or an automated analysis of a developer's repositories.

## Language

**Profile Owner**:
A developer who creates and embeds a Stack Marquee in their GitHub profile README.
_Avoid_: Customer, account holder, site owner

**Tool**:
A named technology or product available for a Profile Owner to select.
_Avoid_: Skill, dependency, badge

**Tool Catalog**:
The curated set of Tools available for manual selection, with colorful official marks preferred and carefully colored glyphs used when a suitable official variant is unavailable.
_Avoid_: Marketplace, package index, skill database

**Stack**:
The ordered set of Tools a Profile Owner deliberately chooses to present.
_Avoid_: Detected stack, dependency list, skills

**Builder**:
The GitHub-profile-focused experience where a Profile Owner manually selects, removes, and orders a Stack and chooses its presentation.
_Avoid_: Profile generator, repository scanner, dashboard

**Configuration**:
The complete, shareable set of choices that defines one Stack and its presentation without requiring a Profile Owner account.
_Avoid_: Account, project, saved profile

**Marquee**:
The generated visual representation of a Stack, designed to move continuously by default inside a GitHub profile README.
_Avoid_: Badge list, stats card, carousel

**House Style**:
The recognizable visual identity shared by every Marquee. It uses colorful Tool marks and names by default, with a small set of controlled presentation choices rather than unrelated themes.
_Avoid_: Theme marketplace, template gallery

**Treatment**:
A controlled light, dark, or transparent adaptation of the House Style.
_Avoid_: Theme, skin, template

**Presentation Controls**:
The bounded choices for Treatment, speed, direction, spacing, labels, Motion Mode, and Tool size.
_Avoid_: Theme editor, SVG editor, custom CSS

**Motion Mode**:
The Marquee's movement behavior. The supported concepts are an infinite loop, a single pass, and a static composition, with a useful static presentation for viewers who prefer reduced motion.
_Avoid_: Animation theme, transition preset

**Hosted Service**:
The public service that keeps embedded Marquees available without requiring each Profile Owner to install or operate software.
_Avoid_: Self-hosted generator, GitHub Action

**Builder Link**:
The link wrapped around a Marquee that opens its Configuration in the Builder. It provides a useful editing path and project discovery without placing a visible watermark on the Marquee.
_Avoid_: Watermark, tracking pixel, advertisement

**Annotation**:
Personal commentary attached to an individual Tool. Annotations are outside the initial product scope.
_Avoid_: Highlight, favorite note
