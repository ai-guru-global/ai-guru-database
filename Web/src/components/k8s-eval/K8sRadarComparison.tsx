/**
 * K8sRadarComparison — Overlaid SVG radar chart comparing 3 models
 * on 8 K8s evaluation dimensions (corpus 4 + QA 4)
 */
import { type K8sAgentEval } from "@/data/k8sEvalData";

interface Props {
  agents: K8sAgentEval[];
  size?: number;
  className?: string;
}

const DIMENSIONS = [
  { label: "核心概念", getter: (a: K8sAgentEval) => a.corpus.coreConcepts },
  { label: "API 对象", getter: (a: K8sAgentEval) => a.corpus.apiObjects },
  { label: "运维知识", getter: (a: K8sAgentEval) => a.corpus.opsKnowledge },
  { label: "版本时效", getter: (a: K8sAgentEval) => a.corpus.versionTimeliness },
  { label: "基础问答", getter: (a: K8sAgentEval) => a.qa.basicQa },
  { label: "配置编写", getter: (a: K8sAgentEval) => a.qa.configWriting },
  { label: "集群运维", getter: (a: K8sAgentEval) => a.qa.clusterOps },
  { label: "多轮对话", getter: (a: K8sAgentEval) => a.qa.multiTurn },
];

export function K8sRadarComparison({ agents, size = 380, className = "" }: Props) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.34;
  const n = DIMENSIONS.length;
  const angleStep = (2 * Math.PI) / n;
  const startAngle = -Math.PI / 2;

  const pt = (idx: number, val: number) => {
    const a = startAngle + idx * angleStep;
    const r = (val / 100) * radius;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  };

  const labelPt = (idx: number) => {
    const a = startAngle + idx * angleStep;
    const r = radius + 30;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  };

  const rings = [25, 50, 75, 100];
  const gridPaths = rings.map((ring) => {
    const pts = Array.from({ length: n }, (_, i) => {
      const p = pt(i, ring);
      return `${p.x},${p.y}`;
    });
    return `M${pts.join("L")}Z`;
  });

  const axes = Array.from({ length: n }, (_, i) => {
    const p = pt(i, 100);
    return { x2: p.x, y2: p.y };
  });

  return (
    <div className={className}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          {agents.map((agent) => (
            <linearGradient key={agent.id} id={`grad-${agent.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={agent.color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={agent.color} stopOpacity={0.08} />
            </linearGradient>
          ))}
        </defs>

        {/* Grid rings */}
        {gridPaths.map((d, i) => (
          <path key={i} d={d} fill="none" stroke="currentColor" strokeOpacity={0.12} strokeWidth={1} />
        ))}

        {/* Ring value labels */}
        {rings.map((ring) => {
          const p = pt(0, ring);
          return (
            <text key={ring} x={p.x + 4} y={p.y - 4} fill="currentColor" fillOpacity={0.35} fontSize={9}>
              {ring}
            </text>
          );
        })}

        {/* Axis lines */}
        {axes.map((a, i) => (
          <line key={i} x1={cx} y1={cy} x2={a.x2} y2={a.y2} stroke="currentColor" strokeOpacity={0.15} strokeWidth={1} />
        ))}

        {/* Data polygons — reverse order so first agent is on top */}
        {[...agents].reverse().map((agent) => {
          const pts = DIMENSIONS.map((dim, i) => {
            const p = pt(i, dim.getter(agent));
            return `${p.x},${p.y}`;
          });
          return (
            <path
              key={agent.id}
              d={`M${pts.join("L")}Z`}
              fill={`url(#grad-${agent.id})`}
              stroke={agent.color}
              strokeWidth={2}
              strokeLinejoin="round"
              className="transition-all duration-500"
            />
          );
        })}

        {/* Data points */}
        {agents.map((agent) =>
          DIMENSIONS.map((dim, i) => {
            const p = pt(i, dim.getter(agent));
            return (
              <circle
                key={`${agent.id}-${i}`}
                cx={p.x}
                cy={p.y}
                r={3}
                fill={agent.color}
                stroke="white"
                strokeWidth={1.5}
              />
            );
          })
        )}

        {/* Dimension labels */}
        {DIMENSIONS.map((dim, i) => {
          const p = labelPt(i);
          const isCorpus = i < 4;
          return (
            <text
              key={i}
              x={p.x}
              y={p.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="currentColor"
              fillOpacity={0.8}
              fontSize={11}
              fontWeight={500}
            >
              <tspan>{dim.label}</tspan>
              <tspan x={p.x} dy={14} fontSize={9} fillOpacity={0.5}>
                {isCorpus ? "语料库" : "问答"}
              </tspan>
            </text>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-2">
        {agents.map((agent) => (
          <div key={agent.id} className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: agent.color }} />
            <span className="text-xs text-muted-foreground">{agent.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
