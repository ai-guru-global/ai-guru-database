---
title: 推理优化
category: 10-deployment-inference-optimization
tags: [inference, optimization, kv-cache, paged-attention, speculative-decoding, scheduling, performance]
summary: "> LLM 推理性能工程全景：从 KV Cache、调度策略到算子编译与专项优化的完整方法论。"
created: 2026-07-24
updated: 2026-08-05
tier: core
sources: []

name_zh: "推理优化"
---
# 推理优化

> 中文简称：推理优化 ｜ English: Inference Optimization

## 本文件夹定位

本目录是 **10_部署推理 的性能工程核心**，系统覆盖 LLM 推理阶段"让模型跑得更快、更省、更稳"的全部技术。它合并了原"推理优化 / 推理性能 / 缓存策略"三个主题，按 **指标→瓶颈→优化技术→评测方法** 的线索组织：

- **不重复**讲解具体引擎的安装配置（见 [02_推理引擎](../02_推理引擎/README)）；
- **专门回答**：延迟花在哪？吞吐瓶颈是算力、显存带宽还是通信？长上下文/高并发/MoE/多模态分别怎么优化？如何设计公平可复现的 benchmark？

与相邻目录的边界：**部署流程**→[01_部署基础](../01_部署基础/README)；**引擎选型**→[02_推理引擎](../02_推理引擎/README)；**量化压缩**→[04_模型量化](../04_模型量化/README)。

---

## 内容索引

> 文件按"基础→缓存→调度→算子→并行→专项→方法论"分组，共 27 篇。

### 🎯 基础与总览

| 序号 | 文档 | 主题 | 适用读者 |
|------|------|------|----------|
| 01 | [[10_部署推理/03_推理优化/01_推理性能_基础\|推理性能基础]] | TTFT/TPOT/吞吐指标、Roofline 瓶颈分析、优化决策树 | 所有从业者 |
| 02 | [[10_部署推理/03_推理优化/02_LLM推理_深入分析\|LLM 推理深度剖析]] | 解码策略、KV 缓存、GQA/MLA、FlashAttention、服务引擎全链路 | 推理工程师 |
| 03 | [[10_部署推理/03_推理优化/03_推理_Tuning_Cheat_Sheet\|推理调优速查表]] | vLLM/SGLang/TGI/TRT-LLM 关键参数、性能诊断、场景配置 | 推理工程师、SRE |
| 04 | [[10_部署推理/03_推理优化/04_模型压缩\|模型压缩统一视角]] | 剪枝/蒸馏/量化/低秩分解的完整对比与组合策略 | 部署工程师 |

### 💾 KV Cache 与缓存

| 序号 | 文档 | 主题 | 适用读者 |
|------|------|------|----------|
| 05 | [[10_部署推理/03_推理优化/05_KV_Cache_深入分析\|KV Cache 深度研究]] | 自回归冗余、显存公式、压缩与量化、生产实践 | 推理优化工程师 |
| 06 | [[10_部署推理/03_推理优化/06_kv_cache_inference_optimization\|KV Cache × Continuous Batching]] | 显存-调度协同优化、prefix caching、chunked prefill | 系统工程师 |
| 07 | [[10_部署推理/03_推理优化/07_kv_cache_paged_attention\|KV Cache × PagedAttention]] | 从显存碎片到虚拟内存的推理革命 | 系统工程师 |
| 08 | [[10_部署推理/03_推理优化/08_paged_attention_continuous_batching\|PagedAttention × Continuous Batching]] | 内存效率与动态调度的双重引擎 | 系统工程师 |
| 09 | [[10_部署推理/03_推理优化/09_LLM_缓存\|LLM 缓存策略]] | KV Cache 管理、语义缓存、Prompt/前缀缓存、分布式架构 | 平台工程师 |
| 10 | [[10_部署推理/03_推理优化/10_提示缓存_高级\|Prompt 缓存高级技术]] | 前缀缓存、命中率优化、缓存失效策略 | 平台工程师 |
| 11 | [[10_部署推理/03_推理优化/11_提示缓存_and_KV_Cache_优化\|Prompt Caching × KV Cache 优化]] | KV Cache 管理、Prefix Caching、Prompt 缓存深度解析 | 推理优化工程师 |
| 12 | [[10_部署推理/03_推理优化/12_Speculative_Decoding_高级_2026\|投机解码前沿 2026]] | Medusa、Lookahead Decoding、REST 等变体与生产实践 | 追求极致延迟 |

### ⚡ 调度与并发

| 序号 | 文档 | 主题 | 适用读者 |
|------|------|------|----------|
| 13 | [[10_部署推理/03_推理优化/13_Prefill_Decode_Disaggregation\|Prefill-Decode 分离]] | Disaggregated Serving 架构与 KV Cache 传输 | 长上下文/高并发 |
| 14 | [[10_部署推理/03_推理优化/14_Request_调度_for_LLMs\|LLM 请求调度]] | Continuous Batching、抢占、Chunked Prefill、SLO-aware | 服务调度 |
| 15 | [[10_部署推理/03_推理优化/15_推理_Autoscaling_and_负载均衡\|弹性扩缩容与负载均衡]] | HPA、预热池、多模型混部、智能路由 | 平台/SRE |

### 🔧 算子与编译器

| 序号 | 文档 | 主题 | 适用读者 |
|------|------|------|----------|
| 16 | [[10_部署推理/03_推理优化/16_Compiler_and_Kernel_深入分析\|推理编译器与算子优化]] | torch.compile/Triton/CUTLASS、算子融合 | Kernel/算子优化 |
| 17 | [[10_部署推理/03_推理优化/17_Flash_Kernels_深入分析\|Flash 系列 Kernel 深潜]] | FlashAttention / FlashDecoding / FlashInfer / FlashMLA | Kernel/算子优化 |

### 🔗 并行与通信

| 序号 | 文档 | 主题 | 适用读者 |
|------|------|------|----------|
| 18 | [[10_部署推理/03_推理优化/18_Parallel_策略_深入分析\|LLM 并行策略全景]] | TP/PP/DP/EP/SP/CP 六种并行维度切分万亿参数模型 | 分布式工程师 |
| 19 | [[10_部署推理/03_推理优化/19_Communication_系统_深入分析\|LLM 通信系统全景]] | NVLink/IB 物理层 + 胖树拓扑 + NCCL 集合通信原语 | 分布式工程师 |

### 🎯 专项优化

| 序号 | 文档 | 主题 | 适用读者 |
|------|------|------|----------|
| 20 | [[10_部署推理/03_推理优化/20_Multi_LoRA_服务_深入分析\|Multi-LoRA 推理服务]] | 单基座多适配器高效服务（S-LoRA/Punica） | 企业多租户 |
| 21 | [[10_部署推理/03_推理优化/21_嵌入_模型服务\|Embedding 与 Reranker 服务]] | Dynamic Batching、Matryoshka、混合精度 | RAG 部署 |
| 22 | [[10_部署推理/03_推理优化/22_MoE_推理优化\|MoE 推理优化]] | All-to-All、Expert Parallelism、负载均衡 | MoE 部署 |
| 23 | [[10_部署推理/03_推理优化/23_多模态_推理优化\|多模态推理优化]] | Vision Encoder、Image Token 压缩、VLM Prefill | VLM 部署 |
| 24 | [[10_部署推理/03_推理优化/24_长上下文_推理_2026\|长上下文推理 2026]] | 128K+ 上下文、KV Cache 压缩、PD 分离 | 长上下文服务 |
| 25 | [[10_部署推理/03_推理优化/25_Disaggregated_服务_2026\|2026 推理服务前沿架构]] | 前缀共享 / 连续批处理 → PD 分离演进 | 架构师 |

### 📊 方法论与评测

| 序号 | 文档 | 主题 | 适用读者 |
|------|------|------|----------|
| 26 | [[10_部署推理/03_推理优化/26_推理_Profiling_and_基准测试\|推理 Profiling 与 Benchmarking]] | Nsight、PyTorch Profiler、llmperf、评测陷阱 | 性能测试工程师 |
| 27 | [[10_部署推理/03_推理优化/27_推理性能_未解问题_2026\|推理性能未解问题与缺口评估]] | 边缘、异构、能耗、多租户、编译启动等缺口 | 架构师、性能工程师 |

---

## 核心知识体系

| 知识域 | 核心内容 | 重要程度 |
|--------|----------|----------|
| **KV Cache** | 显存占用的核心，压缩/分页/共享/量化 | P0 |
| **批处理调度** | Continuous Batching 消除调度浪费 | P0 |
| **算子优化** | FlashAttention / 融合 / 编译器 | P0 |
| **并行策略** | 多 GPU/多节点的并行维度组合 | P0 |
| **PD 分离** | Prefill/Decode 资源解耦的新架构 | P1 |
| **Multi-LoRA** | 企业多租户多任务服务 | P1 |

## 核心指标速查

| 指标 | 含义 | 常见目标 |
|------|------|----------|
| **TTFT** | Time To First Token，首 token 延迟 | P50 < 100ms，P99 < 500ms |
| **TPOT** | Time Per Output Token，生成阶段每 token 耗时 | 尽量低，与 decode 算力/带宽相关 |
| **Throughput** | 总吞吐（tokens/s 或 requests/s） | 越高越好，受 batch size 影响大 |
| **QPS** | 每秒请求数 | 在线服务核心指标 |
| **GPU Utilization** | GPU 利用率 | 高不一定高效，需结合 roofline |

## 关联目录

- [[10_部署推理/README|模型部署与推理 总览]]
- [[10_部署推理/02_推理引擎/README|推理引擎]] — 具体引擎的安装配置与选型
- [[10_部署推理/04_模型量化/README|模型量化]] — 量化是本目录"计算优化"的深度展开
- [[10_部署推理/05_硬件与算力/README|硬件与算力]] — 硬件选型决定优化上限
- [[12_架构基建/07_硬件与算力/README|架构基建-硬件计算]]
- [[07_模型训练/05_模型压缩/README|模型压缩]] — 训练侧的压缩视角
