import { NavLink } from "react-router-dom";
import {
  ArrowLeft,
  Bot,
  Bug,
  Cloud,
  CreditCard,
  Gauge,
  LayoutDashboard,
  PlugZap,
  Receipt,
  Settings,
  Sparkles,
  Users,
} from "lucide-react";
import { cn } from "@/utils/cn";

const navSections = [
  {
    title: "Workspace",
    items: [
      { icon: LayoutDashboard, label: "Overview", href: "/" },
      { icon: Settings, label: "Settings", href: "/settings" },
    ],
  },
  {
    title: "Agents",
    items: [
      { icon: Cloud, label: "Cloud Agents", disabled: true },
      { icon: Bug, label: "Bugbot", disabled: true },
      { icon: PlugZap, label: "Plugins", disabled: true },
      { icon: Sparkles, label: "Integrations", disabled: true },
      { icon: Users, label: "Members", disabled: true },
    ],
  },
  {
    title: "Billing",
    items: [
      { icon: Gauge, label: "Usage", href: "/usage" },
      { icon: CreditCard, label: "Spending", href: "/spending" },
      { icon: Receipt, label: "Billing & Invoices", href: "/billing" },
    ],
  },
];

export function Sidebar() {
  return (
    <aside className="hidden w-[288px] min-w-[288px] shrink-0 border-r border-white/10 bg-[rgba(7,10,26,0.92)] px-4 py-5 lg:flex lg:flex-col">
      <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-hidden">
        <NavLink
          to="/"
          className="inline-flex items-center gap-2 rounded-full px-2 py-1 text-sm text-slate-400 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Agents
        </NavLink>

        <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 shadow-[0_24px_80px_rgba(2,6,23,0.45)]">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#38bdf8,#818cf8)] text-sm font-semibold text-slate-950">
              AG
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-white">Allen Galler</div>
              <div className="truncate text-xs text-slate-500">Pro workspace</div>
            </div>
            <button className="rounded-full border border-white/10 px-2 py-1 text-xs text-slate-500 transition hover:border-white/20 hover:text-slate-200">
              •••
            </button>
          </div>

          <div className="mt-5 rounded-[22px] border border-white/10 bg-black/20 p-4">
            <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-[0.18em] text-slate-500">
              <span>Workspace pulse</span>
              <span>22%</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/[0.06]">
              <div className="h-full w-[22%] rounded-full bg-[linear-gradient(90deg,#38bdf8,#818cf8)]" />
            </div>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-slate-400">Budget status</span>
              <span className="font-medium text-emerald-300">Healthy</span>
            </div>
          </div>
        </div>

        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto pr-1">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-2">
              <div className="px-3 text-[11px] uppercase tracking-[0.24em] text-slate-600">{section.title}</div>
              <div className="space-y-1.5">
                {section.items.map((item) => {
                  if (item.disabled) {
                    return (
                      <div
                        key={item.label}
                        className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm text-slate-500"
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </div>
                    );
                  }

                  return (
                    <NavLink
                      key={item.href}
                      to={item.href!}
                      className={({ isActive }) =>
                        cn(
                          "group flex items-center gap-3 rounded-2xl border px-3 py-3 text-sm transition-all duration-200",
                          isActive
                            ? "border-sky-400/20 bg-[linear-gradient(135deg,rgba(56,189,248,0.14),rgba(99,102,241,0.12))] text-white shadow-[0_14px_40px_rgba(14,165,233,0.12)]"
                            : "border-transparent text-slate-400 hover:border-white/10 hover:bg-white/[0.04] hover:text-white"
                        )
                      }
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-black/20 text-slate-300 transition group-hover:text-white">
                        <item.icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 truncate">{item.label}</span>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-[28px] border border-sky-400/20 bg-sky-400/10 p-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-xl bg-sky-300/20 p-2 text-sky-200">
              <Bot className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-medium text-white">Scale without chaos</div>
              <p className="mt-1 text-sm leading-6 text-sky-100/75">
                Use the right rail to track approvals, invoices and optimization moves in one glance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
