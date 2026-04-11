import type { GraphApi } from "../graph/createGraph";
import type { GraphData, GraphNode, LinkType } from "../graph/types";

const TYPE_LABEL: Record<LinkType, string> = {
  contains: "层级",
  prerequisite: "前置",
  application: "应用",
  related: "关联",
  learning_path: "学习路径",
};

const NODE_LEGEND: Array<{ label: string; kind: "dot" | "line"; colorVar: string }> = [
  { label: "知识库根节点", kind: "dot", colorVar: "--node-root" },
  { label: "章节 (Level 1)", kind: "dot", colorVar: "--node-chapter" },
  { label: "主题 (Level 2)", kind: "dot", colorVar: "--node-topic" },
  { label: "子话题 (Level 3)", kind: "dot", colorVar: "--node-detail" },
  { label: "学习路径/元信息", kind: "dot", colorVar: "--node-meta" },
  { label: "层级", kind: "line", colorVar: "--link-contains" },
  { label: "前置依赖", kind: "line", colorVar: "--link-prerequisite" },
  { label: "应用", kind: "line", colorVar: "--link-application" },
  { label: "关联", kind: "line", colorVar: "--link-related" },
  { label: "学习路径", kind: "line", colorVar: "--link-learning" },
];

function escapeHtml(input: string): string {
  return input.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function linkEndpointId(v: string | GraphNode): string {
  return typeof v === "string" ? v : v.id;
}

function buildConnList(data: GraphData, nodeId: string): Array<{ id: string; type: LinkType; dir: string }> {
  const out: Array<{ id: string; type: LinkType; dir: string }> = [];
  data.links.forEach((l) => {
    const s = linkEndpointId(l.source);
    const t = linkEndpointId(l.target);
    const type = String(l.type) as LinkType;
    if (s === nodeId) out.push({ id: t, type, dir: "→" });
    if (t === nodeId) out.push({ id: s, type, dir: "←" });
  });
  return out;
}

function rankMatch(node: GraphNode, q: string): number {
  const label = node.label.toLowerCase();
  const desc = (node.description ?? "").toLowerCase();
  if (label === q) return 0;
  if (label.startsWith(q)) return 1;
  if (label.includes(q)) return 2;
  if (desc.includes(q)) return 3;
  return 9;
}

export function initSidebar(params: {
  data: GraphData;
  graph: GraphApi;
  announce: (message: string) => void;
}): {
  renderNodePanel: (node: GraphNode | null) => void;
  setActiveTypes: (types: Set<LinkType>) => void;
} {
  const { data, graph } = params;

  const must = <T extends HTMLElement>(id: string): T => {
    const el = document.getElementById(id);
    if (!el) throw new Error(`Missing UI element: ${id}`);
    return el as T;
  };

  const mustInput = (id: string): HTMLInputElement => {
    const el = must<HTMLElement>(id);
    if (!(el instanceof HTMLInputElement)) throw new Error(`UI element is not input: ${id}`);
    return el;
  };

  const elPanel = must<HTMLElement>("node-panel");
  const elAnnouncer = must<HTMLElement>("sr-announcer");
  const elFilter = must<HTMLElement>("filter-chips");
  const elLegend = must<HTMLElement>("legend");
  const elSearch = mustInput("search-input");
  const elResults = must<HTMLElement>("search-results");

  const elNodes = document.getElementById("s-nodes");
  const elLinks = document.getElementById("s-links");
  const elLevel1 = document.getElementById("s-level1");
  const elLevel2 = document.getElementById("s-level2");

  const nById = new Map<string, GraphNode>();
  data.nodes.forEach((n) => nById.set(n.id, n));

  if (elNodes) elNodes.textContent = String(data.nodes.length);
  if (elLinks) elLinks.textContent = String(data.links.length);
  if (elLevel1) elLevel1.textContent = String(data.nodes.filter((n) => n.level === 1 && n.group === "chapter").length);
  if (elLevel2) elLevel2.textContent = String(data.nodes.filter((n) => n.level === 2).length);

  let activeTypes = new Set<LinkType>(["contains", "prerequisite", "application", "related", "learning_path"]);
  const buttons = new Map<LinkType, HTMLButtonElement>();

  function renderFilter(): void {
    elFilter.innerHTML = "";
    (Object.keys(TYPE_LABEL) as LinkType[]).forEach((t) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = `chip ${activeTypes.has(t) ? "is-active" : ""}`;
      b.textContent = TYPE_LABEL[t];
      b.setAttribute("aria-pressed", String(activeTypes.has(t)));
      b.addEventListener("click", () => {
        if (activeTypes.has(t)) activeTypes.delete(t);
        else activeTypes.add(t);
        renderFilter();
        graph.setActiveTypes(activeTypes);
        params.announce("连接筛选已更新");
      });
      buttons.set(t, b);
      elFilter.appendChild(b);
    });
  }

  function renderLegend(): void {
    elLegend.innerHTML = "";
    NODE_LEGEND.forEach((row) => {
      const wrap = document.createElement("div");
      wrap.className = "legend__row";
      const mark = document.createElement("div");
      if (row.kind === "dot") {
        mark.className = "legend__mark";
        mark.style.background = `var(${row.colorVar})`;
      } else {
        mark.className = "legend__line";
        mark.style.background = `var(${row.colorVar})`;
      }
      const text = document.createElement("div");
      text.textContent = row.label;
      wrap.appendChild(mark);
      wrap.appendChild(text);
      elLegend.appendChild(wrap);
    });
  }

  function renderNodePanel(node: GraphNode | null): void {
    if (!node) {
      elPanel.innerHTML = `<div class="panel__empty">点击/悬停节点查看详情。你也可以使用搜索框快速定位。</div>`;
      return;
    }

    const conns = buildConnList(data, node.id);
    const list = conns
      .slice(0, 18)
      .map((c) => {
        const target = nById.get(c.id);
        const label = target ? target.label : c.id;
        const type = TYPE_LABEL[c.type] ?? c.type;
        return `
          <button class="conn" type="button" data-id="${escapeHtml(c.id)}" aria-label="${escapeHtml(
            `${type} ${c.dir} ${label}`,
          )}">
            <span class="conn__type">${escapeHtml(String(c.type))}</span>
            <span>${escapeHtml(`${c.dir} ${label}`)}</span>
          </button>
        `;
      })
      .join("");

    const dots = [
      { label: `Level ${node.level}`, color: "var(--accent)" },
      { label: String(node.group), color: "var(--muted)" },
      ...(node.difficulty ? [{ label: `难度 ${node.difficulty}`, color: "var(--gold)" }] : []),
    ];

    elPanel.innerHTML = `
      <div class="panel__title">${escapeHtml(node.label)}</div>
      ${node.description ? `<div class="panel__desc">${escapeHtml(node.description)}</div>` : ""}
      <div class="panel__meta">
        ${dots
          .map((d) => `<span class="badge"><span class="badge__dot" style="background:${d.color}"></span>${escapeHtml(d.label)}</span>`)
          .join("")}
      </div>
      <div class="panel__subtitle">关联节点 (${conns.length})</div>
      <div class="conn-list">${list || `<div class="panel__empty">暂无关联</div>`}</div>
      ${conns.length > 18 ? `<div class="sidebar__hint">仅展示前 18 条关联</div>` : ""}
    `;

    elPanel.querySelectorAll<HTMLButtonElement>(".conn[data-id]").forEach((b) => {
      b.addEventListener("click", () => {
        const id = b.dataset.id;
        if (!id) return;
        graph.focus(id, "select");
      });
    });
  }

  function announce(message: string): void {
    elAnnouncer.textContent = message;
    params.announce(message);
  }

  let resultIndex = -1;

  function renderSearchResults(items: GraphNode[], q: string): void {
    elResults.innerHTML = "";
    resultIndex = -1;
    if (!q) return;

    items.slice(0, 10).forEach((n, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "result";
      b.setAttribute("role", "option");
      b.setAttribute("aria-selected", "false");
      b.dataset.id = n.id;
      b.innerHTML = `<span>${escapeHtml(n.label)}</span><span class="result__meta">L${n.level}</span>`;
      b.addEventListener("click", () => {
        graph.focus(n.id, "select");
        elSearch.value = "";
        elResults.innerHTML = "";
        announce(`${n.label} 已选中`);
      });
      elResults.appendChild(b);
      if (i === 0) b.scrollIntoView({ block: "nearest" });
    });
  }

  function updateActiveResult(): void {
    const items = Array.from(elResults.querySelectorAll<HTMLButtonElement>(".result"));
    items.forEach((el, i) => el.setAttribute("aria-selected", String(i === resultIndex)));
    const active = items[resultIndex];
    if (active) active.scrollIntoView({ block: "nearest" });
  }

  elSearch.addEventListener("input", () => {
    const q = elSearch.value.trim().toLowerCase();
    if (!q) {
      elResults.innerHTML = "";
      graph.blurHover();
      return;
    }
    const matches = data.nodes
      .filter((n) => n.label.toLowerCase().includes(q) || (n.description ?? "").toLowerCase().includes(q))
      .sort((a, b) => rankMatch(a, q) - rankMatch(b, q));
    renderSearchResults(matches, q);
    if (matches[0]) graph.focus(matches[0].id, "hover");
  });

  elSearch.addEventListener("keydown", (e) => {
    const items = Array.from(elResults.querySelectorAll<HTMLButtonElement>(".result"));
    if (e.key === "Escape") {
      e.preventDefault();
      elSearch.value = "";
      elResults.innerHTML = "";
      graph.blurHover();
      announce("搜索已清空");
      return;
    }
    if (!items.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      resultIndex = Math.min(items.length - 1, resultIndex + 1);
      updateActiveResult();
      const id = items[resultIndex]?.dataset.id;
      if (id) graph.focus(id, "hover");
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      resultIndex = Math.max(0, resultIndex - 1);
      updateActiveResult();
      const id = items[resultIndex]?.dataset.id;
      if (id) graph.focus(id, "hover");
      return;
    }
    if (e.key === "Enter") {
      const id = items[Math.max(0, resultIndex)]?.dataset.id;
      if (!id) return;
      e.preventDefault();
      graph.focus(id, "select");
      elSearch.value = "";
      elResults.innerHTML = "";
      const node = nById.get(id);
      if (node) announce(`${node.label} 已选中`);
      return;
    }
  });

  renderFilter();
  renderLegend();
  renderNodePanel(null);

  return {
    renderNodePanel,
    setActiveTypes: (types) => {
      activeTypes = new Set(types);
      renderFilter();
    },
  };
}
