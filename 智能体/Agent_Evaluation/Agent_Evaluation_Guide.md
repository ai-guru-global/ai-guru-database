---
tier: supporting
title: 评估执行指南
category: 15-agent-production-agent-evaluation-docs-guides
tags: ["ai-agents", "agent-framework", "production", "langgraph", "model-evaluation"]
summary: "> 从配置到运行的完整操作手册"
created: 2026-05-31
updated: 2026-05-31
sources: []
---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](../../治理/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->

# 评估执行指南

> 从配置到运行的完整操作手册

## 1. 环境准备

```bash
# Python 3.11+
cd Agent/Agent_Evaluation/demo
pip install -r requirements.txt
```

依赖清单: `pyyaml`, `aiohttp`（可选，live 模式需要）

## 2. 运行通用评估

### 2.1 模拟模式（默认，无需 API）

```bash
python run_evaluation.py
```

### 2.2 自定义配置

```bash
python run_evaluation.py --config my_config.yaml
```

### 2.3 快速模式

```bash
python run_evaluation.py --quick
```

## 3. 运行 K8s 专项评测

```bash
python run_k8s_evaluation.py
```

输出:
- 终端排行榜 + K8s 维度对比
- `results/k8s_evaluation_results.json`
- 自动生成 `docs/reports/k8s_evaluation_report.md`

## 4. 接入真实 Agent API

1. 编辑 `config.yaml`，将 `mode` 改为 `live`
2. 填入各 Agent 的 API Key
3. 运行评估

```yaml
evaluation:
  mode: "live"

agents:
  - id: "tongyi-agent"
    plugin: "aliyun_plugin"
    config:
      model: "qwen-max"
      api_key: "sk-your-key-here"
```

## 5. 查看排行榜

```bash
cd Web
npm install
npm run dev
# 访问 http://localhost:4567/leaderboard
```

## 6. 添加新 Agent

1. 创建插件文件 `plugins/my_plugin.py`
2. 实现 `AgentPlugin` 接口
3. 注册插件: `PluginRegistry.register("my_plugin", MyPlugin)`
4. 在 `config.yaml` 中添加 agent 配置
5. 在 `plugins/base.py` 的 `QUALITY_PROFILES` 中添加档案（模拟模式）
6. 重新运行评估

## 7. 解读评估结果

### 等级含义

| 等级 | 分数 | 建议 |
|------|------|------|
| S | 90+ | 行业领先，可作为生产首选 |
| A | 80-89 | 优秀，满足大部分生产需求 |
| B | 70-79 | 良好，建议在特定场景验证后使用 |
| C | 60-69 | 合格但有短板，需针对性优化 |
| D | <60 | 不建议生产使用 |

### 维度解读

- **知识问答 (C)**: Agent 对云产品知识的掌握程度
- **任务完成 (A)**: 执行运维任务的成功率和步骤正确性
- **性价比 (P)**: 响应速度和 Token 消耗效率
- **交互质量 (E)**: 多轮对话的连贯性和中文能力
- **安全合规 (R)**: 抵御注入攻击、避免信息泄露的能力

## Related

- [[智能体/Agent_Evaluation/Assessment/Evaluation_Workflow]] — Evaluation Workflow (共享: agent-framework, ai-agents, langgraph, model-evaluation, pro)
- [[智能体/Agent_Evaluation/Cloud_Agent_Evaluation/README]] — Cloud Agent Evaluation (共享: agent-framework, ai-agents, langgraph, model-evaluation, pro)
- [[智能体/Agent_Evaluation/Cloud_Agent_Evaluation_System_2026]] — Cloud Agent Evaluation System 2026 (共享: agent-framework, ai-agents, langgraph, model-evaluation, pro)
- [[智能体/Agent_Evaluation/Metrics/Evaluation_Metrics]] — Evaluation Metrics (共享: agent-framework, ai-agents, langgraph, model-evaluation, pro)
