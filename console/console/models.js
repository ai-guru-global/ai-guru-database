/* 模型登记册，手工策展（本文件不被构建覆盖）。
 * 前沿模型规格的结构化登记：参数/上下文/定价/benchmark 可比、可排序。
 * 未知字段留空字符串即可——schema 先立住，随线索沉淀增量回填。
 * priceIn/priceOut：美元/百万 token；ctx：千 token；bench：代表作分数。
 * priceSrc：attested=库内可直接引用的一手价格；derived=按可证折扣/倍数推算，引用需注明。 */
DB.models = [
  {"name":"GPT-6 Astra","org":"OpenAI","date":"2026-09-03","params":"","ctx":"","priceIn":"","priceOut":"","bench":"ARC-AGI-3 99.9%","priceSrc":"","note":"首个触发 Preparedness Framework「Critical」网络安全阈值的模型，Daybreak Access 受限开放"},
  {"name":"Claude Fable 5.1","org":"Anthropic","date":"2026-09-02","params":"","ctx":"","priceIn":"1.25","priceOut":"6.25","bench":"","priceSrc":"derived","note":"点版本迭代，同步上线 Claude Code 并降价 75%——按 Fable 5 原价 $5/$25 推算，引用注明"},
  {"name":"Claude Mythos 5.1","org":"Anthropic","date":"2026-09-02","params":"","ctx":"","priceIn":"","priceOut":"","bench":"","priceSrc":"","note":"双旗舰点版本之一，Mythos 为 Opus 之上的新档位"},
  {"name":"Gemini 3.8 Flash","org":"Google DeepMind","date":"2026-09-02","params":"","ctx":"","priceIn":"","priceOut":"","bench":"","priceSrc":"","note":"三周内再度点版本迭代，「Flash + Cyber」双轨延续"},
  {"name":"Qwen3.8-Max","org":"阿里通义","date":"2026-08-03","params":"2.4T","ctx":"1M","priceIn":"5","priceOut":"","bench":"Code Arena 登顶","priceSrc":"attested","note":"国产模型首登编码竞技场榜首，$5/MToken 处 Pareto 前沿；27B 版 Apache 2.0 权重先行开源"},
  {"name":"GLM-5.3","org":"智谱","date":"2026-08-14","params":"","ctx":"","priceIn":"0.125","priceOut":"0.625","bench":"","priceSrc":"derived","note":"前沿编码 + 涌现网安能力；API 约 Opus 4.8（$5/$25）的 1/40，按此推算，引用注明"},
  {"name":"DeepSeek V4-Pro","org":"DeepSeek","date":"2026-08-13","params":"1.6T","ctx":"","priceIn":"","priceOut":"","bench":"","priceSrc":"","note":"旗舰 preview 转正，延续 MIT 开源"},
  {"name":"Grok 4.6","org":"xAI (SpaceXAI)","date":"2026-08-12","params":"","ctx":"","priceIn":"","priceOut":"","bench":"","priceSrc":"","note":"距 4.5 仅 35 天，主打长时运行 Agent；品牌署名 SpaceXAI"},
  {"name":"GPT-5.6 Sol","org":"OpenAI","date":"2026-07-09","params":"","ctx":"","priceIn":"2.5","priceOut":"12.5","bench":"","priceSrc":"derived","note":"发布价 $5/$25；7-14 宣布 Sol 价格减半，按此推算现价，引用注明"},
  {"name":"Claude Sonnet 5","org":"Anthropic","date":"2026-06-30","params":"","ctx":"","priceIn":"2","priceOut":"10","bench":"","priceSrc":"attested","note":"以低价带来「接近 Opus 的编程智能」；同日宣布 Fable 5 全球重新部署（出口管制解除）"},
  {"name":"Claude Opus 4.8","org":"Anthropic","date":"2026-05-28","params":"","ctx":"","priceIn":"5","priceOut":"25","bench":"","priceSrc":"attested","note":"主打「诚实与可靠性」，配套动态工作流编排器；知识截止 2026-01"},
  {"name":"Kimi K3","org":"月之暗面","date":"","params":"","ctx":"","priceIn":"","priceOut":"","bench":"盲测对标 GLM-5.3","priceSrc":"","note":"与 GLM-5.3、腾讯混元 Hy4 盲测分差不足 0.1"},
  {"name":"MiniMax H3","org":"MiniMax","date":"2026-07-31","params":"","ctx":"","priceIn":"","priceOut":"","bench":"","priceSrc":"","note":"全模态视频生成模型开源，与字节 Seedance 同期对垒"},
  {"name":"Ling-3.0","org":"蚂蚁","date":"2026-08-11","params":"","ctx":"","priceIn":"","priceOut":"","bench":"","priceSrc":"","note":"罕见放出预训练到 WSM 合并全部检查点，MIT 许可"}
];
