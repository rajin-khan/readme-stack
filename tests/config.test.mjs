import assert from "node:assert/strict";
import test from "node:test";
import { catalog } from "../src/generated/catalog.js";
import { DEFAULT_TOOL_IDS, LIMITS, parseConfiguration, serializeConfiguration } from "../src/config.js";

test("parses the default Stack", () => {
  const result = parseConfiguration("https://stack.rajinkhan.com/v1/stack.svg");
  assert.equal(result.ok, true);
  assert.deepEqual(result.config.ids, DEFAULT_TOOL_IDS);
  assert.equal(result.config.treatment, "dark");
});

test("preserves order and removes duplicate Tools", () => {
  const result = parseConfiguration("https://stack.rajinkhan.com/v1/stack.svg?i=react,typescript,react");
  assert.equal(result.ok, true);
  assert.deepEqual(result.config.ids, ["react", "typescript"]);
});

test("rejects unknown Tools", () => {
  const result = parseConfiguration("https://stack.rajinkhan.com/v1/stack.svg?i=react,definitely-not-a-tool");
  assert.equal(result.ok, false);
  assert.equal(result.status, 400);
});

test("rejects a one-Tool Stack", () => {
  const result = parseConfiguration("https://stack.rajinkhan.com/v1/stack.svg?i=react");
  assert.equal(result.ok, false);
  assert.match(result.error, /at least 2/);
});

test("accepts 100 Tools and rejects 101", () => {
  const maximum = catalog.slice(0, LIMITS.maxTools).map((tool) => tool.id).join(",");
  const overMaximum = catalog.slice(0, LIMITS.maxTools + 1).map((tool) => tool.id).join(",");
  assert.equal(parseConfiguration(`https://stack.rajinkhan.com/v1/stack.svg?i=${maximum}`).ok, true);
  const rejected = parseConfiguration(`https://stack.rajinkhan.com/v1/stack.svg?i=${overMaximum}`);
  assert.equal(rejected.ok, false);
  assert.match(rejected.error, /no more than 100/);
});

test("serializes only non-default options", () => {
  const result = parseConfiguration("https://stack.rajinkhan.com/v1/stack.svg?i=react,typescript&t=light&s=fast&l=off");
  assert.equal(result.ok, true);
  assert.equal(serializeConfiguration(result.config), "i=react%2Ctypescript&t=light&s=fast&l=off");
});
