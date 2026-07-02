---
title: AI Guru Knowledge Atlas（D3）
category: 94-visualization-atlas
tags: ["visualization", "charts", "dashboards", "data-viz"]
summary: "新版：`visualization/atlas/index.html`（Vite 开发/构建）"
created: 2026-05-31
updated: 2026-05-31
tier: supporting

---
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

## Related

- [[94_Visualization/README]] — 知识图谱可视化 (Visualization) (共享: charts, dashboards, data-viz, visualization)
- [[94_Visualization/atlas/docs/performance]] — 性能审计报告（Lighthouse） (共享: charts, dashboards, data-viz, visualization)
