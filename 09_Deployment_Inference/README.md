---
title: 模型部署与推理
category: 09-deployment-inference
tags: ["deployment", "inference", "serving", "vllm"]
summary: "> 从模型到生产的最后一公里——高效、可靠、可扩展的推理服务。"
created: 2026-05-31
updated: 2026-06-15
---

# 模型部署与推理

> 从模型到生产的最后一公里——高效、可靠、可扩展的推理服务。

---

## 文档导航

| 文档 | 内容 | 适用角色 |
|------|------|----------|
| [Deployment Inference](./Deployment_Inference.md) | 部署与推理加速：PagedAttention、量化、批处理 | 架构师、开发者 |
| [Ollama Deep Dive](./Ollama_Deep_Dive.md) | 本地大模型部署：一键运行 Llama/Mistral/Qwen | 开发者、个人用户 |
| [SGLang Deep Dive](./SGLang_Deep_Dive.md) | 高性能推理框架：RadixAttention、前缀缓存、16k tok/s | 追求极致性能 |
| [vLLM Deep Dive](./vLLM_Deep_Dive.md) | PagedAttention 显存优化：UC Berkeley 生产级引擎 | 通用生产 |
| [LMDeploy Deep Dive](./LMDeploy_Deep_Dive.md) | 国产推理引擎：TurboMind、AWQ 量化、中文优化 | 中文场景 |
| [LiteRT Deep Dive](./LiteRT_Deep_Dive.md) | 边缘 AI 推理：Android/iOS/嵌入式、低功耗 | 移动端部署 |
| [llama.cpp Deep Dive](./llama_cpp_Deep_Dive.md) | 纯 C/C++ 本地推理：CPU 运行、GGUF 量化 | 边缘/本地 |
| [TensorRT-LLM Deep Dive](./TensorRT_LLM_Deep_Dive.md) | NVIDIA 高性能推理：TensorRT 加速、低延迟 | H100 部署 |
| [TGI Deep Dive](./TGI_Deep_Dive.md) | Hugging Face 生产级推理：Rust+Python、HF 生态原生 | HF 生态团队 |
| [Groq Deep Dive](./Groq_Deep_Dive.md) | LPU 高速推理云：毫秒级延迟、OpenAI 兼容 API | 实时低延迟 |
| [BentoML Deep Dive](./BentoML_Deep_Dive.md) | AI 模型服务框架：一键打包模型为 API | 模型服务 |
| [GPUStack Deep Dive](./GPUStack_Deep_Dive.md) | 开源 GPU 集群管理器：异构 GPU、MaaS、OpenAI 兼容 API | 企业私有部署 |

## 推理引擎对比 (2026)

| 引擎 | 吞吐量 | 特点 | 选型建议 |
|------|--------|------|----------|
| **SGLang** | 16,215 tok/s | RadixAttention、前缀缓存 | 极致性能、多轮对话 |
| **vLLM** | 15,000+ tok/s | PagedAttention、成熟生态 | 通用生产环境 |
| **LMDeploy** | 16,132 tok/s | TurboMind、国内优化 | 中文场景 |
| **TensorRT-LLM** | 15,000+ tok/s | NVIDIA 官方、低延迟 | 单请求优化 |
| **TGI** | 12,000+ tok/s | Hugging Face 原生、监控完善 | HF 生态生产环境 |
| **Groq** | 800+ tok/s (70B) | LPU 专用芯片、极低延迟 | 实时应用、API 优先 |
| **llama.cpp** | ~6,000 tok/s | CPU 推理、GGUF | 边缘/本地 |
| **GPUStack** | 依赖后端 | 异构 GPU 集群管理、MaaS | 私有模型服务平台 |

## 本地部署方案

| 方案 | 易用性 | API 支持 | 资源占用 | 选型建议 |
|------|--------|----------|----------|----------|
| **Ollama** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 中等 | 快速原型、个人使用 |
| **llama.cpp** | ⭐⭐⭐ | ⭐⭐ | 最低 | 极致轻量、CPU |
| **LM Studio** | ⭐⭐⭐⭐ | ⭐⭐⭐ | 中等 | 桌面应用 |
| **GPUStack** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 中高 | 异构 GPU 集群、团队共享 |

## 关联目录

- [14_AI_Gateway](../14_AI_Gateway/) -- AI 网关与路由
- [11_RAG_Systems](../11_RAG_Systems/) -- RAG 应用场景
- [13_Agent_Production](../13_Agent_Production/) -- Agent 推理需求

---

*Last updated: 2026-06-15*

## Related
- [[09_Deployment_Inference/vLLM_Deep_Dive|vLLM: 生产级 LLM 推理引擎]]
- [[09_Deployment_Inference/TGI_Deep_Dive|TGI: Hugging Face 生产级推理引擎]]
- [[09_Deployment_Inference/Groq_Deep_Dive|Groq: LPU 高速推理云平台]]
- [[09_Deployment_Inference/BentoML_Deep_Dive|BentoML: AI 模型服务框架]]
- [[09_Deployment_Inference/LMDeploy_Deep_Dive|LMDeploy: InternLM 高性能推理引擎]]
- [[09_Deployment_Inference/llama_cpp_Deep_Dive|llama.cpp: 纯 C/C++ 本地 LLM 推理]]
- [[09_Deployment_Inference/LiteRT_Deep_Dive|LiteRT / TensorFlow Lite: 边缘 AI 推理]]
- [[09_Deployment_Inference/TensorRT_LLM_Deep_Dive|TensorRT-LLM: NVIDIA 生产级 LLM 推理]]
- [[09_Deployment_Inference/README|模型部署与推理]]
- [[09_Deployment_Inference/SGLang_Deep_Dive|SGLang: 高性能 LLM 推理框架]]
- [[09_Deployment_Inference/README_for_dummy|09 部署与推理 — 小白版 🚀]]
- [[09_Deployment_Inference/Ollama_Deep_Dive|Ollama: 本地大模型部署平台]]
- [[09_Deployment_Inference/GPUStack_Deep_Dive|GPUStack: 开源 GPU 集群管理与模型服务平台]]

- [[09_Deployment_Inference/Deployment_Inference]] — 模型部署与推理加速 (Deployment & Inference) (共享: deployment, inference, serving, vllm)
- [[09_Deployment_Inference/Deployment_Inference_2026]] — 部署推理 2026 趋势 (共享: deployment, inference, serving, vllm)
- [[09_Deployment_Inference/Deployment_Inference_for_dummy]] — 模型部署与推理加速 - 小白版 (共享: deployment, inference, serving, vllm)
- [[09_Deployment_Inference/Inference-in-nutshell]] — 模型推理速成指南 (共享: deployment, inference, serving, vllm)
- [[09_Deployment_Inference/Speculative_Decoding_Advanced_2026|Speculative_Decoding_Advanced_2026]]
- [[09_Deployment_Inference/Prompt_Caching_and_KV_Cache_Optimization|Prompt_Caching_And_Kv_Cache_Optimization]]

## 本期新增

- [[09_Deployment_Inference/vLLM_Deep_Dive|vLLM 深度解析 (2026 全面升级)]]
- [[09_Deployment_Inference/TGI_Deep_Dive|TGI 深度解析 (Hugging Face 推理引擎)]]
- [[09_Deployment_Inference/Groq_Deep_Dive|Groq 深度解析 (LPU 高速推理云)]]
- [[09_Deployment_Inference/Speculative_Decoding_Advanced_2026|Speculative Decoding Advanced]]
- [[09_Deployment_Inference/Prompt_Caching_and_KV_Cache_Optimization|Prompt Caching and KV Cache Optimization]]
- [[09_Deployment_Inference/GPUStack_Deep_Dive|GPUStack: 开源 GPU 集群管理与模型服务平台]]

## 相关页面
- [[09_Deployment_Inference/Quantization_Techniques_2026|Quantization Techniques 2026]]

- [[concepts/model-compression|Model Compression]]

## 新增页面

- [[09_Deployment_Inference/vLLM_Deep_Dive|vLLM 深度解析]]
- [[09_Deployment_Inference/TGI_Deep_Dive|TGI 深度解析]]
- [[09_Deployment_Inference/Groq_Deep_Dive|Groq 深度解析]]
- [[09_Deployment_Inference/LLM_Cost_Optimization|LLM 成本优化]]
- [[09_Deployment_Inference/Prompt_Caching_Advanced|Prompt 缓存高级技术]]
- [[09_Deployment_Inference/GPUStack_Deep_Dive|GPUStack 深度解析]]
- [[09_Deployment_Inference/GPUStack_for_dummy|GPUStack 入门指南]]
- [[concepts/gpustack|GPUStack 概念卡片]]
