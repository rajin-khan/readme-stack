const neutralBadge = (label, background, foreground = "#F2F1EC") => ({
  hex: background.replace("#", ""),
  viewBox: "0 0 24 24",
  path: null,
  body: `<rect x="2" y="2" width="20" height="20" rx="5" fill="${background}"/><text x="12" y="14.4" text-anchor="middle" fill="${foreground}" font-family="ui-sans-serif,system-ui,sans-serif" font-size="${label.length > 2 ? "5.5" : "7"}" font-weight="800">${label}</text>`
});

export const providerRights = Object.freeze({
  "Simple Icons 16.28.0": {
    status: "catalog-source",
    license: "CC0-1.0 package; trademark rights are not granted",
    notice: "https://github.com/simple-icons/simple-icons/blob/16.28.0/DISCLAIMER.md"
  },
  "Devicon 2.17.0": {
    status: "catalog-source",
    license: "MIT package; trademark rights remain with each owner",
    notice: "https://github.com/devicons/devicon/blob/v2.17.0/LICENSE"
  }
});

export const toolRights = Object.freeze({
  groq: {
    status: "neutral",
    license: "Original neutral glyph",
    notice: "https://groq.com/trademark-policy",
    attribution: "Groq is a trademark of Groq LLC and/or its affiliates."
  },
  chromadb: {
    status: "licensed",
    license: "Apache-2.0",
    notice: "https://github.com/chroma-core/chroma/blob/main/LICENSE"
  },
  seaborn: { status: "neutral", license: "Original neutral glyph", notice: "https://seaborn.pydata.org/" },
  sql: { status: "neutral", license: "Original neutral glyph", notice: "https://www.iso.org/standard/76583.html" },
  apple: {
    status: "neutral",
    license: "Original neutral glyph",
    notice: "https://www.apple.com/legal/intellectual-property/guidelinesfor3rdparties.html",
    render: neutralBadge("AP", "#555555")
  },
  codex: {
    status: "neutral",
    license: "Original neutral glyph",
    notice: "https://openai.com/brand/",
    render: neutralBadge("CX", "#111111")
  },
  pinecone: { status: "neutral", license: "Original neutral glyph", notice: "https://www.pinecone.io/", render: neutralBadge("PC", "#111111") },
  weaviate: { status: "neutral", license: "Original neutral glyph", notice: "https://weaviate.io/", render: neutralBadge("WV", "#00B977") },
  dbt: { status: "neutral", license: "Original neutral glyph", notice: "https://www.getdbt.com/", render: neutralBadge("dbt", "#FF694B") },
  tableau: { status: "neutral", license: "Original neutral glyph", notice: "https://www.tableau.com/", render: neutralBadge("TB", "#E97627") },
  mkdocs: { status: "neutral", license: "Original neutral glyph", notice: "https://www.mkdocs.org/", render: neutralBadge("MK", "#526CFE") },
  cohere: { status: "neutral", license: "Original neutral glyph", notice: "https://cohere.com/", render: neutralBadge("CO", "#39594D") },
  togetherai: { status: "neutral", license: "Original neutral glyph", notice: "https://www.together.ai/", render: neutralBadge("TA", "#111111") },
  cerebras: { status: "neutral", license: "Original neutral glyph", notice: "https://www.cerebras.ai/", render: neutralBadge("CB", "#F15A24") },
  runpod: { status: "neutral", license: "Original neutral glyph", notice: "https://www.runpod.io/", render: neutralBadge("RP", "#6E44FF") },
  llamaindex: { status: "neutral", license: "Original neutral glyph", notice: "https://www.llamaindex.ai/", render: neutralBadge("LI", "#6F4BF2") },
  lovable: { status: "neutral", license: "Original neutral glyph", notice: "https://lovable.dev/", render: neutralBadge("LV", "#FF5A8A") },
  bolt: { status: "neutral", license: "Original neutral glyph", notice: "https://bolt.new/", render: neutralBadge("BT", "#1389FD") },
  openai: { status: "brand-guidelines", license: "OpenAI brand guidelines", notice: "https://openai.com/brand/" },
  xai: { status: "brand-guidelines", license: "xAI brand guidelines", notice: "https://x.ai/legal/brand-guidelines" },
  grok: { status: "brand-guidelines", license: "xAI brand guidelines", notice: "https://x.ai/legal/brand-guidelines" },
  sveltekit: { status: "brand-guidelines", license: "Svelte brand guidelines", notice: "https://github.com/sveltejs/branding" },
  powerbi: { status: "licensed", license: "CC-BY-4.0 asset; Microsoft trademark rights not granted", notice: "https://github.com/microsoft/PowerBI-Icons" },
  autogen: { status: "licensed", license: "CC-BY-4.0 documentation asset; Microsoft trademark rights not granted", notice: "https://github.com/microsoft/autogen" },
  cloudflared1: { status: "licensed", license: "CC-BY-4.0 documentation asset", notice: "https://github.com/cloudflare/cloudflare-docs/blob/production/LICENSE" },
  cloudflarer2: { status: "licensed", license: "CC-BY-4.0 documentation asset", notice: "https://github.com/cloudflare/cloudflare-docs/blob/production/LICENSE" }
});

export const reviewedStrictBrands = Object.freeze({
  amazonwebservices: "https://aws.amazon.com/trademark-guidelines/",
  dynamodb: "https://aws.amazon.com/trademark-guidelines/",
  azure: "https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks",
  microsoftsqlserver: "https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks",
  playwright: "https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks",
  visualstudio: "https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks",
  vscode: "https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks",
  oracle: "https://www.oracle.com/legal/trademarks.html",
  twilio: "https://www.twilio.com/en-us/legal/trademark"
});

export function rightsFor(tool) {
  const explicit = toolRights[tool.id];
  const strictNotice = reviewedStrictBrands[tool.id];
  const inherited = providerRights[tool.provider];
  const rights = explicit ?? (strictNotice ? {
    status: "brand-guidelines",
    license: `${tool.provider}; use subject to the owner's trademark policy`,
    notice: strictNotice
  } : inherited);

  return rights;
}
