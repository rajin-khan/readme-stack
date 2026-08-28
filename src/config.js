import { catalog } from "./generated/catalog.js";

export const LIMITS = Object.freeze({
  minTools: 2,
  maxTools: 24,
  warningTools: 16,
  maxUrlLength: 2048,
  width: 960
});

export const DEFAULT_TOOL_IDS = Object.freeze([
  "typescript", "react", "nextdotjs", "tailwindcss", "nodedotjs", "python",
  "fastapi", "postgresql", "supabase", "docker", "git", "github"
]);

export const OPTIONS = Object.freeze({
  treatment: ["dark", "light", "transparent"],
  speed: ["slow", "normal", "fast"],
  direction: ["left", "right"],
  spacing: ["compact", "comfortable"],
  labels: ["on", "off"],
  motion: ["infinite", "once", "static"],
  size: ["small", "large"]
});

const catalogById = new Map(catalog.map((tool) => [tool.id, tool]));

const pick = (params, key, values, fallback) => {
  const value = params.get(key);
  return value && values.includes(value) ? value : fallback;
};

export function parseConfiguration(input) {
  const url = input instanceof URL ? input : new URL(input, "https://stack.rajinkhan.com");
  if (url.href.length > LIMITS.maxUrlLength) {
    return { ok: false, status: 414, error: "This Stack URL is too long." };
  }

  const requested = (url.searchParams.get("i") || DEFAULT_TOOL_IDS.join(","))
    .split(",")
    .map((id) => id.trim().toLowerCase())
    .filter(Boolean);
  const ids = [...new Set(requested)];

  if (ids.length < LIMITS.minTools) {
    return { ok: false, status: 400, error: `Choose at least ${LIMITS.minTools} Tools.` };
  }
  if (ids.length > LIMITS.maxTools) {
    return { ok: false, status: 400, error: `Choose no more than ${LIMITS.maxTools} Tools.` };
  }

  const unknown = ids.filter((id) => !catalogById.has(id));
  if (unknown.length) {
    return { ok: false, status: 400, error: `Unknown Tool: ${unknown[0]}` };
  }

  const config = {
    ids,
    tools: ids.map((id) => catalogById.get(id)),
    treatment: pick(url.searchParams, "t", OPTIONS.treatment, "dark"),
    speed: pick(url.searchParams, "s", OPTIONS.speed, "normal"),
    direction: pick(url.searchParams, "d", OPTIONS.direction, "left"),
    spacing: pick(url.searchParams, "g", OPTIONS.spacing, "comfortable"),
    labels: pick(url.searchParams, "l", OPTIONS.labels, "on"),
    motion: pick(url.searchParams, "m", OPTIONS.motion, "infinite"),
    size: pick(url.searchParams, "z", OPTIONS.size, "large")
  };

  return { ok: true, config };
}

export function serializeConfiguration(config) {
  const params = new URLSearchParams();
  params.set("i", config.ids.join(","));
  if (config.treatment !== "dark") params.set("t", config.treatment);
  if (config.speed !== "normal") params.set("s", config.speed);
  if (config.direction !== "left") params.set("d", config.direction);
  if (config.spacing !== "comfortable") params.set("g", config.spacing);
  if (config.labels !== "on") params.set("l", config.labels);
  if (config.motion !== "infinite") params.set("m", config.motion);
  if (config.size !== "large") params.set("z", config.size);
  return params.toString();
}
