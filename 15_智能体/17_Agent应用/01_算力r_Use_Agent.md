---
title: Computer Use Agents (桌面自动化/RPA)
category: 05-agents
tags: ["computer-use", "desktop-automation", "rpa", "gui-agent", "screen-understanding"]
summary: "Computer Use Agent 完整技术体系：屏幕理解、GUI 操作、Claude Computer Use/OpenAI Operator/Anthropic CUA、安全框架与 2026 企业自动化应用。"
created: 2026-07-21
updated: 2026-07-21
tier: supporting
sources: []

name_zh: "桌面自动化/RPA"
---
# Computer Use Agents

> 中文简称：桌面自动化/RPA

## 1. 概述

```
Computer Use Agent = AI 操作电脑

能力:
- 看: 理解屏幕截图 (视觉)
- 想: 规划操作步骤 (推理)
- 做: 点击/输入/滚动 (操作)
- 验: 确认操作结果 (反馈)

2026 产品:
- Claude Computer Use (Anthropic): API 级桌面控制
- OpenAI Operator: 浏览器自动化
- Google Project Mariner: Chrome 操作
- Microsoft UFO: Windows 桌面 Agent
- 开源: OS-Copilot / SeeClick / CogAgent

应用:
- RPA 升级: 传统规则 RPA → AI 自适应 RPA
- 软件测试: 自动化 UI 测试
- 数据录入: 跨系统数据搬运
- 客服: 操作内部系统
```

## 2. 技术架构

### 2.1 核心循环

```python
class ComputerUseAgent:
    """
    Computer Use Agent 核心循环:
    截图 → 理解 → 规划 → 操作 → 验证 → 重复
    """
    def __init__(self, vision_model, action_space):
        self.vision = vision_model  # 屏幕理解
        self.actions = action_space  # 可用操作
        self.history = []
    
    async def complete_task(self, task_description):
        """完成一个桌面任务"""
        for step in range(50):  # 最多 50 步
            # 1. 截图
            screenshot = await self.capture_screen()
            
            # 2. 理解当前状态
            state = await self.vision.analyze(screenshot)
            
            # 3. 决定下一步操作
            action = await self.decide_action(
                task=task_description,
                current_state=state,
                history=self.history,
            )
            
            # 4. 执行操作
            if action.type == "done":
                return {"status": "success", "steps": step + 1}
            
            result = await self.execute_action(action)
            self.history.append((state, action, result))
            
            # 5. 验证
            if not await self.verify_progress(task_description):
                await self.handle_stuck()
        
        return {"status": "timeout"}
    
    async def decide_action(self, task, current_state, history):
        """LLM 决策"""
        prompt = f"""
任务: {task}
当前屏幕: [截图]
历史操作: {self.format_history(history)}

可选操作:
- click(x, y): 点击坐标
- type(text): 输入文字
- key(combo): 按键组合 (如 ctrl+c)
- scroll(direction, amount): 滚动
- screenshot(): 重新截图
- done(): 任务完成

请选择下一步操作:
"""
        return await self.llm.generate_action(prompt)
```

### 2.2 操作空间

```python
ACTION_SPACE = {
    "鼠标": {
        "click": "左键单击 (x, y)",
        "double_click": "双击",
        "right_click": "右键",
        "drag": "拖拽 (x1,y1) → (x2,y2)",
        "scroll": "滚轮 (方向, 距离)",
    },
    "键盘": {
        "type": "输入文字",
        "key": "按键/组合键",
        "hotkey": "快捷键 (ctrl+c, alt+tab)",
    },
    "系统": {
        "screenshot": "截图",
        "wait": "等待 (加载)",
        "open_app": "打开应用",
        "switch_window": "切换窗口",
    },
}
```

## 3. 安全框架

```python
COMPUTER_USE_SAFETY = {
    "权限控制": [
        "沙箱环境运行 (虚拟机/容器)",
        "白名单应用 (只能操作指定程序)",
        "禁止操作 (不能删除文件/格式化)",
    ],
    "确认机制": [
        "高风险操作需人工确认",
        "不可逆操作二次确认",
        "敏感数据操作审批",
    ],
    "监控": [
        "全程录屏",
        "操作日志",
        "异常行为检测",
    ],
    "限制": [
        "最大操作步数",
        "时间超时",
        "网络访问限制",
    ],
}
```

## 4. 交叉引用

- [[15_智能体/|智能体系统]]
- [[15_智能体/17_Agent应用/03_Voice_Agent|语音 Agent]]
- [[05_大模型/09_多模态模型/|多模态模型]]
- [[16_编程/06_工具对比/AI_IDE_Landscape_2026|AI IDE]]
- [[17_伦理安全/|伦理安全]]

## 附录：核心概念速查

| 概念 | 说明 | 应用场景 |
|------|------|----------|
| Agent Loop | 感知-思考-行动循环 | 核心执行流程 |
| Tool Use | 调用外部工具/API | 扩展能力 |
| Memory | 短期/长期记忆 | 上下文维护 |
| Planning | 任务分解与排序 | 复杂任务 |
| Reflection | 自我评估改进 | 质量提升 |
| Multi-Agent | 多Agent协作 | 分布式任务 |

## 附录：技术栈对比

| 框架/工具 | 特点 | 适用场景 | 成熟度 |
|----------|------|----------|--------|
| LangChain | 链式调用 | 通用Agent | ★★★★☆ |
| LangGraph | 图结构编排 | 复杂流程 | ★★★★☆ |
| AutoGen | 多Agent对话 | 协作任务 | ★★★★☆ |
| CrewAI | 角色分工 | 团队模拟 | ★★★☆☆ |
| OpenAI SDK | 官方框架 | 快速原型 | ★★★★☆ |
| Semantic Kernel | 企业级 | .NET/Java | ★★★★☆ |

## 附录：学习路径

| 阶段 | 推荐内容 | 目标 |
|------|----------|------|
| 入门 | 基础概念文档 | 理解Agent |
| 进阶 | 本文档深度内容 | 掌握技术 |
| 实践 | 动手项目 | 构建应用 |
| 前沿 | 最新论文/产品 | 跟踪发展 |

## 附录：常见问题

| 问题 | 解答 |
|------|------|
| Agent和Chatbot的区别？ | Agent能自主决策+使用工具+持续执行 |
| 需要什么前置知识？ | LLM基础+编程+系统设计 |
| 如何评估Agent？ | 任务完成率+效率+安全性 |
| 2026年趋势？ | 多Agent协作/企业级/具身智能 |

## 附录：术语表

| 术语 | 英文 | 说明 |
|------|------|------|
| 智能体 | Agent | 自主决策AI系统 |
| 工具调用 | Tool Use | 使用外部工具 |
| 记忆 | Memory | 上下文/历史 |
| 规划 | Planning | 任务分解 |
| 反思 | Reflection | 自我评估 |
| 编排 | Orchestration | 流程管理 |
| 协议 | Protocol | 通信标准 |
| 护栏 | Guardrails | 安全约束 |

## 附录：检查清单

| 检查项 | 说明 | 状态 |
|--------|------|------|
| 理解核心概念 | Agent架构 | ☐ |
| 掌握工具调用 | MCP/Function Calling | ☐ |
| 了解记忆机制 | 短期/长期 | ☐ |
| 理解规划推理 | CoT/ReAct | ☐ |
| 动手实践 | 构建Agent | ☐ |
| 了解评估方法 | 质量度量 | ☐ |

> 💡 智能体是AI从"对话"走向"行动"的关键跨越。掌握Agent开发，是2026年AI工程师的核心竞争力。

---
*Last updated: 2026-07-21*
