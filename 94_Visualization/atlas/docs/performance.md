# 性能审计报告（Lighthouse）

运行方式：

- 在 [package.json](file:///Users/ai-guru/Documents/GitHub/ai-guru-global/ai-guru-database/visualization/atlas/package.json) 中执行 `perf:lhci`
- 报告输出目录：`visualization/atlas/docs/lighthouse/`

验收阈值：

- Lighthouse Performance ≥ 90
- CLS ≤ 0.1

结果：

- 代表性报告（isRepresentativeRun=true）：`docs/lighthouse/127_0_0_1-_-2026_04_11_06_33_50.report.html`
- Performance：96
- Accessibility：100
- Best Practices：100
- SEO：82
- CLS：0.0096
- FCP：293 ms
- LCP：447 ms
- TBT：162 ms
