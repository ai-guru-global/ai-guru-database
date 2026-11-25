#!/usr/bin/env node
/**
 * C4 截图资产管线：从线上生产地址重截四面首屏 → design/统一入口/images/*.png。
 *
 * 背景：统一门户 index.html 内嵌四张面截图（2880×1800，即 1440×900 @2x）。
 * 面改版后截图会过期——面发布上线后跑一次 `make shots`（console/ 下）即可刷新。
 * 直接截生产地址：截图永远与用户所见一致，无需本地起服/构建。
 *
 * 依赖：系统 Google Chrome（channel:'chrome'，免下载浏览器二进制）+
 *       code/前端应用 的 @playwright/test（createRequire 显式解析，不依赖 cwd）。
 * 用法：node tools/scripts/capture_surfaces.mjs [--out <dir>] [--only <关键字>]
 */
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '../../..');
const require = createRequire(import.meta.url);
const { chromium } = require(
  path.join(REPO, 'code/前端应用/node_modules/@playwright/test'));

const BASE = 'https://ai-guru-global.github.io/ai-guru-database/';
const TARGETS = [
  { file: 'site-home-desktop.png', url: BASE + 'portal/surfaces/site/index.html' },
  { file: 'console-app-home-desktop.png', url: BASE + 'portal/surfaces/console/index.html' },
  { file: 'mkdocs-home-desktop.png', url: BASE + 'mkdocs/' },
  { file: 'frontend-home-desktop.png', url: BASE },
];

// ---- 参数 ----
const argv = process.argv.slice(2);
function argOf(name, def) {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : def;
}
const outDir = path.resolve(REPO, argOf('--out', 'design/统一入口/images'));
const only = argOf('--only', '');
fs.mkdirSync(outDir, { recursive: true });

const targets = TARGETS.filter(t => !only || t.file.includes(only) || t.url.includes(only));
if (!targets.length) {
  console.error('✗ --only 无匹配目标：', TARGETS.map(t => t.file).join(', '));
  process.exit(2);
}

const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2, // 2880×1800，与 index.html 的 img 标注一致
});

let failed = 0;
for (const t of targets) {
  const dest = path.join(outDir, t.file);
  try {
    await page.goto(t.url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    // SPA/mkdocs 需要渲染+字体稳定；固定沉淀窗口比 networkidle 可靠（后者会被长连接卡死）
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(3500);
    await page.screenshot({ path: dest });
    const kb = Math.round(fs.statSync(dest).size / 1024);
    console.log(`  [ok] ${t.file}  ${kb}KB  ← ${t.url}`);
  } catch (e) {
    failed++;
    console.error(`  [FAIL] ${t.file} ← ${t.url}\n         ${String(e).slice(0, 200)}`);
  }
}
await browser.close();
if (failed) {
  console.error(`✗ ${failed}/${targets.length} 张截图失败`);
  process.exit(1);
}
console.log(`✓ ${targets.length}/${targets.length} 张截图已更新 → ${path.relative(REPO, outDir)}/`);
