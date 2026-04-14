# AI Guru 知识库 - 已知问题追踪 (Known Issues)

> 本文档记录项目中的已知问题、限制、解决方案和进展状态。用于问题复现规避、知识沉淀和持续改进。

---

## 问题状态定义

| 状态 | 图标 | 说明 |
|-----|------|------|
| **Open** | 🔴 | 已确认，待处理 |
| **Investigating** | 🟡 | 正在调查中 |
| **Fix Planned** | 🔵 | 已规划修复方案 |
| **Fixed** | 🟢 | 已修复，待验证 |
| **Closed** | ⚪ | 已解决或无需修复 |
| **Won't Fix** | ⚫ | 已确认不修复 |

---

## 一、基础设施问题

### ISS-001: 大文件加载内存溢出

| 属性 | 值 |
|-----|-----|
| **状态** | 🟢 Fixed |
| **优先级** | P0 - Critical |
| **发现日期** | 2026-03-15 |
| **修复日期** | 2026-03-20 |
| **影响范围** | 文档加载模块 |

**问题描述**:
加载超过 100MB 的文档时，内存占用过高，可能导致 OOM。

**影响**:
- 大规模知识库加载失败
- 服务不稳定

**解决方案**:
```python
# 使用流式加载替代全量加载
def load_large_document(file_path: str, chunk_size: int = 10 * 1024 * 1024):
    """流式加载大文档"""
    with open(file_path, 'r') as f:
        while True:
            chunk = f.read(chunk_size)
            if not chunk:
                break
            yield process_chunk(chunk)
```

**验证方法**:
```bash
# 加载测试文件
python -c "from utils.document_loader import load_large_document; list(load_large_document('test_data/large_doc.txt'))"
```

---

### ISS-002: GPU 显存碎片化

| 属性 | 值 |
|-----|-----|
| **状态** | 🟡 Investigating |
| **优先级** | P1 - High |
| **发现日期** | 2026-04-01 |
| **影响范围** | 模型推理服务 |

**问题描述**:
长时间运行后，GPU 显存碎片化严重，导致推理延迟增加 30%+。

**临时规避**:
```bash
# 定期重启推理服务
kubectl rollout restart deployment/inference-server --namespace production
```

**调查进展**:
- [x] 确认问题存在
- [x] 分析显存使用模式
- [ ] 测试显存池化方案
- [ ] 评估 PyTorch 显存管理优化

---

## 二、模型相关问题

### ISS-003: 长上下文推理质量下降

| 属性 | 值 |
|-----|-----|
| **状态** | 🔵 Fix Planned |
| **优先级** | P1 - High |
| **发现日期** | 2026-03-25 |
| **计划修复** | 2026-Q2 |
| **影响范围** | RAG 系统、长文档问答 |

**问题描述**:
当上下文超过 32K tokens 时，模型回答质量明显下降，容易出现幻觉和遗漏。

**影响分析**:
```
上下文长度    准确率    幻觉率
4K          92%      3%
16K         85%      7%
32K         78%      12%
64K         65%      22%
128K        52%      35%
```

**临时规避**:
1. 分段处理长文档
2. 使用滑动窗口摘要
3. 优先检索相关片段

**计划修复方案**:
1. 实现 Lost-in-the-Middle 优化
2. 添加上下文重要性排序
3. 多轮检索-重排序流程

---

### ISS-004: 多语言混合输入处理不佳

| 属性 | 值 |
|-----|-----|
| **状态** | 🟢 Fixed |
| **优先级** | P2 - Medium |
| **发现日期** | 2026-02-20 |
| **修复日期** | 2026-03-10 |
| **影响范围** | 多语言查询处理 |

**问题描述**:
中英日韩等多语言混合输入时，分词和语义理解出现问题。

**解决方案**:
添加语言检测和分段处理：
```python
def process_mixed_language(text: str) -> str:
    """处理多语言混合文本"""
    segments = detect_language_segments(text)
    results = []
    for lang, segment in segments:
        processed = process_by_language(segment, lang)
        results.append(processed)
    return merge_results(results)
```

---

## 三、RAG 系统问题

### ISS-005: 向量检索召回率不足

| 属性 | 值 |
|-----|-----|
| **状态** | 🔵 Fix Planned |
| **优先级** | P1 - High |
| **发现日期** | 2026-04-05 |
| **计划修复** | 2026-Q2 |
| **影响范围** | RAG 检索质量 |

**问题描述**:
在知识库较大（>100万条）时，Top-K 召回的文档相关性下降。

**根因分析**:
1. Embedding 模型对长文本截断
2. 向量空间压缩损失
3. 相似度计算精度问题

**改进方案**:
1. 实现 Hybrid Search（向量 + BM25）
2. 添加 Reranking 层
3. 多粒度索引（段落级 + 文档级）

---

### ISS-006: 流式响应中断处理

| 属性 | 值 |
|-----|-----|
| **状态** | 🟢 Fixed |
| **优先级** | P2 - Medium |
| **发现日期** | 2026-03-18 |
| **修复日期** | 2026-03-25 |
| **影响范围** | 流式 API |

**问题描述**:
客户端断开连接后，服务端流式任务未正确终止，导致资源泄漏。

**解决方案**:
```python
async def stream_response(request, response_queue):
    """带断开检测的流式响应"""
    try:
        async for chunk in generate_stream():
            if await request.is_disconnected():
                logger.info("Client disconnected, stopping stream")
                break
            yield chunk
    finally:
        await cleanup_resources()
```

---

## 四、Agent 相关问题

### ISS-007: Agent 工具调用死循环

| 属性 | 值 |
|-----|-----|
| **状态** | 🟡 Investigating |
| **优先级** | P1 - High |
| **发现日期** | 2026-04-08 |
| **影响范围** | Agent 执行引擎 |

**问题描述**:
在特定场景下，Agent 反复调用同一工具，无法跳出循环。

**触发条件**:
- 工具返回格式与期望不符
- Agent 无法正确解析结果
- 目标判断条件不明确

**临时规避**:
```python
# 添加最大步骤限制
MAX_STEPS = 20
agent.set_max_steps(MAX_STEPS)
```

**调查进展**:
- [x] 确认复现路径
- [ ] 分析循环根因
- [ ] 设计循环检测机制

---

### ISS-008: MCP 协议版本兼容性

| 属性 | 值 |
|-----|-----|
| **状态** | 🔴 Open |
| **优先级** | P2 - Medium |
| **发现日期** | 2026-04-10 |
| **影响范围** | MCP 工具集成 |

**问题描述**:
MCP 协议升级后，部分旧版工具 Server 不兼容。

**影响版本**:
- MCP Server v0.x → v1.0 不兼容
- 需要工具方同步升级

**临时方案**:
提供适配层兼容旧版协议：
```python
class MCPVersionAdapter:
    """MCP 版本适配器"""
    
    def adapt_request(self, request: dict, target_version: str) -> dict:
        if target_version.startswith("0."):
            return self._downgrade_to_v0(request)
        return request
```

---

## 五、性能问题

### ISS-009: 高并发下延迟抖动

| 属性 | 值 |
|-----|-----|
| **状态** | 🔵 Fix Planned |
| **优先级** | P1 - High |
| **发现日期** | 2026-03-28 |
| **计划修复** | 2026-Q2 |
| **影响范围** | API 服务稳定性 |

**问题描述**:
QPS > 100 时，P99 延迟出现明显抖动（从 500ms 到 5s+）。

**性能分析**:
```
QPS    P50     P90     P99     P99.9
50     120ms   350ms   800ms   1.2s
100    180ms   500ms   2.5s    5.0s
200    350ms   1.2s    8.0s    15.0s
```

**优化方向**:
1. 添加请求队列和背压机制
2. 实现请求优先级调度
3. GPU 批处理优化
4. 连接池和资源预热

---

## 六、安全问题

### ISS-010: 提示词注入防护不足

| 属性 | 值 |
|-----|-----|
| **状态** | 🟢 Fixed |
| **优先级** | P0 - Critical |
| **发现日期** | 2026-02-15 |
| **修复日期** | 2026-02-20 |
| **影响范围** | 所有 LLM 调用 |

**问题描述**:
存在提示词注入攻击风险，恶意用户可绕过系统提示词限制。

**修复方案**:
1. 输入净化处理
2. 系统提示词隔离
3. 输出安全过滤

```python
def sanitize_input(user_input: str) -> str:
    """输入净化"""
    # 移除潜在注入模式
    patterns = [
        r"ignore (all )?previous instructions",
        r"system:",
        r"<\|.*?\|>",
    ]
    for pattern in patterns:
        user_input = re.sub(pattern, "", user_input, flags=re.IGNORECASE)
    return user_input.strip()
```

---

## 七、文档与内容问题

### ISS-011: 部分代码示例缺少依赖声明

| 属性 | 值 |
|-----|-----|
| **状态** | 🟡 Investigating |
| **优先级** | P3 - Low |
| **发现日期** | 2026-04-01 |
| **影响范围** | 文档可用性 |

**问题描述**:
部分文档中的代码示例缺少必要的 import 语句和依赖说明。

**修复进展**:
- [x] 识别问题文档
- [ ] 添加缺失的依赖声明
- [ ] 添加运行环境说明

---

## 问题统计

### 按状态统计

| 状态 | 数量 | 占比 |
|-----|------|------|
| 🔴 Open | 1 | 9% |
| 🟡 Investigating | 3 | 27% |
| 🔵 Fix Planned | 3 | 27% |
| 🟢 Fixed | 4 | 36% |
| ⚫ Won't Fix | 0 | 0% |

### 按优先级统计

| 优先级 | 数量 |
|-------|------|
| P0 - Critical | 2 |
| P1 - High | 5 |
| P2 - Medium | 3 |
| P3 - Low | 1 |

### 按模块统计

| 模块 | 数量 |
|-----|------|
| 基础设施 | 2 |
| 模型相关 | 2 |
| RAG 系统 | 2 |
| Agent | 2 |
| 性能 | 1 |
| 安全 | 1 |
| 文档 | 1 |

---

## 问题报告模板

```markdown
### ISS-XXX: [问题标题]

| 属性 | 值 |
|-----|-----|
| **状态** | [状态图标] |
| **优先级** | [P0/P1/P2/P3] |
| **发现日期** | YYYY-MM-DD |
| **修复日期** | YYYY-MM-DD（如已修复） |
| **影响范围** | [受影响的模块/功能] |

**问题描述**:
[清晰描述问题现象]

**影响**:
- [列出实际影响]

**复现步骤**:
1. [步骤1]
2. [步骤2]
3. [预期结果 vs 实际结果]

**解决方案**:
[如有，提供解决方案或临时规避方法]

**验证方法**:
[如何验证问题已修复]
```

---

*文档版本: 1.0.0*  
*最后更新: 2026-04-13*  
*维护者: AI Guru 团队*
