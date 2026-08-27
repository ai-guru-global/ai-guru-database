// 将 16 页 HTML 转换为 PPTX，并为表格页注入 PptxGenJS 表格与讲者备注
const pptxgen = require('pptxgenjs');
const convertSlide = require('/Users/ai-guru/.qoder/skills/pptx/scripts/slideConverter.js');

const NAVY = '1C2833', ALT = 'F4F6F6', BORDER = 'D5D8DC', AMBER = 'E67E22';

const hdr = (cells) => cells.map((t) => ({ text: t, options: { fill: { color: NAVY }, color: 'FFFFFF', bold: true, align: 'center' } }));
const row = (cells) => cells.map((t, i) => ({ text: t, options: i === 0 ? { bold: true } : {} }));

const TBL = {
  s4: {
    colW: [1.5, 4.3, 3.4], fontSize: 10,
    rows: [
      hdr(['原则', '说明', '反例']),
      row(['清晰明确', '不留歧义，说清做什么、不做什么', '"写好一点"']),
      row(['具体细致', '量化要求：长度、格式、数量', '"详细一点"']),
      row(['行动导向', '动词开头描述任务', '"关于……的一些想法"']),
      row(['正向表述', '说"要什么"比"不要什么"更有效', '通篇"禁止/不要"']),
      row(['结构化分隔', '用分隔符隔离指令与数据', '指令和输入混在一起']),
      row(['迭代优化', '没有一次写对的 Prompt，只有测出来的', '写完就上线']),
      row(['边界防护', '预设越权/注入/拒答的处理方式', '完全信任用户输入']),
    ],
  },
  s6: {
    colW: [1.6, 3.7, 3.9], fontSize: 10.5,
    rows: [
      hdr(['技法', '做法', '适用场景']),
      row(['Zero-shot', '直接下指令，不给示例', '任务定义清晰、模型已擅长']),
      row(['One-shot', '给 1 个示例', '输出格式特殊']),
      row(['Few-shot', '给 2-8 个示例', '分类标准主观、格式严格']),
    ],
  },
  s7: {
    colW: [2.1, 3.5, 3.6], fontSize: 10.5,
    rows: [
      hdr(['变体', '触发方式', '特点']),
      row(['Manual CoT', '手写推理步骤示例', '可控但费力']),
      row(['Zero-shot CoT', '加一句"让我们一步步思考"', '零成本，效果中等']),
      row(['Self-Consistency', '采样多条推理链投票', '效果最好，成本最高']),
    ],
  },
  s8: {
    colW: [3.2, 1.4, 4.6], fontSize: 10.5,
    rows: [
      hdr(['手段', '可靠性', '说明']),
      row(['口头要求"输出 JSON"', '低', '可能加代码块、尾逗号、解释文字']),
      row(['JSON Schema 示例', '中', '配合 Few-shot 效果更好']),
      row(['API 层 JSON Mode', '高', '保证合法 JSON']),
      row(['约束解码（Outlines/Instructor）', '最高', '逐 Token 约束，语法上不可能出错']),
    ],
  },
  s11: {
    colW: [0.9, 4.9, 3.4], fontSize: 10,
    rows: [
      hdr(['版本', 'Prompt 要点', '问题 / 效果']),
      row(['V1', '"把用户报障信息整理成工单"', '格式随机、缺字段']),
      row(['V2', '+ JSON 字段定义（device/symptom/severity…）', 'severity 判断不稳定']),
      row(['V3', '+ 判定标准 + Few-shot + 兜底规则', '字段完整率 65%→95%；一致率 70%→95%']),
    ],
  },
  s12: {
    colW: [1.9, 3.4, 3.9], fontSize: 9.5,
    rows: [
      hdr(['陷阱', '症状', '修复']),
      row(['指令矛盾', '输出在两种行为间摇摆', '通读检查冲突规则']),
      row(['否定句滥用', '说"不要提 X"反而让它提 X', '改正向表述"只讨论 Y"']),
      row(['超长指令', '中间部分被忽略（Lost in the Middle）', '关键约束放开头和结尾']),
      row(['示例污染', 'Few-shot 示例带偏见/错误', '审查每个示例的标签']),
      row(['格式口头化', '要 JSON 却输出解释文字', '约束解码 / JSON Mode']),
      row(['提示注入', '用户输入劫持指令', '分隔符隔离 + 输出审查']),
      row(['过度工程', '数千 Token 效果平平', '删到最小可工作版本']),
      row(['不写测试集', '每次改动都是开盲盒', '先建 10 个用例再动手']),
    ],
  },
};

const NOTES = {
  1: '开场钩子：同一个模型，别人手里是生产级、你手里是玩具，差的不是模型是怎么问。自我介绍 + 以教代学宣言：讲得出来才算学会。互动：常翻车的扣 1，写得稳的扣 2。',
  2: '定义 + 实习生类比贯穿全场。强调零训练成本：不微调不换模型立刻见效；好 System Prompt 在 Agent 中量化为 +5-15% 成功率。',
  3: '重点讲"包含而非替代"：引用 Anthropic 原话"提示词工程是上下文工程的子集"。给听众定心丸：学 Prompt 不会过时。',
  4: '七原则逐条过，每条配反例。记忆钩子：清晰、具体、行动、正向、分隔、迭代、边界。互动：让弹幕各说一条自己违反过的原则。',
  5: '对照讲：差版违反原则 1/2/5，好版七原则齐备。强调分隔符：指令与数据分离是防注入的第一步。',
  6: 'Few-shot 三坑是高频翻车点：标签分布、顺序效应、示例太理想。建议现场演示一个标签不均导致偏类的例子。',
  7: 'CoT 三变体 + 成本权衡。必讲反例：推理模型自带推理过程，手写 CoT 反而干扰——这是 2026 年的常识更新点。',
  8: '生产系统生死线：解析崩溃大多源于格式无硬约束。推荐 Outlines/Instructor，指向知识库深入文档。',
  9: '六模块按顺序念一遍，强调第 6 条失败处理最常被遗漏。Agent 场景补充缓存分层：静态前置吃 Prompt Caching。',
  10: '排查顺序=成本顺序：先改 Prompt，再补信息，最后换模型。强调单变量修改 + 测试集回归，否则无法归因。',
  11: '案例是全场证据：65%→95%。复盘两句：V1→V2 格式问题、V2→V3 判定标准问题；每次只改一个维度。',
  12: '八大陷阱快过，重点讲"否定句滥用"和"提示注入"两个最反直觉的。互动：弹幕认领自己踩过的坑。',
  13: '四个升级信号逐条对号入座：满足两条就该学下节课。承上启下：Prompt 管"写什么"，Context 管"每一步看到什么"。',
  14: '以教代学惯例：现场随机抽 2 题让弹幕作答；自己下播后 10 分钟过一遍，卡壳条目 = 下期开场补课素材。',
  15: '三句话总结照念，重复记忆钩子。预告下集 Context 工程：注意力预算、上下文腐烂、Compaction。',
  16: '收尾互动：让弹幕刷最想解决的翻车场景，挑两条现场给思路。指引底稿路径与延伸阅读。',
};

async function build() {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9';
  pptx.title = 'Prompt 工程 30 分钟速成（以教代学系列 · 第 1 课）';
  pptx.author = 'AI Guru 知识库';

  for (let i = 1; i <= 16; i++) {
    const { slide, placeholders } = await convertSlide(`slide${String(i).padStart(2, '0')}.html`, pptx);
    const key = `s${i}`;
    if (TBL[key] && placeholders.length > 0) {
      const t = TBL[key], p = placeholders[0];
      slide.addTable(t.rows, {
        x: p.x, y: p.y, w: p.w, colW: t.colW, fontSize: t.fontSize,
        border: { pt: 0.75, color: BORDER }, align: 'left', valign: 'middle',
        fontFace: 'PingFang SC',
      });
    }
    if (NOTES[i]) slide.addNotes(NOTES[i]);
  }
  await pptx.writeFile({ fileName: '../Prompt_Engineering_课件.pptx' });
  console.log('PPTX 生成完成');
}

build().catch((e) => { console.error(e); process.exit(1); });
