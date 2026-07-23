---
title: LLM 架构目录
category: 05-nlp-llms-llm-architectures
tags: ['llm-architecture', 'overview', 'index']
summary: 大语言模型架构 相关内容的索引和概览。
created: 2026-06-12
updated: 2026-07-21
tier: peripheral
sources: []

---
# 大语言模型架构

本目录包含 大语言模型架构 相关的深度技术内容。

## 内容索引

## 页面列表

- [[大模型/LLM_Architectures/MoE_Routing_and_Load_Balancing|MoE Routing and Load Balancing]]
- [[大模型/LLM_Architectures/MoE_Case_Studies_DeepSeek_Mixtral|MoE Case Studies: DeepSeek and Mixtral]]
- [[大模型/LLM_Architectures/Transformer_Alternatives|Transformer Alternatives: RWKV, RetNet, Mamba, and Beyond]]

## 相关页面

- [[大模型/LLM_Architectures/README|LLM 架构目录]]

## Related

- [[大模型/README|04 自然语言处理与大模型 (NLP & LLMs)]]

## 架构类型对比

| 架构 | 复杂度 | 长序列 | 代表 |
|------|------|------|------|
| Dense Transformer | O(n²) | 中 | GPT-4 |
| MoE | O(n²) | 中 | DeepSeek |
| Mamba/SSM | O(n) | 长 | Mamba |
| RWKV | O(n) | 长 | RWKV-6 |
| RetNet | O(n) | 长 | RetNet |

## MoE 架构详解

| 组件 | 说明 | 代表 |
|------|------|------|
| 路由器 | 选择专家 | Top-K |
| 专家网络 | FFN 变体 | Dense FFN |
| 负载均衡 | 防止坍塌 | 辅助损失 |
| 共享专家 | 通用知识 | DeepSeek |

## 长上下文技术

| 技术 | 说明 | 代表 |
|------|------|------|
| RoPE 外推 | 位置编码扩展 | YaRN |
| 稀疏注意力 | 减少计算 | Longformer |
| 滑动窗口 | 局部注意力 | Mistral |
| Ring Attention | 分布式 | 超长序列 |

## 学习路径

| 阶段 | 内容 | 目标 |
|------|------|------|
| 入门 | Transformer 基础 | 理解架构 |
| 进阶 | MoE 设计 | 混合专家 |
| 实践 | 替代架构 | Mamba/RWKV |
| 拓展 | 长上下文 | 窗口扩展 |

## 常见问题

| 问题 | 解答 |
|------|------|
| MoE 优势？ | 参数多但计算少 |
| Mamba 能替代 Transformer？ | 部分场景可以 |
| 长上下文难点？ | 计算和内存 |
| 如何选择架构？ | 根据场景需求 |

## 统计

| 指标 | 数值 |
|------|------|
| 文件数 | 30 |
| 最后更新 | 2026-07-21 |

> 💡 架构创新是 LLM 进步的核心驱动力，从 Transformer 到 MoE 再到 SSM。

## 附录：注意力机制对比

| 类型 | 复杂度 | 说明 |
|------|------|------|
| MHA | O(n²) | 多头注意力 |
| GQA | O(n²) | 分组查询 |
| MQA | O(n²) | 多查询 |
| MLA | O(n²) | DeepSeek |
| Linear | O(n) | 线性注意力 |

## 附录：2026 趋势

| 趋势 | 说明 | 影响 |
|------|------|------|
| MoE 主流 | 大模型标配 | 降本 |
| SSM 融合 | 混合架构 | 效率 |
| 超长上下文 | 1M+ tokens | 文档 |
| 稀疏化 | 动态计算 | 加速 |

## 附录：位置编码对比

| 类型 | 说明 | 代表 |
|------|------|------|
| 绝对 | 固定位置 | 原始 Transformer |
| RoPE | 旋转位置 | LLaMA/Qwen |
| ALiBi | 线性偏置 | BLOOM |
| NoPE | 无位置 | 部分 SSM |

## 附录：模型规模对比

| 规模 | 参数 | 显存 | 适用 |
|------|------|------|------|
| 小型 | 1-3B | 4GB | 端侧 |
| 中型 | 7-13B | 16GB | 单机 |
| 大型 | 30-70B | 80GB | 服务器 |
| 超大 | 100B+ | 多卡 | 集群 |
| MoE | 600B+ | 部分 | 分布式 |

## 附录：训练架构选择

| 场景 | 推荐架构 | 原因 |
|------|------|------|
| 通用对话 | Dense | 简单有效 |
| 大规模 | MoE | 降本 |
| 长文档 | SSM/混合 | 效率 |
| 实时推理 | 小型 Dense | 低延迟 |
| 多任务 | MoE | 专业化 |

## 附录：术语表

| 术语 | 英文 | 说明 |
|------|------|------|
| 混合专家 | MoE | 条件计算 |
| 状态空间 | SSM | 序列建模 |
| 注意力 | Attention | 核心机制 |
| 前馈网络 | FFN | 变换层 |
| 层归一化 | LayerNorm | 稳定训练 |

## 附录：推理优化架构

| 技术 | 说明 | 效果 |
|------|------|------|
| KV Cache | 缓存注意力 | 延迟↓ |
| PagedAttention | 分页内存 | 吞吐↑ |
| 连续批处理 | 动态 batching | 利用↑ |
| 投机解码 | 小模型预测 | 速度↑ |
| 量化 | 降低精度 | 内存↓ |

## 附录：架构演进历史

| 年份 | 里程碑 | 意义 |
|------|------|------|
| 2017 | Transformer | 架构革命 |
| 2018 | GPT/BERT | 预训练 |
| 2020 | GPT-3 | 规模化 |
| 2022 | ChatGPT | 产品化 |
| 2023 | MoE/长上下文 | 效率 |
| 2024 | Mamba/SSM | 替代架构 |
| 2025 | DeepSeek-V3 | MoE 成熟 |

## 附录：开源架构实现

| 项目 | 架构 | 特点 |
|------|------|------|
| LLaMA | Dense | Meta 开源 |
| Mistral | Dense+GQA | 高效 |
| DeepSeek | MoE+MLA | 创新 |
| Mamba | SSM | 线性 |
| RWKV | RNN-like | 流式 |

## 附录：架构评估维度

| 维度 | 指标 | 说明 |
|------|------|------|
| 性能 | MMLU/推理 | 任务表现 |
| 效率 | FLOPs/Token | 计算成本 |
| 扩展性 | 参数/数据 | Scaling |
| 长序列 | 上下文窗口 | 文档处理 |
| 部署 | 显存/延迟 | 实用性 |

> 💡 架构设计决定了模型的能力上限，理解各种架构的优劣势是选型的基础。

## 相关域

- [[大模型/Transformer_Revolution/index|Transformer Revolution]]
- [[大模型/Sequence_Models/index|Sequence Models]]
- [[部署推理/index|部署推理]]

> 💡 架构是 LLM 的基石，理解架构设计是深入理解大模型的关键。

## 附录：参考

| 资源 | 说明 |
|------|------|
| Attention Is All You Need | Transformer 论文 |

---
*Last updated: 2026-07-21*
