---
title: "LLM 生产环境部署 Runbook：从模型文件到线上服务"
category: "05-nlp-llms"
tags: ["llm", "production", "deployment", "vllm", "tgi", "sglang", "tensorrt-llm", "inference", "kv-cache", "prefix-caching", "quantization", "speculative-decoding", "gateway", "observability", "cost-optimization"]
summary: "面向企业生产环境的大语言模型部署完整 Runbook，涵盖推理引擎选型、服务化架构、KV Cache 与 Prefix Caching 配置、量化与投机解码权衡、多模型路由与 Fallback、安全监控与成本优化 checklist。"
created: 2026-07-02
updated: 2026-07-02
tier: core
aliases:
  - "LLM Production Deployment Runbook"
  - LLM_Production_Deployment_Runbook
sources: []
---

# LLM 生产环境部署 Runbook：从模型文件到线上服务

> **一句话理解**：LLM 生产部署不是把模型文件放到 GPU 上启动 API 那么简单，而是一项围绕「高吞吐、低延迟、高可用、可观测、可成本控制」的系统工程。

---

## 1. 概述与适用边界

### 1.1 文档定位

本 Runbook 面向需要将大语言模型从研发态推向线上生产环境的团队，覆盖从推理引擎选型、服务化封装、自动扩缩容、缓存策略、量化加速、多模型路由，到安全监控与成本优化的完整链路。目标是让读者在真实企业环境中能够按部就班地完成一次可上线、可运维、可度量的 LLM 服务交付。

### 1.2 目标读者

- LLM Platform / AI Infra 工程师
- 后端架构师与 SRE
- 需要评估私有化部署方案的技术负责人

### 1.3 适用场景

| 场景 | 典型需求 |
|------|----------|
| **企业内部 LLM API** | 多业务线共享、统一鉴权与配额 |
| **智能客服/助手** | 低延迟、高并发、长上下文 |
| **代码/写作 Copilot** | 低 TTFT、高吞吐、流式输出 |
| **多模型聚合网关** | 按能力/成本路由、Fallback 兜底 |
| **私有化合规部署** | 数据不出境、模型版本可控 |

---

## 2. 推理引擎选型

推理引擎是生产部署的核心。2024-2026 年主流方案在性能、生态、可维护性上差异明显，需根据模型类型、硬件、团队经验综合选择。选型的关键指标包括：吞吐（tokens/sec）、首 token 延迟（TTFT）、每个输出 token 的延迟（TPOT）、显存效率、生态活跃度，以及与现有 CI/CD 和 K8s 体系的集成难度。

一般而言，如果团队已经有成熟的 NVIDIA GPU 集群，并且希望快速上线通用对话服务，vLLM 是最稳妥的起点；如果业务对延迟极度敏感、愿意投入编译调优成本，TensorRT-LLM 可以榨干硬件性能；如果模型主要托管在 HuggingFace 生态且需要快速验证，TGI 的兼容性更好；如果业务涉及大量结构化输出、Agent 多轮调用或多模态输入，SGLang 的编程模型更具优势。

实际选型时，建议先用真实业务请求在目标硬件上跑一轮 benchmark，比较 TTFT、TPOT、吞吐和显存占用，再决定长期使用的引擎。实验室里的理论数字往往与真实流量分布存在偏差，尤其是 prompt 长度、输出长度、并发模式都会影响最终表现。

### 2.1 主流引擎对比

| 引擎 | 核心优势 | 主要限制 | 推荐场景 |
|------|----------|----------|----------|
| **vLLM** | `PagedAttention` 带来高吞吐与显存效率；OpenAI 兼容 API；社区最活跃 | 长上下文与多模态支持仍在快速迭代 | 通用 GPU 生产服务首选 |
| **TGI (Text Generation Inference)** | HuggingFace 原生；`Safetensors`、warmup、flash attention 集成完善 | 吞吐略低于 vLLM，定制 kernel 较少 | HuggingFace 生态、快速上线 |
| **SGLang** | 结构化生成、RadixAttention、多模态与 Agent 工作流友好 | 社区相对年轻，文档成熟度不及 vLLM | 复杂 Agent、多轮对话、JSON 输出 |
| **TensorRT-LLM** | NVIDIA 深度优化，同卡性能通常最高 | 仅 NVIDIA；编译/量化门槛高；版本锁定 | 追求极限吞吐的 NVIDIA 环境 |
| **llama.cpp** | CPU/GPU/Metal 全平台；GGUF 量化生态丰富 | 大 batch 吞吐不足 | 端侧、CPU 回退、小型私有化 |

### 2.2 选型决策树

```
是否必须使用 NVIDIA GPU 且追求极限性能？
  ├─ 是 → TensorRT-LLM（接受编译/维护成本）
  └─ 否 → 是否以 HuggingFace 模型为中心且希望快速上线？
       ├─ 是 → TGI
       └─ 否 → 是否大量结构化输出/Agent 多轮调用？
            ├─ 是 → SGLang
            └─ 否 → vLLM（默认推荐）

是否资源受限或需 CPU/端侧运行？
  └─ llama.cpp / ONNX Runtime
```

### 2.3 vLLM 生产启动示例

vLLM 是目前社区最活跃的生产级推理引擎，默认提供 OpenAI 兼容接口。以下命令展示了一个带 Prefix Caching 与 chunked prefill 的多卡服务启动方式。`--tensor-parallel-size` 控制张量并行卡数，`--enable-prefix-caching` 开启前缀缓存，`--enable-chunked-prefill` 让长序列的 prefill 阶段不会被单个请求独占 GPU，从而提升整体并发能力。

```bash
python -m vllm.entrypoints.openai.api_server \
  --model /models/Qwen2.5-72B-Instruct-AWQ \
  --quantization awq \
  --tensor-parallel-size 4 \
  --max-model-len 32768 \
  --max-num-seqs 256 \
  --enable-prefix-caching \
  --enable-chunked-prefill \
  --gpu-memory-utilization 0.92 \
  --port 8000
```

---

## 3. 服务化架构

### 3.1 典型生产架构

生产环境推荐采用「Gateway + 推理服务池 + 模型存储 + 可观测 + 护栏」的分层架构。Gateway 负责统一接入与治理，推理服务池负责模型执行，模型存储负责版本化管理，旁路系统负责安全、监控与追踪。这样的分层使得模型迭代、扩缩容、灰度发布、故障隔离都能独立进行，不会因为一次模型升级导致整个入口不可用。

将 Gateway 与推理服务解耦是生产架构的重要原则。Gateway 作为无状态组件可以水平扩展，而推理服务受限于 GPU 资源通常需要更谨慎地扩缩容。如果两者耦合在一起，Gateway 的限流、日志、鉴权逻辑会消耗 GPU 节点的宝贵资源，同时也让故障排查变得困难。

```
                        ┌─────────────────┐
   客户端/SDK ────────▶  │   API Gateway   │  ← 鉴权、限流、路由、Fallback、成本归因
                        │  (LiteLLM/Kong) │
                        └────────┬────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              ▼                  ▼                  ▼
        ┌──────────┐      ┌──────────┐      ┌──────────┐
        │  vLLM    │      │  vLLM    │      │  vLLM    │
        │ Pod #1   │      │ Pod #2   │      │ Pod #N   │
        │ (GPU)    │      │ (GPU)    │      │ (GPU)    │
        └────┬─────┘      └────┬─────┘      └────┬─────┘
             │                 │                 │
             └─────────────────┼─────────────────┘
                               ▼
                    ┌────────────────────┐
                    │  对象存储 / PVC     │  ← 模型文件、LoRA adapter、GGUF
                    │  (S3/NFS/CSI)      │
                    └────────────────────┘

旁路:
  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
  │ Prometheus   │  │  Jaeger/OTel │  │  Guardrails  │
  │  + Grafana   │  │   Traces     │  │  Input/Out   │
  └──────────────┘  └──────────────┘  └──────────────┘
```

### 3.2 Kubernetes 部署片段

下面给出一个使用四卡 A100 部署 72B AWQ 模型的 Deployment 与 HPA 示例。HPA 建议基于 GPU KV Cache 使用率与等待队列长度扩缩容，而不是简单依赖 CPU/内存。这是因为 LLM 服务的瓶颈通常是显存容量与请求排队，而不是 CPU 占用。`vllm:gpu_cache_usage_perc` 高说明显存即将耗尽，`vllm:num_requests_waiting` 高说明请求排队严重，两者都是扩容的合理信号。

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: vllm-qwen72b
spec:
  replicas: 2
  selector:
    matchLabels:
      app: vllm-qwen72b
  template:
    metadata:
      labels:
        app: vllm-qwen72b
    spec:
      nodeSelector:
        nvidia.com/gpu.product: NVIDIA-A100-SXM4-80GB
      containers:
      - name: vllm
        image: vllm/vllm-openai:v0.11.0
        args:
          - --model=/models/Qwen2.5-72B-Instruct-AWQ
          - --tensor-parallel-size=4
          - --max-model-len=32768
          - --enable-prefix-caching
        resources:
          limits:
            nvidia.com/gpu: "4"
        volumeMounts:
        - name: model-pvc
          mountPath: /models
      volumes:
      - name: model-pvc
        persistentVolumeClaim:
          claimName: qwen72b-model-pvc
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: vllm-qwen72b-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: vllm-qwen72b
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Pods
    pods:
      metric:
        name: vllm:gpu_cache_usage_perc
      target:
        type: AverageValue
        averageValue: "70"
  - type: Pods
    pods:
      metric:
        name: vllm:num_requests_waiting
      target:
        type: AverageValue
        averageValue: "5"
```

### 3.3 Gateway 核心职责

Gateway 是生产 LLM 服务的流量入口与治理平面。它的核心职责不只做转发，还包括统一协议、流量控制、路由策略、成本归因和安全审计。没有 Gateway 的生产环境很容易出现密钥泄露、配额失控、单模型过载、成本不可追溯等问题。一个设计良好的 Gateway 能够把多模型、多厂商、多区域的复杂性封装在内部，对外提供一致的 OpenAI 兼容接口。

| 能力 | 说明 | 常用实现 |
|------|------|----------|
| **统一协议** | OpenAI/Anthropic 兼容接口，降低客户端迁移成本 | LiteLLM Proxy、Kong AI Gateway |
| **路由** | 按模型、能力、成本、区域、用户组路由 | 自定义 router + Gateway |
| **限流/配额** | Token/Request 级别限流、用户配额、预算告警 | Redis + Gateway 插件 |
| **Fallback** | 主模型超时/错误时切换备用模型或区域 | Circuit breaker + retry policy |
| **成本归因** | 按项目/用户/模型统计 token 与费用 | OpenTelemetry + cost backend |
| **密钥管理** | 集中管理 upstream provider key，不泄露给客户端 | Vault / AWS Secrets Manager |

---

## 4. KV Cache 与 Prefix Caching

### 4.1 KV Cache 基础

Decoder-only 模型在自回归生成时需要缓存历史 token 的 Key/Value，避免重复计算。KV Cache 大小与 `batch_size × seq_len × hidden_dim × layers × kv_heads` 成正比，是长上下文与并发场景的主要显存消耗来源。理解并优化 KV Cache 是控制延迟与成本的关键。

PagedAttention 是 vLLM 提出的核心优化，它将 KV Cache 拆分为固定大小的 block，并按需分配，而不是为每个请求预先分配最大上下文长度的连续显存。这样即使请求的输入输出长度分布不均匀，显存也能被高效复用，从而显著提升并发能力。

生产优化手段包括：

- **GQA / MQA**：减少 KV 头数量，降低显存占用。
- **PagedAttention**（vLLM）：将 KV Cache 分页管理，减少碎片与浪费。
- **KV Cache 量化**：8-bit/4-bit 压缩 KV Cache，适合超长上下文。
- **Prefix Caching**：对共享前缀（system prompt、RAG context、模板）复用 KV Cache。

### 4.2 Prefix Caching 配置

vLLM 从 0.4 版本起支持 Prefix Caching。开启后，对于共享前缀的请求，模型无需重新计算前缀部分的 KV Cache，显著降低 TTFT。Prefix Caching 的收益取决于业务请求中共享前缀的比例，RAG、客服、批量抽取类任务通常收益最大。

```bash
python -m vllm.entrypoints.openai.api_server \
  --model /models/Qwen2.5-72B-Instruct \
  --enable-prefix-caching \
  --max-num-batched-tokens 8192 \
  --max-num-seqs 256
```

**收益显著的场景**：

| 场景 | 共享前缀示例 | 预期收益 |
|------|--------------|----------|
| RAG 问答 | 固定 system prompt + 检索到的 documents | TTFT 降低 30%-60% |
| 多轮客服 | 角色设定 + 知识库 | 重复 prefill 大幅减少 |
| 批量数据抽取 | 相同 JSON schema 指令 | throughput 提升 2-4× |

### 4.3 关键配置参数

| 参数 | 含义 | 建议 |
|------|------|------|
| `--max-model-len` | 模型上下文上限 | 根据业务需求设置，避免过度预留显存 |
| `--max-num-seqs` | 最大并发序列数 | 结合延迟目标与 batch size 调优 |
| `--gpu-memory-utilization` | GPU 显存利用率上限 | 通常 0.85-0.95，预留缓冲 |
| `--enable-chunked-prefill` | 分块 prefill，降低 decode 阻塞 | 高并发长上下文建议开启 |

---

## 5. 量化与投机解码的权衡

### 5.1 量化方案对比

量化是降低显存占用、提升吞吐、降低单卡成本的最直接手段。但不同量化方案在精度、速度、部署复杂度上差异较大，需要结合业务精度敏感度选择。一般而言，AWQ 与 GPTQ 4-bit 在通用对话任务上精度损失很小，是生产部署的主流选择；FP8 则适合拥有 Hopper 架构硬件且对吞吐要求极高的场景。量化时使用的校准数据应尽可能贴近真实业务分布，否则在某些长尾输入上可能出现明显退化。

| 方案 | 精度 | 显存节省 | 吞吐影响 | 主要限制 | 推荐场景 |
|------|------|----------|----------|----------|----------|
| **FP16/BF16** | 基线 | 1× | 基线 | 显存消耗大 | 质量敏感、预算充足 |
| **AWQ 4-bit** | 接近 FP16 | ~4× | 通常更快 | 需校准；部分模型支持有限 | 生产 GPU 服务首选 |
| **GPTQ 4-bit** | 接近 FP16 | ~4× | 快 | 量化耗时较长 | 离线量化后上线 |
| **SmoothQuant INT8** | 接近 FP16 | ~2× | 快 | 需量化感知训练/校准 | 需要 W8A8 稳定场景 |
| **FP8 (H100+)** | 接近 BF16 | ~2× | 快 | 需 Hopper 架构 | H100/H200 集群 |
| **GGUF Q4_K_M** | 轻微损失 | ~4× | 中等 | CPU/GPU 混合 | 端侧或 CPU fallback |

### 5.2 投机解码（Speculative Decoding）

投机解码用小模型（draft）快速生成候选 token，再由大模型（target）并行验证，可显著降低感知延迟。其本质是用少量额外计算换取更高的 decode 并行度。投机解码对聊天、代码补全等流式输出体验提升明显，但如果 draft 模型与 target 模型分布差异过大，接受率会下降，反而增加无效计算。

```
用户请求 → Draft Model 生成 k 个候选 token
            ↓
         Target Model 一次前向验证
            ↓
         接受部分 token，拒绝处回退重算
```

**生产权衡**：

| 维度 | 收益 | 代价 |
|------|------|------|
| **延迟** | 高接受率下 TPOT 降低 1.5-3× | 接受率低时反而增加开销 |
| **显存** | 几乎不变（draft 很小） | 需额外加载 draft 模型或 Medusa head |
| **吞吐** | 提高单个请求的 decode 效率 | batch 调度变复杂，可能降低总吞吐 |
| **维护** | Medusa/EAGLE 无需独立 draft 模型 | 需训练或转换额外结构 |

### 5.3 配置示例

```bash
python -m vllm.entrypoints.openai.api_server \
  --model /models/Qwen2.5-72B-Instruct \
  --speculative-model /models/Qwen2.5-1.5B-Instruct \
  --num-speculative-tokens 5 \
  --use-v2-block-manager
```

**建议**：仅在 TTFT 已满足、需要进一步优化流式体验的场景启用；上线前用真实流量验证接受率是否大于 65%。

---

## 6. 多模型路由与 Fallback

### 6.1 路由策略

生产环境通常不会只跑一个模型。路由层根据请求特征选择最合适的模型实例，从而在不同成本、质量、延迟之间取得平衡。良好的路由策略能够避免「所有流量都涌向最大模型」的资源浪费，同时保证关键业务获得高质量模型支持。路由决策应尽量前置到 Gateway 层完成，避免让每个客户端自行选择模型，否则难以统一治理和成本归因。

| 路由维度 | 示例规则 |
|----------|----------|
| **能力匹配** | 复杂推理 → o1/DeepSeek-R1；常规问答 → GPT-4o/Qwen2.5 |
| **成本分层** | 内部测试 → 小模型；付费客户 → 大模型 |
| **延迟 SLA** | 实时场景 → 8B/14B；离线任务 → 72B/405B |
| **区域合规** | 国内数据 → 私有化模型；海外数据 → 云厂商 API |
| **配额与负载** | 当前模型 queue 深 → 路由到空闲副本 |

### 6.2 Fallback 设计

Fallback 不是简单重试，而是有策略的降级。设计良好的 Fallback 能够在主链路故障时保障用户体验，同时避免对备用系统造成冲击。Fallback 需要与熔断、限流配合，防止故障放大。需要注意的是，Fallback 模型可能在输出风格、能力边界上与主模型不同，因此客户端应被告知或能够兼容这种差异。

1. **模型级 Fallback**：主模型 5xx/timeout → 切换到同能力备用模型（如 GPT-4o → Qwen2.5-72B）。
2. **区域级 Fallback**：可用区 A GPU 故障 → 切到可用区 B。
3. **降级响应**：大模型过载时返回「请稍后」或触发异步任务。
4. **熔断**：连续错误率达到阈值后短时间停止转发，避免雪崩。

### 6.3 网关路由配置示例

以下使用 LiteLLM Proxy 展示一个模型别名下挂载多个 upstream 并配置 Fallback 的示例：

```yaml
model_list:
  - model_name: gpt-4o-class
    litellm_params:
      model: openai/gpt-4o
      api_key: os.environ/OPENAI_API_KEY
      timeout: 30
    rpm: 1000
  - model_name: gpt-4o-class
    litellm_params:
      model: vllm/Qwen2.5-72B-Instruct
      api_base: http://vllm-qwen72b:8000/v1
      timeout: 60
    rpm: 500

router_settings:
  routing_strategy: "least-busy"
  fallback_dict:
    gpt-4o-class: ["qwen72b-class"]
  cooldown_time: 30
```

---

## 7. 安全、监控与成本优化

### 7.1 安全护栏

LLM 生产服务的安全风险贯穿输入、输出、基础设施与合规四个层面。必须在接入层或推理层部署护栏，而不是依赖模型自身的对齐能力。常见的护栏框架包括 Llama Guard、Nemo Guardrails、Guardrails AI 以及云厂商提供的 Bedrock Guardrails。护栏规则应版本化管理，并与 CI/CD 集成，确保策略变更可追溯、可回滚。

| 层级 | 措施 |
|------|------|
| **输入侧** | Prompt Injection / Jailbreak 检测；敏感词过滤；PII 识别与脱敏 |
| **输出侧** | 毒性/偏见/幻觉检测；AIGC 标识；输出长度与格式校验 |
| **基础设施** | mTLS 通信、模型文件签名校验、容器镜像扫描、最小权限 RBAC |
| **合规** | 审计日志保留、数据出境评估、模型版本留痕 |

### 7.2 可观测性关键指标

生产 LLM 服务需要建立从请求入口到 GPU 内核的全链路可观测性。建议接入 OpenTelemetry 实现 trace，Prometheus + Grafana 实现 metrics，ELK/Loki 实现日志聚合。关键指标应纳入告警与 SLO 体系。Trace 维度上，建议将一次请求拆分为 Gateway 路由、护栏检查、模型 prefill、模型 decode、后处理等 span，便于定位延迟瓶颈。

```
黄金指标:
├── 延迟
│   ├── TTFT (Time To First Token)
│   ├── TPOT (Time Per Output Token)
│   └── E2E latency
├── 吞吐
│   ├── requests/sec
│   └── tokens/sec (prefill + decode)
├── 可用性
│   ├── error rate (5xx, timeout)
│   └── model load/health
├── 资源
│   ├── GPU util / memory
│   ├── KV Cache 使用率
│   └── queue depth / waiting requests
└── 成本
    ├── $/1K tokens
    └── cost per request by model
```

### 7.3 成本优化 checklist

- [ ] 优先使用 Prefix Caching 消除重复 prefill。
- [ ] 对非关键任务启用 AWQ/GPTQ 4-bit 量化。
- [ ] 合理设置 `max_tokens`，避免生成长度失控。
- [ ] 利用 chunked prefill 与 continuous batching 提升 GPU 利用率。
- [ ] 按业务重要性设置不同模型路由，避免所有流量都走最大模型。
- [ ] 对高频固定 prompt 增加应用层缓存（如 Embedding/RAG 结果缓存）。
- [ ] 监控并告警低 GPU 利用率副本，及时调整 HPA 阈值。
- [ ] 使用 spot/preemptible GPU 仅用于可中断的离线批处理，不用于在线服务。

---

## 8. 容量规划与资源估算

在生产上线前，必须进行容量规划，避免 GPU 资源浪费或服务过载。一个简单的估算公式如下：

```
所需 GPU 显存 ≈ 模型权重 + KV Cache + 激活值 + 预留缓冲

模型权重（FP16）≈ 参数量 × 2 bytes
模型权重（AWQ 4-bit）≈ 参数量 × 0.5 bytes
KV Cache ≈ batch_size × seq_len × layers × hidden_dim × 2 × precision_bytes
预留缓冲建议占总显存 5%-10%
```

例如，一个 72B 参数模型使用 AWQ 4-bit 量化，单节点 4×A100 80GB 通常可满足 32K 上下文、256 并发序列的需求。若业务上下文较短、并发较低，可考虑降级到 2×A100 以降低成本。容量规划应结合压测结果反复校准，而不是仅靠理论估算。建议逐步加压至目标 QPS 的 120%，观察延迟、错误率与显存占用的变化曲线，找到稳定运行的边界。

---

## 9. 上线前 Checklist

- [ ] 模型文件、tokenizer、配置文件版本一致，已做 SHA256 校验。
- [ ] 推理引擎版本、CUDA driver、PyTorch、flash-attn 等依赖已锁定并测试。
- [ ] 长上下文、高并发、异常输入（超长 prompt、特殊字符）均已压测。
- [ ] Gateway 路由、限流、Fallback、熔断策略已配置并验证。
- [ ] KV Cache / Prefix Caching 已针对共享前缀场景调优。
- [ ] 量化模型在业务评测集上精度退化在可接受范围（通常 < 2%）。
- [ ] 输入/输出护栏、PII 脱敏、审计日志已接入。
- [ ] Prometheus/Grafana 监控大盘与 PagerDuty/飞书告警已就绪。
- [ ] 模型回滚方案明确：保留上一版本镜像与模型快照，5 分钟内可切回。
- [ ] 成本 Dashboard 已上线，可按项目/用户/模型维度归因。
- [ ] 灾难恢复演练完成：单 Pod、单节点、单可用区故障不影响核心服务。

---

## 10. 总结

LLM 生产部署的核心矛盾是**质量、延迟、成本、可用性**四者的平衡。没有「最好」的引擎，只有最适合当前流量特征、团队能力与业务约束的组合。建议以 vLLM/SGLang 作为默认服务底座，以 Gateway 实现统一入口与多模型治理，以 Prefix Caching、量化、投机解码作为性能杠杆，以可观测性 + checklist 作为持续运营的保障。

生产环境的变化速度很快，新的推理引擎、量化方法和硬件平台会持续涌现。因此，最重要的不是一次性选择完美方案，而是建立一套能够快速评估、灰度验证和回滚迭代的工程流程。保持模型版本、镜像版本、配置版本的一致性，并在每次变更前跑完 checklist，才能在高强度的生产环境中稳定交付 LLM 服务。

---

## Related

- [[大模型/Edge_LLM/Edge_LLM_Deep_Dive|小模型与端侧 LLM 深度解读]]
- [[大模型/LLM_Architectures/Reasoning_Models_2026|LLM 推理模型 2026]]
- [[大模型/Fine_tuning_Techniques/Fine_tuning_Techniques|微调技术 (Fine-tuning Techniques)]]
- [[架构基建/AI_SRE_Runbook|AI SRE Runbook]]
- [[智能体/Agent_Production_Deployment_Runbook|Agent 生产部署 Runbook]]
- [[治理/ai-production-readiness|AI 生产就绪]] — 跨 LLM/RAG/Agent/SRE 的系统工程视角
