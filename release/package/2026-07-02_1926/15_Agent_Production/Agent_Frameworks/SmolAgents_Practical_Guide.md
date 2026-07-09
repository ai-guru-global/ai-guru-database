---
title: "SmolAgents 实战指南：用 50 行代码构建多模态 Code Agent"
category: "15-agent-production-agent-frameworks"
tags: ["ai-agents", "smolagents", "huggingface", "code-agent", "practical-guide"]
summary: "> **一句话理解**: SmolAgents 用 Python 代码代替 JSON 作为 Agent 的思考与行动载体，极大简化了多工具调用、错误恢复和逻辑推理的复杂度。本文将带你从零实现生产级的 SmolAgents 工作流。"
created: "2026-06-12"
updated: "2026-06-12"
tier: supporting
aliases:
  - "Smolagents Practical Guide"
  - "SmolAgents Practical Guide"
  - SmolAgents_Practical_Guide
sources: []

---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](../../_meta/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->
# SmolAgents 实战指南：用 50 行代码构建多模态 Code Agent

> **一句话理解**: SmolAgents 用 Python 代码代替 JSON 作为 Agent 的思考与行动载体（Code Agent 范式），极大简化了多工具调用、数据传递和逻辑推理的复杂度。本文将带你从零实现生产级的 SmolAgents 工作流。

---

## 目录

1. [为什么选择 Code Agent 范式？](#1-为什么选择-code-agent-范式)
2. [环境准备](#2-环境准备)
3. [实战一：基础 CodeAgent（联网查询与计算）](#3-实战一基础-codeagent联网查询与计算)
4. [实战二：无缝接入 Hugging Face 万千多模态模型](#4-实战二无缝接入-hugging-face-万千多模态模型)
5. [实战三：自定义 Tool 与沙箱安全机制](#5-实战三自定义-tool-与沙箱安全机制)
6. [实战四：多 Agent 协作（Managed Agents）](#6-实战四多-agent-协作managed-agents)
7. [生产部署建议](#7-生产部署建议)

---

## 1. 为什么选择 Code Agent 范式？

传统的 Agent 框架（如早期的 LangChain、AutoGen）大多使用 **JSON Tool Calling**：
*   **JSON 范式的痛点**：当大模型需要调用多个工具，并将 Tool A 的输出传给 Tool B 时，LLM 必须先输出一个 JSON（调用 A），等框架解析执行后，LLM 再输出下一个 JSON（调用 B）。这不仅耗费大量的 Token 和轮次，且在处理复杂逻辑（如 if/else 分支、for 循环处理多条数据）时极易出错。

**SmolAgents 引入的 Code Agent 范式**：
*   让大模型直接输出一段 **Python 代码** 并在沙箱中执行。
*   Python 原生支持循环、条件判断和变量传递，LLM 可以在**单次推理（Single Turn）** 中完成多个工具的链式调用和数据处理。
*   **性能提升**：研究表明，Code Agent 在复杂任务上的成功率比传统 JSON Agent 高出 **20%~30%**。

---

## 2. 环境准备

首先，安装 `smolagents` 和相关依赖：

```bash
# 推荐使用虚拟环境
pip install smolagents
pip install python-dotenv duckduckgo-search
```

配置环境变量 `.env`，填入你的 Hugging Face Token (从 https://huggingface.co/settings/tokens 获取)：

```env
HF_TOKEN=hf_your_token_here
```

---

## 3. 实战一：基础 CodeAgent（联网查询与计算）

在这个例子中，我们使用 `DuckDuckGoSearchTool` 查询最新数据，并让 Agent 自动编写 Python 代码进行计算。

```python
import os
from dotenv import load_dotenv
from smolagents import CodeAgent, HfApiModel, DuckDuckGoSearchTool

# 1. 加载环境变量
load_dotenv()

# 2. 初始化模型 (这里使用免费的 HF Inference API 调用 Llama-3 系列)
# 在 2026 年，Qwen2.5-Coder 等模型对 Code Agent 支持极好
model = HfApiModel(
    model_id="Qwen/Qwen2.5-Coder-32B-Instruct", 
    token=os.getenv("HF_TOKEN")
)

# 3. 创建 CodeAgent，并注入搜索工具
agent = CodeAgent(
    tools=[DuckDuckGoSearchTool()], 
    model=model,
    additional_authorized_imports=["datetime"] # 允许沙箱执行时导入的库
)

# 4. 执行任务
task = """
1. 搜索苹果公司（Apple Inc.）最近一次财报公布的季度总营收（以十亿美元为单位）。
2. 将该数字换算成人民币（假设汇率为 1 USD = 7.25 RMB）。
3. 告诉我换算后的最终数字。
"""

agent.run(task)
```

**运行逻辑解析**：
Agent 会生成一段 Python 代码，首先调用 `search` 工具获取营收数据，然后用 Python 变量提取数字，乘以 7.25，最后输出。所有计算在一次沙箱代码执行中完成！

---

## 4. 实战二：无缝接入 Hugging Face 万千多模态模型

SmolAgents 最强大的杀手锏是：**只需一行代码，就可以将 HF Hub 上任何支持 Inference API 的模型转化为 Agent 的 Tool**。

```python
from smolagents import CodeAgent, HfApiModel, Tool

# 创建一个连接到 Hugging Face Hub 的图像生成工具
# 我们只需要提供任务描述和对应的 Hub Model ID 即可
image_generation_tool = Tool.from_hub(
    "black-forest-labs/FLUX.1-schnell", # 高质量图像生成模型
    name="generate_image",
    description="Generates an image based on a text prompt."
)

agent = CodeAgent(
    tools=[image_generation_tool],
    model=HfApiModel(model_id="meta-llama/Meta-Llama-3-70B-Instruct")
)

# 让 Agent 构思一个场景并画出来
agent.run(
    "请帮我构思一个未来赛博朋克风格的北京胡同场景，并调用工具生成这张图片。返回图片对象。"
)
```

在这个例子中，Agent 不仅构思了 Prompt，还直接调用了远端的 Diffusion 模型生成了图片对象（Pillow Image Object），你可以直接通过 Python 的 `.show()` 预览它。

---

## 5. 实战三：自定义 Tool 与沙箱安全机制

除了使用内置工具，在企业级应用中，我们需要连接自己的数据库或内部 API。SmolAgents 提供了基于类和基于装饰器的定义方法：

```python
from smolagents import tool, CodeAgent, HfApiModel

# 使用装饰器快速定义 Tool，必须包含明确的 Type Hints 和 docstring
@tool
def get_stock_price(ticker: str) -> float:
    """
    Fetches the current stock price for a given ticker symbol.
    
    Args:
        ticker: The stock ticker symbol (e.g., 'AAPL', 'TSLA').
    """
    # 这里用 mock 数据代替真实的 API 调用
    mock_db = {"AAPL": 150.25, "TSLA": 200.50, "MSFT": 310.0}
    return mock_db.get(ticker.upper(), 0.0)

agent = CodeAgent(
    tools=[get_stock_price],
    model=HfApiModel(),
    max_steps=3 # 限制 Agent 的最多重试/思考步数
)

agent.run("买 10 股苹果和 5 股特斯拉一共需要多少钱？")
```

### 🔒 安全提醒：Local Python Execution
CodeAgent 默认会在本地执行 Python 代码。
*   **危险**：如果不加限制，LLM 可能会生成 `import os; os.system("rm -rf /")`。
*   **防护机制**：SmolAgents 内置了一个**局部命名空间沙箱（Restricted Python Executor）**。它默认屏蔽了 `os`, `sys`, `subprocess` 等高危库。
*   如果你需要更高级的安全（如云端多租户），必须配合 Docker、E2B 沙箱 或 Kubernetes 隔离环境运行 Agent。

---

## 6. 实战四：多 Agent 协作（Managed Agents）

应对复杂项目时，单体 Agent 容易混乱。SmolAgents 提供了 `ManagedAgent` 进行多 Agent 级联编排（类似于主管 Agent 调用下属 Agent）：

```python
from smolagents import CodeAgent, ToolCallingAgent, HfApiModel, ManagedAgent, DuckDuckGoSearchTool

model = HfApiModel("Qwen/Qwen2.5-Coder-32B-Instruct")

# 下属 Agent 1: 专门负责网络搜索的研究员
web_search_agent = ToolCallingAgent(
    tools=[DuckDuckGoSearchTool()],
    model=model,
    name="web_searcher",
    description="A specialist in finding up-to-date information on the web."
)

# 包装成 ManagedAgent，使其成为主管 Agent 的一个 Tool
managed_web_agent = ManagedAgent(
    agent=web_search_agent,
    name="web_search_agent",
    description="Use this agent to search the internet for current events and data."
)

# 主管 Agent: 负责统筹和计算
manager_agent = CodeAgent(
    tools=[], 
    managed_agents=[managed_web_agent], # 将下属挂载为主管的工具
    model=model
)

manager_agent.run("调研最新的 OpenAI O3 模型架构，并总结 3 个核心创新点。")
```

---

## 7. 生产部署建议

如果要在 2026 年的生产环境中使用 SmolAgents，请参考以下规范：

1.  **模型选型**：CodeAgent 极度依赖大模型的**代码生成与补全能力**。推荐使用 Qwen2.5-Coder (32B+), Llama-3.1-70B/405B, 或商业模型如 Claude-3.5-Sonnet。
2.  **可观测性（Observability）**：由于 Agent 会自行决定写什么代码，你需要记录它的每一条 Trace。SmolAgents 内置了对 `Loguru` 的支持，建议将日志导入到 Langfuse 或 Arize 等 LLM 监控平台。
3.  **超时控制**：在 `CodeAgent` 的工具执行中增加严格的 Timeout，防止死循环。
4.  **状态持久化**：目前 SmolAgents 偏向无状态（Stateless），在多轮对话场景下，需手动管理 `System Prompt` 或借助外部框架（如 Mem0）管理长期记忆。

---

## 相关阅读
- [[Agent/Agent_Frameworks/SmolAgents_Deep_Dive]]
- [[AI编程/Cursor_ClaudeCode_Comparison]]
- [[Agent/Agent_Skills/Tool_Calling_Best_Practices]]
