/* 统一工作台 · 生产版（P2）
 * 数据接线：data/index.js（检索）· data/tree.js（树）· data/pages/<shard>.js（阅读，按需注入）
 * 与拆解台 data.js 同模式：全部 script 注入，file:// 双击可用。
 * 打分规则必须与 console/tools/scripts/build_portal.py 完全一致：
 *   q 按空白切分 AND；标题精确 8 / 标题包含 3 / 路径包含 2 / 摘要包含 1。
 */
(function () {
  'use strict';

  var state = { q: '', p: '', read: '', surface: 'site' };
  var idxState = 'loading'; // loading | ready | error
  var tree = null;
  var $ = function (id) { return document.getElementById(id); };

  /* 部署口径：file:// 双击 = 仓内相对路径直开；http(s) = Pages 打包结构
   * （portal 与 发布站/拆解台 同在 /portal/ 下，文档站在 ../mkdocs/，前端应用在 ../）
   * 原始 md 文件线上走 GitHub blob（仓库公开）。 */
  var ONLINE = location.protocol !== 'file:';
  function surfaceHref(kind) {
    if (!ONLINE) {
      return {
        site: '../../console/site/index.html',
        cons: '../../console/console/index.html',
        docs: '../../code/前端应用/public/mkdocs/index.html',
        app: 'https://ai-guru-global.github.io/ai-guru-database/'
      }[kind];
    }
    return {
      site: './surfaces/site/index.html',
      cons: './surfaces/console/index.html',
      docs: '../mkdocs/index.html',
      app: '../'
    }[kind];
  }
  function rawHref(path) {
    var p = String(path).split('#')[0];
    if (!ONLINE) return '../../' + p;
    return 'https://github.com/ai-guru-global/ai-guru-database/blob/main/' + encodeURI(p);
  }

  /* ---------------- hash 路由（前进/后退可用） ---------------- */
  function parseHash() {
    var out = { q: '', p: '', read: '', surface: state.surface || 'site' };
    location.hash.replace(/^#/, '').split('&').forEach(function (kv) {
      if (!kv) return;
      var i = kv.indexOf('=');
      var k = i < 0 ? kv : kv.slice(0, i);
      if (k in out) out[k] = i < 0 ? '' : decodeURIComponent(kv.slice(i + 1));
    });
    return out;
  }
  function hashStr() {
    var parts = [];
    if (state.q) parts.push('q=' + encodeURIComponent(state.q));
    if (state.p) parts.push('p=' + encodeURIComponent(state.p));
    if (state.read) parts.push('read=' + encodeURIComponent(state.read));
    if (state.surface && state.surface !== 'site') parts.push('surface=' + state.surface);
    return parts.join('&');
  }
  function commit(push) {
    var s = '#' + hashStr();
    if (s === location.hash || (s === '#' && location.hash === '')) { apply(); return; }
    if (push) location.hash = hashStr();
    else location.replace(s);
  }

  /* ---------------- 数据注入 ---------------- */
  function inject(src, ok, fail) {
    var s = document.createElement('script');
    s.src = src;
    s.onload = ok;
    s.onerror = fail || ok;
    document.head.appendChild(s);
  }
  function ensureIndex(cb) {
    if (idxState === 'ready') { cb(); return; }
    if (idxState === 'loading' && ensureIndex.waiting) { ensureIndex.waiting.push(cb); return; }
    ensureIndex.waiting = [cb];
    inject('data/index.js', function () {
      if (window.__PORTAL_INDEX__) {
        idxState = 'ready';
        ensureIndex.waiting.forEach(function (f) { f(); });
        ensureIndex.waiting = null;
      } else {
        idxState = 'error';
        renderResults();
      }
    }, function () { idxState = 'error'; renderResults(); });
  }
  function ensureTree(cb) {
    if (tree) { cb(); return; }
    inject('data/tree.js', function () {
      tree = window.__PORTAL_TREE__ || null;
      buildTree();
      cb();
    }, function () { tree = null; buildTree(); cb(); });
  }
  function shardOf(path) {
    if (path.indexOf('console/') === 0) {
      var rest = path.slice(8);
      var top = rest.split('/')[0];
      if (top === '证据层' || /^0[1-5]-/.test(top)) return 'console/' + top;
      return 'console/_root';
    }
    return 'wiki/' + path.split('/')[0];
  }
  function ensureShard(path, cb) {
    var key = shardOf(path);
    if (window.__PORTAL_SHARDS__ && window.__PORTAL_SHARDS__[key]) { cb(null, key); return; }
    inject('data/pages/' + key.replace(/\//g, '__') + '.js', function () {
      var m = window.__PORTAL_SHARDS__ && window.__PORTAL_SHARDS__[key];
      cb(m ? null : new Error('shard missing'), key);
    }, function () { cb(new Error('shard load failed'), key); });
  }

  /* ---------------- 打分（与 build_portal.py 一致） ---------------- */
  function score(r, toks) {
    var t = (r.t || '').toLowerCase(), x = (r.x || '').toLowerCase(), p = (r.p || '').toLowerCase();
    var s = 0;
    for (var i = 0; i < toks.length; i++) {
      var k = toks[i];
      if (t === k) s += 8;
      else if (t.indexOf(k) >= 0) s += 3;
      else if (p.indexOf(k) >= 0) s += 2;
      else if (x.indexOf(k) >= 0) s += 1;
      else return 0;
    }
    return s;
  }
  function search(q) {
    var toks = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!toks.length || !window.__PORTAL_INDEX__) return [];
    var recs = window.__PORTAL_INDEX__.records;
    var out = [];
    for (var i = 0; i < recs.length; i++) {
      var sc = score(recs[i], toks);
      if (sc > 0) out.push([sc, i, recs[i]]);
    }
    out.sort(function (a, b) { return a[0] - b[0] ? b[0] - a[0] : a[1] - b[1]; });
    return out.map(function (x) { return x[2]; });
  }
  function browse(prefix) {
    if (!window.__PORTAL_INDEX__) return [];
    return window.__PORTAL_INDEX__.records
      .filter(function (r) { return r.p.indexOf(prefix) === 0; })
      .sort(function (a, b) { return a.p < b.p ? -1 : a.p > b.p ? 1 : 0; });
  }

  /* ---------------- 视图切换 ---------------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function show(el, on) { if (el) el.hidden = !on; }
  function setViews(readerOn) {
    ['search-sec', 'surfaces-sec'].forEach(function (id) { show($(id), !readerOn); });
    show($('reader'), readerOn);
  }

  /* ---------------- 结果区（loading/error/idle/empty/full） ---------------- */
  function renderResults() {
    var tbl = $('results'), loading = $('st-loading'), error = $('st-error'),
        idle = $('st-idle'), empty = $('st-empty'), status = $('status');
    var body = $('results-body');
    if (body) body.innerHTML = ''; // 隐藏态不残留上一次的行
    if (idxState === 'loading') {
      show(loading, true); show(error, false); show(idle, false);
      show(empty, false); show(tbl, false); show(status, false);
      return;
    }
    if (idxState === 'error') {
      show(loading, false); show(error, true); show(idle, false);
      show(empty, false); show(tbl, false); show(status, false);
      return;
    }
    show(loading, false); show(error, false);
    var q = state.q.trim(), rows;
    if (q) {
      var hits = search(q);
      rows = hits.slice(0, 10);
      show(status, true);
      status.innerHTML = '命中 <span class="measured">' + hits.length + '</span> 条，显示前 <span class="measured">' +
        rows.length + '</span> 条' + (state.p ? '，另有限定 <span class="measured">' + esc(state.p) + '</span>' : '') + '。';
      if (!rows.length) {
        show(tbl, false); show(idle, false);
        show(empty, true);
        $('empty-q').textContent = '「' + q + '」';
        return;
      }
      show(empty, false); show(idle, false); show(tbl, true);
      fillRows(rows);
    } else if (state.p) {
      var list = browse(state.p);
      rows = list.slice(0, 100);
      show(status, true);
      status.innerHTML = '限定 <span class="measured">' + esc(state.p) + '</span>：共 <span class="measured">' +
        list.length + '</span> 条，显示前 <span class="measured">' + rows.length + '</span> 条。';
      if (!rows.length) {
        show(tbl, false); show(idle, false); show(empty, true);
        $('empty-q').textContent = '「' + state.p + '」';
        return;
      }
      show(empty, false); show(idle, false); show(tbl, true);
      fillRows(rows);
    } else {
      show(tbl, false); show(empty, false); show(status, false); show(idle, true);
    }
    updateFilterbar();
  }
  function fillRows(rows) {
    var html = '';
    rows.forEach(function (r) {
      html += '<tr><td data-label="命中"><a class="hit" href="#read=' + encodeURIComponent(r.p) +
        '" data-read="' + esc(r.p) + '">' + esc(r.t) + '</a>' +
        (r.x ? '<span class="sub">' + esc(r.x) + '</span>' : '') + '</td>' +
        '<td data-label="面"><span class="chip">' + esc(r.s) + '</span></td>' +
        '<td class="path" data-label="路径">' + esc(r.p) + '</td>' +
        '<td class="date" data-label="更新">' + (r.d ? esc(r.d) : '<span class="muted">未注明</span>') + '</td></tr>';
    });
    $('results-body').innerHTML = html;
  }
  function updateFilterbar() {
    var bar = $('filterbar');
    if (bar) bar.hidden = !state.p;
    if (state.p) { var fp = $('filter-prefix'); if (fp) fp.textContent = state.p; }
    document.querySelectorAll('[data-prefix]').forEach(function (b) {
      if (b.tagName === 'BUTTON') {
        b.setAttribute('aria-pressed', b.getAttribute('data-prefix') === state.p ? 'true' : 'false');
      }
    });
  }

  /* ---------------- 阅读视图 ---------------- */
  // 一级防护：分片 HTML 为第一方 md 构建（同 mkdocs 口径不做全量消毒），
  // 仍剥离脚本与内联事件处理器，避免内容侧意外注入。
  function sanitize(html) {
    return String(html)
      .replace(/<script\b[\s\S]*?<\/script>/gi, '')
      .replace(/\son[a-z]+\s*=\s*"[^"]*"/gi, '')
      .replace(/\son[a-z]+\s*=\s*'[^']*'/gi, '')
      .replace(/\son[a-z]+\s*=\s*[^\s">]+/gi, '')
      .replace(/(href|src)\s*=\s*["']\s*javascript:[^"']*["']/gi, '$1="#"');
  }
  function openRead(path) {
    ensureIndex(function () {
      var recs = window.__PORTAL_INDEX__.records;
      var rec = null;
      for (var i = 0; i < recs.length; i++) if (recs[i].p === path) { rec = recs[i]; break; }
      setViews(true);
      $('r-crumb').textContent = path;
      $('r-title').textContent = rec ? rec.t : path;
      $('r-lede').textContent = rec && rec.x ? rec.x : '';
      $('r-open').setAttribute('href', rawHref(path));
      $('r-body').innerHTML = '';
      var note = $('r-note');
      if (!rec) {
        note.textContent = '该路径不在索引中（可能被构建排除）。可尝试打开原始文件。';
        show(note, true);
        focusBack();
        return;
      }
      if (rec.k !== 'doc') {
        note.textContent = '数据集实体没有阅读视图；可打开右侧原始数据文件查看。';
        show(note, true);
        focusBack();
        return;
      }
      show(note, false);
      ensureShard(path, function (err, key) {
        if (err) {
          $('r-body').innerHTML = '';
          note.textContent = '阅读分片未加载（' + key + '）。在 console/ 运行 make portal 后重试。';
          show(note, true);
        } else {
          var page = window.__PORTAL_SHARDS__[key][path];
          if (page == null) {
            note.textContent = '该文件不在分片中。';
            show(note, true);
          } else {
            $('r-body').innerHTML = sanitize(page);
            show(note, false);
          }
        }
        focusBack();
      });
      focusBack();
    });
  }
  function focusBack() { var b = $('r-back'); if (b) b.focus(); }
  function closeRead() {
    setViews(false);
    renderResults();
    var first = document.querySelector('#results-body .hit') || $('q');
    if (first) first.focus();
  }

  /* ---------------- 树 ---------------- */
  function buildTree() {
    var nav = $('tree-nav');
    if (!tree) {
      nav.innerHTML = '<p class="tree-miss">树数据未加载；在 console/ 运行 make portal 后刷新。</p>';
      return;
    }
    var h = '';
    h += '<p class="group">产业链</p>';
    tree.layers.forEach(function (ly, i) {
      h += '<details class="layer"' + (i === 1 ? ' open' : '') + '><summary>' + esc(ly.n) +
        ' <span class="count">' + ly.nodes.length + '</span></summary><ul class="nodes">';
      ly.nodes.forEach(function (nd) {
        h += '<li><button type="button" data-prefix="' + esc(nd.p) + '">' + esc(nd.n) + '</button></li>';
      });
      h += '</ul></details>';
    });
    h += '<p class="group">文档章节</p><details class="layer"><summary>wiki 章节 <span class="count">' +
      tree.chapters.length + '</span></summary><ul class="nodes">';
    tree.chapters.forEach(function (c) {
      h += '<li><button type="button" data-prefix="' + esc(c.p) + '">' + esc(c.n) +
        ' <span class="count">' + c.c + '</span></button></li>';
    });
    h += '</ul></details>';
    h += '<p class="group">横向主题</p><ul><li><a href="' + rawHref('console/_topics.md') + '"' +
      (ONLINE ? ' target="_blank" rel="noopener"' : '') + '>主题总表 <span class="count">18 类</span></a></li></ul>';
    h += '<p class="group">打开四个面</p><ul>' +
      '<li><a href="' + surfaceHref('site') + '" target="_blank" rel="noopener">发布站 <span class="count">' + tree.surfaces['发布站'] + ' 页</span></a></li>' +
      '<li><a href="' + surfaceHref('cons') + '" target="_blank" rel="noopener">拆解台 <span class="count">' + tree.surfaces['拆解台'] + ' 视图</span></a></li>' +
      '<li><a href="' + surfaceHref('docs') + '" target="_blank" rel="noopener">文档站 <span class="count">' + tree.surfaces['文档站'] + ' 篇</span></a></li>' +
      '<li><a href="' + surfaceHref('app') + '" target="_blank" rel="noopener">前端应用 <span class="count">' + tree.surfaces['前端应用'] + ' 路由</span></a></li>' +
      '</ul>';
    nav.innerHTML = h;
    // 预览区计数同步
    var cap = { 'cap-site': tree.surfaces['发布站'], 'cap-console': tree.surfaces['拆解台'],
                'cap-docs': tree.surfaces['文档站'], 'cap-app': tree.surfaces['前端应用'] };
    Object.keys(cap).forEach(function (id) { var el = $(id); if (el) el.textContent = cap[id]; });
  }

  /* ---------------- 应用状态 ---------------- */
  function apply() {
    state = parseHash();
    var input = $('q');
    if (input && document.activeElement !== input) input.value = state.q;
    updateFilterbar();
    syncTabs();
    if (state.read) { openRead(state.read); return; }
    setViews(false);
    renderResults();
  }

  /* ---------------- 页签（面预览） ---------------- */
  var TABS = ['site', 'console', 'docs', 'app'];
  function syncTabs() {
    var key = state.surface || 'site';
    if (TABS.indexOf(key) < 0) key = 'site';
    TABS.forEach(function (k) {
      var tab = $('tab-' + k), panel = $('surface-' + k);
      if (tab) { tab.setAttribute('aria-selected', k === key ? 'true' : 'false'); tab.tabIndex = k === key ? 0 : -1; }
      if (panel) panel.hidden = k !== key;
    });
  }
  function selectTab(k, push) {
    state.surface = k;
    commit(push);
  }

  /* ---------------- 事件绑定 ---------------- */
  function bind() {
    window.addEventListener('hashchange', apply);

    $('q-form').addEventListener('submit', function (e) {
      e.preventDefault();
      state.q = $('q').value.trim();
      state.read = '';
      commit(false);
    });
    var timer = null;
    $('q').addEventListener('input', function () {
      clearTimeout(timer);
      timer = setTimeout(function () {
        state.q = $('q').value.trim();
        if (state.read) { state.read = ''; setViews(false); }
        commit(false);
      }, 250);
    });

    $('r-back').addEventListener('click', function () {
      state.read = '';
      commit(true);
      closeRead();
    });

    document.addEventListener('click', function (e) {
      var a = e.target.closest ? e.target.closest('a[data-read]') : null;
      if (a) {
        e.preventDefault();
        state.read = a.getAttribute('data-read');
        commit(true);
        return;
      }
      var btn = e.target.closest ? e.target.closest('[data-prefix]') : null;
      if (btn) {
        e.preventDefault();
        state.p = btn.getAttribute('data-prefix');
        state.q = '';
        state.read = '';
        $('q').value = '';
        commit(true);
        return;
      }
      var clear = e.target.closest ? e.target.closest('[data-clear-prefix]') : null;
      if (clear) { e.preventDefault(); state.p = ''; commit(true); return; }
      var focusQ = e.target.closest ? e.target.closest('[data-focus-q]') : null;
      if (focusQ) { e.preventDefault(); $('q').focus(); $('q').select(); }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && state.read) { state.read = ''; commit(true); closeRead(); }
    });

    TABS.forEach(function (k) {
      var tab = $('tab-' + k);
      if (!tab) return;
      tab.addEventListener('click', function () { selectTab(k, false); });
      tab.addEventListener('keydown', function (e) {
        var i = TABS.indexOf(k), n = null;
        if (e.key === 'ArrowRight') n = (i + 1) % TABS.length;
        if (e.key === 'ArrowLeft') n = (i - 1 + TABS.length) % TABS.length;
        if (n !== null) { e.preventDefault(); selectTab(TABS[n], false); $('tab-' + TABS[n]).focus(); }
      });
    });
  }

  /* ---------------- 启动 ---------------- */
  function init() {
    bind();
    renderResults(); // 先显示 loading 骨架
    ensureTree(function () {
      ensureIndex(function () { apply(); });
    });
  }
  init();
})();
