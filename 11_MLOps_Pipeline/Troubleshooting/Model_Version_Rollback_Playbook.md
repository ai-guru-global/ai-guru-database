---
title: "模型版本回滚 Playbook"
category: 11-mlops-pipeline
subcategory: troubleshooting
tags: ["mlops", "model-registry", "rollback", "kserve", "kubernetes", "k8s", "alibaba-cloud"]
summary: "面向 K8s 上 ML/LLM 推理服务的模型版本回滚：结合 MLflow Model Registry 与 K8s/KServe 流量控制，给出安全回滚流程与检查清单。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
sources: []
---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](../../_meta/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->

# 模型版本回滚 Playbook

> **一句话理解**: 模型回滚不是简单把镜像改回旧 tag——要同步回滚模型权重、tokenizer、LoRA、量化配置，并把 K8s/KServe 流量切回稳定版本。

## 目录

- [1. 回滚触发条件](#1-回滚触发条件)
- [2. 回滚前检查清单](#2-回滚前检查清单)
- [3. 回滚流程](#3-回滚流程)
- [4. MLflow Registry 回滚](#4-mlflow-registry-回滚)
- [5. K8s / KServe 回滚](#5-k8s--kserve-回滚)
- [6. 验证与监控](#6-验证与监控)
- [7. 阿里云专有云关联](#7-阿里云专有云关联)
- [Related](#related)

---

## 1. 回滚触发条件

- 线上指标回归（准确率、PPL、延迟、错误率）
- 用户反馈 bad case 激增
- A/B 测试中新版本显著差于 baseline
- 安全/合规问题（毒性、偏见、PII 泄露）
- 新版本与下游系统不兼容

---

## 2. 回滚前检查清单

| 检查项 | 说明 |
|--------|------|
| 上一版本是否可用 | 确认上一个 Production 版本的 artifact 和镜像存在 |
| 数据是否兼容 | 回滚后输入数据格式是否一致 |
| 依赖是否一致 | tokenizer、LoRA、quant config 是否一并回滚 |
| 回滚窗口 | 是否处于业务低峰期 |
| 通知方 | 业务方、SRE、数据科学家 |

---

## 3. 回滚流程

```text
Step 1: 确认异常版本和上一稳定版本
Step 2: 从 Model Registry 将上一版本标记为 Production
Step 3: 同步回滚模型 artifact、tokenizer、LoRA、quant config
Step 4: 更新 K8s ConfigMap / Secret / PVC 引用
Step 5: 执行 K8s rollout restart 或 KServe canary 切流
Step 6: 运行 smoke test 和健康检查
Step 7: 监控关键指标 5-15 分钟
Step 8: 记录 incident，通知相关方
```

---

## 4. MLflow Registry 回滚

```bash
# 查看版本历史
mlflow models list-versions -m <model-name>

# 将上一版本切到 Production
mlflow models transition-model-version-stage \
  --model-name <model-name> \
  --version <previous-version> \
  --stage Production

# 归档异常版本
mlflow models transition-model-version-stage \
  --model-name <model-name> \
  --version <bad-version> \
  --stage Archived
```

---

## 5. K8s / KServe 回滚

### 5.1 原生 Deployment

```bash
# 查看 rollout 历史
kubectl rollout history deployment/<name> -n <ns>

# 回滚到上一版本
kubectl rollout undo deployment/<name> -n <ns>

# 回滚到指定版本
kubectl rollout undo deployment/<name> -n <ns> --to-revision=2
```

### 5.2 KServe

```bash
# 把 canary 流量归零
kubectl patch inferenceservice <name> -n <ns> --type=merge -p '
{
  "spec": {
    "predictor": {
      "canaryTrafficPercent": 0
    }
  }
}'

# 或指定稳定版本的 storageUri
kubectl patch inferenceservice <name> -n <ns> --type=merge -p '
{
  "spec": {
    "predictor": {
      "sklearn": {
        "storageUri": "s3://models/<previous-version>"
      }
    }
  }
}'
```

---

## 6. 验证与监控

### 6.1 Smoke Test

```bash
# 发送测试请求
curl -X POST http://<service>/predict \
  -H "Content-Type: application/json" \
  -d '{"inputs": "测试输入"}'
```

### 6.2 监控指标

- 延迟（TTFT/TPOT for LLM）
- 错误率
- 预测分布（是否与上一稳定版本一致）
- GPU 利用率 / 显存

---

## 7. 阿里云专有云关联

在阿里云专有云环境中：
- **MLflow Registry** 可对接 RDS 私有化版 + 盘古 OSS
- **KServe / ACK** 作为推理服务底座
- **PAI-EAS** 提供模型版本管理，可直接在控制台回滚
- **ACR EE** 存储模型 serving 镜像

**建议**：
- 在 ASCM 中维护模型版本与发布记录
- 使用金丝雀发布降低回滚风险
- 关键模型配置使用 GitOps 管理

---

## Related

- [[_concepts/model-registry|Model Registry]]
- [[_concepts/mlflow|MLflow]]
- [[_concepts/kserve|KServe]]
- [[_concepts/model-rollback|Model Rollback]]
- [[10_Deployment_Inference/Model_Hot_Reload_and_Rollback_Runbook|LLM 模型热加载与回滚 Runbook]]
- [[11_MLOps_Pipeline/Experiment_Tracking/Model_Registry_and_Cards_Deep_Dive|模型注册与模型卡]]
