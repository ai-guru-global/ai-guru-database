/** 发布前把仓库根 data/*.json 复制进包内，保证 npm 包自包含。 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.resolve(HERE, "../../../data");
const DEST = path.resolve(HERE, "../data");

if (!fs.existsSync(path.join(SRC, "index.json"))) {
  console.error(`data/ not found at ${SRC}; run \`make dataset\` first.`);
  process.exit(1);
}

fs.mkdirSync(DEST, { recursive: true });
let count = 0;
for (const name of fs.readdirSync(SRC)) {
  if (!name.endsWith(".json")) continue;
  fs.copyFileSync(path.join(SRC, name), path.join(DEST, name));
  count += 1;
}
console.log(`✓ synced ${count} JSON files to packages/ai-industry-graph/data/`);