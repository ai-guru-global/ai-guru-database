---
title: Agent Skills 生态目录
category: 15-agent-production-agent-skills
tags: ["ai-agents", "agent-framework", "production", "langgraph"]
summary: "> 🎯 **目标**：完整收录 38 家开发团队、451+ 个 Agent Skills 的生态全景，作为快速查找和选型参考。"
created: 2026-05-31
updated: 2026-05-31
tier: supporting
aliases:
  - "Agent Skills Ecosystem Catalog"
  - Agent_Skills_Ecosystem_Catalog
sources: []

name_zh: "Agent Skills 生态目录"
---
# Agent Skills 生态目录

> 中文简称：Agent Skills 生态目录

> 🎯 **目标**：完整收录 38 家开发团队、451+ 个 Agent Skills 的生态全景，作为快速查找和选型参考。

---

## 生态快照（2026-04）

```
451+ Skills | 38 Dev Teams | 11 Categories | 30+ Compatible Agents
```

| 指标 | 数值 |
|------|------|
| 官方 Skills | 307 |
| 社区 Skills | 144 |
| 开发团队 | 38 |
| 分类 | 11 |
| 兼容 Agent 产品 | 30+ |
| 最大仓库 Stars | vercel-labs/agent-skills (24.9k) |
| 精选合集 Stars | VoltAgent/awesome-agent-skills (15.1k) |

---

## 按开发团队索引

### Anthropic（17 Skills）

文档处理、创意设计、开发工具。

| Skill | 功能 | 安装 |
|-------|------|------|
| `docx` | 创建/编辑/分析 Word 文档 | `npx skills add anthropics/skills --skill docx` |
| `doc-coauthoring` | 协作式文档编辑 | `npx skills add anthropics/skills --skill doc-coauthoring` |
| `pptx` | 创建/编辑/分析 PowerPoint | `npx skills add anthropics/skills --skill pptx` |
| `xlsx` | 创建/编辑/分析 Excel | `npx skills add anthropics/skills --skill xlsx` |
| `pdf` | 提取文本/创建 PDF/处理表单 | `npx skills add anthropics/skills --skill pdf` |
| `algorithmic-art` | p5.js 生成艺术 | `npx skills add anthropics/skills --skill algorithmic-art` |
| `canvas-design` | PNG/PDF 视觉设计 | `npx skills add anthropics/skills --skill canvas-design` |
| `frontend-design` | 高质量前端 UI 设计 | `npx skills add anthropics/skills --skill frontend-design` |
| `slack-gif-creator` | Slack GIF 动画 | `npx skills add anthropics/skills --skill slack-gif-creator` |
| `theme-factory` | 专业主题样式化 | `npx skills add anthropics/skills --skill theme-factory` |
| `web-artifacts-builder` | React+Tailwind HTML artifacts | `npx skills add anthropics/skills --skill web-artifacts-builder` |
| `mcp-builder` | MCP 服务器构建 | `npx skills add anthropics/skills --skill mcp-builder` |
| `webapp-testing` | Playwright Web 测试 | `npx skills add anthropics/skills --skill webapp-testing` |
| `brand-guidelines` | Anthropic 品牌色彩排版 | `npx skills add anthropics/skills --skill brand-guidelines` |
| `internal-comms` | 状态报告/新闻简报/FAQ | `npx skills add anthropics/skills --skill internal-comms` |
| `skill-creator` | Skill 创建指导 | `npx skills add anthropics/skills --skill skill-creator` |
| `template` | 新 Skill 基础模板 | `npx skills add anthropics/skills --skill template` |

### Vercel Engineering（6 Skills）

React/Next.js 性能优化和部署。

| Skill | 功能 | 适用场景 |
|-------|------|---------|
| `react-best-practices` | React+Next.js 性能优化 40+ 规则 | 编写组件、数据获取、Bundle 优化 |
| `web-design-guidelines` | UI 审计 100+ 规则 | 可访问性/性能/UX 审查 |
| `react-native-guidelines` | React Native 最佳实践 16 规则 | 移动端开发/动画/原生模块 |
| `react-view-transitions` | View Transition API 动画 | 页面转场/共享元素/路由动画 |
| `composition-patterns` | React 组件组合模式 | Boolean prop 过多时重构 |
| `vercel-deploy-claimable` | 一键 Vercel 部署 | "Deploy my app" |

安装：`npx skills add vercel-labs/agent-skills`

### Trail of Bits（21+ Security Skills）

安全审计和密码学专用。

| Skill | 功能 |
|-------|------|
| `ask-questions-if-underspecified` | 歧义需求澄清 |
| `audit-context-building` | 深度架构上下文分析 |
| `building-secure-contracts` | 6 条链智能合约安全工具包 |
| `burpsuite-project-parser` | Burp Suite 项目文件解析 |
| `claude-in-chrome-troubleshooting` | Chrome MCP 扩展故障排查 |
| `constant-time-analysis` | 时序侧信道检测（12 语言） |
| `culture-index` | Culture Index 行为评估 |
| `differential-review` | 安全聚焦 diff 审查 |
| `dwarf-expert` | DWARF 调试格式专长 |
| `entry-point-analyzer` | 智能合约入口点分析 |
| `firebase-apk-scanner` | Android APK Firebase 扫描 |
| `insecure-defaults` | 不安全默认配置检测 |
| `modern-python` | uv/ruff/ty/pytest 最佳实践 |
| `property-based-testing` | 多语言属性测试 |
| `semgrep-rule-creator` | Semgrep 漏洞检测规则创建 |
| `semgrep-rule-variant-creator` | Semgrep 规则语言移植 |
| `sharp-edges` | 易出错 API 识别 |
| `spec-to-code-compliance` | 规格到代码合规检查 |
| `static-analysis` | CodeQL/Semgrep/SARIF 静态分析 |
| `testing-handbook-skills` | Fuzzer/静态分析/Sanitizer 测试 |
| `variant-analysis` | 相似漏洞模式分析 |

### Microsoft（133 Skills）

Azure 全栈 SDK 覆盖。

| 领域 | Skills 数量 | 语言 |
|------|------------|------|
| AI/ML | 20+ | Python, Java, TS, .NET |
| 数据存储 | 15+ | Python, Java, TS, .NET, Rust |
| 消息/事件 | 12+ | Python, Java, TS, .NET, Rust |
| 安全/身份 | 10+ | Python, Java, TS, .NET, Rust |
| 监控 | 8+ | Python, Java, TS |
| 搜索 | 3+ | Python, TS, .NET |
| 计算 | 5+ | Java, Python, TS, .NET |
| 通信 | 5+ | Java |
| DevOps | 3+ | .NET, Python |
| 其他 | 52+ | 多语言 |

### OpenAI（42 Skills）

| 领域 | 代表 Skill |
|------|-----------|
| Web 开发 | `aspnet-core`, `cloudflare-deploy`, `develop-web-game` |
| 文档处理 | `doc` (Word) |
| 平台集成 | `chatgpt-apps` (MCP + Widget) |
| Azure SDK | 6 语言全覆盖 |

### Cloudflare（8 Skills）

| Skill | 功能 |
|-------|------|
| `agents-sdk` | 有状态 AI Agent |
| `build-agent` | Cloudflare Agent 构建 |
| `build-mcp` | 远程 MCP 服务器 |
| `building-ai-agent-on-cloudflare` | Agent + WebSocket |
| `building-mcp-server-on-cloudflare` | MCP + OAuth |
| `durable-objects` | 有状态协调（RPC/SQLite/WS） |
| `web-perf` | Core Web Vitals 审计 |
| `wrangler` | Workers/KV/R2/D1 部署 |

### Hugging Face（13 Skills）

| Skill | 功能 |
|-------|------|
| `hugging-face-model-trainer` | TRL 训练（SFT/DPO/GRPO/GGUF） |
| `hugging-face-evaluation` | vLLM/lighteval 模型评估 |
| `hugging-face-jobs` | HF 基础设施计算任务 |
| `huggingface-gradio` | Gradio 应用构建部署 |
| `transformers.js` | 浏览器端 ML 推理 |
| `hugging-face-dataset-viewer` | Dataset Viewer API |
| `hugging-face-datasets` | 数据集创建管理 |
| `hugging-face-paper-pages` | 论文页面管理 |
| `hugging-face-paper-publisher` | 论文发布 |
| `hugging-face-tool-builder` | 可复用脚本构建 |
| `hugging-face-trackio` | ML 实验追踪 |
| `hugging-face-vision-trainer` | 视觉模型训练 |
| `hf-cli` | HF CLI 工具 |

### Google Workspace（17 Skills）

通过 `gws` CLI 管理 Google Workspace 服务。

| Skill | 服务 |
|-------|------|
| `gws-drive` | Google Drive 文件管理 |
| `gws-sheets` | Google Sheets 读写 |
| `gws-gmail` | Gmail 邮件管理 |
| `gws-calendar` | Google Calendar |
| `gws-docs` | Google Docs 读写 |
| `gws-slides` | Google Slides |
| `gws-tasks` | Google Tasks |
| `gws-people` | Google Contacts |
| `gws-chat` | Google Chat |
| `gws-classroom` | Google Classroom |
| `gws-forms` | Google Forms |
| `gws-keep` | Google Keep |
| `gws-events` | Workspace 事件订阅 |
| `gws-admin-reports` | 审计日志和使用报告 |
| `gws-modelarmor` | 内容安全过滤 |
| `gws-workflow` | 跨服务生产力工作流 |
| `gws-shared` | 认证/全局标志/输出格式 |

### HashiCorp（11 Skills）

Terraform Provider 开发全生命周期。

| Skill | 功能 |
|-------|------|
| `azure-verified-modules` | Azure AVM 认证标准 |
| `new-terraform-provider` | Provider 脚手架 |
| `provider-resources` | 资源和数据源实现 |
| `provider-test-patterns` | 验收测试模式 |
| `provider-actions` | Provider Actions 实现 |
| `run-acceptance-tests` | 验收测试运行 |
| `refactor-module` | 单体配置→可复用模块 |
| `terraform-search-import` | 云资源发现和导入 |
| `terraform-style-guide` | HCL 代码风格指南 |
| `terraform-stacks` | 多环境/区域/账户管理 |
| `terraform-test` | .tftest.hcl 内置测试 |

### Expo（11 Skills）

| Skill | 功能 |
|-------|------|
| `building-native-ui` | Expo Router/样式/组件/导航/动画 |
| `expo-api-routes` | API 路由 + EAS Hosting |
| `expo-cicd-workflows` | CI/CD 工作流 |
| `expo-deployment` | iOS/Google Play/Web 部署 |
| `expo-dev-client` | 自定义开发客户端 |
| `expo-tailwind-setup` | Tailwind CSS v4 + NativeWind v5 |
| `expo-ui-jetpack-compose` | Jetpack Compose 原生组件 |
| `expo-ui-swift-ui` | SwiftUI 原生组件 |
| `native-data-fetching` | 网络请求/缓存/离线 |
| `upgrading-expo` | SDK 版本升级 |
| `use-dom` | Web 代码在原生 WebView 运行 |

### Netlify（12 Skills）

| Skill | 功能 |
|-------|------|
| `netlify-functions` | Serverless API + 后台任务 |
| `netlify-edge-functions` | 边缘中间件 + 地理位置 |
| `netlify-blobs` | KV 对象存储 |
| `netlify-db` | 托管 Postgres + 预览分支 |
| `netlify-image-cdn` | CDN 图片优化 |
| `netlify-forms` | HTML 表单 + 垃圾过滤 |
| `netlify-frameworks` | SSR 框架部署 |
| `netlify-caching` | CDN 缓存配置 |
| `netlify-config` | netlify.toml 配置参考 |
| `netlify-cli-and-deploy` | CLI + 本地开发 + 部署 |
| `netlify-deploy` | 自动化部署工作流 |
| `netlify-ai-gateway` | AI 模型统一网关 |

### Better Auth（7 Skills）

认证全流程：`best-practices` | `explain-error` | `providers` | `create-auth` | `emailAndPassword` | `organization` | `twoFactor`

### Firecrawl（8 Skills）

Web 数据提取：`firecrawl-cli` | `firecrawl-agent` | `firecrawl-browser` | `firecrawl-crawl` | `firecrawl-download` | `firecrawl-map` | `firecrawl-scrape` | `firecrawl-search`

### fal.ai（15 Skills）

AI 生成：`fal-3d` | `fal-audio` | `fal-generate` | `fal-image-edit` | `fal-kling-o3` | `fal-lip-sync` | `fal-platform` | `fal-realtime` + 更多

### Google Gemini（4 Skills）

| Skill | 功能 |
|-------|------|
| `gemini-api-dev` | Gemini API 应用开发最佳实践 |
| `vertex-ai-api-dev` | Google Cloud Vertex AI Gen AI SDK |
| `gemini-live-api-dev` | 实时双向流式应用 |
| `gemini-interactions-api` | 文本/聊天/流式/图像生成 |

### Google Labs Stitch（6 Skills）

| Skill | 功能 |
|-------|------|
| `design-md` | 分析 Stitch 项目屏幕并生成 DESIGN.md |
| `enhance-prompt` | 将粗糙提示重写为结构化 Stitch 提示 |
| `react-components` | Stitch 设计转 React 组件 |
| `remotion` | 从 Stitch 应用设计生成视频 |
| `shadcn-ui` | 用 shadcn/ui 构建组件 |
| `stitch-loop` | 迭代设计到代码反馈循环 |

### Garry Tan / gstack（27 Skills）

个人开发者最大贡献者，覆盖全栈：

| Skill | 功能 |
|-------|------|
| `autoplan` | 自动运行 CEO/设计/工程审查流水线 |
| `benchmark` | Web 页面性能测量 |
| `browse` | 无头 Chromium 控制器 |
| `canary` | 部署后监控检查 |
| `careful` | Bash 安全护栏 |
| `codex` | OpenAI Codex CLI 三模式分析 |
| `cso` | 多阶段安全审计 |
| `design-consultation` | 设计系统创建会话 |
| `design-review` | 实时网站视觉审查 |
| `document-release` | 代码发布后文档同步 |
| `prplan` | PR 规划审查 |

### Sentry（7 Skills）

| Skill | 功能 |
|-------|------|
| `agents-md` | AGENTS.md 生成和管理 |
| `claude-settings-audit` | Claude Code 配置审计 |
| `code-review` | Sentry 工程实践代码审查 |
| `commit` | 约定式 Commit 创建 |
| `create-pr` | PR 创建 |
| `find-bugs` | Bug 发现和识别 |
| `iterate-pr` | PR 反馈迭代 |

### DuckDB（6 Skills）

| Skill | 功能 |
|-------|------|
| `attach-db` | 将 DuckDB 数据库附加到项目会话 |
| `duckdb-docs` | DuckDB/DuckLake 文档全文搜索 |

### CallStack（3 Skills）

| Skill | 功能 |
|-------|------|
| `react-native-best-practices` | React Native 性能优化 |
| `github` | GitHub PR/Code Review/Branching 工作流 |
| `upgrading-react-native` | React Native 升级模板和依赖 |

### Typefully（1 Skill）

| Skill | 功能 |
|-------|------|
| `typefully` | 跨 X/LinkedIn/Threads/Bluesky/Mastodon 社交媒体内容创建和调度 |

### 其他团队速览

| 团队 | Skills 数量 | 重点 |
|------|------------|------|
| **Garry Tan (gstack)** | 27 | 全栈开发/设计审查/安全审计/部署 |
| **MiniMax** | 10 | Android 原生/GIF 贴纸 |
| **DuckDB** | 6 | 数据库分析/文档搜索 |
| **GSAP** | 8 | Web 动画动效 |
| **Binance** | 7 | Web3/Crypto 市场 |
| **Figma** | 7 | 设计系统集成 |
| **Sentry** | 7 | AGENTS.md/代码审查/PR/Commit |
| **Google Gemini** | 4 | Gemini API 最佳实践 |
| **Google Labs (Stitch)** | 6 | 设计到代码/Stitch 循环 |
| **Tinybird** | 4 | 数据源/Pipes/Endpoints |
| **Sanity** | 4 | Studio/GROQ/内容建模 |
| **Neon** | 3 | Serverless Postgres |
| **Stripe** | 2 | 集成最佳实践/SDK 升级 |
| **VoltAgent** | 4 | TypeScript Agent 框架 |
| **Supabase** | 1 | PostgreSQL 最佳实践 |
| **Composio** | 1 | 1000+ 外部应用连接 |
| **Remotion** | 1 | React 编程式视频 |
| **Replicate** | 1 | AI 模型运行 |
| **Notion** | 4 | Notion 集成 |
| **ClickHouse** | 1 | ClickHouse 最佳实践 |
| **CallStack** | 3 | React Native/GitHub 工作流 |
| **Courier** | 1 | 多渠道通知 |
| **Resend** | — | 邮件发送 |
| **WordPress** | — | WordPress 设计系统 |

---

## 社区 Skills（144 个）

社区 Skills 由个人开发者和团队贡献，经过 VoltAgent/awesome-agent-skills 精选审核。

### 精选标准

awesome-agent-skills 仓库强调**人工审核**，不接受 AI 批量生成的低质量 Skill。收录标准：

1. **实际可用**：由真实工程团队创建和使用
2. **非批量生成**：非 AI 自动填充的无价值内容
3. **兼容标准**：遵循 Agent Skills SKILL.md 格式
4. **有明确用途**：description 清晰描述触发场景

### 提交新 Skill

```bash
# Fork VoltAgent/awesome-agent-skills
# 按分类添加到 README.md
# 提交 PR
```

详见：[治理/CONTRIBUTING.md](https://github.com/Volt智能体/awesome-agent-skills/blob/main/CONTRIBUTING.md)

---

## 按领域分类索引

### 文档处理

| Skill | 团队 | 功能 |
|-------|------|------|
| `docx` | Anthropic | Word 文档 |
| `pptx` | Anthropic | PowerPoint |
| `xlsx` | Anthropic | Excel |
| `pdf` | Anthropic | PDF |
| `doc` | OpenAI | Word |
| `gws-docs` | Google | Google Docs |
| `gws-sheets` | Google | Google Sheets |
| `gws-slides` | Google | Google Slides |

### 前端与 UI

| Skill | 团队 | 功能 |
|-------|------|------|
| `frontend-design` | Anthropic | 高质量 UI 设计 |
| `react-best-practices` | Vercel | React+Next.js 优化 |
| `web-design-guidelines` | Vercel | UI 审计 |
| `composition-patterns` | Vercel | 组件组合模式 |
| `react-view-transitions` | Vercel | 页面转场动画 |
| `canvas-design` | Anthropic | 视觉设计 |
| `theme-factory` | Anthropic | 主题样式化 |
| `building-native-ui` | Expo | 原生 UI |
| `shadcn-ui` | Google Labs | shadcn/ui 组件 |

### 安全审计

| Skill | 团队 | 功能 |
|-------|------|------|
| `static-analysis` | Trail of Bits | 静态分析工具包 |
| `building-secure-contracts` | Trail of Bits | 智能合约安全 |
| `constant-time-analysis` | Trail of Bits | 时序侧信道 |
| `differential-review` | Trail of Bits | 安全 diff 审查 |
| `semgrep-rule-creator` | Trail of Bits | Semgrep 规则 |
| `variant-analysis` | Trail of Bits | 漏洞变体分析 |
| `cso` | Garry Tan | 多阶段安全审计 |
| `sharp-edges` | Trail of Bits | 危险 API 识别 |

### AI/ML

| Skill | 团队 | 功能 |
|-------|------|------|
| `hugging-face-model-trainer` | Hugging Face | 模型训练 |
| `hugging-face-evaluation` | Hugging Face | 模型评估 |
| `huggingface-gradio` | Hugging Face | Gradio 应用 |
| `transformers.js` | Hugging Face | 浏览器 ML |
| `fal-generate` | fal.ai | AI 图像/视频 |
| `fal-realtime` | fal.ai | 实时生成 |
| `replicate` | Replicate | AI 模型运行 |

### 云平台与部署

| Skill | 团队 | 功能 |
|-------|------|------|
| `vercel-deploy-claimable` | Vercel | 一键 Vercel 部署 |
| `wrangler` | Cloudflare | Workers 全套部署 |
| `netlify-deploy` | Netlify | 自动化 Netlify 部署 |
| `cloudflare-deploy` | OpenAI | Cloudflare 全平台部署 |
| `claimable-postgres` | Neon | 即时 Postgres 数据库 |
| `expo-deployment` | Expo | 移动端部署 |

### 数据库

| Skill | 团队 | 功能 |
|-------|------|------|
| `postgres-best-practices` | Supabase | PostgreSQL 最佳实践 |
| `neon-postgres` | Neon | Serverless Postgres |
| `clickhouse-best-practices` | ClickHouse | ClickHouse 28 条规则 |
| `attach-db` / `duckdb-docs` | DuckDB | DuckDB 数据分析 |

### 认证与安全配置

| Skill | 团队 | 功能 |
|-------|------|------|
| `create-auth` | Better Auth | 认证脚手架 |
| `best-practices` | Better Auth | 认证最佳实践 |
| `explain-error` | Better Auth | 错误码解释 |
| `twoFactor` | Better Auth | 2FA 实现 |

### 基础设施与 Terraform

| Skill | 团队 | 功能 |
|-------|------|------|
| `new-terraform-provider` | HashiCorp | Provider 脚手架 |
| `terraform-style-guide` | HashiCorp | HCL 代码风格 |
| `terraform-test` | HashiCorp | .tftest.hcl 内置测试 |
| `azure-verified-modules` | HashiCorp | Azure AVM 认证 |

### 动画与视觉

| Skill | 团队 | 功能 |
|-------|------|------|
| `algorithmic-art` | Anthropic | p5.js 生成艺术 |
| `canvas-design` | Anthropic | PNG/PDF 视觉设计 |
| `remotion` | Remotion | React 编程式视频 |
| `fal-realtime` | fal.ai | 亚秒级图像生成 |
| `fal-lip-sync` | fal.ai | 视频唇形同步 |

### 社交媒体与内容

| Skill | 团队 | 功能 |
|-------|------|------|
| `typefully` | Typefully | 多平台社交内容发布 |
| `slack-gif-creator` | Anthropic | Slack GIF 创建 |
| `internal-comms` | Anthropic | 内部沟通文档 |

---

## 生态仓库排行

| 仓库 | Stars | Skills 数量 | 说明 |
|------|-------|------------|------|
| [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) | 24.9k⭐ | 6 | Vercel 官方 |
| [VoltAgent/awesome-agent-skills](https://github.com/Volt智能体/awesome-agent-skills) | 15.1k⭐ | 1060+ | 社区精选 |
| [anthropics/skills](https://github.com/anthropics/skills) | — | 17 | Anthropic 官方 |
| [trailofbits/agent-skills](https://github.com/trailofbits/agent-skills) | — | 21+ | 安全审计 |
| [microsoft/agent-skills](https://github.com/microsoft/agent-skills) | — | 133 | Azure SDK |
| [openai/agent-skills](https://github.com/openai/agent-skills) | — | 42 | OpenAI 官方 |
| [cloudflare/agent-skills](https://github.com/cloudflare/agent-skills) | — | 8 | Cloudflare 官方 |

---

## 🔗 相关主题

- [Agent Skills 深度解析](./02_Agent_技能_深入分析.md) — 完整规范和理论
- Agent Skills 实战指南 — 创建和优化
- [Agent Skills 多角色全景分析](./04_Agent_技能_Multi_Role_分析.md) — 五角色视角深度解析完整生命周期
- [官方目录](https://officialskills.sh) — 在线浏览全部 451+ Skills
- [精选合集](https://github.com/Volt智能体/awesome-agent-skills) — GitHub 精选列表

> 📅 **最后更新**：2026-04-11 | **来源**：[officialskills.sh](https://officialskills.sh), [VoltAgent/awesome-agent-skills](https://github.com/Volt智能体/awesome-agent-skills), [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills), [agentskills.io](https://agentskills.io)

## Related

- [[15_智能体/07_Agent评估/05_Agent_脚手架_完整_2026]] — Agent Harness 完整指南：生产级 Agent 评估框架 (共享: agent-framework, ai-agents, langgraph, production)
- [[15_智能体/07_Agent评估/08_Agent_红队测试_2026]] — Agent Red Teaming Framework 2026 (共享: agent-framework, ai-agents, langgraph, production)
- [[15_智能体/07_Agent评估/Assessment/03_评估_工作流]] — Evaluation Workflow (共享: agent-framework, ai-agents, langgraph, production)
- [[15_智能体/07_Agent评估/Assessment/01_生产_Assessment]] — Production Assessment (共享: agent-framework, ai-agents, langgraph, production)
