import { readFile } from "node:fs/promises";
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
  "docs/SECURITY.md",
  "docs/TOOL_CATALOG.md"
];
const failures = [];
const sourceByFile = new Map();

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

const robots = sourceByFile.get("public/robots.txt");
if (!robots.includes("https://stack.rajinkhan.com/sitemap.xml")) failures.push("robots.txt does not advertise the sitemap.");

const sitemap = sourceByFile.get("public/sitemap.xml");
if (!sitemap.includes("<loc>https://stack.rajinkhan.com/</loc>")) failures.push("sitemap.xml does not contain the canonical homepage.");

JSON.parse(sourceByFile.get("public/site.webmanifest"));

if (catalog.length < 280 || catalog.length > 450) failures.push(`Catalog count ${catalog.length} is outside the reviewed launch range.`);
if (new Set(catalog.map((tool) => tool.id)).size !== catalog.length) failures.push("Catalog Tool IDs are not unique.");
const officialLogoIds = [
  "autogen", "bolt", "cerebras", "cloudflared1", "cloudflarer2", "codex", "cohere", "dbt", "grok", "llamaindex",
  "lovable", "mkdocs", "openai", "pinecone", "powerbi", "runpod", "sveltekit", "tableau", "togetherai", "weaviate"
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
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Checks passed for ${catalog.length} Tools and ${files.length} source files.`);
}
