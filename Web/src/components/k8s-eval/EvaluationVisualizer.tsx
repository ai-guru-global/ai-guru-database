import { useState, useEffect, useRef } from "react";
import { Play, Loader2, CheckCircle2, XCircle, Clock, Zap, ChevronDown, ChevronUp, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DIMENSION_META, type K8sDimension, K8S_TEST_QUESTIONS } from "@/data/k8sTestQuestions";

interface SingleResult {
  modelId: string;
  modelName: string;
  content: string;
  latencyMs: number;
  questionId?: string;
  dimension?: string;
  question?: string;
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

interface ModelProgress {
  modelId: string;
  modelName: string;
  color: string;
  currentQuestion: number;
  totalQuestions: number;
  completedQuestions: SingleResult[];
  averageScore: number;
  dimensionScores: Record<string, number[]>;
  isActive: boolean;
}

interface EvaluationVisualizerProps {
  selectedModels: string[];
  selectedDims: K8sDimension[];
  onComplete?: (results: Record<string, SingleResult[]>) => void;
}

const MODEL_COLORS: Record<string, string> = {
  qwen: "#FF6A00",
  kimi: "#6366F1",
  minimax: "#10B981",
};

const MODEL_NAMES: Record<string, string> = {
  qwen: "Qwen3-Max",
  kimi: "Kimi K2.5",
  minimax: "MiniMax M2.1",
};

export function EvaluationVisualizer({
  selectedModels,
  selectedDims,
  onComplete,
}: EvaluationVisualizerProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [modelProgress, setModelProgress] = useState<Record<string, ModelProgress>>({});
  const [currentModel, setCurrentModel] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<{ id: string; question: string; dimension: string; keywords: string[] } | null>(null);
  const [currentAnswer, setCurrentAnswer] = useState<string>("");
  const [currentScore, setCurrentScore] = useState<SingleResult["score"] | null>(null);
  const [isAnswering, setIsAnswering] = useState(false);
  const [expandedModels, setExpandedModels] = useState<Set<string>>(new Set());
  const eventSourceRef = useRef<EventSource | null>(null);

  // Get questions for selected dimensions
  const questions = K8S_TEST_QUESTIONS.filter(q => selectedDims.includes(q.dimension));

  // Initialize progress for selected models
  useEffect(() => {
    const progress: Record<string, ModelProgress> = {};
    for (const modelId of selectedModels) {
      progress[modelId] = {
        modelId,
        modelName: MODEL_NAMES[modelId] || modelId,
        color: MODEL_COLORS[modelId] || "#888",
        currentQuestion: 0,
        totalQuestions: questions.length,
        completedQuestions: [],
        averageScore: 0,
        dimensionScores: {},
        isActive: false,
      };
    }
    setModelProgress(progress);
  }, [selectedModels, selectedDims]);

  const toggleExpanded = (modelId: string) => {
    setExpandedModels(prev => {
      const next = new Set(prev);
      if (next.has(modelId)) next.delete(modelId);
      else next.add(modelId);
      return next;
    });
  };

  // Start evaluation
  const startEvaluation = async () => {
    setIsRunning(true);

    // Reset progress
    const progress: Record<string, ModelProgress> = {};
    for (const modelId of selectedModels) {
      progress[modelId] = {
        modelId,
        modelName: MODEL_NAMES[modelId] || modelId,
        color: MODEL_COLORS[modelId] || "#888",
        currentQuestion: 0,
        totalQuestions: questions.length,
        completedQuestions: [],
        averageScore: 0,
        dimensionScores: {},
        isActive: true,
      };
    }
    setModelProgress(progress);

    // Connect to SSE - use 'latest' to match triggerEvaluation's broadcast
    const es = new EventSource(`/api/k8s-eval/stream?runId=latest`);
    eventSourceRef.current = es;

    es.addEventListener("connected", () => {
      console.log("SSE connected");
    });

    es.addEventListener("start", (e) => {
      try {
        const data = JSON.parse(e.data);
        setCurrentModel(data.models?.[0] || selectedModels[0]);
      } catch {}
    });

    es.addEventListener("progress", (e) => {
      try {
        const data = JSON.parse(e.data);
        setCurrentModel(data.model);
        setIsAnswering(true);
        setCurrentAnswer("");
        setCurrentScore(null);
        // Use question data directly from SSE event
        if (data.question) {
          setCurrentQuestion({
            id: data.currentQuestion,
            question: data.question,
            dimension: data.dimension,
            keywords: data.keywords || []
          });
        }
        setModelProgress(prev => {
          const updated = { ...prev };
          if (updated[data.model]) {
            updated[data.model] = {
              ...updated[data.model],
              currentQuestion: data.current,
              isActive: true,
            };
          }
          return updated;
        });
      } catch {}
    });

    es.addEventListener("partial-result", (e) => {
      try {
        const data = JSON.parse(e.data);
        // Update live content for display
        setCurrentAnswer(data.content || "");
        setCurrentScore(data.score || null);
        setIsAnswering(false);
        // Update model progress with completed question
        setModelProgress(prev => {
          const updated = { ...prev };
          if (updated[data.model]) {
            const progress = updated[data.model];
            const existingIndex = progress.completedQuestions.findIndex(
              r => r.questionId === data.questionId
            );
            const newResult: SingleResult = {
              modelId: data.model,
              modelName: MODEL_NAMES[data.model] || data.model,
              content: data.content || "",
              latencyMs: data.latencyMs || 0,
              questionId: data.questionId,
              dimension: data.dimension,
              score: data.score || { total: 0, breakdown: { keywordScore: 0, keywordHits: [], keywordTotal: 0, referenceScore: 0, lengthScore: 0, structureScore: 0 } },
            };
            if (existingIndex < 0) {
              progress.completedQuestions = [...progress.completedQuestions, newResult];
              progress.currentQuestion = progress.completedQuestions.length;
            }
            // Update average score
            const scores = progress.completedQuestions
              .filter(r => r.score?.total > 0)
              .map(r => r.score.total);
            if (scores.length > 0) {
              progress.averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
            }
          }
          return updated;
        });
      } catch {}
    });

    es.addEventListener("complete", async (e) => {
      try {
        const data = JSON.parse(e.data);
        // Fetch results
        const runsRes = await fetch("/api/k8s-eval/runs?limit=1");
        const runsData = await runsRes.json();
        if (runsData.runs?.[0]) {
          const detailRes = await fetch(`/api/k8s-eval/history/${runsData.runs[0].id}`);
          const detailData = await detailRes.json();
          if (detailData.record?.results) {
            setModelProgress(prev => {
              const updated = { ...prev };
              for (const [modelId, results] of Object.entries(detailData.record.results as Record<string, SingleResult[]>) as [string, SingleResult[]][]) {
                if (updated[modelId]) {
                  const validResults = results.filter(r => r.score?.total > 0);
                  const scores = validResults.map(r => r.score?.total || 0);
                  const avg = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
                  updated[modelId] = {
                    ...updated[modelId],
                    completedQuestions: validResults,
                    averageScore: avg,
                    currentQuestion: validResults.length,
                    isActive: false,
                  };
                }
              }
              return updated;
            });
            onComplete?.(detailData.record.results);
          }
        }
      } catch {}
      setIsRunning(false);
      setCurrentModel(null);
      setCurrentQuestion(null);
      setCurrentAnswer("");
      setCurrentScore(null);
      setIsAnswering(false);
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
    } catch {}
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
    <div className="space-y-6">
      {/* Control */}
      <Card className="border-primary/30">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                onClick={startEvaluation}
                disabled={isRunning || selectedModels.length === 0}
                size="lg"
                className="bg-primary"
              >
                {isRunning ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Play className="mr-2 h-5 w-5" />
                )}
                {isRunning ? "评测进行中..." : "开始可视化评测"}
              </Button>
              {isRunning && currentModel && (
                <span className="flex items-center gap-2 text-sm animate-pulse">
                  <Zap className="h-4 w-4 text-primary" />
                  <span className="font-medium">{MODEL_NAMES[currentModel] || currentModel}</span>
                  <span className="text-muted-foreground">回答中...</span>
                </span>
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              {selectedModels.length} 模型 × {questions.length} 题
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Q&A Panel */}
      {isRunning && currentModel && currentQuestion && (
        <Card className="border-primary/50 bg-primary/5">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">实时问答过程</CardTitle>
              <span
                className="ml-auto w-3 h-3 rounded-full animate-pulse"
                style={{ backgroundColor: MODEL_COLORS[currentModel] }}
              />
              <span className="text-sm font-medium">{MODEL_NAMES[currentModel]}</span>
              <span className="text-xs text-muted-foreground">
                ({modelProgress[currentModel]?.currentQuestion || 0}/{modelProgress[currentModel]?.totalQuestions || questions.length})
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Question */}
            <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <div className="text-xs text-muted-foreground">问题</div>
                {isAnswering && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
              </div>
              <div className="text-sm font-medium">
                {currentQuestion.question}
              </div>
            </div>

            {/* Answer streaming */}
            <div className="bg-muted/50 rounded-lg p-4 border border-muted">
              <div className="flex items-center gap-2 mb-2">
                <div className="text-xs text-muted-foreground">回答</div>
                {isAnswering && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
                {currentScore && (
                  <span className="ml-auto text-sm font-bold" style={{
                    color: currentScore.total >= 60 ? "#22c55e" : currentScore.total > 0 ? "#f97316" : "#888"
                  }}>
                    得分: {currentScore.total}
                  </span>
                )}
              </div>
              <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                {currentAnswer || (isAnswering ? "模型正在生成回答..." : "-")}
              </div>
            </div>

            {/* Score breakdown */}
            {currentScore && currentScore.breakdown && (
              <div className="bg-muted/30 rounded-lg p-3 border border-muted">
                <div className="text-xs text-muted-foreground mb-2">评分明细</div>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-card rounded p-2 border">
                    <div className="text-[10px] text-muted-foreground">关键词</div>
                    <div className="font-bold text-green-600">{currentScore.breakdown.keywordScore}</div>
                    <div className="text-[9px] text-muted-foreground">/{currentScore.breakdown.keywordTotal} 命中</div>
                  </div>
                  <div className="bg-card rounded p-2 border">
                    <div className="text-[10px] text-muted-foreground">参考相似</div>
                    <div className="font-bold text-blue-600">{currentScore.breakdown.referenceScore}</div>
                  </div>
                  <div className="bg-card rounded p-2 border">
                    <div className="text-[10px] text-muted-foreground">长度</div>
                    <div className="font-bold text-orange-600">{currentScore.breakdown.lengthScore}</div>
                  </div>
                  <div className="bg-card rounded p-2 border">
                    <div className="text-[10px] text-muted-foreground">结构</div>
                    <div className="font-bold text-purple-600">{currentScore.breakdown.structureScore}</div>
                  </div>
                </div>
                {currentScore.breakdown.keywordHits && currentScore.breakdown.keywordHits.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    <span className="text-xs text-muted-foreground">命中:</span>
                    {currentScore.breakdown.keywordHits.map((kw, i) => (
                      <span key={i} className="text-xs px-1.5 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 rounded">
                        {kw}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Reference keywords */}
            <div className="bg-muted/30 rounded-lg p-3 border border-muted">
              <div className="text-xs text-muted-foreground mb-2">参考关键词</div>
              <div className="flex flex-wrap gap-1">
                {currentQuestion.keywords?.map((kw, i) => (
                  <span key={i} className="text-xs px-2 py-0.5 bg-primary/10 rounded border border-primary/20">
                    {kw}
                  </span>
                )) || []}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Model Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {selectedModels.map((modelId) => {
          const progress = modelProgress[modelId];
          if (!progress) return null;

          const pct = progress.totalQuestions > 0
            ? Math.round((progress.currentQuestion / progress.totalQuestions) * 100)
            : 0;
          const isExpanded = expandedModels.has(modelId);

          return (
            <Card key={modelId} className="overflow-hidden">
              <CardHeader className="pb-2 cursor-pointer" onClick={() => toggleExpanded(modelId)}>
                <div className="flex items-center gap-2">
                  <span
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: progress.color }}
                  />
                  <CardTitle className="text-sm flex-1">{progress.modelName}</CardTitle>
                  {progress.isActive && (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                  {progress.completedQuestions.length > 0 && !progress.isActive && (
                    <span className="text-lg font-bold" style={{ color: progress.color }}>
                      {progress.averageScore.toFixed(1)}
                    </span>
                  )}
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                {/* Progress bar */}
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>进度</span>
                    <span>{progress.currentQuestion}/{progress.totalQuestions}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: progress.color,
                      }}
                    />
                  </div>
                </div>
              </CardHeader>

              {/* Expanded Q&A details */}
              {isExpanded && (
                <CardContent className="border-t max-h-96 overflow-y-auto">
                  <div className="space-y-3 pt-3">
                    {progress.completedQuestions.map((result, i) => (
                      <QARow key={i} result={result} />
                    ))}
                    {progress.isActive && (
                      <div className="text-xs text-muted-foreground animate-pulse py-2">
                        等待下一题...
                      </div>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* Live Radar Chart */}
      {Object.values(modelProgress).some(p => p.completedQuestions.length > 0) && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">实时能力矩阵</CardTitle>
          </CardHeader>
          <CardContent>
            <LiveRadarChart modelProgress={modelProgress} selectedDims={selectedDims} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

/* Q&A Row Component */
function QARow({ result }: { result: SingleResult }) {
  const [expanded, setExpanded] = useState(false);
  const meta = result.dimension ? DIMENSION_META[result.dimension as K8sDimension] : null;

  return (
    <div className="border rounded-lg overflow-hidden bg-card">
      <div
        className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-accent/50"
        onClick={() => setExpanded(!expanded)}
      >
        {result.score?.total >= 60 ? (
          <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
        ) : result.score?.total > 0 ? (
          <XCircle className="h-4 w-4 text-orange-500 flex-shrink-0" />
        ) : (
          <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        )}
        <span className="text-xs font-medium flex-1 truncate">{result.questionId}</span>
        {meta && (
          <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
            {meta.label}
          </span>
        )}
        <span className="text-sm font-bold" style={{
          color: result.score?.total >= 60 ? "#22c55e" : result.score?.total > 0 ? "#f97316" : "#888"
        }}>
          {result.score?.total || "-"}
        </span>
        {expanded ? (
          <ChevronUp className="h-3 w-3 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        )}
      </div>

      {expanded && (
        <div className="px-3 py-2 border-t bg-muted/30 space-y-2 text-xs">
          {/* Score breakdown */}
          <div className="grid grid-cols-4 gap-2 mb-2">
            <ScoreBadge label="关键词" score={result.score?.breakdown?.keywordScore} total={100} />
            <ScoreBadge label="参考相似" score={result.score?.breakdown?.referenceScore} total={100} />
            <ScoreBadge label="长度" score={result.score?.breakdown?.lengthScore} total={100} />
            <ScoreBadge label="结构" score={result.score?.breakdown?.structureScore} total={100} />
          </div>

          {/* Keywords hit */}
          {result.score?.breakdown?.keywordHits?.length > 0 && (
            <div className="flex flex-wrap gap-1">
              <span className="text-muted-foreground">命中:</span>
              {result.score.breakdown.keywordHits.map((kw, i) => (
                <span key={i} className="px-1 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 rounded">
                  {kw}
                </span>
              ))}
            </div>
          )}

          {/* Answer preview */}
          <div className="mt-2">
            <div className="text-muted-foreground mb-1">回答预览:</div>
            <div className="text-muted-foreground whitespace-pre-wrap line-clamp-3">
              {result.content?.slice(0, 200)}
              {result.content?.length > 200 && "..."}
            </div>
          </div>

          {/* Latency */}
          <div className="text-muted-foreground">
            延迟: {result.latencyMs}ms
          </div>
        </div>
      )}
    </div>
  );
}

function ScoreBadge({ label, score, total }: { label: string; score?: number; total: number }) {
  const pct = (score || 0) / total;
  const color = pct >= 0.6 ? "green" : pct >= 0.4 ? "orange" : "red";
  return (
    <div className="text-center">
      <div className="text-[10px] text-muted-foreground">{label}</div>
      <div className={`font-bold text-${color}`}>{score || 0}</div>
    </div>
  );
}

/* Live Radar Chart */
function LiveRadarChart({
  modelProgress,
  selectedDims,
}: {
  modelProgress: Record<string, ModelProgress>;
  selectedDims: string[];
}) {
  const size = 400;
  const center = size / 2;
  const maxRadius = size / 2 - 60;

  // Aggregate dimension scores
  const dimensionScores: Record<string, Record<string, number[]>> = {};
  for (const [modelId, progress] of Object.entries(modelProgress)) {
    dimensionScores[modelId] = {};
    for (const result of progress.completedQuestions) {
      if (result.dimension && result.score?.total > 0) {
        if (!dimensionScores[modelId][result.dimension]) {
          dimensionScores[modelId][result.dimension] = [];
        }
        dimensionScores[modelId][result.dimension].push(result.score.total);
      }
    }
  }

  // Calculate averages
  const avgScores: Record<string, Record<string, number>> = {};
  for (const [modelId, scores] of Object.entries(dimensionScores)) {
    avgScores[modelId] = {};
    for (const [dim, scoreList] of Object.entries(scores)) {
      if (scoreList.length > 0) {
        avgScores[modelId][dim] = scoreList.reduce((a, b) => a + b, 0) / scoreList.length;
      }
    }
  }

  const dims = selectedDims.slice(0, 8);
  const numDims = dims.length;
  const angleStep = (2 * Math.PI) / numDims;

  const getPoints = (modelId: string) => {
    const scores = avgScores[modelId] || {};
    return dims.map((dim, i) => {
      const score = scores[dim] || 0;
      const radius = (score / 100) * maxRadius;
      const angle = i * angleStep - Math.PI / 2;
      return { x: center + radius * Math.cos(angle), y: center + radius * Math.sin(angle), score };
    });
  };

  const rings = [25, 50, 75, 100];

  return (
    <div className="flex justify-center">
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-md">
        {rings.map(ring => (
          <circle
            key={ring}
            cx={center}
            cy={center}
            r={(ring / 100) * maxRadius}
            fill="none"
            stroke="hsl(var(--border))"
            strokeDasharray="4,4"
          />
        ))}

        {dims.map((dim, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const x2 = center + maxRadius * Math.cos(angle);
          const y2 = center + maxRadius * Math.sin(angle);
          return (
            <line key={dim} x1={center} y1={center} x2={x2} y2={y2} stroke="hsl(var(--border))" strokeWidth="1" />
          );
        })}

        {dims.map((dim, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const labelRadius = maxRadius + 25;
          const x = center + labelRadius * Math.cos(angle);
          const y = center + labelRadius * Math.sin(angle);
          const meta = DIMENSION_META[dim as K8sDimension];
          return (
            <text key={dim} x={x} y={y} textAnchor="middle" dominantBaseline="middle" className="text-[10px] fill-muted-foreground">
              {meta?.label || dim}
            </text>
          );
        })}

        {Object.entries(modelProgress).map(([modelId, progress]) => {
          if (progress.completedQuestions.length === 0) return null;
          const points = getPoints(modelId);
          const pointsStr = points.map(p => `${p.x},${p.y}`).join(" ");
          return (
            <g key={modelId}>
              <polygon points={pointsStr} fill={progress.color} fillOpacity="0.15" stroke={progress.color} strokeWidth="2" />
              {points.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="4" fill={progress.color} stroke="white" strokeWidth="1" />
              ))}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
