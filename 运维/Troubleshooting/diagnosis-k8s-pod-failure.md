---
title: "K8s Pod 故障远程诊断决策树"
tags: [synthesis, kubernetes, troubleshooting, pod-failure, diagnosis, work-order, remote-support, decision-tree]
type: synthesis
created: 2026-07-01
tier: core
aliases:
  - "Pod Failure Diagnosis"
  - "Pod 故障诊断"
  - "CrashLoopBackOff 诊断"
sources: []

---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](治理/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->
# K8s Pod 故障远程诊断决策树

> **核心洞察**：Pod 故障占 K8s 工单的 40%+。远程诊断的关键不是直接修复，而是通过**分层提问 + 指导用户验证**快速收敛根因。80% 的 Pod 故障可以通过 `kubectl describe pod` 的 Events 段和 `kubectl logs` 定位。

---

## 诊断入口：Pod 当前状态是什么？

```
用户报告 "Pod 有问题"
│
├── Pod 状态 = Pending
│   └── → 调度失败，参见 §1
│
├── Pod 状态 = CrashLoopBackOff
│   └── → 容器反复崩溃，参见 §2
│
├── Pod 状态 = ImagePullBackOff / ErrImagePull
│   └── → 镜像拉取失败，参见 §3
│
├── Pod 状态 = OOMKilled (Exit Code 137)
│   └── → 内存不足，参见 §4
│
├── Pod 状态 = Running 但服务不可用
│   └── → 健康检查/就绪探针失败，参见 §5
│
└── Pod 状态 = Evicted
    └── → 节点资源压力，参见 §6
```

---

## §1 Pending — 调度失败

**远程应问用户的澄清问题**：
1. 请执行 `kubectl describe pod <pod-name> -n <namespace>` 并提供 Events 段
2. 集群节点资源是否充足？`kubectl top nodes`
3. 是否有节点 Taint/Toleration 不匹配？

**根因排序（按概率）**：

| # | 根因 | Events 特征 | 指导用户验证 | 处置建议 |
|---|------|------------|-------------|---------|
| 1 | 资源不足 | `Insufficient cpu/memory` | `kubectl top nodes` 查看节点资源 | 扩容节点或降低 Pod requests |
| 2 | Taint/Toleration 不匹配 | `had untolerated taints` | `kubectl get nodes -o custom-columns=NAME:.metadata.name,TAINTS:.spec.taints` | 检查 Toleration 配置或移除 Taint |
| 3 | NodeSelector/Affinity 无匹配节点 | `didn't match Pod's node affinity` | `kubectl get nodes --show-labels` | 调整标签或 Affinity 规则 |
| 4 | ResourceQuota 超限 | `exceeded quota` | `kubectl describe resourcequota -n <ns>` | 申请调整配额 |
| 5 | PVC Pending 导致 | 关联的 PVC 未 Bound | `kubectl get pvc -n <ns>` | 先解决存储问题 |

参见 [[概念/scheduler]]、[[概念/taint]]、[[概念/affinity]]、[[概念/resource-quota]]、[[概念/persistent-volume-claim]]。

---

## §2 CrashLoopBackOff — 容器反复崩溃

**远程应问用户的澄清问题**：
1. 请执行 `kubectl logs <pod-name> -n <namespace> --previous`（注意 `--previous` 看崩溃前的日志）
2. 应用最近是否更新过配置/代码/镜像？
3. 依赖的服务（数据库/Redis/配置中心）是否可达？

**根因排序（按概率）**：

| # | 根因 | 日志特征 | 指导用户验证 | 处置建议 |
|---|------|---------|-------------|---------|
| 1 | 配置错误 | 连接失败、找不到配置 | 检查 [[概念/configmap]]、[[概念/secret]] 是否存在且正确 | 修正配置，`kubectl rollout restart` |
| 2 | 依赖不可达 | connection refused / timeout | `kubectl exec -- nslookup <service>` 验证 DNS | 先修复依赖服务 |
| 3 | 启动命令错误 | `exec format error` / 立即退出 | 检查 Dockerfile ENTRYPOINT/CMD | 修正启动命令 |
| 4 | 权限不足 | `permission denied` | 检查 [[概念/securitycontext]] | 调整 SecurityContext 或 ServiceAccount |
| 5 | 应用 Bug | 异常堆栈 | 分析日志堆栈 | 回滚到上一版本 |

参见 [[Kubernetes_Troubleshooting_Playbook]]、[[概念/deployment]]、[[概念/replicaset]]。

---

## §3 ImagePullBackOff — 镜像拉取失败

**远程应问用户的澄清问题**：
1. 请执行 `kubectl describe pod <pod-name>` 查看 Events 中的具体错误
2. 镜像地址是否正确？Tag 是否存在？
3. 专有云环境中，镜像仓库网络是否可达？

**根因决策**：

| Events 信息 | 根因 | 指导用户验证 | 处置建议 |
|------------|------|-------------|---------|
| `Failed to pull: manifest unknown` | 镜像/Tag 不存在 | 到镜像仓库确认 | 更正镜像地址 |
| `Failed: unauthorized/authentication required` | 镜像仓库认证失败 | 检查 imagePullSecrets | `kubectl create secret docker-registry ...` |
| `Failed: dial tcp i/o timeout` | 网络不可达 | 从节点 `ping`/`curl` 镜像仓库 | 检查网络策略/DNS/代理 |
| `Node ran out of disk` | 节点磁盘满 | `df -h` 在节点上 | 清理镜像 `crictl rmi --prune` |

参见 [[Kubernetes_Troubleshooting_Playbook]]。

---

## §4 OOMKilled — 内存不足

**远程应问用户的澄清问题**：
1. Pod 的 `resources.limits.memory` 设置了多少？
2. 应用实际内存使用量是多少？`kubectl top pod <pod-name>`
3. 是稳定 OOM 还是逐渐增长（内存泄漏）？

**诊断决策**：

```
OOMKilled (Exit 137)
│
├── limits.memory 设置过低
│   └── → 建议调高 limits，观察是否复现
│
├── 内存泄漏（使用量持续增长）
│   └── → 需要应用层排查，临时重启策略
│   └── 参见 GPU OOM 区分: [[GPU_OOM_Troubleshooting_Guide]]
│
├── AI/LLM 工作负载 OOM
│   ├── GPU OOM (CUDA OOM) → 参见 [[GPU_OOM_Troubleshooting_Guide]]
│   ├── 模型加载 OOM → 检查 batch size / 模型大小
│   └── HAMi vGPU 超卖 → 参见 [[HAMi_Troubleshooting_Guide]]
│
└── 节点内存压力导致 Evict
    └── → 检查节点 Memory Available
```

参见 [[概念/gpu-oom]]、[[概念/limit-range]]、[[概念/horizontal-pod-autoscaler]]。

---

## §5 Running 但服务不可用 — 探针失败

**远程应问用户的澄清问题**：
1. Readiness Probe 是否失败？`kubectl describe pod` 的 Events
2. 应用日志中是否有健康检查端点的错误？
3. Service 是否正确关联到 Pod？`kubectl get endpoints`

**根因排序**：

| # | 根因 | 验证方法 | 处置建议 |
|---|------|---------|---------|
| 1 | Readiness Probe 配置错误 | 检查路径/端口/超时 | 调整 Probe 参数 |
| 2 | 应用启动慢，Probe 太早 | Events 显示 `readiness probe failed` 后恢复 | 增加 initialDelaySeconds |
| 3 | Endpoints 为空 | `kubectl get ep <service>` | 检查 label selector 匹配 |
| 4 | 应用内部错误 | 查看应用日志 | 修复应用 Bug |

参见 [[概念/service]]、[[概念/selector]]、[[概念/label]]。

---

## §6 Evicted — 节点驱逐

**根因**：节点资源压力（磁盘压力 / 内存压力 / PID 压力）。

**远程指导**：
1. 检查节点状态：`kubectl describe node <node-name>` 查看 Conditions
2. 如果是 DiskPressure：清理节点上的无用镜像和日志
3. 如果是 MemoryPressure：检查是否有异常 Pod 占用大量内存
4. Evicted Pod 不会自动恢复，需要删除：`kubectl delete pod <pod-name>`

参见 [[概念/node]]、[[概念/pod-disruption-budget]]。

---

## 远程诊断安全护栏

| 操作 | 风险等级 | 远程建议方式 |
|------|---------|------------|
| 查看 describe/logs/top | 🟢 只读 | 直接建议用户执行 |
| `kubectl rollout restart` | 🟡 低危变更 | 确认无误后建议执行 |
| `kubectl delete pod` | 🟡 低危变更 | 提醒 Deployment 会自动重建 |
| 调整 resources limits | 🟠 中危变更 | 建议在测试环境验证后执行 |
| 修改 ResourceQuota / SecurityContext | 🔴 高危变更 | 建议走正式变更流程审批 |

---

## Related

- [[Kubernetes_Troubleshooting_Playbook]] — K8s 排障完整手册
- [[Kubernetes_Core_Components_Deep_Dive]] — K8s 核心组件深度解析
- [[K8s_AI_Troubleshooting_Cheat_Sheet]] — AI 工作负载排障速查表
- [[GPU_OOM_Troubleshooting_Guide]] — GPU OOM 专项排障
- [[Alibaba_Cloud_Proprietary_K8s_Context]] — 专有云 K8s 上下文
- [[概念/pod]] — Pod 概念
- [[概念/deployment]] — Deployment 概念
- [[LLM_Fine_Tuning_Job_Failure_Runbook_on_K8s]] — LLM 训练失败 Runbook
- [[LLM_Inference_Slow_Unavailable_Runbook]] — LLM 推理排障 Runbook
