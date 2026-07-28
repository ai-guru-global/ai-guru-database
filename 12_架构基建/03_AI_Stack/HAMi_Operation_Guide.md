---
title: "HAMi 运维指南: 安装、配置、升级与监控"
category: "12-architecture-infrastructure"
tags: ["hami", "gpu-virtualization", "kubernetes", "operations", "helm", "monitoring", "prometheus", "vgpu"]
summary: "> **一句话理解**: 本文档覆盖 HAMi 在生产环境中的完整运维路径——从 Helm 安装、节点标签、调度策略配置，到升级、监控、告警、WebUI 部署与日常排障前置检查。"
created: "2026-06-16"
updated: "2026-06-16"
tier: supporting
aliases:
  - "Hami Operation Guide"
  - "HAMi Operation Guide"
  - HAMi_Operation_Guide
sources: []

name_zh: "HAMi 运维指南: 安装、配置、升级与监控"
---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](治理/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->
# HAMi 运维指南：安装、配置、升级与监控

> 中文简称：HAMi 运维指南: 安装、配置、升级与监控

> **一句话理解**: 本文档覆盖 HAMi 在生产环境中的完整运维路径——从 Helm 安装、节点标签、调度策略配置，到升级、监控、告警、WebUI 部署与日常排障前置检查。

---

## 目录

1. [前置条件](#1-前置条件)
2. [Helm 安装](#2-helm-安装)
3. [节点标签与设备发现](#3-节点标签与设备发现)
4. [核心参数配置](#4-核心参数配置)
5. [常用工作负载示例](#5-常用工作负载示例)
6. [升级与回滚](#6-升级与回滚)
7. [监控与告警](#7-监控与告警)
8. [HAMi WebUI 部署](#8-hami-webui-部署)
9. [高可用与生产建议](#9-高可用与生产建议)
10. [卸载](#10-卸载)
11. [附录：values.yaml 关键参数速查](#11-附录valuesyaml-关键参数速查)

---

## 1. 前置条件

### 1.1 集群要求

| 项 | 要求 |
|----|------|
| Kubernetes | 1.22+（DRA 模式需 1.34+） |
| Helm | 3.x |
| 容器运行时 | containerd / Docker（需配置 nvidia-container-runtime） |
| GPU 驱动 | 已安装对应厂商驱动 |
| 网络 | 节点可访问 HAMi Helm 仓库或已配置私有仓库代理 |

### 1.2 NVIDIA 节点准备

在所有 NVIDIA GPU 节点上执行：

```bash
# 安装 nvidia-container-toolkit（Ubuntu/Debian 示例）
curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey | \
  sudo gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg

curl -s -L https://nvidia.github.io/libnvidia-container/stable/deb/nvidia-container-toolkit.list | \
  sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' | \
  sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list

sudo apt-get update
sudo apt-get install -y nvidia-container-toolkit

# 配置 containerd 使用 nvidia-container-runtime
sudo nvidia-ctk runtime configure --runtime=containerd
sudo systemctl restart containerd
```

### 1.3 验证运行时

```bash
kubectl get nodes -o wide
# 确认 GPU 节点 Ready，且 containerd 配置正确
```

---

## 2. Helm 安装

### 2.1 添加仓库

```bash
helm repo add hami-charts https://project-hami.github.io/HAMi/
helm repo update
```

### 2.2 最小化安装

```bash
export K8S_VERSION=$(kubectl version --output=json | jq -r '.serverVersion.gitVersion' | sed 's/v\([0-9]*\.[0-9]*\).*/\1/')

helm install hami hami-charts/hami \
  --set scheduler.kubeScheduler.imageTag=v${K8S_VERSION}.0 \
  -n kube-system
```

### 2.3 生产化安装（推荐）

```bash
cat > hami-values.yaml <<EOF
scheduler:
  replicas: 2
  leaderElect: true
  defaultSchedulerPolicy:
    nodeSchedulerPolicy: binpack
    gpuSchedulerPolicy: spread

devicePlugin:
  deviceSplitCount: 10
  updateStrategy:
    type: OnDelete
  nvidianodeSelector:
    gpu: "on"

resources:
  limits:
    cpu: "2000m"
    memory: "2Gi"
  requests:
    cpu: "500m"
    memory: "512Mi"
EOF

helm install hami hami-charts/hami \
  -f hami-values.yaml \
  --set scheduler.kubeScheduler.imageTag=v${K8S_VERSION}.0 \
  -n kube-system
```

### 2.4 验证安装

```bash
# 检查核心 Pod
kubectl get pods -n kube-system | grep hami

# 期望输出类似：
# hami-device-plugin-xxxx   1/1   Running
# hami-scheduler-xxxx       1/1   Running

# 检查节点资源
kubectl describe node <gpu-node> | grep -A 5 "Allocated resources"
# 应能看到 nvidia.com/gpu 资源数量 = 物理卡数 × deviceSplitCount
```

---

## 3. 节点标签与设备发现

### 3.1 必备标签

```bash
kubectl label nodes <node-name> gpu=on
```

只有带 `gpu=on` 标签的节点才会被 HAMi scheduler 管理。

### 3.2 按厂商标签（可选）

```bash
# NVIDIA 节点
kubectl label nodes <node-name> accelerator=nvidia

# 国产芯片节点
kubectl label nodes <node-name> accelerator=ascend
kubectl label nodes <node-name> accelerator=mlu
```

### 3.3 查看节点设备容量

```bash
kubectl get node <gpu-node> -o jsonpath='{.status.capacity}' | jq
```

HAMi 安装后，节点会新增以下可分配资源：

- `nvidia.com/gpu`：vGPU 数量
- `nvidia.com/gpumem`：总可分配显存（MiB）
- `nvidia.com/gpucores`：总可分配算力百分比

---

## 4. 核心参数配置

### 4.1 切分粒度

```yaml
devicePlugin:
  deviceSplitCount: 10   # 每张物理卡切成 10 个 vGPU
```

影响：
- `deviceSplitCount` 越大，节点注册 `nvidia.com/gpu` 越多，调度粒度越细。
- 但过多 vGPU 会增加 scheduler 和设备插件压力，建议生产环境 5-10。

### 4.2 调度策略

```yaml
scheduler:
  defaultSchedulerPolicy:
    nodeSchedulerPolicy: binpack   # 节点层面：集中
    gpuSchedulerPolicy: spread     # GPU 层面：分散
```

| 组合 | 效果 |
|------|------|
| `binpack` + `binpack` | 最大化单卡/单节点利用率 |
| `spread` + `spread` | 最大化分散，降低热点 |
| `binpack` + `spread` | 节点集中、卡内分散（推荐） |

### 4.3 MIG 策略

```yaml
devicePlugin:
  migStrategy: mixed   # none | mixed
```

### 4.4 显存超卖

```yaml
devicePlugin:
  deviceMemoryScaling: 1.5   # 显存超卖倍数
```

> 超卖会提高利用率，但会增加 OOM 风险，需谨慎开启。

---

## 5. 常用工作负载示例

### 5.1 基础 vGPU Pod

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: gpu-test
spec:
  schedulerName: hami-scheduler
  containers:
    - name: cuda
      image: nvidia/cuda:12.0-base-ubuntu22.04
      command: ["sleep", "86400"]
      resources:
        limits:
          nvidia.com/gpu: 1
          nvidia.com/gpumem: 4096
          nvidia.com/gpucores: 50
```

### 5.2 vLLM 推理服务

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: vllm-hami
spec:
  replicas: 3
  selector:
    matchLabels:
      app: vllm-hami
  template:
    metadata:
      labels:
        app: vllm-hami
    spec:
      schedulerName: hami-scheduler
      containers:
        - name: vllm
          image: vllm/vllm-openai:latest
          args:
            - --model
            - meta-llama/Llama-2-7b-hf
          resources:
            limits:
              nvidia.com/gpu: 1
              nvidia.com/gpumem: 8192
              nvidia.com/gpucores: 70
```

### 5.3 Jupyter 开发环境

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: jupyter-hami
spec:
  schedulerName: hami-scheduler
  containers:
    - name: jupyter
      image: jupyter/tensorflow-notebook:latest
      resources:
        limits:
          nvidia.com/gpu: 1
          nvidia.com/gpumem: 4096
```

---

## 6. 升级与回滚

### 6.1 升级

```bash
helm repo update
helm upgrade hami hami-charts/hami \
  -f hami-values.yaml \
  --set scheduler.kubeScheduler.imageTag=v${K8S_VERSION}.0 \
  -n kube-system
```

### 6.2 滚动升级注意事项

- 生产环境建议设置 `devicePlugin.updateStrategy.type: OnDelete`，避免业务 Pod 因 Device Plugin DaemonSet 滚动而意外重启。
- 升级前备份 `values.yaml`。
- 升级后验证 `hami-scheduler` 和 `hami-device-plugin` 均 Running。

### 6.3 回滚

```bash
helm rollback hami -n kube-system
```

---

## 7. 监控与告警

### 7.1 Prometheus 指标

HAMi 暴露的关键指标：

| 指标 | 说明 |
|------|------|
| `hami_vgpu_memory_used_bytes` | 容器已用显存 |
| `hami_vgpu_memory_limit_bytes` | 容器显存限额 |
| `hami_vgpu_utilization` | 容器 GPU 利用率 |
| `hami_vgpu_core_limit` | 容器算力限额 |
| `hami_node_gpu_total` | 节点 GPU 总数 |
| `hami_node_gpu_allocated` | 节点已分配 GPU 数 |

### 7.2 推荐告警规则

```yaml
groups:
  - name: hami
    rules:
      - alert: HAMiVGPUMemoryHigh
        expr: hami_vgpu_memory_used_bytes / hami_vgpu_memory_limit_bytes > 0.9
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "HAMi vGPU 显存使用率超过 90%"

      - alert: HAMiSchedulerDown
        expr: kube_deployment_status_replicas_available{deployment="hami-scheduler"} < 1
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "HAMi Scheduler 不可用"

      - alert: HAMiDevicePluginNotReady
        expr: kube_daemonset_status_number_ready{daemonset="hami-device-plugin"} < kube_daemonset_status_desired_number_scheduled{daemonset="hami-device-plugin"}
        for: 2m
        labels:
          severity: warning
        annotations:
          summary: "HAMi Device Plugin 未全部就绪"
```

---

## 8. HAMi WebUI 部署

### 8.1 前置条件

- HAMi >= 2.4.0
- Prometheus >= 2.8.0
- Helm >= 3.0

### 8.2 安装

```bash
helm repo add hami-webui https://project-hami.github.io/HAMi-WebUI
helm repo update

helm install my-hami-webui hami-webui/hami-webui \
  --set externalPrometheus.enabled=true \
  --set externalPrometheus.address="http://prometheus-kube-prometheus-prometheus.monitoring.svc.cluster.local:9090" \
  -n kube-system
```

### 8.3 访问

```bash
kubectl port-forward service/my-hami-webui 3000:3000 -n kube-system
```

浏览器访问 `http://localhost:3000`。

---

## 9. 高可用与生产建议

### 9.1 Scheduler 高可用

```yaml
scheduler:
  replicas: 3
  leaderElect: true
```

### 9.2 Device Plugin 安全升级

```yaml
devicePlugin:
  updateStrategy:
    type: OnDelete
```

### 9.3 资源预留

```yaml
resources:
  limits:
    cpu: "2000m"
    memory: "2Gi"
```

### 9.4 审计与日志

```bash
# 查看 scheduler 日志
kubectl logs -n kube-system -l app.kubernetes.io/name=hami-scheduler --tail=200 -f

# 查看 device-plugin 日志
kubectl logs -n kube-system -l app.kubernetes.io/name=hami-device-plugin --tail=200 -f
```

---

## 10. 卸载

```bash
helm uninstall hami -n kube-system
```

卸载后，节点上残留的 `nvidia.com/gpu` 等资源可能需要重启 kubelet 才能完全清除。

---

## 11. 附录：values.yaml 关键参数速查

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `scheduler.replicas` | int | 1 | scheduler 副本数 |
| `scheduler.leaderElect` | bool | false | 是否启用 leader 选举 |
| `scheduler.defaultSchedulerPolicy.nodeSchedulerPolicy` | string | binpack | 节点调度策略 |
| `scheduler.defaultSchedulerPolicy.gpuSchedulerPolicy` | string | spread | GPU 调度策略 |
| `devicePlugin.deviceSplitCount` | int | 10 | 每张卡切分数量 |
| `devicePlugin.migStrategy` | string | none | MIG 策略 |
| `devicePlugin.deviceMemoryScaling` | float | 1.0 | 显存超卖倍数 |
| `devicePlugin.updateStrategy.type` | string | RollingUpdate | DaemonSet 更新策略 |
| `devicePlugin.nvidianodeSelector` | map | {} | NVIDIA 节点选择器 |
| `version` | string | v2.9.0 | HAMi 镜像版本 |

---

## Related

- [[概念/hami]] — HAMi 概念卡片
- [[12_架构基建/03_AI_Stack/HAMi_Deep_Dive]] — HAMi 深度解析
- [[12_架构基建/03_AI_Stack/HAMi_for_dummy]] — HAMi 入门
- [[13_运维/02_SRE_Reliability/HAMi_Troubleshooting_Guide]] — HAMi 问题排查
- [[概念/gpu-virtualization]] — GPU 虚拟化
- [[概念/dra]] — DRA 动态资源分配
