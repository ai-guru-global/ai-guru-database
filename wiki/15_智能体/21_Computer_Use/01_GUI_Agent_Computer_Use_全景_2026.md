---
title: GUI Agent 与 Computer Use 全景 2026
category: 15-agent-applications
tags: ["computer-use", "gui-agent", "browser-agent", "工程系列", "2026"]
summary: "Computer Use / GUI Agent / Browser Use 三概念辨析、像素/DOM/无障碍树/VLA 四条技术路线对比、能力现状（OSWorld 通用模型 38–50% vs 人类 72%）、与本库既有内容的分工导航。"
created: 2026-11-04
updated: 2026-11-04
tier: core
aliases: [Computer Use 全景, GUI Agent 全景, CUA 全景]
sources:
  - "https://arxiv.org/abs/2310.08560"
review_by: 2027-01-25
name_zh: "GUI Agent 与 Computer Use 全景"
---

# GUI Agent 与 Computer Use 全景 2026（工程系列入口）

> 中文简称：GUI Agent 与 Computer Use 全景

> **一句话理解**: 让 AI「看屏幕、动键鼠」替人操作电脑——2026 年通用模型在 OSWorld 上做到 38–50%（人类 72%），能力够到演示、够不到放任；本系列讲的就是从「能演示」到「能上生产」中间缺的工程。

---

## 1. 三个概念辨析

面试和选型中最容易混的三个词，按「操作对象 + 风险等级」分：

| 维度 | Computer Use | GUI Agent | Browser Use |
|------|-------------|-----------|-------------|
| 操作对象 | 完整 OS（桌面级） | 任意图形界面（桌面/Web/移动） | 仅浏览器内 |
| 动作空间 | 截图 + 键鼠全套 | 同左（含移动端手势） | 受限于浏览器事件（点击/输入/导航） |
| 典型实现 | Claude Computer Use、GPT-5 Operator | UI-TARS、Aguvis、ShowUI | browser-use、Playwright Agent |
| 爆炸半径 | 大（整个系统） | 大 | 小（沙箱浏览器即可隔离） |
| 适合 | 遗留系统、无 API 的桌面软件 | 跨平台通用操作 | 网页任务（最易落地、最先产品化） |

关系一句话：**Browser Use ⊂ GUI Agent ⊂ Computer Use 的风险递增序列**——落地顺序也正好相反，从 Browser Use 起步、逐步放开权限。

## 2. 四条技术路线

| 路线 | 感知表征 | 代表 | 优点 | 短板 |
|------|---------|------|------|------|
| 像素截图（+SoM 标注） | 截图 / Set-of-Mark 画框编号 | Claude Computer Use、GPT Operator | 任意界面通用、无需侵入 | 小元素 grounding 难、每步截图 token 贵 |
| DOM / 无障碍树 | 结构化文本 | 早期 WebVoyager、Playwright 类 | 精准、便宜、可访问性好 | 只覆盖 Web / 无障碍树完备的应用 |
| VLA 专用模型 | 截图端到端出动作 | UI-TARS-2、ShowUI、OS-Atlas | OSWorld 最高（50.3%）、延迟低 | 需专用训练与部署 |
| 混合路由 | DOM 优先、截图兜底 | 生产系统主流做法 | 兼顾精度与覆盖 | 路由逻辑复杂度 |

工程结论：**能走结构化表征（DOM/无障碍树/API）就不要走像素**——便宜一个数量级且精度高；像素路线的价值在于兜住「什么结构都没有」的遗留界面。

## 3. 能力现状（2026 快照）

- OSWorld（真实桌面 369 任务）：专用模型 UI-TARS-2 约 50.3%，通用模型 Claude Opus 4.5 约 38.1%，人类约 72%（完整对比表见 [[概念/Agent/gui-agent|GUI Agent 概念卡]]，数字随代际快速变化，`review_by: 2027-01-25` 复核）。
- 差距的本质不在「点不准」单点，而在**长任务累积误差**与**失败后不自知**——这正是 [[15_智能体/21_Computer_Use/04_评测与失败模式|评测与失败模式]] 一章的主题。
- 安全约束先于能力约束到达生产：模型能做的操作，治理上不允许全放——[[15_智能体/21_Computer_Use/03_权限与安全模型|权限与安全模型]] 一章给出分级框架。

## 4. 本库内容地图（分工导航）

| 内容 | 视角 | 什么时候读 |
|------|------|-----------|
| [[15_智能体/01_Agent基础/18_Computer_Use_Agent_2026\|01/18 入门综述]] | VLM 屏幕解析 + Set-of-Mark 入门 | 第一次接触概念 |
| [[15_智能体/17_Agent应用/01_Computer_Use_Agent\|17/01 RPA 与企业自动化]] | 桌面自动化/RPA 替代、企业落地场景 | 业务选型时 |
| [[概念/Agent/computer-use\|computer-use 概念卡]] | 产品对比、OSWorld 数字、官方源 | 查最新格局 |
| [[概念/Agent/gui-agent\|gui-agent 概念卡]] | 术语表、专用模型谱系 | 查术语 |
| [[15_智能体/21_Computer_Use/02_技术拆解_感知_决策_执行\|02 技术拆解]] | 感知-决策-执行工程拆解（伪代码 + 参数） | **动手实现时（核心）** |
| [[15_智能体/21_Computer_Use/03_权限与安全模型\|03 权限与安全]] | 分级权限 + 沙箱故事线 | 上生产前 |
| [[15_智能体/21_Computer_Use/04_评测与失败模式\|04 评测与失败模式]] | 基准 + 失败归因 + 自建 checklist | 评估效果时 |
| [[21_面试岗位/28_Agent_Runtime工程师/15_Computer_Use_快问快答_30题\|28/15 快答 30 题]] | 面试冲刺 | 考前 |

## Related

- [[概念/Agent/browser-agent|Browser Agent]]
- [[15_智能体/17_Agent应用/02_Deep_Research_Agent|Deep Research（同谱系低风险端）]]
- [[15_智能体/20_Agentic_Infra/09_Sandbox_隔离技术与沙箱平台选型|Sandbox 隔离技术与沙箱平台选型]]
- [[15_智能体/README|Agent 生产部署（章节）]]

---

*Last updated: 2026-11-04*
