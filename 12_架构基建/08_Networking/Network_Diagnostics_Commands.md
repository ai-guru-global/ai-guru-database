---
title: "AI 集群网络诊断命令集"
category: 12-architecture-infrastructure
subcategory: networking
tags: ["networking", "rdma", "roce", "infiniband", "diagnostics", "commands", "alibaba-cloud"]
summary: "面向 AI 集群的网络诊断命令集：覆盖 IB/RoCE/以太网的带宽、延迟、连通性、NCCL 调试等常用命令。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
sources: []
---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](治理/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->

# AI 集群网络诊断命令集

> **使用方式**: 网络异常时，按链路类型选择对应命令。

---

## 1. InfiniBand 诊断

```bash
# 查看 IB 设备
ibstat
ibstatus

# 查看 IB 链路信息
iblinkinfo

# 测试 IB 带宽
ib_write_bw -d mlx5_0
ib_read_bw -d mlx5_0

# 测试 IB 延迟
ib_write_lat -d mlx5_0

# 查看 IB 路由
ibdiagnet
```

---

## 2. RoCE 诊断

```bash
# 查看 RDMA 设备
rdma link

# 查看 RoCE 版本
cat /sys/class/infiniband/mlx5_0/ports/1/roce_enable

# 测试 RDMA 带宽
ib_write_bw --rdma_cm -d mlx5_0

# 测试 TCP 带宽
iperf3 -c <server_ip> -t 30

# 检查 PFC/ECN
show_pfc -d mlx5_0
```

---

## 3. 以太网诊断

```bash
# 查看网卡状态
ethtool eth0

# 查看网卡速率
ethtool eth0 | grep Speed

# 查看接口统计
ip -s link show eth0

# 抓包
tcpdump -i eth0 -w /tmp/capture.pcap

# 路由追踪
traceroute <target_ip>
```

---

## 4. NCCL 调试

```bash
# 基础调试
NCCL_DEBUG=INFO torchrun ...

# 调试子系统
NCCL_DEBUG=INFO NCCL_DEBUG_SUBSYS=ALL torchrun ...

# 查看 NCCL 网络配置
NCCL_IB_DISABLE=0 NCCL_SOCKET_IFNAME=eth1 torchrun ...

# 导出拓扑
NCCL_TOPO_DUMP_FILE=topo.xml torchrun ...

# 查看 NCCL 环境变量生效
NCCL_DEBUG=INFO python -c "import torch; print(torch.cuda.nccl.version())"
```

---

## 5. K8s 网络诊断

```bash
# 查看 Pod IP
kubectl get pod <pod> -o wide

# Pod 内测试 DNS
kubectl exec -it <pod> -- nslookup kubernetes.default

# Pod 间连通性
kubectl exec -it <pod-a> -- ping <pod-b-ip>

# 查看 Service Endpoint
kubectl get endpoints <svc>

# 临时抓包 Pod
kubectl debug -it <pod> --image=nicolaka/netshoot -- tcpdump -i any
```

---

## Related

- [[12_架构基建/08_Networking/AI_Networking_Fundamentals|AI 网络基础]]
- [[12_架构基建/08_Networking/RDMA_and_RoCE_for_AI|RDMA 与 RoCE 在 AI 集群中的应用]]
- [[07_模型训练/04_Distributed_Training/Distributed_Training_Hang_Runbook|分布式训练 Hang 排障]]

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
