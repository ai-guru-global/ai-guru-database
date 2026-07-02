---
title: "Giskard (AI 模型测试与评估平台)"
category: -concepts
tags: ["testing", "evaluation", "llm", "ml-testing", "bias", "robustness", "quality"]
relationships:
  - target: "_concepts/deepeval"
    type: related_to
  - target: "_concepts/ragas"
    type: related_to
  - target: "_concepts/lm-eval-harness"
    type: related_to
sources:
  - 12_Architecture_Infrastructure/AI_Stack_Deep_Dive.md
summary: "开源的 AI 模型测试与评估平台，提供自动化漏洞扫描（偏见、幻觉、注入等）和 LLM-as-a-Judge 评估，覆盖 ML 模型到 LLM 应用的全链路质量保障。"
provenance:
  extracted: 0.55
  inferred: 0.35
  ambiguous: 0.10
base_confidence: 0.80
lifecycle: stable
tier: supporting
---

# Giskard

[Giskard](https://github.com/Giskard-AI/giskard) 是一个开源的 **AI 模型测试与评估平台**，专注于为 ML 模型和 LLM 应用提供系统化的质量保障。它的核心特色是**自动化漏洞扫描**——像安全扫描器检测代码漏洞一样，自动检测 AI 模型中的偏见、幻觉、注入漏洞、鲁棒性问题等。同时提供 **LLM-as-a-Judge** 评估模式，用大模型来评判大模型的输出质量。

## 核心架构

```
Giskard 测试架构:

模型 + 数据集
    │
    ▼
┌─────────────────────┐
│   Giskard Scanner    │
│  ┌───────────────┐  │
│  │ Vulnerability  │  │  自动漏洞扫描
│  │ Scanner        │  │
│  ├───────────────┤  │
│  │ LLM-as-Judge   │  │  大模型评判
│  │ Evaluation     │  │
│  ├───────────────┤  │
│  │ Custom Tests   │  │  自定义测试
│  │ (Python)       │  │
│  └───────────────┘  │
└──────────┬──────────┘
           │
           ▼
     Scan Report
  (问题列表 + 严重程度 + 修复建议)
```

## 核心特性

### 1. 自动化漏洞扫描

Giskard 自动检测以下类型的 AI 漏洞：

| 漏洞类型 | 说明 | 检测方法 |
|----------|------|----------|
| **Hallucination** | 幻觉/事实不一致 | NLI + LLM Judge |
| **Prompt Injection** | Prompt 注入漏洞 | 对抗样本生成 |
| **Stereotypes** | 刻板印象/偏见 | 公平性测试 |
| **Robustness** | 鲁棒性不足 | 扰动/对抗攻击 |
| **Performance** | 性能退化 | 数据切片分析 |
| **Overconfidence** | 过度自信 | 置信度校准 |
| **Underconfidence** | 过度保守 | 置信度校准 |
| **Data Leakage** | 数据泄露 | 特征重要性 |
| **Ethical Bias** | 伦理偏见 | 公平性扫描 |
| **Stochasticity** | 随机性过大 | 多次采样对比 |

### 2. 扫描使用

```python
import giskard as gsk
from giskard.llamaindex import LlamaIndexModel

# 包装模型
class MyModel(gsk.Model):
    model_type = "text_generation"
    
    def model_predict(self, df):
        return [self.model.generate(text) for text in df["input"]]

model = MyModel(model=my_llm)

# 包装数据集
dataset = gsk.Dataset(
    df=test_data,
    target="expected_output",
    name="test_dataset"
)

# 自动扫描
results = gsk.scan(model, dataset)

# 查看扫描结果
print(results)
# → 发现 3 个 Hallucination 漏洞
# → 发现 2 个 Prompt Injection 风险
# → 发现 1 个 Stereotype 问题
```

### 3. LLM-as-a-Judge

```python
from giskard import llm_as_judge

# 使用 GPT-4 作为 Judge 评估 RAG 系统
evaluation = llm_as_judge(
    model=rag_model,
    dataset=test_dataset,
    evaluation_criteria={
        "correctness": "Is the answer factually correct?",
        "relevance": "Is the answer relevant to the question?",
        "completeness": "Does the answer cover all aspects?",
    }
)
```

### 4. RAG 评估 (RAGET)

```python
from giskard import raget

# RAG Evaluation Toolkit
raget_results = raget.evaluate(
    model=rag_pipeline,
    dataset=rag_test_set,
    metrics=["correctness", "context_precision", "context_recall"]
)

# 自动:
# 1. 生成测试问题
# 2. 检索相关文档
# 3. 生成答案
# 4. 使用 LLM Judge 评分
# 5. 生成评估报告
```

### 5. 自定义测试

```python
# 自定义测试用例
@gsk.test(name="no_profanity", tags=["safety"])
def test_no_profanity(model, dataset):
    """确保模型输出不含脏话"""
    predictions = model.predict(dataset)
    profanity_count = sum(
        1 for p in predictions if contains_profanity(p)
    )
    return profanity_count == 0

# 运行测试
results = gsk.testing.test_model(model, dataset)
```

## 与 deepeval/ragas 对比

| 维度 | Giskard | deepeval | ragas |
|------|---------|----------|-------|
| **定位** | 全链路 AI 测试 | LLM 应用评估 | RAG 评估 |
| **扫描模式** | ✅ (自动化) | ❌ | ❌ |
| **漏洞类型** | 10+ 种 | 自定义 | RAG 专属 |
| **LLM Judge** | ✅ | ✅ | ✅ |
| **传统 ML** | ✅ | ❌ | ❌ |
| **RAG 评估** | ✅ (RAGET) | ✅ | ✅ (核心) |
| **CI 集成** | ✅ | ✅ | ✅ |
| **可视化报告** | ✅ (丰富) | 基础 | 基础 |

## 典型应用场景

- **LLM 应用测试**: 自动化检测幻觉、注入、偏见等漏洞
- **RAG 质量保障**: 评估检索和生成的端到端质量
- **模型发布前检查**: CI/CD 中的自动化质量门禁
- **公平性审计**: 检测模型在不同人群上的偏见
- **鲁棒性测试**: 验证模型对输入扰动的抵抗能力

## 与 AI Stack 的集成

在 AI Stack 中，Giskard 的集成点：

1. **CI/CD Pipeline** — 在模型部署前自动运行扫描
2. **MLflow/W&B** — 将测试结果记录到实验追踪系统
3. **LangChain/LlamaIndex** — 评估 RAG Pipeline 质量
4. **vLLM/SGLang** — 评估推理模型质量
5. **监控系统** — 持续扫描生产环境的模型表现

## 安装

```bash
pip install giskard[llm]

# 完整安装（含所有依赖）
pip install "giskard[llm,llama-index,langchain]"
```

## K8s CI 集成

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: model-scan
spec:
  template:
    spec:
      containers:
      - name: giskard
        image: giskard:latest
        command: ["python", "scan_model.py"]
        env:
        - name: OPENAI_API_KEY
          valueFrom:
            secretKeyRef:
              name: openai-secret
              key: api-key
        resources:
          requests:
            memory: "4Gi"
      restartPolicy: Never
```

## 参考资源

- [Giskard GitHub](https://github.com/Giskard-AI/giskard)
- [Giskard 文档](https://docs.giskard.ai/)
- [Giskard Hub](https://app.giskard.ai/)
- [RAGET 文档](https://docs.giskard.ai/en/latest/getting_started/quickstart.html#rag-evaluation)

## 相关概念

- [[_concepts/deepeval]] — DeepEval LLM 评估框架
- [[_concepts/ragas]] — Ragas RAG 评估框架
- [[_concepts/lm-eval-harness]] — LM Evaluation Harness 标准化评估
- [[_concepts/promptfoo]] — Promptfoo Prompt 测试框架
