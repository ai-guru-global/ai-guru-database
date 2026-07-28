---
title: "LLaMA-Factory"
category: -concepts
tags: ["llama-factory", "fine-tuning", "lora", "sft", "training-framework"]
relationships:
  - target: "概念/Training/fine-tuning-techniques"
    type: complements
  - target: "概念/Training/lora-peft"
    type: related_to
  - target: "概念/Training/sft"
    type: related_to
sources:
  - 05_大模型/07_Fine_tuning_Techniques/
  - 07_模型训练/
summary: "LLaMA-Factory 是最流行的开源 LLM 微调框架之一，统一支持百余种模型的 SFT/LoRA/QLoRA/DPO/PPO 训练，提供 WebUI 零代码微调，是中文社区微调的事实标准工具。"
provenance:
  extracted: 0.55
  inferred: 0.35
  ambiguous: 0.10
base_confidence: 0.88
lifecycle: reviewed
tier: supporting
created: 2026-07-27
updated: 2026-07-27
aliases:
  - "LLaMA-Factory"
  - "LlamaFactory"
  - "llamafactory"
name_zh: "一站式微调框架"
---
# LLaMA-Factory

> 中文简称：一站式微调框架

> 微调界的"瑞士军刀"：一套配置跑遍主流模型和训练方法。

---

## 1. 定义

**LLaMA-Factory**（hiyouga 开源，ACL 2024）是统一的 LLM 微调框架，核心卖点：

1. **模型覆盖**：Llama/Qwen/DeepSeek/GLM/Gemma 等 100+ 模型开箱即用
2. **方法全**：SFT、LoRA/QLoRA、DPO/KTO/ORPO、PPO、预训练续训
3. **零代码**：`llamafactory-cli webui` 图形界面配置训练
4. **工程集成**：DeepSpeed/FSDP、FlashAttention、vLLM 推理导出

---

## 2. 支持的训练方法矩阵

| 阶段 | 方法 | 显存需求（7B 参考） |
|------|------|---------------------|
| 预训练 | 全参续训 | 8×A100 |
| SFT | 全参 / Freeze / LoRA / QLoRA | 全参 4×80G；QLoRA 单卡 24G |
| 偏好对齐 | DPO / KTO / ORPO / SimPO | LoRA 模式单卡可跑 |
| RLHF | PPO / 奖励模型训练 | 多卡 |

---

## 3. 典型工作流

```bash
# 1. 准备数据（alpaca/sharegpt 格式注册到 dataset_info.json）
# 2. 训练
llamafactory-cli train examples/train_lora/llama3_lora_sft.yaml
# 3. 合并 LoRA 权重
llamafactory-cli export merge_config.yaml
# 4. 部署
llamafactory-cli api / vllm serve
```

---

## 4. 同类工具对比

| 工具 | 定位 | 特点 |
|------|------|------|
| **LLaMA-Factory** | 全能微调平台 | WebUI、模型/方法覆盖最广 |
| **Axolotl** | 英文社区主流 | yaml 配置、社区配方多 |
| **unsloth** | 单卡效率之王 | 手写 kernel，速度 ×2、显存 −70% |
| **TRL** | HuggingFace 官方库 | 底层原语，二次开发友好 |
| **ms-swift** | 魔搭生态 | 国产模型第一时间适配 |

---

## Related

- [[概念/Training/fine-tuning-techniques]] — 微调技术总览
- [[概念/Training/lora-peft]] — LoRA/PEFT
- [[概念/Training/qlora]] — QLoRA
- [[概念/Training/sft]] — SFT
- [[概念/Training/dpo]] — DPO
- [[概念/Training/deepspeed]] — DeepSpeed

> ℹ️ 实践提示：LLaMA-Factory 适合快速验证与中小规模微调；超大规模生产训练仍需 Megatron/DeepSpeed 原生栈。
