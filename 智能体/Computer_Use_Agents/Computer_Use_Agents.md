---
title: Computer Use Agents (桌面自动化/RPA)
category: 05-agents
tags: ["computer-use", "desktop-automation", "rpa", "gui-agent", "screen-understanding"]
summary: "Computer Use Agent 完整技术体系：屏幕理解、GUI 操作、Claude Computer Use/OpenAI Operator/Anthropic CUA、安全框架与 2026 企业自动化应用。"
created: 2026-07-21
updated: 2026-07-21
tier: supporting
sources: []

---
# Computer Use Agents

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

- [[智能体/|智能体系统]]
- [[智能体/Voice_Agents/|语音 Agent]]
- [[大模型/Multimodal_Models/|多模态模型]]
- [[编程/AI_IDE/AI_IDE_Landscape_2026|AI IDE]]
- [[伦理安全/|伦理安全]]
