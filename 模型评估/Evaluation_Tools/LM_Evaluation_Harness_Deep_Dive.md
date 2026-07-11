---
title: "LM Evaluation Harness 深度解析: EleutherAI 的 LLM 评测框架"
category: "08-model-evaluation"
tags: ["lm-evaluation-harness", "eleutherai", "evaluation", "benchmark", "llm", "few-shot", "perplexity", "mmlu", "gsm8k"]
summary: "> **一句话理解**: LM Evaluation Harness 是 EleutherAI 开源的 LLM 评测框架，用统一接口在数百个学术基准上评估模型，是科研和工业界复现、对比模型能力的事实标准工具。"
created: "2026-06-16"
updated: "2026-06-16"
tier: supporting
aliases:
  - "Lm Evaluation Harness Deep Dive"
  - "LM Evaluation Harness Deep Dive"
  - LM_Evaluation_Harness_Deep_Dive
sources: []

---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](../../治理/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->
# LM Evaluation Harness 深度解析：EleutherAI 的 LLM 评测框架

> **一句话理解**: LM Evaluation Harness 是 EleutherAI 开源的 LLM 评测框架，用统一接口在数百个学术基准上评估模型，是科研和工业界复现、对比模型能力的事实标准工具。

> **官方站点**: https://github.com/EleutherAI/lm-evaluation-harness

---

## 目录

1. [项目背景与定位](#1-项目背景与定位)
2. [核心设计思想](#2-核心设计思想)
3. [支持的模型与后端](#3-支持的模型与后端)
4. [支持的基准任务](#4-支持的基准任务)
5. [安装与快速开始](#5-安装与快速开始)
6. [Few-shot 与 Prompt 配置](#6-few-shot-与-prompt-配置)
7. [自定义任务](#7-自定义任务)
8. [与 vLLM / LMDeploy 的集成](#8-与-vllm--lmdeploy-的集成)
9. [结果解读与报告](#9-结果解读与报告)
10. [生产最佳实践](#10-生产最佳实践)
11. [常见问题与排查](#11-常见问题与排查)
12. [官方资源](#12-官方资源)

---

## 1. 项目背景与定位

### 1.1 发展历程

- **2021 年**：EleutherAI 发布 lm-evaluation-harness，目标是为 GPT-NeoX 等模型提供可复现的学术基准评估。
- **2023 年**：支持 HuggingFace Transformers 和大量基准，成为社区主流工具。
- **2024-2026 年**：增加对 vLLM、API 模型、多模态任务的扩展支持。

### 1.2 项目定位

| 维度 | 定位 |
|------|------|
| **维护方** | EleutherAI |
| **核心目标** | 统一、可复现地评估 LLM 在学术基准上的表现 |
| **许可证** | MIT |
| **适用场景** | 基础研究、模型对比、论文复现、量化评估 |

---

## 2. 核心设计思想

### 2.1 统一接口

无论模型是 HuggingFace、vLLM 还是 API，都用同一套命令行/代码接口评估。

### 2.2 任务即配置

每个基准是一个 YAML 配置文件，定义数据集、Prompt 模板、 few-shot 示例、指标。

### 2.3 可复现性

固定随机种子、明确 few-shot 采样、记录模型版本和配置。

---

## 3. 支持的模型与后端

| 后端 | 说明 |
|------|------|
| **HuggingFace** | 本地加载 Transformers 模型 |
| **vLLM** | 高性能推理后端 |
| **OpenAI API** | GPT-4/3.5 等商业模型 |
| **Anthropic API** | Claude 系列 |
| **LLaMA / Mistral / Qwen** | 主流开源模型 |
| **Mamba / RWKV** | 非 Transformer 架构 |

---

## 4. 支持的基准任务

### 4.1 常见学术基准

| 基准 | 评估能力 |
|------|---------|
| **MMLU** | 多学科知识 |
| **HellaSwag** | 常识推理 |
| **ARC** | 科学推理 |
| **Winogrande** | 代词消歧 |
| **TruthfulQA** | 真实性 |
| **GSM8K** | 数学推理 |
| **HumanEval** | 代码生成 |
| **BBH** | 复杂指令遵循 |

### 4.2 任务类型

- **生成任务**：模型生成答案，用精确匹配/F1/ROUGE 评估。
- **多选任务**：从选项中选择正确答案。
- **困惑度任务**：计算 token 级 perplexity。
- **逻辑推理任务**：如 LogiQA、ReClor。

---

## 5. 安装与快速开始

### 5.1 安装

```bash
pip install lm-eval
```

### 5.2 基本用法

```bash
lm_eval \
  --model hf \
  --model_args pretrained=meta-llama/Llama-2-7b-hf \
  --tasks mmlu,hellaswag,arc_easy \
  --device cuda:0 \
  --batch_size 8 \
  --output_path ./results
```

### 5.3 使用 vLLM 加速

```bash
lm_eval \
  --model vllm \
  --model_args pretrained=meta-llama/Llama-2-7b-hf,tensor_parallel_size=1 \
  --tasks mmlu \
  --batch_size auto \
  --output_path ./results
```

---

## 6. Few-shot 与 Prompt 配置

### 6.1 Few-shot 数量

```bash
lm_eval --tasks mmlu --num_fewshot 5
```

### 6.2 自定义 Prompt 模板

任务 YAML 中定义：

```yaml
dataset_path: cais/mmlu
process_docs: !function utils.process_docs
doc_to_text: "{{question.strip()}}\nA. {{choices[0]}}\nB. {{choices[1]}}\nC. {{choices[2]}}\nD. {{choices[3]}}\nAnswer:"
doc_to_target: "{{['A', 'B', 'C', 'D'][answer]}}"
metric_list:
  - metric: acc
    aggregation: mean
    higher_is_better: true
```

---

## 7. 自定义任务

### 7.1 创建任务目录

```
lm_eval/tasks/my_task/
  ├── my_task.yaml
  └── utils.py
```

### 7.2 注册任务

```yaml
task: my_task
dataset_path: path/to/dataset
doc_to_text: "Question: {{question}}\nAnswer:"
doc_to_target: "{{answer}}"
metric_list:
  - metric: exact_match
    aggregation: mean
    higher_is_better: true
```

---

## 8. 与 vLLM / LMDeploy 的集成

### 8.1 vLLM

Harness 内置 `vllm` 后端，可直接调用：

```bash
lm_eval --model vllm --model_args pretrained=Qwen/Qwen2-7B-Instruct
```

### 8.2 LMDeploy

通过自定义模型类或 API 后端集成：

```bash
lm_eval --model local-completions \
  --model_args model=Qwen/Qwen2-7B-Instruct,base_url=http://localhost:23333/v1/completions,num_concurrent=1
```

---

## 9. 结果解读与报告

### 9.1 输出示例

```json
{
  "results": {
    "mmlu": {
      "acc": 0.456,
      "acc_stderr": 0.004
    }
  },
  "config": { ... }
}
```

### 9.2 关键指标

- **acc**：准确率
- **acc_stderr**：标准误
- **perplexity**：困惑度
- **exact_match**：精确匹配

---

## 10. 生产最佳实践

### 10.1 评估前准备

- 固定随机种子。
- 确认模型 tokenizer 与 checkpoint 匹配。
- 对量化模型注意 few-shot 示例长度。

### 10.2 资源规划

| 模型规模 | 推荐 GPU | 批大小 |
|----------|---------|--------|
| 7B | 1x A100 40GB | 8-16 |
| 13B | 1x A100 80GB | 4-8 |
| 70B | 4x A100 80GB (TP) | 1-2 |

### 10.3 避免常见陷阱

- 不同 few-shot 数结果不可直接对比。
- 注意任务版本差异（如 MMLU-pro vs MMLU）。
- 生成任务要确认 decoding 参数一致。

---

## 11. 常见问题与排查

### Q1: 安装后找不到 `lm_eval` 命令

**A**: 确保安装在激活的虚拟环境中，或检查 `PATH`。

### Q2: 运行时报 `CUDA out of memory`

**A**: 减小 `--batch_size`，使用 `--device cpu`，或启用量化。

### Q3: 结果与论文不一致

**A**: 检查模型版本、tokenizer、few-shot 数、decoding 参数是否一致。

### Q4: 如何评估自定义数据集？

**A**: 创建任务 YAML 并放到 `lm_eval/tasks/` 目录，使用 `--tasks my_task`。

### Q5: API 模型（GPT-4）怎么评估？

**A**: 使用 `--model openai-completions` 或 `--model local-completions` 配合 API base_url。

### Q6: 多 GPU 并行怎么配置？

**A**: 使用 vLLM 后端并设置 `tensor_parallel_size=N`。

### Q7: 评估速度太慢

**A**: 使用 vLLM/LMDeploy 后端、增大 batch size、只跑关键任务。

### Q8: 如何生成可读的表格报告？

**A**: 使用 `--log_samples` 和 `--output_path`，然后用脚本转换或查看 `results.json`。

---

## 12. 官方资源

- **GitHub**: https://github.com/EleutherAI/lm-evaluation-harness
- **文档**: https://github.com/EleutherAI/lm-evaluation-harness/blob/main/docs/
- **任务列表**: https://github.com/EleutherAI/lm-evaluation-harness/tree/main/lm_eval/tasks

---

## Related

- [[概念/lm-evaluation-harness]] — LM Evaluation Harness 概念卡片
- [[概念/opencompass]] — OpenCompass
- [[概念/model-evaluation]] — 模型评估
- [[模型评估/Evaluation_Tools/OpenCompass_Deep_Dive]] — OpenCompass 深度解析
- [[模型评估/Benchmarks/LLM_Benchmark_Suite_2026]] — LLM 基准套件 2026
