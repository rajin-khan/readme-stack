import assert from "node:assert/strict";
import test from "node:test";
import { catalog } from "../src/generated/catalog.js";
import { renderStackSvg } from "../src/render.js";

test("renders a self-contained animated SVG", () => {
  const result = renderStackSvg("https://stack.rajinkhan.com/v1/stack.svg?i=typescript,react,nextdotjs");
  assert.equal(result.status, 200);
  assert.match(result.svg, /^<svg/);
  assert.match(result.svg, /animateTransform/);
  assert.match(result.svg, /prefers-reduced-motion/);
  assert.doesNotMatch(result.svg, /<script|(?:href|src)=["']https?:\/\//i);
  assert.ok(Buffer.byteLength(result.svg) < 200_000);
});

test("renders every selected Tool in the reduced-motion strip", () => {
  const result = renderStackSvg("https://stack.rajinkhan.com/v1/stack.svg?i=typescript,react,nextdotjs,python");
  assert.equal(result.status, 200);
  assert.match(result.svg, /id="static-strip"/);
  assert.equal(result.config.tools.length, 4);
});

test("renders reviewed custom Tools without remote content", () => {
  const result = renderStackSvg("https://stack.rajinkhan.com/v1/stack.svg?i=groq,chromadb,seaborn,sql");
  assert.equal(result.status, 200);
  assert.match(result.svg, /Groq, ChromaDB, Seaborn, SQL/);
  assert.doesNotMatch(result.svg, /<script|(?:href|src)=["']https?:\/\//i);
});

test("renders the expanded reviewed catalog without remote content", () => {
  const ids = "pinecone,weaviate,openai,dbt,powerbi,tableau,sveltekit,mkdocs,codex,xai,grok,cohere,togetherai,cerebras,runpod,llamaindex,autogen,lovable,bolt,cloudflared1,cloudflarer2";
  const result = renderStackSvg(`https://stack.rajinkhan.com/v1/stack.svg?i=${ids}&m=static`);
  assert.equal(result.status, 200);
  assert.match(result.svg, /Pinecone, Weaviate, OpenAI/);
  assert.match(result.svg, /Cloudflare D1, Cloudflare R2/);
  assert.doesNotMatch(result.svg, /<script|(?:href|src)=["']https?:\/\//i);
});

test("renders a 100-Tool Stack with a multi-row static fallback", () => {
  const ids = catalog.slice(0, 100).map((tool) => tool.id).join(",");
  const result = renderStackSvg(`https://stack.rajinkhan.com/v1/stack.svg?i=${ids}`);
  assert.equal(result.status, 200);
  assert.equal(result.config.tools.length, 100);
  assert.match(result.svg, /id="static-strip"/);
  assert.match(result.svg, /<symbol id="tool-typescript"/);
  assert.match(result.svg, /<use href="#tool-typescript"/);
});

test("renders static mode without animation", () => {
  const result = renderStackSvg("https://stack.rajinkhan.com/v1/stack.svg?i=react,typescript&m=static");
  assert.equal(result.status, 200);
  assert.doesNotMatch(result.svg, /animateTransform/);
});

test("renders a valid SVG error tile", () => {
  const result = renderStackSvg("https://stack.rajinkhan.com/v1/stack.svg?i=unknown,react");
  assert.equal(result.status, 400);
  assert.match(result.svg, /^<svg/);
  assert.match(result.svg, /Unknown Tool/);
});

test("repeats short Stacks without an empty loop interval", () => {
  const result = renderStackSvg("https://stack.rajinkhan.com/v1/stack.svg?i=c,r");
  assert.equal(result.status, 200);
  const cOccurrences = result.svg.match(/>C<\/text>/g)?.length ?? 0;
  assert.ok(cOccurrences >= 2);
});
