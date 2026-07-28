---
title: "HAMi 入门: 让 Kubernetes GPU 像 CPU 一样共享"
category: "12-architecture-infrastructure"
tags: ["hami", "gpu-virtualization", "kubernetes", "vgpu", "gpu-sharing", "for-dummy", "cncf"]
summary: "> **一句话理解**: HAMi 让 Kubernetes 里的一张 GPU 可以被多个 Pod 同时安全使用，就像多个进程共享 CPU 一样；它由 CNCF 孵化，支持 NVIDIA、华为昇腾、寒武纪等多种芯片。"
created: "2026-06-16"
updated: "2026-06-16"
tier: supporting
aliases:
  - "Hami For Dummy"
  - "HAMi for dummy"
  - HAMi_for_dummy
sources: []

name_zh: "HAMi 入门: 让 Kubernetes GPU 像 CPU 一样共享"
---
# HAMi 入门：让 Kubernetes GPU 像 CPU 一样共享

> 中文简称：HAMi 入门: 让 Kubernetes GPU 像 CPU 一样共享

> **一句话理解**: HAMi 让 Kubernetes 里的一张 GPU 可以被多个 Pod 同时安全使用，就像多个进程共享 CPU 一样；它由 CNCF 孵化，支持 NVIDIA、华为昇腾、寒武纪等多种芯片。

---

## 1. 为什么 GPU 共享很重要？

### 1.1 一个常见痛点

假设你公司有 10 张 NVIDIA A100，开发团队有 20 个人。按传统 Kubernetes 的分配方式：

```
每个人独占一张卡 → 10 个人有卡用，另外 10 个人排队。
```

但大多数人其实只在跑小模型验证、代码调试，每张卡只用了 10%-20% 的显存和算力。

### 1.2 HAMi 带来的改变

HAMi 可以把一张 A100 切成 4 份、8 份甚至更多，每个人拿到一份「虚拟 GPU」：

```
GPU 0 ──┬── 小张：3GB 显存，30% 算力
        ├── 小李：5GB 显存，50% 算力
        └── 小王：2GB 显存，20% 算力
```

大家互不干扰，10 张卡可以服务 30-50 人，利用率大幅提升。

---

## 2. HAMi 是什么？

**HAMi** = Heterogeneous AI Computing Virtualization Middleware

翻译成大白话：**Kubernetes 上的异构 AI 算力虚拟化中间件**。

它由 CNCF（云原生计算基金会）作为 Sandbox 项目孵化，最初叫 `k8s-vGPU-scheduler`，核心 Maintainer 团队后来成立了密瓜智能（Dynamia.ai）。

### 2.1 HAMi 能做什么？

| 能力 | 通俗解释 |
|------|---------|
| **切分 GPU** | 把一张物理卡切成多张虚拟卡 |
| **显存隔离** | 每个容器只能用自己的显存份额，不会抢别人的 |
| **算力隔离** | 每个容器只能用约定的算力比例，避免一个任务把卡跑满 |
| **多芯片支持** | 不只支持 NVIDIA，还支持昇腾、寒武纪、海光、摩尔线程等 |
| **自动调度** | 帮你把任务放到最合适的 GPU 上 |

### 2.2 HAMi 不能做什么？

- 不能替代 NVIDIA 驱动，驱动还得自己装。
- 不是硬件级隔离（不如 NVIDIA MIG 稳定），高负载下可能有轻微抖动。
- 目前对视频编解码支持有限。

---

## 3. 安装 HAMi（最简单路径）

### 3.1 前提条件

1. 有一个 Kubernetes 集群（建议 1.24+）。
2. GPU 节点已安装 NVIDIA 驱动和 nvidia-container-toolkit。
3. 节点上已设置 `nvidia-container-runtime` 为默认容器运行时。

### 3.2 给 GPU 节点打标签

```bash
kubectl label nodes <你的 GPU 节点名> gpu=on
```

### 3.3 用 Helm 一键安装

```bash
# 添加 HAMi 仓库
helm repo add hami-charts https://project-hami.github.io/HAMi/
helm repo update

# 安装，注意把 imageTag 改成你的 K8s 版本
helm install hami hami-charts/hami \
  --set scheduler.kubeScheduler.imageTag=v1.29.0 \
  -n kube-system
```

### 3.4 验证安装

```bash
kubectl get pods -n kube-system | grep hami
```

看到 `hami-device-plugin` 和 `hami-scheduler` 都是 `Running` 即可。

---

## 4. 在 Pod 里使用 vGPU

安装完成后，你的 Pod 只需要多写两行资源限制：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-ai-app
spec:
  schedulerName: hami-scheduler    # 关键：使用 HAMi 调度器
  containers:
    - name: app
      image: your-ai-image:latest
      resources:
        limits:
          nvidia.com/gpu: 1        # 需要 1 个物理 GPU 切片
          nvidia.com/gpumem: 4096  # 给我 4096 MiB（4GB）显存
          nvidia.com/gpucores: 50  # 给我 50% 算力（可选）
```

### 4.1 参数解释

| 参数 | 含义 | 示例 |
|------|------|------|
| `nvidia.com/gpu` | 需要几张物理 GPU 的切片 | `1` |
| `nvidia.com/gpumem` | 每个切片多少 MiB 显存 | `4096` = 4GB |
| `nvidia.com/gpucores` | 每个切片多少百分比算力 | `50` = 50% |

> 注意：容器里看到的显存总量就是你设置的 `gpumem`，不会看到整张卡的显存。

---

## 5. 常见使用场景

### 5.1 开发测试环境

10 个开发测试任务共享 2 张卡，每人分到 4GB 显存。

### 5.2 多租户推理服务

同一个大模型启动 4 个 vLLM 实例，各自服务不同租户，显存隔离避免互相影响。

### 5.3 国产芯片混部

昇腾、寒武纪、海光 GPU 混合部署，HAMi 提供统一的资源申请方式。

---

## 6. 如何查看资源使用情况？

### 6.1 安装 HAMi WebUI（可选）

```bash
helm repo add hami-webui https://project-hami.github.io/HAMi-WebUI
helm install my-hami-webui hami-webui/hami-webui \
  --set externalPrometheus.enabled=true \
  --set externalPrometheus.address="http://prometheus:9090" \
  -n kube-system
```

### 6.2 端口转发查看

```bash
kubectl port-forward service/my-hami-webui 3000:3000 -n kube-system
```

浏览器打开 `http://localhost:3000` 即可看到各节点 vGPU 使用情况。

---

## 7. 遇到问题怎么办？

1. Pod 一直 Pending → 检查节点是否打了 `gpu=on` 标签，调度器是否 Running。
2. 容器里看到整张卡显存 → 检查是否使用了 `hami-scheduler`。
3. 程序 OOM → 检查 `nvidia.com/gpumem` 设置是否足够，是否启用了显存超卖。
4. 更多排错 → 参见 [[13_运维/02_SRE_Reliability/HAMi_Troubleshooting_Guide]]。

---

## 8. 进阶学习路径

1. 想深入原理 → [[12_架构基建/03_AI_Stack/HAMi_Deep_Dive]]
2. 想部署运维 → [[12_架构基建/03_AI_Stack/HAMi_Operation_Guide]]
3. 想排查问题 → [[13_运维/02_SRE_Reliability/HAMi_Troubleshooting_Guide]]
4. 想快速查阅 → [[概念/hami]]

---

## Related

- [[概念/hami]] — HAMi 概念卡片
- [[概念/gpu-virtualization]] — GPU 虚拟化是什么
- [[12_架构基建/03_AI_Stack/HAMi_Deep_Dive]] — HAMi 深度解析
- [[12_架构基建/03_AI_Stack/HAMi_Operation_Guide]] — HAMi 运维指南
- [[13_运维/02_SRE_Reliability/HAMi_Troubleshooting_Guide]] — HAMi 问题排查
