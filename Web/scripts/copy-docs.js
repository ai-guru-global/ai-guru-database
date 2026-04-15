#!/usr/bin/env node

/**
 * Post-build script: copies all referenced Markdown files into dist/docs-content/
 * so they can be served as static assets on GitHub Pages.
 *
 * Reads filePaths from src/data/docMap.ts and copies the actual .md files
 * from the project root into Web/dist/docs-content/<filePath>.
 */

import { readFileSync, mkdirSync, copyFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const webDir = resolve(__dirname, "..");
const projectRoot = resolve(webDir, "..");
const distDocsDir = resolve(webDir, "dist", "docs-content");

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

for (const fp of filePaths) {
  const srcPath = resolve(projectRoot, fp);
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

console.log(`Done: ${copied} copied, ${skipped} skipped.`);
