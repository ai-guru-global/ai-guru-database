import path from "node:path";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import { chromium } from "@playwright/test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const viteBin = path.resolve(root, "node_modules", "vite", "bin", "vite.js");
const syncScript = path.resolve(root, "scripts", "sync-public.mjs");
const outDir = path.resolve(root, "docs");
const videoDir = path.resolve(root, "docs", ".video");
const outVideo = path.resolve(outDir, "demo.webm");

await fs.mkdir(outDir, { recursive: true });
await fs.rm(videoDir, { recursive: true, force: true });
await fs.mkdir(videoDir, { recursive: true });

await import(path.resolve(syncScript));

const server = spawn(process.execPath, [viteBin, "--host", "127.0.0.1", "--port", "5174", "--strictPort"], {
  cwd: root,
  stdio: ["ignore", "pipe", "pipe"],
});

const waitForReady = async () => {
  const start = Date.now();
  const url = "http://127.0.0.1:5174/?static=1";
  while (Date.now() - start < 25000) {
    try {
      const res = await fetch(url, { method: "GET" });
      if (res.ok) return url;
    } catch {}
    await new Promise((r) => setTimeout(r, 400));
  }
  throw new Error("Vite server not ready");
};

let baseURL;
try {
  baseURL = await waitForReady();
} catch (e) {
  server.kill("SIGTERM");
  throw e;
}

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1365, height: 768 },
  recordVideo: { dir: videoDir, size: { width: 1365, height: 768 } },
});
const page = await context.newPage();
await page.emulateMedia({ reducedMotion: "reduce" });
await page.goto(baseURL, { waitUntil: "networkidle" });
await page.waitForTimeout(700);

await page.click("#graph", { position: { x: 620, y: 360 } }).catch(() => {});
await page.waitForTimeout(700);

await page.fill("#search-input", "Transformer");
await page.waitForTimeout(500);
await page.keyboard.press("ArrowDown");
await page.waitForTimeout(450);
await page.keyboard.press("Enter");
await page.waitForTimeout(900);

await page.click('[data-action="toggle-theme"]');
await page.waitForTimeout(850);

await page.click("#filter-chips button:nth-child(2)");
await page.waitForTimeout(650);
await page.click("#filter-chips button:nth-child(3)");
await page.waitForTimeout(650);

await page.click('[data-action="reset-view"]');
await page.waitForTimeout(900);

await context.close();
await browser.close();

server.kill("SIGTERM");

const files = await fs.readdir(videoDir, { recursive: true });
const webm = files.find((f) => String(f).endsWith(".webm"));
if (!webm) throw new Error("Video not found");

await fs.copyFile(path.resolve(videoDir, webm), outVideo);
await fs.rm(videoDir, { recursive: true, force: true });

