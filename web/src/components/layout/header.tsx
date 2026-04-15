import { Link, useLocation } from "react-router-dom";
import { Search, Menu, X, BookOpen, Settings, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/utils/cn";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Documentation", href: "/docs" },
  { label: "K8s Eval", href: "/k8s-evaluation" },
  { label: "K8s Live", href: "/k8s-real-evaluation" },
  { label: "Search", href: "/search" },
];

const settingsItems = [
  { label: "Qwen", href: "/settings/qwen" },
  { label: "GLM", href: "/settings/glm" },
  { label: "Minimax", href: "/settings/minimax" },
  { label: "Kimi", href: "/settings/kimi" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <BookOpen className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">
              AI Guru
            </span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  location.pathname === item.href
                    ? "text-foreground"
                    : "text-foreground/60"
                )}
              >
                {item.label}
              </Link>
            ))}
            <div className="relative">
              <button
                onClick={() => setSettingsOpen(!settingsOpen)}
                className={cn(
                  "flex items-center gap-1 transition-colors hover:text-foreground/80",
                  location.pathname.startsWith("/settings")
                    ? "text-foreground"
                    : "text-foreground/60"
                )}
              >
                <Settings className="h-4 w-4" />
                Settings
                <ChevronDown className="h-3 w-3" />
              </button>
              {settingsOpen && (
                <div className="absolute left-0 top-full mt-2 w-40 rounded-md border bg-background shadow-lg">
                  {settingsItems.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      className="block px-4 py-2 text-sm hover:bg-muted"
                      onClick={() => setSettingsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Button
              variant="outline"
              className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 relative w-full justify-start text-sm text-muted-foreground shadow-none md:pr-12 md:w-40 lg:w-64"
              asChild
            >
              <Link to="/search">
                <Search className="mr-2 h-4 w-4" />
                Search...
                <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 md:flex">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </Link>
            </Button>
          </div>
          <ThemeToggle />
          <Button
            variant="ghost"
            className="md:hidden"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container py-4">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors",
                    location.pathname === item.href
                      ? "text-foreground"
                      : "text-foreground/60"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-2">
                <p className="text-sm font-medium text-foreground/60">Settings</p>
                {settingsItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="block py-2 text-sm font-medium text-foreground/60 hover:text-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
