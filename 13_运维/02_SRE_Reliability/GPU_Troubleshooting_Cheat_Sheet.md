---
title: "GPU 故障排查速查表"
category: 13-ai-ops
subcategory: sre-reliability
tags: ["gpu", "troubleshooting", "cheat-sheet", "nvidia-smi", "cuda", "alibaba-cloud"]
summary: "面向 AI 平台的 GPU 故障排查速查表：涵盖 nvidia-smi、CUDA 版本、驱动、显存、进程、温度等常用命令与诊断流程。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
sources: []
---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](治理/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->

# GPU 故障排查速查表

> **使用方式**: 根据现象定位到对应章节，按命令顺序执行。

---

## 1. 快速确认 GPU 是否可用

```bash
# 查看 GPU 列表与状态
nvidia-smi

# 查看 GPU 详细信息
nvidia-smi -q

# 查看驱动版本
nvidia-smi | grep -i "Driver Version"

# 查看 CUDA 版本
nvcc --version
```

**预期**: 所有 GPU 状态为 `Default`，温度正常，无 `ERR!`。

---

## 2. 显存占用排查

```bash
# 查看各进程显存占用
nvidia-smi pmon -s um

# 查看显存详细信息
nvidia-smi -q -d MEMORY

# 查看占用显存的进程
fuser -v /dev/nvidia*

# 按显存排序查看进程
nvidia-smi --query-compute-apps=pid,process_name,used_memory --format=csv
```

**处理**: 发现僵尸进程 → `kill -9 <pid>`；发现内存泄漏 → 联系业务方修复。

---

## 3. 判断是哪种 OOM

| 类型 | 检查命令 | 典型日志 |
|------|---------|---------|
| Host OOM | `dmesg -T | grep -i "killed process"` | `Out of memory: Kill process ...` |
| Container OOM | `kubectl describe pod <pod>` | `OOMKilled` |
| CUDA OOM | Pod 日志 | `CUDA out of memory` |
| HAMi vGPU oversell | HAMi scheduler 日志 | `insufficient vgpu memory` |

---

## 4. 驱动与运行时问题

```bash
# 检查内核模块
lsmod | grep nvidia

# 查看驱动日志
journalctl -u nvidia-persistenced -n 100

# 检查 CUDA 与驱动兼容性
cat /usr/local/cuda/version.json 2>/dev/null || cat /usr/local/cuda/version.txt

# DCGM 健康检查
dcgmi diag -r 3
```

---

## 5. GPU 温度与功耗

```bash
# 查看温度、功耗、风扇
nvidia-smi dmon -s pucvmet

# 查看 GPU 温度阈值
nvidia-smi -q -d TEMPERATURE,PERFORMANCE,POWER
```

**告警阈值参考**:
- 温度 > 85°C：关注
- 温度 > 92°C：紧急降频或停机
- 功耗持续 < 50% 但负载高：可能遇到 PCI-E 瓶颈

---

## 6. 多节点 GPU 通信

```bash
# 测试 IB/RDMA 带宽
ib_write_bw -d mlx5_0
ib_write_lat -d mlx5_0

# NCCL 调试信息
NCCL_DEBUG=INFO NCCL_DEBUG_SUBSYS=ALL torchrun ...

# 查看 NCCL 网络拓扑
NCCL_TOPO_DUMP_FILE=topo.xml torchrun ...
```

---

## 7. K8s 中 GPU 相关命令

```bash
# 查看节点 GPU 资源
kubectl describe node <node> | grep -i nvidia.com/gpu

# 查看所有 GPU Pod
kubectl get pods --all-namespaces -o custom-columns=\
"NAME:.metadata.name,NAMESPACE:.metadata.namespace,GPU:.spec.containers[*].resources.limits.nvidia\.com/gpu"

# 查看 GPU Operator 状态
kubectl get pods -n gpu-operator

# 查看 Device Plugin 日志
kubectl logs -n kube-system -l name=nvidia-device-plugin-ds
```

---

## Related

- [[13_运维/02_SRE_Reliability/GPU_OOM_Troubleshooting_Guide|GPU OOM 排障指南]]
- [[07_模型训练/04_Distributed_Training/Distributed_Training_Hang_Runbook|分布式训练 Hang 排障]]
- [[概念/nvidia-smi|nvidia-smi]]

## 进阶知识拓展

| 主题 | 深度内容 | 应用场景 | 参考资源 |
|------|----------|----------|----------|
| 核心原理 | 底层机制和数学推导 | 深度理解+优化 | 经典教材+论文 |
| 工程实践 | 生产级实现细节 | 项目落地 | 开源项目+案例 |
| 性能优化 | 瓶颈分析+调优策略 | 提升效率 | 性能分析工具 |
| 安全合规 | 安全威胁+防护措施 | 风险管控 | 安全框架+标准 |
| 前沿研究 | 最新进展+未来方向 | 技术预判 | 顶会论文+博客 |

## 实践指南

| 步骤 | 行动 | 工具/方法 | 预期产出 |
|------|------|-----------|----------|
| 1. 学习 | 系统学习核心知识 | 教材/课程/文档 | 知识体系建立 |
| 2. 练习 | 动手实践加深理解 | 实验/项目/练习 | 技能熟练 |
| 3. 应用 | 在实际项目中应用 | 工作项目/开源 | 经验积累 |
| 4. 优化 | 持续改进和优化 | 性能分析/重构 | 质量提升 |
| 5. 分享 | 输出和分享知识 | 博客/演讲/教学 | 影响力建设 |

## 常见误区

| 误区 | 正确认知 | 建议 |
|------|----------|------|
| 只学理论不实践 | 实践是检验理解的唯一标准 | 每学一个概念就动手验证 |
| 追求完美再开始 | 完成比完美更重要 | 先做MVP再迭代 |
| 忽视基础知识 | 基础决定上限 | 定期回顾基础 |
| 盲目追新 | 新技术需要验证 | 评估后再采用 |
| 单打独斗 | 协作效率更高 | 积极参与社区 |

## 知识图谱关联

| 关联主题 | 关系类型 | 参考路径 |
|----------|----------|----------|
| 基础理论 | 前置依赖 | 相关基础目录 |
| 工具实践 | 实现支撑 | 工具/编程相关 |
| 应用场景 | 价值体现 | 18_行业应用/ |
| 前沿研究 | 发展方向 | 20_论文精读/ |
| 工程方法 | 质量保障 | 09_测试/13_运维/ |

## 版本更新记录

| 版本 | 日期 | 变更 |
|------|------|------|
| v1.0 | 2025-01 | 初始创建 |
| v1.1 | 2025-06 | 内容补充 |
| v2.0 | 2026-01 | 全面扩写 |
| v2.1 | 2026-07 | 质量强化+结构化增强 |

## 快速自检

- [ ] 核心概念能向他人清晰解释
- [ ] 已完成至少一个实践项目
- [ ] 了解主流方案优劣势和适用场景
- [ ] 掌握常见问题排查方法
- [ ] 关注最新技术动态
- [ ] 知识已文档化沉淀
