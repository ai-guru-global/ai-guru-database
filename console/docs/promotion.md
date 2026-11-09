# AI News Database 自媒体推广方案

> 为程序员打造的 LLM-Native 个人信息终端 —— 让技术阅读回归本地与纯粹。

---

## 一、产品定位与核心卖点

### 一句话定位

**AI News Database 是专为程序员设计的本地优先技术资讯终端，把 HN、V2EX、GitHub Blog 等高质量信源一键同步到本地 SQLite，并通过 LLM 自动摘要、智能策展、RAG 问答，帮你实现信息断舍离。**

### 核心卖点矩阵

| 卖点 | 一句话文案 | 适用场景 |
|------|-----------|---------|
| **本地优先** | 你的数据永远属于你，无需账号、不上云端、没有数据泄露风险 | 隐私焦虑用户 |
| **LLM 增强** | 自动给每篇文章打标签、写摘要、评质量分，筛出「今日必读」 | 信息过载用户 |
| **RAG 问答** | 基于本地知识库回答技术问题，标注来源、不 hallucinate | 知识沉淀用户 |
| **断舍离** | unread / read / starred / archived / discarded 五态流，TUI 秒级决策 | 效率控/极简主义 |
| **单二进制** | 一个可执行文件，纯 Go + SQLite，零依赖、跨平台 | 极客/工具党 |

### Slogan 备选

1. **主 Slogan**: 你的技术资讯，你做主。
2. **副 Slogan**: 本地优先 · 数据主权 · 极速阅读。
3. **场景 Slogan**: 5 分钟看完今日必读，把省下的时间还给代码。
4. **极客 Slogan**: 一个二进制，搞定你的私人技术情报局。

---

## 二、目标受众画像

### 核心用户（Primary）

- **后端/全栈工程师**：关注技术趋势、架构设计、新语言特性
- **独立开发者/自由职业者**：时间碎片化，需要高效筛选信息
- **开源爱好者/技术博主**：有知识管理和内容输出需求

### 特征标签

- 使用 macOS / Linux，习惯命令行工具
- 订阅多个技术 newsletter，但邮箱已堆满未读
- 对 Notion、Obsidian 有使用经验，追求数据可控
- 在 Twitter/X、即刻、V2EX 活跃
- 愿意为效率工具付出学习成本

### 痛点场景

1. **信息过载**：RSS 订阅了 50+ 源，每天 200 条未读，根本看不完
2. **收藏即冷冻**：看到好文章点了收藏，之后再也没打开过
3. **搜索困难**：想找一个之前看过的 "Rust 内存安全" 观点，翻遍浏览器历史找不到
4. **隐私焦虑**：不想让自己的阅读记录被某个 SaaS 平台拿去训练模型

---

## 三、平台推广策略与文案

### 1. Twitter / X（英文 + 中文混合）

**平台特性**：技术人员聚集地，适合展示 GIF 演示、技术理念、开源姿态。

**内容策略**：
- 发布产品演示视频/GIF（sync → curate → ask 的完整流程）
- 强调 "Local-first" 和 "Data Sovereignty" 概念
- 用技术细节建立可信度（纯 Go、SQLite FTS5、Bubble Tea TUI）

**文案 A（产品发布）**：

```
Introducing AI News Database 🚀

A local-first, LLM-native news terminal for programmers.

- Sync HN / V2EX / GitHub Blog / Reddit to local SQLite
- Auto-tag, summarize & score articles with LLM
- Curate your daily must-read list
- Ask questions against your local knowledge base (RAG)

Zero cloud. Zero account. Your data, forever yours.

Built with Go + SQLite + Bubble Tea.

#buildinpublic #opensource #golang #llm
```

**文案 B（场景痛点）**：

```
Your browser has 127 unread tabs.
Your RSS reader has 342 unread items.
Your "read later" app is a graveyard.

What if you could:
- Sync top tech sources in 3s
- Let LLM score & summarize them
- Read only the top 10 in a TUI inbox
- Search everything locally with FTS5

That's exactly what AI News Database does.
```

**文案 C（数据主权）**：

```
"I don't want my reading history to train someone else's AI."

AI News Database stores everything in a local SQLite file:
- Articles & metadata
- Reading status & stars
- Notes & tags
- Full-text search index

No signup. No telemetry. No cloud lock-in.

Local-first is the future.
```

---

### 2. 小红书（图文 + 短文案）

**平台特性**：图文为主，封面和标题决定点击率，适合「效率工具」「极简生活」「程序员日常」话题。

**内容策略**：
- 封面：终端 TUI 界面截图 + 大标题「程序员5分钟读完今日技术资讯」
- 配图：命令行演示流程图、数据库文件截图、知识库问答效果图
- 标签：#程序员 #效率工具 #命令行 #技术阅读 #开源 #断舍离

**文案 A（封面标题：拒绝信息过载）**：

```
程序员专属｜我把所有技术资讯都存进了本地数据库 📰

姐妹们兄弟们，我发现了一个宝藏工具！

每天 HN、V2EX、GitHub Blog 的内容太多根本看不完，
这个工具可以：

✅ 一键同步 8 个高质量技术源到本地 SQLite
✅ AI 自动写摘要、打标签、评质量分
✅ 每天自动筛出「今日必读 Top 10」
✅ 还能基于本地知识库问答，标注来源！
✅ 完全本地存储，不用注册、不联网也能看

最绝的是它的 TUI 收件箱，
j/k 上下翻，r 标记已读，s 收藏，d 丢弃，
10 分钟清完所有未读，信息断舍离太爽了！

#程序员 #效率神器 #命令行工具 #技术阅读 #开源 #数据主权
```

**文案 B（封面标题：本地优先）**：

```
为什么我的阅读记录只属于我自己？🔒

用了很多 RSS 和稍后读工具，
但越来越不喜欢自己的阅读习惯被平台记录和分析。

这个开源工具把所有数据存在本地的 SQLite 文件里：
- 文章和摘要
- 阅读状态和收藏
- 笔记和标签
- 全文搜索索引

不需要注册账号，没有遥测，没有云端依赖。
换电脑直接把 .db 文件拷走就行。

这才是真正的「数据主权」吧。

#程序员 #隐私保护 #本地优先 #开源 #sqlite #工具推荐
```

---

### 3. 知乎（深度长文）

**平台特性**：适合写长文、讲逻辑、建立专业可信度，通过「好物推荐」「专栏文章」触达技术人群。

**内容策略**：
- 以「如何解决信息过载」为切入点
- 对比传统 RSS / Newsletter / 云端阅读器
- 深入讲解本地优先架构和 LLM 增强流程
- 文末放 GitHub 链接和安装命令

**文章标题备选**：

1. 《作为一名程序员，我是如何用「本地优先」思路管理技术阅读的》
2. 《拒绝 SaaS 绑架：一个开源工具如何帮我重建技术信息流》
3. 《LLM + SQLite：我给自己搭了一个私人技术情报局》

**文章大纲**：

```
一、我的信息焦虑：为什么 RSS 和 Newsletter 救不了我
   - 订阅源膨胀
   - 收藏即冷冻
   - 搜索困难
   - 隐私隐忧

二、什么是 AI News Database？一个程序员的本地阅读终端
   - 产品介绍 + 核心功能
   - 8 个内置官方源
   - 阅读状态五态流

三、为什么我选择「本地优先」
   - 数据主权 vs 云端依赖
   - SQLite 的可移植性
   - 无需账号的极简体验

四、LLM 如何帮我「断舍离」
   - 自动摘要和标签
   - 质量评分机制
   - 智能策展：从 200 条到 10 条

五、RAG 问答：把阅读变成知识库
   - 本地 FTS5 全文检索
   - 带引用来源的 LLM 回答
   - 实际问答演示

六、安装与使用
   - go build 编译
   - LLM 配置（可选）
   - 晨间工作流：sync → enrich → curate → inbox

七、总结与展望
```

**文章开头钩子**：

```
我的 Pocket 里有 847 篇未读文章。
我的 RSS 订阅了 63 个源，平均每天产生 200+ 条更新。
我的浏览器收藏夹里躺着至少 50 篇「等有时间再看」的技术博客。

直到有一天我意识到：问题不是我不够勤奋，而是我没有一套「筛选 + 沉淀 + 检索」的系统。

今天分享一个我自己在用的开源工具 AI News Database，以及它背后的「本地优先」阅读哲学。
```

---

### 4. 微信公众号（中长文 + 干货）

**平台特性**：适合沉淀品牌内容，通过订阅号/服务号触达国内程序员群体，可配合社群运营。

**内容策略**：
- 比知乎更口语化，更注重「场景感」和「情绪价值」
- 结合具体的时间节点（早晨 9 点、通勤路上）描述使用场景
- 用清晰的流程图或截图降低理解门槛

**文章标题**：

《每天早上 5 分钟，我用一个命令行工具看完所有技术资讯》

**开头**：

```
早上 9 点，你打开邮箱，Notion，RSS，微信群...
未读消息像雪崩一样涌来。

你只想知道一件事：今天技术圈有什么真正值得看的东西？

我现在的做法是：打开终端，输入三个命令，5 分钟后带着 10 篇精选文章开始一天的工作。

这三个命令来自一个开源工具：AI News Database。
```

**中段（产品功能介绍）**：

```
【一键同步】
ai-news-database sync

自动拉取 Hacker News、V2EX、GitHub Blog、Reddit、阮一峰博客等 8 个高质量源的更新，存在本地 SQLite。

【AI 增强】
ai-news-database enrich

调用 LLM 给每篇文章生成中文摘要、技术标签、质量评分（0-10）。

【智能策展】
ai-news-database curate --top 10

基于质量分和你的阅读偏好，自动推荐今日必读。

【TUI 极速浏览】
ai-news-database inbox

像处理邮件一样处理文章：j/k 移动，r 已读，s 收藏，d 丢弃，a 归档。
```

**结尾 CTA**：

```
AI News Database 是完全开源的，基于 Go + SQLite，单二进制文件即可运行。

如果你也厌倦了被信息淹没，不妨试试「本地优先」的阅读方式。

GitHub: <链接>
安装: go build -o ai-news-database

你的数据，永远属于你。
```

---

### 5. B站 / 视频号（演示视频脚本）

**平台特性**：视觉化强，适合展示终端操作和 TUI 界面的「极客美学」。

**视频类型**：3-5 分钟产品演示 + 理念阐述

**脚本结构**：

```
0:00-0:15  开场钩子
           "你的浏览器有多少个未读标签页？我的曾经超过 200 个。
            直到我用了一个命令行工具，把信息焦虑变成了信息掌控。"

0:15-0:30  产品亮相
           展示 AI News Database 名称和标语，快速切终端界面

0:30-1:30  核心演示（快节奏剪辑）
           - sync: 一键同步 8 个源
           - enrich: LLM 自动摘要和评分
           - curate: 生成今日必读清单
           - inbox: TUI 中快速处理文章

1:30-2:30  深度功能演示
           - search: 本地全文搜索 "kubernetes"
           - ask: RAG 问答 "Go 和 Rust 并发模型差异"
           - export: 导出收藏为 Markdown

2:30-3:30  理念阐述
           讲解「本地优先」和「数据主权」
           展示 ~/.ai-news-database/ 目录和 SQLite 数据库文件

3:30-4:00  安装引导
           展示 go build 和 config.json 配置

4:00-4:30  结尾 + CTA
           "如果你也想找回对信息的掌控感，欢迎在评论区交流。"
```

**封面标题**：

- 「程序员必看｜我用一个二进制文件搞定了技术资讯管理」
- 「拒绝 SaaS 绑架｜本地优先的阅读工具有多爽」
- 「5 分钟清完 200 条未读｜LLM + SQLite 打造私人情报局」

---

### 6. 即刻 / 朋友圈（短平快）

**平台特性**：程序员和设计师活跃，适合短图文、观点输出、日常分享。

**文案 A**：

```
发现了一个很酷的开源工具 AI News Database：

把 HN、V2EX、GitHub Blog 等高质量技术源一键同步到本地 SQLite，然后让 LLM 自动写摘要、打标签、评质量分，每天自动出「今日必读 Top 10」。

最爽的是 TUI 收件箱，j/k 翻页，r/s/d/a 四键处理，10 分钟清完所有未读。

而且完全本地存储，不需要账号，数据就是你的 SQLite 文件。

这才是程序员该用的阅读工具。
```

**文案 B（数据主权）**：

```
越来越觉得「本地优先」是对的。

我的阅读记录、收藏列表、搜索历史，为什么要存在别人的服务器上？

AI News Database 把所有东西都存在 ~/.ai-news-database/ai-news-database.db 里。

一个文件，随时可以备份、导出、迁移。
没有账号，没有遥测，没有云。

数据主权，从阅读开始。
```

---

### 7. V2EX（技术社区）

**平台特性**：中文技术社区核心阵地，用户对产品敏感度高，喜欢讨论架构和实现细节。

**帖子标题**：

`[开源] AI News Database - 一个本地优先的 LLM-Native 技术资讯终端`

**帖子正文**：

```
大家好，分享一个最近做的开源项目 AI News Database。

它是一个为程序员设计的命令行工具，核心思路是「本地优先 + LLM 增强」：

**功能**
- 同步 8 个官方技术源（HN / V2EX / GitHub Blog / Reddit / 阮一峰 / 酷壳 / Lobsters / InfoQ）到本地 SQLite
- LLM 自动摘要、标签、质量评分
- 智能策展生成今日必读
- TUI 收件箱极速浏览（Bubble Tea）
- 本地 FTS5 全文搜索
- 基于本地知识库的 RAG 问答
- Markdown 导出

**技术栈**
- Go 1.25
- SQLite (modernc.org/sqlite, 纯 Go 无 CGO)
- FTS5 全文索引
- Bubble Tea + Lipgloss
- OpenAI 兼容 API

**本地优先**
- 所有数据存在 ~/.ai-news-database/
- 无需注册账号
- 零遥测

GitHub: <链接>

欢迎大家试用和提 issue！
```

---

### 8. Product Hunt（海外首发）

**平台特性**：海外产品发布核心渠道，需要精美的产品截图/视频、清晰的 value proposition、Maker 故事。

**产品名称**：AI News Database
**标语**：Your local-first, AI-powered news terminal for developers.

**Product Description**：

```
AI News Database is a local-first, LLM-native CLI tool that turns scattered tech news into a curated, searchable personal knowledge base.

**What it does:**
- Syncs top tech sources (Hacker News, GitHub Blog, V2EX, Reddit, etc.) directly to your local SQLite database
- Uses LLM to auto-summarize, tag, and score every article
- Curates a daily "must-read" top 10 based on quality and your preferences
- Lets you ask questions against your local archive with cited sources (RAG)
- Provides a beautiful TUI inbox for rapid triage (read/star/discard/archive)

**Why local-first?**
Because your reading history shouldn't live on someone else's server. No accounts. No cloud lock-in. Just a single SQLite file you own forever.

**Built with:** Go, SQLite (FTS5), Bubble Tea, and love for data sovereignty.
```

**Maker Comment（发布者留言）**：

```
Hi Product Hunt! 👋

I'm the maker of AI News Database. As a developer, I was drowning in unread newsletters and RSS feeds. I wanted a tool that could:
1. Pull the best sources automatically
2. Use AI to surface what actually matters
3. Keep ALL my data local

AI News Database is the answer. It's a single binary that runs on macOS, Linux, and Windows. Everything lives in a SQLite file on your machine.

Would love to hear your thoughts, especially on the local-first approach and what sources you'd like to see next!
```

---

## 四、发布节奏与运营计划

### Phase 1：冷启动（Week 1-2）

**目标**：获取第一批种子用户，收集反馈，验证产品价值。

| 时间 | 动作 | 平台 |
|------|------|------|
| D1 | 发布 Product Hunt | Product Hunt |
| D1 | 同步发布 Twitter/X 英文推文 + Demo GIF | Twitter |
| D2 | 在 V2EX 发开源介绍帖 | V2EX |
| D2 | 在 GitHub 发布 Release + Discussions | GitHub |
| D3 | 发布知乎深度长文 | 知乎 |
| D3 | 在即刻发布短图文 | 即刻 |
| D5 | 发布小红书图文 | 小红书 |
| D7 | 发布 B站 演示视频 | Bilibili |
| D7 | 发布微信公众号文章 | 微信公众号 |

**关键动作**：
- 在 GitHub README 顶部添加「Star History」和下载统计
- 在 V2EX / Twitter 评论区积极回复技术问题
- 收集首批用户反馈，整理为 GitHub Issues

### Phase 2：持续运营（Week 3-8）

**目标**：建立内容矩阵，通过 SEO 和社媒持续引流。

**每周内容排期**：

| 周一 | 周三 | 周五 |
|------|------|------|
| Twitter 技术小贴士 | 小红书/即刻 场景分享 | 知乎/公众号 深度长文 |

**内容主题池**：

1. **功能更新**：v0.x 版本新功能发布
2. **使用技巧**：如何用 `enrich + curate` 构建晨间阅读流
3. **理念输出**：《为什么我不用 Notion 做阅读管理了》
4. **对比评测**：AI News Database vs RSS 阅读器 vs 稍后读 App
5. **用户故事**：展示用户如何用 AI News Database 准备技术分享/面试
6. **幕后技术**：讲解 SQLite FTS5、Bubble Tea TUI、RAG 实现

### Phase 3：事件营销（Month 3+）

**目标**：通过事件和合作实现破圈增长。

**事件 Ideas**：

1. **「7 天信息断舍离挑战」**
   - 邀请用户连续 7 天使用 AI News Database 处理技术资讯
   - 每天打卡分享收件箱截图
   - 最佳分享者获得周边（贴纸/T恤）

2. **「我的今日必读 Top 10」晒单活动**
   - 用户分享 `ai-news-database curate --top 10` 的结果
   - 在 Twitter/X 上使用 hashtag #MyAI News DatabaseTop10

3. **播客/ newsletter 合作**
   - 邀请技术播客（如捕蛇者说、代码时间）做一期「本地优先工具」专题
   - 在技术 newsletter（如 科技爱好者周刊）中投稿推荐

4. **开源联动**
   - 与 Obsidian / Logseq 社区合作，推广 Markdown 导出工作流
   - 与 Ollama 社区联动，强调「本地 LLM + 本地知识库」

---

## 五、视觉资产清单

为了支撑上述推广，需要准备以下视觉素材：

| 资产 | 用途 | 规格 |
|------|------|------|
| **Logo / 图标** | 所有平台头像、GitHub Org | SVG + 512x512 PNG |
| **Hero 截图** | 产品介绍页首图、公众号封面 | 1920x1080 |
| **TUI 演示 GIF** | Twitter、B站、小红书 | 15-30 秒，1080p |
| **流程图** | sync → enrich → curate → inbox | 横版/竖版各一 |
| **功能卡片图** | 小红书多图、知乎配图 | 1080x1080 x 6 张 |
| **数据主权概念图** | 本地 vs 云端对比 | 信息图风格 |
| **安装命令截图** | 即刻、Twitter 快速分享 | 终端风格 |

---

## 六、数据指标与复盘

### 北极星指标

- **GitHub Stars**：衡量技术社区认可度
- **Active Users**：每周至少执行一次 `sync` 的用户数（可设计匿名遥测或问卷调查）
- **Content Engagement**：各平台内容的点赞/收藏/转发/评论量

### 过程指标

| 指标 | 来源 | 目标（Month 1） |
|------|------|----------------|
| GitHub Stars | GitHub | 500+ |
| Product Hunt Upvotes | PH | 200+ |
| V2EX 评论数 | V2EX | 50+ |
| 知乎文章阅读量 | 知乎 | 10,000+ |
| B站 播放量 | Bilibili | 5,000+ |
| 公众号阅读量 | 微信 | 3,000+ |

### 复盘周期

- **每周**：统计各平台内容表现，优化下周选题
- **每月**：评估用户增长漏斗，调整投放平台权重
- **每季度**：复盘产品方向，决定是否增加新采集源或功能

---

## 七、合作渠道建议

### 技术媒体 / Newsletter

| 渠道 | 形式 | 优先级 |
|------|------|--------|
| 阮一峰科技爱好者周刊 | 工具推荐 | ⭐⭐⭐⭐⭐ |
| 掘金社区 | 专栏文章/沸点 | ⭐⭐⭐⭐ |
| InfoQ 中文站 | 开源项目报道 | ⭐⭐⭐⭐ |
| 少数派 | 效率工具测评 | ⭐⭐⭐⭐⭐ |
| 利器 | 采访 Maker | ⭐⭐⭐ |

### 社区 / 社群

| 渠道 | 形式 | 优先级 |
|------|------|--------|
| V2EX | 产品发布帖 | ⭐⭐⭐⭐⭐ |
| 即刻 | 日常分享 + 话题 | ⭐⭐⭐⭐ |
| Twitter/X | 英文推广主阵地 | ⭐⭐⭐⭐⭐ |
| Lobsters | 开源项目分享 | ⭐⭐⭐ |
| Hacker News | Show HN | ⭐⭐⭐⭐ |

### 播客 / 视频

| 渠道 | 形式 | 优先级 |
|------|------|--------|
| 捕蛇者说 | 嘉宾访谈 | ⭐⭐⭐⭐ |
| 代码时间 | 工具推荐 | ⭐⭐⭐ |
| B站 UP主（技术区） | 合作评测 | ⭐⭐⭐⭐ |
| YouTube（英文） | Maker 自述 | ⭐⭐⭐ |

---

## 八、风险与应对

| 风险 | 应对策略 |
|------|---------|
| 采集源页面结构变更导致爬虫失效 | 建立源健康度监控，页面变更时快速更新选择器/API 调用 |
| LLM 调用成本让用户望而却步 | 强调「可选配置」，推荐 Ollama 本地免费方案 |
| 用户认为 CLI 门槛太高 | 准备 Web UI 路线图，优先做简单的 Web Dashboard |
| 海外社区对中文内容不感冒 | 维护英文 README 和 Twitter 内容，区分中英文运营 |
| 竞品快速复制功能 | 持续深耕「本地优先」品牌心智，建立社区护城河 |

---

## 九、快速启动 Checklist

如果你准备今天就开始推广，按这个清单执行：

- [ ] 确保 GitHub README 完整且包含 Demo GIF
- [ ] 准备 Twitter/X 发布文案 + 3-5 张配图/GIF
- [ ] 在 Product Hunt 提交产品（提前 1-2 天准备）
- [ ] 在 V2EX 发布介绍帖（周三/周四上午效果最佳）
- [ ] 在即刻发第一条短图文测试反响
- [ ] 联系 1-2 位技术博主/ newsletter 编辑寻求推荐
- [ ] 在 GitHub Discussions 开启「使用反馈」板块
- [ ] 设置 Google Alerts / Twitter 关键词监控用户提及

---

## 十、查漏补缺与深度运营

### 1. GitHub 增长专项策略

GitHub 是开源项目最重要的流量入口和用户信任背书，必须重点经营。

#### README 优化清单

- [ ] **首屏吸睛**：前 3 行必须说清楚「这是什么」和「为什么需要它」
- [ ] **Demo GIF 置顶**：首屏必须有一个 15-30 秒的 TUI/命令行演示 GIF
- [ ] **快速安装**：提供 `go install` 或一键安装脚本（`curl | bash`）
- [ ] **功能可视化**：用表格或勾选清单展示功能特性
- [ ] **Star History 徽章**：使用 `star-history.com` 生成趋势图
- [ ] **Contributors 墙**：展示贡献者头像，增强社区感
- [ ] **中文/英文切换**：提供英文版 README（`README_EN.md`）并在顶部加语言切换链接

#### Release 策略

- **Release Note 模板**：每个版本发布必须包含
  - `What's New`（新功能）
  - `Improvements`（改进）
  - `Bug Fixes`（修复）
  - `Breaking Changes`（破坏性变更，如有）
  - `Assets`（预编译二进制文件）
- **版本号规范**：遵循 SemVer（v0.x.x → v1.0.0）
- **预编译二进制**：使用 GitHub Actions 自动构建 macOS/Linux/Windows 二进制并附到 Release

#### Discussions 运营

- 开启 3 个核心分类：
  - `💬 General` -  general chat
  - `❓ Q&A` - 使用问题
  - `💡 Ideas` - 功能建议
- Maker 每天花 15 分钟回复新帖子，让用户感到被重视

#### Star 增长技巧

- **互惠原理**：给相关项目（Bubble Tea、goquery、Cobra）点 Star 并留言，吸引其用户关注
- **Awesome Lists**：提交到 `awesome-go`、`awesome-cli-apps`、`awesome-productivity` 等列表
- **Hacker News Show HN**：在发布当天同步发 Show HN，引流到 GitHub

---

### 2. SEO 与关键词策略

#### 中文关键词

| 关键词 | 搜索意图 | 内容布局 |
|--------|---------|---------|
| 程序员阅读工具 | 产品发现 | 知乎/公众号标题 |
| 本地优先 RSS | 解决方案 | 知乎/小红书内容 |
| 命令行新闻阅读器 | 工具搜索 | B站/即刻 |
| SQLite 知识库 | 技术实现 | 知乎深度文 |
| Hacker News 中文 | 场景需求 | 小红书/B站 |
| 技术资讯管理 | 痛点解决 | 公众号/知乎 |
| LLM 摘要工具 | 功能搜索 | Twitter/即刻 |

#### 英文关键词

| 关键词 | 搜索意图 | 内容布局 |
|--------|---------|---------|
| local-first news reader | 产品发现 | Product Hunt / Blog |
| CLI news aggregator | 工具搜索 | Reddit / HN |
| programmer news terminal | 品牌词 | Twitter / Dev.to |
| SQLite personal knowledge base | 技术实现 | Medium / Dev.to |
| TUI RSS alternative | 解决方案 | Lobsters / HN |
| AI news curator | 功能搜索 | Twitter / IndieHackers |

#### SEO 优化清单

- [ ] 创建项目官网或 GitHub Pages 落地页（使用 `web/` 目录部署）
- [ ] 在 Dev.to / Medium 发布英文技术文章，文末回链 GitHub
- [ ] 知乎文章标题必须包含核心关键词
- [ ] B站视频简介和标签中埋入关键词
- [ ] 小红书笔记标题带 `#程序员效率工具` 等高搜索量标签

---

### 3. 竞品深度分析

| 竞品 | 类型 | 优势 | 劣势 | AI News Database 差异化 |
|------|------|------|------|-------------------|
| **Feedly** | RSS 云端阅读器 | 生态成熟、多端同步 | 付费、数据在云端、无 LLM | 本地优先 + LLM 增强 |
| **Inoreader** | RSS 云端阅读器 | 功能强大、规则过滤 | 价格贵、隐私风险 | 零成本 + 数据主权 |
| **Pocket** | 稍后读工具 | 跨平台、集成浏览器 | 收藏即冷冻、搜索弱 | 主动策展 + 本地 RAG |
| **Notion Web Clipper** | 知识管理 | 灵活的数据库结构 | 重、慢、数据在云端 | 轻量终端 + 极速搜索 |
| **Omnivore** | 开源稍后读 | 开源、免费 | 仍需自托管服务器 | 单二进制零依赖 |
| **Readwise Reader** | 付费阅读器 | AI 摘要、高亮导出 | 月付 $8.99、数据上云 | 完全本地 + 免费 |

**核心护城河**：
1. **本地优先的品牌心智**：竞品大多是云端 SaaS，本地存储是独特定位
2. **TUI 极客体验**：命令行 + Bubble Tea 的交互在开发者中有天然吸引力
3. **灵感模式的本地存储**：Show HN 产品自动入库，这是竞品没有的功能
4. **单二进制零依赖**：部署门槛远低于需要 Docker/自托管的竞品

---

### 4. 用户转化漏斗

```
认知（Awareness）
  ├─ 看到 Twitter/V2EX/知乎内容
  ▼
兴趣（Interest）
  ├─ 点击 GitHub 链接，浏览 README
  ▼
试用（Trial）
  ├─ 执行 go build / go install
  ▼
激活（Activation）
  ├─ 成功运行 ai-news-database sync 并看到文章
  ▼
留存（Retention）
  ├─ 3 天内再次使用 enrich / curate / inbox
  ▼
推荐（Referral）
  └─ 在社交媒体分享使用体验 / 提交 PR
```

#### 各环节优化策略

| 阶段 | 转化率瓶颈 | 优化策略 |
|------|-----------|---------|
| 认知→兴趣 | 标题不够吸引人 | A/B 测试不同标题的点击率 |
| 兴趣→试用 | CLI 门槛让用户却步 | README 首屏加 Demo GIF，强调「只需 go build」 |
| 试用→激活 | 编译失败 / 首次 sync 无内容 | 提供预编译二进制，首次 sync 必须有内容产出 |
| 激活→留存 | 用户试一次就忘了 | 推送「7 天断舍离挑战」，建立使用习惯 |
| 留存→推荐 | 用户满意但不愿分享 | 设计晒单活动，提供贴纸/T恤等实物激励 |

---

### 5. 内容日历模板（4 周可执行版）

可直接打印或导入 Notion/Trello 执行：

#### Week 1：产品发布周

| 日期 | 平台 | 内容 | 负责人 |
|------|------|------|--------|
| 周一 | Product Hunt + Twitter | 产品正式发布 + Demo GIF | Maker |
| 周二 | V2EX + GitHub | 开源介绍帖 + Release Note | Maker |
| 周三 | 知乎 | 深度长文《本地优先阅读管理》 | 运营 |
| 周四 | 即刻 | 短图文 + TUI 截图 | 运营 |
| 周五 | 小红书 | 效率工具图文《5分钟清完未读》 | 运营 |
| 周六 | B站 | 产品演示视频发布 | 运营 |
| 周日 | 公众号 | 整合周内容发长文 | 运营 |

#### Week 2：反馈回应周

| 日期 | 平台 | 内容 | 目标 |
|------|------|------|------|
| 周一 | Twitter | 转发用户反馈 + 感谢 | 增强社区感 |
| 周二 | V2EX | 更新帖子，回应高频问题 | 提升留存 |
| 周三 | 知乎 | 回答相关问题，文末带链接 | SEO 引流 |
| 周四 | 小红书 | 使用技巧《如何配置 LLM》 | 教育用户 |
| 周五 | GitHub | 发 v0.x.1 修复版 Release | 展示迭代速度 |

#### Week 3：理念输出周

| 日期 | 平台 | 内容 | 目标 |
|------|------|------|------|
| 周一 | Twitter | 本地优先 vs 云端 SaaS 对比图 | 强化品牌心智 |
| 周二 | 即刻 | 用户故事：某大厂工程师的晨间工作流 | 场景种草 |
| 周三 | 知乎 | 《为什么我不用 Notion 做阅读管理了》 | 蹭热度 + 差异化 |
| 周四 | 小红书 | 数据主权主题图文 | 引发共鸣 |
| 周五 | B站 | 幕后技术：Bubble Tea TUI 开发心得 | 技术圈粉 |

#### Week 4：事件驱动周

| 日期 | 平台 | 内容 | 目标 |
|------|------|------|------|
| 周一 | 全平台 | 启动「7 天信息断舍离挑战」 | 提升活跃 |
| 周三 | Twitter | 转发挑战打卡内容 | UGC 扩散 |
| 周五 | 全平台 | 公布挑战结果 + 抽奖 | 收尾转化 |
| 周日 | 公众号 | 月度总结 + 下月预告 | 留存维护 |

---

### 6. 危机应对与负面反馈话术

#### 场景 A："又是一个轮子，和 RSS 有什么区别？"

**应对话术**：

```
AI News Database 不是 RSS 阅读器，而是面向程序员的信息处理终端。

传统 RSS 解决的是「订阅」问题，AI News Database 解决的是「筛选 + 沉淀 + 检索」问题：
- 内置 8 个精选源，省去你筛选 RSS 源的时间
- LLM 自动摘要评分，帮你从 200 条里挑出 10 条必读
- 所有内容存在本地 SQLite，支持 FTS5 全文搜索和 RAG 问答
- 一个二进制文件即可运行，无需部署 RSS 服务端

如果你只是偶尔看看新闻，RSS 足够；但如果你想建立个人的技术知识库，AI News Database 会更合适。
```

#### 场景 B："CLI 门槛太高，普通人用不了。"

**应对话术**：

```
AI News Database 的目标用户确实是习惯命令行的开发者，CLI 反而是我们的优势——它足够轻量、快速、可脚本化。

不过对于非技术用户，我们已经在规划 Web Dashboard（见 Roadmap），届时会有更友好的图形界面。现在你也可以先试试 TUI 的 `ai-news-database inbox`，它的交互非常直觉（j/k 移动，r/s/d/a 处理）。
```

#### 场景 C："采集别人的内容，版权问题怎么算？"

**应对话术**：

```
AI News Database 只采集公开可访问的标题、摘要和元数据，用于个人本地阅读管理，不涉及内容再分发或商业用途。这和使用浏览器访问这些网站或 RSS 阅读器订阅它们的逻辑是一致的。

同时我们内置了 Jina AI Reader 等工具，用户可以直接访问原文，尊重原创作者的流量。
```

#### 场景 D："LLM 配置太麻烦，而且 API 很贵。"

**应对话术**：

```
LLM 增强是可选功能，不配 LLM 也能完整使用 sync / inbox / search / export 等核心功能。

如果你希望零成本使用 LLM，推荐搭配 Ollama 本地部署（`llama3.2` 即可），完全免费且数据不出本地。配置只需把 base_url 改成 `http://localhost:11434/v1`。
```

#### 场景 E：负面评论/恶意攻击

**应对原则**：
1. **不怼用户**：即使评论无理，也保持礼貌
2. **承认局限**：如果批评有理，大方承认并给出改进计划
3. **转移阵地**：复杂问题引导到 GitHub Issues 讨论
4. **不纠缠**：对于明显钓鱼/引战评论，选择不回复或仅回复一次

---

### 7. 私域运营与社群建设

#### Discord 服务器（海外）

**频道规划**：
- `#introductions` - 自我介绍
- `#general` - 日常闲聊
- `#help` - 使用求助
- `#feature-ideas` - 功能建议
- `#showcase` - 用户晒单/工作流分享
- `#dev` - 开发者讨论

**运营节奏**：
- 每周五发布「本周更新」公告
- 每月一次 Voice AMA（Ask Me Anything）

#### 微信群 / Telegram（国内）

**群规**：
- 禁止广告，允许技术闲聊
- 每周一发布「本周必读」机器人消息（可用 `curate` 结果）
- 定期收集用户反馈，整理到 GitHub Issues

**冷启动策略**：
- 先在 V2EX / 即刻 / 公众号文章底部放群二维码
- 前 100 名入群用户赠送电子版「本地优先工具包」（Obsidian 模板 + AI News Database 配置模板）

---

### 8. A/B 测试计划

通过小范围测试优化推广效果：

| 测试项 | 变量 A | 变量 B | 指标 | 平台 |
|--------|--------|--------|------|------|
| 标题吸引力 | "5 分钟看完今日必读" | "我把 200 条未读变成了 10 条精选" | 点击率 | 小红书/即刻 |
| CTA 文案 | "GitHub 链接" | "免费下载" | 转化率 | Twitter |
| 视频开头 | 痛点切入 | 产品直接展示 | 3 秒完播率 | B站 |
| 功能强调 | LLM 增强 | 本地优先 | 收藏率 | 知乎 |
| 发布时间 | 周三上午 | 周五晚上 | 阅读量 | 公众号 |

**测试规则**：
- 每个测试至少运行 1 周，样本量 > 1000 曝光
- 每次只测一个变量，确保结果可归因
- 记录测试结论，沉淀为《内容运营 SOP》

---

### 9. KOL/KOC 联络清单

#### 中文技术博主

| 博主/媒体 | 平台 | 内容方向 | 合作形式 | 优先级 |
|-----------|------|---------|---------|--------|
| 阮一峰 | 周刊/博客 | 科技爱好者周刊 | 投稿工具推荐 | ⭐⭐⭐⭐⭐ |
| 少数派编辑部 | 少数派 | 效率工具 | 产品测评 | ⭐⭐⭐⭐⭐ |
| 毕导 | B站/知乎 | 科普/工具 | 合作评测 | ⭐⭐⭐ |
| 智能路障 | B站 | 效率/阅读 | 视频推荐 | ⭐⭐⭐⭐ |
| 即刻「工具分享」圈子 | 即刻 | 效率工具 | 圈内分享 | ⭐⭐⭐⭐ |
| 掘金官方 | 掘金 | 技术文章 | 首页推荐 | ⭐⭐⭐⭐ |

#### 英文技术博主

| 博主/媒体 | 平台 | 内容方向 | 合作形式 | 优先级 |
|-----------|------|---------|---------|--------|
| Hacker News | YC | 技术产品 | Show HN | ⭐⭐⭐⭐⭐ |
| Indie Hackers | 社区 | 独立开发 | 产品发布 | ⭐⭐⭐⭐ |
| Dev.to 编辑 | Dev.to | 开发工具 | 首页推荐 | ⭐⭐⭐⭐ |
| Console.dev | Newsletter | 开发者工具 | 投稿推荐 | ⭐⭐⭐⭐ |
| TLDR Newsletter | Newsletter | 科技资讯 | 工具推荐 | ⭐⭐⭐ |

**联络话术模板**：

```
Hi [Name],

I'm the maker of AI News Database, a local-first, LLM-native news terminal for programmers built with Go and SQLite.

It syncs top tech sources (HN, GitHub Blog, V2EX, etc.) to a local SQLite database, auto-summarizes articles with LLM, and supports RAG Q&A over your personal archive.

I think it would resonate well with your audience of [description]. Would you be open to checking it out? Happy to provide any assets or do an interview if helpful.

GitHub: [link]
Demo: [link]

Best,
[Your Name]
```

---

### 10. 零预算推广策略

如果推广预算为 0，优先执行以下动作（按 ROI 排序）：

1. **GitHub 优化**（投入 4 小时，预期回报：长期自然流量）
   - 写好 README + Demo GIF + Release Note
   - 提交到 10+ Awesome Lists

2. **技术社区发帖**（投入 2 小时/平台，预期回报：精准种子用户）
   - V2EX、Lobsters、Hacker News Show HN
   - 回复相关帖子时自然带入（不要硬广）

3. **内容 SEO**（投入 8 小时/篇，预期回报：长期搜索流量）
   - 在知乎/ Dev.to 发 2-3 篇深度长文
   - 文章生命周期长达数月，持续带来 GitHub 流量

4. **社交媒体日常运营**（投入 30 分钟/天，预期回报：品牌曝光）
   - Twitter/X 每日一条技术小贴士或产品更新
   - 转发用户使用体验，建立社区感

5. **开源互惠**（投入 1 小时/天，预期回报：建立人脉）
   - 给相关项目提 PR 或优质 Issue
   - 在技术社区积极回答他人问题

---

## 十一、配套文档现状

为了支撑推广和长期运营，项目已建立完整的文档矩阵：

| 文档 | 状态 | 说明 |
|------|------|------|
| `README.md` | ✅ 已更新 | 987+ 行，涵盖架构、使用、路线图、安全说明 |
| `PROMOTION.md` | ✅ 已创建 | 1018 行，自媒体推广方案与运营策略 |
| `BUSINESS.md` | ✅ 已创建 | 432 行，商业战略、定价、商业模式 |
| `CONTRIBUTING.md` | ✅ 已创建 | 规范贡献流程，降低 PR 门槛 |
| `CHANGELOG.md` | ✅ 已创建 | 记录版本变更，方便用户跟踪更新 |
| `SECURITY.md` | ✅ 已创建 | 安全政策和漏洞报告流程 |
| `CODE_OF_CONDUCT.md` | ✅ 已创建 | 社区行为准则 |
| `LICENSE` | ✅ 已创建 | MIT 许可证 |
| `Makefile` | ✅ 已创建 | 构建、测试、发布一键命令 |
| `install.sh` | ✅ 已创建 | 一键安装脚本（支持 curl \| bash） |
| `ROADMAP.md` | ✅ 已并入 README | 产品规划直接展示在 README 路线图章节 |

### 工程实践补充

- **CI/CD**: GitHub Actions 已配置（多平台 Go 1.25/1.26 测试 + Release 自动构建）
- **测试覆盖**: 核心模块测试已补充（article, config, llm, official, dedup, search, storage, subscription, cmd）
- **版本管理**: CLI 已支持 `--version`，由 Makefile 在构建时注入版本信息

---

**结语**

AI News Database 不仅仅是一个工具，它代表了一种「本地优先」的技术生活态度。推广的终极目标不是让用户下载一个二进制文件，而是让他们意识到：自己的数据和注意力，值得被更好地对待。

*你的数据，永远属于你。*
