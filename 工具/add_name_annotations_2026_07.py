#!/usr/bin/env python3
"""全库中英文名称双标注工具 (2026-07-27)

功能：
1. 为所有 md 文件 frontmatter 添加 name_zh（中文简称），并在正文 H1 下方插入可见标注行
2. 为所有目录的 index.md 额外添加 name_en（目录英文名）
3. 幂等：已含 name_zh / 可见标注行的文件自动跳过

用法：python3 工具/add_name_annotations_2026_07.py [--dry-run]
"""
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALWAYS_SKIP = {'.git', '.obsidian', '.qoder', '.claude', '.githooks', '.github', 'node_modules', 'release'}
ROOT_ONLY_SKIP = {'前端应用', '原始', '来源', '归档', 'docs', 'code', '工具'}
CJK = re.compile(r'[\u4e00-\u9fff]')

# ---- 中文名基本为英文（title 无中文）的文件 → 人工审定中文简称 ----
FILE_ZH = {
    'index.md': '全库总索引',
    'README_EN.md': 'README 英文版',
    '06_强化学习/05_Robotics_Embodied_AI/Robot_VLA_Training_Pipeline_2026.md': '机器人 VLA 训练流水线',
    '06_强化学习/06_Multi_Agent/Multi_Agent_RL.md': '多智能体强化学习',
    '15_智能体/10_Enterprise_Agent/Enterprise_Agent_Governance_2026.md': '企业智能体治理',
    '15_智能体/10_Enterprise_Agent/Agent_Auth_Authorization.md': '智能体认证与授权',
    '15_智能体/03_Agent_Workflow/Agentic_Workflow_Design_Patterns_2026.md': '智能体工作流设计模式',
    '15_智能体/03_Agent_Workflow/Agentic_UI_UX_Design_2026.md': '智能体 UI/UX 设计',
    '15_智能体/11_OpenClaw_Ecosystem/OpenClaw_Ecosystem.md': 'OpenClaw 生态全景',
    '15_智能体/11_OpenClaw_Ecosystem/OpenClaw_Technical_Deep_Dive.md': 'OpenClaw 技术深潜',
    '15_智能体/11_OpenClaw_Ecosystem/OpenClaw_Ecosystem_for_dummy.md': 'OpenClaw 生态入门',
    '15_智能体/11_OpenClaw_Ecosystem/Wuying_AgentBay.md': '无影 AgentBay',
    '15_智能体/11_OpenClaw_Ecosystem/Skills_ClawHub.md': '技能与 ClawHub',
    '15_智能体/11_OpenClaw_Ecosystem/CoPaw_Deep_Dive.md': 'CoPaw 深度解析',
    '15_智能体/11_OpenClaw_Ecosystem/QClaw_Guide.md': 'QClaw 完全指南',
    '15_智能体/11_OpenClaw_Ecosystem/Manus_My_Computer.md': 'Manus 我的电脑',
    '15_智能体/01_Agent_Foundations/ADK_Selection_and_Implementation_2026.md': 'ADK 选型与实施',
    '15_智能体/01_Agent_Foundations/Agent_Protocols_Comparison_2026.md': '智能体协议对比',
    '15_智能体/07_Agent_Evaluation/README.md': '智能体基准评估框架',
    '15_智能体/07_Agent_Evaluation/Agent_Red_Teaming_2026.md': '智能体红队测试',
    '15_智能体/07_Agent_Evaluation/README_for_dummy.md': '智能体评估框架入门',
    '15_智能体/07_Agent_Evaluation/Cloud_Agent_Evaluation_System_2026.md': '云智能体评估系统',
    '15_智能体/07_Agent_Evaluation/Multi_Agent_Evaluation_2026.md': '多智能体系统评估',
    '15_智能体/07_Agent_Evaluation/Demo/README.md': '评估框架 Demo',
    '15_智能体/07_Agent_Evaluation/Metrics/Metrics_Collection.md': '指标采集方法',
    '15_智能体/07_Agent_Evaluation/Metrics/Evaluation_Metrics.md': '评估指标目录',
    '15_智能体/07_Agent_Evaluation/Testing_Methodologies/Test_Suites.md': '测试套件',
    '15_智能体/07_Agent_Evaluation/Testing_Methodologies/Testing_Framework.md': '测试框架',
    '15_智能体/07_Agent_Evaluation/Corpus_Assessment/README.md': '语料库评估',
    '15_智能体/07_Agent_Evaluation/QA/Quality_Assurance.md': '质量保障',
    '15_智能体/07_Agent_Evaluation/QA/Performance_Benchmarks.md': '性能基准',
    '15_智能体/07_Agent_Evaluation/Assessment/Production_Assessment.md': '生产环境评估',
    '15_智能体/07_Agent_Evaluation/Assessment/Evaluation_Workflow.md': '评估工作流',
    '15_智能体/07_Agent_Evaluation/Rubrics/Ranking_System.md': '排名体系',
    '15_智能体/07_Agent_Evaluation/Rubrics/Scoring_Rubrics.md': '评分细则',
    '15_智能体/07_Agent_Evaluation/Implementation/Config_Templates.md': '配置模板',
    '15_智能体/07_Agent_Evaluation/Implementation/Implementation_Guide.md': '实施指南',
    '15_智能体/07_Agent_Evaluation/Implementation/Sample_Reports.md': '示例报告',
    '15_智能体/07_Agent_Evaluation/Test_Bank/README.md': '标准测试题库',
    '15_智能体/07_Agent_Evaluation/Benchmarking/Benchmarking_Criteria.md': '基准评测标准',
    '15_智能体/07_Agent_Evaluation/Benchmarking/Scoring_System.md': '评分系统',
    '15_智能体/07_Agent_Evaluation/Cloud_Agent_Evaluation/README.md': '云智能体专项测评',
    '15_智能体/15_Course_Notes/Microsoft_AI_Agents_L05_Agentic_RAG.md': 'Agentic RAG 课程笔记',
    '15_智能体/15_Course_Notes/Learn_Claude_Code_L19_MCP_Plugin.md': 'MCP 插件课程笔记',
    '15_智能体/15_Course_Notes/Learn_Claude_Code_L07_Skill_Loading.md': '技能加载课程笔记',
    '15_智能体/04_Agent_Harness/The_Anatomy_of_an_Agent_Harness.md': '智能体 Harness 解剖',
    '15_智能体/04_Agent_Harness/Harness_Production_Security.md': 'Harness 生产与安全',
    '15_智能体/04_Agent_Harness/Harness_Engineering_Complete_Guide.md': 'Harness 工程完全指南',
    '15_智能体/04_Agent_Harness/Harness_Core_Subsystems.md': 'Harness 核心子系统',
    '15_智能体/16_Agent_Protocols/Agent_Protocols_index.md': '智能体协议专题',
    '08_模型评估/04_Evaluation_Tools/Online_Evaluation_index.md': '在线评估专题',
    '08_模型评估/06_Safety_Evaluation/Red_Team_Evaluation_index.md': '红队评估专题',
    '08_模型评估/05_Automation/Statistical_Evaluation_Methods.md': '统计评估方法',
    '08_模型评估/01_Evaluation_Fundamentals/Human_Evaluation_index.md': '人工评估专题',
    '01_数学基础/10_AI_Hardware/GPU_Programming_CUDA_Basics.md': 'GPU 编程与 CUDA 基础',
    '14_RAG系统/04_Advanced_RAG/Multimodal_RAG_Architecture_2026.md': '多模态 RAG 架构',
    '14_RAG系统/04_Advanced_RAG/Graph_RAG_Architecture.md': '图 RAG 架构',
    '14_RAG系统/07_RAG_Evaluation/RAG_Evaluation_index.md': 'RAG 评估专题',
    '14_RAG系统/05_RAG_Production/RAG_Monitoring_index.md': 'RAG 监控专题',
    '10_部署推理/09_Cost/Cost_index.md': '推理成本专题',
    '10_部署推理/02_Inference_Engines/LLM_API_Design_Patterns.md': 'LLM API 设计模式',
    '17_伦理安全/03_Governance/AI_Regulatory_Engineering_2026.md': 'AI 监管工程',
    '17_伦理安全/06_Security/LLM_Security_Complete_Guide.md': 'LLM 安全攻击指南',
    '17_伦理安全/06_Security/LLM_Security_Defense_Guide.md': 'LLM 安全防御指南',
    '17_伦理安全/06_Security/Agent_RAG_Security.md': '智能体与 RAG 安全',
    '12_架构基建/08_Networking/Docker_Containerization_for_AI.md': 'AI 容器化实践',
    '12_架构基建/11_AI_Gateway/AI_Gateway_README.md': 'AI 网关总览',
    '12_架构基建/07_Hardware_Compute/Future_Computing_Hardware_2026.md': '未来 AI 硬件',
    '12_架构基建/02_Architecture_Overview/Hybrid_Multi_Cloud_AI.md': '混合多云 AI 架构',
    '13_运维/06_Observability/Observability_index.md': '可观测性专题',
    '13_运维/02_SRE_Reliability/Capacity_Planning_AI_2026.md': 'AI 容量规划',
    '13_运维/02_SRE_Reliability/Capacity_Planning_index.md': '容量规划专题',
    '13_运维/02_SRE_Reliability/Chaos_Engineering_index.md': '混沌工程专题',
    '13_运维/03_Incident_Response/Post_Mortem_Template.md': '事故复盘模板',
    '02_机器学习/01_ML_Fundamentals/Model_Interpretability_Explainability.md': '模型可解释性',
    '09_测试/04_Online_Testing/AB_Testing_index.md': 'A/B 测试专题',
    '09_测试/02_Testing_Frameworks/Weights_Biases_index.md': 'W&B 专题',
    '09_测试/02_Testing_Frameworks/RAGAS_index.md': 'RAGAS 专题',
    '09_测试/03_Agent_Evaluation/Agent_Evaluation_index.md': '智能体评估专题',
    '09_测试/01_Testing_Fundamentals/Test_Data_index.md': '测试数据专题',
    '09_测试/01_Testing_Fundamentals/Contract_Testing_index.md': '契约测试专题',
    '05_大模型/09_Reasoning_Models/Neuro_Symbolic_and_Formal_Verification_2026.md': '神经符号与形式验证',
    '05_大模型/02_Sequence_Models/Text_Generation_Decoding_Strategies.md': '文本生成解码策略',
    '05_大模型/13_LLM_Products/README.md': '大模型产品总览',
    '90_学习/References/Projects/500-ai-projects.md': '500 个 AI 项目合集',
    '90_学习/References/Projects/papers-with-code.md': '论文代码平台',
    '90_学习/References/books/hands-on-ml-geron.md': '机器学习实战',
    '90_学习/References/books/designing-ml-systems-huyen.md': 'ML 系统设计',
    '90_学习/References/books/ai-engineering-huyen.md': 'AI 工程',
    '90_学习/References/books/build-reasoning-model.md': '从零构建推理模型',
    '90_学习/References/books/nlp-with-transformers.md': 'Transformers 自然语言处理',
    '90_学习/References/books/prompt-engineering-for-llms.md': 'LLM 提示工程',
    '90_学习/References/books/ai-agents-in-action.md': 'AI 智能体实战',
    '90_学习/References/books/deep-learning-goodfellow.md': '深度学习花书',
    '90_学习/References/books/dl-with-python-chollet.md': 'Python 深度学习',
    '90_学习/References/books/build-multi-agent-system.md': '从零构建多智能体系统',
    '90_学习/References/books/hands-on-llms-alammar.md': '图解大模型实战',
    '90_学习/References/books/llm-engineers-handbook.md': 'LLM 工程师手册',
    '90_学习/References/books/build-llm-from-scratch-raschka.md': '从零构建大语言模型',
    '90_学习/References/books/why-machines-learn.md': '机器为何学习',
    '90_学习/References/books/llms-in-production.md': 'LLM 生产化实战',
    '18_行业应用/16_Supply_Chain_Logistics/Supply_Chain_Logistics_index.md': '供应链物流专题',
    '18_行业应用/16_Supply_Chain_Logistics/Logistics_Supply_Chain.md': '物流供应链 AI 应用',
    '18_行业应用/08_Retail_Ecommerce/Retail_Ecommerce_index.md': '零售电商专题',
    '18_行业应用/12_HR_Recruitment/HR_Recruitment_index.md': '人力资源招聘专题',
    '18_行业应用/02_AI_for_Science/Protein_Folding_and_Drug_Discovery_2026.md': '蛋白质折叠与药物发现',
    '18_行业应用/02_AI_for_Science/Materials_Science_and_Energy_2026.md': '材料科学与能源',
    '18_行业应用/11_Legal_Government/Legal_Government_index.md': '法律政务专题',
    '18_行业应用/09_Energy_Climate/Energy_Climate_index.md': '能源气候专题',
    '18_行业应用/18_Code_Generation/Code_Generation_index.md': '代码生成专题',
    '18_行业应用/06_Autonomous_Driving/Autonomous_Driving_index.md': '自动驾驶专题',
    '18_行业应用/15_Security_Cybersecurity/Security_Cybersecurity_index.md': '网络安全专题',
    '18_行业应用/10_Agriculture/Agriculture_index.md': '农业专题',
    '18_行业应用/07_Manufacturing/Manufacturing_index.md': '制造业专题',
    '18_行业应用/13_Content_Media/Content_Media_index.md': '内容媒体专题',
    '治理/hot.md': '热门页面',
    '治理/CONTRIBUTING.md': '贡献指南',
    '治理/_meta/_synthesis-index-archive.md': '综合索引归档',
    '治理/_meta/_wiki-status.md': '全库健康度报告',
    '治理/_meta/_tag-taxonomy-report.md': '标签体系报告',
    '治理/notes/KNOWLEDGE_BASE.md': '知识库导览',
    '概念/GPU/cuda-graph.md': 'CUDA 图',
    '概念/GPU/cuda.md': 'CUDA 并行计算平台',
    '概念/GPU/gpu-direct.md': 'GPU 直连技术',
    '概念/GPU/cambricon.md': '寒武纪',
    '概念/GPU/flops.md': '每秒浮点运算次数',
    '概念/GPU/model-parallelism.md': '模型并行',
    '概念/GPU/cudnn.md': 'cuDNN 深度学习库',
    '概念/GPU/tensor-parallelism.md': '张量并行',
    '概念/GPU/expert-parallelism.md': '专家并行',
    '概念/GPU/gpu-oom.md': 'GPU 显存溢出',
    '概念/GPU/gpu.md': '图形处理器',
    '概念/GPU/gpustack.md': 'GPU 集群管理平台',
    '概念/GPU/mig.md': '多实例 GPU',
    '概念/GPU/mthreads.md': '摩尔线程',
    '概念/GPU/nvlink.md': 'GPU 高速互联',
    '概念/GPU/nvidia-gpu.md': '英伟达 GPU',
    '概念/GPU/cann.md': '昇腾异构计算架构',
    '概念/GPU/tensors.md': '张量',
    '概念/GPU/nccl.md': 'NVIDIA 集合通信库',
    '概念/LLM/grouped-query-attention.md': '分组查询注意力',
    '概念/LLM/llmops.md': '大模型运维',
    '概念/LLM/llama-box.md': 'llama.cpp 推理服务',
    '概念/LLM/gptq.md': 'GPT 训练后量化',
    '概念/LLM/cross-encoder.md': '交叉编码器',
    '概念/LLM/alibi.md': '线性偏置注意力',
    '概念/LLM/retnet.md': '保留网络',
    '概念/LLM/llm-quantization.md': '大模型量化',
    '概念/LLM/radix-attention.md': '基数树注意力',
    '概念/LLM/multi-head-latent-attention.md': '多头潜在注意力',
    '概念/LLM/context-window.md': '上下文窗口',
    '概念/LLM/kv-cache.md': '键值缓存',
    '概念/LLM/paged-attention.md': '分页注意力',
    '概念/LLM/llm-arena.md': '大模型竞技场',
    '概念/LLM/tensorrt-llm.md': 'TensorRT 大模型推理引擎',
    '概念/LLM/llamaindex.md': 'LlamaIndex 数据框架',
    '概念/LLM/mamba.md': 'Mamba 状态空间模型',
    '概念/LLM/large-language-model.md': '大语言模型',
    '概念/General/tpot.md': '每 token 生成时间',
    '概念/General/sla.md': '服务等级协议',
    '概念/General/data-validation.md': '数据校验',
    '概念/General/modal.md': 'Modal 无服务器 GPU 云',
    '概念/General/azure-openai.md': '微软 Azure OpenAI 服务',
    '概念/General/loki.md': 'Loki 日志聚合系统',
    '概念/General/etcd.md': '分布式键值存储',
    '概念/General/ai-stack.md': '阿里云 AI Stack',
    '概念/General/aws-bedrock.md': '亚马逊 Bedrock 模型服务',
    '概念/General/tempo.md': 'Tempo 分布式追踪',
    '概念/General/vault.md': 'Vault 密钥管理',
    '概念/General/oss.md': '对象存储服务',
    '概念/General/lisa.md': '分层重要性采样微调',
    '概念/General/nas.md': '网络附加存储',
    '概念/General/infiniBand.md': '无限带宽网络',
    '概念/General/resilience.md': '系统韧性',
    '概念/General/mindie.md': '昇腾推理引擎',
    '概念/General/fluent-bit.md': '轻量日志转发器',
    '概念/General/guidance.md': '微软结构化生成库',
    '概念/General/slo.md': '服务水平目标',
    '概念/General/jaeger.md': 'Jaeger 链路追踪',
    '概念/General/kubectl.md': 'K8s 命令行工具',
    '概念/General/vertex-ai.md': '谷歌 Vertex AI 平台',
    '概念/General/chaos-engineering.md': '混沌工程',
    '概念/General/test-time-compute-scaling.md': '测试时计算扩展',
    '概念/General/node.md': 'K8s 工作节点',
    '概念/General/ipo.md': '身份偏好优化',
    '概念/General/incident-response.md': '事故响应',
    '概念/General/scheduler.md': 'K8s 调度器',
    '概念/General/graph-of-thoughts.md': '思维图',
    '概念/General/opencompass.md': '司南评测平台',
    '概念/General/automl.md': '自动化机器学习',
    '概念/General/cloud-cost.md': '云成本',
    '概念/General/model-rollback.md': '模型回滚',
    '概念/General/platform-engineering.md': '平台工程',
    '概念/General/pai.md': '阿里云机器学习平台',
    '概念/General/gitops.md': 'GitOps 持续交付',
    '概念/General/sli.md': '服务水平指标',
    '概念/General/query.md': '查询',
    '概念/General/deployment.md': 'K8s 无状态部署',
    '概念/General/dora.md': '权重分解低秩适配',
    '概念/General/alibaba-cloud.md': '阿里云',
    '概念/General/q-learning.md': 'Q 学习',
    '概念/General/lm-evaluation-harness.md': '语言模型评测框架',
    '概念/General/chinese-ai-chips.md': '国产 AI 芯片',
    '概念/General/annotation.md': 'K8s 注解',
    '概念/General/ray.md': 'Ray 分布式计算框架',
    '概念/General/ack.md': '阿里云容器服务',
    '概念/General/tot.md': '思维树',
    '概念/General/error-budget.md': '错误预算',
    '概念/General/bbh.md': 'BBH 困难任务基准',
    '概念/General/role.md': 'K8s 命名空间角色',
    '概念/General/sre.md': '站点可靠性工程',
    '概念/General/opentelemetry.md': '统一可观测性标准',
    '概念/General/ai-sre.md': 'AI 可靠性工程',
    '概念/General/finops.md': '云财务管理',
    '概念/General/replicate.md': 'Replicate 模型托管平台',
    '概念/General/lakefs.md': '数据湖版本控制',
    '概念/K8s/clusterrole.md': 'K8s 集群角色',
    '概念/K8s/label.md': 'K8s 标签',
    '概念/K8s/dra.md': '动态资源分配',
    '概念/K8s/kubernetes.md': '容器编排平台',
    '概念/K8s/serviceaccount.md': 'K8s 服务账户',
    '概念/K8s/cert-manager.md': '证书自动管理',
    '概念/K8s/envoy.md': 'Envoy 服务代理',
    '概念/K8s/limit-range.md': 'K8s 资源限制范围',
    '概念/K8s/persistent-volume-claim.md': '持久卷声明',
    '概念/K8s/configmap.md': 'K8s 配置字典',
    '概念/K8s/cni.md': '容器网络接口',
    '概念/K8s/linkerd.md': 'Linkerd 服务网格',
    '概念/K8s/clusterrolebinding.md': 'K8s 集群角色绑定',
    '概念/K8s/trivy.md': 'Trivy 安全扫描器',
    '概念/K8s/secret.md': 'K8s 机密对象',
    '概念/K8s/kyverno.md': 'K8s 策略引擎',
    '概念/K8s/securitycontext.md': 'K8s 安全上下文',
    '概念/K8s/network-policy.md': 'K8s 网络策略',
    '概念/K8s/falco.md': '运行时安全检测',
    '概念/K8s/rolebinding.md': 'K8s 角色绑定',
    '概念/K8s/vertical-pod-autoscaler.md': 'Pod 纵向自动扩缩容',
    '概念/K8s/horizontal-pod-autoscaler.md': 'Pod 水平自动扩缩容',
    '概念/K8s/sealed-secrets.md': '加密 Secret 方案',
    '概念/K8s/time-slicing.md': 'GPU 时间分片',
    '概念/K8s/helm.md': 'K8s 包管理器',
    '概念/K8s/flux.md': 'Flux GitOps 工具',
    '概念/K8s/external-secrets-operator.md': '外部密钥同步组件',
    '概念/K8s/kserve.md': 'K8s 模型推理平台',
    '概念/K8s/cronjob.md': 'K8s 定时任务',
    '概念/K8s/gpu-operator.md': 'NVIDIA GPU 管理组件',
    '概念/K8s/opa.md': '开放策略代理',
    '概念/K8s/daemonset.md': 'K8s 守护进程集',
    '概念/K8s/namespace.md': 'K8s 命名空间',
    '概念/K8s/istio.md': 'Istio 服务网格',
    '概念/K8s/containerd.md': '工业级容器运行时',
    '概念/K8s/kueue.md': 'K8s 作业排队系统',
    '概念/K8s/karmada.md': '多集群编排平台',
    '概念/K8s/k3s.md': '轻量级 K8s 发行版',
    '概念/K8s/volcano.md': '批处理调度系统',
    '概念/K8s/statefulset.md': 'K8s 有状态应用集',
    '概念/K8s/resource-quota.md': 'K8s 资源配额',
    '概念/K8s/service-mesh.md': '服务网格',
    '概念/K8s/service.md': 'K8s 服务',
    '概念/K8s/pod-security-standards.md': 'Pod 安全标准',
    '概念/K8s/pod-disruption-budget.md': 'Pod 中断预算',
    '概念/K8s/pod.md': 'K8s 最小部署单元',
    '概念/K8s/replicaset.md': 'K8s 副本集',
    '概念/K8s/gpu-sharing.md': 'GPU 共享',
    '概念/K8s/docker.md': 'Docker 容器平台',
    '概念/K8s/hami.md': '异构算力虚拟化中间件',
    '概念/K8s/job.md': 'K8s 批处理任务',
    '概念/K8s/ingress.md': 'K8s 七层流量入口',
    '概念/K8s/selector.md': 'K8s 选择器',
    '概念/K8s/cri.md': '容器运行时接口',
    '概念/K8s/csi.md': '容器存储接口',
    '概念/K8s/cdi.md': '容器设备接口',
    '概念/K8s/persistent-volume.md': '持久卷',
    '概念/Training/gradient-checkpointing.md': '梯度检查点',
    '概念/Training/awq.md': '激活感知权重量化',
    '概念/Training/llama-factory.md': '一站式微调框架',
    '概念/Training/megatron-lm.md': '大规模训练框架 Megatron',
    '概念/Training/grpo.md': '组相对策略优化',
    '概念/Training/adversarial-training.md': '对抗训练',
    '概念/Training/tekton.md': 'K8s 原生 CI/CD',
    '概念/Training/colossal-ai.md': 'Colossal-AI 训练系统',
    '概念/Training/dpo.md': '直接偏好优化',
    '概念/Training/rs-lora.md': '秩稳定 LoRA',
    '概念/Training/sft.md': '监督微调',
    '概念/Training/ppo.md': '近端策略优化',
    '概念/Training/smoothquant.md': '平滑量化',
    '概念/Training/nf4.md': '4 比特正态浮点量化',
    '概念/Training/distributed-filesystem.md': '分布式文件系统',
    '概念/Training/deepspeed.md': '微软训练优化库',
    '概念/Training/kto.md': '前景理论对齐优化',
    '概念/Training/fsdp.md': '全分片数据并行',
    '概念/Training/orpo.md': '比值比偏好优化',
    '概念/Training/parallel-training.md': '并行训练',
    '概念/Training/rlhf.md': '人类反馈强化学习',
    '概念/MLOps/prometheus.md': '监控告警系统',
    '概念/MLOps/pandera.md': 'DataFrame 数据校验库',
    '概念/MLOps/argo-rollouts.md': '渐进式交付控制器',
    '概念/MLOps/great-expectations.md': '数据验证框架',
    '概念/MLOps/data-versioning.md': '数据版本化',
    '概念/MLOps/data-pipeline.md': '数据流水线',
    '概念/MLOps/evidently.md': '数据漂移监测工具',
    '概念/MLOps/backstage.md': '开发者门户平台',
    '概念/MLOps/grafana.md': '可视化监控平台',
    '概念/MLOps/dvc.md': '数据版本控制',
    '概念/MLOps/kubeflow.md': 'K8s 机器学习工具集',
    '概念/Agent/mcp.md': '模型上下文协议',
    '概念/Agent/a2a-protocol.md': '智能体间通信协议',
    '概念/Agent/langchain.md': 'LLM 应用开发框架',
    '概念/Agent/langgraph.md': '图编排框架',
    '概念/Agent/agentic-rag.md': '智能体化 RAG',
    '概念/Agent/autogen.md': '微软多智能体框架',
    '概念/Agent/crewai.md': '角色协作智能体框架',
    '概念/Vision/vit.md': '视觉 Transformer',
    '概念/Vision/sam.md': '分割一切模型',
    '概念/RAG/storage.md': '存储',
    '概念/RAG/agentic-rag-2.md': '智能体化 RAG 2.0',
    '概念/RAG/weaviate.md': 'AI 原生向量数据库',
    '概念/RAG/bge-m3.md': '智源多语言嵌入模型',
    '概念/RAG/hnsw.md': '分层可导航小世界索引',
    '概念/RAG/storageclass.md': 'K8s 存储类',
    '概念/RAG/vector-index.md': '向量索引',
    '概念/RAG/retrieval-latency.md': '检索延迟',
    '概念/RAG/qdrant.md': 'Rust 向量数据库',
    '概念/RAG/hybrid-search.md': '混合检索',
    '概念/RAG/bm25.md': '经典关键词排序算法',
    '概念/RAG/milvus.md': '分布式向量数据库',
    '概念/RAG/text2sql.md': '自然语言转 SQL',
    '概念/RAG/ivf.md': '倒排文件索引',
    '概念/Safety/supply-chain-security.md': '供应链安全',
    '概念/Safety/model-security.md': '模型安全',
    '概念/Safety/container-security.md': '容器安全',
    '概念/Safety/adversarial-attack.md': '对抗攻击',
    '概念/Inference/triton-inference-server.md': 'Triton 推理服务器',
    '概念/Inference/tgi.md': 'HF 文本生成推理引擎',
    '概念/Inference/inference-performance.md': '推理性能工程',
    '概念/Inference/sglang.md': 'SGLang 推理引擎',
    '概念/Inference/ttft.md': '首 token 延迟',
    '概念/Inference/inference-autoscaling.md': '推理弹性扩缩容',
    '概念/Inference/tensorrt.md': 'NVIDIA 推理优化器',
    '概念/Inference/triton.md': 'Triton 推理服务器（旧卡）',
    '概念/Inference/prefill-decode-disaggregation.md': '预填充解码分离',
    '概念/Inference/lmdeploy.md': '国产推理部署工具',
    '概念/Inference/gguf.md': 'llama.cpp 模型格式',
    '概念/Inference/inference-performance-gaps.md': '推理性能空白分析',
    '概念/Inference/request-scheduling.md': '推理请求调度',
    '概念/Inference/triton-server.md': 'Triton 推理服务器（详卡）',
    '概念/Inference/quantization.md': '量化',
    '03_深度学习/09_Advanced_Topics/Transfer_Learning_Guide.md': '迁移学习完全指南',
    '16_编程/06_Tool_Comparison/MOC_OpenRouter_OpenCode.md': 'AI 编程专题地图',
    '16_编程/01_Coding_Fundamentals/Python_for_AI_2026.md': 'AI Python 编程全景',
    '16_编程/03_Methodology/Agentic_Coding_Methodology.md': '智能体编程方法论',
    '07_模型训练/03_Optimization/Optimizer_Advanced_2026.md': '高级优化器',
    '07_模型训练/05_Compression/README.md': '模型压缩技术总览',
    '07_模型训练/05_Compression/Model_Compression_Complete_Guide.md': '模型压缩完全指南',
    '07_模型训练/04_Distributed_Training/Distributed_Training_2026.md': '分布式训练全景',
    '07_模型训练/07_Monitoring/Training_Monitoring_2026.md': '训练监控与实验追踪',
    '07_模型训练/02_Data/Tokenizer_Design_2026.md': '分词器设计',
    '07_模型训练/02_Data/Data_Curation_and_Mixture_2026.md': '数据筛选与配比',
    '04_计算机视觉/02_Image_Classification_Detection/Object_Detection_Complete_Guide.md': '目标检测完全指南',
    '11_模型运维/08_Observability/Model_Monitoring_and_Drift_Detection_2026.md': '模型监控与漂移检测',
    '11_模型运维/13_Evaluation/Evaluation_index.md': '运维评估专题',
    '20_论文精读/10_Retrieval/Retrieval_index.md': '检索论文专题',
    '20_论文精读/09_Frontier/Frontier_index.md': '前沿论文专题',
    '20_论文精读/01_Research_Guide/Methodology_index.md': '研究方法论专题',
    '21_面试岗位/Interview_Guide/System_Design_for_AI.md': 'AI 系统设计面试',
}

# ---- 目录中文名（index 标题为英文的目录；键为目录相对路径）----
DIR_ZH = {
    '00_入门': '入门', '00_入门/01_Fundamentals': '基础概念', '00_入门/02_Technology_Overview': '技术全景',
    '00_入门/03_Learning_Path': '学习路径', '00_入门/04_Ethics_and_Future': '伦理与未来',
    '01_数学基础': '数学基础', '01_数学基础/01_Math_Fundamentals': '数学基础核心', '01_数学基础/02_Linear_Algebra': '线性代数',
    '01_数学基础/03_Probability_Statistics': '概率统计', '01_数学基础/04_Information_Theory': '信息论',
    '01_数学基础/05_Numerical_Methods': '数值方法', '01_数学基础/06_Game_Theory': '博弈论',
    '01_数学基础/07_Data_Structures_Algorithms': '数据结构与算法', '01_数学基础/08_Python_Toolkit': 'Python 工具箱',
    '01_数学基础/09_Distributed_Systems': '分布式系统', '01_数学基础/10_AI_Hardware': 'AI 硬件',
    '01_数学基础/11_Java_Ecosystem_AI': 'Java AI 生态',
    '02_机器学习': '机器学习', '02_机器学习/01_ML_Fundamentals': '机器学习基础', '02_机器学习/02_Supervised_Learning': '监督学习',
    '02_机器学习/03_Unsupervised_Learning': '无监督学习', '02_机器学习/04_Ensemble_Learning': '集成学习',
    '02_机器学习/05_Feature_Engineering': '特征工程', '02_机器学习/06_Bayesian_Methods': '贝叶斯方法',
    '02_机器学习/07_Causal_Inference': '因果推断', '02_机器学习/08_Anomaly_Detection': '异常检测',
    '02_机器学习/09_Time_Series': '时间序列', '02_机器学习/10_Recommendation_Systems': '推荐系统',
    '02_机器学习/11_AutoML': '自动化机器学习', '02_机器学习/12_ML_Frameworks': '机器学习框架',
    '02_机器学习/13_Learning_Paradigms': '学习范式',
    '03_深度学习': '深度学习', '03_深度学习/01_DL_Fundamentals': '深度学习基础', '03_深度学习/02_Neural_Network_Core': '神经网络核心',
    '03_深度学习/03_Optimization': '深度学习优化', '03_深度学习/04_Generative_Models': '生成模型',
    '03_深度学习/05_Graph_Neural_Networks': '图神经网络', '03_深度学习/06_Self_Supervised_Learning': '自监督学习',
    '03_深度学习/07_World_Models': '世界模型', '03_深度学习/08_DL_Frameworks': '深度学习框架',
    '03_深度学习/09_Advanced_Topics': '进阶专题',
    '04_计算机视觉': '计算机视觉', '04_计算机视觉/01_CV_Fundamentals': '视觉基础', '04_计算机视觉/02_Image_Classification_Detection': '图像分类与检测',
    '04_计算机视觉/03_Segmentation': '图像分割', '04_计算机视觉/04_OCR_Text_Recognition': '文字识别',
    '04_计算机视觉/05_3D_Vision': '三维视觉', '04_计算机视觉/06_Generative_Models': '视觉生成模型',
    '04_计算机视觉/07_Video_Generation': '视频生成', '04_计算机视觉/08_Multimodal_Vision': '多模态视觉',
    '04_计算机视觉/09_CV_Deployment': '视觉部署',
    '05_大模型': '大模型', '05_大模型/01_LLM_Fundamentals': '大模型基础', '05_大模型/02_Sequence_Models': '序列模型',
    '05_大模型/03_Transformer': 'Transformer 架构', '05_大模型/04_Transformer_Revolution': 'Transformer 革命',
    '05_大模型/05_LLM_Architectures': '大模型架构', '05_大模型/06_LLM_Data_Engineering': '大模型数据工程',
    '05_大模型/07_Fine_tuning_Techniques': '微调技术', '05_大模型/08_Prompt_Engineering': '提示工程',
    '05_大模型/09_Reasoning_Models': '推理模型', '05_大模型/10_Multimodal_Models': '多模态模型',
    '05_大模型/11_Speech_Audio_AI': '语音音频 AI', '05_大模型/12_Edge_LLM': '端侧大模型',
    '05_大模型/13_LLM_Products': '大模型产品', '05_大模型/14_Global_LLM_Ecosystem': '全球大模型生态',
    '05_大模型/15_Chinese_LLM_Ecosystem': '中国大模型生态', '05_大模型/16_Constrained_Generation': '约束生成',
    '06_强化学习': '强化学习', '06_强化学习/01_RL_Foundations': '强化学习基础', '06_强化学习/02_Deep_RL': '深度强化学习',
    '06_强化学习/03_RLHF_Alignment': 'RLHF 对齐', '06_强化学习/04_RL_Applications': '强化学习应用',
    '06_强化学习/05_Robotics_Embodied_AI': '机器人与具身智能', '06_强化学习/06_Multi_Agent': '多智能体',
    '07_模型训练': '模型训练', '07_模型训练/01_Training_Fundamentals': '训练基础', '07_模型训练/02_Data': '训练数据',
    '07_模型训练/03_Optimization': '训练优化', '07_模型训练/04_Distributed_Training': '分布式训练',
    '07_模型训练/05_Compression': '模型压缩', '07_模型训练/06_Alignment': '对齐训练',
    '07_模型训练/07_Monitoring': '训练监控', '07_模型训练/08_Cost_Optimization': '成本优化',
    '08_模型评估': '模型评估', '08_模型评估/01_Evaluation_Fundamentals': '评估基础', '08_模型评估/02_Benchmarks': '评测基准',
    '08_模型评估/03_LLM_Evaluation': '大模型评估', '08_模型评估/04_Evaluation_Tools': '评估工具',
    '08_模型评估/05_Automation': '评估自动化', '08_模型评估/06_Safety_Evaluation': '安全评估',
    '09_测试': '测试', '09_测试/01_Testing_Fundamentals': '测试基础', '09_测试/02_Testing_Frameworks': '测试框架',
    '09_测试/03_Agent_Evaluation': '智能体评估测试', '09_测试/04_Online_Testing': '在线测试',
    '10_部署推理': '部署推理', '10_部署推理/01_Deployment_Fundamentals': '部署基础', '10_部署推理/02_Inference_Engines': '推理引擎',
    '10_部署推理/03_Inference_Optimization': '推理优化', '10_部署推理/04_Inference_Performance': '推理性能',
    '10_部署推理/05_Quantization': '量化', '10_部署推理/06_Caching': '缓存',
    '10_部署推理/07_GPU_Infrastructure': 'GPU 基础设施', '10_部署推理/08_Hardware': '推理硬件', '10_部署推理/09_Cost': '推理成本',
    '11_模型运维': '模型运维', '11_模型运维/01_MLOps_Fundamentals': 'MLOps 基础', '11_模型运维/02_Data_Engineering': '数据工程',
    '11_模型运维/03_Feature_Store': '特征存储', '11_模型运维/04_Experiment_Tracking': '实验追踪',
    '11_模型运维/05_Orchestration': '工作流编排', '11_模型运维/06_CI_CD': '持续集成交付',
    '11_模型运维/07_Model_Serving': '模型服务', '11_模型运维/08_Observability': '可观测性',
    '11_模型运维/09_Cost': '运维成本', '11_模型运维/10_LLMOps': '大模型运维',
    '11_模型运维/11_Prompt_Ops': '提示词运维', '11_模型运维/12_Troubleshooting': '故障排查',
    '11_模型运维/13_Evaluation': '运维评估', '11_模型运维/Cloud_Ops_Agent': '云运维智能体',
    '11_模型运维/Cloud_Ops_Agent/docs': '云运维智能体文档', '11_模型运维/Cloud_Ops_Agent/docs/templates': '文档模板',
    '11_模型运维/Cloud_Ops_Agent/scripts': '脚本',
    '12_架构基建': '架构基建', '12_架构基建/01_Architecture_Fundamentals': '架构基础', '12_架构基建/02_Architecture_Overview': '架构全景',
    '12_架构基建/03_AI_Stack': 'AI 技术栈', '12_架构基建/04_Kubernetes_Core': 'K8s 核心',
    '12_架构基建/05_CNCF_Cloud_Native_AI': '云原生 AI', '12_架构基建/06_Cloud_Providers': '云厂商',
    '12_架构基建/07_Hardware_Compute': '硬件算力', '12_架构基建/08_Networking': '网络',
    '12_架构基建/09_Storage': '存储', '12_架构基建/10_Security': '架构安全', '12_架构基建/11_AI_Gateway': 'AI 网关',
    '13_运维': '运维', '13_运维/01_AIOps_Fundamentals': '智能运维基础', '13_运维/02_SRE_Reliability': 'SRE 可靠性',
    '13_运维/03_Incident_Response': '事故响应', '13_运维/04_Troubleshooting': '故障排查',
    '13_运维/05_Cost_Management': '成本管理', '13_运维/06_Observability': '可观测性',
    '14_RAG系统': 'RAG 系统', '14_RAG系统/01_RAG_Fundamentals': 'RAG 基础', '14_RAG系统/02_Embeddings': '嵌入模型',
    '14_RAG系统/03_Vector_Databases': '向量数据库', '14_RAG系统/04_Advanced_RAG': '高级 RAG',
    '14_RAG系统/05_RAG_Production': 'RAG 生产化', '14_RAG系统/06_RAG_Frameworks': 'RAG 框架',
    '14_RAG系统/07_RAG_Evaluation': 'RAG 评估',
    '15_智能体': '智能体', '15_智能体/01_Agent_Foundations': '智能体基础', '15_智能体/02_Agent_Frameworks': '智能体框架',
    '15_智能体/03_Agent_Workflow': '智能体工作流', '15_智能体/04_Agent_Harness': '智能体 Harness',
    '15_智能体/05_Agent_Skills': '智能体技能', '15_智能体/06_Memory_Infrastructure': '记忆基础设施',
    '15_智能体/07_Agent_Evaluation': '智能体评估', '15_智能体/08_Agentic_Coding_Tools': '智能体编程工具',
    '15_智能体/09_Agent_Platforms': '智能体平台', '15_智能体/10_Enterprise_Agent': '企业智能体',
    '15_智能体/11_OpenClaw_Ecosystem': 'OpenClaw 生态', '15_智能体/12_Agent_Ecosystem_CN': '国内智能体生态',
    '15_智能体/13_Hello_Agents': '智能体入门教程', '15_智能体/14_GenAI_Courses': '生成式 AI 课程',
    '15_智能体/15_Course_Notes': '课程笔记', '15_智能体/16_Agent_Protocols': '智能体协议',
    '15_智能体/17_Agent_Applications': '智能体应用', '15_智能体/tests': '测试脚本',
    '15_智能体/assets': '资源文件', '15_智能体/assets/the-anatomy-of-an-agent-harness.assets': 'Harness 配图',
    '15_智能体/07_Agent_Evaluation/Demo': '评估演示', '15_智能体/07_Agent_Evaluation/Demo/evaluator': '评估引擎',
    '15_智能体/07_Agent_Evaluation/Demo/plugins': '评估插件', '15_智能体/07_Agent_Evaluation/Demo/datasets': '测试数据集',
    '15_智能体/07_Agent_Evaluation/Demo/results': '评估结果', '15_智能体/07_Agent_Evaluation/Testing_Methodologies': '测试方法论',
    '15_智能体/07_Agent_Evaluation/QA': '质量保障', '15_智能体/07_Agent_Evaluation/Assessment': '评估流程',
    '15_智能体/07_Agent_Evaluation/Rubrics': '评分细则', '15_智能体/07_Agent_Evaluation/Test_Bank': '测试题库',
    '15_智能体/07_Agent_Evaluation/Benchmarking': '基准评测', '15_智能体/07_Agent_Evaluation/Metrics': '评估指标',
    '15_智能体/07_Agent_Evaluation/Implementation': '实施落地', '15_智能体/07_Agent_Evaluation/Corpus_Assessment': '语料库评估',
    '15_智能体/07_Agent_Evaluation/Cloud_Agent_Evaluation': '云智能体测评',
    '16_编程': '编程', '16_编程/01_Coding_Fundamentals': '编程基础', '16_编程/02_Theory': '编程理论',
    '16_编程/03_Methodology': '编程方法论', '16_编程/04_Practice': '编程实践', '16_编程/05_Tools': '编程工具',
    '16_编程/06_Tool_Comparison': '工具对比', '16_编程/07_OpenCode': 'OpenCode', '16_编程/08_OpenRouter': 'OpenRouter',
    '16_编程/09_Security': '编程安全',
    '17_伦理安全': '伦理安全', '17_伦理安全/01_Ethics_Fundamentals': '伦理基础', '17_伦理安全/02_Value_Alignment': '价值对齐',
    '17_伦理安全/03_Governance': '治理合规', '17_伦理安全/04_AI_Safety_RedTeaming': 'AI 安全红队',
    '17_伦理安全/05_Mechanistic_Interpretability': '机制可解释性', '17_伦理安全/06_Security': 'LLM 安全',
    '17_伦理安全/07_AI_Security_2026': 'AI 安全 2026', '17_伦理安全/08_AI_Supply_Chain_Security': 'AI 供应链安全',
    '17_伦理安全/09_Deepfake_Security': '深伪安全', '17_伦理安全/10_Privacy_Preserving_AI': '隐私保护 AI',
    '17_伦理安全/11_Federated_Learning': '联邦学习',
    '18_行业应用': '行业应用', '18_行业应用/01_Industry_Overview': '行业全景', '18_行业应用/02_AI_for_Science': '科学智能',
    '18_行业应用/03_Healthcare': '医疗健康', '18_行业应用/04_Finance': '金融', '18_行业应用/05_Education': '教育',
    '18_行业应用/06_Autonomous_Driving': '自动驾驶', '18_行业应用/07_Manufacturing': '制造业',
    '18_行业应用/08_Retail_Ecommerce': '零售电商', '18_行业应用/09_Energy_Climate': '能源气候',
    '18_行业应用/10_Agriculture': '农业', '18_行业应用/11_Legal_Government': '法律政务',
    '18_行业应用/12_HR_Recruitment': '人力资源招聘', '18_行业应用/13_Content_Media': '内容媒体',
    '18_行业应用/14_Gaming_Entertainment': '游戏娱乐', '18_行业应用/15_Security_Cybersecurity': '网络安全',
    '18_行业应用/16_Supply_Chain_Logistics': '供应链物流', '18_行业应用/17_Robotics_Industry': '机器人产业',
    '18_行业应用/18_Code_Generation': '代码生成', '18_行业应用/19_Other_Industries': '其他行业',
    '19_业界观点': '业界观点', '19_业界观点/Josh_Starmer': '乔什·斯塔默', '19_业界观点/Fei_Fei_Li': '李飞飞',
    '19_业界观点/Wenfeng_Liang': '梁文锋', '19_业界观点/Emad_Mostaque': '埃马德·莫斯塔克', '19_业界观点/Jie_Tang': '唐杰',
    '19_业界观点/Richard_Socher': '理查德·索赫尔', '19_业界观点/Jinze_Bai': '白金泽', '19_业界观点/Junjie_Yan': '闫俊杰',
    '19_业界观点/Sebastian_Thrun': '塞巴斯蒂安·特龙', '19_业界观点/Zhilin_Yang': '杨植麟', '19_业界观点/3Blue1Brown': '3Blue1Brown 频道',
    '20_论文精读': '论文精读', '20_论文精读/01_Research_Guide': '研究指南', '20_论文精读/02_Architecture': '架构论文',
    '20_论文精读/03_Scaling': '规模化论文', '20_论文精读/04_Efficiency': '效率论文', '20_论文精读/05_LLM_Inference_Research': '推理研究',
    '20_论文精读/06_Alignment': '对齐论文', '20_论文精读/07_RL': '强化学习论文', '20_论文精读/08_Vision': '视觉论文',
    '20_论文精读/09_Frontier': '前沿论文', '20_论文精读/10_Retrieval': '检索论文', '20_论文精读/11_Domain_Surveys': '领域综述',
    '21_面试岗位': '面试岗位', '21_面试岗位/AI_Product_Manager': 'AI 产品经理', '21_面试岗位/AI_Solutions_Architect': 'AI 解决方案架构师',
    '21_面试岗位/LLM_Platform_Engineer': '大模型平台工程师', '21_面试岗位/NLP_Engineer': 'NLP 工程师',
    '21_面试岗位/AI_Reliability_Engineer': 'AI 可靠性工程师', '21_面试岗位/Machine_Learning_Engineer': '机器学习工程师',
    '21_面试岗位/Robotics_Engineer': '机器人工程师', '21_面试岗位/Research_Scientist': '研究科学家',
    '21_面试岗位/AI_Policy_Specialist': 'AI 政策专家', '21_面试岗位/AI_Data_Analyst': 'AI 数据分析师',
    '21_面试岗位/AI_Evaluation_Engineer': 'AI 评估工程师', '21_面试岗位/AI_Research_Scientist': 'AI 研究科学家',
    '21_面试岗位/AI_Research_Engineer': 'AI 研究工程师', '21_面试岗位/Data_Scientist': '数据科学家',
    '21_面试岗位/Applied_Scientist': '应用科学家', '21_面试岗位/Prompt_Engineer': '提示词工程师',
    '21_面试岗位/AI_Infrastructure_Engineer': 'AI 基础设施工程师', '21_面试岗位/Cloud_Ops_Engineer': '云运维工程师',
    '21_面试岗位/MLOps_Engineer': 'MLOps 工程师', '21_面试岗位/Computer_Vision_Engineer': '计算机视觉工程师',
    '21_面试岗位/AI_Security_Engineer': 'AI 安全工程师', '21_面试岗位/Data_Engineer': '数据工程师',
    '21_面试岗位/Interview_Guide': '面试指南',
    '90_学习': '学习资源', '90_学习/References': '参考资料', '90_学习/References/books': '书籍',
    '90_学习/References/Projects': '项目合集', '90_学习/Courses': '课程', '90_学习/Courses/apachecn': 'ApacheCN 课程',
    '90_学习/Courses/microsoft': '微软课程', '90_学习/Courses/other': '其他课程', '90_学习/Courses/deeplearning_ai': 'DeepLearning.AI 课程',
    '90_学习/Courses/share_ai': 'Share AI 课程', '90_学习/Courses/hugging_face': 'Hugging Face 课程',
    '90_学习/Courses/coursera': 'Coursera 课程', '90_学习/guides': '学习指南', '90_学习/pathways': '学习路线',
    '94_可视化': '可视化', '94_可视化/Evaluation_Viz': '评估可视化', '94_可视化/System_Viz': '系统可视化',
    '94_可视化/Best_Practices': '最佳实践', '94_可视化/Training_Viz': '训练可视化',
    '概念': '概念图谱', '概念/General': '通用概念', '概念/GPU': 'GPU 概念', '概念/LLM': '大模型概念',
    '概念/K8s': 'K8s 概念', '概念/Training': '训练概念', '概念/Inference': '推理概念', '概念/MLOps': 'MLOps 概念',
    '概念/Agent': '智能体概念', '概念/RAG': 'RAG 概念', '概念/Safety': '安全概念', '概念/Vision': '视觉概念',
    '治理': '治理', '治理/plan': '计划', '治理/notes': '笔记', '治理/cheatsheets': '速查表', '治理/_meta': '元数据',
}

# 根章节英文名（目录名为中文，采用 README_EN 官方映射）
ROOT_EN = {
    '00_入门': 'AI Introduction', '01_数学基础': 'Math & CS Fundamentals', '02_机器学习': 'Classical ML',
    '03_深度学习': 'Deep Learning', '04_计算机视觉': 'Computer Vision', '05_大模型': 'NLP & LLMs',
    '06_强化学习': 'RL & Agents', '07_模型训练': 'Model Training', '08_模型评估': 'Model Evaluation',
    '09_测试': 'AI Testing', '10_部署推理': 'Deployment & Inference', '11_模型运维': 'MLOps Pipeline',
    '12_架构基建': 'Architecture & Infrastructure', '13_运维': 'AI Ops', '14_RAG系统': 'RAG Systems',
    '15_智能体': 'Agent Production', '16_编程': 'AI Coding', '17_伦理安全': 'Ethics & Safety',
    '18_行业应用': 'Industry Applications', '19_业界观点': 'Industry Insights', '20_论文精读': 'Essential Papers',
    '21_面试岗位': 'AI Career Interviews', '90_学习': 'Learning Resources', '94_可视化': 'Visualization',
    '概念': 'Concept Graph', '治理': 'Governance',
}

STRIP_PAREN = re.compile(r'[（(][^（）()]*[)）]')
H1_RE = re.compile(r'^(#\s+.+)$', re.M)


def dir_name_en(rel_dir):
    """目录英文名：根章节查表；其余用目录名去编号前缀、下划线转空格。"""
    if rel_dir in ROOT_EN:
        return ROOT_EN[rel_dir]
    base = os.path.basename(rel_dir)
    base = re.sub(r'^\d+_', '', base)
    return base.replace('_', ' ')


def derive_zh(title, summary, relpath):
    """派生中文简称：人工映射 > title 中文主体 > title 括号中文 > None"""
    if relpath in FILE_ZH:
        return FILE_ZH[relpath]
    title = title.strip().strip('"\'')
    core = STRIP_PAREN.sub('', title).strip()
    if CJK.search(core):
        # 若冒号后为纯英文副标题则只保留冒号前部分
        segs = re.split(r'[:：]', core, maxsplit=1)
        if len(segs) == 2 and CJK.search(segs[0]) and not CJK.search(segs[1]):
            core = segs[0].strip()
        return re.sub(r'\s{2,}', ' ', core)[:40].strip(' -—|')
    # title 主体为英文，尝试提取括号内中文
    for m in re.finditer(r'[（(]([^（）()]*)[)）]', title):
        if CJK.search(m.group(1)):
            return m.group(1).strip()[:40]
    if CJK.search(title):
        return title[:40]
    return None


def annotate(path, relpath, is_index, dir_rel, dry=False):
    """返回状态: added / skip / no_name"""
    text = open(path, encoding='utf-8').read()
    if '\nname_zh:' in text[:3000] or '> 中文简称' in text:
        return 'skip'
    if not text.startswith('---'):
        return 'no_fm'
    end = text.find('\n---', 3)
    if end == -1:
        return 'no_fm'
    fm = text[:end]
    m = re.search(r'^title:\s*(.+)$', fm, re.M)
    title = m.group(1) if m else ''
    s = re.search(r'^summary:\s*(.+)$', fm, re.M)
    summary = s.group(1) if s else ''
    if is_index and dir_rel in DIR_ZH:
        zh = DIR_ZH[dir_rel]
    else:
        zh = derive_zh(title, summary, relpath)
    if not zh:
        return 'no_name'
    # 1) frontmatter 注入
    new_fields = f'name_zh: "{zh}"'
    if is_index:
        en = dir_name_en(dir_rel)
        new_fields += f'\nname_en: "{en}"'
    new_text = text[:end] + '\n' + new_fields + text[end:]
    # 2) 正文可见行：插在首个 H1 之后
    body_start = new_text.find('\n---', 3) + 4
    body = new_text[body_start:]
    if is_index:
        note = f'> 中文简称：{zh} ｜ English Name: {dir_name_en(dir_rel)}'
    else:
        note = f'> 中文简称：{zh}'
    h1 = H1_RE.search(body)
    if h1:
        insert_at = body_start + h1.end()
        new_text = new_text[:insert_at] + '\n\n' + note + new_text[insert_at:]
    else:
        # 无 H1：放在 frontmatter 之后
        new_text = new_text[:body_start] + '\n' + note + '\n' + new_text[body_start:]
    if not dry:
        open(path, 'w', encoding='utf-8').write(new_text)
    return 'added'


def main():
    dry = '--dry-run' in sys.argv
    stats = {'added': 0, 'skip': 0, 'no_name': 0, 'no_fm': 0}
    no_name_list, no_fm_list = [], []
    for dp, dns, fns in os.walk(ROOT):
        rel = os.path.relpath(dp, ROOT)
        parts = [] if rel == '.' else rel.split(os.sep)
        dns[:] = [d for d in dns if d not in ALWAYS_SKIP and not (not parts and d in ROOT_ONLY_SKIP)]
        for fn in sorted(fns):
            if not fn.endswith('.md'):
                continue
            path = os.path.join(dp, fn)
            relpath = os.path.join(rel, fn) if rel != '.' else fn
            is_index = (fn == 'index.md' and rel != '.')
            r = annotate(path, relpath, is_index, rel, dry)
            stats[r] += 1
            if r == 'no_name':
                no_name_list.append(relpath)
            elif r == 'no_fm':
                no_fm_list.append(relpath)
    print(f"{'[DRY-RUN] ' if dry else ''}added={stats['added']} skip={stats['skip']} "
          f"no_name={stats['no_name']} no_fm={stats['no_fm']}")
    if no_name_list:
        print('--- 未能派生中文简称 ---')
        for p in no_name_list:
            print(' ', p)
    if no_fm_list:
        print('--- 无 frontmatter ---')
        for p in no_fm_list:
            print(' ', p)


if __name__ == '__main__':
    main()
