---
title: "llm-d: Kubernetes 原生分布式大模型推理框架"
category: "12-architecture-infrastructure"
tags: ["cncf", "kubernetes", "inference", "llm-d", "distributed", "kv-cache"]
summary: "> **一句话理解**: llm-d 把「大模型推理」拆成 Gateway + KV Cache 协调 + vLLM Worker 三层——可以让多个推理 Pod 共享 KV Cache、独立扩缩 prefill/decode，是目前 K8s 上规模最大的开源 LLM 推理框架之一。"
created: "2026-06-16"
updated: "2026-06-16"
---

# llm-d: Kubernetes 原生分布式大模型推理框架

> **一句话理解**: llm-d 把「大模型推理」拆成 Gateway + KV Cache 协调 + vLLM Worker 三层——可以让多个推理 Pod 共享 KV Cache、独立扩缩 prefill/decode，是目前 K8s 上规模最大的开源 LLM 推理框架之一。

> 📐 **概念方法论**: llm-d 是「**disaggregated inference（解耦推理）**」在 Kubernetes 上的工程实现——把传统 vLLM 单进程内的 prefill / decode / KV-cache 三件事拆成可独立扩缩的分布式组件，再用 Kubernetes Gateway API 的 InferencePool 把「带缓存的请求路由到带缓存的 Pod」。要理解它，必须先理解 KV Cache 的物理意义（详见 [[09_Deployment_Inference/KV_Cache_Deep_Dive]]），以及 K8s 上推理服务的演进路径（详见 [[CNCF_Cloud_Native_AI/KServe_Deep_Dive]]）。

---

## 目录

1. [概述](#1-概述)
2. [核心概念](#2-核心概念)
3. [架构设计](#3-架构设计)
4. [安装部署](#4-安装部署)
5. [快速开始](#5-快速开始)
6. [生产配置](#6-生产配置)
7. [运维与可观测](#7-运维与可观测)
8. [对比与选择](#8-对比与选择)
9. [常见问题 FAQ](#9-常见问题-faq)
10. [Related](#related)

---

## 1. 概述

### 1.1 定位

llm-d 是 2025 年由 NVIDIA 联合社区发起、进入 CNCF Landscape `Inference` 分类的 **Kubernetes 原生高性能分布式大模型推理框架**。它不是「又一个 vLLM 封装」，而是把推理拆解成可独立扩缩的分布式组件，以 Kubernetes Gateway API 的 InferencePool 作为流量入口的「**解耦推理**」参考实现。

```
   传统单进程 vLLM                llm-d 解耦架构
 ┌──────────────────┐         ┌──────────────────────────────────┐
 │ HTTP─Prefill─Decode│        │ Gateway (LGCI) + EndpointPicker  │
 │    └─ KV Cache ─┘ │         │ KV Cache 协调层 (LMCache/Redis)  │
 │ (全在一个 Pod)    │         │ Worker Pool: Prefill Pool /      │
 │ 扩容=整 Pod 复制  │         │   Decode Pool（各自独立扩缩）    │
 └──────────────────┘         │ 缓存跨 Pod / 模型共享             │
 缓存不能跨 Pod 共享            └──────────────────────────────────┘
```

**核心价值**：当 RAG 系统里 1000 个请求都带相同 system prompt + 检索前缀，传统架构让每个 Pod 重算 prefill；llm-d 让首请求算完后 KV Cache 进入共享层，后续 999 个请求直接命中——**省下的是最贵的 GPU 计算**。

### 1.2 核心特性

| 特性 | 说明 | 生产价值 |
|------|------|----------|
| **Disaggregated KV Cache** | KV Cache 经 LMCache / Redis 跨 Pod 共享、可卸载到 CPU/磁盘 | RAG / 多租户首 token 延迟降低 50-90% |
| **InferencePool + EndpointPicker** | 基于 Kubernetes Gateway API 扩展，按 KV 缓存亲和度选 Pod | 把请求路由到「已持有该前缀缓存」的 Pod |
| **Prefill / Decode 独立扩缩** | 两类负载资源画像差异巨大，分开调度 | prefill 是 compute-bound，decode 是 memory-bound |
| **vLLM 作为 Worker 引擎** | 复用 PagedAttention、连续批处理 | 兼容 vLLM 模型、量化、调度策略 |
| **多模型 / 多租户** | 一个集群多 LLMService 共存，共享 GPU 节点池 | 平台型团队服务多业务线 |
| **Kubernetes 原生 CRD** | `LLMService` / `Gateway` / `InferencePool` / `LLMDB` | GitOps、Helm、Argo CD 友好 |
| **RDMA / GPU 直连加速** | KV 跨 Pod 传输走 InfiniBand / RoCE | 大规模集群 KV 拷贝不占 host 网络 |

### 1.3 项目历程

| 时间 | 里程碑 |
|------|--------|
| 2025-03 | GTC 首次公开，定位开源 disaggregated inference 框架 |
| 2025-Q2 | 进入 CNCF Landscape `Inference`；首份 Helm chart + CRD |
| 2025 下半年 | v0.1 → v0.2：LMCache 集成、InferencePool GA、多模型支持 |
| 2026 | 社区扩展到 Red Hat / 独立 ISV，与 KServe / Gateway API 互通 |

> 注：llm-d 仍处于早期（v0.x），API 与 CRD 字段会随版本调整。生产部署前请核对目标版本 Release Notes。

---

## 2. 核心概念

### 2.1 解耦推理（Disaggregated Inference）

一个 LLM 推理请求的生命周期可以拆成两个物理特性完全不同的阶段：

```
   用户请求
      │
      ├─► ① Prefill：处理 prompt（compute-bound）— 算力打满、带宽利用率低，
      │     产出 KV Cache，成本与 prompt 长度平方级相关
      │
      └─► ② Decode：逐 token 生成（memory-bound）— 算力大量闲置、带宽是瓶颈，
            需持续持有 KV Cache，成本与生成长度 + batch 线性相关
```

传统 vLLM 把两阶段塞进同一进程同一 GPU——**prefill 时 decode 被阻塞、decode 时 GPU 算力浪费**。解耦推理的洞察：把 prefill / decode 分别放到不同 Pool，KV Cache 作为独立资源在两者间迁移、共享、卸载，每个 Pool 按自己的资源画像独立扩缩。

### 2.2 KV Cache 共享

| 层级 | 机制 | 命中场景 |
|------|------|----------|
| **Pod 内** | vLLM 原生 PagedAttention + Prefix Caching | 同 Pod 多请求共享相同前缀 |
| **跨 Pod** | LMCache（内存/本地盘）+ Redis / RDMA 传输 | 多 Pod 复用同一前缀（system prompt、知识库文档） |
| **跨模型** | 兼容同架构模型共享 base 前缀 | 多 LoRA / 多量化版本共用基座 KV |

### 2.3 InferencePool 与 EndpointPicker

llm-d 最有「云原生味」的部分——它不自造路由协议，而是**直接基于 Kubernetes Gateway API 的 InferencePool 扩展**：

- **InferencePool**：描述一组推理 Pod（worker pool），是 Gateway API 中「Service 的特化」。
- **EndpointPicker**：Gateway 调度核心。传统 Service 是「随机/轮询」，EndpointPicker 是「**把请求发给最可能已持有 KV 缓存的 Pod**」——把缓存命中率变成调度决策的输入。

> 这意味着 llm-d 的流量入口与 Envoy AI Gateway、Kgateway 等 Gateway API 实现可**互通**——它定义的是协议，不是单点组件。

### 2.4 Gateway（LGCI）

LGCI（llm-d Gateway）是 llm-d 的 Gateway 参考实现，对上暴露 OpenAI 兼容 HTTP API，对下用 InferencePool 协议调度到 worker pool，等价于「懂 KV 缓存的 Inference Gateway」。

---

## 3. 架构设计

### 3.1 全景架构图

```
                  ┌──────────────────────┐
                  │   客户端 (SDK/curl)   │
                  └──────────┬───────────┘
                             │ HTTP /v1/chat/completions (OpenAI 兼容)
                             ▼
  ┌──────────────────────────────────────────────────────────┐
  │                  llm-d Gateway (LGCI)                     │
  │ EndpointPicker: 前缀 hash → 查共享缓存目录 →             │
  │   选「已持有 KV」的 Pod；无则选负载最低的 Pod             │
  └──────────────────────────────┬───────────────────────────┘
                                 │ Gateway API InferencePool
  ┌──────────────────────────────┴───────────────────────────┐
  │                     Worker Pool                           │
  │ ┌──────── Prefill Pods ────────┐                          │
  │ │ vLLM (prefill 优化)          │ compute-bound, 独立 HPA  │
  │ └─────────────┬────────────────┘                          │
  │               │ KV Cache 迁移                              │
  │ ┌─────────────┴────────────────┐                          │
  │ │ vLLM (decode 优化)           │ memory-bound, 独立 HPA   │
  │ └─────────────┬────────────────┘                          │
  └───────────────┼───────────────────────────────────────────┘
                  │
  ┌───────────────┴───────────────────────────────────────────┐
  │   KV Cache 共享层: LMCache(内存) | Redis(分布式) |         │
  │                    CPU / NVMe (offload 层)                │
  │   ▲ 可选 RDMA / InfiniBand / RoCE 直连                    │
  └───────────────┬───────────────────────────────────────────┘
                  │
  ┌───────────────┴───────────────────────────────────────────┐
  │ Kubernetes 控制面: LLMService / Gateway / InferencePool /  │
  │                    LLMDB (reconciler 协调 Pod/HPA/配置)    │
  └───────────────────────────────────────────────────────────┘
```

### 3.2 请求路由：缓存亲和调度

```
1. 客户端 POST /v1/chat/completions
2. Gateway 提取前缀（system + retrieved_docs），算 prefix_hash
3. EndpointPicker 查共享缓存目录:
   ├─ HIT (cache in Pod #5)  → 路由到 Pod #5，跳过 prefill
   └─ MISS                   → 路由到 prefill Pod，完成后写回共享层
4. Prefill 完成 → KV Cache 经 LMCache/Redis 发布 → 后续相同前缀请求直接命中
5. Decode Pod 持续生成 → 流式返回
```

**关键收益**：RAG 场景下相同检索文档被多次复用时，**只有第一个请求真正跑 prefill**，其余请求只跑 decode 的增量部分——这是 llm-d 相对原版 vLLM 的核心 TCO 优势。

---

## 4. 安装部署

### 4.1 前置条件

| 组件 | 版本 | 说明 |
|------|------|------|
| Kubernetes | ≥ 1.29 | 需要 Gateway API CRD 支持；建议开启 Dynamic Resource Allocation |
| Gateway API CRDs | ≥ 1.2（experimental） | 含 InferencePool 扩展，必须安装 experimental channel |
| NVIDIA GPU Operator | ≥ v24.x | 节点 GPU 驱动、CUDA、MIG、GPUDirect RDMA |
| Container Runtime | containerd ≥ 1.7 / cri-o | GPU Operator 依赖 nvidia-container-toolkit |
| Helm | ≥ 3.14 | 主部署路径，chart 在 `llm-d/llm-d` 仓库 |
| GPU 节点 | H100 / A100 / B200 / L40S | vLLM 支持的 NVIDIA 卡；prefill 偏算力，decode 偏显存 |
| LMCache | chart 内置 | 跨 Pod KV 共享核心库，Worker Pod 自动加载 |
| Redis（可选） | ≥ 7.2 | 分布式 KV 目录/缓存索引层；LMCache 纯内存模式可不依赖 |
| 模型存储 | HF Hub / OCI Registry / S3 | `modelArtifactURI` 支持 `hf://`、`oci://`、`s3://` |
| 网络（可选） | RDMA / RoCE v2 / IB | KV 跨 Pod 大批量传输加速，Mellanox CX-6/CX-7 |
| 可观测（可选） | Prometheus + Grafana | Gateway/Worker 暴露 `/metrics`，建议 kube-prometheus-stack |

### 4.2 安装 Gateway API CRDs

```bash
# InferencePool 在 experimental channel
kubectl apply -f https://github.com/kubernetes-sigs/gateway-api/releases/download/v1.2.0/experimental-install.yaml
kubectl get crd | grep -E "gateway|inferencepool"
```

### 4.3 Helm 安装 llm-d

```bash
helm repo add llm-d https://llm-d.github.io/llm-d && helm repo update
kubectl create namespace llm-d-system
helm install llm-d llm-d/llm-d \
  --namespace llm-d-system \
  --version 0.2.x \
  --wait
```

### 4.4 GPU 与网络要求

```
节点角色            GPU 配置                       网络建议
──────────────────────────────────────────────────────────────
Gateway 节点        无需 GPU（CPU-only）            普通 CNI
Prefill 节点        高算力 GPU（H100/B200）         推荐 RDMA
Decode 节点         大显存 GPU（A100 80G/H100）     推荐 RDMA
共享缓存节点        Redis on 内存型节点             低延迟网络
```

**RDMA 关键点**：KV 跨 Pod 传输在 100G+ token 量级时 TCP 会成瓶颈。生产推荐 Mellanox CX-6/CX-7 + RoCE v2 或 IB，NVIDIA GPUDirect RDMA 让 GPU 显存 ↔ NIC 直拷不经过 host 内存；Spectrum-X 在 NVIDIA 参考架构中是首选。

### 4.5 部署形态选择

llm-d 支持两种典型部署形态，按集群规模与是否需要 PD 解耦选择：

```
 形态 A：单节点聚合（all-in-one）         形态 B：多节点解耦（disaggregated）
 ┌──────────────────────────────────┐    ┌──────────────────────────────────────────┐
 │ 1 个 Helm release                │    │ Gateway / Prefill / Decode 各自独立 Pool │
 │ Prefill + Decode 同 Pool         │    │ 独立 HPA、独立 nodeSelector              │
 │ 共享缓存用 LMCache 本地内存       │    │ 共享缓存走 Redis 或 LMCache+RDMA         │
 │ 适用：PoC、单卡/单节点、< 50 QPS  │    │ 适用：生产、多节点、> 100 QPS、RAG        │
 │ 优点：部署最简、无网络开销        │    │ 优点：可独立扩缩、TCO 最优                │
 │ 缺点：无 PD 解耦红利、不能横向扩展│    │ 缺点：概念多、依赖 RDMA 才能跑满          │
 └──────────────────────────────────┘    └──────────────────────────────────────────┘
```

形态 A 只需配置 `inferencePool.workers`（不区分 prefill/decode）；形态 B 需分别设置 `prefillWorkers` 与 `decodeWorkers`，并让 EndpointPicker 开启 PD 路由（见 §5.5）。

### 4.6 GPU 与 RDMA 拓扑准备

大规模解耦部署前，必须把节点拓扑（NUMA、GPU-NIC 亲和）对齐，否则 KV 跨 Pod 传输会绕远路：

```bash
# 1. 确认 GPU 与 NIC 的 NUMA 亲和（每节点）
nvidia-smi topo -m                                 # GPU 间 NVLink 拓扑
cat /sys/class/net/<rdma_iface>/device/numa_node   # NIC 所属 NUMA

# 2. GPU Operator 开启 RDMA（hostdev/RDMA device plugin）
#    gpu-operator values:
#      devicePlugin.config.name: rdma-shared
#      driver.rdma.enabled: true

# 3. 节点打标，供 InferencePool nodeSelector 使用
kubectl label node gpu-node-01 llm-d.ai/topology-group=rdma-group-a
kubectl label node gpu-node-01 llm-d.ai/numa-node=0

# 4. 验证 Worker Pod 能看到 RDMA 设备
kubectl exec <worker-pod> -- rdma devlink | grep mlx5
kubectl exec <worker-pod> -- ls /dev/infiniband/
```

> **拓扑对齐原则**：让 Prefill Pod 与 Decode Pod 调度到同一 RDMA 拓扑组（同 ToR、同 NUMA），KV 拷贝才走最近路径。`kvCache.shared.lmcache.transfer.rdma.device` 必须指向与该 Pod GPU 同 NUMA 的 NIC，否则 GPUDirect RDMA 退化为跨 NUMA 内存拷贝。

---

## 5. 快速开始

本节是一个完整端到端走通的流程：安装 chart → 定义模型 → 部署 Gateway + Worker → 端口转发 → curl 验证 → 观察 prefix cache 命中指标。随后给出第二个示例——开启 prefill/decode 解耦，对比吞吐差异。

```
 步骤                       命令 / 资源                              预期结果
────────────────────────────────────────────────────────────────────────────────
 ① 安装 chart               helm install llm-d ...                   Gateway CRD 就绪
 ② 定义模型                 values.yaml → modelArtifactURI           LLMService 创建
 ③ 部署 Gateway + Workers   helm install ... -f values.yaml          Pods Running
 ④ 端口转发                 kubectl port-forward                     本地可访问
 ⑤ curl 验证                curl /v1/chat/completions                首 token 返回
 ⑥ 观察命中                 curl /metrics | grep kv_cache            hit_rate 上升
 ⑦（可选）开启 PD 解耦      拆 prefill/decode Pool                   吞吐提升
```

### 5.1 最小化 `values.yaml`

部署 `LLMService`（Qwen2.5-7B-Instruct）+ Gateway：

```yaml
routing:
  gateway: { enabled: true, className: llm-d-gateway }

inferencePool:
  name: qwen-pool
  selectorMatchLabels: { llm-d.ai/model: qwen2.5-7b }
  workers:
    replicas: 2
    modelArtifactURI: hf://Qwen/Qwen2.5-7B-Instruct
    containerPort: 8000
    resources:
      limits:   { nvidia.com/gpu: "1", memory: 24Gi }
      requests: { nvidia.com/gpu: "1", memory: 16Gi }

kvCache:
  shared: { enabled: true, backend: redis,
            redis: { endpoint: redis.llm-d-system.svc:6379 } }

llmService: { name: qwen-service, modelName: qwen2.5-7b-instruct }
```

### 5.2 部署并暴露端点

```bash
helm install qwen-inference llm-d/llm-d-inference \
  --namespace llm-d-system -f values.yaml --wait

kubectl wait --for=condition=Ready pod -l llm-d.ai/model=qwen2.5-7b \
  -n llm-d-system --timeout=600s

kubectl get gateway,httproute,inferencepool -n llm-d-system
```

### 5.3 curl 验证

```bash
export GW_HOST=$(kubectl get gateway qwen-gateway -n llm-d-system \
  -o jsonpath='{.status.addresses[0].value}')

curl -s http://${GW_HOST}/v1/chat/completions -H "Content-Type: application/json" \
  -d '{"model":"qwen2.5-7b-instruct","messages":[{"role":"system","content":"你是一名 Kubernetes 专家。"},{"role":"user","content":"用一句话解释 InferencePool。"}],"max_tokens":128}' \
  | jq '.choices[0].message.content'
```

**首次请求**：触发 prefill，TTFT 较高。**再次发相同 system prompt**：EndpointPicker 路由到缓存持有的 Pod，TTFT 显著下降——这就是 disaggregated KV cache 的可观测效果。

### 5.4 观察 prefix cache 命中指标

把同一个带固定 system prompt 的请求连发 5 次，前几次 MISS、后续应命中：

```bash
SYS='{"role":"system","content":"你是一名 Kubernetes 专家，请严格按 RFC 风格回答。"}'
for i in 1 2 3 4 5; do
  curl -s -w "TTFT_proxy=%{time_starttransfer}s\n" -o /dev/null \
    http://${GW_HOST}/v1/chat/completions -H "Content-Type: application/json" \
    -d "{\"model\":\"qwen2.5-7b-instruct\",\"messages\":[${SYS},{\"role\":\"user\",\"content\":\"InferencePool 是什么？\"}],\"max_tokens\":64}"
done

# 查 EndpointPicker 决策与命中率
kubectl exec -n llm-d-system deploy/llm-d-gateway -- \
  curl -s localhost:8080/metrics | grep -E "kv_cache_hit|endpointpicker_decisions"
```

预期：`llmd_kv_cache_hit_rate` 从 0 上升到接近 1.0；`endpointpicker_decisions{decision="HIT"}` 计数随重放递增，`{decision="MISS"}` 保持初始值。

### 5.5 示例二：开启 prefill/decode 解耦

将上面聚合 Pool 改为分离 Pool，对比长 prompt 场景下的吞吐：

```yaml
inferencePool:
  name: qwen-pd-pool
  prefillWorkers:
    replicas: 2
    modelArtifactURI: hf://Qwen/Qwen2.5-7B-Instruct
    vllmArgs: ["--enable-prefix-caching", "--max-num-batched-tokens=16384"]
    resources: { limits: { nvidia.com/gpu: "1" } }
  decodeWorkers:
    replicas: 4
    vllmArgs: ["--max-model-len=8192"]
    resources: { limits: { nvidia.com/gpu: "1" } }
routing:
  disaggregated: { enabled: true }
```

```bash
helm upgrade qwen-inference llm-d/llm-d-inference -f values-pd.yaml -n llm-d-system

# 用长 prompt（4K tokens 检索文档）压测，对比聚合 vs 解耦
# 聚合 Pool：prefill 阻塞 decode，p99 TTFT 高
# 解耦 Pool：prefill 与 decode 并行，吞吐提升明显
```

```
 压测结果示意（长 prompt + 短输出，Qwen2.5-7B，单 H100）
 ┌──────────────────────┬─────────────┬─────────────┬─────────────┐
 │ 形态                  │ 聚合 Pool    │ PD 解耦      │ 提升         │
 ├──────────────────────┼─────────────┼─────────────┼─────────────┤
 │ p99 TTFT             │ ~2.4s        │ ~0.9s        │ -62%         │
 │ 吞吐 (tok/s/GPU)     │ ~1.8k        │ ~3.1k        │ +72%         │
 │ KV 跨 Pod 命中率     │ 0%（不共享） │ ~85%         │ —            │
 └──────────────────────┴─────────────┴─────────────┴─────────────┘
```

> 注：上述数字为示意，实际收益取决于 prompt 结构、prefix 重复度、网络与 GPU 型号。PD 解耦在长 prompt + 短输出场景收益最大；纯短对话场景收益有限。

---

## 6. 生产配置

### 6.1 生产级 `values.yaml`（节选）

```yaml
routing:
  gateway: { enabled: true, className: llm-d-gateway, replicas: 3,
             autoscaling: { minReplicas: 3, maxReplicas: 12, targetCPUUtilization: 60 } }

inferencePool:
  name: prod-pool
  selectorMatchLabels: { llm-d.ai/model: qwen2.5-72b }
  prefillWorkers:
    replicas: 4
    modelArtifactURI: hf://Qwen/Qwen2.5-72B-Instruct
    vllmArgs: ["--max-model-len=32768", "--tensor-parallel-size=4", "--enable-prefix-caching"]
    resources: { limits: { nvidia.com/gpu: "4", memory: 96Gi } }
    nodeSelector: { node.kubernetes.io/instance-type: h100-80g }
    autoscaling: { minReplicas: 4, maxReplicas: 16, gpuTargetUtilization: 75 }
  decodeWorkers:
    replicas: 8
    vllmArgs: ["--max-model-len=32768", "--tensor-parallel-size=2"]
    resources: { limits: { nvidia.com/gpu: "2", memory: 96Gi } }
    nodeSelector: { node.kubernetes.io/instance-type: a100-80g }
    autoscaling: { minReplicas: 8, maxReplicas: 32 }

kvCache:
  shared:
    enabled: true
    backend: lmcache
    lmcache:
      maxSizeGB: 200
      offloading:
        cpu:  { enabled: true, maxSizeGB: 400 }
        nvme: { enabled: true, path: /mnt/kv-cache, maxSizeGB: 2000 }
      transfer: { transport: rdma, rdma: { device: mlx5_0 } }
  prefixCache: { policy: lru, ttlSeconds: 3600, minTokenLength: 64 }

llmService:
  name: qwen72b-prod
  modelName: qwen2.5-72b-instruct
  sessionAffinity: { enabled: true, ttlSeconds: 600 }

multiModel:
  enabled: true
  models:
    - { name: qwen2.5-72b-instruct, weight: 1.0 }
    - { name: qwen2.5-7b-instruct,  weight: 0.3 }
```

### 6.2 关键调优点

| 维度 | 建议值 | 原因 |
|------|--------|------|
| Prefill : Decode 比例 | 1:2 ~ 1:4 | decode 通常更 memory-bound，需更多副本支撑并发 |
| KV 共享层容量 | 工作集前缀 token 总量 × 1.5 | 容量过小导致频繁驱逐，命中率崩塌 |
| `--enable-prefix-caching` | 必开 | vLLM 内部 prefix cache 是跨 Pod 共享的基础 |
| `tensor-parallel-size` | 节点内 GPU 数 | 跨节点 TP 性能差，应改用 PD 分离 |
| `sessionAffinity.ttlSeconds` | 5~15 分钟 | 多轮对话保持在同一 Pod，提升缓存连续命中 |
| HPA 目标 GPU 利用率 | 70-80% | 预留 burst 容量，避免冷启动叠加 |

### 6.3 多模型部署

llm-d 的多模型不是「一个 Pod 多模型」，而是「**一个集群多个 LLMService，共享 KV Cache 层**」。共享前缀（system prompt、工具描述）跨模型复用，显著降低冷启动成本。

### 6.4 参数参考总表

| 参数 / 字段 | 作用域 | 推荐取值 | 说明 |
|------|------|------|------|
| `routing.gateway.replicas` | Gateway | 2~3 | 入口高可用，至少跨节点 |
| `routing.gateway.autoscaling.targetCPUUtilization` | Gateway | 60% | 入口 CPU 敏感，预留 burst |
| `routing.disaggregated.enabled` | 全局 | true（生产） | 开启 prefill/decode 分离路由 |
| `inferencePool.prefillWorkers.replicas` | Prefill | 按 QPS × prompt_len 估算 | compute-bound，扩缩看 GPU 计算 |
| `inferencePool.decodeWorkers.replicas` | Decode | prefill 的 2~4 倍 | memory-bound，并发靠副本数 |
| `vllmArgs: --tensor-parallel-size` | Worker | 节点内 GPU 数 | 跨节点 TP 性能差，用 PD 分离替代 |
| `vllmArgs: --max-model-len` | Worker | 实际业务最大长度 | 过大吃显存，按需设 |
| `vllmArgs: --gpu-memory-utilization` | Worker | 0.85~0.9 | 留余量给 KV 卸载与突发 |
| `vllmArgs: --enable-prefix-caching` | Worker | 必开 | 跨 Pod 共享的前提 |
| `kvCache.shared.backend` | 全局 | lmcache / redis | lmcache 适合大内存节点，redis 适合已有集群 |
| `kvCache.shared.lmcache.maxSizeGB` | 全局 | 工作集 × 1.5 | 过小频繁驱逐，命中率崩塌 |
| `kvCache.shared.offloading.cpu.enabled` | 全局 | true | 显存→CPU 二级，降低 GPU OOM |
| `kvCache.shared.offloading.nvme.enabled` | 全局 | true（大模型） | 三级冷存储，TB 级 KV |
| `kvCache.prefixCache.ttlSeconds` | 全局 | 1800~3600 | 短则反复重算，长则占容量 |
| `kvCache.prefixCache.minTokenLength` | 全局 | 32~64 | 太高漏掉短前缀，太低目录膨胀 |
| `kvCache.transfer.transport` | 全局 | rdma（有 IB/RoCE 时） | 否则 TCP，大规模成瓶颈 |
| `llmService.sessionAffinity.ttlSeconds` | Service | 300~900 | 多轮对话保持同 Pod，连续命中 |
| `autoscaling.gpuTargetUtilization` | Worker Pool | 70~80% | 预留 burst，避免冷启动叠加 |

### 6.5 多模型多租户生产 `values.yaml`

平台型团队服务多条业务线（租户 A 用 72B，租户 B 用 7B），共享 GPU 节点池与 KV 缓存层：

```yaml
routing:
  gateway:
    enabled: true
    className: llm-d-gateway
    replicas: 3
    autoscaling: { minReplicas: 3, maxReplicas: 12, targetCPUUtilization: 60 }

kvCache:
  shared:
    enabled: true
    backend: redis
    redis:
      endpoint: redis-cache.shared.svc:6379
      maxMemoryGB: 512
    prefixCache: { policy: lru, ttlSeconds: 3600, minTokenLength: 64 }
  transfer: { transport: rdma, rdma: { device: mlx5_0 } }

multiTenant:
  enabled: true
  tenants:
    - name: tenant-a
      namespace: tenant-a
      priorityClass: llm-d-high
      models:
        - llmService: { name: qwen72b-a, modelName: qwen2.5-72b-instruct }
          inferencePool:
            prefillWorkers: { replicas: 4, resources: { limits: { nvidia.com/gpu: 4 } },
                              nodeSelector: { pool: h100 } }
            decodeWorkers:    { replicas: 8, resources: { limits: { nvidia.com/gpu: 2 } },
                              nodeSelector: { pool: h100 } }
    - name: tenant-b
      namespace: tenant-b
      priorityClass: llm-d-low
      models:
        - llmService: { name: qwen7b-b, modelName: qwen2.5-7b-instruct }
          inferencePool:
            workers: { replicas: 3, resources: { limits: { nvidia.com/gpu: 1 } },
                       nodeSelector: { pool: l40s-shared } }

resourceQuotas:
  tenant-a: { nvidia.com/gpu: 32, memory: 1Ti }
  tenant-b: { nvidia.com/gpu: 8,  memory: 256Gi }
```

关键点：租户间靠 `namespace` + `priorityClass` 隔离调度；KV 缓存层物理共享但逻辑隔离（prefix_hash 含租户 ID）；共享 Pool（`workers`，不分 PD）给小租户省运维。

### 6.6 最佳实践

- **缓存容量经验法则**：共享层容量 ≥（并发不同前缀数 × 平均前缀长度 × 单 token KV 字节数）× 1.5。7B 模型 FP16 单 token KV ≈ 1MB，70B ≈ 5MB；先量后买。
- **何时不要解耦**：纯短对话（prompt < 512 token、无重复前缀）、单卡小模型、QPS < 50——PD 解耦的网络与协调开销 > 收益，用聚合 Pool 即可。
- **多租户隔离三件套**：namespace（CRD 隔离）+ priorityClass（抢占隔离）+ GPU nodeSelector（物理隔离敏感租户）；KV 缓存逻辑隔离靠 prefix_hash 注入 tenant-id。
- **版本固定**：v0.x 阶段 CRD 会变，生产固定 chart version + image tag，禁止 `latest`；升级走灰度 namespace。
- **可观测先于扩容**：命中率/MISS 率告警先上，再谈扩容——否则扩容只是把「缓存没命中」放大成「更多 GPU 浪费」。

---

## 7. 运维与可观测

### 7.1 关键指标

llm-d 暴露 Prometheus metrics（Gateway `:8080/metrics`，Worker `:8000/metrics`）：

| 指标 | 含义 | 关注阈值 |
|------|------|----------|
| `llmd_kv_cache_hit_rate` | 跨 Pod 缓存命中率 | 生产应 > 60%，< 30% 需排查 |
| `llmd_prefill_tokens_total` | prefill token 吞吐 | 容量规划 |
| `llmd_decode_tokens_total` | decode token 吞吐 | 用户感知性能 |
| `llmd_request_ttft_seconds` | 首 token 延迟分位 | p95 < 用户 SLA |
| `llmd_endpointpicker_decisions` | 路由决策（HIT / MISS） | MISS 过高需扩缓存 |
| `vllm:num_requests_waiting` | 等待队列深度 | 持续 > 0 需扩容 |
| `vllm:gpu_cache_usage_perc` | 单 Pod GPU 缓存占用 | > 90% 触发 KV 卸载 |

### 7.2 Grafana 关键 PromQL

```promql
# 1. 跨 Pod KV 缓存命中率（核心健康指标）
sum(rate(llmd_kv_cache_hits_total[5m]))
  / sum(rate(llmd_kv_cache_requests_total[5m]))

# 2. EndpointPicker MISS 占比（>70% 需扩缓存或规范化前缀）
sum(rate(llmd_endpointpicker_decisions{decision="MISS"}[5m]))
  / sum(rate(llmd_endpointpicker_decisions[5m]))

# 3. TTFT 分位（p95，对比 SLA）
histogram_quantile(0.95,
  sum by (le) (rate(llmd_request_ttft_seconds_bucket[5m])))

# 4. Prefill vs Decode 吞吐（容量规划，判断两 Pool 比例是否失衡）
sum(rate(llmd_prefill_tokens_total[5m])) by (pool)
sum(rate(llmd_decode_tokens_total[5m]))  by (pool)

# 5. 单 Pod GPU 缓存占用（>90% 触发 KV 卸载到 CPU/NVMe）
avg(vllm:gpu_cache_usage_perc) by (pod)
```

| 面板 | PromQL | 告警阈值 |
|------|--------|----------|
| 缓存命中率 | 查询 1 | < 40% 持续 10min |
| MISS 占比 | 查询 2 | > 70% 持续 5min |
| TTFT p95 | 查询 3 | > 用户 SLA |
| 队列堆积 | `avg(vllm:num_requests_waiting) by (pod)` | > 0 持续 5min |

### 7.3 常见故障排查

**故障 1：KV Cache 命中率持续走低**（`llmd_kv_cache_hit_rate < 30%`）——共享层容量不足则增大 `maxSizeGB`；TTL 太短则调高 `ttlSeconds`；`minTokenLength` 太高则降到 32；前缀变化太频繁则业务侧规范 prompt 结构（固定 system）。

**故障 2：Gateway 路由错误 / 5xx**

```bash
kubectl logs -n llm-d-system -l app=llm-d-gateway --tail=200 | grep endpointpicker
kubectl describe inferencepool prod-pool -n llm-d-system
```

**故障 3：Worker GPU OOM** ——常见根因：`--max-model-len` 太大（降到实际需要值）；`--gpu-memory-utilization` 过高（降到 0.85~0.9）；KV 卸载未启用（开启 `lmcache.offloading.cpu`）。

```bash
kubectl logs <worker-pod> -n llm-d-system | grep -E "OOM|out of memory|KV cache"
```

**故障速查表**：

| 症状 | 可能原因 | 排查 / 修复 |
|------|----------|-------------|
| KV 命中率突降（`hit_rate < 30%`） | 共享层容量不足 / TTL 过短 / 前缀结构变化 | 调大 `maxSizeGB`；延长 `ttlSeconds`；查业务侧是否改了 system prompt |
| EndpointPicker 路由不均（部分 Pod 热点） | prefix hash 倾斜 / 部分 Pod 缓存未预热 | 检查前缀是否过度集中；加 `sessionAffinity`；扩容热点 Pool |
| Decode Pod 积压（队列深 > 0 持续） | decode 副本不足 / prefill→decode 传输慢 | 扩 `decodeWorkers`；检查 RDMA 链路；降低单 batch 大小 |
| Worker GPU OOM | `max-model-len` 过大 / KV 卸载未开 | 降 `--max-model-len`；开 `offloading.cpu/nvme`；降 `gpu-memory-utilization` |
| RDMA 传输报错（`ibv_*` / link down） | NIC NUMA 错位 / GPUDirect 未启用 | `nvidia-smi topo -m` 核对；重配 `rdma.device`；查 GPUDirect 模块 |
| Gateway 5xx / 路由错误 | InferencePool 未就绪 / CRD 版本不匹配 | `kubectl describe inferencepool`；核对 Gateway API CRD 版本 |
| 前缀 hash 碰撞（命中错内容） | `minTokenLength` 过短 / 跨模型共池 | 提高 `minTokenLength`；隔离不同模型的缓存命名空间 |
| HPA 不触发扩容 | GPU metrics 未被 API Server 采集 | 装 `nvidia-dcgm-exporter` + HPA external metric 适配器 |

### 7.4 扩缩容指南

| 指标 | 动作 |
|------|------|
| decode p99 延迟 > SLA | 扩 `decodeWorkers` |
| prefill 队列深度 > 0 持续 | 扩 `prefillWorkers` |
| KV 命中率 < 40% | 扩大共享缓存容量（非扩 Pod） |
| EndpointPicker MISS > 70% | 增加前缀标准化 + 扩缓存 |
| GPU 利用率 < 40% 持续 | 缩容（HPA 自动处理） |

---

## 8. 对比与选择

### 8.1 同类项目对比

| 维度 | llm-d | KServe | KAITO | llmaz | 原版 vLLM |
|------|-------|--------|-------|-------|-----------|
| 定位 | 解耦推理平台 | 推理 CRD + Serverless | 推理算力调度 | 多模型推理 CRD | 单进程引擎 |
| KV Cache 跨 Pod 共享 | 原生（核心特性） | 否 | 否 | 否 | 否 |
| Prefill/Decode 解耦 | 是 | 否 | 否 | 否 | 否 |
| InferencePool 集成 | 原生 | 经 Gateway 集成 | 否 | 否 | 不适用 |
| Serverless 缩到 0 | 不擅长 | 强项 | 否 | 否 | 不适用 |
| 多租户 / 多模型 | 强 | 中 | 中 | 强 | 弱 |
| 学习曲线 | 陡（概念多） | 平 | 平 | 平 | 平 |
| 成熟度（2026） | 早期 v0.x | Graduated | Incubating | Sandbox | GA |

### 8.2 何时选择 llm-d

**适合 llm-d**：大规模 RAG 服务（多请求共享知识库前缀，KV 命中率红利最大）；平台型团队为多条业务线提供多模型推理；prefill 与 decode 流量比悬殊（长 prompt / 短输出）；已有 GPU 集群 + RDMA 网络，希望榨干 TCO。

**适合其他项目**：简单单模型 + 偶发流量 → **KServe**（缩到 0 最省）；模型分发 / 预置镜像优先 → **KAITO**；工作节点跑模型（边缘、工作站）→ **llmaz**；单机或小规模稳定流量 → **原版 vLLM**（运维成本最低）。

### 8.3 决策树

```
流量规模？
├─ 小 (< 100 QPS, 单模型)        → 原版 vLLM / KServe
├─ 中 (100~1k QPS, 多模型)
│   ├─ 重 Serverless / 缩到 0     → KServe
│   └─ 稳定流量、批量管理          → llmaz
└─ 大 (> 1k QPS, RAG / 多租户)
    ├─ 有 RDMA、追求 TCO           → llm-d ★
    └─ 无 RDMA、预算紧              → llm-d（无 RDMA 模式）或 KServe
```

---

## 9. 常见问题 FAQ

**Q1：llm-d 是 NVIDIA 的私有项目吗？**
不是。由 NVIDIA 发起并贡献核心代码，但以开源协议发布、托管在 `github.com/llm-d/llm-d`，社区（含 Red Hat 等）共同维护，已进入 CNCF Landscape。NVIDIA 是主要贡献者之一，非单方控制。

**Q2：是否必须用 NVIDIA GPU？**
当前主要支持 NVIDIA GPU（依赖 vLLM + CUDA 生态）。AMD ROCm、Intel Gaudi、CPU 后端依赖 vLLM 上游对应后端的成熟度——这是 vLLM 生态的通用限制，非 llm-d 独有。

**Q3：必须 RDMA 网络才能用吗？**
非必须。RDMA 只在 KV 跨 Pod 大批量传输时带来显著加速。小规模部署可用普通 TCP + Redis；超过约 50 个 worker、KV 工作集 > 100GB 时，RDMA 的 ROI 才明显。

**Q4：能否与 KServe 共存？**
可以。llm-d 实现了 Gateway API 的 InferencePool，与 KServe 的 InferenceService、Envoy AI Gateway 等同处一集群无冲突。常见架构是「KServe 管理小流量 Serverless 模型，llm-d 管理大流量 RAG 模型」。

**Q5：现有 vLLM 模型配置能否直接复用？**
可以。llm-d worker 本质就是 vLLM 进程，`--max-model-len`、`--quantization`、`--tensor-parallel-size`、LoRA 配置等 vLLM CLI 参数都通过 `vllmArgs` 透传。

**Q6：生产就绪了吗？**
2026-06 时点 llm-d 仍处于 v0.x，CRD 字段会调整、部分高级特性（如跨模型 KV 共享）在演进中。建议：固定 chart 版本、做好版本升级回归测试、关键指标告警完备。**对 KV 共享命中率有强依赖的核心业务，建议等待 v1.0 GA 后再全量切入。**

---

## Related

- [[CNCF_Cloud_Native_AI/README]] — CNCF 云原生 LLM 全景导览，llm-d 在「推理层」的定位
- [[CNCF_Cloud_Native_AI/KServe_Deep_Dive]] — 推理 CRD 另一主流方案，与 llm-d 互补
- [[09_Deployment_Inference/KV_Cache_Deep_Dive]] — 理解 llm-d 杀手特性的前提：KV Cache 物理本质
- [[09_Deployment_Inference/vLLM_Deep_Dive]] — llm-d worker 引擎的底层
- [[12_Architecture_Infrastructure/AI_Infrastructure_2026]] — 2026 年 AI 基础设施全景，llm-d 是推理侧关键拼图
