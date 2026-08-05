---
title: "K8s 网络故障远程诊断决策树"
tags: [synthesis, kubernetes, troubleshooting, networking, diagnosis, work-order, remote-support, decision-tree]
type: synthesis
created: 2026-07-01
tier: core
aliases:
  - "K8s Network Diagnosis"
  - "网络不通诊断"
  - "Pod 网络排障"
sources: []

name_zh: "K8s 网络故障远程诊断决策树"
---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](治理/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->
# K8s 网络故障远程诊断决策树

> 中文简称：K8s 网络故障远程诊断决策树

> **核心洞察**：K8s 网络工单的 90% 可归纳为三类：「连不上」「解析不了」「访问超时」。远程诊断的关键是引导用户**从 DNS → Service → CNI → 安全策略**四层逐层验证，而非盲目猜测。

---

## 诊断入口：网络问题的现象是什么？

```
用户报告 "网络不通"
│
├── Pod → Pod 通信失败
│   └── → 参见 §1
│
├── Pod → Service 通信失败（ClusterIP 不通）
│   └── → 参见 §2
│
├── DNS 解析失败
│   └── → 参见 §3
│
├── 外部 → 集群访问失败（Ingress/LoadBalancer）
│   └── → 参见 §4
│
├── NetworkPolicy 拦截
│   └── → 参见 §5
│
└── 专有云特有：ENI/IP 池耗尽
    └── → 参见 §6
```

---

## §1 Pod → Pod 通信失败

**远程应问**：
1. 两个 Pod 是否在同一 Node？同一 Namespace？
2. 请在源 Pod 内执行：`kubectl exec <src-pod> -- ping <dst-pod-ip>`
3. CNI 插件是什么？（Flannel/Calico/Terway/VPC-CNI）

**分层诊断**：

| 层 | 验证命令 | 如果失败 |
|----|---------|---------|
| IP 层 | `ping <dst-ip>` | 检查 CNI 是否正常分配 IP |
| 端口层 | `kubectl exec -- nc -zv <dst-ip> <port>` | 检查目标 Pod 是否监听正确端口 |
| 同 Node | 检查是否同 Node | 如果同 Node 不通 = CNI 本地路由问题 |
| 跨 Node | 如果跨 Node 不通 | 检查隧道/IPIP/VXLAN/路由表 |

参见 [[Kubernetes_Networking_Deep_Dive]]、[[概念/cni]]、[[概念/pod]]。

---

## §2 Pod → Service 通信失败

**远程应问**：
1. `kubectl get svc <service-name> -n <ns>` — ClusterIP 是多少？
2. `kubectl get endpoints <service-name> -n <ns>` — Endpoints 是否为空？
3. `kubectl exec <pod> -- curl <svc-ip>:<port>` — 能否直连 ClusterIP？

**根因决策**：

| 现象 | 根因 | 验证 | 处置建议 |
|------|------|------|---------|
| Endpoints 为空 | Label Selector 不匹配 | 对比 Service selector 与 Pod labels | 修正 [[概念/selector]] |
| ClusterIP 不通 | kube-proxy 异常 | 检查节点 iptables/IPVS 规则 | 重启 kube-proxy |
| 间歇性不通 | Endpoints 部分就绪 | 检查 Readiness Probe | 修复探针配置 |
| 连接被重置 | 应用层问题 | 查看目标 Pod 日志 | 排查应用 Bug |

参见 [[概念/service]]、[[概念/selector]]、[[概念/label]]。

---

## §3 DNS 解析失败

**远程应问**：
1. `kubectl exec <pod> -- nslookup <service-name>.<namespace>.svc.cluster.local`
2. `kubectl exec <pod> -- nslookup kubernetes.default` — CoreDNS 是否正常？
3. `kubectl get pods -n kube-system -l k8s-app=kube-dns` — CoreDNS Pod 是否 Running？

**根因决策**：

```
DNS 解析失败
│
├── CoreDNS Pod 异常
│   ├── Pod 不在 Running 状态 → 参见 Pod 故障诊断
│   └── ConfigMap 配置错误 → 检查 CoreDNS Corefile
│
├── Pod 的 dnsPolicy 配置错误
│   └── → 检查 dnsPolicy: ClusterFirst (默认)
│
├── /etc/resolv.conf 配置错误
│   └── → kubelet 未正确注入 DNS 配置
│
├── 专有云特有
│   ├── 天基/ASCM 网络变更影响 → 参见 [[12_架构基建/06_云厂商/03_Alibaba_云_Proprietary_K8s_上下文]]
│   └── ndots 问题（长域名解析慢） → 检点 ndots: 5 配置
│
└── 上游 DNS 不可达
    └── → CoreDNS 的 upstream 配置
```

参见 [[Kubernetes_Networking_Deep_Dive]]、[[概念/cni]]。

---

## §4 外部 → 集群访问失败

**远程应问**：
1. Ingress 还是 LoadBalancer 类型的 Service？
2. `kubectl get ingress -n <ns>` — Ingress 是否有 ADDRESS？
3. `curl -H "Host: <host>" http://<ingress-ip>` — 直连 Ingress IP 是否通？

**根因决策**：

| 访问方式 | 失败现象 | 根因 | 处置 |
|---------|---------|------|------|
| Ingress | 404 | Ingress 规则未匹配 | 检查 host/path 配置 |
| Ingress | 502/503 | 后端 Pod 不可用 | 检查 Endpoints + Readiness |
| Ingress | 超时 | Ingress Controller 异常 | 检查 nginx-ingress/traefik Pod |
| LoadBalancer | EXTERNAL-IP 为 pending | 云控制器未分配 | 专有云：检查 SLB/天基 |
| LoadBalancer | 访问超时 | 安全组/防火墙 | 检查安全组规则 |
| NodePort | 无法访问 | 节点安全组 | 检查节点防火墙 |

参见 [[概念/ingress]]、[[概念/service]]、[[12_架构基建/06_云厂商/03_Alibaba_云_Proprietary_K8s_上下文]]。

---

## §5 NetworkPolicy 拦截

**远程应问**：
1. `kubectl get networkpolicy -n <ns>` — 是否有 NetworkPolicy？
2. 源 Pod 是否被 Policy 允许访问目标？

**诊断**：
- 如果有 NetworkPolicy 且 Pod 间突然不通 → 大概率是 Policy 新增导致
- 临时验证：建议用户测试删除 NetworkPolicy 后是否恢复（确认后再加回）
- 专有云注意：ASCM 可能有额外的网络隔离策略

参见 [[概念/network-policy]]。

---

## §6 专有云特有：ENI/IP 池耗尽

**典型现象**：Pod 卡在 `ContainerCreating`，Events 显示 `allocate ip failed` 或 `no available ip`。

**根因**：
- Terway/VPC-CNI 模式下，每个 Pod 占用一个 ENI 辅助 IP
- 节点 ENI 配额或辅助 IP 池耗尽

**远程指导**：
1. `kubectl describe node <node>` 查看 allocatable 字段
2. 联系平台团队扩容节点 ENI 配额或增加辅助 IP 池
3. 或调整 Pod 密度（减少单节点 Pod 数）

参见 [[12_架构基建/06_云厂商/03_Alibaba_云_Proprietary_K8s_上下文]]、[[概念/cni]]。

---

## 网络诊断命令速查

| 目的 | 命令 | 安全等级 |
|------|------|---------|
| 查看 Service + Endpoints | `kubectl get svc,ep -n <ns>` | 🟢 只读 |
| DNS 解析测试 | `kubectl exec <pod> -- nslookup <name>` | 🟢 只读 |
| 端口连通测试 | `kubectl exec <pod> -- nc -zv <ip> <port>` | 🟢 只读 |
| 查看 NetworkPolicy | `kubectl get netpol -n <ns>` | 🟢 只读 |
| 查看 CNI 状态 | `kubectl get pods -n kube-system` | 🟢 只读 |
| 临时删除 NetworkPolicy | `kubectl delete netpol <name>` | 🔴 高危，先备份 |

---

## Related

- [[Kubernetes_Networking_Deep_Dive]] — K8s 网络深度解析
- [[Kubernetes_Troubleshooting_Playbook]] — K8s 排障完整手册
- [[13_运维/04_问题排查/03_diagnosis_k8s_pod_failure]] — Pod 故障诊断决策树
- [[13_运维/04_问题排查/04_diagnosis_k8s_storage_failure]] — 存储故障诊断决策树
- [[12_架构基建/06_云厂商/03_Alibaba_云_Proprietary_K8s_上下文]] — 专有云 K8s 上下文
- [[概念/cni]] — CNI 概念
- [[概念/service]] — Service 概念
- [[概念/ingress]] — Ingress 概念
- [[概念/network-policy]] — NetworkPolicy 概念
