---
title: 推理能力评估 (Reasoning Evaluation)
category: 08-evaluation
tags: ["reasoning-evaluation", "math-benchmark", "code-benchmark", "logic", "evaluation"]
summary: "LLM 推理能力评估完整体系：数学推理（MATH/GPQA/AIME）、代码推理（HumanEval/LiveCodeBench）、逻辑推理、评估方法论与 2026 最新基准。"
created: 2026-07-21
updated: 2026-07-21
tier: supporting
sources: []

---
# 推理能力评估 (Reasoning Evaluation)

## 1. 推理评估维度

```
推理能力分类:
1. 数学推理: 代数/几何/数论/组合/概率
2. 代码推理: 生成/调试/理解/算法
3. 逻辑推理: 演绎/归纳/类比/因果
4. 科学推理: 物理/化学/生物推断
5. 常识推理: 日常逻辑/社会推理

评估难点:
- 答案正确 ≠ 推理正确 (可能蒙对)
- 需要评估推理过程质量
- 难度跨度大 (小学 → 竞赛)
- 数据污染风险 (训练集泄露)
```

## 2. 数学推理基准

### 2.1 基准对比

| 基准 | 难度 | 题量 | 类型 | 2026 SOTA |
|------|------|------|------|-----------|
| GSM8K | 小学 | 8.5K | 应用题 | ~97% |
| MATH | 竞赛 | 12.5K | 证明/计算 | ~90% |
| AIME 2025 | 高中竞赛 | 30 | 整数答案 | ~85% |
| GPQA Diamond | 研究生 | 198 | 选择题 | ~75% |
| OlympiadBench | 奥赛 | 8K+ | 多类型 | ~70% |
| FrontierMath | 前沿研究 | 300 | 开放 | ~30% |

### 2.2 评估方法

```python
class MathEvaluator:
    """数学推理评估"""
    
    def evaluate(self, model, dataset):
        results = []
        for problem in dataset:
            # 生成 (可能多次采样)
            responses = model.generate(
                problem["question"],
                n=1,  # 或 n=64 for pass@k
                temperature=0.0,  # greedy for pass@1
                max_tokens=4096,
            )
            
            for resp in responses:
                # 提取答案
                predicted = self.extract_answer(resp)
                # 验证
                correct = self.verify(predicted, problem["answer"])
                results.append({
                    "problem_id": problem["id"],
                    "correct": correct,
                    "response": resp,
                    "predicted": predicted,
                })
        
        return {
            "accuracy": sum(r["correct"] for r in results) / len(results),
            "by_difficulty": self.group_by_difficulty(results),
            "by_category": self.group_by_category(results),
        }
    
    def extract_answer(self, response):
        """从推理链中提取最终答案"""
        import re
        # 尝试多种模式
        patterns = [
            r'\\boxed\{(.+?)\}',
            r'The answer is[:\s]*(.+?)[\.\n]',
            r'答案[是为]?\s*[：:]?\s*(.+?)[\n。]',
        ]
        for p in patterns:
            match = re.search(p, response)
            if match:
                return match.group(1).strip()
        return None
    
    def verify(self, predicted, ground_truth):
        """验证答案 (支持等价形式)"""
        if predicted is None:
            return False
        # 数值等价
        try:
            return abs(float(predicted) - float(ground_truth)) < 1e-6
        except:
            pass
        # 符号等价 (用 sympy)
        try:
            from sympy import simplify, sympify
            return simplify(sympify(predicted) - sympify(ground_truth)) == 0
        except:
            return predicted.strip() == ground_truth.strip()
```

## 3. 代码推理基准

### 3.1 基准对比

| 基准 | 语言 | 题量 | 评估 | 2026 SOTA |
|------|------|------|------|-----------|
| HumanEval | Python | 164 | 测试通过 | ~95% |
| HumanEval+ | Python | 164 | 更多测试 | ~90% |
| MBPP | Python | 974 | 测试通过 | ~92% |
| LiveCodeBench | 多语言 | 400+ | 竞赛题 | ~60% |
| SWE-bench | Python | 500 | Issue修复 | ~60% |
| CodeContests | 多语言 | 165 | 竞赛 | ~50% |

### 3.2 Pass@k 评估

```python
def pass_at_k(n, c, k):
    """
    pass@k: 生成 n 个样本，至少 k 个通过的概率
    
    n: 总生成数
    c: 通过数
    k: 至少通过 k 个
    
    公式: 1 - C(n-c, k) / C(n, k)
    """
    if n - c < k:
        return 1.0
    return 1.0 - np.prod(1.0 - k / np.arange(n - c + 1, n + 1))

# 常用:
# pass@1: 单次生成通过率 (最严格)
# pass@10: 10次中至少1次通过
# pass@100: 100次中至少1次通过
```

## 4. 推理过程评估

### 4.1 过程质量评估

```python
class ReasoningProcessEvaluator:
    """
    不只评估答案，还评估推理过程
    
    维度:
    - 逻辑连贯性: 每步是否合理
    - 完整性: 是否遗漏关键步骤
    - 效率: 是否有冗余/绕路
    - 可验证性: 是否有中间检查
    """
    def evaluate_process(self, problem, response):
        # 用 LLM-as-Judge 评估推理质量
        judge_prompt = f"""
评估以下推理过程的质量 (1-5分):

问题: {problem}
回答: {response}

评分维度:
1. 逻辑正确性: 每步推理是否有效
2. 完整性: 是否覆盖所有关键步骤
3. 清晰度: 是否易于理解
4. 效率: 是否简洁不冗余
5. 验证: 是否有自我检查

请给出每个维度的分数和理由。
"""
        return self.judge_model.generate(judge_prompt)
```

## 5. 2026 评估最佳实践

```python
EVALUATION_BEST_PRACTICES = {
    "防污染": [
        "使用最新题目 (2025-2026)",
        "使用私有测试集",
        "定期更新基准",
    ],
    "多次采样": [
        "pass@1 (greedy): 日常使用",
        "pass@64 (sampling): 能力上限",
        "majority vote: 稳定性",
    ],
    "全面评估": [
        "不只看总分，看分类别表现",
        "关注弱项 (如几何/组合)",
        "对比不同难度级别",
    ],
    "工具": [
        "lm-evaluation-harness: 标准框架",
        "OpenCompass: 中文评测",
        "自定义: 领域特定评估",
    ],
}
```

## 6. 交叉引用

- [[08_模型评估/02_Benchmarks/|基准测试]]
- [[08_模型评估/03_LLM_Evaluation/|LLM 评估]]
- [[08_模型评估/Agent_Evaluation/|Agent 评估]]
- [[06_强化学习/04_RL_Applications/RL_for_LLM_Reasoning|推理 RL]]
- [[05_大模型/09_Reasoning_Models/|推理模型]]
- [[09_测试/|测试]]
