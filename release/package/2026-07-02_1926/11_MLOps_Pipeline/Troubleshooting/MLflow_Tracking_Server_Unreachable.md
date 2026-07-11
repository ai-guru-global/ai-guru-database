---
title: "MLflow Tracking Server 不可达排障"
category: 11-mlops-pipeline
subcategory: troubleshooting
tags: ["mlflow", "mlops", "experiment-tracking", "kubernetes", "k8s", "troubleshooting", "alibaba-cloud"]
summary: "面向 K8s 上 MLflow Tracking Server 的不可达/无响应排障：从客户端 URI 到 K8s Service、后端数据库、Artifact Store 分层定位。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
sources: []
---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](../../_meta/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->

# MLflow Tracking Server 不可达排障

> **一句话理解**: MLflow Tracking 连不上，通常不是 MLflow 本身坏了，而是「客户端配置的地址到服务端之间的某一层断了」——本手册按链路逐层排查。

## 目录

- [1. 总线：链路分层](#1-总线链路分层)
- [2. 客户端配置检查](#2-客户端配置检查)
- [3. K8s Service / Endpoint 检查](#3-k8s-service--endpoint-检查)
- [4. Tracking Server Pod 检查](#4-tracking-server-pod-检查)
- [5. 后端数据库检查](#5-后端数据库检查)
- [6. Artifact Store 检查](#6-artifact-store-检查)
- [7. 网络 / TLS / Auth 检查](#7-网络--tls--auth-检查)
- [8. 阿里云专有云关联](#8-阿里云专有云关联)
- [Related](#related)

---

## 1. 总线：链路分层

```text
Client → MLFLOW_TRACKING_URI → K8s Service → Tracking Server Pod → Backend DB
                                                    ↓
                                              Artifact Store (S3/OSS/MinIO)
```

---

## 2. 客户端配置检查

```bash
# 在训练 Pod 内查看环境变量
kubectl exec -it <pod> -n <ns> -- env | grep MLFLOW

# 关键变量
MLFLOW_TRACKING_URI=http://mlflow-tracking:5000
MLFLOW_TRACKING_USERNAME=...
MLFLOW_TRACKING_PASSWORD=...
```

**常见问题**：
- URI 拼错或使用了旧地址
- 未配置认证信息
- 使用了 `http` 但实际需要 `https`

---

## 3. K8s Service / Endpoint 检查

```bash
# 看 Service
kubectl get svc mlflow-tracking -n <ns>

# 看 Endpoint 是否有 Pod
kubectl get endpoints mlflow-tracking -n <ns>

# 在客户端 Pod 测试连通
kubectl exec -it <client-pod> -n <ns> -- curl -v http://mlflow-tracking:5000/
```

**常见问题**：
- Service Label Selector 错误，Endpoint 为空
- Pod 未 Ready（readiness probe 失败）
- NetworkPolicy 拦截了 5000 端口

---

## 4. Tracking Server Pod 检查

```bash
kubectl get pods -n <ns> -l app=mlflow-tracking
kubectl describe pod <pod> -n <ns>
kubectl logs <pod> -n <ns> --tail=200
```

**常见问题**：
- Pod OOMKilled（元数据过多或并发写入高）
- 启动失败：数据库连接参数错误
- 健康检查失败：Gunicorn worker 全部 busy

---

## 5. 后端数据库检查

MLflow Tracking 后端通常用 PostgreSQL/MySQL/SQLite。

```bash
# 测试数据库连通
kubectl exec -it <mlflow-pod> -n <ns> -- pg_isready -h <db-host> -p 5432

# 看数据库连接池
kubectl logs <mlflow-pod> -n <ns> | grep -i "connection"
```

**常见问题**：
- 数据库密码过期
- 连接数耗尽
- 数据库磁盘满

---

## 6. Artifact Store 检查

Artifact Store 通常用 S3 / OSS / MinIO。

```bash
# 检查 MLflow 是否能写入 artifact
kubectl exec -it <mlflow-pod> -n <ns> -- python -c "
import mlflow
mlflow.set_tracking_uri('http://localhost:5000')
with mlflow.start_run():
    mlflow.log_artifact('/etc/hostname')
"
```

**常见问题**：
- AccessKey / SecretKey 过期
- Bucket 不存在或权限不足
- 网络到 OSS/S3 不通

---

## 7. 网络 / TLS / Auth 检查

### 7.1 TLS

```bash
# 如果服务端是 HTTPS，客户端必须配 https
curl -v https://mlflow-tracking:5000/
```

### 7.2 Auth

```bash
# 测试 basic auth
curl -u user:pass http://mlflow-tracking:5000/api/2.0/mlflow/experiments/list
```

---

## 8. 阿里云专有云关联

在阿里云专有云环境中：
- MLflow Tracking Server 通常部署在 ACK 集群内
- 后端数据库使用 RDS 私有化版或自建 PostgreSQL
- Artifact Store 使用盘古 OSS 或 MinIO
- 认证可对接 LDAP/OIDC

**排查入口**：
- ASCM 查看 RDS/OSS 告警
- 天基 OpsBox 登录节点测试网络
- 检查 ACK Service/Ingress 配置

---

## Related

- [[_concepts/mlflow|MLflow]]
- [[_concepts/experiment-tracking|Experiment Tracking]]
- [[_concepts/model-registry|Model Registry]]
- [[MLOps/Experiment_Tracking/MLflow_Deep_Dive|MLflow 深度解析]]
- [[运维/Kubernetes_Troubleshooting_Playbook|Kubernetes 运维排障 Playbook]]
