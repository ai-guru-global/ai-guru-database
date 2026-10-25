---
title: "阶跃星辰 StepFun 模型系列 (StepFun Step Family)"
category: concepts
tags:
  - llm
  - stepfun
  - step
  - step-audio
  - step-video
  - gelab
  - chinese-llm
  - moe
  - multimodal
  - speech
  - video
  - gui-agent
aliases:
  - StepFun Series
  - 阶跃星辰
  - Step-1
  - Step-2
  - Step-3
  - Step-3.7-Flash
  - Step-Audio
  - Step-Video
relationships:
  - target: "概念/llm-architectures"
    type: related_to
  - target: "概念/moe"
    type: uses
  - target: "概念/multimodal-llm"
    type: related_to
  - target: "概念/speech-audio-ai"
    type: related_to
  - target: "概念/video-generation"
    type: related_to
  - target: "概念/agent-architectures"
    type: related_to
summary: "阶跃星辰(StepFun)是中国大模型六虎之一,全栈覆盖文本/语音/视频/图像/Agent 五大模态。旗舰 Step-3 是 321B 总参/38B 激活的 MoE VLM,创新引入 MFA(Multi-Matrix Factorization Attention)+ AFD(Attention-FFN Disaggregation)。Step-Audio 2 是首个端到端语音对话系统,URO-Bench 78.86 中文/79.03 英文超 GPT-4o Audio。gelab-zero 是银河系顶级开源 GUI Agent。"
lifecycle: reviewed
tier: core
created: 2026-07-23
updated: 2026-07-23
sources: []
name_zh: "阶跃星辰 StepFun 模型系列"
---

# 阶跃星辰 StepFun 模型系列

> 中文简称：阶跃星辰 StepFun 模型系列

> **一句话理解**: 中国大模型六虎中最"全栈"的选手——文本 + 语音 + 视频 + 图像 + GUI Agent 五大模态全部开源,Step-3 旗舰 321B MoE 创新 MFA+AFD,Step-Audio 2 端到端语音对话超 GPT-4o Audio,gelab-zero 拿下开源 GUI Agent 第一。

---

## 一、公司与团队背景

| 维度 | 信息 |
|---|---|
| **公司** | 阶跃星辰(StepFun) |
| **起源** | 微软亚研院系,前微软大中华区副总裁姜大昕创立(2023) |
| **投资人** | 上海国投、腾讯、五源、启明 |
| **产品形态** | 跃问(Step Chat,消费端)+ StepFun 开放平台(API) |
| **开源度** | **全栈开源,Apache 2.0 / MIT 友好协议** |
| **核心优势** | 多模态全栈 + 训练基础设施自研(SteptronOSS) |

---

## 二、模型家族全景

```
阶跃星辰 StepFun 模型家族
│
├── 旗舰文本 / 多模态
│   ├── Step-3 (321B 总参 / 38B 激活, MoE VLM,2025)
│   ├── Step-3.7-Flash (高效率 Flash 实时 Agent)
│   ├── Step-2 系列(2025)
│   ├── Step-1 (文本基座,2024)
│   └── Step-1V (多模态基座)
│
├── 语音 / 音频
│   ├── Step-Audio 2 (130B 端到端语音对话,2025-07)
│   ├── Step-Audio-Chat (130B,开源首个)
│   ├── Step-Audio-TTS-3B (TTS 专用)
│   ├── Step-Audio-Tokenizer
│   └── Step-Audio-R1 (带推理的语音)
│
├── 视频生成
│   ├── Step-Video-T2V (30B,开源 SOTA 视频生成)
│   ├── Step-Video-T2V-Turbo (蒸馏版)
│   └── Step-Video-T2V-Eval (评测基准)
│
├── 图像编辑
│   ├── Step1X-Edit (开源 SOTA 图像编辑,GEdit-Bench 7.66)
│   ├── Step1X-Edit-v1p2 (ReasonEdit,带思考的图像编辑)
│   └── Step-Image-Edit-2 (轻量,2 秒响应)
│
├── GUI Agent
│   ├── gelab-zero (银河系顶级 GUI Agent,2025)
│   └── Step-GUI (GELab 团队出品)
│
└── 训练 / 推理框架
    ├── SteptronOSS (轻量训练框架,Apache 2.0)
    ├── SteptronOss
    └── StepRPC / StepTelemetry / StepMind (基础设施)
```

---

## 三、Step-3 旗舰 VLM(2025 最新)

### 3.1 核心规格

| 维度 | 数值 / 说明 |
|---|---|
| **总参 / 激活** | 321B / 38B(MoE,~12% 激活率) |
| **架构** | MoE VLM(MFA + AFD 双创新) |
| **上下文** | 65K(实测可更长) |
| **模态** | 文本 + 图像 + 视频 |
| **部署 BF16** | 16×H20 GPU(2 节点×8 卡 NVLink) |
| **部署 FP8** | 8×H20 GPU(1 节点×8 卡) |
| **开源协议** | Apache 2.0 |

### 3.2 两大架构创新

#### (1) MFA:Multi-Matrix Factorization Attention

将 Q/K/V/O 矩阵做因子分解,降低注意力层参数量与计算量,保持长程依赖能力。

#### (2) AFD:Attention-FFN Disaggregation(注意力-FFN 解耦)

Attention 与 FFN 异构调度,Prefill / Decode 阶段分池,吞吐与延迟同时优化。

### 3.3 vLLM 部署

```bash
# FP8 部署(8×H20 单节点)
pip install -U vllm --extra-index-url https://wheels.vllm.ai/nightly
vllm serve ./ \
  --tensor-parallel-size 8 \
  --reasoning-parser step3 \
  --enable-auto-tool-choice \
  --tool-call-parser step3 \
  --trust-remote-code \
  --max-num-batched-tokens 8192
```

### 3.4 OpenAI 兼容 API

```python
from openai import OpenAI

client = OpenAI(api_key="EMPTY", base_url="http://localhost:8000/v1")

# 文本
response = client.chat.completions.create(
    model="step3",
    messages=[{"role": "user", "content": "解释 MFA 注意力机制"}]
)

# 多模态(图像)
response = client.chat.completions.create(
    model="step3",
    messages=[{
        "role": "user",
        "content": [
            {"type": "image_url", "image_url": {"url": "data:image/png;base64,..."}},
            {"type": "text", "text": "分析这张图"}
        ]
    }]
)

# 工具调用
response = client.chat.completions.create(
    model="step3",
    messages=[{"role": "user", "content": "用 Python 写一个 MoE 激活占比计算"}],
    tools=[{"type": "function", "function": {...}}],
    tool_choice="auto"
)
```

---

## 四、Step-Audio 2:端到端语音对话(2025-07-28)

**首个真正"端到端"语音对话系统**,抛弃"ASR + LLM + TTS"三段式,直接"语音进 / 语音出"。

### 4.1 核心创新

| 维度 | 数值 / 说明 |
|---|---|
| **基础模型** | Step-1(130B 文本 LLM)+ 音频持续预训练 |
| **音频编码** | 25Hz 输出帧率,2× 下采样至 12.5Hz |
| **Tokenizer** | CosyVoice 2 标记器(双码本:语义 16.7Hz + 声学 25Hz) |
| **训练数据** | 800 万小时音频 + 1.356 万亿 token |
| **训练时长** | 21 天 |
| **SFT 数据** | 40 亿 token 高质量文本 + 音频混合 |
| **强化学习** | 二元奖励 → 学习偏好评分 → GRPO 400 轮 |

### 4.2 关键成绩

| 基准 | Step-Audio 2 | GPT-4o Audio | Kimi-Audio |
|---|---|---|---|
| **AISHELL-1(中)** | 1.95 | 4.26 | 3.06 |
| **AISHELL-2(中)** | 2.13 | 4.26 | — |
| **Librispeech(英)** | 3.11 | 较低 | 1.6 |
| **副语言理解(11 维)** | **76.55%** | 43.45% | — |
| **URO-Bench 中文** | **78.86** | <78 | 70.47 |
| **URO-Bench 英文** | **79.03** | <78 | — |
| **MMAU 音频理解** | **77.4%** | 较低 | 较高 |

### 4.3 核心能力

- 端到端语音对话(无 ASR/TTS 中间环节)
- 11 维副语言理解(性别 / 年龄 / 情感 / 语速 / 风格 / 韵律等)
- 多语言 / 方言(中 / 英 / 日 / 阿 / 粤 / 四川话 / 上海话)
- 情感语音合成(喜 / 怒 / 哀 / 撒娇)
- 声音克隆(50,000+ 说话人库)
- 音频搜索工具(动态切换声音风格)
- 内部思考机制(不可见推理,影响最终输出)

### 4.4 与竞品对比

| 维度 | Step-Audio 2 | GPT-4o Audio | Kimi-Audio | Qwen2.5-Omni |
|---|---|---|---|---|
| **架构** | 端到端单模型 | 级联 | 级联 | 双模块 Thinker-Talker |
| **副语言理解** | 76.55% | 43.45% | 较低 | 中 |
| **声音克隆** | 5 万说话人 | 闭源 | 闭源 | 部分 |
| **开源** | ✅ MIT | ❌ | 部分 | 部分 |
| **训练数据** | 800 万小时 | 不公开 | 不公开 | 不公开 |

---

## 五、Step-Video-T2V:开源视频生成 SOTA(2025)

### 5.1 核心规格

| 维度 | 数值 / 说明 |
|---|---|
| **参数量** | 30B(开源最大) |
| **分辨率** | 544×992 |
| **最长帧数** | 204 帧 |
| **VAE 压缩** | 16×16 空间 + 8× 时间 |
| **架构** | DiT + Flow Matching + 3D Full Attention |
| **文本编码** | Hunyuan-CLIP(双向,77 token)+ Step-LLM(单向 Alibi,无限长) |
| **位置编码** | RoPE-3D(T/H/W 独立) |
| **训练策略** | T2I 预训练 → T2VI 联合 → T2V 微调 → DPO |
| **基础 GPU** | 数千 H800 + RoCEv2 网络 |

### 5.2 Step-Video-T2V-Turbo(蒸馏)

- 50 步 → 8-10 步
- U 形时间步采样策略
- 分类器自由引导(CFG)优化
- 推理速度显著提升,质量保持

### 5.3 系统创新(StepRPC / StepTelemetry / StepMind)

```
Step-Video-T2V 训练基础设施
│
├── Step Emulator
│   └── 训练前模拟不同架构 / 并行策略,优化资源配置
│
├── StepRPC
│   ├── RDMA + TCP 融合通信
│   ├── 张量原生通信(零拷贝)
│   └── 广播 / 喷射模式
│
├── StepTelemetry
│   ├── 异常检测(CUDA 事件)
│   └── 数据统计(OLAP)
│
└── StepMind
    ├── 故障检测(致命 / 非致命)
    ├── 节点质量评分
    └── 99% 训练时间利用率
```

### 5.4 Step-Video-T2V-Eval 基准

128 个真实提示,11 个类别,用于视频生成模型评测。

---

## 六、Step1X-Edit:开源 SOTA 图像编辑(2025)

### 6.1 核心创新

- **ReasonEdit(带推理)**:v1p2-preview 支持思考 + 反思
- 性能:GEdit-Bench 7.66 → 8.18(thinking + reflection)
- KRIS-Bench:53.05 → 60.93(thinking + reflection)

### 6.2 推理能力

```
输入图像 + 指令
     ↓
Reformat Prompt(思考)
     ↓
生成候选
     ↓
Reflection(反思)
     ↓
最终图像
```

### 6.3 LoRA 微调(单 24GB GPU 可跑)

- LoRA rank=64, batchsize=1
- DiT bf16:29.7GB(fp8:19.8GB)
- 1×24GB GPU 即可微调 1024 分辨率

### 6.4 性能对比(GEdit-Bench)

| 模型 | G_SC | G_PQ | G_O |
|---|---|---|---|
| Flux-Kontext-dev | 7.16 | 7.37 | 6.51 |
| Qwen-Image-Edit-2509 | 8.00 | 7.86 | 7.56 |
| Step1X-Edit v1.1 | 7.66 | 7.35 | 6.97 |
| Step1X-Edit v1p2(thinking + reflection) | **8.18** | **7.85** | **7.58** |

---

## 七、gelab-zero:开源 GUI Agent 银河系第一(2025)

**STEP-GUI: The top GUI agent solution in the galaxy.**

| 维度 | 说明 |
|---|---|
| **团队** | StepFun-GELab |
| **能力** | PC / 移动端 / Web GUI 操作 |
| **协议** | MIT |
| **集成** | 基于 StepFun 视觉理解能力 |
| **应用** | 自动化测试、机器人流程自动化、GUI 数据采集 |

---

## 八、SteptronOSS:轻量训练框架(2025)

| 维度 | 说明 |
|---|---|
| **协议** | Apache 2.0 |
| **特性** | AI-native 训练框架,适合 StepFun 全栈模型 |
| **工作流** | SFT → RLVR → 评估 |
| **亮点** | 快速迭代、可复现实验、模块化配置 |
| **训练** | 500+ commits,577 stars(2026) |

---

## 九、API 与生态接入

### 9.1 商业 API(StepFun 开放平台)

```python
from openai import OpenAI

client = OpenAI(
    api_key="your-stepfun-key",
    base_url="https://api.stepfun.com/v1"
)

# Step-3 多模态
response = client.chat.completions.create(
    model="step-3",
    messages=[{"role": "user", "content": "..."}]
)

# Step-Audio 2(原生语音,新增 multimodal-audio 模型)
response = client.chat.completions.create(
    model="step-audio-2",
    modalities=["text", "audio"],
    audio={"voice": "male-qn-qingse", "format": "wav"},
    messages=[{"role": "user", "content": "你好,用撒娇的语气说"}]
)
```

### 9.2 在线体验(跃问)

- Web:跃问 Step Chat
- 移动端:跃问 App
- API:platform.stepfun.com

---

## 十、关键人物

| 人物 | 角色 |
|---|---|
| **姜大昕** | 创始人 / CEO,前微软亚研院首席研究员 |
| **段清华** | 算法负责人 |
| **张祥雨** | 高级研究员(前旷视) |
| **StepFun-GELab** | GUI Agent 团队 |
| **StepFun Audio Team** | Step-Audio 2 团队 |

---

## 十一、技术细节深挖

### 11.1 Step-Audio 2 端到端设计

```
传统级联:    Audio → ASR → Text → LLM → Text → TTS → Audio
            (4 段信息损失 + 3 个延迟)

Step-Audio 2: Audio → Token → 130B LLM + 思考 → Token → Audio
              (零中间损失 + 单次推理)
```

### 11.2 Step-Video 训练四阶段

```
1. T2I 预训练(图像质量基线)
        ↓
2. T2VI 联合训练(192P → 540P)
   ├── 阶段 1:低分辨率 192P 重点学习运动
   └── 阶段 2:高分辨率 540P 学习细节
        ↓
3. T2V 微调(去 T2I,专注视频)
        ↓
4. Video-DPO(人类偏好对齐)
```

### 11.3 MFA 注意力分解

```
标准 Attention:Q, K, V ∈ R^(d×d)
               (参数量 d²,计算量 O(n²d))

MFA:           Q = Q1·Q2  (低秩分解)
               K = K1·K2
               V = V1·V2
               (参数量降为 d·r × 2,长程保持)
```

---

## 十二、与竞品对比

| 维度 | Step-3 | GLM-4.5 | Doubao-1.5 Pro | Qwen3-235B |
|---|---|---|---|---|
| **总参 / 激活** | 321B / 38B | 355B / 32B | 闭源 / 20B | 235B / 22B |
| **架构** | MoE + MFA + AFD | MoE | 稀疏 MoE | MoE |
| **多模态** | 原生 VLM | GLM-4.5V | Seed1.5-VL | Qwen3-VL |
| **开源** | Apache 2.0 | MIT | 部分(论文) | Apache 2.0 |
| **语音** | Step-Audio 2 | 无 | 闭源 | Qwen2.5-Omni |
| **视频** | Step-Video-T2V | CogVideoX | Seedance | 闭源 |
| **GUI Agent** | gelab-zero 第一 | 无 | 闭源 | Qwen-Agent |
| **全栈度** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |

---

## 十三、争议与限制

- **品牌国际化**:海外 StepFun 知名度低于字节 / 阿里
- **多模态资源开销**:全栈模型 GPU 显存要求高
- **GUI Agent 安全性**:开源 gelab-zero 需关注自动化操作安全边界
- **Step-Audio 2 资源需求**:130B 模型需 4×A800 推理
- **集成复杂度**:5 大模态各自独立部署,企业集成门槛高

---

## 十四、相关概念

- [[概念/llm-architectures|LLM 架构]]
- [[概念/General/mixture-of-experts|MoE 混合专家]]
- [[概念/multimodal-llm|多模态 LLM]]
- [[概念/speech-audio-ai|语音 AI]]
- [[概念/video-generation|视频生成]]
- [[概念/Agent/agent-architectures|Agent 架构]]
- [[概念/llm-quantization|模型量化]]
- [[概念/vllm|vLLM 推理]]

---

## 十五、See Also(深度专题)

- [StepFun 官方 GitHub](https://github.com/stepfun-ai) — 官方组织
- [Step-3 vLLM 部署文档](https://blog.csdn.net/gitblog_00503/article/details/151629539) — 实战
- [Step-Audio 2 论文 arXiv:2507.16632](https://arxiv.org/abs/2507.16632) — 官方
- [Step-Audio GitHub](https://github.com/stepfun-ai/step-audio) — 官方
- [Step-Video-T2V 论文 arXiv:2502.10248](https://arxiv.org/abs/2502.10248) — 官方
- [Step1X-Edit GitHub](https://github.com/stepfun-ai/Step1X-Edit) — 官方
- [gelab-zero GitHub](https://github.com/stepfun-ai/gelab-zero) — 官方
- [SteptronOSS 训练框架](https://github.com/stepfun-ai/SteptronOss) — 官方
- [StepFun 开放平台](https://platform.stepfun.com) — 官方 API
- [跃问(Step Chat)](https://stepchat.cn/) — C 端

---

## 2026 StepFun 生态速览

| 特性 / 工具 | 说明 | 状态 |
|---|---|---|
| **Step-3** | 321B MoE VLM,MFA+AFD 创新 | GA |
| **Step-3.7-Flash** | 高效率 Flash 实时 Agent | Beta |
| **Step-Audio 2** | 端到端语音对话,URO-Bench 第一 | GA |
| **Step-Audio-TTS-3B** | TTS 专用,Apache 2.0 | GA |
| **Step-Video-T2V** | 30B 视频生成,开源 SOTA | GA |
| **Step1X-Edit v1p2** | 图像编辑,ReasonEdit 思考 | GA |
| **Step-Image-Edit-2** | 2 秒响应轻量级 | GA |
| **gelab-zero** | GUI Agent 银河系第一 | GA |
| **SteptronOSS** | 训练框架,Apache 2.0 | GA |
| **Step-RPC / Step-Telemetry** | 训练基础设施 | GA |
| **StepRealtime Console / CLI** | 实时控制台 | Beta |
| **StepAudio-Skills** | 音频技能 | Beta |

## 生产最佳实践

1. **多模态全栈需求**:StepFun 是国产唯一"全栈 5 模态开源"
2. **语音交互首选**:Step-Audio 2 是国产最佳开源语音对话
3. **视频生成**:Step-Video-T2V 开源最大(30B),Turbo 加速版
4. **图像编辑**:Step1X-Edit v1p2 ReasonEdit 思考模式
5. **GUI Agent**:gelab-zero 开源第一,自托管可商用
6. **本地部署**:Step-3 需 8-16 张 H20(FP8 / BF16)
7. **微调**:SteptronOSS + LoRA 全栈支持
8. **API 集成**:OpenAI 兼容,迁移成本低
9. **企业合规**:Apache 2.0 / MIT 协议,商用无忧
10. **多模态统一**:Step-3 单模型覆盖文本+图像+视频,简化架构
