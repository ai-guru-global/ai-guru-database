---
title: "Karmada"
category: -concepts
tags: ["kubernetes", "k8s", "multi-cluster", "federation", "cloud-native", "alibaba-cloud"]
summary: "Karmada 是华为云捐赠给 CNCF 的多集群容器编排平台，原生兼容 Kubernetes API，支持跨多个 K8s 集群的应用分发、故障迁移和资源调度。"
created: 2026-06-26
updated: 2026-07-21
tier: archived
lifecycle: reviewed
aliases:
  - "Karmada 多集群"
relationships:
  - target: "概念/kubernetes"
    type: related_to
  - target: "概念/k3s"
    type: related_to
sources: []
name_zh: "多集群编排平台"
---

> **归档提示**: 此概念为通用云原生工具，与AI核心关联度较低。如需学习完整的K8s知识，请参考 CNCF 官方文档。

# Karmada

> 中文简称：多集群编排平台

> **一句话理解**: Karmada 是 K8s 的「多集群放大器」，让你用熟悉的 Deployment/Service 语法把应用同时分发到多个集群，并自动处理容灾和调度。

## 核心要点

- **K8s 原生 API 兼容**: 使用 PropagationPolicy、OverridePolicy 等 CRD 扩展多集群能力。
- **多集群资源模板**: `Work` 对象描述要在成员集群部署的资源。
- **调度策略**: 支持按权重、拓扑、污点、资源余量分发。
- **故障迁移**: 成员集群故障时自动将应用漂移到健康集群。
- **可对接任意 K8s 集群**: 不限云厂商，支持自建、ACK、EKS、GKE 等。

## 核心 CRD

| CRD | 作用 |
|-----|------|
| `PropagationPolicy` | 定义资源分发策略 |
| `OverridePolicy` | 按集群覆盖资源字段 |
| `ResourceBinding` | 绑定 Work 与目标集群 |
| `Work` | 在成员集群执行的实际资源 |

## 阿里云专有云关联

在阿里云专有云环境中，Karmada 可用于跨地域、跨可用区的 ACK 多集群统一编排，实现同城双活或异地灾备。工单中「多集群应用状态不一致」时，检查 PropagationPolicy、成员集群 kubeconfig、以及 etcd 网络连通性。

## Related

- [[概念/kubernetes|Kubernetes]] — 单集群编排
- [[概念/k3s|K3s]] — 轻量 K8s
- [[概念/volcano|Volcano]] — AI 任务调度

---

## 2026 Karmada 生态

| 特性 | 说明 | 状态 |
|------|------|------|
| **CNCF 孵化** | 华为云捐赠 | GA |
| **多集群调度** | 跨集群应用分发 | GA |
| **故障迁移** | 自动漂移 | GA |

## 架构组件

| 组件 | 职责 |
|------|------|
| **karmada-apiserver** | 多集群控制面 API Server |
| **karmada-scheduler** | 跨集群调度决策 |
| **karmada-controller-manager** | 管理 CRD 生命周期 |
| **karmada-agent** | 成员集群代理（Pull 模式） |
| **execution-space** | Work 对象执行命名空间 |

## 调度策略类型

| 策略 | 说明 | 适用场景 |
|------|------|----------|
| **Static Weight** | 按权重比例分发 | 多地域均匀部署 |
| **Dynamic Weight** | 按集群剩余资源动态分配 | 资源不均衡场景 |
| **Topology Spread** | 按区域/Zone 拓扑分散 | 高可用部署 |
| **Cluster Affinity** | 指定目标集群标签 | 定向部署 |

## 配置示例

```yaml
apiVersion: policy.karmada.io/v1alpha1
kind: PropagationPolicy
metadata:
  name: ai-inference-policy
spec:
  resourceSelectors:
    - apiVersion: apps/v1
      kind: Deployment
      name: inference-server
  placement:
    clusterAffinity:
      labelSelector:
        matchLabels:
          region: cn-east
    spreadConstraints:
      - spreadByField:
          field: region
    replicaScheduling:
      replicaDivisionPreference: Weighted
      replicaSchedulingType: Divided
      weightPreference:
        staticWeightList:
          - targetCluster:
              labelSelector:
                matchLabels:
                  zone: zone-a
            weight: 2
          - targetCluster:
              labelSelector:
                matchLabels:
                  zone: zone-b
            weight: 1
```

## 故障迁移机制

| 阶段 | 行为 |
|------|------|
| **检测** | 心跳超时判定集群不可达 |
| **驱逐** | 从故障集群移除 Work 对象 |
| **重调度** | 在健康集群重新创建资源 |
| **恢复** | 集群恢复后可选择回迁 |

## AI 多集群场景

| 场景 | 策略 | 说明 |
|------|------|------|
| **跨地域推理** | Static Weight | 就近部署推理服务 |
| **训练容灾** | Dynamic Weight | GPU 资源动态分配 |
| **模型灰度** | Cluster Affinity | 指定集群灰度发布 |
| **数据合规** | Topology Spread | 数据不出境 |

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| Work 未同步 | 成员集群不可达 | 检查 Agent 连接和 RBAC |
| 调度失败 | 资源不足 | 调整 Placement 策略 |
| 覆盖不生效 | OverridePolicy 优先级 | 检查 Policy 匹配规则 |
| 故障迁移慢 | 心跳超时过长 | 调整 `--cluster-status-update-frequency` |

## 生产最佳实践

1. **策略设计**：合理设计 PropagationPolicy 分发策略，避免过度分散
2. **网络连通**：确保成员集群与控制面网络连通，延迟 < 100ms
3. **故障演练**：定期测试故障迁移机制，验证 RTO/RPO
4. **监控告警**：关注多集群应用状态一致性，设置 Work 同步延迟告警
5. **版本管理**：控制面与成员集群 K8s 版本差不超过 2 个小版本

## 相关概念

- [[概念/kubernetes|Kubernetes]] — 单集群编排
- [[概念/k3s|K3s]] — 轻量 K8s
- [[概念/volcano|Volcano]] — AI 任务调度

## 常用命令

```bash
# 查看成员集群
kubectl get clusters

# 查看 PropagationPolicy
kubectl get propagationpolicies -A

# 查看 Work 对象
kubectl get works -A

# 查看 ResourceBinding
kubectl get resourcebindings -A

# 检查集群状态
kubectl describe cluster <cluster-name>
```

## 版本兼容性

| Karmada 版本 | K8s 版本 | 状态 |
|-------------|----------|------|
| 1.8+ | 1.26+ | GA |
| 1.9+ | 1.27+ | GA |
| 1.10+ | 1.28+ | GA |

## 总结

Karmada 是 K8s 多集群编排的事实标准，通过 PropagationPolicy 和 OverridePolicy 实现跨集群应用分发。特别适合跨地域 AI 推理部署和训练容灾场景。

---

> 💡 Karmada 是 K8s 多集群编排的事实标准，特别适合跨地域 AI 推理部署和训练容灾场景。

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
