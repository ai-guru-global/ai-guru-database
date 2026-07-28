---
title: "书生 InternLM 3 模型系列 (Shanghai AI Lab InternLM Family)"
category: concepts
tags:
  - llm
  - internlm
  - shanghai-ai-lab
  - chinese-llm
  - open-source
  - multimodal
  - internvl
  - bookworm
aliases:
  - InternLM 3
  - InternLM3
  - 书生·浦语
  - InternVL
  - InternLM-XComposer
  - Intern-Robotics
relationships:
  - target: "概念/llm-architectures"
    type: related_to
  - target: "概念/multimodal-llm"
    type: related_to
  - target: "概念/long-context-llm"
    type: related_to
  - target: "概念/agent-architectures"
    type: related_to
  - target: "概念/llm-training"
    type: related_to
summary: "上海 AI 实验室(上海人工智能实验室)开源的国产大模型系列,InternLM3-8B-Instruct(2025-01)以 4T tokens 训练成本降低 75% 而性能比肩 70B 级模型,支持深度思考模式。InternLM 多模态系列(InternVL / InternLM-XComposer)是中国最早的多模态开源代表。Intern-Robotics 是首个开源具身全栈引擎。"
lifecycle: reviewed
tier: core
created: 2026-07-23
updated: 2026-07-23
sources: []
name_zh: "书生 InternLM 3 模型系列"
---

# 书生 InternLM 3 模型系列

> 中文简称：书生 InternLM 3 模型系列

> **一句话理解**: 上海 AI 实验室(上海人工智能实验室)主导的开源旗舰,"轻量高效 + 多模态 + 具身"三线并进——InternLM3-8B-Instruct 用 1/4 训练成本追上 70B 性能,InternVL/XComposer 拿下多模态开源,Intern-Robotics 引领具身全栈开源。

---

## 一、机构与团队背景

| 维度 | 信息 |
|---|---|
| **机构** | 上海人工智能实验室(Shanghai AI Lab) |
| **学术合作** | 清华、复旦、上交、港中文、商汤、OpenGVLab |
| **开源协议** | **Apache 2.0(可商用,模型权重免费)** |
| **代表人物** | 林达华、王晓刚、陈恺、周伯文、叶杰平 |
| **产品矩阵** | 书生·浦语(LLM) + 书生·多模态 + 书生·具身 |
| **基础设施** | OpenCompass(评测) + InternEvo(训练框架) + LMDeploy(推理) |
| **海外传播** | InternLM(英文) / InternVL(多模态) / XComposer(创作) |

---

## 二、模型家族全景

```
书生 InternLM 模型家族
│
├── 文本旗舰 (书生·浦语)
│   ├── InternLM3-8B-Instruct (2025-01,深度思考)
│   ├── InternLM3 系列(在研)
│   ├── InternLM2.5-7B/20B (2024-07,200K 上下文)
│   ├── InternLM2-1.8B/7B/20B (2024-01)
│   ├── InternLM-Math-7B/20B (2024-01,数学)
│   └── InternLM-7B/20B (2023,首代)
│
├── 多模态语言
│   ├── InternVL 3.5 (2025,241B-A28B,开源 SOTA)
│   ├── InternVL 3 (2024,4B/8B/22B/38B/76B/110B)
│   └── InternVL 2.0/1.5/1.0
│
├── 多模态创作
│   ├── InternLM-XComposer-2.5 (7B, GPT-4V 级)
│   ├── InternLM-XComposer-2.5-Reward (ACL 2025)
│   ├── InternLM-XComposer-2.5-OmniLive (流式音视频)
│   └── InternLM-XComposer-2.0/1.0
│
├── 具身智能
│   ├── Intern-Robotics (2025-07,首个开源具身全栈引擎)
│   │   ├── Intern·Nav (导航)
│   │   ├── Intern·Manip (操作)
│   │   ├── Intern·Humanoid (人形机器人)
│   │   └── Intern·SR (Sim2Real)
│   ├── Intern·VLA (Vision-Language-Action 模型)
│   └── Intern·Utopia(原 GRUtopia 2.0,仿真)
│
├── 文档解析
│   └── MinerU / MinerU2.5 (1.2B,2025-09,OmniDocBench 第一)
│
├── 评测 / 工具
│   ├── OpenCompass (评测框架)
│   ├── InternEvo (训练框架)
│   ├── LMDeploy (推理框架)
│   └── CompassRank (综合榜单)
│
└── 行业解决方案
    ├── CFBenchmark (金融评测)
    ├── OpenFinData (金融数据)
    └── OpenDataLab(数据生态)
```

---

## 三、InternLM3-8B-Instruct 旗舰技术

### 3.1 核心规格

| 维度 | 数值 / 说明 |
|---|---|
| **参数量** | 8B(基座) |
| **架构** | Decoder-only Transformer + 多阶段训练 |
| **上下文** | 128K(原生),可扩展更长 |
| **训练 token** | **4T(同类模型通常 15T+,节省 75%)** |
| **训练成本** | 业界同尺寸模型 1/4 |
| **运行模式** | **深度思考(Deep Thinking)+ 流畅对话** |
| **开源协议** | Apache 2.0(模型权重免费商用) |
| **部署** | LMDeploy / vLLM / Ollama / Transformers |

### 3.2 关键成绩(2025-01 发布)

| Benchmark | InternLM3-8B-Inst. | Qwen2.5-7B-Inst. | Llama3.1-8B-Inst. | GPT-4o-mini |
|---|---|---|---|---|
| **CMMLU(0-shot)** | **83.1** | 75.8 | 53.9 | 66.0 |
| **MMLU(0-shot)** | **76.6** | 76.8 | 71.8 | 82.7 |
| **MMLU-Pro(0-shot)** | **57.6** | 56.2 | 48.1 | 64.1 |
| **GPQA-Diamond(0-shot)** | **37.4** | 33.3 | 24.2 | 42.9 |
| **MATH-500(0-shot)** | **83.0**(思考) | 72.4 | 48.4 | 74.0 |
| **AIME 2024(0-shot)** | **20.0**(思考) | 16.7 | 6.7 | 13.3 |
| **LiveCodeBench(2407-2409)** | 17.8 | 16.8 | 12.9 | **21.8** |
| **HumanEval(Pass@1)** | 82.3 | **85.4** | 72.0 | 86.6 |
| **RULER(4-128K avg)** | 87.9 | 81.4 | **88.5** | 90.7 |
| **AlpacaEval 2.0(LC)** | **51.1** | 30.3 | 25.0 | 50.7 |
| **MT-Bench-101** | 8.59 | 8.49 | 8.37 | **8.87** |

**核心结论**:**8B 尺寸下,在 10+ 推理与知识密集基准击败 Qwen2.5-7B、Llama3.1-8B**;成本仅 1/4。

### 3.3 深度思考模式

InternLM3 **双模式** 原生支持:

```
                    输入
                     │
        ┌────────────┴────────────┐
        │                         │
   [深度思考模式]              [流畅对话模式]
   Deep Thinking             Standard Chat
        │                         │
   长思维链展开                直接回答
   复杂推理 / 规划             日常对话
   数学/代码/逻辑              低延迟
        │                         │
   8192 token 推理预算          1024 token
```

**深度思考 System Prompt**(类比 o1):

```text
You are an expert mathematician with extensive experience in mathematical competitions.
You approach problems through systematic thinking and rigorous reasoning. When solving
problems, follow these thought processes:
## Deep Understanding
## Multi-angle Analysis
## Systematic Thinking
## Rigorous Proof
## Repeated Verification
Your response should reflect deep mathematical understanding and precise logical thinking.
You have [[8192]] tokens to complete the answer.
```

### 3.4 训练三阶段

```
1. 预训练(Pre-training)
   └─ 4T tokens 高质量数据
      (对比同类 15T+,节省 75%)
2. 中训练(Mid-training)
   └─ 思考模式 SFT
3. 后训练(Post-training)
   └─ DPO / RLHF(对齐人类偏好)
```

---

## 四、InternVL 多模态系列(中国最强开源 VLM)

### 4.1 InternVL 3.5(2025)

**核心创新:级联强化学习 + 视觉分辨率路由器 + 解耦部署**

| 维度 | 数值 / 说明 |
|---|---|
| **最大模型** | 241B-A28B(MoE,激活 28B) |
| **训练方式** | 级联强化学习(Offline RL + Online RL) |
| **核心算法** | GSPO(Group Sequence Policy Optimization) |
| **部署方式** | 视觉编码 / LLM 解耦 |
| **性能提升** | 推理任务 +16%(vs 传统 RL) |
| **视觉加速** | 解耦部署 **4.05×** 推理加速 |
| **视觉优化** | 视觉分辨率路由器提速 **50%** |
| **多语言** | 英 / 中 / 葡 / 阿 / 土 / 俄 |
| **视频理解** | 短视频 / 长视频 / 流视频 / 视频推理 |
| **GUI 能力** | ScreenSpot 89.8,显著优于开源竞品 |

**关键成绩**:
- MMBench:241B-A28B 达 87.4
- MMMU(多学科推理):77.7
- MathVista:82.7
- CMMLU 中文:90.2

### 4.2 InternLM-XComposer-2.5(2024-07)

| 维度 | 数值 |
|---|---|
| **参数量** | 7B LLM 后端 |
| **能力** | 视频理解 / 多图多轮对话 / 4K 分辨率 / 网页生成 / 文章创作 |
| **超长上下文** | 24K 训练,RoPE 外推至 96K |
| **能力定位** | "GPT-4V 级能力,7B 体积" |
| **成绩** | 28 个基准中 16 个开源 SOTA,16 项比肩 GPT-4V / Gemini Pro |

### 4.3 InternLM-XComposer-2.5-Reward(ACL 2025)

- 多模态奖励模型
- 训练代码 / 评估脚本 / 部分训练数据开源
- 解决"奖励作弊"问题

### 4.4 InternLM-XComposer-2.5-OmniLive

- 长时流式视频 + 音频交互
- 全模态实时理解

---

## 五、Intern-Robotics 具身全栈引擎(2025-07-29)

**首个开源具身全栈引擎** —— 破解"标准不统一 / 数据成本高 / 研发周期长"三大行业瓶颈。

### 5.1 三大核心引擎

```
Intern-Robotics 架构
│
├── 仿真引擎
│   ├── Intern·Utopia(原 GRUtopia 2.0)
│   ├── 模块化场景/机器人/指标切换
│   ├── 1 行代码跨本体部署
│   ├── 3 行代码定义具身任务
│   └── 5 分钟上手实操
│
├── 数据引擎
│   ├── Intern·Scenes(10 万级场景资产)
│   ├── Intern·LandMark(神经渲染)
│   ├── Intern·WorldModel(生成式世界模型)
│   ├── Intern·Data 虚实混合数据金字塔
│   └── 单服务器日合成 5 万条,成本 6 个月降 66%
│
└── 训测引擎
    ├── Intern·Nav(导航)
    ├── Intern·Manip(操作)
    ├── Intern·Humanoid(人形)
    ├── Intern·SR(Sim2Real)
    └── 一键启动训练 + 评测
```

### 5.2 三大创新点

1. **一脑多形**:一套模型适配 10+ 种机器人形态(机器狗 / 人形 / 轮式)
2. **虚实贯通**:真机 + 合成混合,数采成本降至 **0.06%**
3. **训测一体**:6 大任务 / 20+ 数据集 / 50+ 模型

### 5.3 Intern·VLA 模型

- 基于 InternVL3 多模态基座
- "感知 - 想象 - 执行"一体化架构
- 导航任务 10 项基准国际领先
- 操作任务 5 项仿真基准 SOTA,真机成功率超业界顶尖 **15%**
- 首次实现"跨楼宇、长距离"听令行走(无额外训练)

---

## 六、API 与生态接入

### 6.1 在线体验与 API

```python
# OpenAI 兼容(InternLM)
from openai import OpenAI

client = OpenAI(
    api_key="your-internlm-key",
    base_url="https://internlm-chat.intern-ai.org.cn/puyu/api/v1"
)

# 深度思考模式
response = client.chat.completions.create(
    model="internlm3-8b-instruct",
    messages=[{"role": "user", "content": "证明勾股定理"}],
    extra_body={"thinking_budget": 8192}
)
```

### 6.2 本地部署(LMDeploy / vLLM / Ollama)

```bash
# vLLM 部署
pip install vllm
vllm serve internlm/internlm3-8b-instruct \
  --tensor-parallel-size 1 \
  --max-model-len 131072

# Ollama 一行启动
ollama pull internlm/internlm3-8b-instruct
ollama run internlm/internlm3-8b-instruct

# LMDeploy(推荐)
pip install lmdeploy
lmdeploy serve api_server internlm/internlm3-8b-instruct \
  --server-port 23333 \
  --model-name internlm3-8b-instruct
```

### 6.3 Transformers 直接加载

```python
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM

model_dir = "internlm/internlm3-8b-instruct"
tokenizer = AutoTokenizer.from_pretrained(model_dir, trust_remote_code=True)
model = AutoModelForCausalLM.from_pretrained(
    model_dir,
    trust_remote_code=True,
    torch_dtype=torch.bfloat16
).cuda().eval()

# 深度思考系统提示
thinking_system_prompt = "You are an expert..."

messages = [
    {"role": "system", "content": thinking_system_prompt},
    {"role": "user", "content": "计算 1+1=? 给出详细推理"}
]

tokenized = tokenizer.apply_chat_template(
    messages, tokenize=True, add_generation_prompt=True, return_tensors="pt"
).to("cuda")
generated = model.generate(tokenized, max_new_tokens=8192)
print(tokenizer.batch_decode(generated[:, tokenized.shape[1]:])[0])
```

---

## 七、关键人物与组织

| 人物 / 团队 | 角色 |
|---|---|
| **林达华** | OpenGVLab 视觉实验室负责人 |
| **王晓刚** | 香港中文大学,多模态奠基 |
| **陈恺** | OpenGVLab 核心 |
| **周伯文** | 上海 AI 实验室负责人(整体) |
| **叶杰平** | 上海 AI 实验室副主任 |
| **InternLM Team** | 主力研发 |
| **OpenGVLab** | 多模态研究 |

---

## 八、技术细节深挖

### 8.1 InternVL 3.5 级联强化学习

```
阶段 1: 离线强化学习(Offline RL)
        ├── 已有大量训练数据
        └── 混合偏好优化
                ↓
阶段 2: 在线强化学习(Online RL)
        ├── 处理全新问题
        ├── GSPO 算法
        └── 实时反馈调整
```

类比:像厨师"先在家反复练刀工(Offline),再去餐厅做菜(Online)"。

### 8.2 视觉分辨率路由器

- 不同图像 → 不同分辨率
- 简单图像用低分辨率(节省计算)
- 复杂图像用高分辨率(保证精度)
- 视觉一致性学习 + 路由器预测
- 效果:**视觉处理耗时减 50%**

### 8.3 解耦视觉-语言部署

- 视觉处理:在 GPU 集群并行
- 语言处理:在序列优化硬件
- 两者通过紧凑特征传递
- 效果:推理速度 **4.05×** 提升,高质量图像场景更显著

---

## 九、与竞品对比

| 维度 | InternLM3-8B | Qwen2.5-7B | Llama3.1-8B | GLM-4-9B |
|---|---|---|---|---|
| **参数量** | 8B | 7B | 8B | 9B |
| **训练 token** | 4T(节省 75%) | ~15T | ~15T | ~10T |
| **开源协议** | Apache 2.0 | Apache 2.0 | Llama License | 商用授权 |
| **深度思考** | ✅ 原生 | ✅(部分) | ❌ | ❌ |
| **CMMLU** | **83.1** | 75.8 | 53.9 | ~75 |
| **MATH-500** | **83.0** | 72.4 | 48.4 | ~70 |
| **AIME 2024** | **20.0** | 16.7 | 6.7 | ~15 |
| **多模态** | InternVL 3.5 SOTA | Qwen2-VL | LLaVA | GLM-4V |

---

## 十、争议与限制

- **学术机构 vs 商业压力**:上海 AI 实验室学术氛围重,商业化进度不如字节/腾讯
- **生态偏小众**:OpenGVLab 体系相对小众,海外采用率低于 Qwen
- **多模态与文本割裂**:InternLM / InternVL / XComposer 命名复杂,新手困惑
- **依赖国产算力**:部分模型对国产芯片适配好,但对 NVIDIA 优化略弱

---

## 十一、相关概念

- [[概念/llm-architectures|LLM 架构]]
- [[概念/multimodal-llm|多模态 LLM]]
- [[概念/long-context-llm|长上下文 LLM]]
- [[概念/Training/pre-training|预训练]]
- [[概念/Agent/agent-architectures|Agent 架构]]
- [[概念/opencompass|OpenCompass 评测]]
- [[概念/lmdeploy|LMDeploy 推理]]
- [[概念/General/embodied-ai|具身智能]]

---

## 十二、See Also(深度专题)

- [InternLM 官方 GitHub](https://github.com/InternLM) — 上海 AI 实验室官方
- [InternLM 论文 arXiv:2403.17297](https://arxiv.org/abs/2403.17297) — 官方技术报告
- [InternLM3 HuggingFace](https://huggingface.co/internlm/internlm3-8b-instruct) — 官方
- [InternVL 3.5 GitHub](https://github.com/OpenGVLab/InternVL) — 官方
- [Intern-Robotics GitHub](https://github.com/InternRobotics) — 官方
- [OpenCompass 司南评测](https://github.com/open-compass) — 官方
- [LMDeploy 推理框架](https://github.com/InternLM/lmdeploy) — 官方
- [MinerU 文档解析](https://github.com/opendatalab/MinerU) — 上海 AI 实验室官方
- [InternLM-XComposer GitHub](https://github.com/internlm/InternLM-XComposer) — 官方

---

## 2026 书生生态速览

| 特性 / 工具 | 说明 | 状态 |
|---|---|---|
| **InternLM3-8B** | 8B 旗舰,4T 训练,深度思考 | GA |
| **InternVL 3.5** | 241B-A28B 多模态,开源 SOTA | GA |
| **InternLM-XComposer-2.5** | 7B 多模态创作,96K 上下文 | GA |
| **InternLM-XComposer-Reward** | 多模态奖励模型,ACL 2025 | GA |
| **InternLM-XComposer-OmniLive** | 流式音视频交互 | GA |
| **Intern-Robotics** | 首个开源具身全栈引擎 | GA |
| **MinerU2.5** | 1.2B 文档解析,OmniDocBench 第一 | GA |
| **OpenCompass** | 评测框架,业界标准 | GA |
| **LMDeploy** | 推理框架,4 行代码部署 | GA |
| **InternEvo** | 训练框架,支持大规模预训练 | GA |
| **CompassRank** | 综合榜单 | GA |

## 生产最佳实践

1. **中小团队首选**:InternLM3-8B 单卡 A100 即可部署,成本极低
2. **深度思考场景**:用 InternLM3 思考模式,数学/逻辑题效果比 Qwen2.5-7B 强
3. **多模态**:InternVL 3.5 是中国最强开源 VLM,首选
4. **网页/文章生成**:XComposer-2.5 7B 即可
5. **具身智能**:Intern-Robotics 是一站式方案
6. **文档解析**:MinerU2.5 RAG 场景必备
7. **企业私有化**:Apache 2.0 协议,合规无虞
8. **训练框架**:InternEvo 大规模预训练,ms-swift 微调
9. **评测**:OpenCompass 业内标准,定期跟踪
10. **长文档**:InternLM2.5-20B 200K 上下文,超长任务
