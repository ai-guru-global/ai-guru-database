---
title: "MLOps on K8s 排查速查表"
category: 11-mlops-pipeline
subcategory: troubleshooting
tags: ["mlops", "kubernetes", "k8s", "troubleshooting", "cheat-sheet", "mlflow", "alibaba-cloud"]
summary: "面向 K8s 上 MLOps 组件的排查速查表：MLflow、Airflow、KServe、PostgreSQL、Artifact Store 常见问题与命令。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
---

# MLOps on K8s 排查速查表

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

- [[11_MLOps_Pipeline/Troubleshooting/MLflow_Tracking_Server_Unreachable|MLflow Tracking Server 不可达]]
- [[11_MLOps_Pipeline/Troubleshooting/Data_Validation_Failure_Runbook|数据验证失败 Runbook]]
- [[11_MLOps_Pipeline/Troubleshooting/Model_Version_Rollback_Playbook|模型版本回滚 Runbook]]
