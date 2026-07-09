---
title: "Ray 深度解析: Python 分布式 AI 计算框架"
category: "07-model-training"
tags: ["ray", "kuberay", "distributed", "training", "inference", "data", "tune", "serve", "actor", "task", "cncf"]
summary: "> **一句话理解**: Ray 是面向 Python 的通用分布式计算框架，通过 Task/Actor 抽象让单机代码几乎无修改地扩展到多机多卡；KubeRay 则在 Kubernetes 上提供 Ray 集群的声明式运维。"
created: "2026-06-16"
updated: "2026-06-16"
tier: supporting
aliases:
  - "Ray Deep Dive"
  - Ray_Deep_Dive
sources: []

---
# Ray 深度解析：Python 分布式 AI 计算框架

> **一句话理解**: Ray 是面向 Python 的通用分布式计算框架，通过 Task/Actor 抽象让单机代码几乎无修改地扩展到多机多卡；KubeRay 则在 Kubernetes 上提供 Ray 集群的声明式运维。

> **官方站点**: https://docs.ray.io | **KubeRay GitHub**: https://github.com/ray-project/kuberay

---

## 目录

1. [项目背景与定位](#1-项目背景与定位)
2. [核心抽象：Task 与 Actor](#2-核心抽象task-与-actor)
3. [架构全景](#3-架构全景)
4. [Ray 核心库](#4-ray-核心库)
5. [Placement Group 与资源调度](#5-placement-group-与资源调度)
6. [Ray Train：分布式训练](#6-ray-train分布式训练)
7. [Ray Serve：分布式推理](#7-ray-serve分布式推理)
8. [Ray Data：大规模数据预处理](#8-ray-data大规模数据预处理)
9. [KubeRay 在 Kubernetes 上的部署](#9-kuberay-在-kubernetes-上的部署)
10. [与 DeepSpeed / FSDP / HAMi 的集成](#10-与-deepspeed--fsdp--hami-的集成)
11. [生产最佳实践](#11-生产最佳实践)
12. [常见问题与排查](#12-常见问题与排查)
13. [官方资源](#13-官方资源)

---

## 1. 项目背景与定位

### 1.1 发展历程

- **2016 年**：UC Berkeley RISELab 发起 Ray，目标解决强化学习训练中的分布式计算痛点。
- **2019 年**：Anyscale 成立，推动 Ray 商业化。
- **2021 年**：Ray 2.0 发布，形成 Train/Data/Serve/Tune/RLlib 完整库生态。
- **2023 年**：KubeRay 进入 CNCF Sandbox。
- **2024-2026 年**：Ray 成为 LLM 训练、数据预处理、多模型服务的主流基础设施之一。

### 1.2 项目定位

| 维度 | 定位 |
|------|------|
| **Ray** | 通用 Python 分布式计算框架 |
| **KubeRay** | Kubernetes 上的 Ray Operator（CNCF Sandbox） |
| **许可证** | Apache 2.0 |
| **核心目标** | 用一套 Python API 统一 AI 工作负载的分布式执行 |

---

## 2. 核心抽象：Task 与 Actor

### 2.1 Task（无状态函数）

```python
import ray

ray.init()

@ray.remote
def square(x):
    return x * x

futures = [square.remote(i) for i in range(10)]
results = ray.get(futures)
print(results)  # [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]
```

### 2.2 Actor（有状态服务）

```python
@ray.remote(num_gpus=1)
class GPUWorker:
    def __init__(self):
        self.model = load_model()
    def predict(self, x):
        return self.model(x)

worker = GPUWorker.remote()
result = ray.get(worker.predict.remote(x))
```

### 2.3 ObjectRef（分布式 Future）

- `remote()` 返回 `ObjectRef`。
- `ray.get()` 阻塞获取结果。
- 大对象自动进入分布式 Object Store。

---

## 3. 架构全景

```
┌─────────────────────────────────────────────────────────────┐
│                        Driver / Client                       │
│                    提交 Task / Actor / Job                   │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                         Head Node                            │
│  ┌──────────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │  GCS             │  │  Dashboard   │  │  Raylet      │   │
│  │ (Global Control) │  │  (UI/Metrics)│  │ (Scheduler)  │   │
│  └──────────────────┘  └──────────────┘  └──────┬───────┘   │
└─────────────────────────────────────────────────┼───────────┘
                                                  │
┌─────────────────────────────────────────────────┼───────────┐
│                    Worker Nodes                  │           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────▼───────┐   │
│  │  Raylet      │  │  Object Store│  │  Task / Actor    │   │
│  │ (Scheduler)  │  │  (Plasma)    │  │  Execution       │   │
│  └──────────────┘  └──────────────┘  └──────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 3.1 关键组件

| 组件 | 职责 |
|------|------|
| **GCS** | 集群状态、Actor 表、资源表 |
| **Raylet** | 节点级调度与 Worker 管理 |
| **Object Store** | 零拷贝共享对象，基于共享内存 |
| **Autoscaler** | 监控资源队列，向底层集群申请/释放节点 |

---

## 4. Ray 核心库

| 库 | 用途 |
|----|------|
| **Ray Core** | Task/Actor/Object 基础分布式原语 |
| **Ray Data** | 大规模数据加载、转换、管道 |
| **Ray Train** | 分布式训练（PyTorch、HuggingFace、Horovod、XGBoost） |
| **Ray Tune** | 分布式超参搜索 |
| **Ray Serve** | 多模型推理服务 |
| **Ray RLlib** | 强化学习 |
| **Ray Workflows** | 可靠工作流 |

---

## 5. Placement Group 与资源调度

### 5.1 为什么需要 Placement Group

多卡训练或流水线并行时，需要把相关 Actor 放到同一节点或相邻节点，避免跨节点通信瓶颈。

### 5.2 示例

```python
from ray.util.placement_group import placement_group

pg = placement_group(
    [{"GPU": 1, "CPU": 8}, {"GPU": 1, "CPU": 8}],
    strategy="STRICT_PACK"   # 把两个 bundle 放到同一节点
)
ray.get(pg.ready())

worker1 = GPUWorker.options(placement_group=pg, placement_group_bundle_index=0).remote()
worker2 = GPUWorker.options(placement_group=pg, placement_group_bundle_index=1).remote()
```

### 5.3 放置策略

| 策略 | 说明 |
|------|------|
| `STRICT_PACK` | 所有 bundle 必须在同一节点 |
| `PACK` | 尽量打包到同一节点 |
| `STRICT_SPREAD` | 每个 bundle 必须在不同节点 |
| `SPREAD` | 尽量分散 |

---

## 6. Ray Train：分布式训练

### 6.1 PyTorch 示例

```python
import ray
from ray import train
from ray.train.torch import TorchTrainer

def train_func(config):
    import torch
    model = torch.nn.Linear(10, 1)
    model = train.torch.prepare_model(model)
    # 训练循环...

trainer = TorchTrainer(
    train_loop_per_worker=train_func,
    scaling_config=train.ScalingConfig(num_workers=4, use_gpu=True)
)
result = trainer.fit()
```

### 6.2 与 DeepSpeed / FSDP 集成

```python
from ray.train.torch import TorchTrainer
from ray.train.deepspeed import DeepSpeedConfig

trainer = TorchTrainer(
    train_loop_per_worker=train_func,
    scaling_config=train.ScalingConfig(num_workers=8, use_gpu=True),
    run_config=ray.train.RunConfig(...)
)
```

---

## 7. Ray Serve：分布式推理

### 7.1 基本示例

```python
from ray import serve
from starlette.requests import Request

@serve.deployment(num_replicas=2, ray_actor_options={"num_gpus": 1})
class LLMDeployment:
    def __init__(self):
        self.model = load_vllm_model()
    async def __call__(self, request: Request):
        return self.model.generate(await request.json())

serve.run(LLMDeployment.bind())
```

### 7.2 多模型组合

```python
@serve.deployment
class Embedder:
    def __call__(self, text):
        return embedding_model(text)

@serve.deployment
class Ranker:
    def __call__(self, query, docs):
        return rank(query, docs)

# 构建 RAG 流水线
rag_flow = Ranker.bind(Embedder.bind())
serve.run(rag_flow)
```

---

## 8. Ray Data：大规模数据预处理

### 8.1 读取与转换

```python
import ray

# 读取 parquet
 ds = ray.data.read_parquet("s3://my-bucket/corpus/")

# 分词
ds = ds.map_batches(tokenize_batch, batch_format="pandas", num_cpus=4)

# 写入训练格式
ds.write_parquet("s3://my-bucket/processed/")
```

### 8.2 适合 LLM 的场景

- 海量网页语料清洗
- 指令微调数据增强
- 预训练数据去重

---

## 9. KubeRay 在 Kubernetes 上的部署

### 9.1 安装 KubeRay Operator

```bash
helm repo add kuberay https://ray-project.github.io/kuberay-helm/
helm install kuberay-operator kuberay/kuberay-operator
```

### 9.2 部署 RayCluster

```yaml
apiVersion: ray.io/v1
kind: RayCluster
metadata:
  name: ray-cluster
spec:
  headGroupSpec:
    rayStartParams:
      dashboard-host: "0.0.0.0"
    template:
      spec:
        containers:
          - name: ray-head
            image: rayproject/ray-ml:2.9.0-gpu
            resources:
              limits:
                cpu: "4"
                memory: "16Gi"
  workerGroupSpecs:
    - replicas: 2
      minReplicas: 1
      maxReplicas: 10
      groupName: gpu-group
      rayStartParams: {}
      template:
        spec:
          schedulerName: hami-scheduler
          containers:
            - name: ray-worker
              image: rayproject/ray-ml:2.9.0-gpu
              resources:
                limits:
                  nvidia.com/gpu: 1
                  nvidia.com/gpumem: 8192
```

### 9.3 提交 RayJob

```yaml
apiVersion: ray.io/v1
kind: RayJob
metadata:
  name: llm-training
spec:
  submissionMode: K8sJobMode
  entrypoint: python train.py
  rayClusterSpec:
    headGroupSpec:
      rayStartParams:
        dashboard-host: "0.0.0.0"
      template:
        spec:
          containers:
            - name: ray-head
              image: rayproject/ray-ml:2.9.0-gpu
```

---

## 10. 与 DeepSpeed / FSDP / HAMi 的集成

### 10.1 Ray + DeepSpeed

Ray Train 提供 DeepSpeed 封装，自动处理进程组、Checkpoint、混合精度。

### 10.2 Ray + HAMi

在 KubeRay 的 Worker 资源限制中申请 HAMi vGPU，Ray Worker 看到的 GPU 即为配额。

```yaml
resources:
  limits:
    nvidia.com/gpu: 1
    nvidia.com/gpumem: 8192
```

> 注意：Ray 的 `num_gpus` 资源请求会对应到 HAMi 的 `nvidia.com/gpu`，需确保 `deviceSplitCount` 足够。

---

## 11. 生产最佳实践

### 11.1 资源规划

| 组件 | 建议配置 |
|------|---------|
| Head Node | 不跑计算任务，配置中等 CPU/内存即可 |
| Worker Node | 按训练/推理需求配置 GPU 和内存 |
| Object Store | 通常设为内存的 30% |

### 11.2 调优

- 大对象避免频繁跨节点传输，尽量使用 Placement Group。
- 使用 `ray.put()` 共享只读大对象。
- 开启 Prometheus/Grafana 监控 Ray 指标。

### 11.3 安全

- Head 节点不暴露公网 Dashboard。
- 使用 NetworkPolicy 限制 Worker 通信。
- 对 S3/GCS 等外部存储使用 IAM 服务账号。

---

## 12. 常见问题与排查

### Q1: Ray 任务一直 PENDING

**排查**：

```bash
ray status
# 检查是否有足够资源
# 检查 Placement Group 是否满足
```

**常见原因**：
- 资源不足（GPU/CPU/内存）
- Placement Group 策略无法满足
- Autoscaler 配置错误

### Q2: Object Spilling 到磁盘很慢

**A**: 增大 Object Store 内存，或使用高速本地 SSD。

### Q3: Actor 启动失败

**A**: 检查 `__init__` 是否耗时过长或 OOM，使用 `max_restarts` 配置自动重启。

### Q4: KubeRay 集群无法自动扩容

**A**: 检查 Autoscaler 日志、K8s cluster autoscaler 是否已启用、maxReplicas 是否足够大。

### Q5: Ray Serve 延迟高

**A**: 增加副本数、使用 Continuous Batching、检查网络延迟、优化模型加载。

### Q6: 与 Spark/Dask 怎么选？

**A**: AI/ML 工作负载优先 Ray；传统 ETL/大数据优先 Spark/Dask。

### Q7: 如何调试分布式死锁？

**A**: 查看 Ray Dashboard 的 Gantt Chart 和任务依赖图，检查 Actor 循环依赖。

---

## 13. 官方资源

- **Ray 文档**: https://docs.ray.io
- **Ray GitHub**: https://github.com/ray-project/ray
- **KubeRay 文档**: https://ray-project.github.io/kuberay
- **KubeRay GitHub**: https://github.com/ray-project/kuberay

---

## Related

- [[_concepts/ray]] — Ray 概念卡片
- [[12_Architecture_Infrastructure/CNCF_Cloud_Native_AI/KubeRay_Deep_Dive]] — KubeRay 深度解析
- [[_concepts/distributed-training]] — 分布式训练
- [[_concepts/hami]] — HAMi GPU 虚拟化
- [[07_Model_Training/Distributed_Training/DeepSpeed_Deep_Dive]] — DeepSpeed
- [[07_Model_Training/Distributed_Training/Distributed_Training_2026]] — 分布式训练 2026
- [[10_Deployment_Inference/Inference_Engines/KServe_Deep_Dive]] — KServe
