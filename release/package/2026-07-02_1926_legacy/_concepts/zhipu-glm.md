---
title: "智谱 AI / GLM 模型系列 (Zhipu AI & GLM Model Family)"
category: -concepts
tags: ["zhipu", "glm", "chatglm", "chinese-llm", "tsinghua", "ai-stack"]
relationships:
  - target: "_concepts/llm-architectures"
    type: related_to
  - target: "_concepts/deepseek-models"
    type: related_to
  - target: "_concepts/moonshot-kimi"
    type: related_to
sources:
  - 12_Architecture_Infrastructure/AI_Stack_Deep_Dive.md
summary: "智谱 AI（ZhipuAI）是清华大学背景的 AI 公司，GLM 系列模型（ChatGLM 起家）是中国最早开源的大模型之一。AI Stack 预置 GLM-5.1/GLM5 系列。"
provenance:
  extracted: 0.30
  inferred: 0.60
  ambiguous: 0.10
base_confidence: 0.80
lifecycle: stable
tier: supporting
---

# 智谱 AI / GLM 模型系列

> **一句话理解**: 智谱 AI 是"学院派开源先锋"——背靠清华大学 NLP 实验室，ChatGLM 是中国最早开源的大模型之一，GLM-5.1 是最新旗舰。

---

## 1. 公司概况

| 维度 | 信息 |
|------|------|
| **公司名** | 智谱 AI (Zhipu AI) |
| **背景** | 清华大学 NLP 实验室孵化 |
| **核心人物** | 唐杰（清华大学教授） |
| **成立时间** | 2019 年 |
| **核心产品** | GLM 系列模型、BigModel 平台 |
| **开源贡献** | ChatGLM-6B（最早中文开源模型之一） |

---

## 2. GLM 模型演进

| 模型 | 时间 | 特点 |
|------|------|------|
| **ChatGLM-6B** | 2023.03 | 中国最早开源大模型之一 |
| **ChatGLM2-6B** | 2023.06 | 上下文 32K |
| **ChatGLM3-6B** | 2023.10 | 工具调用、代码生成 |
| **GLM-4** | 2024.01 | 128K 上下文、多模态 |
| **GLM-5** | 2024.xx | 新一代架构 |
| **GLM-5.1** | 2025.xx | 最新旗舰版 |

---

## 3. AI Stack 预置模型

| 模型 | 精度 | 说明 |
|------|------|------|
| **GLM-5.1-INT8** | INT8 | GLM-5.1 量化版 |
| **GLM5-INT8** | INT8 | GLM5 量化版 |
| **GLM-5.1-W4A8** | W4A8 | 4-bit 权重 + 8-bit 激活 |

### W4A8 量化说明

| 标记 | 含义 |
|------|------|
| W4 | 权重 4-bit 量化 |
| A8 | 激活值 8-bit 量化 |
| 效果 | 显存约为 BF16 的 25%，精度退化 ~2% |

---

## 4. GLM 架构特点

| 特点 | 说明 |
|------|------|
| **GLM 架构** | General Language Model，自回归填空预训练 |
| **Prefix LM** | 前缀语言模型，双向编码 + 自回归解码 |
| **中文优化** | 清华中文语料训练，中文能力强 |
| **工具调用** | 原生支持 Function Calling |

---

## 5. 在中国大模型生态的位置

| 维度 | GLM (智谱) | Qwen (阿里) | DeepSeek | Kimi (Moonshot) |
|------|-----------|------------|----------|----------------|
| **学术根基** | 清华 NLP | 阿里达摩院 | 幻方量化 | 清华交叉 |
| **开源时间** | 2023.03（最早） | 2023.08 | 2024.01 | 部分开源 |
| **核心优势** | 学术+开源平衡 | 全能生态 | 高效开源 | 超长上下文 |
| **商业平台** | BigModel.cn | 百炼平台 | API 服务 | Kimi Chat |

---

## Related

- [[_concepts/llm-architectures]] — LLM 架构
- [[_concepts/deepseek-models]] — DeepSeek 系列
- [[_concepts/moonshot-kimi]] — Moonshot/Kimi 系列
- [[_concepts/llm-data-engineering]] — LLM 数据工程
- [[12_Architecture_Infrastructure/AI_Stack_Deep_Dive]] — AI Stack 深度解析
