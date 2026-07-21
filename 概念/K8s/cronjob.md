---
title: "CronJob"
category: -concepts
tags: ["kubernetes", "k8s", "cronjob", "batch", "job", "scheduling", "cloud-native", "alibaba-cloud"]
summary: "Kubernetes CronJob 基于 cron 表达式周期性地创建 Job，用于定时备份、清理、报表等批处理任务，是 K8s 工作负载对象之一。"
created: 2026-06-26
updated: 2026-07-21
tier: supporting
aliases:
  - "CronJob"
  - "K8s CronJob"
relationships:
  - target: "概念/kubernetes"
    type: related_to
  - target: "概念/job"
    type: part_of
  - target: "概念/pod"
    type: related_to
sources: []
---

# CronJob

> **一句话理解**: CronJob 是 K8s 里的「定时器」——按照 cron 表达式周期性地创建 Job，让批处理任务到点就跑。

## 核心要点

- **是什么**: CronJob 是 Kubernetes 的一种工作负载资源，基于 cron 语法周期性地创建 [[概念/job|Job]]，再由 Job 创建 [[概念/pod|Pod]] 执行任务。
- **为什么需要**: 不需要在集群外单独维护 crontab 或外部调度器，调度、重试、历史保留、并发控制都能通过声明式 YAML 管理。
- **关键字段**:
  - `schedule`: cron 表达式（如 `0 2 * * *` 每天凌晨 2 点）。
  - `jobTemplate`: 定义每次生成的 Job 模板。
  - `concurrencyPolicy`: `Allow` / `Forbid` / `Replace`，控制上次 Job 未跑完时是否启动新 Job。
  - `startingDeadlineSeconds`: 错过调度后仍允许启动的截止秒数。
  - `successfulJobHistoryLimit` / `failedJobHistoryLimit`: 保留成功/失败 Job 的历史数量，避免资源堆积。
  - `suspend`: 暂停 CronJob，停止创建新 Job。
- **调度可靠性**: CronJob 由 kube-controller-manager 的 CronJob Controller 负责解析 cron 表达式并触发 Job；在 K8s 1.21+ 中 CronJob 升级到 v1 稳定版，控制器更可靠。
- **适用任务类型**: 数据备份、日志/镜像清理、定时报表、批量 ETL、模型评估/重训触发、证书轮转等。

## 典型 YAML / 命令示例

### 基础 CronJob YAML

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: nightly-backup
  namespace: default
spec:
  schedule: "0 2 * * *"          # 每天凌晨 2 点
  concurrencyPolicy: Forbid      # 上次未跑完则跳过
  startingDeadlineSeconds: 3600  # 允许延迟 1 小时内补跑
  successfulJobHistoryLimit: 3
  failedJobHistoryLimit: 3
  suspend: false
  jobTemplate:
    spec:
      activeDeadlineSeconds: 7200  # Job 最多跑 2 小时
      backoffLimit: 2              # 失败重试 2 次
      template:
        spec:
          restartPolicy: OnFailure
          containers:
            - name: backup
              image: registry.example.com/backup-tool:v1.2
              command:
                - /bin/sh
                - -c
                - /app/backup.sh
              resources:
                requests:
                  cpu: "100m"
                  memory: "128Mi"
                limits:
                  cpu: "500m"
                  memory: "512Mi"
```

### 常用 kubectl 命令

```bash
# 创建/更新 CronJob
kubectl apply -f cronjob.yaml

# 查看 CronJob 列表
kubectl get cronjobs -A

# 查看最近一次创建的 Job
kubectl get jobs --selector=job-name=nightly-backup-xxx

# 手动触发一次（K8s 1.21+）
kubectl create job --from=cronjob/nightly-backup manual-backup-$(date +%s)

# 暂停 CronJob
kubectl patch cronjob nightly-backup -p '{"spec":{"suspend":true}}'

# 查看调度与事件
kubectl describe cronjob nightly-backup
```

## 常见场景

| 场景 | schedule 示例 | 关键配置 |
|------|---------------|----------|
| **数据库定时备份** | `0 2 * * *` | `concurrencyPolicy: Forbid`，挂载 PVC 存储备份 |
| **日志/临时文件清理** | `0 3 * * 0` | `restartPolicy: OnFailure`，低资源限制 |
| **周期性报表生成** | `0 9 * * 1` | 挂载 ConfigMap/Secret 获取数据库连接信息 |
| **模型批量评估** | `0 */6 * * *` | `backoffLimit: 1`，失败不重跑避免脏数据 |
| **证书/密钥轮转** | `0 0 1 * *` | RBAC 最小权限 ServiceAccount |
| **开发/测试环境定时启停** | `0 18 * * 1-5` | `suspend` 配合外部自动化开关 |

## 阿里云专有云关联

在阿里云专有云（Apsara Stack）的 [[概念/ack|ACK]] 专有版/敏捷版集群中，CronJob 作为标准 Batch Workload 直接可用，kube-controller-manager 由 Tianji/Luoshen 统一运维托管。对于金融、政企等多租户场景，可通过 ASCM 进行命名空间级权限隔离，并将定时备份、镜像清理等 CronJob 任务与 Pangu 分布式存储或 OSS 对接。如果 CronJob 产生大量 Job 历史记录，建议设置合理的 `successfulJobHistoryLimit` 与 `failedJobHistoryLimit`，避免 etcd 对象过多影响 APIServer 性能。

## 选型对比

| 调度方式 | 优点 | 缺点 | 适用场景 |
|----------|------|------|----------|
| **CronJob** | 原生 K8s、声明式、与 Pod/Job 生命周期一致 | 只适合「到点触发」的批处理，不适合复杂依赖 | K8s 内定时任务 |
| **Linux crontab** | 简单、无需 K8s | 无高可用、无统一日志/监控、资源难隔离 | 单台 VM 小规模任务 |
| **外部调度器（Airflow/DolphinScheduler）** | 支持依赖、重跑、告警 | 组件多、复杂度高 | 复杂 ETL/数据 pipeline |
| **Event-driven（KEDA Cron Scaler）** | 可触发 Deployment/Job 扩缩 | 需额外组件 | 与事件驱动结合的场景 |

## Related

- [[概念/job]] — Job（CronJob 创建的子对象）
- [[概念/pod]] — Pod
- [[概念/deployment]] — Deployment
- [[概念/kubernetes]] — Kubernetes
- [[概念/kubectl]] — kubectl
- [[概念/ack]] — 阿里云容器服务 ACK

---

## 2026 CronJob 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **CronJob v1 稳定版** | K8s 1.21+ 升级至 batch/v1，控制器更可靠 | GA |
| **KEDA Cron Scaler** | 事件驱动扩缩，可触发 Deployment/Job 而非仅创建 Job | GA |
| **Argo Workflows** | 复杂 DAG 依赖的定时工作流，替代简单 CronJob | GA |
| **kubectl create job --from** | 手动触发一次 CronJob，调试利器 | GA |
| **TimeZone 支持** | K8s 1.27+ CronJob 原生支持指定时区 | GA |

## 生产最佳实践

1. **并发控制**：生产环境设置 `concurrencyPolicy: Forbid`，避免任务重叠导致数据冲突
2. **历史清理**：设置合理的 `successfulJobHistoryLimit`/`failedJobHistoryLimit`，避免 etcd 对象堆积
3. **资源限制必配**：为 CronJob Pod 配置 requests/limits，防止定时任务耗尽节点资源
4. **超时保护**：设置 `activeDeadlineSeconds` 和 `startingDeadlineSeconds`，避免任务无限挂起
5. **监控告警**：对 CronJob 的 Job 失败率、执行时长设置告警，及时发现定时任务异常
