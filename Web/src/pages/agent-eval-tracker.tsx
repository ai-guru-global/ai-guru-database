/**
 * AgentEvalTrackerPage — Full-pipeline evaluation tracker (Agent Eval)
 * Route: /agent-eval
 * Integrates: Pipeline tracker, Criteria panel, QA Timeline, Decision Path, Results Dashboard,
 *             Schedule, Run History, Trend Chart (merged from K8s Live)
 */
import { useState, useRef, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Play, Loader2, Zap, RotateCcw, TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DIMENSION_META, type K8sDimension, type K8sTestQuestion } from "@/data/k8sTestQuestions";
import {
  EVAL_MODELS,
  selectQuestionsPerDimension,
  inferPipelineStage,
  type PipelineStageStatus,
} from "@/data/agentEvalConfig";

import { EvalPipelineTracker } from "@/components/agent-eval/EvalPipelineTracker";
import { EvalCriteriaPanel } from "@/components/agent-eval/EvalCriteriaPanel";
import { QATimelinePanel, type TimelineEntry } from "@/components/agent-eval/QATimelinePanel";
import { DecisionPathPanel } from "@/components/agent-eval/DecisionPathPanel";
import { EvalResultsDashboard } from "@/components/agent-eval/EvalResultsDashboard";
import { ScheduleCard } from "@/components/k8s-eval/ScheduleCard";
import { RunHistoryTable } from "@/components/k8s-eval/RunHistoryTable";
import { TrendChart } from "@/components/k8s-eval/TrendChart";

/* ================================================================== */
/*  Types                                                              */
/* ================================================================== */
interface SingleResult {
  modelId: string;
  content: string;
  latencyMs: number;
  questionId?: string;
  dimension?: string;
  score: {
    total: number;
    breakdown: {
      keywordScore: number;
      keywordHits: string[];
      keywordTotal: number;
      referenceScore: number;
      lengthScore: number;
      structureScore: number;
    };
  };
}

const ALL_DIMS: K8sDimension[] = [
  "core_concepts", "api_objects", "ops_knowledge", "version_timeliness", "config_writing",
  "error_analysis", "alert_handling", "version_upgrade", "best_practices", "terminology",
  "command_parsing", "log_analysis", "change_plan", "troubleshooting", "feature_explanation",
];

/* ================================================================== */
/*  Main Page                                                          */
/* ================================================================== */
export function AgentEvalTrackerPage() {
  // Model selection
  const [selectedModels, setSelectedModels] = useState<string[]>(["qwen", "kimi", "minimax"]);
  const [selectedDims, setSelectedDims] = useState<K8sDimension[]>([...ALL_DIMS]);

  // Pipeline state
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [stageStatus, setStageStatus] = useState<Record<string, PipelineStageStatus>>({});
  const [currentModel, setCurrentModel] = useState<string | null>(null);
  const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);

  // Question selection (2 per dimension)
  const selectedQuestions = selectQuestionsPerDimension(selectedDims, 2);
  const totalCalls = selectedQuestions.length * selectedModels.length;

  // Timeline entries
  const [timelineEntries, setTimelineEntries] = useState<TimelineEntry[]>([]);
  const [completedCount, setCompletedCount] = useState(0);

  // SSE ref
  const eventSourceRef = useRef<EventSource | null>(null);

  // Toggle helpers
  const toggleModel = (id: string) => {
    setSelectedModels((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };
  const toggleDim = (dim: K8sDimension) => {
    setSelectedDims((prev) =>
      prev.includes(dim) ? prev.filter((d) => d !== dim) : [...prev, dim]
    );
  };

  // Build initial timeline entries from selected questions
  const buildInitialEntries = useCallback((questions: K8sTestQuestion[]): TimelineEntry[] => {
    return questions.map((q) => ({
      question: q,
      results: {},
      isActive: false,
    }));
  }, []);

  // Update pipeline stages based on progress
  useEffect(() => {
    setStageStatus(inferPipelineStage(completedCount, totalCalls, isRunning));
  }, [completedCount, totalCalls, isRunning]);

  // Start evaluation
  const startEvaluation = useCallback(async () => {
    setIsRunning(true);
    setIsComplete(false);
    setCompletedCount(0);
    setCurrentModel(null);
    setCurrentQuestionId(null);
    setStartTime(Date.now());

    const entries = buildInitialEntries(selectedQuestions);
    setTimelineEntries(entries);

    // Connect to SSE
    const es = new EventSource(`/api/k8s-eval/stream?runId=latest`);
    eventSourceRef.current = es;

    es.addEventListener("connected", () => {
      console.log("[EvalTracker] SSE connected");
    });

    es.addEventListener("start", (e) => {
      try {
        const data = JSON.parse(e.data);
        setCurrentModel(data.models?.[0] || selectedModels[0]);
      } catch { /* ignore */ }
    });

    es.addEventListener("progress", (e) => {
      try {
        const data = JSON.parse(e.data);
        setCurrentModel(data.model);
        const qId = data.currentQuestion || data.questionId;
        setCurrentQuestionId(qId);

        // Mark question as active
        setTimelineEntries((prev) =>
          prev.map((entry) => ({
            ...entry,
            isActive: entry.question.id === qId,
          }))
        );
      } catch { /* ignore */ }
    });

    es.addEventListener("partial-result", (e) => {
      try {
        const data = JSON.parse(e.data);
        const qId = data.questionId;
        const modelId = data.model;

        const result: SingleResult = {
          modelId,
          content: data.content || "",
          latencyMs: data.latencyMs || 0,
          questionId: qId,
          dimension: data.dimension,
          score: data.score || {
            total: 0,
            breakdown: { keywordScore: 0, keywordHits: [], keywordTotal: 0, referenceScore: 0, lengthScore: 0, structureScore: 0 },
          },
        };

        setTimelineEntries((prev) =>
          prev.map((entry) => {
            if (entry.question.id === qId) {
              return {
                ...entry,
                isActive: false,
                results: { ...entry.results, [modelId]: result },
              };
            }
            return entry;
          })
        );

        setCompletedCount((prev) => prev + 1);
      } catch { /* ignore */ }
    });

    es.addEventListener("complete", async () => {
      // Fetch final results
      try {
        const runsRes = await fetch("/api/k8s-eval/runs?limit=1");
        const runsData = await runsRes.json();
        if (runsData.runs?.[0]) {
          const detailRes = await fetch(`/api/k8s-eval/history/${runsData.runs[0].id}`);
          const detailData = await detailRes.json();
          if (detailData.record?.results) {
            setTimelineEntries((prev) =>
              prev.map((entry) => {
                const updated = { ...entry, isActive: false };
                for (const [modelId, resultList] of Object.entries(detailData.record.results as Record<string, SingleResult[]>)) {
                  const matchResult = (resultList as SingleResult[]).find(
                    (r) => r.questionId === entry.question.id
                  );
                  if (matchResult) {
                    updated.results = { ...updated.results, [modelId]: matchResult };
                  }
                }
                return updated;
              })
            );
            // Update completed count
            let total = 0;
            for (const results of Object.values(detailData.record.results as Record<string, SingleResult[]>)) {
              total += (results as SingleResult[]).length;
            }
            setCompletedCount(total);
          }
        }
      } catch { /* ignore */ }

      setIsRunning(false);
      setIsComplete(true);
      setCurrentModel(null);
      setCurrentQuestionId(null);
      es.close();
    });

    es.addEventListener("error", () => {
      setIsRunning(false);
      es.close();
    });

    // Trigger evaluation
    try {
      await fetch("/api/k8s-eval/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ models: selectedModels }),
      });
    } catch { /* ignore */ }
  }, [selectedModels, selectedQuestions, buildInitialEntries]);

  // Reset
  const resetEvaluation = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }
    setIsRunning(false);
    setIsComplete(false);
    setCompletedCount(0);
    setCurrentModel(null);
    setCurrentQuestionId(null);
    setStartTime(null);
    setTimelineEntries([]);
    setStageStatus({});
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  return (
    <div className="container py-8 space-y-8">
      {/* Hero */}
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20">
            <Zap className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-1.5">
            <h1 className="text-3xl font-bold tracking-tight">
              Agent Eval — 全链路评测
            </h1>
            <p className="text-sm text-muted-foreground font-light tracking-wide">
              提问 → 回答 → 评估 — 端到端可视化追踪 | CAPER 五维模型 | COVR 语料库覆盖度 | LLM-as-Judge
            </p>
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <Card>
        <CardContent className="py-5 space-y-5">
          {/* Model selection */}
          <div>
            <div className="text-[10px] text-muted-foreground/60 uppercase tracking-wider mb-2.5 font-medium">选择模型</div>
            <div className="flex flex-wrap gap-2.5">
              {EVAL_MODELS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => toggleModel(m.id)}
                  disabled={isRunning}
                  className={`inline-flex items-center gap-2.5 rounded-xl border px-4 py-2.5 text-xs font-medium transition-all duration-300 ${
                    selectedModels.includes(m.id)
                      ? "border-primary/30 bg-accent text-foreground shadow-sm"
                      : "border-border bg-background text-muted-foreground hover:text-foreground hover:border-primary/20"
                  } ${isRunning ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: selectedModels.includes(m.id) ? m.color : "hsl(var(--muted-foreground))", opacity: selectedModels.includes(m.id) ? 1 : 0.3 }} />
                  {m.name}
                </button>
              ))}
            </div>
          </div>

          {/* Dimension selection */}
          <div>
            <div className="text-[10px] text-muted-foreground/60 uppercase tracking-wider mb-2.5 font-medium">
              评测维度 ({selectedDims.length}/{ALL_DIMS.length}) · 每维度 2 题 · 共 {selectedQuestions.length} 题
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-8 gap-1.5">
              {ALL_DIMS.map((dim) => {
                const meta = DIMENSION_META[dim];
                const isSelected = selectedDims.includes(dim);
                return (
                  <button
                    key={dim}
                    onClick={() => toggleDim(dim)}
                    disabled={isRunning}
                    className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] font-medium transition-all duration-200 ${
                      isSelected
                        ? "border-primary/30 bg-accent text-foreground"
                        : "border-border bg-background text-muted-foreground/50 hover:text-muted-foreground hover:border-primary/20"
                    } ${isRunning ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: isSelected ? meta.color : "hsl(var(--muted-foreground))", opacity: isSelected ? 1 : 0.2 }} />
                    <span className="truncate">{meta.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 pt-2">
            <Button
              size="lg"
              onClick={startEvaluation}
              disabled={isRunning || selectedModels.length === 0 || selectedDims.length === 0}
              className="bg-primary"
            >
              {isRunning ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Play className="mr-2 h-5 w-5" />
              )}
              {isRunning ? "评测进行中..." : `开始全链路评测 (${selectedQuestions.length} 题 × ${selectedModels.length} 模型)`}
            </Button>
            {(isComplete || timelineEntries.length > 0) && !isRunning && (
              <Button variant="outline" size="sm" onClick={resetEvaluation}>
                <RotateCcw className="mr-1.5 h-4 w-4" />
                重置
              </Button>
            )}
            <div className="ml-auto text-xs text-muted-foreground">
              总计 {totalCalls} 次模型调用
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pipeline Tracker */}
      {(isRunning || isComplete || completedCount > 0) && (
        <EvalPipelineTracker
          stageStatus={stageStatus}
          currentModel={currentModel}
          completedCount={completedCount}
          totalCount={totalCalls}
          startTime={startTime}
        />
      )}

      {/* Evaluation Criteria */}
      <EvalCriteriaPanel />

      {/* QA Timeline */}
      {timelineEntries.length > 0 && (
        <QATimelinePanel
          entries={timelineEntries}
          currentQuestionId={currentQuestionId}
        />
      )}

      {/* Decision Path (show after some results) */}
      {completedCount > 0 && (
        <DecisionPathPanel entries={timelineEntries} />
      )}

      {/* Results Dashboard (show when complete) */}
      {isComplete && (
        <EvalResultsDashboard entries={timelineEntries} />
      )}

      {/* Schedule & Run History (merged from K8s Live) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ScheduleCard />
        <RunHistoryTable />
      </div>

      {/* Score Trends (merged from K8s Live) */}
      <section>
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
          <TrendingUp className="h-4 w-4" /> Score Trends
        </h2>
        <TrendChart selectedModels={selectedModels} />
      </section>

      {/* Methodology footer */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">评估方法论</h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 text-xs text-muted-foreground">
            <div>
              <div className="text-muted-foreground/60 uppercase tracking-wider text-[10px] mb-1.5 font-medium">测试数据</div>
              <p className="leading-relaxed">每维度精选 2 题 (1 基础 + 1 进阶)，15 维度共 30 题</p>
            </div>
            <div>
              <div className="text-muted-foreground/60 uppercase tracking-wider text-[10px] mb-1.5 font-medium">评分框架</div>
              <p className="leading-relaxed">CAPER 五维模型 + COVR 语料覆盖度 + LLM-as-Judge</p>
            </div>
            <div>
              <div className="text-muted-foreground/60 uppercase tracking-wider text-[10px] mb-1.5 font-medium">评分机制</div>
              <p className="leading-relaxed">关键词命中(40%) + 参考相似度(30%) + 长度(15%) + 结构(15%)</p>
            </div>
            <div>
              <div className="text-muted-foreground/60 uppercase tracking-wider text-[10px] mb-1.5 font-medium">执行流程</div>
              <p className="leading-relaxed">准备 → 自动化测评 → 数据分析 → 报告发布 (Cloud Agent Benchmark 2026)</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
