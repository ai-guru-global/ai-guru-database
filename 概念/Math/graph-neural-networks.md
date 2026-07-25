---
title: "图神经网络 (Graph Neural Networks)"
category: -concepts
tags: ["deep-learning", "GNN", "graph-neural-networks", "GCN", "GAT", "message-passing", "molecular"]
relationships:
  - target: "概念/neural-networks"
    type: builds_on
  - target: "概念/transformer-architecture"
    type: related_to
  - target: "概念/ai-for-science"
    type: enables
sources:
  - 03_深度学习/05_Graph_Neural_Networks
summary: "图神经网络处理图结构数据（社交网络、分子、知识图谱），核心思想是消息传递：节点聚合邻居信息并更新自身表示。主要变体包括 GCN/GAT/GraphSAGE/GIN/Graph Transformer。"
provenance:
  extracted: 0.45
  inferred: 0.45
  ambiguous: 0.10
base_confidence: 0.88
lifecycle: reviewed
tier: core
created: 2026-06-04
updated: 2026-07-21
aliases:
  - "Graph Neural Networks"
  - "graph neural networks"

---
# 图神经网络 (Graph Neural Networks)

> 深度学习三大架构之一（CNN/RNN/GNN），处理万物之间的连接。

---

## 1. 定义

**图神经网络**（GNN）是一类在图结构数据上进行学习的深度学习模型。核心思想：**消息传递**（Message Passing）——每个节点通过聚合邻居信息并更新自身表示，逐层捕获多跳结构信息。

> 图是自然界最通用的数据结构：社交网络、分子结构、知识图谱、交通网络、推荐系统、代码 AST……几乎所有关系型数据都可以建模为图。

---

## 2. 消息传递框架

$$h_i^{(l+1)} = \text{UPDATE}\left(h_i^{(l)}, \text{AGGREGATE}\left(\{h_j^{(l)} : j \in \mathcal{N}(i)\}\right)\right)$$

| 步骤 | 操作 | 说明 |
|------|------|------|
| **消息生成** | \(m_{ij} = \text{MSG}(h_i, h_j, e_{ij})\) | 边上的消息计算 |
| **聚合** | \(m_i = \text{AGG}(\{m_{ij}\})\) | 求和/均值/最大/注意力 |
| **更新** | \(h_i' = \text{UPDATE}(h_i, m_i)\) | 结合自状态和聚合消息 |

---

## 3. 主要变体对比

| 模型 | 聚合方式 | 特点 | 代表应用 |
|------|----------|------|----------|
| **GCN** (Kipf & Welling, 2017) | 归一化求和 | 谱域卷积一阶近似，简洁高效 | 节点分类、半监督学习 |
| **GAT** (Veličković, 2018) | 注意力加权求和 | 学习邻居权重，异构图更强 | 社交网络、引用网络 |
| **GraphSAGE** (Hamilton, 2017) | 采样 + 聚合 | 归纳学习，支持大规模图 | 推荐系统、Pinterest PinSAGE |
| **GIN** (Xu, 2019) | MLP(求和) | 表达力达到 WL 测试上界 | 图分类（分子性质预测） |
| **GatedGCN** | GRU 更新 | 门控机制，长程信息保留好 | 分子图、蛋白质 |
| **Graph Transformer** | 全局注意力 | 突破局部聚合限制 | 分子生成、长程依赖 |

### GCN 关键公式

$$H^{(l+1)} = \sigma\left(\tilde{D}^{-\frac{1}{2}}\tilde{A}\tilde{D}^{-\frac{1}{2}}H^{(l)}W^{(l)}\right)$$

其中 \(\tilde{A} = A + I\)（添加自环），\(\tilde{D}\) 为度矩阵。

---

## 4. 表达能力：WL 测试

Weisfeiler-Lehman (WL) 图同构测试是 GNN 表达能力的理论上限：

| 测试 | GNN 对应 | 区分能力 |
|------|----------|----------|
| **1-WL** | GIN（求和聚合） | 不能区分正则图 |
| **3-WL** | 高阶 GNN | 更强但计算代价大 |
| **k-WL** | k 阶 GNN | 理论上可区分所有图，但不可扩展 |

**超越 WL**：Graph Transformer 通过全局注意力 + 位置编码可超越 1-WL。

---

## 5. 应用场景矩阵

| 任务级别 | 任务 | 应用 |
|----------|------|------|
| **节点级** | 节点分类 | 论文主题分类、用户画像 |
| **节点级** | 节点表示学习 | 社交网络嵌入 |
| **边级** | 链路预测 | 推荐、药物-靶点交互 |
| **图级** | 图分类 | 分子性质预测（毒性/药效） |
| **图级** | 图生成 | 分子设计、材料发现 |
| **图级** | 图匹配 | 代码相似度、分子对齐 |

### 代表性应用

| 领域 | 系统 | GNN 作用 |
|------|------|----------|
| **药物发现** | AlphaFold 2/3 | 蛋白质结构预测（图注意力） |
| **推荐系统** | PinSAGE (Pinterest) | 30亿节点图上的实时推荐 |
| **知识图谱** | R-GCN | 关系推理、知识补全 |
| **交通预测** | DCRNN/STGCN | 路网交通流量预测 |
| **代码分析** | GGNN | 漏洞检测、程序修复 |
| **材料科学** | GNoMe | 发现 220 万新晶体结构 |

---

## 6. 大规模图训练

| 策略 | 方法 | 说明 |
|------|------|------|
| **节点采样** | GraphSAGE | 每层采样固定数量邻居 |
| **层采样** | Layer-wise sampling | 每层独立采样子图 |
| **子图采样** | Cluster-GCN | 将图切分为子图训练 |
| **全图训练** | 分布式 (DGL/PyG) | GPU 集群上全图训练 |

---

## 7. 主要框架

| 框架 | 后端 | 特色 |
|------|------|------|
| **PyTorch Geometric (PyG)** | PyTorch | 最流行，API 友好 |
| **DGL** | PyTorch/MXNet/TF | 大规模图，分布式训练 |
| **GraphGym** | PyTorch | GNN 设计空间研究 |
| **Jraph** | JAX | JAX 生态的 GNN |

---

## 8. 局限与开放问题

1. **Over-smoothing**：层数过多导致所有节点表示趋同（一般 2-4 层最优）
2. **异质图**：真实图含多种节点/边类型，需要异质 GNN（R-GCN, HAN）
3. **动态图**：图结构随时间变化，需时空 GNN（TGN, DySAT）
4. **可解释性**：GNN 决策过程不透明，需 GNNExplainer, SubgraphX 等
5. **长程依赖**：消息传递的局部性限制，Graph Transformer 是解决方向

---

## Related

- [[03_深度学习/05_Graph_Neural_Networks/README]] — 图神经网络深度解析
- [[概念/neural-networks]] — 神经网络基础
- [[概念/transformer-architecture]] — Transformer（Graph Transformer 基础）
- [[概念/ai-for-science]] — AI for Science（GNN 在分子/材料中的核心应用）

---

## 2026 图神经网络生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **GCN** | 图卷积网络 | GA |
| **GAT** | 图注意力网络 | GA |
| **GraphSAGE** | 归纳式图学习 | GA |
| **PyG** | PyTorch Geometric 图学习库 | GA |
| **Graph Transformer** | 图 Transformer | 研究 |

## 生产最佳实践

1. **图数据建模**：关系数据用 GNN 建模
2. **PyG 框架**：图学习用 PyTorch Geometric
3. **分子/材料**：AI for Science 用 GNN
4. **推荐系统**：图推荐用 GNN
5. **与 Transformer 对比**：Graph Transformer 是研究方向

## 2026 GNN 生态

| 模型 | 类型 | 特点 | 状态 |
|------|------|------|------|
| **GCN** | 谱方法 | 经典图卷积 | GA |
| **GAT** | 注意力 | 节点重要性 | GA |
| **GraphSAGE** | 采样聚合 | 大规模图 | GA |
| **GIN** | 同构 | 图分类 | GA |
| **Graph Transformer** | 注意力 | 全局交互 | 研究 |

## GNN 架构

```
GNN 消息传递机制:
节点 v 的更新:
1. 聚合 (Aggregate): 收集邻居消息
   m_v = AGG({h_u : u ∈ N(v)})

2. 更新 (Update): 更新节点表示
   h_v' = UPDATE(h_v, m_v)

3. 读取 (Readout): 图级表示
   h_G = READOUT({h_v : v ∈ G})
```

## GNN 代码示例

```python
import torch
import torch_geometric
from torch_geometric.nn import GCNConv, GATConv

class GNN(torch.nn.Module):
    def __init__(self, in_channels, hidden_channels, out_channels):
        super().__init__()
        self.conv1 = GCNConv(in_channels, hidden_channels)
        self.conv2 = GCNConv(hidden_channels, out_channels)
    
    def forward(self, x, edge_index):
        x = self.conv1(x, edge_index).relu()
        x = self.conv2(x, edge_index)
        return x

# 训练
model = GNN(128, 64, 7)
optimizer = torch.optim.Adam(model.parameters(), lr=0.01)
```

## 延伸阅读

- [[概念/Math/neural-networks|神经网络]] — 网络基础
- [[概念/Math/recommendation-systems|推荐系统]] — 图推荐
- [[概念/Math/linear-algebra|线性代数]] — 矩阵运算
- [[概念/Vision/computer-vision|计算机视觉]] — 3D 视觉

> ℹ️ GNN 是处理图结构数据的标准方法，社交/推荐/分子是主要应用。
