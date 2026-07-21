---
title: "KServe"
category: -concepts
tags: ["kserve", "kubernetes", "model-serving", "inference", "cncf", "kfserving", "serverless", "autoscaling"]
relationships:
  - target: "概念/model-serving"
    type: extends
  - target: "概念/kubernetes"
    type: runs_on
  - target: "概念/vllm"
    type: related_to
  - target: "概念/hami"
    type: related_to
  - target: "概念/istio"
    type: related_to
sources:
  - 部署推理/Inference_Engines/KServe_Deep_Dive.md
summary: "KServe 是 CNCF Incubating 的 Kubernetes 模型服务平台，提供标准化的 InferenceService CRD、多运行时支持、自动扩缩容、蓝绿/金丝雀发布与可解释性，广泛用于生产级 LLM 推理服务。"
provenance:
  extracted: 0.8
  inferred: 0.15
  ambiguous: 0.05
base_confidence: 0.9
lifecycle: reviewed
tier: core
created: 2026-06-16
updated: 2026-07-21
aliases:
  - Kserve

---
# KServe

> Kubernetes 上的「模型服务机场」——让模型推理服务的部署、扩缩、灰度、观测像航班一样标准化。

---

## 1. 一句话定义

**KServe** 是 CNCF Incubating 项目，原名 KFServing，是 Kubernetes 上开源的**标准化模型服务平台**。它通过 `InferenceService` 自定义资源（CRD）把模型部署、流量管理、自动扩缩、可观测等能力封装成声明式 API，支持 vLLM、Triton、TorchServe、TFServing、SKLearn 等多种推理运行时。

---

## 2. 核心能力

| 能力 | 说明 |
|------|------|
| **标准化 CRD** | `InferenceService` 统一描述模型服务生命周期 |
| **多运行时支持** | vLLM、Triton、TorchServe、TFServing、SKLearn、XGBoost、PMML 等 |
| **Serverless 推理** | 基于 Knative  scale-to-zero，无请求时 Pod 缩到 0 |
| **自动扩缩容** | 支持 HPA、KPA（Knative Pod Autoscaler）、GPU 利用率指标 |
| **流量管理** | 蓝绿部署、金丝雀发布、A/B 测试 |
| **可解释性** | 内置 Alibi、AIX360、LIME 等解释器 |
| **可观测** | 集成 Prometheus、Grafana，暴露标准推理指标 |
| **多协议** | 支持 REST/gRPC、Open Inference Protocol (V2) |

---

## 3. 架构组件

```
用户请求
    │
    ▼
Ingress Gateway (Istio/Gateway API)
    │
    ▼
InferenceService Controller
    ├── Predictor：实际推理服务（必填）
    ├── Transformer：请求/响应转换（可选）
    └── Explainer：模型可解释性（可选）
    │
    ▼
Knative / Deployment
    └── 推理运行时 Pod（vLLM / Triton / ...）
```

| 组件 | 职责 |
|------|------|
| **KServe Controller** | 监听 `InferenceService` CR，协调 Knative/Deployment/Service/Istio 资源 |
| **InferenceService** | 面向用户的 CRD，声明模型服务规格 |
| **Predictor** | 推理核心，承载模型运行时 |
| **Transformer** | 前置/后置处理，如 tokenize、detokenize、prompt 工程 |
| **Explainer** | 返回预测解释 |
| **Agent / Batcher** | 请求聚合与批处理优化 |

---

## 4. 资源语义（InferenceService 示例）

```yaml
apiVersion: serving.kserve.io/v1beta1
kind: InferenceService
metadata:
  name: llama-7b
spec:
  predictor:
    model:
      modelFormat:
        name: huggingface
      runtime: kserve-huggingfaceserver
      storageUri: gs://my-bucket/llama-2-7b
      resources:
        limits:
          nvidia.com/gpu: 1
          memory: "16Gi"
```

---

## 5. 典型场景

1. **企业 LLM 推理平台**：统一入口部署 vLLM/TGI 服务，按流量自动扩缩。
2. **多模型灰度发布**：金丝雀方式上线新模型版本，逐步切流量。
3. **Serverless 推理**：按需启动，空闲时 scale-to-zero 降低成本。
4. **多框架模型托管**：同一平台服务 SKLearn、PyTorch、TensorFlow 模型。

---

## 6. 与相关技术的关系

| 技术 | 关系 |
|------|------|
| **Kubernetes** | 运行基座 |
| **Knative** | 提供 Serverless 能力（可选） |
| **Istio / Gateway API** | 提供流量入口与路由 |
| **vLLM / TGI / Triton** | 作为 Predictor 运行时 |
| **HAMi** | 可为 KServe 的 Predictor 提供 vGPU 资源 |
| **BentoML** | 都是模型服务框架，BentoML 更偏应用构建，KServe 更偏 K8s 标准化 |
| **Seldon Core** | 功能类似的竞品 |

---

## 7. 优势与局限

### 优势
- CNCF Incubating，社区与企业认可度高。
- 标准化 CRD 降低多团队协作成本。
- 与云原生生态（Knative、Istio、Prometheus）深度集成。
- 一份配置同时支持传统 ML 与 LLM。

### 局限
- 组件较多，学习曲线和运维成本高于单容器方案。
- Serverless 模式启动延迟明显，不适合低延迟在线推理。
- GPU scale-to-zero 再冷启动耗时较长。

---

## Related

- [[部署推理/Inference_Engines/KServe_Deep_Dive]] — KServe 深度解析
- [[概念/model-serving]] — 模型服务概念
- [[概念/vllm]] — vLLM 推理引擎
- [[概念/hami]] — HAMi GPU 虚拟化
- [[部署推理/Inference_Engines/BentoML_Deep_Dive]] — BentoML 模型服务框架
- [[架构基建/CNCF_Cloud_Native_AI/README]] — CNCF 云原生大模型全景

---

## 2026 KServe 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **KServe v0.14** | 支持 Gateway API 替代 Istio，简化网络层依赖 | GA |
| **vLLM Runtime 原生支持** | InferenceService 直接声明 vLLM 运行时，无需自定义镜像 | GA |
| **LLM 专用 Autoscaler** | 基于 GPU 利用率/KV Cache 使用率的智能扩缩 | Beta |
| **ModelMesh** | 多模型共享服务实例，降低小模型托管成本 | GA |
| **Open Inference Protocol v2** | 标准化推理 API，支持流式响应与批处理 | GA |

## 生产最佳实践

1. **LLM 推理用 RawDeployment 模式**：避免 Knative 冷启动延迟，保证低延迟在线服务
2. **金丝雀发布必用**：新模型版本上线使用 canaryTrafficPercent 逐步切流量
3. **资源配额明确**：为 Predictor 设置 GPU/内存 limits，避免单模型耗尽节点资源
4. **监控推理指标**：集成 Prometheus 监控 P99 延迟、吞吐量、GPU 利用率
5. **多模型用 ModelMesh**：小模型/传统 ML 模型使用 ModelMesh 共享实例，降低成本
