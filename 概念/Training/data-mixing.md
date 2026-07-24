---
title: "训练数据配比优化 (DoReMi / Skill-It / RegMix / 数据 Mix 策略)"
category: concepts
tags:
  - training
  - data-mixing
  - doremi
  - skill-it
  - regmix
  - data-curation
  - data-pipeline
aliases:
  - Data Mixing
  - DoReMi
  - Skill-It
  - RegMix
  - Training Data Mixture
relationships:
  - target: "概念/synthetic-data"
    type: extends
  - target: "概念/data-cleaning-pipeline"
    type: related_to
  - target: "概念/pretrain-vs-finetune-vs-rag"
    type: related_to
summary: "数据配比(Data Mixing)优化是 2023-2026 突破"训练数据多源 / 多域 / 多语言"权重选择难题的关键技术——DoReMi(Google,2023,域权重优化)、Skill-It(2024,技能权重)、RegMix(2025,回归预测)、DataComp-LM(2024,数据过滤)。把"什么数据训多少"从"猜"变成"算",Llama 3 验证可提升 5-10%。"
lifecycle: reviewed
tier: core
created: 2026-07-24
updated: 2026-07-24
sources: []
---

# 训练数据配比优化

> **一句话理解**:训练数据不是"越多越好"——多源 / 多域 / 多语言数据配比决定模型能力,DoReMi 用域权重优化、Skill-It 用技能权重、RegMix 用回归预测。Llama 3 公开了 50+ 域配比,训练出 405B SOTA。

---

## 一、为什么数据配比重要?

- **多源数据质量差异大**:Common Crawl / Wikipedia / GitHub / Books
- **能力 vs 通用性平衡**:代码多 → 数学强,Web 多 → 通用强
- **灾难性遗忘**:某域数据少,学新忘旧
- **下游任务泛化**:配比决定"什么场景强"

---

## 二、关键术语

| 中文 | 英文 | 说明 |
|---|---|---|
| 数据配比 | Data Mixture | 不同源数据权重 |
| 域权重 | Domain Weights | 按领域分配 |
| 技能权重 | Skill Weights | 按技能(代码/数学) |
| 数据过滤 | Data Filtering | 去除低质 |
| 数据去重 | Deduplication | 去重复 |
| 数据配比搜索 | Data Mixture Search | 自动找最优配比 |
| 域 | Domain | 一类数据(代码/法律) |
| 技能 | Skill | 能力(摘要/翻译) |
| 课程学习 | Curriculum Learning | 从易到难 |
| 拒绝采样 | Rejection Sampling | 筛选高质量 |
| 数据预算 | Data Budget | 训练 token 总数 |
| 数据卡 | Data Card | 数据集元数据 |
| 偏见放大 | Bias Amplification | 数据偏见放大 |
| 数据污染 | Data Contamination | 训练集含测试集 |
| 数据科学 | Data-Centric AI | 以数据为中心 |
| Scaling Law | Scaling Law | 数据-性能 关系 |
| Dual 训练 | Dual Training | 双模型训练找配比 |

---

## 三、主流方法对比(2026-02 快照)

| 方法 | 团队 | 输入 | 核心创新 | 适合 |
|---|---|---|---|---|
| **DoReMi** | Google | 数据集列表 | 域权重 + 小模型搜索 | 预训练 |
| **Skill-It** | MIT | 技能示例 | 技能图 + 顺序训练 | 指令微调 |
| **RegMix** | Microsoft | 数据集元数据 | 元学习回归预测 | 预训练 |
| **DataComp-LM** | MLCommons | 数据池 | 数据过滤 + 配比 | 预训练 |
| **Llama 3 Mix** | Meta | 手工 | 50+ 域经验配比 | 预训练 |
| **Qwen 2.5 Mix** | 阿里 | 手工 | 多语言 + 推理加权 | 预训练 |
| **DeepSeek V3 Mix** | 深度求索 | 手工 | 14T tokens 多源 | 预训练 |
| **Anneal** | 主流 | 退火 | 后阶段高质量数据 | SFT |

---

## 四、DoReMi 详解

### 4.1 核心思想

**Domain Reweighting with Minimax Optimization**:
- 用一个小模型(280M)做"代理"
- 训练时:小模型 + 不同域权重 → 找到"最难"的域
- 反向更新域权重(让所有域均匀变难)
- 重复多轮,得到最优域权重
- 把权重应用到全模型训练

### 4.2 流水线

```
数据按域分桶(代码/百科/对话/...)
  ↓
[小模型多轮训练] + [域权重优化]
  ↓
[最优域权重]
  ↓
大模型用该权重训练
```

### 4.3 优势

- 自动:无需手工调权重
- 加速:小模型搜索快
- 提升:在同等数据下 5-10% 提升
- 开源:Apache 2.0

### 4.4 论文

- "DoReMi: Optimizing Data Mixtures Speeds Up Language Model Pretraining" [arxiv.org/abs/2305.10429](https://arxiv.org/abs/2305.10429)
- 仓库 [github.com/somepago/doremi](https://github.com/somepago/doremi)

---

## 五、Skill-It 详解(MIT)

### 5.1 核心思想

**技能图(Skill Graph)**:
- 构建"技能依赖图"(简单加法 → 复杂方程 → 微积分)
- 训练时按图顺序:基础技能先学,组合技能后学
- 类似"课程学习"在技能层面

### 5.2 流水线

```
数据集 → [技能抽取] → 技能节点
   ↓
[技能依赖图] (有向无环图)
   ↓
[按顺序采样训练] (先叶子,后根)
```

### 5.3 优势

- 任务特定效果好(数学/代码)
- 比随机采样快 2x 收敛

### 5.4 论文

- "Skill-It! A Data-Free Skills Selector for Few-Shot Learning" [arxiv.org/abs/2307.14330](https://arxiv.org/abs/2307.14330)

---

## 六、RegMix 详解(微软)

### 6.1 核心思想

**元学习预测**:
- 收集多个"小训练"的结果
- 训练一个回归模型预测"配比 → 性能"
- 用回归模型找最优配比
- 比 DoReMi 更省时

### 6.2 优势

- 极快:几十次小训练即可
- 可解释:回归权重可分析
- 适合:数据池大、预算紧

### 6.3 论文

- "RegMix: Data Mixture Optimization with Regression" [arxiv.org/abs/2407.01477](https://github.com/microsoft/RegMix)

---

## 七、Llama 3 公开配比参考

| 域 | 占比 | 备注 |
|---|---|---|
| CommonCrawl | 50% | Web 通用 |
| GitHub | 4.5% | 代码 |
| Wikipedia | 4.5% | 知识 |
| Books | 4.5% | 推理 |
| ArXiv | 2.5% | 科学 |
| StackExchange | 2% | 问答 |
| 多语言 | 5% | 中欧日韩 |
| 问答 | 1% | 高质量 Q&A |

**Llama 3 15.6T tokens 总训练量**

---

## 八、生产最佳实践

1. **首选 DoReMi + 经验配比**:自动化 + 人工校验。
2. **小模型(280M-1B)做配比搜索**:省时省钱。
3. **退火(Anneal)必做**:训练最后 5% 用高质量数据(教科书 / 论文)。
4. **多语言按目标市场**:中文 SFT 多用中文,英文 SFT 多用英文。
5. **代码配比 5-15%**:太少 → 推理弱,太多 → 通用差。
6. **数学配比 3-10%**:太少 → 数学差,太多 → 偏科。
7. **配比搜索用小数据集**:100B tokens 即可找规律。
8. **A/B 测试**:不同配比训 1B 模型,下游任务对比。
9. **数据卡(Data Card)**:记录每次配比 + 性能。
10. **动态调整**:训练中观察各域 loss,动态加权重。

---

## 九、2026 生态速览

| 维度 | 2026 状态 |
|---|---|
| **DoReMi** | 主流,Google + Llama 3 验证 |
| **Skill-It** | 数学/代码任务首选 |
| **RegMix** | 工业部署,微软 .NET + Office 团队 |
| **DataComp-LM** | MLCommons 2024 评测 |
| **手动配比** | Qwen / DeepSeek / Llama 3 / GLM 公开配比 |
| **退火数据** | 主流必备,High-Quality 后 5% |
| **数据科学** | DataComp / DataPerf / DC-Check 持续推进 |
| **企业应用** | 大模型预训练、SFT、RLHF 全流程 |
| **市场规模** | 数据管理 ARR $500M+ |
| **主要竞品** | DoReMi / Skill-It / RegMix / Llama 3 Mix / DataComp-LM |

---

## 十、See Also(官方源)

### 核心论文

- DoReMi [arxiv.org/abs/2305.10429](https://arxiv.org/abs/2305.10429)
- Skill-It [arxiv.org/abs/2307.14330](https://arxiv.org/abs/2307.14330)
- RegMix [arxiv.org/abs/2407.01477](https://arxiv.org/abs/2407.01477)
- DataComp-LM [arxiv.org/abs/2406.11741](https://arxiv.org/abs/2406.11741)

### 仓库

- DoReMi [github.com/somepago/doremi](https://github.com/somepago/doremi)
- RegMix [github.com/microsoft/RegMix](https://github.com/microsoft/RegMix)
- DataComp [github.com/mlfoundations/datacomp](https://github.com/mlfoundations/datacomp)

### 大模型配比参考

- Llama 3 报告 [arxiv.org/abs/2407.21783](https://arxiv.org/abs/2407.21783)
- DeepSeek V3 报告 [arxiv.org/abs/2412.19437](https://arxiv.org/abs/2412.19437)
- Qwen 2.5 [qwenlm.github.io/blog/qwen2.5](https://qwenlm.github.io/blog/qwen2.5/)

---

## 十一、相关概念卡

- [[概念/synthetic-data|Synthetic Data]]
- [[概念/data-cleaning-pipeline|Data Cleaning Pipeline]]
- [[概念/pretrain-vs-finetune-vs-rag|Pretrain Vs Finetune Vs Rag]]
- [[概念/online-dpo-rl|Online Dpo Rl]]
- [[概念/curriculum-learning|Curriculum Learning]]
- [[概念/chinchilla-scaling-laws|Chinchilla Scaling Laws]]
- [[概念/pre-training|Pre Training]]
- [[概念/sft|Sft]]
