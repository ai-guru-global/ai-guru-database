---
title: 推理引擎
category: 10-deployment-inference-engines
tags: [inference, engine, vllm, sglang, tensorrt, tgi, ollama, llama-cpp, serving]
summary: "> LLM 推理引擎与服务平台全景：开源引擎、云平台、选型/迁移/基准测试方法论。"
created: 2026-07-02
updated: 2026-08-05
tier: core
sources: []

name_zh: "推理引擎"
---
# 推理引擎

> 中文简称：推理引擎 ｜ English: Inference Engines

## 本文件夹定位

本目录是 **LLM 推理引擎的选型与配置地图**，覆盖开源引擎（vLLM/SGLang/TGI/TensorRT-LLM/llama.cpp 等）、云推理平台（Groq/Together/Fireworks 等），以及贯穿其中的选型、迁移、基准测试方法论。回答的是"用哪个引擎、怎么配、怎么换"。

与相邻目录的边界：**上线流程**→[01_部署基础](../01_部署基础/README)；**性能优化原理**→[03_推理优化](../03_推理优化/README)；本目录偏"工具与配置"。

---

## 内容索引

### 🧭 选型与方法论

| 序号 | 文档 | 主题 | 适用读者 |
|------|------|------|----------|
| 17 | [[10_部署推理/02_推理引擎/17_LLM_推理引擎_选型_指南|LLM 推理引擎选型指南]] | 决策树、成本模型、场景速查——统一选型 | 架构师、决策者 |
| 15 | [[10_部署推理/02_推理引擎/15_LLM推理_基准测试_指南|LLM 推理基准测试指南]] | 统一指标、工具、方法、报告模板 | 性能工程师 |
| 16 | [[10_部署推理/02_推理引擎/16_LLM_推理引擎_迁移_指南|LLM 推理引擎迁移指南]] | vLLM/SGLang/TGI/TRT-LLM/云 API 切换策略 | 架构师、SRE |
| 14 | [[10_部署推理/02_推理引擎/14_LLM_API_设计_模式|LLM API 设计模式]] | 推理服务的 API 设计最佳实践 | 后端工程师 |
| 01 | [[10_部署推理/02_推理引擎/01_批处理_API_对比_2026|LLM Batch API 完全指南]] | 批量推理的成本优化利器（2026 对比） | 成本优化 |

### 🚀 开源推理引擎

| 序号 | 文档 | 主题 | 适用读者 |
|------|------|------|----------|
| 29 | [[10_部署推理/02_推理引擎/29_vLLM_深入分析|vLLM]] | UC Berkeley 生产级引擎，PagedAttention 显存优化 | 通用生产 |
| 30 | [[10_部署推理/02_推理引擎/30_vLLM_Paged注意力_架构|vLLM + PagedAttention 架构图]] | 一张图看懂 vLLM 如何服务更多请求 | 架构师、初学者 |
| 23 | [[10_部署推理/02_推理引擎/23_SGLang_深入分析|SGLang]] | RadixAttention 前缀缓存、多 LoRA、结构化输出 | 追求极致性能 |
| 26 | [[10_部署推理/02_推理引擎/26_TGI_深入分析|TGI]] | HuggingFace 生产级引擎，Rust+Python、HF 生态原生 | HF 生态团队 |
| 25 | [[10_部署推理/02_推理引擎/25_TensorRT_LLM_深入分析|TensorRT-LLM]] | NVIDIA 高性能推理，TensorRT 编译、FP8、Triton 集成 | H100 部署 |
| 18 | [[10_部署推理/02_推理引擎/18_LMDeploy_深入分析|LMDeploy]] | 国产引擎，TurboMind/PyTorch 双后端、AWQ、国产芯片 | 中文场景 |
| 13 | [[10_部署推理/02_推理引擎/13_llama_cpp_深入分析|llama.cpp]] | 纯 C/C++ 本地推理，CPU/GPU 多后端、GGUF 量化 | 边缘/本地 |
| 03 | [[10_部署推理/02_推理引擎/03_CTranslate2_深入分析|CTranslate2]] | 轻量跨平台 Transformer 推理，CPU/GPU 高效服务 | CPU 轻量服务 |
| 19 | [[10_部署推理/02_推理引擎/19_MLC_LLM_深入分析|MLC LLM]] | 移动端/异构 LLM 推理，手机/Web/边缘 | 手机/Web/边缘 |
| 12 | [[10_部署推理/02_推理引擎/12_LiteRT_深入分析|LiteRT]] | 边缘 AI 推理（原 TF Lite），Android/iOS/嵌入式、Delegate | 移动端部署 |
| 04 | [[10_部署推理/02_推理引擎/04_DeepSpeed_MII_深入分析|DeepSpeed-MII]] | 微软高性能推理框架 | 大规模部署 |
| 02 | [[10_部署推理/02_推理引擎/02_BentoML_深入分析|BentoML]] | AI 模型服务框架，vLLM/TGI 集成、K8s、A/B 测试 | 模型服务 |
| 11 | [[10_部署推理/02_推理引擎/11_KServe_深入分析|KServe]] | CNCF K8s 标准化模型服务，多运行时、自动扩缩、灰度 | 平台工程师 |
| 28 | [[10_部署推理/02_推理引擎/28_Triton_推理_服务端_深入分析|Triton Inference Server]] | NVIDIA 多模型推理平台，TensorRT/PyTorch/ONNX 统一入口 | 企业推理平台 |
| 10 | [[10_部署推理/02_推理引擎/10_JVM_AI_部署|JVM AI 部署]] | Spring AI 等 JVM 生态的 AI 部署与推理 | Java 团队 |

### ☁️ 云推理平台

| 序号 | 文档 | 主题 | 适用读者 |
|------|------|------|----------|
| 08 | [[10_部署推理/02_推理引擎/08_HF_推理_Endpoints_指南|HF Inference Endpoints]] | 一键 Serverless 部署开源大模型 | HF 用户 |
| 07 | [[10_部署推理/02_推理引擎/07_Groq_深入分析|Groq]] | LPU 专用芯片，毫秒级延迟、OpenAI 兼容 API | 实时低延迟 |
| 27 | [[10_部署推理/02_推理引擎/27_Together_AI_深入分析|Together AI]] | 200+ 开源模型、微调、OpenAI 兼容 | 开源模型优先 |
| 05 | [[10_部署推理/02_推理引擎/05_Fireworks_AI_深入分析|Fireworks AI]] | FireAttention、批量、FireFunction | 高性价比批量 |
| 21 | [[10_部署推理/02_推理引擎/21_Novita_AI_深入分析|Novita AI]] | 新兴云推理 API，主打高性价比 | 成本敏感 |
| 20 | [[10_部署推理/02_推理引擎/20_Modal_深入分析|Modal]] | 无服务器 GPU 云，Python 装饰器弹性部署 | 快速原型/异步 |
| 22 | [[10_部署推理/02_推理引擎/22_Ollama_深入分析|Ollama]] | 本地大模型部署，一键运行、多模态、K8s | 开发者、个人 |

### 🛠️ 应用框架

| 序号 | 文档 | 主题 | 适用读者 |
|------|------|------|----------|
| 06 | [[10_部署推理/02_推理引擎/06_Gradio_深入分析|Gradio]] | ML Demo 框架，几行代码构建 Web UI | 快速演示 |
| 24 | [[10_部署推理/02_推理引擎/24_streamlit_概览|Streamlit]] | Python 快速构建数据应用与 ML Demo | 快速演示 |

### 🩺 故障树分析（FTA）

| 领域 | 入口 | 覆盖故障 |
|------|------|---------|
| 推理（18 篇） | [[10_部署推理/02_推理引擎/FTA/README|FTA 索引]] | 启动/性能/显存/流式/热加载/量化等 |
| 微调（4 篇） | [[10_部署推理/02_推理引擎/FTA/README|FTA 索引]] | LoRA 部署/合并/QLoRA/训练中断 |
| 应用（3 篇） | [[10_部署推理/02_推理引擎/FTA/README|FTA 索引]] | Agent/RAG/评估故障树 |

> FTA 故障树共 25 篇：现象 → 根因 → 底事件的可执行排查树，可直接作为排障手册。

---

## 引擎对比（2026 量级参考）

| 引擎 | 吞吐量 | 特点 | 选型建议 |
|------|--------|------|----------|
| **SGLang** | 16,215 tok/s | RadixAttention、前缀缓存 | 极致性能、多轮对话 |
| **vLLM** | 15,000+ tok/s | PagedAttention、成熟生态 | 通用生产环境 |
| **TensorRT-LLM** | 15,000+ tok/s | NVIDIA 官方、低延迟 | 单请求优化、H100 |
| **LMDeploy** | 13,500+ tok/s | TurboMind、国产芯片 | 中文场景 |
| **TGI** | 12,000+ tok/s | HF 原生、监控完善 | HF 生态生产 |
| **Groq** | 800+ tok/s (70B) | LPU 专用芯片、极低延迟 | 实时应用 |
| **llama.cpp** | 6,000+ tok/s | CPU 推理、GGUF | 边缘/本地 |

> ⚠️ 数值为公开资料约数汇总，测试条件各异，仅作量级参考；选型请以自身负载实测为准。

## 关联目录

- [[10_部署推理/README|模型部署与推理 总览]]
- [[10_部署推理/01_部署基础/README|部署基础]] — 引擎选定后的上线流程
- [[10_部署推理/02_推理引擎/FTA/README|故障树分析（FTA）]] — 25 篇故障树：启动/性能/显存/流式/热加载/微调/Agent/RAG/评估
- [[10_部署推理/03_推理优化/README|推理优化]] — 引擎背后的性能原理
- [[概念/Inference/sglang|SGLang 概念卡]] · [[概念/LLM/tensorrt-llm|TensorRT-LLM 概念卡]]
