---
title: 训练基础设施 (Training Infrastructure)
category: 05-training
tags: ["training-infra", "gpu-cluster", "networking", "checkpointing", "storage"]
summary: "大模型训练基础设施完整指南：GPU 集群网络拓扑、并行文件系统、检查点策略、故障恢复、万卡训练实践与 2026 基础设施选型。"
created: 2026-07-21
updated: 2026-07-21
tier: supporting
sources: []

---
# 训练基础设施 (Training Infrastructure)

## 1. GPU 集群架构

### 1.1 网络拓扑

```
万卡训练集群典型拓扑:

Level 1: 节点内 (8 GPU)
  └─ NVLink/NVSwitch: 900 GB/s (B200)
  └─ 延迟: <1μs

Level 2: 节点间 (同机架, 32-64 GPU)
  └─ InfiniBand NDR: 400 Gbps × 8 = 3.2 Tbps
  └─ 或 RoCE v2: 以太网方案
  └─ 延迟: ~1-5μs

Level 3: 机架间 (同集群, 1000+ GPU)
  └─ Fat-Tree / Dragonfly 拓扑
  └─ 多层交换机
  └─ 延迟: ~5-20μs

Level 4: 跨数据中心 (2026 新趋势)
  └─ 专线互联: 100+ Gbps
  └─ 异步训练 / Pipeline 切分
  └─ 延迟: ~1-10ms
```

### 1.2 硬件选型 (2026)

| 组件 | 选项 | 规格 | 适用 |
|------|------|------|------|
| GPU | NVIDIA B200 | 192GB HBM3e, 8TB/s | 训练+推理 |
| GPU | NVIDIA H100 SXM | 80GB HBM3, 3.35TB/s | 训练 |
| GPU | AMD MI300X | 192GB HBM3, 5.3TB/s | 训练 |
| 互联 | NVLink 5.0 | 1.8TB/s (B200) | 节点内 |
| 网络 | InfiniBand NDR | 400Gbps | 节点间 |
| 网络 | RoCE v2 (以太网) | 400Gbps | 性价比 |
| 存储 | Lustre/GPFS | 100+ GB/s 聚合 | 数据+检查点 |
| CPU | AMD EPYC 9004 | 96-128 核 | 数据预处理 |

## 2. 存储系统

### 2.1 并行文件系统

```python
# 训练存储需求:

STORAGE_REQUIREMENTS = {
    "训练数据": {
        "容量": "10-100 TB (原始文本/图像)",
        "吞吐": "10+ GB/s 读取",
        "模式": "顺序读取为主",
        "方案": "Lustre / GPFS / WekaFS / 3FS",
    },
    "检查点": {
        "容量": "模型大小 × 保留数 (如 7B×10=70GB)",
        "写入": "突发高带宽 (保存时)",
        "频率": "每 1000 步或每 30 分钟",
        "方案": "高速 SSD + 异步写",
    },
    "日志/指标": {
        "容量": "小 (GB 级)",
        "写入": "持续低带宽",
        "方案": "本地 SSD → 异步上传",
    },
}

# 2026 趋势: 3FS (Fire-Flyer File System)
# - DeepSeek 开源的并行文件系统
# - 专为 AI 训练设计
# - 利用 NVMe SSD + RDMA
# - 聚合带宽: 100+ GB/s
```

### 2.2 数据加载优化

```python
# 高效数据加载:

class TrainingDataLoader:
    """
    训练数据加载最佳实践:
    1. 预分片: 数据按 GPU 数预分片
    2. 预取: 异步预取下一批
    3. 内存映射: 大文件 mmap
    4. 格式: 使用高效格式 (Arrow/TFRecord/WebDataset)
    """
    def __init__(self, data_path, world_size, rank):
        # 每个 GPU 读自己的分片
        self.shard_path = f"{data_path}/shard_{rank:04d}.arrow"
        self.prefetch_queue = queue.Queue(maxsize=4)
    
    def prefetch_worker(self):
        """后台预取线程"""
        for batch in self.iterate_shard():
            self.prefetch_queue.put(batch)
    
    def __next__(self):
        return self.prefetch_queue.get()
```

## 3. 检查点策略

### 3.1 异步检查点

```python
import torch.distributed.checkpoint as dcp

class AsyncCheckpointer:
    """
    异步检查点: 不阻塞训练
    
    流程:
    1. 将状态复制到 CPU 内存 (快, ~1s)
    2. 后台线程写入磁盘 (慢, ~30s)
    3. 训练继续，不等待写入完成
    """
    def __init__(self, model, optimizer, save_dir, 
                 interval_steps=1000, keep_last=5):
        self.model = model
        self.optimizer = optimizer
        self.save_dir = save_dir
        self.interval = interval_steps
        self.keep_last = keep_last
        self.save_thread = None
    
    def maybe_save(self, step):
        if step % self.interval != 0:
            return
        
        # 1. 快速复制到 CPU (阻塞, 但很快)
        state = {
            "model": {k: v.cpu().clone() 
                     for k, v in self.model.state_dict().items()},
            "optimizer": self.optimizer.state_dict(),
            "step": step,
        }
        
        # 2. 异步写入磁盘 (不阻塞训练)
        if self.save_thread and self.save_thread.is_alive():
            self.save_thread.join()  # 等上一次完成
        
        self.save_thread = threading.Thread(
            target=self._write_to_disk, args=(state, step)
        )
        self.save_thread.start()
    
    def _write_to_disk(self, state, step):
        path = f"{self.save_dir}/checkpoint_{step}"
        torch.save(state, path)
        self._cleanup_old()
```

### 3.2 故障恢复

```python
class FaultTolerance:
    """
    万卡训练故障处理:
    - 平均故障间隔: ~几小时 (1000+ GPU)
    - 必须自动检测 + 自动恢复
    """
    def __init__(self, checkpointer):
        self.checkpointer = checkpointer
    
    def recover_from_failure(self):
        """从最近的检查点恢复"""
        latest = self.find_latest_checkpoint()
        state = torch.load(latest, weights_only=False)  # 生产环境用 safetensors
        
        self.model.load_state_dict(state["model"])
        self.optimizer.load_state_dict(state["optimizer"])
        start_step = state["step"]
        
        # 跳过已处理的数据
        dataloader.skip_to(start_step)
        
        return start_step
    
    def health_check(self):
        """GPU 健康检查"""
        # NCCL 通信测试
        # GPU 温度/功耗监控
        # ECC 错误检测
        # 网络连通性
        pass

# 2026 实践:
# - 每 500 步保存检查点
# - 保留最近 5 个
# - 故障自动重启 (Kubernetes/Slurm)
# - 弹性训练: 节点故障后自动缩减继续
```

## 4. 训练编排

### 4.1 集群调度

```yaml
# Slurm 提交脚本 (万卡训练):
"""
#!/bin/bash
#SBATCH --job-name=llm-pretrain
#SBATCH --nodes=128           # 128 节点 × 8 GPU = 1024 GPU
#SBATCH --gpus-per-node=8
#SBATCH --cpus-per-task=96
#SBATCH --mem=2000G
#SBATCH --time=72:00:00       # 72 小时
#SBATCH --partition=gpu
#SBATCH --exclusive

# 环境
source activate train_env
export NCCL_DEBUG=WARN
export NCCL_IB_DISABLE=0
export NCCL_NET_GDR_LEVEL=5

# 启动
srun python train.py \
    --model llama-70b \
    --data /lustre/train_data/ \
    --batch-size 1024 \
    --seq-length 4096 \
    --lr 3e-4 \
    --steps 100000 \
    --checkpoint-interval 500 \
    --resume-from-latest
"""
```

## 5. 监控与告警

```python
TRAINING_MONITORING = {
    "GPU 指标": ["利用率", "温度", "功耗", "ECC错误", "NVLink带宽"],
    "训练指标": ["loss", "grad_norm", "learning_rate", "throughput(tokens/s)"],
    "系统指标": ["CPU利用率", "内存使用", "磁盘IO", "网络带宽"],
    "告警规则": [
        "loss 突然飙升 > 3x → 可能数据问题",
        "grad_norm > 100 → 可能不稳定",
        "GPU 利用率 < 80% → 通信瓶颈",
        "温度 > 85°C → 降频风险",
        "ECC 错误 > 0 → 需要更换 GPU",
    ],
}
```

## 6. 交叉引用

- [[07_模型训练/04_Distributed_Training/|分布式训练]]
- [[07_模型训练/Mixed_Precision_Training/|混合精度训练]]
- [[07_模型训练/Pretraining_Playbook/|预训练手册]]
- [[12_架构基建/|架构基建]]
- [[13_运维/|运维]]
- [[07_模型训练/07_Monitoring/|训练监控]]
