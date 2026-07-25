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

全书 7 章，每章在前一章代码基础上递进构建，最终得到一个可生成文本的完整 GPT。以下是逐章详解。

### 各章代码递进关系

本书最大特色是"代码像搭积木一样层层叠加"。理解这个递进结构至关重要：

```
Ch 2: 数据处理        → 得到 (input, target) Token 对
Ch 3: 注意力机制      → MultiHeadAttention 模块
Ch 4: 拼装 GPT        → 完整 GPTModel 类
Ch 5: 预训练          → 训练循环 + 加载 GPT-2 权重
Ch 6: 分类微调        → 加分类头，微调
Ch 7: 指令微调        → 改造为 ChatGPT 风格
```

**关键**: 不能跳读——每章代码依赖前一章。建议建立 `llm/` 包目录，逐章添加模块。

### Ch 2 详解: 文本数据处理的工程细节

**BPE 分词的完整实现要点**（Raschka 从零实现而非调库）:

1. **构建词表**: 从训练语料统计相邻 Token 对频率
2. **迭代合并**: 每轮合并最高频对，直到达到目标词表大小
3. **编码**: 新文本按学到的合并规则切分
4. **特殊 Token**: `<|endoftext|>` 标记文档边界

**滑动窗口数据集的注意点**:
- `stride` 决定样本重叠程度（stride=1 时样本最多但冗余）
- batch 维度、序列维度、特征维度的对齐
- 动态 padding vs 固定长度

**Embedding 层的本质**:
- 是一个 `nn.Embedding(vocab_size, dim)` 查找表
- 反向传播时只更新被查到的行
- Token Embedding + Positional Embedding 相加（不是拼接）

### Ch 3 详解: 注意力机制的三层递进教学

这是全书最难也最精华的章节。Raschka 用三层递进讲法：

**第一层 — 简化注意力（无参数）**:
```python
# 用原始 Token Embedding 直接算注意力
attn_scores = inputs @ inputs.T  # 词与词的点积
attn_weights = softmax(attn_scores)
context_vec = attn_weights @ inputs
```
目的: 让读者先理解"加权求和"的本质。

**第二层 — 引入 Q/K/V 可学习参数**:
```python
Q = inputs @ W_Q  # 投影到 Query 空间
K = inputs @ W_K
V = inputs @ W_V
attn = softmax(Q @ K.T / sqrt(d_k)) @ V
```
目的: 引入可训练性，让模型学"该关注谁"。

**第三层 — 因果掩码 + 多头**:
```python
# 因果掩码：上三角置 -inf
mask = torch.triu(torch.ones(n, n), diagonal=1).bool()
attn_scores.masked_fill_(mask, -inf)
# 多头：复制多组 Q/K/V 并行计算
```
目的: 实现 GPT 真正使用的注意力。

**为什么这样教有效**: 每层只增加一个概念复杂度，读者不会一步面对完整的 Q/K/V + 掩码 + 多头。

### Ch 4 详解: GPT 组件的实现要点

**LayerNorm vs BatchNorm**:
- BatchNorm: 跨样本归一化（适合 CNN）
- LayerNorm: 跨特征归一化（适合序列，因为序列长度可变）

**GELU vs ReLU**:
```python
# GELU 比 ReLU 更平滑，在零点附近可微
gelu(x) = 0.5 * x * (1 + tanh(sqrt(2/pi) * (x + 0.044715 * x^3)))
```

**残差连接（Residual）的作用**:
- 缓解梯度消失（梯度可直接流过 shortcut）
- 让深层网络可训练（源自 ResNet，详见 [[学习/References/Papers/ResNet_Reading]]）

**TransformerBlock 的完整数据流**:
```
x → LayerNorm → MultiHeadAttention → + x (残差) → LayerNorm → FFN → + x → 输出
```

### Ch 5 详解: 预训练的关键工程

**损失函数**: 交叉熵，预测下一个 Token 的概率分布
```python
loss = -sum(log(model(input)[i, target[i]]) for i in range(seq_len))
```

**AdamW 优化器**: Adam + 权重衰减解耦，是 LLM 训练标准选择

**学习率调度**: Warmup（前期小学习率）+ Cosine Decay（后期衰减），防止训练崩溃

**加载 GPT-2 权重的验证**:
- 从 OpenAI 发布的权重文件读取参数
- 逐层映射到自己实现的模型
- 生成文本验证正确性（如果实现正确，应生成连贯英文）

### Ch 6-7 详解: 微调的两种场景

**分类微调（Ch 6）的关键改动**:
- 冻结大部分 Transformer 层（只训练最后一两层 + 分类头）
- 用最后一个 Token 的输出作为整句表示
- 接一个线性分类头输出类别概率

**指令微调（Ch 7）的数据格式**:
```
### Instruction: 判断以下评论是正面还是负面
### Input: 这个产品太棒了！
### Response: 正面
```
这种 Alpaca 格式让模型学会"按指令行事"，是 ChatGPT 的 SFT 阶段基础。



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

### 动手实验清单

读完本书后，建议完成以下验证性实验，巩固理解：

| 实验 | 章节 | 目标 | 验证标准 |
|------|------|------|---------|
| 实现 BPE 分词 | Ch 2 | 理解 Tokenizer | 能正确切分新词 |
| 手推注意力 | Ch 3 | 理解 Q/K/V | 输出与公式一致 |
| 拼装 GPT | Ch 4 | 理解架构 | 模型能前向传播 |
| 加载 GPT-2 权重 | Ch 5 | 验证正确性 | 生成连贯英文 |
| 分类微调 | Ch 6 | 掌握微调 | 分类准确率合理 |
| 指令微调 | Ch 7 | 掌握 SFT | 能跟随简单指令 |

### 常见踩坑与调试

本书代码虽清晰，但读者实践中常见以下问题：

| 问题 | 原因 | 解决 |
|------|------|------|
| 形状不匹配（shape mismatch） | 维度对齐错误 | 检查 batch/seq/dim 维度 |
| 生成乱码 | 因果掩码未正确应用 | 检查 mask 的上三角设置 |
| 训练不收敛 | 学习率过大/过小 | 用 Warmup + 调小学习率 |
| 加载权重失败 | 参数名映射错 | 对照 OpenAI 权重名逐层核对 |
| 显存不足 | batch/序列太长 | 减小 batch 或用梯度累积 |

- [[学习/References/books/nlp-with-transformers|NLP with Transformers]] — 高层抽象互补
- [[学习/References/books/hands-on-llms-alammar|Hands-On LLMs]] — 图解式概念互补
- [[学习/References/Papers/Attention_Is_All_You_Need_Reading|Attention Is All You Need 导读]] — 架构源头
- [[学习/References/Papers/GPT3_Reading|GPT-3 论文导读]] — 规模化方向
- [[大模型/LLM_Fundamentals]] — 知识库 LLM 基础章节
- [[深度学习/]] — 神经网络基础
- [[学习/guides/ai_engineering_roadmap_2026|AI 工程路线图 2026]]

> **关联**: → [[学习/guides/ai_engineering_roadmap_2026|AI 工程路线图]] | [[大模型/LLM_Fundamentals]] | [[深度学习/]] | [[学习/References/Papers/]]
