---
title: "模型仓库 (Model Registry)"
category: -concepts
tags: ["model-registry", "model-management", "versioning", "mlflow", "huggingface", "deployment"]
relationships:
  - target: "_concepts/model-deployment"
    type: enables
  - target: "_concepts/mlops"
    type: belongs_to
  - target: "_concepts/model-serving"
    type: feeds_into
sources:
  - 架构基建/AI_Stack_Deep_Dive.md
summary: "模型仓库是管理、版本控制和分发 AI 模型的中心系统。AI Stack 内置模型仓库，预置系统模型并支持自定义模型上传与一键部署。"
provenance:
  extracted: 0.50
  inferred: 0.40
  ambiguous: 0.10
base_confidence: 0.88
lifecycle: stable
tier: core
created: 2026-06-16
updated: 2026-06-16
---

# 模型仓库 (Model Registry)

> 模型的"应用商店"——版本管理、元数据追踪、一键部署的中心枢纽。

---

## 1. 定义

**模型仓库**（Model Registry）是集中管理 AI 模型生命周期（注册、版本控制、元数据标注、审批、分发）的系统。它是 MLOps 流水线的核心组件，连接训练产出和推理部署。

---

## 2. 核心功能

| 功能 | 说明 |
|------|------|
| **模型注册** | 上传模型文件并注册到仓库 |
| **版本管理** | 每次更新创建新版本，支持回滚 |
| **元数据管理** | 记录训练参数、指标、数据来源、许可证 |
| **阶段标记** | Staging → Production → Archived |
| **权限控制** | 基于角色的模型访问控制 |
| **一键部署** | 从仓库直接拉取模型启动推理服务 |
| **模型谱系** | 追踪模型从数据→训练→评估→部署的完整链路 |

---

## 3. 主流模型仓库方案

| 方案 | 类型 | 特点 | 适用场景 |
|------|------|------|----------|
| **Hugging Face Hub** | 公有平台 | 最大开源模型社区 | 开源模型分发 |
| **ModelScope 魔搭** | 公有平台 | 阿里达摩院，中文模型丰富 | 中文模型生态 |
| **MLflow Registry** | 开源/私有 | 实验追踪+模型管理 | 企业 MLOps |
| **Weights & Biases** | 商业 | 实验追踪+模型管理 | 研究团队 |
| **AI Stack 模型仓库** | 私有部署 | 内置系统模型+自定义 | 政企私有化 |
| **OCI Registry** | 标准 | 容器镜像仓库+模型 | K8s 原生 |
| **Git LFS** | 开源 | Git 大文件管理 | 简单模型版本控制 |

---

## 4. AI Stack 模型仓库

AI Stack 内置模型仓库，提供预置模型和自定义模型管理：

| 功能 | 说明 |
|------|------|
| **系统模型** | 预置 Qwen、DeepSeek、GLM、Kimi 等模型 |
| **自定义模型** | 支持用户上传自定义模型 |
| **模型格式** | SafeTensors、GGUF、HuggingFace 格式 |
| **一键部署** | 选择模型 → 选择镜像 → 启动在线服务 |
| **模型体验** | 部署前可在控制台直接体验模型 |

### AI Stack 预置模型分类

| 分类 | 代表模型 |
|------|----------|
| **文本模型** | Qwen3-235B, DeepSeek-V3, QwQ-32B |
| **多模态** | Qwen3-Pro-VL, Qwen2.5-VL-72B |
| **嵌入模型** | Qwen3-Embedding-8B |
| **重排序** | bge-reranker-v2-m3 |
| **代码模型** | Qwen3-Coder-480B-A35B |
| **推理模型** | DeepSeek-R1-0528 |

---

## 5. 模型仓库最佳实践

| 关注点 | 建议 |
|--------|------|
| **命名规范** | `{org}/{model}-{size}-{variant}` 统一格式 |
| **版本策略** | 语义版本号 + 时间戳（如 v1.2.3-20260616） |
| **元数据** | 必须记录：训练数据、许可证、精度指标、硬件需求 |
| **审批流程** | Staging → 人工评审 → Production |
| **模型大小** | 大模型使用分片存储（如 safetensors 分片） |
| **缓存策略** | 热门模型本地缓存，冷模型远端存储 |

---

## 6. 局限与开放问题

1. **大文件管理**：数百 GB 模型的存储和传输效率
2. **跨平台兼容**：不同框架（PyTorch/TF/JAX）的模型格式不统一
3. **安全扫描**：模型文件可能包含恶意代码（pickle 反序列化攻击）
4. **许可证合规**：开源模型的商业使用限制
5. **模型血缘**：追踪模型依赖关系（基础模型→微调→蒸馏）

---

## Related

- [[_concepts/model-deployment]] — 模型部署（模型仓库是部署起点）
- [[_concepts/mlops]] — MLOps（模型仓库是 MLOps 核心）
- [[_concepts/model-serving]] — 模型服务（从仓库到服务）
- [[_concepts/huggingface]] — Hugging Face（最大的开源模型社区）
- [[_concepts/modelscope]] — ModelScope 魔搭（中文模型生态）
- [[架构基建/AI_Stack_Deep_Dive]] — AI Stack（内置模型仓库）
