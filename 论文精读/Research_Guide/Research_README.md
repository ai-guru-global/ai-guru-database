---
title: '课题研究 (Research)'
category: '22-research'
tags: ["research", "study", "investigation", "deep-dive", "experiment"]
summary: '> **一句话理解**: 本章节用于系统性课题研究，每个课题包含问题定义、文献调研、分析论证和结论产出，是知识库深度知识生产的核心区域。'
created: '2026-06-25'
updated: '2026-06-25'
tier: supporting
sources: []
---
# 课题研究 (Research)

> **一句话理解**: 本章节用于系统性课题研究，每个课题包含问题定义、文献调研、分析论证和结论产出，是知识库深度知识生产的核心区域。

---

## 目录结构

每个课题以独立子目录组织，建议结构如下：

```
论文精读/Methodology/
├── README.md                          # 本文件
├── Research_Template.md               # 课题模板
└── <课题名称>/                         # 每个课题一个目录
    ├── 00_问题定义与范围.md             # 研究问题、目标、范围
    ├── 01_文献调研.md                  # 相关论文、文章、资料综述
    ├── 02_分析与论证.md                # 核心分析、实验、对比
    ├── 03_结论与产出.md                # 研究结论、建议、下一步
    └── assets/                        # 图表、数据等附件
```

## 课题命名规范

- 使用 **Title_Case** 英文命名（如 `LLM_Inference_Optimization`）
- 目录名使用下划线分隔，避免空格

## 进行中课题

| 课题 | 状态 | 开始时间 | 负责人 |
|------|------|----------|--------|
| [LLM_Inference_Getting_Started](./LLM_Inference_Getting_Started/) | ✅ 已完成 | 2026-06-25 | AI Guru |

## 已完成课题

| 课题 | 完成时间 | 主要产出 |
|------|----------|----------|
| [LLM_Inference_Getting_Started](./LLM_Inference_Getting_Started/) | 2026-06-25 | 19 项学校类比映射 · 5 步动手实验 · 推荐阅读路径 |

---

## 与其他章节的关联

- [20_Papers](../论文精读/README.md) — 论文阅读，可为课题提供文献支撑
- [综合](../治理/README.md) — 综合分析，课题成果可沉淀为 synthesis 文章
- [治理/notes](../治理/notes/README.md) — 概念笔记，课题中产生的新概念可补充至此

---

*本章节供研究者和学习者使用，欢迎从实际问题出发开展深度课题研究。*

## Related
- [[论文精读/Research_Template|课题研究模板 🔬]]
