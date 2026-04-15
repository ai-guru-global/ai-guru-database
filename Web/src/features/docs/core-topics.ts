import type { DocEntry } from "@/data/docMap";

export interface CoreTopicDefinition {
  id: string;
  label: string;
  description: string;
  keywords: string[];
  phrases?: string[];
  categoryIds?: string[];
  categoryNames?: string[];
  filePathHints?: string[];
}

export interface CoreTopicMatch {
  id: string;
  label: string;
  description: string;
  score: number;
  reasons: string[];
}

export interface CoreTopicGroup {
  id: string;
  label: string;
  description: string;
  docCount: number;
  docs: Array<DocEntry & { fullSlug: string }>;
  keywords: string[];
}

interface AnalyzeOptions {
  content?: string;
  definitions?: CoreTopicDefinition[];
  maxTopics?: number;
}

interface BuildGroupOptions {
  contentBySlug?: Record<string, string>;
  definitions?: CoreTopicDefinition[];
  maxTopicsPerDoc?: number;
}

export const DEFAULT_CORE_TOPIC_DEFINITIONS: CoreTopicDefinition[] = [
  {
    id: "foundations-math-systems",
    label: "数学与系统基础",
    description: "覆盖线性代数、概率统计、数据结构、分布式系统与 AI 硬件等底层基础。",
    keywords: ["线性代数", "矩阵", "张量", "贝叶斯", "概率", "算法", "分布式", "硬件", "gpu"],
    phrases: ["data structures", "distributed systems", "linear algebra", "probability statistics"],
    categoryIds: ["00", "01"],
    categoryNames: ["fundamentals", "introduction"],
    filePathHints: ["fundamentals", "linear_algebra", "probability", "distributed_systems", "ai_hardware"],
  },
  {
    id: "machine-learning-modeling",
    label: "机器学习建模",
    description: "关注监督学习、无监督学习、特征工程与传统机器学习方法。",
    keywords: ["监督学习", "无监督", "特征工程", "回归", "决策树", "xgboost", "svm", "聚类"],
    phrases: ["machine learning", "feature engineering", "supervised learning", "unsupervised learning"],
    categoryIds: ["02"],
    categoryNames: ["machine learning"],
    filePathHints: ["machine_learning", "feature_engineering", "supervised_learning", "unsupervised_learning"],
  },
  {
    id: "deep-learning-optimization",
    label: "深度学习与训练优化",
    description: "聚焦神经网络结构、优化算法、世界模型以及训练过程中的核心机制。",
    keywords: ["神经网络", "cnn", "rnn", "lstm", "adam", "梯度下降", "世界模型", "jepa"],
    phrases: ["deep learning", "optimization", "world models", "neural network"],
    categoryIds: ["03"],
    categoryNames: ["deep learning"],
    filePathHints: ["deep_learning", "optimization", "world_models", "neural_network"],
  },
  {
    id: "llm-nlp-reasoning",
    label: "LLM 与语言推理",
    description: "围绕 Transformer、LLM 架构、提示工程、微调和长文本推理。",
    keywords: ["transformer", "llm", "prompt", "微调", "lora", "qlora", "reasoning", "sequence"],
    phrases: ["prompt engineering", "llm architectures", "fine tuning", "sequence models"],
    categoryIds: ["04"],
    categoryNames: ["nlp", "llm"],
    filePathHints: ["nlp_llms", "prompt_engineering", "llm_architectures", "fine_tuning", "transformer"],
  },
  {
    id: "vision-multimodal-generation",
    label: "视觉、多模态与生成",
    description: "覆盖图像理解、分割、视频生成、多模态建模和视觉生成。",
    keywords: ["视觉", "image", "video", "segmentation", "sam", "multimodal", "diffusion", "生成模型"],
    phrases: ["computer vision", "video generation", "multimodal vision", "image classification"],
    categoryIds: ["05"],
    categoryNames: ["computer vision"],
    filePathHints: ["computer_vision", "video_generation", "multimodal_vision", "segmentation"],
  },
  {
    id: "agent-rl-robotics",
    label: "Agent、强化学习与机器人",
    description: "涵盖 RL 基础、Deep RL、Agent 协议、具身智能和机器人系统。",
    keywords: ["agent", "ppo", "rl", "bellman", "robotics", "embodied", "mcp", "policy gradient"],
    phrases: ["reinforcement learning", "deep rl", "ai agents", "embodied ai"],
    categoryIds: ["06"],
    categoryNames: ["reinforcement learning"],
    filePathHints: ["reinforcement_learning", "ai_agents", "deep_rl", "robotics_embodied_ai"],
  },
  {
    id: "rag-retrieval-knowledge",
    label: "RAG 与知识检索",
    description: "聚焦检索增强生成、知识库组织、索引、召回与高级 RAG 架构。",
    keywords: ["rag", "retrieval", "索引", "召回", "embedding", "graph rag", "agentic rag"],
    phrases: ["rag systems", "advanced rag", "knowledge base"],
    categoryIds: ["07"],
    categoryNames: ["ai engineering"],
    filePathHints: ["rag_systems"],
  },
  {
    id: "platform-infra-mlops",
    label: "平台工程与基础设施",
    description: "包括部署推理、MLOps、训练平台、AI 基础设施与生产化能力。",
    keywords: ["部署", "推理", "mlops", "训练", "inference", "kubeflow", "deepspeed", "infrastructure"],
    phrases: ["deployment inference", "model training", "ai infrastructure", "agent production"],
    categoryIds: ["07", "12"],
    categoryNames: ["ai engineering", "agent evaluation"],
    filePathHints: ["deployment_inference", "mlops_pipeline", "model_training", "architecture_infrastructure", "enterprise_agent"],
  },
  {
    id: "evaluation-benchmarking",
    label: "评估与基准测试",
    description: "关注模型评估、Agent 基准测试、评分体系和测试方法论。",
    keywords: ["评估", "benchmark", "metrics", "judge", "leaderboard", "测试框架", "评分"],
    phrases: ["model evaluation", "agent evaluation", "benchmarking criteria", "testing framework"],
    categoryIds: ["07", "12"],
    categoryNames: ["agent evaluation"],
    filePathHints: ["model_evaluation", "agent_evaluation", "benchmarking", "testing_methodologies", "metrics"],
  },
  {
    id: "safety-governance",
    label: "安全、伦理与治理",
    description: "覆盖安全对抗、红队、对齐、治理、可解释性与风险控制。",
    keywords: ["安全", "对齐", "red teaming", "prompt injection", "governance", "ethics", "security"],
    phrases: ["ai safety", "value alignment", "ethics safety"],
    categoryIds: ["08"],
    categoryNames: ["ethics", "safety"],
    filePathHints: ["ethics_safety", "ai_safety", "ai_security", "value_alignment"],
  },
  {
    id: "research-talks-insights",
    label: "研究洞察与人物观点",
    description: "汇总演讲解读、论文阅读和研究者/行业领袖的核心观点。",
    keywords: ["演讲", "insight", "paper", "research", "karpathy", "hinton", "lecun", "altman"],
    phrases: ["talks insights", "papers reading", "about ai trends"],
    categoryIds: ["09", "10"],
    categoryNames: ["talks", "papers"],
    filePathHints: ["talks", "papers"],
  },
  {
    id: "interviews-careers-industry",
    label: "面试、职业与行业应用",
    description: "关注岗位面试、职业方向以及 AI 在行业中的落地应用。",
    keywords: ["面试", "interview", "career", "industry", "医疗", "金融", "制造", "retail"],
    phrases: ["interview prep", "applications industry"],
    categoryIds: ["11", "13"],
    categoryNames: ["interview", "industry"],
    filePathHints: ["interviews", "applications_industry"],
  },
];

function getDocFullSlug(doc: DocEntry) {
  return `${doc.categoryId}-${doc.slug}`;
}

function normalizeText(text: string) {
  return text
    .toLowerCase()
    .replace(/[`*#>()[\]{}|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function createTopicSource(doc: DocEntry, content = "") {
  return normalizeText(
    [doc.title, doc.description, doc.category, doc.filePath, content.slice(0, 5000)].join(" ")
  );
}

function scoreDefinition(source: string, doc: DocEntry, definition: CoreTopicDefinition) {
  const reasons = new Set<string>();
  let score = 0;

  definition.keywords.forEach((keyword) => {
    if (source.includes(keyword.toLowerCase())) {
      score += 3;
      reasons.add(`命中关键词: ${keyword}`);
    }
  });

  definition.phrases?.forEach((phrase) => {
    if (source.includes(phrase.toLowerCase())) {
      score += 4;
      reasons.add(`命中主题短语: ${phrase}`);
    }
  });

  if (
    definition.categoryIds?.includes(doc.categoryId) ||
    definition.categoryNames?.some((name) => doc.category.toLowerCase().includes(name.toLowerCase()))
  ) {
    score += 3;
    reasons.add(`命中文档分类: ${doc.category}`);
  }

  definition.filePathHints?.forEach((hint) => {
    if (doc.filePath.toLowerCase().includes(hint.toLowerCase())) {
      score += 2;
      reasons.add(`命中文档路径: ${hint}`);
    }
  });

  return {
    score,
    reasons: Array.from(reasons),
  };
}

export function analyzeDocumentCoreTopics(
  doc: DocEntry,
  options: AnalyzeOptions = {}
) {
  const definitions = options.definitions ?? DEFAULT_CORE_TOPIC_DEFINITIONS;
  const source = createTopicSource(doc, options.content);

  const matches = definitions
    .map((definition) => {
      const result = scoreDefinition(source, doc, definition);
      return {
        id: definition.id,
        label: definition.label,
        description: definition.description,
        score: result.score,
        reasons: result.reasons,
      };
    })
    .filter((item) => item.score > 0)
    .sort((left, right) => right.score - left.score);

  if (matches.length > 0) {
    return matches.slice(0, options.maxTopics ?? 4);
  }

  const fallback = definitions.find((definition) =>
    definition.categoryIds?.includes(doc.categoryId)
  );

  return fallback
    ? [
        {
          id: fallback.id,
          label: fallback.label,
          description: fallback.description,
          score: 1,
          reasons: [`按文档主分类兜底归类: ${doc.category}`],
        },
      ]
    : [];
}

export function buildCoreTopicMap(
  docs: DocEntry[],
  options: BuildGroupOptions = {}
) {
  const map: Record<string, CoreTopicMatch[]> = {};

  docs.forEach((doc) => {
    const fullSlug = getDocFullSlug(doc);
    map[fullSlug] = analyzeDocumentCoreTopics(doc, {
      content: options.contentBySlug?.[fullSlug],
      definitions: options.definitions,
      maxTopics: options.maxTopicsPerDoc,
    });
  });

  return map;
}

export function buildCoreTopicGroups(
  docs: DocEntry[],
  options: BuildGroupOptions = {}
) {
  const definitions = options.definitions ?? DEFAULT_CORE_TOPIC_DEFINITIONS;
  const topicMap = buildCoreTopicMap(docs, options);

  return definitions
    .map<CoreTopicGroup>((definition) => {
      const matchedDocs = docs
        .map((doc) => ({
          ...doc,
          fullSlug: getDocFullSlug(doc),
        }))
        .filter((doc) =>
          (topicMap[doc.fullSlug] ?? []).some((topic) => topic.id === definition.id)
        );

      return {
        id: definition.id,
        label: definition.label,
        description: definition.description,
        docCount: matchedDocs.length,
        docs: matchedDocs,
        keywords: definition.keywords.slice(0, 5),
      };
    })
    .filter((group) => group.docCount > 0)
    .sort((left, right) => right.docCount - left.docCount);
}

export function createCoreTopicManager(
  initialDefinitions: CoreTopicDefinition[] = DEFAULT_CORE_TOPIC_DEFINITIONS
) {
  let definitions = [...initialDefinitions];

  return {
    getDefinitions() {
      return [...definitions];
    },
    replaceDefinitions(nextDefinitions: CoreTopicDefinition[]) {
      definitions = [...nextDefinitions];
      return this.getDefinitions();
    },
    addDefinition(nextDefinition: CoreTopicDefinition) {
      definitions = [
        ...definitions.filter((definition) => definition.id !== nextDefinition.id),
        nextDefinition,
      ];
      return this.getDefinitions();
    },
    updateDefinition(
      definitionId: string,
      patch: Partial<Omit<CoreTopicDefinition, "id">>
    ) {
      definitions = definitions.map((definition) =>
        definition.id === definitionId
          ? {
              ...definition,
              ...patch,
            }
          : definition
      );
      return this.getDefinitions();
    },
  };
}
