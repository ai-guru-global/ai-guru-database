---
title: 'AI Agent 记忆系统 2026'
category: '13-agent-production-memory-infrastructure'
tags: ["ai-agents", "agent-framework", "production", "langgraph"]
summary: '> **一句话理解**: 2026年的AI Agent不再"说完就忘"——MemGPT、Mem0等记忆系统让Agent拥有了层级记忆、人格一致性、跨会话学习的能力，从"每次都是新对话"进化到"真正的持续学习伙伴"。'
created: '2026-05-31'
updated: '2026-05-31'
---

# AI Agent 记忆系统 2026

> **一句话理解**: 2026 年的 AI Agent 不再"说完就忘"——MemGPT、Mem0 等记忆系统让 Agent 拥有了层级记忆、人格一致性、跨会话学习的能力，从"每次都是新对话"进化到"真正的持续学习伙伴"。

---

## 1. 概述 (Overview)

### 1.1 为什么Agent需要记忆

```
传统Chatbot的问题:

用户: "我喜欢蓝色"
Bot: "好的，我记住了您喜欢蓝色"

下一轮对话:
用户: "什么颜色适合我?"
Bot: "（不知道用户喜欢蓝色）"

问题根因:
├── 上下文窗口有限
├── 每次请求独立处理
├── 长期信息无法保留
└── 无记忆分层机制
```

### 1.2 记忆系统架构

```
┌─────────────────────────────────────────────────────────────┐
│                 Agent Memory Hierarchy                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  L1: 工作记忆 (Working Memory)                               │
│  ├── 位置: LLM上下文窗口                                    │
│  ├── 容量: 128K tokens (Claude)                             │
│  ├── 生存期: 单次请求                                        │
│  └── 内容: 当前对话、即时任务相关                            │
│                                                              │
│  L2: 短期记忆 (Short-Term Memory)                           │
│  ├── 位置: Redis / 内存数据库                              │
│  ├── 容量: 1-10 MB                                         │
│  ├── 生存期: 24-48小时                                      │
│  └── 内容: 用户偏好、近期交互历史                            │
│                                                              │
│  L3: 长期记忆 (Long-Term Memory)                            │
│  ├── 位置: 向量数据库 / 图数据库                            │
│  ├── 容量: 无限制                                           │
│  ├── 生存期: 永久                                            │
│  └── 内容: 核心事实、知识、跨会话学习                        │
│                                                              │
│  L4: 持续记忆 (Semantic Memory)                             │
│  ├── 位置: 结构化数据库                                     │
│  ├── 容量: 用户数 × 知识量                                  │
│  ├── 生存期: 账户生命周期                                   │
│  └── 内容: 身份、人格、目标、价值观                          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. MemGPT 架构

### 2.1 核心概念

```
MemGPT (Memory GPT) 核心思想:

┌─────────────────────────────────────────────────────────────┐
│                     MemGPT Working Principle                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  问题: LLM上下文有限，但需要处理无限信息                      │
│                                                              │
│  解决: 层级记忆管理                                          │
│  ├── 自动在上下文和外部存储之间移动信息                      │
│  ├── 模拟计算机内存分页                                     │
│  └── 智能检索和遗忘                                         │
│                                                              │
│  关键创新:                                                   │
│  1. 记忆分层: 工作/短期/长期                                │
│  2. 自主管理: Agent自己决定存储/检索                        │
│  3. 渐进式遗忘: 重要性评估 + 淘汰                           │
│  4. 角色一致性: 持续的用户画像                              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 MemGPT 实现

```python
"""MemGPT 核心实现"""

import json
from datetime import datetime
from typing import List, Dict, Optional
from dataclasses import dataclass

@dataclass
class MemoryUnit:
    """记忆单元"""
    id: str
    content: str
    memory_type: str  # "working", "short_term", "long_term"
    importance: float  # 0-1
    last_access: datetime
    created_at: datetime
    embedding: list = None

class MemGPTEngine:
    """
    MemGPT 核心引擎
    
    自主管理多层记忆的智能检索和淘汰
    """
    
    def __init__(
        self,
        llm,
        embedding_model,
        working_memory_limit: int = 128 * 1024,  # 128K tokens
        max_storage: int = 10000
    ):
        self.llm = llm
        self.embedding_model = embedding_model
        self.working_memory_limit = working_memory_limit
        
        # 记忆存储
        self.working_memory: List[MemoryUnit] = []
        self.short_term_memory: List[MemoryUnit] = []
        self.long_term_memory: List[MemoryUnit] = []
        self.semantic_memory: Dict[str, MemoryUnit] = {}  # 用户画像
        
        # 工具定义
        self.memory_tools = self._create_memory_tools()
    
    def _create_memory_tools(self) -> List[dict]:
        """
        创建记忆管理工具
        Agent可以调用这些工具管理记忆
        """
        return [
            {
                "name": "store_memory",
                "description": "Store important information in memory",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "content": {
                            "type": "string",
                            "description": "The content to store"
                        },
                        "memory_type": {
                            "type": "string",
                            "enum": ["working", "short_term", "long_term"],
                            "description": "Type of memory to store in"
                        },
                        "importance": {
                            "type": "number",
                            "description": "Importance score 0-1"
                        }
                    },
                    "required": ["content", "memory_type", "importance"]
                }
            },
            {
                "name": "recall_memories",
                "description": "Recall relevant memories based on query",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "query": {
                            "type": "string",
                            "description": "Query to search for relevant memories"
                        },
                        "memory_type": {
                            "type": "string",
                            "enum": ["all", "working", "short_term", "long_term"],
                            "default": "all"
                        },
                        "limit": {
                            "type": "integer",
                            "default": 5
                        }
                    },
                    "required": ["query"]
                }
            },
            {
                "name": "reflect",
                "description": "Reflect on recent experiences to create insights",
                "parameters": {
                    "type": "object",
                    "properties": {}
                }
            },
            {
                "name": "forget_memories",
                "description": "Forget unimportant memories to free space",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "memory_type": {
                            "type": "string",
                            "description": "Type of memory to clean"
                        },
                        "keep_top_k": {
                            "type": "integer",
                            "description": "Number of top memories to keep"
                        }
                    }
                }
            }
        ]
    
    def store_memory(
        self,
        content: str,
        memory_type: str,
        importance: float
    ) -> str:
        """
        存储记忆
        """
        memory = MemoryUnit(
            id=f"mem_{len(self.short_term_memory)}_{datetime.now().timestamp()}",
            content=content,
            memory_type=memory_type,
            importance=importance,
            last_access=datetime.now(),
            created_at=datetime.now(),
            embedding=self.embedding_model.encode(content)
        )
        
        if memory_type == "working":
            self.working_memory.append(memory)
            self._manage_working_memory()
        elif memory_type == "short_term":
            self.short_term_memory.append(memory)
        else:
            self.long_term_memory.append(memory)
        
        return memory.id
    
    def recall_memories(
        self,
        query: str,
        memory_type: str = "all",
        limit: int = 5
    ) -> List[MemoryUnit]:
        """
        检索相关记忆
        """
        query_emb = self.embedding_model.encode(query)
        
        # 确定搜索范围
        search_pools = []
        if memory_type in ["all", "working"]:
            search_pools.extend(self.working_memory)
        if memory_type in ["all", "short_term"]:
            search_pools.extend(self.short_term_memory)
        if memory_type in ["all", "long_term"]:
            search_pools.extend(self.long_term_memory)
        
        # 语义相似度计算
        scored = []
        for mem in search_pools:
            sim = cosine_similarity(query_emb, mem.embedding)
            scored.append((mem, sim))
        
        # 排序并返回top-k
        scored.sort(key=lambda x: x[1] * x[0].importance, reverse=True)
        
        # 更新访问时间
        for mem, _ in scored[:limit]:
            mem.last_access = datetime.now()
        
        return [mem for mem, _ in scored[:limit]]
    
    def reflect(self) -> List[str]:
        """
        反思机制: 总结近期经验形成洞察
        
        由LLM驱动，分析近期记忆生成高级洞察
        """
        # 获取近期短期记忆
        recent = sorted(
            self.short_term_memory,
            key=lambda x: x.last_access,
            reverse=True
        )[:10]
        
        if len(recent) < 3:
            return []
        
        # LLM反思
        prompt = f"""
Based on these recent interactions:
{chr(10).join([m.content for m in recent])}

Generate 2-3 key insights or patterns that should be stored in long-term memory.
Format: Each insight as a separate, concise statement.
"""
        
        insights = self.llm.generate(prompt)
        
        # 存储洞察为长期记忆
        for insight in insights:
            self.store_memory(
                content=insight,
                memory_type="long_term",
                importance=0.8
            )
        
        # 清理短期记忆
        self._cleanup_short_term()
        
        return insights
    
    def _manage_working_memory(self):
        """
        管理工作记忆
        
        如果超限，将不重要的记忆迁移到短期存储
        """
        current_size = sum(len(m.content) for m in self.working_memory)
        
        if current_size < self.working_memory_limit:
            return
        
        # 按重要性排序
        sorted_mem = sorted(
            self.working_memory,
            key=lambda x: x.importance * (datetime.now() - x.last_access).seconds,
            reverse=True
        )
        
        # 保留最重要的，直到低于限制
        kept = []
        size = 0
        
        for mem in sorted_mem:
            if size + len(mem.content) < self.working_memory_limit * 0.8:
                kept.append(mem)
                size += len(mem.content)
            else:
                # 迁移到短期记忆
                mem.memory_type = "short_term"
                self.short_term_memory.append(mem)
        
        self.working_memory = kept
```

---

## 3. Agent 记忆模式

### 3.1 记忆模式分类

```
Agent记忆模式:

┌─────────────────────────────────────────────────────────────┐
│                 Agent Memory Patterns                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  模式1: 人格记忆 (Personality Memory)                        │
│  ├── 用途: 保持一致的性格、语气、偏好                        │
│  ├── 内容: 性格描述、交流风格、价值观                       │
│  ├── 更新: 低频、需要明确触发                               │
│  └── 示例: "你是一个耐心的老师"                            │
│                                                              │
│  模式2: 用户画像 (User Profile)                             │
│  ├── 用途: 个性化服务、习惯理解                              │
│  ├── 内容: 姓名、偏好、目标、限制                           │
│  ├── 更新: 中频、基于交互学习                               │
│  └── 示例: "用户喜欢简洁的回答"                             │
│                                                              │
│  模式3: 任务记忆 (Task Memory)                              │
│  ├── 用途: 复杂任务的多步骤追踪                              │
│  ├── 内容: 当前目标、已完成步骤、待办                       │
│  ├── 更新: 高频、每个请求更新                               │
│  └── 示例: "已完成第3步，正在进行第4步"                    │
│                                                              │
│  模式4: 知识记忆 (Knowledge Memory)                        │
│  ├── 用途: 跨会话的持续学习                                  │
│  ├── 内容: 学会的新概念、修正的错误                          │
│  ├── 更新: 低频、定期反思触发                               │
│  └── 示例: "用户公司叫ABC Corp"                             │
│                                                              │
│  模式5: 对话历史 (Conversation History)                      │
│  ├── 用途: 上下文连贯性                                      │
│  ├── 内容: 完整对话记录                                      │
│  ├── 更新: 每个请求追加                                     │
│  └── 示例: Q&A对列表                                         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 记忆检索策略

```python
"""记忆检索策略"""

class MemoryRetrieval:
    """
    Agent记忆检索策略
    """
    
    @staticmethod
    def get_relevant_memories(
        query: str,
        memories: List[MemoryUnit],
        strategy: str = "weighted"
    ) -> List[MemoryUnit]:
        """
        记忆检索策略
        
        策略1: Weighted (默认)
        - 综合考虑: 语义相似度 × 重要性 × 新近度
        
        策略2: Recency
        - 只考虑时间因素
        
        策略3: Importance
        - 只考虑重要性
        
        策略4: Diversity
        - 尽量返回不同类型的记忆
        """
        if strategy == "weighted":
            return MemoryRetrieval._weighted_retrieval(query, memories)
        elif strategy == "recency":
            return MemoryRetrieval._recency_retrieval(memories)
        elif strategy == "importance":
            return MemoryRetrieval._importance_retrieval(memories)
        elif strategy == "diversity":
            return MemoryRetrieval._diversity_retrieval(memories)
    
    @staticmethod
    def _weighted_retrieval(query, memories):
        """加权检索"""
        query_emb = embed(query)
        now = datetime.now()
        
        scored = []
        for mem in memories:
            # 语义相似度
            sim = cosine_similarity(query_emb, mem.embedding)
            
            # 时间衰减 (7天为半衰期)
            age = (now - mem.last_access).days
            recency = 0.5 ** (age / 7)
            
            # 综合得分
            score = sim * 0.5 + mem.importance * 0.3 + recency * 0.2
            
            scored.append((mem, score))
        
        scored.sort(key=lambda x: x[1], reverse=True)
        return [mem for mem, _ in scored[:10]]
```

---

## 4. 企业级记忆系统

### 4.1 Mem0 平台

```
Mem0: 企业级Agent记忆平台

┌─────────────────────────────────────────────────────────────┐
│                      Mem0 Architecture                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  API Layer                                                  │
│  ├── REST API                                               │
│  ├── GraphQL API                                            │
│  └── WebSocket (实时)                                        │
│                                                              │
│  Memory Engine                                              │
│  ├── Vector Store (Pinecone/Qdrant)                        │
│  ├── Graph Store (Neo4j)                                    │
│  ├── Cache (Redis)                                           │
│  └── LLM (GPT-4o/Claude)                                    │
│                                                              │
│  Memory Types                                               │
│  ├── User Memory (个性化)                                   │
│  ├── Agent Memory (Agent间共享)                             │
│  ├── Session Memory (当前会话)                              │
│  └── Global Knowledge (共享知识)                            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 实现示例

```python
"""Mem0 风格的企业记忆系统"""

import mem0

class EnterpriseMemory:
    """
    企业级Agent记忆系统
    """
    
    def __init__(self, user_id: str):
        # 初始化Mem0客户端
        self.client = mem0.Client(
            api_key="your-api-key",
            host="https://api.mem0.ai"
        )
        self.user_id = user_id
        
        # 记忆分类
        self.collections = {
            "user_profile": f"user_{user_id}",
            "agent_shared": "agent_shared",
            "session": f"session_{user_id}_{get_session_id()}",
            "global": "global_knowledge"
        }
    
    def add_user_preference(self, key: str, value: any):
        """
        添加用户偏好
        """
        self.client.add(
            data=f"User prefers {key}: {value}",
            collection=self.collections["user_profile"],
            metadata={
                "type": "preference",
                "key": key,
                "value": str(value)
            }
        )
    
    def add_knowledge(self, fact: str, source: str = "user"):
        """
        添加知识事实
        """
        self.client.add(
            data=fact,
            collection=self.collections["agent_shared"],
            metadata={
                "type": "knowledge",
                "source": source
            }
        )
    
    def get_user_context(self, query: str) -> str:
        """
        获取用户相关上下文
        """
        # 搜索用户画像
        profile_results = self.client.search(
            query=query,
            collection=self.collections["user_profile"],
            top_k=3
        )
        
        # 搜索共享知识
        knowledge_results = self.client.search(
            query=query,
            collection=self.collections["agent_shared"],
            top_k=5
        )
        
        # 构建上下文
        context = "User Profile:\n"
        for r in profile_results:
            context += f"- {r['text']}\n"
        
        context += "\nRelevant Knowledge:\n"
        for r in knowledge_results:
            context += f"- {r['text']}\n"
        
        return context
    
    def add_session_memory(self, role: str, content: str):
        """
        添加会话记忆
        """
        self.client.add(
            data=f"{role}: {content}",
            collection=self.collections["session"],
            metadata={
                "role": role,
                "timestamp": datetime.now().isoformat()
            }
        )
```

---

## 5. 记忆安全与隐私

### 5.1 隐私保护机制

```python
"""记忆隐私保护"""

class MemoryPrivacyManager:
    """
    记忆系统隐私保护
    """
    
    # PII 检测模式
    PII_PATTERNS = {
        "email": r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',
        "phone": r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b',
        "ssn": r'\b\d{3}-\d{2}-\d{4}\b',
        "credit_card": r'\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b'
    }
    
    @staticmethod
    def anonymize_memory(memory_content: str) -> tuple[str, list]:
        """
        匿名化记忆中的PII
        
        Returns: (anonymized_content, pii_locations)
        """
        pii_locations = []
        
        anonymized = memory_content
        for pii_type, pattern in MemoryPrivacyManager.PII_PATTERNS.items():
            matches = re.findall(pattern, anonymized)
            for match in matches:
                placeholder = f"[{pii_type.upper()}]"
                anonymized = anonymized.replace(match, placeholder)
                pii_locations.append({
                    "type": pii_type,
                    "placeholder": placeholder,
                    "original_length": len(match)
                })
        
        return anonymized, pii_locations
    
    @staticmethod
    def enforce_forgetting(client, user_id: str, scope: str):
        """
        强制遗忘
        
        用户行使"被遗忘权"时删除相关记忆
        """
        if scope == "all":
            # 删除用户所有记忆
            client.delete_collection(f"user_{user_id}")
            client.delete_collection(f"session_{user_id}_*")
        elif scope == "recent":
            # 只删除最近一段时间的记忆
            cutoff = datetime.now() - timedelta(days=30)
            client.delete_where(
                collection=f"user_{user_id}",
                where={"last_access": {"$lt": cutoff.isoformat()}}
            )
```

---

## 6. 参考资源

### 开源项目
- [MemGPT](https://github.com/MemGPT/MemGPT)
- [Mem0](https://github.com/mem0ai/mem0)
- [Letta](https://github.com/letta-ai/letta)

### 论文
- [MemGPT: Towards LLMs as Operating Systems](https://arxiv.org/abs/2310.08560)

---

*Last updated: 2026-04-10*

## Related

- [[15_Agent_Production/Agent_Evaluation/Agent_Harness_Complete_2026.md|Agent_Harness_Complete_2026]]
- [[15_Agent_Production/Agent_Evaluation/Agent_Red_Teaming_2026.md|Agent_Red_Teaming_2026]]
- [[15_Agent_Production/Agent_Evaluation/Assessment/Evaluation_Workflow.md|Evaluation_Workflow]]
- [[15_Agent_Production/Agent_Evaluation/Assessment/Production_Assessment.md|Production_Assessment]]
- [[15_Agent_Production/Agent_Evaluation/Benchmarking/Benchmarking_Criteria.md|Benchmarking_Criteria]]
