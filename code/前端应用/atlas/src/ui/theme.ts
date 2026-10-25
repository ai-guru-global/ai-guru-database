const STORAGE_KEY = "ai-guru-atlas-theme";

export type ThemeMode = "auto" | "dark" | "light";

function isThemeMode(value: unknown): value is ThemeMode {
  return value === "auto" || value === "dark" || value === "light";
}

export function getStoredTheme(): ThemeMode {
  const v = window.localStorage.getItem(STORAGE_KEY);
  if (isThemeMode(v)) return v;
  return "auto";
}

export function setTheme(mode: ThemeMode): void {
  document.body.dataset.theme = mode;
  window.localStorage.setItem(STORAGE_KEY, mode);
}

export function toggleTheme(): ThemeMode {
  const current = (document.body.dataset.theme as ThemeMode | undefined) ?? "auto";
  const next: ThemeMode = current === "auto" ? "dark" : current === "dark" ? "light" : "auto";
  setTheme(next);
  return next;
}

