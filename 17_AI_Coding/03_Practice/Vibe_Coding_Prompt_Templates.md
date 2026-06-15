---
title: Vibe Coding 提示词模板库
category: 17-ai-coding-03-practice
tags: ["ai-coding", "code-generation", "cursor", "github-copilot"]
summary: "> **一句话理解**: 从 STAR 框架到规则文件模板，从场景模板到反面教材——你的一站式提示工程工具箱。"
created: 2026-05-31
updated: 2026-05-31
---

# Vibe Coding 提示词模板库

> **一句话理解**: 从 STAR 框架到规则文件模板，从场景模板到反面教材——你的一站式提示工程工具箱。

---

## 目录

1. [提示工程框架](#1-提示工程框架)
2. [按场景分类的提示模板](#2-按场景分类的提示模板)
3. [高级技巧](#3-高级技巧)
4. [规则文件模板](#4-规则文件模板)
5. [反面教材](#5-反面教材)

---

## 1. 提示工程框架

### 1.1 STAR 模板

```
═══════════════════════════════════════════════════════════════

S - Situation (情境)
    "在一个Next.js 14 + TypeScript项目中..."

T - Task (任务)
    "实现一个支持分页和搜索的商品列表API..."

A - Architecture (架构约束)
    "使用Repository模式，Service层处理业务逻辑，
     Controller层处理HTTP，遵循项目已有的错误处理模式..."

R - Requirements (具体要求)
    "1. 支持游标分页 (cursor-based)
     2. 搜索支持名称模糊匹配
     3. 返回格式符合ApiResponse<T>泛型
     4. 包含单元测试
     5. 处理空结果和错误情况"
```

### 1.2 上下文管理策略

```
上下文管理金字塔:
═══════════════════════════════════════════════════════════════

                    ┌─────────┐
                    │  任务级  │  当前任务的即时描述
                    │  Task   │  精确、具体、可执行
                    └────┬────┘
                         │
              ┌──────────┴──────────┐
              │  会话级              │  当前开发会话的上下文
              │  Session            │  相关文件、依赖关系
              └──────────┬──────────┘
                         │
          ┌──────────────┴──────────────┐
          │  项目级                      │  规则文件、技术栈规范
          │  Project                    │  .cursorrules / AGENTS.md
          └──────────────┬──────────────┘
                         │
      ┌──────────────────┴──────────────────┐
      │  组织级                              │  编码规范、安全策略
      │  Organization                        │  架构原则、品牌指南
      └──────────────────────────────────────┘
```

### 1.3 模型选择策略

```
不同任务选择不同模型:
═══════════════════════════════════════════════════════════════

任务类型              推荐模型                     原因
─────────────────────────────────────────────────────────────
复杂架构设计          Claude Opus / GPT-4o         推理能力强
日常代码生成          Claude Sonnet / GPT-4o-mini  性价比高
代码补全              Cursor Tab / Copilot         延迟低
大规模重构            Claude Code / OpenCode       上下文窗口大
前端UI生成            GPT-4o / Gemini              多模态理解
文档/注释生成         任意中端模型                  任务简单
测试生成              Claude Sonnet / GPT-4o       逻辑严密
代码审查              Claude Opus                  细节敏感
脚本/自动化           Claude Code / Hermes         工具调用强

模型切换原则:
├── 先用便宜模型试，不满意再升级
├── 简单任务用快模型，复杂任务用强模型
├── 同一项目尽量用同一模型保持风格一致
└── 利用工具的自动路由能力 (如 Hermes Agent)
```

---

## 2. 按场景分类的提示模板

### 2.1 API 开发模板

```
"""
Situation: 在一个 [框架] + [数据库] 项目中

Task: 实现 [资源名] 管理API，包含以下端点:
- POST /[资源] (创建)
- GET /[资源]/:id (查询)
- PUT /[资源]/:id (更新)
- DELETE /[资源]/:id (删除)

Architecture:
- 使用 [Repository/Service/Controller] 分层
- 统一响应格式 [ApiResponse<T>]
- DTO 使用 [验证库] 验证

Requirements:
1. 输入验证 (字段列表和规则)
2. 分页查询支持 (page, limit, sort)
3. 错误处理完整 (自定义错误类)
4. 单元测试覆盖 Service 方法
5. 集成测试覆盖 API 端点
"""
```

### 2.2 前端组件模板

```
"""
Situation: 在一个 [框架] + [UI库] 项目中

Task: 实现 [组件名] 组件

Architecture:
- 使用函数式组件 + hooks
- 遵循项目现有的组件结构
- 样式使用 [Tailwind CSS / CSS Modules]

Requirements:
1. 支持以下 props: [列表]
2. 支持以下变体: [列表]
3. 支持加载/空状态/错误状态
4. 遵循 WAI-ARIA 无障碍标准
5. 包含 Storybook stories
6. 包含单元测试 (render + 交互)
7. 支持 dark mode
"""
```

### 2.3 数据库操作模板

```
"""
Situation: 在一个 [ORM] + [数据库] 项目中

Task: 实现 [数据操作描述]

Architecture:
- 使用 [ORM名] Client
- 遵循项目现有的数据访问模式
- 事务处理使用 [模式]

Requirements:
1. 查询优化 (避免 N+1)
2. 分页支持
3. 事务一致性
4. 软删除支持 (如适用)
5. 索引建议
6. 数据迁移脚本
7. 回滚方案
"""
```

### 2.4 测试生成模板

```
"""
为以下代码生成测试:

[粘贴代码]

测试要求:
1. 框架: [Jest / Vitest / pytest]
2. 覆盖以下场景:
   - 正常路径 (Happy path)
   - 边界条件 (空值/极值/特殊字符)
   - 错误处理 (异常/失败)
   - 并发场景 (如适用)
3. Mock 外部依赖
4. 测试命名: should_X_when_Y 格式
5. 每个测试只验证一个行为
6. 目标覆盖率: >80%
"""
```

### 2.5 Bug 修复模板

```
"""
## Bug 报告
- 现象: [描述]
- 错误日志: [粘贴]
- 复现步骤: [步骤]
- 预期行为: [描述]

## 相关代码
- 文件: [路径:行号]
- 上下文: [粘贴相关代码]

## 要求
1. 分析根因
2. 给出3种修复方案及优缺点
3. 添加回归测试
4. 确保不影响现有功能
5. 评估修复风险
"""
```

### 2.6 代码审查模板

```
"""
审查以下代码变更:

[粘贴 diff 或代码]

审查维度:
1. 逻辑正确性: 是否满足需求
2. 安全性: 是否有注入/XSS/敏感信息泄露风险
3. 性能: 是否有N+1/内存泄漏/不必要计算
4. 可维护性: 命名/函数长度/复杂度
5. 测试: 覆盖率/边界/回归
6. 一致性: 是否遵循项目规范

请按严重程度分级 (Critical/High/Medium/Low)
"""
```

### 2.7 重构模板

```
"""
当前代码:
[粘贴原始代码]

重构目标:
- [具体重构操作，如: 将God Class拆分为单一职责的类]

约束:
- 保持所有现有测试通过
- 保持公共API不变
- 每次只做一个修改
- 使用 [设计模式] 模式

请分步执行:
1. 先列出重构步骤
2. 每步执行后等待确认
3. 每步运行测试验证
"""
```

### 2.8 文档生成模板

```
"""
为以下代码生成文档:

[粘贴代码]

文档要求:
1. 类型: [API文档 / README / JSDoc / 内联注释]
2. 格式: [Markdown / OpenAPI / TSDoc]
3. 包含:
   - 功能概述
   - 参数说明 (类型、默认值、是否必须)
   - 返回值说明
   - 使用示例
   - 注意事项和限制
4. 语言: 中文
5. 保持简洁，避免冗余
"""
```

---

## 3. 高级技巧

### 技巧 1: 渐进式细化 (Progressive Refinement)

```
第1轮: "设计一个缓存系统的架构"
第2轮: "好的，基于Redis实现，支持TTL和LRU淘汰"
第3轮: "添加分布式锁，使用Redlock算法"
第4轮: "现在添加监控指标，暴露Prometheus格式"
```

**适用场景**: 需求逐步明确，从架构到细节逐步细化

### 技巧 2: 示例驱动 (Example-Driven)

```
"参考以下代码风格:

// 现有代码示例
export async function getUser(id: string): Promise<Result<User, NotFoundError>> {
  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) return err(new NotFoundError('User', id))
  return ok(user)
}

请用同样的风格实现 getProduct 函数"
```

**适用场景**: 需要保持代码风格一致性，棕地项目开发

### 技巧 3: 约束优先 (Constraints-First)

```
"实现用户注册功能，但必须满足:
- 密码使用bcrypt加密 (cost factor 12)
- 邮箱验证使用6位OTP
- 速率限制: 每IP每天最多5次注册
- 所有字段服务端验证
- 日志记录所有注册尝试"
```

**适用场景**: 安全关键代码、有严格合规要求的场景

### 技巧 4: 思维链引导 (Chain-of-Thought)

```
"我需要实现一个订单状态机。请先:
1. 画出状态转换图
2. 列出所有状态和转换条件
3. 标注哪些转换需要副作用
4. 然后再开始编码"
```

**适用场景**: 复杂业务逻辑、状态机、算法设计

### 技巧 5: 反例驱动 (Counter-Example)

```
"不要像这样写 (反面教材):
if (user) { if (user.active) { if (user.role === 'admin') { ... } } }

应该用卫语句 (正面教材):
if (!user) return err(...)
if (!user.active) return err(...)
if (user.role !== 'admin') return err(...)
// 正常逻辑"
```

**适用场景**: 代码审查、重构、风格统一

---

## 4. 规则文件模板

### 4.1 .cursorrules 模板 (Next.js 项目)

```yaml
# .cursorrules
# 项目: E-Commerce Platform

## 技术栈
- Language: TypeScript 5.x (strict mode)
- Framework: Next.js 14 (App Router)
- Database: PostgreSQL + Prisma ORM
- Auth: NextAuth.js v5
- Testing: Vitest + Playwright
- State: Zustand
- Styling: Tailwind CSS

## 编码规范
- 所有函数必须有JSDoc注释
- 使用函数式组件 + hooks
- 错误处理使用Result<T, E>模式
- API路由遵循RESTful规范
- 数据库查询使用Prisma Client
- 组件使用 kebab-case 文件名
- 类型定义放在 types/ 目录

## 禁止事项
- 不要使用 any 类型
- 不要使用 console.log (使用 logger)
- 不要直接操作DOM
- 不要跳过错误处理
- 不要使用内联样式

## 测试要求
- 单元测试覆盖核心业务逻辑
- API端点需要集成测试
- 组件需要渲染测试
- 目标覆盖率: 80%+

## 安全要求
- 所有用户输入必须验证
- SQL参数化查询
- JWT token验证
- CORS配置
- Rate limiting
```

### 4.2 AGENTS.md 模板 (通用项目)

```markdown
# AGENTS.md — AI Agent 项目配置

## 项目概述
- 项目名: [项目名]
- 描述: [一句话描述]
- 仓库: [URL]

## 技术栈
- 语言: [语言和版本]
- 框架: [框架和版本]
- 数据库: [数据库]
- 测试框架: [测试工具]

## 目录结构
```
src/
├── controllers/    # HTTP 处理
├── services/       # 业务逻辑
├── repositories/   # 数据访问
├── models/         # 数据模型
├── types/          # 类型定义
└── utils/          # 工具函数
```

## 编码规范
- [规范1]
- [规范2]

## 禁止事项
- [禁止1]
- [禁止2]

## 测试
- 运行: `npm test`
- 覆盖率: `npm run test:coverage`
- 目标: 80%+

## 提交规范
- feat: (AI-assisted) 新功能
- fix: (AI-generated) 修复
- test: (AI-generated) 测试
```

### 4.3 CLAUDE.md 模板

```markdown
# CLAUDE.md — Claude Code 项目配置

## 项目
[项目名] — [描述]

## 技术栈
[同上]

## 关键命令
- 构建: `npm run build`
- 测试: `npm test`
- Lint: `npm run lint`
- 类型检查: `npm run typecheck`

## 代码风格
- 使用 [ESLint/Prettier] 配置
- [其他风格要求]

## 注意事项
- 不要修改 [受保护文件/目录]
- [其他约束]
```

---

## 5. 反面教材

### 5.1 差提示 vs 好提示

```
❌ 差: "做一个登录功能"
→ AI 不知道用什么技术、什么验证方式、什么错误处理

✅ 好: "用React + TypeScript实现一个登录表单组件:
1. 包含邮箱和密码两个输入框
2. 邮箱验证格式，密码最少8位
3. 提交时调用 /api/auth/login 接口
4. 错误时显示红色提示信息
5. 成功时跳转到 /dashboard
6. 使用Tailwind CSS样式"
```

```
❌ 差: "添加限流"

✅ 好: "实现一个Redis限流中间件:
1. 使用滑动窗口算法
2. 支持按用户ID限流
3. 每分钟100次请求
4. 在/routes/api目录下创建
5. 包含单元测试"
```

### 5.2 常见错误模式

```
错误1: 需求说不清楚
├── 问题: AI猜错了你的意图
├── 正确: 尽量具体，给示例和约束

错误2: 一次生成太多代码
├── 问题: 难以审查和调试
├── 正确: 分步生成，逐步验证

错误3: 不提供上下文
├── 问题: AI生成与项目风格不一致
├── 正确: 引用现有代码作为风格参考

错误4: 忽略约束条件
├── 问题: 生成的代码不符合安全/性能要求
├── 正确: 先列出硬约束，再描述功能

错误5: 把密码密钥发给AI
├── 问题: 安全风险
├── 正确: 使用占位符 (your-api-key-here)
```

---

## 参考资源

- [Vibe Coding 方法论](../04_Methodology/Vibe_Coding_Methodology.md) — 完整方法论指南
- [Vibe Coding 入门](./Vibe_Coding_Getting_Started.md) — 5分钟入门
- [实战案例集](./Vibe_Coding_Real_World_Cases.md) — 场景化实战与真实案例
- [AI编程助手对比](../02_Tools/AI_Coding_Assistants_2026.md) — 工具选型参考

---

*Consolidated from Vibe Coding 方法论 and Vibe Coding 傻瓜指南, 2026-04*

## Related

- [[17_AI_Coding/01_Theory/AI_Coding_Theory]] — AI 辅助编程理论基础 (共享: ai-coding, code-generation, cursor, github-copilot)
- [[17_AI_Coding/02_Tools/CodeBuddy_Guide]] — CodeBuddy / WorkBuddy 使用指南 (共享: ai-coding, code-generation, cursor, github-copilot)
- [[17_AI_Coding/02_Tools/Comate_Guide]] — Comate 使用指南 (共享: ai-coding, code-generation, cursor, github-copilot)
- [[17_AI_Coding/02_Tools/Coze_Guide]] — Coze 使用指南 (共享: ai-coding, code-generation, cursor, github-copilot)
