const neutralBadge = (label, background, foreground = "#F2F1EC") =>
  `<rect x="2" y="2" width="20" height="20" rx="5" fill="${background}"/><text x="12" y="14.4" text-anchor="middle" fill="${foreground}" font-family="ui-sans-serif,system-ui,sans-serif" font-size="${label.length > 2 ? "5.5" : "7"}" font-weight="800">${label}</text>`;

export const customTools = Object.freeze([
  {
    id: "groq",
    name: "Groq",
    hex: "F55036",
    viewBox: "0 0 24 24",
    body: '<rect x="2" y="2" width="20" height="20" rx="5" fill="#F55036"/><path d="M8 8h5.4a3.6 3.6 0 1 1 0 7.2H11V18H8V8Zm3 2.7v1.8h2.2a.9.9 0 1 0 0-1.8H11Z" fill="#111315"/>',
    source: "https://groq.com/brand/Groq%20Trademark%20Policy%2024.pdf",
    provider: "README Stack neutral glyph",
    aliases: ["groq", "groqcloud"]
  },
  {
    id: "chromadb",
    name: "ChromaDB",
    hex: "327EFF",
    viewBox: "0 0 24 24",
    body: '<path fill="#ffde2d" d="M15.916575 19.52c4.326225 0 7.833325-3.3668 7.833325-7.519975 0-4.153175-3.5071-7.519975-7.833325-7.519975-4.326225 0-7.833325 3.3668-7.833325 7.519975 0 4.153175 3.5071 7.519975 7.833325 7.519975Z"/><path fill="#327eff" d="M8.083325 19.52c4.326225 0 7.833325-3.3668 7.833325-7.519975 0-4.153175-3.5071-7.519975-7.833325-7.519975C3.7571 4.48005.25 7.84685.25 12.000025.25 16.1532 3.7571 19.52 8.083325 19.52Z"/><path fill="#ff6446" d="M15.916625 12.000025c0 4.1532-3.507125 7.519925-7.833375 7.519925V12.000025h7.833375Zm-7.833375 0c0-4.153175 3.5071-7.519975 7.833375-7.519975v7.519975H8.08325Z"/>',
    source: "https://github.com/chroma-core/chroma/blob/main/docs/mintlify/images/favicon.svg",
    provider: "Chroma official repository asset",
    aliases: ["chroma", "chromadb", "chroma db"]
  },
  {
    id: "seaborn",
    name: "Seaborn",
    hex: "4C72B0",
    viewBox: "0 0 24 24",
    body: '<rect x="2" y="2" width="20" height="20" rx="10" fill="#F2F1EC"/><path d="M5 16.5c2.1-3.7 4.25-5.55 6.45-5.55 2.05 0 3.25 1.35 4.7 1.35 1.05 0 1.95-.65 2.85-1.95" fill="none" stroke="#4C72B0" stroke-width="1.8" stroke-linecap="round"/><circle cx="7" cy="13.7" r="1.25" fill="#55A868"/><circle cx="11.3" cy="10.9" r="1.25" fill="#C44E52"/><circle cx="15.6" cy="12.25" r="1.25" fill="#8172B2"/><circle cx="18.6" cy="9.7" r="1.25" fill="#CCB974"/>',
    source: "https://github.com/mwaskom/seaborn/tree/master/doc/_static",
    provider: "README Stack neutral glyph",
    aliases: ["seaborn", "sns"]
  },
  {
    id: "sql",
    name: "SQL",
    hex: "336791",
    viewBox: "0 0 24 24",
    body: '<ellipse cx="12" cy="5" rx="8" ry="3" fill="#336791"/><path d="M4 5v5c0 1.65 3.58 3 8 3s8-1.35 8-3V5c0 1.65-3.58 3-8 3S4 6.65 4 5Zm0 6v5c0 1.65 3.58 3 8 3s8-1.35 8-3v-5c0 1.65-3.58 3-8 3s-8-1.35-8-3Z" fill="#336791"/><path d="M8.25 17.3h7.5" stroke="#F2F1EC" stroke-width="1.4" stroke-linecap="round"/>',
    source: "https://www.iso.org/standard/76583.html",
    provider: "README Stack neutral glyph",
    aliases: ["sql", "structured query language"]
  },
  {
    id: "pinecone",
    name: "Pinecone",
    hex: "111111",
    viewBox: "0 0 24 24",
    body: neutralBadge("PC", "#111111"),
    source: "https://www.pinecone.io/",
    provider: "README Stack neutral glyph",
    aliases: ["pinecone", "pinecone db", "pinecone database"]
  },
  {
    id: "weaviate",
    name: "Weaviate",
    hex: "00B977",
    viewBox: "0 0 24 24",
    body: neutralBadge("WV", "#00B977", "#071D16"),
    source: "https://weaviate.io/",
    provider: "README Stack neutral glyph",
    aliases: ["weaviate"]
  },
  {
    id: "openai",
    name: "OpenAI",
    hex: "10A37F",
    viewBox: "0 0 24 24",
    body: neutralBadge("AI", "#10A37F"),
    source: "https://openai.com/brand/",
    provider: "README Stack neutral glyph",
    aliases: ["openai", "open ai"]
  },
  {
    id: "dbt",
    name: "dbt",
    hex: "FF694B",
    viewBox: "0 0 24 24",
    body: neutralBadge("dbt", "#FF694B", "#25100A"),
    source: "https://www.getdbt.com/",
    provider: "README Stack neutral glyph",
    aliases: ["dbt", "data build tool"]
  },
  {
    id: "powerbi",
    name: "Power BI",
    hex: "F2C811",
    viewBox: "0 0 24 24",
    body: neutralBadge("PBI", "#F2C811", "#201A00"),
    source: "https://www.microsoft.com/en-us/power-platform/products/power-bi",
    provider: "README Stack neutral glyph",
    aliases: ["power bi", "powerbi", "microsoft power bi"]
  },
  {
    id: "tableau",
    name: "Tableau",
    hex: "E97627",
    viewBox: "0 0 24 24",
    body: neutralBadge("TAB", "#E97627", "#261006"),
    source: "https://www.tableau.com/",
    provider: "README Stack neutral glyph",
    aliases: ["tableau"]
  },
  {
    id: "sveltekit",
    name: "SvelteKit",
    hex: "FF3E00",
    viewBox: "0 0 24 24",
    body: neutralBadge("SK", "#FF3E00", "#260900"),
    source: "https://svelte.dev/docs/kit/introduction",
    provider: "README Stack neutral glyph",
    aliases: ["sveltekit", "svelte kit"]
  },
  {
    id: "mkdocs",
    name: "MkDocs",
    hex: "526CFE",
    viewBox: "0 0 24 24",
    body: neutralBadge("MK", "#526CFE"),
    source: "https://www.mkdocs.org/",
    provider: "README Stack neutral glyph",
    aliases: ["mkdocs", "mk docs"]
  },
  {
    id: "codex",
    name: "Codex",
    hex: "10A37F",
    viewBox: "0 0 24 24",
    body: neutralBadge("CX", "#10A37F"),
    source: "https://openai.com/codex/",
    provider: "README Stack neutral glyph",
    aliases: ["codex", "openai codex"]
  },
  {
    id: "xai",
    name: "xAI",
    hex: "111111",
    viewBox: "0 0 24 24",
    body: neutralBadge("xAI", "#111111"),
    source: "https://x.ai/",
    provider: "README Stack neutral glyph",
    aliases: ["xai", "x ai"]
  },
  {
    id: "grok",
    name: "Grok",
    hex: "111111",
    viewBox: "0 0 24 24",
    body: neutralBadge("GR", "#111111"),
    source: "https://x.ai/grok",
    provider: "README Stack neutral glyph",
    aliases: ["grok", "grok ai"]
  },
  {
    id: "cohere",
    name: "Cohere",
    hex: "39594D",
    viewBox: "0 0 24 24",
    body: neutralBadge("CO", "#39594D"),
    source: "https://cohere.com/",
    provider: "README Stack neutral glyph",
    aliases: ["cohere", "cohere ai"]
  },
  {
    id: "togetherai",
    name: "Together AI",
    hex: "111111",
    viewBox: "0 0 24 24",
    body: neutralBadge("TAI", "#111111"),
    source: "https://www.together.ai/",
    provider: "README Stack neutral glyph",
    aliases: ["together ai", "togetherai"]
  },
  {
    id: "cerebras",
    name: "Cerebras",
    hex: "F15A24",
    viewBox: "0 0 24 24",
    body: neutralBadge("CB", "#F15A24", "#2A0D03"),
    source: "https://www.cerebras.ai/",
    provider: "README Stack neutral glyph",
    aliases: ["cerebras", "cerebras ai"]
  },
  {
    id: "runpod",
    name: "RunPod",
    hex: "6E44FF",
    viewBox: "0 0 24 24",
    body: neutralBadge("RP", "#6E44FF"),
    source: "https://www.runpod.io/",
    provider: "README Stack neutral glyph",
    aliases: ["runpod", "run pod"]
  },
  {
    id: "llamaindex",
    name: "LlamaIndex",
    hex: "6F4BF2",
    viewBox: "0 0 24 24",
    body: neutralBadge("LI", "#6F4BF2"),
    source: "https://www.llamaindex.ai/",
    provider: "README Stack neutral glyph",
    aliases: ["llamaindex", "llama index"]
  },
  {
    id: "autogen",
    name: "AutoGen",
    hex: "5E5CE6",
    viewBox: "0 0 24 24",
    body: neutralBadge("AG", "#5E5CE6"),
    source: "https://microsoft.github.io/autogen/",
    provider: "README Stack neutral glyph",
    aliases: ["autogen", "auto gen", "microsoft autogen"]
  },
  {
    id: "lovable",
    name: "Lovable",
    hex: "FF5A8A",
    viewBox: "0 0 24 24",
    body: neutralBadge("LV", "#FF5A8A", "#2B0713"),
    source: "https://lovable.dev/",
    provider: "README Stack neutral glyph",
    aliases: ["lovable", "lovable dev"]
  },
  {
    id: "bolt",
    name: "Bolt",
    hex: "1389FD",
    viewBox: "0 0 24 24",
    body: neutralBadge("BLT", "#1389FD", "#03182C"),
    source: "https://bolt.new/",
    provider: "README Stack neutral glyph",
    aliases: ["bolt", "bolt new", "bolt.new"]
  },
  {
    id: "cloudflared1",
    name: "Cloudflare D1",
    hex: "F38020",
    viewBox: "0 0 24 24",
    body: neutralBadge("D1", "#F38020", "#2B1202"),
    source: "https://developers.cloudflare.com/d1/",
    provider: "README Stack neutral glyph",
    aliases: ["cloudflare d1", "d1", "cloudflared1"]
  },
  {
    id: "cloudflarer2",
    name: "Cloudflare R2",
    hex: "F38020",
    viewBox: "0 0 24 24",
    body: neutralBadge("R2", "#F38020", "#2B1202"),
    source: "https://developers.cloudflare.com/r2/",
    provider: "README Stack neutral glyph",
    aliases: ["cloudflare r2", "r2", "cloudflarer2"]
  }
]);
