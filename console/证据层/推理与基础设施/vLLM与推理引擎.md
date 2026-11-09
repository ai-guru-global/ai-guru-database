---
线索: vLLM与推理引擎
主题: 推理与基础设施
别名: [vLLM, SGLang, TensorRT-LLM, 推理优化]
状态: 活跃
创建: 2026-07-30
更新: 2026-10-03
关键角色: [vLLM 社区, UC Berkeley, NVIDIA, LMSYS, DeepSeek]
---

# vLLM与推理引擎

> 开源推理引擎的军备竞赛：PagedAttention 开启的高吞吐推理时代，决定每个 token 的成本下限。

## 概述

vLLM 起源于 UC Berkeley 的 PagedAttention 论文（2023），以类操作系统虚拟内存的方式管理 KV Cache，大幅提升吞吐量，迅速成为开源 LLM 推理的事实标准。其竞争者包括 SGLang（RadixAttention）、NVIDIA TensorRT-LLM、Hugging Face TGI 等。推理引擎的效率直接决定 API 价格战的成本底线，是「模型民主化」背后最重要的基础设施。

该线索追踪推理引擎的技术演进（连续批处理、投机解码、前缀缓存、分布式推理）与生态格局。

### 2026-09

- **2026-09-30** · [vLLM 分离式推理（Disaggregated Serving）实用指南](https://aihot.virxact.com/items/seoe3daylyyh1pqcwj4cklrpe)
  vLLM 官方博客：Prefill/Decode 分离式部署的生产实践指南——PD 分离从论文形态进入主流开源引擎的官方文档层。
- **2026-09-24** · [vLLM 新增基于 Gumbel-max 的无失真文本水印功能](https://aihot.virxact.com/items/cmuftlsmy08bfroxz8mnqow1d)
  vLLM 官方博客：Gumbel-max 采样实现无失真文本水印——与 Anthropic Claude 文本水印（08-11）、Google DeepMind SynthID Bio（09-30）并列，水印能力首次下沉到开源推理引擎层。
- **2026-09-23** · [vLLM 发布 vllm-metal v0.28.0：在 Apple Silicon 上支持并发推理服务](https://aihot.virxact.com/items/cmue9uxe20smtroghgwne9l3u)
  vLLM 官方博客：Apple Silicon 并发推理服务——开源推理引擎把「本地 Mac 当推理服务器」做成官方支持形态，端侧推理与开发机自托管场景扩容。
- **2026-09-08** · [vLLM x AgentX：面向真实世界智能体推理服务的全栈优化](https://aihot.virxact.com/items/cmtym20dc0005rovuprjuu7xo)
  vLLM 官方博客：与 AgentX 合作的全栈智能体推理优化——Agent 负载（长上下文、多轮、工具调用）取代单轮对话成为推理引擎的头等优化对象；与 Modal 9-23「万亿 token 规模服务 Kimi K2.6 编码 Agent」同向。
- **2026-09-07** · [Cohere 详解 North Mini Code 的 megakernel 推理引擎，单 H100 上比 vLLM 快 1.25–1.41 倍](https://aihot.virxact.com/items/gpw1qeypdu4lyt3u0ijp5m2s5)
  Cohere Labs 官方研究博客：megakernel 架构在单 H100 上较 vLLM 提速 1.25–1.41 倍（厂商自测口径 ⚠️）——自研推理引擎对 vLLM 的正面挑战从创业公司（SGLang 系）蔓延到模型厂商。
- **2026-09-01** · [Hugging Face 发布 @huggingface/kernels，提供 207 个 WebGPU 内核用于浏览器本地 AI 推理](https://aihot.virxact.com/items/cmtitozyq04j2ro9ydv3oxgsd)
  Hugging Face 官方发布 kernels 库，首批 207 个 WebGPU 内核让大模型推理直接跑进浏览器——推理栈从数据中心向端侧/浏览器场景继续下沉。

### 2026-08

- **2026-08-20** · [Hugging Face 发布 LFM2.5 系列 DSpark 草稿模型，推理速度最高提升 3.18 倍](https://aihot.virxact.com/items/cmt1rv5n8066iroovaxgoej1b)
  Hugging Face 官方博客宣布为 LFM2.5 系列发布 DSpark 草稿模型，推理速度最高提升 3.18 倍——DeepSeek 开源的 DSpark 投机解码框架获得官方级第三方落地。
- **2026-08-09** · [inclusionAI 发布 Ling-3.0-flash 的 DSpark 投机解码模型 Ling3-DSpark](https://aihot.virxact.com/items/cmt333krj0fv5ro6tjw6bmtb2)
  蚂蚁 inclusionAI 在 Hugging Face 发布 Ling3-DSpark，为 Ling-3.0-flash 配套 DSpark 投机解码草稿模型——投机解码从框架开源进入「按模型配草稿」的常规化阶段。
- **2026-08-07** · [HPC-Ops × SGLang：腾讯混元开源高性能 Attention、Router GEMM 与 MoE 算子](https://aihot.virxact.com/items/cmsj8rfkl02ruroo5uvyqiqiq)
  LMSYS 博客披露与腾讯混元的合作成果：高性能 Attention、Router GEMM 与 MoE 算子开源进入 SGLang——大厂以内核级贡献反哺开源推理引擎。

### 2026-07

- **2026-07-30** · [RadixArk 与 Google Cloud 将完整 SGLang 功能引入 TPU](https://aihot.virxact.com/items/cms7oxay30o4nro2e4t3r6ud2)
  LMSYS 官方博客宣布 SGLang 全功能登陆 TPU，开源推理栈对非 NVIDIA 硬件的覆盖进一步补齐。
- **2026-07-29** · [腾讯混元开源 AngelSpec 投机解码框架](https://aihot.virxact.com/items/cms639jt416x6robksy69dzel)
  腾讯混元官方宣布，AngelSpec 最高带来 2.4 倍推理加速，投机解码成为大厂竞相开源的标准组件。
- **2026-07-08** · [vLLM 发布原生速度的 transformers 建模后端](https://aihot.virxact.com/items/cmrcabmvj00ymihqce96ilbfi)
  Hugging Face 官方博客介绍 vLLM 新后端：直接以原生性能运行 transformers 模型定义，新模型接入无需等待专用 kernel 适配。

### 2026-06

- **2026-06-29** · [小红书开源 RedKnot 推理引擎](https://aihot.virxact.com/items/cmqz49v7400e4sldyr126zupc)
  将 KV Cache 按注意力头拆解存放实现长文本加速，国内大厂加入自研开源推理引擎行列。
- **2026-06-27** · [DeepSeek 开源 DSpark 投机解码框架](https://aihot.virxact.com/items/cmqwm45f901n6sly0gpl6b6l5)
  官方开源，可将 DeepSeek-V4 生成速度提升 60–85%，与 SGLang 后续集成形成置信度驱动的可变长度验证。
- **2026-06-15** · [LMSYS 发布下一代投机解码：DFlash 与 Spec V2](https://aihot.virxact.com/items/cmqfhhoq001hksl2aw53w2wz8)
  DFlash 块扩散草稿模型最高带来 15 倍吞吐提升，投机解码从「小草稿模型」演进为扩散式草稿生成。
- **2026-06-08** · [小米 MiMo 实现 1T MoE 模型 1000 tokens/s 输出](https://aihot.virxact.com/items/cmq5bjjga06d1slt2lstyzq8i)
  官方宣布 MiMo-V2.5-Pro-UltraSpeed 携手 TileRT 在单台 8-GPU 节点运行 1T 参数模型并突破 1000 tokens/s，解码速度里程碑。

### 2026-05

- **2026-05-28** · [SGLang 与 AMD 合作优化 MI355X 大规模推理](https://aihot.virxact.com/items/cmppprn04028nslvyqxgosjyn)
  LMSYS 官方博客披露，SGLang 团队让 AMD Instinct MI355X 上 DeepSeek-R1 分离式推理在总拥有成本上具备竞争力，非 NVIDIA 硬件的推理经济学改善。
- **2026-05-16** · [vLLM 支持万亿级参数模型](https://aihot.virxact.com/items/cmp8l2fu40jh2slnzqm9018vn)
  社区协作实现 vLLM 对万亿参数 MoE 的服务能力（蚂蚁 Ling-2.6-1T 发布当日即获 vLLM 支持），开源引擎跟上超大模型世代。

### 2026-04

- **2026-04-24** · [vLLM 整合 DeepSeek V4 优化](https://vllm.ai/blog/2026-04-24-deepseek-v4)
  vLLM 整合 FlashMLA + FlashInfer，为 DeepSeek V4 提供长上下文推理优化（DeepSeek Sparse Attention 有界注意力 + MoE 内核）。

### 2026-02

- **2026-02-20** · [GGML 与 llama.cpp 加入 Hugging Face](https://aihot.virxact.com/items/cmoegbhaj009bslxxx04qbbsb)
  Hugging Face 官方宣布接纳 GGML/llama.cpp 以保障本地 AI 的长期维护——端侧推理的事实标准获得机构化托管。

### 2026（持续）

- **2026（全年）** · vLLM / SGLang / TensorRT-LLM 三足鼎立
  TensorRT-LLM 在 NVIDIA 硬件上原始吞吐最高；SGLang 在结构化输出/受限解码占优；vLLM 易用、模型覆盖广，均已生产成熟。
- **2026（持续）** · DeepSeek FlashMLA / DSA
  FlashMLA CUDA 内核：预填充 640 TFlops、解码 410 TFlops；DeepSeek Sparse Attention 约降低 50% 推理成本。

### 2025-05

- **2025-05** · 大规模 MoE 推理成为主战场
  DeepSeek-V3/R1 等巨型 MoE 模型的流行推动 vLLM/SGLang 竞争 PD 分离（Prefill/Decode 解耦）、专家并行与多机推理能力，llm-d、Dynamo 等编排层项目涌现。

### 2025-01

- **2025-01** · vLLM V1 架构重构发布
  核心引擎重写：更干净的调度器、原生支持分块预填充与前缀缓存，吞吐与延迟全面提升，巩固其对 TGI 等早期方案的替代。

### 2024-07

- **2024-07** · vLLM 成为 Llama 3.1 405B 官方推荐推理方案之一
  Meta 发布 405B 模型时与 vLLM 社区合作支持多机推理，标志开源推理引擎具备服务最大规模开源模型的能力。

### 2023-06

- **2023-06** · [vLLM 开源发布](https://blog.vllm.ai/2023/06/20/vllm.html)
  PagedAttention 论文配套开源实现，宣称相对 HF Transformers 提升最高 24 倍吞吐，LMSYS 用其支撑 Vicuna 演示服务，项目迅速爆红。

## 分析

1. **推理成本是产业杠杆**：过去两年 LLM API 价格下降了两个数量级，推理引擎优化（批处理、量化、投机解码）贡献了其中相当大比例。每一次引擎效率突破都直接转化为应用层的可行性边界扩张。

2. **开源治理的样本**：vLLM 从伯克利项目成长为 PyTorch 基金会旗下的中立项目，贡献者覆盖所有芯片厂商（NVIDIA/AMD/Intel/TPU/昇腾）——它已成为硬件竞争的「中立缓冲层」，谁都输不起。

3. **从单机到集群**：推理优化的前沿已从单卡 kernel 转向集群级调度（PD 分离、KV 传输、路由），推理系统正在复刻当年大数据系统（Hadoop→Spark→K8s）的演化轨迹。

## 关联线索

- [[推理与基础设施/AI芯片竞争]]
- [[开源模型与生态/Llama]]
- [[开源模型与生态/DeepSeek]]
