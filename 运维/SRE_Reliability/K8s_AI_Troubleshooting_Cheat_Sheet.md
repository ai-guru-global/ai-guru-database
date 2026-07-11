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
