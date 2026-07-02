---
title: "部署 Runbook 模板"
category: 93-templates
tags: ["templates", "runbook", "deployment", "operations", "production"]
summary: "标准化的 ML 模型部署 Runbook 模板——确保每次部署有据可依、有迹可查、可快速回滚。"
created: 2026-07-02
updated: 2026-07-02
tier: core
aliases:
  - "Deployment Runbook Template"
  - "ML Deployment Checklist"
---

# 部署 Runbook 模板 (Deployment Runbook Template)

> 标准化的 ML 模型部署 Runbook 模板——确保每次部署有据可依、有迹可查、可快速回滚。

---

## 模板

```markdown
# 部署 Runbook: [模型/服务名称]

## 基本信息

| 字段 | 内容 |
|------|------|
| 服务名称 | [service-name] |
| 部署版本 | [v1.2.0] |
| 部署日期 | YYYY-MM-DD |
| 负责人 | [姓名] |
| 审批人 | [姓名] |
| 回滚版本 | [v1.1.0] |

## 1. 部署前检查

### 代码与模型

- [ ] 代码已通过 Code Review
- [ ] 单元测试全部通过
- [ ] 集成测试全部通过
- [ ] 模型评估报告已审批
- [ ] 模型已注册到 Model Registry
- [ ] Docker 镜像已构建并推送

### 基础设施

- [ ] 目标环境资源充足（CPU/内存/GPU）
- [ ] 配置文件已更新
- [ ] 环境变量已设置
- [ ] 密钥/证书已更新
- [ ] 数据库迁移已完成（如需要）

### 通知

- [ ] 已通知相关团队（产品、运维、客服）
- [ ] 维护窗口已公告（如需要）

## 2. 部署步骤

### Step 1: 备份当前版本

```bash
# 记录当前版本
kubectl get deployment -o yaml > backup/deployment-v1.1.0.yaml
# 记录当前模型版本
curl http://model-registry/api/models/my-model/production
```

### Step 2: 部署金丝雀 (Canary)

```bash
# 部署新版本到 10% 流量
kubectl apply -f k8s/canary-deployment.yaml
# 验证 Pod 状态
kubectl get pods -l app=my-service,version=v1.2.0
```

### Step 3: 金丝雀监控（观察 15 分钟）

检查指标：
- [ ] 错误率 < 0.1%
- [ ] P99 延迟 < 200ms
- [ ] GPU 利用率正常
- [ ] 无异常日志

```bash
# 查看金丝雀指标
curl http://grafana/d/canary-dashboard
```

### Step 4: 全量发布

```bash
# 逐步扩大流量
kubectl apply -f k8s/full-deployment.yaml
# 验证所有 Pod 就绪
kubectl rollout status deployment/my-service
```

### Step 5: 部署后验证

```bash
# 健康检查
curl http://my-service/health
# 冒烟测试
python scripts/smoke_test.py --env production
# 检查推理结果
curl -X POST http://my-service/v1/predict \
  -H "Content-Type: application/json" \
  -d '{"input": "test"}'
```

## 3. 监控与告警

### 关键指标

| 指标 | 阈值 | 告警方式 |
|------|------|---------|
| 错误率 | > 1% | PagerDuty |
| P99延迟 | > 500ms | Slack |
| GPU显存 | > 90% | Slack |
| 请求队列 | > 100 | PagerDuty |

### 监控仪表盘

- [Grafana 仪表盘 URL]
- [业务指标仪表盘 URL]

## 4. 回滚计划

### 触发条件

- 错误率 > 5% 持续 5 分钟
- P99 延迟 > 2 秒 持续 5 分钟
- 业务指标异常下降 > 10%
- 收到用户严重投诉

### 回滚步骤

```bash
# 1. 一键回滚
kubectl rollout undo deployment/my-service

# 2. 验证回滚
kubectl rollout status deployment/my-service

# 3. 通知团队
# 发送 Slack 通知
```

## 5. 部署记录

| 时间 | 操作 | 结果 | 备注 |
|------|------|------|------|
| HH:MM | 开始部署 | - | - |
| HH:MM | 金丝雀部署 | 成功 | Pod Running |
| HH:MM | 金丝雀监控 | 通过 | 指标正常 |
| HH:MM | 全量发布 | 成功 | Rollout Complete |
| HH:MM | 部署验证 | 通过 | 冒烟测试OK |

## 6. 部署后事项

- [ ] 更新部署日志
- [ ] 通知相关团队部署完成
- [ ] 更新文档（如有变更）
- [ ] 关闭部署工单
- [ ] 安排回顾会议（如需要）
```

---

## 相关资源

- [[Deployment_Strategies]]: 部署策略详解
- [[Model_Hot_Reload_and_Rollback_Runbook]]: 热更新与回滚
- [[AI_Incident_Response_Playbook]]: 故障响应手册

---

*Last updated: 2026-07-02*
