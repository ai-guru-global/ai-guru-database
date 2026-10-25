---
title: 硬件与算力
category: 10-deployment-inference-hardware
tags: [hardware, gpu, npu, ascend, gpu-stack, chinese-ai-chip, inference]
summary: "> GPU/NPU/ASIC 推理硬件的选型、集群管理与国产芯片适配。"
created: 2026-07-02
updated: 2026-08-05
tier: core
sources: []

name_zh: "硬件与算力"
---
# 硬件与算力

> 中文简称：硬件与算力 ｜ English: Hardware & Compute

## 本文件夹定位

本目录合并了原"GPU 基础设施"与"硬件选型"，聚焦 **推理硬件层**——从 GPU 集群管理（GPUStack）到国产 AI 芯片（昇腾/寒武纪/海光/摩尔线程）的选型与部署适配。回答的是"在什么硬件上跑、怎么管、国产化怎么做"。

与相邻目录的边界：硬件决定了 [03_推理优化](../03_推理优化/README) 的优化上限；本目录偏"硬件与平台"。

---

## 内容索引

| 序号 | 文档 | 主题 | 适用读者 |
|------|------|------|----------|
| 01 | [[10_部署推理/05_硬件与算力/01_GPUStack_深入分析|GPUStack]] | 开源 GPU 集群管理器（MaaS），异构 GPU、OpenAI 兼容 API | 企业私有部署 |
| 02 | [[10_部署推理/05_硬件与算力/02_Ascend_NPU_推理_指南|昇腾 NPU 推理部署指南]] | CANN/MindIE/vLLM-Ascend + K8s 部署 | 国产化推理工程师 |
| 03 | [[10_部署推理/05_硬件与算力/03_Chinese_AI_Chip_推理_矩阵|国产 AI 芯片推理矩阵]] | 昇腾/寒武纪/海光/摩尔线程横向对比与选型 | 架构师、SRE |

---

## 国产 AI 芯片速查

| 厂商 | 芯片 | 软件栈 | LLM 支持度 | 适用场景 |
|------|------|--------|------------|----------|
| **华为** | 昇腾 910B | CANN/MindIE | 高（vLLM-Ascend） | 国产化主力 |
| **寒武纪** | 思元 590 | Neuware | 中 | 国产替代 |
| **海光** | DCU | ROCm 兼容 | 中 | 国产替代 |
| **摩尔线程** | MTT S80 | MUSA | 初步 | 国产化探索 |

## 关联目录

- [[10_部署推理/README|模型部署与推理 总览]]
- [[10_部署推理/03_推理优化/README|推理优化]] — 硬件决定优化上限
- [[12_架构基建/07_硬件与算力/README|架构基建-硬件计算]] — 训练/通用算力视角
- [[概念/GPU/gpu|GPU 概念卡]] · [[概念/GPU/gpustack|GPUStack 入门]]
