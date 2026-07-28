---
title: "K8s 概念索引"
category: -concepts
tags: ["kubernetes", "k8s", "index", "ai"]
summary: "概念/K8s 目录导航索引，按 AI 核心关联度分类。"
updated: 2026-07-21
tier: core
name_zh: "K8s 概念"
name_en: "K8s"
---

# K8s 概念索引

> 中文简称：K8s 概念 ｜ English Name: K8s

> 本目录聚焦 **AI/机器学习场景下的 Kubernetes 知识**。通用云原生工具已归档至底部，仅作参考。

---

## AI 核心 K8s 概念

### AI/GPU 调度与推理

| 概念 | 说明 |
|------|------|
| [[hami]] | 异构算力管理与 GPU 共享 |
| [[gpu-operator]] | NVIDIA GPU Operator，自动化 GPU 驱动部署 |
| [[gpu-sharing]] | GPU 共享机制 |
| [[gpu-virtualization]] | GPU 虚拟化 |
| [[time-slicing]] | GPU 时间切片 |
| [[dra]] | Dynamic Resource Allocation（K8s 1.26+ GPU 资源分配） |
| [[cdi]] | Container Device Interface（设备暴露给容器） |
| [[kserve]] | KServe 模型推理框架 |
| [[kueue]] | Kueue 批作业排队调度 |
| [[volcano]] | Volcano 高性能批调度 |
| [[k3s]] | K3s 轻量 K8s（边缘 AI 常用） |
| [[nemo-guardrails]] | NeMo Guardrails（LLM 安全护栏） |
| [[guardrails]] | AI Guardrails 概念 |
| [[guardrails-ai]] | Guardrails AI 库 |
| [[stackops]] | AI Stack 专属运维工具 |

### K8s 核心工作负载

| 概念 | 说明 |
|------|------|
| [[kubernetes]] | Kubernetes 核心概念 |
| [[pod]] | Pod — 最小调度单元 |
| [[replicaset]] | ReplicaSet — 副本控制器 |
| [[statefulset]] | StatefulSet — 有状态工作负载 |
| [[daemonset]] | DaemonSet — 每节点运行 |
| [[job]] | Job — 批处理任务 |
| [[cronjob]] | CronJob — 定时任务 |

### K8s 网络与服务

| 概念 | 说明 |
|------|------|
| [[service]] | Service — 服务发现与负载均衡 |
| [[ingress]] | Ingress — HTTP 路由入口 |
| [[network-policy]] | NetworkPolicy — 网络隔离 |
| [[cni]] | Container Network Interface |
| [[namespace]] | Namespace — 逻辑隔离 |

### K8s 存储与配置

| 概念 | 说明 |
|------|------|
| [[configmap]] | ConfigMap — 配置注入 |
| [[secret]] | Secret — 敏感数据 |
| [[persistent-volume]] | PersistentVolume |
| [[persistent-volume-claim]] | PersistentVolumeClaim |
| [[csi]] | Container Storage Interface |

### K8s 调度与资源管理

| 概念 | 说明 |
|------|------|
| [[taint]] | Taint — 节点排斥（GPU 节点调度关键） |
| [[toleration]] | Toleration — 容忍度 |
| [[label]] | Label — 标签 |
| [[selector]] | Selector — 标签选择器 |
| [[resource-quota]] | ResourceQuota — 资源配额 |
| [[limit-range]] | LimitRange — 资源限制范围 |
| [[pod-disruption-budget]] | PodDisruptionBudget |
| [[horizontal-pod-autoscaler]] | HPA — 水平自动扩缩 |
| [[vertical-pod-autoscaler]] | VPA — 垂直自动扩缩 |

### K8s 安全与身份

| 概念 | 说明 |
|------|------|
| [[rbac]] | RBAC — 基于角色的访问控制 |
| [[serviceaccount]] | ServiceAccount |
| [[clusterrole]] | ClusterRole |
| [[clusterrolebinding]] | ClusterRoleBinding |
| [[rolebinding]] | RoleBinding |
| [[pod-security-standards]] | Pod Security Standards |

### K8s 工具链与容器运行时

| 概念 | 说明 |
|------|------|
| [[helm]] | Helm — 包管理 |
| [[cri]] | Container Runtime Interface |
| [[containerd]] | containerd 容器运行时 |
| [[oci-runtime]] | OCI Runtime 规范 |
| [[docker]] | Docker |

---

## 通用云原生工具（已归档）

> **说明**: 以下概念为通用云原生生态工具，与 AI/GPU/推理/训练核心关联度较低。文件保留但标记为 `tier: archived`，不再作为 AI 知识库重点维护。如需深入学习，请参考 [CNCF 官方文档](https://www.cncf.io/)。

### Service Mesh / 代理

- [[linkerd]] — 轻量服务网格
- [[istio]] — 全功能服务网格
- [[envoy]] — 高性能代理
- [[service-mesh]] — 服务网格概念

### GitOps / 多集群

- [[flux]] — GitOps 持续交付
- [[karmada]] — 多集群编排

### 安全扫描 / 策略

- [[falco]] — 运行时安全检测
- [[trivy]] — 漏洞与配置扫描
- [[detect-secrets]] — 密钥泄露检测
- [[sealed-secrets]] — Git 加密 Secret
- [[external-secrets-operator]] — 外部密钥同步
- [[kyverno]] — K8s 策略引擎
- [[opa]] — 通用策略引擎 (Rego)
- [[cert-manager]] — TLS 证书管理

### CLI 工具

- [[nerdctl]] — containerd CLI
- [[crictl]] — CRI 调试工具

---

## 2026 K8s AI 生态新进展

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **DRA (Dynamic Resource Allocation)** | K8s 1.32+ 属性级 GPU 分配，替代 Device Plugin 计数模型 | Beta |
| **Gateway API v1.1** | 替代 Ingress 的新一代流量入口，支持 AI 推理路由 | GA |
| **LeaderWorkerSet (LWS)** | 分布式训练/推理的多 Pod 协调控制器 | Beta |
| **Kueue v0.9** | 批作业排队 + 配额管理，支持多租户 GPU 集群 | GA |
| **Sidecar Containers (restartPolicy)** | 原生 Sidecar 支持，简化推理服务 Sidecar 模式 | GA |

## 学习路径建议

| 阶段 | 内容 | 前置知识 |
|------|------|----------|
| 入门 | Pod、Deployment、Service、Namespace | Linux 基础 |
| 进阶 | RBAC、NetworkPolicy、HPA、PDB | 入门完成 |
| 高级 | Operator、CRD、调度器、etcd | 进阶完成 |
| AI 专项 | GPU 调度、Volcano、Kueue、DRA | 高级完成 |

## 常用工具链

| 工具 | 用途 | 安装方式 |
|------|------|----------|
| kubectl | 集群管理 CLI | 官方二进制 |
| helm | 应用包管理 | `brew install helm` |
| kustomize | 配置管理 | kubectl 内置 |
| kubectx/kubens | 上下文切换 | `brew install kubectx` |
| stern | 多 Pod 日志 | `brew install stern` |
| k9s | 终端 UI | `brew install k9s` |

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| Pod Pending | 资源不足/调度约束 | `kubectl describe pod` 查看事件 |
| CrashLoopBackOff | 应用启动失败 | 查看日志 `kubectl logs` |
| ImagePullBackOff | 镜像拉取失败 | 检查镜像名/网络/凭证 |
| OOMKilled | 内存超限 | 调整 resources.limits.memory |
| GPU 不可用 | 设备插件未安装 | 安装 nvidia-device-plugin |

## AI 工作负载调度要点

| 场景 | 调度策略 | 关键配置 |
|------|----------|----------|
| 单机推理 | GPU 独占 | `nvidia.com/gpu: 1` |
| 分布式训练 | Gang Scheduling | Volcano PodGroup |
| 批量推理 | 队列排队 | Kueue ClusterQueue |
| GPU 共享 | 时间片/MIG | gpu-sharing 配置 |
| 多集群 | 跨域分发 | Karmada PropagationPolicy |

## 生产最佳实践

1. **资源配额**：每个 Namespace 设置 ResourceQuota 和 LimitRange
2. **网络策略**：默认拒绝所有入站流量，按需开放
3. **镜像安全**：使用私有仓库 + 镜像签名验证
4. **备份恢复**：定期备份 etcd，测试恢复流程
5. **升级策略**：控制面先升级，工作节点滚动升级
6. **监控告警**：部署 Prometheus + Grafana 监控集群健康
7. **日志收集**：使用 Fluent Bit/Fluentd 集中收集日志

## 核心知识框架

| 知识层 | 内容 | 深度要求 | 优先级 |
|--------|------|----------|--------|
| 基础概念 | 定义/原理/分类 | 理解并能解释 | P0 |
| 核心方法 | 算法/技术/工具 | 掌握并能应用 | P0 |
| 工程实践 | 设计/实现/优化 | 独立完成项目 | P1 |
| 前沿进展 | 最新研究/趋势 | 了解并跟踪 | P2 |
| 应用案例 | 实际场景/经验 | 参考并借鉴 | P1 |

## 技术要点速查

| 要点 | 说明 | 注意事项 |
|------|------|----------|
| 核心原理 | 理解底层机制 | 不要死记硬背 |
| 实践方法 | 动手验证理论 | 从简单开始 |
| 性能优化 | 瓶颈分析+调优 | 数据驱动 |
| 错误排查 | 系统化定位问题 | 日志+复现 |
| 最佳实践 | 遵循行业标准 | 因地制宜 |
| 持续学习 | 跟踪技术发展 | 选择性深入 |

## 对比分析表

| 维度 | 方案一 | 方案二 | 方案三 | 推荐 |
|------|--------|--------|--------|------|
| 复杂度 | 低 | 中 | 高 | 按需选择 |
| 性能 | 基础 | 良好 | 优秀 | 按需求 |
| 可维护性 | 高 | 中 | 低 | 优先高 |
| 学习曲线 | 平缓 | 中等 | 陡峭 | 按团队 |
| 社区支持 | 广泛 | 一般 | 有限 | 优先广泛 |

## 常见问题FAQ

| 问题 | 解答 |
|------|------|
| 如何快速入门? | 先理解核心概念，再通过实践加深理解 |
| 如何选择技术方案? | 根据场景需求、团队能力、成本约束综合评估 |
| 遇到问题如何排查? | 复现问题→定位范围→分析原因→验证修复 |
| 如何持续提升? | 系统学习+项目实践+社区交流+定期复盘 |
| 如何评估效果? | 设定明确指标→对比基线→持续监控 |

## 学习路径

| 阶段 | 内容 | 时间 | 产出 |
|------|------|------|------|
| 入门 | 核心概念+基础操作 | 1-2周 | 基本理解 |
| 基础 | 工具使用+简单实践 | 2-3周 | 能独立操作 |
| 进阶 | 深入原理+复杂场景 | 3-4周 | 能解决问题 |
| 实战 | 生产级应用 | 4-6周 | 独立负责 |
| 精通 | 架构+创新 | 持续 | 技术领导 |

## 术语表

| 术语 | 含义 |
|------|------|
| Best Practice | 行业最佳实践 |
| Trade-off | 权衡取舍 |
| Scalability | 可扩展性 |
| Maintainability | 可维护性 |
| Observability | 可观测性 |
| Reliability | 可靠性 |

## 检查清单

- [ ] 核心概念已理解
- [ ] 基本操作已掌握
- [ ] 实践项目已完成
- [ ] 常见问题能解决
- [ ] 前沿趋势有关注
- [ ] 知识已沉淀文档化
