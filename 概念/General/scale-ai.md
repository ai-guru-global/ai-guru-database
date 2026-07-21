---
title: "Scale AI (AI 数据标注与 RLHF 平台)"
category: -concepts
tags: ["data-labeling", "rlhf", "human-feedback", "enterprise", "saas"]
relationships:
  - target: "概念/label-studio"
    type: related_to
  - target: "概念/humanloop"
    type: related_to
sources:
  - 架构基建/AI_Stack_Deep_Dive.md
summary: "全球领先的 AI 数据标注 SaaS 平台，为 OpenAI/Meta/Microsoft 等顶级 AI 公司提供 RLHF 数据和训练数据，估值超 130 亿美元。"
provenance:
  extracted: 0.55
  inferred: 0.35
  ambiguous: 0.10
base_confidence: 0.82
lifecycle: reviewed
created: 2026-06-12
updated: 2026-07-21
tier: supporting
---

# Scale AI

[Scale AI](https://scale.com/) 是全球领先的 **AI 数据标注与 RLHF 平台**，为 OpenAI、Meta、Microsoft、Anthropic 等顶级 AI 公司提供高质量训练数据和人类反馈。它是 AI 数据标注赛道的**绝对龙头**，估值超 130 亿美元（2024），旗下产品覆盖数据标注、RLHF、模型评估和 GenAI 平台。

## 核心产品线

### 1. Scale Data Engine

- **RLHF 数据**: 为 LLM 对齐训练提供人类偏好排序数据
- **SFT 数据**: 高质量指令-响应对
- **标注服务**: 图像/文本/3D/视频多模态标注
- **Red Teaming**: 模型安全性测试数据

### 2. Scale GenAI Platform

- **模型评估**: 多维度 LLM 评估
- **Prompt 工程**: Prompt 模板管理
- **Fine-tuning**: 微调数据准备和管理

### 3. Scale Rapid

- **快速标注**: 24 小时内交付标注结果
- **API 驱动**: 通过 API 提交标注任务

## 与 Label Studio 对比

| 维度 | Scale AI | Label Studio |
|------|----------|-------------|
| **类型** | SaaS 平台 | 开源自托管 |
| **标注员** | 全球标注团队 | 自带团队 |
| **质量保障** | 多层 QA | 自建 |
| **RLHF** | ✅ (核心) | 需自建 |
| **成本** | 高 (按量) | 低 (自建) |
| **数据安全** | SOC2/ISO | 自建 |
| **适用规模** | 企业级 | 中小-企业 |

## 典型应用场景

- **LLM 训练**: GPT-4/Claude 等模型的 RLHF 数据
- **自动驾驶**: Waymo/Tesla 的 3D 点云标注
- **政府 AI**: 国防 AI 项目的数据标注
- **模型评估**: LLM 排行榜和红队测试

## 参考资源

- [Scale AI 官网](https://scale.com/)
- [Scale GenAI Platform](https://scale.com/platform)

## 相关概念

- [[概念/label-studio]] — Label Studio 开源数据标注平台
- [[概念/humanloop]] — Humanloop Prompt 工程与评估
- [[概念/lm-eval-harness]] — LM Evaluation Harness 标准化评估

---

## 2026 Scale AI 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **Scale AI** | 数据标注平台 | GA |
| **RLHF 数据** | 人类反馈数据 | GA |
| **模型评估** | 模型评估服务 | GA |
| **企业级标注** | 企业数据标注 | GA |
| **LLM 数据** | LLM 训练数据 | GA |

## 生产最佳实践

1. **数据标注**：高质量数据用 Scale AI 标注
2. **RLHF 数据**：RLHF 训练用 Scale AI 数据
3. **模型评估**：模型评估用 Scale AI
4. **与 Label Studio 对比**：Scale AI 企业级，Label Studio 开源
5. **质量控制**：标注数据质量控制
