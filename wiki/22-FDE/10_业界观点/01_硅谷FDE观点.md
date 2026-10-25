# 硅谷 FDE 观点

> **最后更新**：2026-08-03
> 本文件汇总行业领袖、创业者、投资人对 FDE 的公开论述。**引言均标注来源**，区分【已证实原文】与【转述/概括】。

---

## 一、行业领袖怎么说

### Alex Karp（Palantir CEO）

> "Our forward deployed engineers are the connective tissue between our software and the mission."
>
> —— Palantir 官方哲学：软件 + FDE 是不可分割的整体。

- Karp 与 Nicholas Zamiska 合著 **《The Technological Republic》**（2024），系统阐述 FDE 哲学：软件公司应作为政府的战略伙伴，FDE 是价值交付核心，不是事后补丁。
- 著名的「**法国餐厅**」比喻：侍者（FDE）是餐厅体验不可分割的一部分，而非附属。
- FDE 称谓源自「前线部署军队 (forward-deployed troops)」的军事概念。

> 来源：[Wired: Palantir 深度报道](https://www.wired.com/story/palantir-what-the-company-does/) · [Palantir 哲学与 FDE](https://zenn.dev/inspector/articles/palantir-philosophy-and-fde)

### Sam Altman / Brad Lightcap（OpenAI）

> ⚠️ **日期更正**：早期版本称「OpenAI 在 2025 年 9 月启动 Deployment Company」。经核实，OpenAI Deployment Company（DeployCo）正式宣布日期为 **2026 年 5 月 11 日**。

- OpenAI CFO **Sarah Friar** 在 DeployCo 发布时表态：用独立实体 + 外部资本（TPG 领投~$4B）规模化交付能力，避免拖累 OpenAI 主财报毛利。
- Brad Lightcap（OpenAI COO）多次公开强调：仅提供 API 不够，企业客户需要端到端落地支持。
- 【概括】行业普遍解读：OpenAI 下场做交付 = 「最好的 AI 模型如果没有被正确部署，就只是一个实验室玩具。」

> 来源：[OpenAI 官方](https://openai.com/index/openai-launches-the-openai-deployment-company/) · [Sarah Friar LinkedIn](https://www.linkedin.com/posts/sarah-friar_openai-launches-the-openai-deployment-company-activity-7459596024773480448-jAgs) · [HPCwire](https://www.hpcwire.com/aiwire/2026/05/11/openai-launches-deployment-company-to-scale-enterprise-ai-adoption/)

### Dario Amodei / Anthropic

> ⚠️ **日期更正**：早期版本称「与高盛合作」。经核实，Anthropic 与 **Blackstone + Hellman & Friedman + Goldman Sachs** 合作成立企业级 AI 服务公司，宣布日期为 **2026 年 5 月 4 日**（比 OpenAI 早一周），媒体报~$1.5B。

- Anthropic 官方表述：用 "Applied AI engineers from Anthropic" 与公司内部技术人员协作构建定制 Claude 系统（**官方未用 "forward deployed" 措辞**，但实质相同）。
- 【概括】核心理念：AI 的安全部署和 AI 本身一样重要，需要专业团队在客户现场落地。

> 来源：[Anthropic 官方](https://www.anthropic.com/news/enterprise-ai-services-company) · [Goldman Sachs 新闻稿](https://am.gs.com/en-us/advisors/news/press-release/2026/anthropic-partners-with-blackstone-hf-and-goldman-sachs-ai-services) · [CNBC](https://www.cnbc.com/2026/05/04/anthropic-goldman-blackstone-ai-venture.html)

### Palmer Luckey（Anduril 创始人）

> "We don't sell software. We deploy capabilities."

- Anduril 沿用 Palantir 的国防 FDE 模式（创始人出身背景相关），大量使用 FDE 部署边境监控、反无人机等系统。
- 国防领域的 FDE 哲学：交付的是**能力**，不是产品。

### Cognition（Devin 出品方）

- Cognition 设 **"Deployed Engineer"** 岗位（其版 FDE），直接与客户工程师协作，把 Devin/Windsurf 部署进真实生产环境。
- **Goldman Sachs 将 Devin 作为首个 AI 员工接入工作流** —— [IBM Think 报道](https://www.ibm.com/think/news/goldman-sachs-first-ai-employee-devin)
- 【趋势概括】FDE 的角色正从「执行者」变「指挥者」：编排 AI Agent、设计评估体系、处理复杂问题。

> 来源：[Cognition 招聘页](https://jobs.ashbyhq.com/cognition/d72d584c-bb11-4b6a-b043-d81425ea884a)

---

## 二、硅谷 VC / 投资人观点

| 机构 / 个人 | 核心观点 | 来源 |
|---|---|---|
| **a16z** | 「**Services-Led Growth**」：企业 AI 公司主动牺牲短期毛利换取高切换成本，FDE 正是这种打法的核心载体 | [a16z.com/services-led-growth](https://a16z.com/services-led-growth/) |
| **TPG** | 领投 OpenAI DeployCo ~$4B，押注「模型公司亲自做交付」 | [OpenAI 官方](https://openai.com/index/openai-launches-the-openai-deployment-company/) |
| **Blackstone + H&F** | 与 Anthropic+Goldman 合资~$1.5B，PE+投行+模型公司三方合体 | [CNBC](https://www.cnbc.com/2026/05/04/anthropic-goldman-blackstone-ai-venture.html) |
| **Sequoia / Benchmark** 等 | 【行业概括】「最好的 AI 公司早期必须重服务，后期才能轻量化」 | 行业共识 |

---

## 三、Pragmatic Engineer / 行业分析

> Gergely Orosz（Pragmatic Engineer）将 FDE 定义为 **软件工程 + 售前工程 + 平台工程** 的混合体，并系统分析了为什么 2025-2026 年 FDE 需求爆发。

- 本质原因：**LLM 强但不「开箱即用」**——需要提示工程、微调、上下文管理、安全护栏、领域工具的「包装」，FDE 就是现场做包装的人。
- AI 产品缺乏通用产品形态：每个企业的数据管道、工作流、集成差异巨大，需重度定制。

> 来源：[Pragmatic Engineer: Forward Deployed Engineers](https://newsletter.pragmaticengineer.com/p/forward-deployed-engineers) · [HN 讨论](https://news.ycombinator.com/item?id=48900432)

---

## 四、少数派 / 争议观点

| 观点 | 提出者 | 来源 |
|---|---|---|
| 「FDE 是该被淘汰的东西」 | Bart Butler（Proton CTO） | [Instagram Reel](https://www.instagram.com/reel/DbBamONCH_V/)（**争议性少数派观点**） |
| 反驳：Agent 不会消灭 FDE，而是让 FDE 从「手艺人」变「工头」 | 行业主流共识 | 见 [AI Agent FDE](22-FDE/14_前沿趋势/02_AI_Agent_FDE.md) |

---

## 五、核心共识（已验证）

1. **FDE 不是可选，是必须**：AI 产品化的必经之路——模型公司（OpenAI/Anthropic）已亲自下场印证
2. **先重后轻**：早期必须重服务（Services-Led Growth），后期才能平台化、轻量化
3. **人比平台重要**：Yahoo Finance 援引研究称全美仅 **~2,000 名工程师**具备「能交付有意义 AI ROI」的能力 —— [来源](https://finance.yahoo.com/technology/ai/articles/forward-deployed-engineers-ai-industry-150000774.html)
4. **2026 是关键年**：OpenAI（5.11）与 Anthropic（5.4）一周内相继下场，FDE 从少数公司走向行业主流
5. **数据要诚实**：岗位增长是「7 倍（643→5330）」而非「10 倍/6000%」，Business Insider 已发更正

---

> **关联阅读**：[DeployCo 案例](22-FDE/06_案例研究/03_DeployCo案例.md) · [Palantir 案例详解](22-FDE/06_案例研究/01_Palantir案例详解.md) · [AI Agent FDE](22-FDE/14_前沿趋势/02_AI_Agent_FDE.md)
