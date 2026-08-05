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
name_zh: "模型版本回滚 Playbook"
---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](治理/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->

# 模型版本回滚 Playbook

> 中文简称：模型版本回滚 Playbook

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

- [[概念/model-registry|Model Registry]]
- [[概念/mlflow|MLflow]]
- [[概念/kserve|KServe]]
- [[概念/model-rollback|Model Rollback]]
- [[10_部署推理/01_部署基础/08_模型_Hot_Reload_and_回滚_操作手册|LLM 模型热加载与回滚 Runbook]]
- [[11_模型运维/04_实验追踪/09_模型_注册中心_and_Cards_深入分析|模型注册与模型卡]]

## MLOps核心流程对比

| 阶段 | 关键活动 | 工具链 | 质量指标 |
|------|----------|--------|----------|
| 数据管理 | 采集/清洗/标注/版本化 | DVC/LakeFS/Label Studio | 数据质量分/覆盖率 |
| 模型训练 | 实验管理/超参搜索/分布式训练 | MLflow/W&B/Ray | 收敛速度/最终精度 |
| 模型评估 | 离线评估/对比实验/偏差检测 | Great Expectations/Evidently | 准确率/公平性指标 |
| 模型部署 | 容器化/服务化/灰度发布 | K8s/Seldon/vLLM | 延迟/吞吐/可用性 |
| 模型监控 | 漂移检测/性能退化/告警 | Prometheus/Evidently/Grafana | 漂移分数/告警准确率 |
| 模型迭代 | A/B测试/自动重训/版本回滚 | Argo/Kubeflow/MLflow | 迭代周期/线上指标 |

## 运维关键指标体系

| 指标类别 | 具体指标 | 目标值 | 监控频率 |
|----------|----------|--------|----------|
| 可用性 | 服务可用率 | >99.9% | 实时 |
| 性能 | P99推理延迟 | <2s | 实时 |
| 质量 | 模型准确率 | >基线5% | 每日 |
| 漂移 | 数据/概念漂移分数 | <阈值 | 每小时 |
| 成本 | GPU利用率/每请求成本 | >80%利用率 | 每日 |
| 安全 | 对抗攻击检测率 | >95% | 实时 |

## 常见运维问题与解决方案

| 问题 | 根因 | 解决方案 | 预防措施 |
|------|------|----------|----------|
| 模型性能退化 | 数据分布漂移 | 触发重训/回滚 | 漂移监控+自动告警 |
| 推理延迟飙升 | 流量突增/资源不足 | 自动扩容+限流 | 容量规划+压测 |
| GPU OOM | 批处理过大/显存泄漏 | 减小batch/重启 | 显存监控+限制 |
| 数据管道中断 | 上游变更/格式错误 | Schema验证+告警 | 契约测试+版本化 |
| 模型版本混乱 | 缺乏版本管理 | MLflow统一注册 | 强制版本化流程 |

## 模型生命周期管理

| 阶段 | 状态 | 关键操作 | 负责人 |
|------|------|----------|--------|
| 开发 | Staging | 训练+评估+注册 | ML工程师 |
| 验证 | Validating | 集成测试+性能测试 | QA+ML工程师 |
| 发布 | Released | 灰度发布+监控 | MLOps工程师 |
| 运行 | Active | 监控+维护+告警 | SRE+MLOps |
| 退役 | Archived | 流量切换+归档 | MLOps工程师 |

## 自动化运维实践

| 实践 | 实现方式 | 收益 |
|------|----------|------|
| CI/CD for ML | 自动化训练-评估-部署流水线 | 迭代速度提升5x |
| 自动重训 | 漂移触发+定时触发 | 模型始终保持最新 |
| 自动扩缩容 | HPA基于QPS/GPU利用率 | 成本优化30-50% |
| 自动回滚 | 指标异常自动切回旧版本 | 故障恢复<5min |
| 自动告警 | 多级告警+智能降噪 | 减少误报80% |

## 术语速查表

| 术语 | 含义 |
|------|------|
| MLOps | 机器学习运维(ML+DevOps) |
| Model Drift | 模型性能随时间退化 |
| Data Drift | 输入数据分布变化 |
| Concept Drift | 目标关系变化 |
| Canary Release | 金丝雀发布(小流量验证) |
| Blue-Green | 蓝绿部署(双环境切换) |
| Feature Store | 特征存储(统一管理特征) |
| Model Registry | 模型注册中心(版本管理) |
| Serving | 模型服务化(在线推理) |
| Batch Inference | 批量推理(离线处理) |

## 检查清单

- [ ] 模型版本管理和注册中心已建立
- [ ] 自动化CI/CD流水线已配置
- [ ] 模型监控和漂移检测已部署
- [ ] 自动扩缩容策略已配置
- [ ] 告警规则和响应流程已定义
- [ ] 回滚机制已测试验证
- [ ] 成本监控和优化持续进行
- [ ] 安全审计和合规检查已覆盖
