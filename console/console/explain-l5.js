/* L5 商业与生态层：节点六层解释 + 行业与企业版图（手工策展，口径见 explain.js 头注释）。 */
Object.assign(DB.explain, {
  bizmodel: {
    levels: [
      ['一句话', '商业模式与变现回答「AI 公司怎么赚钱」：订阅、API 用量、按结果收费、广告与电商，各有各的账；定价单位选错，规模越大亏得越快。'],
      ['打个比方', '像开餐厅的几种模式——自助餐（订阅）、按盘计价（API）、按成功上菜收费（结果）、靠客流卖广告；模式不同，现金流与毛利完全不同。'],
      ['拆开看', '五段结构：价值主张 → 定价单位（席位 / token / 任务 / 结果）→ 获客渠道 → 毛利结构 → 续费与扩张；定价单位决定收入是随价值增长，还是随成本增长。'],
      ['怎么运转', '订阅提供可预测收入但受席位数限制，API 随用量增长但暴露成本，结果收费对齐客户价值却难计量；算力成本决定毛利天花板，获客成本决定回本周期。'],
      ['格局与博弈', '消费级靠订阅与广告，企业级靠席位与合同，基础设施靠用量；价格战会淘汰没有成本优势的中间层，垂直 agent 靠结果分成突围，平台则靠抽成与捆绑。'],
      ['边界与走向', '按结果收费会从客服、编码等可计量场景扩散，AI 会重写 SaaS 的「按席位」定价体系；最终胜出的是「可计量价值 + 低交付成本」的组合，而不是模型最强的那家。']
    ],
    industries: [
      { name: '消费订阅', desc: '按月订阅消费级 AI 产品，追求规模与留存。', companies: [
        { name: 'OpenAI', role: '订阅标杆', products: 'ChatGPT Plus/Pro', tech: '消费产品 + 模型', scenes: '个人生产力' },
        { name: 'Anthropic', role: '专业订阅', products: 'Claude Pro/Max', tech: '专业用户产品', scenes: '写作与编码' },
        { name: 'Google', role: '捆绑订阅', products: 'Google One AI、Gemini', tech: '生态捆绑', scenes: '搜索与办公' },
        { name: 'Perplexity', role: '搜索订阅', products: 'Perplexity Pro', tech: '答案引擎', scenes: '研究问答' },
        { name: 'Midjourney', role: '创作订阅', products: 'Midjourney 订阅', tech: '图像生成', scenes: '设计与插画' },
        { name: '字节豆包', role: '中国消费', products: '豆包、会员', tech: '多模态助手', scenes: '内容与生活' }
      ] },
      { name: '企业 SaaS', desc: '按席位或合同卖给企业，收入稳定但增长依赖渗透率。', companies: [
        { name: 'Microsoft', role: '办公捆绑', products: '365 Copilot、Azure', tech: '办公 + 云', scenes: '企业全员 AI' },
        { name: 'Salesforce', role: 'CRM 订阅', products: 'Agentforce', tech: 'CRM + Agent', scenes: '销售与客服' },
        { name: 'ServiceNow', role: '工作流订阅', products: 'Now Assist', tech: '工作流 + AI', scenes: 'IT 与 HR' },
        { name: 'SAP', role: 'ERP 订阅', products: 'Joule', tech: '企业流程 + AI', scenes: '财务与供应链' },
        { name: '用友', role: '中国 ERP', products: 'YonGPT、BIP', tech: '企业软件 + 大模型', scenes: '中国政企' },
        { name: '金蝶', role: '中国 ERP', products: '苍穹、AI 助手', tech: '云 ERP', scenes: '中国中小企业' }
      ] },
      { name: '基础设施用量', desc: '按 token、卡时或存储计费，规模效应最强。', companies: [
        { name: 'AWS', role: '云用量', products: 'EC2、Bedrock', tech: '基础设施', scenes: '企业云与 AI' },
        { name: 'Microsoft Azure', role: '云用量', products: 'Azure AI', tech: '云 + 模型', scenes: '企业 AI' },
        { name: 'Google Cloud', role: '云用量', products: 'Vertex AI、TPU', tech: '云 + TPU', scenes: '企业 AI' },
        { name: 'CoreWeave', role: 'GPU 用量', products: 'GPU 云', tech: 'GPU 集群', scenes: 'AI 训练' },
        { name: '阿里云', role: '中国云用量', products: 'ECS、百炼', tech: '云 + 模型', scenes: '中国企业' },
        { name: '火山引擎', role: '中国云用量', products: '方舟、GPU 云', tech: '大规模推理', scenes: '内容与 AI' }
      ] },
      { name: '结果与服务收费', desc: '按解决率、任务或项目成果收费，对齐客户价值。', companies: [
        { name: 'Sierra', role: '按结果收费', products: '客服 Agent', tech: '任务型对话', scenes: '品牌客服' },
        { name: 'Decagon', role: '按结果收费', products: '客服 Agent', tech: '企业知识 + Agent', scenes: '高增长公司' },
        { name: 'Palantir', role: '项目与订阅', products: 'Foundry、AIP', tech: '数据 + AI', scenes: '政府与企业' },
        { name: 'Accenture', role: '咨询与交付', products: 'AI 转型服务', tech: '咨询 + 实施', scenes: '大型企业转型' },
        { name: 'Deloitte', role: '咨询与交付', products: 'AI 咨询', tech: '咨询 + 实施', scenes: '企业 AI 落地' }
      ] }
    ]
  },

  funding: {
    levels: [
      ['一句话', '融资与估值是 AI 行业的「燃料表」：谁拿到钱、估值多少，决定谁能继续烧算力；一级市场的价格又反过来影响人才与算力的流向。'],
      ['打个比方', '像赛车进站加油——油量（融资）决定你能跑多远，但赛道（商业化）最终决定输赢；油加得再多，方向错了也没用。'],
      ['拆开看', '四段结构：轮次（种子 → 成长 → Pre-IPO）→ 估值方法（收入倍数 / 算力叙事）→ 条款（优先清算 / 对赌 / 算力承诺）→ 退出（IPO / 并购）；估值锚决定融资节奏。'],
      ['怎么运转', 'VC 赌赛道与团队，主权基金与科技巨头做战略投资，二级市场用收入与毛利重新定价；算力承诺常与融资绑定，形成「投资—买卡—估值」的循环交易。'],
      ['格局与博弈', 'OpenAI、Anthropic、xAI 拿到巨额融资，估值与算力承诺绑定；中国 lab 融资收紧，转向产业资本与国资；中东主权资本成为新变量，也开始自建算力与模型。'],
      ['边界与走向', '估值会从「模型叙事」转向「收入与毛利」，IPO 窗口与并购退出会重塑一级市场；「算力换股权」的循环可能放大周期波动，一旦融资收紧，重资产与高承诺最先受伤。']
    ],
    industries: [
      { name: '头部 VC', desc: '早期与成长轮的主要出资方，赌赛道与团队。', companies: [
        { name: 'Sequoia', role: '头部 VC', products: '早期与成长投资', tech: '投资方法论', scenes: 'AI 全栈' },
        { name: 'a16z', role: 'AI 全栈', products: '多阶段基金', tech: '研究驱动', scenes: '基础设施与应用' },
        { name: 'Thrive Capital', role: '成长轮', products: 'OpenAI 关键股东', tech: '集中下注', scenes: '头部 lab' },
        { name: 'Accel', role: '早期', products: 'Cursor 早期投资方', tech: '应用层投资', scenes: 'AI 应用' },
        { name: 'Lightspeed', role: '多阶段', products: '应用与基础设施', tech: '全球化', scenes: 'AI 创业' },
        { name: 'Founders Fund', role: '硬科技', products: '深科技投资', tech: '长期主义', scenes: '算力与航天' }
      ] },
      { name: '主权与战略资本', desc: '用资本换算力、技术与地缘位置。', companies: [
        { name: 'SoftBank', role: '超级轮', products: 'Vision Fund', tech: '大规模资本', scenes: 'AI 基础设施' },
        { name: 'MGX（阿布扎比）', role: '中东主权', products: 'AI 投资平台', tech: '主权资本', scenes: '算力与模型' },
        { name: 'Temasek', role: '新加坡主权', products: '多资产投资', tech: '长期资本', scenes: '亚洲 AI' },
        { name: 'GIC', role: '新加坡主权', products: '全球投资', tech: '长期资本', scenes: '科技与基础设施' },
        { name: '沙特 PIF', role: '沙特主权', products: 'AI 与算力投资', tech: '主权资本', scenes: '中东算力' },
        { name: 'Microsoft', role: '战略投资', products: 'OpenAI 投资与云合同', tech: '云 + 资本', scenes: '模型与分发' },
        { name: 'NVIDIA', role: '战略投资', products: '生态投资', tech: '芯片 + 资本', scenes: 'AI 生态' }
      ] },
      { name: '中国资本', desc: '产业资本与国资主导，估值更看重落地。', companies: [
        { name: '高瓴', role: '头部 PE/VC', products: '成长与并购', tech: '产业研究', scenes: 'AI 应用与医疗' },
        { name: '红杉中国', role: '头部 VC', products: '早期与成长', tech: '赛道覆盖', scenes: 'AI 全栈' },
        { name: '深创投', role: '国资 VC', products: '早期投资', tech: '政策导向', scenes: '硬科技' },
        { name: '中金资本', role: '券商系 PE', products: '成长与并购', tech: '资本运作', scenes: 'AI 与半导体' },
        { name: '上海国投', role: '地方国资', products: '产业基金', tech: '引导基金', scenes: '上海 AI 产业' },
        { name: '阿里/腾讯战投', role: '产业资本', products: '战略投资', tech: '生态协同', scenes: 'AI 应用' }
      ] },
      { name: '投行与二级市场', desc: 'IPO、并购与二级定价，决定退出通道。', companies: [
        { name: 'Goldman Sachs', role: '投行', products: 'IPO、并购顾问', tech: '资本市场', scenes: '科技 IPO' },
        { name: 'Morgan Stanley', role: '投行', products: 'IPO、并购', tech: '资本市场', scenes: '科技融资' },
        { name: 'JPMorgan', role: '投行', products: '融资与并购', tech: '资本市场', scenes: '大型交易' },
        { name: '中金公司', role: '中国投行', products: 'IPO、并购', tech: '资本市场', scenes: '中国科技' },
        { name: '华兴资本', role: '中国 FA', products: '融资顾问', tech: '一级市场', scenes: '科技融资' }
      ] }
    ]
  },

  mna: {
    levels: [
      ['一句话', '并购与整合是 AI 巨头补齐能力、消灭对手、抢入口的手段：买模型、买数据、买分发；在模型能力趋同的阶段，买「分发与人才」的性价比高于买「技术」。'],
      ['打个比方', '像下棋时的「吃子」——不一定最强，但能快速占住关键位置；吃错了子，还会拖慢整盘，整合失败比买贵更常见。'],
      ['拆开看', '四段结构：战略动机（人才 / 技术 / 数据 / 入口）→ 尽调与估值 → 监管审查 → 整合（团队、产品、文化）；整合失败率远高于交易失败率。'],
      ['怎么运转', '支付方式有现金 + 股票、反向收购（acqui-hire）、少数股权投资转控股；反垄断审查越来越严，交易结构因此变形，授权与合作成为「准并购」。'],
      ['格局与博弈', '微软与 OpenAI 的深度绑定、亚马逊与 Anthropic、谷歌与 Character.AI、英伟达与 Hugging Face 等交易重塑格局；中国以产业整合与国资主导为主，跨境交易受审查约束。'],
      ['边界与走向', '监管会收紧巨头并购，acqui-hire 与授权合作会成为规避审查的替代路径；「买人 + 授权」可能比「买公司」更常见，估值也会从「技术溢价」转向「团队与分发溢价」。']
    ],
    industries: [
      { name: '科技巨头', desc: '用并购补齐模型、数据与入口，形成全栈闭环。', companies: [
        { name: 'Microsoft', role: '深度绑定', products: 'OpenAI 合作、GitHub、Nuance', tech: '云 + 模型 + 办公', scenes: '企业 AI 全栈' },
        { name: 'Google', role: '研究 + 入口', products: 'DeepMind、Character.AI 授权', tech: '模型 + 分发', scenes: '搜索与云' },
        { name: 'Amazon', role: '云 + 模型', products: 'Anthropic 投资、Alexa', tech: '云 + 模型', scenes: '企业云与消费' },
        { name: 'Meta', role: '开源 + 人才', products: 'Llama、acqui-hire', tech: '开源 + 社交', scenes: '社交与生态' },
        { name: 'Apple', role: '端侧 + 入口', products: 'Apple Intelligence、收购', tech: '端侧 AI', scenes: '设备生态' },
        { name: 'NVIDIA', role: '生态整合', products: 'Hugging Face、Mellanox', tech: '芯片 + 软件', scenes: 'AI 基础设施' }
      ] },
      { name: '战略买家', desc: '为补齐产品线或进入新市场而收购。', companies: [
        { name: 'Salesforce', role: '应用整合', products: 'Informatica 等收购', tech: 'CRM + 数据', scenes: '企业应用' },
        { name: 'ServiceNow', role: '工作流整合', products: 'Moveworks 等', tech: '工作流 + AI', scenes: '企业服务' },
        { name: 'Palantir', role: '数据与政府', products: '战略收购', tech: '数据 + AI', scenes: '政府与企业' },
        { name: 'Broadcom', role: '半导体整合', products: 'VMware、定制 ASIC', tech: '芯片 + 基础设施', scenes: '云与企业软件' },
        { name: 'AMD', role: '算力整合', products: 'ZT Systems、Silo AI', tech: '芯片 + 系统', scenes: 'AI 数据中心' },
        { name: 'SpaceX', role: '跨界整合', products: 'Cursor、xAI 关联', tech: '算力 + 分发', scenes: '轨道算力与 AI' }
      ] },
      { name: '财务买家', desc: 'PE 通过并购整合软件与科技资产。', companies: [
        { name: 'Vista Equity', role: '软件 PE', products: '企业软件并购', tech: '运营优化', scenes: '软件整合' },
        { name: 'Thoma Bravo', role: '软件 PE', products: '科技并购', tech: '运营优化', scenes: '企业软件' },
        { name: 'Silver Lake', role: '科技 PE', products: '大型科技交易', tech: '资本运作', scenes: '科技并购' },
        { name: 'KKR', role: '多元 PE', products: '基础设施与科技', tech: '资本运作', scenes: '数据中心' },
        { name: '中信资本', role: '中国 PE', products: '产业整合', tech: '资本运作', scenes: '中国科技' }
      ] },
      { name: '投行与顾问', desc: '撮合交易、估值与监管沟通。', companies: [
        { name: 'Goldman Sachs', role: '并购顾问', products: 'M&A 顾问', tech: '资本市场', scenes: '大型交易' },
        { name: 'Morgan Stanley', role: '并购顾问', products: 'M&A 顾问', tech: '资本市场', scenes: '科技并购' },
        { name: 'Qatalyst', role: '科技并购', products: '科技 M&A', tech: '专注科技', scenes: '硅谷交易' },
        { name: '华兴资本', role: '中国 FA', products: '融资与并购', tech: '一级市场', scenes: '中国科技' },
        { name: '中金公司', role: '中国投行', products: '并购顾问', tech: '资本市场', scenes: '中国企业' }
      ] }
    ]
  },

  talent: {
    levels: [
      ['一句话', '人才流动是 AI 竞争的暗线：顶级研究员和工程团队的去向，决定下一波能力突破在哪；在算力可以买、数据可以授权之后，人是最难复制的变量。'],
      ['打个比方', '像足球队的转会市场——一个明星球员能改变整支球队的战绩；但球队体系不行，明星也会被浪费，协作与算力配给同样关键。'],
      ['拆开看', '四段结构：人才来源（高校 / 大厂 / lab）→ 薪酬包（现金 + 股权 + 算力配额）→ 团队组建与文化 → 流失与创业；算力配额本身就是一种薪酬。'],
      ['怎么运转', '巨头用天价薪酬包与算力资源抢人，startup 用股权与使命吸引，高校成为人才蓄水池；培养周期长、替代成本高，acqui-hire 成为绕过竞业的主流手段。'],
      ['格局与博弈', 'OpenAI、Anthropic、Google、Meta、xAI 互相挖角，中国 lab 靠本土培养与回流，欧洲人才流向美国；安全团队与预训练团队的流动尤其敏感，往往带走隐性知识。'],
      ['边界与走向', '人才成本会继续上升，但「团队 + 算力 + 数据」的组合比单个人才更重要；AI 也会替代部分初级岗位，人才需求向「会指挥 agent、能定义问题」的人迁移。']
    ],
    industries: [
      { name: '前沿 lab', desc: '顶级研究员的聚集地，也是挖角战的主战场。', companies: [
        { name: 'OpenAI', role: '人才磁铁', products: 'GPT 研究团队', tech: '预训练与推理', scenes: '前沿研究' },
        { name: 'Anthropic', role: '安全与 Agent', products: 'Claude 团队', tech: '对齐与 Agent', scenes: '安全研究' },
        { name: 'Google DeepMind', role: '研究重镇', products: 'Gemini、AlphaFold', tech: '多模态与科学', scenes: '基础研究' },
        { name: 'Meta', role: '开源与 FAIR', products: 'Llama、FAIR', tech: '开源研究', scenes: '开源生态' },
        { name: 'xAI', role: '快速扩张', products: 'Grok 团队', tech: '大规模训练', scenes: '实时数据' },
        { name: 'Microsoft', role: '企业研究', products: 'MAI、MSRA', tech: '企业 AI', scenes: '云与办公' }
      ] },
      { name: '中国 lab', desc: '本土培养与海外回流并重，工程能力突出。', companies: [
        { name: 'DeepSeek', role: '研究驱动', products: 'DeepSeek 团队', tech: '高效训练', scenes: '开源模型' },
        { name: '阿里通义', role: '大厂研究', products: 'Qwen 团队', tech: '多尺寸模型', scenes: '云与开源' },
        { name: '字节 Seed', role: '多模态', products: 'Seed 团队', tech: '多模态与视频', scenes: '内容应用' },
        { name: '智谱', role: '学术创业', products: 'GLM 团队', tech: '中英双语', scenes: '政企与开源' },
        { name: '月之暗面', role: '长上下文', products: 'Kimi 团队', tech: '长上下文', scenes: '消费产品' }
      ] },
      { name: '高校与研究院', desc: '人才蓄水池与基础研究源点。', companies: [
        { name: 'Stanford', role: '学术重镇', products: 'HAI、CS', tech: 'AI 研究与政策', scenes: '人才培养' },
        { name: 'MIT', role: '工程与 AI', products: 'CSAIL', tech: '机器人、NLP', scenes: '研究与创业' },
        { name: 'UC Berkeley', role: '系统与开源', products: 'BAIR、LMSYS', tech: 'vLLM、Arena', scenes: '开源系统' },
        { name: '清华大学', role: '中国学术', products: 'AIR、计算机系', tech: '基础模型', scenes: '中国 AI 人才' },
        { name: '北京大学', role: '中国学术', products: 'AI 研究院', tech: '语言与计算', scenes: '基础研究' },
        { name: '上海 AI Lab', role: '国家级实验室', products: 'InternLM', tech: '开源模型', scenes: '公共研究' }
      ] },
      { name: '猎头与 HR tech', desc: '为 AI 人才定价、匹配与组织管理。', companies: [
        { name: 'Heidrick & Struggles', role: '高管猎头', products: '高管搜寻', tech: '人才地图', scenes: 'AI 高管招聘' },
        { name: 'Egon Zehnder', role: '高管猎头', products: '领导力咨询', tech: '人才评估', scenes: '科技高管' },
        { name: 'LinkedIn', role: '职业网络', products: '招聘、人才洞察', tech: '人才数据', scenes: '技术招聘' },
        { name: '脉脉', role: '中国职场', products: '招聘、社区', tech: '职场数据', scenes: '中国科技招聘' },
        { name: 'BOSS 直聘', role: '中国招聘', products: '直聊招聘', tech: '匹配算法', scenes: '中小企业招聘' }
      ] }
    ]
  },

  delivery: {
    levels: [
      ['一句话', '交付与实施（FDE）是把模型能力装进客户真实业务的最后一公里：卖的不是模型，是「能跑起来的结果」；模型越通用，交付越值钱。'],
      ['打个比方', '像装修队：材料（模型）在市场上谁都能买，但把水电、动线、柜子按你的户型装好，才是别人替代不了的价值。'],
      ['拆开看', '六段链路：需求诊断 → 数据接入与清洗 → 流程改造 → 系统集成 → 上线与培训 → 持续迭代与运维，每一段都消耗人天，也每一段都可能成为亏损点。'],
      ['怎么运转', '前向部署工程师（Forward Deployed Engineer）常驻客户现场，把通用模型接到客户的 ERP、CRM、专有数据上；交付周期从数月缩到数周才是竞争力，复用模板才能提毛利。'],
      ['格局与博弈', '咨询公司有客户关系但缺模型能力，模型厂有模型但缺行业纵深，系统集成商两头都不占优；于是出现「模型厂 + 咨询」的联盟，以及 Palantir 式的高价驻场模式。'],
      ['边界与走向', '标准化 Agent 平台会吃掉一部分实施工作，但越是非结构化、越涉及组织变革的场景，人的交付价值越高；FDE 会从项目制走向「订阅式驻场」，交付经验会沉淀成产品与模板。']
    ],
    industries: [
      { name: '咨询与系统集成', desc: '手握大客户与流程知识，是传统交付主力。', companies: [
        { name: 'Accenture', role: '全球交付龙头', products: 'AI 转型服务、Song', tech: '行业流程 + 合作伙伴模型', scenes: '大型企业 AI 转型' },
        { name: 'Deloitte', role: '咨询 + 实施', products: 'AI & Engineering', tech: '行业方法论', scenes: '审计、风控、运营' },
        { name: 'PwC', role: '咨询 + 审计', products: 'AI 服务线', tech: '合规与流程', scenes: '金融与政企' },
        { name: 'IBM Consulting', role: '咨询 + 自研', products: 'watsonx 实施', tech: '混合云 + 治理', scenes: '受监管行业' },
        { name: 'Infosys', role: '离岸交付', products: 'Topaz', tech: '大规模工程交付', scenes: '成本敏感型企业' },
        { name: 'TCS', role: '印度 IT 服务', products: 'AI.Cloud', tech: '外包 + 平台', scenes: '全球企业 IT' }
      ] },
      { name: 'AI 原生交付', desc: '把「驻场工程师 + 模型」当成产品卖的新玩家。', companies: [
        { name: 'Palantir', role: '驻场标杆', products: 'Foundry、AIP、Bootcamp', tech: '本体建模 + 部署工程师', scenes: '政府、国防、制造' },
        { name: 'OpenAI', role: '前沿实验室交付', products: '企业版、Forward Deployed', tech: '模型 + 解决方案团队', scenes: '大客户定制' },
        { name: 'Anthropic', role: '前沿实验室交付', products: 'Claude 企业部署', tech: '安全对齐 + Agent', scenes: '金融与代码' },
        { name: 'Scale AI', role: '数据 + 交付', products: '数据引擎、评估', tech: '数据供应链', scenes: '模型落地前的数据准备' },
        { name: 'Sierra', role: '结果型交付', products: '客服 Agent 落地', tech: '任务型 Agent', scenes: '品牌客服' }
      ] },
      { name: '中国 IT 服务', desc: '本土政企交付网络，熟悉招投标与信创要求。', companies: [
        { name: '软通动力', role: '大厂生态交付', products: '鸿蒙与 AI 服务', tech: '工程外包 + 生态', scenes: '央国企数字化' },
        { name: '中软国际', role: '系统集成', products: 'AI 解决方案', tech: '行业集成', scenes: '政府与金融' },
        { name: '神州数码', role: '分销 + 集成', products: '数云服务', tech: '云与信创', scenes: '政企采购' },
        { name: '浪潮', role: '软硬一体', products: '服务器、行业云', tech: '算力 + 行业软件', scenes: '政府与电信' },
        { name: '东软集团', role: '行业软件', products: '医疗、社保、汽车软件', tech: '行业 IT', scenes: '医疗与政务' }
      ] },
      { name: '行业解决方案商', desc: '在垂直行业里把 AI 嵌进既有工作流。', companies: [
        { name: '恒生电子', role: '金融 IT', products: '资管、交易系统 + AI', tech: '金融数据与流程', scenes: '券商与基金' },
        { name: '卫宁健康', role: '医疗 IT', products: '医院信息系统 + AI', tech: '临床数据', scenes: '医院信息化' },
        { name: '用友', role: '企业软件', products: 'BIP、YonGPT', tech: 'ERP + 大模型', scenes: '财务与供应链' },
        { name: '金蝶', role: '企业软件', products: '苍穹、AI 助手', tech: '云 ERP', scenes: '中小企业' },
        { name: '广联达', role: '建筑 IT', products: 'BIM + AI', tech: '工程数据', scenes: '建筑与基建' }
      ] }
    ]
  },

  regulation: {
    levels: [
      ['一句话', '监管与地缘决定 AI 能做什么、不能做什么、以及谁能拿到算力——它是产业的外部边界条件，也是竞争格局的隐形塑造者。'],
      ['打个比方', '像交通规则：不决定车怎么造，但决定限速、牌照、哪条路能走，违者罚款甚至禁行；规则变了，路线也要重画。'],
      ['拆开看', '三条主线：内容与安全监管（生成内容合规）、竞争与版权（数据与训练合法性）、出口管制（芯片与模型权重）；每条线的执法节奏不同，企业要分别建能力，三线的罚则差异决定合规投入的分配。'],
      ['怎么运转', '欧盟以《AI 法案》按风险分级设义务，中国以《生成式人工智能服务管理暂行办法》做备案与内容安全，美国以出口管制与州级立法并行；企业用合规团队与评测报告换取市场准入，头部企业还会把「合规」反向做成卖点。'],
      ['格局与博弈', '监管是竞争武器：合规成本高的市场挡住小玩家，出口管制重塑算力供给；被管制方转向国产替代与开源绕行，合规工具与审计服务因此受益。'],
      ['边界与走向', '监管会从「模型层」下沉到「应用层」与「Agent 行为」；跨国企业将面对多套规则并存，合规工程本身成为一门生意，「合规即代码」会普及，标准互认则是最大的变量。']
    ],
    industries: [
      { name: '监管机构', desc: '制定规则、发牌与执法的公共部门。', companies: [
        { name: 'EU AI Office', role: '欧盟执法', products: 'AI Act 执行', tech: '风险分级', scenes: '欧盟市场准入' },
        { name: 'NIST', role: '美国标准', products: 'AI RMF、评测框架', tech: '风险管理框架', scenes: '美国企业与政府' },
        { name: 'UK AISI', role: '前沿评测', products: '模型评测', tech: '红队与基准', scenes: '前沿模型安全' },
        { name: '中国网信办', role: '中国监管', products: '生成式 AI 备案', tech: '内容安全', scenes: '境内大模型上线' },
        { name: 'TC260', role: '中国标准', products: 'AI 安全标准', tech: '标准制定', scenes: '国内合规基线' },
        { name: '中国信通院', role: '产业研究', products: '评估与白皮书', tech: '测试评估', scenes: '政企选型' }
      ] },
      { name: '合规科技', desc: '把监管要求变成可执行的软件与流程。', companies: [
        { name: 'Credo AI', role: 'AI 治理平台', products: '治理与合规平台', tech: '模型清单与审计', scenes: '企业 AI 合规' },
        { name: 'Holistic AI', role: '风险评估', products: 'AI 审计', tech: '偏见与风险测评', scenes: '金融与人力' },
        { name: 'IBM', role: '治理套件', products: 'watsonx.governance', tech: '模型治理', scenes: '受监管行业' },
        { name: 'OneTrust', role: '隐私与治理', products: '隐私管理平台', tech: '数据合规', scenes: '全球企业' },
        { name: '安恒信息', role: '中国安全', products: 'AI 安全产品', tech: '内容与数据安全', scenes: '政企合规' }
      ] },
      { name: '律所与政策咨询', desc: '解释规则、处理诉讼与游说。', companies: [
        { name: 'Covington', role: '科技监管律所', products: 'AI 政策与诉讼', tech: '法律与政策', scenes: '跨国合规' },
        { name: 'Hogan Lovells', role: 'AI 法律实践', products: 'AI 合规服务', tech: '跨境监管', scenes: '欧盟与英国' },
        { name: '中伦律师事务所', role: '中国法律', products: '数据与 AI 合规', tech: '境内监管', scenes: '中国企业' },
        { name: '金杜律师事务所', role: '中国法律', products: '科技与数据合规', tech: '监管应对', scenes: '跨境业务' },
        { name: 'Deloitte', role: '政策咨询', products: '监管咨询', tech: '合规方法论', scenes: '企业治理' }
      ] },
      { name: '标准与评测', desc: '用测试与标准把「安全」变成可比较的指标。', companies: [
        { name: 'ISO/IEC', role: '国际标准', products: 'AI 管理体系标准', tech: '标准制定', scenes: '全球互认' },
        { name: 'IEEE', role: '工程标准', products: '伦理与系统标准', tech: '技术标准', scenes: '产业协作' },
        { name: 'MLCommons', role: '基准联盟', products: 'MLPerf', tech: '性能与安全基准', scenes: '硬件与模型评测' },
        { name: '上海 AI Lab', role: '中国评测', products: '模型评测体系', tech: '评测与开源', scenes: '国内模型选型' },
        { name: '中国信通院', role: '中国评估', products: '可信 AI 评估', tech: '测试认证', scenes: '政企采购' }
      ] },
      { name: 'AI 保险与责任', desc: '把模型风险变成可承保的风险，责任认定的市场化解法。', companies: [
        { name: 'Munich Re', role: 'AI 再保险先行', products: 'aiSure 模型性能保险', tech: '模型风险精算', scenes: '模型厂商与买家' },
        { name: 'Swiss Re', role: '再保险', products: 'AI 责任险扩展条款', tech: '责任风险建模', scenes: '企业 AI 部署' },
        { name: 'Marsh', role: '保险经纪', products: 'AI 责任险经纪方案', tech: '条款设计与风险映射', scenes: '大型企业投保' },
        { name: 'Chubb', role: '直保', products: '网络险附加 AI 条款', tech: '承保与创新条款', scenes: '企业网络与 AI' }
      ] }
    ]
  },

  sovereign: {
    levels: [
      ['一句话', '主权 AI 是国家层面的算力与模型计划：沙特用石油资本换 AI 席位，欧盟用监管换生态，中国用「东数西算」全栈自主——算力正式成为国家基础设施。'],
      ['打个比方', '像上个世纪修铁路与电网：谁先铺好，谁的产业就长在上面；只不过这次的「钢轨」是 GPU 集群，「机车」是国家级大模型。'],
      ['拆开看', '三层结构：国家算力底座（智算中心、主权云）→ 模型与平台（自研或引进微调）→ 人才与治理（教育、监管、数据法规）；资金来自主权基金与财政。'],
      ['怎么运转', '交易模式是「资本换技术」：中东出钱出能源，美国出芯片与模型，本地建厂运营；欧盟以合规市场庇护本土厂商；中国全栈自给。'],
      ['格局与博弈', '沙特 HUMAIN 与阿联酋 G42 是最大买家，英伟达是最大卖家，Mistral 撑起欧盟旗帜，中国以昇腾 + 运营商云形成闭环；Stargate 类项目重塑供给格局。'],
      ['边界与走向', '主权 AI 会从「买算力」走向「定标准」：数据本地化、模型审计与出口管制互相缠绕；重复建设与利用率不足是最大浪费，人才是共同瓶颈。']
    ],
    industries: [
      { name: '中东主权算力', desc: '用石油资本直接购买 AI 时代的席位。', companies: [
        { name: 'G42（阿联酋）', role: '阿联酋集团', products: '主权云、Justice LLM', tech: '数据中心 + 模型合作', scenes: '海湾国家 AI 基建' },
        { name: 'HUMAIN（沙特）', role: '沙特主权', products: '国家级算力与模型', tech: 'NVIDIA + AWS 合作', scenes: '2030 愿景项目' },
        { name: 'NVIDIA', role: '最大供给方', products: '主权 AI 方案', tech: 'GPU + 全栈参考架构', scenes: '各国主权项目' },
        { name: 'Nebius', role: '区域扩张', products: '欧洲与中东 GPU 云', tech: '自建数据中心', scenes: '主权云承接' }
      ] },
      { name: '欧盟数字主权', desc: '以监管和市场换本土生态。', companies: [
        { name: 'Mistral AI', role: '欧盟旗舰', products: 'Mistral 系列、Le Chat', tech: '开源 + 商业双轨', scenes: '欧洲政企' },
        { name: 'Aleph Alpha', role: '德系主权', products: 'Pharia AI', tech: '可解释合规强调', scenes: '德国政企' },
        { name: 'OVHcloud', role: '欧洲云', products: '主权云服务', tech: '数据本地化', scenes: '欧洲企业' },
        { name: 'Scaleway', role: '法国云', products: 'GPU 云与生成服务', tech: '低碳数据中心', scenes: '欧盟市场' }
      ] },
      { name: '中国国家算力', desc: '东数西算 + 全栈国产的最重投入。', companies: [
        { name: '天翼云', role: '运营商云之首', products: '息壤智算平台', tech: '国产算力调度', scenes: '政务与国资' },
        { name: '中国移动', role: '智算重投入', products: '九天大模型、智算中心', tech: '算力网络', scenes: '全国智算布局' },
        { name: '华为', role: '昇腾生态', products: 'Atlas 集群、ModelArts', tech: '全栈自主', scenes: '国产替代主力' },
        { name: '中科曙光', role: '超算与液冷', products: '智算中心方案', tech: '液冷 + 存储', scenes: '国家超算与智算' }
      ] },
      { name: '国家模型与研究院', desc: '各国「国家级模型」的供给方。', companies: [
        { name: 'TII Falcon（阿联酋）', role: '阿联酋国家模型', products: 'Falcon 开源系列', tech: '开放权重', scenes: '国家模型名片' },
        { name: 'Sarvam AI', role: '印度主权', products: 'Sarvam 多语模型', tech: '本土语言优化', scenes: '印度市场' },
        { name: 'ELYZA', role: '日本代表', products: 'ELYZA 日语模型', tech: '日语优化', scenes: '日本政企' },
        { name: 'AISG SEA-LION', role: '新加坡计划', products: 'SEA-LION 东南亚模型', tech: '多语言开源', scenes: '东盟市场' }
      ] }
    ]
  },

  opensource: {
    levels: [
      ['一句话', '开源治理与许可解决「模型和代码能不能用、怎么用、用了要还什么」的问题，是生态的产权基础设施：它决定 AI 能力像自来水一样自由流动，还是被许可证切成一块块围栏。'],
      ['打个比方', '像小区的公共绿地：谁都能进，但能不能盖房子、能不能围起来收费，取决于物业规约（许可证）；规约改了，住户的玩法和房产价值也跟着变。'],
      ['拆开看', '四层要分清：许可证（Apache 2.0 / MIT / GPL / Llama 社区许可 / OpenRAIL）→ 开放程度（全开源、仅开放权重、仅开放 API）→ 治理主体（基金会中立托管 vs 单一厂商说了算）→ 商业化边界（托管、插件、企业版、支持合同）。'],
      ['怎么运转', '厂商开源换生态、换人才、换事实标准，云厂靠托管与集成变现，基金会提供中立治理与商标；许可证条款决定谁能把开源改造成闭源产品再卖，也决定企业敢不敢把它放进生产环境。'],
      ['格局与博弈', '「开放权重」不等于「开源」：训练数据、代码与评测不公开时，社区无法复现也无法审计；Meta 用 Llama 抢生态，DeepSeek 用 MIT 许可换全球采用，欧洲与中国把开源当技术主权工具，美国厂商则在开放与护城河之间反复摇摆。'],
      ['边界与走向', '许可证会继续分化出「反云厂」条款，限制 hyperscaler 直接托管变现；监管可能要求开源模型承担与闭源相同的安全义务，抬高发布成本；基金会治理与商业赞助的平衡决定项目寿命——默认采用比代码质量更能决定胜负。']
    ],
    industries: [
      { name: '开源模型发布方', desc: '用开放权重换取生态、人才与标准话语权。', companies: [
        { name: 'Meta', role: '开放权重旗舰', products: 'Llama 系列', tech: '稠密与 MoE 训练', scenes: '开发者生态' },
        { name: '阿里通义', role: '中国开源主力', products: 'Qwen 全尺寸', tech: '多语言与多模态', scenes: '企业私有化' },
        { name: 'DeepSeek', role: '高效开源', products: 'DeepSeek 系列', tech: 'MoE 与蒸馏', scenes: '低成本推理' },
        { name: '智谱', role: '中国开源', products: 'GLM 系列', tech: '中英双语', scenes: '政企与开发者' },
        { name: 'Mistral', role: '欧洲开源', products: 'Mistral、Mixtral', tech: '高效稠密模型', scenes: '欧洲主权 AI' },
        { name: 'AI2', role: '完全开放', products: 'OLMo', tech: '数据与代码全开', scenes: '可复现研究' }
      ] },
      { name: '基金会与社区', desc: '提供中立治理、法务与协作基础设施。', companies: [
        { name: 'Apache 基金会', role: '中立治理', products: 'Apache 2.0 许可', tech: '社区流程', scenes: '企业级开源' },
        { name: 'Linux 基金会', role: '大型基金会', products: '托管项目', tech: '跨厂商协作', scenes: '基础设施开源' },
        { name: 'OSI', role: '许可认证', products: '开源定义', tech: '许可评审', scenes: '许可证合法性' },
        { name: 'Hugging Face', role: '模型社区', products: 'Hub、Spaces', tech: '模型托管', scenes: '模型分发' },
        { name: '开放原子基金会', role: '中国基金会', products: '托管国产项目', tech: '社区治理', scenes: '中国开源生态' }
      ] },
      { name: '开源商业化', desc: '把开源项目变成可持续生意，同时不激怒社区。', companies: [
        { name: 'Red Hat', role: '订阅支持', products: 'RHEL、OpenShift', tech: '企业级支持', scenes: '企业基础设施' },
        { name: 'Databricks', role: '托管 + 自研', products: 'Lakehouse、DBRX', tech: '数据平台', scenes: '企业数据 AI' },
        { name: 'Confluent', role: '托管 Kafka', products: 'Confluent Cloud', tech: '流数据', scenes: '实时数据管道' },
        { name: 'Elastic', role: '开源 + 云', products: 'Elasticsearch', tech: '搜索与向量检索', scenes: '企业搜索' },
        { name: 'Together AI', role: '开源模型托管', products: '推理平台', tech: 'GPU 推理优化', scenes: '开源模型服务化' }
      ] },
      { name: '合规与安全', desc: '扫描许可证风险与供应链漏洞。', companies: [
        { name: 'Black Duck', role: '开源审计', products: 'SCA 工具', tech: '许可证扫描', scenes: '企业并购尽调' },
        { name: 'FOSSA', role: '许可合规', products: '依赖分析', tech: '合规自动化', scenes: '软件供应链' },
        { name: 'Snyk', role: '安全扫描', products: '漏洞与许可扫描', tech: '代码分析', scenes: '开发者安全' },
        { name: 'OpenSSF', role: '供应链安全', products: '安全基线', tech: '开源安全标准', scenes: '关键开源项目' },
        { name: '悬镜安全', role: '中国供应链安全', products: 'SCA、代码审计', tech: '开源风险检测', scenes: '国内企业合规' }
      ] }
    ]
  },

  economics: {
    levels: [
      ['一句话', '成本与单位经济回答「每处理一个 token、每服务一个用户，赚不赚钱」，是 AI 商业化的体检表：收入可以靠补贴买来，单位经济为正才是真生意。'],
      ['打个比方', '像开出租：车价（训练与折旧）、油费（推理）、平台抽成（云与渠道）决定你每单是赚是赔；空驶率（GPU 利用率）才是隐藏杀手。'],
      ['拆开看', '成本分四块：训练（一次性、可资本化）、推理（随用量线性增长）、获客（CAC，常被低估）、基础设施折旧（GPU 三到五年）；再叠加利用率、缓存命中率与模型尺寸，才得出每个 token 的真实成本。'],
      ['怎么运转', '推理成本随蒸馏、量化、KV 缓存与专用芯片逐级下降；利用率决定云厂毛利，闲置的卡照样计提折旧；订阅制用低活跃用户补贴高活跃用户，API 用量模式则把成本波动直接转给客户。'],
      ['格局与博弈', '价格战把 API 单价压到成本线附近，逼厂商向上（Agent 与应用）或向下（芯片与云）延伸；资本开支竞赛让折旧成为隐形炸弹——一旦需求增速放缓，重资产就成包袱。'],
      ['边界与走向', '单位成本会继续下降一个数量级，但需求增长更快；「每 token 毛利」将让位于「每任务价值」，成本透明化与按结果计费会重塑定价，最终只有把算力、模型与分发三段成本都压住的公司能长期为正。']
    ],
    industries: [
      { name: '模型供给', desc: '按 token 售卖智能，规模效应与价格战并存。', companies: [
        { name: 'OpenAI', role: '定价锚点', products: 'GPT API、订阅', tech: '大规模推理', scenes: '通用 API' },
        { name: 'Anthropic', role: '高价值场景', products: 'Claude API', tech: '长上下文与 Agent', scenes: '编码与企业' },
        { name: 'Google', role: '全栈成本优势', products: 'Gemini API', tech: 'TPU 自供', scenes: '云与消费' },
        { name: 'DeepSeek', role: '低价冲击', products: 'DeepSeek API', tech: 'MoE 与缓存', scenes: '成本敏感应用' },
        { name: '阿里云', role: '中国云模型', products: '百炼、Qwen API', tech: '云 + 模型', scenes: '中国企业' }
      ] },
      { name: '算力与云', desc: '卖卡时与云资源，是成本结构的上游。', companies: [
        { name: 'NVIDIA', role: '算力定价者', products: 'GPU、网络、CUDA', tech: '加速计算', scenes: '训练与推理' },
        { name: '台积电', role: '制造成本', products: '先进制程代工', tech: '制程与封装', scenes: '芯片制造' },
        { name: 'AWS', role: '云资源', products: 'EC2、Trainium', tech: '云基础设施', scenes: '企业算力' },
        { name: 'CoreWeave', role: 'GPU 租赁', products: 'GPU 云', tech: '集群调度', scenes: 'AI 训练' },
        { name: '阿里云', role: '中国云', products: 'ECS、PAI', tech: '云与算力', scenes: '中国企业' }
      ] },
      { name: '应用与订阅', desc: '把模型成本包装成用户可接受的价格。', companies: [
        { name: 'Microsoft', role: '办公订阅', products: '365 Copilot', tech: '办公集成', scenes: '知识工作者' },
        { name: 'Salesforce', role: 'CRM 订阅', products: 'Agentforce 定价', tech: '按对话计费', scenes: '销售与客服' },
        { name: 'Perplexity', role: '搜索订阅', products: 'Pro 订阅', tech: '检索 + 推理', scenes: '研究与问答' },
        { name: 'Cursor', role: '编码订阅', products: 'Pro/Business', tech: '代码补全与 Agent', scenes: '开发者' },
        { name: '字节豆包', role: '中国消费', products: '豆包、火山方舟', tech: '多模态', scenes: '内容与办公' }
      ] },
      { name: '研究与咨询', desc: '把成本曲线与市场数据做成可购买的情报。', companies: [
        { name: 'SemiAnalysis', role: '算力产业研究', products: '深度报告', tech: '供应链分析', scenes: '投资与采购' },
        { name: 'Epoch AI', role: '趋势研究', products: '算力与模型数据库', tech: '数据建模', scenes: '政策与研究' },
        { name: 'Artificial Analysis', role: '模型对比', products: '价格与性能榜单', tech: '基准测试', scenes: '选型决策' },
        { name: 'McKinsey', role: '管理咨询', products: 'AI 经济影响研究', tech: '行业分析', scenes: '企业战略' },
        { name: 'BCG', role: '管理咨询', products: 'AI 价值评估', tech: '转型方法论', scenes: '企业投资决策' }
      ] }
    ]
  },

  computefin: {
    levels: [
      ['一句话', '算力金融化把 GPU 变成可融资的资产：抵押贷款、SPV、资产证券化与循环交易——算力开支从费用表进入资产负债表，周期风险也随之金融化。'],
      ['打个比方', '像航运业的「造船融资」：船（GPU）很贵，船东（云厂）自己买不起，银行按租约放贷；船价涨时皆大欢喜，运力过剩时银行接盘。'],
      ['拆开看', '四层结构：资产持有（SPV / REIT 持有 GPU 与机房）→ 债务融资（按租约折现放贷）→ 租赁运营（neocloud 承租转租）→ 风险转移（保险与残值对冲）。'],
      ['怎么运转', '核心标的是「租约质量」：租期越长、承租人信用越好，融资成本越低；循环交易（投资—买卡—采购）让表观需求虚高，是监管与投资人关注的重点。'],
      ['格局与博弈', 'CoreWeave 用债务撬动巨额 GPU 订单，Crusoe 绑定能源资本，Blue Owl 与黑石提供数据中心信贷；GPU 三到五年贬值一半，是所有模型的最大假设风险。'],
      ['边界与走向', '算力金融化会催生 GPU 残值曲线与「算力期货」等新市场；一旦需求增速放缓，重资产 + 高杠杆会放大下行——金融工具不创造算力，只重新分配风险。']
    ],
    industries: [
      { name: '算力持有与融资平台', desc: '把 GPU 与租约打包成可融资资产的 neocloud。', companies: [
        { name: 'CoreWeave', role: '债务驱动标杆', products: 'GPU 云、MLPool', tech: '按租约融资', scenes: '模型训练租赁' },
        { name: 'Crusoe', role: '能源 + 算力', products: '伴生能源数据中心', tech: '能源套利 + SPV', scenes: '低成本训练' },
        { name: 'Lambda', role: 'GPU 云', products: '按需与预留实例', tech: '数据中心自营', scenes: '训练与推理' },
        { name: 'Nebius', role: '欧洲 GPU 云', products: 'AI Studio、集群', tech: '自建机房 + 融资', scenes: '欧洲市场' }
      ] },
      { name: '结构化融资与信贷', desc: '为算力资产定价的资本方。', companies: [
        { name: 'Blue Owl', role: '数据中心信贷', products: '超大规模算力贷款', tech: '租约证券化', scenes: 'Stargate 类项目' },
        { name: 'Blackstone', role: '私募信贷', products: '数字基础设施基金', tech: '长债 + 股权', scenes: '数据中心并购' },
        { name: 'Apollo', role: '信贷巨头', products: '基础设施信贷', tech: 'SPV 结构设计', scenes: '算力与能源' },
        { name: '摩根士丹利', role: '投行承销', products: '算力 ABS 承销', tech: '结构化融资', scenes: 'neocloud 融资' }
      ] },
      { name: '保险与风险服务', desc: '为算力资产定风险价格。', companies: [
        { name: 'Swiss Re', role: '再保险', products: '数据中心与算力中断险', tech: '巨灾风险模型迁移', scenes: '大型集群' },
        { name: 'Munich Re', role: '再保险', products: 'AI 与算力风险方案', tech: 'AI 风险精算', scenes: '模型与设施' },
        { name: 'Aon', role: '经纪与咨询', products: '算力资产保险经纪', tech: '风险评估', scenes: '云厂与投资人' },
        { name: 'Marsh', role: '保险经纪', products: '数字资产保险', tech: '条款设计', scenes: '企业算力' }
      ] },
      { name: '数据中心 REIT 与资产持有', desc: '算力的不动产底座，金融化的成熟样本。', companies: [
        { name: 'Equinix', role: '全球托管 REIT', products: 'IBX 数据中心、xScale', tech: '高功率机房', scenes: 'AI 集群托管' },
        { name: 'Digital Realty', role: '批发 REIT', products: '超大规模园区', tech: '液冷改造', scenes: '云厂长租' },
        { name: '吉宝 DC REIT', role: '亚洲 REIT', products: '亚太数据中心组合', tech: '资产证券化', scenes: '亚洲市场' },
        { name: '万国数据', role: '中国 IDC', products: '高等级机房', tech: '智算园区', scenes: '国内云与金融' }
      ] }
    ]
  },

  distribution: {
    levels: [
      ['一句话', '分发与渠道决定「用户在哪里遇到 AI」——是操作系统、超级 App、应用商店还是浏览器，谁掌握入口谁定规则、谁抽税。'],
      ['打个比方', '像商场与货架：产品再好，摆不上好位置就没人看见；商场（平台）还会抽成、改规则、自己下场卖货，租户永远在和房东博弈。'],
      ['拆开看', '四段链路：入口（OS / 浏览器 / 超级 App / 硬件）→ 发现机制（搜索、推荐、商店榜单）→ 分发形式（系统内置、插件、独立 App、API）→ 变现（抽成、广告、订阅、预装费）。'],
      ['怎么运转', '平台把 AI 做成系统级功能免费引流，第三方靠商店与 API 触达用户；推荐算法与榜单排名决定冷启动生死，榜单与搜索排名就是现金流。'],
      ['格局与博弈', '苹果与谷歌控制移动分发，微软控制桌面与办公，微信与抖音控制中国用户时长；平台既想收 AI 税又想自己做 AI，开发者两头受制，只能在「上架换流量」与「自建换自由」之间选边。'],
      ['边界与走向', 'Agent 会成为新的分发层：用户不再打开 App，而是让 Agent 代为操作，入口价值从「界面」转向「代理权」；谁能被 agent 默认调用，谁就拿到新流量，应用商店的抽成逻辑也会被重写。']
    ],
    industries: [
      { name: '操作系统与设备', desc: '把 AI 做成系统能力，天然拥有预装入口。', companies: [
        { name: 'Apple', role: '端侧入口', products: 'Apple Intelligence', tech: '端侧模型 + 隐私', scenes: 'iPhone/Mac 用户' },
        { name: 'Google', role: '移动与搜索', products: 'Android、Gemini', tech: '系统集成', scenes: '全球安卓用户' },
        { name: 'Microsoft', role: '桌面入口', products: 'Windows Copilot', tech: '系统级集成', scenes: 'PC 办公' },
        { name: '华为', role: '中国全栈', products: '鸿蒙、盘古', tech: '系统 + 模型', scenes: '中国设备生态' },
        { name: '小米', role: '人车家生态', products: '澎湃 OS、小爱', tech: '端侧 AI', scenes: '智能家居与手机' },
        { name: '三星', role: '全球硬件', products: 'Galaxy AI', tech: '端云结合', scenes: '手机与家电' }
      ] },
      { name: '超级 App', desc: '掌握用户时长与支付，是中国的实际分发中心。', companies: [
        { name: '微信', role: '社交入口', products: '小程序、元宝', tech: '社交图谱', scenes: '社交与支付' },
        { name: '抖音', role: '内容入口', products: '豆包、即梦', tech: '推荐算法', scenes: '内容消费与电商' },
        { name: '支付宝', role: '支付入口', products: 'AI 生活管家', tech: '交易数据', scenes: '生活服务' },
        { name: '百度', role: '搜索入口', products: '文心一言、搜索 AI', tech: '搜索 + 模型', scenes: '信息获取' },
        { name: '美团', role: '本地生活', products: 'AI 助手', tech: '履约数据', scenes: '到店与外卖' },
        { name: 'WhatsApp', role: '全球通讯', products: 'Meta AI 集成', tech: '通讯 + 模型', scenes: '新兴市场' }
      ] },
      { name: '应用商店与云市场', desc: '控制第三方 AI 应用的发现与结算。', companies: [
        { name: 'Apple App Store', role: 'iOS 分发', products: '应用商店', tech: '审核与抽成', scenes: 'iOS 应用分发' },
        { name: 'Google Play', role: '安卓分发', products: '应用商店', tech: '推荐与结算', scenes: '安卓应用分发' },
        { name: 'AWS Marketplace', role: '企业分发', products: '软件市场', tech: '云上采购', scenes: '企业软件采购' },
        { name: 'Azure Marketplace', role: '企业分发', products: '软件市场', tech: '云上采购', scenes: '企业 AI 采购' },
        { name: '阿里云市场', role: '中国云分发', products: '云市场', tech: '云上交付', scenes: '中国企业采购' }
      ] },
      { name: '浏览器与搜索', desc: '信息入口的争夺战，AI 直接改写搜索结果页。', companies: [
        { name: 'Chrome', role: '全球浏览器', products: 'Chrome + Gemini', tech: '浏览器集成', scenes: '网页浏览' },
        { name: 'Safari', role: '苹果浏览器', products: 'Safari + Apple Intelligence', tech: '端侧集成', scenes: '苹果设备' },
        { name: 'Edge', role: '微软浏览器', products: 'Copilot in Edge', tech: '浏览器 + 模型', scenes: 'Windows 办公' },
        { name: 'Brave', role: '隐私浏览器', products: 'Leo AI', tech: '隐私搜索', scenes: '隐私敏感用户' },
        { name: '夸克', role: '中国浏览器', products: 'AI 搜索、学习助手', tech: '搜索 + 模型', scenes: '年轻用户' }
      ] }
    ]
  },

  competition: {
    levels: [
      ['一句话', '竞争格局与阵营回答「谁和谁一伙、谁在打谁」，AI 的竞争不是单点产品战，而是资本、算力与分发的阵营战。'],
      ['打个比方', '像战国：单个城池（模型）的强弱会被盟约（投资）、粮道（算力）、民心（用户）放大或抵消；站错阵营，再强也难独存。'],
      ['拆开看', '三层结构：底层算力与芯片（NVIDIA、台积电、云厂自研）→ 中层模型（前沿 lab 与开源阵营）→ 上层应用与分发（平台与垂直 SaaS）；每层都有各自的护城河与利润率。'],
      ['怎么运转', '云厂用投资绑定模型厂，模型厂用算力换股权与优先供给，应用层用分发换流量；每一层都在向相邻层扩张——云厂做模型、模型厂做应用、应用公司自建模型——以夺取更多利润。'],
      ['格局与博弈', '美国是「资本 + 算力 + 前沿模型」三角，中国是「应用 + 开源 + 国产算力」三角，欧洲押注监管与主权，中东用资本买席位；交叉投资让阵营边界模糊，但算力供给关系仍是最硬的绑定。'],
      ['边界与走向', '阵营会随资本开支周期重组；开源与闭源的边界、Agent 对入口的替代，是下一轮洗牌的两个变量；资本纪律决定谁能熬过下行周期，也决定阵营最终收敛成几家。']
    ],
    industries: [
      { name: '美国阵营', desc: '资本、算力与前沿模型高度集中，联盟关系紧密。', companies: [
        { name: 'Microsoft–OpenAI', role: '云 + 模型联盟', products: 'Azure、Copilot', tech: '算力换股权', scenes: '企业 AI 全栈' },
        { name: 'Amazon/Google–Anthropic', role: '云 + 模型联盟', products: 'Bedrock、Vertex', tech: '多云分发', scenes: '企业模型服务' },
        { name: 'xAI–SpaceX', role: '资本与资源整合', products: 'Grok、Starlink', tech: '实时数据 + 轨道算力', scenes: '消费与国防' },
        { name: 'Meta', role: '开源阵营', products: 'Llama、广告系统', tech: '开放权重', scenes: '开发者与广告' },
        { name: 'Apple', role: '端侧阵营', products: 'Apple Intelligence', tech: '端侧 + 隐私', scenes: '设备生态' }
      ] },
      { name: '中国阵营', desc: '应用生态与开源并重，算力受管制倒逼自研。', companies: [
        { name: '阿里巴巴', role: '云 + 开源', products: 'Qwen、阿里云', tech: '全栈自研', scenes: '云与企业 AI' },
        { name: '字节跳动', role: '流量 + 模型', products: '豆包、Seed', tech: '推荐 + 多模态', scenes: '内容与电商' },
        { name: '腾讯', role: '社交 + 模型', products: '混元、元宝', tech: '社交数据', scenes: '社交与游戏' },
        { name: '华为', role: '算力 + 全栈', products: '昇腾、盘古、鸿蒙', tech: '国产算力', scenes: '政企与信创' },
        { name: '百度', role: '搜索 + 全栈', products: '文心、昆仑芯', tech: '搜索 + 芯片', scenes: '信息与云' },
        { name: 'DeepSeek', role: '开源破局', products: 'DeepSeek 模型', tech: '高效训练', scenes: '低成本推理' }
      ] },
      { name: '欧洲与中东', desc: '欧洲押注监管与主权，中东用资本换产业席位。', companies: [
        { name: 'Mistral', role: '欧洲旗舰', products: 'Mistral 模型', tech: '开源 + 本地化', scenes: '欧洲政企' },
        { name: 'SAP', role: '欧洲企业软件', products: 'Joule', tech: '企业流程', scenes: '欧洲大企业' },
        { name: 'ASML', role: '设备咽喉', products: '光刻机', tech: '先进制程设备', scenes: '全球芯片制造' },
        { name: 'G42', role: '中东算力', products: '数据中心、模型', tech: '算力 + 合作', scenes: '海湾国家 AI' },
        { name: 'MGX', role: '主权资本', products: 'AI 投资基金', tech: '资本配置', scenes: '全球 AI 投资' }
      ] },
      { name: '日韩与其他', desc: '硬件与本土市场为支点，寻找差异化位置。', companies: [
        { name: 'SoftBank', role: '资本 + 芯片', products: 'Arm、愿景基金', tech: 'IP 与投资', scenes: '全球 AI 投资' },
        { name: 'Naver', role: '韩国本土', products: 'HyperCLOVA X', tech: '韩语模型', scenes: '韩国搜索与电商' },
        { name: 'Kakao', role: '韩国社交', products: 'KakaoTalk + AI', tech: '社交分发', scenes: '韩国通讯' },
        { name: 'Sony', role: '内容 + 硬件', products: '图像传感器、游戏', tech: '传感与内容', scenes: '娱乐与影像' },
        { name: 'Samsung', role: '存储与终端', products: 'HBM、Galaxy AI', tech: '存储与端侧', scenes: '全球硬件' }
      ] }
    ]
  },

  alliance: {
    levels: [
      ['一句话', '标准与联盟是产业里的「共同语言」：芯片怎么连、Agent 怎么互操作、模型怎么评测，先定标准者得生态。'],
      ['打个比方', '像铁路轨距：谁定下轨距，谁就决定了所有列车和车站的形状；后来者要么接入，要么另修一条线，成本高到几乎不可能翻盘。'],
      ['拆开看', '四类标准并行：硬件互连（NVLink / UALink / Ultra Ethernet）→ 软件协议（MCP / A2A / OpenAPI）→ 评测基准（MLPerf / HELM）→ 安全与治理标准（NIST / ISO 42001）；越靠近硬件越难替换，越靠近应用越容易分叉。'],
      ['怎么运转', '联盟把事实标准写成规范，成员获得互操作与采购优势；主导厂商用开放标准扩大生态，同时把最值钱的一层留在私有实现里，形成「开放接口 + 封闭内核」的组合。'],
      ['格局与博弈', 'NVIDIA 用 NVLink 锁定机柜，超以太网联盟试图解耦；Anthropic 用 MCP 抢占 Agent 工具层，Google 用 A2A 争夺跨 Agent 协调；标准之争表面是技术路线，实质是生态租金与地缘阵营的划分。'],
      ['边界与走向', 'Agent 互操作协议会像 HTTP 一样成为基础设施，监管也可能直接引用标准作为合规依据；标准之争的胜负往往不在技术优劣，而在谁先获得足够多的默认采用——默认即权力。']
    ],
    industries: [
      { name: '互连与硬件联盟', desc: '决定算力集群如何扩展，是性能与锁定的关键。', companies: [
        { name: 'NVIDIA', role: '私有互连', products: 'NVLink、InfiniBand', tech: '机柜级互连', scenes: '大规模训练集群' },
        { name: 'UALink 联盟', role: '开放互连', products: 'UALink 规范', tech: '加速器互连', scenes: '挑战 NVLink' },
        { name: '超以太网联盟', role: '网络标准', products: 'UEC 规范', tech: '以太网优化', scenes: 'AI 数据中心网络' },
        { name: 'OCP', role: '开放硬件', products: '机架与电源规范', tech: '数据中心硬件', scenes: '云厂自建' },
        { name: 'PCI-SIG', role: '总线标准', products: 'PCIe 规范', tech: '设备互连', scenes: '服务器与加速卡' }
      ] },
      { name: '协议与互操作', desc: '让模型、工具与 Agent 能互相调用。', companies: [
        { name: 'Anthropic', role: '工具协议', products: 'MCP', tech: '上下文与工具调用', scenes: 'Agent 接工具' },
        { name: 'Google', role: 'Agent 协议', products: 'A2A', tech: '跨 Agent 协作', scenes: '多 Agent 系统' },
        { name: 'Microsoft', role: '企业互操作', products: 'Copilot 扩展', tech: '插件与连接器', scenes: '办公生态' },
        { name: 'W3C', role: 'Web 标准', products: 'Web 规范', tech: '开放标准', scenes: '浏览器与 Web AI' },
        { name: 'Linux 基金会', role: '中立托管', products: 'Agent 与 AI 项目', tech: '社区治理', scenes: '跨厂商协作' }
      ] },
      { name: '评测与基准联盟', desc: '用统一尺子衡量模型，影响采购与叙事。', companies: [
        { name: 'MLCommons', role: '性能基准', products: 'MLPerf', tech: '训练与推理基准', scenes: '硬件采购' },
        { name: 'LMArena', role: '人类偏好', products: 'Arena 榜单', tech: '众包对战', scenes: '模型口碑' },
        { name: 'HELM', role: '综合评测', products: 'HELM 基准', tech: '多任务评测', scenes: '学术与选型' },
        { name: '中国信通院', role: '中国评估', products: '可信 AI 评估', tech: '标准与测试', scenes: '政企采购' },
        { name: 'Epoch AI', role: '趋势基准', products: '能力与算力数据库', tech: '数据分析', scenes: '政策与研究' }
      ] },
      { name: '安全与治理', desc: '把安全从口号变成可审计的规范。', companies: [
        { name: 'NIST', role: '美国框架', products: 'AI RMF', tech: '风险管理', scenes: '美国企业合规' },
        { name: 'ISO/IEC', role: '国际标准', products: 'AI 管理体系', tech: '认证标准', scenes: '全球互认' },
        { name: 'EU AI Office', role: '欧盟执法', products: 'AI Act 规范', tech: '风险分级', scenes: '欧盟市场' },
        { name: '全国网安标委', role: '中国标准', products: 'AI 安全标准', tech: '标准制定', scenes: '国内合规' },
        { name: 'OpenSSF', role: '开源安全', products: '安全基线', tech: '供应链安全', scenes: '开源项目治理' }
      ] }
    ]
  }

});
