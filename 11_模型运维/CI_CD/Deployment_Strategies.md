---
title: "模型部署策略 (Deployment Strategies)"
category: "11-mlops-pipeline"
tags: ["deployment", "canary", "shadow", "blue-green", "champion-challenger", "mlops", "release"]
summary: "> **一句话理解**: 模型部署策略决定了新模型如何安全地替换旧模型——从 Shadow（影子测试）到 Canary（灰度发布）再到 Champion-Challenger（A/B 对比），每种策略在风险控制和验证严格度上逐级递增。"
created: "2026-06-25"
updated: "2026-06-25"
tier: supporting
aliases:
  - "Deployment Strategies"
  - Deployment_Strategies
sources: []

---
# 模型部署策略 (Deployment Strategies)

> **一句话理解**: ML 模型不是"部署即完成"——新模型上线后可能在生产分布上表现不佳。部署策略通过渐进式流量切换、影子对比和 A/B 验证，将"翻车"风险降到最低。

---

## 目录

1. [部署策略全景](#1-部署策略全景)
2. [Shadow Deployment (影子部署)](#2-shadow-deployment-影子部署)
3. [Canary Deployment (金丝雀/灰度发布)](#3-canary-deployment-金丝雀灰度发布)
4. [Blue-Green Deployment (蓝绿部署)](#4-blue-green-deployment-蓝绿部署)
5. [Champion-Challenger (冠军挑战者)](#5-champion-challenger-冠军挑战者)
6. [策略选型决策](#6-策略选型决策)
7. [K8s 实现方案](#7-k8s-实现方案)
8. [最佳实践](#8-最佳实践)
9. [常见问题](#9-常见问题)

---

## 1. 部署策略全景

### 1.1 ML 模型 vs 传统软件部署差异

| 维度 | 传统软件部署 | ML 模型部署 |
|------|-----------|------------|
| 失败模式 | 报错/崩溃（立即发现） | 预测变差（延迟发现） |
| 回滚触发 | 错误率飙升 | 业务指标下降（需监控） |
| 验证手段 | 集成测试 + 冒烟测试 | Shadow 对比 + A/B 测试 |
| 状态 | 无状态/有状态 | 通常无状态（但有数据依赖） |

### 1.2 策略风险梯度

```
风险递增 →
Shadow → Canary → Blue-Green → 直接替换
(最安全)                              (最危险)

验证严格度递增 →
Shadow (仅观察) → Canary (小流量验证) → Champion-Challenger (统计显著性验证)
```

---

## 2. Shadow Deployment (影子部署)

### 2.1 原理

新模型接收与生产模型**完全相同的请求**，但响应**不返回给用户**。仅用于对比和验证。

```
用户请求 → [路由层] → Champion (生产模型) → 响应给用户
                  ↘ Shadow (新模型) → 记录日志，不返回
```

### 2.2 优势与限制

| 优势 | 限制 |
|------|------|
| 零风险（用户无感知） | 双倍计算成本 |
| 真实流量验证 | 无法验证用户体验指标 |
| 可长时间运行收集数据 | 需要延迟对比分析系统 |

### 2.3 实现要点

```python
class ShadowRouter:
    def route(self, request):
        # 1. 生产模型正常处理
        response = champion_model.predict(request)

        # 2. 异步调用影子模型（不影响延迟）
        asyncio.create_task(self._shadow_predict(request))

        return response

    async def _shadow_predict(self, request):
        shadow_response = shadow_model.predict(request)
        # 记录对比日志
        comparison_logger.log({
            "champion": response,
            "shadow": shadow_response,
            "request_hash": hash(request),
            "timestamp": datetime.now(),
        })
```

---

## 3. Canary Deployment (金丝雀/灰度发布)

### 3.1 原理

先将**小比例流量**（如 5%）切到新模型，观察指标无异常后逐步增加。

```
阶段 1: Champion 95% / Canary 5%   → 观察 30 分钟
阶段 2: Champion 80% / Canary 20%  → 观察 1 小时
阶段 3: Champion 50% / Canary 50%  → 观察 2 小时
阶段 4: Canary 100% (全量)         → 完成
```

### 3.2 自动回滚条件

```yaml
canary_analysis:
  metrics:
    - name: error_rate
      threshold: 0.01           # 错误率 < 1%
    - name: latency_p99
      threshold: 2000           # P99 延迟 < 2s
    - name: prediction_accuracy
      threshold: 0.95           # 预测准确率 > 95%
  rollback_conditions:
    - metric: error_rate
      comparison: greater_than
      value: 0.05               # 错误率 > 5% 立即回滚
    - metric: latency_p99
      comparison: greater_than
      value: 5000               # P99 > 5s 回滚
  analysis_interval: 5m         # 每 5 分钟评估一次
```

### 3.3 Kayenta / Argo Rollouts 集成

```yaml
# Argo Rollouts Canary 配置
apiVersion: argoproj.io/v1alpha1
kind: Rollout
spec:
  strategy:
    canary:
      steps:
      - setWeight: 5
      - pause: {duration: 30m}
      - setWeight: 20
      - pause: {duration: 1h}
      - setWeight: 50
      - analysis:
          templates:
          - templateName: model-quality-analysis
      - setWeight: 100
      canaryService: model-canary
      stableService: model-stable
```

---

## 4. Blue-Green Deployment (蓝绿部署)

### 4.1 原理

同时维护两套完整环境（Blue=当前生产，Green=新版本），验证后一次性切换全部流量。

```
用户流量 → [负载均衡器] → Blue (当前生产, 100%)
                        → Green (新版本, 0%)

切换后:
用户流量 → [负载均衡器] → Blue (0%)
                        → Green (新版本, 100%)
```

### 4.2 优势与限制

| 优势 | 限制 |
|------|------|
| 即时回滚（切回 Blue） | 双倍基础设施成本 |
| 无渐进过渡的复杂性 | 切换瞬间可能有请求中断 |
| 适合无法容忍灰度的场景 | 全量切换后问题暴露更快 |

### 4.3 适用场景

- 模型 API 的**基础设施变更**（如从 vLLM 迁移到 SGLang）
- 模型版本差异极大（如 GPT-3.5 → GPT-4 级别的变更）
- 合规要求需要完整的环境隔离

---

## 5. Champion-Challenger (冠军挑战者)

### 5.1 原理

Champion（当前生产模型）和 Challenger（候选新模型）同时接收流量，通过**统计显著性检验**决定是否替换。

```
流量分配: Champion 90% / Challenger 10%
                    ↓
       收集 1000+ 样本的业务指标
                    ↓
       统计检验 (t-test / Mann-Whitney)
                    ↓
    Challenger 显著优于 Champion？ → 提升为 Champion
```

### 5.2 与 A/B 测试的关系

| 维度 | 传统 A/B 测试 | Champion-Challenger |
|------|-------------|-------------------|
| 目标 | 用户体验优化 | 模型质量验证 |
| 指标 | 点击率、转化率 | 预测准确率、延迟、成本 |
| 持续时间 | 1-4 周 | 数小时到数天 |
| 决策者 | 产品经理 | ML 工程师（自动化） |
| 样本量要求 | 大（统计功效） | 中（技术指标更敏感） |

### 5.3 自动化决策

```python
from scipy import stats
import numpy as np

def champion_challenger_decision(champion_scores, challenger_scores, alpha=0.05):
    """统计检验决定是否替换"""
    # Mann-Whitney U 检验（非参数，不假设正态分布）
    u_stat, p_value = stats.mannwhitneyu(
        champion_scores, challenger_scores,
        alternative='greater'  # challenger 是否更好
    )

    challenger_mean = np.mean(challenger_scores)
    champion_mean = np.mean(champion_scores)
    improvement = (challenger_mean - champion_mean) / champion_mean

    print(f"Champion mean: {champion_mean:.4f}")
    print(f"Challenger mean: {challenger_mean:.4f}")
    print(f"Improvement: {improvement:+.2%}")
    print(f"p-value: {p_value:.4f}")

    if p_value < alpha and improvement > 0.01:
        print(f"✅ 统计显著 (p={p_value:.4f} < {alpha})，Challenger 晋升为 Champion")
        return "promote"
    elif p_value < alpha and improvement < -0.01:
        print(f"❌ Challenger 显著更差，保留 Champion")
        return "reject"
    else:
        print(f"⏳ 无统计显著差异 (p={p_value:.4f})，继续收集数据")
        return "continue"
```

---

## 6. 策略选型决策

### 6.1 决策矩阵

| 策略 | 风险 | 成本 | 验证深度 | 回滚速度 | 适用场景 |
|------|------|------|---------|---------|---------|
| Shadow | 最低 | 高（2x GPU） | 高 | 无需 | 重大模型变更前的验证 |
| Canary | 低 | 中 | 中 | 秒级 | 常规模型更新 |
| Blue-Green | 中 | 高（2x infra） | 低 | 秒级 | 基础设施变更 |
| Champion-Challenger | 低 | 中 | 最高 | 小时级 | 需要统计验证的关键模型 |
| 直接替换 | 高 | 低 | 无 | 分钟级 | 内部/非关键模型 |

### 6.2 推荐组合

```
高风险模型（金融/医疗/安全）:
  Shadow (1 天) → Canary (5% → 20% → 100%) → Champion-Challenger 持续监控

标准模型（推荐/搜索/NLP）:
  Canary (10% → 50% → 100%) + 自动回滚

低风险模型（内部工具/实验）:
  直接替换 + 基础监控
```

---

## 7. K8s 实现方案

### 7.1 Istio 流量分割

```yaml
# VirtualService: 95% 生产 / 5% 灰度
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: model-serving
spec:
  hosts:
  - model-api.internal
  http:
  - route:
    - destination:
        host: model-champion
        port:
          number: 8080
      weight: 95
    - destination:
        host: model-challenger
        port:
          number: 8080
      weight: 5
```

### 7.2 KServe Canary

```yaml
apiVersion: serving.kserve.io/v1beta1
kind: InferenceService
metadata:
  name: llm-serving
spec:
  predictor:
    canaryTrafficPercent: 10
    model:
      modelFormat:
        name: pytorch
      storageUri: s3://models/llm-v2
    resources:
      limits:
        nvidia.com/gpu: 1
```

---

## 8. 最佳实践

1. **默认 Canary**: 大多数模型更新使用 Canary 10% → 50% → 100%，自动回滚
2. **重大变更先 Shadow**: 模型架构变更或跨代升级前，先 Shadow 运行 24-48 小时
3. **监控三件套**: 每个部署必须监控 预测分布 + 延迟 + 错误率
4. **回滚要快于部署**: 回滚操作应在 30 秒内完成（预热旧模型 Pod）
5. **日志对比**: Shadow/Challenger 的预测日志保留 30 天，用于事后分析
6. **渐进式而非一步到位**: 永远不要在生产环境"一把梭"

---

## 9. 常见问题

### Q1: Shadow 部署的 GPU 成本如何优化？
使用 Spot/Preemptible 实例运行 Shadow（允许中断）；或使用量化版模型做 Shadow。

### Q2: Canary 流量比例如何选择？
取决于流量规模。日均 1M 请求：5% = 50K 样本/天，足够统计验证。日均 10K 请求：20% 起步。

### Q3: 如何处理有状态模型的部署？
有状态模型（如对话记忆）需要在流量切换时做 Session 粘性（Sticky Session），确保同一用户的请求路由到同一模型实例。

### Q4: Champion-Challenger 需要多少样本？
取决于预期改进幅度和指标方差。经验法则：每侧至少 1000 个样本可获得可靠的统计结论。

### Q5: 多模型同时灰度怎么办？
使用 Argo Rollouts 的 multi-canary 或 Istio 的多路由规则。注意总灰度流量不超过 30%。

---

## Related

- [[模型运维/CI_CD/ML_CI_CD]] — ML CI/CD 流水线
- [[模型运维/CI_CD/CI_CD_Pipeline_AI_2026]] — AI 系统 CI/CD
- [[部署推理/Inference_Engines/KServe_Deep_Dive]] — KServe 部署
- [[模型运维/Observability/Model_Monitoring_and_Drift_Detection_2026]] — 模型监控

---

*Last updated: 2026-06-25*
*Version: 1.0.0*
