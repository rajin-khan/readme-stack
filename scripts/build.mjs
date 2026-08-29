import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import * as simpleIcons from "simple-icons";
import { customTools } from "../data/custom-tools.mjs";
import { featuredOrder, toolSeeds } from "../data/tool-seeds.mjs";
import { rightsFor } from "../data/tool-rights.mjs";

const normalize = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, "");
const icons = Object.values(simpleIcons).filter((icon) => icon?.slug && icon?.path);
const byExactTitle = new Map(icons.map((icon) => [icon.title.toLowerCase(), icon]));
const byNormalized = new Map();
const customByNormalized = new Map();
const preferDevicon = new Set(["bun"]);

for (const icon of icons) {
  for (const key of [normalize(icon.title), normalize(icon.slug)]) {
    if (!byNormalized.has(key)) byNormalized.set(key, icon);
  }
}

for (const tool of customTools) {
  if (!/^[a-z0-9]+$/.test(tool.id) || !tool.name || !tool.source || !tool.provider || (!tool.path && !tool.body)) {
    throw new Error(`Custom Tool ${tool.id || "unknown"} is incomplete.`);
  }
  if (tool.body && /<script\b|\bon[a-z]+=|\b(?:href|src)=["'](?:https?:|\/\/)/i.test(tool.body)) {
    throw new Error(`Custom Tool ${tool.id} contains unsafe or remote SVG content.`);
  }
  for (const key of [tool.id, tool.name, ...(tool.aliases ?? [])].map(normalize)) {
    if (!customByNormalized.has(key)) customByNormalized.set(key, tool);
  }
}

const used = new Set();
const missing = [];
const catalog = [];

const deviconRoot = new URL("../node_modules/devicon/", import.meta.url);
const deviconMetadata = JSON.parse(await readFile(new URL("devicon.json", deviconRoot), "utf8"));
const deviconAliases = {
  aws: "amazonwebservices",
  microsoftazure: "azure",
  visualstudiocode: "vscode",
  microsoftsqlserver: "microsoftsqlserver",
  amazondynamodb: "dynamodb",
  aspnetcore: "dotnetcore",
  reactnative: "reactnative",
  githubdesktop: "github",
  windowsterminal: "windows11",
  progressivewebapps: "pwa"
};
const deviconByName = new Map();

for (const item of deviconMetadata) {
  for (const key of [item.name, ...(item.altnames ?? [])].map(normalize)) {
    if (!deviconByName.has(key)) deviconByName.set(key, item);
  }
}

const prefixSvgIds = (body, prefix) => {
  const ids = [...body.matchAll(/\bid=["']([^"']+)["']/g)].map((match) => match[1]);
  let result = body;
  for (const id of ids) {
    const escaped = id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    result = result
      .replace(new RegExp(`id=(["'])${escaped}\\1`, "g"), `id="${prefix}-${id}"`)
      .replace(new RegExp(`url\\(#${escaped}\\)`, "g"), `url(#${prefix}-${id})`)
      .replace(new RegExp(`(["'])#${escaped}\\1`, "g"), `"#${prefix}-${id}"`);
  }
  return result;
};

async function resolveDevicon(requestedName) {
  const requestedKey = normalize(requestedName);
  const item = deviconByName.get(deviconAliases[requestedKey] ?? requestedKey);
  if (!item) return null;
  const versions = item.versions?.svg ?? [];
  const preferred = ["original", "plain", "line", "original-wordmark", "plain-wordmark", "line-wordmark"]
    .find((version) => versions.includes(version));
  if (!preferred) return null;
  const filename = `${item.name}-${preferred}.svg`;
  const url = new URL(`icons/${item.name}/${filename}`, deviconRoot);
  try {
    await access(url);
  } catch {
    return null;
  }
  const svg = await readFile(url, "utf8");
  const viewBox = svg.match(/viewBox=["']([^"']+)["']/i)?.[1] ?? "0 0 128 128";
  const rawBody = svg.match(/<svg\b[^>]*>([\s\S]*?)<\/svg>/i)?.[1];
  if (!rawBody) return null;
  const body = prefixSvgIds(rawBody.replace(/<title>[\s\S]*?<\/title>/gi, ""), `devicon-${item.name}`);
  return {
    id: item.name,
    name: requestedName,
    hex: item.color?.replace("#", "") ?? "888888",
    body,
    viewBox,
    source: `https://github.com/devicons/devicon/tree/v2.17.0/icons/${item.name}`,
    provider: "Devicon 2.17.0",
    aliases: [...new Set([requestedName, item.name, ...(item.altnames ?? [])].map(normalize).filter(Boolean))]
  };
}

for (const [category, names] of Object.entries(toolSeeds)) {
  for (const requestedName of names) {
    const custom = customByNormalized.get(normalize(requestedName));
    if (custom) {
      if (used.has(custom.id)) continue;
      used.add(custom.id);
      catalog.push({
        ...custom,
        category,
        aliases: [...new Set([requestedName, custom.name, custom.id, ...(custom.aliases ?? [])].map(normalize).filter(Boolean))]
      });
      continue;
    }
    const requestedKey = normalize(requestedName);
    const icon = preferDevicon.has(requestedKey)
      ? null
      : byExactTitle.get(requestedName.toLowerCase()) ?? byNormalized.get(requestedKey);
    if (!icon) {
      const devicon = await resolveDevicon(requestedName);
      if (!devicon || used.has(devicon.id)) {
        missing.push(requestedName);
        continue;
      }
      used.add(devicon.id);
      catalog.push({ ...devicon, category });
      continue;
    }
    if (used.has(icon.slug)) continue;
    used.add(icon.slug);
    catalog.push({
      id: icon.slug,
      name: icon.title,
      category,
      hex: icon.hex,
      path: icon.path,
      source: icon.source,
      provider: "Simple Icons 16.28.0",
      iconLicense: icon.license ?? null,
      aliases: [...new Set([requestedName, icon.title, icon.slug].map(normalize).filter(Boolean))]
    });
  }
}

catalog.sort((a, b) => {
  const ai = featuredOrder.indexOf(a.name);
  const bi = featuredOrder.indexOf(b.name);
  if (ai !== -1 || bi !== -1) return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
  return a.name.localeCompare(b.name);
});

for (let index = 0; index < catalog.length; index += 1) {
  const tool = catalog[index];
  const rights = rightsFor(tool);
  if (!rights) throw new Error(`Catalog Tool ${tool.id} has no reviewed rights record.`);
  const { render, ...publicRights } = rights;
  const { iconLicense, ...publicTool } = tool;
  catalog[index] = { ...publicTool, ...(render ?? {}), rights: publicRights };
}

if (catalog.length < 280) {
  throw new Error(`Catalog has ${catalog.length} Tools. At least 280 are required. Missing: ${missing.join(", ")}`);
}

await mkdir("src/generated", { recursive: true });
await mkdir("public", { recursive: true });

const banner = "// Generated by scripts/build.mjs. Do not edit by hand.\n";
await writeFile("src/generated/catalog.js", `${banner}export const catalog = ${JSON.stringify(catalog)};\n`);
await writeFile("public/catalog.json", `${JSON.stringify(catalog)}\n`);
await writeFile("public/catalog-meta.json", `${JSON.stringify({ count: catalog.length, missing }, null, 2)}\n`);

console.log(`Built ${catalog.length} Tools. ${missing.length} requested names were not found.`);
if (missing.length) console.log(`Missing: ${missing.join(", ")}`);
