import type { GraphNode } from "../graph/types";

export type TooltipApi = {
  open: (node: GraphNode, client: { x: number; y: number }) => void;
  move: (client: { x: number; y: number }) => void;
  close: () => void;
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function createTooltip(tooltipEl: HTMLElement, canvasEl: HTMLElement): TooltipApi {
  let lastClient: { x: number; y: number } | null = null;

  function render(node: GraphNode): void {
    const pills: Array<{ label: string }> = [];
    pills.push({ label: `Level ${node.level}` });
    pills.push({ label: String(node.group) });
    if (node.difficulty) pills.push({ label: `难度 ${node.difficulty}` });

    tooltipEl.innerHTML = `
      <div class="tooltip__title">${node.label}</div>
      <div class="tooltip__meta">
        ${pills.map((p) => `<span class="tooltip__pill">${p.label}</span>`).join("")}
      </div>
    `;
  }

  function position(client: { x: number; y: number }): void {
    const rect = canvasEl.getBoundingClientRect();
    const tipRect = tooltipEl.getBoundingClientRect();

    const pad = 12;
    const x = clamp(client.x - rect.left + 14, pad, rect.width - tipRect.width - pad);
    const y = clamp(client.y - rect.top + 14, pad, rect.height - tipRect.height - pad);

    tooltipEl.style.transform = `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`;
  }

  return {
    open: (node, client) => {
      lastClient = client;
      tooltipEl.setAttribute("aria-hidden", "false");
      render(node);
      tooltipEl.classList.add("is-open");
      position(client);
    },
    move: (client) => {
      lastClient = client;
      position(client);
    },
    close: () => {
      lastClient = null;
      tooltipEl.setAttribute("aria-hidden", "true");
      tooltipEl.classList.remove("is-open");
      tooltipEl.style.transform = "translate3d(-999px, -999px, 0)";
    },
  };
}

