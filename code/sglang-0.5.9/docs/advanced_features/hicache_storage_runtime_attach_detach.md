# Runtime Attach/Detach HiCache Storage Backend (No Restart)

This document explains how to **dynamically attach/detach the HiCache L3 storage backend at runtime** (e.g., `mooncake` / `hf3fs` / `nixl` / `file` / `aibrix` / `eic`) while **SGLang is already running and serving traffic**, without restarting the process.

For safety and consistency, the current implementation **strictly requires** these operations to happen only when the service is **idle**:

- **No running requests**
- **No waiting/queued requests**

If the idle condition is not met, the API will fail fast (HTTP 400) and **will not modify** the current service state.

---

## 1. Background and implementation overview

### 1.1 Architecture / control path

The control path is:

1. **HTTP Server** (`python/sglang/srt/entrypoints/http_server.py`)
   - Exposes `PUT /hicache/storage-backend`, `DELETE /hicache/storage-backend`, `GET /hicache/storage-backend`
2. **TokenizerManager** (`python/sglang/srt/managers/tokenizer_communicator_mixin.py`)
   - Sends the request to the Scheduler via `_Communicator`
3. **Scheduler** (`python/sglang/srt/managers/scheduler.py`)
   - Performs a **strict idle check**
   - Calls `tree_cache.attach_storage_backend(...)` / `detach_storage_backend(...)`
4. **HiRadixCache** (`python/sglang/srt/mem_cache/hiradix_cache.py`)
   - Parses `hicache_storage_backend_extra_config_json` (supports both backend config and prefetch knobs)
   - Calls `cache_controller.attach_storage_backend(...)` / `detach_storage_backend(...)`
5. **HiCacheController** (`python/sglang/srt/managers/cache_controller.py`)
   - Creates/destroys the storage backend instance (via `StorageBackendFactory`)
   - Starts/stops backend background threads at runtime (prefetch/backup)

---

## 2. Idle-state requirement (strict)

The Scheduler uses a stricter `_is_idle_for_hicache_storage_op()`:

- `_is_no_request()` is true (covers running/overlap/pp/disagg and other active states)
- `waiting_queue` is empty
- `grammar_queue` is empty (if the grammar backend is enabled)

If the condition is not met, attach/detach returns an error like:

- `Reject attach: scheduler is not idle. #queue-req=... #running-req=...`

> Tip: before switching, drain upstream traffic and wait for the server to become idle, then call attach/detach.

### 2.1 DP (data parallel) semantics

When `dp_size > 1`, the tokenizer dispatches the request to **all DP scheduler instances** and aggregates their responses:

- The final `success` is **true only if all DP ranks return success**
- The final `message` concatenates messages from all DP ranks

This is intended to prevent “silent partial success”, but it also means you may see:

- Overall **failure** even though **some ranks already succeeded**

Currently there is **no automatic partial rollback** across DP ranks (see TODO in code). Operationally:

- Prefer to keep backend config identical across ranks
- If attach fails, immediately call detach (best-effort/idempotent), fix config, then retry attach

---

## 3. How to use (HTTP Admin API)

The examples below assume your SGLang HTTP server is at `http://127.0.0.1:30000`.

### 3.1 Query current storage backend status

```bash
curl -s http://127.0.0.1:30000/hicache/storage-backend
```

Example response:

```json
{
  "hicache_storage_backend": "mooncake",
  "hicache_storage_backend_extra_config": "{\"master_server_address\":\"127.0.0.1:50051\", ...}"
}
```

### 3.2 Attach (enable) a storage backend
```bash
curl -s -X PUT http://127.0.0.1:30000/hicache/storage-backend \
  -H 'Content-Type: application/json' \
  -d '{
    "hicache_storage_backend": "mooncake"
  }'
```

```bash
curl -s -X PUT http://127.0.0.1:30000/hicache/storage-backend \
  -H 'Content-Type: application/json' \
  -d '{
    "hicache_storage_backend": "mooncake",
    "hicache_storage_backend_extra_config_json": "{\"master_server_address\":\"127.0.0.1:50051\",\"protocol\":\"tcp\",\"global_segment_size\":\"4gb\",\"prefetch_threshold\":256}",
    "hicache_storage_prefetch_policy": "timeout"
  }'
```

Notes:

- `hicache_storage_backend_extra_config_json` can include both:
  - **Backend configuration** (e.g., Mooncake master/metadata/protocol, etc.)
  - **Prefetch configuration** (`prefetch_threshold`, `prefetch_timeout_base`, `prefetch_timeout_per_ki_token`, `hicache_storage_pass_prefix_keys`)

### 3.3 Detach (disable) the storage backend

```bash
curl -s -X DELETE http://127.0.0.1:30000/hicache/storage-backend
```

Notes:

- Detach only makes SGLang **stop using** the L3 storage backend and stops prefetch/backup threads
- It **does not automatically delete** data stored in Mooncake/HF3FS (or other remote backends)

---

## 4. Behavior and caveats

- **No restart required**: attach/detach switches in-process at runtime
- **Must be idle**: otherwise the request is rejected to avoid consistency issues
- **Host KV layout constraints still apply**: for example, Mooncake still requires layouts like `page_first/page_first_direct/page_head`; if the server's HiCache host-memory layout does not satisfy the backend requirements, attach will fail with an error
- **Observability**:
  - After attach, `server_args.hicache_storage_backend*` is updated on both the tokenizer and scheduler sides
  - If metrics are enabled, attach will create a storage metrics collector in `HiRadixCache` on demand

## 核心知识框架

| 知识层 | 内容 | 深度要求 | 优先级 |
|--------|------|----------|--------|
| 基础概念 | 定义/原理/分类 | 理解并能解释 | P0 |
| 核心方法 | 算法/技术/工具 | 掌握并能应用 | P0 |
| 工程实践 | 设计/实现/优化 | 独立完成项目 | P1 |
| 前沿进展 | 最新研究/趋势 | 了解并跟踪 | P2 |
| 应用案例 | 实际场景/经验 | 参考并借鉴 | P1 |

## 技术要点速查

| 要点 | 说明 | 注意事项 |
|------|------|----------|
| 核心原理 | 理解底层机制 | 不要死记硬背 |
| 实践方法 | 动手验证理论 | 从简单开始 |
| 性能优化 | 瓶颈分析+调优 | 数据驱动 |
| 错误排查 | 系统化定位问题 | 日志+复现 |
| 最佳实践 | 遵循行业标准 | 因地制宜 |
| 持续学习 | 跟踪技术发展 | 选择性深入 |

## 对比分析表

| 维度 | 方案一 | 方案二 | 方案三 | 推荐 |
|------|--------|--------|--------|------|
| 复杂度 | 低 | 中 | 高 | 按需选择 |
| 性能 | 基础 | 良好 | 优秀 | 按需求 |
| 可维护性 | 高 | 中 | 低 | 优先高 |
| 学习曲线 | 平缓 | 中等 | 陡峭 | 按团队 |
| 社区支持 | 广泛 | 一般 | 有限 | 优先广泛 |

## 常见问题FAQ

| 问题 | 解答 |
|------|------|
| 如何快速入门? | 先理解核心概念，再通过实践加深理解 |
| 如何选择技术方案? | 根据场景需求、团队能力、成本约束综合评估 |
| 遇到问题如何排查? | 复现问题→定位范围→分析原因→验证修复 |
| 如何持续提升? | 系统学习+项目实践+社区交流+定期复盘 |
| 如何评估效果? | 设定明确指标→对比基线→持续监控 |

## 学习路径

| 阶段 | 内容 | 时间 | 产出 |
|------|------|------|------|
| 入门 | 核心概念+基础操作 | 1-2周 | 基本理解 |
| 基础 | 工具使用+简单实践 | 2-3周 | 能独立操作 |
| 进阶 | 深入原理+复杂场景 | 3-4周 | 能解决问题 |
| 实战 | 生产级应用 | 4-6周 | 独立负责 |
| 精通 | 架构+创新 | 持续 | 技术领导 |

## 术语表

| 术语 | 含义 |
|------|------|
| Best Practice | 行业最佳实践 |
| Trade-off | 权衡取舍 |
| Scalability | 可扩展性 |
| Maintainability | 可维护性 |
| Observability | 可观测性 |
| Reliability | 可靠性 |

## 检查清单

- [ ] 核心概念已理解
- [ ] 基本操作已掌握
- [ ] 实践项目已完成
- [ ] 常见问题能解决
- [ ] 前沿趋势有关注
- [ ] 知识已沉淀文档化
