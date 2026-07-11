import { ArrowUpRight, Bot, Gauge, Layers3, Workflow } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const usageChannels = [
  { label: "Automation", value: "20%", width: "w-[20%]", icon: Workflow },
  { label: "API", value: "29%", width: "w-[29%]", icon: Gauge },
  { label: "Agents", value: "11%", width: "w-[11%]", icon: Bot },
];

const costlyFlows = [
  { label: "Release QA multi-agent", value: "$126", width: "w-[78%]" },
  { label: "Customer support routing", value: "$82", width: "w-[56%]" },
  { label: "Nightly summarization", value: "$39", width: "w-[29%]" },
];

export function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-semibold tracking-[-0.04em] text-white">Usage</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
          Understand where consumption comes from before it turns into unnecessary spend.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="rounded-[30px] border-white/10 bg-white/[0.04] backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-[28px] font-semibold tracking-[-0.03em] text-white">
              Channel mix
            </CardTitle>
            <CardDescription className="text-slate-400">
              A fast read on which surfaces are currently consuming the plan.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {usageChannels.map((channel) => (
              <div key={channel.label} className="rounded-[22px] border border-white/10 bg-black/20 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 text-sm text-white">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-200">
                      <channel.icon className="h-4 w-4" />
                    </span>
                    {channel.label}
                  </div>
                  <span className="text-sm text-slate-400">{channel.value}</span>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                  <div className={`${channel.width} h-full rounded-full bg-[linear-gradient(90deg,#38bdf8,#818cf8)]`} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-[30px] border-white/10 bg-white/[0.04] backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-[28px] font-semibold tracking-[-0.03em] text-white">
              Efficiency signals
            </CardTitle>
            <CardDescription className="text-slate-400">
              Metrics that help decide when to optimize versus when to scale.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[24px] border border-white/10 bg-black/20 p-5">
              <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Average task cost</div>
              <div className="mt-3 text-3xl font-semibold text-white">$0.018</div>
              <div className="mt-2 text-sm text-emerald-300">Down 7% week over week</div>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-black/20 p-5">
              <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Fallback rate</div>
              <div className="mt-3 text-3xl font-semibold text-white">3.2%</div>
              <div className="mt-2 text-sm text-slate-400">Routing healthy across premium flows</div>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-black/20 p-5 sm:col-span-2">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Model routing coverage</div>
                  <div className="mt-3 text-3xl font-semibold text-white">91%</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-slate-300">
                  <Layers3 className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                Most workflows now respect the cost-aware routing policy, leaving only a few legacy tasks to migrate.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-[30px] border-white/10 bg-white/[0.04] backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-[28px] font-semibold tracking-[-0.03em] text-white">
            Highest-cost workflows
          </CardTitle>
          <CardDescription className="text-slate-400">
            The fastest place to claw back spend without hurting user-facing quality.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {costlyFlows.map((flow) => (
            <div key={flow.label} className="rounded-[22px] border border-white/10 bg-black/20 p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-sm text-white">
                  <ArrowUpRight className="h-4 w-4 text-slate-500" />
                  {flow.label}
                </div>
                <span className="text-sm text-slate-400">{flow.value}</span>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                <div className={`${flow.width} h-full rounded-full bg-[linear-gradient(90deg,#818cf8,#34d399)]`} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
