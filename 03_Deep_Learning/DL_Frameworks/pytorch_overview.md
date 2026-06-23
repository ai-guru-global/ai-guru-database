---
title: "PyTorch 概览"
category: "03-deep-learning-dl-frameworks"
tags: ["deep-learning", "framework", "neural-network", "pytorch", "meta"]
summary: "Meta 出品的主流深度学习框架，动态计算图（define-by-run），Pythonic API，研究社区首选，2026 年深度学习事实标准。"
sources:
  - "https://pytorch.org/"
created: 2026-06-12
updated: 2026-06-23
lifecycle: reviewed
---

# PyTorch 概览

> **一句话理解**: Meta 出品的主流深度学习框架，动态计算图（define-by-run），Pythonic API，研究社区首选，2026 年深度学习事实标准。

## 简介

PyTorch 于 2016 年由 Meta（原 Facebook）AI 研究团队发布，基于 Torch 改用 Python 前端。其**动态计算图**（define-by-run）设计让调试像写普通 Python 一样直观，迅速成为学术界首选——2020 年后 NeurIPS/ICML 论文超 80% 使用 PyTorch。Hugging Face Transformers 默认后端即为 PyTorch。

**官网**: [pytorch.org](https://pytorch.org/) · **最新版本**: PyTorch 3.0（2026）

## 核心特性

| 特性 | 说明 |
|------|------|
| **动态计算图** | 运行时构建图，可随时 print/断点，调试友好 |
| **autograd** | 自动微分引擎，支持高阶梯度 |
| **TorchScript** | 将动态图导出为静态图，便于部署 |
| **DistributedDataParallel** | 原生分布式训练（多 GPU/多机） |
| **torch.compile** | 2.0+ 引入，一键编译加速 30-60% |
| **CUDA / MPS** | 支持 NVIDIA GPU 与 Apple Silicon |
| **FX / TorchExport** | 图捕获与导出（AOT 编译、量化） |
| **生态丰富** | torchvision/torchaudio/torchtext + HF 生态 |

## 典型用法

```python
import torch
import torch.nn as nn

# 定义模型
class MLP(nn.Module):
    def __init__(self):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(784, 256), nn.ReLU(),
            nn.Linear(256, 10)
        )
    def forward(self, x):
        return self.net(x)

model = MLP().cuda()  # 移到 GPU
optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)
loss_fn = nn.CrossEntropyLoss()

# 训练循环（动态图，可断点调试）
for x, y in dataloader:
    x, y = x.cuda(), y.cuda()
    pred = model(x)            # 前向：自动构建图
    loss = loss_fn(pred, y)    # 计算损失
    loss.backward()            # 反向：autograd 自动求导
    optimizer.step()
    optimizer.zero_grad()
```

## 框架对比

| 维度 | PyTorch | TensorFlow | JAX |
|------|---------|------------|-----|
| 计算图 | 动态（define-by-run） | 静态+动态（Keras 3） | 函数式（jit 编译） |
| 调试 | ✅ 直观（像写 Python） | 中（TF 2.x 改善） | 难（函数变换） |
| 研究占比(2026) | ~85% | ~10% | ~5%（上升） |
| 生产部署 | TorchServe/TorchExport | TF Serving/TF Lite | Flax + 外部 |
| 移动端 | PyTorch Mobile | TF Lite（成熟） | 弱 |
| 生态 | Hugging Face 默认 | Keras + TF Hub | Flax/Optax |

## 适用场景

- **首选 PyTorch**：学术研究、模型原型、LLM 微调、需要灵活调试
- **考虑 TensorFlow**：移动端部署（TF Lite 成熟）、已有 TF 代码库
- **考虑 JAX**：大规模 TPU 训练、需要函数式自动并行（DeepMind 路线）

## Related

- [[03_Deep_Learning/README|深度学习]] — 章节主页
- [[03_Deep_Learning/DL_Frameworks/tensorflow_overview|TensorFlow 概览]] — 竞品对比
- [[07_Model_Training/README|模型训练]] — PyTorch 训练工程实践
- [[05_NLP_LLMs/Fine_tuning_Techniques|微调技术]] — Hugging Face + PyTorch 微调
