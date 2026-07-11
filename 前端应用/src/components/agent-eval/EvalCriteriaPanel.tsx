/**
 * EvalCriteriaPanel — Collapsible panel showing evaluation criteria
 * Three columns: CAPER model, LLM-as-Judge, COVR corpus coverage
 */
import { useState } from "react";
import { ChevronDown, ChevronUp, Scale, Brain, Database } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CAPER_DIMENSIONS,
  COVR_DIMENSIONS,
  JUDGE_CRITERIA,
  JUDGE_SCORE_LEVELS,
} from "@/data/agentEvalConfig";

function WeightBar({ weight, color }: { weight: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${weight * 100}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-[10px] tabular-nums font-medium text-muted-foreground w-8 text-right">
        {Math.round(weight * 100)}%
      </span>
    </div>
  );
}

export function EvalCriteriaPanel() {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card>
      <CardHeader
        className="pb-2 cursor-pointer select-none"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Scale className="h-4 w-4 text-primary" />
            评估标准与方法论
          </CardTitle>
          <div className="flex items-center gap-3">
            {!expanded && (
              <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
                <span>CAPER 五维模型</span>
                <span className="text-muted-foreground/30">|</span>
                <span>LLM-as-Judge</span>
                <span className="text-muted-foreground/30">|</span>
                <span>COVR 覆盖度</span>
              </div>
            )}
            {expanded ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* CAPER Model */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b">
                <Brain className="h-4 w-4 text-blue-500" />
                <span className="text-xs font-semibold text-foreground">CAPER 五维评估模型</span>
              </div>
              <div className="space-y-3">
                {CAPER_DIMENSIONS.map((dim) => (
                  <div key={dim.key} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">{dim.label}</span>
                      <span className="text-[9px] text-muted-foreground/60">{dim.labelEn}</span>
                    </div>
                    <WeightBar weight={dim.weight} color={dim.color} />
                    <p className="text-[10px] text-muted-foreground/70 leading-relaxed">{dim.description}</p>
                  </div>
                ))}
              </div>
              <div className="text-[9px] text-muted-foreground/50 border-t pt-2">
                总分 = &Sigma; W_i &times; D_i &nbsp;(满分 100)
              </div>
            </div>

            {/* LLM-as-Judge */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b">
                <Scale className="h-4 w-4 text-amber-500" />
                <span className="text-xs font-semibold text-foreground">LLM-as-Judge 评分标准</span>
              </div>
              <div className="space-y-3">
                {JUDGE_CRITERIA.map((c) => (
                  <div key={c.key} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">{c.label}</span>
                    </div>
                    <WeightBar weight={c.weight} color={c.color} />
                    <p className="text-[10px] text-muted-foreground/70 leading-relaxed">{c.description}</p>
                  </div>
                ))}
              </div>
              <div className="border-t pt-2 space-y-1">
                <span className="text-[10px] font-medium text-muted-foreground">评分等级 (0-10)</span>
                <div className="grid grid-cols-3 gap-1">
                  {JUDGE_SCORE_LEVELS.map((l) => (
                    <div key={l.score} className="text-center">
                      <div className="text-xs font-bold tabular-nums">{l.score}</div>
                      <div className="text-[9px] text-muted-foreground/60">{l.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* COVR Model */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b">
                <Database className="h-4 w-4 text-emerald-500" />
                <span className="text-xs font-semibold text-foreground">COVR 语料库覆盖度</span>
              </div>
              <div className="space-y-3">
                {COVR_DIMENSIONS.map((dim) => (
                  <div key={dim.key} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">{dim.label}</span>
                    </div>
                    <WeightBar weight={dim.weight} color={dim.color} />
                    <p className="text-[10px] text-muted-foreground/70 leading-relaxed">{dim.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {dim.subItems.map((sub) => (
                        <span key={sub} className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground/60">
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-[9px] text-muted-foreground/50 border-t pt-2">
                覆盖度 = 0.35C + 0.30O + 0.20V + 0.15R
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
