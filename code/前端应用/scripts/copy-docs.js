#!/usr/bin/env node

/**
 * Post-build script: copies all referenced Markdown files into dist/docs-content/
 * so they can be served as static assets on GitHub Pages.
 *
 * Reads filePaths from src/data/docMap.ts and copies the actual .md files
 * from the wiki content root (repo-root/wiki) into Web/dist/docs-content/<filePath>.
 */

import { readFileSync, mkdirSync, copyFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const webDir = resolve(__dirname, "..");
// 仓库根 = code/前端应用 → 上溯两级；内容根 = 仓库根/wiki
const repoRoot = resolve(webDir, "..", "..");
const contentRoot = resolve(repoRoot, "wiki");
const distDocsDir = resolve(webDir, "dist", "docs-content");

// 三区口径（P0-3）：非 published 区不得入站打包（防"假入库"）。
// 权威源 = wiki/治理/_meta/infra-dirs.json 的 dirs[].zone + zones 策略块；
// 加载失败时回退内置同值默认（与 JSON 保持一致），不阻断构建。
function loadZonePaths() {
  const fallback = {
    staging: ["原始", "资料与归档/来源", "资料与归档/docs"],
    archive: ["归档"],
  };
  try {
    const infraPath = resolve(
      contentRoot,
      "治理",
      "_meta",
      "infra-dirs.json"
    );
    const infra = JSON.parse(readFileSync(infraPath, "utf-8"));
    const paths = {};
    for (const [zone, spec] of Object.entries(infra.zones ?? {})) {
      if (spec && Array.isArray(spec.paths) && spec.paths.length > 0) {
        paths[zone] = spec.paths;
      }
    }
    return Object.keys(paths).length > 0 ? paths : fallback;
  } catch {
    return fallback;
  }
}

function zoneOf(filePath, zonePaths) {
  const norm = filePath.replace(/\\/g, "/").replace(/\/+$/, "");
  let best = "published";
  let bestLen = -1;
  for (const [zone, paths] of Object.entries(zonePaths)) {
    for (const p of paths) {
      const pNorm = p.replace(/\\/g, "/").replace(/\/+$/, "");
      if (norm === pNorm || norm.startsWith(pNorm + "/")) {
        if (pNorm.length > bestLen) {
          best = zone;
          bestLen = pNorm.length;
        }
      }
    }
  }
  return best;
}

const zonePaths = loadZonePaths();

// Read docMap.ts and extract all filePath values
const docMapPath = resolve(webDir, "src", "data", "docMap.ts");
const docMapContent = readFileSync(docMapPath, "utf-8");

// Match all filePath: "..." entries
const filePathRegex = /filePath:\s*"([^"]+)"/g;
const filePaths = [];
let match;
while ((match = filePathRegex.exec(docMapContent)) !== null) {
  filePaths.push(match[1]);
}

console.log(`Found ${filePaths.length} doc files to copy.`);

let copied = 0;
let skipped = 0;
let zoneBlocked = 0;

for (const fp of filePaths) {
  const zone = zoneOf(fp, zonePaths);
  if (zone !== "published") {
    console.warn(`  SKIP (zone=${zone}, 不得入库): ${fp}`);
    zoneBlocked++;
    skipped++;
    continue;
  }

  const srcPath = resolve(contentRoot, fp);
  const destPath = resolve(distDocsDir, fp);

  if (!existsSync(srcPath)) {
    console.warn(`  SKIP (not found): ${fp}`);
    skipped++;
    continue;
  }

  mkdirSync(dirname(destPath), { recursive: true });
  copyFileSync(srcPath, destPath);
  copied++;
}

console.log(
  `Done: ${copied} copied, ${skipped} skipped (zone blocked: ${zoneBlocked}).`
);
