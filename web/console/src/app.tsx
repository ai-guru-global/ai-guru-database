import { Routes, Route } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { DashboardPage } from "@/pages/dashboard";
import { AnalyticsPage } from "@/pages/analytics";
import { ContentPage } from "@/pages/content";
import { SettingsPage } from "@/pages/settings";
import { SpendingPage } from "@/pages/spending";

export function App() {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/usage" element={<AnalyticsPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/content" element={<ContentPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/spending" element={<SpendingPage />} />
        <Route path="/billing" element={<SpendingPage />} />
      </Routes>
    </DashboardLayout>
  );
}
