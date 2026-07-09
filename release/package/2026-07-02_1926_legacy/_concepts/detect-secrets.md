---
title: "detect-secrets (Yelp 密钥泄露检测工具)"
category: -concepts
tags: ["security", "secrets-detection", "git-hooks", "devops", "ci-cd"]
relationships:
  - target: "_concepts/presidio"
    type: related_to
  - target: "_concepts/guardrails-ai"
    type: related_to
sources:
  - 架构基建/AI_Stack_Deep_Dive.md
summary: "Yelp 开源的密钥/凭证泄露检测工具，通过 Git pre-commit Hook 和 CI 扫描防止 API Key、Token、密码等敏感信息被提交到代码仓库。"
provenance:
  extracted: 0.55
  inferred: 0.35
  ambiguous: 0.10
base_confidence: 0.85
lifecycle: stable
tier: supporting
---

# detect-secrets

[detect-secrets](https://github.com/Yelp/detect-secrets) 是 Yelp 开源的密钥与凭证泄露检测工具，旨在**防止敏感信息（API Key、Token、密码、私钥等）被意外提交到 Git 仓库**。它通过 Git pre-commit Hook 和 CI 集成两种模式工作，是 DevSecOps 和 AI Stack 安全合规的重要一环。

## 核心特性

### 支持的密钥类型

| 类型 | 检测方式 | 示例 |
|------|----------|------|
| **AWS Access Key** | 正则 + 前缀 | `AKIA...` |
| **GitHub Token** | 正则 + 前缀 | `ghp_...`, `gho_...` |
| **OpenAI API Key** | 正则 + 前缀 | `sk-...` |
| **Private Key** | 正则 | `-----BEGIN RSA...` |
| **Slack Token** | 正则 | `xoxb-...` |
| **Generic Secret** | 熵值分析 | 高熵字符串 |
| **Base64 编码** | 解码 + 分析 | `dGVzdA==` |
| **自定义** | 插件机制 | 用户定义 |

### 两种检测模式

```
模式 1: 正则匹配
  - 已知密钥格式: AWS Key, GitHub Token, OpenAI Key
  - 速度快, 精确度高
  - 匹配已知前缀/格式

模式 2: 熵值分析
  - 未知格式的密钥
  - 计算字符串信息熵
  - 高熵 → 可能是随机密钥
  - 误报率较高，需人工确认
```

## 安装与使用

### 基本使用

```bash
# 安装
pip install detect-secrets

# 扫描整个仓库
detect-secrets scan > .secrets.baseline

# 查看发现的密钥
detect-secrets audit .secrets.baseline
```

### Git Pre-commit Hook

```bash
# 安装 pre-commit
pip install pre-commit

# 配置 .pre-commit-config.yaml
cat > .pre-commit-config.yaml << 'EOF'
repos:
- repo: https://github.com/Yelp/detect-secrets
  rev: v1.4.0
  hooks:
  - id: detect-secrets
    args: ['--baseline', '.secrets.baseline']
EOF

# 安装 Hook
pre-commit install

# 每次 commit 自动扫描变更文件
# 如检测到密钥: 阻止提交并告警
```

### CI 集成

```yaml
# GitHub Actions
- name: Detect Secrets
  run: |
    pip install detect-secrets
    detect-secrets scan --baseline .secrets.baseline
    # 对比基线，如有新增密钥则失败
    detect-secrets audit .secrets.baseline --fail-on-unaudited
```

### 基线文件 (.secrets.baseline)

```json
{
  "version": "1.4.0",
  "plugins_used": [
    {"name": "AWSKeyDetector"},
    {"name": "GitHubTokenDetector"},
    {"name": "HighEntropyStringsDetector", "keyword_exclude": "..."}
  ],
  "results": {
    "config/settings.py": [
      {
        "type": "OpenAI API Key",
        "filename": "config/settings.py",
        "hashed_secret": "a1b2c3...",
        "is_verified": false,
        "line_number": 42
      }
    ]
  }
}
```

## 自定义插件

```python
# 自定义密钥检测器
from detect_secrets.plugins.base import BasePlugin

class MyCustomDetector(BasePlugin):
    secret_type = "Custom API Token"
    
    def analyze_string(self, string, line_num, filename):
        # 自定义检测逻辑
        if string.startswith("myapp_token_"):
            yield self.secret_generator(string)
    
    def secret_generator(self, secret):
        return {
            "type": self.secret_type,
            "secret": secret,
            "is_verified": False
        }
```

## 白名单与排除

```bash
# 排除特定文件/目录
detect-secrets scan \
    --exclude-files '.*\.test\.py$' \
    --exclude-files 'tests/.*' \
    --exclude-secrets 'dummy.*key.*' \
    > .secrets.baseline

# 在代码中标记白名单
api_key = "test-key-12345"  # pragma: allowlist secret
```

## 在 AI Stack 中的角色

### 防止 AI 开发中的密钥泄露

```
AI Stack 密钥泄露风险:

1. .env 文件中的 OPENAI_API_KEY
2. Jupyter Notebook 中硬编码的 AWS Credentials
3. 训练脚本中的 WandB API Key
4. K8s Secret YAML 中的明文 Token
5. Dockerfile 中的 Registry 密码
6. HuggingFace Token 在配置文件

detect-secrets 在 commit 阶段拦截:
pre-commit hook → 检测到密钥 → 阻止提交 → 提示使用 Secret Manager
```

### 与 K8s Secret 管理配合

```
安全实践流程:

开发者 commit → detect-secrets 检查
    ↓ (通过)
CI/CD → 再次扫描确认
    ↓ (通过)
部署 → K8s Secret / Vault / External Secrets Operator
    ↓
运行时 → Pod 通过 env/volume 挂载 Secret
```

## 与同类工具对比

| 工具 | 类型 | 速度 | 自定义 | 集成 |
|------|------|------|--------|------|
| **detect-secrets** | 正则+熵值 | 快 | 插件 | pre-commit/CI |
| **gitleaks** | 正则 | 极快 | 规则 | pre-commit/CI |
| **truffleHog** | 正则+验证 | 中 | 规则 | CI/扫描器 |
| **git-secrets** | 正则 | 快 | 正则 | pre-commit |

## 参考资源

- [detect-secrets GitHub](https://github.com/Yelp/detect-secrets)
- [detect-secrets 文档](https://github.com/Yelp/detect-secrets#readme)
- [pre-commit 框架](https://pre-commit.com/)

## 相关概念

- [[_concepts/presidio]] — Microsoft Presidio PII 检测
- [[_concepts/guardrails-ai]] — Guardrails AI 安全防护框架
- [[_concepts/miniconda]] — Miniconda Python 环境管理
