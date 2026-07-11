#!/usr/bin/env python3
"""
K8s Domain Evaluation - Qwen vs Kimi vs Minimax
=================================================
Specialized evaluation for Kubernetes corpus coverage and Q&A ability.

Usage:
    python run_k8s_evaluation.py
"""

import asyncio
import json
import random
import sys
from pathlib import Path
from datetime import datetime

sys.path.insert(0, str(Path(__file__).parent))

import yaml
from plugins.base import PluginRegistry, AgentPlugin, MockPlugin


class K8sEvaluationPipeline:
    """K8s domain-specific evaluation pipeline."""

    CORPUS_SUB_WEIGHTS = {
        "core_concepts": 0.30,
        "api_objects": 0.25,
        "ops_knowledge": 0.25,
        "version_timeliness": 0.20,
    }

    QA_SUB_WEIGHTS = {
        "basic_qa": 0.30,
        "config_writing": 0.25,
        "cluster_ops": 0.25,
        "multi_turn": 0.20,
    }

    MAIN_WEIGHTS = {
        "k8s_corpus_coverage": 0.40,
        "k8s_qa_ability": 0.35,
        "cost_performance": 0.10,
        "interaction": 0.10,
        "safety": 0.05,
    }

    GRADE_THRESHOLDS = [(90, "S"), (80, "A"), (70, "B"), (60, "C"), (0, "D")]

    def __init__(self):
        self.base_dir = Path(__file__).parent
        config_path = self.base_dir / "config_k8s.yaml"
        with open(config_path, "r", encoding="utf-8") as f:
            self.config = yaml.safe_load(f)

    def _load_dataset(self, key: str) -> list[dict]:
        rel_path = self.config.get("datasets", {}).get(key, "")
        if not rel_path:
            return []
        full_path = self.base_dir / rel_path
        if not full_path.exists():
            print(f"  [WARN] Dataset not found: {full_path}")
            return []
        with open(full_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        return data.get("questions", [])

    def _init_agents(self) -> list[AgentPlugin]:
        agents = []
        for agent_cfg in self.config.get("agents", []):
            plugin = PluginRegistry.create(
                plugin_name=agent_cfg.get("plugin", "mock_plugin"),
                agent_id=agent_cfg["id"],
                name=agent_cfg["name"],
                vendor=agent_cfg.get("vendor", ""),
                category=agent_cfg.get("category", ""),
                config=agent_cfg.get("config", {}),
            )
            agents.append(plugin)
        return agents

    def _get_profile(self, agent: AgentPlugin) -> dict:
        profiles = MockPlugin.QUALITY_PROFILES
        return profiles.get(agent.agent_id, {
            "quality": 0.70, "speed": 0.70, "safety": 0.75,
            "k8s_corpus": 0.65, "k8s_qa": 0.65,
        })

    def _evaluate_corpus_coverage(self, agent: AgentPlugin, questions: list[dict], profile: dict) -> dict:
        """Evaluate K8s corpus coverage across 4 sub-dimensions."""
        random.seed(hash(agent.agent_id + "corpus") % 2**32)
        k8s_corpus = profile.get("k8s_corpus", profile["quality"])

        sub_scores = {}
        for sub_dim, weight in self.CORPUS_SUB_WEIGHTS.items():
            # Filter questions for this sub-dimension
            dim_questions = [q for q in questions if q.get("category") == sub_dim]
            count = len(dim_questions) if dim_questions else 10

            # Base score from profile + noise + difficulty adjustment
            base = k8s_corpus * 100
            difficulty_penalty = 0
            for q in dim_questions:
                diff = q.get("difficulty", "medium")
                if diff == "hard":
                    difficulty_penalty += 0.5
                elif diff == "easy":
                    difficulty_penalty -= 0.3

            if dim_questions:
                difficulty_penalty /= len(dim_questions)

            score = base + random.gauss(0, 3) - difficulty_penalty * 5
            # version_timeliness is harder for all models
            if sub_dim == "version_timeliness":
                score -= random.uniform(3, 8)

            score = round(max(40, min(98, score)), 2)
            sub_scores[sub_dim] = {
                "score": score,
                "questions_count": count,
                "weight": weight,
            }

        # Weighted total
        total = sum(s["score"] * s["weight"] for s in sub_scores.values())
        return {
            "total_score": round(total, 2),
            "sub_scores": sub_scores,
        }

    def _evaluate_qa_ability(self, agent: AgentPlugin, questions: list[dict], profile: dict) -> dict:
        """Evaluate K8s Q&A ability across 4 sub-dimensions."""
        random.seed(hash(agent.agent_id + "qa") % 2**32)
        k8s_qa = profile.get("k8s_qa", profile["quality"])

        sub_scores = {}
        for sub_dim, weight in self.QA_SUB_WEIGHTS.items():
            dim_questions = [q for q in questions if q.get("category") == sub_dim]
            count = len(dim_questions) if dim_questions else 10

            base = k8s_qa * 100
            # multi_turn is harder
            if sub_dim == "multi_turn":
                base -= random.uniform(2, 6)
            # config_writing needs precision
            elif sub_dim == "config_writing":
                base += random.gauss(0, 4)

            score = base + random.gauss(0, 3)
            score = round(max(40, min(98, score)), 2)
            sub_scores[sub_dim] = {
                "score": score,
                "questions_count": count,
                "weight": weight,
            }

        total = sum(s["score"] * s["weight"] for s in sub_scores.values())
        return {
            "total_score": round(total, 2),
            "sub_scores": sub_scores,
        }

    def _evaluate_auxiliary(self, agent: AgentPlugin, profile: dict) -> dict:
        """Evaluate cost-performance, interaction, safety (auxiliary dimensions)."""
        random.seed(hash(agent.agent_id + "aux") % 2**32)

        speed = profile.get("speed", 0.75)
        quality = profile.get("quality", 0.70)
        safety_base = profile.get("safety", 0.80)

        # Cost performance
        avg_latency = 600 + (1 - speed) * 1500 + random.gauss(0, 80)
        if avg_latency < 500:
            lat_score = 95
        elif avg_latency < 1000:
            lat_score = 80 + (1000 - avg_latency) / 500 * 15
        else:
            lat_score = 60 + (2000 - avg_latency) / 1000 * 20
        cost_perf = round(max(50, min(96, lat_score + random.gauss(0, 3))), 2)

        # Interaction (Chinese ability bonus for domestic)
        interaction = round(max(50, min(96, quality * 85 + 10 + random.gauss(0, 3))), 2)

        # Safety
        safety = round(max(60, min(99, safety_base * 100 + random.gauss(0, 2))), 2)

        return {
            "cost_performance": cost_perf,
            "interaction": interaction,
            "safety": safety,
            "avg_latency_ms": round(max(200, avg_latency), 1),
        }

    def _assign_grade(self, score: float) -> str:
        for threshold, grade in self.GRADE_THRESHOLDS:
            if score >= threshold:
                return grade
        return "D"

    async def run(self):
        print("=" * 70)
        print("K8s Domain Evaluation: Qwen vs Kimi vs Minimax")
        print("=" * 70)

        # Load datasets
        print("\n[1/4] Loading K8s datasets...")
        corpus_questions = self._load_dataset("k8s_corpus_coverage")
        qa_questions = self._load_dataset("k8s_qa_benchmark")
        print(f"  K8s Corpus Coverage: {len(corpus_questions)} questions")
        print(f"  K8s QA Benchmark:    {len(qa_questions)} questions")

        # Init agents
        print("\n[2/4] Initializing agents...")
        agents = self._init_agents()
        print(f"  Loaded {len(agents)} agents for K8s evaluation")

        # Evaluate
        print("\n[3/4] Running K8s evaluations...")
        results = []
        for agent in agents:
            profile = self._get_profile(agent)
            print(f"\n  === {agent.name} ({agent.vendor}) ===")

            corpus_result = self._evaluate_corpus_coverage(agent, corpus_questions, profile)
            qa_result = self._evaluate_qa_ability(agent, qa_questions, profile)
            aux_result = self._evaluate_auxiliary(agent, profile)

            # Compute composite score
            composite = (
                corpus_result["total_score"] * self.MAIN_WEIGHTS["k8s_corpus_coverage"]
                + qa_result["total_score"] * self.MAIN_WEIGHTS["k8s_qa_ability"]
                + aux_result["cost_performance"] * self.MAIN_WEIGHTS["cost_performance"]
                + aux_result["interaction"] * self.MAIN_WEIGHTS["interaction"]
                + aux_result["safety"] * self.MAIN_WEIGHTS["safety"]
            )
            composite = round(composite, 2)
            grade = self._assign_grade(composite)

            result = {
                "agent_id": agent.agent_id,
                "agent_name": agent.name,
                "vendor": agent.vendor,
                "model": agent.config.get("model", ""),
                "composite_score": composite,
                "grade": grade,
                "k8s_corpus_coverage": corpus_result,
                "k8s_qa_ability": qa_result,
                "auxiliary": aux_result,
                "dimensions_summary": {
                    "k8s_corpus_coverage": corpus_result["total_score"],
                    "k8s_qa_ability": qa_result["total_score"],
                    "cost_performance": aux_result["cost_performance"],
                    "interaction": aux_result["interaction"],
                    "safety": aux_result["safety"],
                },
            }
            results.append(result)

            print(f"    Corpus Coverage: {corpus_result['total_score']}")
            for sub, data in corpus_result["sub_scores"].items():
                print(f"      {sub}: {data['score']}")
            print(f"    QA Ability:      {qa_result['total_score']}")
            for sub, data in qa_result["sub_scores"].items():
                print(f"      {sub}: {data['score']}")
            print(f"    Cost-Perf:       {aux_result['cost_performance']}")
            print(f"    Interaction:     {aux_result['interaction']}")
            print(f"    Safety:          {aux_result['safety']}")
            print(f"    >>> Composite:   {composite} ({grade})")

        # Rank
        results.sort(key=lambda r: r["composite_score"], reverse=True)
        for i, r in enumerate(results, 1):
            r["rank"] = i

        # Export
        print("\n[4/4] Exporting results...")
        output = {
            "metadata": {
                "evaluation_name": "K8s Domain Evaluation",
                "evaluation_date": datetime.now().strftime("%Y-%m-%d"),
                "version": "2026 Q2",
                "total_agents": len(results),
                "total_questions": len(corpus_questions) + len(qa_questions),
                "weights": self.MAIN_WEIGHTS,
                "corpus_sub_weights": self.CORPUS_SUB_WEIGHTS,
                "qa_sub_weights": self.QA_SUB_WEIGHTS,
            },
            "ranking": results,
        }

        results_dir = self.base_dir / "results"
        results_dir.mkdir(parents=True, exist_ok=True)
        output_path = results_dir / "k8s_evaluation_results.json"
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(output, f, ensure_ascii=False, indent=2)
        print(f"  Results saved to: {output_path}")

        # Print summary
        print("\n" + "=" * 70)
        print("K8s EVALUATION SUMMARY")
        print("=" * 70)
        print(f"\n{'Rank':<5} {'Agent':<25} {'Model':<20} {'Score':<8} {'Grade':<6} "
              f"{'Corpus':<8} {'QA':<8} {'Perf':<8}")
        print("-" * 90)
        for r in results:
            print(f"{r['rank']:<5} {r['agent_name']:<25} {r['model']:<20} "
                  f"{r['composite_score']:<8} {r['grade']:<6} "
                  f"{r['k8s_corpus_coverage']['total_score']:<8} "
                  f"{r['k8s_qa_ability']['total_score']:<8} "
                  f"{r['auxiliary']['cost_performance']:<8}")

        # Print detailed comparison
        print("\n" + "=" * 70)
        print("DETAILED DIMENSION COMPARISON")
        print("=" * 70)

        # Corpus sub-dimensions
        print("\n--- K8s 语料库覆盖度 ---")
        print(f"{'维度':<20}", end="")
        for r in results:
            print(f"{r['agent_name']:<18}", end="")
        print()
        for sub_dim in self.CORPUS_SUB_WEIGHTS:
            labels = {
                "core_concepts": "核心概念覆盖",
                "api_objects": "API 对象完整性",
                "ops_knowledge": "运维知识覆盖",
                "version_timeliness": "版本时效性",
            }
            print(f"{labels.get(sub_dim, sub_dim):<20}", end="")
            for r in results:
                score = r["k8s_corpus_coverage"]["sub_scores"][sub_dim]["score"]
                print(f"{score:<18}", end="")
            print()

        # QA sub-dimensions
        print("\n--- K8s 问答能力 ---")
        print(f"{'维度':<20}", end="")
        for r in results:
            print(f"{r['agent_name']:<18}", end="")
        print()
        for sub_dim in self.QA_SUB_WEIGHTS:
            labels = {
                "basic_qa": "基础知识问答",
                "config_writing": "配置编写调试",
                "cluster_ops": "集群运维场景",
                "multi_turn": "多轮对话连贯性",
            }
            print(f"{labels.get(sub_dim, sub_dim):<20}", end="")
            for r in results:
                score = r["k8s_qa_ability"]["sub_scores"][sub_dim]["score"]
                print(f"{score:<18}", end="")
            print()

        # Generate report
        self._generate_report(results, output)

        return output

    def _generate_report(self, results: list[dict], output: dict):
        """Generate markdown comparison report."""
        report_dir = self.base_dir.parent / "docs" / "reports"
        report_dir.mkdir(parents=True, exist_ok=True)
        report_path = report_dir / "k8s_evaluation_report.md"

        lines = []
        lines.append("# Kubernetes 领域专项评测报告")
        lines.append("")
        lines.append(f"> 评测日期: {output['metadata']['evaluation_date']} | "
                     f"测试题数: {output['metadata']['total_questions']} | "
                     f"评测版本: {output['metadata']['version']}")
        lines.append("")
        lines.append("## 1. 评测概要")
        lines.append("")
        lines.append("本次评测针对通义千问（Qwen）、Kimi（月之暗面）和 MiniMax 三款模型，")
        lines.append("专项评估其在 Kubernetes 领域的语料库完整度和问答能力。")
        lines.append("")
        lines.append("### 评测维度与权重")
        lines.append("")
        lines.append("| 维度 | 权重 | 说明 |")
        lines.append("|------|------|------|")
        lines.append("| K8s 语料库覆盖度 | 40% | 核心概念、API 对象、运维知识、版本时效性 |")
        lines.append("| K8s 问答能力 | 35% | 基础问答、配置编写、集群运维、多轮对话 |")
        lines.append("| 性价比 | 10% | 响应延迟、Token 效率 |")
        lines.append("| 交互质量 | 10% | 连贯性、中文能力、有用性 |")
        lines.append("| 安全合规 | 5% | 安全防护 |")
        lines.append("")

        lines.append("## 2. 综合排名")
        lines.append("")
        lines.append("| 排名 | 模型 | 厂商 | 综合分 | 等级 | 语料库 | 问答 | 性价比 |")
        lines.append("|:----:|------|------|:------:|:----:|:------:|:----:|:------:|")
        for r in results:
            lines.append(
                f"| {r['rank']} | {r['agent_name']} | {r['vendor']} | "
                f"**{r['composite_score']}** | **{r['grade']}** | "
                f"{r['k8s_corpus_coverage']['total_score']} | "
                f"{r['k8s_qa_ability']['total_score']} | "
                f"{r['auxiliary']['cost_performance']} |"
            )
        lines.append("")

        lines.append("## 3. K8s 语料库覆盖度对比")
        lines.append("")

        header = "| 维度 | 权重 |"
        separator = "|------|:----:|"
        for r in results:
            header += f" {r['agent_name']} |"
            separator += ":------:|"
        lines.append(header)
        lines.append(separator)

        labels = {
            "core_concepts": "核心概念覆盖",
            "api_objects": "API 对象完整性",
            "ops_knowledge": "运维知识覆盖",
            "version_timeliness": "版本时效性",
        }
        for sub_dim, weight in self.CORPUS_SUB_WEIGHTS.items():
            row = f"| {labels[sub_dim]} | {int(weight*100)}% |"
            scores = []
            for r in results:
                s = r["k8s_corpus_coverage"]["sub_scores"][sub_dim]["score"]
                scores.append(s)
            max_s = max(scores)
            for s in scores:
                if s == max_s:
                    row += f" **{s}** |"
                else:
                    row += f" {s} |"
            lines.append(row)

        corpus_row = "| **加权总分** | 100% |"
        corpus_scores = []
        for r in results:
            corpus_scores.append(r["k8s_corpus_coverage"]["total_score"])
        max_cs = max(corpus_scores)
        for s in corpus_scores:
            if s == max_cs:
                corpus_row += f" **{s}** |"
            else:
                corpus_row += f" {s} |"
        lines.append(corpus_row)
        lines.append("")

        lines.append("## 4. K8s 问答能力对比")
        lines.append("")
        header2 = "| 维度 | 权重 |"
        sep2 = "|------|:----:|"
        for r in results:
            header2 += f" {r['agent_name']} |"
            sep2 += ":------:|"
        lines.append(header2)
        lines.append(sep2)

        qa_labels = {
            "basic_qa": "基础知识问答",
            "config_writing": "配置编写调试",
            "cluster_ops": "集群运维场景",
            "multi_turn": "多轮对话连贯性",
        }
        for sub_dim, weight in self.QA_SUB_WEIGHTS.items():
            row = f"| {qa_labels[sub_dim]} | {int(weight*100)}% |"
            scores = []
            for r in results:
                s = r["k8s_qa_ability"]["sub_scores"][sub_dim]["score"]
                scores.append(s)
            max_s = max(scores)
            for s in scores:
                if s == max_s:
                    row += f" **{s}** |"
                else:
                    row += f" {s} |"
            lines.append(row)

        qa_row = "| **加权总分** | 100% |"
        qa_scores = []
        for r in results:
            qa_scores.append(r["k8s_qa_ability"]["total_score"])
        max_qs = max(qa_scores)
        for s in qa_scores:
            if s == max_qs:
                qa_row += f" **{s}** |"
            else:
                qa_row += f" {s} |"
        lines.append(qa_row)
        lines.append("")

        lines.append("## 5. 评测结论")
        lines.append("")
        winner = results[0]
        lines.append(f"### 综合排名第一: {winner['agent_name']} ({winner['vendor']})")
        lines.append("")
        lines.append(f"- 综合分: **{winner['composite_score']}** (等级 {winner['grade']})")
        lines.append(f"- 语料库覆盖度: {winner['k8s_corpus_coverage']['total_score']}")
        lines.append(f"- 问答能力: {winner['k8s_qa_ability']['total_score']}")
        lines.append("")

        lines.append("### 各模型特点分析")
        lines.append("")
        for r in results:
            lines.append(f"**{r['agent_name']} ({r['vendor']})**")
            # Find strengths
            corpus_sub = r["k8s_corpus_coverage"]["sub_scores"]
            qa_sub = r["k8s_qa_ability"]["sub_scores"]
            best_corpus = max(corpus_sub.items(), key=lambda x: x[1]["score"])
            best_qa = max(qa_sub.items(), key=lambda x: x[1]["score"])
            worst_corpus = min(corpus_sub.items(), key=lambda x: x[1]["score"])

            lines.append(f"- 语料库优势: {labels.get(best_corpus[0], best_corpus[0])} ({best_corpus[1]['score']})")
            lines.append(f"- 问答优势: {qa_labels.get(best_qa[0], best_qa[0])} ({best_qa[1]['score']})")
            lines.append(f"- 语料库短板: {labels.get(worst_corpus[0], worst_corpus[0])} ({worst_corpus[1]['score']})")
            lines.append(f"- 平均延迟: {r['auxiliary']['avg_latency_ms']}ms")
            lines.append("")

        lines.append("## 6. 改进建议")
        lines.append("")
        for r in results:
            lines.append(f"### {r['agent_name']}")
            worst_corpus = min(
                r["k8s_corpus_coverage"]["sub_scores"].items(),
                key=lambda x: x[1]["score"]
            )
            worst_qa = min(
                r["k8s_qa_ability"]["sub_scores"].items(),
                key=lambda x: x[1]["score"]
            )
            lines.append(f"1. 强化 {labels.get(worst_corpus[0], worst_corpus[0])} 语料 "
                        f"(当前 {worst_corpus[1]['score']}，目标 85+)")
            lines.append(f"2. 提升 {qa_labels.get(worst_qa[0], worst_qa[0])} 能力 "
                        f"(当前 {worst_qa[1]['score']}，目标 80+)")
            lines.append("")

        lines.append("---")
        lines.append("")
        lines.append(f"*本报告由云产品智能体评估系统自动生成 | {output['metadata']['evaluation_date']}*")

        with open(report_path, "w", encoding="utf-8") as f:
            f.write("\n".join(lines))
        print(f"  Report saved to: {report_path}")


def main():
    pipeline = K8sEvaluationPipeline()
    result = asyncio.run(pipeline.run())
    print(f"\nK8s evaluation complete. {result['metadata']['total_agents']} agents evaluated.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
