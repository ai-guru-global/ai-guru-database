/**
 * K8s Domain Evaluation Data
 * Qwen vs Kimi vs Minimax — Kubernetes corpus coverage & QA ability
 * Source: 07_AI_Engineering/12_Agent_Evaluation/demo/results/k8s_evaluation_results.json
 */

export interface K8sAgentEval {
  id: string;
  name: string;
  vendor: string;
  model: string;
  color: string;          // brand color for charts
  colorLight: string;     // lighter variant
  compositeScore: number;
  grade: "S" | "A" | "B" | "C" | "D";
  corpus: {
    total: number;
    coreConcepts: number;
    apiObjects: number;
    opsKnowledge: number;
    versionTimeliness: number;
  };
  qa: {
    total: number;
    basicQa: number;
    configWriting: number;
    clusterOps: number;
    multiTurn: number;
  };
  auxiliary: {
    costPerformance: number;
    interaction: number;
    safety: number;
  };
}

export const K8S_AGENTS: K8sAgentEval[] = [
  {
    id: "qwen-k8s",
    name: "Qwen3-Max",
    vendor: "阿里云",
    model: "qwen-max",
    color: "#FF6A00",
    colorLight: "#FF6A0033",
    compositeScore: 84.79,
    grade: "A",
    corpus: {
      total: 88.37,
      coreConcepts: 90.46,
      apiObjects: 92.13,
      opsKnowledge: 89.06,
      versionTimeliness: 79.68,
    },
    qa: {
      total: 80.87,
      basicQa: 77.11,
      configWriting: 84.02,
      clusterOps: 81.93,
      multiTurn: 81.26,
    },
    auxiliary: { costPerformance: 87.25, interaction: 80.49, safety: 87.29 },
  },
  {
    id: "kimi-k8s",
    name: "Kimi K2.5",
    vendor: "月之暗面",
    model: "kimi-k2.5",
    color: "#6366F1",
    colorLight: "#6366F133",
    compositeScore: 79.11,
    grade: "B",
    corpus: {
      total: 78.36,
      coreConcepts: 80.38,
      apiObjects: 82.49,
      opsKnowledge: 80.93,
      versionTimeliness: 66.98,
    },
    qa: {
      total: 78.76,
      basicQa: 83.76,
      configWriting: 71.95,
      clusterOps: 83.92,
      multiTurn: 73.32,
    },
    auxiliary: { costPerformance: 81.61, interaction: 78.87, safety: 83.13 },
  },
  {
    id: "minimax-k8s",
    name: "MiniMax M2.1",
    vendor: "MiniMax",
    model: "MiniMax-M2.1",
    color: "#10B981",
    colorLight: "#10B98133",
    compositeScore: 71.76,
    grade: "B",
    corpus: {
      total: 67.23,
      coreConcepts: 74.16,
      apiObjects: 66.53,
      opsKnowledge: 65.30,
      versionTimeliness: 60.10,
    },
    qa: {
      total: 70.64,
      basicQa: 77.90,
      configWriting: 69.91,
      clusterOps: 66.30,
      multiTurn: 66.11,
    },
    auxiliary: { costPerformance: 85.23, interaction: 74.79, safety: 82.74 },
  },
];

export const CORPUS_DIMENSIONS = [
  { key: "coreConcepts" as const, label: "核心概念", icon: "⎈" },
  { key: "apiObjects" as const, label: "API 对象", icon: "◈" },
  { key: "opsKnowledge" as const, label: "运维知识", icon: "⚙" },
  { key: "versionTimeliness" as const, label: "版本时效", icon: "⏱" },
];

export const QA_DIMENSIONS = [
  { key: "basicQa" as const, label: "基础问答", icon: "💬" },
  { key: "configWriting" as const, label: "配置编写", icon: "📝" },
  { key: "clusterOps" as const, label: "集群运维", icon: "🖥" },
  { key: "multiTurn" as const, label: "多轮对话", icon: "🔄" },
];

export const GRADE_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  S: { label: "卓越", color: "text-amber-300", bg: "bg-amber-900/40 border-amber-700/50" },
  A: { label: "优秀", color: "text-emerald-300", bg: "bg-emerald-900/40 border-emerald-700/50" },
  B: { label: "良好", color: "text-sky-300", bg: "bg-sky-900/40 border-sky-700/50" },
  C: { label: "合格", color: "text-orange-300", bg: "bg-orange-900/40 border-orange-700/50" },
  D: { label: "待改进", color: "text-red-300", bg: "bg-red-900/40 border-red-700/50" },
};

/** Weights used in composite scoring */
export const K8S_WEIGHTS = {
  corpusCoverage: 0.40,
  qaAbility: 0.35,
  costPerformance: 0.10,
  interaction: 0.10,
  safety: 0.05,
};

/**
 * Extended 15-dimension data matching K8s Live evaluation dimensions.
 * Maps existing corpus/qa data + additional simulated dimensions.
 */
export const K8S_EXTENDED_DIMENSIONS = [
  { key: "core_concepts",      label: "核心概念", icon: "⎈" },
  { key: "api_objects",        label: "API 对象", icon: "◈" },
  { key: "ops_knowledge",      label: "运维知识", icon: "⚙" },
  { key: "version_timeliness", label: "版本时效", icon: "⏱" },
  { key: "config_writing",     label: "配置编写", icon: "📝" },
  { key: "error_analysis",     label: "报错分析", icon: "🔴" },
  { key: "alert_handling",     label: "告警处理", icon: "🔔" },
  { key: "version_upgrade",    label: "版本升级", icon: "⬆" },
  { key: "best_practices",     label: "最佳实践", icon: "✅" },
  { key: "terminology",        label: "名词解释", icon: "📖" },
  { key: "command_parsing",    label: "命令解析", icon: "⌨" },
  { key: "log_analysis",       label: "日志分析", icon: "📋" },
  { key: "change_plan",        label: "变更方案", icon: "📐" },
  { key: "troubleshooting",    label: "排查方案", icon: "🔍" },
  { key: "feature_explanation", label: "功能说明", icon: "💡" },
] as const;

/** Extended 15-dimension scores for each agent (matching K8s Live dimensions) */
export const K8S_EXTENDED_SCORES: Record<string, number[]> = {
  "qwen-k8s": [
    90.46, // 核心概念 (corpus.coreConcepts)
    92.13, // API 对象 (corpus.apiObjects)
    89.06, // 运维知识 (corpus.opsKnowledge)
    79.68, // 版本时效 (corpus.versionTimeliness)
    84.02, // 配置编写 (qa.configWriting)
    86.30, // 报错分析
    82.15, // 告警处理
    78.42, // 版本升级
    88.56, // 最佳实践
    91.23, // 名词解释
    83.47, // 命令解析
    85.19, // 日志分析
    80.73, // 变更方案
    84.91, // 排查方案
    87.62, // 功能说明
  ],
  "kimi-k8s": [
    80.38, // 核心概念 (corpus.coreConcepts)
    82.49, // API 对象 (corpus.apiObjects)
    80.93, // 运维知识 (corpus.opsKnowledge)
    66.98, // 版本时效 (corpus.versionTimeliness)
    71.95, // 配置编写 (qa.configWriting)
    76.82, // 报错分析
    73.40, // 告警处理
    68.15, // 版本升级
    79.23, // 最佳实践
    82.67, // 名词解释
    74.58, // 命令解析
    77.31, // 日志分析
    70.49, // 变更方案
    75.86, // 排查方案
    80.12, // 功能说明
  ],
  "minimax-k8s": [
    74.16, // 核心概念 (corpus.coreConcepts)
    66.53, // API 对象 (corpus.apiObjects)
    65.30, // 运维知识 (corpus.opsKnowledge)
    60.10, // 版本时效 (corpus.versionTimeliness)
    69.91, // 配置编写 (qa.configWriting)
    63.47, // 报错分析
    61.28, // 告警处理
    58.92, // 版本升级
    70.85, // 最佳实践
    72.34, // 名词解释
    64.76, // 命令解析
    66.93, // 日志分析
    59.21, // 变更方案
    65.47, // 排查方案
    71.08, // 功能说明
  ],
};
