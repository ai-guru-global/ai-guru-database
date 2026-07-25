---
title: "Wuying AgentBay: Alibaba Cloud's AI Agent Infrastructure"
category: "15-agent-production-openclaw-ecosystem"
tags: ["ai-agents", "agent-framework", "production", "langgraph"]
summary: "**Wuying AgentBay** is Alibaba Cloud's cloud-native automation execution platform designed specifically for AI Agents. It provides a secure, serverless cloud environment where AI a"
created: "2026-05-31"
updated: "2026-05-31"
tier: supporting
aliases:
  - "Wuying Agentbay"
  - "Wuying AgentBay"
  - Wuying_AgentBay
sources: []

---
# Wuying AgentBay: Alibaba Cloud's AI Agent Infrastructure

## Overview

**Wuying AgentBay** is Alibaba Cloud's cloud-native automation execution platform designed specifically for AI Agents. It provides a secure, serverless cloud environment where AI agents can perform automated tasks without requiring users to configure their own infrastructure.

**Website**: [jvs.wuying.aliyun.com](https://jvs.wuying.aliyun.com/) 
**SDK**: [github.com/agentbay-ai/wuying-agentbay-sdk](https://github.com/agentbay-ai/wuying-agentbay-sdk) 
**MCP Server**: [mcpservers.org/servers/Michael98671/agentbay](https://mcpservers.org/servers/Michael98671/agentbay) 
**Provider**: Alibaba Cloud (阿里云)

---

## Table of Contents

1. [What is AgentBay](#what-is-agentbay)
2. [Key Features](#key-features)
3. [Architecture](#architecture)
4. [MCP Integration](#mcp-integration)
5. [Use Cases](#use-cases)
6. [Getting Started](#getting-started)
7. [SDK Reference](#sdk-reference)
8. [Security & Compliance](#security--compliance)
9. [Pricing](#pricing)
10. [Comparison with Alternatives](#comparison-with-alternatives)

---

## What is AgentBay

### The Cloud Sandbox Problem

AI Agents need a place to execute tasks safely:

```
┌─────────────────────────────────────────────────────────────────┐
│                    The Challenge                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  AI Agent needs to:                                             │
│  • Execute code                                                 │
│  • Run terminal commands                                        │
│  • Browse the web                                               │
│  • Manage files                                                 │
│                                                                 │
│  But where?                                                     │
│                                                                 │
│  ❌ User's computer: Security risk, always needs to be on      │
│  ❌ Dedicated VM: Expensive, complex to manage                  │
│  ❌ Container: Still needs infrastructure                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### The AgentBay Solution

AgentBay provides **on-demand cloud sandboxes** for AI Agents:

```
┌─────────────────────────────────────────────────────────────────┐
│                    AgentBay Solution                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ✅ Secure, isolated execution environment                      │
│  ✅ Serverless - pay only for what you use                     │
│  ✅ One-click configuration                                     │
│  ✅ Pre-installed tools and runtimes                           │
│  ✅ MCP protocol support                                        │
│  ✅ Scale automatically                                         │
│                                                                 │
│  Your AI Agent → AgentBay API → Secure Sandbox → Results       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Key Features

### 1. 🔒 Secure Isolated Environments

Each task runs in its own isolated sandbox:
- Network isolation
- Filesystem isolation
- Process isolation
- Resource limits

### 2. ⚡ Serverless Execution

No infrastructure to manage:
- Start environments in seconds
- Auto-scale based on demand
- Pay per execution time
- Zero idle costs

### 3. 🛠️ Pre-configured Tooling

Ready-to-use development environments:
- Python (multiple versions)
- Node.js
- Browser automation (Playwright, Puppeteer)
- Common CLI tools
- Package managers (pip, npm, etc.)

### 4. 🔌 MCP Protocol Support

Native Model Context Protocol integration:
- Standardized tool interface
- Compatible with OpenClaw ecosystem
- Works with Claude, GPT, and other LLMs

### 5. 📁 Persistent Workspace

Optional persistent storage:
- Keep files between sessions
- Share data across tasks
- Export results easily

---

## Architecture

### System Overview

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Your Application                                │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │  AI Agent (OpenClaw, CoPaw, Custom)                             │  │
│  │  ┌─────────────────────────────────────────────────────────┐   │  │
│  │  │  LLM Brain (Claude, GPT, Qwen)                          │   │  │
│  │  │         │                                                │   │  │
│  │  │         │ "Execute this Python script"                   │   │  │
│  │  │         ▼                                                │   │  │
│  │  │  MCP Client                                              │   │  │
│  │  └──────────┼──────────────────────────────────────────────┘   │  │
│  └─────────────┼───────────────────────────────────────────────────┘  │
└────────────────┼───────────────────────────────────────────────────────┘
                 │
                 │ MCP Protocol
                 │
                 ▼
┌────────────────────────────────────────────────────────────────────────┐
│                    Wuying AgentBay Platform                            │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │                    MCP Server Gateway                           │  │
│  │  • Authentication (API Key)                                     │  │
│  │  • Rate limiting                                                │  │
│  │  • Request routing                                              │  │
│  └───────────────────────────┬─────────────────────────────────────┘  │
│                              │                                         │
│  ┌───────────────────────────▼─────────────────────────────────────┐  │
│  │                   Sandbox Orchestrator                          │  │
│  │  • Environment provisioning                                     │  │
│  │  • Resource management                                          │  │
│  │  • Session handling                                             │  │
│  └───────────────────────────┬─────────────────────────────────────┘  │
│                              │                                         │
│         ┌────────────────────┼────────────────────┐                   │
│         │                    │                    │                   │
│         ▼                    ▼                    ▼                   │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐             │
│  │  Sandbox 1  │     │  Sandbox 2  │     │  Sandbox N  │             │
│  │  ─────────  │     │  ─────────  │     │  ─────────  │             │
│  │  Python     │     │  Node.js    │     │  Browser    │             │
│  │  Task A     │     │  Task B     │     │  Task C     │             │
│  │  [isolated] │     │  [isolated] │     │  [isolated] │             │
│  └─────────────┘     └─────────────┘     └─────────────┘             │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

### Sandbox Specifications

| Resource | Default | Max |
|----------|---------|-----|
| **CPU** | 2 vCPU | 8 vCPU |
| **Memory** | 4 GB | 32 GB |
| **Disk** | 10 GB | 100 GB |
| **Network** | Outbound allowed | Configurable |
| **Timeout** | 5 minutes | 60 minutes |

### Pre-installed Environments

| Environment | Versions | Tools |
|-------------|----------|-------|
| **Python** | 3.9, 3.10, 3.11, 3.12 | pip, virtualenv, poetry |
| **Node.js** | 18, 20, 22 | npm, yarn, pnpm |
| **Browser** | Chrome, Firefox | Playwright, Puppeteer, Selenium |
| **System** | Ubuntu 22.04 | git, curl, wget, jq, etc. |

---

## MCP Integration

### What is MCP?

**Model Context Protocol (MCP)** is a standardized protocol for AI models to interact with external tools. Think of it as a "universal adapter" for AI tools.

```
┌─────────────────────────────────────────────────────────────────┐
│                    MCP Concept                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Before MCP:                                                    │
│  ┌───────┐    Custom API     ┌──────┐                          │
│  │  LLM  │ ───────────────►  │ Tool │  (Every tool different)  │
│  └───────┘                   └──────┘                          │
│                                                                 │
│  With MCP:                                                      │
│  ┌───────┐    MCP Protocol   ┌──────────────┐                  │
│  │  LLM  │ ───────────────►  │ MCP Server   │                  │
│  └───────┘                   │ (AgentBay)   │                  │
│                              │              │                   │
│                              │ ┌──────────┐ │                   │
│                              │ │Tool A    │ │                   │
│                              │ │Tool B    │ │ (Standard format) │
│                              │ │Tool C    │ │                   │
│                              │ └──────────┘ │                   │
│                              └──────────────┘                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### AgentBay MCP Server

AgentBay provides an MCP-compatible server with these tools:

| Tool | Description | Parameters |
|------|-------------|------------|
| `execute_shell` | Run shell commands | `command`, `timeout` |
| `execute_python` | Run Python code | `code`, `packages` |
| `execute_nodejs` | Run Node.js code | `code`, `packages` |
| `browse_web` | Automated browsing | `url`, `actions` |
| `file_read` | Read file contents | `path` |
| `file_write` | Write to files | `path`, `content` |
| `file_list` | List directory | `path`, `pattern` |

### MCP Server Configuration

```json
{
  "mcpServers": {
    "agentbay": {
      "command": "npx",
      "args": ["@agentbay/mcp-server"],
      "env": {
        "AGENTBAY_API_KEY": "your-api-key"
      }
    }
  }
}
```

---

## Use Cases

### 1. Code Execution for AI Agents

```python
# AI Agent wants to analyze data

# Without AgentBay:
# User needs to set up Python environment, install packages, etc.

# With AgentBay:
response = agentbay.execute_python(
    code="""
import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv('data.csv')
summary = df.describe()
print(summary)
""",
    packages=["pandas", "matplotlib"]
)
```

### 2. Web Automation

```python
# Scrape information from a website
response = agentbay.browse_web(
    url="https://example.com/products",
    actions=[
        {"type": "wait", "selector": ".product-list"},
        {"type": "extract", "selector": ".product-item", "fields": ["name", "price"]}
    ]
)
```

### 3. Document Processing

```python
# Convert and process documents
response = agentbay.execute_shell(
    command="pandoc input.docx -o output.pdf"
)
```

### 4. CI/CD Integration

```python
# Run tests in isolated environment
response = agentbay.execute_shell(
    command="""
git clone https://github.com/user/repo
cd repo
npm install
npm test
""",
    timeout=300
)
```

### 5. Research Automation

```python
# Download and process papers
response = agentbay.execute_python(
    code="""
import requests
import PyPDF2

# Download paper
url = "https://arxiv.org/pdf/2401.12345"
response = requests.get(url)
with open("paper.pdf", "wb") as f:
    f.write(response.content)

# Extract text
with open("paper.pdf", "rb") as f:
    reader = PyPDF2.PdfReader(f)
    text = reader.pages[0].extract_text()
    print(text[:1000])
""",
    packages=["requests", "PyPDF2"]
)
```

---

## Getting Started

### Step 1: Get API Key

1. Visit [Alibaba Cloud Console](https://www.alibabacloud.com/console)
2. Navigate to Wuying AgentBay service
3. Create an API key

### Step 2: Install SDK

**Python:**
```bash
pip install wuying-agentbay-sdk
```

**Node.js:**
```bash
npm install @agentbay/sdk
```

### Step 3: Basic Usage

**Python:**
```python
from agentbay import AgentBay

# Initialize client
client = AgentBay(api_key="your-api-key")

# Execute Python code
result = client.execute_python(
    code="print('Hello from AgentBay!')"
)
print(result.output)

# Execute shell command
result = client.execute_shell(
    command="ls -la"
)
print(result.output)
```

**Node.js:**
```javascript
const { AgentBay } = require('@agentbay/sdk');

const client = new AgentBay({ apiKey: 'your-api-key' });

// Execute Node.js code
const result = await client.executeNode({
  code: "console.log('Hello from AgentBay!')"
});
console.log(result.output);
```

---

## SDK Reference

### Python SDK

```python
from agentbay import AgentBay, Sandbox

class AgentBay:
    def __init__(self, api_key: str, region: str = "cn-hangzhou"):
        """Initialize AgentBay client"""
        
    def execute_python(
        self,
        code: str,
        packages: List[str] = None,
        timeout: int = 300,
        env: Dict[str, str] = None
    ) -> ExecutionResult:
        """Execute Python code in sandbox"""
        
    def execute_shell(
        self,
        command: str,
        timeout: int = 300,
        working_dir: str = "/workspace"
    ) -> ExecutionResult:
        """Execute shell command in sandbox"""
        
    def create_sandbox(
        self,
        image: str = "default",
        resources: ResourceConfig = None
    ) -> Sandbox:
        """Create a persistent sandbox session"""
        
    def browse(
        self,
        url: str,
        actions: List[BrowserAction] = None
    ) -> BrowseResult:
        """Automated web browsing"""

class ExecutionResult:
    output: str           # stdout
    error: str            # stderr
    exit_code: int        # 0 = success
    files: List[str]      # created files
    duration: float       # execution time
```

### Error Handling

```python
from agentbay import AgentBay, AgentBayError, TimeoutError, QuotaError

try:
    result = client.execute_python(code="...")
except TimeoutError:
    print("Execution timed out")
except QuotaError:
    print("API quota exceeded")
except AgentBayError as e:
    print(f"AgentBay error: {e}")
```

---

## Security & Compliance

### Isolation Guarantees

| Layer | Protection |
|-------|------------|
| **Network** | Isolated VPC per sandbox |
| **Process** | Container-level isolation |
| **Filesystem** | Ephemeral, encrypted storage |
| **Memory** | Wiped after session |

### Data Handling

- **No data retention**: Sandbox data deleted after session
- **Encryption**: Data encrypted at rest and in transit
- **Audit logs**: All operations logged
- **Compliance**: SOC 2, ISO 27001 (Alibaba Cloud)

### Access Control

```python
# Restrict network access
client.execute_shell(
    command="curl https://example.com",
    network_policy={
        "allow": ["example.com"],
        "deny": ["*"]  # Block everything else
    }
)
```

---

## Pricing

### Pay-As-You-Go

| Resource | Price |
|----------|-------|
| **Compute** | ¥0.05/vCPU-minute |
| **Memory** | ¥0.02/GB-minute |
| **Storage** | ¥0.001/GB-minute |
| **Network** | ¥0.01/GB transferred |

### Example Costs

| Task | Duration | Cost |
|------|----------|------|
| Python script (5 min) | 5 min × 2 vCPU | ~¥0.50 |
| Web scraping (10 min) | 10 min × 4 GB | ~¥2.00 |
| Full build (30 min) | 30 min × 4 vCPU | ~¥6.00 |

### Free Tier

- 1,000 minutes/month of basic compute
- 10 GB storage
- Limited to 2 vCPU, 4 GB RAM

---

## Comparison with Alternatives

| Feature | AgentBay | E2B | Modal | Replit |
|---------|----------|-----|-------|--------|
| **MCP Support** | ✅ Native | ✅ | ❌ | ❌ |
| **China Optimized** | ✅ | ❌ | ❌ | ❌ |
| **Browser Automation** | ✅ | ✅ | Limited | Limited |
| **Persistent Sessions** | ✅ | ✅ | ✅ | ✅ |
| **GPU Support** | Coming | ✅ | ✅ | ✅ |
| **Custom Images** | ✅ | ✅ | ✅ | Limited |
| **Enterprise Features** | ✅ | ✅ | ✅ | Limited |

### When to Choose AgentBay

✅ You're building for Chinese market  
✅ You need MCP protocol support  
✅ You're using Alibaba Cloud ecosystem  
✅ You need Alibaba Cloud compliance  
✅ You want integration with CoPaw/OpenClaw

---

## Integration with OpenClaw Ecosystem

### CoPaw Integration

CoPaw can use AgentBay for cloud execution:

```python
# In CoPaw config
{
  "execution": {
    "backend": "agentbay",
    "api_key": "your-key",
    "default_timeout": 300
  }
}
```

### OpenClaw Skills

Skills can leverage AgentBay for heavy computation:

```markdown
# SKILL.md - Heavy Data Processing

When user asks to process large datasets:
1. Upload data to AgentBay
2. Execute processing script
3. Download results
4. Present summary to user
```

---

## Resources

- **Documentation**: [help.aliyun.com/agentbay](https://help.aliyun.com/agentbay)
- **SDK (Python)**: [pypi.org/project/wuying-agentbay-sdk](https://pypi.org/project/wuying-agentbay-sdk)
- **SDK (GitHub)**: [github.com/agentbay-ai/wuying-agentbay-sdk](https://github.com/agentbay-ai/wuying-agentbay-sdk)
- **MCP Server**: [mcpservers.org/servers/Michael98671/agentbay](https://mcpservers.org/servers/Michael98671/agentbay)
- **Support**: Alibaba Cloud Support Console

---

*Last Updated: March 2026*

## Related

- [[15_智能体/07_Agent_Evaluation/Agent_Harness_Complete_2026.md|Agent_Harness_Complete_2026]]
- [[15_智能体/07_Agent_Evaluation/Agent_Red_Teaming_2026.md|Agent_Red_Teaming_2026]]
- [[15_智能体/07_Agent_Evaluation/Assessment/Evaluation_Workflow.md|Evaluation_Workflow]]
- [[15_智能体/07_Agent_Evaluation/Assessment/Production_Assessment.md|Production_Assessment]]
- [[15_智能体/07_Agent_Evaluation/Benchmarking/Benchmarking_Criteria.md|Benchmarking_Criteria]]
