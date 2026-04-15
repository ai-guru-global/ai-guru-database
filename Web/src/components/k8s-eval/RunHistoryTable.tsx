import { useState, useEffect } from "react";
import { History, ChevronRight, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface RunSummary {
  id: string;
  timestamp: string;
  date: string;
  type: string;
  models: string[];
  avgScores: Record<string, number>;
}

const MODEL_COLORS: Record<string, string> = {
  qwen: "#FF6A00",
  kimi: "#6366F1",
  minimax: "#10B981",
};

export function RunHistoryTable() {
  const [runs, setRuns] = useState<RunSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRuns();
    const interval = setInterval(fetchRuns, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchRuns = async () => {
    try {
      const r = await fetch("/api/k8s-eval/runs?limit=10");
      const d = await r.json();
      if (d.ok) {
        setRuns(d.runs || []);
      }
    } catch {}
    setLoading(false);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 flex justify-center text-muted-foreground">
          Loading history...
        </CardContent>
      </Card>
    );
  }

  if (runs.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground text-sm">
          No evaluation runs yet.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          <CardTitle className="text-base">Recent Runs</CardTitle>
        </div>
        <CardDescription>Past evaluation results</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {runs.map((run) => (
            <div
              key={run.id}
              className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {new Date(run.timestamp).toLocaleString("zh-CN", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="flex gap-2 mt-1">
                  {run.models.map((m) => (
                    <span
                      key={m}
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: `${MODEL_COLORS[m]}20`,
                        color: MODEL_COLORS[m] || "hsl(var(--muted-foreground))",
                      }}
                    >
                      {run.avgScores[m]?.toFixed(1) || "-"}
                    </span>
                  ))}
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
