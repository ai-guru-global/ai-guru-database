---
title: "OpenCompass 深度解析: 一站式大模型评测平台"
category: "08-model-evaluation"
tags: ["opencompass", "evaluation", "benchmark", "llm", "chinese-llm", "mmbench", "multimodal", "compassrank", "c-eval", "cmmlu"]
summary: "> **一句话理解**: OpenCompass 是上海人工智能实验室开源的一站式大模型评测平台，支持学科、知识、推理、多语言、多模态等丰富基准，是国内大模型能力评估和社区打榜的核心工具。"
created: "2026-06-16"
updated: "2026-06-16"
tier: supporting
aliases:
  - "Opencompass Deep Dive"
  - "OpenCompass Deep Dive"
  - OpenCompass_Deep_Dive

---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](../../_meta/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->
# OpenCompass 深度解析：一站式大模型评测平台

> **一句话理解**: OpenCompass 是上海人工智能实验室开源的一站式大模型评测平台，支持学科、知识、推理、多语言、多模态等丰富基准，是国内大模型能力评估和社区打榜的核心工具。

> **官方站点**: https://github.com/open-compass/opencompass

---

## 目录

1. [项目背景与定位](#1-项目背景与定位)
2. [核心设计思想](#2-核心设计思想)
3. [评测维度与基准](#3-评测维度与基准)
4. [支持的模型与后端](#4-支持的模型与后端)
5. [安装与快速开始](#5-安装与快速开始)
6. [配置评测任务](#6-配置评测任务)
7. [多模态评测](#7-多模态评测)
8. [与 vLLM / LMDeploy / API 的集成](#8-与-vllm--lmdeploy--api-的集成)
9. [结果解读与 CompassRank](#9-结果解读与-compassrank)
10. [生产最佳实践](#10-生产最佳实践)
11. [常见问题与排查](#11-常见问题与排查)
12. [官方资源](#12-官方资源)

---

## 1. 项目背景与定位

### 1.1 发展历程

- **2023 年**：上海人工智能实验室发布 OpenCompass，目标是构建全面、公正、可复现的中文大模型评测体系。
- **2024 年**：扩展多模态评测能力（MMBench、MME 等），形成 CompassKit 工具链。
- **2025-2026 年**：持续增加 Agent、长文本、代码等评测维度，成为国内模型榜单核心基础设施。

### 1.2 项目定位

| 维度 | 定位 |
|------|------|
| **维护方** | 上海人工智能实验室 |
| **核心目标** | 一站式、多维度的中文大模型评测 |
| **许可证** | Apache 2.0 |
| **适用场景** | 中文模型评估、多模态评测、社区榜单、企业选型 |

---

## 2. 核心设计思想

### 2.1 一站式平台

从数据加载、模型推理、指标计算到报告生成，全流程覆盖。

### 2.2 模块化设计

数据集、模型、评测策略、后处理均可插拔扩展。

### 2.3 中文优先

内置 C-Eval、CMMLU、Gaokao 等中文考试基准，同时支持国际主流基准。

---

## 3. 评测维度与基准

### 3.1 主要维度

| 维度 | 说明 |
|------|------|
| **学科** | C-Eval、MMLU、CMMLU、Gaokao-Bench |
| **知识** | BoolQ、NQ、TriviaQA |
| **推理** | GSM8K、MATH、BBH、TheoremQA |
| **语言** | 中英文翻译、摘要、理解 |
| **长文本** | LEval、LongBench |
| **多模态** | MMBench、MME、SEED-Bench、MM-Vet |
| **Agent** | T-Eval、AgentBench |
| **代码** | HumanEval、MBPP |

### 3.2 中文特色基准

| 基准 | 说明 |
|------|------|
| **C-Eval** | 高中/大学/职业多学科中文考试 |
| **CMMLU** | 中文多任务语言理解 |
| **Gaokao-Bench** | 中国高考题目 |
| **C3 / ChID** | 中文阅读理解、成语填空 |

---

## 4. 支持的模型与后端

| 类型 | 示例 |
|------|------|
| **HuggingFace** | Qwen、ChatGLM、InternLM、Baichuan |
| **API** | OpenAI、Claude、ERNIE、Spark、Moonshot |
| **加速后端** | vLLM、LMDeploy、TensorRT-LLM |
| **多模态** | InternVL、Qwen-VL、LLaVA |

---

## 5. 安装与快速开始

### 5.1 安装

```bash
pip install -U opencompass
```

### 5.2 基本用法

```bash
# 评测 HuggingFace 模型
opencompass \
  --models qwen2-7b-instruct \
  --datasets ceval mmlu gsm8k \
  --accelerator vllm \
  --work-dir ./outputs
```

### 5.3 评测 API 模型

```bash
opencompass \
  --models gpt-4o \
  --datasets ceval \
  --work-dir ./outputs
```

---

## 6. 配置评测任务

### 6.1 数据集配置

```python
# configs/datasets/ceval.py
from opencompass.openicl.icl_prompt_template import PromptTemplate
from opencompass.openicl.icl_retriever import FixKRetriever

ceval_reader_cfg = dict(input_columns=["question", "A", "B", "C", "D"], output_column="answer")

ceval_infer_cfg = dict(
    prompt_template=dict(
        type=PromptTemplate,
        template=dict(round=[dict(role="HUMAN", prompt="{question}\nA. {A}\nB. {B}\nC. {C}\nD. {D}\n答案：")])
    ),
    retriever=dict(type=FixKRetriever, k=5),
)
```

### 6.2 模型配置

```python
# configs/models/qwen2.py
from opencompass.models import HuggingFaceBaseModel

models = [
    dict(
        type=HuggingFaceBaseModel,
        abbr="qwen2-7b-instruct",
        path="Qwen/Qwen2-7B-Instruct",
        max_seq_len=8192,
        batch_size=8,
        run_cfg=dict(num_gpus=1, num_procs=1),
    )
]
```

---

## 7. 多模态评测

### 7.1 基本命令

```bash
opencompass \
  --models internvl2-8b \
  --datasets mmbench mme \
  --work-dir ./outputs
```

### 7.2 多模态基准

| 基准 | 评估能力 |
|------|---------|
| **MMBench** | 视觉感知与推理 |
| **MME** | 多模态理解与感知 |
| **SEED-Bench** | 图像/视频理解 |
| **MM-Vet** | 多模态综合能力 |

---

## 8. 与 vLLM / LMDeploy / API 的集成

### 8.1 vLLM

```bash
opencompass --models qwen2-7b-instruct --datasets ceval --accelerator vllm
```

### 8.2 LMDeploy

```bash
opencompass --models qwen2-7b-instruct --datasets ceval --accelerator lmdeploy
```

### 8.3 OpenAI API

在模型配置中设置 `api_base` 和 `api_key`：

```python
from opencompass.models import OpenAI

models = [dict(type=OpenAI, path="gpt-4o", key="$OPENAI_API_KEY", meta_template=...)]
```

---

## 9. 结果解读与 CompassRank

### 9.1 输出结构

```
outputs/
├── results/
│   └── summary/
│       └── summary.csv
├── logs/
└── predictions/
```

### 9.2 CompassRank

OpenCompass 官方榜单：https://rank.opencompass.org.cn

榜单维度包括：
- 综合排名
- 学科能力
- 语言能力
- 知识能力
- 推理能力
- 多模态能力

### 9.3 结果可视化

```bash
opencompass --summarize ./outputs
```

生成雷达图、柱状图、对比表格。

---

## 10. 生产最佳实践

### 10.1 评测前准备

- 明确评测目标（基础研究/选型/打榜）。
- 选择代表性基准，避免全量跑导致成本过高。
- 固定模型版本和后端。

### 10.2 成本控制

| 策略 | 效果 |
|------|------|
| 使用本地模型 | 避免 API 费用 |
| vLLM/LMDeploy 加速 | 降低推理时间 |
| 采样部分数据集 | 快速迭代 |
| 只跑关键维度 | 减少总任务数 |

### 10.3 公平对比

- 相同 few-shot 设置。
- 相同解码参数（temperature=0, top_p=1）。
- 相同 prompt 模板版本。

---

## 11. 常见问题与排查

### Q1: 安装后命令找不到

**A**: 检查是否安装在当前环境，`pip show opencompass` 查看路径。

### Q2: 数据集下载失败

**A**: 配置 HuggingFace 镜像或手动下载数据集到本地缓存。

### Q3: API 模型返回结果不一致

**A**: 设置 `temperature=0`，关闭流式输出，固定 prompt。

### Q4: 多模态评测报维度错误

**A**: 检查模型输入格式是否与基准要求一致，确认图像路径可访问。

### Q5: 如何只跑中文基准？

**A**: 在 `--datasets` 中指定 `ceval cmmlu gaokao` 等。

### Q6: 结果如何提交到 CompassRank？

**A**: 按官方要求生成预测文件，通过官网提交。

### Q7: 自定义数据集怎么做？

**A**: 参考官方文档创建数据集配置文件，注册到 OpenCompass 数据集注册表。

### Q8: 评测速度太慢

**A**: 使用 `--accelerator vllm`、增大 batch size、减少同时跑的模型数。

---

## 12. 官方资源

- **GitHub**: https://github.com/open-compass/opencompass
- **文档**: https://opencompass.readthedocs.io
- **CompassRank**: https://rank.opencompass.org.cn
- **CompassKit**: https://github.com/open-compass

---

## Related

- [[_concepts/opencompass]] — OpenCompass 概念卡片
- [[_concepts/lm-evaluation-harness]] — LM Evaluation Harness
- [[_concepts/model-evaluation]] — 模型评估
- [[模型评估/Evaluation_Tools/LM_Evaluation_Harness_Deep_Dive]] — LM Evaluation Harness 深度解析
- [[模型评估/Benchmarks/LLM_Benchmark_Suite_2026]] — LLM 基准套件 2026
