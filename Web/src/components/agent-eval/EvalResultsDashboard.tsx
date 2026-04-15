/**
 * EvalResultsDashboard — Comprehensive evaluation results dashboard
 * Shows ranking, CAPER radar, key metrics, COVR coverage, gap analysis.
 */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Target, Zap, Clock, AlertTriangle } from "lucide-react";
import { DIMENSION_META, type K8sDimension } from "@/data/k8sTestQuestions";
import {
  CAPER_DIMENSIONS,
  COVR_DIMENSIONS,
  MODEL_COLORS,
  MODEL_NAMES,
  getGrade,
  mapDimensionScoresToCAPER,
  mapDimensionScoresToCOVR,
} from "@/data/agentEvalConfig";
import type { TimelineEntry } from "./QATimelinePanel";

interface EvalResultsDashboardProps {
  entries: TimelineEntry[];
}

function confidenceColor(score: number): string {
  if (score >= 60) return "#22c55e";
  if (score >= 40) return "#f97316";
  return "#ef4444";
}

/* ------------------------------------------------------------------ */
/*  Model Summary aggregation                                          */
/* ------------------------------------------------------------------ */
interface ModelSummary {
  modelId: string;
  avgScore: number;
  avgLatency: number;
  keywordHitRate: number;
  questionCount: number;
  successRate: number; // score >= 60
  dimensionScores: Record<string, number>;
  caperScores: Record<string, number>;
  covrScores: Record<string, number>;
}

function buildSummaries(entries: TimelineEntry[]): ModelSummary[] {
  const modelMap: Record<string, { scores: number[]; latencies: number[]; kwHit: number; kwTotal: number; dimScores: Record<string, number[]> }> = {};

  for (const e of entries) {
    for (const [mid, r] of Object.entries(e.results)) {
      if (!modelMap[mid]) modelMap[mid] = { scores: [], latencies: [], kwHit: 0, kwTotal: 0, dimScores: {} };
      const m = modelMap[mid];
      m.scores.push(r.score.total);
      m.latencies.push(r.latencyMs);
      m.kwHit += r.score.breakdown?.keywordHits?.length || 0;
      m.kwTotal += e.question.keywords.length;
      const dim = e.question.dimension;
      if (!m.dimScores[dim]) m.dimScores[dim] = [];
      m.dimScores[dim].push(r.score.total);
    }
  }

  const summaries: ModelSummary[] = [];
  for (const [mid, m] of Object.entries(modelMap)) {
    const avg = m.scores.length > 0 ? m.scores.reduce((a, b) => a + b, 0) / m.scores.length : 0;
    const avgLat = m.latencies.length > 0 ? m.latencies.reduce((a, b) => a + b, 0) / m.latencies.length : 0;
    const success = m.scores.filter(s => s >= 60).length;
    const dimAvg: Record<string, number> = {};
    for (const [dim, scores] of Object.entries(m.dimScores)) {
      dimAvg[dim] = scores.reduce((a, b) => a + b, 0) / scores.length;
    }
    summaries.push({
      modelId: mid,
      avgScore: Math.round(avg * 10) / 10,
      avgLatency: Math.round(avgLat),
      keywordHitRate: m.kwTotal > 0 ? Math.round((m.kwHit / m.kwTotal) * 100) : 0,
      questionCount: m.scores.length,
      successRate: m.scores.length > 0 ? Math.round((success / m.scores.length) * 100) : 0,
      dimensionScores: dimAvg,
      caperScores: mapDimensionScoresToCAPER(dimAvg),
      covrScores: mapDimensionScoresToCOVR(dimAvg),
    });
  }

  return summaries.sort((a, b) => b.avgScore - a.avgScore);
}

/* ------------------------------------------------------------------ */
/*  CAPER Radar Chart (inline SVG)                                     */
/* ------------------------------------------------------------------ */
function CAPERRadar({ summaries }: { summaries: ModelSummary[] }) {
  const size = 320;
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.32;
  const dims = CAPER_DIMENSIONS;
  const n = dims.length;
  const angleStep = (2 * Math.PI) / n;
  const startAngle = -Math.PI / 2;

  const pt = (idx: number, val: number) => {
    const a = startAngle + idx * angleStep;
    const r = (val / 100) * radius;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  };

  const rings = [25, 50, 75, 100];

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-xs mx-auto">
      <circle cx={cx} cy={cy} r={radius + 8} fill="#FAF6F0" />
      {rings.map(ring => {
        const pts = Array.from({ length: n }, (_, i) => {
          const p = pt(i, ring);
          return `${p.x},${p.y}`;
        });
        return <polygon key={ring} points={pts.join(" ")} fill="none" stroke="#D4CBC0" strokeWidth={0.7} strokeOpacity={0.5} />;
      })}
      {Array.from({ length: n }, (_, i) => {
        const p = pt(i, 100);
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#D4CBC0" strokeWidth={0.5} strokeOpacity={0.5} />;
      })}
      {summaries.map((s) => {
        const points = dims.map((d, i) => {
          const score = s.caperScores[d.key] || 0;
          const p = pt(i, score);
          return `${p.x},${p.y}`;
        });
        const color = MODEL_COLORS[s.modelId] || "#888";
        return (
          <g key={s.modelId}>
            <polygon points={points.join(" ")} fill={color} fillOpacity={0.15} stroke={color} strokeWidth={2} />
            {dims.map((d, i) => {
              const score = s.caperScores[d.key] || 0;
              const p = pt(i, score);
              return <circle key={i} cx={p.x} cy={p.y} r={3} fill={color} stroke="white" strokeWidth={1} />;
            })}
          </g>
        );
      })}
      {dims.map((d, i) => {
        const a = startAngle + i * angleStep;
        const lr = radius + 28;
        const x = cx + lr * Math.cos(a);
        const y = cy + lr * Math.sin(a);
        return (
          <text key={d.key} x={x} y={y} textAnchor="middle" dominantBaseline="middle" fill="#5C534A" fontSize={10} fontWeight={600}>
            {d.label}
          </text>
        );
      })}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Dashboard                                                     */
/* ------------------------------------------------------------------ */
export function EvalResultsDashboard({ entries }: EvalResultsDashboardProps) {
  const completedEntries = entries.filter(e => Object.keys(e.results).length > 0);
  if (completedEntries.length === 0) return null;

  const summaries = buildSummaries(completedEntries);
  const medals = ["🥇", "🥈", "🥉"];

  // Gap analysis: dimensions with avg score < 60
  const allDimScores: Record<string, number[]> = {};
  for (const s of summaries) {
    for (const [dim, score] of Object.entries(s.dimensionScores)) {
      if (!allDimScores[dim]) allDimScores[dim] = [];
      allDimScores[dim].push(score);
    }
  }
  const weakDims = Object.entries(allDimScores)
    .map(([dim, scores]) => ({ dim, avg: scores.reduce((a, b) => a + b, 0) / scores.length }))
    .filter(d => d.avg < 70)
    .sort((a, b) => a.avg - b.avg);

  return (
    <div className="space-y-6">
      {/* Section 1: Ranking Cards */}
      <div>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
          <Trophy className="h-4 w-4" /> 综合排名
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {summaries.map((s, idx) => {
            const grade = getGrade(s.avgScore);
            return (
              <Card key={s.modelId} className="relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1" style={{ background: `linear-gradient(90deg, ${MODEL_COLORS[s.modelId]}60, transparent)` }} />
                <CardContent className="pt-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{medals[idx] || `#${idx + 1}`}</span>
                      <div>
                        <div className="text-sm font-bold">{MODEL_NAMES[s.modelId] || s.modelId}</div>
                        <div className="text-[10px] text-muted-foreground">{s.questionCount} 题已评测</div>
                      </div>
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-md border ${grade.color} ${grade.bg}`}>
                      {grade.grade} {grade.label}
                    </span>
                  </div>
                  <div className="text-3xl font-black tabular-nums mb-3" style={{ color: MODEL_COLORS[s.modelId] }}>
                    {s.avgScore}
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <div className="text-[9px] text-muted-foreground/60">成功率</div>
                      <div className="text-xs font-bold tabular-nums">{s.successRate}%</div>
                    </div>
                    <div>
                      <div className="text-[9px] text-muted-foreground/60">关键词</div>
                      <div className="text-xs font-bold tabular-nums">{s.keywordHitRate}%</div>
                    </div>
                    <div>
                      <div className="text-[9px] text-muted-foreground/60">延迟</div>
                      <div className="text-xs font-bold tabular-nums">{s.avgLatency}ms</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Section 2: CAPER Radar + Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Target className="h-4 w-4" /> CAPER 五维雷达图
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CAPERRadar summaries={summaries} />
            <div className="flex flex-wrap justify-center gap-3 mt-2">
              {summaries.map((s) => (
                <div key={s.modelId} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: MODEL_COLORS[s.modelId] }} />
                  <span className="text-[10px] font-medium">{MODEL_NAMES[s.modelId]}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics Cards */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Zap className="h-4 w-4" /> 关键指标对比
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {summaries.map((s) => (
              <div key={s.modelId} className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: MODEL_COLORS[s.modelId] }} />
                  <span className="text-xs font-medium">{MODEL_NAMES[s.modelId]}</span>
                  <span className="ml-auto text-sm font-bold tabular-nums" style={{ color: MODEL_COLORS[s.modelId] }}>{s.avgScore}</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: "任务成功率", value: `${s.successRate}%`, color: confidenceColor(s.successRate) },
                    { label: "关键词命中", value: `${s.keywordHitRate}%`, color: confidenceColor(s.keywordHitRate) },
                    { label: "平均延迟", value: `${s.avgLatency}ms`, color: s.avgLatency < 3000 ? "#22c55e" : "#f97316" },
                    { label: "评测题数", value: `${s.questionCount}`, color: "#3b82f6" },
                  ].map((m) => (
                    <div key={m.label} className="text-center rounded border p-1.5 bg-muted/20">
                      <div className="text-[9px] text-muted-foreground/60">{m.label}</div>
                      <div className="text-xs font-bold tabular-nums" style={{ color: m.color }}>{m.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Section 3: COVR Coverage */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Clock className="h-4 w-4" /> COVR 语料库覆盖度评估
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {COVR_DIMENSIONS.map((covr) => (
              <div key={covr.key} className="rounded-lg border p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: covr.color }} />
                  <span className="text-xs font-medium">{covr.label}</span>
                  <span className="text-[9px] text-muted-foreground/50 ml-auto">{Math.round(covr.weight * 100)}%</span>
                </div>
                {summaries.map((s) => {
                  const score = s.covrScores[covr.key] || 0;
                  return (
                    <div key={s.modelId} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: MODEL_COLORS[s.modelId] }} />
                      <span className="text-[9px] text-muted-foreground w-10 truncate">{(MODEL_NAMES[s.modelId] || s.modelId).split(" ")[0]}</span>
                      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${score}%`, backgroundColor: MODEL_COLORS[s.modelId] }} />
                      </div>
                      <span className="text-[10px] font-bold tabular-nums w-7 text-right" style={{ color: confidenceColor(score) }}>{Math.round(score)}</span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Section 4: Dimension Detail Bars */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">维度详细对比</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {Object.keys(allDimScores).map((dim) => {
              const meta = DIMENSION_META[dim as K8sDimension];
              return (
                <div key={dim} className="space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: meta?.color }} />
                    <span className="text-[10px] font-semibold">{meta?.icon} {meta?.label}</span>
                  </div>
                  {summaries.map((s) => {
                    const score = s.dimensionScores[dim] || 0;
                    return (
                      <div key={s.modelId} className="flex items-center gap-1.5">
                        <span className="w-10 text-[9px] text-muted-foreground text-right truncate">{(MODEL_NAMES[s.modelId] || s.modelId).split(" ")[0]}</span>
                        <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${score}%`, backgroundColor: MODEL_COLORS[s.modelId], opacity: 0.75 }} />
                        </div>
                        <span className="w-6 text-right text-[9px] font-bold tabular-nums">{Math.round(score)}</span>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Section 5: Gap Analysis */}
      {weakDims.length > 0 && (
        <Card className="border-amber-200 dark:border-amber-700/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="h-4 w-4" /> 语料库差距分析与改进建议
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {weakDims.map(({ dim, avg }) => {
                const meta = DIMENSION_META[dim as K8sDimension];
                const grade = getGrade(avg);
                return (
                  <div key={dim} className="flex items-center gap-3 rounded-lg border p-3 bg-amber-50/50 dark:bg-amber-900/10">
                    <span className="text-sm">{meta?.icon}</span>
                    <div className="flex-1">
                      <div className="text-xs font-medium">{meta?.label}</div>
                      <div className="text-[10px] text-muted-foreground">
                        平均得分 <span className="font-bold" style={{ color: confidenceColor(avg) }}>{Math.round(avg)}</span> — 建议补充该领域语料，提升覆盖度
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${grade.color} ${grade.bg}`}>
                      {grade.grade}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
