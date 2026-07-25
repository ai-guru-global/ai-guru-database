---
title: "AI Stack 专属运维工具指南"
category: "12-architecture-infrastructure"
tags: ["ai-stack", "stackops", "aiocontroller", "operations", "systemctl"]
summary: "> **一句话理解**: stackops 是 AI Stack 内置运维工具集，用于镜像 hash、版本查询等操作；aioController 是 AI Stack 控制引擎核心服务，通过 systemctl 管理其生命周期。"
created: "2026-06-16"
updated: "2026-06-16"
tier: supporting
aliases:
  - "Ai Stack Exclusive Tools Guide"
  - "AI Stack Exclusive Tools Guide"
  - AI_Stack_Exclusive_Tools_Guide
sources: []

---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](治理/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->
# AI Stack 专属运维工具指南

> **一句话理解**: `stackops` 是 AI Stack 内置运维工具集，用于镜像 hash、版本查询等操作；`aioController` 是 AI Stack 控制引擎核心服务，通过 `systemctl` 管理其生命周期。

---

## 1. 工具选型矩阵

| 工具 | 用途 | 典型场景 | 操作对象 |
|------|------|----------|----------|
| **stackops** | AI Stack 运维工具集 | 镜像 tag 校验、版本查询、运维脚本入口 | AI Stack 软件包/镜像 |
| **aioController** | AI Stack 控制引擎 | 平台服务重启、状态管理 | systemd 服务 |

---

## 2. 常用命令

### 2.1 stackops

```bash
# 查看 AI Stack 版本
stackops version

# 计算 asllm 镜像 hash（用于版本一致性校验）
stackops asllm-hash <tag>

# 示例：校验 qwen3-8b v1.0 镜像 hash
stackops asllm-hash qwen3-8b:v1.0
```

### 2.2 aioController

```bash
# 查看服务状态
systemctl status aioController

# 启动/停止/重启控制引擎
systemctl start aioController
systemctl stop aioController  # ⚠️ HIGH-RISK — 停止服务，可用性受影响 [回滚：见文档/备份]
systemctl restart aioController

# 查看实时日志
journalctl -u aioController -f

# 查看启动以来日志
journalctl -u aioController --since "1 hour ago"
```

---

## 3. 生产环境 Checklist

- [ ] 变更 `aioController` 配置后，使用 `systemctl restart aioController` 生效；变更前先在测试环境验证。
- [ ] 重启 `aioController` 前确认当前无关键训练/推理任务正在执行，或已在平台层设置维护窗口。
- [ ] 使用 `stackops version` 核对 AI Stack 软件版本与文档/发布说明一致。
- [ ] 对 asllm 镜像进行 hash 校验，确保不同节点加载的镜像版本一致，避免推理行为差异。
- [ ] 配置 `aioController` 日志轮转，防止 `/var/log/journal` 无限增长。
- [ ] 将 `aioController` 纳入节点级监控和告警（systemd 服务状态、CPU/内存、端口健康）。
- [ ] 限制 `stackops` 与 `systemctl` 命令的执行权限，仅运维人员可操作。

---

## 4. 故障排查速查

| 现象 | 排查命令 | 常见原因 |
|------|----------|----------|
| 平台控制台无法访问 | `systemctl status aioController` | 控制引擎未启动、端口冲突 |
| 镜像 hash 不一致 | `stackops asllm-hash <tag>` | 节点镜像未同步、tag 被覆盖 |
| 服务启动失败 | `journalctl -u aioController -n 100` | 配置错误、依赖服务未就绪、证书过期 |
| 重启后部分功能异常 | `systemctl status aioController` + 平台日志 | 初始化顺序错误、数据库连接失败 |
| stackops 命令不存在 | `which stackops` / `rpm -qa \| grep stackops` | 未安装或未加入 PATH |

---

## 5. 与其他工具的关系

```
AI Stack 平台层
    ├── aioController (控制引擎，systemd 管理)
    ├── stackops (运维 CLI 入口)
    └── 底层调用
        ├── nerdctl / crictl / kubectl (容器/K8s 操作)
        ├── nvidia-smi / ppu-smi (GPU 监控)
        └── vllm serve / sglang (推理服务)
```

---

## Related

- [[12_架构基建/AI_Stack_Production_Toolchain|AI Stack 生产工具链总览]]
- [[12_架构基建/AI_Stack_Container_Runtime_Guide|AI Stack 容器与运行时指南]]
- [[12_架构基建/AI_Stack_K8s_Operations_Guide|AI Stack K8s 编排指南]]
- [[12_架构基建/AI_Stack_Deep_Dive|阿里云 AI Stack 软硬一体推理平台]]

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
