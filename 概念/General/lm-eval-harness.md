---
title: "LM Evaluation Harness (EleutherAI LLM 评估框架)"
category: -concepts
tags: ["evaluation", "benchmark", "llm", "eleutherai", "mmlu", "standardized-testing"]
relationships:
  - target: "概念/ragas"
    type: related_to
  - target: "概念/deepeval"
    type: related_to
  - target: "概念/vllm"
    type: related_to
sources:
  - 12_架构基建/AI_Stack_Deep_Dive.md
summary: "EleutherAI 开源的标准化 LLM 评估框架，支持 60+ 学术基准测试（MMLU、HellaSwag、ARC 等），是 LLM 排行榜和模型对比的事实标准工具。"
provenance:
  extracted: 0.55
  inferred: 0.35
  ambiguous: 0.10
base_confidence: 0.85
lifecycle: reviewed
tier: core
aliases:
  - "LM Evaluation Harness"
  - "Lm Evaluation Harness"
  - "lm evaluation harness"
---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](治理/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->

# LM Evaluation Harness

[lm-evaluation-harness](https://github.com/EleutherAI/lm-evaluation-harness) 是 [EleutherAI](https://www.eleuther.ai/) 开源的标准化 LLM 评估框架，提供 **60+ 学术基准测试**（MMLU、HellaSwag、ARC、TruthfulQA 等）的统一评估接口。它是 Open LLM Leaderboard、学术论文模型评估和业界模型对比的**事实标准工具**，几乎所有主流 LLM（Llama、Mistral、Qwen 等）的基准分数都由该工具产出。

## 核心特性

### 支持的基准测试

| 基准 | 类型 | 评估能力 |
|------|------|----------|
| **MMLU** | 多选题 | 57 个学科的知识理解 |
| **HellaSwag** | 常识推理 | 场景续写能力 |
| **ARC (Easy/Challenge)** | 科学推理 | K-12 科学问答 |
| **TruthfulQA** | 真实性 | 抵抗常见误导 |
| **WinoGrande** | 常识推理 | 代词消歧 |
| **GSM8K** | 数学推理 | 小学数学应用题 |
| **HumanEval** | 代码生成 | Python 编程能力 |
| **MBPP** | 代码生成 | 基础 Python 编程 |
| **BBH (BigBench Hard)** | 综合 | 23 项高难度任务 |
| **IFEval** | 指令跟随 | 指令遵循能力 |

### 支持的模型后端

| 后端 | 说明 |
|------|------|
| **HuggingFace** | Transformers 模型 |
| **vLLM** | 高性能推理引擎 |
| **SGLang** | SGLang 推理 |
| **OpenAI API** | GPT 系列 |
| **Anthropic API** | Claude 系列 |
| **GGUF/GGML** | llama.cpp 模型 |
| **ONNX** | ONNX Runtime |
| **TensorRT-LLM** | NVIDIA 推理 |
| **自定义** | 通过 API 适配 |

## 基本使用

### CLI 评估

```bash
# 安装
pip install lm-eval

# 评估 Llama-3-8B 在 MMLU 上
lm_eval \
    --model hf \
    --model_args pretrained=meta-llama/Llama-3-8B \
    --tasks mmlu \
    --device cuda:0 \
    --batch_size 8 \
    --output_path results/

# 多任务评估
lm_eval \
    --model hf \
    --model_args pretrained=meta-llama/Llama-3-8B \
    --tasks mmlu,hellaswag,arc_challenge,truthfulqa_mc2,winogrande \
    --device cuda:0 \
    --batch_size auto \
    --output_path results/

# 使用 vLLM 后端（更快）
lm_eval \
    --model vllm \
    --model_args pretrained=meta-llama/Llama-3-8B,tensor_parallel_size=4 \
    --tasks mmlu \
    --batch_size auto
```

### Python API

```python
import lm_eval
from lm_eval.models.huggingface import HFLM

# 创建模型
model = HFLM(pretrained="meta-llama/Llama-3-8B", device="cuda")

# 评估
results = lm_eval.simple_evaluate(
    model=model,
    tasks=["mmlu", "hellaswag", "arc_challenge"],
    batch_size=8,
)

# 查看结果
for task, metrics in results["results"].items():
    print(f"{task}: {metrics['acc']:.4f}")
```

### 评估 OpenAI 模型

```bash
# 评估 GPT-4
export OPENAI_API_KEY=sk-...

lm_eval \
    --model openai-completions \
    --model_args model=gpt-4 \
    --tasks mmlu \
    --batch_size 1
```

## 输出结果

```json
{
  "results": {
    "mmlu": {
      "acc,none": 0.6245,
      "acc_stderr,none": 0.0041,
      "acc_norm,none": 0.6198,
      "alias": "mmlu"
    },
    "hellaswag": {
      "acc,none": 0.7823,
      "acc_norm,none": 0.8012,
      "alias": "hellaswag"
    },
    "arc_challenge": {
      "acc,none": 0.5674,
      "acc_norm,none": 0.5891,
      "alias": "arc_challenge"
    }
  },
  "config": {
    "model": "hf",
    "model_args": "pretrained=meta-llama/Llama-3-8B"
  }
}
```

## 核心概念

### Task 定义

```yaml
# 自定义 Task (YAML)
task: my_custom_task
dataset_path: my_dataset
dataset_name: default
output_type: multiple_choice
training_split: train
validation_split: validation
test_split: test
doc_to_text: "Question: {{question}}\nAnswer:"
doc_to_target: "{{choices[answer_idx]}}"
doc_to_choice: "{{choices}}"
metric_list:
  - metric: acc
    aggregation: mean
    higher_is_better: true
```

### 评估指标

| 指标 | 说明 | 适用场景 |
|------|------|----------|
| **acc** | 精确匹配准确率 | 多选题 |
| **acc_norm** | 长度归一化准确率 | 多选题 |
| **exact_match** | 精确匹配 | 生成任务 |
| **bleu** | BLEU 分数 | 翻译/摘要 |
| **rouge** | ROUGE 分数 | 摘要 |
| **pass@k** | 通过率 | 代码生成 |
| **mc2** | 多选准确率 | TruthfulQA |

## 与 AI Stack 的集成

在 AI Stack 中，LM Evaluation Harness 的集成点：

1. **vLLM/SGLang** — 使用推理引擎作为后端，加速评估
2. **MLflow/W&B** — 记录评估结果用于模型版本对比
3. **CI/CD** — 在模型发布前自动运行基准评估
4. **Open LLM Leaderboard** — 排行榜分数的产出工具
5. **模型选型** — 对比不同模型在特定任务上的表现

## 与 deepeval/ragas 对比

| 维度 | LM Eval Harness | deepeval | ragas |
|------|----------------|----------|-------|
| **评估类型** | 学术基准 | LLM 应用质量 | RAG 质量 |
| **评估方式** | 标准答案匹配 | LLM 评判 | 多维度指标 |
| **基准数量** | 60+ | 10+ | 5+ |
| **自定义任务** | ✅ (YAML) | ✅ (Python) | 有限 |
| **排行榜** | ✅ (Open LLM) | ❌ | ❌ |
| **生产监控** | ❌ | ✅ | ✅ |

## K8s 批量评估

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: llm-evaluation
spec:
  template:
    spec:
      containers:
      - name: evaluator
        image: lm-eval:latest
        command: ["lm_eval"]
        args:
        - --model
        - vllm
        - --model_args
        - pretrained=meta-llama/Llama-3-8B,tensor_parallel_size=2
        - --tasks
        - mmlu,hellaswag,arc_challenge
        - --output_path
        - /results/
        resources:
          limits:
            nvidia.com/gpu: 2
        volumeMounts:
        - name: results
          mountPath: /results
      volumes:
      - name: results
        persistentVolumeClaim:
          claimName: eval-results-pvc
      restartPolicy: Never
```

## 参考资源

- [lm-evaluation-harness GitHub](https://github.com/EleutherAI/lm-evaluation-harness)
- [Open LLM Leaderboard](https://huggingface.co/spaces/open-llm-leaderboard/open_llm_leaderboard)
- [EleutherAI](https://www.eleuther.ai/)

## 相关概念

- [[概念/ragas]] — Ragas RAG 评估框架
- [[概念/deepeval]] — DeepEval LLM 评估框架
- [[概念/vllm]] — vLLM 高性能推理引擎
- [[概念/mlflow]] — MLflow 实验追踪
- [[概念/wandb]] — Weights & Biases 实验追踪
