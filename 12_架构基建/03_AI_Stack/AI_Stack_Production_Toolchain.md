---
title: "AI Stack 生产工具链总览"
category: "12-architecture-infrastructure"
tags: ["ai-stack", "toolchain", "operations", "container", "gpu", "inference", "training", "kubernetes"]
summary: "> **一句话理解**: AI Stack 生产工具链是私有化 AI 一体机从开发、训练、模型管理、推理部署到容器化运维的全栈命令行工具集合。"
created: "2026-06-16"
updated: "2026-06-16"
tier: supporting
aliases:
  - "Ai Stack Production Toolchain"
  - "AI Stack Production Toolchain"
  - AI_Stack_Production_Toolchain
sources: []

---
# AI Stack 生产工具链总览

> **一句话理解**: AI Stack 生产工具链是私有化 AI 一体机从开发、训练、模型管理、推理部署到容器化运维的全栈命令行工具集合。

---

## 1. 工具全景速查

### 1.1 容器与运行时

| 工具 | 用途 | 场景 |
|------|------|------|
| [nerdctl](./AI_Stack_Container_Runtime_Guide.md#nerdctl) | containerd 客户端，管理镜像/容器 | AI Stack 日常运维 |
| [crictl](./AI_Stack_Container_Runtime_Guide.md#crictl) | K8s CRI 调试工具 | 排查 K8s 节点上的容器问题 |
| [ctr](./AI_Stack_Container_Runtime_Guide.md#ctr) | containerd 原生 CLI（比 nerdctl 更底层） | 极端调试场景 |
| [docker](./AI_Stack_Container_Runtime_Guide.md#docker) | 老牌容器管理 | 开发环境、非 K8s 场景 |
| [podman](./AI_Stack_Container_Runtime_Guide.md#podman) | rootless 容器管理 | 安全敏感环境 |

### 1.2 GPU 监控

| 工具 | 硬件 | 核心命令 |
|------|------|----------|
| [nvidia-smi](./AI_Stack_GPU_Monitoring_Guide.md#nvidia-smi) | NVIDIA GPU | `nvidia-smi`、`nvidia-smi dmon`（持续监控）、`nvidia-smi nvlink`（卡间互联） |
| [ppu-smi](./AI_Stack_GPU_Monitoring_Guide.md#ppu-smi) | 国产 PPU（平头哥） | `ppu-smi`、`ppu-smi -l 1`（刷新）、查看每个进程的 GPU 占用 |
| [rocm-smi](./AI_Stack_GPU_Monitoring_Guide.md#rocm-smi) | AMD GPU | `rocm-smi --showmeminfo` |
| [pmon](./AI_Stack_GPU_Monitoring_Guide.md#pmon) | 进程级监控 | 查看每个进程的 GPU 占用 |

### 1.3 模型下载与管理

| 工具 | 来源 | 核心命令 |
|------|------|----------|
| [huggingface-cli](./AI_Stack_Model_Management_Guide.md#huggingface-cli) | HuggingFace | `huggingface-cli download Qwen/Qwen3-8B` |
| [modelscope](./AI_Stack_Model_Management_Guide.md#modelscope) | 魔搭（国内首选） | `modelscope download --model Qwen/Qwen3-8B` |
| [git-lfs](./AI_Stack_Model_Management_Guide.md#git-lfs) | 通用大文件下载 | `git lfs clone <repo>` |

### 1.4 推理服务

| 工具 | 用途 | 启动命令 |
|------|------|----------|
| [vllm serve](./AI_Stack_Inference_Serving_Guide.md#vllm-serve) | vLLM 推理引擎 | `vllm serve Qwen3-8B --port 8000` |
| [sglang.launch_server](./AI_Stack_Inference_Serving_Guide.md#sglanglaunch_server) | SGLang 推理引擎 | `python -m sglang.launch_server --model-path ...` |
| [ollama](./AI_Stack_Inference_Serving_Guide.md#ollama) | 本地模型一键运行 | `ollama run qwen3:8b`、`ollama serve` |
| [llama-server](./AI_Stack_Inference_Serving_Guide.md#llama-server) | llama.cpp 推理服务 | `llama-server -m model.gguf --port 8080` |

### 1.5 训练

| 工具 | 用途 | 核心命令 |
|------|------|----------|
| [torchrun](./AI_Stack_Training_Launchers_Guide.md#torchrun) | PyTorch 分布式训练启动器 | `torchrun --nproc_per_node=8 train.py` |
| [accelerate](./AI_Stack_Training_Launchers_Guide.md#accelerate) | HF Accelerate 启动器 | `accelerate launch --num_processes=8 train.py` |
| [deepspeed](./AI_Stack_Training_Launchers_Guide.md#deepspeed) | DeepSpeed 训练启动器 | `deepspeed --num_gpus=8 train.py --deepspeed ds_config.json` |
| [swift](./AI_Stack_Training_Launchers_Guide.md#swift) | ModelScope SWIFT 训练框架 | `swift sft --model Qwen3-8B --dataset alpaca-zh` |

### 1.6 K8s 编排（AI Stack 内部用，一般不直接操作）

| 工具 | 用途 | 核心命令 |
|------|------|----------|
| [kubectl](./AI_Stack_K8s_Operations_Guide.md#kubectl) | K8s 集群管理 | `kubectl get pods`、`kubectl logs` |
| [helm](./AI_Stack_K8s_Operations_Guide.md#helm) | K8s 包管理 | `helm install gpuStack gpustack/gpustack` |

### 1.7 AI Stack 专属

| 工具 | 用途 | 核心命令 |
|------|------|----------|
| [stackops](./AI_Stack_Exclusive_Tools_Guide.md#stackops) | AI Stack 运维工具集 | `stackops asllm-hash <tag>`、`stackops version` |
| [aioController](./AI_Stack_Exclusive_Tools_Guide.md#aiocontroller) | AI Stack 控制引擎 | `systemctl restart aioController` |

---

## 2. 一张图记清楚：AI Stack 工具生命周期

```
开发环境:   docker / ollama / huggingface-cli
    ↓
训练阶段:   torchrun / accelerate / deepspeed + nvidia-smi
    ↓
模型管理:   modelscope / git-lfs
    ↓
推理部署:   vllm serve / sglang / llama-server
    ↓
容器化:     nerdctl load → asllm 镜像
    ↓
生产运维:   nerdctl + ppu-smi + stackops
```

### 阶段说明

| 阶段 | 主要工具 | 关键产出 |
|------|----------|----------|
| **开发环境** | docker、ollama、huggingface-cli | 可运行的本地原型、基础镜像 |
| **训练阶段** | torchrun、accelerate、deepspeed、swift | 训练日志、checkpoint、SFT/RL 模型 |
| **模型管理** | modelscope、git-lfs | 模型权重、配置文件、tokenizer |
| **推理部署** | vllm serve、sglang、ollama、llama-server | 在线 API 服务、OpenAI 兼容端点 |
| **容器化** | nerdctl、ctr、crictl | asllm 镜像、K8s Pod |
| **生产运维** | nerdctl、ppu-smi、stackops、aioController | 稳定运行的推理服务、监控告警 |

---

## 3. 按角色索引

| 角色 | 优先查看 |
|------|----------|
| AI Stack 平台运维/SRE | [容器运行时](./AI_Stack_Container_Runtime_Guide.md) → [GPU 监控](./AI_Stack_GPU_Monitoring_Guide.md) → [AI Stack 专属工具](./AI_Stack_Exclusive_Tools_Guide.md) |
| 算法/训练工程师 | [训练启动器](./AI_Stack_Training_Launchers_Guide.md) → [GPU 监控](./AI_Stack_GPU_Monitoring_Guide.md) |
| 模型/数据工程师 | [模型管理](./AI_Stack_Model_Management_Guide.md) → [git-lfs 大文件下载](./AI_Stack_Model_Management_Guide.md#git-lfs) |
| 推理/服务工程师 | [推理服务](./AI_Stack_Inference_Serving_Guide.md) → [K8s 编排](./AI_Stack_K8s_Operations_Guide.md) |
| K8s 平台工程师 | [K8s 编排](./AI_Stack_K8s_Operations_Guide.md) → [容器运行时](./AI_Stack_Container_Runtime_Guide.md#crictl) |

---

## 4. 生产环境核心原则

1. **镜像与容器**: AI Stack 生产环境以 containerd 为运行时，优先使用 `nerdctl`；`docker` 仅用于开发机或非 K8s 场景；Pod 级问题用 `crictl` 调试。
2. **GPU 监控**: NVIDIA 场景用 `nvidia-smi dmon` 做持续监控；国产 PPU 场景用 `ppu-smi` 查看卡级和进程级占用；进程级细查用 `pmon`。
3. **模型下载**: 国内环境优先 `modelscope`，海外或 HuggingFace 生态用 `huggingface-cli`；大文件仓库必须配置 `git-lfs`。
4. **推理服务**: 生产首选 `vllm serve` 或 `sglang.launch_server`；本地验证/边缘用 `ollama` 或 `llama-server`。
5. **训练启动**: 单机多卡用 `torchrun`；HF 生态用 `accelerate`；大模型分布式用 `deepspeed`；国产/魔搭生态用 `swift`。
6. **K8s 编排**: 日常通过平台层操作，排查节点问题时才用 `kubectl`/`helm`。
7. **AI Stack 专属**: `stackops` 用于镜像 hash、版本查询等运维操作；`aioController` 是控制引擎，变更后需 `systemctl restart`。

---

## Related

- [[12_架构基建/AI_Stack_Deep_Dive|阿里云 AI Stack: 企业级软硬一体 AI 推理平台]] — AI Stack 产品全景
- [[12_架构基建/AI_Stack_Container_Runtime_Guide|AI Stack 容器与运行时指南]]
- [[12_架构基建/AI_Stack_GPU_Monitoring_Guide|AI Stack GPU 监控指南]]
- [[12_架构基建/AI_Stack_Model_Management_Guide|AI Stack 模型下载与管理指南]]
- [[12_架构基建/AI_Stack_Inference_Serving_Guide|AI Stack 推理服务指南]]
- [[12_架构基建/AI_Stack_Training_Launchers_Guide|AI Stack 训练启动器指南]]
- [[12_架构基建/AI_Stack_K8s_Operations_Guide|AI Stack K8s 编排指南]]
- [[12_架构基建/AI_Stack_Exclusive_Tools_Guide|AI Stack 专属运维工具指南]]
- [[10_部署推理/02_Inference_Engines/LLM_Inference_Engine_Selection_Guide|LLM 推理引擎选型指南]]
- [[07_模型训练/04_Distributed_Training/Distributed_Training_2026|分布式训练 2026]]
- [[13_运维/AI_Ops_2026|AI Ops 2026: 智能运维体系与实践]]

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
