/* 公司专页补充名录与别名，手工策展（本文件不被构建覆盖）。
 *
 * explain-*.js 的企业版图是公司专页的主索引；本文件只补两类缺口：
 *   1. companyExtra：在深度拆解的价值链字符串里出现、但尚未进入企业版图的公司
 *      （如鸿海、纬创、Ibiden 等供应链环节），字段口径与 explain 企业条目一致；
 *   2. companyAliases：同一公司的中英文/常用简称，用于把散落在正文里的名称
 *      收敛到同一张专页（英伟达 → NVIDIA、Azure → Microsoft Azure）。
 *
 * 口径：公司/产品/技术为公开产业常识的结构化整理层，不是新闻事实；修正走 git 留痕。 */
DB.companyExtra = [
  { name: '鸿海', node: 'gpu', industry: '系统集成与整机柜', role: '全球最大电子代工', products: 'AI 服务器与 GB 系列机柜代工', tech: '整机柜集成、全球产能布局', scenes: '云厂商 AI 服务器代工' },
  { name: '纬创', node: 'gpu', industry: '系统集成与整机柜', role: 'AI 服务器 ODM', products: 'GPU 服务器与机柜组装', tech: 'ODM 设计、整机柜集成', scenes: '云厂商与 AI 服务器' },
  { name: 'Ibiden', node: 'packaging', industry: '基板 / PCB / 电源', role: '高端封装基板', products: 'ABF 载板、封装基板', tech: '高多层载板、细线路工艺', scenes: 'GPU 与 HBM 封装' },
  { name: '欣兴', node: 'packaging', industry: '基板 / PCB / 电源', role: 'IC 载板与 PCB', products: 'ABF 载板、HDI 板', tech: '载板工艺、产能规模', scenes: 'AI 芯片封装基板' },
  { name: '台达', node: 'datacenter', industry: '液冷与配套', role: '电源与散热', products: '数据中心电源、液冷方案', tech: '高压直流、冷板液冷', scenes: '智算中心供电与散热' },
  { name: '光宝', node: 'datacenter', industry: '液冷与配套', role: '电源与光电组件', products: '服务器电源、光耦与电源模块', tech: '电源转换、能效优化', scenes: '数据中心与服务器供电' }
];

DB.companyAliases = {
  '英伟达': 'NVIDIA',
  '英特尔': 'Intel',
  '超威半导体': 'AMD',
  '谷歌': 'Google',
  '微软': 'Microsoft',
  '亚马逊': 'Amazon',
  '博通': 'Broadcom（博通）',
  '苹果': 'Apple',
  '高通': 'Qualcomm',
  '三星电子': '三星',
  'Azure': 'Microsoft Azure',
  '微软 Azure': 'Microsoft Azure',
  '谷歌云': 'Google Cloud',
  'GCP': 'Google Cloud',
  '亚马逊云': 'AWS',
  '亚马逊云科技': 'AWS',
  'Amazon Web Services': 'AWS',
  '富士康': '鸿海',
  'Foxconn': '鸿海',
  'Wistron': '纬创',
  '揖斐电': 'Ibiden',
  'Unimicron': '欣兴',
  'Delta Electronics': '台达',
  'Lite-On': '光宝',
  '戴尔': 'Dell',
  '慧与': 'HPE',
  'Hewlett Packard Enterprise': 'HPE',
  '超微': 'Supermicro',
  'Inspur': '浪潮信息',
  'Lenovo': '联想',
  'H3C': '新华三',
  'Moore Threads': '摩尔线程',
  'Biren': '壁仞科技',
  'MetaX': '沐曦',
  'CRWV': 'CoreWeave',
  '深度求索': 'DeepSeek',
  '腾讯混元': '腾讯',
  '字节跳动 Seed': '字节 Seed',
  'Alphabet（谷歌）': 'Google',
  '商汤': '商汤大装置'
};