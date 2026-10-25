import type { GraphData, GraphLink, GraphNode } from "./types";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseNode(value: unknown): GraphNode | null {
  if (!isObject(value)) return null;
  if (typeof value.id !== "string") return null;
  if (typeof value.label !== "string") return null;
  if (typeof value.group !== "string") return null;
  if (typeof value.level !== "number") return null;

  return {
    id: value.id,
    label: value.label,
    group: value.group,
    level: value.level,
    parent: typeof value.parent === "string" ? value.parent : undefined,
    description: typeof value.description === "string" ? value.description : undefined,
    difficulty: typeof value.difficulty === "string" ? value.difficulty : undefined,
  };
}

function parseLink(value: unknown): GraphLink | null {
  if (!isObject(value)) return null;
  if (typeof value.source !== "string") return null;
  if (typeof value.target !== "string") return null;
  if (typeof value.type !== "string") return null;

  return {
    source: value.source,
    target: value.target,
    type: value.type,
    label: typeof value.label === "string" ? value.label : undefined,
  };
}

export async function loadGraphData(): Promise<GraphData> {
  const res = await fetch("/data.json", { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load data.json (${res.status})`);
  const raw = (await res.json()) as unknown;
  if (!isObject(raw)) throw new Error("Invalid graph data");
  if (!Array.isArray(raw.nodes) || !Array.isArray(raw.links)) throw new Error("Invalid graph data");

  const nodes = raw.nodes.map(parseNode).filter((n): n is GraphNode => n !== null);
  const links = raw.links.map(parseLink).filter((l): l is GraphLink => l !== null);

  const idSet = new Set(nodes.map((n) => n.id));
  const filteredLinks = links.filter((l) => idSet.has(l.source as string) && idSet.has(l.target as string));

  return { nodes, links: filteredLinks };
}

