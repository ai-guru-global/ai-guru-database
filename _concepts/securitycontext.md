---
title: SecurityContext
category: concepts
tags: ["kubernetes", "security", "container", "k8s", "cloud-native"]
summary: "SecurityContext 是 Kubernetes Pod/Container 级别的安全配置字段，用于声明运行身份、权限提升、Capabilities、文件系统访问等安全属性。"
created: 2026-07-02
updated: 2026-07-02
sources: []
---

# SecurityContext

> **一句话理解**：SecurityContext 是 Kubernetes 为 Pod 或容器声明「以谁的身份运行、能做什么事、能访问哪些资源」的安全配置字段。

## 定义

SecurityContext 是 Kubernetes API 中用于控制 Pod 与容器运行时安全属性的字段，分别在 PodSpec（`securityContext`）和 ContainerSpec（`securityContext`）中声明。它决定了进程的用户/组身份、特权能力、文件系统权限、系统调用约束等，是实现最小权限原则、防止容器逃逸与横向移动的基础机制。

在 AI 系统的生产部署中，SecurityContext 是保障大模型推理服务、训练任务、Agent 运行时安全的第一道防线；配置不当往往是容器逃逸、提权攻击和数据泄露的直接诱因。

## 核心组成

SecurityContext 分为 Pod 级别与容器级别，二者可叠加，容器级设置会覆盖 Pod 级同名设置。

**Pod 级别常用字段**：

- `runAsNonRoot`：强制容器以非 root 用户启动。
- `runAsUser` / `runAsGroup`：指定容器内主进程的 UID/GID。
- `fsGroup`：指定卷挂载后文件的组所有权，常用于共享存储。
- `supplementalGroups`：附加组 ID，控制对特定资源的访问。
- `seccompProfile`：限制容器可使用的 Linux 系统调用。
- `sysctls`：允许配置特定的内核参数（需谨慎使用）。

**容器级别常用字段**：

- `privileged`：是否以特权模式运行，生产环境通常必须为 `false`。
- `allowPrivilegeEscalation`：是否允许进程通过 setuid 等方式提升权限。
- `readOnlyRootFilesystem`：是否将根文件系统挂载为只读。
- `capabilities.add/drop`：增删 Linux capabilities，实现最小权限。
- `runAsUser` / `runAsGroup`：覆盖 Pod 级别设置。
- `seLinuxOptions`：配置 SELinux 安全标签。
- `seccompProfile` / `appArmorProfile`：进一步限制系统调用与强制访问控制行为。

## 典型用例

1. **限制 root 运行**：设置 `runAsNonRoot: true`，即使镜像默认入口为 root，也会被 API Server 拒绝，降低容器逃逸后获得宿主机 root 的风险。
2. **只读根文件系统**：`readOnlyRootFilesystem: true` 防止攻击者通过篡改容器内可执行文件或写入恶意脚本维持权限。
3. **最小化 Capabilities**：`capabilities: drop: - ALL` 移除所有特权能力，按需仅保留 `NET_BIND_SERVICE` 等必要能力。
4. **防止提权**：`allowPrivilegeEscalation: false` 禁止进程通过 setuid 二进制文件获取更高权限。
5. **AI 推理服务隔离**：在多租户 GPU 集群中，通过 SecurityContext 限制模型服务容器的 UID/GID 与卷访问权限，避免不同租户读取彼此的模型权重、缓存或日志。

## 与相关概念的区别与联系

- **Pod Security Standards / Pod Security Admission**：PSA 是集群层面的策略框架，定义了 Pod 安全的「红绿灯」级别；SecurityContext 是 Pod 自身声明的具体安全属性，PSA 会校验 SecurityContext 是否满足对应级别。
- **RBAC**：RBAC 控制「谁可以对 Kubernetes API 做什么」，SecurityContext 控制「容器在节点上运行时拥有什么操作系统级权限」。
- **NetworkPolicy**：NetworkPolicy 负责 Pod 之间的网络层隔离，SecurityContext 负责节点与进程层隔离，二者互补。
- **Runtime Security / Falco**：SecurityContext 是静态的预防性配置，Runtime Security 是动态的异常行为检测，二者形成纵深防御。
- **Secret**：Secret 管理敏感数据的存储与注入，SecurityContext 管理数据注入后容器内进程能否访问、以何种身份访问。

## Related

- [[_concepts/container-security|Container Security]]
- [[_concepts/pod-security-standards|Pod Security Standards]]
- [[_concepts/runtime-security|Runtime Security]]
- [[_concepts/rbac|RBAC]]
- [[_concepts/secret|Secret]]
- [[_concepts/serviceaccount|ServiceAccount]]
- [[_concepts/kubernetes|Kubernetes]]
