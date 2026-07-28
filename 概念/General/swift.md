---
title: "SWIFT 微调框架 (ModelScope SWIFT Fine-tuning Framework)"
category: -concepts
tags: ["swift", "modelscope", "fine-tuning", "lora", "ai-stack", "peft"]
relationships:
  - target: "概念/lora-peft"
    type: related_to
  - target: "概念/modelscope"
    type: related_to
  - target: "概念/torchrun"
    type: related_to
sources:
  - 12_架构基建/AI_Stack_Deep_Dive.md
summary: "SWIFT (Scalable lightWeight Infrastructure for Fine-Tuning) 是 ModelScope 开源的微调框架，支持 100+ 模型的 LoRA/全参微调，是 AI Stack 训练工具链的推荐选择。"
provenance:
  extracted: 0.30
  inferred: 0.60
  ambiguous: 0.10
base_confidence: 0.80
lifecycle: reviewed
created: 2026-06-12
updated: 2026-07-21
tier: supporting
name_zh: "SWIFT 微调框架"
---

# SWIFT 微调框架

> 中文简称：SWIFT 微调框架

> **一句话理解**: SWIFT 是 ModelScope 的"一键微调工具箱"——支持 Qwen/LLaMA/ChatGLM 等 100+ 模型的 LoRA/全参微调，比 transformers Trainer 更简洁。

---

## 1. 定位

| 维度 | 信息 |
|------|------|
| **全名** | Scalable lightWeight Infrastructure for Fine-Tuning |
| **来源** | ModelScope (魔搭社区) |
| **功能** | LLM 微调（LoRA/QLoRA/全参/DPO/RLHF） |
| **模型支持** | 100+ 模型 |
| **GitHub** | github.com/modelscope/ms-swift |

---

## 2. 核心能力

| 能力 | 说明 |
|------|------|
| **LoRA/QLoRA** | 参数高效微调，显存节省 80% |
| **全参微调** | 完整模型微调 |
| **DPO/RLHF** | 人类偏好对齐 |
| **多模态微调** | 视觉-语言模型微调 |
| **多机多卡** | 分布式微调（DDP/DeepSpeed） |
| **自动量化** | 训练后自动 GPTQ/AWQ 量化 |

---

## 3. 快速使用

```bash
# 安装
pip install ms-swift

# LoRA 微调 Qwen3
swift sft \
  --model Qwen/Qwen3-8B \
  --dataset alpaca-zh \
  --lora_rank 8 \
  --output_dir output

# 推理验证
swift infer \
  --model output/checkpoint-xxx \
  --dataset alpaca-zh
```

---

## 4. AI Stack 训练工具链对比

| 工具 | 定位 | 适用场景 |
|------|------|----------|
| **SWIFT** | 微调框架 ← 本文 | LoRA/全参/DPO 微调 |
| **torchrun** | 分布式启动器 | PyTorch 原生分布式 |
| **accelerate** | 分布式抽象层 | 多卡/多机训练 |
| **DeepSpeed** | 分布式引擎 | ZeRO 优化大规模训练 |
| **Megatron-LM** | 预训练框架 | 百亿级模型预训练 |

---

## 5. 与其他微调框架对比

| 维度 | SWIFT | LLaMA-Factory | transformers | Axolotl |
|------|-------|-------------|-------------|---------|
| **来源** | ModelScope | 社区 | HuggingFace | 社区 |
| **模型支持** | 100+ | 100+ | 通用 | 50+ |
| **界面** | CLI + Web UI | Web UI | Python API | CLI |
| **DPO/RLHF** | ✅ | ✅ | 需手写 | ✅ |
| **中文优化** | ✅ 优秀 | ✅ 优秀 | 一般 | 一般 |
| **中文文档** | ✅ 完整 | ✅ 完整 | 英文 | 英文 |

---

## Related

- [[概念/lora-peft]] — LoRA/PEFT 参数高效微调
- [[概念/modelscope]] — ModelScope 魔搭社区
- [[概念/torchrun]] — torchrun 分布式启动器
- [[概念/accelerate]] — HF Accelerate 分布式训练
- [[12_架构基建/AI_Stack_Deep_Dive]] — AI Stack 深度解析

---

## 2026 SWIFT 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **SWIFT** | ModelScope 微调框架 | GA |
| **LoRA/QLoRA** | 参数高效微调 | GA |
| **多模型支持** | 支持多种模型 | GA |
| **分布式训练** | 分布式微调 | GA |
| **Web UI** | 可视化微调 | GA |

## 生产最佳实践

1. **ModelScope 微调**：ModelScope 模型用 SWIFT 微调
2. **LoRA 微调**：大模型微调用 LoRA
3. **分布式训练**：大模型用分布式训练
4. **Web UI**：快速实验用 Web UI
5. **与 LLaMA-Factory 对比**：根据需求选择微调框架

## 微调命令示例

```bash
# SWIFT LoRA 微调
swift sft \
  --model Qwen/Qwen2.5-7B-Instruct \
  --dataset my_dataset.jsonl \
  --train_type lora \
  --lora_rank 64 \
  --num_train_epochs 3 \
  --per_device_train_batch_size 4 \
  --gradient_accumulation_steps 4 \
  --learning_rate 1e-4 \
  --output_dir ./output
```

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 显存不足 | 模型太大 | QLoRA + 4bit |
| 训练慢 | 未用分布式 | 多卡/DeepSpeed |
| 效果差 | 数据质量低 | 清洗数据、调整参数 |
| 与 HF 不兼容 | 版本问题 | 检查依赖版本 |

## 版本兼容性

| 工具 | 版本 | 说明 |
|------|------|------|
| SWIFT | 3.x | 微调框架 |
| ModelScope | 1.16+ | 模型库 |
| transformers | 4.40+ | 模型加载 |
| PEFT | 0.10+ | LoRA 支持 |

## 生产检查清单

1. 选择与模型匹配的微调方法
2. 数据质量检查后再训练
3. 监控训练 loss 和验证指标
4. 保存多个检查点便于回滚
5. 微调后在目标场景评测
6. 记录超参数便于复现

## 版本兼容性

| 组件 | 版本 | 特性 | 备注 |
|------|------|------|------|
| **ms-swift** | ≥ 3.0 | 200+ 模型支持 | ModelScope 官方 |
| **transformers** | ≥ 4.40 | 基座依赖 | 模型加载 |
| **PEFT** | ≥ 0.10 | LoRA/QLoRA | 参数高效微调 |
| **DeepSpeed** | ≥ 0.14 | 分布式训练 | ZeRO 优化 |
| **vLLM** | ≥ 0.4 | 推理部署 | 训练后导出 |

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|------|
| 模型不支持 | 版本过旧 | 升级 ms-swift 到最新版 |
| OOM | batch size 过大 | 减小 batch + 启用 gradient_checkpointing |
| 数据格式错误 | 不符合模板 | 使用 SWIFT 内置数据集格式 |
| 导出失败 | 依赖缺失 | 安装 onnxruntime/auto-gptq |

## 总结

SWIFT 是 ModelScope 官方微调框架，支持 200+ 模型的 LoRA/QLoRA/全量微调。对于使用 ModelScope 生态的团队，SWIFT 是最便捷的微调选择。

> 💡 SWIFT 的核心价值：一条命令完成微调——从数据加载到训练到导出，SWIFT 封装了所有复杂细节。

## 相关概念

- [[概念/Training/lora-peft|lora]] — LoRA 微调
- [[概念/modelscope]] — ModelScope 平台
- [[概念/Training/llama-factory|llamafactory]] — LLaMA-Factory 微调框架

