import { Link, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Bot,
  CreditCard,
  Gauge,
  Receipt,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const usageBreakdown = [
  { label: "Auto runs", value: 20, detail: "20% of plan", tone: "from-sky-400 to-cyan-300" },
  { label: "API usage", value: 29, detail: "29% of plan", tone: "from-violet-400 to-fuchsia-300" },
  { label: "Background agents", value: 11, detail: "11% of plan", tone: "from-emerald-400 to-teal-300" },
];

const budgetRules = [
  { label: "Soft cap", value: "$300", note: "Send Slack + email alert at 80%." },
  { label: "Hard stop", value: "$450", note: "Pause non-critical runs until reviewed." },
  { label: "Burst room", value: "$120", note: "Reserved for launches and model eval weeks." },
];

const invoices = [
  { month: "April 2026", total: "$20.00", status: "Upcoming", note: "Renews in 22 days" },
  { month: "March 2026", total: "$20.00", status: "Paid", note: "Card ending in 4242" },
  { month: "February 2026", total: "$20.00", status: "Paid", note: "Card ending in 4242" },
];

const optimizationPlays = [
  {
    title: "Move background summarization to off-peak hours",
    body: "Save an estimated 14% by shifting non-urgent jobs into the nightly queue.",
  },
  {
    title: "Set model routing by task type",
    body: "Reserve premium models for customer-facing runs and keep internal automation on efficient defaults.",
  },
  {
    title: "Review abandoned API keys",
    body: "Two inactive keys still have quota attached. Reclaim the budget and tighten access control.",
  },
];

const activityFeed = [
  { title: "Monthly limit reviewed", time: "8 min ago", detail: "Finance admin increased the evaluation buffer by $40." },
  { title: "Usage alert delivered", time: "Yesterday", detail: "Workspace crossed 20% total consumption for the current billing cycle." },
  { title: "Pro renewal scheduled", time: "2 days ago", detail: "Primary billing card validated successfully for next cycle." },
];

export function SpendingPage() {
  const location = useLocation();
  const billingMode = location.pathname === "/billing";

  const pageTitle = billingMode ? "Billing & Invoices" : "Spending";
  const pageDescription = billingMode
    ? "Keep finance, invoices and card activity visible without leaving the workspace."
    : "Monitor agent consumption, guardrail your budget and make upgrade decisions with confidence.";

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-4">
          <Button
            variant="ghost"
            asChild
            className="h-auto rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-slate-300 hover:bg-white/[0.06] hover:text-white"
          >
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Agents
            </Link>
          </Button>

          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-sky-200">
              <Sparkles className="h-3.5 w-3.5" />
              Finance control room
            </div>
            <div>
              <h1 className="text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
                {pageTitle}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                {pageDescription}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            className="rounded-full border-white/10 bg-white/[0.03] text-slate-200 hover:bg-white/[0.08] hover:text-white"
          >
            <Receipt className="mr-2 h-4 w-4" />
            Export report
          </Button>
          <Button className="rounded-full bg-white text-slate-950 hover:bg-slate-200">
            Upgrade to Pro+
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_340px]">
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="overflow-hidden rounded-[28px] border-white/10 bg-white/[0.04] shadow-[0_24px_80px_rgba(15,23,42,0.45)] backdrop-blur-xl">
              <CardHeader className="space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardDescription className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                      Current plan
                    </CardDescription>
                    <CardTitle className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-white">
                      Pro <span className="text-lg font-medium text-slate-400">$20/mo</span>
                    </CardTitle>
                  </div>
                  <div className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200">
                    Active
                  </div>
                </div>
                <div className="grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
                    <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Resets on</div>
                    <div className="mt-2 text-lg font-medium text-white">May 2</div>
                    <div className="mt-1 text-xs text-slate-500">22 days remaining</div>
                  </div>
                  <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
                    <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Included</div>
                    <div className="mt-2 text-lg font-medium text-white">3x more usage</div>
                    <div className="mt-1 text-xs text-slate-500">Automation + API runway</div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card className="overflow-hidden rounded-[28px] border border-sky-400/20 bg-[linear-gradient(145deg,rgba(56,189,248,0.12),rgba(15,23,42,0.72))] shadow-[0_24px_80px_rgba(2,132,199,0.18)] backdrop-blur-xl">
              <CardHeader className="space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardDescription className="text-[11px] uppercase tracking-[0.22em] text-sky-100/70">
                      Upgrade available
                    </CardDescription>
                    <CardTitle className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-white">
                      Pro+ <span className="text-lg font-medium text-sky-100/70">$60/mo</span>
                    </CardTitle>
                  </div>
                  <div className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white">
                    Recommended
                  </div>
                </div>
                <div className="space-y-3 text-sm text-sky-50/80">
                  <div className="flex items-center gap-2">
                    <BadgeCheck className="h-4 w-4 text-sky-300" />
                    Unlock advanced routing and larger burst limits.
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-sky-300" />
                    Priority support during launch windows.
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-sky-300" />
                    More headroom for multi-agent workflows.
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>

          <Card className="rounded-[30px] border-white/10 bg-white/[0.04] shadow-[0_30px_100px_rgba(15,23,42,0.48)] backdrop-blur-xl">
            <CardHeader className="gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <CardTitle className="text-[28px] font-semibold tracking-[-0.03em] text-white">
                  Included in Pro
                </CardTitle>
                <CardDescription className="mt-2 max-w-2xl text-slate-400">
                  Your combined consumption is at <span className="font-semibold text-white">22%</span> of the current plan. Auto runs and API calls remain comfortably below the monthly threshold.
                </CardDescription>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-right">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Cycle health</div>
                <div className="mt-2 text-3xl font-semibold text-white">22%</div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="overflow-hidden rounded-full border border-white/10 bg-white/[0.04] p-1">
                <div className="h-3 rounded-full bg-[linear-gradient(90deg,#38bdf8_0%,#818cf8_45%,#34d399_100%)]" style={{ width: "22%" }} />
              </div>

              <div className="grid gap-4 lg:grid-cols-3">
                {usageBreakdown.map((item) => (
                  <div key={item.label} className="rounded-[24px] border border-white/10 bg-black/20 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-200">{item.label}</span>
                      <span className="text-sm text-slate-500">{item.value}%</span>
                    </div>
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${item.tone}`}
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                    <p className="mt-3 text-xs uppercase tracking-[0.18em] text-slate-500">{item.detail}</p>
                  </div>
                ))}
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-[24px] border border-white/10 bg-black/20 p-5">
                  <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Runway</div>
                  <div className="mt-3 text-2xl font-semibold text-white">22 days</div>
                  <div className="mt-2 text-sm text-slate-400">Until reset with no intervention needed.</div>
                </div>
                <div className="rounded-[24px] border border-white/10 bg-black/20 p-5">
                  <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Top workflow</div>
                  <div className="mt-3 text-2xl font-semibold text-white">Agent QA</div>
                  <div className="mt-2 text-sm text-slate-400">Generated 8.4k requests this cycle.</div>
                </div>
                <div className="rounded-[24px] border border-white/10 bg-black/20 p-5">
                  <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Policy status</div>
                  <div className="mt-3 text-2xl font-semibold text-emerald-300">Healthy</div>
                  <div className="mt-2 text-sm text-slate-400">No overspend warnings or blocked runs.</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.8fr)]">
            <Card className="rounded-[30px] border-white/10 bg-white/[0.04] backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-[26px] font-semibold tracking-[-0.03em] text-white">
                  On-demand controls
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Put guardrails around burst usage so launches feel safe, not expensive.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start justify-between gap-4 rounded-[24px] border border-white/10 bg-black/20 p-5">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-white">On-demand spending</Label>
                    <p className="text-sm leading-6 text-slate-400">
                      Keep disabled until a launch or eval sprint needs additional headroom.
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="monthly-limit" className="text-sm font-medium text-slate-300">
                    Monthly emergency limit
                  </Label>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <div className="relative flex-1">
                      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                        $
                      </span>
                      <Input
                        id="monthly-limit"
                        defaultValue="450"
                        className="h-12 rounded-2xl border-white/10 bg-black/20 pl-8 text-white placeholder:text-slate-600"
                      />
                    </div>
                    <Button className="h-12 rounded-2xl bg-white text-slate-950 hover:bg-slate-200">Save cap</Button>
                  </div>
                </div>

                <div className="grid gap-3">
                  {budgetRules.map((rule) => (
                    <div key={rule.label} className="rounded-[22px] border border-white/10 bg-black/20 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-sm font-medium text-white">{rule.label}</div>
                          <div className="mt-1 text-sm text-slate-400">{rule.note}</div>
                        </div>
                        <div className="text-lg font-semibold text-white">{rule.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[30px] border-white/10 bg-white/[0.04] backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-[26px] font-semibold tracking-[-0.03em] text-white">
                  Recent activity
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Finance and ops events that changed your budget posture.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {activityFeed.map((item, index) => (
                  <div key={item.title} className="relative pl-6">
                    <span className="absolute left-0 top-1.5 h-3 w-3 rounded-full bg-sky-300 shadow-[0_0_0_6px_rgba(56,189,248,0.12)]" />
                    {index < activityFeed.length - 1 && (
                      <span className="absolute left-[5px] top-5 h-[calc(100%-6px)] w-px bg-white/10" />
                    )}
                    <div className="rounded-[22px] border border-white/10 bg-black/20 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-sm font-medium text-white">{item.title}</h3>
                        <span className="text-xs uppercase tracking-[0.16em] text-slate-500">{item.time}</span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-400">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card className="rounded-[30px] border-white/10 bg-white/[0.04] backdrop-blur-xl">
            <CardHeader className="gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <CardTitle className="text-[26px] font-semibold tracking-[-0.03em] text-white">
                  Invoice history
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Clear visibility for finance, without digging through separate billing tools.
                </CardDescription>
              </div>
              <div className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                Synced daily
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {invoices.map((invoice) => (
                <div
                  key={invoice.month}
                  className="flex flex-col gap-4 rounded-[24px] border border-white/10 bg-black/20 p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="text-base font-medium text-white">{invoice.month}</div>
                    <div className="mt-1 text-sm text-slate-400">{invoice.note}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        invoice.status === "Upcoming"
                          ? "border border-amber-400/20 bg-amber-400/10 text-amber-200"
                          : "border border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
                      }`}
                    >
                      {invoice.status}
                    </span>
                    <div className="text-lg font-semibold text-white">{invoice.total}</div>
                    <Button variant="ghost" className="rounded-full text-slate-300 hover:bg-white/[0.06] hover:text-white">
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-6 xl:sticky xl:top-[106px] xl:self-start">
          <Card className="rounded-[30px] border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] backdrop-blur-xl">
            <CardHeader>
              <CardDescription className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
                Workspace owner
              </CardDescription>
              <div className="flex items-center gap-4 pt-2">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#38bdf8,#818cf8)] text-lg font-semibold text-slate-950">
                  AG
                </div>
                <div className="min-w-0">
                  <div className="truncate text-lg font-medium text-white">Allen Galler</div>
                  <div className="truncate text-sm text-slate-400">Finance admin · Pro workspace</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-3">
              <div className="flex items-center justify-between rounded-[20px] border border-white/10 bg-black/20 px-4 py-3 text-sm text-slate-300">
                <span className="flex items-center gap-2"><Bot className="h-4 w-4 text-sky-300" /> Active agents</span>
                <span className="font-medium text-white">12</span>
              </div>
              <div className="flex items-center justify-between rounded-[20px] border border-white/10 bg-black/20 px-4 py-3 text-sm text-slate-300">
                <span className="flex items-center gap-2"><Gauge className="h-4 w-4 text-violet-300" /> Budget alerts</span>
                <span className="font-medium text-white">3 live</span>
              </div>
              <div className="flex items-center justify-between rounded-[20px] border border-white/10 bg-black/20 px-4 py-3 text-sm text-slate-300">
                <span className="flex items-center gap-2"><CreditCard className="h-4 w-4 text-emerald-300" /> Primary card</span>
                <span className="font-medium text-white">•••• 4242</span>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[30px] border-white/10 bg-white/[0.04] backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-[24px] font-semibold tracking-[-0.03em] text-white">
                Risk watch
              </CardTitle>
              <CardDescription className="text-slate-400">
                Context the team should review before enabling burst spend.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-[22px] border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-100">
                <div className="flex items-center gap-2 font-medium">
                  <TriangleAlert className="h-4 w-4" /> Upcoming launch week
                </div>
                <p className="mt-2 leading-6 text-amber-100/80">
                  Demand is expected to spike 1.8x. Pre-approve on-demand only if routing rules are already tightened.
                </p>
              </div>
              <div className="rounded-[22px] border border-white/10 bg-black/20 p-4 text-sm text-slate-300">
                <div className="font-medium text-white">Approval chain</div>
                <p className="mt-2 leading-6 text-slate-400">Ops lead → Finance admin → Workspace owner</p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[30px] border-white/10 bg-white/[0.04] backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-[24px] font-semibold tracking-[-0.03em] text-white">
                Optimization playbook
              </CardTitle>
              <CardDescription className="text-slate-400">
                Practical changes with the highest expected savings first.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {optimizationPlays.map((play) => (
                <div key={play.title} className="rounded-[22px] border border-white/10 bg-black/20 p-4">
                  <h3 className="text-sm font-medium text-white">{play.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{play.body}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
