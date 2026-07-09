---
title: 'Vibe Coding 傻瓜指南 (Vibe Coding for Dummies)'
category: '16-ai-coding-practice'
tags: ["ai-coding", "code-generation", "cursor", "github-copilot"]
summary: '> **一句话理解**: Vibe Coding 就是用"说人话"的方式让 AI 帮你写代码——你不是打字员，你是导演，AI 是你的编剧和演员。'
created: '2026-05-31'
updated: '2026-05-31'
tier: supporting
aliases:
  - "Vibe Coding Getting Started"
  - Vibe_Coding_Getting_Started
sources: []

---
# Vibe Coding 傻瓜指南 (Vibe Coding for Dummies)

> **一句话理解**: Vibe Coding 就是用"说人话"的方式让 AI 帮你写代码——你不是打字员，你是导演，AI 是你的编剧和演员。

---

## 什么是 Vibe Coding？

```
传统编程:
  你: (手动打字) function add(a, b) { return a + b; }
  你: (手动打字) function multiply(a, b) { return a * b; }
  你: (手动打字) ... 一个字一个字敲 ...

Vibe Coding:
  你: "写一个数学工具类，包含加减乘除，每个函数都要有错误处理和单元测试"
  AI: (生成完整代码 + 测试)
  你: (审查一下，看起来不错，通过！)
```

**简单说**: 你说想要什么，AI帮你写，你负责检查对不对。

---

## 5 分钟上手

### Step 1: 选一个工具

```
推荐选择:
├── 完全新手 → Cursor (有图形界面，像VS Code)
├── 喜欢终端 → Claude Code (命令行工具)
└── 预算有限 → Windsurf (便宜) 或 Copilot (最便宜)
```

### Step 2: 安装

```bash
# Cursor (推荐新手)
# 1. 下载: https://cursor.sh
# 2. 打开，会自动导入你的VS Code设置
# 3. 按 Cmd+L 打开AI聊天，开始使用！

# Claude Code
npm install -g @anthropic-ai/claude-code
claude  # 开始使用
```

### Step 3: 第一次 Vibe Coding

```
在Cursor中:
1. 按 Cmd+L 打开聊天
2. 输入: "帮我写一个TypeScript函数，验证邮箱格式，返回true/false"
3. AI生成代码
4. 审查代码 (看看逻辑对不对)
5. 点击"Accept"接受代码
```

---

## 核心思维转变

```
❌ 旧思维: "我要写一个函数处理用户登录"
   → 打开编辑器
   → 一个字一个字敲代码

✅ 新思维: "我要实现用户登录功能"
   → 描述清楚需求给AI
   → 审查AI生成的代码
   → 验证功能是否正确

类比:
├── 传统编程 = 你亲自下厨，切菜炒菜摆盘
├── Vibe Coding = 你是主厨，告诉助手要什么菜，然后尝味道调整
└── 关键: 你必须知道什么是"好味道"（代码质量判断力）
```

---

## 怎样给 AI 说清楚需求？

### BAD (太模糊)

```
"做一个登录功能"
→ AI不知道用什么技术、什么验证方式、什么错误处理
→ 生成的代码可能完全不符合你的需求
```

### GOOD (清晰具体)

```
"用React + TypeScript实现一个登录表单组件:
1. 包含邮箱和密码两个输入框
2. 邮箱验证格式，密码最少8位
3. 提交时调用 /api/auth/login 接口
4. 错误时显示红色提示信息
5. 成功时跳转到 /dashboard
6. 使用Tailwind CSS样式"
```

### BEST (带上下文)

```
"参考项目中 src/components/auth/RegisterForm.tsx 的代码风格，
实现一个LoginForm组件。
使用同样的表单验证方式 (react-hook-form + zod)，
同样的错误处理模式 (toast通知)，
同样的样式风格 (Tailwind + 项目UI组件)。"
```

---

## 4步安全使用法

```
Step 1: 描述 ──── 说清楚你要什么
    │
Step 2: 生成 ──── 让AI写代码
    │
Step 3: 审查 ──── 检查代码对不对
    │               ├── 逻辑对吗？
    │               ├── 有没有安全问题？
    │               ├── 有没有边界情况没处理？
    │               └── 符合项目规范吗？
    │
Step 4: 验证 ──── 运行测试确认
    │               ├── 单元测试通过？
    │               ├── 功能正常？
    │               └── 没有副作用？
    │
    ✓ 通过 → 提交代码
    ✗ 不通过 → 修改描述，重新来
```

---

## 什么时候用？什么时候不用？

```
适合用 Vibe Coding:
├── CRUD接口 (增删改查)
├── 单元测试编写
├── 文档生成
├── 代码重构
├── Bug修复
├── 样板代码
├── 前端组件
└── 脚本编写

不适合用 Vibe Coding:
├── 核心加密算法
├── 关键支付逻辑
├── 安全认证核心
├── 性能关键路径 (需要精确优化)
├── 你完全不懂的领域 (无法审查)
└── 生产数据库直接操作
```

---

## 新手常见错误

```
错误1: 直接全盘接受AI代码
├── 问题: 可能有bug或安全漏洞
├── 正确: 每行代码都要审查理解

错误2: 需求说不清楚
├── 问题: AI猜错了你的意图
├── 正确: 尽量具体，给示例

错误3: 一次生成太多代码
├── 问题: 难以审查和调试
├── 正确: 分步生成，逐步验证

错误4: 不写测试
├── 问题: 不知道代码是否正确
├── 正确: 要求AI同时生成测试

错误5: 把密码密钥发给AI
├── 问题: 安全风险
├── 正确: 使用占位符 (your-api-key-here)
```

---

## 实战练习

### 练习 1: Todo List API (入门级)

```
目标: 用Vibe Coding创建一个Todo API

提示词:
"用Node.js + Express + TypeScript创建一个Todo REST API:
- GET /todos: 获取所有todo (支持分页)
- POST /todos: 创建todo (标题+描述)
- PUT /todos/:id: 更新todo
- DELETE /todos/:id: 删除todo
- 使用内存数组存储 (不需要数据库)
- 包含输入验证
- 包含单元测试"

检查清单:
├── □ API端点是否都能正常工作
├── □ 输入验证是否完整
├── □ 错误处理是否正确
├── □ 测试是否通过
└── □ 代码风格是否一致
```

### 练习 2: React 组件 (进阶级)

```
目标: 创建一个可复用的搜索组件

提示词:
"创建一个React搜索组件:
- 输入框带搜索图标
- 输入时debounce 300ms
- 支持清除按钮
- 支持加载状态
- 支持无结果状态
- 使用Tailwind CSS
- 包含Storybook story
- 包含单元测试"

检查清单:
├── □ debounce是否正常工作
├── □ 清除按钮功能
├── □ 加载状态显示
├── □ 无结果提示
├── □ 可访问性 (aria标签)
└── □ 测试覆盖主要交互
```

### 练习 3: 数据处理脚本 (实战级)

```
目标: 编写CSV数据处理脚本

提示词:
"用Python编写一个CSV处理脚本:
1. 读取 input.csv (包含: name, email, age, city)
2. 过滤年龄 > 18 的记录
3. 按城市分组统计人数
4. 输出结果到 output.json
5. 处理异常: 文件不存在、格式错误、空行
6. 添加日志记录
7. 包含单元测试"

检查清单:
├── □ 文件读取异常处理
├── □ 数据格式验证
├── □ 空行和缺失值处理
├── □ 输出格式正确
├── □ 日志记录完整
└── □ 测试覆盖边界情况
```

---

## 进阶学习路线

```
Vibe Coding 学习路线:
═══════════════════════════════════════════════════════════════

Week 1: 基础
├── 安装工具
├── 完成练习1
├── 习惯审查AI代码
└── 时间: 4-8小时

Week 2: 提示技巧
├── 学习STAR提示结构
├── 完成练习2
├── 尝试不同的描述方式
└── 时间: 4-8小时

Week 3: 规则文件
├── 学习 .cursorrules 编写
├── 为自己的项目创建规则文件
└── 时间: 2-4小时

Week 4+: 实战
├── 在实际项目中使用
├── 建立自己的提示模板库
├── 学习生产环境最佳实践
└── 持续学习

推荐阅读:
├── [方法论详解](../Methodology/Vibe_Coding_Methodology.md)
├── [生产环境实践](../Methodology/Vibe_Coding_Production_Practices.md)
└── [AI编程助手对比](../Tools/AI_Coding_Assistants_2026.md)
```

---

## FAQ

**Q: Vibe Coding 会让程序员失业吗？**
A: 不会。它改变了程序员的工作方式——从"写代码"变成"设计+审查"。你仍然需要技术判断力。

**Q: 我完全不懂编程，可以用 Vibe Coding 吗？**
A: 可以做简单的东西，但你无法审查 AI 代码的正确性，这很危险。建议先学基础编程。

**Q: AI 生成的代码有版权问题吗？**
A: 目前法律还在发展中。Copilot 提供 IP 赔偿，其他工具建议查看各自条款。

**Q: 需要多长时间才能熟练？**
A: 基础使用 1-2 周，熟练使用 1-2 月，精通 3-6 月。

---

*Last updated: 2026-04-11*

## Related

- [[16_AI_Coding/Theory/AI_Coding_Theory.md|AI_Coding_Theory]]
- [[16_AI_Coding/Tools/AI_Coding_Assistants_2026.md|AI_Coding_Assistants_2026]]
- [[16_AI_Coding/Tools/CodeBuddy_Guide.md|CodeBuddy_Guide]]
- [[16_AI_Coding/Tools/Comate_Guide.md|Comate_Guide]]
- [[16_AI_Coding/Tools/Coze_Guide.md|Coze_Guide]]
