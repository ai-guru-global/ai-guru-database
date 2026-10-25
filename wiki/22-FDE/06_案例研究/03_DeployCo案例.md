# DeployCo 案例：模型公司亲自下场做交付

> **最后更新**：2026-08-03
> **核心命题**：2026 年 5 月，OpenAI 与 Anthropic 在一周内相继宣布成立企业级 AI 交付实体，标志着「模型公司只卖 API」的时代结束。本文件梳理这两个标志性案例及其对 FDE 行业的含义。

---

## 一、OpenAI Deployment Company（DeployCo）

### 1.1 基本信息

| 维度 | 内容 |
|---|---|
| **宣布日期** | **2026 年 5 月 11 日** |
| **主导投资方** | TPG（领投） |
| **初始投资** | 约 **$4B** |
| **参与方** | Brookfield (BN) 等，共 19 家投资方 |
| **架构性质** | 独立实体（非 OpenAI 内部部门） |
| **来源** | [OpenAI 官方](https://openai.com/index/openai-launches-the-openai-deployment-company/) · [HPCwire](https://www.hpcwire.com/aiwire/2026/05/11/openai-launches-deployment-company-to-scale-enterprise-ai-adoption/) |

### 1.2 创始收购（founding acquisition）：Tomoro

DeployCo 通过收购伦敦/爱丁堡的应用 AI 咨询公司 **Tomoro** 完成冷启动，带入约 **150 名 Forward Deployed Engineers 与 Deployment Specialists**。

> 来源：[Tomoro 公告](https://tomoro.ai/insights/tomoro-acquired-by-openai-deployment-company) · [Aventis Advisors（含日期/估值）](https://aventis-advisors.com/ai-services-ma-2026/)

### 1.3 与 OpenAI Applied Engineering 的关系

OpenAI 既有的 **Applied Engineering 团队**负责把 GPT/o 系列嵌入头部企业客户；**DeployCo 是其面向中端市场的规模化延伸**——用独立实体 + 外部资本（TPG 的 $4B）加速交付能力建设，避免拖累 OpenAI 主财报的毛利。

### 1.4 为什么 OpenAI 要做这件事

```
OpenAI 的困境：
├── API 很强，但客户不知道怎么用
├── 企业客户需要私有化/定制化
├── 售前只能做 demo，不能真交付
└── 不帮客户落地 = 客户流失到竞对（Anthropic、开源模型）

解决方案：用独立实体 + 外部资本规模化 FDE 能力
```

---

## 二、Anthropic + Blackstone + H&F + Goldman Sachs

### 2.1 基本信息

| 维度 | 内容 |
|---|---|
| **宣布日期** | **2026 年 5 月 4 日**（比 OpenAI 早一周） |
| **合作方** | Anthropic + **Blackstone** + **Hellman & Friedman** + **Goldman Sachs** |
| **追加投资方** | General Atlantic、Leonard Green、Apollo、GIC、Sequoia |
| **规模** | 媒体报道约 **$1.5B**（官方未披露金额） |
| **目标** | 把 Claude 嵌入被投组合公司及中型企业 |
| **人员模式** | 用 "Applied AI engineers from Anthropic"（官方未用"forward deployed"措辞），与公司内部技术人员协作 |
| **来源** | [Anthropic 官方](https://www.anthropic.com/news/enterprise-ai-services-company) · [Goldman Sachs 新闻稿](https://am.gs.com/en-us/advisors/news/press-release/2026/anthropic-partners-with-blackstone-hf-and-goldman-sachs-ai-services) · [CNBC](https://www.cnbc.com/2026/05/04/anthropic-goldman-blackstone-ai-venture.html) |

### 2.2 这个模式的独特之处

这不是普通的「模型公司 + 咨询伙伴」合作，而是 **PE + 投行 + 模型公司三方合体**：

- **Blackstone / H&F（PE）**：提供资金 + 被投企业客户群
- **Goldman Sachs（投行）**：提供资金 + 金融行业渠道
- **Anthropic（模型公司）**：提供 Claude 模型 + Applied AI 工程师

> 这种结构让 Anthropic 能在不稀释自身股权、不拖累毛利的前提下，借助 PE/投行的资本和客户网络快速规模化交付能力。

---

## 三、为什么 2026 年模型公司集体下场

### 3.1 本质原因：AI 产品化的鸿沟

```
模型能力（强） ──── 巨大鸿沟 ──── 客户价值（需要落地）
                    ↑
                  FDE 在这里
```

1. **模型强但不等于产品好**：GPT-4/Claude 很强大，但客户不知道怎么用
2. **没有通用产品形态**：每个企业的数据管道、工作流、集成差异巨大，需重度定制 —— [HN 讨论](https://news.ycombinator.com/item?id=48900432)
3. **「Services-Led Growth」护城河**：a16z 论述企业 AI 公司用牺牲毛利换切换成本 —— [a16z](https://a16z.com/services-led-growth/)

### 3.2 角色定义的演进

FDE 在 AI 时代被重新定义为 **软件工程 + 售前工程 + 平台工程** 的混合体。

> 来源：[Pragmatic Engineer: Forward Deployed Engineers](https://newsletter.pragmaticengineer.com/p/forward-deployed-engineers)

---

## 四、其他采用 FDE 原生打法的公司（已核实）

| 公司 | FDE 岗位 | 来源 |
|---|---|---|
| **Scale AI** | Forward Deployed Engineer, GenAI（$179K–$224K） | [招聘页](https://scale.com/careers/4593571005) |
| **Glean** | Founding FDE | [招聘页](https://job-boards.greenhouse.io/gleanwork/jobs/4651991005) |
| **Cresta** | FDE（AI 客服 Agent） | [招聘页](https://remote.com/jobs/cresta-c1c31juj/forward-deployed-engineer-ai-agent-j1u0lrvn) |
| **Cognition** | Deployed Engineer（部署 Devin/Windsurf） | [招聘页](https://jobs.ashbyhq.com/cognition/d72d584c-bb11-4b6a-b043-d81425ea884a) |
| **Anduril** | 国防 FDE（继承 Palantir 模式） | 官网 |

> 业内有人梳理了 **26 家「以 FDE 为原生打法」的公司** —— [LinkedIn 综述](https://www.linkedin.com/posts/activity-7455292460932673536-IuiL)

---

## 五、对中国 FDE 行业的启示

### 5.1 威胁

1. **大厂会跟进**：OpenAI/Anthropic 下场后，国内大厂（字节、阿里、华为）组建规模化 FDE 团队只是时间问题
2. **资本优势**：$4B / $1.5B 的资金体量，创业公司难以正面竞争

### 5.2 机会

1. **市场被教育**：模型公司下场 = 需求被激活，客户开始理解 FDE 价值
2. **本地化壁垒**：信创/私有化/政企关系是海外巨头难以跨越的护城河
3. **差异化空间**：深耕特定行业（政企/金融/能源）的垂直 FDE 仍有窗口

### 5.3 行动建议

| 维度 | 建议 |
|---|---|
| **定位** | 不要和大厂比通用能力，做「政企私有化 AI FDE 第一品牌」 |
| **节奏** | 2026-2027 是跑马圈地窗口，2028 格局初定 |
| **合作** | 可与四大/本土咨询合作扩大覆盖面，而非自建全部能力 |
| **定价** | 按行业/规模分级，高举高打聚焦高价值客户 |

---

> **关联阅读**：[OpenAI FDE 实践](22-FDE/06_案例研究/02_OpenAI_FDE实践.md) · [Palantir 案例详解](22-FDE/06_案例研究/01_Palantir案例详解.md) · [中国 FDE 市场](../09_市场分析/01_中国FDE市场.md)
