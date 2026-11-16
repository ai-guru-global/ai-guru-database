---
title: "百炼面试视角 25 问"
category: 12_架构基建/Alibaba_Cloud
tags: ["bailian", "interview", "study-notes"]
summary: "五组 25 道百炼面试题的答题框架与知识页索引，附数字口径快问快答与反问面试官建议。"
created: 2026-11-06
updated: 2026-11-06
tier: supporting
aliases: ["百炼面试题", "Bailian Interview Questions"]
sources: []
name_zh: "面试视角（百炼）"
---

# 百炼面试视角 25 问

> 中文简称：面试视角（百炼）

> **一句话理解**: 把百炼系列前 24 页压成 25 道面试题的答题骨架——每题给框架、给依据页，考前按题回扫。

> 基于 bl v2.5.1（2026-11）实测提炼；数字与命令行为以 `bl <cmd> --help` 和官方最新文档为准。

---

## 一、使用方法

- 五组各 5 题：A 平台与生态、B 模型与选型、C 微调与部署、D Agent 基建、E 生产与协议，覆盖售前与解决方案岗从平台认知到生产纪律的完整链路。
- 每题的「依据」指向本系列知识页；面试前把高频题的依据页通读一遍，答题就能落到具体命令与数字。
- 回答模板：一句话结论 → 2-3 个分点 → 一个坑或一个数字（快问快答表提供弹药）。

---

## 二、A 组：平台与生态

**A1. 百炼与 PAI、ModelScope、千问 AI 平台怎么分工？**
答：百炼（Model Studio）是模型服务与应用构建的平台层——调用、微调、部署、Agent、知识库都在这层；PAI 面向机器学习研发全流程；ModelScope 偏开源模型社区与模型探索；千问 AI 平台面向终端用户的轻量使用。一句话：自研训练用 PAI、找开源模型用 ModelScope、做应用与模型服务用百炼。
依据：[[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/01_Bailian_Platform_Overview|百炼平台总览]]、[[12_架构基建/06_云厂商/Alibaba_Cloud/产品/07_MaaS平台_百炼与千问AI平台|MaaS 平台：百炼与千问 AI 平台]]

**A2. DashScope 与百炼是什么关系？base_url 有什么特征？**
答：DashScope 是模型服务的 API 运行时（鉴权用 DASHSCOPE_API_KEY），百炼是平台产品与控制台，两者常合称「百炼/DashScope」。base_url 特征可判身份：默认走 DashScope 域名（OpenAI 兼容走其 compatible-mode 路径）；托管 Agent、Sandbox 等 workspace 级服务解析到 {workspace-id}.{region}.maas.aliyuncs.com；Token Plan 用 token-plan.{region}.maas.aliyuncs.com 专属域名——CLI 靠 host 识别套餐身份，解析顺序为 --base-url、DASHSCOPE_BASE_URL、profile base_url 依次兜底。
依据：[[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/03_Workspace_Auth_Config|工作空间与鉴权配置]]、[[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/04_OpenAI_Compatibility_SDK|OpenAI 兼容与 SDK]]

**A3. workspace 起什么作用？**
答：workspace 是资源与权限的隔离边界——应用、知识库、pipeline、托管 Agent、Sandbox 等资源都归属 workspace；`bl decision`、`bl knowledge` 等命令要按 workspace 端点路由，Sandbox 未显式配置 base_url 时也按 workspace 解析域名。多环境（生产/测试）隔离靠多 workspace 实现。
依据：[[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/03_Workspace_Auth_Config|工作空间与鉴权配置]]、[[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/01_Bailian_Platform_Overview|百炼平台总览]]

**A4. 从 OpenAI 迁移到百炼的标准路径？**
答：三步走——①换端点与密钥：base_url 切到 DashScope 兼容端点、API key 换成百炼的；②换模型名：OpenAI 模型名替换为 Qwen 等百炼模型；③对照官方示例改差异：`bl model code --sdk openai --lang python` 直接生成兼容层示例。参数语义差异（流式、function calling 细节）以 models 层数据逐项核对。
依据：[[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/04_OpenAI_Compatibility_SDK|OpenAI 兼容与 SDK]]、[[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/05_Model_Matrix_Plaza|模型矩阵与广场]]

**A5. 三种登录/套餐形态与各自限制？**
答：①Console 登录：`bl auth login --console`（国际站加 `--console-site international`），monitor/log/alert、quota、usage、workspace 等命令族必须有它；②普通 API Key：`bl auth login --api-key sk-...`，覆盖推理与大部分资源命令；③订阅套餐（Token Plan、Coding Plan）：不能用 `--console`，必须 `--api-key` 登录，且 Token Plan key 不授权 Bailian MCP 搜索（联网搜索要走模型原生路径）。
依据：[[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/03_Workspace_Auth_Config|工作空间与鉴权配置]]、[[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/02_Billing_Plans_And_Cost|计费方案与成本]]

---

## 三、B 组：模型与选型

**B1. capability 代码体系是什么？**
答：模型能力用英文短代码标注——TG 文本生成、Reasoning 推理、VU 视觉理解、IG 图像生成、VG 视频生成、TTS/ASR 语音合成与识别、Realtime 族实时能力、Multimodal-Omni 全模态、ME 多模态嵌入、TR 翻译等。一个模型常带多个 capability，目录按主能力（capabilities[0]）分桶；选型过滤三件套是「输入/输出模态 + capability + features」。
依据：[[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/05_Model_Matrix_Plaza|模型矩阵与广场]]、[[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/06_Model_Selection_Methodology|模型选型方法论]]

**B2. 选型画像 profile 的三态语义是什么？**
答：字段缺失 = 未知；null = 不适用（仅 familyTier 与 familyComparison 会出现，表示单模型家族）；有值 = 已知。两个易错点：`notSuitableFor: []` 表示「无已知限制」，与缺失（未知）不是一回事；profileCompleteness 为 structured-only 时画像没读过文档，只有机械推导字段可信，硬规格（价格/QPM/上下文）永远看顶层字段。
依据：[[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/06_Model_Selection_Methodology|模型选型方法论]]、[[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/22_Docs_Three_Layer_Wiki|文档三层知识库]]

**B3. familyTier 三档怎么用？**
答：flagship 效果首选、balanced 默认均衡、lightweight 成本延迟优先或旧版。用法是「先定档再选型」：企业准确率优先直接 flagship；无明确倾向默认 balanced；预算敏感、高并发高频场景 lightweight 优先。单模型家族该字段为 null——正好与三态语义串起来考。
依据：[[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/06_Model_Selection_Methodology|模型选型方法论]]

**B4. 推荐四步流程中，候选为什么要先去掉快照版本？**
答：四步 = 理解需求提画像 → 筛选候选 → 精选三个（最佳/次优/备选）→ 输出示例代码。候选阶段先剔除带日期后缀的历史快照（如 model-2025-04-28）只留主版本——快照是「锁版本」用途，随主版本演进会被淘汰，常规选型跟主版本才拿到持续更新；同时同家族限量，避免候选同质化。
依据：[[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/06_Model_Selection_Methodology|模型选型方法论]]、[[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/05_Model_Matrix_Plaza|模型矩阵与广场]]

**B5. bl advisor 与人工选型怎么分工？**
答：`bl advisor recommend` 走「意图 → 候选召回 → LLM 排序」的自动化链路，适合入口收敛与初筛；人工负责三件事——画像三态与 tradeoff 解释、pipeline 相邻步骤模态兼容校验、结合预算给多档方案。共同底线：推荐必须基于 models 层实际数据，禁止凭记忆推荐。
依据：[[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/06_Model_Selection_Methodology|模型选型方法论]]、[[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/20_BL_CLI_Guide|bl CLI 指南]]

---

## 四、C 组：微调与部署

**C1. training-type 有哪五种取值？服务端怎么映射？**
答：sft / sft-lora（默认）/ dpo / dpo-lora / cpt。sft-lora 在 CLI 边界映射为服务端 efficient_sft——永远传 CLI 值，不传服务端字符串。边界：cpt 无 -lora 变体；音频 TTS 与图像微调不暴露该 flag（内部固定 sft-lora），仅 `finetune text create` 接受。
依据：[[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/09_Finetune_Pipeline|微调流水线]]

**C2. 写操作前的三道闸是什么？**
答：①预检代替 dry-run：训练前 `bl finetune capability` 确认基座支持，部署前 `bl deploy models` 看可用 plan，`bl deploy list --status RUNNING` 做复用检测；②计费确认硬闸门：lora 是安全默认，mu/ptu 闲置也计费，必须真人确认，非交互环境不能自动开通；③账号就绪：`bl auth status`，authenticated: false 即停。
依据：[[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/09_Finetune_Pipeline|微调流水线]]、[[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/21_Shared_Protocol_Guardrails|共享协议与护栏]]

**C3. finetuned_output 与 deployed_model 为什么不能混用？**
答：finetuned_output 是训练产物名（形如 基座名-ft-时间戳-短 id），直接拿去调用会 404 Model not exist——必须先 `deploy <模态> create` 创建部署；响应里的 deployed_model 才是部署实例 id，推理 `--model` 只认它。同理 deploy create 的 `--model-name`（传入）与推理的 `--model`（调用）含义不同，这组名字复用是最高频错误。
依据：[[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/11_Train_To_Deploy_Playbook|训练到部署实战]]、[[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/10_Deploy_Capacity_Management|部署与容量管理]]

**C4. 三种部署 plan 与闲置计费风险？**
答：lora 按 token 计费、闲置一般不计费（安全默认）；ptu 按 TPM 预留（`--input-tpm` / `--output-tpm`）；mu 容量实例（`--deploy-spec` / `--capacity`）——ptu 与 mu 闲置也计费。模态限制常考：音频 TTS 微调模型只支持 mu，图像生成微调只支持 lora，直接部署基座通常不支持 lora。闲置处置：先 `bl deploy pause` 停计费再决定删不删。
依据：[[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/10_Deploy_Capacity_Management|部署与容量管理]]、[[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/02_Billing_Plans_And_Cost|计费方案与成本]]

**C5. capacity 的 kTPM 与 effective/configured/target 三值？**
答：kTPM 以「千 token/分钟」计容量口径；configured、target、effective 三值并存时先对齐口径——配置值、目标值与实际生效值不是一回事，容量规划与告警基线以实际生效容量为准，避免拿配置值当生效值。配套纪律：scale 传绝对值不是增量；overflow 是模型级溢出策略，预留不足时按策略溢出。
依据：[[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/10_Deploy_Capacity_Management|部署与容量管理]]、[[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/24_Production_Observability|生产实践与可观测]]

---

## 五、D 组：Agent 基建

**D1. agents.yaml 的 IaC 生命周期？为什么 plan 先行？**
答：init 脚手架 → validate（离线校验）→ plan（出变更 diff）→ 真人确认 → apply --yes → destroy --yes（单独确认）。Agent、Environment、Skill、Vault、Deployment、Memory Store 六类资源以 agents.yaml 为唯一事实源；plan 先行是因为 apply/destroy 变更远端持久资源，先看 diff 才知道爆炸半径——禁止自动加 `--yes`，单资源 create 也先出定向 plan。
依据：[[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/13_Managed_Agent_IaC|托管 Agent IaC]]

**D2. Memory Store 的挂载上限与权限模型？**
答：单 Session 至多挂载 8 个 Memory Store；挂载经 `--resource` JSON 指定记忆库逻辑 key、access（如 read_only）与 instructions。生命周期走 agents.yaml IaC、按远端 ID 识别（同名不等于同一库）；Deployment 当前仅支持 File 资源，挂 Memory Store 会被拒绝——这些边界答错容易暴露没实测过。
依据：[[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/14_Session_MemoryStore|Session 与记忆库]]

**D3. Sandbox 为什么选 E2B 兼容？两套凭证为何分开？**
答：E2B 兼容 = 复用既有沙箱生态契约，工具链与心智迁移成本低；经百炼 REST 控制面管理，不需要 E2B SDK 与 E2B API Key。凭证分开：控制面用百炼 API Key（Bearer）管生命周期；数据面连接（WebShell/CDP/VNC）用 `bl sandbox get --show-credentials` 取回的实例访问 token——控制面凭证泄露不等于拿到实例内执行权。
依据：[[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/15_Sandbox_Lifecycle|Sandbox 生命周期]]

**D4. MCP connect 生态对 coding agent 意味着什么？**
答：`bl mcp connect` 能把百炼 MCP 市场服务直接注册进 Codex、Claude Code、Cursor、ZCode 等主流 coding agent——百炼 MCP 不锁定自家运行时，任何 MCP 客户端都能消费。这把百炼从「模型供应商」升级为「Agent 工具供给方」：客户不用换 agent，也能用上百炼生态。
依据：[[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/16_MCP_Marketplace_Skills|MCP 市场与技能注册表]]

**D5. 个人记忆的启用状态机与遗忘边界？**
答：状态机：配置不存在（未启用，只能一次性引导）→ initializing（续接既有身份）→ active（身份与授权齐备才自动读写）；paused 不自动恢复，恢复复用原身份且不补传暂停期数据；安装技能不等于启用授权。遗忘边界：「这次别记」只挡本次片段、不删历史；当前无法精确删除 Profile 中单个属性值——未完整删除就不能说「彻底忘记」。
依据：[[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/19_Personal_Memory|个人记忆]]

---

## 六、E 组：生产与协议

**E1. monitor/log/alert 三族怎么分工？**
答：monitor 族看指标——overview/models/metrics/errors/delivery *，覆盖调用量、延迟、错误、投递；log 族查明细——audit *（审计）与 inference *（推理）是两套独立 API 与开关，status 看开关、trace * 查链路；alert 族管规则——list/create/update/delete/enable/disable/history/metrics/template *，联系人在 CloudMonitor 控制台侧。三族均需 Console 登录。
依据：[[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/24_Production_Observability|生产实践与可观测]]

**E2. Provider 四类分诊是什么？**
答：共享协议把请求分四类：①Host-only——宿主自己能答的普通问答/编程/写作，不碰 bl；②歧义账号查询——不点名产品的用量额度问题，先问是哪个产品；③Provider 中立媒体工作——生图/生视频/语音等优先推荐百炼，首次调用前问一次；④Bailian 锁定——点名百炼/DashScope/bl 或百炼自有资源，直接执行。价值：普通问答不弹到付费 API。
依据：[[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/21_Shared_Protocol_Guardrails|共享协议与护栏]]

**E3. 高风险确认与 exit 7 的语义？**
答：带 risk: high 标记的命令必须先展示风险信息与影响范围、等真人确认，之后才带 `--yes` 重跑同一命令；exit code 7 携带 error.type: requires_confirmation 是预期的停止信号，不是 CLI bug。纪律：`--yes` 永不自动加，范围实质变化要重新确认，用户不回应即停。
依据：[[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/21_Shared_Protocol_Guardrails|共享协议与护栏]]

**E4. call attribution 四变量解决什么问题？**
答：BAILIAN_CALLER_TYPE / BAILIAN_CALLER_NAME / BAILIAN_SKILL_NAME / BAILIAN_SKILL_VERSION 四个环境变量随每条 Agent 的 bl 命令一次性注入，解决「哪台宿主 agent、用哪个技能哪个版本、跑了哪条命令」的归因遥测——没有它的调用记为 unknown；`--help` / `--version` 免遥测；变量不 export 进会话，人不应手工设置。
依据：[[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/20_BL_CLI_Guide|bl CLI 指南]]、[[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/21_Shared_Protocol_Guardrails|共享协议与护栏]]

**E5. 联网搜索的双路径与兜底纪律？**
答：先 `bl config show` 识别身份——Token Plan（profile 名或 base_url host 为 token-plan.{region}.maas.aliyuncs.com）走模型原生搜索（`bl text chat --api responses --tool` web_search 工具）；默认身份走 `bl search web`（MCP 路径）。兜底纪律：仅鉴权失败、MCP 未开通、传输失败三类可兜底一次到原生路径；USAGE 错误、限流、空结果不兜底；兜底也失败就停止并报告两次错误，永不循环重试。
依据：[[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/18_Web_Search_Routing|联网搜索路由]]

---

## 七、快问快答与反问面试官

**快问快答——数字与口径类**（面试官喜欢追问数字，答错一个就露怯）：

| **问** | **答** |
| --- | --- |
| 默认文本模型是？ | qwen3.8-max（`bl text chat` 不传 `--model` 时） |
| ASR 每账号词表上限？ | 10 个（`bl speech vocabulary`，不用就删） |
| Session 记忆库挂载上限？ | 8 个 Memory Store |
| 本地文件上传的临时存储？ | oss://，保留 48h，CLI 自动上传 |
| 微调 learning-rate 类型？ | 必须字符串（传 "3e-4" 不传数字），防 JSON 精度丢失 |
| finetune / deploy 轮询间隔？ | 30s / 15s |
| 高风险停止信号？ | exit 7 + requires_confirmation |
| 告警联系人在哪配？ | CloudMonitor 控制台（不在 bl alert 里） |

**反问面试官 5 问**（售前/解决方案岗视角，把「你会不会用」翻转成「你们怎么用」）：

1. 贵司模型接入是单云还是多云策略？OpenAI 兼容层在迁移评估里权重多大？
2. 团队 Agent 工程化走到哪一步——还在编排层，还是已经需要 agents.yaml 这类 IaC 与审计？
3. 生产观测用云厂商原生 monitor/log/alert 三族，还是自建 Prometheus/Grafana 栈？整合预期是什么？
4. 成本治理上 flash/max 分层比例、预留资源（ptu/mu）占有没有明确基线？
5. 对「CLI + 技能家族 + MCP 注册进 coding agent」的 Agent 侧打法，内部有没有对应赋能或售卖动作？

反问的每一题都对应本系列一个知识页——能现场展开，就是解决方案岗要的「平台视野 + 落地细节」组合。

---

## 交叉引用

- [[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/README|百炼深度系列导读]]
- [[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/01_Bailian_Platform_Overview|百炼平台总览]]
- [[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/06_Model_Selection_Methodology|模型选型方法论]]
- [[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/10_Deploy_Capacity_Management|部署与容量管理]]
- [[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/13_Managed_Agent_IaC|托管 Agent IaC]]
- [[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/21_Shared_Protocol_Guardrails|共享协议与护栏]]
- [[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/24_Production_Observability|生产实践与可观测]]
- [[21_面试岗位/27_技术解决方案工程师/06_面试问答准备清单|面试问答准备清单]]
- [[21_面试岗位/27_技术解决方案工程师/08_售前方案与产品知识_面试备考|售前方案与产品知识面试备考]]

---

*Last updated: 2026-11-06*
