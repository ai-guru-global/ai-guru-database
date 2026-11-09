---
线索: A2A协议
主题: 智能体平台
别名: [A2A, Agent2Agent, 智能体互操作, Google ADK]
状态: 活跃
创建: 2026-10-27
更新: 2026-10-27
关键角色: [Google, Linux Foundation, 微软, Anthropic]
---

# A2A协议

> 智能体之间的「TCP」：Google 发起的 Agent2Agent 开放协议，补 MCP（智能体↔工具）缺失的另一半互操作拼图。

## 概述

A2A（Agent2Agent）是 Google 2025 年 4 月发布的开放协议，解决跨厂商智能体之间的发现、能力协商与任务协作——与 MCP（智能体连接工具/数据，Anthropic 2024-11 发布）正交互补：MCP 是「Agent↔Tools」，A2A 是「Agent↔Agent」。2025 年 6 月项目移交 Linux Foundation 中立治理，成为智能体互操作的事实标准候选之一。

### 2026-06

- **2026-06-22** · [Google ADK 与 A2A 协议：跨语言多智能体团队构建实战](https://aihot.news/items/cmqpgzgfq00hislp5hwlbgz0h)
  Google Developers Blog 官方教程——A2A 与 Agent Development Kit 的组合进入开发者日常工作流。

### 2025-06

- **2025-06** · A2A 移交 Linux Foundation
  Google 将 A2A 项目捐赠给 Linux Foundation 中立治理，微软、Salesforce、SAP 等数十家企业参与——协议竞争以「开放中立」定调。

### 2025-04

- **2025-04** · A2A 协议发布
  Google 联合 50 余家初始伙伴发布 Agent2Agent 协议；同月 Demis Hassabis 确认 Gemini 将支持 MCP——Google 对「A2A 与 MCP 互补而非对抗」的公开定位。→ [[智能体平台/MCP协议]]

## 分析

1. **协议层的「双正交」格局成型**：MCP（Anthropic 系）+ A2A（Google 系/LF 治理）分别覆盖工具连接与智能体协作，两大阵营在协议层各执一端而非正面火并——智能体互联网的 OSI 时刻。
2. **中立化是推广的前置条件**：A2A 入 LF 与 MCP 的开放治理异曲同工——协议想成为标准就不能被单一厂商的日程表绑架。
3. **落地考验在异构组织间**：跨企业的多智能体协作（采购、供应链）才是 A2A 的真正考场，2026 年的教程热说明开发者侧教育已开始。

## 关联线索

- [[智能体平台/MCP协议]]
- [[智能体平台/Agent框架]]
- [[智能体平台/ClaudeAgentSDK]]
