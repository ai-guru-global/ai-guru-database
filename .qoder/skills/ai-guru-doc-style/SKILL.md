# AI Guru 知识库文档规范

本 skill 定义了 ai-guru-database 项目的文档编写规范，确保全项目 650+ Markdown 文件在结构、风格和用户体验上的一致性。

## 核心原则

1. **所有文件必须有"一句话理解"** —— 用一句通俗的话概括文件核心内容
2. **交叉引用优先** —— 文档不是孤岛，必须关联到其他相关章节
3. **三层阅读路径** —— 每个主题提供 nutshell（30分钟）+ 深度文档 + for_dummy（简化版）
4. **实战导向** —— 包含可运行的代码示例、对比表格和架构图

## 文档类型与模板

详见 `93_Tools/DOCUMENT_TEMPLATES.md`，包含 8 种文档类型的完整模板：

| 类型 | 文件模式 | 目标字数 |
|------|---------|---------|
| 章节 README | `XX_Chapter/README.md` | 100-300 行 |
| Nutshell 速览 | `*in-nutshell.md` | 500-800 行 |
| For Dummy | `*for_dummy.md` | 300-500 行 |
| 核心内容 | `*Deep_Dive.md` / `*_2026.md` | 800-1,500 行 |
| 论文解读 | `22_Papers/*Deep_Dive.md` | 600-900 行 |
| 行业应用 | `20_Industry/*AI_*_2026.md` | 500+ 行 |
| 人物档案 | `21_Talks/*/about.md` | 50+ 行 |
| 面试准备 | `23_Interviews/*/interview_preparing.md` | 30-50 行 |

## 通用格式规范

### 必须包含的元素

```markdown
# 中文标题 (English Title)

> **一句话理解**: [用一句通俗的话概括]

---

[正文，使用 mermaid 图表、代码块、对比表格]

---

*Last updated: YYYY-MM-DD*
```

### Markdown 风格

- **表头加粗**，文本左对齐，数字右对齐
- **术语首次出现加粗**
- **代码块标注语言**，带注释
- **Mermaid 图** 首选 `flowchart` 和 `subgraph`
- **交叉引用** 使用相对路径 `../`，禁止裸 URL

### 中英文混排规范

| 场景 | 规范 | 示例 |
|------|------|------|
| 中文 + 英文 | 英文前后加空格 | `使用 Python 编写` |
| 中文 + 数字 | 数字前后加空格 | `训练了 100 轮` |
| 专有名词 | 保留原大小写 | `PyTorch`、`GPT-4` |

### "一句话理解"质量标准

- ✅ 包含类比，小学生能懂：模型训练就像教小孩认动物
- ⚠️ 专业但易懂：用优化算法调整模型参数
- ❌ 不合格：包含术语、超过 50 字、说不清价值

## 文件命名规范

| 命名模式 | 示例 |
|---------|------|
| 章节 README | `README.md` |
| 速览文件 | `ML-in-nutshell.md` |
| 小白指南 | `RAG_Systems_for_dummy.md` |
| 深度文档 | `LiteLLM_Deep_Dive.md` |
| 年度趋势 | `AI_System_Architecture_2026.md` |

**原则**：英文为主、大驼峰+下划线、子目录内文件与目录同名。

## 反模式（不要这样做）

| 反模式 | 正确做法 |
|--------|---------|
| 孤岛文档（无内部链接） | 至少包含 2 个 `../` 交叉引用 |
| 目录裸引用 `[章节](../XX_Chapter/)` | 指向具体文件 `[章节](../XX_Chapter/README.md)` |
| for_dummy 比正常版还长 | for_dummy 应为正常版的 40-70% |
| 术语轰炸 | 首次出现术语时加粗并简要解释 |
| 有图无文 | 每个 mermaid 图下方加 1-2 句解释 |
| 代码裸奔 | 关键行加注释，附预期输出 |
| 中英文粘连 | `使用 Python 训练` 而非 `使用Python训练` |

## 质量检查清单

创建或修改任何文档前，确认：

- [ ] 包含"一句话理解"（小学生能听懂）
- [ ] 文件末尾有 `*Last updated: YYYY-MM-DD*`
- [ ] 至少 2 个 `../` 交叉引用（指向具体文件，不是目录）
- [ ] 至少 1 个对比表格（表头加粗）
- [ ] 如有代码，标注语言并带注释
- [ ] 未触发任何反模式

## 项目结构速查

```
00_AI_Introduction/    # AI 入门、历史、术语
01_Fundamentals/       # 数学、算法、Java 生态
02_Machine_Learning/   # 监督/无监督学习
03_Deep_Learning/      # 神经网络、优化
04_NLP_LLMs/           # Transformer、LLM、Prompt
05_Computer_Vision/    # 图像分类、检测、生成
06_Reinforcement_Learning/  # RL、Agent、机器人
07_Model_Training/     # 分布式训练、微调、监控
08_Model_Evaluation/   # 评估指标、A/B 测试
09_Deployment_Inference/  # vLLM、ONNX、边缘部署
10_MLOps_Pipeline/     # MLflow、特征存储
11_RAG_Systems/        # 向量数据库、RAG 框架
12_Architecture_Infrastructure/  # 系统架构、容量规划
13_Agent_Production/   # Agent 框架、Harness、技能
14_AI_Gateway/         # 网关、限流、安全
15_Testing/            # AI 测试框架、RAGAS
16_AI_Ops/             # 可观测性、混沌工程
17_AI_Coding/          # AI 辅助编程
18_Cloud_Ops_Agent/    # 云运维 Agent
19_Ethics_Safety/      # AI 安全、隐私、对齐
20_AI_Applications_Industry/  # 10 大行业应用
21_Talks/              # AI 领袖演讲与观点
22_Papers/             # 经典论文解读
23_Interviews/         # 岗位面试准备
90_Learn/              # 学习路径
91_Notes/              # 知识图谱
92_Plan/               # 项目规划与评估
93_Tools/              # 工具与模板
94_Visualization/      # 知识图谱可视化
```

## 关联文档

- [完整模板文档](../../93_Tools/DOCUMENT_TEMPLATES.md) — 含 8 种模板、反模式清单、自动化检查脚本
- [项目结构评估报告](../../92_Plan/Project_Structure_Evaluation_2026.md)
