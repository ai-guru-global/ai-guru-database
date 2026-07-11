import { Bell, Command, Search, Sparkles, User } from "lucide-react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const pageMeta: Record<string, { eyebrow: string; title: string }> = {
  "/": { eyebrow: "Workspace", title: "Overview" },
  "/usage": { eyebrow: "Billing", title: "Usage" },
  "/analytics": { eyebrow: "Billing", title: "Usage" },
  "/spending": { eyebrow: "Billing", title: "Spending" },
  "/billing": { eyebrow: "Billing", title: "Billing & Invoices" },
  "/settings": { eyebrow: "Workspace", title: "Settings" },
  "/content": { eyebrow: "Operations", title: "Content" },
};

export function Header() {
  const location = useLocation();
  const current = pageMeta[location.pathname] ?? { eyebrow: "Console", title: "AI Guru" };

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[rgba(5,8,22,0.72)] backdrop-blur-2xl">
      <div className="mx-auto flex h-[78px] w-full max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="min-w-0">
          <div className="text-[11px] uppercase tracking-[0.24em] text-slate-500">{current.eyebrow}</div>
          <div className="mt-2 flex items-center gap-3">
            <h1 className="truncate text-xl font-semibold tracking-[-0.03em] text-white">{current.title}</h1>
            <span className="hidden rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-400 sm:inline-flex">
              Allen Galler workspace
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="ghost"
            className="hidden h-11 min-w-[220px] items-center justify-between rounded-full border border-white/10 bg-white/[0.03] px-4 text-slate-400 hover:bg-white/[0.06] hover:text-white md:inline-flex"
          >
            <span className="flex items-center gap-2 text-sm">
              <Search className="h-4 w-4" />
              Search workspace
            </span>
            <span className="flex items-center gap-1 rounded-full border border-white/10 bg-black/20 px-2 py-1 text-[11px] text-slate-500">
              <Command className="h-3 w-3" />K
            </span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full border border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.08] hover:text-white"
          >
            <Bell className="h-4.5 w-4.5" />
          </Button>

          <div className="hidden items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-2 text-xs font-medium text-sky-200 lg:flex">
            <Sparkles className="h-3.5 w-3.5" />
            Spend healthy
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-11 rounded-full border border-white/10 bg-white/[0.03] px-3 text-slate-200 hover:bg-white/[0.08] hover:text-white"
              >
                <span className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-[linear-gradient(135deg,#38bdf8,#818cf8)] text-xs font-semibold text-slate-950">
                  AG
                </span>
                <span className="hidden text-sm md:inline">Allen</span>
                <User className="ml-2 h-4 w-4 text-slate-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="border-white/10 bg-slate-950 text-slate-100">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
