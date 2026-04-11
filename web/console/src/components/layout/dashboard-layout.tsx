import { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-[-220px] h-[420px] bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.18),transparent_58%)]" />
        <div className="absolute right-[-120px] top-24 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(129,140,248,0.16),transparent_68%)] blur-3xl" />
      </div>

      <div className="relative flex min-h-screen">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Header />
          <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <div className="mx-auto w-full max-w-[1600px]">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
