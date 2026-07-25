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
sources: []

---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](治理/Production_Safety_Policy.md)。
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

- [[12_架构基建/AI_Stack_Production_Toolchain|AI Stack 生产工具链总览]]
- [[12_架构基建/AI_Stack_K8s_Operations_Guide|AI Stack K8s 编排指南]]
- [[12_架构基建/AI_Stack_Exclusive_Tools_Guide|AI Stack 专属运维工具指南]]
- [[12_架构基建/07_Hardware_Compute/CDI_Deep_Dive|CDI: 容器设备接口标准]]
- [[12_架构基建/AI_Stack_Deep_Dive|阿里云 AI Stack 软硬一体推理平台]]
- [[概念/oci-runtime|OCI Runtime]]

## 架构核心组件对比

| 组件层 | 功能 | 关键技术 | 选型考量 |
|--------|------|----------|----------|
| 计算层 | 07_模型训练/推理 | GPU/TPU/NPU集群 | 算力需求+成本 |
| 存储层 | 数据/模型/检查点 | 分布式存储/对象存储 | 容量+IOPS+成本 |
| 网络层 | 节点间通信 | RDMA/RoCE/InfiniBand | 带宽+延迟 |
| 调度层 | 资源编排 | K8s/Slurm/Ray | 弹性+效率 |
| 服务层 | 模型服务化 | vLLM/TGI/Triton | 吞吐+延迟 |
| 网关层 | 流量管理 | API Gateway/负载均衡 | 可用性+安全 |
| 监控层 | 可观测性 | Prometheus/Grafana/OTel | 全面+实时 |

## 架构设计原则

| 原则 | 说明 | 实践方法 |
|------|------|----------|
| 高可用 | 消除单点故障 | 多副本+故障转移+多AZ |
| 可扩展 | 水平扩展无瓶颈 | 无状态设计+分片 |
| 高性能 | 最小化延迟 | 缓存+并行+异步 |
| 安全性 | 纵深防御 | 加密+认证+审计 |
| 可观测 | 全链路可见 | Trace+Metrics+Logging |
| 成本优化 | 资源利用率最大化 | 弹性伸缩+混合部署 |

## 性能基准参考

| 场景 | 关键指标 | 目标值 | 优化方向 |
|------|----------|--------|----------|
| 模型推理 | 首Token延迟 | <500ms | 模型优化+缓存 |
| 批量推理 | 吞吐量 | >1000 req/s | 批处理+并行 |
| 训练任务 | GPU利用率 | >85% | 数据管道+通信优化 |
| 存储读写 | IOPS | >100K | NVMe+分布式 |
| 网络通信 | 带宽利用率 | >90% | RDMA+拓扑优化 |

## 常见问题与解决方案

| 问题 | 根因分析 | 解决方案 |
|------|----------|----------|
| GPU利用率低 | 数据加载瓶颈 | 预取+多worker+NVMe |
| 推理延迟高 | 模型过大/批处理不当 | 量化+动态batch |
| 存储IO瓶颈 | 检查点写入集中 | 异步写入+分布式存储 |
| 网络拥塞 | AllReduce通信密集 | 梯度压缩+拓扑优化 |
| 资源碎片 | 调度策略不当 | Gang调度+资源预留 |

## 技术选型决策树

| 决策点 | 选项A | 选项B | 选择依据 |
|--------|-------|-------|----------|
| 训练框架 | PyTorch DDP | DeepSpeed/Megatron | 模型规模>10B用后者 |
| 推理引擎 | vLLM | TensorRT-LLM | 灵活性vs极致性能 |
| 存储方案 | 本地NVMe | 分布式存储(Ceph) | 数据规模+共享需求 |
| 网络方案 | 以太网 | InfiniBand | 集群规模+预算 |
| 调度系统 | K8s | Slurm | 云原生vs HPC传统 |

## 学习路径建议

| 阶段 | 内容 | 时间 | 产出 |
|------|------|------|------|
| 入门 | 基础架构概念+组件认知 | 1-2周 | 理解全景图 |
| 基础 | 单一组件深入(存储/网络) | 2-3周 | 掌握核心原理 |
| 进阶 | 系统集成+性能优化 | 3-4周 | 能设计完整方案 |
| 实战 | 生产环境部署运维 | 4-6周 | 独立运维能力 |
| 精通 | 架构演进+前沿探索 | 持续 | 技术领导力 |

## 术语速查表

| 术语 | 含义 |
|------|------|
| RDMA | 远程直接内存访问(绕过CPU) |
| NVLink | GPU间高速互联 |
| InfiniBand | 高性能网络互连技术 |
| Checkpoint | 训练中间状态保存点 |
| Gang Scheduling | 一组Pod同时调度 |
| Data Parallelism | 数据并行(每GPU处理不同数据) |
| Model Parallelism | 模型并行(模型分片到多GPU) |
| Pipeline Parallelism | 流水线并行(层间流水) |
| Tensor Parallelism | 张量并行(层内切分) |
| KV Cache | 推理时缓存注意力键值 |

## 检查清单

- [ ] 理解AI基础设施全景架构
- [ ] 掌握计算/存储/网络核心组件
- [ ] 了解主流框架和工具链
- [ ] 能进行基本的性能分析和优化
- [ ] 熟悉生产环境最佳实践
- [ ] 关注硬件和架构演进趋势
