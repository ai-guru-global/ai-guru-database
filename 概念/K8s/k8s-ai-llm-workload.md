---
title: "K8s 上的 LLM 工作负载 (KubeRay / PyTorchJob / vLLM Operator)"
category: concepts
tags:
  - k8s
  - llm
  - ray
  - kuberay
  - pytorchjob
  - vllm
  - lws
  - leaderworkerset
  - ai-workload
aliases:
  - K8s LLM Workload
  - KubeRay
  - RayJob
  - PyTorchJob
  - vLLM Operator
  - LWS
  - LeaderWorkerSet
relationships:
  - target: "概念/ray"
    type: extends
  - target: "概念/vllm"
    type: related_to
  - target: "概念/distributed-parallelism"
    type: related_to
  - target: "概念/training-operator"
    type: related_to
summary: "K8s 上跑 LLM 训练与推理的"工作负载 API"——KubeRay(Ray on K8s)做分布式训练,Training Operator(PyTorchJob/TFJob)做传统训练,vLLM Operator + LeaderWorkerSet 做 Prefill/Decode 分离推理,Ingress/Gateway 暴露 LLM 端点。是 2025-2026 主流 LLM 云原生方案。"
lifecycle: reviewed
tier: core
created: 2026-07-24
updated: 2026-07-24
sources: []
---

# K8s 上的 LLM 工作负载

> **一句话理解**:LLM 训练和推理在 K8s 上的"标准部署模板"——KubeRay 处理分布式训练(动态扩缩),Training Operator 处理传统训练(PyTorchJob/TFJob),vLLM Operator + LeaderWorkerSet 处理 LLM 推理(P/D 分离 + 弹性)。

---

## 一、关键术语中英对照

| 中文 | 英文 | 说明 |
|---|---|---|
| 自定义资源 | Custom Resource(CR) | K8s 扩展资源类型 |
| 控制器 | Controller | 监听 CR 并调和状态 |
| 操作器 | Operator | 封装运维知识的控制器 |
| 任务资源 | Job | 一次性工作负载 |
| 分布式训练 | Distributed Training | 多机多卡协同 |
| 主从架构 | Master-Worker | 一个 Head 节点 + 多个 Worker |
| 弹性训练 | Elastic Training | 动态扩缩 Worker |
| 检查点 | Checkpoint | 训练状态保存/恢复 |
| 推理服务 | Inference Service | 模型部署 + 服务暴露 |
| 预填充 | Prefill | 处理 prompt 阶段 |
| 解码 | Decode | 生成 token 阶段 |
| 解耦 | Disaggregation | P/D 分离部署 |
| 领导者 | Leader | 协调节点 |
| 工作节点 | Worker | 计算节点 |
| 边车 | Sidecar | 与主容器同 Pod 辅助容器 |
| 状态fulSet | StatefulSet | 有状态 Pod 部署 |
| 部署 | Deployment | 无状态 Pod 部署 |
| 网关 | Gateway | L7 路由/限流/认证 |

---

## 二、核心 Operator 矩阵对比(2026-02 快照)

| Operator | 用途 | 训练/推理 | GitHub Stars | 成熟度 |
|---|---|---|---|---|
| **KubeRay** | Ray on K8s | 训练/RL/推理 | 1.8K+ | ★★★★★ |
| **Training Operator** (Kubeflow) | PyTorch/TF/XGBoost 训练 | 训练 | 1.6K+ | ★★★★★ |
| **vLLM Operator** | vLLM 推理部署 | 推理 | 0.5K+ | ★★★★ |
| **LeaderWorkerSet (LWS)** | Prefill/Decode 分离 | 推理 | 0.3K+ | ★★★★ |
| **Kserve** | Serverless Model Serving | 推理 | 1.5K+ | ★★★★★ |
| **KEDA** | 事件驱动扩缩 | 推理 | 8K+ | ★★★★★ |
| **Argo Workflows** | 流水线编排 | 训练/MLOps | 13K+ | ★★★★★ |
| **Volcano** | gang scheduling | 训练调度 | 4K+ | ★★★★★ |

---

## 三、KubeRay — 分布式训练首选

### 3.1 核心概念

- **RayCluster**:Ray 集群 K8s 部署
- **RayJob**:一次性 Ray 任务
- **RayService**:Ray Serve 长连接服务(支持 0 停机升级)
- **KubeRay 1.5+**(2025-12)新特性:Elastic GPU、Autoscaler V2、多集群

### 3.2 RayJob 实战

```yaml
apiVersion: ray.io/v1
kind: RayJob
metadata:
  name: llama3-finetune
spec:
  entrypoint: python train.py --model llama3-8b
  runtimeEnv: |
    pip:
      - torch==2.6.0
      - transformers==4.49
    env_vars:
      VLLM_USE_V1: "1"
  clusterSpec:
    headGroupSpec:
      rayStartParams:
        dashboard-host: '0.0.0.0'
      template:
        spec:
          containers:
          - name: ray-head
            image: rayproject/ray-ml:2.40.0
            resources:
              limits:
                cpu: "4"
                memory: "16Gi"
                nvidia.com/gpu: "1"
    workerGroupSpecs:
    - groupName: gpu-workers
      replicas: 7
      minReplicas: 4
      maxReplicas: 8
      template:
        spec:
          containers:
          - name: ray-worker
            image: rayproject/ray-ml:2.40.0
            resources:
              limits:
                nvidia.com/gpu: "8"
```

**优势**:
- 弹性:训练中可动态扩缩 Worker(KubeRay Autoscaler)
- 异构:Head 用 CPU Pod,Worker 用 GPU Pod
- 通用:支持任意 Ray 脚本(RLHF/数据/训练)

---

## 四、Training Operator(Kubeflow)— 传统训练

### 4.1 支持的 CRD

- `PyTorchJob`:PyTorch 分布式训练
- `TFJob`:TensorFlow
- `XGBoostJob`
- `MPIJob`(Horovod)
- `PaddleJob`(百度飞桨)
- `MXJob`(Apache MXNet)

### 4.2 PyTorchJob 实战

```yaml
apiVersion: kubeflow.org/v1
kind: PyTorchJob
metadata:
  name: pytorch-ddp
spec:
  pytorchReplicaSpecs:
    Master:
      replicas: 1
      template:
        spec:
          containers:
          - name: pytorch
            image: pytorch/pytorch:2.6.0-cuda12.4-cudnn9-runtime
            resources:
              limits:
                nvidia.com/gpu: "8"
    Worker:
      replicas: 7
      template:
        spec:
          containers:
          - name: pytorch
            image: pytorch/pytorch:2.6.0-cuda12.4-cudnn9-runtime
            resources:
              limits:
                nvidia.com/gpu: "8"
```

**适用场景**:
- 传统 DDP(分布式数据并行)训练
- 与 torchrun / torch.distributed 配合
- 简单、可靠、生产成熟

---

## 五、vLLM Operator + LeaderWorkerSet — LLM 推理

### 5.1 vLLM Operator

- 2025-04 由 Red Hat + vLLM 团队联合开源
- 把 vLLM 部署抽象为 `LLMService` CRD
- 内置模型管理、量化、LoRA 适配器加载、副本扩缩

### 5.2 LeaderWorkerSet(LWS)— Prefill/Decode 分离

- K8s SIG-AI 2025 推出的新 CRD
- **Leader**:Prefill Pod(处理长 prompt)
- **Worker**:Decode Pod(生成 token)
- 解决 LLM 推理"Prefill 重 + Decode 长尾"的资源错配
- 配合 vLLM `VLLM_USE_V1=1` 启用 P/D 分离
- `gateway-api-inference-extension` 做 P/D 路由

### 5.3 LWS 实战

```yaml
apiVersion: leaderworkerset.x-k8s.io/v1
kind: LeaderWorkerSet
metadata:
  name: vllm-llama3
spec:
  replicas: 3    # 3 个 Leader(Prefill)
  size: 2       # 每个 Leader 带 1 个 Worker(Decode)
  template:
    spec:
      containers:
      - name: vllm
        image: vllm/vllm-openai:v0.6.6
        args:
        - --model=meta-llama/Meta-Llama-3-70B
        - --tensor-parallel-size=4
        - --enable-prefix-caching
        - --enable-chunked-prefill
        resources:
          limits:
            nvidia.com/gpu: "4"
```

**收益**:
- Prefill 资源密集型 + Decode 延迟敏感 → 分别优化
- GPU 利用率从 40% 提升到 70-80%

---

## 六、Kserve — Serverless Model Serving

- 已有独立卡 `kserve.md`,这里补充与 LLM 集成
- **Transformer + Predictor** 模式:可插拔预处理
- 与 vLLM、TensorRT-LLM、ONNX Runtime 集成
- **Knative** 底层支持 0→N 自动扩缩
- 适合"流量波动大"场景

---

## 七、Argo Workflows — AI 流水线编排

- 已有 `tekton.md` 类似,K8s 原生 Workflow CRD
- 与 Kubeflow Pipelines 深度集成
- **2025-2026 新增**:GPU DRA 支持、RayJob 步骤、Model Registry 步骤
- 典型流程:数据预处理 → 训练 → 评估 → 部署

---

## 八、生产最佳实践

1. **分布式训练用 KubeRay + RayJob**:弹性最好,支持 RLHF/AutoML/数据并行/模型并行。
2. **传统 DDP 用 Training Operator + PyTorchJob**:稳定、成熟、生产首选。
3. **LLM 推理用 LWS + vLLM**:P/D 分离 + 弹性,GPU 利用率提升 30%+。
4. **小模型推理用 Kserve + Knative**:0→N 自动扩缩,流量波动场景最优。
5. **多团队/多实验用 Volcano gang scheduling**:避免资源死锁,公平调度。
6. **检查点存 S3/OSS**:训练中断可恢复,KubeRay 内置 CheckpointManager。
7. **模型版本管理用 OCI/ORAS**:把模型作为 OCI 镜像管理,统一 K8s 工作流。
8. **推理限流用 Envoy Gateway + Gateway API Inference Extension**:QPS/Token 限流 + P/D 路由。
9. **GPU 利用率监控必备 DCGM + Prometheus**:发现僵尸 Pod,优化调度。
10. **多集群训练用 KubeRay 1.5+ 多集群**:跨可用区训练,RTO < 1 分钟。

---

## 九、2026 生态速览

| 维度 | 2026 状态 |
|---|---|
| **KubeRay** | 1.5 GA,Autoscaler V2,多集群 GA |
| **Training Operator** | v1.10,完整 DDP/FSDP/DeepSpeed 支持 |
| **vLLM Operator** | v0.4(2025-12),Model Cache + LoRA 热加载 |
| **LWS** | v1.0 GA(2025-Q3),Gateway API Inference Extension 集成 |
| **KServe** | v0.15,LLM 推理优化,Serverless GPU |
| **Argo Workflows** | v3.6,GPU DRA、RayJob 步骤、Cache 优化 |
| **KEDA** | v2.15,LLM Token-based 扩缩(实验) |
| **Gateway API** | Inference Extension GA(2025-Q4),Token 路由 |
| **社区** | KubeRay SIG 1.8K 贡献者,Training Operator SIG 活跃 |

---

## 十、See Also(官方源)

- KubeRay [github.com/ray-project/kuberay](https://github.com/ray-project/kuberay)
- Ray 官方 [docs.ray.io](https://docs.ray.io/)
- Kubeflow Training Operator [github.com/kubeflow/training-operator](https://github.com/kubeflow/training-operator)
- vLLM Operator [github.com/vllm-project/vllm-operator](https://github.com/vllm-project/vllm-operator)
- LeaderWorkerSet [github.com/kubernetes-sigs/lws](https://github.com/kubernetes-sigs/lws)
- Gateway API Inference Extension [github.com/kubernetes-sigs/gateway-api-inference-extension](https://github.com/kubernetes-sigs/gateway-api-inference-extension)
- KServe [github.com/kserve/kserve](https://github.com/kserve/kserve)
- KEDA [github.com/kedacore/keda](https://github.com/kedacore/keda)
- Argo Workflows [github.com/argoproj/argo-workflows](https://github.com/argoproj/argo-workflows)

---

## 十一、相关概念卡

- [[概念/kserve|Kserve]]
- [[概念/volcano|Volcano]]
- [[概念/argo-rollouts|Argo Rollouts]]
- [[概念/vllm|Vllm]]
- [[概念/distributed-parallelism|Distributed Parallelism]]
- [[概念/prefill-decode-disaggregation|Prefill Decode Disaggregation]]
- [[概念/ray|Ray]]
- [[概念/kserve|Kserve]]
