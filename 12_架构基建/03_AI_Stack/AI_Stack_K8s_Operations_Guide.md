---
title: "AI Stack K8s 编排指南"
category: "12-architecture-infrastructure"
tags: ["ai-stack", "kubernetes", "kubectl", "helm", "k8s", "orchestration"]
summary: "> **一句话理解**: AI Stack 内部通过 K8s 编排工作负载，kubectl 用于集群管理排障，helm 用于安装 GPUStack 等 K8s 包；日常优先通过平台层操作，不直接修改集群。"
created: "2026-06-16"
updated: "2026-06-16"
tier: supporting
aliases:
  - "Ai Stack K8s Operations Guide"
  - "AI Stack K8s Operations Guide"
  - AI_Stack_K8s_Operations_Guide
sources: []

name_zh: "AI Stack K8s 编排指南"
---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](治理/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->
# AI Stack K8s 编排指南

> 中文简称：AI Stack K8s 编排指南

> **一句话理解**: AI Stack 内部通过 K8s 编排工作负载，`kubectl` 用于集群管理排障，`helm` 用于安装 GPUStack 等 K8s 包；日常优先通过平台层操作，不直接修改集群。

---

## 1. 工具选型矩阵

| 工具 | 用途 | 推荐场景 | 风险等级 |
|------|------|----------|----------|
| **kubectl** | K8s 集群管理 | 查看 Pod、日志、事件、节点资源 | 中（只读安全，写操作需谨慎） |
| **helm** | K8s 包管理 | 安装/升级/回滚 GPUStack、Prometheus 等 chart | 高（影响集群组件） |

---

## 2. 常用命令

### 2.1 kubectl

```bash
# 查看节点与 GPU 资源
kubectl get nodes -o wide
kubectl describe node <node-name>

# 查看 Pod 状态
kubectl get pods -n <namespace>
kubectl get pods -n <namespace> -o wide

# 查看 Pod 事件与详情
kubectl describe pod <pod-name> -n <namespace>

# 查看日志
kubectl logs <pod-name> -n <namespace>
kubectl logs <pod-name> -n <namespace> --tail=100 -f

# 多容器 Pod 查看指定容器日志
kubectl logs <pod-name> -c <container-name> -n <namespace>

# 进入容器排查
kubectl exec -it <pod-name> -n <namespace> -- /bin/bash

# 查看 GPU 调度情况（需安装相关 CRD）
kubectl get pods -n <namespace> -o custom-columns=\
  "NAME:.metadata.name,GPU:.spec.containers[*].resources.limits.nvidia\.com/gpu"

# 导出 Pod YAML 用于审计
kubectl get pod <pod-name> -n <namespace> -o yaml > /tmp/pod.yaml
```

### 2.2 helm

```bash
# 添加 GPUStack chart 仓库
helm repo add gpustack https://gpustack.ai/helm-charts
helm repo update

# 安装 GPUStack
helm install gpuStack gpustack/gpustack -n gpustack --create-namespace

# 查看已安装 release
helm list -A

# 升级
helm upgrade gpuStack gpustack/gpustack -n gpustack

# 回滚
helm rollback gpuStack <revision> -n gpustack

# 查看 chart 值
helm show values gpustack/gpustack
```

---

## 3. 生产环境 Checklist

- [ ] 集群访问权限按最小权限原则分配，生产环境避免使用 `cluster-admin` 日常操作。
- [ ] 所有变更通过 GitOps / Helm / ArgoCD 等版本化方式管理，禁止直接 `kubectl edit` 生产负载。
- [ ] 命名空间按团队/环境隔离，配置 ResourceQuota 和 LimitRange。
- [ ] GPU 节点打标签并配置 node selector/affinity/taint-toleration，避免 CPU 负载抢占 GPU 节点。
- [ ] 安装并配置 GPU device plugin（NVIDIA Device Plugin / 国产对应插件）和 GPU 监控 DaemonSet。
- [ ] 关键 AI 服务配置 PodDisruptionBudget、HPA/VPA、亲和性反亲和性，保证高可用。
- [ ] 日志、指标、事件统一接入可观测平台（如 Prometheus + Grafana + Loki）。
- [ ] Helm release 升级前在测试环境验证 values 变更，保留历史 revision 以便回滚。

---

## 4. 故障排查速查

| 现象 | 排查命令 | 常见原因 |
|------|----------|----------|
| Pod 处于 Pending | `kubectl describe pod` | 资源不足、GPU 未调度、镜像拉取中 |
| Pod 处于 ImagePullBackOff | `kubectl describe pod` / `crictl images` | 镜像不存在、仓库鉴权失败、网络不通 |
| Pod CrashLoopBackOff | `kubectl logs --previous` | 启动命令错误、依赖缺失、OOMKilled |
| GPU 未调度 | `kubectl describe node` | Device Plugin 未运行、资源名错误 |
| 节点 NotReady | `kubectl describe node` |  kubelet/容器运行时/网络异常 |
| Helm 安装失败 | `helm status <release> -n <ns>` | values 错误、CRD 未预装、权限不足 |
| 服务无响应 | `kubectl get svc -n <ns>` / `kubectl port-forward` | Service selector 错误、Endpoints 为空 |

---

## 5. AI Stack 与 K8s 的边界

| 层级 | 推荐操作方式 | 说明 |
|------|--------------|------|
| **平台控制台 / aioController** | 首选 | 模型部署、扩缩容、监控、日志聚合 |
| **kubectl（只读）** | 排障时使用 | `get`、`logs`、`describe` |
| **kubectl（写操作）** | 受限使用 | 仅在应急或平台未覆盖场景 |
| **helm** | 变更评审后使用 | 安装/升级基础设施组件 |

---

## Related

- [[12_架构基建/AI_Stack_Production_Toolchain|AI Stack 生产工具链总览]]
- [[12_架构基建/AI_Stack_Container_Runtime_Guide|AI Stack 容器与运行时指南]]
- [[12_架构基建/AI_Stack_Exclusive_Tools_Guide|AI Stack 专属运维工具指南]]
- [[12_架构基建/07_Hardware_Compute/CDI_Deep_Dive|CDI: 容器设备接口标准]]
- [[12_架构基建/07_Hardware_Compute/DRA_Deep_Dive|DRA: 动态资源分配]]
- [[13_运维/AI_Ops_2026|AI Ops 2026: 智能运维体系与实践]]

## 架构核心组件对比

| 组件层 | 功能 | 关键技术 | 选型考量 |
|--------|------|----------|----------|
| 计算层 | 07_模型训练/推理 | GPU/TPU/NPU集群 | 算力需求+成本 |
| 存储层 | 数据/模型/检查点 | 分布式存储/对象存储 | 容量+IOPS+成本 |
| 网络层 | 节点间通信 | RDMA/RoCE/InfiniBand | 带宽+延迟 |
| 调度层 | 资源编排 | K8s/Slurm/Ray | 弹性+效率 |
| 服务层 | 模型服务化 | vLLM/TGI/Triton | 吞吐+延迟 |
| 网关层 | 流量管理 | API Gateway/负载均衡 | 可用性+安全 |
| 监控层 | 可观测性 | Prometheus/Grafana/OTel | 全面+实时 |

## 架构设计原则

| 原则 | 说明 | 实践方法 |
|------|------|----------|
| 高可用 | 消除单点故障 | 多副本+故障转移+多AZ |
| 可扩展 | 水平扩展无瓶颈 | 无状态设计+分片 |
| 高性能 | 最小化延迟 | 缓存+并行+异步 |
| 安全性 | 纵深防御 | 加密+认证+审计 |
| 可观测 | 全链路可见 | Trace+Metrics+Logging |
| 成本优化 | 资源利用率最大化 | 弹性伸缩+混合部署 |

## 性能基准参考

| 场景 | 关键指标 | 目标值 | 优化方向 |
|------|----------|--------|----------|
| 模型推理 | 首Token延迟 | <500ms | 模型优化+缓存 |
| 批量推理 | 吞吐量 | >1000 req/s | 批处理+并行 |
| 训练任务 | GPU利用率 | >85% | 数据管道+通信优化 |
| 存储读写 | IOPS | >100K | NVMe+分布式 |
| 网络通信 | 带宽利用率 | >90% | RDMA+拓扑优化 |

## 常见问题与解决方案

| 问题 | 根因分析 | 解决方案 |
|------|----------|----------|
| GPU利用率低 | 数据加载瓶颈 | 预取+多worker+NVMe |
| 推理延迟高 | 模型过大/批处理不当 | 量化+动态batch |
| 存储IO瓶颈 | 检查点写入集中 | 异步写入+分布式存储 |
| 网络拥塞 | AllReduce通信密集 | 梯度压缩+拓扑优化 |
| 资源碎片 | 调度策略不当 | Gang调度+资源预留 |

## 技术选型决策树

| 决策点 | 选项A | 选项B | 选择依据 |
|--------|-------|-------|----------|
| 训练框架 | PyTorch DDP | DeepSpeed/Megatron | 模型规模>10B用后者 |
| 推理引擎 | vLLM | TensorRT-LLM | 灵活性vs极致性能 |
| 存储方案 | 本地NVMe | 分布式存储(Ceph) | 数据规模+共享需求 |
| 网络方案 | 以太网 | InfiniBand | 集群规模+预算 |
| 调度系统 | K8s | Slurm | 云原生vs HPC传统 |

## 学习路径建议

| 阶段 | 内容 | 时间 | 产出 |
|------|------|------|------|
| 入门 | 基础架构概念+组件认知 | 1-2周 | 理解全景图 |
| 基础 | 单一组件深入(存储/网络) | 2-3周 | 掌握核心原理 |
| 进阶 | 系统集成+性能优化 | 3-4周 | 能设计完整方案 |
| 实战 | 生产环境部署运维 | 4-6周 | 独立运维能力 |
| 精通 | 架构演进+前沿探索 | 持续 | 技术领导力 |

## 术语速查表

| 术语 | 含义 |
|------|------|
| RDMA | 远程直接内存访问(绕过CPU) |
| NVLink | GPU间高速互联 |
| InfiniBand | 高性能网络互连技术 |
| Checkpoint | 训练中间状态保存点 |
| Gang Scheduling | 一组Pod同时调度 |
| Data Parallelism | 数据并行(每GPU处理不同数据) |
| Model Parallelism | 模型并行(模型分片到多GPU) |
| Pipeline Parallelism | 流水线并行(层间流水) |
| Tensor Parallelism | 张量并行(层内切分) |
| KV Cache | 推理时缓存注意力键值 |

## 检查清单

- [ ] 理解AI基础设施全景架构
- [ ] 掌握计算/存储/网络核心组件
- [ ] 了解主流框架和工具链
- [ ] 能进行基本的性能分析和优化
- [ ] 熟悉生产环境最佳实践
- [ ] 关注硬件和架构演进趋势
