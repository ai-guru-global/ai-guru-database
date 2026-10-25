/**
 * DecisionPathPanel — AI decision path & reasoning visualization
 * Shows score breakdown stacked bars, keyword heatmap, model comparison.
 */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GitBranch } from "lucide-react";
import { DIMENSION_META, type K8sDimension } from "@/data/k8sTestQuestions";
import { MODEL_COLORS, MODEL_NAMES } from "@/data/agentEvalConfig";
import type { TimelineEntry } from "./QATimelinePanel";

interface DecisionPathPanelProps {
  entries: TimelineEntry[];
}

function confidenceColor(score: number): string {
  if (score >= 60) return "#22c55e";
  if (score >= 40) return "#f97316";
  return "#ef4444";
}

export function DecisionPathPanel({ entries }: DecisionPathPanelProps) {
  const completedEntries = entries.filter(e => Object.keys(e.results).length > 0);
  if (completedEntries.length === 0) return null;

  // Collect all model IDs
  const allModelIds = new Set<string>();
  for (const e of completedEntries) {
    for (const mid of Object.keys(e.results)) {
      allModelIds.add(mid);
    }
  }
  const modelIds = Array.from(allModelIds);

  // Group by dimension for context analysis
  const dimGroups: Record<string, TimelineEntry[]> = {};
  for (const e of completedEntries) {
    const dim = e.question.dimension;
    if (!dimGroups[dim]) dimGroups[dim] = [];
    dimGroups[dim].push(e);
  }

  // Keyword coverage aggregation per model
  const keywordStats: Record<string, { hit: number; total: number }> = {};
  for (const mid of modelIds) {
    let hit = 0, total = 0;
    for (const e of completedEntries) {
      total += e.question.keywords.length;
      hit += e.results[mid]?.score?.breakdown?.keywordHits?.length || 0;
    }
    keywordStats[mid] = { hit, total };
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <GitBranch className="h-4 w-4 text-primary" />
          决策路径与评分分解
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Section 1: Score Decomposition Stacked Bar */}
        <div>
          <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">评分分解对比</h4>
          <div className="space-y-2">
            {completedEntries.map((entry) => {
              const meta = DIMENSION_META[entry.question.dimension as K8sDimension];
              return (
                <div key={entry.question.id} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono text-muted-foreground/50 w-10">{entry.question.id}</span>
                    <span className="text-[10px]" style={{ color: meta?.color }}>{meta?.icon}</span>
                    <span className="text-[10px] text-muted-foreground truncate flex-1">{entry.question.question.slice(0, 40)}...</span>
                  </div>
                  {/* Stacked bars per model */}
                  {modelIds.map((mid) => {
                    const r = entry.results[mid];
                    if (!r) return null;
                    const bd = r.score.breakdown;
                    const total = bd.keywordScore + bd.referenceScore + bd.lengthScore + bd.structureScore;
                    const segments = [
                      { value: bd.keywordScore, color: "#22c55e", label: "关键词" },
                      { value: bd.referenceScore, color: "#3b82f6", label: "相似度" },
                      { value: bd.lengthScore, color: "#f59e0b", label: "长度" },
                      { value: bd.structureScore, color: "#8b5cf6", label: "结构" },
                    ];
                    return (
                      <div key={mid} className="flex items-center gap-2">
                        <span className="w-12 text-[9px] text-right truncate text-muted-foreground">
                          {(MODEL_NAMES[mid] || mid).split(" ")[0]}
                        </span>
                        <div className="flex-1 h-3 rounded-full bg-muted overflow-hidden flex">
                          {segments.map((seg, si) => (
                            <div
                              key={si}
                              className="h-full transition-all duration-500"
                              style={{
                                width: total > 0 ? `${(seg.value / total) * 100}%` : "0%",
                                backgroundColor: seg.color,
                                opacity: 0.8,
                              }}
                              title={`${seg.label}: ${seg.value}`}
                            />
                          ))}
                        </div>
                        <span className="w-8 text-right text-[10px] font-bold tabular-nums" style={{ color: confidenceColor(r.score.total) }}>
                          {r.score.total}
                        </span>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
          {/* Legend */}
          <div className="flex items-center gap-4 mt-2 pt-2 border-t">
            {[
              { color: "#22c55e", label: "关键词" },
              { color: "#3b82f6", label: "相似度" },
              { color: "#f59e0b", label: "长度" },
              { color: "#8b5cf6", label: "结构" },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded" style={{ backgroundColor: l.color, opacity: 0.8 }} />
                <span className="text-[9px] text-muted-foreground/60">{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Keyword Coverage Heatmap */}
        <div>
          <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">关键词覆盖率</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {modelIds.map((mid) => {
              const stats = keywordStats[mid];
              const rate = stats.total > 0 ? Math.round((stats.hit / stats.total) * 100) : 0;
              return (
                <div key={mid} className="rounded-lg border p-3 bg-muted/20">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: MODEL_COLORS[mid] }} />
                    <span className="text-xs font-medium">{MODEL_NAMES[mid] || mid}</span>
                    <span className="ml-auto text-sm font-bold tabular-nums" style={{ color: confidenceColor(rate) }}>{rate}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${rate}%`, backgroundColor: MODEL_COLORS[mid] }} />
                  </div>
                  <div className="text-[9px] text-muted-foreground/50 mt-1">{stats.hit}/{stats.total} 关键词命中</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 3: Context continuity per dimension */}
        <div>
          <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">维度上下文保持分析</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
            {Object.entries(dimGroups).map(([dim, dimEntries]) => {
              const meta = DIMENSION_META[dim as K8sDimension];
              // Calculate per-model average in this dimension
              return (
                <div key={dim} className="rounded-lg border p-2 bg-muted/10">
                  <div className="flex items-center gap-1 mb-1.5">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: meta?.color }} />
                    <span className="text-[10px] font-medium truncate">{meta?.label}</span>
                    <span className="text-[9px] text-muted-foreground/40 ml-auto">{dimEntries.length}题</span>
                  </div>
                  {modelIds.map((mid) => {
                    const scores = dimEntries
                      .map(e => e.results[mid]?.score?.total)
                      .filter((s): s is number => s !== undefined && s > 0);
                    const avg = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
                    // Variance as consistency indicator
                    const variance = scores.length > 1
                      ? Math.round(Math.sqrt(scores.reduce((s, v) => s + (v - avg) ** 2, 0) / scores.length))
                      : 0;
                    return (
                      <div key={mid} className="flex items-center gap-1.5 mt-1">
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: MODEL_COLORS[mid] }} />
                        <span className="text-[9px] font-bold tabular-nums" style={{ color: confidenceColor(avg) }}>{avg}</span>
                        {variance > 10 && (
                          <span className="text-[8px] text-orange-500" title="回答一致性波动较大">&plusmn;{variance}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
