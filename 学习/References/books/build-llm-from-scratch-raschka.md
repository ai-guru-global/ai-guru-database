---
title: "Build a Large Language Model (From Scratch)"
category: "-references-books"
tags:
  - book
  - learning-resource
  - llm
  - pytorch
  - gpt
  - sebastian-raschka
  - manning
  - from-scratch
  - attention
  - tokenization
  - pretraining
  - fine-tuning
summary: "Sebastian Raschka 从零用 PyTorch 逐层实现 GPT 的实战教程，拆解分词、注意力、训练、加载 GPT-2 权重到微调的全流程，是理解 LLM 内部运作机制的最佳拆解式教材。"
sources:
  - "https://www.manning.com/books/build-a-large-language-model-from-scratch"
created: 2026-06-12
updated: 2026-07-23
lifecycle: reviewed
tier: supporting
aliases:
  - "Build Llm From Scratch Raschka"
  - "build llm from scratch raschka"

---
# Build a Large Language Model (From Scratch)

> **一句话理解**: Sebastian Raschka（bestselling ML 作者）带你用 PyTorch 从零逐行实现一个 GPT，是理解 LLM 内部运作机制的最佳"拆解式"教程——从 Token 到微调，每一步都有可运行代码。

## 书籍概述

### 作者背景

**Sebastian Raschka** 是机器学习教育领域最具影响力的作者之一。他的前作《Python Machine Learning》累计销量超十万册，被翻译成多国语言。Raschka 拥有密歇根理工大学博士学位，研究方向聚焦深度学习与机器学习，尤其擅长把复杂的数学与工程问题用通俗语言讲透。他长期在 Substack（Ahead of AI）和 GitHub（rasbt）上发布高质量技术文章，是开源社区的高产贡献者。他的写作风格以"代码先行、逐行讲解、可视化辅助"著称，这种风格在本书中体现得淋漓尽致。

### 出版信息

| 属性 | 说明 |
|------|------|
| **书名** | Build a Large Language Model (From Scratch) |
| **作者** | Sebastian Raschka |
| **出版社** | Manning（2024） |
| **页数** | 约 400 页 |
| **难度** | ⭐⭐⭐（中级→中高级） |
| **代码语言** | Python（PyTorch） |
| **GitHub** | [rasbt/LLMs-from-scratch](https://github.com/rasbt/LLMs-from-scratch) |
| **链接** | [Manning](https://www.manning.com/books/build-a-large-language-language-model-from-scratch) |

### 本书定位

本书是 **"理解 LLM 原理"** 的标杆之作：

- **不是**讲如何调用 OpenAI API 的书
- **而是**讲"LLM 内部到底在做什么"的拆解式教程
- 核心理念：**只有亲手实现一遍，才能真正理解**

在知识库的书籍谱系中：
- 上承 [[nlp-with-transformers]]（高层抽象的 Transformer 应用）
- 平行 [[hands-on-llms-alammar]]（图解式 LLM 教程，互补）
- 是 [[大模型/LLM_Fundamentals]] 的**深度实践配套**

## 核心内容

全书 7 章，每章在前一章代码基础上递进构建，最终得到一个可生成文本的完整 GPT。

### Ch 1: 理解大型语言模型

- **GPT 发展史**: 从 GPT-1（2018）到 GPT-4，架构演进与规模扩张
- **本书目标**: 用约 400 行 PyTorch 代码实现一个可用的 GPT，并加载 GPT-2 权重
- **代码 vs 理论的平衡**: 本书坚持"先写代码再讲原理"，避免抽象数学
- **学习路径**: 分词 → 注意力 → Transformer → 预训练 → 微调

### Ch 2: 处理文本数据

- **分词（Tokenization）**:
  - 词级 vs 字符级 vs 子词（Subword）的权衡
  - **Byte-Pair Encoding (BPE)**: GPT 系列使用的分词算法
    - 从字符级开始，迭代合并最高频的相邻对
    - 词表构建、特殊 Token（`<|endoftext|>`）
- **滑动窗口数据集（Sliding Window）**:
  - 把长文本切成 `(input, target)` 对
  - `input` = 前 N 个 Token，`target` = 下一个 Token（自回归目标）
- **Token Embedding**:
  - 将 Token ID 映射为稠密向量（Embedding 矩阵）
  - **位置嵌入（Positional Embedding）**: 编码 Token 的位置信息
- **数据加载器**: PyTorch Dataset / DataLoader 的封装

### Ch 3: 编码注意力机制（Attention）

本章是全书的核心难点，Raschka 采用"三层递进"讲法：

- **第一层: 简化版自注意力**:
  - 用点积衡量 Token 间相关性
  - Attention 权重 = softmax(Q·K^T / √d)
  - 输出 = 权重 × Value 的加权和
- **第二层: 可训练的自注意力**:
  - 引入 Q/K/V 三个可学习投影矩阵
  - 因果掩码（Causal Mask）: 防止看到未来 Token
- **第三层: 多头注意力（Multi-Head Attention）**:
  - 多组 Q/K/V 并行计算
  - 拼接后线性投影
  - 为什么多头有效：不同头关注不同类型关系

```python
# Raschka 的多头注意力核心（简化示意）
class MultiHeadAttention(nn.Module):
    def __init__(self, d_in, d_out, num_heads):
        self.heads = nn.ModuleList([Head(d_in, d_out) for _ in range(num_heads)])
    def forward(self, x):
        return torch.cat([h(x) for h in self.heads], dim=-1)
```

### Ch 4: 从零实现 GPT 模型

- **组件实现**:
  - **LayerNorm**: 逐位置归一化，稳定训练
  - **GELU**: 比 ReLU 更平滑的激活函数
  - **Feed Forward Network (FFN)**: 两层 MLP，扩展维度 4 倍
  - **残差连接（Residual Connection）**: 缓解梯度消失
  - **Transformer Block**: LayerNorm → Attention → 残差 → LayerNorm → FFN → 残差
- **完整 GPT 架构**:
  - Embedding 层 → N × Transformer Block → LayerNorm → Linear Head
- **模型规模**: 实现的是 GPT-2 small（124M 参数），可扩展到 medium/large

### Ch 5: 在无标注数据上预训练

- **训练数据**: 使用公开文本语料（如 The Verdict 短文 / OpenWebText 子集）
- **损失函数**: 交叉熵损失（预测下一个 Token 的概率分布）
- **训练循环**:
  - 前向传播 → 计算 Loss → 反向传播 → 优化器更新（AdamW）
- **学习率调度**: Warmup + Cosine Decay
- **训练监控**: Loss 曲线、生成样本质量的人工观察
- **加载 GPT-2 预训练权重**: 把 OpenAI 发布的 GPT-2 权重加载到自己的实现中，验证正确性

### Ch 6: 微调用于文本分类

- **任务**: 情感分类（如垃圾邮件检测）
- **微调策略**:
  - 冻结大部分层，只训练最后的分类头
  - 用最后一个 Token 的输出作为整句表示
- **与全量微调的权衡**: 计算成本 vs 准确率

### Ch 7: 微调用于指令跟随（Instruction Fine-tuning）

- **指令数据集**: `(instruction, input, output)` 三元组
- **ChatGPT 风格微调**: 让模型学会"按指令行事"
- **数据格式化**: Alpaca / ShareGPT 格式
- **生成式评估**: 检查模型是否遵循指令、输出格式是否正确
- **与 RLHF 的衔接**: 本书止步于 SFT（监督微调），RLHF/DPO 是后续方向

## 关键概念与公式

### 自注意力计算

```
Attention(Q, K, V) = softmax(Q·K^T / √d_k) · V

直觉:
- Q (Query): "我在找什么"
- K (Key): "我能提供什么"
- V (Value): "我实际的内容"
- 点积 Q·K^T: 相关性打分
- softmax: 归一化为权重
- 乘以 V: 按权重加权求和
```

### 因果掩码（Causal Masking）

```
对于序列 [t1, t2, t3, t4]:
掩码矩阵（上三角置 -inf）:
     t1   t2   t3   t4
t1 [  0  -inf -inf -inf ]
t2 [  0    0   -inf -inf ]
t3 [  0    0    0   -inf ]
t4 [  0    0    0    0  ]

作用: 训练时让每个位置只能看到自己和之前的 Token（自回归）
```

### BPE 分词示例

```
原文: "lower"
字符级: ['l', 'o', 'w', 'e', 'r']
合并后: ['low', 'er']（'low' 和 'er' 是高频子词）
最终: [Token ID 1001, Token ID 802]

优势: 平衡词表大小和序列长度，能处理未登录词
```

### GPT 参数量计算

```
GPT-2 small (124M):
- Embedding: 50257 (词表) × 768 (维度) ≈ 38.6M
- 12 层 Transformer × (4 × 768² + 2 × 768×3072) ≈ 85M
- 总计 ≈ 124M

直觉: 大部分参数在 Embedding 和 FFN，注意力只占小部分
```

## 知识映射（本书概念在本知识库的位置）

| 本书章节 | 本书概念 | 知识库主题 | 关联说明 |
|----------|----------|------------|----------|
| Ch 1 LLM 概览 | GPT 发展史 | [[大模型/LLM_Fundamentals]] | LLM 基础 |
| Ch 2 文本处理 | BPE 分词 | [[大模型/LLM_Fundamentals]] | Tokenizer |
| Ch 3 注意力 | Self/Multi-Head Attention | [[深度学习/]] | 注意力机制 |
| Ch 4 GPT 实现 | Transformer Block | [[大模型/LLM_Fundamentals]] | 架构实现 |
| Ch 5 预训练 | 训练循环、损失 | [[模型训练/]] | 预训练流程 |
| Ch 6-7 微调 | SFT 分类/指令 | [[大模型/Fine_tuning_Techniques/GenAI_L18_Fine_Tuning_LLMs]] | 微调技术 |
| 全书 | 从零实现 | [[学习/References/Papers/Attention_Is_All_You_Need_Reading]] | Transformer 论文导读 |

## 适合人群

| 角色 | 阅读重点 | 收益 |
|------|----------|------|
| **想理解 LLM 原理的工程师** | 全书 | 彻底打破 LLM 黑盒 |
| **ML 研究者** | Ch 3, 4, 5 | 复现与改进架构 |
| **LLM 应用工程师** | Ch 2, 6, 7 | 理解 Token、微调原理 |
| **面试准备者** | Ch 3, 4, 5 | 手撕 Attention 是高频考点 |
| **教育者** | 全书 | 最佳 LLM 教学素材 |

### 前置知识

- **必备**: Python、PyTorch 基础（张量、nn.Module、训练循环）
- **强烈建议**: 了解神经网络基础（反向传播、梯度下降）
- **加分**: 读过 [[nlp-with-transformers]] 或 [[hands-on-llms-alammar]] 建立概念

## 对比同类书

| 维度 | 本书（From Scratch） | [[nlp-with-transformers]] | [[hands-on-llms-alammar]] |
|------|---------------------|---------------------------|----------------------------|
| **方法** | 从零实现（代码先行） | 用 Hugging Face 库 | 图解 + Notebook |
| **深度** | 最深（逐行代码） | 中（API 级） | 中（概念 + 可视化） |
| **架构范围** | 仅 decoder-only GPT | 编码器/解码器/seq2seq | 全 LLM 生态 |
| **适合** | 想理解底层 | 想快速应用 | 想直观理解 |
| **互补关系** | 深度实现 | 应用层 | 概念层 |

三者最佳组合: 先 [[hands-on-llms-alammar]] 建立直觉 → [[nlp-with-transformers]] 学应用 → 本书深挖实现。

## 推荐阅读路径

### 路径 A: 顺序精读（4-6 周，强烈推荐）

1. **Week 1**: Ch 1-2（概念 + 分词）
2. **Week 2**: Ch 3（注意力，最难一章，可反复读）
3. **Week 3**: Ch 4（拼装 GPT）
4. **Week 4**: Ch 5（预训练 + 加载权重）
5. **Week 5-6**: Ch 6-7（微调实战）

### 路径 B: 配合论文

1. 读 [[学习/References/Papers/Attention_Is_All_You_Need_Reading]] 理解原始架构
2. 本书 Ch 3-4 实现一遍
3. 读 [[学习/References/Papers/GPT3_Reading]] 理解规模化

### 路径 C: 面试速通

- 重点: Ch 3（Attention 手推）+ Ch 4（GPT 架构）+ Ch 5（训练细节）
- 配合 GitHub 代码复习

## 亮点与局限

### 亮点

- **彻底拆解黑盒**: 400 行代码实现完整 GPT，无任何抽象层
- **代码清晰**: Raschka 的代码风格极简、可读性强，GitHub 持续维护
- **讲解通俗**: 复杂概念（如注意力）用三层递进讲透，零数学背景也能跟上
- **可验证**: 加载 GPT-2 权重后能生成连贯文本，证明实现正确

### 局限

- **聚焦 decoder-only**: 不讲 BERT（编码器）和 T5（seq2seq）
- **实现小型 GPT-2**: 非生产级大模型，预训练/分布式训练未覆盖
- **需 PyTorch 基础**: 纯新手可能卡在 PyTorch 语法
- **不含 RLHF**: 止步于 SFT，对齐技术需另找资料

## 延伸阅读

- [[学习/References/books/nlp-with-transformers|NLP with Transformers]] — 高层抽象互补
- [[学习/References/books/hands-on-llms-alammar|Hands-On LLMs]] — 图解式概念互补
- [[学习/References/Papers/Attention_Is_All_You_Need_Reading|Attention Is All You Need 导读]] — 架构源头
- [[学习/References/Papers/GPT3_Reading|GPT-3 论文导读]] — 规模化方向
- [[大模型/LLM_Fundamentals]] — 知识库 LLM 基础章节
- [[深度学习/]] — 神经网络基础
- [[学习/guides/ai_engineering_roadmap_2026|AI 工程路线图 2026]]

> **关联**: → [[学习/guides/ai_engineering_roadmap_2026|AI 工程路线图]] | [[大模型/LLM_Fundamentals]] | [[深度学习/]] | [[学习/References/Papers/]]
