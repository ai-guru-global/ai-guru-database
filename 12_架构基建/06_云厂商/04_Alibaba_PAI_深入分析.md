---
title: "阿里云 PAI 深度解析"
category: 12-architecture-infrastructure
subcategory: cloud-providers
tags: ["alibaba-cloud", "pai", "llm", "training", "inference", "kubernetes", "k8s", "proprietary-cloud"]
summary: "系统讲解阿里云 PAI 平台的核心产品（DSW/DLC/EAS）、与 ACK 专有云的集成方式，以及典型 LLM 训练/推理工单的处理入口。"
created: 2026-06-26
updated: 2026-06-26
tier: core
sources: []
name_zh: "阿里云 PAI 深度解析"
---

# 阿里云 PAI 深度解析

> 中文简称：阿里云 PAI 深度解析

> **一句话理解**: PAI 是阿里云上一站式 AI 平台，DSW 写代码、DLC 跑训练、EAS 做推理；在专有云里，它们跑在 ACK 和飞天底座之上。

## 目录

- [1. PAI 产品全景](#1-pai-产品全景)
- [2. PAI-DSW：交互式开发](#2-pai-dsw交互式开发)
- [3. PAI-DLC：分布式训练](#3-pai-dlc分布式训练)
- [4. PAI-EAS：在线推理](#4-pai-eas在线推理)
- [5. PAI 与 ACK 的关系](#5-pai-与-ack-的关系)
- [6. 典型工单场景](#6-典型工单场景)
- [7. 排查入口](#7-排查入口)
- [Related](#related)

---

## 1. PAI 产品全景

```text
PAI
├── PAI-DSW   交互式开发（Notebook / IDE）
├── PAI-DLC   深度学习训练（Job / 分布式训练）
├── PAI-EAS   弹性推理服务（在线部署 / 自动扩缩）
├── PAI-Designer  可视化建模
└── PAI-FeatureStore  特征平台
```

---

## 2. PAI-DSW：交互式开发

- **定位**: 云原生 Notebook / IDE 环境。
- **资源**: 可选 GPU / CPU 实例，挂载 OSS / NAS。
- **K8s 映射**: 每个 DSW 实例对应一个 Pod（通常为 StatefulSet）。
- **常见工单**:
  - 实例启动失败 → 检查镜像、PVC、资源配额
  - 环境包缺失 → 检查 conda/pip 环境
  - 无法挂载数据集 → 检查 OSS/NAS 权限

---

## 3. PAI-DLC：分布式训练

- **定位**: 托管分布式训练平台。
- **支持框架**: PyTorch、TensorFlow、Megatron、DeepSpeed、FSDP。
- **K8s 映射**: 提交任务后生成 PyTorchJob / TFJob / MPIJob。
- **资源调度**: 可对接 Volcano、Kueue。
- **常见工单**:
  - 任务 Pending → 检查 GPU 配额、节点资源
  - 任务失败 → 查看 DLC 日志和底层 Pod 日志
  - NCCL 错误 → 检查 IB/RoCE 网络

---

## 4. PAI-EAS：在线推理

- **定位**: 模型在线服务与推理平台。
- **支持**: vLLM、TGI、Triton、自定义镜像。
- **能力**: 自动扩缩容、金丝雀发布、A/B 测试、监控告警。
- **K8s 映射**: 每个 EAS 服务对应 K8s Deployment / KServe InferenceService。
- **常见工单**:
  - 服务不可用 → 检查 Pod 状态、Endpoint
  - 延迟高 → 检查 GPU 利用率、batch size、HPA
  - 版本回滚 → 在 EAS 控制台切换模型版本

---

## 5. PAI 与 ACK 的关系

在阿里云专有云环境中：

- **PAI 控制面**: PAI 平台自身的管理组件。
- **ACK 数据面**: 实际运行 DSW/DLC/EAS 的容器集群。
- **飞天底座**: 提供计算、网络、存储资源。
- **天基**: 负责 ACK 集群和物理机运维。
- **ASCM**: 统一资源管理、配额、告警。

```text
用户 / 运维
   ↓
PAI 控制台 / ASCM
   ↓
ACK 专有版 / 敏捷版
   ↓
飞天（神龙/洛神/盘古）
```

---

## 6. 典型工单场景

### 场景 1：PAI-DLC 任务失败

1. PAI 控制台查看任务日志和事件
2. ACK 查看对应 PyTorchJob / Pod 状态
3. 检查是否为 OOM、NCCL、镜像拉取失败
4. 参考 [[07_模型训练/07_训练监控/02_LLM_微调_岗位_Failure_操作手册_on_K8s|LLM 微调任务 K8s 失败排障]]

### 场景 2：PAI-EAS 服务延迟高

1. EAS 控制台查看 QPS、延迟、GPU 利用率
2. ACK 查看 Pod 资源和 HPA 状态
3. 检查 vLLM/SGLang 的 KV Cache、batch size
4. 参考 [[13_运维/02_SRE与可靠性/19_LLM推理_Slow_Unavailable_操作手册|LLM 推理延迟/不可用 Runbook]]

### 场景 3：PAI-DSW 无法启动

1. 检查实例规格和配额
2. 检查镜像是否存在
3. 检查 PVC 绑定
4. 检查节点是否有可用 GPU

---

## 7. 排查入口

| 入口 | 用途 |
|------|------|
| PAI 控制台 | 查看任务/服务/实例状态与日志 |
| ASCM | 查看配额、告警、资源使用 |
| 天基 OpsBox | 登录物理机/GPU 节点 |
| ACK 控制台/kubectl | 查看 Pod、Job、Service、Event |
| 洛神/盘古控制台 | 网络、存储问题排查 |

---

## Related

- [[概念/pai|PAI]]
- [[概念/ack|ACK]]
- [[概念/alibaba-cloud|Alibaba Cloud]]
- [[12_架构基建/06_云厂商/03_Alibaba_云_Proprietary_K8s_上下文|阿里云专有云 K8s 上下文]]
- [[07_模型训练/07_训练监控/02_LLM_微调_岗位_Failure_操作手册_on_K8s|LLM 微调任务 K8s 失败排障]]
- [[13_运维/02_SRE与可靠性/19_LLM推理_Slow_Unavailable_操作手册|LLM 推理延迟/不可用 Runbook]]

- [[12_架构基建/README|架构与基础设施 (Architecture & Infrastructure)]]

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
