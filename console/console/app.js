/* ============================================================================
 * AI GURU 工作台，AI 全行业拆解台应用逻辑
 * 定位：用最细的维度一层层拆解 AI 全行业——主轴是五层产业链 × 69 节点，
 * 线索/大事/档案是节点上的证据层，不是产品本体。
 * 双层 hash 路由：#/视图 + #/视图/页签，32 节 99 页，侧栏归入 11 个板块
 * 交互含筛选、线索详情、主题详情、大事记、档案检索、日报、玩家详情、议题账本、全局搜索
 * ============================================================================ */
(function () {
'use strict';

/* ------------------------------------------------------------ 基础工具 */
function $(s, el) { return (el || document).querySelector(s); }
function $$(s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); }
function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
function h(s) { return s; }

DB.players = DB.players || [];
DB.models = DB.models || [];
DB.chain = DB.chain || { layers: [] };
/* 上下游导航闭环：chain.js 只手写主方向，这里补全反向链接，保证节点页的上/下游芯片双向可走。 */
(function () {
  var byId = {};
  DB.chain.layers.forEach(function (ly) { ly.nodes.forEach(function (nd) { byId[nd.id] = nd; }); });
  DB.chain.layers.forEach(function (ly) { ly.nodes.forEach(function (nd) {
    (nd.upstream || []).forEach(function (u) {
      var p = byId[u]; if (!p) return;
      p.downstream = p.downstream || [];
      if (p.downstream.indexOf(nd.id) < 0) p.downstream.push(nd.id);
    });
    (nd.downstream || []).forEach(function (d) {
      var p = byId[d]; if (!p) return;
      p.upstream = p.upstream || [];
      if (p.upstream.indexOf(nd.id) < 0) p.upstream.push(nd.id);
    });
  }); });
})();
DB.score = DB.score || { dims: {}, weightsDefault: {}, presets: [], sectors: [], redlines: [] };
DB.cites = DB.cites || {};
DB.glossary = DB.glossary || { cats: {}, items: [] };
DB.decisions = DB.decisions || { a: [], b: [], c: [] };
DB.calendar = DB.calendar || { year: '', items: [] };
DB.corrections = DB.corrections || [];
DB.kb = DB.kb || { groups: [] };
DB.unknowns = DB.unknowns || { groups: [] };
DB.orgs = DB.orgs || { groups: [] };
DB.library = DB.library || { count: 0, files: [] };
DB.guide = DB.guide || { intro: '', paths: [], tour: [] };
DB.ops = DB.ops || { asOf: '', opp: { dims: {}, weightsDefault: {}, presets: [], flags: [], mvpBlocks: [] }, red: { roles: [], shortTpl: '', bias: [] }, risk: { laws: [], licenses: [], licenseChecks: [], depThreshold: 4, cashCfg: { fields: [], scenarios: {} }, chaos: [] }, eco: { kolWeights: {}, platformDims: [] }, sys: { sourceRule: {}, decay: {}, tempo: {}, reviewChecks: [], localSkeleton: '' } };

var state = {
  view: 'overview',
  tabs: {},                                  /* 各视图当前页签，来自 #/视图/页签 */
  cStatus: 'all', cQuery: '', cTopic: '',    /* 线索库列表筛选 */
  chYear: '2026', chCat: 'all',              /* 大事记流水筛选 */
  vStatus: 'all',                            /* 待核实队列筛选 */
  aQuery: '', aYear: 'all',                  /* 档案检索 */
  dailyMonth: '', dailyDay: '',              /* 日报单日 */
  pType: 'all', plSel: '',                   /* 玩家类型与选中 */
  resFile: '',                               /* 研判选中文件 */
  scPreset: 'balanced', scWeights: null,     /* 评分卡权重 */
  simM: '', simReq: 2, simIn: 2, simOut: 2,  /* 模拟器：模型与档位索引 */
  glCat: 'all', glQ: '',                     /* 术语库筛选 */
  calType: 'all',                            /* 日历类型 */
  oppPreset: 'balanced', oppW: null,         /* 机会台权重（内存态） */
  oppFilter: 'all', oppMvp: '',              /* 机会台筛选与启动包选中卡 */
  redTarget: '',                             /* 红蓝对抗对象（opp:<id> / thesis:<id>） */
  riskRegion: 'all', cashIn: null            /* 政策雷达地域筛选 / 压测输入（内存态） */
};
var SIM_REQ = [1000, 5000, 10000, 50000, 100000, 500000, 1000000];
var SIM_IN = [500, 1000, 2000, 4000, 8000];
var SIM_OUT = [200, 500, 1000, 2000, 4000];

/* ------------------------------------------------------------ 索引 */
var CLUE_BY_ID = {};
DB.clues.forEach(function (c) { CLUE_BY_ID[c.id] = c; });
var TOPIC_BY_KEY = {};
DB.topics.forEach(function (t) { TOPIC_BY_KEY[t.key] = t; });

var STATUS_STYLE = { '活跃': 'gold', '观察中': '', '已完结': 'plain' };
var VERIFY_STYLE = { '✅': { cls: 'pos', label: '已核实' }, '⚠️': { cls: '', label: '存疑' }, '❓': { cls: 'neg', label: '高度可疑' }, '🔍': { cls: 'pine', label: '需一手源' }, '✗': { cls: 'neg', label: '一手不可达' }, 'E': { cls: 'plain', label: '非正式来源' } };
var VERIFY_MARKS = ['✅', '⚠️', '❓', '🔍', '✗', 'E'];
var VERIFY_COUNTS = (function () {
  var b = {};
  DB.verify.forEach(function (v) { b[v.status] = (b[v.status] || 0) + 1; });
  return b;
})();
var VERIFY_ORDER = VERIFY_MARKS.filter(function (m) { return VERIFY_COUNTS[m]; });
var STATUS_ORDER = ['all', '活跃', '观察中', '已完结'];
var TODAY = DB.meta.builtAt.slice(0, 10);

function statusTag(s) {
  return '<span class="tag ' + (STATUS_STYLE[s] || '') + '">' + esc(s || '未知') + '</span>';
}
function clueHref(id) {
  var seg = id.split('/');
  return '#/clue/' + encodeURIComponent(seg[0]) + '/' + encodeURIComponent(seg.slice(1).join('/'));
}
function extLink(url, text) {
  if (!url) return text;
  return '<a href="' + esc(url) + '" target="_blank" rel="noopener">' + text + '</a>';
}
/* 事件来源 reference 芯片：镜像/一手主机名可视，无 URL 明示挂账位置（2026-10-03，修正记录留痕） */
function srcRef(url) {
  var label, full;
  if (!url) { label = '无逐字URL'; full = '无逐字 URL——待核实清单第八节逐行挂账'; }
  else {
    var host = url.replace(/^https?:\/\//, '').split('/')[0];
    if (/aihot\.(news|virxact\.com)$/.test(host)) { label = 'aihot镜像'; full = 'aihot 镜像 permalink（上游信源见条目页）'; }
    else { label = host; full = url; }
  }
  return '<span style="font-size:10px;color:#8a8f98;border:1px solid rgba(128,128,128,.35);border-radius:3px;padding:0 4px;margin-left:6px;font-family:ui-monospace,SFMono-Regular,monospace;white-space:nowrap" title="' + esc(full) + '">src·' + esc(label) + '</span>';
}
function linkify(s) {
  var t = esc(s);
  t = t.replace(/\[([^\]]+)\]\((https?:[^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  t = t.replace(/ai-news-wikilink:\/\/([^\s；。，）)]+)/g, function (m, id) {
    return '<a class="wl" href="' + clueHref(id) + '">' + esc(id.split('/').pop()) + '</a>';
  });
  return t;
}
function summaryHtml(s, n) {
  var full = s || '';
  var t = n ? full.slice(0, n) : full;
  if (n && full.length > n) {
    var b = t.lastIndexOf('[');
    if (b >= 0 && t.indexOf('](', b) < 0) t = t.slice(0, b);
  }
  return linkify(t) + (n && full.length > n ? '…' : '');
}
function bar(v, max, color) {
  if (!max) return '';
  var w = Math.max(2, Math.round(v / max * 110));
  return '<span style="display:inline-block;vertical-align:middle;width:' + w + 'px;height:8px;background:' + (color || 'var(--navy)') + '"></span>';
}
function evLinks(e) {
  return (e.links || []).map(function (l) {
    return '<a class="wl" href="' + clueHref(l) + '">' + esc(l.split('/')[1] || l) + '</a>';
  }).join('，');
}

/* 引用与数据可靠性：上标角标 + 页底证据板块（照搬参考台 prov 模式） */
function cite(key, n) {
  var e = ((DB.cites && DB.cites[key]) || [])[n - 1];
  if (!e) return '';
  var lv = e.conf === 'high' ? '高' : (e.conf === 'medium' ? '中' : '低');
  return '<sup class="cite c-' + e.conf.charAt(0) + '" data-cite="' + key + '-' + n + '" data-jump="prov-' + key + '-' + n + '" title="' + esc(e.t + '，置信度' + lv + '，点击看来源与证明') + '">' + n + '</sup>';
}
function provBlock(key) {
  var list = (DB.cites && DB.cites[key]) || [];
  if (!list.length) return '';
  var items = list.map(function (e, i) {
    var n = i + 1;
    var lv = e.conf === 'high' ? '高' : (e.conf === 'medium' ? '中' : '低');
    return '<li class="prov-item" id="prov-' + key + '-' + n + '">' +
      '<div class="prov-hd"><span class="no mono">' + (n < 10 ? '0' : '') + n + '</span><b>' + esc(e.t) + '</b>' +
      '<span class="prov-conf c-' + e.conf.charAt(0) + '">置信度 ' + lv + '</span>' +
      '<button class="prov-back" data-cite-back="' + key + '-' + n + '">回正文</button></div>' +
      '<div class="prov-row"><span class="k">来源</span><p>' + esc(e.src) + '</p></div>' +
      '<div class="prov-row"><span class="k">可靠性证明</span><p>' + esc(e.rel) + '</p></div>' +
      '<div class="prov-row"><span class="k">准确度证明</span><p>' + esc(e.acc) + '</p></div></li>';
  }).join('');
  return '<section class="prov" id="prov-' + key + '">' +
    '<h3 class="sec"><span class="no">REF</span><span class="t">数据可靠性</span><span class="en">Sources and Reliability</span></h3>' +
    '<p class="note">本页每个上标数字对应下方一条，点角标跳转，点条目右上回正文。置信度分级：高，官方原文可复算。中，交叉核验的分析判断。低，待校准。</p>' +
    '<ol class="prov-list">' + items + '</ol></section>';
}
function jumpFlash(el) {
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  el.classList.remove('jump');
  void el.offsetWidth;
  el.classList.add('jump');
  setTimeout(function () { el.classList.remove('jump'); }, 1700);
}

/* 正文术语链化：把知识库单页正文中首次出现的术语别名变成可点金词（跳过 code/pre，避免切断英文单词） */
var GLOSS_ALIASES = null;
function glossAliases() {
  if (GLOSS_ALIASES) return GLOSS_ALIASES;
  GLOSS_ALIASES = [];
  DB.glossary.items.forEach(function (it) {
    (it.a || []).forEach(function (al) { GLOSS_ALIASES.push({ k: it.k, a: al }); });
  });
  GLOSS_ALIASES.sort(function (x, y) { return y.a.length - x.a.length; });
  return GLOSS_ALIASES;
}
function termify(html) {
  var blocks = [];
  var h2 = html.replace(/<(pre|code)[\s\S]*?<\/\1>/g, function (m) { blocks.push(m); return '\u0001' + (blocks.length - 1) + '\u0002'; });
  var used = {};
  h2 = h2.replace(/>([^<>]+)</g, function (m, text) {
    var out = text;
    glossAliases().forEach(function (al) {
      if (used[al.k]) return;
      var i = out.indexOf(al.a);
      if (i < 0) return;
      var wc = /[A-Za-z0-9]/;
      var prev = i > 0 ? out.charAt(i - 1) : '';
      var next = out.charAt(i + al.a.length);
      if (wc.test(al.a.charAt(0)) && wc.test(prev)) return;
      if (wc.test(al.a.charAt(al.a.length - 1)) && wc.test(next)) return;
      out = out.slice(0, i) + '<span class="term" data-k="' + al.k + '">' + al.a + '</span>' + out.slice(i + al.a.length);
      used[al.k] = 1;
    });
    return '>' + out + '<';
  });
  return h2.replace(/\u0001(\d+)\u0002/g, function (m, i) { return blocks[+i]; });
}

/* 玩家 join 统计：名称与别名双向匹配线索 frontmatter 与大事记文本 */
function playerStats(p) {
  var names = [p.name].concat(p.aliases || []);
  var hit = [], nEv = 0, last = '', evs = [];
  DB.clues.forEach(function (c) {
    var found = c.roles.indexOf(p.name) >= 0;
    if (!found) {
      for (var i = 0; i < names.length; i++) { if (c.alias.indexOf(names[i]) >= 0) { found = true; break; } }
    }
    if (found) hit.push(c);
  });
  DB.events.forEach(function (e) {
    var hay = e.title + ' ' + e.summary;
    for (var i = 0; i < names.length; i++) {
      if (hay.indexOf(names[i]) >= 0) { nEv++; if (e.date > last) last = e.date; evs.push(e); return; }
    }
  });
  return { clues: hit, nEvents: nEv, last: last, events: evs };
}

/* 主题关联大事（按双链主题前缀） */
function topicEvents(key) {
  return DB.events.filter(function (e) {
    return (e.links || []).some(function (l) { return l.split('/')[0] === key; });
  });
}

/* ------------------------------------------------------------ 页签注册表 */
var TABS = {
  guide: [{ k: 'paths', l: '阅读路线' }, { k: 'tour', l: '通读序列' }],
  overview: [{ k: 'panorama', l: '全景' }, { k: 'pulse', l: '本周脉搏' }, { k: 'radar', l: '风险雷达' }, { k: 'unknowns', l: '开放问题' }],
  topics: [{ k: 'table', l: '总表' }, { k: 'coverage', l: '覆盖度仪表' }],
  clues: [{ k: 'list', l: '列表' }, { k: 'hot', l: '热榜' }, { k: 'analysis', l: '观点库' }, { k: 'updates', l: '收录动态' }],
  chronicle: [{ k: 'flow', l: '流水' }, { k: 'monthly', l: '月度统计' }, { k: 'hubs', l: '枢纽事件' }],
  archive: [{ k: 'search', l: '检索' }, { k: 'sources', l: '来源分布' }, { k: 'cats', l: '分类分布' }, { k: 'years', l: '年度节奏' }],
  daily: [{ k: 'day', l: '单日回看' }, { k: 'rhythm', l: '近7日节奏' }],
  library: [{ k: 'files', l: '文件中心' }],
  directory: [{ k: 'companies', l: '公司' }, { k: 'univ', l: '高校与实验室' }, { k: 'labs', l: '研究机构' }, { k: 'orgs', l: '非营利与治理' }, { k: 'funds', l: '资本' }, { k: 'media', l: '媒体与数据' }],
  verify: [{ k: 'queue', l: '事实核查' }, { k: 'byclue', l: '关联线索' }, { k: 'stats', l: '统计' }],
  method: [{ k: 'standards', l: '收录标准' }, { k: 'methodology', l: '核验方法论' }, { k: 'template', l: '线索模板' }, { k: 'redlines', l: '研究红线' }, { k: 'corrections', l: '修正记录' }],
  players: [{ k: 'table', l: '总表' }, { k: 'detail', l: '玩家详情' }],
  sectors: [{ k: 'matrix', l: '矩阵' }, { k: 'rank', l: '热度排行' }, { k: 'gaps', l: '研究缺口' }],
  models: [{ k: 'table', l: '总表' }, { k: 'pricing', l: '定价对比' }, { k: 'timeline', l: '发布时间线' }],
  capital: [{ k: 'flow', l: '流水' }, { k: 'rank', l: '金额榜' }],
  scores: [{ k: 'rank', l: '排名' }, { k: 'weights', l: '权重与假设' }, { k: 'method', l: '口径与红线' }],
  sim: [{ k: 'sim', l: '模拟器' }, { k: 'table', l: '全模型对比' }],
  decisions: [{ k: 'board', l: '决策板' }, { k: 'log', l: '已决归档' }],
  calendar: [{ k: 'year', l: DB.calendar.year + ' 全年' }, { k: 'next', l: '未来 90 天' }],
  glossary: [{ k: 'dict', l: '术语词典' }],
  kb: [{ k: 'method', l: '方法论' }, { k: 'eng', l: '工程方式' }, { k: 'roles', l: '岗位' }, { k: 'companies', l: '公司' }, { k: 'biz', l: '商业模式' }, { k: 'career', l: '职业路径' }, { k: 'ops', l: '操盘手册' }],
  chain: [{ k: 'map', l: '全景' }, { k: 'density', l: '证据密度' }, { k: 'L1', l: '算力硬件' }, { k: 'L2', l: '数据模型' }, { k: 'L3', l: '平台工具' }, { k: 'L4', l: '行业应用' }, { k: 'L5', l: '商业生态' }],
  research: [{ k: 'docs', l: '文档' }, { k: 'guide', l: '使用说明' }],
  theses: [{ k: 'ledger', l: '账本' }, { k: 'settle', l: '结算台' }, { k: 'stats', l: '统计' }],
  digest: [{ k: 'current', l: '本期' }, { k: 'daily', l: '每日明细' }],
  actions: [{ k: 'open', l: '进行中' }, { k: 'done', l: '已完成' }],
  opp: [{ k: 'board', l: '评分板' }, { k: 'mvp', l: 'MVP 启动包' }, { k: 'broken', l: '断链检查' }],
  exp: [{ k: 'ledger', l: '登记簿' }],
  red: [{ k: 'board', l: '影子董事会' }, { k: 'short', l: '做空报告' }, { k: 'bias', l: '偏见审计' }],
  risk: [{ k: 'laws', l: '政策雷达' }, { k: 'license', l: '许可雷区' }, { k: 'deps', l: '平台依赖' }, { k: 'cash', l: '压力测试' }, { k: 'chaos', l: '混沌演习' }],
  eco: [{ k: 'radar', l: '寄生共生' }, { k: 'kol', l: 'KOL 价值' }, { k: 'partners', l: '互补伙伴' }, { k: 'matrix', l: '技术迁移矩阵' }],
  meta: [{ k: 'signals', l: '信号回流' }, { k: 'roi', l: '成本 ROI' }, { k: 'tempo', l: '节奏健康' }, { k: 'decay', l: '策略遗忘' }, { k: 'review', l: '季度重构' }]
};

function tabLabel(v, k) {
  var t = (TABS[v] || []).filter(function (x) { return x.k === k; })[0];
  return t ? t.l : '';
}

/* ------------------------------------------------------------ 路由 */
var VIEWS = ['guide', 'overview', 'topics', 'clues', 'chronicle', 'archive', 'daily', 'library', 'verify', 'method', 'players', 'company', 'sectors', 'models', 'capital', 'chain', 'directory', 'scores', 'sim', 'decisions', 'calendar', 'glossary', 'kb', 'research', 'theses', 'digest', 'actions', 'opp', 'exp', 'red', 'risk', 'eco', 'meta'];
var NAMES = { guide: '阅读指南', overview: '总览', topics: '主题', clues: '线索库', chronicle: '大事记', archive: '语料检索', daily: '日报', library: '文档中心', verify: '待核实', method: '方法论', players: '玩家图谱', company: '公司专页', sectors: '赛道地图', models: '模型登记册', capital: '资本动向', chain: '产业链', directory: '机构名录', scores: '赛道评分卡', sim: '成本模拟器', decisions: '决策台', calendar: '年度日历', glossary: '术语库', kb: '知识库', research: '研判', theses: '议题追踪', digest: '周报', actions: '行动项', opp: '机会台', exp: '实验台', red: '红蓝对抗', risk: '护栏台', eco: '生态位', meta: '系统台' };

function hashSegs() {
  return (location.hash || '').replace(/^#\/?/, '').split('/');
}
function currentRoute() {
  var hh = hashSegs()[0];
  if (hh === 'clue') hh = 'clues';   /* 线索详情深链 #/clue/主题/线索 落在线索库视图 */
  return VIEWS.indexOf(hh) >= 0 ? hh : 'overview';
}
function currentTabOf(v) {
  var segs = hashSegs();
  var tabs = TABS[v] || [];
  if (segs[0] === v && segs[1] && tabs.some(function (t) { return t.k === segs[1]; })) return segs[1];
  return tabs.length ? tabs[0].k : '';
}
function currentClueId() {
  var raw = (location.hash || '').replace(/^#\/?/, '');
  if (raw.indexOf('clue/') !== 0) return '';
  var rest = raw.slice('clue/'.length);
  try { return decodeURIComponent(rest); } catch (e) { return rest; }
}
function currentTopicKey() {
  var segs = hashSegs();
  if (segs[0] !== 'topics' || !segs[1] || TABS.topics.some(function (t) { return t.k === segs[1]; })) return '';
  try { return decodeURIComponent(segs[1]); } catch (e) { return segs[1]; }
}
/* 产业链节点：#/chain/<层>/<节点id> */
function currentChainNode() {
  var segs = hashSegs();
  if (segs[0] !== 'chain' || !segs[2]) return null;
  var nid;
  try { nid = decodeURIComponent(segs[2]); } catch (e) { nid = segs[2]; }
  for (var i = 0; i < DB.chain.layers.length; i++) {
    var ly = DB.chain.layers[i];
    for (var j = 0; j < ly.nodes.length; j++) {
      if (ly.nodes[j].id === nid) return { node: ly.nodes[j], layer: ly };
    }
  }
  return null;
}

/* 玩家个体：#/players/detail/<名称> */
function currentPlayerName() {
  var segs = hashSegs();
  if (segs[0] !== 'players' || segs[1] !== 'detail' || !segs[2]) return '';
  var n;
  try { n = decodeURIComponent(segs[2]); } catch (e) { n = segs[2]; }
  return DB.players.some(function (p) { return p.name === n; }) ? n : '';
}
/* 赛道档案：#/sectors/<id>，id 与页签键不重叠故可直接区分 */
function currentSectorId() {
  var segs = hashSegs();
  if (segs[0] !== 'sectors' || !segs[1]) return '';
  var k;
  try { k = decodeURIComponent(segs[1]); } catch (e) { k = segs[1]; }
  if (TABS.sectors.some(function (t) { return t.k === k; })) return '';
  return DB.score.sectors.some(function (s) { return s.id === k; }) ? k : '';
}
function sectorById(id) {
  return DB.score.sectors.filter(function (s) { return s.id === id; })[0] || null;
}
function topicByKey(key) {
  return DB.topics.filter(function (t) { return t.key === key; })[0] || null;
}
function playerHref(name) { return '#/players/detail/' + encodeURIComponent(name); }
function sectorHref(id) { return '#/sectors/' + encodeURIComponent(id); }
function chainNodeHref(layerKey, id) { return '#/chain/' + layerKey + '/' + encodeURIComponent(id); }
function companyHref(name) { return '#/company/' + encodeURIComponent(name); }

/* 公司专页索引：企业版图（explain-*.js）里出现的每家公司都有一条记录。
 * 同一公司可在多个节点/行业切片出现；页面按产业链层序聚合，不另建手工名单，
 * 避免「版图里提到了、却找不到专页」的断链。 */
var COMPANY_IDX = null;
function companyIndex() {
  if (COMPANY_IDX) return COMPANY_IDX;
  var idx = {};
  DB.chain.layers.forEach(function (ly) {
    ly.nodes.forEach(function (nd) {
      var ex = DB.explain && DB.explain[nd.id];
      if (!ex || !ex.industries) return;
      ex.industries.forEach(function (ind) {
        (ind.companies || []).forEach(function (c) {
          if (!c || !c.name) return;
          if (!idx[c.name]) idx[c.name] = { name: c.name, slices: [] };
          idx[c.name].slices.push({ layer: ly, node: nd, industry: ind, company: c });
        });
      });
    });
  });
  /* 补充名录：只出现在深度拆解价值链字符串里的供应链公司 */
  (DB.companyExtra || []).forEach(function (c) {
    if (!c || !c.name) return;
    var hit = findChainNode(c.node);
    if (!hit) return;
    if (!idx[c.name]) idx[c.name] = { name: c.name, slices: [] };
    idx[c.name].slices.push({ layer: hit.layer, node: hit.node, industry: { name: c.industry || '补充名录' }, company: c });
  });
  /* 别名收敛：让中文名与常用简称落到同一张专页；不覆盖真实存在的同名公司 */
  Object.keys(DB.companyAliases || {}).forEach(function (al) {
    var target = idx[DB.companyAliases[al]];
    if (target && !idx[al]) idx[al] = target;
  });
  COMPANY_IDX = idx;
  return idx;
}
/* 别名 → 公司专页的规范名称 */
function canonicalCompanyName(name) {
  var rec = companyIndex()[name];
  return rec ? rec.name : '';
}
/* 名录/图谱里的机构名 → 公司专页规范名（同名、去括号、忽略大小写三种口径） */
function companyNameForLabel(n) {
  var idx = companyIndex();
  if (idx[n]) return idx[n].name;
  var base = String(n).replace(/（.*?）/g, '').replace(/\(.*?\)/g, '').trim();
  if (idx[base]) return idx[base].name;
  var found = '';
  Object.keys(idx).some(function (k) {
    if (idx[k].name === k && k.toLowerCase() === base.toLowerCase()) { found = k; return true; }
    return false;
  });
  return found;
}
function companyTotal() {
  var idx = companyIndex(), n = 0;
  Object.keys(idx).forEach(function (k) { if (idx[k].name === k) n++; });
  return n;
}
/* 公司 → 知识库公司页（有策展深度档案时优先用档案页） */
function kbCompanyPage(name) {
  var g = DB.kb.groups.filter(function (x) { return x.key === 'companies'; })[0];
  if (!g) return null;
  var id = EXPLAIN_KB[name];
  if (id) {
    var byId = g.pages.filter(function (p) { return p.id === id; })[0];
    if (byId) return byId;
  }
  var norm = function (s) { return String(s).replace(/（.*?）/g, '').replace(/\(.*?\)/g, '').trim().toLowerCase(); };
  var n = norm(name);
  return g.pages.filter(function (p) { return norm(p.name) === n; })[0] || null;
}
/* 公司链接：有策展档案进知识库单页，否则进自动公司专页 */
function companyLinkHref(name) {
  var canon = canonicalCompanyName(name) || name;
  var p = kbCompanyPage(canon);
  return p ? '#/kb/companies/' + p.id : companyHref(canon);
}
/* 公司页统一入口（不论有没有知识库档案，专页始终可访问） */
function currentCompanyName() {
  var segs = hashSegs();
  if (segs[0] !== 'company' || !segs[1] || segs[1] === 'node') return '';
  var n;
  try { n = decodeURIComponent(segs[1]); } catch (e) { n = segs[1]; }
  return canonicalCompanyName(n);
}
/* 单节点公司索引：#/company/node/<节点id> */
function currentCompanyNodeId() {
  var segs = hashSegs();
  if (segs[0] !== 'company' || segs[1] !== 'node' || !segs[2]) return '';
  var id;
  try { id = decodeURIComponent(segs[2]); } catch (e) { id = segs[2]; }
  return findChainNode(id) ? id : '';
}
/* 名称匹配：拉丁名按词边界（避免 Intel 命中 intelligence），中文按包含匹配 */
function companyNameRe(name) {
  var body = String(name).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  if (/[A-Za-z]/.test(name)) return new RegExp('(^|[^A-Za-z0-9])' + body + '($|[^A-Za-z0-9])', 'i');
  return new RegExp(body);
}
function companyEvidence(name) {
  var alts = [name];
  Object.keys(DB.companyAliases || {}).forEach(function (a) {
    if (DB.companyAliases[a] === name && alts.indexOf(a) < 0) alts.push(a);
  });
  var res = alts.map(companyNameRe), out = { clues: [], events: [], archive: [] };
  var hit = function (s) {
    s = String(s);
    for (var i = 0; i < res.length; i++) { if (res[i].test(s)) return true; }
    return false;
  };
  DB.clues.forEach(function (c) {
    if (hit(c.name + ' ' + c.topic + ' ' + c.quote + ' ' + c.body)) out.clues.push(c);
  });
  DB.events.forEach(function (e) {
    if (hit(e.title + ' ' + e.summary)) out.events.push(e);
  });
  out.events.sort(function (a, b) { return a.date < b.date ? 1 : -1; });
  DB.archive.forEach(function (a) { if (hit(a.t)) out.archive.push(a); });
  return out;
}
/* 富文本中的公司名自动可点：先打占位符再转义，避免重复转义与标签注入 */
function companyLinkText(text) {
  var names = Object.keys(companyIndex()).sort(function (a, b) { return b.length - a.length; });
  if (!names.length) return esc(text);
  var re = new RegExp('(' + names.map(function (n) { return n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }).join('|') + ')', 'g');
  var tokens = [];
  var marked = String(text).replace(re, function (m, _g, offset) {
    var prev = text.charAt(offset - 1), next = text.charAt(offset + m.length);
    if (/[A-Za-z0-9]/.test(m.charAt(0)) && /[A-Za-z0-9]/.test(prev)) return m;
    if (/[A-Za-z0-9]/.test(m.charAt(m.length - 1)) && /[A-Za-z0-9]/.test(next)) return m;
    tokens.push(m);
    return '\u0001' + (tokens.length - 1) + '\u0002';
  });
  return esc(marked).replace(/\u0001(\d+)\u0002/g, function (m, i) {
    var n = tokens[+i];
    return '<a href="' + companyLinkHref(n) + '">' + esc(n) + '</a>';
  });
}

/* 知识库单页：#/kb/<组>/<页id> */
function currentKbPage() {
  var segs = hashSegs();
  if (segs[0] !== 'kb' || !segs[2]) return null;
  var g = DB.kb.groups.filter(function (x) { return x.key === segs[1]; })[0];
  if (!g) return null;
  var pid;
  try { pid = decodeURIComponent(segs[2]); } catch (e) { pid = segs[2]; }
  var page = g.pages.filter(function (p) { return p.id === pid; })[0];
  return page ? { page: page, group: g } : null;
}
function kbTotal() {
  return DB.kb.groups.reduce(function (s, g) { return s + g.pages.length; }, 0);
}
function currentLibraryDoc() {
  var segs = hashSegs();
  if (segs[0] !== 'library' || !segs[2]) return '';
  try { return decodeURIComponent(segs[2]); } catch (e) { return segs[2]; }
}
function unkTotal() {
  return DB.unknowns.groups.reduce(function (s, g) { return s + g.items.length; }, 0);
}
function orgsTotal() {
  return DB.orgs.groups.reduce(function (s, g) { return s + g.items.length; }, 0);
}

/* 产业链聚合引擎：关键词对全库语料命中，按节点 memoize */
var CHAIN_STATS = {};
function chainTotal() {
  return DB.chain.layers.reduce(function (s, ly) { return s + ly.nodes.length; }, 0);
}
function nodeStats(node) {
  if (CHAIN_STATS[node.id]) return CHAIN_STATS[node.id];
  var kws = node.keywords.map(function (k) { return String(k).toLowerCase(); });
  var hit = function (s) {
    s = String(s).toLowerCase();
    for (var i = 0; i < kws.length; i++) { if (s.indexOf(kws[i]) >= 0) return true; }
    return false;
  };
  var st = {
    clues: DB.clues.filter(function (c) { return hit(c.name + ' ' + c.topic + ' ' + c.quote + ' ' + c.body); }),
    events: DB.events.filter(function (e) { return hit(e.title + ' ' + e.summary); }),
    archive: DB.archive.filter(function (a) { return hit(a.t); }),
    players: DB.players.filter(function (p) { return hit(p.name + ' ' + (p.aliases || []).join(' ') + ' ' + (p.note || '') + ' ' + (p.positioning || '')); }),
    models: DB.models.filter(function (m) { return hit(m.name + ' ' + m.org + ' ' + (m.note || '')); })
  };
  CHAIN_STATS[node.id] = st;
  return st;
}
function syncRoute(v) {
  var nm = NAMES[v];
  if (v === 'clues') {
    var c = CLUE_BY_ID[currentClueId()];
    if (c) nm = '线索：' + c.name;
  }
  if (v === 'topics') {
    var tk = currentTopicKey();
    if (tk && TOPIC_BY_KEY[tk]) nm = '主题：' + tk;
  }
  if (v === 'chain') {
    var cn = currentChainNode();
    if (cn) nm = '产业链：' + cn.node.name;
  }
  if (v === 'players') {
    var pn = currentPlayerName();
    if (pn) nm = '玩家：' + pn;
  }
  if (v === 'company') {
    var con = currentCompanyName();
    if (con) nm = '公司：' + con;
  }
  if (v === 'sectors') {
    var sid = currentSectorId();
    if (sid && sectorById(sid)) nm = '赛道档案：' + sectorById(sid).name;
  }
  if (v === 'kb') {
    var kp = currentKbPage();
    if (kp) nm = '知识库：' + kp.page.name;
  }
  var tab = state.tabs[v];
  if (tab && tabLabel(v, tab) && TABS[v][0].k !== tab) nm += ' · ' + tabLabel(v, tab);
  $('#crumbNow').textContent = nm;
  document.title = nm + ' · AI GURU 工作台';
}
function switchTo(path) { location.hash = '#/' + path; }

/* ------------------------------------------------------------ 渲染底座 */
function viewShell(v, headHtml) {
  return h(headHtml + '<div id="pane-' + v + '"></div>');
}

var RENDER = {};   /* 各视图 shell */
var PANE = {};     /* 各视图 pane 渲染（读 state.tabs[v]） */
var BIND = {};     /* 各视图一次性委托绑定（页签跳转由统一逻辑处理） */

function bindTabs() { /* 页签已全部提升为左侧菜单路由，无需视图内绑定 */ }

function enterView(v) {
  var box = $('#v-' + v);
  if (!box) return;
  state.tabs[v] = currentTabOf(v);
  if (!box.getAttribute('data-bound')) {
    box.innerHTML = RENDER[v]();
    box.setAttribute('data-bound', '1');
    if (BIND[v]) BIND[v]();
  }
  if (PANE[v]) PANE[v]();
}

/* ============================================================ 阅读指南 */
RENDER.guide = function () {
  return viewShell('guide',
    '<div class="view-head">' +
      '<h2>阅读指南<span class="en">Reading Guide</span></h2>' +
      '<div class="vh-meta"><span class="m">' + DB.guide.paths.length + ' 条路线</span><span class="m">' + DB.guide.tour.length + ' 站通读</span><span class="m">进度存本机</span></div>' +
      '<p class="lead">本台不是新闻台。<b>拆解主轴：五层产业链 × ' + chainTotal() + ' 节点</b>，一层层下钻到最细维度；新闻与线索只在节点上作为证据出现。动线：<b>拆结构 → 看玩家与赛道 → 找证据 → 做核验 → 下判断 → 落行动</b>。不知从哪进：按 P1→P7 顺序读完整套，即完成从听懂行话到能下判断的全程；或在「通读序列」里开启逐站通读模式。</p>' +
    '</div>');
};

/* 通读模式（localStorage：开关 + 已读站点） */
var TOUR_ON = 'ainews.tour.on';
var TOUR_VISITED = 'ainews.tourVisited';
function tourVisited() { try { return JSON.parse(localStorage.getItem(TOUR_VISITED) || '{}'); } catch (e) { return {}; } }
function tourMark(href) { var v = tourVisited(); if (!v[href]) { v[href] = 1; try { localStorage.setItem(TOUR_VISITED, JSON.stringify(v)); } catch (e) { /* 静默 */ } } }
function tourIsOn() { try { return localStorage.getItem(TOUR_ON) === '1'; } catch (e) { return false; } }
function tourSet(on) {
  try { if (on) localStorage.setItem(TOUR_ON, '1'); else localStorage.removeItem(TOUR_ON); } catch (e) { /* 静默 */ }
  renderTourBar();
}
function tourIndex(canon) {
  var t = DB.guide.tour || [];
  for (var i = 0; i < t.length; i++) { if (t[i].href === canon) return i; }
  return -1;
}
function renderTourBar() {
  var bar = $('#tourBar');
  if (!bar) return;
  if (!tourIsOn() || !DB.guide.tour.length) { bar.style.display = 'none'; return; }
  var canon = navCanonical(currentRoute());
  var i = tourIndex(canon);
  var t = DB.guide.tour;
  var cur = i >= 0 ? t[i] : null;
  if (cur) tourMark(canon);
  bar.style.display = 'flex';
  bar.innerHTML = '<span>通读 <b>' + (i >= 0 ? (i + 1) : '—') + ' / ' + t.length + '</b></span>' +
    (cur ? '<span>本站 <b>' + esc(cur.label) + '</b> · ' + esc(cur.note) + '</span>' : '<span class="dim">当前页不在序列内——回序列继续，或退出通读</span>') +
    '<span class="tb-ctl">' +
      (i > 0 ? '<button data-tour="prev">← 上一站</button>' : '') +
      (i >= 0 && i < t.length - 1 ? '<button data-tour="next">下一站 →</button>' : (i === t.length - 1 ? '<button data-tour="restart">读完了，回第一站</button>' : '')) +
      (i < 0 ? '<button data-tour="first">回序列起点</button>' : '') +
      '<button class="quit" data-tour="quit">退出通读</button>' +
    '</span>';
}
function bindTourBar() {
  $('#tourBar').addEventListener('click', function (e) {
    var b = e.target.closest('button[data-tour]');
    if (!b) return;
    var t = DB.guide.tour;
    var i = tourIndex(navCanonical(currentRoute()));
    var act = b.getAttribute('data-tour');
    if (act === 'quit') { tourSet(false); return; }
    if (act === 'prev' && i > 0) location.hash = t[i - 1].href;
    if (act === 'next' && i >= 0 && i < t.length - 1) location.hash = t[i + 1].href;
    if (act === 'first' || act === 'restart') location.hash = t[0].href;
  });
}

PANE.guide = function () {
  var el = $('#pane-guide');
  if (!el) return;
  var visited = tourVisited();
  var visitedCount = DB.guide.tour.filter(function (s) { return visited[s.href]; }).length;
  if (state.tabs.guide === 'tour') {
    var rows = DB.guide.tour.map(function (s, i) {
      var done = visited[s.href];
      return '<tr' + (done ? ' style="opacity:.6"' : '') + '>' +
        '<td class="mono">' + (done ? '✓' : (i + 1)) + '</td>' +
        '<td><a href="' + s.href + '"><b>' + esc(s.label) + '</b></a></td>' +
        '<td class="dim">' + esc(s.note) + '</td></tr>';
    }).join('');
    el.innerHTML = '<div class="callout pine"><div class="c-t">通读模式</div>开启后页面顶部常驻通读条：逐站前进/后退，读过即打勾（进度存本机）。' +
      '正确用法：<b>不跳站</b>——每一站读完、想清楚「它在整条链上的位置」，再进下一站。已读 <b>' + visitedCount + ' / ' + DB.guide.tour.length + '</b> 站。' +
      '<div style="margin-top:9px"><button class="fchip" id="tourStart" style="cursor:pointer;background:none">' + (tourIsOn() ? '通读模式已开启 · 回到当前进度' : '开启通读模式，从第一站开始') + '</button></div></div>' +
      '<div class="table-scroll"><table class="dense"><thead><tr><th>站</th><th>页面</th><th>这一站看什么</th></tr></thead><tbody>' + rows + '</tbody></table></div>';
    return;
  }
  var cards = DB.guide.paths.map(function (p) {
    var done = p.steps.filter(function (s) { return visited[s.href]; }).length;
    var steps = p.steps.map(function (s, i) {
      var d = visited[s.href];
      return '<div style="border-bottom:1px solid var(--line);padding:8px 0' + (i === p.steps.length - 1 ? ';border-bottom:none' : '') + '">' +
        '<div><span class="tag ' + (d ? 'gold' : 'plain') + '">' + (i + 1) + '</span> <a href="' + s.href + '"><b>' + esc(s.page) + '</b></a>' + (d ? ' <span class="dim mono" style="font-size:10px">已读</span>' : '') + '</div>' +
        '<div class="note" style="margin-top:3px">' + esc(s.what) + '</div>' +
        '<div class="note" style="margin-top:2px;color:var(--gold)">读后能回答：' + esc(s.ask) + '</div></div>';
    }).join('');
    return '<div class="card" style="margin-bottom:10px"><h4><span class="no">' + done + '/' + p.steps.length + '</span>' + esc(p.name) + '<span class="en">' + esc(p.en) + '</span></h4>' +
      '<p style="margin-bottom:6px">' + esc(p.goal) + '</p>' + steps + '</div>';
  }).join('');
  el.innerHTML = '<div class="callout"><div class="c-t">为什么按路线读</div>' + Md.render(DB.guide.intro) + '</div>' + cards;
};

BIND.guide = function () {
  $('#v-guide').addEventListener('click', function (e) {
    if (e.target.closest('#tourStart')) {
      tourSet(true);
      var t = DB.guide.tour;
      var i = tourIndex(navCanonical(currentRoute()));
      location.hash = (i >= 0 ? t[i] : t[0]).href;
    }
  });
};

/* ============================================================ 总览 */
RENDER.overview = function () {
  var n = DB.meta.counts;
  var st = DB.stats.statusCount;
  var latest = DB.events[0] || { date: '—', title: '' };
  return viewShell('overview',
    '<div class="view-head">' +
      '<h2>总览，一屏开局<span class="en">Overview</span></h2>' +
      '<div class="vh-meta"><span class="m">快照 ' + esc(DB.meta.builtAt) + '</span><span class="m">五层产业链 ' + chainTotal() + ' 节点</span><span class="m">' + n.clues + ' 线索 · ' + n.events + ' 大事 · ' + n.archive + ' 档案（证据层）</span></div>' +
      '<p class="lead">这是 <b>AI GURU 工作台</b>：用五层产业链 × ' + chainTotal() + ' 节点把 AI 全行业拆到最细维度；证据层内嵌 ' + n.clues + ' 条线索、' + n.events + ' 条大事、' + n.verify + ' 条待核实、' + n.archive + ' 条精选档案，全部由仓库 md 构建生成。最近更新 ' + esc(DB.stats.lastUpdated) + '。</p>' +
    '</div>');
};

PANE.overview = function () {
  var el = $('#pane-overview');
  if (!el) return;
  var n = DB.meta.counts;
  var st = DB.stats.statusCount;
  var latest = DB.events[0] || { date: '—', title: '', url: '', summary: '' };

  if (state.tabs.overview === 'pulse') {
    var d = DB.digest;
    var evs = d.events.slice(0, 8).map(function (line) {
      var sp = line.indexOf(' ');
      return '<li><b>' + esc(line.slice(0, sp)) + '</b> · ' + esc(line.slice(sp + 1)) + '</li>';
    }).join('');
    var chips = d.clues.slice(0, 10).map(function (c) {
      return '<a class="fchip" href="' + clueHref(c.id) + '">' + esc(c.name) + ' · ' + esc(c.updated) + '</a>';
    }).join('');
    el.innerHTML =
      '<h3 class="sec"><span class="no">01</span><span class="t">本周大事</span><span class="en">' + esc(d.range[0]) + ' → ' + esc(d.range[1]) + '</span></h3>' +
      '<ul class="plain">' + (evs || '<li class="dim">区间内无大事</li>') + '</ul>' +
      '<h3 class="sec"><span class="no">02</span><span class="t">线索在动</span><span class="en">Updates</span></h3>' +
      '<div class="fchips" style="margin:2px 0 14px">' + (chips || '<span class="dim">无</span>') + '</div>' +
      '<h3 class="sec"><span class="no">03</span><span class="t">档案摄入</span><span class="en">Archive</span></h3>' +
      '<p class="note">' + d.items + ' 条精选（' + d.days + ' 天），详见 <a href="#/digest">周报</a> 与 <a href="#/daily">日报</a>。</p>';
    return;
  }

  if (state.tabs.overview === 'radar') {
    var pend = DB.clues.filter(function (c) { return c.pending > 0; }).sort(function (a, b) { return b.pending - a.pending; });
    var pendRows = pend.slice(0, 10).map(function (c) {
      return '<tr><td><a href="' + clueHref(c.id) + '"><b>' + esc(c.name) + '</b></a></td><td>' + esc(c.topic) + '</td><td class="mono neg"><b>' + c.pending + '</b></td><td class="mono">' + esc(c.lastEvent || '—') + '</td></tr>';
    }).join('');
    var sus = DB.verify.filter(function (v) { return v.status === '❓' || v.status === '⚠️'; }).slice(0, 8).map(function (v) {
      return '<li>' + esc(v.status) + ' ' + esc(v.title) + '</li>';
    }).join('');
    el.innerHTML =
      '<div class="kpi-strip">' +
        '<div class="kpi dark"><div class="k">待核实总量</div><div class="v">' + n.verify + ' <small>条</small></div><div class="w">' + VERIFY_ORDER.map(function (m) { return m + ' ' + VERIFY_COUNTS[m]; }).join(' · ') + '</div></div>' +
        '<div class="kpi"><div class="k">含未核实标注的线索</div><div class="v">' + pend.length + ' <small>条</small></div><div class="w">线索时间线内有 ⚠️ 单源标注，采信前先看原文</div></div>' +
        '<div class="kpi"><div class="k">已核实入库</div><div class="v">' + (VERIFY_COUNTS['✅'] || 0) + ' <small>条</small></div><div class="w">核验通过并回填线索与大事记的记录</div></div>' +
        '<div class="kpi"><div class="k">线索 ⚠️ 标注总数</div><div class="v">' + DB.clues.reduce(function (s, c) { return s + c.pending; }, 0) + ' <small>处</small></div><div class="w">散落在时间线里的单源标注，全量清单见各线索</div></div>' +
      '</div>' +
      '<div class="grid g2" style="margin-top:16px">' +
        '<div><h3 class="sec"><span class="no">01</span><span class="t">存疑线索 Top</span><span class="en">Pending Clues</span></h3>' +
          '<div class="table-scroll"><table class="dense"><thead><tr><th>线索</th><th>主题</th><th>⚠️ 数</th><th>最近事件</th></tr></thead><tbody>' + (pendRows || '<tr><td colspan="4" class="dim">暂无</td></tr>') + '</tbody></table></div></div>' +
        '<div><h3 class="sec"><span class="no">02</span><span class="t">高风险待核实</span><span class="en">Suspects</span></h3>' +
          '<ul class="plain">' + (sus || '<li class="dim">暂无</li>') + '</ul>' +
          '<div class="callout red"><div class="c-t">纪律</div>宁可漏收，不可错收：❓ 高度可疑的事件在核验通过前<b>不进入</b>线索与大事记正文。</div></div>' +
      '</div>';
    return;
  }

  if (state.tabs.overview === 'unknowns') {
    var groups = DB.unknowns.groups;
    var cards = groups.map(function (g, gi) {
      var lis = g.items.map(function (it, i) {
        return '<div class="callout" style="margin:8px 0"><div class="c-t">' + esc(g.name) + ' · U' + (gi + 1) + '-' + (i + 1) + '</div>' +
          '<b>' + esc(it.q) + '</b>' +
          '<div class="prov-row"><span class="k">为何未知</span><p>' + esc(it.why) + '</p></div>' +
          '<div class="prov-row"><span class="k">获取路径</span><p>' + esc(it.how) + '</p></div></div>';
      }).join('');
      return '<h3 class="sec"><span class="no">' + g.items.length + '</span><span class="t">' + esc(g.name) + '</span><span class="en">Unknowns</span></h3>' + lis;
    }).join('');
    el.innerHTML = '<div class="callout red"><div class="c-t">开放问题 · ' + unkTotal() + ' 条 · 更新 ' + esc(DB.unknowns.updated) + '</div>' +
      '参考台纪律的本地化：<b>每个模块显式列出「不知道什么」</b>——问题、为何未知、获取路径三字段。未知不是缺陷陈列，是研究议程；每清一条，本台信息量涨一格。' +
      '与<a href="#/verify/queue">事实核查</a>（已知存疑）互为镜像。</div>' +
      '<div class="grid g2">' + groups.map(function (g, gi) {
        return '<div class="card"><h4><span class="no">0' + (gi + 1) + '</span>' + esc(g.name) + '<span class="en">' + g.items.length + ' 条</span></h4>' +
          '<ul class="plain">' + g.items.map(function (it) { return '<li>' + esc(it.q) + '</li>'; }).join('') + '</ul></div>';
      }).join('') + '</div>' +
      '<h3 class="sec" style="margin-top:20px"><span class="no">详情</span><span class="t">逐条展开</span><span class="en">Detail</span></h3>' + cards;
    return;
  }

  /* 全景（默认） */
  var tl = DB.events.slice(0, 8).map(function (e) {
    return '<li>' +
      '<div class="ph">' + esc(e.date.slice(0, 7)) + '<span class="when">' + esc(e.date) + '</span></div>' +
      '<div class="tt">' + extLink(e.url, esc(e.title)) + '</div>' +
      '<div class="td">' + summaryHtml(e.summary, 110) + '</div></li>';
  }).join('');
  var hotRows = DB.stats.hotClues.map(function (c, i) {
    var rk = '<span class="rk ' + (i < 3 ? 't' + (i + 1) : '') + '">' + (i + 1) + '</span>';
    return '<tr>' +
      '<td class="mono">' + rk + '</td>' +
      '<td><a href="' + clueHref(c.id) + '"><b>' + esc(c.name) + '</b></a></td>' +
      '<td>' + esc(c.topic) + '</td>' +
      '<td class="mono"><b>' + c.n + '</b></td>' +
      '<td class="mono">' + esc(c.last || '—') + '</td></tr>';
  }).join('');
  function navCard(no, title, en, desc, links) {
    return '<div class="card"><h4><span class="no">' + no + '</span>' + title + '<span class="en">' + en + '</span></h4><p>' + desc + '</p><div class="lk">' + links + '</div></div>';
  }
  var analysisTotal = DB.clues.reduce(function (s, c) { return s + (c.nAnalysis || 0); }, 0);
  var srcSet = {};
  DB.archive.forEach(function (a) { if (a.s) srcSet[a.s] = 1; });
  var capEvs = capitalEvs();
  var capSum = 0;
  capEvs.forEach(function (e) { if (e.meta && e.meta.amountUsd) capSum += e.meta.amountUsd; });
  var assetFlow = '<div class="flow" style="margin-top:14px">' +
    '<div class="step"><div class="t">观点判断</div><div class="v">' + analysisTotal + ' <small style="font-size:12px">条</small></div><div class="d">' + n.clues + ' 条线索「分析」段的结构化观点，见 <a href="#/clues/analysis">观点库</a></div></div>' +
    '<div class="step"><div class="t">档案来源</div><div class="v">' + Object.keys(srcSet).length + ' <small style="font-size:12px">个</small></div><div class="d">' + n.archive + ' 条精选档案的独立信源，见 <a href="#/archive/sources">来源分布</a></div></div>' +
    '<div class="step"><div class="t">模型登记</div><div class="v">' + DB.models.length + ' <small style="font-size:12px">个</small></div><div class="d">前沿模型规格登记册，待回填字段持续填数</div></div>' +
    '<div class="step"><div class="t">资本事件</div><div class="v">' + capEvs.length + ' <small style="font-size:12px">条</small></div><div class="d">披露合计约 ' + (capSum >= 10000 ? (capSum / 10000) + ' 万亿' : capSum + ' 亿') + ' 美元，见 <a href="#/capital/rank">金额榜</a></div></div>' +
  '</div>';
  el.innerHTML = h(
    '<div class="kpi-strip">' +
      '<div class="kpi dark"><div class="k">拆解主轴</div><div class="v">L1–L5 <small>× ' + chainTotal() + ' 节点</small></div><div class="w">算力硬件 → 数据模型 → 平台工具 → 行业应用 → 商业生态，逐层下钻</div></div>' +
      '<div class="kpi"><div class="k">证据层</div><div class="v">' + n.clues + ' 线索 <small>+' + n.archive + ' 档案</small></div><div class="w">活跃 ' + (st['活跃'] || 0) + ' · 观察中 ' + (st['观察中'] || 0) + ' · 已完结 ' + (st['已完结'] || 0) + '，只挂在节点上</div></div>' +
      '<div class="kpi"><div class="k">待核实</div><div class="v">' + n.verify + ' <small>条</small></div><div class="w">' + VERIFY_ORDER.map(function (m) { return m + ' ' + VERIFY_COUNTS[m]; }).join(' · ') + '，详见风险雷达</div></div>' +
      '<div class="kpi"><div class="k">大事记 · 最新</div><div class="v">' + esc(latest.date) + ' <small>' + esc(latest.title.slice(0, 14)) + '</small></div><div class="w">2025–2026 两卷归档，仅收官方一手源与多源印证</div></div>' +
    '</div>' +

    '<div class="grid g4 map-grid" style="margin-top:14px">' +
      navCard('01', '拆解主轴', 'Anatomy', '五层产业链 ' + chainTotal() + ' 节点把全行业拆到最细维度：节点页聚合线索、大事、档案与玩家，聚合为零即采集缺口。', '<a href="#/chain">产业链全景</a><a href="#/topics">横向主题域</a><a href="#/sectors">赛道矩阵</a>') +
      navCard('02', '竞争与赛道', 'Landscape', '节点上的玩家、赛道评分、模型登记册与定价成本——结构与竞争的两个观察面。', '<a href="#/players">玩家</a><a href="#/scores">评分卡</a><a href="#/models">模型</a><a href="#/sim">推理账单</a>') +
      navCard('03', '证据与信号', 'Evidence', n.clues + ' 条线索时间线、' + n.events + ' 条大事、' + n.archive + ' 条档案：新闻只在这里作为证据存在。', '<a href="#/clues">线索库</a><a href="#/chronicle">大事记</a><a href="#/archive">语料检索</a><a href="#/daily">日报</a>') +
      navCard('04', '核验与判断', 'Trust & Judgment', '待核实清单、开放问题、议题账本与决策台：证据先过核验，再落成可结算的判断。', '<a href="#/verify">事实核查</a><a href="#/overview/unknowns">开放问题</a><a href="#/theses">议题</a><a href="#/decisions">决策台</a>') +
    '</div>' +
    assetFlow +

    '<div class="grid g2" style="margin-top:18px">' +
      '<div>' +
        '<h3 class="sec"><span class="no">01</span><span class="t">最热线索</span><span class="en">Top Clues</span></h3>' +
        '<div class="table-scroll"><table class="dense"><thead><tr><th>序</th><th>线索</th><th>主题</th><th>时间线条目</th><th>最近事件</th></tr></thead><tbody>' + hotRows + '</tbody></table></div>' +
      '</div>' +
      '<div>' +
        '<h3 class="sec"><span class="no">02</span><span class="t">最新大事</span><span class="en">Latest</span></h3>' +
        '<ul class="timeline">' + tl + '</ul>' +
        '<div class="callout"><div class="c-t">真实性约定</div><b>宁可漏收，不可错收。</b>大事记仅收「官方一手源 + ≥2 家主流媒体交叉印证」；存疑事件进入 <a href="#/verify">待核实清单</a>，核验通过才回填线索与大事记。</div>' +
      '</div>' +
    '</div>'
  );
};

/* ============================================================ 主题 */
RENDER.topics = function () {
  return viewShell('topics',
    '<div class="view-head">' +
      '<h2>主题<span class="en">Topics</span></h2>' +
      '<div class="vh-meta"><span class="m">' + DB.topics.length + ' 主题</span><span class="m">真相文件 _topics.md</span><span class="m">点击行进主题详情</span></div>' +
      '<p class="lead">主题域是拆解的横向切面：' + DB.topics.length + ' 个领域与五层产业链（<a href="#/chain">纵向主轴</a>）正交。每个主题一份定义、若干线索与关联大事。</p>' +
    '</div>');
};

PANE.topics = function () {
  var el = $('#pane-topics');
  if (!el) return;
  var tk = currentTopicKey();
  var t = TOPIC_BY_KEY[tk];
  if (t) {
    var clueRows = DB.clues.filter(function (c) { return c.topic === tk; }).map(function (c) {
      return '<tr><td><a href="' + clueHref(c.id) + '"><b>' + esc(c.name) + '</b></a></td><td>' + statusTag(c.status) + '</td><td class="mono"><b>' + c.nEvents + '</b></td><td class="mono">' + esc(c.lastEvent || '—') + '</td><td class="mono">' + esc(c.updated) + '</td></tr>';
    }).join('');
    var evs = topicEvents(tk).slice(0, 12).map(function (e) {
      return '<li><b>' + esc(e.date) + '</b> · ' + extLink(e.url, esc(e.title)) + srcRef(e.url) + '<div class="dim" style="font-size:11.5px">' + summaryHtml(e.summary, 90) + '</div></li>';
    }).join('');
    el.innerHTML = h(
      '<div class="callout pine"><div class="c-t">范围定义</div>' + esc(t.def) + '</div>' +
      (t.idx ? '<details style="margin:10px 0"><summary style="cursor:pointer;font-weight:600">主题 _index.md（主题说明 · 线索列表 · 候选线索）</summary><div class="md-body" style="margin-top:8px">' + termify(Md.render(t.idx, { base: t.key + '/_index.md' })) + '</div></details>' : '') +
      '<div class="grid g2">' +
        '<div><h3 class="sec"><span class="no">' + t.count + '</span><span class="t">本主题线索</span><span class="en">Clues</span></h3>' +
          '<div class="table-scroll"><table class="dense"><thead><tr><th>线索</th><th>状态</th><th>时间线</th><th>最近事件</th><th>更新</th></tr></thead><tbody>' + (clueRows || '<tr><td colspan="5" class="dim">暂无线索</td></tr>') + '</tbody></table></div></div>' +
        '<div><h3 class="sec"><span class="no">' + topicEvents(tk).length + '</span><span class="t">关联大事</span><span class="en">Events</span></h3>' +
          '<ul class="plain">' + (evs || '<li class="dim">暂无</li>') + '</ul><p class="note" style="margin-top:8px"><a href="#/topics">← 回主题总表</a></p></div>' +
      '</div>');
    return;
  }
  if (state.tabs.topics === 'coverage') {
    var secById = {};
    DB.score.sectors.forEach(function (s) { secById[s.id] = s; });
    var rows = DB.topics.map(function (t) {
      var sec = secById[t.key] || { dims: {} };
      var mom = sec.dims ? (sec.dims.momentum || 0) : 0;
      var ev = topicEvents(t.key).length;
      var latest = '';
      DB.clues.forEach(function (c) { if (c.topic === t.key && c.updated > latest) latest = c.updated; });
      var days = latest ? Math.round((new Date(TODAY) - new Date(latest)) / 86400000) : null;
      var status, cls;
      if (t.count === 0) { status = '未建线'; cls = 'plain'; }
      else if (mom >= 4 && t.count <= 2) { status = '高优缺口'; cls = 'neg'; }
      else if (days !== null && days > 45 && mom >= 4) { status = '冷却预警'; cls = ''; }
      else { status = '常规'; cls = 'plain'; }
      return { t: t, mom: mom, ev: ev, latest: latest, days: days, status: status, cls: cls };
    }).sort(function (a, b) { return (b.mom * 100 - b.t.count) - (a.mom * 100 - a.t.count); });
    var gaps = rows.filter(function (r) { return r.status === '高优缺口'; });
    var cool = rows.filter(function (r) { return r.status === '冷却预警'; });
    var fresh = rows.filter(function (r) { return r.days !== null && r.days <= 45; }).length;
    var trows = rows.map(function (r) {
      return '<tr>' +
        '<td><a href="#/topics/' + encodeURIComponent(r.t.key) + '"><b>' + esc(r.t.key) + '</b></a></td>' +
        '<td class="mono"><b>' + r.mom + '</b></td>' +
        '<td class="mono">' + r.t.count + '</td>' +
        '<td class="mono">' + (r.ev || '—') + '</td>' +
        '<td class="mono">' + esc(r.latest || '—') + (r.days !== null ? ' <span class="dim">(' + r.days + ' 天前)</span>' : '') + '</td>' +
        '<td><span class="tag ' + r.cls + '">' + esc(r.status) + '</span></td></tr>';
    }).join('');
    el.innerHTML = '<div class="kpi-strip">' +
        '<div class="kpi dark"><div class="k">高优缺口</div><div class="v">' + gaps.length + ' <small>个</small></div><div class="w">势能 ≥4 而线索 ≤2 的赛道——业界在跑，本库没跟</div></div>' +
        '<div class="kpi"><div class="k">冷却预警</div><div class="v">' + cool.length + ' <small>个</small></div><div class="w">高势能但 45 天未更新线索</div></div>' +
        '<div class="kpi"><div class="k">45 天内更新过</div><div class="v">' + fresh + ' <small>/ ' + DB.topics.length + ' 主题</small></div><div class="w">以最新数据日 ' + esc(TODAY) + ' 为锚</div></div>' +
        '<div class="kpi"><div class="k">关联大事密度</div><div class="v">' + rows.reduce(function (s, r) { return s + r.ev; }, 0) + ' <small>条</small></div><div class="w">按双链主题前缀统计</div></div>' +
      '</div>' +
      '<div class="table-scroll" style="margin-top:16px"><table class="dense"><thead><tr><th>主题</th><th>势能</th><th>线索</th><th>关联大事</th><th>最近更新</th><th>状态</th></tr></thead><tbody>' + trows + '</tbody></table></div>' +
      '<p class="note" style="margin-top:10px">覆盖分是反身指标（研究红线第 7 条）：低分赛道先补信源，再下结论。与<a href="#/sectors/gaps">研究缺口</a>互为印证。</p>';
    return;
  }
  var rows = DB.topics.map(function (x) {
    var names = x.clues.slice(0, 4).map(function (id) { return id.split('/')[1]; }).join('、');
    return '<tr data-topic="' + esc(x.key) + '" style="cursor:pointer">' +
      '<td><b>' + esc(x.key) + '</b></td>' +
      '<td class="mono dim">' + esc(x.en) + '</td>' +
      '<td class="mono"><b>' + x.count + '</b></td>' +
      '<td>' + esc(names) + (x.count > 4 ? ' 等' : '') + '</td>' +
      '<td>' + esc(x.def) + '</td></tr>';
  }).join('');
  el.innerHTML = '<div class="table-scroll"><table class="dense"><thead><tr><th>主题</th><th>英文</th><th>线索数</th><th>线索</th><th>范围</th></tr></thead><tbody>' + rows + '</tbody></table></div>';
};

BIND.topics = function () {
  $('#v-topics').addEventListener('click', function (e) {
    var tr = e.target.closest('tr[data-topic]');
    if (tr) switchTo('topics/' + encodeURIComponent(tr.getAttribute('data-topic')));
  });
};

/* ============================================================ 线索库 */
RENDER.clues = function () {
  return viewShell('clues',
    '<div class="view-head">' +
      '<h2>线索库<span class="en">Clue Library</span></h2>' +
      '<div class="vh-meta"><span class="m">' + DB.clues.length + ' 条线索</span><span class="m">点击行进详情</span><span class="m">分页：列表 / 热榜 / 观点库 / 收录动态</span></div>' +
      '<p class="lead">证据层的原子单位：每条线索一份时间线文档——概述给事实，时间线给脉络，分析给观点，关联线索给网络。观点库聚合全部「分析」段，是事实与观点分离设计的观点侧总账。</p>' +
    '</div>');
};

function cluesListHtml() {
  var seg = STATUS_ORDER.map(function (s) {
    var cnt = s === 'all' ? DB.clues.length : DB.clues.filter(function (c) { return c.status === s; }).length;
    return '<button data-s="' + s + '"' + (state.cStatus === s ? ' class="on"' : '') + '>' + (s === 'all' ? '全部 ' : s + ' ') + cnt + '</button>';
  }).join('');
  var q = state.cQuery.trim().toLowerCase();
  var rows = DB.clues.filter(function (c) {
    if (state.cStatus !== 'all' && c.status !== state.cStatus) return false;
    if (state.cTopic && c.topic !== state.cTopic) return false;
    if (!q) return true;
    var hay = (c.name + ' ' + c.topic + ' ' + c.alias.join(' ') + ' ' + c.roles.join(' ') + ' ' + c.quote).toLowerCase();
    return hay.indexOf(q) >= 0;
  });
  var html = rows.map(function (c) {
    return '<tr data-clue="' + esc(c.id) + '" style="cursor:pointer">' +
      '<td class="mono dim">' + esc(c.topic) + '</td>' +
      '<td><b>' + esc(c.name) + '</b>' + (c.alias.length ? ' <span class="dim mono" style="font-size:10px">' + esc(c.alias.slice(0, 2).join(' / ')) + '</span>' : '') + '</td>' +
      '<td>' + statusTag(c.status) + '</td>' +
      '<td class="mono"><b>' + c.nEvents + '</b></td>' +
      '<td class="mono">' + esc(c.lastEvent || '—') + '</td>' +
      '<td class="mono dim">' + esc(c.roles.slice(0, 3).join('、')) + (c.roles.length > 3 ? ' 等' : '') + '</td>' +
      '<td class="mono">' + esc(c.updated) + '</td></tr>';
  }).join('');
  return '<div class="tools">' +
      '<span class="seg" id="clueSeg">' + seg + '</span>' +
      '<input class="finput" id="clueQuery" placeholder="筛选线索，主题，别名，角色" autocomplete="off">' +
      '<span class="count" id="clueCount"></span>' +
    '</div>' +
    '<div id="clueTopicRow"></div>' +
    '<div class="table-scroll"><table class="dense"><thead><tr><th>主题</th><th>线索</th><th>状态</th><th>时间线</th><th>最近事件</th><th>关键角色</th><th>更新</th></tr></thead><tbody>' +
    (html || '<tr><td colspan="7" class="dim">无匹配线索</td></tr>') + '</tbody></table></div>' +
    '<p class="note" style="margin-top:10px">' + rows.length + ' / ' + DB.clues.length + ' 条 · 时间线列为累计登记事件数。</p>';
}

function cluesAnalysisHtml() {
  var total = DB.clues.reduce(function (s, c) { return s + (c.nAnalysis || 0); }, 0);
  var html = '';
  DB.topics.forEach(function (t) {
    var cs = DB.clues.filter(function (c) { return c.topic === t.key && c.analysis; });
    if (!cs.length) return;
    html += '<h3 class="sec"><span class="no">' + cs.length + '</span><span class="t">' + esc(t.key) + '</span><span class="en">' + esc(t.en || '') + '</span></h3>';
    cs.forEach(function (c) {
      html += '<h4 class="sub"><a href="' + clueHref(c.id) + '">' + esc(c.name) + '</a> <span class="src">' + (c.nAnalysis || '—') + ' 条判断 · 更新 ' + esc(c.updated) + '</span></h4>' +
        '<div class="md-body">' + Md.render(c.analysis, { base: c._src }) + '</div>';
    });
  });
  return '<div class="callout pine"><div class="c-t">观点库</div>聚合 ' + DB.clues.length + ' 条线索「分析」段共 <b>' + total + '</b> 条结构化判断。这是本库「事实与观点分离」设计的观点侧总账：事实在时间线，判断在这里，可整段检索、可被议题账本引用。</div>' + html;
}

function cluesHotHtml() {
  var sorted = DB.clues.slice().sort(function (a, b) { return b.nEvents - a.nEvents; });
  var max = sorted.length ? sorted[0].nEvents : 1;
  var rows = sorted.map(function (c, i) {
    var rk = '<span class="rk ' + (i < 3 ? 't' + (i + 1) : '') + '">' + (i + 1) + '</span>';
    return '<tr>' +
      '<td class="mono">' + rk + '</td>' +
      '<td><a href="' + clueHref(c.id) + '"><b>' + esc(c.name) + '</b></a></td>' +
      '<td>' + esc(c.topic) + '</td>' +
      '<td class="mono"><b>' + c.nEvents + '</b> ' + bar(c.nEvents, max, 'var(--navy)') + '</td>' +
      '<td class="mono">' + esc(c.lastEvent || '—') + '</td>' +
      '<td class="mono">' + (c.verified ? '<span class="pos">✅' + c.verified + '</span> ' : '') + (c.pending ? '<span class="neg">⚠️' + c.pending + '</span>' : '') + (!(c.verified || c.pending) ? '—' : '') + '</td>' +
      '<td class="mono">' + (c.nAnalysis || '—') + '</td>' +
      '<td class="mono dim">' + esc(c.months) + ' 个月</td>' +
      '<td class="mono">' + esc(c.updated) + '</td></tr>';
  }).join('');
  return '<div class="table-scroll"><table class="dense"><thead><tr><th>序</th><th>线索</th><th>主题</th><th>时间线条目</th><th>最近事件</th><th>✅⚠️</th><th>观点</th><th>跨度</th><th>更新</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
    '<p class="note" style="margin-top:10px">热榜按时间线条目数排序；✅⚠️ 列是该线索时间线内的核实/存疑标注数，观点列为「分析」段判断条数。</p>';
}

function cluesUpdatesHtml() {
  var rows = DB.clues.map(function (c) {
    return '<tr><td class="mono"><b>' + esc(c.updated) + '</b></td>' +
      '<td><a href="' + clueHref(c.id) + '"><b>' + esc(c.name) + '</b></a></td>' +
      '<td>' + esc(c.topic) + '</td>' +
      '<td class="mono">' + c.nEvents + '</td>' +
      '<td class="mono">' + esc(c.lastEvent || '—') + '</td>' +
      '<td class="mono dim">' + esc(c.created) + '</td></tr>';
  }).join('');
  return '<div class="table-scroll"><table class="dense"><thead><tr><th>更新</th><th>线索</th><th>主题</th><th>时间线</th><th>最近事件</th><th>创建</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
    '<p class="note" style="margin-top:10px">按线索「更新」字段倒序——最近动手整理的是哪些线，一目了然。</p>';
}

PANE.clues = function () {
  var el = $('#pane-clues');
  if (!el) return;
  var cid = currentClueId();
  if (cid) {
    if (el.getAttribute('data-render') !== cid) {
      el.setAttribute('data-render', cid);
      el.innerHTML = RENDER.clueDetail(cid);
    }
    return;
  }
  el.removeAttribute('data-render');
  var tab = state.tabs.clues;
  if (tab === 'hot') el.innerHTML = cluesHotHtml();
  else if (tab === 'analysis') el.innerHTML = cluesAnalysisHtml();
  else if (tab === 'updates') el.innerHTML = cluesUpdatesHtml();
  else el.innerHTML = cluesListHtml();
  if (tab === 'list') {
    var seg = $('#clueSeg');
    if (seg) $$('button', seg).forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-s') === state.cStatus); });
    var tr = $('#clueTopicRow');
    if (tr) {
      tr.innerHTML = state.cTopic
        ? '<div class="fchips" style="margin:2px 0 10px"><a class="fchip" href="#/topics">主题筛选：' + esc(state.cTopic) + ' ✕</a></div>'
        : '';
    }
  }
};

RENDER.clueDetail = function (cid) {
  var c = CLUE_BY_ID[cid];
  if (!c) {
    return '<div class="view-head"><h2>未找到线索<span class="en">Not Found</span></h2></div><div class="callout red"><div class="c-t">404</div>台内没有 <b class="mono">' + esc(cid) + '</b> 这条线索。<a href="#/clues">回线索库</a>。</div>';
  }
  var t = TOPIC_BY_KEY[c.topic] || {};
  var meta = [statusTag(c.status), '创建 ' + c.created, '更新 ' + c.updated, c.nEvents + ' 条时间线事件']
    .map(function (m) { return '<span class="m">' + m + '</span>'; }).join('');
  var chips = [];
  c.alias.forEach(function (a) { if (c.roles.indexOf(a) < 0) chips.push('<a class="fchip" href="#/clues">' + esc(a) + '</a>'); });
  c.roles.forEach(function (r) { chips.push('<a class="fchip" href="#/players">' + esc(r) + '</a>'); });
  chips.push('<a class="fchip" href="../' + encodeURI(c._src) + '" target="_blank" rel="noopener">源文件 ' + esc(c._src) + '</a>');
  return h(
    '<div class="view-head">' +
      '<h2>' + esc(c.name) + '<span class="en">' + esc(c.topic) + (t.en ? ' · ' + esc(t.en) : '') + '</span></h2>' +
      '<div class="vh-meta">' + meta + '</div>' +
      (c.quote ? '<p class="lead">' + esc(c.quote) + '</p>' : '') +
      (chips.length ? '<div class="fchips">' + chips.join('') + '</div>' : '') +
      '<div class="fchips" style="margin-top:8px"><a class="fchip" href="#/clues">← 回线索库</a></div>' +
    '</div>' +
    '<div class="md-body">' + Md.render(c.body, { base: c._src }) + '</div>' +
    '<p class="src" style="margin-top:18px">源文件：' + esc(c._src) + ' · 构建于 ' + esc(DB.meta.builtAt) + '</p>'
  );
};

BIND.clues = function () {
  var box = $('#v-clues');
  box.addEventListener('click', function (e) {
    var b = e.target.closest('#clueSeg button');
    if (b) { state.cStatus = b.getAttribute('data-s'); PANE.clues(); return; }
    var chip = e.target.closest('#clueTopicRow .fchip');
    if (chip) { state.cTopic = ''; PANE.clues(); return; }
    var tr = e.target.closest('tr[data-clue]');
    if (tr) { location.hash = clueHref(tr.getAttribute('data-clue')); }
  });
  box.addEventListener('input', function (e) {
    if (e.target.id === 'clueQuery') { state.cQuery = e.target.value; PANE.clues(); }
  });
};

/* ============================================================ 大事记 */
RENDER.chronicle = function () {
  return viewShell('chronicle',
    '<div class="view-head">' +
      '<h2>大事记<span class="en">Chronicle</span></h2>' +
      '<div class="vh-meta"><span class="m">' + DB.events.length + ' 条</span><span class="m">2025–2026 两卷</span><span class="m">官方一手源 + 多源印证</span><span class="m">类型为规则自动打标</span></div>' +
      '<p class="lead">证据层的年鉴：年度重点事件一行登记——标题直连原始信源，摘要给一句话事实，箭头双链跳转对应线索。</p>' +
    '</div>');
};

function chronFlowHtml() {
  var years = {};
  DB.events.forEach(function (e) { years[e.year] = (years[e.year] || 0) + 1; });
  var seg = '<button data-y="all"' + (state.chYear === 'all' ? ' class="on"' : '') + '>全部 ' + DB.events.length + '</button>';
  Object.keys(years).sort().reverse().forEach(function (y) {
    seg += '<button data-y="' + y + '"' + (state.chYear === y ? ' class="on"' : '') + '>' + y + ' ' + years[y] + '</button>';
  });
  var cats = Object.keys(DB.stats.eventsByCat).sort(function (a, b) { return DB.stats.eventsByCat[b] - DB.stats.eventsByCat[a]; });
  var catSeg = '<button data-c="all"' + (state.chCat === 'all' ? ' class="on"' : '') + '>全部类型</button>';
  cats.forEach(function (c) {
    catSeg += '<button data-c="' + c + '"' + (state.chCat === c ? ' class="on"' : '') + '>' + c + ' ' + DB.stats.eventsByCat[c] + '</button>';
  });
  var evs = DB.events.filter(function (e) {
    if (state.chYear !== 'all' && e.year !== state.chYear) return false;
    if (state.chCat !== 'all' && (e.cats || []).indexOf(state.chCat) < 0) return false;
    return true;
  });
  var byMonth = {};
  evs.forEach(function (e) { var k = e.date.slice(0, 7); (byMonth[k] = byMonth[k] || []).push(e); });
  var months = Object.keys(byMonth).sort().reverse();
  var html = months.map(function (mo) {
    var lis = byMonth[mo].map(function (e) {
      var links = evLinks(e);
      return '<li>' +
        '<div class="ph">' + esc(mo) + '<span class="when">' + esc(e.date) + '</span>' + srcRef(e.url) + '</div>' +
        '<div class="tt">' + extLink(e.url, esc(e.title)) + '</div>' +
        '<div class="td">' + summaryHtml(e.summary, 0) + (links ? '　→ ' + links : '') + '</div></li>';
    }).join('');
    return '<h3 class="sec"><span class="no">' + esc(mo) + '</span><span class="t">' + byMonth[mo].length + ' 条</span><span class="en">Month</span></h3><ul class="timeline">' + lis + '</ul>';
  }).join('');
  return '<div class="tools"><span class="seg" id="chronSeg">' + seg + '</span><span class="seg" id="chronCat">' + catSeg + '</span><span class="count" id="chronCount"></span></div>' +
    (html || '<div class="callout">该筛选下暂无条目。</div>') +
    '<p class="note" style="margin-top:10px" id="chronCount2"></p>';
}

PANE.chronicle = function () {
  var el = $('#pane-chronicle');
  if (!el) return;
  var tab = state.tabs.chronicle;
  if (tab === 'monthly') {
    var months = DB.stats.eventsByMonth;
    var keys = Object.keys(months);
    var max = keys.length ? months[keys[0]] : 1;
    var rows = keys.map(function (m) {
      return '<tr><td class="mono"><b>' + esc(m) + '</b></td><td class="mono"><b>' + months[m] + '</b> ' + bar(months[m], max) + '</td></tr>';
    }).join('');
    var cats = DB.stats.eventsByCat;
    var cmax = Math.max.apply(null, [1].concat(Object.keys(cats).map(function (k) { return cats[k]; })));
    var catRows = Object.keys(cats).sort(function (a, b) { return cats[b] - cats[a]; }).map(function (c) {
      return '<tr><td><span class="tag">' + esc(c) + '</span></td><td class="mono"><b>' + cats[c] + '</b> ' + bar(cats[c], cmax, 'var(--gold-2)') + '</td><td class="dim">' + (c === '资本' ? '收购/并购/融资/IPO' : c === '发布' ? '产品与模型发布/开源/降价' : c === '监管' ? '法案/法院/出口管制/执法' : c === '安全' ? '逃逸/攻击/Critical/水印' : c === '研究' ? '基准/SOTA/评测/证明' : c === '人事' ? '离职/创办/接任' : '其余行业事件') + '</td></tr>';
    }).join('');
    el.innerHTML = '<div class="grid g2">' +
      '<div><h3 class="sec"><span class="no">01</span><span class="t">月度节奏</span><span class="en">Monthly</span></h3><div class="table-scroll"><table class="dense"><thead><tr><th>月份</th><th>条数</th></tr></thead><tbody>' + rows + '</tbody></table></div></div>' +
      '<div><h3 class="sec"><span class="no">02</span><span class="t">类型分布</span><span class="en">By Category</span></h3><div class="table-scroll"><table class="dense"><thead><tr><th>类型</th><th>条数</th><th>口径</th></tr></thead><tbody>' + catRows + '</tbody></table></div>' +
      '<p class="note" style="margin-top:8px">类型为关键词规则自动打标，优先级：资本 &gt; 人事 &gt; 监管 &gt; 安全 &gt; 研究 &gt; 发布；一条事件可属多类。</p></div></div>';
    return;
  }
  if (tab === 'hubs') {
    var hubs = DB.events.filter(function (e) { return (e.links || []).length >= 2; });
    var rows = hubs.map(function (e) {
      return '<tr><td class="mono dim">' + esc(e.date) + '</td><td>' + extLink(e.url, esc(e.title)) + srcRef(e.url) + '</td><td>' + evLinks(e) + '</td></tr>';
    }).join('');
    el.innerHTML = '<h3 class="sec"><span class="no">' + hubs.length + '</span><span class="t">枢纽事件</span><span class="en">Multi-link</span></h3>' +
      '<div class="table-scroll"><table class="dense"><thead><tr><th>日期</th><th>事件</th><th>关联线索</th></tr></thead><tbody>' + (rows || '<tr><td colspan="3" class="dim">暂无多链事件</td></tr>') + '</tbody></table></div>' +
      '<p class="note" style="margin-top:10px">一条事件同时沉淀到两条以上线索 = 格局级事件；它们最适合作为周报头条与分析起点。</p>';
    return;
  }
  el.innerHTML = chronFlowHtml();
  var cnt = $('#chronCount');
  if (cnt) {
    var evs = DB.events.filter(function (e) {
      if (state.chYear !== 'all' && e.year !== state.chYear) return false;
      if (state.chCat !== 'all' && (e.cats || []).indexOf(state.chCat) < 0) return false;
      return true;
    });
    cnt.textContent = evs.length + ' 条';
  }
};

BIND.chronicle = function () {
  $('#v-chronicle').addEventListener('click', function (e) {
    var b = e.target.closest('#chronSeg button');
    if (b) { state.chYear = b.getAttribute('data-y'); PANE.chronicle(); return; }
    var cb = e.target.closest('#chronCat button');
    if (cb) { state.chCat = cb.getAttribute('data-c'); PANE.chronicle(); }
  });
};

/* ============================================================ 语料检索 */
RENDER.archive = function () {
  return viewShell('archive',
    '<div class="view-head">' +
      '<h2>语料检索<span class="en">Archive</span></h2>' +
      '<div class="vh-meta"><span class="m">' + DB.archive.length + ' 条精选资讯</span><span class="m">aihot-mirror，2017 至今</span><span class="m">标题与来源级检索</span></div>' +
      '<p class="lead">镜像站每日精选的全量索引：回答「这个话题历史上都报过什么」。命中后按日期回看当天全量，见<a href="#/daily">日报</a>。</p>' +
    '</div>');
};

function archiveSearchHtml() {
  var years = {};
  DB.archive.forEach(function (a) { years[a.d.slice(0, 4)] = (years[a.d.slice(0, 4)] || 0) + 1; });
  var seg = '<button data-y="all"' + (state.aYear === 'all' ? ' class="on"' : '') + '>全部</button>';
  Object.keys(years).sort().reverse().forEach(function (y) {
    seg += '<button data-y="' + y + '"' + (state.aYear === y ? ' class="on"' : '') + '>' + y + '</button>';
  });
  return '<div class="tools">' +
      '<span class="seg" id="archYear">' + seg + '</span>' +
      '<input class="finput" id="archQuery" placeholder="检索标题，来源" autocomplete="off">' +
      '<span class="count" id="archCount"></span>' +
    '</div><div class="table-scroll" id="archWrap"></div>' +
    '<p class="note" style="margin-top:10px">默认展示最新 100 条；条目正文在镜像站源站，点标题直达。</p>';
}

PANE.archive = function () {
  var el = $('#pane-archive');
  if (!el) return;
  var tab = state.tabs.archive;
  if (tab === 'sources') {
    var bySrc = {};
    DB.archive.forEach(function (a) { var k = a.s || '（未标来源）'; bySrc[k] = bySrc[k] || { n: 0, last: '' }; bySrc[k].n++; if (a.d > bySrc[k].last) bySrc[k].last = a.d; });
    var list = Object.keys(bySrc).sort(function (a, b) { return bySrc[b].n - bySrc[a].n; }).slice(0, 25);
    var max = list.length ? bySrc[list[0]].n : 1;
    var rows = list.map(function (s) {
      return '<tr><td>' + esc(s) + '</td><td class="mono"><b>' + bySrc[s].n + '</b> ' + bar(bySrc[s].n, max, 'var(--gold-2)') + '</td><td class="mono dim">' + bySrc[s].last + '</td></tr>';
    }).join('');
    el.innerHTML = '<h3 class="sec"><span class="no">Top 25</span><span class="t">来源分布</span><span class="en">Sources</span></h3>' +
      '<div class="table-scroll"><table class="dense"><thead><tr><th>来源</th><th>条数</th><th>最近出现</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
      '<p class="note" style="margin-top:10px">全库共 ' + Object.keys(bySrc).length + ' 个来源；来源结构决定视角结构——过度集中于单一来源时警惕信息茧房。</p>';
    return;
  }
  if (tab === 'cats') {
    var byCat = {};
    DB.archive.forEach(function (a) { var k = a.cat || '未分类'; byCat[k] = (byCat[k] || 0) + 1; });
    var cats = Object.keys(byCat).sort(function (a, b) { return byCat[b] - byCat[a]; });
    var cmax = byCat[cats[0]] || 1;
    var crows = cats.map(function (c) {
      return '<tr><td><span class="tag">' + esc(c) + '</span></td><td class="mono"><b>' + byCat[c] + '</b> ' + bar(byCat[c], cmax) + '</td><td class="mono dim">' + (byCat[c] / DB.archive.length * 100).toFixed(1) + '%</td></tr>';
    }).join('');
    el.innerHTML = '<h3 class="sec"><span class="no">' + cats.length + '</span><span class="t">分类分布</span><span class="en">Categories</span></h3>' +
      '<div class="table-scroll"><table class="dense"><thead><tr><th>分类</th><th>条数</th><th>占比</th></tr></thead><tbody>' + crows + '</tbody></table></div>';
    return;
  }
  if (tab === 'years') {
    var years = {};
    DB.archive.forEach(function (a) { var y = a.d.slice(0, 4); years[y] = (years[y] || 0) + 1; });
    var keys = Object.keys(years).sort();
    var ymax = Math.max.apply(null, [1].concat(keys.map(function (y) { return years[y]; })));
    var rows = keys.slice().reverse().map(function (y) {
      return '<tr><td class="mono"><b>' + y + '</b></td>' +
        '<td class="mono"><b>' + years[y] + '</b> ' + bar(years[y], ymax) + '</td>' +
        '<td class="mono dim">' + (years[y] / DB.archive.length * 100).toFixed(1) + '%</td></tr>';
    }).join('');
    el.innerHTML = '<h3 class="sec"><span class="no">' + keys.length + '</span><span class="t">年度节奏</span><span class="en">By Year</span></h3>' +
      '<div class="table-scroll"><table class="dense"><thead><tr><th>年份</th><th>条数</th><th>占比</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
      '<p class="note" style="margin-top:10px">2017 起长期沉淀；近年占比高反映镜像同步起点，不反映业界热度。</p>';
    return;
  }
  el.innerHTML = archiveSearchHtml();
  renderArchiveResults();
};

function renderArchiveResults() {
  var wrap = $('#archWrap');
  if (!wrap) return;
  var q = state.aQuery.trim().toLowerCase();
  var matched = DB.archive.filter(function (a) {
    if (state.aYear !== 'all' && a.d.slice(0, 4) !== state.aYear) return false;
    if (!q) return true;
    return (a.t + ' ' + a.s).toLowerCase().indexOf(q) >= 0;
  });
  var rows = matched.slice(0, 100);
  var html = rows.map(function (a) {
    return '<tr>' +
      '<td class="mono dim">' + esc(a.d) + '</td>' +
      '<td>' + extLink(a.u, esc(a.t)) + (a.cat ? ' <span class="tag plain">' + esc(a.cat) + '</span>' : '') + '</td>' +
      '<td class="mono dim" style="font-size:10.5px">' + esc(a.s) + '</td></tr>';
  }).join('');
  wrap.innerHTML = '<table class="dense"><thead><tr><th>日期</th><th>标题</th><th>来源</th></tr></thead><tbody>' +
    (html || '<tr><td colspan="3" class="dim">无匹配条目</td></tr>') + '</tbody></table>';
  var cnt = $('#archCount');
  if (cnt) cnt.textContent = matched.length === rows.length ? matched.length + ' 条' : rows.length + ' / ' + matched.length + ' 条';
  var seg = $('#archYear');
  if (seg) $$('button', seg).forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-y') === state.aYear); });
}

BIND.archive = function () {
  var box = $('#v-archive');
  box.addEventListener('click', function (e) {
    var b = e.target.closest('#archYear button');
    if (b) { state.aYear = b.getAttribute('data-y'); renderArchiveResults(); }
  });
  box.addEventListener('input', function (e) {
    if (e.target.id === 'archQuery') { state.aQuery = e.target.value; renderArchiveResults(); }
  });
};

/* ============================================================ 日报 */
RENDER.daily = function () {
  return viewShell('daily',
    '<div class="view-head">' +
      '<h2>日报<span class="en">Daily</span></h2>' +
      '<div class="vh-meta"><span class="m">' + DB.archive.length + ' 条 · ' + DB.meta.counts.archiveDays + ' 天</span><span class="m">按日回看精选</span></div>' +
      '<p class="lead">「那天业界发生了什么」：单日回看按板块分组全量；近7日节奏看摄入脉动。</p>' +
    '</div>');
};

PANE.daily = function () {
  var el = $('#pane-daily');
  if (!el) return;
  if (state.tabs.daily === 'rhythm') {
    var days = [];
    DB.archive.forEach(function (a) { if (days.indexOf(a.d) < 0) days.push(a.d); });
    days.sort().reverse();
    var recent = days.slice(0, 7).map(function (d) {
      var items = DB.archive.filter(function (a) { return a.d === d; });
      return { d: d, n: items.length, head: items[0] };
    });
    var max = 1;
    recent.forEach(function (r) { if (r.n > max) max = r.n; });
    var html = recent.map(function (r) {
      return '<tr><td class="mono"><b>' + esc(r.d) + '</b></td>' +
        '<td class="mono"><b>' + r.n + '</b> ' + bar(r.n, max) + '</td>' +
        '<td>' + extLink(r.head.u, esc(r.head.t.slice(0, 46))) + '</td></tr>';
    }).join('');
    el.innerHTML = '<h3 class="sec"><span class="no">7 天</span><span class="t">近7日节奏</span><span class="en">Rhythm</span></h3>' +
      '<div class="table-scroll"><table class="dense"><thead><tr><th>日期</th><th>条数</th><th>当日头条</th></tr></thead><tbody>' + html + '</tbody></table></div>' +
      '<p class="note" style="margin-top:10px">条数骤降通常是镜像同步缺口而非业界安静——先查 <span class="mono">aihot-mirror/state</span>。</p>';
    return;
  }
  var months = [];
  DB.archive.forEach(function (a) { var m = a.d.slice(0, 7); if (months.indexOf(m) < 0) months.push(m); });
  if (!state.dailyMonth || months.indexOf(state.dailyMonth) < 0) state.dailyMonth = months[0] || '';
  var dayList = DB.archive.filter(function (a) { return a.d.slice(0, 7) === state.dailyMonth; }).map(function (a) { return a.d; });
  dayList = dayList.filter(function (d, i) { return dayList.indexOf(d) === i; }).sort().reverse();
  if (!state.dailyDay || dayList.indexOf(state.dailyDay) < 0) state.dailyDay = dayList[0] || '';

  var mseg = months.slice(0, 14).map(function (m) {
    return '<button data-m="' + m + '"' + (state.dailyMonth === m ? ' class="on"' : '') + '>' + m + '</button>';
  }).join('');
  var chips = dayList.map(function (d) {
    return '<a class="fchip" data-d="' + d + '" href="javascript:void(0)" style="' + (state.dailyDay === d ? '' : 'opacity:.62') + '">' + d + '</a>';
  }).join('');
  var items = DB.archive.filter(function (a) { return a.d === state.dailyDay; });
  var byCat = {};
  items.forEach(function (a) { (byCat[a.cat || '未分类'] = byCat[a.cat || '未分类'] || []).push(a); });
  var body = Object.keys(byCat).map(function (cat) {
    var lis = byCat[cat].map(function (a) {
      return '<li><b>' + extLink(a.u, esc(a.t)) + '</b>' + (a.s ? ' <span class="dim mono" style="font-size:10.5px">' + esc(a.s) + '</span>' : '') + '</li>';
    }).join('');
    return '<h3 class="sec"><span class="no">' + byCat[cat].length + '</span><span class="t">' + esc(cat) + '</span><span class="en">' + esc(state.dailyDay) + '</span></h3><ul class="plain">' + lis + '</ul>';
  }).join('');
  el.innerHTML = '<div class="tools"><span class="seg" id="dailyMonthSeg">' + mseg + '</span><span class="count" id="dailyCount"></span></div>' +
    '<div id="dailyDayRow" style="display:flex;flex-wrap:wrap;gap:5px 10px;margin:2px 0 14px">' + chips + '</div>' +
    (body || '<div class="callout">该日期无条目。</div>');
  var cnt = $('#dailyCount');
  if (cnt) cnt.textContent = items.length + ' 条';
};

BIND.daily = function () {
  $('#v-daily').addEventListener('click', function (e) {
    var m = e.target.closest('#dailyMonthSeg button');
    if (m) { state.dailyMonth = m.getAttribute('data-m'); PANE.daily(); return; }
    var d = e.target.closest('#dailyDayRow .fchip');
    if (d) { state.dailyDay = d.getAttribute('data-d'); PANE.daily(); }
  });
};

/* ============================================================ 待核实 */
RENDER.verify = function () {
  return viewShell('verify',
    '<div class="view-head">' +
      '<h2>待核实<span class="en">Verification</span></h2>' +
      '<div class="vh-meta"><span class="m">' + DB.verify.length + ' 条</span><span class="m">真相文件 docs/2026待核实清单.md</span><span class="m">宁可漏收，不可错收</span></div>' +
      '<p class="lead">真实性存疑、单源或规模离谱的事件在此单独关押，核验通过（✅）才写入正式线索与大事记。</p>' +
    '</div>');
};

PANE.verify = function () {
  var el = $('#pane-verify');
  if (!el) return;
  var tab = state.tabs.verify;
  if (tab === 'stats') {
    var secCount = {};
    DB.verify.forEach(function (v) { secCount[v.sec] = (secCount[v.sec] || 0) + 1; });
    var secRows = Object.keys(secCount).map(function (s) {
      return '<tr><td>' + esc(s) + '</td><td class="mono"><b>' + secCount[s] + '</b></td></tr>';
    }).join('');
    el.innerHTML = '<div class="kpi-strip">' +
      VERIFY_ORDER.map(function (m) {
        var n = VERIFY_COUNTS[m];
        return '<div class="kpi' + (m === '✅' ? ' dark' : '') + '"><div class="k">' + esc(VERIFY_STYLE[m].label) + '</div><div class="v">' + n + ' <small>条</small></div><div class="w">' + m + ' · 占台账 ' + Math.round(n / DB.verify.length * 100) + '%</div></div>';
      }).join('') + '</div>' +
      '<h3 class="sec" style="margin-top:18px"><span class="no">' + DB.verify.length + '</span><span class="t">按章节</span><span class="en">Sections</span></h3>' +
      '<div class="table-scroll"><table class="dense"><thead><tr><th>章节</th><th>条数</th></tr></thead><tbody>' + secRows + '</tbody></table></div>';
    return;
  }
  if (tab === 'byclue') {
    var byClue = {};
    DB.verify.forEach(function (v) {
      var keys = (v.into || []).length ? v.into : ['（未关联）'];
      keys.forEach(function (k) { (byClue[k] = byClue[k] || []).push(v); });
    });
    var rows = Object.keys(byClue).sort(function (a, b) { return byClue[b].length - byClue[a].length; }).map(function (k) {
      var marks = {};
      byClue[k].forEach(function (v) { marks[v.status] = (marks[v.status] || 0) + 1; });
      var markStr = Object.keys(marks).map(function (m) { return m + ' ' + marks[m]; }).join(' · ');
      var cell = k === '（未关联）' ? '<span class="dim">（未关联）</span>' : '<a class="wl" href="' + clueHref(k) + '">' + esc(k.split('/')[1] || k) + '</a>';
      return '<tr><td>' + cell + '</td><td class="mono"><b>' + byClue[k].length + '</b></td><td class="mono dim">' + markStr + '</td></tr>';
    }).join('');
    el.innerHTML = '<h3 class="sec"><span class="no">' + Object.keys(byClue).length + '</span><span class="t">按关联线索</span><span class="en">By Clue</span></h3>' +
      '<div class="table-scroll"><table class="dense"><thead><tr><th>线索</th><th>条目数</th><th>状态分布</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
      '<p class="note" style="margin-top:10px">「已入库」指向的线索是核验流水的下游——哪条线索欠的核验债最多，一眼可见。</p>';
    return;
  }
  var items = DB.verify.filter(function (v) { return state.vStatus === 'all' || v.status === state.vStatus; });
  var bySec = {};
  items.forEach(function (v) { (bySec[v.sec] = bySec[v.sec] || []).push(v); });
  var html = Object.keys(bySec).map(function (sec) {
    var cards = bySec[sec].map(function (v) {
      var st = VERIFY_STYLE[v.status] || { cls: '', label: '未标记' };
      var lines = v.lines.map(function (ln) {
        return '<div class="prov-row"><span class="k">' + esc(ln.k || '注') + '</span><p>' + linkify(ln.v) + '</p></div>';
      }).join('');
      var into = (v.into || []).map(function (id) {
        return '<a class="wl" href="' + clueHref(id) + '">' + esc(id.split('/')[1] || id) + '</a>';
      }).join('，');
      var tone = v.status === '❓' ? 'red' : (v.status === '✅' ? 'pine' : '');
      return '<div class="callout ' + tone + '">' +
        '<div class="c-t">' + esc(v.status || '—') + ' ' + esc(st.label) + (v.date ? ' · ' + esc(v.date) : '') + '</div>' +
        '<b>' + esc(v.title) + '</b>' + lines +
        (into ? '<div class="prov-row"><span class="k">已入库</span><p>' + into + '</p></div>' : '') +
        '</div>';
    }).join('');
    return '<h3 class="sec"><span class="no">' + bySec[sec].length + '</span><span class="t">' + esc(sec) + '</span><span class="en">Section</span></h3>' + cards;
  }).join('');
  var seg = '<button data-v="all"' + (state.vStatus === 'all' ? ' class="on"' : '') + '>全部 ' + DB.verify.length + '</button>';
  VERIFY_ORDER.forEach(function (m) {
    seg += '<button data-v="' + m + '"' + (state.vStatus === m ? ' class="on"' : '') + '>' + m + ' ' + VERIFY_COUNTS[m] + '</button>';
  });
  el.innerHTML = '<div class="tools"><span class="seg" id="verifySeg">' + seg + '</span><span class="count">' + items.length + ' / ' + DB.verify.length + ' 条</span></div>' +
    (html || '<div class="callout">该状态暂无条目。</div>');
};

BIND.verify = function () {
  $('#v-verify').addEventListener('click', function (e) {
    var b = e.target.closest('#verifySeg button');
    if (b) { state.vStatus = b.getAttribute('data-v'); PANE.verify(); }
  });
};

/* ============================================================ 方法论 */
RENDER.method = function () {
  return viewShell('method',
    '<div class="view-head">' +
      '<h2>方法论<span class="en">Method</span></h2>' +
      '<div class="vh-meta"><span class="m">真相文件</span><span class="m">_2026大事记.md · docs/2026待核实清单.md · docs/线索模板.md</span></div>' +
      '<p class="lead">本台一切数字与结论的可信度来自这三份规则：收什么、怎么核、怎么写。此处永远渲染仓库最新版。</p>' +
    '</div>');
};

PANE.method = function () {
  var el = $('#pane-method');
  if (!el) return;
  var tab = state.tabs.method;
  if (tab === 'redlines') {
    var rows = DB.score.redlines.map(function (r, i) {
      return '<li><b>' + (i < 9 ? '0' : '') + (i + 1) + '</b> ' + esc(r) + '</li>';
    }).join('');
    el.innerHTML = '<div class="callout red"><div class="c-t">红线即纪律</div>评分、引用与发布共同遵守的底线。触线即停：宁可慢，不可错。</div>' +
      '<ul class="plain">' + rows + '</ul>';
    return;
  }
  if (tab === 'corrections') {
    var cor = DB.corrections.filter(function (c) { return c.date.indexOf('示例') < 0; });
    var example = DB.corrections.filter(function (c) { return c.date.indexOf('示例') >= 0; });
    var cards = cor.map(function (c) {
      return '<div class="callout pine"><div class="c-t">' + esc(c.date) + '</div>' +
        '<b>' + esc(c.object) + '</b>' +
        '<div class="prov-row"><span class="k">原内容</span><p>' + esc(c.from) + '</p></div>' +
        '<div class="prov-row"><span class="k">修正为</span><p>' + esc(c.to) + '</p></div>' +
        '<div class="prov-row"><span class="k">依据</span><p>' + linkify(c.basis) + '</p></div></div>';
    }).join('');
    el.innerHTML = '<div class="callout"><div class="c-t">修正留痕</div>事实被推翻时：先改线索/大事记，再在 <b class="mono">docs/2026修正记录.md</b> 登记。已登记实质修正 <b>' + cor.length + '</b> 条' + (example.length ? '，另有示例条目 ' + example.length + ' 条' : '') + '。</div>' +
      (cards || '<p class="note" style="margin-top:12px">暂无实质修正——这是好事，登记机制为它准备好了。</p>');
    return;
  }
  var map = { standards: ['01', '收录标准与真实性约定', 'Standards', DB.docs.standards], methodology: ['02', '核验方法论', 'Verification', DB.docs.methodology], template: ['03', '线索模板', 'Clue Template', DB.docs.template] };
  var m = map[tab] || map.standards;
  el.innerHTML = '<h3 class="sec"><span class="no">' + m[0] + '</span><span class="t">' + m[1] + '</span><span class="en">' + m[2] + '</span></h3>' +
    '<div class="md-body">' + Md.render(m[3] || '（未找到对应文件）') + '</div>';
};

/* ============================================================ 玩家图谱 */
RENDER.players = function () {
  return viewShell('players',
    '<div class="view-head">' +
      '<h2>玩家图谱<span class="en">Players</span></h2>' +
      '<div class="vh-meta"><span class="m">' + DB.players.length + ' 家/位</span><span class="m">手工策展 console/players.js</span><span class="m">统计由线索与大事记自动 join</span></div>' +
      '<p class="lead">名单手工维护（种子按「关键角色」引用频次生成），类型请归入公司/机构/人物；统计前台实时匹配。</p>' +
    '</div>');
};

PANE.players = function () {
  var el = $('#pane-players');
  if (!el) return;
  if (state.tabs.players === 'detail') {
    /* 选中项优先取 URL，其次内存态，最后回落名单首位 */
    var want = currentPlayerName() || state.plSel;
    if (!want || !DB.players.some(function (p) { return p.name === want; })) want = DB.players.length ? DB.players[0].name : '';
    state.plSel = want;
    var p = DB.players.filter(function (x) { return x.name === state.plSel; })[0];
    if (!p) { el.innerHTML = '<div class="callout">players.js 为空。</div>'; return; }
    var s = playerStats(p);
    var names = [p.name].concat(p.aliases || []);
    var clueRows = s.clues.map(function (c) {
      return '<tr><td><a href="' + clueHref(c.id) + '"><b>' + esc(c.name) + '</b></a></td><td>' + esc(c.topic) + '</td><td class="mono">' + c.nEvents + '</td><td class="mono">' + esc(c.lastEvent || '—') + '</td></tr>';
    }).join('');
    var evs = s.events.slice(0, 10).map(function (e) {
      return '<li><b>' + esc(e.date) + '</b> · ' + extLink(e.url, esc(e.title)) + '</li>';
    }).join('');
    /* 涉足赛道：该玩家（含别名）作为线索「关键角色」出现的主题分布 */
    var touched = {};
    DB.clues.forEach(function (c) {
      if ((c.roles || []).some(function (r) { return names.indexOf(r) >= 0; })) touched[c.topic] = (touched[c.topic] || 0) + 1;
    });
    var touchedChips = Object.keys(touched).sort(function (a, b) { return touched[b] - touched[a]; }).map(function (t) {
      var label = esc(t) + ' <span class="dim mono">' + touched[t] + '</span>';
      return sectorById(t) ? '<a class="fchip" href="' + sectorHref(t) + '" title="看该赛道档案">' + label + '</a>'
                           : '<span class="tag plain">' + label + '</span>';
    }).join('');
    el.innerHTML = '<div style="display:flex;flex-wrap:wrap;gap:5px 10px;margin:2px 0 14px">' +
        DB.players.map(function (x) {
          return '<a class="fchip" href="' + playerHref(x.name) + '" style="' + (x.name === state.plSel ? '' : 'opacity:.62') + '">' + esc(x.name) + '</a>';
        }).join('') + '</div>' +
      '<div class="kpi-strip">' +
        '<div class="kpi dark"><div class="k">玩家</div><div class="v" style="font-size:19px">' + esc(p.name) + '</div><div class="w">' + esc(p.type || '待归类') + (p.positioning ? ' · ' + esc(p.positioning) : '') + '</div></div>' +
        '<div class="kpi"><div class="k">关联线索</div><div class="v">' + s.clues.length + ' <small>条</small></div><div class="w">关键角色或别名命中</div></div>' +
        '<div class="kpi"><div class="k">大事记提及</div><div class="v">' + s.nEvents + ' <small>条</small></div><div class="w">最近 ' + esc(s.last || '—') + '</div></div>' +
        '<div class="kpi"><div class="k">别名</div><div class="v" style="font-size:14px;line-height:1.5">' + (p.aliases && p.aliases.length ? esc(p.aliases.join(' / ')) : '—') + '</div><div class="w">别名参与线索与事件匹配</div></div>' +
      '</div>' +
      (p.note ? '<div class="callout" style="margin-top:16px"><div class="c-t">策展备注</div>' + esc(p.note) + '</div>' : '') +
      (p.type === '公司' && companyNameForLabel(p.name) ? '<div class="callout"><div class="c-t">公司专页</div>产业链坐标、产品技术与全库证据：<a href="' + companyHref(companyNameForLabel(p.name)) + '"><b>' + esc(companyNameForLabel(p.name)) + '</b></a>。</div>' : '') +
      '<div class="grid g2" style="margin-top:16px">' +
        '<div><h3 class="sec"><span class="no">' + s.clues.length + '</span><span class="t">关联线索</span><span class="en">Clues</span></h3>' +
          '<div class="table-scroll"><table class="dense"><thead><tr><th>线索</th><th>主题</th><th>事件数</th><th>最近</th></tr></thead><tbody>' + (clueRows || '<tr><td colspan="4" class="dim">无</td></tr>') + '</tbody></table></div></div>' +
        '<div><h3 class="sec"><span class="no">' + s.nEvents + '</span><span class="t">大事记提及</span><span class="en">Events</span></h3>' +
          '<ul class="plain">' + (evs || '<li class="dim">无</li>') + '</ul></div>' +
      '</div>' +
      '<h3 class="sec" style="margin-top:18px"><span class="no">' + Object.keys(touched).length + '</span><span class="t">涉足赛道</span><span class="en">Sectors</span></h3>' +
      '<div class="fchips">' + (touchedChips || '<span class="dim">该玩家尚未作为关键角色出现在任何线索中。</span>') + '</div>' +
      '<p class="note" style="margin-top:8px">按该玩家（含别名）在线索「关键角色」中的出现次数排序；灰标为「赛道地图」尚未评分的主题。' +
        '<a href="#/players/table">← 回玩家总表</a> · <a href="#/sectors/matrix">赛道矩阵</a></p>';
    return;
  }
  var types = {};
  DB.players.forEach(function (p) { types[p.type || '待归类'] = (types[p.type || '待归类'] || 0) + 1; });
  var seg = '<button data-t="all"' + (state.pType === 'all' ? ' class="on"' : '') + '>全部 ' + DB.players.length + '</button>';
  Object.keys(types).sort().forEach(function (t) {
    seg += '<button data-t="' + t + '"' + (state.pType === t ? ' class="on"' : '') + '>' + t + ' ' + types[t] + '</button>';
  });
  var rows = DB.players.filter(function (p) { return state.pType === 'all' || (p.type || '待归类') === state.pType; }).map(function (p) {
    var s = playerStats(p);
    var firstClue = s.clues[0];
    return '<tr>' +
      '<td><b><a href="' + playerHref(p.name) + '">' + esc(p.name) + '</a></b>' + (p.aliases && p.aliases.length ? ' <span class="dim mono" style="font-size:10px">' + esc(p.aliases.slice(0, 3).join(' / ')) + '</span>' : '') + '</td>' +
      '<td>' + (p.type && p.type !== '待归类' ? '<span class="tag">' + esc(p.type) + '</span>' : '<span class="tag plain">待归类</span>') + '</td>' +
      '<td>' + (p.positioning ? esc(p.positioning) : '<span class="dim">' + esc(p.note || '—') + '</span>') + '</td>' +
      '<td class="mono"><b>' + s.clues.length + '</b>' + (firstClue ? ' <a href="' + clueHref(firstClue.id) + '" title="' + esc(firstClue.id) + '">↗</a>' : '') + '</td>' +
      '<td class="mono">' + (s.nEvents || '—') + '</td>' +
      '<td class="mono">' + esc(s.last || '—') + '</td></tr>';
  }).join('');
  el.innerHTML = '<div class="tools"><span class="seg" id="playerSeg">' + seg + '</span><span class="count">' + rows.length + ' / ' + DB.players.length + ' 家</span></div>' +
    '<div class="table-scroll"><table class="dense"><thead><tr><th>玩家</th><th>类型</th><th>定位</th><th>线索</th><th>大事记</th><th>最近事件</th></tr></thead><tbody>' +
    (rows || '<tr><td colspan="6" class="dim">无该类型玩家</td></tr>') + '</tbody></table></div>' +
    '<p class="note" style="margin-top:10px">点击名称进入该玩家的独立档案（也可从左侧菜单「玩家详情」直达）。大事记列为该玩家名称或别名在事件标题与摘要中出现的次数，供交叉参考，非严格归属。</p>';
};

BIND.players = function () {
  $('#v-players').addEventListener('click', function (e) {
    var b = e.target.closest('#playerSeg button');
    if (b) { state.pType = b.getAttribute('data-t'); PANE.players(); }
  });
};

/* ============================================================ 赛道地图 */
RENDER.sectors = function () {
  return viewShell('sectors',
    '<div class="view-head">' +
      '<h2>赛道地图<span class="en">Sectors</span></h2>' +
      '<div class="vh-meta"><span class="m">' + DB.score.sectors.length + ' 赛道 × 玩家 × 热度</span><span class="m">线索与大事记实时统计</span></div>' +
      '<p class="lead">一眼看出人和钱往哪挤：线索数是关注度存量，关联大事是当期热度，头部玩家来自各赛道线索的「关键角色」频次。</p>' +
    '</div>');
};

function sectorStats() {
  var ev = {}, last = {};
  DB.events.forEach(function (e) {
    (e.links || []).forEach(function (l) {
      var tp = l.split('/')[0];
      ev[tp] = (ev[tp] || 0) + 1;
      if (e.date > (last[tp] || '')) last[tp] = e.date;
    });
  });
  var roles = {};
  DB.clues.forEach(function (c) {
    c.roles.forEach(function (r) {
      roles[c.topic] = roles[c.topic] || {};
      roles[c.topic][r] = (roles[c.topic][r] || 0) + 1;
    });
  });
  return { ev: ev, last: last, roles: roles };
}

/* 关键角色名 → 玩家档案：按策展过的名称与别名匹配，匹配不到即视为未建档 */
function playerByName(name) {
  return DB.players.filter(function (p) {
    return p.name === name || (p.aliases || []).indexOf(name) >= 0;
  })[0] || null;
}

/* 赛道档案：单条赛道的评分 + 追踪密度 + 头部玩家 + 线索与大事，全部由库内数据 join 得出 */
function sectorProfileHtml(sid, S) {
  var sec = sectorById(sid);
  if (!sec) return '<div class="callout red">score.js 中没有 id 为 ' + esc(sid) + ' 的赛道。</div>';
  var tp = topicByKey(sid);
  var w = scoreWeights();
  var ranked = Engine.computeAll(DB.score.sectors, w);
  var pos = 0, total = 0;
  ranked.forEach(function (r, i) { if (r.id === sid) { pos = i + 1; total = r.total; } });
  var confLv = sec.conf === 'high' ? '高' : (sec.conf === 'medium' ? '中' : '低');
  var ev = S.ev[sid] || 0;
  var clues = DB.clues.filter(function (c) { return c.topic === sid; });
  var crows = clues.map(function (c) {
    return '<tr><td><a href="' + clueHref(c.id) + '"><b>' + esc(c.name) + '</b></a></td><td>' + statusTag(c.status) +
      '</td><td class="mono"><b>' + c.nEvents + '</b></td><td class="mono">' + esc(c.lastEvent || '—') + '</td><td class="mono">' + esc(c.updated) + '</td></tr>';
  }).join('');
  var roleMap = S.roles[sid] || {};
  var topRoles = Object.keys(roleMap).sort(function (a, b) { return roleMap[b] - roleMap[a]; }).slice(0, 10);
  var chips = topRoles.map(function (r) {
    var pl = playerByName(r);
    var label = esc(r) + ' <span class="dim mono">' + roleMap[r] + '</span>';
    return pl ? '<a class="fchip" href="' + playerHref(pl.name) + '" title="已在玩家图谱建档">' + label + '</a>'
              : '<span class="tag plain" title="尚未建档，仅在线索「关键角色」中出现">' + label + '</span>';
  }).join('');
  var dimRows = Object.keys(DB.score.dims).map(function (k) {
    var v = (sec.dims && sec.dims[k]) || 0;
    return '<tr><td><span class="tag">' + esc(DB.score.dims[k].label) + '</span></td>' +
      '<td class="mono"><b>' + v + '</b> / 5 ' + bar(v, 5, 'var(--gold-2)') + '</td>' +
      '<td class="mono">' + (w[k] || 0) + '%</td>' +
      '<td class="dim">' + esc(DB.score.dims[k].desc) + '</td></tr>';
  }).join('');
  var evs = topicEvents(sid).sort(function (a, b) { return a.date < b.date ? 1 : -1; }).slice(0, 8).map(function (e) {
    return '<li><b>' + esc(e.date) + '</b> · ' + extLink(e.url, esc(e.title)) +
      '<div class="dim" style="font-size:11.5px">' + summaryHtml(e.summary, 90) + '</div></li>';
  }).join('');
  return h(
    '<div class="callout pine"><div class="c-t">赛道界定' + (tp && tp.en ? ' · ' + esc(tp.en) : '') + '</div>' +
      esc(tp ? tp.def : '（score.js 的该赛道在 data.js 主题表中没有对应条目，定义待补。）') +
      (sec.note ? '<div style="margin-top:6px"><b>判断：</b>' + esc(sec.note) + '</div>' : '') + '</div>' +
    '<div class="kpi-strip">' +
      '<div class="kpi dark"><div class="k">加权总分</div><div class="v">' + total.toFixed(2) + ' <small>/ 5</small></div>' +
        '<div class="w">第 ' + pos + ' / ' + ranked.length + ' 名 · ' + esc(Engine.band(total)) + '</div></div>' +
      '<div class="kpi"><div class="k">五维</div><div class="v" style="padding-top:9px">' + dimsHtml(sec.dims || {}) + '</div>' +
        '<div class="w">评分置信度' + confLv + ' · 评分基准日 ' + esc(DB.score.asOf) + '</div></div>' +
      '<div class="kpi"><div class="k">本赛道线索</div><div class="v">' + (tp ? tp.count : clues.length) + ' <small>条</small></div>' +
        '<div class="w">主题表登记值，与下方清单同一口径</div></div>' +
      '<div class="kpi"><div class="k">关联大事</div><div class="v">' + ev + ' <small>条</small></div>' +
        '<div class="w">最近 ' + esc(S.last[sid] || '—') + '</div></div>' +
    '</div>' +
    '<div class="grid g2" style="margin-top:16px">' +
      '<div><h3 class="sec"><span class="no">01</span><span class="t">五维评分</span><span class="en">Scores</span></h3>' +
        '<div class="table-scroll"><table class="dense"><thead><tr><th>维度</th><th>评分</th><th>当前权重</th><th>口径</th></tr></thead><tbody>' + dimRows + '</tbody></table></div>' +
        '<p class="note" style="margin-top:8px">权重取自<a href="#/scores/weights">权重与假设</a>页签的当前值（刷新即回默认），总分与排名随之变动。</p></div>' +
      '<div><h3 class="sec"><span class="no">' + topRoles.length + '</span><span class="t">头部玩家</span><span class="en">Players</span></h3>' +
        '<div class="fchips">' + (chips || '<span class="dim">该赛道线索尚未登记关键角色。</span>') + '</div>' +
        '<p class="note" style="margin-top:8px">按本赛道线索「关键角色」出现次数排序；金色标签为玩家图谱已建档者，灰标为尚未建档的角色名。</p>' +
        '<h3 class="sec" style="margin-top:18px"><span class="no">' + ev + '</span><span class="t">近期大事</span><span class="en">Timeline</span></h3>' +
        '<ul class="plain">' + (evs || '<li class="dim">暂无关联大事</li>') + '</ul></div>' +
    '</div>' +
    '<h3 class="sec" style="margin-top:18px"><span class="no">' + clues.length + '</span><span class="t">本赛道线索</span><span class="en">Clues</span></h3>' +
    '<div class="table-scroll"><table class="dense"><thead><tr><th>线索</th><th>状态</th><th>时间线</th><th>最近事件</th><th>更新</th></tr></thead><tbody>' +
      (crows || '<tr><td colspan="5" class="dim">尚未建线——该赛道目前只有热度、没有追踪。</td></tr>') + '</tbody></table></div>' +
    '<p class="note" style="margin-top:10px">同看：<a href="#/topics/' + encodeURIComponent(sid) + '">主题详情</a> · ' +
      '<a href="#/scores/rank">赛道评分卡</a> · <a href="#/sectors/gaps">研究缺口</a> · <a href="#/sectors/matrix">回矩阵</a></p>' +
    provBlock('sectors'));
}

PANE.sectors = function () {
  var el = $('#pane-sectors');
  if (!el) return;
  var S = sectorStats();
  var sid = currentSectorId();
  if (sid) { el.innerHTML = sectorProfileHtml(sid, S); return; }
  var tab = state.tabs.sectors;
  if (tab === 'rank') {
    var sorted = DB.topics.slice().sort(function (a, b) { return (S.ev[b.key] || 0) - (S.ev[a.key] || 0); });
    var max = S.ev[sorted[0].key] || 1;
    var rows = sorted.map(function (t, i) {
      var ev = S.ev[t.key] || 0;
      var rk = '<span class="rk ' + (i < 3 ? 't' + (i + 1) : '') + '">' + (i + 1) + '</span>';
      return '<tr><td class="mono">' + rk + '</td>' +
        '<td><a href="#/topics/' + encodeURIComponent(t.key) + '"><b>' + esc(t.key) + '</b></a></td>' +
        '<td class="mono"><b>' + ev + '</b> ' + bar(ev, max, 'var(--gold-2)') + '</td>' +
        '<td class="mono">' + t.count + '</td>' +
        '<td class="mono">' + esc(S.last[t.key] || '—') + '</td></tr>';
    }).join('');
    el.innerHTML = '<div class="table-scroll"><table class="dense"><thead><tr><th>序</th><th>赛道</th><th>关联大事</th><th>线索</th><th>最近大事</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
      '<p class="note" style="margin-top:10px">按双链关联大事数排序——当期热度榜。</p>';
    return;
  }
  if (tab === 'gaps') {
    var gaps = DB.topics.filter(function (t) { return (S.ev[t.key] || 0) >= 3 && t.count <= 2; })
      .sort(function (a, b) { return (S.ev[b.key] || 0) - (S.ev[a.key] || 0); });
    var grows = gaps.map(function (t) {
      return '<tr><td><a href="#/topics/' + encodeURIComponent(t.key) + '"><b>' + esc(t.key) + '</b></a></td>' +
        '<td class="mono neg"><b>' + (S.ev[t.key] || 0) + '</b></td>' +
        '<td class="mono">' + t.count + '</td>' +
        '<td class="dim">' + esc(t.def.slice(0, 40)) + '</td></tr>';
    }).join('');
    el.innerHTML = '<div class="callout red"><div class="c-t">信号定义</div>关联大事 ≥ 3 而线索 ≤ 2 的赛道：业界热度已经起来，追踪密度没跟上——这就是下一批该建的新线索清单。</div>' +
      '<div class="table-scroll"><table class="dense"><thead><tr><th>赛道</th><th>关联大事</th><th>现有线索</th><th>范围</th></tr></thead><tbody>' + (grows || '<tr><td colspan="4" class="dim">暂无缺口信号</td></tr>') + '</tbody></table></div>';
    return;
  }
  var rows = DB.topics.map(function (t) {
    var top = Object.keys(S.roles[t.key] || {}).sort(function (a, b) { return S.roles[t.key][b] - S.roles[t.key][a]; }).slice(0, 3);
    var ev = S.ev[t.key] || 0;
    return '<tr>' +
      '<td><a href="#/topics/' + encodeURIComponent(t.key) + '"><b>' + esc(t.key) + '</b></a></td>' +
      '<td class="mono"><b>' + t.count + '</b></td>' +
      '<td class="mono">' + (ev || '—') + '</td>' +
      '<td class="mono">' + esc(S.last[t.key] || '—') + '</td>' +
      '<td>' + (top.length ? top.map(function (r) { return '<span class="tag">' + esc(r) + '</span>'; }).join(' ') : '<span class="dim">—</span>') + '</td>' +
      '<td class="dim">' + esc(t.def.slice(0, 34)) + '</td></tr>';
  }).join('');
  el.innerHTML = '<div class="table-scroll"><table class="dense"><thead><tr><th>赛道</th><th>线索</th><th>关联大事</th><th>最近大事</th><th>头部玩家</th><th>范围</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
    '<p class="note" style="margin-top:10px">线索数为零但大事密集的赛道 = 关注度高但追踪不足，是建新线索的信号（见「研究缺口」页签）。</p>';
};

/* ============================================================ 模型登记册 */
RENDER.models = function () {
  return viewShell('models',
    '<div class="view-head">' +
      '<h2>模型登记册<span class="en">Model Registry</span></h2>' +
      '<div class="vh-meta"><span class="m">' + DB.models.length + ' 个前沿模型</span><span class="m">手工策展 console/models.js</span><span class="m">字段留空 = 待回填</span></div>' +
      '<p class="lead">前沿模型规格的结构化登记：参数、上下文、定价、代表性基准同表可比。每次模型发布事件入库时顺手回填一行。</p>' +
    '</div>');
};

PANE.models = function () {
  var el = $('#pane-models');
  if (!el) return;
  var tab = state.tabs.models;
  if (tab === 'pricing') {
    var ps = DB.models.filter(function (m) { return m.priceIn || m.priceOut; })
      .sort(function (a, b) { return (parseFloat(a.priceIn) || 999) - (parseFloat(b.priceIn) || 999); });
    var rows = ps.map(function (m) {
      var src = m.priceSrc === 'derived' ? '<span class="tag gold">推算</span>' : (m.priceSrc === 'attested' ? '<span class="tag plain">可证</span>' : '');
      return '<tr><td><b>' + esc(m.name) + '</b></td><td class="mono dim">' + esc(m.org) + '</td>' +
        '<td class="mono">' + (m.priceIn ? '$' + esc(m.priceIn) : '—') + '</td>' +
        '<td class="mono">' + (m.priceOut ? '$' + esc(m.priceOut) : '—') + '</td>' +
        '<td>' + src + '</td>' +
        '<td class="dim">' + esc(m.note || '').slice(0, 40) + '</td></tr>';
    }).join('');
    el.innerHTML = '<h3 class="sec"><span class="no">' + ps.length + '</span><span class="t">定价对比</span><span class="en">Pricing</span></h3>' +
      '<div class="table-scroll"><table class="dense"><thead><tr><th>模型</th><th>机构</th><th>输入价</th><th>输出价</th><th>口径</th><th>备注</th></tr></thead><tbody>' + (rows || '<tr><td colspan="6" class="dim">尚无定价数据，随发布事件回填</td></tr>') + '</tbody></table></div>' +
      '<p class="note" style="margin-top:10px">单位：美元 / 百万 token。<b>可证</b>=库内可直接引用的一手价格；<b>推算</b>=按可证折扣/倍数推出（依据见备注），引用需注明。价格战是当前主线叙事之一，此表即其底稿。</p>';
    return;
  }
  if (tab === 'timeline') {
    var ts = DB.models.filter(function (m) { return m.date; }).sort(function (a, b) { return a.date < b.date ? 1 : -1; });
    var lis = ts.map(function (m) {
      return '<li><div class="ph">' + esc(m.date.slice(0, 7)) + '<span class="when">' + esc(m.date) + '</span></div>' +
        '<div class="tt">' + esc(m.name) + ' <span class="dim mono" style="font-size:10.5px">' + esc(m.org) + '</span></div>' +
        '<div class="td">' + esc(m.note || '') + '</div></li>';
    }).join('');
    el.innerHTML = '<h3 class="sec"><span class="no">' + ts.length + '</span><span class="t">发布时间线</span><span class="en">Releases</span></h3><ul class="timeline">' + (lis || '<li class="dim">暂无</li>') + '</ul>';
    return;
  }
  var rows = DB.models.map(function (m) {
    return '<tr>' +
      '<td><b>' + esc(m.name) + '</b></td>' +
      '<td class="mono dim">' + esc(m.org) + '</td>' +
      '<td class="mono">' + esc(m.date || '—') + '</td>' +
      '<td class="mono">' + esc(m.params || '—') + '</td>' +
      '<td class="mono">' + esc(m.ctx || '—') + '</td>' +
      '<td class="mono">' + (m.priceIn ? '$' + esc(m.priceIn) : '—') + '</td>' +
      '<td class="mono">' + (m.priceOut ? '$' + esc(m.priceOut) : '—') + '</td>' +
      '<td>' + esc(m.bench || '—') + '</td>' +
      '<td class="dim">' + esc(m.note || '') + '</td></tr>';
  }).join('');
  el.innerHTML = '<div class="table-scroll"><table class="dense"><thead><tr><th>模型</th><th>机构</th><th>发布</th><th>参数</th><th>上下文</th><th>输入价</th><th>输出价</th><th>基准</th><th>备注</th></tr></thead><tbody>' +
    (rows || '<tr><td colspan="9" class="dim">models.js 为空</td></tr>') + '</tbody></table></div>' +
    '<p class="note" style="margin-top:10px">定价单位：美元 / 百万 token。空白字段是登记册的待办，不是缺失——这正是 schema 的用法。</p>';
};

/* ============================================================ 资本动向 */
RENDER.capital = function () {
  return viewShell('capital',
    '<div class="view-head">' +
      '<h2>资本动向<span class="en">Capital</span></h2>' +
      '<div class="vh-meta"><span class="m">大事记「资本」类</span><span class="m">金额为规则自动抽取</span></div>' +
      '<p class="lead">收购、并购、融资、IPO 单独立线。金额自动抽取自标题与摘要，仅作量级参考；精确口径以待核实清单与一手源为准。</p>' +
    '</div>');
};

function capitalEvs() {
  return DB.events.filter(function (e) { return (e.cats || []).indexOf('资本') >= 0; });
}

PANE.capital = function () {
  var el = $('#pane-capital');
  if (!el) return;
  var evs = capitalEvs();
  if (state.tabs.capital === 'rank') {
    var withAmt = evs.filter(function (e) { return e.meta && e.meta.amountUsd; }).sort(function (a, b) { return b.meta.amountUsd - a.meta.amountUsd; });
    var max = withAmt.length ? withAmt[0].meta.amountUsd : 1;
    var fmt = function (v) { return v >= 10000 ? (v / 10000) + ' 万亿' : v + ' 亿'; };
    var rows = withAmt.map(function (e, i) {
      var rk = '<span class="rk ' + (i < 3 ? 't' + (i + 1) : '') + '">' + (i + 1) + '</span>';
      return '<tr><td class="mono">' + rk + '</td>' +
        '<td>' + extLink(e.url, esc(e.title)) + '</td>' +
        '<td class="mono"><b>' + fmt(e.meta.amountUsd) + '</b> ' + bar(e.meta.amountUsd, max, 'var(--gold-2)') + '</td>' +
        '<td class="mono dim">' + esc(e.date) + '</td></tr>';
    }).join('');
    el.innerHTML = '<h3 class="sec"><span class="no">' + withAmt.length + '</span><span class="t">金额榜</span><span class="en">By Amount</span></h3>' +
      '<div class="table-scroll"><table class="dense"><thead><tr><th>序</th><th>事件</th><th>金额（亿美元）</th><th>日期</th></tr></thead><tbody>' + (rows || '<tr><td colspan="4" class="dim">暂无可抽取金额</td></tr>') + '</tbody></table></div>' +
      '<p class="note" style="margin-top:10px">仅含自动抽取到金额的事件；写摘要时带上「X 亿美元」即可自动入榜。</p>';
    return;
  }
  var rows = evs.map(function (e) {
    var money = e.meta && e.meta.amountUsd ? (e.meta.amountUsd >= 10000 ? (e.meta.amountUsd / 10000) + ' 万亿' : e.meta.amountUsd + ' 亿') : '—';
    return '<tr>' +
      '<td class="mono dim">' + esc(e.date) + '</td>' +
      '<td>' + extLink(e.url, esc(e.title)) + '</td>' +
      '<td class="mono"><b>' + money + '</b>' + (e.meta && e.meta.round ? ' <span class="tag gold">' + esc(e.meta.round) + '</span>' : '') + '</td>' +
      '<td>' + (evLinks(e) || '—') + '</td></tr>';
  }).join('');
  el.innerHTML = '<div class="table-scroll"><table class="dense"><thead><tr><th>日期</th><th>事件</th><th>金额 / 轮次</th><th>关联线索</th></tr></thead><tbody>' +
    (rows || '<tr><td colspan="4" class="dim">暂无资本类事件</td></tr>') + '</tbody></table></div>' +
    '<p class="note" style="margin-top:10px">增量规范：新资本事件建议在摘要中写明「金额 + 轮次 + 投资方」，构建器会自动抽取进金额列。</p>';
};

/* ============================================================ 产业链 */
/* 成熟度六阶段：S 曲线 + Gartner 炒作曲线的改造版（Gartner 原五段为技术成熟度口径，
 * 本台并入「重构期」刻画被新范式重写的存量）。刻画节点行业位置，是观点层判断非事实。 */
var MAT_STAGES = [
  { k: '萌芽期', cls: 'sprout', en: 'Emerging', hint: '技术可行但商业未证' },
  { k: '过热期', cls: 'hype', en: 'Hype', hint: '资本与叙事领先于收入' },
  { k: '挤泡沫期', cls: 'defla', en: 'Deflation', hint: '高预期回落，出清开始' },
  { k: '爬坡期', cls: 'scale', en: 'Scaling', hint: '单位经济跑通，份额扩张' },
  { k: '成熟期', cls: 'mature', en: 'Mature', hint: '格局与利润率趋稳' },
  { k: '重构期', cls: 'reshape', en: 'Reshaping', hint: '被新范式重写中的存量' }
];
var MAT_BY_K = {};
MAT_STAGES.forEach(function (m) { MAT_BY_K[m.k] = m; });
function matBadge(k) {
  var m = MAT_BY_K[k];
  if (!m) return '';
  return '<span class="mat ' + m.cls + '" title="' + esc(m.en + '：' + m.hint) + '">' + esc(k) + '</span>';
}
function matLegend() {
  return '<div style="display:flex;flex-wrap:wrap;gap:4px 8px;align-items:center">' +
    MAT_STAGES.map(function (m) { return '<span class="mat ' + m.cls + '" title="' + esc(m.hint) + '">' + esc(m.k) + '</span>'; }).join('') +
    '<span class="note" style="font-size:10.5px">六阶段为 S 曲线/炒作曲线改造口径，观点层判断非事实</span></div>';
}
/* 节点集合的成熟度分布（按固定阶段序） */
function matDist(nodes) {
  var c = {};
  nodes.forEach(function (nd) { if (nd.maturity) c[nd.maturity] = (c[nd.maturity] || 0) + 1; });
  return MAT_STAGES.filter(function (m) { return c[m.k]; }).map(function (m) {
    return matBadge(m.k) + '<span class="mono" style="font-size:10px;color:var(--ink-3)">×' + c[m.k] + '</span>';
  }).join(' ');
}
function chainSubTotal() {
  return DB.chain.layers.reduce(function (s, ly) {
    return s + ly.nodes.reduce(function (n, nd) { return n + ((nd.sub && nd.sub.length) || 0); }, 0);
  }, 0);
}

RENDER.chain = function () {
  return viewShell('chain',
    '<div class="view-head">' +
      '<h2>产业链 · 拆解主轴<span class="en">Value Chain</span></h2>' +
      '<div class="vh-meta"><span class="m">' + chainTotal() + ' 节点 × ' + DB.chain.layers.length + ' 层 + ' + chainSubTotal() + ' 二级细分</span><span class="m">节点页带拆解卡与成熟度</span><span class="m">手工策展 console/chain.js</span><span class="m">证据聚合运行时进行</span></div>' +
      '<p class="lead">本台主轴。五层价值流：<b>算力硬件 → 数据与模型 → 平台与工具 → 行业应用 → 商业与生态</b>。全景页顶部先给行业通行的<b>技术栈视图</b>（应用 → 模型 → 基础设施 → 芯片 → 能源，底三层合称「AI 工厂」）作定位框架，' + chainTotal() + ' 个节点全部映射进五档；标准栈之外本台另拆 L3 平台与工具、L5 商业与生态两层。每层拆解 10+ 节点，节点页带一张「拆解卡」（成熟度阶段 / 价值来源 / 护城河 / 瓶颈 / 领先指标，关键节点再下钻二级细分），并把分散的线索、大事、档案与玩家聚到这个产业结构坐标上；聚合为零的节点即采集缺口信号。</p>' +
    '</div>');
};

function chainTable(layer) {
  var rows = layer.nodes.map(function (nd) {
    var st = nodeStats(nd);
    return '<tr data-node="' + nd.id + '" data-layer="' + layer.key + '" style="cursor:pointer">' +
      '<td><a href="' + chainNodeHref(layer.key, nd.id) + '"><b>' + esc(nd.name) + '</b></a>' + (nd.sub && nd.sub.length ? ' <span class="mono" style="font-size:9px;color:var(--gold)">+' + nd.sub.length + ' 细分</span>' : '') + '</td>' +
      '<td class="dim">' + esc(nd.def) + '</td>' +
      '<td>' + matBadge(nd.maturity) + '</td>' +
      '<td class="mono"><b>' + st.clues.length + '</b></td>' +
      '<td class="mono">' + st.events.length + '</td>' +
      '<td class="mono">' + st.archive.length + '</td>' +
      '<td class="mono">' + st.players.length + '</td></tr>';
  }).join('');
  return '<div class="table-scroll"><table class="dense"><thead><tr><th>节点</th><th>定义</th><th>成熟度</th><th>线索</th><th>大事</th><th>档案</th><th>玩家</th></tr></thead><tbody>' + rows + '</tbody></table></div>';
}

/* 证据密度全景（专题页 #/chain/density）：全部节点的线索聚合一览。
 * 数字为运行时聚合口径——nodeStats 关键词命中，随库更新自动变化，非人工标注；
 * 条形按全库峰值归一（跨层可比），节点保持价值流序（与全景页同一纪律，不按热度）。 */
function chainDensityHtml() {
  var rows = [];
  DB.chain.layers.forEach(function (ly) {
    ly.nodes.forEach(function (nd) { rows.push({ ly: ly, nd: nd, st: nodeStats(nd) }); });
  });
  var max = rows.reduce(function (m, x) { return Math.max(m, x.st.clues.length); }, 0);
  var hitIds = {};
  rows.forEach(function (x) { x.st.clues.forEach(function (c) { hitIds[c.id] = 1; }); });
  var attached = Object.keys(hitIds).length;
  var zero = rows.filter(function (x) { return !x.st.clues.length; });
  var top = rows.slice().sort(function (a, b) { return b.st.clues.length - a.st.clues.length; })[0];
  function bar(x) {
    var n = x.st.clues.length;
    var w = max ? Math.max(n ? 2 : 0, Math.round(n / max * 100)) : 0;
    return '<div style="display:flex;align-items:center;gap:10px;padding:2.5px 0">' +
      '<a href="' + chainNodeHref(x.ly.key, x.nd.id) + '" title="' + esc(x.nd.def) + '" style="flex:0 0 186px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + esc(x.nd.name) + '</a>' +
      '<div style="flex:1;min-width:0;height:9px;background:var(--paper-2)">' +
        (n ? '<div style="height:100%;width:' + w + '%;background:var(--gold-2)"></div>' : '') +
      '</div>' +
      '<span class="mono" style="flex:0 0 34px;text-align:right;font-weight:600">' + n + '</span>' +
      (n ? '' : '<span class="tag red" style="flex:0 0 auto">采集缺口</span>') +
      '</div>';
  }
  var kpi = '<div class="kpi-strip">' +
    opsKpi('全库线索', DB.clues.length, '证据层总量') +
    opsKpi('挂载到节点', attached + '<small> / ' + DB.clues.length + '</small>', '命中至少一个节点的线索') +
    opsKpi('有证据节点', (rows.length - zero.length) + '<small> / ' + rows.length + '</small>', zero.length ? '零线索节点 ' + zero.length + ' 个，见文末缺口清单' : '全部节点均有线索覆盖') +
    (top ? opsKpi('密度峰值', top.st.clues.length + '<small> 条</small>', top.nd.name + '（' + top.ly.key + '）') : '') +
    '</div>';
  var sections = DB.chain.layers.map(function (ly) {
    var inLayer = rows.filter(function (x) { return x.ly === ly; });
    var hits = inLayer.reduce(function (s, x) { return s + x.st.clues.length; }, 0);
    return '<h3 class="sec"><span class="no">' + ly.key + '</span><span class="t">' + esc(ly.name) + ' · ' + ly.nodes.length + ' 节点</span><span class="en">' + esc(ly.en) + '</span></h3>' +
      '<p class="note" style="margin:0 0 6px">去重命中 ' + layerAgg(ly).clues.length + ' 条线索 · 合计 ' + hits + ' 次（跨节点重复计）</p>' +
      inLayer.map(bar).join('');
  }).join('');
  var zeroHtml = zero.length
    ? '<div class="callout red" style="margin-top:16px"><div class="c-t">采集缺口 · ' + zero.length + ' 个零线索节点</div><div class="fchips" style="margin-top:6px">' +
        zero.map(function (x) { return '<a class="fchip" href="' + chainNodeHref(x.ly.key, x.nd.id) + '">' + esc(x.ly.key + ' ' + x.nd.name) + '</a>'; }).join('') + '</div></div>'
    : '';
  return kpi + sections + zeroHtml +
    '<p class="note" style="margin-top:14px">数字为<b>运行时聚合口径</b>：节点关键词（console/chain.js）在页面加载时对全库线索做包含匹配（名称＋主题＋引言＋正文），随证据层更新自动变化，非人工标注。一条线索可命中多个节点——跨节点非互斥，各层「合计」≠全库线索数；条形按全库峰值归一，跨层可比。聚合为零即采集缺口，与「<a href="#/sectors/gaps">研究缺口</a>」互为印证。</p>';
}

/* 技术栈视图（AI Stack）：行业通行分层（应用→模型→基础设施→芯片→能源，底三层=AI 工厂）
 * 映射到本台节点；标准栈之外的 L3/L5 扩展层与原始参考图一并列出。数据见 chain.js 的 DB.chain.stack。 */
function chainStackHtml() {
  var st = DB.chain.stack;
  if (!st || !st.tiers) return '';
  var layerOf = {}, nodeOf = {}, layerName = {};
  DB.chain.layers.forEach(function (ly) {
    layerName[ly.key] = ly.name;
    ly.nodes.forEach(function (nd) { layerOf[nd.id] = ly.key; nodeOf[nd.id] = nd; });
  });
  function tierHtml(t) {
    var chips = (t.nodes || []).map(function (id) {
      var nd = nodeOf[id];
      return nd ? '<a class="fchip" href="' + chainNodeHref(layerOf[id], id) + '" title="' + esc(nd.def) + '">' + esc(nd.name) + '</a>' : '';
    }).join('');
    return '<div class="tier">' +
      '<div class="t-side"><div class="t-name">' + esc(t.name) + '<span class="t-n">' + (t.nodes || []).length + ' 节点</span></div>' +
        '<div class="t-en">' + esc(t.en) + '</div>' +
        '<a class="t-map" href="#/chain/' + esc(t.maps) + '">↳ ' + esc(t.maps + ' ' + layerName[t.maps]) + '</a></div>' +
      '<div class="t-main"><div class="t-desc">' + esc(t.desc) + '</div><div class="t-nodes">' + chips + '</div></div>' +
    '</div>';
  }
  var plain = st.tiers.filter(function (t) { return !t.factory; }).map(tierHtml).join(''),
      fact = st.tiers.filter(function (t) { return t.factory; }).map(tierHtml).join('');
  var extChips = (st.extensions || []).map(function (x) {
    return '<a class="fchip ais-ext-chip" href="#/chain/' + esc(x.key) + '" title="' + esc(x.note) + '">+ ' + esc(x.key + ' ' + x.name) + '</a>';
  }).join('');
  var extNotes = (st.extensions || []).map(function (x) {
    return '<li><b>' + esc(x.key + ' ' + x.name) + '</b>——' + esc(x.note) + '</li>';
  }).join('');
  return '<h3 class="sec"><span class="no">S</span><span class="t">技术栈视图 · 标准分层</span><span class="en">AI Stack</span></h3>' +
    '<p class="note" style="margin:0 0 8px">' + esc(st.note) + '</p>' +
    '<div class="aistack">' +
      '<div class="ais-cap"><span>自上而下：需求牵引</span><span>自下而上：物理托底</span></div>' +
      plain +
      (fact ? '<div class="aif"><div class="aif-cap"><b>' + esc(st.factory.name) + '</b><span class="en">' + esc(st.factory.en) + '</span><span class="d">' + esc(st.factory.desc) + '</span></div>' + fact + '</div>' : '') +
    '</div>' +
    '<div class="ais-ext"><span class="ais-ext-t">标准栈之外 · 本台扩展层</span>' + extChips + '</div>' +
    '<ul class="ais-notes">' + extNotes + '</ul>' +
    (st.refImage ? '<details class="ais-ref"><summary>原始参考图 · 行业技术栈分层（2026-10 微信收录，留档 console/assets/ai-stack-layers.png）</summary><img src="' + esc(st.refImage) + '" alt="AI 技术栈分层参考图：Applications / Models / Infrastructure / Chips / Energy，底三层合称 AI Factories"></details>' : '');
}

PANE.chain = function () {
  var el = $('#pane-chain');
  if (!el) return;
  var cn = currentChainNode();
  if (cn) { el.innerHTML = chainNodeHtml(cn.node, cn.layer); return; }
  var tab = state.tabs.chain;
  if (tab === 'density') { el.innerHTML = chainDensityHtml(); return; }
  if (tab !== 'map') {
    var layer = DB.chain.layers.filter(function (ly) { return ly.key === tab; })[0];
    if (!layer) { el.innerHTML = '<div class="callout">未知分层。</div>'; return; }
    el.innerHTML = chainLayerHtml(layer);
    return;
  }
  el.innerHTML =
    chainStackHtml() +
    '<div class="callout" style="margin-bottom:14px"><div class="c-t">成熟度视图 · ' + chainTotal() + ' 节点全景</div>' +
      matDist(DB.chain.layers.reduce(function (a, ly) { return a.concat(ly.nodes); }, [])) +
      '<div style="margin-top:7px">' + matLegend() + '</div>' +
      '<p class="note" style="margin-top:6px">阶段判断方法论出处与纪律见知识库「<a href="#/kb/method/anatomy">行业拆解方法论</a>」；节点排序按层与价值流，不按热度。</p></div>' +
    DB.chain.layers.map(function (ly) {
    return '<h3 class="sec"><span class="no">' + ly.key + '</span><span class="t">' + esc(ly.name) + ' · ' + ly.nodes.length + ' 节点</span><span class="en">' + esc(ly.en) + '</span></h3>' +
      '<p class="note" style="margin:0 0 8px">' + esc(ly.desc) + '</p>' + chainTable(ly);
  }).join('');
};

/* 层聚合：层内节点去重合并（线索/大事/档案/玩家） */
function layerAgg(layer) {
  var clueMap = {}, evMap = {}, archMap = {}, playerMap = {};
  layer.nodes.forEach(function (nd) {
    var st = nodeStats(nd);
    st.clues.forEach(function (c) { clueMap[c.id] = c; });
    st.events.forEach(function (e) { evMap[e.date + '|' + e.title] = e; });
    st.archive.forEach(function (a) { archMap[a.u] = a; });
    st.players.forEach(function (p) { playerMap[p.name] = p; });
  });
  return {
    clues: Object.keys(clueMap).map(function (k) { return clueMap[k]; }),
    events: Object.keys(evMap).map(function (k) { return evMap[k]; }).sort(function (a, b) { return a.date < b.date ? 1 : -1; }),
    archive: Object.keys(archMap).map(function (k) { return archMap[k]; }),
    players: Object.keys(playerMap).map(function (k) { return playerMap[k]; })
  };
}

function chainLayerHtml(layer) {
  var agg = layerAgg(layer);
  var scored = layer.nodes.map(function (nd) {
    var st = nodeStats(nd);
    return { nd: nd, st: st, score: st.clues.length * 3 + st.events.length * 2 + st.archive.length / 10 };
  });
  var weak = scored.slice().sort(function (a, b) { return a.score - b.score; }).slice(0, 3);
  var layerOf = {};
  DB.chain.layers.forEach(function (ly) { ly.nodes.forEach(function (nd) { layerOf[nd.id] = ly.key; }); });
  var flow = {};
  layer.nodes.forEach(function (nd) {
    (nd.downstream || []).concat(nd.upstream || []).forEach(function (t) {
      var lk = layerOf[t];
      if (lk && lk !== layer.key) flow[lk] = (flow[lk] || 0) + 1;
    });
  });
  var flowChips = Object.keys(flow).sort().map(function (lk) {
    var ly = DB.chain.layers.filter(function (x) { return x.key === lk; })[0];
    return '<a class="fchip" href="#/chain/' + lk + '">' + esc(lk + ' ' + ly.name) + '（' + flow[lk] + ' 条边）</a>';
  }).join('');
  var timeline = agg.events.slice(0, 10).map(function (e) {
    return '<li><b>' + esc(e.date) + '</b> · ' + extLink(e.url, esc(e.title)) + '</li>';
  }).join('');
  var playerChips = agg.players.map(function (p) {
    return '<a class="fchip" href="' + playerHref(p.name) + '" title="' + esc(p.type) + '">' + esc(p.name) + '</a>';
  }).join('');
  var weakRows = weak.map(function (x) {
    return '<tr><td><a href="' + chainNodeHref(layer.key, x.nd.id) + '"><b>' + esc(x.nd.name) + '</b></a></td>' +
      '<td class="mono">' + x.st.clues.length + '</td><td class="mono">' + x.st.events.length + '</td><td class="mono">' + x.st.archive.length + '</td>' +
      '<td><span class="tag ' + (x.score < 3 ? 'neg' : 'plain') + '">' + (x.score < 3 ? '采集缺口' : '待补追踪') + '</span></td></tr>';
  }).join('');
  return h(
    '<div class="callout pine"><div class="c-t">' + esc(layer.key) + ' · ' + esc(layer.name) + ' <span class="en">' + esc(layer.en) + '</span></div>' + esc(layer.desc) +
    '<div style="margin-top:7px">成熟度分布　' + matDist(layer.nodes) + '</div>' +
    '<div style="display:flex;flex-wrap:wrap;gap:5px 14px;margin-top:9px"><a class="fchip" href="#/chain/map">← 产业链全景</a>' + flowChips + '</div></div>' +
    '<div class="kpi-strip">' +
      '<div class="kpi"><div class="k">节点</div><div class="v">' + layer.nodes.length + ' <small>个</small></div><div class="w">本层拆解粒度</div></div>' +
      '<div class="kpi dark"><div class="k">关联线索（去重）</div><div class="v">' + agg.clues.length + ' <small>条</small></div><div class="w">层内节点关键词命中的线索并集</div></div>' +
      '<div class="kpi"><div class="k">关联大事（去重）</div><div class="v">' + agg.events.length + ' <small>条</small></div><div class="w">最近 ' + esc((agg.events[0] || {}).date || '—') + '</div></div>' +
      '<div class="kpi"><div class="k">档案命中（去重）</div><div class="v">' + agg.archive.length + ' <small>条</small></div><div class="w">2017 起精选资讯标题</div></div>' +
    '</div>' +
    '<h3 class="sec"><span class="no">' + layer.nodes.length + '</span><span class="t">节点表</span><span class="en">Nodes</span></h3>' + chainTable(layer) +
    '<div class="grid g2" style="margin-top:18px">' +
      '<div><h3 class="sec"><span class="no">01</span><span class="t">本层大事</span><span class="en">Layer Events</span></h3>' +
        '<ul class="timeline">' + (timeline || '<li class="dim">暂无</li>') + '</ul></div>' +
      '<div><h3 class="sec"><span class="no">02</span><span class="t">弱节点仪表</span><span class="en">Coverage Gauge</span></h3>' +
        '<div class="table-scroll"><table class="dense"><thead><tr><th>节点</th><th>线索</th><th>大事</th><th>档案</th><th>判定</th></tr></thead><tbody>' + weakRows + '</tbody></table></div>' +
        '<p class="note" style="margin-top:8px">按「线索×3 + 大事×2 + 档案/10」综合分排序的本层最弱三节点——聚合为零是采集缺口信号（与研究缺口同哲学）。</p>' +
        (playerChips ? '<h3 class="sec" style="margin-top:18px"><span class="no">03</span><span class="t">本层玩家</span><span class="en">Layer Players</span></h3><div style="display:flex;flex-wrap:wrap;gap:5px 10px">' + playerChips + '</div>' : '') +
      '</div>' +
    '</div>'
  );
}

/* 节点相关术语：术语别名出现在节点名/定义/关键词中 */
function termsForNode(nd) {
  var blob = (nd.name + ' ' + nd.def + ' ' + nd.keywords.join(' ')).toLowerCase();
  var seen = {}, out = [];
  DB.glossary.items.forEach(function (it) {
    (it.a || []).forEach(function (al) {
      if (!seen[it.k] && blob.indexOf(al.toLowerCase()) >= 0 && al.length >= 2) { seen[it.k] = 1; out.push({ k: it.k, t: it.t, a: al }); }
    });
  });
  return out.slice(0, 8);
}

/* 节点相关公司（知识库公司页反向匹配） */
function kbCompaniesFor(nd) {
  var blob = (nd.name + ' ' + nd.def + ' ' + nd.keywords.join(' ')).toLowerCase();
  var out = [];
  var g = DB.kb.groups.filter(function (x) { return x.key === 'companies'; })[0];
  if (!g) return out;
  g.pages.forEach(function (p) {
    var needle = p.name.replace(/（.*?）/, '').trim().toLowerCase();
    if (needle.length >= 3 && blob.indexOf(needle) >= 0) out.push(p);
  });
  return out.slice(0, 6);
}

/* 版图公司名 → 知识库公司页 id（仅精确别名，避免误链） */
var EXPLAIN_KB = {
  'OpenAI': 'openai', 'Anthropic': 'anthropic', 'Google DeepMind': 'gdm', 'Meta': 'meta',
  'Microsoft': 'microsoft', 'NVIDIA': 'nvidia', 'xAI': 'xai', 'DeepSeek': 'deepseek',
  '阿里通义': 'qwen', 'Qwen': 'qwen', '智谱': 'zhipu', '月之暗面': 'moonshot', 'MiniMax': 'minimax',
  '腾讯混元': 'hunyuan', '字节跳动 Seed': 'seed', '字节 Seed': 'seed', '字节跳动': 'seed',
  'Mistral': 'mistral', 'Hugging Face': 'hf', 'Cursor': 'cursor', 'Perplexity': 'perplexity',
  'Midjourney': 'midjourney', 'Runway': 'runway', 'Suno': 'suno', '宇树科技': 'unitree',
  'Figure AI': 'figure', 'Scale AI': 'scaleai', 'AMD': 'amd', 'Broadcom': 'broadcom',
  'Broadcom（博通）': 'broadcom', '美光': 'micron', 'Alphabet': 'alphabet', 'Alphabet（谷歌）': 'alphabet',
  '谷歌': 'alphabet', 'Amazon': 'amazon', 'Tesla': 'tesla', 'Tesla（特斯拉）': 'tesla', 'SpaceX': 'spacex',
  'Palantir': 'palantir', 'ServiceNow': 'servicenow', 'Palo Alto Networks': 'paloaltonetworks',
  'Exiger': 'exiger', 'Altimeter Capital': 'altimeter', 'Social Capital': 'socialcapital',
  'Craft Ventures': 'craft',
  /* L1 算力与硬件（v2 专页） */
  'Google': 'alphabet', 'AWS': 'aws', 'Microsoft Azure': 'azure', 'Azure': 'azure',
  'Google Cloud': 'gcp', 'Intel': 'intel', '摩尔线程': 'moorethreads', '壁仞科技': 'biren',
  '沐曦': 'metax', 'Dell': 'dell', 'HPE': 'hpe', 'Supermicro': 'supermicro',
  '浪潮信息': 'inspur', '阿里云': 'alicloud', '火山引擎': 'volcengine',
  '寒武纪': 'cambricon', '燧原科技': 'enflame', '海光信息': 'hygon', '天数智芯': 'iluvatar',
  'Marvell': 'marvell', '世芯电子': 'alchip', 'Arm': 'arm', '华为昇腾': 'ascend',
  'TSMC': 'tsmc', 'TSMC（台积电）': 'tsmc', '台积电': 'tsmc', 'Samsung Foundry': 'samsungfoundry',
  'Intel Foundry': 'intel', '中芯国际': 'smic', '华虹半导体': 'huahong',
  'ASML': 'asml', 'Applied Materials': 'appliedmaterials', 'Lam Research': 'lamresearch',
  'KLA': 'kla', '北方华创': 'naura', '中微公司': 'amec', 'Amkor': 'amkor',
  '日月光': 'ase', '长电科技': 'jcet', '通富微电': 'tfme', 'Synopsys': 'synopsys',
  'Cadence': 'cadence', 'Siemens EDA': 'siemenseda',
  /* 先进封装 / Chiplet 生态 */
  'Samsung': 'samsungelectronics', '华天科技': 'huatian', 'Besi': 'besi', 'ASMPT': 'asmpt',
  'Kulicke & Soffa': 'kns', '东京精密': 'tokyoseimitsu', 'UCIe 联盟': 'ucie',
  'Alphawave': 'alphawave', '芯原股份': 'verisilicon', '奎芯科技': 'kuixin'
};

function explainCoName(name) {
  /* 版图里的公司一律可点：有策展档案进知识库单页，其余进自动公司专页 */
  return '<a href="' + companyLinkHref(name) + '"><b>' + esc(name) + '</b></a>';
}

/* 深度拆解：卖方行业深度框架（市场→利润池→格局→五力→经济性→技术→政策→多空/反证） */
function deepHtmlFor(node) {
  var d = DB.deep && DB.deep[node.id];
  if (!d) return '';
  var m = d.market || {};
  var cells = [['TAM 总量', m.tam], ['SAM 可服务', m.sam], ['SOM 可获取', m.som], ['增速', m.cagr], ['渗透 / 阶段', m.pen]]
    .filter(function (x) { return x[1]; })
    .map(function (x) {
      return '<div class="dcell"><div class="k">' + esc(x[0]) + '</div><div class="v">' + esc(x[1]) + '</div></div>';
    }).join('');
  var chainRows = (d.chain || []).map(function (r) {
    return '<tr><td><b>' + esc(r[0]) + '</b></td><td>' + companyLinkText(r[1]) + '</td><td class="mono">' + esc(r[2]) + '</td><td>' + esc(r[3]) + '</td><td class="mono">' + esc(r[4]) + '</td></tr>';
  }).join('');
  var l = d.landscape || {};
  var shareRows = (l.shares || []).map(function (r) {
    return '<tr><td>' + companyLinkText(r[0]) + '</td><td class="mono">' + esc(r[1]) + '</td><td>' + esc(r[2]) + '</td></tr>';
  }).join('');
  var forceRows = (d.forces || []).map(function (f) {
    var lv = f[1] || '';
    var cls = /高/.test(lv) ? 'red' : /低/.test(lv) ? 'plain' : 'gold';
    return '<tr><td><b>' + esc(f[0]) + '</b></td><td><span class="tag ' + cls + '">' + esc(lv) + '</span></td><td>' + esc(f[2]) + '</td></tr>';
  }).join('');
  var t = d.thesis || {};
  var li = function (arr) {
    return (arr || []).map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('');
  };
  var eco = d.economics || {}, tech = d.tech || {}, pol = d.policy || {}, v = d.verdict || {};
  var row = function (k, val) {
    return val ? '<div class="prov-row"><span class="k">' + k + '</span><p>' + esc(val) + '</p></div>' : '';
  };
  return '<h3 class="sec" id="sec-deep" data-sec style="margin-top:22px"><span class="no">03</span><span class="t">深度拆解</span><span class="en">Deep Dive · 市场 / 利润池 / 五力 / 经济性</span></h3>' +
    '<p class="note" style="margin-bottom:10px">对标卖方行业深度框架：定边界与规模 → 拆价值链与利润池 → 看竞争结构与五力 → 算成本与单位经济 → 判技术路线与政策地缘 → 落到多空、反证与领先指标。规模与份额为公开资料量级估算，非精确统计，引用前须复核。</p>' +

    '<div class="card deep-card"><h4><span class="no">01</span>市场与需求<span class="en">Market &amp; Demand</span></h4>' +
      (d.boundary ? '<p class="deep-bound">' + esc(d.boundary) + '</p>' : '') +
      '<div class="deep-grid">' + cells + '</div>' +
      row('谁在买', m.demand) + row('预算与替代', m.budget) +
    '</div>' +

    (chainRows ? '<div class="card deep-card"><h4><span class="no">02</span>价值链与利润池<span class="en">Value Chain &amp; Profit Pool</span></h4>' +
      '<div class="table-scroll"><table class="dense deep-table"><thead><tr><th>环节</th><th>代表玩家</th><th>毛利带</th><th>议价力</th><th>价值占比</th></tr></thead><tbody>' + chainRows + '</tbody></table></div>' +
      '<p class="note" style="margin-top:7px">「价值占比」为该环节在终端价格中的大致分成，用于判断利润池位置，非会计口径。</p>' +
    '</div>' : '') +

    '<div class="card deep-card"><h4><span class="no">03</span>竞争格局<span class="en">Landscape</span></h4>' +
      row('结构', l.structure) + row('集中度', l.cr) + row('竞争基础', l.basis) +
      (shareRows ? '<div class="table-scroll"><table class="dense deep-table"><thead><tr><th>玩家 / 阵营</th><th>份额带</th><th>备注</th></tr></thead><tbody>' + shareRows + '</tbody></table></div>' : '') +
      row('动态', l.dynamics) +
    '</div>' +

    (forceRows ? '<div class="card deep-card"><h4><span class="no">04</span>五力与壁垒<span class="en">Five Forces</span></h4>' +
      '<div class="table-scroll"><table class="dense deep-table"><thead><tr><th>力量</th><th>强度</th><th>判断</th></tr></thead><tbody>' + forceRows + '</tbody></table></div>' +
    '</div>' : '') +

    '<div class="grid g3" style="margin-top:10px">' +
      '<div class="card deep-mini"><h4><span class="no">05</span>成本与单位经济<span class="en">Unit Economics</span></h4>' +
        row('成本结构', eco.cost) + row('规模曲线', eco.curve) + row('价格', eco.price) + row('单位经济', eco.unit) + '</div>' +
      '<div class="card deep-mini"><h4><span class="no">06</span>技术与路线<span class="en">Technology</span></h4>' +
        row('代际', tech.gen) + row('阶段', tech.stage) + row('拐点', tech.inflection) + row('瓶颈', tech.bottleneck) + row('路线图', tech.roadmap) + '</div>' +
      '<div class="card deep-mini"><h4><span class="no">07</span>政策与地缘<span class="en">Policy &amp; Geopolitics</span></h4>' +
        row('监管立场', pol.stance) + row('风险', pol.risk) + row('地缘', pol.geo) + '</div>' +
    '</div>' +

    '<div class="deep-thesis">' +
      '<div class="dt-col bull"><h4>看多逻辑<span class="en">Bull</span></h4><ul>' + li(t.bull) + '</ul></div>' +
      '<div class="dt-col bear"><h4>看空 / 风险<span class="en">Bear</span></h4><ul>' + li(t.bear) + '</ul></div>' +
      '<div class="dt-col"><h4>证伪条件<span class="en">Falsifiers</span></h4><ul>' + li(t.falsify) + '</ul></div>' +
      '<div class="dt-col"><h4>领先指标<span class="en">Watchlist</span></h4><ul>' + li(t.watch) + '</ul></div>' +
    '</div>' +
    '<div class="verdict"><span class="vd-k">结论</span><span class="vd-s">' + esc(v.stance || '') + '</span>' +
      '<span class="vd-m">置信度 ' + esc(v.confidence || '—') + ' · 期限 ' + esc(v.horizon || '—') + '</span>' +
      (v.note ? '<span class="vd-n">' + esc(v.note) + '</span>' : '') + '</div>';
}

function chainNodeHtml(node, layer) {
  var st = nodeStats(node);
  var upNodes = (node.upstream || []).map(function (id) { return findChainNode(id); }).filter(Boolean);
  var downNodes = (node.downstream || []).map(function (id) { return findChainNode(id); }).filter(Boolean);
  /* 层内前后节点：一条层内的下钻动线（上一层 → 本节点 → 下一节点） */
  var sibIdx = layer.nodes.indexOf(node);
  var prevNd = sibIdx > 0 ? layer.nodes[sibIdx - 1] : null;
  var nextNd = sibIdx < layer.nodes.length - 1 ? layer.nodes[sibIdx + 1] : null;
  var relChips = function (list, label) {
    if (!list.length) return '<p class="note">（' + label + '：无）</p>';
    return list.map(function (x) {
      return '<a class="fchip" href="' + chainNodeHref(x.layer.key, x.node.id) + '">' + esc(x.node.name) + '</a>';
    }).join('');
  };
  /* 拆解卡：卖方研究 initiation 模板的变体（驱动→价值来源、护城河、风险→瓶颈、催化剂→领先指标），
   * 加成熟度阶段与二级细分；全部为观点层判断，可被证据整卡推翻，修正走 git。 */
  var mat = MAT_BY_K[node.maturity] || null;
  var anatomyCard =
    '<div class="card" id="sec-anatomy" data-sec style="margin:14px 0 0">' +
      '<h4><span class="no">AC</span>拆解卡<span class="en">Anatomy Card' + (mat ? ' · ' + esc(mat.en) : '') + '</span></h4>' +
      (mat ? '<div class="prov-row"><span class="k">阶段</span><p>' + matBadge(node.maturity) + ' ' + esc(mat.hint) + '</p></div>' : '') +
      (node.why ? '<div class="prov-row"><span class="k">价值来源</span><p>' + esc(node.why) + '</p></div>' : '') +
      (node.moat ? '<div class="prov-row"><span class="k">护城河</span><p>' + esc(node.moat) + '</p></div>' : '') +
      (node.bottleneck ? '<div class="prov-row"><span class="k">瓶颈</span><p>' + esc(node.bottleneck) + '</p></div>' : '') +
      (node.signals && node.signals.length ? '<div class="prov-row"><span class="k">领先指标</span><p>' + node.signals.map(esc).join('；') + '</p></div>' : '') +
      (node.sub && node.sub.length ? '<div class="prov-row"><span class="k">二级细分</span><p>' + node.sub.map(function (s) {
        return '<b>' + esc(s.name) + '</b> — ' + esc(s.def);
      }).join('<br>') + '</p></div>' : '') +
      '<p class="note" style="margin-top:9px">卡上字段全部是观点层判断（非事实），出处与口径见知识库「<a href="#/kb/method/anatomy">行业拆解方法论</a>」；证伪即改，修正走 git 留痕。</p>' +
    '</div>';
  var clueRows = st.clues.slice(0, 12).map(function (c) {
    return '<tr><td><a href="' + clueHref(c.id) + '"><b>' + esc(c.name) + '</b></a></td><td>' + esc(c.topic) + '</td><td class="mono">' + c.nEvents + '</td><td class="mono">' + esc(c.lastEvent || '—') + '</td></tr>';
  }).join('');
  var evs = st.events.slice(0, 8).map(function (e) {
    return '<li><b>' + esc(e.date) + '</b> · ' + extLink(e.url, esc(e.title)) + '</li>';
  }).join('');
  var playerChips = st.players.map(function (p) {
    return '<a class="fchip" href="' + playerHref(p.name) + '" title="详见玩家图谱">' + esc(p.name) + '</a>';
  }).join('');
  var modelRows = st.models.map(function (m) {
    return '<tr><td><b>' + esc(m.name) + '</b></td><td class="mono dim">' + esc(m.org) + '</td><td class="mono">' + esc(m.date || '—') + '</td></tr>';
  }).join('');
  var archRows = st.archive.slice(0, 5).map(function (a) {
    return '<tr><td class="mono dim">' + esc(a.d) + '</td><td>' + extLink(a.u, esc(a.t.slice(0, 52))) + '</td></tr>';
  }).join('');
  var evSorted = st.events.slice().sort(function (a, b) { return a.date < b.date ? -1 : 1; });
  var evSpan = evSorted.length ? (evSorted[0].date + ' 至 ' + evSorted[evSorted.length - 1].date) : '—';
  var archYears = st.archive.map(function (a) { return a.d.slice(0, 4); }).sort();
  var archSpan = archYears.length ? (archYears[0] + '–' + archYears[archYears.length - 1]) : '—';
  var terms = termsForNode(node);
  var termChips = terms.map(function (t) {
    return '<span class="term" data-k="' + esc(t.k) + '">' + esc(t.a) + '</span>';
  }).join(' ');
  var comps = kbCompaniesFor(node);
  var compChips = comps.map(function (p) {
    return '<a class="fchip" href="#/kb/companies/' + p.id + '">' + esc(p.name) + '</a>';
  }).join('');
  /* 六层解释 + 行业与企业版图：结构化整理层，先讲清楚「这是什么」，再谈谁在做、怎么做、卖给谁 */
  var ex = (DB.explain && DB.explain[node.id]) || null;
  var dp = (DB.deep && DB.deep[node.id]) || null;
  var noBase = (ex ? 2 : 0) + (dp ? 1 : 0);
  var no = function (i) { return ('0' + (i + noBase)).slice(-2); };
  var introHtml = '', indHtml = '';
  if (ex) {
    var lvRows = ex.levels.map(function (l, i) {
      return '<div class="ladder-step"><span class="lv"><b>' + (i + 1) + '</b>' + esc(l[0]) + '</span><p>' + esc(l[1]) + '</p></div>';
    }).join('');
    introHtml =
      '<h3 class="sec" id="sec-what" data-sec style="margin-top:20px"><span class="no">01</span><span class="t">这是什么</span><span class="en">What It Is · 六层由浅入深</span></h3>' +
      '<div class="ladder">' + lvRows + '</div>' +
      '<p class="note" style="margin-top:8px">从一句话到前沿判断逐层展开；事实层与观点层分离——六层为结构化整理层，可被证据整段修订。' +
        '<a href="#/kb/method/anatomy"> 方法论</a></p>';
    if (ex.industries && ex.industries.length) {
      indHtml = ex.industries.map(function (ind) {
        var rows = ind.companies.map(function (c) {
          return '<tr><td>' + explainCoName(c.name) + '</td><td>' + esc(c.role) + '</td><td>' + esc(c.products) + '</td><td>' + esc(c.tech) + '</td><td>' + esc(c.scenes) + '</td></tr>';
        }).join('');
        return '<div class="ind-block"><div class="ind-head"><span class="n">' + esc(ind.name) + '</span><span class="d">' + esc(ind.desc) + '</span></div>' +
          '<div class="table-scroll"><table class="dense co-table"><thead><tr><th>企业</th><th>角色 / 定位</th><th>主要产品</th><th>技术</th><th>商业场景</th></tr></thead><tbody>' + rows + '</tbody></table></div></div>';
      }).join('');
      indHtml =
        '<h3 class="sec" id="sec-ind" data-sec style="margin-top:22px"><span class="no">02</span><span class="t">行业与企业版图</span><span class="en">Industries & Companies</span></h3>' +
        indHtml +
        '<p class="note" style="margin-top:8px">共 ' + ex.industries.length + ' 个行业、' +
          ex.industries.reduce(function (s, i) { return s + i.companies.length; }, 0) +
          ' 家企业；公司、产品与技术为公开产业常识的结构化整理，非新闻事实。企业名均可点入专页——已有策展档案的进知识库深度单页，其余进自动聚合的公司专页。全部公司见 <a href="#/company">公司专页总索引</a>。</p>';
    }
  }
  /* 本页目录：新内容在上、原证据层在下，一屏内可跳转，避免误以为旧板块被替换 */
  var navItems = [];
  if (ex) navItems.push(['sec-what', '01 这是什么']);
  if (ex && ex.industries && ex.industries.length) navItems.push(['sec-ind', '02 行业与企业']);
  navItems.push(['sec-anatomy', '拆解卡']);
  if (dp) navItems.push(['sec-deep', '03 深度拆解']);
  /* 证据层编号按实际存在的板块连续编号，避免缺段时出现 01/02/04/05 的空号 */
  var evSeq = 0;
  var nClues = no(++evSeq), nPlayers = no(++evSeq);
  var nModels = st.models.length ? no(++evSeq) : '';
  var nEvents = no(++evSeq);
  var nArchive = st.archive.length ? no(++evSeq) : '';
  navItems.push(['sec-clues', nClues + ' 关联线索'], ['sec-players', nPlayers + ' 相关玩家']);
  if (st.models.length) navItems.push(['sec-models', nModels + ' 相关模型']);
  navItems.push(['sec-events', nEvents + ' 关联大事']);
  if (st.archive.length) navItems.push(['sec-archive', nArchive + ' 档案抽样']);
  var navHtml = '<div class="page-nav"><span class="pn-t">本页</span>' + navItems.map(function (x) {
    return '<button type="button" data-jump-sec="' + x[0] + '">' + esc(x[1]) + '</button>';
  }).join('') + '</div>';
  return h(
    '<div class="callout"><div class="c-t">' + esc(layer.key) + ' · ' + esc(layer.name) + '</div><b>' + esc(node.name) + '</b> ' + matBadge(node.maturity) + ' — ' + esc(node.def) +
    '<div class="fchips" style="margin-top:9px"><span class="tag plain">上游</span> ' + relChips(upNodes, '上游') + '　<span class="tag plain">下游</span> ' + relChips(downNodes, '下游') + '</div>' +
    (termChips ? '<div class="fchips" style="margin-top:6px"><span class="tag plain">术语</span> ' + termChips + '</div>' : '') +
    (compChips ? '<div class="fchips" style="margin-top:6px"><span class="tag plain">公司档案</span> ' + compChips + '</div>' : '') +
    '<div class="fchips" style="margin-top:6px"><a class="fchip" href="#/chain/' + layer.key + '">← 回' + esc(layer.name) + '</a><a class="fchip" href="#/chain">产业链全景</a>' +
      (prevNd ? '<a class="fchip" href="' + chainNodeHref(layer.key, prevNd.id) + '">← ' + esc(prevNd.name) + '</a>' : '') +
      (nextNd ? '<a class="fchip" href="' + chainNodeHref(layer.key, nextNd.id) + '">' + esc(nextNd.name) + ' →</a>' : '') + '</div></div>' +

    navHtml +

    introHtml +
    indHtml +

    anatomyCard +

    deepHtmlFor(node) +

    '<div class="layer-sep" id="sec-evidence" data-sec"><span class="ls-t">证据层</span><span class="ls-d">Evidence · 以下为本节点关键词在库内实时命中的原始线索、玩家、模型、大事与档案</span></div>' +

    '<div class="kpi-strip">' +
      '<div class="kpi"><div class="k">关联线索</div><div class="v">' + st.clues.length + ' <small>条</small></div><div class="w">关键词命中线索全文</div></div>' +
      '<div class="kpi dark"><div class="k">关联大事</div><div class="v">' + st.events.length + ' <small>条</small></div><div class="w">' + esc(evSpan) + '</div></div>' +
      '<div class="kpi"><div class="k">档案命中</div><div class="v">' + st.archive.length + ' <small>条</small></div><div class="w">年份跨度 ' + esc(archSpan) + '</div></div>' +
      '<div class="kpi"><div class="k">玩家 / 模型</div><div class="v">' + st.players.length + ' <small>/</small> ' + st.models.length + '</div><div class="w">策展名单关键词命中</div></div>' +
    '</div>' +

    '<div class="grid g2" style="margin-top:16px">' +
      '<div><h3 class="sec" id="sec-clues" data-sec><span class="no">' + nClues + '</span><span class="t">关联线索</span><span class="en">Clues</span></h3>' +
        '<div class="table-scroll"><table class="dense"><thead><tr><th>线索</th><th>主题</th><th>事件</th><th>最近</th></tr></thead><tbody>' + (clueRows || '<tr><td colspan="4" class="dim">暂无命中——采集缺口信号</td></tr>') + '</tbody></table></div>' +
        '<h3 class="sec" id="sec-players" data-sec style="margin-top:20px"><span class="no">' + nPlayers + '</span><span class="t">相关玩家</span><span class="en">Players</span></h3>' +
        '<div style="display:flex;flex-wrap:wrap;gap:5px 10px">' + (playerChips || '<span class="dim">无</span>') + '</div>' +
        (st.models.length ? '<h3 class="sec" id="sec-models" data-sec style="margin-top:20px"><span class="no">' + nModels + '</span><span class="t">相关模型</span><span class="en">Models</span></h3><div class="table-scroll"><table class="dense"><thead><tr><th>模型</th><th>机构</th><th>发布</th></tr></thead><tbody>' + modelRows + '</tbody></table></div>' : '') +
      '</div>' +
      '<div><h3 class="sec" id="sec-events" data-sec><span class="no">' + nEvents + '</span><span class="t">关联大事</span><span class="en">Events</span></h3>' +
        '<ul class="timeline">' + (evs || '<li class="dim">暂无</li>') + '</ul>' +
        (st.archive.length ? '<h3 class="sec" id="sec-archive" data-sec style="margin-top:20px"><span class="no">' + nArchive + '</span><span class="t">档案抽样</span><span class="en">Archive</span></h3><div class="table-scroll"><table class="dense"><thead><tr><th>日期</th><th>标题（共 ' + st.archive.length + ' 条）</th></tr></thead><tbody>' + archRows + '</tbody></table></div>' : '') +
      '</div>' +
    '</div>'
  );
}

function findChainNode(id) {
  for (var i = 0; i < DB.chain.layers.length; i++) {
    var ly = DB.chain.layers[i];
    for (var j = 0; j < ly.nodes.length; j++) {
      if (ly.nodes[j].id === id) return { node: ly.nodes[j], layer: ly };
    }
  }
  return null;
}

/* ============================================================ 赛道评分卡 */
RENDER.scores = function () {
  return viewShell('scores',
    '<div class="view-head">' +
      '<h2>赛道评分卡<span class="en">Sector Scores</span></h2>' +
      '<div class="vh-meta"><span class="m">' + DB.score.sectors.length + ' 赛道 × 5 维</span><span class="m">评分为分析判断，与事实分离</span><span class="m">权重前台实时重排</span><span class="m">快照 ' + esc(DB.score.asOf) + '</span></div>' +
      '<p class="lead">研究优先级的量化尝试：五个维度（势能/商业化/壁垒/政策敞口/本库覆盖）各 1-5 分，加权总分即建议投入度。换权重即换视角——机会派与风控派会得到不同的排名，这正是设计意图。</p>' +
    '</div>');
};

function scoreWeights() {
  if (!state.scWeights) state.scWeights = Object.assign({}, DB.score.weightsDefault);
  return state.scWeights;
}
function dimsHtml(dims) {
  return '<span class="dims">' + Object.keys(DB.score.dims).map(function (k) {
    var v = dims[k] || 0;
    return '<i class="s' + v + '" title="' + esc(DB.score.dims[k].label) + ' ' + v + '">' + v + '</i>';
  }).join('') + '</span>';
}

PANE.scores = function () {
  var el = $('#pane-scores');
  if (!el) return;
  var tab = state.tabs.scores;
  if (tab === 'weights') {
    var w = scoreWeights();
    var presetSeg = DB.score.presets.map(function (p) {
      return '<button data-p="' + p.k + '"' + (state.scPreset === p.k ? ' class="on"' : '') + '>' + esc(p.l) + '</button>';
    }).join('');
    var sliders = Object.keys(DB.score.dims).map(function (k) {
      return '<div class="prov-row" style="margin-top:9px"><span class="k">' + esc(DB.score.dims[k].label) + '</span>' +
        '<p><input type="range" min="0" max="50" step="5" value="' + (w[k] || 0) + '" data-w="' + k + '" style="width:60%;vertical-align:middle"> ' +
        '<span class="mono"><b id="wv-' + k + '">' + (w[k] || 0) + '</b>%</span> <span class="dim">' + esc(DB.score.dims[k].desc) + '</span></p></div>';
    }).join('');
    el.innerHTML = '<div class="tools"><span class="seg" id="scPresetSeg">' + presetSeg + '</span><span class="count" id="scSum"></span></div>' +
      '<div class="card">' + sliders + '</div>' +
      '<p class="note" style="margin-top:10px">拖动滑杆，<a href="#/scores/rank">排名页签</a>实时重排。权重仅本机内存状态，刷新即回默认；要固化请改 score.js 的 weightsDefault。</p>';
    updateScSum();
    return;
  }
  if (tab === 'method') {
    var dimRows = Object.keys(DB.score.dims).map(function (k) {
      return '<tr><td><span class="tag">' + esc(DB.score.dims[k].label) + '</span></td><td>' + esc(DB.score.dims[k].desc) + '</td></tr>';
    }).join('');
    var redRows = DB.score.redlines.map(function (r, i) {
      return '<li><b>' + (i + 1) + '.</b> ' + esc(r) + '</li>';
    }).join('');
    el.innerHTML = '<h3 class="sec"><span class="no">01</span><span class="t">维度口径</span><span class="en">Dimensions</span></h3>' +
      '<div class="table-scroll"><table class="dense"><thead><tr><th>维度</th><th>口径</th></tr></thead><tbody>' + dimRows + '</tbody></table></div>' +
      '<h3 class="sec" style="margin-top:20px"><span class="no">02</span><span class="t">研究红线</span><span class="en">Red Lines</span></h3>' +
      '<ul class="plain">' + redRows + '</ul>' +
      provBlock('scores');
    return;
  }
  var w = scoreWeights();
  var ranked = Engine.computeAll(DB.score.sectors, w);
  var presetSeg = DB.score.presets.map(function (p) {
    return '<button data-p="' + p.k + '"' + (state.scPreset === p.k ? ' class="on"' : '') + '>' + esc(p.l) + '</button>';
  }).join('');
  var rows = ranked.map(function (r, i) {
    var rk = '<span class="rk ' + (i < 3 ? 't' + (i + 1) : '') + '">' + (i + 1) + '</span>';
    return '<tr data-topic="' + esc(r.id) + '" style="cursor:pointer">' +
      '<td class="mono">' + rk + '</td>' +
      '<td><a href="#/topics/' + encodeURIComponent(r.id) + '"><b>' + esc(r.name) + '</b></a></td>' +
      '<td class="mono"><b>' + r.total.toFixed(2) + '</b></td>' +
      '<td>' + dimsHtml(r.dims) + '</td>' +
      '<td><span class="tag ' + (i < 3 ? 'gold' : 'plain') + '">' + esc(Engine.band(r.total)) + '</span></td>' +
      '<td>' + esc(r.note) + cite('scores', Math.min(i + 1, 5)) + '</td></tr>';
  }).join('');
  el.innerHTML = '<div class="tools"><span class="seg" id="scPresetSeg">' + presetSeg + '</span><span class="count">权重可在「权重与假设」页签调整</span></div>' +
    '<div class="table-scroll"><table class="dense"><thead><tr><th>序</th><th>赛道</th><th>总分</th><th>五维（势能/商业化/壁垒/政策/覆盖）</th><th>梯队</th><th>一句话判断</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
    '<p class="note" style="margin-top:10px">点击行进主题详情；上标角标对应本页底部数据可靠性板块。' + cite('scores', 1) + '</p>' +
    provBlock('scores');
};

function updateScSum() {
  var el = $('#scSum');
  if (!el) return;
  var w = scoreWeights();
  var sum = Object.keys(w).reduce(function (s, k) { return s + (Number(w[k]) || 0); }, 0);
  el.textContent = '权重合计 ' + sum + (sum === 100 ? ' ✓' : '（不强制 100，按占比归一）');
}

BIND.scores = function () {
  var box = $('#v-scores');
  box.addEventListener('click', function (e) {
    var p = e.target.closest('#scPresetSeg button');
    if (p) {
      state.scPreset = p.getAttribute('data-p');
      var preset = DB.score.presets.filter(function (x) { return x.k === state.scPreset; })[0];
      if (preset) state.scWeights = Object.assign({}, preset.w);
      PANE.scores();
      return;
    }
    var back = e.target.closest('[data-cite-back]');
    if (back) { jumpFlash(document.querySelector('[data-cite="' + back.getAttribute('data-cite-back') + '"]')); return; }
    var sup = e.target.closest('sup.cite[data-jump]');
    if (sup) { jumpFlash(document.getElementById(sup.getAttribute('data-jump'))); }
  });
  box.addEventListener('input', function (e) {
    var k = e.target.getAttribute && e.target.getAttribute('data-w');
    if (k) {
      scoreWeights()[k] = Number(e.target.value);
      state.scPreset = 'custom';
      var wv = $('#wv-' + k);
      if (wv) wv.textContent = e.target.value;
      updateScSum();
    }
  });
};

/* ============================================================ 成本模拟器 */
RENDER.sim = function () {
  return viewShell('sim',
    '<div class="view-head">' +
      '<h2>成本模拟器<span class="en">Cost Simulator</span></h2>' +
      '<div class="vh-meta"><span class="m">推理月成本 = 请求 × token × 单价 × 30</span><span class="m">价格取自模型登记册</span><span class="m">仅收录库内可证价格</span></div>' +
      '<p class="lead">选模型、设负载，算出月度推理账单并与全模型同负载对比。这是「token 经济」的直接工具：换挡位即换场景（原型 / 产品 / 规模化）。</p>' +
    '</div>');
};

function simModels() {
  return DB.models.filter(function (m) { return m.priceIn || m.priceOut; });
}
function simCost(m, req, inT, outT) {
  var pin = parseFloat(m.priceIn) || 0, pout = parseFloat(m.priceOut) || 0;
  return req * (inT * pin + outT * pout) / 1e6 * 30;
}
function simFmt(v) {
  return v >= 1000000 ? '$' + (v / 1000000).toFixed(2) + 'M' : v >= 1000 ? '$' + Math.round(v / 1000) + 'K' : '$' + Math.round(v);
}

PANE.sim = function () {
  var el = $('#pane-sim');
  if (!el) return;
  var ms = simModels();
  if (!state.simM || !ms.some(function (m) { return m.name === state.simM; })) state.simM = ms.length ? ms[0].name : '';
  var req = SIM_REQ[state.simReq], inT = SIM_IN[state.simIn], outT = SIM_OUT[state.simOut];
  var sel = function (id, opts, cur, label) {
    return '<div class="prov-row" style="margin-top:8px"><span class="k">' + label + '</span><p>' +
      '<input type="range" min="0" max="' + (opts.length - 1) + '" step="1" value="' + cur + '" data-sim="' + id + '" style="width:55%;vertical-align:middle"> ' +
      '<b class="mono" id="simv-' + id + '">' + (id === 'M' ? esc(state.simM) : opts[cur].toLocaleString()) + '</b></p></div>';
  };
  if (state.tabs.sim === 'table') {
    var max = 1;
    ms.forEach(function (m) { var c = simCost(m, req, inT, outT); if (c > max) max = c; });
    var rows = ms.slice().sort(function (a, b) { return simCost(a, req, inT, outT) - simCost(b, req, inT, outT); }).map(function (m) {
      var c = simCost(m, req, inT, outT);
      return '<tr' + (m.name === state.simM ? ' class="hl"' : '') + '><td><b>' + esc(m.name) + '</b> <span class="dim mono" style="font-size:10px">' + esc(m.org) + '</span>' + (m.priceSrc === 'derived' ? ' <span class="tag gold">推算价</span>' : '') + '</td>' +
        '<td class="mono">$' + esc(m.priceIn) + ' / $' + esc(m.priceOut) + '</td>' +
        '<td class="mono"><b>' + simFmt(c) + '</b> ' + bar(c, max, 'var(--gold-2)') + '</td></tr>';
    }).join('');
    el.innerHTML = '<div class="table-scroll"><table class="dense"><thead><tr><th>模型</th><th>价格（输入/输出 每百万 token）</th><th>当前负载月成本</th></tr></thead><tbody>' + (rows || '<tr><td colspan="3" class="dim">登记册暂无可证价格</td></tr>') + '</tbody></table></div>' +
      '<p class="note" style="margin-top:10px">当前负载：' + req.toLocaleString() + ' 次/日 · 输入 ' + inT.toLocaleString() + ' token · 输出 ' + outT.toLocaleString() + ' token。标「推算价」按登记册备注的依据折算，引用需注明；未定价模型待回填后自动入表。</p>' +
      provBlock('sim');
    return;
  }
  var sliders = sel('Req', SIM_REQ, state.simReq, '日均请求') + sel('In', SIM_IN, state.simIn, '输入 token/次') + sel('Out', SIM_OUT, state.simOut, '输出 token/次');
  var msel = '<div class="prov-row" style="margin-top:8px"><span class="k">模型</span><p><select class="finput" id="simModel">' +
    ms.map(function (m) { return '<option value="' + esc(m.name) + '"' + (m.name === state.simM ? ' selected' : '') + '>' + esc(m.name) + '（$' + esc(m.priceIn || '—') + '/$' + esc(m.priceOut || '—') + '）</option>'; }).join('') +
    '</select></p></div>';
  var cur = ms.filter(function (m) { return m.name === state.simM; })[0];
  var cost = cur ? simCost(cur, req, inT, outT) : 0;
  el.innerHTML = '<div class="sim">' +
    '<div class="sim-head"><span class="t">推理月账单</span><span class="en">Monthly Inference Bill</span><span class="count" style="margin-left:auto;color:var(--deck-ink-2)">仅本机内存状态</span></div>' +
    '<div class="sim-body">' + msel + sliders + '</div>' +
    '<div class="sim-out" style="padding:14px 18px;border-top:1px solid var(--deck-line)">' +
      '<span style="font-family:var(--mono);font-size:30px;font-weight:600;color:var(--deck-ink)">' + simFmt(cost) + '</span>' +
      ' <span style="color:var(--deck-ink-2);font-size:12px">/ 月（' + esc(cur ? cur.name : '—') + ' · ' + req.toLocaleString() + ' 次/日）</span>' +
      '<p class="note" style="color:var(--deck-ink-2);margin-top:6px">换到 <a href="#/sim/table">全模型对比</a> 看同负载下的成本排序。' + cite('sim', 1) + ' ' + cite('sim', 2) + '</p>' +
    '</div></div>';
};

BIND.sim = function () {
  var box = $('#v-sim');
  box.addEventListener('input', function (e) {
    var k = e.target.getAttribute && e.target.getAttribute('data-sim');
    if (k === 'Req') state.simReq = Number(e.target.value);
    if (k === 'In') state.simIn = Number(e.target.value);
    if (k === 'Out') state.simOut = Number(e.target.value);
    if (k) PANE.sim();
  });
  box.addEventListener('change', function (e) {
    if (e.target.id === 'simModel') { state.simM = e.target.value; PANE.sim(); }
  });
  box.addEventListener('click', function (e) {
    var back = e.target.closest('[data-cite-back]');
    if (back) { jumpFlash(document.querySelector('[data-cite="' + back.getAttribute('data-cite-back') + '"]')); return; }
    var sup = e.target.closest('sup.cite[data-jump]');
    if (sup) { jumpFlash(document.getElementById(sup.getAttribute('data-jump'))); }
  });
};

/* ============================================================ 决策台 */
RENDER.decisions = function () {
  var n = function (arr) { return arr.filter(function (d) { return d.status !== '已决'; }).length; };
  return viewShell('decisions',
    '<div class="view-head">' +
      '<h2>决策台<span class="en">Decisions</span></h2>' +
      '<div class="vh-meta"><span class="m">A ' + n(DB.decisions.a) + ' · B ' + n(DB.decisions.b) + ' · C ' + DB.decisions.c.length + '</span><span class="m">手工策展 console/decisions.js</span><span class="m">研究运营的待决清单</span></div>' +
      '<p class="lead">把「要不要做」写成决策：问题、背景、选项与倾向、截止。三项共同前置往往是一次对话就能拿到的信息，不是三次分析。</p>' +
    '</div>');
};

function decisionCard(d) {
  var opts = (d.options || []).map(function (o) {
    return '<li>' + (o.lean === 'preferred' ? '<span class="tag gold">倾向</span> ' : '') + esc(o.t) + '</li>';
  }).join('');
  return '<div class="callout ' + (d.id.charAt(0) === 'A' ? '' : 'pine') + '">' +
    '<div class="c-t">' + esc(d.id) + ' · ' + esc(d.status) + (d.due ? ' · 截止 ' + esc(d.due) : '') + '</div>' +
    '<b>' + esc(d.q) + '</b>' +
    (d.why ? '<p style="margin:7px 0 2px">' + esc(d.why) + '</p>' : (d.what ? '<p style="margin:7px 0 2px">' + esc(d.what) + '</p>' : '')) +
    (opts ? '<ul class="plain" style="margin-top:4px">' + opts + '</ul>' : '') +
    (d.conclusion ? '<div class="prov-row"><span class="k">结论</span><p>' + esc(d.conclusion) + '</p></div>' : '') +
    '</div>';
}

PANE.decisions = function () {
  var el = $('#pane-decisions');
  if (!el) return;
  if (state.tabs.decisions === 'log') {
    var decided = DB.decisions.a.concat(DB.decisions.b).filter(function (d) { return d.status === '已决'; });
    el.innerHTML = decided.length
      ? decided.map(decisionCard).join('')
      : '<div class="callout">尚无已决项。决策完成后把 status 改为「已决」并填 conclusion，此处成为研究运营的修正记录。</div>';
    return;
  }
  var sec = function (no, title, en, arr) {
    return '<h3 class="sec"><span class="no">' + arr.length + '</span><span class="t">' + title + '</span><span class="en">' + en + '</span></h3>' +
      (arr.map(decisionCard).join('') || '<p class="note">空</p>');
  };
  el.innerHTML = sec('A', 'A 类 · 重决策', 'Major', DB.decisions.a) +
    sec('B', 'B 类 · 中决策', 'Medium', DB.decisions.b) +
    sec('C', 'C 类 · 清单', 'Checklist', DB.decisions.c);
};

/* ============================================================ 年度日历 */
RENDER.calendar = function () {
  return viewShell('calendar',
    '<div class="view-head">' +
      '<h2>年度日历<span class="en">Calendar ' + esc(DB.calendar.year) + '</span></h2>' +
      '<div class="vh-meta"><span class="m">' + DB.calendar.items.length + ' 个节点</span><span class="m">会议 / 发布 / 监管 / 财报 / 安全</span><span class="m">惯例时间以官网为准</span></div>' +
      '<p class="lead">研究节奏的外部坐标系：财报季验证 Capex 与收入，顶会看研究前沿，监管节点定合规里程碑。日期多为惯例窗口，逐条标注类型。</p>' +
    '</div>');
};

PANE.calendar = function () {
  var el = $('#pane-calendar');
  if (!el) return;
  var items = DB.calendar.items.filter(function (i) { return state.calType === 'all' || i.type === state.calType; });
  if (state.tabs.calendar === 'next') {
    var near = items.filter(function (i) { return i.d >= TODAY; }).sort(function (a, b) { return a.d < b.d ? -1 : 1; }).slice(0, 8);
    var lis = near.map(function (i) {
      var days = Math.round((new Date(i.d) - new Date(TODAY)) / 86400000);
      return '<li><div class="ph">' + esc(i.type) + '<span class="when">' + esc(i.d) + (days >= 0 ? ' · ' + days + ' 天后' : '') + '</span></div>' +
        '<div class="tt">' + esc(i.name) + '</div><div class="td">' + esc(i.note) + '</div></li>';
    }).join('');
    el.innerHTML = '<ul class="timeline">' + (lis || '<li class="dim">未来 90 天无节点</li>') + '</ul>';
    return;
  }
  var byQ = { Q1: [], Q2: [], Q3: [], Q4: [] };
  items.forEach(function (i) { byQ['Q' + Math.ceil(Number(i.m.slice(5, 7)) / 3)].push(i); });
  var html = Object.keys(byQ).map(function (q) {
    var lis = byQ[q].map(function (i) {
      return '<li><div class="ph">' + esc(i.m) + '<span class="when">' + esc(i.d) + '</span></div>' +
        '<div class="tt"><span class="tag gold">' + esc(i.type) + '</span> ' + esc(i.name) + '</div>' +
        '<div class="td">' + esc(i.note) + '</div></li>';
    }).join('');
    return '<h3 class="sec"><span class="no">' + q + '</span><span class="t">' + byQ[q].length + ' 个节点</span><span class="en">' + q + ' ' + esc(DB.calendar.year) + '</span></h3><ul class="timeline">' + lis + '</ul>';
  }).join('');
  var types = {};
  DB.calendar.items.forEach(function (i) { types[i.type] = (types[i.type] || 0) + 1; });
  var seg = '<button data-c="all"' + (state.calType === 'all' ? ' class="on"' : '') + '>全部</button>';
  Object.keys(types).forEach(function (t) { seg += '<button data-c="' + t + '"' + (state.calType === t ? ' class="on"' : '') + '>' + t + ' ' + types[t] + '</button>'; });
  el.innerHTML = '<div class="tools"><span class="seg" id="calSeg">' + seg + '</span></div>' + html;
};

BIND.calendar = function () {
  $('#v-calendar').addEventListener('click', function (e) {
    var b = e.target.closest('#calSeg button');
    if (b) { state.calType = b.getAttribute('data-c'); PANE.calendar(); }
  });
};

/* ============================================================ 术语库 */
RENDER.glossary = function () {
  return viewShell('glossary',
    '<div class="view-head">' +
      '<h2>术语库<span class="en">Glossary</span></h2>' +
      '<div class="vh-meta"><span class="m">' + DB.glossary.items.length + ' 条 · ' + Object.keys(DB.glossary.cats).length + ' 类</span><span class="m">点击术语弹定义</span><span class="m">知识库单页正文的术语词自动可点</span></div>' +
      '<p class="lead">AI 研究的公共词汇表：' + Object.keys(DB.glossary.cats).map(function (c) { return DB.glossary.cats[c]; }).join('、') + '，共 ' + Object.keys(DB.glossary.cats).length + ' 类。每写研判遇到新术语即回填一条。</p>' +
    '</div>');
};

PANE.glossary = function () {
  var el = $('#pane-glossary');
  if (!el) return;
  var q = state.glQ.trim().toLowerCase();
  var cats = DB.glossary.cats;
  var seg = '<button data-c="all"' + (state.glCat === 'all' ? ' class="on"' : '') + '>全部 ' + DB.glossary.items.length + '</button>';
  Object.keys(cats).forEach(function (c) {
    var n = DB.glossary.items.filter(function (i) { return i.c === c; }).length;
    seg += '<button data-c="' + c + '"' + (state.glCat === c ? ' class="on"' : '') + '>' + esc(cats[c]) + ' ' + n + '</button>';
  });
  var rows = DB.glossary.items.filter(function (i) {
    if (state.glCat !== 'all' && i.c !== state.glCat) return false;
    if (!q) return true;
    return (i.t + ' ' + i.b).toLowerCase().indexOf(q) >= 0;
  });
  var cards = rows.map(function (i) {
    return '<div class="card" style="margin-bottom:8px"><h4><span class="term" data-k="' + esc(i.k) + '">' + esc(i.t) + '</span> <span class="en">' + esc(cats[i.c] || i.c) + '</span></h4><p>' + esc(i.b) + '</p></div>';
  }).join('');
  el.innerHTML = '<div class="tools">' +
      '<span class="seg" id="glSeg">' + seg + '</span>' +
      '<input class="finput" id="glQuery" placeholder="检索术语与定义" autocomplete="off">' +
      '<span class="count">' + rows.length + ' 条</span>' +
    '</div><div class="grid g2">' + (cards || '<p class="note">无匹配术语</p>') + '</div>';
};

BIND.glossary = function () {
  var box = $('#v-glossary');
  box.addEventListener('click', function (e) {
    var b = e.target.closest('#glSeg button');
    if (b) { state.glCat = b.getAttribute('data-c'); PANE.glossary(); return; }
    var t = e.target.closest('.term[data-k]');
    if (t) openTerm(t.getAttribute('data-k'));
  });
  box.addEventListener('input', function (e) {
    if (e.target.id === 'glQuery') { state.glQ = e.target.value; PANE.glossary(); }
  });
};

/* 术语弹框 */
function openTerm(k) {
  var g = null;
  DB.glossary.items.forEach(function (x) { if (x.k === k) g = x; });
  if (!g) return;
  $('#gTitle').textContent = g.t;
  $('#gCat').textContent = DB.glossary.cats[g.c] || g.c;
  $('#gBody').innerHTML = '<p>' + esc(g.b) + '</p>';
  $('#glossLayer').classList.add('on');
}
function closeTerm() { $('#glossLayer').classList.remove('on'); }

/* ============================================================ 知识库 */
RENDER.kb = function () {
  return viewShell('kb',
    '<div class="view-head">' +
      '<h2>知识库<span class="en">Knowledge Base</span></h2>' +
      '<div class="vh-meta"><span class="m">' + DB.kb.groups.length + ' 组 · ' + kbTotal() + ' 单页</span><span class="m">手工策展 console/kb.js</span><span class="m">方法论 / 工程 / 岗位 / 公司 / 商业 / 职业 / 操盘</span></div>' +
      '<p class="lead">超越新闻语料的结构化知识层：每个方法论、工程方式、岗位、公司、商业模式与职业路径各占一页。公司与玩家图谱联动，术语弹层通用。</p>' +
    '</div>');
};

PANE.kb = function () {
  var el = $('#pane-kb');
  if (!el) return;
  var cur = currentKbPage();
  if (cur) {
    var p = cur.page, g = cur.group;
    var player = null;
    DB.players.forEach(function (x) { if (x.name === (p.player || p.name)) player = x; });
    var sibs = g.pages.map(function (x) {
      return '<a class="fchip" href="#/kb/' + g.key + '/' + x.id + '"' + (x.id === p.id ? '' : ' style="opacity:.62"') + '>' + esc(x.name) + '</a>';
    }).join('');
    el.innerHTML = h(
      '<div class="callout pine"><div class="c-t">' + esc(g.name) + ' · ' + esc(g.en) + '</div><b>' + esc(p.name) + '</b> — ' + esc(p.def) +
      '<div class="fchips" style="margin-top:9px"><a class="fchip" href="#/kb/' + g.key + '">← 回' + esc(g.name) + '</a><a class="fchip" href="#/kb">知识库全景</a></div></div>' +
      '<div class="md-body">' + termify(Md.render(p.body, { base: 'kb/' + g.key })) + '</div>' +
      (player ? '<div class="callout"><div class="c-t">关联玩家</div>玩家图谱已收录 <b>' + esc(player.name) + '</b>（' + esc(player.type) + '）——<a href="' + playerHref(player.name) + '">看关联线索与大事记提及</a>。</div>' : '') +
      (cur.group.key === 'companies' ? (function () {
        var out = '';
        var co = companyNameForLabel(p.player || p.name);
        if (co) out += '<div class="callout"><div class="c-t">公司专页</div>自动聚合的产业链坐标与全库证据：<a href="' + companyHref(co) + '"><b>' + esc(co) + '</b></a>。</div>';
        var cn = chainNodesForName(p.name);
        if (cn.length) out += '<div class="callout"><div class="c-t">产业链坐标</div>' + cn.map(function (x) {
          return '<a class="fchip" href="' + chainNodeHref(x.layer.key, x.node.id) + '">' + esc(x.layer.key + ' ' + x.layer.name) + ' · ' + esc(x.node.name) + '</a>';
        }).join(' ') + '</div>';
        return out;
      })() : '') +
      '<h3 class="sec"><span class="no">' + g.pages.length + '</span><span class="t">' + esc(g.name) + ' 全部页面</span><span class="en">' + esc(g.en) + '</span></h3>' +
      '<div style="display:flex;flex-wrap:wrap;gap:5px 10px;margin:2px 0 14px">' + sibs + '</div>');
    return;
  }
  var tab = state.tabs.kb;
  var g = DB.kb.groups.filter(function (x) { return x.key === tab; })[0];
  if (!g) { el.innerHTML = ''; return; }
  var cards = g.pages.map(function (p) {
    return '<a class="card" href="#/kb/' + g.key + '/' + p.id + '" style="display:block;text-decoration:none;color:inherit;margin-bottom:8px">' +
      '<h4><span class="no">' + esc(p.id) + '</span>' + esc(p.name) + '</h4><p>' + esc(p.def) + '</p></a>';
  }).join('');
  el.innerHTML = '<div class="callout pine"><div class="c-t">' + esc(g.name) + ' · ' + esc(g.en) + '</div>' + esc(g.desc) + '</div>' +
    '<div class="grid g2" style="margin-top:14px">' + cards + '</div>';
};

/* ============================================================ 公司专页
 * 企业版图（explain-*.js）里的每家公司都有一条可访问的专页：
 * 手工策展的知识库档案优先（#/kb/companies/<id>），没有档案的落到本页，
 * 由版图结构化字段 + 全库证据自动聚合——不新造事实，只把已有数据聚到一处。 */
RENDER.company = function () {
  return viewShell('company',
    '<div class="view-head">' +
      '<h2>公司专页<span class="en">Company Profile</span></h2>' +
      '<div class="vh-meta"><span class="m">' + companyTotal() + ' 家可查</span><span class="m">企业版图自动索引 explain-*.js</span><span class="m">证据按公司名与别名匹配</span></div>' +
      '<p class="lead">企业版图里出现的每家公司都有自己的专页：定位、产品与技术、在五层产业链中的坐标，以及本库线索、大事记与档案的提及。已有策展档案的公司优先落在知识库深度单页。</p>' +
    '</div>');
};

function uniqStr(list) {
  var seen = {}, out = [];
  list.forEach(function (x) { if (x && !seen[x]) { seen[x] = 1; out.push(x); } });
  return out;
}

/* 公司专页总索引：按五层产业链节点聚合，details 折叠避免一屏铺 800 个名字 */
function companyIndexHtml() {
  var idx = companyIndex();
  var byNode = {};
  Object.keys(idx).forEach(function (k) {
    var rec = idx[k];
    if (rec.name !== k) return;   /* 跳过别名键，避免重复 */
    rec.slices.forEach(function (s) {
      var arr = byNode[s.node.id] = byNode[s.node.id] || [];
      if (arr.indexOf(rec.name) < 0) arr.push(rec.name);
    });
  });
  var html = '<div class="callout pine"><div class="c-t">公司专页 · Company Index</div>' +
    '按五层产业链节点聚合的 <b>' + companyTotal() + '</b> 家公司；点公司名进专页，点节点名回拆解页。已有策展档案的公司直接落在知识库深度单页。' +
    '<div class="fchips" style="margin-top:9px"><a class="fchip" href="#/players/table">玩家总表</a><a class="fchip" href="#/kb/companies">知识库公司档案</a><a class="fchip" href="#/chain/map">产业链全景</a></div></div>';
  DB.chain.layers.forEach(function (ly) {
    var groups = ly.nodes.map(function (nd) {
      var names = byNode[nd.id];
      if (!names || !names.length) return '';
      var chips = names.map(function (n) {
        return '<a class="fchip" href="' + companyLinkHref(n) + '">' + esc(n) + '</a>';
      }).join('');
      return '<details style="margin:6px 0;padding:8px 0;border-bottom:1px solid var(--line)">' +
        '<summary style="cursor:pointer"><b>' + esc(nd.name) + '</b>' +
        '<span class="dim mono" style="margin-left:8px;font-size:10.5px">' + names.length + ' 家</span>' +
        ' <span class="dim">· <a href="' + chainNodeHref(ly.key, nd.id) + '">回拆解页</a></span></summary>' +
        '<div style="display:flex;flex-wrap:wrap;gap:5px 10px;margin:9px 0 4px">' + chips + '</div></details>';
    }).filter(Boolean).join('');
    if (groups) {
      html += '<h3 class="sec" style="margin-top:20px"><span class="no">' + esc(ly.key) + '</span><span class="t">' + esc(ly.name) + '</span><span class="en">' + esc(ly.en) + '</span></h3>' + groups;
    }
  });
  html += '<p class="note" style="margin-top:12px">索引来自企业版图（console/explain-*.js）与补充名录（console/companies.js）；同一公司可出现在多个节点，因此各节点家数之和大于公司总数。</p>';
  return html;
}

PANE.company = function () {
  var el = $('#pane-company');
  if (!el) return;
  var name = currentCompanyName();
  if (!name) { el.innerHTML = h(companyIndexHtml()); return; }
  var info = companyIndex()[name];
  var slices = info.slices;
  var player = DB.players.filter(function (p) { return p.name === name; })[0] || null;
  var kbPage = kbCompanyPage(name);
  var roles = uniqStr(slices.map(function (s) { return s.company.role; }));
  var products = uniqStr(slices.map(function (s) { return s.company.products; }));
  var techs = uniqStr(slices.map(function (s) { return s.company.tech; }));
  var scenes = uniqStr(slices.map(function (s) { return s.company.scenes; }));
  var nodeCount = uniqStr(slices.map(function (s) { return s.node.id; })).length;
  var ev = companyEvidence(name);
  var fact = function (k, v) {
    return v ? '<div class="prov-row"><span class="k">' + k + '</span><p>' + esc(v) + '</p></div>' : '';
  };

  var sliceRows = slices.map(function (s) {
    return '<tr><td><a href="' + chainNodeHref(s.layer.key, s.node.id) + '"><b>' + esc(s.node.name) + '</b></a>' +
      ' <span class="dim mono" style="font-size:10px">' + esc(s.layer.key) + '</span></td>' +
      '<td>' + esc(s.industry.name) + '</td><td>' + esc(s.company.role) + '</td>' +
      '<td>' + esc(s.company.products) + '</td><td>' + esc(s.company.tech) + '</td><td>' + esc(s.company.scenes) + '</td></tr>';
  }).join('');

  var clueRows = ev.clues.slice(0, 10).map(function (c) {
    return '<tr><td><a href="' + clueHref(c.id) + '"><b>' + esc(c.name) + '</b></a></td><td>' + esc(c.topic) + '</td><td class="mono">' + c.nEvents + '</td><td class="mono">' + esc(c.lastEvent || '—') + '</td></tr>';
  }).join('');
  var evRows = ev.events.slice(0, 10).map(function (e) {
    return '<li><b>' + esc(e.date) + '</b> · ' + extLink(e.url, esc(e.title)) + '</li>';
  }).join('');
  var archRows = ev.archive.slice(0, 8).map(function (a) {
    return '<tr><td class="mono dim">' + esc(a.d) + '</td><td>' + extLink(a.u, esc(a.t.slice(0, 52))) + '</td></tr>';
  }).join('');

  el.innerHTML = h(
    '<div class="callout pine"><div class="c-t">公司专页 · Company Profile</div><b>' + esc(name) + '</b>' +
      (player ? ' <span class="tag plain">' + esc(player.type) + '</span>' : '') +
      ' — ' + esc(player ? player.positioning : (roles.join('；') || '企业版图收录')) +
      '<div class="fchips" style="margin-top:9px">' +
        (kbPage ? '<a class="fchip" href="#/kb/companies/' + kbPage.id + '">知识库深度档案</a>' : '') +
        (player ? '<a class="fchip" href="' + playerHref(name) + '">玩家图谱</a>' : '') +
        '<a class="fchip" href="#/company">公司专页索引</a><a class="fchip" href="#/players/table">玩家总表</a><a class="fchip" href="#/kb/companies">公司知识库</a><a class="fchip" href="#/chain/map">产业链全景</a>' +
      '</div></div>' +

    '<div class="kpi-strip">' +
      '<div class="kpi dark"><div class="k">产业链节点</div><div class="v">' + nodeCount + ' <small>个</small></div><div class="w">本公司在企业版图中的出现位置</div></div>' +
      '<div class="kpi"><div class="k">行业切片</div><div class="v">' + slices.length + ' <small>条</small></div><div class="w">按层序聚合，可跨层</div></div>' +
      '<div class="kpi"><div class="k">关联线索</div><div class="v">' + ev.clues.length + ' <small>条</small></div><div class="w">公司名在全文命中</div></div>' +
      '<div class="kpi"><div class="k">关联大事</div><div class="v">' + ev.events.length + ' <small>条</small></div><div class="w">' + esc((ev.events[0] || {}).date || '—') + '</div></div>' +
    '</div>' +

    '<div class="card" style="margin-top:14px"><h4><span class="no">01</span>公司名片<span class="en">Profile</span></h4>' +
      fact('定位 / 角色', roles.join('；')) +
      fact('主要产品', products.join('；')) +
      fact('技术路线', techs.join('；')) +
      fact('商业场景', scenes.join('；')) +
      '<p class="note" style="margin-top:9px">字段来自企业版图的结构化整理层（公开产业常识，非新闻事实）；产品与场景取该公司在各节点的并集。</p>' +
    '</div>' +

    '<h3 class="sec" id="sec-coord" data-sec style="margin-top:22px"><span class="no">02</span><span class="t">产业链坐标</span><span class="en">Chain Coordinates</span></h3>' +
    '<div class="table-scroll"><table class="dense"><thead><tr><th>层 / 节点</th><th>行业切片</th><th>角色</th><th>主要产品</th><th>技术</th><th>商业场景</th></tr></thead><tbody>' + sliceRows + '</tbody></table></div>' +
    '<p class="note" style="margin-top:8px">同一公司可出现在多个节点与行业切片；点击节点名回到拆解页看上下游、玩家与证据。</p>' +

    '<h3 class="sec" style="margin-top:22px"><span class="no">03</span><span class="t">本库证据</span><span class="en">Evidence</span></h3>' +
    '<div class="grid g2">' +
      '<div><h4 class="sec" style="margin-top:0"><span class="t">关联线索</span><span class="en">Clues</span></h4>' +
        '<div class="table-scroll"><table class="dense"><thead><tr><th>线索</th><th>主题</th><th>事件</th><th>最近</th></tr></thead><tbody>' +
        (clueRows || '<tr><td colspan="4" class="dim">暂无命中——采集缺口信号</td></tr>') + '</tbody></table></div></div>' +
      '<div><h4 class="sec" style="margin-top:0"><span class="t">关联大事</span><span class="en">Events</span></h4>' +
        '<ul class="timeline">' + (evRows || '<li class="dim">暂无命中</li>') + '</ul></div>' +
    '</div>' +
    (archRows ? '<h4 class="sec" style="margin-top:18px"><span class="t">档案抽样</span><span class="en">Archive · 共 ' + ev.archive.length + ' 条</span></h4>' +
      '<div class="table-scroll"><table class="dense"><thead><tr><th>日期</th><th>标题</th></tr></thead><tbody>' + archRows + '</tbody></table></div>' : '') +
    '<p class="note" style="margin-top:10px">证据按公司名在语料中的出现量级统计；0 提及 ≠ 不重要，只说明本库尚未覆盖——与<a href="#/overview/unknowns">开放问题</a>同源。</p>'
  );
};

/* 公司名反向匹配产业链节点（知识库 → 产业链交叉链接） */
function chainNodesForName(name) {
  var t = name.replace(/（.*?）/, '').trim().toLowerCase();
  if (t.length < 3) return [];
  var out = [];
  DB.chain.layers.forEach(function (ly) {
    ly.nodes.forEach(function (nd) {
      var blob = (nd.name + ' ' + nd.def + ' ' + nd.keywords.join(' ')).toLowerCase();
      if (blob.indexOf(t) >= 0) out.push({ node: nd, layer: ly });
    });
  });
  return out.slice(0, 6);
}

/* ============================================================ 文档中心 */
RENDER.library = function () {
  return viewShell('library',
    '<div class="view-head">' +
      '<h2>文档中心<span class="en">Document Center</span></h2>' +
      '<div class="vh-meta"><span class="m">' + DB.library.count + ' 篇内嵌</span><span class="m">仓库根 + docs/ 全量</span><span class="m">快照 ' + esc(DB.library.asOf || '') + '</span></div>' +
      '<p class="lead">仓库的项目文档全量内嵌台内直读：产品定位、路线、架构、审计与模板。与线上仓库同步的只读镜像，权威仍以仓库为准。</p>' +
    '</div>');
};

PANE.library = function () {
  var el = $('#pane-library');
  if (!el) return;
  var docPath = currentLibraryDoc();
  var doc = null;
  if (docPath) DB.library.files.forEach(function (f) { if (f.n === docPath) doc = f; });
  if (doc) {
    el.innerHTML = '<div class="callout pine"><div class="c-t">' + esc(doc.n) + '</div><b>' + esc(doc.t) + '</b> <span class="src">' + (doc.s / 1024).toFixed(1) + ' KB · 更新 ' + esc(doc.m) + '</span>' +
      '<div style="margin-top:8px"><a class="fchip" href="#/library/files">← 回文件中心</a></div></div>' +
      '<div class="md-body">' + termify(Md.render(doc.c)) + '</div>';
    return;
  }
  var rows = DB.library.files.map(function (f) {
    return '<tr data-doc="' + esc(f.n) + '" style="cursor:pointer">' +
      '<td class="mono dim">' + esc(f.n) + '</td>' +
      '<td><b>' + esc(f.t) + '</b></td>' +
      '<td class="mono">' + (f.s / 1024).toFixed(1) + ' KB</td>' +
      '<td class="mono">' + esc(f.m) + '</td></tr>';
  }).join('');
  el.innerHTML = '<div class="table-scroll"><table class="dense"><thead><tr><th>路径</th><th>标题</th><th>大小</th><th>更新</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
    '<p class="note" style="margin-top:10px">点击任意行台内阅读；正文中的术语词自动可点。大事记两卷未内嵌（事件层已全量解析，见<a href="#/chronicle/flow">大事记</a>）。</p>';
};

BIND.library = function () {
  $('#v-library').addEventListener('click', function (e) {
    var tr = e.target.closest('tr[data-doc]');
    if (tr) switchTo('library/files/' + encodeURIComponent(tr.getAttribute('data-doc')));
  });
};

/* ============================================================ 机构名录 */
RENDER.directory = function () {
  return viewShell('directory',
    '<div class="view-head">' +
      '<h2>机构名录<span class="en">Directory</span></h2>' +
      '<div class="vh-meta"><span class="m">' + DB.orgs.groups.length + ' 类 · ' + orgsTotal() + ' 家</span><span class="m">手工策展 console/orgs.js</span><span class="m">语料提及自动 join</span></div>' +
      '<p class="lead">不只是被追踪的玩家：公司、高校实验室、研究机构、非营利治理、资本与媒体六类全名录。提及数为语料量级参考，非严格归属。</p>' +
    '</div>');
};

var ORG_STATS = {};
function orgMentions(org) {
  if (ORG_STATS[org.n]) return ORG_STATS[org.n];
  var kws = org.k.map(function (k) { return String(k).toLowerCase(); });
  var hit = function (s) {
    s = String(s).toLowerCase();
    for (var i = 0; i < kws.length; i++) { if (s.indexOf(kws[i]) >= 0) return true; }
    return false;
  };
  var st = {
    clues: DB.clues.filter(function (c) { return hit(c.name + ' ' + c.quote + ' ' + c.body); }).length,
    events: DB.events.filter(function (e) { return hit(e.title + ' ' + e.summary); }).length,
    archive: DB.archive.filter(function (a) { return hit(a.t); }).length
  };
  ORG_STATS[org.n] = st;
  return st;
}

PANE.directory = function () {
  var el = $('#pane-directory');
  if (!el) return;
  var tab = state.tabs.directory;
  var g = DB.orgs.groups.filter(function (x) { return x.key === tab; })[0] || DB.orgs.groups[0];
  if (!g) { el.innerHTML = ''; return; }
  var rows = g.items.map(function (o) {
    var st = orgMentions(o);
    var co = g.key === 'companies' ? companyNameForLabel(o.n) : '';
    var nameCell = co ? '<a href="' + companyLinkHref(co) + '"><b>' + esc(o.n) + '</b></a>' : '<b>' + esc(o.n) + '</b>';
    return '<tr>' +
      '<td>' + nameCell + '</td>' +
      '<td class="dim">' + esc(o.d) + '</td>' +
      '<td class="mono"><b>' + st.clues + '</b></td>' +
      '<td class="mono">' + st.events + '</td>' +
      '<td class="mono">' + st.archive + '</td></tr>';
  }).join('');
  el.innerHTML = '<div class="callout pine"><div class="c-t">' + esc(g.name) + ' · ' + esc(g.en) + '</div>' + esc(g.desc || '') + '</div>' +
    '<div class="table-scroll"><table class="dense"><thead><tr><th>名称</th><th>定位</th><th>线索提及</th><th>大事提及</th><th>档案提及</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
    '<p class="note" style="margin-top:10px">提及数按关键词在语料中的出现量级统计；0 提及 ≠ 不重要，只说明本库尚未覆盖——与<a href="#/overview/unknowns">开放问题</a>同源。公司类条目可点入<a href="#/company">公司专页</a>（有策展档案的直接进知识库单页）。</p>';
};

/* ============================================================ 研判 */
RENDER.research = function () {
  return viewShell('research',
    '<div class="view-head">' +
      '<h2>研判<span class="en">Research</span></h2>' +
      '<div class="vh-meta"><span class="m">本机私有</span><span class="m">研判/ 目录 · gitignore</span><span class="m">仅 data.local.js 载入</span></div>' +
      '<p class="lead">你的观点与行动项放在仓库根 <b>研判/</b> 目录（本机 md，不进公共库），重新运行 make console 后在此呈现。</p>' +
    '</div>');
};

PANE.research = function () {
  var el = $('#pane-research');
  if (!el) return;
  if (state.tabs.research === 'guide') {
    el.innerHTML = '<div class="md-body">' + Md.render(
      '## 目录结构\n\n- `研判/*.md` — 自由观点文档，全部渲染进「文档」页\n- `研判/theses/*.md` — 议题账本，frontmatter：`议题 / 状态 / 置信度 / 结算日 / 更新`\n- `研判/actions.md` — 行动项清单，格式 `- [ ] 事项 → [[主题/线索]] @YYYY-MM-DD`\n\n## 构建流程\n\n1. 写或改 `研判/` 下的文件\n2. 运行 `make console`（或 `python3 tools/scripts/build_console.py`）\n3. `console/data.local.js` 重新生成（gitignore，永不出本机）\n4. 刷新本台即见\n\n## 隐私边界\n\n`研判/` 与 `console/data.local.js` 均在 .gitignore；CDN 发布只复制公开 7 文件，研判层物理不上传。', { base: '研判/' }) + '</div>';
    return;
  }
  if (!DB.research || !DB.research.docs || !DB.research.docs.length) {
    el.innerHTML = '<div class="callout"><div class="c-t">研判层未构建</div>本台未发现 <b class="mono">console/data.local.js</b>。新建 <b class="mono">研判/观点.md</b>，运行 <b class="mono">make console</b>，观点即内嵌进本视图——全程不出本机。</div>';
    return;
  }
  el.innerHTML = DB.research.docs.map(function (d) {
    return '<h3 class="sec"><span class="no">' + esc(d.m) + '</span><span class="t">' + esc(d.t) + '</span><span class="en">' + esc(d.n) + '</span></h3>' +
      '<div class="md-body">' + Md.render(d.c, { base: '研判/' + d.n }) + '</div>';
  }).join('');
};

/* ============================================================ 议题追踪 */
RENDER.theses = function () {
  return viewShell('theses',
    '<div class="view-head">' +
      '<h2>议题追踪<span class="en">Theses</span></h2>' +
      '<div class="vh-meta"><span class="m">本机私有</span><span class="m">研判/theses/ · gitignore</span><span class="m">每个长期判断一份文档</span></div>' +
      '<p class="lead">把「我认为……」写成可结算的账本：论点、支持与反方证据、<b>证伪条件</b>、置信度与结算日。到期结算，用命中率校准判断力。</p>' +
    '</div>');
};

PANE.theses = function () {
  var el = $('#pane-theses');
  if (!el) return;
  var head = '<div class="callout"><div class="c-t">研判层未构建</div>本台未发现 <b class="mono">console/data.local.js</b>。新建 <b class="mono">研判/theses/</b> 目录并参照 <b class="mono">研判/theses/议题模板.md</b> 写议题，运行 <b class="mono">make console</b> 后在此呈现。</div>';
  if (!DB.research) { el.innerHTML = head; return; }
  var list = DB.research.theses || [];
  var tab = state.tabs.theses;
  if (tab === 'stats') {
    if (!list.length) { el.innerHTML = '<div class="callout">尚无议题。</div>'; return; }
    var byStatus = {};
    var confSum = 0, confN = 0;
    list.forEach(function (t) {
      byStatus[t.status] = (byStatus[t.status] || 0) + 1;
      var cv = parseFloat(t.confidence);
      if (!isNaN(cv)) { confSum += cv; confN++; }
    });
    var rows = Object.keys(byStatus).map(function (s) {
      return '<tr><td><span class="tag">' + esc(s) + '</span></td><td class="mono"><b>' + byStatus[s] + '</b></td></tr>';
    }).join('');
    el.innerHTML = '<div class="kpi-strip">' +
      '<div class="kpi dark"><div class="k">议题总数</div><div class="v">' + list.length + ' <small>条</small></div><div class="w">每个长期判断一份文档</div></div>' +
      '<div class="kpi"><div class="k">平均置信度</div><div class="v">' + (confN ? Math.round(confSum / confN) : '—') + ' <small>%</small></div><div class="w">' + confN + ' 条已标注</div></div>' +
      '<div class="kpi"><div class="k">状态分布</div><div class="v" style="font-size:14px;line-height:1.6">' + Object.keys(byStatus).map(function (s) { return esc(s) + ' ' + byStatus[s]; }).join(' · ') + '</div><div class="w">观察中/强化/动摇/已证实/已证伪</div></div>' +
      '<div class="kpi"><div class="k">命中率</div><div class="v">—</div><div class="w">结算日后自动可算（已证实 + 已证伪 占比）</div></div>' +
      '</div>' +
      '<h3 class="sec" style="margin-top:18px"><span class="no">REF</span><span class="t">状态明细</span><span class="en">Status</span></h3>' +
      '<div class="table-scroll"><table class="dense"><thead><tr><th>状态</th><th>条数</th></tr></thead><tbody>' + rows + '</tbody></table></div>';
    return;
  }
  if (tab === 'settle') {
    if (!list.length) { el.innerHTML = '<div class="callout"><div class="c-t">尚无议题</div>参照 <b class="mono">研判/theses/议题模板.md</b> 新建议题文件，重新构建即可。</div>'; return; }
    var sorted = list.slice().sort(function (a, b) { return (a.due || '9999') < (b.due || '9999') ? -1 : 1; });
    var rows = sorted.map(function (t) {
      var overdue = t.due && t.due < TODAY && ['已证实', '已证伪'].indexOf(t.status) < 0;
      return '<tr' + (overdue ? ' class="hl"' : '') + '><td class="mono"><b>' + esc(t.due || '—') + '</b>' + (overdue ? ' <span class="tag red">到期未结算</span>' : '') + '</td>' +
        '<td><b>' + esc(t.title) + '</b></td>' +
        '<td><span class="tag">' + esc(t.status) + '</span></td>' +
        '<td class="mono">' + (t.confidence !== '' && t.confidence !== null ? esc(t.confidence) + '%' : '—') + '</td>' +
        '<td class="mono dim">' + esc(t.updated) + '</td></tr>';
    }).join('');
    el.innerHTML = '<h3 class="sec"><span class="no">' + list.length + '</span><span class="t">结算台</span><span class="en">Settlement</span></h3>' +
      '<div class="table-scroll"><table class="dense"><thead><tr><th>结算日</th><th>议题</th><th>状态</th><th>置信度</th><th>更新</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
      '<p class="note" style="margin-top:10px">到期未结算的议题高亮——账本的意义在于真的去结算。</p>';
    return;
  }
  if (!list.length) { el.innerHTML = '<div class="callout"><div class="c-t">尚无议题</div>参照 <b class="mono">研判/theses/议题模板.md</b> 新建议题文件（frontmatter：议题 / 状态 / 置信度 / 结算日 / 更新），重新构建即可。</div>'; return; }
  var cards = list.map(function (t) {
    return '<div class="callout">' +
      '<div class="c-t">' + esc(t.status) + (t.confidence !== '' && t.confidence !== null ? ' · 置信度 ' + esc(t.confidence) + '%' : '') + (t.due ? ' · 结算日 ' + esc(t.due) : '') + (t.updated ? ' · 更新 ' + esc(t.updated) : '') + '</div>' +
      '<b>' + esc(t.title) + '</b>' +
      '<div class="md-body" style="margin-top:8px">' + Md.render(t.body) + '</div>' +
      '<p class="src">' + esc(t._src) + '</p></div>';
  }).join('');
  el.innerHTML = cards;
};

/* ============================================================ 周报 */
RENDER.digest = function () {
  var d = DB.digest;
  return viewShell('digest',
    '<div class="view-head">' +
      '<h2>周报<span class="en">Weekly Digest</span></h2>' +
      '<div class="vh-meta"><span class="m">区间 ' + esc(d.range[0]) + ' 至 ' + esc(d.range[1]) + '</span><span class="m">以最新数据日为锚</span><span class="m">构建时自动生成</span></div>' +
      '<p class="lead">过去 7 天的增量自动汇编：' + d.events.length + ' 条大事、' + d.clues.length + ' 条线索更新、' + d.items + ' 条档案（' + d.days + ' 天）。本段即周更对外材料的底稿。</p>' +
    '</div>');
};

PANE.digest = function () {
  var el = $('#pane-digest');
  if (!el) return;
  var d = DB.digest;
  if (state.tabs.digest === 'daily') {
    var days = [];
    DB.archive.forEach(function (a) { if (a.d >= d.range[0] && a.d <= d.range[1] && days.indexOf(a.d) < 0) days.push(a.d); });
    days.sort().reverse();
    var rows = days.map(function (day) {
      var items = DB.archive.filter(function (a) { return a.d === day; });
      return '<tr><td class="mono"><b>' + esc(day) + '</b></td><td class="mono"><b>' + items.length + '</b></td><td>' + extLink(items[0].u, esc(items[0].t.slice(0, 52))) + '</td></tr>';
    }).join('');
    el.innerHTML = '<h3 class="sec"><span class="no">' + days.length + '</span><span class="t">每日明细</span><span class="en">Daily Breakdown</span></h3>' +
      '<div class="table-scroll"><table class="dense"><thead><tr><th>日期</th><th>条数</th><th>当日头条</th></tr></thead><tbody>' + (rows || '<tr><td colspan="3" class="dim">区间内无档案</td></tr>') + '</tbody></table></div>';
    return;
  }
  var evs = d.events.map(function (line) {
    var sp = line.indexOf(' ');
    return '<li><div class="ph">' + esc(line.slice(0, sp).slice(0, 7)) + '<span class="when">' + esc(line.slice(0, sp)) + '</span></div><div class="tt">' + esc(line.slice(sp + 1)) + '</div></li>';
  }).join('');
  var clueRows = d.clues.map(function (c) {
    return '<tr><td><a href="' + clueHref(c.id) + '"><b>' + esc(c.name) + '</b></a></td><td>' + esc(c.id.split('/')[0]) + '</td><td class="mono">' + esc(c.updated) + '</td><td class="mono">' + c.n + '</td></tr>';
  }).join('');
  var rangeEvs = DB.events.filter(function (e) {
    return d.range[0].slice(0, 7) <= e.date.slice(0, 7) && e.date.slice(0, 7) <= d.range[1].slice(0, 7) && (e.date.length === 7 || (d.range[0] <= e.date && e.date <= d.range[1]));
  });
  var catCount = {};
  rangeEvs.forEach(function (e) { (e.cats || []).forEach(function (c) { catCount[c] = (catCount[c] || 0) + 1; }); });
  var catChips = Object.keys(catCount).sort(function (a, b) { return catCount[b] - catCount[a]; }).map(function (c) {
    return '<span class="tag">' + esc(c) + ' ' + catCount[c] + '</span>';
  }).join(' ');
  el.innerHTML = '<div class="grid g2">' +
    '<div><h3 class="sec"><span class="no">01</span><span class="t">本周大事</span><span class="en">Events</span></h3>' +
      '<ul class="timeline">' + (evs || '<li><div class="tt dim">区间内无大事登记</div></li>') + '</ul></div>' +
    '<div><h3 class="sec"><span class="no">02</span><span class="t">线索更新</span><span class="en">Clue Updates</span></h3>' +
      '<div class="table-scroll"><table class="dense"><thead><tr><th>线索</th><th>主题</th><th>更新</th><th>事件数</th></tr></thead><tbody>' +
      (clueRows || '<tr><td colspan="4" class="dim">区间内无线索更新</td></tr>') + '</tbody></table></div>' +
      '<h3 class="sec" style="margin-top:22px"><span class="no">03</span><span class="t">档案动态</span><span class="en">Archive</span></h3>' +
      '<p class="note">区间内精选档案 ' + d.items + ' 条，覆盖 ' + d.days + ' 天，详见<a href="#/daily">日报</a>与<a href="#/archive">语料检索</a>。</p>' +
      '<h3 class="sec" style="margin-top:22px"><span class="no">04</span><span class="t">本周类型分布</span><span class="en">By Category</span></h3>' +
      '<p>' + (catChips || '<span class="dim">区间内无事件</span>') + '</p><p class="note">一条事件可属多类，计数按类型分别累计。</p></div>' +
    '</div>';
};

/* ============================================================ 行动项 */
RENDER.actions = function () {
  return viewShell('actions',
    '<div class="view-head">' +
      '<h2>行动项<span class="en">Actions</span></h2>' +
      '<div class="vh-meta"><span class="m">本机私有</span><span class="m">研判/actions.md · gitignore</span><span class="m">勾选即完成</span></div>' +
      '<p class="lead">研究产生的待办集中管理：`- [ ] 事项 → [[线索]] @截止日`，完成后把空格改成 x。</p>' +
    '</div>');
};

PANE.actions = function () {
  var el = $('#pane-actions');
  if (!el) return;
  if (!DB.research) {
    el.innerHTML = '<div class="callout"><div class="c-t">研判层未构建</div>新建 <b class="mono">研判/actions.md</b> 并按格式登记行动项，运行 <b class="mono">make console</b> 后在此呈现。</div>';
    return;
  }
  var list = DB.research.actions || [];
  var li = function (a) {
    return '<li style="' + (a.done ? 'opacity:.55' : '') + '">' + (a.done ? '☑' : '☐') + ' ' + linkify(a.text) + (a.due ? ' <span class="tag gold">截止 ' + esc(a.due) + '</span>' : '') + '</li>';
  };
  var tab = state.tabs.actions;
  var rows = list.filter(function (a) { return tab === 'done' ? a.done : !a.done; });
  el.innerHTML = rows.length
    ? '<ul class="plain">' + rows.map(li).join('') + '</ul>'
    : '<div class="callout">' + (tab === 'done' ? '还没有已完成项——动起来。' : '进行中为空，在 <b class="mono">研判/actions.md</b> 登记。') + '</div>';
};

/* ------------------------------------------------------------ 全局搜索 */
function bindSearch() {
  var input = $('#gSearch'), pop = $('#srPop');
  var lastResults = [];
  var act = -1;
  function run() {
    var q = input.value.trim().toLowerCase();
    if (q.length < 1) { pop.classList.remove('on'); return; }
    var res = [];
    DB.clues.forEach(function (c) {
      /* 全文命中：名称/别名/主题优先，正文与观点段给命中片段 */
      var hayN = (c.name + ' ' + c.topic + ' ' + c.alias.join(' ')).toLowerCase();
      var hayB = (c.quote + ' ' + c.body).toLowerCase();
      var inN = hayN.indexOf(q) >= 0;
      var idx = hayB.indexOf(q);
      if (!inN && idx < 0) return;
      var snip = '';
      if (idx >= 0) {
        var s0 = Math.max(0, idx - 16);
        snip = (c.quote + ' ' + c.body).slice(s0, idx + q.length + 34).replace(/\s+/g, ' ');
      }
      res.push({ k: '线索', t: c.name, d: inN ? (c.topic + ' · ' + c.nEvents + ' 条事件 · ' + c.updated) : ('…' + snip + '…'), go: function () { location.hash = clueHref(c.id); } });
    });
    DB.events.forEach(function (e) {
      var hay = e.title + ' ' + e.summary;
      var idx = hay.toLowerCase().indexOf(q);
      if (idx >= 0) {
        var snip = '';
        if (e.title.toLowerCase().indexOf(q) < 0) {
          var s0 = Math.max(0, idx - 14);
          snip = hay.slice(s0, idx + q.length + 26).replace(/\s+/g, ' ');
        }
        res.push({ k: '事件', t: e.title.slice(0, 30), d: e.date + ' · ' + (snip || e.summary.slice(0, 34)), go: function () { switchTo('chronicle/flow'); state.chYear = 'all'; state.chCat = 'all'; if (currentRoute() === 'chronicle') enterView('chronicle'); } });
      }
    });
    DB.players.forEach(function (p) {
      if ((p.name + ' ' + (p.aliases || []).join(' ')).toLowerCase().indexOf(q) >= 0) {
        res.push({ k: '玩家', t: p.name, d: (p.type || '待归类') + ' · ' + (p.note || ''), go: function () { switchTo('players/detail'); state.plSel = p.name; } });
      }
    });
    DB.verify.forEach(function (v) {
      if ((v.title + ' ' + v.lines.map(function (l) { return l.v; }).join(' ')).toLowerCase().indexOf(q) >= 0) {
        res.push({ k: '待核实 ' + (v.status || ''), t: v.title.slice(0, 30), d: v.sec.split('（')[0], go: function () { switchTo('verify/queue'); } });
      }
    });
    DB.topics.forEach(function (t) {
      if ((t.key + ' ' + t.en).toLowerCase().indexOf(q) >= 0) {
        res.push({ k: '主题', t: t.key, d: t.count + ' 条线索 · ' + t.def.slice(0, 30), go: function () { switchTo('topics/' + encodeURIComponent(t.key)); } });
      }
    });
    if (q.length >= 2) {
      var aHits = 0;
      for (var ai = 0; ai < DB.archive.length && aHits < 6; ai++) {
        var a = DB.archive[ai];
        if ((a.t + ' ' + a.s).toLowerCase().indexOf(q) >= 0) {
          aHits++;
          res.push({ k: '档案', t: a.t.slice(0, 30), d: a.d + ' · ' + a.s.slice(0, 24), go: function () { switchTo('archive/search'); state.aQuery = input.value.trim(); if (currentRoute() === 'archive') enterView('archive'); } });
        }
      }
    }
    DB.models.forEach(function (m) {
      if ((m.name + ' ' + m.org + ' ' + m.note).toLowerCase().indexOf(q) >= 0) {
        res.push({ k: '模型', t: m.name, d: m.org + ' · ' + (m.date || '待回填'), go: function () { switchTo('models/table'); } });
      }
    });
    DB.chain.layers.forEach(function (ly) {
      ly.nodes.forEach(function (nd) {
        if ((nd.name + ' ' + nd.def).toLowerCase().indexOf(q) >= 0) {
          res.push({ k: '产业链', t: nd.name, d: ly.name + ' · ' + nd.def.slice(0, 24), go: function () { switchTo('chain/' + ly.key + '/' + nd.id); } });
        }
      });
    });
    if (DB.research) {
      (DB.research.theses || []).forEach(function (t) {
        if ((t.title + ' ' + t.body).toLowerCase().indexOf(q) >= 0) {
          res.push({ k: '议题', t: t.title.slice(0, 30), d: t.status + ' · 置信度 ' + t.confidence + '%', go: function () { switchTo('theses/ledger'); } });
        }
      });
      (DB.research.actions || []).forEach(function (a) {
        if (a.text.toLowerCase().indexOf(q) >= 0) {
          res.push({ k: '行动项', t: a.text.slice(0, 30), d: a.done ? '已完成' : '进行中' + (a.due ? ' · 截止 ' + a.due : ''), go: function () { switchTo('actions/open'); } });
        }
      });
    }
    DB.glossary.items.forEach(function (g) {
      if ((g.t + ' ' + g.b).toLowerCase().indexOf(q) >= 0) {
        res.push({ k: '术语', t: g.t, d: (DB.glossary.cats[g.c] || g.c) + ' · ' + g.b.slice(0, 30), go: function () { switchTo('glossary/dict'); setTimeout(function () { openTerm(g.k); }, 350); } });
      }
    });
    DB.kb.groups.forEach(function (g) {
      g.pages.forEach(function (p) {
        if ((p.name + ' ' + p.def).toLowerCase().indexOf(q) >= 0) {
          res.push({ k: '知识库', t: p.name, d: g.name + ' · ' + p.def.slice(0, 26), go: function () { switchTo('kb/' + g.key + '/' + p.id); } });
        }
      });
    });
    /* 公司专页：企业版图里的 800+ 家公司，补齐「版图提到但搜索不到」的缺口 */
    var coHits = 0, coSeen = {};
    Object.keys(companyIndex()).forEach(function (n) {
      if (coHits >= 12) return;
      if (n.toLowerCase().indexOf(q) < 0) return;
      var info = companyIndex()[n];
      if (coSeen[info.name]) return;
      coSeen[info.name] = 1;
      var first = info.slices[0];
      coHits++;
      res.push({ k: '公司', t: info.name, d: first.layer.key + ' · ' + first.node.name + ' · ' + (first.company.role || '') + (n === info.name ? '' : ' · 别名「' + n + '」'), go: function () { switchTo('company/' + encodeURIComponent(info.name)); } });
    });
    DB.unknowns.groups.forEach(function (g) {
      g.items.forEach(function (it) {
        if ((it.q + ' ' + it.how).toLowerCase().indexOf(q) >= 0) {
          res.push({ k: '未知', t: it.q.slice(0, 30), d: g.name, go: function () { switchTo('overview/unknowns'); } });
        }
      });
    });
    DB.orgs.groups.forEach(function (g) {
      g.items.forEach(function (o) {
        if ((o.n + ' ' + o.d).toLowerCase().indexOf(q) >= 0) {
          res.push({ k: '名录', t: o.n, d: g.name + ' · ' + o.d.slice(0, 24), go: function () { switchTo('directory/' + g.key); } });
        }
      });
    });
    DB.library.files.forEach(function (f) {
      if ((f.n + ' ' + f.t).toLowerCase().indexOf(q) >= 0) {
        res.push({ k: '文档', t: f.t.slice(0, 28), d: f.n, go: function () { switchTo('library/files/' + encodeURIComponent(f.n)); } });
      }
    });
    var seenGuide = {};
    DB.guide.paths.forEach(function (p) {
      p.steps.forEach(function (s) {
        if (seenGuide[s.href]) return;
        if ((p.name + ' ' + s.page + ' ' + s.what + ' ' + s.ask).toLowerCase().indexOf(q) >= 0) {
          seenGuide[s.href] = 1;
          res.push({ k: '课程 ' + p.name.slice(0, 2), t: s.page, d: p.name + ' · 读后能答：' + s.ask.slice(0, 22), go: function () { location.hash = s.href; } });
        }
      });
    });
    DB.decisions.a.concat(DB.decisions.b, DB.decisions.c).forEach(function (d) {
      if (((d.q || '') + ' ' + (d.what || '')).toLowerCase().indexOf(q) >= 0) {
        res.push({ k: '决策 ' + d.id, t: (d.q || d.what || '').slice(0, 28), d: d.status || '', go: function () { switchTo('decisions/board'); } });
      }
    });
    DB.calendar.items.forEach(function (i) {
      if (i.name.toLowerCase().indexOf(q) >= 0) {
        res.push({ k: '日历', t: i.name, d: i.d + ' · ' + i.type, go: function () { switchTo('calendar/year'); } });
      }
    });
    res = res.slice(0, 14);
    lastResults = res;
    act = -1;
    pop.innerHTML = res.length ? res.map(function (r, i) {
      return '<button class="item" data-i="' + i + '"><span class="k">' + esc(r.k) + '</span><span class="t">' + esc(r.t) + '</span><span class="note">' + esc(r.d) + '</span></button>';
    }).join('') : '<div class="empty">无匹配，试试 GPT，宇树，并购，监管</div>';
    pop.classList.add('on');
  }
  input.addEventListener('input', run);
  input.addEventListener('focus', run);
  input.addEventListener('keydown', function (e) {
    var items = $$('.item', pop);
    if (!items.length || !pop.classList.contains('on')) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      act = e.key === 'ArrowDown' ? (act + 1) % items.length : (act - 1 + items.length) % items.length;
      items.forEach(function (b, i) { b.classList.toggle('act', i === act); });
      items[act].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter' && act >= 0) {
      e.preventDefault();
      var r = lastResults[act];
      pop.classList.remove('on');
      if (r && r.go) r.go();
    }
  });
  pop.addEventListener('click', function (e) {
    var b = e.target.closest('.item'); if (!b) return;
    var r = lastResults[parseInt(b.getAttribute('data-i'), 10)];
    pop.classList.remove('on');
    if (r && r.go) r.go();
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.tb-search')) pop.classList.remove('on');
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') pop.classList.remove('on');
    if (e.key === '/' && document.activeElement !== input && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) {
      e.preventDefault(); input.focus();
    }
  });
}

/* 左侧目录：当前路由的规范锚点（详情页回落到其父页面） */
function navCanonical(v) {
  if (v === 'clues' && currentClueId()) return '#/clues/list';
  if (v === 'topics' && currentTopicKey()) return '#/topics/table';
  /* 三级树逐项可点选：节点、玩家、赛道各自高亮，其父支路由 on-branch 标记 */
  if (v === 'chain') { var cn = currentChainNode(); if (cn) return chainNodeHref(cn.layer.key, cn.node.id); }
  if (v === 'players') { var pn = currentPlayerName(); if (pn) return playerHref(pn); }
  if (v === 'company') return '#/company';
  if (v === 'sectors') { var sid = currentSectorId(); if (sid) return sectorHref(sid); }
  if (v === 'kb') { var kp = currentKbPage(); if (kp) return '#/kb/' + kp.group.key; }
  if (v === 'library' && currentLibraryDoc()) return '#/library/files';
  var tabs = TABS[v] || [];
  var tk = state.tabs[v] || (tabs[0] ? tabs[0].k : '');
  return tk ? '#/' + v + '/' + tk : '#/' + v;
}

/* ============================================================ 操盘台（Ops Workbench）
 * 私有台账 console/ops.local.js（gitignore）。本区只读渲染台账，交互仅限：
 * 滑杆/筛选/选中（内存态）、计算器（内存态）、复制输出（clipboard）。
 * 所有「采纳/裁定/勾选」= 改 ops.local.js 后刷新，git 即审计日志。 */

(function opsLocalNorm() {
  var EMPTY = { asOf: '', opps: [], exps: [], reds: [], risks: { deps: [], laws: [] }, eco: { platforms: [], kols: [], partners: [] }, mig: [], sys: { signals: [], costs: [], drills: [], pulse: [], veto: [], review: [] }, cash: null };
  if (!DB.opsLocal || typeof DB.opsLocal !== 'object') { DB.opsLocal = JSON.parse(JSON.stringify(EMPTY)); return; }
  var L = DB.opsLocal;
  ['opps', 'exps', 'reds', 'mig'].forEach(function (k) { if (!Array.isArray(L[k])) L[k] = []; });
  if (!L.risks || typeof L.risks !== 'object') L.risks = {};
  if (!Array.isArray(L.risks.deps)) L.risks.deps = [];
  if (!Array.isArray(L.risks.laws)) L.risks.laws = [];
  if (!L.eco || typeof L.eco !== 'object') L.eco = {};
  if (!Array.isArray(L.eco.platforms)) L.eco.platforms = [];
  if (!Array.isArray(L.eco.kols)) L.eco.kols = [];
  if (!Array.isArray(L.eco.partners)) L.eco.partners = [];
  if (!L.sys || typeof L.sys !== 'object') L.sys = {};
  ['signals', 'costs', 'drills', 'pulse', 'veto', 'review'].forEach(function (k) { if (!Array.isArray(L.sys[k])) L.sys[k] = []; });
})();

/* 复制基建：navigator.clipboard 优先；file:// 或权限被拒时降级 execCommand */
var COPY_REG = {};
function regCopy(key, text) { COPY_REG[key] = String(text); return '<button type="button" class="copybtn" data-copy="' + key + '">复制</button>'; }
function legacyCopy(text) {
  var ta = document.createElement('textarea');
  ta.value = text;
  ta.setAttribute('readonly', '');
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  var done = false;
  try { done = document.execCommand('copy'); } catch (e) { done = false; }
  document.body.removeChild(ta);
  return done;
}
function doCopy(text, btn) {
  function ok() {
    if (!btn) return;
    var t = btn.textContent;
    btn.textContent = '已复制 ✓';
    btn.classList.add('ok');
    setTimeout(function () { btn.textContent = t; btn.classList.remove('ok'); }, 1400);
  }
  function fail() { if (btn) btn.textContent = '复制失败，请手动选择'; }
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(ok, function () { if (legacyCopy(text)) ok(); else fail(); });
  } else if (legacyCopy(text)) ok();
  else fail();
}

/* 浏览器当日。刻意区别于快照 TODAY：ops 台账不随 make console 重建，
 * 用快照日算「近 7 天 / 衰减」会失真，故操盘台的时间计算用真实今天。 */
function opsToday() {
  var d = new Date();
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
}
function opsDaysAgo(d) {
  if (!d) return Infinity;
  var diff = new Date(opsToday()).getTime() - new Date(d).getTime();
  return isFinite(diff) ? Math.floor(diff / 86400000) : Infinity;
}

/* 行动强制锁（软）：近 7 天无「外部交互」记录时，在研究类视图顶部提醒。
 * 是提醒不是真锁——静态台无法强制；未登记过 pulse 的新用户不被打扰。 */
function opsLockHtml() {
  var pulse = DB.opsLocal.sys.pulse;
  if (!pulse.length) return '';
  var has = pulse.some(function (p) { return p.kind === 'external' && opsDaysAgo(p.d) <= 7; });
  if (has) return '';
  return '<div class="ops-lock"><b>行动强制锁（软）</b>近 7 天没有「外部交互」记录——研究在替行动打工。先去 <a href="#/actions/open">行动项</a> 或 <a href="#/exp/ledger">实验登记簿</a> 完成一件对外动作，再回来研究。登记口径见 <a href="#/meta/tempo">节奏健康</a>。</div>';
}

function opsKpi(k, v, w) {
  return '<div class="kpi"><div class="k">' + esc(k) + '</div><div class="v">' + v + '</div><div class="w">' + esc(w) + '</div></div>';
}
function opsDimsHtml(dims) {
  return '<span class="dims">' + Object.keys(DB.ops.opp.dims).map(function (k) {
    var v = (dims || {})[k] || 0;
    return '<i class="s' + v + '" title="' + esc(DB.ops.opp.dims[k].label) + ' ' + v + '">' + v + '</i>';
  }).join('') + '</span>';
}
function opsEmpty(title, hint) {
  var sk = '';
  if (DB.ops.sys.localSkeleton) {
    sk = '<p style="margin-top:10px">' + regCopy('opsSkeleton', DB.ops.sys.localSkeleton) + ' <span class="dim">复制骨架 → 存为 <b class="mono">console/ops.local.js</b> → 刷新本页。隐私边界同 data.local.js：永不出本机。</span></p>';
  }
  return '<div class="callout"><div class="c-t">' + esc(title) + '</div><p style="margin:0">' + hint + '</p>' + sk + '</div>';
}
function oppById(id) { return DB.opsLocal.opps.filter(function (o) { return o.id === id; })[0]; }
function brokenOpps() {
  var today = opsToday();
  return DB.opsLocal.opps.filter(function (o) {
    if (o.status === 'dropped') return false;
    if (!o.action) return true;
    return Boolean(o.actionDue) && o.actionDue < today;
  });
}
function oppFlagTags(o) {
  return (o.flags || []).map(function (k) {
    var f = DB.ops.opp.flags.filter(function (x) { return x.k === k; })[0];
    return '<span class="tag red"' + (f ? ' title="' + esc(f.desc) + '"' : '') + '>' + esc(f ? f.l : k) + '</span>';
  }).join(' ');
}
function chainLayer(k) { return DB.chain.layers.filter(function (l) { return l.key === k; })[0] || { nodes: [] }; }

/* ------------------------------------------------------------ 机会台 */
RENDER.opp = function () {
  var L = DB.opsLocal;
  return viewShell('opp',
    '<div class="view-head">' +
      '<h2>机会台<span class="en">Opportunity Board</span></h2>' +
      '<div class="vh-meta"><span class="m">' + L.opps.length + ' 张机会卡</span><span class="m">Action Backlog：研究必须关联 48h 行动</span><span class="m">私有台账 ops.local.js</span>' + (L.asOf ? '<span class="m">台账更新 ' + esc(L.asOf) + '</span>' : '') + '</div>' +
      '<p class="lead">技术壁垒 × 痛点强度 × 变现周期 × 竞争烈度，加权即建议投入度；红旗标记自动过滤「大厂必做」与「伪需求」。没有关联行动的机会卡按断链降级——80 分的研究 + 48 小时内执行，胜过 99 分的研究 + 延迟执行。</p>' +
    '</div>');
};

function oppWeights() {
  if (!state.oppW) state.oppW = Object.assign({}, DB.ops.opp.weightsDefault);
  return state.oppW;
}

PANE.opp = function () {
  var el = $('#pane-opp');
  if (!el) return;
  var L = DB.opsLocal;
  var tab = state.tabs.opp;
  var lock = opsLockHtml();
  if (tab === 'mvp') { el.innerHTML = lock + oppMvpHtml(); return; }
  if (tab === 'broken') { el.innerHTML = lock + oppBrokenHtml(); return; }
  if (!L.opps.length) {
    el.innerHTML = lock + opsEmpty('机会卡台账为空', '在 <b class="mono">console/ops.local.js</b> 的 <b class="mono">opps</b> 数组登记机会卡：四维各 1-5 分 + 一条 48 小时内可执行的行动（<b class="mono">action</b> / <b class="mono">actionDue</b>）。没有行动关联的机会不配进这张板。');
    return;
  }
  var w = oppWeights();
  var today = opsToday();
  var broken = brokenOpps();
  var list = L.opps.filter(function (o) {
    if (state.oppFilter === 'active') return o.status === 'active';
    if (state.oppFilter === 'broken') return broken.indexOf(o) >= 0;
    if (state.oppFilter === 'flag') return (o.flags || []).length > 0;
    return true;
  });
  var ranked = Engine.computeAll(list, w);
  var rows = ranked.map(function (r, i) {
    var o = oppById(r.id);
    var isBroken = broken.indexOf(o) >= 0;
    var flags = oppFlagTags(o);
    var act;
    if (!o.action) act = '<span class="tag red">断链：无 48h 行动</span>';
    else act = esc(o.action) + (o.actionDue ? ' <span class="mono dim">@' + esc(o.actionDue) + '</span>' : '') + (o.actionDue && o.actionDue < today ? ' <span class="tag red">已过期</span>' : '');
    var links = [];
    if (o.links && o.links.clue) links.push('<a class="wl" href="' + clueHref(o.links.clue) + '">' + esc(o.links.clue.split('/').pop()) + '</a>');
    if (o.links && o.links.thesis) links.push('<span class="dim">议题：</span>' + esc(o.links.thesis));
    return '<tr' + (o.status === 'parked' ? ' style="opacity:.55"' : '') + (isBroken ? ' class="hl"' : '') + '>' +
      '<td class="mono"><span class="rk ' + (i < 3 ? 't' + (i + 1) : '') + '">' + (i + 1) + '</span></td>' +
      '<td><b>' + esc(o.name) + '</b>' + (o.one ? '<div class="dim" style="font-size:11.5px">' + esc(o.one) + '</div>' : '') + '</td>' +
      '<td class="mono"><b>' + r.total.toFixed(2) + '</b></td>' +
      '<td>' + opsDimsHtml(o.dims) + '</td>' +
      '<td>' + (flags || '<span class="dim">—</span>') + '</td>' +
      '<td>' + act + '</td>' +
      '<td>' + (links.length ? links.join('<br>') : '<span class="dim">—</span>') + '</td>' +
      '<td><button type="button" class="copybtn" data-oppmvp="' + esc(o.id) + '">启动包</button></td></tr>';
  }).join('');
  var sliders = Object.keys(DB.ops.opp.dims).map(function (k) {
    return '<span style="white-space:nowrap">' + esc(DB.ops.opp.dims[k].label) +
      ' <input type="range" min="0" max="50" step="5" value="' + (w[k] || 0) + '" data-ow="' + k + '" style="width:80px;vertical-align:middle"> ' +
      '<b class="mono" id="owv-' + k + '">' + (w[k] || 0) + '</b></span>';
  }).join('<span class="dim"> · </span>');
  var presetSeg = DB.ops.opp.presets.map(function (p) {
    return '<button data-op="' + p.k + '"' + (state.oppPreset === p.k ? ' class="on"' : '') + '>' + esc(p.l) + '</button>';
  }).join('');
  var filterSeg = [['all', '全部'], ['active', '进行中'], ['broken', '断链'], ['flag', '有红旗']].map(function (x) {
    return '<button data-of="' + x[0] + '"' + (state.oppFilter === x[0] ? ' class="on"' : '') + '>' + x[1] + '</button>';
  }).join('');
  el.innerHTML = lock +
    '<div class="tools"><span class="seg" id="oppPresetSeg">' + presetSeg + '</span><span class="seg" id="oppFilterSeg">' + filterSeg + '</span><span class="count">' + broken.length + ' 张断链</span></div>' +
    '<div class="card" style="margin-top:10px;padding:10px 14px;font-size:12px">' + sliders + '</div>' +
    '<div class="table-scroll" style="margin-top:10px"><table class="dense"><thead><tr><th>序</th><th>机会</th><th>总分</th><th>四维（壁垒/痛点/变现/竞争）</th><th>红旗</th><th>48h 行动</th><th>关联</th><th></th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
    '<p class="note" style="margin-top:10px">拖滑杆或换预设，排名实时重排；红旗与断链是降级信号不是删除。' + cite('opp', 1) + '</p>' +
    provBlock('opp');
};

function oppMvpHtml() {
  var L = DB.opsLocal;
  if (!L.opps.length) return opsEmpty('没有机会卡', '先在「评分板」建立机会卡，再生成启动包。');
  if (!state.oppMvp || !oppById(state.oppMvp)) state.oppMvp = L.opps[0].id;
  var o = oppById(state.oppMvp);
  var sel = '<div class="tools"><span class="dim">机会卡</span><select class="finput" id="oppMvpSel" style="max-width:280px">' +
    L.opps.map(function (x) { return '<option value="' + esc(x.id) + '"' + (x.id === state.oppMvp ? ' selected' : '') + '>' + esc(x.name) + '</option>'; }).join('') +
    '</select></div>';
  var full = [];
  var blocks = DB.ops.opp.mvpBlocks.map(function (b) {
    var m = (o.mvp || {})[b.k];
    var val = m && String(m).trim();
    full.push('## ' + b.l + '\n' + (val ? val : '（待填）提示：' + b.hint));
    return '<div class="callout' + (val ? '' : ' red') + '" style="margin-top:10px"><div class="c-t">' + esc(b.l) + (val ? '' : ' · 待填') + '</div><p style="margin:0">' +
      (val ? esc(val).replace(/\n/g, '<br>') : '<span class="dim">' + esc(b.hint) + '</span>') + '</p></div>';
  }).join('');
  var all = 'MVP 启动包：' + o.name + (o.one ? '\n（' + o.one + '）' : '') + '\n\n' + full.join('\n\n');
  return sel + '<p style="margin:8px 0 2px">' + regCopy('mvp-' + o.id, all) + ' <span class="dim">复制完整启动包（六段文本，可直接作为 Cursor/v0 的需求输入）</span></p>' + blocks;
}

function oppBrokenHtml() {
  var L = DB.opsLocal;
  if (!L.opps.length && !L.exps.length) return opsEmpty('没有可检查的台账', '机会卡与实验都为空。Action Backlog 规则：任何研究产出必须关联一个 48 小时内可执行的 Next Step，无法转化的研究标记低优先或归档。');
  var today = opsToday();
  var noAct = L.opps.filter(function (o) { return o.status !== 'dropped' && !o.action; });
  var expired = L.opps.filter(function (o) { return o.status !== 'dropped' && o.action && o.actionDue && o.actionDue < today; });
  var orphanExp = L.exps.filter(function (e) { return e.status !== 'done' && (!e.linkedOpp || !oppById(e.linkedOpp)); });
  var oppLi = function (o, why) {
    return '<li><b>' + esc(o.name) + '</b> <span class="tag red">' + why + '</span>' + (o.one ? ' <span class="dim">' + esc(o.one) + '</span>' : '') + '</li>';
  };
  return '<div class="kpi-strip">' +
    opsKpi('断链机会', noAct.length, '无 48h 行动') +
    opsKpi('行动过期', expired.length, '截止日已过') +
    opsKpi('孤儿实验', orphanExp.length, '进行中但未关联机会卡') +
    opsKpi('规则', '<span style="font-size:18px">48h</span>', '可执行才算数') + '</div>' +
    '<h3 class="sec" style="margin-top:18px"><span class="no">01</span><span class="t">无行动的机会</span><span class="en">No Next Step</span></h3>' +
    (noAct.length ? '<ul class="plain">' + noAct.map(function (o) { return oppLi(o, '断链'); }).join('') + '</ul>' : '<p class="dim">无——每张机会卡都挂着行动。</p>') +
    '<h3 class="sec" style="margin-top:20px"><span class="no">02</span><span class="t">行动已过期</span><span class="en">Overdue</span></h3>' +
    (expired.length ? '<ul class="plain">' + expired.map(function (o) { return oppLi(o, '过期'); }).join('') + '</ul>' : '<p class="dim">无过期行动。</p>') +
    '<h3 class="sec" style="margin-top:20px"><span class="no">03</span><span class="t">孤儿实验</span><span class="en">Orphan Experiments</span></h3>' +
    (orphanExp.length ? '<ul class="plain">' + orphanExp.map(function (e) {
      return '<li><span class="tag">' + esc(EXP_TYPE[e.type] || e.type) + '</span> <b>' + esc(e.hyp) + '</b> <span class="tag red">未关联机会卡</span></li>';
    }).join('') + '</ul>' : '<p class="dim">无孤儿实验。</p>') +
    '<p class="note" style="margin-top:12px">口径：只查显式字段（<b class="mono">opps[].action / actionDue / exps[].linkedOpp</b>），不做标题模糊匹配。修法：补一行 ops.local.js，刷新即消。</p>';
}

BIND.opp = function () {
  var box = $('#v-opp');
  box.addEventListener('click', function (e) {
    var p = e.target.closest('#oppPresetSeg button');
    if (p) {
      state.oppPreset = p.getAttribute('data-op');
      var pr = DB.ops.opp.presets.filter(function (x) { return x.k === state.oppPreset; })[0];
      if (pr) state.oppW = Object.assign({}, pr.w);
      PANE.opp();
      return;
    }
    var f = e.target.closest('#oppFilterSeg button');
    if (f) { state.oppFilter = f.getAttribute('data-of'); PANE.opp(); return; }
    var m = e.target.closest('[data-oppmvp]');
    if (m) {
      state.oppMvp = m.getAttribute('data-oppmvp');
      if (state.tabs.opp === 'mvp') PANE.opp();
      else switchTo('opp/mvp');
    }
  });
  box.addEventListener('input', function (e) {
    var k = e.target.getAttribute && e.target.getAttribute('data-ow');
    if (k) {
      oppWeights()[k] = Number(e.target.value);
      state.oppPreset = 'custom';
      var wv = $('#owv-' + k);
      if (wv) wv.textContent = e.target.value;
      PANE.opp();
    }
  });
  box.addEventListener('change', function (e) {
    if (e.target.id === 'oppMvpSel') { state.oppMvp = e.target.value; PANE.opp(); }
  });
};

/* ------------------------------------------------------------ 实验台 */
var EXP_TYPE = { 'fake-door': '假门', 'woz': 'Wizard of Oz', 'ab': 'A/B', 'cold-email': '冷邮件批次' };
var EXP_VERDICT = {
  'validated': { l: '已验证', cls: 'tag gold' },
  'falsified': { l: '已证伪', cls: 'tag red' },
  'inconclusive': { l: '不确定', cls: 'tag plain' }
};

RENDER.exp = function () {
  var L = DB.opsLocal;
  return viewShell('exp',
    '<div class="view-head">' +
      '<h2>实验台<span class="en">Experiment Ledger</span></h2>' +
      '<div class="vh-meta"><span class="m">' + L.exps.length + ' 项实验</span><span class="m">假设 → 可证伪判据 → 成本 → 结果</span><span class="m">手册见知识库「操盘手册」</span></div>' +
      '<p class="lead">把研究结论当假设，把真实世界当裁判。重心从「生成完美的研究报告」移到「低成本、高并发的商业实验」：假门、Wizard of Oz、A/B、冷邮件批次，每一项都必须有可证伪的判据和截止日。</p>' +
    '</div>');
};

PANE.exp = function () {
  var el = $('#pane-exp');
  if (!el) return;
  var L = DB.opsLocal;
  var lock = opsLockHtml();
  if (!L.exps.length) {
    el.innerHTML = lock + opsEmpty('实验登记簿为空', '在 ops.local.js 的 <b class="mono">exps</b> 数组登记实验：假设（hyp）→ 可证伪的成功判据（metric）→ 成本（cost）→ 截止（due）→ 结果（result / verdict）。类型手册见 <a href="#/kb/ops/exp-fakedoor">操盘手册 · 实验设计</a>。');
    return;
  }
  var today = opsToday();
  var running = L.exps.filter(function (e) { return e.status !== 'done'; });
  var done = L.exps.filter(function (e) { return e.status === 'done'; });
  var overdue = running.filter(function (e) { return e.due && e.due < today; }).length;
  var row = function (e) {
    var isOverdue = e.status !== 'done' && e.due && e.due < today;
    var vd = EXP_VERDICT[e.verdict];
    var opp = e.linkedOpp && oppById(e.linkedOpp);
    return '<tr' + (isOverdue ? ' class="hl"' : '') + '>' +
      '<td><span class="tag">' + esc(EXP_TYPE[e.type] || e.type) + '</span></td>' +
      '<td><b>' + esc(e.hyp) + '</b>' + (e.metric ? '<div class="dim" style="font-size:11.5px">判据：' + esc(e.metric) + '</div>' : '') + '</td>' +
      '<td class="mono">' + esc(e.cost || '—') + '</td>' +
      '<td class="mono">' + esc(e.due || '—') + (isOverdue ? ' <span class="tag red">过期</span>' : '') + '</td>' +
      '<td>' + (vd ? '<span class="' + vd.cls + '">' + vd.l + '</span>' : '<span class="dim">待结果</span>') + (e.result ? '<div class="dim" style="font-size:11.5px">' + esc(e.result) + '</div>' : '') + '</td>' +
      '<td>' + (opp ? '<a href="#/opp/mvp" data-oppmvp="' + esc(opp.id) + '"><b>' + esc(opp.name) + '</b></a>' : '<span class="dim">—</span>') + '</td></tr>';
  };
  el.innerHTML = lock +
    '<div class="kpi-strip">' +
      opsKpi('进行中', running.length, '含过期 ' + overdue) +
      opsKpi('已验证', done.filter(function (e) { return e.verdict === 'validated'; }).length, '假设成立') +
      opsKpi('已证伪', done.filter(function (e) { return e.verdict === 'falsified'; }).length, '证伪同样是产出') +
      opsKpi('完成率', done.length + '<small> / ' + L.exps.length + '</small>', 'done / 全部') + '</div>' +
    '<h3 class="sec" style="margin-top:16px"><span class="no">01</span><span class="t">进行中</span><span class="en">Running</span></h3>' +
    (running.length ? '<div class="table-scroll"><table class="dense"><thead><tr><th>类型</th><th>假设与判据</th><th>成本</th><th>截止</th><th>结果</th><th>关联机会</th></tr></thead><tbody>' + running.map(row).join('') + '</tbody></table></div>' : '<p class="dim">没有进行中的实验。</p>') +
    '<h3 class="sec" style="margin-top:20px"><span class="no">02</span><span class="t">已结束</span><span class="en">Concluded</span></h3>' +
    (done.length ? '<div class="table-scroll"><table class="dense"><thead><tr><th>类型</th><th>假设与判据</th><th>成本</th><th>截止</th><th>结果</th><th>关联机会</th></tr></thead><tbody>' + done.map(row).join('') + '</tbody></table></div>' : '<p class="dim">还没有结束的实验。</p>') +
    '<p class="note" style="margin-top:12px">实验结果回写到「<a href="#/meta/signals">信号回流</a>」调整数据源置信度——这就是反馈闭环的物理实现。</p>';
};

BIND.exp = function () {
  $('#v-exp').addEventListener('click', function (e) {
    var m = e.target.closest('[data-oppmvp]');
    if (m) { state.oppMvp = m.getAttribute('data-oppmvp'); switchTo('opp/mvp'); }
  });
};

/* ------------------------------------------------------------ 红蓝对抗 */
function redTargets() {
  var out = DB.opsLocal.opps.map(function (o) { return { v: 'opp:' + o.id, l: '机会卡：' + o.name }; });
  ((DB.research && DB.research.theses) || []).forEach(function (t) {
    out.push({ v: 'thesis:' + t.id, l: '议题：' + t.title });
  });
  return out;
}
function redTargetInfo() {
  var v = state.redTarget || '';
  if (v.indexOf('opp:') === 0) {
    var o = oppById(v.slice(4));
    if (o) return { name: o.name, ctx: (o.one || '') + (o.note ? '。背景：' + o.note : '') };
  }
  if (v.indexOf('thesis:') === 0) {
    var t = ((DB.research && DB.research.theses) || []).filter(function (x) { return x.id === v.slice(7); })[0];
    if (t) return { name: t.title, ctx: '议题状态：' + t.status + (t.confidence != null && t.confidence !== '' ? '，置信度 ' + t.confidence : '') + '。摘要：' + String(t.body || '').replace(/ai-news-wikilink:\/\/[^\s；。，）)]+/g, '').replace(/[#*`>\[\]]/g, '').replace(/\s+/g, ' ').slice(0, 240) };
  }
  return null;
}

RENDER.red = function () {
  return viewShell('red',
    '<div class="view-head">' +
      '<h2>红蓝对抗<span class="en">Red / Blue Team</span></h2>' +
      '<div class="vh-meta"><span class="m">' + DB.ops.red.roles.length + ' 位固定角色</span><span class="m">清单 + 复制 Prompt 到任意 LLM</span><span class="m">无 API 依赖 · 零密钥风险</span></div>' +
      '<p class="lead">AI 背景的人最容易死于技术自嗨和回音室。结论成型之后、投入资源之前，让五位立场极端的角色轮流拷问：保守 CFO 算算术、Growth 找杠杆、律师查死法、黑客找暴露面、做空分析师全力论证你会失败。</p>' +
    '</div>');
};

PANE.red = function () {
  var el = $('#pane-red');
  if (!el) return;
  var tab = state.tabs.red;
  var lock = (tab === 'board' || tab === 'short') ? opsLockHtml() : '';
  if (tab === 'bias') {
    var biasCards = DB.ops.red.bias.map(function (b) {
      return '<div class="card"><h4>' + esc(b.name) + '</h4><ul class="plain" style="margin:6px 0 0">' +
        b.asks.map(function (a) { return '<li>' + esc(a) + '</li>'; }).join('') + '</ul></div>';
    }).join('');
    var biasText = DB.ops.red.bias.map(function (b) {
      return '## ' + b.name + '\n' + b.asks.map(function (a) { return '- ' + a; }).join('\n');
    }).join('\n\n');
    el.innerHTML = '<div class="callout"><div class="c-t">认知刹车片</div>触发条件：你发现自己在说「这个方向大有可为」或「因为 X 成功了所以 Y 也会」。三张清单过不完，就不许扣扳机。</div>' +
      '<p style="margin:12px 0 0">' + regCopy('biasAll', biasText) + ' <span class="dim">复制三张清单（可贴给 LLM 交叉审计你的结论）</span></p>' +
      '<div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(280px,1fr));margin-top:12px">' + biasCards + '</div>';
    return;
  }
  var targets = redTargets();
  if (!state.redTarget || !targets.some(function (t) { return t.v === state.redTarget; })) state.redTarget = targets.length ? targets[0].v : '';
  var tgt = redTargetInfo();
  var sel = targets.length
    ? '<div class="tools"><span class="dim">对象</span><select class="finput" id="redTargetSel" style="max-width:320px">' +
        targets.map(function (t) { return '<option value="' + esc(t.v) + '"' + (t.v === state.redTarget ? ' selected' : '') + '>' + esc(t.l) + '</option>'; }).join('') +
      '</select></div>'
    : '<div class="callout" style="margin-top:12px"><div class="c-t">还没有对抗对象</div>登记机会卡（ops.local.js 的 opps）或议题（研判/theses）后，这里会出现对象选择器。角色清单不受影响，照常可用。</div>';
  if (tab === 'short') {
    var L = DB.opsLocal;
    var list = L.reds.filter(function (r) {
      if (!state.redTarget) return false;
      return r.target === state.redTarget || 'opp:' + r.target === state.redTarget || 'thesis:' + r.target === state.redTarget || (tgt && r.target === tgt.name);
    });
    var head = sel + '<h3 class="sec" style="margin-top:14px"><span class="no">01</span><span class="t">做空记录</span><span class="en">Short Thesis</span></h3>';
    if (!list.length) {
      var tpl = (DB.ops.red.shortTpl || '').replace(/{{TARGET}}/g, tgt ? tgt.name : '（对象）');
      el.innerHTML = head + opsEmpty('该对象还没有做空记录', '把做空分析师（影子董事会）的回答整理成报告存入 ops.local.js 的 <b class="mono">reds</b> 数组。没有反面证据的机会不值得投入。') +
        '<p style="margin-top:10px">' + regCopy('shortTpl', tpl) + ' <span class="dim">复制做空报告框架（已代入当前对象）</span></p>';
      return;
    }
    var cards = list.map(function (r) {
      var evid = (r.evid || []).map(function (v) {
        return '<li><span class="tag' + (v.side === 'bear' ? ' red' : ' gold') + '">' + (v.side === 'bear' ? '反方' : '正方') + '</span> ' + esc(v.t) + (v.src ? ' <span class="dim mono" style="font-size:10.5px">' + esc(v.src) + '</span>' : '') + '</li>';
      }).join('');
      var fails = (r.fails || []).map(function (f) { return '<li>' + esc(f) + '</li>'; }).join('');
      return '<div class="callout" style="margin-top:10px"><div class="c-t">' + esc(r.target) + (r.updated ? ' · 更新 ' + esc(r.updated) : '') + '</div>' +
        (evid ? '<b>证据</b><ul class="plain">' + evid + '</ul>' : '') +
        (fails ? '<b>历史失败案例</b><ul class="plain">' + fails + '</ul>' : '') +
        (r.whyNotBigco ? '<p style="margin:6px 0 0"><b>在位者为何沉默：</b>' + esc(r.whyNotBigco) + '</p>' : '') +
        (r.verdict ? '<p style="margin:6px 0 0"><b>结论：</b>' + esc(r.verdict) + '</p>' : '') + '</div>';
    }).join('');
    el.innerHTML = lock + head + cards + provBlock('red');
    return;
  }
  var roleCards = DB.ops.red.roles.map(function (r) {
    var prompt = String(r.promptTpl || '').replace(/{{TARGET}}/g, tgt ? tgt.name : '（未选对象）').replace(/{{CONTEXT}}/g, tgt && tgt.ctx ? tgt.ctx : '（补充背景：一句话现状 + 已有证据）');
    regCopy('redp-' + r.key, prompt);
    return '<div class="card rolecard"><h4>' + esc(r.name) + ' <span class="dim mono" style="font-weight:400;font-size:10px">' + esc(r.en) + '</span></h4>' +
      '<p class="dim" style="margin:4px 0 8px">' + esc(r.mission) + '</p>' +
      '<ul class="plain" style="margin:0 0 10px">' + r.checks.map(function (c) {
        return '<li>' + esc(c.q) + '<div class="dim" style="font-size:11.5px">' + esc(c.why) + '</div></li>';
      }).join('') + '</ul>' +
      regCopy('red-' + r.key, prompt) + '</div>';
  }).join('');
  el.innerHTML = lock + '<div class="callout pine"><div class="c-t">怎么用</div>选对象 → 每位角色「复制」完整 Prompt → 粘贴到任意 LLM → 把回答要点存进做空报告或议题证据。质询清单本身也可以人工过——Prompt 只是加速器。</div>' +
    sel +
    '<div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(290px,1fr));margin-top:14px">' + roleCards + '</div>' +
    provBlock('red');
};

BIND.red = function () {
  $('#v-red').addEventListener('change', function (e) {
    if (e.target.id === 'redTargetSel') { state.redTarget = e.target.value; PANE.red(); }
  });
};

/* ------------------------------------------------------------ 护栏台 */
RENDER.risk = function () {
  var L = DB.opsLocal;
  return viewShell('risk',
    '<div class="view-head">' +
      '<h2>护栏台<span class="en">Risk Guardrails</span></h2>' +
      '<div class="vh-meta"><span class="m">' + DB.ops.risk.laws.length + ' 部法规 · ' + DB.ops.risk.licenses.length + ' 类许可</span><span class="m">' + L.risks.deps.length + ' 项依赖</span><span class="m">OPC 没有法务，护栏就是法务</span></div>' +
      '<p class="lead">一次侵权、一次封号、一次现金流断裂就可能致命。政策雷达看监管档位，许可雷区查传染性，平台依赖盯 ToS 与迁移预案，压力测试用悲观假设反推跑道，混沌演习把「万一」提前演一遍。</p>' +
    '</div>');
};

function cashInputs() {
  if (!state.cashIn) {
    state.cashIn = {};
    DB.ops.risk.cashCfg.fields.forEach(function (f) {
      var base = DB.opsLocal.cash ? DB.opsLocal.cash[f.k] : null;
      state.cashIn[f.k] = (base != null && !isNaN(Number(base))) ? Number(base) : f.def;
    });
  }
  return state.cashIn;
}
function cashOutHtml() {
  var c = cashInputs();
  var scs = DB.ops.risk.cashCfg.scenarios;
  var net = (c.burn || 0) - (c.mrr || 0);
  var runway = net > 0 ? (c.cash || 0) / net : Infinity;
  var fmtM = function (v) { return v === Infinity ? '∞（收入覆盖支出）' : Math.floor(v) + ' 个月'; };
  var cols = Object.keys(scs).map(function (sk) {
    var s = scs[sk];
    var conv = (c.conv || 0) / 100 * (s.conv || 1);
    var cac = (c.cac || 0) * (s.cac || 1);
    var customers = c.arpu > 0 ? Math.ceil((c.burn || 0) / c.arpu) : 0;
    var visitors = conv > 0 ? Math.ceil(customers / conv) : Infinity;
    var cacSpend = Math.round(customers * cac);
    return '<div class="kpi dark"><div class="k">' + esc(s.l) + ' · 盈亏平衡客户</div><div class="v">' + customers + '<small> 户</small></div>' +
      '<div class="w">月访客 ' + (visitors === Infinity ? '—' : visitors.toLocaleString()) + ' · 达平衡前 CAC 投入 ≈ $' + cacSpend.toLocaleString() + '</div></div>';
  }).join('');
  var warn = runway < 6;
  return '<div class="kpi-strip">' +
    '<div class="kpi dark"><div class="k">现金跑道</div><div class="v"' + (warn ? ' style="color:var(--red)"' : '') + '>' + fmtM(runway) + '</div><div class="w">现金 ÷（月支出 − 月收入）' + (warn ? '——低于 6 个月警戒线' : '') + '</div></div>' +
    cols + '</div>' +
    '<p class="note" style="margin-top:10px">玩具模型，量级参考：悲观=转化率腰斩 × CAC 翻倍，乐观=转化率 +50% × CAC 七折。公式全部前台可复算。' + cite('risk', 5) + '</p>';
}

PANE.risk = function () {
  var el = $('#pane-risk');
  if (!el) return;
  var L = DB.opsLocal;
  var tab = state.tabs.risk;
  if (tab === 'license') {
    var infectCls = { '无': '', '文件级': 'gold', '库级': 'gold', '弱': 'gold', '强': 'red', '强+网络': 'red', '服务级': 'red', '附加使用限制': 'red' };
    var lrows = DB.ops.risk.licenses.map(function (l) {
      return '<tr><td><b>' + esc(l.name) + '</b></td><td>' + esc(l.family) + '</td>' +
        '<td><span class="tag ' + (infectCls[l.infect] !== undefined ? infectCls[l.infect] : '') + '">' + esc(l.infect) + '</span></td>' +
        '<td>' + esc(l.saas) + '</td><td>' + esc(l.sell) + '</td>' +
        '<td class="dim">' + esc(l.note) + '</td></tr>';
    }).join('');
    var chkText = DB.ops.risk.licenseChecks.map(function (c) { return '- ' + c; }).join('\n');
    el.innerHTML = '<div class="callout red"><div class="c-t">一句话规则</div>对外产品依赖树里出现 <b>AGPL / SSPL / BSL / Elastic</b> 之前，必须先读完许可原文——「先抄后想」是 OPC 最贵的死法。</div>' +
      '<div class="table-scroll" style="margin-top:12px"><table class="dense"><thead><tr><th>许可</th><th>家族</th><th>传染性</th><th>SaaS 义务</th><th>商用</th><th>备注</th></tr></thead><tbody>' + lrows + '</tbody></table></div>' +
      '<h3 class="sec" style="margin-top:18px"><span class="no">02</span><span class="t">选型检查清单</span><span class="en">Checklist</span></h3>' +
      '<ul class="plain">' + DB.ops.risk.licenseChecks.map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('') + '</ul>' +
      '<p style="margin-top:10px">' + regCopy('licenseChecks', chkText) + ' <span class="dim">复制清单</span></p>' +
      provBlock('risk');
    return;
  }
  if (tab === 'deps') {
    var deps = L.risks.deps;
    if (!deps.length) {
      el.innerHTML = opsEmpty('依赖台账为空', '在 ops.local.js 的 <b class="mono">risks.deps</b> 登记：你赖以生存的上游（模型 API / 平台 / 云 / 数据源），每项写 ToS 风险、替代方案（alt）、迁移预案（exit）、依赖度评分（1-5）。评分 ≥ ' + (DB.ops.risk.depThreshold || 4) + ' 会触发告警。');
      return;
    }
    var th = DB.ops.risk.depThreshold || 4;
    var over = deps.filter(function (d) { return (d.score || 0) >= th; });
    var drows = deps.slice().sort(function (a, b) { return (b.score || 0) - (a.score || 0); }).map(function (d) {
      var prices = (d.priceLog || []).map(function (p) { return '<div class="mono dim" style="font-size:10.5px">' + esc(p.d) + ' ' + esc(p.note) + '</div>'; }).join('');
      return '<tr><td><b>' + esc(d.name) + '</b> <span class="dim" style="font-size:10.5px">' + esc(d.kind || '') + '</span></td>' +
        '<td class="dim">' + esc(d.tos || '—') + prices + '</td>' +
        '<td>' + esc(d.alt || '—') + '</td><td>' + esc(d.exit || '—') + '</td>' +
        '<td class="mono"><b>' + (d.score || 0) + '</b> ' + bar(d.score || 0, 5, (d.score || 0) >= th ? 'var(--red)' : 'var(--navy)') + '</td></tr>';
    }).join('');
    el.innerHTML = (over.length ? '<div class="callout red"><div class="c-t">依赖度告警</div>' + over.map(function (d) { return '<b>' + esc(d.name) + '</b>（' + d.score + ' 分）'; }).join('、') + ' 达到或超过阈值 ' + th + '——迁移预案（exit）必须在被它卡脖子之前演练过。</div>' : '') +
      '<div class="kpi-strip" style="margin-top:12px">' +
        opsKpi('依赖项', deps.length, '上游全部在册') +
        opsKpi('高依赖', over.length, '评分 ≥ ' + th) +
        opsKpi('有迁移预案', deps.filter(function (d) { return d.exit; }).length, 'exit 字段非空') +
        opsKpi('价格波动记录', deps.reduce(function (s, d) { return s + (d.priceLog || []).length; }, 0), 'priceLog 条目') + '</div>' +
      '<div class="table-scroll" style="margin-top:12px"><table class="dense"><thead><tr><th>依赖</th><th>ToS 风险与价格记录</th><th>替代方案</th><th>迁移预案</th><th>依赖度</th></tr></thead><tbody>' + drows + '</tbody></table></div>' +
      '<p class="note" style="margin-top:10px">平台 ToS 变更、定价波动、封号风险是套壳产品的三把刀——台账每季复查，波动记入 priceLog。</p>';
    return;
  }
  if (tab === 'cash') {
    var fields = DB.ops.risk.cashCfg.fields.map(function (f) {
      return '<div class="prov-row" style="margin-top:8px"><span class="k">' + esc(f.l) + '</span><p>' +
        '<input type="number" min="0" step="any" value="' + cashInputs()[f.k] + '" data-cash="' + f.k + '" class="finput" style="width:130px"> <span class="dim" style="color:var(--deck-ink-2)">改数字即时重算</span></p></div>';
    }).join('');
    el.innerHTML = '<div class="sim">' +
      '<div class="sim-head"><span class="t">现金流压力测试</span><span class="en">Runway Stress Test</span><span class="count" style="margin-left:auto;color:var(--deck-ink-2)">仅本机内存状态</span></div>' +
      '<div class="sim-body">' + fields + '</div>' +
      '<div style="padding:14px 18px;border-top:1px solid var(--deck-line)" id="cashOut">' + cashOutHtml() + '</div></div>' +
      '<p style="margin-top:10px">' + regCopy('cashSnap', 'DB.opsLocal.cash = ' + JSON.stringify(cashInputs()) + ';') + ' <span class="dim">复制当前参数快照 → 粘贴进 ops.local.js 的 cash 字段，下次打开即为初始值</span></p>' +
      '<div class="callout" style="margin-top:12px"><div class="c-t">怎么读</div>先看悲观列：如果「盈亏平衡客户数 × 获客成本」已经超过现金跑道能支撑的投入，这个机会的变现场景就是幻觉。研究出的市场规模，最后都要落到这张表上。</div>';
    return;
  }
  if (tab === 'chaos') {
    var drills = L.sys.drills;
    var cards = DB.ops.risk.chaos.map(function (c) {
      var txt = '混沌演习：' + c.name + '\n\n前兆信号：' + c.signs + '\n\nPlan B：' + c.planB + '\n\nPlan C：' + c.planC + '\n\nPlan D：' + c.planD + '\n\n演习方法：' + c.drill;
      regCopy('chaos-' + c.key, txt);
      return '<div class="card" style="margin-bottom:12px"><h4>' + esc(c.name) + ' <span class="tag ' + (c.sev === 'high' ? 'red' : 'gold') + '">' + (c.sev === 'high' ? '高烈度' : '中烈度') + '</span></h4>' +
        '<p class="dim" style="margin:4px 0 8px"><b>前兆信号：</b>' + esc(c.signs) + '</p>' +
        '<ul class="plain" style="margin:0 0 8px">' +
          '<li><b>Plan B</b>：' + esc(c.planB) + '</li>' +
          '<li><b>Plan C</b>：' + esc(c.planC) + '</li>' +
          '<li><b>Plan D</b>：' + esc(c.planD) + '</li></ul>' +
        '<p class="dim" style="margin:0 0 8px"><b>演习：</b>' + esc(c.drill) + '</p>' + regCopy('chaosCard-' + c.key, txt) + '</div>';
    }).join('');
    el.innerHTML = '<div class="callout red"><div class="c-t">商业混沌工程</div>每季度至少演练一张卡：不是读一遍，而是真的去切换备选、真的去算 CAC×3。灾难发生时你没有时间第一次写预案。</div>' +
      '<div style="margin-top:12px">' + cards + '</div>' +
      '<h3 class="sec" style="margin-top:8px"><span class="no">02</span><span class="t">演习记录</span><span class="en">Drill Log</span></h3>' +
      (drills.length ? '<div class="table-scroll"><table class="dense"><thead><tr><th>日期</th><th>场景</th><th>结果</th><th>暴露的缺口</th></tr></thead><tbody>' +
        drills.map(function (d) {
          var sc = DB.ops.risk.chaos.filter(function (c) { return c.key === d.scenario; })[0];
          return '<tr><td class="mono">' + esc(d.d) + '</td><td>' + esc(sc ? sc.name : d.scenario) + '</td><td>' + esc(d.result || '—') + '</td><td class="dim">' + esc(d.gaps || '—') + '</td></tr>';
        }).join('') + '</tbody></table></div>' : '<p class="dim">还没有演习记录。做完一次，把结果与缺口记入 ops.local.js 的 sys.drills。</p>');
    return;
  }
  /* 政策雷达（默认页签 laws） */
  var regions = [['all', '全部'], ['CN', '中国'], ['EU', '欧盟'], ['US', '美国']];
  var regSeg = regions.map(function (r) {
    return '<button data-rr="' + r[0] + '"' + ((state.riskRegion || 'all') === r[0] ? ' class="on"' : '') + '>' + r[1] + '</button>';
  }).join('');
  var cur = state.riskRegion || 'all';
  var laws = DB.ops.risk.laws.filter(function (l) {
    if (cur === 'all') return true;
    return l.region === cur || String(l.region).indexOf(cur) === 0;
  });
  var myLaws = {};
  L.risks.laws.forEach(function (m) { myLaws[m.law] = m; });
  var lrows = laws.map(function (l) {
    var mine = myLaws[l.id];
    return '<tr><td><b>' + esc(l.name) + '</b><div class="dim mono" style="font-size:10.5px">' + esc(l.region) + '</div></td>' +
      '<td>' + esc(l.status) + '</td><td class="dim">' + esc(l.scope) + '</td>' +
      '<td>' + esc(l.hit) + '</td><td>' + esc(l.act) + '</td>' +
      '<td>' + (mine
        ? '<span class="tag gold">已评估</span><div class="dim" style="font-size:11.5px">' + esc(mine.impact || '') + (mine.act ? '<br>行动：' + esc(mine.act) : '') + (mine.reviewed ? '<br><span class="mono">复查 ' + esc(mine.reviewed) + '</span>' : '') + '</div>'
        : '<span class="tag red">未评估</span>') + '</td></tr>';
  }).join('');
  el.innerHTML = '<div class="tools"><span class="seg" id="riskRegionSeg">' + regSeg + '</span><span class="count">' + laws.length + ' 部 · 未评估 ' + laws.filter(function (l) { return !myLaws[l.id]; }).length + '</span></div>' +
    '<div class="table-scroll" style="margin-top:10px"><table class="dense"><thead><tr><th>法规</th><th>状态</th><th>范围</th><th>何时命中我</th><th>行动指导</th><th>我的评估</th></tr></thead><tbody>' + lrows + '</tbody></table></div>' +
    '<p class="note" style="margin-top:10px">合规往往是 OPC 的护城河：大厂回避的小场景里，把合规做对就是差异化。私有评估写入 ops.local.js 的 <b class="mono">risks.laws</b>。' + cite('risk', 1) + '</p>' +
    provBlock('risk');
};

BIND.risk = function () {
  var box = $('#v-risk');
  box.addEventListener('click', function (e) {
    var r = e.target.closest('[data-rr]');
    if (r) { state.riskRegion = r.getAttribute('data-rr'); PANE.risk(); }
  });
  box.addEventListener('input', function (e) {
    var k = e.target.getAttribute && e.target.getAttribute('data-cash');
    if (k) {
      cashInputs()[k] = Number(e.target.value) || 0;
      var out = $('#cashOut');
      if (out) out.innerHTML = cashOutHtml();
    }
  });
};

/* ------------------------------------------------------------ 生态位 */
RENDER.eco = function () {
  var L = DB.opsLocal;
  return viewShell('eco',
    '<div class="view-head">' +
      '<h2>生态位<span class="en">Ecosystem Mapping</span></h2>' +
      '<div class="vh-meta"><span class="m">' + L.eco.platforms.length + ' 平台 · ' + L.eco.kols.length + ' KOL · ' + L.eco.partners.length + ' 伙伴</span><span class="m">' + L.mig.length + ' 条迁移线索</span><span class="m">OPC 不单打独斗，找杠杆</span></div>' +
      '<p class="lead">从「找客户」升级到「找杠杆伙伴」：寄生共生雷达研究谁已经拥有你的目标客户，KOL 价值表只认精准度不认粉丝数，互补伙伴补你的短板，技术迁移矩阵找「A 行业玩烂、B 行业没见过」的套利点。</p>' +
    '</div>');
};

PANE.eco = function () {
  var el = $('#pane-eco');
  if (!el) return;
  var L = DB.opsLocal;
  var tab = state.tabs.eco;
  var oppLink = function (id) {
    var o = id && oppById(id);
    return o ? '<a href="#/opp/mvp" data-oppmvp="' + esc(o.id) + '">' + esc(o.name) + '</a>' : '<span class="dim">—</span>';
  };
  if (tab === 'kol') {
    if (!L.eco.kols.length) {
      el.innerHTML = opsEmpty('KOL 名录为空', '在 ops.local.js 的 <b class="mono">eco.kols</b> 登记：precision（互动质量 1-5）/ match（受众匹配 1-5）/ proof（转化证据强度 1-5）。<b>刻意没有粉丝数字段</b>——粉丝不多但精准的微型 KOL 才是 OPC 的杠杆。');
      return;
    }
    var kw = DB.ops.eco.kolWeights;
    var ranked = L.eco.kols.map(function (k) {
      return { k: k, score: (k.precision || 0) * (kw.precision || 0) + (k.match || 0) * (kw.match || 0) + (k.proof || 0) * (kw.proof || 0) };
    }).sort(function (a, b) { return b.score - a.score; });
    var max = ranked.length ? ranked[0].score : 1;
    el.innerHTML = '<div class="table-scroll"><table class="dense"><thead><tr><th>序</th><th>KOL / 渠道</th><th>精准</th><th>匹配</th><th>证据</th><th>加权分</th><th>备注</th><th>关联机会</th></tr></thead><tbody>' +
      ranked.map(function (r, i) {
        return '<tr><td class="mono">' + (i + 1) + '</td><td><b>' + esc(r.k.name) + '</b><div class="dim" style="font-size:10.5px">' + esc(r.k.channel || '') + '</div></td>' +
          '<td class="mono">' + (r.k.precision || 0) + '</td><td class="mono">' + (r.k.match || 0) + '</td><td class="mono">' + (r.k.proof || 0) + '</td>' +
          '<td class="mono"><b>' + r.score.toFixed(2) + '</b> ' + bar(r.score, max, 'var(--gold-2)') + '</td>' +
          '<td class="dim">' + esc(r.k.note || '') + '</td><td>' + oppLink(r.k.linkedOpp) + '</td></tr>';
      }).join('') + '</tbody></table></div>' +
      '<p class="note" style="margin-top:10px">口径：加权分 = 精准×' + kw.precision + ' + 匹配×' + kw.match + ' + 证据×' + kw.proof + '。权重改 ops.js 的 eco.kolWeights，前台不设滑杆（此排序不需要频繁调）。' + cite('eco', 1) + '</p>' + provBlock('eco');
    return;
  }
  if (tab === 'partners') {
    if (!L.eco.partners.length) {
      el.innerHTML = opsEmpty('互补伙伴名录为空', '在 ops.local.js 的 <b class="mono">eco.partners</b> 登记：技能互补的其他 OPC（你做 AI 后端，找擅长 B2B 销售或行业 Domain Expert 的），写明互补点与接触状态。');
      return;
    }
    el.innerHTML = '<div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(280px,1fr))">' +
      L.eco.partners.map(function (p) {
        return '<div class="card"><h4>' + esc(p.name) + '</h4>' +
          '<p style="margin:4px 0"><span class="tag gold">' + esc(p.skill || '技能未填') + '</span> <span class="tag">' + esc(p.status || '未联系') + '</span></p>' +
          '<p class="dim" style="margin:6px 0 0">互补点：' + esc(p.complement || '—') + '</p>' +
          (p.contact ? '<p class="mono dim" style="margin:6px 0 0;font-size:10.5px">' + esc(p.contact) + '</p>' : '') + '</div>';
      }).join('') + '</div>';
    return;
  }
  if (tab === 'matrix') {
    var tech = chainLayer('L2').nodes.concat(chainLayer('L3').nodes);
    var cols = chainLayer('L4').nodes;
    var map = {};
    L.mig.forEach(function (m) { map[m.fromNode + '>' + m.toDomain] = m; });
    var stMeta = { candidate: { l: '候选', cls: '' }, validating: { l: '验证中', cls: 'tag gold' }, dropped: { l: '已放弃', cls: 'tag red' }, done: { l: '已验证', cls: 'tag gold' } };
    var head = '<tr><th style="text-align:left">技术 \\ 行业</th>' + cols.map(function (c) {
      return '<th style="font-size:10px"><a href="#/chain/L4/' + encodeURIComponent(c.id) + '">' + esc(c.name) + '</a></th>';
    }).join('') + '</tr>';
    var rows = tech.map(function (t) {
      var ly = chainLayer('L2').nodes.indexOf(t) >= 0 ? 'L2' : 'L3';
      return '<tr><td style="white-space:nowrap"><a href="#/chain/' + ly + '/' + encodeURIComponent(t.id) + '"><b>' + esc(t.name) + '</b></a></td>' +
        cols.map(function (c) {
          var m = map[t.id + '>' + c.id];
          if (!m) return '<td></td>';
          var sm = stMeta[m.status] || stMeta.candidate;
          return '<td><span class="tag ' + sm.cls + '" title="' + esc((m.why || '') + (m.updated ? '（' + m.updated + '）' : '')) + '">' + sm.l + '</span></td>';
        }).join('') + '</tr>';
    }).join('');
    var detail = L.mig.length ? '<h3 class="sec" style="margin-top:18px"><span class="no">02</span><span class="t">迁移明细</span><span class="en">Entries</span></h3>' +
      '<div class="table-scroll"><table class="dense"><thead><tr><th>从（技术）</th><th>到（行业）</th><th>状态</th><th>为什么</th><th>更新</th></tr></thead><tbody>' +
      L.mig.map(function (m) {
        var from = tech.filter(function (t) { return t.id === m.fromNode; })[0];
        var to = cols.filter(function (c) { return c.id === m.toDomain; })[0];
        var sm = stMeta[m.status] || stMeta.candidate;
        return '<tr><td>' + esc(from ? from.name : m.fromNode) + '</td><td>' + esc(to ? to.name : m.toDomain) + '</td>' +
          '<td><span class="tag ' + sm.cls + '">' + sm.l + '</span></td><td class="dim">' + esc(m.why || '') + (m.evid ? '<br><span class="mono" style="font-size:10.5px">' + esc(m.evid) + '</span>' : '') + '</td>' +
          '<td class="mono">' + esc(m.updated || '') + '</td></tr>';
      }).join('') + '</tbody></table></div>' : '';
    el.innerHTML = '<div class="callout pine"><div class="c-t">技术迁移矩阵</div>行 = 产业链 L2/L3 技术节点，列 = L4 行业应用场景。寻找「A 行业已经玩烂，B 行业还没见过」的格子：挑交叉点 → 在 ops.local.js 的 <b class="mono">mig</b> 登记 → 每周扫一遍新增候选。' + cite('eco', 2) + '</div>' +
      opsLockHtml() +
      '<div class="table-scroll" style="margin-top:12px"><table class="dense mig-grid"><thead>' + head + '</thead><tbody>' + rows + '</tbody></table></div>' +
      detail + provBlock('eco');
    return;
  }
  /* 寄生共生雷达（默认页签 radar） */
  if (!L.eco.platforms.length) {
    el.innerHTML = opsEmpty('平台台账为空', '不做直接卖给终端用户的工具，先研究「谁已经拥有你的目标客户」：在 ops.local.js 的 <b class="mono">eco.platforms</b> 登记目标行业的 SaaS/平台——API 开放度（open/restricted/closed）、有无插件市场、流量量级、你的切入点（做他们的插件 / API 供应商 / 生态伙伴）。');
    return;
  }
  var apiTag = { open: '<span class="tag gold">开放</span>', restricted: '<span class="tag">受限</span>', closed: '<span class="tag red">封闭</span>' };
  el.innerHTML = '<div class="table-scroll"><table class="dense"><thead><tr><th>平台</th><th>API</th><th>插件市场</th><th>流量量级</th><th>切入点</th><th>关联机会</th></tr></thead><tbody>' +
    L.eco.platforms.map(function (p) {
      return '<tr><td><b>' + esc(p.name) + '</b></td><td>' + (apiTag[p.api] || esc(p.api || '—')) + '</td>' +
        '<td>' + (p.market ? '<span class="tag gold">有</span>' : '<span class="dim">—</span>') + '</td>' +
        '<td>' + esc(p.traffic || '—') + '</td><td>' + esc(p.entry || '—') + '</td>' +
        '<td>' + oppLink(p.linkedOpp) + '</td></tr>';
    }).join('') + '</tbody></table></div>' +
    '<p class="note" style="margin-top:10px">寄生优先级：有插件市场 + API 开放 + 客户重叠高。成为生态的一环，直接复用他们的流量与信任。' + cite('eco', 3) + '</p>' + provBlock('eco');
};

/* ------------------------------------------------------------ 系统台 */
RENDER.meta = function () {
  var L = DB.opsLocal;
  return viewShell('meta',
    '<div class="view-head">' +
      '<h2>系统台<span class="en">System Observability</span></h2>' +
      '<div class="vh-meta"><span class="m">' + L.sys.signals.length + ' 信源 · ' + L.sys.costs.length + ' 成本记录</span><span class="m">把工作台当 AI 产品运营</span><span class="m">规则硬编码，量级参考</span></div>' +
      '<p class="lead">反馈闭环：行动结果回流为数据源置信度（连败降权）；Token/时间成本对照产出；消费与产出比失衡即分析瘫痪预警；长期未被引用的笔记按半衰期休眠；每季度重构系统本身，防止熵增。</p>' +
    '</div>');
};

PANE.meta = function () {
  var el = $('#pane-meta');
  if (!el) return;
  var L = DB.opsLocal;
  var tab = state.tabs.meta;
  if (tab === 'roi') {
    var costs = L.sys.costs;
    if (!costs.length) {
      el.innerHTML = opsEmpty('成本记录为空', '在 ops.local.js 的 <b class="mono">sys.costs</b> 登记每次研究任务：日期、任务名、token 消耗、耗时（分钟）、产出（out: {clues, actions, exps}）。砍掉「看起来很酷但不赚钱」的分析流程，靠这张表说话。');
      return;
    }
    var sumT = costs.reduce(function (s, c) { return s + (c.tokens || 0); }, 0);
    var sumMin = costs.reduce(function (s, c) { return s + (c.minutes || 0); }, 0);
    var sumOut = costs.reduce(function (s, c) { return s + ((c.out && (c.out.clues || 0) + (c.out.actions || 0) + (c.out.exps || 0)) || 0); }, 0);
    var maxRatio = 1;
    costs.forEach(function (c) {
      var m = c.minutes || 0;
      var o = c.out ? (c.out.clues || 0) + (c.out.actions || 0) + (c.out.exps || 0) : 0;
      if (m > 0 && o / m > maxRatio) maxRatio = o / m;
    });
    el.innerHTML = '<div class="kpi-strip">' +
      opsKpi('任务', costs.length, '已登记') +
      opsKpi('Token', sumT >= 1000000 ? (sumT / 1000000).toFixed(1) + '<small>M</small>' : sumT >= 1000 ? Math.round(sumT / 1000) + '<small>K</small>' : sumT, 'API 消耗') +
      opsKpi('时间', (sumMin / 60).toFixed(1) + '<small>h</small>', '你的小时最贵') +
      opsKpi('产出', sumOut, '线索+行动+实验') + '</div>' +
      '<div class="table-scroll" style="margin-top:12px"><table class="dense"><thead><tr><th>日期</th><th>任务</th><th>Token</th><th>分钟</th><th>产出（线/行/实）</th><th>产出/分钟</th></tr></thead><tbody>' +
      costs.map(function (c) {
        var o = c.out || {};
        var n = (o.clues || 0) + (o.actions || 0) + (o.exps || 0);
        var ratio = c.minutes > 0 ? n / c.minutes : 0;
        return '<tr><td class="mono">' + esc(c.d) + '</td><td>' + esc(c.task) + '</td>' +
          '<td class="mono">' + (c.tokens || 0).toLocaleString() + '</td><td class="mono">' + (c.minutes || 0) + '</td>' +
          '<td class="mono">' + (o.clues || 0) + ' / ' + (o.actions || 0) + ' / ' + (o.exps || 0) + '</td>' +
          '<td class="mono">' + ratio.toFixed(2) + ' ' + bar(ratio, maxRatio, 'var(--gold-2)') + '</td></tr>';
      }).join('') + '</tbody></table></div>' +
      '<p class="note" style="margin-top:10px">口径为本机自报，不追踪任何外部行为。产出/分钟连续垫底的任务类型，就是季度重构时要砍的候选。</p>';
    return;
  }
  if (tab === 'tempo') {
    var cfg = DB.ops.sys.tempo;
    var since = new Date(new Date(opsToday()).getTime() - ((cfg.window || 14) * 86400000));
    var inWin = function (d) { return d && new Date(d).getTime() >= since.getTime(); };
    var minutes = L.sys.costs.filter(function (c) { return inWin(c.d); }).reduce(function (s, c) { return s + (c.minutes || 0); }, 0);
    var ext = L.sys.pulse.filter(function (p) { return p.kind === 'external' && inWin(p.d); });
    var intern = L.sys.pulse.filter(function (p) { return p.kind === 'internal' && inWin(p.d); });
    if (!L.sys.costs.length && !L.sys.pulse.length) {
      el.innerHTML = opsEmpty('节奏台账为空', '两处登记：① <b class="mono">sys.pulse</b>：每天一条 <b class="mono">{d, kind: \'external\'|\'internal\', text}</b>——external = 发邮件/见客户/发产品等对外动作；② <b class="mono">sys.costs</b> 的 minutes 字段自动计入消费侧。规则：' + esc(cfg.note || ''));
      return;
    }
    var ratio = ext.length ? minutes / ext.length : Infinity;
    var panic = ratio > (cfg.warnRatio || 5);
    el.innerHTML = opsLockHtml() + '<div class="kpi-strip">' +
      opsKpi('近 ' + (cfg.window || 14) + ' 天消费', minutes + '<small> 分钟</small>', '研究/阅读/分析') +
      opsKpi('外部交互', ext.length + '<small> 次</small>', '邮件/客户/发布') +
      opsKpi('内部投入', intern.length + '<small> 次</small>', '非对外动作') +
      opsKpi('消费 ÷ 外部', ratio === Infinity ? '∞' : ratio.toFixed(1), '预警阈值 ' + (cfg.warnRatio || 5)) + '</div>' +
      (panic
        ? '<div class="callout red" style="margin-top:12px"><div class="c-t">分析瘫痪预警</div>信息消费远超对外产出。按本台口径：锁定资讯入口，先把一件研究产出变成 48h 内的外部动作——见<a href="#/opp/broken">断链检查</a>。</div>'
        : '<div class="callout pine" style="margin-top:12px"><div class="c-t">节奏健康</div>消费与产出的比例在阈值内。保持：每份研究都要有一个可执行的下落。</div>') +
      '<p class="note" style="margin-top:10px">口径：' + esc(cfg.note || '') + '</p>';
    return;
  }
  if (tab === 'decay') {
    var rule = DB.ops.sys.decay;
    var stale = DB.clues.map(function (c) {
      var days = opsDaysAgo(c.updated);
      return { c: c, days: days, score: Math.pow(0.5, days / (rule.halfLifeDays || 90)) };
    }).filter(function (x) { return isFinite(x.days) && x.score < (rule.staleThreshold || 0.5); })
      .sort(function (a, b) { return a.score - b.score; });
    var oldest = DB.clues.map(function (c) { return opsDaysAgo(c.updated); }).filter(isFinite).sort(function (a, b) { return b - a; })[0] || 0;
    el.innerHTML = '<div class="kpi-strip">' +
      opsKpi('线索总数', DB.clues.length, '全库') +
      opsKpi('低于阈值', stale.length, '衰减分 < ' + (rule.staleThreshold || 0.5)) +
      opsKpi('最久未更新', oldest + '<small> 天</small>', '') +
      opsKpi('半衰期', (rule.halfLifeDays || 90) + '<small> 天</small>', '0.5^(天数/半衰期)') + '</div>' +
      (stale.length
        ? '<div class="table-scroll" style="margin-top:12px"><table class="dense"><thead><tr><th>线索</th><th>主题</th><th>最后更新</th><th>未更新</th><th>衰减分</th><th>建议</th></tr></thead><tbody>' +
          stale.slice(0, 40).map(function (x) {
            return '<tr><td><a href="' + clueHref(x.c.id) + '"><b>' + esc(x.c.name) + '</b></a></td><td>' + esc(x.c.topic) + '</td>' +
              '<td class="mono">' + esc(x.c.updated || '') + '</td><td class="mono">' + x.days + ' 天</td>' +
              '<td class="mono">' + x.score.toFixed(2) + '</td><td><span class="tag plain">休眠候选</span></td></tr>';
          }).join('') + '</tbody></table></div>'
        : '<p class="dim" style="margin-top:12px">没有低于阈值的线索——库还年轻，或更新节奏健康。</p>') +
      '<p class="note" style="margin-top:10px">' + esc(rule.note || '') + ' 衰减按<b>浏览器当日</b>计算（ops 台账不随构建刷新，用快照日会失真）。休眠是降权不是删除；归档前先过一遍「<a href="#/verify/queue">事实核查</a>」。</p>';
    return;
  }
  if (tab === 'review') {
    var reviews = L.sys.review;
    var chkText = DB.ops.sys.reviewChecks.map(function (c) { return '- ' + c; }).join('\n');
    el.innerHTML = '<div class="callout red"><div class="c-t">季度仪式</div>每季度留 2-3 天不做研究，只优化系统本身：删无效源、并冗余 Agent、升级模型。系统跟代码一样会腐烂，不重构就熵增。</div>' +
      '<h3 class="sec" style="margin-top:14px"><span class="no">01</span><span class="t">重构检查清单</span><span class="en">Checklist</span></h3>' +
      '<ul class="plain">' + DB.ops.sys.reviewChecks.map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('') + '</ul>' +
      '<p style="margin-top:10px">' + regCopy('reviewChecks', chkText) + ' <span class="dim">复制清单</span>　<a href="#/calendar/next">排期看日历 →</a></p>' +
      '<h3 class="sec" style="margin-top:20px"><span class="no">02</span><span class="t">执行记录</span><span class="en">History</span></h3>' +
      (reviews.length ? '<div class="table-scroll"><table class="dense"><thead><tr><th>季度</th><th>日期</th><th>做了什么</th><th>下季重点</th></tr></thead><tbody>' +
        reviews.map(function (r) {
          return '<tr><td class="mono"><b>' + esc(r.q) + '</b></td><td class="mono">' + esc(r.d || '') + '</td>' +
            '<td>' + (r.done || []).map(esc).join('；') + '</td><td class="dim">' + esc(r.next || '') + '</td></tr>';
        }).join('') + '</tbody></table></div>' : '<p class="dim">还没有执行记录。做完一次季度重构，记入 ops.local.js 的 sys.review。</p>');
    return;
  }
  /* 信号回流（默认页签 signals） */
  var rule2 = DB.ops.sys.sourceRule;
  var sigs = L.sys.signals;
  if (!sigs.length) {
    el.innerHTML = opsEmpty('信源置信度台账为空', '在 ops.local.js 的 <b class="mono">sys.signals</b> 登记每个数据源：基础权重（base 0-100）、验证胜/败计数（wins/losses）、连败数（streak）。规则：' + esc(rule2.note || '') + ' 实验结果（<a href="#/exp/ledger">实验台</a>）是 wins/losses 的来源。');
    return;
  }
  var downAfter = rule2.downAfter || 3;
  var sugRows = sigs.map(function (s) {
    var down = (s.streak || 0) <= -downAfter;
    var sug = down ? Math.max(rule2.floor || 10, Math.round((s.base || 0) * (rule2.factor || 0.5))) : (s.base || 0);
    var ad = s.adopted === true ? '<span class="tag gold">已采纳</span>' : s.adopted === false ? '<span class="tag plain">不采纳</span>' : '<span class="tag">待裁定</span>';
    return '<tr><td><b>' + esc(s.src) + '</b></td><td class="mono">' + (s.base || 0) + '</td>' +
      '<td class="mono">' + (s.wins || 0) + '</td><td class="mono">' + (s.losses || 0) + '</td>' +
      '<td class="mono"' + (down ? ' style="color:var(--red)"' : '') + '>' + (s.streak || 0) + '</td>' +
      '<td class="mono"><b>' + sug + '</b>' + (down ? ' <span class="tag red">建议降权</span>' : '') + '</td>' +
      '<td>' + ad + '</td><td class="dim">' + esc(s.note || '') + '</td></tr>';
  }).join('');
  var vetoHtml = L.sys.veto.length
    ? '<h3 class="sec" style="margin-top:20px"><span class="no">02</span><span class="t">否决日志（数字孪生原料）</span><span class="en">Veto Journal</span></h3>' +
      '<div class="table-scroll"><table class="dense"><thead><tr><th>日期</th><th>事项</th><th>为什么</th></tr></thead><tbody>' +
      L.sys.veto.map(function (v) { return '<tr><td class="mono">' + esc(v.d) + '</td><td>' + esc(v.item) + '</td><td class="dim">' + esc(v.why) + '</td></tr>'; }).join('') +
      '</tbody></table></div><p class="note" style="margin-top:8px">每一次「否决 AI 建议」或「坚持己见」都记录在案：场景、原因、结果。这是把你的商业品味显性化的原始数据——积累足够后，它就是你的决策风格画像。</p>'
    : '';
  el.innerHTML = '<div class="kpi-strip">' +
    opsKpi('信源', sigs.length, '在册数据源') +
    opsKpi('连败中', sigs.filter(function (s) { return (s.streak || 0) <= -downAfter; }).length, '触发降权建议') +
    opsKpi('待裁定', sigs.filter(function (s) { return s.adopted == null; }).length, '人工决定') +
    opsKpi('规则', '<span style="font-size:16px">' + downAfter + ' 败减半</span>', 'floor ' + (rule2.floor || 10)) + '</div>' +
    '<div class="table-scroll" style="margin-top:12px"><table class="dense"><thead><tr><th>信源</th><th>基础权重</th><th>验证胜</th><th>验证败</th><th>连败</th><th>建议权重</th><th>裁定</th><th>备注</th></tr></thead><tbody>' + sugRows + '</tbody></table></div>' +
    '<p class="note" style="margin-top:10px">' + esc(rule2.note || '') + ' 建议权重由前台按规则计算，采纳与否是人的决定——改 adopted 字段后刷新。' + cite('meta', 1) + '</p>' +
    vetoHtml + provBlock('meta');
};


var NAV_KEY = 'ainews.navClosed.v2';   /* 12 板块换了组名，旧存档里 11 个组名一律作废 */
var NAV_TREE_KEY = 'ainews.navTreeOpen';
var NAV_NARROW = '(max-width:980px)';
function navClosedSet() {
  try { return JSON.parse(localStorage.getItem(NAV_KEY) || '[]'); } catch (e) { return []; }
}
function navHasSaved() {
  try { return localStorage.getItem(NAV_KEY) !== null; } catch (e) { return false; }
}
function navSaveClosed() {
  var closed = $$('.sb-sec.closed').map(function (s) { return s.getAttribute('data-sec'); });
  try { localStorage.setItem(NAV_KEY, JSON.stringify(closed)); } catch (e) { /* 无痕模式静默降级 */ }
}
function navTreeSet() {
  try { return JSON.parse(localStorage.getItem(NAV_TREE_KEY) || '[]'); } catch (e) { return []; }
}
function navSaveTree() {
  var open = $$('.sb-tree.open').map(function (t) { return t.getAttribute('data-tree'); });
  try { localStorage.setItem(NAV_TREE_KEY, JSON.stringify(open)); } catch (e) { /* 无痕模式静默降级 */ }
}
function navLeaf(href, view, label, title, cnt) {
  return '<a href="' + href + '" data-v="' + view + '" data-h="' + href + '"' +
    (title ? ' title="' + esc(title) + '"' : '') + '>' +
    '<span class="lb">' + esc(label) + '</span>' +
    (cnt ? '<span class="cnt">' + esc(cnt) + '</span>' : '') + '</a>';
}
function fillTree(key, rows) {
  var kids = $('#nav .sb-tree[data-tree="' + key + '"] .sb-kids');
  if (kids) kids.innerHTML = rows.join('');
}
/* 三级叶子由数据生成，保证菜单与库内条目同步。
 * 链路/玩家计数要扫 3500+ 行档案（nodeStats），建侧栏时不付这个代价，
 * 故只赛道叶子带 DB.topics[].count，另两类靠 title 提示。 */
function buildNavTree() {
  DB.chain.layers.forEach(function (ly) {
    fillTree('chain/' + ly.key, ly.nodes.map(function (nd) {
      return navLeaf(chainNodeHref(ly.key, nd.id), 'chain', nd.name, nd.def, '');
    }));
  });
  fillTree('players/detail', DB.players.map(function (p) {
    return navLeaf(playerHref(p.name), 'players', p.name, p.positioning || p.note || '', '');
  }));
  fillTree('sectors/matrix', DB.score.sectors.map(function (s) {
    var tp = topicByKey(s.id);
    return navLeaf(sectorHref(s.id), 'sectors', s.name, s.note || '', tp ? tp.count : '');
  }));
}
function setTreeOpen(tree, open) {
  tree.classList.toggle('open', open);
  var x = $('.sb-x', tree);
  if (x) x.setAttribute('aria-expanded', open ? 'true' : 'false');
}
/* 折叠态的唯一权威写入点。
 * 存档存在即以存档为准（旧实现只 add 不 remove，导致 markup 的默认收起
 * 永远压过用户「全部展开」的偏好）；首访不写 DOM，保留 markup 默认。
 * ≤980px 时侧栏被媒体查询改成横向条，组头与 .sb-x 都 display:none，
 * 收起的组没有任何控件可以打开——等于把页面藏死，故窄屏一律展开，且不落盘。 */
function navApplyClosed() {
  var narrow = window.matchMedia && window.matchMedia(NAV_NARROW).matches;
  var saved = navClosedSet();
  var hasSaved = navHasSaved();
  $$('.sb-sec').forEach(function (sec) {
    if (narrow) { sec.classList.remove('closed'); return; }
    if (hasSaved) sec.classList.toggle('closed', saved.indexOf(sec.getAttribute('data-sec')) >= 0);
  });
}
function bindNav() {
  navApplyClosed();
  if (window.matchMedia) {
    var mq = window.matchMedia(NAV_NARROW);
    if (mq.addEventListener) mq.addEventListener('change', navApplyClosed);
    else if (mq.addListener) mq.addListener(navApplyClosed);
  }
  var savedTree = navTreeSet();
  $$('.sb-tree').forEach(function (t) {
    setTreeOpen(t, savedTree.indexOf(t.getAttribute('data-tree')) >= 0);
  });
  $('#nav').addEventListener('click', function (e) {
    var g = e.target.closest('.sb-group');
    if (g) { g.closest('.sb-sec').classList.toggle('closed'); navSaveClosed(); return; }
    var x = e.target.closest('.sb-x');
    if (x) {
      var t = x.closest('.sb-tree');
      setTreeOpen(t, !t.classList.contains('open'));
      navSaveTree();
    }
  });
  $('#navExpandAll').addEventListener('click', function () {
    $$('.sb-sec').forEach(function (s) { s.classList.remove('closed'); });
    $$('.sb-tree').forEach(function (t) { setTreeOpen(t, true); });
    navSaveClosed(); navSaveTree();
    navApplyClosed();   /* 窄屏无组头可点，收起必须立即还原，偏好只留给宽屏 */
  });
  $('#navCollapseAll').addEventListener('click', function () {
    $$('.sb-sec').forEach(function (s) { s.classList.add('closed'); });
    $$('.sb-tree').forEach(function (t) { setTreeOpen(t, false); });
    navSaveClosed(); navSaveTree();
    navApplyClosed();
  });
}

/* ------------------------------------------------------------ 启动 */
function init() {
  $('#sbAsOf').textContent = '快照 ' + DB.meta.builtAt;
  $('#sbAnchor').textContent = DB.meta.counts.clues + ' 线索 · ' + DB.meta.counts.events + ' 大事 · ' + DB.meta.counts.archive + ' 档案';
  $('#footAsOf').textContent = DB.meta.builtAt;
  function setCnt(id, v) { var el = $('#' + id); if (el) el.textContent = v; }
  setCnt('navTopicCnt', DB.meta.counts.topics + ' 类');
  setCnt('navClueCnt', DB.meta.counts.clues + ' 条');
  setCnt('navEventCnt', DB.meta.counts.events + ' 条');
  setCnt('navAnalysisCnt', DB.clues.reduce(function (s, c) { return s + (c.nAnalysis || 0); }, 0));
  setCnt('navArchiveCnt', DB.meta.counts.archive);
  setCnt('navDailyCnt', DB.meta.counts.archiveDays + ' 天');
  setCnt('navVerifyCnt', DB.meta.counts.verify + ' 条');
  setCnt('navPlayerCnt', DB.players.length + ' 家');
  setCnt('navCompanyCnt', companyTotal() + ' 家');
  setCnt('navSectorCnt', DB.meta.counts.topics + ' 维');
  setCnt('navModelCnt', DB.models.length + ' 个');
  setCnt('navCapitalCnt', capitalEvs().length + ' 条');
  setCnt('navChainCnt', chainTotal() + ' 节点');
  setCnt('navResCnt', (DB.research && DB.research.docs ? DB.research.docs.length + ' 篇' : '未构建'));
  setCnt('navThesesCnt', (DB.research && DB.research.theses && DB.research.theses.length ? DB.research.theses.length + ' 条' : '本机'));
  setCnt('navActionsCnt', (DB.research && DB.research.actions && DB.research.actions.length ? DB.research.actions.length + ' 项' : '本机'));
  setCnt('navDigestCnt', '7 天');
  setCnt('navScoreCnt', DB.score.sectors.length + ' 维');
  setCnt('navSimCnt', '工具');
  setCnt('navDecCnt', 'A' + DB.decisions.a.length + ' B' + DB.decisions.b.length + ' C' + DB.decisions.c.length);
  setCnt('navCalCnt', DB.calendar.items.length + ' 节点');
  setCnt('navOppCnt', DB.opsLocal.opps.length ? DB.opsLocal.opps.length + ' 卡' : '本机');
  setCnt('navBrokenCnt', (function () { var n = brokenOpps().length; return n ? n + ' 断链' : '48h'; })());
  setCnt('navExpCnt', DB.opsLocal.exps.length ? DB.opsLocal.exps.length + ' 项' : '本机');
  setCnt('navRedCnt', DB.ops.red.roles.length + ' 角色');
  setCnt('navRiskCnt', DB.opsLocal.risks.deps.length ? DB.opsLocal.risks.deps.length + ' 依赖' : '护栏');
  setCnt('navEcoCnt', DB.opsLocal.mig.length ? DB.opsLocal.mig.length + ' 迁移' : '生态');
  setCnt('navMetaCnt', DB.opsLocal.sys.signals.length ? DB.opsLocal.sys.signals.length + ' 信源' : '台账');
  setCnt('navGlossCnt', DB.glossary.items.length);
  setCnt('navKbCnt', kbTotal());
  setCnt('navLibCnt', DB.library.count + ' 篇');
  /* 该链接直达「公司」一组，徽标取本组数（6 类 · 111 家 的全名录合计写在名录页头） */
  setCnt('navOrgCnt', (DB.orgs.groups.filter(function (g) { return g.name === '公司'; })[0] || { items: [] }).items.length + ' 家');
  setCnt('navUnkCnt', unkTotal() + ' 条');
  setCnt('navGuideCnt', DB.guide.paths.length + ' 路线');
  setCnt('navTourCnt', DB.guide.tour.length + ' 站');

  bindSearch();
  bindTourBar();
  buildNavTree();
  bindNav();

  /* 术语弹框、引用角标与复制按钮的全局交互 */
  document.addEventListener('click', function (e) {
    var cp = e.target.closest('[data-copy]');
    if (cp) { doCopy(COPY_REG[cp.getAttribute('data-copy')] || '', cp); return; }
    var jp = e.target.closest('[data-jump-sec]');
    if (jp) { jumpFlash(document.getElementById(jp.getAttribute('data-jump-sec'))); return; }
    var t = e.target.closest('.term[data-k]');
    if (t) { openTerm(t.getAttribute('data-k')); return; }
    var sup = e.target.closest('sup.cite[data-jump]');
    if (sup) { jumpFlash(document.getElementById(sup.getAttribute('data-jump'))); return; }
    var back = e.target.closest('[data-cite-back]');
    if (back) { jumpFlash(document.querySelector('[data-cite="' + back.getAttribute('data-cite-back') + '"]')); }
  });
  $('#gClose').addEventListener('click', closeTerm);
  $('#glossLayer').addEventListener('click', function (e) { if (e.target.id === 'glossLayer') closeTerm(); });

  function route() {
    var v = currentRoute();
    state.tabs[v] = currentTabOf(v);
    VIEWS.forEach(function (id) { $('#v-' + id).classList.toggle('on', id === v); });
    var canon = navCanonical(v);
    $$('#nav a').forEach(function (a) { a.classList.toggle('on', a.getAttribute('data-h') === canon); });
    var active = $('#nav a.on');
    $$('.sb-tree').forEach(function (t) { t.classList.remove('on-branch'); });
    if (active) {
      var sec = active.closest('.sb-sec');
      if (sec && sec.classList.contains('closed')) { sec.classList.remove('closed'); navSaveClosed(); }
      /* 命中三级叶子时自动展开所属分支，仅本次生效，不覆盖用户偏好 */
      var tree = active.closest('.sb-tree');
      if (tree) {
        tree.classList.add('on-branch');
        if (!tree.classList.contains('open')) setTreeOpen(tree, true);
      }
    }
    syncRoute(v);
    renderTourBar();
    enterView(v);
    window.scrollTo(0, 0);
  }

  window.addEventListener('hashchange', route);
  route();

  function tick() {
    var d = new Date();
    function pad(n) { return (n < 10 ? '0' : '') + n; }
    $('#tbClock').textContent = d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
  }
  tick(); setInterval(tick, 30000);
}

document.addEventListener('DOMContentLoaded', init);
})();
