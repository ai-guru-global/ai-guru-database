---
title: "Large Language Model"
category: concepts
tags: [llm, nlp, transformer, foundation-model, generative-ai]
summary: "大语言模型（LLM）是基于 Transformer 架构、通过海量文本预训练得到的超大规模神经网络，能够理解、生成和推理自然语言，是当前生成式 AI 与智能代理的核心底座。"
created: 2026-07-02
updated: 2026-07-21
sources:
  - "https://arxiv.org/abs/1706.03762"  # Attention Is All You Need
  - "https://arxiv.org/abs/2005.14165"  # GPT-3
---

# Large Language Model（大语言模型）

## 定义

大语言模型（Large Language Model，LLM）是一类参数量通常在数十亿到数万亿级别、以自然语言为主要处理对象的深度神经网络。它通过在海量无标注文本上进行自监督预训练，学习语言的统计规律、世界知识与推理模式，从而具备文本生成、理解、翻译、摘要、问答等多种能力。

## 核心原理与组成

### 架构基础

LLM 的核心架构几乎普遍基于 Transformer，尤其是 Decoder-only 的 GPT 类结构：

| 组件 | 作用 |
|------|------|
| **Tokenizer** | 将文本切分为 token（BPE/SentencePiece） |
| **Embedding** | 将 token 映射为高维向量 |
| **Transformer Block** | Self-Attention + FFN，多层堆叠 |
| **LayerNorm / RMSNorm** | 稳定训练 |
| **输出层** | 将隐藏状态映射为词表概率分布 |

### 训练流程

```
① 预训练 (Pre-training)
   - 目标：Next Token Prediction（自回归）
   - 数据：数万亿 token 的网页、书籍、代码
   - 算力：数千 GPU × 数周/数月
   - 产出：基座模型（Base Model）

② 后训练 (Post-training)
   - SFT（监督微调）：学习遵循指令
   - RLHF / DPO：对齐人类偏好
   - 安全训练：拒绝有害请求
   - 产出：对话模型（Chat/Instruct Model）

③ 可选：领域微调
   - 继续预训练：注入领域知识
   - 任务微调：特定任务优化
```

### 推理机制

- **KV Cache**：缓存已计算的 Key/Value，避免重复计算
- **解码策略**：Temperature Sampling、Top-p、Top-k、Beam Search
- **推测解码**：用小模型草稿 + 大模型验证加速

## 2026 主流 LLM 生态

| 模型 | 开发者 | 参数量 | 特点 |
|------|--------|--------|------|
| GPT-4o / o3 | OpenAI | 未公开 | 多模态、推理模型 |
| Claude 4 | Anthropic | 未公开 | 长上下文、安全性 |
| Gemini 2.5 | Google | 未公开 | 超长上下文、多模态 |
| DeepSeek-V3/R1 | DeepSeek | 671B MoE | 开源、推理强 |
| Qwen3 | 阿里 | 0.6B-235B | 全尺寸开源 |
| Llama 4 | Meta | 109B-400B+ | 开源、超长上下文 |

## 典型用例

- **对话与问答**：ChatGPT、Claude、Kimi、Qwen 等 Chat 模型
- **内容生成**：文案、代码、报告、邮件与创意写作
- **信息抽取与推理**：命名实体识别、关系抽取、数学与逻辑推理
- **RAG 与 Agent**：作为检索增强生成和智能代理的"大脑"
- **代码智能**：代码生成、审查、调试、重构
- **多模态理解**：图片、音频、视频理解与生成

## 与相关概念的区别与联系

| 概念 | 与 LLM 的关系 |
|------|----------------|
| **Foundation Model** | LLM 是其最典型子集，后者还包括多模态基础模型 |
| **Transformer** | LLM 的主流架构底座，LLM 是 Transformer 的规模化产物 |
| **SLM（小语言模型）** | 参数更小、可端侧运行，是 LLM 的资源受限补充 |
| **推理模型** | LLM 的进化方向，内化多步推理能力 |
| **多模态模型** | LLM 的扩展，增加视觉/音频理解 |

## 关键指标

| 指标 | 说明 | 典型值 |
|------|------|--------|
| 参数量 | 模型规模 | 7B - 1.8T |
| 上下文窗口 | 单次处理长度 | 8K - 10M |
| 推理速度 | token 生成速度 | 20-200 tok/s |
| 知识截止 | 训练数据时间 | 2024-2026 |
| 多语言 | 支持语言数 | 10-100+ |

## LLM 能力演进

```
2020: GPT-3 (175B) — 少样本学习、涌现能力
2022: ChatGPT — RLHF 对齐、对话能力
2023: GPT-4 — 多模态、推理增强
2024: o1/R1 — 推理模型、长链思考
2025: Agent 原生 — 工具调用、多步执行
2026: 全能助手 — 超长上下文、实时知识、多模态融合
```

## 模型选择指南

| 场景 | 推荐模型类型 | 考量因素 |
|------|--------------|----------|
| 简单问答 | SLM (7B-14B) | 成本、速度 |
| 复杂推理 | 推理模型 (o3/R1) | 准确率 |
| 长文档 | 长上下文模型 | 窗口大小 |
| 代码生成 | 代码专用模型 | 代码质量 |
| 多模态 | 多模态模型 | 视觉/音频能力 |
| 企业部署 | 开源模型 | 可控性、隐私 |

## 部署方式

| 方式 | 说明 | 适用 |
|------|------|------|
| **API 调用** | 通过云服务访问 | 快速原型、低量 |
| **私有化部署** | 本地/私有云运行 | 数据安全、合规 |
| **端侧部署** | 手机/PC 本地运行 | 离线、隐私 |
| **混合部署** | 简单任务端侧 + 复杂任务云端 | 成本优化 |

## Related

- [[概念/LLM/context-window|Context Window]] — LLM 的输入长度限制
- [[概念/LLM/context-engineering|上下文工程]] — LLM 输入优化
- [[概念/LLM/transformer-architecture|Transformer 架构]] — LLM 的架构基础
- [[概念/LLM/tokenization|Tokenization]] — 文本切分
- [[概念/LLM/kv-cache|KV Cache]] — 推理加速
- [[概念/LLM/reasoning-models|推理模型]] — LLM 的推理进化
- [[05_大模型/01_LLM_Fundamentals/LLM_Fundamentals|LLM 基础]] — 详细教程
- [[05_大模型/index|NLP LLMs]] — LLM 章节索引

## 2026 LLM 能力矩阵

| 能力 | 代表模型 | 成熟度 | 说明 |
|------|---------|:------:|------|
| 通用对话 | GPT-5 / Claude | 极高 | 多轮对话、知识问答 |
| 代码生成 | Claude / GPT-5 | 极高 | 全栈开发、调试 |
| 数学推理 | o3 / DeepSeek-R1 | 高 | 竞赛级数学 |
| 多模态 | Gemini 3 / GPT-5 | 高 | 图像/音频/视频理解 |
| 工具调用 | 所有主流模型 | 高 | Function Calling |
| 长上下文 | Llama 4 / Gemini 3 | 高 | 1M-10M token |
| Agent | Claude / GPT-5 | 中-高 | 自主任务执行 |
| 端侧推理 | Qwen3-1.7B / Phi-4 | 中 | 本地运行 |

## LLM 工作原理简化

```
输入文本 → Tokenizer → Token 序列
    → Embedding → 向量序列
    → Transformer Layers (×N)
        → Self-Attention (理解上下文)
        → FFN (非线性变换)
    → Output Head → 下一个 Token 概率
    → 采样/解码 → 输出文本
```

## 生产最佳实践

1. **任务匹配**: 根据任务复杂度选择模型规模，不要过度配置
2. **Prompt 设计**: 清晰的指令 + 示例 + 约束，提高输出质量
3. **温度控制**: 事实任务 temperature=0，创意任务 0.7-1.0
4. **输出验证**: 始终验证 LLM 输出，不要盲目信任
5. **成本监控**: 按项目/团队设置 Token 配额与告警
6. **回滚预案**: 模型升级后保留回滚能力
7. **安全护栏**: 输入审查 + 输出过滤必须前置

## LLM 发展时间线

| 年份 | 里程碑 | 意义 |
|:----:|---------|------|
| 2017 | Transformer | 架构奠基 |
| 2018 | GPT-1 / BERT | 预训练范式 |
| 2019 | GPT-2 | 零样本学习 |
| 2020 | GPT-3 (175B) | 规模涌现 |
| 2022 | ChatGPT | RLHF 对齐，消费级产品 |
| 2023 | GPT-4 / Llama 2 | 多模态 + 开源追赶 |
| 2024 | Claude 3 / Llama 3 | 长上下文 + 推理 |
| 2025 | GPT-5 / Llama 4 | 原生多模态 + Agent |
| 2026 | 开源追平闭源 | 差距 <5%，MoE 普及 |

## LLM 局限性

| 局限 | 说明 | 缓解方案 |
|------|------|----------|
| **幻觉** | 生成看似合理但错误的内容 | RAG + 事实验证 |
| **知识截止** | 训练数据有时间截止 | RAG + 工具调用 |
| **推理弱** | 复杂逻辑推理不稳定 | CoT + 推理模型 |
| **成本高** | 大模型推理费用高 | 量化 + 路由 + 缓存 |
| **安全风隩** | 可能被注入/越狱 | 护栏 + 过滤 |
| **不可解释** | 决策过程不透明 | 可解释性研究 |

## 延伸阅读

- [[概念/LLM/foundation-model|基础模型]] — 基础模型概念
- [[概念/LLM/reasoning-models|推理模型]] — 推理能力前沿
- [[概念/LLM/llm-architectures|LLM 架构]] — 架构演进
- [[概念/LLM/llm-safety|LLM 安全]] — 安全与对齐
