---
title: '代码RAG架构深度解析 (Code RAG Architecture)'
category: '14-rag-systems'
tags: ["code-rag", "code-search", "ast", "code-embedding", "code-completion", "repository-indexing", "cursor", "copilot", "cody"]
summary: '> **一句话理解**: 代码RAG不是简单地把代码当文本检索——AST感知分块、符号级索引、跨文件依赖图、代码专用嵌入模型让仓库级代码理解成为可能，Cursor/Copilot/Cody各自代表了不同的工程哲学。'
created: '2026-07-19'
updated: '2026-07-19'
tier: core
aliases:
  - "Code RAG Architecture"
  - "代码RAG"
  - Code_RAG_Architecture
sources: []

---
# 代码RAG架构深度解析 (Code RAG Architecture)

> **一句话理解**: 代码RAG不是简单地把代码当文本检索——AST感知分块、符号级索引、跨文件依赖图、代码专用嵌入模型让仓库级代码理解成为可能，Cursor/Copilot/Cody各自代表了不同的工程哲学。

---

## 1. 概述 (Overview)

### 为什么代码RAG是独特的？

代码与自然语言文本有本质区别，直接套用文档RAG管道效果极差:

```
代码 vs 自然语言文本:

自然语言文档:
├── 线性阅读，段落独立
├── 语义连续，上下文局部
├── 分块边界清晰 (段落/章节)
└── 检索粒度: 段落/句子

代码:
├── 非线性，跨文件引用
├── 语义分散 (接口定义在A，实现在B，调用在C)
├── 结构层次深 (文件→类→方法→语句)
├── 符号系统 (变量/函数/类/模块有精确引用关系)
├── 分块边界: AST节点 (函数/类/方法)
└── 检索粒度: 符号级 (函数/类) + 文件级 + 仓库级
```

### 代码RAG的核心挑战

| 挑战 | 描述 | 影响 |
|------|------|------|
| 跨文件依赖 | 函数A调用B，B依赖C，C在另一个包 | 单文件检索不够 |
| 多粒度需求 | 补全需要局部，问答需要全局 | 单一索引不够 |
| 代码演化 | 频繁修改，索引需实时更新 | 静态索引过时 |
| 多语言混合 | 前端TS+后端Go+SQL+配置 | 统一解析困难 |
| 隐式上下文 | 框架约定、设计模式、业务逻辑 | 纯语法不够 |
| 规模 | 大型仓库 10M+ 行代码 | 全量索引成本高 |

### 代码RAG vs 代码补全 vs 代码问答

```
┌─────────────────────────────────────────────────────────────────┐
│              代码AI的三种范式                                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  代码补全 (Code Completion):                                      │
│  ├── 输入: 当前文件 + 光标位置                                    │
│  ├── 输出: 下一段代码 (1-50行)                                    │
│  ├── 上下文: 当前文件 + 打开的标签 + 最近编辑                     │
│  ├── 延迟要求: < 200ms                                            │
│  ├── RAG角色: 轻量 (FIM + 局部上下文)                             │
│  └── 代表: Copilot, Codeium, TabNine                              │
│                                                                   │
│  代码问答 (Code Q&A / Chat):                                      │
│  ├── 输入: 自然语言问题 + 仓库                                    │
│  ├── 输出: 解释/方案/代码片段                                     │
│  ├── 上下文: 仓库级检索 + 依赖图                                  │
│  ├── 延迟要求: < 5秒                                              │
│  ├── RAG角色: 核心 (仓库级检索 + 重排)                            │
│  └── 代表: Cursor Chat, Cody Chat, Copilot Chat                   │
│                                                                   │
│  代码生成/编辑 (Code Generation):                                 │
│  ├── 输入: 需求描述 + 相关代码                                    │
│  ├── 输出: 新文件/修改现有文件                                    │
│  ├── 上下文: 项目结构 + 依赖 + 风格                               │
│  ├── 延迟要求: < 30秒                                             │
│  ├── RAG角色: 重要 (项目级上下文组装)                             │
│  └── 代表: Cursor Composer, Copilot Workspace, Devin              │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. 架构详解 (Architecture)

### 2.1 仓库级代码索引管道

```
┌─────────────────────────────────────────────────────────────────┐
│              代码RAG索引管道                                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  源代码仓库                                                       │
│      │                                                            │
│      ▼                                                            │
│  ┌──────────────────────────────────────────────────┐            │
│  │  1. 文件发现与过滤                                 │            │
│  │  ├── .gitignore / .codeignore 过滤                │            │
│  │  ├── 语言检测 (by extension + shebang)            │            │
│  │  ├── 二进制/生成文件排除                          │            │
│  │  └── 增量检测 (git diff / file watcher)           │            │
│  └──────────────────────────────────────────────────┘            │
│      │                                                            │
│      ▼                                                            │
│  ┌──────────────────────────────────────────────────┐            │
│  │  2. AST解析与符号提取                              │            │
│  │  ├── Tree-sitter 多语言解析                       │            │
│  │  ├── 提取: 类/函数/方法/接口/类型/常量            │            │
│  │  ├── 记录: 签名/文档字符串/参数/返回类型          │            │
│  │  ├── 构建: 调用图/继承图/导入图                   │            │
│  │  └── 输出: 符号表 + 依赖图                        │            │
│  └──────────────────────────────────────────────────┘            │
│      │                                                            │
│      ▼                                                            │
│  ┌──────────────────────────────────────────────────┐            │
│  │  3. 智能分块 (AST-aware Chunking)                  │            │
│  │  ├── 函数/方法级分块 (主粒度)                     │            │
│  │  ├── 类级分块 (含所有方法)                        │            │
│  │  ├── 文件级摘要 (imports + exports + 结构)        │            │
│  │  ├── 滑动窗口 (跨函数上下文)                      │            │
│  │  └── 保留: 文件路径 + 行号 + 语言                 │            │
│  └──────────────────────────────────────────────────┘            │
│      │                                                            │
│      ▼                                                            │
│  ┌──────────────────────────────────────────────────┐            │
│  │  4. 多路嵌入 (Multi-path Embedding)                │            │
│  │  ├── 代码嵌入: 代码文本 → code embedding          │            │
│  │  ├── 摘要嵌入: LLM生成摘要 → text embedding      │            │
│  │  ├── 符号嵌入: 函数签名+docstring → embedding     │            │
│  │  └── 路径嵌入: 文件路径+目录结构 → embedding      │            │
│  └──────────────────────────────────────────────────┘            │
│      │                                                            │
│      ▼                                                            │
│  ┌──────────────────────────────────────────────────┐            │
│  │  5. 多索引存储                                     │            │
│  │  ├── 向量索引: 语义检索 (embedding)               │            │
│  │  ├── 全文索引: 精确匹配 (BM25/ripgrep)           │            │
│  │  ├── 符号索引: 定义/引用/调用 (LSP-like)          │            │
│  │  ├── 图索引: 依赖/继承/调用关系                   │            │
│  │  └── 元数据索引: 路径/语言/修改时间/作者          │            │
│  └──────────────────────────────────────────────────┘            │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 AST感知检索

```python
# AST感知代码分块 (使用Tree-sitter)
import tree_sitter
from tree_sitter import Language, Parser
from dataclasses import dataclass
from typing import List, Optional

@dataclass
class CodeChunk:
    """代码分块单元"""
    content: str              # 代码文本
    file_path: str            # 文件路径
    start_line: int           # 起始行
    end_line: int             # 结束行
    language: str             # 编程语言
    chunk_type: str           # function/class/method/file/import
    symbol_name: str          # 符号名称
    signature: Optional[str]  # 函数签名
    docstring: Optional[str]  # 文档字符串
    imports: List[str]        # 导入的模块
    calls: List[str]          # 调用的函数
    parent_class: Optional[str]  # 所属类
    children: List[str]       # 子符号

class ASTAwareChunker:
    """AST感知的代码分块器"""
    
    def __init__(self):
        self.parsers = {
            "python": self._init_parser("python"),
            "typescript": self._init_parser("typescript"),
            "javascript": self._init_parser("javascript"),
            "go": self._init_parser("go"),
            "rust": self._init_parser("rust"),
            "java": self._init_parser("java"),
        }
    
    def chunk_file(self, file_path: str, content: str, language: str) -> List[CodeChunk]:
        """将文件分块为AST节点"""
        parser = self.parsers.get(language)
        if not parser:
            return self._fallback_chunk(file_path, content, language)
        
        tree = parser.parse(bytes(content, "utf-8"))
        chunks = []
        
        # 1. 文件级摘要块
        file_summary = self._extract_file_summary(tree, file_path, content)
        chunks.append(file_summary)
        
        # 2. 遍历AST，提取函数/类
        self._walk_tree(tree.root_node, file_path, content, language, chunks)
        
        return chunks
    
    def _walk_tree(self, node, file_path, content, language, chunks, parent_class=None):
        """递归遍历AST节点"""
        if node.type in ("function_definition", "method_definition",
                         "function_declaration", "method_declaration",
                         "arrow_function", "function"):
            chunk = self._extract_function(node, file_path, content, language, parent_class)
            chunks.append(chunk)
        
        elif node.type in ("class_definition", "class_declaration"):
            class_name = self._get_node_name(node)
            # 类级块 (包含签名和docstring，不含方法体)
            class_chunk = self._extract_class_header(node, file_path, content, language)
            chunks.append(class_chunk)
            # 递归处理类内方法
            for child in node.children:
                self._walk_tree(child, file_path, content, language, chunks, class_name)
            return  # 已递归处理子节点
        
        for child in node.children:
            self._walk_tree(child, file_path, content, language, chunks, parent_class)
    
    def _extract_function(self, node, file_path, content, language, parent_class) -> CodeChunk:
        """提取函数级代码块"""
        func_text = content[node.start_byte:node.end_byte]
        name = self._get_node_name(node)
        signature = self._extract_signature(node, content)
        docstring = self._extract_docstring(node, content)
        calls = self._extract_calls(node, content)
        imports = self._extract_imports_from_scope(node, content)
        
        return CodeChunk(
            content=func_text,
            file_path=file_path,
            start_line=node.start_point[0] + 1,
            end_line=node.end_point[0] + 1,
            language=language,
            chunk_type="method" if parent_class else "function",
            symbol_name=name,
            signature=signature,
            docstring=docstring,
            imports=imports,
            calls=calls,
            parent_class=parent_class,
            children=[]
        )
```

### 2.3 符号提取与依赖图

```python
# 构建仓库级依赖图
from collections import defaultdict
from typing import Dict, Set, Tuple

class RepositoryDependencyGraph:
    """仓库级代码依赖图"""
    
    def __init__(self):
        # 节点: 符号 (file_path::symbol_name)
        # 边: 依赖关系
        self.nodes: Dict[str, CodeChunk] = {}
        self.edges: Dict[str, Set[str]] = defaultdict(set)  # 调用/引用
        self.reverse_edges: Dict[str, Set[str]] = defaultdict(set)  # 被调用/被引用
        self.import_graph: Dict[str, Set[str]] = defaultdict(set)  # 文件导入
        self.inheritance: Dict[str, str] = {}  # 类继承
    
    def build_from_chunks(self, chunks: List[CodeChunk]):
        """从代码块构建依赖图"""
        # 1. 注册所有符号
        for chunk in chunks:
            node_id = f"{chunk.file_path}::{chunk.symbol_name}"
            self.nodes[node_id] = chunk
        
        # 2. 解析调用关系
        for chunk in chunks:
            caller_id = f"{chunk.file_path}::{chunk.symbol_name}"
            for called_name in chunk.calls:
                # 解析被调用函数的完整路径
                callee_id = self._resolve_symbol(called_name, chunk)
                if callee_id:
                    self.edges[caller_id].add(callee_id)
                    self.reverse_edges[callee_id].add(caller_id)
        
        # 3. 解析导入关系
        for chunk in chunks:
            if chunk.chunk_type == "file":
                for imp in chunk.imports:
                    self.import_graph[chunk.file_path].add(imp)
    
    def get_context_for_symbol(self, symbol_id: str, depth: int = 2) -> List[CodeChunk]:
        """获取符号的N跳上下文 (调用者+被调用者+依赖)"""
        context_ids = set()
        
        # BFS遍历依赖图
        queue = [(symbol_id, 0)]
        visited = {symbol_id}
        
        while queue:
            current, d = queue.pop(0)
            if d > depth:
                continue
            
            context_ids.add(current)
            
            # 被调用的函数 (下游)
            for callee in self.edges.get(current, set()):
                if callee not in visited:
                    visited.add(callee)
                    queue.append((callee, d + 1))
            
            # 调用者 (上游)
            for caller in self.reverse_edges.get(current, set()):
                if caller not in visited:
                    visited.add(caller)
                    queue.append((caller, d + 1))
        
        return [self.nodes[sid] for sid in context_ids if sid in self.nodes]
    
    def get_impact_set(self, symbol_id: str) -> Set[str]:
        """获取修改某符号的影响范围 (所有依赖它的符号)"""
        impact = set()
        queue = [symbol_id]
        
        while queue:
            current = queue.pop(0)
            for dependent in self.reverse_edges.get(current, set()):
                if dependent not in impact:
                    impact.add(dependent)
                    queue.append(dependent)
        
        return impact
```

### 2.4 跨文件上下文组装

```python
class CrossFileContextAssembler:
    """跨文件上下文组装器: 为LLM构建最优代码上下文"""
    
    def __init__(self, max_tokens: int = 8000):
        self.max_tokens = max_tokens
        self.tokenizer = get_tokenizer()
    
    def assemble_context(
        self,
        query: str,
        current_file: str,
        cursor_position: int,
        retrieved_chunks: List[CodeChunk],
        dependency_graph: RepositoryDependencyGraph
    ) -> str:
        """
        组装最终送入LLM的上下文
        优先级: 当前文件 > 直接依赖 > 检索结果 > 间接依赖
        """
        context_parts = []
        token_budget = self.max_tokens
        
        # 1. 当前文件 (最高优先级)
        current_content = self._get_current_file_context(
            current_file, cursor_position, budget=token_budget // 3
        )
        context_parts.append(current_content)
        token_budget -= self._count_tokens(current_content)
        
        # 2. 直接依赖 (import的模块/调用的函数)
        direct_deps = dependency_graph.get_context_for_symbol(
            f"{current_file}::current_scope", depth=1
        )
        dep_content = self._format_chunks(direct_deps, budget=token_budget // 3)
        context_parts.append(dep_content)
        token_budget -= self._count_tokens(dep_content)
        
        # 3. 语义检索结果 (去重后)
        retrieved_content = self._dedupe_and_rank(
            retrieved_chunks, 
            exclude=[current_file],
            budget=token_budget // 3
        )
        context_parts.append(retrieved_content)
        token_budget -= self._count_tokens(retrieved_content)
        
        # 4. 项目结构概览 (剩余预算)
        if token_budget > 200:
            structure = self._get_project_structure(budget=token_budget)
            context_parts.append(structure)
        
        return self._format_final_context(context_parts)
    
    def _get_current_file_context(self, file_path, cursor_pos, budget):
        """获取当前文件的光标周围上下文"""
        lines = read_file(file_path).split("\n")
        
        # 策略: 包含当前函数 + imports + 相关类定义
        current_function = self._find_enclosing_function(lines, cursor_pos)
        imports = self._extract_imports(lines)
        
        # 如果函数太长，截取光标前后N行
        if self._count_tokens(current_function) > budget:
            start = max(0, cursor_pos - 30)
            end = min(len(lines), cursor_pos + 30)
            current_function = "\n".join(lines[start:end])
        
        return f"# File: {file_path}\n{imports}\n\n{current_function}"
```

---

## 3. 代码嵌入模型 (Code Embeddings)

### 3.1 模型对比

| 模型 | 维度 | 最大token | 代码理解 | 多语言 | 开源 | 特点 |
|------|------|-----------|----------|--------|------|------|
| **CodeBERT** | 768 | 512 | 中 | 6语言 | 是 | 早期基线 |
| **UniXcoder** | 768 | 512 | 中强 | 多语言 | 是 | 统一跨模态 |
| **StarCoder Embeddings** | 6144 | 8192 | 强 | 80+语言 | 是 | 大模型嵌入 |
| **CodeSage** | 1024 | 4096 | 强 | 多语言 | 是 | 专为代码检索 |
| **Voyage Code** | 1536 | 16000 | 极强 | 多语言 | 否 | SOTA代码嵌入 |
| **OpenAI text-embedding-3** | 3072 | 8191 | 强 | 通用 | 否 | 通用但代码不错 |
| **Cohere embed-v4** | 1024 | 512 | 强 | 100+语言 | 否 | 多语言代码 |
| **Jina Code v2** | 768 | 8192 | 强 | 30+语言 | 是 | 代码专用 |

### 3.2 代码嵌入的最佳实践

```python
# 代码嵌入策略
class CodeEmbeddingStrategy:
    """多路嵌入: 不同粒度使用不同嵌入策略"""
    
    def embed_function(self, chunk: CodeChunk) -> dict:
        """函数级嵌入: 签名 + docstring + 实现"""
        # 策略: 签名权重 > docstring > 实现体
        text_for_embedding = self._compose_embedding_text(chunk)
        return {
            "vector": self.code_model.encode(text_for_embedding),
            "text": text_for_embedding
        }
    
    def _compose_embedding_text(self, chunk: CodeChunk) -> str:
        """组合嵌入文本 (不是直接用原始代码)"""
        parts = []
        
        # 1. 文件路径 (提供项目上下文)
        parts.append(f"File: {chunk.file_path}")
        
        # 2. 函数签名 (最关键的语义信息)
        if chunk.signature:
            parts.append(f"Signature: {chunk.signature}")
        
        # 3. Docstring (自然语言描述)
        if chunk.docstring:
            parts.append(f"Description: {chunk.docstring}")
        
        # 4. 调用的函数 (功能线索)
        if chunk.calls:
            parts.append(f"Calls: {', '.join(chunk.calls[:10])}")
        
        # 5. 代码体 (截断到合理长度)
        code_body = chunk.content[:2000]  # 限制长度
        parts.append(f"Implementation:\n{code_body}")
        
        return "\n".join(parts)
    
    def embed_for_query(self, query: str, query_type: str) -> dict:
        """查询嵌入: 根据查询类型调整"""
        if query_type == "natural_language":
            # "如何实现用户认证?" → 用文本嵌入
            return {"vector": self.text_model.encode(query)}
        elif query_type == "code_snippet":
            # 用户粘贴了一段代码 → 用代码嵌入
            return {"vector": self.code_model.encode(query)}
        elif query_type == "symbol":
            # "UserService.create" → 用符号嵌入
            return {"vector": self.symbol_model.encode(query)}
```

---

## 4. 技术对比 (Comparison)

### 4.1 生产级代码AI产品架构对比

| 维度 | **Cursor** | **GitHub Copilot** | **Sourcegraph Cody** |
|------|-----------|-------------------|---------------------|
| **索引方式** | 本地 + 云端混合 | 云端 (GitHub) | 云端 (Sourcegraph) |
| **分块策略** | AST + 滑动窗口 | 文件级 + 函数级 | AST + 符号级 |
| **检索方法** | 向量 + BM25 + 图 | 向量 + 关键词 | 向量 + 代码图 + 关键词 |
| **上下文窗口** | 当前文件 + 检索 | 当前文件 + 打开标签 | 仓库级检索 |
| **嵌入模型** | 自研 + Voyage | OpenAI | 自研 (CodeSage) |
| **更新频率** | 实时 (file watcher) | git push触发 | 实时 (SCIP indexer) |
| **多仓库** | 有限 | 有限 | 原生支持 |
| **代码图** | 轻量依赖图 | 无 | 完整SCIP图 |
| **隐私** | 可选本地 | 云端 | 可选自托管 |
| **适用规模** | 单项目 | 单仓库 | 多仓库/企业 |

### 4.2 检索策略对比

| 策略 | 适用场景 | 优点 | 缺点 |
|------|----------|------|------|
| **纯向量检索** | 语义相似代码 | 理解意图 | 精确匹配差 |
| **BM25/全文** | 精确符号查找 | 精确 | 不理解语义 |
| **AST结构检索** | 相似结构/模式 | 结构感知 | 计算成本高 |
| **依赖图遍历** | 跨文件上下文 | 完整上下文 | 可能过大 |
| **LSP集成** | 定义/引用/补全 | 精确+实时 | 需语言服务器 |
| **混合检索** | 生产系统 | 互补 | 复杂度高 |

### 4.3 分块策略对比

| 策略 | 粒度 | 适用 | 优点 | 缺点 |
|------|------|------|------|------|
| 固定行数 | 50-100行 | 简单场景 | 实现简单 | 切断函数 |
| 函数级 | 完整函数 | 代码问答 | 语义完整 | 大函数过长 |
| 类级 | 完整类 | 面向对象 | 包含关系 | 可能很大 |
| AST节点 | 任意节点 | 精确检索 | 最灵活 | 实现复杂 |
| 文件摘要 | 整文件 | 文件定位 | 全局视图 | 细节丢失 |
| 滑动窗口 | 重叠窗口 | 补全 | 保留上下文 | 冗余 |

---

## 5. 实践指南 (Practice Guide)

### 5.1 构建代码RAG系统

```python
# 完整的代码RAG管道
class CodeRAGPipeline:
    """生产级代码RAG管道"""
    
    def __init__(self, repo_path: str, config: CodeRAGConfig):
        self.repo_path = repo_path
        self.chunker = ASTAwareChunker()
        self.embedder = CodeEmbeddingStrategy()
        self.dep_graph = RepositoryDependencyGraph()
        self.vector_store = QdrantClient(config.vector_db_url)
        self.bm25_index = BM25Index()
        self.assembler = CrossFileContextAssembler(max_tokens=config.context_budget)
    
    async def index_repository(self):
        """索引整个仓库"""
        # 1. 发现文件
        files = self._discover_files()
        logger.info(f"发现 {len(files)} 个代码文件")
        
        # 2. 并行解析和分块
        all_chunks = []
        for file_path in files:
            content = read_file(file_path)
            language = detect_language(file_path)
            chunks = self.chunker.chunk_file(file_path, content, language)
            all_chunks.extend(chunks)
        
        logger.info(f"生成 {len(all_chunks)} 个代码块")
        
        # 3. 构建依赖图
        self.dep_graph.build_from_chunks(all_chunks)
        
        # 4. 生成嵌入 (批量)
        embeddings = await self._batch_embed(all_chunks)
        
        # 5. 写入向量数据库
        await self._upsert_vectors(all_chunks, embeddings)
        
        # 6. 构建BM25索引
        self.bm25_index.build(all_chunks)
    
    async def retrieve(self, query: str, current_file: str = None) -> List[CodeChunk]:
        """混合检索"""
        # 1. 向量检索 (语义)
        query_embedding = self.embedder.embed_for_query(query, "natural_language")
        vector_results = await self.vector_store.search(
            query_embedding["vector"], top_k=20
        )
        
        # 2. BM25检索 (关键词)
        bm25_results = self.bm25_index.search(query, top_k=20)
        
        # 3. 符号检索 (精确匹配)
        symbol_results = self._symbol_search(query)
        
        # 4. 融合排序 (RRF)
        merged = reciprocal_rank_fusion(
            [vector_results, bm25_results, symbol_results],
            weights=[0.5, 0.3, 0.2]
        )
        
        # 5. 依赖图扩展
        expanded = self._expand_with_dependencies(merged[:10])
        
        # 6. 重排序
        reranked = await self._rerank(query, expanded)
        
        return reranked[:10]
    
    async def answer(self, query: str, current_file: str, cursor_pos: int) -> str:
        """完整问答流程"""
        # 1. 检索相关代码
        retrieved = await self.retrieve(query, current_file)
        
        # 2. 组装上下文
        context = self.assembler.assemble_context(
            query=query,
            current_file=current_file,
            cursor_position=cursor_pos,
            retrieved_chunks=retrieved,
            dependency_graph=self.dep_graph
        )
        
        # 3. 生成回答
        response = await self.llm.generate(
            system="你是一个代码专家。根据提供的代码上下文回答问题。",
            user=f"## 代码上下文\n{context}\n\n## 问题\n{query}"
        )
        
        return response
```

### 5.2 增量索引策略

```python
class IncrementalIndexer:
    """增量索引: 只处理变更文件"""
    
    async def on_git_commit(self, commit_hash: str):
        """git commit触发的增量更新"""
        # 1. 获取变更文件
        changed_files = git_diff("--name-only", f"{commit_hash}^", commit_hash)
        
        for file_path in changed_files:
            if is_deleted(file_path):
                # 删除旧索引
                await self.vector_store.delete(filter={"file_path": file_path})
                self.dep_graph.remove_file(file_path)
            else:
                # 重新索引
                content = read_file(file_path)
                chunks = self.chunker.chunk_file(file_path, content, detect_language(file_path))
                
                # 更新向量
                embeddings = await self._batch_embed(chunks)
                await self.vector_store.delete(filter={"file_path": file_path})
                await self._upsert_vectors(chunks, embeddings)
                
                # 更新依赖图
                self.dep_graph.update_file(file_path, chunks)
    
    async def on_file_save(self, file_path: str):
        """文件保存触发的实时更新 (IDE集成)"""
        # 防抖: 500ms内的多次保存合并
        await self._debounce(file_path, delay_ms=500)
        
        content = read_file(file_path)
        chunks = self.chunker.chunk_file(file_path, content, detect_language(file_path))
        
        # 只更新变更的函数 (diff检测)
        old_chunks = self._get_cached_chunks(file_path)
        changed_chunks = self._diff_chunks(old_chunks, chunks)
        
        if changed_chunks:
            embeddings = await self._batch_embed(changed_chunks)
            await self._update_vectors(changed_chunks, embeddings)
```

### 5.3 查询理解与路由

```python
class CodeQueryRouter:
    """理解用户查询意图，路由到最佳检索策略"""
    
    async def route(self, query: str) -> dict:
        """
        查询分类:
        - "UserService的create方法做了什么?" → 符号查找 + 函数检索
        - "如何实现JWT认证?" → 语义检索
        - "哪些文件导入了utils.py?" → 依赖图查询
        - "找到所有处理错误的代码" → 模式匹配 + 语义
        """
        classification = await self.llm.classify(
            query,
            categories=[
                "symbol_lookup",      # 精确符号查找
                "semantic_search",    # 语义搜索
                "dependency_query",   # 依赖关系查询
                "pattern_match",      # 代码模式匹配
                "file_navigation",    # 文件导航
                "explanation",        # 代码解释
            ]
        )
        
        if classification == "symbol_lookup":
            return {"strategy": "lsp_definition", "extract_symbol": True}
        elif classification == "dependency_query":
            return {"strategy": "graph_traversal", "direction": "both"}
        elif classification == "semantic_search":
            return {"strategy": "hybrid_retrieval", "top_k": 20}
        elif classification == "pattern_match":
            return {"strategy": "ast_pattern", "structural": True}
        else:
            return {"strategy": "hybrid_retrieval", "top_k": 15}
```

---

## 6. 2026前沿 (Frontier)

### 6.1 代码RAG的新趋势

```
2026代码RAG前沿:

1. Agentic Code Retrieval
├── Agent自主决定检索策略
├── 多轮迭代检索 (检索→评估→补充)
├── 工具调用: grep/find/lsp/git
└── 代表: Cursor Agent Mode, Cody Agent

2. 仓库级理解 (Repo-level Understanding)
├── 整个仓库作为上下文 (压缩后)
├── 项目架构自动推断
├── 设计模式识别
└── 代码风格学习

3. 实时代码图 (Live Code Graph)
├── SCIP/LSIF标准化
├── 跨仓库符号解析
├── 运行时调用图 (profiling数据)
└── 变更影响分析

4. 多模态代码理解
├── 代码 + 截图 (UI代码)
├── 代码 + 错误日志
├── 代码 + 性能火焰图
└── 代码 + 设计文档

5. 个性化代码RAG
├── 学习开发者编码风格
├── 团队代码规范感知
├── 历史修改模式
└── 个人常用库偏好
```

### 6.2 长上下文 vs 代码RAG

| 场景 | 长上下文方案 | 代码RAG方案 | 推荐 |
|------|-------------|-------------|------|
| 单文件补全 | 整个文件放入上下文 | 不需要RAG | 长上下文 |
| 跨文件问答 | 多文件拼接 (可能超限) | 检索相关文件 | 代码RAG |
| 仓库级理解 | 不可能 (太大) | 分层索引+检索 | 代码RAG |
| 重构建议 | 相关文件放入 | 依赖图+检索 | 混合 |
| Bug定位 | 错误日志+相关文件 | 语义检索+图 | 代码RAG |
| 代码审查 | PR diff + 上下文 | 检索相关代码 | 混合 |

### 6.3 评估指标

| 指标 | 定义 | 目标 | 测量方法 |
|------|------|------|----------|
| Recall@K | Top-K结果包含正确答案 | > 90% | 标注数据集 |
| MRR | 正确答案的平均排名倒数 | > 0.7 | 排序评估 |
| Context Precision | 检索结果中相关的比例 | > 60% | 人工标注 |
| Answer Correctness | 最终回答正确率 | > 80% | 人工评估 |
| Latency P95 | 95分位检索延迟 | < 500ms | 生产监控 |
| Index Freshness | 索引与代码的同步延迟 | < 5s | 自动检测 |

---

## 7. 相关概念 (Related)

- [[14_RAG系统/04_Advanced_RAG/RAG_Advanced_2026|RAG高级实践2026]] — 通用RAG高级技术
- [[14_RAG系统/04_Advanced_RAG/Agentic_RAG_Guide|Agentic RAG指南]] — Agent驱动的检索
- [[14_RAG系统/02_Embeddings/Embedding_Models_Guide|嵌入模型指南]] — 嵌入模型选型
- [[14_RAG系统/02_Embeddings/Sentence_Transformers_Deep_Dive|Sentence Transformers]] — 嵌入模型训练
- [[14_RAG系统/03_Vector_Databases/Qdrant_Deep_Dive|Qdrant深度解析]] — 向量数据库
- [[14_RAG系统/04_Advanced_RAG/Long_Context_vs_RAG_2026|长上下文vs RAG]] — 何时用RAG何时用长上下文
- [[14_RAG系统/05_RAG_Production/RAG_Cost_Optimization|RAG成本优化]] — 代码RAG成本控制
- [[14_RAG系统/04_Advanced_RAG/Graph_RAG_Architecture|Graph RAG架构]] — 图结构检索
- [[15_智能体/01_Agent_Foundations/Agent_Overview|AI Agent全景]] — Agent + 代码理解
- [[16_编程/Tree_sitter|Tree-sitter]] — AST解析工具

---

*Last updated: 2026-07-19*
