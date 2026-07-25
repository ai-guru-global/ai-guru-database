#!/usr/bin/env python3
"""散落文件归档脚本（2026-07）：将各章节根目录的散落 md 文件归入主题子目录。

与 reorganize_subdirs.py 的区别：
- 映射基于当前中文章节名（NN_中文名），含跨章节迁移与少量重命名
- 链接重写采用「解析器式」：先按迁移映射重算所有相对链接，再执行 git mv
  （同时覆盖：源文件自身移动导致的 ../ 深度变化、目标文件移动导致的路径变化）

用法：
    python3 工具/reorganize_scattered_2026.py --dry-run   # 校验映射
    python3 工具/reorganize_scattered_2026.py --rewrite   # 仅重写链接（不移动）
    python3 工具/reorganize_scattered_2026.py --execute   # 重写链接 + git mv（不自动 commit）
"""
import argparse
import os
import re
import subprocess
import sys
from pathlib import Path
from urllib.parse import quote, unquote

REPO_ROOT = Path(__file__).resolve().parent.parent

EXCLUDE_DIRS = {
    ".git", "node_modules", ".venv", ".qoder", ".obsidian", ".github",
    ".claude", ".githooks", "__pycache__", "release", "原始", "来源",
    "项目", "前端应用", "code", "docs", "superpowers",
}

# === 同章节归位：章节 -> {文件名: 子目录} ===
SAME_CHAPTER = {
    "00_入门": {
        "AI_Career_Guide.md": "03_Learning_Path",
        "Quick_Start_Projects.md": "03_Learning_Path",
        "AI_Tools_Landscape_2026.md": "02_Technology_Overview",
    },
    "01_数学基础": {
        "AI_Development_Environment_Setup.md": "08_Python_Toolkit",
        "ApacheCN_Data_Analysis_Track.md": "08_Python_Toolkit",
        "GenAI_L00_Course_Setup.md": "08_Python_Toolkit",
        "ApacheCN_Linear_Algebra_Track.md": "02_Linear_Algebra",
        "Calculus_Optimization.md": "01_Math_Fundamentals",
        "GPU_Programming_CUDA_Basics.md": "10_AI_Hardware",
        "Numerical_Methods_for_ML.md": "05_Numerical_Methods",
    },
    "02_机器学习": {
        "ML_Systems_Design.md": "01_ML_Fundamentals",
        "ML_Systems_Design_index.md": "01_ML_Fundamentals",
        "Model_Interpretability_Explainability.md": "01_ML_Fundamentals",
        "ApacheCN_Machine_Learning_Track.md": "01_ML_Fundamentals",
        # 新建 13_Learning_Paradigms/（学习范式）
        "Metric_Learning.md": "13_Learning_Paradigms",
        "Metric_Learning_index.md": "13_Learning_Paradigms",
        "Online_Learning.md": "13_Learning_Paradigms",
        "Online_Learning_index.md": "13_Learning_Paradigms",
        "Semi_Supervised_Learning.md": "13_Learning_Paradigms",
        "Semi_Supervised_Learning_index.md": "13_Learning_Paradigms",
    },
    "03_深度学习": {
        "ApacheCN_PyTorch_Track.md": "08_DL_Frameworks",
        "ApacheCN_TensorFlow_Track.md": "08_DL_Frameworks",
        "Attention_Mechanisms.md": "02_Neural_Network_Core",
        "Attention_Mechanisms_index.md": "02_Neural_Network_Core",
        "State_Space_Models_2026.md": "02_Neural_Network_Core",
        # 新建 09_Advanced_Topics/（进阶专题）
        "Continual_Learning.md": "09_Advanced_Topics",
        "Continual_Learning_index.md": "09_Advanced_Topics",
        "Knowledge_Distillation.md": "09_Advanced_Topics",
        "Knowledge_Distillation_index.md": "09_Advanced_Topics",
        "Neural_Architecture_Search.md": "09_Advanced_Topics",
        "Neural_Architecture_Search_index.md": "09_Advanced_Topics",
        "Transfer_Learning.md": "09_Advanced_Topics",
        "Transfer_Learning_Guide.md": "09_Advanced_Topics",
    },
    "04_计算机视觉": {
        "HF_Diffusers_Practical_Guide.md": "06_Generative_Models",
        # 新建 09_CV_Deployment/（CV 部署）
        "CV_Deployment_and_Inference_2026.md": "09_CV_Deployment",
    },
    "05_大模型": {
        "LLM_Architecture_Evolution.md": "05_LLM_Architectures",
        "Architecture_Evolution_for_dummy.md": "05_LLM_Architectures",
        "GenAI_L02_Exploring_and_Comparing_LLMs.md": "01_LLM_Fundamentals",
        "GenAI_L16_Open_Source_Models_and_Hugging_Face.md": "14_Global_LLM_Ecosystem",
        "Test_Time_Compute_Scaling_2026.md": "09_Reasoning_Models",
        "Test_Time_Training_2026.md": "09_Reasoning_Models",
        # 新建 16_Constrained_Generation/（受限生成）
        "Constrained_Decoding_2026.md": "16_Constrained_Generation",
        "Structured_Output_Guide.md": "16_Constrained_Generation",
    },
    "06_强化学习": {
        "Sim_to_Real_Transfer_Guide.md": "05_Robotics_Embodied_AI",
        "Sim_to_Real_index.md": "05_Robotics_Embodied_AI",
        # 新建 06_Multi_Agent/（多智能体）
        "Multi_Agent_RL.md": "06_Multi_Agent",
        "Multi_Agent_Systems.md": "06_Multi_Agent",
    },
    "07_模型训练": {
        "Curriculum_Learning.md": "02_Data",
        "Diffusion_Model_Training_2026.md": "01_Training_Fundamentals",
        "Pretraining_Playbook.md": "01_Training_Fundamentals",
        "Training_Infrastructure.md": "04_Distributed_Training",
        # 新建 08_Cost_Optimization/（训练成本优化）
        "Training_Cost_Optimization_and_FinOps_2026.md": "08_Cost_Optimization",
    },
    "08_模型评估": {
        "Human_Evaluation_Deep_Dive.md": "01_Evaluation_Fundamentals",
        "Human_Evaluation_index.md": "01_Evaluation_Fundamentals",
        "Unified_Benchmark_Comparison.md": "02_Benchmarks",
        "Agent_Evaluation.md": "03_LLM_Evaluation",
        "Reasoning_Evaluation.md": "03_LLM_Evaluation",
        "Online_Evaluation_index.md": "04_Evaluation_Tools",
        # 新建 06_Safety_Evaluation/（安全评估）
        "Safety_Alignment_Evaluation.md": "06_Safety_Evaluation",
        "Red_Team_Evaluation_Guide.md": "06_Safety_Evaluation",
        "Red_Team_Evaluation_index.md": "06_Safety_Evaluation",
        "Fairness_Evaluation_for_dummy.md": "06_Safety_Evaluation",
    },
    "09_测试": {
        "LLM_Unit_Testing.md": "01_Testing_Fundamentals",
        "Contract_Testing.md": "01_Testing_Fundamentals",
        "Contract_Testing_index.md": "01_Testing_Fundamentals",
        "Test_Data_Management.md": "01_Testing_Fundamentals",
        "Test_Data_index.md": "01_Testing_Fundamentals",
        "RAGAS_Deep_Dive.md": "02_Testing_Frameworks",
        "RAGAS_index.md": "02_Testing_Frameworks",
        "Weights_Biases_Deep_Dive.md": "02_Testing_Frameworks",
        "Weights_Biases_index.md": "02_Testing_Frameworks",
        # 新建 03_Agent_Evaluation/（Agent 评测）
        "Agent_Evaluation_Deep_Dive.md": "03_Agent_Evaluation",
        "Agent_Evaluation_index.md": "03_Agent_Evaluation",
        # 新建 04_Online_Testing/（在线测试）
        "AB_Testing_AI_Systems.md": "04_Online_Testing",
        "AB_Testing_index.md": "04_Online_Testing",
    },
    "10_部署推理": {
        "Blue_Green_Canary_Deployment.md": "01_Deployment_Fundamentals",
        "Edge_Deployment.md": "01_Deployment_Fundamentals",
        "Model_Hot_Reload_and_Rollback_Runbook.md": "01_Deployment_Fundamentals",
        "Serving_Architecture.md": "01_Deployment_Fundamentals",
        "LLM_Caching.md": "06_Caching",
        "Model_Compression.md": "03_Inference_Optimization",
        # 新建 09_Cost/（推理成本）
        "LLM_Cost_Optimization.md": "09_Cost",
        "Cost_index.md": "09_Cost",
    },
    "11_模型运维": {
        "Boundary_with_16.md": "01_MLOps_Fundamentals",
        "Documentation_Automation.md": "01_MLOps_Fundamentals",
        "Tutorial_MLOps_End_to_End.md": "01_MLOps_Fundamentals",
        "GenAI_L14_GenAI_Application_Lifecycle.md": "10_LLMOps",
        "Tutorial_LLMOps_End_to_End.md": "10_LLMOps",
        # 新建 13_Evaluation/（评估流水线）
        "LLM_Evaluation_Pipeline.md": "13_Evaluation",
        "Evaluation_index.md": "13_Evaluation",
    },
    "12_架构基建": {
        "AI_Networking.md": "08_Networking",
        "Alibaba_Cloud_Proprietary_K8s_Context.md": "06_Cloud_Providers",
        "Alibaba_Cloud_index.md": "06_Cloud_Providers",
        "Multi_Tenancy.md": "01_Architecture_Fundamentals",
    },
    "13_运维": {
        "Capacity_Planning_AI_2026.md": "02_SRE_Reliability",
        "Capacity_Planning_index.md": "02_SRE_Reliability",
        "Chaos_Engineering_for_AI_Systems.md": "02_SRE_Reliability",
        "Chaos_Engineering_index.md": "02_SRE_Reliability",
        "Cost_Operations.md": "05_Cost_Management",
        "Incident_Management.md": "03_Incident_Response",
        # 新建 06_Observability/（可观测性）
        "LLM_Inference_Observability_Stack.md": "06_Observability",
        "Observability_index.md": "06_Observability",
    },
    "14_RAG系统": {
        "Chunking_Strategies.md": "01_RAG_Fundamentals",
        "GenAI_L08_Building_Search_Applications.md": "01_RAG_Fundamentals",
        "GenAI_L15_RAG_and_Vector_Databases.md": "01_RAG_Fundamentals",
        "Hybrid_Search.md": "04_Advanced_RAG",
        "Knowledge_Graph_RAG.md": "04_Advanced_RAG",
        "README_Advanced.md": "04_Advanced_RAG",
        "RAG_Monitoring_and_Observability.md": "05_RAG_Production",
        "RAG_Monitoring_index.md": "05_RAG_Production",
        "RAG_Security.md": "05_RAG_Production",
        # 新建 07_RAG_Evaluation/（RAG 评估）
        "RAG_Evaluation_Framework.md": "07_RAG_Evaluation",
        "RAG_Evaluation_index.md": "07_RAG_Evaluation",
    },
    "15_智能体": {
        "Agent_Deployment.md": "10_Enterprise_Agent",
        "Agentic_Design_Patterns_AndrewNg.md": "01_Agent_Foundations",
        # 新建 16_Agent_Protocols/（Agent 协议）
        "A2A_Protocol_Deep_Dive.md": "16_Agent_Protocols",
        "Agent_Protocols_index.md": "16_Agent_Protocols",
        # 新建 17_Agent_Applications/（Agent 应用形态）
        "Computer_Use_Agents.md": "17_Agent_Applications",
        "Voice_Agents.md": "17_Agent_Applications",
    },
    "16_编程": {
        "AI_IDE_Landscape_2026.md": "06_Tool_Comparison",
        "Code_Review_AI_2026.md": "04_Practice",
        "Testing_with_AI_2026.md": "04_Practice",
    },
    "17_伦理安全": {
        "AI_Liability.md": "03_Governance",
        "Model_Card_Documentation.md": "03_Governance",
        "AI_Watermarking.md": "09_Deepfake_Security",
        "Bias_Fairness_Testing.md": "01_Ethics_Fundamentals",
        "GenAI_L03_Using_GenAI_Responsibly.md": "01_Ethics_Fundamentals",
        "Constitutional_AI_Deep_Dive.md": "02_Value_Alignment",
        "Constitutional_AI_index.md": "02_Value_Alignment",
        "GenAI_L13_Securing_AI_Applications.md": "06_Security",
        "Guardrails_Production_Guide.md": "04_AI_Safety_RedTeaming",
        "Safety_Evaluation_Framework.md": "04_AI_Safety_RedTeaming",
    },
    "18_行业应用": {
        "AI_Platform_Selection_2026.md": "01_Industry_Overview",
        "AI_Production_Architecture_2026.md": "01_Industry_Overview",
        # 新建行业子目录（06-19）
        "AI_Autonomous_Driving_2026.md": "06_Autonomous_Driving",
        "Autonomous_Driving_index.md": "06_Autonomous_Driving",
        "AI_Manufacturing_2026.md": "07_Manufacturing",
        "Manufacturing_index.md": "07_Manufacturing",
        "AI_Retail_Ecommerce_2026.md": "08_Retail_Ecommerce",
        "Retail_Ecommerce_index.md": "08_Retail_Ecommerce",
        "AI_Energy_Climate_2026.md": "09_Energy_Climate",
        "Energy_Climate_index.md": "09_Energy_Climate",
        "AI_Agriculture_2026.md": "10_Agriculture",
        "Agriculture_index.md": "10_Agriculture",
        "AI_Legal_Government_2026.md": "11_Legal_Government",
        "Legal_Government_index.md": "11_Legal_Government",
        "AI_HR_Recruitment_2026.md": "12_HR_Recruitment",
        "HR_Recruitment_index.md": "12_HR_Recruitment",
        "AI_Content_Media_2026.md": "13_Content_Media",
        "Content_Media_index.md": "13_Content_Media",
        "AI_Gaming_Entertainment_2026.md": "14_Gaming_Entertainment",
        "AI_Security_Cybersecurity_2026.md": "15_Security_Cybersecurity",
        "Security_Cybersecurity_index.md": "15_Security_Cybersecurity",
        "AI_Supply_Chain_2026.md": "16_Supply_Chain_Logistics",
        "Supply_Chain_Logistics_index.md": "16_Supply_Chain_Logistics",
        "Logistics_Supply_Chain.md": "16_Supply_Chain_Logistics",
        "AI_Robotics_Industry_2026.md": "17_Robotics_Industry",
        "AI_Code_Generation_2026.md": "18_Code_Generation",
        "Code_Generation_index.md": "18_Code_Generation",
        "Telecommunications.md": "19_Other_Industries",
        "Public_Safety.md": "19_Other_Industries",
        "Real_Estate_Construction.md": "19_Other_Industries",
        "Sports.md": "19_Other_Industries",
    },
    "20_论文精读": {
        "Paper_Reading_and_Reproduction_Guide.md": "01_Research_Guide",
        "Methodology_index.md": "01_Research_Guide",
        # 新建 09_Frontier/、10_Retrieval/、11_Domain_Surveys/
        "DeepSeek_V3_Technical_Report.md": "09_Frontier",
        "Frontier_index.md": "09_Frontier",
        "RAG_Deep_Dive.md": "10_Retrieval",
        "Retrieval_index.md": "10_Retrieval",
        "Agent_Papers.md": "11_Domain_Surveys",
        "Multimodal_Papers.md": "11_Domain_Surveys",
        "Reasoning_Papers.md": "11_Domain_Surveys",
    },
    "90_学习": {
        "pathways_concepts_mapping.md": "pathways",
    },
}

# === 跨章节迁移 / 重命名：完整旧路径 -> 完整新路径 ===
EXPLICIT_MOVES = {
    # 跨章节
    "03_深度学习/DeepSeek_Architecture_2026.md":
        "05_大模型/05_LLM_Architectures/DeepSeek_Architecture_2026.md",
    "05_大模型/LLM_Inference_Deep_Dive.md":
        "10_部署推理/03_Inference_Optimization/LLM_Inference_Deep_Dive.md",
    "05_大模型/LLM_Production_Deployment_Runbook.md":
        "10_部署推理/01_Deployment_Fundamentals/LLM_Production_Deployment_Runbook.md",
    "05_大模型/LLM_Training_Deep_Dive.md":
        "07_模型训练/01_Training_Fundamentals/LLM_Training_Deep_Dive.md",
    "07_模型训练/Hello_Agents_L11_Agentic_RL.md":
        "15_智能体/13_Hello_Agents/Hello_Agents_L11_Agentic_RL.md",
    "10_部署推理/Model_Registry.md":
        "11_模型运维/04_Experiment_Tracking/Model_Registry.md",
    "12_架构基建/AI_SRE_Runbook.md":
        "13_运维/02_SRE_Reliability/AI_SRE_Runbook.md",
    "12_架构基建/AI_SRE_index.md":
        "13_运维/02_SRE_Reliability/AI_SRE_index.md",
    "15_智能体/Gradio_Deep_Dive.md":
        "10_部署推理/02_Inference_Engines/Gradio_Deep_Dive.md",
    "18_行业应用/GenAI_L10_Building_Low_Code_AI_Applications.md":
        "16_编程/05_Tools/GenAI_L10_Building_Low_Code_AI_Applications.md",
    # 重命名（PascalCase 规范化）
    "02_机器学习/kaggle_overview.md":
        "02_机器学习/01_ML_Fundamentals/Kaggle_Overview.md",
    "20_论文精读/papers-with-code_overview.md":
        "20_论文精读/01_Research_Guide/Papers_With_Code_Overview.md",
    # 冲突消解：根目录 262 行新版指南与 03_Optimization/ 下 844 行版本内容不同
    "07_模型训练/Mixed_Precision_Training.md":
        "07_模型训练/03_Optimization/Mixed_Precision_Training_Guide.md",
    # 冲突消解：根目录 2026-07 工具向新版与 08_Observability/ 下旧版内容不同
    "11_模型运维/LLM_Observability.md":
        "11_模型运维/08_Observability/LLM_Observability_2026.md",
    # 冲突消解：根目录 605 行完整版与 02_Embeddings/ 下 245 行版本内容不同
    "14_RAG系统/HF_Datasets_Streaming.md":
        "14_RAG系统/02_Embeddings/HF_Datasets_Streaming_Guide.md",
    # 非章节目录归位
    "15_智能体/assets_index.md": "15_智能体/assets/index.md",
    "15_智能体/tests_index.md": "15_智能体/tests/index.md",
    "_project-evaluation.md": "治理/_project-evaluation.md",
}


def build_moves():
    """构建 {旧repo相对路径: 新repo相对路径}。"""
    moves = {}
    for chapter, filemap in SAME_CHAPTER.items():
        for filename, subdir in filemap.items():
            moves[f"{chapter}/{filename}"] = f"{chapter}/{subdir}/{filename}"
    moves.update(EXPLICIT_MOVES)
    return moves


def validate(moves):
    errors = []
    targets = {}
    for old, new in moves.items():
        if not (REPO_ROOT / old).is_file():
            errors.append(f"源文件不存在: {old}")
        if (REPO_ROOT / new).exists():
            errors.append(f"目标已存在: {new}")
        if new in targets:
            errors.append(f"目标重复: {new} <- {old} 与 {targets[new]}")
        targets[new] = old
        if new in moves:
            errors.append(f"目标也是源（链式移动不支持）: {new}")
    return errors


def iter_md_files():
    for dirpath, dirnames, filenames in os.walk(REPO_ROOT):
        dirnames[:] = [d for d in dirnames if d not in EXCLUDE_DIRS]
        for fn in filenames:
            if fn.endswith(".md") and not fn.endswith(" 2.md"):
                yield Path(dirpath) / fn


LINK_RE = re.compile(r"(\]\()(<?)([^)\n]+?)(>?)(\))")


def rewrite_file_links(path, moves, dry=False):
    """解析器式重写：对文件内所有相对 md 链接按迁移映射重算路径。"""
    rel = path.relative_to(REPO_ROOT).as_posix()
    final_rel = moves.get(rel, rel)
    src_moved = final_rel != rel
    old_dir = Path(rel).parent
    new_dir = Path(final_rel).parent
    text = path.read_text(encoding="utf-8")
    changed = [0]

    def repl(m):
        prefix, lt, target, gt, suffix = m.groups()
        raw = target.strip()
        # 跳过外链/锚点/绝对路径
        if raw.startswith(("http://", "https://", "mailto:", "#", "/", "data:")):
            return m.group(0)
        # 拆锚点（保留在链接体内）
        body, frag = (raw.split("#", 1) + [""])[:2]
        frag = ("#" + frag) if frag else ""
        if not body:
            return m.group(0)
        decoded = unquote(body)
        was_quoted = decoded != body
        # 以当前文件目录解析为 repo 相对路径
        resolved = os.path.normpath(os.path.join(old_dir.as_posix(), decoded))
        if resolved.startswith(".."):
            return m.group(0)
        resolved = resolved.replace(os.sep, "/")
        target_final = moves.get(resolved, resolved)
        target_moved = target_final != resolved
        if not (src_moved or target_moved):
            return m.group(0)
        # 目标既未移动又不存在 → 原有断链，保持不变（不影响基线对比）
        if not target_moved and not (REPO_ROOT / resolved).exists():
            return m.group(0)
        new_link = os.path.relpath(target_final, new_dir.as_posix()).replace(os.sep, "/")
        if was_quoted:
            new_link = quote(new_link, safe="/")
        if new_link == body:
            return m.group(0)
        changed[0] += 1
        return f"{prefix}{lt}{new_link}{frag}{gt}{suffix}"

    new_text = LINK_RE.sub(repl, text)
    if new_text != text and not dry:
        path.write_text(new_text, encoding="utf-8")
    return changed[0]


def build_text_rules(moves):
    """全路径文本规则：覆盖反引号路径、带路径 wikilink 等纯文本引用。"""
    rules = []
    for old, new in sorted(moves.items(), key=lambda kv: -len(kv[0])):
        pat = re.compile(r"(?<![A-Za-z0-9_/\.])" + re.escape(old) + r"(?![A-Za-z0-9_])")
        rules.append((pat, new))
    # 重命名文件的裸 wikilink（仅限无歧义的两个重命名；
    # Mixed_Precision_Training 保留同名正式版、assets/tests_index 目标名 index 有歧义，均不改）
    for ob, nb in [("kaggle_overview", "Kaggle_Overview"),
                   ("papers-with-code_overview", "Papers_With_Code_Overview")]:
        pat = re.compile(r"\[\[" + re.escape(ob) + r"(\]\]|\|)")
        rules.append((pat, lambda m, nb=nb: f"[[{nb}{m.group(1)}"))
    return rules


def apply_text_rules(path, rules, dry=False):
    text = path.read_text(encoding="utf-8")
    new_text = text
    n = 0
    for pat, rep in rules:
        new_text, k = pat.subn(rep, new_text)
        n += k
    if new_text != text and not dry:
        path.write_text(new_text, encoding="utf-8")
    return n


def git_mv(moves):
    for old, new in moves.items():
        dst = REPO_ROOT / new
        dst.parent.mkdir(parents=True, exist_ok=True)
        r = subprocess.run(["git", "mv", old, new], cwd=str(REPO_ROOT),
                           capture_output=True, text=True)
        if r.returncode != 0:
            print(f"  ✗ git mv {old} -> {new}\n    {r.stderr.strip()}")
            sys.exit(1)
    print(f"  已移动 {len(moves)} 个文件（已暂存，未 commit）")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--rewrite", action="store_true")
    ap.add_argument("--execute", action="store_true")
    args = ap.parse_args()

    moves = build_moves()
    errors = validate(moves)
    new_dirs = sorted({str(Path(n).parent) for n in moves.values()
                       if not (REPO_ROOT / Path(n).parent).is_dir()})
    print(f"迁移映射: {len(moves)} 项；新建目录: {len(new_dirs)} 个")
    for d in new_dirs:
        print(f"  + {d}/")
    if errors:
        print(f"\n校验失败（{len(errors)} 项）:")
        for e in errors:
            print(f"  ✗ {e}")
        sys.exit(1)
    print("校验通过：所有源文件存在、目标无冲突。")
    if args.dry_run:
        return

    if args.rewrite or args.execute:
        rules = build_text_rules(moves)
        total_link, total_text, touched = 0, 0, 0
        for md in iter_md_files():
            n1 = rewrite_file_links(md, moves)
            n2 = apply_text_rules(md, rules)
            if n1 or n2:
                touched += 1
                total_link += n1
                total_text += n2
        print(f"链接重写: {touched} 个文件，{total_link} 处相对链接，{total_text} 处文本路径")

    if args.execute:
        git_mv(moves)


if __name__ == "__main__":
    main()
