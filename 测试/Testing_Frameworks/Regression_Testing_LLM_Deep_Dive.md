---
title: 'LLM 回归测试深度指南 - 非确定性输出的质量守护'
category: '09-testing'
tags: ["testing", "regression-testing", "ci-cd", "snapshot", "golden-set", "evaluation"]
summary: '> **一句话理解**: LLM 回归测试的核心矛盾是"输出非确定性"——传统断言"等于期望值"会一直失败，解法是用语义相似度代替精确匹配、用黄金集做回归基线、用统计阈值而非布尔判定，让 CI 在模型更新时既能抓住质量退步又不被随机抖动淹没。'
created: '2026-06-22'
updated: '2026-06-22'
tier: supporting
aliases:
  - "Regression Testing Llm Deep Dive"
  - "Regression Testing LLM Deep Dive"
  - Regression_Testing_LLM_Deep_Dive
sources: []

---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](../../治理/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->
# LLM 回归测试深度指南 - 非确定性输出的质量守护

> **一句话理解**: LLM 回归测试的核心矛盾是"输出非确定性"——传统断言"等于期望值"会一直失败，解法是用语义相似度代替精确匹配、用黄金集做回归基线、用统计阈值而非布尔判定，让 CI 在模型更新时既能抓住质量退步又不被随机抖动淹没。

---

## 0. 为什么 LLM 回归测试很难？

传统软件回归测试：改了代码 A，跑全部测试，确保没破坏功能 B。断言是确定性的——`assert result == expected`。

LLM 回归测试的困境：

```
同一个输入，调用两次 LLM：
  第1次: "强化学习是让智能体通过试错学习的机器学习范式..."
  第2次: "强化学习（RL）是一种通过奖励信号优化决策的方法..."

  → 两个回答都对，但文本完全不同
  → assert output == expected  永远失败
  → 无法用传统断言
```

核心挑战：**如何在不稳定的输出上建立稳定的质量基线？**

---

## 1. 四种回归测试策略

### 策略一：快照测试（Snapshot Testing）

```
原理：
  首次运行时，保存输出为"快照"（baseline）
  后续运行，比较新输出与快照

传统快照：精确文本匹配
LLM 快照：需处理非确定性

  方案 A：固定随机种子 + temperature=0
    → 输出近乎确定（但牺牲了多样性）
    → 适合 API 合同测试

  方案 B：结构化快照（只存 JSON 结构，不存文本）
    → 测试输出格式稳定性
    → 不测内容质量
```

**适用场景**：API 响应格式、结构化输出（JSON）、函数调用。

### 策略二：语义回归（Semantic Regression）

```
原理：用 embedding 计算新旧输出的语义相似度
  sim = cosine(embed(output_new), embed(output_baseline))
  若 sim > 阈值（如 0.85）→ 通过

优势：容忍措辞变化，捕捉语义漂移
劣势：embedding 模型本身有偏差；反义可能高相似（语义反转检测失败）
```

```python
# 语义回归测试示例
from sentence_transformers import SentenceTransformer
import numpy as np

model = SentenceTransformer('all-MiniLM-L6-v2')

def semantic_regression(new_output, baseline, threshold=0.85):
    emb_new = model.encode([new_output])
    emb_base = model.encode([baseline])
    sim = np.dot(emb_new, emb_base.T)[0][0]
    assert sim >= threshold, f"语义漂移: {sim:.3f} < {threshold}"
```

### 策略三：黄金集评估（Golden Set / Eval Set）

```
原理：
  维护一组"黄金问答对"（prompt + 期望特征/参考答案）
  每次模型更新，跑黄金集，统计通过率
  通过率下降 → 回归

黄金集设计原则：
  - 覆盖核心功能（不是边缘 case）
  - 数量适中（50-500 条，平衡覆盖与成本）
  - 可评估（有明确的评判标准：LLM-judge / 规则 / 人工）
  - 分层：简单/中等/困难
```

```
黄金集结构示例：
{
  "id": "G-042",
  "category": "代码生成",
  "difficulty": "medium",
  "prompt": "写一个 Python 快速排序",
  "eval_method": "code_execution",  # 执行测试
  "pass_criteria": "通过全部 5 个测试用例",
  "test_cases": [...]
}
```

### 策略四：统计阈值（Statistical Thresholds）

```
原理：不判单个输出对错，判"通过率是否在可接受区间"

  黄金集 100 题，旧模型通过 82 题（基线 82%）
  新模型通过 79 题 → 回归（下降 3%，超阈值）
  新模型通过 85 题 → 改进

  阈值设置：
    红线（阻断发布）: 通过率 < 基线 - 5%
    黄线（人工复核）: 基线 - 5% ~ 基线 - 2%
    绿线（通过）: ≥ 基线 - 2%（容忍统计噪声）
```

---

## 2. 评判方法（How to Judge）

LLM 输出没有"标准答案"，如何判定回归？三种评判：

| 方法 | 原理 | 成本 | 准确性 |
|------|------|------|--------|
| **规则匹配** | 关键词/正则/代码执行 | 低 | 高（但覆盖窄） |
| **LLM-as-Judge** | 用 GPT-4 评判输出质量 | 中 | 中高（有偏差） |
| **人工评审** | 专家逐条评估 | 极高 | 最高 |

### 2.1 规则匹配适用场景

```
代码生成：    执行测试用例，看通过率
数学题：      比较最终数值
结构化输出：  JSON Schema 验证
分类任务：    精确类别匹配
关键词任务：  必须包含/禁止包含某些词
```

### 2.2 LLM-as-Judge 的注意事项

```
问题 1：Judge 偏好
  GPT-4 倾向给长回答高分（verbosity bias）
  倾向给自己风格的回答高分（self-preference）
  → 解法：交换回答顺序、用多 judge 投票

问题 2：Judge 能力上限
  Judge 比被测模型弱 → 评判不可靠
  → 解法：Judge 必须明显强于被测模型

问题 3：成本
  每条评估消耗 token
  → 解法：先用规则过滤，仅边界 case 用 LLM judge
```

---

## 3. CI/CD 集成

### 3.1 门控流程

```
开发者提交 PR（含 prompt/模型改动）
       │
       ▼
  CI 触发黄金集评估
       │
       ├─ 通过率 ≥ 基线-2% → ✅ 绿灯，允许合并
       ├─ 基线-5% ~ 基线-2% → ⚠️ 黄灯，需人工复核
       └─ 通过率 < 基线-5%  → 🔴 红灯，阻断合并
       │
       ▼（绿灯后）
  灰度发布 5% 流量
       │
       ▼
  监控线上质量指标（幻觉率/满意度/拒绝率）
       │
       ▼
  全量发布（质量稳定 24h 后）
```

### 3.2 Promptfoo 回归测试

```yaml
# promptfoo eval config - 回归测试
description: "回归测试 - 对比新旧 prompt 版本"
prompts:
  - file://prompts/v1.txt
  - file://prompts/v2.txt

providers:
  - openai:gpt-4o

tests:
  # 黄金集
  - vars: {question: "解释什么是梯度下降"}
    assert:
      - type: contains-any
        value: ["学习率", "梯度", "损失函数"]
      - type: llm-rubric
        value: "解释准确且易懂"

  - vars: {question: "写一个二分查找"}
    assert:
      - type: javascript
        value: "output.includes('def binary_search') || output.includes('function binarySearch')"
      - type: contains-any
        value: ["left", "right", "mid"]

# 对比模式：v1 vs v2
```

```bash
# 运行回归测试
promptfoo eval -c regression.yaml --share

# CI 中阻断逻辑
promptfoo eval -c regression.yaml
if [ $? -ne 0 ]; then
  echo "回归测试失败，阻断 PR"
  exit 1
fi
```

### 3.3 LangSmith 持续评估

```python
from langsmith import Client

client = Client()

# 创建数据集（黄金集）
dataset = client.create_dataset("regression-golden-set")

# 线上 trace 自动采样到数据集
# 每次模型更新，重跑该数据集
results = client.run_on_dataset(
    dataset_name="regression-golden-set",
    llm_or_chain_factory=my_chain,
    evaluation=RunEvalConfig(
        evaluators=["criteria"],  # 内置评判器
        criteria={"correctness": "回答是否正确"},
    ),
)
```

---

## 4. 漂移检测（Drift Detection）

线上模型会因多种原因"漂移"——质量缓慢下降但单次评估难察觉。

### 4.1 漂移类型

| 类型 | 原因 | 检测信号 |
|------|------|----------|
| 数据漂移 | 用户输入分布变化 | 输入 embedding 分布偏移 |
| 概念漂移 | "正确答案"标准变化 | 人工标注率下降 |
| 模型漂移 | 上游模型更新 | 输出长度/风格突变 |
| 质量漂移 | 累积性退步 | 满意度/反馈率下降 |

### 4.2 监控指标

```
线上质量监控仪表板应包含：
┌──────────────────────────────────────┐
│  实时指标                              │
│  ├── 首 Token 延迟 P50/P99            │
│  ├── 吞吐量 (tokens/sec)              │
│  ├── 平均输出长度（突变=异常）          │
│  └── 错误率（超时/限流/拒绝）           │
│                                       │
│  质量指标（采样评估）                   │
│  ├── 幻觉率（LLM-judge 抽样）          │
│  ├── 用户负面反馈率（点踩/重写）        │
│  ├── 安全拦截率                        │
│  └── 黄金集通过率（定期重跑）           │
│                                       │
│  分布指标                              │
│  ├── 输入主题分布（聚类偏移）           │
│  └── 输出风格分布（长度/情感）          │
└──────────────────────────────────────┘
```

---

## 5. 黄金集维护

### 5.1 黄金集生命周期

```
创建 → 使用 → 腐化 → 更新 → ...

腐化原因：
  - 业务变化（旧问题不再重要）
  - 模型进化（旧难题变简单，失去区分度）
  - 数据泄露（黄金集被混入训练数据）

更新策略：
  - 季度评审：剔除过时、新增热点
  - 难度校准：全过的题降级或移除
  - 泄露检测：对比训练数据，去重
```

### 5.2 黄金集分层

```
Tier 1: 冒烟测试（10-20 题，每次 PR 跑）
  - 最核心功能，快速反馈
  - 执行 < 2 分钟

Tier 2: 标准回归（50-100 题，每日跑）
  - 覆盖主要场景
  - 执行 5-10 分钟

Tier 3: 深度评估（200-500 题，每周/版本前跑）
  - 全覆盖，含长尾
  - 执行 30-60 分钟
  - 含 LLM-judge（成本高）
```

---

## 6. 工具对比

| 工具 | 回归能力 | CI 集成 | LLM-judge | 适用 |
|------|----------|---------|-----------|------|
| **Promptfoo** | ✅ 版本对比 | ✅ YAML CI | ✅ | Prompt/Pipeline 回归 |
| **LangSmith** | ✅ 数据集重跑 | API | ✅ | LangChain 生态 |
| **Braintrust** | ✅ evals 历史 | API | ✅ | 企业级评估平台 |
| **DeepEval** | ✅ pytest 风格 | ✅ pytest | ✅ | 单元测试集成 |
| **OpenAI Evals** | ✅ 基准框架 | 脚本 | 自定义 | 开源评估框架 |

---

## 7. 实践：回归测试 SOP

```
1. 建立黄金集（一次性）
   - 从生产 trace 采样 100 个代表性问答
   - 人工标注期望特征/参考答案
   - 入库 LangSmith / Promptfoo dataset

2. 设定基线（首次评估）
   - 当前模型跑黄金集，记录通过率（如 82%）
   - 这就是回归基线

3. CI 门控（每次改动）
   - Tier 1 冒烟（PR 必跑）
   - Tier 2 标准（每日 cron）
   - 阈值：红灯 <基线-5%，黄灯 基线±5%，绿灯 ≥基线

4. 线上监控（持续）
   - 黄金集每日自动重跑（采样线上输入）
   - 质量指标仪表板
   - 漂移告警

5. 定期更新（季度）
   - 评审黄金集，更新腐化部分
   - 重新校准基线
```

---

## 8. 2026 趋势

1. **AI 生成测试用例**：用 LLM 自动生成并维护黄金集（降低人工成本）
2. **过程评估**：不只看最终答案，评估推理链每一步（PRM 思路）
3. **A/B 回归**：新旧模型并行服务，真实流量对比（高于离线评估）
4. **对抗性回归**：黄金集加入对抗样本，测试安全回归
5. **成本感知 CI**：智能选择跑哪些测试（按改动影响范围），降 CI 成本

---

## Related

- [[测试/Testing_Fundamentals/AI_Test_Framework_2026|AI 测试框架 2026]] — 测试全栈框架
- [[测试/Testing_Frameworks/Promptfoo_Deep_Dive|Promptfoo]] — 回归测试主力工具
- [[测试/Testing_Frameworks/LLM_Safety_Testing_Deep_Dive|LLM 安全测试]] — 安全回归测试
- [[测试/Contract_Testing|契约测试]] — API 格式稳定性
- [[运维/AI_Ops_2026|AI 运维]] — 线上质量监控
- [[概念/ci-integrated-evaluation|CI 集成评估]] — 概念卡

---

> **参考文献**
> - Promptfoo: Prompt Testing & Regression (promptfoo.dev)
> - LangSmith: Evaluation & Tracing (langchain.com/langsmith)
> - Braintrust: AI Evaluation Platform
> - DeepEval: Pytest for LLMs
> - "Evaluating LLMs is Hard" (Ham et al., 2024)

- [[测试/README|AI 测试与评估 (AI Testing)]]
