/**
 * K8s Test Questions — 120 questions across 15 dimensions
 * Used by the real-time K8s model evaluation page.
 */

export type K8sDimension =
  | "core_concepts"
  | "api_objects"
  | "ops_knowledge"
  | "version_timeliness"
  | "config_writing"
  | "error_analysis"
  | "alert_handling"
  | "version_upgrade"
  | "best_practices"
  | "terminology"
  | "command_parsing"
  | "log_analysis"
  | "change_plan"
  | "troubleshooting"
  | "feature_explanation";

export interface K8sTestQuestion {
  id: string;
  dimension: K8sDimension;
  difficulty: "easy" | "medium" | "hard";
  question: string;
  referenceAnswer: string;
  keywords: string[];
  maxScore: number;
}

export const DIMENSION_META: Record<K8sDimension, { label: string; icon: string; color: string }> = {
  core_concepts:      { label: "核心概念",   icon: "⎈", color: "#60A5FA" },
  api_objects:        { label: "API 对象",   icon: "◈", color: "#A78BFA" },
  ops_knowledge:      { label: "运维知识",   icon: "⚙", color: "#34D399" },
  version_timeliness: { label: "版本时效",   icon: "⏱", color: "#FBBF24" },
  config_writing:     { label: "配置编写",   icon: "📝", color: "#F87171" },
  error_analysis:     { label: "报错分析",   icon: "🔴", color: "#EF4444" },
  alert_handling:     { label: "告警处理",   icon: "🔔", color: "#F59E0B" },
  version_upgrade:    { label: "版本升级",   icon: "⬆", color: "#8B5CF6" },
  best_practices:     { label: "最佳实践",   icon: "✅", color: "#10B981" },
  terminology:        { label: "名词解释",   icon: "📖", color: "#6366F1" },
  command_parsing:    { label: "命令解析",   icon: "⌨", color: "#EC4899" },
  log_analysis:       { label: "日志分析",   icon: "📋", color: "#14B8A6" },
  change_plan:        { label: "变更方案",   icon: "📐", color: "#F97316" },
  troubleshooting:    { label: "排查方案",   icon: "🔍", color: "#0EA5E9" },
  feature_explanation:{ label: "功能说明",   icon: "💡", color: "#84CC16" },
};

export const K8S_TEST_QUESTIONS: K8sTestQuestion[] = [
  // ==================== core_concepts (8) ====================
  {
    id: "cc-01", dimension: "core_concepts", difficulty: "easy", maxScore: 100,
    question: "请解释 Kubernetes 中 Pod 的概念，以及为什么 Pod 是 K8s 的最小调度单元而不是容器？",
    referenceAnswer: "Pod 是 Kubernetes 中最小的可部署计算单元，它可以包含一个或多个容器。Pod 内的容器共享网络命名空间、存储卷和 IPC 命名空间。Pod 是最小调度单元因为：1) 紧密耦合的容器需要共享资源；2) 同一 Pod 内容器可通过 localhost 通信；3) sidecar 模式需要多容器协同。",
    keywords: ["最小调度单元", "共享网络", "共享存储", "容器", "namespace", "sidecar", "localhost"],
  },
  {
    id: "cc-02", dimension: "core_concepts", difficulty: "easy", maxScore: 100,
    question: "请说明 Kubernetes Service 的四种类型及其使用场景。",
    referenceAnswer: "Kubernetes Service 有四种类型：1) ClusterIP（默认）- 集群内部访问；2) NodePort - 通过节点端口暴露服务，端口范围 30000-32767；3) LoadBalancer - 使用云平台负载均衡器暴露服务；4) ExternalName - 将服务映射到外部 DNS 名称。",
    keywords: ["ClusterIP", "NodePort", "LoadBalancer", "ExternalName", "30000", "集群内部", "负载均衡"],
  },
  {
    id: "cc-03", dimension: "core_concepts", difficulty: "medium", maxScore: 100,
    question: "请详细解释 Kubernetes 控制平面的核心组件及各自职责。",
    referenceAnswer: "K8s 控制平面包含：1) kube-apiserver - API 网关，所有组件通信的中心；2) etcd - 分布式键值存储，保存集群状态；3) kube-scheduler - 负责将 Pod 调度到合适节点；4) kube-controller-manager - 运行各种控制器（Deployment、ReplicaSet、Node 控制器等）；5) cloud-controller-manager - 与云平台交互。",
    keywords: ["apiserver", "etcd", "scheduler", "controller-manager", "分布式", "键值存储", "调度", "控制器"],
  },
  {
    id: "cc-04", dimension: "core_concepts", difficulty: "medium", maxScore: 100,
    question: "解释 Kubernetes 中 Deployment、ReplicaSet 和 Pod 三者之间的关系和层级结构。",
    referenceAnswer: "Deployment 管理 ReplicaSet，ReplicaSet 管理 Pod。Deployment 负责声明式更新策略（滚动更新、回滚），它会创建 ReplicaSet 来维护指定数量的 Pod 副本。ReplicaSet 确保指定数量的 Pod 副本持续运行。更新 Deployment 时会创建新 ReplicaSet 并逐步迁移 Pod。",
    keywords: ["Deployment", "ReplicaSet", "滚动更新", "副本", "回滚", "声明式", "管理"],
  },
  {
    id: "cc-05", dimension: "core_concepts", difficulty: "medium", maxScore: 100,
    question: "什么是 Kubernetes 的声明式 API？它与命令式 API 有什么本质区别？",
    referenceAnswer: "声明式 API 让用户描述期望的最终状态（desired state），系统自动调和（reconcile）到该状态。命令式 API 则要求用户指定具体操作步骤。K8s 的控制器循环（reconciliation loop）持续将实际状态向期望状态靠拢。优点：幂等性、自愈能力、可版本控制。",
    keywords: ["声明式", "期望状态", "reconcile", "调和", "幂等", "自愈", "控制器循环"],
  },
  {
    id: "cc-06", dimension: "core_concepts", difficulty: "hard", maxScore: 100,
    question: "请解释 Kubernetes 中 QoS 类别（Guaranteed、Burstable、BestEffort）的判定规则和驱逐优先级。",
    referenceAnswer: "QoS 类别：1) Guaranteed - 所有容器都设置了 requests=limits 的 CPU 和 Memory；2) Burstable - 至少一个容器设置了 requests 或 limits，但不满足 Guaranteed 条件；3) BestEffort - 没有设置任何 requests/limits。驱逐优先级：BestEffort 最先被驱逐，其次是 Burstable（超出 requests 的），Guaranteed 最后。",
    keywords: ["Guaranteed", "Burstable", "BestEffort", "requests", "limits", "驱逐", "OOM"],
  },
  {
    id: "cc-07", dimension: "core_concepts", difficulty: "hard", maxScore: 100,
    question: "解释 Kubernetes 中 ConfigMap 和 Secret 的区别、使用方式，以及 Secret 的安全局限性。",
    referenceAnswer: "ConfigMap 存储非敏感配置数据，Secret 存储敏感数据（Base64 编码，非加密）。使用方式：环境变量、Volume 挂载、命令行参数。Secret 安全局限：默认只是 Base64 编码非加密；需要启用 EncryptionConfiguration 进行静态加密；etcd 中默认明文存储；建议使用外部 KMS 或 Sealed Secrets。",
    keywords: ["ConfigMap", "Secret", "Base64", "加密", "etcd", "EncryptionConfiguration", "Volume", "环境变量"],
  },
  {
    id: "cc-08", dimension: "core_concepts", difficulty: "easy", maxScore: 100,
    question: "什么是 Kubernetes Namespace？它解决了什么问题？默认有哪些 Namespace？",
    referenceAnswer: "Namespace 是 K8s 中的虚拟集群分区，用于资源隔离和多租户管理。解决问题：资源命名冲突、访问控制、资源配额。默认 Namespace：default（用户默认）、kube-system（系统组件）、kube-public（公开资源）、kube-node-lease（节点心跳）。",
    keywords: ["虚拟集群", "资源隔离", "多租户", "default", "kube-system", "kube-public", "kube-node-lease", "资源配额"],
  },

  // ==================== api_objects (8) ====================
  {
    id: "ao-01", dimension: "api_objects", difficulty: "medium", maxScore: 100,
    question: "请解释 CustomResourceDefinition（CRD）的作用和使用场景，并说明 Operator 模式。",
    referenceAnswer: "CRD 允许用户扩展 Kubernetes API，定义自定义资源类型。Operator 模式通过 CRD + 自定义控制器实现复杂应用的自动化管理（安装、升级、备份、故障恢复）。使用场景：数据库运维（MySQL Operator）、中间件管理、有状态应用生命周期管理。",
    keywords: ["CRD", "自定义资源", "Operator", "控制器", "扩展", "生命周期", "自动化"],
  },
  {
    id: "ao-02", dimension: "api_objects", difficulty: "medium", maxScore: 100,
    question: "详细说明 RBAC 在 Kubernetes 中的工作原理，包括 Role、ClusterRole、RoleBinding、ClusterRoleBinding。",
    referenceAnswer: "RBAC 基于角色的访问控制：Role 定义命名空间级别的权限规则；ClusterRole 定义集群级别的权限；RoleBinding 将 Role 绑定到用户/组/ServiceAccount；ClusterRoleBinding 将 ClusterRole 绑定到主体。权限由 apiGroups、resources、verbs 三元组定义。",
    keywords: ["RBAC", "Role", "ClusterRole", "RoleBinding", "ClusterRoleBinding", "ServiceAccount", "apiGroups", "verbs"],
  },
  {
    id: "ao-03", dimension: "api_objects", difficulty: "medium", maxScore: 100,
    question: "解释 NetworkPolicy 的作用和工作机制，如何实现 Pod 间的网络隔离？",
    referenceAnswer: "NetworkPolicy 是 K8s 的网络访问控制资源，通过标签选择器定义 ingress/egress 规则来隔离 Pod 网络流量。默认所有 Pod 互通，一旦应用 NetworkPolicy，未被允许的流量会被拒绝。需要 CNI 插件支持（如 Calico、Cilium）。可按 Pod 标签、Namespace、IP CIDR 过滤。",
    keywords: ["NetworkPolicy", "ingress", "egress", "标签选择器", "CNI", "Calico", "Cilium", "网络隔离"],
  },
  {
    id: "ao-04", dimension: "api_objects", difficulty: "medium", maxScore: 100,
    question: "说明 Ingress 资源的作用、工作原理和常见的 Ingress Controller 实现。",
    referenceAnswer: "Ingress 定义 HTTP/HTTPS 路由规则，将外部流量路由到集群内 Service。支持基于域名和路径的路由、TLS 终结、负载均衡。需要 Ingress Controller 实现：Nginx Ingress Controller、Traefik、HAProxy、AWS ALB Ingress Controller。Ingress 本身只是规则定义，需要 Controller 来执行。",
    keywords: ["Ingress", "HTTP", "路由", "TLS", "Nginx", "Controller", "域名", "路径"],
  },
  {
    id: "ao-05", dimension: "api_objects", difficulty: "hard", maxScore: 100,
    question: "比较 StatefulSet 和 Deployment 的区别，StatefulSet 适用于哪些场景？",
    referenceAnswer: "StatefulSet 与 Deployment 的区别：1) 稳定的网络标识（有序 Pod 名称如 pod-0、pod-1）；2) 稳定的持久存储（每个 Pod 绑定独立 PVC）；3) 有序部署和扩缩容；4) 有序滚动更新。适用场景：数据库（MySQL、PostgreSQL）、分布式存储（ZooKeeper、etcd）、消息队列（Kafka）。",
    keywords: ["StatefulSet", "有序", "稳定网络标识", "持久存储", "PVC", "数据库", "有状态应用"],
  },
  {
    id: "ao-06", dimension: "api_objects", difficulty: "medium", maxScore: 100,
    question: "解释 PersistentVolume（PV）和 PersistentVolumeClaim（PVC）的工作机制和生命周期。",
    referenceAnswer: "PV 是集群级别的存储资源，由管理员预先配置或通过 StorageClass 动态创建。PVC 是用户的存储请求。绑定流程：PVC → 匹配可用 PV → 绑定使用。回收策略：Retain（保留）、Delete（删除）、Recycle（已废弃）。支持动态供给（Dynamic Provisioning）通过 StorageClass。",
    keywords: ["PV", "PVC", "StorageClass", "动态供给", "Retain", "Delete", "绑定", "存储"],
  },
  {
    id: "ao-07", dimension: "api_objects", difficulty: "hard", maxScore: 100,
    question: "解释 Admission Controller 的工作原理，区分 Mutating 和 Validating Webhook。",
    referenceAnswer: "Admission Controller 在 API 请求经过认证授权后、持久化之前进行拦截处理。Mutating Admission Webhook 可修改请求对象（如注入 sidecar、添加标签）；Validating Admission Webhook 只能接受/拒绝请求（如策略验证）。执行顺序：先 Mutating 后 Validating。常见内置 Admission：LimitRanger、ResourceQuota、PodSecurity。",
    keywords: ["Admission", "Mutating", "Validating", "Webhook", "sidecar", "LimitRanger", "ResourceQuota"],
  },
  {
    id: "ao-08", dimension: "api_objects", difficulty: "medium", maxScore: 100,
    question: "DaemonSet 和 Job/CronJob 分别适用于什么场景？它们的调度策略有何不同？",
    referenceAnswer: "DaemonSet 确保每个（或指定）节点运行一个 Pod 副本，适用于日志收集（Fluentd）、监控代理（Prometheus Node Exporter）、网络插件。Job 执行一次性任务直到完成，CronJob 按时间表定期执行。DaemonSet 随节点扩缩，Job 关注任务完成，CronJob 关注调度周期。",
    keywords: ["DaemonSet", "Job", "CronJob", "日志收集", "监控", "一次性任务", "定时"],
  },

  // ==================== ops_knowledge (8) ====================
  {
    id: "ok-01", dimension: "ops_knowledge", difficulty: "hard", maxScore: 100,
    question: "Pod 处于 CrashLoopBackOff 状态，请给出系统化的排查步骤。",
    referenceAnswer: "排查步骤：1) kubectl describe pod 查看 Events 和 Last State；2) kubectl logs --previous 查看崩溃前日志；3) 检查容器退出码（OOMKilled=137, Error=1）；4) 检查 liveness/readiness probe 配置；5) 检查资源限制是否过低；6) 检查配置挂载和环境变量；7) 尝试 exec 进入容器调试；8) 检查镜像是否正确和可拉取。",
    keywords: ["describe", "logs", "previous", "OOMKilled", "probe", "退出码", "资源限制", "镜像"],
  },
  {
    id: "ok-02", dimension: "ops_knowledge", difficulty: "hard", maxScore: 100,
    question: "如何备份和恢复 etcd 数据？请给出具体的命令和注意事项。",
    referenceAnswer: "备份：etcdctl snapshot save /backup/etcd-snapshot.db --endpoints=https://127.0.0.1:2379 --cacert --cert --key。恢复：1) 停止 kube-apiserver；2) etcdctl snapshot restore snapshot.db --data-dir=/var/lib/etcd-restored；3) 更新 etcd 配置指向新数据目录；4) 重启 etcd 和 apiserver。注意：恢复会改变集群 ID，定期备份建议使用 CronJob。",
    keywords: ["etcdctl", "snapshot", "save", "restore", "备份", "恢复", "cacert", "data-dir"],
  },
  {
    id: "ok-03", dimension: "ops_knowledge", difficulty: "medium", maxScore: 100,
    question: "如何安全地对一个 Kubernetes 节点进行维护（如内核升级）？",
    referenceAnswer: "节点维护步骤：1) kubectl cordon node - 标记节点不可调度；2) kubectl drain node --ignore-daemonsets --delete-emptydir-data - 驱逐所有 Pod；3) 执行维护操作（升级内核等）；4) kubectl uncordon node - 恢复节点可调度。注意 PDB（PodDisruptionBudget）限制、DaemonSet Pod 不会被驱逐。",
    keywords: ["cordon", "drain", "uncordon", "不可调度", "驱逐", "PodDisruptionBudget", "PDB", "DaemonSet"],
  },
  {
    id: "ok-04", dimension: "ops_knowledge", difficulty: "hard", maxScore: 100,
    question: "Kubernetes 集群证书即将过期，如何检查和轮换证书？",
    referenceAnswer: "检查证书过期时间：kubeadm certs check-expiration 或 openssl x509 -in /etc/kubernetes/pki/apiserver.crt -noout -enddate。轮换：kubeadm certs renew all 续签所有证书，然后重启控制平面组件。kubelet 证书自动轮换需开启 RotateKubeletClientCertificate 特性门控。建议设置监控告警在证书过期前 30 天提醒。",
    keywords: ["kubeadm", "certs", "renew", "过期", "轮换", "openssl", "RotateKubelet", "pki"],
  },
  {
    id: "ok-05", dimension: "ops_knowledge", difficulty: "medium", maxScore: 100,
    question: "如何排查 Kubernetes 中的 DNS 解析问题？",
    referenceAnswer: "DNS 排查步骤：1) 运行测试 Pod：kubectl run test --image=busybox -- nslookup kubernetes.default；2) 检查 CoreDNS Pod 是否正常运行；3) 查看 CoreDNS 日志；4) 验证 kube-dns Service 是否存在（kubectl get svc -n kube-system）；5) 检查节点 /etc/resolv.conf 配置；6) 使用 dig/nslookup 测试集群内外解析；7) 检查 NetworkPolicy 是否阻止 DNS 流量（UDP 53）。",
    keywords: ["DNS", "CoreDNS", "nslookup", "resolv.conf", "kube-dns", "UDP 53", "dig"],
  },
  {
    id: "ok-06", dimension: "ops_knowledge", difficulty: "medium", maxScore: 100,
    question: "如何使用 kubectl top 和 Metrics Server 监控集群资源使用情况？",
    referenceAnswer: "Metrics Server 是集群资源指标聚合器，提供 CPU/内存使用数据。安装后可使用：kubectl top nodes 查看节点资源、kubectl top pods 查看 Pod 资源。Metrics Server 从 kubelet 的 Summary API 收集数据。HPA 依赖 Metrics Server 进行自动扩缩。对于更完整的监控建议使用 Prometheus + Grafana。",
    keywords: ["Metrics Server", "kubectl top", "CPU", "内存", "HPA", "Prometheus", "Grafana", "kubelet"],
  },
  {
    id: "ok-07", dimension: "ops_knowledge", difficulty: "hard", maxScore: 100,
    question: "kube-apiserver 响应延迟过高，如何进行性能诊断和优化？",
    referenceAnswer: "诊断：1) 检查 apiserver 审计日志；2) 查看 /metrics 端点的请求延迟指标（apiserver_request_duration_seconds）；3) 检查 etcd 性能（etcd_disk_backend_commit_duration）；4) 排查 webhook 调用延迟。优化：增加 apiserver 副本；优化 etcd（SSD 存储、独立部署）；限制 API 优先级和公平性（APF）；减少低效 List/Watch；启用 API 请求压缩。",
    keywords: ["apiserver", "延迟", "metrics", "etcd", "webhook", "APF", "审计日志", "SSD"],
  },
  {
    id: "ok-08", dimension: "ops_knowledge", difficulty: "medium", maxScore: 100,
    question: "Kubernetes 集群如何实现高可用（HA）部署架构？",
    referenceAnswer: "K8s HA 架构要点：1) 控制平面多副本（至少 3 个 master 节点）；2) etcd 集群（奇数节点，建议 3 或 5 个）；3) 负载均衡器前置（HAProxy/Nginx/云 LB）指向多个 apiserver；4) kube-vip 或 keepalived 提供虚拟 IP；5) 工作节点分布在多个可用区；6) 使用 PDB 保证核心服务最小可用。",
    keywords: ["高可用", "HA", "多副本", "etcd 集群", "负载均衡", "可用区", "kube-vip", "keepalived"],
  },

  // ==================== version_timeliness (8) ====================
  {
    id: "vt-01", dimension: "version_timeliness", difficulty: "hard", maxScore: 100,
    question: "Kubernetes 1.30 版本有哪些重要的新特性和变更？",
    referenceAnswer: "K8s 1.30 (Uwubernetes) 主要特性：1) Pod Scheduling Readiness GA；2) Min domains in PodTopologySpread GA；3) Node log query via kubectl 进入 Beta；4) Contextual Logging 进入 Beta；5) CEL-based Admission Control 增强；6) Structured authorization configuration 进入 Beta；7) AppArmor 支持进入 Stable。",
    keywords: ["1.30", "Scheduling Readiness", "TopologySpread", "CEL", "AppArmor", "Contextual Logging"],
  },
  {
    id: "vt-02", dimension: "version_timeliness", difficulty: "hard", maxScore: 100,
    question: "请介绍 Kubernetes Gateway API 的设计理念和相比 Ingress 的优势。",
    referenceAnswer: "Gateway API 是新一代流量管理标准：1) 角色分离 - GatewayClass（基础设施提供者）、Gateway（集群运维）、HTTPRoute（应用开发者）；2) 更丰富的路由能力（Header 匹配、权重分流、请求镜像）；3) 跨 Namespace 路由；4) 原生 TCP/UDP/gRPC 支持；5) 更好的扩展性。相比 Ingress：更标准化、多角色、功能更强大。",
    keywords: ["Gateway API", "GatewayClass", "HTTPRoute", "角色分离", "权重分流", "gRPC", "跨 Namespace"],
  },
  {
    id: "vt-03", dimension: "version_timeliness", difficulty: "medium", maxScore: 100,
    question: "Kubernetes 中的 Sidecar Container 原生支持（KEP-753）有什么改进？",
    referenceAnswer: "K8s 1.28 引入 Sidecar Container 原生支持（initContainers + restartPolicy: Always）：1) 生命周期与主容器对齐，随 Pod 启动和停止；2) 解决了 init container 顺序执行的限制；3) 比常规 container 更早启动、更晚停止；4) 适用于日志代理、服务网格代理（Istio/Envoy）、监控代理。在 1.29 进入 Beta。",
    keywords: ["Sidecar", "KEP-753", "restartPolicy", "initContainers", "生命周期", "Istio", "Envoy"],
  },
  {
    id: "vt-04", dimension: "version_timeliness", difficulty: "hard", maxScore: 100,
    question: "什么是 Kubernetes 的 ValidatingAdmissionPolicy（基于 CEL）？它如何替代 Webhook？",
    referenceAnswer: "ValidatingAdmissionPolicy 使用 CEL（Common Expression Language）在集群内定义验证策略，无需外部 Webhook 服务器。优势：1) 无网络延迟（进程内执行）；2) 无需维护 Webhook 服务器；3) 声明式定义，更易管理。通过 ValidatingAdmissionPolicy + ValidatingAdmissionPolicyBinding 配置。在 K8s 1.30 进入 GA。",
    keywords: ["ValidatingAdmissionPolicy", "CEL", "Common Expression Language", "Webhook", "进程内", "GA", "声明式"],
  },
  {
    id: "vt-05", dimension: "version_timeliness", difficulty: "medium", maxScore: 100,
    question: "Kubernetes 1.31 中有哪些对 Pod 生命周期管理的改进？",
    referenceAnswer: "K8s 1.31 改进：1) Pod Lifecycle Sleep Action 进入 Beta - prestop hook 支持 sleep 操作；2) Traffic distribution for Services（Topology-aware 路由）增强；3) AppArmor 支持 GA；4) PersistentVolume lastPhaseTransitionTime 进入 GA；5) Job 的 managedBy 字段进入 Beta 支持自定义控制器。",
    keywords: ["1.31", "Sleep Action", "prestop", "Traffic distribution", "AppArmor", "lastPhaseTransitionTime"],
  },
  {
    id: "vt-06", dimension: "version_timeliness", difficulty: "hard", maxScore: 100,
    question: "请介绍 Cilium 作为 Kubernetes CNI 插件的核心技术优势和 eBPF 的作用。",
    referenceAnswer: "Cilium 基于 eBPF 技术的 CNI 插件优势：1) eBPF 在内核层面处理网络，绕过 iptables，性能更高；2) 透明加密（WireGuard/IPsec）；3) L7 层网络策略（HTTP/gRPC 感知）；4) Hubble 可观测性平台；5) Service Mesh（无 sidecar 模式）；6) 多集群网络（ClusterMesh）；7) 带宽管理和公平排队。",
    keywords: ["Cilium", "eBPF", "iptables", "L7", "Hubble", "WireGuard", "ClusterMesh", "Service Mesh"],
  },
  {
    id: "vt-07", dimension: "version_timeliness", difficulty: "medium", maxScore: 100,
    question: "Kubernetes 的 Pod Security Standards（PSS）替代了什么？包含哪三个级别？",
    referenceAnswer: "Pod Security Standards 替代了已废弃的 PodSecurityPolicy（PSP）。三个级别：1) Privileged - 不限制，完全开放；2) Baseline - 防止已知的权限提升，最小限制；3) Restricted - 严格限制，遵循 Pod 安全最佳实践。通过 PodSecurity Admission Controller 在 namespace 级别强制执行（enforce/audit/warn 三种模式）。",
    keywords: ["Pod Security Standards", "PSS", "PodSecurityPolicy", "Privileged", "Baseline", "Restricted", "enforce", "audit"],
  },
  {
    id: "vt-08", dimension: "version_timeliness", difficulty: "medium", maxScore: 100,
    question: "Kubernetes 中的 VPA（Vertical Pod Autoscaler）与 HPA 有什么区别？何时使用 VPA？",
    referenceAnswer: "VPA 垂直扩展（调整单 Pod 的 CPU/内存 requests/limits），HPA 水平扩展（调整 Pod 副本数量）。VPA 适用场景：1) 不适合水平扩展的有状态应用；2) 资源需求不确定需要自动调优；3) 配合 HPA 使用实现更精细的资源管理。VPA 有三种模式：Off（仅推荐）、Initial（创建时设置）、Auto（自动更新，可能重启 Pod）。",
    keywords: ["VPA", "HPA", "垂直扩展", "水平扩展", "requests", "limits", "Off", "Auto", "有状态"],
  },

  // ==================== config_writing (8) ====================
  {
    id: "cw-01", dimension: "config_writing", difficulty: "medium", maxScore: 100,
    question: "编写一个 Deployment YAML，部署 nginx:1.25，3 个副本，设置资源限制和健康检查。",
    referenceAnswer: "apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: nginx-deployment\nspec:\n  replicas: 3\n  selector:\n    matchLabels:\n      app: nginx\n  template:\n    metadata:\n      labels:\n        app: nginx\n    spec:\n      containers:\n      - name: nginx\n        image: nginx:1.25\n        resources:\n          requests:\n            cpu: 100m\n            memory: 128Mi\n          limits:\n            cpu: 500m\n            memory: 256Mi\n        livenessProbe:\n          httpGet:\n            path: /\n            port: 80\n          initialDelaySeconds: 10\n        readinessProbe:\n          httpGet:\n            path: /\n            port: 80",
    keywords: ["apiVersion", "apps/v1", "Deployment", "replicas: 3", "nginx:1.25", "resources", "requests", "limits", "livenessProbe", "readinessProbe"],
  },
  {
    id: "cw-02", dimension: "config_writing", difficulty: "hard", maxScore: 100,
    question: "编写一个 NetworkPolicy，只允许带有 app=frontend 标签的 Pod 访问 app=backend 的 Pod 的 8080 端口。",
    referenceAnswer: "apiVersion: networking.k8s.io/v1\nkind: NetworkPolicy\nmetadata:\n  name: backend-allow-frontend\nspec:\n  podSelector:\n    matchLabels:\n      app: backend\n  policyTypes:\n  - Ingress\n  ingress:\n  - from:\n    - podSelector:\n        matchLabels:\n          app: frontend\n    ports:\n    - protocol: TCP\n      port: 8080",
    keywords: ["NetworkPolicy", "networking.k8s.io/v1", "podSelector", "app: backend", "app: frontend", "Ingress", "port: 8080", "TCP"],
  },
  {
    id: "cw-03", dimension: "config_writing", difficulty: "medium", maxScore: 100,
    question: "编写一个 HPA 配置，当 CPU 使用率超过 70% 时，将 Deployment 从 2 个副本扩展到最多 10 个。",
    referenceAnswer: "apiVersion: autoscaling/v2\nkind: HorizontalPodAutoscaler\nmetadata:\n  name: nginx-hpa\nspec:\n  scaleTargetRef:\n    apiVersion: apps/v1\n    kind: Deployment\n    name: nginx-deployment\n  minReplicas: 2\n  maxReplicas: 10\n  metrics:\n  - type: Resource\n    resource:\n      name: cpu\n      target:\n        type: Utilization\n        averageUtilization: 70",
    keywords: ["HorizontalPodAutoscaler", "autoscaling/v2", "scaleTargetRef", "minReplicas", "maxReplicas", "cpu", "averageUtilization: 70"],
  },
  {
    id: "cw-04", dimension: "config_writing", difficulty: "hard", maxScore: 100,
    question: "编写一个 StatefulSet，部署 3 副本的 Redis 集群，每个副本使用独立的 10Gi PVC。",
    referenceAnswer: "apiVersion: apps/v1\nkind: StatefulSet\nmetadata:\n  name: redis-cluster\nspec:\n  serviceName: redis-headless\n  replicas: 3\n  selector:\n    matchLabels:\n      app: redis\n  template:\n    metadata:\n      labels:\n        app: redis\n    spec:\n      containers:\n      - name: redis\n        image: redis:7\n        ports:\n        - containerPort: 6379\n        volumeMounts:\n        - name: redis-data\n          mountPath: /data\n  volumeClaimTemplates:\n  - metadata:\n      name: redis-data\n    spec:\n      accessModes: [ReadWriteOnce]\n      resources:\n        requests:\n          storage: 10Gi",
    keywords: ["StatefulSet", "serviceName", "replicas: 3", "redis", "volumeClaimTemplates", "10Gi", "ReadWriteOnce", "containerPort: 6379"],
  },
  {
    id: "cw-05", dimension: "config_writing", difficulty: "medium", maxScore: 100,
    question: "编写一个 Ingress 配置，将 api.example.com 路由到 api-service:8080，web.example.com 路由到 web-service:3000。",
    referenceAnswer: "apiVersion: networking.k8s.io/v1\nkind: Ingress\nmetadata:\n  name: multi-host-ingress\n  annotations:\n    nginx.ingress.kubernetes.io/rewrite-target: /\nspec:\n  ingressClassName: nginx\n  rules:\n  - host: api.example.com\n    http:\n      paths:\n      - path: /\n        pathType: Prefix\n        backend:\n          service:\n            name: api-service\n            port:\n              number: 8080\n  - host: web.example.com\n    http:\n      paths:\n      - path: /\n        pathType: Prefix\n        backend:\n          service:\n            name: web-service\n            port:\n              number: 3000",
    keywords: ["Ingress", "networking.k8s.io/v1", "ingressClassName", "host", "api.example.com", "web.example.com", "pathType", "Prefix"],
  },
  {
    id: "cw-06", dimension: "config_writing", difficulty: "hard", maxScore: 100,
    question: "编写一个 RBAC 配置，创建一个只能在 dev 命名空间中查看和列出 Pod、Service 的 ServiceAccount。",
    referenceAnswer: "apiVersion: v1\nkind: ServiceAccount\nmetadata:\n  name: dev-reader\n  namespace: dev\n---\napiVersion: rbac.authorization.k8s.io/v1\nkind: Role\nmetadata:\n  name: pod-service-reader\n  namespace: dev\nrules:\n- apiGroups: [\"\"]\n  resources: [\"pods\", \"services\"]\n  verbs: [\"get\", \"list\", \"watch\"]\n---\napiVersion: rbac.authorization.k8s.io/v1\nkind: RoleBinding\nmetadata:\n  name: dev-reader-binding\n  namespace: dev\nsubjects:\n- kind: ServiceAccount\n  name: dev-reader\n  namespace: dev\nroleRef:\n  kind: Role\n  name: pod-service-reader\n  apiGroup: rbac.authorization.k8s.io",
    keywords: ["ServiceAccount", "Role", "RoleBinding", "rbac.authorization.k8s.io", "pods", "services", "get", "list", "watch", "namespace: dev"],
  },
  {
    id: "cw-07", dimension: "config_writing", difficulty: "medium", maxScore: 100,
    question: "编写一个 CronJob，每天凌晨 2 点执行数据库备份脚本，保留最近 3 次成功记录。",
    referenceAnswer: "apiVersion: batch/v1\nkind: CronJob\nmetadata:\n  name: db-backup\nspec:\n  schedule: \"0 2 * * *\"\n  successfulJobsHistoryLimit: 3\n  failedJobsHistoryLimit: 1\n  jobTemplate:\n    spec:\n      template:\n        spec:\n          containers:\n          - name: backup\n            image: postgres:16\n            command: [\"/bin/sh\", \"-c\", \"pg_dump -h db-host -U admin mydb > /backup/dump-$(date +%F).sql\"]\n          restartPolicy: OnFailure",
    keywords: ["CronJob", "batch/v1", "schedule", "0 2 * * *", "successfulJobsHistoryLimit", "pg_dump", "restartPolicy: OnFailure"],
  },
  {
    id: "cw-08", dimension: "config_writing", difficulty: "hard", maxScore: 100,
    question: "编写一个 Pod 安全配置，使用 securityContext 以非 root 用户运行，禁止权限提升，只读根文件系统。",
    referenceAnswer: "apiVersion: v1\nkind: Pod\nmetadata:\n  name: secure-pod\nspec:\n  securityContext:\n    runAsNonRoot: true\n    runAsUser: 1000\n    runAsGroup: 1000\n    fsGroup: 1000\n  containers:\n  - name: app\n    image: myapp:latest\n    securityContext:\n      allowPrivilegeEscalation: false\n      readOnlyRootFilesystem: true\n      capabilities:\n        drop:\n        - ALL\n    volumeMounts:\n    - name: tmp\n      mountPath: /tmp\n  volumes:\n  - name: tmp\n    emptyDir: {}",
    keywords: ["securityContext", "runAsNonRoot", "runAsUser", "allowPrivilegeEscalation: false", "readOnlyRootFilesystem", "capabilities", "drop", "ALL"],
  },

  // ==================== error_analysis (4) ====================
  {
    id: "ea-01", dimension: "error_analysis", difficulty: "hard", maxScore: 100,
    question: "Pod 报错 'Back-off restarting failed container'，可能的原因有哪些？如何逐步排查？",
    referenceAnswer: "该报错表示容器反复启动失败进入退避重试。原因：1) 应用启动时崩溃（代码 bug、缺少依赖）；2) OOMKilled（内存不足，退出码 137）；3) 镜像 ENTRYPOINT/CMD 配置错误；4) 挂载 Volume 失败；5) ConfigMap/Secret 不存在。排查：kubectl describe pod 查看 Events → kubectl logs --previous 查看上次日志 → 检查退出码 → 检查资源 limits。",
    keywords: ["Back-off", "CrashLoopBackOff", "退出码", "137", "OOMKilled", "describe", "logs", "--previous", "ENTRYPOINT"],
  },
  {
    id: "ea-02", dimension: "error_analysis", difficulty: "medium", maxScore: 100,
    question: "执行 kubectl apply 时报 'error: error validating data: ValidationError' 是什么原因？如何修复？",
    referenceAnswer: "这通常是 YAML 格式或字段不符合 API Schema 导致的。常见原因：1) apiVersion 或 kind 错误；2) 字段名拼写错误（如 contianer → container）；3) 字段类型不匹配（字符串写成整数）；4) 缩进错误。修复：使用 kubectl apply --dry-run=client -f file.yaml 验证；使用 kubectl explain 查看正确字段名；使用 YAML lint 工具检查格式。",
    keywords: ["ValidationError", "dry-run", "apiVersion", "kind", "kubectl explain", "YAML", "Schema", "缩进"],
  },
  {
    id: "ea-03", dimension: "error_analysis", difficulty: "hard", maxScore: 100,
    question: "Node 状态变为 NotReady，kubectl describe node 显示 'KubeletNotReady'，如何分析和处理？",
    referenceAnswer: "KubeletNotReady 表示 kubelet 无法正常工作。分析步骤：1) SSH 到节点检查 kubelet 服务状态：systemctl status kubelet；2) 查看 kubelet 日志：journalctl -u kubelet -f；3) 检查节点资源（磁盘、内存、PID）是否耗尽（DiskPressure、MemoryPressure、PIDPressure）；4) 检查容器运行时（containerd）是否正常；5) 检查证书是否过期；6) 检查 CNI 插件是否正常。",
    keywords: ["NotReady", "kubelet", "systemctl", "journalctl", "DiskPressure", "MemoryPressure", "containerd", "证书"],
  },
  {
    id: "ea-04", dimension: "error_analysis", difficulty: "medium", maxScore: 100,
    question: "Pod 处于 ImagePullBackOff 状态，如何排查镜像拉取失败问题？",
    referenceAnswer: "ImagePullBackOff 表示无法拉取容器镜像。排查：1) kubectl describe pod 查看具体错误信息；2) 检查镜像名称和 tag 是否正确；3) 检查私有仓库认证（imagePullSecrets）；4) 检查节点网络是否能访问镜像仓库；5) 在节点上手动 crictl pull 测试；6) 检查仓库是否限速（如 Docker Hub rate limit）。",
    keywords: ["ImagePullBackOff", "imagePullSecrets", "describe", "私有仓库", "认证", "crictl", "网络", "rate limit"],
  },

  // ==================== alert_handling (4) ====================
  {
    id: "ah-01", dimension: "alert_handling", difficulty: "hard", maxScore: 100,
    question: "Prometheus 告警 'KubePodCrashLooping' 触发，该告警的含义是什么？如何处理？",
    referenceAnswer: "KubePodCrashLooping 表示 Pod 在最近一段时间内持续重启。处理：1) 确认告警涉及的 Pod（namespace/name）；2) kubectl logs 查看崩溃日志；3) kubectl describe pod 查看事件和退出原因；4) 检查是否因资源不足导致 OOM；5) 检查 liveness probe 是否配置过于严格；6) 根据退出码判断：137=OOM, 1=应用错误, 143=SIGTERM；7) 必要时回滚最近的部署。",
    keywords: ["KubePodCrashLooping", "Prometheus", "重启", "logs", "OOM", "liveness", "退出码", "回滚"],
  },
  {
    id: "ah-02", dimension: "alert_handling", difficulty: "medium", maxScore: 100,
    question: "收到 'KubeNodeNotReady' 告警，如何建立标准化的应急响应流程？",
    referenceAnswer: "标准应急流程：1) 确认告警节点（kubectl get nodes）；2) 检查节点条件（kubectl describe node）；3) 评估影响范围（该节点上的关键 Pod）；4) 如有 HA，确认工作负载已漂移到其他节点；5) SSH 到节点排查：systemctl status kubelet/containerd、dmesg、df -h、free -m；6) 修复后验证节点恢复 Ready；7) 记录根因和修复措施到事件报告。",
    keywords: ["KubeNodeNotReady", "应急", "describe node", "kubelet", "containerd", "dmesg", "漂移", "根因"],
  },
  {
    id: "ah-03", dimension: "alert_handling", difficulty: "hard", maxScore: 100,
    question: "etcd 集群告警 'etcdHighCommitDurations' 表示什么？如何优化 etcd 性能？",
    referenceAnswer: "该告警表示 etcd 的 backend commit 延迟过高，影响集群性能。优化：1) 使用 SSD 磁盘而非 HDD；2) 将 etcd 数据目录放在独立磁盘上；3) 确保 etcd 节点间网络延迟 < 10ms；4) 调整 etcd 参数：--heartbeat-interval、--election-timeout；5) 执行碎片整理：etcdctl defrag；6) 压缩历史版本：etcdctl compact；7) 监控 etcd 大小，避免超过 8GB。",
    keywords: ["etcdHighCommitDurations", "SSD", "commit", "延迟", "defrag", "compact", "heartbeat", "独立磁盘"],
  },
  {
    id: "ah-04", dimension: "alert_handling", difficulty: "medium", maxScore: 100,
    question: "告警 'KubePersistentVolumeFillingUp' 触发，预计 4 小时后磁盘满，如何处理？",
    referenceAnswer: "处理步骤：1) 确认 PVC 对应的 Pod 和应用；2) kubectl exec 进入 Pod 检查磁盘使用（du -sh）；3) 清理不必要的文件（日志、临时文件）；4) 扩容 PVC（如果 StorageClass 支持 allowVolumeExpansion）：kubectl edit pvc 增大 storage；5) 配置日志轮转避免日志撑满磁盘；6) 设置 ResourceQuota 限制 PVC 大小；7) 添加持续监控和告警阈值。",
    keywords: ["PersistentVolume", "FillingUp", "PVC", "扩容", "allowVolumeExpansion", "du -sh", "日志轮转", "ResourceQuota"],
  },

  // ==================== version_upgrade (4) ====================
  {
    id: "vu-01", dimension: "version_upgrade", difficulty: "hard", maxScore: 100,
    question: "如何将 Kubernetes 集群从 1.30 升级到 1.31？请给出详细步骤和注意事项。",
    referenceAnswer: "升级步骤：1) 阅读 1.31 变更日志和弃用 API 列表；2) 备份 etcd 数据；3) 升级控制平面：kubeadm upgrade plan → kubeadm upgrade apply v1.31.x；4) 逐个升级 kubelet 和 kubectl：apt/yum upgrade → systemctl restart kubelet；5) 先升级 master 再升级 worker；6) 每次只跨一个小版本。注意：检查 Pod Disruption Budget、验证关键工作负载、准备回滚计划。",
    keywords: ["kubeadm upgrade", "etcd 备份", "控制平面", "kubelet", "跨一个小版本", "弃用 API", "回滚", "PDB"],
  },
  {
    id: "vu-02", dimension: "version_upgrade", difficulty: "medium", maxScore: 100,
    question: "Kubernetes 升级时如何处理已废弃的 API 版本（如 extensions/v1beta1）？",
    referenceAnswer: "处理废弃 API：1) 使用 kubectl convert 转换旧版本 manifest；2) 使用 kubent(kube-no-trouble) 工具扫描集群中使用的废弃 API；3) 使用 pluto 工具检测 Helm chart 中的废弃 API；4) 更新 CI/CD 模板中的 apiVersion；5) 升级前在测试环境验证；6) 注意 Ingress 从 extensions/v1beta1 迁移到 networking.k8s.io/v1、CronJob 从 batch/v1beta1 迁移到 batch/v1。",
    keywords: ["废弃", "API", "kubent", "pluto", "extensions/v1beta1", "networking.k8s.io/v1", "convert", "apiVersion"],
  },
  {
    id: "vu-03", dimension: "version_upgrade", difficulty: "hard", maxScore: 100,
    question: "大规模集群（500+ 节点）升级 Kubernetes 的最佳策略是什么？",
    referenceAnswer: "大规模升级策略：1) 金丝雀升级 - 先升级少量节点验证；2) 分批滚动升级 - 按 rack/zone 分组逐批升级；3) 蓝绿升级 - 创建新版本集群后迁移工作负载；4) 使用 node pool 策略（云厂商支持）- 创建新版本节点池→迁移→删除旧池；5) 自动化工具：Cluster API、kOps；6) 监控每批升级后的集群健康状态；7) 准备快速回滚机制。",
    keywords: ["金丝雀", "滚动升级", "蓝绿", "node pool", "Cluster API", "kOps", "分批", "回滚"],
  },
  {
    id: "vu-04", dimension: "version_upgrade", difficulty: "medium", maxScore: 100,
    question: "Kubernetes 版本升级后，如何验证集群功能正常？",
    referenceAnswer: "验证方法：1) kubectl get nodes 确认所有节点版本和 Ready 状态；2) kubectl get pods -A 检查系统组件健康；3) 运行 e2e 冒烟测试（创建 Deployment/Service 验证基本功能）；4) 验证 DNS 解析正常（nslookup kubernetes.default）；5) 验证 Ingress/LoadBalancer 流量正常；6) 检查监控指标是否异常；7) 验证 PV/PVC 挂载正常；8) 运行 sonobuoy 一致性测试。",
    keywords: ["验证", "get nodes", "e2e", "冒烟测试", "DNS", "sonobuoy", "一致性", "监控"],
  },

  // ==================== best_practices (4) ====================
  {
    id: "bp-01", dimension: "best_practices", difficulty: "medium", maxScore: 100,
    question: "Kubernetes 生产环境中 Pod 资源配置的最佳实践是什么？",
    referenceAnswer: "资源配置最佳实践：1) 始终设置 requests 和 limits；2) requests 基于实际负载设置（通过 VPA 推荐或监控数据）；3) CPU limits 可适当宽松（可压缩资源），Memory limits 必须严格（不可压缩）；4) 使用 LimitRange 设置默认值；5) 使用 ResourceQuota 限制 namespace 总量；6) Guaranteed QoS 用于关键服务（requests=limits）；7) 定期通过 kubectl top 和 Prometheus 审查资源使用率。",
    keywords: ["requests", "limits", "VPA", "LimitRange", "ResourceQuota", "QoS", "Guaranteed", "监控"],
  },
  {
    id: "bp-02", dimension: "best_practices", difficulty: "hard", maxScore: 100,
    question: "如何设计 Kubernetes 的多租户隔离架构？",
    referenceAnswer: "多租户最佳实践：1) Namespace 隔离 - 每个租户独立 namespace；2) RBAC - 严格的角色权限控制；3) NetworkPolicy - 跨 namespace 网络隔离；4) ResourceQuota - 限制各租户资源上限；5) Pod Security Standards - Restricted 级别；6) LimitRange - 防止单 Pod 占用过多资源；7) 独立 ServiceAccount；8) 考虑使用 vCluster 或 Capsule 实现更强隔离；9) 日志和监控按租户隔离。",
    keywords: ["多租户", "Namespace", "RBAC", "NetworkPolicy", "ResourceQuota", "Pod Security", "vCluster", "Capsule"],
  },
  {
    id: "bp-03", dimension: "best_practices", difficulty: "medium", maxScore: 100,
    question: "Kubernetes 健康检查（Probe）配置的最佳实践有哪些？",
    referenceAnswer: "Probe 最佳实践：1) livenessProbe - 检测应用是否死锁，设置合理的 initialDelaySeconds（应用启动时间）；2) readinessProbe - 检测应用是否就绪接收流量，用于滚动更新；3) startupProbe - 慢启动应用使用，避免 liveness 误杀；4) 避免在 probe 中执行重操作（数据库查询等）；5) 使用 httpGet 而非 exec（exec 创建进程开销大）；6) failureThreshold * periodSeconds 要大于应用正常恢复时间。",
    keywords: ["livenessProbe", "readinessProbe", "startupProbe", "initialDelaySeconds", "failureThreshold", "httpGet", "就绪", "滚动更新"],
  },
  {
    id: "bp-04", dimension: "best_practices", difficulty: "hard", maxScore: 100,
    question: "如何实现 Kubernetes 的零停机部署（Zero-downtime Deployment）？",
    referenceAnswer: "零停机部署：1) 使用 RollingUpdate 策略，设置 maxUnavailable=0；2) 配置 readinessProbe 确保新 Pod 就绪才接流量；3) 使用 preStop hook（sleep 5-10s）确保连接优雅排空；4) 配置 PodDisruptionBudget 保证最小可用数；5) 使用 terminationGracePeriodSeconds 给足关闭时间；6) 应用层实现优雅关闭（处理 SIGTERM）；7) 使用金丝雀发布或蓝绿部署降低风险。",
    keywords: ["零停机", "RollingUpdate", "maxUnavailable", "readinessProbe", "preStop", "PDB", "SIGTERM", "优雅关闭"],
  },

  // ==================== terminology (4) ====================
  {
    id: "tm-01", dimension: "terminology", difficulty: "easy", maxScore: 100,
    question: "请解释 Kubernetes 中的 'Reconciliation Loop'（调和循环）是什么意思？",
    referenceAnswer: "Reconciliation Loop（调和循环）是 Kubernetes 控制器的核心工作机制。控制器持续监视资源的实际状态（current state）和期望状态（desired state），当两者不一致时，控制器执行操作使实际状态趋向期望状态。这是 K8s 声明式 API 的基础，确保系统自愈能力。例如 ReplicaSet 控制器发现实际 Pod 数少于 replicas 设定值时，会自动创建新 Pod。",
    keywords: ["调和", "Reconciliation", "期望状态", "实际状态", "控制器", "自愈", "声明式", "Watch"],
  },
  {
    id: "tm-02", dimension: "terminology", difficulty: "easy", maxScore: 100,
    question: "解释 Kubernetes 中 'Taint' 和 'Toleration' 的含义和用途。",
    referenceAnswer: "Taint（污点）是标记在节点上的属性，阻止 Pod 调度到该节点。Toleration（容忍）是 Pod 上的属性，允许 Pod 调度到带有对应 Taint 的节点。用途：1) 专用节点（GPU 节点只运行 ML 任务）；2) 驱逐 Pod（NoExecute 效果）；3) Master 节点隔离。三种效果：NoSchedule（不调度新 Pod）、PreferNoSchedule（尽量不调度）、NoExecute（驱逐已有 Pod）。",
    keywords: ["Taint", "Toleration", "NoSchedule", "PreferNoSchedule", "NoExecute", "污点", "容忍", "调度"],
  },
  {
    id: "tm-03", dimension: "terminology", difficulty: "medium", maxScore: 100,
    question: "什么是 Kubernetes 中的 'Finalizer'？它的作用和工作机制是什么？",
    referenceAnswer: "Finalizer 是资源元数据中的标记，用于确保资源删除前执行清理操作。工作机制：1) 删除带 Finalizer 的资源时，API Server 设置 deletionTimestamp 但不立即删除；2) 控制器检测到 deletionTimestamp 后执行清理逻辑；3) 清理完成后移除 Finalizer；4) 所有 Finalizer 移除后资源才真正被删除。用途：级联删除（如删除 Namespace 前清理所有资源）、外部资源清理。",
    keywords: ["Finalizer", "deletionTimestamp", "清理", "级联删除", "元数据", "控制器", "外部资源"],
  },
  {
    id: "tm-04", dimension: "terminology", difficulty: "medium", maxScore: 100,
    question: "解释 'Service Mesh' 在 Kubernetes 中的含义和作用。",
    referenceAnswer: "Service Mesh（服务网格）是微服务间通信的基础设施层，处理服务到服务的通信。核心功能：1) 流量管理（路由、重试、熔断、限流）；2) 安全通信（mTLS 加密）；3) 可观测性（指标、日志、追踪）。实现方式：Sidecar 模式（Istio/Envoy - 每个 Pod 注入代理容器）和 Sidecarless 模式（Cilium - 基于 eBPF 在内核层实现）。",
    keywords: ["Service Mesh", "服务网格", "Sidecar", "Istio", "Envoy", "mTLS", "熔断", "eBPF"],
  },

  // ==================== command_parsing (4) ====================
  {
    id: "cp-01", dimension: "command_parsing", difficulty: "medium", maxScore: 100,
    question: "解释命令 'kubectl get pods -o jsonpath=\"{.items[*].metadata.name}\" -l app=nginx --field-selector status.phase=Running' 的含义。",
    referenceAnswer: "该命令含义：1) kubectl get pods - 获取 Pod 列表；2) -o jsonpath=\"{.items[*].metadata.name}\" - 以 JSONPath 格式输出所有 Pod 的名称；3) -l app=nginx - 通过标签选择器筛选 app=nginx 的 Pod；4) --field-selector status.phase=Running - 通过字段选择器筛选状态为 Running 的 Pod。最终效果：列出所有正在运行的、标签为 app=nginx 的 Pod 名称。",
    keywords: ["jsonpath", "items", "metadata.name", "-l", "标签选择器", "field-selector", "Running", "筛选"],
  },
  {
    id: "cp-02", dimension: "command_parsing", difficulty: "hard", maxScore: 100,
    question: "解释命令 'kubectl patch deployment nginx -p \"{\\\"spec\\\":{\\\"template\\\":{\\\"metadata\\\":{\\\"annotations\\\":{\\\"kubectl.kubernetes.io/restartedAt\\\":\\\"$(date)\\\"}}}}}}\"' 的作用。",
    referenceAnswer: "该命令通过 kubectl patch 修改 Deployment 的 Pod 模板注解（annotations），添加 restartedAt 时间戳。由于 Pod 模板被修改，Kubernetes 会触发滚动更新，重启所有 Pod。这是 kubectl rollout restart deployment nginx 的手动等效操作，常用于需要重启 Pod 但不想修改镜像或配置的场景。patch 支持 strategic、merge、json 三种类型。",
    keywords: ["patch", "deployment", "annotations", "restartedAt", "滚动更新", "重启", "Pod 模板", "strategic"],
  },
  {
    id: "cp-03", dimension: "command_parsing", difficulty: "medium", maxScore: 100,
    question: "解释 'kubectl rollout undo deployment/nginx --to-revision=3' 的含义和使用场景。",
    referenceAnswer: "该命令将 nginx Deployment 回滚到第 3 个修订版本。含义：1) rollout undo - 撤销/回滚操作；2) deployment/nginx - 目标 Deployment；3) --to-revision=3 - 指定回滚到的版本号。使用场景：新版本发布后发现 bug 或性能问题，需要快速回退到之前稳定的版本。可用 kubectl rollout history deployment/nginx 查看版本历史。不指定 --to-revision 默认回滚到上一版本。",
    keywords: ["rollout", "undo", "revision", "回滚", "history", "版本", "Deployment", "快速回退"],
  },
  {
    id: "cp-04", dimension: "command_parsing", difficulty: "hard", maxScore: 100,
    question: "解释 'kubectl auth can-i create deployments --as=system:serviceaccount:dev:deployer -n production' 的含义。",
    referenceAnswer: "该命令用于检查权限：1) auth can-i - RBAC 权限检查；2) create deployments - 检查是否有创建 Deployment 的权限；3) --as=system:serviceaccount:dev:deployer - 模拟 dev 命名空间的 deployer ServiceAccount 身份；4) -n production - 在 production 命名空间中检查。返回 yes/no。用于调试 RBAC 配置，验证 ServiceAccount 权限是否正确设置。管理员常用于排查权限问题。",
    keywords: ["auth can-i", "RBAC", "ServiceAccount", "--as", "权限检查", "模拟", "namespace", "deployer"],
  },

  // ==================== log_analysis (4) ====================
  {
    id: "la-01", dimension: "log_analysis", difficulty: "hard", maxScore: 100,
    question: "kubelet 日志中出现 'failed to \"StartContainer\" for \"app\"' 和 'ErrImagePull'，分析可能原因和解决方案。",
    referenceAnswer: "分析：StartContainer 失败 + ErrImagePull 表示容器镜像拉取失败导致无法启动。可能原因：1) 镜像名称或 tag 不存在；2) 私有仓库未配置 imagePullSecrets；3) 仓库凭证过期或错误；4) 网络问题（DNS 无法解析仓库域名、防火墙阻断）；5) Docker Hub 限速。解决：检查镜像名 → 验证 Secret → 测试网络 → 检查仓库状态 → 在节点上手动 crictl pull 测试。",
    keywords: ["StartContainer", "ErrImagePull", "imagePullSecrets", "凭证", "DNS", "crictl pull", "限速", "私有仓库"],
  },
  {
    id: "la-02", dimension: "log_analysis", difficulty: "medium", maxScore: 100,
    question: "kube-apiserver 日志出现大量 'etcd: too many open files'，如何分析和解决？",
    referenceAnswer: "分析：etcd 文件描述符耗尽，通常是连接数过多。解决：1) 检查系统 ulimit：ulimit -n，增大到 65535+；2) 修改 /etc/security/limits.conf 或 systemd 的 LimitNOFILE；3) 检查是否有异常客户端大量连接 etcd；4) 检查 etcd 的 --max-request-bytes 和连接数配置；5) 重启 etcd 后确认监控稳定；6) 长期：减少不必要的 Watch、优化控制器的 List/Watch 行为。",
    keywords: ["too many open files", "ulimit", "文件描述符", "LimitNOFILE", "连接数", "Watch", "etcd", "limits.conf"],
  },
  {
    id: "la-03", dimension: "log_analysis", difficulty: "hard", maxScore: 100,
    question: "CoreDNS 日志显示 'SERVFAIL' 和 'i/o timeout'，如何诊断 DNS 解析超时？",
    referenceAnswer: "诊断步骤：1) 检查上游 DNS 服务器是否可达（CoreDNS Corefile 中的 forward 配置）；2) 检查节点的 /etc/resolv.conf 配置；3) 检查 NetworkPolicy 是否阻断了 DNS 流量（UDP/TCP 53）；4) 检查 CoreDNS Pod 是否资源不足（CPU throttled）；5) 检查 kube-dns Service 的 Endpoints 是否正确；6) 使用 kubectl exec 在 Pod 内测试 nslookup；7) 查看 CoreDNS 的 cache 和 health 插件状态。",
    keywords: ["SERVFAIL", "i/o timeout", "forward", "resolv.conf", "NetworkPolicy", "UDP 53", "CoreDNS", "上游 DNS"],
  },
  {
    id: "la-04", dimension: "log_analysis", difficulty: "medium", maxScore: 100,
    question: "容器日志中出现 'OOMKilled'（退出码 137），如何分析和避免？",
    referenceAnswer: "分析：退出码 137 = 128 + 9（SIGKILL），由内核 OOM Killer 终止进程。原因：容器实际内存使用超过了 resources.limits.memory。解决：1) kubectl describe pod 确认 OOMKilled 状态；2) 通过 Prometheus/Grafana 查看内存使用趋势；3) 增大 memory limits；4) 排查应用内存泄漏（heap dump 分析）；5) 使用 VPA 自动推荐合适的资源配置；6) 配置 JVM 参数（-XX:MaxRAMPercentage）避免 Java 应用 OOM。",
    keywords: ["OOMKilled", "137", "SIGKILL", "limits.memory", "内存泄漏", "VPA", "heap dump", "MaxRAMPercentage"],
  },

  // ==================== change_plan (4) ====================
  {
    id: "chp-01", dimension: "change_plan", difficulty: "hard", maxScore: 100,
    question: "设计一个将单机 MySQL 迁移到 Kubernetes StatefulSet 的变更方案。",
    referenceAnswer: "变更方案：1) 前期准备 - 评估数据量、创建 StorageClass（SSD）、编写 StatefulSet YAML；2) 创建 Headless Service + StatefulSet（1 副本）+ PVC（预留 2x 数据量）；3) 数据迁移 - mysqldump 导出 → kubectl cp 导入或使用 Percona XtraBackup；4) 应用切换 - 修改连接字符串指向 K8s Service；5) 验证 - 数据一致性检查、性能测试；6) 回滚计划 - 保留原始 MySQL 实例 48h。注意：配置 PDB、备份 CronJob。",
    keywords: ["StatefulSet", "MySQL", "Headless Service", "PVC", "mysqldump", "数据迁移", "StorageClass", "回滚"],
  },
  {
    id: "chp-02", dimension: "change_plan", difficulty: "hard", maxScore: 100,
    question: "制定从 Docker 运行时迁移到 Containerd 的变更方案。",
    referenceAnswer: "变更方案：1) 评估阶段 - 检查是否有 docker.sock 依赖、Docker-in-Docker 用例；2) 测试环境验证 - 在测试集群先行迁移验证；3) 逐节点迁移：a) cordon 节点 → b) drain Pod → c) 停止 kubelet 和 Docker → d) 安装 containerd → e) 配置 kubelet --container-runtime-endpoint=unix:///run/containerd/containerd.sock → f) 启动 kubelet → g) uncordon 节点；4) 验证 Pod 运行正常；5) 更新 CI/CD 中的构建工具（docker build → nerdctl/buildkit）。",
    keywords: ["Containerd", "Docker", "迁移", "container-runtime-endpoint", "cordon", "drain", "kubelet", "nerdctl"],
  },
  {
    id: "chp-03", dimension: "change_plan", difficulty: "medium", maxScore: 100,
    question: "如何制定 Ingress 从 Nginx 迁移到 Gateway API 的变更方案？",
    referenceAnswer: "变更方案：1) 安装 Gateway API CRD 和选定的实现（如 Envoy Gateway、Cilium）；2) 创建 GatewayClass 和 Gateway 资源；3) 逐个将 Ingress 规则转换为 HTTPRoute（映射 host/path/backend）；4) 灰度切换 - DNS 权重路由逐步将流量从旧 Ingress 迁移到 Gateway；5) 验证所有路由工作正常（TLS、重定向、跨 namespace 路由）；6) 清理旧 Ingress 资源和 Nginx Ingress Controller。时间线：建议 2-4 周分批次完成。",
    keywords: ["Gateway API", "Ingress", "Nginx", "HTTPRoute", "GatewayClass", "灰度", "迁移", "Envoy Gateway"],
  },
  {
    id: "chp-04", dimension: "change_plan", difficulty: "medium", maxScore: 100,
    question: "制定集群从单可用区扩展到多可用区的变更方案。",
    referenceAnswer: "变更方案：1) 在新可用区部署工作节点（使用相同的 K8s 版本和配置）；2) 配置跨可用区网络互通（VPC peering 或相同 VPC）；3) 使用 Pod Topology Spread Constraints 确保工作负载均匀分布；4) 配置 StorageClass 支持多可用区（zone-aware）；5) 更新 Service 的 topology 路由策略；6) 配置 PDB 确保每个可用区有足够副本；7) 测试可用区故障切换（模拟关闭一个 AZ）；8) 更新监控和告警规则。",
    keywords: ["多可用区", "Topology Spread", "VPC", "zone-aware", "PDB", "故障切换", "StorageClass", "节点"],
  },

  // ==================== troubleshooting (4) ====================
  {
    id: "ts-01", dimension: "troubleshooting", difficulty: "hard", maxScore: 100,
    question: "Service 端口正常但无法从集群外部访问，如何系统化排查？",
    referenceAnswer: "排查步骤：1) 验证 Service 类型（NodePort/LoadBalancer）和端口映射；2) kubectl get svc 确认 EXTERNAL-IP 和 PORT；3) kubectl get endpoints 确认后端 Pod 已关联；4) curl ClusterIP:Port 从集群内测试；5) 检查 kube-proxy 是否正常（iptables/ipvs 规则）；6) 检查节点防火墙/安全组规则；7) 检查 NetworkPolicy 是否阻断流量；8) 检查 Pod 的 readinessProbe 是否通过；9) 检查云负载均衡器配置和健康检查。",
    keywords: ["Service", "NodePort", "LoadBalancer", "endpoints", "kube-proxy", "iptables", "防火墙", "readinessProbe"],
  },
  {
    id: "ts-02", dimension: "troubleshooting", difficulty: "hard", maxScore: 100,
    question: "Pod 之间网络不通（ping 不通对方 Pod IP），如何排查？",
    referenceAnswer: "排查：1) 确认两个 Pod 的 IP 和所在节点；2) 在同节点 Pod 间测试（排除跨节点问题）；3) 检查 CNI 插件（Calico/Flannel/Cilium）状态：kubectl get pods -n kube-system；4) 检查 NetworkPolicy 是否阻断；5) 在节点上检查路由表（ip route）和 iptables 规则；6) 检查节点间网络可达性；7) 使用 tcpdump/wireshark 抓包分析；8) 检查 CNI 配置文件（/etc/cni/net.d/）；9) 查看 CNI 插件日志。",
    keywords: ["网络不通", "CNI", "Calico", "NetworkPolicy", "ip route", "tcpdump", "iptables", "跨节点"],
  },
  {
    id: "ts-03", dimension: "troubleshooting", difficulty: "medium", maxScore: 100,
    question: "Deployment 更新后新 Pod 一直处于 Pending 状态，如何排查？",
    referenceAnswer: "排查 Pending：1) kubectl describe pod 查看 Events（调度失败原因）；2) 资源不足 - Insufficient cpu/memory，需增加节点或减少 requests；3) 节点 Taint 未配置 Toleration；4) NodeSelector/NodeAffinity 无匹配节点；5) PVC 无法绑定（StorageClass 不存在或无可用 PV）；6) Pod 拓扑约束（TopologySpreadConstraints）无法满足；7) 检查 ResourceQuota 是否已达上限；8) 使用 kubectl get events --field-selector reason=FailedScheduling。",
    keywords: ["Pending", "调度", "Insufficient", "Taint", "NodeSelector", "PVC", "ResourceQuota", "FailedScheduling"],
  },
  {
    id: "ts-04", dimension: "troubleshooting", difficulty: "medium", maxScore: 100,
    question: "HPA 配置了但 Pod 数量不会自动扩缩，如何排查？",
    referenceAnswer: "排查：1) 确认 Metrics Server 已安装并正常运行；2) kubectl get hpa 查看 TARGETS 列是否显示 <unknown>；3) 确认目标 Deployment 的 Pod 设置了 resources.requests；4) 检查 HPA 的 Events（kubectl describe hpa）；5) 验证指标是否正确采集：kubectl top pods；6) 检查 HPA 的 minReplicas/maxReplicas 范围；7) 注意 HPA 默认冷却时间（downscale 5min, upscale 3min）；8) 确认 apiserver 启用了 --enable-aggregator-routing。",
    keywords: ["HPA", "Metrics Server", "TARGETS", "unknown", "requests", "冷却时间", "自动扩缩", "top pods"],
  },

  // ==================== feature_explanation (4) ====================
  {
    id: "fe-01", dimension: "feature_explanation", difficulty: "medium", maxScore: 100,
    question: "详细说明 Kubernetes 的 Pod Topology Spread Constraints 功能。",
    referenceAnswer: "Pod Topology Spread Constraints 控制 Pod 在拓扑域（节点、可用区、机架等）中的分布。核心字段：1) maxSkew - 允许的最大分布不均匀度；2) topologyKey - 拓扑域标签（如 topology.kubernetes.io/zone）；3) whenUnsatisfiable - 不满足时策略（DoNotSchedule/ScheduleAnyway）；4) labelSelector - 匹配的 Pod。用途：跨可用区均匀分布、提升服务高可用性。在 K8s 1.19 GA，支持 minDomains 指定最少域数量。",
    keywords: ["Topology Spread", "maxSkew", "topologyKey", "whenUnsatisfiable", "DoNotSchedule", "可用区", "均匀分布", "minDomains"],
  },
  {
    id: "fe-02", dimension: "feature_explanation", difficulty: "hard", maxScore: 100,
    question: "说明 Kubernetes 的 Ephemeral Containers（临时容器）功能及使用场景。",
    referenceAnswer: "Ephemeral Containers 是在运行中的 Pod 内临时添加的调试容器。特点：1) 不能设置端口、探针或资源限制；2) 生命周期不受 Pod 重启影响；3) 通过 kubectl debug 命令使用。使用场景：1) 调试 distroless/minimal 镜像的容器（缺少 shell 和工具）；2) 排查网络问题（注入 tcpdump/curl）；3) 排查文件系统问题。命令示例：kubectl debug -it pod/myapp --image=busybox --target=app。在 K8s 1.25 GA。",
    keywords: ["Ephemeral Containers", "临时容器", "kubectl debug", "distroless", "调试", "target", "busybox", "1.25 GA"],
  },
  {
    id: "fe-03", dimension: "feature_explanation", difficulty: "medium", maxScore: 100,
    question: "说明 Kubernetes 中 PodDisruptionBudget（PDB）的功能和配置。",
    referenceAnswer: "PodDisruptionBudget 限制自愿中断（如节点维护、滚动更新）时可同时不可用的 Pod 数量。配置：1) minAvailable - 最少可用 Pod 数（数字或百分比）；2) maxUnavailable - 最多不可用 Pod 数；3) selector - 匹配的 Pod 标签。工作原理：kubectl drain 和 Eviction API 会遵守 PDB 约束。注意：PDB 不保护非自愿中断（节点故障）。最佳实践：关键服务至少设置 minAvailable >= 1 或 maxUnavailable < 100%。",
    keywords: ["PodDisruptionBudget", "PDB", "minAvailable", "maxUnavailable", "自愿中断", "drain", "Eviction", "关键服务"],
  },
  {
    id: "fe-04", dimension: "feature_explanation", difficulty: "hard", maxScore: 100,
    question: "说明 Kubernetes 的 Cluster Autoscaler 工作原理和配置要点。",
    referenceAnswer: "Cluster Autoscaler 自动调整集群节点数量。扩容触发：Pod 因资源不足处于 Pending 时，CA 评估是否添加节点能满足需求。缩容触发：节点利用率低于阈值（默认 50%）且持续一段时间。配置要点：1) --scale-down-utilization-threshold（缩容阈值）；2) --scale-down-delay-after-add（新增节点后延迟缩容）；3) --max-nodes-total（最大节点数）；4) 使用 PDB 防止缩容影响服务；5) 设置 cluster-autoscaler.kubernetes.io/safe-to-evict 注解。",
    keywords: ["Cluster Autoscaler", "Pending", "缩容", "扩容", "利用率", "threshold", "max-nodes", "safe-to-evict"],
  },
];

/** Get questions filtered by dimensions */
export function getQuestionsByDimensions(dims: K8sDimension[]): K8sTestQuestion[] {
  if (dims.length === 0) return K8S_TEST_QUESTIONS;
  return K8S_TEST_QUESTIONS.filter((q) => dims.includes(q.dimension));
}
