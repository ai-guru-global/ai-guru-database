---
title: AI 代码安全审计 Runbook
category: 16-ai-coding
tags: ["ai-coding", "security", "code-audit", "sast", "sca", "secret-scan", "compliance", "devsecops"]
summary: '> **一句话理解**: AI 辅助生成的代码在提升研发效率的同时，也引入了传统代码审计未曾充分覆盖的新型风险。本 Runbook 从生产落地视角，系统梳理 AI 生成代码的漏洞模式、自动化与人工结合的审计工具链、CI/CD 集成策略以及企业合规 checklist，帮助团队在“加速”与“安全”之间建立可复现的平衡。'
created: 2026-07-01
updated: 2026-07-01
tier: supporting
aliases:
  - "AI Code Security Audit Runbook"
  - AI_Code_Security_Audit_Runbook
---

# AI 代码安全审计 Runbook

> **一句话理解**: AI 辅助生成的代码在提升研发效率的同时，也引入了传统代码审计未曾充分覆盖的新型风险。本 Runbook 从生产落地视角，系统梳理 AI 生成代码的漏洞模式、自动化与人工结合的审计工具链、CI/CD 集成策略以及企业合规 checklist，帮助团队在“加速”与“安全”之间建立可复现的平衡。

---

## Table of Contents

1. [为什么需要 AI 代码安全审计](#1-为什么需要-ai-代码安全审计)
2. [AI 生成代码的常见漏洞模式](#2-ai-生成代码的常见漏洞模式)
3. [传统代码安全工具链的配置与升级](#3-传统代码安全工具链的配置与升级)
4. [AI 代码审查工具对比与选型](#4-ai-代码审查工具对比与选型)
5. [审计 Checklist 与高危漏洞样例库](#5-审计-checklist-与高危漏洞样例库)
6. [CI/CD 集成与企业合规要求](#6-cicd-集成与企业合规要求)
7. [组织流程与人员能力建设](#7-组织流程与人员能力建设)
8. [应急与复盘机制](#8-应急与复盘机制)
9. [总结与落地路线图](#9-总结与落地路线图)

---

## 1. 为什么需要 AI 代码安全审计

### 1.1 AI 编程的普及改变了风险面

2026 年，AI 编程助手在企业研发中的渗透率已经超过 75%。从 Copilot、Cursor 到 Claude Code、Devin，这些工具能够基于自然语言生成可运行的代码片段、完整的函数乃至跨文件的模块。然而，AI 模型的训练数据来自公开互联网，其中包含大量带有历史漏洞、过时依赖、错误配置甚至恶意后门的代码。当模型以“最可能的下一个 token”生成代码时，它并不理解业务上下文、安全边界和合规约束。

这意味着：

- **漏洞密度可能被放大**：AI 能在短时间内产出大量代码，如果缺乏同步的审计能力，单位时间引入的潜在缺陷会显著增加。
- **新型攻击面出现**：提示注入（Prompt Injection）不仅针对运行时的 LLM 应用，也可能通过代码注释、文档字符串或特殊构造的上下文污染生成的代码。
- **合规责任主体模糊**：当 AI 生成了包含漏洞的代码并由人工合并后，法律与审计层面需要明确“谁对这段代码负责”。
- **传统 SAST/SCA 规则滞后**：现有工具大多基于已知漏洞模式，对 AI 特有的“幻觉 API”、“幽灵依赖”等场景覆盖不足。

### 1.2 安全审计的目标定位

AI 代码安全审计不是阻止使用 AI 编程工具，而是建立三道防线：

| 防线 | 阶段 | 关键动作 | 负责角色 |
|------|------|----------|----------|
| 第一道 | 生成前 | 提示词安全、上下文隔离、敏感信息过滤 | 开发者 |
| 第二道 | 提交前 | SAST/SCA/Secret Scan、AI 辅助审查、单元测试 | CI/CD + 安全工具 |
| 第三道 | 合并后 | 同行评审、安全专家抽检、运行时 RASP/IAST | 安全团队 + 架构师 |

本 Runbook 聚焦第二道和第三道防线，提供可落地的工具配置、流程模板和组织建议。

### 1.3 与现有体系的关系

AI 代码安全审计应当融入已有的 DevSecOps 体系，而不是另起炉灶。其与 SDL（Security Development Lifecycle）、SSDLC（Secure SDLC）、供应链安全、内部合规审计之间是互补关系。通过将 AI 生成代码的审计要求写入编码规范、合并策略和发布门禁，可以形成持续、低成本、可度量的安全治理能力。

---

## 2. AI 生成代码的常见漏洞模式

### 2.1 注入类漏洞（Injection Flaws）

AI 模型在生成数据库查询、命令执行、动态脚本时，常常为了追求“能跑通”而忽略参数化查询或输入校验。典型表现包括：

- **SQL 注入**：将用户输入直接拼接到 SQL 语句中，未使用 ORM 参数化接口。
- **命令注入**：使用 `os.system`、`subprocess.call` 拼接用户可控字符串。
- **NoSQL/LDAP/XPath 注入**：在 MongoDB、LDAP、XML 解析场景中未做类型校验。
- **提示词注入的代码化表现**：将不可信的用户输入直接嵌入到模板字符串、eval、new Function、JSON.parse 等动态执行路径中。

**高危样例（Python）**：

```python
# AI 生成的危险代码
query = f"SELECT * FROM users WHERE id = {user_id}"
cursor.execute(query)
```

正确做法应当使用参数化查询：

```python
cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
```

### 2.2 依赖混淆与幽灵依赖

AI 模型在生成 import 或 package.json 时，经常“编造”出看似合理但实际不存在或被抢注的包名。攻击者利用这一点发布同名的恶意包，形成依赖混淆攻击。常见模式：

- **私有包名泄露**：训练数据中学到企业内部私有包名，并在公开代码中建议安装，导致依赖解析时被恶意包替代。
- **AI 幻觉依赖**：生成的代码引用 `pip install xyz-utils`，而 PyPI 上恰好存在同名恶意包。
- **版本锁定缺失**：未使用 `package-lock.json`、`poetry.lock`、`uv.lock` 等机制，导致每次安装拉取最新版，引入供应链风险。

**防护要点**：

- 强制使用私有仓库（如 Artifactory、Nexus、Azure Artifacts）作为唯一依赖源。
- 对新引入的依赖执行来源校验、签名验证和流行度评估。
- 使用 `dependency confusion scanner` 检测内部包名是否在公网被抢注。

### 2.3 密钥与敏感信息泄露

AI 编程助手常常在示例代码中“补齐”看似占位但实际有效的密钥、Token、密码。如果开发者不注意审查，极易将真实凭证硬编码进仓库。典型场景：

- 生成 AWS、Azure、GCP 的 SDK 调用示例时，附带伪造但形似真实的 AK/SK。
- 在 `.env.example` 或配置模板中写入默认密码，如 `ADMIN_PASSWORD=admin123`。
- 在测试代码中写入真实数据库连接串。
- 通过日志或异常堆栈泄露内部 Token、Session ID。

**防护要点**：

- 在 CI 中启用 Secret Scan（如 GitHub Secret Scanning、GitLab Secret Detection、TruffleHog、Gitleaks）。
- 对提交历史进行扫描，发现泄露后立即轮换凭证，而不是仅删除当前文件。
- 禁止在 AI 助手的上下文中粘贴真实密钥，避免被模型记忆或回传到云端。

### 2.4 幻觉 API 与错误的安全实现

模型可能生成调用不存在 API 的代码，或实现看似正确但实际有缺陷的安全逻辑。例如：

- 使用已弃用或根本不存在的加密算法，如 `DES`、`MD5` 用于密码存储。
- 自行实现 JWT 签名验证、随机数生成、加密协议，忽视时序攻击、密钥派生、Nonce 复用等问题。
- 调用未发布的内部 API，导致线上运行时 404 或信息泄露。
- 生成“伪安全”代码，例如用 `btoa` 做加密、用简单字符串替换做敏感信息脱敏。

**防护要点**：

- 建立“禁止自行实现加密”的硬性规范，所有加解密必须使用经过审计的库。
- 对 AI 生成的 API 调用进行运行时契约测试（Contract Test）。
- 在安全相关代码上强制要求人工审查 + 安全团队会签。

### 2.5 权限与访问控制缺陷

AI 生成的代码常常默认使用最高权限，缺乏最小权限原则。例如：

- 生成 IAM Policy 时使用 `*:*` 通配权限。
- 容器以 root 用户运行，或未设置 securityContext。
- API 接口未做鉴权，或未校验资源归属关系（IDOR）。
- 文件上传功能未限制类型、大小和存储路径，导致任意文件上传/目录遍历。

### 2.6 其他高危模式

- **不安全的反序列化**：直接使用 `pickle.loads`、`yaml.load`、`ObjectInputStream.readObject` 处理不可信数据。
- **CORS / CSP 配置过度宽松**：将 `Access-Control-Allow-Origin` 设置为 `*`，或 CSP 策略形同虚设。
- **日志与错误处理信息泄露**：将完整堆栈、内部路径、数据库结构返回给客户端。
- **并发与竞态条件**：AI 对并发场景理解有限，容易生成缺少锁、事务或幂等设计的代码。

---

## 3. 传统代码安全工具链的配置与升级

### 3.1 SAST（静态应用安全测试）

SAST 工具通过扫描源代码识别已知漏洞模式。针对 AI 生成代码，SAST 需要提升扫描频率、扩展规则集，并与 AI 审查工具协同。

| 工具 | 适用语言 | 特点 | 推荐场景 |
|------|----------|------|----------|
| SonarQube / SonarCloud | 多语言 | 规则丰富、企业级、可定制 Quality Gate | 全仓库持续扫描 |
| CodeQL (GitHub) | 多语言 | 语义分析强、支持自定义查询 | GitHub 生态深度集成 |
| Semgrep | 多语言 | 规则轻量、社区规则多、易定制 | 快速接入与定制 |
| Checkmarx | 多语言 | 企业级、支持 AI 代码检测增强 | 大型企业合规 |
| Bandit | Python | Python 专用、速度快 | Python 项目基线 |
| Brakeman | Ruby | Rails 专用 | Ruby 项目 |
| ESLint Security | JS/TS | 前端安全规则插件 | Node.js 前端项目 |

**AI 时代 SAST 升级建议**：

1. **增量扫描 + 全量扫描结合**：每次 PR 做增量扫描，每周或每次发布做全量扫描。
2. **规则库持续更新**：订阅 CWE、OWASP Top 10、SANS Top 25 的最新规则，并加入 AI 特定模式（如禁止 eval、禁止硬编码密钥、禁止不安全的反序列化）。
3. **误报治理**：建立误报反馈机制，避免开发者因大量误报而忽略真实漏洞。
4. **扫描结果与 PR 评论集成**：将 SAST 发现的问题自动标注到对应代码行，降低修复成本。

### 3.2 SCA（软件成分分析）

SCA 用于识别第三方依赖中的已知漏洞和许可证风险。AI 生成代码对依赖的“幻觉”使得 SCA 的重要性进一步上升。

| 工具 | 数据源 | 特点 |
|------|--------|------|
| Snyk | NVD、Snyk DB | 修复建议详细、支持容器和 IaC |
| OWASP Dependency-Check | NVD | 开源免费、规则库较全 |
| FOSSA | 多数据源 | 许可证合规强、企业报告完善 |
| Mend (WhiteSource) | 多数据源 | 企业级、策略引擎强 |
| GitHub Dependabot | GitHub Advisory DB | 与 GitHub 集成、自动 PR 修复 |
| npm audit / pip-audit | 官方数据源 | 轻量、适合快速接入 |

**关键配置**：

- 在 CI 中设置 `fail-on` 策略，对 Critical/High 漏洞阻断合并。
- 对 AI 新引入的依赖强制要求 SBOM（Software Bill of Materials）审查。
- 每周生成依赖漏洞报告，并纳入安全周会跟踪。

### 3.3 Secret Scan（密钥扫描）

Secret Scan 是 AI 代码安全审计中 ROI 最高的环节之一。推荐采用“提交前 + CI 中 + 历史扫描”三层防护。

| 工具 | 扫描位置 | 特点 |
|------|----------|------|
| GitHub Secret Scanning | 仓库/历史 | 与 GitHub 原生集成，支持合作伙伴模式 |
| GitLab Secret Detection | CI 流水线 | 内置规则，支持自定义正则 |
| TruffleHog | 本地/CI | 支持熵检测和验证器，可识别活跃密钥 |
| Gitleaks | 本地/CI | 轻量、速度快、规则可扩展 |
| git-secrets | 本地 | 适合作为 pre-commit hook |

**生产落地建议**：

- 所有仓库必须启用 Secret Scan，发现 High-confidence 密钥立即阻断 CI。
- 对历史提交进行全量扫描，发现泄露后启动凭证轮换流程。
- 在 IDE 和 AI 工具层面配置提示：禁止将真实密钥粘贴到 AI 聊天窗口或提示词中。

### 3.4 依赖锁定与私有仓库

- 强制使用 lockfile，禁止在 CI 中执行无锁定的 `pip install -r requirements.txt` 或 `npm install`。
- 通过私有仓库代理所有外部依赖，配置白名单，禁止直接从 PyPI/NPM 拉取未审核包。
- 对 AI 生成的依赖变更，要求 diff 中说明新增依赖的用途、版本、许可证和来源。

### 3.5 IaC 与容器安全扫描

AI 也常被用于生成 Dockerfile、Terraform、Kubernetes YAML。需要额外关注：

- **Trivy / Snyk Container**：扫描镜像漏洞和配置问题。
- **Checkov / tfsec**：扫描 Terraform/CloudFormation 中的权限、加密、网络配置问题。
- **Kube-score / Kubesec**：评估 Kubernetes 资源配置的安全基线。
- **OPA / Kyverno**：在集群准入阶段强制执行安全策略。

---

## 4. AI 代码审查工具对比与选型

### 4.1 工具全景对比

| 工具 | 定位 | 集成方式 | 优势 | 劣势 | 适合团队 |
|------|------|----------|------|------|----------|
| **CodeRabbit** | AI 代码审查平台 | GitHub/GitLab PR 集成 | 审查粒度细、支持聊天追问、可配置规则 | 成本较高、对国内仓库延迟较大 | 中大型企业 |
| **PR-Agent (Qodo Merge)** | 开源 AI PR 审查 | GitHub/GitLab/Azure DevOps | 开源可定制、支持多种命令 | 部署和维护成本较高 | 有自研能力团队 |
| **GitHub Copilot Review** | GitHub 原生 AI 审查 | GitHub PR | 与 Copilot 生态无缝集成 | 目前功能较新、规则可控性有限 | GitHub 深度用户 |
| **SonarQube with AI Assist** | 传统 SAST + AI 解释 | CI/PR 集成 | 规则成熟、AI 辅助解释漏洞 | 主要还是基于规则，AI 能力较浅 | 已有 Sonar 基础企业 |
| **Amazon CodeGuru / Google Cloud Code Intelligence** | 云厂商 AI 代码审查 | 对应云生态 | 与云服务集成好、可扩展 |  Vendor lock-in、隐私顾虑 | 公有云重度用户 |
| **Snyk Code with DeepCode AI** | SCA/SAST + AI 修复建议 | IDE/CI/PR | 修复建议 actionable 强 | 价格较高 | 已有 Snyk 生态 |

### 4.2 CodeRabbit 深度实践

CodeRabbit 通过读取 PR diff 和上下文，自动生成审查评论，并支持开发者对评论进行追问。企业落地时建议：

- **配置审查范围**：限制单次审查的文件数和行数，避免 Token 成本失控。
- **自定义规则文件**：通过 `.coderabbit.yaml` 定义编码规范、安全禁忌和必须检查项。
- **与安全工具联动**：将 SAST/SCA 的发现作为上下文输入 CodeRabbit，让 AI 生成修复建议。
- **建立评论 SLA**：规定开发者必须在多久内响应 AI 提出的 High/Medium 级别问题。

### 4.3 PR-Agent 深度实践

PR-Agent 是一个开源项目，可通过自托管降低数据出境风险。关键能力包括：

- `/describe`：自动生成 PR 描述。
- `/review`：AI 代码审查。
- `/improve`：提出代码改进建议。
- `/ask`：针对 PR 内容提问。

企业落地建议：

- 私有化部署，避免代码上传到第三方。
- 接入内部知识库和编码规范，提升建议的相关性。
- 与内部 SAST API 集成，将安全发现自动加入审查报告。

### 4.4 GitHub Copilot Review

Copilot Review 是 GitHub 在 2025-2026 年重点推出的功能，直接在 PR 页面提供 AI 审查。其优势在于与 Copilot 编辑器体验一致，开发者接受度高。局限在于目前主要依赖通用模型，对特定企业规范的适配需要额外配置。

### 4.5 AI 审查工具的使用原则

AI 审查工具应当作为“第一审稿人”，而不是最终决策者：

- **高置信度问题自动阻塞**：如密钥泄露、SQL 注入、命令注入等可由规则明确判定的问题。
- **中置信度问题要求人工确认**：如复杂业务逻辑漏洞、权限设计缺陷。
- **低置信度问题作为提示**：如代码风格、可读性建议，不阻塞合并。
- **保留人工最终审查权**：安全相关的关键变更必须经由具备安全背景的人员最终审批。

---

## 5. 审计 Checklist 与高危漏洞样例库

### 5.1 AI 生成代码安全审计 Checklist

#### 提交前自检（开发者）

```text
□ 未将真实密钥、密码、Token 硬编码到代码中
□ 所有用户输入均经过校验、转义或参数化处理
□ 未引入未经审核的新依赖
□ 不存在 eval、exec、new Function 等动态执行不可信输入的代码
□ 不存在 root 运行、777 权限、*:* IAM 等过度授权配置
□ 错误处理未泄露内部路径、堆栈、数据库结构
□ 新增 API 已做鉴权与权限校验
□ 敏感操作已记录审计日志
```

#### CI 门禁（自动化）

```text
□ SAST 扫描通过，无 Critical/High 未修复漏洞
□ SCA 扫描通过，无 Critical/High 未修复依赖漏洞
□ Secret Scan 未发现高置信度泄露
□ 单元测试覆盖率不低于团队基线
□ 新增依赖已生成 lockfile 并经过白名单校验
□ IaC/容器扫描通过（如适用）
```

#### 合并前人工审查（审查者）

```text
□ 理解 AI 生成代码的业务意图和安全边界
□ 检查与 AI 审查工具、SAST 结论是否一致
□ 对安全相关代码进行逐行审查
□ 确认测试用例覆盖了正常路径和异常路径
□ 评估新增依赖的必要性和来源可信度
□ 检查权限、加密、日志、错误处理是否符合规范
```

### 5.2 高危漏洞样例库

企业应维护一份内部高危漏洞样例库，用于培训、规则校准和自动化检测。以下为代表性样例。

#### 样例 1：SQL 注入（Python / Flask）

```python
# 危险代码
@app.route('/user')
def get_user():
    user_id = request.args.get('id')
    query = f"SELECT * FROM users WHERE id = {user_id}"
    result = db.execute(query)
    return jsonify(result)
```

```python
# 安全代码
@app.route('/user')
def get_user():
    user_id = request.args.get('id')
    if not user_id or not user_id.isdigit():
        return jsonify({"error": "invalid id"}), 400
    result = db.execute("SELECT * FROM users WHERE id = %s", (user_id,))
    return jsonify(result)
```

#### 样例 2：命令注入（Node.js）

```javascript
// 危险代码
const { exec } = require('child_process');
app.get('/ping', (req, res) => {
  const host = req.query.host;
  exec(`ping -c 4 ${host}`, (err, stdout) => {
    res.send(stdout);
  });
});
```

```javascript
// 安全代码
const { execFile } = require('child_process');
app.get('/ping', (req, res) => {
  const host = req.query.host;
  if (!/^[a-zA-Z0-9.-]+$/.test(host)) {
    return res.status(400).send('invalid host');
  }
  execFile('ping', ['-c', '4', host], (err, stdout) => {
    res.send(stdout);
  });
});
```

#### 样例 3：硬编码密钥

```python
# 危险代码
api_key = "sk-1234567890abcdef"
client = OpenAI(api_key=api_key)
```

```python
# 安全代码
import os
from dotenv import load_dotenv
load_dotenv()
api_key = os.environ.get("OPENAI_API_KEY")
if not api_key:
    raise ValueError("OPENAI_API_KEY is not set")
client = OpenAI(api_key=api_key)
```

#### 样例 4：不安全的反序列化

```python
# 危险代码
import pickle
data = pickle.loads(request.data)
```

```python
# 安全代码
import json
try:
    data = json.loads(request.data.decode('utf-8'))
except json.JSONDecodeError:
    return jsonify({"error": "invalid json"}), 400
```

#### 样例 5：依赖混淆风险

```text
# 危险场景
AI 建议安装 pip install internal-auth-sdk
而内部包名为 auth-sdk-internal，攻击者在 PyPI 抢注 internal-auth-sdk
```

```text
# 安全做法
- 使用私有 PyPI 镜像作为唯一源
- 在 SCA 中配置内部包名白名单
- 定期检查公网是否存在同名抢注包
```

### 5.3 样例库的运营

- **每月更新**：根据新发现的 AI 生成代码漏洞、外部安全事件和内部审计结果补充样例。
- **与规则库同步**：将样例转化为 Semgrep、CodeQL 或自定义 SAST 规则。
- **用于培训**：在新人入职和安全培训中使用真实样例进行攻防演练。
- **与 AI 审查工具对齐**：将样例库作为 fine-tuning 或 prompt engineering 的素材，提高 AI 审查工具的检出率。

---

## 6. CI/CD 集成与企业合规要求

### 6.1 CI/CD 安全门禁设计

建议将 AI 代码安全审计嵌入 CI/CD 的以下阶段：

```text
Developer Push
    │
    ▼
Pre-commit Hook
├── Secret Scan (git-secrets / Gitleaks)
├── Lint / Format
└── 基础单元测试
    │
    ▼
Pull Request
├── SAST 增量扫描 (Semgrep / SonarQube / CodeQL)
├── SCA 依赖扫描 (Snyk / Dependabot)
├── AI 代码审查 (CodeRabbit / PR-Agent / Copilot Review)
├── Secret Scan 全量扫描
└── 人工同行审查
    │
    ▼
Merge to Main
├── 全量 SAST / SCA
├── 容器/IaC 扫描
├── 集成测试 / 安全测试
└── SBOM 生成与归档
    │
    ▼
Release
├── 安全评审会议（高风险变更）
├── 变更日志与审计记录
└── 灰度发布 + 运行时监控
```

### 6.2 门禁策略与灰度发布

- **阻断策略**：Critical/High 安全漏洞未修复、密钥泄露、CI 失败均不得合并。
- **例外流程**：必须由安全负责人书面审批，并记录风险接受理由。
- **灰度发布**：AI 生成的涉及核心业务的代码，应先在小流量环境验证，再逐步全量。
- **回滚策略**：明确模型版本、代码版本和配置版本的回滚路径，确保发现安全问题后可快速回退。

### 6.3 企业合规要求映射

| 合规框架 | 相关条款 | AI 代码审计对应动作 |
|----------|----------|---------------------|
| 等保 2.0 | 安全开发、漏洞管理 | SDL 集成、SAST/SCA、密钥扫描 |
| ISO 27001 | A.8.25 / A.8.28 安全开发 | 编码规范、审计日志、变更管理 |
| SOC 2 | CC6.1 / CC6.6 / CC7.1 | 访问控制、监控、漏洞修复 SLA |
| GDPR / 个人信息保护法 | 数据最小化、隐私设计 | 敏感信息扫描、PII 识别与脱敏 |
| EU AI Act | 高风险 AI 系统透明度与日志 | 生成代码审计、变更可追溯 |
| 金融行业监管 | 源代码安全、第三方组件 | SCA、SBOM、供应链安全 |

### 6.4 审计日志与可追溯性

- 记录每次 AI 生成代码的原始提示词摘要、模型版本、生成时间和人工审查记录。
- 保留 PR、CI 扫描报告、人工评论和合并审批记录，满足审计和取证需求。
- 对生产事故中涉及 AI 生成代码的部分，能够追溯到具体的提示词、模型和开发者决策。

### 6.5 SBOM 与供应链安全

- 每次发布必须生成 SBOM，包含所有直接和传递依赖。
- 将 SBOM 与漏洞数据库关联，持续监控新披露的 CVE。
- 对 AI 生成的 Dockerfile、requirements.txt、package.json 等进行版本锁定和签名验证。

---

## 7. 组织流程与人员能力建设

### 7.1 角色与职责

| 角色 | 职责 |
|------|------|
| 安全架构师 | 制定 AI 代码安全规范、工具选型、审查策略 |
| SRE / DevOps 工程师 | CI/CD 安全门禁配置、扫描工具运维、监控告警 |
| 开发团队 | 遵循规范、修复安全漏洞、参与安全培训 |
| AI 代码审查工具管理员 | 规则配置、模型版本管理、误报治理 |
| 合规官 | 审计记录检查、合规报告、例外审批 |

### 7.2 安全培训与文化建设

- **入职培训**：所有使用 AI 编程工具的开发者必须通过 AI 代码安全基础培训。
- **样例库演练**：每季度组织一次基于内部样例库的攻防演练。
- **红蓝对抗**：定期模拟 AI 生成代码中的漏洞，检验检测和响应能力。
- **正向激励**：将安全审计结果纳入团队绩效，奖励主动发现并修复风险的成员。

### 7.3 规则文件与提示工程

- 在仓库中维护 `.ai-security-rules.md`，明确禁止项、必须项和推荐做法。
- 将规则文件作为 AI 助手的上下文，提高生成代码的合规性。
- 定期复盘 AI 生成代码的审计结果，迭代规则和提示词模板。

### 7.4 度量与改进

建议建立以下 KPI：

- **AI 生成代码占比**：统计由 AI 辅助生成的代码行数占比。
- **安全漏洞检出率**：SAST/SCA/Secret Scan 在 AI 生成代码中的检出率。
- **高危漏洞修复时长**：从发现 Critical/High 漏洞到修复合并的平均时间。
- **AI 审查工具采纳率**：开发者对 AI 审查建议的采纳比例。
- **安全事件数**：涉及 AI 生成代码的生产安全事件数量及严重程度。

---

## 8. 应急与复盘机制

### 8.1 安全事件分级

| 级别 | 定义 | 响应时间 | 示例 |
|------|------|----------|------|
| P0 | 生产环境已被利用或即将被利用 | 15 分钟 | 密钥泄露且已公开、核心 API 存在命令注入并被扫描 |
| P1 | 高危漏洞存在但实际利用条件复杂 | 2 小时 | SQL 注入但需绕过 WAF、依赖中存在高危 CVE |
| P2 | 中危问题，需尽快修复 | 24 小时 | 依赖版本过期、日志泄露内部路径 |
| P3 | 低危或合规建议项 | 下一个迭代 | 代码风格、文档缺失 |

### 8.2 应急响应流程

1. **发现与确认**：通过 Secret Scan、运行时监控或外部报告发现问题。
2. **遏制**：立即撤销泄露凭证、回滚有漏洞的版本、关闭受影响接口。
3. **根除**：修复漏洞、更新依赖、重新生成密钥。
4. **恢复**：在验证通过后重新上线，持续监控。
5. **复盘**：编写事故报告，更新规则库和样例库，防止同类问题复发。

### 8.3 涉及 AI 生成代码的特殊考虑

- 保留事故相关代码的生成上下文，包括提示词、模型版本和审查记录。
- 评估是否为模型固有倾向导致的问题，必要时调整提示词或切换模型。
- 如果漏洞源于训练数据中的模式，需在内部样例库中标记为“AI 常见错误”。

---

## 9. 总结与落地路线图

### 9.1 核心原则

- **不信任、不盲从**：AI 生成代码必须经过与人工编写代码同等甚至更严格的安全审查。
- **工具链先行**：在推广 AI 编程工具之前，先建立 SAST/SCA/Secret Scan/AI 审查的完整工具链。
- **人机协同**：AI 负责快速发现常规问题，人类负责判断复杂风险和业务上下文。
- **持续迭代**：安全规范、规则库和样例库需要根据实际审计结果不断演进。

### 9.2 分阶段落地路线图

| 阶段 | 周期 | 目标 | 关键动作 |
|------|------|------|----------|
| 第一阶段 | 1-2 周 | 基线扫描 | 部署 SAST/SCA/Secret Scan，了解当前风险水位 |
| 第二阶段 | 2-4 周 | CI 门禁 | 将扫描工具接入 PR 和合并流程，设置阻断策略 |
| 第三阶段 | 1-2 月 | AI 审查 | 引入 CodeRabbit / PR-Agent / Copilot Review，建立人机协同流程 |
| 第四阶段 | 2-3 月 | 合规深化 | 建立样例库、SBOM、审计日志、合规报告 |
| 第五阶段 | 持续 | 度量改进 | 建立 KPI，定期复盘，迭代规则与工具 |

### 9.3 最后建议

AI 代码安全审计不是一次性的项目，而是伴随 AI 编程工具演进的长期工程。团队应当在效率与安全之间找到适合自己的节奏，避免因为过度审查而扼杀创新，也要避免因为盲目信任 AI 而引入系统性风险。通过工具链、流程、人员和文化的共同建设，可以实现“AI 加速开发，安全保驾护航”。

---

## Related

- [[16_AI_Coding/Methodology/Vibe_Coding_Production_Practices|Vibe Coding 生产环境实践指南]]
- [[16_AI_Coding/Methodology/Agentic_Coding_Methodology|Agentic Coding 方法论]]
- [[16_AI_Coding/Methodology/Vibe_Coding_Methodology|Vibe Coding 方法论]]
- [[16_AI_Coding/Theory/AI_Coding_Theory|AI 编程理论基础]]
- [[16_AI_Coding/Tools/AI_Coding_Assistants_2026|AI 编程助手全景报告]]
- [[16_AI_Coding/Tools/Hermes_Agent_2026|Hermes Agent 2026 年专业指南]]
- [[16_AI_Coding/Practice/Vibe_Coding_Prompt_Templates|Vibe Coding 提示词模板库]]
- [[16_AI_Coding/Practice/Vibe_Coding_Getting_Started|Vibe Coding 入门指南]]
- [[16_AI_Coding/Practice/Vibe_Coding_Real_World_Cases|Vibe Coding 实战案例集]]
- [[16_AI_Coding/README|AI 编程 (AI Coding)]]
