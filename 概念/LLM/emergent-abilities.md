---
title: LLM 涌现能力(Emergent Abilities)
category: concepts
tags:
  - llm
  - emergent-abilities
  - scaling
  - big-bench
  - cot
  - mirage
aliases:
  - Emergent Abilities of Large Language Models
  - 大模型涌现能力
  - 涌现现象
relationships:
  - target: "概念/chinchilla-scaling-laws"
    type: related_to
  - target: "概念/cot-react-reasoning-prompt"
    type: related_to
  - target: "概念/test-time-compute"
    type: related_to
  - target: "概念/foundation-model"
    type: evolves_from
summary: LLM 涌现能力(Wei et al. 2022)指**小模型不存在、大模型才出现**的不可预测能力,如少样本提示、CoT 推理、指令遵循等,在 BIG-bench 204 个任务上有清晰阈值。但 Schaeffer 2023 NeurIPS Outstanding 论文证明:大量"涌现"是评估指标不连续造成的**海市蜃楼(mirage)**,改用平滑指标后能力平滑增长。涌现是 2022-2023 推动 LLM 军备竞赛的核心叙事,2024-2026 已被"数据质量 + 架构 + 推理算力"三件套替代。
lifecycle: reviewed
tier: core
created: 2026-07-23
updated: 2026-07-23
sources:
  - Wei et al. 2022 arXiv:2206.07682
  - Schaeffer et al. 2023 NeurIPS Outstanding Paper
  - BIG-bench 204 任务
  - Wei et al. 2022 CoT 论文
  - Ouyang et al. 2022 InstructGPT
  - Stanford CRFM
name_zh: "LLM 涌现能力"
---

# LLM 涌现能力(Emergent Abilities)

> 中文简称：LLM 涌现能力

## 一句话总结

**涌现能力**(Emergent Abilities)指**小模型不存在、大模型突然出现**的不可预测能力,典型如少样本提示、CoT 思维链、指令遵循;**Wei et al. 2022** 在 BIG-bench 上首次系统化,但 **Schaeffer 2023 NeurIPS Outstanding** 证明其中大部分是"评估指标造成的海市蜃楼",改用连续指标后能力平滑提升。2026 主流观点:**不存在真正"突然"的能力,只有"不可预测"的能力**。

---

## 1. 形式化定义

> **"An ability is emergent if it is not present in smaller models but is present in larger models."**
> — Wei et al. 2022(引自 Philip Anderson 1972《More is Different》)

| 性质 | 含义 |
|---|---|
| **Sharpness** | 不存在 → 存在,临界转变 |
| **Unpredictability** | 无法从小模型外推预测 |

> 类比:水分子没有"湿"的属性,大量水分子聚在一起突然"湿";神经元没有"智能",860 亿神经元聚在一起"涌现"出意识。

---

## 2. 两类涌现(Wei 2022 分类)

### 2.1 Few-Shot Prompting 涌现(模型规模触发)

BIG-bench 204 个任务中的典型涌现曲线:**临界点前接近随机,过临界点后急剧上升**。

| 任务 | 涌现模型规模 | 训练 FLOPs 阈值 |
|---|---|---|
| **3 位加减 / 2 位乘** | GPT-3 13B / LaMDA 68B | 2×10²² ~ 10²³ |
| **国际音标转写** | GPT-3 13B+ | 2×10²² |
| **乱序字母还原单词** | GPT-3 13B+ | 2×10²² |
| **波斯语 QA** | PaLM 62B | 高质量多语言数据 + 规模 |
| **TruthfulQA** | Gopher 280B | 5×10²³ |
| **MMLU(57 主题)** | 70B-280B | 3-5×10²³ |
| **Word-in-Context(WiC)** | PaLM 540B(540B 才突破!) | 2.5×10²⁴ |

> **MMLU 关键阈值**:**68B~100B 参数**是最常见的涌现门槛(57 主题综合能力)。

### 2.2 Augmented Prompting 涌现(提示策略触发)

| 策略 | 触发规模 | 出处 |
|---|---|---|
| **CoT(思维链)** | ~100B+ 才有正向收益;小模型甚至**负向** | Wei et al. 2022(arXiv:2201.11903) |
| **Instruction Following** | 68B+ 解码器 / 11B 编码器-解码器 | Wei 2022、Sanh T5-11B |
| **Scratchpad(草稿本)** | 8 位数加法:4000 万参数就有效 | Nye et al. 2021 |
| **Model Calibration(P(True))** | 540B 才优于标准方法 | Kadavath et al. 2022 |
| **InstructGPT RLHF** | 1.3B 即可超越 175B GPT-3 的人类评分 | Ouyang et al. 2022 |

---

## 3. Schaeffer 2023 的 Mirage(海市蜃楼)反驳

> **Rylan Schaeffer, Brando Miranda, Sanmi Koyejo.** *Are Emergent Abilities of Large Language Models a Mirage?* **NeurIPS 2023 Outstanding Paper.**

### 3.1 核心论点

大量"涌现曲线"是**评估指标不连续**造成的假象:

| 指标 | 是否连续 | 出现涌现? |
|---|---|---|
| **Exact Match(精确匹配)** | ❌ 离散(0/1) | 看似涌现 |
| **BLEU** | ❌ 离散 | 看似涌现 |
| **Multiple Choice Accuracy** | ❌ 离散 | 看似涌现 |
| **Token-level Cross-Entropy** | ✅ 连续 | **平滑下降,无涌现** |
| **Token Edit Distance** | ✅ 连续 | **平滑下降,无涌现** |

### 3.2 InstructGPT 反例

> **1.3B InstructGPT 已经在 175B GPT-3 失败的很多任务上超过随机**——这直接违反"涌现需 68B+"的论断。

### 3.3 涌现的"真"成分

Schaeffer 承认存在**真正的涌现**,但只占 BIG-bench 一小部分,且多与**多步推理**或**离散输出**任务相关。

---

## 4. 涌现机制(目前部分理解)

| 解释 | 强度 | 出处 |
|---|---|---|
| **多步任务需要 O(L) 层深度** | 中 | Wei 2022 |
| **参数足够记忆世界知识** | 中 | closed-book QA 需 ~540B |
| **指标不连续假象** | 强 | Schaeffer 2023 |
| **数据中"长程依赖 + 稀有类"** | 中 | Chan 2022、Xie 2022 |
| **代码预训练催生 CoT** | 中 | Fu & Khot 2022 |

---

## 5. 涌现 → 推理范式转移(2024-2026)

| 时期 | 主流叙事 | 典型模型 |
|---|---|---|
| **2020-2021** | "越大越强" | GPT-3 175B |
| **2022-2023** | "涌现不可预测" | PaLM 540B、Gopher 280B |
| **2024-2026** | "数据 + 架构 + 推理算力" | LLaMA-3、Qwen-2.5、o1/o3、DeepSeek-R1 |

> **2026 共识**:
> - 涌现 = 不可预测的能力,不是"突然"的能力
> - 真正的涌现 = 复杂多步推理(代码、数学、agent 规划)
> - 训练数据质量(尤其是代码)比单纯扩大参数更有效催生涌现
> - 评估指标必须用**连续 token 级 loss** 而非 exact match

---

## 6. 2026 生态速览

| 视角 | 代表 | 立场 |
|---|---|---|
| **涌现存在(复杂推理派)** | Wei, Tay, Bommasani | 涌现真实,但需复杂任务 |
| **涌现是 mirage(指标派)** | Schaeffer, Miranda, Koyejo | 大部分是评估假象 |
| **可靠性质疑(2024 Nature)** | Zhou et al. Valencia | 大模型更"自信但更不可靠" |
| **数据驱涌现** | Anthropic, Meta | 高质量数据降低涌现门槛 |
| **涌现 = 数据长程结构** | Chan, Xie | 训练数据特性是根因 |

---

## 7. 生产最佳实践

### 7.1 不要迷信"涌现阈值"

| 错误做法 | 正确做法 |
|---|---|
| "模型不到 70B 不用 CoT" | 先小模型试 CoT,看实际表现 |
| "MMLU 不到 60% 是烂模型" | 换连续指标(token loss、BLEU-4)看 |
| "1.3B 一定学不会指令" | InstructGPT 1.3B 已超越 175B |

### 7.2 真正可涌现的能力清单(2026)

| 能力 | 可靠阈值 | 触发条件 |
|---|---|---|
| **简单 CoT(GSM8K)** | ~30B+ | 高质量 CoT 数据 |
| **多步代码调试** | ~70B+ | 代码 SFT |
| **复杂 agent 规划** | ~100B+ | RLHF + 工具使用数据 |
| **跨语言迁移** | ~62B+ | 多语言平衡数据 |
| **长程一致性** | ~200B+ | 长上下文训练数据 |
| **复杂指令遵循** | ~11B+ | 高质量指令微调 |

### 7.3 评估方法

- **必看**:Token-level loss(交叉熵,平滑)
- **慎用**:Exact match、BLEU(易假象)
- **加分项**:Pass@k(多采样)、过程奖励模型(PRM)评分

---

## 8. See Also(官方源)

| 来源 | 链接 |
|---|---|
| **Wei et al. 2022, Emergent Abilities** | https://arxiv.org/abs/2206.07682 |
| **Schaeffer et al. 2023, Mirage(Outstanding)** | https://arxiv.org/abs/2304.15004 |
| **Schaeffer 个人主页(含 US 国会作证)** | https://rylanschaeffer.github.io/content/research/2023_neurips_llm_emergent_abilities_mirage/main.html |
| **BIG-bench 204 任务** | https://github.com/google/BIG-bench |
| **Wei et al. 2022, CoT Prompting** | https://arxiv.org/abs/2201.11903 |
| **Ouyang et al. 2022, InstructGPT/RLHF** | https://arxiv.org/abs/2203.02155 |
| **Zhou et al. 2024, Nature(更大模型更不可靠)** | https://www.nature.com/articles/s41586-024-07930-y |
| **Nye et al. 2021, Scratchpad** | https://arxiv.org/abs/2112.00114 |
| **Stanford CRFM HELM 评测** | https://crfm.stanford.edu/helm/ |
| **关键术语英中对照** | Emergence / Emergent Ability / Mirage / Sharpness transition / Phase transition / In-context learning |

---

## 9. 一句话结论(2026)

**"涌现"是 2022 推动 LLM 军备竞赛的标志性叙事,但 2023 已被 Schaeffer 用 NeurIPS Outstanding 论文证伪了大半——大部分"突然出现"是 exact-match 指标的假象;2024-2026 转向"数据质量 + 架构 + 推理时算力"三件套,真正能涌现的只有复杂多步推理,可靠阈值约 70-100B。**

## 相关链接

- [[概念/LLM/chinchilla-scaling-laws|Chinchilla 缩放定律]] — 涌现能力的驱动因素
- [[概念/LLM/large-language-model|大语言模型]] — 涌现能力的研究对象
- [[概念/LLM/reasoning-models|推理模型]] — 涌现的推理能力
- [[07_模型训练/01_训练基础/03_LLM_训练_深入分析|LLM 训练深度解析]] — 规模与涌现的关系
- [[概念/Safety/ai-alignment|AI 对齐]] — 涌现能力带来的对齐挑战
