---
title: 模型部署
category: -concepts
tags:
- deployment
- - - ai-hardware
- - - model-serving|serving
- - - ai-architecture
- serverless
- edge
- - - mlops
relationships:
- target: '_concepts/model-compression'
  type: enables
- target: '_concepts/model-serving'
  type: uses
- target: '_concepts/model-evaluation'
  type: follows
sources:
- 部署推理/Deployment_Inference.md
- 部署推理/Deployment_Inference_2026.md
summary: 模型部署将训练好的AI模型转化为高效稳定的生产服务，涵盖推理性能优化（KV Cache/PagedAttention/推测解码）、部署架构（K8s编排/Serverless/边缘部署）和成本优化策略。2026年推理引擎三强鼎立：vLLM（高吞吐）、TensorRT-LLM（低延迟）、SGLang（结构化生成）。
provenance:
  extracted: 0.85
  inferred: 0.1
  ambiguous: 0.05
base_confidence: 0.78
lifecycle: draft
lifecycle_changed: 2026-05-31
tier: core
created: 2026-05-31 00:00:00+00:00
updated: 2026-05-31 00:00:00+00:00
aliases:
  - "Model Deployment"
  - "model deployment"

---
# 模型部署

## 核心要点

- **推理与训练的本质区别**：推理仅前向传播、batch小（1-8）、追求低延迟高吞吐、可用低精度（INT8/INT4）
- **KV Cache**是自回归推理的核心优化，缓存历史long-context-models的Key/Value避免重复计算，PagedAttention将其显存浪费从40-60%降至<4%
- **推测解码**用小模型快速生成候选token、大模型并行验证，可实现2-3倍延迟降低
- **部署架构选择**：K8s编排适合规模化生产、Serverless适合弹性负载、边缘部署适合隐私敏感和离线场景

## 详细内容

### 推理性能基础

推理阶段的核心指标：**TTFT**（Time To First Token，影响用户感知响应速度）、**TPOT**（Time Per Output Token，决定流式输出流畅度）、**吞吐量**（tokens/s或QPS）。

**KV Cache**机制：自回归生成中每步需要完整序列的attention，KV Cache缓存已计算的Key和Value矩阵。以Llama-2-7B为例，处理2048长度序列的KV Cache约1GB。**PagedAttention**（vLLM核心技术）借鉴操作系统虚拟内存分页，将KV Cache分成固定大小的block按需分配，消除显存碎片。

**Continuous Batching**在迭代级别动态调度请求，新请求插入正在运行的batch，已完成请求立即释放资源，相比静态batching吞吐提升2-4倍。

### 高级推理优化

**推测解码（Speculative Decoding）**：用小模型（draft model）快速生成k个候选token，大模型（target model）一次前向传播并行验证所有候选。接受概率通常>85%，实现2-3倍延迟降低且输出分布不变。

**MoE部署**：混合专家模型的挑战是All-to-All通信瓶颈。优化策略包括专家复制（热门专家多副本）、专家并行（不同GPU放置不同专家）、动态路由缓存。DeepSpeed-MoE和vLLM均支持MoE推理。

### 部署架构模式

| 模式 | 适用场景 | 优势 | 挑战 |
|------|---------|------|------|
| **K8s编排** | 大规模生产 | 弹性伸缩、滚动更新 | 配置复杂 |
| **Serverless** | 弹性负载 | 按需付费、零运维 | 冷启动延迟 |
| **边缘部署** | 隐私/离线 | 低延迟、数据不出设备 | 硬件限制 |
| **混合部署** | 多层次需求 | 灵活组合 | 架构复杂 |

**K8s部署**使用HPA（水平Pod自动伸缩）基于GPU利用率和请求队列深度自动扩缩容。vLLM/TensorRT-LLM以Deployment或StatefulSet运行，通过Service暴露API。关键配置：GPU亲和性调度、PV/PVC模型存储、健康检查探针。

**Serverless推理**按请求计费，适合低频或突发流量。冷启动通过模型预加载和keep-alive缓解。AWS Lambda + Container image-segmentation、GCP Cloud Run、Azure Container Apps均已支持GPU。

**边缘部署**将压缩后的模型部署到手机、IoT设备、自动驾驶平台。核心技术：INT4/INT8量化、模型剪枝、框架转换（PyTorch→CoreML/TFLite/ONNX）。LiteRT（Google）和Core ML（Apple）是移动端主流框架。

### AI Gateway

生产环境的智能网关层提供：请求路由（按模型/租户/优先级分发）、响应缓存（语义缓存相似请求）、限流熔断、A/B测试集成、成本监控。开源方案有LiteLLM和Portkey。

## 开放问题

- 超长上下文推理（1M+ tokens）的KV Cache显存管理仍是挑战
- 多模态模型推理的资源调度和延迟优化方案仍在演进
- Serverless推理的冷启动延迟与成本平衡需要更多工程实践

## 来源

- Kwon et al., "Efficient Memory Management for Large Language Model model-serving with PagedAttention," SOSP 2023
- Leviathan et al., "Fast Inference from Transformers via Speculative Decoding," ICML 2023

## Related

- [[_synthesis/serving-deployment]] — 模型服务 × 模型部署 (共享: deployment, edge)
- [[_concepts/multi-head-latent-attention]] — Multi-head Latent Attention (MLA): KV Cache 压缩 7-28× 的注意力架构创新
