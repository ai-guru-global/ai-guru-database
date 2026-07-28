---
title: "Foundation Model（基础模型）"
category: -concepts
tags: [foundation-model, llm, gpt, claude, gemini, pretrain, transfer-learning]
aliases:
  - "Foundation Model"
  - "Base Model"
  - "基础模型"
relationships:
  - target: "概念/aws-bedrock"
    type: hosted_by
  - target: "概念/openai"
    type: example
  - target: "概念/gemini"
    type: example
sources:
  - 12_架构基建/AWS_Bedrock_Deep_Dive.md
  - 05_大模型/14_Global_LLM_Ecosystem/
summary: "Foundation Model（基础模型）是大规模预训练、可适配多种下游任务的通用模型（如 GPT-5 / Claude Opus 4.8 / Gemini 3 / Llama 4），是当前 LLM 产业的核心资产。"
lifecycle: reviewed
tier: core
provenance:
  extracted: 0.85
  inferred: 0.10
  ambiguous: 0.05
base_confidence: 0.92
created: 2026-06-24
updated: 2026-07-21
name_zh: "基础模型"
---

# Foundation Model（基础模型）

> 中文简称：基础模型

> **一句话理解**: Foundation Model = “通用预训练大模型”，是 LLM 产业的“原材料”；微调和 Prompt 工程都是在这个基础上做适配。

## 核心要点

- **定义**：在大规模数据上预训练、可通过微调或 Prompt 适配多种下游任务的通用大模型
- **核心特征**：
  - **大规模参数**（数十亿到数万亿）
  - **大规模预训练数据**（TB 级文本/图像/视频）
  - **涌现能力**（规模超过阈值后出现）
  - **下游可适配**（SFT / RLHF / Prompt）
- **代表模型**（2026）：
  - 闭源：GPT-5、Claude Opus 4.8、Gemini 3 Ultra
  - 开源：Llama 4、DeepSeek-V3、Qwen3、Mixtral

## 模型层次关系

```
Foundation Model（基础模型）
├── 闭源 API：OpenAI / Anthropic / Google 直接提供
├── 开源权重：Llama / DeepSeek / Qwen / Mistral
└── 适配产物
    ├── 指令微调（SFT）→ Chat 模型
    ├── RLHF / DPO → 对齐模型
    ├── 领域微调 → 行业模型（医疗 / 法律 / 金融）
    └── Prompt → 即用即得（无需训练）
```

## 训练流程

| 阶段 | 目标 | 数据规模 | 成本 |
|------|------|:--------:|:----:|
| **预训练** | 学习语言/世界知识 | 10-100 TB | $10M-$100M |
| **SFT** | 指令跟随能力 | 10K-1M 样本 | $10K-$100K |
| **RLHF/DPO** | 对齐人类偏好 | 10K-100K 对比 | $50K-$500K |
| **领域微调** | 专业能力提升 | 1K-100K 样本 | $5K-$50K |

## 主流厂商一览

| 厂商 | 闭源旗舰 | 开源旗舰 | 生态 | 参数规模 |
|------|---------|---------|------|:--------:|
| **OpenAI** | GPT-5 | - | API + ChatGPT | ~2T (MoE) |
| **Anthropic** | Claude Opus 4.8 | - | API + Claude App | 未公开 |
| **Google** | Gemini 3 Ultra | Gemma 3 | Vertex AI | ~1.5T (MoE) |
| **Meta** | - | Llama 4 | 开放权重 | 405B |
| **DeepSeek** | - | DeepSeek-V3 / R1 | 开放权重 | 671B (MoE) |
| **阿里** | Qwen3-Max | Qwen3 系列 | 开放权重 + API | 72B-235B |
| **Mistral** | - | Mixtral 8x22B | 开放权重 | 176B (MoE) |
| **智谱** | GLM-4 | ChatGLM | 开放权重 + API | 130B |

## 关键属性对比

| 属性 | GPT-5 | Claude Opus 4.8 | Gemini 3 | Llama 4 | DeepSeek-V3 |
|------|-------|-----------------|----------|---------|-------------|
| 上下文 | 256K | 1M | 1M | 10M | 128K |
| 多模态 | ✅ 全 | ✅ 文本+图像 | ✅ 原生全 | ✅ 文本+图像 | ✅ 文本+图像 |
| 工具调用 | ✅ | ✅ | ✅ | ✅ | ✅ |
| 推理 | 极强 | 极强 | 强 | 中-强 | 强 |
| 价格 | $$$$ | $$$ | $$$ | $（自托管）| $ |
| 自托管 | ❌ | ❌ | ❌ | ✅ | ✅ |

## 选型决策树

```
需要极致能力 + 接受闭源？
├── 是 → GPT-5 / Claude Opus 4.8 / Gemini 3 Ultra
└── 否 → 需要私有化？
    ├── 是 → Llama 4 70B+ / DeepSeek-V3 / Qwen3-72B
    └── 否 → 开源 API（Together / Fireworks / DeepSeek API）
```

## 2026 年趋势

| 趋势 | 说明 |
|------|------|
| **MoE 主流化** | 激活参数 << 总参数，推理成本大幅降低 |
| **原生多模态** | 文本/图像/音频/视频统一架构，不再拼接 |
| **超长上下文** | 1M+ token 成为标配，部分达 10M |
| **推理能力内化** | Thinking/Reasoning 模式内置，无需外部 CoT |
| **开源追赶** | DeepSeek/Llama/Qwen 与闭源差距缩小至 <5% |
| **端侧模型** | 1-7B 参数模型在手机/PC 本地运行 |

## 微调与适配路径

| 方法 | 适用场景 | 数据量 | 成本 | 效果 |
|------|---------|:------:|:----:|------|
| **Prompt Engineering** | 通用任务 | 0 | 极低 | 中 |
| **RAG** | 知识密集型 | 0 (外部库) | 低 | 高 |
| **LoRA/QLoRA** | 领域适配 | 1K-50K | 低 | 高 |
| **Full SFT** | 深度定制 | 10K-1M | 高 | 极高 |
| **RLHF/DPO** | 对齐优化 | 10K-100K | 高 | 极高 |
| **Continual Pretrain** | 新语言/新领域 | 1B+ tokens | 极高 | 极高 |

## 评估框架

```python
# 基础模型评估流程示例
from eval_framework import ModelEvaluator

evaluator = ModelEvaluator(
    model="qwen3-72b",
    benchmarks=["mmlu", "humaneval", "gsm8k", "mt-bench"],
    custom_tasks=["domain_qa", "code_review", "summarization"],
    safety_checks=["toxicity", "bias", "hallucination"]
)

results = evaluator.run()
print(results.summary())  # 各维度得分 + 成本分析
```

| 评估维度 | 工具 | 说明 |
|---------|------|------|
| 通用能力 | MMLU / ARC / HellaSwag | 知识+推理 |
| 代码 | HumanEval / MBPP | 代码生成质量 |
| 数学 | GSM8K / MATH | 数学推理 |
| 对话 | MT-Bench / AlpacaEval | 多轮对话质量 |
| 安全 | TruthfulQA / BBQ | 幻觉+偏见 |
| 业务 | 自定义测试集 | 实际场景效果 |

## 部署模式对比

| 模式 | 延迟 | 成本 | 控制力 | 适用 |
|------|:----:|:----:|:------:|------|
| **API 调用** | 中 | 按量 | 低 | 快速验证/小规模 |
| **自托管 (vLLM)** | 低 | 固定 | 高 | 大规模/数据敏感 |
| **Serverless GPU** | 中 | 按量 | 中 | 波动负载 |
| **端侧部署** | 极低 | 一次性 | 极高 | 离线/隐私 |

## 模型生命周期管理

```
预训练 → SFT → 对齐 → 评估 → 部署 → 监控 → 迭代
  │                                          │
  └──── 数据飞轮（用户反馈 → 数据收集 → 重新训练）────┘
```

| 阶段 | 关键指标 | 工具 |
|------|---------|------|
| 预训练 | Loss 曲线 / 吐量 | Megatron / DeepSpeed |
| SFT | 任务准确率 | Axolotl / LLaMA-Factory |
| 对齐 | 胜率 / 安全性 | TRL / OpenRLHF |
| 评估 | Benchmark 分数 | lm-eval-harness |
| 部署 | 延迟 / 吐量 | vLLM / TGI |
| 监控 | 幻觉率 / 用户满意度 | LangSmith / Langfuse |

## 生产最佳实践

1. **场景匹配**: 根据任务复杂度选择模型规模，不要过度配置
2. **开源 vs 闭源**: 数据敏感/合规要求高选开源，追求极致能力选闭源
3. **多模型策略**: 简单任务用小模型，复杂任务用大模型，降低成本
4. **评估先行**: 上线前用业务测试集验证模型能力
5. **版本管理**: 跟踪模型版本更新，定期重新评估
6. **成本控制**: 监控 token 消耗，设置预算告警
7. **回滚预案**: 模型升级后保留回滚能力

## 延伸阅读

- [[概念/LLM/gemini|Google Gemini]]
- [[概念/LLM/llm-architectures|LLM 架构]]
- [[概念/LLM/edge-llm|端侧 LLM]]
- [[概念/LLM/llm-quantization|LLM 量化]]
- [[概念/LLM/llmops|LLMOps]]
- [[概念/LLM/large-language-model|大语言模型]]
- [[12_架构基建/AWS_Bedrock_Deep_Dive|AWS Bedrock 深度解析]]
- [[05_大模型/07_Fine_tuning_Techniques|微调技术]]
- [[08_模型评估/02_Benchmarks/index|基准测试深度解析]]
- [[概念/LLM/llm-benchmarks|LLM Benchmarks]]
- [[概念/LLM/llm-production-pipeline|LLM 生产管线]]

## 延伸阅读

- [[概念/LLM/large-language-model|大语言模型]] — LLM 基础
- [[概念/LLM/reasoning-models|推理模型]] — 前沿方向
- [[概念/LLM/multimodal-llm|多模态 LLM]] — 多模态扩展
- [[概念/LLM/edge-llm|端侧 LLM]] — 轻量化部署