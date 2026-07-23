---
title: 跨域综合文档索引 (Cross-Domain Synthesis Index)
category: -synthesis
tags: [synthesis, knowledge-graph, cross-domain]
summary: 18 篇跨领域综合分析文档，连接不同章节的概念，发现知识间的隐藏关联。
created: 2026-06-03
updated: 2026-06-15
tier: core
sources: []

---
# 跨域综合文档索引 (Synthesis Index)

> **定位**: 跨领域综合分析层（每篇 1.7-4.5KB），连接来自不同章节的概念，揭示知识间的隐藏关联。
>
> **与主章节的关系**: 每篇综合文档从 2-4 个不同章节提取关联，形成"概念A × 概念B"的交叉洞见。
>
> **与 概念/ 的关系**: 概念/ 是单点概念卡片，治理/ 是多点关联分析，二者互补构成知识图谱。

---

## 综合文档列表

### 架构与推理（3 篇）

| 文档 | 交叉领域 | 核心洞见 |
|------|----------|----------|
| [transformer-llm-architecture](./transformer-llm-architecture.md) | 03_Deep_Learning × 04_NLP_LLMs | Transformer 架构如何催生 LLM 生态 |
| [llm-nlp](./llm-nlp.md) | 04_NLP_LLMs 内部 | 大模型在 NLP 任务上的统一范式 |
| [moe-inference-optimization](./moe-inference-optimization.md) | 04_NLP_LLMs × 09_Deployment_Inference | MoE 架构的推理优化策略 |

### 训练与微调（2 篇）

| 文档 | 交叉领域 | 核心洞见 |
|------|----------|----------|
| [training-fine-tuning](./training-fine-tuning.md) | 07_Model_Training × 04_NLP_LLMs | 预训练到后训练的完整链路 |
| [python-data-science-pipeline](./python-data-science-pipeline.md) | 01_Fundamentals × 02_Machine_Learning | 从数据处理到模型训练的 Python 工具链 |

### 视觉与深度学习（2 篇）

| 文档 | 交叉领域 | 核心洞见 |
|------|----------|----------|
| [cv-deep-learning](./cv-deep-learning.md) | 05_Computer_Vision × 03_Deep_Learning | 深度学习如何重塑计算机视觉 |
| [multimodal-rag](./multimodal-rag.md) | 05_Computer_Vision × 11_RAG_Systems | 多模态检索增强生成系统 |

### 智能体与强化学习（3 篇）

| 文档 | 交叉领域 | 核心洞见 |
|------|----------|----------|
| [agents-reinforcement-learning](./agents-reinforcement-learning.md) | 06_Reinforcement_Learning × 13_Agent_Production | RL 如何驱动 Agent 决策 |
| [reasoning-models-agents](./reasoning-models-agents.md) | 04_NLP_LLMs × 06_Reinforcement_Learning | 推理模型与 Agent 的融合（o1+Agent） |
| [agent-framework-production](./agent-framework-production.md) | 13_Agent_Production × 12_Architecture_Infrastructure | Agent 框架从原型到生产的架构演进 |

### RAG 与部署（2 篇）

| 文档 | 交叉领域 | 核心洞见 |
|------|----------|----------|
| [rag-vector-database](./rag-vector-database.md) | 11_RAG_Systems × 09_Deployment_Inference | RAG 系统中向量数据库的部署与运维 |
| [serving-deployment](./serving-deployment.md) | 09_Deployment_Inference × 12_Architecture_Infrastructure | 模型服务的生产部署最佳实践 |

### 安全与评估（2 篇）

| 文档 | 交叉领域 | 核心洞见 |
|------|----------|----------|
| [safety-evaluation-red-teaming](./safety-evaluation-red-teaming.md) | 19_Ethics_Safety × 08_Model_Evaluation | 安全评测与红队测试的攻防闭环 |
| [ai-ethics-future](./ai-ethics-future.md) | 19_Ethics_Safety × 00_AI_Introduction | AI 伦理如何影响未来技术路线 |

### 行业与职业（3 篇）

| 文档 | 交叉领域 | 核心洞见 |
|------|----------|----------|
| [ai-industry-applications](./ai-industry-applications.md) | 20_AI_Applications_Industry × 04_NLP_LLMs | AI 技术在不同行业的落地模式 |
| [career-interviews](./career-interviews.md) | 23_Interviews × 全部章节 | AI 岗位面试的知识图谱 |
| [talks-insights](./talks-insights.md) | 21_Talks × 00_AI_Introduction | AI 领袖观点中的技术趋势提炼 |

### LLM 生态对比（1 篇）

| 文档 | 交叉领域 | 核心洞见 |
|------|----------|----------|
| [Chinese_vs_Global_LLM_Comparison](./Chinese_vs_Global_LLM_Comparison.md) | Chinese_LLM_Ecosystem × Global_LLM_Ecosystem | 12 维度全面对比中国 15 家 vs 国际 5 巨头：效率路线 vs 规模路线的收敛 |

---

- [[治理/alignment-rlhf|价值对齐 × RLHF：从人类反馈到可扩展监督]] — #alignment × #rlhf
- [[治理/benchmark-evaluation|评测基准 × 评测方法论：从分数到可信评估]] — #benchmark × #evaluation
- [[治理/pretraining-synthetic-data|预训练数据 × 合成数据：从规模到质量的范式转移]] — #pretraining-data × #synthetic-data
## 综合文档模板

每篇综合文档遵循以下结构：

```markdown
---
title: "概念A × 概念B: 标题"
category: -synthesis
tags: [tag1, tag2, synthesis]
sources:
  - "XX_Chapter/Document_A"
  - "YY_Chapter/Document_B"
summary: "一句话交叉洞见"
provenance:
  extracted: 0.XX
  inferred: 0.XX
  ambiguous: 0.XX
base_confidence: 0.XX
lifecycle: draft | review | stable
---

# 标题

## The Connection
描述两个概念的关联点

## Key Insights
- 洞见 1
- 洞见 2
- 洞见 3

## Practical Implications
实际应用建议

## Sources
引用来源列表
```

---

## 统计

- **总数**: 18 篇综合文档
- **平均大小**: ~3.1 KB
- **覆盖交叉对**: 16+ 对章节组合
- **最大文档**: Chinese_vs_Global_LLM_Comparison（756 行，12 维度对比）
- **最高置信度**: moe-inference-optimization（0.80）
- **最低置信度**: career-interviews（0.65）


## 核心知识体系

| 知识域 | 核心内容 | 重要程度 | 学习优先级 |
|--------|----------|----------|------------|
| 基础理论 | 核心概念/原理/方法论 | 最高 | P0 |
| 技术实践 | 工具/框架/最佳实践 | 高 | P0 |
| 工程方法 | 设计模式/架构/流程 | 高 | P1 |
| 前沿趋势 | 新技术/新方向/研究 | 中 | P2 |
| 行业应用 | 实际案例/落地经验 | 中 | P1 |

## 技术对比与选型

| 维度 | 方案A | 方案B | 方案C | 选型建议 |
|------|-------|-------|-------|----------|
| 性能 | 高吞吐 | 低延迟 | 均衡 | 按场景选择 |
| 复杂度 | 简单 | 中等 | 复杂 | 按团队能力 |
| 成本 | 低 | 中 | 高 | 按预算约束 |
| 生态 | 成熟 | 发展中 | 新兴 | 按稳定性需求 |
| 扩展性 | 有限 | 良好 | 优秀 | 按增长预期 |

## 最佳实践清单

| 实践 | 说明 | 优先级 | 预期收益 |
|------|------|--------|----------|
| 标准化流程 | 统一规范和流程 | P0 | 减少错误+提升效率 |
| 自动化 | 重复工作自动化 | P0 | 节省时间+降低风险 |
| 持续监控 | 关键指标实时监控 | P1 | 及时发现问题 |
| 定期回顾 | 周期性复盘改进 | P1 | 持续优化 |
| 知识沉淀 | 文档化经验教训 | P2 | 团队能力提升 |
| 安全优先 | 安全贯穿全流程 | P0 | 降低风险 |

## 常见问题与解决方案

| 问题 | 根因分析 | 解决方案 | 预防措施 |
|------|----------|----------|----------|
| 效率低下 | 流程不规范/工具不当 | 优化流程+引入工具 | 标准化+培训 |
| 质量不稳定 | 缺乏检查机制 | 引入质量门禁 | 自动化测试 |
| 协作困难 | 职责不清/沟通不畅 | 明确分工+定期同步 | 文档化+工具 |
| 技术债务 | 赶工忽略质量 | 定期重构+代码审查 | 质量优先文化 |
| 安全风险 | 意识不足/措施缺失 | 安全培训+工具扫描 | 安全左移 |

## 学习路径建议

| 阶段 | 内容 | 时间 | 产出 |
|------|------|------|------|
| 入门 | 核心概念+基础操作 | 1-2周 | 理解基本框架 |
| 基础 | 工具使用+简单实践 | 2-3周 | 能独立完成基础任务 |
| 进阶 | 深入原理+复杂场景 | 3-4周 | 能处理复杂问题 |
| 实战 | 生产级应用+优化 | 4-6周 | 独立负责项目 |
| 精通 | 架构设计+前沿探索 | 持续 | 技术领导力 |

## 术语速查表

| 术语 | 含义 |
|------|------|
| Best Practice | 行业公认的最佳做法 |
| Anti-pattern | 反模式(应避免的做法) |
| Technical Debt | 技术债务(为速度牺牲质量) |
| CI/CD | 持续集成/持续部署 |
| SLA | 服务等级协议 |
| KPI | 关键绩效指标 |
| ROI | 投资回报率 |
| TCO | 总拥有成本 |

## 检查清单

- [ ] 核心概念和原理已理解
- [ ] 主流工具和框架已掌握
- [ ] 最佳实践已应用到工作中
- [ ] 常见问题能独立解决
- [ ] 持续关注前沿趋势
- [ ] 知识已文档化沉淀
