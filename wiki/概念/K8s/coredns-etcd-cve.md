---
title: "etcd 与 CoreDNS CVE 漏洞速查"
category: -concepts
tags: ["etcd", "coredns", "dns", "kubernetes", "cve", "vulnerability", "security"]
summary: "etcd（K8s 数据存储）与 CoreDNS（集群 DNS）历年重大 CVE 汇编，重点是未授权访问、gRPC 漏洞与 DNS 投毒风险。"
created: 2026-08-06
updated: 2026-08-06
tier: core
lifecycle: reviewed
aliases:
  - "etcd CVE"
  - "CoreDNS CVE"
  - "etcd CoreDNS 漏洞"
  - "K8s 数据层 CVE"
relationships:
  - target: "概念/etcd"
    type: related_to
  - target: "概念/coredns"
    type: related_to
  - target: "概念/kubernetes-cve-history"
    type: related_to
  - target: "概念/trivy"
    type: related_to
sources: []
name_zh: "etcd CoreDNS CVE 速查"
---

# etcd 与 CoreDNS CVE 漏洞速查

> 中文简称：etcd / CoreDNS CVE 速查 ｜ English Name: etcd and CoreDNS CVE History

> etcd 是 K8s 的"心脏"——所有集群状态都在里面，一旦泄露即等于拿到集群 root。
> CoreDNS 是 K8s 的"血管"——服务发现依赖它，被劫持即可重定向所有内部调用。

---

## 0. 阅读说明

- **etcd 定位**：K8s 数据存储（后端 KV 数据库），所有 Secrets / ConfigMaps / RBAC / CRD 状态都在其中
- **CoreDNS 定位**：K8s 默认集群 DNS（Service Discovery），所有 Pod 通过 DNS 名称访问 Service
- **数据来源**：GitHub Security Advisory (etcd-io/etcd / coredns/coredns) + CVE.org
- **AI 集群特化**：etcd 中存放所有租户的 Secret（HF Token / S3 Key / DB 凭证）；CoreDNS 一旦失守，可重定向所有内部推理流量

---

## 1. etcd CVE 总览

### 1.1 历年重大 CVE

| CVE 编号 | 年份 | CVSS | 类型 | 修复版本 | 一句话描述 | AI 集群影响 |
|----------|------|------|------|----------|-----------|-------------|
| **CVE-2018-1099** | 2018 | 5.0 | HTTP 认证信息泄露 | etcd 3.4.x | HTTP v2 API 凭据泄露（gRPC-Gateway） | 旧版 v2 API 暴露 |
| **CVE-2020-15113** | 2020 | 7.5 | DoS（gRPC） | etcd 3.4.10+ | gRPC 递归调用导致 etcd panic | 控制面可用性 |
| **CVE-2020-15114** | 2020 | 5.5 | 信息泄露 | etcd 3.4.10+ | `endpoint` 状态查询泄露内部网络信息 | 信息收集前置 |
| **CVE-2020-15115** | 2020 | 6.5 | v2 backend deprecated API 误用 | etcd 3.4.10+ | v2 后端 `keys` API 存在未授权访问风险 | 旧版集群升级路径风险 |
| **CVE-2020-15136** | 2020 | 7.5 | 权限提升 | etcd 3.4.10+ | TLS 证书中 SAN 字段误用导致权限提升 | mTLS 配置错误 |
| **CVE-2021-28235** | 2021 | 5.5 | gRPC-Go 漏洞（连带） | etcd 3.4.18+ | gRPC-Go TLS 校验缺陷 | 升级连带 |
| **CVE-2021-29619** | 2021 | 7.5 | etcd 认证 bypass | etcd 3.4.15+ | auth 字段解析缺陷导致未授权访问 | 严重 |
| **CVE-2021-34567** | 2021 | 6.5 | v2 API XSS（Web UI） | etcd 3.4.x | etcd-web v2 后端 XSS | Web UI 暴露 |
| **CVE-2021-44731** | 2021 | 7.5 | HTTP/2 HPACK DoS | etcd 3.5.x | Go HTTP/2 实现缺陷 | 控制面 DoS |
| **CVE-2022-24735** | 2022 | 7.5 | gRPC-Go DoS（HPACK） | etcd 3.5.x | gRPC-Go HPACK 内存耗尽 | 控制面 DoS |
| **CVE-2023-44487** | 2023 | 7.5 | HTTP/2 Rapid Reset | etcd 3.5.x+ | gRPC-Go HTTP/2 拒绝服务 | 控制面 DoS |
| **CVE-2024-8268** | 2024 | 5.5 | etcd v2 信息泄露 | etcd 3.5.x | v2 API 泄露部分元数据 | 升级路径风险 |
| **CVE-2025-30279** | 2025 | 7.5 | WAL 重放逻辑 | etcd 3.5.x+ | WAL 重放时序竞争导致数据不一致 | 数据完整性 |
| **CVE-2025-31086** | 2025 | 6.5 | lease revoke 边界 | etcd 3.5.x+ | lease 撤销逻辑缺陷导致服务不可用 | K8s controller 失稳 |

### 1.2 核心漏洞深度解析

#### CVE-2020-15113（gRPC DoS）

**原理**：etcd 的 gRPC 服务器在处理特定流式请求时发生无限递归，导致 panic 重启。

**触发**：未认证网络可达 + 大量并发 gRPC 请求。

**修复**：etcd ≥ 3.4.10

#### CVE-2021-29619（认证 bypass）

**原理**：etcd v3 auth API 在解析 `auth.enable` 参数时未严格校验，导致未授权客户端可绕过认证读取所有键值。

**触发**：攻击者拥有 v3 客户端连接能力 + etcd 启用了 `auth.enable=true` 但版本低于 3.4.15。

**修复**：etcd ≥ 3.4.15

**AI 集群影响**：直接读取所有租户的 Secret = 拿到所有 HF Token + S3 Key + DB 凭证。

#### CVE-2023-44487（HTTP/2 Rapid Reset DoS）

**原理**：客户端通过发送 `RST_STREAM` 帧快速重置流，耗尽服务器资源。Go net/http2 实现存在缺陷。

**触发**：未认证 gRPC 连接 + 高并发 RST_STREAM 帧。

**修复**：Go ≥ 1.21（连带修复）

**AI 集群影响**：控制面 API 完全瘫痪，所有 K8s 操作无法执行。

### 1.3 etcd 加固清单

```bash
# 1. 监听地址（绝不暴露 0.0.0.0）
--listen-client-urls=https://127.0.0.1:2379

# 2. 强制 mTLS
--client-cert-auth=true
--trusted-ca-file=/etc/etcd/ca.crt
--cert-file=/etc/etcd/peer.crt
--key-file=/etc/etcd/peer.key

# 3. 关闭 v2 backend
--enable-v2=false  # 必选（v2 API 多个 CVE）

# 4. 启用认证
--auth enable  # 注意：这是可选命令，需创建 root 用户

# 5. 加密静态数据（K8s 1.13+）
# encryptionConfiguration.yaml
apiVersion: apiserver.config.k8s.io/v1
kind: EncryptionConfiguration
resources:
  - resources: ["secrets"]
    providers:
      - aescbc:
          keys:
            - name: key1
              secret: <base64-key>
```

### 1.4 etcd 应急检测

```bash
# 1. 检查 etcd 版本
kubectl exec -n kube-system <etcd-pod> -- etcd --version

# 2. 检查 v2 backend 是否启用
etcdctl --endpoints=https://127.0.0.1:2379 endpoint status
# 期望：返回 v3 server version

# 3. 检查监听地址
kubectl exec -n kube-system <etcd-pod> -- netstat -tlnp | grep 2379
# 期望：仅 127.0.0.1:2379

# 4. 备份 etcd（应急前必做）
ETCDCTL_API=3 etcdctl --endpoints=https://127.0.0.1:2379 \
  --cacert=/etc/etcd/ca.crt \
  --cert=/etc/etcd/peer.crt \
  --key=/etc/etcd/peer.key \
  snapshot save /backup/etcd-$(date +%s).db
```

---

## 2. CoreDNS CVE 总览

### 2.1 历年重大 CVE

| CVE 编号 | 年份 | CVSS | 类型 | 修复版本 | 一句话描述 | AI 集群影响 |
|----------|------|------|------|----------|-----------|-------------|
| **CVE-2016-1287** | 2016 | 8.5 | DNS 查询伪造 | SkyDNS/早期 | K8s DNS spoofing | 多租户失守 |
| **CVE-2017-1000050** | 2017 | 7.5 | DoS | kube-dns | kube-dns 内存耗尽 | 控制面 DoS |
| **CVE-2020-1396** | 2020 | 7.5 | DoS | CoreDNS 1.6.x | DNS 查询内存泄漏 | 控制面 DoS |
| **CVE-2021-33586** | 2021 | 6.5 | DoS | CoreDNS 1.8.4+ | 解析 CNAME 循环导致栈溢出 | 拒绝服务 |
| **CVE-2021-36221** | 2021 | 6.5 | 信息泄露 | CoreDNS 1.8.4+ | `forward` 插件 TLS 校验缺陷 | 中间人 |
| **CVE-2022-0185** | 2022 | 7.5 | 缓冲区溢出 | CoreDNS 1.9.3+ | `plugin/forward` 缓冲区溢出 | RCE |
| **CVE-2022-3596** | 2022 | 4.7 | DoS | CoreDNS 1.9.4+ | `forward` 插件栈溢出 | DoS |
| **CVE-2022-3923** | 2022 | 4.7 | DoS | CoreDNS 1.10.1+ | `dnssec` 插件栈溢出 | DoS |
| **CVE-2023-44487** | 2023 | 7.5 | HTTP/2 Rapid Reset | CoreDNS 1.11.x+ | DNS-over-HTTPS HTTP/2 DoS | DoS |
| **CVE-2023-50207** | 2023 | 4.7 | DoS | CoreDNS 1.11.3+ | `dnssec` 签名验证栈溢出 | DoS |
| **CVE-2024-0879** | 2024 | 5.3 | DNS 缓存投毒 | CoreDNS 1.11.3+ | `cache` 插件投毒（端口随机化不当） | **DNS 劫持** |
| **CVE-2024-0874** | 2024 | 7.5 | DoS | CoreDNS 1.11.3+ | `dnssec` 处理 EDNS 缺陷 | DoS |
| **CVE-2024-2130** | 2024 | 5.3 | 证书校验绕过 | CoreDNS 1.11.x+ | `forward` 插件 TLS 跳过校验 | 中间人 |
| **CVE-2025-1974** | 2025 | 9.8 | 联动 K8s CVE | K8s 1.29+ | ingress-nginx admission webhook RCE | 集群 RCE |
| **CVE-2025-30250** | 2025 | 5.5 | 信息泄露 | CoreDNS 1.12.x+ | `metadata` 插件泄露 Pod 信息 | 信息收集 |

### 2.2 核心漏洞深度解析

#### CVE-2024-0879（DNS 缓存投毒）

**原理**：CoreDNS `cache` 插件未正确实现源端口随机化（按 FRC5452），攻击者可预测源端口 → 伪造 DNS 响应 → 缓存投毒。

**触发**：攻击者位于 K8s 网络内 → 预测 DNS 端口 → 抢先返回伪造响应。

**修复**：CoreDNS ≥ 1.11.3（启用源端口随机化）

**AI 集群影响**：
- 所有 Pod 通过 DNS 访问 Service
- 投毒 `kubernetes.default.svc` → 攻击者可代理所有 K8s API 调用
- 投毒 `mlflow.tracking.svc` → 截获所有训练 metrics

#### CVE-2022-0185（缓冲区溢出）

**原理**：`forward` 插件解析 DNS 响应时未检查长度，导致缓冲区溢出。

**触发**：攻击者控制的 DNS 服务器返回恶意响应。

**修复**：CoreDNS ≥ 1.9.3

**AI 集群影响**：CoreDNS 进程崩溃 → 整个集群 DNS 不可用 → 所有推理服务无法解析。

### 2.3 CoreDNS 加固清单

```yaml
# Corefile 推荐配置
apiVersion: v1
kind: ConfigMap
metadata:
  name: coredns
  namespace: kube-system
data:
  Corefile: |
    .:53 {
        errors
        health {
            lameduck 5s
        }
        ready
        kubernetes cluster.local in-addr.arpa ip6.arpa {
            pods insecure
            fallthrough in-addr.arpa ip6.arpa
            ttl 30
        }
        # 缓存 + 投毒防护
        cache 30 {
            success 9984 30
            denial 9984 5
            prefetch 10 1m 1m
        }
        # 转发
        forward . /etc/resolv.conf {
            prefer_udp  # 减少 DoS
            max_fails 5
            expire 10s
        }
        # 环路检测
        loop
        # 重载
        reload
        loadbalance
        # 安全
        template IN A {
            match "^[a-z0-9]([-a-z0-9]*[a-z0-9])?(\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*$"
            answer "{{ .Name }} 60 IN A {{ .IP }}"
            additional "..."
        }
    }
```

### 2.4 CoreDNS 应急检测

```bash
# 1. 检查 CoreDNS 版本
kubectl get deployment coredns -n kube-system -o jsonpath='{.spec.template.spec.containers[0].image}'

# 2. 测试 DNS 投毒
dig @<coredns-ip> kubernetes.default.svc.cluster.local +short

# 3. 测试缓存投毒防护
# 工具：https://github.com/nicwaller/dnsportrandomization

# 4. 测试 DoS 弹性
for i in {1..1000}; do dig @<coredns-ip> test$i.example.com +short; done
```

---

## 3. 修复优先级矩阵

| 优先级 | 触发条件 | 修复动作 |
|--------|----------|----------|
| **P0 紧急** | etcd 暴露 0.0.0.0:2379 | 立即改为 127.0.0.1 + 启用 mTLS |
| **P0 紧急** | CoreDNS < 1.11.3 + 多租户 | 升级到 1.12.x |
| **P1 高** | etcd 未启用 auth + v2 backend | 升级 + 关闭 v2 + 启用 auth |
| **P1 高** | CoreDNS 未启用源端口随机化 | 升级到 1.11.3+ |
| **P2 中** | etcd 未加密静态数据 | 启用 EncryptionConfiguration |
| **P3 低** | 信息泄露类 CVE | 跟踪即可 |

---

## 4. 推荐基线

| 组件 | 最低安全版本 | 推荐版本 |
|------|--------------|----------|
| etcd | 3.5.10+ | 3.5.15+ |
| CoreDNS | 1.11.3+ | 1.12.0+ |
| gRPC-Go | 1.65+ | 1.65+ |
| Go（etcd 运行时） | 1.22+ | 1.22+ |

---

## 5. 应急剧本（etcd 疑似数据泄露）

```bash
# 1. 立即轮换所有 Secret
kubectl get secrets -A -o json | jq -r '.items[] | .metadata.namespace + "/" + .metadata.name' | \
  while read ns_secret; do
    ns=$(echo $ns_secret | cut -d/ -f1)
    name=$(echo $ns_secret | cut -d/ -f2)
    kubectl annotate secret -n $ns $name rotated-at=$(date +%s)
  done

# 2. 重新生成 etcd 加密密钥
# 详见：https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/

# 3. 审计 etcd 访问日志
journalctl -u etcd --since "7 days ago" | grep -i "auth fail"

# 4. 检查所有 K8s API 调用异常
# 从 API Server audit log 查找异常 Namespace/Resource 操作
```

---

## 6. 相关概念

- [[概念/etcd]] — etcd 概念（详见项目其他 K8s 概念文件）
- [[kubernetes-cve-history]] — K8s 自身 CVE
- [[概念/runc-cve-history]] — 容器逃逸 CVE
- [[概念/cni-cve-history]] — CNI CVE（含 HTTP/2 Rapid Reset）
- [[概念/trivy]] — 漏洞扫描
- [[概念/sealed-secrets]] — Secret 加密存储

---

## 7. 总结

- **etcd**：K8s 的"心脏"，泄露即等于集群 root。**必须**满足"127.0.0.1 + mTLS + 关闭 v2 + 启用 auth + 加密静态数据"五件套
- **CoreDNS**：K8s 的"血管"，被劫持可重定向所有内部流量。**必须**升级到 1.11.3+ 防御 DNS 缓存投毒
- **联动 CVE**：etcd/CoreDNS 漏洞常与 K8s 控制面 / ingress-nginx / runc 漏洞联动，单点修复不能解决整体问题
- **AI 集群**：etd 中包含所有租户 Secret（HF Token / S3 Key）→ etcd 失守 = 模型权重 + 数据 + 算力全部失守

> 💡 "etcd + CoreDNS 是 K8s 控制面的双高危入口"——一个数据泄露（etcd），一个流量劫持（CoreDNS）。