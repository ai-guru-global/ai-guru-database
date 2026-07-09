---
title: 世界模型 (World Models)
category: 03-deep-learning-world-models
tags: ["deep-learning", "neural-networks", "backpropagation"]
summary: "| 文档 | 内容 | 适用读者 |"
created: 2026-05-31
updated: 2026-05-31
tier: supporting
sources: []

---
# 世界模型 (World Models)

## 文档导航

| 文档 | 内容 | 适用读者 |
|------|------|----------|
| [World_Models_2026.md](./World_Models_2026.md) | 世界模型完整指南 (JEPA/V-JEPA/LeJEPA) | 全面学习 |

## 核心概念

### 什么是世界模型？

世界模型让 AI 能够**预测未来的抽象表征**，而非直接生成像素或文本。这是 Yann LeCun 提出的通往 AGI 的核心路径。

```
生成模型:          世界模型:
输入 → 像素        输入 → 表征 → 预测未来表征
         ↓                    ↓
    预测细节                  预测规律
    (树叶抖动)                (物体运动)
```

### JEPA 家族

| 模型 | 年份 | 特点 |
|------|------|------|
| I-JEPA | 2023 | 图像世界模型，无需数据增强 |
| V-JEPA | 2024 | 视频世界模型，理解物理规律 |
| V-JEPA 2 | 2025 | 支持动作条件预测，机器人应用 |
| LeJEPA | 2025 | 理论突破，证明可扩展性 |
| V-JEPA 2.1 | 2026 | 密集特征学习，抓取成功率+20% |
| VL-JEPA | 2025 | 视觉-语言版，非自回归生成 |

### 应用场景

- **机器人**: V-JEPA 2-AC 用于抓取和导航
- **自动驾驶**: 预测交通参与者的未来行为
- **视频理解**: 高效处理长视频序列

## 一句话总结

> **世界模型 = AI 的想象力** — 让 AI 能够在脑中"想象"未来，从而进行有效规划。

---

## 参考

- [V-JEPA 2.1 Paper](https://arxiv.org/abs/2603.14482) - 2026年最新
- [LeCun的AGI路线图](https://openreview.net/pdf?id=BZ5a1r-kVsf)
- [Meta AI JEPA项目](https://github.com/facebookresearch/ijepa)

## Related

- [[03_Deep_Learning/DL-in-nutshell]] — 深度学习速成指南 (共享: backpropagation, deep-learning, dl, neural-networks)
- [[03_Deep_Learning/README]] — 03 深度学习基础 (Deep Learning Foundations) (共享: backpropagation, deep-learning, dl, neural-networks)
- [[03_Deep_Learning/World_Models/JEPA_Architecture_2026]] — JEPA 架构深度解析：LeCun 的世界模型之路 (共享: backpropagation, deep-learning, dl, neural-networks)
- [[_concepts/neural-networks]] — 神经网络 (共享: backpropagation, dl)

## 相关页面

- [[_concepts/world-models-jepa|World Models Jepa]]
