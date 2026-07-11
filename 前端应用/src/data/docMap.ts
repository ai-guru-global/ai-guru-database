/**
 * Document slug → file path mapping
 * Maps each doc slug to its actual markdown file path relative to project root.
 * The Web app is at /Web, so all paths are prefixed with "../" for runtime fetch.
 */

export interface DocEntry {
  slug: string;
  title: string;
  /** File path relative to project root (NOT Web root) */
  filePath: string;
  category: string;
  categoryId: string;
  description: string;
}

export interface DocSection {
  id: string;
  title: string;
  description: string;
  docs: DocEntry[];
}

export const docSections: DocSection[] = [
  {
    id: "root",
    title: "Overview",
    description: "项目概览",
    docs: [
      { slug: "readme", title: "Project README", filePath: "README.md", category: "Overview", categoryId: "root", description: "AI Guru Database 项目介绍与导航" }
    ]
  },
  {
    id: "00",
    title: "AI Introduction",
    description: "AI 全景概览、历史、未来趋势与学习资源",
    docs: [
      { slug: "ai-fundamentals", title: "AI Fundamentals", filePath: "00_AI_Introduction/AI_Fundamentals.md", category: "Introduction", categoryId: "00", description: "AI 基础概念、类型、应用场景与核心技术" },
      { slug: "ai-technology-landscape", title: "Technology Landscape", filePath: "00_AI_Introduction/AI_Technology_Landscape.md", category: "Introduction", categoryId: "00", description: "AI 技术全景图：从机器学习到大模型的技术生态" },
      { slug: "ai-history", title: "History Timeline", filePath: "00_AI_Introduction/AI_History_Timeline.md", category: "Introduction", categoryId: "00", description: "AI 发展史：从 1950 年图灵测试到 2026 年 AGI 探索" },
      { slug: "ai-tools", title: "Tools & Practice Guide", filePath: "00_AI_Introduction/AI_Tools_Practical_Guide.md", category: "Introduction", categoryId: "00", description: "AI 工具实践指南与动手实验" },
      { slug: "ai-ethics", title: "Ethics & Society", filePath: "00_AI_Introduction/AI_Ethics_Society.md", category: "Introduction", categoryId: "00", description: "AI 伦理与社会影响" },
      { slug: "ai-future", title: "Future Trends", filePath: "00_AI_Introduction/AI_Future_Trends.md", category: "Introduction", categoryId: "00", description: "AI 未来趋势与发展方向" },
      { slug: "ai-learning", title: "Learning Resources", filePath: "00_AI_Introduction/AI_Learning_Resources.md", category: "Introduction", categoryId: "00", description: "AI 学习资源推荐" },
      { slug: "ai-classic-cases", title: "Classic Cases", filePath: "00_AI_Introduction/AI_Classic_Cases.md", category: "Introduction", categoryId: "00", description: "AI 经典案例分析" },
      { slug: "ai-glossary", title: "AI Glossary", filePath: "00_AI_Introduction/AI_Glossary.md", category: "Introduction", categoryId: "00", description: "双语 AI 术语表" },
      { slug: "ai-practical-labs", title: "Practical Labs", filePath: "00_AI_Introduction/AI_Practical_Labs.md", category: "Introduction", categoryId: "00", description: "AI 实践实验室" },
    ],
  },
  {
    id: "01",
    title: "Fundamentals",
    description: "数学基础：线性代数、概率统计、数据结构、分布式系统、AI 硬件",
    docs: [
      { slug: "linear-algebra", title: "Linear Algebra", filePath: "01_Fundamentals/Linear_Algebra/Linear_Algebra.md", category: "Fundamentals", categoryId: "01", description: "向量、矩阵、张量、特征值分解、PCA" },
      { slug: "probability", title: "Probability & Statistics", filePath: "01_Fundamentals/Probability_Statistics/Probability_Statistics.md", category: "Fundamentals", categoryId: "01", description: "贝叶斯定理、KL 散度、MLE/MAP、采样方法" },
      { slug: "data-structures", title: "Data Structures & Algorithms", filePath: "01_Fundamentals/Data_Structures_Algorithms/Data_Structures_Algorithms.md", category: "Fundamentals", categoryId: "01", description: "数据结构与算法基础" },
      { slug: "distributed-systems", title: "Distributed Systems", filePath: "01_Fundamentals/Distributed_Systems/Distributed_Systems.md", category: "Fundamentals", categoryId: "01", description: "分布式系统基础" },
      { slug: "ai-hardware", title: "AI Hardware 2026", filePath: "01_Fundamentals/AI_Hardware/AI_Hardware_2026.md", category: "Fundamentals", categoryId: "01", description: "GPU/TPU/NVLink 等 AI 芯片架构" },
    ],
  },
  {
    id: "02",
    title: "Machine Learning",
    description: "监督/无监督/强化学习、特征工程、迁移学习、联邦学习",
    docs: [
      { slug: "supervised-learning", title: "Supervised Learning", filePath: "02_Machine_Learning/Supervised_Learning/Supervised_Learning.md", category: "Machine Learning", categoryId: "02", description: "线性回归、决策树、XGBoost、SVM、集成学习" },
      { slug: "unsupervised-learning", title: "Unsupervised Learning", filePath: "02_Machine_Learning/Unsupervised_Learning/Unsupervised_Learning.md", category: "Machine Learning", categoryId: "02", description: "K-Means、PCA、GMM、异常检测" },
      { slug: "feature-engineering", title: "Feature Engineering", filePath: "02_Machine_Learning/Feature_Engineering/Feature_Engineering.md", category: "Machine Learning", categoryId: "02", description: "特征选择、特征交叉、数据清洗、EDA" },
    ],
  },
  {
    id: "03",
    title: "Deep Learning",
    description: "神经网络核心、优化理论、World Models、JEPA 架构",
    docs: [
      { slug: "neural-network-core", title: "Neural Network Core", filePath: "03_Deep_Learning/Neural_Network_Core/Neural_Network_Core.md", category: "Deep Learning", categoryId: "03", description: "MLP、CNN、RNN/LSTM、反向传播、激活函数" },
      { slug: "optimization", title: "Optimization", filePath: "03_Deep_Learning/Optimization/Optimization.md", category: "Deep Learning", categoryId: "03", description: "梯度下降、Adam/AdamW、学习率调度" },
      { slug: "world-models", title: "World Models 2026", filePath: "03_Deep_Learning/World_Models/World_Models_2026.md", category: "Deep Learning", categoryId: "03", description: "世界模型、视频预测与具身智能" },
      { slug: "jepa", title: "JEPA Architecture 2026", filePath: "03_Deep_Learning/World_Models/JEPA_Architecture_2026.md", category: "Deep Learning", categoryId: "03", description: "JEPA 架构、V-JEPA、自监督学习" },
    ],
  },
  {
    id: "04",
    title: "NLP & LLMs",
    description: "Transformer、LLM 架构、微调、Prompt 工程、多模态模型",
    docs: [
      { slug: "transformer", title: "Transformer Revolution", filePath: "05_NLP_LLMs/Transformer_Revolution/Transformer_Revolution.md", category: "NLP & LLMs", categoryId: "05", description: "Attention Is All You Need — 现代 NLP 基石" },
      { slug: "llm-architectures", title: "LLM Architectures", filePath: "05_NLP_LLMs/LLM_Architectures/LLM_Architectures.md", category: "NLP & LLMs", categoryId: "05", description: "GPT、LLaMA、DeepSeek、MoE、SSM/Mamba" },
      { slug: "sequence-models", title: "Sequence Models", filePath: "05_NLP_LLMs/Sequence_Models/Sequence_Models.md", category: "NLP & LLMs", categoryId: "05", description: "序列模型：RNN、LSTM、GRU 到 Transformer" },
      { slug: "fine-tuning", title: "Fine-tuning (LoRA/QLoRA/DoRA)", filePath: "05_NLP_LLMs/Fine_tuning_Techniques/Fine_tuning_Techniques.md", category: "NLP & LLMs", categoryId: "05", description: "LoRA、QLoRA、DoRA、RLHF、DPO、GRPO" },
      { slug: "peft-2026", title: "PEFT 2026", filePath: "05_NLP_LLMs/Fine_tuning_Techniques/PEFT_2026/PEFT_2026.md", category: "NLP & LLMs", categoryId: "05", description: "2026 参数高效微调最新进展" },
      { slug: "prompt-engineering", title: "Prompt Engineering", filePath: "05_NLP_LLMs/Prompt_Engineering/Prompt_Engineering.md", category: "NLP & LLMs", categoryId: "05", description: "CoT、ToT、ReAct、Few-Shot Prompting" },
      { slug: "multimodal", title: "Multimodal Architectures 2026", filePath: "05_NLP_LLMs/Multimodal_Models/Multimodal_Architectures_2026.md", category: "NLP & LLMs", categoryId: "05", description: "CLIP、LLaVA、GPT-4o、Qwen-VL 多模态融合" },
    ],
  },
  {
    id: "05",
    title: "Computer Vision",
    description: "图像分类/检测、分割 (SAM)、生成模型、视频生成、多模态视觉",
    docs: [
      { slug: "image-classification-detection", title: "Image Classification & Detection", filePath: "04_Computer_Vision/Image_Classification_Detection/Image_Classification_Detection.md", category: "Computer Vision", categoryId: "04", description: "CNN、ViT、YOLO、DETR、Grounding DINO" },
      { slug: "segmentation", title: "Segmentation (SAM/SAM2)", filePath: "04_Computer_Vision/Segmentation/Segmentation.md", category: "Computer Vision", categoryId: "04", description: "语义/实例/全景分割、Segment Anything Model" },
      { slug: "generative-models", title: "Generative Models", filePath: "04_Computer_Vision/Generative_Models/Generative_Models.md", category: "Computer Vision", categoryId: "04", description: "GAN、Diffusion Model、Stable Diffusion、FLUX" },
      { slug: "video-generation", title: "Video Generation 2026", filePath: "04_Computer_Vision/Video_Generation/Video_Generation_2026.md", category: "Computer Vision", categoryId: "04", description: "Sora、Kling、Runway — AI 视频生成" },
      { slug: "multimodal-vision", title: "Multimodal Vision", filePath: "04_Computer_Vision/Multimodal_Vision/Multimodal_Vision.md", category: "Computer Vision", categoryId: "04", description: "多模态视觉理解与生成" },
    ],
  },
  {
    id: "06",
    title: "Reinforcement Learning & Agents",
    description: "RL 基础、Deep RL、AI Agent、具身智能/机器人",
    docs: [
      { slug: "rl-foundations", title: "RL Foundations (MDP/PPO)", filePath: "06_Reinforcement_Learning/RL_Foundations/RL_Foundations.md", category: "Reinforcement Learning", categoryId: "06", description: "MDP、Bellman、Q-Learning、Policy Gradient、PPO" },
      { slug: "deep-rl", title: "Deep RL", filePath: "06_Reinforcement_Learning/Deep_RL/Deep_RL.md", category: "Reinforcement Learning", categoryId: "06", description: "DQN、A3C、SAC、GRPO、多智能体 RL" },
      { slug: "ai-agents", title: "AI Agents & Protocols", filePath: "06_Reinforcement_Learning/AI_Agents/AI_Agents.md", category: "Reinforcement Learning", categoryId: "06", description: "ReAct、MCP/A2A/AG-UI、LangChain、Coding Agent" },
      { slug: "robotics-embodied-ai", title: "Robotics & Embodied AI", filePath: "06_Reinforcement_Learning/Robotics_Embodied_AI/Embodied_AI_2026.md", category: "Reinforcement Learning", categoryId: "06", description: "VLA (π0/RT-2)、Sim2Real、Digital Twin、模仿学习" },
    ],
  },
  {
    id: "07",
    title: "AI Engineering",
    description: "RAG 系统、部署推理、MLOps、LLMOps、模型评估、编码助手",
    docs: [
      { slug: "rag-systems", title: "RAG Systems", filePath: "14_RAG_Systems/RAG_Systems.md", category: "AI Engineering", categoryId: "14", description: "Naive/Advanced/Graph/Agentic RAG" },
      { slug: "rag-advanced", title: "RAG Advanced 2026", filePath: "14_RAG_Systems/RAG_Advanced_2026.md", category: "AI Engineering", categoryId: "14", description: "2026 RAG 高级技术与架构" },
      { slug: "deployment-inference", title: "Deployment & Inference", filePath: "10_Deployment_Inference/Deployment_Inference.md", category: "AI Engineering", categoryId: "10", description: "vLLM、TensorRT-LLM、量化、Speculative Decoding" },
      { slug: "mlops-pipeline", title: "MLOps Pipeline", filePath: "11_MLOps_Pipeline/MLOps_Pipeline.md", category: "AI Engineering", categoryId: "11", description: "Kubeflow、MLflow、模型注册、Drift 监控" },
      { slug: "model-evaluation", title: "Model Evaluation", filePath: "08_Model_Evaluation/Model_Evaluation.md", category: "AI Engineering", categoryId: "08", description: "MMLU、HumanEval、MT-Bench、LLM-as-Judge" },
      { slug: "model-training", title: "Model Training", filePath: "07_Model_Training/Model-Training-in-nutshell.md", category: "AI Engineering", categoryId: "07", description: "分布式训练、DeepSpeed、Megatron-LM" },
      { slug: "ai-coding-assistants", title: "AI Coding Assistants", filePath: "16_AI_Coding/AI_Coding_Assistants_2026.md", category: "AI Engineering", categoryId: "16", description: "Cursor、Windsurf、Copilot、Devin" },
      { slug: "vibe-coding-methodology", title: "Vibe Coding Methodology 2026", filePath: "16_AI_Coding/Vibe_Coding_Methodology_2026.md", category: "AI Engineering", categoryId: "16", description: "自然语言驱动开发方法论: DGRV循环、提示工程、质量体系" },
      { slug: "vibe-coding-production", title: "Vibe Coding Production Practices", filePath: "16_AI_Coding/Vibe_Coding_Production_Practices.md", category: "AI Engineering", categoryId: "16", description: "Vibe Coding 生产环境实战: 安全、CI/CD、案例分析" },
      { slug: "vibe-coding-for-dummy", title: "Vibe Coding for Dummies", filePath: "16_AI_Coding/Vibe_Coding_for_dummy.md", category: "AI Engineering", categoryId: "16", description: "Vibe Coding 5分钟入门指南+实战练习" },
      { slug: "ai-infrastructure", title: "AI Infrastructure 2026", filePath: "12_Architecture_Infrastructure/AI_Infrastructure_2026.md", category: "AI Engineering", categoryId: "12", description: "Flash Attention、GPU 集群、推理优化" },
      { slug: "agent-production", title: "Agent Production", filePath: "15_Agent_Production/Enterprise_Agent/Agent_Production_2026.md", category: "AI Engineering", categoryId: "15", description: "Agent 生产化部署与运维" },
      { slug: "ai-workflow", title: "AI Workflow", filePath: "15_Agent_Production/Agent_Workflow/Workflow-in-nutshell.md", category: "AI Engineering", categoryId: "15", description: "AI 工作流编排与自动化" },
    ],
  },
  {
    id: "08",
    title: "Ethics & Safety",
    description: "AI 安全、Red Teaming、可解释性、价值对齐、治理",
    docs: [
      { slug: "ai-safety-redteaming", title: "AI Safety & Red Teaming", filePath: "17_Ethics_Safety/AI_Safety_RedTeaming/AI_Safety_RedTeaming.md", category: "Ethics & Safety", categoryId: "17", description: "Red Teaming、对抗攻击、安全评估" },
      { slug: "ai-security", title: "AI Security 2026", filePath: "17_Ethics_Safety/AI_Security_2026/AI_Security_2026.md", category: "Ethics & Safety", categoryId: "17", description: "Prompt Injection、AI 水印、前沿模型风险" },
      { slug: "value-alignment", title: "Value Alignment", filePath: "17_Ethics_Safety/Value_Alignment/Value_Alignment.md", category: "Ethics & Safety", categoryId: "17", description: "RLHF、Constitutional AI、机制可解释性" },
    ],
  },
  {
    id: "09",
    title: "Talks & Insights",
    description: "21 位 AI 领袖人物演讲解读",
    docs: [
      { slug: "geoffrey-hinton", title: "Geoffrey Hinton", filePath: "19_Talks/Geoffrey_Hinton/about.md", category: "Talks", categoryId: "19", description: "深度学习之父 Hinton 演讲解读" },
      { slug: "yann-lecun", title: "Yann LeCun", filePath: "19_Talks/Yann_LeCun/about.md", category: "Talks", categoryId: "19", description: "LeCun 关于 JEPA 与世界模型的洞察" },
      { slug: "andrej-karpathy", title: "Andrej Karpathy", filePath: "19_Talks/Andrej_Karpathy/about.md", category: "Talks", categoryId: "19", description: "Karpathy 关于 LLM 与 AI 趋势" },
      { slug: "sam-altman", title: "Sam Altman", filePath: "19_Talks/Sam_Altman/about.md", category: "Talks", categoryId: "19", description: "OpenAI CEO 关于 AGI 的演讲" },
      { slug: "ilya-sutskever", title: "Ilya Sutskever", filePath: "19_Talks/Ilya_Sutskever/about.md", category: "Talks", categoryId: "19", description: "Sutskever 关于超级智能的思考" },
      { slug: "dario-amodei", title: "Dario Amodei", filePath: "19_Talks/Dario_Amodei/about.md", category: "Talks", categoryId: "19", description: "Anthropic CEO 关于 AI 安全" },
      { slug: "fei-fei-li", title: "Fei-Fei Li", filePath: "19_Talks/Fei_Fei_Li/about.md", category: "Talks", categoryId: "19", description: "李飞飞关于计算机视觉与空间智能" },
      { slug: "demis-hassabis", title: "Demis Hassabis", filePath: "19_Talks/Demis_Hassabis/about.md", category: "Talks", categoryId: "19", description: "DeepMind CEO 关于 AI for Science" },
      { slug: "andrew-ng", title: "Andrew Ng", filePath: "19_Talks/Andrew_Ng/about.md", category: "Talks", categoryId: "19", description: "吴恩达关于 AI 工程与教育" },
      { slug: "jensen-huang", title: "Jensen Huang", filePath: "19_Talks/Jensen_Huang/about.md", category: "Talks", categoryId: "19", description: "黄仁勋关于 AI 基础设施" },
    ],
  },
  {
    id: "10",
    title: "Papers",
    description: "AI 经典论文解读与参考",
    docs: [
      { slug: "papers-index", title: "Papers Reading List", filePath: "20_Papers/README.md", category: "Papers", categoryId: "20", description: "AI 论文阅读清单" },
    ],
  },
  {
    id: "11",
    title: "Interview Prep",
    description: "21 个 AI 岗位面试准备",
    docs: [
      { slug: "machine-learning-engineer", title: "Machine Learning Engineer", filePath: "21_Interviews/Machine_Learning_Engineer/question_bank.md", category: "Interview", categoryId: "21", description: "ML 工程师面试：算法、系统设计、实战" },
      { slug: "data-scientist", title: "Data Scientist", filePath: "21_Interviews/Data_Scientist/question_bank.md", category: "Interview", categoryId: "21", description: "数据科学家面试：统计、建模、A/B 测试" },
      { slug: "nlp-engineer", title: "NLP Engineer", filePath: "21_Interviews/NLP_Engineer/question_bank.md", category: "Interview", categoryId: "21", description: "NLP 工程师面试准备" },
      { slug: "computer-vision-engineer", title: "Computer Vision Engineer", filePath: "21_Interviews/Computer_Vision_Engineer/question_bank.md", category: "Interview", categoryId: "21", description: "CV 工程师面试准备" },
      { slug: "mlops-engineer", title: "MLOps Engineer", filePath: "21_Interviews/MLOps_Engineer/question_bank.md", category: "Interview", categoryId: "21", description: "MLOps 工程师面试准备" },
      { slug: "ai-research-scientist", title: "AI Research Scientist", filePath: "21_Interviews/AI_Research_Scientist/question_bank.md", category: "Interview", categoryId: "21", description: "AI 研究科学家面试准备" },
      { slug: "prompt-engineer", title: "Prompt Engineer", filePath: "21_Interviews/Prompt_Engineer/question_bank.md", category: "Interview", categoryId: "21", description: "Prompt 工程师面试准备" },
      { slug: "robotics-engineer", title: "Robotics Engineer", filePath: "21_Interviews/Robotics_Engineer/question_bank.md", category: "Interview", categoryId: "21", description: "机器人工程师面试准备" },
      { slug: "ai-security-engineer", title: "AI Security Engineer", filePath: "21_Interviews/AI_Security_Engineer/question_bank.md", category: "Interview", categoryId: "21", description: "AI 安全工程师面试准备" },
      { slug: "llm-platform-engineer", title: "LLM Platform Engineer", filePath: "21_Interviews/LLM_Platform_Engineer/question_bank.md", category: "Interview", categoryId: "21", description: "LLM 平台工程师面试准备" },
    ],
  },
  {
    id: "12",
    title: "Agent Evaluation",
    description: "Agent 评估框架、基准测试、RAPS 模型、测试方法论",
    docs: [
      { slug: "agent-harness", title: "Agent Harness Complete 2026", filePath: "15_Agent_Production/16_Agent_Evaluation/Agent_Harness_Complete_2026.md", category: "Agent Evaluation", categoryId: "15", description: "Agent 评估框架完整指南" },
      { slug: "benchmarking", title: "Benchmarking Criteria", filePath: "15_Agent_Production/16_Agent_Evaluation/Benchmarking/Benchmarking_Criteria.md", category: "Agent Evaluation", categoryId: "15", description: "RAPS 评估模型与基准测试标准" },
      { slug: "evaluation-metrics", title: "Evaluation Metrics", filePath: "15_Agent_Production/16_Agent_Evaluation/Metrics/Evaluation_Metrics.md", category: "Agent Evaluation", categoryId: "15", description: "准确率、延迟、安全性等评估指标" },
      { slug: "testing-framework", title: "Testing Framework", filePath: "15_Agent_Production/16_Agent_Evaluation/Testing_Methodologies/Testing_Framework.md", category: "Agent Evaluation", categoryId: "15", description: "Agent 测试框架与测试套件" },
    ],
  },
  {
    id: "13",
    title: "AI Applications & Industry",
    description: "AI 行业应用：医疗、金融、制造、零售、交通、教育",
    docs: [
      { slug: "ai-applications-industry", title: "AI Applications & Industry", filePath: "18_AI_Applications_Industry/AI_Applications_Industry.md", category: "Industry", categoryId: "18", description: "AI 行业融合：医疗 (AlphaFold)、金融、制造、零售" },
    ],
  },
];

/** Flatten all docs into a single ordered list for navigation */
export const allDocs: DocEntry[] = docSections.flatMap((s) => s.docs);

/** Find a doc by its full slug (e.g. "04-transformer") */
export function findDocByFullSlug(fullSlug: string): DocEntry | undefined {
  // fullSlug format: "XX-slug-name" where XX is the section id
  const dashIdx = fullSlug.indexOf("-");
  if (dashIdx === -1) return undefined;
  const sectionId = fullSlug.substring(0, dashIdx);
  const slug = fullSlug.substring(dashIdx + 1);
  const section = docSections.find((s) => s.id === sectionId);
  return section?.docs.find((d) => d.slug === slug);
}

/** Get prev/next docs for navigation */
export function getNavigation(fullSlug: string) {
  const dashIdx = fullSlug.indexOf("-");
  if (dashIdx === -1) return { prev: undefined, next: undefined };
  const sectionId = fullSlug.substring(0, dashIdx);
  const slug = fullSlug.substring(dashIdx + 1);

  const flatIndex = allDocs.findIndex(
    (d) => d.slug === slug && d.categoryId === sectionId
  );

  return {
    prev: flatIndex > 0 ? allDocs[flatIndex - 1] : undefined,
    next: flatIndex < allDocs.length - 1 ? allDocs[flatIndex + 1] : undefined,
  };
}
