/**
 * K8sDimensionBars — Horizontal grouped bar chart comparing agent scores
 * across corpus / QA sub-dimensions
 */
import { type K8sAgentEval } from "@/data/k8sEvalData";

interface DimDef {
  key: string;
  label: string;
  icon: string;
}

interface Props {
  title: string;
  dimensions: DimDef[];
  getValue: (agent: K8sAgentEval, key: string) => number;
  agents: K8sAgentEval[];
  className?: string;
}

export function K8sDimensionBars({ title, dimensions, getValue, agents, className = "" }: Props) {
  const maxVal = 100;

  return (
    <div className={className}>
      <h3 className="text-sm font-semibold text-foreground/80 mb-4 tracking-wide uppercase">{title}</h3>
      <div className="space-y-5">
        {dimensions.map((dim) => {
          // Find the best score for this dimension
          const scores = agents.map((a) => getValue(a, dim.key));
          const best = Math.max(...scores);

          return (
            <div key={dim.key}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-base">{dim.icon}</span>
                <span className="text-xs font-medium text-muted-foreground">{dim.label}</span>
              </div>
              <div className="space-y-1.5">
                {agents.map((agent) => {
                  const val = getValue(agent, dim.key);
                  const pct = (val / maxVal) * 100;
                  const isBest = val === best;
                  return (
                    <div key={agent.id} className="flex items-center gap-3">
                      <span className="w-[72px] text-[11px] text-muted-foreground text-right truncate">{agent.name.split(" ")[0]}</span>
                      <div className="flex-1 h-5 rounded-md bg-muted overflow-hidden relative group">
                        <div
                          className="h-full rounded-md transition-all duration-700 ease-out"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: agent.color,
                            opacity: isBest ? 0.85 : 0.5,
                          }}
                        />
                        {/* Glow effect on best */}
                        {isBest && (
                          <div
                            className="absolute inset-y-0 left-0 rounded-md blur-sm"
                            style={{
                              width: `${pct}%`,
                              backgroundColor: agent.color,
                              opacity: 0.25,
                            }}
                          />
                        )}
                      </div>
                      <span
                        className={`w-10 text-right text-xs tabular-nums font-semibold ${isBest ? "text-foreground" : "text-muted-foreground"}`}
                      >
                        {val.toFixed(1)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
