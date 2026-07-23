---
title: LWS
---
[](){ #deployment-lws }

LeaderWorkerSet (LWS) is a Kubernetes API that aims to address common deployment patterns of AI/ML inference workloads.
A major use case is for multi-host/multi-node distributed inference.

vLLM can be deployed with [LWS](https://github.com/kubernetes-sigs/lws) on Kubernetes for distributed model serving.

## Prerequisites

* At least two Kubernetes nodes, each with 8 GPUs, are required.
* Install LWS by following the instructions found [here](https://lws.sigs.k8s.io/docs/installation/).

## Deploy and Serve

Deploy the following yaml file `lws.yaml`

```yaml
apiVersion: leaderworkerset.x-k8s.io/v1
kind: LeaderWorkerSet
metadata:
  name: vllm
spec:
  replicas: 2
  leaderWorkerTemplate:
    size: 2
    restartPolicy: RecreateGroupOnPodRestart
    leaderTemplate:
      metadata:
        labels:
          role: leader
      spec:
        containers:
          - name: vllm-leader
            image: docker.io/vllm/vllm-openai:latest
            env:
              - name: HUGGING_FACE_HUB_TOKEN
                value: <your-hf-token>
            command:
              - sh
              - -c
              - "bash /vllm-workspace/examples/online_serving/multi-node-serving.sh leader --ray_cluster_size=$(LWS_GROUP_SIZE); 
                 python3 -m vllm.entrypoints.openai.api_server --port 8080 --model meta-llama/Meta-Llama-3.1-405B-Instruct --tensor-parallel-size 8 --pipeline_parallel_size 2"
            resources:
              limits:
                nvidia.com/gpu: "8"
                memory: 1124Gi
                ephemeral-storage: 800Gi
              requests:
                ephemeral-storage: 800Gi
                cpu: 125
            ports:
              - containerPort: 8080
            readinessProbe:
              tcpSocket:
                port: 8080
              initialDelaySeconds: 15
              periodSeconds: 10
            volumeMounts:
              - mountPath: /dev/shm
                name: dshm
        volumes:
        - name: dshm
          emptyDir:
            medium: Memory
            sizeLimit: 15Gi
    workerTemplate:
      spec:
        containers:
          - name: vllm-worker
            image: docker.io/vllm/vllm-openai:latest
            command:
              - sh
              - -c
              - "bash /vllm-workspace/examples/online_serving/multi-node-serving.sh worker --ray_address=$(LWS_LEADER_ADDRESS)"
            resources:
              limits:
                nvidia.com/gpu: "8"
                memory: 1124Gi
                ephemeral-storage: 800Gi
              requests:
                ephemeral-storage: 800Gi
                cpu: 125
            env:
              - name: HUGGING_FACE_HUB_TOKEN
                value: <your-hf-token>
            volumeMounts:
              - mountPath: /dev/shm
                name: dshm   
        volumes:
        - name: dshm
          emptyDir:
            medium: Memory
            sizeLimit: 15Gi
---
apiVersion: v1
kind: Service
metadata:
  name: vllm-leader
spec:
  ports:
    - name: http
      port: 8080
      protocol: TCP
      targetPort: 8080
  selector:
    leaderworkerset.sigs.k8s.io/name: vllm
    role: leader
  type: ClusterIP
```

```bash
kubectl apply -f lws.yaml
```

Verify the status of the pods:

```bash
kubectl get pods
```

Should get an output similar to this:

```bash
NAME       READY   STATUS    RESTARTS   AGE
vllm-0     1/1     Running   0          2s
vllm-0-1   1/1     Running   0          2s
vllm-1     1/1     Running   0          2s
vllm-1-1   1/1     Running   0          2s
```

Verify that the distributed tensor-parallel inference works:

```bash
kubectl logs vllm-0 |grep -i "Loading model weights took" 
```

Should get something similar to this:

```text
INFO 05-08 03:20:24 model_runner.py:173] Loading model weights took 0.1189 GB
(RayWorkerWrapper pid=169, ip=10.20.0.197) INFO 05-08 03:20:28 model_runner.py:173] Loading model weights took 0.1189 GB
```

## Access ClusterIP service

```bash
# Listen on port 8080 locally, forwarding to the targetPort of the service's port 8080 in a pod selected by the service
kubectl port-forward svc/vllm-leader 8080:8080
```

The output should be similar to the following:

```text
Forwarding from 127.0.0.1:8080 -> 8080
Forwarding from [::1]:8080 -> 8080
```

## Serve the model

Open another terminal and send a request

```text
curl http://localhost:8080/v1/completions \
-H "Content-Type: application/json" \
-d '{
    "model": "meta-llama/Meta-Llama-3.1-405B-Instruct",
    "prompt": "San Francisco is a",
    "max_tokens": 7,
    "temperature": 0
}'
```

The output should be similar to the following

```text
{
  "id": "cmpl-1bb34faba88b43f9862cfbfb2200949d",
  "object": "text_completion",
  "created": 1715138766,
  "model": "meta-llama/Meta-Llama-3.1-405B-Instruct",
  "choices": [
    {
      "index": 0,
      "text": " top destination for foodies, with",
      "logprobs": null,
      "finish_reason": "length",
      "stop_reason": null
    }
  ],
  "usage": {
    "prompt_tokens": 5,
    "total_tokens": 12,
    "completion_tokens": 7
  }
}
```

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
