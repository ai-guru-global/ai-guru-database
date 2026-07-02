---
title: "AI 知识库配套实验指南 — 从理论到可运行代码"
category: hands-on
tags: ["experiments", "hands-on", "labs", "pytorch", "python", "practical"]
summary: "为 AI 知识库 10 大核心领域提供可运行的配套实验，每个实验包含完整 Python 代码、预期输出和学习要点，读者可直接在 Colab/本地 GPU 环境运行。"
created: 2026-06-04
updated: 2026-06-04
tier: supporting
---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](../_meta/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->

# AI 知识库配套实验指南 — 从理论到可运行代码

> **一句话理解**: 纸上得来终觉浅——本指南为知识库的每个核心领域提供"拿来就跑"的实验代码，让你 30 分钟内从公式到结果。

---

## 实验总览

| # | 领域 | 实验名称 | 时长 | 难度 | GPU 需求 |
|---|------|---------|------|------|---------|
| 1 | 机器学习 | 从零实现线性回归 & 逻辑回归 | 30min | ⭐ | 无 |
| 2 | 深度学习 | 手写 CNN 图像分类 (CIFAR-10) | 45min | ⭐⭐ | 可选 |
| 3 | 自监督学习 | SimCLR 对比学习 (简化版) | 60min | ⭐⭐⭐ | 需要 |
| 4 | NLP/LLM | 用 HuggingFace 微调 BERT 文本分类 | 45min | ⭐⭐ | 需要 |
| 5 | LLM 推理 | llama.cpp 本地部署 & 量化对比 | 30min | ⭐⭐ | 无 |
| 6 | 计算机视觉 | U-Net 语义分割 (合成数据) | 60min | ⭐⭐⭐ | 需要 |
| 7 | 生成模型 | DDPM 扩散模型 (MNIST) | 60min | ⭐⭐⭐ | 需要 |
| 8 | RAG 系统 | Chroma + OpenAI 构建 RAG 问答 | 30min | ⭐⭐ | 无 |
| 9 | 强化学习 | DQN 玩 CartPole | 45min | ⭐⭐ | 可选 |
| 10 | 模型部署 | vLLM 本地部署 + API 测试 | 30min | ⭐⭐ | 需要 |

---

## 环境准备

```bash
# 基础环境 (所有实验通用)
pip install torch torchvision
pip install transformers datasets evaluate
pip install numpy matplotlib scikit-learn
pip install chromadb openai
pip install gymnasium stable-baselines3
pip install vllm

# 可选: Jupyter/Colab
pip install jupyter ipywidgets
```

---

## 实验 1: 从零实现线性回归 & 逻辑回归

> **对应章节**: [02_Machine_Learning](../02_Machine_Learning/README.md)  
> **学习目标**: 理解梯度下降的本质, 不依赖任何 ML 框架

```python
import numpy as np
import matplotlib.pyplot as plt

# === Part 1: 线性回归 (解析解 + 梯度下降) ===

# 生成数据: y = 3x + 7 + noise
np.random.seed(42)
X = np.random.randn(100, 1)
y = 3 * X + 7 + np.random.randn(100, 1) * 2

# 解析解: w = (X^T X)^-1 X^T y
X_b = np.c_[np.ones((100, 1)), X]  # 添加偏置项
w_closed = np.linalg.inv(X_b.T @ X_b) @ X_b.T @ y
print(f"解析解: w0={w_closed[0]:.2f}, w1={w_closed[1]:.2f}")  # ~7.0, ~3.0

# 梯度下降
w = np.random.randn(2, 1)
lr = 0.1
for epoch in range(100):
    pred = X_b @ w
    grad = (2/100) * X_b.T @ (pred - y)
    w -= lr * grad
    if epoch % 20 == 0:
        loss = np.mean((pred - y)**2)
        print(f"Epoch {epoch}: MSE={loss:.2f}, w0={w[0]:.2f}, w1={w[1]:.2f}")

# === Part 2: 逻辑回归 (二分类) ===

from sklearn.datasets import make_classification
X_cls, y_cls = make_classification(n_samples=200, n_features=2, 
                                    n_redundant=0, random_state=42)

# Sigmoid + 梯度下降
def sigmoid(z):
    return 1 / (1 + np.exp(-z))

w = np.zeros(3)
lr = 0.1
for epoch in range(200):
    X_b = np.c_[np.ones(len(X_cls)), X_cls]
    pred = sigmoid(X_b @ w)
    grad = X_b.T @ (pred - y_cls) / len(y_cls)
    w -= lr * grad

# 评估
pred_labels = (sigmoid(np.c_[np.ones(len(X_cls)), X_cls] @ w) > 0.5).astype(int)
accuracy = np.mean(pred_labels == y_cls)
print(f"\n逻辑回归准确率: {accuracy:.2%}")  # ~85%
```

**学习要点**:
- 解析解 vs 迭代法的区别
- 学习率对收敛速度的影响
- 为什么需要 sigmoid 激活函数

---

## 实验 2: 手写 CNN 图像分类 (CIFAR-10)

> **对应章节**: [03_Deep_Learning](../03_Deep_Learning/README.md) · [04_Computer_Vision](../04_Computer_Vision/README.md)  
> **学习目标**: 理解卷积、池化、全连接的组合方式

```python
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader
from torchvision import datasets, transforms

# 数据准备
transform = transforms.Compose([
    transforms.RandomHorizontalFlip(),
    transforms.RandomCrop(32, padding=4),
    transforms.ToTensor(),
    transforms.Normalize((0.4914, 0.4822, 0.4465), (0.247, 0.243, 0.261))
])

train_set = datasets.CIFAR10(root='./data', train=True, download=True, transform=transform)
test_set = datasets.CIFAR10(root='./data', train=False, transform=transform)
train_loader = DataLoader(train_set, batch_size=128, shuffle=True)
test_loader = DataLoader(test_set, batch_size=256)

# 小型 CNN (受 AlexNet/VGG 启发)
class SimpleCNN(nn.Module):
    def __init__(self):
        super().__init__()
        self.features = nn.Sequential(
            nn.Conv2d(3, 32, 3, padding=1), nn.BatchNorm2d(32), nn.ReLU(),
            nn.Conv2d(32, 64, 3, padding=1), nn.BatchNorm2d(64), nn.ReLU(),
            nn.MaxPool2d(2),
            nn.Conv2d(64, 128, 3, padding=1), nn.BatchNorm2d(128), nn.ReLU(),
            nn.MaxPool2d(2),
        )
        self.classifier = nn.Sequential(
            nn.Flatten(),
            nn.Linear(128 * 8 * 8, 256), nn.ReLU(), nn.Dropout(0.5),
            nn.Linear(256, 10)
        )
    
    def forward(self, x):
        return self.classifier(self.features(x))

model = SimpleCNN()
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model = model.to(device)

# 训练
optimizer = optim.Adam(model.parameters(), lr=1e-3, weight_decay=1e-4)
criterion = nn.CrossEntropyLoss()

for epoch in range(10):
    model.train()
    total_loss = 0
    for images, labels in train_loader:
        images, labels = images.to(device), labels.to(device)
        optimizer.zero_grad()
        loss = criterion(model(images), labels)
        loss.backward()
        optimizer.step()
        total_loss += loss.item()
    
    # 测试
    model.eval()
    correct, total = 0, 0
    with torch.no_grad():
        for images, labels in test_loader:
            images, labels = images.to(device), labels.to(device)
            pred = model(images).argmax(dim=1)
            correct += (pred == labels).sum().item()
            total += len(labels)
    print(f"Epoch {epoch+1}: Loss={total_loss/len(train_loader):.3f}, "
          f"Test Acc={correct/total:.2%}")

# 预期: Epoch 10 → ~85% 准确率 (简单 CNN, 10 epochs)
```

**学习要点**:
- BatchNorm + Dropout 对训练稳定性的重要性
- 数据增强 (翻转+裁剪) 对泛化的影响
- 对比 AlexNet 论文中的技巧: 哪些至今仍在用?

---

## 实验 3: SimCLR 对比学习 (简化版)

> **对应章节**: [03_Deep_Learning/Self_Supervised_Learning](../03_Deep_Learning/Self_Supervised_Learning/)  
> **学习目标**: 理解"正样本拉近、负样本推远"的对比学习原理

```python
import torch
import torch.nn as nn
import torch.nn.functional as F
from torchvision import datasets, transforms

class SimCLR(nn.Module):
    """简化版 SimCLR: ResNet-18 backbone + MLP projection head"""
    def __init__(self, feature_dim=128):
        super().__init__()
        from torchvision.models import resnet18
        self.backbone = resnet18(pretrained=False)
        in_features = self.backbone.fc.in_features
        self.backbone.fc = nn.Identity()  # 移除分类头
        
        # Projection head: 2-layer MLP
        self.projection = nn.Sequential(
            nn.Linear(in_features, 512),
            nn.ReLU(),
            nn.Linear(512, feature_dim)
        )
    
    def forward(self, x):
        h = self.backbone(x)
        z = self.projection(h)
        return h, z

def nt_xent_loss(z_i, z_j, temperature=0.5):
    """NT-Xent (Normalized Temperature-scaled Cross Entropy) Loss"""
    batch_size = z_i.shape[0]
    z = torch.cat([z_i, z_j], dim=0)  # [2B, d]
    z = F.normalize(z, dim=1)
    
    sim = z @ z.T / temperature  # [2B, 2B]
    
    # 正样本对: (i, i+B) 和 (i+B, i)
    pos_mask = torch.eye(2 * batch_size, device=z.device).bool()
    sim = sim.masked_fill(pos_mask, -float('inf'))
    
    # 对角偏移的正样本索引
    labels = torch.cat([
        torch.arange(batch_size, 2*batch_size),
        torch.arange(0, batch_size)
    ]).to(z.device)
    
    loss = F.cross_entropy(sim, labels)
    return loss

# 数据增强对 (同一张图片的两种不同变换)
aug_transform = transforms.Compose([
    transforms.RandomResizedCrop(32),
    transforms.RandomHorizontalFlip(),
    transforms.ColorJitter(0.4, 0.4, 0.4, 0.1),
    transforms.ToTensor(),
])

# 训练循环 (简化版, 用 CIFAR-10)
model = SimCLR().cuda()
optimizer = torch.optim.Adam(model.parameters(), lr=3e-4)
dataset = datasets.CIFAR10('./data', train=True, download=True)

for epoch in range(5):
    total_loss = 0
    for i in range(0, min(5000, len(dataset)), 128):
        batch = []
        for j in range(i, min(i+128, len(dataset))):
            img = dataset[j][0]  # PIL Image
            batch.append(aug_transform(img))
        batch = torch.stack(batch).cuda()
        
        # 同一 batch 的两个增强视图
        batch2 = torch.stack([aug_transform(dataset[j][0]) 
                              for j in range(i, min(i+128, len(dataset)))]).cuda()
        
        _, z1 = model(batch)
        _, z2 = model(batch2)
        
        loss = nt_xent_loss(z1, z2)
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()
        total_loss += loss.item()
    
    print(f"Epoch {epoch+1}: Contrastive Loss = {total_loss:.3f}")

# 下游评估: 冻结 backbone, 只训练线性分类器
# (省略 — 标准 linear probing 流程)
```

**学习要点**:
- 数据增强是 SimCLR 的"灵魂" — 没有强增强, 对比学习无效
- Temperature 参数控制"推远"的力度
- 对比学习 vs 自监督: 无标签也能学到好特征

---

## 实验 4: 用 HuggingFace 微调 BERT 文本分类

> **对应章节**: [04_NLP_LLMs](../11_MLOps_Pipeline/README.md)  
> **学习目标**: 理解"预训练+微调"范式

```python
from datasets import load_dataset
from transformers import (
    AutoTokenizer, AutoModelForSequenceClassification,
    TrainingArguments, Trainer
)
import evaluate

# 加载数据 (IMDB 情感分类)
dataset = load_dataset("imdb")
tokenizer = AutoTokenizer.from_pretrained("bert-base-uncased")

def tokenize(examples):
    return tokenizer(examples["text"], padding="max_length", 
                     truncation=True, max_length=256)

dataset = dataset.map(tokenize, batched=True)

# 加载预训练模型
model = AutoModelForSequenceClassification.from_pretrained(
    "bert-base-uncased", num_labels=2
)

# 训练配置
metric = evaluate.load("accuracy")

def compute_metrics(eval_pred):
    logits, labels = eval_pred
    predictions = logits.argmax(axis=-1)
    return metric.compute(predictions=predictions, references=labels)

training_args = TrainingArguments(
    output_dir="./results",
    num_train_epochs=2,
    per_device_train_batch_size=16,
    per_device_eval_batch_size=32,
    learning_rate=2e-5,
    weight_decay=0.01,
    evaluation_strategy="epoch",
    logging_steps=100,
)

trainer = Trainer(
    model=model, args=training_args,
    train_dataset=dataset["train"].shuffle(seed=42).select(range(5000)),
    eval_dataset=dataset["test"].shuffle(seed=42).select(range(1000)),
    compute_metrics=compute_metrics,
)

trainer.train()
# 预期: 5000 样本训练 → ~90% 准确率 (BERT 预训练知识的迁移)
```

**学习要点**:
- 预训练 BERT 只需 5000 样本就能达到 90% — 这就是迁移学习的威力
- 学习率 2e-5 远小于从头训练 — 微调需要"温柔"
- 对比: 不用 BERT 预训练, 5000 样本的 CNN 分类器只有 ~75%

---

## 实验 5: llama.cpp 本地部署 & 量化对比

> **对应章节**: [04_NLP_LLMs/Edge_LLM](../04_NLP_LLMs/Edge_LLM/) · [09_Deployment_Inference](../11_MLOps_Pipeline/README.md)  
> **学习目标**: 理解量化对模型大小/速度/质量的影响

```bash
# 1. 安装 llama.cpp
git clone https://github.com/ggerganov/llama.cpp
cd llama.cpp && make -j

# 2. 下载 GGUF 格式模型 (以 Phi-3-mini 为例)
# 从 HuggingFace 下载不同量化版本:
# - Q4_K_M (4-bit): ~2.5GB
# - Q8_0 (8-bit):   ~4.5GB
# - F16 (无量化):    ~8GB

# 3. 对比推理速度
./llama-bench -m phi-3-mini-4k-instruct-q4_k_m.gguf -p "Explain quantum computing" -n 128

./llama-bench -m phi-3-mini-4k-instruct-q8_0.gguf -p "Explain quantum computing" -n 128

# 4. 观察指标:
# - tokens/s: 生成速度
# - 内存占用: Q4 < Q8 < F16
# - 输出质量: 肉眼对比不同量化的差异
```

**学习要点**:
- Q4_K_M 是性价比最优选择: 速度 2-3× 提升, 质量损失 <5%
- 量化是端侧部署的关键技术
- GGUF 格式的跨平台兼容性

---

## 实验 6: U-Net 语义分割 (合成数据)

> **对应章节**: [04_Computer_Vision/Segmentation](../04_Computer_Vision/Segmentation/) · [20_Papers_and_Research/Vision/UNet_Deep_Dive](../20_Papers_and_Research/Vision/UNet_Deep_Dive.md)  
> **学习目标**: 理解编码器-解码器 + 跳跃连接的分割效果

```python
import torch
import torch.nn as nn
import numpy as np
from torch.utils.data import Dataset, DataLoader

# 合成数据: 随机圆形 + 矩形
class SyntheticSegDataset(Dataset):
    def __init__(self, n_samples=500, img_size=128):
        self.n = n_samples
        self.size = img_size
    
    def __len__(self):
        return self.n
    
    def __getitem__(self, idx):
        img = np.zeros((1, self.size, self.size), dtype=np.float32)
        mask = np.zeros((self.size, self.size), dtype=np.int64)
        
        # 画 3-5 个随机圆形 (类别 1)
        for _ in range(np.random.randint(3, 6)):
            cx, cy = np.random.randint(20, self.size-20, 2)
            r = np.random.randint(8, 20)
            y, x = np.ogrid[:self.size, :self.size]
            circle = (x-cx)**2 + (y-cy)**2 < r**2
            img[0][circle] = 1.0
            mask[circle] = 1
        
        return torch.tensor(img), torch.tensor(mask)

# 使用前面定义的 UNet (见 UNet_Deep_Dive.md)
# ... (此处省略 UNet 定义, 复用论文解读中的代码)

dataset = SyntheticSegDataset(500)
loader = DataLoader(dataset, batch_size=8, shuffle=True)

# 训练
model = UNet(in_channels=1, num_classes=2).cuda()
optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)
criterion = nn.CrossEntropyLoss()

for epoch in range(20):
    total_loss = 0
    for imgs, masks in loader:
        imgs, masks = imgs.cuda(), masks.cuda()
        pred = model(imgs)
        loss = criterion(pred, masks)
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()
        total_loss += loss.item()
    
    # 可视化第一个样本的预测
    if epoch % 5 == 0:
        model.eval()
        with torch.no_grad():
            sample_img, sample_mask = dataset[0]
            pred = model(sample_img.unsqueeze(0).cuda()).argmax(1).cpu().numpy()
            print(f"Epoch {epoch}: Loss={total_loss/len(loader):.3f}, "
                  f"Pred unique classes: {np.unique(pred)}")
        model.train()

# 预期: 20 epochs 后 IoU > 85%, 能准确分割圆形区域
```

---

## 实验 7: DDPM 扩散模型 (MNIST)

> **对应章节**: [04_Computer_Vision/Generative_Models](../04_Computer_Vision/Generative_Models/)  
> **学习目标**: 理解前向加噪 → 反向去噪的扩散过程

```python
import torch
import torch.nn as nn
from torchvision import datasets, transforms

# 简化版 DDPM
T = 200  # 扩散步数 (论文用 1000, 此处简化)

# 噪声调度
betas = torch.linspace(1e-4, 0.02, T)
alphas = 1 - betas
alpha_bar = torch.cumprod(alphas, dim=0)

def add_noise(x0, t):
    """前向过程: 向干净图像添加高斯噪声"""
    noise = torch.randn_like(x0)
    sqrt_alpha = alpha_bar[t].sqrt().view(-1, 1, 1, 1)
    sqrt_one_minus = (1 - alpha_bar[t]).sqrt().view(-1, 1, 1, 1)
    xt = sqrt_alpha * x0 + sqrt_one_minus * noise
    return xt, noise

# 简单 U-Net 去噪网络
class SimpleUNet(nn.Module):
    def __init__(self):
        super().__init__()
        self.enc = nn.Sequential(
            nn.Conv2d(1, 32, 3, padding=1), nn.ReLU(),
            nn.Conv2d(32, 64, 3, stride=2, padding=1), nn.ReLU(),
        )
        self.time_embed = nn.Sequential(
            nn.Linear(1, 64), nn.SiLU(), nn.Linear(64, 64)
        )
        self.dec = nn.Sequential(
            nn.ConvTranspose2d(128, 32, 2, stride=2), nn.ReLU(),
            nn.Conv2d(32, 1, 3, padding=1),
        )
    
    def forward(self, x, t):
        t_emb = self.time_embed(t.float().unsqueeze(1) / T)
        h = self.enc(x)
        h = h + t_emb.unsqueeze(-1).unsqueeze(-1)
        return self.dec(torch.cat([h, h], dim=1))  # skip connection

model = SimpleUNet().cuda()
optimizer = torch.optim.Adam(model.parameters(), lr=2e-4)

# 训练: 预测噪声
dataset = datasets.MNIST('./data', train=True, transform=transforms.ToTensor())
loader = torch.utils.data.DataLoader(dataset, batch_size=128, shuffle=True)

for epoch in range(10):
    total_loss = 0
    for images, _ in loader:
        images = images.cuda()
        t = torch.randint(0, T, (len(images),), device='cuda')
        noisy_images, noise = add_noise(images, t)
        
        pred_noise = model(noisy_images, t)
        loss = nn.functional.mse_loss(pred_noise, noise)
        
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()
        total_loss += loss.item()
    
    print(f"Epoch {epoch+1}: Denoising Loss = {total_loss/len(loader):.4f}")

# 生成: 从纯噪声逐步去噪
@torch.no_grad()
def generate(model, n_samples=16):
    x = torch.randn(n_samples, 1, 28, 28).cuda()
    for t in reversed(range(T)):
        t_batch = torch.full((n_samples,), t, device='cuda')
        pred_noise = model(x, t_batch)
        alpha_t = alphas[t]
        alpha_bar_t = alpha_bar[t]
        x = (x - (1-alpha_t)/(1-alpha_bar_t).sqrt() * pred_noise) / alpha_t.sqrt()
        if t > 0:
            x += betas[t].sqrt() * torch.randn_like(x)
    return x.cpu()

# 保存生成图像
generated = generate(model)
# torchvision.utils.save_image(generated, "generated_mnist.png", nrow=4)
```

---

## 实验 8: Chroma + OpenAI 构建 RAG 问答

> **对应章节**: [11_RAG_Systems](../11_MLOps_Pipeline/README.md) · [20_Papers_and_Research/Retrieval/RAG_Deep_Dive](../20_Papers_and_Research/Retrieval/RAG_Deep_Dive.md)  
> **学习目标**: 理解"先检索、后生成"的 RAG 工作流

```python
import chromadb
from openai import OpenAI

# 初始化
client = chromadb.Client()
collection = client.create_collection("ai_knowledge")
openai_client = OpenAI()

# 1. 准备知识库文档
documents = [
    "Transformer 使用自注意力机制, 完全摒弃了 RNN 和 CNN。",
    "BERT 是双向 Transformer, 使用 MLM 和 NSP 两个预训练任务。",
    "GPT 是自回归 Transformer, 从左到右生成文本。",
    "LoRA 通过低秩矩阵分解实现参数高效微调, 只训练 A/B 矩阵。",
    "RAG 将检索和生成结合, 先查知识库再生成回答。",
]

# 2. 生成嵌入并存储
from chromadb.utils import embedding_functions
embed_fn = embedding_functions.DefaultEmbeddingFunction()
embeddings = embed_fn(documents)

collection.add(
    documents=documents,
    embeddings=[e.tolist() for e in embeddings],
    ids=[f"doc_{i}" for i in range(len(documents))]
)

# 3. RAG 问答
def rag_query(question: str) -> str:
    # 检索: 找到最相关的 2 个文档
    q_emb = embed_fn([question])[0].tolist()
    results = collection.query(query_embeddings=[q_emb], n_results=2)
    context = "\n".join(results["documents"][0])
    
    # 生成: 用检索到的上下文回答
    response = openai_client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": f"基于以下上下文回答问题:\n{context}"},
            {"role": "user", "content": question}
        ]
    )
    return response.choices[0].message.content

# 测试
print(rag_query("LoRA 是怎么工作的?"))
# 预期: 回答包含"低秩矩阵分解"和"参数高效微调"等关键词
```

---

## 实验 9: DQN 玩 CartPole

> **对应章节**: [06_Reinforcement_Learning](../06_Reinforcement_Learning/README.md) · [20_Papers_and_Research/RL/DQN_Deep_Dive](../20_Papers_and_Research/RL/DQN_Deep_Dive.md)  
> **学习目标**: 理解经验回放 + 目标网络的 DQN 核心机制

```python
import gymnasium as gym
import torch
import torch.nn as nn
import random
from collections import deque

# Q-Network
class QNetwork(nn.Module):
    def __init__(self, state_dim=4, action_dim=2):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(state_dim, 64), nn.ReLU(),
            nn.Linear(64, 64), nn.ReLU(),
            nn.Linear(64, action_dim)
        )
    
    def forward(self, x):
        return self.net(x)

# DQN Agent
class DQNAgent:
    def __init__(self, lr=1e-3, gamma=0.99, buffer_size=10000):
        self.q_net = QNetwork()
        self.target_net = QNetwork()
        self.target_net.load_state_dict(self.q_net.state_dict())
        
        self.optimizer = torch.optim.Adam(self.q_net.parameters(), lr=lr)
        self.buffer = deque(maxlen=buffer_size)
        self.gamma = gamma
        self.epsilon = 1.0  # ε-greedy
        self.epsilon_decay = 0.995
    
    def act(self, state):
        if random.random() < self.epsilon:
            return random.randint(0, 1)
        with torch.no_grad():
            q_values = self.q_net(torch.FloatTensor(state))
            return q_values.argmax().item()
    
    def remember(self, s, a, r, s_next, done):
        self.buffer.append((s, a, r, s_next, done))
    
    def train(self, batch_size=64):
        if len(self.buffer) < batch_size:
            return 0
        
        batch = random.sample(self.buffer, batch_size)
        states, actions, rewards, next_states, dones = zip(*batch)
        
        states = torch.FloatTensor(states)
        actions = torch.LongTensor(actions)
        rewards = torch.FloatTensor(rewards)
        next_states = torch.FloatTensor(next_states)
        dones = torch.FloatTensor(dones)
        
        # 当前 Q 值
        q_values = self.q_net(states).gather(1, actions.unsqueeze(1)).squeeze()
        
        # 目标 Q 值 (使用 target_net)
        with torch.no_grad():
            next_q = self.target_net(next_states).max(dim=1)[0]
            target = rewards + self.gamma * next_q * (1 - dones)
        
        loss = nn.functional.mse_loss(q_values, target)
        self.optimizer.zero_grad()
        loss.backward()
        self.optimizer.step()
        
        self.epsilon *= self.epsilon_decay
        return loss.item()

# 训练
env = gym.make("CartPole-v1")
agent = DQNAgent()

for episode in range(300):
    state, _ = env.reset()
    total_reward = 0
    
    for step in range(500):
        action = agent.act(state)
        next_state, reward, terminated, truncated, _ = env.step(action)
        done = terminated or truncated
        
        agent.remember(state, action, reward, next_state, done)
        agent.train()
        
        state = next_state
        total_reward += reward
        if done:
            break
    
    if episode % 20 == 0:
        agent.target_net.load_state_dict(agent.q_net.state_dict())
        print(f"Episode {episode}: Reward={total_reward:.0f}, ε={agent.epsilon:.3f}")
    
    if total_reward >= 475:  # CartPole 解决标准
        print(f"Solved at episode {episode}!")
        break

# 预期: ~100 episodes 后达到 200+ reward, ~200 episodes 后达到 500
```

---

## 实验 10: vLLM 本地部署 + API 测试

> **对应章节**: [09_Deployment_Inference](../11_MLOps_Pipeline/README.md)  
> **学习目标**: 理解高性能 LLM 推理服务的工作原理

```bash
# 1. 启动 vLLM 服务 (以 Qwen2.5-7B 为例)
python -m vllm.entrypoints.openai.api_server \
    --model Qwen/Qwen2.5-7B-Instruct \
    --host 0.0.0.0 --port 8000 \
    --max-model-len 8192 \
    --gpu-memory-utilization 0.9 \
    --tensor-parallel-size 1

# 2. 测试 API
curl http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "Qwen/Qwen2.5-7B-Instruct",
    "messages": [{"role": "user", "content": "解释什么是 KV Cache"}],
    "temperature": 0.7,
    "max_tokens": 256
  }'

# 3. 性能测试: 并发请求
# 使用 locust 或 ab 进行压测, 观察:
# - 吞吐量 (tokens/s)
# - 首 token 延迟 (TTFT)
# - 并发处理能力
```

```python
# Python 客户端测试
from openai import OpenAI

client = OpenAI(base_url="http://localhost:8000/v1", api_key="not-needed")

# 测试 Continuous Batching 效果: 发送多个不同长度的请求
import time

questions = [
    "什么是 Transformer?",
    "用三句话解释 RAG",
    "Python 的 list comprehension 语法是什么? 请给出 3 个例子",
]

start = time.time()
for q in questions:
    resp = client.chat.completions.create(
        model="Qwen/Qwen2.5-7B-Instruct",
        messages=[{"role": "user", "content": q}],
        max_tokens=100
    )
    elapsed = time.time() - start
    print(f"[{elapsed:.1f}s] Q: {q[:20]}... → {resp.choices[0].message.content[:50]}...")

# 观察: 请求是串行发送的, 但 vLLM 的 continuous batching 
# 允许在 GPU 上并行处理多个请求的不同 token
```

---

## 实验难度进阶路线图

```
初学者:
  实验1 (线性回归) → 实验4 (BERT微调) → 实验8 (RAG问答)

中级:
  实验2 (CNN) → 实验5 (量化) → 实验9 (DQN) → 实验10 (vLLM)

高级:
  实验3 (SimCLR) → 实验6 (U-Net) → 实验7 (DDPM)
```

---

*Last updated: 2026-06-04*

## Related

- [[00_AI_Introduction/AI_Practical_Labs|AI 入门实验]] — 无需编程基础的体验实验
- [[_concepts/pytorch|PyTorch 概念卡片]] — PyTorch 基础
- [[_concepts/concept-dependency-graph|概念依赖图谱]] — 学习顺序参考
- [[00_AI_Introduction/README|AI 入门与概览]]
