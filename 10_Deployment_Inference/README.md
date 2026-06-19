---
title: 模型部署与推理
category: 09-deployment-inference
tags: ["deployment", "inference", "serving", "vllm"]
summary: "> 从模型到生产的最后一公里——高效、可靠、可扩展的推理服务。"
created: 2026-05-31
updated: 2026-06-16
---

# 模型部署与推理

> 从模型到生产的最后一公里——高效、可靠、可扩展的推理服务。

---

## 文档导航

| 文档 | 内容 | 适用角色 |
|------|------|----------|
| [Deployment Inference](./Deployment_Inference.md) | 部署与推理加速：PagedAttention、量化、批处理 | 架构师、开发者 |
| [LLM Inference Engine Selection Guide](./LLM_Inference_Engine_Selection_Guide.md) | 推理引擎统一选型：决策树、成本模型、场景速查 | 架构师、决策者 |
| [LLM Inference Benchmarking Guide](./LLM_Inference_Benchmarking_Guide.md) | 推理引擎基准测试：指标、工具、方法、报告模板 | 性能工程师、架构师 |
| [LLM Inference Engine Migration Guide](./LLM_Inference_Engine_Migration_Guide.md) | 引擎迁移：vLLM/SGLang/TGI/TRT-LLM/云 API 切换策略 | 架构师、SRE |
| [Ollama Deep Dive](./Ollama_Deep_Dive.md) | 本地大模型部署：一键运行、多模态、工具调用、K8s | 开发者、个人用户 |
| [SGLang Deep Dive](./SGLang_Deep_Dive.md) | 高性能推理框架：RadixAttention 前缀缓存、SRT、多 LoRA、结构化输出 | 追求极致性能 |
| [vLLM Deep Dive](./vLLM_Deep_Dive.md) | PagedAttention 显存优化：UC Berkeley 生产级引擎 | 通用生产 |
| [vLLM for Dummy](./vLLM_for_dummy.md) | vLLM 大白话解释：PagedAttention 与 KV Cache | 初学者快速入门 |
| [LMDeploy Deep Dive](./LMDeploy_Deep_Dive.md) | 国产推理引擎：TurboMind/PyTorch 双后端、AWQ、国产芯片、多模态 | 中文场景 |
| [LiteRT Deep Dive](./LiteRT_Deep_Dive.md) | 边缘 AI 推理：Android/iOS/嵌入式、Delegate 加速、端侧 LLM | 移动端部署 |
| [llama.cpp Deep Dive](./llama_cpp_Deep_Dive.md) | 纯 C/C++ 本地推理：CPU/GPU 多后端、GGUF 量化、llamafile | 边缘/本地 |
| [TensorRT-LLM Deep Dive](./TensorRT_LLM_Deep_Dive.md) | NVIDIA 高性能推理：TensorRT 编译、FP8、Triton 集成 | H100 部署 |
| [TGI Deep Dive](./TGI_Deep_Dive.md) | Hugging Face 生产级推理：Rust+Python、HF 生态原生 | HF 生态团队 |
| [KServe Deep Dive](./KServe_Deep_Dive.md) | CNCF Kubernetes 标准化模型服务：多运行时、自动扩缩、灰度发布 | 平台工程师、SRE |
| [Groq Deep Dive](./Groq_Deep_Dive.md) | LPU 高速推理云：毫秒级延迟、OpenAI 兼容 API | 实时低延迟 |
| [Together AI Deep Dive](./Together_AI_Deep_Dive.md) | 开源模型云平台：200+ 模型、微调、OpenAI 兼容 | 开源模型优先 |
| [Fireworks AI Deep Dive](./Fireworks_AI_Deep_Dive.md) | 快速推理云平台：FireAttention、批量、FireFunction | 高性价比批量 |
| [BentoML Deep Dive](./BentoML_Deep_Dive.md) | AI 模型服务框架：vLLM/TGI 集成、K8s、A/B 测试 | 模型服务 |
| [GPUStack Deep Dive](./GPUStack_Deep_Dive.md) | 开源 GPU 集群管理器：异构 GPU、MaaS、OpenAI 兼容 API | 企业私有部署 |
| [CTranslate2 Deep Dive](./CTranslate2_Deep_Dive.md) | 轻量跨平台 Transformer 推理：CPU/GPU 高效服务 | CPU/GPU 轻量服务 |
| [MLC LLM Deep Dive](./MLC_LLM_Deep_Dive.md) | 移动端/异构 LLM 推理：手机、Web、边缘部署 | 手机/Web/边缘 |
| [KV Cache Deep Dive](./KV_Cache_Deep_Dive.md) | KV Cache 深度研究：从原理、架构压缩到量化与生产实践 | 推理优化工程师、架构师 |
| [Quantization Techniques 2026](./Quantization_Techniques_2026.md) | 量化技术全景：GPTQ、AWQ、SmoothQuant、GGUF、FP8 | 部署工程师 |
| [Quantization Precision Deep Dive](./Quantization_Precision_Deep_Dive.md) | 量化精度深度解析：失效机制、层敏感度、校准数据、PPL 评估 | 量化调优、质量保障 |

## 推理性能专题

> 从指标定义到系统优化：延迟、吞吐、KV Cache、量化、调度、扩缩容等性能工程方法。

| 文档 | 内容 | 适用读者 |
|------|------|----------|
| [推理性能专题首页](./Inference_Performance/README.md) | 专题导航与技术全景 | 性能工程师、架构师 |
| [推理性能基础](./Inference_Performance/Inference_Performance_Fundamentals.md) | TTFT/TPOT/吞吐指标、Roofline 瓶颈分析、优化决策树 | 所有从业者 |
| [决定模型推理速度的要素（大白话版）](./Inference_Performance/Inference_Speed_Factors_for_dummy.md) | 用生活化语言解释影响推理速度的六大因素 | 初学者、产品经理 |
| [推理性能术语大白话解释](./Inference_Performance/Inference_Terms_for_dummy.md) | MoE、MLA/GQA、FLOPS、Prefill、Decode、TTFT、量化、NVLink/IB、PD 分离 | 初学者 |
| [Prefill-Decode 分离](./Inference_Performance/Prefill_Decode_Disaggregation.md) | Disaggregated Serving 架构与 KV Cache 传输 | 长上下文/高并发 |
| [MoE 推理优化](./Inference_Performance/MoE_Inference_Optimization.md) | All-to-All、Expert Parallelism、负载均衡 | MoE 部署 |
| [推理 Profiling 与 Benchmarking](./Inference_Performance/LLM_Inference_Profiling_and_Benchmarking.md) | Nsight、PyTorch Profiler、llmperf、评测陷阱 | 性能测试 |
| [Flash 系列 Kernel 深潜](./Inference_Performance/Flash_Kernels_Deep_Dive.md) | FlashAttention / FlashDecoding / FlashInfer / FlashMLA | Kernel/算子优化 |
| [LLM 请求调度](./Inference_Performance/Request_Scheduling_for_LLMs.md) | Continuous Batching、抢占、Chunked Prefill、SLO-aware | 服务调度 |
| [弹性扩缩容与负载均衡](./Inference_Performance/Inference_Autoscaling_and_Load_Balancing.md) | HPA、预热池、多模型混部、智能路由 | 平台/SRE |
| [Embedding/Reranker 服务](./Inference_Performance/Embedding_Model_Serving.md) | Dynamic Batching、Matryoshka、混合精度 | RAG 部署 |
| [多模态推理优化](./Inference_Performance/Multimodal_Inference_Optimization.md) | Vision Encoder、Image Token 压缩、VLM Prefill | VLM 部署 |
| [长上下文推理 2026](./Inference_Performance/Long_Context_Inference_2026.md) | 128K+ 上下文、KV Cache 压缩、PD 分离 | 长上下文服务 |
| [推理性能未解问题与缺口评估](./Inference_Performance/Remaining_Performance_Issues_2026.md) | 边缘、异构、能耗、多租户、编译启动等缺口 | 架构师、性能工程师 |

## 推理引擎对比 (2026)

| 引擎 | 吞吐量 | 特点 | 选型建议 |
|------|--------|------|----------|
| **SGLang** | 16,215 tok/s | RadixAttention、前缀缓存 | 极致性能、多轮对话 |
| **vLLM** | 15,000+ tok/s | PagedAttention、成熟生态 | 通用生产环境 |
| **LMDeploy** | 13,500+ tok/s | TurboMind、国内优化、国产芯片 | 中文场景 |
| **TensorRT-LLM** | 15,000+ tok/s | NVIDIA 官方、低延迟 | 单请求优化 |
| **TGI** | 12,000+ tok/s | Hugging Face 原生、监控完善 | HF 生态生产环境 |
| **Groq** | 800+ tok/s (70B) | LPU 专用芯片、极低延迟 | 实时应用、API 优先 |
| **Together AI** | 400+ tok/s (70B) | 200+ 开源模型、微调 | 开源模型优先 |
| **Fireworks AI** | 500+ tok/s (70B) | 批量高性价比、FireFunction | 高性价比批量 |
| **llama.cpp** | 6,000+ tok/s | CPU 推理、GGUF | 边缘/本地 |
| **GPUStack** | 依赖后端 | 异构 GPU 集群管理、MaaS | 私有模型服务平台 |
| **CTranslate2** | 高 (CPU/GPU) | 轻量 Transformer、量化推理 | CPU 轻量服务、API |
| **MLC LLM** | 高 (端侧) | 手机/Web/边缘异构推理 | iOS/Android/浏览器 |

## 本地部署方案

| 方案 | 易用性 | API 支持 | 资源占用 | 选型建议 |
|------|--------|----------|----------|----------|
| **Ollama** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 中等 | 快速原型、个人使用 |
| **llama.cpp** | ⭐⭐⭐ | ⭐⭐ | 最低 | 极致轻量、CPU |
| **LM Studio** | ⭐⭐⭐⭐ | ⭐⭐⭐ | 中等 | 桌面应用 |
| **GPUStack** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 中高 | 异构 GPU 集群、团队共享 |

## AI Stack 推理服务

> 如果你正在使用阿里云 AI Stack 一体机，以下页面提供推理部署的生产级命令与运维指南：

| 文档 | 内容 | 适用角色 |
|------|------|----------|
| [AI Stack 生产工具链总览](../12_Architecture_Infrastructure/AI_Stack_Production_Toolchain.md) | AI Stack 工具全景与生命周期 | 所有 AI Stack 用户 |
| [AI Stack 推理服务](../12_Architecture_Infrastructure/AI_Stack_Inference_Serving_Guide.md) | vLLM / SGLang / Ollama / llama-server 启动与运维 | 推理工程师 |
| [AI Stack GPU 监控](../12_Architecture_Infrastructure/AI_Stack_GPU_Monitoring_Guide.md) | nvidia-smi / ppu-smi 等 GPU 监控 | 运维、SRE |
| [AI Stack 模型管理](../12_Architecture_Infrastructure/AI_Stack_Model_Management_Guide.md) | 模型下载与版本组织 | 模型工程师 |

## 推理优化大白话

> SGLang、动态批调度、GGUF、SmoothQuant、TensorRT-LLM 等核心推理优化技术的大白话解释：

| 文档 | 内容 | 适用读者 |
|------|------|----------|
| [推理优化大白话](./Inference_Optimization_for_dummy.md) | SGLang、动态批调度、GGUF、SmoothQuant、TensorRT-LLM | 初学者 |

## 关联目录

- [14_AI_Gateway](../14_AI_Gateway/) -- AI 网关与路由
- [14_RAG_Systems](../14_RAG_Systems/) -- RAG 应用场景
- [15_Agent_Production](../15_Agent_Production/) -- Agent 推理需求

---

*Last updated: 2026-06-15*

## Related
- [[10_Deployment_Inference/LLM_Inference_Engine_Selection_Guide|LLM 推理引擎选型指南]]
- [[10_Deployment_Inference/Inference_Performance/README|推理性能专题]]
- [[10_Deployment_Inference/Inference_Performance/Inference_Performance_Fundamentals|推理性能基础]]
- [[10_Deployment_Inference/vLLM_Deep_Dive|vLLM: 生产级 LLM 推理引擎]]
- [[10_Deployment_Inference/TGI_Deep_Dive|TGI: Hugging Face 生产级推理引擎]]
- [[10_Deployment_Inference/Groq_Deep_Dive|Groq: LPU 高速推理云平台]]
- [[10_Deployment_Inference/Together_AI_Deep_Dive|Together AI: 开源模型推理云平台]]
- [[10_Deployment_Inference/Fireworks_AI_Deep_Dive|Fireworks AI: 快速推理云平台]]
- [[10_Deployment_Inference/BentoML_Deep_Dive|BentoML: AI 模型服务框架]]
- [[10_Deployment_Inference/LMDeploy_Deep_Dive|LMDeploy: InternLM 高性能推理引擎]]
- [[10_Deployment_Inference/llama_cpp_Deep_Dive|llama.cpp: 纯 C/C++ 本地 LLM 推理]]
- [[10_Deployment_Inference/LiteRT_Deep_Dive|LiteRT / TensorFlow Lite: 边缘 AI 推理]]
- [[10_Deployment_Inference/TensorRT_LLM_Deep_Dive|TensorRT-LLM: NVIDIA 生产级 LLM 推理]]
- [[10_Deployment_Inference/README|模型部署与推理]]
- [[10_Deployment_Inference/SGLang_Deep_Dive|SGLang: 高性能 LLM 推理框架]]
- [[10_Deployment_Inference/README_for_dummy|09 部署与推理 — 小白版 🚀]]
- [[10_Deployment_Inference/vLLM_for_dummy|vLLM 大白话解释]]
- [[10_Deployment_Inference/Ollama_Deep_Dive|Ollama: 本地大模型部署平台]]
- [[10_Deployment_Inference/GPUStack_Deep_Dive|GPUStack: 开源 GPU 集群管理与模型服务平台]]
- [[10_Deployment_Inference/LLM_Inference_Benchmarking_Guide|LLM 推理引擎基准测试指南]]
- [[10_Deployment_Inference/LLM_Inference_Engine_Migration_Guide|LLM 推理引擎迁移指南]]
- [[10_Deployment_Inference/Inference_Optimization_for_dummy|推理优化大白话]]
- [[12_Architecture_Infrastructure/AI_Stack_Production_Toolchain|AI Stack 生产工具链总览]]
- [[12_Architecture_Infrastructure/AI_Stack_Inference_Serving_Guide|AI Stack 推理服务指南]]
- [[12_Architecture_Infrastructure/AI_Stack_GPU_Monitoring_Guide|AI Stack GPU 监控指南]]
- [[12_Architecture_Infrastructure/AI_Stack_Model_Management_Guide|AI Stack 模型下载与管理指南]]
- [[_concepts/sglang|SGLang]]
- [[_concepts/dynamic-batch-scheduling|动态批调度]]
- [[_concepts/gguf|GGUF]]
- [[_concepts/smoothquant|SmoothQuant]]
- [[_concepts/tensorrt-llm|TensorRT-LLM]]
- [[10_Deployment_Inference/CTranslate2_Deep_Dive|CTranslate2: 轻量跨平台 Transformer 推理]]
- [[10_Deployment_Inference/MLC_LLM_Deep_Dive|MLC LLM: 移动端/异构 LLM 推理]]

- [[10_Deployment_Inference/Deployment_Inference]] — 模型部署与推理加速 (Deployment & Inference) (共享: deployment, inference, serving, vllm)
- [[10_Deployment_Inference/Deployment_Inference_2026]] — 部署推理 2026 趋势 (共享: deployment, inference, serving, vllm)
- [[10_Deployment_Inference/Deployment_Inference_for_dummy]] — 模型部署与推理加速 - 小白版 (共享: deployment, inference, serving, vllm)
- [[10_Deployment_Inference/Inference-in-nutshell]] — 模型推理速成指南 (共享: deployment, inference, serving, vllm)
- [[10_Deployment_Inference/Speculative_Decoding_Advanced_2026|Speculative_Decoding_Advanced_2026]]
- [[10_Deployment_Inference/Prompt_Caching_and_KV_Cache_Optimization|Prompt_Caching_And_Kv_Cache_Optimization]]
- [[10_Deployment_Inference/KV_Cache_Deep_Dive|KV Cache 深度研究]]

## 本期新增

- [[10_Deployment_Inference/LLM_Inference_Engine_Selection_Guide|LLM 推理引擎选型指南]]
- [[10_Deployment_Inference/vLLM_Deep_Dive|vLLM 深度解析 (2026 全面升级)]]
- [[10_Deployment_Inference/SGLang_Deep_Dive|SGLang 深度解析 (2026 全面升级)]]
- [[10_Deployment_Inference/TensorRT_LLM_Deep_Dive|TensorRT-LLM 深度解析 (2026 全面升级)]]
- [[10_Deployment_Inference/llama_cpp_Deep_Dive|llama.cpp 深度解析 (2026 全面升级)]]
- [[10_Deployment_Inference/TGI_Deep_Dive|TGI 深度解析 (Hugging Face 推理引擎)]]
- [[10_Deployment_Inference/Groq_Deep_Dive|Groq 深度解析 (LPU 高速推理云)]]
- [[10_Deployment_Inference/Together_AI_Deep_Dive|Together AI 深度解析 (开源模型云平台)]]
- [[10_Deployment_Inference/Fireworks_AI_Deep_Dive|Fireworks AI 深度解析 (快速推理云平台)]]
- [[10_Deployment_Inference/Ollama_Deep_Dive|Ollama 深度解析 (2026 全面升级)]]
- [[10_Deployment_Inference/LMDeploy_Deep_Dive|LMDeploy 深度解析 (2026 全面升级)]]
- [[10_Deployment_Inference/LiteRT_Deep_Dive|LiteRT 深度解析 (2026 全面升级)]]
- [[10_Deployment_Inference/BentoML_Deep_Dive|BentoML 深度解析 (2026 全面升级)]]
- [[10_Deployment_Inference/CTranslate2_Deep_Dive|CTranslate2 深度解析 (轻量跨平台 Transformer 推理)]]
- [[10_Deployment_Inference/MLC_LLM_Deep_Dive|MLC LLM 深度解析 (移动端/异构 LLM 推理)]]
- [[10_Deployment_Inference/LLM_Inference_Benchmarking_Guide|LLM 推理引擎基准测试指南]]
- [[10_Deployment_Inference/LLM_Inference_Engine_Migration_Guide|LLM 推理引擎迁移指南]]
- [[10_Deployment_Inference/Speculative_Decoding_Advanced_2026|Speculative Decoding Advanced]]
- [[10_Deployment_Inference/Prompt_Caching_and_KV_Cache_Optimization|Prompt Caching and KV Cache Optimization]]
- [[10_Deployment_Inference/GPUStack_Deep_Dive|GPUStack: 开源 GPU 集群管理与模型服务平台]]
- [[10_Deployment_Inference/KV_Cache_Deep_Dive|KV Cache 深度研究]]

## 相关页面
- [[10_Deployment_Inference/Quantization_Techniques_2026|Quantization Techniques 2026]]

- [[_concepts/model-compression|Model Compression]]

## 新增页面

- [[10_Deployment_Inference/LLM_Inference_Engine_Selection_Guide|LLM 推理引擎选型指南]]
- [[10_Deployment_Inference/vLLM_Deep_Dive|vLLM 深度解析]]
- [[10_Deployment_Inference/SGLang_Deep_Dive|SGLang 深度解析]]
- [[10_Deployment_Inference/TensorRT_LLM_Deep_Dive|TensorRT-LLM 深度解析]]
- [[10_Deployment_Inference/llama_cpp_Deep_Dive|llama.cpp 深度解析]]
- [[10_Deployment_Inference/TGI_Deep_Dive|TGI 深度解析]]
- [[10_Deployment_Inference/Groq_Deep_Dive|Groq 深度解析]]
- [[10_Deployment_Inference/Together_AI_Deep_Dive|Together AI 深度解析]]
- [[10_Deployment_Inference/Fireworks_AI_Deep_Dive|Fireworks AI 深度解析]]
- [[10_Deployment_Inference/Ollama_Deep_Dive|Ollama 深度解析]]
- [[10_Deployment_Inference/LMDeploy_Deep_Dive|LMDeploy 深度解析]]
- [[10_Deployment_Inference/LiteRT_Deep_Dive|LiteRT 深度解析]]
- [[10_Deployment_Inference/BentoML_Deep_Dive|BentoML 深度解析]]
- [[10_Deployment_Inference/CTranslate2_Deep_Dive|CTranslate2 深度解析]]
- [[10_Deployment_Inference/MLC_LLM_Deep_Dive|MLC LLM 深度解析]]
- [[10_Deployment_Inference/LLM_Inference_Benchmarking_Guide|LLM 推理引擎基准测试指南]]
- [[10_Deployment_Inference/LLM_Inference_Engine_Migration_Guide|LLM 推理引擎迁移指南]]
- [[10_Deployment_Inference/LLM_Cost_Optimization|LLM 成本优化]]
- [[10_Deployment_Inference/Prompt_Caching_Advanced|Prompt 缓存高级技术]]
- [[10_Deployment_Inference/GPUStack_Deep_Dive|GPUStack 深度解析]]
- [[10_Deployment_Inference/GPUStack_for_dummy|GPUStack 入门指南]]
- [[_concepts/gpustack|GPUStack 概念卡片]]
- [[_concepts/kv-cache|KV Cache 概念卡片]]
