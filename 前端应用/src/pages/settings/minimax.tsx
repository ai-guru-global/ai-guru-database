import { ArrowLeft, Save, Check, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useSettingsStore } from "@/store/settings";
import { useState } from "react";

export function MinimaxSettingsPage() {
  const { minimax, updateMinimax } = useSettingsStore();
  const [saved, setSaved] = useState(false);
  const [triggering, setTriggering] = useState(false);

  const handleSave = async () => {
    updateMinimax({
      apiKey: minimax.apiKey,
      endpoint: minimax.endpoint,
      modelName: minimax.modelName,
      temperature: minimax.temperature,
      maxTokens: minimax.maxTokens,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);

    // Save to eval-server
    try {
      await fetch("/api/k8s-eval/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ minimax: minimax.apiKey }),
      });
    } catch {}

    // Trigger auto-evaluation
    if (minimax.apiKey) {
      setTriggering(true);
      try {
        await fetch("/api/k8s-eval/run", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ models: ["minimax"] }),
        });
        setTimeout(() => setTriggering(false), 3000);
      } catch {
        setTriggering(false);
      }
    }
  };

  return (
    <div className="container relative">
      <div className="mx-auto max-w-[980px] py-8">
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4 pl-0">
            <Link to="/settings">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Settings
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-xl font-bold text-primary-foreground">
              M
            </div>
            <div>
              <h1 className="text-3xl font-bold">Minimax Configuration</h1>
              <p className="text-muted-foreground">Configure Minimax AI API settings</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Configuration</CardTitle>
              <CardDescription>Enter your Minimax API credentials</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">API Key</label>
                <Input
                  type="password"
                  placeholder="Enter your Minimax API key"
                  value={minimax.apiKey}
                  onChange={(e) => updateMinimax({ apiKey: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Your API key is stored securely and never shared
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">API Endpoint</label>
                <Input
                  type="text"
                  placeholder="https://api.minimax.chat/v1"
                  value={minimax.endpoint}
                  onChange={(e) => updateMinimax({ endpoint: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Group ID</label>
                <Input
                  type="text"
                  placeholder="Enter your Minimax Group ID"
                  onChange={(e) => updateMinimax({ apiKey: minimax.apiKey })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Model Name</label>
                <Input
                  type="text"
                  placeholder="abab6-chat"
                  value={minimax.modelName}
                  onChange={(e) => updateMinimax({ modelName: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Default Parameters</CardTitle>
              <CardDescription>Configure default model parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Temperature</label>
                  <Input
                    type="number"
                    placeholder="0.7"
                    value={minimax.temperature}
                    step="0.1"
                    min="0"
                    max="2"
                    onChange={(e) => updateMinimax({ temperature: parseFloat(e.target.value) || 0.7 })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Max Tokens</label>
                  <Input
                    type="number"
                    placeholder="2048"
                    value={minimax.maxTokens}
                    onChange={(e) => updateMinimax({ maxTokens: parseInt(e.target.value) || 2048 })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            {triggering && (
              <span className="flex items-center gap-2 text-xs text-muted-foreground">
                <Zap className="h-3 w-3 animate-pulse" />
                Starting evaluation...
              </span>
            )}
            <Button onClick={handleSave} disabled={triggering}>
              {saved ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Saved!
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save & Run Evaluation
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
