---
title: '15 AI 测试 — 小白版 🧪'
category: '09-testing'
tags: ["testing", "ai-testing", "prompt-testing", "evaluation"]
summary: '> **一句话秒懂**: AI 测试就是给 AI "出考题"——设计各种测试用例验证 AI 的能力，就像考试一样，有选择题、简答题、应用题，让 AI 答题然后评分，判断 AI 是否真正学会了。'
created: '2026-05-31'
updated: '2026-05-31'
tier: supporting
aliases:
  - "Readme For Dummy"
  - "README for dummy"
  - README_for_dummy

---
# 15 AI 测试 — 小白版 🧪

> **一句话秒懂**: AI 测试就是给 AI "出考题"——设计各种测试用例验证 AI 的能力，就像考试一样，有选择题、简答题、应用题，让 AI 答题然后评分，判断 AI 是否真正学会了。

## 为什么要学 AI 测试？

想象一下：
- 📝 你训练了一个 AI 客服，怎么知道它能不能用？
- 🎯 AI 说它准确率 99%，是真的吗？
- 🔍 怎么发现 AI 的漏洞和弱点？

**AI 测试 = 验证 AI 是否真的好用的方法**

## AI 测试 vs 传统软件测试

```
【传统软件测试】

输入: 固定的测试数据
输出: 固定的正确结果
测试: 每个功能单独测

例子:
计算 1+1 = 2 ✓
计算 2*3 = 6 ✓

【AI 测试】

输入: 各种真实场景的数据
输出: 没有唯一"正确"答案
测试: 需要定义评估标准

例子:
AI 翻译 "Hello" → "你好" ✓
但 "Hello" 也可能翻译成 "喂" (口语场景)
```

## 测试类型

### 1. 功能测试

```
【问题】AI 的基本功能是否正常？

【比如】
- 翻译 AI：能否正确翻译中英互译
- 识别 AI：能否正确识别图像中的物体
- 对话 AI：能否正确回答问题
```

### 2. 性能测试

```
【问题】AI 够不够快、能不能扛住并发？

【指标】
- 响应时间（毫秒级还是秒级）
- 吞吐量（每秒处理多少请求）
- 并发能力（同时多少人用）
```

### 3. 安全性测试

```
【问题】AI 会不会被攻击/误导？

【比如】
- 对抗样本：精心设计的输入让 AI 犯错
- 提示注入：恶意指令让 AI 越狱
- 隐私泄露：AI 是否泄露训练数据
```

### 4. 公平性测试

```
【问题】AI 对不同人群是否公平？

【比如】
- 人脸识别对不同肤色是否准确率一致
- 招聘 AI 是否对女性/少数族裔有偏见
```

## 评估指标

```
【分类任务】
- 准确率 (Accuracy)
- 精确率 (Precision)
- 召回率 (Recall)
- F1 分数

【生成任务】
- BLEU (机器翻译)
- ROUGE (文本摘要)
- Perplexity (语言模型)

【LLM 评估】
- MMLU (多任务理解)
- HumanEval (代码能力)
- BIG-Bench (综合能力)
```

## 测试框架

| 框架 | 用途 |
|------|------|
| pytest | 通用 Python 测试 |
| LangTest | NLP 模型测试 |
| BigBench | LLM 基准测试 |
| AI2 Evals | AI2 评估框架 |
| RAGAS | RAG 系统评估 |

## 测试流程

```
1️⃣ 准备测试数据
   - 收集真实场景数据
   - 标注正确答案
   - 划分训练/验证/测试集

2️⃣ 定义评估指标
   - 选择合适的评估标准
   - 设置通过阈值

3️⃣ 执行测试
   - 运行模型获取预测
   - 对比预测与标准答案

4️⃣ 分析结果
   - 统计指标
   - 分析错误案例
   - 改进建议
```

## 下一步

- 想深入技术？→ 查看子目录具体文档
- 想学模型评估？→ [模型评估/README_for_dummy.md](../模型评估/README_for_dummy.md)
- 想学 MLOps？→ [MLOps/README_for_dummy.md](../MLOps/README_for_dummy.md)

---

*本文是 [README.md](./README.md) 的简化版，适合零基础读者。*

## Related

- [[AI测试/AI-Testing-in-nutshell.md|AI-Testing-in-nutshell]]
- [[AI测试/AI_Testing_for_dummy.md|AI_Testing_for_dummy]]
- [[AI测试/Testing_Frameworks/Java_AI_Testing.md|Java_AI_Testing]]
- [[AI测试/README.md|AI测试 README]]
- [[Agent/Agent_Evaluation/Testing_Methodologies/Testing_Framework.md|Testing_Framework]]
