# 设计：仓库重构为 AI 新闻内容库

- **日期**：2026-07-21
- **状态**：已批准（待 spec review）
- **作者**：Allen Galler（经 brainstorming 对话确认）

## 1. 背景与动机

仓库 `ai-news-database` 当前是一个名为 `ai-news-database` 的 Go CLI 工具：抓取全球技术源 → 存入本地 SQLite（本机现有 179 篇文章）→ 提供 TUI 阅读、RAG 问答、策展、深度研究等命令。代码、构建产物、大量项目文档都堆在仓库根目录。

希望把仓库**转型为「AI 行业新闻内容库」**：持续沉淀每一条线索（story line）的相关新闻，最终能从时间线看到深度分析。为此：

- **根目录的主角变成「按主题组织的中文 md 内容库」**，git 跟踪、人可读、可长期沉淀。
- **Go 抓取/辅助工具降级为配角**，作为自包含 module 收敛到 `tools/cmd/`，不再是核心交互入口。

仓库的重心从「一个工具」转向「一个持续增长的内容资产」。

## 2. 已确认的关键决策

| 决策点 | 选择 |
|---|---|
| CLI 与内容库的关系 | **内容库独立，CLI 弱化** |
| 一级分类 | **完整 AI 全景分类**（13 个主题，见 §4） |
| 二层结构 | **主题 / 线索·时间线文件**（一个线索 = 一个时间线 md） |
| 命名 | **中文简称为主，专有名词保留英文** |
| 代码搬迁范围 | **全部代码收敛到 `tools/cmd/`** |
| Go module 方式 | **方案 A：module 随代码移动到 `tools/cmd/go.mod`**（`module ai-news-database` 名字不变，21 处 import 零改动） |
| 主题数量 | **13 个一次性全建** |
| 线索文件特性 | **保留 frontmatter、时间线倒序、启用 `[[ ]]` 双链、概述与分析分离** |
| 旧文档处理 | **全移到 `docs/` 归档** |

## 3. 目标目录结构

```
ai-news-database/
├── 智能体平台/              # 主题文件夹（中文简称）
│   ├── _index.md            # 主题说明 + 该主题下线索列表
│   └── <线索>.md            # 线索·时间线文件
├── Agentic编码/             # 专有名词保留英文
├── 多模态大模型/
├── 行业应用/
├── 具身智能/
├── 世界模型/
├── … (其余 7 个主题)
├── _topics.md               # 中心分类索引（主题/简称/英文/定义）
├── tools/
│   └── cmd/                 # 独立 Go module（module ai-news-database）
│       ├── go.mod go.sum main.go
│       ├── cmd/ internal/ web/ browser-extension/
│       ├── Makefile install.sh
│       └── skills/ skills-lock.json
├── docs/                    # 项目文档归档 + 线索模板
│   ├── superpowers/specs/
│   ├── 线索模板.md
│   └── (README/BUSINESS/PROMOTION/EVALUATION_REPORT/AUDIT_REPORT/EXAMPLES/CHANGELOG 归档于此)
├── README.md                # 仓库新入口（内容库用法 + 指向 tools/cmd）
├── CONTRIBUTING.md          # 含「向内容库添加线索/新闻」规范
├── LICENSE CODE_OF_CONDUCT.md SECURITY.md
├── .github/ .gitignore
└── (IDE 配置目录：.agents/ .claude/ 等保留)
```

### 根目录「留什么 / 不留什么」

| 留在根目录 | 去向 |
|---|---|
| 13 个主题文件夹（新建） | 根目录 |
| `_topics.md`（新建） | 根目录 |
| `tools/`（新建，仅含 `cmd/`） | 根目录 |
| `docs/`（新建/扩展） | 根目录 |
| 新 `README.md` | 根目录（旧 README 进 `docs/`） |
| `CONTRIBUTING.md`（更新）/ `LICENSE` / `CODE_OF_CONDUCT.md` / `SECURITY.md` | 根目录 |
| `.github/` `.gitignore` | 根目录 |
| IDE 配置目录（`.agents/` `.claude/` `.codebuddy/` `.qoder/` `.qwen/` `.trae/` `.windsurf/`） | 根目录 |
| `local/`（运行时产物） | 根目录，保持 gitignore |
| 旧 `main.go` `cmd/` `internal/` `web/` `browser-extension/` `skills/` `skills-lock.json` | → `tools/cmd/` |
| `go.mod` `go.sum` `Makefile` `install.sh` `.golangci.yml` `.pre-commit-config.yaml` `.editorconfig` | → `tools/cmd/` |
| `ai-news-database`（18MB 二进制产物） | 删除，加入 `.gitignore` |
| `BUSINESS.md` `PROMOTION.md` `EVALUATION_REPORT.md` `AUDIT_REPORT.md` `EXAMPLES.md` `CHANGELOG.md` | → `docs/` |
| 旧 `README.md` | → `docs/legacy-readme.md` |

## 4. 主题分类（13 个）

| # | 文件夹名 | 覆盖范围 | 英文对照 |
|---|---|---|---|
| 1 | `基础模型` | 基础大模型能力本身：GPT/Claude/Gemini/Llama 等前沿模型与权重 | Foundation Models |
| 2 | `智能体平台` | Agent 框架、编排、工具调用、多智能体系统 | Agent Platforms |
| 3 | `Agentic编码` | Agentic Coding、代码 Agent、AI IDE/Copilot | Agentic Coding |
| 4 | `多模态大模型` | 视觉/音频/视频/统一多模态模型 | Multimodal Models |
| 5 | `推理与基础设施` | 推理优化、推理引擎、芯片、算力、数据中心 | Inference & Infra |
| 6 | `开源模型与生态` | 开源权重、开源框架、社区生态（HuggingFace 等） | Open Source & Ecosystem |
| 7 | `训练与数据` | 训练方法、对齐、数据集、合成数据 | Training & Data |
| 8 | `评测与基准` | Benchmark、能力评测、评测方法 | Evaluation & Benchmarks |
| 9 | `具身智能` | 具身 AI、机器人、感知与控制 | Embodied AI |
| 10 | `世界模型` | 世界模型、物理仿真、视频生成模型作世界模型 | World Models |
| 11 | `行业应用` | 医疗/金融/法律/教育/科研等垂直落地 | Industry Applications |
| 12 | `AI安全与对齐` | 安全、对齐、红队、监管政策 | AI Safety & Alignment |
| 13 | `开发者工具` | 面向开发者的 AI 工具链、SDK、平台 | Dev Tools |

命名规则：**中文简称为主，专有名词（如 Agentic、Claude、Sora、GPT）保留英文原名**，减少转译损失、贴近现实语言习惯。

`_topics.md` 集中维护此表，后续增删主题只改这一个文件 + 建对应文件夹。

## 5. 线索·时间线文件格式

### 5.1 文件位置

`<主题文件夹>/<线索名>.md`，例如 `智能体平台/Claude代码助手.md`、`多模态大模型/Sora.md`。
一个线索 = 一个持续追加的时间线文档。

### 5.2 文件模板

```markdown
---
线索: Claude代码助手
主题: 智能体平台
别名: [Claude Code, Anthropic 编码助手]
状态: 活跃          # 活跃 | 已完结 | 观察中
创建: 2025-03-01
更新: 2026-07-21
关键角色: [Anthropic]
---

# Claude 代码助手

> 一句话定位：Anthropic 推出的 agentic 命令行编码助手。

## 概述

（1-3 段整体描述，随信息积累逐步丰满：是什么、为什么重要、当前格局。
这是「事实」沉淀的地方。）

## 时间线

### 2026-07

- **2026-07-15** · [Claude Code 发布 X 功能](URL)
  一句话摘要。关键数据/影响。
  > 原文要点或关键引述（可选）。

- **2026-07-02** · [标题](URL)
  摘要。

### 2026-06

- **2026-06-20** · [标题](URL)
  摘要。

## 分析

（可选。线索积累足够后的阶段性深度分析：趋势判断、竞争格局、技术演进脉络。
这是「观点」沉淀的地方，与「概述」中的事实分开。）

## 关联线索

- [[Agentic编码/ClaudeCode]]
- [[基础模型/Claude]]
```

### 5.3 设计要点

1. **YAML frontmatter**：线索元数据（主题、别名、状态、更新时间）。机器可读，便于后续脚本统计/生成索引。
2. **时间线按「年-月」倒序**（最新在上），月内按日期倒序。追加只需在最近月份插入；跨月则新建月份标题。
3. **每条新闻统一格式**：`日期 · [标题](URL)` + 缩进摘要 + 可选原文引述。轻量、可扫读。
4. **概述（事实）与分析（观点）分离**，避免混淆。
5. **`[[主题/线索]]` 双链**：类 Obsidian wikilink 风格表达线索间关联，纯文本可读，未来可被工具解析。

### 5.4 追加一条新闻的流程

1. 打开对应线索文件（不存在则用 `docs/线索模板.md` 新建）。
2. 在「时间线」顶部最近的「年-月」下插入一条；跨月则新建月份标题。
3. 更新 frontmatter 的 `更新:` 日期。
4. （可选）补充「概述」或「分析」。

### 5.5 主题 `_index.md` 模板

```markdown
---
主题: 智能体平台
英文: Agent Platforms
定义: Agent 框架、编排、工具调用、多智能体系统。
---

# 智能体平台

> Agent 框架、编排、工具调用、多智能体系统。

## 线索列表

- [Claude代码助手](Claude代码助手.md) — 活跃
- [AutoGPT](AutoGPT.md) — 观察中
```

## 6. 代码搬迁到 `tools/cmd/`

### 6.1 搬迁映射

| 源（仓库根） | 目标 |
|---|---|
| `main.go` | `tools/cmd/main.go` |
| `cmd/*.go` | `tools/cmd/cmd/*.go` |
| `internal/*` | `tools/cmd/internal/*` |
| `web/` | `tools/cmd/web/` |
| `browser-extension/` | `tools/cmd/browser-extension/` |
| `skills/` `skills-lock.json` | `tools/cmd/skills/` `tools/cmd/skills-lock.json` |
| `go.mod` `go.sum` | `tools/cmd/go.mod` `tools/cmd/go.sum` |
| `Makefile` `install.sh` | `tools/cmd/Makefile` `tools/cmd/install.sh` |
| `.golangci.yml` `.pre-commit-config.yaml` `.editorconfig` | `tools/cmd/` 下 |

### 6.2 关键技术点

1. **module 名不变**：`tools/cmd/go.mod` 仍是 `module ai-news-database`。经核实全仓 59 个 `.go` 文件、21 处唯一 `"ai-news-database/..."` import，**零改动**（路径相对 module 根）。`main.go` 的 `import "ai-news-database/cmd"` 也不变。
2. **验证**：`cd tools/cmd && go build ./... && go test ./...` 应与搬迁前一致全绿（现有 24 个 `_test.go`）。
3. **根目录构建转发**：新增根目录 `Makefile`（轻量，仅转发）或脚本，方便习惯在根目录 build 的用户。具体形式：根 `Makefile` target `build`/`test` 调用 `$(MAKE) -C tools/cmd $@`。

### 6.3 需要更新路径的配置文件

- **`.github/workflows/ci.yml`**：所有 job 的 `go build`/`go test`/`gofmt`/`go vet`/`gosec`/`golangci-lint` 需要 `working-directory: tools/cmd`（或在 step 里 `cd tools/cmd`）。采用给整个 workflow 加 `defaults.run.working-directory: tools/cmd` 的方式。
- **`.github/workflows/release.yml`**：`make release` 需指向 `tools/cmd`。
- **`.github/workflows/publish-extension.yml`**：`cd browser-extension` 改为 `cd tools/cmd/browser-extension`。
- **根 `Makefile`**：改为转发到 `tools/cmd`。
- **`tools/cmd/Makefile`**：内部路径基本不变（仍是相对 module 根），但 `docs:` target 里 `ls -1 *.md` 失效（md 不再在 module 根），需调整或删除。
- **`tools/cmd/install.sh`**：检查内部路径引用，按需更新。
- **`CONTRIBUTING.md`**：所有「在根目录运行 go build」类指引改为「在 `tools/cmd/` 下」。

## 7. 执行步骤

### 阶段 1：代码搬迁（不破坏功能）

1. 用 `git mv` 把代码/构建文件移到 `tools/cmd/`（见 §6.1 映射）。
2. 删除 18MB 二进制 `ai-news-database`，更新 `.gitignore`（加 `tools/cmd/ai-news-database` 及 `/ai-news-database`）。
3. 更新路径相关配置（§6.3）：`.github/workflows/*.yml`、根 `Makefile`（改转发）、`tools/cmd/Makefile` 的 `docs:` target、`install.sh`、`CONTRIBUTING.md`。
4. 验证：`cd tools/cmd && go build ./... && go test ./...` 全绿。

### 阶段 2：内容库骨架

5. 建 13 个主题文件夹，每个放 `_index.md`（§5.5 模板，线索列表初始为空）。
6. 建根 `_topics.md`（§4 完整分类表 + 简称/英文/定义 + 命名规则）。
7. 把线索文件模板（§5.2）存为 `docs/线索模板.md`，供新建线索时复制。

### 阶段 3：文档归档 + 新入口

8. `git mv` 根目录旧文档到 `docs/`：`BUSINESS.md` `PROMOTION.md` `EVALUATION_REPORT.md` `AUDIT_REPORT.md` `EXAMPLES.md` `CHANGELOG.md`；旧 `README.md` → `docs/legacy-readme.md`。
9. 写新根 `README.md`：介绍这是 AI 新闻内容库、目录结构、如何贡献一条新闻/新建线索、指向 `tools/cmd/` 的抓取工具。
10. 更新 `CONTRIBUTING.md`：增加「如何向内容库添加线索/新闻」规范（§5.4 流程）。

### 阶段 4：收尾

11. 末次验证：`cd tools/cmd && go build ./... && go test ./...` 无回归。
12. git 提交（建议 3 个 commit：代码搬迁 / 内容库骨架 / 文档与入口），**不 push**，等 review。

## 8. 验收标准

- `cd tools/cmd && go build ./...` 成功；`go test ./...` 全绿（与搬迁前一致）。
- 根目录除配置文件外，主体为：13 个主题文件夹 + `tools/` + `docs/` + 新 `README.md` + `_topics.md`。
- 每个主题文件夹有 `_index.md`；根有 `_topics.md`。
- 存在 `docs/线索模板.md`。
- 新 `README.md` 能让陌生人理解这是什么库、怎么用、怎么贡献。
- `.gitignore` 包含二进制产物路径。
- CI workflow 路径正确指向 `tools/cmd`。

## 9. 明确不在本次范围

- **不改 Go 代码的行为/功能**：仅搬迁 + 改路径配置。
- **不自动导出现有 SQLite 的 179 篇文章到内容库**：需要人工分类判断，是后续工作。
- **不实现「脚本自动把抓取的文章写入对应线索文件」**：本次只搭骨架和模板，自动化后续做。
- **不动 `internal/` 里任何业务逻辑**。
- **不做中英双语目录**：只用中文简称 + 专有名词保留英文。
- **不建三层及以上目录**：严格保持二层（主题 / 线索文件）。

## 10. 风险与缓解

| 风险 | 缓解 |
|---|---|
| CI 路径漏改导致流水线红 | §6.3 逐项列出，改后本地用 act 或至少 `cd tools/cmd && go test ./...` 验证 |
| `git mv` 后历史断连 | 全程用 `git mv`（非 cp+rm），保留 rename 历史 |
| 中文路径在 CI/shell 出错 | 文件夹名无空格；shell 操作加引号；CI 在 ubuntu-latest 验证 |
| 一次性改动大、review 困难 | 分 3 个语义化 commit（代码搬迁 / 内容库骨架 / 文档与入口） |
