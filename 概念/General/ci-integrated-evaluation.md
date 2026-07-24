---
title: "CI 集成评估"
category: -concepts
tags: ["ci-cd", "evaluation", "automation", "regression-testing", "model-evaluation", "mlops"]
relationships:
  - target: "概念/model-evaluation"
    type: implements
  - target: "概念/mlops"
    type: belongs_to
  - target: "概念/ab-testing-framework"
    type: precedes
  - target: "概念/llm-production-pipeline"
    type: part_of
sources:
  - 模型评估/Automation/Evaluation_Automation_2026.md
  - 模型运维/LLM_Evaluation_Pipeline.md
  - 模型运维/CI_CD/CI_CD_Pipeline_AI_2026.md
summary: "CI 集成评估是把模型评估嵌入持续集成流水线。每次代码或模型变更都自动跑一组基准测试，像软件项目的单元测试一样，确保新版本不会在某些能力上‘开倒车’。"
provenance:
  extracted: 0.75
  inferred: 0.2
  ambiguous: 0.05
base_confidence: 0.82
lifecycle: reviewed
lifecycle_changed: 2026-06-16
tier: core
created: 2026-06-16
updated: 2026-07-21
aliases:
  - "Ci Integrated Evaluation"
  - "ci integrated evaluation"

---
# CI 集成评估

## 核心要点

- **CI = Continuous Integration（持续集成）**：每次提交代码都自动构建、测试。
- **CI 集成评估 = 把模型评估也放进这个自动化流程**。
- **核心目标**：
  - 防止模型能力 regress（退化）。
  - 让评估结果可复现、可追踪。
  - 把评估从‘人工跑脚本’变成‘流水线自动跑’。

## 一句话理解

CI 集成评估就像给大模型装了一个‘自动化月考系统’：每次改代码或换模型，系统自动出题、自动阅卷、自动告诉你有没有考砸。

## 详细内容

### 为什么需要 CI 集成评估？

传统评估的问题：
- 靠人工在本地跑脚本，容易漏跑、错配环境。
- 模型版本、数据版本、评估代码版本对不上，结果不可复现。
- 小改动可能意外影响某类能力，但没人发现。

CI 集成评估让这些问题变成流水线的一部分。

### 典型流水线

```
代码/模型提交
  ↓
拉取固定版本的数据集
  ↓
运行基准测试（MMLU、GSM8K、HumanEval、自定义业务测试）
  ↓
与上一版本对比
  ↓
质量门禁：指标是否下降超过阈值？
  ├─ 通过 → 允许合并/发布
  └─ 失败 → 阻止发布，通知开发者
```

### 关键要素

| 要素 | 说明 |
|------|------|
| **版本锁定** | 模型、数据、代码、环境都固定版本 |
| **回归对比** | 新结果 vs 基线结果 |
| **阈值控制** | 单指标下降 > x% 即失败 |
| **可复现环境** | Docker、conda、随机种子固定 |
| **报告可视化** | 指标趋势图、差异明细 |
| **并行加速** | 多 GPU/多节点同时跑不同基准 |

### 常用工具

| 工具 | 用途 |
|------|------|
| **GitHub Actions / GitLab CI** | 触发流水线 |
| **MLflow / Weights & Biases** | 记录实验和指标 |
| **Docker** | 环境隔离 |
| **DVC / LakeFS** | 数据版本管理 |
| **lm-eval-harness** | 跑学术基准 |
| **自定义业务测试集** | 测真实业务指标 |

## 开放问题

- 评估时间与开发迭代速度的平衡。
- 如何设计‘足够敏感但不过敏’的阈值。
- 多模态、Agent 等复杂系统的 CI 评估标准化。

## Related

- [[概念/model-evaluation]] — 模型评估
- [[概念/mlops]] — MLOps
- [[概念/ab-testing-framework]] — A/B 测试框架
- [[概念/llm-production-pipeline]] — LLM 生产流水线
- [[模型评估/Evaluation_Automation_2026]] — 评估自动化 2026
- [[模型运维/LLM_Evaluation_Pipeline]] — LLM 评估流水线

---

## 2026 CI 集成评估生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **CI 评估** | CI/CD 集成评估 | GA |
| **自动评估** | 自动化模型评估 | GA |
| **评估门禁** | 评估通过门禁 | GA |
| **LLM 评估** | LLM 输出评估 | GA |
| **与 MLOps 配合** | CI 评估 + MLOps | GA |

## 生产最佳实践

1. **CI 集成**：模型评估集成到 CI/CD
2. **自动评估**：模型变更自动评估
3. **评估门禁**：评估不通过阻止部署
4. **LLM 评估**：LLM 输出自动评估
5. **与 A/B 配合**：CI 评估 + A/B 测试

## CI 评估流水线示例

```yaml
# GitHub Actions CI 评估
name: model-evaluation
on: [push, pull_request]
jobs:
  evaluate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Evaluation
        run: |
          python evaluate.py \
            --model ${{ github.event.pull_request.head.sha }} \
            --benchmarks mmlu,bbh,humaneval \
            --threshold 0.85
      - name: Check Results
        run: |
          if [ $(cat results.json | jq '.passed') != "true" ]; then
            echo "Evaluation failed" && exit 1
          fi
```

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 评估太慢 | 基准太多 | 分层评估（快速+完整） |
| 误报失败 | 阈值太严 | 调整阈值 + 容差 |
| 评估不稳定 | 采样随机性 | temperature=0 + 多次运行 |
| 与生产脱节 | 基准不相关 | 补充业务自定义评测 |

## 版本兼容性

| 工具 | 状态 | 说明 |
|------|------|------|
| GitHub Actions | GA | CI 平台 |
| lm-eval-harness | GA | 评估框架 |
| OpenCompass | GA | 国产评估 |
| Weights & Biases | GA | 实验追踪 |

## 生产检查清单

1. 模型变更触发自动评估
2. 设置评估通过门禁
3. 分层评估（快速 PR + 完整发布）
4. 评估结果可视化展示
5. 建立评估基线和回归检测
6. 定期更新评估基准

## 总结

CI 集成评估是 MLOps 的关键实践，确保每次模型变更都经过自动化评估验证。它是防止模型回归、保障生产质量的重要门禁。

> 💡 CI 评估的核心价值：像代码测试一样测试模型——每次变更都自动验证，确保模型质量只升不降。

## CI 评估流水线示例

```yaml
# GitHub Actions - 模型评估流水线
name: Model Evaluation
on: [pull_request]
jobs:
  evaluate:
    runs-on: gpu-runner
    steps:
      - uses: actions/checkout@v4
      - name: Run Benchmark
        run: |
          python evaluate.py \
            --model ${{ github.event.pull_request.head.sha }} \
            --tasks mmlu,gsm8k,humaneval \
            --output results.json
      - name: Quality Gate
        run: |
          python check_quality.py results.json \
            --min-mmlu 0.82 \
            --min-gsm8k 0.90
      - name: Post Results
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              body: require('./results.json').summary
            })
```

## 质量门禁配置

| 指标 | 阈值 | 动作 |
|------|------|------|
| MMLU 下降 > 2% | 阻断 | 拒绝合入 |
| GSM8K 下降 > 3% | 阻断 | 拒绝合入 |
| 延迟增加 > 10% | 警告 | 通知负责人 |
| 安全测试失败 | 阻断 | 拒绝合入 |
| 幻觉率增加 > 5% | 警告 | 人工审核 |

## 生产检查清单

1. ✅ 每次模型变更触发自动评估
2. ✅ 设置明确的质量门禁阈值
3. ✅ 评估结果自动发布到 PR
4. ✅ 安全测试作为必过门禁
5. ✅ 评估集定期更新防过拟合
6. ✅ 保留历史评估结果用于趋势分析

