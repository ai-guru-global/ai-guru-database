# AI Guru Knowledge Atlas（D3）

入口页面：

- 新版：`visualization/atlas/index.html`（Vite 开发/构建）
- 旧版：`visualization/index.html`（历史保留）

## 本地运行

```bash
cd visualization/atlas
pnpm install
pnpm dev
```

访问：

- http://127.0.0.1:5174/

## 可视化回归测试（VRT）

```bash
pnpm test:e2e:update
pnpm test:e2e
```

阈值：`maxDiffPixelRatio = 0.003`（≤ 0.3%）

## 交付物生成

```bash
pnpm docs:pdf
pnpm demo:record
pnpm build
pnpm perf:lhci
```
