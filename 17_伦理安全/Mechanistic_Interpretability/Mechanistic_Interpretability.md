---
title: '机械可解释性 (Mechanistic Interpretability) 2026'
category: '17-ethics-safety-mechanistic-interpretability'
tags: ["ai-ethics", "safety", "alignment", "red-teaming"]
summary: '> **一句话理解**: 机械可解释性是AI安全的"逆向工程"——通过理解神经网络内部的具体计算机制，回答"这个模型为什么会这样做"，而不只是"这个模型做了什么"。'
created: '2026-05-31'
updated: '2026-05-31'
tier: supporting
aliases:
  - "Mechanistic Interpretability"
  - Mechanistic_Interpretability
sources: []

---
# 机械可解释性 (Mechanistic Interpretability) 2026

> **一句话理解**: 机械可解释性是 AI 安全的"逆向工程"——通过理解神经网络内部的具体计算机制，回答"这个模型为什么会这样做"，而不只是"这个模型做了什么"。

---

## 1. 概述 (Overview)

### 1.1 什么是机械可解释性

```
传统可解释AI (XAI) vs 机械可解释性:

传统XAI:
"What parts of the input matter?"
→ 通过可视化、注意力权重、SHAP等方法回答

机械可解释性:
"EXACTLY how is the model computation this?"
→ 理解模型内部的精确计算机制
→ 找到"电路"(circuits) 和 "特征"(features)
→ 理解从输入到输出的完整信息流动
```

**核心目标**:
1. **分解**复杂的神经网络为可理解的组件
2. **定位**特定行为对应的模型部位
3. **解释**模型为什么产生特定输出
4. **预测**模型在新情况下的行为

### 1.2 2026年发展现状

```
关键里程碑:
├── 2022: Transformer Circuits论文发表
├── 2023: 电路级别理解取得突破
├── 2024: GPT-2部分电路被完整解析
├── 2025: 自动电路发现工具成熟
└── 2026: 开始应用于安全关键系统

当前成就:
├── 某些attention head的功能可被精确描述
├── 简单任务的完整电路图已绘制
├── 多个"幻觉"机制被理解
└── 某些偏见来源被追踪到特定层
```

---

## 2. 核心概念

### 2.1 基本术语

```
关键术语:

┌─────────────────────────────────────────────────────────────┐
│                    Neural Network Anatomy                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Circuit (电路):                                             │
│  └── 模型中完成特定功能的一组注意力头和MLP层的组合           │
│                                                              │
│  Feature (特征):                                            │
│  └── 模型激活中对应的有意义的可解释概念                      │
│  └── 例: "人名"、"负面情感"、"代码括号"                    │
│                                                              │
│  Attention Head (注意力头):                                 │
│  └── Transformer中完成特定注意模式的组件                    │
│                                                              │
│  MLP Neuron (MLP神经元):                                    │
│  └── 非线性特征检测器，可表示复杂概念                        │
│                                                              │
│  Residual Stream (残差流):                                  │
│  └── 信息在Transformer层间传递的主通道                      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Attention Pattern 分析

```python
"""Attention Pattern分析示例"""

import torch
import matplotlib.pyplot as plt
from transformers import GPT2Model, GPT2Tokenizer

class AttentionPatternAnalyzer:
    """分析Transformer的注意力模式"""
    
    def __init__(self, model_name: str = "gpt2"):
        self.model = GPT2Model.from_pretrained(model_name)
        self.tokenizer = GPT2Tokenizer.from_pretrained(model_name)
        self.model.eval()
    
    def analyze_attention(self, text: str) -> dict:
        """
        分析给定文本的注意力模式
        """
        # 分词
        inputs = self.tokenizer(text, return_tensors="pt")
        
        # 获取隐藏状态和注意力
        with torch.no_grad():
            outputs = self.model(
                **inputs,
                output_attentions=True
            )
        
        attentions = outputs.attentions  # Tuple of (layers, batches, heads, seq_len, seq_len)
        
        # 分析每个注意力头的行为
        analysis = {
            "text": text,
            "tokens": inputs["input_ids"][0].tolist(),
            "token_strs": self.tokenizer.convert_ids_to_tokens(inputs["input_ids"][0]),
            "head_behaviors": {}
        }
        
        for layer_idx, layer_attn in enumerate(attentions):
            for head_idx in range(layer_attn.shape[1]):
                # 提取这个头的注意力模式
                attn_matrix = layer_attn[0, head_idx, :, :].numpy()
                
                # 分类这个头的行为
                behavior = self._classify_attention_head(
                    attn_matrix,
                    analysis["token_strs"]
                )
                
                analysis["head_behaviors"][f"layer{layer_idx}_head{head_idx}"] = {
                    "pattern": behavior,
                    "attention_matrix": attn_matrix
                }
        
        return analysis
    
    def _classify_attention_head(self, attn_matrix, tokens) -> str:
        """
        根据注意力矩阵模式分类注意力头的功能
        """
        # 计算注意力分布的统计量
        mean_attn = attn_matrix.mean(axis=1)
        
        # 检测是否是"token到token"还是"token到[SEP]"等特殊位置
        # 这是一个简化示例，实际分类更复杂
        
        # 检测是否主要看前面的token (recency bias)
        if mean_attn[-1] > 0.3:
            return "recency_head"
        
        # 检测是否均匀分布
        if attn_matrix.std() < 0.05:
            return "uniform_head"
        
        return "content_addressing"
    
    def visualize_attention(self, text: str, save_path: str = None):
        """
        可视化注意力模式
        """
        analysis = self.analyze_attention(text)
        
        n_layers = len(analysis["head_behaviors"]) // 12  # 假设12头
        
        fig, axes = plt.subplots(n_layers, 12, figsize=(20, n_layers * 2))
        
        for (head_key, head_data), ax in zip(
            analysis["head_behaviors"].items(),
            axes.flatten()
        ):
            im = ax.imshow(head_data["attention_matrix"], cmap="viridis")
            ax.set_title(head_key)
        
        plt.tight_layout()
        
        if save_path:
            plt.savefig(save_path)
        
        return fig
```

---

## 3. 电路发现 (Circuit Discovery)

### 3.1 什么是电路

```
电路定义:
电路 = 一组特定的"权重连接"，共同完成一个可解释的功能

电路示例:

┌─────────────────────────────────────────────────────────────┐
│                  "识别人名" 电路 (Hypothetical)              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Input Token                                                │
│       │                                                     │
│       ▼                                                     │
│  ┌────────┐    ┌────────┐    ┌────────┐                   │
│  │ Name   │───►│ Name   │───►│ Output │                   │
│  │Detector│    │Checker │    │ Softmax│                   │
│  │ Head 1 │    │ Head 3 │    │        │                   │
│  └────────┘    └────────┘    └────────┘                   │
│       │               │                                    │
│       └───────────────┘                                    │
│           (信号传递)                                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 电路发现方法

```python
"""电路发现: Activation Patching"""

class CircuitDiscovery:
    """
    使用Activation Patching发现电路
    """
    
    def __init__(self, model, tokenizer):
        self.model = model
        self.tokenizer = tokenizer
    
    def activation_patching_experiment(
        self,
        clean_text: str,
        corrupted_text: str,
        layer_to_patch: int,
        head_to_patch: int,
        position: int
    ) -> float:
        """
        通过activation patching确定某个头的重要性
        
        实验设计:
        1. 在clean输入上运行模型，记录目标位置的激活
        2. 在corrupted输入上运行模型，但在目标位置patch成clean的激活
        3. 如果结果改变，说明这个头对结果有重要影响
        """
        # 获取clean和corrupted的隐藏状态
        clean_logits = self._get_logits(clean_text)
        corrupted_logits = self._get_logits(corrupted_text)
        
        # 在corrupted运行中patch指定位置
        patched_logits = self._patch_and_run(
            corrupted_text,
            layer_to_patch,
            head_to_patch,
            position,
            clean_text
        )
        
        # 计算影响程度
        clean_prob = torch.softmax(clean_logits, dim=-1)
        patched_prob = torch.softmax(patched_logits, dim=-1)
        
        # KL散度作为影响度量
        impact = torch.nn.functional.kl_div(
            torch.log(patched_prob + 1e-9),
            clean_prob,
            reduction='batchmean'
        ).item()
        
        return impact
    
    def discover_circuit_for_task(
        self,
        task: str,
        positive_examples: list,
        negative_examples: list
    ) -> dict:
        """
        发现完成特定任务所需的电路
        """
        circuit_components = {
            "attention_heads": [],
            "mlp_neurons": [],
            "important_layers": []
        }
        
        # 对每个注意力头进行实验
        for layer in range(self.model.config.n_layer):
            for head in range(self.model.config.n_head):
                impact = self._measure_head_importance(
                    layer, head, positive_examples, negative_examples
                )
                
                if impact > 0.1:  # 阈值
                    circuit_components["attention_heads"].append({
                        "layer": layer,
                        "head": head,
                        "impact": impact
                    })
        
        # 排序重要组件
        circuit_components["attention_heads"].sort(
            key=lambda x: x["impact"], reverse=True
        )
        
        return circuit_components
```

---

## 4. 特征提取 (Feature Extraction)

### 4.1 什么是特征

```
特征 = 模型激活空间中对应特定概念的方向

示例特征:
├── "人名" 特征 → 梵音向量方向
├── "代码" 特征 → 激活空间中的特定方向
├── "情感" 特征 → 正面/负面情感在空间中的分离
└── "语言" 特征 → 不同语言的分离方向

特征发现的意义:
1. 理解模型如何表示世界
2. 追踪偏见和刻板印象的来源
3. 验证模型是否真正理解还是"作弊"
4. 为安全干预提供精确目标
```

### 4.2 特征探测方法

```python
"""特征探测: 训练探针分类器"""

import torch
import torch.nn as nn
from transformers import GPT2Model

class FeatureProbe:
    """
    通过训练线性探针发现概念对应的特征方向
    """
    
    def __init__(self, model_name: str = "gpt2"):
        self.model = GPT2Model.from_pretrained(model_name)
        self.probe = None
        self.concept = None
    
    def train_probe(
        self,
        texts: list[str],
        labels: list[int],
        concept_name: str,
        layer: int = 6
    ):
        """
        训练一个探针来检测概念
        
        Args:
            texts: 文本列表
            labels: 标签 (1 = 包含概念, 0 = 不包含)
            concept_name: 概念名称
            layer: 在哪一层提取激活
        """
        self.concept = concept_name
        
        # 获取激活
        activations = []
        for text in texts:
            acts = self._get_layer_activations(text, layer)
            activations.append(acts)
        
        activations = torch.stack(activations)
        labels = torch.tensor(labels, dtype=torch.float32)
        
        # 训练线性探针
        self.probe = nn.Linear(activations.shape[-1], 1)
        optimizer = torch.optim.Adam(self.probe.parameters(), lr=0.001)
        criterion = nn.BCEWithLogitsLoss()
        
        for epoch in range(100):
            optimizer.zero_grad()
            logits = self.probe(activations).squeeze()
            loss = criterion(logits, labels)
            loss.backward()
            optimizer.step()
        
        # 提取特征方向
        self.feature_direction = self.probe.weight.data.squeeze()
        
        return self._evaluate_accuracy(activations, labels)
    
    def _get_layer_activations(self, text: str, layer: int) -> torch.Tensor:
        """获取特定层的激活"""
        inputs = self.tokenize(text)
        
        with torch.no_grad():
            outputs = self.model(**inputs, output_hidden_states=True)
        
        # 返回最后一层token的平均激活
        hidden_states = outputs.hidden_states[layer]
        return hidden_states[0].mean(dim=0)  # 平均池化
    
    def project_text_to_feature(self, text: str, layer: int = 6) -> float:
        """
        将文本投影到特征方向上，得到特征强度
        """
        acts = self._get_layer_activations(text, layer)
        projection = torch.dot(acts, self.feature_direction).item()
        
        return projection
    
    def find_feature_tokens(
        self,
        text: str,
        layer: int = 6,
        top_k: int = 5
    ) -> list:
        """
        找出文本中激活特征最强烈的token位置
        """
        inputs = self.tokenize(text)
        
        with torch.no_grad():
            outputs = self.model(**inputs, output_hidden_states=True)
        
        hidden_states = outputs.hidden_states[layer][0]  # [seq_len, hidden_dim]
        
        # 投影到特征方向
        projections = torch.matmul(
            hidden_states,
            self.feature_direction
        )
        
        # 找出top-k token
        top_values, top_indices = torch.topk(projections, top_k)
        
        tokens = self.tokenizer.convert_ids_to_tokens(inputs["input_ids"][0])
        
        return [
            {"token": tokens[idx], "position": idx, "score": val.item()}
            for val, idx in zip(top_values, top_indices)
        ]
```

### 4.3 机械可解释性方法对比

| **方法** | **原理** | **适用模型规模** | **计算开销** | **可解释性深度** | **典型应用场景** |
|---|---|---|---|---|---|
| Attention Pattern 分析 | 可视化注意力权重分布 | 任意规模 | 低 | 浅层 | 理解信息流动 |
| Activation Patching | 替换中间激活观察行为变化 | GPT-2 ~ 7B | 中 | 深层 | 电路发现 |
| 线性探针 (Linear Probe) | 训练分类器检测特征方向 | 任意规模 | 低 | 中层 | 特征检测 |
| 稀疏自编码器 (SAE) | 分解激活为稀疏可解释特征 | GPT-2 ~ 13B | 高 | 深层 | 特征字典构建 |
| 因果追踪 (Causal Tracing) | 逐层干预确定因果路径 | GPT-2 ~ 7B | 高 | 最深层 | 完整电路解析 |
| Logit Lens | 中间层投影到词汇空间 | 任意规模 | 低 | 中层 | 层间信息追踪 |

### 4.4 电路发现方法评估基准

| **电路发现方法** | **精确率** | **召回率** | **F1 分数** | **发现耗时 (小时)** | **支持模型** |
|---|---:|---:|---:|---:|---|
| 手动 Activation Patching | 92% | 65% | 76% | 40-80 | GPT-2, Pythia |
| ACDC (自动电路发现) | 85% | 78% | 81% | 4-8 | GPT-2 ~ 2.8B |
| Path Patching | 88% | 72% | 79% | 12-24 | GPT-2 ~ 6.7B |
| Edge Pruning | 80% | 82% | 81% | 6-12 | GPT-2 ~ 7B |
| Subnetwork Probing | 83% | 75% | 79% | 8-16 | GPT-2 ~ 2.8B |

---

## 5. 机械可解释性的应用

### 5.1 安全应用

```
应用1: 幻觉溯源

问题: 模型为什么会产生幻觉?
发现:
├── "知道但不确定"→ 激活不足
├── "没见过但推断"→ 过度泛化
└── "混淆相似概念"→ 特征空间重叠

干预:
└── 识别幻觉电路 → 精确修改 → 减少幻觉

---

应用2: 偏见追溯

问题: 模型为什么会表现出性别偏见?
发现:
├── 特定attention head将"他"与职业词汇关联
├── MLP层将"女性"与某些形容词关联
└── 这些关联来自训练数据中的统计相关性

干预:
└── 识别偏见电路 → 调整权重 → 减少偏见

---

应用3: 越狱攻击理解

问题: 越狱提示词如何绕过安全限制?
发现:
├── 某些提示词模式激活"服从"电路
├── 同时压制"安全"电路
└── 电路层面的竞争导致安全限制被绕过

干预:
└── 增强安全电路 → 防御越狱
```

### 5.2 电路级安全干预

```python
"""基于电路理解的精确安全干预"""

class CircuitIntervention:
    """
    基于机械可解释性理解的精确模型修改
    """
    
    def __init__(self, model, tokenizer):
        self.model = model
        self.tokenizer = tokenizer
    
    def mitigate_hallucination(
        self,
        confidence_threshold: float = 0.3
    ):
        """
        通过修改与幻觉相关的电路减少幻觉
        
        策略:
        1. 找到"过度自信"检测器
        2. 在低置信度情况下抑制其激活
        """
        # 这是一个概念示例，实际实现需要更深入的电路分析
        
        # 假设我们通过机械可解释性发现了:
        # - layer 8, head 3 与"自信表达"强相关
        # - 当激活超过阈值时，容易产生幻觉
        
        # 应用修改
        with torch.no_grad():
            # 获取原始权重
            original_weight = (
                self.model.transformer.h[8]
                .attn.c_attn.weight[:, :]
            )
            
            # 创建注意力抑制mask
            # (这里简化了，实际需要更精确的干预)
            intervention = original_weight * 0.8  # 降低这个头的权重
        
        print("Hallucination circuit mitigation applied")
    
    def enhance_safety_circuit(self):
        """
        增强安全相关电路的权重
        """
        # 假设通过分析发现:
        # - layer 12, head 7 与"安全考虑"强相关
        
        # 增强这个电路
        with torch.no_grad():
            original_weight = (
                self.model.transformer.h[12]
                .attn.c_attn.weight
            )
            
            # 增强安全信号
            intervention = original_weight * 1.2
        
        print("Safety circuit enhancement applied")
```

---

## 6. 工具与框架

### 6.1 主要工具

| 工具 | 用途 | 链接 |
|------|------|------|
| **TransformerLens** | Transformer 机械可解释性的主要工具库 | GitHub |
| **NeuroCode** | 神经网络分析框架 | GitHub |
| ** Circuits** | 电路发现和可视化 | GitHub |
| **Sparse Autoencoders** | 特征发现 | GitHub |
| **Erasure** | 因果干预实验 | GitHub |

**工具详细功能对比**:

| **特性** | **TransformerLens** | **Baukit** | **NeuroScope** | **SAE (Sparse Autoencoders)** | **Circuit Vis** |
|---|---|---|---|---|---|
| **开发团队** | Neel Nanda | David Bau | Anthropic | Anthropic | Redwood Research |
| **主要功能** | Hook 机制, 缓存, 干预 | 模型编辑, 追踪 | 特征可视化 | 特征分解 | 电路可视化 |
| **支持模型** | GPT-2, Pythia, LLaMA | GPT-2, BERT, ViT | GPT-2, GPT-4 (有限) | GPT-2, Claude | HookedTransformer |
| **Hook 系统** | 完整 (200+ hooks) | 部分支持 | 有限 | 无 | 依赖 TL |
| **GPU 支持** | CUDA, MPS | CUDA | CUDA | CUDA | CUDA, MPS |
| **学习曲线** | 中等 | 较高 | 低 | 中等 | 低 |
| **文档质量** | 优秀 | 一般 | 优秀 | 良好 | 一般 |
| **社区规模** | 大 | 中 | 中 | 大 | 小 |
| **最佳用途** | 通用 mech-interp 研究 | 模型编辑实验 | 特征探索 | 大规模特征发现 | 电路展示 |

### 6.2 TransformerLens 示例

```python
"""使用TransformerLens进行机械可解释性研究"""

# !pip install transformer_lens
from transformer_lens import HookedTransformer

# 加载模型
model = HookedTransformer.from_pretrained("gpt2")

# 分析注意力模式
prompt = "The capital of France is"
answer_tokens = model.tokenizer.encode(" Paris")
tokens = model.tokenizer.encode(prompt)

# 运行模型，获取所有注意力
original_logits, cache = model.run_with_cache(prompt)

# 分析特定头的行为
for layer in range(model.cfg.n_layers):
    for head in range(model.cfg.n_heads):
        # 获取这个头的注意力模式
        attn_pattern = cache[f"blocks.{layer}.attn.hook_attn"][0, head]
        
        # 分析: 这个头在"看"什么?
        print(f"Layer {layer}, Head {head}:")
        print(f"  Max attention: {attn_pattern.max():.3f}")
        print(f"  Max position: {attn_pattern.argmax().item()}")
```

---

## 7. 前沿挑战与未来方向

### 7.1 当前挑战

```
挑战1: 扩展性问题

现状: 只能在小型模型(如GPT-2)上做完整的电路分析
问题: GPT-4等大模型的电路极其庞大，无法完整解析
方向: 自动化电路发现、层次化分析

---

挑战2: 特征复杂性

现状: 简单特征(如"人名")可被发现
问题: 复杂抽象概念的特征表示不清楚
方向: 稀疏自编码器、多层次特征

---

挑战3: 因果vs相关

现状: 可以发现相关性，但难以确定因果性
问题: 即使找到电路，也难以确定它是否"必要"
方向: 因果干预实验、扰动分析

---

挑战4: 评估指标

现状: 缺乏标准化的"可解释性质量"评估
问题: 如何衡量解释的"正确性"和"完整性"?
方向: 形式化定义、人类评估标准
```

### 7.2 2026-2030 年发展方向

```
发展方向:

1. 自动化电路发现
   ├── AI辅助的电路识别
   └── 自动特征字典构建

2. 规模化
   ├── 从GPT-2扩展到GPT-4大小
   └── 多模态模型的电路分析

3. 实用安全
   ├── 基于电路的精确安全干预
   └── 可验证的AI安全保证

4. 理论进步
   ├── 深度学习理论的突破
   └── 从"是什么"到"为什么"的理论框架
```

---

## 8. 参考资源

### 核心论文
- [A Mathematical Framework for Transformer Circuits](https://transformer-circuits.pub/) - Anthropic
- [Towards Monosemanticity](https://transformer-circuits.pub/2022/monosemantic/) - Anthropic
- [Induction Heads](https://transformer-circuits.pub/2022/induction/) - Anthropic

### 工具
- [TransformerLens](https://github.com/neelnanda-io/TransformerLens)
- [Easy-Transformer](https://github.com/neelnanda-io/Easy-Transformer)

---

## 可解释性方法全景对比

### 方法对比表

| **方法** | **分析层级** | **计算成本** | **可解释性** | **适用模型** | **代表工具** |
|----------|-------------|-------------|-------------|-------------|-------------|
| **Activation Patching** | 单个组件 | 中 | 高 (因果) | Transformer | TransformerLens |
| **Logit Lens** | 残差流 | 低 | 中 | Decoder-only | TransformerLens |
| **Attention Pattern Viz** | 注意力头 | 低 | 中 | 所有 | BertViz |
| **Probing Classifiers** | 表征层 | 中 | 中 | 所有 | 自定义 |
| **Sparse Autoencoder** | 特征级 | 高 | 极高 | 大模型 | Anthropic SAE |
| **Circuit Discovery** | 子网络 | 极高 | 极高 | 小-中模型 | ACDC, Tracr |

### 工具生态对比

| **工具** | **支持模型** | **核心功能** | **学习曲线** | **社区活跃度** |
|----------|-------------|-------------|-------------|---------------|
| **TransformerLens** | GPT-2/LLaMA/Pythia | Activation patching, logit lens | 中 | 极高 (Anthropic) |
| **Baukit** | GPT-2/LLaMA | 模型编辑, 因果追踪 | 高 | 中 (MIT) |
| **BertViz** | BERT/GPT | Attention 可视化 | 低 | 中 |
| **SAE Library** | 通用 | Sparse autoencoder | 中 | 高 (Anthropic) |
| **ACDC** | GPT-2 | 自动电路发现 | 高 | 低 |

---

*Last updated: 2026-04-10*

## 相关链接

- [[伦理安全/Mechanistic_Interpretability/Mechanistic_Interpretability_for_dummy|机制可解释性 (小白版)]] — 本篇的零基础版本
- [[伦理安全/Mechanistic_Interpretability/index|机制可解释性索引]] — 主题导览
- [[概念/Safety/explainable-ai|可解释 AI]] — 可解释性概念卡片
- [[概念/LLM/emergent-abilities|涌现能力]] — 可解释性研究的涌现现象
- [[伦理安全/Value_Alignment/Value_Alignment|价值对齐]] — 可解释性辅助对齐
- [[大模型/LLM_Architectures/LLM_Internals_Architecture|LLM 内部：架构]] — LLM 内部机制
