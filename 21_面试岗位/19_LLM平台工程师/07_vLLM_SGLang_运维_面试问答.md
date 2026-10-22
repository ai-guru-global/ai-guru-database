---
title: "vLLM 与 SGLang 运维面试问答全集"
category: 21_面试岗位
tags: ["面试", "推理运维", "vLLM", "SGLang", "PagedAttention", "RadixAttention", "KV-Cache", "Prefix-Caching", "Chunked-Prefill", "量化", "投机解码", "TP-PP-EP", "K8s", "SRE", "容量规划", "监控告警"]
summary: "推理运维 / LLM 平台岗 vLLM 与 SGLang 双引擎面试全集：53 题深度问答（架构原理、性能调优、故障排查、部署容量、选型对比）+ 40 题快问快答 + 报错速查表 + 监控告警基线 + 命令速查 + 必背公式，每题按「30 秒口径 + 追问点」输出。"
created: 2026-10-22
updated: 2026-10-22
tier: supporting
aliases: [vLLM SGLang 运维面试, 推理引擎运维面试问答, vLLM SGLang Interview QA, 推理运维面试题库]
sources:
  - "Efficient Memory Management for LLM Serving with PagedAttention (vLLM, SOSP 2023)"
  - "Efficiently Programming Large Language Models using SGLang (NeurIPS 2024)"
  - "Orca: A Distributed Serving System for Transformer-Based Generative Models (OSDI 2022)"
  - "DistServe / Mooncake / Splitwise / SARATHI（PD 分离系列论文，详见 PD 分离面试复习）"
  - "vLLM V1 官方文档与 Release Notes（2025–2026）"
  - "SGLang 官方文档与 hyperparameter 调优指南（2025–2026）"
  - "知识库内部语料：10_部署推理/02_推理引擎 与 03_推理优化 系列、13_运维 SRE 系列"
name_zh: "vLLM 与 SGLang 运维面试问答全集"
---

# vLLM 与 SGLang 运维面试问答全集 (vLLM & SGLang Ops Interview QA)

> 中文简称：vLLM 与 SGLang 运维面试问答全集

> **一句话理解**: 把 vLLM 和 SGLang 当成「token 工厂的两套操作系统」——面试考的不是会不会启动服务，而是显存账算得清、故障救得回、容量拍得准；本页 53 题深度问答 + 40 题快问快答，全部按线上运维实战口径组织。

本页是**推理运维 / LLM 平台工程师**方向的主复习稿，与库内既有页面配套使用：

- 原理深挖：[[10_部署推理/02_推理引擎/29_vLLM_深入分析|vLLM 深入分析]]、[[10_部署推理/02_推理引擎/23_SGLang_深入分析|SGLang 深入分析]]、[[10_部署推理/02_推理引擎/30_vLLM_Paged注意力_架构|vLLM PagedAttention 架构]]、[[10_部署推理/02_推理引擎/32_vLLM_SGLang_原理_零基础|vLLM/SGLang 原理零基础]]
- 高级问答：[[21_面试岗位/26_高级面试问答/01_LLM推理_高级面试问答|LLM 推理高级面试问答]]（Senior/Staff 口径 12 题）
- 专题：[[21_面试岗位/19_LLM平台工程师/06_PD分离_面试复习|PD 分离面试复习]]、[[10_部署推理/02_推理引擎/33_注意力机制演进_MLA_DSA_混合注意力|MLA 与 DSA 注意力演进]]
- SRE 配套：[[13_运维/02_SRE与可靠性/18_LLM推理_SLO_指南|LLM 推理 SLO 指南]]、[[13_运维/02_SRE与可靠性/19_LLM推理_Slow_Unavailable_操作手册|Slow/Unavailable 操作手册]]、[[13_运维/06_可观测性/02_LLM推理_可观测性_Stack|LLM 推理可观测性 Stack]]

> **标注约定**： ⭐ 基础必会 ｜ ⭐⭐ 工程级 ｜ ⭐⭐⭐ 高级（架构/取舍）｜ 频率： 🔴 高频 ｜ 🟡 中频 ｜ 🟢 低频
> **答题框架**： 每题按 **30 秒口径 → 追问点** 两段式。先给结论，再给量化依据；追问点是面试官最可能深挖的方向。

---

## 0. 必背三要点（面试开场 30 秒总口径）

1. **一切显存与容量问题先算 KV 账**：`每 token KV = 2 × 层数 × KV 头数 × head_dim × dtype 字节`，再乘 `max-model-len × 并发` 就是 KV 池需求。90% 的 OOM、抢占、并发上不去，都能从这一条公式推出来。
2. **Prefill 算力密集、Decode 访存密集**：TTFT 优化靠 prefill 提速和前缀缓存命中；TPOT 优化靠省带宽（KV 量化、投机解码、控制 batch）。长 prefill 阻塞 decode 是多数尾延迟抖动的根因，解法是 chunked prefill。
3. **LLM 服务是长连接、加载重、有缓存亲和性的有状态服务**：限流按并发请求数而不是 QPS；发布靠双实例灰度 + drain，不能原地重启；LB 策略会直接影响前缀缓存命中率——「无状态 Web 那一套」直接搬过来必翻车。

---

## 一、架构与原理（Q1–Q12）

### Q1: PagedAttention 解决什么问题？ ⭐ 🔴

**30 秒口径**： 传统推理按序列最大长度**预留连续显存**存 KV cache，内部碎片 + 外部碎片严重（实测浪费 60%–80%），且相同前缀无法共享。PagedAttention 借鉴操作系统虚拟内存：把 KV cache 切成固定大小的 block（默认 16 token），按需分配、逻辑连续物理分散，用 block table 做映射，显存浪费降到 4% 以下；配合 copy-on-write，beam search 和 n 并行采样自动共享前缀 block。

**追问点**：

- block size 权衡：太小 → 元数据与寻址开销大、kernel 效率下降；太大 → 碎片回升。16 是 kernel 效率甜点值。
- 与 FlashAttention 不冲突：FA 是 attention 计算的 kernel，PagedAttention 是显存管理层；FA 提供支持分页 KV 的 kernel。
- 点破类比：这就是「虚拟页表 + 物理页框」在 KV cache 上的翻版，说出来面试官就知道你真懂。

### Q2: Continuous batching 和 static batching 的区别？ ⭐ 🔴

**30 秒口径**： static batching 攒一批请求，等整批里最长序列生成完才换批，短序列全程空占 GPU；continuous batching 是**迭代级调度**——每个 decode step 结束后，完成的请求立刻退出、等待队列立刻补位，GPU 永远有活干。这是 Orca 论文提出、vLLM/SGLang 都内置的基础能力，也是现代推理引擎吞吐差异的起点。

**追问点**： prefill 计算密集、decode 访存密集，两者混在一个 batch 互相拖累 → 引出 chunked prefill（Q9）。

### Q3: 一个模型的 KV cache 每 token 占多少显存？（现场计算题） ⭐ 🔴

**公式**： `每 token KV 字节 = 2（K 和 V）× 层数 × KV 头数 × head_dim × dtype 字节数`

| 模型 | 层数 | KV 头数 | head_dim | FP16 每 token KV |
|---|---|---|---|---|
| Llama-3-8B | 32 | 8（GQA） | 128 | ≈ 128 KB |
| Qwen2.5-7B | 28 | 4（GQA） | 128 | ≈ 56 KB |
| Llama-3-70B | 80 | 8（GQA） | 128 | ≈ 320 KB |
| DeepSeek-V3（MLA） | 61 | latent 512+64 | — | ≈ 70 KB |

**算力账示例**（面试常让你现场算）： A100-80GB 跑 8B FP16 模型，权重 16 GB，`gpu-memory-utilization=0.9` 下 KV 池约 50 GB → 约 40 万 token 并发容量。若 `max-model-len` 开到 128k，一个请求就可能独占 16 GB KV——**这就是长上下文服务并发上不去的第一原因**。

**追问点**：

- GQA/MQA/MLA 的影响：GQA 按 KV 头数比例缩减；MLA 把 KV 压成一个低秩 latent，比传统 MHA 低一个数量级（口径见 [[10_部署推理/02_推理引擎/33_注意力机制演进_MLA_DSA_混合注意力|MLA 与 DSA 专页]]）。
- KV FP8 直接减半；分层缓存（HBM → DDR → SSD）把容量再往外扩（见 Q53）。

### Q4: vLLM 显存不够时怎么抢占？recompute 和 swap 怎么选？ ⭐⭐ 🔴

**30 秒口径**： KV cache 用尽时 vLLM 会驱逐已运行序列释放 KV。两种策略：**swap** 把 KV 换到 CPU、恢复时换回；**recompute** 直接丢弃、恢复时重算 prefill。V0 基准结论是 recompute 通常更快——现代 GPU 算力富余，重算 prefill 比跨 PCIe 搬 KV 便宜，且 swap 有反复换入换出的抖动问题。V1 以 recompute 为主。

**追问点**：

- 线上 preempt 计数持续增长 = 服务过载的强信号；处置是降 `max-num-seqs`、缩短 `max-model-len` 或扩容，不是调参硬扛。
- 支持优先级调度时，优先保住高优请求、牺牲低优请求。

### Q5: SGLang 的 RadixAttention 和 vLLM 的 Prefix Caching 有什么区别？ ⭐⭐ 🔴

**30 秒口径**： 目标相同——让相同前缀的 KV 只算一次，多轮对话、few-shot、agent 固定 system prompt 场景下 TTFT 和吞吐提升数倍。实现不同：vLLM 按 block 哈希链做前缀匹配（V0 需手动开启，V1 默认开启）；SGLang 用 **radix tree**，任意分支粒度共享、LRU 逐出，配合 cache-aware 路由把同前缀流量路由到同一实例。SGLang 还有 `POST /flush_cache` 手动清缓存（更新权重、隔离脏缓存时用）。

**追问点**：

- 命中率观测：vLLM `cache_hits_total / cache_queries_total`（指标名随版本略有变化）、SGLang `/metrics` 的 cache hit rate。agent 场景命中 70%+ 属正常；命中率低先查流量前缀分布和 LB 是否打散了亲和性。
- 逐出与运行中请求的冲突：引用计数/锁保护正在使用的前缀，不会被逐出。
- 收益上限：命中只是省 prefill 计算，decode 一 token 还是照常算——别把「命中率 90%」说成「吞吐提升 90%」。

### Q6: vLLM V1 架构相比 V0 变了什么？ ⭐⭐ 🟡

**30 秒口径**： 2025 年起 V1 成为默认：EngineCore 拆为独立进程、调度路径大幅简化、prefix caching 和 chunked prefill 默认开启、piecewise CUDA graph、异步调度。效果是吞吐和尾延迟显著改善、调参面收敛（V0 时代很多手动开关不用了）。

**追问点**： 面试官真正想听的是「你怎么跟大版本升级」——pin 版本、读 release note、监控指标名会变、双实例灰度对比。vLLM 迭代快、破坏性变更多，这是它运维成本的主要来源之一（详见 Q33）。

### Q7: SGLang 为什么宣称 zero-overhead 调度？ ⭐⭐ 🟡

**30 秒口径**： decode 阶段 GPU 利用率低，框架 CPU 开销（调度、采样、kernel launch）占比就高。SGLang 三件事：单进程事件循环 + **overlap schedule** 把 CPU 调度藏进 GPU 计算；**CUDA graph** 消 kernel launch 开销；集成 torch.compile 做算子融合。小 batch、低延迟、agent 短输出场景收益明显。

**追问坑**： `--cuda-graph-max-bs` 有上限，实际并发超过它就 fallback 到 eager 模式，性能断崖下降——经典线上坑：压测 OK、上量后 TPOT 翻倍，第一件事查是不是超出了 CUDA graph 覆盖的 batch size（详见 Q12）。

### Q8: 一个请求进来，数据流经过哪些环节？ ⭐⭐ 🔴

**30 秒口径**： API server 收请求、tokenize → 调度器做准入控制和前缀匹配、组装 batch → model runner 执行前向（TP 时走 NCCL 集合通信）→ sampler 采样 → detokenizer 增量解码 → SSE 流式返回。vLLM 是 API server 与 EngineCore 分进程；SGLang 是 tokenizer / scheduler / detokenizer 三进程 + ZMQ 通信。

**价值**： 这题是排查题的框架底座——**排队发生在调度器、算得慢在前向、输出卡顿可能在 detokenizer 或网络**。知道每个环节在哪，才知道先看哪个日志、哪个指标。

**追问点**： tokenizer/detokenizer 为什么独立进程——避免 Python GIL 和 CPU 密集的分词/解码拖慢调度热路径；增量解码按字节边界截断，多字字符不当切分会输出乱码。

### Q9: chunked prefill 是什么？解决什么问题？代价是什么？ ⭐⭐ 🔴

**30 秒口径**： 把一个长 prompt 的 prefill 切成若干块（`max-num-batched-tokens` / `--chunked-prefill-size` 控制，默认 8192 量级），与 decode 混在每个调度步里执行。解决两件事：① 长 prefill 独占 GPU 一整步，同批 decode 请求 ITL 尖刺；② prefill 和 decode 在批内互喂，整体吞吐更平。代价：prefill 本身的 TTFT 略微变长（被切块分摊），调度复杂度上升。

**追问点**： vLLM V0 需 `--enable-chunked-prefill` 手动开启，V1 默认开启；SGLang 有 `--enable-mixed-chunk` 做混合批。块大小的权衡：块越大 prefill 越快完成（TTFT 好）但 decode 抖动越大；块越小越平滑但整体效率略降。

### Q10: 部署 DeepSeek 这类 MLA 模型有什么特别之处？ ⭐⭐ 🟡

**30 秒口径**： MLA 把 KV 压缩成低秩 latent（每 token 每层约 1.1 KB，V3 全模型约 70 KB/token），KV 显存不再是主要矛盾，瓶颈转移到算力和专家权重搬运。因此部署姿势变化：**TP 复制 attention 权重不再划算 → 用 DP attention**（attention 按数据并行切、MoE 按 EP/TP 切）；**开 MTP 投机解码**（模型自带多头，SGLang 实测 1.5–2×）；MoE 开 **EP**，大规模用 wide-EP 跨机；原生 FP8 权重直接加载。V3.2 起叠加 DSA 稀疏注意力，长上下文 prefill 进一步提速。

**追问点**： 完整演进口径（MHA → MQA/GQA → MLA → DSA）见 [[10_部署推理/02_推理引擎/33_注意力机制演进_MLA_DSA_混合注意力|专页]]；PD 分离 + wide-EP 是 DeepSeek 级生产部署的标配组合（见 Q43）。

### Q11: vLLM 和 SGLang 的进程模型分别是什么？为什么这样设计？ ⭐⭐ 🟢

**30 秒口径**： vLLM：API server（前端，管 tokenize/响应）+ EngineCore（调度 + 执行）分进程，TP worker 再各自是子进程或 Ray actor。SGLang：tokenizer / scheduler / detokenizer 三个进程用 ZMQ 串联，调度器是单线程事件循环。共同动机：**把 CPU 密集的分词解码、调度、GPU 执行互相隔离**，避免 GIL 和异常互相拖死。

**追问点**： 多进程架构的运维含义——① 子进程收割不干净会产生幽灵显存（Q28）；② 探针要打到「真实推理路径」而不是只看主进程活着（Q29）；③ 抓栈要 `py-spy` 抓对进程（调度器卡 ≠ tokenizer 卡）。

### Q12: CUDA graph 在推理引擎里的作用和坑？ ⭐⭐ 🟡

**30 秒口径**： decode 每步执行几百个小 kernel，每个 kernel 的 launch 开销（微秒级）在 GPU 算得快时占比显著。CUDA graph 把一整步的 kernel 序列录制下来之后整段回放，消除 launch 开销；vLLM V1 用 piecewise CUDA graph 覆盖 prefill，SGLang 对 decode 全量 capture。代价是**按 batch size 档位预录制**——超过 `--cuda-graph-max-bs` / capture 上限的 batch 回退 eager，性能断崖。

**追问点**：

- 启动日志出现 `Capturing CUDA graphs` / `Capture cuda graph begin` 是正常流程，占用几分钟，不是卡死；此时杀进程会留幽灵显存。
- 排查二分法：怀疑 graph 问题时 `--enforce-eager`（vLLM）/ `--disable-cuda-graph`（SGLang）对照跑一次。
- torch.compile 与 graph 的缓存：冷启动慢的一部分来自编译，用缓存卷可以把二次启动从十几分钟压回分钟级（见 Q45）。

---

## 二、性能调优（Q13–Q24）

### Q13: 显存三件套怎么联动调优？ ⭐⭐ 🔴

**30 秒口径**： 逻辑链是——`max-model-len` 决定单请求 KV 上限，`max-num-seqs` 决定并发上限，`gpu-memory-utilization`（vLLM，默认 0.9）/ `--mem-fraction-static`（SGLang，约 0.85–0.9）决定 KV 池总大小。三者联动：`KV 池 ≈ 总显存 × 利用率 − 权重 − 激活缓冲`；`单请求 KV 峰值 = max-model-len × 每 token KV`。常见错误：`max-model-len` 不设、沿用模型默认 128k，KV 池被少数长请求独占，普通请求全部排队。

**正确姿势**： 按业务流量的 P99 输入 + P99 输出设 `max-model-len`（实际只需 8k 就设 8k），这一刀下去并发容量往往翻几倍。SGLang 把权重 + KV 池静态预留、剩下的留给激活和 CUDA graph——启动报显存不足先降 `--mem-fraction-static`。

**追问点**： `max-num-seqs` 默认值随版本变化，别背默认值——正确方法是用 TPOT SLO 反推（见 Q22）。

### Q14: 线上 TTFT 突然变高，怎么排查？ ⭐⭐ 🔴

**答题框架**（背框架比背答案重要）：

1. **先看排队**：`num_requests_waiting`。队列堆积 → 容量问题（扩容/限流），不是引擎问题。
2. **没排队但 TTFT 高** → 查前缀缓存命中率。命中率掉了（新版本上线清了缓存、LB 换策略打散亲和、流量构成变化）→ prefill 从缓存命中变成全量重算。
3. **命中率高但 TTFT 仍高** → 查 chunked prefill 块大小、是否被超长 prefill 挤占、GPU 是否降频（Q36）。
4. **参照物**：缓存命中的 TTFT 应在几十毫秒量级；1k token 全量 prefill 在 A100 级约百毫秒；偏离一个数量级才叫异常。

### Q15: TPOT / 流式 ITL 周期性抖动，什么原因？ ⭐⭐ 🔴

**30 秒口径**： 按概率从高到低：① 长 prefill 阻塞 decode batch——一个 32k 长输入处理时整个 batch 的 decode 都停着 → 确认 chunked prefill 开启、块大小合理；② 抢占风暴——KV 反复不够、反复 recompute/retract，看 preempt 计数（Q26）；③ 实际 batch size 超出 CUDA graph 覆盖范围，fallback eager（Q12）；④ host 侧抖动——detokenizer 积压、Python GC、监控采集；⑤ GPU 温度墙降频（Q36）。

**追问点**： 区分「整体变慢」和「周期性尖刺」：前者查容量和降频，后者查调度干扰和 host 侧；P99 与 P50 的差值大小是最快的判断依据。

### Q16: 量化怎么选？ ⭐⭐ 🔴

| 方案 | 显存收益 | 精度风险 | 适用 |
|---|---|---|---|
| BF16/FP16 | 基线 | — | 精度兜底、显存充裕 |
| W8A8-FP8 | 约 2× | 低 | H100/H20 首选，H 原生支持 |
| KV cache FP8 | KV 容量 ×2 | 中低 | 与任意权重方案叠加，性价比最高 |
| W4A16（AWQ/GPTQ） | 约 4× | 中 | 显存受限、低并发场景 |

**30 秒口径**： 优先级建议——Hopper 级硬件首选 W8A8-FP8（精度损失小、性能好）；显存紧张、要单卡塞大模型才用 W4A16，大 batch 下反量化成为瓶颈；KV FP8 是性价比最高的叠加项（容量带宽双省），但关注 scale 校准。**所有量化上线前必须过业务评测集回归**，不只跑 MMLU。

**追问点**： batch 小（< 8）时 W4A16 往往最快——decode 是访存瓶颈，权重减半收益最大；batch 大时 FP8 更稳。「吞吐-精度-场景」三角是加分说法。

### Q17: TP / PP / EP / DP attention 怎么选？ ⭐⭐⭐ 🔴

| 并行 | 切什么 | 通信 | 适用 |
|---|---|---|---|
| TP | 权重列切 | 每层 2 次 all-reduce | 尽量不出 NVLink 域（≤ 单机卡数） |
| PP | 按层切 | 点对点 send/recv | 跨机带宽差、模型层数多时叠加 |
| EP | MoE 专家分布 | all-to-all | MoE 必选，大规模 wide-EP 跨机 |
| DP attention | attention 数据维 | 边界 all-gather/reduce-scatter | MLA 模型（DeepSeek 系），避免复制 KV 相关权重 |

**30 秒口径**： 经验法则——TP 不超过单机卡数（卡间 NVLink，每层两次 all-reduce 扛得住；跨机走 IB 开销大）；单机放不下再叠加 PP（代价是流水线气泡）；MoE 开 EP，DeepSeek 级用 wide-EP 跨机；MLA 模型用 DP attention。多实例扩吞吐**永远优先实例间 DP + LB**，而不是无限加大单实例并行度。

**追问点**： 为什么要 DP attention——MLA 的 KV 是共享 latent，TP 会把 attention 权重在卡间复制、通信换不来收益；SGLang 的 `--enable-dp-attention` 就是 attention 按 DP、MoE 按 EP 的混合布局。

### Q18: 投机解码什么时候值得开？ ⭐⭐ 🟡

**30 秒口径**： 原理是小模型/ngram/EAGLE/MTP 一次猜 k 个 token、大模型一次并行验证，把多步访存密集 decode 压成一步算力密集验证。DeepSeek 自带 MTP 头，SGLang 上实测 1.5–2× 加速；EAGLE-3 收益更高。**适用**：接受率高、batch 小、低延迟敏感。**反适用**：高并发大 batch 时验证挤占算力，可能反而变慢——它是「低并发低延迟」的武器，不是无脑开关。

**追问点**： 验证为什么快——猜中的 k 个 token 一次前向并行出结果，等价于把 k 次权重读取合成 1 次；accept rate 是核心监控量（SGLang `/metrics` 有 spec accept length）。

### Q19: 怎么给一个新服务做容量评估和压测？ ⭐⭐ 🔴

**答题框架**：

1. **单请求基线**：1 并发测 TTFT / TPOT，建立物理下限（SGLang 用 `bench_one_batch`，vLLM 用 bench 系列）。
2. **并发梯度扫描**：1→8→32→128，找 TPOT 开始劣化的拐点，拐点附近即 `max-num-seqs` 合理值。
3. **看 goodput 不看裸吞吐**：满足 SLO（如 TTFT P99 < 2s 且 TPOT < 100ms）约束下的有效吞吐才有意义。
4. **流量要真实**：合成数据集的前缀分布和真实差异大，会高估缓存收益——优先回放生产脱敏流量。
5. **容量公式**：实例数 ≈ 目标 QPS × 平均输出 token ÷ 单实例 goodput，再留 30% 余量应对峰值和发布。

**追问点**： 工具——`vllm bench serve`（新版 CLI）与仓库 `benchmarks/`（旧）、`python -m sglang.bench_serving`；关键参数是 `--request-rate`（泊松到达）和输入输出长度分布，固定速率压出的结论会失真。

### Q20: 前缀缓存命中率低，怎么系统性优化？ ⭐⭐ 🟡

**30 秒口径**： 三层动作：① **路由亲和**——SGLang router 的 cache-aware 策略把同前缀请求路由到同一实例，网关层做会话粘性（session affinity）；② **流量侧**——把公共前缀（system prompt、few-shot 示例）收敛成完全相同的字节串，差一个空格都不命中；③ **容量侧**——给 radix/prefix cache 留足显存，避免高命中率前缀被逐出后反复重算。观测：命中率分位 + 被 flush/逐出的次数。

**追问点**： 命中率不是越高越好——极端高命中率说明流量高度同质（如 agent 批量任务），此时还要防「缓存击穿」：热点前缀过期瞬间大量请求同时 miss。多实例各自维护缓存，扩容瞬间命中率会跌，需要预热期。

### Q21: 结构化输出（JSON schema）的引擎侧实现和开销？ ⭐⭐ 🟡

**30 秒口径**： 引导解码把 schema 编译成 FSM/文法，每步采样时对 logits 做 mask，保证输出必然合法。vLLM V1 和 SGLang 都用 xgrammar；开销主要在**首次 schema 编译**（复杂 schema 可到秒级），编译结果缓存后逐步推理接近无损。API 侧入口：vLLM 的 guided_json / structured_outputs，OpenAI 兼容 response_format。

**追问点**： 运维含义——① schema 种类爆炸时编译缓存膨胀、CPU 升高；② 大枚举/深嵌套 schema 编译慢要预热；③ mask 对采样分布有轻微影响，评测集要覆盖结构化场景。

### Q22: 怎么用 TPOT SLO 反推 max-num-seqs？ ⭐⭐ 🔴

**30 秒口径**： decode 一步耗时 ≈ `（权重读取 + batch 内 KV 读取总量）÷ 显存带宽`。给定 TPOT 预算 t（如 50ms），解不等式：`(权重字节 + N × 平均上下文 × 每 token KV) ÷ 带宽 ≤ t`，得到 batch 上限 N。举例：8B FP16（16 GB 权重）在 A100（约 2 TB/s）上，单步权重读取就占 8ms；平均上下文 8k、KV 128 KB/token 时，每加一个请求 KV 读取约 +1ms → N ≈ 40 左右。**结论：并发上限由带宽和 SLO 共同决定，不是参数表上的默认值。**

**追问点**： 这个模型解释了三个常见现象——上下文越长并发越低（KV 读取线性涨）、量化 KV 等效扩并发（分母减半）、投机解码等效省带宽（一步出多 token）。

### Q23: VLM（视觉模型）部署有什么差异？ ⭐⭐ 🟢

**30 秒口径**： 三点差异：① 一张图展开成几百到几千个视觉 token，KV 占用是文本的十倍量级，`max-model-len` 和 KV 预算要按视觉 token 算；② 预处理（图像编码）是 CPU/GPU 前置开销，要限制单请求图片数与分辨率（vLLM `--limit-mm-per-prompt`）；③ 多模态批的 `max-num-batched-tokens` 要能容纳视觉 token，否则大图请求排队甚至 OOM。

**追问点**： 监控要区分文本/图像请求的 TTFT 分布，混在一起 P99 会被大图请求拖爆；视频理解token 量再上一个数量级，通常独立池部署。

### Q24: 多 LoRA 服务怎么做？ ⭐⭐ 🟢

**30 秒口径**： vLLM `--enable-lora` + 动态加载接口、SGLang `--enable-lora`，都支持多 adapter 常驻、按请求切换。价值是**一个基座服务多业务租户**：基座权重只加载一份，各业务挂自己的 adapter（风格/领域微调），显存开销小、发布基座一次全量生效。

**追问点**： 坑——① adapter 换入换出有调度开销，命中率低的冷 adapter 会被反复加载，用 `max_loras`/`max_cpu_loras` 控制；② adapter rank 越大开销越大；③ 灰度时基座与 adapter 版本要配对管理，回滚要连 adapter 一起回。

---

## 三、故障排查与线上救火（Q25–Q38）

### Q25: 启动就 OOM，怎么分类处理？ ⭐⭐ 🔴

**30 秒口径**： 分三类。① **权重就放不下**：模型规模 vs 显存硬约束 → 量化或加 TP；② **权重放下但 KV 池分配失败**（vLLM 报 `No available memory for the cache blocks`）：激活/缓冲吃掉余量 → 降 `max-model-len`、降 `max-num-seqs`、或提高 `gpu-memory-utilization`（若尚有余量）；③ **CUDA graph capture 阶段 OOM**：降 `--cuda-graph-max-bs`（SGLang），或先 `--enforce-eager` 跑起来再定位。碎片类问题试 `PYTORCH_CUDA_ALLOC_CONF=expandable_segments:True`。

**追问点**： 排查顺序——先 `nvidia-smi` 确认卡是空的（防残留进程占显存），再算权重账，再看是哪个阶段 OOM；报错信息里的「free memory / desired utilization」两个数字直接指明方向。

### Q26: 运行时抢占风暴（preempt/retract 激增）怎么处理？ ⭐⭐ 🔴

**SOP**：

1. **确认**：vLLM 看 preempt 计数持续增长；SGLang 日志出现 `Decode out of memory happened. #retracted_reqs: N`。
2. **止血**：降 `max-num-seqs` / `--max-running-requests`（少并发、少抢占，goodput 反而升）；紧急时可重启实例清掉积压长请求。
3. **根治**：降 `max-model-len` 到业务真实需要；KV FP8 减半占用；SGLang 调高 `--schedule-conservativeness`（默认 1.0，调大更保守准入，减少 retract）；流量侧拆分长短请求到不同实例池。
4. **验证**：preempt 归零后对比 goodput——抢占风暴期间吞吐「看起来在跑」但大量算力在重算，归零后 P99 明显改善。

### Q27: 多机 TP 起服务 NCCL hang 或超时，怎么查？ ⭐⭐⭐ 🔴

**SOP**：

1. `NCCL_DEBUG=INFO` 看卡在哪个初始化阶段；**找第一个报错/先退出的 rank 的日志**——NCCL 超时大多是某个 rank 先挂、其他 rank 等它等出来的超时。
2. 网络连通性：跨机 IB/RoCE 通不通、防火墙端口、网卡降速。
3. **K8s 经典坑**：`/dev/shm` 太小（Docker 默认 64 MB），NCCL 走共享内存失败 → `--shm-size` 或 emptyDir medium: Memory；虚拟化环境 P2P 被禁 → `NCCL_P2P_DISABLE=1`；共享内存彻底不可用 → `NCCL_SHM_DISABLE=1`（有性能代价）。
4. 硬件层：`dmesg` 查 Xid 错误（GPU 硬件异常码），ECC 报错的卡先隔离。
5. 恢复：确认无残留进程（Q28）再重启；反复在同节点挂 → 把节点隔离换卡。

**加分句**： 「NCCL 问题九成不是 NCCL 本身，是『谁先死的』问题——所以我的第一步永远是找最早出现异常的那个 rank 的日志。」

### Q28: 进程退出了但显存没释放（幽灵占用），怎么处理？ ⭐⭐ 🟡

**30 秒口径**： `nvidia-smi` 看不到进程但显存被占，通常是残留 IPC 句柄或僵尸子进程——vLLM/SGLang 多进程架构里 EngineCore/worker 没被父进程正确收割。处理：`fuser -v /dev/nvidia*` 找持有者 → kill；容器场景直接重建 Pod。预防：容器里用 `tini` 等 init 进程转发信号，保证 SIGTERM 链路传到所有子进程。

### Q29: liveness 探针为什么推荐 `/health_generate` 而不是 `/health`？ ⭐⭐ 🔴

**30 秒口径**： SGLang 的 `/health` 只确认进程活着；`/health_generate` 真实跑一步前向，能发现「进程在、但推理已卡死」的假活（CUDA hang、NCCL 半死）——LLM 服务最常见的假活恰恰是这种。vLLM 的 `/health` 会走到引擎事件循环，能反映调度器是否还响应。**注意**：liveness 频率别太高，`/health_generate` 有真实推理开销，不适合秒级探针；更忌讳用 `/v1/chat/completions` 当探针（占并发、费用、放大故障）。

### Q30: 服务雪崩：堆积 → 超时重试 → 更堵，怎么破？ ⭐⭐ 🔴

**30 秒口径**： 核心思路是「宁可快速失败，不要无限排队」。服务端：设排队上限，超过直接 429 让客户端退避；客户端：指数退避 + 抖动（jitter），绝不裸重试；入口：LB 层熔断。LLM 特有：**流式连接生命周期可达分钟级**，占着并发不放——限流必须按「并发请求数」而不是 QPS；重试语义要注意流式已输出一半的请求不能简单重放（会造成重复扣费/重复输出）。

### Q31: 输出质量异常：乱码、无限重复、把 `<think>` 标签吐出来，查什么？ ⭐⭐ 🔴

**30 秒口径**： 按命中率排：① chat template 不匹配——换模型没换 template、tokenizer 版本不配；② **推理模型没配 parser**——SGLang `--reasoning-parser`（deepseek-r1、qwen3 等）、工具调用 `--tool-call-parser`（qwen25、llama3 等），不配就把 `<think>` 内容或原始 JSON 吐给用户，2025 年以来最常见的新坑；③ 量化质量（FP8 校准差、AWQ 分组不对）；④ 采样参数（repetition penalty 调猛伤连贯性）。排查：绕过业务代码，curl 直接打 `/v1/chat/completions` 最小复现。

### Q32: 流式请求客户端断开会怎样？ ⭐⭐ 🟡

**30 秒口径**： 引擎会检测断连并 abort、释放 KV；但**代理层不透传断连就会白算整个回复**——SSE 场景必须确认代理配置（nginx `proxy_buffering off`、读超时大于最长生成时间）。反直觉点：断掉的请求前缀留在 prefix cache / radix cache 里，用户重试反而命中缓存 TTFT 更快——「白算但没全白算」。

### Q33: 版本升级的踩坑与防护？ ⭐⭐ 🔴

**30 秒口径**： 风险集中三点：CLI 参数改名/默认值变化（V0→V1 行为差异大）、监控指标名变更导致断线、特定模型在新版本效果回退。防护三板斧：**镜像完全固化**（不 ：latest）、**golden dataset 回归**（固定几百条请求，对比升级前后吞吐 + 质量双基线）、**双实例灰度**（新版本起好 → 小流量 → 全量）。vLLM 尤其要快读 release note，SGLang 相对稳但 MoE/投机解码参数更新频繁。

### Q34: 启动失败杂症（除 OOM 外）有哪些高频原因？ ⭐⭐ 🟡

**30 秒口径**： ① 模型文件不完整——下载中断、safetensors 损坏，校验 sha256 重下；② HF 网络受限——内网用镜像源或 ModelScope，init container 预拉；③ 镜像 CUDA 与 GPU 算力不匹配——报 `no kernel image is available for execution`，换镜像；④ `--trust-remote-code` 未加导致自定义模型代码拒载（确认仓库可信后再加）；⑤ FlashInfer 等后端首次 JIT 编译慢——挂缓存卷，二次启动恢复；⑥ TP 尺寸与可见卡数不一致、`CUDA_VISIBLE_DEVICES` 串位。

### Q35: 你的排查工具箱有什么？ ⭐⭐ 🔴

**30 秒口径**（展示广度）： 日志层——启动 warning、第一个异常 rank；GPU 层——`nvidia-smi dmon`（利用率/功耗/温度）、DCGM 上监控、`dmesg` 查 Xid；进程层——`py-spy dump` 抓 Python 栈（hang 神器）、`torch.cuda.memory._dump_snapshot()` 抓显存分配；内核层——`nsys`/`ncu` profile（能说出「用 nsys 看过一步 decode 的 timeline」就很加分）；复现层——降并发、缩短输入做最小复现，然后 GitHub issues 搜关键字。

### Q36: GPU 温度墙怎么伪装成「性能退化」？ ⭐⭐ 🟢

**30 秒口径**： 症状——服务「慢性变慢」、分位数缓慢劣化、多发生在下午或长时间高负载后；根因——散热不足/机柜风墙导致 GPU 降频。验证：DCGM 看 temperature 与 clocks、throttle 原因码；对比「冷机」基线。处置：限功率、负载错峰、机房散热层解决。**运维含义**：性能告警不能只看软件指标，硬件遥测要同屏对照。

### Q37: GPU util 95% 但吞吐很低，怎么回事？ ⭐⭐ 🟡

**30 秒口径**： `nvidia-smi` 的 util 是「有 kernel 在跑」的时间占比，不代表算力饱和。decode 是小 kernel 访存型负载，util 可以很高但 SM 和带宽都没吃满——**假饱和**。真实产能看 `tokens/s/卡`；定位用 `nsys` 看一步 decode 的时间线，或对比大 batch 下的吞吐增量。这也是「实例间扩容比单实例加大 TP 更划算」的原因之一。

### Q38: SGLang 报 watchdog timeout 怎么处理？ ⭐⭐ 🟢

**30 秒口径**： watchdog 检测到调度器/前向长时间无响应会主动 crash——它本身是保护机制。根因通常是：某个 rank 集合通信等待（对应 Q27）、单卡硬件异常（Xid/ECC）、或驱动问题。排查顺序：找最早的异常日志 → `dmesg` Xid → NCCL_DEBUG 复现。不要单纯调大 watchdog 超时来「解决」，那是把 hang 拖成更大的事故。

---

## 四、部署、K8s 与容量规划（Q39–Q48）

### Q39: K8s 上部署 LLM 推理服务的检查清单？ ⭐⭐ 🔴

**30 秒口径**： ① 共享内存：`--shm-size` 或 emptyDir medium: Memory 挂 `/dev/shm`（NCCL 依赖）；② 模型分发：init container 从对象存储/PVC 拉模型，节点本地缓存盘预热；③ 终止：`terminationGracePeriodSeconds` 调大（流式请求活几分钟）+ preStop 先摘流量再等 in-flight；④ 探针：readiness 接 `/health`，liveness 谨慎（误杀正在长生成的实例代价大）；⑤ GPU 拓扑：多卡多机用拓扑感知调度，NVLink 域内优先；⑥ 资源与 `TP` 一致，不超卖。

### Q40: 模型加载要 10 分钟，怎么做滚动发布？ ⭐⭐ 🔴

**30 秒口径**： LLM 运维区别于普通服务的核心点：**不能原地重启**。标准流程：新 Revision 起独立实例 → 加载完做 warmup（打几发真实请求触发 CUDA graph 与缓存）→ LB 权重灰度切流 → 旧实例 **drain**：停止接新请求、等 in-flight 流式完成（设 drain 超时上限，到点强断并记录）→ 下线。模型本地盘缓存可把加载从 10 分钟压到 1–2 分钟（配合 Q45 冷启动优化）。

### Q41: 监控指标清单和告警基线怎么定？ ⭐⭐ 🔴

| 指标 | 含义（vLLM / SGLang） | 告警建议 |
|---|---|---|
| KV cache 使用率 | `gpu_cache_usage_perc` / `token_usage` | 持续 > 90% 预警，逼近抢占 |
| 抢占次数 | preempted / retract 计数 | > 0 持续增长即过载 |
| 等待队列 | `num_requests_waiting` / `num_queue_reqs` | 增长 = 容量不足 |
| 在跑并发 | `num_requests_running` / `num_running_reqs` | 贴近 max-num-seqs 说明该扩容 |
| TTFT / TPOT P99 | histogram 分位数，不看均值 | 按业务 SLO 定 |
| 前缀命中率 | cache hit rate | 环比骤降即异常（查 Q20） |
| 生成吞吐 | tokens/s/卡 | 容量规划的核心输入 |
| GPU 遥测 | DCGM：利用率、功耗、温度、ECC | 温度墙、硬件故障 |
| E2E 延迟 | `e2e_request_latency_seconds` | 用户视角总时长 |
| 投机解码接受率 | spec accept length（开启时） | 骤降说明 draft 失配 |

**加分句**： 「LLM 服务不能只看 GPU util——decode 阶段 util 90%+ 但实际访存瓶颈，吞吐远没到顶。产能看 tokens/s/卡，健康度看 KV 使用率和抢占计数，体验看 TTFT/TPOT 分位数。」

完整可观测体系见 [[13_运维/06_可观测性/02_LLM推理_可观测性_Stack|LLM 推理可观测性 Stack]]。

### Q42: 容量规划计算题：QPS = 5、平均输入 2k、输出 500 token，8B FP16 单卡 A100 够吗？ ⭐⭐⭐ 🔴

**30 秒口径**（演示计算过程）：

1. 单流 decode：权重 16 GB ÷ 带宽 2 TB/s ≈ 8ms/token → TPOT ≈ 8ms，远低于 50ms SLO ✓
2. 并发需求（Little's Law）：单请求 E2E ≈ TTFT 0.2s + 500 × 8ms ≈ 4.2s → 并发 ≈ 5 × 4.2 ≈ 21
3. KV 需求：21 × (2000 + 500) × 128 KB ≈ 6.7 GB；A100-80G 扣掉权重和激活后 KV 池约 50 GB ✓
4. 结论：单实例够用且有余量，**瓶颈在带宽不在显存**；生产建议两实例做 HA + 发布滚动。

**追问点**： 把模型换成 70B（KV 320 KB/token、权重 140 GB）同一道题，答案变成「单卡放不下 → TP4 + KV FP8 + 限 max-model-len」——面试官常这样追加。

### Q43: PD 分离是什么？什么时候值得上？ ⭐⭐⭐ 🟡

**30 秒口径**： prefill 算力密集、decode 访存密集，混部互相干扰；PD 分离拆成两个 GPU 池，prefill 算完把 KV 经高速网络（Mooncake/NIXL/LMCache）传给 decode 池。SGLang 有一等支持，vLLM 走 KV connector 生态。**适用**：百卡以上集群、长输入短输出（RAG/文档问答）、prefill 抖动严重影响 decode SLO。**不适用**：小规模——KV 传输与运维复杂度远大于收益。

**追问点**： 配比、KV 迁移时间建模、单双池取舍的完整口径见 [[21_面试岗位/19_LLM平台工程师/06_PD分离_面试复习|PD 分离面试复习]]；提一句「一切围绕 T_transfer < T_prefill」就是行家。

### Q44: 自动扩缩容用什么信号？ ⭐⭐⭐ 🟡

**30 秒口径**： GPU util 不合格（假饱和）；**排队深度 + KV 使用率 + TTFT SLO 违约率**是更好的伸缩信号。缩容侧：低峰用 sleep mode / scale-to-zero（开发测试场景），但生产常驻池保留最小容量——重新拉起要重新加载模型，分钟级冷启动让激进缩容得不偿失。生态：AIBrix、llm-d、KServe、NVIDIA Dynamo 都在做 LLM 原生编排（KV 感知路由、PD 分离编排）。

**追问点**： 相关页面 [[10_部署推理/03_推理优化/15_推理_Autoscaling_and_负载均衡|推理 Autoscaling 与负载均衡]]；扩容瞬间的两个坑：缓存命中率归零（Q20）、新实例 warmup 期请求劣化——都要靠预热期流量爬坡解决。

### Q45: 冷启动怎么优化？ ⭐⭐ 🟡

**30 秒口径**： 四层：① 权重就近——本地 NVMe 缓存盘、镜像内置权重或 PVC，把网络下载从分钟级压到秒级；② 页缓存预热——启动后先读一遍权重文件；③ 编译缓存——CUDA graph capture 和 torch.compile 结果挂持久卷复用，二次启动从十几分钟回分钟级；④ warmup 请求——对外服务前打几发真实形状请求，触发各种 batch size 档位的 graph 和缓存，readiness 再放流量。

### Q46: 多实例负载均衡怎么选型？ ⭐⭐ 🟡

**30 秒口径**： 两种拓扑：**独立实例 + 外部 LB**（每实例 TP 完整、隔离性好，主流）vs 引擎内置 DP（vLLM data parallel、SGLang `--dp`，省网关但耦合）。LB 策略要点：**不能纯 least_conn/round-robin**——会把会话前缀打散、摧毁缓存命中率；用 SGLang router 的 cache-aware 策略或网关会话粘性。配套：健康检查剔除慢实例、权重按实例算力分配、灰度按权重切。

**追问点**： 见 [[10_部署推理/03_推理优化/15_推理_Autoscaling_and_负载均衡|Autoscaling 与负载均衡]]；多实例下「缓存总命中率」要按实例分维度看，聚合值会掩盖单实例击穿。

### Q47: 推理服务的安全基线？ ⭐⭐ 🟢

**30 秒口径**： ① 鉴权放网关，`--api-key` 只做实例间最低防护；② `--trust-remote-code` 只对可信模型仓开启，最小化；③ 模型供应链——pin revision/校验哈希，镜像固化；④ 日志脱敏——prompt 响应落盘要过合规（敏感信息、license）；⑤ 多租户——配额、优先级、按租户限流，防止单租户挤占；⑥ 越狱/注入是应用层问题，但引擎侧日志与输出审计要能配合追溯。

### Q48: 成本优化有哪些抓手？ ⭐⭐ 🟡

**30 秒口径**： 按性价比排：① **右尺寸**——`max-model-len` 砍到真实需要、量化（FP8 权重 + KV），同一张卡容量翻倍；② **缓存复用**——前缀命中省的是真金白银的 prefill 算力；③ **错峰**——低峰缩容、离线批任务填充谷时段；④ **单位成本度量**——建立 `$/百万 token` 看板，一切优化对着这个数字做；⑤ 激进项——spot 实例跑可中断批任务（要接受重新加载成本）、PD 分离让两类卡各得其所。

---

## 五、选型与对比（Q49–Q53）

### Q49: vLLM 和 SGLang 怎么选？ ⭐⭐ 🔴

| 维度 | vLLM | SGLang |
|---|---|---|
| 起源 | UC Berkeley，PagedAttention（SOSP 2023） | LMSYS/UCSD，RadixAttention（NeurIPS 2024） |
| 核心优势 | 模型覆盖最广、生态最大、多硬件、社区默认 | 前缀共享（radix tree）、调度开销低、DeepSeek 系 MoE 部署领先（EP/MTP/PD 分离） |
| 典型场景 | 通用服务、多模型异构、硬件多样 | agent/多轮对话（前缀命中高）、DeepSeek 大规模部署、结构化输出 |
| 运维特点 | 迭代快、破坏性变更多、文档社区最全 | 调参面较细、agent 场景性能天花板更高 |

**30 秒口径**： 默认 vLLM（生态与覆盖面），前缀密集（agent、多轮）和 DeepSeek 级 MoE 大规模部署优先试 SGLang。**必须补一句**：「两者演进都极快，结论半衰期只有几个月，选型以自己真实流量的 benchmark 为准」——这句体现工程判断力。

### Q50: 加上 TRT-LLM / LMDeploy / llama.cpp 的全景怎么讲？ ⭐⭐ 🟡

**30 秒口径**： **TensorRT-LLM**——NVIDIA 官方、单模型极致性能，代价是编译构建链重、模型覆盖与迭代速度不如开源引擎，适合固定模型 + 固定硬件榨性能；**LMDeploy**（TurboMind）——国产生态、开箱即用性能好；**TGI**——先行者、生态势头减弱；**llama.cpp**——端侧/CPU/Metal，局域网与边缘场景。一线互联网自托管主力基本在 vLLM/SGLang/TRT-LLM 三家；引擎层对比细节见 [[10_部署推理/02_推理引擎/17_LLM_推理引擎_选型_指南|LLM 推理引擎选型指南]]。

### Q51: 给我一套选型决策流程？ ⭐⭐ 🟡

**30 秒口径**： 第一层：能用 API 就不自托管（团队 < 5 人或流量 < 每天千万 token 级，自托管的运维成本大概率不划算）。第二层：自托管先 vLLM 跑基线（覆盖面最广、坑的社区答案最多）。第三层：以下信号换/加 SGLang——流量前缀重（多轮、agent）、DeepSeek 系 MoE 大规模、结构化输出占比高。第四层：模型固定 + 硬件固定 + 性能差最后 20% 决定成败 → TRT-LLM。端侧/离线 → llama.cpp/Ollama。

### Q52: 为什么运维岗要求两个引擎都会？ ⭐ 🟢

**30 秒口径**： 因为招聘方要的是**引擎无关的推理服务能力**：KV 账、调度干扰、故障树、容量模型在两个引擎间 80% 重合，差异只在参数名和实现细节。答法：以机制为主线（本页 Q1–Q12），把引擎差异当「方言」而不是「外语」——这也是这份材料按主题而不是按引擎组织的原因。

### Q53: 2026 年推理服务的趋势判断？（开放题） ⭐⭐⭐ 🟡

**30 秒口径**（给观点 + 依据）： ① **PD 分离**从大厂专属走向标配，KV 传输生态（Mooncake/NIXL/LMCache）成熟是推动力；② **wide-EP** 撑起 DeepSeek 级 MoE 部署，EP 与网络拓扑深度耦合；③ **KV cache 分层**（HBM → DDR → SSD）让长上下文与多轮场景容量不再卡死在 HBM；④ **投机解码标配化**（MTP 随模型自带），从可选优化变成部署默认项；⑤ **FP8 → FP4** 沿硬件代际推进，KV 量化普及；⑥ 编排层收敛出专门生态（AIBrix/llm-d/Dynamo），推理引擎之上长出「LLM 网关 + 编排」层。收尾句：「引擎层格局一年一变，但访存瓶颈、KV 经济学、SLO 反推容量这三个底层规律不变——所以我押注的是把底层学扎实。」

---

## 六、场景叙事题模板（可直接改写为亲身经历）

> 面试官问「讲一次你处理的线上故障」时，用 STAR 结构，**必须有数字**。以下两个模板覆盖最高频的两类故事，按自己环境改写细节。

### 案例模板 A：上线后 TTFT 劣化 7 倍（缓存亲和性被破坏）

- **S（情境）**： 推理服务 4 实例，SGLang，多轮对话业务，TTFT P99 稳定 400ms，radix cache 命中率 71%。
- **T（任务）**： 某次网关侧例行变更（LB 策略从会话粘性换成全局 least_conn）后，监控显示 TTFT P99 从 400ms 涨到 2.8s。
- **A（行动）**： 按「先排队、再缓存」框架排查——waiting 队列为空，排除容量问题；查 cache hit rate 从 71% 掉到 9%，定位到 LB 变更把同会话请求打散到不同实例，radix cache 全部 miss；回滚 LB 策略并推动变更评审增加「缓存亲和性」检查项。
- **R（结果）**： 回滚 10 分钟内命中率恢复到 68%，TTFT P99 回到 420ms；沉淀了「LB 策略变更必须连带评估前缀命中率」的 checklist。
- **教训句**： 「前缀缓存类优化的效果依赖流量亲和性——引擎内省缓存，网关外亲和路由，两头是同一个优化，改哪头都要看另一个头的指标。」

### 案例模板 B：压测通过、生产峰值抢占风暴（长尾请求挤兑 KV）

- **S（情境）**： vLLM 服务，压测 200 并发平均长度 2k 通过；大促真实流量出现 32k 长尾请求。
- **T（任务）**： 峰值期 TPOT P99 从 45ms 恶化到 400ms，preempt 计数持续增长。
- **A（行动）**： 认定 KV 挤兑——按 KV 账复核：默认 `max-model-len` 128k 下单个长尾请求占 16 GB KV；处置：`max-model-len` 降到 32k（覆盖 P99.9 输入输出），`max-num-seqs` 从默认降到与 TPOT SLO 匹配的值，确认 chunked prefill 开启；超长请求单独走小并发实例池。
- **R（结果）**： preempt 归零，TPOT P99 回到 50ms 内，同等硬件 goodput 提升约 30%（此前大量算力耗在重算被抢占的请求）。
- **教训句**： 「容量按 KV token 总量算，不按请求数算；平均数会骗人，P99.9 的长尾才是显存的定价者。」

---

## 七、快问快答 40 题（一句话口径，考前速刷）

| # | 问题 | 一句话口径 |
|---|---|---|
| 1 | vLLM 的 KV block 默认多大？ | 16 token |
| 2 | `--gpu-memory-utilization` 默认？ | 0.9 |
| 3 | vLLM V1 默认开启哪两个特性？ | Prefix Caching 与 Chunked Prefill |
| 4 | SGLang 默认调度策略？ | `lpm`（最长前缀匹配优先） |
| 5 | Llama-3-8B FP16 每 token KV？ | ≈ 128 KB |
| 6 | Llama-3-70B FP16 每 token KV？ | ≈ 320 KB |
| 7 | DeepSeek-V3（MLA）每 token KV 量级？ | ≈ 70 KB（FP16） |
| 8 | KV 用 FP8 的收益？ | 容量与带宽双双减半 |
| 9 | Decode 的瓶颈类型？ | 访存（HBM 带宽）密集 |
| 10 | Prefill 的瓶颈类型？ | 算力密集 |
| 11 | A100 单流 decode 上限（8B FP16）？ | ≈ 120–130 token/s（16 GB ÷ 2 TB/s ≈ 8ms/token） |
| 12 | 抢占计数持续增长说明什么？ | KV 过载——先降并发，再谈调参 |
| 13 | vLLM V1 抢占默认策略？ | recompute（重算） |
| 14 | SGLang 对应抢占的动作与参数？ | retract；`--schedule-conservativeness` 调节 |
| 15 | SGLang 清空缓存接口？ | `POST /flush_cache` |
| 16 | 哪个探针能发现「进程在但推理死了」？ | SGLang `/health_generate` |
| 17 | Docker 默认 shm 多大？ | 64 MB（NCCL 不够用） |
| 18 | K8s 里怎么扩 shm？ | emptyDir medium: Memory 挂 `/dev/shm` |
| 19 | 幽灵显存怎么清？ | `fuser -v /dev/nvidia*` 找持有者后 kill |
| 20 | 量化优先级？ | W8A8-FP8 → KV FP8 叠加 → W4A16（显存受限时） |
| 21 | 投机解码什么场景别开？ | 高并发大 batch（验证挤占算力） |
| 22 | MTP 是什么？ | 模型自带的多 token 预测头做投机解码（DeepSeek 系） |
| 23 | TP 的通信原语与频率？ | 每层 2 次 all-reduce，尽量不出 NVLink 域 |
| 24 | MoE 大模型开什么并行？ | EP（专家并行）；DeepSeek 系配 DP attention |
| 25 | chunked prefill 解决什么？ | 长 prefill 阻塞同批 decode，平滑 TTFT/ITL |
| 26 | max-model-len 怎么定？ | 业务 P99 输入 + P99 输出，不用模型默认值 |
| 27 | goodput 是什么？ | 满足 SLO 约束的有效吞吐 |
| 28 | Little's Law？ | 并发 = 到达率 × 平均停留时间 |
| 29 | 前缀命中 TTFT 量级？ | 几十 ms；1k token 全量 prefill 百 ms 量级（A100 级） |
| 30 | LB 为什么不能乱选 least_conn？ | 打散会话亲和，摧毁 radix/prefix 命中率 |
| 31 | 网关对 SSE 要关什么？ | `proxy_buffering off`，读超时大于最长生成时长 |
| 32 | 滚动发布三步？ | 新实例起好 warmup → 灰度切流 → 旧实例 drain |
| 33 | drain 超时到了怎么办？ | 强断并记录——流式请求生命周期可达分钟级 |
| 34 | GPU util 95% 但吞吐低说明什么？ | decode 假饱和（访存瓶颈），看 tokens/s/卡 |
| 35 | 温度墙什么症状？ | clocks 降频、「慢性变慢」，DCGM 看温度与 throttle 原因 |
| 36 | `no kernel image available`？ | 镜像 CUDA 与 GPU 算力不匹配，换镜像 |
| 37 | 结构化输出用什么引擎？ | xgrammar（vLLM V1 与 SGLang 同用），开销在首次编译 |
| 38 | vLLM 指标入口？ | `/metrics`，Prometheus 指标 `vllm:` 前缀 |
| 39 | SGLang 观测入口？ | `/metrics` + `/get_server_info` |
| 40 | 前缀命中率骤降先查什么？ | LB 策略/流量构成变化，其次是否有人 flush |

---

## 八、报错信息速查表

| 报错/日志关键字 | 根因 | 处置 |
|---|---|---|
| `CUDA out of memory`（torch） | 激活/权重超限或碎片 | 降 batch/`max-num-batched-tokens`、量化、加 TP；碎片试 `expandable_segments:True` |
| `No available memory for the cache blocks` | KV 池分配失败 | 降 `max-model-len`/`max-num-seqs`，或余量允许时提 `gpu-memory-utilization` |
| `Free memory ... less than desired GPU memory utilization` | 启动时可用显存就不够 | 先清残留进程（Q28），再降利用率参数 |
| warning: `max seq len ... larger than ... KV cache` | KV 池装不下一条最大长度请求 | 降 `max-model-len` 或加显存——这是警告不是错误，但必须处理 |
| `Decode out of memory happened. #retracted_reqs: N`（SGLang） | KV 用尽触发 retract | 按 Q26 SOP 止血 + 根治 |
| `Watchdog timeout`（SGLang） | 前向/调度长时间无响应 | 按走 Q27/Q38：找最早异常、查 Xid，勿只调大超时 |
| `NCCL ... timeout` / `Connection reset by peer` | 集合通信失败 | 找第一个异常 rank；查网络/shm/P2P（Q27） |
| `no kernel image is available for execution` | 镜像 CUDA 与 GPU 算力不匹配 | 换与 GPU 代际匹配的镜像 |
| safetensors 头部错误/文件截断 | 模型下载损坏 | 校验 sha256 后重下 |
| `Model ... is not supported` | 架构未支持或框架过旧 | 升级框架 / 换兼容实现 / 等社区支持 |
| 启动卡在 `Capturing CUDA graphs` | 正常流程（非错误） | 等待数分钟；此阶段勿杀进程（会留幽灵显存） |
| FlashInfer 首次请求巨慢 | JIT 编译进行中 | 预热 + 编译缓存持久卷 |

---

## 九、命令速查

```bash
# ── 部署 ─────────────────────────────────────────────
# vLLM
vllm serve <model> --tensor-parallel-size 2 --max-model-len 16384 \
  --gpu-memory-utilization 0.9          # V1: prefix caching / chunked prefill 默认开启
# SGLang
python -m sglang.launch_server --model-path <model> --tp 8 \
  --context-length 32768 --mem-fraction-static 0.85   # MoE 追加 --enable-ep-moe

# ── 压测 ─────────────────────────────────────────────
vllm bench serve --model <model> --num-prompts 500 --request-rate 10
python -m sglang.bench_serving --backend sglang --num-prompts 500 \
  --random-input-len 1024 --random-output-len 256

# ── 健康与观测 ────────────────────────────────────────
curl -s http://host:8000/health                  # vLLM
curl -s http://host:30000/health_generate        # SGLang（真实跑一步前向）
curl -s http://host:30000/metrics | grep -E 'running|queue|token_usage|cache'
curl -X POST http://host:30000/flush_cache       # SGLang 清 radix cache

# ── 排障 ─────────────────────────────────────────────
nvidia-smi dmon -s pucvmet                       # GPU 利用率/功耗/温度/降频
py-spy dump --pid <scheduler_pid>                # hang 时抓 Python 栈
fuser -v /dev/nvidia*                            # 找幽灵显存持有者
dmesg -T | grep -i xid                           # GPU 硬件错误码
NCCL_DEBUG=INFO <launch cmd>                     # NCCL 初始化与失败阶段
PYTORCH_CUDA_ALLOC_CONF=expandable_segments:True # 显存碎片缓解
```

---

## 十、必背公式与数字

**公式**：

- KV per token：`2 × 层数 × KV 头数 × head_dim × dtype 字节`；KV FP8 减半；MLA 压缩低一个数量级
- 单流 decode 上限（token/s）≈ `显存带宽 ÷ 权重字节数`（每个生成的 token 都要读一遍全部权重）
- 并发上限（TPOT SLO 反推）：`(权重字节 + N × 平均上下文 × KV/token) ÷ 带宽 ≤ TPOT 预算`，解 N
- 容量（Little's Law）：`并发 = QPS × 平均停留时间`；KV 总需求 = `并发 × 平均上下文 × KV/token`

**数字**（量级正确即可，面试不用背到小数）：

- PagedAttention 显存浪费 < 4%（vs 传统连续分配 60–80%）；block 默认 16 token；`gpu-memory-utilization` 默认 0.9
- 8B FP16 权重 16 GB；70B FP16 约 140 GB；FP8 权重减半
- 带宽：A100-80G ≈ 2 TB/s；H100 ≈ 3.35 TB/s；H20-96G ≈ 4 TB/s
- 缓存命中 TTFT 几十 ms；1k token 全量 prefill 百 ms 量级（A100 级）
- MTP 投机解码加速 1.5–2×（限低并发场景）；TP 每层 2 次 all-reduce
- Docker 默认 shm 64 MB；SGLang `--mem-fraction-static` 默认约 0.85–0.9；chunked prefill 块默认 8192 量级

---

## 十一、反问面试官（同样加分）

- 「我们生产 TTFT/TPOT 的 SLO 是多少？前缀命中率现在什么水平？」——考察对方是否有量化运维体系
- 「现在 prefill 和 decode 是混部还是已经分离？为什么？」——引出对方架构现状，顺势展示 PD 分离知识
- 「扩缩容依据什么信号——队列深度、KV 使用率还是 GPU util？」——探测对方可观测成熟度
- 「引擎版本怎么管理？升级过一次 vLLM/SGLang 大版本吗？」——探测运维成熟度，也给自己找话题

---

## Related

- [[10_部署推理/02_推理引擎/29_vLLM_深入分析|vLLM 深入分析]]
- [[10_部署推理/02_推理引擎/23_SGLang_深入分析|SGLang 深入分析]]
- [[10_部署推理/02_推理引擎/30_vLLM_Paged注意力_架构|vLLM PagedAttention 架构]]
- [[10_部署推理/02_推理引擎/32_vLLM_SGLang_原理_零基础|vLLM/SGLang 原理零基础]]
- [[10_部署推理/02_推理引擎/33_注意力机制演进_MLA_DSA_混合注意力|注意力机制演进：MLA 与 DSA]]
- [[10_部署推理/02_推理引擎/15_LLM推理_基准测试_指南|LLM 推理基准测试指南]]
- [[10_部署推理/02_推理引擎/17_LLM_推理引擎_选型_指南|LLM 推理引擎选型指南]]
- [[10_部署推理/03_推理优化/03_推理_Tuning_Cheat_Sheet|推理 Tuning Cheat Sheet]]
- [[10_部署推理/03_推理优化/15_推理_Autoscaling_and_负载均衡|推理 Autoscaling 与负载均衡]]
- [[13_运维/02_SRE与可靠性/18_LLM推理_SLO_指南|LLM 推理 SLO 指南]]
- [[13_运维/02_SRE与可靠性/19_LLM推理_Slow_Unavailable_操作手册|LLM 推理 Slow/Unavailable 操作手册]]
- [[13_运维/06_可观测性/02_LLM推理_可观测性_Stack|LLM 推理可观测性 Stack]]
- [[21_面试岗位/26_高级面试问答/01_LLM推理_高级面试问答|LLM 推理高级面试问答]]
- [[21_面试岗位/19_LLM平台工程师/06_PD分离_面试复习|PD 分离面试复习]]

---

*Last updated: 2026-10-22*
