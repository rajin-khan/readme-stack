import { LIMITS, parseConfiguration } from "./config.js";

const xml = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&apos;");

const SPEEDS = { slow: 20, normal: 30, fast: 44 };
const THEMES = {
  dark: { background: "#111315", foreground: "#f2f1ec", muted: "#a8aaa8", edge: "#111315" },
  light: { background: "#f3f2ed", foreground: "#1a1c1d", muted: "#666965", edge: "#f3f2ed" },
  transparent: { background: null, foreground: "#777b78", muted: "#777b78", edge: "#ffffff" }
};

const luminance = (hex) => {
  const channels = hex.match(/[a-f\d]{2}/gi)?.map((part) => parseInt(part, 16) / 255) ?? [0.5, 0.5, 0.5];
  const linear = channels.map((value) => value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
};

const simpleIconColor = (tool, treatment) => {
  const hex = `#${tool.hex}`;
  const value = luminance(tool.hex);
  if (treatment === "dark" && value < 0.055) return "#f2f1ec";
  if (treatment === "light" && value > 0.86) return "#1a1c1d";
  return hex;
};

function iconMarkup(tool, x, y, size, treatment, useDefinitions = false) {
  if (useDefinitions) {
    return `<use href="#tool-${xml(tool.id)}" x="${x}" y="${y}" width="${size}" height="${size}"/>`;
  }
  if (tool.path) {
    const scale = size / 24;
    return `<g transform="translate(${x} ${y}) scale(${scale})"><path fill="${simpleIconColor(tool, treatment)}" d="${tool.path}"/></g>`;
  }
  const [minX, minY, width, height] = String(tool.viewBox || "0 0 128 128").split(/\s+/).map(Number);
  const extent = Math.max(width || 128, height || 128);
  const scale = size / extent;
  const offsetX = x + (size - (width || extent) * scale) / 2 - minX * scale;
  const offsetY = y + (size - (height || extent) * scale) / 2 - minY * scale;
  return `<g transform="translate(${offsetX} ${offsetY}) scale(${scale})">${tool.body}</g>`;
}

function iconDefinitions(tools, treatment) {
  return tools.map((tool) => {
    const viewBox = tool.path ? "0 0 24 24" : String(tool.viewBox || "0 0 128 128");
    const body = tool.path
      ? `<path fill="${simpleIconColor(tool, treatment)}" d="${tool.path}"/>`
      : tool.body;
    return `<symbol id="tool-${xml(tool.id)}" viewBox="${xml(viewBox)}">${body}</symbol>`;
  }).join("");
}

function measureItem(tool, config, iconSize) {
  const gap = config.spacing === "compact" ? 12 : 18;
  const outer = config.spacing === "compact" ? 18 : 28;
  const labelWidth = config.labels === "on" ? Math.max(42, tool.name.length * (iconSize === 40 ? 9.1 : 8.1)) : 0;
  return { gap, outer, width: iconSize + labelWidth + (labelWidth ? gap : 0) + outer };
}

function trackMarkup(sequence, config, theme, iconSize, y, useDefinitions = false) {
  let cursor = 0;
  const items = [];
  for (const tool of sequence) {
    const measure = measureItem(tool, config, iconSize);
    const iconY = y - iconSize / 2;
    items.push(iconMarkup(tool, cursor, iconY, iconSize, config.treatment, useDefinitions));
    if (config.labels === "on") {
      const fontSize = iconSize === 40 ? 17 : 15;
      items.push(`<text x="${cursor + iconSize + measure.gap}" y="${y + fontSize * 0.34}" fill="${theme.foreground}" font-family="ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif" font-size="${fontSize}" font-weight="650" letter-spacing="-0.2">${xml(tool.name)}</text>`);
    }
    cursor += measure.width;
  }
  return { width: cursor, markup: `<g>${items.join("")}</g>` };
}

function staticStrip(config, width, height, theme, useDefinitions = false) {
  const count = config.tools.length;
  const columns = Math.min(25, count);
  const rows = Math.ceil(count / columns);
  const usable = width - 64;
  const stepX = usable / columns;
  const stepY = (height - 12) / rows;
  const size = Math.max(12, Math.min(
    config.size === "large" ? 34 : 28,
    Math.floor(stepX - 8),
    Math.floor(stepY - 4)
  ));
  const icons = config.tools.map((tool, index) => {
    const column = index % columns;
    const row = Math.floor(index / columns);
    const x = 32 + column * stepX + (stepX - size) / 2;
    const y = 6 + row * stepY + (stepY - size) / 2;
    return iconMarkup(tool, x, y, size, config.treatment, useDefinitions);
  });
  return `<g id="static-strip" aria-hidden="true">${icons.join("")}</g>`;
}

export function renderErrorSvg(message, status = 400) {
  const safe = xml(message);
  return {
    status,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="92" viewBox="0 0 960 92" role="img" aria-label="README Stack error: ${safe}"><rect width="960" height="92" rx="14" fill="#18191b"/><path d="M30 27h38v38H30z" fill="#d16b5b"/><path d="M49 36v15M49 57v1" stroke="#18191b" stroke-width="4" stroke-linecap="round"/><text x="86" y="55" fill="#f2f1ec" font-family="ui-sans-serif,system-ui,sans-serif" font-size="17" font-weight="650">${safe}</text></svg>`
  };
}

export function renderStackSvg(input) {
  const parsed = parseConfiguration(input);
  if (!parsed.ok) return renderErrorSvg(parsed.error, parsed.status);

  const { config } = parsed;
  const width = LIMITS.width;
  const height = config.labels === "on" ? 92 : 76;
  const iconSize = config.size === "large" ? 40 : 32;
  const theme = THEMES[config.treatment];
  const y = height / 2;
  const useDefinitions = config.tools.length > 24;
  const baseTrack = trackMarkup(config.tools, config, theme, iconSize, y, useDefinitions);
  const repeatCount = Math.max(1, Math.ceil((width + 120) / baseTrack.width));
  const sequence = Array.from({ length: repeatCount }, () => config.tools).flat();
  const track = trackMarkup(sequence, config, theme, iconSize, y, useDefinitions);
  const duration = Math.max(6, track.width / SPEEDS[config.speed]);
  const from = config.direction === "left" ? "0 0" : `${-track.width} 0`;
  const to = config.direction === "left" ? `${-track.width} 0` : "0 0";
  const repeat = config.motion === "once" ? "1" : "indefinite";
  const animation = config.motion === "static" ? "" : `<animateTransform attributeName="transform" type="translate" from="${from}" to="${to}" dur="${duration.toFixed(2)}s" repeatCount="${repeat}" fill="freeze"/>`;
  const background = theme.background ? `<rect width="${width}" height="${height}" rx="14" fill="${theme.background}"/>` : "";
  const movingDisplay = config.motion === "static" ? "none" : "inline";
  const staticDisplay = config.motion === "static" ? "inline" : "none";
  const title = `Tech stack: ${config.tools.map((tool) => tool.name).join(", ")}`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${xml(title)}">
  <title>${xml(title)}</title>
  <defs>
    ${useDefinitions ? iconDefinitions(config.tools, config.treatment) : ""}
    <linearGradient id="edge-fade" x1="0" x2="1">
      <stop offset="0" stop-color="white" stop-opacity="0"/>
      <stop offset="0.075" stop-color="white"/>
      <stop offset="0.925" stop-color="white"/>
      <stop offset="1" stop-color="white" stop-opacity="0"/>
    </linearGradient>
    <mask id="viewport-fade"><rect width="${width}" height="${height}" fill="url(#edge-fade)"/></mask>
    <clipPath id="viewport"><rect width="${width}" height="${height}" rx="14"/></clipPath>
    <style>
      #moving-track{display:${movingDisplay}}
      #static-strip{display:${staticDisplay}}
      @media (prefers-reduced-motion:reduce){#moving-track{display:none}#static-strip{display:inline}}
    </style>
  </defs>
  ${background}
  <g clip-path="url(#viewport)" mask="url(#viewport-fade)">
    <g id="moving-track">${track.markup}<g transform="translate(${track.width} 0)">${track.markup}</g>${animation}</g>
    ${staticStrip(config, width, height, theme, useDefinitions)}
  </g>
</svg>`;

  return { status: 200, svg, config, title };
}
