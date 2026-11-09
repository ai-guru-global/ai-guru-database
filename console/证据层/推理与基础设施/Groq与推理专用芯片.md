---
线索: Groq与推理专用芯片
主题: 推理与基础设施
别名: [Groq, LPU, Cerebras, 晶圆级引擎, WSE, SambaNova, 推理专用 ASIC]
状态: 活跃
创建: 2026-10-27
更新: 2026-10-27
关键角色: [Groq, Cerebras, SambaNova, Cognition]
---

# Groq与推理专用芯片

> 不做训练、只做推理的芯片创业潮：Groq 的 LPU、Cerebras 的晶圆级引擎，用极致 token 吞吐切开 NVIDIA 防线的裂缝。

## 概述

推理专用芯片是相对 GPU 通用架构的差异化路线：Groq LPU（LPU 推理单元，SRAM 取代 HBM 的确定性架构，主打极低延迟的 token 生成）、Cerebras 晶圆级引擎 WSE（一整片晶圆做一颗芯片）、SambaNova RDU 等。2024 年初 Groq 以数百 token/秒的实时推理演示出圈，验证了「推理市场对吞吐/延迟的敏感度高于生态惯性」。

2026 年这条线迎来资本侧确认：Cerebras IPO 获 20 余倍超额认购；应用侧 Cognition 的编码模型经 Cerebras 推理达到 950 token/秒。测试时计算范式带来的推理需求爆炸，是这条赛道的时代红利。

### 2026-05

- **2026-05-11** · [Cerebras IPO 获 20 余倍超额认购，拟上调发行价近三成](https://aihot.virxact.com/items/cmp0j4gmi0q8fsllh0h28tu23)
  IT之家报道，二级市场对晶圆级推理芯片叙事热情高涨——推理专用芯片从创业叙事进入公开市场定价阶段。

### 2025-10

- **2025-10-28** · [Cognition 发布 SWE-1.5 编码智能体模型，经 Cerebras 推理达 950 tok/s](https://aihot.news/items/cmtyo2iho03dgrog0knllgaku)
  编码 Agent 对速度的极端敏感（开发者等待体验）成为推理专用芯片最匹配的落地场景。

### 2024-08

- **2024-08** · Groq 融资 6.4 亿美元，估值 28 亿美元
  由 BlackRock 领投，资金用于 LPU 推理集群扩容；此前 Groq 以 Llama/Mixtral 数百 token/秒的公开演示奠定「最快推理」心智。

### 2019-08

### 2019-08

- **2019-08** · Cerebras WSE 发布
  晶圆级引擎（Wafer Scale Engine）：一整片晶圆作为单颗芯片，初代约 1.2 万亿晶体管，另辟「大芯片」路线。

### 2016

- **2016** · Groq 成立
  由 Google TPU 首席架构师之一 Jonathan Ross 创立，确立 LPU（LPU 推理单元）路线；Cerebras 同期（2015 年前后）创立，两家「反 GPU」创业公司的技术班底均有 TPU 项目印记。

## 分析

1. **速度即产品**：编码 Agent 与实时语音是「逐 token 等待」场景，吞吐直接决定可用性——这是推理专用芯片对 GPU 最不可辩驳的差异化，也是 Cognition × Cerebras 组合的含义。
2. **资本市场开始给「非 NVIDIA 算力」定价**：Cerebras 超额认购与 [[商业与投融资/AI的IPO窗口]] 中 AI 基础设施上市潮同步，但高估值依赖推理需求持续爆炸的假设。
3. **生态仍是短板**：LPU/WSE 均需模型专门适配（编译、部署路径非 CUDA），「快但难用」的窗口能开多久，取决于 vLLM 等推理抽象层对多后端的整合速度。→ [[推理与基础设施/vLLM与推理引擎]]

## 关联线索

- [[推理与基础设施/AI芯片竞争]]
- [[推理与基础设施/vLLM与推理引擎]]
- [[商业与投融资/AI的IPO窗口]]
