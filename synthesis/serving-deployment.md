---
title: 模型服务 × 模型部署
category: synthesis
tags: [deployment, serving, inference, vllm, sglang, tensorrt, kubernetes, edge]
sources: [concepts/model-serving.md, concepts/model-deployment.md]
created: 2026-05-31T21:30:00+08:00
updated: 2026-05-31T21:30:00+08:00
summary: "部署解决'如何上线'，服务解决'如何高效运行'：两者共同构成 LLM 推理的工程闭环，2026年的核心矛盾是吞吐量与延迟的权衡。"
provenance:
  extracted: 0.4
  inferred: 0.5
  ambiguous: 0.1
base_confidence: 0.73
lifecycle: draft
lifecycle_changed: 2026-05-31
---

# 模型服务 × 模型部署

## The Connection

[[concepts/model-deployment]] 回答"如何把训练好的模型放到生产环境"，[[concepts/model-serving]] 回答"如何让它跑得又快又稳"。两者是同一枚硬币的两面：没有合理的部署架构（Kubernetes/Serverless/边缘），再强的推理引擎（vLLM/SGLang/TensorRT-LLM）也无法发挥；反之，没有推理层面的优化（KV Cache、PagedAttention、推测解码），部署架构的成本将高到无法承受。

## Where They Co-occur

- vLLM 的 PagedAttention 需要配合 K8s 的 GPU 调度策略才能最大化集群利用率
- TensorRT-LLM 的极致低延迟优化，通常部署在裸金属或专用推理集群中
- 边缘部署（手机、IoT）必须同时使用模型压缩（量化/剪枝）和轻量化服务框架（llama.cpp/Ollama）

## Cross-cutting Insight

> **2026 年 LLM 推理的竞争已经从"谁更快"转向"谁能在给定成本约束下服务更多用户"。**

这意味着优化目标不再是单一的延迟或吞吐量，而是**成本-性能帕累托前沿**。SGLang 的 RadixAttention 通过重用前缀 KV Cache 降低重复计算，BentoML 提供统一的模型打包和部署抽象，而 AI Gateway（如 LiteLLM、Kong）则在服务层做负载均衡、限流和成本归因。三者叠加，才构成完整的生产推理栈。

## Tensions and Trade-offs

- **吞吐优先 vs 延迟优先**：vLLM 适合高并发批处理，TensorRT-LLM 适合低延迟实时对话
- **云原生 vs 边缘**：云端的弹性扩展能力强，但数据隐私和合规要求推动边缘部署
- **多模型路由**：AI Gateway 需要在不同模型（大/小、快/慢、贵/便宜）之间智能路由，这本身就是一个小型推荐系统

## Open Questions

- FP4/FP6 精度在 2026 年能否成为生产默认，而不仅是实验选项？
- 推测解码（speculative decoding）的 draft 模型选择策略是否能自动化？
- Serverless GPU（如 AWS Inferentia、Google Cloud TPU v5e）是否会改变部署架构的根本假设？

## Related

- [[09_Deployment_Inference/Deployment_Inference]] — 模型部署与推理加速 (Deployment & Inference) (共享: deployment, inference, serving, vllm)
- [[09_Deployment_Inference/Deployment_Inference_2026]] — 部署推理 2026 趋势 (共享: deployment, inference, serving, vllm)
- [[09_Deployment_Inference/Deployment_Inference_for_dummy]] — 模型部署与推理加速 - 小白版 (共享: deployment, inference, serving, vllm)
- [[09_Deployment_Inference/Inference-in-nutshell]] — 模型推理速成指南 (共享: deployment, inference, serving, vllm)
