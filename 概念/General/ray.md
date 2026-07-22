---
title: "Ray / KubeRay"
category: -concepts
tags: ["ray", "kuberay", "distributed", "training", "inference", "cncf", "kubernetes", "actor", "task", "data"]
relationships:
  - target: "概念/distributed-training"
    type: enables
  - target: "概念/kubernetes"
    type: runs_on
  - target: "概念/hami"
    type: related_to
  - target: "概念/spark"
    type: related_to
  - target: "概念/deepspeed"
    type: related_to
sources:
  - 模型训练/Distributed_Training/Ray_Deep_Dive.md
  - 架构基建/CNCF_Cloud_Native_AI/KubeRay_Deep_Dive.md
summary: "Ray 是通用分布式计算框架，以 Task/Actor 抽象简化 Python 并行编程；KubeRay 是 CNCF Sandbox 的 Kubernetes Operator，用于在 K8s 上部署和运维 Ray 集群，广泛应用于 LLM 训练、推理服务和数据预处理。"
provenance:
  extracted: 0.75
  inferred: 0.2
  ambiguous: 0.05
base_confidence: 0.88
lifecycle: reviewed
tier: core
created: 2026-06-16
updated: 2026-07-21
aliases:
  - Ray

---
# Ray / KubeRay

> Python 生态的「分布式操作系统」——让单机脚本几乎无修改地扩展到千核集群。

---

## 1. 一句话定义

**Ray** 是面向 Python 的通用分布式计算框架，通过 `@ray.remote` 装饰器将函数（Task）和类（Actor）透明地分发到集群执行。**KubeRay** 是 CNCF Sandbox 项目，提供 [[概念/kubernetes|Kubernetes]] Operator 用于部署、扩缩和管理 Ray 集群。

---

## 2. 核心能力

| 能力 | 说明 |
|------|------|
| **Task 并行** | 有状态/无状态函数分布式执行 |
| **Actor 模型** | 有状态服务，适合参数服务器、推理服务 |
| **Placement Group** | 控制任务在 GPU/CPU/节点上的放置策略 |
| **Ray Data** | 大规模数据加载与转换 |
| **Ray Train** | 分布式训练框架封装（PyTorch、HuggingFace、Horovod） |
| **Ray Serve** | 可组合的多模型推理服务 |
| **Ray RLlib** | 强化学习 |
| **自动扩缩容** | 根据负载动态增减 Worker |

---

## 3. 架构组件

```
Ray Cluster
  ├── Head Node
  │     ├── GCS (Global Control Store)
  │     ├── Dashboard
  │     └── Driver 运行入口
  └── Worker Nodes
        └── 执行 Task / Actor
```

| 组件 | 职责 |
|------|------|
| **Raylet** | 每个节点的本地调度器与资源管理器 |
| **GCS** | 集群元数据与 Actor 状态存储 |
| **Scheduler** | 全局调度，决定 Task 放到哪个节点 |
| **Object Store** | 节点间共享对象（基于 Plasma） |
| **Autoscaler** | 根据资源需求自动扩缩 Worker |

---

## 4. 资源语义（Task/Actor 示例）

```python
import ray

ray.init(address="auto")

@ray.remote(num_gpus=1)
def train_model(data):
    # 在 GPU worker 上执行
    return model

@ray.remote(num_gpus=1)
class Predictor:
    def __init__(self):
        self.model = load_model()
    def predict(self, x):
        return self.model(x)

future = train_model.remote(data)
model_ref = ray.get(future)

predictor = Predictor.remote()
result = ray.get(predictor.predict.remote(x))
```

---

## 5. KubeRay 在 Kubernetes 上的角色

| 资源 | 说明 |
|------|------|
| **RayCluster** | 定义一个 Ray 集群（Head + Workers） |
| **RayJob** | 提交一次性训练/批处理作业 |
| **RayService** | 长期运行的 Ray Serve 服务，支持滚动升级 |

---

## 6. 典型场景

1. **分布式 LLM 训练**：Ray Train + PyTorch FSDP/DeepSpeed。
2. **数据预处理管道**：Ray Data 加载、分词、清洗海量语料。
3. **多模型推理服务**：Ray Serve 组合 vLLM、Embedding、Ranker。
4. **超参搜索**：Ray Tune 并行运行大量实验。
5. **强化学习**：RLlib 分布式训练 Agent。

---

## 7. 与相关技术的关系

| 技术 | 关系 |
|------|------|
| **Kubernetes** | KubeRay 在 K8s 上编排 Ray 集群 |
| **DeepSpeed / FSDP** | Ray Train 可封装这些训练框架 |
| **Spark / Dask** | 都是分布式计算框架，Ray 更偏 AI 工作负载 |
| **KServe / BentoML** | Ray Serve 是竞品或互补的模型服务方案 |
| **HAMi** | Ray 的 GPU Worker 可申请 HAMi vGPU |

---

## 8. 优势与局限

### 优势
- Python 原生，学习曲线平缓。
- 一套抽象同时覆盖训练、推理、数据、调参、RL。
- 云原生集成好，KubeRay 支持自动扩缩和 K8s 生态。

### 局限
- 大集群调试复杂，Placement Group 配置容易出错。
- 非 Python 生态支持有限。
- 资源调度在大规模场景下需要精细调优。

---

## Related

- [[模型训练/Distributed_Training/Ray_Deep_Dive]] — Ray 深度解析
- [[架构基建/CNCF_Cloud_Native_AI/KubeRay_Deep_Dive]] — KubeRay 深度解析
- [[概念/distributed-training]] — 分布式训练
- [[概念/hami]] — HAMi GPU 虚拟化
- [[模型训练/Distributed_Training/DeepSpeed_Deep_Dive]] — DeepSpeed
- [[部署推理/Inference_Engines/KServe_Deep_Dive]] — KServe

---

## 2026 Ray 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **Ray 2.x** | 统一分布式计算框架（训练/推理/调优） | GA |
| **Ray Serve** | 生产级模型服务，支持多模型组合 | GA |
| **Ray Train** | 分布式训练（PyTorch/TF/XGBoost） | GA |
| **Ray Data** | 分布式数据加载与预处理 | GA |
| **Anyscale 平台** | 企业级 Ray 托管与可视化 | GA |

## 生产最佳实践

1. **资源规划**：合理设置 num_cpus/num_gpus，避免资源争抢
2. **对象存储**：大对象用 Ray Object Store 传递，避免序列化开销
3. **容错配置**：设置 max_retries 处理节点故障，训练启用 Checkpoint
4. **监控必备**：部署 Ray Dashboard + Prometheus 监控集群状态
5. **自动扩缩**：配置 autoscaler 根据负载动态调整集群规模

## 版本兼容性

| 组件 | 版本 | 特性 | 备注 |
|------|------|------|------|
| **Ray Core** | ≥ 2.10 | 分布式计算 | 基础框架 |
| **Ray Train** | ≥ 2.10 | 分布式训练 | PyTorch/TF |
| **Ray Serve** | ≥ 2.10 | 模型服务 | 在线推理 |
| **Ray Data** | ≥ 2.10 | 数据处理 | 流式 ETL |
| **Anyscale** | 企业版 | 托管 Ray | 商业平台 |

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|------|
| OOM | Object Store 溢出 | 调大 object_store_memory |
| 任务堆积 | 资源不足 | 增加节点或调整并发度 |
| GCS 故障 | 单点失败 | 启用 GCS HA（Redis 后端） |
| 序列化慢 | 大对象传输 | 使用零拷贝 + 共享内存 |

## 总结

Ray 是 AI 时代的分布式计算框架，从训练到推理到数据处理提供统一的编程模型。它是 OpenAI、Anyscale、Uber 等公司的核心基础设施。

> 💡 Ray 的核心价值：一个框架统一 AI 工作负载——训练、推理、数据处理无需切换不同分布式系统。
