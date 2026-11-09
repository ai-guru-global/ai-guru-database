/** Type definitions for ai-industry-graph. */

export interface DatasetIndex {
  name: string;
  nameZh: string;
  version: string;
  asOf: string;
  license: { data: string; code: string; attribution: string };
  citation: string;
  counts: {
    layers: number;
    nodes: number;
    subNodes: number;
    topics: number;
    clues: number;
    events: number;
    verify: number;
    models: number;
    players: number;
    terms: number;
    explainNodes: number;
    deepNodes: number;
  };
  files: Record<string, string>;
}

export interface SubNode {
  id: string;
  name: string;
  def: string;
  uid: string;
}

export interface Node {
  uid: string;
  id: string;
  name: string;
  nameEn?: string;
  def: string;
  defEn?: string;
  layer: string;
  layerName: string;
  keywords: string[];
  upstream: string[];
  downstream: string[];
  maturity: string;
  why: string;
  moat: string;
  bottleneck: string;
  signals: string[];
  sub: SubNode[];
  url: string;
}

export interface Layer {
  key: string;
  name: string;
  en: string;
  desc: string;
  nodes: Node[];
}

export interface Chain {
  layers: Layer[];
  stack: Record<string, unknown>;
  nodeCount: number;
  subNodeCount: number;
  i18n?: { nodesTranslated: number; topicsTranslated: number };
}

export interface Topic {
  uid: string;
  key: string;
  name: string;
  en: string;
  def: string;
  defEn?: string;
  count: number;
  clues: string[];
  url: string;
}

export interface Clue {
  uid: string;
  id: string;
  topic: string;
  name: string;
  alias: string[];
  status: string;
  created: string;
  updated: string;
  roles: string[];
  quote: string;
  body: string;
  analysis: string;
  nAnalysis: number;
  nEvents: number;
  lastEvent: string;
  months: number;
  verified: number;
  pending: number;
  related: string[];
  url: string;
  src: string;
}

export interface ChronicleEvent {
  uid: string;
  date: string;
  title: string;
  url: string;
  summary: string;
  links: string[];
  year: string;
  cat: string;
  cats: string[];
  meta: { amountUsd: number | null; round: string | null };
}

export interface VerifyItem {
  uid: string;
  sec: string;
  title: string;
  status: "✅" | "⚠️" | "❓" | "🔍" | "✗" | "E" | "";
  date: string;
  lines: { k: string; v: string }[];
  into: string[];
}

export interface Model {
  uid: string;
  name: string;
  org: string;
  date: string;
  params: string;
  ctx: string;
  priceIn: string;
  priceOut: string;
  bench: string;
  priceSrc: string;
  note: string;
}

export interface Player {
  uid: string;
  name: string;
  type: string;
  positioning: string;
  aliases: string[];
  note: string;
}

export interface Term {
  uid: string;
  k: string;
  c: string;
  t: string;
  a?: string[];
  b: string;
}

export interface Company {
  name: string;
  role: string;
  products: string;
  tech: string;
  scenes: string;
}

export interface Industry {
  name: string;
  desc: string;
  companies: Company[];
}

export interface ExplainEntry {
  uid: string;
  node: string;
  levels: [string, string][];
  industries: Industry[];
}

export interface DeepDive {
  uid: string;
  node: string;
  boundary: string;
  market: Record<string, string>;
  chain: string[][];
  landscape: Record<string, unknown>;
  forces: string[][];
  economics: Record<string, string>;
  tech: Record<string, string>;
  policy: Record<string, string>;
  thesis: Record<string, string>;
  verdict: Record<string, string>;
}

export interface NodeDetail extends Node {
  levels: [string, string][];
  industries: Industry[];
  deep: DeepDive | null;
}

export const index: DatasetIndex;
export const chain: Chain;
export const topics: { count: number; items: Topic[] };
export const clues: Clue[];
export const chronicle: ChronicleEvent[];
export const verify: VerifyItem[];
export const models: Model[];
export const players: Player[];
export const glossary: Term[];
export const explain: Record<string, ExplainEntry>;
export const deep: Record<string, DeepDive>;
export const nodes: Node[];

export function node(key: string): Node | null;
export function clue(key: string): Clue | null;
export function searchNodes(query?: string, opts?: { layer?: string; limit?: number }): Node[];
export function searchEvents(query?: string, opts?: { since?: string; limit?: number }): ChronicleEvent[];
export function searchTerms(query?: string, opts?: { limit?: number }): Term[];
export function verification(status?: string): VerifyItem[];
export function nodeDetail(key: string): NodeDetail | null;

declare const _default: {
  index: DatasetIndex;
  chain: Chain;
  topics: { count: number; items: Topic[] };
  clues: Clue[];
  chronicle: ChronicleEvent[];
  verify: VerifyItem[];
  models: Model[];
  players: Player[];
  glossary: Term[];
  explain: Record<string, ExplainEntry>;
  deep: Record<string, DeepDive>;
  nodes: Node[];
  node: typeof node;
  clue: typeof clue;
  searchNodes: typeof searchNodes;
  searchEvents: typeof searchEvents;
  searchTerms: typeof searchTerms;
  verification: typeof verification;
  nodeDetail: typeof nodeDetail;
};

export default _default;