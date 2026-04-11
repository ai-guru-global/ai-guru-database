import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const srcData = path.resolve(root, "..", "data.json");
const srcFavicon = path.resolve(root, "..", "favicon.svg");
const publicDir = path.resolve(root, "public");

await fs.mkdir(publicDir, { recursive: true });
await fs.copyFile(srcData, path.join(publicDir, "data.json"));
await fs.copyFile(srcFavicon, path.join(publicDir, "favicon.svg"));

