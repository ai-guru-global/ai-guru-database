import { Routes, Route } from "react-router-dom";
import { MainLayout } from "@/components/layout/main-layout";
import { HomePage } from "@/pages/home";
import { DocsPage } from "@/pages/docs";
import { DocDetailPage } from "@/pages/doc-detail";
import { SearchPage } from "@/pages/search";
import { LeaderboardPage } from "@/pages/leaderboard";
import { K8sEvaluationPage } from "@/pages/k8s-evaluation";
import { K8sRealEvaluationPage } from "@/pages/k8s-real-evaluation";
import { SettingsPage } from "@/pages/settings";
import { QwenSettingsPage } from "@/pages/settings/qwen";
import { GlmSettingsPage } from "@/pages/settings/glm";
import { MinimaxSettingsPage } from "@/pages/settings/minimax";
import { KimiSettingsPage } from "@/pages/settings/kimi";
import { NotFoundPage } from "@/pages/not-found";

export function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/docs" element={<DocsPage />} />
        <Route path="/docs/:slug" element={<DocDetailPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/k8s-evaluation" element={<K8sEvaluationPage />} />
        <Route path="/k8s-real-evaluation" element={<K8sRealEvaluationPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/settings/qwen" element={<QwenSettingsPage />} />
        <Route path="/settings/glm" element={<GlmSettingsPage />} />
        <Route path="/settings/minimax" element={<MinimaxSettingsPage />} />
        <Route path="/settings/kimi" element={<KimiSettingsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </MainLayout>
  );
}
