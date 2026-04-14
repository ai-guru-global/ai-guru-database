/**
 * ArenaRadarChart — Arena.ai style radar chart with warm cream background,
 * multi-ring grid, concentric score labels, and 3-model overlay.
 */

interface ModelData {
  name: string;
  color: string;
  scores: number[]; // one per dimension
}

interface Props {
  dimensions: string[];
  models: ModelData[];
  /** Score range labels on the rings (inner→outer) */
  ringLabels?: number[];
  size?: number;
  className?: string;
}

export function ArenaRadarChart({
  dimensions,
  models,
  ringLabels = [20, 40, 60, 80, 100],
  size = 440,
  className = "",
}: Props) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.33;
  const n = dimensions.length;
  const angleStep = (2 * Math.PI) / n;
  const startAngle = -Math.PI / 2;

  const pt = (idx: number, val: number, max: number = 100) => {
    const a = startAngle + idx * angleStep;
    const r = (val / max) * radius;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  };

  const labelPt = (idx: number, extra = 0) => {
    const a = startAngle + idx * angleStep;
    const r = radius + 36 + extra;
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

  return (
    <div className={`inline-block ${className}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Cream background circle */}
        <circle cx={cx} cy={cy} r={radius + 8} fill="#FAF6F0" />

        {/* Grid rings */}
        {gridPaths.map((d, i) => (
          <path
            key={i}
            d={d}
            fill={i === gridPaths.length - 1 ? "none" : "#F0EBE3"}
            stroke="#D4CBC0"
            strokeWidth={0.8}
            strokeOpacity={0.6}
          />
        ))}

        {/* Ring score labels — on the top axis */}
        {ringLabels.map((ring) => {
          const p = pt(0, ring, maxRing);
          return (
            <text
              key={ring}
              x={p.x + 2}
              y={p.y - 4}
              fill="#9B8E80"
              fontSize={9}
              fontFamily="'JetBrains Mono', monospace"
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
            strokeWidth={0.6}
          />
        ))}

        {/* Model polygons — render back-to-front */}
        {[...models].reverse().map((model) => {
          const pts = model.scores.map((s, i) => {
            const p = pt(i, s, maxRing);
            return `${p.x},${p.y}`;
          });
          return (
            <path
              key={model.name}
              d={`M${pts.join("L")}Z`}
              fill={model.color}
              fillOpacity={0.12}
              stroke={model.color}
              strokeWidth={2.5}
              strokeLinejoin="round"
            />
          );
        })}

        {/* Model data points */}
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

        {/* Dimension labels */}
        {dimensions.map((dim, i) => {
          const p = labelPt(i);
          return (
            <text
              key={i}
              x={p.x}
              y={p.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#5C534A"
              fontSize={12}
              fontWeight={600}
              fontFamily="system-ui, sans-serif"
            >
              {dim}
            </text>
          );
        })}
      </svg>

      {/* Legend — right-aligned below chart */}
      <div className="flex items-center justify-center gap-5 mt-3 px-4">
        {models.map((m) => (
          <div key={m.name} className="flex items-center gap-2">
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{ backgroundColor: m.color }}
            />
            <span className="text-xs font-medium" style={{ color: "#5C534A" }}>
              {m.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
