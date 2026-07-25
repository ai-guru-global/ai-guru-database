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
- target: '概念/model-compression'
  type: enables
- target: '概念/model-serving'
  type: uses
- target: '概念/model-evaluation'
  type: follows
sources:
- 10_部署推理/01_Deployment_Fundamentals/Deployment_Inference.md
- 10_部署推理/01_Deployment_Fundamentals/Deployment_Inference_2026.md
summary: 模型部署将训练好的AI模型转化为高效稳定的生产服务，涵盖推理性能优化（KV Cache/PagedAttention/推测解码）、部署架构（K8s编排/Serverless/边缘部署）和成本优化策略。2026年推理引擎三强鼎立：vLLM（高吞吐）、TensorRT-LLM（低延迟）、SGLang（结构化生成）。
provenance:
  extracted: 0.85
  inferred: 0.1
  ambiguous: 0.05
base_confidence: 0.78
lifecycle: reviewed
lifecycle_changed: 2026-07-21
tier: core
created: 2026-05-31 00:00:00+00:00
updated: 2026-07-21
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

- [[治理/serving-deployment]] — 模型服务 × 模型部署 (共享: deployment, edge)
- [[概念/multi-head-latent-attention]] — Multi-head Latent Attention (MLA): KV Cache 压缩 7-28× 的注意力架构创新

---

## 2026 模型部署生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **vLLM** | 高性能推理引擎 | GA |
| **TensorRT-LLM** | NVIDIA 推理优化 | GA |
| **KServe** | K8s 模型服务 | GA |
| **Seldon Core** | 模型部署平台 | GA |
| **边缘部署** | 边缘设备部署 | GA |

## 生产最佳实践

1. **推理引擎**：LLM 推理用 vLLM/TensorRT-LLM
2. **K8s 部署**：K8s 环境用 KServe/Seldon
3. **自动扩缩**：配置自动扩缩容
4. **金丝雀发布**：新模型金丝雀发布
5. **监控告警**：部署后监控告警

## 部署架构对比

| 方案 | 适用场景 | 优势 | 局限 |
|------|----------|------|------|
| **vLLM** | 高吐量 LLM 推理 | PagedAttention、连续批处理 | 仅 LLM |
| **TensorRT-LLM** | NVIDIA GPU 极致优化 | 硬件级优化 | 仅 NVIDIA |
| **KServe** | K8s 多模型服务 | 自动扩缩、金丝雀 | 复杂度高 |
| **TGI** | HuggingFace 模型 | 生态集成 | 性能略低 |
| **Ollama** | 本地/边缘部署 | 简单易用 | 性能有限 |

## 部署配置示例

```yaml
# KServe InferenceService
apiVersion: serving.kserve.io/v1beta1
kind: InferenceService
metadata:
  name: llm-service
spec:
  predictor:
    containers:
      - name: vllm
        image: vllm/vllm-openai:latest
        args:
          - --model=Qwen/Qwen2.5-72B-Instruct
          - --tensor-parallel-size=4
          - --max-model-len=32768
        resources:
          limits:
            nvidia.com/gpu: 4
            memory: 128Gi
    minReplicas: 1
    maxReplicas: 5
    scaleTarget: 10  # 每实例 10 并发
```

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| OOM | 模型太大/显存不足 | 量化/张量并行/多卡 |
| 延迟高 | 批处理太大/无优化 | Continuous Batching |
| 冷启动慢 | 模型加载耗时 | 预热/模型缓存 |
| 扩缩不及时 | HPA 指标不当 | 基于队列深度扩缩 |
| 版本回滚失败 | 无回滚机制 | 保留上一版本副本 |

## 版本兼容性

| 工具 | 版本 | 说明 |
|------|------|------|
| vLLM | 0.6+ | 推理引擎 |
| KServe | 0.13+ | K8s 服务 |
| TensorRT-LLM | 0.12+ | NVIDIA 优化 |
| CUDA | 12.x | GPU 环境 |

## 生产检查清单

1. 部署前进行压力测试确认吐量和延迟
2. 配置自动扩缩容（基于并发/队列）
3. 金丝雀发布新模型版本
4. 监控 GPU 利用率、延迟、错误率
5. 建立快速回滚机制
6. 配置健康检查和就绪探针

## 总结

模型部署是将 AI 模型从实验室推向生产的关键环节。2026 年 vLLM + KServe 已成为 LLM 部署的事实标准组合，提供高性能推理和弹性伸缩能力。

> 💡 模型部署的核心原则：部署不是终点而是起点——持续监控、自动扩缩、快速回滚是生产级部署的三大支柱。

## 部署方式对比

| 方式 | 延迟 | 成本 | 扩展性 | 适用场景 |
|------|------|------|--------|----------|
| 云端 API | 中 | 按量 | 无限 | 低频/原型 |
| 专属实例 | 低 | 固定 | 中 | 生产稳定负载 |
| Serverless | 中 | 按量 | 自动 | 流量波动 |
| 边缘部署 | 极低 | 固定 | 受限 | 低延迟场景 |
| 混合部署 | 低 | 中 | 高 | 企业级 |

## 生产检查清单

1. ✅ 就绪探针配置充分 initialDelaySeconds
2. ✅ 滚动更新 maxUnavailable: 0
3. ✅ 自动扩缩容策略配置
4. ✅ 模型版本回滚机制
5. ✅ 全链路监控（延迟/吞吐/错误率）
6. ✅ 金丝雀发布 + 自动回滚
7. ✅ 安全护栏（输入/输出检测）

