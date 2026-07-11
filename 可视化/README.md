---
title: 知识图谱可视化 (Visualization)
category: 94-visualization
tags: ["visualization", "charts", "dashboards", "data-viz"]
summary: "> **一句话理解**: 本章节提供 AI Guru 知识库的交互式可视化界面，将 22 个章节、500+ 文档的知识网络以图谱形式呈现，支持直观浏览和探索。"
created: 2026-05-31
updated: 2026-05-31
tier: supporting
sources: []

---
# 知识图谱可视化 (Visualization)

> **一句话理解**: 本章节提供 AI Guru 知识库的交互式可视化界面，将 22 个章节、500+ 文档的知识网络以图谱形式呈现，支持直观浏览和探索。

---

## 本章内容

| 文件 | 说明 |
|------|------|
| `index.html` | 交互式知识图谱主页面（44KB，独立运行） |
| `data.json` | 图谱数据：节点（章节/文档）与边（引用关系） |
| `favicon.svg` | 站点图标 |
| `atlas/` | 图谱资源文件（217MB，包含渲染所需的纹理与数据） |

---

## 使用方法

### 本地启动
```bash
cd 94_Visualization
python -m http.server 8080
# 浏览器访问 http://localhost:8080
```

或直接双击 `index.html` 在浏览器中打开（部分功能可能需要本地服务器）。

### 功能特性
- **节点浏览** — 点击章节节点查看包含的文档列表
- **关系探索** — 查看章节之间的引用关系
- **搜索定位** — 快速定位特定主题
- **路径发现** — 发现知识点之间的学习路径

---

## 数据更新

当新增或调整章节结构时，需要同步更新 `data.json`：

1. 修改 `data.json` 中的节点列表（`nodes` 数组）
2. 更新边关系（`links` 数组）
3. 重新加载页面查看效果

---

## 与其他章节的关联

- [治理/notes](../治理/notes/AI_Concept_Knowledge_Graph.md) — 概念知识图谱的数据来源
- [90_Learn](../学习/README.md) — 学习路径的可视化呈现

---

*本章节为可视化工具，不直接包含学习内容。建议在学完基础概念后，使用可视化工具探索知识关联。*

## Related
- [[可视化/Training_Monitoring_Visualization|训练监控可视化 (Training Monitoring Visualization)]]
- [[可视化/Visualization_for_dummy|AI 可视化 - 小白版]]
- [[可视化/AI_System_Dashboard|AI 系统监控仪表盘]]
- [[可视化/README_for_dummy|94 Visualization — 小白版 📊]]
- [[可视化/Model_Interpretability_Visualization|模型可解释性可视化]]

- [[前端应用/atlas/README]] — AI Guru Knowledge Atlas（D3） (共享: charts, dashboards, data-viz, visualization)
- [[前端应用/atlas/docs/performance]] — 性能审计报告（Lighthouse） (共享: charts, dashboards, data-viz, visualization)
- [[可视化/Training_Monitoring_Visualization.md|Training_Monitoring_Visualization]]
- [[可视化/Visualization_for_dummy.md|Visualization_for_dummy]]
- [[可视化/AI_System_Dashboard.md|AI_System_Dashboard]]
- [[可视化/README_for_dummy.md|README_for_dummy]]
- [[可视化/Model_Interpretability_Visualization.md|Model_Interpretability_Visualization]]

