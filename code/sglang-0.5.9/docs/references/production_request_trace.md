# Production Request Tracing

SGLang exports request trace data based on the OpenTelemetry Collector. You can enable tracing by adding the `--enable-trace` and configure the OpenTelemetry Collector endpoint using `--otlp-traces-endpoint` when launching the server.

You can find example screenshots of the visualization in https://github.com/sgl-project/sglang/issues/8965.

## Setup Guide
This section explains how to configure the request tracing and export the trace data.
1. Install the required packages and tools
    * install Docker and Docker Compose
    * install the dependencies
    ```bash
    # enter the SGLang root directory
    pip install -e "python[tracing]"

    # or manually install the dependencies using pip
    pip install opentelemetry-sdk opentelemetry-api opentelemetry-exporter-otlp opentelemetry-exporter-otlp-proto-grpc
    ```

2. launch opentelemetry collector and jaeger
    ```bash
    docker compose -f examples/monitoring/tracing_compose.yaml up -d
    ```

3. start your SGLang server with tracing enabled
    ```bash
    # set env variables
    export SGLANG_OTLP_EXPORTER_SCHEDULE_DELAY_MILLIS=500
    export SGLANG_OTLP_EXPORTER_MAX_EXPORT_BATCH_SIZE=64
    # start the prefill and decode server
    python -m sglang.launch_server --enable-trace --otlp-traces-endpoint 0.0.0.0:4317 <other option>
    # start the mini lb
    python -m sglang_router.launch_router --enable-trace --otlp-traces-endpoint 0.0.0.0:4317 <other option>
    ```

    Replace `0.0.0.0:4317` with the actual endpoint of the opentelemetry collector. If you launched the openTelemetry collector with tracing_compose.yaml, the default receiving port is 4317.

    To use the HTTP/protobuf span exporter, set the following environment variable and point to an HTTP endpoint, for example, `http://0.0.0.0:4318/v1/traces`.
    ```bash
    export OTEL_EXPORTER_OTLP_TRACES_PROTOCOL=http/protobuf
    ```


4. raise some requests
5. Observe whether trace data is being exported
    * Access port 16686 of Jaeger using a web browser to visualize the request traces.
    * The OpenTelemetry Collector also exports trace data in JSON format to /tmp/otel_trace.json. In a follow-up patch, we will provide a tool to convert this data into a Perfetto-compatible format, enabling visualization of requests in the Perfetto UI.

## How to add Tracing for slices you're interested in?
We have already inserted instrumentation points in the tokenizer and scheduler main threads. If you wish to trace additional request execution segments or perform finer-grained tracing, please use the APIs from the tracing package as described below.

1. initialization

    Every process involved in tracing during the initialization phase should execute:
    ```python
    process_tracing_init(otlp_traces_endpoint, server_name)
    ```
    The otlp_traces_endpoint is obtained from the arguments, and you can set server_name freely, but it should remain consistent across all processes.

    Every thread involved in tracing during the initialization phase should execute:
    ```python
    trace_set_thread_info("thread label", tp_rank, dp_rank)
    ```
    The "thread label" can be regarded as the name of the thread, used to distinguish different threads in the visualization view.

2. Mark the beginning and end of a request
    ```
    trace_req_start(rid, bootstrap_room)
    trace_req_finish(rid)
    ```
    These two APIs must be called within the same process, for example, in the tokenizer.

3. Add tracing for slice

    * Add slice tracing normally:
        ```python
        trace_slice_start("slice A", rid)
        trace_slice_end("slice A", rid)
        ```

    - Use the "anonymous" flag to not specify a slice name at the start of the slice, allowing the slice name to be determined by trace_slice_end.
    <br>Note: Anonymous slices must not be nested.
        ```python
        trace_slice_start("", rid, anonymous = True)
        trace_slice_end("slice A", rid)
        ```

    - In trace_slice_end, use auto_next_anon to automatically create the next anonymous slice, which can reduce the number of instrumentation points needed.
        ```python
        trace_slice_start("", rid, anonymous = True)
        trace_slice_end("slice A", rid, auto_next_anon = True)
        trace_slice_end("slice B", rid, auto_next_anon = True)
        trace_slice_end("slice C", rid, auto_next_anon = True)
        trace_slice_end("slice D", rid)
        ```
    - The end of the last slice in a thread must be marked with thread_finish_flag=True; otherwise, the thread's span will not be properly generated.
        ```python
        trace_slice_end("slice D", rid, thread_finish_flag = True)
        ```

4. When the request execution flow transfers to another thread, the trace context needs to be explicitly propagated.
    - sender: Execute the following code before sending the request to another thread via ZMQ
        ```python
        trace_context = trace_get_proc_propagate_context(rid)
        req.trace_context = trace_context
        ```
    - receiver: Execute the following code after receiving the request via ZMQ
        ```python
        trace_set_proc_propagate_context(rid, req.trace_context)
        ```

5. When the request execution flow transfers to another node(PD disaggregation), the trace context needs to be explicitly propagated.
    - sender: Execute the following code before sending the request to node thread via http
        ```python
        trace_context = trace_get_remote_propagate_context(bootstrap_room_list)
        headers = {"trace_context": trace_context}
        session.post(url, headers=headers)
        ```
    - receiver: Execute the following code after receiving the request via http
        ```python
        trace_set_remote_propagate_context(request.headers['trace_context'])
        ```

## How to Extend the Tracing Framework to Support Complex Tracing Scenarios

The currently provided tracing package still has potential for further development. If you wish to build more advanced features upon it, you must first understand its existing design principles.

The core of the tracing framework's implementation lies in the design of the span structure and the trace context. To aggregate scattered slices and enable concurrent tracking of multiple requests, we have designed a two-level trace context structure and a four-level span structure: `SglangTraceReqContext`, `SglangTraceThreadContext`. Their relationship is as follows:
```
SglangTraceReqContext (req_id="req-123")
├── SglangTraceThreadContext(thread_label="scheduler", tp_rank=0)
|
└── SglangTraceThreadContext(thread_label="scheduler", tp_rank=1)
```

Each traced request maintains a global `SglangTraceReqContext`. For every thread processing the request, a corresponding `SglangTraceThreadContext` is recorded and composed within the `SglangTraceReqContext`. Within each thread, every currently traced slice (possibly nested) is stored in a list.

In addition to the above hierarchy, each slice also records its previous slice via Span.add_link(), which can be used to trace the execution flow.

When the request execution flow transfers to a new thread, the trace context needs to be explicitly propagated. In the framework, this is represented by `SglangTracePropagateContext`, which contains the context of the request span and the previous slice span.


We designed a four-level span structure, consisting of `bootstrap_room_span`, `req_root_span`, `thread_span`, and `slice_span`. Among them, `req_root_span` and `thread_span` correspond to `SglangTraceReqContext` and `SglangTraceThreadContext`, respectively, and `slice_span` is stored within the `SglangTraceThreadContext`. The `bootstrap_room_span` is designed to accommodate the separation of PD-disaggregation. On different nodes, we may want to add certain attributes to the `req_root_span`. However, if the `req_root_span` is shared across all nodes, the Prefill and Decode nodes would not be allowed to add attributes due to the constraints imposed by OpenTelemetry's design.

```
bootstrap room span
├── router req root span
|    └── router thread span
|          └── slice span
├── prefill req root span
|    ├── tokenizer thread span
|    |     └── slice span
|    └── scheduler thread span
|          └── slice span
└── decode req root span
      ├── tokenizer thread span
      |    └── slice span
      └── scheduler thread span
           └── slice span
```

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
