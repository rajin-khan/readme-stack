import { readFile } from "node:fs/promises";
import { catalog } from "../src/generated/catalog.js";

const files = [
  "public/index.html",
  "public/styles.css",
  "public/app.js",
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

for (const file of files) {
  const value = await readFile(file, "utf8");
  if (value.includes("—") || value.includes("–")) failures.push(`${file} contains a banned dash character.`);
  if (/(^|\s)npm (install|run)(\s|$)/m.test(value)) failures.push(`${file} contains an npm command.`);
}

if (catalog.length < 280 || catalog.length > 380) failures.push(`Catalog count ${catalog.length} is outside the reviewed launch range.`);
if (new Set(catalog.map((tool) => tool.id)).size !== catalog.length) failures.push("Catalog Tool IDs are not unique.");
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
