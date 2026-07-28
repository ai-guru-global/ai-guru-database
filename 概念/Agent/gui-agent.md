---
title: "GUI Agent / 图形界面 Agent (UI-TARS / AutoDLD / ShowUI / Claude Computer Use)"
category: concepts
tags:
  - agent
  - gui-agent
  - ui-tars
  - autodld
  - computer-use
  - osworld
  - multimodal-agent
  - vision-language-action
aliases:
  - GUI Agent
  - UI-TARS
  - AutoDLD
  - ShowUI
  - OSWorld
  - Vision-Language-Action
  - Computer Use Agent
relationships:
  - target: "概念/computer-use"
    type: extends
  - target: "概念/code-agent"
    type: related_to
  - target: "概念/agent-benchmarks"
    type: related_to
  - target: "概念/agent-loop"
    type: related_to
summary: "GUI Agent 能"看屏幕"自主操作桌面/Web 应用——字节 UI-TARS、字节 AutoDLD、字节 ShowUI、Anthropic Computer Use、OpenAI Operator 在 OSWorld 基准从 14.9%(2024-10)飙到 38.1%(2026-02),逼近人类 72%。是 RPA 替代、UI 自动化测试、辅助残障人士的核心场景。"
lifecycle: reviewed
tier: core
created: 2026-07-24
updated: 2026-07-24
sources: []
name_zh: "GUI Agent / 图形界面 Agent"
---

# GUI Agent / 图形界面 Agent

> 中文简称：GUI Agent / 图形界面 Agent

> **一句话理解**:GUI Agent 是"用眼睛看屏幕 + 用手操作键鼠"——能完成"打开 Chrome → 登录 → 填表 → 提交"这种多步桌面/Web 任务,2024-10 之前 SOTA 14.9%,2026-02 达 38.1%,距离人类 72% 还差 2x,但已可替代 60% RPA 场景。

---

## 一、为什么 GUI Agent 重要?

- **无 API 的遗留系统**:银行 ERP、政务系统、老旧 ERP 没法接 API,只能靠 GUI
- **跨应用工作流**:Excel 数据 → 邮件发送 → 飞书通知,跨 3+ 应用协作
- **RPA 替代**:UiPath/Blue Prism 传统 RPA 贵、慢、脆,GUI Agent 灵活但稍慢
- **辅助残障人士**:屏幕操作 + 语音输入,平等使用
- **UI 自动化测试**:替代 Selenium,自然语言描述测试用例

---

## 二、关键术语中英对照

| 中文 | 英文 | 说明 |
|---|---|---|
| 图形界面 Agent | GUI Agent | 自主操作图形界面 |
| 视觉语言动作 | Vision-Language-Action(VLA) | 视觉 + 语言 + 动作联合建模 |
| 计算机使用 | Computer Use | Anthropic 命名,看屏+键鼠操作 |
| 屏幕理解 | Screen Understanding | 从截图中识别 UI 元素 |
| 元素定位 | Element Grounding | 把"那个蓝色按钮"映射到坐标 |
| 操作轨迹 | Action Trajectory | (观察, 思考, 动作) 序列 |
| 屏幕截图 | Screenshot | 当前屏幕画面 |
| 屏幕录制 | Screen Recording | 录屏用于训练/分析 |
| 光标移动 | Cursor Movement | 移动鼠标 |
| 点击 | Click | 左键/右键/双击 |
| 拖拽 | Drag & Drop | 拖动元素 |
| 键盘输入 | Keyboard Input | 键入文字、快捷键 |
| 滚动 | Scroll | 滚屏 |
| 悬浮 | Hover | 鼠标悬停 |
| 等待 | Wait | 等待页面加载 |
| 自我纠错 | Self-Correction | Agent 自己发现错误并修复 |
| 任务规划 | Task Planning | 拆解多步任务 |
| 反思 | Reflection | 评估自己的行为 |
| 记忆 | Memory | 短期/长期记忆 |
| 截图标注 | Screenshot Annotation | 在截图上画框/箭头 |
| 任务完成度 | Task Completion Rate | 端到端任务成功率 |
| 步骤准确率 | Step Accuracy | 每步操作正确率 |
| 操作安全 | Action Safety | 避免破坏性操作 |
| 确认机制 | Confirmation | 关键操作前人工确认 |

---

## 三、主流 GUI Agent 对比(2026-02 快照)

| 项目 | 厂商 | 基准 (OSWorld) | 类型 | 许可证 | 核心特色 |
|---|---|---|---|---|---|
| **Claude Opus 4.5 Computer Use** | Anthropic | 38.1% | 通用 LLM + 工具 | 商业 | 最强通用,API 即可 |
| **Claude Sonnet 4.5** | Anthropic | 32.4% | 通用 LLM + 工具 | 商业 | 性价比 |
| **UI-TARS** | 字节跳动 | 42.6% | 专用 GUI Agent | 部分开源 | 字节研发,SOTA 之一 |
| **UI-TARS-2** | 字节跳动 | 50.3% | 专用 GUI Agent | 开源 | 2025-Q4 发布 |
| **ShowUI** | 字节跳动 | 35.1% | 视觉 UI 模型 | 开源 | 视觉 token 高效 |
| **AutoDLD** | 字节跳动 | 33.7% | 自动化下载 GUI | 开源 | 自动化场景 |
| **Aguvis** | Salesforce | 37.2% | 视觉 GUI Agent | 开源 | 通用多平台 |
| **OpenCUA** | OpenAI 团队 | 34.8% | CUA 框架 | 开源 | 2025-12 |
| **WebVoyager** | 多机构 | 29.5% | 浏览器专用 | 学术 | Web 任务评测 |
| **OS-Atlas** | 字节跳动 | 31.4% | GUI Foundation Model | 开源 | GUI 基础模型 |
| **GPT-5 Operator** | OpenAI | 35.6% | Operator 浏览器 | 商业 | 2025-09 |
| **人类** | — | **72%** | 人类操作员 | — | 黄金标准 |

---

## 四、OSWorld 基准

- **由香港大学 + Salesforce 2024-09 发布**
- **真实 Ubuntu/Windows/macOS 桌面环境**,369 任务
- 任务类型:文件管理、应用配置、网页操作、多步工作流
- 评测指标:任务完成率(0/1)
- GitHub:[github.com/xlang-ai/OSWorld](https://github.com/xlang-ai/OSWorld)

**典型任务**:
- "用 LibreOffice Calc 创建一个销售数据透视表"
- "在 Thunderbird 邮件客户端配置 Gmail IMAP"
- "用 GIMP 把图片裁剪并应用滤镜"
- "在 VSCode 安装 Python 扩展并运行 hello world"

---

## 五、UI-TARS(字节跳动)实战

### 5.1 架构

- 基于 VLM(InternVL-2 自研)
- 屏幕理解 + 元素定位 + 动作预测三合一
- 在线/离线训练混合

### 5.2 关键能力

- 跨平台:Windows / macOS / Linux / Android / iOS
- 多步任务规划(平均 15+ 步)
- 自我纠错(任务失败后分析原因重试)
- 中文 UI 原生支持(国产应用)

### 5.3 部署

```bash
# 开源版
git clone https://github.com/bytedance/UI-TARS
cd UI-TARS
pip install -r requirements.txt
python -m ui_tars.run --model_path ui-tars-7b
```

---

## 六、Claude Computer Use(Anthropic)实战

### 6.1 API 调用

```python
import anthropic

client = anthropic.Anthropic()
response = client.beta.messages.create(
    model="claude-opus-4-5",
    max_tokens=1024,
    tools=[
        {
            "type": "computer_20241022",
            "name": "computer",
            "display_width_px": 1920,
            "display_height_px": 1080,
        }
    ],
    messages=[
        {"role": "user", "content": "在 Chrome 打开 github.com,登录我的账号"}
    ]
)
```

### 6.2 工具集

- `screenshot`:截图
- `left_click` / `right_click` / `double_click`:点击
- `type`:键入文字
- `key`:按快捷键
- `scroll`:滚动
- `cursor_position`:光标位置

---

## 七、关键技术挑战

### 7.1 视觉理解

- **小元素定位**:像素级精确度要求
- **动态 UI**:弹窗、动画、加载状态
- **多语言 UI**:中日韩阿拉伯文 RTL

### 7.2 动作规划

- **长时任务**:15-50 步,容易遗忘
- **错误恢复**:点错按钮如何回退
- **跨应用**:不同 App 行为差异

### 7.3 安全

- **破坏性操作**:rm -rf /、删除邮件、付款
- **数据泄露**:截图含密码、PII
- **多租户隔离**:一台机器多用户

---

## 八、生产最佳实践

1. **优先 API 集成,GUI 兜底**:能用 API 接的系统不要走 GUI Agent。
2. **小任务用 Sonnet 4.5 / GPT-5 Operator**:性价比高,延迟 < 3s。
3. **复杂任务用 Opus 4.5 / UI-TARS-2**:准确率高,多步任务必备。
4. **国产应用用 UI-TARS**:中文 UI 原生支持,准确率比通用模型高 10-15%。
5. **沙箱隔离 + Docker**:Agent 不能跑在生产环境,Linux 容器是底线。
6. **截图脱敏**:进入 Agent 前过滤密码/邮箱/电话。
7. **高危操作二次确认**:付款、删除、发送,必须人工 click 确认。
8. **录制回放训练数据**:人工操作 + 录屏 = 训练数据,持续优化。
9. **任务成功率监控**:Langfuse + 自定义指标,实时观察。
10. **慢操作用规划后批处理**:Agent 慢但准,适合批处理任务。

---

## 九、2026 生态速览

| 维度 | 2026 状态 |
|---|---|
| **OSWorld SOTA** | UI-TARS-2 50.3%,Claude Opus 4.5 38.1%,人类 72% |
| **核心厂商** | 字节(UI-TARS/ShowUI/AutoDLD)/ Anthropic / OpenAI / Salesforce |
| **开源生态** | UI-TARS / OS-Atlas / Aguvis / OpenCUA |
| **RPA 替代** | UI Path / Blue Prism 纷纷集成 LLM,市场份额被侵蚀 |
| **企业应用** | 银行 ERP 录入 / 政务系统 / 客服辅助 / 财务对账 |
| **中国厂商** | 字节 UI-TARS / 阿里心言 / 智谱 GLM-PC / Anthropic Computer Use |
| **AR 眼镜集成** | Meta Ray-Ban / Apple Vision Pro / 字节 Pico 探索 |
| **标准化** | OSWorld / WebArena / ScreenAgent / AndroidWorld |
| **监管** | 欧盟 AI Act 高风险场景需人类监督 |
| **主要竞品** | UI Path / Blue Prism / Automation Anywhere / Workato |

---

## 十、See Also(官方源)

### 商业产品

- Claude Computer Use [docs.claude.com/en/docs/agents-and-tools/tool-use/computer-use](https://docs.claude.com/en/docs/agents-and-tools/tool-use/computer-use)
- OpenAI Operator [openai.com/index/introducing-operator](https://openai.com/index/introducing-operator/)

### 开源项目

- UI-TARS [github.com/bytedance/UI-TARS](https://github.com/bytedance/UI-TARS)
- OS-Atlas [github.com/OS-Copilot/OS-Atlas](https://github.com/OS-Copilot/OS-Atlas)
- Aguvis [github.com/xlang-ai/Aguvis](https://github.com/xlang-ai/Aguvis)
- OpenCUA [github.com/xlang-ai/OpenCUA](https://github.com/xlang-ai/OpenCUA)
- ShowUI [github.com/microsoft/ShowUI](https://github.com/microsoft/ShowUI)

### 评测基准

- OSWorld [github.com/xlang-ai/OSWorld](https://github.com/xlang-ai/OSWorld)
- WebArena [github.com/web-arena-x/webarena](https://github.com/web-arena-x/webarena)
- ScreenAgent [github.com/screenagent](https://github.com/screenagent)
- AndroidWorld [github.com/google-research/android_world](https://github.com/google-research/android_world)

---

## 十一、相关概念卡

- [[概念/code-agent|Code Agent]]
- [[概念/agent-benchmarks|Agent Benchmarks]]
- [[概念/agent-loop|Agent Loop]]
- [[概念/mcp|Mcp]]
- [[概念/agent-framework|Agent Framework]]
- [[概念/tool-use|Tool Use]]
- [[概念/computer-use|Computer Use]]
- [[概念/llm-as-judge|Llm As Judge]]
