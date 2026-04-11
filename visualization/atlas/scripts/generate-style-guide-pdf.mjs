import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const htmlPath = path.resolve(root, "docs", "style-guide.html");
const outPath = path.resolve(root, "docs", "style-guide.pdf");

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
await page.goto(pathToFileURL(htmlPath).toString(), { waitUntil: "networkidle" });
await page.emulateMedia({ media: "screen" });

await page.pdf({
  path: outPath,
  format: "A4",
  printBackground: true,
  margin: { top: "14mm", right: "12mm", bottom: "14mm", left: "12mm" },
});

await browser.close();

