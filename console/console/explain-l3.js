/* L3 平台与工具层：节点六层解释 + 行业与企业版图（手工策展，口径见 explain.js 头注释）。 */
Object.assign(DB.explain, {
  agentfw: {
    levels: [
      ['一句话', '智能体框架与编排让模型「会做事」：把工具调用、记忆、多步规划和多智能体协作组织成可运行的系统；模型提供智力，框架提供纪律。'],
      ['打个比方', '像给一个聪明但只会聊天的实习生配上工作流、工具箱和检查清单，它才能独立完成任务；清单越细、检查点越多，失误越少，但速度越慢。'],
      ['拆开看', '五层结构：工具调用（function calling）→ 状态与记忆（会话、长期记忆）→ 规划与反思（拆任务、自我检查）→ 多智能体编排（分工、交接）→ 可观测与评测；可靠性来自重试、约束与人工兜底。'],
      ['怎么运转', '开源框架免费换生态，托管平台按调用或席位收费，企业版按部署与并发收费；框架之争本质是开发者入口之争——谁被默认选中，谁就掌握分发与后续变现。'],
      ['格局与博弈', 'LangGraph、CrewAI、AutoGen 主导开源，OpenAI 与 Anthropic 用官方 SDK 收编开发者，Dify、Coze 做低代码平台，云厂商捆绑销售；MCP 与 A2A 让框架之间开始互通，也在削弱单框架锁定。'],
      ['边界与走向', '框架会向「运行时 + 协议」收敛：能力差异被标准抹平，竞争转向可靠性、可观测与治理；生产级能力（回滚、权限、成本控制）才是分水岭，demo 级的编排很快会变成免费功能。']
    ],
    industries: [
      { name: '开源框架', desc: '开发者自建的编排层，生态与心智之争的主战场。', companies: [
        { name: 'LangChain/LangGraph', role: '框架龙头', products: 'LangGraph、LangSmith', tech: '图式编排、状态机', scenes: '复杂 Agent 工作流' },
        { name: 'CrewAI', role: '多智能体', products: 'Crews、Flows', tech: '角色协作、任务编排', scenes: '多 Agent 协作' },
        { name: 'AutoGen', role: '微软开源', products: 'AutoGen、Agent Framework', tech: '对话式多 Agent', scenes: '研究与企业原型' },
        { name: 'LlamaIndex', role: '数据 Agent', products: 'LlamaIndex、Workflows', tech: 'RAG 与数据编排', scenes: '知识型 Agent' },
        { name: 'Semantic Kernel', role: '企业框架', products: 'Semantic Kernel', tech: '多语言 SDK、插件', scenes: '企业 .NET/Java' }
      ] },
      { name: '官方 SDK 与平台', desc: '模型厂商用自己的运行时锁定开发者。', companies: [
        { name: 'OpenAI', role: 'Agents SDK', products: 'Agents SDK、Responses API', tech: '工具调用、编排', scenes: 'OpenAI 生态应用' },
        { name: 'Anthropic', role: 'Agent SDK', products: 'Claude Agent SDK', tech: '工具使用、MCP', scenes: '编码与企业 Agent' },
        { name: 'Google', role: 'ADK', products: 'Agent Development Kit', tech: '多 Agent、Vertex 集成', scenes: 'Gemini 生态' },
        { name: 'AWS', role: 'Bedrock Agents', products: 'Bedrock Agents、AgentCore', tech: '托管运行时', scenes: '企业云 Agent' }
      ] },
      { name: '低代码工作流', desc: '让业务人员搭建 Agent，降低开发门槛。', companies: [
        { name: 'Dify', role: '开源 LLMOps', products: 'Dify 平台', tech: '可视化编排、RAG', scenes: '企业知识应用' },
        { name: 'Coze（扣子）', role: '字节平台', products: '扣子、Coze', tech: 'Bot 编排、插件', scenes: '消费与社交 Bot' },
        { name: 'n8n', role: '自动化', products: 'n8n 工作流', tech: '节点编排、集成', scenes: '业务流程自动化' },
        { name: 'Zapier', role: 'SaaS 集成', products: 'Zapier AI Actions', tech: '应用连接器', scenes: '跨应用自动化' },
        { name: 'Make', role: '自动化', products: 'Make 工作流', tech: '可视化自动化', scenes: '中小企业流程' }
      ] },
      { name: '可观测与评测', desc: '让 Agent 的行为可追踪、可评估、可回归。', companies: [
        { name: 'LangSmith', role: 'Agent 可观测', products: '追踪、评测、数据集', tech: '链路追踪', scenes: 'Agent 开发调试' },
        { name: 'Langfuse', role: '开源可观测', products: '追踪、评测', tech: '开源 LLM 可观测', scenes: '自建监控' },
        { name: 'Arize', role: '模型可观测', products: 'Phoenix、Alyx', tech: '生产监控', scenes: '企业 AI 运维' },
        { name: 'Braintrust', role: '评测平台', products: '实验与评测', tech: '回归测试', scenes: '产品迭代' },
        { name: 'Weights & Biases', role: 'ML 实验管理', products: 'W&B、Weave', tech: '实验追踪', scenes: '模型与 Agent 开发' }
      ] }
    ]
  },

  coding: {
    levels: [
      ['一句话', 'Agentic 编码让 AI 自己读仓库、改代码、跑测试、提 PR——从「补全一行」升级为「交付一个任务」；衡量指标也从接受率变成合并率。'],
      ['打个比方', '像从「副驾驶提示」升级到「代驾」：你给目的地，它自己开车、处理路况；你只负责验收，而不是每个动作都盯。'],
      ['拆开看', '六段链路：代码索引与检索 → 计划与编辑 → 终端执行 → 测试反馈 → 多轮修复 → PR 交付；上下文管理、工具沙箱与权限边界是核心，长任务的上下文衰减是主要失败来源。'],
      ['怎么运转', '三种收费模式：IDE 订阅（Cursor、Copilot）、终端 Agent（Claude Code、Codex）、云端异步 Agent（Devin）；按席位或按任务收费，企业版加治理、私有部署与审计。'],
      ['格局与博弈', 'Cursor 领跑 AI IDE，Claude Code、Codex 抢占终端与 CI，GitHub Copilot 靠分发守擂，Devin 代表异步交付；模型能力仍是胜负手，但工具链、上下文工程与评测数据的差距在缩小。'],
      ['边界与走向', '长任务可靠性与企业合规是瓶颈，编码 Agent 会向「软件工程平台」演进（需求、实现、测试、发布一体）；按结果收费可能颠覆席位制，初级编码岗位的需求结构会被改写，而架构与验收能力更值钱。']
    ],
    industries: [
      { name: 'AI IDE', desc: '编辑器入口，商业化最成熟的形态。', companies: [
        { name: 'Cursor（Anysphere）', role: 'AI IDE 标杆', products: 'Cursor 编辑器', tech: '代码索引、多文件编辑', scenes: '专业开发者日常开发' },
        { name: 'GitHub Copilot', role: '分发龙头', products: 'Copilot、Copilot Workspace', tech: '代码补全、Agent 模式', scenes: '企业开发' },
        { name: 'Windsurf（Cognition）', role: 'AI IDE', products: 'Windsurf 编辑器', tech: 'Agent 流程', scenes: '团队开发' },
        { name: 'JetBrains', role: 'IDE 老牌', products: 'AI Assistant、Junie', tech: 'IDE 深度集成', scenes: 'Java/Python 开发' },
        { name: '字节 Trae', role: '中国 AI IDE', products: 'Trae', tech: '中文开发体验', scenes: '中国开发者' },
        { name: '阿里通义灵码', role: '中国编码助手', products: '通义灵码', tech: '代码补全与 Agent', scenes: '中国企业开发' }
      ] },
      { name: '终端 / CLI Agent', desc: '在开发者自有环境里运行，扩展机制成为新平台。', companies: [
        { name: 'Anthropic', role: '终端 Agent 标杆', products: 'Claude Code', tech: '工具调用、MCP、子 Agent', scenes: '仓库级重构与交付' },
        { name: 'OpenAI', role: '终端与云端', products: 'Codex CLI、Codex Cloud', tech: '沙箱执行、并行任务', scenes: '异步编码任务' },
        { name: 'Google', role: 'CLI Agent', products: 'Gemini CLI', tech: '终端工具调用', scenes: '开发者本地任务' },
        { name: 'Aider', role: '开源 CLI', products: 'Aider', tech: 'Git 集成、多模型', scenes: '开源项目开发' },
        { name: 'Cline', role: '开源 IDE Agent', products: 'Cline', tech: 'VS Code 集成', scenes: '开发者自定义工作流' }
      ] },
      { name: '云端自主 Agent', desc: '异步整机沙箱，按任务交付而非按席位。', companies: [
        { name: 'Cognition', role: '云端 Agent 先驱', products: 'Devin、Windsurf', tech: '自主规划、沙箱', scenes: '整任务交付' },
        { name: 'OpenAI', role: '云端编码', products: 'Codex Cloud', tech: '并行沙箱', scenes: '批量任务' },
        { name: 'Google', role: '云端 Agent', products: 'Jules', tech: '异步修复', scenes: '代码维护' },
        { name: 'Replit', role: '云端 IDE', products: 'Replit Agent', tech: '全栈生成', scenes: '原型与教育' },
        { name: 'Factory', role: '企业 Agent', products: 'Droids', tech: '企业代码库理解', scenes: '大型企业开发' }
      ] },
      { name: '代码审查与质量', desc: '把 AI 用在评审、安全与测试，守住交付质量。', companies: [
        { name: 'CodeRabbit', role: 'AI 代码审查', products: 'PR 审查', tech: '上下文理解', scenes: '团队代码评审' },
        { name: 'Qodo', role: '测试与审查', products: 'Qodo Merge、测试生成', tech: '测试生成', scenes: '质量保障' },
        { name: 'Sourcegraph', role: '代码搜索', products: 'Cody、Amp', tech: '代码索引', scenes: '大型代码库' },
        { name: 'Sonar', role: '代码质量', products: 'SonarQube', tech: '静态分析', scenes: '企业质量门禁' },
        { name: 'Snyk', role: '安全扫描', products: 'Snyk Code', tech: '漏洞检测', scenes: '供应链安全' }
      ] }
    ]
  },

  devhost: {
    levels: [
      ['一句话', '代码托管与 CI 是软件开发的「地基」：仓库、权限、流水线和制品库；Agent 时代还要加上任务沙箱与审计日志。'],
      ['打个比方', '像城市的道路与供水——平时不起眼，但所有建筑（应用）都依赖它；路一断，全城停摆，迁移成本高到没人愿意换。'],
      ['拆开看', '五层结构：Git 仓库 → 权限与审计 → CI/CD 流水线 → 制品与部署 → Agent 沙箱与运行环境；安全、合规与供应链完整性贯穿每一层。'],
      ['怎么运转', '按席位或用量的订阅，企业版按合规与私有部署收费；平台靠生态（应用市场、Actions、集成）锁定开发者，数据与工作流沉淀越深，迁移成本越高。'],
      ['格局与博弈', 'GitHub 凭网络效应主导，GitLab 做一体化 DevOps，Atlassian 捆绑 Jira 与 Bitbucket；自建托管与区域合规需求带来分化，中国以 Gitee、云效等本土平台为主。'],
      ['边界与走向', 'Agent 会直接读写仓库、触发流水线、提交 PR，托管平台必须提供沙箱、配额与审计；「Agent 原生 CI」是新战场，代码托管会从「人写代码的地方」变成「人和 agent 协作、评审与追责的地方」。']
    ],
    industries: [
      { name: '托管平台', desc: '代码协作的中心，网络效应极强。', companies: [
        { name: 'GitHub', role: '全球龙头', products: '仓库、Actions、Copilot', tech: 'Git、CI/CD、代码搜索', scenes: '开源与企业开发' },
        { name: 'GitLab', role: '一体化 DevOps', products: 'GitLab、CI/CD', tech: '端到端 DevOps', scenes: '企业私有部署' },
        { name: 'Bitbucket（Atlassian）', role: 'Jira 生态', products: 'Bitbucket、Pipelines', tech: '与 Jira 集成', scenes: 'Atlassian 用户' },
        { name: 'Gitee', role: '中国托管', products: 'Gitee、企业版', tech: '本土合规', scenes: '中国开发者' },
        { name: '阿里云 Codeup', role: '中国云托管', products: 'Codeup、云效', tech: '云原生 DevOps', scenes: '阿里云客户' }
      ] },
      { name: '自建与开源', desc: '私有化与合规需求驱动的替代方案。', companies: [
        { name: 'Gitea', role: '轻量自建', products: 'Gitea', tech: 'Go 实现、低资源', scenes: '中小企业自建' },
        { name: 'Forgejo', role: '开源社区', products: 'Forgejo', tech: '社区治理', scenes: '开源项目自建' },
        { name: 'GitLab CE', role: '开源自建', products: 'GitLab 社区版', tech: 'DevOps 全流程', scenes: '企业私有化' },
        { name: 'Gerrit', role: '代码评审', products: 'Gerrit', tech: '提交级评审', scenes: '大型开源项目' }
      ] },
      { name: 'CI/CD', desc: '把代码变成制品的流水线，Agent 会成为新的执行者。', companies: [
        { name: 'GitHub Actions', role: '生态最大', products: 'Actions、Runners', tech: '事件驱动流水线', scenes: '开源与企业 CI' },
        { name: 'GitLab CI', role: '一体化', products: 'GitLab CI/CD', tech: '流水线即代码', scenes: '企业 DevOps' },
        { name: 'CircleCI', role: '托管 CI', products: 'CircleCI', tech: '并行构建', scenes: '云原生团队' },
        { name: 'Buildkite', role: '混合 CI', products: 'Buildkite', tech: '自托管 Agent', scenes: '大规模工程' },
        { name: 'Harness', role: '软件交付', products: 'Harness Platform', tech: 'AI 辅助交付', scenes: '企业发布' }
      ] },
      { name: '制品与供应链安全', desc: '制品库、签名与漏洞扫描，保障交付链安全。', companies: [
        { name: 'JFrog', role: '制品库', products: 'Artifactory、Xray', tech: '制品管理、扫描', scenes: '企业制品管理' },
        { name: 'Sonatype', role: '依赖治理', products: 'Nexus、Sonatype Lift', tech: '开源依赖分析', scenes: '供应链安全' },
        { name: 'Snyk', role: '安全扫描', products: 'Snyk Open Source', tech: '漏洞检测', scenes: '开发者安全' },
        { name: 'Chainguard', role: '安全镜像', products: 'Chainguard Images', tech: '最小镜像、签名', scenes: '容器安全' }
      ] }
    ]
  },

  maas: {
    levels: [
      ['一句话', 'MaaS 与模型 API 把模型能力做成按量售卖的服务：开发者不用自己部署，调用即用；它卖的是「把模型变成水电」的那层封装。'],
      ['打个比方', '像自来水厂——模型是水，API 是管道，按用量缴费；水厂负责水质、压力与稳定供应，你只负责用水，但水价和停水都由它定。'],
      ['拆开看', '五段链路：模型托管 → 推理集群（GPU 调度与批处理）→ 网关与限流 → 计费与配额 → 企业合规与审计；多模型路由、缓存与批处理是差异化来源。'],
      ['怎么运转', '按 token 计费 + 企业合同 + 预留吞吐；云厂商用 MaaS 带动算力与存储消费，模型厂靠 API 毛利反哺训练，价格战时期则用用量增长对冲单价下滑。'],
      ['格局与博弈', 'OpenAI、Anthropic、Google 是第一梯队，AWS Bedrock、Azure AI、Vertex 做多模型聚合，中国阿里百炼、火山方舟、百度千帆分层竞争；开源模型托管与自建推理持续压低价格。'],
      ['边界与走向', 'MaaS 会从「卖模型」转向「卖智能体运行时」：单纯转发 API 的中间层利润会被压到零，价值向分发、治理、评测与垂直场景迁移；能提供稳定 SLA 与合规审计的平台才能留住企业客户。']
    ],
    industries: [
      { name: '模型原厂 API', desc: '第一方模型 API，能力与价格的定义者。', companies: [
        { name: 'OpenAI', role: 'API 龙头', products: 'GPT API、Responses API', tech: '推理时计算、工具调用', scenes: '开发者与企业' },
        { name: 'Anthropic', role: '企业 API', products: 'Claude API', tech: '长上下文、Agent', scenes: '编码与企业' },
        { name: 'Google', role: 'Gemini API', products: 'Gemini API、Vertex AI', tech: '多模态、TPU', scenes: '云客户' },
        { name: 'DeepSeek', role: '高性价比', products: 'DeepSeek API', tech: '高效推理', scenes: '价格敏感市场' },
        { name: '智谱', role: '中国 API', products: 'GLM API', tech: '中英双语', scenes: '政企与开发者' },
        { name: 'MiniMax', role: '全模态 API', products: '文本/语音/视频 API', tech: '多模态生成', scenes: '内容应用' }
      ] },
      { name: '云厂商聚合平台', desc: '一个入口接入多模型，绑定云消费。', companies: [
        { name: 'AWS', role: 'Bedrock', products: 'Bedrock', tech: '多模型托管、Guardrails', scenes: '企业多模型' },
        { name: 'Microsoft Azure', role: 'AI Foundry', products: 'Azure AI Foundry', tech: '模型目录、评估', scenes: '企业 AI' },
        { name: 'Google Cloud', role: 'Vertex AI', products: 'Vertex AI Model Garden', tech: '模型目录、TPU', scenes: '企业 AI' },
        { name: '阿里云', role: '百炼', products: '百炼、通义 API', tech: '模型广场、应用编排', scenes: '中国企业' },
        { name: '火山引擎', role: '方舟', products: '火山方舟', tech: '多模型路由', scenes: '内容与消费' },
        { name: '百度智能云', role: '千帆', products: '千帆大模型平台', tech: '模型托管、微调', scenes: '中国企业' }
      ] },
      { name: '第三方托管', desc: '开发者友好的多模型托管与路由。', companies: [
        { name: 'Together AI', role: '开源托管', products: '推理与微调 API', tech: '分布式推理', scenes: '开源模型商用' },
        { name: 'Fireworks AI', role: '推理服务', products: '模型 API', tech: '高吞吐', scenes: '生产应用' },
        { name: 'Replicate', role: '模型托管', products: '模型 API、模板', tech: '容器化推理', scenes: '快速试验' },
        { name: 'OpenRouter', role: '模型路由', products: '统一 API、价格对比', tech: '多模型路由', scenes: '开发者选型' },
        { name: 'Hugging Face', role: '推理端点', products: 'Inference Endpoints', tech: '模型托管', scenes: '开源模型部署' }
      ] },
      { name: '推理优化服务', desc: '用专用硬件或优化栈降低单位 token 成本。', companies: [
        { name: 'Groq', role: '低延迟推理', products: 'LPU 云', tech: '确定性执行', scenes: '实时应用' },
        { name: 'Cerebras', role: '晶圆级推理', products: 'WSE 云', tech: '晶圆级芯片', scenes: '超高速推理' },
        { name: '硅基流动', role: '中国推理云', products: '模型 API', tech: '国产芯片适配', scenes: '中国企业' },
        { name: '无问芯穹', role: '异构算力', products: '推理平台', tech: '多芯片适配', scenes: '智算中心' }
      ] }
    ]
  },

  search: {
    levels: [
      ['一句话', 'AI 搜索用大模型直接给答案，而不是给你十条链接——它重写了「找信息」这件事，也重写了内容方与平台之间的流量分配。'],
      ['打个比方', '像从「图书馆索引卡」升级到「私人研究助理」：你问问题，它读完资料给你结论并附出处；省下的时间就是价值，出处错了就是负价值。'],
      ['拆开看', '五段链路：查询理解（改写、拆解）→ 检索（网页与垂直库）→ 重排 → 答案生成与引用 → 多轮追问；实时性、可信度与引用质量是核心。'],
      ['怎么运转', '变现四条路：免费 + 订阅、广告、API 调用、企业知识库；内容版权与流量分成是新增成本，答案里的广告位与导购佣金是长期方向。'],
      ['格局与博弈', 'Google 用 AI Overviews 防守自身搜索盘子，OpenAI、Anthropic 把搜索嵌入助手，Perplexity 做独立答案引擎，百度、夸克、秘塔在本土竞争；内容方开始向 AI 平台收取授权费。'],
      ['边界与走向', '搜索会融入智能体成为「工具」而非独立产品，内容方与平台的流量分配将重新谈判；「答案的可信度」会成为新的品牌资产，能证明来源、能追溯证据的产品才留得住用户。']
    ],
    industries: [
      { name: '通用答案引擎', desc: '用生成式答案替代链接列表，争夺信息入口。', companies: [
        { name: 'Perplexity', role: '独立答案引擎', products: 'Perplexity、Pro 搜索', tech: '检索增强、引用', scenes: '研究与日常问答' },
        { name: 'OpenAI', role: '助手内置搜索', products: 'ChatGPT Search', tech: '实时检索、引用', scenes: '消费与工作' },
        { name: 'Google', role: '搜索防守', products: 'AI Overviews、Gemini', tech: '检索 + 生成', scenes: '通用搜索' },
        { name: '百度', role: '中国搜索', products: '文心一言、AI 搜索', tech: '中文检索与生成', scenes: '中国搜索市场' },
        { name: '夸克（阿里）', role: '中国搜索', products: '夸克 AI 搜索', tech: '年轻用户入口', scenes: '移动搜索' },
        { name: '秘塔', role: '中国答案引擎', products: '秘塔 AI 搜索', tech: '学术与结构化检索', scenes: '研究与办公' }
      ] },
      { name: '垂直搜索', desc: '面向企业、开发者或特定领域的检索服务。', companies: [
        { name: 'Exa', role: '语义搜索 API', products: 'Exa Search', tech: '向量检索', scenes: 'Agent 与开发者' },
        { name: 'Tavily', role: 'Agent 搜索 API', products: 'Tavily Search', tech: '检索增强', scenes: 'Agent 工具' },
        { name: 'You.com', role: 'AI 搜索', products: 'YouSearch、YouChat', tech: '多模型搜索', scenes: '专业用户' },
        { name: 'Glean', role: '企业搜索', products: 'Glean Assistant', tech: '企业知识图谱', scenes: '企业内部检索' },
        { name: '天工（昆仑万维）', role: '中国搜索', products: '天工 AI 搜索', tech: '中文生成式搜索', scenes: '消费搜索' }
      ] },
      { name: '搜索基础设施', desc: '为应用与 Agent 提供网页与索引能力。', companies: [
        { name: 'Brave Search', role: '独立索引', products: 'Search API', tech: '自建索引', scenes: '隐私搜索与 API' },
        { name: 'Bing（Microsoft）', role: '搜索 API', products: 'Bing Search API', tech: '全球索引', scenes: '应用集成' },
        { name: 'Google', role: '搜索 API', products: 'Programmable Search', tech: '全球索引', scenes: '站点与应用' },
        { name: 'SerpAPI', role: '搜索结果 API', products: 'SerpAPI', tech: '结果抓取与结构化', scenes: '开发者集成' }
      ] },
      { name: '内容与版权', desc: '搜索答案的语料来源，流量与授权重新分配。', companies: [
        { name: 'Reddit', role: '社区内容', products: '数据授权、搜索', tech: '社区语料', scenes: '问答与讨论' },
        { name: 'News Corp', role: '新闻内容', products: '新闻授权', tech: '内容许可', scenes: '新闻搜索' },
        { name: 'AP', role: '新闻通讯社', products: '新闻数据', tech: '内容授权', scenes: '事实性答案' },
        { name: '维基百科', role: '开放知识', products: '百科内容', tech: '开放许可', scenes: '知识型答案' }
      ] }
    ]
  },

  rag: {
    levels: [
      ['一句话', 'RAG 与知识库让模型「先查资料再回答」：把企业文档检索出来塞进上下文，减少胡编；它解决的是「模型不知道你公司的事」。'],
      ['打个比方', '像开卷考试——答案不一定背下来，但会翻书、会引用出处；翻得准不准、书是不是最新版，决定答案靠不靠谱。'],
      ['拆开看', '六段链路：文档解析与切分 → 向量化 → 向量库检索 → 重排 → 上下文拼装 → 生成与引用；切分策略、权限过滤与数据新鲜度决定效果上限。'],
      ['怎么运转', '向量数据库按用量收费，RAG 平台按席位或文档量收费，企业私有化部署是主要形态；咨询与集成服务占比高，因为它本质是数据工程而非模型工程。'],
      ['格局与博弈', 'Pinecone、Weaviate、Qdrant、Milvus 争向量库，LlamaIndex、LangChain 做编排，云厂商把 RAG 做成托管服务；长上下文模型对简单 RAG 形成替代压力，但权限隔离与实时性仍是 RAG 的护城河。'],
      ['边界与走向', 'RAG 会与 Agent、知识图谱融合成「企业记忆层」：不只检索文档，还维护事实、关系与时效；评测与权限控制是落地关键，「检索质量」比「模型大小」更决定企业体验。']
    ],
    industries: [
      { name: '向量数据库', desc: '存储与检索语义向量，是 RAG 的核心组件。', companies: [
        { name: 'Pinecone', role: '托管向量库', products: 'Pinecone', tech: '向量索引、Serverless', scenes: '企业 RAG' },
        { name: 'Weaviate', role: '开源向量库', products: 'Weaviate', tech: '混合检索', scenes: '自建知识库' },
        { name: 'Qdrant', role: '开源向量库', products: 'Qdrant', tech: '向量检索、过滤', scenes: '开发者与中小企业' },
        { name: 'Milvus（Zilliz）', role: '开源向量库', products: 'Milvus、Zilliz Cloud', tech: '分布式向量检索', scenes: '大规模知识库' },
        { name: 'Chroma', role: '轻量向量库', products: 'Chroma', tech: '嵌入式向量库', scenes: '原型与本地应用' },
        { name: 'Elastic', role: '搜索与向量', products: 'Elasticsearch、ELSER', tech: '混合搜索', scenes: '企业搜索' }
      ] },
      { name: 'RAG 平台与框架', desc: '把解析、检索、生成串成可用的应用。', companies: [
        { name: 'LlamaIndex', role: 'RAG 框架', products: 'LlamaIndex、Workflows', tech: '数据连接器、索引', scenes: '知识型 Agent' },
        { name: 'LangChain', role: '编排框架', products: 'LangChain、LangGraph', tech: 'RAG 链、Agent', scenes: 'LLM 应用开发' },
        { name: 'Dify', role: 'LLMOps 平台', products: 'Dify', tech: '可视化 RAG 编排', scenes: '企业知识应用' },
        { name: 'Cohere', role: '企业检索', products: 'Embed、Rerank、Command', tech: '检索与重排', scenes: '企业 RAG' },
        { name: 'Vectara', role: 'RAG 服务', products: 'RAG-as-a-Service', tech: '托管检索', scenes: '企业问答' }
      ] },
      { name: '企业知识管理', desc: '把组织知识变成可检索、可引用的资产。', companies: [
        { name: 'Glean', role: '企业搜索', products: 'Glean Assistant', tech: '知识图谱、权限', scenes: '企业知识库' },
        { name: 'Notion', role: '文档协作', products: 'Notion AI', tech: '文档检索与生成', scenes: '团队知识' },
        { name: 'Atlassian', role: '企业协作', products: 'Confluence、Rovo', tech: '知识检索', scenes: '研发与文档' },
        { name: '飞书', role: '中国协作', products: '飞书知识库、智能伙伴', tech: '企业知识检索', scenes: '中国企业协作' },
        { name: '语雀', role: '中国文档', products: '语雀、AI 助手', tech: '文档知识库', scenes: '团队文档' }
      ] },
      { name: '云托管检索', desc: '云厂商把搜索与向量检索做成托管服务。', companies: [
        { name: 'AWS', role: 'OpenSearch', products: 'OpenSearch、Kendra', tech: '搜索与向量', scenes: '企业检索' },
        { name: 'Microsoft Azure', role: 'AI Search', products: 'Azure AI Search', tech: '混合检索、语义排序', scenes: '企业 RAG' },
        { name: 'Google Cloud', role: 'Vertex Search', products: 'Vertex AI Search', tech: '企业搜索', scenes: '企业知识' },
        { name: '阿里云', role: 'OpenSearch', products: '阿里云 OpenSearch、百炼知识库', tech: '搜索与向量', scenes: '中国企业' }
      ] }
    ]
  },

  datainfra: {
    levels: [
      ['一句话', '数据基础设施是企业 AI 的「地基工程」：数据湖、湖仓一体、向量库与治理工具——模型能力越强，企业越发现瓶颈在数据侧而不是模型侧。'],
      ['打个比方', '像装修前的水电改造：模型是家电，数据管道是水电；水电不通，再贵的家电也是摆设；而且水电一旦铺好，十年不会换厂商。'],
      ['拆开看', '四段链路：数据集成（ETL / CDC）→ 存储与计算（湖仓一体、Spark）→ 检索（向量库、全文）→ 治理（目录、血缘、权限）；AI 场景新增向量与治理两层。'],
      ['怎么运转', '商业模式三选一：按用量（云数仓）、按订阅（平台软件）、开源 + 企业版；数据引力决定黏性——数据搬不走，客户就走不了。'],
      ['格局与博弈', 'Databricks 与 Snowflake 双雄对撞，Iceberg 开放格式打破锁定，向量库四强（Pinecone/Milvus/Weaviate/Qdrant）抢 RAG 入口，云厂商全部自研应战。'],
      ['边界与走向', '湖仓与向量库会融合成「AI 数据平台」，治理从合规成本变成 agent 的权限层；开放格式让存储层商品化，价值向计算引擎与治理层迁移。']
    ],
    industries: [
      { name: '湖仓一体与数据平台', desc: '企业数据的主战场，双雄格局松动。', companies: [
        { name: 'Databricks', role: '湖仓开创', products: 'Unity Catalog、Mosaic AI', tech: 'Delta Lake + 模型平台', scenes: '数据 + AI 一体' },
        { name: 'Snowflake', role: '云数仓', products: 'Cortex、Snowpark', tech: '存算分离', scenes: '企业分析' },
        { name: 'Google BigQuery', role: '云原生数仓', products: 'BigQuery ML、Gemini 集成', tech: 'Serverless 分析', scenes: 'GCP 数据栈' },
        { name: 'Dremio', role: 'Lakehouse 开放派', products: 'Apache Iceberg 引擎', tech: '开放格式查询', scenes: '去厂商锁定' },
        { name: 'StarRocks', role: '国产 OLAP', products: '实时分析引擎', tech: 'MPP 架构', scenes: '国内实时数仓' }
      ] },
      { name: '向量与检索', desc: 'RAG 与语义搜索的检索底座。', companies: [
        { name: 'Pinecone', role: '向量库标杆', products: 'Serverless 向量库', tech: '托管检索', scenes: 'AI 应用' },
        { name: 'Zilliz（Milvus）', role: '开源向量', products: 'Milvus / Zilliz Cloud', tech: 'GPU 索引、十亿级向量', scenes: '大规模 RAG' },
        { name: 'Weaviate', role: '开源向量', products: '混合搜索模块', tech: '向量 + 关键词', scenes: '开发者自建' },
        { name: 'Qdrant', role: 'Rust 向量', products: '高性能向量引擎', tech: '过滤检索', scenes: '性能敏感场景' },
        { name: 'Elastic', role: '搜索老牌', products: 'Elasticsearch 向量', tech: '混合检索', scenes: '存量搜索升级' }
      ] },
      { name: '数据集成与治理', desc: '把数据喂进平台并管好的工具层。', companies: [
        { name: 'Fivetran', role: '自动化 ETL', products: '托管连接器', tech: 'CDC 增量同步', scenes: '数据入仓' },
        { name: 'dbt Labs', role: '转换标准', products: 'dbt Core/Cloud', tech: 'SQL 工程化', scenes: '分析工程' },
        { name: 'Collibra', role: '治理平台', products: '数据目录与血缘', tech: '元数据管理', scenes: '合规企业' },
        { name: 'Alation', role: '数据目录', products: '智能目录与搜索', tech: '行为分析驱动', scenes: '数据文化' }
      ] },
      { name: '中国数据平台', desc: '国产数据库与云数智生态。', companies: [
        { name: 'PingCAP', role: '分布式 HTAP', products: 'TiDB、向量检索', tech: '兼容 MySQL', scenes: '金融与互联网' },
        { name: '星环科技', role: '国产数仓', products: 'ArgoDB、KunDB', tech: '全栈国产化', scenes: '政企金融' },
        { name: '东方国信', role: '电信数据', products: 'CirroData', tech: 'MPP 数仓', scenes: '运营商与工业' },
        { name: 'Kyligence', role: '智能数仓', products: 'Kyligence Zen', tech: 'OLAP + 指标平台', scenes: '企业分析' }
      ] }
    ]
  },

  devtools: {
    levels: [
      ['一句话', '开发者工具链是 AI 应用的「车间」：调试、评测、部署、监控，决定能不能从 demo 走到生产；模型只占成本的一小块，剩下的都是工程。'],
      ['打个比方', '像汽车工厂的质检线与总装线——发动机（模型）再好，没有工艺也造不出量产车；产线出问题，好发动机也白搭。'],
      ['拆开看', '五段链路：开发框架 → 提示词与版本管理 → 评测与回归 → 部署与扩缩容 → 可观测与告警；评测与可观测是生产化的分水岭，也是付费意愿最强的地方。'],
      ['怎么运转', 'SaaS 按席位或调用收费，开源 + 企业版是常见模式；云厂商把工具链捆绑进平台压低价格，独立工具只能靠体验、深度集成与垂直场景取胜。'],
      ['格局与博弈', 'LangSmith、Langfuse、Arize 争 LLM 可观测，Braintrust 做评测与实验管理，Vercel、Netlify 抢 AI 应用部署；大厂平台以捆绑挤压独立工具，开源项目则靠社区反攻。'],
      ['边界与走向', '工具链会围绕「Agent 运行时」重组：追踪不再是日志，而是任务轨迹、工具调用与成本归因；评测与安全会成为必选项而非可选项，「agent 的可观测性」可能是下一个 Datadog 级机会。']
    ],
    industries: [
      { name: 'LLM 可观测', desc: '追踪调用链、成本与质量，是生产化的前提。', companies: [
        { name: 'LangSmith', role: 'LLM 可观测', products: '追踪、评测、监控', tech: '链路追踪', scenes: 'Agent 开发运维' },
        { name: 'Langfuse', role: '开源可观测', products: '追踪、评测', tech: '开源可观测', scenes: '自建监控' },
        { name: 'Arize', role: '模型可观测', products: 'Phoenix、Alyx', tech: '生产监控', scenes: '企业 AI 运维' },
        { name: 'Datadog', role: '全栈监控', products: 'LLM Observability', tech: '指标与追踪', scenes: '企业运维' },
        { name: 'Helicone', role: 'API 网关', products: 'LLM 代理与监控', tech: '请求日志', scenes: '成本与质量监控' }
      ] },
      { name: '评测与实验', desc: '用数据决定提示词与模型版本是否更好。', companies: [
        { name: 'Braintrust', role: '评测平台', products: '实验、评测、回归', tech: '数据集与评分', scenes: '产品迭代' },
        { name: 'Humanloop', role: 'LLM 平台', products: '提示词管理、评测', tech: '人机协作评估', scenes: '企业应用' },
        { name: 'PromptLayer', role: '提示词管理', products: '提示词版本与监控', tech: '提示词追踪', scenes: '开发者协作' },
        { name: 'Galileo', role: '评测与可观测', products: '评测平台', tech: '指标与回归', scenes: '生产质量' },
        { name: 'Weights & Biases', role: '实验管理', products: 'W&B、Weave', tech: '实验追踪', scenes: '模型与 Agent' }
      ] },
      { name: '应用部署', desc: '把 AI 应用快速上线并弹性扩缩容。', companies: [
        { name: 'Vercel', role: '前端部署', products: 'Vercel、AI SDK', tech: '边缘部署、流式响应', scenes: 'AI Web 应用' },
        { name: 'Netlify', role: 'Jamstack 部署', products: 'Netlify、AI 功能', tech: '边缘函数', scenes: '静态与全栈应用' },
        { name: 'Cloudflare', role: '边缘平台', products: 'Workers、AI Gateway', tech: '边缘计算', scenes: '低延迟 AI 应用' },
        { name: 'Modal', role: 'GPU 部署', products: 'Modal Serverless', tech: '按需 GPU、沙箱', scenes: '模型服务' },
        { name: 'Railway', role: '应用托管', products: 'Railway', tech: '一键部署', scenes: '原型与生产' }
      ] },
      { name: '开发环境', desc: '代码、协作与运行环境，AI 开发的基础设施。', companies: [
        { name: 'GitHub', role: '代码托管', products: 'GitHub、Codespaces', tech: '仓库与云端开发', scenes: '团队协作' },
        { name: 'GitLab', role: 'DevOps', products: 'GitLab', tech: '一体化 DevOps', scenes: '企业开发' },
        { name: 'JetBrains', role: 'IDE', products: 'IDEA、PyCharm、AI Assistant', tech: 'IDE 集成', scenes: '专业开发' },
        { name: 'Replit', role: '云端 IDE', products: 'Replit Agent', tech: '全栈生成', scenes: '原型与教育' },
        { name: 'Cursor', role: 'AI IDE', products: 'Cursor', tech: '代码索引', scenes: 'AI 原生开发' }
      ] }
    ]
  },

  guardrail: {
    levels: [
      ['一句话', '安全护栏是给 AI 应用装的「刹车与安全带」：拦截越狱、敏感内容和危险工具调用；Agent 时代还要管住它能碰哪些系统、能花多少钱。'],
      ['打个比方', '像机场安检——不能保证绝对安全，但能把大部分风险挡在登机口之外；检查越严，通行越慢，误杀与漏检之间永远要平衡。'],
      ['拆开看', '五段链路：输入过滤 → 提示词注入检测 → 输出审核 → 工具权限控制 → 红队与持续评测；内容过滤相对成熟，行为约束与权限控制才是难点。'],
      ['怎么运转', '按调用量收费的安全 API、企业安全平台订阅、红队服务项目制；监管合规是需求驱动，保险与审计也在推高预算，事故则是最大的获客来源。'],
      ['格局与博弈', '传统安全厂商（Palo Alto、CrowdStrike）把 AI 安全并入平台，专精厂商（Lakera、Robust Intelligence）做模型侧防护，模型原厂内置护栏；三股力量互相挤压，OWASP LLM Top 10 等标准提供共同语言。'],
      ['边界与走向', '护栏会从「内容过滤」转向「行为约束与权限」：Agent 调用哪些工具、能写哪些数据、花多少钱，都要有策略与审计；安全会成为 agent 平台的基础能力而非外挂，独立厂商的空间在跨平台治理。']
    ],
    industries: [
      { name: 'AI 安全平台', desc: '把 AI 风险纳入企业整体安全体系。', companies: [
        { name: 'Palo Alto Networks', role: '安全平台', products: 'Prisma AIRS、Cortex', tech: 'AI 风险检测', scenes: '企业 AI 安全' },
        { name: 'CrowdStrike', role: '终端与云安全', products: 'Falcon、AI Security', tech: '行为检测', scenes: 'AI 工作负载保护' },
        { name: 'Microsoft', role: '安全与合规', products: 'Security Copilot', tech: '安全大模型', scenes: '企业安全运营' },
        { name: '奇安信', role: '中国安全', products: 'AI 安全、数据安全', tech: '攻防与合规', scenes: '政企安全' },
        { name: '深信服', role: '中国安全', products: '安全 GPT、AI 防火墙', tech: '安全检测', scenes: '企业网络' }
      ] },
      { name: '模型侧防护', desc: '在模型输入输出两侧做实时拦截。', companies: [
        { name: 'Lakera', role: '提示词防护', products: 'Guardrails、Red', tech: '注入检测', scenes: 'LLM 应用' },
        { name: 'Protect AI', role: '模型供应链', products: 'Guardian、Radar', tech: '模型扫描', scenes: '模型安全' },
        { name: 'HiddenLayer', role: '模型安全', products: 'AISec Platform', tech: '对抗攻击检测', scenes: '企业模型' },
        { name: 'Robust Intelligence（Cisco）', role: '模型验证', products: 'AI Validation', tech: '模型测试', scenes: '企业部署' },
        { name: 'CalypsoAI', role: '安全网关', products: 'Inspect、Red Team', tech: '策略与红队', scenes: '政府与企业' }
      ] },
      { name: '红队与评测', desc: '在发布前主动攻击模型，找漏洞与越狱路径。', companies: [
        { name: 'Scale AI', role: '红队服务', products: '红队与评测', tech: '专家攻击', scenes: '模型发布前' },
        { name: 'Anthropic', role: '模型安全', products: '安全评估', tech: 'Constitutional AI', scenes: 'Claude 发布' },
        { name: 'OpenAI', role: '安全框架', products: 'Preparedness', tech: '风险分级', scenes: '前沿模型' },
        { name: 'UK AISI', role: '政府评测', products: '前沿评测', tech: '红队', scenes: '监管准入' },
        { name: '中国信通院', role: '标准评测', products: '安全评测体系', tech: '标准与测试', scenes: '国内合规' }
      ] },
      { name: '数据与隐私', desc: '敏感数据识别、脱敏与合规审计。', companies: [
        { name: 'OneTrust', role: '隐私合规', products: '隐私管理、AI 治理', tech: '合规自动化', scenes: '企业合规' },
        { name: 'BigID', role: '数据发现', products: '数据分类、隐私', tech: '数据扫描', scenes: '数据治理' },
        { name: '安恒信息', role: '中国数据安全', products: '数据安全、AI 安全', tech: '分类分级', scenes: '政企合规' },
        { name: '美创科技', role: '中国数据安全', products: '数据脱敏、审计', tech: '数据安全', scenes: '企业数据治理' }
      ] }
    ]
  },

  deploy: {
    levels: [
      ['一句话', '部署与可观测把模型和应用稳定跑在生产环境：扩缩容、灰度、监控、成本控制；它决定同样的卡能服务多少用户、每 token 摊多少成本。'],
      ['打个比方', '像电网调度中心——发电（模型）只是开始，稳定供电靠调度与监控；峰谷差一大，调度能力本身就是利润。'],
      ['拆开看', '五段链路：容器与 GPU 调度 → 模型服务化（批处理、KV 缓存）→ 网关与限流 → 日志 / 追踪 / 指标 → 成本与告警；GPU 利用率是核心指标。'],
      ['怎么运转', '云平台按资源收费，MLOps 平台按席位或集群收费，可观测按数据量收费；单位 token 成本与 SLA 是竞争焦点，闲置产能就是亏损。'],
      ['格局与博弈', '云厂商主导 MLOps，Databricks 做数据 + AI 一体，Modal、BentoML、Anyscale 做开发者友好部署；可观测由 Datadog、Arize 等分食，开源方案在中小团队扩散。'],
      ['边界与走向', '部署会向「Agent 运行时」与「多模型路由」演进：按任务自动选模型、自动扩缩、自动降级；推理调度会像数据库优化器一样成为专门学科，GPU 利用率与单位成本决定谁能打价格战。']
    ],
    industries: [
      { name: '云 MLOps', desc: '模型训练、部署与治理的一体化平台。', companies: [
        { name: 'AWS', role: 'SageMaker', products: 'SageMaker、Bedrock', tech: '训练与推理托管', scenes: '企业模型全生命周期' },
        { name: 'Microsoft Azure', role: 'Azure ML', products: 'Azure Machine Learning', tech: 'MLOps、模型注册', scenes: '企业 AI' },
        { name: 'Google Cloud', role: 'Vertex AI', products: 'Vertex AI Pipelines', tech: 'MLOps、TPU', scenes: '企业模型' },
        { name: '阿里云', role: 'PAI', products: 'PAI、EAS', tech: '训练与推理平台', scenes: '中国企业' },
        { name: '华为云', role: 'ModelArts', products: 'ModelArts', tech: '昇腾训练与推理', scenes: '国产化部署' }
      ] },
      { name: '模型服务化', desc: '把模型包装成可弹性伸缩的推理服务。', companies: [
        { name: 'Modal', role: 'Serverless GPU', products: 'Modal', tech: '按需 GPU、沙箱', scenes: '模型 API 部署' },
        { name: 'BentoML', role: '模型服务', products: 'BentoCloud', tech: '模型打包、推理服务', scenes: '开源模型部署' },
        { name: 'Replicate', role: '模型托管', products: 'Replicate', tech: '容器化推理', scenes: '快速上线' },
        { name: 'Anyscale', role: 'Ray 平台', products: 'Ray、Anyscale', tech: '分布式计算', scenes: '大规模推理与训练' },
        { name: 'KServe', role: '开源服务', products: 'KServe', tech: 'Kubernetes 推理', scenes: '自建集群' }
      ] },
      { name: '数据与 AI 平台', desc: '把数据治理与模型部署放在同一平台。', companies: [
        { name: 'Databricks', role: 'Lakehouse', products: 'Databricks、Mosaic AI', tech: '数据湖仓、模型服务', scenes: '企业数据 + AI' },
        { name: 'Snowflake', role: '数据云', products: 'Snowflake、Cortex', tech: '弹性数仓、AI 函数', scenes: '企业数据 AI' },
        { name: 'Confluent', role: '实时数据', products: 'Kafka、Flink', tech: '流处理', scenes: '实时特征与推理' },
        { name: '阿里云', role: '数据平台', products: 'MaxCompute、PAI', tech: '大数据 + AI', scenes: '中国企业' }
      ] },
      { name: '可观测与运维', desc: '监控模型质量、延迟、成本与安全。', companies: [
        { name: 'Datadog', role: '全栈可观测', products: 'LLM Observability', tech: '指标、日志、追踪', scenes: '生产监控' },
        { name: 'Arize', role: '模型可观测', products: 'Arize、Phoenix', tech: '漂移与质量监控', scenes: '模型运维' },
        { name: 'LangSmith', role: 'Agent 可观测', products: '追踪与评测', tech: '链路追踪', scenes: 'Agent 生产' },
        { name: 'Langfuse', role: '开源可观测', products: 'Langfuse', tech: '开源追踪', scenes: '自建监控' },
        { name: 'Grafana', role: '可视化', products: 'Grafana、Loki', tech: '指标与日志', scenes: '基础设施监控' }
      ] }
    ]
  },

  opsagent: {
    levels: [
      ['一句话', '运维智能体把「盯屏值守」交给 AI：告警分诊、根因定位、低风险变更与巡检自动化，从规则引擎 AIOps 走向大模型驱动的自治运维。'],
      ['打个比方', '像给机房配一个不知疲倦的值班 SRE：告警它先看、故障它先查、常规变更它先做——但按下「生产变更」按钮前，仍要人来复核。'],
      ['拆开看', '四段链路：遥测接入（日志、指标、链路）→ 告警分诊与根因定位 → 自动处置（自愈、扩缩容、切换）→ 变更审计与复盘；运维知识库与权限边界决定它敢做多少事。'],
      ['怎么运转', '按席位或按告警量订阅，效果按 MTTR 缩短与人工工时替代计量；大模型把非结构化日志与拓扑关系「读」起来，规则引擎处理不了的「没见过的问题」成为新战场。'],
      ['格局与博弈', '品类正分化为「AIOps → AI SRE → AgenticOps」：Datadog（Bits）、Dynatrace（Davis）、New Relic 把 agent 嵌进可观测，Resolve.ai 等新锐以「自动处理 80% 报警」为目标融资加码，微软 Azure SRE Agent 把闭环延伸到研发阶段；国内嘉为蓝鲸以 AIDev + A2A 做智能体自治运维一体化，快猫星云（夜莺）走开源可观测路线，华为与深信服把智能运维做进超融合全栈口径，云智慧、必示卡位根因定位；智算中心把 GPU 集群运维变成增速最快的新场景。'],
      ['边界与走向', '运维 agent 会从「建议」走向「受控执行」，信任随审计与回滚能力逐步放开；SRE 从盯屏转向策略与治理，算力运维（巡检、故障卡定位、调度优化）是确定性最高的增量。']
    ],
    industries: [
      { name: '全球可观测与 AIOps 平台', desc: '平台厂商把 agent 嵌进可观测，是运维智能体的第一梯队。', companies: [
        { name: 'Datadog', role: '可观测龙头', products: 'Bits AI、DDOG 平台', tech: '遥测 + LLM 分诊', scenes: '云原生运维' },
        { name: 'Dynatrace', role: '根因 AI 先行', products: 'Davis AI、Grail', tech: '因果定位与自动拓扑', scenes: '复杂混合云' },
        { name: 'New Relic', role: '全栈可观测', products: 'Agentic AIOps、AI 监控', tech: '遥测 + 智能告警', scenes: 'AI 生成代码可靠性' },
        { name: 'Splunk（思科）', role: '日志与安全数据平台', products: 'ITSI、Agentic AI', tech: '机器数据分析', scenes: '大规模日志运维' },
        { name: 'PagerDuty', role: '事件编排', products: 'Ops Suite、AIOps Suite', tech: '告警聚合与升级', scenes: '值班与响应' },
        { name: 'BigPanda', role: '告警关联', products: 'AIOps 事件关联平台', tech: '噪声压缩与聚合', scenes: '企业 NOC' }
      ] },
      { name: 'AI SRE 与自治运维新锐', desc: '国外新势力：多 agent 并行排障，目标「自动处理 80% 报警」。', companies: [
        { name: 'Resolve.ai', role: 'SRE Agent 标杆', products: '数据库/基础设施/代码多 agent', tech: '并行排障 + 遥测关联', scenes: '报警自动处理' },
        { name: 'Shoreline.io', role: '修复动作即代码', products: '自动化运维动作库', tech: 'Op 语言与修复脚本化', scenes: '重复故障自动处置' },
        { name: 'Rootly', role: '事件响应 AI', products: 'AI SRE、事故指挥', tech: '工单 + LLM 复盘', scenes: 'SRE 团队响应' },
        { name: 'Harness', role: '交付与运维一体', products: 'Harness AI SRE、Chaos', tech: 'CI/CD + 混沌工程联动', scenes: 'K8s 团队' }
      ] },
      { name: '国内一体化智能运维与运维大模型', desc: '平台化 + 运维大模型 + 智能体开发，中国市场的本土形态。', companies: [
        { name: '嘉为蓝鲸', role: 'Agentic Ops 一体化', products: '鲸眼/鲸舟/鲸智、AIDev 智能体平台', tech: '蓝鲸 PaaS + 运维大模型 + A2A', scenes: '大型政企与运营商' },
        { name: '快猫星云', role: '开源可观测', products: '夜莺 Nightingale、Flashduty', tech: '调查型 Agent + 告警响应', scenes: 'Prometheus 生态' },
        { name: '观测云', role: '一体化可观测', products: 'Guance 全栈观测', tech: 'DataKit 采集 + SLS 检索', scenes: '云原生与智能体可观测' },
        { name: '擎创科技', role: '首批 AIOps', products: '夏洛克 AIOps 平台', tech: '日志聚类与根因推荐', scenes: '金融与能源' }
      ] },
      { name: '国内根因与告警专业厂商', desc: '电信、金融场景的本土根因定位专业厂商。', companies: [
        { name: '云智慧', role: '国内 AIOps 头部', products: '全景运维、根因分析', tech: '告警收敛 + 因果推断', scenes: '金融与政企' },
        { name: '必示科技', role: '根因定位', products: '智能运维平台', tech: '异常检测与根因算法', scenes: '银行与运营商' },
        { name: '云杉网络', role: '网络可观测', products: 'DeepFlow', tech: '零侵扰追踪（eBPF）', scenes: '云网络诊断' },
        { name: '博睿数据', role: 'APM 老兵', products: 'DataFabius 可观测', tech: '拨测与性能监控', scenes: '企业应用监控' }
      ] },
      { name: '基础设施内嵌与 ITSM 智能体', desc: '超融合/网管内嵌运维能力，ITSM 工作流 AI 化。', companies: [
        { name: '华为', role: 'AI-Native 运维', products: 'FusionCube、AgentArts、AIOps', tech: '昇腾底座 + 运维大模型', scenes: '大政企与信创' },
        { name: '深信服', role: '超融合承载', products: '全栈超融合 + AI 智能运维', tech: 'HCI 内嵌运维能力', scenes: 'VMware 替代客户' },
        { name: '新华三', role: 'UIS 智能运维', products: 'UIS 超融合、SeerEngine', tech: '智简网络 + 运维自动化', scenes: '政企与教育医疗' },
        { name: 'ServiceNow', role: 'ITSM 智能体', products: 'Now Platform、AI Agents', tech: '工作流 + 企业服务管理', scenes: '全球大型企业' }
      ] },
      { name: '算力运维与智算中心服务', desc: 'GPU 集群巡检、故障卡定位与调度优化，增速最快的一格。', companies: [
        { name: '中科曙光', role: '智算运维服务', products: '智算中心运维方案', tech: '液冷集群运维与调度', scenes: '国家智算中心' },
        { name: '联想', role: '端到端算力服务', products: '问天服务器、TruScale', tech: '算力运维订阅', scenes: '政企智算' },
        { name: '万国数据', role: 'IDC 运营运维', products: '智算机房运维', tech: '高功率机房运维体系', scenes: '第三方智算托管' },
        { name: '中软国际', role: 'IT 服务人力替代', products: '智算运维与 IT 外包', tech: '解放号 + 运维服务', scenes: '政企运维服务' }
      ] }
    ]
  },

  computeruse: {
    levels: [
      ['一句话', '浏览器与计算机使用让 AI 像人一样操作软件：看屏幕、点鼠标、填表单、跨应用完成任务；它绕过了「没有 API」这个最大障碍。'],
      ['打个比方', '像雇了一个会用电脑的远程助理——不用 API，直接操作你现有的软件；看得懂屏幕、点得准，才算合格，点错一步可能全盘重来。'],
      ['拆开看', '五段链路：屏幕理解（截图 / OCR / 元素定位）→ 动作规划 → 鼠标键盘执行 → 环境隔离（虚拟机、浏览器容器）→ 失败恢复；可靠性与审计是难点。'],
      ['怎么运转', '按任务或时长收费的 Agent 服务、企业 RPA 订阅、浏览器自动化 API；可靠性决定商业化，人工复核抬高成本，能把失败率压到可接受区间才有毛利。'],
      ['格局与博弈', 'OpenAI Operator、Anthropic Computer Use 定义通用路线，Browserbase、Browser Use 做基础设施，传统 RPA（UiPath）向 Agent 转型；企业先在受控环境试点，金融与政务更谨慎。'],
      ['边界与走向', '可靠性与安全性是最大障碍：权限过大意味着风险，权限过小意味着无用；企业场景会先在「受控环境 + 人工复核」落地，长期可能取代大量重复性软件操作，但责任边界必须先被制度认定。']
    ],
    industries: [
      { name: '通用计算机 Agent', desc: '让模型直接操作图形界面，跨应用完成任务。', companies: [
        { name: 'OpenAI', role: 'Operator', products: 'Operator、Computer Use', tech: '视觉理解、动作规划', scenes: '网页任务、表单填写' },
        { name: 'Anthropic', role: 'Computer Use', products: 'Computer Use API', tech: '屏幕理解、工具调用', scenes: '企业自动化' },
        { name: 'Google', role: 'Project Mariner', products: 'Mariner、Gemini Agent', tech: '浏览器操作', scenes: '搜索与任务执行' },
        { name: 'Microsoft', role: 'Copilot Studio', products: 'Copilot Studio、Computer Use', tech: '企业流程集成', scenes: '办公自动化' },
        { name: 'Adept', role: '早期探索', products: 'ACT-1', tech: '界面理解', scenes: '企业软件操作' }
      ] },
      { name: '浏览器自动化', desc: '为 Agent 提供可隔离、可回放的浏览器环境。', companies: [
        { name: 'Browserbase', role: '浏览器基础设施', products: '托管浏览器、会话', tech: '无头浏览器、隔离', scenes: 'Agent 网页操作' },
        { name: 'Browser Use', role: '开源框架', products: 'Browser Use', tech: 'Playwright + LLM', scenes: '开发者自动化' },
        { name: 'Microsoft', role: 'Playwright', products: 'Playwright', tech: '浏览器自动化', scenes: '测试与 Agent' },
        { name: 'Apify', role: '网页抓取', products: 'Actors、抓取平台', tech: '爬虫与自动化', scenes: '数据采集' }
      ] },
      { name: '企业 RPA', desc: '把规则化流程自动化，并向 Agent 演进。', companies: [
        { name: 'UiPath', role: 'RPA 龙头', products: 'UiPath Platform、Agent', tech: '流程挖掘、Agent', scenes: '财务、客服、运营' },
        { name: 'Automation Anywhere', role: 'RPA', products: 'Automation 360', tech: '流程自动化', scenes: '企业后台' },
        { name: 'Blue Prism', role: 'RPA', products: 'Blue Prism', tech: '流程机器人', scenes: '金融与政府' },
        { name: '来也科技', role: '中国 RPA', products: 'UiBot、Agent', tech: 'RPA + 大模型', scenes: '中国企业' },
        { name: '艺赛旗', role: '中国 RPA', products: 'RPA 平台', tech: '流程自动化', scenes: '金融与制造' }
      ] },
      { name: '沙箱与隔离', desc: '为 Agent 提供安全的执行环境，防止误操作与攻击。', companies: [
        { name: 'E2B', role: 'Agent 沙箱', products: 'E2B Sandbox', tech: 'Firecracker 微虚机', scenes: '代码与计算机 Agent' },
        { name: 'Modal', role: 'Serverless 沙箱', products: 'Modal Sandboxes', tech: '按需容器', scenes: 'Agent 执行' },
        { name: 'Docker', role: '容器隔离', products: 'Docker、Testcontainers', tech: '容器化', scenes: '开发与测试' },
        { name: 'AWS', role: 'Firecracker', products: 'Firecracker、Lambda', tech: '微虚机', scenes: '安全隔离' }
      ] }
    ]
  },

  mcp: {
    levels: [
      ['一句话', '协议与互操作让不同 AI 系统、工具和数据源「说同一种语言」，MCP 是当前最受关注的开放协议；它要解决的是 N×M 的集成爆炸。'],
      ['打个比方', '像 USB-C 接口——设备各异，但插口统一，谁都能接；接口统一后，配件生态才会爆发，而定义接口的人拿走生态租金。'],
      ['拆开看', '五段结构：传输层（stdio / SSE / HTTP）→ 能力声明（tools / resources / prompts）→ 权限与认证 → 服务发现 → 多 Agent 协作（A2A）；安全边界是落地前提。'],
      ['怎么运转', '协议本身开源免费，商业价值在托管服务、网关、安全审计与生态集成；谁运营「最常用的连接器目录」，谁就掌握分发权与默认推荐位。'],
      ['格局与博弈', 'Anthropic 发起 MCP，OpenAI、Google、Microsoft 跟进，A2A 争多 Agent 协作标准；云厂商与工具厂商用协议扩大生态，企业最关心的是审计、权限与数据边界。'],
      ['边界与走向', '协议会从「工具接入」扩展到「身份、支付与权限」：agent 代表谁、能花多少钱、能访问什么，都会写进协议；标准之争决定谁能成为 Agent 时代的入口，协议分裂与治理中立性同样关键。']
    ],
    industries: [
      { name: '协议发起与维护', desc: '定义 Agent 与工具、Agent 与 Agent 之间的接口。', companies: [
        { name: 'Anthropic', role: 'MCP 发起方', products: 'Model Context Protocol', tech: '工具/资源/提示协议', scenes: 'Claude 工具接入' },
        { name: 'Google', role: 'A2A 发起方', products: 'Agent2Agent Protocol', tech: '多 Agent 协作', scenes: '跨 Agent 任务' },
        { name: 'Microsoft', role: '生态跟进', products: 'Copilot、MCP 支持', tech: '企业 Agent 集成', scenes: '办公与云' },
        { name: 'OpenAI', role: '生态跟进', products: 'Agents SDK、MCP 支持', tech: '工具调用', scenes: '开发者生态' }
      ] },
      { name: 'MCP 服务与网关', desc: '把工具接入标准化，并提供托管、发现与治理。', companies: [
        { name: 'Cloudflare', role: '边缘网关', products: 'MCP 托管、Workers', tech: '边缘部署', scenes: '远程 MCP 服务' },
        { name: 'Smithery', role: 'MCP 市场', products: 'MCP 服务目录', tech: '服务发现', scenes: '开发者集成' },
        { name: 'Glama', role: 'MCP 目录', products: 'MCP 服务托管', tech: '服务目录', scenes: '工具接入' },
        { name: 'MCPHub', role: 'MCP 网关', products: 'MCP 聚合网关', tech: '多服务路由', scenes: '企业工具治理' },
        { name: 'Zapier', role: '应用连接', products: 'Zapier MCP', tech: '应用连接器', scenes: '跨 SaaS 自动化' }
      ] },
      { name: '工具与数据接入', desc: '把常用 SaaS 与数据源暴露成 Agent 可调用的工具。', companies: [
        { name: 'GitHub', role: '代码工具', products: 'GitHub MCP Server', tech: '仓库与 Issue 接入', scenes: '编码 Agent' },
        { name: 'Slack', role: '协作工具', products: 'Slack MCP', tech: '消息与频道接入', scenes: '团队 Agent' },
        { name: 'Notion', role: '知识工具', products: 'Notion MCP', tech: '文档接入', scenes: '知识 Agent' },
        { name: 'Stripe', role: '支付工具', products: 'Stripe MCP', tech: '支付与账单接入', scenes: '商业 Agent' },
        { name: '阿里云', role: '云工具', products: '百炼 MCP 服务', tech: '云资源接入', scenes: '中国企业 Agent' }
      ] },
      { name: '安全与治理', desc: '认证、授权与审计，决定协议能否进入企业。', companies: [
        { name: 'Palo Alto Networks', role: 'AI 安全', products: 'Prisma AIRS', tech: 'MCP 流量检测', scenes: '企业 Agent 安全' },
        { name: '奇安信', role: '中国安全', products: 'AI 安全网关', tech: '工具调用审计', scenes: '政企 Agent' },
        { name: 'Okta', role: '身份认证', products: 'Okta、Auth0', tech: 'OAuth、身份治理', scenes: 'Agent 身份' },
        { name: 'Auth0', role: '身份平台', products: 'Auth0', tech: '认证授权', scenes: '开发者集成' }
      ] }
    ]
  }

});
