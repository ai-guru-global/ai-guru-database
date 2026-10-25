---
title: "MLOps on K8s 排查速查表"
category: 11-mlops-pipeline
subcategory: troubleshooting
tags: ["mlops", "kubernetes", "k8s", "troubleshooting", "cheat-sheet", "mlflow", "alibaba-cloud"]
summary: "面向 K8s 上 MLOps 组件的排查速查表：MLflow、Airflow、KServe、PostgreSQL、Artifact Store 常见问题与命令。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
sources: []
name_zh: "MLOps on K8s 排查速查表"
---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](治理/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->

# MLOps on K8s 排查速查表

> 中文简称：MLOps on K8s 排查速查表

> **使用方式**: 按组件定位问题，按命令顺序排查。

---

## 1. MLflow Tracking Server

```bash
# 检查 Pod 状态
kubectl get pods -n mlops -l app=mlflow

# 查看日志
kubectl logs -n mlops -l app=mlflow --tail=200

# 测试健康检查
kubectl port-forward svc/mlflow 5000:5000 -n mlops
curl http://localhost:5000/health

# 测试数据库连接
kubectl exec -it deploy/mlflow -n mlops -- python -c "import sqlalchemy; ..."

# 检查 Secret
kubectl get secret mlflow-db-secret -n mlops -o yaml
```

| 问题 | 可能原因 |
|------|---------|
| 无法连接 | DB 不可用、Secret 错误、网络策略 |
| 写入慢 | Artifact Store 慢、DB 锁竞争 |
| 503 | 副本数不足、后端存储满 |

---

## 2. Airflow Scheduler/Webserver

```bash
# 查看 Airflow Pod
kubectl get pods -n airflow

# 查看 Scheduler 日志
kubectl logs -n airflow deploy/airflow-scheduler --tail=200

# 查看 DAG 解析错误
kubectl exec -it deploy/airflow-scheduler -n airflow -- airflow dags report

# 触发 DAG 测试
kubectl exec -it deploy/airflow-scheduler -n airflow -- airflow dags trigger test_dag
```

---

## 3. KServe InferenceService

```bash
# 查看 InferenceService 状态
kubectl get inferenceservice -n serving

# 查看 Predictor Pod
kubectl get pods -n serving -l app=isvc.<name>-predictor

# 查看日志
kubectl logs -n serving -l app=isvc.<name>-predictor

# 测试推理
kubectl port-forward svc/<name>-predictor 8080:80 -n serving
curl http://localhost:8080/v1/models/<name>:predict
```

---

## 4. Artifact Store（OSS/S3）

```bash
# 测试 OSS 连通性
kubectl exec -it deploy/mlflow -n mlops -- python -c \
  "import oss2; auth=oss2.Auth('ak','sk'); bucket=oss2.Bucket(auth,'oss-endpoint','bucket'); print(bucket.list_objects())"

# 检查 PVC
kubectl get pvc -n mlops
```

---

## 5. 数据库 PostgreSQL

```bash
# 查看 PostgreSQL 状态
kubectl get pods -n mlops -l app=postgres

# 查看连接数
kubectl exec -it deploy/postgres -n mlops -- psql -U mlflow -c "SELECT count(*) FROM pg_stat_activity;"

# 查看慢查询
kubectl exec -it deploy/postgres -n mlops -- psql -U mlflow -c "SELECT * FROM pg_stat_statements ORDER BY mean_exec_time DESC LIMIT 10;"
```

---

## Related

- [[11_模型运维/12_故障排查/MLflow_Tracking_Server_Unreachable|MLflow Tracking Server 不可达]]
- [[11_模型运维/12_故障排查/Data_Validation_Failure_Runbook|数据验证失败 Runbook]]
- [[11_模型运维/12_故障排查/Model_Version_Rollback_Playbook|模型版本回滚 Runbook]]

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
