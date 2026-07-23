---
title: Production stack
---
[](){ #deployment-production-stack }

Deploying vLLM on Kubernetes is a scalable and efficient way to serve machine learning models. This guide walks you through deploying vLLM using the [vLLM production stack](https://github.com/vllm-project/production-stack). Born out of a Berkeley-UChicago collaboration, [vLLM production stack](https://github.com/vllm-project/production-stack) is an officially released, production-optimized codebase under the [vLLM project](https://github.com/vllm-project), designed for LLM deployment with:

* **Upstream vLLM compatibility** – It wraps around upstream vLLM without modifying its code.
* **Ease of use** – Simplified deployment via Helm charts and observability through Grafana dashboards.
* **High performance** – Optimized for LLM workloads with features like multi-model support, model-aware and prefix-aware routing, fast vLLM bootstrapping, and KV cache offloading with [LMCache](https://github.com/LMCache/LMCache), among others.

If you are new to Kubernetes, don't worry: in the vLLM production stack [repo](https://github.com/vllm-project/production-stack), we provide a step-by-step [guide](https://github.com/vllm-project/production-stack/blob/main/tutorials/00-install-kubernetes-env.md) and a [short video](https://www.youtube.com/watch?v=EsTJbQtzj0g) to set up everything and get started in **4 minutes**!

## Pre-requisite

Ensure that you have a running Kubernetes environment with GPU (you can follow [this tutorial](https://github.com/vllm-project/production-stack/blob/main/tutorials/00-install-kubernetes-env.md) to install a Kubernetes environment on a bare-medal GPU machine).

## Deployment using vLLM production stack

The standard vLLM production stack is installed using a Helm chart. You can run this [bash script](https://github.com/vllm-project/production-stack/blob/main/utils/install-helm.sh) to install Helm on your GPU server.

To install the vLLM production stack, run the following commands on your desktop:

```bash
sudo helm repo add vllm https://vllm-project.github.io/production-stack
sudo helm install vllm vllm/vllm-stack -f tutorials/assets/values-01-minimal-example.yaml
```

This will instantiate a vLLM-production-stack-based deployment named `vllm` that runs a small LLM (Facebook opt-125M model).

### Validate Installation

Monitor the deployment status using:

```bash
sudo kubectl get pods
```

And you will see that pods for the `vllm` deployment will transit to `Running` state.

```text
NAME                                           READY   STATUS    RESTARTS   AGE
vllm-deployment-router-859d8fb668-2x2b7        1/1     Running   0          2m38s
vllm-opt125m-deployment-vllm-84dfc9bd7-vb9bs   1/1     Running   0          2m38s
```

**NOTE**: It may take some time for the containers to download the Docker images and LLM weights.

### Send a Query to the Stack

Forward the `vllm-router-service` port to the host machine:

```bash
sudo kubectl port-forward svc/vllm-router-service 30080:80
```

And then you can send out a query to the OpenAI-compatible API to check the available models:

```bash
curl -o- http://localhost:30080/models
```

Expected output:

```json
{
  "object": "list",
  "data": [
    {
      "id": "facebook/opt-125m",
      "object": "model",
      "created": 1737428424,
      "owned_by": "vllm",
      "root": null
    }
  ]
}
```

To send an actual chatting request, you can issue a curl request to the OpenAI `/completion` endpoint:

```bash
curl -X POST http://localhost:30080/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "facebook/opt-125m",
    "prompt": "Once upon a time,",
    "max_tokens": 10
  }'
```

Expected output:

```json
{
  "id": "completion-id",
  "object": "text_completion",
  "created": 1737428424,
  "model": "facebook/opt-125m",
  "choices": [
    {
      "text": " there was a brave knight who...",
      "index": 0,
      "finish_reason": "length"
    }
  ]
}
```

### Uninstall

To remove the deployment, run:

```bash
sudo helm uninstall vllm
```

---

### (Advanced) Configuring vLLM production stack

The core vLLM production stack configuration is managed with YAML. Here is the example configuration used in the installation above:

```yaml
servingEngineSpec:
  runtimeClassName: ""
  modelSpec:
  - name: "opt125m"
    repository: "vllm/vllm-openai"
    tag: "latest"
    modelURL: "facebook/opt-125m"

    replicaCount: 1

    requestCPU: 6
    requestMemory: "16Gi"
    requestGPU: 1

    pvcStorage: "10Gi"
```

In this YAML configuration:
* **`modelSpec`** includes:
  * `name`: A nickname that you prefer to call the model.
  * `repository`: Docker repository of vLLM.
  * `tag`: Docker image tag.
  * `modelURL`: The LLM model that you want to use.
* **`replicaCount`**: Number of replicas.
* **`requestCPU` and `requestMemory`**: Specifies the CPU and memory resource requests for the pod.
* **`requestGPU`**: Specifies the number of GPUs required.
* **`pvcStorage`**: Allocates persistent storage for the model.

**NOTE:** If you intend to set up two pods, please refer to this [YAML file](https://github.com/vllm-project/production-stack/blob/main/tutorials/assets/values-01-2pods-minimal-example.yaml).

**NOTE:** vLLM production stack offers many more features (*e.g.* CPU offloading and a wide range of routing algorithms). Please check out these [examples and tutorials](https://github.com/vllm-project/production-stack/tree/main/tutorials) and our [repo](https://github.com/vllm-project/production-stack) for more details!

## 核心知识框架

| 知识层 | 内容 | 深度要求 | 优先级 |
|--------|------|----------|--------|
| 基础概念 | 定义/原理/分类 | 理解并能解释 | P0 |
| 核心方法 | 算法/技术/工具 | 掌握并能应用 | P0 |
| 工程实践 | 设计/实现/优化 | 独立完成项目 | P1 |
| 前沿进展 | 最新研究/趋势 | 了解并跟踪 | P2 |
| 应用案例 | 实际场景/经验 | 参考并借鉴 | P1 |

## 技术要点速查

| 要点 | 说明 | 注意事项 |
|------|------|----------|
| 核心原理 | 理解底层机制 | 不要死记硬背 |
| 实践方法 | 动手验证理论 | 从简单开始 |
| 性能优化 | 瓶颈分析+调优 | 数据驱动 |
| 错误排查 | 系统化定位问题 | 日志+复现 |
| 最佳实践 | 遵循行业标准 | 因地制宜 |
| 持续学习 | 跟踪技术发展 | 选择性深入 |

## 对比分析表

| 维度 | 方案一 | 方案二 | 方案三 | 推荐 |
|------|--------|--------|--------|------|
| 复杂度 | 低 | 中 | 高 | 按需选择 |
| 性能 | 基础 | 良好 | 优秀 | 按需求 |
| 可维护性 | 高 | 中 | 低 | 优先高 |
| 学习曲线 | 平缓 | 中等 | 陡峭 | 按团队 |
| 社区支持 | 广泛 | 一般 | 有限 | 优先广泛 |

## 常见问题FAQ

| 问题 | 解答 |
|------|------|
| 如何快速入门? | 先理解核心概念，再通过实践加深理解 |
| 如何选择技术方案? | 根据场景需求、团队能力、成本约束综合评估 |
| 遇到问题如何排查? | 复现问题→定位范围→分析原因→验证修复 |
| 如何持续提升? | 系统学习+项目实践+社区交流+定期复盘 |
| 如何评估效果? | 设定明确指标→对比基线→持续监控 |

## 学习路径

| 阶段 | 内容 | 时间 | 产出 |
|------|------|------|------|
| 入门 | 核心概念+基础操作 | 1-2周 | 基本理解 |
| 基础 | 工具使用+简单实践 | 2-3周 | 能独立操作 |
| 进阶 | 深入原理+复杂场景 | 3-4周 | 能解决问题 |
| 实战 | 生产级应用 | 4-6周 | 独立负责 |
| 精通 | 架构+创新 | 持续 | 技术领导 |

## 术语表

| 术语 | 含义 |
|------|------|
| Best Practice | 行业最佳实践 |
| Trade-off | 权衡取舍 |
| Scalability | 可扩展性 |
| Maintainability | 可维护性 |
| Observability | 可观测性 |
| Reliability | 可靠性 |

## 检查清单

- [ ] 核心概念已理解
- [ ] 基本操作已掌握
- [ ] 实践项目已完成
- [ ] 常见问题能解决
- [ ] 前沿趋势有关注
- [ ] 知识已沉淀文档化
