---
title: "Agent 评测基准 (Agent Benchmarks: SWE-bench / GAIA / WebArena / OSWorld / ARC-AGI / HLE)"
category: concepts
tags:
  - agent
  - benchmark
  - swe-bench
  - gaia
  - webarena
  - osworld
  - arc-agi
  - hle
  - evaluation
  - llm
aliases:
  - Agent Benchmarks
  - SWE-bench Verified
  - GAIA
  - WebArena
  - OSWorld
  - ARC-AGI
  - HLE
  - Humanity's Last Exam
  - Agent Evaluation
relationships:
  - target: "概念/agent-architectures"
    type: related_to
  - target: "概念/llm-benchmarks"
    type: related_to
  - target: "概念/reasoning-models"
    type: related_to
  - target: "概念/llm-as-judge"
    type: related_to
  - target: "概念/multimodal-llm"
    type: related_to
summary: "Agent 评测基准六大金刚:SWE-bench(代码修复 500 题)、GAIA(真实世界助手 466 题)、WebArena(网页浏览 812 题)、OSWorld(真实 OS 369 任务)、ARC-AGI(抽象推理 1000+ 题)、HLE(Humanity's Last Exam 2500 题)。覆盖 6 大核心能力,2024-2025 共同把 Agent 评估从'刷榜'推向'工程化'。"
lifecycle: reviewed
tier: core
created: 2026-07-23
updated: 2026-07-23
sources: []
---

# Agent 评测基准:六大金刚

> **一句话理解**: 2024-2026 形成的"Agent 评测六边形"——SWE-bench(代码)、GAIA(工具)、WebArena(网页)、OSWorld(OS)、ARC-AGI(推理)、HLE(人类知识),任何 Agent 发布都要先打这 6 个关卡。

---

## 一、为什么需要 Agent 评测基准?

| 阶段 | 时间 | 痛点 |
|---|---|---|
| **2023 之前** | MMLU / HumanEval | 答答题、做算法题,无法测"真干活" |
| **2023-2024** | SWE-bench / GAIA / WebArena | 真实任务(代码、工具、网页) |
| **2024-2025** | OSWorld / ARC-AGI | 真实 OS / 抽象推理 |
| **2025-2026** | HLE / SWE-bench Live | 人类水平 + 持续更新 |

**核心范式转变**:从"知识回忆"→"工具使用"→"环境执行"→"持续学习"。

---

## 二、SWE-bench(代码修复)

### 2.1 概况

| 维度 | 信息 |
|---|---|
| **首发** | 2023-10,Princeton NLP |
| **数据集** | 12 个 Python 仓库 / 2,294 Issue-PR 对 |
| **官方版** | SWE-bench Verified(OpenAI 合作,500 人工审核样本) |
| **多语言版** | SWE-bench Multilingual(9 种语言,300 任务) |
| **多模态版** | SWE-bench Multimodal(517 含视觉任务) |
| **Lite 版** | 300 任务(轻量) |
| **配套** | SWE-agent、SWE-ReX、SWE-bench CLI、mini-SWE-agent |

### 2.2 核心机制

```
输入:GitHub Issue 描述 + 完整代码库
     ↓
Agent 定位文件 → 编辑代码 → 运行测试
     ↓
PASS: FAIL_TO_PASS(问题已修)+ PASS_TO_PASS(没破坏现有功能)
```

### 2.3 关键成绩(2025-2026)

| 模型 / 框架 | SWE-bench Verified | 时间 |
|---|---|---|
| **Trae 国际版(火山引擎)** | **70.6%** | 2025-07(Claude 4 发布前夕第一) |
| Claude 4 + Tools | 较高 | 2025 |
| Claude 3.7 Sonnet | 60.6-62.6% | 2025 |
| OpenAI o4 mini | 54.4-55.8% | 2025 |
| Gemini 2.5 Pro | 52.4-55% | 2025 |
| GPT-4o + Agentless | 33.2% | 2024 |
| 人类软件工程师 | 100% | 基线 |

### 2.4 核心洞察

- **检索策略比模型更重要**:同样 Claude 3.7,不同 Agent 框架分数差 5-10%
- **多采样 + 选择器**:Trae 的 70.6% 来自"3-4 候选 + 语法投票 + 选择器"组合
- **小模型也能赢**:mini-SWE-agent 用 100 行 Python + 65% 分数
- **Docker 化是分水岭**:OpenAI × SWE-bench 容器化评估后,Agentless 分数翻倍

### 2.5 数据集结构

```json
{
  "instance_id": "django__django-16343",
  "repo": "django/django",
  "base_commit": "abc123",
  "patch": "修复 PR 的 diff(去测试)",
  "test_patch": "测试 diff",
  "problem_statement": "问题描述",
  "version": "Django 4.2",
  "FAIL_TO_PASS": ["test_x.py::test_y"],
  "PASS_TO_PASS": ["test_a.py::test_b"]
}
```

---

## 三、GAIA(通用 AI 助手)

### 3.1 概况

| 维度 | 信息 |
|---|---|
| **首发** | 2023-11,Meta + HuggingFace + AutoGPT |
| **数据集** | 466 个真实世界问题(166 公开 + 300 保留) |
| **难度** | 3 级(Level 1 ≤ 5 步,Level 2 5-10 步,Level 3 任意步) |
| **能力** | 推理 + 多模态 + 网页浏览 + 工具使用 |

### 3.2 核心设计

```
问题对人类简单(92% 通过率),对 AI 困难
     ↓
设计原则:
  ✓ 概念上简单(LLM 专注基本能力)
  ✓ 可解释(任务易懂)
  ✓ 对记忆鲁棒(不靠数据污染刷分)
  ✓ 易于使用(zero-shot)
     ↓
评估:答案唯一简短,自动匹配 ground truth
```

### 3.3 关键成绩

| 模型 / 框架 | GAIA 整体 | L1 / L2 / L3 |
|---|---|---|
| **Manus(中国,2025-03)** | 超越 OpenAI DeepResearch | 全部难度第一 |
| GPT-4 + 插件(2023) | 15% | 较高 / 低 / 0 |
| AutoGPT(2023) | 较低 | 极低 |
| 人类(2023) | 92% | 98% / 92% / 85% |
| GPT-4 + 自定义工具(2025) | 70-80% | 较高 |

### 3.4 GAIA 2(2026 ICLR)

**动态环境版**:
- 环境独立于 AI 行动变化(异步)
- ARE 平台 + 12 个手机应用 + 1,120 场景
- 七大能力:执行 / 搜索 / 模糊处理 / 适应性 / 时间感知 / 多智能体 / 抗噪声
- **关键发现**:GPT-5 高配 **42%**,Claude-4 Sonnet 35%,Kimi-K2 21%(开源第一)

---

## 四、WebArena(网页浏览)

### 4.1 概况

| 维度 | 信息 |
|---|---|
| **首发** | 2023 NeurIPS 2024(口头报告) |
| **环境** | 4 个真实网站(电商、社交、企业软件、Reddit)+ 6 个垂直站点 |
| **任务** | 812 个真实网页任务 |

### 4.2 WebArena-x 全家桶

| 项目 | 年份 | 说明 |
|---|---|---|
| **WebArena** | NeurIPS 2024 | 真实网页环境基线 |
| **WebArena-Infinity** | 2025 | 持续可扩展评估 |
| **VisualWebArena** | ACL 2024 | 视觉版(图片理解) |
| **TheAgentCompany** | ICML 2025 | 模拟企业内部任务 |

### 4.3 应用价值

- 衡量 Agent 真实网页交互能力
- 测试跨网站任务规划
- 评估视觉理解(VisualWebArena)

---

## 五、OSWorld(操作系统)

### 5.1 概况

| 维度 | 信息 |
|---|---|
| **首发** | NeurIPS 2024 |
| **环境** | Ubuntu / Windows / macOS 真实 VM |
| **任务** | **369 个真实跨应用任务** |
| **设置** | VMware / VirtualBox / Docker(KVM) |

### 5.2 任务示例

```
任务 1:"在 LibreOffice Calc 中,将 A1:B10 区域转为图表并保存"
任务 2:"用 VS Code 打开 /home/user/test.py,运行后报错,修复"
任务 3:"在 Chrome 中打开 Gmail,找到 Bob 的最新邮件并转发给 Alice"
```

### 5.3 关键成绩

| 模型 | OSWorld 成功率 | 备注 |
|---|---|---|
| **人类** | **72.36%** | 基线 |
| 最佳模型(2024) | 12.24% | 差距巨大 |
| OpenCUA-32B(2025) | 38.1% | **开源 SOTA** |
| Claude-3 Opus | 较低(2024) | 闭源 |
| GPT-4V(截图) | 较低(2024) | 闭源 |

### 5.4 OpenCUA(2025 开源突破)

- 团队:港大 XLang Lab
- 数据:AgentNet 22,600 任务 / Windows+macOS+Ubuntu / 200+ 应用
- 关键:**带 CoT 推理**的训练数据,而非简单 state-action 对
- OpenCUA-32B 超越 OpenAI GPT-4o CUA,逼近 Claude 闭源

### 5.5 OSWorld-MCP(2025-10)

- 公平评估"GUI + MCP 工具"混合 Agent
- 反映真实产品架构(API-first,GUI-fallback)

---

## 六、ARC-AGI(抽象与推理语料库)

### 6.1 概况

| 维度 | 信息 |
|---|---|
| **首发** | 2019,François Chollet(Arc Prize) |
| **核心** | 测"真正的通用智能"而非模式识别 |
| **数据集** | ARC-AGI-1(1,000+ 谜题)+ ARC-AGI-2(更难) |
| **规则** | 简单:输入网格→输出网格,但需要"发现规则" |

### 6.2 历史成绩

| 模型 | ARC-AGI-1 | 时间 |
|---|---|---|
| **人类** | 76-98% | 基线 |
| GPT-4(早期) | 0% | 2023 |
| Claude 3 Opus | 较低 | 2024 |
| Claude 3.5 Sonnet | 较高 | 2024 |
| o1-preview | 21% | 2024 |
| o3 | **88%** | 2024-12 |
| Grok 4(2025) | 15-40% | 2025 |

### 6.3 设计哲学

- "人类容易、AI 难"(刻意保留)
- 测"流利智力"vs"晶体智力"
- 任意输入网格大小,程序性规则
- ARC-AGI-2 2024 发布,**极难**,通常 0-15%

### 6.4 2025 Arc Prize 突破

- 开放解决方案达到 69% on ARC-AGI-1(接近人类)
- 关键:CoT 推理 + 程序搜索

---

## 七、HLE(Humanity's Last Exam)

### 7.1 概况

| 维度 | 信息 |
|---|---|
| **首发** | 2025-01,Scale AI + Center for AI Safety |
| **数据集** | **2,500+ 题** |
| **设计** | 人类专家出题(教授 / PhD / 研究员) |
| **领域** | 数学 / 物理 / 生物 / 化学 / 法律 / 哲学 / 古典语言 |

### 7.2 设计目的

**为什么是"最后考试"**:测的是"人类专家级知识 + 推理",作为 AGI 的"圣杯难题"。

### 7.3 关键成绩

| 模型 | HLE 准确率 | 时间 |
|---|---|---|
| **GPT-5** | 较高(2025) | 2025 |
| **o3** | 26.6% | 2024-12 |
| **Gemini 2.5 Pro** | 21.6% | 2025 |
| **DeepSeek-R1** | 8.6% | 2025 |
| **人类专家** | 90%+ | 基线 |
| **GPT-4** | < 5% | 2023 |

### 7.4 与现有基准的差异

- 不靠"已知知识"
- 测"推理 + 跨学科整合"
- 单题价值高(>1 小时专家撰写)
- 抗污染(全部新题)

---

## 八、基准对比矩阵

| 维度 | SWE-bench | GAIA | WebArena | OSWorld | ARC-AGI | HLE |
|---|---|---|---|---|---|---|
| **核心能力** | 代码修复 | 工具使用 | 网页 | OS 操作 | 抽象推理 | 跨学科 |
| **题目数** | 500-2,294 | 466 | 812 | 369 | 1,000+ | 2,500+ |
| **环境** | Docker | 工具 | 真实网页 | 真实 OS | 网格 | 纯文本 |
| **人类基线** | 100% | 92% | 78% | 72% | 76-98% | 90%+ |
| **SOTA** | 70.6%(Trae) | 80%+(Manus) | 60%+(专有) | 38%(开源) | 88%(o3) | 27%(o3) |
| **评估方式** | 单元测试 | 答案匹配 | 状态检查 | 执行验证 | 网格匹配 | 答案匹配 |
| **难度** | 真实工程 | 真实任务 | 真实交互 | 真实 OS | 抽象逻辑 | 专家级 |
| **污染风险** | 中 | 中 | 低 | 极低 | 低 | 极低 |
| **可重现** | Docker | 自动 | Docker | VM | 公开 | 自动 |

---

## 九、生产 Agent 选型建议

### 9.1 不同任务场景的基准对照

```
代码任务 → SWE-bench Verified(500 题)
工具使用 → GAIA(466 题)
网页操作 → WebArena(812 题)
OS 操作 → OSWorld(369 题)
抽象推理 → ARC-AGI(1,000+)
专家知识 → HLE(2,500+)
```

### 9.2 评估流水线建议

```python
# 推荐的 Agent 评估流水线
def evaluate_agent(agent, models):
    results = {}
    # 1. 单元测试(必须)
    results['swe_bench'] = run_swe_bench(agent, model, 'verified')
    # 2. 工具使用(必须)
    results['gaia'] = run_gaia(agent, model)
    # 3. 视觉理解
    results['visual_web_arena'] = run_vwa(agent, model)
    # 4. OS 操作(可选)
    results['osworld'] = run_osworld(agent, model, vm='docker')
    # 5. 推理能力
    results['arc_agi'] = run_arc_agi(agent, model)
    # 6. 知识深度
    results['hle'] = run_hle(agent, model)
    return results
```

### 9.3 避坑指南

- ❌ **不要用静态测试集刷分**:SWE-bench Lite 已"被玩坏",用 SWE-bench Live
- ❌ **不要只跑 SOTA 模型**:基线模型(GPT-4o)对照也跑
- ❌ **不要忽略成本**:OSWorld 单次运行 $100-500,需预算控制
- ✅ **必须记录完整 trace**:决策回放用于失败分析
- ✅ **必须用最新版本**:SWE-bench Multimodal、ARC-AGI-2、HLE
- ✅ **必须 pass^k 评估**:τ-bench 揭示 pass@1 不可靠

---

## 十、关键人物与组织

| 人物 / 团队 | 角色 |
|---|---|
| **Carlos E. Jimenez**(Princeton) | SWE-bench 创始人 |
| **Princeton NLP** | SWE-bench 团队 |
| **Grégoire Mialon**(Meta) | GAIA 论文一作 |
| **Meta FAIR + HuggingFace + AutoGPT** | GAIA 联合发布 |
| **Xlang Lab,HKU** | WebArena + OSWorld 团队 |
| **Tianbao Xie**(HKU) | OSWorld 论文一作 |
| **François Chollet**(DeepMind) | ARC Prize 创始人 |
| **Mike Knoop**(Arc Prize) | Arc Prize 主办 |
| **Dan Hendrycks**(CAIS) | HLE 顾问 |
| **Scale AI** | HLE 数据来源 |

---

## 十一、技术细节深挖

### 11.1 SWE-bench Verified 改进

| 原始问题 | 改进 |
|---|---|
| 单元测试过严 | 93 位专业开发人员人工审核 |
| 问题描述不清 | 严重程度 0-3 分级,丢弃 2-3 级 |
| 环境难设置 | 容器化 Docker 评估 |
| 68% 样本被过滤 | 保留 500 高质量样本 |

### 11.2 GAIA 三层难度

```
Level 1:0-5 步 + 0-1 工具
  例:"2024 年奥运会举办国首都?"

Level 2:5-10 步 + 多个工具
  例:"NASA 2006-01-21 每日天文图中识别宇航员所属组别"

Level 3:任意步数 + 任意工具 + 真实世界
  例:"解析 PDF 财报并生成投资建议"
```

### 11.3 OSWorld Docker 化挑战

```
VMware → 性能最佳但非虚拟化平台难用
VirtualBox → macOS Apple Silicon 支持差
Docker + KVM → 服务器首选,需 /proc/cpuinfo 检查 vmx/svm
              → macOS 不支持 KVM
```

### 11.4 ARC-AGI 设计哲学

- 任意输入网格大小(测试泛化)
- 训练-测试分布偏移(避免记忆)
- 任务需要"概念重组"而非"模式匹配"
- 评分基于"完全匹配"(1 bit 误差都错)

### 11.5 HLE 出题流程

```
1. 邀请专家(PhD / 教授 / 资深研究员)出题
2. AI 试答,确保难度
3. 同行审核,确保无歧义
4. 持续更新,避免污染
5. 单题价值 > 1 小时撰写时间
```

---

## 十二、争议与限制

- **污染风险**:尽管官方努力,SWE-bench 训练数据可能泄漏,需 SWE-bench Live
- **成本**:OSWorld 单次评估 $100-500,完整跑 6 个基准 $1000+
- **可重现性**:WebArena / GAIA 网站变化导致结果不稳定
- **人类基线争议**:ARC-AGI 人类 76-98% 范围很宽
- **多模态公平性**:纯文本 vs 视觉 vs 多模态 Agent 难以直接比较

---

## 十三、相关概念

- [[概念/agent-architectures|Agent 架构]]
- [[概念/llm-benchmarks|LLM 评测]]
- [[概念/llm-as-judge|LLM as Judge]]
- [[概念/reasoning-models|推理模型]]
- [[概念/multimodal-llm|多模态 LLM]]
- [[概念/tool-calling|工具调用]]
- [[概念/mcp|MCP 协议]]
- [[概念/opencompass|OpenCompass 评测]]

---

## 十四、See Also(深度专题)

### SWE-bench
- [SWE-bench 论文 arXiv:2310.06770](https://arxiv.org/abs/2310.06770) — 普林斯顿官方
- [SWE-bench 官方 GitHub](https://github.com/SWE-bench/SWE-bench) — 普林斯顿官方
- [SWE-bench Leaderboards](https://www.swebench.com/) — 官方榜单
- [OpenAI SWE-bench Verified 公告](https://openai.com/index/introducing-swe-bench-verified/) — OpenAI 官方
- [Trae 70.6% 解决方案](https://www.cnblogs.com/volcengine-developer/articles/18934622) — 火山引擎

### GAIA
- [GAIA 论文 arXiv:2311.12983](https://arxiv.org/abs/2311.12983) — Meta + HuggingFace 官方
- [GAIA HuggingFace 数据集](https://huggingface.co/datasets/gaia-benchmark/GAIA) — 官方
- [GAIA 排行榜](https://huggingface.co/spaces/gaia-benchmark/leaderboard) — 官方

### WebArena
- [WebArena 官网](https://webarena.dev/) — 官方
- [WebArena NeurIPS 2024 论文](https://arxiv.org/abs/2307.13854) — CMU 官方

### OSWorld
- [OSWorld GitHub](https://github.com/xlang-ai/OSWorld) — 港大 XLang Lab
- [OSWorld 论文 arXiv:2404.07972](https://arxiv.org/abs/2404.07972) — 港大 XLang Lab
- [OpenCUA VentureBeat 报道](https://venturebeat.com/ai/opencuas-open-source-computer-use-agents-rival-proprietary-models-from-openai-and-anthropic/) — 第三方

### ARC-AGI
- [ARC Prize 官网](https://arcprize.org/) — 官方
- [François Chollet 论文](https://arxiv.org/abs/1911.01547) — 创始人

### HLE
- [HLE 官网](https://agi.safe.ai/) — CAIS 官方
- [HLE 论文 arXiv:2501.14249](https://arxiv.org/abs/2501.14249) — Scale AI + CAIS

### 综合
- [OpenCompass 司南评测](https://github.com/open-compass) — 国产
- [xlang-ai Agent 综述](https://xlang.ai/) — 港大 XLang Lab

---

## 2026 Agent 评测生态速览

| 基准 | 维护方 | 题目数 | 最新版本 | 状态 |
|---|---|---|---|---|
| **SWE-bench Verified** | Princeton + OpenAI | 500 | Verified | GA |
| **SWE-bench Live** | SWE-bench 团队 | 持续更新 | Live | GA |
| **GAIA** | Meta + HuggingFace | 466 | GAIA + GAIA-2 | GA |
| **WebArena** | CMU + HKU | 812 | WebArena + Infinity | GA |
| **OSWorld** | HKU XLang | 369 | OSWorld-MCP | GA |
| **ARC-AGI** | Chollet + Arc Prize | 1,000+ | ARC-AGI-2 | GA |
| **HLE** | Scale AI + CAIS | 2,500+ | HLE 2026 | GA |
| **VisualAgentBench** | 清华 THUDM | 5 环境 | VAB | GA |
| **τ-bench** | Sierra | 165 | τ-bench | GA |
| **CodeClash** | SWE-bench 团队 | 目标导向 | 2025-11 | Beta |
| **mini-SWE-agent** | Princeton | 100 行 | mini | GA |

## 生产最佳实践

1. **新发布 Agent 必跑 6 大基准**:SWE-bench / GAIA / WebArena / OSWorld / ARC-AGI / HLE
2. **预算控制**:6 个基准完整跑 ≈ $1000-2000,优先 Verified/Lite 版
3. **结果复现**:用 Docker / 容器化版本,固定环境
4. **可观测性**:记录每个任务的 trace,失败时回放
5. **多版本对照**:GPT-4o 基线、Claude-3.5 Sonnet、DeepSeek-V3
6. **持续更新**:用 SWE-bench Live / HLE 持续评测,避免过拟合
7. **pass^k 评估**:τ-bench 揭示,pass@1 不可靠
8. **成本-质量权衡**:ARC-AGI 完整评估 $500+,可用子集 100 题
9. **CI 集成**:mini-SWE-agent(100 行) 适合 CI 集成
10. **基准选择**:根据任务场景(代码/网页/OS/推理/知识)选择对应基准
