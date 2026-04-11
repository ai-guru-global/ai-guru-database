import "./styles/main.scss";

import { createGraph } from "./graph/createGraph";
import { loadGraphData } from "./graph/loadData";
import { initSidebar } from "./ui/sidebar";
import { getStoredTheme, toggleTheme, setTheme } from "./ui/theme";
import { createTooltip } from "./ui/tooltip";
import type { GraphNode } from "./graph/types";
import type { GraphApi } from "./graph/createGraph";

function getEl<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Missing element: ${id}`);
  return el as T;
}

function getSvg(id: string): SVGSVGElement {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Missing element: ${id}`);
  if (!(el instanceof SVGSVGElement)) throw new Error(`Element is not SVG: ${id}`);
  return el;
}

function setSidebarOpen(open: boolean): void {
  document.body.classList.toggle("is-sidebar-open", open);
}

function isSidebarOpen(): boolean {
  return document.body.classList.contains("is-sidebar-open");
}

function initShell(): void {
  setTheme(getStoredTheme());

  document.querySelectorAll<HTMLElement>("[data-action]").forEach((el) => {
    el.addEventListener("click", () => {
      const action = el.dataset.action;
      if (!action) return;
      if (action === "toggle-sidebar") setSidebarOpen(!isSidebarOpen());
      if (action === "toggle-theme") toggleTheme();
    });
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isSidebarOpen()) setSidebarOpen(false);
  });

  const mq = window.matchMedia("(max-width: 980px)");
  const onMq = () => {
    if (!mq.matches) setSidebarOpen(false);
  };
  mq.addEventListener("change", onMq);
  onMq();
}

async function init(): Promise<void> {
  initShell();

  const url = new URL(window.location.href);
  const staticMode = url.searchParams.get("static") === "1";

  const svgEl = getSvg("graph");
  const canvasEl = getEl<HTMLElement>("canvas");
  const tooltipEl = getEl<HTMLElement>("tooltip");
  const srAnnouncer = getEl<HTMLElement>("sr-announcer");

  const tooltip = createTooltip(tooltipEl, canvasEl);
  const data = await loadGraphData();

  const announce = (message: string) => {
    srAnnouncer.textContent = message;
  };

  let lastFocused: GraphNode | null = null;
  let graph: GraphApi | null = null;
  const graphProxy: GraphApi = {
    destroy: () => graph?.destroy(),
    resetView: () => graph?.resetView(),
    setActiveTypes: (types) => graph?.setActiveTypes(types),
    focus: (id, mode) => graph?.focus(id, mode),
    blurHover: () => graph?.blurHover(),
    getState: () =>
      graph?.getState() ?? {
        hoveredId: null,
        selectedId: "root",
        activeTypes: new Set(),
      },
  };

  const sidebar = initSidebar({ data, graph: graphProxy, announce });

  graph = createGraph({
    svgEl,
    canvasEl,
    data,
    onNodeFocused: (node) => {
      lastFocused = node;
      sidebar.renderNodePanel(node);
    },
    onStateChanged: () => {},
    announce,
    onPointerNode: (node, client) => {
      if (!node || !client) {
        tooltip.close();
        return;
      }
      tooltip.open(node, client);
    },
    staticMode,
    seed: 0.42,
  });

  const resetBtn = document.querySelector<HTMLElement>('[data-action="reset-view"]');
  resetBtn?.addEventListener("click", () => {
    graph.resetView();
    graph.focus("root", "select");
  });

  const toggleSidebarEls = document.querySelectorAll<HTMLElement>('[data-action="toggle-sidebar"]');
  toggleSidebarEls.forEach((el) =>
    el.addEventListener("click", () => {
      const open = !isSidebarOpen();
      setSidebarOpen(open);
    }),
  );

  document.addEventListener("click", (e) => {
    const target = e.target as HTMLElement | null;
    if (!target) return;
    if (target.closest(".sidebar")) return;
    if (target.closest(".app__menu")) return;
    if (window.matchMedia("(max-width: 980px)").matches && isSidebarOpen()) setSidebarOpen(false);
  });

  announce(((lastFocused as unknown as GraphNode | null)?.label ?? "图谱已加载") as string);
}

init().catch((err) => {
  const main = document.getElementById("main");
  if (main) {
    main.innerHTML = `<div style="padding:24px;color:var(--danger)">加载失败：${String(err?.message ?? err)}</div>`;
  }
});
