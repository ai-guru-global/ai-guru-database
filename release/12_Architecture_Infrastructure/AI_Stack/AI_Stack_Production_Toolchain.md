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

- [[12_Architecture_Infrastructure/AI_Stack_Deep_Dive|阿里云 AI Stack: 企业级软硬一体 AI 推理平台]] — AI Stack 产品全景
- [[12_Architecture_Infrastructure/AI_Stack_Container_Runtime_Guide|AI Stack 容器与运行时指南]]
- [[12_Architecture_Infrastructure/AI_Stack_GPU_Monitoring_Guide|AI Stack GPU 监控指南]]
- [[12_Architecture_Infrastructure/AI_Stack_Model_Management_Guide|AI Stack 模型下载与管理指南]]
- [[12_Architecture_Infrastructure/AI_Stack_Inference_Serving_Guide|AI Stack 推理服务指南]]
- [[12_Architecture_Infrastructure/AI_Stack_Training_Launchers_Guide|AI Stack 训练启动器指南]]
- [[12_Architecture_Infrastructure/AI_Stack_K8s_Operations_Guide|AI Stack K8s 编排指南]]
- [[12_Architecture_Infrastructure/AI_Stack_Exclusive_Tools_Guide|AI Stack 专属运维工具指南]]
- [[10_Deployment_Inference/Inference_Engines/LLM_Inference_Engine_Selection_Guide|LLM 推理引擎选型指南]]
- [[07_Model_Training/Distributed_Training/Distributed_Training_2026|分布式训练 2026]]
- [[13_AI_Ops/AI_Ops_2026|AI Ops 2026: 智能运维体系与实践]]
