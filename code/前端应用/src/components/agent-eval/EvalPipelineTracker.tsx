/**
 * EvalPipelineTracker — Horizontal pipeline progress tracker
 * Shows 5 evaluation stages with status indicators.
 */
import { CheckCircle2, Loader2, Circle, SkipForward, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  PIPELINE_STAGES,
  type PipelineStageStatus,
  MODEL_NAMES,
} from "@/data/agentEvalConfig";

interface EvalPipelineTrackerProps {
  stageStatus: Record<string, PipelineStageStatus>;
  currentModel: string | null;
  completedCount: number;
  totalCount: number;
  startTime: number | null;
}

const STATUS_ICON: Record<PipelineStageStatus, React.ReactNode> = {
  pending: <Circle className="h-5 w-5 text-muted-foreground/40" />,
  running: <Loader2 className="h-5 w-5 text-primary animate-spin" />,
  complete: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
  skipped: <SkipForward className="h-5 w-5 text-muted-foreground/50" />,
};

const STATUS_LABEL: Record<PipelineStageStatus, string> = {
  pending: "待执行",
  running: "进行中",
  complete: "已完成",
  skipped: "已跳过",
};

export function EvalPipelineTracker({
  stageStatus,
  currentModel,
  completedCount,
  totalCount,
  startTime,
}: EvalPipelineTrackerProps) {
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // ETA calculation
  let etaText = "";
  if (startTime && completedCount > 0 && completedCount < totalCount) {
    const elapsed = Date.now() - startTime;
    const perItem = elapsed / completedCount;
    const remaining = perItem * (totalCount - completedCount);
    const remainSec = Math.round(remaining / 1000);
    if (remainSec > 60) {
      etaText = `~${Math.ceil(remainSec / 60)}min`;
    } else {
      etaText = `~${remainSec}s`;
    }
  }

  return (
    <Card>
      <CardContent className="py-5">
        {/* Pipeline stages */}
        <div className="flex items-center justify-between mb-4">
          {PIPELINE_STAGES.map((stage, i) => {
            const status = stageStatus[stage.key] || "pending";
            return (
              <div key={stage.key} className="flex items-center flex-1">
                <div className="flex flex-col items-center text-center flex-1">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                    status === "running" ? "border-primary bg-primary/10" :
                    status === "complete" ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20" :
                    "border-muted bg-muted/30"
                  }`}>
                    {STATUS_ICON[status]}
                  </div>
                  <span className={`text-[11px] font-medium mt-1.5 ${
                    status === "running" ? "text-primary" :
                    status === "complete" ? "text-emerald-600 dark:text-emerald-400" :
                    "text-muted-foreground/60"
                  }`}>
                    {stage.label}
                  </span>
                  <span className="text-[9px] text-muted-foreground/40 mt-0.5">
                    {status === "running" && stage.key === "auto_eval"
                      ? `${completedCount}/${totalCount}`
                      : STATUS_LABEL[status]}
                  </span>
                </div>
                {/* Connector line */}
                {i < PIPELINE_STAGES.length - 1 && (
                  <div className={`h-0.5 flex-1 mx-1 rounded-full transition-all ${
                    status === "complete" ? "bg-emerald-400" :
                    status === "running" ? "bg-primary/40" :
                    "bg-muted"
                  }`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Overall progress bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              {currentModel && (
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="font-medium text-foreground">{MODEL_NAMES[currentModel] || currentModel}</span>
                  <span>回答中</span>
                </span>
              )}
              {!currentModel && completedCount > 0 && completedCount >= totalCount && (
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">评测完成</span>
              )}
            </div>
            <div className="flex items-center gap-3">
              {etaText && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {etaText}
                </span>
              )}
              <span className="tabular-nums font-medium">{pct}%</span>
            </div>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out bg-primary"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="text-[10px] text-muted-foreground/50 text-center">
            已完成 {completedCount} / {totalCount} 次模型调用
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
