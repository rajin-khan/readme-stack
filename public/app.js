const PRODUCTION_ORIGIN = "https://stack.rajinkhan.com";
const DEFAULT_IDS = ["typescript", "react", "nextdotjs", "tailwindcss", "nodedotjs", "python", "fastapi", "postgresql", "supabase", "docker", "git", "github"];
const LIMITS = { min: 2, max: 24, warning: 16 };
const presets = {
  Frontend: ["typescript", "react", "nextdotjs", "tailwindcss", "vite", "vercel", "figma"],
  Backend: ["nodedotjs", "fastify", "postgresql", "redis", "docker", "openapiinitiative", "nginx"],
  "AI and ML": ["python", "pytorch", "tensorflow", "jupyter", "huggingface", "ollama", "opencv"],
  Mobile: ["flutter", "dart", "reactnative", "expo", "android", "apple", "firebase"],
  DevOps: ["git", "github", "docker", "kubernetes", "terraform", "cloudflare", "prometheus"],
  Design: ["figma", "framer", "blender", "canva", "storybook", "webflow"]
};

const state = {
  catalog: [],
  ids: [],
  treatment: "dark",
  speed: "normal",
  direction: "left",
  spacing: "comfortable",
  labels: "on",
  motion: "infinite",
  size: "large",
  category: "All",
  search: "",
  visibleCount: 18,
  removed: null,
  undoTimer: null,
  dragId: null
};

const elements = Object.fromEntries([
  "preset-list", "tool-search", "search-count", "category-list", "catalog-grid", "show-more",
  "selected-count", "clear-button", "reset-button", "marquee-preview", "preview-empty", "selection-error", "selected-tools",
  "undo-bar", "undo-message", "undo-button", "copy-markdown", "copy-html", "embed-code"
].map((id) => [id, document.getElementById(id)]));

const normalize = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, "");
const byId = () => new Map(state.catalog.map((tool) => [tool.id, tool]));

function parseInitialState() {
  const params = new URLSearchParams(location.search);
  state.ids = [...new Set((params.get("i") || DEFAULT_IDS.join(",")).split(",").filter(Boolean))];
  const options = {
    treatment: ["dark", "light", "transparent"], speed: ["slow", "normal", "fast"],
    direction: ["left", "right"], spacing: ["compact", "comfortable"], labels: ["on", "off"],
    motion: ["infinite", "once", "static"], size: ["small", "large"]
  };
  const keys = { treatment: "t", speed: "s", direction: "d", spacing: "g", labels: "l", motion: "m", size: "z" };
  for (const [name, values] of Object.entries(options)) {
    const value = params.get(keys[name]);
    if (values.includes(value)) state[name] = value;
  }
}

function configParams(ids = state.ids, treatment = state.treatment) {
  const params = new URLSearchParams({ i: ids.join(",") });
  if (treatment !== "dark") params.set("t", treatment);
  if (state.speed !== "normal") params.set("s", state.speed);
  if (state.direction !== "left") params.set("d", state.direction);
  if (state.spacing !== "comfortable") params.set("g", state.spacing);
  if (state.labels !== "on") params.set("l", state.labels);
  if (state.motion !== "infinite") params.set("m", state.motion);
  if (state.size !== "large") params.set("z", state.size);
  return params;
}

function iconMarkup(tool) {
  if (tool.path) {
    return `<svg viewBox="0 0 24 24" role="img" aria-label="${tool.name}"><path fill="#${tool.hex}" d="${tool.path}"></path></svg>`;
  }
  return `<svg viewBox="${tool.viewBox}" role="img" aria-label="${tool.name}">${tool.body}</svg>`;
}

function renderPresets() {
  elements["preset-list"].innerHTML = Object.keys(presets).map((name) => `<button type="button" data-preset="${name}">${name}</button>`).join("");
  elements["preset-list"].addEventListener("click", (event) => {
    const button = event.target.closest("[data-preset]");
    if (!button) return;
    const known = byId();
    state.ids = presets[button.dataset.preset].filter((id) => known.has(id));
    update();
  });
}

function renderCategories() {
  const categories = ["All", ...new Set(state.catalog.map((tool) => tool.category))];
  elements["category-list"].innerHTML = categories.map((category) => `<button type="button" data-category="${category}" aria-pressed="${state.category === category}">${category}</button>`).join("");
}

function filteredCatalog() {
  const query = normalize(state.search);
  return state.catalog.filter((tool) => {
    const categoryMatch = state.category === "All" || tool.category === state.category;
    const searchMatch = !query || tool.aliases.some((alias) => alias.includes(query)) || normalize(tool.name).includes(query);
    return categoryMatch && searchMatch;
  });
}

function renderCatalog() {
  const matches = filteredCatalog();
  const visible = matches.slice(0, state.visibleCount);
  elements["search-count"].textContent = `${matches.length} found`;
  elements["catalog-grid"].innerHTML = visible.map((tool) => {
    const selected = state.ids.includes(tool.id);
    return `<button class="tool-card" type="button" data-tool-id="${tool.id}" aria-pressed="${selected}" aria-label="${selected ? "Remove" : "Add"} ${tool.name}">
      <span class="tool-icon" aria-hidden="true">${iconMarkup(tool)}</span>
      <span>${tool.name}</span><small>${selected ? "Added" : "Add"}</small>
    </button>`;
  }).join("");
  elements["show-more"].hidden = visible.length >= matches.length;
  elements["show-more"].textContent = `Show ${Math.min(18, matches.length - visible.length)} more tools`;
}

function renderSelected() {
  const known = byId();
  elements["selected-count"].textContent = state.ids.length;
  elements["clear-button"].disabled = state.ids.length === 0;
  elements["selected-tools"].innerHTML = state.ids.map((id, index) => {
    const tool = known.get(id);
    if (!tool) return "";
    return `<div class="selected-tool" draggable="true" data-selected-id="${id}">
      <span>${tool.name}</span>
      <button type="button" data-move="up" aria-label="Move ${tool.name} left" ${index === 0 ? "disabled" : ""}>←</button>
      <button type="button" data-move="down" aria-label="Move ${tool.name} right" ${index === state.ids.length - 1 ? "disabled" : ""}>→</button>
      <button type="button" data-remove aria-label="Remove ${tool.name}">×</button>
    </div>`;
  }).join("");
  const error = state.ids.length < LIMITS.min ? `Choose at least ${LIMITS.min} tools.` : state.ids.length > LIMITS.max ? `Choose no more than ${LIMITS.max} tools.` : state.ids.length > LIMITS.warning ? `Long stacks move slowly. ${LIMITS.max} is the maximum.` : "";
  elements["selection-error"].hidden = !error;
  elements["selection-error"].textContent = error;
}

function getEmbedData(format = "html") {
  const editor = `${PRODUCTION_ORIGIN}/?${configParams().toString()}`;
  const alt = `Tech stack: ${state.ids.map((id) => byId().get(id)?.name).filter(Boolean).join(", ")}`;
  if (state.treatment === "transparent") {
    const image = `${PRODUCTION_ORIGIN}/v1/stack.svg?${configParams().toString()}`;
    const html = `<a href="${editor}"><img src="${image}" alt="${alt}"></a>`;
    return { html, markdown: `[![${alt}](${image})](${editor})` };
  }
  const dark = `${PRODUCTION_ORIGIN}/v1/stack.svg?${configParams(state.ids, "dark")}`;
  const light = `${PRODUCTION_ORIGIN}/v1/stack.svg?${configParams(state.ids, "light")}`;
  const html = `<a href="${editor}">\n  <picture>\n    <source media="(prefers-color-scheme: dark)" srcset="${dark}">\n    <source media="(prefers-color-scheme: light)" srcset="${light}">\n    <img alt="${alt}" src="${light}">\n  </picture>\n</a>`;
  const markdown = `[![${alt}](${state.treatment === "dark" ? dark : light})](${editor})`;
  return { html, markdown };
}

function renderOutput() {
  const valid = state.ids.length >= LIMITS.min && state.ids.length <= LIMITS.max;
  const params = configParams();
  elements["marquee-preview"].hidden = !valid;
  elements["preview-empty"].hidden = valid;
  if (valid) elements["marquee-preview"].src = `/v1/stack.svg?${params}`;
  else elements["marquee-preview"].removeAttribute("src");
  elements["marquee-preview"].alt = `Tech stack preview: ${state.ids.map((id) => byId().get(id)?.name).filter(Boolean).join(", ")}`;
  const embed = getEmbedData();
  elements["embed-code"].value = valid ? embed.html : "";
  elements["copy-markdown"].disabled = !valid;
  elements["copy-html"].disabled = !valid;
  history.replaceState(null, "", `${location.pathname}?${params}`);
}

function renderControls() {
  document.querySelectorAll("[data-control]").forEach((fieldset) => {
    const key = fieldset.dataset.control;
    fieldset.querySelectorAll("[data-value]").forEach((button) => {
      button.setAttribute("aria-pressed", String(state[key] === button.dataset.value));
    });
  });
}

function update() {
  renderCategories();
  renderCatalog();
  renderSelected();
  renderControls();
  renderOutput();
}

function dismissUndo() {
  if (state.undoTimer) window.clearTimeout(state.undoTimer);
  state.undoTimer = null;
  state.removed = null;
  elements["undo-bar"].hidden = true;
}

function removeTool(id) {
  if (!state.ids.includes(id)) return;
  const known = byId();
  state.removed = { id, index: state.ids.indexOf(id) };
  state.ids = state.ids.filter((value) => value !== id);
  elements["undo-message"].textContent = `${known.get(id)?.name ?? "Tool"} removed.`;
  elements["undo-bar"].hidden = false;
  if (state.undoTimer) window.clearTimeout(state.undoTimer);
  state.undoTimer = window.setTimeout(dismissUndo, 5000);
  update();
}

function addTool(id) {
  if (state.ids.includes(id)) return removeTool(id);
  if (state.ids.length >= LIMITS.max) {
    elements["selection-error"].hidden = false;
    elements["selection-error"].textContent = `Choose no more than ${LIMITS.max} tools.`;
    return;
  }
  state.ids.push(id);
  update();
}

async function copyText(text, button, original) {
  await navigator.clipboard.writeText(text);
  button.textContent = "Copied";
  window.setTimeout(() => { button.textContent = original; }, 1400);
}

function bindEvents() {
  elements["tool-search"].addEventListener("input", (event) => {
    state.search = event.target.value;
    state.visibleCount = 18;
    renderCatalog();
  });
  elements["category-list"].addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");
    if (!button) return;
    state.category = button.dataset.category;
    state.visibleCount = 18;
    renderCategories();
    renderCatalog();
  });
  elements["catalog-grid"].addEventListener("click", (event) => {
    const card = event.target.closest("[data-tool-id]");
    if (card) addTool(card.dataset.toolId);
  });
  elements["show-more"].addEventListener("click", () => { state.visibleCount += 18; renderCatalog(); });
  elements["selected-tools"].addEventListener("click", (event) => {
    const item = event.target.closest("[data-selected-id]");
    if (!item) return;
    const id = item.dataset.selectedId;
    if (event.target.closest("[data-remove]")) return removeTool(id);
    const move = event.target.closest("[data-move]")?.dataset.move;
    if (!move) return;
    const from = state.ids.indexOf(id);
    const to = move === "up" ? from - 1 : from + 1;
    if (to < 0 || to >= state.ids.length) return;
    [state.ids[from], state.ids[to]] = [state.ids[to], state.ids[from]];
    update();
  });
  elements["selected-tools"].addEventListener("dragstart", (event) => {
    const item = event.target.closest("[data-selected-id]");
    if (!item) return;
    state.dragId = item.dataset.selectedId;
    item.classList.add("dragging");
    event.dataTransfer.effectAllowed = "move";
  });
  elements["selected-tools"].addEventListener("dragover", (event) => { event.preventDefault(); });
  elements["selected-tools"].addEventListener("drop", (event) => {
    event.preventDefault();
    const target = event.target.closest("[data-selected-id]")?.dataset.selectedId;
    if (!target || !state.dragId || target === state.dragId) return;
    const from = state.ids.indexOf(state.dragId);
    const to = state.ids.indexOf(target);
    const [moved] = state.ids.splice(from, 1);
    state.ids.splice(to, 0, moved);
    state.dragId = null;
    update();
  });
  elements["selected-tools"].addEventListener("dragend", () => { state.dragId = null; update(); });
  elements["undo-button"].addEventListener("click", () => {
    if (!state.removed) return;
    state.ids.splice(state.removed.index, 0, state.removed.id);
    dismissUndo();
    update();
  });
  document.querySelector(".controls").addEventListener("click", (event) => {
    const button = event.target.closest("[data-value]");
    const fieldset = event.target.closest("[data-control]");
    if (!button || !fieldset) return;
    state[fieldset.dataset.control] = button.dataset.value;
    update();
  });
  elements["reset-button"].addEventListener("click", () => { dismissUndo(); state.ids = [...DEFAULT_IDS]; update(); });
  elements["clear-button"].addEventListener("click", () => {
    state.ids = [];
    dismissUndo();
    update();
  });
  elements["copy-markdown"].addEventListener("click", () => copyText(getEmbedData().markdown, elements["copy-markdown"], "Copy Markdown"));
  elements["copy-html"].addEventListener("click", () => copyText(getEmbedData().html, elements["copy-html"], "Copy HTML"));
}

async function init() {
  parseInitialState();
  const response = await fetch("/catalog.json?v=0.1.1");
  if (!response.ok) throw new Error("The tool list could not be loaded.");
  state.catalog = await response.json();
  const known = byId();
  state.ids = state.ids.filter((id) => known.has(id));
  if (state.ids.length < LIMITS.min) state.ids = DEFAULT_IDS.filter((id) => known.has(id));
  renderPresets();
  bindEvents();
  update();
}

init().catch((error) => {
  elements["catalog-grid"].innerHTML = `<p class="inline-error">${error.message}</p>`;
});
