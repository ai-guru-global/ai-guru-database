---
title: "蛋白质折叠 (Protein Folding)"
category: -concepts
tags: ["protein-folding", "bioinformatics", "alphafold", "ai-for-science"]
summary: "蛋白质折叠是 AI for Science 的里程碑应用——AlphaFold 2 在 2020 年解决了 50 年来的蛋白质结构预测难题。"
created: 2026-06-12
updated: 2026-07-21
tier: core
aliases:
  - "Protein Folding"
  - "protein folding"
lifecycle: reviewed
provenance:
  extracted: 0.70
  inferred: 0.25
  ambiguous: 0.05
base_confidence: 0.8
sources:
  - 行业应用/AI_for_Science/Protein_Folding_and_Drug_Discovery_2026.md
  - 行业应用/AI_for_Science/AI_for_Science_Deep_Dive.md
relationships:
  - target: "概念/ai-for-science"
    type: related_to
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

- [[行业应用/AI_for_Science/Protein_Folding_and_Drug_Discovery_2026]] — AI 蛋白质折叠与药物发现
- [[行业应用/AI_for_Science/AI_for_Science_Deep_Dive]] — AI for Science 深度解读

---

## 2026 蛋白质折叠生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **AlphaFold 3** | DeepMind 蛋白质结构预测 | GA |
| **ESMFold** | Meta 蛋白质语言模型 | GA |
| **RoseTTAFold** | 蛋白质结构预测 | GA |
| **蛋白质设计** | AI 蛋白质设计 | 研究 |
| **药物发现** | AI 加速药物发现 | 研究 |

## 生产最佳实践

1. **AlphaFold 预测**：蛋白质结构用 AlphaFold 预测
2. **ESMFold 快速**：快速预测用 ESMFold
3. **药物发现**：AI 加速药物发现
4. **蛋白质设计**：AI 设计新蛋白质
5. **实验验证**：AI 预测需实验验证

## 工具对比

| 工具 | 输入 | 速度 | 精度 | 适用 |
|------|------|------|------|------|
| AlphaFold 3 | 序列+MSA | 慢 | 极高 | 精确预测 |
| ESMFold | 单序列 | 快 | 高 | 快速筛选 |
| RoseTTAFold | 序列+MSA | 中 | 高 | 开源替代 |
| OpenFold | 序列+MSA | 慢 | 高 | 自定义训练 |
| ColabFold | 序列 | 中 | 高 | 云端免费 |

## 应用场景

| 场景 | 说明 | AI 方法 |
|------|------|------|
| 结构预测 | 预测蛋白质 3D 结构 | AlphaFold/ESMFold |
| 药物设计 | 设计小分子药物 | 分子对接/生成模型 |
| 蛋白质设计 | 设计新功能蛋白质 | RFdiffusion/ProteinMPNN |
| 突变效应 | 预测突变影响 | ESM/ProtTrans |
| 相互作用 | 预测蛋白质-蛋白质相互作用 | AlphaFold-Multimer |

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|------|
| 预测不准 | MSA 质量差 | 增加同源序列 |
| 内存不足 | 序列太长 | 使用 ESMFold/分块 |
| 复合物预测失败 | 相互作用弱 | 使用 AlphaFold-Multimer |
| 动态结构 | 蛋白质有柔性 | 分子动力学模拟 |

## 相关概念

- [[概念/ai-for-science|AI for Science]] — AI 驱动科学发现
- [[概念/crystal-lattice|Crystal Lattice]] — 晶体点阵
- [[概念/graph-neural-networks|GNN]] — 图神经网络

> 💡 AlphaFold 解决了“蛋白质折叠问题”，但“蛋白质设计问题”才刚刚开始——AI 正在从“读懂”蛋白质走向“创造”蛋白质。

## 配置示例

```python
# 使用 ESMFold 预测蛋白质结构
import esm

model = esm.pretrained.esmfold_v1()
model.eval()

# 输入氨基酸序列
sequence = "MKTVRQERLKSIVRILERSKEPVSGAQ"

# 预测结构
with torch.no_grad():
    output = model.infer_pdb(sequence)

# 保存 PDB 文件
with open("prediction.pdb", "w") as f:
    f.write(output)
```

## 版本兼容性

| 工具 | 版本 | 状态 |
|------|------|------|
| AlphaFold | 3.0+ | GA |
| ESMFold | 1.0+ | GA |
| ColabFold | 1.5+ | GA |
| OpenFold | 1.0+ | GA |
| RFdiffusion | 1.1+ | 研究 |

## 生产检查清单

1. 确认输入序列质量和长度
2. 选择合适的预测工具（精度 vs 速度）
3. 检查 pLDDT 置信度分数
4. 对低置信度区域进行实验验证
5. 记录预测参数和版本
6. 建立蛋白质结构数据库
7. 配置 GPU 资源（AlphaFold 需要大量 GPU）
8. 定期更新序列数据库

## 总结

蛋白质折叠是 AI for Science 的里程碑应用。AlphaFold 2 解决了 50 年来的结构预测难题，AlphaFold 3 扩展到复合物预测，ESMFold 提供快速单序列预测。

> 💡 蛋白质折叠的核心价值是将结构生物学从“实验科学”转变为“计算科学”——预测一个结构从几个月缩短到几分钟。

## 学习资源

| 资源 | 类型 | 说明 |
|------|------|------|
| AlphaFold 论文 | 论文 | Nature 2021 |
| AlphaFold DB | 数据库 | 2亿+蛋白质结构 |
| ESM 论文 | 论文 | Meta 蛋白质语言模型 |
| ColabFold | 工具 | 免费云端预测 |
| PyMOL | 工具 | 结构可视化 |

## 常用命令

| 命令 | 说明 |
|------|------|
| `colabfold_batch input.fasta output/` | ColabFold 预测 |
| `python run_alphafold.py --fasta_paths=input.fasta` | AlphaFold 预测 |
| `pip install fair-esm` | 安装 ESM |
| `pymol prediction.pdb` | 可视化结构 |

## 总结

蛋白质折叠是 AI for Science 的里程碑应用。AlphaFold 2 解决了 50 年来的结构预测难题，AlphaFold 3 扩展到复合物预测，ESMFold 提供快速单序列预测。AI 正在从“读懂”蛋白质走向“创造”蛋白质。

> 💡 蛋白质折叠的核心价值是将结构生物学从“实验科学”转变为“计算科学”——预测一个结构从几个月缩短到几分钟。

## 2026 蛋白质折叠生态

| 工具/模型 | 说明 | 状态 |
|------|------|------|
| **AlphaFold 3** | 蛋白质/核酸/小分子复合物预测 | GA |
| **ESMFold** | Meta 单序列快速折叠 | GA |
| **RFdiffusion** | 生成式蛋白质设计 | 研究 |
| **ColabFold** | 批量预测平台 | GA |

## 生产最佳实践

1. **模型选择**：高精度用 AlphaFold 3，快速筛选用 ESMFold
2. **置信度评估**：关注 pLDDT 分数，低于 70 需谨慎
3. **实验验证**：计算结果必须经实验确认
4. **批量预测**：使用 ColabFold 处理大规模序列
5. **数据库查询**：先查 AlphaFold DB 是否已有结果

## 相关概念

- [[概念/ai-for-science|AI for Science]] — AI 驱动科学发现
- [[概念/crystal-lattice|Crystal Lattice]] — 晶体点阵
- [[概念/graph-neural-networks|GNN]] — 图神经网络
