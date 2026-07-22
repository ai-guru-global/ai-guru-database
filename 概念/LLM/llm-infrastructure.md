---
title: LLM 基础设施
category: -concepts
tags: ["infrastructure", "gpu", "ai-hardware", "model-training", "edge-ai", "cost-optimization"]
relationships:
  - target: "[[概念/ai-architecture]]"
    type: related_to
  - target: "概念/mlops"
    type: related_to
  - target: "概念/ai-hardware"
    type: related_to
sources:
  - 12_transformer-architecture_Infrastructure/AI_Infrastructure_2026.md
  - 架构基建/Edge_AI_2026.md
  - 架构基建/AI_Cost_optimization-regularization_2026.md
  - 架构基建/Capacity_ai-agents_2026.md
summary: LLM基础设施涵盖硬件层（GPU/TPU/边缘芯片）、优化层（FP8量化/FlashAttention）、推理层（vLLM/SGLang）和编排层（AI Gateway），2026年的核心趋势是FP8成为默认精度、SGLang崛起和AI Gateway标配化。
provenance:
  extracted: 0.78
  inferred: 0.15
  ambiguous: 0.07
base_confidence: 0.75
lifecycle: reviewed
lifecycle_changed: 2026-07-21
tier: supporting
created: 2026-05-31T00:00:00Z
updated: 2026-07-21T00:00:00Z
aliases:
  - "Llm Infrastructure"
  - "llm infrastructure"

---
# LLM 基础设施

## 核心要点

LLM基础设施采用五层架构：Layer 1硬件层（H100/H200/B200 GPU）→ Layer 2优化层（FP8量化/FlashAttention-3/PagedAttention）→ Layer 3推理层（SGLang/vLLM/TensorRT-LLM）→ Layer 4编排层（AI Gateway/LLM Routing/Workflow Engine）→ Layer 5应用层（Agents/RAG/对话系统）。

2026年关键趋势：FP8成为默认精度（30%+速度提升，显存减半）、SGLang凭借RadixAttention超越vLLM成为性能领导者、AI Gateway成为标配（成本节省40-70%）、Agent基础设施五层架构标准化。

## 详细内容

### 硬件格局

NVIDIA GPU选型：B200（Blackwell架构，192GB HBM3e，8TB/s带宽，~$40K）用于超大规模训练推理；H200（141GB HBM3e，4.8TB/s，~$30K）是高吞吐量首选；H100（80GB HBM3，3.35TB/s，~$25K）是主流生产选择；L40S（48GB，~$8K）提供最佳性价比。

AMD MI300X和Intel Gaudi3是NVIDIA的替代选择，价格更低但生态成熟度不足。中国厂商华为昇腾910B/910C、海光DCU Z100、寒武纪思元590正在快速追赶。

边缘/端侧芯片：Apple M4 Neural Engine（38 TOPS）、Qualcomm Snapdragon 8 Elite（45 TOPS）、NVIDIA Jetson Thor（2000 TOPS，车载场景）。

### 推理引擎格局

SGLang是2026年的性能领导者：在H100上Llama 3.1 8B推理吞吐量达16,215 tok/s，比vLLM快29%。核心创新是RadixAttention——通过前缀复用避免重复计算，特别适合多轮对话（共享对话历史前缀）、RAG系统（共享文档上下文）和Agent工作流（共享系统提示）。

vLLM仍是行业标准，生态最成熟，PagedAttention+Continuous Batching+Speculative Decoding功能完整。TensorRT-LLM在NVIDIA GPU上单请求延迟最低，适合对延迟极致敏感的场景。llama.cpp是边缘/本地推理的首选。

阿里云 AI Stack 采用 **A-Speed 加速套件**作为推理框架（非 vLLM/SGLang），提供深度优化的加速镜像，支持 APG/Ascend/Nvidia 三种 GPU 厂商。官方用户指南（V2.14.0）中未出现 ASLLM/vLLM/SGLang 等名称。推理性能较开源社区版本提升 50%。详见 [[架构基建/AI_Stack_Deep_Dive]]。

### FP8精度

FP8成为2026默认精度的原因：显存占用减半（7B模型从14GB降至7GB）、推理速度提升30%+、计算性能从840 TFLOPS提升至1.3 PFLOPS（H100）、质量保留>99%。要求Hopper架构GPU（H100/H200）或Blackwell（B200），CUDA 12.1+。

### AI Gateway

AI Gateway是LLM调用的统一入口，五层架构：入口层（认证+限流+负载均衡）→ 路由层（复杂度分类+成本优化+地理位置路由）→ 缓存层（精确匹配+语义缓存+向量缓存）→ 治理层（内容安全+PII检测+注入防护）→ 出口层（多供应商Fallback+重试+计量）。^[inferred]

智能路由节省40-70%成本：60%简单问题路由到GPT-4o-mini、30%中等问题用Claude 3.5、10%复杂问题用GPT-4o。级联路由先尝试便宜模型，质量不满足再升级。

语义缓存命中率30-50%，通过向量相似度>0.95匹配历史查询，节省40-50%成本。三层缓存组合使用可节省40-70%总成本。

### 训练基础设施

10K GPU训练集群架构：计算层（1000节点×8 GPU，NVLink+NVSwitch互联）→ 网络层（Fat-Tree/Dragonfly+拓扑，400GbE/NDR InfiniBand）→ 存储层（全闪存热缓存1PB+ / 并行文件系统Lustre 10PB+ / 对象存储S3 100PB+）。

训练优化技术：FP8训练（2x吞吐量）、3D distributed-systems（数据+模型+流水线并行线性扩展）、FlashAttention-3（H100专用1.5-2x加速）、ZeRO-Infinity（优化器状态卸载到NVMe支持更大模型）。

### 边缘AI

2026年边缘AI爆发的驱动力：隐私保护（数据不离开设备）、延迟需求（自动驾驶<50ms、实时翻译<100ms）、成本优化（减少云端API调用）、技术成熟（INT4量化+专用NPU芯片）。

模型优化技术栈：量化（FP32→INT8→INT4，INT4量化后7B模型仅3.5GB）、知识蒸馏（大模型Teacher训练小模型Student，保留90%+性能）、编译优化（Core ML for Apple、TFLite for Android、ONNX Runtime跨平台）。

云端-边缘协同推理架构：实时性高的任务在Edge处理（<100ms），复杂推理任务在Cloud处理。Apple Intelligence是代表性方案：端侧4B/7B模型处理日常任务，私有云计算（Apple Silicon服务器）处理复杂任务。^[ambiguous]

### 成本优化与FinOps

Token经济学：GPT-4o输入$2.5/1M tokens、输出$10/1M tokens；GPT-4o-mini输入$0.15/1M tokens、输出$0.6/1M tokens。简单问答用mini模型可节省94%成本。

优化手段：智能路由（节省60-80%）、语义缓存（节省40-50%）、模型量化INT8（2x吞吐提升）、Continuous Batching（5-10x吞吐提升）、KV Cache前缀复用（节省50-80% prefill tokens）。

### 容量规划

AI服务容量规划的特殊性：资源维度新增GPU显存和Token配额、响应时间从毫秒级变为秒级到分钟级、成本结构包含GPU基础设施+API Token双重成本。规划周期从实时调度（秒/分钟级自动扩缩容）到长期规划（季度/年度架构演进和预算制定）。

## 开放问题

- 2027-2030年光学计算和存算一体芯片可能颠覆现有GPU架构 ^[ambiguous]
- Prefill-Decode分离架构（独立扩缩容）的工程实践尚在探索
- CXL 3.0内存扩展能否真正突破GPU显存瓶颈
- 边缘设备上70B参数模型的推理效率仍有提升空间

## 来源

- 架构基建/Architecture_Overview/AI_Infrastructure_2026 — 五层架构、硬件选型、推理引擎对比
- 架构基建/Edge_AI_2026.md — 边缘AI硬件、模型优化、云端协同
- 架构基建/AI_Cost_Optimization_2026.md — Token经济学、路由优化、FinOps
- 架构基建/Capacity_Planning_2026.md — 负载建模、GPU容量规划

## Related

- [[概念/image-segmentation.md|image-segmentation]]
- [[概念/reasoning-models.md|reasoning-models]]
- [[概念/model-evaluation.md|model-evaluation]]
- [[概念/model-compression.md|model-compression]]
- [[概念/multi-head-latent-attention]] — Multi-head Latent Attention (MLA) 与 FlashMLA 算子
- [[治理/llm-infrastructure-system-design|LLM 基础设施 × 传统系统架构]] — 从 Web 服务到 Token 工厂

---

## 2026 LLM 基础设施生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **B200/GB200** | NVIDIA Blackwell 架构，192GB HBM3e，8TB/s 带宽 | GA |
| **SGLang v0.4** | RadixAttention + 前缀复用，吐吐量超越 vLLM 29% | GA |
| **FP8 默认精度** | H100/H200/B200 原生支持，显存减半 + 速度提升 30% | GA |
| **AI Gateway 标配化** | 智能路由 + 语义缓存，节省 40-70% 成本 | GA |
| **Prefill-Decode 分离** | 独立扩缩容，优化资源利用率 | Beta |

## 生产最佳实践

1. **FP8 优先**：H100+ GPU 默认启用 FP8 精度，质量保留 >99% 且性能大幅提升
2. **智能路由必配**：部署 AI Gateway，按复杂度路由到不同模型，节省 60%+ 成本
3. **语义缓存**：启用向量相似度缓存，命中率 30-50%，显著降低重复调用成本
4. **监控全覆盖**：GPU 利用率/显存/温度 + TTFT/TPOT/吐量全链路监控
5. **容量规划**：根据 Token 消耗预测 GPU 需求，避免资源不足或过度配置
6. **多可用区**：推理服务跨 AZ 部署，避免单点故障
7. **自动扩缩容**：基于队列深度/GPU 利用率自动扩缩容

## 基础设施分层架构

```
┌─────────────────────────────────────────────┐
│  应用层：Chatbot / Agent / RAG / Copilot    │
├─────────────────────────────────────────────┤
│  编排层：AI Gateway / 路由 / 缓存 / 限流    │
├─────────────────────────────────────────────┤
│  推理层：vLLM / SGLang / TGI / TRT-LLM      │
├─────────────────────────────────────────────┤
│  模型层：GPT-5 / Llama 4 / Qwen3 / DeepSeek │
├─────────────────────────────────────────────┤
│  硬件层：H100 / B200 / MI300X / TPU v6     │
├─────────────────────────────────────────────┤
│  网络层：InfiniBand / NVLink / RoCE         │
└─────────────────────────────────────────────┘
```

## GPU 选型指南

| GPU | 显存 | 适用 | 性价比 |
|-----|:----:|------|:------:|
| **H100 80GB** | 80GB | 通用推理/训练 | 中 |
| **H200 141GB** | 141GB | 长上下文推理 | 中-高 |
| **B200 192GB** | 192GB | 下一代旗舰 | 高 |
| **MI300X 192GB** | 192GB | 成本敏感推理 | 高 |
| **L40S 48GB** | 48GB | 小模型推理 | 极高 |
| **A10G 24GB** | 24GB | 端侧/开发 | 极高 |

## 延伸阅读

- [[概念/LLM/vllm|vLLM]]
- [[概念/LLM/tensorrt-llm|TensorRT-LLM]]
- [[概念/LLM/llm-inference-engine|LLM 推理引擎]]
- [[架构基建/AI_Stack_Deep_Dive|AI Stack 深度解析]]
- [[架构基建/GPU_Cluster_Management|GPU 集群管理]]
- [[运维/GPU_Monitoring|GPU 监控体系]]

## 成本优化策略

| 策略 | 节省比例 | 复杂度 | 说明 |
|------|:--------:|:------:|------|
| 智能路由 | 40-70% | 中 | 简单任务用小模型 |
| 语义缓存 | 30-50% | 低 | 相似问题复用答案 |
| 批量推理 | 20-40% | 低 | 合并请求提高 GPU 利用率 |
| 量化 (FP8/INT4) | 30-50% | 低 | 减少显存+提速 |
| Spot 实例 | 50-70% | 中 | 非关键任务用抢占式 |
| Prefill-Decode 分离 | 20-30% | 高 | 独立扩缩容 |

## 关键性能指标

| 指标 | 含义 | 目标值 |
|------|------|:------:|
| **TTFT** | 首 Token 延迟 | <500ms |
| **TPOT** | 每 Token 生成时间 | <50ms |
| **吐量** | 每秒生成 Token 数 | >100 tok/s |
| **GPU 利用率** | 计算单元使用率 | >70% |
| **显存利用率** | VRAM 使用率 | 60-90% |
| **P99 延迟** | 99分位响应时间 | <2s |

## 延伸阅读

- [[概念/LLM/llm-inference-engine|推理引擎]] — 引擎选型
- [[概念/LLM/llm-production-deployment|生产部署]] — 部署实践
- [[概念/LLM/llmops|LLMOps]] — 运维体系
- [[架构基建/AI_Stack_Deep_Dive|AI Stack]] — 基础设施全景
