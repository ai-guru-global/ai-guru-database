# 操盘台（Ops Workbench）结构与数据契约

> 建成：2026-09-27。6 视图 / 21 页签。侧栏改版（2026-10-01）后这 21 页不再集中于单节，而按研究对象分发到 3 个板块：
> 「11 本机运营」9 页（产品操盘 4：机会台 3 页 + 实验登记簿；台子自审 5：系统台）、
> 「06 政策与风险」8 页（政策与合规 2 + 结构性风险 3 = 护栏台；反方观点 3 = 红蓝对抗）、
> 「05 资本与生态」4 页（生态位子组）。路由未变，仍为 `#/opp|exp|risk|red|eco|meta/*`。
> 哲学：**Data In → AI Process → Action Out**——研究不落为 48 小时内可执行的行动，就标记为低优先或归档。

## 一、六台结构

| 视图 | 页签 | 回答的问题 | 数据来源 |
|---|---|---|---|
| 机会台 opp | `#/opp/board` 评分板 · `#/opp/mvp` MVP 启动包 · `#/opp/broken` 断链检查 | 这个机会值得投入吗？下一步是什么？ | `DB.opsLocal.opps` + `Engine` 前台重算 |
| 实验台 exp | `#/exp/ledger` 登记簿 | 我的结论被真实世界验证过吗？ | `DB.opsLocal.exps` |
| 红蓝对抗 red | `#/red/board` 影子董事会 · `#/red/short` 做空报告 · `#/red/bias` 偏见审计 | 我在自嗨吗？反面证据在哪？ | `DB.ops.red.*`（公共角色）+ `DB.opsLocal.reds` |
| 护栏台 risk | `#/risk/laws` 政策雷达 · `#/risk/license` 许可雷区 · `#/risk/deps` 平台依赖 · `#/risk/cash` 压力测试 · `#/risk/chaos` 混沌演习 | 哪种死法在等我看不见的地方？ | `DB.ops.risk.*`（公共基线）+ `DB.opsLocal.risks` |
| 生态位 eco | `#/eco/radar` 寄生共生 · `#/eco/kol` KOL 价值 · `#/eco/partners` 互补伙伴 · `#/eco/matrix` 技术迁移矩阵 | 谁是我的杠杆？ | `DB.opsLocal.eco/mig` + `DB.chain` |
| 系统台 meta | `#/meta/signals` 信号回流 · `#/meta/roi` 成本 ROI · `#/meta/tempo` 节奏健康 · `#/meta/decay` 策略遗忘 · `#/meta/review` 季度重构 | 系统本身在产生回报吗？ | `DB.ops.sys` 规则 + `DB.opsLocal.sys` 台账 |

方法论长文（实验手册/红蓝方法论/许可实操/退出清单/季度仪式）在知识库新组「操盘手册」：`#/kb/ops/<页>`。

## 二、数据契约（两层分离）

### `console/ops.js` — 公共策展层（入库、可公开审阅）
影子董事会角色与 Prompt 包、许可证对照表、法规基线、混沌场景模板、实验/评分口径常量、`sys.localSkeleton` 骨架。**手工策展，不被 `make console` 覆盖。**

### `console/ops.local.js` — 私有台账层（gitignore，永不出本机）
与 `console/data.local.js` 同级隐私边界；CDN 发布白名单不含它，物理不上传。骨架（从任意空态页「复制骨架」可得）：

```js
DB.opsLocal = {
  asOf: '',
  opps: [],   /* {id,name,one,dims:{wall,pain,cash,crowd 1-5},conf,flags:[bigco|fake|reg|decay],
                 links:{clue,thesis}, mvp:{icp,cold,landing,seo,arch,next},
                 action, actionDue, status:active|parked|dropped, note} */
  exps: [],   /* {id,type:fake-door|woz|ab|cold-email,hyp,metric,cost,start,due,result,
                 verdict:validated|falsified|inconclusive,linkedOpp,status:running|done} */
  reds: [],   /* {id,target,evid:[{side:bear|bull,t,src}],fails:[],whyNotBigco,verdict,updated} */
  risks: { deps: [{id,name,kind,tos,priceLog:[{d,note}],alt,exit,score 1-5,note}],
           laws: [{law:<ops.js 法规 id>,impact,act,reviewed}] },
  eco: { platforms: [{name,api:open|restricted|closed,market,traffic,entry,linkedOpp}],
         kols: [{name,channel,precision 1-5,match 1-5,proof 1-5,note,linkedOpp}],
         partners: [{name,skill,complement,contact,status}] },
  mig: [],    /* {id,fromNode:<chain L2/L3 节点 id>,toDomain:<L4 节点 id>,
                 status:candidate|validating|dropped|done,why,evid,updated} */
  sys: { signals: [{src,base 0-100,wins,losses,streak,adopted:true|false|null,note}],
         costs: [{d,task,tokens,minutes,out:{clues,actions,exps}}],
         drills: [{d,scenario:<chaos key>,result,gaps}],
         pulse: [{d,kind:external|internal,text}],
         veto: [{d,item,why}], review: [{q,d,done:[],next}] },
  cash: null  /* 上次压测参数快照 {cash,burn,mrr,arpu,conv,cac} */
};
```

文件缺失不报错（`app.js` 兜底空结构 + `<script onerror>` 提示位）；加载位在 `data.local.js` 之后、`app.js` 之前（index.html）。devtools 里一条 `ops.local.js 404` 属预期。

## 三、硬编码规则口径（全部前台可复算）

| 规则 | 公式 | 位置 |
|---|---|---|
| 机会排序 | `Σ(维度分×权重)/Σ权重`（Engine 同赛道评分卡） | opp/board |
| 断链 | 无 `action`，或 `actionDue` 早于**浏览器当日** | opp/broken |
| 信源降权建议 | 连败 ≥3 → `max(10, base×0.5)`；1 胜清零连败；采纳与否人工裁定（adopted） | meta/signals |
| 策略遗忘 | 衰减分 `0.5^(未更新天数/90)`，<0.5 列休眠候选；休眠≠删除 | meta/decay |
| 分析瘫痪预警 | 近 14 天 消费分钟 ÷ 外部交互次数 > 5（本机自报口径） | meta/tempo |
| 现金跑道 | `现金 ÷（月支出 − 月收入）`；<6 个月红色告警 | risk/cash |
| 依赖告警 | 依赖度评分 ≥4（`risk.depThreshold`） | risk/deps |
| 行动强制锁（软） | 近 7 天 pulse 无 `external` 记录 → 研究类视图顶部横幅；未登记过 pulse 不打扰 | 全局 `opsLockHtml()` |

**时间口径**：操盘台的「今天」用浏览器当日（`opsToday()`），刻意区别于全台快照 `TODAY`——ops 台账不随 `make console` 重建，用快照日会失真。

## 四、诚实降级声明（什么没有做，为什么）

静态单页 + 零构建链 + 无密钥是本台底线，因此建议书中的以下能力**不作为自动化实现**，落地为方法论层 + 人工台账：

| 建议 | 落地形态 | 不自动化的原因 |
|---|---|---|
| 微型预算授权 Agent（自主投放） | 实验登记簿记录投放实验与结果 | 真金支出必须人签；静态台无服务端可托管广告账户 |
| 决策品味 LoRA 微调 | 否决日志（sys.veto）+ 复盘记录 | 先把数据攒成结构化资产，微调是其后的事 |
| 边缘信号爬虫（Discord/Telegram） | 平台依赖/寄生共生台账人工登记 | 爬取合规与维护成本超出静态台边界 |
| 影子董事会自动辩论 | 五角色 Prompt 包 + 一键复制到任意 LLM | 零密钥风险；回答质量本就取决于外部模型 |
| 数据源自动降权 | 建议权重前台计算 + 人工 adopted 裁定 | 验证样本量小，全自动降权易误杀 |

## 五、发布与维护

- `make console` 只重建 `data.js` / `data.local.js`，不触碰 `ops.js` / `ops.local.js`；
- CDN 发布（publish-meoo）需手动把 `console/ops.js` 加入公开复制清单（`ops.local.js` 永不发布）；
- 新增私有台账字段时：先改本文件契约表 + `ops.js` 的 `localSkeleton`，再改数据文件；
- 所有裁定（采纳/勾选/休眠）= 改 ops.local.js + 刷新，git 即审计日志。
