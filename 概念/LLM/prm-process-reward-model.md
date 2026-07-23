---
title: "过程奖励模型 PRM (Process Reward Model) — 让大模型学会"每一步都正确""
category: concepts
tags:
  - llm
  - prm
  - process-reward-model
  - rlhf
  - reasoning
  - math
  - o1
  - step-level
  - verifier
  - reward-model
aliases:
  - PRM
  - Process Reward Model
  - 过程奖励模型
  - Process Supervision
  - Step-Level Reward
  - PRM800K
  - Math-Shepherd
relationships:
  - target: "概念/rlhf"
    type: extends
  - target: "概念/test-time-compute"
    type: extends
  - target: "概念/grpo"
    type: related_to
  - target: "概念/dpo"
    type: related_to
  - target: "概念/reasoning-models"
    type: related_to
summary: "过程奖励模型(PRM)是 OpenAI 2023 年提出的"逐步奖励"范式——相比只对最终答案打分的 ORM(Outcome Reward Model),PRM 对每个推理步骤分别打分,可显著提升数学/代码推理任务的训练效率与 Best-of-N 推理性能。o1、DeepSeek R1、Claude 推理模式、Qwen QwQ 等"思考型模型"都深度依赖 PRM 思路。"
lifecycle: reviewed
tier: core
created: 2026-07-23
updated: 2026-07-23
sources: []
---

# 过程奖励模型 PRM(Process Reward Model)

> **一句话理解**:PRM 是"训练一个会盯着每一步推理打分的老师"——传统的 ORM(结果奖励)只能告诉你"答案对不对",PRM 能告诉你"在第 3 步你错了",是 o1 / DeepSeek R1 / QwQ 等"长思考模型"在数学、代码、规划任务上突破 SOTA 的关键基础设施。

---

## 一、问题起源

### 1.1 传统 RLHF 的瓶颈

- 标准 RLHF(RLHF from Human Feedback)用**结果奖励模型(ORM)**:只对最终答案打分(+1 / -1)。
- 在**长链推理**任务(数学证明、多步规划、复杂代码)上,ORM 信号稀疏:
  - 正确路径走 50 步得 +1,错误路径走 3 步也得 -1,**错误信号无法定位"是哪一步错的"**。
  - 模型学不到"中间步骤该怎么走",只能盲目试错。

### 1.2 关键洞察:过程比结果更有信号

- 2023 年 OpenAI 团队 Lightman 等人提出:**用 step-level 监督替代 outcome-level 监督**。
- 核心论文:**"Let's Verify Step by Step"**(Lightman et al., 2023-05)
  - arXiv:[arxiv.org/abs/2305.20050](https://arxiv.org/abs/2305.20050)
  - 数据集:**PRM800K**(800K 步骤级标注,75K 解答)
  - 结果:在 MATH 数据集上,ORM Best-of-N 57.2% → PRM Best-of-N **78.2%**(显著提升)
  - 同等标注成本下,PRM 比 ORM 表现更好。

### 1.3 与"o1"的连接

- 2024-09 OpenAI 发布 **o1-preview**:用大规模 RL + PRM 训练,长 CoT(Chain-of-Thought)推理,AIME 83% / GPQA 78%。
- 业界共识:**o1 之所以强,核心不是"会写 CoT",而是"PRM 让每一步 CoT 都被监督与优化"**。
- 后续 DeepSeek R1、Claude 3.7 扩展思考、QwQ、ERNIE X1、Kimi k1.5、Yi Reasoning 等都采用 PRM-like 训练。

---

## 二、关键术语中英对照

| 中文 | 英文 | 说明 |
|---|---|---|
| 过程奖励模型 | Process Reward Model(PRM) | 对每个推理步骤分别打分的奖励模型 |
| 结果奖励模型 | Outcome Reward Model(ORM) | 只对最终答案打分的奖励模型 |
| 过程监督 | Process Supervision | 训练时对每一步进行监督 |
| 结果监督 | Outcome Supervision | 训练时只对最终答案监督 |
| 步骤级标注 | Step-Level Annotation | 标注者对每一步正确性打标签 |
| 最佳 N 选 1 | Best-of-N(BON) | 采样 N 个候选,用奖励模型选最佳 |
| 多数投票 | Majority Voting | N 个候选投票,选最多次的答案 |
| 蒙特卡洛估计 | Monte Carlo Estimation | 用未来 rollout 结果估计当前步骤价值 |
| 强化学习 | Reinforcement Learning(RL) | 用奖励信号优化策略 |
| 近端策略优化 | Proximal Policy Optimization(PPO) | RLHF 经典算法 |
| 组相对策略优化 | Group Relative Policy Optimization(GRPO) | DeepSeek 改进的 RL 算法 |
| 过程奖励强化学习 | Process Reward RL(PRL) | 用 PRM 作为 reward 的 RL |
| 自洽性 | Self-Consistency | 多次采样取最一致答案 |
| 思维链 | Chain-of-Thought(CoT) | 让模型显式写出中间推理步骤 |
| 长思维链 | Long Chain-of-Thought(Long CoT) | 数千甚至上万 token 的 CoT |

---

## 三、PRM 技术原理

### 3.1 数据标注

- **人工标注**:标注者(MTurk)对解答的每一步打 **正确 / 错误** 标签。
- **数据集 PRM800K**:
  - 来自 MATH 数据集的 12K 问题
  - 75K 解答(平均 6.3 步/解答)
  - 800K 步骤级标签
  - OpenAI 2023 年开源(只开源了部分,完整版需申请)

### 3.2 模型训练

- 输入:问题 + 当前步骤 + 历史步骤
- 输出:**该步骤正确的概率**(0~1)
- 训练数据:每步的人工标注(正确/错误)
- 损失函数:二分类交叉熵

### 3.3 推理时使用

- **Best-of-N 推理**:
  1. 用策略模型采样 N 个解答
  2. 用 PRM 对每步打分
  3. 选择"累积 PRM 分数最高"的解答
- **加权投票(Weighted Voting)**:
  - 用 PRM 分数作为权重,对最终答案加权投票
- **树搜索(Beam Search / MCTS)**:
  - 在推理时用 PRM 引导搜索,每步选 PRM 分数最高的 Top-K 路径

### 3.4 与 ORM 对比

| 维度 | ORM(Outcome Reward Model) | PRM(Process Reward Model) |
|---|---|---|
| **监督粒度** | 最终答案 | 每一步 |
| **信号密度** | 稀疏(每解答 1 个) | 密集(每解答 ~6 个) |
| **错误定位** | 无法定位 | 可定位到具体步骤 |
| **Best-of-N 效果** | 一般 | 显著更好 |
| **数据成本** | 低(只标答案) | 高(标每步) |
| **幻觉问题** | 易出现"答案对、过程错" | 难出现,过程被监督 |
| **代表工作** | InstructGPT、Llama 2 Chat | OpenAI o1、DeepSeek R1 |

---

## 四、PRM 训练方法演进

### 4.1 人工标注 PRM(OpenAI 2023)

- "Let's Verify Step by Step" 原始方案
- 优点:精度高;缺点:成本极高($10+ per problem)

### 4.2 自动 PRM(Math-Shepherd 等,2024)

- 用 **Monte Carlo Rollout** 自动估计步骤价值:
  1. 从当前步骤出发,继续采样 K 条完整解答
  2. 当前步骤价值 ≈ K 条解答中正确比例
- 论文:**Math-Shepherd**(2024, arXiv:2312.08935)
- 优点:无需人工;缺点:rollout 成本高,信号噪声大
- 代表工作:Math-Shepherd、OmegaPRM、PRM-DPO

### 4.3 PRM + DPO / GRPO(2024-2025)

- **PRM-DPO**:把 PRM 分数转化为 preference pair,直接用 DPO 训练(无需 RL)。
- **GRPO + PRM**:DeepSeek R1 用 GRPO + 规则化奖励(答案对错 + 格式合规),隐式 PRM。
- 优点:训练稳定,易复现;缺点:对 PRM 质量依赖大。

### 4.4 隐式 PRM(Implicit PRM,2024-2025)

- 不显式训练 PRM,而是**让模型自己评估自己**。
- DeepSeek R1-Zero:纯 RL,无 SFT,模型自然涌现"自我验证"能力。
- 论文:"Self-Rewarding Language Models"(2024-10,Meta)

### 4.5 RLVR(Reinforcement Learning with Verifiable Rewards,2025)

- 用**可验证奖励**替代 PRM:数学答案可程序验证(用 sympy),代码可用单元测试。
- 论文:Nemotron-Crossroads(2025, NVIDIA)
- 优点:零标注成本;缺点:只适用于答案可验证的领域(数学/代码/物理)

---

## 五、PRM 在主流模型中的应用

| 模型 | 时间 | PRM 方案 | 效果 |
|---|---|---|---|
| **OpenAI o1-preview** | 2024-09 | 大规模 RL + 隐式 PRM | AIME 83%,GPQA 78% |
| **OpenAI o3 / o3-mini** | 2024-12 | 升级 PRM + RL | AIME 96.7%,GPQA 87.7% |
| **DeepSeek R1** | 2025-01 | GRPO + 规则化奖励 | MATH 97.3%(开源) |
| **Kimi k1.5** | 2025-01 | PRM + 长 CoT RL | AIME 77.5% |
| **Claude 3.7 Sonnet (Extended Thinking)** | 2025-02 | 隐式 PRM | SWE-bench 63.7% |
| **QwQ-32B Preview** | 2025-03 | PRM + GRPO | AIME 79.5% |
| **ERNIE X1** | 2025-03 | PRM + RL | CMATH SOTA |
| **Gemini 2.5 Pro** | 2025-03 | 隐式 PRM + RL | AIME 86.7% |
| **Llama 4 Behemoth** | 2025-04 | 大规模 PRM | GPQA 92% |

---

## 六、PRM 评测基准

| 基准 | 说明 | 关键 PRM 表现 |
|---|---|---|
| **MATH** | 12K 高中竞赛数学 | OpenAI o1 系列 > 95% |
| **AIME 2024** | 30 题美国数学邀请赛 | o3 96.7%,Gemini 2.5 86.7% |
| **GPQA Diamond** | 198 题研究生级科学 | o3 87.7% |
| **ARC-AGI** | 抽象推理 | o3 87.5% |
| **FrontierMath** | 2024 新基准,极难 | o3 25.2% |
| **SWE-bench Verified** | 软件工程 Agent | Claude 3.7 63.7% |
| **Codeforces** | 编程竞赛 | o1-preview 1891 评分 |

---

## 七、关键能力与生态

### 7.1 工具库与训练框架

- **OpenRLHF**:开源 RLHF / PPO 框架,支持 PRM 训练。
- **trl**(Hugging Face):支持 PPO、DPO、GRPO + PRM。
- **DeepSpeed-Chat**:微软开源 RLHF 框架。
- **LLaMA-Factory**:支持 DPO、KTO、PRM-like 训练。
- **verifiers**(OpenAI 开源,2024-12):RLHF 验证器集合,含 PRM 数据集。

### 7.2 PRM 数据集

- **PRM800K**(OpenAI):80 万步骤级标注,75K 解答。
- **Math-Shepherd 训练集**:用 MC 估计自动标注的 40 万步骤。
- **R1-Distill 数据**:DeepSeek R1 生成的 80 万高质量 CoT。
- **NuminaMath-CoT**:CoT 步骤级数据,适合 PRM 训练。

### 7.3 PRM 评测工具

- **math-verify**:用 sympy 验证数学答案。
- **OpenAI PRM Eval**:PRM 评测脚本。
- **ProcessBench**(Qwen,2025-02):专门评测 PRM 性能。

### 7.4 PRM 与 RLHF/DPO 的关系

- **RLHF**:结果奖励 + PPO(经典路径)
- **DPO**:直接偏好优化(无 RL,无 reward model)
- **PRM + RL**:过程奖励 + PPO/GRPO(o1 路径)
- **PRM-DPO**:过程奖励 + DPO(无 RL,但有 PRM 偏好对)

---

## 八、2026 生态速览

| 维度 | 2026 状态 |
|---|---|
| **标配化** | "思考型模型"已成为头部闭源与开源旗舰标配,o1/o3/Claude/Gemini/R1/QwQ 全部采用 |
| **训练成本** | PRM 训练数据(80 万 ~ 500 万 steps)已是头部模型"军备竞赛"门槛 |
| **可验证奖励(RLVR)** | 2025-2026 趋势:数学/代码领域用 RLVR 替代人工 PRM,成本降至 0 |
| **隐式 PRM** | 行业共识:模型规模足够大后,PRM 可由模型自身提供(self-verification) |
| **国际竞赛** | AIME 2024/2025、IMO 2024/2025 已成"模型 vs 模型"标准舞台 |
| **学术与开源** | OpenRLHF、trl、verifiers 等开源框架已能复现 80% 主流 PRM 能力 |

---

## 九、生产最佳实践

1. **数学/代码推理必上 PRM**:Best-of-16 推理在 MATH 提升 20+ 分,延迟增加仅 16 倍采样。
2. **训练数据用 Math-Shepherd 自动标注**:零人工成本,精度 90%+,可与人工 PRM 媲美。
3. **树搜索推理(MCTS + PRM)**:在数学/规划任务,推理时用 MCTS 引导,效果优于纯 Best-of-N。
4. **PRM + GRPO 训练**:替代 PPO,显存减半,训练稳定,DeepSeek R1 验证可行。
5. **代码任务用 RLVR**:答案可用单元测试验证,无需 PRM,训练零标注成本。
6. **评测用 ProcessBench**:Qwen 2025-02 发布的 PRM 专项评测,业内标准。
7. **多模型集成**:对同一问题,采样不同模型的 CoT,PRM 投票,可突破单一模型天花板。
8. **避免 PRM 过度依赖**:在开放对话/创意写作任务,PRM 可能限制多样性,需用 ORM + temperature 调节。

---

## 十、See Also(官方源)

### 核心论文

- "Let's Verify Step by Step"(OpenAI 2023)[arxiv.org/abs/2305.20050](https://arxiv.org/abs/2305.20050)
- Math-Shepherd [arxiv.org/abs/2312.08935](https://arxiv.org/abs/2312.08935)
- Implicit PRM for Step-Level Reasoning [arxiv.org/abs/2405.02364](https://arxiv.org/abs/2405.02364)
- Self-Rewarding Language Models [arxiv.org/abs/2401.10020](https://arxiv.org/abs/2401.10020)
- GRPO(DeepSeek)[arxiv.org/abs/2402.03300](https://arxiv.org/abs/2402.03300)

### 模型发布

- OpenAI o1 发布博客 [openai.com/index/learning-to-reason](https://openai.com/index/learning-to-reason-with-llms/)
- DeepSeek R1 论文 [arxiv.org/abs/2501.12948](https://arxiv.org/abs/2501.12948)
- QwQ-32B Preview [qwenlm.github.io/blog/qwq-32b-preview](https://qwenlm.github.io/blog/qwq-32b-preview/)

### 工具与数据集

- PRM800K [github.com/openai/prm800k](https://github.com/openai/prm800k)
- OpenRLHF [github.com/OpenRLHF/OpenRLHF](https://github.com/OpenRLHF/OpenRLHF)
- Hugging Face trl [github.com/huggingface/trl](https://github.com/huggingface/trl)
- Qwen ProcessBench [qwenlm.github.io/blog/processbench](https://qwenlm.github.io/blog/processbench)
- math-verify [github.com/huggingface/math-verify](https://github.com/huggingface/math-verify)

---

## 十一、相关概念卡

- [[概念/rlhf|Rlhf]]
- [[概念/dpo|Dpo]]
- [[概念/grpo|Grpo]]
- [[概念/test-time-compute|Test Time Compute]]
- [[概念/rlvr|Rlvr]]
- [[概念/reasoning-models|Reasoning Models]]
- [[概念/chain-of-thought|Chain Of Thought]]
- [[概念/llm-as-judge|Llm As Judge]]
- [[概念/self-rewarding|Self Rewarding]]
