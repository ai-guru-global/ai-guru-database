---
title: "Skills & ClawHub: The OpenClaw Skill Ecosystem"
category: "13-agent-production-23-openclaw-ecosystem"
tags: ["ai-agents", "agent-framework", "production", "langgraph"]
summary: "**Skills** are the extensible capability modules that transform OpenClaw agents from simple chatbots into powerful task executors. **ClawHub** is the official marketplace for disco"
created: "2026-05-31"
updated: "2026-05-31"
---

# Skills & ClawHub: The OpenClaw Skill Ecosystem

## Overview

**Skills** are the extensible capability modules that transform OpenClaw agents from simple chatbots into powerful task executors. **ClawHub** is the official marketplace for discovering, sharing, and installing these skills.

Think of Skills as "apps for your AI agent" — they teach the AI how to perform specific tasks, from organizing files to writing code to conducting research.

**ClawHub**: [github.com/openclaw/clawhub](https://github.com/openclaw/clawhub) 
**SkillHub (China)**: [skillhub.tencent.com](https://skillhub.tencent.com/) 
**Total Skills**: 22,000+ (as of March 2026)

---

## Table of Contents

1. [Understanding Skills](#understanding-skills)
2. [Skill Architecture](#skill-architecture)
3. [ClawHub Marketplace](#clawhub-marketplace)
4. [SkillHub (China Mirror)](#skillhub-china-mirror)
5. [Top Skills Directory](#top-skills-directory)
6. [Installing Skills](#installing-skills)
7. [Creating Custom Skills](#creating-custom-skills)
8. [Skill Security](#skill-security)
9. [Enterprise Skills](#enterprise-skills)
10. [Best Practices](#best-practices)

---

## Understanding Skills

### What Are Skills?

Skills are instruction packages that extend AI agent capabilities:

```
┌─────────────────────────────────────────────────────────────────┐
│                    Before Skills                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  User: "Help me organize my files"                              │
│                                                                 │
│  AI: "Sure! Here's how you can organize files:                  │
│       1. Create folders by category                             │
│       2. Move files manually..."                                │
│                                                                 │
│  ❌ AI can only ADVISE, not ACT                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    With Skills                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  User: "Help me organize my files"                              │
│                                                                 │
│  AI (with file-organizer skill):                                │
│       [Scans ~/Documents]                                       │
│       [Creates folders: Work, Personal, Finance]                │
│       [Moves 150 files to appropriate folders]                  │
│       "Done! I've organized 150 files into 3 categories."       │
│                                                                 │
│  ✅ AI can actually DO things                                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### The Skill Equation

```
Skill = Instructions + Tools + Knowledge

Instructions: Natural language guide for the AI
Tools: Code to execute actions (optional)
Knowledge: Domain expertise (optional)
```

---

## Skill Architecture

### Basic Skill Structure

```
skill-name/
├── SKILL.md              # Required: Instructions for AI
├── skill.py              # Optional: Python tools
├── tools/                # Optional: Additional tools
│   ├── tool1.py
│   └── tool2.py
├── prompts/              # Optional: Prompt templates
│   └── template.md
├── requirements.txt      # Optional: Python dependencies
├── package.json          # Optional: Node.js dependencies
├── config.yaml           # Optional: Configuration
└── README.md             # Optional: Human documentation
```

### SKILL.md Format

The `SKILL.md` file is the heart of every skill. It's written in natural language for the AI to understand:

```markdown
# File Organizer

## Purpose
You are a file organization assistant that helps users 
clean up and organize their files and folders.

## Capabilities
- Scan directories for files
- Categorize files by type, date, or content
- Create organized folder structures
- Move files to appropriate locations
- Generate organization reports

## When to Use
Use this skill when the user asks to:
- "Organize my files"
- "Clean up my desktop"
- "Sort my downloads"
- "Arrange documents by project"

## Process
1. Ask user which directory to organize (default: ~/Downloads)
2. Scan the directory for all files
3. Categorize files into groups:
   - Documents (pdf, doc, docx, txt)
   - Images (jpg, png, gif, svg)
   - Code (py, js, html, css)
   - Archives (zip, tar, gz)
   - Other
4. Create folders for each category
5. Move files to appropriate folders
6. Report results to user

## Important Rules
- ALWAYS ask for confirmation before moving files
- NEVER delete files without explicit permission
- Skip system files and hidden files
- Preserve original file names

## Example Interaction
User: "Please organize my Downloads folder"
Assistant: "I'll organize your Downloads folder. Let me scan it first..."
[Scans folder]
"I found 47 files. Here's my plan:
- 15 PDFs → Documents/
- 20 images → Images/
- 8 code files → Code/
- 4 others → Other/

Should I proceed?"
```

### Tools (skill.py)

Optional Python code for advanced functionality:

```python
# skill.py
import os
import shutil
from pathlib import Path
from typing import List, Dict

def scan_directory(path: str) -> Dict[str, List[str]]:
    """Scan directory and categorize files."""
    categories = {
        'documents': [],
        'images': [],
        'code': [],
        'archives': [],
        'other': []
    }
    
    extensions = {
        'documents': ['.pdf', '.doc', '.docx', '.txt', '.md'],
        'images': ['.jpg', '.jpeg', '.png', '.gif', '.svg'],
        'code': ['.py', '.js', '.html', '.css', '.java'],
        'archives': ['.zip', '.tar', '.gz', '.rar']
    }
    
    for file in Path(path).iterdir():
        if file.is_file() and not file.name.startswith('.'):
            ext = file.suffix.lower()
            categorized = False
            for category, exts in extensions.items():
                if ext in exts:
                    categories[category].append(str(file))
                    categorized = True
                    break
            if not categorized:
                categories['other'].append(str(file))
    
    return categories

def organize_files(path: str, categories: Dict[str, List[str]]) -> Dict[str, int]:
    """Move files to category folders."""
    results = {}
    for category, files in categories.items():
        if files:
            category_path = Path(path) / category.title()
            category_path.mkdir(exist_ok=True)
            for file in files:
                shutil.move(file, category_path / Path(file).name)
            results[category] = len(files)
    return results
```

---

## ClawHub Marketplace

### About ClawHub

ClawHub is the official public skill registry for the OpenClaw ecosystem:

| Metric | Value |
|--------|-------|
| **Total Skills** | 3,500+ |
| **Contributors** | 2,000+ |
| **Categories** | 25+ |
| **Downloads/Month** | 1M+ |

### Categories

| Category | Skills | Popular |
|----------|--------|---------|
| **Productivity** | 450+ | file-organizer, meeting-scheduler |
| **Development** | 600+ | code-helper, git-assistant |
| **Communication** | 300+ | email-assistant, translator |
| **Research** | 250+ | web-researcher, paper-analyzer |
| **Data** | 400+ | data-analyzer, csv-processor |
| **Creative** | 200+ | writing-assistant, image-generator |
| **System** | 350+ | shell-executor, process-manager |
| **Web** | 500+ | web-scraper, api-caller |
| **Finance** | 150+ | expense-tracker, invoice-processor |
| **Health** | 100+ | habit-tracker, workout-planner |

### Browsing Skills

**Via Web:**
1. Visit [clawhub.io](https://clawhub.io) (community portal)
2. Browse categories or search
3. View skill details, ratings, reviews
4. Copy install command

**Via CLI:**
```bash
# Search skills
openclaw skill search "file organizer"

# View skill details
openclaw skill info file-organizer

# List popular skills
openclaw skill popular --limit 20
```

### Skill Metadata

Each skill includes metadata in `clawhub.yaml`:

```yaml
name: file-organizer
version: 2.1.0
author: openclawdev
description: Intelligent file organization and cleanup
category: productivity
tags:
  - files
  - organization
  - cleanup
  - automation
license: MIT
homepage: https://github.com/openclawdev/file-organizer
compatibility:
  openclaw: ">=1.0.0"
  copaw: ">=0.0.5"
  qclaw: true
dependencies:
  - python>=3.10
stats:
  downloads: 50000
  rating: 4.8
  reviews: 230
```

---

## SkillHub (China Mirror)

### About SkillHub

**SkillHub** is Tencent's China-optimized mirror of ClawHub:

**Website**: [skillhub.tencent.com](https://skillhub.tencent.com/)

| Feature | ClawHub | SkillHub |
|---------|---------|----------|
| **Location** | Global | China |
| **Skills** | 3,500+ | 22,000+ (includes local) |
| **Language** | English | Chinese |
| **Speed** | Standard | Optimized for China |
| **Curation** | Community | Official + Community |

### Why SkillHub?

- 🚀 **Faster Downloads**: CDN optimized for China network
- 🇨🇳 **Chinese Interface**: Native language support
- 🔒 **Security Audited**: Tencent security verification
- ⭐ **Curated Collections**: 50 officially recommended skills
- 🔄 **ClawHub Sync**: Full compatibility with global registry

### Featured Collections

| Collection | Description | Skills |
|------------|-------------|--------|
| **办公必备** | Essential office productivity | 50 |
| **开发者工具** | Developer tools | 100 |
| **学术研究** | Academic research | 40 |
| **新手推荐** | Beginner recommended | 30 |

---

## Top Skills Directory

### Productivity

| Skill | Description | Rating |
|-------|-------------|--------|
| **file-organizer** | Intelligent file sorting | ⭐ 4.8 |
| **meeting-scheduler** | Cross-calendar scheduling | ⭐ 4.7 |
| **todo-manager** | Task tracking and reminders | ⭐ 4.6 |
| **note-taker** | Meeting notes and summaries | ⭐ 4.5 |
| **email-assistant** | Email drafting and management | ⭐ 4.8 |

### Development

| Skill | Description | Rating |
|-------|-------------|--------|
| **code-helper** | Code generation and debugging | ⭐ 4.9 |
| **git-assistant** | Git operations and PR reviews | ⭐ 4.7 |
| **api-tester** | API testing and documentation | ⭐ 4.5 |
| **db-query** | Database query assistance | ⭐ 4.4 |
| **docker-helper** | Container management | ⭐ 4.6 |

### Research

| Skill | Description | Rating |
|-------|-------------|--------|
| **web-researcher** | Multi-source web research | ⭐ 4.8 |
| **paper-analyzer** | Academic paper summarization | ⭐ 4.7 |
| **citation-manager** | Reference management | ⭐ 4.5 |
| **arxiv-tracker** | ArXiv paper monitoring | ⭐ 4.6 |
| **data-analyzer** | Dataset analysis | ⭐ 4.7 |

### Communication

| Skill | Description | Rating |
|-------|-------------|--------|
| **translator** | Multi-language translation | ⭐ 4.8 |
| **email-writer** | Professional email drafting | ⭐ 4.6 |
| **social-manager** | Social media scheduling | ⭐ 4.4 |
| **reply-generator** | Quick response generation | ⭐ 4.5 |

---

## Installing Skills

### Method 1: CLI (Recommended)

```bash
# Install single skill
openclaw skill install file-organizer

# Install specific version
openclaw skill install file-organizer@2.1.0

# Install multiple skills
openclaw skill install file-organizer email-assistant web-researcher

# Install from GitHub
openclaw skill install github:username/skill-repo

# Update skill
openclaw skill update file-organizer

# Remove skill
openclaw skill remove file-organizer
```

### Method 2: Chat Command

```
You: 安装 file-organizer 技能
AI: 🔍 正在查找 file-organizer...
    ✅ 已安装 file-organizer v2.1.0
    
    现在你可以让我帮你整理文件了！
```

### Method 3: Workspace Copy

```bash
# Manual installation
git clone https://github.com/openclawdev/file-organizer
mv file-organizer ~/.openclaw/skills/
```

### Method 4: Config File

```yaml
# ~/.openclaw/config.yaml
skills:
  auto_install:
    - file-organizer
    - email-assistant
    - code-helper
  sources:
    - clawhub
    - github
```

---

## Creating Custom Skills

### Step 1: Create Skill Directory

```bash
mkdir my-skill
cd my-skill
```

### Step 2: Write SKILL.md

```markdown
# My Custom Skill

## Purpose
Describe what your skill does.

## Capabilities
- Capability 1
- Capability 2

## When to Use
When user asks about...

## Process
1. Step one
2. Step two
3. Step three

## Rules
- Important rule 1
- Important rule 2
```

### Step 3: Add Tools (Optional)

```python
# skill.py
def my_tool_function(param1: str, param2: int) -> str:
    """Tool description for AI."""
    # Implementation
    return result
```

### Step 4: Test Locally

```bash
# Test with OpenClaw
openclaw skill test ./my-skill

# Or add to workspace
cp -r my-skill ~/.openclaw/skills/
```

### Step 5: Publish to ClawHub

```bash
# Initialize for publishing
openclaw skill init

# Validate skill
openclaw skill validate

# Publish
openclaw skill publish
```

### Skill Development Tips

1. **Clear Instructions**: Write SKILL.md as if explaining to a new employee
2. **Edge Cases**: Cover what to do when things go wrong
3. **Examples**: Include concrete examples in SKILL.md
4. **Testing**: Test with various prompts before publishing
5. **Versioning**: Use semantic versioning (major.minor.patch)

---

## Skill Security

### VirusTotal Integration

Before installing, scan skills for security:

```bash
# Security audit
openclaw skill audit web-researcher

# Output:
# ✅ No malware detected (VirusTotal: 0/72)
# ✅ No suspicious network calls
# ✅ No dangerous file operations
# ⚠️ Requires network access (expected for web skill)
```

### Permission Levels

| Level | Description | Example Skills |
|-------|-------------|----------------|
| **Read-only** | Can read files, no modifications | paper-analyzer |
| **Create** | Can create new files | note-taker |
| **Modify** | Can modify existing files | file-organizer |
| **Execute** | Can run shell commands | git-assistant |
| **Network** | Can make network requests | web-researcher |

### Reviewing Skill Code

Always review skills before installing:

```bash
# View skill source
openclaw skill show web-researcher

# View specific file
openclaw skill show web-researcher --file skill.py
```

### Sandboxing

Skills can be sandboxed for safety:

```yaml
# skill config
sandbox:
  enabled: true
  network: restricted  # or: allowed, blocked
  filesystem: 
    read: [~/Documents]
    write: [~/.openclaw/output]
  timeout: 60
```

---

## Enterprise Skills

### Private Skill Registries

Organizations can host private skill registries:

```yaml
# Enterprise config
skill_registries:
  - name: company-registry
    url: https://skills.company.com
    auth: 
      type: oauth2
      client_id: xxx
```

### Skill Governance

| Feature | Description |
|---------|-------------|
| **Approval Workflow** | Skills require admin approval |
| **Version Control** | Lock skills to specific versions |
| **Audit Logging** | Track skill usage across org |
| **Access Control** | Restrict skills by team/role |

### Compliance Features

- **Data Residency**: Skills can be restricted by region
- **PII Detection**: Automatic scanning for sensitive data
- **Audit Trail**: Complete history of skill executions
- **Reporting**: Usage and compliance reports

---

## Best Practices

### For Skill Users

1. **Start with Curated**: Begin with officially recommended skills
2. **Read Reviews**: Check ratings and user feedback
3. **Audit First**: Security scan before installing
4. **Limit Permissions**: Grant minimum necessary access
5. **Update Regularly**: Keep skills updated for security fixes

### For Skill Developers

1. **Clear Documentation**: Write comprehensive SKILL.md
2. **Error Handling**: Handle failures gracefully
3. **Security First**: Never store credentials in skills
4. **Test Thoroughly**: Test with edge cases
5. **Semantic Versioning**: Follow semver for updates
6. **Responsive Maintenance**: Address issues promptly

### Common Patterns

**Confirmation Pattern:**
```markdown
## Before Destructive Actions
ALWAYS ask for confirmation before:
- Deleting files
- Sending emails
- Making purchases
- Modifying system settings
```

**Fallback Pattern:**
```markdown
## When Things Go Wrong
If the primary method fails:
1. Try alternative approach
2. Report the issue to user
3. Suggest manual steps if needed
```

**Progress Pattern:**
```markdown
## Long Operations
For tasks taking more than 10 seconds:
1. Inform user that task is starting
2. Provide progress updates
3. Confirm completion with summary
```

---

## Resources

### Official Links

- **ClawHub Registry**: [github.com/openclaw/clawhub](https://github.com/openclaw/clawhub)
- **SkillHub (China)**: [skillhub.tencent.com](https://skillhub.tencent.com/)
- **Skill Development Guide**: [docs.openclaw.dev/skills](https://docs.openclaw.dev/skills)

### Community

- **Discord**: OpenClaw Developers channel
- **GitHub Discussions**: Skill development Q&A
- **Skill Showcase**: Weekly community highlights

### Tools

- **Skill CLI**: `pip install openclaw-skill-cli`
- **Skill Template**: `openclaw skill create --template`
- **Skill Validator**: `openclaw skill validate`

---

*Last Updated: March 2026*

## Related

- [[15_Agent_Production/Agent_Evaluation/Agent_Harness_Complete_2026.md|Agent_Harness_Complete_2026]]
- [[15_Agent_Production/Agent_Evaluation/Agent_Red_Teaming_2026.md|Agent_Red_Teaming_2026]]
- [[15_Agent_Production/Agent_Evaluation/Assessment/Evaluation_Workflow.md|Evaluation_Workflow]]
- [[15_Agent_Production/Agent_Evaluation/Assessment/Production_Assessment.md|Production_Assessment]]
- [[15_Agent_Production/Agent_Evaluation/Benchmarking/Benchmarking_Criteria.md|Benchmarking_Criteria]]
