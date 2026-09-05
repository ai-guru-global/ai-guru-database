#!/usr/bin/env python3
"""精确 wikilink 重映射工具（2026-09-04 断链批修 P2-6 配套）。

与 工具/check_wikilinks.py 的分类口径配套，只做一件事：
把「改名型断链」的 wikilink 目标按人工核实的映射表重写到真实存在的页面。

安全边界（区别于 smart_fix_links.py / batch_fix_links.py）：
1. 只重写 wikilink 语法本身，绝不触碰正文、代码块或行内代码；
2. 保留别名 / 锚点 / 表格转义（\\|）原样；
3. 扫描范围与 check_wikilinks.py 完全一致（跳过 code/release/前端应用 等）；
4. 所有文件访问经由 Path.relative_to(ROOT) 容器校验，越界即中止；
5. 映射键为归一化后的 wikilink 目标文本（相对前缀在 lookup 中按段剥离，
   只做字符串查表，从不参与文件路径构造）；
6. 映射值禁止包含父级目录段，且逐一验证存在，缺失即中止；
7. 默认 dry-run，--apply 才写盘。

用法：python3 工具/fix_wikilinks_precise.py [--apply]
"""
import os
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PARENT_SEG = '..'
CURRENT_SEG = '.'

# 与 check_wikilinks.py 保持一致的扫描边界
ALWAYS_SKIP = {'.git', '.obsidian', '.qoder', '.claude', '.githooks', '.github',
               'node_modules', 'release'}
ROOT_ONLY_SKIP = {'前端应用', '原始', '来源', '归档', 'docs', 'code', '工具'}
SKIP_FILES = {'治理/_meta/_evaluation-2026-07-27.md',
              '治理/_meta/_evaluation-2026-06-24.md',
              '治理/_meta/_evaluation-2026-09-04.md',
              '治理/_project-evaluation.md',
              '治理/Project_Structure_Evaluation_2026.md'}
WIKILINK = re.compile(r'\[\[([^\]]+?)\]\]')

# 人工核实的目标映射（旧断链 target → 真实存在的新 target，均相对库根、无 .md 后缀）
# 来源：2026-09-04 断链批修逐条核实（见 治理/log.md 当日条目）
MAPPING = {
    # ---- 归一化同名：章节页 → 概念卡 ----
    '02_机器学习/04_集成学习/Ensemble_Learning': '概念/Math/ensemble-learning',
    '02_机器学习/02_监督学习/Supervised_Learning': '概念/Math/supervised-learning',
    '02_机器学习/03_无监督学习/Unsupervised_Learning': '概念/Math/unsupervised-learning',
    '08_模型评估/04_评估工具/Online_Evaluation': '概念/General/online-evaluation',
    '02_机器学习/10_推荐系统/Recommendation_Systems': '概念/Math/recommendation-systems',
    '04_计算机视觉/05_三维视觉/3D_Vision': '概念/Vision/3d-vision',
    '3D_Vision': '概念/Vision/3d-vision',
    '17_伦理安全/10_隐私保护AI/Privacy_Preserving_AI': '概念/Safety/privacy-preserving-ai',
    '02_机器学习/09_时间序列/Time_Series_Analysis': '概念/Math/time-series-analysis',
    '00_入门/02_技术概览/AI_Technology_Landscape': '概念/General/ai-technology-landscape',
    '02_线性代数/Linear_Algebra': '概念/Math/linear-algebra',
    '03_概率统计/Probability_Statistics': '概念/Math/probability-statistics',
    '09_分布式系统/Distributed_Systems': '概念/Training/distributed-systems',
    # ---- 批量改名受害者：链接 → 改名后的真实文件 ----
    '05_大模型/04_LLM架构/MoE_Case_Studies_DeepSeek_Mixtral':
        '05_大模型/04_LLM架构/12_MoE_Case_Studies_DeepSeek_Mixtral',
    '15_智能体/05_Agent技能/Tool_Calling_Best_Practices':
        '15_智能体/05_Agent技能/14_工具调用_最佳实践',
    '14_RAG系统/04_高级RAG/RAG_Retrieval_Latency_Optimization':
        '14_RAG系统/04_高级RAG/14_RAG_检索_延迟_优化',
    '11_模型运维/08_可观测性/Model_Monitoring_and_Drift_Detection_2026':
        '11_模型运维/08_可观测性/13_模型_监控_and_Drift_检测_2026',
    '12_架构基建/AI_Stack_Production_Toolchain':
        '12_架构基建/03_AI技术栈/09_AI技术栈_生产_工具链',
    '12_架构基建/AI_Stack_Container_Runtime_Guide':
        '12_架构基建/03_AI技术栈/01_AI技术栈_容器_Runtime_指南',
    '11_模型运维/04_实验追踪/Experiment_Tracking_Deep_Dive':
        '11_模型运维/04_实验追踪/02_实验追踪_深入分析',
    '01_数学基础/Python_Data_Science_Toolkit':
        '01_数学基础/08_Python工具包/05_Python_数据_Science_工具kit',
    '07_模型训练/06_对齐研究/GRPO_and_New_Alignment_Methods':
        '07_模型训练/06_对齐训练/02_GRPO_and_新型_对齐_Methods',
    '06_强化学习/AI_Agents/Agent-in-nutshell':
        '15_智能体/01_Agent基础/11_Agent_简明指南',
    '05_大模型/07_提示工程/GenAI_L04_Prompt_Engineering_Fundamentals':
        '05_大模型/07_提示工程/04_GenAI_第4课_Prompt工程_基础',
    # ---- 同义页归并 / 章节入口 ----
    'AI_Governance_Compliance_2026': '17_伦理安全/03_AI治理/01_AI治理合规2026',
    'China_AI_Regulations_2026': '17_伦理安全/03_AI治理/04_China_AI_监管_2026',
    'AI_Regulatory_Engineering_2026': '17_伦理安全/03_AI治理/03_AI监管工程2026',
    'EU_AI_Act_Implementation_2026': '17_伦理安全/03_AI治理/05_EU_AI_Act_实现_2026',
    'High_Availability_2026': '12_架构基建/02_架构概览/06_高可用_2026',
    'Hybrid_Multi_Cloud_AI': '12_架构基建/02_架构概览/07_混合_Multi_云_AI',
    '21_面试岗位/Research_Scientist/Research_Scientist': '21_面试岗位/24_研究科学家/README',
    '21_面试岗位/AI_Research_Scientist/AI_Research_Scientist': '21_面试岗位/09_AI研究科学家/README',
    '21_面试岗位/AI_Research_Engineer/AI_Research_Engineer': '21_面试岗位/08_AI研究工程师/README',
    '05_大模型/07_提示工程/Prompt_Engineering_Principles_Ng':
        '05_大模型/07_提示工程/14_Prompt工程_原则_Ng',
    '94_可视化/Training_Viz/Experiment_Tracking_Visualization':
        '94_可视化/02_训练可视化/03_实验追踪_可视化',
    '07_模型训练/03_训练优化/Scaling_Laws_and_Training_Dynamics':
        '07_模型训练/03_训练优化/06_扩展定律_and_训练_Dynamics',
    '07_模型训练/02_数据工程/Data_Curation_and_Mixture_2026':
        '07_模型训练/02_数据工程/04_数据_Curation_and_Mixture_2026',
    '17_伦理安全/04_AI安全与红队/Safety_Evaluation_Framework':
        '17_伦理安全/04_AI安全与红队/05_安全评估_框架',
    '17_伦理安全/04_AI安全与红队/AI_Safety_RedTeaming':
        '17_伦理安全/04_AI安全与红队/02_AI安全_RedTeaming',
    '治理/safety-evaluation-red-teaming':
        '17_伦理安全/04_AI安全与红队/06_safety_evaluation_red_teaming',
    '11_模型运维/LLM_Guardrails_and_Safety_Ops_2026':
        '17_伦理安全/04_AI安全与红队/03_Guardrails_生产_指南',
    '_projects/Cloud_Ops_Agent/CloudOps-in-nutshell':
        '11_模型运维/14_云运维Agent/02_云Ops_简明指南',
    '_projects/Cloud_Ops_Agent/Cloud_Product_Ops_for_dummy':
        '11_模型运维/14_云运维Agent/01_云_产品_Ops_2026',
    '05_大模型/Transformer_Deep_Dive':
        '05_大模型/03_Transformer架构/04_Transformer_架构详解',
    '01_数学基础/Math_Foundations': '01_数学基础/README',
    '10_部署推理/Deployment_Inference': '10_部署推理/README',
    '21_面试岗位/Applied_Scientist/Applied_Scientist': '21_面试岗位/13_应用科学家/README',
    '00_入门/AI_Learning_Resources': '00_入门/03_学习路径/02_AI学习资源',
    # ---- 专题指南改名对应 ----
    'Contamination_Detection_Guide': '08_模型评估/02_基准测试/04_Contamination_检测_指南',
    'GPU_OOM_Troubleshooting_Guide': '13_运维/02_SRE与可靠性/11_GPU_OOM_故障排查_指南',
    'Kubernetes_Troubleshooting_Playbook': '13_运维/04_问题排查/07_Kubernetes_故障排查_Playbook',
    'Multi_Agent_RL': '06_强化学习/06_多智能体/02_多智能体强化学习',
    'Training_Monitoring_Visualization': '94_可视化/02_训练可视化/07_训练_监控_可视化',
}


def resolve_under_root(rel: str) -> Path:
    """解析库根相对路径；relative_to 容器校验，越界抛 ValueError。"""
    path = (ROOT / rel).resolve()
    path.relative_to(ROOT)
    return path


def normalize_target(target: str) -> str:
    """wikilink 目标文本归一化：剥离开头的父级/当前段（仅字符串查表用）。"""
    parts = target.split('/')
    while parts and parts[0] in ('', CURRENT_SEG, PARENT_SEG):
        parts.pop(0)
    return '/'.join(parts)


def lookup(target: str):
    """依次精确匹配 → 剥离相对前缀匹配 → basename 匹配（仅用于已断链的目标）。"""
    if target in MAPPING:
        return MAPPING[target]
    t = normalize_target(target)
    if t in MAPPING:
        return MAPPING[t]
    return BASENAME_MAP.get(os.path.basename(t).lower())


def build_resolution_sets():
    """与 check_wikilinks.py 同口径的可解析集合：全路径 stem + basename。

    用于保护已能解析的链接不被误改——basename 回退只对断链生效。
    """
    stems, bases = set(), set()
    for dp, dns, fns in os.walk(ROOT):
        dns[:] = [d for d in dns if d not in ALWAYS_SKIP]
        for f in fns:
            if f.endswith('.md'):
                rel = Path(dp, f).relative_to(ROOT).as_posix()
                stems.add(rel[:-3])
                bases.add(os.path.basename(rel[:-3]).lower())
    return stems, bases


BASENAME_MAP = {os.path.basename(k).lower(): v for k, v in MAPPING.items()}


def split_wikilink(inner: str):
    """拆出 (目标, 锚点, 别名原文)，别名含表格转义 \\| 时原样保留。"""
    alias = ''
    for i, ch in enumerate(inner):
        if ch == '|' and (i == 0 or inner[i - 1] != '\\'):
            alias = inner[i:]
            inner = inner[:i]
            break
    anchor = ''
    if '#' in inner:
        inner, anchor = inner.split('#', 1)
        anchor = '#' + anchor
    return inner, anchor, alias


def collect_scan_files():
    files = []
    for dp, dns, fns in os.walk(ROOT):
        rel_dp = Path(dp).relative_to(ROOT)
        dns[:] = [d for d in dns if d not in ALWAYS_SKIP]
        top = rel_dp.parts[0] if rel_dp.parts else '.'
        if top in ROOT_ONLY_SKIP:
            continue
        for f in fns:
            if f.endswith('.md'):
                rel = str(rel_dp / f) if str(rel_dp) != '.' else f
                if rel not in SKIP_FILES:
                    files.append(rel)
    return files


def main():
    apply = '--apply' in sys.argv

    # 前置校验 1：映射值不得包含父级目录段
    for k, v in MAPPING.items():
        if PARENT_SEG in v.split('/'):
            print(f'❌ 映射值含越级路径段，中止: {k} => {v}')
            sys.exit(2)

    # 前置校验 2：所有映射目标必须真实存在（经容器校验），否则中止
    try:
        missing = [v for v in MAPPING.values()
                   if not (p := resolve_under_root(v + '.md')).exists()
                   and not p.with_suffix('').exists()]
    except ValueError as e:
        print(f'❌ {e}')
        sys.exit(2)
    if missing:
        print('❌ 以下映射目标不存在，中止：')
        for m in missing:
            print(f'   {m}')
        sys.exit(2)

    rewrites = {}   # rel_path -> [(old_inner, new_inner), ...]
    counts = {}
    resolvable_stems, resolvable_bases = build_resolution_sets()
    for rel in collect_scan_files():
        path = resolve_under_root(rel)
        text = path.read_text(encoding='utf-8', errors='ignore')

        def _sub(m):
            inner = m.group(1)
            tgt, anchor, alias = split_wikilink(inner)
            # 保护已可解析的链接：全路径或 basename 命中即不动
            if (tgt in resolvable_stems
                    or os.path.basename(tgt).lower() in resolvable_bases):
                return m.group(0)
            new_tgt = lookup(tgt)
            if not new_tgt:
                return m.group(0)
            new_inner = new_tgt + anchor + alias
            if new_inner != inner:
                rewrites.setdefault(rel, []).append((inner, new_inner))
                counts[tgt] = counts.get(tgt, 0) + 1
                return '[[' + new_inner + ']]'
            return m.group(0)

        new_text = WIKILINK.sub(_sub, text)
        if new_text != text and apply:
            path.write_text(new_text, encoding='utf-8')

    total = sum(counts.values())
    mode = '已应用' if apply else 'DRY-RUN（加 --apply 写盘）'
    print(f'{mode}：重写 {total} 处 wikilink，涉及 {len(rewrites)} 个文件，'
          f'覆盖 {len(counts)} 个旧目标')
    for tgt, c in sorted(counts.items(), key=lambda x: -x[1])[:20]:
        print(f'  {c:>3}x  {tgt}  =>  {lookup(tgt)}')
    if not apply and total:
        print('\n确认无误后执行：python3 工具/fix_wikilinks_precise.py --apply')


if __name__ == '__main__':
    main()
