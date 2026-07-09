---
title: "Docker"
category: concepts
tags: ["docker", "container", "container-runtime", "oci", "devops"]
summary: "Docker 是业界最广泛使用的容器化平台，通过镜像将应用与依赖打包成标准化、可移植的运行单元，实现一次构建、到处运行。"
created: 2026-07-02
updated: 2026-07-02
aliases:
  - "Docker"
sources: []
---

# Docker

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

- [[_concepts/containerd|containerd]] — Kubernetes 主流容器运行时
- [[_concepts/oci-runtime|OCI Runtime]] — 开放容器运行时标准
- [[_concepts/kubernetes|Kubernetes]] — 容器编排平台
- [[_concepts/container-security|Container Security]] — 容器安全实践
- [[_concepts/model-serving|Model Serving]] — 模型服务化部署
- [[_concepts/ci-cd|CI/CD]] — 持续集成与持续交付
- [[架构基建/Networking/Docker_Containerization_for_AI|Docker Containerization for AI]] — AI 场景下的 Docker 容器化
- [[架构基建/AI_Stack/AI_Stack_Container_Runtime_Guide|AI Stack Container Runtime Guide]] — AI Stack 容器运行时指南
