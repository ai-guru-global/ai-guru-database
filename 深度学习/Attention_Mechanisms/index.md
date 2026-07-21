---
title: 注意力机制 (Attention Mechanisms)
category: 03-deep-learning
tags: ["attention", "flash-attention", "gqa", "mla"]
summary: "注意力机制子目录：从 Self-Attention 到 Flash Attention、GQA、MLA 的完整技术图谱。"
created: 2026-07-21
updated: 2026-07-21
tier: core
sources: []

---
# 注意力机制 (Attention Mechanisms)

## 内容索引

| 主题 | 难度 | 文档链接 |
|------|------|---------|
| 注意力机制全景 | 进阶 | [Attention_Mechanisms.md](./Attention_Mechanisms.md) |

## 核心变体

- **Self-Attention**: Transformer 基础，O(n²) 复杂度
- **Flash Attention**: IO-aware 分块计算，显存 O(n)
- **GQA**: 分组查询，KV Cache 压缩 4-8×
- **MLA**: 多潜变量注意力，DeepSeek 采用
- **Linear Attention**: O(n) 复杂度，RetNet/RWKV
- **Sparse Attention**: 滑动窗口/块稀疏/LSH

## 相关文档

- [[深度学习/README|深度学习总览]]
- [[大模型/Transformer_Deep_Dive|Transformer 深度解析]]
- [[深度学习/State_Space_Models/|状态空间模型]]
