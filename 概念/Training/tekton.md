---
title: "Tekton"
category: -concepts
tags: ["kubernetes", "k8s", "cicd", "devops", "cloud-native", "pipeline", "mlops"]
summary: "Tekton 是 CNCF 孵化的 K8s 原生 CI/CD 框架，所有流水线资源都是 CRD，可在任意 K8s 集群上运行构建、测试、部署任务。"
created: 2026-06-26
updated: 2026-07-21
tier: supporting
aliases:
  - "Tekton Pipelines"
  - "K8s 原生 CI/CD"
relationships:
  - target: "概念/Training/kubernetes"
    type: related_to
  - target: "概念/Training/argocd"
    type: related_to
  - target: "概念/Training/gitops"
    type: related_to
sources:
  - "https://tekton.dev/"
---

# Tekton

> **一句话理解**: Tekton 是把 CI/CD 流水线也做成 K8s 资源的框架，任务在 Pod 里跑，天然具备弹性、隔离和可观测性。

## 核心架构

```
Tekton 架构:

Trigger (Webhook/定时) → PipelineRun → Pipeline
                                          ├─ Task A (Pod)
                                          │   ├─ Step 1 (Container)
                                          │   └─ Step 2 (Container)
                                          ├─ Task B (Pod)
                                          └─ Task C (Pod)

Workspace (PVC/EmptyDir) ← 跨 Task 共享数据
```

## 核心 CRD

| CRD | 作用 | 类比 |
|-----|------|------|
| `Task` | 可复用的最小执行单元 | Jenkins Step |
| `TaskRun` | Task 的一次执行实例 | Jenkins Build Step |
| `Pipeline` | 多个 Task 组成的流水线 | Jenkins Pipeline |
| `PipelineRun` | Pipeline 的一次执行实例 | Jenkins Build |
| `Trigger` | 基于 Webhook 触发流水线 | GitHub Webhook |
| `Workspace` | 跨 Task 共享数据 | 共享工作空间 |

## Tekton vs Jenkins vs GitHub Actions

| 维度 | Tekton | Jenkins | GitHub Actions |
|------|--------|---------|---------------|
| 架构 | K8s CRD | 单体 Java | SaaS / Runner |
| 隔离性 | Pod 级 | 无/容器插件 | 容器级 |
| 扩展性 | K8s 原生弹性 | 手动加 Agent | 自动 |
| 可观测 | K8s 日志/事件 | 插件 | 内置 |
| 学习曲线 | 陡 (K8s 知识) | 中 | 低 |
| 适用 | K8s 原生团队 | 传统企业 | 开源项目 |
| MLOps | 可组合 ML 流水线 | 插件有限 | 有限 |

## Tekton 在 MLOps 中的角色

| 场景 | Tekton 实现 |
|------|----------|
| 数据预处理 | Task: 数据清洗/标注/分片 |
| 模型训练 | Task: 提交分布式训练 Job |
| 模型评估 | Task: 跑 benchmark、生成报告 |
| 模型部署 | Task: 构建镜像、更新 Serving |
| 定时重训 | Trigger: CronTrigger |

## 示例: 模型训练 Pipeline

```yaml
apiVersion: tekton.dev/v1
kind: Pipeline
metadata:
  name: ml-training-pipeline
spec:
  workspaces:
    - name: shared-data
  tasks:
    - name: data-prep
      taskRef:
        name: data-preprocessing
      workspaces:
        - name: data
          workspace: shared-data
    - name: train
      runAfter: [data-prep]
      taskRef:
        name: pytorch-training
      params:
        - name: model
          value: "qwen2.5-7b"
        - name: epochs
          value: "3"
      workspaces:
        - name: data
          workspace: shared-data
    - name: evaluate
      runAfter: [train]
      taskRef:
        name: model-evaluation
```

## 生产最佳实践

1. **Task 复用**: 使用 Tekton Hub 的社区 Task，避免重复造轮子
2. **资源限制**: 每个 Task 设置 resource requests/limits，避免资源争抢
3. **超时设置**: TaskRun 设置 `timeout`，避免任务挂死
4. **日志收集**: 配合 EFK/Loki 收集 Pod 日志
5. **镜像缓存**: 使用本地镜像仓库加速 Step 容器拉取
6. **安全**: 使用 ServiceAccount 限制 Task 权限，避免特权容器

## 阿里云专有云关联

在阿里云专有云环境中，Tekton 可部署在 ACK 敏捷版/专有版集群内，作为私有化 CI 引擎替代 Jenkins。工单中「构建任务失败」时，检查 TaskRun Pod 日志、Workspace PVC 绑定、以及镜像仓库访问权限。

## Related

- [[概念/Training/argocd|ArgoCD]]
- [[概念/Training/flux|Flux]]
- [[概念/Training/gitops|GitOps]]
- [[概念/Training/kubernetes|Kubernetes]]
