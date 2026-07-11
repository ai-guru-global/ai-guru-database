import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface TrendDataPoint {
  date: string;
  avgScore: number;
}

interface ModelTrend {
  model: string;
  data: TrendDataPoint[];
  delta: string | null;
}

interface TrendChartProps {
  selectedModels?: string[];
}

const MODEL_COLORS: Record<string, string> = {
  qwen: "#FF6A00",
  kimi: "#6366F1",
  minimax: "#10B981",
};

export function TrendChart({ selectedModels = ["kimi"] }: TrendChartProps) {
  const [trends, setTrends] = useState<Record<string, ModelTrend>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrends();
    // Poll for updates
    const interval = setInterval(fetchTrends, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchTrends = async () => {
    try {
      const r = await fetch("/api/k8s-eval/trends");
      const d = await r.json();
      if (d.ok) {
        setTrends(d.trends || {});
      }
    } catch {}
    setLoading(false);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 flex justify-center text-muted-foreground">
          Loading trends...
        </CardContent>
      </Card>
    );
  }

  const modelsToShow = selectedModels.filter(m => trends[m]?.data?.length > 0);

  if (modelsToShow.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground text-sm">
          No trend data yet. Run an evaluation to start tracking.
        </CardContent>
      </Card>
    );
  }

  // Find global min/max for scale
  let minScore = 100, maxScore = 0;
  for (const m of modelsToShow) {
    for (const pt of trends[m]?.data || []) {
      minScore = Math.min(minScore, pt.avgScore);
      maxScore = Math.max(maxScore, pt.avgScore);
    }
  }
  const padding = 5;
  const chartHeight = 200;
  const chartWidth = 600;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <CardTitle className="text-base">Score Trends</CardTitle>
        </div>
        <CardDescription>Historical evaluation scores over time</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Legend with delta */}
        <div className="flex flex-wrap gap-4 mb-4">
          {modelsToShow.map((m) => {
            const trend = trends[m];
            const delta = trend?.delta;
            const deltaNum = delta ? parseFloat(delta) : 0;
            return (
              <div key={m} className="flex items-center gap-2 text-sm">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: MODEL_COLORS[m] || "#888" }}
                />
                <span className="font-medium">{trend?.model || m}</span>
                {delta && (
                  <span
                    className={`flex items-center gap-0.5 text-xs ${
                      deltaNum > 0 ? "text-green-500" : deltaNum < 0 ? "text-red-500" : "text-muted-foreground"
                    }`}
                  >
                    {deltaNum > 0 ? <TrendingUp className="h-3 w-3" /> : deltaNum < 0 ? <TrendingDown className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
                    {delta}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Simple SVG chart */}
        <div className="overflow-x-auto">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight + 40}`}
            className="w-full"
            style={{ minWidth: "400px" }}
          >
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map((pct) => {
              const y = chartHeight - ((pct - minScore + padding) / (maxScore - minScore + padding * 2)) * chartHeight;
              return (
                <g key={pct}>
                  <line
                    x1="40"
                    y1={y}
                    x2={chartWidth - 10}
                    y2={y}
                    stroke="hsl(var(--border))"
                    strokeDasharray="4,4"
                  />
                  <text x="35" y={y + 4} textAnchor="end" className="text-[10px] fill-muted-foreground">
                    {pct.toFixed(0)}
                  </text>
                </g>
              );
            })}

            {/* Lines for each model */}
            {modelsToShow.map((m) => {
              const data = trends[m]?.data || [];
              if (data.length < 2) return null;

              const points = data.map((pt, i) => {
                const x = 40 + (i / (data.length - 1)) * (chartWidth - 50);
                const y = chartHeight - ((pt.avgScore - minScore + padding) / (maxScore - minScore + padding * 2)) * chartHeight;
                return `${x},${y}`;
              });

              return (
                <g key={m}>
                  {/* Line */}
                  <polyline
                    points={points}
                    fill="none"
                    stroke={MODEL_COLORS[m] || "#888"}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Points */}
                  {data.map((pt, i) => {
                    const x = 40 + (i / (data.length - 1)) * (chartWidth - 50);
                    const y = chartHeight - ((pt.avgScore - minScore + padding) / (maxScore - minScore + padding * 2)) * chartHeight;
                    return (
                      <circle
                        key={i}
                        cx={x}
                        cy={y}
                        r="4"
                        fill={MODEL_COLORS[m] || "#888"}
                      />
                    );
                  })}
                </g>
              );
            })}

            {/* X-axis labels */}
            {(() => {
              const latestData = trends[modelsToShow[0]]?.data || [];
              if (latestData.length < 2) return null;
              const step = Math.max(1, Math.floor(latestData.length / 5));
              return latestData
                .filter((_, i) => i % step === 0 || i === latestData.length - 1)
                .map((pt, i, arr) => {
                  const origIdx = latestData.findIndex(p => p.date === pt.date);
                  const x = 40 + (origIdx / (latestData.length - 1)) * (chartWidth - 50);
                  return (
                    <text
                      key={pt.date}
                      x={x}
                      y={chartHeight + 20}
                      textAnchor="middle"
                      className="text-[10px] fill-muted-foreground"
                    >
                      {pt.date.slice(5)}
                    </text>
                  );
                });
            })()}
          </svg>
        </div>
      </CardContent>
    </Card>
  );
}
