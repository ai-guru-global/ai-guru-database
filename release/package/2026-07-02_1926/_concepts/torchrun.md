---
title: "torchrun 分布式训练启动器 (PyTorch Distributed Launcher)"
category: -concepts
tags: ["torchrun", "pytorch", "distributed-training", "ddp", "elastic", "ai-stack-ops"]
relationships:
  - target: "_concepts/distributed-training"
    type: related_to
  - target: "_concepts/distributed-parallelism"
    type: related_to
  - target: "_concepts/deepspeed"
    type: related_to
  - target: "_concepts/checkpoint"
    type: related_to
sources:
  - 架构基建/AI_Stack_Deep_Dive.md
summary: "torchrun 是 PyTorch 官方的分布式训练启动器（替代 torch.distributed.launch），支持弹性训练、故障自动重启，是 AI Stack 训练工具链的核心组件。"
provenance:
  extracted: 0.40
  inferred: 0.50
  ambiguous: 0.10
base_confidence: 0.85
lifecycle: reviewed
tier: supporting
---

# torchrun 分布式训练启动器

> **一句话理解**: torchrun 是 PyTorch 分布式训练的"指挥官"——一行命令启动多 GPU / 多节点训练，自动处理进程编排和故障恢复。

---

## 1. 定位与演进

| 工具 | 状态 | 说明 |
|------|------|------|
| `torch.distributed.launch` | **已废弃** | PyTorch 1.x 时代 |
| **`torchrun`** | **当前标准** | PyTorch 2.x，支持弹性 |
| `accelerate` | HuggingFace 封装 | 更高层抽象 |
| `deepspeed` | 微软分布式框架 | ZeRO/FSDP 等 |
| `swift` | ModelScope 微调框架 | SWIFT 训练 |

---

## 2. 核心功能

| 功能 | 说明 |
|------|------|
| **多进程启动** | 自动为每个 GPU 启动一个训练进程 |
| **环境变量注入** | 自动设置 RANK、WORLD_SIZE、LOCAL_RANK 等 |
| **弹性训练** | 节点故障后自动重启，支持动态节点数 |
| **多节点支持** | 跨多台机器的分布式训练 |
| **日志管理** | 统一日志输出和错误处理 |

---

## 3. 基本用法

### 3.1 单机多卡

```bash
# 单机 8 卡训练
torchrun --nproc_per_node=8 train.py

# 指定 GPU 数量
torchrun --nproc_per_node=4 train.py --batch_size 32
```

### 3.2 多机多卡

```bash
# 节点 0（master）
torchrun \
  --nnodes=2 \
  --nproc_per_node=8 \
  --master_addr=10.0.0.1 \
  --master_port=29500 \
  --node_rank=0 \
  train.py

# 节点 1（worker）
torchrun \
  --nnodes=2 \
  --nproc_per_node=8 \
  --master_addr=10.0.0.1 \
  --master_port=29500 \
  --node_rank=1 \
  train.py
```

### 3.3 弹性训练（Elastic）

```bash
# 弹性训练：允许 2-8 个节点动态加入/离开
torchrun \
  --nnodes=2:8 \
  --nproc_per_node=8 \
  --max_restarts=3 \
  --rdzv_id=my-training-job \
  --rdzv_backend=c10d \
  --rdzv_endpoint=10.0.0.1:29500 \
  train.py
```

---

## 4. 关键参数

| 参数 | 说明 | 示例 |
|------|------|------|
| `--nnodes` | 节点数（支持范围 `min:max`） | `2` 或 `2:8` |
| `--nproc_per_node` | 每节点进程数（通常=GPU 数） | `8` |
| `--master_addr` | Master 节点 IP | `10.0.0.1` |
| `--master_port` | Master 端口 | `29500` |
| `--node_rank` | 当前节点编号 | `0` |
| `--max_restarts` | 最大重启次数 | `3` |
| `--rdzv_backend` | 协调后端 | `c10d` / `etcd` |
| `--rdzv_endpoint` | 协调服务地址 | `host:port` |
| `--rdzv_id` | 训练任务 ID | `job-001` |

---

## 5. 训练代码适配

### 5.1 最小 DDP 代码

```python
import torch
import torch.distributed as dist
from torch.nn.parallel import DistributedDataParallel as DDP

# torchrun 自动设置环境变量
dist.init_process_group(backend="nccl")
local_rank = int(os.environ["LOCAL_RANK"])

# 模型包装
model = MyModel().to(local_rank)
model = DDP(model, device_ids=[local_rank])

# 训练循环
for batch in dataloader:
    loss = model(batch)
    loss.backward()
    optimizer.step()

dist.destroy_process_group()
```

### 5.2 自动注入的环境变量

| 变量 | 说明 | 示例 |
|------|------|------|
| `RANK` | 全局进程编号 | `0, 1, ..., N-1` |
| `WORLD_SIZE` | 总进程数 | `16` (2 节点 × 8 GPU) |
| `LOCAL_RANK` | 本节点内进程编号 | `0-7` |
| `MASTER_ADDR` | Master 节点地址 | `10.0.0.1` |
| `MASTER_PORT` | Master 端口 | `29500` |

---

## 6. AI Stack 训练启动器对比

| 工具 | 定位 | 特点 | 适用场景 |
|------|------|------|----------|
| **torchrun** | PyTorch 原生 | 轻量、弹性、官方维护 | DDP/FSDP 训练 |
| **accelerate** | HuggingFace | 高层抽象、配置驱动 | HF Transformers 训练 |
| **deepspeed** | 微软 | ZeRO 优化、超大规模 | 大模型预训练/微调 |
| **swift** | ModelScope | 中文模型微调、LoRA/QLoRA | 模型微调 |

### 选择决策树

```
训练启动器选择
│
├── PyTorch 原生 DDP/FSDP？ → torchrun
│   └── 轻量、无额外依赖
│
├── HuggingFace Transformers？ → accelerate
│   └── 配置驱动，支持混合精度
│
├── 超大模型 ZeRO？ → deepspeed
│   └── ZeRO-1/2/3、流水线并行
│
└── 中文模型微调？ → swift (SWIFT)
    └── LoRA/QLoRA/全参数，预置模板
```

---

## 7. 弹性训练架构

```
torchrun 弹性训练架构
│
├── 协调层 (Rendezvous)
│   ├── c10d 后端 — PyTorch 内置
│   ├── etcd 后端 — 外部 KV 存储
│   └── 节点注册、发现、投票
│
├── 弹性管理
│   ├── 节点加入 — 新节点注册到集群
│   ├── 节点离开 — 故障检测，触发重启
│   ├── 缩放 — 动态调整 worker 数量
│   └── 重启 — max_restarts 次内自动恢复
│
└── 训练进程
    ├── Worker 0 — GPU 0-7
    ├── Worker 1 — GPU 0-7
    └── Worker N — GPU 0-7
```

---

## 8. 常见故障与排查

| 问题 | 原因 | 解决 |
|------|------|------|
| NCCL timeout | GPU 间通信超时 | 增大 `NCCL_TIMEOUT`，检查 NVLink |
| OOM | GPU 显存不足 | 减小 batch_size，启用梯度累积 |
| Master 不可达 | 网络问题 | 检查 `master_addr` 和端口 |
| 进程挂起 | DDP 同步问题 | 检查所有 rank 是否同步 |
| 弹性重启失败 | 超过 max_restarts | 增大重启次数或检查硬件 |

---

## Related

- [[_concepts/distributed-training]] — 分布式训练
- [[_concepts/distributed-parallelism]] — 分布式并行策略
- [[_concepts/deepspeed]] — DeepSpeed 框架
- [[_concepts/checkpoint]] — Checkpoint 检查点
- [[_concepts/fsdp]] — FSDP 全分片数据并行
- [[架构基建/AI_Stack_Deep_Dive]] — AI Stack 深度解析
