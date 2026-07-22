# Hello Agents 源码分析

> 由 [zread](https://zread.ai) CLI 自动生成，基于 `code/` 目录下 153 个源码文件（chapter1-16）。
> 生成时间：2026-07-22 | 模型：glm-5.1 | 语言：中文

## 已生成文章（12/30）

### 入门指南

| # | 标题 | 难度 |
|---|------|------|
| 1 | [项目总览：Hello Agents 智能体开发教程体系](./1-xiang-mu-zong-lan-hello-agents-zhi-neng-ti-kai-fa-jiao-cheng-ti-xi.md) | Beginner |
| 2 | [快速上手：环境配置与第一个智能体运行](./2-kuai-su-shang-shou-huan-jing-pei-zhi-yu-di-ge-zhi-neng-ti-yun-xing.md) | Beginner |
| 3 | [从 ELIZA 到现代智能体：对话系统演进史](./3-cong-eliza-dao-xian-dai-zhi-neng-ti-dui-hua-xi-tong-yan-jin-shi.md) | Beginner |

### 大语言模型基础

| # | 标题 | 难度 |
|---|------|------|
| 4 | [分词与词嵌入：BPE、N-gram 与 Word Embedding 原理](./4-fen-ci-yu-ci-qian-ru-bpe-n-gram-yu-word-embedding-yuan-li.md) | Intermediate |
| 5 | [从零实现 Transformer：多头注意力、位置编码与编解码器](./5-cong-ling-shi-xian-transformer-duo-tou-zhu-yi-li-wei-zhi-bian-ma-yu-bian-jie-ma-qi.md) | Advanced |
| 6 | [LLM 客户端封装：OpenAI 兼容接口与流式响应](./6-llm-ke-hu-duan-feng-zhuang-openai-jian-rong-jie-kou-yu-liu-shi-xiang-ying.md) | Intermediate |

### Agent 设计模式

| # | 标题 | 难度 |
|---|------|------|
| 7 | [ReAct 模式：思考-行动-观察循环的实现与解析](./7-react-mo-shi-si-kao-xing-dong-guan-cha-xun-huan-de-shi-xian-yu-jie-xi.md) | Intermediate |
| 8 | [计划与求解（Plan-and-Solve）模式：多步任务分解策略](./8-ji-hua-yu-qiu-jie-plan-and-solve-mo-shi-duo-bu-ren-wu-fen-jie-ce-lue.md) | Intermediate |
| 9 | [反思（Reflection）模式：自我评估与迭代优化](./9-fan-si-reflection-mo-shi-zi-wo-ping-gu-yu-die-dai-you-hua.md) | Intermediate |

### 多智能体框架实战

| # | 标题 | 难度 |
|---|------|------|
| 10 | [低代码平台对比：Coze、Dify、FastGPT 与 n8n](./10-di-dai-ma-ping-tai-dui-bi-coze-dify-fastgpt-yu-n8n.md) | Intermediate |
| 11 | [AgentScope 实战：三国狼人杀多智能体消息驱动架构](./11-agentscope-shi-zhan-san-guo-lang-ren-sha-duo-zhi-neng-ti-xiao-xi-qu-dong-jia-gou.md) | Intermediate |
| 12 | [AutoGen、CAMEL 与 LangGraph 框架应用对比](./12-autogen-camel-yu-langgraph-kuang-jia-ying-yong-dui-bi.md) | Intermediate |

## 未生成文章（18 篇，因 API 限制跳过）

以下文章在目录中已规划，可通过 `zread generate --draft resume -y` 继续生成：

- 13 - SimpleAgent 构建：系统提示词、工具注册与多轮对话
- 14 - 工具系统设计：计算器工具、搜索工具与工具执行器
- 15 - 记忆系统：四种记忆类型与遗忘-整合机制
- 16 - RAG 检索增强：MarkItDown 多格式管道与智能分块
- 17 - 上下文工程：ContextBuilder、NoteTool 与 TerminalTool 协同工作流
- 18 - MCP 协议：工具接入与高德地图服务集成
- 19 - A2A 协议：智能体间通信与任务协商
- 20 - ANP 协议：智能体网络发现、任务分发与负载均衡
- 21 - SFT 监督微调全流程：数据加载、LoRA 配置与训练
- 22 - GRPO 强化学习训练：奖励函数设计与策略优化
- 23 - 分布式训练配置：DeepSpeed Zero2/Zero3 与多 GPU DDP
- 24 - BFCL 评估：函数调用能力基准测试
- 25 - GAIA 评估：通用智能体能力分级评测
- 26 - 合成数据质量评估：LLM Judge 与 Win Rate 方法论
- 27 - 智能旅行助手：Vue3 + FastAPI + MCP 全栈架构
- 28 - 深度研究系统：多轮检索与报告生成的端到端实现
- 29 - AI 小镇：Godot 游戏引擎中的多智能体 NPC 模拟
- 30 - 社区共创：参与 HelloAgents 开源生态

## 续生成命令

```bash
cd 原始/github-sources/hello-agents/code
zread generate --draft resume -y --skip-failed
```
