---
title: AI硬件与芯片 (AI Hardware)
category: 01-fundamentals-ai-hardware
tags: ["fundamentals", "math", "algorithms", "basics"]
summary: "| 文档 | 内容 | 适用读者 |"
created: 2026-05-31
updated: 2026-05-31
---

# AI硬件与芯片 (AI Hardware)

## 文档导航

| 文档 | 内容 | 适用读者 |
|------|------|----------|
| [AI_Hardware_2026.md](./AI_Hardware_2026.md) | AI芯片与硬件2026全景 | 全面学习 |

## 核心内容

### GPU对比 (2026年)

| GPU | 显存 | 带宽 | 价格 | 适用场景 |
|-----|------|------|------|----------|
| H100 | 80GB | 3.35 TB/s | ~$33k | 训练 |
| H200 | 141GB | 4.8 TB/s | ~$40k | 推理 |
| B200 | 192GB | 8 TB/s | TBD | 下一代 |
| MI300X | 192GB | 5.3 TB/s | ~$15k | AMD替代 |

### 关键决策

```
选择GPU:
├── 训练大模型 → H100/H200 集群
├── 70B+推理 → H200 (单卡141GB)
├── 预算敏感 → AMD MI300X
├── 边缘部署 → Jetson系列
└── 个人开发 → RTX 4090 / A6000
```

## 一句话总结

> **AI硬件是AI能力的天花板** — 选择合适的GPU可以让你的模型训练和推理效率提升数倍。

---

## 参考

- [NVIDIA Data Center GPUs](https://www.nvidia.com/en-us/data-center/)
- [AMD Instinct](https://www.amd.com/en/products/accelerators/instinct/)
- [MLPerf Benchmarks](https://mlcommons.org/benchmarks/)

## Related

- [[01_Fundamentals/Fundamentals-in-nutshell]] — AI 基础速成指南 (共享: algorithms, basics, fundamentals, math)
- [[01_Fundamentals/Java_Ecosystem_AI/Java_Ecosystem_AI_Overview]] — Java 生态与 AI：全景概览 (共享: algorithms, basics, fundamentals, math)
- [[01_Fundamentals/Java_Ecosystem_AI/Spring_AI_Deep_Dive]] — Spring AI 深度解析 (共享: algorithms, basics, fundamentals, math)
- [[01_Fundamentals/README]] — 01 基础理论 (Fundamentals) (共享: algorithms, basics, fundamentals, math)
- [[concepts/data-structures-algorithms.md|data-structures-algorithms]]
