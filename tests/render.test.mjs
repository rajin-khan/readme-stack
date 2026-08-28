import assert from "node:assert/strict";
import test from "node:test";
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
