---
title: "Kubernetes 运维排障 Playbook"
category: 13-ai-ops
tags: ["kubernetes", "k8s", "troubleshooting", "sre", "playbook", "incident-response", "alibaba-cloud"]
summary: "面向阿里云专有云 K8s 工单的系统排障手册：从 Pod、节点、网络、存储、调度到控制平面，提供分层定位与命令级操作步骤。"
created: 2026-06-26
updated: 2026-06-26
tier: core
sources: []
---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](治理/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->

# Kubernetes 运维排障 Playbook

> **一句话理解**: 这是一本按「现象 → 定位 → 命令 → 修复」组织的 K8s 排障手册，目标是让工单智能体或运维工程师能在阿里云专有云环境中快速收敛根因。

## 目录

- [1. 排障总线](#1-排障总线)
- [2. Pod 问题](#2-pod-问题)
- [3. 节点问题](#3-节点问题)
- [4. 网络问题](#4-网络问题)
- [5. 存储问题](#5-存储问题)
- [6. 调度问题](#6-调度问题)
- [7. 控制平面问题](#7-控制平面问题)
- [8. 应用层问题](#8-应用层问题)
- [9. 阿里云专有云排障要点](#9-阿里云专有云排障要点)
- [10. 常用一键巡检脚本](#10-常用一键巡检脚本)
- [Related](#related)

---

## 1. 排障总线

拿到 K8s 工单时，按下面顺序快速分层：

1. **用户层**：应用报错码、延迟、无法访问、数据不一致。
2. **工作负载层**：Pod 状态、事件、日志、探针。
3. **网络层**：Service / DNS / Ingress / NetworkPolicy / CNI。
4. **存储层**：PVC / PV / CSI / 挂载 / IO。
5. **节点层**：Node 状态、资源压力、运行时、kubelet。
6. **控制平面层**：kube-apiserver / etcd / scheduler / controller-manager。

**第一条黄金命令**：

```bash
kubectl get nodes,pods --all-namespaces -o wide
```

它能一眼看出节点是否 Ready、Pod 是否异常、异常是否集中在某台节点。

**第二条黄金命令**：

```bash
kubectl cluster-info
kubectl version --short
```

确认集群连通性和版本，避免在低版本踩已知 bug。

---

## 2. Pod 问题

### 2.1 Pod 状态速查表

| 状态 | 含义 | 下一步 |
|------|------|--------|
| `Pending` | 调度或镜像拉取未完成 | 看事件、看节点资源、看调度约束 |
| `ContainerCreating` | 容器创建中，卡在运行时或存储挂载 | 看事件、看 CRI / CSI |
| `ImagePullBackOff` | 镜像拉取失败 | 检查镜像名、权限、Registry 可达性 |
| `CrashLoopBackOff` | 容器启动后反复退出 | 看日志、看退出码、看探针 |
| `OOMKilled` | 内存超限被 kill | 调大 limit、排查内存泄漏 |
| `Evicted` | 节点驱逐 | 看节点压力、清理磁盘 / inode |
| `Terminating` | 删除中卡住 | 看 finalizer、看 kubelet / CRI |
| `Completed` | Job 正常结束 | 检查退出码与重试策略 |
| `Error` | 启动失败 | 看日志与事件 |

### 2.2 Pending / ContainerCreating

**排查命令链**：

```bash
# 1. 查看 Pod 事件
kubectl describe pod <pod-name> -n <ns>

# 2. 看调度详情
kubectl get pod <pod-name> -n <ns> -o yaml | grep -A 20 "conditions"

# 3. 看节点资源
kubectl describe node <node-name>

# 4. 看存储挂载事件
kubectl get events --field-selector involvedObject.name=<pod-name> -n <ns> --sort-by='.lastTimestamp'
```

**常见根因**：

1. **镜像拉取失败**：
   - 镜像名拼错、tag 不存在
   - 私有镜像没配 imagePullSecret
   - 节点到 Harbor/ACR 网络不通
   - 镜像仓库证书不信任

2. **资源不足**：
   - CPU / 内存 requests 总和超过节点可分配量
   - GPU 数量不足
   - 临时存储不足

3. **调度约束无法满足**：
   - nodeSelector / affinity / taint-toleration 不匹配
   - PodAntiAffinity 导致无可用节点
   - topologySpreadConstraints 太严格

4. **存储挂载失败**：
   - PVC 未绑定
   - CSI driver 异常
   - 节点上 volume 已挂载但未释放

### 2.3 CrashLoopBackOff

```bash
# 看上一条容器的日志
kubectl logs <pod-name> -n <ns> --previous

# 看退出码
kubectl get pod <pod-name> -n <ns> -o jsonpath='{.status.containerStatuses[0].lastState.terminated.exitCode}'
```

**退出码速查**：

| 退出码 | 含义 | 处理 |
|--------|------|------|
| 0 | 正常退出 | 检查启动命令、Job 配置 |
| 1 | 通用错误 | 看应用日志 |
| 137 (128+9) | SIGKILL，多为 OOM | 增大 memory limit |
| 143 (128+15) | SIGTERM | 检查优雅关闭逻辑 |
| 126 | 命令不可执行 | 检查权限、shell 脚本 |
| 127 | 命令未找到 | 检查镜像、PATH |

### 2.4 OOMKilled

```bash
# 看 lastState
kubectl describe pod <pod-name> -n <ns> | grep -A 5 "Last State"
```

**处理**：
- 若 `Reason: OOMKilled`，调大 `resources.limits.memory`
- 若业务确实内存泄漏，结合 profiling 工具排查
- 注意：limit 应 ≥ request，且节点有可用内存

### 2.5 Evicted

```bash
kubectl get pods --all-namespaces --field-selector status.phase=Failed | grep Evicted
kubectl describe node <node-name> | grep -A 10 "Conditions"
```

**常见驱逐原因**：
- `DiskPressure`：节点磁盘 / 镜像 / 日志占满
- `MemoryPressure`：节点内存不足
- `PIDPressure`：进程数超限
- `InactivePods`：Inactive Pod 过多（专有云特定策略）

**处理**：
- 清理已停止容器和无用镜像：`crictl rmi $(crictl images -q)`
- 清理日志：truncate 或滚动
- 扩容节点或降低负载

### 2.6 Terminating 卡住

```bash
# 强制删除（慎用）
kubectl delete pod <pod-name> -n <ns> --grace-period=0 --force  # ⚠️ HIGH-RISK — 删除 K8s 资源，服务可能中断 [回滚：见文档/备份]

# 如果还有 finalizer
kubectl patch pod <pod-name> -n <ns> -p '{"metadata":{"finalizers":[]}}' --type=merge
```

**根因**：
- kubelet 未响应删除事件
- CRI 容器删除失败
- CSI volume 未 detach
- 自定义 finalizer 卡住

---

## 3. 节点问题

### 3.1 Node NotReady

```bash
# 看节点详情
kubectl describe node <node-name>

# SSH 到节点看 kubelet 状态
systemctl status kubelet
journalctl -u kubelet -f -n 500

# 看容器运行时
systemctl status containerd
crictl ps

# 看节点资源
free -h
df -h
```

**排查树**：

1. kubelet 是否运行？
   - 没运行：`systemctl restart kubelet`
   - 证书过期：`/var/lib/kubelet/pki` 检查有效期
2. CRI 是否运行？
   - containerd 异常：看 `journalctl -u containerd`
3. 节点资源压力？
   - `DiskPressure` / `MemoryPressure` / `PIDPressure`
4. CNI 插件是否健康？
   - Calico/Cilium/Terway Pod 是否 Running
5. 时间同步？
   - NTP/Chrony 不同步会导致证书校验失败

### 3.2 节点压力条件

| 条件 | 默认阈值 | 处理 |
|------|----------|------|
| `DiskPressure` | 节点可用 < 10% 或 inode < 5% | 清理镜像、日志、空卷 |
| `MemoryPressure` | 节点可用内存 < 100Mi | 驱逐低优先级 Pod、扩容节点 |
| `PIDPressure` | 节点 PID 使用 > 90% | 限制 Pod PID、清理僵尸进程 |
| `NetworkUnavailable` | CNI 未就绪 | 检查 CNI Pod、路由、网卡 |

---

## 4. 网络问题

### 4.1 Service 无法访问

```bash
# 1. 看 Service 是否有 Endpoint
kubectl get svc <svc-name> -n <ns>
kubectl get endpoints <svc-name> -n <ns>

# 2. 看 EndpointSlice
kubectl get endpointslices -n <ns> -l kubernetes.io/service-name=<svc-name>

# 3. 看 kube-proxy 规则
kubectl logs -n kube-system -l k8s-app=kube-proxy

# 4. 在 Pod 内测试
kubectl run tmp --image=nicolaka/netshoot -it --rm -- /bin/bash
curl http://<svc-name>.<ns>.svc.cluster.local:<port>
```

**常见根因**：
- Label Selector 不匹配 → Endpoint 为空
- Pod 未 Ready → 未加入 Endpoint
- kube-proxy 规则未同步 → 重启 kube-proxy Pod
- NetworkPolicy 拦截 → 检查 policy

### 4.2 DNS 解析失败

```bash
# 看 CoreDNS Pod
kubectl get pods -n kube-system -l k8s-app=kube-dns

# 看 CoreDNS 日志
kubectl logs -n kube-system -l k8s-app=kube-dns --tail=200

# 在业务 Pod 内测试
nslookup kubernetes.default.svc.cluster.local
```

**根因**：
- CoreDNS Pod 未运行或 OOM
- Corefile 配置错误
- 节点 `/etc/resolv.conf` 被污染
- 网络策略拦截 CoreDNS 53 端口

### 4.3 Ingress 返回 502/503

```bash
# 看 Ingress Controller 日志
kubectl logs -n ingress-nginx -l app.kubernetes.io/name=ingress-nginx --tail=200

# 看后端 Service Endpoint
kubectl get endpoints <backend-svc> -n <ns>

# 看 Ingress 规则
kubectl get ingress <name> -n <ns> -o yaml
```

**根因**：
- 后端 Pod 未 Ready
- Service 端口配置错
- Ingress 路径或 host 不匹配
- 负载均衡器健康检查失败

### 4.4 NetworkPolicy 导致拦截

```bash
# 列出所有 NetworkPolicy
kubectl get networkpolicy --all-namespaces

# 临时测试：删除 policy（仅在测试环境）
kubectl delete networkpolicy <name> -n <ns>  # ⚠️ HIGH-RISK — 删除 K8s 资源，服务可能中断 [回滚：见文档/备份]
```

---

## 5. 存储问题

### 5.1 PVC Pending

```bash
kubectl describe pvc <pvc-name> -n <ns>
kubectl get storageclass
kubectl describe storageclass <sc-name>
```

**根因**：
- 没有默认 StorageClass
- StorageClass 的 provisioner 未部署
- 参数不匹配（如 zone、磁盘类型）
- 底层存储资源耗尽

### 5.2 Volume 挂载失败

```bash
kubectl describe pod <pod-name> -n <ns>
kubectl get events --field-selector involvedObject.name=<pod-name> -n <ns>
```

**常见事件**：
- `AttachVolume.Attach failed`：卷已attach到另一节点，需等 detach
- `FailedMount`：mount 参数错误、文件系统损坏
- `Unable to mount volumes`：CSI driver 未响应

### 5.3 有状态 Pod 重建后无法启动

**根因**：
- StatefulSet 的 volumeClaimTemplates 与已有 PVC 冲突
- Pod 名变化导致 PVC 名不匹配
- 旧 Pod 未完全终止，volume 仍被占用

---

## 6. 调度问题

### 6.1 Pod 不可调度

```bash
kubectl describe pod <pod-name> -n <ns> | grep -A 20 "Events"
```

**典型事件及处理**：

| 事件 | 含义 | 处理 |
|------|------|------|
| `0/3 nodes are available: 3 Insufficient cpu` | CPU 不足 | 降配、扩容节点、HPA |
| `0/3 nodes are available: 1 node(s) had taint {dedicated: }, that the pod didn't tolerate` | 污点未容忍 | 加 toleration 或换节点 |
| `0/3 nodes are available: 2 node(s) didn't match Pod's node affinity` | 亲和性不满足 | 调整 nodeSelector/affinity |
| `0/3 nodes are available: 1 node(s) had volume node affinity conflict` | 拓扑约束与卷冲突 | 检查 StorageClass 的 allowedTopologies |
| `Max node count reached` | 集群扩容上限 | 调整 AutoScaler 上限 |

### 6.2 调度优化

```bash
# 看节点资源分配
kubectl top node

# 看 Pod 资源使用
kubectl top pod -n <ns>
```

---

## 7. 控制平面问题

### 7.1 API Server 不可访问

```bash
# 看 API Server Pod
kubectl get pods -n kube-system -l component=kube-apiserver
kubectl logs -n kube-system -l component=kube-apiserver --tail=200

# 看证书
openssl x509 -in /etc/kubernetes/pki/apiserver.crt -noout -text | grep Not
```

**根因**：
- etcd 不可用
- 证书过期
- 网络分区
- 请求限流

### 7.2 etcd 异常

```bash
# 看 etcd Pod
kubectl get pods -n kube-system -l component=etcd
kubectl logs -n kube-system -l component=etcd --tail=200

# etcdctl 检查健康
ETCDCTL_API=3 etcdctl --cacert=/etc/kubernetes/pki/etcd/ca.crt \
  --cert=/etc/kubernetes/pki/etcd/server.crt \
  --key=/etc/kubernetes/pki/etcd/server.key \
  endpoint health
```

**根因**：
- 磁盘 IO 延迟高（>100ms 会告警）
- 存储空间不足
- 网络分区导致 leader 选举
- 数据碎片过多

### 7.3 Scheduler / Controller Manager 异常

```bash
kubectl get pods -n kube-system -l component=kube-scheduler
kubectl logs -n kube-system -l component=kube-scheduler --tail=200

kubectl get pods -n kube-system -l component=kube-controller-manager
kubectl logs -n kube-system -l component=kube-controller-manager --tail=200
```

---

## 8. 应用层问题

### 8.1 探针失败

```bash
# 看探针配置
kubectl get pod <pod-name> -n <ns> -o yaml | grep -A 20 "livenessProbe\|readinessProbe"

# 看事件
kubectl describe pod <pod-name> -n <ns> | grep -A 5 "Unhealthy"
```

**处理**：
- `livenessProbe` 太敏感 → 调大 initialDelaySeconds / failureThreshold
- `readinessProbe` 失败 → 检查依赖服务是否就绪
- 端口或路径配置错

### 8.2 高错误率 / 慢响应

```bash
# 看应用日志
kubectl logs <pod-name> -n <ns> --tail=500

# 进入容器
kubectl exec -it <pod-name> -n <ns> -- /bin/sh

# 看资源使用
kubectl top pod <pod-name> -n <ns>
```

---

## 9. 阿里云专有云排障要点

在阿里云专有云（Apsara Stack）环境中，K8s 集群通常由 **天基 Tianji** 部署与托管，ACK 专有版或敏捷版作为容器服务入口，**ASCM** 作为运维控制台。工单排查需要多一层云平台视角。

### 9.1 专有云特有排查入口

| 组件 | 作用 | 排查命令 / 入口 |
|------|------|----------------|
| **天基 Tianji** | 专有云底座部署与生命周期管理 | 天基控制台看集群状态、机器列表、OpsBox |
| **ASCM** | 统一运维控制台 | 查看项目/资源集、告警、事件、配额 |
| **洛神 Luoshen** | 专有云平台网络 | 检查 VPC、VSwitch、SLB、EIP、路由 |
| **盘古 Pangu** | 分布式存储 | 检查块存储、NAS、OSS 状态与配额 |
| **女娲 Nüwa** | 分布式协同与元数据 | 检查命名服务、分布式锁、配置中心 |
| **神龙 X-Dragon** | 弹性裸金属 / MOC 卡 | 检查裸金属节点、网络加速 |

### 9.2 专有云常见工单场景

#### 场景 1：ACK 集群节点 NotReady

1. ASCM 查看该节点告警。
2. 天基 OpsBox 登录对应机器。
3. 检查神龙 MOC 卡状态、洛神网卡、盘古磁盘。
4. 检查 kubelet / containerd 是否被 Tianji agent 重启。
5. 检查 `/var/log/messages` 与 Tianji 运维日志。

#### 场景 2：LoadBalancer Service 一直 Pending

1. 确认 Cloud Controller Manager 是否运行：
   ```bash
   kubectl get pods -n kube-system | grep cloud-controller
   ```
2. ASCM 查看洛神 SLB 配额与状态。
3. 检查 CCM 日志中的报错（如权限不足、VSwitch 无可用 IP）。

#### 场景 3：PVC 无法绑定

1. 确认 StorageClass 使用的是专有云 CSI driver（如 diskplugin.csi.alibabacloud.com）。
2. 盘古/块存储控制台查看磁盘余量与 zone 匹配。
3. 检查 CSI controller / node plugin Pod 是否 Running。

#### 场景 4：镜像拉取失败

1. 专有云通常使用私有 ACR/ACR EE 或本地 Harbor。
2. 检查节点到镜像仓库的网络策略（洛神安全组、NetworkPolicy）。
3. 检查 imagePullSecret 是否正确挂载。

### 9.3 专有云日志收集命令

```bash
# 收集节点诊断信息
kubectl diagnose node <node-name>

# 收集 Pod 诊断信息
kubectl diagnose pod <pod-name> -n <ns>

# 天基 OpsBox 上查看集群事件
tianji-cli cluster events <cluster-id>

# ASCM 导出告警（伪命令，需按实际接口）
ascm-cli alert list --cluster <cluster-id> --status active
```

---

## 10. 常用一键巡检脚本

### 10.1 集群健康快照

```bash
#!/bin/bash
# k8s-health-snapshot.sh
OUT=/tmp/k8s-snapshot-$(date +%Y%m%d-%H%M%S).txt
echo "=== Nodes ===" >> $OUT
kubectl get nodes -o wide >> $OUT

echo -e "\n=== Pods Not Running ===" >> $OUT
kubectl get pods --all-namespaces --field-selector status.phase!=Running,status.phase!=Succeeded >> $OUT

echo -e "\n=== Top Nodes ===" >> $OUT
kubectl top nodes >> $OUT 2>/dev/null || echo "metrics-server unavailable" >> $OUT

echo -e "\n=== Events Warning ===" >> $OUT
kubectl get events --all-namespaces --field-selector type=Warning --sort-by='.lastTimestamp' | tail -50 >> $OUT

echo "Snapshot saved to $OUT"
```

### 10.2 Pod 异常快速定位

```bash
#!/bin/bash
# pod-debug.sh <namespace>
NS=${1:-default}
kubectl get pods -n $NS --no-headers | awk '{print $1}' | while read pod; do
  status=$(kubectl get pod $pod -n $NS -o jsonpath='{.status.phase}')
  if [[ "$status" != "Running" && "$status" != "Succeeded" ]]; then
    echo "=== $pod ($status) ==="
    kubectl describe pod $pod -n $NS | tail -20
    kubectl logs $pod -n $NS --previous 2>/dev/null | tail -20
  fi
done
```

### 10.3 节点资源压力检查

```bash
#!/bin/bash
# node-pressure.sh
kubectl get nodes -o json | jq -r '
  .items[] |
  "Node: \(.metadata.name) | Ready: \(.status.conditions[] | select(.type=="Ready") | .status) | " +
  "Pressure: \([.status.conditions[] | select(.type!="Ready" and .status=="True") | .type] | join(","))"
'
```

---

## Related

- [[概念/pod|Pod]] — K8s 最小调度单元
- [[概念/deployment|Deployment]] — 无状态工作负载
- [[概念/service|Service]] — 服务发现与负载均衡
- [[概念/cni|CNI]] — 容器网络接口
- [[概念/csi|CSI]] — 容器存储接口
- [[概念/persistent-volume-claim|PVC]] — 持久卷声明
- [[12_架构基建/Kubernetes_Core_Components_Deep_Dive|Kubernetes 核心组件深度解析]]
- [[12_架构基建/Kubernetes_Networking_Deep_Dive|Kubernetes 网络深度解析]]
- [[12_架构基建/Kubernetes_Storage_Deep_Dive|Kubernetes 存储深度解析]]
- [[13_运维/02_SRE_Reliability/AI_Incident_Response_Playbook|AI 事故响应 Playbook]]
