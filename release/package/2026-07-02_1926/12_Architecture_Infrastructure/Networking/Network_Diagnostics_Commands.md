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
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](../../_meta/Production_Safety_Policy.md)。
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

- [[架构基建/Networking/AI_Networking_Fundamentals|AI 网络基础]]
- [[架构基建/Networking/RDMA_and_RoCE_for_AI|RDMA 与 RoCE 在 AI 集群中的应用]]
- [[模型训练/Distributed_Training/Distributed_Training_Hang_Runbook|分布式训练 Hang 排障]]
