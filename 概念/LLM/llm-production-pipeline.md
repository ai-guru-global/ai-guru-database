---
title: "LLM 生产流水线"
category: -concepts
tags: ["llm-production", "mlops", "ci-cd", "deployment", "evaluation", "monitoring"]
relationships:
  - target: "概念/mlops"
    type: belongs_to
  - target: "概念/ci-integrated-evaluation"
    type: includes
  - target: "概念/model-deployment"
    type: includes
  - target: "概念/ab-testing-framework"
    type: includes
sources:
  - 11_模型运维/10_LLMOps/LLM_Production_Pipeline_2026.md
  - MLOps/README.md
summary: "LLM 生产流水线是把大模型从实验环境交付到线上服务的完整工程链路，包括数据准备、训练/微调、评估、部署、监控、反馈闭环，确保模型可持续迭代且风险可控。"
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
  - "Llm Production Pipeline"
  - "llm production pipeline"
  - "LLM 生产化流水线"

---
# LLM 生产流水线

> **一句话理解**: LLM 生产流水线就像一条造车的总装线：从原材料到整车下线，每个环节都有质检，出了问题能追溯到具体零件。

## 核心要点

- **LLM 生产流水线 = 大模型从实验室到用户的完整工程链路**
- **核心阶段**：数据 → 训练/微调 → 评估 → 部署 → 监控 → 反馈 → 再训练
- **关键要求**：可复现、可回滚、可监控、风险可控
- **与传统 MLOps 的区别**：LLM 更依赖提示工程、RLHF、在线评估、A/B 测试

## 典型阶段

```
数据准备 (清洗/标注/版本管理)
  ↓
预训练 / 微调 / RLHF / DPO
  ↓
离线评估（基准测试 + 人工评估）
  ↓
模型注册与版本管理
  ↓
部署（蓝绿 / 金丝雀 / 滚动更新）
  ↓
在线评估（A/B 测试 + LLM-as-Judge）
  ↓
监控与告警 (P95 延迟 / 吐量 / 质量分)
  ↓
收集反馈，重新训练 (Data Flywheel)
```

## 关键组件与工具链

| 组件 | 作用 | 2026 工具 |
|------|------|----------|
| 数据版本管理 | 训练数据可追溯 | DVC, LakeFS, HuggingFace Datasets |
| 实验追踪 | 记录训练参数/指标 | MLflow, W&B, Neptune |
| CI 评估 | 自动化基准测试 | lm-eval-harness, DeepEval |
| 模型注册 | 版本控制 + 审批流 | MLflow Registry, HF Hub |
| 模型服务 | 高性能推理 | vLLM, SGLang, TRT-LLM |
| 可观测性 | 指标/日志/追踪 | Prometheus, Grafana, LangSmith |
| 反馈闭环 | 在线指标回流训练 | Argilla, Label Studio |
| 安全护栏 | 输入/输出安全过滤 | Guardrails AI, NeMo Guardrails |

## 部署策略对比

| 策略 | 风险 | 回滚速度 | 适用场景 |
|------|:----:|:--------:|----------|
| **蓝绿部署** | 低 | 秒级 | 大版本更新 |
| **金丝雀发布** | 极低 | 秒级 | 模型迭代、Prompt 变更 |
| **滚动更新** | 中 | 分钟级 | 多副本服务 |
| **影子流量** | 无 | - | 新模型验证 |

## 监控指标体系

| 层级 | 指标 | 告警阈值 |
|------|------|:--------:|
| **服务层** | P95 TTFT, P95 TPOT, 吐量 | TTFT > 500ms |
| **质量层** | LLM-as-Judge 分, 用户满意度 | 分 < 4.0/5 |
| **业务层** | 任务完成率, 转化率 | 下降 > 5% |
| **安全层** | 拒绝率, 有害输出率 | 有害 > 0.1% |
| **成本层** | 每请求成本, GPU 利用率 | 利用率 < 30% |

## 与传统 MLOps 的差异

| 维度 | 传统 ML | LLM |
|------|--------|-----|
| **迭代单位** | 模型权重 | 模型 + Prompt + RAG |
| **评估方式** | 确定性指标 | LLM-as-Judge + 人工 |
| **发布粒度** | 模型版本 | Prompt/模型/RAG 独立发布 |
| **回滚复杂度** | 单模型 | 多组件联动 |
| **监控重点** | 数据漂移 | 质量分 + 安全护栏 |

## 生产上线检查清单

```yaml
pre_launch_checklist:
  performance:
    - "P95 TTFT < 500ms"
    - "P95 吐量 > 50 tokens/s"
    - "并发压测通过 (2x 预期峰值)"
  quality:
    - "LLM-as-Judge 分 > 4.0/5"
    - "幻觉率 < 5%"
    - "业务场景测试集通过率 > 90%"
  safety:
    - "输入过滤 + 输出审核已启用"
    - "Prompt Injection 测试通过"
    - "PII 检测已配置"
  observability:
    - "OpenTelemetry 追踪已接入"
    - "告警规则已配置"
    - "日志保留策略已定义"
  cost:
    - "每请求成本已核算"
    - "GPU 利用率 > 50%"
    - "预算告警已设置"
```

## 生产最佳实践

1. **渐进式发布**: 先 1% 流量验证，再逐步扩大
2. **多组件版本管理**: Prompt、模型、RAG 索引独立版本控制
3. **自动回滚**: 质量分下降超阈值自动回滚
4. **成本监控**: 实时跟踪 token 消耗和 GPU 利用率
5. **安全护栏**: 输入输出双层过滤，防止有害内容
6. **定期评估**: 每周运行评估套件，追踪质量趋势

## 延伸阅读

- [[概念/LLM/llmops|LLMOps]]
- [[概念/LLM/llm-production-deployment|LLM 生产部署]]
- [[概念/Inference/model-serving|模型服务]]
- [[11_模型运维/LLM_Production_Pipeline_2026|LLM 生产流水线 2026]]
- [[10_部署推理/01_Deployment_Fundamentals/LLM_Production_Deployment_Runbook|LLM 生产部署 Runbook]]

## 2026 LLM 生产流水线全景

```
数据收集 → 数据清洗 → 预训练 → SFT → 对齐 → 评估 → 部署 → 监控 → 迭代
    │                                                              │
    └──────────────────── 数据飞轮 ────────────────────┘
```

## 各阶段工具链

| 阶段 | 工具 | 说明 |
|------|------|------|
| **数据收集** | Scrapy / Common Crawl | 网络爬取 |
| **数据清洗** | datatrove / dolma | 去重/过滤 |
| **预训练** | Megatron / DeepSpeed | 分布式训练 |
| **SFT** | Axolotl / LLaMA-Factory | 指令微调 |
| **对齐** | TRL / OpenRLHF | RLHF/DPO |
| **评估** | lm-eval-harness | Benchmark |
| **部署** | vLLM / SGLang | 推理引擎 |
| **监控** | Langfuse / LangSmith | 可观测性 |

## 关键质量门控

| 阶段 | 门控指标 | 阈值 |
|------|---------|:----:|
| 数据清洗 | 重复率 | <5% |
| 预训练 | Loss 收敛 | 稳定下降 |
| SFT | 任务准确率 | >85% |
| 对齐 | 胜率 | >60% |
| 评估 | Benchmark | 达标 |
| 部署 | TTFT/TPOT | 满足 SLA |
| 监控 | 幻觉率 | <5% |

## 生产最佳实践

1. **数据质量优先**: 垃圾进垃圾出，数据清洗是最重要环节
2. **评估先行**: 每个阶段都有明确的评估指标和门控
3. **版本管理**: 模型/数据/配置全部版本化，可追溯可回滚
4. **自动化**: CI/CD 流水线自动化，减少人工干预
5. **监控闭环**: 生产问题反馈到数据收集，形成数据飞轮
6. **灰度发布**: 新模型先小流量验证，再全量切换
7. **成本意识**: 每个阶段都有成本预算和监控

## 常见失败模式

| 失败模式 | 原因 | 预防 |
|---------|------|------|
| 数据污染 | 清洗不彻底 | 多轮去重 + 质量过滤 |
| 过拟合 | SFT 数据太少 | 数据增强 + 早停 |
| 对齐税 | RLHF 过度 | 控制 KL 散度 |
| 部署延迟 | 引擎配置不当 | 基线测试 + 调优 |
| 成本失控 | 缺乏监控 | 配额 + 告警 |
| 质量回退 | 模型升级未验证 | A/B 测试 + 回滚 |
