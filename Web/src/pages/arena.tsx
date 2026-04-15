import { useSearchParams } from "react-router-dom";
import { Trophy } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LeaderboardContent } from "@/pages/leaderboard";
import { K8sEvaluationContent } from "@/pages/k8s-evaluation";

export function ArenaPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") === "k8s" ? "k8s" : "leaderboard";

  const handleTabChange = (value: string) => {
    if (value === "k8s") {
      setSearchParams({ tab: "k8s" }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  };

  return (
    <div className="container py-8">
      {/* Unified Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="h-8 w-8 text-yellow-500" />
          <h1 className="text-3xl font-bold tracking-tight">Agent Arena</h1>
        </div>
        <p className="text-muted-foreground">
          CAPER Five-Dimension Evaluation — Cloud Agent Leaderboard & K8s Domain Benchmark
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="mb-6">
          <TabsTrigger value="leaderboard">模型排名</TabsTrigger>
          <TabsTrigger value="k8s">K8s 专项评测</TabsTrigger>
        </TabsList>

        <TabsContent value="leaderboard">
          <LeaderboardContent />
        </TabsContent>

        <TabsContent value="k8s">
          <K8sEvaluationContent />
        </TabsContent>
      </Tabs>
    </div>
  );
}
