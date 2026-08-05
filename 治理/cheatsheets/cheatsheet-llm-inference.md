---
title: "LLM 推理技术速查表"
tags: [cheatsheet, llm-inference, decoding, kv-cache, quantization, flash-attention, inference-engine]
type: cheatsheet
created: 2026-06-17
sources: []
name_zh: "LLM 推理技术速查表"
---

# LLM 推理技术速查表

> 中文简称：LLM 推理技术速查表

> 推理三层次：**解码策略**(如何选词) -> **推理优化**(如何加速计算) -> **服务引擎**(如何高效调度)
> 详见 [[10_部署推理/03_推理优化/02_LLM推理_深入分析]] | [[05_大模型/05_LLM架构/04_LLM_架构_Evolution]] | [[00_入门/02_技术概览/04_AI_推理模型_指南]]

## 模型选型矩阵

| 模型 | 上下文窗口 | 推理能力 | 成本档 | 最佳场景 |
|------|-----------|---------|--------|---------|
| GPT-4o / GPT-5 | 128K | 极强 (通用+STEM) | $$$$ | 复杂推理、编码、多模态 |
| Claude Opus 4.8 | 1M | 极强 (分析/创意) | $$$$ | 科研论文、法律、长文档分析 |
| Claude Sonnet 4.6 | 1M | 强 (性价比首选) | $$ | 代码生成、RAG、Agent 工作流 |
| Claude Haiku 4.5 | 200K | 中 (极致速度) | $ | 聊天机器人、意图路由、内容审核 |
| Claude Fable 5 | 1M | 极强 (Adaptive Thinking 常开) | $$$ | 旗舰级分析、复杂架构设计 |
| DeepSeek-V3 | 128K | 强 (MoE 671B/37B 激活) | $ | 高效推理、私有部署、高频调用 |
| DeepSeek-R1 | 128K | 强 (推理模型, 对标 o1) | $ | 数学/代码推理、预算有限、本地部署 |
| Gemini 3 Pro | 1M | 强 (原生多模态) | $$$ | 百万级文档/视频分析、研究工作流 |
| Llama 4 Scout | 10M | 中-强 (MoE 109B/17B) | $ | 超长上下文、边缘部署 |
| Llama 4 Maverick | 1M | 中-强 (MoE 400B/17B) | $ | 通用任务、开放权重生态 |

> **选型口诀**: "Default to Sonnet, optimize with Haiku, escalate to Opus." — Claude 生态黄金法则

## 推理优化技术对照表

| 技术 | 原理 | 加速/节省 | Trade-off | 适用时机 |
|------|------|----------|-----------|---------|
| **KV Cache** | 缓存历史 K/V 避免重算 | 推理基石, 免 O(n) 重算 | 显存占用随序列长度线性增长 | 所有自回归推理 (必备) |
| **GQA** | 多 Q 头共享 KV (Llama 2+) | KV 缓存减至 1/8 | 轻微质量损失 (后续训可恢复) | 长序列、大 batch |
| **MLA** (DeepSeek) | 压缩 KV 至 576 维隐向量 | KV 缓存减至 1/57 (70KB/词元 vs 516KB) | 需额外投影层 | 超长上下文、低显存场景 |
| **Flash Attention** | IO 感知分块 + Online Softmax | 2-4x 加速 | 仅适用于精确注意力 | 所有 Transformer 推理 (标配) |
| **GPTQ** | 基于二阶信息逐层 INT4 量化 | 4x 压缩, 精度损失小 | 需校准数据, 量化后固定 | GPU 显存受限, 大模型部署 |
| **AWQ** | 激活分布识别显著权重保护 | 4x 压缩, 精度优于 GPTQ | 需校准数据 | 精度敏感的生产部署 |
| **SmoothQuant** | 激活侧缩放迁移到权重侧 | W8A8 基本不掉点 | 训练后量化需校准 | 推理+激活双量化需求 |
| **Speculative Decoding** | 小模型草稿 + 大模型并行验证 | 1.5-2.5x 吞吐提升 | 高温采样降低接受率; 需草稿模型 | 低 batch、常见文本生成 |
| **PagedAttention** | 虚拟内存式分页管理 KV | 碎片浪费 < 4%, 吞吐 2-10x | 需页表管理开销 | 高并发在线服务 |
| **Continuous Batching** | 每步动态换入换出请求 | GPU 始终满载, 吞吐 2-10x | 实现复杂度高 | 在线服务 (替代静态批处理) |
| **分块 Prefill** | 长 Prompt 分块与 Decode 交错 | P99 SLO 下容量 2.6-5.6x | 增加调度复杂度 | 长 Prompt 混合短请求场景 |
| **分离式 Prefill-Decode** | 计算密集/访存密集分离到独立 GPU 池 | 消除延迟干扰 | KV 缓存传输 5-10 GiB/请求 | 大规模异构集群 |

> **KV 缓存显存公式**: `2 x B x L x H_kv x d_h x t x bytes_per_element`

## 解码策略选择器

| 策略 | 机制 | 适用场景 | 推荐参数 |
|------|------|---------|---------|
| **Greedy** | 每步 argmax, 最快 | 确定性任务 (翻译、摘要、分类) | - |
| **Beam Search** | 维护 B 条候选序列 | 有"正确答案"的任务 (翻译) | B=4-8, alpha=0.6-0.8 (长度归一化) |
| **Temperature** | 调节 softmax 尖锐度 | 控制确定性/多样性 | T<1: 确定; T>1: 多样; **典型 T=0.7** |
| **Top-k** | 只保留概率最高 k 个词 | 简单多样性控制 | k=40-50 (局限: 不随分布熵自适应) |
| **Top-p (Nucleus)** | 累积概率 >= p 的最小集合 | **主流方案**, 自适应范围 | **p=0.9** (分布熵低时自动收缩, 高时扩大) |
| **Min-p** | 阈值绑定当前最高概率 | 高温采样更稳定 | alpha=0.05-0.1 |
| **重复惩罚** | 对已出现词元 logit 惩罚 | 减少重复生成 | theta=1.1-1.2; OpenAI 风格: 频次/存在惩罚 |

> **典型组合**: T=0.7 + Top-p=0.9 (投票: T>0.5, n=5-20 次采样)

## 推理引擎选型矩阵

| 引擎 | 定位 | 核心优势 | GPU 需求 | 最佳部署场景 |
|------|------|---------|---------|------------|
| **vLLM** | 通用高性能 | PagedAttention, 连续批处理, Gumbel-Max 采样 | NVIDIA (A100/H100) | 生产级在线服务, 高并发 |
| **TensorRT-LLM** | NVIDIA 极致优化 | 深度 kernel 优化, FP8, Inflight Batching | NVIDIA (H100/B200) | 追求极致吞吐, NVIDIA 锁定 |
| **SGLang** | 结构化生成 | FSM/Logits Masking 保证 Schema, RadixAttention | NVIDIA | Agent 工作流, JSON 强制输出 |
| **llama.cpp** | 边缘/本地 | CPU/Metal/Vulkan 多后端, GGUF 量化 | CPU / Apple Silicon / 消费级 GPU | 本地部署, 边缘推理, Mac 开发 |
| **Ollama** | 开发者友好 | llama.cpp 封装, 一键部署 | CPU / GPU | 快速原型, 本地开发测试 |

> **结构化输出**: 生产环境依赖 Prompt+事后校验不可接受, 应在推理引擎底层用 FSM + Logits Masking 从物理层面保证 Schema 一致性 (SGLang, vLLM, TensorRT-LLM 均支持)

## 推理性能核心指标

| 指标 | 定义 | 优化方向 |
|------|------|---------|
| **TTFT** (Time to First Token) | 首 Token 延迟 | 分块 Prefill, 前缀缓存 |
| **TPS** (Tokens Per Second) | 每秒生成速度 | 投机解码, Flash Attention, 量化 |
| **ITL** (Inter-Token Latency) | Token 间延迟 | 连续批处理, 分离式架构 |
| **吞吐** (Requests/s) | 并发处理能力 | PagedAttention, Continuous Batching |

## 前缀缓存优化排列

| 位置 | 内容 | 缓存命中 | 说明 |
|------|------|---------|------|
| 1 (最前) | 系统提示词 | 几乎总命中 | 不变内容前置 |
| 2 | 工具定义 | 会话内命中 | |
| 3 | 检索文档 | 可能命中 | |
| 4 | 对话历史 | 通常未命中 | 变化内容后置 |
| 5 (最后) | 用户当前输入 | 不命中 | |

> 缓存命中 Token 价格通常为常规输入的 **10%** (Anthropic)

## 相关页面

- [[10_部署推理/03_推理优化/02_LLM推理_深入分析]] -- 推理深度剖析全文
- [[05_大模型/05_LLM架构/04_LLM_架构_Evolution]] -- 架构演进与 MoE/SSM
- [[00_入门/02_技术概览/04_AI_推理模型_指南]] -- 推理模型与推理计算
- [[AI_New_Architectures]] -- SSM/Mamba/混合架构
- [[概念/LLM/context-engineering]] -- 上下文工程指南
