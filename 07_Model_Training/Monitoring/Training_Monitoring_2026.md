---
title: 'Training Monitoring & Experiment Tracking 2026'
category: '07-model-training'
tags: ["model-training", "distributed-training", "optimization", "fsdp"]
summary: '> **一句话理解**: 训练监控与实验追踪是 AI 工程化的"黑匣子"，让每一次实验都可观测、可复现、可比较，从"炼丹"走向"科学"。'
created: '2026-05-31'
updated: '2026-05-31'
---

# Training Monitoring & Experiment Tracking 2026

> **一句话理解**: 训练监控与实验追踪是 AI 工程化的"黑匣子"，让每一次实验都可观测、可复现、可比较，从"炼丹"走向"科学"。

---

## 目录

1. [为什么需要监控](#1-为什么需要监控)
2. [监控指标体系](#2-监控指标体系)
3. [TensorBoard](#3-tensorboard)
4. [Weights & Biases (W&B)](#4-weights--biases-wb)
5. [MLflow](#5-mlflow)
6. [其他工具](#6-其他工具)
7. [实战代码](#7-实战代码)
8. [高级监控](#8-高级监控)
9. [实验管理最佳实践](#9-实验管理最佳实践)
10. [常见问题 (FAQ)](#10-常见问题-faq)

---

## 1. 为什么需要监控

### 1.1 训练失败的代价

| 场景 | 损失估算 | 常见原因 |
|------|----------|----------|
| Loss 爆炸（训练 3 天后）| $50K+ GPU 小时 | 学习率过高、梯度累积错误 |
| NaN 静默传播 | $20K+ GPU 小时 | 混合精度溢出、数据异常 |
| 检查点损坏 | $10K+ GPU 小时 | 存储故障、异步写入失败 |
| 数据管道阻塞 | 30-50% 时间浪费 | CPU 瓶颈、预处理过重 |
| 超参配置丢失 | 无法复现结果 | 未记录随机种子、环境版本 |

### 1.2 监控的核心价值

```mermaid
graph LR
    A[训练监控] --> B[及时止损]
    A --> C[快速迭代]
    A --> D[可复现性]
    A --> E[资源优化]
    B --> B1[Loss 异常告警]
    C --> C1[A/B 实验对比]
    D --> D1[完整配置记录]
    E --> E1[GPU 利用率提升]
```

---

## 2. 监控指标体系

### 2.1 训练指标

```mermaid
graph TD
    L[Loss] --> LT[Total Loss]
    L --> LL[Per-Layer Loss]
    LR[Learning Rate] --> LRS[Schedule]
    G[Gradient] --> GN[Gradient Norm]
    G --> GC[Gradient Clipping]
    T[Throughput] --> TS[Samples/sec]
    T --> TT[Tokens/sec]
```

| 指标 | 正常范围 | 异常信号 | 监控频率 |
|------|----------|----------|----------|
| `train/loss` | 稳定下降 | 上升/NaN/震荡 | 每 step |
| `val/loss` | 略低于 train | 持续上升（过拟合）| 每 epoch |
| `train/lr` | 按 schedule | 突然跳变 | 每 step |
| `train/grad_norm` | 1-100 | >1000 或 <0.001 | 每 step |
| `train/throughput` | 硬件上限的 70%+ | 骤降 20%+ | 每 10s |

### 2.2 硬件指标

```python
import pynvml

pynvml.nvmlInit()
handle = pynvml.nvmlDeviceGetHandleByIndex(0)

util = pynvml.nvmlDeviceGetUtilizationRates(handle)
mem = pynvml.nvmlDeviceGetMemoryInfo(handle)
temp = pynvml.nvmlDeviceGetTemperature(handle, pynvml.NVML_TEMPERATURE_GPU)
power = pynvml.nvmlDeviceGetPowerUsage(handle) / 1000.0

print(f"GPU Util: {util.gpu}%")  # 目标 >80%
print(f"Mem: {mem.used/1e9:.2f}/{mem.total/1e9:.2f} GB")
print(f"Temp: {temp}°C, Power: {power}W")
```

| 指标 | 健康阈值 | 告警阈值 | 优化方向 |
|------|----------|----------|----------|
| GPU Utilization | >70% | <50% 持续 5min | 增大 batch, 优化 data loader |
| GPU Memory | <85% | >95% | 梯度检查点, 减小 batch |
| Temperature | <80°C | >85°C | 散热优化, 降频 |
| Power Draw | 额定 80% | 持续 100% | 功耗墙限制 |

### 2.3 数据指标

| 指标 | 说明 | 优化建议 |
|------|------|----------|
| `data/loading_time` | 每次迭代数据加载耗时 | < 计算时间的 20% |
| `data/batch_distribution` | 类别分布是否均衡 | 使用 WeightedRandomSampler |
| `data/augmentation_time` | 数据增强耗时 | 移至 GPU (NVIDIA DALI) |
| `data/cache_hit_rate` | 缓存命中率 | 使用 SSD 缓存, 预处理持久化 |

---

## 3. TensorBoard

TensorBoard 是 TensorFlow 官方可视化工具，与 PyTorch 通过 `torch.utils.tensorboard` 无缝集成。

### 3.1 基础用法

```python
from torch.utils.tensorboard import SummaryWriter

writer = SummaryWriter(log_dir='runs/experiment_001')

for epoch in range(num_epochs):
    writer.add_scalar('Loss/train', train_loss, epoch)
    writer.add_scalar('Loss/val', val_loss, epoch)
    writer.add_scalar('Learning_Rate', optimizer.param_groups[0]['lr'], epoch)

writer.close()
```

启动：
```bash
tensorboard --logdir=runs --port=6006 --bind_all
```

### 3.2 直方图与 Embedding

```python
# 监控权重与梯度分布
for name, param in model.named_parameters():
    writer.add_histogram(f'weights/{name}', param, epoch)
    if param.grad is not None:
        writer.add_histogram(f'gradients/{name}', param.grad, epoch)

# Embedding 可视化（自动 t-SNE/PCA 降维）
writer.add_embedding(embeddings, metadata=labels, tag='latent_space')
```

### 3.3 超参对比

```python
hparams = {'lr': 0.001, 'batch_size': 32, 'optimizer': 'Adam'}
metrics = {'accuracy': 0.95, 'loss': 0.12}
writer.add_hparams(hparams, metrics)
```

| 特性 | 适用场景 | 局限 |
|------|----------|------|
| 标量曲线 | Loss, Accuracy 趋势 | 多实验对比不便 |
| 直方图 | 权重/梯度分布 | 大数据量时卡顿 |
| Embedding | 高维数据可视化 | 仅限 2D/3D |
| HParams | 超参网格搜索 | 不支持自动调参 |

---

## 4. Weights & Biases (W&B)

W&B 是目前最流行的云端实验追踪平台，支持团队协作与 artifact 管理。

### 4.1 快速上手

```python
import wandb

wandb.init(
    project="llm-pretraining",
    name="gpt2-medium-lr3e4",
    config={
        "learning_rate": 3e-4,
        "architecture": "GPT-2",
        "epochs": 10,
        "batch_size": 512
    }
)

for epoch in range(epochs):
    wandb.log({
        "train/loss": train_loss,
        "val/loss": val_loss,
        "learning_rate": lr,
        "throughput_samples_per_sec": throughput
    })

wandb.finish()
```

### 4.2 Artifact 与 Sweeps

```python
# Artifact 版本管理
artifact = wandb.Artifact('model-checkpoint', type='model')
artifact.add_file('checkpoint.pt')
wandb.log_artifact(artifact)

# 加载已有 artifact
artifact = wandb.use_artifact('project/model-checkpoint:v2')
artifact_dir = artifact.download()
```

```python
# Sweeps 贝叶斯超参搜索
sweep_config = {
    'method': 'bayes',
    'metric': {'name': 'val/loss', 'goal': 'minimize'},
    'parameters': {
        'learning_rate': {
            'distribution': 'log_uniform_values',
            'min': 1e-5, 'max': 1e-2
        },
        'batch_size': {'values': [256, 512, 1024]},
    }
}

sweep_id = wandb.sweep(sweep_config, project="llm-pretraining")
wandb.agent(sweep_id, function=train, count=20)
```

| 特性 | 优势 | 注意事项 |
|------|------|----------|
| 实时同步 | 训练过程中即可查看 | 需要网络连接 |
| Artifact | 模型/数据版本化管理 | 免费版存储有限 |
| Sweeps | Bayesian 优化 | 大规模搜索成本高 |
| Reports | 自动生成分析文档 | 企业版功能更全 |

---

## 5. MLflow

MLflow 是开源的机器学习生命周期管理平台，支持自托管部署。

### 5.1 Tracking 基础

```python
import mlflow
import mlflow.pytorch

mlflow.set_tracking_uri("http://localhost:5000")
mlflow.set_experiment("image-classification")

with mlflow.start_run(run_name="resnet50-aug-v2"):
    mlflow.log_param("model", "resnet50")
    mlflow.log_param("epochs", 100)
    mlflow.log_param("lr", 0.01)
    
    for epoch in range(epochs):
        mlflow.log_metric("train_loss", train_loss, step=epoch)
        mlflow.log_metric("val_accuracy", val_acc, step=epoch)
    
    mlflow.pytorch.log_model(model, "model")
    mlflow.log_artifact("training_config.yaml")
```

启动 Tracking Server：
```bash
mlflow server \
  --backend-store-uri postgresql://mlflow:pass@localhost/mlflow \
  --default-artifact-root s3://mlflow-artifacts/ \
  --host 0.0.0.0 --port 5000
```

### 5.2 Model Registry

```python
# 注册模型
result = mlflow.register_model("runs:/a1b2c3d4/model", "ImageClassifier")

# 版本状态管理
client = mlflow.tracking.MlflowClient()
client.transition_model_version_stage(
    name="ImageClassifier", version=result.version, stage="Staging"
)

# 加载生产模型
model = mlflow.pyfunc.load_model("models:/ImageClassifier/Production")
```

| 组件 | 功能 | 适用场景 |
|------|------|----------|
| Tracking | 实验记录与查询 | 自托管、数据敏感 |
| Projects | 代码打包与复现 | 标准化训练流程 |
| Models | 模型格式统一 | 跨框架部署 |
| Model Registry | 版本与生命周期 | 生产环境模型管理 |

---

## 6. 其他工具

### 6.1 工具对比总览

```mermaid
graph LR
    TB[TensorBoard] -->|本地| Local[本地优先]
    WB[W&B] -->|云端| Cloud[云服务]
    ML[MLflow] -->|混合| Hybrid[混合部署]
    NP[Neptune] -->|云端| Cloud
    CL[ClearML] -->|混合| Hybrid
    AIM[Aim] -->|本地| Local
```

| 工具 | 部署方式 | 核心优势 | 最佳场景 | 价格 |
|------|----------|----------|----------|------|
| **TensorBoard** | 本地 | 零配置、轻量 | 个人开发、快速调试 | 免费 |
| **W&B** | SaaS / 私有云 | 协作强、Artifact 管理 | 团队协作、大规模实验 | 免费版有限 |
| **MLflow** | 自托管 | 开源、灵活 | 企业内网、数据合规 | 免费 |
| **Neptune** | SaaS | 快速 setup、Notebook 追踪 | 深度学习研究 | 免费版有限 |
| **Comet** | SaaS | 生产监控集成 | MLOps 全流程 | 免费版有限 |
| **ClearML** | 自托管 / SaaS | 端到端平台、Agent 调度 | 企业 MLOps 平台 | 开源免费 |
| **Aim** | 本地 | 高性能、大规模运行对比 | 超大规模实验对比 | 免费 |

### 6.2 快速示例

**Neptune：**
```python
import neptune
run = neptune.init_run(project="workspace/project")
run["parameters"] = {"lr": 0.001, "batch_size": 32}
run["train/loss"].append(train_loss)
run.stop()
```

**Comet：**
```python
from comet_ml import Experiment
experiment = Experiment(api_key="key", project_name="nlp")
experiment.log_parameters({"lr": 0.001})
experiment.log_metric("loss", loss, step=epoch)
```

**ClearML：**
```python
from clearml import Task
task = Task.init(project_name="NLP", task_name="BERT Fine-tuning")
task.connect({"lr": 2e-5, "epochs": 3})
logger = task.get_logger()
logger.report_scalar("loss", "train", iteration=epoch, value=loss)
```

**Aim：**
```python
from aim import Run
run = Run()
run["hparams"] = {"lr": 0.001, "batch_size": 32}
run.track(loss, name="loss", step=step, context={"subset": "train"})
```

---

## 7. 实战代码

### 7.1 统一 Logger 封装

```python
"""Unified Training Logger — 支持 TensorBoard, W&B, MLflow 切换与组合"""
from typing import Optional, Dict, Any
from pathlib import Path


class UnifiedLogger:
    def __init__(
        self,
        exp_name: str,
        log_dir: str = "./logs",
        use_tensorboard: bool = True,
        use_wandb: bool = False,
        use_mlflow: bool = False,
        wandb_project: Optional[str] = None,
        mlflow_tracking_uri: Optional[str] = None,
        config: Optional[Dict[str, Any]] = None
    ):
        self.log_dir = Path(log_dir) / exp_name
        self.log_dir.mkdir(parents=True, exist_ok=True)
        self.loggers = {}
        self.config = config or {}
        
        if use_tensorboard:
            from torch.utils.tensorboard import SummaryWriter
            self.loggers['tensorboard'] = SummaryWriter(self.log_dir / 'tb')
        
        if use_wandb:
            import wandb
            wandb.init(
                project=wandb_project or exp_name,
                name=exp_name,
                config=self.config,
                dir=str(self.log_dir)
            )
            self.loggers['wandb'] = wandb
        
        if use_mlflow:
            import mlflow
            if mlflow_tracking_uri:
                mlflow.set_tracking_uri(mlflow_tracking_uri)
            mlflow.set_experiment(exp_name)
            mlflow.start_run()
            for k, v in self.config.items():
                mlflow.log_param(k, v)
            self.loggers['mlflow'] = mlflow
    
    def log_scalar(self, tag: str, value: float, step: int):
        if 'tensorboard' in self.loggers:
            self.loggers['tensorboard'].add_scalar(tag, value, step)
        if 'wandb' in self.loggers:
            self.loggers['wandb'].log({tag: value}, step=step)
        if 'mlflow' in self.loggers:
            self.loggers['mlflow'].log_metric(tag, value, step=step)
    
    def log_scalars(self, scalars: Dict[str, float], step: int):
        for tag, value in scalars.items():
            self.log_scalar(tag, value, step)
    
    def log_histogram(self, tag: str, values, step: int):
        if 'tensorboard' in self.loggers:
            self.loggers['tensorboard'].add_histogram(tag, values, step)
    
    def log_artifact(self, filepath: str):
        if 'wandb' in self.loggers:
            artifact = self.loggers['wandb'].Artifact(Path(filepath).name, type='artifact')
            artifact.add_file(filepath)
            self.loggers['wandb'].log_artifact(artifact)
        if 'mlflow' in self.loggers:
            self.loggers['mlflow'].log_artifact(filepath)
    
    def close(self):
        if 'tensorboard' in self.loggers:
            self.loggers['tensorboard'].close()
        if 'wandb' in self.loggers:
            self.loggers['wandb'].finish()
        if 'mlflow' in self.loggers:
            self.loggers['mlflow'].end_run()
```

### 7.2 训练循环集成

```python
import torch
import torch.nn as nn
from torch.utils.data import DataLoader


def train_with_monitoring(
    model: nn.Module,
    train_loader: DataLoader,
    val_loader: DataLoader,
    criterion: nn.Module,
    optimizer: torch.optim.Optimizer,
    scheduler,
    logger: UnifiedLogger,
    num_epochs: int,
    device: str = "cuda",
    grad_clip: float = 1.0
):
    model.to(device)
    global_step = 0
    
    for epoch in range(num_epochs):
        model.train()
        epoch_loss = epoch_correct = epoch_total = 0
        
        for batch_idx, (inputs, targets) in enumerate(train_loader):
            inputs, targets = inputs.to(device), targets.to(device)
            
            optimizer.zero_grad()
            outputs = model(inputs)
            loss = criterion(outputs, targets)
            loss.backward()
            
            grad_norm = torch.nn.utils.clip_grad_norm_(model.parameters(), grad_clip)
            optimizer.step()
            
            _, predicted = outputs.max(1)
            epoch_total += targets.size(0)
            epoch_correct += predicted.eq(targets).sum().item()
            epoch_loss += loss.item()
            
            if batch_idx % 10 == 0:
                logger.log_scalars({
                    "train/step_loss": loss.item(),
                    "train/grad_norm": grad_norm.item(),
                    "train/lr": optimizer.param_groups[0]['lr']
                }, step=global_step)
            
            global_step += 1
        
        logger.log_scalars({
            "train/epoch_loss": epoch_loss / len(train_loader),
            "train/epoch_acc": 100. * epoch_correct / epoch_total
        }, step=epoch)
        
        # 验证
        model.eval()
        val_loss = val_correct = val_total = 0
        with torch.no_grad():
            for inputs, targets in val_loader:
                inputs, targets = inputs.to(device), targets.to(device)
                outputs = model(inputs)
                val_loss += criterion(outputs, targets).item()
                val_correct += outputs.max(1)[1].eq(targets).sum().item()
                val_total += targets.size(0)
        
        logger.log_scalars({
            "val/loss": val_loss / len(val_loader),
            "val/accuracy": 100. * val_correct / val_total
        }, step=epoch)
        
        if scheduler is not None:
            scheduler.step()
        
        if (epoch + 1) % 10 == 0:
            ckpt = f"ckpt_epoch_{epoch+1}.pt"
            torch.save({'epoch': epoch, 'state_dict': model.state_dict()}, ckpt)
            logger.log_artifact(ckpt)
    
    return model
```

---

## 8. 高级监控

### 8.1 分布式训练监控

```mermaid
graph TD
    subgraph 节点 0
        R0[Rank 0] --> G0[聚合指标]
        R1[Rank 1] --> G0
        R2[Rank 2] --> G0
        R3[Rank 3] --> G0
    end
    subgraph 节点 1
        R4[Rank 4] --> G1[聚合指标]
        R5[Rank 5] --> G1
        R6[Rank 6] --> G1
        R7[Rank 7] --> G1
    end
    G0 --> M[主 Rank 0]
    G1 --> M
    M --> TB[TensorBoard]
    M --> WB[W&B]
```

```python
import torch.distributed as dist


def gather_metrics(local_metric: float, world_size: int) -> list:
    if not dist.is_initialized():
        return [local_metric]
    metric_tensor = torch.tensor([local_metric], device='cuda')
    gathered = [torch.zeros(1, device='cuda') for _ in range(world_size)]
    dist.all_gather(gathered, metric_tensor)
    return [t.item() for t in gathered]


def log_distributed_metrics(logger, metrics: dict, step: int, rank: int = 0):
    world_size = dist.get_world_size() if dist.is_initialized() else 1
    for key, value in metrics.items():
        gathered = gather_metrics(value, world_size)
        if rank == 0:
            logger.log_scalars({
                f"{key}_mean": sum(gathered) / len(gathered),
                f"{key}_max": max(gathered),
                f"{key}_min": min(gathered)
            }, step=step)
```

详见 [./Distributed_Training_2026.md](./Distributed_Training_2026.md) 获取更完整的分布式训练监控方案。

### 8.2 异常检测与自动告警

```python
from collections import deque
import numpy as np


class TrainingAnomalyDetector:
    """检测: Loss 爆炸、NaN、梯度消失、吞吐量骤降"""
    
    def __init__(
        self,
        loss_spike_threshold: float = 10.0,
        grad_vanish_threshold: float = 1e-6,
        throughput_drop_threshold: float = 0.5,
        window_size: int = 10
    ):
        self.loss_spike = loss_spike_threshold
        self.grad_vanish = grad_vanish_threshold
        self.throughput_drop = throughput_drop_threshold
        self.loss_hist = deque(maxlen=window_size)
        self.grad_hist = deque(maxlen=window_size)
        self.prev_loss = None
    
    def check(self, metrics: dict) -> list:
        anomalies = []
        
        if 'loss' in metrics:
            loss = metrics['loss']
            if np.isnan(loss) or np.isinf(loss):
                anomalies.append({'type': 'loss_nan', 'severity': 'critical',
                                  'message': f'Loss is NaN/Inf: {loss}'})
            elif self.prev_loss and loss / (self.prev_loss + 1e-10) > self.loss_spike:
                anomalies.append({'type': 'loss_spike', 'severity': 'high',
                                  'message': f'Loss spike: {self.prev_loss:.4f} -> {loss:.4f}'})
            self.prev_loss = loss
        
        if 'grad_norm' in metrics:
            self.grad_hist.append(metrics['grad_norm'])
            if len(self.grad_hist) >= 5:
                avg = np.mean(list(self.grad_hist)[-5:])
                if avg < self.grad_vanish:
                    anomalies.append({'type': 'grad_vanish', 'severity': 'high',
                                      'message': f'Gradient vanishing: {avg:.2e}'})
        
        return anomalies
```

### 8.3 自动告警系统

```python
import requests


class AlertManager:
    def __init__(self, config: dict):
        self.config = config
        self.cooldown = {}
    
    def send_slack(self, message: str, severity: str = "warning"):
        webhook = self.config.get('slack_webhook')
        if not webhook:
            return
        color = {"info": "good", "warning": "warning",
                 "high": "danger", "critical": "danger"}.get(severity, "warning")
        payload = {"attachments": [{"color": color, "title": f"Alert: {severity.upper()}",
                                     "text": message}]}
        try:
            requests.post(webhook, json=payload, timeout=10)
        except Exception as e:
            print(f"Slack alert failed: {e}")
    
    def alert(self, anomaly: dict, cooldown_seconds: int = 300):
        alert_type = anomaly['type']
        import time
        now = time.time()
        if alert_type in self.cooldown and now - self.cooldown[alert_type] < cooldown_seconds:
            return
        self.cooldown[alert_type] = now
        self.send_slack(anomaly['message'], anomaly['severity'])
```

---

## 9. 实验管理最佳实践

### 9.1 命名规范

| 层级 | 命名格式 | 示例 |
|------|----------|------|
| 项目 | `{domain}-{task}` | `nlp-summarization` |
| 实验 | `{model}-{dataset}-{date}` | `bart-cnn-20260507` |
| 运行 | `{exp}-{hyperparam}-{trial}` | `bart-cnn-lr3e5-t01` |
| 检查点 | `ckpt-{epoch}-{metric}` | `ckpt-e10-loss1.23.pt` |

### 9.2 配置版本化

```python
import yaml
import json
import hashlib
from dataclasses import dataclass, asdict


@dataclass
class TrainingConfig:
    model: str = "resnet50"
    epochs: int = 100
    batch_size: int = 128
    learning_rate: float = 0.1
    seed: int = 42
    
    def save(self, path: str):
        with open(path, 'w') as f:
            yaml.dump(asdict(self), f)
    
    @classmethod
    def load(cls, path: str):
        with open(path) as f:
            return cls(**yaml.safe_load(f))
    
    def hash(self) -> str:
        return hashlib.md5(
            json.dumps(asdict(self), sort_keys=True).encode()
        ).hexdigest()[:8]
```

### 9.3 可复现性检查清单

```markdown
- [ ] **代码版本**: Git commit hash 已记录
- [ ] **配置文件**: 完整配置已保存并与代码一起版本化
- [ ] **随机种子**: Python, NumPy, PyTorch, CUDA 的随机种子已设置
- [ ] **环境依赖**: requirements.txt / poetry.lock 已锁定
- [ ] **数据版本**: 数据集版本或哈希已记录
- [ ] **硬件信息**: GPU 型号、驱动版本、CUDA 版本已记录
- [ ] **超参数**: 所有可调参数已记录，无默认值依赖
- [ ] **检查点**: 定期保存模型和优化器状态
- [ ] **日志**: 训练日志完整，包含 loss、metrics、资源使用
- [ ] **评估协议**: 验证/测试集划分方式已记录
```

```python
import random
import numpy as np
import torch


def set_seed(seed: int = 42):
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    torch.cuda.manual_seed_all(seed)
    torch.backends.cudnn.deterministic = True
    torch.backends.cudnn.benchmark = False


def log_system_info(logger):
    import platform, subprocess
    info = {
        "python": platform.python_version(),
        "pytorch": torch.__version__,
        "cuda": torch.version.cuda,
        "gpu": torch.cuda.get_device_name(0) if torch.cuda.is_available() else "CPU",
        "platform": platform.platform()
    }
    try:
        info["git"] = subprocess.check_output(
            ['git', 'rev-parse', '--short', 'HEAD']
        ).decode().strip()
    except:
        info["git"] = "unknown"
    return info
```

---

## 10. 常见问题 (FAQ)

### Q1: TensorBoard 日志不显示或显示为空

| 症状 | 原因 | 解决方案 |
|------|------|----------|
| 页面空白 | `log_dir` 路径错误 | 确认 `--logdir` 与 SummaryWriter 目录一致 |
| 曲线不更新 | 缓存未刷新 | 点击刷新或设 `--reload_interval` |
| 多实验混乱 | 子目录命名冲突 | 使用唯一子目录如 `runs/exp_{timestamp}` |
| 端口被占用 | 6006 端口占用 | `tensorboard --port=6007` |
| WSL 无法访问 | 绑定地址限制 | `tensorboard --bind_all` |

```bash
tensorboard --logdir=./runs --port=6006 --bind_all --reload_multifile=True
```

### Q2: W&B 同步慢或网络超时

```python
# 增加同步间隔
wandb.init(settings=wandb.Settings(_stats_sample_rate_seconds=60))

# 离线模式，训练后同步
# export WANDB_MODE=offline
wandb.init(mode="offline")
# 训练后: wandb sync ./wandb/offline-run-*

# 减少日志频率
if step % 100 == 0:
    wandb.log(metrics)
```

### Q3: MLflow Tracking Server 配置问题

```bash
# 本地文件模式
mlflow server --backend-store-uri ./mlruns --default-artifact-root ./artifacts

# 生产配置 (PostgreSQL + S3)
mlflow server \
  --backend-store-uri postgresql://user:pass@host:5432/mlflow \
  --default-artifact-root s3://bucket/mlflow-artifacts/ \
  --host 0.0.0.0 --port 5000
```

| 问题 | 排查方法 | 解决方案 |
|------|----------|----------|
| 无法连接数据库 | `psql -h host -U user -d mlflow` | 检查网络、权限、数据库存在性 |
| Artifact 上传失败 | `aws s3 ls s3://bucket/` | 检查 AWS 凭证与 S3 权限 |
| UI 加载慢 | 查看 server 日志 | 增加连接池、使用 SSD |
| 数据丢失 | 检查 `backend-store-uri` | 避免生产环境使用默认 SQLite |

### Q4: 如何选择合适的追踪工具？

```mermaid
flowchart TD
    A[选择实验追踪工具] --> B{数据能否上云?}
    B -->|可以| C{团队规模?}
    B -->|不可以| D[MLflow / ClearML 私有化]
    C -->|个人| E[TensorBoard + Aim]
    C -->|小团队| F[W&B 免费版 / Neptune]
    C -->|大团队| G{需要全链路 MLOps?}
    G -->|是| H[ClearML / W&B Enterprise]
    G -->|否| I[W&B / MLflow]
```

### Q5: 多机训练中各 rank 指标不一致怎么办？

```python
import torch.distributed as dist

def all_reduce_average(tensor):
    if not dist.is_initialized():
        return tensor
    dist.all_reduce(tensor, op=dist.ReduceOp.SUM)
    tensor /= dist.get_world_size()
    return tensor

loss_tensor = torch.tensor([loss_value], device='cuda')
loss_tensor = all_reduce_average(loss_tensor)
```

---

## 相关章节

- **分布式训练监控**: 详见 [./Distributed_Training_2026.md](./Distributed_Training_2026.md)
- **MLOps 流水线集成**: 详见 [../11_MLOps_Pipeline/](../11_MLOps_Pipeline/)
- **生产环境可观测性**: 详见 [../13_AI_Ops/AI_Observability_Guide.md](../11_MLOps_Pipeline/AI_Observability_Guide.md)

---

*Last updated: 2026-05-07*

## Related

- [[07_Model_Training/Distributed_Training_2026.md|Distributed_Training_2026]]
- [[07_Model_Training/Distributed_Training_for_dummy.md|Distributed_Training_for_dummy]]
- [[07_Model_Training/Mixed_Precision_Training.md|Mixed_Precision_Training]]
- [[07_Model_Training/Model-Training-in-nutshell.md|Model-Training-in-nutshell]]
- [[07_Model_Training/Model_Training_for_dummy.md|Model_Training_for_dummy]]
