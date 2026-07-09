---
title: "AI Stack 容器与运行时指南"
category: "12-architecture-infrastructure"
tags: ["ai-stack", "container", "containerd", "nerdctl", "docker", "kubernetes", "cri"]
summary: "> **一句话理解**: AI Stack 以 containerd 为容器运行时，nerdctl/crictl/ctr 分别用于日常运维、K8s 调试和底层排障，docker/podman 用于开发或安全敏感场景。"
created: "2026-06-16"
updated: "2026-06-16"
tier: supporting
aliases:
  - "Ai Stack Container Runtime Guide"
  - "AI Stack Container Runtime Guide"
  - AI_Stack_Container_Runtime_Guide

---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](../../_meta/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->
# AI Stack 容器与运行时指南

> **一句话理解**: AI Stack 以 containerd 为容器运行时，`nerdctl`/`crictl`/`ctr` 分别用于日常运维、K8s 调试和底层排障，`docker`/`podman` 用于开发或安全敏感场景。

---

## 1. 工具选型矩阵

| 工具 | 用途 | 推荐场景 | 权限要求 |
|------|------|----------|----------|
| **nerdctl** | containerd 客户端，兼容 docker CLI | AI Stack 日常镜像/容器运维 | root 或 containerd 组 |
| **crictl** | K8s CRI 调试工具 | 排查 K8s 节点上的 Pod/容器 | root |
| **ctr** | containerd 原生 CLI | 极端调试、直接操作 containerd 元数据 | root |
| **docker** | 老牌容器管理 | 开发环境、非 K8s 场景 | docker 组 |
| **podman** | rootless 容器管理 | 安全敏感环境、无守护进程 | 普通用户 |

---

## 2. 常用命令

### 2.1 nerdctl

```bash
# 查看本地镜像
nerdctl images

# 拉取/导入镜像
nerdctl pull registry.example.com/asllm/qwen3-8b:v1.0
nerdctl load -i asllm-qwen3-8b.tar

# 运行容器（挂载模型目录、映射 GPU）
nerdctl run -d --name qwen3-8b \
  --gpus all \
  -v /data/models:/models:ro \
  -p 8000:8000 \
  registry.example.com/asllm/qwen3-8b:v1.0

# 查看容器日志
nerdctl logs -f qwen3-8b

# 进入容器排查
nerdctl exec -it qwen3-8b /bin/bash

# 停止并清理
nerdctl stop qwen3-8b
nerdctl rm qwen3-8b
```

### 2.2 crictl

```bash
# 列出节点上的 Pod/容器/镜像
crictl pods
crictl ps -a
crictl images

# 查看 Pod 详情（用于排查 Pending/CrashLoopBackOff）
crictl inspectp $(crictl pods -q -n <namespace> -s Ready)

# 查看容器日志
crictl logs <container-id>

# 进入容器
crictl exec -it <container-id> /bin/bash
```

### 2.3 ctr

```bash
# 直接查看 containerd 命名空间与镜像
ctr namespace ls
ctr -n k8s.io images ls

# 导出/导入原始镜像层（不推荐日常用）
ctr -n k8s.io images export /tmp/image.tar <image-ref>
ctr -n k8s.io images import /tmp/image.tar
```

### 2.4 docker（开发环境）

```bash
# 构建 asllm 镜像
docker build -t asllm/qwen3-8b:v1.0 -f Dockerfile.asllm .

# 保存镜像到 tar，再 nerdctl load 进生产节点
docker save asllm/qwen3-8b:v1.0 | gzip > asllm-qwen3-8b.tar.gz
```

### 2.5 podman（rootless）

```bash
# 无守护进程运行
podman run -d --name qwen3-8b \
  --device nvidia.com/gpu=all \
  -p 8000:8000 \
  asllm/qwen3-8b:v1.0
```

---

## 3. 生产环境 Checklist

- [ ] 生产节点已加入 containerd 用户组或配置 sudo 免密，避免直接用 root 执行 `nerdctl`。
- [ ] 镜像仓库使用私有 registry 并配置镜像签名/扫描，禁止未验证镜像上线。
- [ ] asllm 镜像标签使用 `<model>-<version>-<accelerator>` 三段式，例如 `qwen3-8b-v2.1-nvidia`。
- [ ] 模型目录以只读卷挂载（`:ro`），避免容器内误写。
- [ ] GPU 容器运行时（nvidia-container-runtime 或对应国产方案）已正确注册到 containerd `/etc/containerd/config.toml`。
- [ ] 关键容器配置 restart policy 和资源限制（memory、shm-size）。
- [ ] 日志落盘路径统一，避免写爆 rootfs。

---

## 4. 故障排查速查

| 现象 | 排查命令 | 常见原因 |
|------|----------|----------|
| 容器无法启动 | `nerdctl logs <id>` / `crictl logs <id>` | 镜像拉取失败、GPU 设备未挂载、entrypoint 错误 |
| GPU 未识别 | `nerdctl exec <id> nvidia-smi` | nvidia-container-runtime 未配置、驱动不匹配 |
| 镜像拉取慢/失败 | `nerdctl pull --debug <img>` | 仓库鉴权过期、网络策略限制 |
| Pod 状态 Pending | `crictl pods`、`kubectl describe pod` | 镜像不存在、CNI 未就绪、节点资源不足 |
| 容器僵尸进程多 | `ctr -n k8s.io tasks ls` | 容器退出未清理，检查 restart policy |

---

## 5. 与 docker CLI 的关键差异

| 命令 | docker | nerdctl |
|------|--------|---------|
| 查看镜像 | `docker images` | `nerdctl images` |
| 运行容器 | `docker run` | `nerdctl run` |
| 构建镜像 | `docker build` | 需配合 `buildctl` / 预构建镜像 |
| 查看 compose | `docker compose` | `nerdctl compose` |
| 默认 namespace | default | default（K8s 用 k8s.io） |

---

## Related

- [[架构基建/AI_Stack_Production_Toolchain|AI Stack 生产工具链总览]]
- [[架构基建/AI_Stack_K8s_Operations_Guide|AI Stack K8s 编排指南]]
- [[架构基建/AI_Stack_Exclusive_Tools_Guide|AI Stack 专属运维工具指南]]
- [[架构基建/Hardware_Compute/CDI_Deep_Dive|CDI: 容器设备接口标准]]
- [[架构基建/AI_Stack_Deep_Dive|阿里云 AI Stack 软硬一体推理平台]]
- [[_concepts/oci-runtime|OCI Runtime]]
