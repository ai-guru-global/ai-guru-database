export type NodeGroup = "root" | "chapter" | "topic" | "detail" | "meta";

export type LinkType = "contains" | "prerequisite" | "application" | "related" | "learning_path";

export type GraphNode = {
  id: string;
  label: string;
  group: NodeGroup | string;
  level: number;
  parent?: string;
  description?: string;
  difficulty?: string;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
};

export type GraphLink = {
  source: string | GraphNode;
  target: string | GraphNode;
  type: LinkType | string;
  label?: string;
};

export type GraphData = {
  nodes: GraphNode[];
  links: GraphLink[];
};

