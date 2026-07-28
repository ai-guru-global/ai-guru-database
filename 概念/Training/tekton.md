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
name_zh: "K8s 原生 CI/CD"
---

# Tekton

> 中文简称：K8s 原生 CI/CD

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

## 2026 Tekton 生态现状

| 特性 | 状态 | 说明 |
|------|------|------|
| Pipeline | ✅ | 工作流编排 |
| Task | ✅ | 原子任务 |
| Trigger | ✅ | 事件触发 |
| Dashboard | ✅ | 可视化监控 |
| Hub | ✅ | 任务市场 |
| Chains | ✅ | 供应链安全 |

## 检查清单

- [ ] Pipeline 已定义并测试
- [ ] Task 已复用（Hub）
- [ ] Trigger 已配置
- [ ] 监控已接入（Dashboard）
- [ ] 安全已配置（Chains）
- [ ] 资源限制已设置

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|------|
| Pipeline 失败 | Task 配置错误 | 检查 Task 日志 |
| 资源不足 | 未设置限制 | 配置 resource limits |
| 触发失败 | Trigger 配置错 | 检查 Trigger 绑定 |
| 构建慢 | 未缓存 | 启用缓存 |

## 延伸阅读

- [[概念/Training/kubernetes|Kubernetes]] — K8s 编排
- [[概念/Training/gitops|GitOps]] — Git 运维
- [[概念/MLOps/mlops|MLOps]] — 机器学习运维
- [[概念/MLOps/ci-cd|CI/CD]] — 持续集成/部署
- [[13_运维/02_SRE_Reliability/index|SRE]] — 站点可靠性

> ℹ️ Tekton 是 2026 年云原生 CI/CD 的事实标准，K8s 原生、可扩展、安全，是 MLOps  管道的基础设施。

## Tekton vs 其他 CI/CD 工具

| 工具 | 类型 | K8s 原生 | 可扩展性 | 适用场景 |
|------|------|------|------|------|
| Tekton | 云原生 | ✅ | 高 | K8s MLOps |
| Argo Workflows | 云原生 | ✅ | 高 | 数据管道 |
| Jenkins | 传统 | ❌ | 中 | 传统 CI/CD |
| GitHub Actions | SaaS | ❌ | 中 | 开源项目 |
| GitLab CI | 自托管 | ❌ | 中 | 企业内部 |

## MLOps 管道示例

```yaml
apiVersion: tekton.dev/v1
kind: Pipeline
metadata:
  name: ml-training-pipeline
spec:
  tasks:
    - name: data-validation
      taskRef:
        name: validate-data
    - name: train-model
      taskRef:
        name: train-model
      runAfter: [data-validation]
    - name: evaluate-model
      taskRef:
        name: evaluate-model
      runAfter: [train-model]
    - name: deploy-model
      taskRef:
        name: deploy-model
      runAfter: [evaluate-model]
```

## Tekton 核心组件

| 组件 | 说明 | 用途 |
|------|------|------|
| Task | 最小执行单元 | 定义步骤 |
| Pipeline | 任务编排 | DAG 执行 |
| TaskRun | Task 实例 | 执行记录 |
| PipelineRun | Pipeline 实例 | 执行跟踪 |
| Trigger | 触发器 | 事件驱动 |
