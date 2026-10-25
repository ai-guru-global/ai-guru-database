---
title: "Job"
category: -concepts
tags: ["kubernetes", "k8s", "batch-workload", "cloud-native", "alibaba-cloud"]
summary: "Kubernetes Job 控制器用于运行一次性、可完成的批处理任务，确保指定数量的 Pod 成功执行到终止状态，适用于数据迁移、模型训练初始化、定时任务等场景。"
created: 2026-06-26
updated: 2026-07-21
tier: supporting
lifecycle: reviewed
aliases:
  - "Job"
  - "K8s Job"
  - "批处理任务"
relationships:
  - target: "概念/kubernetes"
    type: related_to
  - target: "概念/cronjob"
    type: related_to
  - target: "概念/pod"
    type: part_of
sources: []
name_zh: "K8s 批处理任务"
---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](治理/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->

# Job

> 中文简称：K8s 批处理任务

> **一句话理解**: Job 是 Kubernetes 中负责把「跑一次就结束」的批处理任务可靠地跑完的调度器——Pod 成功退出即算完成，失败则按策略重试。

## 核心要点

- **一次性批处理**: Job 用于运行可完成的离线任务，与 Deployment 这类长期运行服务不同，它的目标是「完成」而非「持续保持运行」。
- **完成与成功计数**: 通过 `completions` 指定需要成功结束的 Pod 数量，`parallelism` 控制同时运行的 Pod 数量。
- **重试策略**: `backoffLimit` 定义失败后的重试次数；`restartPolicy` 通常设为 `Never` 或 `OnFailure`，避免容器无限重启。
- **任务状态追踪**: Job 会维护 `succeeded` / `failed` 计数，完成后对象保留，便于查看日志和审计执行结果。
- **自动清理**: 可设置 `ttlSecondsAfterFinished` 让完成后的 Job 和 Pod 自动回收，避免历史任务堆积。
- **固定名称与幂等**: Job 创建的 Pod 名称带随机后缀；若需要幂等执行（如避免重复迁移），应在应用层或 CronJob 中控制。

## 典型 YAML / 命令示例

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: data-migration
  namespace: default
spec:
  completions: 1
  parallelism: 1
  backoffLimit: 3
  ttlSecondsAfterFinished: 86400
  template:
    spec:
      restartPolicy: OnFailure
      containers:
        - name: migrate
          image: registry-vpc.cn-beijing.aliyuncs.com/demo/migrate-tool:v1.2
          command: ["python", "/app/run_migration.py"]
          resources:
            requests:
              memory: "512Mi"
              cpu: "500m"
            limits:
              memory: "2Gi"
              cpu: "2"
```

```bash
# 创建 Job
kubectl apply -f job.yaml

# 查看 Job 状态
kubectl get jobs -w

# 查看 Job 对应 Pod 日志
kubectl logs -l job-name=data-migration

# 删除 Job（级联删除其 Pod）
kubectl delete job data-migration  # ⚠️ HIGH-RISK — 删除 K8s 资源，服务可能中断 [回滚：见文档/备份]
```

## 常见场景

| 场景 | 说明 | 关键参数 |
|------|------|----------|
| 数据迁移 / ETL | 一次性导入、清洗、转换数据 | `completions=1`, `parallelism=1` |
| 模型训练初始化 | 下载预训练权重、准备数据集 | initContainers + Job |
| 批量推理 | 将样本切分为多个 Pod 并行处理 | `parallelism=N`, `completions=N` |
| 定时任务 | 周期性执行运维或业务脚本 | 配合 CronJob 使用 |
| 集群运维脚本 | 备份、校验、证书轮转 | `ttlSecondsAfterFinished` 自动清理 |

## 阿里云专有云关联

在阿里云专有云（Apsara Stack）ACK 敏捷版或专有版中，Job 常用于天基（Tianji）运维脚本、盘古（Pangu）存储数据迁移、女娲（Nüwa）调度任务初始化以及 ASCM 控制台后台批处理作业。由于专有云通常对接 X-Dragon 神龙裸金属与洛神（Luoshen）网络，批量 Job 在调度时需关注节点亲和性、持久化存储和日志落盘策略；建议通过 ACK 提供的日志服务或 SLS 进行统一采集，并结合 `ttlSecondsAfterFinished` 控制历史对象规模。

## Related

- [[概念/kubernetes|Kubernetes]] — 容器编排平台
- [[概念/cronjob|CronJob]] — 基于 Job 的定时任务
- [[概念/pod|Pod]] — Job 调度的基本单元
- [[概念/deployment|Deployment]] — 长期运行服务
- [[概念/kueue|Kueue]] — 作业队列调度
- [[概念/volcano|Volcano]] — 批处理调度器

---

## 2026 Job 最佳实践

| 场景 | 配置 | 说明 |
|------|------|------|
| 数据迁移 | completions=1 | 一次性任务 |
| 批量推理 | parallelism=N | 并行处理 |
| 定时任务 | CronJob | 周期性执行 |

## 生产最佳实践

1. **设置重试**：配置 backoffLimit 处理临时失败
2. **自动清理**：使用 ttlSecondsAfterFinished 清理历史 Job
3. **资源限制**：设置合理的 requests/limits
4. **日志采集**：配置日志持久化，便于事后排查

## Job 完成模式

| 模式 | 说明 | 适用场景 |
|------|------|------|
| NonIndexed | 任意 Pod 完成 | 并行任务 |
| Indexed | 每个索引完成 | 分片任务 |

## Job 重启策略

| 策略 | 说明 |
|------|------|
| OnFailure | 失败时重启容器 |
| Never | 失败时创建新 Pod |

## Job 配置示例

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: training-job
spec:
  completions: 1
  parallelism: 1
  backoffLimit: 3
  ttlSecondsAfterFinished: 3600
  template:
    spec:
      containers:
      - name: trainer
        image: pytorch/pytorch:2.0-cuda11.8
        command: ["python", "train.py"]
        resources:
          limits:
            nvidia.com/gpu: 1
            memory: 16Gi
      restartPolicy: Never
```

## AI 训练 Job 模式

| 模式 | 说明 | 适用场景 |
|------|------|------|
| 单卡训练 | 1 GPU | 小模型/调试 |
| 多卡并行 | N GPU | 分布式训练 |
| PyTorchJob | Kubeflow | PyTorch 训练 |
| MPIJob | Kubeflow | MPI 训练 |

## Job 状态监控

| 状态 | 说明 |
|------|------|
| Active | 运行中 |
| Succeeded | 成功完成 |
| Failed | 失败 |
| Suspended | 已暂停 |

## 常用命令

| 命令 | 用途 |
|------|------|
| `kubectl get jobs` | 查看 Job |
| `kubectl describe job <name>` | Job 详情 |
| `kubectl logs job/<name>` | 查看日志 |
| `kubectl delete job <name>` | 删除 Job |

> 💡 Job 是 K8s 一次性任务的标准方案，2026 年 AI 训练推荐 Job + GPU + ttlSecondsAfterFinished 自动清理。

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|------|
| Job 一直运行 | 容器未退出 | 检查命令是否正确 |
| Job 失败重试 | backoffLimit 达到 | 检查日志定位问题 |
| GPU 不可用 | 资源未配置 | 检查 limits 配置 |
| 清理失败 | TTL 未配置 | 添加 ttlSecondsAfterFinished |

