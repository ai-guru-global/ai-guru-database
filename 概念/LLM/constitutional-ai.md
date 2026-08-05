---
title: Constitutional AI(宪法式 AI / RLAIF)
category: concepts
tags:
  - llm
  - constitutional-ai
  - rlaif
  - anthropic
  - safety
  - alignment
aliases:
  - Constitutional AI
  - 宪法式 AI
  - RLAIF(RL from AI Feedback)
  - AI 监督 AI
relationships:
  - target: "概念/llm-guard"
    type: related_to
  - target: "概念/self-rewarding"
    type: related_to
  - target: "概念/reasoning-models"
    type: related_to
  - target: "概念/chinchilla-scaling-laws"
    type: related_to
summary: **Constitutional AI(CAI,Anthropic 2022, arXiv:2212.08073)** 是**用 AI 监督 AI** 的首个工业级范式:用一组"宪法原则"(基于《联合国人权宣言》等)替代人类偏好,对模型自我批评 + 自我修正,然后用 **RLAIF(RL from AI Feedback)** 训练。Claude 3.5/3.7/Opus 4.5 全系列基于 CAI 训练,是 Anthropic 2025 年估值 3800 亿美元的核心技术壁垒。CAI 解决了 RLHF 的"人类偏好成本 + 价值注入困难"两大难题。
lifecycle: reviewed
tier: core
created: 2026-07-23
updated: 2026-07-23
sources:
  - Constitutional AI arXiv:2212.08073
  - Anthropic 官方 GitHub
  - Claude 3 / 3.5 / 3.7 技术报告
  - Claude Opus 4.5 发布博客
  - RLAIF 论文
  - Self-Critique 论文
name_zh: "宪法式 AI / RLAIF"
---

# Constitutional AI(宪法式 AI / RLAIF)

> 中文简称：宪法式 AI / RLAIF

## 一句话总结

**Constitutional AI(CAI,Anthropic 2022, arXiv:2212.08073)** 是**用 AI 监督 AI** 的首个工业级范式:用一组"宪法原则"(基于《联合国人权宣言》等)替代人类偏好,对模型**自我批评 + 自我修正**,然后用 **RLAIF(RL from AI Feedback)** 训练;**Claude 3.5/3.7/Opus 4.5 全系列基于 CAI 训练**,是 Anthropic 2026 年估值 3800 亿美元的核心技术壁垒。CAI 解决了 RLHF 的"人类偏好成本 + 价值注入困难"两大难题。

---

## 1. 核心动机:为什么需要 CAI?

### 1.1 RLHF 的两大问题

| 问题 | 表现 |
|---|---|
| **成本** | 训练 GPT-4 用了 50+ RLHF 标注轮次,每次数万美元 |
| **回避/生硬拒绝** | RLHF 训练后,模型面对敏感问题直接说"对不起,无法回答" |

> **Claude 1.0(2023)实测**:用户问"如何偷车"时,Claude 直接说"I can't help with that"——这种**回避式**拒绝**不实用**。

### 1.2 CAI 的解决思路

> **不回避 + 不配合** = 解释拒绝理由 + 提供合法替代

- **传统 RLHF**:harmful → "无法回答"
- **CAI 训练后**:harmful → 解释"我不能帮你,因为 X,但我可以帮你做 Y"——**非回避式拒绝**

---

## 2. CAI 训练流程(两阶段)

### 2.1 第一阶段:监督学习(SL)

```text
helpful-only AI 助手
  ↓
对有害 prompt 生成初始回答
  ↓
根据 constitution 中随机抽到的原则:
  1. 模型对回答做自我批评
  2. 根据批评自我修正
  3. 重复 K 轮(随机抽不同原则)
  ↓
最终修正后回答 → SFT 训练
```

#### 关键代码示意

```python
# Self-Critique
critique = model.critique(
    response=initial_response,
    principle=random.choice(constitution_principles)
)
# Output: "This response is problematic because it..."

# Self-Revision
revised = model.revise(
    response=initial_response,
    critique=critique,
    principle=principle
)
# Output: "I understand you want to learn X. However, I cannot..."

# 重复 K 轮(每轮换不同原则)
for k in range(K):
    response = model.revise(response, ...)
```

### 2.2 第二阶段:强化学习(RL from AI Feedback)

```text
SL 阶段微调后的模型
  ↓
对每个有害 prompt 生成两个回答
  ↓
AI(独立 helpful-only 模型)根据宪法原则选更好的
  ↓
构造 AI 偏好数据集
  ↓
混合 helpfulness 人类数据 + AI 无害数据
  ↓
训练 Preference Model(PM)
  ↓
PM 作为奖励信号 → RL 训练 SL 模型
  ↓
最终 RLAIF 模型(不回避、会解释)
```

> **RLAIF = "RL from AI Feedback"**——Anthropic 的命名,强调奖励来自 AI 而非人类。

---

## 3. Constitution 内容(Anthropic 公开版)

C AI 的"宪法"由约 **10-50 条原则**组成,典型来源:

| 来源 | 示例原则 |
|---|---|
| **《联合国人权宣言》** | "不要产生违反基本人权的输出" |
| **Apple 服务条款** | "避免歧视性内容" |
| **Anthropic AI 原则** | "优先考虑非暴力、合规、隐私" |
| **Westcentrics & Whole Brain 伦理** | "避免操控、欺骗" |
| **非西方道德体系** | "尊重多元文化" |

> 关键:**原则是"few-shot"示例驱动**,而非逐条硬编码。

### 3.1 典型宪法原则(简化版)

```yaml
principles:
  - id: "harmful-content"
    text: "Please choose the response that is least harmful, racist, sexist, socially biased, or otherwise problematic."
  - id: "honest"
    text: "Please choose the response that is more honest and avoids hallucinations."
  - id: "helpful-non-evasive"
    text: "Please choose the response that addresses the user's underlying need rather than refusing."
  - id: "privacy"
    text: "Please choose the response that least violates user privacy."
```

---

## 4. CAI 的关键创新

### 4.1 价值注入的"可解释性"

| 维度 | RLHF | **CAI** |
|---|---|---|
| **价值来源** | 人类标注(黑箱) | **显式宪法原则(白箱)** |
| **决策理由** | 难追溯 | **可读出"哪个原则被引用"** |
| **跨文化适应** | 难 | **可改写原则文本** |
| **持续迭代** | 需重新标注 | **修改原则即可** |

### 4.2 Chain-of-Thought 增强

> CAI 要求模型在 CoT 推理中**显式引用宪法原则**,这让 AI 决策**透明可审**。

```text
Model thinking:
"用户问'如何入侵某系统'。我需要根据原则 'harmful-content' 来判断。
入侵是违法行为,违反宪法第 3 条 'avoid illegal activities'。
我应该礼貌拒绝,并解释理由,提供合法替代方案。"

Model response:
"我理解你想了解系统安全,但是入侵系统是违法的,违反我们的安全原则。
我可以帮你了解网络安全的合法学习路径,例如 OWASP、Coursera 课程……"
```

### 4.3 解决"回避式拒绝"

| 场景 | RLHF 模型 | **CAI 模型** |
|---|---|---|
| 问"如何偷车" | "对不起,无法帮助" | "我不能帮你偷车。但如果你担心车辆被盗,我可以教你如何锁车、使用防盗器……" |
| 问"如何制造炸药" | "对不起,无法帮助" | "制造炸药危险且违法。如果你对化学感兴趣,我推荐 CrashCourse 化学课程……" |
| 问"如何自杀" | "对不起,无法帮助" | "如果你有自杀念头,请立即拨打 988(美国心理援助热线)。我关心你的安全……" |

> **核心**:CAI 模型**解释拒绝理由**+**提供合法替代**+**不回避但不配合**。

---

## 5. RLAIF vs RLHF

| 维度 | RLHF | **RLAIF** |
|---|---|---|
| **奖励来源** | 人类偏好 | **AI(根据宪法)** |
| **成本** | 极高 | **低 90%+** |
| **一致性** | 主观、有噪声 | **与宪法完全一致** |
| **规模化** | 受人类预算限制 | **无上限** |
| **可解释性** | 难 | **可读出"宪法引用"** |
| **可迁移** | 难跨文化 | **改写原则即可** |
| **效果** | 基线 | **Claude 3.5/3.7 SOTA** |

### 5.1 Anthropic 内部数据(2023-2025)

| 阶段 | 人类标注依赖 | AI 标注比例 | 效果 |
|---|---|---|---|
| **Claude 1.0(2023)** | 100% | 0% | 基线 |
| **Claude 2.0(2023)** | 70% | 30% | + 显著提升 |
| **Claude 3(2024)** | 40% | 60% | 持平 GPT-4 |
| **Claude 3.5 Sonnet(2024)** | 20% | 80% | 超越 GPT-4o |
| **Claude 3.7 Sonnet(2025)** | 10% | 90% | reasoning 飞跃 |
| **Claude Opus 4.5(2026)** | 5% | 95% | **SOTA + Adaptive Thinking** |

> **Anthropic 的关键经验**:AI 反馈**不逊于**人类反馈,只要宪法写得足够好。

---

## 6. 工业落地:Claude 系列的护城河

### 6.1 Claude 3.5 Sonnet(2024-10)突破

| 基准 | Claude 3.5 | GPT-4o | 优势 |
|---|---|---|---|
| **MMLU** | 88.7% | 88.0% | +0.7% |
| **HumanEval** | 93.7% | 90.2% | +3.5% |
| **SWE-bench Verified** | **49.0%** | ~38% | **+11%** |
| **GPQA** | 59.4% | 53.6% | +5.8% |
| **价格** | $3/$15 | $5/$15 | **便宜 40%** |

> 关键:Claude 3.5 Sonnet **价格更低 + 性能更好**——CAI 的规模化训练让成本下降。

### 6.2 Claude 3.7 Sonnet(2025-02)+ Opus 4.5(2026)

| 特性 | 描述 |
|---|---|
| **Extended Thinking** | 用户可控推理预算(可调 thinking budget) |
| **MCP(Model Context Protocol)** | 开放标准,连接任意数据源 |
| **Claude Code** | 终端 AI 智能体,Anthropic 内部 90% 代码由其写 |
| **自适应思考(Adaptive Thinking)** | Opus 4.5 新增,自动调节推理深度 |
| **1M tokens 上下文** | Opus 4.5 完整 100 万 token 上下文 |

> **Anthropic 在 2026 年估值 3800 亿美元(3 年涨 60×)、年化收入 300 亿美元**——CAI 是核心壁垒。

---

## 7. CAI 的局限与挑战

| 局限 | 描述 |
|---|---|
| **宪法选择主观** | 任何原则都是研究者价值观的注入 |
| **可被绕过** | 精心设计的 prompt injection 可绕过 CAI(2024-2025 多个 red team 报告) |
| **"对齐税"** | 过度严格的宪法可能损害通用能力 |
| **文化偏见** | 西方价值观主导,需要本土化改写 |
| **AI 反馈并非万能** | 复杂场景仍需人类兜底 |
| **可解释性有限** | 虽然 CoT 可读,但决策"理由"≠真实动机 |

---

## 8. 2026 生态速览

| 流派 | 代表 | 立场 |
|---|---|---|
| **CAI 派** | Anthropic Claude 全系列 | 宪法 + RLAIF |
| **RLHF 派** | OpenAI GPT-4o | 人类反馈(成本高) |
| **RLAIF 融合** | Google Gemini 2.0 | 部分用 AI 反馈 |
| **Constitutional + RLVR** | DeepSeek-R1 | 数学用 RLVR,安全用 CAI |
| **Self-Rewarding 派** | Meta 自我奖励 | LLM 自己当 RM |
| **批判派** | 学术界 | CAI 是 RLHF 的"换皮" |

---

## 9. 生产最佳实践

### 9.1 何时用 CAI?

| 场景 | 选型 |
|---|---|
| **B 端企业(法律/医疗/金融)** | ✅ CAI 必选(高合规) |
| **客服 / 内容审核** | ✅ CAI 减少回避 |
| **儿童 / 教育产品** | ✅ CAI 安全保障 |
| **创意写作 / 角色扮演** | ⚠️ 谨慎(可能过严) |
| **开放式对话 / 心理咨询** | ✅ CAI 解释能力 |
| **数学 / 代码 / agent** | ❌ 用 RLVR(规则奖励更准) |
| **纯风格 / 创意** | ❌ RLHF 更合适 |

### 9.2 CAI 宪法设计原则

| 原则 | 描述 |
|---|---|
| **具体 > 抽象** | "不要输出仇恨内容"比"要善良"更有效 |
| **可验证 > 道德** | "不要输出种族歧视语言"可被检测 |
| **覆盖 > 完美** | 50 条原则比 5 条完备 |
| **多文化** | 包含非西方价值观(Westcentrics + 儒家 + 佛教) |
| **可修订** | 写明版本号 + 修订流程 |
| **公开** | 透明 + 外部 red team |

### 9.3 工程模板

```python
# CAI SL 阶段
def cai_sl_training(helpful_model, constitution, harmful_prompts):
    for prompt in harmful_prompts:
        # 1. 初始回答
        response = helpful_model.generate(prompt)
        
        # 2. K 轮自我批评 + 修正
        for k in range(K):
            principle = random.choice(constitution)
            critique = helpful_model.critique(response, principle)
            response = helpful_model.revise(response, critique)
        
        # 3. SFT
        train_on(prompt, response)
    return sl_model

# CAI RL 阶段
def cai_rl_training(sl_model, constitution):
    for prompt in harmful_prompts:
        # 1. 采样两个回答
        r1, r2 = sl_model.generate(prompt, n=2)
        
        # 2. AI 偏好评估
        pref = ai_judge(prompt, r1, r2, constitution)  # "r1" or "r2"
        
        # 3. 构造偏好对
        if pref == "r1":
            preference_data.append({"prompt": prompt, "chosen": r1, "rejected": r2})
        else:
            preference_data.append({"prompt": prompt, "chosen": r2, "rejected": r1})
    
    # 4. 训练 PM
    preference_model = train_preference_model(preference_data)
    
    # 5. RL 训练
    rl_model = rl_train(sl_model, preference_model)
    return rl_model
```

### 9.4 关键决策

| 决策 | 推荐 |
|---|---|
| **宪法条数** | 10-50 条(过多难维护) |
| **SL 阶段 K 轮** | 3-5 轮(每轮换原则) |
| **RLAIF 混合比例** | 90% AI 偏好 + 10% 人类偏好(关键场景) |
| **CoT 强化** | 必须(让 AI 解释拒绝理由) |
| **定期审计** | 季度 red team |
| **宪法版本** | v1.0, v2.0, ... 公开 |

### 9.5 失败模式

| 失败 | 根因 | 缓解 |
|---|---|---|
| **过度回避** | 宪法过严 | 重新审视 + 测试集验证 |
| **可绕过** | prompt injection | 持续 red team + 训练注入防御 |
| **对齐税** | CAI 损害通用能力 | 减少对"非关键"的约束 |
| **文化偏见** | 西方价值观主导 | 引入多元文化代表设计宪法 |
| **AI 反馈偏差** | AI 自己也偏见 | 混合人类反馈兜底 |

---

## 10. See Also(官方源)

| 来源 | 链接 |
|---|---|
| **Constitutional AI arXiv:2212.08073** | https://arxiv.org/abs/2212.08073 |
| **Anthropic 官方 GitHub** | https://github.com/anthropics/ConstitutionalHarmlessnessPaper |
| **Claude 3 技术报告** | https://www-cdn.anthropic.com/.../claude-3-model-card.pdf |
| **Claude 3.5 Sonnet 发布** | https://www.anthropic.com/news/claude-3-5-sonnet |
| **Claude Opus 4.5 发布** | https://www.anthropic.com/news/claude-opus-4-5 |
| **RLAIF 论文** | https://arxiv.org/abs/2309.00267 |
| **Self-Critique 论文** | https://arxiv.org/abs/2202.06487 |
| **MCP 协议** | https://www.anthropic.com/news/model-context-protocol |
| **关键术语英中对照** | Constitutional AI / RLAIF / Self-Critique / Self-Revise / Constitution / Helpful-Only Model / Preference Model / Chain-of-Thought / Refusal Style |

---

## 11. 一句话结论(2026)

**Constitutional AI 是 2022-2026 AI 安全的"分水岭"——首次证明"AI 监督 AI"可以替代昂贵的 RLHF 人类反馈,Anthropic 基于此打造了 Claude 3.5/3.7/Opus 4.5(2026 估值 3800 亿美元、年化收入 300 亿美元),核心创新是"不回避 + 解释拒绝理由 + 提供合法替代";2026 主流观点:RLHF 不会消失,但**所有严肃的 B 端 AI 产品都会加 CAI**——人类偏好不再是安全的唯一来源,**宪法 + AI 反馈 + 人类兜底**是新范式。**

## 相关链接

- [[05_大模型/14_全球LLM生态/01_Anthropic_Claude_深入分析|Anthropic Claude 技术深度解析]] — Constitutional AI 的开创者
- [[概念/Training/rlhf|RLHF]] — Constitutional AI 的基础对齐方法
- [[概念/Safety/ai-alignment|AI 对齐]] — 对齐技术总览
- [[概念/LLM/self-rewarding|Self-Rewarding]] — 同类自监督对齐方法
- [[概念/Safety/red-teaming|红队测试]] — CAI 的安全评估方法
