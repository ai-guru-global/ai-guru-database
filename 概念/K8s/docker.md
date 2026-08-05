---
title: "Docker"
category: concepts
tags: ["docker", "container", "container-runtime", "oci", "devops"]
summary: "Docker 是业界最广泛使用的容器化平台，通过镜像将应用与依赖打包成标准化、可移植的运行单元，实现一次构建、到处运行。"
created: 2026-07-02
updated: 2026-07-21
lifecycle: reviewed
aliases:
  - "Docker"
sources: []
name_zh: "Docker 容器平台"
---

# Docker

> 中文简称：Docker 容器平台

> 把应用连同它的运行环境一起「打包成盒」，让开发、测试、生产环境拥有一致的交付体验。

## 1. 一句话定义

**Docker** 是一个开源的容器化平台，允许开发者将应用及其依赖、配置、运行库打包到标准化的容器镜像中。容器镜像可在任何安装 Docker 的主机上启动为独立进程，提供与宿主机隔离但轻量的运行环境，实现「一次构建，到处运行」。

## 2. 核心组成与原理

Docker 的关键组件协同工作，把镜像转化为运行中的容器：

| 组件 | 作用 |
|------|------|
| **Docker Engine** | 负责构建、运行和管理容器的守护进程与客户端 CLI |
| **Docker Image** | 只读模板，由多层文件系统叠加而成，包含应用、依赖与配置 |
| **Docker Container** | 镜像的运行实例，拥有独立的进程空间、网络接口和文件系统视图 |
| **Dockerfile** | 描述镜像构建步骤的脚本，支持版本化、可复现的构建 |
| **Docker Hub / Registry** | 镜像仓库，用于分发和共享容器镜像 |
| **Docker Compose** | 通过 YAML 定义多容器应用，简化本地开发与测试编排 |

底层实现上，Docker 利用 Linux 内核的 **Namespace** 实现进程、网络、挂载点的隔离，利用 **cgroups** 限制 CPU、内存、IO 等资源。镜像则基于联合文件系统（如 overlayfs）分层存储，复用公共基础层以节省空间与拉取时间。

## 3. 典型用例

1. **开发环境一致性**：解决「在我机器上能跑」的问题，开发、CI、生产使用同一镜像。
2. **微服务部署**：将单体应用拆分为多个容器，每个服务独立构建、独立扩缩容。
3. **AI 模型推理服务**：把 vLLM、TGI、TensorRT-LLM 等推理引擎与模型权重打包成镜像，快速部署到任意节点。
4. **CI/CD 流水线**：在容器中执行测试、构建、扫描，保证流水线环境干净且可复现。
5. **本地 MLOps 实验**：通过 Docker Compose 一键拉起 Jupyter、MLflow、向量数据库等组件。

## 4. 与相关技术的区别与联系

| 技术 | 关系 |
|------|------|
| **containerd** | Docker 早期将容器运行时拆分为 containerd，后者现已成为 Kubernetes 的主流 CRI 实现 |
| **Kubernetes** | K8s 是大规模容器编排平台，Docker 可作为其容器运行时的上层工具链，但 K8s 通常直接调用 containerd/CRI-O |
| **OCI Runtime / runc** | Docker 默认使用符合 OCI 规范的 runc 作为底层运行时 |
| **VM（虚拟机）** | 虚拟机通过 Hypervisor 模拟完整硬件，隔离更重；容器共享宿主机内核，启动更快、资源占用更少 |
| **Podman** | 与 Docker CLI 兼容的无守护进程容器工具，同样遵循 OCI 标准 |

简言之，Docker 更偏向开发者友好的端到端容器工具链，而 Kubernetes 是面向集群的编排系统，containerd 则是两者之间的工业级运行时层。

## Related

- [[概念/containerd|containerd]] — Kubernetes 主流容器运行时
- [[概念/oci-runtime|OCI Runtime]] — 开放容器运行时标准
- [[概念/kubernetes|Kubernetes]] — 容器编排平台
- [[概念/container-security|Container Security]] — 容器安全实践
- [[概念/model-serving|Model Serving]] — 模型服务化部署
- [[概念/ci-cd|CI/CD]] — 持续集成与持续交付
- [[12_架构基建/08_网络/Docker_Containerization_for_AI|Docker Containerization for AI]] — AI 场景下的 Docker 容器化
- [[12_架构基建/03_AI技术栈/AI_Stack_Container_Runtime_Guide|AI Stack Container Runtime Guide]] — AI Stack 容器运行时指南

---

## 2026 Docker 生态

| 特性 | 说明 | 状态 |
|------|------|------|
| **BuildKit** | 高性能构建引擎 | GA |
| **Docker Desktop** | 开发环境集成 | GA |
| **Docker Scout** | 供应链安全分析 | GA |
| **AI 镜像优化** | 模型分层缓存 | 社区 |

## 5. Dockerfile 最佳实践

```dockerfile
# 多阶段构建示例（AI 推理服务）
FROM python:3.11-slim AS builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

FROM python:3.11-slim AS runtime
WORKDIR /app
COPY --from=builder /install /usr/local
COPY . .
RUN useradd -m appuser
USER appuser
EXPOSE 8000
CMD ["python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0"]
```

## 6. 常用命令速查

| 命令 | 作用 |
|------|------|
| `docker build -t app:v1 .` | 构建镜像 |
| `docker run -d -p 8000:8000 app:v1` | 运行容器 |
| `docker compose up -d` | 启动多容器应用 |
| `docker exec -it <id> /bin/sh` | 进入容器 |
| `docker logs -f <id>` | 查看日志 |
| `docker system prune -a` | 清理无用资源 |
| `docker scout cves app:v1` | 漏洞扫描 |

## 7. AI 场景 Docker 实践

| 场景 | 实践 | 说明 |
|------|------|------|
| **模型镜像** | 分层缓存 | 模型权重单独一层，加速构建 |
| **GPU 容器** | `--gpus all` | 需要 nvidia-container-toolkit |
| **大模型加载** | Volume 挂载 | 避免模型打包进镜像 |
| **推理服务** | 健康检查 | 配置 HEALTHCHECK 指令 |
| **多模型部署** | Compose 编排 | 一键拉起多个推理服务 |

## 8. 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 镜像过大 | 未用多阶段构建 | 使用 slim/distroless 基础镜像 |
| GPU 不可用 | 缺少 runtime | 安装 nvidia-container-toolkit |
| 构建慢 | 未利用缓存 | 优化 Dockerfile 层顺序 |
| OOM Killed | 内存限制过低 | 调整 `--memory` 参数 |

## 生产最佳实践

1. **多阶段构建**：减小镜像体积，分离构建与运行环境
2. **基础镜像选择**：使用 distroless/alpine 减小攻击面
3. **镜像扫描**：集成 Docker Scout/Trivy 进行漏洞扫描
4. **资源限制**：设置 CPU/内存限制，防止容器资源耗尽
5. **日志管理**：配置日志驱动，避免磁盘占满
6. **安全加固**：非 root 运行、只读文件系统、最小权限

## 相关概念

- [[概念/containerd|containerd]] — Kubernetes 主流容器运行时
- [[概念/oci-runtime|OCI Runtime]] — 开放容器运行时标准
- [[概念/kubernetes|Kubernetes]] — 容器编排平台

## 安全加固清单

| 检查项 | 说明 |
|--------|------|
| 非 root 运行 | `USER appuser` |
| 只读文件系统 | `--read-only` |
| 最小权限 | 删除不必要 capabilities |
| 镜像签名 | 使用 cosign/Notary |
| 漏洞扫描 | 集成 Trivy/Scout |
| 资源限制 | 设置 CPU/内存限制 |

## 总结

Docker 是 AI 应用容器化的基石，通过镜像将应用与依赖打包成标准化、可移植的运行单元。从模型推理服务到 MLOps 工具链，几乎所有 AI 工作负载都以容器形式交付。

---

> 💡 Docker 是 AI 应用容器化的基石，从模型推理服务到 MLOps 工具链，几乎所有 AI 工作负载都以容器形式交付。

## 版本与运行时对比

| 运行时 | 定位 | 适用场景 |
|--------|------|----------|
| **Docker Engine** | 全功能容器引擎 | 开发、构建镜像 |
| **containerd** | 轻量运行时 | K8s 生产集群 |
| **CRI-O** | K8s 专用运行时 | OpenShift |
| **Podman** | 无守护进程 | 安全敏感环境 |

## 常用命令速查

| 命令 | 说明 |
|------|------|
| `docker build -t app:v1 .` | 构建镜像 |
| `docker run --gpus all app:v1` | GPU 容器运行 |
| `docker images --format '{{.Repository}}:{{.Tag}}'` | 列出镜像 |
| `docker system prune -af` | 清理无用资源 |
| `docker inspect <container>` | 查看容器详情 |

## 生产检查清单

1. **多阶段构建**：减小最终镜像体积
2. **固定基础镜像版本**：避免 `latest` 标签
3. **非 root 运行**：设置 `USER` 指令
4. **健康检查**：配置 `HEALTHCHECK` 指令
5. **日志管理**：使用 json-file 或 fluentd 驱动

## 相关概念

- [[概念/containerd|containerd]] — 轻量容器运行时
- [[概念/cri|CRI]] — 容器运行时接口
- [[概念/trivy|Trivy]] — 镜像漏洞扫描
- [[概念/kubernetes|Kubernetes]] — 容器编排平台

## 版本兼容性

| Docker 版本 | containerd | K8s 兼容 | 状态 |
|-------------|-----------|---------|------|
| 27.x | 1.7+ | 1.29+ | 稳定 |
| 26.x | 1.7 | 1.28+ | 维护 |
| 25.x | 1.6 | 1.27+ | EOL |
