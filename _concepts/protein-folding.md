---
title: "蛋白质折叠 (Protein Folding)"
category: -concepts
tags: ["protein-folding", "bioinformatics", "alphafold", "ai-for-science"]
summary: "蛋白质折叠是 AI for Science 的里程碑应用——AlphaFold 2 在 2020 年解决了 50 年来的蛋白质结构预测难题。"
created: 2026-06-12
updated: 2026-06-12
---

# 蛋白质折叠 (Protein Folding)

> 蛋白质折叠是 AI for Science 的里程碑应用——AlphaFold 2 在 2020 年解决了 50 年来的蛋白质结构预测难题。

## 核心问题

蛋白质的一维氨基酸序列如何决定其三维结构？这被称为"蛋白质折叠问题"。

```
氨基酸序列（一级结构）→ 折叠 → 三维结构（三级结构）
结构决定功能：酶催化、信号传导、免疫防御
```

## AlphaFold 2 的关键创新

```python
# AlphaFold 2 架构核心
# 1. MSA (Multiple Sequence Alignment): 多序列比对提取进化信息
# 2. Pair Representation: 残基对的距离和角度预测
# 3. Evoformer: 处理 MSA 和 pair 信息的 Transformer
# 4. Structure Module: 迭代精炼 3D 坐标

# 输入: 氨基酸序列 → MSA → Evoformer → Structure Module → 3D 结构
# 精度: GDT > 90（接近实验水平）
```

## 后续发展

- **AlphaFold 3** (2024): 扩展到 DNA/RNA/小分子/离子的复合物预测
- **ESMFold** (Meta): 单序列预测，无需 MSA，速度快 10x
- **OpenFold**: 开源复现，支持自定义训练

## 相关阅读

- [[18_AI_Applications_Industry/AI_for_Science/Protein_Folding_and_Drug_Discovery_2026]] — AI 蛋白质折叠与药物发现
- [[18_AI_Applications_Industry/AI_for_Science/AI_for_Science_Deep_Dive]] — AI for Science 深度解读
