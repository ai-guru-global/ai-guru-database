---
title: AI 概念知识图谱
category: 91-notes
tags: ["notes", "drafts", "ideas", "observations"]
summary: "> AI 全链路概念之间的依赖关系与学习路径"
created: 2026-05-31
updated: 2026-05-31
---

# AI 概念知识图谱

> AI 全链路概念之间的依赖关系与学习路径
> 
> 版本: 2026-04 | 概念数: 800+ | 关系类型: 依赖、前置、关联

---

## 📋 目录

1. [知识图谱总览](#一知识图谱总览)
2. [分层概念依赖](#二分层概念依赖)
3. [学习路径推荐](#三学习路径推荐)
4. [概念映射到文档](#四概念映射到文档)
5. [开源选型对比](#五开源选型对比)
6. [专业领域深度图谱](#六专业领域深度图谱)

---

## 一、知识图谱总览

### 1.1 概念层次结构

```
AI_Full_Stack
│
├── 1. Mathematical_Foundations
│   ├── Linear_Algebra
│   │   ├── Vector → Matrix → Tensor
│   │   ├── Dot_Product → Attention_Mechanism
│   │   └── Eigenvalue → PCA
│   │
│   ├── Probability_Statistics
│   │   ├── Bayesian_Theorem → Bayesian_Neural_Network
│   │   ├── KL_Divergence → VAE
│   │   ├── Entropy → Decision_Tree
│   │   ├── MLE/MAP → Parameter_Estimation
│   │   └── Sampling_Methods → MCMC/Gibbs
│   │
│   ├── Optimization
│   │   ├── Gradient_Descent → Backpropagation
│   │   ├── Adam/AdamW → Transformer_Training
│   │   ├── Convex_Optimization → SVM
│   │   ├── Learning_Rate_Schedule → Cosine/Warmup
│   │   └── Bayesian_Optimization → Hyperparameter_Tuning
│   │
│   ├── Calculus
│   │   ├── Chain_Rule → Backpropagation
│   │   ├── Partial_Derivative → Gradient
│   │   └── Taylor_Expansion → Approximation
│   │
│   ├── Information_Theory
│   │   ├── Cross_Entropy → Classification_Loss
│   │   └── Perplexity → Language_Model_Evaluation
│   │
│   └── Graph_Theory
│       ├── Graph → GNN
│       └── Adjacency_Matrix → Message_Passing
│
├── 2. Machine_Learning
│   ├── Supervised_Learning
│   │   ├── Linear_Regression → Neural_Network
│   │   ├── Logistic_Regression → Classification
│   │   ├── Decision_Tree → Random_Forest → XGBoost/LightGBM
│   │   ├── SVM → Kernel_Method
│   │   └── Ensemble_Methods → Bagging/Boosting/Stacking
│   │
│   ├── Unsupervised_Learning
│   │   ├── KMeans → Clustering
│   │   ├── PCA → Dimensionality_Reduction
│   │   ├── GMM → Mixture_Models
│   │   └── Anomaly_Detection → Isolation_Forest
│   │
│   ├── Transfer_Learning
│   │   ├── Domain_Adaptation → Distribution_Shift
│   │   ├── Pretrain_Finetune → Foundation_Model
│   │   └── Continual_Learning → Catastrophic_Forgetting
│   │
│   ├── Self_Supervised_Learning
│   │   ├── Contrastive_Learning → SimCLR/BYOL
│   │   ├── Masked_Modeling → BERT/MAE
│   │   └── JEPA → World_Model
│   │
│   ├── Meta_Learning
│   │   ├── Few_Shot → Prototypical_Network
│   │   ├── In_Context_Learning → LLM_Emergent
│   │   └── MAML → Task_Adaptation
│   │
│   ├── Feature_Engineering
│   │   ├── Feature_Selection → Filter/Wrapper/Embedded
│   │   ├── Feature_Crossing → Polynomial/Interaction
│   │   ├── Data_Cleaning → Missing_Value/Outlier
│   │   ├── EDA → Visualization/Distribution_Analysis
│   │   └── Auto_Feature_Engineering → Featuretools/TSFresh
│   │
│   ├── Federated_Learning
│   │   ├── FedAvg → Privacy_Preserving
│   │   ├── Differential_Privacy → Secure_Aggregation
│   │   ├── PPML → Privacy_Preserving_ML
│   │   ├── Homomorphic_Encryption → Encrypted_Computation
│   │   ├── Secure_MPC → Multi_Party_Computation
│   │   └── TEE → Trusted_Execution_Environment
│   │
│   ├── Reinforcement_Learning
│   │   ├── MDP → Bellman_Equation
│   │   ├── Q_Learning → DQN
│   │   ├── Policy_Gradient → REINFORCE → PPO
│   │   ├── Actor_Critic → A3C/SAC
│   │   ├── GRPO → LLM_RL
│   │   ├── Reward_Modeling → ORM/PRM
│   │   ├── RLHF → DPO/KTO/RLVR
│   │   └── Multi_Agent_RL → Cooperative/Competitive
│   │
│   └── Deep_Learning
│       ├── MLP → CNN → ResNet/EfficientNet
│       ├── RNN → LSTM/GRU → Transformer
│       ├── GAN → StyleGAN → Diffusion_Model
│       ├── Autoencoder → VAE → VQ-VAE
│       ├── State_Space_Model → S4 → Mamba/Mamba2
│       ├── GNN → GAT → Graph_Transformer
│       ├── Normalization → BatchNorm/LayerNorm/RMSNorm
│       ├── Activation → ReLU/GELU/SwiGLU
│       └── Regularization → Dropout/Weight_Decay
│
├── 3. NLP_Foundations
│   ├── Text_Processing
│   │   ├── Tokenization → BPE/WordPiece/SentencePiece
│   │   ├── Word_Embedding → Word2Vec/GloVe/FastText
│   │   └── Sentence_Embedding → Sentence_Transformers/E5
│   │
│   ├── Classic_NLP_Tasks
│   │   ├── Text_Classification → Sentiment_Analysis
│   │   ├── Named_Entity_Recognition → Sequence_Labeling
│   │   ├── Machine_Translation → Seq2Seq/Attention
│   │   ├── Question_Answering → Reading_Comprehension
│   │   └── Summarization → Abstractive/Extractive
│   │
│   └── Retrieval
│       ├── Bi_Encoder → Dense_Retrieval
│       ├── Cross_Encoder → Reranking
│       ├── Sparse_Retrieval → BM25/TF-IDF
│       └── Hybrid_Search → Dense+Sparse
│
├── 4. Large_Language_Models
│   ├── Architecture
│   │   ├── Transformer → BERT/GPT/T5
│   │   ├── Attention → MultiHead_Attention → GQA/MQA
│   │   ├── Positional_Encoding → RoPE/ALiBi
│   │   ├── Flash_Attention → Memory_Efficient
│   │   ├── Mixture_of_Experts → DeepSeek/Mixtral
│   │   ├── Mixture_of_Depths → Adaptive_Compute
│   │   └── State_Space_LLM → Mamba/Jamba
│   │
│   ├── Scaling
│   │   ├── Scaling_Laws → Chinchilla/Kaplan
│   │   ├── Test_Time_Compute → Inference_Scaling
│   │   ├── Reasoning_Models → o1/o3/DeepSeek_R1
│   │   ├── Long_Context → Ring_Attention/YaRN
│   │   └── Multi_Token_Prediction → Faster_Training
│   │
│   ├── Training
│   │   ├── Pretraining → MLM/Autoregressive/Prefix_LM
│   │   ├── Data_Engineering → Curation/Mixing/Dedup
│   │   ├── Curriculum_Learning → Data_Scheduling
│   │   ├── FineTuning → LoRA/QLoRA/DoRA
│   │   ├── Alignment → RLHF/DPO/KTO/RLVR
│   │   ├── GRPO → Group_Relative_Policy_Optimization
│   │   ├── Reward_Model → ORM/PRM/Verifier
│   │   ├── Knowledge_Distillation → Teacher_Student/On_Policy
│   │   └── Synthetic_Data → Self_Instruct/Evol_Instruct
│   │
│   ├── Inference
│   │   ├── Speculative_Decoding → Draft_Verify
│   │   ├── Structured_Output → Constrained_Decoding/JSON
│   │   ├── KV_Cache → Paged_Attention/Prefix_Caching
│   │   ├── Continuous_Batching → Dynamic_Scheduling
│   │   └── Sampling → Temperature/Top_p/Top_k/Min_p
│   │
│   ├── Evaluation_Benchmarks
│   │   ├── Knowledge → MMLU/MMLU-Pro/GPQA
│   │   ├── Coding → HumanEval/MBPP/SWE-bench
│   │   ├── Reasoning → GSM8K/MATH/ARC
│   │   ├── Dialogue → MT-Bench/Chatbot_Arena/AlpacaEval
│   │   ├── Truthfulness → TruthfulQA/SimpleQA
│   │   ├── Safety → HarmBench/ToxiGen
│   │   ├── Multimodal → MMMU/MMBench
│   │   ├── Chinese → C-Eval/CMMLU
│   │   └── Meta_Eval → LLM_as_Judge/OpenCompass/lm-eval-harness
│   │
│   └── Application
│       ├── Prompt_Engineering → CoT/ToT/ReAct
│       ├── RAG → Vector_Database
│       ├── Agent → Tool_Use
│       ├── Code_Generation → Copilot/Codex
│       ├── Vibe_Coding → DGRV/Prompt_Engineering/Rules_File
│       └── Guardrails → Input/Output_Filtering
│
├── 5. Computer_Vision
│   ├── Image_Classification
│   │   ├── CNN → ResNet/EfficientNet
│   │   ├── ViT → DeiT/Swin_Transformer
│   │   └── Foundation_Model → DINOv2/SigLIP
│   │
│   ├── Object_Detection
│   │   ├── YOLO → YOLOv8/YOLO-World
│   │   ├── DETR → End_to_End_Detection
│   │   └── Open_Vocabulary → Grounding_DINO/OWL-ViT
│   │
│   ├── Segmentation
│   │   ├── Semantic → FCN/DeepLab
│   │   ├── Instance → Mask_R-CNN
│   │   ├── Panoptic → Unified_Segmentation
│   │   └── SAM → SAM2/Segment_Anything
│   │
│   └── 3D_Vision
│       ├── NeRF → Neural_Radiance_Field
│       ├── 3D_Gaussian_Splatting → Real_Time_Rendering
│       ├── Depth_Estimation → Monocular/Stereo
│       └── Point_Cloud → PointNet/PointNet++
│
├── 6. Multimodal_Models
│   ├── Vision_Language
│   │   ├── CLIP → Contrastive_Learning
│   │   ├── ViT → Vision_Encoder
│   │   ├── LLaVA → Instruction_Tuning
│   │   └── Qwen-VL/InternVL → Native_Multimodal
│   │
│   ├── Video
│   │   ├── Temporal_Modeling → V-JEPA
│   │   ├── Video_LLM → Native_Video
│   │   └── Video_Generation → Sora/Kling/Runway
│   │
│   ├── Speech_Audio
│   │   ├── ASR → Whisper/Conformer
│   │   ├── TTS → VALL-E/F5-TTS/CosyVoice
│   │   └── Audio_LLM → Qwen-Audio/SALMONN
│   │
│   ├── 3D_Generation
│   │   ├── NeRF → 3D_Reconstruction
│   │   ├── 3DGS → Gaussian_Splatting_Generation
│   │   └── Point-E/Shap-E → 3D_Assets
│   │
│   ├── Generation
│   │   ├── Diffusion_Model → Stable_Diffusion/FLUX
│   │   ├── Autoregressive → GPT4o/Gemini
│   │   ├── Text_to_Image → DALL-E/Midjourney
│   │   └── Flow_Matching → Rectified_Flow
│   │
│   └── Cross_Modal
│       ├── Contrastive_Learning → CLIP/SigLIP
│       ├── Cross_Attention → Fusion_Strategy
│       └── Omni_Modal → Any_to_Any
│
├── 7. AI_Agents
│   ├── Foundation
│   │   ├── LLM → Agent_Brain
│   │   ├── Tool_Use → Function_Calling
│   │   ├── Memory → Short/Long_Term/Episodic
│   │   ├── Perception → Multimodal_Input
│   │   └── Grounding → Environment_Interaction
│   │
│   ├── Architecture
│   │   ├── ReAct → Reasoning_Acting
│   │   ├── Reflexion → Self_Correction
│   │   ├── MultiAgent → Collaboration/Debate
│   │   ├── Planning → Task_Decomposition/Hierarchical
│   │   └── Human_in_the_Loop → Oversight/Approval
│   │
│   ├── Protocols
│   │   ├── MCP → Tool_Standardization
│   │   ├── A2A → Agent_Communication
│   │   ├── AG-UI → User_Interface_Streaming
│   │   └── UCP → Resource_Scheduling
│   │
│   ├── Frameworks
│   │   ├── LangChain/LangGraph → Workflow_Orchestration
│   │   ├── CrewAI → Role_Based_MultiAgent
│   │   ├── AutoGen → Conversational_Agent
│   │   └── OpenAI_Agents_SDK → Function_Calling
│   │
│   ├── Patterns
│   │   ├── Coding_Agent → Devin/Cursor/Windsurf
│   │   ├── Vibe_Coding → Natural_Language_CodeGen/Human_Review
│   │   ├── DGRV_Loop → Describe_Generate_Review_Verify
│   │   ├── Computer_Use → Browser/Desktop_Agent
│   │   ├── Agentic_RAG → Retrieve_Reason_Act
│   │   ├── Agentic_Loops → Iterative_Refinement
│   │   ├── Workflow_Graphs → DAG_Orchestration
│   │   └── Context_Management → Window/Compression
│   │
│   ├── Security
│   │   ├── Sandboxing → Isolation/Permission
│   │   ├── Agent_Guardrails → Scope_Limiting
│   │   └── Observability → Trace/Log/Monitor
│   │
│   └── Evaluation
│       ├── Agent_Harness → Benchmark
│       ├── GAIA → General_Capability
│       ├── SWE-bench → Coding_Evaluation
│       └── Safety → Red_Teaming
│
├── 8. RAG_Systems
│   ├── RAG_Paradigms
│   │   ├── Naive_RAG → Retrieve_Generate
│   │   ├── Advanced_RAG → Query_Rewrite/HyDE
│   │   ├── Graph_RAG → Knowledge_Graph_Retrieval
│   │   ├── Agentic_RAG → Multi_Step_Retrieval
│   │   └── Multimodal_RAG → Image/Table_Retrieval
│   │
│   ├── Components
│   │   ├── Chunking → Fixed/Semantic/Recursive
│   │   ├── Embedding_Model → BGE/E5/OpenAI
│   │   ├── Vector_Database → Milvus/Pinecone/Qdrant
│   │   ├── Reranking → Cross_Encoder/ColBERT
│   │   └── Hybrid_Search → Dense+Sparse+Keyword
│   │
│   └── Evaluation
│       ├── Faithfulness → Hallucination_Detection
│       ├── Relevance → RAGAS/TruLens
│       └── Context_Quality → Precision/Recall
│
├── 9. Embodied_AI
│   ├── VLA
│   │   ├── Vision_Encoder → ViT/SigLIP
│   │   ├── Language_Model → LLM
│   │   ├── Action_Decoder → Flow_Matching/Diffusion
│   │   └── Models → π0/RT-2/Octo/RDT
│   │
│   ├── Learning_Methods
│   │   ├── Imitation_Learning → Behavior_Cloning/DAgger
│   │   ├── RL_for_Robotics → Sim_Training
│   │   └── Curriculum_Learning → Task_Progression
│   │
│   ├── Robotics
│   │   ├── Manipulation → Grasping/Dexterous
│   │   ├── Navigation → SLAM/Visual_Nav
│   │   ├── Humanoid → Whole_Body_Control
│   │   └── Locomotion → Legged/Wheeled
│   │
│   ├── Sim2Real
│   │   ├── Domain_Randomization → Robustness
│   │   ├── Digital_Twin → Environment_Replica
│   │   ├── Simulation → IsaacGym/MuJoCo
│   │   └── World_Model → JEPA/Video_Prediction
│   │
│   └── Perception
│       ├── Open_Vocabulary → Language_Grounding
│       ├── 3D_Understanding → Point_Cloud/Depth
│       └── Tactile_Sensing → Force/Contact
│
├── 10. AI_Infrastructure
│   ├── Hardware
│   │   ├── GPU → H100/B200/GB300
│   │   ├── TPU → v5p/v6e
│   │   ├── Edge → Jetson/Apple_Neural_Engine
│   │   └── Interconnect → NVLink/InfiniBand
│   │
│   ├── Training_Systems
│   │   ├── Data_Parallel → FSDP/Distributed
│   │   ├── Model_Parallel → Pipeline/Tensor/Expert
│   │   ├── ZeRO → Memory_Optimization
│   │   ├── DeepSpeed → Megatron-LM
│   │   ├── Flash_Attention → IO_Aware_Attention
│   │   └── Checkpointing → Gradient/Activation
│   │
│   ├── Inference_Systems
│   │   ├── vLLM → PagedAttention
│   │   ├── SGLang → Structured_Output
│   │   ├── TensorRT-LLM → NVIDIA_Inference
│   │   ├── Quantization → GPTQ/AWQ/GGUF
│   │   ├── Pruning → Structured/Unstructured
│   │   └── Serving → Triton/Ray_Serve
│   │
│   ├── Data_Infrastructure
│   │   ├── Feature_Store → Feast/Tecton
│   │   ├── Data_Pipeline → ETL/Streaming
│   │   ├── Data_Quality → Validation/Monitoring
│   │   └── Annotation → Label_Studio/Scale
│   │
│   ├── MLOps
│   │   ├── Kubeflow → Pipeline_Orchestration
│   │   ├── MLflow → Experiment_Tracking
│   │   ├── Model_Registry → Versioning/Staging
│   │   ├── Monitoring → Drift_Detection/Alerting
│   │   └── A_B_Testing → Canary/Shadow_Deploy
│   │
│   └── LLMOps
│       ├── Prompt_Management → Version/Template
│       ├── Eval_Pipeline → Auto_Eval/Human_Eval
│       ├── Gateway → Rate_Limit/Routing/Fallback
│       └── Cost_Optimization → Caching/Model_Routing
│
├── 12. AI_for_Science
│   ├── Life_Science
│   │   ├── AlphaFold → Protein_Structure_Prediction
│   │   ├── Drug_Discovery → Molecular_Generation/Virtual_Screening
│   │   ├── Genomics → DNA_Language_Model/Variant_Calling
│   │   └── Medical_Imaging → Pathology_AI/Radiology_AI
│   │
│   ├── Physical_Science
│   │   ├── Weather_Prediction → Pangu-Weather/GraphCast/GenCast
│   │   ├── Materials_Discovery → GNoME/Crystal_Generation
│   │   ├── Physics_Simulation → Neural_PDE/PINN
│   │   └── Molecular_Dynamics → Force_Field/Ab_Initio
│   │
│   ├── Mathematics
│   │   ├── Theorem_Proving → Lean/Coq/AlphaProof
│   │   ├── Symbolic_Regression → Equation_Discovery
│   │   └── Math_Reasoning → DeepSeek-Prover/Minerva
│   │
│   └── Earth_Science
│       ├── Climate_Modeling → Earth_Digital_Twin
│       ├── Remote_Sensing → Satellite_Analysis
│       └── Geological_Survey → Mineral_Exploration
│
└── 13. Safety_Ethics
    ├── Alignment
    │   ├── RLHF → Human_Preference
    │   ├── Constitutional_AI → Principles
    │   └── Red_Teaming → Safety_Evaluation
    │
    ├── Interpretability
    │   ├── Mechanistic_Interpretability → Circuit_Analysis
    │   ├── Feature_Visualization → Activation_Patching
    │   └── Explainable_AI → SHAP/LIME
    │
    ├── Security
    │   ├── Prompt_Injection → Jailbreaking
    │   ├── AI_Watermarking → Content_Authentication
    │   ├── Adversarial_Attack → Robustness
    │   └── Frontier_Model_Risk → Capability_Evaluation
    │
    └── Governance
        ├── EU_AI_Act → Regulation
        ├── Model_Card → Transparency
        ├── Bias → Fairness
        └── Open_Source_Licensing → Model_Release
```

---

## 二、分层概念依赖

### 2.1 核心依赖链

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    核心概念依赖链                                       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  链 1: 从数学到 Transformer                                             │
│  ───────────────────────────                                            │
│  Linear_Algebra → Gradient_Descent → Backpropagation → MLP → CNN →     │
│  ResNet → Attention → Transformer → BERT/GPT → ChatGPT                 │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  链 2: 从 Transformer 到 Agent                                          │
│  ──────────────────────────────                                         │
│  Transformer → GPT → Instruction_Tuning → RLHF → Tool_Use → ReAct →    │
│  Agent → MCP/A2A → MultiAgent                                          │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  链 3: 从 Vision 到 VLA                                                 │
│  ───────────────────────                                                │
│  CNN → ViT → Vision_Transformer → CLIP → Contrastive_Learning →        │
│  Vision_Language_Model → VLA → π0                                      │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  链 4: 从 Training 到 Production                                        │
│  ─────────────────────────────                                          │
│  Training → Checkpoint → Quantization → ONNX → TensorRT →              │
│  vLLM → Production                                                     │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  链 5: 从 Scaling Laws 到 Reasoning                                      │
│  ────────────────────────────────                                       │
│  Scaling_Laws → Chinchilla → MoE → Test_Time_Compute →                 │
│  Reasoning_Models → o1/o3 → Agent_Reasoning                            │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  链 6: 从 Interpretability 到 Governance                                 │
│  ──────────────────────────────────────                                 │
│  Mechanistic_Interpretability → Feature_Circuit → Safety_Evaluation →  │
│  Red_Teaming → Frontier_Risk → EU_AI_Act → Governance                  │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  链 7: 从 Tokenization 到 RAG                                            │
│  ─────────────────────────────                                          │
│  Tokenization → Embedding → Bi_Encoder → Vector_DB → Chunking →       │
│  Hybrid_Search → Reranking → Naive_RAG → Advanced_RAG → Agentic_RAG   │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  链 8: 从 RL 到 LLM Alignment                                           │
│  ─────────────────────────────                                          │
│  MDP → Q_Learning → Policy_Gradient → PPO → RLHF → DPO →              │
│  GRPO → RLVR → Reward_Model → PRM → Reasoning_RL                      │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  链 9: 从 CNN 到 3D Generation                                           │
│  ──────────────────────────────                                         │
│  CNN → Object_Detection → Segmentation → SAM → NeRF →                  │
│  3D_Gaussian_Splatting → Diffusion_3D → World_Simulator                │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  链 10: 从 Agent 到 Computer Use                                         │
│  ─────────────────────────────                                          │
│  LLM → Tool_Use → Function_Calling → MCP → Agent →                     │
│  Computer_Use → Browser_Agent → Coding_Agent → Agentic_IDE             │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  链 11: 从 AI 到 Scientific Discovery                                    │
│  ───────────────────────────────────                                    │
│  DL → GNN → AlphaFold → Protein_Prediction →                           │
│  Drug_Discovery → Molecular_Generation → Clinical_AI                    │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  链 12: 从 Data 到 Feature 到 Model                                      │
│  ────────────────────────────────                                       │
│  Raw_Data → EDA → Data_Cleaning → Feature_Engineering →                │
│  Feature_Selection → Model_Training → Evaluation → Production          │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2.2 概念关联矩阵

| 概念 | 强关联 | 弱关联 |
|------|--------|--------|
| **Transformer** | Attention, BERT, GPT, LLM | CNN, RNN |
| **LLM** | Prompt, RLHF, Agent, RAG | Traditional_NLP |
| **Agent** | Tool_Use, MCP, ReAct, Planning | Chatbot |
| **VLA** | ViT, LLM, Flow_Matching, Robotics | SLAM |
| **JEPA** | Self_Supervised, World_Model, Video | Contrastive_Learning |
| **RAG** | Vector_DB, Embedding, LLM | Fine_tuning |
| **MCP** | Tool, API, Agent, Protocol | Function_Calling |
| **MoE** | Sparse_Activation, Router, Expert | Dense_Model |
| **Scaling_Laws** | Compute, Data, Parameters | Heuristic_Tuning |
| **Test_Time_Compute** | Reasoning, Search, Verification | Standard_Inference |
| **Mamba/SSM** | State_Space, Linear_Attention, Sequence | Transformer |
| **GRPO** | PPO, RLHF, DeepSeek_R1, Reward | DPO |
| **RLVR** | Verifier, Math_Reasoning, Code, RL | SFT |
| **Flash_Attention** | IO_Aware, Training, Inference, Memory | Standard_Attention |
| **Graph_RAG** | Knowledge_Graph, Entity, Relationship | Naive_RAG |
| **SAM** | Segmentation, Foundation_Model, Zero_Shot | Mask_R-CNN |
| **3DGS** | Gaussian_Splatting, NeRF, Real_Time | Point_Cloud |
| **Coding_Agent** | Code_Gen, Tool_Use, IDE, SWE-bench | Copilot |
| **Vibe_Coding** | DGRV_Loop, Prompt_Engineering, Rules_File, Human_Review | Manual_Coding |
| **Digital_Twin** | Simulation, Sim2Real, Robotics | Physical_Model |
| **Imitation_Learning** | Behavior_Cloning, Demo, VLA | RL |
| **AlphaFold** | Protein, GNN, Structure, Biology | Drug_Discovery |
| **MMLU** | Knowledge, Benchmark, Multi-task | HumanEval |
| **Feature_Engineering** | Selection, Crossing, EDA, Pipeline | Raw_Data |
| **PPML** | Federated, Encryption, Privacy | Differential_Privacy |

---

## 三、学习路径推荐

### 3.1 不同角色的学习路径

#### 路径 1: AI 研究员 (Researcher)

```
阶段 1: 基础 (3-6 个月)
├── Linear Algebra → Probability → Optimization
├── Machine Learning → Deep Learning
└── PyTorch/TensorFlow

阶段 2: 专精 (6-12 个月)
├── Transformer Architecture (Attention is All You Need)
├── BERT/GPT Paper Reading
├── Training at Scale (DeepSpeed, Megatron)
└── Experiment Design

阶段 3: 前沿 (持续)
├── Multimodal Models
├── Agent Systems
├── World Models (JEPA)
└── Safety & Alignment
```

#### 路径 2: AI 工程师 (Engineer)

```
阶段 1: 基础 (2-3 个月)
├── Python → PyTorch
├── ML Basics → NLP Foundations
├── Tokenization → Embedding
└── Software Engineering

阶段 2: LLM 工程 (3-6 个月)
├── Prompt Engineering (CoT, Few-Shot)
├── Fine-tuning (LoRA, QLoRA, DoRA)
├── RAG Systems (Naive → Advanced → Graph → Agentic)
├── LLM Deployment (vLLM, Quantization)
├── Structured Output & Guardrails
└── MCP/A2A/AG-UI Integration

阶段 3: Agent 工程 (3-6 个月)
├── LangChain/LangGraph/CrewAI
├── Agent Design Patterns (ReAct, Reflexion)
├── Coding Agent / Computer Use
├── Vibe Coding (DGRV Loop, Rules_File, Human_Review)
├── Tool Development (MCP Server)
├── Production Deployment & LLMOps
└── Observability & Cost Optimization
```

#### 路径 3: 机器人工程师 (Robotics Engineer)

```
阶段 1: 基础 (3-6 个月)
├── ROS/ROS2
├── Kinematics/Dynamics
├── Computer Vision
└── Control Theory

阶段 2: 学习 (6-12 个月)
├── Imitation Learning
├── Reinforcement Learning
├── VLA Models (π0, RDT)
├── Sim2Real
└── ROS-LLM Integration

阶段 3: 集成 (6-12 个月)
├── Multi-modal Perception
├── Whole-body Control
├── Human-Robot Interaction
└── Production Deployment
```

#### 路径 4: AI 安全研究员 (Safety Researcher)

```
阶段 1: 基础 (3-6 个月)
├── Deep Learning → Training Dynamics
├── NLP → LLM Architecture
├── RL Basics → RLHF
└── Statistics → Evaluation Methods

阶段 2: 核心 (6-12 个月)
├── Mechanistic Interpretability
├── Red Teaming Techniques
├── Adversarial Attack / Prompt Injection
├── Alignment (RLHF/DPO/Constitutional AI)
└── Reward Modeling (ORM/PRM)

阶段 3: 前沿 (持续)
├── AI Governance & Policy
├── Frontier Model Evaluation
├── AI Watermarking
├── Scalable Oversight
└── Agent Safety & Sandboxing
```

#### 路径 5: 数据科学家 (Data Scientist)

```
阶段 1: 基础 (2-3 个月)
├── Statistics → Probability → Hypothesis Testing
├── Python → Pandas/NumPy/Matplotlib
└── SQL → Data Querying

阶段 2: 机器学习 (3-6 个月)
├── EDA → Data Visualization
├── Feature Engineering (Selection, Crossing)
├── Supervised Learning (XGBoost, LightGBM)
├── Unsupervised Learning (Clustering, PCA)
└── Model Evaluation (Cross-Validation, A/B Testing)

阶段 3: 进阶 (3-6 个月)
├── Deep Learning → PyTorch
├── NLP / LLM 基础
├── Experiment Tracking (MLflow)
├── Feature Store (Feast)
└── Production ML Pipeline
```

#### 路径 6: RAG/检索工程师 (Retrieval Engineer)

```
阶段 1: 基础 (2-3 个月)
├── NLP → Tokenization → Embedding
├── Information Retrieval (BM25, TF-IDF)
├── Sentence Transformers / Bi-Encoder
└── Vector Database (Milvus, Qdrant)

阶段 2: RAG 系统 (3-6 个月)
├── Naive RAG → Advanced RAG
├── Chunking Strategies
├── Hybrid Search (Dense + Sparse)
├── Reranking (Cross-Encoder, ColBERT)
├── Graph RAG → Knowledge Graph
└── Multimodal RAG

阶段 3: 生产化 (3-6 个月)
├── Agentic RAG
├── Evaluation (RAGAS, Faithfulness)
├── Guardrails & Hallucination Detection
├── Production Optimization
└── LLMOps & Monitoring
```

### 3.2 概念学习顺序

```
必须先学 → 再学 → 最后学

Example 1: 理解 VLA
Linear_Algebra → CNN → ViT → CLIP → 
Vision_Language_Model → VLA → π0

Example 2: 部署 LLM
Transformer → GPT → Fine_tuning → 
Quantization → ONNX → TensorRT → vLLM

Example 3: 构建 Agent
LLM → Tool_Use → ReAct → MCP → 
LangChain → MultiAgent → Computer_Use

Example 4: 理解 Reasoning Models
Scaling_Laws → Test_Time_Compute → 
CoT → Tree_Search → GRPO → PRM → o1/o3

Example 5: 理解 MoE 架构
Transformer → Sparse_Activation → Router → 
Expert_Parallel → DeepSeek_V3 → Mixtral

Example 6: AI 安全研究
Neural_Network → Interpretability → 
Mechanistic_Interpretability → Circuit_Analysis → 
Red_Teaming → Alignment

Example 7: 构建 RAG 系统
Tokenization → Embedding → Vector_DB → 
Chunking → Hybrid_Search → Reranking → 
Naive_RAG → Advanced_RAG → Graph_RAG → Agentic_RAG

Example 8: LLM Alignment
RL_Basics → Policy_Gradient → PPO → 
RLHF → DPO → GRPO → RLVR → PRM/ORM

Example 9: CV 到 3D 生成
CNN → Object_Detection → Segmentation → SAM →
NeRF → 3D_Gaussian_Splatting → Diffusion_3D

Example 10: Coding Agent
LLM → Code_Generation → Tool_Use → MCP →
Sandboxing → SWE-bench → Coding_Agent → Agentic_IDE

Example 10b: Vibe Coding
LLM → Prompt_Engineering → Code_Generation →
Human_Review → Automated_Testing → DGRV_Loop →
Rules_File → CI/CD_Quality_Gate

Example 11: AI for Science
DL → GNN → Protein_Representation → AlphaFold →
Drug_Discovery → Molecular_Generation → Clinical_AI

Example 12: LLM Evaluation
LLM → MMLU → HumanEval → MT-Bench →
LLM_as_Judge → OpenCompass → Chatbot_Arena

Example 13: 数据科学 Pipeline
Raw_Data → EDA → Data_Cleaning →
Feature_Engineering → Feature_Selection →
Model_Training → Evaluation → Deployment
```

---

## 四、概念映射到文档

### 4.1 文档索引

| 概念类别 | 主要文档 | 相关文档 |
|----------|----------|----------|
| **数学基础** | `01_Fundamentals/` | `Linear_Algebra/`, `Probability_Statistics/` |
| **机器学习** | `02_Machine_Learning/` | `Feature_Engineering/`, `Supervised_Learning/`, `Unsupervised_Learning/` |
| **深度学习** | `03_Deep_Learning/` | `Neural_Network_Core/`, `Optimization/`, `World_Models/JEPA_Architecture_2026.md` |
| **NLP 基础** | `04_NLP_LLMs/Sequence_Models/` | `Transformer_Revolution/` |
| **大模型** | `04_NLP_LLMs/LLM_Architectures/` | `Fine_tuning_Techniques/`, `Prompt_Engineering/` |
| **多模态** | `04_NLP_LLMs/Multimodal_Models/` | `05_Computer_Vision/` |
| **计算机视觉** | `05_Computer_Vision/` | `Image_Classification_Detection/`, `Segmentation/`, `Generative_Models/` |
| **强化学习** | `06_Reinforcement_Learning/` | `RL_Foundations/`, `Deep_RL/` |
| **Agent** | `06_Reinforcement_Learning/AI_Agents/` | `Agent_Protocols_Detail.md`, `Agent_Future_Roadmap_2026_2030.md` |
| **RAG 系统** | `11_RAG_Systems/` | `RAG_Advanced_2026/`, `Chroma_Deep_Dive.md` |
| **MoE/Scaling** | `04_NLP_LLMs/LLM_Architectures/` | `AI_Infrastructure_Trends_2026.md` |
| **Reasoning** | `04_NLP_LLMs/LLM_Architectures/` | `Prompt_Engineering.md` |
| **AI for Science** | `13_AI_Applications_Industry/` | `AI_Applications_Industry.md` |
| **评估基准** | `08_Model_Evaluation/` | `13_Agent_Production/16_Agent_Evaluation/`, `Benchmarking/` |
| **特征工程** | `02_Machine_Learning/Feature_Engineering/` | `Feature_Engineering.md` |
| **安全/可解释** | `19_Ethics_Safety/` | `AI_Safety_RedTeaming/`, `AI_Security_2026/`, `Value_Alignment/` |
| **具身智能/VLA** | `06_Reinforcement_Learning/Robotics_Embodied_AI/` | `VLA_Models_2026.md`, `Embodied_AI_Complete_2026.md` |
| **评估** | `13_Agent_Production/16_Agent_Evaluation/` | `Agent_Harness_Complete_2026.md`, `Benchmarking/`, `Metrics/` |
| **基础设施** | `12_Architecture_Infrastructure/` | `AI_Infrastructure_2026.md`, `AI_System_Architecture_2026.md` |
| **LLMOps** | `16_AI_Ops/` | `AI_Ops_2026.md`, `MLflow_Deep_Dive.md` |
| **Vibe Coding** | `17_AI_Coding/04_Methodology/` | `Vibe_Coding_Methodology.md`, `Vibe_Coding_Production_Practices.md`, `Vibe_Coding_for_dummy.md` |

### 4.2 快速查找

```
想找什么？

Q: MCP 协议详解
A: 06_Reinforcement_Learning/AI_Agents/Agent_Protocols_Detail.md

Q: 多模态模型架构
A: 04_NLP_LLMs/Multimodal_Models/Multimodal_Architectures_2026.md

Q: VLA 模型技术
A: 06_Reinforcement_Learning/Robotics_Embodied_AI/VLA_Models_2026.md

Q: JEPA 世界模型
A: 03_Deep_Learning/World_Models/JEPA_Architecture_2026.md

Q: 具身智能完整指南
A: 06_Reinforcement_Learning/Robotics_Embodied_AI/Embodied_AI_Complete_2026.md

Q: Vibe Coding 方法论
A: 17_AI_Coding/04_Methodology/Vibe_Coding_Methodology.md

Q: Vibe Coding 生产环境实践
A: 17_AI_Coding/04_Methodology/Vibe_Coding_Production_Practices.md

Q: Agent 评估框架
A: 13_Agent_Production/16_Agent_Evaluation/Agent_Harness_Complete_2026.md

Q: Agent 未来发展
A: 06_Reinforcement_Learning/AI_Agents/Agent_Future_Roadmap_2026_2030.md

Q: AI 基础设施趋势
A: 12_Architecture_Infrastructure/AI_Infrastructure_2026.md

Q: RAG 系统设计
A: 11_RAG_Systems/

Q: 强化学习基础
A: 06_Reinforcement_Learning/RL_Foundations/

Q: 计算机视觉目标检测
A: 05_Computer_Vision/Image_Classification_Detection/

Q: 图像分割 (SAM)
A: 05_Computer_Vision/Segmentation/

Q: Coding Agent / AI 编码助手
A: 17_AI_Coding/02_Tools/AI_Coding_Assistants_2026.md

Q: LLM 微调 (LoRA/QLoRA)
A: 04_NLP_LLMs/Fine_tuning_Techniques/

Q: 视频生成
A: 05_Computer_Vision/Video_Generation/Video_Generation_2026.md

Q: 分布式训练
A: 01_Fundamentals/Distributed_Systems/

Q: AI 对齐与价值观
A: 19_Ethics_Safety/Value_Alignment/

Q: LLM 评估基准 (MMLU/HumanEval)
A: 08_Model_Evaluation/Model_Evaluation.md

Q: 特征工程
A: 02_Machine_Learning/Feature_Engineering/Feature_Engineering.md

Q: AI for Science (药物研发/蛋白质)
A: 13_AI_Applications_Industry/AI_Applications_Industry.md

Q: 隐私计算/联邦学习
A: 02_Machine_Learning/ (Federated_Learning 相关)

Q: Agent 评估框架 (RAPS/基准测试)
A: 13_Agent_Production/16_Agent_Evaluation/
```

---

## 附录：概念速查表

### A. 2026 热门概念速查

| 概念 | 定义 | 相关技术 | 文档 |
|------|------|----------|------|
| **MCP** | 模型上下文协议 | Agent, Tool | Agent_Protocols_Detail.md |
| **VLA** | 视觉-语言-动作 | Robotics, π0 | VLA_Models_2026.md |
| **JEPA** | 联合嵌入预测架构 | World Model | JEPA_Architecture_2026.md |
| **Flow Matching** | 流匹配生成 | Diffusion, π0 | VLA_Models_2026.md |
| **SGLang** | 结构化生成语言 | Inference | AI_Infrastructure_Trends_2026.md |
| **Agent Harness** | Agent 评估框架 | Evaluation | Agent_Harness_Complete_2026.md |
| **MoE** | 混合专家模型 | DeepSeek, Mixtral | LLM_Architectures.md |
| **Test-Time Compute** | 推理时计算扩展 | o1, Reasoning | LLM_Architectures.md |
| **Mamba/SSM** | 状态空间模型 | Linear Attention | Neural_Network_Core.md |
| **AG-UI** | Agent 用户界面协议 | Agent, UI | Agent_Protocols_Detail.md |
| **Mechanistic Interp.** | 机制可解释性 | Safety, Circuit | AI_Security_2026/ |
| **Speculative Decoding** | 推测解码 | Inference, Speed | AI_Infrastructure_Trends_2026.md |
| **GRPO** | 组相对策略优化 | DeepSeek-R1, RL | LLM_Architectures.md |
| **RLVR** | 可验证奖励强化学习 | Math, Code, Verifier | LLM_Architectures.md |
| **Graph RAG** | 图增强检索生成 | Knowledge Graph | RAG_Advanced_2026/ |
| **Agentic RAG** | 智能体驱动 RAG | Multi-step, Agent | RAG_Advanced_2026/ |
| **SAM/SAM2** | 分割一切模型 | Zero-shot, CV | Segmentation/ |
| **3D Gaussian Splatting** | 3D 高斯泼溅 | NeRF, Rendering | Video_Generation_2026.md |
| **Coding Agent** | 编码智能体 | Devin, SWE-bench | AI_Coding_Assistants/ |
| **Computer Use** | 计算机使用代理 | Browser, Desktop | AI_Agents/ |
| **Digital Twin** | 数字孪生 | Sim2Real, Robotics | Embodied_AI_Complete_2026.md |
| **Flash Attention** | 闪存注意力 | IO-Aware, GPU | AI_Infrastructure_Trends_2026.md |
| **Continuous Batching** | 连续批处理 | Inference, vLLM | Deployment_Inference/ |
| **LLMOps** | 大模型运维 | Eval, Gateway | AI_Infrastructure_Trends_2026.md |
| **MMLU** | 多任务知识评测 | 57 学科, Benchmark | Model_Evaluation.md |
| **HumanEval** | 代码生成评测 | pass@k, Coding | Model_Evaluation.md |
| **MT-Bench** | 多轮对话评测 | LLM-as-Judge | Model_Evaluation.md |
| **AlphaFold** | 蛋白质结构预测 | GNN, Biology | AI_Applications_Industry.md |
| **GraphCast** | AI 天气预报 | Weather, GNN | AI_Applications_Industry.md |
| **AlphaProof** | AI 数学证明 | Lean, Theorem | AI_Applications_Industry.md |

### B. 经典基础概念速查

| 概念 | 定义 | 相关技术 | 文档 |
|------|------|----------|------|
| **Tokenization** | 文本分词 | BPE, SentencePiece | Sequence_Models/ |
| **Embedding** | 向量表示 | Word2Vec, BERT | Sequence_Models/ |
| **Attention** | 注意力机制 | Self/Cross/Multi-Head | Transformer_Revolution/ |
| **Backpropagation** | 反向传播 | Chain Rule, Gradient | Neural_Network_Core/ |
| **CNN** | 卷积神经网络 | ResNet, EfficientNet | Neural_Network_Core/ |
| **RNN/LSTM** | 循环神经网络 | Sequence Modeling | Sequence_Models/ |
| **GAN** | 生成对抗网络 | StyleGAN, Image Gen | Generative_Models/ |
| **RL (MDP)** | 强化学习基础 | Q-Learning, Policy | RL_Foundations/ |
| **PPO** | 近端策略优化 | Actor-Critic, RLHF | Deep_RL/ |
| **Transfer Learning** | 迁移学习 | Pretrain-Finetune | Supervised_Learning/ |
| **Ensemble Methods** | 集成方法 | Bagging, Boosting | Supervised_Learning/ |
| **Object Detection** | 目标检测 | YOLO, DETR | Image_Classification_Detection/ |
| **Segmentation** | 图像分割 | Semantic, Instance | Segmentation/ |
| **Feature Engineering** | 特征工程 | Selection, EDA | Feature_Engineering/ |
| **Federated Learning** | 联邦学习 | FedAvg, Privacy | Distributed_Systems/ |
| **PPML** | 隐私保护 ML | HE, MPC, TEE | AI_Security_2026/ |

---

---

## 五、开源选型对比

### 5.1 向量数据库对比

#### 5.1.1 核心向量数据库横向对比

| 维度 | **Milvus** | **Qdrant** | **Weaviate** | **Pinecone** | **Chroma** | **FAISS** |
|------|-----------|-----------|--------------|--------------|------------|-----------|
| **类型** | 开源 | 开源 | 开源 | 云服务 | 开源 | 开源 (Meta) |
| **语言** | Go | Rust | Go | 托管 | Python | C++/Python |
| **支持向量维度** | 无限制 | 无限制 | 无限制 | 无限制 | 无限制 | 无限制 |
| **索引算法** | HNSW/DiskANN/IVF | HNSW | HNSW | HNSW | HNSW | IVF/HSNW |
| **混合搜索** | ✅ Dense+Sparse | ✅ Sparse+Dense | ✅ 原生混合 | ✅ 需配置 | ❌ | ❌ |
| **全文检索** | ✅ BM25 | ✅ 有限 | ✅ 原生 | ✅ | ❌ | ❌ |
| **多租户** | ✅ Collection | ✅ Named vector | ✅ Namespace | ✅ | ❌ | ❌ |
| **云原生** | ✅ K8s | ✅ Docker/K8s | ✅ K8s | ✅ 原生 | ❌ | ❌ |
| **分布式** | ✅ Mishards | ✅ | ✅ | ✅ | ❌ | ❌ |
| **GPU 加速** | ✅ | ✅ | ❌ | ✅ | ❌ | ✅ |
| **延迟** | 低 | 极低 | 中 | 低 | 极低 | 极低 |
| **数据规模** | 十亿级 | 十亿级 | 亿级 | 十亿级 | 百万级 | 百万级 |
| **许可** | Apache 2.0 | Apache 2.0 | BSD | 专有 | Apache 2.0 | Apache 2.0 |
| **生产案例** | Zilliz Cloud | Qdrant Cloud | Seasearch | 多家企事业 | 小规模 | Meta 内部 |

#### 5.1.2 向量数据库选型决策树

```
需要向量检索？
├── 是
│   ├── 需要混合搜索（向量+关键词）？
│   │   ├── 是 → Qdrant (性能最佳) / Weaviate (功能全面) / Milvus (生态成熟)
│   │   └── 否 → FAISS (轻量) / Chroma (简单原型)
│   │
│   ├── 数据规模？
│   │   ├── 亿级以上 → Milvus (分布式) / Pinecone (云托管)
│   │   └── 千万级以下 → Qdrant / Weaviate / FAISS
│   │
│   ├── 需要云原生/K8s？
│   │   ├── 是 → Qdrant / Milvus / Weaviate
│   │   └── 否 → Chroma (本地) / FAISS (嵌入式)
│   │
│   └── 需要 GPU 加速？
│       ├── 是 → Milvus / Qdrant / FAISS
│       └── 否 → Weaviate / Chroma
│
└── 否 → 传统关系型 + 插件向量扩展
```

#### 5.1.3 关键指标对比

```
向量数据库性能基准 (百万向量, 768维, HNSW)

Qdrant:     ████████████████████ 99.9% < 10ms
Milvus:     ███████████████████░ 99.9% < 15ms
Weaviate:   ██████████████████░░ 99.9% < 25ms
FAISS:      ████████████████████ 99.9% < 8ms (内存)
Pinecone:   ███████████████████░ 99.9% < 12ms

延迟: FAISS > Qdrant > Pinecone > Milvus > Weaviate
功能: Weaviate > Milvus > Qdrant > Pinecone > FAISS
运维: Pinecone > Qdrant > Milvus > Weaviate > FAISS
```

---

### 5.2 LLM 推理引擎对比

#### 5.2.1 推理引擎横向对比

| 维度 | **vLLM** | **SGLang** | **TensorRT-LLM** | **llama.cpp** | **Ollama** | **LM Studio** | **OAI Proxy** |
|------|---------|-----------|-----------------|--------------|-----------|--------------|--------------|
| **开发方** | UC Berkeley | SGLang团队 | NVIDIA | Georgi Gerganov | Ollama团队 | LM Studio | OpenAI兼容 |
| **语言** | Python | Python | C++/CUDA | C++ | Go | Electron | Go |
| **量化支持** | FP16/INT8/INT4 | FP16/INT8 | FP8/INT8/INT4 | 全量化 | INT4/FP16 | INT4/FP16 | 取决于后端 |
| **批处理** | Continuous Batching | RadixBatching | In-Flight Batching | 静态 | 简单 | 简单 | N/A |
| **Prefix Caching** | ✅ Chunked Prefill | ✅ 智能 | ✅ | ❌ | ❌ | ❌ | N/A |
| **投机解码** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | N/A |
| **多模态** | ✅ | ✅ (LLaVA) | ✅ | ❌ | ✅ | ✅ | ✅ |
| **适用场景** | 通用推理 | 结构化输出 | NVIDIA GPU | CPU/Mac | 本地运行 | GUI本地 | API网关 |
| **部署难度** | 中 | 中 | 高 | 低 | 极低 | 极低 | 低 |
| **吞吐量** | 极高 | 极高 | 极高 | 低 | 低 | 低 | 取决于后端 |
| **许可** | Apache 2.0 | Apache 2.0 | NVIDIA EULA | MIT | MIT | 专有 | Apache 2.0 |

#### 5.2.2 推理引擎选型决策树

```
部署环境？
├── NVIDIA 生产 GPU (A100/H100)
│   ├── 需要极致性能 → TensorRT-LLM
│   ├── 需要灵活调试 → vLLM (PagedAttention) / SGLang
│   └── 需要结构化输出 → SGLang (RadixAttention) > vLLM
│
├── 消费级 GPU (4090/3090)
│   ├── 需要高吞吐 → vLLM (INT4/INT8)
│   └── 需要便捷 → Ollama / LM Studio
│
├── CPU / Apple Silicon
│   └── llama.cpp (量化 + Metal GPU)
│
└── API 代理 / 网关
    └── OAI Proxy (兼容 OpenAI 格式)
```

#### 5.2.3 性能对比基准

```
吞吐量对比 (tokens/sec, A100 80GB, Llama-3 70B)

TensorRT-LLM: ██████████████████████████████ 8000+ tok/s
vLLM:         ███████████████████████████░ 6500+ tok/s
SGLang:       ████████████████████████████░ 6000+ tok/s (结构化)
llama.cpp:    ████░░░░░░░░░░░░░░░░░░░░░░░░░░  150+ tok/s (INT4, M2 Max)

内存效率 (GB, Llama-3 70B)
vLLM (FP16):  ██████████████████████████████ 140GB
vLLM (INT4):  ██████████████░░░░░░░░░░░░░░░░░░  40GB
llama.cpp:    ████████████░░░░░░░░░░░░░░░░░░░░  35GB
```

---

### 5.3 Agent 框架对比

#### 5.3.1 主流框架横向对比

| 维度 | **LangChain** | **LangGraph** | **CrewAI** | **AutoGen** | **OpenAI Agents SDK** | **LlamaIndex** | **Dify** | **Coze** |
|------|-------------|--------------|-----------|------------|----------------------|----------------|----------|----------|
| **范式** | Chain/LLM | Graph/DAG | Role+Task | Multi-Agent | Function/Agent | Query/RAG | Flow/Visual | Flow/Visual |
| **多 Agent** | ✅ LangChain Agents | ✅ | ✅ 原生 | ✅ Conversational | ✅ Handoffs | ❌ | ✅ | ✅ |
| **MCP 支持** | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ | ✅ |
| **Tool Use** | ✅ | ✅ | ✅ | ✅ | ✅ 原生 | ✅ | ✅ | ✅ |
| **持久化** | Memory/History | Checkpointing | 有限 | ✅ | ✅ | ✅ | ✅ | ✅ |
| **可视化** | LangSmith | LangSmith | 基础 | 有限 | 有限 | 有限 | ✅ 画布 | ✅ 画布 |
| **RAG 内置** | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ 原生 | ✅ | ✅ |
| **状态管理** | 外部 | ✅ 原生 | 简单 | 简单 | ✅ | ✅ | ✅ | ✅ |
| **学习曲线** | 陡 | 陡 | 平缓 | 中 | 平缓 | 中 | 平缓 | 平缓 |
| **生产成熟度** | 高 | 中 | 中 | 中 | 高 | 高 | 高 | 高 (Coze US) |
| **部署方式** | 自托管 | 自托管 | 自托管 | 自托管 | 自托管/云 | 自托管 | 自托管/云 | 云服务 |
| **许可** | MIT | MIT | Apache 2.0 | MIT | OpenAI TOS | MIT | Apache 2.0 | 专有 |

#### 5.3.2 框架选型决策树

```
目标场景？
├── 构建复杂多步 Agent 工作流
│   ├── 需要状态持久化/回滚 → LangGraph (Checkpointing)
│   ├── 多 Agent 协作/角色分工 → CrewAI (Role-Based)
│   └── 多 Agent 对话/辩论 → AutoGen (Conversational)
│
├── 构建 RAG 系统
│   ├── 需要深度定制 → LlamaIndex (Query Engine)
│   └── 需要快速原型 → LangChain (High-Level)
│
├── 企业级应用/低代码
│   ├── 需要可视化编排 → Dify (自托管) / Coze (云)
│   └── 需要 API 优先 → LangChain/LangGraph
│
└── 简单工具调用
    └── OpenAI Agents SDK (轻量)
```

#### 5.3.3 架构哲学对比

```
LangChain:      " Everything is a Chain " → 组合式，但复杂
LangGraph:      " Everything is a Graph " → DAG 状态机，适合复杂逻辑
CrewAI:         " Role + Task + Agent " → 模仿人类团队，适合多角色协作
AutoGen:        " Agent = LLM + Human + Tool " → 对话式协作，适合研究
LlamaIndex:     " Data + LLM " → 以数据为中心的 Agent
OpenAI SDK:     " Function + Handoff " → 极简，工具优先
Dify/Coze:      " Visual + Node " → 低代码，非技术人员友好
```

---

### 5.4 Embedding 模型对比

#### 5.4.1 文本 Embedding 模型横向对比

| 模型 | 开发方 | 维度 | 上下文 | MTEB 得分 | 多语言 | 开源 | 备注 |
|------|--------|------|--------|-----------|--------|------|------|
| **text-embedding-3-large** | OpenAI | 3072 | 8K | ~65 | 英文为主 | ❌ | 闭源 SaaS |
| **text-embedding-3-small** | OpenAI | 1536 | 8K | ~62 | 英文为主 | ❌ | 闭源 SaaS |
| **bge-m3** | BAAI | 1024 | 8192 | ~64 | 100+ | ✅ | 多语言最强开源 |
| **bge-large-en-v1.5** | BAAI | 1024 | 512 | ~63 | 英文 | ✅ | 英文 SOTA 开源 |
| **gte-Qwen2** | Alibaba | 1024 | 8192 | ~66 | 中英 | ✅ | 开源中文最强 |
| **e5-mistral-7b** | Microsoft | 1024 | 4096 | ~66 | 英文 | ✅ | 大型高效 |
| **jina-embeddings-v3** | Jina AI | 1024 | 8192 | ~64 | 中英 | ❌ | 闭源 SaaS |
| **nomic-embed-text-v1.5** | Nomic | 768 | 8192 | ~62 | 英文 | ✅ | 可解释 |
| **snowflake-arctic-embed-l** | Snowflake | 1024 | 512 | ~63 | 英文 | ✅ | Apache 2.0 |
| **gte-base-zh** | Alibaba | 768 | 8192 | ~63 | 中英 | ✅ | 中文开源 |

#### 5.4.2 Embedding 选型决策树

```
语言？
├── 纯英文
│   ├── 追求最高性能 → e5-mistral-7b / nomic-embed (可解释)
│   ├── 追求成本效率 → bge-large-en-v1.5
│   └── 需要商用 → nomic / snowflake-arctic
│
├── 中文为主
│   ├── 追求最高性能 → gte-Qwen2 / bge-m3
│   └── 需要快速 → gte-base-zh
│
└── 多语言 (含中文)
    └── bge-m3 (100+语言) / gte-Qwen2 (中英)
```

---

### 5.5 Agent 协议对比

#### 5.5.1 MCP / A2A / AG-UI / UCP 横向对比

| 维度 | **MCP** | **A2A** | **AG-UI** | **UCP** |
|------|---------|---------|-----------|---------|
| **全称** | Model Context Protocol | Agent-to-Agent Protocol | Agent-User Interface | Unified Agent Protocol |
| **定位** | Agent ↔ 工具/数据 | Agent ↔ Agent | Agent ↔ 用户 | Agent ↔ 资源/调度 |
| **核心场景** | Tool Use / RAG / DB | Multi-Agent 协作 | 前端 Streaming UI | 资源调度/优先级 |
| **传输** | JSON-RPC 2.0 | JSON-RPC 2.0 | Server-Sent Events | HTTP/gRPC |
| **状态管理** | 会话级别 | 任务级别 | 流式 UI | 调度队列 |
| **生态** | Anthropic 主推 | OpenAI/Google | AgentKit | emerging |
| **成熟度** | 高 (已广泛采用) | 中 (2025 起) | 中 (早期) | 低 (提议中) |
| **文档** | modelcontextprotocol.github.io | a2a-protocol.dev | agentui.dev | ucp.ai |

#### 5.5.2 协议选型决策树

```
需要解决什么问题？
├── Agent 需要调用外部工具 (数据库、API、文件系统)
│   └── MCP (事实标准)
│
├── 多个 Agent 需要相互通信/协作
│   └── A2A (多 Agent 企业场景)
│
├── Agent 需要流式 UI (打字效果、进度)
│   └── AG-UI (前端集成)
│
└── Agent 需要调度资源/任务队列
    └── UCP (资源编排)
```

---

### 5.6 Agent 工具/IDE 对比

#### 5.6.1 Coding Agent 产品对比

| 产品 | 开发方 | 核心能力 | 架构特点 | 目标用户 | 定价 |
|------|--------|---------|----------|----------|------|
| **Devin** | Cognition | 端到端编码 + 部署 | Agent Foundation | 专业开发者 | $100+/月 |
| **Cursor** | Anysphere | AI IDE (Composer/Writer) | LLM + Editor | 开发者 | $20/月 |
| **Windsurf** | Codeium | Agentic Flow | Cascade Agent | 开发者 | $15/月 |
| **Copilot** | Microsoft | 代码补全/生成 | LLM 集成 VSCode | 开发者 | $19/月 |
| **Claude Code** | Anthropic | CLI Agent | Claude + Tools | 开发者 | $20/月 |
| **Gemini Code Assist** | Google | 代码补全 + Agent | Gemini Pro | 开发者 | $19/月 |
| **Junie** | JetBrains | IDE 内嵌 Agent | LLM + IDEA | 开发者 | 订阅内 |
| **Amazon CodeWhisperer** | Amazon | 代码补全 + 安全扫描 | Amazon Q | 开发者 | 免费/专业 |
| **Codex** | OpenAI | 纯 API / CLI | GPT-4o | 开发者 | 按 token |

#### 5.6.2 Computer Use 产品对比

| 产品 | 公司 | 能力 | 环境 | 自主程度 | 成熟度 |
|------|------|------|------|---------|--------|
| **Claude Computer Use** | Anthropic | 屏幕感知 + 键鼠操作 | macOS/Windows | 高 | 预览版 |
| **OpenAI Operator** | OpenAI | 网页操作 + Browser | Web | 中 | 早期 |
| **Google Jules** | Google | GitHub Issue → PR | 代码 | 中 | 预览版 |
| **Microsoft Copilot Agents** | Microsoft | 企业自动化 | 多环境 | 中高 | 预览版 |
| **Browser Use** | open source | 网页自动化 | Playwright | 中 | 开源 |
| **AutoGLM** | 智谱 | 手机/网页操作 | Android/Web | 中 | 中国市场 |

---

### 5.7 微调框架对比

#### 5.7.1 PEFT/微调框架横向对比

| 框架 | 支持方法 | 适用场景 | 显存需求 | 社区 | 备注 |
|------|---------|---------|---------|------|------|
| **LoRA** | LoRA/QLoRA/DoRA | 通用微调 | 中 | 极大 | 事实标准 |
| **peft (HuggingFace)** | LoRA/QLoRA/IA3/Prefix | 通用 | 中 | 大 | 生态完善 |
| **Axolotl** | 全方法 | 训练配置 | 中 | 中 | 配置驱动 |
| **LLaMA-Factory** | 全方法 + 量化的 | 中文社区 | 中 | 大 | 中文友好 |
| **DeepSpeed-Chat** | RLHF/DPO/GRPO | 对话模型 | 高 | 中 | 微软主推 |
| **veRL** | GRPO/REINFORCE/PPO | 强化学习微调 | 高 | 小 | 字节跳动 |
| **OpenRLHF** | RLHF/DPO/KTO | RLHF 全流程 | 高 | 中 | 开源 RLHF |
| **LLM-Pruner** | 结构化剪枝 | 模型压缩 | - | 小 | 剪枝专用 |
| **秦泗钊/EM-Adapters** | 专用 | 长上下文 | 中 | 小 | 学术 |

---

### 5.8 选型总结速查表

```
场景 → 推荐选型

RAG 检索:
  - Milvus (大规模) / Qdrant (性能) / Weaviate (功能)
  - bge-m3 / gte-Qwen2 (Embedding)

LLM 推理:
  - 生产 (NVIDIA): vLLM / SGLang / TensorRT-LLM
  - 本地 (Mac/CPU): llama.cpp / Ollama

Agent 框架:
  - 复杂工作流: LangGraph
  - 多 Agent 协作: CrewAI
  - 对话式多 Agent: AutoGen
  - 企业低代码: Dify / Coze
  - 快速工具调用: OpenAI Agents SDK

Agent 协议:
  - 工具调用: MCP (事实标准)
  - 多 Agent 通信: A2A
  - 流式 UI: AG-UI

Coding Agent:
  - IDE 内嵌: Cursor (最佳体验) / Copilot (生态)
  - CLI Agent: Claude Code
  - 端到端: Devin

微调:
  - 通用: peft (LoRA)
  - 中文: LLaMA-Factory
  - RLHF: OpenRLLF / veRL
```

---

## 六、专业领域深度图谱

### 6.1 AI Infrastructure 完整技术栈

```
AI Infrastructure Stack
│
├── 1. 数据层
│   ├── 原始数据采集 → Scraping/API/日志
│   ├── 数据标注 → Label Studio / Scale AI / Doccano
│   ├── 数据管理 → Version Control / Lineage
│   └── 特征工程 → Feature Store (Feast/Tecton)
│
├── 2. 训练层
│   ├── 分布式训练框架 → PyTorch FSDP / DeepSpeed / Megatron-LM
│   ├── 加速库 → Flash Attention / Transformer Engine
│   ├── 监控 → Weights & Biases / MLflow / TensorBoard
│   └── 调度 → KubeFlow / Volcano / Airflow
│
├── 3. 微调层
│   ├── PEFT → LoRA / QLoRA / DoRA / IA3
│   ├── Alignment → RLHF / DPO / KTO / GRPO
│   └── 数据合成 → Self-Instruct / Evol-Instruct / Magpie
│
├── 4. 推理层
│   ├── 推理引擎 → vLLM / SGLang / TensorRT-LLM / llama.cpp
│   ├── 量化 → GPTQ / AWQ / GGUF / FP8
│   ├── 部署 → ONNX / TorchScript / TFLite
│   └── 边缘 → TensorRT Edge / ONNX Runtime / MNN
│
├── 5. 服务层
│   ├── Gateway → API Key / Rate Limit / Fallback / Load Balance
│   ├── Cache → KV Cache / Semantic Cache
│   ├── A/B Testing → Canary / Feature Flag
│   └── Cost → Token Budgeting / Model Routing
│
├── 6. 应用层
│   ├── Agent → Tool Use / Planning / Memory / Multi-Agent
│   ├── RAG → Retrieval / Chunking / Rerank / Hybrid Search
│   ├── Guardrails → Input Filter / Output Filter / PII Detection
│   └── Evaluation → Auto Eval / LLM-as-Judge / Golden Set
│
└── 7. 可观测性层
    ├── Tracing → OpenTelemetry / LangSmith / Phoenix
    ├── Metrics → Token Usage / Latency / Error Rate
    ├── Logging → Prompt/Response Storage
    └── Feedback → Human Feedback / Implicit Feedback
```

### 6.2 LLM 完整生命周期

```
LLM Lifecycle
│
├── 1. 预训练 (Pretraining)
│   ├── 数据收集 → 网页爬取 / 书籍 / 代码 / 学术
│   ├── 数据过滤 → 质量筛选 / 去毒 / 去重
│   ├── 数据配比 → Scalin Law / 课程学习
│   ├── 训练 → Transformer / MoE / SSM
│   └── 评估 → Perplexity / Downstream Tasks
│
├── 2. 后训练 (Post-Training)
│   │
│   ├── 2.1 阶段一: 指令微调 (SFT)
│   │   ├── 数据 → Instruction-Tuning Dataset
│   │   ├── 方法 → Next Token Prediction
│   │   └── 目标 → 遵循指令能力
│   │
│   ├── 2.2 阶段二: 对齐微调 (Alignment)
│   │   ├── RLHF
│   │   │   ├── Reward Model → Human Preference
│   │   │   ├── PPO → Policy Optimization
│   │   │   └── 价值对齐
│   │   ├── DPO
│   │   │   ├── Preference Data → Direct Optimization
│   │   │   └── 绕过 Reward Model
│   │   ├── KTO
│   │   │   └── Kahneman-Tversky 优化
│   │   └── GRPO
│   │       ├── Group Relative → Self-Play
│   │       └── DeepSeek-R1 系列
│   │
│   └── 2. 阶段三: 特定能力增强
│       ├── Math → PRM / Verifier / Process Reward
│       ├── Code → Executed Feedback / Compiler
│       └── Reasoning → Test-Time Compute / Search
│
├── 3. 部署 (Deployment)
│   ├── 量化 → INT4/INT8/FP8 (精度 vs 速度权衡)
│   ├── 推理优化 → Speculative Decoding / KV Cache
│   └── Serving → vLLM / TensorRT-LLM
│
└── 4. 应用 (Application)
    ├── Prompt Engineering → CoT / Few-Shot / System Prompt
    ├── RAG → Retrieval Augmented Generation
    ├── Agent → Tool Use + Planning + Memory
    └── Evaluation → Benchmarks / Human Eval
```

### 6.3 AI Agent 完整架构

```
AI Agent Architecture
│
├── Core Brain
│   ├── LLM (Foundation) → GPT-4o / Claude 3.5 / Gemini / Llama
│   ├── Reasoning → Chain / Tree / Reflexion
│   └── Planning → Hieronarchical / Task Decomposition
│
├── Memory System
│   ├── Short-Term → Context Window / Attention
│   ├── Long-Term → Vector Store / Knowledge Graph
│   └── Episodic → Conversation History / Summary
│
├── Tool System
│   ├── Tool Definition → OpenAPI / MCP Server
│   ├── Tool Execution → Code Interpreter / API Call
│   └── Tool Selection → Function Calling / Tool Use
│
├── Perception (Multi-Modal Input)
│   ├── Text → Natural Language
│   ├── Image → Vision Encoder / Image Understanding
│   ├── Audio → Speech Recognition / Audio Understanding
│   └── File → Document Parser / PDF Reader
│
├── Action (Output)
│   ├── Text Generation → Natural Language Response
│   ├── Code Execution → Python / Bash
│   ├── API Call → HTTP Request / Tool Invocation
│   └── GUI Interaction → Click / Type / Screenshot
│
├── Multi-Agent System
│   ├── 协作 → CrewAI / LangGraph Multi-Agent
│   ├── 对话 → AutoGen / OpenAI Agents
│   └── 协议 → MCP / A2A / AG-UI
│
└── Safety & Control
    ├── Guardrails → Scope Limiting / Permission
    ├── Sandboxing → Isolation / Timeout
    ├── Observability → Trace / Log / Monitor
    └── Human-in-the-Loop → Approval / Override
```

### 6.4 RAG 系统完整架构

```
RAG System Architecture
│
├── 1. 文档处理 (Ingestion)
│   ├── 文档解析 → PDF / Word / HTML / Markdown
│   ├── 分块 (Chunking)
│   │   ├── Fixed Size → 简单但可能有语义断裂
│   │   ├── Semantic → 基于句子/段落边界
│   │   ├── Recursive → 层级递归切分
│   │   └── Agentic → LLM 驱动的智能切分
│   └── 向量化 → Embedding Model (BGE/E5)
│
├── 2. 存储层 (Storage)
│   ├── 向量数据库 → Milvus / Qdrant / Pinecone
│   ├── 稀疏索引 → BM25 / TF-IDF
│   ├── 知识图谱 → Neo4j / TuGraph (Graph RAG)
│   └── 混合存储 → Dense + Sparse + KG
│
├── 3. 检索层 (Retrieval)
│   ├── 密集检索 → Bi-Encoder / Dense Vector
│   ├── 稀疏检索 → BM25 / Keyword
│   ├── 混合检索 → Dense + Sparse + RR
│   ├── 重排序 → Cross-Encoder / ColBERT
│   └── 查询改写 → HyDE / Query Expansion
│
├── 4. 生成层 (Generation)
│   ├── LLM → GPT-4o / Claude / Llama
│   ├── Prompt → Context + Query + System Prompt
│   └── 输出验证 → Fact Check / Hallucination Detection
│
└── 5. RAG 范式演进
    ├── Naive RAG → Retrieve → Generate
    ├── Advanced RAG → Query Rewrite / HyDE / Rerank
    ├── Graph RAG → Entity → Relationship → Knowledge Graph
    ├── Agentic RAG → Multi-Step / Query Planning / Tool Use
    └── Self-RAG → Reflection → Relevance → Utility
```

### 6.5 AI Safety 完整技术栈

```
AI Safety Stack
│
├── 1. Alignment (对齐)
│   ├── RLHF → Human Preference → Reward Model → PPO
│   ├── DPO → Direct Preference Optimization
│   ├── Constitutional AI → Principle-based Alignment
│   └── GRPO → Group Relative Policy Optimization
│
├── 2. Interpretability (可解释性)
│   ├── Mechanistic → Circuit Analysis / Activation Patching
│   ├── Feature → Superposition / Polysemantic
│   ├── Tool → SHAP / LIME / Attention Analysis
│   └── Training → Grokking / Phase Transitions
│
├── 3. Red Teaming (红队测试)
│   ├── Prompt Injection → Jailbreaking / Prompt Leaking
│   ├── Adversarial Attack → FGSM / PGD / AutoPrompt
│   ├── Safety Bypass → Refusal Suppression / Goal Hijack
│   └── Evaluations → HarmBench / RedEval / StrongREJECT
│
├── 4. Guardrails (护栏)
│   ├── Input → Toxicity Detection / PII Removal / Topic Control
│   ├── Output → Content Filter / Factuality Check
│   └── Behavior → Rate Limit / Scope Limiting
│
├── 5. Governance (治理)
│   ├── EU AI Act → Risk Classification / Compliance
│   ├── Model Card → Documentation / Transparency
│   ├── Bias Detection → Fairness Metrics / Demographic Parity
│   └── Watermarking → Text / Image / Structured Output
│
└── 6. Evaluation (评估)
    ├── Truthfulness → TruthfulQA / SimpleQA
    ├── Safety → HarmBench / ToxiGen
    ├── Robustness → Adversarial / Distribution Shift
    └── Capability → MMLU / HumanEval / GAIA
```

---

*Last updated: 2026-04-09*
*新增第五节开源选型对比（向量数据库/推理引擎/Agent框架/Embedding模型/Agent协议/Coding Agent/微调框架），新增第六节专业领域深度图谱（AI Infrastructure完整技术栈、LLM完整生命周期、AI Agent完整架构、RAG系统完整架构、AI Safety完整技术栈），覆盖 8 类开源选型横向对比、15+ 选型决策树、100+ 技术点关联*

## Related

- [[91_Notes/AI_Full_Stack_Concepts]] — AI 全链路 Concept 清单 (共享: drafts, ideas, notes, observations)
- [[91_Notes/KNOWLEDGE_BASE]] — 🧠 AI Guru Knowledge Base (共享: drafts, ideas, notes, observations)
- [[91_Notes/README.md|README]]
