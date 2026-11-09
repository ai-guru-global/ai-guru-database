/* ============================================================================
 * Day One 出海研究所，轻量 Markdown 渲染器，GFM 子集
 * 覆盖仓库 md 实际用法：标题，表格，围栏代码，列表，含嵌套与任务，引用，
 * 分隔线，行内元素，如 code，粗体，斜体，删除线，链接与图片。
 * 链接策略：ai-news-wikilink: 走台内线索跳转，.md 命中线索源文件走线索详情、已内嵌走文档中心、未内嵌落仓库原文，http(s) 开新窗口，其余相对路径指向仓库源文件。
 * 用法：Md.render(src, { base: "市场/竞品/拆解.md" }) 返回 HTML 字符串
 * ============================================================================ */
var Md = (function () {
"use strict";

/* ------------------------------------------------------------ 基础工具 */
function escHtml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function slug(s) {
  return String(s).toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "").slice(0, 64);
}
/* 相对路径解析：base 为当前文件的仓库根相对路径，href 为链接原文 */
function resolvePath(base, href) {
  var parts = (base ? base.split("/").slice(0, -1) : []).concat(href.split("/"));
  var out = [];
  parts.forEach(function (p) {
    if (p === "" || p === ".") return;
    if (p === "..") { out.pop(); return; }
    out.push(p);
  });
  return out.join("/");
}

/* ------------------------------------------------------------ 行内渲染 */
function strongEm(s) {
  s = s.replace(/\*\*([^*]+?)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/(^|[^*])\*([^*\n]+?)\*(?!\*)/g, "$1<em>$2</em>");
  s = s.replace(/~~([^~]+?)~~/g, "<del>$1</del>");
  return s;
}
/* 线索文件路径（主题/名.md）优先落线索详情：文档库只收仓库根与 docs/，
   指向主题文件夹内线索的 .md 链接若走文档中心会落回文件列表，此处按 _src 命中改跳 #/clue */
function clueHrefBySrc(resolved) {
  if (typeof DB === "undefined" || !DB || !DB.clues) return "";
  var stem = String(resolved).replace(/\.md$/i, "");
  for (var i = 0; i < DB.clues.length; i++) {
    var c = DB.clues[i];
    if (c._src && c._src.replace(/\.md$/i, "") === stem) {
      return "#/clue/" + encodeURIComponent(c.topic) + "/" + encodeURIComponent(c.name);
    }
  }
  return "";
}
/* 未内嵌的 .md（如两份大事记，构建规则不收进文档中心）不应生成台内死链 */
function docEmbedded(resolved) {
  if (typeof DB === "undefined" || !DB || !DB.library || !DB.library.files) return false;
  for (var i = 0; i < DB.library.files.length; i++) {
    if (DB.library.files[i].n === resolved) return true;
  }
  return false;
}
function linkOut(ctx, href, text) {
  /* href 与 text 来自已 escHtml 的整行文本，此处禁止再次 escHtml，防 &amp; 二次转义成 &amp;amp; */
  /* 构建期 [[主题/线索]] 双链转换出的伪协议：跳台内线索详情 */
  if (/^ai-news-wikilink:/i.test(href)) {
    /* 伪协议带 //  authority 分隔符，必须剥掉，否则线索 id 多出前导斜号、查不到详情 */
    var wl = href.slice("ai-news-wikilink:".length).replace(/^\/+/, "");
    var seg = wl.split("/").map(function (p) { return encodeURIComponent(p); }).join("/");
    return '<a class="wl" href="#/clue/' + seg + '" title="台内线索：' + wl + '">' + text + "</a>";
  }
  if (/^https?:/i.test(href)) {
    return '<a href="' + href + '" target="_blank" rel="noopener">' + text + "</a>";
  }
  if (/^mailto:/i.test(href)) return '<a href="' + href + '">' + text + "</a>";
  if (href.charAt(0) === "#") { /* 同文锚点：与标题 id 规则对齐，h- 前缀加 slug */
    var frag = href.slice(1);
    try { frag = decodeURIComponent(frag); } catch (e) { /* 非法 % 序列按原文处理 */ }
    if (!/^h-/.test(frag)) frag = "h-" + slug(frag);
    return '<a class="md-anchor" data-anchor="' + escHtml(frag) + '">' + text + "</a>";
  }
  var anchor = "", clean = href;
  var ai = href.indexOf("#");
  if (ai >= 0) { anchor = href.slice(ai + 1); clean = href.slice(0, ai); }
  var resolved = resolvePath(ctx.base || "", clean);
  if (/\.md$/i.test(clean)) { /* 台内文档 */
    var ch = clueHrefBySrc(resolved); /* 命中线索源文件则跳线索详情 */
    if (ch) return '<a class="wl" href="' + ch + '" title="台内线索：' + resolved + '">' + text + "</a>";
    if (docEmbedded(resolved)) {
      return '<a class="md-link" data-doc="' + resolved + '" title="台内打开：' + resolved +
        '" href="#/library/files/' + encodeURIComponent(resolved) + '">' + text + "</a>";
    }
    /* 未内嵌：落到仓库原文，不落回文件列表 */
  }
  /* 其他仓库文件，如 yaml，py，xlsx，html 等：console 目录出发的相对路径 */
  return '<a class="md-file" href="../' + resolved + (anchor ? "#" + anchor : "") + '" target="_blank" rel="noopener">' + text + "</a>";
}
function inline(s, ctx) {
  var lines = String(s).split("\n");
  return lines.map(function (ln) {
    var hard = / {2,}$|\\$/.test(ln);
    var t = escHtml(ln.replace(/( {2,}|\\)$/, ""));
    /* 先抽出行内 code，避免其内部被再解析 */
    var codes = [];
    t = t.replace(/(`+)([^`]+?)\1/g, function (m, ticks, c) { codes.push(c); return "\u0001" + (codes.length - 1) + "\u0002"; });
    /* 图片 */
    t = t.replace(/!\[([^\]]*)\]\(([^\s)]+)(?:\s+"[^"]*")?\)/g, function (m, alt, src) {
      var r = /^https?:/i.test(src) ? src : "../" + resolvePath(ctx.base || "", src); /* src 同样已转义，勿二次 escHtml */
      return '<img class="md-img" src="' + r + '" alt="' + alt + '" loading="lazy">';
    });
    /* 链接 */
    t = t.replace(/\[([^\]]+)\]\(([^\s)]+)(?:\s+"[^"]*")?\)/g, function (m, text, href) {
      return linkOut(ctx, href.replace(/^<|>$/g, ""), strongEm(text));
    });
    t = strongEm(t);
    /* 白名单还原仓库 md 实际使用的行内 HTML，如 <br> 断行，<i> 强调，行内 code 内文本不受影响 */
    t = t.replace(/&lt;br\s*\/?&gt;/gi, "<br>").replace(/&lt;(\/?)i&gt;/gi, "<$1i>");
    t = t.replace(/\u0001(\d+)\u0002/g, function (m, i) { return "<code>" + codes[parseInt(i, 10)] + "</code>"; });
    return t + (hard ? "<br>" : "");
  }).join(" ");
}

/* ------------------------------------------------------------ 块级解析 */
function isHr(line) { return /^\s{0,3}(-{3,}|\*{3,}|_{3,})\s*$/.test(line); }
function isFence(line) { return /^\s*(`{3,}|~{3,})\s*\S*/.test(line); }
function isHeading(line) { return /^#{1,6}\s/.test(line); }
function isQuote(line) { return /^\s{0,3}>/.test(line); }
function isListItem(line) { return /^\s*([-*+]|\d{1,3}[.)])\s+/.test(line); }
function isBlockStart(line) {
  return isHeading(line) || isFence(line) || isHr(line) || isQuote(line) || isListItem(line) ||
    (line.indexOf("|") >= 0 && /^[\s|:-]+$/.test(line) && line.indexOf("-") >= 0);
}

/* 表格 */
function isTableSep(line) {
  var t = line.trim();
  if (!t || t.indexOf("-") < 0 || t.indexOf("|") < 0) return false;
  return /^[\s|:-]+$/.test(t);
}
function splitRow(line) {
  var t = line.trim().replace(/\\\|/g, "\u0000").replace(/^\|/, "").replace(/\|$/, "");
  return t.split("|").map(function (c) { return c.replace(/\u0000/g, "\\|").trim(); });
}
function parseTable(lines, i, ctx) {
  var head = splitRow(lines[i]);
  var aligns = splitRow(lines[i + 1]).map(function (c) {
    if (/^:-+:$/.test(c)) return "center";
    if (/^-+:$/.test(c)) return "right";
    return "";
  });
  var attrOf = function (idx) { return aligns[idx] ? ' style="text-align:' + aligns[idx] + '"' : ""; };
  var html = '<div class="md-tscroll"><table class="md-table"><thead><tr>';
  head.forEach(function (c, idx) { html += "<th" + attrOf(idx) + ">" + inline(c, ctx) + "</th>"; });
  html += "</tr></thead><tbody>";
  var j = i + 2;
  while (j < lines.length && lines[j].trim() !== "" && lines[j].indexOf("|") >= 0) {
    var cells = splitRow(lines[j]);
    html += "<tr>";
    head.forEach(function (_, idx) {
      html += "<td" + attrOf(idx) + ">" + inline(cells[idx] || "", ctx) + "</td>";
    });
    html += "</tr>";
    j++;
  }
  html += "</tbody></table></div>";
  return { html: html, next: j };
}

/* 列表：收集块与缩进栈构建，支持嵌套与任务列表 */
function collectList(lines, i) {
  var block = [], sawBlank = false;
  while (i < lines.length) {
    var L = lines[i];
    if (L.trim() === "") {
      var j = i + 1;
      while (j < lines.length && lines[j].trim() === "") j++;
      if (j < lines.length && isListItem(lines[j])) { block.push(""); sawBlank = true; i++; continue; }
      break;
    }
    if (isListItem(L)) { block.push(L); sawBlank = false; i++; continue; }
    if (/^\s+\S/.test(L) && block.length) { block.push(L); i++; continue; }          /* 缩进续行 */
    if (block.length && !sawBlank && !isBlockStart(L)) { block.push(L); i++; continue; } /* lazy 续行 */
    break;
  }
  return { lines: block, next: i };
}
function buildList(block, ctx) {
  var html = "", stack = [];
  var closeAll = function () {
    while (stack.length) {
      var t = stack.pop();
      if (t.liOpen) html += "</li>";
      html += "</" + t.tag + ">";
    }
  };
  block.forEach(function (line) {
    if (line === "") return; /* loose 列表：空行仅分隔，渲染为紧凑 */
    var m = /^(\s*)([-*+]|\d{1,3}[.)])\s+(.*)$/.exec(line);
    if (!m) { /* 续行 */
      if (stack.length) html += "<br>" + inline(line.replace(/^\s+/, ""), ctx);
      return;
    }
    var indent = m[1].replace(/\t/g, "    ").length;
    var tag = /^[-*+]/.test(m[2]) ? "ul" : "ol";
    while (stack.length && stack[stack.length - 1].indent > indent) {
      var top = stack.pop();
      if (top.liOpen) html += "</li>";
      html += "</" + top.tag + ">";
    }
    if (!stack.length) {
      html += "<" + tag + ">"; stack.push({ indent: indent, tag: tag, liOpen: true });
    } else if (indent > stack[stack.length - 1].indent) {
      html += "<" + tag + ">"; stack.push({ indent: indent, tag: tag, liOpen: true });
    } else if (tag !== stack[stack.length - 1].tag) {
      /* 同缩进 ul 与 ol 切换：断开旧列表，开新列表 */
      if (stack[stack.length - 1].liOpen) html += "</li>";
      html += "</" + stack.pop().tag + "><" + tag + ">";
      stack.push({ indent: indent, tag: tag, liOpen: true });
    } else {
      if (stack[stack.length - 1].liOpen) html += "</li>";
      stack[stack.length - 1].liOpen = true;
    }
    var text = m[3];
    var task = /^\[([ xX])\]\s*(.*)$/.exec(text);
    if (task) {
      html += '<li class="md-task"><label><input type="checkbox" disabled' +
        (task[1].toLowerCase() === "x" ? " checked" : "") + "><span>" + inline(task[2], ctx) + "</span></label>";
    } else {
      html += "<li>" + inline(text, ctx);
    }
  });
  closeAll();
  return html;
}

/* ------------------------------------------------------------ 主渲染 */
function render(src, opts) {
  var ctx = opts || {};
  var lines = String(src).replace(/\r\n?/g, "\n").split("\n");
  var out = [], i = 0, seen = {};
  /* YAML front matter，如 DESIGN.md 等：跳过开头 --- 至闭合 --- 的元数据块 */
  if (lines[0] === "---") {
    var fmEnd = lines.indexOf("---", 1);
    if (fmEnd > 0) i = fmEnd + 1;
  }
  while (i < lines.length) {
    var line = lines[i];
    if (line.trim() === "") { i++; continue; }

    /* 围栏代码 */
    var fm = /^\s*(`{3,}|~{3,})\s*([^`~]*)$/.exec(line);
    if (fm) {
      var fence = fm[1].charAt(0), info = fm[2].trim(), buf = [];
      i++;
      var closer = new RegExp("^\\s*" + fence + "{3,}\\s*$");
      while (i < lines.length && !closer.test(lines[i])) { buf.push(lines[i]); i++; }
      i++;
      out.push('<pre class="md-pre">' + (info ? '<span class="md-lang">' + escHtml(info) + "</span>" : "") +
        "<code>" + escHtml(buf.join("\n")) + "</code></pre>");
      continue;
    }
    /* 标题 */
    var hm = /^(#{1,6})\s+(.+?)\s*#*\s*$/.exec(line);
    if (hm) {
      var lv = hm[1].length, htx = hm[2];
      var hbase = "h-" + slug(htx), hid = hbase;      /* 重复标题追加 -2 或 -3，保证 id 唯一 */
      if (seen[hbase]) { hid = hbase + "-" + (++seen[hbase]); } else { seen[hbase] = 1; }
      out.push("<h" + lv + ' id="' + hid + '">' + inline(htx, ctx) + "</h" + lv + ">");
      i++; continue;
    }
    /* 分隔线 */
    if (isHr(line)) { out.push("<hr>"); i++; continue; }
    /* 引用块，含跨空行续段 */
    if (isQuote(line)) {
      var buf = [];
      while (i < lines.length && (isQuote(lines[i]) ||
        (lines[i].trim() === "" && i + 1 < lines.length && isQuote(lines[i + 1])))) {
        buf.push(lines[i].replace(/^\s{0,3}>\s?/, "")); i++;
      }
      out.push("<blockquote>" + render(buf.join("\n"), ctx) + "</blockquote>");
      continue;
    }
    /* 表格 */
    if (line.indexOf("|") >= 0 && i + 1 < lines.length && isTableSep(lines[i + 1])) {
      var tb = parseTable(lines, i, ctx);
      out.push(tb.html); i = tb.next;
      continue;
    }
    /* 列表 */
    if (isListItem(line)) {
      var ls = collectList(lines, i);
      out.push(buildList(ls.lines, ctx));
      i = ls.next;
      continue;
    }
    /* 段落 */
    var pbuf = [line]; i++;
    while (i < lines.length && lines[i].trim() !== "" && !isBlockStart(lines[i]) &&
      !(lines[i].indexOf("|") >= 0 && i + 1 < lines.length && isTableSep(lines[i + 1]))) {
      pbuf.push(lines[i]); i++;
    }
    out.push("<p>" + inline(pbuf.join("\n"), ctx) + "</p>");
  }
  return out.join("\n");
}

return { render: render, escHtml: escHtml };
})();
