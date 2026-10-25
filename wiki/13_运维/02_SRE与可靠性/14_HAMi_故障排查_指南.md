---
title: "HAMi 问题排查与故障解决指南"
category: "13-ai-ops"
tags: ["hami", "troubleshooting", "gpu-virtualization", "kubernetes", "ops", "debugging", "vgpu"]
summary: "> **一句话理解**: 本文档汇总 HAMi 在生产环境中最常见的安装、调度、隔离、兼容性问题，提供从症状识别、日志定位到修复措施的完整排查路径。"
created: "2026-06-16"
updated: "2026-06-16"
tier: core
aliases:
  - "Hami Troubleshooting Guide"
  - "HAMi Troubleshooting Guide"
  - HAMi_Troubleshooting_Guide
sources: []

name_zh: "HAMi 问题排查与故障解决指南"
---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](治理/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->
# HAMi 问题排查与故障解决指南

> 中文简称：HAMi 问题排查与故障解决指南

> **一句话理解**: 本文档汇总 HAMi 在生产环境中最常见的安装、调度、隔离、兼容性问题，提供从症状识别、日志定位到修复措施的完整排查路径。

---

## 目录

1. [排查总流程](#1-排查总流程)
2. [安装阶段问题](#2-安装阶段问题)
3. [调度阶段问题](#3-调度阶段问题)
4. [隔离与运行时问题](#4-隔离与运行时问题)
5. [兼容性与厂商相关问题](#5-兼容性与厂商相关问题)
6. [升级与回滚问题](#6-升级与回滚问题)
7. [日志与诊断命令速查](#7-日志与诊断命令速查)
8. [常见问题 FAQ](#8-常见问题-faq)
9. [应急处理清单](#9-应急处理清单)

---

## 1. 排查总流程

```
发现问题
    │
    ▼
确认 HAMi 组件状态
  ├── hami-scheduler 是否 Running？
  ├── hami-device-plugin 是否全节点 Ready？
  └── WebUI / Prometheus 是否正常？
    │
    ▼
确认节点状态
  ├── 节点是否打了 gpu=on 标签？
  ├── 节点资源是否显示 nvidia.com/gpu？
  └── 驱动 / container runtime 是否配置正确？
    │
    ▼
查看 Pod 事件与日志
  ├── kubectl describe pod
  ├── kubectl logs hami-scheduler
  └── kubectl logs hami-device-plugin
    │
    ▼
定位根因并修复
```

---

## 2. 安装阶段问题

### 2.1 Helm 安装报错 `chart "hami" not found in hami-charts index`

**症状**：

```text
INSTALLATION ERROR: chart "hami" not found in hami-charts index.
```

**根因**：
- 内网代理转发 Helm 仓库地址时，index.yaml 路径映射错误。
- `helm repo update` 未成功执行。

**排查**：

```bash
helm repo list
helm search repo hami
helm repo update
```

**修复**：

```bash
# 移除旧仓库重新添加
helm repo remove hami-charts
helm repo add hami-charts https://project-hami.github.io/HAMi/
helm repo update
```

若是内网代理，确认代理返回的 `index.yaml` 中 chart URL 可被集群访问。

---

### 2.2 hami-scheduler 或 hami-device-plugin 无法启动

**症状**：

```bash
kubectl get pods -n kube-system | grep hami
# 看到 CrashLoopBackOff 或 Pending
```

**排查步骤**：

```bash
# 查看 scheduler 日志
kubectl logs -n kube-system -l app.kubernetes.io/name=hami-scheduler --previous

# 查看 device-plugin 日志
kubectl logs -n kube-system -l app.kubernetes.io/name=hami-device-plugin --previous

# 查看事件
kubectl describe pod -n kube-system <hami-pod-name>
```

**常见根因**：

| 根因 | 现象 | 修复 |
|------|------|------|
| 镜像拉取失败 | ImagePullBackOff | 检查镜像仓库可达性，配置 imagePullSecrets |
| 权限不足 | RBAC 错误 | 检查 hami-scheduler 的 ClusterRoleBinding |
| 调度器版本不匹配 | scheduler 日志提示版本错误 | 确认 `scheduler.kubeScheduler.imageTag` 与 K8s 版本一致 |
| 节点缺少标签 | device-plugin 未在 GPU 节点运行 | 给节点打 `gpu=on` 标签 |

---

### 2.3 MutatingWebhookConfiguration 配置失败（K8s 1.22+）

**症状**：

K8s 1.22+ 安装旧版本 HAMi 时，Webhook 证书生成 Job 失败。

**根因**：

旧版本 HAMi 使用的 `kube-webhook-certgen` v1.5.2 仍使用已废弃的 `admissionregistration.k8s.io/v1beta1` API，K8s 1.22+ 已移除该 API。

**修复**：

- 升级 HAMi 到最新版本。
- 或临时手动编辑 MutatingWebhookConfiguration 使用 `v1` API。

```bash
helm upgrade hami hami-charts/hami -n kube-system
```

---

## 3. 调度阶段问题

### 3.1 Pod 一直 Pending

**排查命令**：

```bash
kubectl describe pod <pod-name>
```

**常见原因与修复**：

| 原因 | 现象 | 修复 |
|------|------|------|
| 未使用 hami-scheduler | Events 显示 default scheduler | 在 Pod spec 中加上 `schedulerName: hami-scheduler` |
| 节点未打 gpu=on 标签 | 0/3 nodes available: 3 node(s) didn't match Pod's node affinity | `kubectl label nodes <node> gpu=on` |
| 显存请求超过节点容量 | insufficient nvidia.com/gpumem | 减少 `nvidia.com/gpumem` 或换大显存节点 |
| vGPU 数量不足 | insufficient nvidia.com/gpu | 增大 `deviceSplitCount` 或减少请求 |
| 节点选择器冲突 | nodeName 导致绕过 scheduler | 使用 `nodeSelector` 替代 `nodeName` |

> 已知限制：在 Pod 中使用 `nodeName` 字段可能导致 HAMi 调度异常，建议使用 `nodeSelector`。

---

### 3.2 Pod 被调度到没有 GPU 的节点

**排查**：

```bash
kubectl get node <node> --show-labels | grep gpu
kubectl describe node <node> | grep -E "nvidia.com/gpu|Allocatable"
```

**根因**：
- 节点标签错误，HAMi scheduler 误以为该节点有 GPU。
- `devicePlugin.nvidianodeSelector` 配置与节点标签不匹配。

**修复**：

```bash
# 移除错误标签
kubectl label nodes <node> gpu-
# 重新正确标记
kubectl label nodes <gpu-node> gpu=on
```

---

### 3.3 调度策略不生效

**排查**：

```bash
kubectl logs -n kube-system -l app.kubernetes.io/name=hami-scheduler | grep policy
```

**修复**：

确认 `values.yaml` 中策略配置正确并已升级：

```yaml
scheduler:
  defaultSchedulerPolicy:
    nodeSchedulerPolicy: binpack
    gpuSchedulerPolicy: spread
```

```bash
helm upgrade hami hami-charts/hami -f hami-values.yaml -n kube-system
```

---

## 4. 隔离与运行时问题

### 4.1 容器内看到整张 GPU 显存

**症状**：

容器内执行 `nvidia-smi` 显示的是整张卡显存，而不是申请的配额。

**根因**：
- 容器未经过 HAMi 调度器调度（缺少 `schedulerName: hami-scheduler`）。
- HAMi-core（libvgpu.so）未注入容器。
- 容器镜像或运行时未正确加载 LD_PRELOAD。

**排查**：

```bash
# 确认 Pod 使用了 hami-scheduler
kubectl get pod <pod> -o jsonpath='{.spec.schedulerName}'

# 进入容器检查环境变量
kubectl exec -it <pod> -- env | grep -i hami
kubectl exec -it <pod> -- env | grep LD_PRELOAD

# 检查 libvgpu.so 是否存在
kubectl exec -it <pod> -- ls -l /usr/local/vgpu/
```

**修复**：

- 确保 Pod 使用 `schedulerName: hami-scheduler`。
- 重启 Pod。
- 检查 device-plugin 日志是否有 Allocate 失败。

---

### 4.2 显存 OOM

**症状**：

容器内程序报 `CUDA out of memory`，即使申请的显存看起来足够。

**根因**：
- 显存超卖（`deviceMemoryScaling > 1`）导致实际物理显存不足。
- 程序峰值显存超过配额。
- 多个容器共享同一张卡，总用量超过物理上限。

**排查**：

```bash
# 查看该 Pod 实际显存使用
kubectl exec -it <pod> -- nvidia-smi

# 查看 HAMi 监控指标
kubectl port-forward svc/my-hami-webui 3000:3000 -n kube-system
```

**修复**：

```yaml
# 减少超卖倍数或关闭超卖
devicePlugin:
  deviceMemoryScaling: 1.0

# 或增加 Pod 显存申请
resources:
  limits:
    nvidia.com/gpumem: 8192   # 增大配额
```

---

### 4.3 算力隔离不明显，邻居任务互相影响

**症状**：

多个 Pod 共享一张卡时，一个任务跑满 GPU，另一个任务延迟飙升。

**根因**：
- HAMi 软件算力隔离基于 CUDA API 拦截，极端高负载下存在抖动。
- 未设置 `nvidia.com/gpucores`。

**修复**：

```yaml
resources:
  limits:
    nvidia.com/gpu: 1
    nvidia.com/gpumem: 4096
    nvidia.com/gpucores: 50    # 明确限制算力比例
```

对于需要强隔离的关键任务，建议使用 NVIDIA MIG 或独占 GPU。

---

## 5. 兼容性与厂商相关问题

### 5.1 国产芯片未正确识别

**症状**：

节点已安装昇腾/寒武纪/海光驱动，但 HAMi 未注册对应资源。

**排查**：

```bash
# 查看 device-plugin 日志
kubectl logs -n kube-system <hami-device-plugin-pod>

# 确认驱动和设备节点
ls /dev/ | grep -E "davinci|cambricon|kfd"
```

**修复**：

- 确认 HAMi 版本支持该芯片（参考官方支持矩阵）。
- 部分国产芯片仍在持续适配中，需使用最新版本或企业版。
- 检查 device-plugin 启动参数是否开启了对应 backend。

---

### 5.2 与 NVIDIA GPU Operator 冲突

**症状**：

安装 HAMi 后，GPU Operator 管理的 Device Plugin 与 HAMi device-plugin 争抢设备。

**修复**：

- 在 GPU Operator 中禁用默认的 NVIDIA Device Plugin：

```yaml
devicePlugin:
  enabled: false
```

- 保留 GPU Operator 的驱动、Container Toolkit、MIG Manager 组件，由 HAMi 负责共享调度。

---

### 5.3 MIG 模式不支持 single

**症状**：

配置 MIG `single` 模式后 HAMi 无法识别 MIG 实例。

**根因**：

HAMi 当前仅支持 MIG 的 `none` 和 `mixed` 模式。

**修复**：

```yaml
devicePlugin:
  migStrategy: mixed
```

---

## 6. 升级与回滚问题

### 6.1 升级后 device-plugin 环境变量错误

**症状**：

从 v2.3.9 升级后，device-plugin 无法启动，提示 `NodeName` 环境变量找不到。

**根因**：

HAMi 将环境变量从 `NodeName` 改为 `NODE_NAME`，旧版本镜像不兼容。

**修复**：

```bash
# 方案 1：升级到最新版
helm upgrade hami hami-charts/hami -n kube-system

# 方案 2：手动编辑 DaemonSet
kubectl edit daemonset hami-device-plugin -n kube-system
# 将 env 中的 NodeName 改为 NODE_NAME
```

---

### 6.2 升级后业务 Pod 被重启

**根因**：

Device Plugin DaemonSet 默认使用 RollingUpdate，升级时会重启 Pod。

**修复**：

生产环境使用 `OnDelete` 策略，手动控制升级节奏：

```yaml
devicePlugin:
  updateStrategy:
    type: OnDelete
```

---

## 7. 日志与诊断命令速查

### 7.1 查看核心组件日志

```bash
# Scheduler 日志
kubectl logs -n kube-system -l app.kubernetes.io/name=hami-scheduler --tail=500 -f

# Device Plugin 日志
kubectl logs -n kube-system -l app.kubernetes.io/name=hami-device-plugin --tail=500 -f

# 历史日志（崩溃后）
kubectl logs -n kube-system <pod-name> --previous
```

### 7.2 查看节点资源

```bash
kubectl describe node <gpu-node> | grep -A 20 "Allocatable"
kubectl get node <gpu-node> -o jsonpath='{.status.allocatable}' | jq
```

### 7.3 查看 Pod 调度事件

```bash
kubectl describe pod <pod-name> | grep -A 30 Events
```

### 7.4 容器内验证隔离

```bash
# 查看容器内可见显存
kubectl exec -it <pod> -- nvidia-smi

# 查看 HAMi 环境变量
kubectl exec -it <pod> -- env | grep -iE "vgpu|hami|gpu"

# 查看预加载库
kubectl exec -it <pod> -- cat /etc/ld.so.preload
```

---

## 8. 常见问题 FAQ

### Q1: HAMi 和 NVIDIA MIG 有什么区别？

**A**: MIG 是硬件级隔离，稳定性最高但仅 A100/H100/B200 支持且分区固定；HAMi 是软件级虚拟化，支持任意比例切分、多厂商芯片，但高负载下隔离性略弱。

### Q2: 能否和 NVIDIA Device Plugin 共存？

**A**: 不建议共存，会争抢设备。推荐由 HAMi 替代默认 Device Plugin，或与 GPU Operator 配合时禁用其 Device Plugin。

### Q3: `nvidia.com/gpu` 到底表示什么？

**A**: 在 Pod 资源请求中，`nvidia.com/gpu` 表示需要的物理 GPU 数量；在节点可分配资源中，`nvidia.com/gpu` 表示 vGPU 总数（物理卡数 × deviceSplitCount）。

### Q4: 显存超卖安全吗？

**A**: 超卖可提高利用率，但会增加 OOM 风险。建议仅在开发测试环境使用，生产环境谨慎开启并配合监控告警。

### Q5: HAMi 支持 AMD/Intel GPU 吗？

**A**: 路线图中有支持 AMD/Intel GPU 的计划，具体请以官方最新版本支持矩阵为准。

### Q6: 为什么 Pod 里要显式指定 `schedulerName`？

**A**: HAMi 通过 Scheduler Extender 机制工作，需要 Pod 显式使用 `hami-scheduler` 才能触发异构调度逻辑。也可通过 Webhook 自动注入。

### Q7: 如何排查调度器没有参与调度？

**A**: 检查 Pod events 中是否出现 `hami-scheduler` 相关记录；检查 scheduler 日志是否有 Filter/Score/Bind 输出。

### Q8: HAMi 是否支持训练任务？

**A**: 支持，但大规模分布式训练通常建议独占 GPU 或 MIG，HAMi 更适合推理、开发测试和轻量训练。

### Q9: WebUI 看不到数据怎么办？

**A**: 检查 Prometheus 地址配置是否正确，检查 vGPUmonitor 是否正常运行，检查 Prometheus 是否能抓取 HAMi metrics。

### Q10: 如何贡献或获取商业支持？

**A**: 开源问题可到 GitHub Issue 讨论；企业级支持可联系密瓜智能（Dynamia.ai）。

---

## 9. 应急处理清单

| 紧急情况 | 临时处理 | 长期修复 |
|----------|---------|---------|
| HAMi scheduler 全部挂掉 | 手动指定 `schedulerName: default-scheduler` 绕过 HAMi | 排查 scheduler 崩溃根因并修复 |
| Device Plugin 升级导致业务重启 | 将 DaemonSet updateStrategy 改为 OnDelete | 规划维护窗口，灰度升级 |
| 某张卡异常导致任务失败 | 给节点打污点驱逐 Pod | 启用 HAMi 的故障卡隔离功能（v2.7.0+） |
| 显存超卖导致大面积 OOM | 关闭超卖并重启相关 Pod | 重新评估配额与超卖策略 |
| 国产芯片不识别 | 切到整卡独占或 NVIDIA 节点运行 | 升级 HAMi 版本或联系厂商适配 |

---

## Related

- [[概念/hami]] — HAMi 概念卡片
- [[12_架构基建/03_AI技术栈/11_HAMi_深入分析]] — HAMi 深度解析
- [[12_架构基建/README.md]] — HAMi 入门
- [[12_架构基建/03_AI技术栈/12_HAMi_Operation_指南]] — HAMi 运维指南
- [[概念/gpu-virtualization]] — GPU 虚拟化
- [[概念/heterogeneous-gpu]] — 异构 GPU 集群
