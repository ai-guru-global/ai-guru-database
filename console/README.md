# AI GURU 工作台（ai-guru-console）

中文 · [English](README.en.md)

**打开目录，就是在读 AI 行业。**

本仓库的根目录就是行业本身：`01`–`05` 五个目录对应产业链五层，逐层点下去就是逐层下钻——从「算力与硬件」一路读到「商业与生态」，每个节点目录一份学习页，每个叶子一个厂家或专题。读目录的顺序就是价值流的方向：算力 → 模型 → 平台 → 应用 → 商业。

## 从目录开始（目录即行业）

```
01-算力与硬件层/          L1 芯片、集群、能源与网络——算力的物理底座
02-数据与模型层/          L2 语料、前沿与开源模型、训练与推理——智能的供给
03-平台与工具层/          L3 框架、API、编码、协议——谁离开发者最近
04-行业应用层/            L4 消费助手、垂直行业、创作与具身——智能变收入
05-商业与生态层/          L5 商业模式、资本、监管与联盟——谁活下来谁定规则
```

- **层目录 `_index.md`**：本层全部节点的一览（一句话定义 + 叶子数），按价值流排序。
- **节点目录 `NN-节点名/_index.md`**：这一格的学习页——拆解卡（价值来源/护城河/瓶颈/领先指标）、六层速览（从「打个比方」到「边界与走向」）、二级细分、关键判断与上下游链接。
- **叶子 `<名称>.md`**：该节点下的厂家与专题学习页（是什么 → 怎么看 → 关键锚点 → 下钻）。
- **深潜子库**（如 [`01-算力与硬件层/09-网络与光互连/高网设计/`](01-算力与硬件层/09-网络与光互连/高网设计/README.md)）：个别节点下挂整库的系统知识（知识点/厂家/角度三维），开库规范见 [`docs/知识库模板.md`](docs/知识库模板.md)。

## 目录的三层分工

| 层 | 在哪 | 回答什么 |
|---|---|---|
| 节点学习页 | `0N-层/NN-节点/_index.md` | 这个环节是什么、格局如何、怎么看 |
| 深潜子库 | `0N-层/NN-节点/<领域>/` | 这个环节如何工作（系统知识） |
| 证据层 | `证据层/<主题>/<线索>.md` | 这个环节**发生过什么**（带出处的时间线） |

证据层与年度大事记遵循**宁可漏收，不可错收**：官方一手源 + ≥2 家主流媒体交叉印证才入库；存疑事件公开登记在 [`docs/2026待核实清单.md`](docs/2026待核实清单.md)（带账龄 SLA）；事实与观点严格分离。

## 拆解台（同一结构的交互视图）

[`console/`](console/) 是目录树的交互版：纯静态单页，双击 `console/index.html` 即用（file:// 直开）。产业链全景（`#/chain/map`）顶部另有行业通行的技术栈视图（应用 → 模型 → 基础设施 → 芯片 → 能源，底三层合称「AI 工厂」），节点页运行时聚合全库证据；证据密度全景（`#/chain/density`）与覆盖度仪表（`#/topics/coverage`）把采集缺口显式暴露。

## 机器可读数据集（Open Industry Graph）

`data/` 是同一套内容的机器可读出口，供 Agent、RAG、看板与研究工具直接消费：

- [`data/chain.json`](data/chain.json)：5 层产业链、71 节点、213 个二级细分与技术栈视图；
- [`data/clues.json`](data/clues.json) / [`data/chronicle.json`](data/chronicle.json)：95 条线索、169 条大事；
- [`data/verify.json`](data/verify.json)：154 条六态待核实台账；
- [`data/explain.json`](data/explain.json) / [`data/deep.json`](data/deep.json)：节点解释与深度拆解；
- [`data/index.json`](data/index.json)：版本、asOf、计数与许可证。

每个实体带稳定 ID（如 `ai-guru:chain/L1/gpu`），引用格式见 [`CITATION.md`](CITATION.md)，数据字典见 [`data/README.md`](data/README.md)。重新生成：`make dataset`。

给 Agent 用：仓库自带零依赖 MCP server（`tools/mcp/aiguru_mcp.py`），配置见 [`tools/mcp/README.md`](tools/mcp/README.md)。给 JS/TS 用：npm 包 `ai-industry-graph`（[`packages/ai-industry-graph`](packages/ai-industry-graph)）。

## 目录结构

```
ai-guru-console/
├── 01-算力与硬件层/ … 05-商业与生态层/   # 行业主入口：五层产业链目录树（目录即行业）
│   └── NN-节点名/
│       ├── _index.md      # 节点学习页（make tree 从 chain/explain/deep 生成，勿手改）
│       ├── <叶子>.md      # 厂家/专题学习页（生成一次后手工维护）
│       └── <深潜子库>/    # 个别节点的整库系统知识（如 高网设计/）
├── 证据层/                # 18 个横向主题域的线索时间线（证据原子）
│   └── <主题>/
│       ├── _index.md      # 主题说明 + 线索列表 + 候选线索
│       └── <线索>.md      # 一条持续追加的时间线文档
├── console/               # 拆解台（目录树的交互视图，file:// 直开）
├── data/ + schema/        # 机器可读数据集与 JSON Schema
├── site/                  # 可抓取静态站（构建产物，不入库）
├── _topics.md             # 18 主题索引（横向切面）
├── _2026大事记.md         # 年度重点事件索引（按月归档）
├── docs/                  # 线索模板 + 知识库模板 + 深潜库模板 + 待核实清单 + 治理文档
├── tools/                 # Go CLI/Web/扩展 + 构建脚本（build_tree/console/dataset/pages…）
└── README.md
```

## 目录树如何生成与维护

- 骨架真相在 [`console/chain.js`](console/chain.js)（五层 71 节点，手工策展）；解释与深度判断在 `console/explain-l*.js` / `console/deep-l*.js`。
- `make tree`（`tools/scripts/build_tree.py`）把这些源 + 证据层线索合成目录树：**节点/层 `_index.md` 每次重新生成（装配产物，勿手改）；叶子学习页只在不存在时生成，落地后即手工维护**。
- 改了 chain.js / explain / deep 或新增证据线索后，重跑 `make tree` 让结构同步；`--force` 可强制重写全部叶子（慎用，会覆盖手工内容）。

## 证据层如何维护

1. 找到事件所属的线索文件（如 `证据层/智能体平台/MCP协议.md`）。若无线索，从 [`docs/线索模板.md`](docs/线索模板.md) 复制到 `证据层/<主题>/` 新建。
2. 在「时间线」顶部最近的 `### YYYY-MM` 下插入一条：

   ```
   - **2026-07-21** · [标题](URL)
     一句话摘要。关键数据/影响。
   ```

3. 跨月则新建月份标题；更新 frontmatter 的 `更新:` 日期。
4. 属于年度重点事件的，同步登记 [`_2026大事记.md`](_2026大事记.md)；并重跑 `make tree`（新线索会作为叶子挂到最佳节点）。

详见 [`CONTRIBUTING.md`](CONTRIBUTING.md)。

## 证据层最近动态

<!-- RECENT:START -->
- **2026-10-02** · [OpenAI GPT-6 Astra Ultrafast 在 NVIDIA Blackwell GPU 上运行](https://aihot.news/items/rp0ocer4fughonyd9ddfr3r8i) — 通过 OpenAI API 与符合条件的 ChatGPT Work / Codex 用户开放；官方称 Ultrafast 模式 token 生成速度最高可达 Astra 标准模式的 8 倍。OpenAI 推理负责人 Philippe Tillet 与计算 CTO Uday Ruddarraju 联合署名，NVIDIA / OpenAI 双侧官方页同日发布。
- **2026-10-01** · [Claude Code 推出 mods，可用 TypeScript 函数改写提示词、替换内置功能](https://aihot.news/items/qzfc4nrsqe4rk8yxlk16ox6in) — Anthropic 将 Claude Code 的可编程面正式开放：用户可用 TypeScript 自定义 Token Weather 等插件；与「Anthropic: Claude.dev 开发者博客 9-30 入门教程」同日上线，把 Claude Code 从「终端 IDE」升级为「可注入扩展的运行时」。
- **2026-10-01** · [Modal 正式发布 VM Sandboxes：给 Agent 一台完整的 Linux 虚拟机](https://aihot.news/items/rdjmj3nqrje120k46r63xrth4) — 同步发布 Modal Clusters（多节点 GPU 集群）与 Sidecars（Sandboxes 低延迟信任边界），Agent 推理基础设施从「容器化」过渡到「整机 + 集群」形态；与 Kimi K2.6 编码 Agent 服务（9-23）等案例互证，AI Infra 主流路线回到「以整机为单位的 Agent VM」。
- **2026-09-30** · [Google DeepMind 发布 Gemini 4 Argon，面向可信网络防御者先行开放](https://aihot.news/items/uob3jvsb97uh5achwaggjrhqh) — 继 Gemini 3.8 Flash 不到一个月再度旗舰点版本迭代；Artificial Analysis 智能指数追平 GPT-6 Astra，折扣价下每任务成本仅 Astra 的 60%，Google 重回智能水平前三。Gemini 4 Argon (High) 上线 Arena Agent Arena 第 8（净提升 +7.92%）。
- **2026-09-30** · [NVIDIA 董事会批准增加 1500 亿美元股票回购授权](https://aihot.news/items/r1djnvgg1hj9iqj6itgwjucbp) — 剩余回购总额达 2350 亿美元；与同期「Anthropic 与 SpaceX 最高 845 亿美元算力协议」（✅ Anthropic filing 披露，The Information/Yahoo 索引级印证，见待核实清单九·新加 2）「OpenAI 据报洽谈以约 1.4 万亿美元估值融资至少 300 亿美元」（✅ Bloomberg 2026-09-29 首发 + Reuters 跟进，索引级印证，估值口径为不含本轮募资额，见待核实清单九·新加 6）一同折射 2026-09 末「前沿算力 + 现金循环」的资本侧转折。
- **2026-09-30** · [ElevenLabs 完成 3 亿美元员工股份回购，估值升至 220 亿美元](https://aihot.news/items/fkaymng16iu4hg5x53jpq7o8p) — 同步发布 Eleven v4 与低延迟 Turbo 版（语音生成最富表现力档位）；上一次估值为 2025 年的 30 亿，17 个月内涨约 7 倍，语音 AI 估值锚由 ElevenLabs 与 Suno 两端共同托起。
- **2026-09-29** · [OpenAI DevDay 2026 发布 GPT-6.1 Sol 与常驻智能体 Dots 等 20 余项更新](https://aihot.news/items/phuhohutcf75ktuyyfdzwug8z) — 发布 7 天后接替 GPT-6 Sol、智能指数距 GPT-6 Astra 仅 1 分，API 价格约 Astra 五分之一；同步上线常驻智能体 dots、Agents API 公测、全双工语音模型 GPT-Live-1 与 ChatGPT Work 的 Data agent。
<!-- RECENT:END -->

## 如何订阅

RSS：`https://ai-guru-global.github.io/ai-guru-console/feed.xml`（每周自动更新）。订阅源是证据层更新的通报，不是产品本体——阅读行业请从根目录的五层目录开始。

## 如何新增一个主题域

见 [`_topics.md`](_topics.md) 的「如何新增主题」（主题文件夹在 `证据层/` 下）。新增主题只扩横向切面；若出现新的产业环节，应优先在 [`console/chain.js`](console/chain.js) 的对应层加节点（记得同步 `console/i18n-en.js`、`explain-l*.js`、`deep-l*.js` 五件套，见 `HANDOFF.MD`）。

## 许可

- **代码**（`console/`、`tools/` 等）：[MIT](LICENSE)
- **内容**（目录树、证据层、年度大事记、docs 文档）：[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.zh) —— 转载请署名「AI GURU 工作台（ai-guru-console，原 AI News Database）」并以相同方式共享。

## 工具

所有辅助工具统一在 [`tools/`](tools/) 目录下管理：

- `tools/scripts/build_tree.py`：生成五层目录树（`make tree`）
- `tools/scripts/build_console.py`：重建拆解台内嵌数据（`make console`）
- `tools/scripts/build_dataset.py` / `build_pages.py` / `check_links.py`：数据集、静态站与链接检查
- `tools/cmd/`：Go CLI（本地阅读、筛选、导出）、Web 界面与浏览器剪藏扩展
