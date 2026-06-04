---
title: 小模型与端侧 LLM (Edge LLM)
category: "04-nlp-llms"
tags: ["edge-llm", "small-language-model", "on-device", "quantization", "efficient-llm"]
summary: "小模型与端侧 LLM 覆盖 Phi/Gemma/Qwen 等高效小模型及端侧部署方案 (ONNX/MLC-LLM/MediaPipe)。"
created: 2026-06-04
updated: 2026-06-04
---

# 小模型与端侧 LLM (Edge LLM)

> **一句话理解**: 让 LLM 跑在手机/PC/嵌入式设备上——通过小模型设计 + 量化压缩 + 高效推理引擎，实现离线可用、隐私安全、低延迟的端侧 AI。

---

## 核心内容

- [小模型与端侧 LLM 深度解读](./Edge_LLM_Deep_Dive.md) — 从高效模型设计到端侧部署的全链路

## 关键主题

| 维度 | 核心技术 | 代表 |
|------|----------|------|
| **高效模型** | 知识蒸馏、数据筛选 | Phi-3, Gemma 2B, Qwen2-0.5B |
| **量化** | 4-bit/8-bit 量化 | GPTQ, AWQ, GGUF |
| **推理引擎** | 端侧优化推理 | ONNX Runtime, MLC-LLM, llama.cpp |
| **部署平台** | 手机/PC/IoT | Apple MLX, Android NNAPI, MediaPipe |
