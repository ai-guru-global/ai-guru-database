---
title: 联邦学习 (Federated Learning)
category: "19-ethics-safety"
tags: ["federated-learning", "privacy", "distributed-training", "FedAvg"]
summary: "联邦学习让多个参与方在不共享原始数据的前提下协作训练模型，是隐私保护 AI 的核心技术。"
created: 2026-06-04
updated: 2026-06-04
---

# 联邦学习 (Federated Learning)

> **一句话理解**: 数据不动模型动——多个参与方在本地训练模型，只上传模型更新（而非原始数据），实现隐私保护下的协作学习。

---

## 核心内容

- [联邦学习深度解读](./Federated_Learning_Deep_Dive.md) — 从 FedAvg 到联邦 LLM 微调

## 关键主题

| 主题 | 核心技术 | 挑战 |
|------|----------|------|
| **算法** | FedAvg, FedProx, SCAFFOLD | 数据异构性 (Non-IID) |
| **隐私** | 差分隐私, 安全聚合 | 梯度泄露攻击 |
| **通信** | 压缩, 稀疏化 | 带宽瓶颈 |
| **应用** | 医疗, 金融, 输入法 | 部署复杂度 |
