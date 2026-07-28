---
title: "LLaMA-Factory: 一站式微调框架深度解析"
category: "05-nlp-llms-fine-tuning-techniques"
tags: ["nlp", "llm", "fine-tuning", "llama-factory", "lora", "qlora", "sft", "dpo", "webui"]
summary: "> **一句话理解**: LLaMA-Factory 是把 SFT/RLHF/DPO 全链路微调做成'填表即训'的一站式框架——100+ 模型、零代码 WebUI、统一 stage 分发架构，社区最流行的微调入口。"
created: "2026-07-25"
updated: "2026-07-25"
tier: core
aliases:
  - "Llama Factory Deep Dive"
  - "LLaMA-Factory 深度解析"
  - LLaMA_Factory_Deep_Dive
sources: []

name_zh: "LLaMA-Factory: 一站式微调框架深度解析"
---
# LLaMA-Factory: 一站式微调框架深度解析

> 中文简称：LLaMA-Factory: 一站式微调框架深度解析

> **一句话理解**: LLaMA-Factory 是把 SFT/RLHF/DPO 全链路微调做成"填表即训"的一站式框架——100+ 模型、零代码 WebUI、统一 stage 分发架构，社区最流行的微调入口。

---

## 目录

1. [概述](#1-概述)
2. [核心概念](#2-核心概念)
3. [快速开始](#3-快速开始)
4. [源码级实现解析（基于 v0.9.5）](#4-源码级实现解析基于-v095)
5. [对比与选择](#5-对比与选择)

---

## 1. 概述

### 1.1 定位

```
LLaMA-Factory: 一站式 LLM 微调框架
═══════════════════════════════════════════════════════════════════

定位: 覆盖 预训练/SFT/RM/PPO/DPO/KTO 全阶段的统一微调平台

核心理念:
───────────────────────────────────────────────────────────────────
• 全阶段: pt → sft → rm → ppo/dpo/kto 一个框架走完
• 零代码: YAML 配置 + WebUI（LLaMA Board）即可训练
• 全方法: Full/Freeze/LoRA/QLoRA/DoRA/PiSSA
• 全模型: Llama/Qwen/Gemma/DeepSeek 等 100+ 模型模板
• 全后端: HF/vLLM/SGLang 推理，DeepSpeed/FSDP 分布式训练
```

### 1.2 核心特性

| 特性 | 说明 |
|------|------|
| **训练阶段** | pt / sft / rm / ppo / dpo / kto 统一 `stage` 参数切换 |
| **微调方法** | full / freeze / lora（含 QLoRA、DoRA、PiSSA） |
| **对话模板** | 100+ 模型的 chat template 注册表 |
| **WebUI** | LLaMA Board 零代码训练与评估 |
| **推理后端** | HuggingFace / vLLM / SGLang 可切换 |
| **导出** | LoRA merge、GPTQ/AWQ 量化导出、Ollama modelfile |

---

## 2. 核心概念

- **stage（训练阶段）**：一个参数决定走哪条流水线，所有阶段共享模型加载、数据模板、adapter 注入等基础设施。
- **template（对话模板）**：把原始 instruction 数据渲染成各模型专属 chat 格式，是数据正确性的第一道关卡。
- **adapter 注入**：LoRA 相关逻辑全部委托给 HuggingFace [[概念/Training/peft|PEFT]] 库，LLaMA-Factory 只做编排。

---

## 3. 快速开始

```bash
# 🟢 低风险 | 安装
pip install llamafactory[torch,metrics]

# 🟢 低风险 | LoRA SFT（YAML 配置驱动）
llamafactory-cli train examples/train_lora/llama3_lora_sft.yaml

# 🟢 低风险 | 零代码 WebUI
llamafactory-cli webui

# 🟢 低风险 | 训练后交互测试
llamafactory-cli chat examples/inference/llama3_lora_sft.yaml

# 🔶 中风险 | 合并 LoRA 并导出（覆盖输出目录需确认）
llamafactory-cli export examples/merge_lora/llama3_lora_sft.yaml
```

典型 SFT YAML 关键字段：

```yaml
stage: sft            # pt/sft/rm/ppo/dpo/kto
finetuning_type: lora # full/freeze/lora
template: llama3      # 对话模板名
dataset: identity,alpaca_en_demo
quantization_bit: 4   # 加上即 QLoRA
```

---

## 4. 源码级实现解析（基于 v0.9.5）

> 本节基于本仓库归档源码 `code/llm-frameworks/LLaMA-Factory-v0.9.5/` 的实际实现，所有行号可直接对照验证。

### 4.1 架构设计：CLI → stage 分发 → workflow

| 层次 | 关键类/函数 | 证据文件（`src/llamafactory/`） | 职责 |
|------|------------|-------------------------------|------|
| CLI 入口 | `main()`（L16） | `cli.py` | `llamafactory-cli train/chat/export/webui` 子命令分发 |
| 参数体系 | `hparams/` 五件套 | `model_args.py`、`data_args.py`、`training_args.py`、`finetuning_args.py`、`generating_args.py` | dataclass 定义全部配置，`parser.py` 统一解析 YAML/CLI |
| 训练编排 | `run_exp()`（L139）→ `_training_function()`（L68） | `train/tuner.py` | 按 `stage` 分发到 pt/sft/rm/ppo/dpo/kto 对应 workflow |
| 阶段流水线 | `run_sft()`（L41）等 | `train/sft/workflow.py`（dpo/kto/ppo/rm/pt 同构） | 每阶段一个 `workflow.py + trainer.py`，结构完全对称 |
| 模型装配 | `load_model()`（L131） | `model/loader.py` | 加载基座 → patch → 注入 adapter 的总装线 |

**设计模式要点**：每个训练阶段目录（`train/sft/`、`train/dpo/`、`train/kto/`、`train/ppo/`、`train/rm/`、`train/pt/`）都是"workflow（编排）+ trainer（继承 HF Trainer 重写 loss）"的对称结构——新增一个对齐方法只需复制该结构，这是它能快速跟进 KTO/ORPO 等新方法的架构原因。

### 4.2 关键技术实现

| 机制 | 证据 | 说明 |
|------|------|------|
| adapter 注入 | `init_adapter()`（`model/adapter.py` L293） | 按 `finetuning_type` 走 full/freeze/lora 分支，LoRA 分支内部调用 peft `get_peft_model`——与 [[05_大模型/07_Fine_tuning_Techniques/PEFT_2026|PEFT]] 的接头处 |
| 模型补丁 | `patch_config()`（L314）/`patch_model()`（L382）（`model/patcher.py`） | 统一处理 rope scaling、attention 实现、量化配置、梯度检查点等模型侧适配 |
| 对话模板 | `Template`（`data/template.py` L41）、`get_template_and_fix_tokenizer()`（L628） | 模板注册表渲染 chat 格式并修正 tokenizer 特殊 token，100+ 模型适配的核心 |
| 推理引擎抽象 | `BaseEngine`（`chat/base_engine.py` L39）；`HuggingfaceEngine`（hf_engine.py L44）、`VllmEngine`（vllm_engine.py L46）、`SGLangEngine`（sglang_engine.py L46） | 训练完直接用 vLLM/SGLang 高速推理评估，`ChatModel`（chat_model.py L39）统一门面 |

### 4.3 性能优化机制（源码印证）

- **QLoRA 路径**：`quantization_bit: 4` 经 `model/loader.py` 装配 bnb 量化配置，adapter 侧由 peft 的 `Linear4bit`（`peft/tuners/lora/bnb.py` L311）承接。
- **分布式与混合精度**：`train/fp8_utils.py` 提供 FP8 训练工具；`train/hyper_parallel/` 提供序列并行等扩展；DeepSpeed/FSDP 通过 HF Trainer 集成。
- **PPO 特化**：`train/ppo/` 基于 TRL 实现 actor/critic 训练环，与 rm 阶段产物衔接。

### 4.4 配置与部署要点（源码印证）

- 全部行为由 `hparams/` 的 dataclass 字段驱动，YAML 即 API——排查参数含义直接读 `finetuning_args.py` 的字段注释即可。
- `launcher.py` 处理 torchrun 多卡启动；`webui/` 目录是 Gradio 版 LLaMA Board，与 CLI 共用同一套 `run_exp` 入口，保证 WebUI 与命令行行为一致。
- `api/` 目录提供 OpenAI 风格 API server，训练→评估→服务可全程不出框架。

> 源码阅读入口建议：`cli.py main` → `train/tuner.py run_exp` → `train/sft/workflow.py run_sft` → `model/loader.py load_model` → `model/adapter.py init_adapter`，五步看清"填表即训"背后的完整装配线。

---

## 5. 对比与选择

| 维度 | LLaMA-Factory | Axolotl | Unsloth |
|------|---------------|---------|---------|
| 定位 | 全阶段一站式 + WebUI | YAML 驱动微调 | 单卡极致提速 |
| 对齐方法 | PPO/DPO/KTO 内置 | DPO/ORPO | 主要 SFT/DPO |
| 上手门槛 | 最低（零代码 WebUI） | 低 | 低 |
| 性能优化 | 常规（依赖 HF 生态） | 常规 | 2-5x 加速（手写 kernel） |
| 适用 | 快速实验/教学/全流程 | 生产配置化训练 | 消费级显卡提速 |

**选型建议**：要 WebUI 和全阶段（含 PPO/KTO）→ LLaMA-Factory；追求单卡速度 → [[05_大模型/07_Fine_tuning_Techniques/Unsloth_Deep_Dive|Unsloth]]；偏好纯 YAML 生产流程 → [[05_大模型/07_Fine_tuning_Techniques/Axolotl_Deep_Dive|Axolotl]]。

---

*Last updated: 2026-07-25*（基于 LLaMA-Factory v0.9.5 归档源码）

## 相关链接

- [[05_大模型/07_Fine_tuning_Techniques/PEFT_2026|PEFT 2026 完全指南]] — adapter 注入机制的底层库
- [[05_大模型/07_Fine_tuning_Techniques/LoRA_QLoRA_SFT_RLHF_DPO_in_Detail|LoRA/QLoRA/SFT/RLHF/DPO 详解]] — 核心概念大白话
- [[05_大模型/07_Fine_tuning_Techniques/Axolotl_Deep_Dive|Axolotl 深度解析]] — 同类微调框架
- [[05_大模型/07_Fine_tuning_Techniques/Unsloth_Deep_Dive|Unsloth 深度解析]] — 高速微调框架
- [[07_模型训练/06_Alignment/TRL_RLHF_DPO_Guide|TRL 实战指南]] — PPO/DPO 底层实现
- [[概念/Training/peft|PEFT]] — 参数高效微调概念卡片
- [[概念/Training/sft|SFT]] — 监督微调概念卡片
