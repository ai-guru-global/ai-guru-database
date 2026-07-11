---
title: "LLM Engineer's Handbook"
category: "-references-books"
tags:
  - book
  - learning-resource
  - llm
  - mlops
  - engineering
  - paul-iusztin
  - packt
summary: "LLM 工程师手册，端到端讲解 LLM 应用从数据管道、模型训练、评估到生产部署的全栈工程实践，配套完整项目模板。"
sources:
  - "https://packt.link/a/9781836200079"
created: 2026-06-12
updated: 2026-07-11
lifecycle: reviewed
tier: supporting
aliases:
  - "Llm Engineers Handbook"
  - "llm engineers handbook"

---
# LLM Engineer's Handbook

> **一句话理解**: 面向 LLM 工程师的全栈实战手册，从数据工程到模型部署提供端到端工程化方案，强调可复现、可扩展的生产级 LLM 系统构建。

## 书籍信息

| 属性 | 说明 |
|------|------|
| **书名** | LLM Engineer's Handbook |
| **作者** | Paul Iusztin（含 Maxime Labonne 等） |
| **出版社** | Packt（2024） |
| **页数** | 约 400 页 |
| **难度** | ⭐⭐⭐（中级→高级） |
| **代码语言** | Python（PyTorch / Hugging Face / ZenML） |
| **GitHub** | [iusztin2024/llm-engineering-hub](https://github.com/iusztin2024/llm-engineering-hub) |
| **链接** | [Packt](https://packt.link/a/9781836200079) |

## 核心内容概要

1. **LLM 工程概览** — LLM 生态、工程化挑战
2. **数据工程管道** — 数据采集、清洗、合成数据生成
3. **模型训练管道** — 预训练、微调、PEFT（LoRA）
4. **模型评估体系** — 自动化评估、LLM-as-a-Judge、人评
5. **模型推理和服务** — 推理引擎、部署模式
6. **LLM 应用架构** — RAG、Agent、聊天界面
7. **MLOps 工具链** — 实验跟踪、CI/CD、模型注册中心
8. **生产化与监控** — 可观测性、成本管理

## 适合人群

- **级别**: 中级 → 高级
- **前置知识**: Python、深度学习基础、了解 MLOps
- **适合**: LLM 应用工程师、ML 平台工程师

## 知识库章节映射

| 本书章节 | 推荐参考 |
|----------|----------|
| Ch 2 数据工程 | [[机器学习/]] |
| Ch 3 训练 | [[模型训练/]] 、 [[大模型/Fine_tuning_Techniques/GenAI_L18_Fine_Tuning_LLMs]] |
| Ch 4 评估 | [[模型评估/]] |
| Ch 5 推理 | [[部署推理/]] |
| Ch 6 应用 | [[RAG系统/]] 、 [[智能体/]] |
| Ch 7-8 MLOps | [[架构基建/]] 、 [[运维/]] |

## 学习建议

- **阅读顺序**: 先理解整体架构（Ch 1），再按自己角色选择章节深入
- **实战搭配**: 配套 GitHub 仓库跑通完整管道
- **对比阅读**: 与 [[ai-engineering-huyen]] 互补（本书偏工程实现，AI Engineering 偏架构设计）

## 亮点与局限

- ✅ **亮点**: 工程化视角全面、配套代码仓库、覆盖 MLOps 工具链（ZenML 等）
- ⚠️ **局限**: 工具链绑定较强（ZenML/Hugging Face 生态）、版本更新快需注意兼容性

> **关联**: → [[学习/guides/ai_engineering_roadmap_2026|AI 工程路线图]] | [[架构基建/]] | [[部署推理/]]
