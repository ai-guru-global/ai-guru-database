---
title: "LLM 数据工程深度解读: 从预训练数据到合成数据"
category: "04-nlp-llms"
tags: ["llm", "data-engineering", "pretraining-data", "sft-data", "synthetic-data", "data-quality", "data-mixture"]
summary: "LLM 训练中最被低估但最影响质量的环节。覆盖万亿token预训练数据清洗、SFT数据质量工程、RLHF偏好数据构建、合成数据飞轮。"
created: 2026-06-04
updated: 2026-06-04
---

# LLM 数据工程深度解读: 从预训练数据到合成数据

> **一句话理解**: 数据是 LLM 的燃料——同样的模型架构和算力，数据质量/数量/配比的差异，可以决定一个模型是「废铁」还是「SOTA」。LLaMA 用 15T 精选 token 训练，性能超越用 300T 粗糙数据训练的模型。

---

## 1. 概述 (Overview)

### 1.1 数据在 LLM 训练中的角色

```
LLM 训练数据流水线:

阶段1: 预训练数据 (Pre-training)
│   规模: 1-15 万亿 token
│   来源: 互联网、书籍、代码、论文
│   关键: 清洗、去重、过滤、配比
│
阶段2: 监督微调数据 (SFT)
│   规模: 10K-1M 条对话
│   来源: 人工标注、AI 辅助生成
│   关键: 质量 > 数量，覆盖度 > 数量
│
阶段3: 偏好对齐数据 (RLHF/DPO)
│   规模: 10K-1M 对偏好比较
│   来源: 人类标注、AI 反馈 (RLAIF)
│   关键: 一致性、覆盖边界 case
│
阶段4: 合成数据 (Synthetic Data)
│   规模: 可变
│   来源: 教师模型蒸馏、自我进化
│   关键: 多样性、质量控制
```

### 1.2 数据 vs 模型 vs 算力

| 维度 | Scaling Law 启示 | 边际收益 |
|------|-----------------|----------|
| **模型参数** | 对数增长 | 递减 |
| **计算量** | 对数增长 | 递减 |
| **数据量** | Chinchilla 最优：token ≈ 20× params | 有上限 |
| **数据质量** | 同等算力下，质量提升效果显著 | **持续有效** |

> **关键洞见**: 在 Chinchilla 定律之后，业界共识转向「少而精」的数据策略——LLaMA 3 用 15T 精选 token 达到与 GPT-4 级数据相当的性能。

---

## 2. 预训练数据工程

### 2.1 数据来源全景

```
预训练数据来源:

┌────────────────────────────────────────────────────────────┐
│                    LLM 预训练数据源                          │
├──────────────────┬─────────────┬───────────────────────────┤
│  数据源           │  占比 (典型) │  特点                     │
├──────────────────┼─────────────┼───────────────────────────┤
│  Common Crawl    │  40-60%    │  网页文本，噪声大，需重度清洗│
│  书籍             │  5-10%    │  长文本，高质量              │
│  学术论文         │  3-5%     │  科学推理，专业术语          │
│  代码 (GitHub)   │  10-20%   │  逻辑推理，结构化            │
│  Wikipedia       │  3-5%     │  百科知识，事实准确            │
│  论坛/问答       │  5-10%    │  对话风格，问题解决          │
│  社交媒体        │  5-10%    │  口语化，多样性              │
│  合成数据        │  5-15%    │  数学、代码、推理链          │
└──────────────────┴─────────────┴───────────────────────────┘
```

### 2.2 已知模型的预训练数据对比

| 模型 | 数据量 (tokens) | 数据来源 | 关键处理 |
|------|----------------|----------|----------|
| **GPT-3** (2020) | 300B | CommonCrawl, WebText, Books, Wiki | 基础过滤 |
| **LLaMA** (2023) | 1.4T | CC, C4, GitHub, Wiki, Books, ArXiv | 重度清洗，语言识别 |
| **LLaMA 2** (2023) | 2T | 同 LLaMA + 更多高质量数据 | 数据量增加 40% |
| **LLaMA 3** (2024) | 15T | 多源，7× LLaMA 2 数据 | 知识增强、数据配比优化 |
| **Chinchilla** (2022) | 1.4T | MassiveWeb, Books, GitHub, Wiki | Chinchilla 最优配比 |
| **Phi-2** (2023) | 1.4T | 教科书质量筛选 + 合成数据 | 质量 >> 数量 |
| **DCLM** (2024) | 4T | DataComp-LM 系统性数据选择 | 40+ 数据策略实验 |

### 2.3 数据清洗流水线

```
数据清洗流水线 (以 Common Crawl 为例):

原始网页 (HTML)
    │
    ├── 1. 文本提取: trafilatura / readability → 去除 HTML/JS/CSS
    │
    ├── 2. 语言识别: fastText language ID → 保留目标语言
    │
    ├── 3. 基础过滤:
    │   ├── 去除过短/过长文档
    │   ├── 去除高比例特殊字符
    │   ├── 去除重复行 (>30% 重复行)
    │   └── 去除低 perplexity 页面 (SEO/模板)
    │
    ├── 4. 去重:
    │   ├── URL 去重
    │   ├── 精确去重 (Exact dedup): hash 匹配
    │   └── 近似去重 (Fuzzy dedup): MinHash / SimHash
    │
    ├── 5. 质量评分:
    │   ├── 分类器打分 (高质量 vs 低质量参照集)
    │   ├── 困惑度过滤 (KenLM 语言模型)
    │   └── 毒性/有害内容过滤
    │
    └── 6. 输出: 清洗后文本 (保留率通常 5-15%)
```

```python
# 近似去重: MinHash 示例
from datasketch import MinHash, MinHashLSH

def create_minhash(text, num_perm=128):
    """为文档创建 MinHash 签名"""
    m = MinHash(num_perm=num_perm)
    for word in text.split():
        m.update(word.encode('utf8'))
    return m

def fuzzy_dedup(documents, threshold=0.8):
    """基于 MinHash LSH 的近似去重"""
    lsh = MinHashLSH(threshold=threshold, num_perm=128)
    unique_docs = []
    
    for i, doc in enumerate(documents):
        mh = create_minhash(doc)
        # 查找相似文档
        similar = lsh.query(mh)
        if not similar:
            unique_docs.append(doc)
            lsh.insert(str(i), mh)
    
    return unique_docs

# 典型去重效果:
# 精确去重: 去除 ~15% 文档
# 近似去重 (threshold=0.8): 额外去除 ~20%
```

### 2.4 数据配比 (Data Mixture)

**数据配比是 LLM 预训练中最影响性能的设计决策之一**。

| 模型 | 配比策略 | 关键发现 |
|------|----------|----------|
| **LLaMA 3** | 代码↑, 数学↑, 推理↑ | 增强 STEM 能力 |
| **Dolma (OLMo)** | 系统性消融实验 | GitHub/Wikipedia 权重最高 |
| **Phi-2** | 教科书质量数据为主 | 小数据+高质量 = 强模型 |
| **DCLM** | 40+ 策略对比 | 数据选择 > 数据处理 |

**经验法则**:
- 代码数据对推理能力有正向溢出效应
- 维基百科和书籍对事实知识贡献最大
- 过多 Common Crawl 会降低模型质量
- 合成数据（数学/代码/推理链）可定向增强能力

### 2.5 Tokenization 与数据量

| Tokenizer | 语言 | 效率 | 对中文影响 |
|-----------|------|------|-----------|
| **BPE** (GPT) | 英文优化 | 1 token ≈ 4 chars | 1 中文字 ≈ 1-2 tokens |
| **SentencePiece** | 多语言 | 多语言平衡 | 较好 |
| **Unigram** | 多语言 | 概率最优 | 较好 |
| **Tiktoken** (GPT-4) | 多语言 | 高效 | 改进 |

> 中文模型通常使用 Byte-level BPE 或 SentencePiece，针对中文优化 vocab size (50K-150K)。

---

## 3. SFT 数据工程

### 3.1 SFT 数据的核心原则

```
SFT 数据的核心认知:

┌─────────────────────────────────────────────────────────────┐
│  质量 > 数量:  1000 条高质量 > 100000 条低质量                │
│  覆盖度 > 数量: 1000 条覆盖 100 种任务 > 10000 条单一任务    │
│  格式一致: 统一的对话模板和角色标记                           │
│  多样性: 同一任务多种表达方式，避免过拟合特定模式              │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 SFT 数据来源

| 来源 | 规模 | 质量 | 成本 | 代表 |
|------|------|------|------|------|
| **人工标注** | 10K-100K | 最高 | 最贵 ($1-5/条) | LLaMA 2 Chat |
| **AI 辅助标注** | 100K-1M | 高 | 中等 | Alpaca, Vicuna |
| **自我指令** | 100K-1M | 中高 | 低 | Self-Instruct |
| **蒸馏** | 1M+ | 中 | 最低 | WizardLM, Orca |
| **进化生成** | 100K-1M | 中高 | 低 | Evol-Instruct (WizardLM) |

### 3.3 经典 SFT 数据集

| 数据集 | 规模 | 来源 | 特点 |
|--------|------|------|------|
| **FLAN** (Google) | 1.8K 任务 | 人工转换 NLP 数据集 | 多任务覆盖 |
| **Super-NaturalInstructions** | 1.6K 任务 | 1600+ NLP 任务 | 最大规模指令集 |
| **OpenAssistant** (OASST) | 160K 对话 | 众包标注 | 开源人类对话 |
| **UltraChat** | 1.5M 对话 | GPT-4 生成 | 大规模高质量 |
| **SlimOrca** | 518K | GPT-4 蒸馏 | 精简高效 |
| **Magpie** | 300K+ | LLM 自我生成 | 无需 prompt 模板 |

### 3.4 Self-Instruct 与 Evol-Instruct

**Self-Instruct** (Wang et al., 2022):
```
Self-Instruct 流程:
1. 人工写 175 条种子任务
2. GPT-3 基于种子任务生成新指令
3. 过滤: 去重 + ROUGE-L 相似度过滤
4. 生成输入输出
5. 重复 2-4 → 52K 条指令
```

**Evol-Instruct** (WizardLM, Xu et al., 2023):
```
Evol-Instruct 进化流程:

种子指令 → [进化器] → 更复杂的指令
                │
                ├── In-depth Evolving: 增加约束/步骤/推理
                ├── In-breadth Evolving: 跨领域迁移
                └── 质量过滤: 去除退化/重复

示例:
"写一篇关于AI的文章"
  → "写一篇2000字的文章，比较2024-2026年三个主流LLM架构，
     包含技术对比表格和代码示例，面向高级工程师"
```

---

## 4. RLHF / DPO 数据工程

### 4.1 偏好数据结构

```
偏好数据格式:

{
  "prompt": "解释量子计算",
  "chosen": "量子计算利用量子比特...",  (人类偏好)
  "rejected": "量子计算就是很快的计算机..."  (人类不偏好)
}

标注要求:
- 每个 prompt 至少 2-3 个回答
- 标注者按 helpfulness + harmlessness 排序
- 标注一致性检验 (Kappa > 0.7)
```

### 4.2 偏好数据标注策略

| 策略 | 说明 | 成本 | 质量 |
|------|------|------|------|
| **人类标注** | 专业标注者排序 | 高 | 最高 |
| **AI 反馈 (RLAIF)** | GPT-4 排序代替人类 | 低 | 高（与人类一致性 ~85%） |
| **混合** | 人类验证 AI 标注 | 中 | 高 |
| **Constitutional AI** | AI 基于原则自我修正 | 低 | 中高 |

### 4.3 偏好数据质量的关键

| 维度 | 问题 | 解决方案 |
|------|------|----------|
| **标注偏差** | 标注者偏好「长回答」 | 长度去偏训练 |
| **位置偏差** | 倾向选择第一个回答 | 随机排列 |
| **一致性** | 不同标注者意见分歧 | 多数投票 + 争议样本专家审核 |
| **覆盖度** | 只覆盖常见场景 | 对抗性生成边界 case |

---

## 5. 合成数据工程

### 5.1 合成数据方法论

```
合成数据生成方法:

┌────────────────────────────────────────────────────────────┐
│                    合成数据生成范式                           │
├──────────────┬──────────────────┬───────────────────────────┤
│  方法         │  原理             │  代表                      │
├──────────────┼──────────────────┼───────────────────────────┤
│  蒸馏         │  大模型→小模型    │  Orca, Phi-2              │
│  自我指令     │  LLM 生成指令    │  Self-Instruct             │
│  进化         │  逐步复杂化      │  Evol-Instruct (WizardLM)  │
│  拒绝采样     │  多次采样取最优  │  RLAIF                     │
│  代码生成     │  LLM 生成代码    │  CodeAlpaca, Magicoder     │
│  数学推理     │  生成+验证       │  MetaMath, OpenMathInstruct│
│  回译         │  翻译→反翻译     │  数据增强                    │
└──────────────┴──────────────────┴───────────────────────────┘
```

### 5.2 蒸馏 (Knowledge Distillation for Data)

```
教师模型蒸馏流程:

教师模型 (GPT-4)
    │
    ├── 种子 prompt → 教师生成高质量回答
    │
    ├── 质量过滤: 评分 > 阈值的保留
    │
    └── 学生模型用 (prompt, teacher_response) 做 SFT
    
效果:
- Orca (13B) 用 GPT-4 蒸馏 → 接近 ChatGPT 90% 性能
- Phi-2 (2.7B) 用教科书级蒸馏 → 超越 LLaMA 2 (13B)
```

### 5.3 合成数学/代码数据

| 数据集 | 规模 | 生成方法 | 效果 |
|--------|------|----------|------|
| **MetaMath** | 395K | 重写数学问题 + 验证答案 | GSM8K 提升 15% |
| **OpenMathInstruct** | 1.8M | Mixtral 生成 + 验证 | GSM8K 93.5% |
| **Magicoder** | 75K | OSS-Instruct 生成代码 | 代码 benchmark SOTA |
| **CodeAlpaca** | 20K | GPT 生成代码指令 | 代码能力增强 |

### 5.4 合成数据的质量控制

| 风险 | 表现 | 缓解策略 |
|------|------|----------|
| **模型崩塌** | 训练数据来自自身输出 → 分布坍缩 | 混合真实数据，控制比例 |
| **偏见放大** | 合成数据放大教师模型偏见 | 多样性采样，去偏过滤 |
| **事实错误** | 教师模型幻觉传播给学生 | 事实核查，RAG 增强 |
| **缺乏多样性** | 生成模式单一 | 温度调节，多种 prompt |

---

## 6. 数据标注工具与平台

| 工具 | 类型 | 特点 |
|------|------|------|
| **Label Studio** | 开源 | 灵活标注，支持多种任务 |
| **Argilla** | 开源 | LLM 专项，HF 集成 |
| **Scale AI** | 商业 | 最大标注平台 |
| **Surge AI** | 商业 | 高质量对话标注 |
| **Prodigy** | 商业 | 主动学习集成 |

---

## 7. 数据治理与合规

| 关注点 | 风险 | 最佳实践 |
|--------|------|----------|
| **版权** | 训练数据包含版权内容 | 使用授权数据，遵循 fair use |
| **隐私** | PII (个人身份信息) 泄露 | PII 检测和脱敏 |
| **偏见** | 训练数据包含有害内容 | 毒性过滤，偏见审计 |
| **水印** | 生成内容可被追踪 | 遵守数据使用协议 |

---

## 8. 工程实践

| 关注点 | 建议 |
|--------|------|
| **数据审计** | 训练前对数据进行统计分析 (长度分布、主题分布、重复率) |
| **消融实验** | 系统性测试不同数据源/配比对模型性能的影响 |
| **渐进式训练** | 先用小数据验证 pipeline，再扩大规模 |
| **数据版本控制** | 使用 DVC / LakeFS 管理数据版本 |
| **持续更新** | 定期刷新预训练数据，避免知识过时 |

---

## References

- Hoffmann et al., "Training Compute-Optimal Large Language Models" (Chinchilla, 2022)
- Gunasekar et al., "Textbooks Are All You Need" (Phi, 2023)
- Touvron et al., "LLaMA 2: Open Foundation and Fine-Tuned Chat Models" (2023)
- Li et al., "DataComp-LM: In Search of the Next Generation of Multimodal Datasets" (2024)
- Wang et al., "Self-Instruct: Aligning Language Models with Self-Generated Instructions" (2022)

## 延伸阅读

- [[synthesis/pretraining-synthetic-data|预训练数据 × 合成数据：从规模到质量的范式转移]]
