---
title: "AI 审计与可追溯 (AI Audit / Compliance / Lineage / 模型卡 / 决策解释)"
category: concepts
tags:
  - safety
  - ai-audit
  - compliance
  - lineage
  - model-card
  - explainability
  - decision-trace
aliases:
  - AI Audit
  - AI Compliance
  - Model Lineage
  - Model Card
  - AI Explainability
  - Decision Traceability
  - Audit Trail
relationships:
  - target: "概念/explainable-ai"
    type: extends
  - target: "概念/ai-governance"
    type: related_to
  - target: "概念/llm-evalops"
    type: related_to
  - target: "概念/eu-ai-act"
    type: related_to
summary: "AI 审计与可追溯是 2024-2026 突破"AI 决策黑盒"的关键——模型卡(Model Card)/ 数据卡(Data Sheet)/ 决策日志(Decision Log)/ 解释(XAI)/ 血缘(Lineage)/ 审计追踪(Audit Trail)/ 风险评估(AI Risk Assessment)。EU AI Act 强制要求,金融 / 医疗 / 政务必做。"
lifecycle: reviewed
tier: core
created: 2026-07-24
updated: 2026-07-24
sources: []
name_zh: "AI 审计与可追溯"
---

# AI 审计与可追溯

> 中文简称：AI 审计与可追溯

> **一句话理解**:AI 审计与可追溯让 AI 决策"可解释 / 可追溯 / 可审计"——模型卡(描述模型能力与限制)、数据卡(数据来源与偏差)、决策日志(每次决策留痕)、解释(XAI 解释为什么)、血缘(数据 → 模型 → 决策全程追踪)。EU AI Act 强制要求,金融 / 医疗 / 政务刚需。

---

## 一、为什么需要 AI 审计?

AI 在高风险场景的部署需要:
- **金融**:信贷决策不能黑盒
- **医疗**:诊断建议要可解释
- **司法**:量刑辅助要可追溯
- **政务**:福利分配要可申诉
- **GDPR "解释权"**:用户有权知道算法决策

AI 审计解法:
- 模型卡 + 数据卡 + 决策卡
- 完整血缘追踪
- XAI 解释
- 审计日志

---

## 二、关键术语

| 中文 | 英文 | 说明 |
|---|---|---|
| 模型卡 | Model Card | 模型元数据 |
| 数据卡 | Data Sheet | 数据元数据 |
| 数据卡 | Data Card | Hugging Face 风格 |
| 系统卡 | System Card | OpenAI / Anthropic 风格 |
| 决策日志 | Decision Log | 每次决策留痕 |
| 审计追踪 | Audit Trail | 完整可追溯 |
| 血缘 | Lineage | 数据 / 模型 / 决策 |
| 决策可解释 | Decision Explainability | XAI |
| 解释 | Explanation | LIME / SHAP |
| 反事实 | Counterfactual | 假设性解释 |
| 影响评估 | Impact Assessment | AIIA / FRIA |
| 算法影响评估 | Algorithmic Impact Assessment(AIA) | 加拿大 / 美国 |
| 基本权利影响评估 | Fundamental Rights Impact Assessment(FRIA) | EU AI Act 高风险 |
| 模型注册 | Model Registry | MLflow / BentoML |
| 决策表 | Decision Table | 可读决策记录 |
| 可解释 AI | Explainable AI(XAI) | 见 explainable-ai |
| 特征重要性 | Feature Importance | SHAP 值 |
| 局部解释 | Local Explanation | 单样本 |
| 全局解释 | Global Explanation | 模型整体 |
| 偏差审计 | Bias Audit | 公平性 |
| 公平性指标 | Fairness Metrics | demographic parity 等 |

---

## 三、模型卡 / 数据卡 / 系统卡

### 3.1 模型卡(Mitchell et al. 2019)

```yaml
model_details:
  name: my-classifier
  version: 1.0
  type: Random Forest
  date: 2026-07-01
  owner: alice@company.com
  
intended_use:
  primary: 邮件分类
  primary_users: 客服
  out_of_scope: 法律文件
  
training_data:
  - name: emails-2025
    size: 1M emails
    preprocessing: PII removed
  
metrics:
  accuracy: 0.95
  f1: 0.93
  per_demographic:  # 公平性
    - group: gender-male, acc: 0.95
    - group: gender-female, acc: 0.95
  
ethical_considerations:
  - data: 数据集存在历史偏见
  - use: 不可用于招聘
  - risk: 中风险
```

### 3.2 数据卡(Gebru et al. 2021)

- 数据来源 / 收集方法
- 标注过程
- 偏差 / 限制
- 许可 / 法律
- 维护计划

### 3.3 系统卡(OpenAI 风格)

- 模型 + 接口 + 集成 + 风险
- 红队测试结果
- 越狱 / 滥用报告
- 缓解措施

### 3.4 工具

- **Hugging Face Model Card**[huggingface.co/docs/hub/model-cards](https://huggingface.co/docs/hub/model-cards)
- **ModelCard Toolkit**[github.com/SafetyDetectives/model-card-toolkit](https://github.com/SafetyDetectives/model-card-toolkit)

---

## 四、决策日志 / 审计追踪

### 4.1 决策日志内容

```python
decision_log = {
    "timestamp": "2026-07-24T10:30:00Z",
    "user_id": "user_123",
    "model_version": "gpt-4o-2025-08",
    "model_card_id": "mc_gpt4o_2025",
    "input_hash": "sha256:...",
    "input_pii_scrubbed": True,
    "output": "...",
    "output_filtered": False,
    "tokens_input": 1500,
    "tokens_output": 800,
    "latency_ms": 2500,
    "cost_usd": 0.045,
    "decision_id": "dec_abc123",
    "trace_id": "trace_xyz",
    "policy_evaluated": ["no-pii-leak", "no-harmful"],
    "tools_called": ["web_search", "calculator"],
    "human_review": False,
    "appealed": False,
    "audit_signature": "..."  # 加密签名
}
```

### 4.2 审计追踪要求

- **不可篡改**:加密签名 / 区块链
- **可搜索**:按 user / 时间 / 决策
- **可保留**:1+ 年
- **可导出**:GDPR / 解释权

### 4.3 工具

- **Langfuse**[github.com/langfuse/langfuse](https://github.com/langfuse/langfuse)
- **LangSmith**[smith.langchain.com](https://smith.langchain.com/)
- **Helicone**[github.com/Helicone/helicone](https://github.com/Helicone/helicone)
- **Opik**[github.com/comet-ml/opik](https://github.com/comet-ml/opik)

---

## 五、可解释 AI(XAI)

### 5.1 局部解释

- **LIME**:训练线性代理
- **SHAP**:Shapley 值分解
- **Anchor**:规则化解释

### 5.2 全局解释

- 特征重要性
- 决策树可视化
- 概念瓶颈模型

### 5.3 LLM 解释

- **Chain-of-Thought**:LLM 自我解释
- **Reflection Token**(Self-RAG):过程反馈
- **Causal Tracing**:因果追踪
- **Attention 可视化**:但有争议

### 5.4 反事实

- "如果你的信用评分是 720 而非 650,你会通过。"
- 对比性解释,用户友好

### 5.5 工具

- **SHAP**[github.com/shap/shap](https://github.com/shap/shap)
- **LIME**[github.com/marcotcr/lime](https://github.com/marcotcr/lime)
- **Captum**(PyTorch)[github.com/pytorch/captum](https://github.com/pytorch/captum)
- **Alibi**[github.com/SeldonIO/alibi](https://github.com/SeldonIO/alibi)

---

## 六、血缘追踪

### 6.1 三层血缘

```
数据血缘: 原始数据 → 清洗 → 特征 → 训练数据
   ↓
模型血缘: 训练数据 → 模型 → 评估 → 部署
   ↓
决策血缘: 输入 → 推理 → 输出 → 用户
```

### 6.2 工具

- **DataHub**(LinkedIn):企业级元数据
- **Apache Atlas**:数据治理
- **OpenLineage**:开放血缘
- **Unity Catalog**(Databricks):统一元数据
- **Iceberg**:表级血缘
- **MLflow**:模型血缘

### 6.3 实现

```python
from openlineage.client import OpenLineageClient
from openlineage.client.event_v2 import Dataset, Job, Run, RunEvent, RunState, RunFacet

client = OpenLineageClient.from_environment()

# 记录训练事件
client.emit(
    RunEvent(
        eventType=RunState.START,
        run=Run(runId="run-1"),
        job=Job(namespace="ml", name="train"),
        inputs=[Dataset(namespace="postgres", name="raw.users")],
        outputs=[Dataset(namespace="mlflow", name="model.user-classifier")],
    )
)
```

---

## 七、影响评估

### 7.1 算法影响评估(AIA)

- 加拿大政府 2019 推出
- 评估 AI 系统的社会影响
- 强制用于公共部门

### 7.2 基本权利影响评估(FRIA)

- EU AI Act 高风险 AI 必做
- 评估对基本权利的潜在影响
- 文档化 + 第三方审核

### 7.3 AI 风险评估(AI RMF)

- NIST AI 100-1 / 600-1
- 治理 + 映射 + 测量 + 管理
- 框架 + 工具

### 7.4 工具

- **AI Verify**(新加坡):AI 治理测试
- **AIIA Toolkit**(加拿大):AIA 工具
- **NIST AI RMF**[nist.gov/itl/ai-risk-management-framework](https://www.nist.gov/itl/ai-risk-management-framework)

---

## 八、生产最佳实践

1. **模型卡 / 数据卡必做**:每个模型发布前。
2. **决策日志全量**:每次决策 / 推理留痕。
3. **加密签名 + 不可篡改**:审计追踪完整性。
4. **XAI 集成**:信贷 / 医疗 / 司法必用。
5. **血缘追踪**:数据 → 模型 → 决策全程。
6. **影响评估**:高风险 AI 必做 FRIA。
7. **偏差审计**:定期 demographic parity 检查。
8. **解释权支持**:GDPR 用户可查决策。
9. **保留期**:决策日志 1+ 年。
10. **第三方审核**:每年独立审计。

---

## 九、2026 生态速览

| 维度 | 2026 状态 |
|---|---|
| **EU AI Act** | 2026-08 完整实施 |
| **模型卡** | Hugging Face 强制 |
| **GDPR 解释权** | 持续执法 |
| **AI Verify** | 新加坡 2024 试点 |
| **NIST AI RMF** | 美国国家标准 |
| **OpenLineage** | 1.0 2024 GA |
| **市场规模** | AI 治理 ARR $1B+ |
| **企业采用** | 100% Fortune 500 |
| **主要竞品** | Langfuse / Helicone / DataHub / OneTrust / TrustArc |

---

## 十、See Also(官方源)

### 模型 / 数据卡

- Model Card 论文 [arxiv.org/abs/1810.03993](https://arxiv.org/abs/1810.03993)
- Data Sheet 论文 [arxiv.org/abs/1803.09010](https://arxiv.org/abs/1803.09010)
- HF Model Cards [huggingface.co/docs/hub/model-cards](https://huggingface.co/docs/hub/model-cards)
- Model Card Toolkit [github.com/SafetyDetectives/model-card-toolkit](https://github.com/SafetyDetectives/model-card-toolkit)

### XAI

- SHAP [github.com/shap/shap](https://github.com/shap/shap)
- LIME [github.com/marcotcr/lime](https://github.com/marcotcr/lime)
- Captum [github.com/pytorch/captum](https://github.com/pytorch/captum)
- Alibi [github.com/SeldonIO/alibi](https://github.com/SeldonIO/alibi)

### 血缘

- DataHub [github.com/datahub-project/datahub](https://github.com/datahub-project/datahub)
- Apache Atlas [atlas.apache.org](https://atlas.apache.org/)
- OpenLineage [github.com/OpenLineage/OpenLineage](https://github.com/OpenLineage/OpenLineage)
- Unity Catalog [github.com/unitycatalog/unitycatalog](https://github.com/unitycatalog/unitycatalog)

### 监控

- Langfuse [github.com/langfuse/langfuse](https://github.com/langfuse/langfuse)
- LangSmith [smith.langchain.com](https://smith.langchain.com/)
- Helicone [github.com/Helicone/helicone](https://github.com/Helicone/helicone)
- Opik [github.com/comet-ml/opik](https://github.com/comet-ml/opik)

### 框架

- NIST AI RMF [nist.gov/itl/ai-risk-management-framework](https://www.nist.gov/itl/ai-risk-management-framework)
- EU AI Act FRIA [artificialintelligenceact.eu](https://artificialintelligenceact.eu/)
- AI Verify (Singapore) [aiverify.imda.gov.sg](https://aiverify.imda.gov.sg/)
- 加拿大 AIIA [canada.ca](https://www.canada.ca/)

---

## 十一、相关概念卡

- [[概念/explainable-ai|Explainable Ai]]
- [[概念/ai-governance|Ai Governance]]
- [[概念/llm-evalops|Llm Evalops]]
- [[概念/eu-ai-act|Eu Ai Act]]
- [[概念/llm-safety|Llm Safety]]
- [[概念/bias-detection|Bias Detection]]
- [[概念/model-security|Model Security]]
- [[概念/model-registry|Model Registry]]
