/* L2 数据与模型层：节点六层解释 + 行业与企业版图（手工策展，口径见 explain.js 头注释）。 */
Object.assign(DB.explain, {
  pretrain: {
    levels: [
      ['一句话', '预训练数据是模型的「教科书」：语料的规模、质量与版权，直接决定模型能力的起点与上限；模型架构可以开源，独家语料不能。'],
      ['打个比方', '像做饭的食材——食材不新鲜、来源不明，厨艺再好也做不出好菜；而好食材越来越贵、越来越少，抢到好食材本身就是竞争力。'],
      ['拆开看', '五段链路：网页抓取（Common Crawl）→ 清洗、去重与质量打分 → 版权授权（新闻、图书、代码）→ 多语种与领域配比 → 数据配方与课程安排；每一步都影响模型的知识面、推理倾向与偏见。'],
      ['怎么运转', '数据商按量或授权收费，版权方收许可费，模型公司自建清洗管线；高质量数据越来越像「石油」，谁掌握稀缺语料谁就有议价权，而清洗与配比的 know-how 往往比数据本身更值钱。'],
      ['格局与博弈', 'Reddit、News Corp、AP 等版权方与 AI 公司签授权，Scale AI、海天瑞声提供数据服务；开源语料（FineWeb、Common Crawl 衍生）撑起开源模型，闭源靠独家数据与合成数据拉开差距。'],
      ['边界与走向', '高质量人类文本见底，「数据墙」推动合成数据与多模态数据；版权诉讼会重塑数据获取成本，数据授权将从一次性买断转向按用量分成，「能证明数据来源」会成为采购门槛。']
    ],
    industries: [
      { name: '数据服务与标注', desc: '把原始数据加工成可训练语料，规模与质量并重。', companies: [
        { name: 'Scale AI', role: '数据服务龙头', products: '数据标注、RL 环境、评测', tech: '专家数据、质量管线', scenes: '前沿 lab 训练数据' },
        { name: 'Appen', role: '数据服务', products: '标注、语料采集', tech: '全球众包网络', scenes: '多语种数据' },
        { name: '海天瑞声', role: '中国数据服务', products: '语音/文本/多模态数据集', tech: '数据采集与标注', scenes: '中文模型训练' },
        { name: '数据堂', role: '中国数据服务', products: 'AI 训练数据集', tech: '数据加工与合规', scenes: '行业模型' },
        { name: 'Surge AI', role: '专家数据', products: '高质量人类反馈、RL 数据', tech: '专家网络、质量评估', scenes: '后训练与对齐' }
      ] },
      { name: '版权内容与媒体', desc: '新闻、图书、图片与社区内容，是高质量语料的来源。', companies: [
        { name: 'Reddit', role: '社区语料', products: '用户帖子数据授权', tech: '数据 API 与许可', scenes: '对话语料授权' },
        { name: 'News Corp', role: '新闻版权', products: '新闻内容授权', tech: '内容许可', scenes: '新闻语料训练' },
        { name: 'AP（美联社）', role: '新闻通讯社', products: '新闻数据授权', tech: '内容授权', scenes: '事实性语料' },
        { name: 'Getty Images', role: '图片版权', products: '图片库授权', tech: '版权管理', scenes: '图像生成训练' },
        { name: 'Shutterstock', role: '图片与视频', products: '素材库授权', tech: '版权授权平台', scenes: '多模态训练' },
        { name: '视觉中国', role: '中国图片版权', products: '图片与视频素材', tech: '版权交易', scenes: '国内多模态语料' }
      ] },
      { name: '开源语料与社区', desc: '开放数据集与协作平台，是开源模型的公共底座。', companies: [
        { name: 'Common Crawl', role: '网页语料', products: '开放网页抓取数据', tech: '大规模爬取与存档', scenes: '预训练基础语料' },
        { name: 'Hugging Face', role: '数据与模型社区', products: 'Datasets、模型托管', tech: '社区协作、数据卡', scenes: '开源模型训练' },
        { name: 'LAION', role: '开放图文数据', products: 'LAION-5B 图文对', tech: '开放数据构建', scenes: '图像生成训练' },
        { name: '维基百科', role: '开放知识', products: '多语种百科语料', tech: '社区协作、许可开放', scenes: '知识型语料' }
      ] },
      { name: '数据基础设施', desc: '存储、处理与版本管理，决定数据能否规模化使用。', companies: [
        { name: 'Databricks', role: '数据平台', products: 'Lakehouse、Unity Catalog', tech: '数据湖仓、治理', scenes: '企业数据与 AI' },
        { name: 'Snowflake', role: '云数据仓库', products: '数据云、Cortex AI', tech: '弹性数仓', scenes: '企业数据共享' },
        { name: 'Confluent', role: '数据流', products: 'Kafka 托管', tech: '实时数据管道', scenes: '实时特征与语料' },
        { name: '阿里云', role: '中国数据平台', products: 'MaxCompute、OSS', tech: '大数据与存储', scenes: '中文语料处理' }
      ] },
      { name: '数据交易与授权市场', desc: '让数据「可定价、可授权、可追溯」的市场基础设施。', companies: [
        { name: '上海数据交易所', role: '中国数交所', products: '数据产品挂牌、数易贷', tech: '登记与合规流通', scenes: '数据要素市场' },
        { name: '深圳数据交易所', role: '区域数交所', products: '数据交易与撮合', tech: '隐私计算流通', scenes: '大湾区数据流通' },
        { name: 'Getty Images', role: '版权授权', products: '图片授权、Gen AI 模型许可', tech: '版权管理 + 生成服务', scenes: '训练数据授权' },
        { name: 'Shutterstock', role: '素材授权', products: 'AI 数据授权（与 OpenAI 等合作）', tech: '内容库 + 分成模式', scenes: '训练数据供给' },
        { name: 'Scale AI', role: '数据服务', products: '标注、RLHF 与评测数据', tech: '人类数据流水线', scenes: '模型厂商数据外包' }
      ] }
    ]
  },

  synth: {
    levels: [
      ['一句话', '合成数据与标注用模型生成训练数据，突破「真实语料不够用」的数据墙，同时为模型提供可验证的练习环境；它的价值不在数量，而在「能自动验证对错」。'],
      ['打个比方', '像用飞行模拟器练飞行员——不用真飞机也能积累大量小时数，但模拟器失真会带偏技术；数据质量就是模拟器的保真度，验证器就是教练。'],
      ['拆开看', '五段链路：种子数据 → 生成（LLM / 物理仿真）→ 过滤与验证（规则、奖励模型、执行结果）→ 配比与去偏 → 回流训练；质量闸门是核心，没有验证器的合成数据只是噪声放大器。'],
      ['怎么运转', '数据服务商按项目收费，模型公司内建合成管线；验证器决定数据能不能用，可验证任务（代码、数学、工具调用、agent 轨迹）最先规模化，开放域写作最难。'],
      ['格局与博弈', 'Scale AI、Surge AI 转向专家数据与强化学习环境，NVIDIA Omniverse 做具身仿真；开源工具降低门槛，但高质量验证器与长尾专家数据仍稀缺，也是护城河所在。'],
      ['边界与走向', '合成数据从「补量」转向「造环境」（可验证任务、agent 轨迹、仿真场景）；模式坍缩与版权风险仍需管理，未来训练更像「设计课程」而非「收集文本」。']
    ],
    industries: [
      { name: '数据标注与服务', desc: '人类反馈与专家数据，仍是后训练的关键投入。', companies: [
        { name: 'Scale AI', role: '数据与评测', products: '标注、RL 环境、评测', tech: '专家网络、质量管线', scenes: '前沿模型后训练' },
        { name: 'Surge AI', role: '专家数据', products: '高质量人类反馈', tech: '专家标注、质量评估', scenes: '对齐与 RLHF' },
        { name: 'Mercor', role: '专家网络', products: '专家数据与任务', tech: '人才匹配', scenes: '专业领域数据' },
        { name: '海天瑞声', role: '中国数据', products: '语音与多模态数据', tech: '采集与标注', scenes: '中文模型' },
        { name: 'Appen', role: '全球标注', products: '众包标注', tech: '全球交付网络', scenes: '多语种数据' }
      ] },
      { name: '合成数据平台', desc: '用生成模型造数据，强调隐私与分布可控。', companies: [
        { name: 'Gretel', role: '合成数据', products: '合成数据平台', tech: '差分隐私、生成模型', scenes: '隐私敏感数据' },
        { name: 'Mostly AI', role: '合成数据', products: '结构化数据合成', tech: '表格数据生成', scenes: '金融与医疗数据' },
        { name: 'Datagen', role: '视觉合成', products: '人脸与场景合成', tech: '3D 渲染、仿真', scenes: '视觉模型训练' },
        { name: 'Tonic', role: '测试数据', products: '数据脱敏与合成', tech: '数据虚拟化', scenes: '开发测试' }
      ] },
      { name: '仿真与合成环境', desc: '为具身智能与自动驾驶造可交互的训练世界。', companies: [
        { name: 'NVIDIA', role: '仿真平台', products: 'Omniverse、Isaac Sim', tech: '物理仿真、合成数据', scenes: '机器人与自动驾驶' },
        { name: 'Unity', role: '实时 3D', products: 'Unity 引擎、合成数据工具', tech: '实时渲染', scenes: '游戏与仿真' },
        { name: 'Unreal（Epic）', role: '高保真仿真', products: 'Unreal Engine', tech: '真实感渲染', scenes: '影视与自动驾驶' },
        { name: '51WORLD', role: '中国仿真', products: '数字孪生、仿真平台', tech: '城市与交通仿真', scenes: '自动驾驶测试' },
        { name: '群核科技', role: '空间智能', products: '酷家乐、空间数据平台', tech: '3D 重建与仿真', scenes: '家居与机器人训练' }
      ] },
      { name: '验证与评测', desc: '判断合成数据是否可用，是数据工厂的质检环节。', companies: [
        { name: 'Scale AI', role: '数据评测', products: '评测与红队', tech: '人类与自动评估', scenes: '模型发布前验证' },
        { name: 'Patronus AI', role: '模型评测', products: '自动评测平台', tech: '评测集与裁判模型', scenes: '企业模型验收' },
        { name: 'Galileo', role: '评测与可观测', products: '评测平台', tech: '指标与回归', scenes: '生产模型监控' },
        { name: '中国信通院', role: '标准与评测', products: '大模型评测体系', tech: '标准制定', scenes: '国内合规评测' }
      ] }
    ]
  },

  frontier: {
    levels: [
      ['一句话', '前沿闭源模型是能力天花板：GPT、Claude、Gemini、Grok 这些旗舰决定行业能做什么，也定义 API 的价格锚与采购预期。'],
      ['打个比方', '像手机行业的旗舰机——销量不一定最大，但定义了品牌与技术标准，能力再往下溢出到全产品线；旗舰失手，整条产品线都会被质疑。'],
      ['拆开看', '五段链路：预训练（万亿 token）→ 后训练（RLHF / RLVR）→ 推理时计算（长思考、工具调用）→ 安全对齐与评测 → API 与产品封装；每一层都在拉高成本与门槛。'],
      ['怎么运转', '订阅（ChatGPT / Claude Pro）+ API 按 token + 企业合同；训练成本以十亿美元计，靠规模与用量摊薄，亏损换份额是常态，算力承诺又反过来锁定融资。'],
      ['格局与博弈', 'OpenAI、Anthropic、Google 三强争旗舰，xAI 以算力与分发追赶，Meta 走开源侧翼，中国 lab 在本土与开源市场分层竞争；企业客户普遍采用多模型策略，单一供应商依赖正在下降。'],
      ['边界与走向', '旗舰能力差距收窄，竞争转向成本、可靠性与分发；「模型即产品」会逐步让位于「智能体即产品」，旗舰的价值从跑分转向任务完成率与单位成本。']
    ],
    industries: [
      { name: '美国前沿 lab', desc: '能力上限的定义者，也是 API 经济的卖方。', companies: [
        { name: 'OpenAI', role: '旗舰定义者', products: 'GPT 系列、ChatGPT、Sora', tech: '大规模预训练、推理时计算', scenes: '消费订阅、企业 API' },
        { name: 'Anthropic', role: '编码与安全', products: 'Claude 系列、Claude Code', tech: 'Constitutional AI、Agent', scenes: '企业 API、编码工具' },
        { name: 'Google DeepMind', role: '全栈 lab', products: 'Gemini、Veo、Genie', tech: 'TPU 训练、多模态', scenes: '搜索、云、机器人' },
        { name: 'xAI', role: '算力追赶', products: 'Grok 系列', tech: '大规模集群、实时数据', scenes: '社交分发、API' },
        { name: 'Meta', role: '开源侧翼', products: 'Llama、Meta AI', tech: '开源权重、大规模训练', scenes: '社交产品、开源生态' }
      ] },
      { name: '中国前沿 lab', desc: '本土市场与开源生态的主要供给方。', companies: [
        { name: 'DeepSeek', role: '开源性价比', products: 'DeepSeek 系列', tech: '高效训练、推理优化', scenes: '开源 API、行业部署' },
        { name: '阿里通义', role: '云 + 开源', products: 'Qwen 系列、百炼', tech: '多尺寸模型、云服务', scenes: '企业 API、开源生态' },
        { name: '字节 Seed', role: '多模态', products: '豆包、Seedance', tech: '多模态、大规模训练', scenes: '消费应用、内容生成' },
        { name: '智谱', role: 'GLM 开源', products: 'GLM 系列、清言', tech: '中英双语、Agent', scenes: '政企与开发者' },
        { name: '月之暗面', role: '长上下文', products: 'Kimi', tech: '长上下文、消费产品', scenes: '消费助手、API' },
        { name: 'MiniMax', role: '全模态', products: '海螺、abab 系列', tech: '语音与视频生成', scenes: '内容创作、社交' }
      ] },
      { name: '欧洲与其他', desc: '地缘与主权 AI 驱动的第二阵营。', companies: [
        { name: 'Mistral', role: '欧洲旗舰', products: 'Mistral 系列、Le Chat', tech: '开源权重、欧洲合规', scenes: '欧洲企业与政府' },
        { name: 'Cohere', role: '企业 RAG', products: 'Command、Embed', tech: '企业检索与生成', scenes: '企业知识库' },
        { name: 'AI21', role: '企业模型', products: 'Jamba 系列', tech: '混合架构', scenes: '企业文本处理' },
        { name: 'Naver', role: '韩国主权 AI', products: 'HyperCLOVA X', tech: '韩语数据', scenes: '韩国消费与企业' },
        { name: 'Sakana AI', role: '日本研究', products: '进化式模型组合', tech: '模型合并与进化', scenes: '研究与本地化' }
      ] },
      { name: '云与分发平台', desc: '把前沿模型卖给企业，掌握分发与议价权。', companies: [
        { name: 'Microsoft', role: 'OpenAI 合作', products: 'Azure OpenAI、Copilot', tech: '云 + 办公分发', scenes: '企业 AI、办公' },
        { name: 'Amazon', role: 'Anthropic 合作', products: 'Bedrock、Alexa+', tech: '多模型聚合', scenes: '企业云、消费硬件' },
        { name: 'Google Cloud', role: 'Gemini 分发', products: 'Vertex AI、Workspace', tech: 'TPU + 数据', scenes: '企业 AI、办公' },
        { name: '阿里云', role: '中国分发', products: '百炼、通义 API', tech: '云 + 模型', scenes: '中国企业 AI' },
        { name: '火山引擎', role: '字节分发', products: '方舟、豆包 API', tech: '大规模推理', scenes: '内容与消费应用' }
      ] }
    ]
  },

  openweight: {
    levels: [
      ['一句话', '开源权重把模型参数公开，让任何人自部署、微调和二次开发，从而改写定价权与供给格局；它把「模型」从服务变成可复制的商品。'],
      ['打个比方', '像安卓开放源代码——厂商可以自由定制，但生态治理与商业化仍由几个关键玩家主导；自由度与可控性换来的是责任自担与运维成本。'],
      ['拆开看', '四段链路：权重（Llama / Qwen / DeepSeek / GLM）→ 许可证（Apache / MIT / 自定义）→ 社区分发（Hugging Face / 魔搭）→ 推理与微调工具链；许可证条款决定商用边界与再分发权利。'],
      ['怎么运转', '大厂用开源换生态与人才，云厂商靠托管开源模型赚钱，创业公司做微调与部署服务；权重免费，钱从托管、支持与集成里赚，纯模型本身很难收费。'],
      ['格局与博弈', 'Meta Llama 与阿里 Qwen 是两大阵营，DeepSeek 以性价比破局，Mistral 代表欧洲；Hugging Face 成为分发枢纽，许可证从宽松走向「开放但有限制」，反云厂条款开始出现。'],
      ['边界与走向', '开源与闭源的能力差距在缩小，但「谁为开源买单」仍未解；许可证与安全审查会收紧，企业采用会更多集中在可审计、可私有化的方案上，监管也可能要求开源模型承担部分安全义务。']
    ],
    industries: [
      { name: '开源模型发布方', desc: '用权重换生态、人才与标准影响力。', companies: [
        { name: 'Meta', role: 'Llama 阵营', products: 'Llama 系列', tech: '大规模训练、开放权重', scenes: '社交产品、开发者生态' },
        { name: '阿里通义', role: 'Qwen 阵营', products: 'Qwen 全尺寸系列', tech: '多语种、多模态', scenes: '云服务、开源社区' },
        { name: 'DeepSeek', role: '性价比破局', products: 'DeepSeek 系列', tech: '高效 MoE、推理优化', scenes: '开源 API、行业部署' },
        { name: '智谱', role: 'GLM 开源', products: 'GLM 系列', tech: '中英双语、Agent', scenes: '政企与开发者' },
        { name: 'Mistral', role: '欧洲开源', products: 'Mistral 系列', tech: '高效小模型', scenes: '欧洲企业与政府' },
        { name: '上海 AI Lab', role: '中国研究', products: 'InternLM、书生系列', tech: '开源研究', scenes: '学术与产业' }
      ] },
      { name: '社区与托管', desc: '模型与数据集的集散地，开源生态的基础设施。', companies: [
        { name: 'Hugging Face', role: '开源社区', products: 'Hub、Inference、Transformers', tech: '模型托管、社区协作', scenes: '开源模型分发' },
        { name: 'ModelScope（魔搭）', role: '中国社区', products: '模型与数据集托管', tech: '阿里云生态', scenes: '中文开源模型' },
        { name: 'GitHub', role: '代码与模型', products: '仓库、Models', tech: '开发者生态', scenes: '开源项目协作' },
        { name: 'Replicate', role: '模型托管', products: '模型 API 托管', tech: '容器化推理', scenes: '快速部署开源模型' },
        { name: 'Together AI', role: '开源模型云', products: '推理与微调', tech: '分布式推理', scenes: '开源模型商用' }
      ] },
      { name: '微调与部署服务', desc: '把开源权重变成企业可用的私有模型。', companies: [
        { name: 'Together AI', role: '训练与推理', products: '微调、推理 API', tech: '分布式训练、推理优化', scenes: '企业私有模型' },
        { name: 'Fireworks AI', role: '推理服务', products: '模型 API、微调', tech: '高吞吐推理', scenes: '低延迟应用' },
        { name: '硅基流动', role: '中国推理云', products: '模型 API、私有部署', tech: '国产芯片适配', scenes: '中国企业应用' },
        { name: '无问芯穹', role: '中国算力优化', products: '异构算力平台', tech: '多芯片适配', scenes: '智算中心' },
        { name: 'Ollama', role: '本地部署', products: '本地模型运行时', tech: '量化与本地推理', scenes: '开发者本地实验' }
      ] },
      { name: '许可证与治理', desc: '决定开源模型能否商用，是生态的规则层。', companies: [
        { name: 'Apache 基金会', role: '开源许可证', products: 'Apache 2.0', tech: '开源治理', scenes: '商用友好许可' },
        { name: 'OSI', role: '开源定义', products: '开源 AI 定义', tech: '标准制定', scenes: '许可证认证' },
        { name: 'Linux 基金会', role: '中立托管', products: '开源项目托管', tech: '社区治理', scenes: 'AI 开源项目' },
        { name: '开放原子基金会', role: '中国开源', products: '开源项目托管', tech: '社区治理', scenes: '中国开源生态' }
      ] }
    ]
  },

  training: {
    levels: [
      ['一句话', '训练方法与对齐是把「原始模型」变成「好用的助手」的工艺：预训练给知识，后训练给行为和性格；同样的底座，后训练不同就是两个产品。'],
      ['打个比方', '像培养一个毕业生——课堂学知识（预训练），实习学规矩（SFT），考核定行为（RLHF / RLVR）；同样的知识，不同的带法出来的人完全不同。'],
      ['拆开看', '五段链路：SFT（指令微调）→ 偏好优化（RLHF / DPO）→ 可验证奖励 RL（数学、代码、工具调用）→ 蒸馏与量化 → 安全对齐；数据配比与奖励设计决定最终行为。'],
      ['怎么运转', '训练框架与数据服务是卖铲人，lab 内部 know-how 是核心资产；后训练成本远低于预训练，但决定产品体验与差异化，也是小团队能做出现差异的地方。'],
      ['格局与博弈', '头部 lab 在 RLVR 与推理时计算上领先，开源社区快速跟进；偏好数据与验证器成为稀缺资产，合成环境成为新训练场，专家标注的边际价值在上升。'],
      ['边界与走向', '开放域奖励设计仍是难题，训练会更多转向「环境 + 验证器」；对齐与能力将越来越难分开，后训练会从「调行为」走向「造能力」，评测集污染也会逼迫训练方法升级。']
    ],
    industries: [
      { name: '前沿 lab 训练团队', desc: '掌握后训练 know-how 的少数团队，决定模型可用性。', companies: [
        { name: 'OpenAI', role: '训练方法领先', products: 'GPT 系列后训练', tech: 'RLHF、推理时计算', scenes: '旗舰模型行为塑造' },
        { name: 'Anthropic', role: '对齐与 Agent', products: 'Claude 系列', tech: 'Constitutional AI、RLVR', scenes: '安全与编码能力' },
        { name: 'Google DeepMind', role: '研究驱动', products: 'Gemini 系列', tech: 'JAX、强化学习', scenes: '多模态与推理' },
        { name: 'DeepSeek', role: '高效训练', products: 'DeepSeek 系列', tech: 'MoE、GRPO', scenes: '开源模型训练' },
        { name: '阿里通义', role: '全尺寸训练', products: 'Qwen 系列', tech: '多阶段后训练', scenes: '云与开源模型' }
      ] },
      { name: '训练框架与工具', desc: '把算力组织成训练任务，决定效率与可复现性。', companies: [
        { name: 'Meta', role: 'PyTorch 生态', products: 'PyTorch、TorchTitan', tech: '分布式训练', scenes: '开源训练框架' },
        { name: 'Google', role: 'JAX 生态', products: 'JAX、Pathways', tech: '编译器与分布式', scenes: 'TPU 训练' },
        { name: 'Hugging Face', role: '训练工具', products: 'Transformers、TRL、Accelerate', tech: '微调与对齐工具', scenes: '开源模型微调' },
        { name: 'Unsloth', role: '高效微调', products: '低显存微调工具', tech: '内核优化、LoRA', scenes: '单卡微调' },
        { name: 'Axolotl', role: '微调框架', products: '开源微调框架', tech: '配置化训练', scenes: '社区微调' }
      ] },
      { name: '数据与标注', desc: '偏好数据与专家反馈，是后训练质量的源头。', companies: [
        { name: 'Scale AI', role: '专家数据', products: 'RLHF、RL 环境', tech: '专家网络', scenes: '前沿 lab 后训练' },
        { name: 'Surge AI', role: '高质量反馈', products: '人类偏好数据', tech: '专家标注', scenes: '对齐训练' },
        { name: '海天瑞声', role: '中国数据', products: '语音与文本数据', tech: '采集与标注', scenes: '中文模型训练' },
        { name: '数据堂', role: '中国数据', products: '训练数据集', tech: '数据加工', scenes: '行业模型' }
      ] },
      { name: '训练云与算力', desc: '为训练任务提供集群、调度与容错。', companies: [
        { name: 'AWS', role: '训练云', products: 'SageMaker、Trainium 集群', tech: '分布式训练', scenes: '企业模型训练' },
        { name: 'Microsoft Azure', role: '训练云', products: 'Azure ML、GPU 集群', tech: 'InfiniBand', scenes: 'OpenAI 训练' },
        { name: 'Google Cloud', role: 'TPU 训练', products: 'Vertex AI、TPU', tech: 'JAX/Pathways', scenes: 'Gemini 训练' },
        { name: 'CoreWeave', role: 'GPU 集群', products: 'GPU 训练集群', tech: 'Kubernetes', scenes: 'AI 原生训练' },
        { name: '阿里云', role: '中国训练云', products: 'PAI、灵骏', tech: '大规模调度', scenes: '通义训练' }
      ] }
    ]
  },
  reasoning: {
    levels: [
      ['一句话', '推理模型是「先想后答」的模型：把思考过程本身当作计算资源，答案质量随推理时间上升——买更多思考时间，就能买到更多智能。'],
      ['打个比方', '像考试先打草稿再作答——普通模型提笔就写，推理模型给自己留一张草稿纸，难题多打草稿、易题少打草稿；草稿（思维链）本身也成为产品的一部分。'],
      ['拆开看', '四个部件：思维链生成（CoT）→ 自我验证与反思 → 工具与搜索外化思考 → 思考预算调度（该想多久、何时停）；训练侧靠可验证奖励 RL（数学/代码/agent 轨迹），消费侧按 token 计费。'],
      ['怎么运转', '商业上「思考即用量」：推理档按更长的输出计费，成本与售价同升；能力上把预训练 Scaling 放缓后的增长曲线续接到推理算力上；工程上推理集群成为资本开支新主角。'],
      ['格局与博弈', 'OpenAI o 系定义范式，DeepSeek R1 用开源把范式平权，各家旗舰标配混合推理（单模型开关思考档）；竞争焦点从「会不会想」转向「何时该想」的调度智能与单位任务成本。'],
      ['边界与走向', '反向扩展与过度思考证明「无脑拉长思考」存在负收益区间；走向自适应思考预算、外部化验证与按任务计费；推理算力占资本开支的比重是这条曲线是否持续的仪表。']
    ],
    industries: [
      { name: '前沿推理模型', desc: '把「思考」做成产品的旗舰阵营。', companies: [
        { name: 'OpenAI', role: '范式定义者', products: 'o 系 / Thinking 档', tech: '可验证奖励 RL', scenes: '复杂推理任务' },
        { name: 'DeepSeek', role: '范式平权者', products: 'R1 系（MIT 开源）', tech: 'GRPO、蒸馏', scenes: '开源推理与 API' },
        { name: 'Anthropic', role: '混合推理代表', products: 'Claude 扩展思考', tech: '单模型双档开关', scenes: '编码与长任务' },
        { name: 'Google DeepMind', role: '快速跟进', products: 'Gemini Thinking', tech: '原生多模态思考', scenes: '多模态推理' },
        { name: 'xAI', role: '差异化入场', products: 'Grok Think / DeepSearch', tech: '搜索外化思考', scenes: '实时信息推理' }
      ] },
      { name: '推理算力与引擎', desc: '为思考付算力的基础设施层。', companies: [
        { name: 'NVIDIA', role: '推理算力主力', products: 'Blackwell/Rubin 推理集群', tech: '低精度高吞吐', scenes: '推理数据中心' },
        { name: 'vLLM / SGLang', role: '推理引擎', products: '开源推理引擎', tech: '连续批处理、KV 优化', scenes: '思考 token 吞吐' },
        { name: 'Groq / Cerebras', role: '高吞吐专用', products: 'LPU / 晶圆级推理', tech: '极致 token 速度', scenes: '长思考低延迟' },
        { name: 'Together / Fireworks', role: '推理云', products: '托管推理 API', tech: '多模型路由', scenes: '按任务成本优化' }
      ] },
      { name: '评测与调度', desc: '决定「何时思考、买谁的思考」。', companies: [
        { name: 'Artificial Analysis', role: '智能指数', products: 'AA 智能指数 / Cost per Task', tech: '标准化评测', scenes: '思考档性价比' },
        { name: 'LMArena', role: '人类偏好', products: '竞技场投票', tech: '盲测对比', scenes: '思考质量口碑' },
        { name: 'OpenRouter', role: '路由层', products: '多模型网关', tech: '按效果路由', scenes: '思考档选择自动化' },
        { name: 'ARC Prize', role: '推理基准', products: 'ARC-AGI', tech: '抽象推理题', scenes: '范式能力上限' }
      ] }
    ]
  },

  inference: {
    levels: [
      ['一句话', '推理优化与引擎让同一张卡服务更多用户：吞吐、延迟和成本，全靠调度与内核优化；模型不变，工程能力决定毛利。'],
      ['打个比方', '像餐厅翻台率——菜（模型）不变，动线、预制和后厨调度决定一天能接待多少人；同样的厨房，翻台率差三倍就是三倍利润。'],
      ['拆开看', '五段链路：引擎（vLLM / SGLang / TensorRT-LLM）→ 批处理与调度 → 量化（FP8 / FP4）→ KV cache 管理与前缀缓存 → 多模型路由；显存带宽往往是真正的瓶颈。'],
      ['怎么运转', '开源引擎免费，托管服务按 token 收费；云厂商把推理优化内化为成本优势，单位 token 成本成为核心竞争力，也是价格战的底气。'],
      ['格局与博弈', 'vLLM、SGLang 主导开源，英伟达 TensorRT-LLM 绑定自家硬件，Groq、Cerebras 用专用芯片抢低延迟场景；中国厂商做国产芯片适配与 PD 分离方案。'],
      ['边界与走向', '长上下文与高并发的 KV 带宽墙是主战场，投机解码与 PD 分离会持续提升吞吐；推理成本下降速度决定应用爆发速度，也决定哪些场景能跨过经济性阈值。']
    ],
    industries: [
      { name: '开源推理引擎', desc: '社区驱动的推理内核，事实标准的主要竞争者。', companies: [
        { name: 'vLLM', role: '开源引擎', products: 'PagedAttention、OpenAI 兼容 API', tech: 'KV cache 管理、连续批处理', scenes: '模型服务部署' },
        { name: 'SGLang', role: '开源引擎', products: 'RadixAttention、结构化生成', tech: '前缀缓存、调度', scenes: '高并发推理' },
        { name: 'Hugging Face', role: '推理工具', products: 'TGI、Transformers', tech: '推理优化', scenes: '模型托管' },
        { name: 'Ollama', role: '本地推理', products: '本地模型运行时', tech: '量化、跨平台', scenes: '开发者本地部署' },
        { name: 'llama.cpp', role: '轻量推理', products: 'CPU/端侧推理', tech: '量化、GGUF', scenes: '本地与边缘' }
      ] },
      { name: '商用推理服务', desc: '按 token 卖推理，比拼成本与延迟。', companies: [
        { name: 'Fireworks AI', role: '推理服务', products: '模型 API、微调', tech: '高吞吐、低延迟', scenes: '生产级应用' },
        { name: 'Together AI', role: '开源模型云', products: '推理与微调 API', tech: '分布式推理', scenes: '开源模型商用' },
        { name: 'Groq', role: '专用推理芯片', products: 'LPU 推理云', tech: '确定性执行、低延迟', scenes: '实时语音与 Agent' },
        { name: 'Cerebras', role: '晶圆级芯片', products: 'WSE 推理服务', tech: '晶圆级集成', scenes: '超高速推理' },
        { name: '硅基流动', role: '中国推理云', products: '模型 API、私有部署', tech: '国产芯片适配', scenes: '中国企业应用' }
      ] },
      { name: '硬件厂商软件栈', desc: '把推理引擎绑定到自家芯片，形成事实锁定。', companies: [
        { name: 'NVIDIA', role: '全栈优化', products: 'TensorRT-LLM、Triton', tech: '内核融合、FP8/FP4', scenes: 'GPU 推理' },
        { name: 'AMD', role: '开放软件栈', products: 'ROCm、vLLM 适配', tech: 'MI300 推理优化', scenes: '性价比推理' },
        { name: '华为', role: '国产软件栈', products: 'CANN、MindIE', tech: '昇腾推理优化', scenes: '国产化部署' },
        { name: '寒武纪', role: '国产 ASIC', products: 'BANG、推理工具链', tech: '算子优化', scenes: '智算中心推理' }
      ] },
      { name: '云厂商推理平台', desc: '把优化后的推理能力打包成托管服务。', companies: [
        { name: 'AWS', role: 'Bedrock', products: 'Bedrock、SageMaker', tech: '多模型托管', scenes: '企业推理' },
        { name: 'Microsoft Azure', role: 'Azure AI', products: 'Azure OpenAI、AI Foundry', tech: '模型路由', scenes: '企业 AI' },
        { name: 'Google Cloud', role: 'Vertex AI', products: 'Vertex AI、TPU 推理', tech: 'TPU 优化', scenes: '企业推理' },
        { name: '阿里云', role: '百炼', products: '百炼、PAI-EAS', tech: '弹性推理', scenes: '中国企业推理' },
        { name: '火山引擎', role: '方舟', products: '方舟、豆包 API', tech: '大规模推理', scenes: '内容与消费应用' }
      ] }
    ]
  },

  bench: {
    levels: [
      ['一句话', '评测与基准是 AI 行业的「考试院」：benchmark 分数决定模型排名、采购信任和融资叙事；考纲怎么定，行业就往哪里卷。'],
      ['打个比方', '像高考——分数不能完全代表能力，但没有分数，学校（客户）就不知道怎么选人；考纲（基准）一变，排名就会重排。'],
      ['拆开看', '四类基准：静态题库（MMLU / GPQA）→ 人类偏好竞技场（LMArena）→ 任务基准（SWE-bench / ARC-AGI）→ 安全评测（红队、越狱）；重心从知识记忆走向任务完成。'],
      ['怎么运转', '学术机构维护基准，独立评测机构做第三方横评，厂商把分数写进发布材料；企业采购用评测做验收，监管用评测做准入，评测正在从「参考」变成「门槛」。'],
      ['格局与博弈', '刷榜与数据污染侵蚀公信力，动态基准与私有题库兴起；安全评测成为监管准入的一部分，第三方评测商业化仍在探索，谁都想要一个中立裁判。'],
      ['边界与走向', '评测会从「知识问答」转向「真实任务完成度」与「智能体可靠性」；评测本身会成为 AI 产品的一部分，私有评测集是最诚实的竞争壁垒——你能测出别人测不出的问题。']
    ],
    industries: [
      { name: '学术基准', desc: '方法论公信力的源头，但面临污染与刷榜压力。', companies: [
        { name: 'Stanford HELM', role: '综合评测', products: 'HELM 评测框架', tech: '多维度评测', scenes: '学术与政策研究' },
        { name: 'UC Berkeley（LMArena）', role: '人类偏好', products: 'Chatbot Arena', tech: '众包对战、Elo', scenes: '模型排名' },
        { name: 'Princeton（SWE-bench）', role: '编码任务', products: 'SWE-bench', tech: '真实仓库任务', scenes: '编码 Agent 评测' },
        { name: 'ARC Prize', role: '推理基准', products: 'ARC-AGI', tech: '抽象推理题', scenes: '通用推理评测' },
        { name: 'Epoch AI', role: '趋势研究', products: '模型能力趋势数据库', tech: '数据分析', scenes: '政策与投资研究' }
      ] },
      { name: '第三方评测', desc: '给企业与媒体提供可比较的独立结论。', companies: [
        { name: 'Artificial Analysis', role: '独立横评', products: '智能指数、价格与速度', tech: '标准化测试', scenes: '模型选型' },
        { name: 'LMSYS', role: '竞技场', products: 'Chatbot Arena', tech: '人类偏好', scenes: '模型口碑' },
        { name: '中国信通院', role: '中国标准', products: '大模型评测体系', tech: '标准与测评', scenes: '国内合规与采购' },
        { name: 'OpenCompass', role: '开源评测', products: '评测平台', tech: '多基准集成', scenes: '开源模型对比' },
        { name: 'SuperCLUE', role: '中文评测', products: '中文基准', tech: '中文任务集', scenes: '中文模型排名' }
      ] },
      { name: '安全评测', desc: '红队、越狱与风险评估，是监管准入的前置环节。', companies: [
        { name: 'UK AISI', role: '政府评测', products: '前沿模型评测', tech: '红队与风险评估', scenes: '监管准入' },
        { name: 'NIST', role: '美国标准', products: 'AI 风险管理框架', tech: '标准与评测', scenes: '政策与合规' },
        { name: 'Anthropic', role: '模型安全', products: '安全评估、红队', tech: 'Constitutional AI', scenes: '模型发布前评估' },
        { name: 'OpenAI', role: '安全框架', products: 'Preparedness Framework', tech: '风险分级', scenes: '前沿模型发布' },
        { name: '奇安信', role: '中国安全', products: 'AI 安全评测', tech: '攻防与红队', scenes: '政企合规' }
      ] },
      { name: '企业评测平台', desc: '把评测嵌入开发与生产流程，做持续回归。', companies: [
        { name: 'Scale AI', role: '数据与评测', products: '评测与红队服务', tech: '专家评估', scenes: '模型验收' },
        { name: 'Patronus AI', role: '自动评测', products: '评测平台', tech: '裁判模型', scenes: '企业模型监控' },
        { name: 'Galileo', role: '评测与可观测', products: '评测平台', tech: '指标与回归', scenes: '生产模型质量' },
        { name: 'LangSmith', role: '应用评测', products: '评测与追踪', tech: 'Agent 追踪', scenes: 'LLM 应用开发' },
        { name: 'Braintrust', role: '评测平台', products: '实验与评测', tech: 'A/B 与回归', scenes: '产品迭代' }
      ] }
    ]
  },

  multimodal: {
    levels: [
      ['一句话', '多模态与视频生成让模型同时理解文字、图像、音频和视频，视频生成是当前竞争最激烈的方向；理解先商业化，生成后爆发。'],
      ['打个比方', '像从「只会读字」升级到「能看会听还会画」——输入输出都不再局限于文本，模型开始拥有「感官」，但感官之间还要对齐。'],
      ['拆开看', '五段链路：视觉编码器（ViT）→ 跨模态对齐 → 生成解码器（扩散 / 自回归）→ 时序一致性 → 音画同步；一致性与可控性是工程难点。'],
      ['怎么运转', '模型厂卖 API 与订阅，创作工具按席位或积分收费，版权方收素材授权费；算力成本是主要门槛，视频比文本贵一个量级，时长与分辨率直接决定账单。'],
      ['格局与博弈', 'OpenAI Sora、Google Veo 领先，Runway、Pika、Luma 做垂直工具，中国可灵、Seedance、海螺在本土与海外竞争；Midjourney 代表独立工作室路线，开源模型持续压价。'],
      ['边界与走向', '物理一致性与可控性是下一关，视频生成会从「炫技」走向广告、影视与电商的工业化生产；多模态理解会先于生成完成商业化，版权与内容溯源会成为商用前提。']
    ],
    industries: [
      { name: '视频生成模型', desc: '从文本/图片生成视频，竞争最激烈的模型赛道。', companies: [
        { name: 'OpenAI', role: '旗舰模型', products: 'Sora', tech: '扩散 Transformer、世界模拟', scenes: '广告、影视预演' },
        { name: 'Google DeepMind', role: '旗舰模型', products: 'Veo', tech: '视频扩散、音画同步', scenes: '创作工具、云服务' },
        { name: 'Runway', role: '垂直工具', products: 'Gen 系列、视频编辑', tech: '视频生成与编辑', scenes: '影视与广告' },
        { name: 'Pika', role: '轻量创作', products: '视频生成工具', tech: '快速生成', scenes: '社交内容' },
        { name: 'Luma', role: '3D 与视频', products: 'Dream Machine', tech: '3D 生成、视频', scenes: '创意与电商' },
        { name: '快手可灵', role: '中国视频', products: '可灵 AI', tech: '视频生成、运动控制', scenes: '短视频与广告' },
        { name: '字节 Seedance', role: '中国视频', products: 'Seedance', tech: '多模态生成', scenes: '即梦、内容平台' },
        { name: 'MiniMax', role: '中国视频', products: '海螺 AI', tech: '视频与语音生成', scenes: '内容创作' }
      ] },
      { name: '图像生成', desc: '从文本生成图像，设计与营销的核心工具。', companies: [
        { name: 'Midjourney', role: '独立头部', products: 'Midjourney', tech: '美学优化、风格控制', scenes: '设计、插画' },
        { name: 'Black Forest Labs', role: '开源模型', products: 'FLUX', tech: '流匹配、开源权重', scenes: '开发者与工具集成' },
        { name: 'Stability AI', role: '开源模型', products: 'Stable Diffusion', tech: '扩散模型、社区生态', scenes: '开源图像生成' },
        { name: 'Adobe', role: '工作流集成', products: 'Firefly、Photoshop', tech: '生成式填充、版权安全', scenes: '商业设计' },
        { name: '字节即梦', role: '中国图像', products: '即梦 AI', tech: '图像与视频生成', scenes: '内容创作' }
      ] },
      { name: '创作工具', desc: '把生成能力嵌入设计与视频工作流。', companies: [
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

  speech: {
    levels: [
      ['一句话', '语音与音频模型让机器能听、能说、能唱：语音识别、实时语音对话和音乐生成是三条主线；语音是 agent 最自然的交互层。'],
      ['打个比方', '像给 AI 装上「耳朵和嘴巴」——不仅要听懂，还要说得像人、接得上话；延迟超过一秒，对话感就消失了。'],
      ['拆开看', '五段链路：ASR（识别）→ LLM（理解）→ TTS（合成）→ 全双工对话（打断、抢话）→ 音乐与音效生成；延迟、情感表现力与打断处理是关键指标，抢话与接话是最难的全双工工程点。'],
      ['怎么运转', 'API 按字符或分钟计费，语音助手订阅，音乐生成按订阅与版权分成；企业客服与呼叫中心是最成熟的变现场景，按坐席替代量算 ROI，音乐生成的版权谈判决定毛利上限。'],
      ['格局与博弈', 'ElevenLabs 在 TTS 领先，OpenAI 实时语音绑定 ChatGPT，科大讯飞在中国政企市场占优，Suno、Udio 重塑音乐创作；语音 agent 平台（Retell、Vapi）快速崛起。'],
      ['边界与走向', '全双工与低延迟是下一战，声音克隆的伦理与版权监管会收紧；语音会成为智能体的默认交互层，硬件（耳机 / 眼镜 / 玩具）是新的分发入口。']
    ],
    industries: [
      { name: '语音合成与克隆', desc: '把文字变成自然语音，情感与延迟是核心指标。', companies: [
        { name: 'ElevenLabs', role: 'TTS 领先', products: '语音合成、声音克隆、配音', tech: '情感 TTS、多语种', scenes: '有声书、客服、视频配音' },
        { name: 'OpenAI', role: '实时语音', products: 'Realtime API、TTS', tech: '全双工语音模型', scenes: 'ChatGPT 语音、Agent' },
        { name: '科大讯飞', role: '中国语音龙头', products: '语音合成、星火语音', tech: '中文 TTS、方言', scenes: '政企、教育、客服' },
        { name: '字节豆包语音', role: '中国语音', products: '豆包语音、TTS API', tech: '低延迟合成', scenes: '内容与硬件' },
        { name: '阿里通义语音', role: '中国语音', products: 'CosyVoice、语音 API', tech: '多语种 TTS', scenes: '云服务与客服' },
        { name: 'Cartesia', role: '低延迟语音', products: 'Sonic TTS', tech: '状态空间模型', scenes: '实时语音 Agent' }
      ] },
      { name: '语音识别与对话', desc: '把语音转成文字并理解意图，客服与会议的主战场。', companies: [
        { name: 'Deepgram', role: 'ASR API', products: '语音识别、理解', tech: '端到端 ASR', scenes: '客服、会议转写' },
        { name: 'AssemblyAI', role: 'ASR API', products: '转写、音频理解', tech: '语音模型', scenes: '内容与客服' },
        { name: '科大讯飞', role: '中国 ASR', products: '语音识别、会议系统', tech: '中文识别、降噪', scenes: '政企与教育' },
        { name: '腾讯云', role: '中国 ASR', products: '语音识别、实时对话', tech: '声学模型', scenes: '客服与社交' },
        { name: '微软', role: '企业语音', products: 'Azure Speech', tech: 'ASR/TTS', scenes: '企业客服与会议' }
      ] },
      { name: '音乐生成', desc: '从文本生成歌曲与配乐，版权争议的中心。', companies: [
        { name: 'Suno', role: '音乐生成头部', products: 'Suno v4', tech: '歌曲生成、人声合成', scenes: '创作、短视频配乐' },
        { name: 'Udio', role: '音乐生成', products: 'Udio', tech: '高保真音乐生成', scenes: '音乐创作' },
        { name: '网易天音', role: '中国音乐 AI', products: '天音、编曲工具', tech: '音乐生成', scenes: '网易云生态' },
        { name: '腾讯音乐', role: '平台 + AI', products: 'AI 作曲、推荐', tech: '音乐理解与生成', scenes: '流媒体平台' },
        { name: '昆仑万维', role: '中国 AI 音乐', products: '天工 SkyMusic', tech: '音乐生成', scenes: '内容创作' }
      ] },
      { name: '语音应用与硬件', desc: '把语音能力嵌入客服、内容与终端设备。', companies: [
        { name: 'Intercom', role: 'AI 客服', products: 'Fin AI Agent', tech: '对话式客服', scenes: '企业客服' },
        { name: 'Sierra', role: 'AI 客服', products: '对话 Agent', tech: '任务型对话', scenes: '品牌客服' },
        { name: 'Audible', role: '有声书', products: 'AI 旁白', tech: 'TTS 配音', scenes: '有声内容' },
        { name: 'Apple', role: '终端语音', products: 'Siri、AirPods', tech: '端侧语音', scenes: '手机与耳机' },
        { name: '小米', role: '中国终端', products: '小爱同学、音箱', tech: '语音助手', scenes: '智能家居' }
      ] }
    ]
  },

  worldmodel: {
    levels: [
      ['一句话', '世界模型让 AI 在内部模拟物理世界：预测动作的后果，是具身智能与自动驾驶的前置能力；它让 agent 在虚拟里犯错、在现实里少犯错。'],
      ['打个比方', '像大脑里的沙盘——不用真的撞车，也能预演「如果打方向盘会发生什么」；沙盘越准，试错成本越低，但沙盘失真比没有沙盘更危险。'],
      ['拆开看', '五段链路：视频 / 3D 表征 → 动力学预测 → 动作条件生成 → 仿真环境 → 与机器人策略闭环；物理一致性与长时预测是难点。'],
      ['怎么运转', '目前主要是 lab 研究项目，商业化路径包括仿真平台、自动驾驶训练和游戏 / 影视内容生成；数据来自真实采集与合成仿真，算力消耗极大。'],
      ['格局与博弈', 'Google DeepMind Genie 领先，NVIDIA Cosmos 做开放平台，World Labs 做空间智能，车企与机器人公司自建仿真；开源世界模型开始出现，但物理精度仍差得远。'],
      ['边界与走向', '物理规律的可验证性尚未解决，世界模型短期内更像「高级仿真器」；长期是通往 AGI 与具身的关键拼图，也是合成数据的发动机——谁能低成本造出可信环境，谁就掌握训练数据。']
    ],
    industries: [
      { name: '前沿 lab', desc: '探索可交互世界模型的研究先锋。', companies: [
        { name: 'Google DeepMind', role: 'Genie 领先', products: 'Genie、Veo', tech: '可交互世界生成', scenes: '游戏、机器人训练' },
        { name: 'World Labs', role: '空间智能', products: '3D 世界生成', tech: '空间表征、生成', scenes: '内容与仿真' },
        { name: 'NVIDIA', role: '开放平台', products: 'Cosmos、Omniverse', tech: '世界基础模型、物理仿真', scenes: '自动驾驶、机器人' },
        { name: 'OpenAI', role: '视频世界模拟', products: 'Sora', tech: '视频生成、世界模拟', scenes: '内容与训练' },
        { name: 'Meta', role: '研究', products: 'V-JEPA', tech: '联合嵌入预测', scenes: '机器人学习' }
      ] },
      { name: '自动驾驶仿真', desc: '用世界模型生成极端场景，降低路测成本。', companies: [
        { name: 'Waymo', role: '自动驾驶', products: 'Waymo Driver', tech: '仿真与真实路测', scenes: 'Robotaxi' },
        { name: 'Tesla', role: '端到端', products: 'FSD、Dojo', tech: '视频世界模型', scenes: '自动驾驶' },
        { name: 'Wayve', role: '端到端驾驶', products: 'GAIA', tech: '世界模型、端到端', scenes: '辅助驾驶' },
        { name: '小鹏', role: '中国车企', products: 'XNGP', tech: '端到端与仿真', scenes: '智能驾驶' },
        { name: '51WORLD', role: '仿真平台', products: '数字孪生仿真', tech: '城市与交通仿真', scenes: '自动驾驶测试' }
      ] },
      { name: '机器人与具身', desc: '用世界模型做策略学习与仿真训练。', companies: [
        { name: 'Physical Intelligence', role: '通用机器人模型', products: 'π 系列 VLA', tech: 'VLA、世界模型', scenes: '通用机器人' },
        { name: 'Skild AI', role: '机器人基础模型', products: 'Skild Brain', tech: '可扩展机器人模型', scenes: '多形态机器人' },
        { name: '宇树科技', role: '本体 + 算法', products: '人形与四足', tech: '运动控制、仿真训练', scenes: '巡检、科研' },
        { name: '智元机器人', role: '具身智能', products: '远征系列', tech: 'VLA、数据闭环', scenes: '工厂与服务' },
        { name: '傅利叶', role: '康复与人形', products: 'GR 系列', tech: '力控、仿真', scenes: '医疗与科研' }
      ] },
      { name: '3D 与空间内容', desc: '把真实世界数字化，为世界模型提供场景与资产。', companies: [
        { name: '群核科技', role: '空间智能', products: '酷家乐、空间数据', tech: '3D 重建、仿真', scenes: '家居、机器人训练' },
        { name: 'Unity', role: '实时 3D', products: 'Unity 引擎', tech: '实时渲染、物理', scenes: '游戏与仿真' },
        { name: 'Unreal（Epic）', role: '高保真引擎', products: 'Unreal Engine', tech: '真实感渲染', scenes: '影视、汽车' },
        { name: 'NVIDIA', role: '仿真平台', products: 'Omniverse', tech: '物理仿真、数字孪生', scenes: '工业与机器人' }
      ] }
    ]
  },

  token: {
    levels: [
      ['一句话', '模型定价与 token 经济决定智能的价格：每百万 token 多少钱，直接决定模型公司怎么赚钱、应用公司能不能活；它是 AI 产业的「利率」。'],
      ['打个比方', '像水电按度计价——单价下降会刺激用量爆发，但也会压垮没有成本优势的供应商；价格战打的是成本曲线，不是勇气。'],
      ['拆开看', '五段链路：输入 / 输出定价 → 缓存与批量折扣 → 推理成本（算力 + 电力 + 折旧）→ 毛利结构 → 每任务成本；输出 token 通常比输入贵数倍。'],
      ['怎么运转', '旗舰模型高价锚定品牌，快速档降价抢量；API 价格战此起彼伏，企业合同按用量阶梯定价，缓存命中率直接影响账单，批处理能把成本再压一半。'],
      ['格局与博弈', '头部 lab 用规模摊薄成本，开源模型压低价格天花板，云厂商用捆绑折扣抢客户；中国市场价格战更激进，免费额度成为获客手段，长期靠生态与增值服务回收。'],
      ['边界与走向', '定价会从「按 token」转向「按任务 / 按结果」，推理成本下降会让更多场景跨过经济性阈值；毛利会向调度效率与分发环节迁移，单纯卖 token 的中间商会被挤掉。']
    ],
    industries: [
      { name: '模型 API 供给', desc: '按 token 卖智能，价格与能力共同决定份额。', companies: [
        { name: 'OpenAI', role: '价格锚', products: 'GPT 系列 API', tech: '推理时计算、缓存折扣', scenes: '开发者与企业' },
        { name: 'Anthropic', role: '企业 API', products: 'Claude API、Claude Code', tech: '长上下文、编码', scenes: '企业与开发者' },
        { name: 'Google', role: '云捆绑', products: 'Gemini API、Vertex AI', tech: 'TPU 成本优势', scenes: '云客户' },
        { name: 'DeepSeek', role: '价格破坏者', products: 'DeepSeek API', tech: '高效推理、开源', scenes: '价格敏感市场' },
        { name: '阿里云', role: '中国云 API', products: '通义 API、百炼', tech: '规模推理', scenes: '中国企业' },
        { name: '智谱', role: '中国 API', products: 'GLM API', tech: '中英双语', scenes: '政企与开发者' }
      ] },
      { name: '推理与托管', desc: '在模型与客户之间赚取推理差价。', companies: [
        { name: 'Together AI', role: '开源托管', products: '模型 API、微调', tech: '分布式推理', scenes: '开源模型商用' },
        { name: 'Fireworks AI', role: '推理服务', products: '模型 API', tech: '高吞吐', scenes: '生产应用' },
        { name: 'Groq', role: '低延迟', products: 'LPU 推理云', tech: '确定性执行', scenes: '实时应用' },
        { name: '硅基流动', role: '中国推理云', products: '模型 API', tech: '国产芯片适配', scenes: '中国企业' },
        { name: 'OpenRouter', role: '模型路由', products: '多模型 API 聚合', tech: '路由与计费', scenes: '开发者选型' }
      ] },
      { name: '成本与价格追踪', desc: '把价格与性能做成可比数据，影响采购决策。', companies: [
        { name: 'Artificial Analysis', role: '独立横评', products: '价格/速度/智能指数', tech: '标准化测试', scenes: '模型选型' },
        { name: 'Epoch AI', role: '趋势研究', products: '成本与能力趋势', tech: '数据分析', scenes: '投资与政策' },
        { name: 'SemiAnalysis', role: '半导体研究', products: '算力成本分析', tech: '供应链研究', scenes: '算力投资' },
        { name: 'OpenRouter', role: '价格透明', products: '多模型价格对比', tech: '路由数据', scenes: '开发者采购' }
      ] },
      { name: '企业采购与 FinOps', desc: '把 token 成本纳入企业预算与治理。', companies: [
        { name: 'AWS', role: '云采购', products: 'Bedrock、预算工具', tech: '用量治理', scenes: '企业 AI 预算' },
        { name: 'Microsoft Azure', role: '云采购', products: 'Azure AI、成本管理', tech: '配额与账单', scenes: '企业 AI 治理' },
        { name: 'Google Cloud', role: '云采购', products: 'Vertex AI、预算', tech: '成本分析', scenes: '企业 AI 治理' },
        { name: 'Datadog', role: '可观测', products: 'LLM 用量监控', tech: '成本归因', scenes: '生产环境治理' }
      ] }
    ]
  }

});
