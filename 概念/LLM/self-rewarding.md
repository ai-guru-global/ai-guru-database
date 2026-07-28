---
title: Self-Rewarding 自奖励语言模型
category: concepts
tags:
  - llm
  - self-rewarding
  - llm-as-a-judge
  - iterative-dpo
  - meta-ai
  - self-improvement
aliases:
  - Self-Rewarding Language Models
  - 自奖励语言模型
  - LLM-as-a-Judge
  - Iterative DPO
relationships:
  - target: "概念/llm-as-judge"
    type: related_to
  - target: "概念/test-time-compute"
    type: related_to
  - target: "概念/chinchilla-scaling-laws"
    type: related_to
  - target: "概念/reasoning-models"
    type: related_to
summary: **Self-Rewarding Language Models**(Meta+NYU, arXiv:2401.10020)让 LLM **同时充当 actor 和 judge**,通过 **Iterative DPO** 在 3 轮迭代内让 Llama 2 70B 在 AlpacaEval 2.0 超越 Claude 2 / Gemini Pro / GPT-4 0613;**核心创新**:奖励模型不冻结,会随 LLM 同步进化,打破传统 RLHF "人类偏好瓶颈";"自奖励"开启了 2025 后 LaTRO、Meta-Rewarding、SRLM 等自我改进范式的大门。
lifecycle: reviewed
tier: core
created: 2026-07-23
updated: 2026-07-23
sources:
  - Self-Rewarding arXiv:2401.10020
  - LLM-as-a-Judge 综述 arXiv:2411.05585
  - LaTRO arXiv:2411.04282
  - Meta-Rewarding 论文
  - OpenReview Self-Rewarding
name_zh: "Self-Rewarding 自奖励语言模型"
---

# Self-Rewarding 自奖励语言模型

> 中文简称：Self-Rewarding 自奖励语言模型

## 一句话总结

**Self-Rewarding Language Models**(Meta + NYU, arXiv:2401.10020)让 LLM **同时充当 actor 和 judge**,通过 **Iterative DPO** 在 3 轮迭代内让 Llama 2 70B 在 AlpacaEval 2.0 **超越 Claude 2 / Gemini Pro / GPT-4 0613**;**核心创新**:奖励模型不冻结,会随 LLM 同步进化,打破了传统 RLHF "人类偏好瓶颈";为 2025 后的 LaTRO、Meta-Rewarding、SRLM 等"自我改进"范式奠定了基础。

---

## 1. 核心动机:为什么需要 Self-Rewarding?

### 1.1 RLHF/DPO 的两大瓶颈

| 瓶颈 | 表现 |
|---|---|
| **人类偏好瓶颈** | 人类水平决定奖励上限,要造超人模型需要超人反馈 |
| **冻结奖励模型** | RM 训练后冻结,无法在 LLM 训练中持续学习 |

> **核心洞察**:"为了实现超人智能体,未来的模型需要**超人类的反馈**。"

### 1.2 Self-Rewarding 的回答

让 LLM **同时具备两种能力**:
1. **指令遵循**:生成高质量回答
2. **自指令创建**:为自己生成新的训练数据并评分

→ 形成**良性循环**:更好的 LLM → 更好的评分 → 更好的训练数据 → 更好的 LLM

---

## 2. Self-Rewarding 框架

### 2.1 两阶段初始化

```text
阶段 1:IFT(Instruction Fine-Tuning)
  输入:Open Assistant 人类编写示例(等级 0)
  输出:具备基础指令遵循能力的 SFT 模型

阶段 2:EFT(Evaluation Fine-Tuning)
  输入:同一批数据 + 0-5 评分 prompt
  输出:具备 LLM-as-a-Judge 基础能力的模型
```

### 2.2 Self-Instruction Creation(自指令创建)

**每轮迭代中,LLM 自己做三件事**:

| 步骤 | 任务 | 工具 |
|---|---|---|
| 1. **生成新 prompt** | few-shot prompting | LLM |
| 2. **生成 N 个候选回答** | 拒绝采样 | LLM |
| 3. **评分(LLM-as-a-Judge)** | 0-5 分数 | LLM 自身 |

```python
# LLM-as-a-Judge prompt 模板
prompt = f"""
You are an expert evaluator. Rate the following response on a scale of 0-5.

Question: {question}
Response: {response}

Evaluation criteria:
- Helpfulness (1-2 points)
- Relevance (1-2 points)
- Accuracy (1-2 points)

Provide:
- Score: 0/1/2/3/4/5
- Rationale: <short>
"""
score = llm_judge(prompt)  # 0-5
```

### 2.3 Instruction Following Training(指令训练)

**两种训练变体**:

| 变体 | 描述 | 效果 |
|---|---|---|
| **偏好对 SFT** | 选评分最高 vs 最低 → 偏好对 → **DPO** | **更好(论文用)** |
| **SFT-only** | 只用 5 分回答继续 SFT | 略差 |

→ **DPO(Iterative DPO)是核心**:同时利用正负反馈信号。

### 2.4 整体迭代循环

```text
M0(Llama 2 70B + IFT + EFT)
  ↓
自指令创建 → AIFT data
  ↓
DPO 训练 M1
  ↓
M1 自指令创建 → 更高质量 AIFT
  ↓
DPO 训练 M2
  ↓
M2 自指令创建 → 更高质量 AIFT
  ↓
DPO 训练 M3(Final)
```

---

## 3. 核心实验结果

### 3.1 指令遵循能力(AlpacaEval 2.0)

| 模型 | AlpacaEval 2.0 LC Win Rate |
|---|---|
| M0(SFT Baseline) | 基线 |
| M1(第 1 轮) | +9.94% vs GPT-4-Turbo |
| M2(第 2 轮) | +15.38% vs GPT-4-Turbo |
| **M3(第 3 轮)** | **+20.44% vs GPT-4-Turbo** |
| Claude 2 | 较低 |
| Gemini Pro | 较低 |
| **GPT-4 0613** | **被超越** |

> **3 轮迭代,RLHF-free,纯自奖励 — 超越 GPT-4**。这是 self-improvement 范式的首个里程碑。

### 3.2 奖励建模能力

| 指标 | M0 | M1 | M2 | M3 |
|---|---|---|---|---|
| **与人类偏好的 pair accuracy** | 65.1% | 72.3% | 78.7% | **81.7%** |
| **Spearman 相关** | 0.61 | 0.69 | 0.74 | **0.77** |
| **Kendall's τ** | 0.55 | 0.62 | 0.68 | **0.72** |

> **奖励模型能力同步进化**——这才是"自奖励"最关键的特性。

### 3.3 长度增长现象

每轮迭代后,模型生成长度**持续增加**:

| 模型 | 平均长度 |
|---|---|
| M0 | 800 tokens |
| M1 | 1100 tokens |
| M2 | 1400 tokens |
| M3 | 1700 tokens |

> **警告**:这种长度增长可能"假性提升"评估分数,因为 AlpacaEval 偏好长回答;需用人类评估验证。

---

## 4. 关键贡献与对比

### 4.1 Self-Rewarding vs RLHF vs DPO

| 维度 | RLHF | DPO | **Self-Rewarding** |
|---|---|---|---|
| **奖励来源** | 人类偏好 | 人类偏好 | **LLM 自身** |
| **奖励模型** | 训练后冻结 | 不需要 | **不冻结,持续进化** |
| **是否需 RM** | ✅ | ❌ | **LLM 充当 RM** |
| **数据生成** | 人类标注 | 人类标注 | **LLM 自动生成** |
| **数据规模天花板** | 人类预算 | 人类预算 | **无限** |
| **质量上限** | 人类水平 | 人类水平 | **可超越人类** |
| **成本** | 极高 | 中 | **低** |
| **效果** | 已验证 | 与 RLHF 相当 | **AlpacaEval 2.0 超越 GPT-4** |

### 4.2 Self-Rewarding vs Constitutional AI(CAI)

| 维度 | CAI(Anthropic) | **Self-Rewarding** |
|---|---|---|
| **AI 反馈者** | **独立 AI 模型**(专门训练的 helpful-only) | **同一个 LLM** |
| **反馈原理** | 宪法原则 | **LLM-as-a-Judge(学到的)** |
| **目标** | 无害 + 有用 | **指令遵循 + 奖励建模** |
| **训练范式** | SL + RL from AI Feedback | **Iterative DPO** |
| **数据** | 外部 prompt | **LLM 自己生成 prompt** |
| **闭环** | 半闭环 | **全闭环** |

---

## 5. Self-Rewarding 的局限

| 局限 | 描述 |
|---|---|
| **质量饱和** | 3-5 轮后边际收益接近 0 |
| **长度偏差** | 模型会变长,可能"刷分" |
| **自偏好偏差** | LLM 偏好自己的输出(egocentric bias) |
| **安全评估缺失** | 论文未做 red team |
| **奖励黑客风险** | 如果 LLM 学会"打高分≠真质量"会失效 |
| **可解释性** | 黑箱,难以审计 |

---

## 6. 后续演进(2024-2026)

### 6.1 LaTRO(2024-11,arXiv:2411.04282)

> **Latent Reasoning Optimization**:把推理视为**潜在分布采样**,用变分方法联合优化推理过程和评价能力,无需外部反馈。

| 模型 | GSM8K zero-shot 提升 |
|---|---|
| Phi-3.5-mini | +12.5% |
| Mistral-7B | +11.2% |
| Llama-3.1-8B | +13.8% |

### 6.2 Meta-Rewarding(2024)

> 在 Self-Rewarding 基础上引入**元法官**评估判断质量,迭代"奖励奖励"。

### 6.3 SRLM(Self-Rewarding LM 2025+)

> 2025 后"自奖励"思路融入主流 reasoning LLM,例如:
> - 模型自我评估 + DPO
> - Self-Consistency + Self-Refine
> - Constitutional + Self-Rewarding 混合

### 6.4 工业界应用

| 团队 | 应用 |
|---|---|
| **Anthropic** | Claude Constitutional AI + 部分 self-rewarding |
| **OpenAI** | o1 内部用 LLM-as-a-Judge 做 RLHF 评估 |
| **DeepSeek** | R1 评估阶段大量使用 self-rewarding 思想 |
| **阿里 Qwen3** | 内部"思考模式"评分借鉴 |

---

## 7. 2026 生态速览

| 流派 | 代表 | 立场 |
|---|---|---|
| **纯 Self-Rewarding** | Meta arXiv:2401.10020 | 单一 LLM 当 RM |
| **变分自奖励** | LaTRO | 潜在空间优化 |
| **元奖励** | Meta-Rewarding | 评估评估者 |
| **多智能体互评** | Constitutional AI、Self-Taught Evaluator | 多 LLM 互相评分 |
| **RLAIF 融合** | Claude 3.5 / GPT-4o 后训练 | AI 反馈 + 部分人类反馈 |
| **批评派** | 学术界部分研究 | 自奖励容易"自欺欺人" |

---

## 8. 生产最佳实践

### 8.1 何时选 Self-Rewarding?

| 场景 | 选型 |
|---|---|
| **离线批处理 / 文档处理** | ✅ 适合 |
| **生成质量评估** | ✅ 强 |
| **通用对话产品** | ⚠️ 谨慎(可能刷分) |
| **安全敏感场景** | ❌ 必须加人类审核 |
| **长输出任务** | ✅ 适合(避免长度偏差叠加) |
| **多任务复杂场景** | ✅ 适合(泛化能力强) |
| **资源受限(无 RM 训练算力)** | ✅ 首选(零 RM 训练) |

### 8.2 工程模板

```python
# Self-Rewarding 训练循环
def self_rewarding_iteration(M_t, prompts_seed):
    # 1. 自指令创建
    new_prompts = generate_prompts(M_t, n=1000)
    responses = [sample_responses(M_t, p, n=4) for p in new_prompts]
    
    # 2. LLM-as-a-Judge 评分
    scores = []
    for p, rs in zip(new_prompts, responses):
        s = [llm_judge(M_t, p, r) for r in rs]  # 0-5
        scores.append(s)
    
    # 3. 构建偏好对
    preference_pairs = []
    for p, rs, ss in zip(new_prompts, responses, scores):
        best_idx = argmax(ss)
        worst_idx = argmin(ss)
        preference_pairs.append({
            "prompt": p,
            "chosen": rs[best_idx],
            "rejected": rs[worst_idx]
        })
    
    # 4. DPO 训练
    M_t1 = dpo_train(M_t, preference_pairs)
    return M_t1

# 迭代 3-5 轮
M0 = sft_base_model
for t in range(3):
    M_t1 = self_rewarding_iteration(M_t, seed_prompts)
    M_t = M_t1
```

### 8.3 关键设计

| 决策 | 推荐 |
|---|---|
| **基础模型** | 已 SFT 的(70B+ Llama 2) |
| **每轮新 prompt** | 1000-5000 条 |
| **每 prompt 回答数** | 4-8 |
| **评估模型** | 自身 LLM |
| **训练算法** | DPO(优于 SFT-only) |
| **迭代次数** | 3-5(>5 收益饱和) |
| **种子 prompt** | 高质量、覆盖广 |

### 8.4 缓解偏差

| 偏差 | 缓解 |
|---|---|
| **长度偏差** | 长度归一化评分 + RLHF 兜底 |
| **自偏好** | 多模型集成 + 人类评估 10% 抽样 |
| **奖励黑客** | 训练中定期 GPT-4 抽检 |
| **质量饱和** | 5 轮后停训 |

### 8.5 与 RLVR 协同(Self-Rewarding 2026 升级版)

```text
基础模型
  ↓
SFT(高质量 IFT)
  ↓
EFT(LLM-as-a-Judge SFT) ← 关键
  ↓
Self-Rewarding 3 轮迭代(指令遵循 + 推理)
  ↓
RLVR / GRPO(数学/代码/agent 任务)
  ↓
最终模型
```

---

## 9. See Also(官方源)

| 来源 | 链接 |
|---|---|
| **Self-Rewarding arXiv:2401.10020** | https://arxiv.org/abs/2401.10020 |
| **GitHub 实现(lucidrains)** | https://github.com/lucidrains/self-rewarding-lm-pytorch |
| **LaTRO arXiv:2411.04282** | https://arxiv.org/abs/2411.04282 |
| **LLM-as-a-Judge 综述** | https://arxiv.org/abs/2411.05585 |
| **Meta-Rewarding 论文** | https://openreview.net/forum?id=... |
| **Constitutional AI arXiv:2212.08073** | https://arxiv.org/abs/2212.08073 |
| **Self-Taught Evaluator** | https://arxiv.org/abs/2408.02666 |
| **关键术语英中对照** | Self-Rewarding / LLM-as-a-Judge / Iterative DPO / IFT / EFT / AIFT / Self-Improvement / Self-Preference Bias / Egocentric Bias |

---

## 10. 一句话结论(2026)

**Self-Rewarding 打开了"LLM 自我进化"的大门——3 轮迭代让 Llama 2 70B 超越 GPT-4,证明了"奖励模型可与 LLM 同步进化"而非冻结;2025 后所有顶级 reasoning LLM(R1、o1、Claude 3.5)都内化了"自我评估 + 自我改进"思想,Self-Rewarding 已成为 LLM 后训练的"必读论文"——**人类偏好不再是天花板,LLM 自己的判断也能成为 SOTA 推手**。**

## 相关链接

- [[概念/LLM/constitutional-ai|Constitutional AI]] — 同类自监督对齐方法
- [[概念/Training/rlhf|RLHF]] — Self-Rewarding 的基础方法
- [[概念/Training/reward-modeling|奖励建模]] — 自奖励的奖励来源
- [[概念/LLM/llm-as-judge|LLM as Judge]] — 自奖励的核心机制
- [[概念/Safety/ai-alignment|AI 对齐]] — 对齐技术总览
