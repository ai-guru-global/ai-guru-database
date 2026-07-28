---
title: "Model Rollback"
category: -concepts
tags: ["mlops", "deployment", "model-serving", "reliability", "alibaba-cloud"]
summary: "Model Rollback 是在线上模型出现回归、错误或安全问题时，将推理服务切回上一稳定模型版本的运维操作。"
created: 2026-06-26
updated: 2026-07-21
tier: supporting
aliases:
  - "模型回滚"
relationships:
  - target: "概念/model-deployment"
    type: related_to
  - target: "概念/model-registry"
    type: related_to
  - target: "概念/kserve"
    type: related_to
sources: []
name_zh: "模型回滚"
---

# Model Rollback

> 中文简称：模型回滚

> **一句话理解**: 模型回滚就是把线上「表现不好」的模型版本撤下来，换回到之前「表现好」的版本，同时保证权重、tokenizer、配置都一致。

## 核心要点

- **触发条件**: 指标回归、错误率升高、安全/合规问题、用户投诉。
- **回滚范围**: 权重、tokenizer、LoRA 适配器、量化配置、生成配置。
- **回滚入口**: MLflow Model Registry、K8s rollout undo、KServe canary、PAI-EAS。
- **验证**: smoke test、延迟/错误率监控、预测分布对比。
- **沟通**: 通知业务方、SRE、数据科学家，记录 incident。

## 回滚流程

```text
发现异常 → 确认上一稳定版本 → 回滚 Registry 版本 → 更新 K8s 资源 → 重启/切流 → 验证 → 监控 → 复盘
```

## 阿里云专有云关联

在阿里云专有云环境中，模型回滚可通过 MLflow Registry + KServe/ACK 实现，也可直接使用 PAI-EAS 的版本管理控制台。建议配合金丝雀发布降低回滚风险。

## Related

- [[概念/model-deployment|Model Deployment]]
- [[概念/model-registry|Model Registry]]
- [[概念/kserve|KServe]]
- [[概念/mlflow|MLflow]]
- [[10_部署推理/01_Deployment_Fundamentals/Model_Hot_Reload_and_Rollback_Runbook|LLM 模型热加载与回滚 Runbook]]
- [[11_模型运维/12_Troubleshooting/Model_Version_Rollback_Playbook|模型版本回滚 Playbook]]

---

## 2026 模型回滚生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **Model Registry** | 模型版本管理 | GA |
| **金丝雀发布** | 渐进式发布降低风险 | GA |
| **自动回滚** | 指标异常自动回滚 | GA |
| **A/B 测试** | 模型对比测试 | GA |
| **热加载** | 模型热切换 | GA |

## 生产最佳实践

1. **版本管理**：模型必须版本管理
2. **金丝雀发布**：新模型先金丝雀发布
3. **自动回滚**：配置自动回滚策略
4. **监控指标**：回滚决策基于监控指标
5. **回滚演练**：定期演练回滚流程

## 回滚触发条件矩阵

| 指标 | 阈值 | 回滚级别 | 响应时间 |
|------|------|----------|----------|
| 错误率 | > 5% | 立即回滚 | < 5min |
| P99 延迟 | > 2x 基线 | 立即回滚 | < 5min |
| 输出质量 | 人工评估下降 | 计划回滚 | < 30min |
| 安全事件 | 任何安全问题 | 立即回滚 | < 1min |
| 用户投诉 | > 10 起/小时 | 评估回滚 | < 15min |

## 配置示例

```yaml
# KServe 自动回滚配置
apiVersion: serving.kserve.io/v1beta1
kind: InferenceService
metadata:
  name: llm-service
spec:
  predictor:
    model:
      modelFormat:
        name: pytorch
      storageUri: "s3://models/llama-3-8b/v2"
    canaryTrafficPercent: 10
    autoRollback:
      enabled: true
      metrics:
        - name: error_rate
          threshold: 0.05
          window: 5m
        - name: p99_latency
          threshold: 2000
          window: 5m
```

## 回滚工具对比

| 工具 | 回滚方式 | 适用场景 |
|------|----------|----------|
| KServe | Canary + 自动回滚 | K8s 推理服务 |
| MLflow | Registry 版本切换 | 模型版本管理 |
| Argo Rollouts | 渐进式回滚 | K8s 通用应用 |
| PAI-EAS | 控制台版本切换 | 阿里云托管 |
| Flagger | 金丝雀 + 回滚 | K8s 服务网格 |

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 回滚后仍有问题 | 依赖组件未回滚 | 全栈回滚（模型+配置+代码） |
| 回滚时间长 | 模型加载慢 | 预热 + 模型缓存 |
| 无法确定稳定版本 | 缺乏版本管理 | 强制 Model Registry |
| 回滚后性能下降 | 硬件/环境变化 | 检查基础设施状态 |

## 相关概念

- [[概念/model-deployment|Model Deployment]] — 模型部署
- [[概念/model-registry|Model Registry]] — 模型注册中心
- [[概念/kserve|KServe]] — K8s 推理服务
- [[概念/General/chaos-engineering|Chaos Engineering]] — 混沌工程

## 总结

模型回滚是在线模型出现回归、错误或安全问题时的关键运维操作。通过版本管理、金丝雀发布和自动回滚策略，可以最小化故障影响。

---

> 💡 模型回滚就是把线上「表现不好」的模型版本撤下来，换回到之前「表现好」的版本。

## 回滚 Runbook

```
1. 确认异常 → 2. 评估影响 → 3. 决策回滚
       ↓                              ↓
4. 执行回滚 → 5. 验证恢复 → 6. 监控观察 → 7. 复盘报告
```

| 步骤 | 操作 | 负责人 | 时限 |
|------|------|--------|------|
| 确认异常 | 查看监控指标 | On-Call | 2min |
| 评估影响 | 确定影响范围 | On-Call + TL | 5min |
| 决策回滚 | 确认回滚版本 | TL | 3min |
| 执行回滚 | 切换模型版本 | SRE | 5min |
| 验证恢复 | Smoke test + 指标 | QA | 5min |
| 监控观察 | 持续观察 30min | SRE | 30min |
| 复盘报告 | 事后复盘 | 全员 | 48h |

## 回滚后验证清单

| 检查项 | 方法 | 通过标准 |
|--------|------|----------|
| 服务可用性 | 健康检查接口 | 200 OK |
| 错误率 | 监控指标 | < 1% |
| 延迟 | P99 监控 | < 基线 1.2x |
| 输出质量 | 抽样检查 | 无回归 |
| 资源使用 | GPU/内存监控 | 正常范围 |

## 版本兼容性

| 工具 | 版本 | 状态 |
|------|------|------|
| KServe | 0.13+ | 稳定 |
| MLflow | 2.15+ | 稳定 |
| Argo Rollouts | 1.7+ | 稳定 |
| Flagger | 1.38+ | 稳定 |

## 回滚策略对比

| 策略 | 风险 | 速度 | 适用场景 |
|------|------|------|----------|
| 立即回滚 | 低 | 快 | 严重故障 |
| 金丝雀回滚 | 极低 | 慢 | 渐进式验证 |
| 蓝绿回滚 | 低 | 中 | 有备用环境 |
| 影子回滚 | 极低 | 慢 | 对比测试 |

## AI 服务回滚特殊考虑

1. **Tokenizer 一致性**：回滚时确保 tokenizer 与模型版本匹配
2. **LoRA 适配器**：回滚基础模型时需同步回滚 LoRA
3. **量化配置**：不同量化版本不兼容
4. **KV Cache**：回滚后需清理 KV Cache
5. **预热时间**：大模型加载需要数分钟

## 生产检查清单

1. 模型版本必须通过 Model Registry 管理
2. 每次发布前确认回滚版本可用
3. 配置自动回滚指标阈值
4. 定期演练回滚流程
5. 回滚后必须进行复盘
