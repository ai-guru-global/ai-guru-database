/**
 * K8sEvaluationPage — Dedicated K8s domain evaluation dashboard
 * Route: /arena?tab=k8s
 * Full 15-dimension analysis matching K8s Live evaluation page.
 */
import { useState } from "react";
import { Trophy, Database, MessageSquare, Shield, Gauge, Zap, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { K8sCapabilityMatrix } from "@/components/k8s-eval/K8sCapabilityMatrix";
import {
  K8S_AGENTS,
  GRADE_CONFIG,
  K8S_WEIGHTS,
  K8S_EXTENDED_DIMENSIONS,
  K8S_EXTENDED_SCORES,
  type K8sAgentEval,
} from "@/data/k8sEvalData";

/* ------------------------------------------------------------------ */
/*  Helper components                                                  */
/* ------------------------------------------------------------------ */

function GradeBadge({ grade }: { grade: string }) {
  const cfg = GRADE_CONFIG[grade] || GRADE_CONFIG.D;
  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-bold ${cfg.color} ${cfg.bg}`}>
      {grade} · {cfg.label}
    </span>
  );
}

function MetricPill({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border px-3 py-2 bg-muted/30">
      <span className="text-muted-foreground/50">{icon}</span>
      <div className="flex flex-col">
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</span>
        <span className="text-sm font-bold text-foreground tabular-nums">{value.toFixed(1)}</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Ranking podium card                                                */
/* ------------------------------------------------------------------ */

function RankingCard({ agent, rank }: { agent: K8sAgentEval; rank: number }) {
  const medals = ["", "🥇", "🥈", "🥉"];

  return (
    <Card className="relative overflow-hidden transition-transform hover:scale-[1.01]">
      {/* Top gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-1 rounded-t-lg" style={{ background: `linear-gradient(90deg, ${agent.color}80, ${agent.color}20)` }} />

      {/* Rank badge */}
      <div className="absolute -top-1 -left-1 text-2xl">{medals[rank]}</div>

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{agent.name}</CardTitle>
            <div className="text-xs text-muted-foreground mt-0.5">
              {agent.vendor} · {agent.model}
            </div>
          </div>
          <GradeBadge grade={agent.grade} />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Composite score */}
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-black tabular-nums" style={{ color: agent.color }}>
            {agent.compositeScore.toFixed(1)}
          </span>
          <span className="text-xs text-muted-foreground">/ 100</span>
        </div>

        {/* Score breakdown */}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-muted/50 border px-3 py-2">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              <Database className="h-3 w-3" /> 语料库覆盖
            </div>
            <div className="text-lg font-bold tabular-nums">{agent.corpus.total.toFixed(1)}</div>
          </div>
          <div className="rounded-lg bg-muted/50 border px-3 py-2">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              <MessageSquare className="h-3 w-3" /> 问答能力
            </div>
            <div className="text-lg font-bold tabular-nums">{agent.qa.total.toFixed(1)}</div>
          </div>
        </div>

        {/* Auxiliary metrics */}
        <div className="flex gap-2">
          <MetricPill label="性价比" value={agent.auxiliary.costPerformance} icon={<Gauge className="h-3 w-3" />} />
          <MetricPill label="交互" value={agent.auxiliary.interaction} icon={<Zap className="h-3 w-3" />} />
          <MetricPill label="安全" value={agent.auxiliary.safety} icon={<Shield className="h-3 w-3" />} />
        </div>
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  15-dimension horizontal bar for a single dimension                 */
/* ------------------------------------------------------------------ */

function DimensionBar({
  dim,
  agents,
  scores,
}: {
  dim: { label: string; icon: string };
  agents: K8sAgentEval[];
  scores: number[];     // one score per agent, same order as agents
}) {
  const best = Math.max(...scores);
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-2">
        <span className="text-sm">{dim.icon}</span>
        <span className="text-xs font-semibold text-foreground/80">{dim.label}</span>
      </div>
      <div className="space-y-1">
        {agents.map((agent, ai) => {
          const val = scores[ai];
          const pct = (val / 100) * 100;
          const isBest = val === best;
          return (
            <div key={agent.id} className="flex items-center gap-2">
              <span className="w-16 text-[10px] text-muted-foreground text-right truncate">{agent.name.split(" ")[0]}</span>
              <div className="flex-1 h-4 rounded bg-muted overflow-hidden relative">
                <div
                  className="h-full rounded transition-all duration-700 ease-out"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: agent.color,
                    opacity: isBest ? 0.85 : 0.45,
                  }}
                />
              </div>
              <span className={`w-9 text-right text-[11px] tabular-nums font-semibold ${isBest ? "text-foreground" : "text-muted-foreground"}`}>
                {val.toFixed(1)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  15-dimension detail panel per agent                                */
/* ------------------------------------------------------------------ */

function AgentDetailPanel15({ agent }: { agent: K8sAgentEval }) {
  const scores = K8S_EXTENDED_SCORES[agent.id] || [];

  // Group into 3 columns of 5
  const cols = [
    K8S_EXTENDED_DIMENSIONS.slice(0, 5),
    K8S_EXTENDED_DIMENSIONS.slice(5, 10),
    K8S_EXTENDED_DIMENSIONS.slice(10, 15),
  ];
  const scoreCols = [scores.slice(0, 5), scores.slice(5, 10), scores.slice(10, 15)];
  const avgScore = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;

  return (
    <Card>
      <CardContent className="pt-5">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: agent.color }} />
          <h3 className="font-semibold">{agent.name}</h3>
          <span className="text-xs text-muted-foreground">{agent.model}</span>
          <span className="ml-auto text-xs text-muted-foreground">
            15维度均分: <span className="font-bold text-foreground">{avgScore.toFixed(1)}</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {cols.map((colDims, ci) => (
            <div key={ci} className="space-y-2.5">
              {colDims.map((dim, di) => {
                const val = scoreCols[ci][di];
                const pct = (val / 100) * 100;
                return (
                  <div key={dim.key} className="flex items-center gap-2">
                    <span className="text-xs w-4 text-center">{dim.icon}</span>
                    <span className="w-14 text-[11px] text-muted-foreground truncate">{dim.label}</span>
                    <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, backgroundColor: agent.color, opacity: 0.7 }}
                      />
                    </div>
                    <span className="w-9 text-right text-[11px] tabular-nums font-medium">{val.toFixed(1)}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Weight display                                                     */
/* ------------------------------------------------------------------ */

function WeightBar() {
  const segments = [
    { label: "语料库覆盖", weight: K8S_WEIGHTS.corpusCoverage, color: "#60A5FA" },
    { label: "问答能力", weight: K8S_WEIGHTS.qaAbility, color: "#A78BFA" },
    { label: "性价比", weight: K8S_WEIGHTS.costPerformance, color: "#34D399" },
    { label: "交互", weight: K8S_WEIGHTS.interaction, color: "#FBBF24" },
    { label: "安全", weight: K8S_WEIGHTS.safety, color: "#F87171" },
  ];
  return (
    <div>
      <div className="flex h-3 rounded-full overflow-hidden mb-2">
        {segments.map((s) => (
          <div key={s.label} style={{ width: `${s.weight * 100}%`, backgroundColor: s.color, opacity: 0.7 }} />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {segments.map((s) => (
          <div key={s.label} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color, opacity: 0.7 }} />
            {s.label} ({(s.weight * 100).toFixed(0)}%)
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Content (used by ArenaPage as tab content)                    */
/* ------------------------------------------------------------------ */

export function K8sEvaluationContent() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  const sorted = [...K8S_AGENTS].sort((a, b) => b.compositeScore - a.compositeScore);

  return (
    <div className="space-y-10">
      {/* Weight bar */}
      <div className="max-w-2xl">
        <div className="text-[10px] text-muted-foreground/60 uppercase tracking-wider mb-2">评分权重分配</div>
        <WeightBar />
      </div>

      {/* ========== Ranking Cards ========== */}
      <section>
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
          <Trophy className="h-4 w-4" /> 综合排名
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {sorted.map((agent, idx) => (
            <RankingCard key={agent.id} agent={agent} rank={idx + 1} />
          ))}
        </div>
      </section>

      {/* ========== 15-Dimension Radar (full width) ========== */}
      <section>
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-6 flex items-center gap-2">
          <BarChart3 className="h-4 w-4" /> 十五维度能力矩阵
        </h2>
        <Card className="flex flex-col items-center justify-center p-6 md:p-10 bg-[#FAF6F0] dark:bg-[#FAF6F0]">
          <K8sCapabilityMatrix
            dimensions={K8S_EXTENDED_DIMENSIONS.map((d) => ({ label: d.label, icon: d.icon }))}
            models={K8S_AGENTS.map((agent) => ({
              name: agent.name,
              color: agent.color,
              scores: K8S_EXTENDED_SCORES[agent.id] || [],
            }))}
            ringLabels={[20, 40, 60, 80, 100]}
            size={600}
          />
        </Card>
      </section>

      {/* ========== 15-Dimension Bar Comparison Grid ========== */}
      <section>
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-6">
          十五维度逐项对比
        </h2>
        <Card className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
            {K8S_EXTENDED_DIMENSIONS.map((dim, idx) => (
              <DimensionBar
                key={dim.key}
                dim={dim}
                agents={K8S_AGENTS}
                scores={K8S_AGENTS.map((a) => (K8S_EXTENDED_SCORES[a.id] || [])[idx] || 0)}
              />
            ))}
          </div>
          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-8 pt-4 border-t">
            {K8S_AGENTS.map((agent) => (
              <div key={agent.id} className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: agent.color }} />
                <span className="text-xs text-muted-foreground">{agent.name}</span>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* ========== Detail Panels ========== */}
      <section>
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">
          模型详细数据 — 15 维度
        </h2>

        {/* Toggle buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Button
            variant={selectedAgent === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedAgent(null)}
          >
            全部
          </Button>
          {K8S_AGENTS.map((a) => (
            <Button
              key={a.id}
              variant={selectedAgent === a.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedAgent(a.id)}
            >
              <span className="w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: a.color }} />
              {a.name.split(" ")[0]}
            </Button>
          ))}
        </div>

        {/* Panels */}
        <div className="space-y-4">
          {(selectedAgent ? K8S_AGENTS.filter((a) => a.id === selectedAgent) : K8S_AGENTS).map((agent) => (
            <AgentDetailPanel15 key={agent.id} agent={agent} />
          ))}
        </div>
      </section>

      {/* ========== Methodology ========== */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-sm font-semibold mb-3">评估方法论</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-muted-foreground">
            <div>
              <div className="text-muted-foreground/60 uppercase tracking-wider text-[10px] mb-1">测试数据</div>
              <p>120 道 K8s 专项题目，覆盖 15 个评估维度，涵盖 K8s 1.28–1.32 版本</p>
            </div>
            <div>
              <div className="text-muted-foreground/60 uppercase tracking-wider text-[10px] mb-1">评估框架</div>
              <p>CAPER 五维模型 + K8s 专项权重：语料库(40%) + 问答(35%) + 性价比(10%) + 交互(10%) + 安全(5%)</p>
            </div>
            <div>
              <div className="text-muted-foreground/60 uppercase tracking-wider text-[10px] mb-1">评分方式</div>
              <p>MockPlugin 模拟评估 + Profile-based 差异化评分，数据周期 2026 Q2，与 Agent Eval 对齐</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function K8sEvaluationPage() {
  return <K8sEvaluationContent />;
}
