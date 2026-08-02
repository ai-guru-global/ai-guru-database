# AI 工程栈

## FDE AI 技术栈全景

### 1. LLM 应用开发

| 层级 | 技术 | 推荐选型 |
|---|---|---|
| **模型调用** | API / 本地推理 | OpenAI API / Ollama / vLLM |
| **编排框架** | Chain / Agent | LangChain / LlamaIndex / Dify |
| **Prompt 管理** | 模板 / 版本管理 | LangSmith / 自建 Prompt 库 |
| **输出解析** | Structured Output | Pydantic / JSON Schema / Instructor |

**FDE 实战建议**：
- Dify 适合快速 POC（拖拽式搭建）
- LangChain 适合复杂定制（代码级控制）
- 自研框架适合规模化交付（可复用）

### 2. RAG 系统

```
文档摄入层
├── PDF 解析：PyMuPDF / Unstructured
├── 文档切分：RecursiveCharacterTextSplitter / Semantic Chunking
├── 元数据提取：自定义 Parser
└── 格式支持：PDF, DOCX, Markdown, HTML, 图片 OCR

向量化层
├── Embedding 模型：BGE / M3E / text2vec（中文）
├── 向量数据库：Milvus / ChromaDB / Qdrant
├── 索引策略：HNSW / IVF_FLAT
└── 维度选择：768 / 1024 / 1536

检索层
├── 混合检索：向量 + 关键词（BM25）
├── 重排序：BGE-Reranker / Cohere Rerank
├── 多路召回：多查询策略
└── 上下文压缩：LongContextReorder

生成层
├── Prompt 模板：System Prompt + Context + Query
├── 引用标注：来源溯源
├── 幻觉检测：Self-Check / NLI 验证
└── 流式输出：SSE / WebSocket
```

### 3. Agent 开发

| 组件 | 技术 | 说明 |
|---|---|---|
| **Agent 框架** | LangGraph / AutoGen / CrewAI | 多 Agent 编排 |
| **工具定义** | Function Calling / MCP | 工具标准化接口 |
| **记忆系统** | 短期记忆 + 长期记忆 | 上下文管理 |
| **规划能力** | ReAct / Plan-and-Execute | 任务分解与执行 |
| **安全沙箱** | Docker / E2B / 自建沙箱 | 代码执行隔离 |

### 4. 模型部署

| 引擎 | 特点 | 适用场景 |
|---|---|---|
| **Ollama** | 最简单，单机部署 | 开发测试 / 小规模 POC |
| **vLLM** | 高吞吐，PagedAttention | 生产级推理（GPU） |
| **llama.cpp** | CPU 推理，GGUF 量化 | 无 GPU 环境 |
| **Text Generation Inference** | HuggingFace 官方 | HF 生态集成 |
| **Triton Inference Server** | NVIDIA 官方 | 企业级多模型服务 |

### 5. 评估与测试

| 维度 | 工具 | 指标 |
|---|---|---|
| **RAG 评估** | RAGAS | Faithfulness, Relevance, Precision |
| **Prompt 评估** | LangSmith / Promptfoo | 准确率、一致性 |
| **性能测试** | Locust / k6 | QPS、延迟、并发 |
| **安全测试** | Garak / 自定义 | 注入攻击、越狱 |

---

> **FDE 选型第一原则**：能在客户环境跑起来 > 技术先进性。不要因为选了"最好"的技术而导致交付失败。
