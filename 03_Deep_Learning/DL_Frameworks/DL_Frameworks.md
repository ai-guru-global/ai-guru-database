---
title: "深度学习框架概览 (DL Frameworks)"
category: 03-deep-learning
tags: ["deep-learning", "frameworks", "pytorch", "tensorflow", "jax"]
summary: "主流深度学习框架的对比与选型指南——PyTorch、TensorFlow、JAX、Keras 各有生态和适用场景。"
created: 2026-06-15
updated: 2026-06-15
---

# 深度学习框架概览 (DL Frameworks)

> 主流深度学习框架的对比与选型指南——PyTorch、TensorFlow、JAX、Keras 各有生态和适用场景。

---

## 框架对比

| 框架 | 主导方 | 特点 | 适用场景 | 社区活跃度 |
|------|--------|------|----------|-----------|
| **PyTorch** | Meta | 动态图、Pythonic、调试友好 | 研究 + 生产（2026 主流） | 最高 |
| **TensorFlow** | Google | 静态图优化、部署生态成熟 | 移动端/嵌入式部署 | 高 |
| **JAX** | Google | 函数式、XLA 编译、自动并行 | 大规模训练、研究 | 快速增长 |
| **Keras** | Google | 高层 API、简洁易用 | 快速原型、教学 | 高 |
| **Flax** | Google | JAX 生态的 NN 库 | JAX 用户的框架选择 | 增长中 |
| **PaddlePaddle** | 百度 | 中文生态、工业部署 | 中国市场、工业场景 | 中 |

## 2026 选型建议

```
你的需求是什么？
├── LLM 训练/微调 → PyTorch (HuggingFace 生态)
├── 研究实验 → PyTorch 或 JAX
├── 移动端部署 → TensorFlow Lite / ONNX Runtime
├── 大规模分布式训练 → JAX + TPU 或 PyTorch + FSDP
├── 快速原型 → Keras
└── 不确定？→ PyTorch（最安全的选择）
```

## 相关阅读

- [[03_Deep_Learning/DL_Frameworks/pytorch_overview]] — PyTorch 概览
- [[03_Deep_Learning/DL_Frameworks/tensorflow_overview]] — TensorFlow 概览
- [[03_Deep_Learning/DL_Frameworks/keras_overview]] — Keras 概览
- [[07_Model_Training/Distributed_Training_for_dummy]] — 分布式训练入门
