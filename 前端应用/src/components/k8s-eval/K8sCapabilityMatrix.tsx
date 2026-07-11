/**
 * K8sCapabilityMatrix — Arena.ai-style 15-dimension capability matrix radar chart.
 * Warm cream background, multi-ring concentric polygons, colored model overlays.
 * Designed for the K8s Live evaluation page.
 */

interface ModelCapability {
  name: string;
  color: string;
  /** One score per dimension (0–100) */
  scores: number[];
}

interface Props {
  /** Dimension labels (15) */
  dimensions: { label: string; icon: string }[];
  models: ModelCapability[];
  /** Score range labels on the rings (inner→outer) */
  ringLabels?: number[];
  size?: number;
  className?: string;
}

export function K8sCapabilityMatrix({
  dimensions,
  models,
  ringLabels = [20, 40, 60, 80, 100],
  size = 600,
  className = "",
}: Props) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.32;
  const n = dimensions.length;
  const angleStep = (2 * Math.PI) / n;
  const startAngle = -Math.PI / 2;

  const pt = (idx: number, val: number, max = 100) => {
    const a = startAngle + idx * angleStep;
    const r = (val / max) * radius;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  };

  const maxRing = Math.max(...ringLabels);

  // Grid polygons
  const gridPaths = ringLabels.map((ring) => {
    const pts = Array.from({ length: n }, (_, i) => {
      const p = pt(i, ring, maxRing);
      return `${p.x},${p.y}`;
    });
    return `M${pts.join("L")}Z`;
  });

  // Axis lines
  const axes = Array.from({ length: n }, (_, i) => {
    const p = pt(i, maxRing, maxRing);
    return { x2: p.x, y2: p.y };
  });

  // Dimension label positioning
  const labelPt = (idx: number) => {
    const a = startAngle + idx * angleStep;
    const r = radius + 50;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  };

  // Filled region colors
  const fillColors = ["#EBE5DC", "#F0EBE3", "#F5F0E8", "#FAF6F0", "#FAF6F0"];

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Title */}
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg font-bold" style={{ color: "#3D3530", fontFamily: "system-ui, sans-serif" }}>
          Kubernetes 能力矩阵
        </span>
        <span className="text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold">Arena</span>
      </div>
      <p className="text-xs mb-4" style={{ color: "#9B8E80" }}>
        {models.map((m) => m.name).join(" vs ")} — {n} 维度对比
      </p>

      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Outer cream circle background */}
        <circle cx={cx} cy={cy} r={radius + 12} fill="#FAF6F0" />

        {/* Filled ring regions (inner to outer) */}
        {gridPaths.map((d, i) => (
          <path
            key={`fill-${i}`}
            d={d}
            fill={fillColors[i] || "#FAF6F0"}
            stroke="#D4CBC0"
            strokeWidth={0.7}
            strokeOpacity={0.5}
          />
        ))}

        {/* Ring score labels — placed along the first axis (top) */}
        {ringLabels.map((ring) => {
          const p = pt(0, ring, maxRing);
          return (
            <text
              key={ring}
              x={p.x + 4}
              y={p.y - 5}
              fill="#9B8E80"
              fontSize={9}
              fontFamily="'JetBrains Mono', monospace"
              fontWeight={500}
            >
              {ring}
            </text>
          );
        })}

        {/* Axis lines */}
        {axes.map((a, i) => (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={a.x2}
            y2={a.y2}
            stroke="#D4CBC0"
            strokeWidth={0.5}
            strokeOpacity={0.7}
          />
        ))}

        {/* Model polygons — render back-to-front for correct layering */}
        {[...models].reverse().map((model, ri) => {
          const pts = model.scores.map((s, i) => {
            const p = pt(i, s, maxRing);
            return `${p.x},${p.y}`;
          });
          return (
            <path
              key={model.name}
              d={`M${pts.join("L")}Z`}
              fill={model.color}
              fillOpacity={0.1 + ri * 0.04}
              stroke={model.color}
              strokeWidth={2.5}
              strokeLinejoin="round"
            />
          );
        })}

        {/* Model data point dots */}
        {models.map((model) =>
          model.scores.map((s, i) => {
            const p = pt(i, s, maxRing);
            return (
              <circle
                key={`${model.name}-${i}`}
                cx={p.x}
                cy={p.y}
                r={3.5}
                fill={model.color}
                stroke="#FAF6F0"
                strokeWidth={1.5}
              />
            );
          })
        )}

        {/* Dimension labels with icons */}
        {dimensions.map((dim, i) => {
          const p = labelPt(i);
          const angle = startAngle + i * angleStep;
          const isLeft = Math.cos(angle) < -0.1;
          const isRight = Math.cos(angle) > 0.1;
          const anchor = isLeft ? "end" : isRight ? "start" : "middle";

          return (
            <g key={i}>
              <text
                x={p.x}
                y={p.y - 7}
                textAnchor={anchor}
                dominantBaseline="middle"
                fill="#5C534A"
                fontSize={11}
                fontWeight={600}
                fontFamily="system-ui, sans-serif"
              >
                {dim.icon} {dim.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mt-2 px-4">
        {models.map((m) => (
          <div key={m.name} className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: m.color }} />
            <span className="text-xs font-semibold" style={{ color: "#5C534A" }}>{m.name}</span>
          </div>
        ))}
      </div>

      {/* Source line */}
      <div className="mt-3 text-[10px] tracking-wider uppercase" style={{ color: "#B8AFA5" }}>
        SOURCE: K8S LIVE EVALUATION · AI-GURU DATABASE
      </div>
    </div>
  );
}
