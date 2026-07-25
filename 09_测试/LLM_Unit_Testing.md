---
title: LLM 单元测试 (LLM Unit Testing)
category: 09-testing
tags: ["llm-testing", "unit-test", "assertion", "deterministic", "snapshot"]
summary: "LLM 应用单元测试完整指南：非确定性输出测试策略、断言设计、快照测试、Mock 策略、评估驱动测试与 2026 工具链。"
created: 2026-07-21
updated: 2026-07-21
tier: supporting
sources: []

---
# LLM 单元测试

## 1. LLM 测试挑战

```
传统测试: assertEqual(output, expected) → 确定性
LLM 测试: 输出不确定 → 不能精确匹配

核心挑战:
- 非确定性: 同一输入不同输出
- 主观性: "好回答"没有唯一标准
- 成本: 每次测试调用 API 花钱
- 速度: LLM 调用慢 (秒级)
- 脆弱性: 模型更新 → 测试全挂

解决思路:
- 测试"属性"而非"精确值"
- 分层: 确定性组件精确测 + LLM 组件模糊测
- Mock: 开发时用固定响应
- 评估: 用评估指标代替断言
```

## 2. 测试策略

### 2.1 分层测试

```python
# LLM 应用测试金字塔:

TEST_PYRAMID = {
    "L1 单元测试 (多)": {
        "对象": "Prompt 模板/解析器/工具函数",
        "方法": "标准 assertEqual",
        "速度": "毫秒级",
        "示例": "测试 prompt 格式化、输出解析、重试逻辑",
    },
    "L2 集成测试 (中)": {
        "对象": "LLM 调用链/工具调用",
        "方法": "属性断言 + Mock",
        "速度": "秒级",
        "示例": "测试 RAG 管道、Agent 工具选择",
    },
    "L3 评估测试 (少)": {
        "对象": "端到端质量",
        "方法": "LLM-as-Judge / 评估指标",
        "速度": "分钟级",
        "示例": "回答质量、安全性、一致性",
    },
}
```

### 2.2 断言策略

```python
import pytest

class TestLLMOutput:
    """LLM 输出测试: 测属性不测精确值"""
    
    def test_output_format(self, llm_response):
        """测试输出格式正确"""
        # 结构化输出
        assert "answer" in llm_response
        assert "confidence" in llm_response
        assert isinstance(llm_response["confidence"], float)
        assert 0 <= llm_response["confidence"] <= 1
    
    def test_output_constraints(self, llm_response):
        """测试输出约束"""
        # 长度约束
        assert len(llm_response["answer"]) < 500
        # 语言约束
        assert is_chinese(llm_response["answer"])
        # 不包含敏感信息
        assert not contains_pii(llm_response["answer"])
    
    def test_semantic_correctness(self, llm_response, question):
        """语义正确性 (模糊匹配)"""
        # 关键词必须出现
        assert any(kw in llm_response for kw in [" Paris", "巴黎"])
        # 不能包含错误信息
        assert "伦敦" not in llm_response  # 法国首都不是伦敦
    
    def test_deterministic_with_seed(self):
        """固定种子测试确定性"""
        r1 = call_llm("Hello", temperature=0, seed=42)
        r2 = call_llm("Hello", temperature=0, seed=42)
        assert r1 == r2  # temperature=0 + seed → 确定性
    
    def test_consistency(self):
        """一致性: 多次调用语义一致"""
        responses = [call_llm("2+2等于?", temperature=0.3) for _ in range(5)]
        # 所有回答都应包含 "4"
        assert all("4" in r for r in responses)
```

### 2.3 Mock 策略

```python
from unittest.mock import patch, MagicMock

class TestWithMock:
    """开发/CI 中 Mock LLM 调用"""
    
    @patch("myapp.llm_client.call")
    def test_pipeline_with_mock(self, mock_llm):
        """Mock LLM 测试管道逻辑"""
        # 固定返回
        mock_llm.return_value = '{"answer": "42", "confidence": 0.95}'
        
        result = my_pipeline("What is the meaning of life?")
        
        assert result["answer"] == "42"
        mock_llm.assert_called_once()
    
    @patch("myapp.llm_client.call")
    def test_error_handling(self, mock_llm):
        """测试 LLM 错误处理"""
        mock_llm.side_effect = TimeoutError("API timeout")
        
        result = my_pipeline_with_retry("test", max_retries=3)
        
        assert mock_llm.call_count == 3  # 重试了 3 次
        assert result["status"] == "failed"

# 快照测试 (Snapshot Testing):
class TestSnapshot:
    def test_prompt_snapshot(self, snapshot):
        """Prompt 模板快照"""
        prompt = build_prompt("user question", context=["doc1", "doc2"])
        snapshot.assert_match(prompt, "expected_prompt.txt")
    
    def test_output_structure_snapshot(self, snapshot):
        """输出结构快照 (不比较内容)"""
        response = call_llm("test")
        structure = {k: type(v).__name__ for k, v in response.items()}
        snapshot.assert_match(structure, "output_structure.json")
```

## 3. 评估驱动测试

```python
class TestWithEvaluation:
    """用评估指标做测试断言"""
    
    def test_answer_quality(self):
        """回答质量不低于阈值"""
        response = call_llm("解释量子计算")
        score = llm_judge(response, criteria="clarity_and_accuracy")
        assert score >= 0.7, f"质量分 {score} < 0.7"
    
    def test_no_hallucination(self):
        """无幻觉"""
        response = call_llm("Python 的 GIL 是什么?", 
                           context=GROUND_TRUTH_DOC)
        faithfulness = ragas_faithfulness(response, GROUND_TRUTH_DOC)
        assert faithfulness >= 0.9
    
    def test_safety(self):
        """安全性"""
        harmful_prompts = load_red_team_prompts()
        for prompt in harmful_prompts:
            response = call_llm(prompt)
            assert not is_harmful(response)
```

## 4. CI/CD 集成

```yaml
# GitHub Actions: LLM 测试
name: LLM Tests

on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Fast tests (mocked LLM)
        run: pytest tests/unit/ -v --timeout=30
  
  integration-tests:
    runs-on: ubuntu-latest
    if: github.event_name == 'pull_request'
    steps:
      - name: Integration tests (real LLM, small set)
        run: pytest tests/integration/ -v --timeout=120
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
  
  evaluation:
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Quality evaluation (weekly)
        run: python eval/run_eval.py --suite=regression
```

## 5. 工具

| 工具 | 用途 | 特色 |
|------|------|------|
| pytest + 自定义 | 通用测试 | 灵活 |
| promptfoo | Prompt 测试 | 多模型对比 |
| DeepEval | LLM 评估测试 | 丰富指标 |
| Ragas | RAG 测试 | 忠实度/相关性 |
| LangSmith | 追踪+评估 | LangChain 生态 |

## 6. 交叉引用

- [[09_测试/02_Testing_Frameworks/|测试框架]]
- [[09_测试/RAGAS/|RAGAS]]
- [[16_编程/Testing_with_AI/|AI 辅助测试]]
- [[08_模型评估/|模型评估]]
- [[09_测试/CI_CD_for_ML/|ML CI/CD]]
