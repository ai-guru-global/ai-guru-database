---
title: "GPU 集群运维 2026"
category: "13-ai-ops"
tags: ["gpu-cluster", "nccl", "infiniband", "slurm", "kubernetes", "dcgm", "large-scale-training"]
summary: "GPU 集群运维全景：多节点训练通信(NCCL/InfiniBand/RoCE)、GPU 共享(MIG/MPS/vGPU)、集群调度(Slurm/Kubernetes)、故障检测与自愈、高性能存储、监控体系、千卡万卡大规模训练运维实践。"
created: 2026-07-19
updated: 2026-07-19
tier: supporting
aliases:
  - "GPU Cluster Operations 2026"
  - GPU_Cluster_Operations_2026
sources: []

---
# GPU 集群运维 2026

> **一句话理解**: 面向千卡/万卡级 GPU 集群的全栈运维指南，覆盖通信网络、资源共享、调度编排、故障自愈、存储、监控六大核心领域。

---

## 一、概述

### 1.1 为什么 GPU 集群运维是独立学科

```
传统服务器集群运维              GPU 集群运维
═══════════════════            ═══════════════════
CPU 故障率低                   GPU 故障率高 5-10x（HBM/PCIe/NVLink）
网络带宽需求低                 需要 400Gbps+ 互联（AllReduce 通信）
单节点独立                     多节点强耦合（一个 GPU 故障拖垮整个 Job）
存储 I/O 可预测                Checkpoint 写入突发 TB 级
运维窗口灵活                   训练中断 = 数十万美元损失
```

### 1.2 2026 年 GPU 集群规模参考

| 规模 | GPU 数量 | 典型场景 | 代表集群 |
|------|---------|---------|---------|
| 小型 | 8-64 | 微调/推理 | 单 DGX 节点 |
| 中型 | 64-512 | 预训练 7B-70B | 企业私有集群 |
| 大型 | 512-4096 | 预训练 70B-405B | 云厂商 GPU 池 |
| 超大型 | 4096-100000+ | 前沿模型训练 | xAI Colossus / Meta |

---

## 二、多节点训练通信

### 2.1 NCCL 通信库

NCCL (NVIDIA Collective Communications Library) 是 GPU 集合通信的事实标准。

```bash
# 查看 NCCL 版本与拓扑
nvidia-smi topo -m
nccl-tests/build/all_reduce_perf -b 8 -e 256M -f 2 -g 8

# 关键环境变量
export NCCL_DEBUG=INFO
export NCCL_IB_DISABLE=0          # 启用 InfiniBand
export NCCL_NET_GDR_LEVEL=2       # GPUDirect RDMA 级别
export NCCL_P2P_LEVEL=NVL         # NVLink P2P
export NCCL_ALGO=Ring,Tree        # 通信算法
export NCCL_PROTO=Simple,LL,LL128 # 协议
```

#### NCCL 集合通信操作

| 操作 | 用途 | 带宽利用率 |
|------|------|-----------|
| AllReduce | 梯度同步（数据并行） | 2(N-1)/N × BW |
| AllGather | 参数收集（ZeRO/FSDP） | (N-1)/N × BW |
| ReduceScatter | 梯度分片（ZeRO-3） | (N-1)/N × BW |
| Broadcast | 参数广播 | BW |
| AllToAll | Expert 路由（MoE） | (N-1)/N × BW |

### 2.2 InfiniBand 网络

```bash
# 检查 IB 设备状态
ibstat
ibstatus
perfquery

# 带宽测试
ib_write_bw -d mlx5_0 --report_gbits
ib_read_bw -d mlx5_0 -a

# 诊断
ibdiagnet                    # 全网拓扑扫描
ibcheckerrors               # 错误计数
smpquery NodeInfo 1         # 查询交换机

# 关键配置
opensm -F /etc/opensm/opensm.conf  # Subnet Manager
```

#### InfiniBand vs RoCE 对比

| 维度 | InfiniBand (NDR/XDR) | RoCE v2 |
|------|---------------------|---------|
| 带宽 | 400Gbps (NDR) / 800Gbps (XDR) | 100/200/400 Gbps |
| 延迟 | ~600ns | ~1-2μs |
| 拥塞控制 | 硬件级 (Credit-based) | DCQCN (软件辅助) |
| 路由 | Adaptive Routing | ECMP |
| 成本 | 高（专用交换机） | 中（以太网交换机） |
| 运维复杂度 | 高（Subnet Manager） | 中（标准以太网运维） |
| 适用场景 | 万卡训练 | 千卡训练/推理集群 |

### 2.3 RoCE (RDMA over Converged Ethernet)

```bash
# RoCE 配置要点
# 1. 启用 PFC (Priority Flow Control)
mlnx_qos -i eth0 --pfc 0,0,0,1,0,0,0,0

# 2. 配置 ECN
echo 1 > /sys/class/net/eth0/ecn/roce_np/enable/3
echo 1 > /sys/class/net/eth0/ecn/roce_rp/enable/3

# 3. 验证 RDMA
rdma link show
rdma statistic show

# 4. NCCL over RoCE
export NCCL_IB_DISABLE=0
export NCCL_IB_GID_INDEX=3
export NCCL_IB_TC=136
export NCCL_IB_SL=5
```

### 2.4 网络拓扑设计

```
Fat-Tree 拓扑（传统）          Rail-Optimized 拓扑（2026 主流）
═══════════════════           ════════════════════════════

  Spine Layer                  Rail 0    Rail 1    Rail 2 ... Rail 7
    |    |    |                 |         |         |           |
  Leaf Layer                  Node0-GPU0 Node0-GPU1 ...     Node0-GPU7
    |    |    |                 |         |         |           |
  GPU Nodes                   Node1-GPU0 Node1-GPU1 ...     Node1-GPU7
                               ...       ...       ...         ...

优势: 均匀带宽               优势: 减少交换机数量 50%+
劣势: 交换机成本高           劣势: 跨 Rail 通信需额外路径
```

---

## 三、GPU 共享技术

### 3.1 MIG (Multi-Instance GPU)

```bash
# 启用 MIG 模式（需要 root，GPU 空闲）
nvidia-smi -i 0 -mig 1

# 创建 MIG 实例（H100 80GB 示例）
# 7 个 1g.10gb 实例
nvidia-smi mig -i 0 -cgi 19,19,19,19,19,19,19 -C

# 3 个 2g.20gb + 1 个 1g.10gb
nvidia-smi mig -i 0 -cgi 14,14,19 -C

# 查看 MIG 实例
nvidia-smi mig -i 0 -lgi
nvidia-smi mig -i 0 -lci

# 销毁所有实例
nvidia-smi mig -i 0 -dci
nvidia-smi mig -i 0 -dgi
```

### 3.2 MPS (Multi-Process Service)

```bash
# 启动 MPS daemon
export CUDA_MPS_PIPE_DIRECTORY=/tmp/nvidia-mps
export CUDA_MPS_LOG_DIRECTORY=/tmp/nvidia-log
nvidia-cuda-mps-control -d

# 配置 MPS 客户端
export CUDA_MPS_ACTIVE_THREAD_PERCENTAGE=25  # 限制 25% SM
export CUDA_VISIBLE_DEVICES=0

# 停止 MPS
echo quit | nvidia-cuda-mps-control
```

### 3.3 vGPU (NVIDIA Virtual GPU)

```bash
# vGPU 需要 NVIDIA AI Enterprise 或 vGPU License
# 在 Hypervisor 层配置（以 KVM 为例）

# 查看可用 vGPU profile
nvidia-smi vgpu -s

# 创建 vGPU 实例（virsh）
virsh attach-device vm1 <(cat <<EOF
<hostdev mode='subsystem' type='mdev' model='vfio-pci'>
  <source>
    <address uuid='$(uuidgen)'/>
  </source>
</hostdev>
EOF
)
```

### 3.4 GPU 共享方案对比

| 方案 | 隔离级别 | 性能损耗 | 适用场景 | 最小粒度 |
|------|---------|---------|---------|---------|
| MIG | 硬件隔离 | <2% | 推理/小模型训练 | 1/7 GPU (H100) |
| MPS | 进程级 | <5% | 多推理进程共享 | SM 百分比 |
| vGPU | VM 级 | 5-15% | 多租户虚拟化 | Profile 定义 |
| Time-slicing | 时间片 | 10-30% | 开发/测试 | 时间片 |
| HAMi | 软件虚拟化 | 5-10% | K8s 多租户 | 显存+算力 |

---

## 四、集群调度

### 4.1 Slurm 调度

```bash
# 典型 GPU 训练 Job 提交
#!/bin/bash
#SBATCH --job-name=llm-pretrain
#SBATCH --partition=gpu-h100
#SBATCH --nodes=64
#SBATCH --ntasks-per-node=8
#SBATCH --gpus-per-node=8
#SBATCH --cpus-per-task=12
#SBATCH --mem=512G
#SBATCH --time=72:00:00
#SBATCH --exclusive
#SBATCH --output=/logs/%x_%j.out

# 环境配置
export MASTER_ADDR=$(scontrol show hostname $SLURM_NODELIST | head -n1)
export MASTER_PORT=29500
export WORLD_SIZE=$((SLURM_NNODES * 8))

# 启动分布式训练
srun --mpi=pmix python train.py \
    --model llama-70b \
    --data-path /gpfs/datasets/pretrain \
    --checkpoint-dir /gpfs/checkpoints/$SLURM_JOB_ID
```

```bash
# Slurm 集群管理常用命令
sinfo -p gpu-h100              # 查看分区状态
squeue -u $USER                # 查看用户任务
scontrol show job $JOB_ID      # 任务详情
scancel $JOB_ID                # 取消任务
sacct -j $JOB_ID --format=JobID,Elapsed,MaxRSS,MaxVMSize  # 历史统计

# 节点维护
scontrol update NodeName=gpu-node-01 State=DRAIN Reason="GPU ECC Error"
scontrol update NodeName=gpu-node-01 State=RESUME
```

### 4.2 Kubernetes + GPU Operator

```yaml
# NVIDIA GPU Operator 部署
apiVersion: v1
kind: Namespace
metadata:
  name: gpu-operator
---
# Helm 安装
# helm install gpu-operator nvidia/gpu-operator \
#   --namespace gpu-operator --create-namespace \
#   --set driver.version=570.86.15 \
#   --set toolkit.version=1.17.4-ubuntu22.04

---
# GPU 训练 Job (PyTorchJob via Kubeflow Training Operator)
apiVersion: kubeflow.org/v1
kind: PyTorchJob
metadata:
  name: llama-finetune
  namespace: training
spec:
  nprocPerNode: "8"
  pytorchReplicaSpecs:
    Master:
      replicas: 1
      template:
        spec:
          containers:
          - name: pytorch
            image: nvcr.io/nvidia/pytorch:26.04-py3
            resources:
              limits:
                nvidia.com/gpu: 8
            command:
            - torchrun
            - --nproc_per_node=8
            - train.py
            volumeMounts:
            - name: shared-storage
              mountPath: /data
          volumes:
          - name: shared-storage
            persistentVolumeClaim:
              claimName: gpfs-pvc
          nodeSelector:
            nvidia.com/gpu.product: NVIDIA-H100-80GB-PCIe
          tolerations:
          - key: nvidia.com/gpu
            operator: Exists
            effect: NoSchedule
    Worker:
      replicas: 7
      template:
        spec:
          containers:
          - name: pytorch
            image: nvcr.io/nvidia/pytorch:26.04-py3
            resources:
              limits:
                nvidia.com/gpu: 8
            command:
            - torchrun
            - --nproc_per_node=8
            - --nnodes=8
            - train.py
```

### 4.3 调度器对比

| 维度 | Slurm | Kubernetes + GPU Operator | Volcano |
|------|-------|--------------------------|---------|
| 设计目标 | HPC 批处理 | 通用容器编排 | AI/大数据批处理 |
| Gang Scheduling | 原生支持 | 需 Volcano/Coscheduling | 原生支持 |
| 弹性训练 | 有限 | 支持 (Elastic Horovod) | 支持 |
| 抢占 | 优先级抢占 | PriorityClass | 队列级抢占 |
| 拓扑感知 | 原生 (Topology plugin) | Topology Manager | NUMA 感知 |
| 生态 | HPC 传统 | 云原生 | K8s 原生 |
| 适用规模 | 万卡 | 万卡 | 万卡 |

---

## 五、故障检测与自愈

### 5.1 GPU 故障分类

| 故障类型 | 频率 | 检测方式 | 影响 |
|---------|------|---------|------|
| ECC 错误 (可纠正) | 高 | DCGM/XID 日志 | 性能下降 |
| ECC 错误 (不可纠正) | 中 | XID 48/63 | GPU 不可用 |
| GPU 掉卡 (Fall off bus) | 中 | XID 79 | GPU 消失 |
| NVLink 错误 | 中 | XID 74 | 通信降级 |
| HBM 故障 | 低 | DCGM 诊断 | 需 RMA |
| 温度过高 | 中 | DCGM 温度监控 | 降频/关机 |
| PCIe 错误 | 低 | AER 日志 | 通信中断 |

### 5.2 自动化故障检测脚本

```python
#!/usr/bin/env python3
"""GPU 集群健康检查与自动隔离"""

import subprocess
import json
import logging
from dataclasses import dataclass
from enum import Enum

logger = logging.getLogger("gpu_health")

class GPUStatus(Enum):
    HEALTHY = "healthy"
    DEGRADED = "degraded"
    FAILED = "failed"

@dataclass
class GPUHealthReport:
    node: str
    gpu_id: int
    status: GPUStatus
    ecc_errors: int
    temperature: float
    utilization: float
    xid_errors: list[str]

def check_gpu_health(node: str) -> list[GPUHealthReport]:
    """检查节点上所有 GPU 健康状态"""
    reports = []
    
    # 获取 GPU 基础信息
    result = subprocess.run(
        ["nvidia-smi", "--query-gpu=index,ecc.errors.uncorrected.volatile.total,"
         "temperature.gpu,utilization.gpu", "--format=csv,noheader,nounits"],
        capture_output=True, text=True
    )
    
    for line in result.stdout.strip().split("\n"):
        parts = [p.strip() for p in line.split(",")]
        gpu_id = int(parts[0])
        ecc_errors = int(parts[1]) if parts[1] != "[N/A]" else 0
        temp = float(parts[2])
        util = float(parts[3])
        
        # 检查 XID 错误
        xid_errors = get_recent_xid_errors(gpu_id)
        
        # 判定状态
        status = GPUStatus.HEALTHY
        if ecc_errors > 0 or any_xid_critical(xid_errors):
            status = GPUStatus.FAILED
        elif temp > 85 or ecc_errors > 100:
            status = GPUStatus.DEGRADED
        
        reports.append(GPUHealthReport(
            node=node, gpu_id=gpu_id, status=status,
            ecc_errors=ecc_errors, temperature=temp,
            utilization=util, xid_errors=xid_errors
        ))
    
    return reports

def get_recent_xid_errors(gpu_id: int) -> list[str]:
    """从 dmesg 获取最近 XID 错误"""
    result = subprocess.run(
        ["dmesg", "--level=err", "-T"],
        capture_output=True, text=True
    )
    return [line for line in result.stdout.split("\n")
            if f"NVRM: Xid" in line and f"GPU {gpu_id}" in line]

def any_xid_critical(xid_errors: list[str]) -> bool:
    """检查是否包含致命 XID 错误"""
    critical_xids = {"48", "63", "74", "79", "92", "94", "95"}
    for err in xid_errors:
        for xid in critical_xids:
            if f"Xid {xid}" in err or f"Xid (PCI" in err:
                return True
    return False

def drain_node(node: str, reason: str):
    """Slurm: 隔离故障节点"""
    subprocess.run([
        "scontrol", "update",
        f"NodeName={node}", "State=DRAIN",
        f"Reason={reason}"
    ])
    logger.warning(f"Node {node} drained: {reason}")

def drain_node_k8s(node: str, reason: str):
    """Kubernetes: Cordon + 驱逐"""
    subprocess.run(["kubectl", "cordon", node])
    subprocess.run([
        "kubectl", "drain", node,
        "--ignore-daemonsets", "--delete-emptydir-data",
        "--grace-period=300"
    ])
    logger.warning(f"Node {node} cordoned and drained: {reason}")
```

### 5.3 训练容错与自愈

```python
"""基于 torch.distributed.elastic 的弹性训练"""
import torch
import torch.distributed as dist
from torch.distributed.elastic.multiprocessing.errors import record

@record
def train_with_fault_tolerance():
    """支持节点故障自动恢复的训练循环"""
    dist.init_process_group("nccl")
    rank = dist.get_rank()
    world_size = dist.get_world_size()
    
    model = build_model().cuda()
    optimizer = build_optimizer(model)
    
    # 从最近 checkpoint 恢复
    start_step = load_latest_checkpoint(model, optimizer)
    
    for step in range(start_step, TOTAL_STEPS):
        try:
            loss = train_step(model, optimizer, step)
            
            # 定期保存 checkpoint（异步）
            if step % CHECKPOINT_INTERVAL == 0 and rank == 0:
                save_checkpoint_async(model, optimizer, step)
                
        except RuntimeError as e:
            if "NCCL" in str(e):
                logger.error(f"Rank {rank}: NCCL error, triggering restart")
                raise  # elastic agent 会捕获并重启
            
    dist.destroy_process_group()
```

---

## 六、高性能存储

### 6.1 存储系统对比

| 存储系统 | 类型 | 吞吐 | 适用场景 | 部署复杂度 |
|---------|------|------|---------|-----------|
| GPFS (Spectrum Scale) | 并行文件系统 | TB/s 级 | 万卡训练 Checkpoint | 高 |
| Lustre | 并行文件系统 | TB/s 级 | HPC/训练数据 | 高 |
| WekaFS | 全闪并行 | 极高 IOPS | 小文件/随机读 | 中 |
| BeeGFS | 并行文件系统 | 百 GB/s | 中型集群 | 中 |
| CephFS | 分布式文件系统 | 百 GB/s | 通用/云原生 | 中 |
| DAOS | NVMe 原生 | 极高 | 下一代 HPC | 高 |

### 6.2 Checkpoint 存储最佳实践

```bash
# GPFS 挂载优化（训练场景）
mmmount all -T /gpfs/training \
    -o maxMBpS=4096,readReplica=default,writeReplica=default

# Checkpoint 写入优化
# 1. 使用异步 Checkpoint（torch.distributed.checkpoint）
# 2. 分层存储: 本地 NVMe → 并行文件系统 → 对象存储
# 3. 增量 Checkpoint 减少写入量

# Lustre 条带化配置
lfs setstripe -c 64 -S 4M /lustre/checkpoints/
lfs getstripe /lustre/checkpoints/
```

```python
"""异步分层 Checkpoint 策略"""
import torch.distributed.checkpoint as dcp
from torch.distributed.checkpoint import FileSystemWriter
import threading

class AsyncCheckpointManager:
    """异步 Checkpoint: 不阻塞训练"""
    
    def __init__(self, local_path: str, remote_path: str):
        self.local_path = local_path    # NVMe 本地路径
        self.remote_path = remote_path  # 并行文件系统路径
        self._thread = None
    
    def save_async(self, state_dict: dict, step: int):
        """异步保存到本地 NVMe，后台同步到远端"""
        if self._thread and self._thread.is_alive():
            self._thread.join()  # 等待上一次完成
        
        self._thread = threading.Thread(
            target=self._save_and_sync,
            args=(state_dict, step)
        )
        self._thread.start()
    
    def _save_and_sync(self, state_dict: dict, step: int):
        # Step 1: 快速写入本地 NVMe
        local_ckpt = f"{self.local_path}/step_{step}"
        dcp.save(state_dict, storage_writer=FileSystemWriter(local_ckpt))
        
        # Step 2: 后台 rsync 到并行文件系统
        import subprocess
        subprocess.run([
            "rsync", "-a", "--bwlimit=500000",
            local_ckpt, f"{self.remote_path}/"
        ])
```

---

## 七、监控体系

### 7.1 DCGM (Data Center GPU Manager)

```bash
# 安装 DCGM
apt-get install datacenter-gpu-manager

# 启动 DCGM 服务
systemctl enable nvidia-dcgm
systemctl start nvidia-dcgm

# 健康检查
dcgmi health -g 0 -c    # 检查 GPU Group 0
dcgmi diag -r 3         # Level 3 诊断（含压力测试）

# 关键指标采集
dcgmi dmon -e 100,101,110,140,150,155,203,204,1001,1002,1003
# 100: SM Clock  101: Memory Clock  110: SM Utilization
# 140: GPU Temp  150: Power Usage   155: Memory Temp
# 203: GPU Util  204: Mem Util      1001: GPU UUID
# 1002: NVLink TX  1003: NVLink RX

# DCGM Prometheus Exporter
dcgm-exporter -f /etc/dcgm-exporter/dcp-metrics-included.csv
# 默认端口 9400
```

### 7.2 Prometheus + Grafana 监控栈

```yaml
# prometheus.yml - GPU 集群监控配置
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'dcgm-exporter'
    kubernetes_sd_configs:
      - role: pod
    relabel_configs:
      - source_labels: [__meta_kubernetes_pod_label_app]
        regex: dcgm-exporter
        action: keep

  - job_name: 'node-exporter'
    static_configs:
      - targets: ['gpu-node-01:9100', 'gpu-node-02:9100']

  - job_name: 'ib-exporter'
    static_configs:
      - targets: ['ib-monitor:9683']

rule_files:
  - /etc/prometheus/rules/gpu_alerts.yml

alerting:
  alertmanagers:
    - static_configs:
        - targets: ['alertmanager:9093']
```

```yaml
# gpu_alerts.yml - GPU 告警规则
groups:
  - name: gpu_critical
    rules:
      - alert: GPUECCUncorrectable
        expr: DCGM_FI_DEV_ECC_DBE_VOL_TOTAL > 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "GPU {{ $labels.gpu }} 不可纠正 ECC 错误"
          action: "立即隔离节点，检查是否需要 RMA"

      - alert: GPUTemperatureHigh
        expr: DCGM_FI_DEV_GPU_TEMP > 85
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "GPU {{ $labels.gpu }} 温度过高: {{ $value }}°C"

      - alert: GPUPowerCap
        expr: DCGM_FI_DEV_POWER_USAGE > DCGM_FI_DEV_POWER_MGMT_LIMIT * 0.95
        for: 10m
        labels:
          severity: warning

      - alert: NVLinkErrors
        expr: rate(DCGM_FI_DEV_NVLINK_CRC_FLIT_ERROR_COUNT_TOTAL[5m]) > 0
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "NVLink CRC 错误，通信可能降级"

      - alert: GPUUtilizationLow
        expr: DCGM_FI_DEV_GPU_UTIL < 10 and DCGM_FI_DEV_MEM_COPY_UTIL > 0
        for: 30m
        labels:
          severity: info
        annotations:
          summary: "GPU 利用率异常低，可能存在通信瓶颈"
```

### 7.3 关键监控指标 Dashboard

| 层级 | 指标 | 告警阈值 | 采集频率 |
|------|------|---------|---------|
| GPU 硬件 | 温度/功耗/时钟 | >85°C / >95% TDP | 10s |
| GPU 硬件 | ECC 错误 | DBE > 0 立即告警 | 10s |
| GPU 硬件 | NVLink 错误 | CRC > 0 | 10s |
| 网络 | IB 端口错误 | Symbol Error > 100/s | 30s |
| 网络 | 带宽利用率 | <50% (训练期间) | 30s |
| 存储 | Checkpoint 写入延迟 | >60s | 每 Checkpoint |
| 训练 | Loss 异常 | NaN/Inf/突增 | 每 Step |
| 训练 | 吞吐量 (tokens/s) | <基线 80% | 每 100 Steps |
| 调度 | 队列等待时间 | >2h | 1min |

---

## 八、大规模训练运维实践

### 8.1 千卡训练 Checklist

```markdown
## 训练启动前检查 (Pre-flight Checklist)

### 硬件检查
- [ ] 所有 GPU 通过 DCGM Level 3 诊断
- [ ] NVLink 拓扑正确 (nvidia-smi topo -m)
- [ ] IB 链路全部 Active，无 Symbol Error
- [ ] 存储带宽满足 Checkpoint 需求 (>100 GB/s)

### 软件检查
- [ ] NCCL 版本与驱动兼容
- [ ] CUDA/cuDNN 版本匹配
- [ ] 容器镜像一致性（所有节点相同 digest）
- [ ] 环境变量正确 (NCCL_*, MASTER_ADDR, WORLD_SIZE)

### 通信验证
- [ ] nccl-tests all_reduce 带宽达标 (>90% 理论值)
- [ ] 跨节点 P2P 通信正常
- [ ] GPUDirect RDMA 启用

### 训练配置
- [ ] Batch size 与 GPU 数量匹配
- [ ] Learning rate warmup 配置正确
- [ ] Checkpoint 间隔合理 (建议 30min-1h)
- [ ] 日志级别适当 (避免 I/O 瓶颈)
```

### 8.2 万卡训练特殊挑战

| 挑战 | 解决方案 | 工具 |
|------|---------|------|
| 节点故障概率高 (MTBF < 数小时) | 弹性训练 + 快速 Checkpoint | torch elastic / Oobleck |
| 网络分区 | 多级通信拓扑 + 降级策略 | NCCL Tree/Ring 混合 |
| 存储瓶颈 | 异步分层 Checkpoint | CheckFreq / Nebula |
| 调试困难 | 分布式 Tracing + 日志聚合 | Jaeger / Loki |
| 成本失控 | 实时成本监控 + Spot 实例 | 自研 / Kubecost |
| 长尾延迟 | 慢节点检测 + 自动替换 | DCGM + 自研 Agent |

### 8.3 训练效率优化

```python
"""训练效率监控与优化"""
import time
import torch
import torch.distributed as dist

class TrainingProfiler:
    """训练性能分析器"""
    
    def __init__(self, log_interval: int = 100):
        self.log_interval = log_interval
        self.step_times = []
        self.comm_times = []
        self.compute_times = []
    
    def profile_step(self, step: int, model, batch):
        """分析单步训练时间分布"""
        # 计算时间
        torch.cuda.synchronize()
        t0 = time.perf_counter()
        
        output = model(batch)
        loss = output.loss
        
        torch.cuda.synchronize()
        t1 = time.perf_counter()
        
        loss.backward()
        
        torch.cuda.synchronize()
        t2 = time.perf_counter()
        
        # 通信时间 (AllReduce)
        dist.all_reduce(loss)
        
        torch.cuda.synchronize()
        t3 = time.perf_counter()
        
        compute_time = (t1 - t0) + (t2 - t1)
        comm_time = t3 - t2
        total_time = t3 - t0
        
        # 计算 MFU (Model FLOPs Utilization)
        if step % self.log_interval == 0:
            mfu = self.calculate_mfu(model, total_time)
            logger.info(
                f"Step {step}: total={total_time:.3f}s "
                f"compute={compute_time:.3f}s comm={comm_time:.3f}s "
                f"comm_ratio={comm_time/total_time:.1%} MFU={mfu:.1%}"
            )
    
    def calculate_mfu(self, model, step_time: float) -> float:
        """计算 Model FLOPs Utilization"""
        # 理论 FLOPs per step (Transformer: ~6 * N * B * S)
        n_params = sum(p.numel() for p in model.parameters())
        batch_size = 1024  # global batch size
        seq_len = 4096
        theoretical_flops = 6 * n_params * batch_size * seq_len
        
        # 实际 FLOPs (H100 BF16: 989 TFLOPS)
        gpu_count = dist.get_world_size()
        peak_flops = 989e12 * gpu_count
        actual_flops = theoretical_flops / step_time
        
        return actual_flops / peak_flops
```

---

## 九、工具对比表

### 集群管理工具全景

| 工具 | 类别 | 核心功能 | 适用规模 | 开源 |
|------|------|---------|---------|------|
| Slurm | 调度器 | 批处理调度/资源管理 | 万卡 | 是 |
| Kubernetes | 编排 | 容器编排/服务发现 | 万卡 | 是 |
| GPU Operator | K8s 插件 | GPU 驱动/运行时管理 | 万卡 | 是 |
| Volcano | K8s 调度 | Gang Scheduling/队列 | 万卡 | 是 |
| DCGM | 监控 | GPU 健康/诊断/指标 | 单节点 | 否(免费) |
| dcgm-exporter | 监控 | Prometheus 指标导出 | 集群 | 是 |
| Prometheus | 监控 | 指标存储/告警 | 集群 | 是 |
| Grafana | 可视化 | Dashboard/告警 | 集群 | 是 |
| Enroot | 容器 | HPC 容器运行时 | 万卡 | 是 |
| Pyxis | Slurm 插件 | Slurm + 容器集成 | 万卡 | 是 |
| HAMi | GPU 共享 | K8s GPU 虚拟化 | 千卡 | 是 |
| Bright CM | 集群管理 | 全栈集群管理 | 万卡 | 否 |

---

## 十、最佳实践

### 10.1 运维黄金法则

1. **永远不要信任 GPU** — 假设任何 GPU 随时可能故障
2. **Checkpoint 是生命线** — 频率 = 可接受的回退时间
3. **先验证再训练** — Pre-flight check 节省数小时调试
4. **监控先行** — 没有监控的集群等于盲飞
5. **自动化一切** — 手动操作在万卡规模不可行
6. **网络是第一瓶颈** — 80% 的性能问题来自通信
7. **保持镜像一致** — 所有节点必须运行完全相同的软件栈

### 10.2 故障响应 SOP

```
故障检测 → 自动隔离 → 通知 On-call → 诊断 → 修复/替换 → 恢复训练
   |           |            |           |          |           |
 DCGM/      Drain/       PagerDuty   XID 分析   RMA/      从 Checkpoint
 XID 日志   Cordon       企微/钉钉   日志关联   重插拔     恢复
```

---

## 十一、2026 趋势

| 趋势 | 说明 | 影响 |
|------|------|------|
| NVIDIA GB200 NVL72 | 72 GPU 通过 NVLink 全互联 | 减少跨节点通信，简化网络 |
| 800Gbps XDR InfiniBand | 下一代 IB 标准 | 万卡集群带宽翻倍 |
| Ultra Ethernet Consortium | 以太网替代 IB 用于 AI | 降低网络成本 |
| 液冷普及 | 直接液冷 (DLC) 成为标配 | 降低 PUE，提高密度 |
| AI for Ops | 用 AI 预测 GPU 故障 | 从被动到主动运维 |
| 弹性训练成熟 | 节点故障不中断训练 | 提高有效训练时间 |
| 存算分离 | 计算与存储独立扩展 | 资源利用率提升 |
| 国产 GPU 集群 | 华为昇腾/寒武纪集群化 | 运维工具链适配 |

---

## 十二、相关概念

- [[SRE_for_AI_Systems]] — AI 系统 SRE 实践总纲
- [[LLM_Inference_SLO_Guide]] — 推理服务 SLO 设计
- [[GPU_OOM_Troubleshooting_Guide]] — GPU OOM 排障
- [[GPU_Troubleshooting_Cheat_Sheet]] — GPU 故障速查
- [[K8s_AI_Troubleshooting_Cheat_Sheet]] — K8s AI 排障
- [[HAMi_Troubleshooting_Cuide]] — HAMi GPU 共享排障
- [[Cost_Optimization_AI_Deep_Dive]] — AI 成本优化
- [[Model_Serving_SLA_Management]] — 模型服务 SLA 管理
- [[Chaos_Engineering_AI]] — AI 系统混沌工程
- [[AI_Incident_Response_Playbook]] — AI 事故响应手册
