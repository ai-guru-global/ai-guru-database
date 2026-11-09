#!/usr/bin/env node
/**
 * 公司专页结构校验（v2 模板见 docs/公司专页模板.md）
 *
 * 用法：node tools/scripts/check_company_profiles.js [--verbose] [--only=id1,id2] [--ids=id1,id2]
 * 退出码：0 = 全部通过；1 = 有硬性问题。
 */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..', '..');
const KB = path.join(ROOT, 'console', 'kb.js');

const IDS = [
  'datadog', 'dynatrace', 'newrelic', 'splunk', 'pagerduty', 'bigpanda',
  'resolveai', 'shoreline', 'rootly', 'harnessio',
  'jiaweilanjing', 'flashcat', 'guance', 'qingchuang',
  'cloudwise', 'bizseer', 'yunshan', 'bonree',
  'huawei', 'sangfor', 'h3c', 'servicenow',
  'sugon', 'lenovo', 'gds', 'chinasoft'
];

const SECTIONS = [
  '公司快照', '定位与沿革', '创始人与管理层', '商业模式', '产品矩阵',
  '技术栈与壁垒', '客户与案例', '商业进展', '经营业绩', '股权、融资与股票',
  '团队与人员', '竞争格局', '风险与争议', '本库追踪', '信源与口径'
];

const SNAPSHOT_ROWS = [
  '成立 / 总部', '上市地 / 代码', '最新财年营收', '盈利', '现金流',
  '客户', '员工', '市值 / 估值', '主要股东', '数据截至'
];

const verbose = process.argv.includes('--verbose');
const onlyArg = process.argv.find(a => a.indexOf('--only=') === 0);
const idsArg = process.argv.find(a => a.indexOf('--ids=') === 0);
const ONLY = onlyArg ? new Set(onlyArg.slice('--only='.length).split(',').filter(Boolean)) : null;
const EXTRA = idsArg ? idsArg.slice('--ids='.length).split(',').filter(Boolean) : null;
const targetIds = EXTRA || (ONLY ? IDS.filter(id => ONLY.has(id)) : IDS);

const ctx = { DB: { kb: {} } };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(KB, 'utf8'), ctx, { filename: KB });

const group = (ctx.DB.kb.groups || []).filter(g => g.key === 'companies')[0];
if (!group) {
  console.error('FAIL: companies group not found in console/kb.js');
  process.exit(1);
}

const byId = {};
group.pages.forEach(p => { byId[p.id] = p; });

let hard = 0;
let soft = 0;
const issues = [];

function add(id, level, msg) {
  issues.push({ id, level, msg });
  if (level === 'hard') hard++; else soft++;
}

function sectionMap(body) {
  const map = {};
  let cur = null;
  body.split(/\r?\n/).forEach(line => {
    const m = line.match(/^##\s+(.+?)\s*$/);
    if (m) { cur = m[1]; map[cur] = ''; return; }
    if (cur) map[cur] += line + '\n';
  });
  return map;
}

const ids = new Set();
(targetIds).forEach(id => {
  const p = byId[id];
  if (!p) { add(id, 'hard', '页面不存在'); return; }
  if (ids.has(id)) add(id, 'hard', 'id 重复');
  ids.add(id);

  const body = String(p.body || '');
  const sec = sectionMap(body);

  SECTIONS.forEach(name => {
    if (!(name in sec)) add(id, 'hard', '缺少模块：## ' + name);
  });

  const snapshot = sec['公司快照'] || '';
  SNAPSHOT_ROWS.forEach(row => {
    if (snapshot.indexOf('| ' + row + ' |') < 0) {
      add(id, 'hard', '快照缺少字段：' + row);
    }
  });

  const minLen = (id === 'datadog' || id === 'servicenow' || id === 'huawei') ? 1200 : 900;
  if (body.length < minLen) {
    add(id, 'hard', '正文过短：' + body.length + ' 字（下限 ' + minLen + '）');
  }

  Object.keys(sec).forEach(name => {
    if (name === '公司快照') return;
    const t = sec[name].replace(/\s+/g, '');
    if (t.length < 40) add(id, 'hard', '模块内容过少：## ' + name + '（' + t.length + ' 字）');
  });

  const src = (sec['信源与口径'] || '');
  const srcLines = src.split(/\r?\n/).filter(x => /^\s*[-*]\s+/.test(x)).length;
  const srcLinks = (src.match(/https?:\/\//g) || []).length;
  if (srcLines < 3 && srcLinks < 3) {
    add(id, 'hard', '信源不足：至少 3 条（当前 bullet ' + srcLines + ' / 链接 ' + srcLinks + '）');
  }

  if (/\b(TODO|TBD)\b/.test(body)) add(id, 'hard', '含 TODO/TBD 占位');
  if (/##\s+\S+\s*\n\s*(?=##|$)/.test(body)) add(id, 'hard', '存在空模块');

  if (verbose) {
    console.log('OK  ' + id.padEnd(14) + ' ' + body.length + ' 字  ' +
      (sec['本库追踪'] || '').replace(/\s+/g, ' ').trim().slice(0, 60));
  }
});

if (issues.length) {
  issues.forEach(x => console.log((x.level === 'hard' ? 'FAIL ' : 'WARN ') + x.id + ' :: ' + x.msg));
  console.log('\nissues: ' + issues.length + ' (hard ' + hard + ', soft ' + soft + ')');
  process.exit(hard ? 1 : 0);
}

console.log('OK: ' + targetIds.length + ' 家公司专页结构通过（15 模块 / 10 行快照 / 字数 / 信源）');