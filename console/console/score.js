/* 赛道评分输入，手工策展（本文件不被构建覆盖）。
 * 5 维各 1-5 分：momentum 势能 / biz 商业化 / moat 壁垒 / policy 政策敞口 / coverage 本库覆盖。
 * 评分为分析判断（与事实分离），conf 标注置信度；权重可在前台实时调整重排。 */
DB.score = {
  asOf: '2026-09-30',
  dims: {
    momentum: { label: '势能', desc: '未来 6 个月变化幅度预期：事件密度 × 事件烈度' },
    biz: { label: '商业化', desc: '收入距离：变现路径是否已经跑通' },
    moat: { label: '壁垒', desc: '技术 / 数据 / 生态壁垒高度，决定格局稳定性' },
    policy: { label: '政策敞口', desc: '监管与地缘暴露程度，敞口越高越需监测' },
    coverage: { label: '本库覆盖', desc: '线索数 + 档案命中的追踪密度（反身指标）' }
  },
  weightsDefault: { momentum: 25, biz: 20, moat: 15, policy: 20, coverage: 20 },
  presets: [
    { k: 'balanced', l: '均衡', w: { momentum: 25, biz: 20, moat: 15, policy: 20, coverage: 20 } },
    { k: 'opportunity', l: '机会优先', w: { momentum: 35, biz: 30, moat: 15, policy: 5, coverage: 15 } },
    { k: 'risk', l: '风险优先', w: { momentum: 15, biz: 10, moat: 15, policy: 45, coverage: 15 } },
    { k: 'catchup', l: '补课优先', w: { momentum: 15, biz: 10, moat: 10, policy: 15, coverage: 50 } }
  ],
  sectors: [
    { id: '基础模型', name: '基础模型', dims: { momentum: 5, biz: 4, moat: 4, policy: 3, coverage: 5 }, conf: 'medium', note: '旗舰竞赛 + 降价 + 安全分级三线并行，本库覆盖最厚的赛道之一' },
    { id: '智能体平台', name: '智能体平台', dims: { momentum: 4, biz: 3, moat: 3, policy: 2, coverage: 3 }, conf: 'medium', note: '框架层快速洗牌，MCP 正在成为互操作标准' },
    { id: 'Agentic编码', name: 'Agentic 编码', dims: { momentum: 5, biz: 5, moat: 3, policy: 2, coverage: 4 }, conf: 'high', note: 'SpaceX 收购与 OpenAI 断供事件后进入阵营化，商业化最快' },
    { id: '多模态大模型', name: '多模态大模型', dims: { momentum: 4, biz: 3, moat: 3, policy: 2, coverage: 2 }, conf: 'medium', note: '视频生成白热但本库仅 2 条线索，覆盖缺口最大' },
    { id: '推理与基础设施', name: '推理与基础设施', dims: { momentum: 4, biz: 4, moat: 4, policy: 4, coverage: 2 }, conf: 'medium', note: 'NVIDIA-HF 并购 + 出口管制，成本曲线的掌控者' },
    { id: '开源模型与生态', name: '开源模型与生态', dims: { momentum: 5, biz: 4, moat: 3, policy: 3, coverage: 5 }, conf: 'high', note: '9 条线索；开源登顶编码竞技场后定价权被改写' },
    { id: '训练与数据', name: '训练与数据', dims: { momentum: 3, biz: 2, moat: 3, policy: 2, coverage: 2 }, conf: 'low', note: '数据墙叙事 + 合成数据，公开信息最少的层' },
    { id: '评测与基准', name: '评测与基准', dims: { momentum: 3, biz: 2, moat: 2, policy: 1, coverage: 4 }, conf: 'medium', note: '榜单即信任，LMArena 与专项基准双线' },
    { id: '具身智能', name: '具身智能', dims: { momentum: 5, biz: 3, moat: 4, policy: 3, coverage: 4 }, conf: 'high', note: '宇树 IPO 定价人形机器人叙事，运动会显示保有量翻倍' },
    { id: '世界模型', name: '世界模型', dims: { momentum: 3, biz: 1, moat: 3, policy: 1, coverage: 2 }, conf: 'low', note: '视频生成作世界模拟器，离商业化最远' },
    { id: '行业应用', name: '行业应用', dims: { momentum: 3, biz: 3, moat: 2, policy: 3, coverage: 5 }, conf: 'low', note: '10 条线索 298 条（2026-10-03 二次复核，本库最多；含 8 条月级条目，评估文档按全日期口径记 290）；办公/教育/金融/法律 4 条建有取证档案，余 6 条尚无；一手直链 8%（23/298），收入口径仅营销电商 1 条可得' },
    { id: 'AI安全与对齐', name: 'AI 安全与对齐', dims: { momentum: 5, biz: 2, moat: 3, policy: 5, coverage: 2 }, conf: 'high', note: '失控事件 + 水印 + 诉讼高发，政策敞口全赛道最大' },
    { id: '开发者工具', name: '开发者工具', dims: { momentum: 4, biz: 4, moat: 2, policy: 2, coverage: 2 }, conf: 'medium', note: '被 Agentic 编码吸收中，独立赛道边界模糊' },
    { id: '语音与音频', name: '语音与音频', dims: { momentum: 3, biz: 3, moat: 2, policy: 3, coverage: 2 }, conf: 'low', note: 'Suno 版权裁定 + 全双工语音，版权是主线' },
    { id: 'AI搜索与信息获取', name: 'AI 搜索与信息获取', dims: { momentum: 4, biz: 4, moat: 2, policy: 3, coverage: 2 }, conf: 'medium', note: '答案引擎动摇传统分发权，本库覆盖不足' },
    { id: '商业与投融资', name: '商业与投融资', dims: { momentum: 4, biz: 4, moat: 1, policy: 4, coverage: 2 }, conf: 'medium', note: '大事记打标资本事件 21 条，其中 14 条落在本赛道两条线索，结构化回填是关键' },
    { id: '消费级AI应用', name: '消费级 AI 应用', dims: { momentum: 4, biz: 5, moat: 2, policy: 3, coverage: 2 }, conf: 'medium', note: 'ChatGPT Ads 年化 10 亿美元，广告变现跑通' },
    { id: '交付与组织', name: '交付与组织', dims: { momentum: 4, biz: 3, moat: 2, policy: 2, coverage: 3 }, conf: 'low', note: '3 条线索（FDE / 服务伙伴与认证体系 / AI 交付成本结构）；认证与成本的取证档案已建，但一线源仍稀疏，国内交付认证多为缺位记录' }
  ],
  redlines: [
    '单源信息一律标 ⚠️，未双源核验前不作为结论引用',
    '金额必须带口径：ARR / 融资额 / 估值三者的披露方与统计方式',
    '观点必须出现在「分析」段并可回溯到时间线事实，正文不得夹带判断',
    '评分为分析判断，必须标置信度；引用低置信数字需明示',
    '宁漏勿错：❓ 高度可疑事件在核验通过前不进入线索与大事记',
    '自动抽取字段（金额 / 类型）仅作量级与筛选参考，精确口径以一手源为准',
    '本库覆盖分是反身指标：低分赛道先补信源，再下结论',
    '模型价格以登记册更新日为准，引用时注明日期',
    '修正事实时必须留痕：改什么、为什么改、依据是什么',
    '研判层（本机观点）与公开库物理隔离，永不混淆'
  ]
};
