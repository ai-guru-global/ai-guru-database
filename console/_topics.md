# 主题分类索引

本仓库（AI GURU 工作台）以**逐层拆解 AI 全行业**为主轴：纵向是根目录的五层产业链目录树 `01-算力与硬件层` … `05-商业与生态层`（71 节点，拆解骨架见 [`console/chain.js`](console/chain.js)，由 `make tree` 合成为目录树——「目录即行业」），本文件的 18 个主题是**横向切面**，与产业链正交——一个主题域内的线索会分散挂到不同层的节点上。每个主题对应 `证据层/` 下一个文件夹，文件夹内每个 `.md` 是证据层的一条线索（时间线文档），并按关键词命中挂为分层树对应节点的叶子。年度重点事件另见 [`_2026大事记.md`](_2026大事记.md)（按月归档）。

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
| `行业应用` | Industry Applications | 医疗/办公/金融/法律/教育/科研等垂直落地 |
| `AI安全与对齐` | AI Safety & Alignment | 安全、对齐、红队、监管政策 |
| `开发者工具` | Dev Tools | 面向开发者的 AI 工具链、SDK、平台 |
| `语音与音频` | Speech & Audio | 语音合成/识别、音乐生成、实时语音交互 |
| `AI搜索与信息获取` | AI Search & Information | AI 搜索引擎、答案引擎、AI 浏览器、信息聚合 |
| `商业与投融资` | Business & Funding | 融资、并购、人才流动、商业模式、市场格局 |
| `消费级AI应用` | Consumer AI | 面向大众的 AI 产品：助手 App、陪伴、创作工具 |
| `交付与组织` | Delivery & Organization | FDE/前沿部署、交付与实施、服务伙伴认证、乙方组织与人才结构 |

## 如何新增主题

1. 在本表追加一行（中文文件夹名 / 英文 / 范围）。
2. 建对应文件夹与 `_index.md`（参考任一现有主题的 `_index.md`）。
3. 提交。

注意：新增主题只扩横向切面；若是出现新的产业环节（如新的基础设施形态），应优先在 [`console/chain.js`](console/chain.js) 的对应层新增节点，再考虑主题域。
