---
title: "神经网络可视化指南"
category: 94-visualization
tags: ["visualization", "neural-network", "deep-learning", "architecture", "interpretability"]
summary: "神经网络可视化全景——从网络架构图到特征图、注意力热力图、梯度可视化，帮助理解和调试深度学习模型。"
created: 2026-07-02
updated: 2026-07-02
tier: core
aliases:
  - "Neural Network Visualization"
  - "NN Visualization Guide"
sources: []
---

# 神经网络可视化指南 (Neural Network Visualization Guide)

> 神经网络可视化全景——从网络架构图到特征图、注意力热力图、梯度可视化，帮助理解和调试深度学习模型。

---

## 1. 可视化类型总览

| 类型 | 目的 | 工具 |
|------|------|------|
| 架构图 | 展示网络结构 | Netron, PlotNeuralNet |
| 特征图 | 观察中间层激活 | Matplotlib, TensorBoard |
| 注意力热力图 | 理解注意力分配 | BertViz, 推荐seaborn |
| 梯度可视化 | 调试训练问题 | TensorBoard |
| 损失曲面 | 理解优化过程 | Plotly, Matplotlib |
| 权重分布 | 监控参数变化 | TensorBoard, W&B |

---

## 2. 架构可视化

### Netron（推荐）

```bash
# 安装
pip install netron

# 使用
import netron
netron.start("model.onnx")  # 浏览器打开交互式架构图
```

**支持格式**: ONNX, PyTorch (.pt), TensorFlow (.pb), Keras (.h5), CoreML

### PyTorch 模型摘要

```python
from torchinfo import summary

model = MyModel()
summary(model, input_size=(1, 3, 224, 224),
        col_names=["input_size", "output_size", "num_params", "trainable"])
```

输出示例：
```
==========================================================================================
Layer (type:depth-idx)                   Output Shape              Param #
==========================================================================================
ResNet                                   [1, 1000]                 --
├─Conv2d: 1-1                            [1, 64, 112, 112]         9,408
├─BatchNorm2d: 1-2                       [1, 64, 112, 112]         128
├─ReLU: 1-3                              [1, 64, 112, 112]         --
...
==========================================================================================
Total params: 25,557,032
Trainable params: 25,557,032
Non-trainable params: 0
```

### PlotNeuralNet（LaTeX 风格）

```python
# 生成出版级神经网络架构图
from plotneuralnet import *

layers = [
    Conv(3, 64, "Input"),
    Pool("MaxPool"),
    Conv(64, 128, "Block1"),
    Dense(128, 10, "Output"),
]
render(layers, filename="architecture.tex")
```

---

## 3. 特征图可视化

### 卷积层特征图

```python
import torch
import matplotlib.pyplot as plt

def visualize_feature_maps(model, image, layer_name):
    """提取并可视化指定层的特征图。"""
    activations = {}
    
    def hook(module, input, output):
        activations[layer_name] = output.detach()
    
    # 注册 hook
    layer = dict(model.named_modules())[layer_name]
    layer.register_forward_hook(hook)
    
    # 前向传播
    with torch.no_grad():
        model(image.unsqueeze(0))
    
    # 可视化
    features = activations[layer_name][0]
    fig, axes = plt.subplots(4, 8, figsize=(16, 8))
    for i, ax in enumerate(axes.flat):
        if i < features.shape[0]:
            ax.imshow(features[i].cpu().numpy(), cmap='viridis')
        ax.axis('off')
    plt.suptitle(f'Feature Maps: {layer_name}')
    plt.tight_layout()
    plt.savefig('feature_maps.png', dpi=150)
    plt.show()

# 使用
visualize_feature_maps(model, test_image, 'layer4.2.conv2')
```

---

## 4. 注意力可视化

### Transformer 注意力热力图

```python
from transformers import AutoModel, AutoTokenizer
import seaborn as sns

def visualize_attention(text, model_name="bert-base-uncased"):
    """可视化 BERT 的注意力权重。"""
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModel.from_pretrained(model_name, output_attentions=True)
    
    inputs = tokenizer(text, return_tensors="pt")
    outputs = model(**inputs)
    
    # 取最后一层的注意力，平均所有头
    attention = outputs.attentions[-1][0].mean(dim=0).detach().numpy()
    tokens = tokenizer.convert_ids_to_tokens(inputs["input_ids"][0])
    
    plt.figure(figsize=(10, 8))
    sns.heatmap(attention, xticklabels=tokens, yticklabels=tokens,
                cmap='Blues', annot=False)
    plt.title('Attention Weights (Last Layer, Avg Heads)')
    plt.xlabel('Key')
    plt.ylabel('Query')
    plt.tight_layout()
    plt.savefig('attention_heatmap.png', dpi=150)
    plt.show()

visualize_attention("The cat sat on the mat")
```

### 多头注意力对比

```python
def visualize_multi_head_attention(text, model_name="bert-base-uncased"):
    """分别可视化每个注意力头。"""
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModel.from_pretrained(model_name, output_attentions=True)
    
    inputs = tokenizer(text, return_tensors="pt")
    outputs = model(**inputs)
    
    # 取最后一层，所有头
    attention = outputs.attentions[-1][0].detach().numpy()  # (heads, seq, seq)
    tokens = tokenizer.convert_ids_to_tokens(inputs["input_ids"][0])
    
    num_heads = attention.shape[0]
    fig, axes = plt.subplots(2, 6, figsize=(18, 6))
    for i, ax in enumerate(axes.flat):
        if i < num_heads:
            sns.heatmap(attention[i], xticklabels=tokens, yticklabels=tokens,
                       cmap='Blues', ax=ax, cbar=False)
            ax.set_title(f'Head {i}')
        ax.axis('off')
    plt.suptitle('Multi-Head Attention (Last Layer)')
    plt.tight_layout()
    plt.savefig('multi_head_attention.png', dpi=150)
    plt.show()
```

### BertViz 交互式

```python
from bertviz import model_view, head_view

# 交互式注意力可视化（Jupyter Notebook）
attention = outputs.attentions
tokens = tokenizer.convert_ids_to_tokens(inputs["input_ids"][0])

# 多头视图
head_view(attention, tokens)

# 模型视图（所有层）
model_view(attention, tokens)
```

---

## 5. 梯度可视化

### 梯度分布监控

```python
def plot_gradient_distribution(model):
    """绘制每层梯度的分布。"""
    gradients = {}
    for name, param in model.named_parameters():
        if param.grad is not None:
            gradients[name] = param.grad.cpu().numpy().flatten()
    
    fig, axes = plt.subplots(4, 4, figsize=(16, 12))
    for i, (name, grad) in enumerate(gradients.items()):
        if i >= 16:
            break
        ax = axes[i // 4, i % 4]
        ax.hist(grad, bins=50, alpha=0.7)
        ax.set_title(name.split('.')[-1], fontsize=8)
        ax.axvline(x=0, color='r', linestyle='--', alpha=0.5)
    
    plt.suptitle('Gradient Distribution per Layer')
    plt.tight_layout()
    plt.savefig('gradient_distribution.png', dpi=150)
    plt.show()
```

### 梯度流监控

```python
def monitor_gradient_flow(model):
    """监控梯度是否消失或爆炸。"""
    ave_grads = []
    max_grads = []
    layers = []
    
    for name, param in model.named_parameters():
        if param.grad is not None and 'bias' not in name:
            layers.append(name)
            ave_grads.append(param.grad.abs().mean().item())
            max_grads.append(param.grad.abs().max().item())
    
    plt.figure(figsize=(12, 4))
    plt.bar(range(len(ave_grads)), ave_grads, alpha=0.5, label='Mean')
    plt.bar(range(len(max_grads)), max_grads, alpha=0.5, label='Max')
    plt.xticks(range(len(layers)), [l.split('.')[-1] for l in layers], 
               rotation=45, fontsize=6)
    plt.ylabel('Gradient')
    plt.title('Gradient Flow')
    plt.legend()
    plt.tight_layout()
    plt.savefig('gradient_flow.png', dpi=150)
    plt.show()
```

---

## 6. 权重可视化

### 权重分布变化

```python
def plot_weight_evolution(checkpoints):
    """对比不同训练阶段的权重分布。"""
    fig, axes = plt.subplots(2, 2, figsize=(12, 8))
    
    for i, (epoch, state_dict) in enumerate(checkpoints.items()):
        ax = axes[i // 2, i % 2]
        weights = []
        for name, param in state_dict.items():
            if 'weight' in name and param.dim() >= 2:
                weights.extend(param.cpu().numpy().flatten())
        
        ax.hist(weights, bins=100, alpha=0.7, density=True)
        ax.set_title(f'Epoch {epoch}')
        ax.set_xlabel('Weight Value')
        ax.set_ylabel('Density')
    
    plt.suptitle('Weight Distribution Evolution')
    plt.tight_layout()
    plt.savefig('weight_evolution.png', dpi=150)
    plt.show()
```

---

## 7. t-SNE / UMAP 嵌入可视化

```python
from sklearn.manifold import TSNE
import umap

def visualize_embeddings(embeddings, labels, method='tsne'):
    """将高维嵌入降到 2D 可视化。"""
    if method == 'tsne':
        reducer = TSNE(n_components=2, random_state=42, perplexity=30)
    else:
        reducer = umap.UMAP(n_components=2, random_state=42)
    
    coords = reducer.fit_transform(embeddings)
    
    plt.figure(figsize=(10, 8))
    scatter = plt.scatter(coords[:, 0], coords[:, 1], 
                         c=labels, cmap='tab10', s=5, alpha=0.7)
    plt.colorbar(scatter)
    plt.title(f'{method.upper()} Embedding Visualization')
    plt.xlabel('Component 1')
    plt.ylabel('Component 2')
    plt.tight_layout()
    plt.savefig(f'{method}_embeddings.png', dpi=150)
    plt.show()
```

---

## 8. 工具对比

| 工具 | 用途 | 交互性 | 推荐场景 |
|------|------|--------|---------|
| Netron | 架构图 | 交互式 | 模型结构审查 |
| TensorBoard | 训练监控 | 交互式 | 训练过程监控 |
| W&B | 实验可视化 | 交互式 | 团队协作 |
| BertViz | 注意力 | 交互式 | Transformer 分析 |
| Matplotlib | 自定义图 | 静态 | 论文插图 |
| Plotly | 3D/交互图 | 交互式 | 探索性分析 |
| Seaborn | 统计图 | 静态 | 数据分析 |

---

## 相关资源

- [[Model_Interpretability_Explainability]]: 模型可解释性
- [[Training_Monitoring_Visualization]]: 训练监控可视化
- [[AI_System_Dashboard]]: AI 系统仪表盘

---

*Last updated: 2026-07-02*
