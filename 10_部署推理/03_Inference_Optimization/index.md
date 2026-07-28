---
title: Inference Optimization
type: index
created: 2026-07-24
updated: 2026-07-25
sources: []
tags: [auto-index, inference-optimization]
name_zh: "推理优化"
name_en: "Inference Optimization"
---

# Inference Optimization

> 中文简称：推理优化 ｜ English Name: Inference Optimization

本页索引 `10_部署推理/03_Inference_Optimization` 的内容，聚焦 LLM 推理的优化技术——从 KV Cache 与分页注意力，到并行策略、算子编译与 Multi-LoRA 服务。

## 文件导航

| 文件 | 说明 | 类型 |
|------|------|------|
| [[10_部署推理/03_Inference_Optimization/kv-cache-inference-optimization\|KV Cache 推理优化]] | KV Cache 原理、压缩与显存优化 | 核心 |
| [[10_部署推理/03_Inference_Optimization/kv-cache-paged-attention\|KV Cache × PagedAttention]] | 分页注意力与 KV Cache 的协同 | 核心 |
| [[10_部署推理/03_Inference_Optimization/paged-attention-continuous-batching\|PagedAttention × Continuous Batching]] | 内存效率与动态调度的双重引擎 | 合成 |
| [[10_部署推理/03_Inference_Optimization/Parallel_Strategies_Deep_Dive\|并行策略全景]] | TP/PP/EP/SP/CP/Ring-Attention 多维并行 | 深度 |
| [[10_部署推理/03_Inference_Optimization/Compiler_and_Kernel_Deep_Dive\|编译器与算子优化]] | torch.compile/Triton/CUTLASS/算子融合 | 深度 |
| [[10_部署推理/03_Inference_Optimization/Multi_LoRA_Serving_Deep_Dive\|Multi-LoRA 推理服务]] | 单基座多适配器高效服务（S-LoRA/Punica） | 深度 |
| [[10_部署推理/03_Inference_Optimization/Inference_Optimization_for_dummy\|推理优化小白指南]] | 零基础入门 | 入门 |
| [[10_部署推理/03_Inference_Optimization/Inference_Tuning_Cheat_Sheet\|推理调优速查表]] | 实战调优 checklist | 速查 |
| [[10_部署推理/03_Inference_Optimization/Model_Compression|模型压缩统一视角 (Model Compression)]] | 模型压缩统一技术体系：剪枝/蒸馏/量化/低秩分解的完整对比、组合策略、2026 LLM 压缩实践与部署优化。 | - | - |
| [[10_部署推理/03_Inference_Optimization/LLM_Inference_Deep_Dive|LLM 推理深度剖析：解码策略、推理优化与服务引擎]] | > 系统覆盖 LLM 推理全链路：解码策略（贪心/束搜索/温度/Top-k/Top-p/Gumbel-Max）、推理优化（KV 缓存/GQA/MLA/Fl... | - | - |

## 核心知识体系

| 知识域 | 核心内容 | 重要程度 |
|--------|----------|----------|
| KV Cache | 显存占用的核心，压缩/分页/共享 | P0 |
| 批处理调度 | Continuous Batching 消除调度浪费 | P0 |
| 并行策略 | 多 GPU/多节点的并行维度组合 | P0 |
| 算子优化 | FlashAttention/融合/编译器 | P0 |
| Multi-LoRA | 企业多租户多任务服务 | P1 |

## 关联章节

- [[10_部署推理/index|部署推理 总览]]
- [[10_部署推理/04_Inference_Performance/index|推理性能]]
- [[10_部署推理/02_Inference_Engines/index|推理引擎]]
- [[10_部署推理/06_Caching/index|缓存]]
- [[10_部署推理/05_Quantization/index|量化]]
- [[12_架构基建/07_Hardware_Compute/index|硬件计算]]
- [[12_架构基建/AI_Networking/index|AI 网络]]
- [[07_模型训练/05_Compression/index|模型压缩]]
