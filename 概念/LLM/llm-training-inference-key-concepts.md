---
title: LLM 训练与推理关键概念索引
category: concepts
tags:
  - llm
  - transformer
  - training
  - inference
  - decoding
  - index
  - hub
aliases:
  - LLM Training and Inference Key Concepts
  - LLM 训练与推理
  - 训练推理概念索引
relationships:
  - target: "05_大模型/Transformer_Training_vs_Inference"
    type: detailed_in
  - target: "概念/transformer-architecture"
    type: related_to
  - target: "概念/model-inference"
    type: related_to
  - target: "概念/pre-training"
    type: related_to
  - target: "概念/decoding-strategies"
    type: related_to
summary: 本页是 LLM 训练与推理相关概念的索引中心，汇总 Transformer、预训练、SFT、RLHF、解码策略、KV Cache、推理优化等核心主题，并链接到各专题的详细解释。
lifecycle: reviewed
tier: core
created: 2026-06-25
updated: 2026-07-21
sources: []
---

# LLM 训练与推理关键概念索引

> 本页为概念导航中心，详细内容请查看各专题页面。

---

## 核心结论

- **Transformer** 是 LLM 的基础架构，**训练**用来学习参数，**推理**用来使用参数。
- **训练**阶段并行处理整个序列，目标是最大化下一个 token 的概率。
- **推理**阶段通常采用自回归生成，每次生成一个 token 并拼回输入。

---

## 概念地图

```
Transformer
├── 核心机制
│   ├── 下一个 Token 预测（Next Token Prediction）
│   ├── 因果掩码（Causal Mask）
│   └── 注意力机制（Attention）
├── 训练阶段
│   ├── 预训练（Pre-training）
│   ├── 持续预训练（Continued Pre-training）
│   ├── 监督微调（SFT）
│   └── 对齐（Alignment）
│       ├── RLHF
│       ├── DPO / IPO / KTO / GRPO
│       └── 奖励模型（Reward Model）
├── 推理阶段
│   ├── 自回归生成（Autoregressive Generation）
│   ├── 解码策略（Decoding Strategies）
│   │   ├── 贪心解码（Greedy）
│   │   ├── 束搜索（Beam Search）
│   │   ├── 随机采样（Sampling）
│   │   ├── 温度缩放（Temperature）
│   │   ├── Top-k 采样
│   │   ├── Top-p 采样（Nucleus）
│   │   └── 重复惩罚（Repetition Penalty）
│   ├── KV Cache
│   └── 推理优化
│       ├── PagedAttention
│       ├── Continuous Batching
│       ├── Speculative Decoding
│       └── 量化（Quantization）
├── 评估
│   └── 困惑度（Perplexity）
└── 位置编码
    ├── RoPE
    └── ALiBi
```

---

## 核心机制

| 概念 | 说明 | 链接 |
|---|---|---|
| **下一个 Token 预测** | 自回归语言模型的核心任务 | [[概念/next-token-prediction]] |
| **因果掩码** | 防止模型看到未来 token | [[概念/causal-mask]] |
| **注意力机制** | Transformer 的核心计算单元 | [[概念/attention-variants]] |

---

## 训练相关概念

| 概念 | 说明 | 链接 |
|---|---|---|
| **预训练** | 大规模无标注数据上的自监督学习 | [[概念/pre-training]] |
| **SFT** | 用高质量指令数据微调模型 | [[概念/sft]] |
| **RLHF** | 基于人类反馈的强化学习对齐 | [[概念/rlhf]] |
| **DPO** | 直接偏好优化，无需奖励模型 | [[概念/dpo]] |
| **奖励模型** | 学习人类偏好并输出奖励分数 | [[概念/reward-modeling]] |
| **IPO / KTO / GRPO** | RLHF 的替代对齐方法 | [[概念/ipo]]、[[概念/kto]]、[[概念/grpo]] |
| **混合精度训练** | FP16/BF16 + FP32 加速训练 | [[概念/mixed-precision]] |
| **分布式训练** | 多卡/多机扩展训练 | [[概念/distributed-training]] |
| **LoRA / QLoRA** | 参数高效微调 | [[概念/lora-peft]]、[[概念/qlora]] |

---

## 推理相关概念

| 概念 | 说明 | 链接 |
|---|---|---|
| **自回归生成** | 逐 token 生成的基本范式 | [[概念/autoregressive-generation]] |
| **解码策略总览** | 各种解码方法的系统对比 | [[概念/decoding-strategies]] |
| **贪心解码** | 每步选概率最高的 token | [[概念/greedy-decoding]] |
| **束搜索** | 保留 top-k 候选序列 | [[概念/beam-search]] |
| **随机采样** | 按概率分布随机选 token | [[概念/sampling-decoding]] |
| **温度缩放** | 调节概率分布尖锐度 | [[概念/temperature-scaling]] |
| **Top-k 采样** | 只从前 k 个 token 采样 | [[概念/top-k-sampling]] |
| **Top-p 采样** | 按累积概率动态截断采样 | [[概念/top-p-sampling]] |
| **重复惩罚** | 降低已生成 token 的概率 | [[概念/repetition-penalty]] |
| **KV Cache** | 缓存历史 K/V 加速推理 | [[概念/kv-cache]] |
| **PagedAttention** | 分页管理 KV Cache | [[概念/paged-attention]] |
| **Speculative Decoding** | 小模型加速大模型推理 | [[概念/speculative-decoding]] |

---

## 推理性能指标

| 指标 | 说明 | 链接 |
|---|---|---|
| **TTFT** | 首 token 延迟 | [[概念/ttft]] |
| **TPOT** | 每 token 延迟 | [[概念/tpot]] |
| **Throughput** | 单位时间生成 token 数 | 见 [[概念/inference-performance]] |

---

## 评估指标

| 指标 | 说明 | 链接 |
|---|---|---|
| **困惑度（PPL）** | 语言模型对文本的预测能力 | [[概念/perplexity]] |
| **BLEU / ROUGE** | 生成质量对比指标 | 见 [[概念/model-evaluation]] |
| **Human Evaluation** | 人类偏好评估 | 见 [[概念/model-evaluation]] |

---

## 架构与位置编码

| 概念 | 说明 | 链接 |
|---|---|---|
| **Transformer 架构** | Self-Attention 基础架构 | [[概念/transformer-architecture]] |
| **Attention 变体** | MHA / MQA / GQA / MLA 等 | [[概念/attention-variants]] |
| **RoPE** | 旋转位置编码 | [[概念/rope]] |
| **ALiBi** | 线性偏置注意力位置编码 | [[概念/alibi]] |
| **FlashAttention** | 高效 Attention 实现 | [[概念/flash-attention-kernels]] |

---

## 实践指南

| 指南 | 说明 | 链接 |
|---|---|---|
| **解码策略决策树** | 根据任务快速选择解码参数 | [[概念/decoding-strategies-decision-tree]] |
| **推理上线检查清单** | LLM 推理服务上线前的检查项 | [[概念/llm-inference-checklist]] |
| **训练检查清单** | LLM 训练/SFT/对齐的检查项 | [[概念/llm-training-checklist]] |

---

## 框架实战

| 框架 | 说明 | 链接 |
|---|---|---|
| **Hugging Face generate()** | 最通用的生成接口深度解析 | [[概念/huggingface-generate-deep-dive]] |
| **vLLM 实战** | 高吞吐推理引擎 | [[概念/vllm-practical]] |
| **TensorRT-LLM 实战** | NVIDIA 高性能推理 SDK | [[概念/tensorrt-llm-practical]] |

---

## 专题实战

| 专题 | 说明 | 链接 |
|---|---|---|
| **长上下文 LLM** | 长文本训练与推理挑战 | [[概念/long-context-llm]] |
| **模型压缩对比** | 量化、剪枝、蒸馏实战选择 | [[概念/model-compression-methods]] |
| **对齐实战 Pipeline** | SFT → RLHF/DPO 完整流程 | [[概念/alignment-practical-pipeline]] |

---

## 模型家族

| 模型 | 说明 | 链接 |
|---|---|---|
| **LLaMA 系列** | Meta 开源 Decoder-only 模型演进 | [[概念/llama-series]] |
| **Qwen 系列** | 阿里巴巴通义千问模型演进 | [[概念/qwen-series]] |
| **DeepSeek 系列** | 高效训练与推理模型演进 | [[概念/deepseek-series]] |
| **GPT 系列** | OpenAI 生成式模型演进 | [[概念/gpt-series-evolution]] |

---

## 多模态与 Agent

| 主题 | 说明 | 链接 |
|---|---|---|
| **多模态 LLM** | 文本/图像/音频统一建模 | [[概念/multimodal-llm]] |
| **视觉语言模型** | VLM 训练与推理 | [[概念/vision-language-model]] |
| **Tool Use** | 大模型工具使用 | [[概念/tool-use]] |
| **Function Calling** | 结构化函数调用 | [[概念/function-calling]] |
| **ReAct Agent** | 推理+行动智能体 | [[概念/react-agent]] |

---

## 评估体系

| 主题 | 说明 | 链接 |
|---|---|---|
| **LLM Benchmarks 概览** | 主流评估基准分类 | [[概念/llm-benchmarks]] |
| **Benchmark 详解** | MMLU/GSM8K/HumanEval/MT-Bench/AlpacaEval | [[概念/llm-benchmarks-deep-dive]] |

---

## 部署架构

| 主题 | 说明 | 链接 |
|---|---|---|
| **Prefill-Decode 分离** | 两阶段分离部署 | [[概念/prefill-decode-disaggregated]] |
| **推理集群调度** | GPU 集群调度与扩缩容 | [[概念/inference-cluster-scheduling]] |
| **推理成本优化** | 降低单位 token 成本 | [[概念/llm-inference-cost-optimization]] |

---

## 前沿研究方向

| 主题 | 说明 | 链接 |
|---|---|---|
| **Test-Time Compute** | 测试时增加计算提升推理能力 | [[概念/test-time-compute]] |
| **World Models** | 智能体对环境的内部模拟与预测 | [[概念/world-models]] |
| **Neuro-Symbolic AI** | 神经网络与符号推理结合 | [[概念/neuro-symbolic-ai]] |

---

## 资源索引

| 资源 | 说明 | 链接 |
|---|---|---|
| **论文与课程索引** | LLM 经典论文、课程、工具资源 | [[概念/llm-papers-courses-index]] |

---

## 详细综合文档

如需一篇涵盖训练、推理、解码策略、优化技术的完整综合文档，请参阅：

- [[05_大模型/Transformer_Training_vs_Inference|Transformer 在大模型训练与推理中的应用（全面版）]]

---

## 速查表

| 概念 | 一句话解释 |
|---|---|
| **Transformer** | 基于 Self-Attention 的序列建模架构，训练学和推理用 |
| **下一个 Token 预测** | 给定前文预测下一个 token，是 LLM 的核心任务 |
| **因果掩码** | 让模型只能看到当前位置之前的 token |
| **预训练** | 海量无标注数据上学习通用能力 |
| **困惑度（PPL）** | 衡量模型对文本预测能力的指标 |
| **SFT** | 用高质量指令数据让模型学会按指令回答 |
| **RLHF** | 用人类偏好训练奖励模型，再优化策略模型 |
| **DPO** | 无需奖励模型，直接用偏好数据优化 |
| **贪心解码** | 每步选概率最高的 token |
| **束搜索** | 保留 k 个最优候选序列 |
| **随机采样** | 按概率分布随机选 token |
| **温度缩放** | 调节 softmax 分布的尖锐/平缓程度 |
| **Top-p** | 从累积概率达 p 的 token 集合中采样 |
| **Top-k** | 只从前 k 个高概率 token 中采样 |
| **重复惩罚** | 降低已生成 token 的概率，减少重复 |
| **KV Cache** | 缓存历史 K/V，避免重复计算 |
| **TTFT** | 首 token 延迟 |
| **TPOT** | 每 token 延迟 |
| **Test-Time Compute** | 测试时增加计算提升推理能力 |
| **World Models** | 智能体对环境的内部模拟 |
| **Neuro-Symbolic AI** | 神经网络与符号推理结合 |

---

## 2026 训练推理核心概念生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **MoE 架构** | Mixture of Experts 稀疏激活 | GA |
| **长上下文** | 1M+ token 上下文窗口 | GA |
| **推理时计算** | Test-Time Compute 提升推理能力 | GA |
| **多模态融合** | 图文/视频/音频统一建模 | GA |
| **小模型崛起** | 1-7B 小模型性能大幅提升 | GA |

## 生产最佳实践

1. **架构选择**：通用任务用 Dense，大规模用 MoE
2. **训练推理协同**：训练时考虑推理效率，推理时利用训练特性
3. **量化感知**：训练时启用 QAT，推理时量化损失更小
4. **持续学习**：定期用新数据继续训练，保持知识时效性
5. **评估体系**：建立全面的评估基准，跟踪模型能力变化
