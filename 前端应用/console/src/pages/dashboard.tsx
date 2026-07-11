import { ArrowUpRight, Bot, Gauge, ShieldCheck, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  { title: "Active agents", value: "12", detail: "+3 this month", icon: Bot },
  { title: "Tasks completed", value: "18.4K", detail: "94.2% success rate", icon: Sparkles },
  { title: "Budget health", value: "Healthy", detail: "22% cycle consumption", icon: Gauge },
  { title: "Risk checks", value: "7", detail: "All controls passing", icon: ShieldCheck },
];

const workstreams = [
  { title: "Support automation", value: "4.2K runs", note: "Latency down 11%" },
  { title: "Release QA", value: "2.8K runs", note: "Burst window opens Friday" },
  { title: "Ops triage", value: "1.1K runs", note: "Route to efficient models" },
];

const updates = [
  { title: "Spending workspace refreshed", time: "8 minutes ago" },
  { title: "Two inactive keys archived", time: "1 hour ago" },
  { title: "Finance alert thresholds approved", time: "Today" },
];

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-4xl font-semibold tracking-[-0.04em] text-white">Overview</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            A clean pulse check across agents, safeguards and spend readiness for the entire workspace.
          </p>
        </div>
        <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-300">
          Updated 5 minutes ago
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="rounded-[26px] border-white/10 bg-white/[0.04] backdrop-blur-xl">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
              <div>
                <CardDescription className="text-slate-500">{stat.title}</CardDescription>
                <CardTitle className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-white">
                  {stat.value}
                </CardTitle>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-2.5 text-slate-200">
                <stat.icon className="h-4.5 w-4.5" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-400">{stat.detail}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)]">
        <Card className="rounded-[30px] border-white/10 bg-white/[0.04] backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-[28px] font-semibold tracking-[-0.03em] text-white">
              Priority workstreams
            </CardTitle>
            <CardDescription className="text-slate-400">
              The workflows currently shaping reliability, usage and runway.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            {workstreams.map((item) => (
              <div key={item.title} className="rounded-[24px] border border-white/10 bg-black/20 p-5">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-medium text-white">{item.title}</h3>
                  <ArrowUpRight className="h-4 w-4 text-slate-500" />
                </div>
                <div className="mt-6 text-2xl font-semibold text-white">{item.value}</div>
                <p className="mt-2 text-sm text-slate-400">{item.note}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-[30px] border-white/10 bg-white/[0.04] backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-[28px] font-semibold tracking-[-0.03em] text-white">
              Live updates
            </CardTitle>
            <CardDescription className="text-slate-400">
              Recent operational changes worth keeping in sight.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {updates.map((item) => (
              <div key={item.title} className="rounded-[22px] border border-white/10 bg-black/20 p-4">
                <div className="text-sm font-medium text-white">{item.title}</div>
                <div className="mt-2 text-sm text-slate-400">{item.time}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
