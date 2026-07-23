---
title: LLM Architectures
type: index
created: 2026-07-02
updated: 2026-07-21
sources: []
---

# LLM Architectures

LLM 架构索引，覆盖 Transformer 变体、MoE、长上下文、推理模型等架构设计。

## 子域简介

本子域聚焦 LLM 架构设计：

- **基础架构**: Transformer、Decoder-only
- **MoE**: 混合专家、路由策略
- **长上下文**: 1M+ tokens 窗口
- **推理模型**: o3/R1/QwQ
- **替代架构**: Mamba、RWKV

## Files

- [[大模型/LLM_Architectures/LLM-Basics-in-nutshell|LLM Basics In Nutshell]]
- [[大模型/LLM_Architectures/LLM_Architectures|LLM Architectures]]
- [[大模型/LLM_Architectures/LLM_Architectures_for_dummy|LLM Architectures For Dummy]]
- [[大模型/LLM_Architectures/LLM_Internals_Architecture|LLM Internals Architecture]]
- [[大模型/LLM_Architectures/LLM_Internals_Inference|LLM Internals Inference]]
- [[大模型/LLM_Architectures/LLM_Internals_Models_Frontiers|LLM Internals Models Frontiers]]
- [[大模型/LLM_Architectures/LLM_Internals_Training|LLM Internals Training]]
- [[大模型/LLM_Architectures/Long_Context_Models_2026|Long Context Models 2026]]
- [[大模型/LLM_Architectures/MoE_Case_Studies_DeepSeek_Mixtral|Moe Case Studies Deepseek Mixtral]]
- [[大模型/LLM_Architectures/MoE_Routing_and_Load_Balancing|Moe Routing And Load Balancing]]
- [[大模型/LLM_Architectures/README|README]]
- [[大模型/LLM_Architectures/Reasoning_Models_2026|Reasoning Models 2026]]
- [[大模型/LLM_Architectures/Transformer_Alternatives|Transformer Alternatives]]

## 核心概念速查

| 概念 | 说明 | 代表 |
|------|------|------|
| Decoder-only | 自回归架构 | GPT/LLaMA |
| MoE | 混合专家 | Mixtral/DeepSeek |
| Long Context | 长上下文 | Gemini 1M |
| Reasoning | 推理模型 | o3/R1 |
| SSM | 状态空间模型 | Mamba |

## 架构对比

| 架构 | 优点 | 缺点 | 适用 |
|------|------|------|------|
| Dense | 简单、稳定 | 效率低 | 通用 |
| MoE | 效率高 | 复杂 | 大规模 |
| SSM | 线性复杂度 | 新、不成熟 | 长序列 |

## 学习路径建议

| 阶段 | 推荐文档 | 目标 |
|------|------|------|
| 入门 | LLM_Architectures_for_dummy | 理解基础 |
| 进阶 | LLM_Internals_Architecture | 掌握架构 |
| 拓展 | MoE_Case_Studies | MoE 设计 |
| 前沿 | Reasoning_Models_2026 | 推理模型 |

## 常见问题

| 问题 | 解答 |
|------|------|
| 为什么 Decoder-only 主流？ | 生成任务更适合 |
| MoE 优势？ | 效率提升 2-4x |
| 长上下文难点？ | 显存和计算 |
| 推理模型特点？ | 测试时计算扩展 |

## 相关概念

- [[大模型/index|大模型首页]]
- [[大模型/Transformer_Revolution/index|Transformer Revolution]]
- [[概念/llm-architectures|LLM 架构概念]]

## 统计

| 指标 | 数值 |
|------|------|
| 文件数 | 13 |
| 最后更新 | 2026-07-21 |

> 💡 LLM 架构是 AI 能力的基石，从 Dense 到 MoE 再到推理模型，架构创新持续推动能力边界。

## 附录：MoE 架构详解

| 组件 | 说明 | 作用 |
|------|------|------|
| Expert | 专家网络 |  specialized 处理 |
| Router | 路由器 | 选择专家 |
| Load Balancing | 负载均衡 | 避免专家过载 |
| Top-k | 选择数量 | 通常 2-8 |

## 附录：长上下文技术

| 技术 | 说明 | 代表 |
|------|------|------|
| RoPE 外推 | 位置编码扩展 | LLaMA 3 |
| Sliding Window | 滑动窗口 | Mistral |
| Ring Attention | 分布式注意力 | Gemini |
| KV Cache 压缩 | 缓存优化 | H2O |

## 附录：推理模型架构

| 模型 | 特点 | 机制 |
|------|------|------|
| o3 | OpenAI | 测试时计算 |
| R1 | DeepSeek | 强化学习 |
| QwQ | 阿里 | 思维链 |
| o4-mini | OpenAI | 高效推理 |

## 附录：替代架构

| 架构 | 原理 | 优点 | 状态 |
|------|------|------|------|
| Mamba | SSM | 线性复杂度 | 新兴 |
| RWKV | 线性注意力 | RNN 效率 | 新兴 |
| RetNet | 保留网络 | 并行+递归 | 研究 |
| Hyena | 卷积替代 | 长序列 | 研究 |

## 附录：模型规模对比

| 模型 | 参数量 | 架构 | 特点 |
|------|------|------|------|
| LLaMA-3-8B | 8B | Dense | 开源基座 |
| Mixtral-8x7B | 47B | MoE | 稀疏激活 |
| DeepSeek-V3 | 671B | MoE | MLA+MoE |
| GPT-4o | ~200B | Dense | 多模态 |

## 附录：2026 架构趋势

| 趋势 | 说明 | 影响 |
|------|------|------|
| MoE 普及 | 效率优先 | 降低成本 |
| 推理架构 | 测试时计算 | 深度思考 |
| 原生多模态 | 统一架构 | 简化部署 |
| 长上下文 | 1M+ tokens | 更大窗口 |
| 小模型 | 1-3B | 端侧部署 |

## 附录：架构选择决策树

```
需要 LLM →
├── 通用任务 → Dense (LLaMA/Qwen)
├── 效率优先 → MoE (Mixtral/DeepSeek)
├── 长文档 → Long Context (Gemini)
├── 深度推理 → Reasoning (o3/R1)
└── 端侧部署 → SLM (Phi/Qwen-0.6B)
```

## 附录：训练架构考虑

| 因素 | 说明 | 影响 |
|------|------|------|
| 并行策略 | DP/TP/PP | 训练效率 |
| 显存优化 | ZeRO/Offload | 可训练规模 |
| 混合精度 | FP16/BF16 | 速度/显存 |
| 梯度累积 | 小显存大 batch | 稳定性 |

## 附录：推理架构考虑

| 因素 | 说明 | 优化 |
|------|------|------|
| KV Cache | 注意力缓存 | PagedAttention |
| 批处理 | 动态 batching | 吞吐量 |
| 量化 | INT8/INT4 | 显存/速度 |
| 推测解码 | 小模型预测 | 延迟 |

## 附录：架构评估指标

| 指标 | 说明 | 测量 |
|------|------|------|
| 参数量 | 模型大小 | Billions |
| FLOPs | 计算量 | 训练/推理 |
| 显存 | 内存需求 | GB |
| 吞吐量 | Token/s | 推理速度 |
| 质量 | 任务表现 | 基准测试 |

## 附录：开源架构生态

| 模型 | 架构 | 许可证 | 特点 |
|------|------|------|------|
| LLaMA 3 | Dense | 商用 | Meta 开源 |
| Qwen3 | Dense | Apache | 阿里开源 |
| Mistral | Dense | Apache | 欧洲开源 |
| Mixtral | MoE | Apache | 稀疏专家 |
| DeepSeek | MoE | MIT | MLA+MoE |

## 附录：架构演进时间线

| 时期 | 架构 | 代表 | 特点 |
|------|------|------|------|
| 2017 | Transformer | Vaswani | 自注意力 |
| 2018 | Decoder-only | GPT | 自回归 |
| 2020 | 规模化 | GPT-3 | 涌现能力 |
| 2023 | MoE | Mixtral | 稀疏专家 |
| 2024 | 多模态 | GPT-4o | 统一架构 |
| 2025 | 推理 | o3/R1 | 测试时计算 |

> 💡 架构选择的核心：没有最好的架构，只有最适合任务的架构。
