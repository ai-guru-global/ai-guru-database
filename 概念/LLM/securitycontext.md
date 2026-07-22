---
title: SecurityContext
category: concepts
tags: ["kubernetes", "security", "container", "k8s", "cloud-native"]
summary: "SecurityContext 是 Kubernetes Pod/Container 级别的安全配置字段，用于声明运行身份、权限提升、Capabilities、文件系统访问等安全属性。"
created: 2026-07-02
updated: 2026-07-21
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

- [[概念/container-security|Container Security]]
- [[概念/pod-security-standards|Pod Security Standards]]
- [[概念/runtime-security|Runtime Security]]
- [[概念/rbac|RBAC]]
- [[概念/secret|Secret]]
- [[概念/serviceaccount|ServiceAccount]]
- [[概念/kubernetes|Kubernetes]]

---

## 2026 SecurityContext 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **Pod Security Admission (PSA)** | 替代 PodSecurityPolicy，命名空间级安全策略强制执行 | GA |
| **seccompProfile RuntimeDefault** | 默认 seccomp 配置，限制危险系统调用 | GA |
| **AppArmor 集成** | K8s 1.30+ 原生支持 AppArmor 配置文件 | GA |
| **User Namespaces** | 容器内 root 映射到宿主机非特权用户，防止逃逸 | Beta |
| **Kyverno/OPA 策略校验** | 自动拒绝不符合安全基线的 SecurityContext 配置 | GA |

## 生产最佳实践

1. **禁止特权模式**：生产环境必须设置 `privileged: false`，避免容器逃逸风险
2. **非 root 运行**：设置 `runAsNonRoot: true` + 指定 UID/GID，降低提权攻击面
3. **只读根文件系统**：启用 `readOnlyRootFilesystem: true`，防止恶意文件写入
4. **最小化 Capabilities**：`drop: ALL` 后按需添加必要能力，避免过度授权
5. **PSA restricted 级别**：生产 Namespace 启用 `pod-security.kubernetes.io/enforce: restricted`
6. **seccomp 默认配置**：始终设置 `seccompProfile.type: RuntimeDefault`
7. **定期审计**：用 Kyverno/OPA 自动检测不合规配置

## 完整 YAML 示例

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: llm-inference
  labels:
    app: llm-serving
spec:
  securityContext:
    runAsNonRoot: true
    runAsUser: 1000
    runAsGroup: 1000
    fsGroup: 1000
    seccompProfile:
      type: RuntimeDefault
  containers:
  - name: vllm
    image: vllm/vllm-openai:latest
    securityContext:
      privileged: false
      allowPrivilegeEscalation: false
      readOnlyRootFilesystem: true
      capabilities:
        drop:
        - ALL
    volumeMounts:
    - name: model-cache
      mountPath: /tmp
    - name: model-weights
      mountPath: /models
      readOnly: true
    resources:
      limits:
        nvidia.com/gpu: 1
        memory: "32Gi"
  volumes:
  - name: model-cache
    emptyDir: {}
  - name: model-weights
    persistentVolumeClaim:
      claimName: model-pvc
```

## AI 推理服务特殊考虑

| 场景 | 安全要求 | 配置建议 |
|------|----------|----------|
| **GPU 推理服务** | 限制 GPU 访问权限 | 通过 Device Plugin 控制 GPU 分配 |
| **多租户模型服务** | 租户间模型权重隔离 | 独立 UID + ReadOnly PVC |
| **Agent 代码执行** | 防止恶意代码逃逸 | 严格 seccomp + 只读 FS + 非 root |
| **训练任务** | 保护训练数据 | fsGroup 控制共享存储访问 |
| **模型下载** | 防止供应链攻击 | 只读挂载 + 校验和验证 |

## 常见问题排查

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| Pod 被拒绝创建 | PSA enforce 策略不满足 | 检查 SecurityContext 是否符合 restricted 级别 |
| 容器内无法写入文件 | readOnlyRootFilesystem | 挂载 emptyDir 到需要写入的路径 |
| 权限拒绝 (Permission Denied) | UID 不匹配卷所有权 | 设置 fsGroup 或 initContainer chown |
| GPU 不可用 | 缺少 NVIDIA 运行时权限 | 确保 Device Plugin 正确配置 |
| 网络绑定失败 | drop ALL 后缺少 NET_BIND_SERVICE | 添加必要 capability 或用高端口 |

## 安全审计检查清单

```yaml
# Kyverno 策略示例：禁止特权容器
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: disallow-privileged
spec:
  validationFailureAction: Enforce
  rules:
  - name: deny-privileged-containers
    match:
      resources:
        kinds: ["Pod"]
    validate:
      message: "Privileged mode is not allowed"
      pattern:
        spec:
          containers:
          - securityContext:
              privileged: false
```

## 与 AI 安全的关系

在 AI 系统部署中，SecurityContext 是多层安全体系的基础层：

```
应用层安全: 输入过滤 / 输出审核 / 护栏 (Guardrails)
    ↓
网络安全: NetworkPolicy / mTLS / API Gateway
    ↓
运行时安全: SecurityContext / seccomp / AppArmor  ← 本卡片
    ↓
基础设施: 节点加固 / 内核更新 / 镜像扫描
```

对于 Agent 系统，SecurityContext 尤其重要——Agent 可能执行任意代码、调用外部工具，必须通过严格的容器安全配置限制其影响范围。

## 快速检查清单

- [ ] `privileged: false` 已设置
- [ ] `runAsNonRoot: true` 已设置
- [ ] `readOnlyRootFilesystem: true` 已设置
- [ ] `allowPrivilegeEscalation: false` 已设置
- [ ] `capabilities.drop: ALL` 已设置
- [ ] `seccompProfile.type: RuntimeDefault` 已设置
- [ ] PSA restricted 级别已启用
- [ ] Kyverno/OPA 策略已配置
