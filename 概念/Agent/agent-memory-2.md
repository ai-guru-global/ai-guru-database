---
title: "Agent 长期记忆 2.0 (MemGPT / Zep / Mem0 / Letta / 跨会话记忆架构)"
category: concepts
tags:
  - agent
  - memory
  - memgpt
  - zep
  - mem0
  - letta
  - long-term-memory
  - episodic-memory
  - semantic-memory
aliases:
  - Agent Memory 2.0
  - MemGPT
  - Zep
  - Mem0
  - Letta
  - Long-Term Memory Agent
  - Episodic Memory
relationships:
  - target: "概念/agent-memory-systems"
    type: extends
  - target: "概念/rag"
    type: related_to
  - target: "概念/vector-database"
    type: related_to
  - target: "概念/knowledge-graph"
    type: related_to
summary: "Agent 长期记忆 2.0 是 2024-2026 突破"上下文窗口之外记忆"的关键架构——MemGPT(虚拟上下文管理)、Zep(时序知识图谱)、Mem0(自学习记忆层)、Letta(开源 MemGPT)把 Agent 记忆从"塞进 prompt"升级为"分层存储 + 智能检索",突破 200K 限制,实现跨会话、跨用户的持续学习。"
lifecycle: reviewed
tier: core
created: 2026-07-24
updated: 2026-07-24
sources: []
---

# Agent 长期记忆 2.0

> **一句话理解**:Agent 长期记忆 2.0 是 2024-2026 突破"上下文窗口 + 单次会话"限制的关键架构——MemGPT 用虚拟分页管理 10M+ token,Zep 用时序知识图谱追踪事实变化,Mem0 用自学习机制从交互中提炼,Letta 把 MemGPT 开源。是 Anthropic Claude Projects / OpenAI Memory / Google NotebookLM 后台的基础设施。

---

## 一、为什么需要长期记忆?

- **上下文窗口有限**:200K 已是大顶,企业需要 1M+
- **单次会话无法积累**:每次开新窗口,模型"失忆"
- **个性化难**:无法记住用户偏好、历史交互
- **成本高**:每次把全部历史塞进 prompt 贵且慢
- **幻觉严重**:无历史事实校验,容易编造

---

## 二、关键术语中英对照

| 中文 | 英文 | 说明 |
|---|---|---|
| 长期记忆 | Long-Term Memory | 跨会话持久化 |
| 短期记忆 | Short-Term Memory | 当前会话上下文 |
| 工作记忆 | Working Memory | 当前任务相关 |
| 情景记忆 | Episodic Memory | "我做过什么" |
| 语义记忆 | Semantic Memory | "我知道什么" |
| 程序记忆 | Procedural Memory | "我会做什么" |
| 上下文窗口 | Context Window | 模型一次能处理的最大 token |
| 虚拟上下文 | Virtual Context | 通过分页机制扩展有效上下文 |
| 分页管理 | Paging | 借鉴 OS 虚拟内存 |
| 层级记忆 | Hierarchical Memory | 多级存储(快/慢/冷) |
| 记忆检索 | Memory Retrieval | 从记忆中找相关 |
| 记忆压缩 | Memory Compression | 历史摘要 |
| 记忆遗忘 | Memory Forgetting | 主动清理不重要的 |
| 知识图谱 | Knowledge Graph | 实体关系图 |
| 时序知识图谱 | Temporal Knowledge Graph | 带时间维度的知识图谱 |
| 事实追踪 | Fact Tracking | 追踪事实变化 |
| 自我学习 | Self-Learning | 从交互中提炼 |
| 记忆一致性 | Memory Consistency | 避免矛盾记忆 |
| 记忆冲突 | Memory Conflict | 检测冲突 |
| 记忆更新 | Memory Update | 修正/删除/添加 |
| 隐私保护 | Privacy Preservation | GDPR 合规 |
| 用户控制 | User Control | 让用户管理记忆 |
| 持久化 | Persistence | 跨会话保留 |
| 多模态记忆 | Multimodal Memory | 文本 + 图像 + 音频 |

---

## 三、主流记忆系统对比(2026-02 快照)

| 系统 | 厂商 | 架构 | 容量 | 许可证 | 核心特色 |
|---|---|---|---|---|---|
| **MemGPT** | UC Berkeley | 虚拟分页 | 10M+ tokens | MIT(论文) | 借鉴 OS 虚拟内存,层级管理 |
| **Letta** | Letta(原 MemGPT 团队) | 虚拟分页 | 10M+ tokens | Apache 2.0 | MemGPT 开源版,生产就绪 |
| **Zep** | Zep AI | 时序知识图谱 | 无限 | Apache 2.0 + 商业 | 事实追踪 + 时间衰减 |
| **Mem0** | Mem0 AI | 自学习记忆 | 无限 | Apache 2.0 + 商业 | 加 LLM-as-Judge 自动提取 |
| **LangMem** | LangChain | 集成 LangGraph | 无限 | MIT | LangChain 官方记忆层 |
| **Cognee** | Cognee AI | 知识图谱 + 向量 | 无限 | Apache 2.0 | ECL 流水线(Extract-Cognify-Load) |
| **Memary** | Memary | 时序图 | 无限 | MIT | 模拟人类记忆模型 |
| **Anthropic Projects** | Anthropic | 文档级 | 数百万 token | 商业 | Claude 官方 |
| **OpenAI Memory** | OpenAI | 偏好级 | 数十条 | 商业 | ChatGPT 简单记忆 |
| **NotebookLM** | Google | 文档级 | 25 文档 | 商业 | Google 文档总结 |
| **Memobase** | Memobase | 通用记忆 | 无限 | Apache 2.0 | 国产开源 |
| **腾讯元宝** | 腾讯 | 多模态 | 无限 | 商业 | 国产,微信生态 |
| **字节豆包** | 字节 | 多模态 | 无限 | 商业 | 国产,短视频场景 |

---

## 四、MemGPT / Letta 详解

### 4.1 核心思想

借鉴 OS **虚拟内存**:
- **核心上下文**(类似 RAM):快速、有限
- **外部存储**(类似硬盘):慢速、无限
- **分页调度**:智能地把相关内容"换入"核心上下文

### 4.2 架构

```
┌─────────────────────────────────────┐
│   LLM Context Window (200K)        │
│   ┌──────────────────────┐         │
│   │  Working Memory      │  ← 当前任务
│   ├──────────────────────┤         │
│   │  Recent Episodes     │  ← 最近交互
│   ├──────────────────────┤         │
│   │  Recall Query        │  ← 智能检索
│   └──────────────────────┘         │
└─────────────────────────────────────┘
        ↕  function calls
┌─────────────────────────────────────┐
│   External Storage (无限)         │
│   - Episodic Memory(情景)          │
│   - Semantic Memory(语义)          │
│   - Archival Memory(归档)          │
└─────────────────────────────────────┘
```

### 4.3 Letta 实战(开源)

```python
from letta import create_client
from letta.schemas.memory import ChatMemory

client = create_client()

agent = client.create_agent(
    memory=ChatMemory(
        persona="You are a helpful assistant with long-term memory",
        human="User: Allen, prefers Chinese, technical depth",
    ),
    model="openai/gpt-4o",
)

# 与 Agent 交互
response = client.send_message(
    agent_id=agent.id,
    message="我最近在学 Rust,推荐几本书"
)
print(response.messages)

# 跨会话:查询历史记忆
memory_blocks = client.get_agent_memory(agent_id=agent.id)
```

### 4.4 关键能力

- **核心上下文管理**:自动调度 4 类记忆块
- **记忆编辑**:用户可手动修正
- **记忆搜索**:跨会话、跨主题
- **记忆时间衰减**:老记忆降权
- **多 Agent 共享记忆**:memory 块可复用

---

## 五、Zep 详解

### 5.1 核心思想

**时序知识图谱**(Temporal Knowledge Graph):
- 实体 + 关系 + 时间
- 事实变化自动追踪
- 查询"上个月用户的偏好"

### 5.2 架构

```
Message → [Extract] → 实体/关系 → [Graph Store]
                            ↓
                    [Temporal Decay] 
                            ↓
                  [Retriever](语义 + 时序)
                            ↓
                  Top-K 事实 → LLM
```

### 5.3 实战

```python
from zep_cloud import Zep

client = Zep(api_key="...")

# 创建用户
user = client.user.add(user_id="allen")

# 添加会话
memory = client.memory.add(
    session_id="sess-1",
    user_id="allen",
    messages=[
        {"role": "user", "content": "我住在上海"},
        {"role": "assistant", "content": "好的,上海"},
        # 一周后
        {"role": "user", "content": "我搬到北京了"},
    ]
)

# 查询记忆
results = client.memory.search(
    session_id="sess-2",
    user_id="allen",
    search_query="我住在哪里",
    search_type="summary"
)
# 返回:之前上海,现在北京(自动追踪事实变化)
```

### 5.4 关键能力

- **时序事实追踪**:"上个月""之前""现在"
- **自动摘要**:会话级 + 用户级
- **GraphRAG**:知识图谱 + 向量混合检索
- **多模态**:文本 + 图像

---

## 六、Mem0 详解

### 6.1 核心思想

**自学习记忆层**:
- LLM-as-Judge 自动判断"哪些要记住"
- 加/更新/删除/无操作 四种动作
- 持续学习用户偏好

### 6.2 架构

```
Message → [Memory Extractor (LLM)] → {add, update, delete, no-op}
                                       ↓
                                 [Vector Store]
                                       ↓
                              [Retrieval on Query]
```

### 6.3 实战

```python
from mem0 import Memory

m = Memory()

# 添加记忆
m.add("User: 我喜欢看科幻电影,讨厌恐怖片", user_id="allen")

# 自动判断:不喜欢恐怖片 → 添加;已有 → no-op
m.add("User: 给我推荐几部科幻片", user_id="allen")

# 查询
related = m.search("用户的电影偏好", user_id="allen")
print(related)
# [{'memory': '不喜欢恐怖片', 'score': 0.85},
#  {'memory': '喜欢科幻电影', 'score': 0.79}]
```

### 6.4 关键能力

- **LLM-as-Judge**:智能判断该记住什么
- **多用户隔离**:user_id 隔离
- **多模态记忆**:文本 + 图像
- **可托管服务** + **开源**

---

## 七、生产最佳实践

1. **个人 AI 助理用 Letta(开源)**:MemGPT 思想,生产就绪,自托管。
2. **企业 SaaS 用 Zep(商业)**:时序图 + 事实追踪,客服 / 销售首选。
3. **轻量自学习用 Mem0**:加 LLM-as-Judge,简单集成。
4. **LangChain 生态用 LangMem**:与 LangGraph 深度集成。
5. **Claude 用 Projects**:官方支持,无运维。
6. **记忆分层**:核心 + 近期 + 归档,3 级存储。
7. **记忆检索混用**:语义(向量)+ 关键词(BM25)+ 时序(Zep)+ 实体(图谱)。
8. **记忆清理 + 衰减**:老记忆主动降权,GDPR 合规。
9. **用户控制**:让用户能查看/编辑/删除自己记忆。
10. **多 Agent 共享记忆**:memory 块跨 Agent 复用(团队助手)。
11. **隐私优先**:敏感数据加密、租户隔离、访问审计。
12. **可观测性**:Langfuse 监控记忆读写,性能 + 成本优化。

---

## 八、2026 生态速览

| 维度 | 2026 状态 |
|---|---|
| **MemGPT / Letta** | UC Berkeley → Letta Inc 商业化,GitHub 18K+ stars |
| **Zep** | Series A,企业 ARR $5M+,事实追踪 SOTA |
| **Mem0** | YC W24,GitHub 25K+ stars,Mem0+ 商业版 |
| **LangMem** | LangChain 官方,LangGraph 深度集成 |
| **Cognee** | 开源 + 商业,ECL 流水线 ECL 范式 |
| **OpenAI Memory** | ChatGPT 内置,简单偏好级 |
| **Anthropic Projects** | Claude 官方,文档级 + 自定义指令 |
| **Google NotebookLM** | 文档级,音频总结创新 |
| **国产** | Memobase / 腾讯元宝 / 字节豆包 |
| **标准化** | MemoryBank 基准(2025-Q3 发布) |
| **市场规模** | 整体 ARR $100M+,年增速 200%+ |

---

## 九、See Also(官方源)

### MemGPT / Letta

- MemGPT 论文 [arxiv.org/abs/2310.08560](https://arxiv.org/abs/2310.08560)
- Letta 官方 [letta.com](https://www.letta.com/)
- Letta GitHub [github.com/letta-ai/letta](https://github.com/letta-ai/letta)
- 文档 [docs.letta.com](https://docs.letta.com/)

### Zep

- 官方 [getzep.com](https://www.getzep.com/)
- GitHub [github.com/getzep/zep](https://github.com/getzep/zep)
- 论文 "Zep: A Temporal Knowledge Graph Architecture for Agent Memory" [arxiv.org/abs/2501.13956](https://arxiv.org/abs/2501.13956)

### Mem0

- 官方 [mem0.ai](https://mem0.ai/)
- GitHub [github.com/mem0ai/mem0](https://github.com/mem0ai/mem0)
- 论文 "Mem0: Building Production-Ready AI Agents with Scalable Long-Term Memory" [arxiv.org/abs/2504.19413](https://arxiv.org/abs/2504.19413)

### 其他

- LangMem [github.com/langchain-ai/langmem](https://github.com/langchain-ai/langmem)
- Cognee [github.com/topoteretes/cognee](https://github.com/topoteretes/cognee)

---

## 十、相关概念卡

- [[概念/agent-memory-systems|Agent Memory Systems]]
- [[概念/agent-loop|Agent Loop]]
- [[概念/rag|Rag]]
- [[概念/vector-database|Vector Database]]
- [[概念/knowledge-graph|Knowledge Graph]]
- [[概念/agent-framework|Agent Framework]]
- [[概念/zep|Zep]]
- [[概念/mem0|Mem0]]
