---
title: "晶体点阵 (Crystal Lattice)"
category: -concepts
tags: ["crystal-lattice", "materials-science", "ai-for-science", "gnn"]
summary: "晶体点阵是材料科学的基础概念——原子在空间中的周期性排列结构，GNN 和图神经网络常用于建模晶体结构。"
created: 2026-06-12
updated: 2026-06-12
tier: core
aliases:
  - "Crystal Lattice"
  - "crystal lattice"
lifecycle: draft
provenance:
  extracted: 0.70
  inferred: 0.25
  ambiguous: 0.05
base_confidence: 0.7
sources:
  - 18_AI_Applications_Industry/AI_for_Science/Materials_Science_and_Energy_2026.md
relationships:
  - target: "_concepts/ai-for-science"
    type: related_to
  - target: "_concepts/graph-neural-networks"
    type: related_to
---
# 晶体点阵 (Crystal Lattice)

> 晶体点阵是材料科学的基础概念——原子在空间中的周期性排列结构，GNN 和图神经网络常用于建模晶体结构。

## 基本概念

```
晶体 = 基元 (Motif) + 点阵 (Lattice)

点阵: 空间中周期性排列的几何点
基元: 附着在每个格点上的原子/分子群
布拉维点阵: 14 种三维空间点阵类型
```

## AI 在材料科学中的应用

- **GNN 建模**: 将晶体结构表示为图（原子=节点，键=边），用图神经网络预测材料性质
- **CGCNN** (Crystal Graph CNN): 直接从晶体结构预测形成能、带隙等
- **MEGNet**: 用于分子和晶体材料的图网络
- **生成模型**: 扩散模型和 VAE 用于逆向设计新材料

## 关键工具

- **pymatgen**: Python 材料基因组分析库
- **ASE**: Atomic Simulation Environment
- **Materials Project**: 开源材料数据库

## 相关阅读

- [[18_AI_Applications_Industry/AI_for_Science/Materials_Science_and_Energy_2026]] — AI 材料科学
- [[03_Deep_Learning/Graph_Neural_Networks/Graph_Neural_Networks_Deep_Dive]] — 图神经网络深度解读
