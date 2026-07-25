---
title: "QLoRA 量化 LoRA 微调 (Quantized LoRA Fine-tuning)"
category: -concepts
tags: ["qlora", "lora", "quantization", "4bit", "fine-tuning", "peft"]
relationships:
  - target: "概念/lora-peft"
    type: related_to
  - target: "概念/llm-quantization"
    type: related_to
  - target: "概念/swift"
    type: related_to
sources:
  - 12_架构基建/AI_Stack_Deep_Dive.md
summary: "QLoRA 是 4-bit 量化 + LoRA 微调的组合技术——将基座模型量化到 4-bit 存储，仅训练 LoRA 适配器，使 65B 模型微调可在单张 48GB GPU 上完成。"
provenance:
  extracted: 0.20
  inferred: 0.70
  ambiguous: 0.10
base_confidence: 0.85
lifecycle: reviewed
tier: core
updated: 2026-07-21
---

# QLoRA 量化 LoRA 微调

> **一句话理解**: QLoRA 是"穷人的全参微调"——把 65B 模型压缩到 4-bit，只训练 LoRA 适配器，单卡 48GB 就能微调大模型。

---

## 1. 核心思想

| 维度 | 全参微调 | LoRA | QLoRA |
|------|---------|------|-------|
| **基座精度** | FP16/BF16 | FP16/BF16 | **NF4 (4-bit)** |
| **训练参数** | 全部 | LoRA 适配器 | LoRA 适配器 |
| **65B 显存** | 780GB | 130GB | **33-48GB** |
| **精度损失** | 无 | 极小 | 小 |
| **训练速度** | 慢 | 快 | 快 |

---

## 2. QLoRA 三大技术

| 技术 | 说明 |
|------|------|
| **NF4 量化** | NormalFloat 4-bit 量化，信息保留最优 |
| **双重量化** | 量化常数的再量化，额外节省 ~0.4 bit/参数 |
| **分页优化器** | GPU↔CPU 自动 offload，避免 OOM |

---

## 3. 显存对比（LLaMA-65B）

| 方法 | 训练显存 | 可用 GPU |
|------|---------|---------|
| 全参微调 FP16 | ~780GB | 多机 8×A100 |
| LoRA FP16 | ~130GB | 2×A100 80GB |
| LoRA INT8 | ~65GB | 1×A100 80GB |
| **QLoRA NF4** | **~33GB** | **1×A100 40GB / APG** |

---

## 4. 快速使用

```python
from transformers import AutoModelForCausalLM, BitsAndBytesConfig
from peft import LoraConfig, get_peft_model

# 4-bit 量化配置
bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_compute_dtype="bfloat16",
    bnb_4bit_use_double_quant=True
)

# 加载 4-bit 量化模型
model = AutoModelForCausalLM.from_pretrained(
    "meta-llama/Llama-2-70b-hf",
    quantization_config=bnb_config
)

# 添加 LoRA
lora_config = LoraConfig(r=16, lora_alpha=32, lora_dropout=0.05)
model = get_peft_model(model, lora_config)

# 仅训练 LoRA 参数（~0.1% 总参数）
model.print_trainable_parameters()
# → trainable params: 41,943,040 || all params: 67,426,091,008 || trainable%: 0.0622
```

---

## 5. QLoRA 变体

| 变体 | 改进 |
|------|------|
| **LoRA+** | 差异化学习率（B 矩阵 2-16× A 矩阵） |
| **rsLoRA** | 缩放因子调整，适配高 rank |
| **DoRA** | 权重分解（方向 + 幅度分离） |
| **PiSSA** | 主奇异值子空间适配器 |
| **LoRA-FA** | 冻结 A 矩阵，仅训练 B |

---

## Related

- [[概念/lora-peft]] — LoRA/PEFT 参数高效微调
- [[概念/llm-quantization]] — LLM 量化
- [[概念/swift]] — SWIFT 微调框架
- [[概念/fp8]] — FP8 精度格式
- [[概念/nf4]] — NF4 量化格式
- [[12_架构基建/AI_Stack_Deep_Dive]] — AI Stack 深度解析

---

## 2026 QLoRA 生态

| 特性 | 说明 | 状态 |
|------|------|------|
| **bitsandbytes** | 4-bit/8-bit 量化后端 | GA |
| **GPTQ-LoRA** | GPTQ 量化 + LoRA | GA |
| **AWQ-LoRA** | AWQ 量化 + LoRA | GA |
| **多 GPU QLoRA** | 分布式 QLoRA 训练 | GA |

## 生产最佳实践

1. **量化格式**：NF4 优于 FP4，双重量化进一步省显存
2. **rank 选择**：从 16 开始，复杂任务可增至 64/128
3. **目标模块**：优先 q_proj/v_proj，效果不足时扩展至所有线性层
4. **学习率**：QLoRA 学习率通常比全量微调高 10x（2e-4）
5. **显存估算**：65B 模型 QLoRA 约需 48GB，70B 约需 80GB

## 2026 QLoRA 生态现状

| 框架/工具 | 支持 | 特色 | 状态 |
|------|------|------|------|
| bitsandbytes | ✅ | NF4 量化 | ✅ 主流 |
| PEFT (HuggingFace) | ✅ | 原生集成 | ✅ 主流 |
| Unsloth | ✅ | 2x 加速 | ✅ 主流 |
| LLaMA-Factory | ✅ | 易用 | ✅ 主流 |
| Axolotl | ✅ | 配置灵活 | ✅ 成熟 |

## 检查清单

- [ ] GPU 支持 NF4（Ampere+）
- [ ] bitsandbytes 版本已更新
- [ ] 目标模块已选择（q_proj/v_proj 优先）
- [ ] rank 已设置（通常 16-64）
- [ ] 学习率已调优（2e-4 起点）
- [ ] 梯度检查点已启用
- [ ] 精度已验证

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|------|
| 显存 OOM | 模型太大 | 减小 batch + 梯度累积 |
| 精度损失大 | rank 太低 | 增大 rank 至 64 |
| 训练慢 | 未用 Unsloth | 启用 Unsloth 加速 |
| 过拟合 | epochs 太多 | 减少 epochs + 早停 |

## 延伸阅读

- [[概念/Training/nf4|NF4]] — 4-bit 量化格式
- [[概念/Training/rslora|rsLoRA]] — 稳定 LoRA
- [[概念/Training/pissa|PiSSA]] — 奇异值初始化
- [[概念/Training/fine-tuning-techniques|Fine-tuning Techniques]] — 微调技术
- [[概念/LLM/lora|LoRA]] — 低秩适配

> ℹ️ QLoRA 是 2026 年资源受限场景的微调标配，NF4 + LoRA 组合可节省 80-90% 显存，配合 Unsloth 可获 2x 加速。

## 显存估算参考

| 模型规模 | NF4 显存 | LoRA 显存 | 总计 | GPU |
|------|------|------|------|------|
| 7B | 4 GB | 1 GB | 5 GB | 1×RTX 3090 |
| 13B | 8 GB | 1 GB | 9 GB | 1×RTX 4090 |
| 70B | 35 GB | 2 GB | 37 GB | 1×A100 80G |
| 70B (batch=4) | 35 GB | 8 GB | 43 GB | 1×A100 80G |

## 延伸阅读

- [[概念/Training/nf4|NF4]] — 4-bit 量化格式
- [[概念/Training/rslora|rsLoRA]] — 稳定 LoRA
- [[概念/Training/pissa|PiSSA]] — 奇异值初始化
- [[概念/Training/fine-tuning-techniques|Fine-tuning Techniques]] — 微调技术
- [[概念/LLM/lora|LoRA]] — 低秩适配

> ℹ️ QLoRA 是 2026 年资源受限场景的微调标配，NF4 + LoRA 组合可节省 80-90% 显存。

## 检查清单

- [ ] GPU 支持 NF4
- [ ] bitsandbytes 已更新
- [ ] 目标模块已选择
- [ ] rank 已设置
- [ ] 精度已验证

> ℹ️ QLoRA NF4 + LoRA 是资源受限微调的标配。
