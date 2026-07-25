---
title: Sequence Models
type: index
created: 2026-07-02
updated: 2026-07-21
sources: []
tags: [auto-index]
---

# Sequence Models

序列模型（Sequence Models）— RNN/LSTM、解码策略（decoding strategy）、Beam Search 与文本生成的核心技术。

## 子域简介

本子域聚焦序列建模技术：

- **RNN/LSTM**: 循环神经网络
- **解码策略**: Greedy, Beam Search, Top-k, Top-p
- **文本生成**: 采样与解码技术
- **注意力机制**: 从 Attention 到 Transformer

## 文件导航

| 文件 | 说明 | 适用人群 |
|------|------|----------|
| [[05_大模型/02_Sequence_Models/Sequence_Models|Sequence Models]] | Sequence models knowledge system: RNN, LSTM, GRU to Transformer | NLP engineers / ML researchers |
| [[05_大模型/02_Sequence_Models/Sequence_Models_for_dummy|Sequence Models for dummy]] | Sequence models beginner guide: from word embeddings to attention | beginners / NLP learners |
| [[05_大模型/02_Sequence_Models/Text_Generation_Decoding_Strategies|Text Generation Decoding Strategies]] | Text generation decoding strategies: greedy, beam search, top-k and top-p sampling | LLM engineers / NLP practitioners |

## 核心概念速查

| 概念 | 说明 | 代表技术 |
|------|------|------|
| RNN | 循环神经网络 | 序列建模基础 |
| LSTM | 长短期记忆 | 解决梯度消失 |
| GRU | 门控循环单元 | 简化 LSTM |
| Attention | 注意力机制 | Transformer 基础 |
| Beam Search | 束搜索 | 解码策略 |

## 解码策略对比

| 策略 | 说明 | 优点 | 缺点 |
|------|------|------|------|
| Greedy | 贪心选择 | 快速 | 局部最优 |
| Beam Search | 多候选 | 质量高 | 计算量大 |
| Top-k | 前 k 采样 | 多样性 | k 难调 |
| Top-p | 核采样 | 自适应 | 可能不稳定 |
| Temperature | 温度调节 | 控制随机性 | 需调参 |

## 技术演进时间线

| 时期 | 技术 | 代表 | 特点 |
|------|------|------|------|
| 2014 | Seq2Seq | Sutskever | 编码器-解码器 |
| 2015 | Attention | Bahdanau | 注意力机制 |
| 2017 | Transformer | Vaswani | 自注意力 |
| 2018 | BERT/GPT | Devlin/Radford | 预训练 |
| 2020 | GPT-3 | Brown | 少样本学习 |

## 常见问题

| 问题 | 解答 |
|------|------|
| RNN 还有用吗？ | 特定场景仍有用 |
| Beam Size 选多少？ | 4-8 常用 |
| Top-p 选多少？ | 0.9-0.95 |
| Temperature 作用？ | 控制输出随机性 |

## Related

- [[05_大模型/index|大模型首页]]
- [[05_大模型/04_Transformer_Revolution/index|Transformer Revolution]]
- [[07_模型训练/06_Alignment/index|Alignment]]
- [[概念/sequence-models|序列模型概念]]

## 统计

| 指标 | 数值 |
|------|------|
| 文件数 | 3 |
| 最后更新 | 2026-07-21 |

> 💡 序列模型是 NLP 的基础，从 RNN 到 Transformer 的演进是 AI 历史上最重要的技术突破之一。

## 附录：RNN vs Transformer

| 维度 | RNN | Transformer |
|------|------|------|
| 并行性 | 低 | 高 |
| 长距离依赖 | 困难 | 容易 |
| 计算复杂度 | O(n) | O(n²) |
| 内存 | 低 | 高 |
| 适用场景 | 短序列 | 长序列 |

## 附录：解码参数推荐

| 场景 | 策略 | 参数 |
|------|------|------|
| 事实问答 | Greedy/Beam | beam=4 |
| 创意写作 | Top-p | p=0.9, temp=0.8 |
| 代码生成 | Top-k | k=50, temp=0.2 |
| 对话 | Top-p | p=0.95, temp=0.7 |

## 附录：学习路径

| 阶段 | 内容 | 目标 |
|------|------|------|
| 入门 | RNN/LSTM 基础 | 理解序列建模 |
| 进阶 | Attention 机制 | 理解注意力 |
| 实践 | 解码策略 | 文本生成 |
| 拓展 | Transformer | 现代架构 |

## 附录：术语表

| 术语 | 英文 | 说明 |
|------|------|------|
| 循环神经网络 | RNN | 处理序列数据 |
| 长短期记忆 | LSTM | 解决梯度消失 |
| 门控循环单元 | GRU | 简化 LSTM |
| 注意力 | Attention | 聚焦重要信息 |
| 束搜索 | Beam Search | 多候选解码 |
| 核采样 | Nucleus Sampling | Top-p 采样 |

## 附录：相关论文

| 论文 | 年份 | 贡献 |
|------|------|------|
| Seq2Seq | 2014 | 编码器-解码器 |
| Attention | 2015 | 注意力机制 |
| Transformer | 2017 | 自注意力架构 |
| BERT | 2018 | 双向预训练 |
| GPT-3 | 2020 | 少样本学习 |

## 附录：序列模型应用

| 应用 | 技术 | 说明 |
|------|------|------|
| 机器翻译 | Seq2Seq + Attention | 源语言→目标语言 |
| 文本摘要 | Encoder-Decoder | 长文本→短摘要 |
| 语音识别 | RNN-T/Transformer | 语音→文字 |
| 时间序列 | LSTM/GRU | 预测/分类 |
| 音乐生成 | Transformer | 序列创作 |

## 附录：梯度问题

| 问题 | 原因 | 解决方案 |
|------|------|------|
| 梯度消失 | 长序列连乘 | LSTM/GRU/残差 |
| 梯度爆炸 | 梯度累积 | 梯度裁剪 |
| 长距离依赖 | 信息衰减 | Attention/Transformer |

## 附录：注意力机制类型

| 类型 | 说明 | 代表 |
|------|------|------|
| 加性注意力 | 前馈网络 | Bahdanau |
| 点积注意力 | 内积计算 | Luong |
| 缩放点积 | 除以√d | Transformer |
| 多头注意力 | 并行多组 | Transformer |
| 自注意力 | 序列内部 | BERT/GPT |

## 附录：位置编码

| 方法 | 说明 | 代表 |
|------|------|------|
| 正弦编码 | 固定位置 | Transformer |
| 可学习 | 训练学习 | BERT |
| RoPE | 旋转位置 | LLaMA/Qwen |
| ALiBi | 线性偏置 | BLOOM |

## 附录：评估指标

| 指标 | 说明 | 适用 |
|------|------|------|
| Perplexity | 困惑度 | 语言模型 |
| BLEU | 双语评估 | 机器翻译 |
| ROUGE | 召回率 | 文本摘要 |
| WER | 词错误率 | 语音识别 |

## 附录：2026 现状

| 方向 | 状态 | 说明 |
|------|------|------|
| RNN | 成熟 | 特定场景仍用 |
| Transformer | 主流 | 统治 NLP |
| Mamba | 新兴 | 状态空间模型 |
| RWKV | 新兴 | 线性注意力 |

## 附录：学习资源

| 资源 | 类型 | 说明 |
|------|------|------|
| CS224N | 课程 | Stanford NLP |
| 《动手学深度学习》 | 书籍 | 李沐团队 |
| HuggingFace | 实践 | 模型库 |
| Papers With Code | 论文 | 最新进展 |

> 💡 序列模型的核心：让机器理解和生成人类语言——从 RNN 到 Transformer 的演进是 AI 最重要的突破。

---
*Last updated: 2026-07-21*
