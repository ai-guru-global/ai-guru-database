import * as d3 from "d3";
import type { GraphData, GraphLink, GraphNode, LinkType } from "./types";

export type GraphFocusState = {
  hoveredId: string | null;
  selectedId: string;
  activeTypes: Set<LinkType>;
};

export type GraphApi = {
  destroy: () => void;
  resetView: () => void;
  setActiveTypes: (types: Set<LinkType>) => void;
  focus: (id: string, mode: "hover" | "select" | "program") => void;
  blurHover: () => void;
  getState: () => GraphFocusState;
};

type Options = {
  svgEl: SVGSVGElement;
  canvasEl: HTMLElement;
  data: GraphData;
  onNodeFocused: (node: GraphNode | null) => void;
  onStateChanged: (state: GraphFocusState) => void;
  announce: (message: string) => void;
  onPointerNode: (node: GraphNode | null, client: { x: number; y: number } | null) => void;
  staticMode?: boolean;
  seed?: number;
};

const LINK_TYPES: LinkType[] = ["contains", "prerequisite", "application", "related", "learning_path"];

function linkType(value: unknown): LinkType {
  const v = String(value);
  if (LINK_TYPES.includes(v as LinkType)) return v as LinkType;
  return "related";
}

function nodeGroupKey(group: string): string {
  if (group === "root") return "root";
  if (group === "chapter") return "chapter";
  if (group === "topic") return "topic";
  if (group === "detail") return "detail";
  if (group === "meta") return "meta";
  return "detail";
}

function nodeFillVar(group: string): string {
  const g = nodeGroupKey(group);
  return `var(--node-${g})`;
}

function isReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function createGraph(opts: Options): GraphApi {
  const svg = d3.select(opts.svgEl);
  const canvas = opts.canvasEl;

  const nById = new Map<string, GraphNode>();
  opts.data.nodes.forEach((n) => nById.set(n.id, n));

  const rng = d3.randomLcg(typeof opts.seed === "number" ? opts.seed : 0.42);

  let W = canvas.clientWidth;
  let H = canvas.clientHeight;

  const rootG = svg.append("g").attr("class", "graph__root");
  const linksG = rootG.append("g").attr("class", "graph__links");
  const nodesG = rootG.append("g").attr("class", "graph__nodes");

  const zoom = d3
    .zoom<SVGSVGElement, unknown>()
    .scaleExtent([0.12, 6])
    .on("zoom", (e: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
      rootG.attr("transform", e.transform.toString());
    });

  svg.call(zoom as never);

  const state: GraphFocusState = {
    hoveredId: null,
    selectedId: "root",
    activeTypes: new Set(LINK_TYPES),
  };

  const radiiByLevel = new Map<number, number>([
    [0, 26],
    [1, 12],
    [2, 6],
    [3, 3.6],
  ]);

  const labelSizeByLevel = new Map<number, number>([
    [0, 14],
    [1, 10],
    [2, 9],
    [3, 8],
  ]);

  const linkDashByType: Record<LinkType, string | null> = {
    contains: null,
    prerequisite: "7,4",
    application: "5,5",
    related: "2,5",
    learning_path: "9,5",
  };

  function linkKey(l: GraphLink): string {
    const s = typeof l.source === "string" ? l.source : l.source.id;
    const t = typeof l.target === "string" ? l.target : l.target.id;
    return `${s}__${t}__${String(l.type)}`;
  }

  function visibleLinks(): GraphLink[] {
    return opts.data.links.filter((l) => state.activeTypes.has(linkType(l.type)));
  }

  function visibleNodeIdSet(links: GraphLink[]): Set<string> {
    const s = new Set<string>();
    links.forEach((l) => {
      s.add(typeof l.source === "string" ? l.source : l.source.id);
      s.add(typeof l.target === "string" ? l.target : l.target.id);
    });
    if (state.activeTypes.has("contains")) {
      opts.data.nodes.forEach((n) => s.add(n.id));
    }
    return s;
  }

  function connectedSet(id: string): Set<string> {
    const s = new Set<string>([id]);
    opts.data.links.forEach((l) => {
      const a = typeof l.source === "string" ? l.source : l.source.id;
      const b = typeof l.target === "string" ? l.target : l.target.id;
      if (a === id) s.add(b);
      if (b === id) s.add(a);
    });
    return s;
  }

  const angleMap = new Map<string, number>();
  const chapters = opts.data.nodes.filter((n) => n.level === 1 && n.group === "chapter");
  chapters.forEach((c, i) => angleMap.set(c.id, (i / Math.max(chapters.length, 1)) * Math.PI * 2 - Math.PI / 2));

  function initPos(node: GraphNode): { x: number; y: number } {
    const cx = W / 2;
    const cy = H / 2;
    const rand = () => (rng() - 0.5) * 1;

    if (node.level === 0) return { x: cx, y: cy };
    if (node.level === 1) {
      const a = angleMap.get(node.id) ?? rng() * Math.PI * 2;
      const baseR = node.group === "meta" ? 150 : 210;
      const r = baseR + rand() * 16;
      return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
    }
    if (node.level === 2) {
      const p = nById.get(node.parent ?? "root");
      const pa = p ? angleMap.get(p.id) ?? rng() * Math.PI * 2 : rng() * Math.PI * 2;
      const r = 120 + rand() * 22;
      const px = p?.x ?? cx;
      const py = p?.y ?? cy;
      return { x: px + r * Math.cos(pa + rand() * 1.3), y: py + r * Math.sin(pa + rand() * 1.3) };
    }
    if (node.level === 3) {
      const p = nById.get(node.parent ?? "root");
      const px = p?.x ?? cx;
      const py = p?.y ?? cy;
      return { x: px + (rng() - 0.5) * 90, y: py + (rng() - 0.5) * 90 };
    }
    return { x: cx, y: cy };
  }

  opts.data.nodes.forEach((n) => {
    const p = initPos(n);
    n.x = p.x;
    n.y = p.y;
  });

  const sim = d3
    .forceSimulation<GraphNode>(opts.data.nodes)
    .force(
      "link",
      d3
        .forceLink<GraphNode, GraphLink>(opts.data.links)
        .id((d) => d.id)
        .distance((d) => {
          const t = linkType(d.type);
          if (t !== "contains") return 160;
          const sl = typeof d.source === "object" ? d.source.level : 0;
          const tl = typeof d.target === "object" ? d.target.level : 0;
          if (sl === 0) return 230;
          if (sl === 1 && tl === 2) return 78;
          if (sl === 2 && tl === 3) return 46;
          return 96;
        })
        .strength((d) => (linkType(d.type) === "contains" ? 0.72 : 0.22)),
    )
    .force("charge", d3.forceManyBody<GraphNode>().strength((d) => [-1300, -540, -130, -70][d.level] ?? -70))
    .force("collision", d3.forceCollide<GraphNode>().radius((d) => [56, 28, 14, 10][d.level] ?? 10).strength(0.9))
    .force("center", d3.forceCenter(W / 2, H / 2).strength(0.03))
    .force("x", d3.forceX(W / 2).strength(0.018))
    .force("y", d3.forceY(H / 2).strength(0.018))
    .alphaDecay(0.016)
    .velocityDecay(0.36);

  let linkSel = linksG.selectAll<SVGLineElement, GraphLink>("line");
  let nodeSel = nodesG.selectAll<SVGGElement, GraphNode>("g");
  let updatePositions: () => void = () => {};

  function render(): void {
    const links = visibleLinks();
    const visibleIds = visibleNodeIdSet(links);
    const nodes = opts.data.nodes.filter((n) => visibleIds.has(n.id));

    linkSel = linkSel.data(links, (d: GraphLink) => linkKey(d));
    linkSel.exit().remove();

    linkSel = linkSel
      .enter()
      .append("line")
      .attr("class", (d: GraphLink) => `graph__link graph__link--${linkType(d.type)}`)
      .attr("stroke-dasharray", (d: GraphLink) => linkDashByType[linkType(d.type)] ?? null)
      .attr("opacity", 0.02)
      .merge(linkSel);

    nodeSel = nodeSel.data(nodes, (d: GraphNode) => d.id);
    nodeSel.exit().remove();

    const enter = nodeSel
      .enter()
      .append("g")
      .attr("class", (d) => `graph__node graph__node--${nodeGroupKey(String(d.group))}`)
      .attr("tabindex", 0)
      .attr("role", "button")
      .attr("focusable", true as never)
      .attr("aria-label", (d) => `${d.label}，Level ${d.level}`)
      .on("pointerenter", (e: PointerEvent, d: GraphNode) => {
        state.hoveredId = d.id;
        opts.onPointerNode(d, { x: e.clientX, y: e.clientY });
        applyFocus("hover");
        opts.onNodeFocused(d);
        opts.onStateChanged(getState());
      })
      .on("pointermove", (e: PointerEvent, d: GraphNode) => {
        if (state.hoveredId !== d.id) return;
        opts.onPointerNode(d, { x: e.clientX, y: e.clientY });
      })
      .on("pointerleave", () => {
        state.hoveredId = null;
        opts.onPointerNode(null, null);
        applyFocus("hover");
        opts.onNodeFocused(nById.get(state.selectedId) ?? null);
        opts.onStateChanged(getState());
      })
      .on("click", (e: MouseEvent, d: GraphNode) => {
        e.stopPropagation();
        state.selectedId = d.id;
        state.hoveredId = null;
        opts.onPointerNode(null, null);
        applyFocus("select");
        opts.onNodeFocused(d);
        opts.onStateChanged(getState());
        opts.announce(`${d.label} 已选中`);
      })
      .on("keydown", (e: KeyboardEvent, d: GraphNode) => {
        const key = e.key;
        if (key === "Enter" || key === " ") {
          e.preventDefault();
          state.selectedId = d.id;
          state.hoveredId = null;
          opts.onPointerNode(null, null);
          applyFocus("select");
          opts.onNodeFocused(d);
          opts.onStateChanged(getState());
          opts.announce(`${d.label} 已选中`);
          return;
        }
        if (key === "Escape") {
          e.preventDefault();
          state.selectedId = "root";
          state.hoveredId = null;
          opts.onPointerNode(null, null);
          applyFocus("select");
          opts.onNodeFocused(nById.get("root") ?? null);
          opts.onStateChanged(getState());
          opts.announce("已回到中心");
        }
      })
      .call(
        d3
          .drag<SVGGElement, GraphNode>()
          .on("start", (e: d3.D3DragEvent<SVGGElement, GraphNode, GraphNode>, d: GraphNode) => {
            if (!e.active) sim.alphaTarget(0.22).restart();
            d.fx = d.x ?? null;
            d.fy = d.y ?? null;
          })
          .on("drag", (e: d3.D3DragEvent<SVGGElement, GraphNode, GraphNode>, d: GraphNode) => {
            d.fx = e.x;
            d.fy = e.y;
          })
          .on("end", (e: d3.D3DragEvent<SVGGElement, GraphNode, GraphNode>, d: GraphNode) => {
            if (!e.active) sim.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          }),
      );

    enter
      .append("circle")
      .attr("class", "graph__node-circle")
      .attr("r", (d) => radiiByLevel.get(d.level) ?? 6)
      .attr("fill", (d) => nodeFillVar(String(d.group)))
      .attr("stroke", (d) => (d.level === 0 ? "#ffffff" : "rgba(255,255,255,0.14)"))
      .attr("stroke-width", (d) => (d.level === 0 ? 2.6 : 0.9));

    enter
      .append("text")
      .attr("class", "graph__node-label")
      .attr("text-anchor", "middle")
      .attr("dy", (d) => (radiiByLevel.get(d.level) ?? 6) + (labelSizeByLevel.get(d.level) ?? 10) + 2)
      .attr("font-size", (d) => labelSizeByLevel.get(d.level) ?? 10)
      .attr("font-weight", (d) => (d.level <= 1 ? 700 : 500))
      .attr("fill", (d) => (d.level <= 1 ? "var(--text)" : "var(--muted-2)"))
      .attr("opacity", 0)
      .text((d) => d.label);

    nodeSel = enter.merge(nodeSel);

    sim.nodes(nodes);
    (sim.force("link") as d3.ForceLink<GraphNode, GraphLink>).links(links);
    sim.alpha(0.86).restart();

    updatePositions = () => {
      linkSel
        .attr("x1", (d) => (typeof d.source === "object" ? d.source.x ?? 0 : 0))
        .attr("y1", (d) => (typeof d.source === "object" ? d.source.y ?? 0 : 0))
        .attr("x2", (d) => (typeof d.target === "object" ? d.target.x ?? 0 : 0))
        .attr("y2", (d) => (typeof d.target === "object" ? d.target.y ?? 0 : 0));

      nodeSel.attr("transform", (d) => `translate(${d.x ?? 0},${d.y ?? 0})`);
    };

    sim.on("tick", updatePositions);

    if (opts.staticMode) {
      for (let i = 0; i < 320; i += 1) sim.tick();
      sim.stop();
      updatePositions();
    }

    applyFocus("program");
  }

  function applyFocus(mode: "hover" | "select" | "program"): void {
    const fid = state.hoveredId ?? state.selectedId;
    const focusNode = nById.get(fid);
    const focusLevel = focusNode?.level ?? 0;
    const showLevel3 = focusLevel >= 1 || fid === "root";
    const conn = connectedSet(fid);

    nodeSel.classed("is-selected", (n) => n.id === state.selectedId);

    nodeSel.attr("opacity", (n) => {
      if (!showLevel3 && n.level === 3) return 0;
      return conn.has(n.id) ? 1 : 0.06;
    });

    nodeSel.select<SVGCircleElement>("circle").attr("r", (n) => {
      const base = radiiByLevel.get(n.level) ?? 6;
      if (n.id === fid) return base * 1.55;
      return conn.has(n.id) ? base : base * 0.62;
    });

    nodeSel.select<SVGTextElement>("text").attr("opacity", (n) => {
      if (!showLevel3 && n.level === 3) return 0;
      if (n.id === fid) return 1;
      if (conn.has(n.id)) {
        if (n.level <= 1) return 1;
        if (n.level === 2) return 0.86;
        return 0.72;
      }
      return n.level <= 1 ? 0.1 : 0;
    });

    linkSel.attr("opacity", (l) => {
      const s = typeof l.source === "string" ? l.source : l.source.id;
      const t = typeof l.target === "string" ? l.target : l.target.id;
      return s === fid || t === fid ? 0.85 : 0.02;
    });

    linkSel.attr("stroke-width", (l) => {
      const t = linkType(l.type);
      const base = t === "contains" ? 1 : t === "prerequisite" ? 1.9 : t === "application" ? 1.7 : 1.3;
      const s = typeof l.source === "string" ? l.source : l.source.id;
      const tg = typeof l.target === "string" ? l.target : l.target.id;
      return s === fid || tg === fid ? base * 1.9 : base * 0.3;
    });

    if (mode !== "program" && !isReducedMotion()) {
      svg.classed("is-focus-pulse", true);
      window.setTimeout(() => svg.classed("is-focus-pulse", false), 380);
    }
  }

  function resetView(): void {
    const motion = isReducedMotion() ? 0 : 380;
    svg
      .transition()
      .duration(motion)
      .call(zoom.transform as never, d3.zoomIdentity);
  }

  function resize(): void {
    W = canvas.clientWidth;
    H = canvas.clientHeight;
    svg.attr("width", W).attr("height", H);
    sim.force("center", d3.forceCenter(W / 2, H / 2));
    sim.force("x", d3.forceX(W / 2).strength(0.018));
    sim.force("y", d3.forceY(H / 2).strength(0.018));
    if (opts.staticMode) {
      sim.alpha(0.18);
      for (let i = 0; i < 180; i += 1) sim.tick();
      sim.stop();
      updatePositions();
      applyFocus("program");
      return;
    }
    sim.alpha(0.24).restart();
  }

  const ro = new ResizeObserver(() => resize());
  ro.observe(canvas);

  svg.on("click", () => {
    state.selectedId = "root";
    state.hoveredId = null;
    opts.onPointerNode(null, null);
    applyFocus("select");
    opts.onNodeFocused(nById.get("root") ?? null);
    opts.onStateChanged(getState());
    opts.announce("已回到中心");
  });

  function getState(): GraphFocusState {
    return {
      hoveredId: state.hoveredId,
      selectedId: state.selectedId,
      activeTypes: new Set(state.activeTypes),
    };
  }

  render();
  resize();
  opts.onNodeFocused(nById.get("root") ?? null);
  opts.onStateChanged(getState());

  return {
    destroy: () => {
      ro.disconnect();
      sim.stop();
      svg.on(".zoom", null);
      svg.on("click", null);
      svg.selectAll("*").remove();
    },
    resetView,
    setActiveTypes: (types) => {
      state.activeTypes = new Set(types);
      render();
      opts.onStateChanged(getState());
    },
    focus: (id, mode) => {
      if (!nById.has(id)) return;
      if (mode === "hover") {
        state.hoveredId = id;
        applyFocus("hover");
        opts.onNodeFocused(nById.get(id) ?? null);
        opts.onStateChanged(getState());
        return;
      }
      state.selectedId = id;
      state.hoveredId = null;
      applyFocus(mode === "select" ? "select" : "program");
      opts.onNodeFocused(nById.get(id) ?? null);
      opts.onStateChanged(getState());
      opts.announce(`${nById.get(id)?.label ?? id} 已选中`);
    },
    blurHover: () => {
      state.hoveredId = null;
      applyFocus("hover");
      opts.onNodeFocused(nById.get(state.selectedId) ?? null);
      opts.onStateChanged(getState());
    },
    getState,
  };
}
