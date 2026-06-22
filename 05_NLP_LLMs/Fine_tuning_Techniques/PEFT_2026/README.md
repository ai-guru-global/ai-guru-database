---
title: PEFT 2026 (参数高效微调)
category: 05-nlp-llms-fine-tuning-techniques-peft-2026
tags: ["nlp", "llm", "transformer", "gpt", "bert"]
summary: "| 文档 | 内容 | 适用读者 |"
created: 2026-05-31
updated: 2026-05-31
---

# PEFT 2026 (参数高效微调)

## 文档导航

| 文档 | 内容 | 适用读者 |
|------|------|----------|
| [PEFT_2026.md](./PEFT_2026.md) | LoRA/QLoRA/DoRA 2026 最佳实践 | 实战学习 |

## 核心方法

| 方法 | 显存需求 | 质量 | 特点 |
|------|---------|------|------|
| LoRA | 2x A100 | 95% | 标准方法 |
| QLoRA | 48GB | 93% | 消费级 GPU 可训 70B |
| DoRA | 2x A100 | 98% | 质量最优 |
| rsLoRA | 2x A100 | 96% | 支持高 rank |

## 超参数速查

```python
config = {
    "r": 16,          # rank: 8-64
    "alpha": 32,      # 2*r
    "dropout": 0.05,  # 0.05-0.1
    "lr": 2e-4,       # 1e-4 ~ 2e-4
    "epochs": 1-3,    # 避免过拟合
}
```

## 一句话总结

> **PEFT 让大模型微调不再"烧钱"** — 2026 年的 QLoRA 可以在单张消费级显卡上微调 70B 参数模型。

---

## 参考

- [HuggingFace PEFT](https://github.com/huggingface/peft)
- [Unsloth](https://github.com/unslothai/unsloth) - 加速微调
- [LoRA Paper](https://arxiv.org/abs/2106.09685)

## Related

- [[05_NLP_LLMs/Fine_tuning_Techniques/README]] — 微调技术 (Fine-tuning Techniques) (共享: bert, gpt, llm, nlp, transformer)
- [[05_NLP_LLMs/LLM_Architectures/LLM-Basics-in-nutshell]] — 大语言模型基础速成指南 (共享: bert, gpt, llm, nlp, transformer)
- [[05_NLP_LLMs/Multimodal_Models/Multimodal_Architectures_2026]] — 多模态模型架构 2026：从 GPT-4V 到原生多模态 AGI (共享: bert, gpt, llm, nlp, transformer)
- [[05_NLP_LLMs/Prompt_Engineering/Prompt-Engineering-in-nutshell]] — Prompt Engineering 速成指南 (共享: bert, gpt, llm, nlp, transformer)
- [[05_NLP_LLMs/Long_Context_Models_2026.md|Long_Context_Models_2026]]
- [[05_NLP_LLMs/Sequence_Models/Sequence_Models_for_dummy.md|Sequence_Models_for_dummy]]
