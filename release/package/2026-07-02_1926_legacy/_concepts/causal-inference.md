---
title: "因果推断 (Causal Inference)"
category: -concepts
tags: ["machine-learning", "causal-inference", "causality", "do-calculus", "causal-graph", "confounder"]
relationships:
  - target: "_concepts/probability-statistics"
    type: builds_on
  - target: "_concepts/supervised-learning"
    type: related_to
  - target: "_concepts/bayesian-methods"
    type: related_to
sources:
  - 02_Machine_Learning/Causal_Inference
summary: "因果推断超越相关性分析，回答「如果干预X，Y会怎样变化」的因果问题。核心工具包括因果图(DAG)、do-演算、工具变量、倾向评分匹配和反事实推理。"
provenance:
  extracted: 0.45
  inferred: 0.45
  ambiguous: 0.10
base_confidence: 0.88
lifecycle: stable
tier: core
created: 2026-06-04
updated: 2026-06-04
aliases:
  - "Causal Inference"
  - "causal inference"

---
# 因果推断 (Causal Inference)

> 从「相关」到「因果」——让 AI 理解干预的后果，而非仅仅是模式匹配。

---

## 1. 定义

**因果推断**（Causal Inference）是统计学和机器学习的交叉领域，旨在从观测数据中识别变量间的**因果关系**（而非仅仅是相关性）。核心问题：「如果我**干预** X，Y 会怎样变化？」

> Judea Pearl 的因果革命指出：纯观测数据无法回答因果问题，必须引入因果假设（以因果图形式编码）。

---

## 2. Pearl 因果阶梯 (Ladder of Causation)

| 层级 | 问题类型 | 数学工具 | 示例 |
|------|----------|----------|------|
| **L1 关联** (Association) | "X 和 Y 相关吗？" | 条件概率 P(Y\|X) | "吸烟者肺癌率高" |
| **L2 干预** (Intervention) | "如果我**让** X 变化，Y 会变吗？" | do-算子 P(Y\|do(X)) | "强制戒烟会降低肺癌吗？" |
| **L3 反事实** (Counterfactual) | "如果当时 X 不同，Y 会怎样？" | 结构因果模型 (SCM) | "如果他从未吸烟，会得肺癌吗？" |

**关键洞见**：大多数机器学习停留在 L1（关联），因果推断的目标是到达 L2/L3。

---

## 3. 核心工具

### 3.1 因果图 (DAG / Causal Graph)

用有向无环图编码变量间的因果关系：

```
        基因 (Z)        ← 混淆变量 (Confounder)
       ↙      ↘
   吸烟 (X) → 肺癌 (Y)
   
   Z 是 X 和 Y 的共同原因，导致 X→Y 的观察相关性包含「虚假关联」
```

**三种基本路径结构**：

| 结构 | 名称 | 信息流 | 阻断条件 |
|------|------|--------|----------|
| X → Z → Y | 链 (Chain) | 流通 | 条件化 Z |
| X ← Z → Y | 叉 (Fork) | 流通 | 条件化 Z |
| X → Z ← Y | 对撞 (Collider) | **阻断** | 条件化 Z（**反而开通**） |

### 3.2 do-演算 (do-Calculus)

`do(X=x)` 表示**干预**——强制将 X 设为 x（切断 X 的所有入边）：

\[
P(Y|do(X=x)) = \sum_z P(Y|X=x, Z=z) \cdot P(Z=z)
\]

（后门调整公式：通过条件化所有后门路径上的变量消除混淆）

### 3.3 后门准则 (Back-Door Criterion)

要估计 X→Y 的因果效应，需找到满足以下条件的变量集 Z：
1. Z 阻断所有从 X 到 Y 的**后门路径**（含指向 X 的箭头的路径）
2. Z 不包含 X 的后代

满足条件后：\(P(Y|do(X)) = \sum_z P(Y|X,Z=z)P(Z=z)\)

---

## 4. 方法对比

| 方法 | 核心思想 | 假设 | 适用场景 |
|------|----------|------|----------|
| **RCT（随机对照实验）** | 随机分配处理组 | 无 | 金标准，但常不可行/不道德 |
| **倾向评分匹配 (PSM)** | 按 P(T\|X) 配对处理和对照组 | 无未观测混淆 | 观测数据因果推断 |
| **工具变量 (IV)** | 用外生变量 Z 影响 X 但不直接影响 Y | 排除限制 | 存在未观测混淆 |
| **双重差分 (DiD)** | 处理前后差异的差异 | 平行趋势 | 政策评估 |
| **断点回归 (RDD)** | 利用阈值附近的准随机性 | 阈值处无操纵 | 有明确阈值的政策 |
| **因果发现算法** | 从数据中学习因果图 | 忠实性、因果马尔可夫 | 探索性因果分析 |

---

## 5. 因果发现 (Causal Discovery)

从观测数据自动学习因果图结构：

| 算法族 | 代表方法 | 原理 | 可扩展性 |
|--------|----------|------|----------|
| **约束型** | PC, FCI | 条件独立性检验 | 中等（~100 变量） |
| **评分型** | GES (Greedy Equivalence Search) | 优化 BIC 评分 | 较好 |
| **连续优化** | NOTEARS | 将 DAG 约束转化为连续优化 | 好（~1000 变量） |
| **混合方法** | DirectLiNGAM | 非高斯性 + 因果序 | 好（线性） |

---

## 6. 因果推断与 AI 的融合

| 方向 | 说明 | 代表性工作 |
|------|------|-----------|
| **因果表征学习** | 学习因果变量而非统计相关 | iCITRANSS, TDRL |
| **因果强化学习** | 用因果图指导 RL 探索 | Causal RL (Zhang et al.) |
| **因果公平性** | 量化歧视的因果路径 | Path-specific counterfactual fairness |
| **LLM 因果能力** | 评估 LLM 是否理解因果 | CRASS, CLADDER benchmark |
| **因果 RAG** | 检索因果知识增强推理 | CausalKG-RAG |

---

## 7. 经典陷阱

1. **辛普森悖论**：总体趋势在分组后反转（忽视混淆变量的结果）
2. **Berkson 偏差**：对撞变量的选择偏差制造虚假相关
3. **生态谬误**：群体层面的关联不适用于个体
4. **幸存者偏差**：只看到「幸存」样本导致因果误判
5. **多重比较**：大量相关性检验必然出现「显著」结果

---

## 8. 工程实践

| 关注点 | 建议 |
|--------|------|
| **因果图构建** | 先画 DAG 再选方法，领域知识 > 纯数据驱动 |
| **敏感性分析** | 量化未观测混淆对结论的影响（Rosenbaum bounds） |
| **工具变量选择** | 严格检验排除限制，弱工具变量比无工具变量更危险 |
| **A/B 测试** | RCT 是因果推断金标准，能做 RCT 时不要依赖观测方法 |

---

## Related

- [[02_Machine_Learning/Causal_Inference/README]] — 因果推断深度解析
- [[_concepts/probability-statistics]] — 概率统计基础
- [[_concepts/supervised-learning]] — 监督学习（相关 vs 因果）
- [[_concepts/bayesian-methods]] — 贝叶斯方法（贝叶斯因果网络）
