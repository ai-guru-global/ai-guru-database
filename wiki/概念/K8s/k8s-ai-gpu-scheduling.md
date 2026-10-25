---
title: "K8s AI GPU 算力调度 (GPU Operator / DRA / Time-Slicing / MIG)"
category: concepts
tags:
  - k8s
  - gpu
  - gpu-operator
  - dra
  - time-slicing
  - mig
  - ai-workload
  - nvidia
aliases:
  - K8s AI GPU Scheduling
  - GPU Operator
  - DRA
  - Dynamic Resource Allocation
  - GPU Time-Slicing
relationships:
  - target: "概念/gpu-operator"
    type: extends
  - target: "概念/time-slicing"
    type: extends
  - target: "概念/gpu-virtualization"
    type: related_to
  - target: "概念/nvidia-gpu"
    type: related_to
summary: "K8s 上调度 AI/GPU 资源的完整方案栈——NVIDIA GPU Operator 一键部署驱动 + DRA(Dynamic Resource Allocation,K8s 1.31+ GA)+ Time-Slicing 时间分片 + MIG 硬件隔离 + Multi-Instance GPU + GPU 共享 + HAMI 国产化。覆盖单卡/多卡/多节点训练与推理的全部场景。"
lifecycle: reviewed
tier: core
created: 2026-07-24
updated: 2026-07-24
sources: []
name_zh: "K8s AI GPU 算力调度"
---

# K8s AI GPU 算力调度

> 中文简称：K8s AI GPU 算力调度

> **一句话理解**:K8s 上跑 AI 工作负载的"GPU 资源全栈"——从硬件驱动、调度器、资源分配模型、隔离级别到国产化方案,这套体系决定了你的 GPU 集群利用率是 20% 还是 80%。

---

## 一、为什么需要"专门的" GPU 调度?

K8s 原生只支持 `nvidia.com/gpu` 一个资源类型(整数卡),无法表达:
- **细粒度共享**:一张 H100 切 4 份给 4 个推理任务
- **拓扑感知**:NVLink/PCIe 拓扑对训练性能影响 30%+
- **动态分配**:训练任务峰值时按需扩缩,不要"占而不用"
- **隔离等级**:时间分片 vs MIG 硬件分区 vs MPS 进程级

---

## 二、关键术语中英对照

| 中文 | 英文 | 说明 |
|---|---|---|
| 通用 GPU 调度 | General GPU Scheduling | K8s 原生 `nvidia.com/gpu` 整卡调度 |
| 动态资源分配 | Dynamic Resource Allocation(DRA) | K8s 1.31+ GA 的新一代资源模型,声明式分配 |
| 时间分片 | Time-Slicing | 多个 Pod 共享一张 GPU,按时间片轮转 |
| 多实例 GPU | Multi-Instance GPU(MIG) | A100/H100 硬件级分区,完全隔离 |
| 多进程服务 | Multi-Process Service(MPS) | 同一 GPU 多进程并发,共享显存 |
| GPU 共享 | GPU Sharing | 通用术语,泛指各种分时/分区方案 |
| 拓扑感知调度 | Topology-Aware Scheduling | 按 NVLink/PCIe/NVSwitch 拓扑分配 Pod |
| GPU Operator | GPU Operator | NVIDIA 官方 K8s Operator,管驱动/CUDA/工具 |
| 设备插件 | Device Plugin | K8s 扩展机制,暴露 GPU 给 kubelet |
| 节点特性发现 | Node Feature Discovery(NFD) | 自动检测节点硬件能力并打标签 |
| 资源配额 | Resource Quota | 限制 namespace 的 GPU 总数 |
| 优先级抢占 | Priority & Preemption | 训练任务被推理任务抢占 |

---

## 三、方案矩阵对比(2026-02 快照)

| 方案 | 隔离级别 | 性能损失 | 适用场景 | 主流项目 |
|---|---|---|---|---|
| **整卡调度** | 硬件独占 | 0% | 大模型训练,显存敏感 | K8s 原生 + GPU Operator |
| **Time-Slicing** | 时间分片(无隔离) | 5-15% | 推理批处理,小模型 | NVIDIA GPU Operator (k8s-device-plugin 配置) |
| **MPS** | 进程级,共享显存 | 3-8% | 中等推理吞吐 | NVIDIA GPU Operator (启用 MPS) |
| **MIG 1g.5gb** | 硬件分区 5GB | <2% | 小模型隔离推理 | GPU Operator MIG Manager |
| **MIG 3g.40gb** | 硬件分区 40GB | <1% | 中等训练/推理 | GPU Operator MIG Manager |
| **MIG 7g.80gb** | 整卡 A100/H100 | 0% | 等价整卡 | GPU Operator MIG Manager |
| **DRA(声明式)** | 用户自定义 | 取决于实现 | 未来统一接口 | K8s 1.31+ GA |
| **HAMI 国产** | 显存 + 时间混合 | 5-10% | 国产芯片 + 国产方案 | 项目哈姆(HAMI)开源 |
| **Volcano GPU** | gang + 拓扑 | 取决于配置 | 分布式训练调度 | Volcano scheduler |
| **HAMi 异构** | 跨厂商 | 5-15% | 昇腾/寒武纪/海光 | HAMi 开源 |

---

## 四、核心项目与生态

### 4.1 NVIDIA GPU Operator(标准方案)

- **GitHub**:`github.com/NVIDIA/gpu-operator`(2026 v25.3.0+)
- 组件:NVIDIA Driver、Container Toolkit、Device Plugin、DCGM Exporter、MIG Manager、GPU Feature Discovery
- 一键部署:`kubectl apply -f https://raw.githubusercontent.com/NVIDIA/gpu-operator/main/deployments/gpu-operator.yaml`
- **2026 新增**:DRA Driver 支持(beta)、Time-Slicing 配置文件热重载、跨节点 GPU 共享(实验)

### 4.2 Dynamic Resource Allocation(DRA)— K8s 1.31+ GA(2025-08)

- KEP-3063,1.31 GA,1.32 增强
- 用 `ResourceClaim` / `ResourceClaimTemplate` 声明式分配资源
- 支持多种设备:GPU、RDMA、FPGA、加速器
- 取代 `nvidia.com/gpu` 整卡模型的"下一代接口"
- 文档:[kubernetes.io/docs/concepts/scheduling-eviction/dynamic-resource-allocation](https://kubernetes.io/docs/concepts/scheduling-eviction/dynamic-resource-allocation/)

### 4.3 HAMi(原 HAMI,异构 AI 算力)

- **GitHub**:`github.com/Project-HAMi/HAMi`(CNCF Sandbox,2024-12)
- 国产开源:支持 NVIDIA / 昇腾 / 寒武纪 / 海光 / 摩尔线程
- 显存 + 时间片混合调度,Web UI 可视化
- 2026 路线图:DRA 适配 + 拓扑感知 + 跨节点池化

### 4.4 Volcano(批量调度)

- **GitHub**:`github.com/volcano-sh/volcano`(CNCF Incubating)
- 特性:gang scheduling(整组调度)、fairness、queue、priority、topology
- AI 训练任务标配,支持 PyTorchJob / TFJob / RayJob

### 4.5 Kueue(Job 级队列)

- **GitHub**:`github.com/kubernetes-sigs/kueue`(CNCF Incubating)
- 与 Volcano 互补,提供"工作队列 + 配额 + 优先级"管理
- 2025-2026 主流:Kueue + Volcano 组合

### 4.6 KubeRay / Kserve(AI 平台)

- **KubeRay**:`github.com/ray-project/kuberay`(Ray on K8s Operator)
- **KServe**:`github.com/kserve/kserve`(Serverless Model Serving,已有独立卡)
- 与 GPU 调度深度集成

---

## 五、Time-Slicing 实战示例

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: time-slicing-config
  namespace: gpu-operator
data:
  any: |-
    version: v1
    sharing:
      timeSlicingConfig:
        replicas: 4   # 1 张物理卡 → 4 个 Pod 可用
    ---
    version: v1
    sharing:
      timeSlicingConfig:
        replicas: 8
    devices:
      - gpus: [0,1]
        sharing: "any"
      - gpus: [2,3]
        sharing: "none"  # 整卡独占
```

**适用场景**:
- 多个轻量推理服务共享一张卡
- 损失 5-15% 吞吐,显存可超分(需小心)
- **绝不**用于训练(性能损失不可接受)

---

## 六、MIG 实战示例(A100 80GB)

```yaml
# 把 1 张 A100 80GB 切成 1x7g.40gb + 1x3g.20gb + 2x1g.10gb
apiVersion: v1
kind: ConfigMap
metadata:
  name: mig-manager-config
data:
  config.yaml: |
    - models:
        - name: "all-1g.10gb"
          mIGConfig:
            name: "1g.10gb"
        - name: "all-3g.20gb"
          mIGConfig:
            name: "3g.20gb"
        - name: "all-7g.40gb"
          mIGConfig:
            name: "7g.40gb"
        - name: "all-7g.80gb"
          mIGConfig:
            name: "7g.80gb"
```

**适用场景**:
- 显存硬隔离,适合多租户
- 性能损失 <2%,接近整卡
- 缺点:切片数受硬件限制(A100 最多 7 个 1g.10gb)

---

## 七、DRA 实战示例(K8s 1.31+)

```yaml
apiVersion: resource.k8s.io/v1
kind: ResourceClaimTemplate
metadata:
  name: gpu-claim
spec:
  spec:
    devices:
      requests:
      - name: gpu
        exactly:
          deviceClassName: gpu.nvidia.com
          selectors:
          - cel:
              expression: "device.attributes['gpu.nvidia.com'].memory >= '40Gi'"
```

**优势**:
- 声明式、可移植、跨厂商
- 未来统一接口(替代 `nvidia.com/gpu` 整卡模型)
- 2025-08 GA,2026 全面推广

---

## 八、2026 生态速览

| 维度 | 2026 状态 |
|---|---|
| **GPU Operator** | v25.3.0,支持 DRA beta、跨节点共享实验 |
| **DRA** | K8s 1.31+ GA,1.32 增强,1.33 预计稳定 |
| **MIG** | A100/H100/B100 标配,Blackwell MIG-2 引入 |
| **Time-Slicing** | 仍是推理共享主流,但 MPS 渐进替代 |
| **HAMi** | CNCF Sandbox,异构方案事实标准 |
| **国产芯片集成** | 昇腾、寒武纪、海光、摩尔线程通过 HAMi/Volcano/Kueue 接入 |
| **多集群 GPU 池化** | NVIDIA AI Enterprise + Karpenter + K8s Federation |
| **GPU 利用率** | 头部企业 60-80%,长尾 20-30% |

---

## 九、生产最佳实践

1. **驱动和监控用 GPU Operator 一键部署**:不要手动装驱动,Operator 全管。
2. **推理用 Time-Slicing / MIG,训练用整卡**:训练性能损失不可接受,必须整卡。
3. **多租户用 MIG 硬件隔离**:显存硬隔离,适合 SaaS 多客户场景。
4. **大规模训练用 Volcano + Kueue**:gang scheduling 避免死锁,队列管理优先级。
5. **国产芯片用 HAMi**:异构统一接口,一套 API 调度所有 AI 芯片。
6. **DRA 早期采用**:从 1.31+ 开始在新集群启用,提前享受统一接口红利。
7. **GPU 利用率监控必备 DCGM + Prometheus**:定期分析利用率,识别僵尸 Pod。
8. **Karpenter 弹性扩缩**:训练任务结束后自动释放节点,避免闲置费。
9. **拓扑感知调度**:NVLink 域内 Pod 通信比跨域快 3-5x,分布式训练必备。
10. **资源超分要小心**:Time-Slicing 可超显存,OOM 风险高,生产环境用 MIG 替代。

---

## 十、See Also(官方源)

- NVIDIA GPU Operator [github.com/NVIDIA/gpu-operator](https://github.com/NVIDIA/gpu-operator)
- K8s DRA 文档 [kubernetes.io/docs/concepts/scheduling-eviction/dynamic-resource-allocation](https://kubernetes.io/docs/concepts/scheduling-eviction/dynamic-resource-allocation/)
- KEP-3063 DRA [github.com/kubernetes/enhancements/tree/master/keps/sig-scheduling/3063-dynamic-resource-allocation](https://github.com/kubernetes/enhancements/tree/master/keps/sig-scheduling/3063-dynamic-resource-allocation)
- HAMi [github.com/Project-HAMi/HAMi](https://github.com/Project-HAMi/HAMi)
- Volcano [github.com/volcano-sh/volcano](https://github.com/volcano-sh/volcano)
- Kueue [github.com/kubernetes-sigs/kueue](https://github.com/kubernetes-sigs/kueue)
- NVIDIA DRA Driver [github.com/NVIDIA/k8s-dra-driver](https://github.com/NVIDIA/k8s-dra-driver)
- DCGM [github.com/NVIDIA/dcgm-exporter](https://github.com/NVIDIA/dcgm-exporter)

---

## 十一、相关概念卡

- [[概念/gpu-operator|Gpu Operator]]
- [[概念/gpu-virtualization|Gpu Virtualization]]
- [[概念/mig|Mig]]
- [[概念/time-slicing|Time Slicing]]
- [[概念/nvidia-gpu|Nvidia Gpu]]
- [[概念/volcano|Volcano]]
- [[概念/kserve|Kserve]]
- [[概念/K8s/horizontal-pod-autoscaler|Horizontal Pod Autoscaler]]
