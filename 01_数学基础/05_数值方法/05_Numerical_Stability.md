---
title: 数值稳定性与诊断 (Numerical Stability)
category: 01-math-foundations
tags: ["numerical-stability", "nan", "gradient", "loss-scaling", "debugging"]
summary: "AI 训练和推理中的数值稳定性问题全景：NaN/Inf 诊断、梯度爆炸与消失、条件数分析、稳定化技术，以及系统化的数值问题排查流程。"
created: 2026-07-21
updated: 2026-07-21
tier: supporting
sources: []

name_zh: "数值稳定性与诊断"
---
# 数值稳定性与诊断

> 中文简称：数值稳定性与诊断

## 1. 数值不稳定的典型表现

### 1.1 症状分类

| 症状 | 表现 | 常见原因 |
|------|------|----------|
| Loss = NaN | 训练突然崩溃 | 除零、log(0)、溢出 |
| Loss = Inf | 损失无穷大 | 梯度爆炸、学习率过大 |
| Loss 不下降 | 卡在初始值 | 梯度消失、学习率过小 |
| Loss 震荡 | 剧烈波动 | batch 太小、学习率过大 |
| 权重全零 | 神经元死亡 | ReLU 死区、初始化不当 |
| 精度突然下降 | 推理结果异常 | 量化溢出、KV Cache 累积误差 |

### 1.2 数值问题传播链

```
输入异常 → 激活值溢出 → 梯度 NaN → 权重 NaN → 全部输出 NaN
    ↑                                                    │
    └────────────── 不可逆污染 ←─────────────────────────┘

关键: 一旦 NaN 进入权重，整个模型不可恢复，必须回滚检查点
```

## 2. 常见数值问题根因分析

### 2.1 除法与对数

```python
# 问题: 除零
prob = 0.0
log_prob = math.log(prob)  # ValueError: math domain error

# 修复: 加 epsilon
eps = 1e-8
log_prob = math.log(prob + eps)

# 问题: Softmax 中的 exp 溢出
scores = torch.tensor([1000.0, 1.0, 0.5])
probs = torch.exp(scores) / torch.exp(scores).sum()  # inf/inf = NaN

# 修复: Log-Sum-Exp 技巧
def stable_log_softmax(x):
    x_max = x.max()
    return x - x_max - torch.log(torch.exp(x - x_max).sum())

# PyTorch 内置稳定实现
log_probs = F.log_softmax(scores, dim=-1)  # 内部已处理
```

### 2.2 梯度爆炸

```python
# 诊断: 监控梯度范数
total_norm = torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=float('inf'))
print(f"Gradient norm: {total_norm:.2f}")

# 典型爆炸场景:
# 1. RNN 长序列 (BPTT 连乘)
# 2. 学习率过大 (lr > 1e-2 for Adam)
# 3. 权重初始化过大
# 4. Loss 函数设计不当

# 修复方案:
# 方案1: 梯度裁剪
torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)

# 方案2: 降低学习率 + Warmup
scheduler = torch.optim.lr_scheduler.OneCycleLR(
    optimizer, max_lr=1e-3, 
    pct_start=0.1,  # 10% warmup
    total_steps=10000
)

# 方案3: 权重正则化
optimizer = torch.optim.AdamW(model.parameters(), lr=1e-4, weight_decay=0.01)
```

### 2.3 梯度消失

```python
# 诊断: 检查各层梯度
for name, param in model.named_parameters():
    if param.grad is not None:
        grad_norm = param.grad.norm().item()
        if grad_norm < 1e-7:
            print(f"⚠️ 梯度消失: {name}, norm={grad_norm:.2e}")

# 典型消失场景:
# 1. 深层网络 (>100层) 无残差连接
# 2. Sigmoid/Tanh 饱和区
# 3. 权重初始化过小
# 4. FP16 下溢 (梯度 < 6×10⁻⁵)

# 修复方案:
# 方案1: 残差连接 (ResNet/Transformer)
# 方案2: 合理初始化 (Xavier/Kaiming)
# 方案3: LayerNorm / BatchNorm
# 方案4: 使用 BF16 代替 FP16 (更大动态范围)
```

### 2.4 条件数与病态优化

```python
# Hessian 条件数大 → 损失面"峡谷"形 → 优化困难
# 条件数 κ = λ_max / λ_min

# 诊断: 近似估计条件数
def estimate_condition_number(model, dataloader, num_batches=10):
    """用 Hessian 对角近似估计条件数"""
    hessian_diag = []
    for batch in itertools.islice(dataloader, num_batches):
        loss = model(batch)
        loss.backward()
        for p in model.parameters():
            if p.grad is not None:
                hessian_diag.append(p.grad.abs().mean().item())
    
    h = torch.tensor(hessian_diag)
    condition_number = h.max() / (h.min() + 1e-8)
    return condition_number.item()

# 条件数参考:
# κ < 10:    良好，SGD 即可
# κ ~ 100:   中等，Adam 推荐
# κ > 1000:  病态，需要预处理/二阶方法
# κ > 10000: 严重病态，检查模型设计
```

## 3. Transformer 特有的数值问题

### 3.1 注意力分数溢出

```python
# 问题: Q·K^T 值过大 → Softmax 饱和 → 梯度消失
# 原因: d_k 大时，点积方差 = d_k

# 标准修复: Scaled Dot-Product Attention
# score = Q·K^T / √d_k

# 2026 新问题: 超长上下文 (1M tokens)
# - 注意力分数分布更极端
# - 部分 head 出现 "attention sink" 现象
# - 修复: QK-Norm (DeepSeek/LLaMA3 采用)

class QKNorm(nn.Module):
    """QK 归一化: 防止注意力分数爆炸"""
    def __init__(self, d_head):
        super().__init__()
        self.q_norm = nn.RMSNorm(d_head)
        self.k_norm = nn.RMSNorm(d_head)
    
    def forward(self, q, k):
        return self.q_norm(q), self.k_norm(k)
```

### 3.2 LayerNorm 数值问题

```python
# 问题: FP16 下 LayerNorm 的方差计算可能下溢
# 修复: 在 FP32 中计算统计量

class StableLayerNorm(nn.Module):
    def forward(self, x):
        # 转为 FP32 计算均值和方差
        x_fp32 = x.float()
        mean = x_fp32.mean(-1, keepdim=True)
        var = x_fp32.var(-1, keepdim=True, unbiased=False)
        # 归一化
        x_norm = (x_fp32 - mean) / torch.sqrt(var + self.eps)
        # 转回原精度
        return (x_norm * self.weight + self.bias).to(x.dtype)

# RMSNorm (更稳定，LLaMA/Qwen 采用):
# 去掉均值中心化，只用 RMS
# RMS(x) = √(mean(x²) + eps)
```

### 3.3 KV Cache 精度累积

```python
# 长序列推理时，KV Cache 中的舍入误差会累积
# 1M token 上下文 → 数千次注意力计算 → 误差累积

# 解决方案:
# 1. KV Cache 用 FP16/BF16 (而非 INT8)
# 2. 定期 "刷新" — 重新计算部分 KV
# 3. 分组查询注意力 (GQA) 减少 Cache 大小
# 4. 滑动窗口注意力限制 Cache 长度
```

## 4. 系统化数值诊断流程

### 4.1 训练时监控

```python
class NumericalMonitor:
    """训练数值健康监控器"""
    
    def __init__(self, model, check_interval=100):
        self.model = model
        self.check_interval = check_interval
        self.step = 0
        self.history = {'loss': [], 'grad_norm': [], 'weight_norm': []}
    
    def check(self, loss, optimizer):
        self.step += 1
        if self.step % self.check_interval != 0:
            return True  # 跳过
        
        # 1. Loss 检查
        if torch.isnan(loss) or torch.isinf(loss):
            print(f"🚨 Step {self.step}: Loss is {loss.item()}")
            return False
        
        # 2. 梯度检查
        total_norm = 0
        for p in self.model.parameters():
            if p.grad is not None:
                if torch.isnan(p.grad).any():
                    print(f"🚨 Step {self.step}: NaN gradient detected")
                    return False
                total_norm += p.grad.norm()**2
        total_norm = total_norm**0.5
        
        # 3. 权重检查
        for name, p in self.model.named_parameters():
            if torch.isnan(p).any():
                print(f"🚨 Step {self.step}: NaN weight in {name}")
                return False
        
        self.history['loss'].append(loss.item())
        self.history['grad_norm'].append(total_norm.item())
        return True
```

### 4.2 数值问题排查决策树

```
Loss 异常?
├── NaN
│   ├── 第一步就 NaN? → 检查输入数据/初始化
│   ├── 训练中途 NaN? → 检查学习率/梯度裁剪
│   └── 特定 batch NaN? → 检查数据中的异常值
├── Inf
│   ├── 梯度 Inf? → 降低学习率 + 梯度裁剪
│   └── 激活 Inf? → 检查 LayerNorm/权重范围
├── 不下降
│   ├── 梯度为零? → 检查 requires_grad/计算图
│   ├── 梯度极小? → 梯度消失 → 残差/初始化
│   └── 梯度正常但不降? → 学习率太小/局部极小
└── 震荡
    ├── 周期性? → batch 太小/数据顺序
    └── 随机性? → 学习率太大/正则化不足
```

## 5. 稳定化技术汇总

| 技术 | 适用场景 | 原理 | 开销 |
|------|----------|------|------|
| Gradient Clipping | 通用训练 | 限制梯度范数 | 极小 |
| Loss Scaling | FP16 训练 | 放大 loss 防下溢 | 无 |
| Layer/RMS Norm | Transformer | 归一化激活值 | 小 |
| Weight Decay | 通用训练 | 限制权重大小 | 无 |
| Warmup | 训练初期 | 渐进增大学习率 | 无 |
| QK-Norm | 注意力层 | 归一化 Q/K 向量 | 小 |
| Log-Sum-Exp | Softmax/CE | 避免 exp 溢出 | 无 |
| Epsilon Smoothing | 除法/Log | 避免除零 | 无 |
| Gradient Checkpointing | 深层网络 | 重算代替存储 | 计算+30% |
| Stochastic Depth | 深层网络 | 随机跳层 | 无 |

## 相关文档

- [[01_数学基础/05_数值方法/Numerical_Methods|数值方法总论]]
- [[01_数学基础/05_数值方法/01_Floating_Point_精确度|浮点精度]]
- [[03_深度学习/03_优化方法/02_优化|优化方法]] — 优化器与收敛
- [[07_模型训练/04_分布式训练/|分布式训练]] — 多卡数值同步
- [[05_大模型/05_LLM架构/09_LLM_Internals_训练|训练内幕]] — 大模型训练稳定性
