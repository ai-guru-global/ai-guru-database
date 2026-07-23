---
title: "豆包 / ByteDance Seed 模型系列 (Doubao & ByteDance Seed LLM Family)"
category: concepts
tags:
  - llm
  - doubao
  - bytedance
  - seed
  - seed-thinking
  - moe
  - chinese-llm
  - reasoning
  - multimodal
aliases:
  - Doubao Series
  - 豆包系列
  - Seed LLM
  - Seed-Thinking
  - ByteDance Doubao
relationships:
  - target: "概念/llm-architectures"
    type: related_to
  - target: "概念/moe"
    type: uses
  - target: "概念/reasoning-models"
    type: extends
  - target: "概念/multimodal-llm"
    type: related_to
  - target: "概念/long-context-llm"
    type: related_to
summary: "豆包(Doubao)是字节跳动旗下火山引擎推出的闭源大模型系列,基于 ByteDance Seed 团队研发。Doubao-1.5 Pro 以稀疏 MoE 架构实现 7× 激活参数效率,Seed-Thinking-v1.5 引领强化学习推理路线,Seed1.5-VL 拿下 38 项视觉基准 SOTA。Doubao 在国内 C 端日 Token 调用量稳居第一(2024 末 > 4 万亿/日)。"
lifecycle: reviewed
tier: core
created: 2026-07-23
updated: 2026-07-23
sources: []
---

# 豆包 / ByteDance Seed 模型系列

> **一句话理解**: 字节跳动 Seed 团队 + 火山引擎(Volcano Engine)联合产出的国产闭源大模型主力——以"超高激活参数效率"和"长 CoT 强化学习"两条主线,跻身全球 SOTA 阵营。

---

## 一、公司与团队背景

| 维度 | 信息 |
|---|---|
| **公司** | 字节跳动(ByteDance) |
| **模型团队** | Seed LLM Systems Team(负责人:吴永辉) |
| **发布平台** | 火山引擎(Volcengine)、豆包 App / Web |
| **商业策略** | 极致低定价,2024 末 0.8 元/百万 token 输入、2 元/百万 token 输出,毛利率 50% |
| **生态规模** | 2024 末日 Token 调用量 > 4 万亿(自 2024.05 上市增长 33×) |
| **开源度** | 闭源(API),Seed1.5-VL 技术报告 + 论文公开,Seed-Thinking-v1.5 论文公开 |

---

## 二、模型家族全景

```
ByteDance Seed / 豆包模型家族
│
├── 文本旗舰系列 (Doubao)
│   ├── Doubao-1.5 Pro (Deep Thinking 模式)
│   ├── Doubao-1.5 Lite (轻量)
│   ├── Doubao 1.5 Pro 32K
│   └── Doubao Pro 256K
│
├── 推理系列 (Seed-Thinking)
│   └── Seed-Thinking-v1.5 (200B 总参 / 20B 激活, MoE)
│
├── 多模态系列
│   ├── Seed1.5-VL (视觉深度思考, 20B 激活参数, 38/60 SOTA)
│   ├── Seed-Vision (历史版本)
│   └── Seedance 1.0 Lite (视频生成)
│
├── 音频 / 语音
│   └── 豆包·音乐模型(2025.05 升级)
│
└── 数据 / Agent 平台
    ├── Data Agent(2025.05 发布)
    └── Trae(AI IDE,海外)
```

---

## 三、三大旗舰模型技术解析

### 3.1 Doubao-1.5 Pro(2025-01-22 发布)

**核心创新:稀疏 MoE + 训推一体设计**

| 维度 | 数值 / 说明 |
|---|---|
| **架构** | Decoder-only Transformer + 稀疏 MoE |
| **激活参数** | 20B(以 20B 激活达到稠密 140B 模型效果) |
| **激活效率** | 激活参数比为 1:7(即 20B 激活 ≈ 140B 稠密效果) |
| **上下文** | 原生 32K,扩展至 256K |
| **训练范式** | 训推一体设计(Integrated Train-Inference Design) |
| **异构调度** | Prefill-Decode / Attention-FFN 异构系统优化吞吐 |
| **I/O 定价** | 输入 0.8 元/百万 token,缓存命中 0.16 元,输出 2 元/百万 token |
| **学术认可** | ICLR 2025 收录 |

**关键成绩**:在 AIME 数学基准超越 OpenAI o1 preview,综合性能超过 DeepSeek-V3 / GPT-4o / Llama 3.0-405B。

> ⚠️ **重要解读**: 字节跳动官方称"20M activated parameters ≈ 140B dense performance" 中 "20M" 应为 **20B**(单位笔误),即 200 亿激活参数 ≈ 1400 亿稠密效果。

### 3.2 Seed-Thinking-v1.5(2025-04-11 论文公开)

**核心创新:长 CoT 强化学习推理**

| 维度 | 数值 / 说明 |
|---|---|
| **架构** | Mixture-of-Experts(MoE) |
| **总参 / 激活** | 200B 总参 / 20B 激活 |
| **核心能力** | STEM 推理、Codeforces 编程竞赛、复杂逻辑 |
| **训练范式** | SFT + RL(无人类偏好模型,纯验证器驱动) |
| **SFT 数据** | 30 万可验证问题 + 10 万不可验证问题 |
| **RL 数据** | 10 万可验证 STEM 题 + 不可验证人类偏好题 |

**核心成绩**:

| 基准 | Seed-Thinking-v1.5 | DeepSeek-R1 | o3-mini-high |
|---|---|---|---|
| **AIME 2024** | **86.7%** | 79.8% | ~85% |
| **Codeforces (pass@8)** | **55.0%** | 较低 | 较高 |
| **GPQA** | **77.3%** | 71.5% | 78% |
| **ARC-AGI** | **超 Gemini 2.5 Pro & o3-mini** | 落后 | 基准 |
| **人工偏好 vs R1** | **胜率 +8.0%** | — | — |

**三大技术支柱**:

1. **数据策略**:SFT 30 万可验证 + 10 万不可验证,RL 分可验证 / 不可验证双轨;STEM 数据占 80%+,逻辑数据 22 类(含数独、24 点);引入 **BeyondAIME** 与 **Codeforces 评测集** 内部基准(计划开源)。

2. **RL 算法**:VAPO(Value-Augmented Policy Optimization) + DAPO(Decoupled Clip and Dynamic sAmpling Policy Optimization),专为长 CoT 训练稳定设计;借鉴 Value-Pretraining、Decoupled-GAE、Length-adaptive GAE、Clip-Higher、Token-level Loss、Positive Example LM Loss 等机制。

3. **基础设施**:
   - **HybridFlow 框架** + Ray 集群(单控制器 + SPMD Worker Group)
   - **Streaming Rollout System (SRS)**:动态调整 on-policy / off-policy 比例,加速 RL 循环最高 **3×**
   - **混合引擎**:训练与推理引擎共 GPU,避免切换空闲
   - FP8 混合精度 + 专家并行 + 内核自动调优 + ByteCheckpoint 弹性容错

### 3.3 Seed1.5-VL(2025-05-13 火山引擎 FORCE LINK 发布)

**核心创新:视觉深度思考 + GUI Agent 能力**

| 维度 | 数值 / 说明 |
|---|---|
| **架构** | 三组件:SeedViT(532M) + MLP 适配器 + Seed1.5-LLM(MoE, 20B 激活) |
| **位置编码** | 2D RoPE(动态分辨率) |
| **预训练数据** | 3T+ token 多模态标注(图文/视频/人机交互) |
| **训练范式** | 3 阶段渐进:MLP 对齐 → 全参解冻 → 长序列视频/3D |
| **后训练** | SFT(通用 + 长 CoT)+ RLHF/RLVR 混合 |
| **推理成本** | 输入 0.003 元/千 token,输出 0.009 元/千 token |
| **API 名称** | Doubao-1.5-thinking-vision-pro-250428 |

**关键成绩**:**60 项公开基准中 38 项 SOTA**,视觉定位、视频理解、GUI Agent 第一梯队,综合性能对标 Gemini 2.5 Pro;以 **20B 激活参数**达成行业领先。

**核心能力亮点**:
- 视觉定位 + 推理(货架产品识别、价格计算)
- 细粒度识别(表情相似场景中"生气"猫精准捕捉)
- 找不同、公务员图形推理
- 视频监控理解(多模态智能体)
- GUI Agent(PC / 移动端点击、验证流程)

---

## 四、定价与生态

### 4.1 商业策略:极致性价比

| 模型 | 输入 | 缓存命中 | 输出 |
|---|---|---|---|
| **Doubao-1.5 Pro 32K** | 0.8 元/百万 token | 0.16 元/百万 token | 2 元/百万 token |
| **Doubao-1.5 Lite 32K** | 0.3 元/百万 token | 0.06 元/百万 token | 0.6 元/百万 token |
| **Seed1.5-VL** | 0.003 元/千 token | — | 0.009 元/千 token |

> **市场影响**:豆包 0.8 元定价直接施压阿里 Qwen、智谱 GLM 等友商降价。2024 末日均 Token 调用量超 4 万亿(自 2024.05 增长 33×),覆盖 80% 主流车企、约 3 亿台智能设备。

### 4.2 部署接入

```python
# OpenAI 兼容 API
from openai import OpenAI

client = OpenAI(
    api_key="your-volcengine-key",
    base_url="https://ark.cn-beijing.volces.com/api/v3"
)

# Doubao-1.5 Pro 32K
response = client.chat.completions.create(
    model="doubao-1-5-pro-32k-250115",
    messages=[{"role": "user", "content": "用一句话解释 MoE 架构"}],
    temperature=0.7
)

# Seed-Thinking 推理模式
response = client.chat.completions.create(
    model="doubao-1-5-thinking-pro-250415",
    messages=[{"role": "user", "content": "证明:π 是无理数"}],
    extra_body={"thinking_budget": 10000}
)
```

**平台入口**:
- 火山引擎控制台(企业 API + 模型市场)
- 豆包 App / Web(消费端)
- 扣子(Coze,Agent 构建)

---

## 五、关键人物与组织

| 人物 | 职位 / 角色 |
|---|---|
| **吴永辉** | ByteDance Seed LLM Systems 团队负责人 |
| **林海斌** | Seed 团队核心成员,Seed-Thinking-v1.5 公开展示 |
| **梁如风(Liang Rubo)** | 字节跳动 CEO,2025-02 反思"对 LLM 趋势响应偏慢" |
| **谭待** | 火山引擎总裁,推动低定价策略 |

---

## 六、技术细节深挖

### 6.1 Doubao-1.5 Pro 异构系统设计

```
                  ┌──────────────┐
                  │   请求调度   │
                  └──────┬───────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
   ┌────▼─────┐    ┌─────▼────┐    ┌─────▼────┐
   │ Prefill  │    │ Prefill  │    │  Decode  │  ← 异构 GPU 池
   │  Attn    │    │   FFN    │    │  阶段    │
   └────┬─────┘    └────┬─────┘    └─────┬────┘
        └────────────────┼────────────────┘
                         │
                  ┌──────▼───────┐
                  │  Token 输出  │
                  └──────────────┘
```

- Prefill 阶段对 Attention 算力敏感,FFN 阶段对显存带宽敏感
- Decode 阶段是长尾瓶颈,需要单独调度
- 异构系统按阶段分配不同 GPU 类型,提升 30%+ 吞吐

### 6.2 Seed-Thinking-v1.5 VAPO 算法

VAPO 借鉴 PPO 的 Actor-Critic 框架,核心改进:

- **Value Pretraining**:用策略 π_sft 蒙特卡洛回报初始化 Value Model,避免初始偏差
- **Decoupled GAE**:λ_value=1.0(无偏)+ λ_policy=0.95(降方差)
- **Length-adaptive GAE**:λ_policy = 1 - 1/(α·l),长序列 TD 误差均匀化
- **Clip-Higher**:解耦 ε_low 与 ε_high,鼓励探索
- **Token-level Loss**:避免"短回复主导"的不平衡

### 6.3 Seed1.5-VL 训练三阶段

```
阶段 1: MLP 对齐(冻结 ViT + LLM,只训 MLP)
        ↓
阶段 2: 全参解冻(图文 grounding / OCR / 知识大规模混合)
        ↓
阶段 3: 长序列多模态(视频/3D/编程,序列长度↑)
        ↓
后训练: SFT(通用 + 长 CoT 拒绝采样) + RL(RLHF/RLVR 混合)
```

---

## 七、与竞品对比

| 维度 | Doubao-1.5 Pro | DeepSeek-V3 | Qwen3-235B | GPT-4o | Claude-3.5 |
|---|---|---|---|---|---|
| **架构** | 稀疏 MoE | MoE 256 专家 | MoE | 闭源 MoE | 闭源 |
| **激活参数** | 20B | 37B | 22B | 未知 | 未知 |
| **上下文** | 32K-256K | 128K | 128K | 128K | 200K |
| **闭源** | ✅ | ❌ | ❌ | ✅ | ✅ |
| **API 价格 (in/out)** | 0.8/2 元 | 极低 | 极低 | $2.5/$10 | $3/$15 |
| **推理模型** | Seed-Thinking-v1.5 | R1 | QwQ / Qwen3-Thinking | o1/o3 | Claude 3.7 Thinking |
| **AIME 2024** | 86.7% | 79.8% | ~80% | 83% | ~75% |

---

## 八、争议与限制

- **闭源策略**:核心权重不开放,与 DeepSeek/Qwen 开源路线不同
- **API 稳定性**:火山引擎偶发限流与配额调整
- **超长上下文衰减**:256K 实际效果需 NIAH/RULER 验证
- **国际化受限**:受地缘政治影响,TikTok 关联品牌出海风险
- **Deep Thinking 模式**:部分场景 token 消耗 3-10×,需配 thinking_budget

---

## 九、相关概念

- [[概念/llm-architectures|LLM 架构]]
- [[概念/moe|MoE 混合专家]]
- [[概念/reasoning-models|推理模型]]
- [[概念/multimodal-llm|多模态 LLM]]
- [[概念/long-context-llm|长上下文 LLM]]
- [[概念/speculative-decoding|投机解码]]
- [[概念/llm-pretraining|预训练]]
- [[概念/reward-model|奖励模型]]

---

## 十、See Also(深度专题)

- [Doubao 1.5 Pro 火山引擎产品页](https://www.volcengine.com/product/doubao)
- [Seed1.5-VL 技术报告 PDF](https://github.com/ByteDance-Seed/Seed1.5-VL/blob/main/Seed1.5-VL-Technical-Report.pdf) — 字节官方
- [Seed1.5-VL 论文 arXiv:2505.07062](https://arxiv.org/abs/2505.07062) — 字节官方
- [Seed-Thinking-v1.5 GitHub](https://github.com/ByteDance-Seed/Seed-Thinking-v1.5) — 字节官方
- [Doubao-1.5 Pro ICLR 2025 论文](https://arxiv.org/abs/2501.12343) — ByteDance 官方
- [字节 Seed 实验室官网](https://seed.bytedance.com/) — 字节官方
- [火山引擎·大模型服务](https://www.volcengine.com/product/doubao) — 字节官方

---

## 2026 豆包生态速览

| 特性 / 工具 | 说明 | 状态 |
|---|---|---|
| **Doubao-1.5 Pro** | 稀疏 MoE,7× 激活效率,32K-256K | GA |
| **Seed-Thinking-v1.5** | 200B MoE 推理,AIME 86.7%,ICLR 2025 | GA |
| **Seed1.5-VL** | 视觉深度思考,38/60 SOTA,GUI Agent | GA |
| **豆包 App** | 消费端,C 端日活稳居国产第一 | GA |
| **扣子(Coze)** | Agent / Workflow 平台,海外版本 Coze.com | GA |
| **Trae** | AI IDE,字节对标 Cursor | Beta |
| **Data Agent** | 2025.05 发布,数据科学全流程 | Beta |

## 生产最佳实践

1. **极致低延迟场景**:Doubao-1.5 Lite(0.6 元/百万输出)降本 50%
2. **复杂推理 + 工具调用**:Seed-Thinking-v1.5 / Doubao-1.5-thinking-pro,设置 `thinking_budget`
3. **多模态 GUI Agent**:Seed1.5-VL(`doubao-1-5-thinking-vision-pro`)
4. **企业集成**:通过火山引擎 MaaS 控制台,支持 VPC 私有化、国产化适配
5. **限流应对**:QPS 超限配指数退避 + 多 key 轮询
6. **国际化**:海外版使用 Volcengine 国际站,绕开地缘限制
7. **国内合规**:对接内容安全审核、火山引擎敏感词库
8. **A/B 测试**:Doubao 1.5 Pro vs Lite 成本/质量权衡,Lite 满足 80% 场景
