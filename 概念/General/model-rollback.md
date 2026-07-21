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
---

# Model Rollback

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
- [[部署推理/Model_Hot_Reload_and_Rollback_Runbook|LLM 模型热加载与回滚 Runbook]]
- [[模型运维/Troubleshooting/Model_Version_Rollback_Playbook|模型版本回滚 Playbook]]

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
