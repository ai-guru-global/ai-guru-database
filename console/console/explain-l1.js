/* L1 算力与硬件层：节点六层解释 + 行业与企业版图（手工策展，口径见 explain.js 头注释）。 */
Object.assign(DB.explain, {
  gpu: {
    levels: [
      ['一句话', 'GPU 与 AI 加速卡是 AI 的算力发动机：用成千上万个并行计算核心同时做矩阵乘加，训练和运行大模型都靠它把参数从数据里「算」出来。'],
      ['打个比方', '像把「一位老师挨个讲题」改成「几百位助教同时批改同一类题」——单个人不一定更快，但同一时间能处理的题量高出一个数量级；GPU 就是那间大教室。'],
      ['拆开看', '一颗加速卡 = 计算单元（SM / Tensor Core）+ 高带宽显存（HBM）+ 片间与机间互连（NVLink / PCIe / InfiniBand）+ 软件栈（CUDA / ROCm）；再往上拼成八卡服务器、整机柜，最后连成万卡集群。'],
      ['怎么运转', '芯片厂卖卡与整机柜，云厂商买卡按卡时或 token 出租，模型公司用算力换能力、再把能力按 token 卖出去；成本沿「制程—封装—HBM—电力」逐层传导，利用率决定每一层能否赚钱，整机柜交付能力决定扩产速度。'],
      ['格局与博弈', '英伟达用 CUDA 生态、NVLink 与整机柜方案锁定高端训练；AMD 以开放软件栈（ROCm）追第二极；云厂商自研 ASIC 分流推理负载；中国厂商在出口管制下做国产替代，差距主要在软件生态与先进封装产能。'],
      ['边界与走向', '单卡性能提升放缓，竞争转向系统级（机柜 + 网络 + 供电）与软件生态；推理占比上升会把价值从「卖卡」推向「卖单位 token 成本」，通用 GPU 与专用 ASIC 将长期分层共存，同样的芯片靠系统优化能多跑出三成有效算力。']
    ],
    industries: [
      { name: 'AI 加速卡制造（供给）', desc: '决定算力供给曲线的一层，按卡或整机柜交付。', companies: [
        { name: 'NVIDIA', role: '全球龙头', products: 'Blackwell B200/GB200、H100/H200、NVLink 机柜', tech: 'CUDA、Tensor Core、NVLink/InfiniBand、TensorRT', scenes: '云训练集群、推理服务、科研超算' },
        { name: 'AMD', role: '第二极', products: 'Instinct MI300X/MI350、EPYC 服务器 CPU', tech: 'ROCm、Chiplet、Infinity Fabric', scenes: '云推理、HPC、性价比训练' },
        { name: 'Intel', role: '追赶者', products: 'Gaudi 3、Max 系列 GPU、Xeon', tech: 'oneAPI、Habana 架构', scenes: '企业推理、私有云' },
        { name: '摩尔线程', role: '国产替代', products: 'MTT S 系列 GPU、夸娥智算集群', tech: 'MUSA 架构、CUDA 兼容层', scenes: '国产智算中心、图形与推理' },
        { name: '壁仞科技', role: '国产训练', products: 'BR100 系列', tech: '自研 GPGPU 架构、Chiplet', scenes: '智算中心训练' },
        { name: '沐曦', role: '国产推理', products: '曦云 C 系列', tech: 'GPGPU、兼容 CUDA 生态', scenes: '政企推理、智算中心' }
      ] },
      { name: '云算力与租赁（需求）', desc: '把卡变成可租用的算力，按卡时或 token 变现。', companies: [
        { name: 'AWS', role: '综合云', products: 'EC2 GPU 实例、Trainium、Bedrock', tech: '自研芯片、Nitro 虚拟化', scenes: '模型训练、推理托管' },
        { name: 'Microsoft Azure', role: '综合云', products: 'ND/NC 系列 GPU 实例、Azure AI', tech: 'InfiniBand 组网、Maia', scenes: 'OpenAI 训练、企业 AI' },
        { name: 'Google Cloud', role: '综合云', products: 'A3/A4 GPU 实例、TPU、Vertex AI', tech: 'TPU、液冷、Jupiter 网络', scenes: 'Gemini 训练、推理' },
        { name: 'CoreWeave', role: 'GPU 专项云', products: 'GPU 裸金属与集群租赁', tech: 'Kubernetes、InfiniBand 组网', scenes: 'AI 原生公司训练' },
        { name: '阿里云', role: '中国综合云', products: '灵骏智算集群、ECS GPU 实例', tech: '自研网络、磐久服务器', scenes: '通义训练、企业推理' },
        { name: '火山引擎', role: '中国综合云', products: 'GPU 云、火山方舟', tech: '大规模调度、字节内部验证', scenes: '豆包训练、模型 API' }
      ] },
      { name: '模型研发（需求）', desc: '算力最大的买方，训练与推理需求决定芯片景气度。', companies: [
        { name: 'OpenAI', role: '前沿 lab', products: 'GPT 系列、ChatGPT', tech: '大规模预训练、推理时计算', scenes: '旗舰训练、消费与 API' },
        { name: 'Anthropic', role: '前沿 lab', products: 'Claude 系列、Claude Code', tech: '后训练与对齐、编码 Agent', scenes: '企业 API、编码工具' },
        { name: 'Google DeepMind', role: '前沿 lab', products: 'Gemini、Veo、Genie', tech: 'TPU 原生训练、多模态', scenes: '搜索与云、机器人研究' },
        { name: 'Meta', role: '开源阵营', products: 'Llama、Meta AI', tech: '大规模集群、开源权重', scenes: '社交分发、开源生态' },
        { name: 'DeepSeek', role: '中国 lab', products: 'DeepSeek 系列开源模型', tech: '高效训练、推理优化', scenes: '开源 API、行业部署' },
        { name: '字节 Seed', role: '中国 lab', products: '豆包、Seedance', tech: '多模态、大规模训练', scenes: '消费应用、内容生成' }
      ] },
      { name: '系统集成与整机柜', desc: '把芯片、网络与液冷装成可交付的集群。', companies: [
        { name: 'Dell', role: '服务器集成', products: 'PowerEdge XE 系列、AI Factory', tech: '整机柜交付、液冷', scenes: '企业私有 AI 集群' },
        { name: 'HPE', role: '服务器集成', products: 'ProLiant、Cray 超算', tech: '液冷、HPC 互联', scenes: '超算与政企集群' },
        { name: 'Supermicro', role: '服务器集成', products: 'GPU 服务器、整机柜', tech: '快速迭代、液冷方案', scenes: 'AI 云与实验室' },
        { name: '浪潮信息', role: '中国服务器龙头', products: 'NF/元脑系列、AI 服务器', tech: '整机柜、液冷', scenes: '中国智算中心' },
        { name: '联想', role: '中国服务器', products: 'ThinkSystem、问天', tech: '海王星液冷', scenes: '企业 AI、超算' },
        { name: '新华三', role: '中国 ICT', products: 'UniServer、傲飞算力平台', tech: '网络 + 计算一体交付', scenes: '政企智算' }
      ] }
    ]
  },

  asic: {
    levels: [
      ['一句话', '自研 ASIC 与 TPU 是为特定 AI 负载定制的芯片：砍掉通用电路与冗余功能，用更低的成本与功耗换更高的有效吞吐。'],
      ['打个比方', 'GPU 像全能运动员，ASIC 像为某一个项目定制的器械——只练一件事，但把这件事做到极致；代价是换项目就得重做器械。'],
      ['拆开看', '矩阵计算单元（MXU / 脉动阵列）+ 片上缓存与 HBM + 片间互连 + 编译器与框架（XLA / Neuron / CANN）；硬件与「它只服务的那类模型」深度绑定。'],
      ['怎么运转', '云厂商用自研芯片承接内部训练与推理，省下 GPU 溢价；部分对外开放租用；芯片团队与业务负载团队深度绑定，编译器把模型图翻译成专用指令，软件适配的投入往往超过硬件本身。'],
      ['格局与博弈', '谷歌 TPU 最成熟（Gemini 全栈自用），AWS Trainium 追赶，Meta MTIA 服务推荐与推理，微软 Maia 起步；中国以昇腾为核心，寒武纪、燧原补位；生态迁移成本是最大门槛。'],
      ['边界与走向', '胜负取决于「负载规模 × 软件成熟度」：负载越大、模型越稳定，专用化越划算；推理成为主负载后性价比优势放大，但通用性短板限制其对外销售，长期形成「通用 GPU + 云自研 ASIC」的双轨格局。']
    ],
    industries: [
      { name: '云厂商自研芯片', desc: '用自研芯片对冲 GPU 供给与成本，主要服务内部负载。', companies: [
        { name: 'Google', role: 'TPU 先行者', products: 'TPU v5/v6、Vertex AI', tech: 'XLA 编译器、液冷集群', scenes: 'Gemini 训练、对外租用' },
        { name: 'AWS', role: '云自研', products: 'Trainium、Inferentia、Neuron SDK', tech: '训练与推理双线、UltraCluster', scenes: 'Bedrock、内部训练' },
        { name: 'Meta', role: '推荐负载', products: 'MTIA 系列', tech: 'PyTorch 深度集成', scenes: '推荐排序、推理' },
        { name: 'Microsoft', role: '起步追赶', products: 'Maia 系列', tech: '与 Azure 深度耦合', scenes: 'Azure 内部推理' },
        { name: 'OpenAI', role: '自研传闻', products: '与博通合作定制芯片', tech: '推理专用、与模型协同设计', scenes: '降低推理成本' }
      ] },
      { name: '国产替代', desc: '出口管制下的第二条供给曲线，生态成熟度决定差距。', companies: [
        { name: '华为昇腾', role: '国产核心', products: '昇腾 910B/910C、Atlas 集群', tech: 'CANN、达芬奇架构', scenes: '国产训练、智算中心' },
        { name: '寒武纪', role: '云端 ASIC', products: '思元 590/690', tech: 'Cambricon SDK、MLU 架构', scenes: '云端推理、智算中心' },
        { name: '燧原科技', role: '训练与推理', products: '邃思系列、云燧', tech: '驭算软件栈', scenes: '智算中心、政企' },
        { name: '海光信息', role: 'CPU+DCU', products: '深算 DCU、海光 CPU', tech: 'ROCm 兼容、x86 生态', scenes: '科学计算、政企云' },
        { name: '天数智芯', role: '通用 GPU', products: '天垓、智铠系列', tech: '自研架构、兼容主流框架', scenes: '训练与推理' }
      ] },
      { name: '定制芯片设计与 IP', desc: '为云厂商与 AI 公司提供 ASIC 设计、IP 与先进封装。', companies: [
        { name: 'Broadcom（博通）', role: '定制 ASIC 龙头', products: '云厂定制芯片、Tomahawk 交换芯片', tech: 'SerDes、先进封装、网络 IP', scenes: '超大规模云定制' },
        { name: 'Marvell', role: '定制与互连', products: '定制 ASIC、光互连芯片', tech: '高速 SerDes、Chiplet', scenes: '数据中心定制' },
        { name: '世芯电子', role: '设计服务', products: 'ASIC 设计服务', tech: '先进制程实现', scenes: 'AI 芯片量产' },
        { name: 'Arm', role: 'IP 授权', products: 'CPU/NPU IP、Ethos', tech: 'IP 授权与生态', scenes: '端侧与云芯片' }
      ] },
      { name: '编译器与软件生态', desc: '决定自研芯片能否被模型团队用起来的隐形战场。', companies: [
        { name: 'Google', role: 'XLA 生态', products: 'XLA、JAX', tech: '图编译、算子融合', scenes: 'TPU 模型迁移' },
        { name: 'AWS', role: 'Neuron 生态', products: 'Neuron SDK', tech: '训练与推理编译器', scenes: 'Trainium 适配' },
        { name: '华为', role: 'CANN 生态', products: 'CANN、MindSpore', tech: '昇腾算子库与图引擎', scenes: '国产模型迁移' },
        { name: '寒武纪', role: 'BANG 生态', products: 'BANG 编译器', tech: '算子开发与调优', scenes: '思元芯片适配' }
      ] }
    ]
  },

  fab: {
    levels: [
      ['一句话', '先进制程与代工把芯片设计变成硅片：制程越先进、封装越强，同样面积的芯片能塞进更多晶体管与算力，良率则决定它贵不贵。'],
      ['打个比方', '像印刷厂——设计公司给菲林，代工厂决定你能印多细、良率多高、多久交货；印得越细设备越贵，能接单的厂也越少。'],
      ['拆开看', '五段链路：光刻（EUV / DUV）+ 刻蚀与沉积 + 离子注入 + 先进封装（CoWoS / SoIC）+ 良率与产能管理；每一环都是百亿到千亿级资本开支。'],
      ['怎么运转', '按晶圆计价，先进制程溢价高；苹果、英伟达、AMD 等大客户提前锁定产能；设备与材料商在上游分走利润，代工厂赚的是利用率与良率的钱，扩产速度则受设备交付周期约束。'],
      ['格局与博弈', '台积电一家独大（3nm / 2nm + CoWoS 封装），三星追赶但良率承压，英特尔代工转型；中芯国际受设备管制约束，聚焦成熟制程与国产替代；设备端 ASML 垄断 EUV。'],
      ['边界与走向', '制程微缩逼近物理与经济极限，价值向先进封装、芯粒（Chiplet）与设备材料转移；地缘管制把全球产能切成多个阵营，「在哪制造」会像「用什么制程」一样重要。']
    ],
    industries: [
      { name: '晶圆代工', desc: '芯片制造的产能与良率瓶颈，先进制程高度集中。', companies: [
        { name: 'TSMC（台积电）', role: '全球龙头', products: '3nm/2nm 代工、CoWoS 封装', tech: 'EUV、先进封装、良率管理', scenes: 'AI 芯片、手机 SoC' },
        { name: 'Samsung Foundry', role: '第二极', products: '3nm GAA 代工', tech: 'GAA 晶体管、存储协同', scenes: '自研 Exynos、外部客户' },
        { name: 'Intel Foundry', role: '转型追赶', products: '18A/14A 代工', tech: 'RibbonFET、PowerVia', scenes: '美国本土制造' },
        { name: '中芯国际', role: '中国龙头', products: '成熟制程与先进制程代工', tech: 'DUV 多重曝光', scenes: '国产芯片制造' },
        { name: '华虹半导体', role: '特色工艺', products: '成熟制程、功率器件', tech: '特色工艺平台', scenes: '汽车与工业芯片' }
      ] },
      { name: '半导体设备', desc: '制程能力的上游决定者，EUV 是最硬的卡点。', companies: [
        { name: 'ASML', role: '光刻垄断', products: 'EUV/DUV 光刻机', tech: '极紫外光刻、光学系统', scenes: '先进制程扩产' },
        { name: 'Applied Materials', role: '设备平台', products: '沉积、刻蚀、离子注入', tech: '材料工程', scenes: '晶圆厂建设' },
        { name: 'Lam Research', role: '刻蚀龙头', products: '刻蚀与沉积设备', tech: '高深宽比刻蚀', scenes: '3D NAND、先进逻辑' },
        { name: 'KLA', role: '检测量测', products: '缺陷检测、量测设备', tech: '光学与电子束检测', scenes: '良率提升' },
        { name: '北方华创', role: '国产设备', products: '刻蚀、沉积、清洗设备', tech: '成熟制程全覆盖', scenes: '国产晶圆厂' },
        { name: '中微公司', role: '国产刻蚀', products: '刻蚀设备、MOCVD', tech: '等离子刻蚀', scenes: '先进制程与 LED' }
      ] },
      { name: '先进封装', desc: '把 GPU 与 HBM 装到一起，成为算力供给的新瓶颈。', companies: [
        { name: 'TSMC', role: 'CoWoS 主导', products: 'CoWoS、SoIC、InFO', tech: '2.5D/3D 封装', scenes: 'AI 加速卡封装' },
        { name: 'Amkor', role: '封测龙头', products: '先进封装与测试', tech: 'Flip-chip、SiP', scenes: '手机与数据中心' },
        { name: '日月光', role: '封测龙头', products: '先进封装、测试', tech: 'Fan-out、SiP', scenes: '芯片量产' },
        { name: '长电科技', role: '中国封测', products: '先进封装、测试', tech: '2.5D/3D、Chiplet', scenes: '国产芯片封装' },
        { name: '通富微电', role: '中国封测', products: 'CPU/GPU 封装测试', tech: 'Chiplet、2.5D', scenes: 'AMD 等客户' }
      ] },
      { name: 'EDA 与 IP', desc: '芯片设计的软件入口，生态锁定极强。', companies: [
        { name: 'Synopsys', role: 'EDA 龙头', products: '设计工具、IP', tech: '全流程 EDA、AI 辅助设计', scenes: '芯片设计' },
        { name: 'Cadence', role: 'EDA 龙头', products: '设计工具、仿真', tech: '数字/模拟全流程', scenes: '芯片与系统设计' },
        { name: 'Siemens EDA', role: 'EDA 三强', products: 'Calibre、PCB 工具', tech: '验证与制造签核', scenes: '晶圆厂签核' },
        { name: 'Arm', role: 'IP 授权', products: 'CPU/NPU IP', tech: '指令集与微架构', scenes: '手机、云、汽车' }
      ] }
    ]
  },

  equip: {
    levels: [
      ['一句话', '半导体设备与材料是芯片厂的「机床与面粉」：光刻、沉积、刻蚀、量测设备决定能做多细，材料决定良率；EUV 是其中最硬的单点卡口。'],
      ['打个比方', '像盖楼用的塔吊与水泥——设计图画得再好，没有塔吊就砌不高；而且最高级的塔吊只有一家厂会造，交货还要排队两年。'],
      ['拆开看', '四段链条：光刻（ASML 在 EUV 一家垄断）→ 沉积与刻蚀（AMAT/Lam/TEL）→ 量测与检测（KLA）→ 材料与零部件（光刻胶、硅片、精密部件）；设备商赚整机，装机后再赚服务与耗材。'],
      ['怎么运转', '晶圆厂提前两年下订单锁定产能，设备商按出货确认收入；装机后的服务合同与升级是高毛利长尾；国产设备在成熟制程替代，先进制程受出口管制约束。'],
      ['格局与博弈', 'ASML 垄断 EUV，AMAT、Lam、TEL、KLA 四强分食其余环节，日本在材料与零部件占优；北方华创、中微公司在国产替代里成长，管制清单让「能卖什么」本身成为地缘筹码。'],
      ['边界与走向', '设备订单是扩产的先行指标，领先产能约两年；光刻向 High-NA EUV 演进，国产设备从成熟制程向先进封装与量测渗透，服务与耗材的经常性收入占比会持续上升。']
    ],
    industries: [
      { name: '光刻与核心整机', desc: '把电路图形转移到硅片上，EUV 是全行业最硬的单点。', companies: [
        { name: 'ASML', role: 'EUV 垄断', products: 'EUV/DUV 光刻机、High-NA', tech: '极紫外光学、双工件台', scenes: '先进制程量产' },
        { name: 'Nikon', role: 'DUV 二供', products: 'ArFi 光刻机', tech: '液浸光刻', scenes: '成熟制程' },
        { name: 'Canon', role: '纳米压印', products: 'NIL 设备、i 线机', tech: '纳米压印光刻', scenes: '特色工艺' },
        { name: '上海微电子', role: '国产光刻', products: 'SSA/600 系列封装光刻', tech: '前道光刻攻关', scenes: '国产替代' }
      ] },
      { name: '沉积、刻蚀与注入', desc: '一层层长出材料、刻出图形，设备台数最多。', companies: [
        { name: 'Applied Materials', role: '平台型龙头', products: '沉积、刻蚀、离子注入', tech: '材料工程解决方案', scenes: '全流程覆盖' },
        { name: 'Lam Research', role: '刻蚀龙头', products: '高深宽比刻蚀、沉积', tech: '等离子刻蚀', scenes: '3D NAND、先进逻辑' },
        { name: '东京电子', role: '日系平台', products: '涂胶显影、刻蚀、沉积', tech: '前道全工序', scenes: '逻辑与存储' },
        { name: '北方华创', role: '国产平台', products: '刻蚀、沉积、清洗、炉管', tech: '成熟制程全覆盖', scenes: '国产晶圆厂' },
        { name: '中微公司', role: '国产刻蚀', products: 'CCP/ICP 刻蚀、MOCVD', tech: '等离子刻蚀', scenes: '先进制程与 LED' }
      ] },
      { name: '量测与检测', desc: '良率的眼睛：没有量测就没有良率爬坡。', companies: [
        { name: 'KLA', role: '量测垄断', products: '光学/电子束缺陷检测', tech: '检测与量测算法', scenes: '良率提升' },
        { name: 'Onto Innovation', role: '专业量测', products: '图形晶圆检测', tech: '光学量测', scenes: '先进封装量测' },
        { name: '中科飞测', role: '国产量测', products: '膜厚、三维形貌量测', tech: '光学检测', scenes: '国产产线' },
        { name: '精测电子', role: '国产检测', products: '半导体检测设备', tech: '电子束与光学', scenes: '面板与半导体' }
      ] },
      { name: 'EDA 与 IP', desc: '设计侧的入口工具与授权生态，与设备同属「卖铲人」。', companies: [
        { name: 'Synopsys', role: 'EDA 龙头', products: '全流程 EDA、接口 IP', tech: 'AI 辅助设计（DSO）', scenes: '芯片设计' },
        { name: 'Cadence', role: 'EDA 第二', products: '数字/模拟全流程、仿真', tech: '多物理场仿真', scenes: '芯片与系统设计' },
        { name: 'Siemens EDA', role: 'EDA 第三', products: 'Calibre 签核、PCB', tech: '制造签核', scenes: '晶圆厂与封装' },
        { name: 'Arm', role: 'IP 授权', products: 'CPU/NPU/互连 IP', tech: '指令集与子系统', scenes: '手机、云、汽车' },
        { name: '华大九天', role: '国产 EDA', products: '模拟全流程工具', tech: '仿真与版图', scenes: '国产设计' }
      ] },
      { name: '材料与零部件', desc: '良率的隐形决定者，日本厂商占主导。', companies: [
        { name: '信越化学', role: '硅片龙头', products: '硅片、光刻胶', tech: '高纯度材料', scenes: '全行业' },
        { name: 'JSR', role: '光刻胶', products: 'EUV/ArF 光刻胶', tech: '感光材料', scenes: '先进制程' },
        { name: '京瓷', role: '精密零部件', products: '陶瓷部件、腔体', tech: '精密陶瓷', scenes: '设备供应链' },
        { name: '江丰电子', role: '国产靶材', products: '溅射靶材', tech: '超高纯金属', scenes: '国产产线' },
        { name: '富创精密', role: '国产零部件', products: '精密零部件、腔体', tech: '精密加工', scenes: '设备供应链' }
      ] }
    ]
  },

  packaging: {
    levels: [
      ['一句话', '先进封装把多颗芯片装进一个「系统」：CoWoS 把 GPU 与 HBM 并排贴在中介层上，SoIC 直接上下堆叠——当前算力供给最硬的产能瓶颈就在这一步。'],
      ['打个比方', '像从「独栋别墅」改成「高层精装合体楼」：地皮（硅片面积）不变，住进去的功能翻几倍；但楼盖得越高，良率与散热越难。'],
      ['拆开看', '四段链条：中介层制备（硅中介层/重布线）→ 2.5D 并排贴装（CoWoS 类）→ 3D 直接堆叠（SoIC/混合键合）→ 测试与良片筛选；良率是乘法，任何一层偏低都会拖垮整体。'],
      ['怎么运转', '台积电按封装产能配给加速卡出货，英伟达、AMD、博通提前一年锁定；长电、通富、日月光承接溢出订单；封装在 AI 卡 BOM 成本中的占比逐年上升。'],
      ['格局与博弈', '台积电主导 CoWoS/SoIC，英特尔以 Foveros 转型追赶，日月光与安靠做委外封测，长电/通富/华天承接国产需求；混合键合是 3D 时代的分水岭技术。'],
      ['边界与走向', 'CoWoS 产能连年翻倍仍供不应求，价值向面板级与扇出型封装转移；芯粒（UCIe 标准）会让封装从「制造环节」变成「设计选择」，定制 base die 与光电共封装是下一个战场。']
    ],
    industries: [
      { name: '代工封装一体', desc: '把封装做成前道工艺的延伸，绑定大客户产能。', companies: [
        { name: 'TSMC', role: 'CoWoS 主导', products: 'CoWoS、SoIC、InFO', tech: '2.5D/3D、混合键合', scenes: 'AI 加速卡封装' },
        { name: 'Intel', role: 'Foveros 转型', products: 'Foveros、EMIB', tech: '3D 堆叠、嵌入式桥', scenes: '自用与代工客户' },
        { name: 'Samsung', role: '存储协同', products: 'HBM4 封装、2.5D', tech: '存储逻辑协同', scenes: 'AI 芯片一站式' }
      ] },
      { name: '委外封测（OSAT）', desc: '承接溢出产能与成熟封装，规模为王。', companies: [
        { name: '日月光', role: 'OSAT 龙头', products: '先进封装、测试', tech: 'Fan-out、2.5D', scenes: 'AI 与手机芯片' },
        { name: 'Amkor', role: '美系 OSAT', products: '先进封装、SiP', tech: 'Flip-chip、2.5D', scenes: '数据中心与手机' },
        { name: '长电科技', role: '中国封测', products: 'XDFOI 2.5D/3D', tech: '芯粒封装', scenes: '国产芯片配套' },
        { name: '通富微电', role: '中国封测', products: 'CPU/GPU 封装', tech: 'Chiplet、2.5D', scenes: 'AMD 等大客户' },
        { name: '华天科技', role: '中国封测', products: '扇出、存储封装', tech: 'TSV、Fan-out', scenes: '消费与汽车' }
      ] },
      { name: '封装设备与材料', desc: '混合键合与中介层的工具商，封装扩产直接受益。', companies: [
        { name: 'Besi', role: '混合键合', products: '键合机', tech: '混合键合精度', scenes: '3D 堆叠' },
        { name: 'ASMPT', role: '键合设备', products: '热压键合、固晶机', tech: 'TCB 键合', scenes: 'HBM 与 CoWoS' },
        { name: 'Kulicke & Soffa', role: '封装设备', products: '引线键合、先进封装', tech: '精密运动控制', scenes: '封测产线' },
        { name: '东京精密', role: '量测磨削', products: '晶圆减薄、量测', tech: '超薄磨削', scenes: '3D 封装前道' }
      ] },
      { name: '芯粒生态与标准', desc: '让封装成为设计选择的接口与 IP 供给方。', companies: [
        { name: 'UCIe 联盟', role: '接口标准', products: 'UCIe 1.x 规范', tech: '芯粒互连标准', scenes: '跨厂芯粒组合' },
        { name: 'Alphawave', role: 'SerDes IP', products: '高速接口 IP', tech: 'SerDes、Chiplet', scenes: '数据中心芯片' },
        { name: '芯原股份', role: '国产 IP', products: 'Chiplet IP、GP', tech: '接口与处理器 IP', scenes: '国产芯粒' },
        { name: '奎芯科技', role: '国产互连', products: 'UCIe 接口芯粒', tech: 'D2D 互连', scenes: '国产 AI 芯片' }
      ] }
    ]
  },

  memory: {
    levels: [
      ['一句话', 'HBM 是把多层内存垂直叠起来的高带宽显存：AI 芯片算得再快，数据喂不上来也只能空转；HBM 决定「喂料速度」，也决定单卡能跑多大的模型。'],
      ['打个比方', '像把仓库从「单层平房」改成「高层货架 + 超宽电梯」：同样的占地，单位时间搬运的数据量高几倍；但楼层越高，良率越难保，造价越贵。'],
      ['拆开看', '四段链路：DRAM 晶圆 → TSV 打孔 → 多层堆叠 → 与 GPU 共同封装（2.5D / 3D）；容量、带宽、功耗、良率四项互相拉扯，层数越多越难做。'],
      ['怎么运转', 'SK 海力士、三星、美光按合约价供货，英伟达、AMD、云厂商提前锁定产能；HBM 挤占普通 DRAM 产能，带动存储周期上行，价格随 AI 需求波动。'],
      ['格局与博弈', 'SK 海力士领先 HBM3E / HBM4，三星追赶，美光聚焦高价值客户；中国长鑫存储起步，受设备与专利约束；封装产能（CoWoS）与 HBM 供给共同卡住 AI 芯片出货。'],
      ['边界与走向', '带宽墙从「芯片内」转向「封装内」，HBM 层数、定制 base die 与混合键合成为新战场；长期看存算一体与近存计算是期权，但短期仍是「堆得更高、贴得更近」。']
    ],
    industries: [
      { name: 'HBM 原厂', desc: 'AI 显存的核心供给，三家寡头格局。', companies: [
        { name: 'SK 海力士', role: 'HBM 龙头', products: 'HBM3E/HBM4、DDR5', tech: 'TSV 堆叠、MR-MUF', scenes: '英伟达/AMD 加速卡' },
        { name: '三星电子', role: '综合存储', products: 'HBM、DDR5、NAND', tech: '先进制程 DRAM、封装', scenes: 'AI 服务器、手机' },
        { name: '美光', role: 'HBM 三供', products: 'HBM3E、DDR5、LPDDR', tech: '1β 制程、先进封装', scenes: '数据中心、端侧' },
        { name: '长鑫存储', role: '中国 DRAM', products: 'DDR4/DDR5、HBM 起步', tech: '自研 DRAM 制程', scenes: '国产替代' }
      ] },
      { name: 'DRAM 与 NAND', desc: 'AI 服务器与端侧设备的存储基本盘。', companies: [
        { name: '三星电子', role: '存储龙头', products: 'DRAM、NAND、SSD', tech: '先进制程、3D NAND', scenes: '服务器、消费电子' },
        { name: 'SK 海力士', role: '存储第二', products: 'DRAM、NAND、企业级 SSD', tech: 'HBM、QLC', scenes: 'AI 服务器、数据中心' },
        { name: '美光', role: '存储三强', products: 'DRAM、NAND、车规存储', tech: '高密度 NAND', scenes: '数据中心、汽车' },
        { name: '长江存储', role: '中国 NAND', products: '3D NAND、致钛 SSD', tech: 'Xtacking 架构', scenes: '国产消费与数据中心' },
        { name: '铠侠', role: 'NAND 原厂', products: 'BiCS NAND、SSD', tech: '3D 堆叠', scenes: '数据中心、消费' }
      ] },
      { name: '存储控制器与接口', desc: '连接存储颗粒与 CPU/GPU 的关键芯片。', companies: [
        { name: '澜起科技', role: '内存接口', products: 'DDR5 内存接口、CXL 芯片', tech: '高速信号、内存缓冲', scenes: 'AI 服务器' },
        { name: 'Marvell', role: '存储控制器', products: 'SSD 控制器、CXL', tech: '高速 SerDes', scenes: '数据中心存储' },
        { name: '群联电子', role: 'SSD 控制器', products: 'SSD 主控', tech: 'NAND 管理', scenes: '消费与企业 SSD' },
        { name: '慧荣科技', role: 'SSD 控制器', products: 'SSD 主控', tech: '低功耗控制器', scenes: '客户端与车载' }
      ] },
      { name: '封装与测试', desc: 'HBM 堆叠与先进封装的产能配套。', companies: [
        { name: '日月光', role: '封测', products: '存储封装、测试', tech: 'TSV、SiP', scenes: 'HBM 与存储模组' },
        { name: '长电科技', role: '中国封测', products: '存储封装、先进封装', tech: '2.5D/3D', scenes: '国产存储' },
        { name: '通富微电', role: '中国封测', products: '存储与逻辑封装', tech: 'Chiplet', scenes: 'AI 芯片配套' },
        { name: '深科技', role: '存储模组', products: '内存模组、SSD', tech: '模组制造与测试', scenes: '数据中心与消费' }
      ] }
    ]
  },

  datacenter: {
    levels: [
      ['一句话', '数据中心与集群把成千上万张卡、网络、存储和电力装进一栋楼，并通过调度系统变成可分配、可出租的算力；它是把「芯片」变成「服务」的物理容器。'],
      ['打个比方', '像把散落的发电机组成电网——单机再强，没有配电、散热和调度，也发不出稳定的电，更别说按需分配、按峰值扩容。'],
      ['拆开看', '五段链路：选址与供电 → 土建与液冷 → 服务器与机柜 → 网络布线 → 调度与运维；一个十万卡集群的交付周期以季度甚至年计，电力接入常是最慢的一段。'],
      ['怎么运转', '自建（云厂商、模型公司）与托管（Equinix、万国数据）两种模式；收入来自卡时、token 或机柜租金，成本里电力、折旧与网络占大头，利用率决定盈亏。'],
      ['格局与博弈', '云厂商自建超大集群，AI 原生云（CoreWeave、Nebius）抢 GPU 租赁，第三方 IDC 提供边缘与合规节点；电力接入与并网排队成为第一约束，土地反而次要；私有化侧，超融合借「VMware 替代 + 信创 + AI 私有算力底座」三重共振扩容，2026H1 中国超融合整体市场 74.53 亿元、深信服整体 18.5% 与全栈 32.4% 双第一。'],
      ['边界与走向', '单体规模从万卡走向十万卡，液冷与高压直流成为标配；选址从「靠近用户」转向「靠近电源与变电站」，模块化与预制化压缩交付时间；私有化形态两极分化——超融合从虚拟化底座升级为「全栈 + Agent 承载」，大模型一体机则从满血 671B 退潮至 70B 级与轻量 AI BOX，比拼转向推理框架、模型适配与运维服务的综合实力。']
    ],
    industries: [
      { name: '超大规模自建', desc: '云厂商与头部 lab 的十万卡级集群，决定算力供给上限。', companies: [
        { name: 'AWS', role: '超大规模云', products: '全球数据中心、Trainium 集群', tech: '自研网络、液冷', scenes: '云服务、模型训练' },
        { name: 'Microsoft', role: '超大规模云', products: 'Azure 数据中心、AI 超级工厂', tech: '液冷、InfiniBand', scenes: 'OpenAI 训练、企业云' },
        { name: 'Google', role: '超大规模云', products: '全球数据中心、TPU 集群', tech: 'Jupiter 网络、液冷', scenes: 'Gemini 训练、云服务' },
        { name: 'Meta', role: '自建集群', products: 'AI 研究集群、数据中心', tech: '自研网络、开放计算', scenes: 'Llama 训练、推荐' },
        { name: '字节跳动', role: '中国自建', products: '火山引擎智算中心', tech: '大规模调度、液冷', scenes: '豆包训练、内容推荐' },
        { name: '阿里云', role: '中国自建', products: '张北/河源数据中心、灵骏', tech: '自研网络、浸没液冷', scenes: '通义训练、公有云' }
      ] },
      { name: '第三方 IDC 与托管', desc: '提供机柜、电力与合规节点，承接混合云与边缘需求。', companies: [
        { name: 'Equinix', role: '全球托管龙头', products: 'IBX 数据中心、互联服务', tech: '网络中立、跨云互联', scenes: '企业混合云、边缘' },
        { name: 'Digital Realty', role: '全球托管', products: '数据中心、互联平台', tech: '模块化建设、液冷', scenes: '超大规模与金融' },
        { name: '万国数据', role: '中国 IDC', products: '高等级数据中心', tech: '液冷、双路供电', scenes: '中国云与金融' },
        { name: '世纪互联', role: '中国 IDC', products: '数据中心、混合云', tech: '网络与运维', scenes: '企业上云' },
        { name: '润泽科技', role: '中国智算 IDC', products: '智算中心、液冷机房', tech: '高功率密度', scenes: 'AI 训练集群' }
      ] },
      { name: 'AI 原生算力云', desc: '专为 GPU 负载设计的云，按卡时或集群出租。', companies: [
        { name: 'CoreWeave', role: 'GPU 云标杆', products: 'GPU 裸金属、集群', tech: 'Kubernetes、InfiniBand', scenes: 'AI 训练与推理' },
        { name: 'Lambda', role: 'GPU 云', products: 'GPU 实例、集群', tech: '按需与预留', scenes: '模型训练、推理' },
        { name: 'Nebius', role: '欧洲 GPU 云', products: 'GPU 云、AI Studio', tech: '自建数据中心', scenes: '欧洲 AI 客户' },
        { name: 'Crusoe', role: '能源+算力', products: 'GPU 云、能源方案', tech: '伴生能源、模块化机房', scenes: '低成本训练' },
        { name: '青云科技', role: '中国混合云', products: 'AI 算力云、私有云', tech: '调度与虚拟化', scenes: '政企智算' }
      ] },
      { name: '服务器与系统集成', desc: '把计算、网络、存储与液冷装成可交付的集群。', companies: [
        { name: 'Dell', role: '服务器龙头', products: 'PowerEdge、AI Factory', tech: '整机柜、液冷', scenes: '企业 AI 集群' },
        { name: 'HPE', role: '服务器与超算', products: 'ProLiant、Cray', tech: '液冷、HPC', scenes: '超算与政企' },
        { name: 'Supermicro', role: 'GPU 服务器', products: 'GPU 服务器、整机柜', tech: '快速迭代、液冷', scenes: 'AI 云与实验室' },
        { name: '浪潮信息', role: '中国龙头', products: 'NF/元脑、AI 服务器', tech: '整机柜、液冷', scenes: '中国智算中心' },
        { name: '联想', role: '中国服务器', products: 'ThinkSystem、问天', tech: '海王星液冷', scenes: '企业 AI、超算' }
      ] },
      { name: '液冷与配电', desc: '高功率密度机房的必备配套，价值量随单柜功率上升。', companies: [
        { name: 'Vertiv', role: '数据中心基础设施', products: '液冷、UPS、配电', tech: '冷板液冷、高压直流', scenes: 'AI 数据中心' },
        { name: '英维克', role: '中国温控', products: '液冷、精密空调', tech: '冷板与浸没液冷', scenes: '智算中心' },
        { name: '高澜股份', role: '中国液冷', products: '液冷板、CDU', tech: '冷板液冷', scenes: '服务器散热' },
        { name: '申菱环境', role: '中国温控', products: '数据中心空调、液冷', tech: '高效制冷', scenes: '机房温控' }
      ] },
      { name: '超融合与 AI 一体机', desc: '私有化「开箱即用」形态：VMware 替代 + 信创 + AI 底座三重共振，2026 年从「堆卡跑大模型」转向 Agent 承载与全栈能力。', companies: [
        { name: '深信服', role: '整体与全栈双第一', products: 'HCI、全栈超融合、AI 一体机', tech: '虚拟化 + 安全 + Agent 承载', scenes: 'VMware 替代与政企 AI' },
        { name: '华为', role: '全栈一体机主力', products: 'FusionCube A1000、昇腾一体机', tech: '昇腾 + ModelArts/AgentArts', scenes: '信创与大政企私有化' },
        { name: 'SmartX', role: '纯软件第一', products: 'SMTX OS、分布式存储', tech: '软件定义存储 + 容器', scenes: '金融核心虚拟化' },
        { name: '新华三', role: '一体机出货主力', products: 'UIS 超融合、GPU 一体机', tech: '全栈 ICT 与鲲鹏生态', scenes: '政企与教育医疗' },
        { name: '浪潮信息', role: '全栈超融合第二', products: '云海超融合、AI 一体机', tech: '算力调度与整机', scenes: '能源与政企' },
        { name: 'Nutanix', role: '全球 HCI 标杆', products: 'AHV、NCI 混合云', tech: '软件订阅模式（订阅占比 95%+）', scenes: '海外混合云' }
      ] }
    ]
  },

  energy: {
    levels: [
      ['一句话', '能源与电力是 AI 的终极约束：一座十万卡集群的用电量抵得上一座中型城市，电不够、并网慢，卡再多也开不满；电力正在取代芯片成为扩张的第一瓶颈。'],
      ['打个比方', '算力是工厂，电力是水；水管不够粗、水厂不肯接，机器再多也转不起来——而且新铺一根水管要排好几年队，审批比施工更慢。'],
      ['拆开看', '四段链路：发电（核电 / 燃气 / 可再生）→ 输电与并网 → 变配电与备用电源 → 机房散热；每一段都有容量上限与审批周期，最慢的一段决定整体进度。'],
      ['怎么运转', '数据中心签长期购电协议（PPA）锁定电价，核电与燃气提供基荷，储能削峰；电力成本直接进入 token 成本模型，电价差决定区域算力竞争力。'],
      ['格局与博弈', '美国核电重启与 SMR 受资本追捧，燃气轮机订单排到数年之后；中国以国家电网与绿电直供支撑智算中心；中东用主权资本加廉价能源换算力，形成「能源套利」。'],
      ['边界与走向', '短期靠燃气与储能过渡，中期看核电 / SMR 落地，长期取决于电网投资与电价机制；「算力跟随电力」会成为选址铁律，离网供电与自备电厂会增多，电价波动直接传导到 token 价格。']
    ],
    industries: [
      { name: '公用事业与发电', desc: '为数据中心提供基荷电力与长期购电协议。', companies: [
        { name: 'Constellation Energy', role: '美国核电运营商', products: '核电、长期 PPA', tech: '核电机组运营', scenes: '数据中心基荷供电' },
        { name: 'Vistra', role: '美国独立发电', products: '燃气、核电、储能', tech: '多元电源组合', scenes: '德州数据中心' },
        { name: 'NextEra Energy', role: '美国可再生龙头', products: '风电、光伏、储能', tech: '新能源开发', scenes: '绿电供应' },
        { name: 'Duke Energy', role: '美国公用事业', products: '发电与配电', tech: '电网运营', scenes: '区域数据中心' },
        { name: '长江电力', role: '中国水电', products: '水电、绿电', tech: '大型水电站运营', scenes: '中国智算中心' }
      ] },
      { name: '核电与 SMR', desc: '基荷零碳电源，是 AI 电力叙事的核心资产。', companies: [
        { name: 'Westinghouse', role: '核电技术', products: 'AP1000 反应堆', tech: '第三代核电', scenes: '新建核电项目' },
        { name: 'GE Vernova Hitachi', role: 'SMR', products: 'BWRX-300', tech: '小型模块化反应堆', scenes: '数据中心专属供电' },
        { name: 'NuScale', role: 'SMR 先行者', products: 'VOYGR SMR', tech: '模块化轻水堆', scenes: '园区级供电' },
        { name: 'Oklo', role: '微型堆', products: 'Aurora 微堆', tech: '快中子微堆', scenes: '数据中心离网供电' },
        { name: '中核集团', role: '中国核电', products: '华龙一号', tech: '三代核电', scenes: '国内核电基地' },
        { name: '中广核', role: '中国核电', products: '华龙一号、核能供热', tech: '核电运营', scenes: '沿海核电与工业供能' }
      ] },
      { name: '燃气轮机与设备', desc: '并网慢的过渡解，现场发电与调峰的主力。', companies: [
        { name: 'GE Vernova', role: '燃气轮机龙头', products: '重型燃气轮机、电网设备', tech: '高效联合循环', scenes: '数据中心自备电厂' },
        { name: 'Siemens Energy', role: '燃气与电网', products: '燃气轮机、变压器', tech: '联合循环、高压直流', scenes: '欧洲与中东电力' },
        { name: 'Mitsubishi Power', role: '燃气轮机', products: 'JAC 燃气轮机', tech: '高效燃烧', scenes: '亚洲数据中心' },
        { name: '东方电气', role: '中国装备', products: '燃气轮机、发电机', tech: '重型装备制造', scenes: '国内电站' }
      ] },
      { name: '储能与配电', desc: '削峰填谷与高可靠配电，数据中心电气化的配套。', companies: [
        { name: 'Tesla Energy', role: '储能龙头', products: 'Megapack、Powerwall', tech: '电池管理、电网级储能', scenes: '数据中心削峰' },
        { name: 'Fluence', role: '储能系统', products: '电网级储能', tech: '储能集成与软件', scenes: '新能源并网' },
        { name: '宁德时代', role: '电池龙头', products: '储能电芯、系统', tech: '磷酸铁锂、长寿命', scenes: '数据中心备电' },
        { name: '阳光电源', role: '逆变与储能', products: '储能系统、逆变器', tech: '电力电子', scenes: '光储一体化' },
        { name: 'Vertiv', role: '配电与温控', products: 'UPS、配电、液冷', tech: '高压直流', scenes: 'AI 数据中心' }
      ] },
      { name: '电网与 EPC', desc: '并网、输电与工程交付，决定项目能否按时通电。', companies: [
        { name: 'Quanta Services', role: '电网工程', products: '输电线路、变电站 EPC', tech: '电网建设与运维', scenes: '美国电网扩容' },
        { name: '国家电网', role: '中国电网', products: '输电、配电、绿电交易', tech: '特高压、智能电网', scenes: '中国智算中心供电' },
        { name: '中国电建', role: '电力 EPC', products: '电站与电网工程', tech: '大型工程总包', scenes: '国内外电站' },
        { name: '中国能建', role: '电力 EPC', products: '发电与电网工程', tech: '工程设计与施工', scenes: '新能源与电网' }
      ] }
    ]
  },

  network: {
    levels: [
      ['一句话', '网络与光互连决定集群能开多大：万卡之后，卡与卡之间搬数据的开销往往比计算本身还大；网络不再是配套，而是算力的一部分。'],
      ['打个比方', '像城市交通——核心区楼再高，道路堵死，整座城市也转不动；AI 集群里，网络就是那张路网，堵一次，所有卡一起等。'],
      ['拆开看', '五段链路：交换芯片 → 交换机与网卡 → 光模块与光缆 → 协议（InfiniBand / 以太网 / RDMA）→ 拓扑（Fat-Tree / rail-optimized）；每一层都影响延迟与拥塞。'],
      ['怎么运转', '卖交换芯片（博通）、卖整网（英伟达、思科、Arista）、卖光模块（中际旭创、新易盛）；云厂商按端口与带宽扩容，训练集群对无损与低延迟近乎苛刻。'],
      ['格局与博弈', '英伟达用 InfiniBand + NVLink 锁定高端训练，以太网联盟（Ultra Ethernet）以开放生态反攻；光模块由中国厂商主导，1.6T 世代量价齐升；交换芯片仍是博通主战场。'],
      ['边界与走向', '竞争从「带宽」转向「端到端延迟与拥塞控制」；光互连向共封装光学（CPO）演进，网络与计算的边界会重新划分，光电融合成为下一代系统级命题。']
    ],
    industries: [
      { name: '交换与网卡芯片', desc: '网络设备的算力核心，决定端口速率与拥塞控制能力。', companies: [
        { name: 'Broadcom（博通）', role: '交换芯片龙头', products: 'Tomahawk、Jericho 交换芯片', tech: '高速 SerDes、可编程流水线', scenes: '云数据中心组网' },
        { name: 'Marvell', role: '网络与互连', products: '交换芯片、光互连', tech: 'SerDes、DSP', scenes: '数据中心与运营商' },
        { name: 'NVIDIA', role: 'InfiniBand 生态', products: 'Spectrum-X、ConnectX 网卡', tech: 'InfiniBand、NVLink', scenes: 'AI 训练集群' },
        { name: 'Cisco', role: '网络设备', products: 'Silicon One 芯片、交换机', tech: '可编程芯片', scenes: '企业数据中心' },
        { name: '盛科通信', role: '中国交换芯片', products: '以太网交换芯片', tech: '自研交换架构', scenes: '国产网络设备' }
      ] },
      { name: '交换机与网络设备', desc: '把芯片组成可管理的网络，交付整网方案。', companies: [
        { name: 'Arista', role: '云网络龙头', products: '数据中心交换机、EOS', tech: 'Leaf-Spine、遥测', scenes: '超大规模云' },
        { name: 'Cisco', role: '企业网络', products: 'Nexus、Catalyst', tech: 'SDN、网络安全', scenes: '企业数据中心' },
        { name: 'Juniper', role: '路由与交换', products: 'QFX、PTX', tech: '高性能路由', scenes: '运营商与云' },
        { name: '华为', role: '中国网络龙头', products: 'CloudEngine、星河 AI 网络', tech: '自研交换芯片、无损网络', scenes: '中国智算中心' },
        { name: '新华三', role: '中国 ICT', products: '数据中心交换机、AD-NET', tech: '网络自动化', scenes: '政企与云' }
      ] },
      { name: '光模块与光器件', desc: '电信号与光信号的转换，带宽升级的价值量集中地。', companies: [
        { name: '中际旭创', role: '光模块龙头', products: '800G/1.6T 光模块', tech: '硅光、高速封装', scenes: 'AI 数据中心' },
        { name: '新易盛', role: '光模块', products: '800G/1.6T 光模块', tech: '高速光通信', scenes: '云与电信' },
        { name: '天孚通信', role: '光器件', products: '光引擎、无源器件', tech: '精密光学', scenes: '光模块配套' },
        { name: 'Coherent', role: '光通信', products: '光模块、激光器', tech: '垂直整合', scenes: '数据中心与工业' },
        { name: 'Lumentum', role: '光器件', products: '激光器、光模块', tech: '光子学', scenes: '云与 3D  sensing' }
      ] },
      { name: '线缆与连接', desc: '高速铜缆与连接器，机柜内互连的必需品。', companies: [
        { name: '安费诺', role: '连接器龙头', products: '高速连接器、线缆', tech: '高速信号完整性', scenes: '服务器与交换机' },
        { name: '立讯精密', role: '连接与组装', products: '高速线缆、连接器', tech: '精密制造', scenes: '数据中心与消费电子' },
        { name: '沃尔核材', role: '中国线缆', products: '高速通信线缆', tech: '材料与线缆工艺', scenes: '服务器互连' },
        { name: 'Molex', role: '连接器', products: '高速连接器', tech: '互连方案', scenes: '数据中心' }
      ] }
    ]
  },

  cloud: {
    levels: [
      ['一句话', '算力租赁与云是算力的分销层：把 GPU、存储和网络打包，按卡时、调用或 token 卖给模型公司和开发者；它把重资产变成可计费的流动服务。'],
      ['打个比方', '像电力公司——你不需要自己建电厂，插上插座按度付费；差别在于云还替你管机房、调度和模型服务，也顺带锁定了你的数据与工作流。'],
      ['拆开看', '三层结构：底层数据中心与 GPU 池，中层虚拟化与调度（Kubernetes / Slurm），上层模型 API、MaaS 与行业解决方案；三层各有不同的毛利结构与竞争逻辑。'],
      ['怎么运转', '三种收入：IaaS 按卡时、PaaS 按调用、MaaS 按 token；成本结构是折旧 + 电力 + 网络，规模越大、利用率越高，毛利越高，闲置产能则直接吞掉利润。'],
      ['格局与博弈', 'AWS、Azure、GCP 三强占企业市场，CoreWeave、Nebius 以 GPU 专项租赁抢 AI 原生客户，中国阿里云、火山引擎、华为云分层竞争；承诺消费与生态绑定是锁客手段。'],
      ['边界与走向', '云正从「卖资源」转向「卖模型与智能体」；GPU 供给缓解后，价格战会从卡时蔓延到 token，毛利向调度效率与上层应用迁移，纯转租的中间层最先被挤出。']
    ],
    industries: [
      { name: '综合云', desc: '企业 IT 与 AI 的主要采购入口，规模效应显著。', companies: [
        { name: 'AWS', role: '全球第一', products: 'EC2、S3、Bedrock、SageMaker', tech: '自研芯片、全球基础设施', scenes: '企业上云、模型托管' },
        { name: 'Microsoft Azure', role: '全球第二', products: 'Azure AI、OpenAI Service', tech: '企业集成、混合云', scenes: '企业 AI、Copilot' },
        { name: 'Google Cloud', role: '全球第三', products: 'Vertex AI、TPU、BigQuery', tech: '数据与 AI 一体', scenes: '数据驱动 AI' },
        { name: '阿里云', role: '中国第一', products: 'ECS、百炼、PAI', tech: '自研芯片与网络', scenes: '中国企业 AI' },
        { name: '腾讯云', role: '中国云', products: 'CVM、TI 平台、混元 API', tech: '音视频与游戏云', scenes: '互联网与政企' },
        { name: '华为云', role: '中国云', products: '昇腾云、ModelArts', tech: '软硬协同、国产化', scenes: '政企与国产替代' }
      ] },
      { name: 'GPU 专项云', desc: '为 AI 负载优化的算力租赁，增长快但周期性强。', companies: [
        { name: 'CoreWeave', role: 'GPU 云标杆', products: 'GPU 集群、托管服务', tech: 'Kubernetes、InfiniBand', scenes: '大模型训练' },
        { name: 'Lambda', role: 'GPU 云', products: 'GPU 实例、集群', tech: '按需与预留', scenes: '训练与推理' },
        { name: 'Nebius', role: '欧洲 GPU 云', products: 'GPU 云、AI Studio', tech: '自建数据中心', scenes: '欧洲 AI 客户' },
        { name: 'Together AI', role: '开源模型云', products: '模型托管、微调', tech: '推理优化、分布式训练', scenes: '开源模型部署' },
        { name: 'Crusoe', role: '能源+算力', products: 'GPU 云、能源方案', tech: '伴生能源', scenes: '低成本训练' }
      ] },
      { name: '中国算力服务', desc: '本土云厂商与智算服务商，承接国产芯片与行业需求。', companies: [
        { name: '阿里云', role: '综合云', products: '灵骏、百炼、PAI', tech: '自研网络与调度', scenes: '通义生态、企业 AI' },
        { name: '火山引擎', role: '字节云', products: 'GPU 云、方舟、豆包 API', tech: '大规模调度', scenes: '内容与 AI 应用' },
        { name: '百度智能云', role: 'AI 云', products: '千帆、文心 API', tech: '昆仑芯、飞桨', scenes: '企业模型服务' },
        { name: '商汤大装置', role: 'AI 基础设施', products: 'SenseCore、算力租赁', tech: '大规模训练平台', scenes: '模型训练与城市计算' },
        { name: '青云科技', role: '混合云', products: 'AI 算力云、私有云', tech: '调度与虚拟化', scenes: '政企智算' }
      ] }
    ]
  },

  edge: {
    levels: [
      ['一句话', '边缘与端侧算力把 AI 放进手机、PC、汽车和可穿戴设备，让推理在本地完成，不依赖云端往返；它换的是延迟、隐私与离线可用性，代价是模型必须变小。'],
      ['打个比方', '像把厨房搬进家里——不用每次吃饭都去中央食堂，快、私密、断网也能用，但菜谱（模型）必须精简，复杂菜还得回中央厨房。'],
      ['拆开看', '四段链路：SoC 里的 NPU / GPU → 端侧模型（量化、蒸馏、剪枝）→ 运行时与框架（ONNX / Core ML / NNAPI / llama.cpp）→ 应用场景；功耗、内存与散热是硬约束。'],
      ['怎么运转', '芯片厂卖 SoC，设备厂卖整机，模型厂提供端侧小模型；变现靠硬件溢价、订阅与生态分成，端云协同决定体验上限，纯端侧很难做复杂任务。'],
      ['格局与博弈', '苹果、高通、联发科在手机端领先，英特尔、AMD、高通争 PC，地平线、黑芝麻做车载，英伟达用 Jetson 占开发者生态；生态碎片化（芯片、框架、模型各自为政）是最大障碍。'],
      ['边界与走向', '端侧模型能力每 6–12 个月上一档，隐私与延迟驱动「云边端」协同；NPU 算力会成为旗舰设备的核心卖点，端侧 agent 是下一个交互入口，但杀手级应用仍未出现。']
    ],
    industries: [
      { name: '手机 SoC', desc: '端侧 AI 最大的出货基座，NPU 算力成为旗舰卖点。', companies: [
        { name: 'Apple', role: '自研 SoC', products: 'A 系列、M 系列、Apple Intelligence', tech: 'Neural Engine、统一内存', scenes: 'iPhone、Mac 端侧 AI' },
        { name: 'Qualcomm', role: '安卓旗舰', products: '骁龙 8 系列、Hexagon NPU', tech: '异构计算、端侧模型', scenes: '安卓手机、PC' },
        { name: '联发科', role: '安卓主力', products: '天玑系列、APU', tech: '高能效 NPU', scenes: '手机、IoT' },
        { name: '三星', role: '垂直整合', products: 'Exynos、Galaxy AI', tech: '自研 NPU、存储协同', scenes: '手机与家电' },
        { name: '华为海思', role: '中国自研', products: '麒麟、昇腾端侧', tech: '达芬奇 NPU', scenes: '华为手机与鸿蒙生态' }
      ] },
      { name: 'PC 与平板芯片', desc: '本地跑大模型的下一块屏幕，AI PC 的核心。', companies: [
        { name: 'Intel', role: 'PC 龙头', products: 'Core Ultra、Lunar Lake', tech: 'NPU + CPU + GPU', scenes: 'AI PC' },
        { name: 'AMD', role: 'PC 与工作站', products: 'Ryzen AI、Strix Point', tech: 'XDNA NPU', scenes: 'AI PC、工作站' },
        { name: 'Qualcomm', role: 'ARM PC', products: 'Snapdragon X 系列', tech: 'ARM + NPU', scenes: 'Windows on ARM' },
        { name: 'Apple', role: '自研 M 系', products: 'M 系列芯片', tech: '统一内存、Neural Engine', scenes: 'Mac 本地推理' },
        { name: 'NVIDIA', role: '工作站 GPU', products: 'RTX 系列、Project DIGITS', tech: 'Tensor Core、CUDA', scenes: '本地开发与推理' }
      ] },
      { name: '车载与机器人芯片', desc: '自动驾驶与具身智能的端侧算力，安全等级要求高。', companies: [
        { name: 'NVIDIA', role: '车载算力', products: 'Orin、Thor', tech: '车规 GPU、CUDA', scenes: '自动驾驶、机器人' },
        { name: '地平线', role: '中国车载', products: '征程系列', tech: 'BPU 架构', scenes: '辅助驾驶' },
        { name: '黑芝麻智能', role: '中国车载', products: '华山、武当系列', tech: '车规 SoC', scenes: '智能座舱与驾驶' },
        { name: 'Mobileye', role: '视觉方案', products: 'EyeQ 系列', tech: '视觉感知芯片', scenes: 'ADAS' },
        { name: 'Tesla', role: '自研 FSD', products: 'FSD 芯片、Dojo', tech: '端到端神经网络', scenes: '自动驾驶、Optimus' }
      ] },
      { name: '端侧模型与运行时', desc: '把大模型压缩进设备，框架与工具链决定体验。', companies: [
        { name: 'Google', role: '端侧模型', products: 'Gemini Nano、Android AICore', tech: '模型蒸馏、NNAPI', scenes: '安卓端侧 AI' },
        { name: 'Microsoft', role: '端侧小模型', products: 'Phi 系列、Copilot+ PC', tech: '小模型、量化', scenes: 'Windows 本地 AI' },
        { name: 'Apple', role: '端云协同', products: 'Apple Intelligence、Core ML', tech: '隐私计算、端云切换', scenes: 'iPhone 与 Mac' },
        { name: '面壁智能', role: '中国端侧', products: 'MiniCPM 系列', tech: '小模型训练与量化', scenes: '手机、汽车、IoT' },
        { name: '阿里', role: '端侧生态', products: 'MNN、Qwen 端侧版', tech: '推理框架、模型压缩', scenes: '中国终端设备' }
      ] },
      { name: '可穿戴与 IoT', desc: '低功耗端侧 AI 的新增量，语音与健康是主场景。', companies: [
        { name: '恒玄科技', role: '耳机芯片', products: '智能音频 SoC', tech: '低功耗 NPU', scenes: 'TWS 耳机、手表' },
        { name: '瑞芯微', role: 'AIoT 芯片', products: 'RK 系列', tech: '端侧 NPU', scenes: '智能硬件、机器人' },
        { name: '乐鑫科技', role: 'Wi-Fi MCU', products: 'ESP 系列', tech: '连接 + 轻量 AI', scenes: '智能家居' },
        { name: 'Qualcomm', role: '可穿戴', products: 'Snapdragon W 系列', tech: '低功耗 SoC', scenes: '智能手表' },
        { name: 'Ambiq', role: '超低功耗', products: 'Apollo 系列', tech: '亚阈值功耗', scenes: '可穿戴与医疗' }
      ] }
    ]
  },

  robothw: {
    levels: [
      ['一句话', '机器人本体与执行器是具身智能的「身体」：电机、减速器、灵巧手和传感器决定它能做什么、做得多好、成本多低；大脑可以复用，身体必须重造。'],
      ['打个比方', '像人的骨骼与肌肉——大脑再聪明，关节不灵活、手不巧，也干不了活；而且每个关节都要为重量和成本买单，轻一公斤往往贵一截。'],
      ['拆开看', '五段链路：执行器（电机 + 减速器 + 丝杠）→ 本体结构 → 传感器（视觉 / 力觉 / IMU）→ 电池与散热 → 整机控制；任一环短板都会拖累整机，自由度越多，成本与故障率近似指数上升。'],
      ['怎么运转', '卖整机（宇树、Figure）、卖关节模组（三花、绿的谐波）、卖灵巧手（因时、兆威）；BOM 成本决定量产可行性，供应链降本决定普及速度，关键部件的国产化率仍在快速变化。'],
      ['格局与博弈', '中国供应链在减速器、电机、丝杠环节占优，美国强在算法与整机品牌，日本在精密减速器有积累；量产爬坡与可靠性是分水岭，良率比参数更能决定交付。'],
      ['边界与走向', '人形机器人先从工厂与物流落地，灵巧手与力控是短板；成本降到 2 万美元以内才可能进入家庭，在此之前工业场景是主要现金流，也是数据来源。']
    ],
    industries: [
      { name: '人形机器人整机', desc: '具身智能的旗舰形态，量产能力决定竞争格局。', companies: [
        { name: '宇树科技', role: '中国整机', products: 'H1/G1 人形、四足机器人', tech: '关节电机、运动控制', scenes: '科研、巡检、表演' },
        { name: '智元机器人', role: '中国整机', products: '远征、灵犀系列', tech: 'VLA 模型、本体自研', scenes: '工厂、商业服务' },
        { name: 'Figure AI', role: '美国整机', products: 'Figure 02/03', tech: '端到端模型、灵巧手', scenes: '汽车工厂、物流' },
        { name: 'Tesla', role: '美国整机', products: 'Optimus', tech: 'FSD 迁移、执行器自研', scenes: '工厂、家庭' },
        { name: '优必选', role: '中国整机', products: 'Walker 系列', tech: '伺服舵机、运动控制', scenes: '工厂、教育、服务' },
        { name: '傅利叶', role: '中国整机', products: 'GR 系列', tech: '康复机器人、人形本体', scenes: '医疗康复、科研' }
      ] },
      { name: '核心零部件', desc: '关节、灵巧手与传感器，决定成本与性能上限。', companies: [
        { name: '绿的谐波', role: '谐波减速器', products: '谐波减速器、机电一体化', tech: '精密传动', scenes: '机器人关节' },
        { name: '双环传动', role: '齿轮与减速器', products: 'RV 减速器、行星齿轮', tech: '精密齿轮制造', scenes: '工业与人形机器人' },
        { name: '三花智控', role: '执行器', products: '机电执行器、热管理', tech: '电机与丝杠集成', scenes: '人形机器人关节' },
        { name: '鸣志电器', role: '电机', products: '步进电机、空心杯电机', tech: '微特电机', scenes: '灵巧手、关节' },
        { name: '兆威机电', role: '灵巧手', products: '微型传动、灵巧手模组', tech: '微型减速与传动', scenes: '人形机器人手部' },
        { name: '因时机器人', role: '灵巧手', products: '微型伺服电缸、灵巧手', tech: '微型执行器', scenes: '科研与服务机器人' }
      ] },
      { name: '工业与物流机器人', desc: '已规模化的机器人市场，具身技术的现金牛。', companies: [
        { name: '发那科', role: '工业机器人', products: '六轴工业机器人、协作机器人', tech: '运动控制、视觉', scenes: '汽车、电子制造' },
        { name: 'ABB', role: '工业机器人', products: '工业机器人、自动化系统', tech: '运动控制、数字化', scenes: '制造与物流' },
        { name: '库卡', role: '工业机器人', products: '工业机器人、AMR', tech: '自动化集成', scenes: '汽车制造' },
        { name: '亚马逊机器人', role: '物流自动化', products: 'Kiva、Proteus、Sequoia', tech: '仓储机器人、视觉', scenes: '电商仓配' },
        { name: '极智嘉', role: '仓储机器人', products: 'AMR、货到人系统', tech: 'SLAM、调度算法', scenes: '电商与制造业物流' },
        { name: '海康机器人', role: '机器视觉与 AMR', products: 'AGV/AMR、工业相机', tech: '视觉感知、调度', scenes: '工厂与仓储' }
      ] },
      { name: '传感器与视觉', desc: '机器人的感知入口，力觉与 3D 视觉是短板。', companies: [
        { name: '奥比中光', role: '3D 视觉', products: '深度相机、3D 传感器', tech: '结构光、ToF', scenes: '机器人导航与抓取' },
        { name: '速腾聚创', role: '激光雷达', products: '车载与机器人 LiDAR', tech: '固态激光雷达', scenes: '自动驾驶、机器人' },
        { name: '禾赛科技', role: '激光雷达', products: 'AT/FT 系列', tech: '芯片化 LiDAR', scenes: '汽车与机器人' },
        { name: '索尼', role: '图像传感器', products: 'CMOS 图像传感器', tech: '高动态范围', scenes: '机器视觉' },
        { name: 'Intel RealSense', role: '深度相机', products: 'RealSense 系列', tech: '立体视觉', scenes: '机器人与交互' }
      ] }
    ]
  },

  supply: {
    levels: [
      ['一句话', '供应链与出口管制用政策改写算力供给曲线：哪些芯片能卖、卖给谁、经由谁，直接决定各国的 AI 成本与进度；它是产业里唯一由政策而非市场定价的环节。'],
      ['打个比方', '像给高速公路设关卡——路还在，但通行证决定谁能上、能拉多少货；关卡规则还会随谈判动态调整，今天合法的路线明天可能被封。'],
      ['拆开看', '四段链路：管制清单（芯片 / 设备 / 技术）→ 许可证与实体清单 → 转口与第三国 → 企业合规体系；每一层都在动态调整，清单更新以季度计，公告本身就是行情。'],
      ['怎么运转', '合规部门决定交易能否发生，咨询与数据服务商提供筛查；企业用多源采购、库存与区域化产能对冲风险，许可审批的不确定性本身就是成本，最终转嫁给下游客户与终端价格。'],
      ['格局与博弈', '美国以先进制程与设备管制维持代差，中国以国产替代与成熟制程扩产应对；中东与东南亚成为转口与算力飞地，欧洲在设备端跟随，日本在材料与设备环节占位。'],
      ['边界与走向', '管制会从硬件延伸到模型权重与云服务；「合规成本」会成为大厂相对小厂的竞争优势，全球算力市场逐步分裂为多个区域体系，国产替代的窗口与代价同时放大。']
    ],
    industries: [
      { name: '管制执行与合规科技', desc: '把出口管制规则变成可执行的筛查与审计。', companies: [
        { name: 'Exiger', role: '供应链情报', products: '实体筛查、供应链映射', tech: '制裁数据、图分析', scenes: '出口合规、供应商审查' },
        { name: 'Palantir', role: '数据与决策', products: 'Foundry、AIP', tech: '数据融合、模型接入', scenes: '政府与供应链决策' },
        { name: 'Deloitte', role: '合规咨询', products: '出口管制咨询、审计', tech: '合规方法论', scenes: '跨国企业合规' },
        { name: 'PwC', role: '合规咨询', products: '贸易合规、风险咨询', tech: '合规流程设计', scenes: '企业合规体系' },
        { name: '道琼斯风险合规', role: '制裁数据', products: '制裁名单、尽职调查', tech: '数据服务', scenes: '客户与交易筛查' }
      ] },
      { name: '半导体设备与材料替代', desc: '管制倒逼的国产化赛道，成熟制程先行。', companies: [
        { name: '北方华创', role: '国产设备', products: '刻蚀、沉积、清洗', tech: '成熟制程全覆盖', scenes: '国产晶圆厂' },
        { name: '中微公司', role: '国产刻蚀', products: '刻蚀设备、MOCVD', tech: '等离子刻蚀', scenes: '先进制程与 LED' },
        { name: '拓荆科技', role: '薄膜沉积', products: 'PECVD、ALD', tech: '薄膜沉积工艺', scenes: '国产晶圆制造' },
        { name: '上海微电子', role: '国产光刻', products: 'DUV 光刻机', tech: '光刻系统', scenes: '成熟制程' }
      ] },
      { name: '国产芯片替代', desc: '在管制下形成的第二供给曲线，生态是关键。', companies: [
        { name: '华为昇腾', role: '国产算力核心', products: '昇腾 910B/910C、Atlas', tech: 'CANN、达芬奇架构', scenes: '国产训练与推理' },
        { name: '寒武纪', role: '云端 ASIC', products: '思元系列', tech: 'MLU 架构', scenes: '智算中心' },
        { name: '海光信息', role: 'CPU+DCU', products: '海光 CPU、深算 DCU', tech: 'x86 与 ROCm 兼容', scenes: '政企与科学计算' },
        { name: '摩尔线程', role: '国产 GPU', products: 'MTT S 系列', tech: 'MUSA 架构', scenes: '国产智算' }
      ] },
      { name: '分销与转口', desc: '芯片流通的渠道层，合规与区域化是关键词。', companies: [
        { name: '伟仕佳杰', role: '亚太分销', products: 'IT 产品分销、云服务', tech: '渠道网络', scenes: '亚太市场' },
        { name: '神州数码', role: '中国分销', products: 'IT 分销、云与信创', tech: '渠道与集成', scenes: '中国企业市场' },
        { name: 'Arrow Electronics', role: '全球分销', products: '电子元件分销', tech: '供应链服务', scenes: '全球电子制造' },
        { name: 'Avnet', role: '全球分销', products: '元件与解决方案', tech: '供应链与设计服务', scenes: '工业与汽车' }
      ] }
    ]
  }

});
