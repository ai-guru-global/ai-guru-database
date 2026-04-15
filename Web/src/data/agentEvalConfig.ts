/**
 * Agent Evaluation Full-Pipeline Configuration
 * CAPER model, COVR model, LLM-as-Judge criteria, pipeline stages, question selection.
 */
import { K8S_TEST_QUESTIONS, type K8sDimension, type K8sTestQuestion } from "./k8sTestQuestions";

/* ------------------------------------------------------------------ */
/*  CAPER Five-Dimension Model                                         */
/* ------------------------------------------------------------------ */
export interface CAPERDimension {
  key: string;
  label: string;
  labelEn: string;
  weight: number;
  color: string;
  description: string;
}

export const CAPER_DIMENSIONS: CAPERDimension[] = [
  { key: "correctness", label: "知识准确率", labelEn: "Correctness & Knowledge", weight: 0.25, color: "#3B82F6", description: "知识问答准确率、产品文档理解、技术深度" },
  { key: "action", label: "任务完成率", labelEn: "Action & Task Completion", weight: 0.25, color: "#10B981", description: "任务完成率、操作指引准确性、故障排查能力" },
  { key: "performance", label: "性能与性价比", labelEn: "Performance & Cost", weight: 0.20, color: "#F59E0B", description: "响应延迟、吞吐量、Token 效率、性价比" },
  { key: "engagement", label: "交互质量", labelEn: "Engagement & Dialogue", weight: 0.15, color: "#8B5CF6", description: "多轮对话质量、上下文保持、意图理解" },
  { key: "risk", label: "安全合规", labelEn: "Risk & Safety", weight: 0.15, color: "#EF4444", description: "安全合规性、幻觉率、越狱防护、数据隐私" },
];

/* ------------------------------------------------------------------ */
/*  COVR Four-Dimension Model                                          */
/* ------------------------------------------------------------------ */
export interface COVRDimension {
  key: string;
  label: string;
  weight: number;
  color: string;
  description: string;
  subItems: string[];
}

export const COVR_DIMENSIONS: COVRDimension[] = [
  { key: "coverage", label: "内容覆盖度 (C)", weight: 0.35, color: "#3B82F6", description: "产品文档、API 参考、最佳实践、故障案例的覆盖程度", subItems: ["产品文档覆盖", "API 参考覆盖", "最佳实践覆盖", "故障案例覆盖"] },
  { key: "operational", label: "场景覆盖度 (O)", weight: 0.30, color: "#10B981", description: "部署、运维、安全、成本等实际操作场景的覆盖", subItems: ["部署场景", "运维场景", "安全场景", "成本场景"] },
  { key: "version", label: "版本时效性 (V)", weight: 0.20, color: "#F59E0B", description: "与最新产品版本的同步程度、变更追踪", subItems: ["版本同步度", "变更追踪", "新功能覆盖", "废弃标记"] },
  { key: "representation", label: "语言质量度 (R)", weight: 0.15, color: "#8B5CF6", description: "中英文质量、双语对齐、代码示例质量", subItems: ["中文质量", "英文质量", "双语对齐", "代码示例"] },
];

/* ------------------------------------------------------------------ */
/*  LLM-as-Judge Evaluation Criteria                                   */
/* ------------------------------------------------------------------ */
export interface JudgeCriterion {
  key: string;
  label: string;
  weight: number;
  color: string;
  description: string;
}

export const JUDGE_CRITERIA: JudgeCriterion[] = [
  { key: "factual_accuracy", label: "事实准确性", weight: 0.35, color: "#3B82F6", description: "技术参数、服务特性、版本信息是否准确" },
  { key: "completeness", label: "完整性", weight: 0.25, color: "#10B981", description: "是否覆盖了问题的关键方面" },
  { key: "clarity", label: "清晰度", weight: 0.20, color: "#F59E0B", description: "表述是否清晰易懂、结构合理" },
  { key: "code_example", label: "代码示例", weight: 0.20, color: "#8B5CF6", description: "代码/命令是否正确、可执行" },
];

export const JUDGE_SCORE_LEVELS = [
  { score: 10, label: "完美", description: "完全正确，超出预期，包含注意事项和替代方案" },
  { score: 8, label: "优秀", description: "正确，满足所有要求，少量细节可完善" },
  { score: 6, label: "良好", description: "方向正确，部分信息不准确或不完整" },
  { score: 4, label: "一般", description: "有明显错误，但部分内容有价值" },
  { score: 2, label: "较差", description: "方向错误或信息严重过时" },
  { score: 0, label: "失败", description: "完全错误或无法回答" },
];

/* ------------------------------------------------------------------ */
/*  Pipeline Stages                                                    */
/* ------------------------------------------------------------------ */
export type PipelineStageStatus = "pending" | "running" | "complete" | "skipped";

export interface PipelineStage {
  key: string;
  label: string;
  description: string;
}

export const PIPELINE_STAGES: PipelineStage[] = [
  { key: "preparation", label: "准备阶段", description: "确认测评对象、准备题库、搭建环境" },
  { key: "auto_eval", label: "自动化测评", description: "静态题库批量测试、LLM-as-Judge 评分" },
  { key: "manual_eval", label: "人工测评", description: "专家评估、实操场景测试" },
  { key: "analysis", label: "数据分析", description: "多维度评分汇总、统计检验" },
  { key: "report", label: "报告发布", description: "排行榜生成、测评报告" },
];

/* ------------------------------------------------------------------ */
/*  Grade Config                                                       */
/* ------------------------------------------------------------------ */
export const EVAL_GRADES = [
  { min: 90, grade: "S", label: "卓越", color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700/40" },
  { min: 80, grade: "A", label: "优秀", color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700/40" },
  { min: 70, grade: "B", label: "良好", color: "text-sky-600", bg: "bg-sky-50 dark:bg-sky-900/20 border-sky-200 dark:border-sky-700/40" },
  { min: 60, grade: "C", label: "合格", color: "text-orange-600", bg: "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700/40" },
  { min: 0, grade: "D", label: "不推荐", color: "text-red-600", bg: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700/40" },
];

export function getGrade(score: number) {
  return EVAL_GRADES.find(g => score >= g.min) || EVAL_GRADES[EVAL_GRADES.length - 1];
}

/* ------------------------------------------------------------------ */
/*  Question Selection: 2 per dimension                                */
/* ------------------------------------------------------------------ */
export function selectQuestionsPerDimension(
  dims: K8sDimension[],
  count: number = 2,
): K8sTestQuestion[] {
  const selected: K8sTestQuestion[] = [];
  for (const dim of dims) {
    const pool = K8S_TEST_QUESTIONS.filter(q => q.dimension === dim);
    if (pool.length === 0) continue;

    // Pick 1 easy/medium + 1 hard when count=2
    const easyMed = pool.filter(q => q.difficulty === "easy" || q.difficulty === "medium");
    const hard = pool.filter(q => q.difficulty === "hard");

    if (count >= 2 && easyMed.length > 0 && hard.length > 0) {
      selected.push(easyMed[0]);
      selected.push(hard[0]);
    } else {
      // fallback: pick first `count` questions
      selected.push(...pool.slice(0, count));
    }
  }
  return selected;
}

/* ------------------------------------------------------------------ */
/*  Pipeline Stage Inference                                           */
/* ------------------------------------------------------------------ */
export function inferPipelineStage(
  completed: number,
  total: number,
  isRunning: boolean,
): Record<string, PipelineStageStatus> {
  if (!isRunning && completed === 0) {
    return {
      preparation: "pending",
      auto_eval: "pending",
      manual_eval: "pending",
      analysis: "pending",
      report: "pending",
    };
  }

  if (isRunning && completed === 0) {
    return {
      preparation: "complete",
      auto_eval: "running",
      manual_eval: "pending",
      analysis: "pending",
      report: "pending",
    };
  }

  if (isRunning && completed > 0 && completed < total) {
    return {
      preparation: "complete",
      auto_eval: "running",
      manual_eval: "pending",
      analysis: "pending",
      report: "pending",
    };
  }

  if (completed >= total && completed > 0) {
    return {
      preparation: "complete",
      auto_eval: "complete",
      manual_eval: "skipped",
      analysis: "complete",
      report: "complete",
    };
  }

  return {
    preparation: "complete",
    auto_eval: "running",
    manual_eval: "pending",
    analysis: "pending",
    report: "pending",
  };
}

/* ------------------------------------------------------------------ */
/*  Dimension → CAPER mapping (for aggregation)                        */
/* ------------------------------------------------------------------ */
const DIM_TO_CAPER: Record<string, string> = {
  core_concepts: "correctness",
  api_objects: "correctness",
  terminology: "correctness",
  feature_explanation: "correctness",
  config_writing: "action",
  error_analysis: "action",
  troubleshooting: "action",
  change_plan: "action",
  ops_knowledge: "performance",
  command_parsing: "performance",
  log_analysis: "performance",
  alert_handling: "engagement",
  best_practices: "engagement",
  version_timeliness: "risk",
  version_upgrade: "risk",
};

export function mapDimensionScoresToCAPER(
  dimScores: Record<string, number>,
): Record<string, number> {
  const buckets: Record<string, number[]> = {};
  for (const caper of CAPER_DIMENSIONS) {
    buckets[caper.key] = [];
  }
  for (const [dim, score] of Object.entries(dimScores)) {
    const caperKey = DIM_TO_CAPER[dim] || "correctness";
    buckets[caperKey]?.push(score);
  }
  const result: Record<string, number> = {};
  for (const [key, scores] of Object.entries(buckets)) {
    result[key] = scores.length > 0
      ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10
      : 0;
  }
  return result;
}

/* ------------------------------------------------------------------ */
/*  Dimension → COVR mapping                                           */
/* ------------------------------------------------------------------ */
const DIM_TO_COVR: Record<string, string> = {
  core_concepts: "coverage",
  api_objects: "coverage",
  terminology: "coverage",
  feature_explanation: "coverage",
  ops_knowledge: "operational",
  config_writing: "operational",
  troubleshooting: "operational",
  change_plan: "operational",
  version_timeliness: "version",
  version_upgrade: "version",
  error_analysis: "representation",
  alert_handling: "representation",
  log_analysis: "representation",
  best_practices: "representation",
  command_parsing: "representation",
};

export function mapDimensionScoresToCOVR(
  dimScores: Record<string, number>,
): Record<string, number> {
  const buckets: Record<string, number[]> = {};
  for (const covr of COVR_DIMENSIONS) {
    buckets[covr.key] = [];
  }
  for (const [dim, score] of Object.entries(dimScores)) {
    const covrKey = DIM_TO_COVR[dim] || "coverage";
    buckets[covrKey]?.push(score);
  }
  const result: Record<string, number> = {};
  for (const [key, scores] of Object.entries(buckets)) {
    result[key] = scores.length > 0
      ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10
      : 0;
  }
  return result;
}

/* ------------------------------------------------------------------ */
/*  Model definitions                                                  */
/* ------------------------------------------------------------------ */
export interface EvalModel {
  id: string;
  name: string;
  model: string;
  color: string;
}

export const EVAL_MODELS: EvalModel[] = [
  { id: "qwen", name: "Qwen3-Max", model: "qwen-max", color: "#FF6A00" },
  { id: "kimi", name: "Kimi K2.5", model: "kimi-k2.5", color: "#6366F1" },
  { id: "minimax", name: "MiniMax M2.1", model: "MiniMax-M2.1", color: "#10B981" },
];

export const MODEL_NAMES: Record<string, string> = {
  qwen: "Qwen3-Max",
  kimi: "Kimi K2.5",
  minimax: "MiniMax M2.1",
};

export const MODEL_COLORS: Record<string, string> = {
  qwen: "#FF6A00",
  kimi: "#6366F1",
  minimax: "#10B981",
};
