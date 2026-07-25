---
title: "OpenCompass"
category: -concepts
tags: ["opencompass", "evaluation", "benchmark", "llm", "chinese-llm", "mmbench", "multimodal"]
relationships:
  - target: "概念/model-evaluation"
    type: extends
  - target: "概念/benchmark"
    type: enables
  - target: "概念/lm-evaluation-harness"
    type: related_to
  - target: "概念/llm"
    type: evaluates
sources:
  - 08_模型评估/04_Evaluation_Tools/OpenCompass_Deep_Dive.md
summary: "OpenCompass 是上海人工智能实验室开源的一站式 LLM 评测平台，支持学科、知识、推理、多语言、多模态等丰富基准，是国内大模型评测的重要工具。"
provenance:
  extracted: 0.8
  inferred: 0.15
  ambiguous: 0.05
base_confidence: 0.88
lifecycle: reviewed
tier: core
created: 2026-06-16
updated: 2026-07-21
aliases:
  - Opencompass

---
# OpenCompass

> 国产 LLM 评测的「一站式平台」——从学科考试到多模态，全面评估中文大模型。

---

## 1. 一句话定义

**OpenCompass** 是上海人工智能实验室开源的 **一站式大模型评测平台**，支持学科考试、知识问答、推理、多语言、长文本、多模态等丰富基准。它是国内大模型评测和社区榜单（如 CompassRank、CompassKit）的核心工具。

---

## 2. 核心能力

| 能力 | 说明 |
|------|------|
| **多维度基准** | 学科、知识、理解、推理、语言、考试、长文本、智能体 |
| **多模型支持** | HuggingFace、API（OpenAI、Claude、ERNIE、Qwen 等） |
| **多模态评测** | MMBench、MME、SEED 等视觉语言基准 |
| **中文优化** | C-Eval、CMMLU、GAOKAO-Bench 等中文考试 |
| **高效推理** | 支持 vLLM、LMDeploy 等加速后端 |
| **可视化报告** | 生成雷达图、排行榜、详细报告 |
| **模块化设计** | 数据集、模型、评测策略可插拔 |

---

## 3. 典型场景

1. **中文大模型评估**：C-Eval、CMMLU、Gaokao 等中文考试。
2. **多模态模型评测**：图文理解、视觉问答。
3. **模型能力雷达图**：全面展示模型各学科能力。
4. **社区榜单打榜**：参与 CompassRank 评测。

---

## 4. 与相关技术的关系

| 技术 | 关系 |
|------|------|
| **LM Evaluation Harness** | 国际学术基准为主，OpenCompass 中文和多模态更全 |
| **HELM** | 斯坦福 holistic 评估 |
| **vLLM / LMDeploy** | OpenCompass 可调用加速推理 |
| **HuggingFace Evaluate** | 通用 NLP 评估 |

---

## 5. 优势与局限

### 优势
- 中文基准覆盖全面。
- 多模态评测能力强。
- 可视化报告直观。

### 局限
- 对非中文模型和纯英文场景，部分基准不如 Harness 通用。
- 配置和扩展比 Harness 复杂。

---

## Related

- [[08_模型评估/04_Evaluation_Tools/OpenCompass_Deep_Dive]] — OpenCompass 深度解析
- [[概念/model-evaluation]] — 模型评估
- [[概念/benchmark]] — 基准测试
- [[概念/lm-evaluation-harness]] — LM Evaluation Harness
- [[08_模型评估/02_Benchmarks/LLM_Benchmark_Suite_2026]] — LLM 基准套件 2026

---

## 2026 OpenCompass 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **OpenCompass** | 开源模型评估框架 | GA |
| **多基准测试** | 支持多种基准测试 | GA |
| **自定义评估** | 自定义评估任务 | GA |
| **排行榜** | 模型排行榜 | GA |
| **与 LM Eval 对比** | OpenCompass vs LM Eval | GA |

## 生产最佳实践

1. **模型评估**：模型评估用 OpenCompass
2. **多基准**：多种基准测试全面评估
3. **自定义评估**：业务场景自定义评估
4. **与 LM Eval 对比**：根据需求选择评估工具
5. **持续评估**：模型迭代持续评估

## 评测配置示例

```python
# OpenCompass 评测配置
from opencompass import Config

config = Config({
    "models": [
        {"path": "Qwen/Qwen2.5-72B", "backend": "vllm"},
        {"path": "gpt-4o", "backend": "api"},
    ],
    "datasets": [
        "mmlu",        # 英文学科
        "ceval",       # 中文学科
        "cmmlu",       # 中文综合
        "bbh",         # 困难推理
        "humaneval",   # 代码
        "gsm8k",       # 数学
    ],
    "summarizer": {
        "type": "default",
        "output_dir": "./results"
    }
})
```

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 评测分数异常低 | Prompt 格式不匹配 | 检查模型模板配置 |
| 评测速度慢 | 未用加速后端 | 使用 vLLM/LMDeploy |
| 中文基准缺失 | 数据集未下载 | 执行数据集下载脚本 |
| API 调用失败 | Key/网络问题 | 检查 API 配置和代理 |
| 结果不可复现 | 采样随机性 | 设置 temperature=0 |

## 版本兼容性

| 组件 | 版本 | 说明 |
|------|------|------|
| OpenCompass | 0.2+ | 评测平台 |
| vLLM | 0.6+ | 加速后端 |
| Python | 3.10+ | 运行环境 |
| CUDA | 12.x | GPU 环境 |

## 生产检查清单

1. 选择与业务相关的基准组合
2. 使用 vLLM 加速评测过程
3. 设置 temperature=0 确保可复现
4. 中英文基准组合评估
5. 建立模型迭代评测基线
6. 定期更新基准防止数据污染

## 总结

OpenCompass 是国产 LLM 评测的核心工具，其中文基准覆盖和多模态评测能力是独特优势。对于国内 AI 团队，OpenCompass 是模型选型、迭代评估、能力对比的首选平台。

> 💡 评测的核心认知：没有单一基准能全面衡量模型能力——必须组合多个基准（学科+推理+代码+中文）才能得出可靠结论。

## OpenCompass 评估配置示例

```bash
# OpenCompass 多任务评估
python run.py \
  --models llama3_70b_instruct \
  --datasets mmlu_ppl gsm8k_gen humaneval_gen \
  --work-dir ./results \
  --max-num-workers 8

# 自定义评估集
python run.py \
  --models qwen2_72b \
  --datasets custom_benchmark \
  --custom-dataset-path ./my_eval_set.json \
  --debug
```

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 评估失败 | 模型加载 OOM | 降低 batch_size |
| 结果不可复现 | 随机种子未固定 | 设置 --seed 参数 |
| 评估慢 | 数据集大 | 使用子集 + 并行 |
| 自定义集失败 | 格式不对 | 检查 JSON schema |

## 生产检查清单

1. ✅ 组合多个基准综合评估
2. ✅ 固定随机种子确保可复现
3. ✅ 自定义业务评估集
4. ✅ CI/CD 集成自动评估
5. ✅ 定期更新评估集防污染
6. ✅ 记录全部评估参数
