---
title: "TensorFlow 概览"
category: "03-deep-learning-dl-frameworks"
tags: ["deep-learning", "framework", "neural-network", "tensorflow", "keras", "google"]
summary: "Google 出品的深度学习框架，静态图+Keras 高层 API，生产部署生态（TF Serving/TF Lite/TF.js）最完善，移动端与边缘部署首选。"
sources:
  - "https://www.tensorflow.org/"
created: 2026-06-12
updated: 2026-06-23
lifecycle: reviewed
tier: supporting
aliases:
  - "Tensorflow Overview"
  - "tensorflow overview"
  - tensorflow_overview

---
# TensorFlow 概览

> **一句话理解**: Google 出品的深度学习框架，静态图+Keras 高层 API，生产部署生态（TF Serving/TF Lite/TF.js）最完善，移动端与边缘部署首选。

## 简介

TensorFlow 于 2015 年由 Google Brain 团队发布，作为 Theano 的继任者。早期采用**静态计算图**（define-then-run），2.0 后引入 Eager Execution 兼顾动态图。其最大优势是**端到端部署生态**——从训练（TF/Keras）到服务（TF Serving）到移动（TF Lite）到浏览器（TF.js）到嵌入式（TF Micro），一条龙覆盖。Keras 3（2024+）已支持多后端（TF/JAX/PyTorch）。

**官网**: [tensorflow.org](https://www.tensorflow.org/) · **最新版本**: TensorFlow 2.18 / Keras 3（2026）

## 核心特性

| 特性 | 说明 |
|------|------|
| **Keras 3 高层 API** | 简洁的 Sequential/Functional API，快速原型 |
| **多后端** | Keras 3 支持 TF / JAX / PyTorch 后端切换 |
| **TF Serving** | 生产级模型服务（gRPC/REST） |
| **TF Lite** | 移动端/嵌入式推理（Android/iOS/Micro） |
| **TF.js** | 浏览器端训练与推理（WebGL/WASM） |
| **tf.function** | 将 Python 函数编译为静态图（性能优化） |
| **TPU 原生支持** | Google Cloud TPU 一等公民 |
| **TensorBoard** | 训练可视化（损失曲线、计算图、profiler） |

## 典型用法（Keras 3）

```python
import tensorflow as tf

# 定义模型（Keras 函数式 API）
model = tf.keras.Sequential([
    tf.keras.layers.Dense(256, activation='relu', input_shape=(784,)),
    tf.keras.layers.Dropout(0.2),
    tf.keras.layers.Dense(10, activation='softmax')
])

model.compile(
    optimizer='adam',
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)

# 训练（一行 fit，内置进度条/回调）
model.fit(train_ds, epochs=10, validation_data=val_ds)

# 导出为 TF Lite（移动端部署）
converter = tf.lite.TFLiteConverter.from_keras_model(model)
tflite_model = converter.convert()
open('model.tflite', 'wb').write(tflite_model)
```

## 框架对比

| 维度 | TensorFlow | PyTorch | JAX |
|------|------------|---------|-----|
| 计算图 | 静态为主 + Eager | 动态（define-by-run） | 函数式（jit） |
| 高层 API | Keras（简洁） | 较底层（灵活） | Flax（函数式） |
| 移动端 | ✅ TF Lite（最成熟） | PyTorch Mobile | 弱 |
| 浏览器 | ✅ TF.js | 弱 | 弱 |
| 生产服务 | ✅ TF Serving | TorchServe | 外部 |
| 研究占比(2026) | ~10% | ~85% | ~5% |
| 优势定位 | 生产/边缘部署 | 研究/原型 | TPU/函数式 |

## 适用场景

- **首选 TensorFlow**：移动端/边缘部署、浏览器端推理、需要端到端 MLOps 工具链
- **首选 Keras 3**：想用简洁 API 同时保持后端灵活性（可切 JAX 加速）
- **考虑 PyTorch**：学术研究、LLM 微调、需要动态调试

## Related

- [[深度学习/README|深度学习]] — 章节主页
- [[深度学习/DL_Frameworks/pytorch_overview|PyTorch 概览]] — 竞品对比
- [[部署推理/README|部署与推理]] — TF Serving/TF Lite 部署
- [[MLOps/README|MLOps 流水线]] — TF 端到端工具链
