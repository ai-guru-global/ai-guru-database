---
title: "DeepSpeed 入门：用更少的 GPU 训练更大的模型"
category: "07-model-training"
tags: ["deepspeed", "distributed-training", "microsoft", "zero", "parallelism", "for-dummy"]
summary: "> **一句话理解**: DeepSpeed 是微软开源的「大模型训练加速器」，它能把模型权重、梯度和优化器状态切分成小块分散到多张 GPU 甚至电脑内存/硬盘上，让你在原来训练不了的超大模型上跑起来。"
created: "2026-06-17"
updated: "2026-06-17"
tier: supporting
aliases:
  - "Deepspeed For Dummy"
  - "DeepSpeed for dummy"
  - DeepSpeed_for_dummy
sources: []

---
# DeepSpeed 入门：用更少的 GPU 训练更大的模型

> **一句话理解**: DeepSpeed 是微软开源的「大模型训练加速器」，它能把模型权重、梯度和优化器状态切分成小块分散到多张 GPU 甚至电脑内存/硬盘上，让你在原来训练不了的超大模型上跑起来。

---

## 1. 为什么需要 DeepSpeed？

### 1.1 一个常见痛点

假设你有一张 24GB 显存的 RTX 4090，想微调一个 7B 参数的大模型。用普通 PyTorch 直接加载模型时：

```
7B 参数 × 2 字节(FP16) = 14 GB 模型权重
梯度 ≈ 14 GB
Adam 优化器状态 ≈ 56 GB (7B × 8 字节)
激活值 ≈ 数 GB
─────────────────────────────
总计 ≈ 80+ GB 显存需求
```

单卡根本放不下，训练直接报错 `CUDA out of memory`。

### 1.2 DeepSpeed 带来的改变

DeepSpeed 会把这些「大家伙」切成小块：

```
原本 1 张卡要存 80 GB
    │
    ▼  ZeRO 分片
4 张卡每张只需存 20 GB
    │
    ▼  CPU/NVMe Offload
更多东西放到内存/硬盘，GPU 只存正在计算的部分
```

于是 24GB 显存的卡也能训练 7B 甚至更大的模型。

---

## 2. DeepSpeed 是什么？

**DeepSpeed** = 微软开源的深度学习训练与推理优化库。

通俗地说，它在 PyTorch 外面包了一层，帮你自动处理：
- 多卡、多机之间的通信。
- 大模型的显存分片。
- 把数据从 CPU/硬盘搬进 GPU。
- 混合精度训练、梯度累积、Checkpoint 保存。

你只需要写普通的 PyTorch 训练代码，然后告诉 DeepSpeed：「请帮我分片」。

---

## 3. 几个必须知道的概念

### 3.1 ZeRO

ZeRO（Zero Redundancy Optimizer）是 DeepSpeed 的看家本领。

| 阶段 | 大白话解释 |
|------|-----------|
| **ZeRO-1** | 只把「优化器状态」切分到不同 GPU |
| **ZeRO-2** | 再把「梯度」也切分 |
| **ZeRO-3** | 连「模型权重」也切分，单卡只存当前需要算的部分 |
| **Offload** | 把切分后的数据放到 CPU 内存或硬盘，GPU 忙完再取 |

阶段越高，省显存越多，但通信也越多，速度可能越慢。

### 3.2 数据并行、张量并行、流水线并行

- **数据并行**：把一批数据分成多份，每张卡算一份，最后汇总梯度。
- **张量并行**：把一层网络切成多块，不同卡算同层的不同部分。
- **流水线并行**：把模型纵向切成多段，每张卡负责一段。

DeepSpeed 能把它们组合起来，这就是常说的 **3D 并行**。

---

## 4. 安装 DeepSpeed

```bash
# 确保已经安装 PyTorch 和 CUDA 驱动
pip install deepspeed

# 检查安装是否正常
ds_report
```

如果看到 CUDA、NCCL 都显示 `available`，说明环境没问题。

---

## 5. 最简单的使用方式

### 5.1 写一个配置文件 `ds_config.json`

```json
{
  "train_batch_size": 16,
  "gradient_accumulation_steps": 2,
  "optimizer": {
    "type": "AdamW",
    "params": { "lr": 5e-5 }
  },
  "fp16": { "enabled": true },
  "zero_optimization": {
    "stage": 2
  }
}
```

这里 `stage: 2` 表示启用 ZeRO-2。

### 5.2 改 3 行训练代码

```python
import deepspeed

# 1. 用 deepspeed.initialize 包装模型
model_engine, optimizer, _, _ = deepspeed.initialize(
    model=model,
    model_parameters=model.parameters(),
    config_params="ds_config.json",
)

for batch in dataloader:
    loss = model_engine(batch)

    # 2. 把 backward 和 step 交给 DeepSpeed
    model_engine.backward(loss)
    model_engine.step()
```

### 5.3 启动训练

```bash
# 单机 4 卡
deepspeed --num_gpus=4 train.py
```

就这么简单，DeepSpeed 会自动启动 4 个进程，帮你完成分布式初始化。

---

## 6. 与 Hugging Face 一起用

如果你用 Transformers 训练，更简单：

```python
from transformers import TrainingArguments, Trainer

training_args = TrainingArguments(
    output_dir="./output",
    deepspeed="ds_config.json",   # 只需这一行
    per_device_train_batch_size=2,
    num_train_epochs=3,
)

trainer = Trainer(model=model, args=training_args, train_dataset=dataset)
trainer.train()
```

Hugging Face 会帮你把 DeepSpeed 集成好，几乎不用改代码。

---

## 7. 常见使用场景

### 7.1 单卡微调大模型

用 ZeRO-3 + CPU Offload，24GB 显卡可以微调 7B 模型：

```json
{
  "zero_optimization": {
    "stage": 3,
    "offload_optimizer": { "device": "cpu", "pin_memory": true },
    "offload_param": { "device": "cpu", "pin_memory": true }
  }
}
```

### 7.2 多机预训练

把模型拆到多台机器上，每台机器多张卡：

```bash
deepspeed --num_gpus=8 --num_nodes=4 \
  --master_addr=10.0.0.1 --master_port=29500 \
  pretrain.py
```

### 7.3 大模型推理

训练完后，用 DeepSpeed-Inference 加速推理：

```python
import deepspeed

model = deepspeed.init_inference(
    model,
    mp_size=2,          # 2 张卡做张量并行
    dtype=torch.half,   # FP16
    replace_with_kernel_inject=True,
)
```

---

## 8. 遇到问题怎么办？

1. **显存还是不够** → 尝试提高 ZeRO stage，或开启 CPU/NVMe Offload。
2. **训练速度变慢** → ZeRO-3 / Offload 通信开销大，可降到 ZeRO-2 或加 GPU。
3. **多机卡住** → 检查 NCCL 版本、防火墙、节点间是否能互相访问。
4. **报错 `CUDA out of memory`** → 减小 batch size、开启 gradient checkpointing、使用 Offload。
5. **Checkpoint 文件很大** → 只保存 fp16 权重，删除优化器状态可大幅瘦身。

---

## 9. 进阶学习路径

1. 想深入原理 → [[07_Model_Training/Distributed_Training/DeepSpeed_Deep_Dive]]
2. 想看分布式训练全景 → [[07_Model_Training/Distributed_Training/Distributed_Training_2026]]
3. 想零基础了解训练 → [[07_Model_Training/Model_Training_for_dummy]]
4. 想配合 Hugging Face 使用 → [[07_Model_Training/Distributed_Training/HF_Accelerate_DeepSpeed_Guide]]
5. 想快速查阅 → [[_concepts/deepspeed]]

---

## Related

- [[_concepts/deepspeed]] — DeepSpeed 概念卡片
- [[07_Model_Training/Distributed_Training/DeepSpeed_Deep_Dive]] — DeepSpeed 深度解析
- [[07_Model_Training/Distributed_Training/Distributed_Training_2026]] — 分布式训练全景
- [[07_Model_Training/Model_Training_for_dummy]] — 模型训练入门
- [[07_Model_Training/Distributed_Training/HF_Accelerate_DeepSpeed_Guide]] — Accelerate + DeepSpeed 极简指南
- [[_concepts/hami]] — HAMi GPU 虚拟化

- [[07_Model_Training/README|模型训练 (Model Training)]]
