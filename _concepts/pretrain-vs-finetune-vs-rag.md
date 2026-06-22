---
title: 预训练 vs 微调 vs RAG — 三种 LLM 定制方案选型
category: -concepts
tags: ["pretraining", "fine-tuning", "rag", "prompt-engineering", "llm-customization", "decision-guide"]
relationships:
  - target: "_concepts/model-training"
    type: builds_on
  - target: "_concepts/fine-tuning-techniques"
    type: compares_with
  - target: "_concepts/rag-systems"
    type: compares_with
  - target: "_concepts/prompt-engineering"
    type: compares_with
  - target: "_concepts/lora-peft"
    type: includes
sources:
  - 05_NLP_LLMs/LLM_Fundamentals.md
  - 14_RAG_Systems/README.md
  - 07_Model_Training/Fine_tuning_Strategies.md
summary: "在已有 LLM 基础上做定制,有四条路:Prompt Engineering → RAG → 微调 → 预训练。选型原则:优先用最便宜的方案解决 80% 的问题,只在该方案搞不定时才升级。本文档给出明确的决策树、对比表、典型场景与选型 checklist。"
provenance:
  extracted: 0.70
  inferred: 0.20
  ambiguous: 0.10
base_confidence: 0.90
lifecycle: stable
tier: core
created: 2026-06-16
updated: 2026-06-16
---

# 预训练 vs 微调 vs RAG — 三种 LLM 定制方案选型

> **一句话理解**:让大模型"按你的需求输出",有 4 个档位的工具,从便宜到贵、从浅到深:Prompt → RAG → 微调 → 预训练。**够用就好,别一上来就最贵**。

---

## 1. 四档位速览

| 档位 | 改的是"什么" | 改不改参数 | 算力成本 | 适合场景 |
|------|------------|-----------|---------|---------|
| **Prompt Engineering** | 提问方式 | ❌ 不改 | $0 | 改改问法就能搞定 |
| **RAG** | 给模型"外挂资料" | ❌ 不改 | $ | 知识频繁更新、要查私有数据 |
| **微调 (Fine-tuning)** | 模型权重 | ✅ 改一部分 | $$ | 风格/格式/特定任务要深度固化 |
| **预训练 (Pre-training)** | 从零学 | ✅ 全改 | $$$$ | 造新底座(一般公司用不到) |

---

## 2. 决策树(实战版)

```
你的需求是啥?
│
├─ Q1: 改改提问方式/给几个例子,模型能答对吗?
│      YES → Prompt Engineering (零成本)
│
├─ Q2: 模型知识不够(不知道最新事件/不知道公司内部文档)?
│      YES → RAG (外挂知识库)
│
├─ Q3: 答得对但"风格/格式/语气"不对?
│      YES → 微调 (LoRA/QLoRA,几百到几千条数据)
│
├─ Q4: 任务高度专业化(法律文书/医疗诊断/特定领域推理)?
│      YES → 领域微调 + RAG 组合
│
└─ Q5: 需要新模型/新架构/新能力(造底座)?
       YES → 预训练 (烧钱,大厂才玩)
```

---

## 3. 三方案深度对比

| 维度 | Prompt | RAG | 微调 |
|------|--------|-----|------|
| **原理** | 换种问法 + few-shot | 检索文档塞进 prompt | 用数据再训练部分参数 |
| **改不改模型** | ❌ | ❌ | ✅ |
| **数据需求** | 0~10 条示例 | 几百~几万文档 | 几千~几万条标注 |
| **训练成本** | $0 | 几小时搭建 | 几小时~几天 |
| **推理成本** | 多 token | 多 token(检索+长 prompt) | 与原模型相当 |
| **知识更新** | 改 prompt 即可 | 更新文档库 | 必须重训 |
| **可解释性** | 中 | 高(知道引用了哪条) | 低(黑盒) |
| **幻觉** | 仍有 | 显著降低(基于文档) | 仍可能 |
| **副作用** | 无 | 无 | 灾难性遗忘、风格漂移 |
| **典型场景** | 角色扮演、翻译润色 | 客服问答、企业知识库 | 风格统一、医学/法律助手 |

---

## 4. 为什么是这个顺序?(选型原则)

### 原则 1:**复杂度匹配需求**
> 80% 的企业 LLM 应用,Prompt + RAG 就够用了。微调不是银弹,反而是麻烦的开始(数据、训练、评估、版本管理、漂移监控……)。

### 原则 2:**保留底座的通用能力**
- 微调容易让模型**灾难性遗忘**——学会了"用法律口吻回答",但写代码能力掉了
- 越深的改动,通用能力损失越大

### 原则 3:**能改 prompt 就别动模型**
- Prompt 错了,改个字就行,0 风险
- 模型改错了,回滚、重新训练,成本高

### 原则 4:**能外挂就别内化**
- 知识经常变(产品手册每月更新)?→ RAG
- 知识稳定但量大?→ 一次性微调进模型
- 知识冷门且私域?→ 优先 RAG(不污染底座)

---

## 5. 典型场景配方

| 场景 | 推荐方案 | 理由 |
|------|---------|------|
| 公司客服机器人(查产品/订单) | **RAG** | 知识更新频繁,要可解释 |
| 代码助手(按公司代码规范) | **微调 (LoRA)** | 风格需深度固化,无变化知识 |
| 法律合同审查 | **领域微调 + RAG** | 行业知识+最新法规 |
| 角色扮演/写作助手 | **Prompt + 微调** | 风格对齐 |
| 翻译(英→中) | **微调** | 风格/术语统一 |
| 行业研究报告生成 | **RAG** | 数据要新、要可溯源 |
| 数学/推理强任务 | **Prompt (CoT/ToT)** | 推理靠 prompt 工程 |
| 多模态(看图说话) | **微调** | 底座能力不够,必须改 |

---

## 6. 微调 vs RAG 的"灵魂拷问"

问自己 3 个问题:

1. **知识是稳态还是动态?**
   - 稳态(医学知识)→ 微调
   - 动态(公司新闻)→ RAG

2. **改的是"知识"还是"行为"?**
   - 知识(事实/数据)→ RAG
   - 行为(语气/格式/推理路径)→ 微调

3. **能不能接受"引用来源"?**
   - 接受 → RAG 天然支持
   - 不能(要像人一样"内化"了)→ 微调

---

## 7. 什么时候才考虑预训练?

| 触发条件 | 例子 |
|---------|------|
| 现有所有模型都不支持你需要的语言/模态 | 小语种、古文 |
| 需要全新的能力(架构层面) | 多模态原生模型 |
| 你的数据量足够大(>1T tokens)且有钱 | 大厂造底座 |
| 想做"基础研究"贡献 | 学术机构 |

**99% 的公司和个人开发者永远不需要预训练。**

---

## 8. 实战 Checklist

在决定"上微调"之前,先过一遍:

- [ ] 是否已经把 Prompt 优化到极致(CoT、few-shot、system prompt)?
- [ ] 是否 RAG 召回率 > 80%、能解决主要问题?
- [ ] 是否准备好 ≥ 1000 条高质量标注数据?
- [ ] 是否有 GPU 资源 + 训练/评估 pipeline?
- [ ] 是否想清楚"如何评估微调后的效果"?
- [ ] 是否有版本管理 + 回滚机制(LoRA 出问题能秒回原模型)?

**如果 6 项里有 3 项以上是 "否",先别微调,把 Prompt 和 RAG 做扎实。**

---

## 9. 一句话总结

> **Prompt 调问法 → RAG 补知识 → 微调改行为 → 预训练换底座**。
> 越往下越贵、越复杂、风险越高。先用最便宜的方案,搞不定再升级。

---

## Related

- [[_concepts/model-training]] — 模型训练基础
- [[_concepts/fine-tuning-techniques]] — 微调技术族
- [[_concepts/lora-peft]] — LoRA 省显存微调
- [[_concepts/rag-systems]] — RAG 检索增强生成
- [[_concepts/prompt-engineering]] — Prompt Engineering
- [[_concepts/long-context-vs-rag]] — 长上下文 vs RAG 选型
- [[05_NLP_LLMs/LLM_Fundamentals]] — LLM 基础
- [[14_RAG_Systems/README]] — RAG 系统
