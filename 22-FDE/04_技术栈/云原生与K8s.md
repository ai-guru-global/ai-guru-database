# 云原生与 K8s

## FDE 为什么需要云原生？

政企客户的 IT 环境通常是**混合异构**的：有物理机、有虚拟机、有私有云。FDE 需要统一的管理和部署方式。

## 最小可行 K8s 栈

### 轻量级 K8s 选型（政企环境友好）

| 方案 | 适用场景 | 资源需求 | 复杂度 |
|---|---|---|---|
| **k3s** | 单机/小集群 | 512MB 内存 | ⭐ |
| **k0s** | 纯容器化 | 1GB 内存 | ⭐⭐ |
| **MicroK8s** | Ubuntu 生态 | 540MB 内存 | ⭐ |
| **KubeEdge** | 边缘计算 | 256MB 内存 | ⭐⭐⭐ |

### FDE 最常用的 K8s 操作

```yaml
# 最小可用的 AI 服务部署
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ai-assistant
spec:
  replicas: 1
  template:
    spec:
      containers:
      - name: api
        image: ai-assistant:latest
        ports:
        - containerPort: 8000
        env:
        - name: MODEL_PATH
          value: /models/deepseek-7b
        volumeMounts:
        - name: models
          mountPath: /models
      volumes:
      - name: models
        hostPath:
          path: /data/models
```

### 容器化交付原则

1. **一服务一镜像**：每个微服务独立打包
2. **ConfigMap 管理配置**：不要把配置写死在镜像里
3. **Secret 管理敏感信息**：API Key、数据库密码
4. **Health Check 必须**：liveness + readiness probe
5. **资源限制必须**：CPU/Memory request + limit

## GitOps 交付模式

```
开发者 push 代码
    ↓
CI 构建镜像 + 跑测试
    ↓
推送镜像到 Registry
    ↓
ArgoCD 检测到变化
    ↓
自动同步到 K8s 集群
    ↓
客户环境更新完成
```

### GitOps 的核心价值
- 所有变更可追溯（Git 历史）
- 环境一致性（Dev/Staging/Prod 用同一套配置）
- 回滚简单（git revert + ArgoCD sync）

## IaC（基础设施即代码）

| 工具 | 适用场景 |
|---|---|
| **Terraform** | 多云/混合云 |
| **Pulumi** | 用 Python/TS 写 IaC |
| **Ansible** | 传统服务器管理 |
| **Helm** | K8s 应用打包 |

---

> **核心**：云原生不是目的，是手段。目的是让 FDE 能**快速、可靠、可重复地在任何客户环境中部署系统**。
