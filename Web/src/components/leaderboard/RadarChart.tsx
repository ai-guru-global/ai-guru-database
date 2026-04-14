/**
 * RadarChart - Pure SVG five-dimension radar chart
 * No external charting library required
 */

interface RadarChartProps {
  dimensions: {
    knowledge: number;
    taskCompletion: number;
    costPerformance: number;
    interaction: number;
    safety: number;
  };
  size?: number;
  className?: string;
}

const LABELS = ["知识问答", "任务完成", "性价比", "交互质量", "安全合规"];

export function RadarChart({ dimensions, size = 200, className = "" }: RadarChartProps) {
  const center = size / 2;
  const radius = size * 0.38;
  const values = [
    dimensions.knowledge,
    dimensions.taskCompletion,
    dimensions.costPerformance,
    dimensions.interaction,
    dimensions.safety,
  ];
  const angleStep = (2 * Math.PI) / 5;
  const startAngle = -Math.PI / 2; // Start from top

  const getPoint = (index: number, value: number) => {
    const angle = startAngle + index * angleStep;
    const r = (value / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const getLabelPoint = (index: number) => {
    const angle = startAngle + index * angleStep;
    const r = radius + 24;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  // Grid rings
  const rings = [20, 40, 60, 80, 100];
  const gridPaths = rings.map((ring) => {
    const points = Array.from({ length: 5 }, (_, i) => {
      const p = getPoint(i, ring);
      return `${p.x},${p.y}`;
    });
    return `M${points.join("L")}Z`;
  });

  // Data polygon
  const dataPoints = values.map((v, i) => {
    const p = getPoint(i, v);
    return `${p.x},${p.y}`;
  });
  const dataPath = `M${dataPoints.join("L")}Z`;

  // Axis lines
  const axes = Array.from({ length: 5 }, (_, i) => {
    const p = getPoint(i, 100);
    return { x1: center, y1: center, x2: p.x, y2: p.y };
  });

  return (
    <div className={className}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Grid rings */}
        {gridPaths.map((d, i) => (
          <path
            key={`ring-${i}`}
            d={d}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.1}
            strokeWidth={1}
          />
        ))}

        {/* Axis lines */}
        {axes.map((axis, i) => (
          <line
            key={`axis-${i}`}
            x1={axis.x1}
            y1={axis.y1}
            x2={axis.x2}
            y2={axis.y2}
            stroke="currentColor"
            strokeOpacity={0.15}
            strokeWidth={1}
          />
        ))}

        {/* Data area */}
        <path
          d={dataPath}
          fill="hsl(var(--primary))"
          fillOpacity={0.2}
          stroke="hsl(var(--primary))"
          strokeWidth={2}
        />

        {/* Data points */}
        {values.map((v, i) => {
          const p = getPoint(i, v);
          return (
            <circle
              key={`point-${i}`}
              cx={p.x}
              cy={p.y}
              r={3}
              fill="hsl(var(--primary))"
            />
          );
        })}

        {/* Labels */}
        {LABELS.map((label, i) => {
          const p = getLabelPoint(i);
          return (
            <text
              key={`label-${i}`}
              x={p.x}
              y={p.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="currentColor"
              fillOpacity={0.7}
              fontSize={11}
              fontWeight={500}
            >
              {label}
            </text>
          );
        })}

        {/* Score labels */}
        {values.map((v, i) => {
          const p = getPoint(i, v);
          const offset = v > 50 ? -10 : 10;
          return (
            <text
              key={`score-${i}`}
              x={p.x}
              y={p.y + offset}
              textAnchor="middle"
              fill="hsl(var(--primary))"
              fontSize={10}
              fontWeight={600}
            >
              {v.toFixed(1)}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
