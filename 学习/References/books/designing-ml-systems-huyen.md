---
title: "Designing Machine Learning Systems"
category: "-references-books"
tags:
  - book
  - learning-resource
  - ml-systems
  - mlops
  - system-design
  - chip-huyen
  - oreilly
summary: "Chip Huyen 的 ML 系统设计权威指南，系统讲解从需求分析、数据工程、训练、部署到监控的 ML 系统全生命周期设计方法论。"
sources:
  - "https://www.oreilly.com/library/view/designing-machine-learning/9781098107956/"
created: 2026-06-12
updated: 2026-07-11
lifecycle: reviewed
tier: supporting
aliases:
  - "Designing Ml Systems Huyen"
  - "designing ml systems huyen"

---
# Designing Machine Learning Systems

> **一句话理解**: ML 系统设计领域的标杆之作，从工程师视角拆解真实 ML 系统的全生命周期，是 MLOps 与 ML 系统面试的必备参考书。

## 书籍信息

| 属性 | 说明 |
|------|------|
| **书名** | Designing Machine Learning Systems: An Iterative Process for Production-Ready Applications |
| **作者** | Chip Huyen |
| **出版社** | O'Reilly（2022） |
| **页数** | 约 350 页 |
| **难度** | ⭐⭐⭐（中级→高级） |
| **链接** | [O'Reilly](https://www.oreilly.com/library/view/designing-machine-learning/9781098107956/) |

## 核心内容概要

全书以迭代式 ML 系统开发流程组织：

1. **ML 系统概览** — 传统软件 vs ML 系统、ML 系统的挑战
2. **需求与框架** — 业务目标、约束条件、非功能性需求
3. **数据工程** — 数据来源、标注、增强、特征工程
4. **特征工程系统** — 特征存储（Feature Store）、持续训练
5. **模型评估与离线指标** — 指标选择、偏差-方差、分布偏移
6. **模型部署模式** — 影子部署、Canary、A/B 测试、级联
7. **监控与持续学习** — 监控指标、数据漂移检测、模型更新
8. **MLOps 实践** — CI/CD for ML、基础设施、工具链
9. **隐式反馈与数据闭环** — 在线学习、反馈循环

## 适合人群

- **级别**: 中级 → 高级
- **前置知识**: 了解 ML 基础、有工程经验
- **适合**: ML 工程师、MLOps 工程师、准备 ML 系统面试的工程师

## 知识库章节映射

| 本书章节 | 推荐参考 |
|----------|----------|
| Ch 3-4 数据工程 | [[机器学习/]] |
| Ch 5 模型评估 | [[模型评估/]] |
| Ch 6 部署 | [[部署推理/]] |
| Ch 7 监控 | [[模型运维/]] 、 [[运维/]] |
| Ch 8 MLOps | [[架构基建/]] |

## 学习建议

- **阅读顺序**: 全书顺序阅读，每章结合工作中的真实场景对照
- **面试准备**: 重点关注 Ch 6 部署模式与 Ch 7 监控
- **后续阅读**: 读完后进阶 [[ai-engineering-huyen]]（基础模型时代的系统设计）

## 亮点与局限

- ✅ **亮点**: 案例丰富、覆盖 MLOps 全景、面试友好、结构清晰
- ⚠️ **局限**: 成书于 LLM 爆发前（2022），未深入 LLM 系统设计（需搭配 AI Engineering）；代码示例少

> **关联**: → [[学习/guides/ai_engineering_roadmap_2026|AI 工程路线图]] | [[模型运维/]] | [[架构基建/]]
