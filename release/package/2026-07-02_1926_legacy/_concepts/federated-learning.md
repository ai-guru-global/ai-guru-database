---
title: "联邦学习 (Federated Learning)"
category: -concepts
tags: ["privacy", "federated-learning", "FedAvg", "distributed-training", "differential-privacy"]
relationships:
  - target: "_concepts/neural-networks"
    type: builds_on
  - target: "_concepts/bayesian-methods"
    type: related_to
sources:
  - 伦理安全/Federated_Learning
summary: "联邦学习让多个参与方在不共享原始数据的前提下协作训练模型——数据不动模型动。核心算法FedAvg/FedProx，隐私保护用差分隐私+安全聚合。"
provenance:
  extracted: 0.45
  inferred: 0.45
  ambiguous: 0.10
base_confidence: 0.87
lifecycle: stable
tier: core
created: 2026-06-04
updated: 2026-06-04
aliases:
  - "Federated Learning"
  - "federated learning"

---
# 联邦学习 (Federated Learning)

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

- [[伦理安全/Federated_Learning/README]] — 联邦学习深度解析
- [[_concepts/neural-networks]] — 神经网络基础
- [[_concepts/bayesian-methods]] — 贝叶斯方法（不确定性量化）
