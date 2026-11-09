import assert from "node:assert/strict";
import { index, nodes, node, nodeDetail, searchNodes, searchEvents, clue, verification } from "./index.js";

assert.ok(index.counts.nodes >= 60, "nodes count");
assert.equal(nodes.length, index.counts.nodes, "flattened nodes");

const gpu = node("chain/L1/gpu");
assert.ok(gpu, "node by uid");
assert.equal(gpu.name, "GPU 与 AI 加速卡");
assert.ok(node("gpu"), "node by id");

const found = searchNodes("光模块", { limit: 5 });
assert.ok(found.length >= 1, "search nodes");

const events = searchEvents("OpenAI", { limit: 5 });
assert.ok(events.length >= 1, "search events");

const c = clue("基础模型/Claude");
assert.ok(c && c.uid === "clue/基础模型/Claude", "clue");

const detail = nodeDetail("gpu");
assert.ok(detail.levels.length === 6, "six levels");
assert.ok(detail.deep && detail.deep.market, "deep dive");

assert.ok(verification("⚠️").length >= 1, "verify");

console.log(`✓ ai-industry-graph ${index.version}: ${nodes.length} nodes, ${index.counts.clues} clues, ${index.counts.events} events`);