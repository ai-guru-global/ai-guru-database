---
title: "模型路由（Model Routing）"
category: -concepts
tags: ["model-routing", "cost-optimization", "cascading", "inference", "finops", "routellm"]
relationships:
  - target: "_concepts/model-serving"
    type: optimizes
  - target: "_concepts/continuous-batching"
    type: complements
  - target: "_concepts/ab-testing-framework"
    type: uses
sources:
  - AI运维/Cost_Optimization_AI_Deep_Dive.md
  - 部署推理/README.md
summary: "模型路由是根据请求难度自动选择合适模型（简单→小模型，复杂→大模型）的成本优化技术。规则路由简单可靠，ML 路由更精准，级联路由（先试小的再升级）兼顾成本与质量，通常能把推理成本降低 60-80%。"
provenance:
  extracted: 0.7
  inferred: 0.25
  ambiguous: 0.05
base_confidence: 0.80
lifecycle: stable
lifecycle_changed: 2026-06-23
tier: core
created: 2026-06-23
updated: 2026-06-23
aliases:
  - "Model Routing"
  - "model routing"

---
# 模型路由（Model Routing）

## 核心要点

- **核心理念**：杀鸡不用牛刀——70% 请求是简单的，用大模型是浪费。
- **三种路由**：规则路由（关键词/长度）、ML 路由（训练分类器）、级联路由（先试小，不行再升级）。
- **收益**：与全用大模型相比，综合成本降 60-80%，质量几乎无损。

## 一句话理解

模型路由像"医院分诊"——轻症去社区诊所（小模型），重症转三甲（大模型），既不浪费医疗资源，又保证每个病人得到合适的治疗。

## 详细内容

### 为什么需要路由

```
典型 LLM 应用的请求难度分布：

  简单（70%）：闲聊、FAQ、格式转换、简单翻译
    → 小模型（8B）完全胜任，成本是大模型的 1/20

  中等（20%）：摘要、分析、中等推理
    → 中模型（70B），成本是大模型的 1/5

  困难（10%）：复杂推理、代码、数学、创作
    → 大模型（GPT-4/Claude），全价

  全用大模型：成本 100
  加权路由后：0.7×(1/20) + 0.2×(1/5) + 0.1×1 ≈ 0.2
  → 成本降至 20%，质量损失 <2%
```

### 三种路由策略

```
1. 规则路由（Rule-based）
   if len(prompt) < 50: → 小模型
   elif "代码" in prompt: → 代码模型
   elif "证明" in prompt: → 大模型
   else: → 中模型

   优点：简单、零成本、可解释
   缺点：规则死板，难覆盖所有情况

2. ML 路由（Learned Router）
   训练一个轻量分类器（BERT-tiny）：
   输入 prompt → 预测难度等级 → 路由

   优点：比规则准，能捕捉语义
   缺点：需训练数据；分类器本身有延迟

3. 级联路由（Cascading）
   请求 → 小模型 → 置信度高？→ 返回
                     ↓ 低
                   中模型 → 置信度高？→ 返回
                              ↓ 低
                            大模型 → 返回

   优点：自适应，难题才花大钱
   缺点：难题延迟翻倍（多跳）
   代表：RouteLLM（开源框架）
```

### 路由器的关键指标

| 指标 | 说明 | 目标 |
|------|------|------|
| **路由准确率** | 难度判断正确率 | >90% |
| **成本节省** | 相比全用大模型 | >60% |
| **质量损失** | 相比全用大模型 | <2% |
| **路由延迟** | 路由决策耗时 | <50ms（不能拖累总延迟） |

### 实现要点

```python
def route_model(prompt, history=None):
    # 1. 快速特征提取
    features = {
        'length': len(prompt),
        'has_code': '```' in prompt or 'def ' in prompt,
        'has_math': any(c in prompt for c in '证明计算推导∑∫'),
        'complexity_score': classifier.predict(prompt)  # ML 路由
    }
    # 2. 路由决策
    if features['has_math'] or features['complexity_score'] > 0.8:
        return "gpt-4o"          # 困难
    elif features['length'] > 500 or features['complexity_score'] > 0.4:
        return "llama-70b"       # 中等
    else:
        return "llama-8b"        # 简单
```

### 挑战与权衡

| 挑战 | 解法 |
|------|------|
| 路由错误（难题分给小模型） | 级联兜底 + 用户反馈回路 |
| 路由器成本 | 用极小模型（<1B）做路由 |
| 冷启动（无训练数据） | 先用规则，逐步收集日志训练 ML 路由 |
| 多模型运维复杂 | 统一推理网关（如 LiteLLM/OpenRouter） |

### 2026 趋势

- **RouteLLM 开源**：社区提供预训练路由模型，降低接入门槛
- **学习型级联**：不仅看置信度，还学历史成功率决定是否升级
- **与缓存协同**：路由前先查缓存，命中直接返回（无需调用任何模型）
- **成本即质量指标**：路由效果用"性价比曲线"评估，而非单纯质量

## Related

- [[_concepts/model-serving|模型服务]] — 路由的基础设施
- [[_concepts/continuous-batching|连续批处理]] — 路由后各模型的批处理
- [[_concepts/ab-testing-framework|A/B 测试]] — 路由策略的评估
- [[AI运维/Cost_Optimization_AI_Deep_Dive|成本优化]] — 路由是降本核心手段
- [[部署推理/README|部署与推理]] — 推理架构
- [[架构基建/AI_Gateway/AI_Gateway_2026|AI Gateway]] — 网关层路由实现
