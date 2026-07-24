---
title: "影子部署与金丝雀发布 (Shadow Deployment / Canary / Online LLM 评估)"
category: concepts
tags:
  - mlops
  - shadow-deployment
  - canary
  - online-evaluation
  - dark-launch
  - progressive-rollout
aliases:
  - Shadow Deployment
  - Canary Deployment
  - Dark Launch
  - Online LLM Evaluation
  - Progressive Rollout
  - Shadow Mode
relationships:
  - target: "概念/online-evaluation"
    type: extends
  - target: "概念/llm-evalops"
    type: related_to
  - target: "概念/ab-testing-framework"
    type: related_to
  - target: "概念/model-deployment"
    type: related_to
summary: "影子部署(Shadow Deployment)与金丝雀发布(Canary)是 2024-2026 LLM 上线"零风险"的关键——影子模式新模型平行运行不暴露用户,金丝雀发布 1% → 10% → 50% → 100% 渐进切流。是 LLM 升级 / A/B 测试 / 评估回滚的标准流程。"
lifecycle: reviewed
tier: core
created: 2026-07-24
updated: 2026-07-24
sources: []
---

# 影子部署与金丝雀发布

> **一句话理解**:影子部署 + 金丝雀发布是 LLM 上线的"安全阀"——影子模式(新模型 parallel 跑,用户看不到),金丝雀发布(1% → 10% → 50% → 100% 渐进切流)。是 LLM 升级、模型对比、新功能灰度的标准做法,失败可秒级回滚。

---

## 一、为什么需要影子部署 / 金丝雀?

LLM 上线风险:
- **质量下降**:升级后回答变差
- **延迟飙升**:新模型推理慢
- **成本爆量**:推理成本不可控
- **偏见放大**:新模型出格
- **越狱风险**:安全性变弱

影子 / 金丝雀解法:
- **影子模式**:新模型平行跑,用户无感
- **金丝雀**:1% 流量先试,渐进切
- **A/B 测试**:对比流量
- **秒级回滚**:出问题立即恢复

---

## 二、关键术语

| 中文 | 英文 | 说明 |
|---|---|---|
| 影子部署 | Shadow Deployment | 新模型平行跑 |
| 影子模式 | Shadow Mode | 同上 |
| 暗启动 | Dark Launch | 内部测试 |
| 金丝雀发布 | Canary Deployment | 小流量先试 |
| 蓝绿部署 | Blue-Green Deployment | 双环境切换 |
| 灰度发布 | Gray Release | 按比例切流 |
| 渐进式发布 | Progressive Rollout | 1% → 100% |
| 流量切分 | Traffic Splitting | 路由分流 |
| A/B 测试 | A/B Testing | 多版本对比 |
| 路由 | Routing | 流量路由 |
| 权重路由 | Weighted Routing | 按权重分配 |
| Sticky Session | Sticky Session | 同一用户同一版本 |
| 回滚 | Rollback | 切回老版本 |
| 流量镜像 | Traffic Mirroring | 复制请求到影子 |
| 服务网格 | Service Mesh | Istio / Linkerd |
| AI Gateway | AI Gateway | LiteLLM / Kong |
| 灰度策略 | Gradual Rollout | 渐进 |
| 自动化金丝雀 | Automated Canary | Argo Rollouts |
| 指标告警 | Metrics Alerting | 质量告警
| 用户分桶 | User Bucket | 用户级别分流 |

---

## 三、主流方案对比(2026-02 快照)

| 方案 | 类型 | 特色 | 适合 |
|---|---|---|---|
| **Argo Rollouts** | K8s Operator | 自动化金丝雀 | K8s |
| **Flagger** | K8s Operator | App Mesh / Istio 集成 | K8s + Service Mesh |
| **Istio** | Service Mesh | 流量切分 | 大集群 |
| **Linkerd** | Service Mesh | 轻量 | K8s |
| **AI Gateway(LiteLLM)** | 代理 | LLM 路由 + 回退 | LLM 专项 |
| **Kong AI Gateway** | 代理 | 插件丰富 | 企业级 |
| **AWS CodeDeploy** | 云 | 蓝绿 / 金丝雀 | AWS |
| **Spinnaker** | 多云 | 复杂发布 | 大企业 |
| **LaunchDarkly** | Feature Flag | 灵活 | 通用 |
| **Helicone** | LLM 监控 | 影子 + 评估 | LLM 专项 |
| **Langfuse** | LLM 监控 | 影子 + 评估 | LLM 专项 |

---

## 四、影子部署详解

### 4.1 原理

```
用户请求 → 主模型(返回响应给用户)
       ↘ 影子模型(parallel 跑,记录响应)
              ↓
         评估:对比主/影子差异
              ↓
         决策:是否切流到影子?
```

### 4.2 实现

```python
async def handle_request(prompt):
    # 主模型 - 给用户
    main_response = await call_main_model(prompt)
    
    # 影子模型 - 异步,不阻塞
    asyncio.create_task(
        call_shadow_model(prompt, main_response)
    )
    
    return main_response

async def call_shadow_model(prompt, main_response):
    shadow_response = await call_shadow(prompt)
    
    # 记录 + 评估
    await db.store({
        "prompt": prompt,
        "main": main_response,
        "shadow": shadow_response,
    })
    
    # 离线评估
    await evaluate_differences(prompt, main_response, shadow_response)
```

### 4.3 工具

- **Helicone**:自动影子 + 评估
- **Langfuse**:影子 + trace
- **LiteLLM**:影子路由

---

## 五、金丝雀发布详解

### 5.1 渐进式发布流程

```
Step 1: 1% 流量 → 新模型
Step 2: 观察 1-2 小时
Step 3: 5% 流量
Step 4: 观察 1-2 小时
Step 5: 25% → 50% → 100%
```

### 5.2 自动化金丝雀(Argo Rollouts)

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata:
  name: llm-server
spec:
  strategy:
    canary:
      steps:
      - setWeight: 5
      - pause: {duration: 2h}
      - setWeight: 25
      - pause: {duration: 2h}
      - setWeight: 50
      - pause: {duration: 1h}
      - setWeight: 100
      analysis:
        templates:
        - templateName: llm-success-rate
        startingStep: 1
```

### 5.3 关键指标

- 任务成功率 > 95%
- 用户满意度 > 4.5/5
- P99 延迟 < 5s
- 成本 < 预算 1.2x

---

## 六、流量切分策略

### 6.1 随机切分

- 按请求 hash 取模
- 简单、均匀
- 缺点:同一用户可能切到不同版本

### 6.2 Sticky Session

- 同一用户始终同一版本
- 体验更一致
- 需要 session 存储

### 6.3 用户分桶

- 按用户特征分桶(地理位置 / 用户类型)
- 适合 A/B 测试
- 需要用户标签

### 6.4 智能路由

- 根据 prompt 内容路由
- 简单问题 → 小模型
- 复杂问题 → 大模型
- AI Gateway 支持

---

## 七、LiteLLM 影子路由实战

```yaml
# config.yaml
router_settings:
  num_retries: 3
  timeout: 30
  
model_list:
  - model_name: gpt-4o-main
    litellm_params:
      model: openai/gpt-4o
      api_key: os.environ/OPENAI_API_KEY
  
  - model_name: gpt-4o-shadow
    litellm_params:
      model: openai/gpt-4o-mini
      api_key: os.environ/OPENAI_API_KEY
      mock_response: "shadow"  # 不真返回,只记录

# 客户端传入两个 model
```

```python
response = client.chat.completions.create(
    model=["gpt-4o-main", "gpt-4o-shadow"],  # 双跑
    messages=[...],
)
# 客户端拿 gpt-4o-main 响应,影子记录
```

---

## 八、回滚策略

### 8.1 自动回滚

```yaml
analysis:
  templates:
  - templateName: llm-metrics
  startingStep: 2
  failureCondition: 
    - "result.success_rate < 0.9"
  consecutiveErrorLimit: 3
```

### 8.2 手动回滚

- Argo Rollouts 一键 undo
- Helm rollback
- GitOps 自动恢复

### 8.3 回滚时间目标

- 检测:1 分钟
- 决策:30 秒
- 回滚:30 秒
- 总计 < 2 分钟

---

## 九、生产最佳实践

1. **新模型上线先影子**:1-7 天,观察差异。
2. **金丝雀 1% → 100%**:1-2 周,观察质量。
3. **关键指标必监控**:成功率、延迟、成本、用户反馈。
4. **自动回滚**:成功率 < 90% 立即回滚。
5. **Sticky Session**:用户体验一致。
6. **智能路由 + 金丝雀**:简单问题用小模型,复杂问题大模型。
7. **A/B 测试 7-14 天**:统计置信度 95% 需 1-2 周。
8. **影子 + 评估结合**:Helicone / Langfuse 自动。
9. **告警机制**:Latency P99 > 5s 告警。
10. **回滚演练**:每季度演练,确保流程通畅。

---

## 十、2026 生态速览

| 维度 | 2026 状态 |
|---|---|
| **Argo Rollouts** | v1.8,LLM 专用模板 |
| **Flagger** | v2.0,App Mesh 集成 |
| **Istio** | v1.25,AI Gateway 集成 |
| **LiteLLM 影子** | v1.40+,双模型路由 |
| **Helicone** | v2.0,影子 + 评估 |
| **Langfuse** | v3.0,影子 + trace |
| **AI Gateway 集成** | Envoy / Kong / APISIX |
| **市场规模** | MLOps + DevOps ARR $10B+ |
| **主要竞品** | Argo / Flagger / Istio / LiteLLM / Helicone / Langfuse |

---

## 十一、See Also(官方源)

### Argo Rollouts

- 仓库 [github.com/argoproj/argo-rollouts](https://github.com/argoproj/argo-rollouts)
- 文档 [argoproj.github.io/argo-rollouts](https://argoproj.github.io/argo-rollouts/)

### Flagger

- 仓库 [github.com/fluxcd/flagger](https://github.com/fluxcd/flagger)
- 文档 [flagger.app](https://flagger.app/)

### Istio

- 仓库 [github.com/istio/istio](https://github.com/istio/istio)
- 文档 [istio.io](https://istio.io/)

### LiteLLM

- 文档 [docs.litellm.ai](https://docs.litellm.ai/)

### 监控

- Helicone [github.com/Helicone/helicone](https://github.com/Helicone/helicone)
- Langfuse [github.com/langfuse/langfuse](https://github.com/langfuse/langfuse)

---

## 十二、相关概念卡

- [[概念/online-evaluation|Online Evaluation]]
- [[概念/llm-evalops|Llm Evalops]]
- [[概念/ab-testing-framework|Ab Testing Framework]]
- [[概念/model-deployment|Model Deployment]]
- [[概念/inference-autoscaling|Inference Autoscaling]]
- [[概念/llm-production-pipeline|Llm Production Pipeline]]
- [[概念/ai-gateway-2|Ai Gateway 2]]
- [[概念/ci-integrated-evaluation|Ci Integrated Evaluation]]
