---
title: "联邦学习 (Federated Learning)"
category: -concepts
tags: ["privacy", "federated-learning", "FedAvg", "distributed-training", "differential-privacy"]
relationships:
  - target: "概念/neural-networks"
    type: builds_on
  - target: "概念/bayesian-methods"
    type: related_to
sources:
  - 17_伦理安全/11_Federated_Learning
summary: "联邦学习让多个参与方在不共享原始数据的前提下协作训练模型——数据不动模型动。核心算法FedAvg/FedProx，隐私保护用差分隐私+安全聚合。"
provenance:
  extracted: 0.45
  inferred: 0.45
  ambiguous: 0.10
base_confidence: 0.87
lifecycle: reviewed
tier: core
created: 2026-06-04
updated: 2026-07-21
aliases:
  - "Federated Learning"
  - "federated learning"

name_zh: "联邦学习"
---
# 联邦学习 (Federated Learning)

> 中文简称：联邦学习

> 数据不动模型动——在隐私保护下实现多方协作训练。

---

## 1. 定义

**联邦学习**（Federated Learning）是一种分布式机器学习范式，多个参与方在本地训练模型，只上传模型更新（梯度/权重）到中央服务器聚合，**原始数据不离开本地**。

---

## 2. 核心算法

| 算法 | 创新 | 解决问题 |
|------|------|----------|
| **FedAvg** | 加权平均本地模型 | 基线 |
| **FedProx** | 近端项约束 | Non-IID 数据异构 |
| **SCAFFOLD** | 方差修正 | 客户端漂移 |
| **FedBuff** | 异步缓冲聚合 | 客户端速度不一 |

---

## 3. 隐私保护

| 技术 | 保护 | 代价 |
|------|------|------|
| **差分隐私** | 梯度加噪声 | 模型精度下降 |
| **安全聚合** | 密码学保护 | 通信开销 |
| **同态加密** | 加密计算 | 计算极慢 |

---

## 4. 联邦 LLM

| 方法 | 通信量 | 适用场景 |
|------|--------|----------|
| **Fed-LoRA** | ~100MB | 联合微调 |
| **Fed-PET** | ~10MB | 资源受限 |

---

## Related

- [[17_伦理安全/11_Federated_Learning/README]] — 联邦学习深度解析
- [[概念/neural-networks]] — 神经网络基础
- [[概念/bayesian-methods]] — 贝叶斯方法（不确定性量化）

---

## 2026 联邦学习生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **FedML** | 开源联邦学习平台 | GA |
| **PySyft** | 隐私保护机器学习 | GA |
| **FATE** | 微众银行联邦学习 | GA |
| **差分隐私** | 隐私保护技术 | GA |
| **安全聚合** | 安全模型聚合 | GA |

## 生产最佳实践

1. **隐私保护**：数据不出域用联邦学习
2. **差分隐私**：启用差分隐私保护
3. **安全聚合**：用安全聚合保护模型
4. **通信优化**：优化联邦学习通信
5. **与集中式对比**：根据场景选择联邦或集中式

## 联邦学习架构

```text
┌───────────┐   模型更新    ┌─────────────┐
│ Client A  │ ──────────→ │             │
└───────────┘             │  中央服务器  │
┌───────────┐   模型更新    │  (Aggregator)│
│ Client B  │ ──────────→ │             │
└───────────┘             └──────┬──────┘
┌───────────┐   模型更新         │ 全局模型
│ Client C  │ ──────────→       ↓
└───────────┘             下发更新后的模型
```

## 联邦学习分类

| 类型 | 数据分布 | 典型场景 |
|------|----------|----------|
| **横向联邦** | 特征相同、样本不同 | 不同地区用户行为 |
| **纵向联邦** | 样本相同、特征不同 | 银行+电商用户画像 |
| **联邦迁移** | 特征和样本都不同 | 跨域知识迁移 |

## FedAvg 配置示例

```python
# FedML 联邦学习配置
from fedml import FedML

config = {
    "federated_optimizer": "FedAvg",
    "num_clients": 10,
    "num_rounds": 100,
    "local_epochs": 5,
    "learning_rate": 0.01,
    "batch_size": 32,
    "privacy": {
        "mechanism": "differential_privacy",
        "epsilon": 8.0,
        "delta": 1e-5,
        "clipping_norm": 1.0
    },
    "aggregation": {
        "method": "weighted_average",
        "weight_by": "num_samples"
    }
}
```

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 模型收敛慢 | Non-IID 数据分布 | FedProx/SCAFFOLD |
| 通信瓶颈 | 模型太大/带宽不足 | 模型压缩/Fed-LoRA |
| 客户端掉线 | 网络不稳定 | 异步聚合/FedBuff |
| 隐私泄露 | 梯度反演攻击 | 差分隐私+安全聚合 |
| 精度下降 | DP 噪声过大 | 调优 epsilon、增大本地 epoch |

## 版本兼容性

| 框架 | 版本 | 特点 |
|------|------|------|
| FedML | 0.8+ | 最全面开源平台 |
| PySyft | 0.8+ | 隐私计算优先 |
| FATE | 2.0+ | 微众银行、企业级 |
| Flower | 1.7+ | 轻量级、易集成 |
| TensorFlow Federated | 0.7+ | Google 官方 |

## 生产检查清单

1. 评估数据分布是否 Non-IID，选择合适算法
2. 配置差分隐私参数（epsilon ≤ 8）
3. 启用安全聚合保护模型更新
4. 监控客户端参与率和掉线率
5. 设置通信压缩策略降低带宽消耗
6. 定期审计隐私保护有效性

## 版本兼容性

| 框架 | 版本 | 特性 | 适用场景 |
|------|------|------|------|
| **Flower** | ≥ 1.7 | 跨框架联邦学习 | 多语言/多框架 |
| **PySyft** | ≥ 0.9 | 隐私计算 + 联邦 | 医疗/金融 |
| **FedML** | ≥ 0.8 | 分布式联邦学习 | 大规模集群 |
| **TFF** | ≥ 0.60 | TensorFlow 联邦 | 研究/原型 |
| **Fed-LoRA** | 2025+ | 联邦 LLM 微调 | LLM 协作训练 |

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|------|
| 模型收敛慢 | 数据异构性高 | 使用 FedProx/Scaffold 算法 |
| 通信开销大 | 模型参数多 | 梯度压缩/只传 LoRA 适配器 |
| 客户端掉线率高 | 网络不稳定 | 异步聚合 + 容错机制 |
| 隐私泄露风险 | 梯度反演攻击 | 添加差分隐私噪声 |

## 生产检查清单

1. ✅ 确认数据不出本地，仅传输模型更新
2. ✅ 配置安全聚合协议（Secure Aggregation）
3. ✅ 设置客户端最低参与率阈值
4. ✅ 监控客户端参与率和掉线率
5. ✅ 设置通信压缩策略降低带宽消耗
6. ✅ 定期审计隐私保护有效性

## 总结

联邦学习是隐私保护与协作训练的最佳平衡点，在医疗、金融、政务等数据敏感领域不可替代。2026 年 Fed-LoRA 等方案使联邦学习进入 LLM 微调时代。

> 💡 联邦学习的核心价值：数据不动模型动——在保护数据主权的前提下实现多方协作训练，是数据合规与 AI 效果的双赢方案。
