---
title: GLM 使用指南
category: 16-ai-coding-tools
tags: ["ai-coding", "code-generation", "cursor", "github-copilot"]
summary: "> **一句话**: 智谱 GLM 系列模型通过 OpenCode 和 Crush 接入，是高性价比的国产编程辅助工具，需注意周额度刷新周期。"
created: 2026-05-31
updated: 2026-05-31
tier: supporting
aliases:
  - "Glm Guide"
  - "GLM Guide"
  - GLM_Guide
sources: []

---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](治理/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->
# GLM 使用指南

> **一句话**: 智谱 GLM 系列模型通过 OpenCode 和 Crush 接入，是高性价比的国产编程辅助工具，需注意周额度刷新周期。

---

## 1. 概述

### 定位

| 维度 | 说明 |
|------|------|
| **类型** | AI [[概念/ai-technology-landscape|大语言模型]]（国产） |
| **开发商** | 智谱 AI (Zhipu AI) |
| **接入方式** | OpenCode + GLM / Crush + GLM |
| **适用** | 日常编程、数据库构建、技能开发 |
| **官网** | https://bigmodel.cn |

### 核心能力

```
GLM 生态:
├── GLM 系列模型
│   ├── GLM-4（旗舰）
│   ├── GLM-4-Plus
│   └── 代码生成优化版本
├── 接入组合
│   ├── OpenCode + GLM — Agent CLI 编程
│   └── Crush + GLM — 终端编程辅助
└── 额度管理
    └── 周额度制（每周五零点刷新）
```

---

## 2. 账户与额度

| 项目 | 详情 |
|------|------|
| **额度周期** | 周额度制 |
| **刷新时间** | 每周五 00:00 |
| **消耗速度** | 本周内可能用尽 |
| **状态** | 活跃（需关注周额度） |

---

## 3. 快速开始

### 3.1 获取 API Key

1. 访问 https://bigmodel.cn 注册/登录
2. 进入 API Keys 管理页面
3. 创建新密钥

### 3.2 OpenCode + GLM 配置

```bash
# OpenCode 配置 GLM Provider
# 编辑 opencode.json 或通过 TUI 配置

{
  "provider": {
    "glm": {
      "apiKey": "your-glm-api-key",
      "baseURL": "https://open.bigmodel.cn/api/paas/v4"
    }
  },
  "model": {
    "default": "glm-4-plus"
  }
}
```

### 3.3 Crush + GLM 配置

```bash
# Crush 是轻量终端 AI 编程工具
# 配置 GLM 作为后端模型

crush config set provider glm
crush config set api-key your-glm-api-key
crush config set base-url https://open.bigmodel.cn/api/paas/v4
```

---

## 4. 使用场景与输出

| 输出项目 | 说明 | 使用组合 |
|----------|------|----------|
| **hackcore-db** | 核心数据库项目 | Crush + GLM |
| **skills4coder** | 编程技能训练 | OpenCode + GLM |

---

## 5. 最佳实践

- **周额度规划**: 每周五零点刷新，周一至周四集中使用，周五后额度恢复
- **模型选择**: 日常编程用 GLM-4，复杂任务用 GLM-4-Plus
- **组合使用**: OpenCode 用于大型 Agent 任务，Crush 用于快速问答和代码片段
- **额度耗尽应对**: 周额度用尽后切换到其他工具（如 Kimi、MiniMax）

---

## 6. 注意事项

- 周额度刷新机制特殊（非月度），需要更频繁的额度管理
- 额度通常在本周内耗尽，建议制定周使用计划
- 与 OpenCode 的集成需要正确的 API 配置
- GLM 的中文能力优秀，适合中文注释和文档生成

---

## 7. 与 OpenCode 集成详情

参见 [OpenCode 集成指南](.././OpenCode/23-opencode-providers-models.md)

---

*最后更新: 2026-05*

## Related

- [[编程/Theory/AI_Coding_Theory]] — AI 辅助编程理论基础 (共享: ai-coding, code-generation, cursor, github-copilot)
- [[编程/Tools/CodeBuddy_Guide]] — CodeBuddy / WorkBuddy 使用指南 (共享: ai-coding, code-generation, cursor, github-copilot)
- [[编程/Tools/Comate_Guide]] — Comate 使用指南 (共享: ai-coding, code-generation, cursor, github-copilot)
- [[编程/Tools/Coze_Guide]] — Coze 使用指南 (共享: ai-coding, code-generation, cursor, github-copilot)
- [[编程/Tools/DeepSeek_Guide.md|DeepSeek_Guide]]

## 核心知识体系

| 知识域 | 核心内容 | 重要程度 | 学习优先级 |
|--------|----------|----------|------------|
| 基础理论 | 核心概念/原理/方法论 | 最高 | P0 |
| 技术实践 | 工具/框架/最佳实践 | 高 | P0 |
| 工程方法 | 设计模式/架构/流程 | 高 | P1 |
| 前沿趋势 | 新技术/新方向/研究 | 中 | P2 |
| 行业应用 | 实际案例/落地经验 | 中 | P1 |

## 技术对比与选型

| 维度 | 方案A | 方案B | 方案C | 选型建议 |
|------|-------|-------|-------|----------|
| 性能 | 高吞吐 | 低延迟 | 均衡 | 按场景选择 |
| 复杂度 | 简单 | 中等 | 复杂 | 按团队能力 |
| 成本 | 低 | 中 | 高 | 按预算约束 |
| 生态 | 成熟 | 发展中 | 新兴 | 按稳定性需求 |
| 扩展性 | 有限 | 良好 | 优秀 | 按增长预期 |

## 最佳实践清单

| 实践 | 说明 | 优先级 | 预期收益 |
|------|------|--------|----------|
| 标准化流程 | 统一规范和流程 | P0 | 减少错误+提升效率 |
| 自动化 | 重复工作自动化 | P0 | 节省时间+降低风险 |
| 持续监控 | 关键指标实时监控 | P1 | 及时发现问题 |
| 定期回顾 | 周期性复盘改进 | P1 | 持续优化 |
| 知识沉淀 | 文档化经验教训 | P2 | 团队能力提升 |
| 安全优先 | 安全贯穿全流程 | P0 | 降低风险 |

## 常见问题与解决方案

| 问题 | 根因分析 | 解决方案 | 预防措施 |
|------|----------|----------|----------|
| 效率低下 | 流程不规范/工具不当 | 优化流程+引入工具 | 标准化+培训 |
| 质量不稳定 | 缺乏检查机制 | 引入质量门禁 | 自动化测试 |
| 协作困难 | 职责不清/沟通不畅 | 明确分工+定期同步 | 文档化+工具 |
| 技术债务 | 赶工忽略质量 | 定期重构+代码审查 | 质量优先文化 |
| 安全风险 | 意识不足/措施缺失 | 安全培训+工具扫描 | 安全左移 |

## 学习路径建议

| 阶段 | 内容 | 时间 | 产出 |
|------|------|------|------|
| 入门 | 核心概念+基础操作 | 1-2周 | 理解基本框架 |
| 基础 | 工具使用+简单实践 | 2-3周 | 能独立完成基础任务 |
| 进阶 | 深入原理+复杂场景 | 3-4周 | 能处理复杂问题 |
| 实战 | 生产级应用+优化 | 4-6周 | 独立负责项目 |
| 精通 | 架构设计+前沿探索 | 持续 | 技术领导力 |

## 术语速查表

| 术语 | 含义 |
|------|------|
| Best Practice | 行业公认的最佳做法 |
| Anti-pattern | 反模式(应避免的做法) |
| Technical Debt | 技术债务(为速度牺牲质量) |
| CI/CD | 持续集成/持续部署 |
| SLA | 服务等级协议 |
| KPI | 关键绩效指标 |
| ROI | 投资回报率 |
| TCO | 总拥有成本 |

## 检查清单

- [ ] 核心概念和原理已理解
- [ ] 主流工具和框架已掌握
- [ ] 最佳实践已应用到工作中
- [ ] 常见问题能独立解决
- [ ] 持续关注前沿趋势
- [ ] 知识已文档化沉淀
