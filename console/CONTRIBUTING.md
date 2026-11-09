# 贡献指南

感谢你对 AI GURU 工作台（ai-guru-console，逐层拆解 AI 全行业的研究台）感兴趣！我们欢迎各种形式的贡献，包括但不限于：

- 提交 Bug 报告
- 提出新功能建议
- 改进文档
- 提交代码修复或新功能
- **完善拆解骨架或贡献证据层线索/时间线**（产业链节点见 `console/chain.js`，内容规范详见下文「内容库贡献」）
- 分享使用经验
- 帮助回答其他用户的问题

---

## 如何开始

1. **Fork 本仓库** 到你的 GitHub 账号下
2. **Clone 你的 Fork** 到本地
3. 创建一个新的分支：`git checkout -b feature/your-feature-name`
4. 进行修改并提交
5. 推送分支到你的 Fork：`git push origin feature/your-feature-name`
6. 在原始仓库中发起一个 **Pull Request**

---

## 贡献五级阶梯

不用一上来就写长文。按你能投入的时间选一级：

| 级别 | 动作 | 门槛 | 入口 |
|---|---|---|---|
| **L0** | 改错字 / 修断链 / 修格式 | 1 分钟 | [数据修正](https://github.com/ai-guru-global/ai-guru-console/issues/new?template=数据修正.yml) |
| **L1** | 认领一条待核实，给结论与一手来源 | 5 分钟 | [核实一条](https://github.com/ai-guru-global/ai-guru-console/issues/new?template=核实一条.yml) |
| **L2** | 给一条已有结论补来源 | 15 分钟 | [补一个来源](https://github.com/ai-guru-global/ai-guru-console/issues/new?template=补一个来源.yml) |
| **L3** | 新建一条线索时间线 | 1 小时 | [新建线索](https://github.com/ai-guru-global/ai-guru-console/issues/new?template=新建线索.yml) |
| **L4** | 提议 / 新建一个产业链节点 | 一次讨论 | [提议节点](https://github.com/ai-guru-global/ai-guru-console/issues/new?template=提议节点.yml) |

**最低摩擦的贡献是 L1：修一个数字、补一个来源。** 154 条待核实台账见 [`docs/2026待核实清单.md`](docs/2026待核实清单.md)；自动生成的待认领队列见 [`docs/good-first-issues.md`](docs/good-first-issues.md)。

### 数据集贡献

`data/` 是机器可读出口，不手改；改完内容后重跑：

```bash
make dataset        # 重建 data/*.json + schema/*.json 并校验
make dataset-check  # 只校验不写盘（CI 同款）
```

稳定 ID 与引用格式见 [`CITATION.md`](CITATION.md)；字段说明见 [`data/README.md`](data/README.md)。

---

## 内容库贡献

本仓库以**拆解台 + 证据层内容库**为主体（拆解骨架在 `console/chain.js`，证据层为根目录按主题组织的中文 md 文件夹）。欢迎你以「线索」「新闻条目」的方式参与证据层贡献——它们最终会挂到产业链节点上。

> 第三类内容是**领域深潜知识库**（`wiki/<领域名>/`，如 [GPU高网设计](wiki/GPU高网设计/README.md)）：系统知识而非事件流，一领域一库、知识点/厂家/角度三维分篇。开库条件、目录结构与事实纪律见 [`docs/知识库模板.md`](docs/知识库模板.md)；入口须在对应主题建一张线索卡互链。
> 完整主题清单见 [`_topics.md`](_topics.md)；格式规范详见 `docs/superpowers/specs/2026-07-21-content-restructure-design.md` §5。

### A. 新建一条线索

1. 从 [`docs/线索模板.md`](docs/线索模板.md) 复制到对应主题文件夹，重命名为线索名（中文简称为主，专有名词保留英文，如 `智能体平台/Claude代码助手.md`）。
2. 填写 YAML frontmatter 字段：

   | 字段 | 说明 |
   |---|---|
   | `线索` | 线索中文名 |
   | `主题` | 所属主题文件夹名 |
   | `别名` | 英文/别名列表 |
   | `状态` | `活跃` \| `已完结` \| `观察中` |
   | `创建` / `更新` | 日期，格式 `YYYY-MM-DD` |
   | `关键角色` | 相关公司/机构/人名 |

3. 在该主题的 `_index.md`「线索列表」下追加一行登记：

   ```markdown
   - [线索名](线索名.md) — 活跃
   ```

### B. 向已有线索追加一条新闻

在「时间线」章节顶部最近的 `### YYYY-MM` 标题下插入（最新在上）：

```markdown
- **2026-07-15** · [标题](URL)
  一句话摘要。关键数据/影响。
```

- 跨月则新建一个 `### YYYY-MM` 月份标题。
- 同步更新 frontmatter 的 `更新:` 日期。

### C. 内容原则

- **概述 vs 分析分离**：frontmatter 之后的「概述」章节只写事实（是什么、为什么重要），「分析」章节才写观点判断（趋势、格局）。两者分开，避免事实与观点混淆。
- **时间线倒序**：最新在上，按 `年-月` 分组，月内按日期倒序。
- **双链**：用 `[[主题/线索名]]` 表达线索间关联（如 `[[基础模型/GPT系列]]`）。
- **专有名词保留英文**：Claude、GPT、Sora、Agentic 等不翻译。

### D. 引用参考

- 线索模板：[`docs/线索模板.md`](docs/线索模板.md)
- 完整主题清单：[`_topics.md`](_topics.md)
- 完整格式规范：`docs/superpowers/specs/2026-07-21-content-restructure-design.md` §5

---

## 开发环境

### 前置要求

- Go 1.25 或更高版本
- Git

### 本地运行

> 注：Go CLI 代码在 `tools/cmd/`，仓库根是拆解台 + 证据层内容库（仓库主体）。
> 在仓库根运行 `make` 会自动转发到 `tools/cmd`。

```bash
# 克隆仓库
git clone https://github.com/ai-guru-global/ai-guru-console.git
cd ai-guru-console

# 运行测试（从仓库根用 make 转发到 tools/cmd）
make test
# 或直接进入 tools/cmd 操作
cd tools/cmd && go test ./...

# 编译（产物：tools/cmd/ai-news-database）
make build

# 运行
./tools/cmd/ai-news-database --help
```

---

## 提交 Issue

### Bug 报告

如果你发现了 Bug，请在提交 Issue 前检查是否已有类似报告。新建 Issue 时请包含以下信息：

- **操作系统和版本**（如 macOS 14.2, Ubuntu 22.04）
- **Go 版本**（`go version` 输出）
- **复现步骤**：尽可能详细
- **预期行为** vs **实际行为**
- **错误日志或截图**
- **相关配置文件**（如有，注意隐去 API Key）

### 功能建议

- 清晰描述你希望添加的功能
- 说明这个功能解决了什么痛点
- 如果可能，提供一个使用场景示例

---

## 代码规范

### Go 代码

- 使用 `gofmt` 格式化代码
- 遵循 [Effective Go](https://go.dev/doc/effective_go) 规范
- 为新功能添加单元测试（如适用）
- 保持现有代码风格一致
- 运行 `make quality` 确保所有质量检查通过后再提交

### 测试要求

| 测试类型 | 要求 | 运行命令 |
|----------|------|----------|
| 单元测试 | 必须 | `go test ./...` |
| 覆盖率 | ≥60% | `make test-coverage` |
| 基准测试 | 推荐 | `make benchmark` |

### 提交信息

我们建议使用清晰的提交信息格式：

```
<type>: <subject>

<body>
```

**Type 说明**：

- `feat`: 新功能
- `fix`: 修复 Bug
- `docs`: 文档更新
- `style`: 代码格式调整（不影响功能）
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

**示例**：

```
feat: add support for Dev.to official source

- Implement DevToCrawler using RSS feed
- Register source in official registry
- Add unit tests for crawler
```

### 质量检查清单

提交 PR 前确保：

- [ ] `make fmt` 通过
- [ ] `go vet ./...` 无错误
- [ ] `make lint` 无错误
- [ ] `make test-coverage` 覆盖率 ≥60%
- [ ] `make security` 无安全警告
- [ ] 所有测试通过 `go test ./... -race`

---

## 添加新采集源

如果你想为证据层添加一个新的官方技术源，通常需要修改以下文件（注意路径在 `tools/cmd/` 下）：

1. `tools/cmd/internal/official/registry.go` - 在 `registerDefaultSources()` 中注册源信息
2. `tools/cmd/internal/crawler/factory.go` - 在 `NewCrawler()` 中返回对应的采集器
3. `tools/cmd/cmd/sources.go`（通常无需修改，会自动读取注册表）
4. 如需专用采集器，在 `tools/cmd/internal/crawler/` 下新建实现 `Crawler` 接口的文件

**采集源入选标准**：

- 内容质量高，受众为程序员/技术人员
- 允许公开访问（不要求登录即可阅读标题和摘要）
- 更新频率稳定
- 有清晰的 URL 结构或 API

---

## 文档贡献

文档和代码同等重要！如果你发现文档有：

- 拼写或语法错误
- 过时的安装步骤
- 缺失的功能说明
- 不够清晰的示例

欢迎直接提交 PR 修复。

---

## 行为准则

- 保持友善和尊重
- 接受建设性的批评
- 关注什么对社区最有利
- 对其他社区成员表示同理心

---

## 获取帮助

- 在 [GitHub Discussions](https://github.com/ai-guru-global/ai-guru-console/discussions) 发起讨论
- 在 [GitHub Issues](https://github.com/ai-guru-global/ai-guru-console/issues) 搜索类似问题

再次感谢你的贡献！🚀
