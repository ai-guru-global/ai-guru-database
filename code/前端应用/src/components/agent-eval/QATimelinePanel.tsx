/**
 * QATimelinePanel — Vertical timeline view of Q&A process
 * Shows each question with model answers, scores, and keyword hits.
 */
import { useState } from "react";
import { CheckCircle2, Clock, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DIMENSION_META, type K8sDimension, type K8sTestQuestion } from "@/data/k8sTestQuestions";
import { MODEL_COLORS, MODEL_NAMES } from "@/data/agentEvalConfig";

interface ScoreBreakdown {
  keywordScore: number;
  keywordHits: string[];
  keywordTotal: number;
  referenceScore: number;
  lengthScore: number;
  structureScore: number;
}

interface QAResult {
  modelId: string;
  content: string;
  latencyMs: number;
  score: { total: number; breakdown: ScoreBreakdown };
}

export interface TimelineEntry {
  question: K8sTestQuestion;
  results: Record<string, QAResult>;
  isActive: boolean;
}

interface QATimelinePanelProps {
  entries: TimelineEntry[];
  currentQuestionId: string | null;
}

function confidenceColor(score: number): string {
  if (score >= 60) return "#22c55e";
  if (score >= 40) return "#f97316";
  return "#ef4444";
}

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const styles: Record<string, string> = {
    easy: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300",
    medium: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300",
    hard: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
  };
  return (
    <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${styles[difficulty] || styles.medium}`}>
      {difficulty}
    </span>
  );
}

function BreakdownBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[9px] text-muted-foreground/60 w-10 text-right truncate">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
        <div className="h-full rounded-full transition-all duration-300" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <span className="text-[9px] tabular-nums text-muted-foreground w-6 text-right">{value}</span>
    </div>
  );
}

function TimelineNode({ entry, isCurrent }: { entry: TimelineEntry; isCurrent: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const q = entry.question;
  const meta = DIMENSION_META[q.dimension as K8sDimension];
  const modelIds = Object.keys(entry.results);

  return (
    <div className={`relative pl-8 pb-6 ${isCurrent ? "animate-pulse-subtle" : ""}`}>
      {/* Timeline dot */}
      <div className={`absolute left-0 top-1 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
        entry.isActive
          ? "border-primary bg-primary/20"
          : modelIds.length > 0
          ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30"
          : "border-muted bg-muted/50"
      }`}>
        {entry.isActive ? (
          <Loader2 className="h-2.5 w-2.5 text-primary animate-spin" />
        ) : modelIds.length > 0 ? (
          <CheckCircle2 className="h-2.5 w-2.5 text-emerald-500" />
        ) : (
          <Clock className="h-2.5 w-2.5 text-muted-foreground/40" />
        )}
      </div>

      {/* Timeline line */}
      <div className="absolute left-[7px] top-5 bottom-0 w-0.5 bg-muted" />

      {/* Question card */}
      <Card className={`transition-all duration-300 ${isCurrent ? "border-primary/50 shadow-sm" : ""}`}>
        <div
          className="px-4 py-3 cursor-pointer hover:bg-accent/30 transition-colors"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: meta?.color || "#888" }} />
            <span className="text-[10px] font-medium" style={{ color: meta?.color }}>{meta?.icon} {meta?.label}</span>
            <DifficultyBadge difficulty={q.difficulty} />
            <span className="text-[10px] text-muted-foreground/40 font-mono">{q.id}</span>
            {/* Model scores inline */}
            <div className="ml-auto flex items-center gap-2">
              {modelIds.map((mid) => {
                const r = entry.results[mid];
                return (
                  <span key={mid} className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: MODEL_COLORS[mid] || "#888" }} />
                    <span className="text-xs font-bold tabular-nums" style={{ color: confidenceColor(r.score.total) }}>
                      {r.score.total}
                    </span>
                  </span>
                );
              })}
              {entry.isActive && <Loader2 className="h-3 w-3 text-primary animate-spin" />}
              {expanded ? <ChevronUp className="h-3 w-3 text-muted-foreground" /> : <ChevronDown className="h-3 w-3 text-muted-foreground" />}
            </div>
          </div>
          <p className="text-xs text-foreground/80 leading-relaxed line-clamp-2">{q.question}</p>
        </div>

        {/* Expanded details */}
        {expanded && (
          <CardContent className="pt-0 pb-3 border-t space-y-3">
            {/* Reference keywords */}
            <div>
              <span className="text-[10px] text-muted-foreground/60">参考关键词</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {q.keywords.map((kw, i) => {
                  // check if any model hit this keyword
                  const hit = modelIds.some(
                    (mid) => entry.results[mid]?.score?.breakdown?.keywordHits?.includes(kw)
                  );
                  return (
                    <span
                      key={i}
                      className={`text-[9px] px-1.5 py-0.5 rounded ${
                        hit
                          ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                          : "bg-muted text-muted-foreground/50"
                      }`}
                    >
                      {kw}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Model answers */}
            {modelIds.map((mid) => {
              const r = entry.results[mid];
              const bd = r.score.breakdown;
              return (
                <div key={mid} className="rounded-lg border bg-muted/20 p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: MODEL_COLORS[mid] }} />
                    <span className="text-xs font-medium">{MODEL_NAMES[mid] || mid}</span>
                    <span className="text-[10px] text-muted-foreground">{r.latencyMs}ms</span>
                    <span className="ml-auto text-sm font-bold tabular-nums" style={{ color: confidenceColor(r.score.total) }}>
                      {r.score.total}
                    </span>
                  </div>

                  {/* Score breakdown */}
                  <div className="space-y-1">
                    <BreakdownBar label="关键词" value={bd.keywordScore} max={100} color="#22c55e" />
                    <BreakdownBar label="相似度" value={bd.referenceScore} max={100} color="#3b82f6" />
                    <BreakdownBar label="长度" value={bd.lengthScore} max={100} color="#f59e0b" />
                    <BreakdownBar label="结构" value={bd.structureScore} max={100} color="#8b5cf6" />
                  </div>

                  {/* Keyword hits */}
                  {bd.keywordHits?.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      <span className="text-[9px] text-muted-foreground/50">命中:</span>
                      {bd.keywordHits.map((kw, i) => (
                        <span key={i} className="text-[9px] px-1 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 rounded">
                          {kw}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Answer preview */}
                  <div className="text-[10px] text-muted-foreground/70 whitespace-pre-wrap line-clamp-3 leading-relaxed">
                    {r.content?.slice(0, 300)}{r.content?.length > 300 && "..."}
                  </div>
                </div>
              );
            })}
          </CardContent>
        )}
      </Card>
    </div>
  );
}

export function QATimelinePanel({ entries, currentQuestionId }: QATimelinePanelProps) {
  if (entries.length === 0) return null;

  const completedCount = entries.filter(e => Object.keys(e.results).length > 0 && !e.isActive).length;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          问答时间轴
          <span className="text-xs text-muted-foreground font-normal ml-2">
            {completedCount}/{entries.length} 题已完成
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {entries.map((entry) => (
            <TimelineNode
              key={entry.question.id}
              entry={entry}
              isCurrent={entry.question.id === currentQuestionId}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
