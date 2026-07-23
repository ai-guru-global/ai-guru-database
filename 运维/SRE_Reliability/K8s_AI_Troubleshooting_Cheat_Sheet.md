---
title: "K8s for AI 排查速查表"
category: 13-ai-ops
subcategory: sre-reliability
tags: ["kubernetes", "k8s", "ai", "troubleshooting", "cheat-sheet", "alibaba-cloud"]
summary: "面向 AI 工作负载的 Kubernetes 排查速查表：Pod/Job/节点/调度/网络/存储问题常用命令与定位流程。"
created: 2026-06-26
updated: 2026-06-26
tier: core
sources: []
---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](../../治理/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->

# K8s for AI 排查速查表

> **使用方式**: 先看现象，再按命令顺序排查。

---

## 1. Pod 状态异常

```bash
# 查看 Pod 状态与事件
kubectl describe pod <pod> -n <namespace>

# 查看 Pod 日志
kubectl logs <pod> -n <namespace> --previous

# 查看容器内进程
kubectl exec -it <pod> -n <namespace> -- ps aux

# 进入容器调试
kubectl exec -it <pod> -n <namespace> -- /bin/bash
```

| 状态 | 排查方向 |
|------|---------|
| Pending | 资源、调度、 toleration、镜像拉取 |
| CrashLoopBackOff | 启动命令、依赖、资源限制 |
| OOMKilled | 内存/显存限制 |
| ImagePullBackOff | 镜像不存在或凭证错误 |
| ErrImagePull | 镜像仓库不可达 |

---

## 2. 训练 Job 排查

```bash
# 查看 PyTorchJob/TFJob 状态
kubectl get pytorchjob -n <namespace>
kubectl describe pytorchjob <job> -n <namespace>

# 查看所有 Worker Pod
kubectl get pods -n <namespace> -l training.kubeflow.org/job-name=<job>

# 聚合查看所有 Worker 日志
kubectl logs -n <namespace> -l training.kubeflow.org/job-name=<job> --tail=100

# 查看 Job 事件
kubectl get events -n <namespace> --field-selector involvedObject.name=<job>
```

---

## 3. 调度问题

```bash
# 查看节点资源
kubectl describe node <node>

# 查看 Pod 为什么 Pending
kubectl get pod <pod> -o yaml | grep -A 20 "conditions"

# 查看调度器日志
kubectl logs -n kube-system -l component=kube-scheduler

# 查看 Volcano 队列
kubectl get queues -n volcano-system
```

---

## 4. GPU 调度问题

```bash
# 查看节点可分配 GPU
kubectl get node <node> -o jsonpath='{.status.allocatable.nvidia\.com/gpu}'

# 查看已分配 GPU
kubectl get node <node> -o jsonpath='{.status.capacity.nvidia\.com/gpu}'

# 查看 GPU Device Plugin
kubectl get ds -n kube-system nvidia-device-plugin-daemonset

# 查看 GPU Operator
kubectl get pods -n gpu-operator
```

---

## 5. 网络问题

```bash
# 测试 Pod 间连通性
kubectl exec -it <pod> -- ping <target-pod-ip>

# 查看 Service Endpoint
kubectl get endpoints <svc> -n <namespace>

# 查看 NetworkPolicy
kubectl get networkpolicies -n <namespace>

# 抓包
kubectl debug -it <pod> --image=nicolaka/netshoot -- tcpdump -i eth0 -w /tmp/capture.pcap
```

---

## 6. 存储问题

```bash
# 查看 PVC 状态
kubectl get pvc -n <namespace>

# 查看 PV
kubectl get pv

# 查看 StorageClass
kubectl get sc

# 查看 Pod 挂载
kubectl exec -it <pod> -n <namespace> -- df -h
```

---

## 7. 推理服务排查

```bash
# 查看 Deployment
kubectl get deploy -n <namespace>

# 查看 HPA
kubectl get hpa -n <namespace>

# 查看 Service Endpoint
kubectl get endpoints <svc> -n <namespace>

# 测试推理接口
kubectl port-forward svc/<svc> 8000:8000 -n <namespace>
curl http://localhost:8000/v1/chat/completions -d '{...}'
```

---

## Related

- [[运维/Troubleshooting/Kubernetes_Troubleshooting_Playbook|K8s 系统排障 Playbook]]
- [[运维/SRE_Reliability/GPU_Troubleshooting_Cheat_Sheet|GPU 故障排查速查表]]
- [[模型训练/Monitoring/LLM_Fine_Tuning_Job_Failure_Runbook_on_K8s|LLM 微调任务 K8s 失败排障]]

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
| 应用场景 | 价值体现 | 行业应用/ |
| 前沿研究 | 发展方向 | 论文精读/ |
| 工程方法 | 质量保障 | 测试/运维/ |

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
