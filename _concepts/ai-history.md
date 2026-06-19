---
title: AI历史
category: concepts
tags: [ai, 历史, 时间线, 图灵, 深度学习, ChatGPT]
aliases: [AI发展史, AI History, 人工智能历史]
relationships:
  - target: "[[_concepts/ai-fundamentals]]"
    type: related_to
  - target: "_concepts/ai-technology-landscape"
    type: related_to
  - target: "_concepts/ai-ethics"
    type: related_to
  - target: "_concepts/ai-future-trends"
    type: related_to
sources: [00_AI_Introduction/AI_History_Timeline.md]
summary: 人工智能75年历史呈现"希望-失望-突破"的循环周期，从1950年图灵测试到2026年Agentic AI，经历两次寒冬后进入最持久的深度学习夏天。
provenance:
  extracted: 0.80
  inferred: 0.15
  ambiguous: 0.05
base_confidence: 0.75
lifecycle: draft
lifecycle_changed: 2026-05-31
tier: core
created: 2026-05-31T00:00:00Z
updated: 2026-05-31T00:00:00Z
---

# AI历史

人工智能的75年历史是一部"希望-失望-突破"的循环史诗——从1950年图灵测试到2026年的Agentic AI，每一次"寒冬"后都迎来了更强大的技术复苏。AI发展可分为四个时代：奠基时代（1950-1980）、渐进时代（1980-2012）、深度学习革命（2012-2022）、智能体时代（2022-2026）。

## 核心要点

- 1956年达特茅斯会议标志着"人工智能"作为独立学科正式诞生
- AI经历过两次寒冬（1974-1980、1987-1993），均因过度承诺和技术局限导致资金削减
- 2012年AlexNet点燃深度学习革命，2017年transformer-architecture架构统一NLP/CV
- 2022年ChatGPT成为史上增长最快的消费者应用（2个月破1亿用户）
- 算法、数据、算力三大要素的协同发展才产生真正突破
- 2024年Hinton、Bengio、Hassabis同获诺贝尔物理学奖，标志AI获得最高学术认可 ^[inferred]
- 当前处于最持久的"AI夏天"，但周期性规律值得警惕

## 详细内容

### 四大时代总览

```
1950-1980 奠基时代: 理论诞生 → 早期乐观 → 第一次寒冬
1980-1993 专家系统时代: 专家系统繁荣 → Lisp机器崩溃 → 第二次寒冬
1993-2012 渐进时代: 统计机器学习崛起 → Deep Blue → ImageNet
2012-2022 深度学习革命: AlexNet → Transformer → ChatGPT
2022-2026 智能体时代: 大语言模型普及 → Agentic AI崛起
```

### 奠基时代（1950-1980）

**关键里程碑**：

| 年份 | 事件 | 意义 |
|------|------|------|
| 1950 | 图灵发表《Computing Machinery and Intelligence》 | 提出图灵测试，定义机器智能标准 |
| 1951 | Arthur Samuel跳棋程序 | 机器学习雏形 |
| 1956 | **达特茅斯会议** | "人工智能"术语正式诞生 |

达特茅斯会议由McCarthy、Minsky、Rochester、Shannon发起，核心信念是"人类学习的所有方面都可以被精确描述，机器可以模拟任何智能特征"。会议持续6周，奠定了AI作为独立学科的基础。

**第一次AI寒冬（1974-1980）**：计算能力不足、早期承诺过于乐观、感知机局限性被证明（Minsky & Papert 1969），导致AI研究资金大幅削减，神经网络研究几乎停止，符号AI成为主流。

### 专家系统时代（1980-1993）

专家系统 = 知识库（领域专家的IF-THEN规则）+ 推理引擎。XCON系统每年为DEC节省数千万美元，日本第五代计算机项目引发大规模AI投资。

但专家系统存在知识获取瓶颈、缺乏学习能力、维护成本高等根本局限。1987年Lisp机器市场崩溃，**第二次AI寒冬（1987-1993）**到来。"AI"一词被回避，研究者改用"机器学习"。

1986年反向传播算法被重新发现，为后来的神经网络复苏埋下种子。

### 渐进发展时代（1993-2012）

**关键里程碑**：

| 年份 | 事件 | 意义 |
|------|------|------|
| 1997 | **IBM Deep Blue击败卡斯帕罗夫** | AI首次在国际象棋击败世界冠军 |
| 1998 | LeNet-5 | 第一个成功的卷积神经网络 |
| 2006 | Netflix Prize | ML竞赛推动算法发展 |
| 2009 | ImageNet发布 | 大规模视觉识别基准 |

Deep Blue使用480个VLSI芯片每秒评估2亿个局面，证明了专用AI可超越人类专家，但方法特殊难以推广。此时期统计方法取代符号AI成为主流。

### 深度学习革命（2012-2022）

**关键里程碑**：

| 年份 | 事件 | 意义 |
|------|------|------|
| 2012 | **AlexNet赢得ImageNet** | 错误率26.2%→15.3%，深度学习革命开始 |
| 2014 | GAN（生成对抗网络） | 生成式AI重要突破 |
| 2016 | **AlphaGo击败李世石** | AI在围棋战胜人类 |
| 2017 | **Transformer架构** | "long-context-models Is All You Need"统一架构 |
| 2018 | GPT-1/BERT | 预训练+微调范式确立 |
| 2020 | GPT-3 (175B) | 涌现能力展示 |
| 2022 | **ChatGPT** | AI进入主流应用 |

**AlexNet突破原因**：大规模数据（ImageNet 120万图像）+ 强大算力（2个GTX 580 GPU）+ 深度网络（8层CNN）+ ReLU/optimization-regularization。影响：CNN成为视觉标准、GPU成为AI标配。

**AlphaGo技术创新**：深度神经网络 + 蒙特卡洛树搜索 + 策略网络（选择下一步）+ 价值网络（评估胜率）+ 自我对弈强化学习。

**Transformer**：自注意力机制，完全基于注意力无需RNN/CNN，并行计算训练更快，长距离依赖建模能力强。成为GPT、BERT等所有现代模型的基础架构。

**模型规模增长**（约100倍/2年）：

```
BERT (2018, 340M) → GPT-2 (2019, 1.5B) → GPT-3 (2020, 175B)
→ GPT-4 (2023, ~1.7T) → Llama 3.1 (2024, 405B)
训练成本: GPT-2 ~$4万 → GPT-3 ~$500万 → GPT-4 ~$1-2亿
```

### 智能体时代（2022-2026）

**生成式AI爆发**：

ChatGPT（2022.11.30）5天100万用户、2个月1亿用户，史上增长最快的消费者应用。对比：TikTok 9个月、Instagram 2.5年、iPhone 6年到1亿用户。

**Agentic AI崛起（2025-2026）**：

| 时间 | 事件 |
|------|------|
| 2025.Q1 | GPT-5发布，推理能力飞跃，ai-agents原生支持 |
| 2025.Q2 | Claude 4.0/multimodal-models 2.0，多模态原生 |
| 2025.Q3 | MCP/A2A/ACP成为Agent通信行业标准 |
| 2025.Q4 | 人形机器人商业化（Optimus进工厂） |
| 2026.Q1 | GPT-5.2，推理模型主流化 |
| 2026.Q2 | Claude 4.5，200K上下文 |
| 2026 | EU AI Act正式全面生效 |

2026年AI特征：LLM成为数字基础设施、Agentic AI自主执行任务主流化、推理模型爆发、世界模型成资本热点、具身智能商业化元年。详见未来趋势。

### 发展周期性规律

AI发展呈现"技术突破→过度乐观→泡沫破裂→技术成熟"的周期。经历三个周期：

```
周期1 (1956-1980): 夏天(早期乐观) → 冬天(感知机局限)
周期2 (1980-1993): 夏天(专家系统) → 冬天(系统局限)
周期3 (2012-至今): 夏天(深度学习) — 最持久的夏天
```

**成功的三要素**：算法（符号→统计→深度→Transformer）、数据（手工标注→ImageNet→互联网→对齐数据）、算力（MFLOPS→GFLOPS→TFLOPS→PFLOPS→EFLOPS）。三者协同才产生突破。参见AI基础。

### 关键人物

| 人物 | 贡献 |
|------|------|
| **Alan Turing** | 图灵测试，理论奠基，被誉为"AI之父" |
| **John McCarthy** | 创造"AI"术语，达特茅斯会议发起人 |
| **Geoffrey Hinton** | 反向传播，深度学习先驱，2024诺贝尔物理学奖 |
| **Yann LeCun** | CNN卷积神经网络，Meta首席科学家 |
| **Yoshua Bengio** | 深度学习理论，2024诺贝尔物理学奖 |
| **Demis Hassabis** | AlphaGo/DeepMind，2024诺贝尔物理学奖 |
| **Sam Altman** | OpenAI CEO，ChatGPT推动者 |
| **Andrew Ng** | Coursera，AI教育民主化 |

## 开放问题

- 当前"AI夏天"是否也会迎来第三次寒冬？ ^[ambiguous]
- 规模法则（Scaling Law）能否持续支撑AI进步？ ^[inferred]
- AGI是否真的会在2035-2040年间实现？ ^[ambiguous]
- 中国AI发展在算力受限条件下能否保持竞争力？ ^[inferred]
- 欧盟AI Act的"布鲁塞尔效应"对全球AI发展的影响程度？ ^[inferred]

## 来源

- _references/00_AI_Introduction/AI_History_Timeline

## Related

- [[_concepts/ai-fundamentals]] — AI基础概念 (共享: ai, 深度学习)
- [[_concepts/ai-technology-landscape]] — AI技术全景 (共享: ai, 深度学习)
