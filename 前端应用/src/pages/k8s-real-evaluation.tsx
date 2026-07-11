/**
 * K8sRealEvaluationPage — Real-time K8s model evaluation with live API calls.
 * Route: /k8s-real-evaluation
 */
import { useState, useCallback, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Play, Loader2, CheckCircle2, XCircle,
  RotateCcw, ChevronDown, ChevronUp, History, Zap,
  Database, MessageSquare, Settings2, Activity, TrendingUp,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { K8sCapabilityMatrix } from "@/components/k8s-eval/K8sCapabilityMatrix";
import { ScheduleCard } from "@/components/k8s-eval/ScheduleCard";
import { TrendChart } from "@/components/k8s-eval/TrendChart";
import { RunHistoryTable } from "@/components/k8s-eval/RunHistoryTable";
import { useEvaluationStream } from "@/hooks/useEvaluationStream";
import { EvaluationVisualizer } from "@/components/k8s-eval/EvaluationVisualizer";
import {
  K8S_TEST_QUESTIONS, DIMENSION_META,
  type K8sDimension, type K8sTestQuestion,
} from "@/data/k8sTestQuestions";

/* ================================================================== */
/*  Types                                                              */
/* ================================================================== */

type ModelId = "qwen" | "kimi" | "minimax";

interface ModelMeta {
  id: ModelId;
  name: string;
  model: string;
  color: string;
}

interface SingleResult {
  modelId: string;
  modelName: string;
  content: string;
  latencyMs: number;
  questionId?: string;
  dimension?: string;
  error?: string;
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

interface BatchSummary {
  modelName: string;
  model: string;
  totalQuestions: number;
  averageScore: number;
  dimensionScores: Record<string, number>;
}

interface HistoryItem {
  id: string;
  timestamp: string;
  type: string;
  models: string[];
  summary: Record<string, BatchSummary>;
}

/* ================================================================== */
/*  Constants                                                          */
/* ================================================================== */

const MODELS: ModelMeta[] = [
  { id: "qwen", name: "Qwen3-Max", model: "qwen-max", color: "#4285F4" },
  { id: "kimi", name: "Kimi K2.5", model: "kimi-k2.5", color: "#34A853" },
  { id: "minimax", name: "MiniMax M2.1", model: "MiniMax-M2.1", color: "#EA4335" },
];

const ALL_DIMS: K8sDimension[] = [
  "core_concepts", "api_objects", "ops_knowledge", "version_timeliness", "config_writing",
  "error_analysis", "alert_handling", "version_upgrade", "best_practices", "terminology",
  "command_parsing", "log_analysis", "change_plan", "troubleshooting", "feature_explanation",
];

/* ================================================================== */
/*  API helpers                                                        */
/* ================================================================== */

async function apiHealth(): Promise<Record<string, boolean>> {
  const r = await fetch("/api/k8s-eval/health");
  const d = await r.json();
  return d.models || {};
}

async function apiEvaluate(modelId: string, question: K8sTestQuestion): Promise<SingleResult> {
  const r = await fetch("/api/k8s-eval/evaluate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ modelId, question }),
  });
  const d = await r.json();
  if (!d.ok) throw new Error(d.error);
  return d.result;
}

async function apiBatch(modelIds: string[], questions: K8sTestQuestion[]): Promise<{
  summary: Record<string, BatchSummary>;
  results: Record<string, SingleResult[]>;
  historyId: string;
}> {
  const r = await fetch("/api/k8s-eval/batch", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ modelIds, questions }),
  });
  const d = await r.json();
  if (!d.ok) throw new Error(d.error);
  return { summary: d.summary, results: d.results, historyId: d.historyId };
}

async function apiHistoryList(): Promise<HistoryItem[]> {
  const r = await fetch("/api/k8s-eval/history");
  const d = await r.json();
  return d.history || [];
}

/* ================================================================== */
/*  Sub-components                                                     */
/* ================================================================== */

function StatusDot({ ok }: { ok: boolean | undefined }) {
  if (ok === undefined) return <span className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30 animate-pulse" />;
  return <span className={`w-2.5 h-2.5 rounded-full ${ok ? "bg-green-500" : "bg-red-500"}`} />;
}

function ScoreRing({ score, size = 56 }: { score: number; size?: number }) {
  const r = (size - 6) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? "#34D399" : score >= 60 ? "#FBBF24" : "#F87171";
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" className="stroke-muted" strokeWidth={3} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={3}
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
          className="transition-all duration-700"
        />
      </svg>
      <span className="absolute text-xs font-bold tabular-nums">{score.toFixed(0)}</span>
    </div>
  );
}

/* ================================================================== */
/*  Main Page                                                          */
/* ================================================================== */

export function K8sRealEvaluationPage() {
  // State
  const [modelStatus, setModelStatus] = useState<Record<string, boolean>>({});
  const [selectedModels, setSelectedModels] = useState<ModelId[]>(["qwen", "kimi", "minimax"]);
  const [selectedDims, setSelectedDims] = useState<K8sDimension[]>([...ALL_DIMS]);
  const [mode, setMode] = useState<"single" | "batch">("batch");

  // Single-test state
  const [selectedQuestion, setSelectedQuestion] = useState<K8sTestQuestion | null>(null);
  const [customQuestion, setCustomQuestion] = useState("");
  const [singleResults, setSingleResults] = useState<SingleResult[]>([]);
  const [singleLoading, setSingleLoading] = useState(false);
  const [vizResults, setVizResults] = useState<Record<string, SingleResult[]>>({});

  // Batch state
  const [batchRunning, setBatchRunning] = useState(false);
  const [batchProgress, setBatchProgress] = useState({ current: 0, total: 0 });
  const [batchSummary, setBatchSummary] = useState<Record<string, BatchSummary> | null>(null);
  const [batchResults, setBatchResults] = useState<Record<string, SingleResult[]> | null>(null);

  // History
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Expanded detail
  const [expandedModel, setExpandedModel] = useState<string | null>(null);

  // Ref for abort
  const abortRef = useRef(false);

  // SSE streaming state
  const [streamingRunId, setStreamingRunId] = useState<string | null>(null);
  const { state: streamState, connect: connectStream, disconnect: disconnectStream } = useEvaluationStream(streamingRunId);

  // Check API health on mount
  useEffect(() => {
    apiHealth().then(setModelStatus).catch(() => {});
    apiHistoryList().then(setHistory).catch(() => {});
  }, []);

  // Cleanup SSE on unmount
  useEffect(() => {
    return () => disconnectStream();
  }, []);

  // Toggle selection helpers
  const toggleModel = (id: ModelId) => {
    setSelectedModels((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };
  const toggleDim = (dim: K8sDimension) => {
    setSelectedDims((prev) =>
      prev.includes(dim) ? prev.filter((d) => d !== dim) : [...prev, dim]
    );
  };

  // ---- Single test ----
  const runSingleTest = useCallback(async () => {
    const q = selectedQuestion;
    if (!q && !customQuestion.trim()) return;
    setSingleLoading(true);
    setSingleResults([]);

    const testQ: K8sTestQuestion = q || {
      id: "custom",
      dimension: "core_concepts",
      difficulty: "medium",
      question: customQuestion,
      referenceAnswer: "",
      keywords: [],
      maxScore: 100,
    };

    const results: SingleResult[] = [];
    for (const mid of selectedModels) {
      try {
        const res = await apiEvaluate(mid, testQ);
        results.push(res);
        setSingleResults([...results]);
      } catch (err: any) {
        results.push({
          modelId: mid, modelName: MODELS.find((m) => m.id === mid)?.name || mid,
          content: `Error: ${err.message}`, latencyMs: 0,
          score: { total: 0, breakdown: { keywordScore: 0, keywordHits: [], keywordTotal: 0, referenceScore: 0, lengthScore: 0, structureScore: 0 } },
        });
        setSingleResults([...results]);
      }
    }
    setSingleLoading(false);
  }, [selectedQuestion, customQuestion, selectedModels]);

  // ---- Batch test ----
  const runBatchTest = useCallback(async () => {
    const questions = K8S_TEST_QUESTIONS.filter((q) => selectedDims.includes(q.dimension));
    if (questions.length === 0 || selectedModels.length === 0) return;

    setBatchRunning(true);
    setBatchSummary(null);
    setBatchResults(null);
    abortRef.current = false;
    setBatchProgress({ current: 0, total: questions.length * selectedModels.length });

    // Start SSE stream
    const runId = `run-${Date.now()}`;
    setStreamingRunId(runId);
    connectStream(runId);

    try {
      // Trigger evaluation
      const triggerRes = await fetch("/api/k8s-eval/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ models: selectedModels }),
      });
      const triggerData = await triggerRes.json();

      // Poll for results while streaming
      const pollInterval = setInterval(async () => {
        if (streamState.completed && streamState.runId) {
          clearInterval(pollInterval);
          try {
            const historyRes = await fetch(`/api/k8s-eval/runs?limit=1`);
            const historyData = await historyRes.json();
            if (historyData.runs?.[0]) {
              const detailRes = await fetch(`/api/k8s-eval/history/${historyData.runs[0].id}`);
              const detailData = await detailRes.json();
              if (detailData.record) {
                // Build summary from detail
                const summary: Record<string, any> = {};
                for (const [modelId, resultList] of Object.entries(detailData.record.results || {})) {
                  const list = resultList as any[];
                  const totalScore = list.reduce((sum: number, r: any) => sum + (r.score?.total || 0), 0);
                  const dimScores: Record<string, { sum: number; count: number }> = {};
                  for (const r of list) {
                    if (!dimScores[r.dimension]) dimScores[r.dimension] = { sum: 0, count: 0 };
                    dimScores[r.dimension].sum += r.score?.total || 0;
                    dimScores[r.dimension].count += 1;
                  }
                  const dimAverages: Record<string, number> = {};
                  for (const [dim, vals] of Object.entries(dimScores)) {
                    dimAverages[dim] = Math.round(((vals as any).sum / (vals as any).count) * 10) / 10;
                  }
                  summary[modelId] = {
                    modelName: MODELS.find(m => m.id === modelId)?.name || modelId,
                    model: MODELS.find(m => m.id === modelId)?.model || modelId,
                    averageScore: Math.round((totalScore / list.length) * 10) / 10,
                    dimensionScores: dimAverages,
                  };
                }
                setBatchSummary(summary);
              }
            }
          } catch {}
          setBatchRunning(false);
          disconnectStream();
        }
      }, 1000);

      // Timeout after 10 minutes
      setTimeout(() => {
        clearInterval(pollInterval);
        setBatchRunning(false);
        disconnectStream();
      }, 600000);

    } catch (err: any) {
      console.error("Batch error:", err);
      setBatchRunning(false);
      disconnectStream();
    }
  }, [selectedModels, selectedDims, connectStream, disconnectStream, streamState.completed, streamState.runId]);

  // Filtered questions for display
  const filteredQuestions = K8S_TEST_QUESTIONS.filter((q) => selectedDims.includes(q.dimension));

  return (
    <div className="container py-8 space-y-10">
      {/* ---- Nav ---- */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/arena?tab=k8s"><ArrowLeft className="mr-1.5 h-3.5 w-3.5" />K8s 评测</Link>
        </Button>
        <span className="text-muted-foreground/30">·</span>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/">首页</Link>
        </Button>
      </div>

      {/* ---- Hero ---- */}
      <div className="space-y-5">
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20">
            <Zap className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-1.5">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              K8s Real-time Model Evaluation
            </h1>
            <p className="text-sm text-muted-foreground font-light tracking-wide">
              连接真实模型 API — 15 维度 Kubernetes 语料库覆盖度与问答能力实时评测
            </p>
          </div>
        </div>

        {/* Model status cards */}
        <div className="flex flex-wrap items-center gap-3">
          {MODELS.map((m) => (
            <div
              key={m.id}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border bg-card hover:bg-accent transition-all duration-300"
            >
              <StatusDot ok={modelStatus[m.id]} />
              <span className="text-xs font-medium text-muted-foreground">{m.name}</span>
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: m.color, opacity: 0.7 }} />
            </div>
          ))}
        </div>

        {/* Streaming progress */}
        {batchRunning && streamState.progress && (
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="py-3">
              <div className="flex items-center gap-3">
                <Activity className="h-4 w-4 text-primary animate-pulse" />
                <span className="text-sm">
                  Running: <span className="font-medium">{streamState.progress.model}</span> -
                  Question {streamState.progress.currentQuestion} ({streamState.progress.current}/{streamState.progress.total})
                </span>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${streamState.progress.percent}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">{streamState.progress.percent}%</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* ---- Schedule Card + Run History ---- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ScheduleCard />
        <RunHistoryTable />
      </div>

      {/* ---- Control Panel ---- */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xs text-muted-foreground flex items-center gap-2 uppercase tracking-widest font-semibold">
            <Settings2 className="h-3.5 w-3.5" /> 评测控制面板
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Model selection */}
          <div>
            <div className="text-[10px] text-muted-foreground/60 uppercase tracking-wider mb-2.5 font-medium">选择模型</div>
            <div className="flex flex-wrap gap-2.5">
              {MODELS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => toggleModel(m.id)}
                  className={`inline-flex items-center gap-2.5 rounded-xl border px-4 py-2.5 text-xs font-medium transition-all duration-300 ${
                    selectedModels.includes(m.id)
                      ? "border-primary/30 bg-accent text-foreground shadow-sm"
                      : "border-border bg-background text-muted-foreground hover:text-foreground hover:border-primary/20 hover:bg-accent/50"
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full transition-all" style={{ backgroundColor: selectedModels.includes(m.id) ? m.color : "hsl(var(--muted-foreground))", opacity: selectedModels.includes(m.id) ? 1 : 0.3 }} />
                  {m.name}
                </button>
              ))}
            </div>
          </div>

          {/* Dimension selection — compact grid */}
          <div>
            <div className="text-[10px] text-muted-foreground/60 uppercase tracking-wider mb-2.5 font-medium">评测维度 · {selectedDims.length}/{ALL_DIMS.length}</div>
            <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-8 gap-1.5">
              {ALL_DIMS.map((dim) => {
                const meta = DIMENSION_META[dim];
                const isSelected = selectedDims.includes(dim);
                return (
                  <button
                    key={dim}
                    onClick={() => toggleDim(dim)}
                    className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] font-medium transition-all duration-200 ${
                      isSelected
                        ? "border-primary/30 bg-accent text-foreground"
                        : "border-border bg-background text-muted-foreground/50 hover:text-muted-foreground hover:border-primary/20"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: isSelected ? meta.color : "hsl(var(--muted-foreground))", opacity: isSelected ? 1 : 0.2 }} />
                    <span className="truncate">{meta.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mode + Action */}
          <div className="flex items-center gap-4 pt-2">
            <div className="flex rounded-lg border overflow-hidden">
              <button
                onClick={() => setMode("single")}
                className={`px-4 py-2 text-xs font-medium transition-colors ${mode === "single" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                单题测试
              </button>
              <button
                onClick={() => setMode("batch")}
                className={`px-4 py-2 text-xs font-medium transition-colors ${mode === "batch" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                批量评测
              </button>
              <button
                onClick={() => setMode("visualize")}
                className={`px-4 py-2 text-xs font-medium transition-colors ${mode === "visualize" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                可视化
              </button>
            </div>

            {mode === "batch" && (
              <Button
                size="sm"
                onClick={runBatchTest}
                disabled={batchRunning || selectedModels.length === 0}
              >
                {batchRunning ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Play className="mr-1 h-4 w-4" />}
                {batchRunning ? "评测中..." : `开始评测 (${filteredQuestions.length} 题 × ${selectedModels.length} 模型)`}
              </Button>
            )}

            <Button variant="ghost" size="sm" className="ml-auto" onClick={() => setShowHistory(!showHistory)}>
              <History className="mr-1 h-4 w-4" />
              历史记录 ({history.length})
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ---- Single Test Panel ---- */}
      {mode === "single" && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <MessageSquare className="h-4 w-4" /> 单题测试
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Question selector */}
            <div>
              <select
                className="w-full rounded-lg border bg-background text-foreground text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
                value={selectedQuestion?.id || ""}
                onChange={(e) => {
                  const q = K8S_TEST_QUESTIONS.find((q) => q.id === e.target.value);
                  setSelectedQuestion(q || null);
                  if (q) setCustomQuestion("");
                }}
              >
                <option value="">-- 选择预设题目或在下方自定义 --</option>
                {filteredQuestions.map((q) => (
                  <option key={q.id} value={q.id}>
                    [{DIMENSION_META[q.dimension].label}] {q.question.slice(0, 60)}...
                  </option>
                ))}
              </select>
            </div>

            <div className="text-[10px] text-muted-foreground/50 text-center">— 或自定义问题 —</div>

            <textarea
              className="w-full rounded-lg border bg-background text-foreground text-sm px-3 py-2 h-20 resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="输入自定义 K8s 相关问题..."
              value={customQuestion}
              onChange={(e) => { setCustomQuestion(e.target.value); setSelectedQuestion(null); }}
            />

            <Button
              size="sm"
              onClick={runSingleTest}
              disabled={singleLoading || (!selectedQuestion && !customQuestion.trim())}
            >
              {singleLoading ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Play className="mr-1 h-4 w-4" />}
              发送测试
            </Button>

            {/* Results */}
            {singleResults.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {singleResults.map((res) => {
                  const model = MODELS.find((m) => m.id === res.modelId);
                  return (
                    <Card key={res.modelId} className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: model?.color }} />
                          <span className="text-sm font-medium">{res.modelName}</span>
                        </div>
                        <ScoreRing score={res.score.total} size={44} />
                      </div>
                      <div className="text-xs text-muted-foreground">
                        延迟: {res.latencyMs}ms | 关键词命中: {res.score.breakdown.keywordHits?.length}/{res.score.breakdown.keywordTotal}
                      </div>
                      <div className="max-h-48 overflow-y-auto text-xs text-muted-foreground whitespace-pre-wrap border-t pt-2">
                        {res.content}
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* ---- Visualization Panel ---- */}
      {mode === "visualize" && (
        <EvaluationVisualizer
          selectedModels={selectedModels}
          selectedDims={selectedDims}
          onComplete={(results) => setVizResults(results)}
        />
      )}

      {/* ---- Visualization Results Detail ---- */}
      {mode === "visualize" && Object.keys(vizResults).length > 0 && !batchRunning && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <BarChart3 className="h-4 w-4" /> 评测结果详情
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(vizResults).map(([modelId, results]) => {
                const model = MODELS.find((m) => m.id === modelId);
                const scores = results.map((r) => r.score?.total || 0).filter((s) => s > 0);
                const avg = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;

                return (
                  <Card key={modelId} className="border-2" style={{ borderColor: model?.color || "#888" }}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: model?.color }} />
                        <CardTitle className="text-sm">{model?.name || modelId}</CardTitle>
                        <span className="ml-auto text-lg font-bold" style={{ color: model?.color }}>
                          {avg.toFixed(1)}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2 max-h-60 overflow-y-auto">
                      {results.map((result, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs py-1 border-b border-muted last:border-0">
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: result.score?.total >= 60 ? "green" : result.score?.total > 0 ? "orange" : "gray" }} />
                          <span className="flex-1 truncate text-muted-foreground">{result.questionId}</span>
                          <span className="font-medium tabular-nums">{result.score?.total || "-"}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ---- Batch Results ---- */}
      {mode === "batch" && batchRunning && (
        <Card>
          <CardContent className="py-12 flex flex-col items-center gap-4">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
            <p className="text-muted-foreground text-sm">正在调用真实模型 API 进行评测...</p>
            <p className="text-muted-foreground/60 text-xs">请耐心等待，批量评测可能需要数分钟</p>
          </CardContent>
        </Card>
      )}

      {mode === "batch" && batchSummary && !batchRunning && (
        <>
          {/* Summary ranking cards */}
          <section>
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-5">综合排名</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(batchSummary)
                .sort(([, a], [, b]) => b.averageScore - a.averageScore)
                .map(([modelId, sum], idx) => {
                  const model = MODELS.find((m) => m.id === modelId);
                  const medals = ["🥇", "🥈", "🥉"];
                  const grade = sum.averageScore >= 85 ? "A" : sum.averageScore >= 70 ? "B" : sum.averageScore >= 55 ? "C" : "D";
                  return (
                    <Card
                      key={modelId}
                      className="group relative overflow-hidden transition-all duration-500 hover:shadow-lg hover:-translate-y-0.5"
                    >
                      {/* Top gradient accent */}
                      <div className="absolute top-0 left-0 right-0 h-1" style={{ background: `linear-gradient(90deg, ${model?.color}60, transparent)` }} />
                      <CardContent className="pt-6">
                        <div className="absolute -top-1 -left-1 text-2xl">{medals[idx]}</div>
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="text-lg font-bold group-hover:text-primary transition-colors">{sum.modelName}</div>
                            <div className="text-[11px] text-muted-foreground font-mono">{sum.model}</div>
                          </div>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-md border ${
                            grade === "A" ? "text-emerald-600 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/40 border-emerald-200 dark:border-emerald-700/50" :
                            grade === "B" ? "text-sky-600 dark:text-sky-300 bg-sky-100 dark:bg-sky-900/40 border-sky-200 dark:border-sky-700/50" :
                            "text-orange-600 dark:text-orange-300 bg-orange-100 dark:bg-orange-900/40 border-orange-200 dark:border-orange-700/50"
                          }`}>
                            {grade}
                          </span>
                        </div>
                        <div className="text-4xl font-black tabular-nums mb-3" style={{ color: model?.color }}>
                          {sum.averageScore.toFixed(1)}
                        </div>
                        <div className="space-y-1">
                          {Object.entries(sum.dimensionScores).map(([dim, score]) => (
                            <div key={dim} className="flex items-center gap-2">
                              <span className="w-16 text-[10px] text-muted-foreground truncate">{DIMENSION_META[dim as K8sDimension]?.label}</span>
                              <div className="flex-1 h-1.5 rounded-full bg-muted">
                                <div className="h-full rounded-full transition-all" style={{ width: `${score}%`, backgroundColor: model?.color, opacity: 0.7 }} />
                              </div>
                              <span className="w-8 text-right text-[10px] text-muted-foreground tabular-nums">{score.toFixed(0)}</span>
                            </div>
                          ))}
                        </div>

                        {/* Expand detail */}
                        <button
                          onClick={() => setExpandedModel(expandedModel === modelId ? null : modelId)}
                          className="mt-3 w-full flex items-center justify-center gap-1 text-[10px] text-muted-foreground/60 hover:text-muted-foreground"
                        >
                          {expandedModel === modelId ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                          {expandedModel === modelId ? "收起" : "展开详细结果"}
                        </button>

                        {expandedModel === modelId && batchResults?.[modelId] && (
                          <div className="mt-3 border-t pt-3 space-y-2 max-h-80 overflow-y-auto">
                            {batchResults[modelId].map((r, i) => (
                              <div key={i} className="flex items-center gap-2 text-[10px]">
                                <span className={`w-1.5 h-1.5 rounded-full ${r.score.total >= 70 ? "bg-green-500" : r.score.total >= 40 ? "bg-yellow-500" : "bg-red-500"}`} />
                                <span className="flex-1 text-muted-foreground truncate">{K8S_TEST_QUESTIONS.find((q) => q.id === r.questionId)?.question.slice(0, 40) || r.questionId}</span>
                                <span className="tabular-nums font-medium">{r.score.total}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
            </div>
          </section>

          {/* 15-Dimension Capability Matrix */}
          <section>
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">Kubernetes 能力矩阵 — {selectedDims.length} 维度对比</h2>
            <Card className="flex justify-center p-6 bg-[#FAF6F0] dark:bg-[#FAF6F0]">
              <K8sCapabilityMatrix
                dimensions={selectedDims.map((d) => ({ label: DIMENSION_META[d].label, icon: DIMENSION_META[d].icon }))}
                models={Object.entries(batchSummary).map(([modelId, sum]) => {
                  const model = MODELS.find((m) => m.id === modelId);
                  return {
                    name: sum.modelName,
                    color: model?.color || "#888",
                    scores: selectedDims.map((dim) => sum.dimensionScores[dim] || 0),
                  };
                })}
                size={640}
              />
            </Card>
          </section>

          {/* Dimension bar comparison */}
          <section>
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-5">维度详细对比</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
              {selectedDims.map((dim) => {
                const meta = DIMENSION_META[dim];
                const entries = Object.entries(batchSummary).sort(([, a], [, b]) => (b.dimensionScores[dim] || 0) - (a.dimensionScores[dim] || 0));
                return (
                  <Card key={dim} className="p-3.5 transition-all duration-300 hover:shadow-md">
                    <div className="flex items-center gap-1.5 mb-2.5">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: meta.color }} />
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{meta.label}</span>
                    </div>
                    <div className="space-y-2">
                      {entries.map(([modelId, sum]) => {
                        const score = sum.dimensionScores[dim] || 0;
                        const model = MODELS.find((m) => m.id === modelId);
                        return (
                          <div key={modelId} className="flex items-center gap-2">
                            <span className="w-14 text-[10px] text-muted-foreground truncate">{sum.modelName.split(" ")[0]}</span>
                            <div className="flex-1 h-4 rounded bg-muted overflow-hidden">
                              <div
                                className="h-full rounded transition-all duration-500"
                                style={{ width: `${score}%`, backgroundColor: model?.color, opacity: 0.7 }}
                              />
                            </div>
                            <span className="w-8 text-right text-xs font-bold tabular-nums">{score.toFixed(0)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                );
              })}
            </div>
          </section>
        </>
      )}

      {/* ---- History Panel ---- */}
      {showHistory && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <History className="h-4 w-4" /> 测试历史
            </CardTitle>
          </CardHeader>
          <CardContent>
            {history.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">暂无历史记录</p>
            ) : (
              <div className="space-y-2">
                {history.slice(0, 10).map((item) => (
                  <div key={item.id} className="flex items-center gap-3 rounded-lg border bg-muted/30 px-4 py-2">
                    <span className="text-xs text-muted-foreground tabular-nums">{new Date(item.timestamp).toLocaleString("zh-CN")}</span>
                    <span className="text-xs text-muted-foreground">{item.type}</span>
                    <span className="text-xs text-muted-foreground/70">{item.models?.join(", ")}</span>
                    <div className="ml-auto flex gap-2">
                      {item.summary && Object.entries(item.summary).map(([mid, sum]) => (
                        <span key={mid} className="text-xs font-bold tabular-nums" style={{ color: MODELS.find((m) => m.id === mid)?.color }}>
                          {(sum as BatchSummary).averageScore?.toFixed(1)}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* ---- Trends Section ---- */}
      <section>
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
          <TrendingUp className="h-4 w-4" /> Score Trends
        </h2>
        <TrendChart selectedModels={selectedModels} />
      </section>

      {/* ---- Methodology ---- */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">评估方法</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-muted-foreground">
            <div>
              <div className="text-muted-foreground/60 uppercase tracking-wider text-[10px] mb-1.5 font-medium">测试数据</div>
              <p className="leading-relaxed">80 道 K8s 专项题目，15 维度（核心概念/API对象/运维知识/版本时效/配置编写/报错分析/告警处理/版本升级/最佳实践/名词解释/命令解析/日志分析/变更方案/排查方案/功能说明）</p>
            </div>
            <div>
              <div className="text-muted-foreground/60 uppercase tracking-wider text-[10px] mb-1">评分机制</div>
              <p>关键词命中率(40%) + 参考答案相似度(30%) + 答案长度合理性(15%) + 结构完整性(15%)</p>
            </div>
            <div>
              <div className="text-muted-foreground/60 uppercase tracking-wider text-[10px] mb-1">模型 API</div>
              <p>Qwen3-Max (DashScope) / Kimi K2.5 (Moonshot) / MiniMax M2.1 — 实时调用，temperature=0.3</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center text-xs text-muted-foreground pb-4">
        <Link to="/arena?tab=k8s" className="hover:text-foreground transition-colors">
          ← 返回 K8s 模拟评测结果
        </Link>
      </div>
    </div>
  );
}
