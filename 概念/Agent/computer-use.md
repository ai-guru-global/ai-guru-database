---
title: "Computer Use / 计算机使用 (Claude / GPT-4o Operator / 屏幕 + 键鼠操作)"
category: concepts
tags:
  - agent
  - computer-use
  - osworld
  - claude-computer-use
  - gpt4o-operator
  - gui-agent
  - screen-control
  - mouse-keyboard
aliases:
  - Computer Use
  - Claude Computer Use
  - GPT-4o Operator
  - Screen Control
  - Mouse & Keyboard Agent
relationships:
  - target: "概念/gui-agent"
    type: extends
  - target: "概念/agent-benchmarks"
    type: related_to
  - target: "概念/mcp"
    type: related_to
  - target: "概念/tool-use"
    type: related_to
summary: "Computer Use 是 2024-10 OpenAI / Anthropic 同月推出的"屏幕 + 键鼠"AI 能力——让 LLM 直接操控电脑(截图理解 + 鼠标点击 + 键盘输入),无需 API。Claude Opus 4.5 在 OSWorld 38.1%,接近人类 72%。是 RPA 终极替代 + 通用 Agent 入口。"
lifecycle: reviewed
tier: core
created: 2026-07-24
updated: 2026-07-24
sources: []
---

# Computer Use / 计算机使用

> **一句话理解**:Computer Use 让 LLM 像人一样"看屏幕 → 想清楚 → 动鼠标/键盘",能完成任何 GUI 任务(即使没有 API)。2024-10 OpenAI o1 / Anthropic Claude 3.5 同月发布,2026-02 准确率 38.1%(人类 72%),是"通用 Agent 终极形态"。

---

## 一、与 GUI Agent 的关系

- **GUI Agent**:更广概念,包括专用模型(UI-TARS / ShowUI)
- **Computer Use**:特指"通用 LLM(Claude/GPT-4o)通过工具调用实现的屏幕操控"
- **核心差异**:Computer Use 不需要专用模型,通用 LLM 即可
- **关系**:Computer Use 是 GUI Agent 的子集 + 通用化

---

## 二、关键术语中英对照

| 中文 | 英文 | 说明 |
|---|---|---|
| 计算机使用 | Computer Use | Anthropic 命名 |
| 操作员 | Operator | OpenAI 命名 |
| 屏幕观察 | Screen Observation | 截图 |
| 鼠标点击 | Mouse Click | left/right/double |
| 键盘输入 | Keyboard Input | type/key |
| 坐标定位 | Coordinate Grounding | 把"那个按钮"映射到 (x,y) |
| 元素识别 | Element Recognition | 识别 UI 元素 |
| 滚动 | Scroll | 滚屏 |
| 拖拽 | Drag & Drop | 拖动元素 |
| 悬浮 | Hover | 鼠标悬停 |
| 等待 | Wait | 等待页面加载 |
| 缩放 | Zoom | 缩放视图 |
| 截图 | Screenshot | 当前画面 |
| 屏幕录像 | Screen Recording | 录屏 |
| 任务规划 | Task Planning | 拆解多步任务 |
| 自我观察 | Self-Observation | Agent 截图看自己做的 |
| 错误恢复 | Error Recovery | 失败后回退 |
| 状态机 | State Machine | Agent 状态管理 |
| 人机协作 | Human-in-the-Loop | 关键操作人工确认 |
| 操作沙箱 | Action Sandbox | 安全执行环境 |
| 工具调用 | Tool Calling | 函数调用规范 |
| 多模态 | Multimodal | 视觉 + 文本 + 音频 |

---

## 三、主流 Computer Use 系统对比(2026-02 快照)

| 系统 | 厂商 | OSWorld | 跨平台 | 延迟 | 许可证 |
|---|---|---|---|---|---|
| **Claude Opus 4.5 Computer Use** | Anthropic | 38.1% | Win/Mac/Linux | 300-700ms | 商业 |
| **Claude Sonnet 4.5** | Anthropic | 32.4% | Win/Mac/Linux | 250-600ms | 商业 |
| **GPT-5 Operator** | OpenAI | 35.6% | Web 优先 | 200-500ms | 商业 |
| **GPT-4o Operator** | OpenAI | 28.7% | Web 优先 | 200-500ms | 商业(2024-10) |
| **Gemini 2.5 Pro Computer Use** | Google | 30.2% | Web/Mobile | 300-600ms | 商业(2025-04) |
| **UI-TARS-2** | 字节跳动 | 50.3% | Win/Mac/Linux/Mobile | 200-500ms | 开源 |
| **OS-Atlas** | 字节跳动 | 31.4% | Win/Mac/Linux | — | 开源 |
| **Aguvis** | Salesforce | 37.2% | Win/Mac/Linux | — | 开源 |
| **OpenCUA** | OpenAI 团队 | 34.8% | Win/Mac/Linux | — | 开源(2025-12) |
| **人类** | — | 72% | 全部 | 200-400ms | — |

---

## 四、Claude Computer Use 架构

### 4.1 工具集

Anthropic 官方提供的 computer use 工具:

```json
[
  {
    "type": "computer_20241022",
    "name": "computer",
    "display_width_px": 1920,
    "display_height_px": 1080,
    "display_number": 1
  }
]
```

可用动作:
- **screenshot**:截图
- **left_click**:左键点击(x, y)
- **right_click**:右键
- **double_click**:双击
- **type**:键入文字
- **key**:按快捷键
- **scroll**:滚动(direction, amount, x, y)
- **cursor_position**:获取光标位置
- **hold_key**:长按
- **wait**:等待
- **zoom**:缩放
- **screenshot_region**:区域截图

### 4.2 API 调用

```python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-opus-4-5",
    max_tokens=4096,
    tools=[
        {
            "type": "computer_20241022",
            "name": "computer",
            "display_width_px": 1920,
            "display_height_px": 1080,
        }
    ],
    messages=[
        {
            "role": "user",
            "content": "在 Chrome 打开 github.com,登录我的账号,找到 ai-guru-global/ai-guru-database,点 Issues tab"
        }
    ]
)

# 解析 Agent 决策
for block in response.content:
    if block.type == "tool_use" and block.name == "computer":
        action = block.input
        print(f"Action: {action}")
```

### 4.3 Agent 循环

```python
while not done:
    response = client.beta.messages.create(...)
    
    if response.stop_reason == "end_turn":
        done = True
        break
    
    for block in response.content:
        if block.type == "tool_use":
            # 执行 Agent 决策
            execute_action(block.input)
            # 截图反馈
            screenshot = take_screenshot()
            # 继续对话
            messages.append({
                "role": "user",
                "content": [
                    {"type": "tool_result", "tool_use_id": block.id, "content": screenshot}
                ]
            })
```

---

## 五、OpenAI Operator 实战

### 5.1 特点

- 浏览器专用(2024-10 首发)
- 内置浏览器引擎(Chromium)
- 2025-09 升级为 GPT-5 Operator(全平台)
- 与 ChatGPT 集成

### 5.2 与 Claude 对比

| 维度 | Claude Computer Use | GPT-5 Operator |
|---|---|---|
| 通用性 | 桌面 + Web | Web 优先(2025-09 全平台) |
| 浏览器 | 用户已有 Chrome | 内置 |
| 安全 | 系统级权限 | 沙箱浏览器 |
| 速度 | 较慢(系统级截图) | 较快(浏览器内) |
| 准确率 | 38.1% (OSWorld) | 35.6% (OSWorld) |

---

## 六、生产最佳实践

1. **Linux 容器沙箱运行**:不要直接跑在生产机器,隔离破坏性操作。
2. **高危操作必确认**:rm -rf、付款、删除邮件、Ctrl+Z / Ctrl+Alt+Del,必须人工 click 确认。
3. **数据脱敏**:截图前过滤密码 / 邮箱 / 电话 / API Key。
4. **录制 + 日志**:所有动作录像 + 结构化日志,事后审计。
5. **错误恢复机制**:每步执行前快照,可回滚。
6. **限速 + 限范围**:限制 Agent 只能在指定窗口操作,不能动其他应用。
7. **多模态输入**:Agent 决策可结合语音、文字、图像多模态。
8. **任务分级**:简单任务全自动,复杂任务分步确认。
9. **MCP Server 集成**:能走 API 的走 API,Computer Use 兜底。
10. **模型选择按成本**:Haiku 4.5 适合分类,Sonnet 4.5 主力,Opus 4.5 复杂任务。
11. **可观测性**:Langfuse 记录所有决策 + 截图,debug + 优化。
12. **A/B 测试提示词**:系统提示 / 任务描述的小改动可显著影响成功率。

---

## 七、关键挑战

### 7.1 视觉理解

- 小元素定位(< 50px 按钮)
- 动态 UI(弹窗、动画)
- 模糊/低分辨率屏幕

### 7.2 规划

- 长任务 50+ 步,易遗忘
- 错误恢复策略
- 状态机复杂度爆炸

### 7.3 成本

- 每次截图 ~1-5K tokens
- Claude Opus 4.5 任务可能 100+ 步,成本 $1+
- GPT-5 Operator 每次对话 $0.1-1

### 7.4 安全

- Agent 可访问整个系统
- 误操作风险高
- 数据泄露风险

---

## 八、2026 生态速览

| 维度 | 2026 状态 |
|---|---|
| **OSWorld SOTA** | UI-TARS-2 50.3%(专用) / Claude Opus 4.5 38.1%(通用) |
| **主要厂商** | Anthropic / OpenAI / Google / 字节 / Salesforce |
| **开源生态** | UI-TARS / OS-Atlas / Aguvis / OpenCUA |
| **企业部署** | 自托管开源 + Claude / OpenAI API |
| **沙箱工具** | E2B / Docker / Anthropic Sandbox / Browserbase |
| **操作系统** | macOS Sequoia / Windows 11 24H2 / Ubuntu 24.04 |
| **API 标准化** | computer_20241022 工具成为事实标准 |
| **成本** | 简单任务 $0.1,复杂任务 $1-5 |
| **ARR 规模** | 整体 Computer Use 商业服务 $200M+ |
| **监管** | 欧盟 AI Act 高风险任务需人类监督 |

---

## 九、See Also(官方源)

### 商业产品

- Claude Computer Use [docs.claude.com/en/docs/agents-and-tools/tool-use/computer-use](https://docs.claude.com/en/docs/agents-and-tools/tool-use/computer-use)
- OpenAI Operator [openai.com/index/introducing-operator](https://openai.com/index/introducing-operator/)
- Google Computer Use [ai.google.dev/gemini-api](https://ai.google.dev/gemini-api)

### 沙箱与执行

- E2B [e2b.dev](https://e2b.dev/)
- Docker Sandboxes [docker.com](https://www.docker.com/)
- Browserbase [browserbase.com](https://www.browserbase.com/)

### 开源项目

- UI-TARS [github.com/bytedance/UI-TARS](https://github.com/bytedance/UI-TARS)
- OS-Atlas [github.com/OS-Copilot/OS-Atlas](https://github.com/OS-Copilot/OS-Atlas)
- Aguvis [github.com/xlang-ai/Aguvis](https://github.com/xlang-ai/Aguvis)
- OpenCUA [github.com/xlang-ai/OpenCUA](https://github.com/xlang-ai/OpenCUA)
- ShowUI [github.com/microsoft/ShowUI](https://github.com/microsoft/ShowUI)

### 评测

- OSWorld [github.com/xlang-ai/OSWorld](https://github.com/xlang-ai/OSWorld)
- WebArena [github.com/web-arena-x/webarena](https://github.com/web-arena-x/webarena)
- ScreenAgent [github.com/screenagent](https://github.com/screenagent)

---

## 十、相关概念卡

- [[概念/gui-agent|Gui Agent]]
- [[概念/agent-benchmarks|Agent Benchmarks]]
- [[概念/agent-loop|Agent Loop]]
- [[概念/mcp|Mcp]]
- [[概念/tool-use|Tool Use]]
- [[概念/agent-framework|Agent Framework]]
- [[概念/code-agent|Code Agent]]
- [[概念/voice-agent|Voice Agent]]
