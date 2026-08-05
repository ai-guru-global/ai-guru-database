#!/usr/bin/env python3
"""断链批量修复脚本（2026-07 评估 P0-1/P0-3/P1-6 落地）。

输入：工具/check_wikilinks.py --json 产出的断链清单。
策略：手工映射表 → 相对路径按源文件解析 → basename 归一化唯一匹配 → 目录唯一匹配。
未解析目标打印出来供人工处理。
"""
import json
import os
import re
import sys
from collections import defaultdict

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SKIP_DIRS = {'.git', '.obsidian', '.qoder', '.claude', '.githooks', '.github',
             'node_modules', '前端应用', '原始', '来源', '归档', 'release',
             'docs', 'code', '工具'}
# 历史评估报告是快照，不改写其中示例
SKIP_FILES = {'治理/_meta/_evaluation-2026-07-27.md',
              '治理/_meta/_evaluation-2026-06-24.md',
              '治理/_project-evaluation.md',
              '治理/Project_Structure_Evaluation_2026.md'}

MANUAL = {
 # ---- 17_伦理安全 / 中文裸名 (P0-1) ----
 '中国AI治理法规': '17_伦理安全/03_Governance/China_AI_Regulations_2026',
 'AI治理与合规2026': '17_伦理安全/03_Governance/AI_Governance_Compliance_2026',
 'AI伦理基础': '17_伦理安全/01_Ethics_Fundamentals/AI_Ethics_Safety_Future',
 '算法偏见与公平性': '17_伦理安全/01_Ethics_Fundamentals/Bias_Fairness_Testing',
 'AI安全红队测试': '17_伦理安全/04_AI_Safety_RedTeaming/AI_Red_Teaming_Guide',
 '联邦学习': '17_伦理安全/11_Federated_Learning/Federated_Learning_Deep_Dive',
 '可解释AI': '概念/Safety/explainable-ai',
 'AI版权与知识产权': '17_伦理安全/01_Ethics_Fundamentals/AI_Copyright_IP_2026',
 '深度伪造安全': '17_伦理安全/09_Deepfake_Security/Deepfake_Security',
 '自主武器AI伦理': '17_伦理安全/01_Ethics_Fundamentals/Autonomous_Weapons_AI_Ethics',
 'EU AI Act实施指南': '17_伦理安全/03_Governance/EU_AI_Act_Implementation_2026',
 'GDPR': '概念/Safety/privacy-preserving-ai',
 'NIST AI RMF': '概念/Safety/ai-risk-assessment',
 '价值对齐': '17_伦理安全/02_Value_Alignment/Value_Alignment',
 '大模型安全权威指南': '17_伦理安全/06_Security/LLM_Security_Complete_Guide',
 # ---- 概念 remap（同义卡已存在或本轮新建）----
 '概念/rag': '概念/RAG/rag-systems',
 '概念/moe': '概念/General/mixture-of-experts',
 '概念/LLM/moe': '概念/General/mixture-of-experts',
 '概念/LLM/lora': '概念/Training/lora-peft',
 '概念/lora': '概念/Training/lora-peft',
 '概念/embedding': '概念/RAG/embedding-models',
 '概念/llm-pretraining': '概念/Training/pre-training',
 '概念/Agent/agent-frameworks': '概念/Agent/agent-framework',
 '概念/Inference/model-quantization': '概念/Inference/quantization',
 '概念/transformer': '概念/LLM/transformer-architecture',
 '概念/RAG/rag-architecture': '概念/RAG/rag-production-architecture',
 '概念/qwen': '概念/LLM/qwen-series',
 '概念/LLM/fine-tuning': '概念/Training/fine-tuning-techniques',
 '概念/Training/fine-tuning': '概念/Training/fine-tuning-techniques',
 '概念/12_架构基建/DevOps': '概念/MLOps/ci-cd',
 '概念/MLOps/monitoring': '概念/MLOps/observability',
 '概念/multimodal-ai': '概念/LLM/multimodal-llm',
 '概念/Python': '01_数学基础/08_Python_Toolkit/index',
 '概念/reasoning': '概念/LLM/reasoning-models',
 '概念/speech-recognition': '概念/General/speech-audio-ai',
 '概念/data-engineering': '概念/LLM/llm-data-engineering',
 '概念/pydantic': '概念/LLM/structured-output',
 '概念/ai-search': '概念/RAG/hybrid-search',
 '概念/gb200': '概念/GPU/nvidia-gpu',
 '概念/llm-compression': '概念/Training/model-compression',
 '概念/linear-attention': '概念/LLM/attention-variants',
 '概念/state-space-model': '概念/LLM/state-space-models',
 '概念/chain-of-thought': '概念/LLM/cot-react-reasoning-prompt',
 '概念/slm': '概念/LLM/small-language-models',
 '概念/distillation': '概念/Training/knowledge-distillation',
 '概念/Training/Distributed_Training': '概念/Training/distributed-training',
 '概念/model-weights': '概念/Inference/model-formats',
 '概念/pagedattention': '概念/LLM/paged-attention',
 '概念/llm-gateway': '概念/Inference/model-gateway',
 '概念/canary-deployment': '概念/MLOps/argo-rollouts',
 '概念/llamafactory': '概念/Training/llama-factory',
 '概念/zero-trust': '概念/Safety/zero-trust',
 '概念/raft': '概念/Training/distributed-systems',
 '概念/paxos': '概念/Training/distributed-systems',
 '概念/deepseek-r1': '概念/LLM/deepseek-series',
 '概念/data-augmentation': '概念/Training/synthetic-data',
 '概念/mmlu': '概念/LLM/llm-benchmarks',
 '概念/gsm8k': '概念/LLM/llm-benchmarks',
 '概念/long-context': '概念/LLM/long-context-llm',
 '概念/hpa': '概念/K8s/horizontal-pod-autoscaler',
 '概念/Safety/adversarial-attacks': '概念/Safety/adversarial-attack',
 '概念/multi-modal-agent': '概念/Agent/ai-agents',
 '概念/realtime-api': '概念/Agent/voice-agent',
 '概念/pipecat': '概念/Agent/voice-agent',
 '概念/swe-bench': '概念/LLM/agent-benchmarks',
 '概念/sora': '概念/Vision/video-generation',
 '概念/video-llm': '概念/LLM/multimodal-llm',
 '概念/Agent/agent-architecture': '概念/Agent/agent-architectures',
 '概念/agent-architectures': '概念/Agent/agent-architectures',
 '概念/redis': '概念/RAG/storage',
 '概念/cognee': '概念/Agent/agent-memory-systems',
 '概念/parallel-decoding': '概念/LLM/speculative-decoding',
 '概念/llm-inference': '概念/Inference/model-inference',
 '概念/structured-output': '概念/LLM/structured-output',
 '概念/embodied-ai': '概念/General/embodied-ai',
 '概念/Training/training-optimization': '概念/Training/training-optimization',
 '概念/zero-redundancy-optimizers': '概念/Training/zero-redundancy-optimizer',
 '概念/imitation-learning': '概念/General/imitation-learning',
 '概念/vla': '概念/General/vla',
 '概念/knowledge-graph': '概念/RAG/knowledge-graph',
 '概念/bge-m3': '概念/RAG/bge-m3',
 '概念/Training/policy-gradient': '概念/Training/policy-gradient',
 '概念/Training/gae': '概念/Training/gae',
 '概念/Training/experience-replay': '概念/Training/experience-replay',
 '概念/Training/target-network': '概念/Training/target-network',
 '概念/General/q-learning': '概念/General/q-learning',
 '概念/GPU/sram-vs-hbm': '概念/GPU/advanced-attention-kernels',
 '概念/Training/kernel-fusion': '概念/GPU/cuda-graph',
 '概念/MLOps/ab-testing': '概念/MLOps/ab-testing',
 # ---- 工具/基础设施 ----
 '工具/Playwright': '16_编程/05_Tools/index',
 '工具/Copilot': '16_编程/05_Tools/github-copilot_overview',
 '工具/Cursor': '16_编程/05_Tools/Cursor_Guide',
 # ---- 旧路径高频 (P0-3) ----
 '06_强化学习/RL_Fundamentals': '06_强化学习/01_RL_Foundations/RL_Foundations',
 '10_部署推理/Model_Compression/': '10_部署推理/03_Inference_Optimization/Model_Compression',
 '14_RAG系统/03_Vector_Databases/Vector_Databases': '14_RAG系统/03_Vector_Databases/rag-vector-database',
 '06_强化学习/03_RLHF_Alignment/RLHF_Alignment': '06_强化学习/03_RLHF_Alignment/RLHF_DPO_GRPO_Deep_Dive',
 # ---- Round-2 旧路径/相对路径（2026-07-27 逐一核实真实归宿）----
 '01_数学基础/GPU_Programming/': '01_数学基础/10_AI_Hardware/GPU_Programming_CUDA_Basics',
 '01_数学基础/GPU_Programming/CUDA_Basics': '01_数学基础/10_AI_Hardware/GPU_Programming_CUDA_Basics',
 'GPU_Programming/CUDA_Basics': '01_数学基础/10_AI_Hardware/GPU_Programming_CUDA_Basics',
 '03_深度学习/Knowledge_Distillation/': '03_深度学习/09_Advanced_Topics/Knowledge_Distillation',
 '03_深度学习/Neural_Architecture_Search/': '03_深度学习/09_Advanced_Topics/Neural_Architecture_Search',
 '02_机器学习/Online_Learning/': '02_机器学习/13_Learning_Paradigms/Online_Learning',
 '14_RAG系统/Hybrid_Search/': '14_RAG系统/04_Advanced_RAG/Hybrid_Search',
 '07_模型训练/Curriculum_Learning/': '07_模型训练/02_Data/Curriculum_Learning',
 '16_编程/Code_Review_AI/': '16_编程/04_Practice/Code_Review_AI_2026',
 '16_编程/Testing_with_AI/': '09_测试/index',
 '../13_运维/04_Troubleshooting/K8s_Troubleshooting_Playbook': '13_运维/04_Troubleshooting/Kubernetes_Troubleshooting_Playbook',
 '../02_Architecture_Overview/System_Architecture': '12_架构基建/02_Architecture_Overview/AI_System_Architecture_2026',
 '../07_模型训练/06_Alignment/GRPO_Deep_Dive': '07_模型训练/06_Alignment/GRPO_and_New_Alignment_Methods',
 '../../08_模型评估/Human_Evaluation': '08_模型评估/01_Evaluation_Fundamentals/Human_Evaluation_Deep_Dive',
 '../../08_模型评估/Fairness': '08_模型评估/06_Safety_Evaluation/Fairness_Evaluation_for_dummy',
 '08_模型评估/Fairness': '08_模型评估/06_Safety_Evaluation/Fairness_Evaluation_for_dummy',
 '08_模型评估/Red_Team_Evaluation': '08_模型评估/06_Safety_Evaluation/Red_Team_Evaluation_Guide',
 '08_模型评估/Benchmark_Comparison': '08_模型评估/02_Benchmarks/Unified_Benchmark_Comparison',
 '08_模型评估/Benchmark_Deep_Dive': '08_模型评估/02_Benchmarks/index',
 '08_模型评估/Agent_Evaluation/': '08_模型评估/03_LLM_Evaluation/Agent_Evaluation',
 '../03_LLM_Evaluation/Agent_Evaluation_Framework': '08_模型评估/03_LLM_Evaluation/Agent_Evaluation',
 '../08_模型评估/RAG_Evaluation': '08_模型评估/03_LLM_Evaluation/RAG_Evaluation_Deep_Dive',
 '08_模型评估/Evaluation_Datasets/': '08_模型评估/02_Benchmarks/index',
 '10_部署推理/Cost/': '10_部署推理/06_成本管理/index',
 '../../10_部署推理/Cost': '10_部署推理/06_成本管理/index',
 '13_运维/02_SRE_Reliability/SRE_Reliability': '13_运维/02_SRE_Reliability/index',
 '05_大模型/RAG_Frameworks/RAG_Frameworks': '14_RAG系统/06_RAG_Frameworks/index',
 '14_RAG系统/06_RAG_Frameworks/RAG_Frameworks': '14_RAG系统/06_RAG_Frameworks/index',
 'RAG_Frameworks': '14_RAG系统/06_RAG_Frameworks/index',
 '20_论文精读/Paper_Reading_Guide': '20_论文精读/01_Research_Guide/Paper_Reading_and_Reproduction_Guide',
 '20_论文精读/Multimodal/': '20_论文精读/08_Vision/index',
 '06_强化学习/Sim_to_Real/Sim_to_Real': '06_强化学习/05_Robotics_Embodied_AI/Sim_to_Real_Transfer_Guide',
 '治理/plan/Implementation_Plan_2026': '治理/plan/index',
 '05_大模型/Meta': '05_大模型/14_Global_LLM_Ecosystem/Meta_LLaMA_Deep_Dive',
 '05_大模型/GPT': '05_大模型/14_Global_LLM_Ecosystem/OpenAI_Deep_Dive',
 '05_大模型/GPT-4o': '05_大模型/14_Global_LLM_Ecosystem/OpenAI_Deep_Dive',
 '05_大模型/xAI': '05_大模型/14_Global_LLM_Ecosystem/index',
 '05_大模型/Architecture_Evolution/': '05_大模型/05_LLM_Architectures/index',
 '05_大模型/Test_Time_Compute/': '概念/LLM/test-time-compute',
 '05_大模型/LLM_Inference/': '10_部署推理/02_推理引擎/index',
 '05_大模型/LLM_Training/': '07_模型训练/index',
 '../../05_大模型/LLM_Training': '07_模型训练/index',
 '05_大模型/08_Prompt_Engineering/Prompt_Engineering_Guide_2026': '05_大模型/08_Prompt_Engineering/Prompt_Engineering_Complete_Guide',
 '10_部署推理/05_Quantization/GPTQ_AWQ_Comparison_2026': '10_部署推理/05_Quantization/Quantization_Techniques_2026',
 '10_部署推理/05_Quantization/ExLlamaV2_Deep_Dive': '概念/LLM/exllama',
 '10_部署推理/04_Inference_Performance/LLM_Inference_Cost_Optimization_2026': '10_部署推理/06_成本管理/LLM_Cost_Optimization',
 '05_大模型/Open_Source_LLM/Llama_Family_Complete_Guide': '概念/LLM/llama-series',
 '../01_Ethics_Fundamentals/AI_Ethics_And_Future': '17_伦理安全/01_Ethics_Fundamentals/AI_Ethics_Safety_Future',
 '17_伦理安全/Guardrails/Guardrails_2026': '概念/Safety/guardrails',
 '15_智能体/Agent_Protocols/MCP_Deep_Dive': '概念/Agent/mcp',
 '04_计算机视觉/VLM': '04_计算机视觉/08_Multimodal_Vision/index',
 '00_入门/AI_Tools_Landscape/': '00_入门/02_Technology_Overview/index',
 '09_测试/CI_CD_for_ML/': '11_模型运维/06_CI_CD/index',
 '13_运维/GPU_Monitoring': '13_运维/06_Observability/index',
 '12_架构基建/GPU_Cluster_Management': '12_架构基建/07_Hardware_Compute/index',
 '07_模型训练/03_Optimization/Optimizer_Advanced': '07_模型训练/03_Optimization/index',
 '07_模型训练/03_Optimization/Scaling_Laws': '概念/LLM/chinchilla-scaling-laws',
 '07_模型训练/07_Monitoring/Training_Troubleshooting_Runbook': '07_模型训练/07_Monitoring/index',
 # ---- Round-2 裸名称有真实归宿者 ----
 'HAMi_Troubleshooting_Cuide': '13_运维/02_SRE_Reliability/HAMi_Troubleshooting_Guide',
 '14_AI_Gateway': '12_架构基建/11_AI_Gateway/index',
 '20_Papers': '20_论文精读/index',
 'LLM_Evaluation': '08_模型评估/03_LLM_Evaluation/index',
 'Advanced_RAG': '14_RAG系统/04_Advanced_RAG/index',
 'FlashAttention': '概念/LLM/flash-attention-kernels',
 'Multi_Agent_System': '概念/Agent/multi-agent',
 'Differential_Privacy': '概念/Safety/privacy-preserving-ai',
 'Chain_of_Thought': '概念/LLM/cot-react-reasoning-prompt',
 'Scaling_Laws': '概念/LLM/chinchilla-scaling-laws',
 'Model_Quantization': '概念/Inference/quantization',
 'Fine_tuning': '概念/Training/fine-tuning-techniques',
 'Parameter_Efficient_Fine_Tuning': '概念/Training/lora-peft',
 'Prompt_Injection': '概念/Safety/prompt-injection',
 'Adversarial_Attacks': '概念/Safety/adversarial-attack',
 'Alignment': '07_模型训练/06_Alignment/index',
 'A/B_Testing': '概念/MLOps/ab-testing',
 '应用/AI_Healthcare': '18_行业应用/03_Healthcare/AI_Healthcare_2026',
 '应用/AI_Education': '18_行业应用/05_Education/AI_Education_2026',
 '应用/AI_Search': '05_大模型/13_LLM_Products/perplexity_overview',
 '应用/AI_Enterprise': '18_行业应用/01_Industry_Overview/index',
 '应用/Generative_AI': '00_入门/02_Technology_Overview/index',
}

# 显示名覆盖（默认用旧目标 basename，个别目标 basename 不可读）
DISPLAY = {
 'A/B_Testing': 'A/B 测试',
}

# 无真实归宿的目标：去链接化（[[X]] -> 纯文本）；
# 另外 bare_name 类未解析目标也会自动回退到去链接化
UNLINK = {
 '10_部署推理/Stargate', '16_编程/Tree_sitter', '前端应用/Realtime_WebApps',
}

# 本轮新建概念卡（运行前需先创建；列入索引以便映射校验通过）
NEW_CARDS = [
 '概念/LLM/structured-output', '概念/LLM/small-language-models',
 '概念/Agent/agent-architectures', '概念/General/embodied-ai', '概念/General/vla',
 '概念/General/imitation-learning', '概念/General/q-learning',
 '概念/Training/training-optimization', '概念/Training/zero-redundancy-optimizer',
 '概念/Training/llama-factory', '概念/Training/policy-gradient', '概念/Training/gae',
 '概念/Training/experience-replay', '概念/Training/target-network',
 '概念/RAG/knowledge-graph', '概念/RAG/bge-m3', '概念/Safety/zero-trust',
 '概念/MLOps/ab-testing',
]


def collect():
    """构建候选目标索引：排除语料/基建目录（映射只指向策展内容）；
    docs 只跳根级，子目录如 Cloud_Ops_Agent/docs/ 照常收录。"""
    always_skip = {'.git', '.obsidian', '.qoder', '.claude', '.githooks',
                   '.github', 'node_modules', 'release'}
    root_only = {'前端应用', '原始', '来源', '归档', 'docs', 'code', '工具'}
    mds, dirs = [], set()
    for dp, dns, fns in os.walk(ROOT):
        rel_dp = os.path.relpath(dp, ROOT)
        if rel_dp == '.':
            dns[:] = [d for d in dns if d not in always_skip and d not in root_only]
        else:
            dns[:] = [d for d in dns if d not in always_skip]
            dirs.add(rel_dp)
        for f in fns:
            if f.endswith('.md'):
                mds.append(os.path.normpath(os.path.join(rel_dp, f)) if rel_dp != '.' else f)
    return mds, dirs


def main():
    broken_json = sys.argv[1] if len(sys.argv) > 1 else '/tmp/broken3.json'
    mds, dirs = collect()
    rel_index = {m[:-3] for m in mds}
    rel_index.update(NEW_CARDS)
    norm_index = defaultdict(set)
    for p in rel_index:
        norm_index[os.path.basename(p).lower().replace('-', '_')].add(p)

    data = json.load(open(broken_json))
    resolve = {}                      # old_target -> new_target（全局）
    per_source = defaultdict(dict)    # source -> {old: new}（相对路径按源解析）
    unlink = set(UNLINK)              # 去链接化目标
    unresolved = []

    for b in data['broken']:
        src, tgt, cat = b['source'], b['target'], b['category']
        if src in SKIP_FILES:
            continue
        if tgt in resolve or tgt in unlink or tgt in per_source.get(src, {}):
            continue
        if tgt in MANUAL:
            resolve[tgt] = MANUAL[tgt]
            continue
        if cat == 'relative_path':
            abs_t = os.path.normpath(os.path.join(os.path.dirname(src), tgt)).rstrip('/')
            if abs_t in rel_index or abs_t in dirs:
                per_source[src][tgt] = abs_t
                continue
            stripped = re.sub(r'^(\.\./)+', '', tgt).rstrip('/')
            if stripped in rel_index or stripped in dirs:
                per_source[src][tgt] = stripped
                continue
        base = os.path.basename(tgt.rstrip('/'))
        cands = norm_index.get(base.lower().replace('-', '_'), set())
        if len(cands) == 1:
            resolve[tgt] = next(iter(cands))
            continue
        dcands = {d for d in dirs if os.path.basename(d).lower() == base.lower()}
        if len(dcands) == 1:
            resolve[tgt] = next(iter(dcands))
            continue
        if cat == 'bare_name':
            # 无真实归宿的裸名称占位链接：去链接化为纯文本
            unlink.add(tgt)
            continue
        unresolved.append((src, tgt, cat))

    def apply(text, old, new):
        disp = DISPLAY.get(old, os.path.basename(old.rstrip('/')))
        text = text.replace(f'[[{old}]]', f'[[{new}|{disp}]]')
        for sep in ('|', '\\|', '#'):
            text = text.replace(f'[[{old}{sep}', f'[[{new}{sep}')
        if not old.endswith('/'):
            text = text.replace(f'[[{old}/]]', f'[[{new}|{disp}]]')
            for sep in ('|', '\\|'):
                text = text.replace(f'[[{old}/{sep}', f'[[{new}{sep}')
        return text

    def apply_unlink(text, old):
        """[[X]] / [[X|别名]] / [[X#锚点]] -> 纯文本（优先用别名）。"""
        disp = DISPLAY.get(old, os.path.basename(old.rstrip('/')))
        pat = re.compile(r'\[\[' + re.escape(old) + r'/?(?:#[^\]|]*)?(?:\\?\|([^\]]*))?\]\]')
        return pat.sub(lambda m: m.group(1) or disp, text)

    changed = 0
    for src in {b['source'] for b in data['broken']}:
        if src in SKIP_FILES:
            continue
        p = os.path.join(ROOT, src)
        if not os.path.exists(p):
            continue
        t = open(p, encoding='utf-8', errors='ignore').read()
        o = t
        for old, new in resolve.items():
            if f'[[{old}' in t:
                t = apply(t, old, new)
        for old, new in per_source.get(src, {}).items():
            t = apply(t, old, new)
        for old in unlink:
            if f'[[{old}' in t:
                t = apply_unlink(t, old)
        if t != o:
            open(p, 'w', encoding='utf-8').write(t)
            changed += 1

    print(f'映射数: 全局 {len(resolve)} + 相对路径 {sum(len(v) for v in per_source.values())}')
    print(f'去链接化目标: {len(unlink)}')
    for u in sorted(unlink):
        print(f'  [unlink] {u}')
    print(f'改写文件: {changed}')
    print(f'未解析: {len(unresolved)}')
    for s, t, c in sorted(unresolved):
        print(f'  [{c}] {t}  <- {s}')


if __name__ == '__main__':
    main()
