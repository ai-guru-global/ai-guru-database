# 仓库重构为 AI 新闻内容库 — 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 `ai-news-database` 仓库从「Go CLI 工具」转型为「按主题组织的中文 md 新闻内容库」，Go 代码作为自包含 module 收敛到 `tools/cmd/`。

**Architecture:** 纯文件搬迁 + 配置路径更新 + 内容骨架创建。无新代码逻辑。Go module `ai-news-database` 名字不变移到 `tools/cmd/`，21 处 import 零改动。根目录新增 13 个主题文件夹、`_topics.md`、线索模板；旧文档归档 `docs/`。

**Tech Stack:** Git（全程 `git mv` 保留历史）、Go 1.25（验证搬迁后 build/test）、Markdown（内容库）。

**参考 spec:** `docs/superpowers/specs/2026-07-21-content-restructure-design.md`

---

## 前置事实（已核实）

- 二进制 `ai-news-database`（18MB）**未被 git 跟踪**（已在 .gitignore）→ 用 `rm` 删除，更新 .gitignore 路径。
- `skills/` `skills-lock.json` **未被 git 跟踪**（在 .gitignore）→ 用 `mv`（非 git mv）。
- `.editorconfig` `.golangci.yml` `.pre-commit-config.yaml` `web/` `browser-extension/` `main.go` `cmd/` `internal/` `go.mod` `go.sum` `Makefile` `install.sh` **被 git 跟踪** → 用 `git mv`。
- 全仓 91 个 .go 文件被跟踪，21 处唯一 `"ai-news-database/..."` import，module 名不变则零改动。
- `docs/` 已存在（含 `superpowers/`）。`tools/` 不存在。

## 文件结构总览

搬迁后涉及的文件分布：

```
ai-news-database/
├── 智能体平台/_index.md  ... (13 个主题，每个一个文件夹+_index.md)   [新建]
├── _topics.md                                                          [新建]
├── README.md                                                           [重写]
├── CONTRIBUTING.md                                                     [修改]
├── .gitignore                                                          [修改]
├── Makefile                                                            [重写为转发]
├── tools/cmd/{main.go,cmd/,internal/,web/,browser-extension/,          [git mv]
│   ├── go.mod,go.sum,Makefile,install.sh,                              [git mv]
│   ├── .editorconfig,.golangci.yml,.pre-commit-config.yaml,            [git mv]
│   └── skills/,skills-lock.json}                                       [mv]
├── docs/
│   ├── 线索模板.md                                                      [新建]
│   ├── legacy-readme.md                                                [git mv from README.md]
│   ├── business.md ... (6 个归档文档)                                   [git mv]
│   └── superpowers/{specs,plans}/                                      [已存在]
├── .github/workflows/{ci,release,publish-extension}.yml                [修改路径]
└── (IDE 配置目录、LICENSE、CODE_OF_CONDUCT.md、SECURITY.md、local/ 不动)
```

---

## Task 1: 搬迁 Go 代码到 tools/cmd/（git mv 跟踪文件）

**Files:**
- Move: `main.go` `cmd/` `internal/` `web/` `browser-extension/` `go.mod` `go.sum` `Makefile` `install.sh` `.editorconfig` `.golangci.yml` `.pre-commit-config.yaml` → `tools/cmd/`
- Move (非 git): `skills/` `skills-lock.json` → `tools/cmd/`

- [ ] **Step 1: 创建目标目录**

```bash
mkdir -p tools/cmd
```

- [ ] **Step 2: git mv 被跟踪的代码与配置**

```bash
git mv main.go tools/cmd/main.go
git mv cmd tools/cmd/cmd
git mv internal tools/cmd/internal
git mv web tools/cmd/web
git mv browser-extension tools/cmd/browser-extension
git mv go.mod tools/cmd/go.mod
git mv go.sum tools/cmd/go.sum
git mv Makefile tools/cmd/Makefile
git mv install.sh tools/cmd/install.sh
git mv .editorconfig tools/cmd/.editorconfig
git mv .golangci.yml tools/cmd/.golangci.yml
git mv .pre-commit-config.yaml tools/cmd/.pre-commit-config.yaml
```

- [ ] **Step 3: mv 未被跟踪的 skills（在 .gitignore 中）**

```bash
[ -d skills ] && mv skills tools/cmd/skills
[ -f skills-lock.json ] && mv skills-lock.json tools/cmd/skills-lock.json
```

- [ ] **Step 4: 删除未跟踪的 18MB 二进制**

```bash
rm -f ai-news-database ai-news-database.exe
```

- [ ] **Step 5: 验证 module 名未变、import 零改动**

```bash
head -1 tools/cmd/go.mod
```
Expected: `module ai-news-database`

```bash
grep -c "\"ai-news-database/" tools/cmd/main.go
```
Expected: `1`（`import "ai-news-database/cmd"` 未变）

- [ ] **Step 6: 验证搬迁后可编译可测试**

```bash
cd tools/cmd && go build ./... && go test ./... 2>&1 | tail -20
```
Expected: build 成功，测试全绿（与搬迁前一致；若有预先存在的失败测试，记录但不阻断——它们与搬迁无关）。

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "refactor: 搬迁 Go 代码到 tools/cmd/ 作为自包含 module

module ai-news-database 名字不变，21 处 import 零改动。
cmd/internal/web/browser-extension/skills 等全部移入 tools/cmd/。"
```

---

## Task 2: 更新路径相关配置文件

**Files:**
- Modify: `.github/workflows/ci.yml`
- Modify: `.github/workflows/release.yml`
- Modify: `.github/workflows/publish-extension.yml`
- Modify: `tools/cmd/Makefile`（docs target）
- Modify: `tools/cmd/install.sh`（如有路径引用）
- Create: `Makefile`（根目录，转发用）

- [ ] **Step 1: 给 ci.yml 所有 job 加 working-directory**

读取 `.github/workflows/ci.yml`，在每个 job 的 `steps` 之前（与 `runs-on` 同级）加 `defaults`。但 workflow 级 `defaults.run.working-directory` 对所有 job 生效更简洁。在 `env:` 块后插入：

```yaml
defaults:
  run:
    working-directory: tools/cmd
```

放在 `on:` 块之后、`jobs:` 之前。这样所有 `go build ./...`、`go test ./...`、`gofmt -l .`、`go vet ./...`、`gosec ./...`、`golangci-lint` 都在 `tools/cmd` 下执行。

注意：`gofmt -l .` 会变成检查 `tools/cmd` 下，正确。

- [ ] **Step 2: 验证 ci.yml 语法**

```bash
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/ci.yml'))" && echo "YAML OK"
```
Expected: `YAML OK`

- [ ] **Step 3: 更新 release.yml 的 make release 路径**

读取 `.github/workflows/release.yml`，找到 `run: make release`，改为：

```yaml
        working-directory: tools/cmd
        run: make release
```

（若该 step 已在带 `working-directory` 的 job 里则跳过；视具体结构而定，需先读文件确认。）

- [ ] **Step 4: 更新 publish-extension.yml 的 browser-extension 路径**

读取 `.github/workflows/publish-extension.yml`，找到 `cd browser-extension`，改为 `cd tools/cmd/browser-extension`。

- [ ] **Step 5: 修复 tools/cmd/Makefile 的 docs target**

`tools/cmd/Makefile` 里 `docs:` target 是 `@ls -1 *.md`，搬迁后 module 根不再有这些 md。将该 target 改为指向内容库或删除。改为：

```makefile
## docs: List documentation in docs/
docs:
	@echo "Documentation lives in ../../docs/ and topic folders in repo root."
```

- [ ] **Step 6: 检查 tools/cmd/install.sh 的路径引用**

```bash
grep -nE "cmd/|internal/|main\.go|\./ai-news-database|/usr/local" tools/cmd/install.sh
```
若有引用相对仓库根的路径（如编译 `main.go`），确认现在相对 `tools/cmd` 是否仍正确。`install.sh` 若用 `go install .` 或 `go build -o ai-news-database`，在 `tools/cmd` 下仍正确，无需改。若有 `cp` 到固定路径等，按需调整。记录实际改动。

- [ ] **Step 7: 创建根目录转发 Makefile**

在仓库根创建新 `Makefile`：

```makefile
# Root Makefile — forwards to tools/cmd
# 内容库为本仓库主体；Go 工具在 tools/cmd 下自包含维护。

.PHONY: build run test test-short test-coverage clean install fmt vet lint lint-fix security quality release mod help

# 所有 Go 相关 target 转发到 tools/cmd
build run test test-short test-coverage clean install fmt vet lint lint-fix security quality release mod help:
	@$(MAKE) -C tools/cmd $@
```

- [ ] **Step 8: 验证转发 Makefile 可用**

```bash
make build 2>&1 | tail -5
```
Expected: 显示 Building ai-news-database 并生成 `tools/cmd/ai-news-database`。

- [ ] **Step 9: 清理转发构建产生的二进制（避免误提交）**

```bash
rm -f tools/cmd/ai-news-database tools/cmd/ai-news-database.exe
```

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "build: 更新 CI/Makefile 路径以适配 tools/cmd 结构

- ci.yml 加 workflow 级 working-directory: tools/cmd
- release.yml / publish-extension.yml 路径修正
- 根 Makefile 改为转发到 tools/cmd
- tools/cmd/Makefile docs target 调整"
```

---

## Task 3: 更新 .gitignore（二进制与产物路径）

**Files:**
- Modify: `.gitignore`

- [ ] **Step 1: 更新二进制与产物路径**

读取 `.gitignore`，将顶部的二进制与产物路径从仓库根相对改为兼容 `tools/cmd`。把：

```
# Binary files
ai-news-database
ai-news-database.exe

# Go build cache
*.test
*.out

# Coverage reports
.coverage/
coverage.out
*.coverprofile
```

替换为：

```
# Binary files
/ai-news-database
/ai-news-database.exe
/tools/cmd/ai-news-database
/tools/cmd/ai-news-database.exe

# Go build cache
*.test
*.out

# Coverage reports
.coverage/
/tools/cmd/.coverage/
coverage.out
*.coverprofile
```

（用 `/` 前缀锚定到仓库根，避免误忽略深层同名文件；同时覆盖搬迁后的 `tools/cmd/` 路径。）

- [ ] **Step 2: 验证 .gitignore 不再误忽略 skills**

确认 `.gitignore` 里 `skills/` 和 `skills-lock.json` 这两条，现在指向 `tools/cmd/skills/`。由于原条目是无前缀的 `skills/`（匹配任意层级），搬迁后仍会忽略 `tools/cmd/skills/`，符合预期（skills 本就不提交）。无需改动，仅记录。

- [ ] **Step 3: Commit**

```bash
git add .gitignore
git commit -m "chore: 更新 .gitignore 锚定二进制与产物路径"
```

---

## Task 4: 建 13 个主题文件夹 + _index.md

**Files:**
- Create: `基础模型/_index.md` `智能体平台/_index.md` `Agentic编码/_index.md` `多模态大模型/_index.md` `推理与基础设施/_index.md` `开源模型与生态/_index.md` `训练与数据/_index.md` `评测与基准/_index.md` `具身智能/_index.md` `世界模型/_index.md` `行业应用/_index.md` `AI安全与对齐/_index.md` `开发者工具/_index.md`

- [ ] **Step 1: 创建 13 个主题文件夹**

```bash
mkdir -p 基础模型 智能体平台 Agentic编码 多模态大模型 推理与基础设施 开源模型与生态 训练与数据 评测与基准 具身智能 世界模型 行业应用 AI安全与对齐 开发者工具
```

- [ ] **Step 2: 为每个主题写 _index.md**

每个 `_index.md` 用统一模板（字段从 spec §4 表格取值）。以 `智能体平台/_index.md` 为例：

```markdown
---
主题: 智能体平台
英文: Agent Platforms
定义: Agent 框架、编排、工具调用、多智能体系统。
---

# 智能体平台

> Agent 框架、编排、工具调用、多智能体系统。

## 线索列表

<!-- 新建线索后在此追加：- [线索名](线索名.md) — 状态 -->
```

13 个主题的 frontmatter 取值：

| 主题 | 英文 | 定义 |
|---|---|---|
| 基础模型 | Foundation Models | 基础大模型能力本身：GPT/Claude/Gemini/Llama 等前沿模型与权重。 |
| 智能体平台 | Agent Platforms | Agent 框架、编排、工具调用、多智能体系统。 |
| Agentic编码 | Agentic Coding | Agentic Coding、代码 Agent、AI IDE/Copilot。 |
| 多模态大模型 | Multimodal Models | 视觉/音频/视频/统一多模态模型。 |
| 推理与基础设施 | Inference & Infra | 推理优化、推理引擎、芯片、算力、数据中心。 |
| 开源模型与生态 | Open Source & Ecosystem | 开源权重、开源框架、社区生态（HuggingFace 等）。 |
| 训练与数据 | Training & Data | 训练方法、对齐、数据集、合成数据。 |
| 评测与基准 | Evaluation & Benchmarks | Benchmark、能力评测、评测方法。 |
| 具身智能 | Embodied AI | 具身 AI、机器人、感知与控制。 |
| 世界模型 | World Models | 世界模型、物理仿真、视频生成模型作世界模型。 |
| 行业应用 | Industry Applications | 医疗/金融/法律/教育/科研等垂直落地。 |
| AI安全与对齐 | AI Safety & Alignment | 安全、对齐、红队、监管政策。 |
| 开发者工具 | Dev Tools | 面向开发者的 AI 工具链、SDK、平台。 |

逐个创建，每个文件内容为模板 + 对应取值。

- [ ] **Step 3: 验证 13 个文件夹各含 _index.md**

```bash
for d in 基础模型 智能体平台 Agentic编码 多模态大模型 推理与基础设施 开源模型与生态 训练与数据 评测与基准 具身智能 世界模型 行业应用 AI安全与对齐 开发者工具; do
  [ -f "$d/_index.md" ] && echo "OK: $d/_index.md" || echo "MISSING: $d"
done
```
Expected: 13 行 `OK:`。

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "content: 建立 13 个 AI 全景主题文件夹与 _index.md

基础模型/智能体平台/Agentic编码/多模态大模型/推理与基础设施/
开源模型与生态/训练与数据/评测与基准/具身智能/世界模型/
行业应用/AI安全与对齐/开发者工具"
```

---

## Task 5: 建根 _topics.md（中心分类索引）

**Files:**
- Create: `_topics.md`

- [ ] **Step 1: 写 _topics.md**

```markdown
# 主题分类索引

本仓库按 AI 全景主题组织新闻线索。每个主题对应根目录一个文件夹，文件夹内每个 `.md` 是一条持续追踪的线索（时间线文档）。

## 命名规则

- **文件夹与文件名以中文简称为主**，专有名词保留英文原名（如 Agentic、Claude、Sora、GPT），减少转译损失。
- 每个主题文件夹含一个 `_index.md`（主题说明 + 线索列表）。
- 新增/调整主题只需改本文件 + 建对应文件夹。

## 主题清单

| 文件夹 | 英文 | 范围 |
|---|---|---|
| `基础模型` | Foundation Models | 基础大模型能力本身：GPT/Claude/Gemini/Llama 等前沿模型与权重 |
| `智能体平台` | Agent Platforms | Agent 框架、编排、工具调用、多智能体系统 |
| `Agentic编码` | Agentic Coding | Agentic Coding、代码 Agent、AI IDE/Copilot |
| `多模态大模型` | Multimodal Models | 视觉/音频/视频/统一多模态模型 |
| `推理与基础设施` | Inference & Infra | 推理优化、推理引擎、芯片、算力、数据中心 |
| `开源模型与生态` | Open Source & Ecosystem | 开源权重、开源框架、社区生态（HuggingFace 等） |
| `训练与数据` | Training & Data | 训练方法、对齐、数据集、合成数据 |
| `评测与基准` | Evaluation & Benchmarks | Benchmark、能力评测、评测方法 |
| `具身智能` | Embodied AI | 具身 AI、机器人、感知与控制 |
| `世界模型` | World Models | 世界模型、物理仿真、视频生成模型作世界模型 |
| `行业应用` | Industry Applications | 医疗/金融/法律/教育/科研等垂直落地 |
| `AI安全与对齐` | AI Safety & Alignment | 安全、对齐、红队、监管政策 |
| `开发者工具` | Dev Tools | 面向开发者的 AI 工具链、SDK、平台 |

## 如何新增主题

1. 在本表追加一行（中文文件夹名 / 英文 / 范围）。
2. 建对应文件夹与 `_index.md`（参考任一现有主题的 `_index.md`）。
3. 提交。
```

- [ ] **Step 2: Commit**

```bash
git add _topics.md
git commit -m "content: 新增 _topics.md 中心主题索引"
```

---

## Task 6: 建线索模板 docs/线索模板.md

**Files:**
- Create: `docs/线索模板.md`

- [ ] **Step 1: 写线索模板**

```markdown
# 线索模板

> 复制本文件到对应主题文件夹，重命名为线索名（如 `智能体平台/Claude代码助手.md`），替换占位内容。
> 一个线索 = 一个持续追加的时间线文档。详见 `docs/superpowers/specs/2026-07-21-content-restructure-design.md` §5。

---

---
线索: <线索中文名>
主题: <所属主题文件夹名>
别名: [<英文/别名1>, <别名2>]
状态: 活跃          # 活跃 | 已完结 | 观察中
创建: 2026-07-21
更新: 2026-07-21
关键角色: [<公司/机构/人名>]
---

# <线索名>

> <一句话定位：这是什么、谁做的、解决什么问题。>

## 概述

<!-- 1-3 段整体描述。随信息积累逐步丰满：是什么、为什么重要、当前格局。
     只写事实，不写观点判断。观点放「分析」章节。 -->

## 时间线

<!-- 最新在上。按「年-月」分组，月内按日期倒序。
     追加新闻：在最近月份下插入；跨月则新建 ### YYYY-MM 标题。 -->

### 2026-07

- **2026-07-15** · [标题](URL)
  一句话摘要。关键数据/影响。
  > 原文要点或关键引述（可选）。

- **2026-07-02** · [标题](URL)
  摘要。

## 分析

<!-- 可选。线索积累足够后的阶段性深度分析：趋势判断、竞争格局、技术演进脉络。
     这里写观点，与「概述」中的事实分开。 -->

## 关联线索

<!-- 用 [[主题/线索名]] 双链表达线索间关联。 -->

- [[<主题>/<线索名>]]
```

- [ ] **Step 2: Commit**

```bash
git add docs/线索模板.md
git commit -m "content: 新增线索·时间线文件模板"
```

---

## Task 7: 归档旧文档到 docs/

**Files:**
- Move: `README.md` → `docs/legacy-readme.md`
- Move: `BUSINESS.md` `PROMOTION.md` `EVALUATION_REPORT.md` `AUDIT_REPORT.md` `EXAMPLES.md` `CHANGELOG.md` → `docs/`

- [ ] **Step 1: git mv 旧文档**

```bash
git mv README.md docs/legacy-readme.md
git mv BUSINESS.md docs/business.md
git mv PROMOTION.md docs/promotion.md
git mv EVALUATION_REPORT.md docs/evaluation-report.md
git mv AUDIT_REPORT.md docs/audit-report.md
git mv EXAMPLES.md docs/examples.md
git mv CHANGELOG.md docs/changelog.md
```

- [ ] **Step 2: 验证根目录已无这些文件**

```bash
ls README.md BUSINESS.md PROMOTION.md EVALUATION_REPORT.md AUDIT_REPORT.md EXAMPLES.md CHANGELOG.md 2>&1
```
Expected: 全部 `No such file or directory`。

```bash
ls docs/legacy-readme.md docs/business.md docs/promotion.md docs/evaluation-report.md docs/audit-report.md docs/examples.md docs/changelog.md
```
Expected: 7 个文件都列出。

- [ ] **Step 3: Commit（暂不写新 README，下一步做）**

```bash
git add -A
git commit -m "docs: 归档旧项目文档到 docs/

README→legacy-readme, BUSINESS/PROMOTION/EVALUATION_REPORT/
AUDIT_REPORT/EXAMPLES/CHANGELOG 移入 docs/ 并小写化命名。
新 README 将在下一次提交写入。"
```

---

## Task 8: 写新根 README.md

**Files:**
- Create: `README.md`（根目录新入口）

- [ ] **Step 1: 写新 README.md**

```markdown
# AI 新闻数据库

一个持续沉淀 AI 行业每一条线索的中文新闻内容库。按主题组织、以线索为单位、用时间线累积，最终呈现深度分析与演进脉络。

## 这是什么

- **内容库为主**：根目录是按 AI 全景主题组织的 Markdown 文件，git 跟踪、人可读、可长期沉淀。
- **一条线索 = 一个时间线文档**：每个 `.md` 持续追加某条故事线（产品、技术、趋势）的相关新闻，越积越厚。
- **工具为辅**：抓取/辅助工具位于 [`tools/cmd/`](tools/cmd/)，作为自包含 Go module 维护，不再是核心入口。

## 目录结构

```
ai-news-database/
├── <主题文件夹>/          # 13 个 AI 全景主题，见 _topics.md
│   ├── _index.md          # 主题说明 + 线索列表
│   └── <线索>.md          # 线索·时间线文件
├── _topics.md             # 中心主题索引
├── tools/cmd/             # Go 抓取/辅助工具（自包含 module）
├── docs/                  # 项目文档 + 线索模板
└── README.md
```

## 如何阅读

1. 从 [`_topics.md`](_topics.md) 选一个主题。
2. 进入主题文件夹，读 `_index.md` 看该主题下有哪些线索。
3. 打开任一线索 `.md`，「时间线」章节按时间倒序排列（最新在上），往下看即追溯演进。

## 如何贡献一条新闻

1. 找到新闻所属的线索文件（如 `智能体平台/Claude代码助手.md`）。若无线索，从 [`docs/线索模板.md`](docs/线索模板.md) 复制一个新建。
2. 在「时间线」顶部最近的 `### YYYY-MM` 下插入一条：

   ```
   - **2026-07-21** · [标题](URL)
     一句话摘要。关键数据/影响。
   ```

3. 跨月则新建月份标题。
4. 更新 frontmatter 的 `更新:` 日期。
5. （可选）补充「概述」（事实）或「分析」（观点）。

详见 [`CONTRIBUTING.md`](CONTRIBUTING.md)。

## 如何新建一个主题

见 [`_topics.md`](_topics.md) 的「如何新增主题」。

## 工具

抓取与辅助工具在 [`tools/cmd/`](tools/cmd/)。在该目录下：

```bash
cd tools/cmd
go build ./...
go test ./...
```

或从仓库根用转发 Makefile：

```bash
make build
make test
```
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: 新增内容库入口 README"
```

---

## Task 9: 更新 CONTRIBUTING.md（增加内容库贡献规范）

**Files:**
- Modify: `CONTRIBUTING.md`

- [ ] **Step 1: 读取现有 CONTRIBUTING.md**

```bash
cat CONTRIBUTING.md
```
记录现有结构与涉及路径的段落（尤其是「如何构建/测试」类指引）。

- [ ] **Step 2: 把构建/测试指引改为 tools/cmd**

将文中所有「在仓库根运行 `go build`/`go test`/`make`」类内容，改为指向 `tools/cmd`（或注明「从仓库根运行 `make build` 会自动转发到 `tools/cmd`」）。

- [ ] **Step 3: 增加「向内容库添加线索/新闻」章节**

在 CONTRIBUTING.md 合适位置追加一节，内容与 README 的「如何贡献一条新闻」一致但更详细，含线索模板引用、frontmatter 字段说明、时间线格式、双链语法、概述/分析分离原则。引用 `docs/线索模板.md` 和 `docs/superpowers/specs/2026-07-21-content-restructure-design.md` §5。

- [ ] **Step 4: Commit**

```bash
git add CONTRIBUTING.md
git commit -m "docs: CONTRIBUTING 增加内容库贡献规范并更新构建路径"
```

---

## Task 10: 最终验证

**Files:**
- 验证全局一致性，无文件修改。

- [ ] **Step 1: Go 构建与测试无回归**

```bash
cd tools/cmd && go build ./... && go test ./... 2>&1 | tail -20
```
Expected: build 成功，测试结果与搬迁前一致。

- [ ] **Step 2: 根目录结构符合预期**

```bash
ls -1
```
Expected: 能看到 13 个主题文件夹、`_topics.md`、`tools/`、`docs/`、`README.md`、`CONTRIBUTING.md`、`Makefile`、`.gitignore`、`.github`、`LICENSE`、`CODE_OF_CONDUCT.md`、`SECURITY.md`、`local/` 及各 IDE 配置目录；**不再有** `main.go` `cmd/` `internal/` `web/` `browser-extension/` `go.mod` `go.sum` `BUSINESS.md` 等。

- [ ] **Step 3: 每个主题文件夹有 _index.md**

```bash
for d in 基础模型 智能体平台 Agentic编码 多模态大模型 推理与基础设施 开源模型与生态 训练与数据 评测与基准 具身智能 世界模型 行业应用 AI安全与对齐 开发者工具; do
  [ -f "$d/_index.md" ] && echo "OK: $d" || echo "MISSING: $d"
done
```
Expected: 13 行 `OK:`。

- [ ] **Step 4: 关键文件存在**

```bash
ls _topics.md docs/线索模板.md docs/legacy-readme.md README.md CONTRIBUTING.md tools/cmd/go.mod tools/cmd/main.go tools/cmd/cmd/root.go
```
Expected: 全部存在。

- [ ] **Step 5: CI workflow 路径正确**

```bash
grep -n "working-directory" .github/workflows/*.yml
```
Expected: `ci.yml` 含 `working-directory: tools/cmd`。

- [ ] **Step 6: 根 Makefile 转发可用**

```bash
make test 2>&1 | tail -5
```
Expected: 在 `tools/cmd` 下执行测试。

- [ ] **Step 7: 无遗留旧路径引用**

```bash
grep -rn "cd browser-extension" .github/ 2>/dev/null
grep -rn "go test \./\.\.\." .github/ 2>/dev/null | grep -v "working-directory"
```
Expected: 无指向旧根路径的残留（`cd browser-extension` 应已改为 `cd tools/cmd/browser-extension`）。

- [ ] **Step 8: git status 干净**

```bash
git status
```
Expected: `nothing to commit, working tree clean`（所有变更已提交）。

- [ ] **Step 9: 最终总结提交（如有零散修复）**

若 Step 1-8 发现任何小问题并已修复，单独提交。否则跳过本步。

---

## 验收标准（对照 spec §8）

- [x] `cd tools/cmd && go build ./...` 成功；`go test ./...` 全绿（Task 1 Step 6、Task 10 Step 1）
- [x] 根目录主体为 13 主题文件夹 + `tools/` + `docs/` + 新 `README.md` + `_topics.md`（Task 10 Step 2）
- [x] 每个主题有 `_index.md`；根有 `_topics.md`（Task 10 Step 3）
- [x] 存在 `docs/线索模板.md`（Task 10 Step 4）
- [x] 新 README 让陌生人理解用法（Task 8）
- [x] `.gitignore` 含二进制产物路径（Task 3）
- [x] CI workflow 路径正确（Task 10 Step 5）

## 明确不在本次范围（对照 spec §9）

- 不改 Go 代码行为/功能
- 不自动导出现有 179 篇 SQLite 文章
- 不实现自动写入线索文件的脚本
- 不动 internal/ 业务逻辑
- 不做中英双语目录
- 不建三层及以上目录
