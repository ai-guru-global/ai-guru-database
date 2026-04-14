import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowUpDown, ChevronDown, ChevronUp, Trophy, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadarChart } from "@/components/leaderboard/RadarChart";
import {
  LEADERBOARD_DATA,
  LEADERBOARD_METADATA,
  CATEGORY_LABELS,
  DIMENSION_LABELS,
  GRADE_CONFIG,
  type AgentScore,
} from "@/data/leaderboardData";

type SortKey = "compositeScore" | "knowledge" | "taskCompletion" | "costPerformance" | "interaction" | "safety";
type CategoryFilter = "all" | "domestic_cloud" | "international_cloud" | "general_chat" | "k8s_eval";

function GradeBadge({ grade }: { grade: string }) {
  const config = GRADE_CONFIG[grade] || GRADE_CONFIG.D;
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${config.color} ${config.bg}`}>
      {grade} - {config.label}
    </span>
  );
}

function TrendIcon({ trend }: { trend: string }) {
  if (trend === "up") return <TrendingUp className="h-4 w-4 text-green-500" />;
  if (trend === "down") return <TrendingDown className="h-4 w-4 text-red-500" />;
  return <Minus className="h-4 w-4 text-muted-foreground" />;
}

function ScoreBar({ score, max = 100 }: { score: number; max?: number }) {
  const pct = (score / max) * 100;
  const color = score >= 90 ? "bg-yellow-500" : score >= 80 ? "bg-green-500" : score >= 70 ? "bg-blue-500" : score >= 60 ? "bg-orange-500" : "bg-red-500";
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-20 rounded-full bg-muted">
        <div className={`h-2 rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-medium tabular-nums">{score.toFixed(1)}</span>
    </div>
  );
}

export function LeaderboardPage() {
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("compositeScore");
  const [sortAsc, setSortAsc] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredData = useMemo(() => {
    let data = [...LEADERBOARD_DATA];
    if (category !== "all") {
      data = data.filter((a) => a.category === category);
    }
    data.sort((a, b) => {
      let va: number, vb: number;
      if (sortKey === "compositeScore") {
        va = a.compositeScore;
        vb = b.compositeScore;
      } else {
        va = a.dimensions[sortKey as keyof typeof a.dimensions] ?? 0;
        vb = b.dimensions[sortKey as keyof typeof b.dimensions] ?? 0;
      }
      return sortAsc ? va - vb : vb - va;
    });
    return data;
  }, [category, sortKey, sortAsc]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(false);
    }
  };

  const SortButton = ({ label, sortField }: { label: string; sortField: SortKey }) => (
    <button
      onClick={() => handleSort(sortField)}
      className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
    >
      {label}
      <ArrowUpDown className={`h-3 w-3 ${sortKey === sortField ? "text-primary" : ""}`} />
    </button>
  );

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/"><ArrowLeft className="mr-1 h-4 w-4" />Home</Link>
          </Button>
        </div>
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="h-8 w-8 text-yellow-500" />
          <h1 className="text-3xl font-bold tracking-tight">Cloud Agent Leaderboard</h1>
        </div>
        <p className="text-muted-foreground">
          CAPER Five-Dimension Evaluation | {LEADERBOARD_METADATA.version} |{" "}
          {LEADERBOARD_METADATA.totalAgents} Agents Evaluated
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {(["knowledge", "taskCompletion", "costPerformance", "interaction", "safety"] as const).map((dim) => {
          const best = [...LEADERBOARD_DATA].sort(
            (a, b) => b.dimensions[dim] - a.dimensions[dim]
          )[0];
          return (
            <Card key={dim} className="p-4">
              <div className="text-xs text-muted-foreground mb-1">
                {DIMENSION_LABELS[dim]} Top 1
              </div>
              <div className="font-semibold text-sm truncate">{best.agentName}</div>
              <div className="text-lg font-bold text-primary">{best.dimensions[dim].toFixed(1)}</div>
            </Card>
          );
        })}
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(Object.entries(CATEGORY_LABELS) as [CategoryFilter, string][]).map(([key, label]) => (
          <Button
            key={key}
            variant={category === key ? "default" : "outline"}
            size="sm"
            onClick={() => setCategory(key)}
          >
            {label}
            {key !== "all" && (
              <span className="ml-1 text-xs opacity-70">
                ({LEADERBOARD_DATA.filter((a) => a.category === key).length})
              </span>
            )}
          </Button>
        ))}
      </div>

      {/* Leaderboard Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">
            {CATEGORY_LABELS[category]} ({filteredData.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground w-12">#</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Agent</th>
                  <th className="px-4 py-3 text-left"><SortButton label="综合分" sortField="compositeScore" /></th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">等级</th>
                  <th className="px-4 py-3 text-left hidden md:table-cell"><SortButton label="知识" sortField="knowledge" /></th>
                  <th className="px-4 py-3 text-left hidden md:table-cell"><SortButton label="任务" sortField="taskCompletion" /></th>
                  <th className="px-4 py-3 text-left hidden lg:table-cell"><SortButton label="性价比" sortField="costPerformance" /></th>
                  <th className="px-4 py-3 text-left hidden lg:table-cell"><SortButton label="交互" sortField="interaction" /></th>
                  <th className="px-4 py-3 text-left hidden lg:table-cell"><SortButton label="安全" sortField="safety" /></th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground w-12">趋势</th>
                  <th className="px-4 py-3 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((agent, idx) => (
                  <AgentRow
                    key={agent.agentId}
                    agent={agent}
                    displayRank={idx + 1}
                    expanded={expandedId === agent.agentId}
                    onToggle={() => setExpandedId(expandedId === agent.agentId ? null : agent.agentId)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Methodology Note */}
      <div className="mt-8 rounded-lg border bg-muted/30 p-6">
        <h3 className="font-semibold mb-2">Evaluation Methodology</h3>
        <p className="text-sm text-muted-foreground mb-3">
          Based on CAPER Five-Dimension Model: Knowledge (25%) + Task Completion (25%) + Cost-Performance (20%) + Interaction Quality (15%) + Safety Compliance (15%)
        </p>
        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
          <span>Data Period: 2026 Q2</span>
          <span>Methodology: Auto (60%) + Expert (25%) + User Feedback (15%)</span>
          <span>Test Cases: 120+ per agent</span>
        </div>
      </div>
    </div>
  );
}

function AgentRow({
  agent,
  displayRank,
  expanded,
  onToggle,
}: {
  agent: AgentScore;
  displayRank: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  const rankStyle =
    displayRank === 1 ? "text-yellow-500 font-bold" :
    displayRank === 2 ? "text-gray-400 font-bold" :
    displayRank === 3 ? "text-orange-400 font-bold" : "text-muted-foreground";

  return (
    <>
      <tr
        className="border-b hover:bg-muted/50 cursor-pointer transition-colors"
        onClick={onToggle}
      >
        <td className={`px-4 py-3 ${rankStyle}`}>{displayRank}</td>
        <td className="px-4 py-3">
          <div className="font-medium">{agent.agentName}</div>
          <div className="text-xs text-muted-foreground">{agent.vendor}</div>
        </td>
        <td className="px-4 py-3">
          <span className="text-lg font-bold tabular-nums">{agent.compositeScore.toFixed(2)}</span>
        </td>
        <td className="px-4 py-3"><GradeBadge grade={agent.grade} /></td>
        <td className="px-4 py-3 hidden md:table-cell"><ScoreBar score={agent.dimensions.knowledge} /></td>
        <td className="px-4 py-3 hidden md:table-cell"><ScoreBar score={agent.dimensions.taskCompletion} /></td>
        <td className="px-4 py-3 hidden lg:table-cell"><ScoreBar score={agent.dimensions.costPerformance} /></td>
        <td className="px-4 py-3 hidden lg:table-cell"><ScoreBar score={agent.dimensions.interaction} /></td>
        <td className="px-4 py-3 hidden lg:table-cell"><ScoreBar score={agent.dimensions.safety} /></td>
        <td className="px-4 py-3"><TrendIcon trend={agent.trend} /></td>
        <td className="px-4 py-3">
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={11} className="bg-muted/30 px-4 py-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <RadarChart dimensions={agent.dimensions} size={240} className="mx-auto md:mx-0 shrink-0" />
              <div className="flex-1 space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">{agent.agentName} - Detail Scores</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(Object.entries(DIMENSION_LABELS) as [string, string][]).map(([key, label]) => {
                      const score = agent.dimensions[key as keyof typeof agent.dimensions];
                      return (
                        <div key={key} className="flex items-center justify-between rounded-lg border px-3 py-2 bg-background">
                          <span className="text-sm">{label}</span>
                          <span className="font-bold tabular-nums">{score.toFixed(1)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {/* K8s-specific detail */}
                {agent.k8sDetail && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-primary">K8s 专项评测详情 ({agent.k8sDetail.model})</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <div className="text-xs font-medium text-muted-foreground">语料库覆盖度</div>
                        {[
                          ["核心概念", agent.k8sDetail.corpusSub.coreConcepts],
                          ["API 对象", agent.k8sDetail.corpusSub.apiObjects],
                          ["运维知识", agent.k8sDetail.corpusSub.opsKnowledge],
                          ["版本时效性", agent.k8sDetail.corpusSub.versionTimeliness],
                        ].map(([label, score]) => (
                          <div key={label as string} className="flex items-center justify-between text-xs px-2 py-1 rounded bg-background border">
                            <span>{label as string}</span>
                            <span className="font-semibold tabular-nums">{(score as number).toFixed(1)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs font-medium text-muted-foreground">问答能力</div>
                        {[
                          ["基础知识", agent.k8sDetail.qaSub.basicQa],
                          ["配置编写", agent.k8sDetail.qaSub.configWriting],
                          ["集群运维", agent.k8sDetail.qaSub.clusterOps],
                          ["多轮对话", agent.k8sDetail.qaSub.multiTurn],
                        ].map(([label, score]) => (
                          <div key={label as string} className="flex items-center justify-between text-xs px-2 py-1 rounded bg-background border">
                            <span>{label as string}</span>
                            <span className="font-semibold tabular-nums">{(score as number).toFixed(1)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span className="rounded border px-2 py-1">{agent.vendor}</span>
                  <span className="rounded border px-2 py-1">{CATEGORY_LABELS[agent.category] || agent.category}</span>
                  <span className="rounded border px-2 py-1">Overall Rank: #{agent.rank}</span>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
