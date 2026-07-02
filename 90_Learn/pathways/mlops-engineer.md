---
title: "MLOps 工程师学习路径"
category: 90-learn-pathways
tags: ["learning", "mlops", "career", "roadmap", "devops", "infrastructure"]
summary: "MLOps 工程师负责让 ML 模型在生产环境中稳定、高效、可维护地运行——是连接数据科学与软件工程的桥梁。"
created: 2026-07-02
updated: 2026-07-02
tier: core
aliases:
  - "MLOps Engineer Path"
  - "MLOps Learning Path"
---

# MLOps 工程师学习路径 (MLOps Engineer Learning Path)

> MLOps 工程师负责让 ML 模型在生产环境中稳定、高效、可维护地运行——是连接数据科学与软件工程的桥梁。

---

## 1. 角色定位

| 维度 | 说明 |
|------|------|
| 核心职责 | 构建和维护 ML 平台、CI/CD 流水线、模型监控、基础设施 |
| 技能重心 | DevOps + ML 基础 + 云原生 |
| 与数据科学家区别 | DS 关注模型开发，MLOps 关注模型运维 |
| 典型产出 | ML 平台、自动化流水线、监控仪表盘、Runbook |

---

## 2. 技能路线图

### 阶段一：基础设施基础（2-3个月）

| 主题 | 核心内容 | 推荐资源 |
|------|---------|---------|
| Linux & Shell | 系统管理、脚本编写 | 实战练习 |
| Docker | 容器化、镜像构建 | [[Docker_Containerization_for_AI]] |
| Kubernetes | Pod、Service、Deployment | [[Kubernetes_Core_Components_Deep_Dive]] |
| 云平台 | AWS/Azure/GCP 基础 | [[12_Architecture_Infrastructure/Cloud_Providers/README]] |
| Git & CI/CD | GitHub Actions, GitLab CI | [[CI_CD_Pipeline_AI_2026]] |

### 阶段二：ML 平台组件（3-4个月）

| 主题 | 核心内容 | 推荐资源 |
|------|---------|---------|
| 实验跟踪 | MLflow, W&B, ClearML | [[Experiment_Tracking_Deep_Dive]] |
| 模型注册 | 版本管理、元数据 | [[Model_Registry_and_Cards_Deep_Dive]] |
| 特征存储 | Feast, Tecton | [[Feature_Store_Deep_Dive]] |
| 数据版本 | DVC, LakeFS | [[Data_Versioning_DVC_LakeFS]] |
| 流水线编排 | Kubeflow, Prefect | [[Kubeflow_Deep_Dive]] |

### 阶段三：模型部署与服务（2-3个月）

| 主题 | 核心内容 | 推荐资源 |
|------|---------|---------|
| 推理引擎 | vLLM, TGI, TensorRT | [[LLM_Inference_Engine_Selection_Guide]] |
| 模型服务 | KServe, BentoML | [[Model_Serving_Patterns]] |
| 金丝雀部署 | 渐进式发布 | [[Deployment_Strategies]] |
| A/B 流量分配 | 流量路由、指标收集 | 实战项目 |

### 阶段四：监控与运维（2-3个月）

| 主题 | 核心内容 | 推荐资源 |
|------|---------|---------|
| 可观测性 | Prometheus, Grafana | [[Prometheus_Grafana_Deep_Dive]] |
| 模型监控 | 漂移检测、质量告警 | [[Model_Monitoring_and_Drift_Detection_2026]] |
| SRE 实践 | SLO、Error Budget | [[SRE_for_AI_Systems]] |
| 故障响应 | Runbook、Post-mortem | [[AI_Incident_Response_Playbook]] |
| 成本优化 | GPU 利用率、FinOps | [[FinOps_for_AI]] |

---

## 3. 项目实战建议

| 项目 | 技能覆盖 | 难度 |
|------|---------|------|
| 搭建 MLflow 实验平台 | 实验跟踪、模型注册 | ⭐⭐ |
| 端到端 CI/CD 流水线 | Docker、K8s、自动化测试 | ⭐⭐⭐ |
| 模型监控告警系统 | Prometheus、漂移检测 | ⭐⭐⭐ |
| 多模型推理网关 | 负载均衡、路由、缓存 | ⭐⭐⭐⭐ |
| 完整 ML 平台 | 全栈 MLOps | ⭐⭐⭐⭐⭐ |

---

## 4. 认证推荐

| 认证 | 提供方 | 价值 |
|------|--------|------|
| AWS Machine Learning Specialty | AWS | 云厂商认可 |
| Google Professional ML Engineer | GCP | 云厂商认可 |
| Kubeflow Certification | CNCF | K8s 生态认可 |
| CKA / CKAD | CNCF | K8s 基础能力 |

---

## 5. 相关路径

- [[ai-engineer]]: 偏应用开发
- [[ml-practitioner]]: 偏模型训练
- [[cloud-ops-engineer]]: 偏基础设施

---

*Last updated: 2026-07-02*
