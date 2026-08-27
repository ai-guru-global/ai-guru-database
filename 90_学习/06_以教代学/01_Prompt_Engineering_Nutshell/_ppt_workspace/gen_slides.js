// 生成 Prompt Engineering 课件的 16 页 HTML 幻灯片
const fs = require('fs');
const path = require('path');

const NAVY = '#1C2833', NAVY2 = '#2E4053', AMBER = '#E67E22', AMBER_L = '#F5B041';
const CORAL = '#C0392B', CREAM = '#FAF8F5', TEAL = '#16A085', GRAY = '#7F8C8D';

const BASE = `html{background:${CREAM};}
body{width:720pt;height:405pt;margin:0;padding:0;background:${CREAM};font-family:'PingFang SC','Microsoft YaHei',Arial,sans-serif;display:flex;flex-direction:column;}
.hdr{background:${NAVY};padding:11pt 26pt 9pt 26pt;display:flex;align-items:center;}
.hdr .act{background:${AMBER};padding:3pt 9pt;margin-right:12pt;border-radius:3pt;}
.hdr .act p{color:#ffffff;font-size:10pt;margin:0;}
.hdr h1{color:#ffffff;font-size:19pt;margin:0;}
.body{padding:12pt 28pt 0 28pt;flex:1;}
.ftr{display:flex;justify-content:space-between;padding:4pt 28pt 6pt 28pt;}
.ftr p{color:${GRAY};font-size:8pt;margin:0;}
h2{color:${NAVY};font-size:14pt;margin:6pt 0 5pt 0;}
h3{color:${NAVY2};font-size:12pt;margin:4pt 0 3pt 0;}
p{font-size:11pt;color:#2C3E50;margin:3pt 0;line-height:1.45;}
ul,ol{margin:3pt 0 3pt 16pt;padding:0;}
li{font-size:11pt;color:#2C3E50;margin:2.5pt 0;line-height:1.4;}
.card{background:#ffffff;border-radius:6pt;padding:9pt 12pt;box-shadow:1px 1px 5px rgba(0,0,0,0.10);}
.accent-l{border-left:5pt solid ${AMBER};}
.warn{border-left:5pt solid ${CORAL};}
.ok{border-left:5pt solid ${TEAL};}
.placeholder{background:#E8E6E1;border-radius:4pt;}
.cols{display:flex;gap:12pt;}
.col{flex:1;}`;

function page(act, title, inner, num) {
  return `<!DOCTYPE html><html><head><style>${BASE}</style></head><body>
<div class="hdr"><div class="act"><p>${act}</p></div><h1>${title}</h1></div>
<div class="body">${inner}</div>
<div class="ftr"><p>以教代学系列 · Prompt 工程速成</p><p>${num} / 16</p></div>
</body></html>`;
}

const slides = [];

// S1 标题页
slides.push(`<!DOCTYPE html><html><head><style>${BASE}
body{background:${NAVY};}
.big{margin:78pt 60pt 0 60pt;}
.big h1{color:#ffffff;font-size:34pt;margin:0 0 8pt 0;}
.big h2{color:${AMBER_L};font-size:15pt;margin:0 0 18pt 0;font-weight:normal;}
.big p{color:#D5D8DC;font-size:12pt;margin:4pt 0;}
.tag{display:flex;margin:26pt 60pt 0 60pt;gap:10pt;}
.tagbox{background:${NAVY2};border:1px solid #46586B;border-radius:4pt;padding:6pt 12pt;}
.tagbox p{color:#ECF0F1;font-size:10pt;margin:0;}
.bar{background:${AMBER};height:5pt;width:90pt;margin:0 0 14pt 0;}</style></head><body>
<div class="big">
<h2>以教代学系列 · 工程范式速成 第 1 课</h2>
<div class="bar"></div>
<h1>Prompt 工程 30 分钟速成</h1>
<p>同一个模型，为什么别人问能办事，你问就翻车？</p>
<p>差的不是模型，是你写需求文档的手艺。</p>
</div>
<div class="tag">
<div class="tagbox"><p>时长：30 分钟</p></div>
<div class="tagbox"><p>受众：零基础 → 初级</p></div>
<div class="tagbox"><p>方法：费曼学习法 · 讲得出来才算学会</p></div>
</div>
</body></html>`);

// S2 定义
slides.push(page('第一幕 · 是什么', 'Prompt 工程：给 AI 写需求文档的手艺', `
<div class="cols">
<div class="col">
<div class="card accent-l">
<h3>一句话理解</h3>
<p>你怎么问，决定它怎么答。Prompt 工程就是设计输入指令、引导模型输出的方法论。</p>
</div>
<div class="card" style="margin-top:8pt;">
<h3>类比：刚入职的实习生</h3>
<ul>
<li>读过海量资料（预训练），但<b>不知道你的具体需求</b></li>
<li>需求越模糊，它自由发挥空间越大，翻车概率越高</li>
<li>好 Prompt = 一份让它<b>一次就做对</b>的需求文档</li>
</ul>
</div>
</div>
<div class="col">
<div class="card" style="background:${NAVY};">
<h3 style="color:${AMBER_L};">同一模型，不同命运</h3>
<p style="color:#ECF0F1;">代码生成："写个爬虫" vs 角色+约束+示例+边界</p>
<p style="color:${AMBER_L};">可用性差 3-5 倍</p>
<p style="color:#ECF0F1;">文本分类：给标签定义 + Few-shot + 输出格式</p>
<p style="color:${AMBER_L};">准确率差 10-30pp</p>
<p style="color:#ECF0F1;">而且：零训练成本、立刻见效、能用小模型省 Token</p>
</div>
</div>
</div>`, 2));

// S3 范式定位
slides.push(page('第一幕 · 是什么', '三代范式：包含关系，不是替代关系', `
<div class="cols">
<div class="col" style="flex:1.25;">
<div class="card" style="padding:14pt;">
<div style="background:#FDEBD0;border-radius:5pt;padding:8pt 10pt;border:1.5pt solid ${AMBER};">
<p style="margin:0;"><b>Harness 工程</b>（2025-26）· 如何安全可靠执行</p>
<div style="background:#D6EAF8;border-radius:5pt;padding:8pt 10pt;margin-top:6pt;border:1.5pt solid #2E86C1;">
<p style="margin:0;"><b>Context 工程</b>（2024-25）· 模型看到什么</p>
<div style="background:#FFFFFF;border-radius:5pt;padding:8pt 10pt;margin-top:6pt;border:1.5pt solid ${GRAY};">
<p style="margin:0;"><b>Prompt 工程</b>（2023）· 写什么指令 ← 本课</p>
</div>
</div>
</div>
</div>
</div>
<div class="col">
<div class="card ok">
<h3>关键结论</h3>
<ul>
<li>Prompt 是 Context 的子集（Anthropic 原话）</li>
<li>Context 是 Harness 的"上下文管理"支柱</li>
<li><b>没有过时</b>：Agent 系统里 System Prompt 仍是行为的 DNA</li>
<li>好 System Prompt = 任务成功率 <b>+5-15%</b></li>
</ul>
</div>
</div>
</div>`, 3));

// S4 七原则（表格用 placeholder）
slides.push(page('第二幕 · 原则', '指令设计七原则（一切技法的源头）', `
<div id="tbl" class="placeholder" style="width:664pt;height:286pt;"></div>`, 4));

// S5 差与好
slides.push(page('第二幕 · 原则', '案例：从"帮我总结"到生产级指令', `
<div class="cols">
<div class="col">
<div class="card warn">
<h3>差（违反原则 1/2/5）</h3>
<p style="font-family:'Courier New',monospace;font-size:10pt;">帮我总结这篇文章：<br/>&lt;粘贴的文章&gt;</p>
<p>问题：无角色、无量化、指令与数据混在一起。</p>
</div>
</div>
<div class="col">
<div class="card ok">
<h3>好（七原则齐备）</h3>
<p style="font-family:'Courier New',monospace;font-size:9.5pt;">你是技术编辑（角色）。总结文章（行动导向）：<br/>1. 3-5 个要点，每点 ≤30 字（量化）<br/>2. "结论+依据"结构（结构化）<br/>3. 信息不足要明说（边界防护）<br/>文章用 &lt;article&gt; 标签包裹（分隔符）</p>
</div>
</div>
</div>
<div class="card accent-l" style="margin-top:8pt;">
<p style="margin:2pt 0;">记忆钩子：<b>清晰、具体、行动、正向、分隔、迭代、边界</b> —— 写之前先过一遍这七个词。</p>
</div>`, 5));

// S6 Few-shot（表格 placeholder）
slides.push(page('第三幕 · 核心技法', 'Zero-shot 与 Few-shot：给不给示例？', `
<div id="tbl" class="placeholder" style="width:664pt;height:150pt;"></div>
<div class="card warn" style="margin-top:7pt;">
<h3>Few-shot 三个坑</h3>
<ul>
<li><b>标签分布不均</b> → 模型偏向多数类</li>
<li><b>示例顺序效应</b> → 靠后的示例权重更高，边界案例放后面</li>
<li><b>示例太理想</b> → 生产输入是脏数据，示例要覆盖真实分布</li>
</ul>
</div>`, 6));

// S7 CoT（表格 placeholder）
slides.push(page('第三幕 · 核心技法', 'CoT 思维链：先想后答', `
<div id="tbl" class="placeholder" style="width:664pt;height:140pt;"></div>
<div class="cols" style="margin-top:7pt;">
<div class="col">
<div class="card ok">
<h3>用法</h3>
<p style="font-family:'Courier New',monospace;font-size:9.5pt;">"请先一步步分析，最后用'答案：'开头给出结论。"<br/>—— 一句话提升数学/逻辑题正确率</p>
</div>
</div>
<div class="col">
<div class="card warn">
<h3>注意：推理模型反例</h3>
<p>o 系列、DeepSeek-R1 等<b>自带推理过程</b>，手动 CoT 提示可能适得其反——给目标和约束即可。</p>
</div>
</div>
</div>`, 7));

// S8 结构化输出（表格 placeholder）
slides.push(page('第三幕 · 核心技法', '结构化输出：生产系统的生死线', `
<div id="tbl" class="placeholder" style="width:664pt;height:196pt;"></div>
<div class="card accent-l" style="margin-top:7pt;">
<p style="margin:2pt 0;">原则：<b>输出格式必须有硬约束</b>。口头要求 JSON ≈ 没有约束——模型会加代码块、尾逗号、解释文字，解析即崩溃。</p>
</div>`, 8));

// S9 组装模板
slides.push(page('第四幕 · 工程化', '生产级 Prompt 的六模块组装', `
<div class="cols">
<div class="col" style="flex:1.15;">
<div class="card">
<h3>六模块模板</h3>
<ol>
<li><b>角色定义</b>（你是谁）</li>
<li><b>任务描述</b>（做什么）</li>
<li><b>约束条件</b>（边界与禁止项）</li>
<li><b>输入数据</b>（分隔符包裹）</li>
<li><b>输出格式</b>（Schema + 示例）</li>
<li><b>失败处理</b>（信息不足怎么办）</li>
</ol>
</div>
</div>
<div class="col">
<div class="card" style="background:${NAVY};">
<h3 style="color:${AMBER_L};">Agent 场景：按可缓存性分层</h3>
<p style="color:#ECF0F1;">静态模块（能力说明 / 领域知识）→ 放前面，吃<b>提示词缓存</b></p>
<p style="color:#ECF0F1;">动态模块（身份 / 当前会话）→ 放后面，每次重生成</p>
<p style="color:${AMBER_L};">缓存读取远便宜于重算：成本可降一个数量级</p>
</div>
</div>
</div>`, 9));

// S10 调试三步
slides.push(page('第五幕 · 调试', '输出不对？失败归因三步法', `
<div class="cols" style="align-items:stretch;">
<div class="col">
<div class="card" style="text-align:center;border-top:4pt solid ${AMBER};">
<h3>① 模型理解任务了吗？</h3>
<p>否 → <b>指令问题</b>：补角色 / 任务 / 约束</p>
</div>
</div>
<div class="col">
<div class="card" style="text-align:center;border-top:4pt solid #2E86C1;">
<h3>② 有足够信息吗？</h3>
<p>否 → <b>信息问题</b>：补 Few-shot / 上下文（进入 Context 工程）</p>
</div>
</div>
<div class="col">
<div class="card" style="text-align:center;border-top:4pt solid ${TEAL};">
<h3>③ 有能力做吗？</h3>
<p>否 → <b>能力问题</b>：换更强模型 / 拆任务</p>
</div>
</div>
</div>
<div class="card accent-l" style="margin-top:9pt;">
<h3>迭代闭环</h3>
<p style="margin:2pt 0;">建 10-30 个用例的测试集 → <b>单变量修改</b> → 全量回归 → Prompt 当代码管（Git + 版本号）。成本从低到高排查：先改 Prompt，再补信息，最后才换模型。</p>
</div>`, 10));

// S11 案例（表格 placeholder）
slides.push(page('第六幕 · 案例', '三轮迭代：工单抽取 65% → 95%', `
<div id="tbl" class="placeholder" style="width:664pt;height:210pt;"></div>
<div class="card ok" style="margin-top:6pt;">
<p style="margin:2pt 0;"><b>复盘</b>：V1→V2 解决"格式问题"（原则 2/5）；V2→V3 解决"判定标准问题"（原则 1/4 + Few-shot）。<b>每次只改一个维度，才能知道是哪个改动起了作用。</b></p>
</div>`, 11));

// S12 陷阱（表格 placeholder）
slides.push(page('第七幕 · 避坑', '八大常见陷阱', `
<div id="tbl" class="placeholder" style="width:664pt;height:292pt;"></div>`, 12));

// S13 升级信号
slides.push(page('第八幕 · 边界', '四个信号：该升级到 Context 工程了', `
<div class="cols">
<div class="col">
<div class="card accent-l"><p><b>知识量超过合理 Prompt 长度</b> → 需要 RAG 检索注入</p></div>
<div class="card accent-l" style="margin-top:7pt;"><p><b>多轮对话后"忘记"早期约定</b> → 需要记忆管理与上下文维护</p></div>
</div>
<div class="col">
<div class="card accent-l"><p><b>不同用户/会话要不同指令</b> → 需要动态 Prompt 组装管道</p></div>
<div class="card accent-l" style="margin-top:7pt;"><p><b>指令里塞满临时数据</b> → "指令"与"数据"该分层了</p></div>
</div>
</div>
<div class="card" style="margin-top:9pt;background:${NAVY};">
<p style="color:#ECF0F1;margin:2pt 0;">Context 工程关心"<b>模型每一步看到什么</b>"——系统提示、检索结果、工具输出、对话历史的整体编排。Prompt 工程是它的第一步，但不是全部。→ 下节课</p>
</div>`, 13));

// S14 费曼自检
slides.push(page('第九幕 · 自检', '费曼自检表：卡壳处就是补课素材', `
<div class="cols">
<div class="col">
<div class="card">
<ol>
<li>大白话解释 Prompt 工程（不含术语）</li>
<li>Zero-shot 和 Few-shot 怎么选？</li>
<li>CoT 为什么有效？何时不该用？</li>
<li>生产级 Prompt 六模块默写</li>
<li>输出不稳的排查顺序？</li>
</ol>
</div>
</div>
<div class="col">
<div class="card">
<ol start="6">
<li>举 3 个你踩过的坑 + 修复</li>
<li>Prompt 与 Context 的边界？</li>
<li>推理模型为何不手写 CoT？</li>
<li>案例 V2→V3 解决了什么？</li>
</ol>
</div>
</div>
</div>
<div class="card warn" style="margin-top:8pt;">
<p style="margin:2pt 0;"><b>实战作业</b>：挑一个你与 AI 对话常翻车的场景，用六模块模板重写 Prompt，在 ≥5 个真实输入上验证；再做一次三轮迭代并记录每轮解决了什么。</p>
</div>`, 14));

// S15 总结
slides.push(page('收尾', '三句话压缩全场', `
<div class="card accent-l"><h3>一</h3><p>Prompt 工程 = <b>给 AI 写需求文档的手艺</b>：清晰、具体、行动、正向、分隔、迭代、边界。</p></div>
<div class="card accent-l" style="margin-top:6pt;"><h3>二</h3><p>生产可用靠工程化：<b>六模块组装 + 测试集回归 + 版本管理</b>，Prompt 就是代码。</p></div>
<div class="card accent-l" style="margin-top:6pt;"><h3>三</h3><p>它是三代范式的第一层：<b>Prompt ⊂ Context ⊂ Harness</b>——指令写好了，下一课讲"模型每一步看到什么"。</p></div>
<div class="card" style="margin-top:6pt;background:${NAVY};">
<p style="color:${AMBER_L};margin:2pt 0;">下集预告：Context 工程 30 分钟速成 —— 注意力预算、上下文腐烂、Compaction 与 Offload。</p>
</div>`, 15));

// S16 结尾页
slides.push(`<!DOCTYPE html><html><head><style>${BASE}
body{background:${NAVY};justify-content:center;}
.end{margin:0 60pt;}
.end h1{color:#ffffff;font-size:30pt;margin:0 0 6pt 0;}
.end h2{color:${AMBER_L};font-size:14pt;margin:0 0 20pt 0;font-weight:normal;}
.bar{background:${AMBER};height:5pt;width:90pt;margin:0 0 22pt 0;}
.end p{color:#D5D8DC;font-size:11.5pt;margin:5pt 0;line-height:1.5;}
.qa{margin:26pt 60pt 0 60pt;}
.qa p{color:#ECF0F1;font-size:13pt;margin:0;}</style></head><body>
<div class="end">
<h2>以教代学系列 · 第 1 课</h2>
<div class="bar"></div>
<h1>讲得出来，才算学会</h1>
<p>底稿：90_学习/06_以教代学/01_Prompt_Engineering_Nutshell/Prompt_Engineering_in-nutshell.md</p>
<p>延伸阅读：Prompt 工程完整指南 · 模板与模式库 · 吴恩达原则 · Context 工程指南</p>
</div>
<div class="qa"><p>Q&amp;A ｜ 弹幕刷出你今天最想解决的一个 Prompt 翻车场景</p></div>
</body></html>`);

slides.forEach((html, i) => {
  fs.writeFileSync(path.join(__dirname, `slide${String(i + 1).padStart(2, '0')}.html`), html);
});
console.log(`生成 ${slides.length} 页 HTML`);
