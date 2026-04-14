# Cloud Agent Evaluation Framework - Demo

> CAPER 五维评估框架的可运行 Demo，包含评估引擎、测试数据集和模拟结果

## Quick Start

```bash
# 安装依赖
pip install -r requirements.txt

# 运行评估 (模拟模式，无需 API Key)
python run_evaluation.py

# 结果输出到 results/sample_results.json
```

## 文件说明

| 文件 | 说明 |
|------|------|
| `run_evaluation.py` | 主入口，运行完整评估流水线 |
| `config.yaml` | 评估配置 (Agent 列表、权重、数据集路径) |
| `evaluator/core.py` | 评估管道核心逻辑 |
| `evaluator/metrics.py` | CAPER 五维指标计算 |
| `evaluator/scorer.py` | 加权评分与排名 |
| `evaluator/llm_judge.py` | LLM-as-Judge 评估器 |
| `evaluator/safety_checker.py` | 安全性检测 (注入/毒性/偏见) |
| `plugins/base.py` | Agent 插件基类 + MockPlugin |
| `plugins/aliyun_plugin.py` | 阿里云通义千问适配器 |
| `plugins/openai_plugin.py` | OpenAI 兼容 API 适配器 |
| `datasets/*.json` | 测试数据集 (120 题) |
| `results/sample_results.json` | 15 个 Agent 评估结果 |

## 接入真实 API

编辑 `config.yaml`，将 `mode` 改为 `live`，并填入 API Key。

## 环境要求

- Python 3.11+
- 依赖: pyyaml (必需), numpy/scikit-learn (可选)

## 详细文档

参见 [Cloud_Agent_Evaluation_System_2026.md](../Cloud_Agent_Evaluation_System_2026.md)
