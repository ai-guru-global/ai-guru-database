---
title: "数据清洗 Pipeline"
category: -concepts
tags: ["data-cleaning", "data-curation", "pretraining", "fine-tuning", "pipeline", "data-quality"]
relationships:
  - target: "概念/llm-data-engineering"
    type: belongs_to
  - target: "概念/model-training"
    type: precedes
  - target: "概念/scaling-laws"
    type: influences
sources:
  - 模型训练/Data/Data_Curation_and_Mixture_2026.md
  - 大模型/LLM_Data_Engineering.md
  - 模型训练/README.md
summary: "数据清洗 Pipeline 就像给 AI 准备‘干净食材’的中央厨房：把从网上抓来的原始数据，经过去重、去噪、格式统一、质量打分、毒性过滤等步骤，变成适合训练大模型的高质量语料。"
provenance:
  extracted: 0.75
  inferred: 0.2
  ambiguous: 0.05
base_confidence: 0.82
lifecycle: reviewed
lifecycle_changed: 2026-06-16
tier: core
created: 2026-06-16
updated: 2026-07-21
aliases:
  - "Data Cleaning Pipeline"
  - "data cleaning pipeline"

---
# 数据清洗 Pipeline

## 核心要点

- **大模型的‘Garbage in, garbage out’**：喂什么数据，决定模型学什么。
- **数据清洗 Pipeline 是一套自动化流程**，把原始语料变成干净、均衡、安全的训练数据。
- **关键步骤**：采集 → 去重 → 去噪 → 格式标准化 → 质量过滤 → 安全过滤 → 数据配比。
- **目标**：提升模型能力、减少幻觉、降低有害内容、控制训练成本。

## 一句话理解

数据清洗 Pipeline 就像给 AI 做饭前先洗菜、切菜、挑掉烂叶子：原料干净了，炒出来的菜才好吃。

## 详细内容

### 为什么数据清洗如此重要？

训练大模型需要海量文本（几十 TB），但互联网数据良莠不齐：
- **重复内容**：同一个网页被反复抓取，浪费算力。
- **低质量文本**：乱码、模板页、广告、机器生成垃圾。
- **有毒内容**：仇恨言论、成人内容、个人隐私信息。
- **分布偏差**：某些领域过多（如 Reddit 论坛），某些领域过少（如专业论文）。

研究显示，**用 10% 的高质量数据训练，效果可能比 100% 脏数据更好**。

### 典型 Pipeline 步骤

```
原始数据
  ↓ 采集（Common Crawl、GitHub、书籍、论文、对话）
  ↓ 去重（URL 去重、段落 MinHash 去重、文档级去重）
  ↓ 格式清洗（HTML 转纯文本、去除页眉页脚、统一编码）
  ↓ 质量打分（语言模型困惑度、文本长度、标点比例、可读性）
  ↓ 安全过滤（ toxicity、PII、偏见、违法内容）
  ↓ 数据配比（按领域/语言/难度混合）
  ↓ 高质量训练语料
```

### 常用技术与工具

| 步骤 | 方法/工具 | 作用 |
|------|-----------|------|
| 去重 | MinHash/LSH、SimHash、Exact Match | 去掉重复/近似重复文档 |
| 质量打分 | perplexity 过滤、fastText 语言识别、规则过滤 | 保留高质量段落 |
| 安全过滤 | 关键词、分类器、 moderation API | 去除有毒/隐私内容 |
| 配比 | 领域权重、语言比例、难度采样 | 让训练数据分布合理 |
| 版本管理 | DVC、LakeFS、HuggingFace Datasets | 数据可追踪、可复现 |

### 预训练 vs 微调的数据清洗

| 阶段 | 关注点 | 示例 |
|------|--------|------|
| **预训练** | 规模、多样性、去重、去毒 | 万亿 token 级网页+书籍+代码 |
| **SFT 微调** | 指令格式、答案质量、多轮对话 | Alpaca、ShareGPT、指令数据集 |
| **RLHF 对齐** | 偏好对、安全边界、人类价值观 | HH-RLHF、Anthropic 偏好数据 |

## 开放问题

- 如何自动评估清洗后数据对模型能力的真实影响。
- 合成数据（synthetic data）在清洗 Pipeline 中的最佳比例。
- 多语言/小众语言数据的清洗标准与工具仍不完善。

## Related

- [[概念/llm-data-engineering]] — 大模型数据工程
- [[概念/model-training]] — 模型训练
- [[概念/synthetic-data]] — 合成数据
- [[模型训练/Data/Data_Curation_and_Mixture_2026]] — 数据策展与配比 2026
- [[大模型/LLM_Data_Engineering/README]] — 大模型数据工程

---

## 2026 数据清洗生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **数据去重** | 重复数据去除 | GA |
| **质量过滤** | 低质量数据过滤 | GA |
| **敏感信息** | 敏感信息脱敏 | GA |
| **数据配比** | 训练数据配比 | GA |
| **合成数据** | 合成数据增强 | GA |

## 生产最佳实践

1. **数据去重**：训练数据必须去重
2. **质量过滤**：过滤低质量数据
3. **敏感信息**：敏感信息脱敏处理
4. **数据配比**：合理配置数据配比
5. **合成数据**：用合成数据增强

## 清洗流水线架构

```text
原始数据 → 格式统一 → 去重 → 质量过滤 → 脱敏 → 配比 → 输出
   │          │        │        │        │      │      │
   │     编码/格式   MinHash  困惑度   PII   领域   训练
   │     统一      SimHash  分类器   检测   平衡   就绪
```

## 清洗工具对比

| 工具 | 用途 | 规模 |
|------|------|------|
| **datasketch** | MinHash 去重 | 十亿级 |
| **fastText** | 质量分类 | 亿级 |
| **Presidio** | PII 检测脱敏 | 百万级 |
| **Spark** | 分布式处理 | PB 级 |
| **Ray Data** | 并行清洗 | TB 级 |

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 去重不彻底 | 近似重复未检测 | MinHash + 模糊匹配 |
| 误删高质量数据 | 过滤器太严 | 调低阈值 + 人工抽检 |
| PII 泄漏 | 检测规则不全 | 多层检测 + 正则 + NER |
| 配比失衡 | 某领域数据过多 | 下采样 + 上采样 |
| 处理速度慢 | 单机处理 | Spark/Ray 分布式 |

## 版本兼容性

| 工具 | 版本 | 说明 |
|------|------|------|
| datasketch | 1.6+ | 去重 |
| fastText | 最新 | 质量分类 |
| Presidio | 2.x | PII 检测 |
| Apache Spark | 3.5+ | 分布式处理 |

## 生产检查清单

1. 去重后抽检确认无大规模重复
2. 质量过滤后人工抽样验证
3. PII 检测覆盖率审计
4. 数据配比符合训练目标
5. 清洗日志完整可追溯
6. 定期更新过滤规则

## 总结

数据清洗是 LLM 训练的第一道关卡，数据质量直接决定模型效果。2026 年数据清洗已形成成熟的流水线：去重→质量过滤→脱敏→配比，每个环节都有专业工具支撑。

> 💡 数据清洗的核心认知：垃圾进垃圾出——再好的模型架构也无法弥补低质量训练数据带来的缺陷。数据清洗是 ROI 最高的模型优化手段。

## 清洗流水线架构

```yaml
# 数据清洗流水线
data_cleaning_pipeline:
  stage_1_dedup:
    - exact_dedup          # 精确去重
    - fuzzy_dedup          # 模糊去重（MinHash）
    - semantic_dedup       # 语义去重（Embedding）
  stage_2_quality:
    - language_detection   # 语言检测
    - perplexity_filter    # PPL 过滤
    - toxicity_filter      # 毒性过滤
    - pii_removal          # PII 脱敏
  stage_3_format:
    - encoding_fix         # 编码修复
    - whitespace_normalize # 空白规范化
    - markdown_clean       # Markdown 清理
  stage_4_validate:
    - schema_validation    # 格式验证
    - statistics_check     # 统计检查
    - sample_review        # 抽样审核
```

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 清洗过度 | 规则过严 | 抽样验证 + 调整阈值 |
| 清洗不足 | 规则过松 | 增加检测维度 |
| 性能瓶颈 | 数据量大 | 分布式处理（Spark/Ray） |
| 误删有效数据 | 规则不精确 | 保留原始 + 可回滚 |

## 生产检查清单

1. ✅ 保留原始数据，清洗结果可回滚
2. ✅ 多阶段清洗（去重→质量→格式→验证）
3. ✅ 抽样人工审核清洗效果
4. ✅ 分布式处理大规模数据
5. ✅ 记录清洗统计（删除率/保留率）
6. ✅ 定期更新清洗规则适应新数据

