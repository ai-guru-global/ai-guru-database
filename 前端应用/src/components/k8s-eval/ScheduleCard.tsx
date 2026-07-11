import { useState, useEffect } from "react";
import { Play, Clock, Calendar, Loader2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface ScheduleConfig {
  enabled: boolean;
  cron: string;
  models: string[];
  nextRun?: string;
}

const CRON_PRESETS = [
  { label: "Daily (2 AM)", value: "0 2 * * *" },
  { label: "Every 6 hours", value: "0 */6 * * *" },
  { label: "Weekly (Sunday)", value: "0 0 * * 0" },
  { label: "Monthly", value: "0 0 1 * *" },
];

export function ScheduleCard() {
  const [schedule, setSchedule] = useState<ScheduleConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [running, setRunning] = useState(false);
  const [customCron, setCustomCron] = useState("");

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      const r = await fetch("/api/k8s-eval/schedule");
      const d = await r.json();
      if (d.ok) {
        setSchedule(d.schedule);
        setCustomCron(d.schedule.cron);
      }
    } catch {}
    setLoading(false);
  };

  const saveSchedule = async (cfg: Partial<ScheduleConfig>) => {
    setSaving(true);
    try {
      const r = await fetch("/api/k8s-eval/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...schedule, ...cfg }),
      });
      const d = await r.json();
      if (d.ok) {
        setSchedule(d.schedule);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch {}
    setSaving(false);
  };

  const runNow = async () => {
    setRunning(true);
    try {
      await fetch("/api/k8s-eval/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ models: schedule?.models || ["kimi"] }),
      });
    } catch {}
    setRunning(false);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          <CardTitle className="text-base">Auto Evaluation</CardTitle>
          {schedule?.enabled && (
            <span className="ml-auto text-xs bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-300 px-2 py-0.5 rounded-full">
              Active
            </span>
          )}
        </div>
        <CardDescription>Schedule automatic K8s model evaluations</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Enable toggle */}
        <div className="flex items-center justify-between">
          <span className="text-sm">Enable Schedule</span>
          <button
            onClick={() => saveSchedule({ enabled: !schedule?.enabled })}
            className={`relative w-11 h-6 rounded-full transition-colors ${
              schedule?.enabled ? "bg-primary" : "bg-muted"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                schedule?.enabled ? "translate-x-5" : ""
              }`}
            />
          </button>
        </div>

        {/* Cron presets */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Schedule</label>
          <div className="grid grid-cols-2 gap-2">
            {CRON_PRESETS.map((preset) => (
              <button
                key={preset.value}
                onClick={() => {
                  setCustomCron(preset.value);
                  saveSchedule({ cron: preset.value });
                }}
                className={`text-xs px-3 py-2 rounded-lg border transition-colors ${
                  schedule?.cron === preset.value
                    ? "border-primary bg-accent text-foreground"
                    : "border-border bg-background text-muted-foreground hover:border-primary/50"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom cron */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Custom cron expression</label>
          <div className="flex gap-2">
            <Input
              value={customCron}
              onChange={(e) => setCustomCron(e.target.value)}
              placeholder="0 2 * * *"
              className="font-mono text-sm"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => saveSchedule({ cron: customCron })}
              disabled={saving}
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Set"}
            </Button>
          </div>
        </div>

        {/* Next run */}
        {schedule?.enabled && schedule?.nextRun && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            Next run: {schedule.nextRun}
          </div>
        )}

        {/* Run now button */}
        <div className="pt-2 border-t">
          <Button onClick={runNow} disabled={running} className="w-full">
            {running ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Play className="mr-2 h-4 w-4" />
            )}
            Run Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
