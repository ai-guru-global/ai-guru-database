---
title: "分布式训练 Hang 排障 Runbook"
category: 07-model-training
subcategory: distributed-training
tags: ["distributed-training", "nccl", "infiniBand", "nvlink", "kubernetes", "k8s", "troubleshooting", "alibaba-cloud"]
summary: "面向 K8s 上 LLM 分布式训练的 Hang/卡死/初始化失败排障手册：覆盖 NCCL、RDMA、InfiniBand、NVLink、Pod 网络等常见根因。"
created: 2026-06-26
updated: 2026-06-26
tier: core
sources: []
name_zh: "分布式训练 Hang 排障 Runbook"
---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](治理/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->

# 分布式训练 Hang 排障 Runbook

> 中文简称：分布式训练 Hang 排障 Runbook

> **一句话理解**: 分布式训练 Hang 通常不是代码 bug，而是 **NCCL 通信、网络拓扑、GPU 互联** 出了问题；本手册按「现象 → 日志 → 命令 → 修复」帮你定位。

## 目录

- [1. 常见 Hang 现象](#1-常见-hang-现象)
- [2. 分层排查总线](#2-分层排查总线)
- [3. NCCL 初始化失败](#3-nccl-初始化失败)
- [4. RDMA / InfiniBand 网络问题](#4-rdma--infiniBand-网络问题)
- [5. NVLink / GPU 拓扑问题](#5-nvlink--gpu-拓扑问题)
- [6. K8s 网络 / DNS / Service 问题](#6-k8s-网络--dns--service-问题)
- [7. 慢节点 / Straggler](#7-慢节点--straggler)
- [8. 阿里云专有云关联](#8-阿里云专有云关联)
- [Related](#related)

---

## 1. 常见 Hang 现象

| 现象 | 可能的根因 |
|------|-----------|
| 日志卡在 `Initializing distributed` / `Waiting for all ranks` | NCCL 初始化、rank 0 不可达 |
| 多卡训练中途卡住，GPU 利用率 100% 但不下降 | NCCL AllReduce 死锁、网络丢包 |
| 偶发卡死，重启后恢复 | RDMA 网卡瞬断、交换机拥塞 |
| 单节点正常，跨节点必卡 | IB/RoCE 网络配置、NCCL socket 参数 |
| 某些 rank 明显慢 | 慢节点、NUMA 不匹配、磁盘 IO 瓶颈 |

---

## 2. 分层排查总线

```text
1. K8s 层: Pod 是否都 Running？Service/Headless Service 是否正常？
2. 网络层: IB/RoCE 网卡是否 up？NCCL socket/IB 能否连通？
3. GPU 层: NVLink/NVSwitch 是否健康？GPU 温度/ECC 是否正常？
4. 框架层: NCCL_DEBUG=INFO 日志、超时参数、GLOO 后端测试
```

**第一条命令**：

```bash
kubectl get pods -n <ns> -l training.kubeflow.org/job-name=<job> -o wide
```

---

## 3. NCCL 初始化失败

### 3.1 开启 NCCL 调试日志

```bash
# 在训练容器环境变量中设置
NCCL_DEBUG=INFO
NCCL_DEBUG_SUBSYS=ALL
NCCL_IB_DISABLE=0  # 如果需要禁用 IB 可设为 1 测试
```

### 3.2 常见报错与处理

| 报错 | 根因 | 处理 |
|------|------|------|
| `NCCL error unhandled system error` | IB/RDMA 驱动或网络异常 | 检查 IB 网卡、ibstat |
| `Connection refused by rank 0` | rank 0 Pod 未就绪或网络不通 | 检查 headless service、DNS |
| `NCCL timeout` | 某个 rank 卡住或网络延迟高 | 增大 NCCL_TIMEOUT，排查慢节点 |
| `invalid device ordinal` | CUDA_VISIBLE_DEVICES 与 NCCL  rank 不匹配 | 检查 device 映射 |
| `duplicate GPU detected` | 多进程绑定到同一张 GPU | 检查 launcher（torchrun/deepspeed）参数 |

### 3.3 检查 rank 发现

```bash
# 在 Pod 中测试 rank 0 是否可访问
kubectl exec -it <rank-0-pod> -n <ns> -- nc -zv <rank-1-hostname> 29500

# 看 Headless Service 的 Endpoint
kubectl get endpoints <svc-name> -n <ns>
```

---

## 4. RDMA / InfiniBand 网络问题

### 4.1 检查 IB 设备状态

```bash
# 看 IB 网卡
ibstat
ibstatus

# 看端口状态
ibv_devinfo

# 测试带宽
ib_write_bw  # server
ib_write_bw <server-ip>  # client
```

### 4.2 检查 RoCE（若使用 RoCEv2）

```bash
# 查看 RDMA 设备
rdma link

# 查看 GID
show_gids

# 测试 RDMA 连通
ibv_rc_pingpong
```

### 4.3 K8s 中 RDMA 常见配置

- **Mellanox OFED 驱动**：节点需安装 `nvidia-peer-memory` 或 `nvidia_p2p`
- **SR-IOV / Macvlan**：Pod 需使用 RDMA 感知 CNI（如 Mellanox SR-IOV CNI、Spiderpool）
- **NetworkPolicy**：确保未拦截 RDMA 控制面 / 数据面端口

### 4.4 临时绕过 IB 测试

```bash
export NCCL_IB_DISABLE=1
export NCCL_SOCKET_IFNAME=eth0
python train.py
```

> 注意：关闭 IB 后走 TCP，速度会大幅下降，仅用于排除 IB 问题。

---

## 5. NVLink / GPU 拓扑问题

### 5.1 检查 GPU 拓扑

```bash
nvidia-smi topo -m
```

输出示例：

```
        GPU0    GPU1    GPU2    GPU3
GPU0     X      NV4     NV4     NV4
GPU1    NV4      X      NV4     NV4
GPU2    NV4     NV4      X      NV4
GPU3    NV4     NV4     NV4      X
```

- `NV4` 表示 NVLink x4
- `SYS` 表示跨 NUMA / 跨 socket，通信走 PCIe/QPI
- `PHB` 表示同一 PCIe switch

### 5.2 拓扑相关故障

| 现象 | 根因 | 处理 |
|------|------|------|
| 同一节点内多卡通信慢 | GPU 跨 NUMA / 未使用 NVLink | 使用 `nvidia-smi topo -m` 选择相邻 GPU |
| 8xGPU 机器内带宽不均 | NVSwitch 异常 | 检查 `nvidia-smi nvlink -e` |
| 跨机通信远低于标称 | 网络适配器未绑定到正确 NUMA | 按 NUMA 分配 CPU/网卡/GPU |

---

## 6. K8s 网络 / DNS / Service 问题

### 6.1 Headless Service 解析

分布式训练通常依赖 Headless Service 让各 rank 通过 Pod DNS 互相发现：

```yaml
apiVersion: v1
kind: Service
metadata:
  name: llm-train-svc
spec:
  clusterIP: None
  selector:
    app: llm-train
  ports:
    - port: 29500
```

检查：

```bash
# 在 Pod 内解析其他 rank
nslookup llm-train-0.llm-train-svc

# 看 Endpoint
kubectl get endpoints llm-train-svc -n <ns>
```

### 6.2 DNS 解析慢导致 NCCL 初始化慢

可在训练启动前加：

```bash
cat /etc/resolv.conf
# 确认 search 域合理，必要时缩短 ndots
```

---

## 7. 慢节点 / Straggler

### 7.1 识别慢节点

```bash
# 查看每个 Pod 的 GPU 利用率
kubectl top pod -n <ns> -l app=llm-train

# 进每个 Pod 看 nvidia-smior pod in $(kubectl get pods -n <ns> -l app=llm-train -o name); do
  echo "=== $pod ==="
  kubectl exec -it $pod -n <ns> -- nvidia-smi dmon -s u -c 3
done
```

### 7.2 常见慢节点根因

| 根因 | 处理 |
|------|------|
| 节点 CPU 瓶颈（数据加载） | 增加 num_workers，使用预处理数据集 |
| 节点磁盘 IO 慢 | 换 NVMe / 本地 SSD，预加载到内存 |
| 节点网络丢包 | 检查网卡、交换机、RDMA 配置 |
| GPU 温度高降频 | 检查散热、风扇、机房温度 |

---

## 8. 阿里云专有云关联

在阿里云专有云环境中，分布式训练通常部署在：

- **ACK 专有版 + 神龙 GPU 集群**：高带宽 RDMA 网络（如 ERI / 神龙 MOC 卡）
- **PAI-DLC**：托管分布式训练，底层仍是 K8s Job/PyTorchJob
- **天基 Tianji**：负责节点生命周期、驱动安装、网络配置

**专有云排查要点**：
- 通过天基确认 GPU 节点 IB/RoCE 网卡驱动已正确安装
- 通过 ASCM 查看网络告警（洛神 Luoshen 层）
- 如果使用 PAI-DLC，先确认 PAI 平台日志中是否有 NCCL 相关告警

---

## Related

- [[概念/nccl|NCCL]]
- [[概念/infiniBand|InfiniBand]]
- [[概念/nvlink|NVLink]]
- [[概念/gpu-direct|GPU Direct]]
- [[概念/distributed-training|分布式训练]]
- [[概念/deepspeed|DeepSpeed]]
- [[概念/fsdp|FSDP]]
- [[07_模型训练/07_训练监控/02_LLM_微调_岗位_Failure_操作手册_on_K8s|LLM 微调任务 K8s 失败排障]]
- [[13_运维/02_SRE与可靠性/GPU_OOM_Troubleshooting_Guide|GPU OOM 排障指南]]
- [[12_架构基建/06_云厂商/Alibaba_Cloud/专有云/03_阿里云_专有云_K8s_上下文|阿里云专有云 K8s 上下文]]
