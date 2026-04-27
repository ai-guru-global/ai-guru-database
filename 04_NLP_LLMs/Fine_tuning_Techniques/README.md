# 微调技术 (Fine-tuning Techniques)

## 文档导航

| 文档 | 内容 | 适用读者 |
|------|------|----------|
| [Fine_tuning_Techniques.md](./Fine_tuning_Techniques.md) | 微调技术详解 | 进阶学习 |
| [Fine_tuning_Techniques_for_dummy.md](./Fine_tuning_Techniques_for_dummy.md) | 微调入门 | 初学者 |
| [PEFT_2026/](./PEFT_2026/) | PEFT 2026最佳实践 | 实战学习 |
| [Unsloth Deep Dive](./Unsloth_Deep_Dive.md) | 高速微调框架：2x 加速、24GB 单卡 | 快速实验 |
| [Axolotl Deep Dive](./Axolotl_Deep_Dive.md) | 开源微调工具：全参数/LoRA/QLoRA 支持 | 生产微调 |

## 内容概览

### 全参数微调 vs PEFT

```
全参数微调:
├── 训练100%参数
├── 需要8x A100 (70B模型)
├── 成本: $50,000+/次
└── 适用: 基础能力改变

PEFT (参数高效微调):
├── 训练<1%参数
├── 单卡消费级GPU可训70B
├── 成本: $100+/次
└── 适用: 大多数微调任务
```

### PEFT方法对比

| 方法 | 显存需求 | 适用场景 |
|------|---------|----------|
| LoRA | 16GB (7B) | 通用微调 |
| QLoRA | 6GB (7B) | 资源受限 |
| DoRA | 16GB (7B) | 质量优先 |

## 一句话总结

> **微调让大模型"专业化"** — 从通用能力到特定任务的转变。

---

*Last updated: 2026-04-01*
