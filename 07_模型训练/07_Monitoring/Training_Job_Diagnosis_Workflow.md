---
title: "训练任务诊断工作流"
category: 07-model-training
subcategory: monitoring
tags: ["training", "troubleshooting", "workflow", "pytorch", "kubernetes", "k8s", "alibaba-cloud"]
summary: "一份可落地的 AI 训练任务诊断工作流：从告警触发到根因定位，附带每个环节的具体命令与判断标准。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
sources: []
---

# 训练任务诊断工作流

> **一句话理解**: 训练任务出问题时，按这个工作流从「K8s 层 → 框架层 → 代码层」逐层下钻，避免盲目翻日志。

---

## 总线

```text
告警/用户反馈
  ↓
1. 确认 Job/Pod 状态
  ├── Pending → 调度/资源问题
  ├── Running 但无进展 → 通信/代码问题
  ├── Failed → 查看日志定位
  └── OOMKilled → 显存/内存问题
  ↓
2. 查看日志与事件
  ├── 镜像/启动错误
  ├── NCCL/通信错误
  ├── CUDA/显存错误
  ├── 数据/代码错误
  └── .NaN/loss 异常
  ↓
3. 采集指标
  ├── GPU 利用率
  ├── 显存
  ├── 网络带宽
  └── 磁盘 IO
  ↓
4. 根因定位与修复
```

---

## 步骤 1：确认状态

```bash
# 查看 Job
kubectl get pytorchjob <job> -n <ns>

# 查看 Pod
kubectl get pods -n <ns> -l training.kubeflow.org/job-name=<job>

# 查看事件
kubectl describe pytorchjob <job> -n <ns>
```

| 状态 | 下一步 |
|------|--------|
| Pending | 检查资源、节点、镜像拉取 |
| ContainerCreating | 检查 PVC/镜像/Secret |
| Running 但 loss 不更新 | 检查 NCCL/数据加载 |
| OOMKilled | 跳到显存排查 |
| Error | 查看完整日志 |

---

## 步骤 2：查看日志

```bash
# 查看 master/leader 日志
kubectl logs <pod> -n <ns> --tail=500

# 查看所有 worker 最后 100 行
kubectl logs -n <ns> -l training.kubeflow.org/job-name=<job> --tail=100

# 查看之前崩溃的容器日志
kubectl logs <pod> -n <ns> --previous
```

**常见关键字**:
- `RuntimeError: CUDA out of memory`
- `NCCL timeout`
- `Connection refused`
- `No such file or directory`
- `loss is nan`
- `KeyboardInterrupt` / `SIGTERM`

---

## 步骤 3：检查资源指标

```bash
# GPU 利用率
kubectl exec -it <pod> -n <ns> -- nvidia-smi dmon

# 显存
kubectl exec -it <pod> -n <ns> -- nvidia-smi -q -d MEMORY

# 进程
kubectl exec -it <pod> -n <ns> -- ps aux | grep python

# 网络
kubectl exec -it <pod> -n <ns> -- ibstat

# 磁盘
kubectl exec -it <pod> -n <ns> -- df -h
```

---

## 步骤 4：NCCL 通信排查

```bash
# 开启 NCCL 调试
kubectl exec -it <pod> -n <ns> -- env NCCL_DEBUG=INFO torchrun ...

# 测试 IB 带宽
kubectl exec -it <pod> -n <ns> -- ib_write_bw -d mlx5_0

# 查看 NCCL 拓扑
NCCL_TOPO_DUMP_FILE=topo.xml torchrun ...
```

| 现象 | 根因 | 处理 |
|------|------|------|
| `NCCL timeout` | 网络不通 / 防火墙 | 检查 IB/RoCE、NetworkPolicy |
| `NCCL internal error` | 驱动/库版本不匹配 | 升级 NCCL/CUDA/驱动 |
| 速度远低于理论 | 收敛比 / PFC | 检查交换机配置 |

---

## 步骤 5：数据与代码排查

```bash
# 进入容器检查数据
kubectl exec -it <pod> -n <ns> -- ls /data
kubectl exec -it <pod> -n <ns> -- python -c "import datasets; print(datasets.load_dataset(...))"

# 单卡小批量验证
kubectl exec -it <pod> -n <ns> -- python train.py --batch_size 1 --max_steps 10
```

---

## Related

- [[07_模型训练/07_Monitoring/LLM_Fine_Tuning_Job_Failure_Runbook_on_K8s|LLM 微调任务 K8s 失败排障]]
- [[07_模型训练/04_Distributed_Training/Distributed_Training_Hang_Runbook|分布式训练 Hang 排障]]
- [[13_运维/02_SRE_Reliability/K8s_AI_Troubleshooting_Cheat_Sheet|K8s for AI 排查速查表]]

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
