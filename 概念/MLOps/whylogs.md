---
title: "whylogs (数据质量与 ML 可观测性)"
category: -concepts
tags: ["data-profiling", "ml-observability", "data-quality", "drift-detection", "why-labs"]
relationships:
  - target: "概念/mlflow"
    type: related_to
  - target: "概念/langfuse"
    type: related_to
sources:
  - 架构基建/AI_Stack_Deep_Dive.md
summary: "开源的数据质量分析和 ML 可观测性库，通过轻量级数据画像（Profiling）实现数据漂移检测、分布监控和异常告警。"
provenance:
  extracted: 0.55
  inferred: 0.35
  ambiguous: 0.10
base_confidence: 0.82
lifecycle: reviewed
tier: supporting
---

# whylogs

[whylogs](https://github.com/whylabs/whylogs) 是 [WhyLabs](https://whylabs.ai/) 开源的**数据质量分析和 ML 可观测性**库。它通过**轻量级数据画像（Data Profiling）**技术，对输入数据、模型预测和 LLM 输出进行实时分布统计，实现数据漂移检测、分布监控和异常告警。与 MLflow 侧重"实验追踪"不同，whylogs 侧重**数据层面的可观测性**。

## 核心特性

### 1. 数据画像 (Data Profiling)

```python
import whylogs as why

# 对 DataFrame 生成画像
result = why.log(dataframe)
profile = result.profile()

# 画像包含:
# - 每个特征的分布统计 (min, max, mean, std, quantiles)
# - 缺失值比例
# - 唯一值数量
# - 频率直方图
# - 基数估计

# 序列化画像（可存储/传输）
profile.write("profile.bin")
```

### 2. 数据漂移检测

```python
from whylogs.core.metrics import MetricConfig

# 对比参考画像和当前画像
reference_profile = why.log(training_data).profile()
current_profile = why.log(production_data).profile()

# 检测漂移
from whylogs.experimental.extras.embedding_metric import EmbeddingMetric

# KS 检验、PSI、K-L 散度等漂移指标
drift_result = reference_profile.view().merge(current_profile.view())
```

### 3. LLM 输出监控

```python
from whylogs.experimental.core.udf_schema import udf_schema

# 监控 LLM 输出质量
@udf_schema
def monitor_llm_output(df):
    # 毒性分数
    df["toxicity"] = df["output"].apply(toxicity_score)
    # 响应长度
    df["response_length"] = df["output"].apply(len)
    # 拒绝率
    df["is_refusal"] = df["output"].apply(is_refusal)
    return df

# 持续监控
why.log(monitor_llm_output(df))
```

### 4. 流式画像

```python
# 实时流式画像（无需存储所有数据）
writer = why.writer("whylabs")  # 写入 WhyLabs 平台

# 每批数据更新画像
for batch in data_stream:
    result = why.log(batch)
    writer.write(result.profile())
```

## 核心优势

1. **内存高效**: 画像仅占原始数据的 ~0.1% 内存
2. **可合并**: 画像支持增量合并（分布式友好）
3. **隐私安全**: 只存统计量，不存原始数据
4. **LLM 就绪**: 原生支持 LLM 输出质量监控

## 典型应用场景

- **数据质量**: 监控训练数据和特征数据的分布变化
- **模型监控**: 检测生产环境的数据漂移
- **LLM 监控**: 追踪 LLM 输出的毒性、长度、拒绝率
- **特征工程**: 分析特征分布和特征重要性

## 安装

```bash
pip install whylogs
```

## 参考资源

- [whylogs GitHub](https://github.com/whylabs/whylogs)
- [whylogs 文档](https://whylogs.readthedocs.io/)
- [WhyLabs 平台](https://whylabs.ai/)

## 相关概念

- [[概念/mlflow]] — MLflow 实验追踪与模型管理
- [[概念/wandb]] — Weights & Biases 实验追踪
- [[概念/langfuse]] — Langfuse 开源 LLM 可观测性
- [[概念/feature-store]] — Feature Store 特征存储
