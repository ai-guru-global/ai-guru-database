---
title: Qwen 系列模型架构演进
category: concepts
tags:
  - llm
  - qwen
  - alibaba
  - architecture
  - open-source
  - multilingual
aliases:
  - Qwen Series
  - Qwen 系列
  - 通义千问
relationships:
  - target: "概念/transformer-architecture"
    type: evolves_from
  - target: "概念/rope"
    type: uses
  - target: "概念/long-context-llm"
    type: related_to
summary: Qwen（通义千问）是阿里巴巴开源的大模型系列，从 Qwen-1 到 Qwen-2.5，在中文能力、代码、数学、长上下文和多模态等方面持续领先，是中文开源生态的重要基座。
lifecycle: reviewed
tier: core
created: 2026-06-25
updated: 2026-07-21
sources: []
name_zh: "Qwen 系列模型架构演进"
---

# Qwen 系列模型架构演进

> 中文简称：Qwen 系列模型架构演进

## 一句话总结

**Qwen（通义千问）** 是阿里巴巴开源的大语言模型系列，以强大的中文能力、代码能力和长上下文支持成为中文开源生态的核心力量。

---

## 架构特点

| 组件 | 选择 |
|---|---|
| **架构** | Decoder-only Transformer |
| **位置编码** | RoPE |
| **归一化** | RMSNorm + Pre-Norm |
| **激活函数** | SwiGLU |
| **注意力** | MHA / GQA（Qwen-2）|
| **词表** | 多语言扩展词表 |

---

## Qwen-1（2023）

### 关键特点

- 参数规模：1.8B、7B、14B、72B
- 上下文长度：2K / 8K / 32K
- 训练数据：高质量中英文数据
- 特点：
  - 中英文平衡优秀；
  - 支持 14B 等小尺寸高性能模型；
  - 发布 Chat 版本。

### 衍生模型

- **Qwen-VL**：视觉语言模型；
- **Qwen-Audio**：音频语言模型；
- **CodeQwen**：代码模型。

---

## Qwen-1.5 / Qwen-2（2024）

### 关键改进

| 方面 | 改进 |
|---|---|
| **参数规模** | 0.5B ~ 72B |
| **上下文长度** | 32K / 128K |
| **GQA** | 大模型采用分组查询注意力 |
| **SwiGLU** | 统一使用 SwiGLU 激活 |
| **多语言** | 支持 29 种语言 |
| **对齐** | 更强的 SFT 和 RLHF |

### Qwen-2 亮点

- 同规模性能达到当时开源模型前列；
- 长上下文能力显著提升；
- 小模型（1.8B、7B）性能强劲。

---

## Qwen-2.5（2024）

### 关键改进

| 方面 | 改进 |
|---|---|
| **参数规模** | 0.5B ~ 72B，以及 MoE 版本 |
| **上下文长度** | 标准 32K，长文本版 128K |
| **训练数据** | 更大规模、更高质量 |
| **指令遵循** | 大幅提升 |
| **工具使用** | Function Calling 能力增强 |
| **多模态** | Qwen2-VL、Qwen2-Audio |

### Qwen2.5-Coder / Math

- **Coder**：专注代码生成、补全、推理；
- **Math**：数学推理增强。

---

## 架构演进对比

| 特性 | Qwen-1 | Qwen-2 | Qwen-2.5 |
|---|---|---|---|
| 最大参数 | 72B | 72B | 72B + MoE |
| 上下文 | 32K | 128K | 128K |
| GQA | 部分 | 是 | 是 |
| 多模态 | Qwen-VL | Qwen2-VL | Qwen2.5-VL |
| 工具调用 | 基础 | 较强 | 强 |

---

## 开源生态

- **vLLM、SGLang、llama.cpp** 等主流推理引擎均支持 Qwen；
- **LLaMA-Factory、Axolotl、XTuner** 支持 Qwen 微调；
- 大量中文应用基于 Qwen 构建。

---

## 延伸阅读

- [[概念/transformer-architecture|Transformer 架构]]
- [[概念/rope|RoPE]]
- [[概念/long-context-llm|长上下文 LLM]]
- [[概念/multimodal-llm|多模态 LLM]]
- [[概念/function-calling|Function Calling]]

## See Also (深度专题)

- [[../../05_大模型/15_Chinese_LLM_Ecosystem/Qwen_Deep_Dive|Qwen (通义千问) 深度解析]] — Qwen 系列架构演进、长上下文与多模态能力的技术分析

---

## 2026 Qwen 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **Qwen3** | 混合注意力 + MoE，支持 128K 上下文 | GA |
| **Qwen3-Thinking** | 推理模型，支持思维链显示 | GA |
| **Qwen2.5-VL** | 视觉语言模型，动态分辨率 | GA |
| **Qwen-Agent** | 官方 Agent 框架，支持工具调用 | GA |
| **Qwen-Coder** | 代码专用模型，支持 92 种语言 | GA |

## 生产最佳实践

1. **模型选择**：简单任务用 Qwen3-8B，复杂任务用 Qwen3-72B 或 Qwen3-Pro
2. **长上下文利用**：Qwen3 支持 128K，适合长文档分析
3. **多模态能力**：需要图像理解时用 Qwen2.5-VL
4. **成本优化**：MoE 架构推理成本低，适合高并发场景
5. **中文场景优先**：Qwen 中文能力业界领先，中文场景优先考虑
6. **推理框架**：vLLM/SGLang/TensorRT-LLM 均支持 Qwen 系列
7. **微调优化**：用 LoRA/QLoRA 微调适配特定领域

## Qwen 系列演进

| 版本 | 发布时间 | 关键创新 |
|------|----------|----------|
| Qwen 1.0 | 2023-08 | 首发 7B-72B |
| Qwen 1.5 | 2024-02 | 多语言优化 |
| Qwen 2 | 2024-06 | 性能大幅提升 |
| Qwen 2.5 | 2024-09 | VL/Coder/Math 专项 |
| Qwen 3 | 2025-04 | MoE + 混合注意力 |

## 延伸阅读

- [[概念/LLM/llama-series|Llama 系列]]
- [[概念/LLM/gpt-series-evolution|GPT 系列演进]]
- [[05_大模型/15_Chinese_LLM_Ecosystem/Qwen_Deep_Dive|Qwen 深度解析]]

## Qwen3 模型矩阵 (2026)

| 模型 | 参数 | 架构 | 上下文 | 特点 |
|------|------|------|--------|------|
| **Qwen3-235B-A22B** | 235B (22B active) | MoE | 128K | 旗舰，中文 SOTA |
| **Qwen3-32B** | 32B | Dense | 128K | 最强 Dense |
| **Qwen3-14B** | 14B | Dense | 128K | 性价比之王 |
| **Qwen3-8B** | 8B | Dense | 128K | 端侧/边缘 |
| **Qwen3-4B** | 4B | Dense | 32K | 超轻量 |
| **Qwen3-VL** | 多规格 | MoE/Dense | 128K | 多模态 |
| **Qwen3-Coder** | 多规格 | Dense | 128K | 代码专项 |

## Qwen 生态工具链

| 工具 | 说明 | 状态 |
|------|------|------|
| **Qwen-Agent** | 官方 Agent 框架，工具调用 + RAG | GA |
| **Qwen-VL-Utils** | 视觉输入处理工具 | GA |
| **ModelScope** | 阿里模型托管平台 | GA |
| **PAI-EAS** | 阿里云模型服务 | GA |
| **vLLM/SGLang** | 第三方推理引擎全支持 | GA |

## 生产最佳实践

1. **中文场景优先 Qwen**：中文能力开源最强，无需额外微调
2. **MoE 考虑显存**：235B MoE 需要多卡，小场景用 14B/8B
3. **量化部署**：官方提供 GPTQ/AWQ 量化版本，直接用
4. **工具调用**：Qwen3 原生支持 Function Calling，无需额外适配
5. **混合思考**：Qwen3 支持 thinking/non-thinking 模式切换
