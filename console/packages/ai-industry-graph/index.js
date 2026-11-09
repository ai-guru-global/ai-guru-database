/**
 * ai-industry-graph — machine-readable map of the AI industry.
 *
 * In-repo usage reads ../../data directly; the npm package copies data/ at prepack.
 * Data license: CC BY-SA 4.0. Code license: MIT.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));

function dataDir() {
  const local = path.join(HERE, "data");
  if (fs.existsSync(path.join(local, "index.json"))) return local;
  const repo = path.resolve(HERE, "../../data");
  if (fs.existsSync(path.join(repo, "index.json"))) return repo;
  throw new Error("ai-industry-graph: data/ not found. Run `node scripts/sync-data.mjs`.");
}

const DIR = dataDir();
const read = (name) => JSON.parse(fs.readFileSync(path.join(DIR, name), "utf8"));

export const index = read("index.json");
export const chain = read("chain.json");
export const topics = read("topics.json");
export const clues = read("clues.json").items;
export const chronicle = read("chronicle.json").items;
export const verify = read("verify.json").items;
export const models = read("models.json").items;
export const players = read("players.json").items;
export const glossary = read("glossary.json").items;
export const explain = read("explain.json").items;
export const deep = read("deep.json").items;

export const nodes = chain.layers.flatMap((layer) =>
  layer.nodes.map((node) => ({ ...node, layer: layer.key, layerName: layer.name }))
);

const byUid = new Map(nodes.map((n) => [n.uid, n]));
const byId = new Map(nodes.map((n) => [n.id, n]));
const clueById = new Map(clues.map((c) => [c.id, c]));

/** Resolve a node by uid (`chain/L1/gpu`) or id (`gpu`). */
export function node(key) {
  return byUid.get(key) || byId.get(key) || byUid.get(`chain/${key}`) || null;
}

/** Resolve a clue by id (`基础模型/Claude`) or uid (`clue/基础模型/Claude`). */
export function clue(key) {
  return clueById.get(key) || clues.find((c) => c.uid === key) || null;
}

/** Search nodes by name/definition/keywords; optional layer filter. */
export function searchNodes(query = "", { layer, limit = 20 } = {}) {
  const q = query.trim().toLowerCase();
  return nodes
    .filter((n) => !layer || String(n.layer).toLowerCase() === String(layer).toLowerCase())
    .filter((n) => {
      if (!q) return true;
      const hay = [n.name, n.def, ...(n.keywords || [])].join(" ").toLowerCase();
      return hay.includes(q);
    })
    .slice(0, limit);
}

/** Search chronicle events by title/summary; optional since (YYYY-MM-DD). */
export function searchEvents(query = "", { since, limit = 20 } = {}) {
  const q = query.trim().toLowerCase();
  return chronicle
    .filter((e) => !since || e.date >= since)
    .filter((e) => !q || `${e.title} ${e.summary || ""}`.toLowerCase().includes(q))
    .slice(0, limit);
}

/** Search the glossary. */
export function searchTerms(query = "", { limit = 20 } = {}) {
  const q = query.trim().toLowerCase();
  return glossary
    .filter((t) => !q || `${t.t} ${t.b || ""} ${(t.a || []).join(" ")}`.toLowerCase().includes(q))
    .slice(0, limit);
}

/** Six-state verification items, optionally filtered by status. */
export function verification(status) {
  return status ? verify.filter((v) => v.status === status) : verify;
}

/** Node-level explanation and deep dive. */
export function nodeDetail(key) {
  const n = node(key);
  if (!n) return null;
  return { ...n, levels: explain[n.id]?.levels || [], industries: explain[n.id]?.industries || [], deep: deep[n.id] || null };
}

export default {
  index, chain, topics, clues, chronicle, verify, models, players, glossary, explain, deep,
  nodes, node, clue, searchNodes, searchEvents, searchTerms, verification, nodeDetail,
};