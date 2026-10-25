#!/usr/bin/env python3
"""子目录重组脚本：为 5 个扁平化大章节建二级子目录，并归位 15_Agent 课程文件。

复用 restructure_2026.py 的 wikilink 重写逻辑。
执行：git mv 文件到子目录 + 全量重写 wikilink/内链中的文件路径。
"""
import os
import re
import subprocess
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent

# === 文件 → 子目录映射 ===
# 格式: "章节/文件名.md": "章节/子目录/文件名.md"
# 保留在根目录的不列入（README、总览、for_dummy 可留根作入口）

# 10_Deployment_Inference: 推理引擎/量化/缓存/边缘/总览留根
DEPLOY_MAP = {
    # Inference_Engines/ - 推理引擎与服务
    "vLLM_Deep_Dive.md": "Inference_Engines",
    "vLLM_for_dummy.md": "Inference_Engines",
    "TGI_Deep_Dive.md": "Inference_Engines",
    "BentoML_Deep_Dive.md": "Inference_Engines",
    "LMDeploy_Deep_Dive.md": "Inference_Engines",
    "llama_cpp_Deep_Dive.md": "Inference_Engines",
    "CTranslate2_Deep_Dive.md": "Inference_Engines",
    "Together_AI_Deep_Dive.md": "Inference_Engines",
    "LiteRT_Deep_Dive.md": "Inference_Engines",
    "TensorRT_LLM_Deep_Dive.md": "Inference_Engines",
    "SGLang_Deep_Dive.md": "Inference_Engines",
    "Groq_Deep_Dive.md": "Inference_Engines",
    "Fireworks_AI_Deep_Dive.md": "Inference_Engines",
    "Ollama_Deep_Dive.md": "Inference_Engines",
    "MLC_LLM_Deep_Dive.md": "Inference_Engines",
    "Modal_Deep_Dive.md": "Inference_Engines",
    "KServe_Deep_Dive.md": "Inference_Engines",
    "Triton_Inference_Server_Deep_Dive.md": "Inference_Engines",
    "HF_Inference_Endpoints_Guide.md": "Inference_Engines",
    "LLM_Inference_Engine_Selection_Guide.md": "Inference_Engines",
    "LLM_Inference_Engine_Migration_Guide.md": "Inference_Engines",
    "LLM_Inference_Benchmarking_Guide.md": "Inference_Engines",
    "Batch_API_Comparison_2026.md": "Inference_Engines",
    "JVM_AI_Deployment.md": "Inference_Engines",
    # Quantization/ - 量化
    "Quantization_Precision_Deep_Dive.md": "Quantization",
    "Quantization_Techniques_2026.md": "Quantization",
    "HF_Quantization_Ecosystem.md": "Quantization",
    # Caching/ - 缓存与 KV Cache
    "Prompt_Caching_Advanced.md": "Caching",
    "Prompt_Caching_and_KV_Cache_Optimization.md": "Caching",
    "KV_Cache_Deep_Dive.md": "Caching",
    "Speculative_Decoding_Advanced_2026.md": "Caching",
    # GPU_Infrastructure/ - GPU 部署基础设施
    "GPUStack_Deep_Dive.md": "GPU_Infrastructure",
    "GPUStack_for_dummy.md": "GPU_Infrastructure",
    # Cost/ - 成本优化
    "LLM_Cost_Optimization.md": "Cost",
    # Utils（streamlit 工具）
    "streamlit_overview.md": "Inference_Engines",
}

# 11_MLOps_Pipeline: CI_CD/Observability/Orchestration/Experiment_Tracking/Cost
MLOPS_MAP = {
    # CI_CD/
    "CI_CD_Pipeline_AI_2026.md": "CI_CD",
    "ML_CI_CD.md": "CI_CD",
    # Observability/
    "AI_Observability_Guide.md": "Observability",
    "AI_Observability_Guide_2026.md": "Observability",
    "AI_Observability_Deep_Dive.md": "Observability",
    "LLM_Observability.md": "Observability",
    "ML_Observability_SLO.md": "Observability",
    "Model_Monitoring_and_Drift_Detection_2026.md": "Observability",
    "Phoenix_Deep_Dive.md": "Observability",
    "Helicone_Deep_Dive.md": "Observability",
    "LangSmith_Deep_Dive.md": "Observability",
    "Braintrust_Deep_Dive.md": "Observability",
    # Orchestration/
    "Data_Pipeline_Orchestration.md": "Orchestration",
    "Prefect_Deep_Dive.md": "Orchestration",
    "Kubeflow_Deep_Dive.md": "Orchestration",
    "LakeFS_Deep_Dive.md": "Orchestration",
    "Data_Versioning_DVC_LakeFS.md": "Orchestration",
    "DVC_Deep_Dive.md": "Orchestration",
    "Privacy_Compliance_Pipeline.md": "Orchestration",
    "RAG_Pipeline_Ops.md": "Orchestration",
    # Experiment_Tracking/ - 实验跟踪与模型注册
    "Experiment_Tracking_Deep_Dive.md": "Experiment_Tracking",
    "Model_Registry_and_Cards_Deep_Dive.md": "Experiment_Tracking",
    "MLflow_Deep_Dive.md": "Experiment_Tracking",
    "ClearML_Deep_Dive.md": "Experiment_Tracking",
    "Feast_Deep_Dive.md": "Experiment_Tracking",
    "Feature_Store_Deep_Dive.md": "Experiment_Tracking",
    # Evaluation/
    "LLM_Evaluation_Pipeline.md": "Evaluation",
    # Cost/
    "LLM_Cost_Latency_SLO.md": "Cost",
    "Cost_Optimization_MLOps.md": "Cost",
}

# 14_RAG_Systems: Vector_Databases/RAG_Frameworks/Advanced_RAG/Embeddings
RAG_MAP = {
    # Vector_Databases/
    "Milvus_Deep_Dive.md": "Vector_Databases",
    "Weaviate_Deep_Dive.md": "Vector_Databases",
    "Qdrant_Deep_Dive.md": "Vector_Databases",
    "Chroma_Deep_Dive.md": "Vector_Databases",
    "Typesense_Deep_Dive.md": "Vector_Databases",
    # RAG_Frameworks/
    "LlamaIndex_Deep_Dive.md": "RAG_Frameworks",
    "Haystack_Deep_Dive.md": "RAG_Frameworks",
    "Dify_Deep_Dive.md": "RAG_Frameworks",
    "Spring_AI_RAG_Deep_Dive.md": "RAG_Frameworks",
    "Flowise_Deep_Dive.md": "RAG_Frameworks",
    "LangFlow_Deep_Dive.md": "RAG_Frameworks",
    # Advanced_RAG/
    "RAG_Advanced_2026.md": "Advanced_RAG",
    "Multimodal_RAG_Architecture_2026.md": "Advanced_RAG",
    "Advanced_RAG_DLAI_Practices.md": "Advanced_RAG",
    "Agentic_RAG_Guide.md": "Advanced_RAG",
    "Data_Ingestion_Pipeline.md": "Advanced_RAG",
    # Embeddings/
    "Embedding_Models_Guide.md": "Embeddings",
    "Sentence_Transformers_Deep_Dive.md": "Embeddings",
    "Matryoshka_Representation_Learning_Deep_Dive.md": "Embeddings",
    "HF_Datasets_Streaming.md": "Embeddings",
}

# 07_Model_Training: Distributed_Training/Alignment/Compression/Optimization
TRAINING_MAP = {
    # Distributed_Training/
    "Ray_Deep_Dive.md": "Distributed_Training",
    "DeepSpeed_Deep_Dive.md": "Distributed_Training",
    "DeepSpeed_for_dummy.md": "Distributed_Training",
    "FSDP_Deep_Dive.md": "Distributed_Training",
    "Megatron_LM_Deep_Dive.md": "Distributed_Training",
    "Colossal_AI_Deep_Dive.md": "Distributed_Training",
    "HF_Accelerate_DeepSpeed_Guide.md": "Distributed_Training",
    "Distributed_Training_for_dummy.md": "Distributed_Training",
    "Distributed_Training_2026.md": "Distributed_Training",
    # Alignment/ - 对齐训练
    "GRPO_and_New_Alignment_Methods.md": "Alignment",
    "TRL_RLHF_DPO_Guide.md": "Alignment",
    # Compression/ - 压缩与蒸馏
    "Pruning_and_Knowledge_Distillation.md": "Compression",
    # Optimization/ - 优化器与训练优化
    "Training_Optimization_2026.md": "Optimization",
    "Mixed_Precision_Training.md": "Optimization",
    "Optimizer_Advanced_2026.md": "Optimization",
    "Optimization_for_dummy.md": "Optimization",
    "Scaling_Laws_and_Training_Dynamics.md": "Optimization",
    # Data/ - 数据与分词
    "Data_Curation_and_Mixture_2026.md": "Data",
    "Tokenizer_Design_2026.md": "Data",
    # Monitoring/
    "Training_Monitoring_2026.md": "Monitoring",
    "Model_Troubleshooting_Guide.md": "Monitoring",
    # Frameworks（swift 等）
    "ms_swift_Deep_Dive.md": "Distributed_Training",
    "ms_swift_Command_Line_Parameters.md": "Distributed_Training",
}

# 20_Papers: 按主题领域分类
PAPERS_MAP = {
    # Architecture/ - 架构类
    "Attention_Is_All_You_Need_Deep_Dive.md": "Architecture",
    "BERT_Deep_Dive.md": "Architecture",
    "LLaMA_Deep_Dive.md": "Architecture",
    "Mixture_of_Experts_Deep_Dive.md": "Architecture",
    # Scaling/ - 规模与训练
    "Scaling_Laws_Deep_Dive.md": "Scaling",
    "Chinchilla_Deep_Dive.md": "Scaling",
    "GPT3_Deep_Dive.md": "Scaling",
    "GPT4_Deep_Dive.md": "Scaling",
    # Alignment/ - 对齐
    "RLHF_DPO_Deep_Dive.md": "Alignment",
    "DPO_Deep_Dive.md": "Alignment",
    "Chain_of_Thought_Deep_Dive.md": "Alignment",
    # Efficiency/ - 高效方法
    "LoRA_Deep_Dive.md": "Efficiency",
    "Matryoshka_Representation_Learning_Deep_Dive.md": "Efficiency",
    # Vision/ - 视觉
    "ResNet_Deep_Dive.md": "Vision",
    "CLIP_Deep_Dive.md": "Vision",
    "GAN_Deep_Dive.md": "Vision",
    "VAE_Deep_Dive.md": "Vision",
    "Diffusion_Models_Deep_Dive.md": "Vision",
    # RL/ - 强化学习
    "DQN_Deep_Dive.md": "RL",
    "AlphaGo_Deep_Dive.md": "RL",
    # Retrieval/ - 检索
    "RAG_Deep_Dive.md": "Retrieval",
    # Frontier/ - 前沿
    "DeepSeek_V3_Technical_Report.md": "Frontier",
}

# 15_Agent 课程文件 → Course_Notes/{系列}/
COURSE_MAP = {
    # Microsoft_AI_Agents → Course_Notes/Microsoft_AI_Agents/
    **{f: f"Course_Notes/Microsoft_AI_Agents/{f}"
       for f in [
           "Microsoft_AI_Agents_L00_Course_Setup.md", "Microsoft_AI_Agents_L01_Intro.md",
           "Microsoft_AI_Agents_L02_Frameworks.md", "Microsoft_AI_Agents_L03_Design_Principles.md",
           "Microsoft_AI_Agents_L04_Tool_Use.md", "Microsoft_AI_Agents_L05_Agentic_RAG.md",
           "Microsoft_AI_Agents_L06_Trustworthy_Agents.md", "Microsoft_AI_Agents_L07_Planning_Design.md",
           "Microsoft_AI_Agents_L08_Multi_Agent.md", "Microsoft_AI_Agents_L09_Metacognition.md",
           "Microsoft_AI_Agents_L10_Production.md", "Microsoft_AI_Agents_L11_Agentic_Protocols.md",
           "Microsoft_AI_Agents_L12_Context_Engineering.md", "Microsoft_AI_Agents_L13_Agent_Memory.md",
           "Microsoft_AI_Agents_L14_Microsoft_Agent_Framework.md", "Microsoft_AI_Agents_L15_Browser_Use.md",
           "Microsoft_AI_Agents_L18_Securing_AI_Agents.md",
       ]},
    # Learn_Claude_Code → Course_Notes/Learn_Claude_Code/
    **{f: f"Course_Notes/Learn_Claude_Code/{f}"
       for f in [
           "Learn_Claude_Code_L01_Agent_Loop.md", "Learn_Claude_Code_L03_Permission_System.md",
           "Learn_Claude_Code_L06_Subagent.md", "Learn_Claude_Code_L08_Context_Compact.md",
           "Learn_Claude_Code_L09_Memory_System.md", "Learn_Claude_Code_L12_Task_System.md",
           "Learn_Claude_Code_L15_Agent_Teams.md", "Learn_Claude_Code_L17_Autonomous_Agents.md",
       ]},
}

# 章节根 → 文件映射表
CHAPTERS = {
    "10_Deployment_Inference": DEPLOY_MAP,
    "11_MLOps_Pipeline": MLOPS_MAP,
    "14_RAG_Systems": RAG_MAP,
    "07_Model_Training": TRAINING_MAP,
    "20_Papers": PAPERS_MAP,
}


def _git(args, cwd=REPO_ROOT):
    result = subprocess.run(["git"] + args, cwd=str(cwd),
                            capture_output=True, text=True)
    if result.returncode != 0:
        raise RuntimeError(f"git {' '.join(args)} 失败:\n{result.stderr}")
    return result.stdout.strip()


def build_move_plan():
    """构建 (old_path, new_path) 列表。"""
    moves = []
    for chapter, filemap in CHAPTERS.items():
        for filename, subdir in filemap.items():
            old = f"{chapter}/{filename}"
            new = f"{chapter}/{subdir}/{filename}"
            moves.append((old, new))
    # 15_Agent 课程文件
    for old_fn, new_path in COURSE_MAP.items():
        old = f"15_Agent_Production/{old_fn}"
        new = f"15_Agent_Production/{new_path}"
        moves.append((old, new))
    return moves


def execute_moves(moves, commit=True):
    """执行 git mv，每章一个 commit。"""
    # 按章节分组
    by_chapter = {}
    for old, new in moves:
        chap = old.split("/")[0]
        by_chapter.setdefault(chap, []).append((old, new))

    for chapter in sorted(by_chapter.keys()):
        chapter_moves = by_chapter[chapter]
        moved = 0
        for old, new in chapter_moves:
            old_abs = REPO_ROOT / old
            new_abs = REPO_ROOT / new
            if not old_abs.exists():
                print(f"  跳过(不存在): {old}")
                continue
            new_abs.parent.mkdir(parents=True, exist_ok=True)
            _git(["mv", old, new])
            moved += 1
        if commit and moved:
            _git(["add", "-A"])
            _git(["commit", "-m",
                  f"refactor(taxonomy): {chapter} 建二级子目录（{moved} 文件归位）"])
            print(f"✓ {chapter}: {moved} 文件归位")


def build_rewrite_rules():
    """构建 wikilink 重写规则 [(old_fragment, new_fragment), ...]。
    old 是 "章节/文件名"（无.md），new 是 "章节/子目录/文件名"。
    按长度降序，避免短前缀误伤。
    """
    rules = []
    for old, new in build_move_plan():
        # wikilink 用 "章节/文件名"（不带 .md）或 "章节/文件名.md"
        old_base = old[:-3]  # 去 .md
        new_base = new[:-3]
        rules.append((old_base, new_base))
        rules.append((old, new))  # 含 .md 的形式
    # 按长度降序
    rules.sort(key=lambda kv: len(kv[0]), reverse=True)
    return rules


_EXCLUDE_DIRS = {'.git', 'Web', 'node_modules', '.venv', '.qoder',
                 '.obsidian', '.github', '__pycache__', '_raw', '_sources',
                 '_projects', 'superpowers'}


def rewrite_links():
    """全量重写 wikilink/内链/反引号中的文件路径。"""
    rules = build_rewrite_rules()
    changed = 0
    for root, dirs, files in os.walk(REPO_ROOT):
        dirs[:] = [d for d in dirs if d not in _EXCLUDE_DIRS and not d.startswith('.')]
        root_path = Path(root)
        for fn in files:
            if not fn.endswith('.md'):
                continue
            fp = root_path / fn
            text = fp.read_text(encoding="utf-8", errors="ignore")
            original = text
            for old, new in rules:
                pattern = re.compile(
                    r"(?<![A-Za-z0-9_/])" + re.escape(old) + r"(?![A-Za-z0-9_])"
                )

                def _repl(m, _p=pattern, _n=new):
                    return _p.sub(_n, m.group(0))

                text = re.sub(r"\[\[[^\]]+\]\]", _repl, text)
                text = re.sub(r"\[[^\]]*\]\([^)]+\)", _repl, text)
                text = re.sub(r"`[^`\n]+`", _repl, text)
                # 带 .md 后缀的裸引用
                text = re.sub(
                    r"(?<![A-Za-z0-9_/])" + re.escape(old) + r"(?![A-Za-z0-9_])",
                    new, text
                )
            if text != original:
                fp.write_text(text, encoding="utf-8")
                changed += 1
    print(f"rewrite 完成：{changed} 文件被修改")
    return changed


def main():
    import sys
    plan = build_move_plan()
    print(f"迁移计划：{len(plan)} 个文件")
    # 统计
    by_chap = {}
    for old, _ in plan:
        c = old.split("/")[0]
        by_chap[c] = by_chap.get(c, 0) + 1
    for c, n in sorted(by_chap.items()):
        print(f"  {c}: {n} 文件")

    if len(sys.argv) > 1 and sys.argv[1] == "--dry-run":
        for old, new in plan:
            print(f"  {old} → {new}")
        return

    print("\n执行 git mv...")
    execute_moves(plan)

    print("\n重写 wikilink/内链...")
    rewrite_links()

    _git(["add", "-A"])
    _git(["commit", "-m", "refactor(taxonomy): 全量重写子目录重组后的 wikilink/内链"])
    print("\n✓ 全部完成")


if __name__ == "__main__":
    main()
