/**
 * Cloud Agent Leaderboard Data
 * Generated from CAPER Five-Dimension Evaluation Framework (2026 Q2)
 */

export interface AgentScore {
  rank: number;
  agentId: string;
  agentName: string;
  vendor: string;
  category: "domestic_cloud" | "international_cloud" | "general_chat" | "devops" | "k8s_eval";
  compositeScore: number;
  grade: "S" | "A" | "B" | "C" | "D";
  dimensions: {
    knowledge: number;
    taskCompletion: number;
    costPerformance: number;
    interaction: number;
    safety: number;
  };
  trend: "up" | "down" | "stable";
  /** K8s-specific evaluation data (only for k8s_eval category) */
  k8sDetail?: {
    corpusCoverage: number;
    qaAbility: number;
    corpusSub: {
      coreConcepts: number;
      apiObjects: number;
      opsKnowledge: number;
      versionTimeliness: number;
    };
    qaSub: {
      basicQa: number;
      configWriting: number;
      clusterOps: number;
      multiTurn: number;
    };
    model: string;
  };
}

export interface LeaderboardMetadata {
  totalAgents: number;
  evaluationDate: string;
  version: string;
  weights: {
    knowledge: number;
    taskCompletion: number;
    costPerformance: number;
    interaction: number;
    safety: number;
  };
}

export const LEADERBOARD_METADATA: LeaderboardMetadata = {
  totalAgents: 18,
  evaluationDate: "2026-04",
  version: "2026 Q2",
  weights: {
    knowledge: 0.25,
    taskCompletion: 0.25,
    costPerformance: 0.20,
    interaction: 0.15,
    safety: 0.15,
  },
};

export const CATEGORY_LABELS: Record<string, string> = {
  all: "总榜",
  domestic_cloud: "国内云厂商",
  international_cloud: "国际云厂商",
  general_chat: "通用对话",
  k8s_eval: "K8s 专项",
};

export const DIMENSION_LABELS: Record<string, string> = {
  knowledge: "知识问答",
  taskCompletion: "任务完成",
  costPerformance: "性价比",
  interaction: "交互质量",
  safety: "安全合规",
};

export const GRADE_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  S: { label: "卓越", color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-100 dark:bg-yellow-900/30" },
  A: { label: "优秀", color: "text-green-600 dark:text-green-400", bg: "bg-green-100 dark:bg-green-900/30" },
  B: { label: "良好", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/30" },
  C: { label: "合格", color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-100 dark:bg-orange-900/30" },
  D: { label: "待改进", color: "text-red-600 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/30" },
};

export const LEADERBOARD_DATA: AgentScore[] = [
  {
    rank: 1, agentId: "claude-agent", agentName: "Claude Agent", vendor: "Anthropic",
    category: "general_chat", compositeScore: 90.51, grade: "S", trend: "stable",
    dimensions: { knowledge: 88.9, taskCompletion: 95.4, costPerformance: 84.19, interaction: 89.25, safety: 94.75 },
  },
  {
    rank: 2, agentId: "chatgpt-agent", agentName: "ChatGPT Agent", vendor: "OpenAI",
    category: "general_chat", compositeScore: 89.96, grade: "A", trend: "up",
    dimensions: { knowledge: 90.3, taskCompletion: 89.32, costPerformance: 83.56, interaction: 93.71, safety: 95.22 },
  },
  {
    rank: 3, agentId: "deepseek-agent", agentName: "DeepSeek Agent", vendor: "深度求索",
    category: "domestic_cloud", compositeScore: 85.31, grade: "A", trend: "up",
    dimensions: { knowledge: 91.51, taskCompletion: 79.23, costPerformance: 83.67, interaction: 91.08, safety: 81.55 },
  },
  {
    rank: 4, agentId: "bedrock-agent", agentName: "AWS Bedrock Agent", vendor: "Amazon",
    category: "international_cloud", compositeScore: 84.88, grade: "A", trend: "stable",
    dimensions: { knowledge: 85.74, taskCompletion: 81.88, costPerformance: 82.34, interaction: 79.78, safety: 96.93 },
  },
  {
    rank: 5, agentId: "azure-agent", agentName: "Azure AI Agent", vendor: "Microsoft",
    category: "international_cloud", compositeScore: 84.07, grade: "A", trend: "up",
    dimensions: { knowledge: 79.48, taskCompletion: 85.26, costPerformance: 82.52, interaction: 81.15, safety: 94.69 },
  },
  {
    rank: 6, agentId: "tongyi-agent", agentName: "通义千问 Agent", vendor: "阿里云",
    category: "domestic_cloud", compositeScore: 83.43, grade: "A", trend: "up",
    dimensions: { knowledge: 87.58, taskCompletion: 84.97, costPerformance: 71.52, interaction: 86.79, safety: 86.49 },
  },
  {
    rank: 7, agentId: "gemini-agent", agentName: "Gemini Agent", vendor: "Google",
    category: "general_chat", compositeScore: 82.67, grade: "A", trend: "stable",
    dimensions: { knowledge: 83.71, taskCompletion: 81.13, costPerformance: 85.28, interaction: 78.71, safety: 83.98 },
  },
  {
    rank: 8, agentId: "vertex-agent", agentName: "GCP Vertex AI Agent", vendor: "Google",
    category: "international_cloud", compositeScore: 79.4, grade: "B", trend: "stable",
    dimensions: { knowledge: 75.88, taskCompletion: 77.51, costPerformance: 75.76, interaction: 82.33, safety: 90.34 },
  },
  {
    rank: 9, agentId: "wenxin-agent", agentName: "文心智能体", vendor: "百度",
    category: "domestic_cloud", compositeScore: 78.47, grade: "B", trend: "down",
    dimensions: { knowledge: 80.62, taskCompletion: 76.34, costPerformance: 76.16, interaction: 76.32, safety: 83.64 },
  },
  {
    rank: 10, agentId: "doubao-agent", agentName: "火山方舟/豆包", vendor: "字节跳动",
    category: "domestic_cloud", compositeScore: 75.78, grade: "B", trend: "up",
    dimensions: { knowledge: 78.37, taskCompletion: 73.22, costPerformance: 67.26, interaction: 85.05, safety: 77.85 },
  },
  {
    rank: 11, agentId: "yuanqi-agent", agentName: "腾讯元器", vendor: "腾讯云",
    category: "domestic_cloud", compositeScore: 74.41, grade: "B", trend: "stable",
    dimensions: { knowledge: 72.22, taskCompletion: 74.15, costPerformance: 76.27, interaction: 77.18, safety: 73.24 },
  },
  {
    rank: 12, agentId: "pangu-agent", agentName: "盘古 Agent", vendor: "华为云",
    category: "domestic_cloud", compositeScore: 73.61, grade: "B", trend: "stable",
    dimensions: { knowledge: 68.35, taskCompletion: 73.87, costPerformance: 69.93, interaction: 80.69, safety: 79.77 },
  },
  {
    rank: 13, agentId: "databricks-agent", agentName: "Databricks Agent", vendor: "Databricks",
    category: "international_cloud", compositeScore: 73.58, grade: "B", trend: "down",
    dimensions: { knowledge: 72.01, taskCompletion: 67.91, costPerformance: 76.83, interaction: 72.99, safety: 81.92 },
  },
  {
    rank: 14, agentId: "spark-agent", agentName: "讯飞星火 Agent", vendor: "科大讯飞",
    category: "domestic_cloud", compositeScore: 73.05, grade: "B", trend: "stable",
    dimensions: { knowledge: 70.8, taskCompletion: 69.22, costPerformance: 68.92, interaction: 83.59, safety: 78.14 },
  },
  {
    rank: 15, agentId: "snowflake-agent", agentName: "Snowflake Cortex", vendor: "Snowflake",
    category: "international_cloud", compositeScore: 69.97, grade: "C", trend: "down",
    dimensions: { knowledge: 66.88, taskCompletion: 68.68, costPerformance: 70.01, interaction: 67.91, safety: 79.26 },
  },
  // K8s 专项评测 - Qwen / Kimi / Minimax
  {
    rank: 16, agentId: "qwen-k8s", agentName: "通义千问 Qwen-Max", vendor: "阿里云",
    category: "k8s_eval", compositeScore: 82.49, grade: "A", trend: "up",
    dimensions: { knowledge: 83.34, taskCompletion: 80.52, costPerformance: 87.53, interaction: 77.35, safety: 89.74 },
    k8sDetail: {
      corpusCoverage: 83.34, qaAbility: 80.52, model: "qwen-max-2025",
      corpusSub: { coreConcepts: 83.44, apiObjects: 85.33, opsKnowledge: 83.02, versionTimeliness: 81.11 },
      qaSub: { basicQa: 81.21, configWriting: 84.62, clusterOps: 82.04, multiTurn: 72.46 },
    },
  },
  {
    rank: 17, agentId: "kimi-k8s", agentName: "Kimi (月之暗面)", vendor: "月之暗面",
    category: "k8s_eval", compositeScore: 79.66, grade: "B", trend: "stable",
    dimensions: { knowledge: 76.50, taskCompletion: 78.80, costPerformance: 87.50, interaction: 84.81, safety: 84.93 },
    k8sDetail: {
      corpusCoverage: 76.50, qaAbility: 78.80, model: "moonshot-v1-128k",
      corpusSub: { coreConcepts: 77.59, apiObjects: 81.52, opsKnowledge: 76.24, versionTimeliness: 68.93 },
      qaSub: { basicQa: 76.88, configWriting: 75.28, clusterOps: 89.27, multiTurn: 73.01 },
    },
  },
  {
    rank: 18, agentId: "minimax-k8s", agentName: "MiniMax abab7", vendor: "MiniMax",
    category: "k8s_eval", compositeScore: 72.75, grade: "B", trend: "stable",
    dimensions: { knowledge: 68.07, taskCompletion: 71.86, costPerformance: 86.34, interaction: 76.87, safety: 81.02 },
    k8sDetail: {
      corpusCoverage: 68.07, qaAbility: 71.86, model: "abab7-chat",
      corpusSub: { coreConcepts: 68.79, apiObjects: 65.71, opsKnowledge: 71.14, versionTimeliness: 66.09 },
      qaSub: { basicQa: 73.33, configWriting: 67.66, clusterOps: 75.33, multiTurn: 70.56 },
    },
  },
];
