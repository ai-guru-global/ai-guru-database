/* L4 行业应用层：节点六层解释 + 行业与企业版图（手工策展，口径见 explain.js 头注释）。 */
Object.assign(DB.explain, {
  assistant: {
    levels: [
      ['一句话', '消费级 AI 助手是普通人接触 AI 的入口：聊天、写作、搜索、生成图片、读文件，一个 App 全包；它卖的不是模型，而是「每天第一个打开的框」。'],
      ['打个比方', '像智能手机上的「万能遥控器」——不替代所有 App，但成为最常用的第一入口；谁掌握入口，谁就掌握分发与默认选择权。'],
      ['拆开看', '五层结构：对话界面 → 模型路由（按任务分给不同模型）→ 工具调用（搜索、代码、绘图、文件）→ 记忆与个性化（跨会话上下文）→ 多端同步；记忆深度与工具生态决定留存，而非榜单分数。'],
      ['怎么运转', '变现三条腿：免费引流 + 订阅（约 20 美元/月档）+ 企业版，广告与电商导流是潜在第四条腿；用户规模决定数据飞轮，也决定与模型供应商、云厂商的议价权。'],
      ['格局与博弈', 'ChatGPT 领先消费心智，Gemini 靠安卓、搜索与 Workspace 分发，Claude 主打专业与编码用户，中国豆包/通义/Kimi/元宝在本土竞争；操作系统厂商（苹果、微软、华为）把助手做成系统级入口，试图绕开独立 App。'],
      ['边界与走向', '助手会从「聊天框」变成「常驻智能体」：能主动提醒、跨应用执行、代替用户操作软件；入口之争会蔓延到操作系统、浏览器与硬件，订阅之外交易佣金与广告可能成为更大收入，但信任与权限管理会成为真正的护城河。']
    ],
    industries: [
      { name: '美国助手', desc: '定义消费 AI 产品形态与订阅价格。', companies: [
        { name: 'OpenAI', role: '消费龙头', products: 'ChatGPT、Sora', tech: 'GPT 系列、工具调用', scenes: '聊天、写作、搜索' },
        { name: 'Anthropic', role: '专业用户', products: 'Claude', tech: 'Claude 系列、Artifacts', scenes: '写作、分析与编码' },
        { name: 'Google', role: '分发优势', products: 'Gemini、AI Overviews', tech: '多模态、搜索集成', scenes: '搜索、安卓、办公' },
        { name: 'Microsoft', role: '办公入口', products: 'Copilot', tech: 'GPT + 办公集成', scenes: 'Windows、Office' },
        { name: 'xAI', role: '社交分发', products: 'Grok', tech: '实时数据、Grok 模型', scenes: 'X 平台、API' },
        { name: 'Meta', role: '社交入口', products: 'Meta AI', tech: 'Llama、社交集成', scenes: 'WhatsApp、Instagram' }
      ] },
      { name: '中国助手', desc: '本土消费市场的主力，价格战与场景战并行。', companies: [
        { name: '字节豆包', role: '中国消费龙头', products: '豆包、扣子', tech: '豆包模型、多模态', scenes: '聊天、内容创作' },
        { name: '阿里通义', role: '云 + 消费', products: '通义、夸克', tech: 'Qwen 系列', scenes: '搜索、办公、教育' },
        { name: '百度文心', role: '搜索入口', products: '文心一言、AI 搜索', tech: '文心模型', scenes: '搜索、内容' },
        { name: '腾讯元宝', role: '微信生态', products: '元宝、混元', tech: '混元模型', scenes: '社交、办公' },
        { name: '月之暗面', role: '长上下文', products: 'Kimi', tech: '长上下文、Agent', scenes: '研究、写作' },
        { name: '智谱', role: '开源 + 消费', products: '清言、GLM', tech: 'GLM 系列', scenes: '办公、教育' }
      ] },
      { name: '垂直助手', desc: '在特定场景做深，避开通用助手的正面竞争。', companies: [
        { name: 'Perplexity', role: '答案引擎', products: 'Perplexity', tech: '检索增强', scenes: '研究、问答' },
        { name: 'Character.AI', role: '角色陪伴', products: '角色对话', tech: '角色模型', scenes: '娱乐、陪伴' },
        { name: 'Replika', role: '情感陪伴', products: 'AI 伴侣', tech: '对话模型', scenes: '情感陪伴' },
        { name: 'Inflection', role: '个人助手', products: 'Pi', tech: '共情对话', scenes: '日常陪伴' },
        { name: '夸克', role: '年轻入口', products: '夸克浏览器、AI 搜索', tech: '搜索 + 生成', scenes: '学习、搜索' }
      ] },
      { name: '分发入口', desc: '掌握设备与超级 App 的入口，决定助手的触达。', companies: [
        { name: 'Apple', role: '设备入口', products: 'Siri、Apple Intelligence', tech: '端云协同', scenes: 'iPhone、Mac' },
        { name: 'Google', role: '系统入口', products: 'Android、Chrome', tech: '系统级集成', scenes: '安卓与搜索' },
        { name: 'Samsung', role: '设备入口', products: 'Galaxy AI', tech: '端侧 AI', scenes: '手机与家电' },
        { name: '小米', role: '中国设备', products: '小爱同学、澎湃 OS', tech: '端侧与 IoT', scenes: '手机、汽车、家居' },
        { name: '华为', role: '中国设备', products: '小艺、鸿蒙', tech: '端云协同', scenes: '手机、汽车、办公' },
        { name: '微信', role: '超级 App', products: '微信 AI、元宝入口', tech: '社交分发', scenes: '聊天、小程序' }
      ] }
    ]
  },

  ads: {
    levels: [
      ['一句话', '推荐与广告是 AI 最早规模化变现的场景：排序模型决定你刷到什么，竞价模型决定流量卖多少钱，生成式创意正在改写广告的生产成本。'],
      ['打个比方', '像一座全自动菜市场：摊位（库存）有限，模型决定把最好的位置卖给谁、卖多贵；买家出价实时变化，一秒之内成交上百万次。'],
      ['拆开看', '四层流水线：用户行为数据 → 推荐排序（时长、转化、留存多目标）→ 广告竞价与自动出价 → 创意生成与归因；信号越全模型越准，模型越准 ECPM 越高。'],
      ['怎么运转', '平台卖库存与自动化投放工具，广告主买效果；生成素材把单条制作成本从数千美元压到几十美元，素材数量爆炸后比拼的是投放自动化与归因。'],
      ['格局与博弈', 'Meta 靠 AI 推荐重生并成为广告增长标杆，字节把推荐做成组织能力，谷歌用 AI 防守搜索广告，AppLovin 证明独立投放平台可以暴利；腾讯、阿里、快手在本土竞争。'],
      ['边界与走向', '隐私信号持续变少，模型要从「更多数据」转向「更少数据学得更好」；AI agent 代购会分流点击库存，广告从「抢位置」转向「抢 agent 的推荐资格」。']
    ],
    industries: [
      { name: '超级平台广告', desc: '自有流量 + 自有模型，全球广告利润的大头。', companies: [
        { name: 'Meta', role: '推荐重生标杆', products: 'Advantage+、Reels 广告', tech: '深度推荐、自动投放', scenes: '电商与品牌投放' },
        { name: 'Google', role: '搜索广告', products: 'PMax、搜索与 YouTube', tech: '竞价与归因体系', scenes: '全行业投放' },
        { name: '字节跳动', role: '推荐组织化', products: '巨量引擎、千川', tech: '推荐与转化模型', scenes: '国内与出海投放' },
        { name: '腾讯', role: '社交广告', products: '广告投放端、视频号', tech: '社交场景推荐', scenes: '微信生态' },
        { name: '快手', role: '短视频广告', products: '磁力引擎', tech: '短视频推荐', scenes: '电商与本地' }
      ] },
      { name: '独立投放与联盟网络', desc: '不自有流量，做跨平台买量与变现的中枢。', companies: [
        { name: 'AppLovin', role: '买量暴利', products: 'AXON 投放引擎', tech: '自动化竞价模型', scenes: '手游买量' },
        { name: 'The Trade Desk', role: '程序化', products: 'Kokai 平台', tech: 'RTB 竞价', scenes: '品牌程序化' },
        { name: 'Unity Ads', role: '游戏变现', products: '聚合与变现 SDK', tech: '竞价与设备归因', scenes: '手游变现' },
        { name: '汇量科技', role: '中国出海', products: 'Mobvista 广告网络', tech: '程序化与聚合', scenes: '出海买量' }
      ] },
      { name: '生成式创意与素材', desc: '把广告制作从代理商模式变成模型批量生产。', companies: [
        { name: 'Synthesia', role: '数字人视频', products: '企业视频生成', tech: '数字人 + TTS', scenes: '营销与培训' },
        { name: 'AdCreative.ai', role: '广告素材', products: '素材生成与评分', tech: '转化率预测 + 生成', scenes: '效果广告' },
        { name: 'Runway', role: '视频生成', products: 'Gen 系列视频', tech: '视频扩散模型', scenes: '品牌与影视素材' },
        { name: '蓝色光标', role: '中国代理转型', products: 'AI 营销素材平台', tech: '素材生成工作流', scenes: '国内品牌投放' }
      ] },
      { name: '营销技术与归因', desc: '帮广告主管预算、看效果、防作弊。', companies: [
        { name: 'Salesforce Marketing', role: '营销云', products: 'Marketing Cloud', tech: '旅程编排 + AI', scenes: '企业营销' },
        { name: 'HubSpot', role: '增长套件', products: 'Breeze AI', tech: 'CRM + 内容生成', scenes: '中小企业' },
        { name: 'AppsFlyer', role: '归因', products: '移动归因与保护', tech: '设备归因、防作弊', scenes: 'App 增长' },
        { name: '神策数据', role: '中国分析', products: '用户行为分析', tech: '埋点与标签体系', scenes: '国内增长团队' }
      ] }
    ]
  },

  commerce: {
    levels: [
      ['一句话', '电商与零售是离交易最近的 AI 场景：购物助手替你找货比价，模型帮你选品定价，数字人替你直播——每个环节的提升都能直接换算成 GMV。'],
      ['打个比方', '像给商场配了一个随叫随到的金牌导购：认识你、记得你买过什么、还会帮你砍价；商场的货架规则也会因为它而重排。'],
      ['拆开看', '四段链路：流量入口（搜索、推荐、agent）→ 商品理解与匹配（多模态识别商品）→ 交易转化（比价、凑单、下单）→ 履约与售后（调度、客服）；数据闭环在交易，不在对话。'],
      ['怎么运转', '平台把 AI 塞进搜索与推荐提转化，商家买 SaaS 工具生成素材与运营店铺，通用 agent 想直接替用户下单——三方在「谁掌握交易入口」上博弈。'],
      ['格局与博弈', 'Amazon 用 Rufus 与自研模型重构购物搜索，Shopify 把 AI 塞进建站与营销，阿里、京东用大模型做导购与客服，美团在本地生活验证；品牌方开始自建私域 agent。'],
      ['边界与走向', '购物 agent 若绕过平台直连商家，现有广告与佣金体系会被重写；短期看转化率与退货率的改善，长期看「谁替用户做决定」，入口价值会向 agent 迁移。']
    ],
    industries: [
      { name: '全球电商平台', desc: '流量、商品与履约的一体化平台，AI 先用在搜索推荐。', companies: [
        { name: 'Amazon', role: '全球标杆', products: 'Rufus 购物助手、COSMO', tech: '语义检索 + 推荐', scenes: '全品类电商' },
        { name: '阿里巴巴', role: '中国平台', products: '淘宝问问、生意管家', tech: '导购大模型', scenes: '淘天生态' },
        { name: '拼多多', role: '低价效率', products: '推荐驱动的货架', tech: '转化率模型', scenes: '国内与 Temu' },
        { name: '京东', role: '自营零售', products: '京言助手、言犀', tech: '导购与供应链 AI', scenes: '自营与物流' },
        { name: 'Shopify', role: '建站平台', products: 'Shopify Magic、Sidekick', tech: '商家侧 AI 助手', scenes: '独立站商家' }
      ] },
      { name: '本地生活与即时零售', desc: '高频、履约重的场景，AI 调度价值最大。', companies: [
        { name: '美团', role: '中国本地生活', products: 'AI 助手 Wow、调度系统', tech: '即时配送调度模型', scenes: '外卖与到店' },
        { name: 'DoorDash', role: '美国外卖', products: 'Dash AI', tech: '订单与路线优化', scenes: '北美即时配送' },
        { name: 'Instacart', role: '杂货配送', products: 'Ask Instacart', tech: 'LLM + 商品图谱', scenes: '北美杂货' },
        { name: '顺丰同城', role: '即时履约', products: '智能调度', tech: '运力网络模型', scenes: '同城配送' }
      ] },
      { name: '商家工具与电商 SaaS', desc: '帮商家做素材、管店铺、投广告的乙方。', companies: [
        { name: '微盟', role: '中国 SaaS', products: '智慧零售方案', tech: '私域运营 AI', scenes: '微信生态商家' },
        { name: '有赞', role: '中国 SaaS', products: '店铺与营销工具', tech: 'AI 导购与客服', scenes: '私域商家' },
        { name: '光云科技', role: '电商 SaaS', products: '快麦小智客服', tech: '电商大模型客服', scenes: '淘宝系商家' },
        { name: '店匠 Shoplazza', role: '出海建站', products: '独立站 + AI 素材', tech: '建站与投放 AI', scenes: '跨境电商' }
      ] },
      { name: '履约与供应链', desc: '仓库与运力的智能化，是电商成本的后半场。', companies: [
        { name: '京东物流', role: '一体化供应链', products: '亚洲一号智能仓', tech: '仓储调度模型', scenes: '自营与外部客户' },
        { name: '菜鸟', role: '电商物流', products: '物流平台与驿站', tech: '全链路预测', scenes: '淘系与全球' },
        { name: '极智嘉', role: '仓储机器人', products: 'AMR 机器人集群', tech: '机器人调度', scenes: '海外仓' },
        { name: 'Zebra', role: '零售硬件', products: '扫描与终端设备', tech: '零售数字化终端', scenes: '门店与仓储' }
      ] }
    ]
  },

  enterprise: {
    levels: [
      ['一句话', '企业服务与客服把模型嵌进业务流程：客服、销售、ERP、HR，目标是降本增效而不是炫技；买单的是业务负责人，不是 IT。'],
      ['打个比方', '像给公司每个部门配一个不知疲倦的实习生，但要先教会它公司规矩；教不会，它就会自信地做错事——所以权限、审计与人工兜底比模型本身更重要。'],
      ['拆开看', '五段链路：数据接入（CRM / ERP / 工单 / 知识库）→ 检索与知识治理 → 流程编排与 agent → 权限与审计 → 人工兜底与升级；集成深度决定价值，浅层问答几乎没有留存。'],
      ['怎么运转', '收费方式三选一：按席位、按对话量、按解决率；实施与集成服务常占首年收入大头，续费率与扩张（同一客户更多部门）决定长期毛利。'],
      ['格局与博弈', 'Salesforce、Microsoft、SAP、ServiceNow 把 AI 嵌进现有工作流，Sierra、Decagon 做 AI 客服原生公司，中国用友、金蝶、纷享销客跟进；交付能力与行业知识比模型能力更稀缺，这也是咨询公司与 SI 重新变值钱的原因。'],
      ['边界与走向', '竞争焦点从「模型能力」转向「流程理解与交付」；按结果收费会改变 SaaS 的定价与毛利结构，企业会同时采购平台与垂直 agent，夹在中间的通用工具层被压缩——要么深入某个流程，要么退化成基础设施。']
    ],
    industries: [
      { name: 'CRM 与销售', desc: '把 AI 嵌入客户管理、销售预测与外呼。', companies: [
        { name: 'Salesforce', role: 'CRM 龙头', products: 'Agentforce、Einstein', tech: 'CRM + Agent', scenes: '销售、客服、营销' },
        { name: 'Microsoft', role: 'Dynamics', products: 'Dynamics 365、Copilot', tech: 'ERP/CRM + AI', scenes: '企业全流程' },
        { name: 'HubSpot', role: '营销 CRM', products: 'Breeze AI', tech: '营销自动化', scenes: '中小企业营销' },
        { name: '纷享销客', role: '中国 CRM', products: '连接型 CRM', tech: '销售自动化', scenes: '中国企业销售' },
        { name: '销售易', role: '中国 CRM', products: 'NeoAgent', tech: 'CRM + AI', scenes: '中大型企业' }
      ] },
      { name: '客服与联络中心', desc: 'AI 客服是最成熟的落地场景，按解决率计费兴起。', companies: [
        { name: 'Zendesk', role: '客服平台', products: 'Zendesk AI、Answer Bot', tech: '工单 + AI', scenes: '企业客服' },
        { name: 'Intercom', role: 'AI 客服', products: 'Fin', tech: '对话式 AI', scenes: 'SaaS 客服' },
        { name: 'Sierra', role: 'AI 客服原生', products: '对话 Agent', tech: '任务型对话', scenes: '品牌客服' },
        { name: 'Decagon', role: 'AI 客服', products: '客服 Agent', tech: '企业知识 + Agent', scenes: '高增长公司' },
        { name: '网易七鱼', role: '中国客服', products: '七鱼、AI 客服', tech: '智能路由', scenes: '中国企业客服' },
        { name: '智齿科技', role: '中国客服', products: '客服机器人', tech: 'NLP + 工单', scenes: '电商与金融' }
      ] },
      { name: 'ERP 与办公', desc: '把 AI 嵌入财务、供应链与人力资源。', companies: [
        { name: 'SAP', role: 'ERP 龙头', products: 'Joule、S/4HANA', tech: '企业流程 + AI', scenes: '财务、供应链' },
        { name: 'Oracle', role: 'ERP 与云', products: 'Fusion Cloud、OCI', tech: '企业应用 + 云', scenes: '大型企业' },
        { name: 'Workday', role: 'HR SaaS', products: 'Workday AI', tech: 'HR 与财务', scenes: '人力资源管理' },
        { name: '用友', role: '中国 ERP', products: 'YonGPT、BIP', tech: '企业软件 + 大模型', scenes: '中国政企' },
        { name: '金蝶', role: '中国 ERP', products: '苍穹、AI 助手', tech: '云 ERP', scenes: '中国中小企业' }
      ] },
      { name: 'IT 服务管理', desc: '用 AI 提升 IT 运维、工单与员工服务效率。', companies: [
        { name: 'ServiceNow', role: '工作流平台', products: 'Now Assist、AI Agents', tech: '工作流 + Agent', scenes: 'IT 运维、HR 服务' },
        { name: 'BMC', role: 'ITSM', products: 'Helix、AI 运维', tech: 'IT 服务管理', scenes: '大型企业 IT' },
        { name: 'Freshworks', role: '中小企业', products: 'Freddy AI', tech: '客服与 IT', scenes: '中小企业' },
        { name: 'Atlassian', role: '研发协作', products: 'Jira、Rovo', tech: '项目管理 + AI', scenes: '研发团队' }
      ] }
    ]
  },

  health: {
    levels: [
      ['一句话', '医疗 AI 用模型辅助诊断、药物研发和医院运营，核心是提高准确率与效率，同时守住合规底线；它替代的是重复劳动，不是医生的判断。'],
      ['打个比方', '像给医生配一个过目不忘的助理——能读片、查文献、写病历，但最终签字的是医生；责任边界决定它能走多远，也决定医院敢不敢用。'],
      ['拆开看', '五步链路：医学数据（影像 / 病历 / 组学）→ 模型训练与标注 → 临床验证（回顾性 + 前瞻性）→ 监管审批（NMPA / FDA）→ 医院部署与工作流集成；每一步都比消费级 AI 慢一个数量级。'],
      ['怎么运转', '卖给医院、药企或保险公司，按科室、按项目或按成果收费；医保支付与审批是规模化关键，销售周期以年计，单家医院部署成本高但复制成本低。'],
      ['格局与博弈', '科技巨头提供基础模型与云，垂直公司（推想、联影智能、Tempus）做临床落地，药企用 AI 加速研发；数据与审批是护城河，医院买单看的是效率提升与医疗风险，而非准确率数字。'],
      ['边界与走向', '监管审批与责任界定是最大门槛；多模态与 Agent 会从「辅助」走向「协同诊疗」，但真正的爆发点可能先出现在药研（缩短临床前周期）与医院运营（编码、排班、质控），而非诊断本身。']
    ],
    industries: [
      { name: '医学影像', desc: 'AI 读片是最成熟的医疗 AI 场景，按科室落地。', companies: [
        { name: '推想医疗', role: '中国影像 AI', products: '肺结节、骨折筛查', tech: '深度学习影像分析', scenes: '医院影像科' },
        { name: '联影智能', role: '设备 + AI', products: 'uAI 平台', tech: '影像设备 + AI', scenes: '影像诊断' },
        { name: '鹰瞳科技', role: '眼底筛查', products: '视网膜影像分析', tech: '眼底 AI', scenes: '体检与眼科' },
        { name: 'Aidoc', role: '影像 AI', products: '急症影像筛查', tech: '影像识别', scenes: '急诊与放射科' },
        { name: 'Viz.ai', role: '卒中 AI', products: '卒中检测与转诊', tech: '影像 + 工作流', scenes: '急诊' },
        { name: '深睿医疗', role: '中国影像', products: '影像辅助诊断', tech: '多病种模型', scenes: '医院影像' }
      ] },
      { name: '药物研发', desc: '用 AI 缩短靶点发现与分子设计周期。', companies: [
        { name: 'Insilico Medicine', role: 'AI 制药', products: '端到端药物发现平台', tech: '生成式化学、靶点发现', scenes: '新药研发' },
        { name: 'Recursion', role: 'AI 制药', products: '表型筛选平台', tech: '细胞影像 + 机器学习', scenes: '药物发现' },
        { name: 'Schrödinger', role: '计算化学', products: '分子模拟软件', tech: '物理计算 + AI', scenes: '药物设计' },
        { name: 'Tempus', role: '精准医疗', products: '基因组与临床数据', tech: '多组学数据', scenes: '肿瘤治疗' },
        { name: '晶泰科技', role: '中国 AI 制药', products: '药物晶型与分子设计', tech: '量子物理 + AI', scenes: '新药研发' },
        { name: '英矽智能', role: '中国 AI 制药', products: 'Pharma.AI', tech: '生成式 AI', scenes: '靶点与分子发现' }
      ] },
      { name: '临床文档与助手', desc: '自动生成病历、摘要与随访，减轻医生负担。', companies: [
        { name: 'Nuance（Microsoft）', role: '临床语音', products: 'Dragon Copilot', tech: '语音识别 + 生成', scenes: '病历记录' },
        { name: 'Abridge', role: '临床记录', products: 'AI 病历生成', tech: '医患对话理解', scenes: '门诊记录' },
        { name: 'Ambience', role: '临床文档', products: 'AI 病历', tech: '对话摘要', scenes: '电子病历' },
        { name: '讯飞医疗', role: '中国医疗 AI', products: '智医助理、语音病历', tech: '中文医疗语音', scenes: '基层医疗' },
        { name: '惠每科技', role: '中国临床决策', products: 'CDSS', tech: '指南知识库', scenes: '医院质控' }
      ] },
      { name: '医院运营与保险', desc: '用 AI 优化医保控费、排班与健康管理。', companies: [
        { name: 'Optum', role: '医疗数据', products: '数据分析、支付管理', tech: '医疗数据平台', scenes: '保险与医院运营' },
        { name: 'UnitedHealth', role: '保险 + 医疗', products: '健康管理、理赔', tech: '数据与 AI', scenes: '医疗保险' },
        { name: '平安好医生', role: '中国健康服务', products: '在线问诊、健康管理', tech: '医疗知识图谱', scenes: '互联网医疗' },
        { name: '微医', role: '中国互联网医疗', products: '互联网医院', tech: '分级诊疗', scenes: '在线问诊' },
        { name: '卫宁健康', role: '中国医疗 IT', products: 'WiNEX、AI 助手', tech: '医院信息系统', scenes: '医院信息化' }
      ] }
    ]
  },

  finance: {
    levels: [
      ['一句话', '金融 AI 用模型做投研、风控、客服和合规，数据密集且监管严格，是 AI 落地最快、也最容易被审计的行业之一。'],
      ['打个比方', '像给分析师和风控师配一个读遍全市场报告的助手，但每笔决策都要留痕可审计；快不是唯一目标，可解释与可追溯同样重要。'],
      ['拆开看', '五段链路：市场与客户数据 → 模型与分析 → 决策引擎 → 合规审计与留痕 → 人工复核；私有化部署是常态，数据不出域，模型版本要可回滚。'],
      ['怎么运转', '卖给银行、券商、保险、基金，按席位、按交易量、按模型调用收费；数据与合规是护城河，采购周期长但黏性极高，替换成本以年计。'],
      ['格局与博弈', '大行自建 AI 平台（工行、招行、摩根大通），Bloomberg 用数据终端捆绑 AI，金融科技公司做场景化工具，中国恒生电子、同花顺、东方财富跟进；监管沙盒与模型风险管理要求决定落地节奏。'],
      ['边界与走向', '监管对可解释性与模型风险的要求会持续提高，Agent 会进入投研、运营与合规检查，但交易决策仍以人为主；「可审计的 agent」是金融场景的入场券，谁先把证据链做进产品，谁就先拿到订单。']
    ],
    industries: [
      { name: '投研与资讯', desc: '用 AI 处理海量研报、行情与新闻，服务投资决策。', companies: [
        { name: 'Bloomberg', role: '数据终端龙头', products: 'Terminal、BloombergGPT', tech: '金融数据 + 大模型', scenes: '投研、交易' },
        { name: 'Reuters', role: '金融新闻', products: '新闻与数据', tech: '内容 + AI', scenes: '资讯与投研' },
        { name: 'S&P（Kensho）', role: '金融数据', products: 'Kensho、Capital IQ', tech: '数据与分析', scenes: '投研与风控' },
        { name: '同花顺', role: '中国金融信息', products: 'iFinD、AI 助手', tech: '行情数据 + 模型', scenes: '个人与机构投研' },
        { name: '东方财富', role: '中国金融平台', products: 'Choice、AI 投顾', tech: '数据 + 社区', scenes: '零售投资' },
        { name: '万得', role: '中国数据终端', products: 'Wind 终端', tech: '金融数据库', scenes: '机构投研' }
      ] },
      { name: '银行与保险', desc: '自建 AI 平台，覆盖风控、客服与内部运营。', companies: [
        { name: 'JPMorgan', role: '大行自建', products: 'LLM Suite', tech: '内部知识 + 模型', scenes: '投研、运营' },
        { name: 'Goldman Sachs', role: '投行 AI', products: '内部 AI 工具', tech: '文档与数据分析', scenes: '投行与交易' },
        { name: 'Morgan Stanley', role: '财富管理 AI', products: 'AI @ Morgan Stanley', tech: '顾问知识助手', scenes: '财富管理' },
        { name: '工商银行', role: '中国大行', products: '工银智涌', tech: '金融大模型', scenes: '风控、客服' },
        { name: '平安集团', role: '综合金融', products: '平安 GPT、AI 客服', tech: '金融 + 医疗数据', scenes: '保险、银行' },
        { name: '蚂蚁集团', role: '金融科技', products: '支小宝、百灵', tech: '金融大模型', scenes: '理财、保险' }
      ] },
      { name: '金融科技', desc: '用 AI 做支付、信贷与财富管理的产品化。', companies: [
        { name: 'Stripe', role: '支付', products: 'Stripe Radar、AI 助手', tech: '风控模型', scenes: '支付与反欺诈' },
        { name: 'Plaid', role: '金融数据', products: '账户连接、风控', tech: '数据聚合', scenes: '信贷与支付' },
        { name: 'Upstart', role: 'AI 信贷', products: 'AI 授信', tech: '机器学习风控', scenes: '消费信贷' },
        { name: '度小满', role: '中国金融科技', products: '信贷、理财 AI', tech: '风控模型', scenes: '消费金融' },
        { name: '陆金所', role: '中国财富科技', products: '财富管理平台', tech: '智能投顾', scenes: '财富管理' },
        { name: '京东科技', role: '中国金融科技', products: '供应链金融、AI 风控', tech: '数据 + 模型', scenes: '供应链金融' }
      ] },
      { name: '金融 IT', desc: '为金融机构提供核心系统与 AI 能力。', companies: [
        { name: '恒生电子', role: '中国金融 IT', products: 'UF3.0、LightGPT', tech: '证券基金核心系统', scenes: '券商与基金' },
        { name: '金证股份', role: '中国金融 IT', products: '证券核心系统', tech: '交易与资管', scenes: '券商' },
        { name: '长亮科技', role: '银行 IT', products: '核心银行系统', tech: '银行数字化', scenes: '银行' },
        { name: 'Temenos', role: '全球银行 IT', products: '核心银行平台', tech: '银行软件', scenes: '全球银行' },
        { name: 'FIS', role: '金融科技服务', products: '支付与核心系统', tech: '金融基础设施', scenes: '银行与支付' }
      ] }
    ]
  },

  legal: {
    levels: [
      ['一句话', '法律与合规 AI 用模型读合同、查判例、写文书、做尽职调查，把律师从重复劳动中解放出来；它卖的是「准确引用 + 省下的计费小时」。'],
      ['打个比方', '像给律所配一个过目不忘的 paralegal——能秒查先例，但出庭和签字仍是律师；引用错了，比不会更糟，所以检索与溯源是产品核心。'],
      ['拆开看', '五段链路：法律数据库（判例 / 法规 / 合同库）→ 检索与引用 → 合同审查与风险标注 → 文书生成 → 权限与保密；准确引用是生命线，幻觉与泄密是两个致命风险。'],
      ['怎么运转', '按席位订阅、按文档量收费、企业法务部私有部署；律所与法务是两大客户群，按小时计费的商业模式正在被挑战，收费从「时间」转向「结果与覆盖量」。'],
      ['格局与博弈', 'Harvey 领跑法律 AI，Thomson Reuters、LexisNexis 用权威数据库加 AI 防守，Ironclad、Spellbook 做合同垂直，中国幂律、法大大跟进；拥有权威判例与法规数据的一方天然占优。'],
      ['边界与走向', '幻觉与保密是最大风险，法律 AI 会从「检索助手」走向「事务 Agent」（起草、比对、跟踪期限）；但责任归属仍需制度设计，人机分工的边界会由职业责任保险与律协规则来划定。']
    ],
    industries: [
      { name: '法律研究', desc: '判例、法规与文献检索，是法律 AI 的起点。', companies: [
        { name: 'Thomson Reuters', role: '法律数据库', products: 'Westlaw、CoCounsel', tech: '法律检索 + 生成', scenes: '律所研究' },
        { name: 'LexisNexis', role: '法律数据库', products: 'Lexis+、Protégé', tech: '法律检索 + AI', scenes: '法律研究' },
        { name: 'Harvey', role: '法律 AI 龙头', products: 'Harvey Assistant', tech: '法律模型、工作流', scenes: '律所与企业法务' },
        { name: '北大法宝', role: '中国法律数据', products: '法规检索、AI 助手', tech: '中文法律数据库', scenes: '中国律所' },
        { name: '威科先行', role: '中国法律信息', products: '法律检索、合规', tech: '专业数据库', scenes: '企业与律所' }
      ] },
      { name: '合同与交易', desc: '合同起草、审查与谈判，价值最直接的场景。', companies: [
        { name: 'Ironclad', role: '合同管理', products: 'CLM、AI 审查', tech: '合同生命周期', scenes: '企业法务' },
        { name: 'Spellbook', role: '合同起草', products: 'Word 插件、审查', tech: '法律 LLM', scenes: '交易律师' },
        { name: 'Luminance', role: '合同审查', products: '合同分析', tech: '法律文档理解', scenes: '尽职调查' },
        { name: 'Robin AI', role: '合同 AI', products: '合同审查与起草', tech: '法律模型', scenes: '企业交易' },
        { name: '法大大', role: '中国电子合同', products: '电子签、合同 AI', tech: '电子签名 + AI', scenes: '企业合同' },
        { name: 'e签宝', role: '中国电子签', products: '电子签名、合同管理', tech: '电子签章', scenes: '企业签约' }
      ] },
      { name: '律所管理', desc: '案件、客户与知识管理，提升律所运营效率。', companies: [
        { name: 'Clio', role: '律所管理', products: 'Clio Manage、AI', tech: '律所 SaaS', scenes: '中小律所' },
        { name: 'Filevine', role: '案件管理', products: '案件与文档管理', tech: '法律工作流', scenes: '诉讼律所' },
        { name: 'iCourt', role: '中国法律科技', products: 'Alpha 系统', tech: '案例检索与律所管理', scenes: '中国律所' }
      ] },
      { name: '合规与风控', desc: '监管合规、反洗钱与制裁筛查，金融与跨境需求强。', companies: [
        { name: 'Compliance.ai', role: '合规监测', products: '监管变更追踪', tech: '法规解析', scenes: '金融合规' },
        { name: 'Ascent', role: '合规平台', products: '合规义务管理', tech: '规则引擎', scenes: '金融机构' },
        { name: '妙盈科技', role: '中国 ESG 合规', products: 'ESG 数据与合规', tech: '数据与分析', scenes: '上市公司' }
      ] }
    ]
  },

  secops: {
    levels: [
      ['一句话', '网络安全与安全运营是 AI 的攻防双向军备：攻击者用 AI 写钓鱼与挖漏洞，防守用 AI 分诊告警、自动响应——安全预算的增量几乎全部流向自动化。'],
      ['打个比方', '像给小区同时配了「更聪明的贼」和「更快的保安」：贼学会一天试一万种门锁，保安就必须一秒识别一次异常；双方都在用对方的工具进化。'],
      ['拆开看', '四段链路：遥测与数据（端点、网络、云日志）→ 检测与分析（AI 分诊告警）→ 自动响应（XDR / MDR 闭环）→ 红队与评测（攻击自己找问题）；误报率是产品生命线。'],
      ['怎么运转', '收费从按设备席位转向按数据量与响应次数；SOC 一线分析师被 AI 替代，人力转向规则调优与威胁狩猎；agent 时代新增「agent 身份与权限」安全预算。'],
      ['格局与博弈', 'CrowdStrike 与微软平台化对撞，Wiz 用云安全刷新增长纪录，Palo Alto 全栈防守；中国奇安信、深信服、微步在线深耕政企；攻防两侧都被 AI 同步提速。'],
      ['边界与走向', '安全从「买设备」走向「买结果」（按响应次数、与保险联动计费），agent 的身份、权限与行为审计是新赛道；攻防成本不对称扩大，自动化率决定防守方的存活。']
    ],
    industries: [
      { name: '端点与网络平台', desc: '安全行业的平台层，规模与遥测数据为王。', companies: [
        { name: 'CrowdStrike', role: '端点龙头', products: 'Falcon 平台、Charlotte AI', tech: '云原生端点 + AI 分诊', scenes: '全球企业终端' },
        { name: 'Palo Alto Networks', role: '全栈防火墙', products: 'XSIAM、Cortex', tech: '网络 + 云 + SOAR', scenes: '大型企业与政府' },
        { name: 'Microsoft Security', role: '捆绑分发', products: 'Defender、Sentinel', tech: 'E5 套件捆绑 + Copilot', scenes: 'Microsoft 生态' },
        { name: '奇安信', role: '中国政企', products: '态势感知、终端安全', tech: '政企安全体系', scenes: '关基与政务' },
        { name: '深信服', role: '中国网安', products: '超融合安全、XDR', tech: '安全 GPT', scenes: '企业与医疗教育' }
      ] },
      { name: 'SOC 与检测响应', desc: '把安全运营中心从人力堆叠变成 AI 自动化。', companies: [
        { name: 'Splunk（思科）', role: '日志分析', products: 'Splunk ES、SOAR', tech: '遥测检索与编排', scenes: '大型 SOC' },
        { name: 'SentinelOne', role: '端点 AI', products: 'Purple AI、Singularity', tech: '自主响应', scenes: '中大型企业' },
        { name: 'Darktrace', role: '自学习检测', products: 'Antigena 自响应', tech: '无监督异常检测', scenes: 'OT 与企业网络' },
        { name: '微步在线', role: '中国威胁情报', products: 'TDP、OneEDR', tech: '情报 + 检测联动', scenes: '国内政企' }
      ] },
      { name: '攻防服务与漏洞', desc: '进攻视角的安全：红队、众测与漏洞研究。', companies: [
        { name: 'Mandiant（谷歌）', role: '取证与红队标杆', products: '应急响应、威胁情报', tech: 'APT 追踪', scenes: '重大事件处置' },
        { name: 'HackerOne', role: '众测平台', products: '漏洞赏金网络', tech: 'AI 辅助报告分诊', scenes: '互联网企业' },
        { name: '长亭科技', role: '中国攻防', products: '牧云、雷池 WAF', tech: '攻防研究 + 产品', scenes: '国内企业' },
        { name: '知道创宇', role: '中国云防御', products: '抗 D 保、ZoomEye', tech: '测绘与云防', scenes: '网站与关基' }
      ] },
      { name: '云与身份安全', desc: '上云与 agent 时代的新攻击面防守。', companies: [
        { name: 'Wiz', role: '云安全黑马', products: 'CNAPP 平台', tech: '无代理扫描 + 图分析', scenes: '云上企业' },
        { name: 'Okta', role: '身份龙头', products: 'Identity Cloud', tech: 'SSO 与零信任', scenes: '企业身份' },
        { name: 'CyberArk', role: '特权访问', products: 'PAM 平台', tech: '凭据保护', scenes: '金融与关基' },
        { name: 'Netskope', role: 'SSE 先锋', products: '智能 SD-WAN、DLP', tech: '云交付安全', scenes: '混合办公' }
      ] }
    ]
  },

  edu: {
    levels: [
      ['一句话', '教育 AI 做个性化辅导、批改和课程生成，目标是让每个学生都有一个「专属老师」；它改变的是练习与反馈的密度，而不是学校的组织结构。'],
      ['打个比方', '像家教从「一对多」变成「一对一」，而且这个家教永不疲倦、记得你所有错题；但也要防止它替你写作业——过程可见比答案正确更重要。'],
      ['拆开看', '五段链路：学情数据 → 知识图谱 → 自适应练习与推荐 → 答疑与批改 → 教师端工具与课堂集成；效果验证是核心，学习数据决定个性化程度。'],
      ['怎么运转', '三条收入路径：学校采购（B2G）、机构订阅（B2B）、家长付费（B2C）；政策与减负监管影响巨大，校园渠道决定规模，效果承诺决定续费。'],
      ['格局与博弈', 'Khanmigo、Duolingo 代表海外产品化，国内猿辅导、作业帮、学而思在合规框架内做工具，科大讯飞做校园端；高校与职业教育是增长点，因为成人学习者付费意愿更强、监管更松。'],
      ['边界与走向', '教育 AI 会从「答疑工具」走向「学习规划 Agent」，但未成年人保护与内容安全监管会持续收紧；「过程可信」比「答案正确」更关键——能展示推理、能被老师审核的产品才会被学校接受。']
    ],
    industries: [
      { name: '学习工具', desc: '面向学生与家长的答疑、练习与规划工具。', companies: [
        { name: 'Khan Academy', role: '公益教育', products: 'Khanmigo', tech: 'GPT 辅导、教学法', scenes: 'K12 辅导' },
        { name: 'Duolingo', role: '语言学习', products: 'Duolingo Max', tech: 'AI 对话、角色扮演', scenes: '语言学习' },
        { name: 'Chegg', role: '学习服务', products: 'CheggMate', tech: '答疑与练习', scenes: '大学生学习' },
        { name: 'Quizlet', role: '记忆工具', products: 'Q-Chat', tech: 'AI 闪卡', scenes: '复习备考' },
        { name: '猿辅导', role: '中国教育', products: '小猿 AI、学练机', tech: '自适应学习', scenes: 'K12 学习' },
        { name: '作业帮', role: '中国教育', products: '作业帮、AI 学习机', tech: '题库 + 大模型', scenes: '作业辅导' }
      ] },
      { name: '校园与教务', desc: '面向学校与教师的数字化教学与管理。', companies: [
        { name: '科大讯飞', role: '中国校园 AI', products: '智慧课堂、学习机', tech: '语音 + 教育大模型', scenes: 'K12 校园' },
        { name: '希沃（视源股份）', role: '教学硬件', products: '交互平板、希沃白板', tech: '教育硬件 + 软件', scenes: '课堂互动' },
        { name: '好未来（学而思）', role: '中国教育', products: '九章大模型、学习机', tech: '教育大模型', scenes: 'K12 辅导' },
        { name: '校宝在线', role: '教务管理', products: '校宝系统', tech: '机构管理 SaaS', scenes: '教培机构' }
      ] },
      { name: '语言学习', desc: '口语陪练与个性化纠错，AI 最自然的场景之一。', companies: [
        { name: 'Duolingo', role: '语言学习龙头', products: 'Duolingo Max', tech: 'AI 对话', scenes: '多语种学习' },
        { name: 'Speak', role: '口语练习', products: 'Speak App', tech: '语音识别 + 对话', scenes: '英语口语' },
        { name: 'ELSA', role: '发音纠正', products: 'ELSA Speak', tech: '语音评测', scenes: '发音训练' },
        { name: '流利说', role: '中国英语', products: '懂你英语', tech: 'AI 口语评测', scenes: '英语学习' }
      ] },
      { name: '企业培训', desc: '用 AI 生成课程、陪练与学习路径。', companies: [
        { name: 'Coursera', role: '在线课程', products: 'Coursera Coach', tech: 'AI 助教', scenes: '职业学习' },
        { name: 'Udemy', role: '课程平台', products: 'AI 助手', tech: '课程生成', scenes: '技能培训' },
        { name: 'Docebo', role: '企业学习', products: 'AI 学习平台', tech: '个性化学习', scenes: '企业培训' },
        { name: '云学堂', role: '中国企业培训', products: '企业学习平台', tech: 'AI 课程', scenes: '企业培训' },
        { name: '酷学院', role: '中国企业培训', products: '培训 SaaS', tech: '学习管理', scenes: '中小企业培训' }
      ] }
    ]
  },

  science: {
    levels: [
      ['一句话', '科学与研发 AI 用模型替代「试错」：AlphaFold 破解蛋白质折叠之后，药物发现、材料筛选、气象预报都在被重写——假设检验的成本被压低一个量级。'],
      ['打个比方', '像把实验室的「爱迪生试灯丝」换成「沙盘推演」：模型先在硅上筛掉 99% 的错误答案，湿实验只验证剩下的 1%；算得越准，烧的试管越少。'],
      ['拆开看', '三段链路：数据（文献、公开数据集、专有实验数据）→ 模型（生成 + 预测 + 仿真代理）→ 湿实验验证与迭代；数据闭环在实验室，不在算力。'],
      ['怎么运转', '商业化三条路：卖软件订阅（Schrödinger 类）、按里程碑分成（药物管线）、卖服务（CRO + AI）；验证周期决定收入节奏，管线价值决定估值。'],
      ['格局与博弈', 'Isomorphic Labs 与 Recursion 重做药物发现，晶泰科技把「机器人实验 + AI」做成中国故事，深势科技做科学计算底座，英伟达用 BioNeMo 卖算力底座。'],
      ['边界与走向', 'AI 设计的分子正进入临床，3–5 年验证期是信任的窗口；科研 agent 会先替代文献综述与写作，长期看「自动实验室」把科学变成闭环工程。']
    ],
    industries: [
      { name: '药物发现与生命科学', desc: 'AI4S 商业化最深的赛道，价值随管线兑现。', companies: [
        { name: 'Isomorphic Labs', role: 'DeepMind 衍生', products: 'AlphaFold 系药物设计', tech: '结构预测 + 生成', scenes: '新药管线' },
        { name: 'Recursion', role: '自动化实验', products: '表型筛选平台', tech: '机器人湿实验 + CV 模型', scenes: '药物重定位' },
        { name: '英矽智能', role: '端到端管线', products: 'Pharma.AI 平台', tech: '生成式药物设计', scenes: '自研 + 合作管线' },
        { name: '晶泰科技', role: '中国 AI 制药', products: '机器人实验 + 计算平台', tech: '量子物理 + AI', scenes: '药物与新材料' },
        { name: 'Schrödinger', role: '计算化学老牌', products: 'Maestro、FEP+', tech: '分子模拟 + ML', scenes: '药企研发工具' }
      ] },
      { name: '材料与能源科学', desc: '用模型筛材料，把十年研发压到一年。', companies: [
        { name: 'Google DeepMind', role: 'GNoME', products: '220 万新材料预测', tech: '图网络 + 主动学习', scenes: '材料数据库' },
        { name: '微软研究院', role: 'MatterGen', products: '生成式材料设计', tech: '扩散模型', scenes: '电池与催化' },
        { name: '深势科技', role: '中国科学计算', products: 'Bohrium 平台、DPA 模型', tech: '机器学习势函数', scenes: '药物与材料' },
        { name: '宁德时代', role: '产业自用', products: 'AI 材料筛选产线', tech: '计算 + 实验闭环', scenes: '电池研发' }
      ] },
      { name: '气象与地球科学', desc: 'AI 预报逼近数值模式，成本降一个量级。', companies: [
        { name: 'NVIDIA', role: 'Earth-2', products: 'CorrDiff、数字孪生地球', tech: '生成式气象模型', scenes: '灾害与能源' },
        { name: 'ECMWF', role: '欧洲气象中心', products: 'AIFS 业务化运行', tech: 'AI 数值混合预报', scenes: '全球中期预报' },
        { name: '华为云', role: '盘古气象', products: 'Pangu-Weather', tech: '3D Transformer', scenes: '台风与短临预报' },
        { name: 'Windborne', role: '美国初创', products: '平流层气球观测', tech: '观测 + 模型融合', scenes: '高精度短期预报' }
      ] },
      { name: '科研工具与 agent', desc: '帮研究者读文献、跑综述、写论文的助手层。', companies: [
        { name: 'Elicit', role: '文献综述', products: '论文筛选与提取', tech: '文献 + LLM 抽取', scenes: '科研提速' },
        { name: 'FutureHouse', role: '科研 agent', products: 'PaperQA2 自动综述', tech: '多 agent 检索', scenes: '生物医学' },
        { name: 'SciSpace', role: '论文阅读', products: '论文对话与解释', tech: 'RAG + 公式解析', scenes: '学生与研究者' },
        { name: 'ReadPaper', role: '中国社区', products: '论文精读与协作', tech: '翻译 + 问答', scenes: '国内科研人群' }
      ] }
    ]
  },

  gov: {
    levels: [
      ['一句话', '政务与公共服务是确定性最强的 AI 市场：城市治理、12345 热线、审批与公共安全——预算来自财政，采购看资质，交付靠本地化团队。'],
      ['打个比方', '像给城市配一个「万能办事员 + 值班巡防」：群众来电它接、材料它预审、街面异常它发现；但每一项都要过合规、留痕、可追责。'],
      ['拆开看', '四层结构：政务云与算力底座（国产化要求）→ 大模型能力层（政务语料微调）→ 场景应用（热线、审批、城市大脑）→ 数据安全与审计；资质与等保是入场券，采购目录与预算科目决定什么能立项。'],
      ['怎么运转', '采购以项目制为主，总集成商（运营商、华为、阿里）拿大单再分包；账期以年计，复购与运维合同才是利润来源。'],
      ['格局与博弈', '阿里云与华为竞争城市大脑，科大讯飞领跑政务大模型，智谱、百度跟进；中东主权项目（G42、HUMAIN）输出整套「智慧城市 + 模型」组合。'],
      ['边界与走向', '政务 AI 会从「演示项目」走向「运维付费」，模型国产化与数据不出域是硬约束；公共服务是国产大模型最大的确定性收入池，也是最慢的市场——谁能熬过账期，谁就能拿到复购。']
    ],
    industries: [
      { name: '城市大脑与政务云', desc: '底座层竞争，国产化与资质定胜负。', companies: [
        { name: '阿里云', role: '城市大脑开创者', products: '城市大脑、浙政钉', tech: '数据中台 + 大模型', scenes: '城市治理' },
        { name: '华为', role: '全栈底座', products: '政务云、昇腾集群', tech: '软硬一体国产化', scenes: '政务与应急' },
        { name: '腾讯云', role: 'WeCity', products: '政务微信、城市平台', tech: '连接 + 协同', scenes: '广东等省份' },
        { name: '百度智能云', role: 'AI 政务', products: '智慧城市方案', tech: '文心 + 感知', scenes: '交通与城管' },
        { name: '浪潮信息', role: '政务服务器', products: 'AI 服务器与整机柜', tech: '算力供给', scenes: '政务数据中心' }
      ] },
      { name: '政务大模型与热线', desc: '能力层竞争，讯飞先行者优势明显。', companies: [
        { name: '科大讯飞', role: '政务大模型领跑', products: '星火政务大模型、12345 助手', tech: '语音 + 政务语料', scenes: '热线与审批' },
        { name: '智谱 AI', role: '模型供应商', products: 'GLM 政务版', tech: '私有化部署', scenes: '委办局应用' },
        { name: '百度', role: '文心政务', products: '智能问政', tech: '检索增强 + 审计', scenes: '问答与导办' },
        { name: '云从科技', role: '人机协同', products: '政务窗口辅助', tech: '视觉 + 多模态', scenes: '办事大厅' }
      ] },
      { name: '公共安全与应急', desc: '视频理解与情报研判，合规要求最高。', companies: [
        { name: '海康威视', role: '视频物联', products: '观澜大模型', tech: '视觉感知 + 解析', scenes: '城市安防' },
        { name: '大华股份', role: '智慧安防', products: '星汉大模型', tech: '多模态视觉', scenes: '城市与交通' },
        { name: '旷视科技', role: 'AI 视觉', products: '城市物联网方案', tech: '人脸与行为识别', scenes: '公共安全' },
        { name: '云天励飞', role: '深圳 AI', products: '动态人像系统', tech: '端云协同视觉', scenes: '警务与园区' }
      ] },
      { name: '国际主权与智慧城市', desc: '中国方案的出海市场与海外对标。', companies: [
        { name: 'G42（阿联酋）', role: '中东集团', products: '智慧城市与医疗 AI', tech: '主权云 + 模型引进', scenes: '海湾国家' },
        { name: 'HUMAIN（沙特）', role: '主权算力', products: '国家级 AI 基建', tech: '数据中心 + 模型', scenes: '沙特 2030 愿景' },
        { name: 'GovTech Singapore', role: '新加坡样板', products: 'Smart Nation 平台', tech: '全民数字服务', scenes: '政务服务' },
        { name: 'NEC', role: '日本智慧城市', products: '城市 OS、生物识别', tech: '系统集成', scenes: '日本与东南亚' }
      ] }
    ]
  },
  defense: {
    levels: [
      ['一句话', '国防与军事 AI 是把前沿模型用于情报分析、指挥辅助与无人系统的市场：预算最厚、审查最重，是前沿厂商收入与争议同时放大的买家。'],
      ['打个比方', '像给军队装一个「参谋 + 侦察 + 后勤」的数字大脑——看得快（情报融合）、算得快（方案推演），但每一步都要过保密与伦理的安检门。'],
      ['拆开看', '三条业务线：情报与指挥辅助（融合、翻译、推演）→ 无人与自主系统（无人机集群、自主武器的伦理红线）→ 军工采购与合规（国防授权、涉密云、供应链安全认定）；厂商侧还叠加自家使用政策的红线。'],
      ['怎么运转', '采购以项目制集成为主（Palantir Maven 模式）；模型厂商经授权与专用版本进入；供应链安全认定等政治审查同样决定入场券——被列为「供应链风险」即被挡在门外。'],
      ['格局与博弈', 'Palantir 是情报 AI 集成的既得利益者；前沿 lab 在商用收入与使用政策之间摇摆；开源权重让「任何人可用」成为军控新难题；各国把国防 AI 纳入主权算力布局。'],
      ['边界与走向', '自主武器红线、模型权重出口管制与「战场上用谁的模型」的伦理争议会持续收紧；国防合同成为模型厂商收入里增长最快也最政治化的一块。']
    ],
    industries: [
      { name: '情报与指挥辅助', desc: 'AI 在国防里最先规模化的场景。', companies: [
        { name: 'Palantir', role: '情报集成主导', products: 'Maven 系项目', tech: '本体融合 + LLM', scenes: '情报分析与决策支持' },
        { name: 'OpenAI', role: '模型授权进入', products: '国防合作 / 专用版本', tech: '前沿模型 + 合规栈', scenes: '文书与情报辅助' },
        { name: 'Microsoft', role: '涉密云底座', products: 'Azure Government', tech: '涉密云与合规', scenes: '国防 IT 承载' },
        { name: 'Anduril', role: '软硬一体新军', products: 'Lattice 自主防御栈', tech: '传感器融合 + 自主性', scenes: '边境与防空监控' }
      ] },
      { name: '无人与自主系统', desc: '伦理红线与实战需求并行的硬件层。', companies: [
        { name: 'Anduril', role: '自主系统新贵', products: '无人机与反无人机', tech: '自主任务规划', scenes: '战术侦察与拦截' },
        { name: 'AeroVironment', role: '战术无人机', products: 'Switchblade 系列', tech: '巡飞弹', scenes: '单兵战术支援' },
        { name: '洛克希德·马丁', role: '传统军工', products: '指控与作战系统', tech: '系统集成', scenes: '防空与指控现代化' },
        { name: 'Elbit Systems', role: '以色列防务', products: '智能弹药与电子战', tech: 'AI 目标识别', scenes: '区域防务' }
      ] },
      { name: '涉密云与合规', desc: '入场券本身即生意。', companies: [
        { name: 'Microsoft', role: '涉密云主力', products: 'Azure Government Secret', tech: '分级涉密环境', scenes: '国防级承载' },
        { name: 'AWS', role: '涉密云', products: 'AWS Secret/Top Secret', tech: '隔离区域', scenes: '情报机构工作负载' },
        { name: 'Google Cloud', role: '授权云', products: 'Authorized 云', tech: '合规认证', scenes: '国防办公与分析' },
        { name: 'IBM', role: '联邦合规', products: 'FedRAMP 服务', tech: '合规咨询与托管', scenes: '联邦机构采购' }
      ] }
    ]
  },

  creative: {
    levels: [
      ['一句话', '图像与视频创作 AI 让「想法→成片」的门槛降到一句话，图像、视频、设计、广告都在被重做；它压缩的是执行成本，不是审美判断。'],
      ['打个比方', '像给每个创作者配了一个随叫随到的美术团队——但审美和导演仍由人决定；工具越强，品味与判断越值钱，纯执行岗位被压缩。'],
      ['拆开看', '五段链路：提示词与参考图 → 生成模型 → 局部编辑与一致性（角色、风格、镜头）→ 版权与溯源（C2PA）→ 导出到专业工作流；一致性与可控性是工程难点。'],
      ['怎么运转', '变现四条路：订阅、按积分、API 调用、企业授权；版权与算力成本是两大变量，视频生成尤其吃算力，单价与时长直接决定毛利。'],
      ['格局与博弈', 'Adobe 把 Firefly 嵌入工作流并强调商用安全，Midjourney 做独立品牌与社区，Runway、可灵、Seedance 争视频生成，开源 FLUX、Stable Diffusion 压低价格；版权诉讼正在重塑训练数据来源。'],
      ['边界与走向', '一致性与可控性是下一关，版权诉讼会决定训练数据与商用授权的边界；创作会从「一次生成」走向「可编辑的生成」，专业工作流（分镜、图层、版本管理）才是真正的付费点。']
    ],
    industries: [
      { name: '图像生成', desc: '从文本生成图像，设计与营销的核心工具。', companies: [
        { name: 'Midjourney', role: '独立头部', products: 'Midjourney', tech: '美学优化、风格控制', scenes: '设计、插画' },
        { name: 'Adobe', role: '工作流集成', products: 'Firefly、Photoshop', tech: '生成式填充、版权安全', scenes: '商业设计' },
        { name: 'Black Forest Labs', role: '开源模型', products: 'FLUX', tech: '流匹配、开源权重', scenes: '开发者与工具集成' },
        { name: 'Stability AI', role: '开源模型', products: 'Stable Diffusion', tech: '扩散模型、社区', scenes: '开源图像生成' },
        { name: '字节即梦', role: '中国图像', products: '即梦 AI', tech: '图像与视频生成', scenes: '内容创作' },
        { name: '美图', role: '中国影像', products: '美图秀秀、WHEE', tech: '影像 AI', scenes: '消费影像' }
      ] },
      { name: '视频生成', desc: '从文本/图片生成视频，广告与影视的工业化工具。', companies: [
        { name: 'Runway', role: '视频工具', products: 'Gen 系列', tech: '视频生成与编辑', scenes: '影视与广告' },
        { name: 'Pika', role: '轻量创作', products: 'Pika', tech: '快速生成', scenes: '社交内容' },
        { name: 'Luma', role: '3D 与视频', products: 'Dream Machine', tech: '3D 生成、视频', scenes: '创意与电商' },
        { name: '快手可灵', role: '中国视频', products: '可灵 AI', tech: '运动控制、视频生成', scenes: '短视频与广告' },
        { name: '字节 Seedance', role: '中国视频', products: 'Seedance', tech: '多模态生成', scenes: '即梦、内容平台' },
        { name: 'MiniMax', role: '中国视频', products: '海螺 AI', tech: '视频与语音', scenes: '内容创作' }
      ] },
      { name: '设计与创意工具', desc: '把生成能力嵌入专业工作流，提升产能。', companies: [
        { name: 'Adobe', role: '创意软件龙头', products: 'Photoshop、Premiere、Firefly', tech: '生成式 AI 集成', scenes: '专业创作' },
        { name: 'Canva', role: '在线设计', products: 'Canva AI', tech: '模板 + 生成', scenes: '营销与办公' },
        { name: 'Figma', role: '产品设计', products: 'Figma AI', tech: '设计协作', scenes: 'UI/UX' },
        { name: '剪映', role: '视频编辑', products: '剪映、CapCut', tech: 'AI 剪辑、字幕', scenes: '短视频创作' },
        { name: 'Descript', role: '音视频编辑', products: '文本式编辑', tech: '语音转写、生成', scenes: '播客与视频' }
      ] },
      { name: '版权与素材', desc: '训练数据与生成内容的版权来源，诉讼高发区。', companies: [
        { name: 'Getty Images', role: '图片版权', products: '图片库、生成式授权', tech: '版权管理', scenes: '商业图像授权' },
        { name: 'Shutterstock', role: '素材库', products: '图片/视频/音乐', tech: '授权平台', scenes: '创意素材' },
        { name: 'Adobe Stock', role: '素材库', products: '图片与视频素材', tech: '版权安全生成', scenes: '商业设计' },
        { name: '视觉中国', role: '中国版权', products: '图片与视频素材', tech: '版权交易', scenes: '国内商业授权' }
      ] }
    ]
  },

  audio: {
    levels: [
      ['一句话', '音乐与语音产品把音乐、播客、有声书和语音交互变成可生成、可编辑的内容；语音是 AI 最自然的输入输出，也是最快商业化的模态之一。'],
      ['打个比方', '像把录音棚装进电脑——作曲、配器、配音、剪辑都能用一句话完成；但版权与情感表达仍是人的地盘，声音的人格属性也无法被完全复制。'],
      ['拆开看', '四段链路：生成（音乐 / TTS / 声音克隆）→ 编辑（分轨、降噪、修音）→ 分发（平台与版权结算）→ 交互（实时语音助手）；版权与实时性是两条主线。'],
      ['怎么运转', '变现四条路：订阅、按分钟 API、平台版权分成、企业配音与客服语音；音乐版权方与 AI 公司的谈判决定分成结构，实时语音的延迟与成本决定能否做助手。'],
      ['格局与博弈', 'Suno、Udio 重塑音乐创作但面临唱片公司诉讼，ElevenLabs 做语音基础设施，Spotify、腾讯音乐用 AI 做推荐与创作工具；实时语音 agent 平台（客服、陪伴、硬件）是新增长点。'],
      ['边界与走向', '版权授权模式会决定行业天花板——和解与授权池比技术更关键；实时语音与个性化音频会成为助手与硬件的标配，声音克隆的伦理与监管（标识、授权、禁止伪造）会同步收紧。']
    ],
    industries: [
      { name: '音乐生成', desc: '从文本生成歌曲与配乐，版权争议的中心。', companies: [
        { name: 'Suno', role: '音乐生成头部', products: 'Suno v4', tech: '歌曲生成、人声合成', scenes: '创作、短视频配乐' },
        { name: 'Udio', role: '音乐生成', products: 'Udio', tech: '高保真音乐生成', scenes: '音乐创作' },
        { name: '网易天音', role: '中国音乐 AI', products: '天音、编曲工具', tech: '音乐生成', scenes: '网易云生态' },
        { name: '腾讯音乐', role: '平台 + AI', products: 'AI 作曲、推荐', tech: '音乐理解与生成', scenes: '流媒体平台' },
        { name: '昆仑万维', role: '中国 AI 音乐', products: '天工 SkyMusic', tech: '音乐生成', scenes: '内容创作' }
      ] },
      { name: '音乐流媒体', desc: '用 AI 做推荐、创作工具与个性化内容。', companies: [
        { name: 'Spotify', role: '全球流媒体', products: '推荐、AI DJ', tech: '推荐算法、生成', scenes: '音乐消费' },
        { name: 'Apple Music', role: '流媒体', products: '空间音频、推荐', tech: '音频处理', scenes: '音乐消费' },
        { name: '腾讯音乐', role: '中国流媒体', products: 'QQ 音乐、酷狗', tech: '推荐与版权', scenes: '中国音乐市场' },
        { name: '网易云音乐', role: '中国流媒体', products: '推荐、社区', tech: '推荐算法', scenes: '音乐社交' },
        { name: '汽水音乐（字节）', role: '中国流媒体', products: '推荐流', tech: '算法分发', scenes: '短视频音乐' }
      ] },
      { name: '语音与配音', desc: '把文字变成自然人声，服务内容与客服。', companies: [
        { name: 'ElevenLabs', role: '语音基础设施', products: 'TTS、配音、克隆', tech: '情感 TTS', scenes: '有声书、视频配音' },
        { name: '科大讯飞', role: '中国语音', products: '语音合成、配音', tech: '中文 TTS', scenes: '政企与内容' },
        { name: '字节豆包语音', role: '中国语音', products: 'TTS API', tech: '低延迟合成', scenes: '内容与硬件' },
        { name: '魔音工坊', role: '中国配音', products: 'AI 配音工具', tech: '多音色 TTS', scenes: '短视频配音' },
        { name: 'Descript', role: '音视频编辑', products: 'Overdub、编辑', tech: '语音克隆', scenes: '播客制作' }
      ] },
      { name: '播客与有声书', desc: 'AI 生成与编辑音频内容，降低制作门槛。', companies: [
        { name: 'Audible（Amazon）', role: '有声书', products: 'AI 旁白', tech: 'TTS 配音', scenes: '有声内容' },
        { name: 'Spotify', role: '播客平台', products: '播客推荐、AI DJ', tech: '推荐与生成', scenes: '播客消费' },
        { name: '喜马拉雅', role: '中国音频', products: '有声书、播客', tech: 'AI 配音', scenes: '音频内容' },
        { name: '小宇宙', role: '中国播客', products: '播客社区', tech: '推荐与发现', scenes: '播客消费' },
        { name: 'Podcastle', role: '播客制作', products: 'AI 录制与编辑', tech: '语音增强', scenes: '播客制作' }
      ] }
    ]
  },

  device: {
    levels: [
      ['一句话', 'AI 硬件终端把模型装进眼镜、耳机、胸针和机器人，让 AI 从屏幕里走出来；它赌的是「下一个计算平台」，而不是多卖一个配件。'],
      ['打个比方', '像给 AI 一副身体——不再只是你打开 App 才存在，而是随时在你身边；但多一件设备，就多一份充电、佩戴与社交负担。'],
      ['拆开看', '五段链路：芯片（NPU / SoC）→ 传感器（摄像头、麦克风、IMU）→ 端侧模型 → 连接与云协同 → 交互设计；续航、重量与隐私是三条硬约束。'],
      ['怎么运转', '变现三层：卖硬件（一次性）+ 订阅（AI 服务）+ 生态分成；出货量与毛利率决定能否持续，退货率与日活时长暴露体验问题。'],
      ['格局与博弈', 'Meta Ray-Ban 眼镜领跑，苹果、华为、小米把 AI 塞进手机与耳机，Rabbit、Humane 证明「纯 AI 硬件」很难独立成立；中国供应链快速跟进，价格战会先于场景成熟到来。'],
      ['边界与走向', '形态会向「无感佩戴」演进，AI 眼镜可能成为下一个计算平台；但杀手级场景仍未出现，隐私与社交接受度是隐形门槛——能拍照的眼镜在哪些场合被允许，比芯片算力更决定普及速度。']
    ],
    industries: [
      { name: '手机与 PC', desc: '端侧 AI 最大的存量入口，换机周期与 AI 功能绑定。', companies: [
        { name: 'Apple', role: '高端手机/PC', products: 'iPhone、Mac、Apple Intelligence', tech: '自研 SoC、端云协同', scenes: '个人计算与 AI' },
        { name: '三星', role: '安卓旗舰', products: 'Galaxy、Galaxy AI', tech: '端侧 AI、折叠屏', scenes: '手机与家电' },
        { name: '华为', role: '中国高端', products: 'Mate、鸿蒙', tech: '自研芯片、端云协同', scenes: '手机、汽车、办公' },
        { name: '小米', role: '中国性价比', products: '小米手机、澎湃 OS', tech: '端侧 AI、IoT', scenes: '手机与智能家居' },
        { name: '联想', role: 'AI PC', products: 'ThinkPad、AI PC', tech: '端侧模型、个人智能体', scenes: '办公与创作' },
        { name: '荣耀', role: '中国手机', products: 'Magic 系列', tech: '端侧 AI', scenes: '手机' }
      ] },
      { name: '智能眼镜与穿戴', desc: '无感佩戴的 AI 入口，眼镜是当前最热形态。', companies: [
        { name: 'Meta', role: '智能眼镜龙头', products: 'Ray-Ban Meta', tech: '多模态、语音交互', scenes: '拍摄、翻译、助理' },
        { name: '雷鸟创新', role: '中国 AR', products: '雷鸟 Air、X 系列', tech: '光波导、AR 显示', scenes: '观影与办公' },
        { name: 'Rokid', role: '中国 AR', products: 'Rokid Glasses', tech: 'AR + AI', scenes: '提词、翻译' },
        { name: 'Xreal', role: 'AR 眼镜', products: 'Air 系列', tech: '空间显示', scenes: '大屏观影' },
        { name: '李未可', role: 'AI 眼镜', products: 'AI 眼镜', tech: '语音助手', scenes: '出行与翻译' },
        { name: '蜂巢科技', role: 'AI 音频眼镜', products: '界环 AI 音频眼镜', tech: '音频 + AI', scenes: '日常助理' }
      ] },
      { name: 'AI 原生硬件', desc: '为 AI 重新设计形态，验证新交互。', companies: [
        { name: 'Rabbit', role: 'AI 硬件', products: 'Rabbit R1', tech: '大动作模型', scenes: '语音助理' },
        { name: 'Humane', role: 'AI 胸针', products: 'AI Pin', tech: '投影 + 语音', scenes: '随身助理' },
        { name: 'Plaud', role: '录音硬件', products: 'Plaud Note', tech: '录音 + 转写 + 摘要', scenes: '会议记录' },
        { name: 'Limitless', role: '可穿戴记录', products: 'Pendant', tech: '持续录音、检索', scenes: '个人记忆' },
        { name: '科大讯飞', role: '中国 AI 硬件', products: '录音笔、翻译机', tech: '语音识别与合成', scenes: '办公与出行' }
      ] },
      { name: '耳机与音箱', desc: '语音交互的成熟载体，AI 功能成为新卖点。', companies: [
        { name: 'Apple', role: '耳机龙头', products: 'AirPods', tech: '端侧语音、空间音频', scenes: '语音助手' },
        { name: '索尼', role: '音频硬件', products: 'WH/WF 系列', tech: '降噪、音频处理', scenes: '音乐与通话' },
        { name: 'Bose', role: '音频硬件', products: 'QuietComfort', tech: '降噪', scenes: '音乐与通话' },
        { name: '小米', role: '中国音频', products: '小米音箱、耳机', tech: '小爱同学', scenes: '智能家居' },
        { name: '漫步者', role: '中国音频', products: '耳机、音箱', tech: '音频硬件', scenes: '消费音频' },
        { name: 'Amazon', role: '智能音箱', products: 'Echo、Alexa+', tech: '语音助手', scenes: '智能家居' }
      ] }
    ]
  },

  embodiedapp: {
    levels: [
      ['一句话', '具身智能应用让机器人真正干活：进工厂、仓库、医院和家庭，完成物理世界的任务；它比软件 agent 难一个量级，因为错误不可回滚。'],
      ['打个比方', '像给机器人一份「工作说明书」——不仅要会动，还要会判断、会纠错、会协作；说明书越模糊，越依赖模型泛化，也越依赖现场数据。'],
      ['拆开看', '五段链路：本体与执行器 → 感知与定位 → 运动规划 → 任务策略（VLA 模型）→ 数据闭环与远程接管；可靠性、节拍与安全是第一指标。'],
      ['怎么运转', '卖机器人（硬件）+ 软件订阅 + 按任务或按产线收费；ROI 取决于替代人工的成本，回本周期超过三年就难卖，停机与维护成本常被低估，远程接管与保险也是隐性开支。'],
      ['格局与博弈', 'Tesla、Figure、宇树、智元争人形整机，亚马逊、极智嘉在物流场景规模化，医院与工厂先落地；数据与场景是壁垒，量产良率与售后网络决定谁能交付，而失败案例的传播速度远快于成功案例。'],
      ['边界与走向', '通用人形仍需 3–5 年成熟，短期机会在「垂直场景 + 专用机器人」；VLA 模型与仿真数据是技术主线，量产、可靠性与安全认证是商业主线，两者节奏并不同步。']
    ],
    industries: [
      { name: '人形机器人', desc: '通用具身智能的旗舰形态，量产与成本是分水岭。', companies: [
        { name: 'Tesla', role: '美国整机', products: 'Optimus', tech: 'FSD 迁移、执行器自研', scenes: '工厂、家庭' },
        { name: 'Figure AI', role: '美国整机', products: 'Figure 02/03', tech: '端到端模型、灵巧手', scenes: '汽车工厂、物流' },
        { name: '宇树科技', role: '中国整机', products: 'H1/G1、四足机器人', tech: '关节电机、运动控制', scenes: '科研、巡检、表演' },
        { name: '智元机器人', role: '中国整机', products: '远征、灵犀系列', tech: 'VLA 模型、本体自研', scenes: '工厂、商业服务' },
        { name: '优必选', role: '中国整机', products: 'Walker 系列', tech: '伺服舵机、运动控制', scenes: '工厂、教育、服务' },
        { name: '傅利叶', role: '中国整机', products: 'GR 系列', tech: '康复与人形本体', scenes: '医疗康复、科研' },
        { name: 'Agility', role: '美国物流', products: 'Digit', tech: '双足物流机器人', scenes: '仓库搬运' },
        { name: 'Apptronik', role: '美国整机', products: 'Apollo', tech: '模块化人形', scenes: '制造与物流' }
      ] },
      { name: '物流与仓储', desc: '机器人商业化最成熟的场景，按效率付费。', companies: [
        { name: '亚马逊机器人', role: '仓储自动化', products: 'Kiva、Proteus、Sequoia', tech: '仓储机器人、视觉', scenes: '电商仓配' },
        { name: '极智嘉', role: '中国 AMR', products: 'AMR、货到人系统', tech: 'SLAM、调度算法', scenes: '电商与制造物流' },
        { name: '海康机器人', role: '中国机器视觉', products: 'AGV/AMR、工业相机', tech: '视觉感知、调度', scenes: '工厂与仓储' },
        { name: '快仓', role: '中国仓储机器人', products: 'AMR、智能仓', tech: '集群调度', scenes: '电商仓储' },
        { name: '京东物流', role: '中国物流', products: '无人仓、配送机器人', tech: '仓储与配送自动化', scenes: '电商物流' }
      ] },
      { name: '工业制造', desc: '工业机器人存量最大，AI 提升柔性与易用性。', companies: [
        { name: '发那科', role: '工业机器人龙头', products: '六轴、协作机器人', tech: '运动控制、视觉', scenes: '汽车、电子制造' },
        { name: 'ABB', role: '工业机器人', products: '工业机器人、自动化', tech: '运动控制、数字化', scenes: '制造与物流' },
        { name: '库卡', role: '工业机器人', products: '工业机器人、AMR', tech: '自动化集成', scenes: '汽车制造' },
        { name: '安川电机', role: '工业机器人', products: '伺服、机器人', tech: '运动控制', scenes: '焊接、装配' },
        { name: '新松', role: '中国机器人', products: '工业与移动机器人', tech: '自动化集成', scenes: '汽车与半导体' },
        { name: '埃斯顿', role: '中国工业机器人', products: '工业机器人、伺服', tech: '运动控制', scenes: '焊接、搬运' }
      ] },
      { name: '医疗与服务', desc: '手术、康复与配送机器人，按临床价值付费。', companies: [
        { name: 'Intuitive', role: '手术机器人', products: '达芬奇', tech: '微创手术机器人', scenes: '外科手术' },
        { name: '微创机器人', role: '中国手术机器人', products: '图迈、蜻蜓眼', tech: '腔镜手术机器人', scenes: '外科手术' },
        { name: '天智航', role: '骨科机器人', products: '天玑', tech: '骨科导航', scenes: '骨科手术' },
        { name: '普渡科技', role: '服务机器人', products: '配送机器人', tech: 'SLAM、调度', scenes: '餐饮与酒店' },
        { name: '擎朗智能', role: '服务机器人', products: '配送与清洁机器人', tech: '自主导航', scenes: '餐饮、医院' }
      ] }
    ]
  },

  mobility: {
    levels: [
      ['一句话', '自动驾驶与出行是物理世界 AI 最大的单一市场：Robotaxi 已经开始载客收费，辅助驾驶在量产车上快速渗透，出行是万亿级的人类活动替换。'],
      ['打个比方', '像给城市装上一亿个永不疲劳的司机——但他们必须证明比人类安全十倍，否则保险、监管和舆论都不会放行。'],
      ['拆开看', '四层堆栈：传感器（相机、激光雷达、毫米波）→ 车规算力（Orin/Thor、昇腾）→ 端到端模型（感知-规划-控制一体）→ 车队运营（调度、充电、远程协助）；安全冗余贯穿每一层。'],
      ['怎么运转', '三条路线并行：Robotaxi 重资产运营按公里收费，整车厂把辅助驾驶做成卖点卖订阅，供应商卖方案与芯片；车队数据反哺模型，形成公里级数据闭环。'],
      ['格局与博弈', 'Waymo 领先北美 Robotaxi，特斯拉 FSD 走纯视觉端到端，华为 ADS 与小鹏在中国密集开城，百度萝卜快跑跑通低成本运营；Mobileye 在 ADAS 存量市场防守。'],
      ['边界与走向', '端到端大模型上车让迭代从「以年计」进入「以月计」，竞争转向数据规模与安全论证；责任从司机转向厂商后，保险与法规将决定 Robotaxi 的扩张速度。']
    ],
    industries: [
      { name: 'Robotaxi 与出行服务', desc: '车队、调度与安全体系的重资产运营。', companies: [
        { name: 'Waymo', role: '北美标杆', products: '旧金山/凤凰城 Robotaxi', tech: '激光雷达 + 冗余系统', scenes: '付费载客运营' },
        { name: '百度萝卜快跑', role: '中国运营', products: 'RT6 低价车型车队', tech: '低成本整车 + 调度', scenes: '武汉等城市' },
        { name: '小马智行', role: '中国 Robotaxi', products: '车队运营与干线', tech: 'L4 系统方案', scenes: '一线城市' },
        { name: '文远知行', role: '出海运营', products: 'Robotaxi 与 Robobus', tech: 'L4 方案', scenes: '中东与东南亚' }
      ] },
      { name: '整车与辅助驾驶', desc: '把自动驾驶做成产品卖点与订阅收入。', companies: [
        { name: 'Tesla', role: '纯视觉路线', products: 'FSD、Cybercab', tech: '端到端神经网络', scenes: '量产车订阅' },
        { name: '华为（引望）', role: '方案商', products: 'ADS 3.0、乾崑', tech: '激光雷达融合 + 端到端', scenes: '多品牌合作' },
        { name: '小鹏', role: '整车自研', products: 'XNGP、图灵芯片', tech: '端到端大模型', scenes: '自家车型' },
        { name: '比亚迪', role: '规模普及', products: '天神之眼', tech: '全梯队智驾方案', scenes: '全系车型下放' },
        { name: '理想', role: '家庭用车', products: 'AD Max、VLA 司机', tech: 'VLA 模型上车', scenes: '增程与纯电' }
      ] },
      { name: '方案与芯片', desc: '车规算力与驾驶系统方案的供给层。', companies: [
        { name: 'NVIDIA', role: '算力平台', products: 'Orin、Thor 芯片', tech: '车规 GPU + CUDA', scenes: '高阶智驾' },
        { name: 'Mobileye', role: 'ADAS 老牌', products: 'EyeQ、SuperVision', tech: '视觉感知芯片', scenes: '全球 ADAS 存量' },
        { name: '地平线', role: '国产芯片', products: '征程 6 系列', tech: 'BPU 车规计算', scenes: '国产车型' },
        { name: 'Qualcomm', role: '座舱 + 智驾', products: 'Snapdragon Ride', tech: '座舱智驾一体', scenes: '中阶车型' },
        { name: '德赛西威', role: '中国 Tier1', products: '域控制器', tech: '域控集成', scenes: '国内车企' }
      ] },
      { name: '传感器与零部件', desc: '感知层的硬件供给，激光雷达正在快速降本。', companies: [
        { name: '禾赛科技', role: '激光雷达', products: 'ATX/AT 系列', tech: '半固态激光雷达', scenes: 'Robotaxi 与量产车' },
        { name: '速腾聚创', role: '激光雷达', products: 'MX 降本型号', tech: 'MEMS 与补盲', scenes: '量产车普及' },
        { name: '舜宇光学', role: '车载光学', products: '车载镜头模组', tech: '光学精密制造', scenes: '全球车企' },
        { name: '博世', role: '传统 Tier1', products: '毫米波雷达、底盘', tech: '底盘与感知集成', scenes: '全球供应链' },
        { name: '经纬恒润', role: '国产 Tier1', products: '域控与传感器', tech: 'ADAS 配套', scenes: '国内车型' }
      ] }
    ]
  },

  mfg: {
    levels: [
      ['一句话', '工业与制造 AI 在产线上替代的是「老师傅的眼睛和经验」：质检看缺陷，维护预测故障，工艺模型调参数——每一项都能直接换算成钱。'],
      ['打个比方', '像给工厂配了一个 24 小时不眨眼的质检员 + 老中医：肉眼漏检的它看得见，设备「要生病」的征兆它提前听得出来。'],
      ['拆开看', '四段链路：产线数据采集（视觉、振动、温度）→ 边缘推理（产线侧毫秒级响应）→ 模型与工艺优化 → MES/ERP 集成；失败成本越高的环节，AI 价值越大。'],
      ['怎么运转', '三条付费路径：卖设备（检测一体机）、卖项目（集成交付）、卖订阅（按产线或按检测量）；项目制毛利低但黏性强，标准化设备毛利高但要摊研发。'],
      ['格局与博弈', '西门子与达索把 AI 塞进工业软件，康耐视与基恩士守机器视觉，创新奇智与思谋做国产方案，格创东智背靠制造业集团；边缘算力上英伟达 Jetson 与华为 Atlas 相争。'],
      ['边界与走向', '质检与维护之后，价值会向「工艺参数优化」与「产线级智能体」迁移；数字孪生从演示走向排产与仿真，工业数据主权与安全是采购的先决条件。']
    ],
    industries: [
      { name: '工业软件与仿真', desc: '设计与制造的知识载体，AI 正在重写交互方式。', companies: [
        { name: 'Siemens', role: '工业软件巨头', products: 'NX、Teamcenter', tech: 'PLM + AI 助手', scenes: '高端制造' },
        { name: '达索系统', role: '3D 体验', products: 'CATIA、SOLIDWORKS', tech: '3D 建模 + 仿真', scenes: '航空汽车' },
        { name: 'PTC', role: 'PLM 与 AR', products: 'Creo、ThingWorx', tech: '物联网平台', scenes: '智能互联产品' },
        { name: 'ANSYS', role: '仿真龙头', products: '多物理场仿真 + AI', tech: '仿真代理模型', scenes: '研发降本' },
        { name: '中望软件', role: '国产 CAD', products: '中望 CAD/3D', tech: '自主几何内核', scenes: '国产设计' }
      ] },
      { name: '机器视觉与检测', desc: '工业 AI 最成熟的落地形态：缺陷检测。', companies: [
        { name: '康耐视', role: '视觉龙头', products: 'In-Sight 视觉系统', tech: '深度学习检测', scenes: '全球产线' },
        { name: '基恩士', role: '传感器王者', products: '视觉与测量传感器', tech: '高毛利标准品', scenes: '工厂自动化' },
        { name: '海康机器人', role: '国产视觉', products: '机器视觉与 AMR', tech: '视觉 + 调度', scenes: '国内工厂' },
        { name: '凌云光', role: '国产视觉', products: '视觉检测系统', tech: '光学 + 算法', scenes: '消费电子产线' },
        { name: '思谋科技', role: 'AI 质检', products: '软硬一体检测', tech: '深度学习质检', scenes: '精密制造' }
      ] },
      { name: '工业互联网与集成', desc: '把数据、模型与产线系统集成起来的乙方。', companies: [
        { name: '创新奇智', role: 'AI 工业', products: 'AInnovation 制造方案', tech: '视觉 + 知识图谱', scenes: '大中型工厂' },
        { name: '格创东智', role: 'TCL 背景', products: '工业互联网平台', tech: '半导体制造软件', scenes: '泛半导体与制造' },
        { name: '宝信软件', role: '钢铁信息化', products: 'MES 与 IDC', tech: '流程工业软件', scenes: '钢铁冶金' },
        { name: '树根互联', role: '三一背景', products: '根云平台', tech: '重工设备互联', scenes: '工程机械' }
      ] },
      { name: '边缘算力与自动化', desc: '产线侧的算力与执行机构。', companies: [
        { name: 'NVIDIA Jetson', role: '边缘 AI', products: 'Orin NX/Nano', tech: '低功耗 GPU 模组', scenes: '产线推理' },
        { name: '华为 Atlas', role: '国产边缘', products: 'Atlas 500/800', tech: '昇腾边缘算力', scenes: '国产产线' },
        { name: '研华科技', role: '工控机', products: '边缘计算硬件', tech: '工业 PC', scenes: '设备联网' },
        { name: '汇川技术', role: '国产自动化', products: '伺服、PLC、变频', tech: '运动控制', scenes: '工厂自动化' }
      ] }
    ]
  },

  game: {
    levels: [
      ['一句话', '游戏与娱乐 AI 既做「更聪明的 NPC 和内容生成」，也做「游戏开发提效」，是 AI 商业化最自然的场景之一；它同时是技术试验场和现金流业务。'],
      ['打个比方', '像给游戏世界装上「活的演员和编剧」——NPC 能自由对话，关卡和美术可以批量生成；但成本、延迟与内容安全要算得过来。'],
      ['拆开看', '四段链路：内容生成（美术、关卡、剧情、配音）→ 智能 NPC（对话与行为）→ 测试与运营（自动化 QA、反作弊）→ 个性化推荐与商业化；实时性与成本是硬约束。'],
      ['怎么运转', '变现四条路：游戏内购与订阅、开发工具订阅、AI NPC 服务按调用收费、UGC 平台分成；大厂自研管线，中小团队买工具，成本敏感度极高。'],
      ['格局与博弈', '腾讯、网易、米哈游自建 AI 管线，Unity、Unreal 把 AI 嵌入引擎，Inworld、Convai 做 NPC 中间件，Roblox 开放生成工具给创作者；算力成本与内容审核是共同瓶颈。'],
      ['边界与走向', 'AI NPC 会从「噱头」变成标配，生成内容的质量、版权与未成年人保护仍是问题；游戏会成为具身与世界模型的训练场，也是 agent 最低成本的试验田——先在这里跑通，再迁移到现实场景。']
    ],
    industries: [
      { name: '游戏大厂', desc: '自建 AI 管线，把生成与智能 NPC 用于研发和运营。', companies: [
        { name: '腾讯', role: '全球游戏龙头', products: '王者荣耀、和平精英', tech: 'AI 美术、NPC、匹配', scenes: '研发提效与运营' },
        { name: '网易', role: '中国游戏', products: '逆水寒、蛋仔派对', tech: '伏羲 AI、智能 NPC', scenes: '游戏研发与运营' },
        { name: '米哈游', role: '中国二次元', products: '原神、崩坏', tech: 'AI 内容生成', scenes: '内容生产' },
        { name: 'EA', role: '欧美大厂', products: 'FIFA、战地', tech: 'AI 测试、NPC', scenes: '游戏研发' },
        { name: 'Take-Two', role: '欧美大厂', products: 'GTA、NBA 2K', tech: 'AI 内容与 NPC', scenes: '开放世界' },
        { name: 'Ubisoft', role: '欧美大厂', products: '刺客信条', tech: 'AI NPC、生成', scenes: '开放世界' }
      ] },
      { name: '引擎与工具', desc: '把 AI 能力嵌入引擎与创作管线。', companies: [
        { name: 'Unity', role: '游戏引擎', products: 'Unity、Muse', tech: 'AI 生成、实时 3D', scenes: '游戏与仿真' },
        { name: 'Epic（Unreal）', role: '游戏引擎', products: 'Unreal Engine', tech: '高保真渲染、AI 工具', scenes: '3A 游戏与影视' },
        { name: 'Roblox', role: 'UGC 平台', products: 'Roblox Studio、生成工具', tech: 'AI 生成 3D 内容', scenes: '用户创作' },
        { name: 'NVIDIA', role: '游戏 AI', products: 'ACE、DLSS', tech: '数字人、渲染', scenes: '智能 NPC、图形' },
        { name: 'Inworld', role: 'NPC 中间件', products: 'Inworld AI', tech: '角色人格、对话', scenes: '游戏 NPC' },
        { name: 'Convai', role: 'NPC 对话', products: 'Convai', tech: '语音 + 角色', scenes: '虚拟角色' }
      ] },
      { name: '内容生成', desc: '批量生成美术、3D 资产与剧情，降低制作成本。', companies: [
        { name: 'Scenario', role: '游戏美术', products: 'Scenario', tech: '风格化图像生成', scenes: '游戏资产' },
        { name: 'Leonardo.Ai', role: '美术生成', products: 'Leonardo', tech: '图像生成', scenes: '概念设计' },
        { name: 'Meshy', role: '3D 生成', products: 'Meshy', tech: '文本/图像转 3D', scenes: '游戏资产' },
        { name: 'Tripo', role: '3D 生成', products: 'Tripo', tech: '3D 生成', scenes: '资产制作' },
        { name: '网易伏羲', role: '中国游戏 AI', products: 'AI 美术、NPC', tech: '游戏 AI', scenes: '网易游戏' }
      ] },
      { name: '游戏 AI 服务', desc: '测试、陪玩与反作弊，提升运营效率。', companies: [
        { name: 'Modl.ai', role: 'AI 测试', products: '自动化测试', tech: 'AI 玩家', scenes: '游戏 QA' },
        { name: 'GGWP', role: '社区治理', products: ' toxicity 检测', tech: '行为分析', scenes: '游戏社区' },
        { name: '腾讯 AI Lab', role: '游戏 AI 研究', products: '绝悟、AI 陪练', tech: '强化学习', scenes: '游戏平衡与陪玩' },
        { name: '网易伏羲', role: '游戏 AI', products: '智能 NPC、测试', tech: '强化学习', scenes: '游戏研发' }
      ] }
    ]
  },

  office: {
    levels: [
      ['一句话', '办公与协同 AI 把模型塞进文档、表格、会议和 IM，让「写、算、开会」都自动化一部分；它卖的是每个员工每天省下的几十分钟。'],
      ['打个比方', '像给每个员工配一个会议纪要员 + 表格助手 + 写作教练，随叫随到；但权限没管好，它也会泄密，所以企业版的第一道门槛是数据边界。'],
      ['拆开看', '五段链路：文档与邮件生成 → 表格分析与建模 → 会议转录与摘要 → 任务分派与跟踪 → 企业知识检索；权限、数据安全与审计是前提。'],
      ['怎么运转', '按席位订阅（约 30 美元/月档）、企业版按用量、捆绑进办公套件；生态锁定是核心，续费率看实际使用深度，而非开通率。'],
      ['格局与博弈', 'Microsoft 365 Copilot 与 Google Workspace Gemini 两强，飞书、钉钉、企业微信在中国市场做本土化与生态整合，Notion、Slack 等做单点突破；套件厂商的捆绑优势最大，独立工具很难对抗默认入口。'],
      ['边界与走向', '办公 AI 会从「辅助写作」走向「自动执行任务」，Agent 会跨应用操作（读邮件、改表格、排会议）；数据主权与合规决定采购，谁能把权限模型做对，谁就能拿到大企业的订单。']
    ],
    industries: [
      { name: '办公套件', desc: '文档、表格与演示的 AI 化，按席位收费。', companies: [
        { name: 'Microsoft', role: '办公龙头', products: 'Microsoft 365 Copilot', tech: 'GPT + Office 集成', scenes: '文档、表格、邮件' },
        { name: 'Google', role: '云端办公', products: 'Workspace、Gemini', tech: 'Gemini 集成', scenes: '文档、会议、邮箱' },
        { name: '金山办公', role: '中国办公', products: 'WPS AI', tech: '中文办公 + 大模型', scenes: '中国政企办公' },
        { name: '飞书（字节）', role: '中国协作', products: '飞书、智能伙伴', tech: '协作 + AI', scenes: '企业协作' },
        { name: '钉钉（阿里）', role: '中国协作', products: '钉钉、AI 助理', tech: '工作流 + AI', scenes: '企业办公' },
        { name: '企业微信（腾讯）', role: '中国协作', products: '企业微信、AI 助手', tech: '微信生态', scenes: '客户运营' }
      ] },
      { name: '文档与知识', desc: '把团队知识变成可检索、可生成的资产。', companies: [
        { name: 'Notion', role: '文档协作', products: 'Notion AI', tech: '文档 + AI', scenes: '团队知识库' },
        { name: 'Atlassian', role: '企业协作', products: 'Confluence、Rovo', tech: '知识检索', scenes: '研发文档' },
        { name: '语雀', role: '中国文档', products: '语雀、AI 助手', tech: '文档知识库', scenes: '团队文档' },
        { name: 'Coda', role: '文档 + 表格', products: 'Coda AI', tech: '文档自动化', scenes: '流程文档' },
        { name: 'Airtable', role: '表格数据库', products: 'Airtable AI', tech: '结构化数据 + AI', scenes: '项目管理' }
      ] },
      { name: '会议与协作', desc: '转录、摘要与任务提取，会议是最成熟的 AI 场景。', companies: [
        { name: 'Zoom', role: '视频会议', products: 'Zoom AI Companion', tech: '转录与摘要', scenes: '远程会议' },
        { name: 'Microsoft', role: 'Teams', products: 'Teams、Copilot', tech: '会议 + 办公', scenes: '企业会议' },
        { name: 'Slack', role: '团队 IM', products: 'Slack AI', tech: '消息摘要与检索', scenes: '团队沟通' },
        { name: '飞书', role: '中国协作', products: '飞书会议、妙记', tech: '会议转录', scenes: '中国企业会议' },
        { name: '腾讯会议', role: '中国会议', products: '腾讯会议 AI', tech: '转录与纪要', scenes: '企业会议' }
      ] },
      { name: '任务与项目管理', desc: '用 AI 拆解任务、排期与跟踪进度。', companies: [
        { name: 'Asana', role: '项目管理', products: 'Asana AI', tech: '任务自动化', scenes: '团队项目' },
        { name: 'Monday', role: '工作管理', products: 'Monday AI', tech: '工作流自动化', scenes: '项目管理' },
        { name: 'Atlassian', role: '研发管理', products: 'Jira、Rovo', tech: '研发流程 + AI', scenes: '软件项目' },
        { name: '飞书项目', role: '中国项目管理', products: '飞书项目', tech: '项目协作', scenes: '中国企业' },
        { name: 'Teambition', role: '中国项目管理', products: 'Teambition', tech: '任务协作', scenes: '团队协作' }
      ] }
    ]
  }

});
