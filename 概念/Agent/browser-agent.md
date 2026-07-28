---
title: "Browser Agent / 浏览器 Agent (Browser-Use / Stagehand / Playwright-MCP)"
category: concepts
tags:
  - agent
  - browser-agent
  - browser-use
  - stagehand
  - playwright
  - mcp
  - web-automation
  - web-scraping
aliases:
  - Browser Agent
  - Browser-Use
  - Stagehand
  - Playwright MCP
  - Web Automation Agent
  - Web Scraping Agent
relationships:
  - target: "概念/mcp"
    type: extends
  - target: "概念/gui-agent"
    type: related_to
  - target: "概念/tool-use"
    type: related_to
  - target: "概念/agent-benchmarks"
    type: related_to
summary: "Browser Agent 是 2024-2026 爆发的"Web 自动化"赛道——Browser-Use、Stagehand、Playwright-MCP、Anchor Browser 让 LLM 直接操控浏览器(点击、填表、爬取、登录),解决"90% 企业 SaaS 没有 API"的现实问题。GitHub Star 数月增 10K+,是 RPA + Web Scraping 的 AI 重构。"
lifecycle: reviewed
tier: core
created: 2026-07-24
updated: 2026-07-24
sources: []
name_zh: "Browser Agent / 浏览器 Agent"
---

# Browser Agent / 浏览器 Agent

> 中文简称：Browser Agent / 浏览器 Agent

> **一句话理解**:Browser Agent 把 LLM 接到浏览器上,让它"看页面 → 找元素 → 点击/输入"——能用自然语言完成 Web 任务(下单、填表、爬数据、登录),让"没有 API 的 SaaS"也能被 AI 自动化。

---

## 一、为什么 Browser Agent 重要?

- **90% 企业 SaaS 没 API**:Notion / Salesforce / 内部 ERP / 政务系统
- **RPA 痛点**:UiPath 贵、慢、要脚本、需培训
- **Web Scraping 新范式**:传统 XPath/CSS Selector 脆,DOM 变化即崩
- **GUI 测试替代**:Selenium 老旧,自然语言更直观
- **AI 落地刚需**:客服 / 销售 / 运营 / 财务都有"Web 重复操作"

---

## 二、关键术语中英对照

| 中文 | 英文 | 说明 |
|---|---|---|
| 浏览器 Agent | Browser Agent | 自主操作浏览器的 Agent |
| 浏览器自动化 | Browser Automation | 用程序控制浏览器 |
| 网页爬取 | Web Scraping | 抓取网页数据 |
| 浏览器使用 | Browser Use | 主流项目名 |
| DOM 树 | Document Object Model(DOM) | 页面结构树 |
| CSS 选择器 | CSS Selector | 元素定位语法 |
| XPath | XML Path Language | 元素定位语法 |
| 无头浏览器 | Headless Browser | 无界面的浏览器 |
| Chromium | Chromium | Chrome 内核 |
| 元素定位 | Element Grounding | 元素 ID → 坐标 |
| 视觉理解 | Visual Understanding | 截图理解 |
| 语义定位 | Semantic Locator | "那个红色按钮"自然语言定位 |
| 反爬 | Anti-Bot | 防止被爬的机制 |
| 验证码 | CAPTCHA | 反机器人验证 |
| 指纹 | Browser Fingerprint | 浏览器特征 |
| 代理 | Proxy | IP 代理 |
| 会话保持 | Session Persistence | 登录状态保留 |
| 持久化上下文 | Persistent Context | 浏览器数据持久化 |
| 多标签 | Multi-Tab | 多页面同时操作 |
| 弹窗处理 | Popup Handling | 处理 alert/confirm |
| 等待策略 | Wait Strategy | 显式/隐式等待 |
| 重试 | Retry | 失败重试机制 |
| 错误恢复 | Error Recovery | 自愈能力 |
| 录播 | Recording | 录屏 + 操作日志 |

---

## 三、主流 Browser Agent 对比(2026-02 快照)

| 项目 | 厂商 | 类型 | 许可证 | GitHub Stars | 核心特色 |
|---|---|---|---|---|---|
| **Browser-Use** | Magnus Müller 等 | Python 库 | MIT | 30K+ | SOTA WebArena,自然语言定位 |
| **Stagehand** | Browserbase | TypeScript | MIT | 18K+ | 三大动作:act/extract/observe |
| **Playwright** | Microsoft | 通用库 | Apache 2.0 | 70K+ | 跨浏览器,事实标准 |
| **Playwright-MCP** | Microsoft | MCP Server | MIT | 5K+ | Playwright 包装为 MCP |
| **Selenium** | Selenium HQ | 老牌库 | Apache 2.0 | 30K+ | 经典,逐渐被 Playwright 替代 |
| **Puppeteer** | Google Chrome 团队 | Node.js | Apache 2.0 | 88K+ | Chrome 优先 |
| **Skyvern** | Skyvern AI | AI 驱动 | AGPL-3.0 | 11K+ | 视觉理解 + 强化学习 |
| **Anchor Browser** | Anchor AI | 商业 SaaS | 商业 | — | 企业级,反爬强 |
| **Steel** | Steel.dev | 商业 API | 商业 | — | 浏览器云服务 |
| **Browserbase** | Browserbase | 商业 PaaS | 商业 | — | 托管浏览器 |
| **Hyperbrowser** | Hyperbrowser | 商业 API | 商业 | — | 浏览器云服务 |
| **multi-on** | MultiOn | 商业 SaaS | 商业 | — | 个人 AI 助理 |
| **Do Browser** | Do Inc | 商业 SaaS | 商业 | — | 通用 Agent |
| **Open Operator** | OpenAI | 商业 | 商业 | — | 2025-09 Operator |

---

## 四、Browser-Use 实战(开源主流)

### 4.1 安装

```bash
pip install browser-use
playwright install chromium
```

### 4.2 简单任务

```python
from langchain_openai import ChatOpenAI
from browser_use import Agent
import asyncio

llm = ChatOpenAI(model="gpt-4o")

async def main():
    agent = Agent(
        task="在 hackernews.com 找到今天 score 最高的文章,把标题和链接告诉我",
        llm=llm,
    )
    result = await agent.run()
    print(result)

asyncio.run(main())
```

### 4.3 关键能力

- **自然语言定位**:"点击那个红色按钮" / "在搜索框输入"
- **多步任务**:登录 → 搜索 → 提取 → 翻页
- **错误恢复**:点击失败自动重试
- **会话保持**:登录状态跨任务保留
- **MCP 集成**:作为 MCP Server 给其他 Agent 用
- **并行多标签**:多页面同时操作
- **自定义工具**:挂 Python 函数给 Agent

### 4.4 高级用法

```python
from browser_use import Agent, Controller
from pydantic import BaseModel

class HNArticle(BaseModel):
    title: str
    url: str
    score: int

controller = Controller()

@controller.action("Save article")
def save_article(article: HNArticle):
    with open("articles.json", "a") as f:
        f.write(article.model_dump_json() + "\n")

agent = Agent(
    task="抓取首页前 10 篇文章,保存为 JSON",
    llm=llm,
    controller=controller,
)
```

---

## 五、Stagehand 实战(TypeScript)

### 5.1 安装

```bash
npm install @browserbasehq/stagehand
```

### 5.2 三大动作

```typescript
import { Stagehand } from "@browserbasehq/stagehand";

const stagehand = new Stagehand({
  env: "BROWSERBASE",
  apiKey: process.env.BROWSERBASE_API_KEY,
});
await stagehand.init();

const page = stagehand.page;

// act:自然语言操作
await page.act("点击登录按钮");
await page.act("在邮箱输入框输入 user@example.com");

// extract:结构化提取
const articles = await page.extract({
  instruction: "提取首页所有文章标题和链接",
  schema: z.object({
    articles: z.array(z.object({
      title: z.string(),
      url: z.string(),
    }))
  })
});

// observe:观察页面
const actions = await page.observe("找到搜索框");
```

---

## 六、Playwright-MCP 实战(MCP 集成)

### 6.1 配置 Claude Desktop

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"]
    }
  }
}
```

### 6.2 工具集

- `browser_navigate`:导航到 URL
- `browser_screenshot`:截图
- `browser_click`:点击元素
- `browser_type`:输入文字
- `browser_evaluate`:执行 JS
- `browser_snapshot`:获取可访问性树

### 6.3 优势

- MCP 协议 → Claude / Cursor / Cline 都能用
- 跨浏览器:Chromium / Firefox / WebKit
- 持久化上下文:登录状态保留

---

## 七、关键技术挑战

### 7.1 元素定位

- 动态 ID:每次刷新 ID 变
- 复杂 DOM:Shadow DOM / iframe
- 视觉 vs DOM:用截图还是 DOM 树?

### 7.2 反爬

- Cloudflare / Akamai 拦截
- 验证码(hCaptcha / reCAPTCHA)
- 浏览器指纹检测

### 7.3 性能

- 截图 ~100-500ms
- 慢页面(JS 渲染)等待
- 多步任务:可能 30s-2min

### 7.4 合规

- robots.txt
- 服务条款
- GDPR / 数据隐私

---

## 八、生产最佳实践

1. **首选 Browser-Use(开源)**:自然语言定位,WebArena SOTA。
2. **企业内部用 Playwright + 自定义封装**:稳定、可控。
3. **云端反爬强用 Browserbase / Steel**:托管浏览器,IP 池完善。
4. **MCP 集成为主**:Browser-Use / Playwright-MCP 暴露为 MCP Server,Claude / Cursor 直接用。
5. **持久化上下文保留登录**:避免每次任务重新登录。
6. **错误重试 + 超时**:Web 任务易超时,必设重试。
7. **截图存证**:所有任务存截图,合规 + debug。
8. **任务分解**:长任务拆 5-10 步小任务,每步可监控。
9. **人类把关关键操作**:付款、删除、发送,必须人工 click 确认。
10. **成本监控**:云端浏览器按分钟计费,长任务成本高。
11. **可观测性**:Langfuse + 自定义指标,记录每步耗时/成功率。
12. **测试用 WebArena / Mind2Web**:标准化评测,持续优化。

---

## 九、2026 生态速览

| 维度 | 2026 状态 |
|---|---|
| **Browser-Use** | 30K+ stars,WebArena SOTA(成功率 80%+) |
| **Stagehand** | 18K stars,TypeScript 首选,三大动作范式 |
| **Playwright-MCP** | 5K stars,Claude / Cursor 标配 |
| **WebArena SOTA** | 80%+(Browser-Use),65%+(Stagehand) |
| **云端浏览器** | Browserbase / Steel / Hyperbrowser / Anchor 三足鼎立 |
| **企业应用** | 客服 / 销售 / 财务 / 运营"无 API 自动化" |
| **RAG 集成** | Browser Agent + RAG = 实时知识库构建 |
| **标准化** | WebArena / Mind2Web / ScreenAgent / WebShop |
| **中国厂商** | 阿里通义晓蜜 / 百度 AppBuilder / 字节扣子 |
| **ARR 规模** | Browserbase $30M+ / MultiOn $10M+ / Anchor $20M+ |

---

## 十、See Also(官方源)

### 开源项目

- Browser-Use [github.com/browser-use/browser-use](https://github.com/browser-use/browser-use)
- Stagehand [github.com/browserbasehq/stagehand](https://github.com/browserbasehq/stagehand)
- Playwright [github.com/microsoft/playwright](https://github.com/microsoft/playwright)
- Playwright-MCP [github.com/microsoft/playwright-mcp](https://github.com/microsoft/playwright-mcp)
- Skyvern [github.com/Skyvern-AI/skyvern](https://github.com/Skyvern-AI/skyvern)
- Selenium [github.com/SeleniumHQ/selenium](https://github.com/SeleniumHQ/selenium)

### 商业平台

- Browserbase [browserbase.com](https://www.browserbase.com/)
- Steel [steel.dev](https://steel.dev/)
- Hyperbrowser [hyperbrowser.ai](https://hyperbrowser.ai/)
- Anchor Browser [anchorbrowser.io](https://www.anchorbrowser.io/)
- MultiOn [multion.ai](https://www.multion.ai/)

### 评测基准

- WebArena [github.com/web-arena-x/webarena](https://github.com/web-arena-x/webarena)
- Mind2Web [github.com/OSU-NLP-Group/Mind2Web](https://github.com/OSU-NLP-Group/Mind2Web)
- ScreenAgent [github.com/screenagent](https://github.com/screenagent)
- WebShop [github.com/princeton-nlp/webshop](https://github.com/princeton-nlp/webshop)

---

## 十一、相关概念卡

- [[概念/gui-agent|Gui Agent]]
- [[概念/computer-use|Computer Use]]
- [[概念/agent-benchmarks|Agent Benchmarks]]
- [[概念/mcp|Mcp]]
- [[概念/tool-use|Tool Use]]
- [[概念/agent-framework|Agent Framework]]
- [[概念/agent-loop|Agent Loop]]
- [[概念/rag|Rag]]
