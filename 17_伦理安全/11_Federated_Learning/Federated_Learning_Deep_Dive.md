---
title: "联邦学习深度解读: 从 FedAvg 到联邦 LLM 微调"
category: "17-ethics-safety-federated-learning"
tags: ["federated-learning", "FedAvg", "FedProx", "privacy", "differential-privacy", "secure-aggregation", "FL", "Non-IID"]
summary: "联邦学习让数据不动模型动——多个参与方在本地训练，只上传模型更新。覆盖核心算法(FedAvg/FedProx/SCAFFOLD)、隐私保护(差分隐私/安全聚合)、通信优化、联邦LLM微调。"
created: 2026-06-04
updated: 2026-06-04
tier: supporting
aliases:
  - "Federated Learning Deep Dive"
  - Federated_Learning_Deep_Dive
sources: []

---
# 联邦学习深度解读: 从 FedAvg 到联邦 LLM 微调

> **一句话理解**: 数据不动模型动——多个参与方在本地训练模型，只上传模型更新（而非原始数据），实现隐私保护下的协作学习。Google 用联邦学习改进 Gboard 输入法推荐，无需上传用户击键数据。

---

## 1. 概述 (Overview)

### 1.1 为什么需要联邦学习

```
传统集中式训练 vs 联邦学习:

集中式训练:
  各参与方数据 → 上传到中央服务器 → 集中训练 → 下发模型
  ❌ 隐私风险: 原始数据离开本地
  ❌ 法规限制: GDPR/中国数据安全法禁止数据出境
  ❌ 数据孤岛: 医院/银行间数据无法共享

联邦学习:
  中央服务器下发初始模型 → 各参与方本地训练 → 上传模型更新 → 服务器聚合
  ✅ 原始数据不离开本地
  ✅ 满足数据隐私法规
  ✅ 打破数据孤岛
```

### 1.2 联邦学习的分类

| 类型 | 特征 | 参与方 | 示例 |
|------|------|--------|------|
| **横向联邦** | 特征空间相同，样本不同 | 大量客户端 | Gboard 输入法 |
| **纵向联邦** | 样本相同，特征空间不同 | 少量机构 | 银行+电商联合风控 |
| **联邦迁移** | 样本和特征都不同 | 2 方 | 跨域知识迁移 |

---

## 2. 核心算法

### 2.1 FedAvg: 联邦平均

**论文**: *Communication-Efficient Learning of Deep Networks from Decentralized Data* (McMahan et al., 2017, Google)

```
FedAvg 算法:

每轮通信:
1. 服务器下发全局模型 w_t 给所有参与方
2. 每个参与方 i 在本地数据上训练 E 个 epoch → w_t^i
3. 服务器聚合: w_{t+1} = Σ_i (n_i/n) · w_t^i
   (n_i: 第 i 方数据量, n: 总数据量)

关键: 不是简单的模型平均，而是按数据量加权平均
```

```python
# FedAvg 伪代码
import copy
import torch

def fedavg_round(global_model, clients, num_epochs=5, lr=0.01):
    """一轮 FedAvg 训练"""
    client_weights = []
    client_sizes = []
    
    for client in clients:
        # 本地训练
        local_model = copy.deepcopy(global_model)
        optimizer = torch.optim.SGD(local_model.parameters(), lr=lr)
        
        for epoch in range(num_epochs):
            for data, target in client.dataloader:
                optimizer.zero_grad()
                output = local_model(data)
                loss = torch.nn.functional.cross_entropy(output, target)
                loss.backward()
                optimizer.step()
        
        client_weights.append(local_model.state_dict())
        client_sizes.append(len(client.dataloader.dataset))
    
    # 加权聚合
    total_size = sum(client_sizes)
    global_weights = {}
    for key in client_weights[0]:
        global_weights[key] = sum(
            w[key] * (s / total_size) 
            for w, s in zip(client_weights, client_sizes)
        )
    
    global_model.load_state_dict(global_weights)
    return global_model
```

### 2.2 FedProx: 处理数据异构

**问题**: FedAvg 在 Non-IID (非独立同分布) 数据上性能下降严重。

```
Non-IID 数据的挑战:

场景: 100 个医院各有不同疾病的患者数据
- 医院A: 主要是心脏病患者
- 医院B: 主要是糖尿病患者
- 医院C: 主要是骨折患者

FedAvg: 每个医院本地模型偏向自己的数据分布 → 聚合后震荡
FedProx: 加入近端项约束本地模型不偏离全局模型太远
```

**FedProx 损失函数**:

\[
\min_w F_i(w) + \frac{\mu}{2} \|w - w_t\|^2
\]

其中 \(\mu\) 控制本地模型与全局模型的接近程度。

### 2.3 联邦学习算法对比

| 算法 | 核心创新 | 解决的问题 | 通信效率 |
|------|----------|-----------|----------|
| **FedAvg** (2017) | 加权平均 | 基线算法 | 中等 |
| **FedProx** (2020) | 近端项约束 | Non-IID 数据 | 中等 |
| **SCAFFOLD** (2020) | 方差修正 | 客户端漂移 | 好 |
| **FedNova** (2020) | 归一化平均 | 异构本地训练步数 | 好 |
| **FedOpt** (2021) | 服务器端优化器 | 收敛速度慢 | 好 |
| **FedDyn** (2021) | 动态正则化 | Non-IID + 部分参与 | 好 |
| **FedBuff** (2022) | 异步缓冲聚合 | 客户端速度不一 | 最好 |

---

## 3. 隐私保护

### 3.1 联邦学习的隐私风险

```
联邦学习的隐私攻击:

攻击1: 梯度反演 (Gradient Inversion)
  - 从上传的梯度中重建原始训练数据
  - Deep Leakage from Gradients (Zhu et al., 2019)
  - 已证明: 可以从梯度中重建图像和文本

攻击2: 成员推断 (Membership Inference)
  - 判断某条数据是否参与了训练
  - 通过模型更新差异推断

攻击3: 模型投毒 (Model Poisoning)
  - 恶意客户端上传有毒模型更新
  - 注入后门触发器

攻击4: 推断攻击 (Property Inference)
  - 从模型更新中推断客户端数据属性
  - 例如: 推断某医院是否有某疾病的患者
```

### 3.2 隐私保护技术

| 技术 | 原理 | 隐私保证 | 性能影响 |
|------|------|----------|----------|
| **差分隐私 (DP)** | 在梯度上加噪声 | 数学严格保证 | 模型精度下降 |
| **安全聚合** | 密码学保护，服务器只看到聚合结果 | 不泄露单个客户端更新 | 通信开销 |
| **同态加密** | 在加密数据上计算 | 最强保护 | 计算极慢 |
| **可信执行环境 (TEE)** | 硬件隔离 (Intel SGX) | 硬件保证 | 有限部署 |

### 3.3 差分隐私联邦学习 (DP-FedAvg)

```python
# DP-FedAvg: 在梯度上加噪声
def dp_fedavg_gradient(gradient, clip_norm=1.0, noise_scale=0.1):
    """差分隐私梯度处理"""
    # 1. 梯度裁剪 (限制单个样本的影响)
    grad_norm = torch.norm(gradient)
    if grad_norm > clip_norm:
        gradient = gradient * (clip_norm / grad_norm)
    
    # 2. 添加高斯噪声
    noise = torch.randn_like(gradient) * noise_scale * clip_norm
    dp_gradient = gradient + noise
    
    return dp_gradient

# 隐私预算 (ε, δ):
# ε 越小 → 隐私保护越强 → 噪声越大 → 模型精度越低
# 典型选择: ε ∈ [1, 10], δ = 1/n (n 为数据集大小)
```

### 3.4 安全聚合 (Secure Aggregation)

```
安全聚合协议:

目标: 服务器只能看到 Σ(各客户端更新)，看不到任何单个客户端的更新

方法: 秘密共享 + 掩码

1. 客户端 i 和 j 协商共享密钥 s_{ij}
2. 客户端 i 的掩码: mask_i = Σ_j s_{ij} (对所有 j)
3. 上传: w_i + mask_i (服务器看不到 w_i)
4. 聚合: Σ(w_i + mask_i) = Σw_i + Σmask_i
5. 因为 Σmask_i = 0 (掩码互相抵消) → 服务器得到 Σw_i

即使服务器看到聚合结果，也无法反推任何单个 w_i
```

---

## 4. 通信优化

### 4.1 通信瓶颈

| 挑战 | 说明 |
|------|------|
| **模型大小** | LLM 参数量 7B-70B → 每轮通信 14GB-140GB |
| **客户端数量** | 百万级客户端 (手机) → 聚合规模巨大 |
| **带宽限制** | 手机上行带宽通常 < 10 Mbps |
| **异步性** | 客户端随时可能掉线 |

### 4.2 通信优化技术

| 技术 | 原理 | 压缩比 | 精度影响 |
|------|------|--------|----------|
| **梯度稀疏化** | 只上传 top-k 最大梯度 | 100× | 小 |
| **梯度量化** | 1-bit/2-bit 量化 | 16-32× | 小 |
| **模型压缩** | 知识蒸馏到小模型 | 10× | 中等 |
| **部分参与** | 每轮只选部分客户端 | 10× | 无 |
| **本地多轮** | 本地训练更多 epoch | 减少轮数 | 可能漂移 |

---

## 5. 联邦学习与 LLM

### 5.1 联邦 LLM 微调

```
联邦 LLM 微调场景:

场景: 多家医院联合微调医疗 LLM，但不能共享患者数据

方案:
1. 各医院本地持有自己的医疗数据
2. 全局 LLM (如 LLaMA-3-8B) 下发到各医院
3. 各医院本地 LoRA 微调
4. 只上传 LoRA adapter 权重 (而非整个模型)
5. 服务器聚合 LoRA 权重

优势:
- LoRA adapter 仅 ~100MB (vs 完整模型 ~16GB)
- 通信开销降低 160×
- 患者数据不离开医院
```

| 联邦 LLM 方法 | 微调方式 | 通信量 | 隐私 |
|--------------|----------|--------|------|
| **Fed-LoRA** | LoRA adapter 聚合 | 小 (~100MB) | 好 |
| **Fed-PET** | Prompt tuning 聚合 | 最小 (~10MB) | 最好 |
| **Fed-QLoRA** | QLoRA + 联邦 | 小 | 好 |
| **Fed-Instruct** | 联邦指令微调 | 中 | 好 |

### 5.2 联邦 RAG

```
联邦 RAG 架构:

场景: 多家企业联合构建 RAG 系统，但不共享内部知识库

方案:
- 各企业本地维护自己的知识库
- 联邦训练共享的嵌入模型 (embedding model)
- 联邦训练共享的重排序模型
- 查询时: 路由到各企业知识库，聚合答案
```

---

## 6. 开源框架

| 框架 | 维护者 | 特点 | 活跃度 |
|------|--------|------|--------|
| **Flower** | Flower Labs | 最流行，PyTorch/TF/JAX | 非常活跃 |
| **FedML** | FedML Inc | 全栈平台 | 活跃 |
| **OpenFL** | Intel | 医疗专项 | 活跃 |
| **PySyft** | OpenMined | 隐私计算全栈 | 活跃 |
| **NVIDIA FLARE** | NVIDIA | GPU 优化 | 活跃 |
| **FATE** | 微众银行 | 纵向联邦 | 活跃 (中国) |

---

## 7. 应用场景

| 场景 | 参与方 | 数据类型 | 隐私需求 |
|------|--------|----------|----------|
| **Gboard** (Google) | 百万手机 | 击键数据 | 极高 |
| **医疗 AI** | 多家医院 | 患者影像/病历 | 极高 (HIPAA) |
| **金融风控** | 多家银行 | 交易记录 | 极高 (法规) |
| **自动驾驶** | 多辆汽车 | 传感器数据 | 中等 |
| **工业 IoT** | 多台设备 | 传感器数据 | 中等 |

---

## 8. 局限与开放问题

1. **Non-IID 数据**: 客户端数据分布差异仍是核心挑战
2. **通信效率**: 大模型联邦训练通信代价极高
3. **系统异构**: 客户端算力/带宽/存储差异巨大
4. **隐私-效用权衡**: 差分隐私的噪声会降低模型质量
5. **恶意客户端**: 投毒攻击的检测和防御仍不完善
6. **评估困难**: 缺乏统一的联邦学习 benchmark

---

## 9. 工程实践

| 关注点 | 建议 |
|--------|------|
| **算法选择** | IID 数据: FedAvg; Non-IID: FedProx/SCAFFOLD |
| **隐私保护** | 至少使用安全聚合; 敏感场景加差分隐私 |
| **通信优化** | 梯度稀疏化 + 量化可减少 100× 通信 |
| **LLM 场景** | 使用 Fed-LoRA (只传 adapter 权重) |
| **框架** | 通用: Flower; 医疗: OpenFL; 中国生态: FATE |

---

## References

- McMahan et al., "Communication-Efficient Learning of Deep Networks" (FedAvg, 2017)
- Li et al., "Federated Optimization in Heterogeneous Networks" (FedProx, 2020)
- Kairouz et al., "Advances and Open Problems in Federated Learning" (2021)
- Zhu et al., "Deep Leakage from Gradients" (2019)

## 相关链接

- [[17_伦理安全/11_Federated_Learning/README|联邦学习概览]] — 联邦学习主题导览
- [[17_伦理安全/11_Federated_Learning/index|联邦学习索引]] — 联邦学习索引
- [[17_伦理安全/10_Privacy_Preserving_AI/Privacy_Preserving_AI|隐私保护 AI]] — 联邦学习的隐私目标
- [[概念/General/federated-learning|联邦学习]] — 联邦学习概念卡片
- [[概念/Training/distributed-training|分布式训练]] — 联邦学习的分布式基础
- [[05_大模型/07_Fine_tuning_Techniques/PEFT_2026|PEFT 2026 完全指南]] — 联邦 LLM 微调的 PEFT 方法
