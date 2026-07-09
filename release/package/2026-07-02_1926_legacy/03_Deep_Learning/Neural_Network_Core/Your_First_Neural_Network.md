---
title: "你的第一个神经网络: 用 PyTorch 训练图像分类器"
category: 03-deep-learning-neural-network-core
tags: ["deep-learning", "neural-network", "pytorch", "beginner", "tutorial", "cnn", "image-classification"]
summary: "从感知机到卷积神经网络的动手实战。使用 PyTorch 搭建并训练一个能识别手写数字 (MNIST) 的神经网络，理解前向传播、反向传播、损失函数和优化器的本质。"
created: 2026-06-01
updated: 2026-06-01
tier: supporting
aliases:
  - "Your First Neural Network"
  - Your_First_Neural_Network

---
# 你的第一个神经网络: 用 PyTorch 训练图像分类器

> **一句话理解**: 神经网络就是一个有很多旋钮（参数）的函数——训练就是不断调整这些旋钮，让输出越来越接近正确答案。

---

## 1. 神经网络是什么？

### 1.1 从函数逼近说起

```
普通函数:        y = 2x + 1         (2个参数)
多项式函数:      y = ax² + bx + c   (3个参数)
神经网络:        y = f(x; θ)        (百万个参数)

神经网络的超能力:
├── 理论上可以逼近任何函数
├── 从数据中自动学习参数，不需要人工设计公式
└── 层数越深，能表示的模式越复杂
```

### 1.2 神经网络结构

```
输入层          隐藏层1          隐藏层2          输出层
┌─────┐       ┌─────┐        ┌─────┐        ┌─────┐
│ x1  │──────▶│     │───────▶│     │───────▶│     │
│ x2  │──────▶│ h1  │───────▶│ h2  │───────▶│  ŷ  │
│ x3  │──────▶│     │        │     │        │     │
│ ... │       └─────┘        └─────┘        └─────┘
│ x784│
└─────┘

MNIST 手写数字识别:
├── 输入: 28×28 = 784 个像素值
├── 隐藏层: 逐层提取特征 (边缘 → 笔画 → 数字部件)
└── 输出: 10 个数字 (0-9) 的概率分布
```

---

## 2. PyTorch 核心概念

### 2.1 张量 (Tensor)

```python
import torch

# 张量 = 多维数组 (NumPy 数组的 GPU 加速版)

# 标量
scalar = torch.tensor(3.14)

# 向量 (一维)
vector = torch.tensor([1, 2, 3, 4, 5])

# 矩阵 (二维)
matrix = torch.tensor([[1, 2], [3, 4], [5, 6]])

# 四维张量 (一批图片:  batch_size × 通道 × 高 × 宽)
images = torch.rand(32, 3, 28, 28)  # 32张3通道28×28的图

# GPU 加速
if torch.cuda.is_available():
    images = images.cuda()
    print(f"张量在 GPU 上: {images.device}")
```

### 2.2 自动求导 (Autograd)

```python
# PyTorch 的超能力: 自动计算梯度

x = torch.tensor(2.0, requires_grad=True)
y = x ** 2 + 3 * x + 1  # y = x² + 3x + 1

y.backward()  # 自动计算 dy/dx
print(x.grad)  # dy/dx = 2x + 3 = 7 (当 x=2 时)

# 在神经网络中:
# loss.backward() 会自动计算所有参数的梯度
# 优化器用这些梯度更新权重
```

---

## 3. 搭建神经网络

### 3.1 定义模型

```python
import torch
import torch.nn as nn
import torch.nn.functional as F

class SimpleNN(nn.Module):
    """
    简单全连接神经网络 (Multi-Layer Perceptron)
    
    结构: 输入(784) → 隐藏层(256) → 隐藏层(128) → 输出(10)
    """
    
    def __init__(self):
        super(SimpleNN, self).__init__()
        
        # 定义层
        self.fc1 = nn.Linear(784, 256)   # 全连接层: 784输入 → 256输出
        self.fc2 = nn.Linear(256, 128)   # 全连接层: 256输入 → 128输出
        self.fc3 = nn.Linear(128, 10)    # 输出层: 128输入 → 10输出 (10个数字)
        
        self.dropout = nn.Dropout(0.2)   # 随机丢弃20%神经元，防止过拟合
    
    def forward(self, x):
        # x 形状: (batch_size, 1, 28, 28)
        x = x.view(-1, 784)              # 展平: (batch_size, 784)
        
        x = F.relu(self.fc1(x))          # 第一层 + ReLU激活
        x = self.dropout(x)              # Dropout正则化
        
        x = F.relu(self.fc2(x))          # 第二层 + ReLU激活
        x = self.dropout(x)
        
        x = self.fc3(x)                  # 输出层 (不加激活，后面用CrossEntropyLoss)
        return x

# 创建模型实例
model = SimpleNN()
print(model)

# 统计参数量
total_params = sum(p.numel() for p in model.parameters())
print(f"总参数量: {total_params:,}")  # 约 235,000
```

### 3.2 激活函数的作用

```
为什么需要激活函数？

没有激活函数:
  y = W3 × (W2 × (W1 × x)) = (W3 × W2 × W1) × x = W' × x
  └── 多层退化为单层线性变换！无法学习复杂模式

加入 ReLU 激活 (非线性):
  y = W3 × ReLU(W2 × ReLU(W1 × x))
  └── 可以逼近任意复杂函数

ReLU(x) = max(0, x)
├── 简单、计算快
├── 缓解梯度消失问题
└── 生物神经元启发 (激活/不激活)
```

---

## 4. 训练流程

### 4.1 准备数据

```python
from torchvision import datasets, transforms
from torch.utils.data import DataLoader

# 数据预处理: 转为张量 + 标准化
# 标准化让数据均值为0，方差为1，训练更稳定
transform = transforms.Compose([
    transforms.ToTensor(),                          # 图片 → 张量 (0-1)
    transforms.Normalize((0.1307,), (0.3081,))      # MNIST 的均值和标准差
])

# 下载 MNIST 数据集
train_dataset = datasets.MNIST(
    root='./data', train=True, download=True, transform=transform
)
test_dataset = datasets.MNIST(
    root='./data', train=False, download=True, transform=transform
)

# DataLoader: 批量加载数据
train_loader = DataLoader(train_dataset, batch_size=64, shuffle=True)
test_loader = DataLoader(test_dataset, batch_size=64, shuffle=False)

print(f"训练集: {len(train_dataset)} 张图片")
print(f"测试集: {len(test_dataset)} 张图片")
```

### 4.2 定义损失函数和优化器

```python
# 损失函数: 衡量预测与真实答案的差距
criterion = nn.CrossEntropyLoss()
# CrossEntropyLoss = Softmax + 负对数似然
# 适合多分类问题

# 优化器: 根据梯度更新参数
optimizer = torch.optim.Adam(model.parameters(), lr=0.001)
# Adam = Adaptive Moment Estimation
# 自动调整每个参数的学习率，最常用

# 学习率调度: 随着训练进行，逐渐减小学习率
scheduler = torch.optim.lr_scheduler.StepLR(optimizer, step_size=5, gamma=0.5)
```

### 4.3 训练循环

```python
def train_epoch(model, loader, criterion, optimizer, device):
    model.train()  # 训练模式 (启用 Dropout)
    running_loss = 0.0
    correct = 0
    total = 0
    
    for batch_idx, (data, target) in enumerate(loader):
        data, target = data.to(device), target.to(device)
        
        # 1. 清零梯度
        optimizer.zero_grad()
        
        # 2. 前向传播
        output = model(data)
        
        # 3. 计算损失
        loss = criterion(output, target)
        
        # 4. 反向传播 (计算梯度)
        loss.backward()
        
        # 5. 更新参数
        optimizer.step()
        
        # 统计
        running_loss += loss.item()
        _, predicted = output.max(1)
        total += target.size(0)
        correct += predicted.eq(target).sum().item()
    
    epoch_loss = running_loss / len(loader)
    epoch_acc = 100. * correct / total
    return epoch_loss, epoch_acc


def evaluate(model, loader, criterion, device):
    model.eval()  # 评估模式 (禁用 Dropout)
    running_loss = 0.0
    correct = 0
    total = 0
    
    with torch.no_grad():  # 不计算梯度，节省内存
        for data, target in loader:
            data, target = data.to(device), target.to(device)
            output = model(data)
            loss = criterion(output, target)
            
            running_loss += loss.item()
            _, predicted = output.max(1)
            total += target.size(0)
            correct += predicted.eq(target).sum().item()
    
    epoch_loss = running_loss / len(loader)
    epoch_acc = 100. * correct / total
    return epoch_loss, epoch_acc
```

### 4.4 执行训练

```python
# 使用 GPU (如果可用)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = model.to(device)
print(f"使用设备: {device}")

# 训练 10 轮
epochs = 10
for epoch in range(1, epochs + 1):
    train_loss, train_acc = train_epoch(model, train_loader, criterion, optimizer, device)
    test_loss, test_acc = evaluate(model, test_loader, criterion, device)
    scheduler.step()  # 更新学习率
    
    print(f"Epoch {epoch:2d}/{epochs} | "
          f"Train Loss: {train_loss:.4f} Acc: {train_acc:.2f}% | "
          f"Test Loss: {test_loss:.4f} Acc: {test_acc:.2f}%")

# 预期结果: 测试准确率达到 97%-98%
```

---

## 5. 预测与可视化

```python
import matplotlib.pyplot as plt

# 取一批测试数据
dataiter = iter(test_loader)
images, labels = next(dataiter)

# 预测
model.eval()
with torch.no_grad():
    images_gpu = images.to(device)
    outputs = model(images_gpu)
    predictions = outputs.argmax(dim=1)

# 可视化前 16 张
fig, axes = plt.subplots(4, 4, figsize=(8, 8))
for i, ax in enumerate(axes.flat):
    ax.imshow(images[i].squeeze(), cmap='gray')
    color = 'green' if predictions[i] == labels[i] else 'red'
    ax.set_title(f"Pred: {predictions[i]}\nTrue: {labels[i]}", color=color)
    ax.axis('off')
plt.tight_layout()
plt.show()
```

---

## 6. 保存与加载模型

```python
# 保存模型
torch.save(model.state_dict(), "mnist_model.pth")
print("模型已保存")

# 加载模型
model_loaded = SimpleNN()
model_loaded.load_state_dict(torch.load("mnist_model.pth"))
model_loaded.eval()

# 预测单张图片
def predict_image(model, image_path):
    from PIL import Image
    image = Image.open(image_path).convert('L')
    transform = transforms.Compose([
        transforms.Resize((28, 28)),
        transforms.ToTensor(),
        transforms.Normalize((0.1307,), (0.3081,))
    ])
    tensor = transform(image).unsqueeze(0).to(device)
    
    with torch.no_grad():
        output = model(tensor)
        prediction = output.argmax(dim=1).item()
    return prediction
```

---

## 7. 训练过程的本质

```
神经网络训练 = 反复做三件事:

1. 前向传播 (Forward)
   └── 输入数据 → 逐层计算 → 得到预测结果
   
2. 计算损失 (Loss)
   └── 预测结果 vs 真实标签 → 差距有多大
   
3. 反向传播 + 更新 (Backward + Optimize)
   └── 计算每个参数对损失的"责任" (梯度)
   └── 沿梯度反方向微调参数，减小损失

想象你在山顶，要走到山谷最低点:
├── 前向传播: 看看当前位置的高度 (损失)
├── 反向传播: 看看往哪个方向走下坡最快 (梯度)
└── 优化器: 迈一步 (更新参数)

重复 10000 次，你就从山顶走到了山谷——模型从随机猜测变成了精准预测。
```

---

## 8. 进阶: 换成 CNN (卷积神经网络)

```python
class CNN(nn.Module):
    """卷积神经网络: 专门处理图像，比全连接网络效果更好"""
    
    def __init__(self):
        super(CNN, self).__init__()
        
        # 卷积层: 自动学习图像特征 (边缘、纹理、形状)
        self.conv1 = nn.Conv2d(1, 32, kernel_size=3, padding=1)   # 1通道 → 32通道
        self.conv2 = nn.Conv2d(32, 64, kernel_size=3, padding=1)  # 32通道 → 64通道
        
        self.pool = nn.MaxPool2d(2, 2)  # 下采样: 28×28 → 14×14 → 7×7
        self.dropout = nn.Dropout(0.25)
        
        # 全连接层
        self.fc1 = nn.Linear(64 * 7 * 7, 128)
        self.fc2 = nn.Linear(128, 10)
    
    def forward(self, x):
        x = self.pool(F.relu(self.conv1(x)))  # 28×28 → 14×14
        x = self.pool(F.relu(self.conv2(x)))  # 14×14 → 7×7
        
        x = x.view(-1, 64 * 7 * 7)            # 展平
        x = F.relu(self.fc1(x))
        x = self.dropout(x)
        x = self.fc2(x)
        return x

# 同样训练流程，但 CNN 通常能达到 99%+ 准确率
```

---

## 9. 你学到了什么？

```
✅ PyTorch 张量与自动求导
✅ 搭建神经网络 (nn.Module)
✅ 理解激活函数 (ReLU) 的作用
✅ 数据加载与预处理 (DataLoader)
✅ 定义损失函数 (CrossEntropyLoss) 和优化器 (Adam)
✅ 训练循环: 前向 → 损失 → 反向 → 更新
✅ 评估模型与可视化预测结果
✅ 保存/加载训练好的模型
```

---

## Related

- [[数学基础/Python_for_AI_Basics]] — Python 语法基础
- [[数学基础/Python_Data_Science_Toolkit]] — NumPy / Pandas
- [[数学基础/AI_Development_Environment_Setup]] — GPU 环境配置
- [[机器学习/Supervised_Learning/Your_First_ML_Model]] — 第一个传统 ML 模型
- [[深度学习/Neural_Network_Core/Neural_Network_Core_for_dummy]] — 神经网络原理小白版
