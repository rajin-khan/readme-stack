import { readFile } from "node:fs/promises";
import * as simpleIcons from "simple-icons";
import { catalog } from "../src/generated/catalog.js";

const files = [
  "public/index.html",
  "public/styles.css",
  "public/app.js",
  "public/robots.txt",
  "public/sitemap.xml",
  "public/site.webmanifest",
  "public/og/source.html",
  "src/config.js",
  "src/render.js",
  "src/worker.js",
  "README.md",
  "docs/ARCHITECTURE.md",
  "docs/COMPATIBILITY.md",
  "docs/LOGO_USE.md",
  "docs/SECURITY.md",
  "docs/TOOL_CATALOG.md",
  "THIRD_PARTY_NOTICES.md"
];
const failures = [];
const sourceByFile = new Map();
const simpleIconBySlug = new Map(Object.values(simpleIcons).filter((icon) => icon?.slug).map((icon) => [icon.slug, icon]));

for (const file of files) {
  const value = await readFile(file, "utf8");
  sourceByFile.set(file, value);
  if (value.includes("—") || value.includes("–")) failures.push(`${file} contains a banned dash character.`);
  if (/(^|\s)npm (install|run)(\s|$)/m.test(value)) failures.push(`${file} contains an npm command.`);
}

const index = sourceByFile.get("public/index.html");
for (const required of [
  '<link rel="canonical" href="https://stack.rajinkhan.com/">',
  'property="og:image"',
  'name="twitter:card"',
  'type="application/ld+json"'
]) {
  if (!index.includes(required)) failures.push(`public/index.html is missing SEO markup: ${required}`);
}
if (!index.includes("Third-party names and marks belong to their owners")) failures.push("public/index.html is missing the public trademark notice.");

const robots = sourceByFile.get("public/robots.txt");
if (!robots.includes("https://stack.rajinkhan.com/sitemap.xml")) failures.push("robots.txt does not advertise the sitemap.");

const sitemap = sourceByFile.get("public/sitemap.xml");
if (!sitemap.includes("<loc>https://stack.rajinkhan.com/</loc>")) failures.push("sitemap.xml does not contain the canonical homepage.");

JSON.parse(sourceByFile.get("public/site.webmanifest"));

const catalogMeta = JSON.parse(await readFile("public/catalog-meta.json", "utf8"));
if (catalog.length < 600) failures.push(`Catalog count ${catalog.length} is below the reviewed baseline.`);
if (catalogMeta.count !== catalog.length) failures.push(`Catalog metadata count ${catalogMeta.count} does not match ${catalog.length} generated Tools.`);
if (!index.includes(`${catalog.length} developer tools`)) failures.push("public/index.html does not advertise the generated catalog count.");
if (!sourceByFile.get("README.md").includes(`${catalog.length} tools sourced`)) failures.push("README.md does not advertise the generated catalog count.");
if (new Set(catalog.map((tool) => tool.id)).size !== catalog.length) failures.push("Catalog Tool IDs are not unique.");
const officialLogoIds = [
  "autogen", "cloudflared1", "cloudflarer2", "grok", "openai", "powerbi", "sveltekit", "xai"
];
for (const id of officialLogoIds) {
  const tool = catalog.find((entry) => entry.id === id);
  if (!tool || tool.provider === "README Stack neutral glyph" || !tool.body?.includes("data:image/")) {
    failures.push(`Catalog entry ${id} is missing its reviewed official logo.`);
  }
}
for (const tool of catalog) {
  if (!tool.id || !tool.name || !tool.category || !tool.source || !tool.provider) failures.push(`Catalog entry ${tool.id || "unknown"} is incomplete.`);
  if (!tool.path && !tool.body) failures.push(`Catalog entry ${tool.id} has no renderable mark.`);
  if (!tool.rights?.status || !tool.rights?.license || !tool.rights?.notice) failures.push(`Catalog entry ${tool.id} has no complete rights record.`);
  if (!new Set(["licensed", "brand-guidelines", "catalog-source", "neutral"]).has(tool.rights?.status)) failures.push(`Catalog entry ${tool.id} has an unknown rights status.`);
  const sourceIcon = tool.provider === "Simple Icons 16.28.0" ? simpleIconBySlug.get(tool.id) : null;
  if (sourceIcon?.license && tool.rights.status !== "neutral" && !tool.rights.license.includes(sourceIcon.license.type)) {
    failures.push(`Catalog entry ${tool.id} does not preserve its ${sourceIcon.license.type} icon license.`);
  }
}

for (const required of ["Third-party names and marks", "Groq is a trademark", "Simple Icons", "Devicon", "Power BI", "AutoGen", "Cloudflare D1", "Chroma"]) {
  if (!sourceByFile.get("THIRD_PARTY_NOTICES.md").includes(required)) failures.push(`THIRD_PARTY_NOTICES.md is missing ${required}.`);
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Checks passed for ${catalog.length} Tools and ${files.length} source files.`);
}
