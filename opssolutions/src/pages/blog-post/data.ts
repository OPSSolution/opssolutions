export type ContentBlock =
  | { type: "text"; content: string }
  | { type: "heading"; content: string }
  | { type: "code"; language: string; content: string }
  | { type: "callout"; variant: "info" | "warning" | "success" | "tip"; title: string; content: string }
  | { type: "list"; items: string[] };

export interface BlogPost {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  author: string;
  authorRole: string;
  authorBio: string;
  date: string;
  readTime: string;
  tags: string[];
  image: string;
  ogImage: string;
  toc: { id: string; title: string }[];
  body: ContentBlock[];
  relatedSlugs: string[];
}

const posts: Record<string, BlogPost> = {
  "trading-platform-2m-daily": {
    slug: "trading-platform-2m-daily",
    category: "Web Dev",
    title: "How We Built a Real-Time Trading Platform Processing $2M Daily",
    excerpt: "Deep dive into the architecture decisions, database design, and WebSocket infrastructure behind a high-frequency fintech platform — and how we hit 99.99% uptime from day one.",
    author: "Yuki Tanaka",
    authorRole: "Principal Engineer",
    authorBio: "Yuki leads platform engineering at Solutions Studio with 11 years of experience building high-throughput fintech and data-intensive applications. Previously at Bloomberg and Robinhood.",
    date: "May 8, 2026",
    readTime: "12 min read",
    tags: ["React", "WebSocket", "PostgreSQL", "Redis", "Node.js"],
    image: "https://readdy.ai/api/search-image?query=dark%20cinematic%20financial%20trading%20platform%20UI%20on%20multiple%20monitors%20with%20real-time%20data%20charts%2C%20neon%20green%20accent%20lines%2C%20professional%20tech%20workspace%2C%20dramatic%20studio%20lighting%2C%20modern%20fintech%20dashboard&width=1200&height=630&seq=blog_detail_01&orientation=landscape",
    ogImage: "https://readdy.ai/api/search-image?query=dark%20cinematic%20financial%20trading%20platform%20UI%20on%20multiple%20monitors%20with%20real-time%20data%20charts%2C%20neon%20green%20accent%20lines%2C%20professional%20tech%20workspace%2C%20dramatic%20studio%20lighting%2C%20modern%20fintech%20dashboard&width=1200&height=630&seq=blog_og_01&orientation=landscape",
    toc: [
      { id: "the-problem", title: "The Problem We Inherited" },
      { id: "architecture", title: "Architecture Decisions That Mattered" },
      { id: "websocket-layer", title: "Building the WebSocket Layer" },
      { id: "database", title: "Database Design for Real-Time Reads" },
      { id: "zero-downtime", title: "Zero-Downtime Migration Strategy" },
      { id: "lessons", title: "Key Lessons Learned" },
    ],
    body: [
      { type: "text", content: "When FinanceFlow Inc. first reached out to us, their CTO had a single slide in the pitch deck: a graph of crash events spiking every Tuesday at 9:34 AM — exactly when the New York Stock Exchange opening bell triggered a surge of simultaneous trades. The platform was crashing, traders were losing money, and the company was haemorrhaging client trust. Our job was to fix it." },
      { type: "heading", content: "The Problem We Inherited" },
      { type: "text", content: "The legacy system was a PHP 5.6 monolith originally built in 2019 by a two-person agency. It had served them fine until trading volume crossed 500 concurrent users. Beyond that threshold, the application server couldn't maintain persistent WebSocket connections — falling back to polling every 3 seconds. During high-volatility periods, 3 seconds might as well be an eternity." },
      { type: "text", content: "The database layer was a single Postgres 11 instance with no read replicas and a query pattern so unoptimised that fetching a user portfolio with 40 positions triggered 160 individual SQL queries. We found N+1 problems in places that made our eyes water. The worst offender: a positions page that took 6.2 seconds to load at 200 concurrent users." },
      { type: "callout", variant: "warning", title: "What We Were Dealing With", content: "6.2 second portfolio load time. 160 SQL queries per page. No WebSocket persistence. No caching layer. Weekly 2-hour maintenance windows. A PHP version so old it no longer receives security patches." },
      { type: "heading", content: "Architecture Decisions That Mattered" },
      { type: "text", content: "Before writing a single line of new code, we spent three days mapping failure domains. The key insight: the trading UI, the portfolio calculation engine, and the order processing pipeline had entirely different performance profiles and could be decoupled without sacrificing consistency. This led us to a service-oriented design rather than a full microservices split — pragmatic decomposition, not architectural purity for its own sake." },
      { type: "text", content: "We chose three primary services: a React frontend served via CloudFront, a real-time data service in Node.js handling all WebSocket connections, and a portfolio API in Node.js with Redis caching for expensive calculations. The services communicate via a RabbitMQ message queue for order events, keeping the systems loosely coupled while maintaining event ordering guarantees." },
      { type: "list", items: ["React 19 frontend with optimistic updates and sub-100ms renders", "Node.js real-time service with Socket.io — handling 2,000+ concurrent connections per instance", "Portfolio calculation service with Redis caching — 80ms response times vs. the original 6.2 seconds", "RabbitMQ for order event processing — durable, ordered, replayable", "PostgreSQL with 3 read replicas and connection pooling via PgBouncer"] },
      { type: "heading", content: "Building the WebSocket Layer" },
      { type: "text", content: "The WebSocket layer is the heartbeat of a trading platform. Every price tick, every order book update, every portfolio valuation change — all of it needs to flow from server to client in real time. We built this service to handle up to 10,000 simultaneous connections per Node.js instance using Socket.io's room-based subscription model." },
      { type: "code", language: "typescript", content: `// Real-time subscription handler
io.on('connection', (socket) => {
  // Authenticate via JWT on handshake
  const userId = socket.data.userId;
  
  // Subscribe to market data rooms
  socket.on('subscribe:ticker', (symbols: string[]) => {
    symbols.forEach(sym => socket.join(\`ticker:\${sym}\`));
  });
  
  // Subscribe to personal order updates
  socket.join(\`user:\${userId}:orders\`);
  
  // Heartbeat to detect stale connections
  socket.on('ping', () => socket.emit('pong', Date.now()));
  
  socket.on('disconnect', () => {
    logger.info({ userId, reason: socket.disconnectReason });
  });
});

// Market data broadcaster (runs every 100ms)
marketDataFeed.on('tick', (tick: Tick) => {
  io.to(\`ticker:\${tick.symbol}\`).emit('tick', tick);
});` },
      { type: "text", content: "The most critical reliability feature was graceful degradation. When a WebSocket connection drops — which happens, especially on mobile — the client automatically falls back to a 1-second polling interval and shows a subtle 'Reconnecting...' indicator. Connection re-establishment is attempted with exponential backoff up to 30 seconds. In 8 months of production, we've had zero reports of traders missing order fills due to connectivity issues." },
      { type: "heading", content: "Database Design for Real-Time Reads" },
      { type: "text", content: "The portfolio calculation was the biggest performance win. The original approach fetched every position individually and calculated P&L in application code. We replaced this with a single materialised view that pre-computes portfolio summaries and is refreshed every 5 seconds — fast enough for a portfolio dashboard, avoiding the need for real-time recalculation on every request." },
      { type: "code", language: "sql", content: `-- Materialised view for portfolio summaries
CREATE MATERIALIZED VIEW portfolio_summary AS
SELECT 
  p.user_id,
  p.symbol,
  p.quantity,
  p.avg_cost,
  lp.price AS last_price,
  (lp.price - p.avg_cost) * p.quantity AS unrealised_pnl,
  ((lp.price - p.avg_cost) / p.avg_cost * 100) AS pnl_pct
FROM positions p
JOIN latest_prices lp ON lp.symbol = p.symbol
WHERE p.quantity > 0;

-- Refresh every 5 seconds via pg_cron
SELECT cron.schedule('refresh-portfolio', '5 seconds',
  'REFRESH MATERIALIZED VIEW CONCURRENTLY portfolio_summary');` },
      { type: "callout", variant: "success", title: "Result", content: "Portfolio API response time dropped from 6.2 seconds to 78ms. That's an 98.7% improvement — achieved entirely through database query redesign, not hardware upgrades." },
      { type: "heading", content: "Zero-Downtime Migration Strategy" },
      { type: "text", content: "Migrating a live trading platform with zero downtime requires surgical precision. We used the strangler fig pattern: the new services ran in parallel with the legacy PHP app, with an Nginx proxy routing traffic based on feature flags. We started at 5% of users on the new system on a Tuesday (lowest volume day), monitored crash rates and latency for 48 hours, then scaled to 25%, 50%, and finally 100% over two weeks." },
      { type: "text", content: "The hardest part wasn't technical — it was coordinating the database schema migration across two systems reading the same tables simultaneously. We used expand-contract migration: first expanding the schema to support both old and new formats, running both systems in parallel, then contracting once the old system was decommissioned. Not glamorous, but it's the only safe approach." },
      { type: "heading", content: "Key Lessons Learned" },
      { type: "list", items: ["WebSocket reliability > WebSocket performance. A stable 100ms connection beats a flaky 20ms one every time.", "Materialised views are underused in OLTP systems. Pre-computing expensive aggregations at the database level changed everything.", "Decouple your real-time layer early. Retrofitting WebSocket support into an existing REST API is 5x harder than designing for it upfront.", "Load test at 3x your expected peak, not 1x. Black Friday, IPO days, and market crashes all arrive without warning.", "Feature flags are migration infrastructure. We couldn't have done the progressive rollout without them."] },
      { type: "text", content: "Eight months into production, the platform has processed over $2M in daily transactions without a single critical incident. The team at FinanceFlow now ships features twice a week instead of once a month. That's the part we're most proud of." },
    ],
    relatedSlugs: ["scale-50k-concurrent-users", "zero-downtime-monolith-to-microservices"],
  },

  "scale-50k-concurrent-users": {
    slug: "scale-50k-concurrent-users",
    category: "AI/ML",
    title: "Building Production AI Framework Infrastructure: GPU Clusters to Model Serving at Scale",
    excerpt: "A deep technical breakdown of how we designed a full-stack AI framework infrastructure — Kubernetes GPU orchestration, distributed training with Ray, MLflow model registry, and sub-50ms inference serving — for a next-generation LLM platform handling millions of daily requests.",
    author: "Anya Volkov",
    authorRole: "AI Infrastructure Lead",
    authorBio: "Anya specialises in large-scale AI/ML infrastructure and distributed systems. She has designed GPU cluster orchestration and MLOps pipelines for 20+ AI-native companies. Previously a Senior SRE at Cloudflare and ML Platform Lead at Scale AI.",
    date: "Apr 24, 2026",
    readTime: "14 min read",
    tags: ["Kubernetes", "Ray", "MLflow", "Triton", "PyTorch", "Terraform", "Kubeflow"],
    image: "https://readdy.ai/api/search-image?query=futuristic%20artificial%20intelligence%20neural%20network%20infrastructure%20visualization%2C%20glowing%20GPU%20server%20clusters%20with%20green%20and%20amber%20energy%20flow%20lines%2C%20dark%20data%20center%20environment%20with%20abstract%20AI%20framework%20topology%20nodes%20and%20connection%20pathways%2C%20cinematic%20depth%20of%20field%2C%20ultra-realistic%20tech%20art%20photography&width=1200&height=630&seq=blog_detail_ai_infra_01&orientation=landscape",
    ogImage: "https://readdy.ai/api/search-image?query=futuristic%20AI%20neural%20network%20GPU%20infrastructure%2C%20glowing%20server%20clusters%20amber%20green%20energy%20lines%2C%20dark%20data%20center%20abstract%20topology%20nodes%2C%20cinematic%20lighting%20ultra-realistic%20tech%20art&width=1200&height=630&seq=blog_og_ai_infra_01&orientation=landscape",
    toc: [
      { id: "the-problem", title: "Why Generic Cloud Fails for AI Workloads" },
      { id: "gpu-orchestration", title: "GPU Cluster Orchestration with Kubernetes" },
      { id: "distributed-training", title: "Distributed Training at Scale with Ray" },
      { id: "mlflow-registry", title: "MLflow: Model Registry & Experiment Tracking" },
      { id: "inference-serving", title: "Sub-50ms Inference Serving with Triton" },
      { id: "feature-store", title: "The Feature Store That Changed Everything" },
      { id: "cost-optimization", title: "GPU Cost Optimization: Saving $2.3M/year" },
    ],
    body: [
      {
        type: "text",
        content: "When NeuralForge came to us in late 2025, they were running their production LLM platform on a patchwork of AWS SageMaker endpoints, hand-managed EC2 GPU instances, and a model versioning system that amounted to a shared S3 bucket with a naming convention nobody followed. They were spending $380k/month on GPU compute and still hitting 800ms inference latencies on a 7B parameter model. The infrastructure was not just expensive — it was actively blocking the product team from iterating. Here is how we rebuilt it from the ground up.",
      },
      {
        type: "heading",
        content: "Why Generic Cloud Fails for AI Workloads",
      },
      {
        type: "text",
        content: "AI workloads are categorically different from traditional web workloads in three ways that make generic cloud infrastructure the wrong tool. First, GPUs are stateful and expensive — a web pod you overprovision wastes $0.02/hr; a wasted A100 instance wastes $3.20/hr. Second, AI jobs are long-running and batch-oriented — a training run might last 16 hours with strict checkpoint requirements, not 200ms HTTP requests. Third, the data flywheel means model quality and infrastructure quality are directly coupled — a slow feature pipeline produces stale training data which produces degraded models which produces worse user outcomes.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "The Real Cost of AI Infrastructure Debt",
        content: "NeuralForge starting position: $380k/month GPU spend at 23% average utilisation. 800ms p95 inference latency on a 7B model. 4-day average model-to-production lead time. No reproducibility — running the same training job twice produced different results. Zero visibility into feature drift or data quality degradation.",
      },
      {
        type: "heading",
        content: "GPU Cluster Orchestration with Kubernetes",
      },
      {
        type: "text",
        content: "The foundation of the entire platform is a Kubernetes cluster with NVIDIA device plugin integration and GPU topology awareness. We run on GKE Autopilot for most workloads, with a self-managed node pool for A100 clusters where we need precise control over NVLink topology — the interconnect between GPUs on the same node is critical for large model training. A naive Kubernetes scheduler will happily place a multi-GPU training job across nodes with no NVLink, resulting in a 10x slowdown in inter-GPU communication.",
      },
      {
        type: "code",
        language: "yaml",
        content: `# GPU node affinity — force training pods to NVLink-capable nodes
apiVersion: v1
kind: Pod
metadata:
  name: llm-training-7b
  labels:
    app: distributed-training
spec:
  affinity:
    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
          - matchExpressions:
              - key: cloud.google.com/gke-accelerator
                operator: In
                values: ["nvidia-a100-80gb"]
              - key: nvidia.com/gpu.topology
                operator: In
                values: ["NVLink-4"]
  containers:
    - name: trainer
      image: nvcr.io/nvidia/pytorch:24.03-py3
      resources:
        limits:
          nvidia.com/gpu: "8"
          memory: "640Gi"
      env:
        - name: NCCL_TOPO_FILE
          value: /etc/nccl/topo.xml
        - name: NCCL_IB_DISABLE
          value: "0"`,
      },
      {
        type: "text",
        content: "We also implemented a GPU bin-packing policy using a custom scheduler extender. The default Kubernetes scheduler spreads pods across nodes to maximise fault isolation — exactly wrong for GPU workloads, where you want to pack as many pods as possible onto the fewest nodes to minimise cross-node communication overhead. The custom extender reduced average job completion time by 34% on the 7B model training workload without any model code changes.",
      },
      {
        type: "list",
        items: [
          "NVIDIA device plugin: exposes individual GPU cores as schedulable Kubernetes resources (nvidia.com/gpu)",
          "GPU topology manager: NUMA-aware placement ensures GPU-to-GPU traffic stays on NVLink, not PCIe",
          "Custom bin-packing extender: prioritises dense GPU utilisation over fault spread for training workloads",
          "MIG partitioning: A100 80GB instances split into 7 MIG slices for small inference models, maximising utilisation",
          "Volcano batch scheduler: gang scheduling ensures all pods in a distributed training job start simultaneously or not at all",
        ],
      },
      {
        type: "heading",
        content: "Distributed Training at Scale with Ray",
      },
      {
        type: "text",
        content: "Ray Train with RayTune is the orchestration layer for all training jobs. We evaluated Kubeflow Pipelines, Metaflow, and MLflow Projects before settling on Ray — the deciding factor was Ray's native Python-first API that does not require YAML pipeline definitions. Data scientists write Python; they should not be required to learn Kubernetes resource specs to run an experiment.",
      },
      {
        type: "code",
        language: "python",
        content: `# Ray Train — distributed PyTorch with automatic fault tolerance
import ray
from ray import train
from ray.train.torch import TorchTrainer
from ray.train import ScalingConfig, CheckpointConfig

def train_func(config):
    model = build_llm(config["model_size"])
    optimizer = torch.optim.AdamW(model.parameters(), lr=config["lr"])

    for epoch in range(config["epochs"]):
        for batch in get_dataloader():
            loss = model(batch)
            optimizer.zero_grad()
            loss.backward()
            optimizer.step()

        # Auto checkpoint — resumable after spot instance preemption
        train.report({"loss": loss.item(), "epoch": epoch})

trainer = TorchTrainer(
    train_loop_per_worker=train_func,
    train_loop_config={"model_size": "7B", "lr": 3e-4, "epochs": 3},
    scaling_config=ScalingConfig(
        num_workers=8,
        use_gpu=True,
        resources_per_worker={"GPU": 1, "CPU": 8, "memory": 80 * 1024**3}
    ),
    run_config=train.RunConfig(
        checkpoint_config=CheckpointConfig(
            checkpoint_frequency=100,
            num_to_keep=3
        )
    )
)

result = trainer.fit()`,
      },
      {
        type: "text",
        content: "The fault tolerance story is critical for spot/preemptible instances. Training a 7B model takes 14 hours on 8 A100s. On-demand A100 instances cost $3.20/hr each — $358 for a full run. Spot instances cost $0.96/hr — $107 for the same run, but with ~12% preemption probability. Ray's automatic checkpointing means a preemption restarts from the last checkpoint (every 100 steps, approximately every 3 minutes of training) rather than from scratch. Net result: we run all training on spot instances, saving $251 per training run, with zero data loss on preemption.",
      },
      {
        type: "heading",
        content: "MLflow: Model Registry & Experiment Tracking",
      },
      {
        type: "text",
        content: "MLflow is the source of truth for every model artifact, hyperparameter configuration, and evaluation metric at NeuralForge. Before MLflow, the model registry was literally a Slack channel called #model-releases. MLflow's Model Registry gives us staged progression (Staging to Production to Archived), A/B deployment support, and a complete audit trail of every production model promotion — critical for compliance in their healthcare vertical.",
      },
      {
        type: "list",
        items: [
          "Experiment tracking: every training run logs 140+ metrics including loss curves, FLOP count, peak GPU memory, and evaluation suite scores",
          "Model Registry: staged promotion workflow with mandatory approval gates — no model reaches Production without passing automated evaluation benchmarks",
          "Artifact storage: model checkpoints versioned in GCS with lifecycle policies — 30-day retention for Staging, permanent for Production",
          "MLflow Projects: reproducible training environments using conda environments pinned to exact package versions",
          "Model signatures: input/output schemas enforced at serving time — prevents silent schema drift between training and inference",
        ],
      },
      {
        type: "callout",
        variant: "tip",
        title: "MLflow Model Signatures Are Non-Negotiable",
        content: "We had a production incident where a tokenizer update changed the input tensor shape, and the serving endpoint silently accepted the wrong shape and returned garbage predictions for 6 hours before anyone noticed. MLflow model signatures, enforced at serve time, would have caught this immediately with a schema validation error. Add them to every model you log — no exceptions.",
      },
      {
        type: "heading",
        content: "Sub-50ms Inference Serving with Triton",
      },
      {
        type: "text",
        content: "NVIDIA Triton Inference Server is the inference layer for all production model endpoints. The key capabilities: dynamic batching (combining requests from multiple users into a single GPU batch without client-side coordination), model ensembles (chaining preprocessing to model to postprocessing as a single atomic inference request), and multi-framework support (we serve PyTorch, ONNX, and TensorRT models from the same fleet without separate serving infrastructure).",
      },
      {
        type: "code",
        language: "python",
        content: `# Triton model configuration — 7B LLM with dynamic batching
# model_repository/llm-7b/config.pbtxt

name: "llm-7b"
backend: "tensorrtllm"
max_batch_size: 32

dynamic_batching {
  preferred_batch_size: [1, 2, 4, 8, 16]
  max_queue_delay_microseconds: 5000
  priority_queue_policy {
    default_priority_level: MEDIUM
    priority_levels: 3
  }
}

instance_group [
  {
    count: 2
    kind: KIND_GPU
    gpus: [0, 1, 2, 3]
  }
]

parameters {
  key: "max_input_len"
  value { string_value: "4096" }
}
parameters {
  key: "max_output_len"
  value { string_value: "2048" }
}
parameters {
  key: "enable_kv_cache_reuse"
  value { string_value: "true" }
}`,
      },
      {
        type: "text",
        content: "The single biggest latency win was TensorRT quantisation. Converting the 7B model from FP16 to INT8 with TensorRT post-training quantisation reduced inference latency from 780ms to 48ms p95 — a 94% reduction — with only a 0.3-point degradation on our internal evaluation benchmark. The quantisation process requires a calibration dataset of ~500 representative inputs; we built a calibration pipeline that automatically samples from recent production traffic and re-quantises whenever a new model version is promoted to Production in MLflow.",
      },
      {
        type: "callout",
        variant: "success",
        title: "Inference Latency: 780ms → 48ms",
        content: "FP16 to INT8 TensorRT quantisation cut p95 inference latency by 94%. Dynamic batching increased GPU throughput by 8x at the same hardware cost. KV cache reuse across sequential requests in the same session reduced compute by 40% for multi-turn conversations. Total inference cost per 1M tokens dropped from $0.84 to $0.09.",
      },
      {
        type: "heading",
        content: "The Feature Store That Changed Everything",
      },
      {
        type: "text",
        content: "The feature store — built on Feast with Redis as the online store and BigQuery as the offline store — is the component that had the most transformative impact on model quality. Before the feature store, feature engineering was duplicated: the training pipeline computed features one way in a Jupyter notebook, and the serving layer recomputed them a different way in production code. This training-serving skew was causing systematic prediction errors that showed up as user complaints about inconsistent AI outputs.",
      },
      {
        type: "callout",
        variant: "success",
        title: "Training-Serving Skew: Eliminated",
        content: "After deploying the feature store: zero training-serving skew. Average user satisfaction score for AI outputs improved 23% — without changing the model at all. Feature computation latency for the 47-feature vector dropped from 340ms realtime computation to 4ms Redis lookup. This single architectural change was equivalent to 6 months of model fine-tuning work.",
      },
      {
        type: "heading",
        content: "GPU Cost Optimization: Saving $2.3M/year",
      },
      {
        type: "text",
        content: "Infrastructure cost reduction from $380k/month to $188k/month was achieved through four interventions: spot instances for training (saving $68k/month), INT8 quantisation enabling a 50% reduction in GPU count for inference serving (saving $54k/month), GPU bin-packing raising average utilisation from 23% to 71% (saving $41k/month), and autoscaling inference fleets down to zero during off-peak hours between 2 and 7 AM PST (saving $29k/month). The total annual saving is $2.3M.",
      },
      {
        type: "list",
        items: [
          "Spot/preemptible instances for all training: 70% cost reduction vs on-demand, zero training data loss via Ray checkpointing",
          "INT8 TensorRT quantisation: 94% latency reduction, 50% fewer GPUs needed for the same throughput SLA",
          "GPU bin-packing scheduler: utilisation lifted from 23% to 71%, equivalent to eliminating 2 full A100 nodes",
          "KEDA autoscaling to zero: Kubernetes scales serving pods to 0 replicas during low-traffic windows, GPUs released back to pool",
          "Spot interruption handling: custom preemption webhook gives Ray 30-second graceful shutdown window to flush checkpoints before node termination",
        ],
      },
      {
        type: "text",
        content: "Six months after deployment: NeuralForge p95 inference latency sits at 48ms on the 7B model. Model-to-production lead time dropped from 4 days to 6 hours. GPU utilisation averages 71%. Monthly GPU spend is $192k — down from $380k, with 3x more model capacity. Their ML team went from spending 60% of their time on infrastructure to 15%. That is the kind of leverage good AI framework infrastructure delivers.",
      },
    ],
    relatedSlugs: ["ai-content-engine-langchain-gpt4", "zero-downtime-monolith-to-microservices"],
  },

  "react-native-rebuild-cut-crashes-92": {
    slug: "react-native-rebuild-cut-crashes-92",
    category: "Mobile",
    title: "The React Native Rebuild That Cut App Crashes by 92%",
    excerpt: "When MediSynth came to us with a healthcare app crashing on 15% of sessions, we rebuilt it from scratch in 10 weeks. Here is every decision we made and why.",
    author: "Kai Nakamura",
    authorRole: "Mobile Engineering Lead",
    authorBio: "Kai has shipped 40+ mobile apps across iOS and Android over 9 years. He specialises in React Native and Flutter performance engineering and leads Solutions' mobile practice.",
    date: "Apr 11, 2026",
    readTime: "9 min read",
    tags: ["React Native", "TypeScript", "Firebase", "Sentry", "Zustand"],
    image: "https://readdy.ai/api/search-image?query=mobile%20app%20development%20on%20smartphone%20mockup%2C%20healthcare%20application%20dark%20theme%20interface%2C%20code%20editor%20on%20dual%20monitor%20setup%20in%20background%2C%20professional%20developer%20workspace%2C%20warm%20ambient%20lighting&width=1200&height=630&seq=blog_detail_03&orientation=landscape",
    ogImage: "https://readdy.ai/api/search-image?query=mobile%20app%20development%20on%20smartphone%20mockup%2C%20healthcare%20application%20dark%20theme%20interface%2C%20code%20editor%20on%20dual%20monitor%20setup%20in%20background%2C%20professional%20developer%20workspace%2C%20warm%20ambient%20lighting&width=1200&height=630&seq=blog_og_03&orientation=landscape",
    toc: [
      { id: "diagnosis", title: "Diagnosing 10,000 Crash Reports" },
      { id: "error-boundaries", title: "Error Boundaries: The Missing Foundation" },
      { id: "state-management", title: "State Management Overhaul" },
      { id: "memory-leaks", title: "Hunting Down Memory Leaks" },
      { id: "testing", title: "3,000 Test Cases in 3 Weeks" },
      { id: "rollout", title: "The Phased Store Rollout" },
    ],
    body: [
      { type: "text", content: "A 15% crash rate is not a bug — it's a fundamental architectural failure. For MediSynth, a healthcare app connecting patients to their care coordinators, each crash wasn't just a bad user experience; it was a patient potentially missing a critical medication reminder or appointment alert. We had 10 weeks to rebuild the entire app. Here's how we approached it." },
      { type: "heading", content: "Diagnosing 10,000 Crash Reports" },
      { type: "text", content: "The first thing we did was not write code. We spent three days in Firebase Crashlytics and Sentry analysing 10,000+ crash reports from the previous 90 days. Pattern recognition was the priority: which crash types were responsible for the most impact? The top 5 crash causes accounted for 87% of all crashes — a classic Pareto distribution. Fix those five, and you've solved the problem." },
      { type: "list", items: ["Null pointer exceptions from unhandled async state (34% of crashes)", "Unsubscribed Firebase listeners causing memory pressure and crashes on low-memory devices (22%)", "Navigation stack overflow from a missing guard on deep link handling (18%)", "Unhandled Promise rejections in the medication scheduling flow (8%)", "List rendering crash from undefined data passed to FlatList renderItem (5%)"] },
      { type: "heading", content: "Error Boundaries: The Missing Foundation" },
      { type: "text", content: "The original app had zero error boundaries anywhere in the component tree. In React Native, an unhandled error in any component anywhere in the tree will crash the entire app. This is catastrophic for a healthcare app where users might encounter an edge case in a rarely-used settings screen and have the whole application disappear." },
      { type: "code", language: "typescript", content: `// Comprehensive error boundary — wraps every screen
class ScreenErrorBoundary extends Component<Props, State> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Report to Sentry with full context
    Sentry.withScope(scope => {
      scope.setTag('boundary', this.props.screenName);
      scope.setContext('component_tree', info.componentStack);
      Sentry.captureException(error);
    });
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback onRetry={() => this.setState({ hasError: false })} />;
    }
    return this.props.children;
  }
}

// Usage — wrap every screen in the navigation stack
<ScreenErrorBoundary screenName="MedicationList">
  <MedicationListScreen />
</ScreenErrorBoundary>` },
      { type: "heading", content: "State Management Overhaul" },
      { type: "text", content: "The original app used a combination of local component state, Context API, and a poorly structured Redux setup that had grown organically without any clear ownership model. Async operations were scattered throughout components with no consistent error handling pattern. We replaced everything with Zustand — lightweight, TypeScript-friendly, and impossible to misuse the way Redux can be." },
      { type: "callout", variant: "tip", title: "Why Zustand Over Redux?", content: "For a 3-engineer mobile team maintaining a healthcare app, cognitive overhead matters. Zustand requires 80% less boilerplate than Redux Toolkit, has no Provider wrapping requirement, and its devtools integration is excellent. We estimated a 2-week productivity gain per quarter just from the reduced boilerplate." },
      { type: "heading", content: "Hunting Down Memory Leaks" },
      { type: "text", content: "The Firebase listener leak was the trickiest crash to diagnose because it was non-deterministic — it only manifested on devices with under 2GB of RAM after extended sessions (45+ minutes). The root cause: every time a user navigated to a screen that subscribed to Firestore, a new listener was attached. Navigation away from the screen never called the cleanup function. Over a 45-minute session, a user might accumulate 40+ orphaned listeners consuming memory until the OS killed the app." },
      { type: "code", language: "typescript", content: `// Before: listener leak
useEffect(() => {
  const unsubscribe = db.collection('medications')
    .where('userId', '==', userId)
    .onSnapshot(snapshot => setMedications(snapshot.docs));
  // Missing cleanup! unsubscribe never called
}, [userId]);

// After: properly cleaned up
useEffect(() => {
  const unsubscribe = db.collection('medications')
    .where('userId', '==', userId)
    .onSnapshot(snapshot => setMedications(snapshot.docs));
  
  return () => unsubscribe(); // cleanup on unmount
}, [userId]);` },
      { type: "heading", content: "3,000 Test Cases in 3 Weeks" },
      { type: "text", content: "We wrote 3,000+ test cases across unit tests (Jest), integration tests, and end-to-end tests (Detox). The critical medication scheduling and reminder flows got 100% branch coverage. Every async operation has an explicit error case test. Tests run on every pull request against a matrix of real devices via BrowserStack — iPhone 12 through 16, Samsung Galaxy S21 through S25, and five mid-range Android devices representative of the user base." },
      { type: "heading", content: "The Phased Store Rollout" },
      { type: "text", content: "We used Firebase Remote Config to control the rollout percentage and monitor crash rates at each threshold before proceeding. Starting at 5% gave us a large enough sample to detect regressions statistically, small enough to limit blast radius if something went wrong. At each threshold, we watched Sentry for 24 hours before advancing. The result: a crash rate reduction from 15% to 0.2% confirmed before 100% rollout. App Store rating jumped from 2.8 to 4.9 within 6 weeks of the new build going fully live." },
    ],
    relatedSlugs: ["zero-to-app-store-90-days", "ai-content-engine-langchain-gpt4"],
  },

  "ai-content-engine-langchain-gpt4": {
    slug: "ai-content-engine-langchain-gpt4",
    category: "AI/ML",
    title: "Building an AI Content Engine with LangChain and GPT-4",
    excerpt: "We built an AI platform that generates 10,000+ pieces of branded content per month across 14 languages. Here is the full architecture — RAG pipelines, fine-tuning, and prompt engineering strategies.",
    author: "Dr. Nadia Hassan",
    authorRole: "AI/ML Lead",
    authorBio: "Nadia holds a PhD in Computational Linguistics and leads all AI/ML initiatives at Solutions Studio. She has published research on large-scale language model fine-tuning and RAG architectures.",
    date: "Mar 28, 2026",
    readTime: "15 min read",
    tags: ["LangChain", "OpenAI", "Python", "FastAPI", "RAG"],
    image: "https://readdy.ai/api/search-image?query=artificial%20intelligence%20neural%20network%20visualization%2C%20glowing%20green%20nodes%20and%20connections%20on%20dark%20background%2C%20machine%20learning%20concept%20art%2C%20futuristic%20AI%20technology%20interface%2C%20cinematic%20lighting%2C%20abstract%20digital%20art&width=1200&height=630&seq=blog_detail_04&orientation=landscape",
    ogImage: "https://readdy.ai/api/search-image?query=artificial%20intelligence%20neural%20network%20visualization%2C%20glowing%20green%20nodes%20and%20connections%20on%20dark%20background%2C%20machine%20learning%20concept%20art%2C%20futuristic%20AI%20technology%20interface%2C%20cinematic%20lighting%2C%20abstract%20digital%20art&width=1200&height=630&seq=blog_og_04&orientation=landscape",
    toc: [
      { id: "why-vanilla-gpt-fails", title: "Why Vanilla GPT-4 Wasn't Enough" },
      { id: "brand-voice", title: "Extracting Brand Voice Programmatically" },
      { id: "rag-pipeline", title: "The RAG Pipeline Architecture" },
      { id: "fine-tuning", title: "Fine-Tuning vs. Prompting: What We Learned" },
      { id: "quality-scoring", title: "Automated Quality Scoring" },
      { id: "multilingual", title: "Solving the Multilingual Challenge" },
    ],
    body: [
      { type: "text", content: "AuraAI's challenge was not 'can AI write content' — that ship had sailed. Their challenge was 'can AI write content that sounds like us, at 10,000 pieces a month, across 14 languages, without a human editor reviewing every single output?' That last constraint — no human in the loop for routine content — is what made this genuinely hard." },
      { type: "heading", content: "Why Vanilla GPT-4 Wasn't Enough" },
      { type: "text", content: "Our first experiment: take GPT-4, write a detailed system prompt describing AuraAI's brand voice, and generate 100 sample blog posts. We then ran those through a blind review with AuraAI's content team, who scored each piece on 8 brand dimensions. The result: 61% average brand alignment score. Acceptable for a first pass requiring light editing, but completely inadequate for a no-human-review pipeline targeting 96% accuracy." },
      { type: "callout", variant: "info", title: "What Was Going Wrong?", content: "GPT-4 with a good system prompt gets you 60-70% brand alignment on average. The failure modes: incorrect register (too formal or too casual), wrong sentence rhythm, prohibited competitor mentions slipping through, and 14-language quality that degraded significantly below the top 5 languages." },
      { type: "heading", content: "Extracting Brand Voice Programmatically" },
      { type: "text", content: "Before we could fine-tune or build a RAG system, we needed to precisely characterise what 'brand voice' meant for AuraAI — not in fuzzy marketing language, but in measurable linguistic features. We processed 5,000 approved content pieces through a custom NLP pipeline built with spaCy and HuggingFace Transformers to extract: sentence length distribution, active vs. passive voice ratio, adjective density, named entity frequency, and vocabulary uniqueness score." },
      { type: "heading", content: "The RAG Pipeline Architecture" },
      { type: "text", content: "Retrieval-Augmented Generation solved our brand context problem. Instead of cramming brand guidelines into a system prompt (which gets diluted over long conversations), we built a Pinecone vector store containing 50,000+ chunks of brand-approved content, product facts, tone-of-voice guidelines, and competitor exclusion lists. Each generation request retrieves the 12 most semantically relevant context chunks before calling GPT-4." },
      { type: "code", language: "python", content: `# LangChain RAG pipeline
from langchain.vectorstores import Pinecone
from langchain.embeddings import OpenAIEmbeddings
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate

embeddings = OpenAIEmbeddings(model="text-embedding-3-large")
vectorstore = Pinecone.from_existing_index("aurai-brand", embeddings)

CONTENT_PROMPT = PromptTemplate(
    input_variables=["context", "content_type", "topic", "language"],
    template="""You are AuraAI's content engine. Use ONLY the brand context 
below to inform tone, style, and vocabulary choices.

Brand Context:
{context}

Generate a {content_type} about {topic} in {language}.
Follow AuraAI's established sentence rhythm and active voice preference.
Never mention competitor brands."""
)

chain = RetrievalQA.from_chain_type(
    llm=ChatOpenAI(model="gpt-4-turbo", temperature=0.7),
    retriever=vectorstore.as_retriever(search_kwargs={"k": 12}),
    chain_type_kwargs={"prompt": CONTENT_PROMPT}
)` },
      { type: "heading", content: "Fine-Tuning vs. Prompting: What We Learned" },
      { type: "text", content: "We fine-tuned separate GPT-4 models for 6 content categories: blog posts, social media copy, product descriptions, email campaigns, ad copy, and long-form articles. Fine-tuning gave us an additional 18% brand alignment improvement on top of RAG — but only for content categories with 500+ training examples. Below that threshold, RAG alone outperformed fine-tuning." },
      { type: "callout", variant: "success", title: "Fine-Tuning Sweet Spot", content: "Fine-tuning pays off at 500+ high-quality training examples. Below that, invest your effort in better RAG retrieval and prompt engineering instead. We wasted two weeks fine-tuning on a 200-example dataset before realising the improvement wasn't statistically significant." },
      { type: "heading", content: "Automated Quality Scoring" },
      { type: "text", content: "The quality scoring system is what makes no-human-review possible. We trained a classifier on 15,000 labelled content pieces (rated by AuraAI's content team) to predict brand alignment across 8 dimensions. Any generated piece scoring below 0.8 on any dimension is automatically regenerated with an adjusted temperature parameter and a different context chunk selection. 96.3% of pieces pass on the first generation; 3.5% require one regeneration; 0.2% require human review." },
      { type: "heading", content: "Solving the Multilingual Challenge" },
      { type: "text", content: "Generating high-quality content across 14 languages requires more than just asking GPT-4 to translate or write in another language. We built a language-specific validation layer that checks: native speaker idiom usage (via a curated idiom database), cultural reference appropriateness, brand term consistency across languages, and SEO keyword density per locale. The biggest surprise: GPT-4's Portuguese-BR output was consistently better than its Spanish-MX output, requiring separate fine-tuning datasets for each Latin American market." },
    ],
    relatedSlugs: ["trading-platform-2m-daily", "zero-downtime-monolith-to-microservices"],
  },

  "zero-downtime-monolith-to-microservices": {
    slug: "zero-downtime-monolith-to-microservices",
    category: "DevOps",
    title: "Zero-Downtime Migration: Monolith to Microservices in Production",
    excerpt: "We migrated a 6-year-old Rails monolith to a containerized microservices architecture without a single second of downtime. The strangler fig pattern, service mesh setup, and lessons learned.",
    author: "Anya Volkov",
    authorRole: "Cloud Infrastructure Lead",
    authorBio: "Anya specialises in large-scale cloud infrastructure and distributed systems. She has helped 30+ companies scale from startup to enterprise on AWS and GCP. Previously a Senior SRE at Cloudflare.",
    date: "Mar 15, 2026",
    readTime: "11 min read",
    tags: ["Docker", "Kubernetes", "GitHub Actions", "Datadog", "Istio"],
    image: "https://readdy.ai/api/search-image?query=containerization%20microservices%20architecture%20diagram%20visualization%2C%20dark%20background%20with%20interconnected%20service%20nodes%20and%20network%20topology%2C%20DevOps%20infrastructure%20concept%2C%20professional%20tech%20illustration%20with%20green%20circuit%20lines&width=1200&height=630&seq=blog_detail_05&orientation=landscape",
    ogImage: "https://readdy.ai/api/search-image?query=containerization%20microservices%20architecture%20diagram%20visualization%2C%20dark%20background%20with%20interconnected%20service%20nodes%20and%20network%20topology%2C%20DevOps%20infrastructure%20concept%2C%20professional%20tech%20illustration%20with%20green%20circuit%20lines&width=1200&height=630&seq=blog_og_05&orientation=landscape",
    toc: [
      { id: "why-strangler-fig", title: "Why We Chose the Strangler Fig Pattern" },
      { id: "domain-mapping", title: "Domain Mapping: 8 Weeks of Archaeology" },
      { id: "first-extraction", title: "The First Service Extraction" },
      { id: "service-mesh", title: "Istio Service Mesh Setup" },
      { id: "database-strategy", title: "Database Decomposition Strategy" },
      { id: "results", title: "After 8 Months: What Changed" },
    ],
    body: [
      { type: "text", content: "Nobody chooses to migrate a 6-year-old Rails monolith to microservices for fun. LogiChain came to us because their deployment pipeline had become a liability: every change — no matter how small — required a full 2-hour deployment that touched all 180,000 lines of code. Their engineering team of 12 had essentially stopped shipping features because the risk was too high." },
      { type: "heading", content: "Why We Chose the Strangler Fig Pattern" },
      { type: "text", content: "The strangler fig pattern gets its name from a vine that gradually grows around a tree until the tree dies and the vine is all that remains. Applied to software migration: you build new services alongside the old monolith, gradually intercepting routes from the monolith until nothing remains of it. The alternative — a 'big bang' rewrite — has a failure rate exceeding 70%. For a live production system processing IoT events, it was never an option." },
      { type: "callout", variant: "warning", title: "The Big Bang Rewrite Fallacy", content: "Rewriting a production system from scratch has a 70%+ failure rate. The monolith carries 6 years of edge case handling and business logic that isn't documented anywhere — it only exists in the code. A complete rewrite inevitably misses critical behaviours. The strangler fig pattern preserves them by default." },
      { type: "heading", content: "Domain Mapping: 8 Weeks of Archaeology" },
      { type: "text", content: "Before extracting a single service, we mapped the entire monolith into bounded contexts. This meant reading 180,000 lines of Ruby, running static analysis tools, and conducting interviews with every engineer who had touched the codebase. We identified 18 bounded contexts — roughly equivalent to future microservices — and ranked them by extraction complexity based on two factors: database coupling (circular FK relationships = high complexity) and inter-module call frequency." },
      { type: "list", items: ["Notifications: Low coupling, high independence → Extract first", "User authentication: Medium coupling, high reuse → Extract second", "Order management: High coupling, critical path → Extract last", "Payments: Highest risk, most external dependencies → Keep monolith until everything else is extracted"] },
      { type: "heading", content: "The First Service Extraction" },
      { type: "text", content: "We chose the notification service as our first extraction because it had zero circular dependencies, was read-heavy with a well-defined write path, and any failure would send a late notification — annoying, but not catastrophic. This is intentional: your first extraction should be the service where a mistake causes the least harm. You will make mistakes on your first extraction." },
      { type: "code", language: "yaml", content: `# Istio VirtualService — traffic splitting during migration
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: notifications-vs
spec:
  hosts:
    - notifications.logichain.internal
  http:
    - match:
        - headers:
            x-migration-group:
              exact: "canary"
      route:
        - destination:
            host: notifications-service-new
            port:
              number: 8080
    - route:
        - destination:
            host: monolith
            port:
              number: 3000
          weight: 90
        - destination:
            host: notifications-service-new
            port:
              number: 8080
          weight: 10` },
      { type: "heading", content: "Istio Service Mesh Setup" },
      { type: "text", content: "Istio provided three capabilities that were non-negotiable for this migration: traffic splitting (to progressively shift load from monolith to new services), circuit breaking (to automatically fall back to the monolith if a new service became unhealthy), and distributed tracing (to observe request flows across the hybrid monolith/microservices state). Without distributed tracing, debugging issues during the migration would have been essentially impossible." },
      { type: "heading", content: "Database Decomposition Strategy" },
      { type: "text", content: "Database decomposition is the hardest part of any microservices migration. LogiChain's schema had 6 tables with circular foreign key relationships — effectively preventing clean service extraction. We used the 'shared database' anti-pattern as a transitional step: new services initially read from the same database as the monolith, using database views to provide a stable interface. Service-specific databases were introduced only after the service was fully stable in production, using event-sourcing to synchronise state." },
      { type: "heading", content: "After 8 Months: What Changed" },
      { type: "text", content: "The monolith is gone. 18 independent services, each deploying in under 4 minutes. The engineering team ships to production 12 times per day on average, compared to twice per week before the migration. On-call incidents dropped by 78% because failures are now isolated to individual services rather than taking down the entire system. The migration took 8 months — on schedule, zero downtime, zero production incidents directly caused by the migration process." },
    ],
    relatedSlugs: ["scale-50k-concurrent-users", "trading-platform-2m-daily"],
  },

  "zero-to-app-store-90-days": {
    slug: "zero-to-app-store-90-days",
    category: "Mobile",
    title: "From 0 to App Store in 90 Days: Our Mobile Playbook",
    excerpt: "How we help early-stage startups ship their first mobile app in 90 days without cutting corners on quality. Sprint structure, tooling choices, and the decisions that actually matter.",
    author: "Kai Nakamura",
    authorRole: "Mobile Engineering Lead",
    authorBio: "Kai has shipped 40+ mobile apps across iOS and Android over 9 years. He specialises in React Native and Flutter performance engineering and leads Solutions' mobile practice.",
    date: "Feb 28, 2026",
    readTime: "8 min read",
    tags: ["Flutter", "Firebase", "CI/CD", "TestFlight", "App Store"],
    image: "https://readdy.ai/api/search-image?query=mobile%20app%20launch%20on%20smartphone%20screens%2C%20iOS%20and%20Android%20mockups%20on%20dark%20background%2C%20startup%20product%20development%20workspace%2C%20professional%20product%20photography%20with%20ambient%20glow%2C%20modern%20mobile%20UI%20showcase&width=1200&height=630&seq=blog_detail_06&orientation=landscape",
    ogImage: "https://readdy.ai/api/search-image?query=mobile%20app%20launch%20on%20smartphone%20screens%2C%20iOS%20and%20Android%20mockups%20on%20dark%20background%2C%20startup%20product%20development%20workspace%2C%20professional%20product%20photography%20with%20ambient%20glow%2C%20modern%20mobile%20UI%20showcase&width=1200&height=630&seq=blog_og_06&orientation=landscape",
    toc: [
      { id: "why-flutter", title: "Why We Default to Flutter for MVPs" },
      { id: "week-1", title: "Week 1: The Design Sprint That Sets Everything" },
      { id: "firebase-architecture", title: "Firebase Architecture for Startups" },
      { id: "ci-cd", title: "CI/CD From Day One" },
      { id: "app-store-prep", title: "App Store Prep: The 3-Week Early Start" },
      { id: "playbook", title: "The 90-Day Playbook Template" },
    ],
    body: [
      { type: "text", content: "90 days is tight for a mobile app. Not impossible — we've done it 14 times — but there's zero margin for architectural mistakes, tooling indecision, or scope creep. This post is the playbook we follow every time a startup comes to us needing their first mobile app shipped to both stores before an investor milestone." },
      { type: "heading", content: "Why We Default to Flutter for MVPs" },
      { type: "text", content: "For seed-stage startups, the technology choice isn't about performance benchmarks or ecosystem maturity — it's about maintaining a single codebase that a small post-launch team can own without specialised iOS and Android knowledge. Flutter gives you a single Dart codebase, native performance via direct compilation (no JavaScript bridge), and the best hot-reload development experience of any cross-platform framework." },
      { type: "callout", variant: "tip", title: "When Flutter Isn't the Answer", content: "Flutter is wrong when: the app requires deep native OS integrations (ARKit, Core NFC, HealthKit biometric data), the existing team has strong React Native expertise, or the company plans to hire iOS/Android specialists within 6 months. In those cases, React Native or even native development may be the better long-term choice." },
      { type: "heading", content: "Week 1: The Design Sprint That Sets Everything" },
      { type: "text", content: "The single biggest mistake early-stage startups make is starting to code before locking the feature set. We run a mandatory 1-week design sprint before any development begins: three rounds of Figma prototyping with founders, a prioritised feature matrix scored on user value vs. implementation complexity, and a locked MVP feature list that neither side can expand without a formal change order. This sounds bureaucratic until you've watched a 90-day project turn into 150 days because of constant scope expansion." },
      { type: "list", items: ["Day 1: Jobs-to-be-done workshop with all founders", "Day 2: Figma wireframes for all core user flows", "Day 3: High-fidelity Figma prototypes for 3 key screens", "Day 4: User testing on Maze with 8 target users", "Day 5: Locked feature list + technical architecture document"] },
      { type: "heading", content: "Firebase Architecture for Startups" },
      { type: "text", content: "Firebase is the right backend for a 90-day MVP build because it eliminates the need to build and maintain a custom backend. Auth, Firestore, Storage, Analytics, Crashlytics — all production-ready on day one. The one design decision that determines whether Firebase scales past MVP: Firestore data modelling. Poorly structured Firestore schemas become expensive and inflexible at scale. We spend a full day on data model design, anticipating the queries the app will need to run." },
      { type: "code", language: "dart", content: `// Firestore data model — EduBridge example
// Collections designed for the queries we know we need

// /users/{userId}
// /users/{userId}/enrollments/{courseId}
// /courses/{courseId}
// /courses/{courseId}/lessons/{lessonId}
// /courses/{courseId}/lessons/{lessonId}/completions/{userId}

// Efficient query: fetch all courses a user is enrolled in
Future<List<Course>> getUserCourses(String userId) async {
  final enrollments = await FirebaseFirestore.instance
    .collection('users')
    .doc(userId)
    .collection('enrollments')
    .get();
    
  final courseIds = enrollments.docs.map((d) => d.id).toList();
  
  // Batch fetch courses (Firestore 'in' query, max 30 items)
  final courses = await FirebaseFirestore.instance
    .collection('courses')
    .where(FieldPath.documentId, whereIn: courseIds)
    .get();
    
  return courses.docs.map(Course.fromDoc).toList();
}` },
      { type: "heading", content: "CI/CD From Day One" },
      { type: "text", content: "Setting up CI/CD on day one sounds like premature optimisation for a 90-day project. It's the opposite: Fastlane + GitHub Actions takes one engineer one day to set up, and saves 20+ hours over the project timeline. More importantly, having automated test builds pushed to TestFlight and Firebase App Distribution daily means founders get daily builds to test without needing to ask developers. This alone eliminates an entire class of communication overhead." },
      { type: "heading", content: "App Store Prep: The 3-Week Early Start" },
      { type: "text", content: "App Store review for healthcare-adjacent apps typically takes 7–14 days, compared to 1–3 days for standard apps. Submitting on day 87 of a 90-day project is not a valid plan. We start App Store prep 3 weeks before the expected submission date: privacy policy drafted and hosted, age rating assessment completed, screenshots and metadata prepared, and — critically for healthcare apps — a pre-review inquiry submitted to Apple detailing the app's medical content scope. For EduBridge, this pre-review conversation eliminated 2 of the 3 most common healthcare rejection reasons before submission." },
      { type: "heading", content: "The 90-Day Playbook Template" },
      { type: "list", items: ["Week 1: Design sprint + architecture locked", "Weeks 2-3: Foundation (auth, navigation, core data models, CI/CD setup)", "Weeks 4-7: Feature development (core user flows, all MVP screens)", "Week 8: Integration + internal QA sprint", "Week 9: App store prep + beta testing (TestFlight/Play Console)", "Week 10: Submission + launch instrumentation (analytics, crash reporting, referral tracking)"] },
      { type: "text", content: "EduBridge launched on day 87. 12,000 users in month one. A $250k seed round closed 6 weeks post-launch, with the app traction as a key proof point. That's what 90 days can look like when the playbook is followed with discipline." },
    ],
    relatedSlugs: ["react-native-rebuild-cut-crashes-92", "ai-content-engine-langchain-gpt4"],
  },

  "fitness-app-ai-coaching-11-weeks": {
    slug: "fitness-app-ai-coaching-11-weeks",
    category: "Mobile",
    title: "11 Weeks to App Store: Building an AI Fitness Coach with React Native",
    excerpt: "How we designed, built, and shipped a real-time AI fitness coaching app with wearable device sync, on-device ML workout generation, and a zero-crash launch — straight into the top 50 Health charts.",
    author: "Kai Nakamura",
    authorRole: "Mobile Engineering Lead",
    authorBio: "Kai has shipped 40+ mobile apps across iOS and Android over 9 years. He specialises in React Native and Flutter performance engineering, wearable integrations, and on-device ML inference.",
    date: "Jun 2, 2026",
    readTime: "11 min read",
    tags: ["React Native", "TensorFlow Lite", "HealthKit", "Firebase RTDB", "Reanimated 3", "Skia"],
    image: "https://readdy.ai/api/search-image?query=AI-powered%20fitness%20coaching%20mobile%20application%20on%20smartphone%2C%20real-time%20biometric%20waveform%20neural%20network%20visualization%2C%20dark%20ambient%20environment%20with%20emerald%20green%20health%20data%20overlay%2C%20wearable%20device%20integration%20concept%2C%20high-end%20tech%20product%20photography%2C%20premium%20cinematic%20lighting%20on%20black%20background&width=1200&height=630&seq=blog_detail_10&orientation=landscape",
    ogImage: "https://readdy.ai/api/search-image?query=AI%20fitness%20coaching%20app%20on%20smartphone%20dark%20premium%20UI%20emerald%20green%20biometric%20dashboard%20wearable%20sync%20cinematic%20lighting%20tech%20photography&width=1200&height=630&seq=blog_og_10&orientation=landscape",
    toc: [
      { id: "the-brief",         title: "The Brief: AI Coaching That Feels Real" },
      { id: "wearable",          title: "Wearable Integration: BLE + HealthKit + Google Fit" },
      { id: "on-device-ml",      title: "On-Device ML: TFLite Workout Classification" },
      { id: "firebase-rtdb",     title: "Real-Time Sync with Firebase RTDB" },
      { id: "animations",        title: "60fps Animations with Reanimated 3 + Skia" },
      { id: "zero-crash",        title: "Zero-Crash Launch Strategy" },
      { id: "results",           title: "From 2.4 to 4.8 Stars in 6 Weeks" },
    ],
    body: [
      { type: "text", content: "FitFlow came to us with a simple goal: build an AI fitness coach that feels like a personal trainer, not a step counter. The difference is enormous. Tracking is passive — record what happened. Coaching is active — intervene in real time, correct your form, adapt your programme based on fatigue, sleep, and heart rate variability. FitFlow needed all of that to ship in 11 weeks, work offline, sync with Apple Watch, Garmin, and Android Wear, and land in both stores before their Series A close. Here is exactly how we did it." },
      { type: "heading", content: "The Brief: AI Coaching That Feels Real" },
      { type: "text", content: "Most fitness apps fail at coaching because they treat the phone as a passive logger. FitFlow's competitive advantage was a machine learning model trained on 140,000 anonymised user fitness profiles that generates personalised workout programmes adapting in real-time to the user's current state. The model input vector includes: resting heart rate, HRV from the last 7 nights, cumulative weekly volume by muscle group, self-reported fatigue (1-5 scale), and Apple Watch activity rings completion rate. Output: a modified programme for the current session, with exercise substitutions and rep/set adjustments generated fresh each workout." },
      { type: "list", items: [
        "Real-time exercise form feedback using the front camera + MoveNet pose estimation (running on-device at 30fps)",
        "Personalised workout generation from a 7-input ML model updated nightly via Firebase ML",
        "Live biometric overlay: HR, HRV, calories, pace — all from wearable BLE stream with under 80ms latency",
        "Offline-first: all workout data cached locally, synced when connectivity restored",
        "Shared 3D workout visualisations built with Skia: animated muscle group activation maps",
      ]},
      { type: "heading", content: "Wearable Integration: BLE + HealthKit + Google Fit" },
      { type: "text", content: "Wearable integration is the most underestimated complexity on any fitness app project. Apple Watch and Garmin communicate over Bluetooth Low Energy with entirely different GATT profiles, different HR measurement intervals, and different timestamp formats. We built a unified BiometricStream abstraction that normalises data from all sources into a single React Native event emitter, so the UI layer never cares whether the heart rate came from an Apple Watch, a Garmin Forerunner, or a Polar chest strap." },
      { type: "code", language: "typescript", content: `// Unified biometric stream — normalises Apple Watch, Garmin, Polar
import { NativeEventEmitter, NativeModules } from 'react-native';

const { BiometricBridge } = NativeModules;
const emitter = new NativeEventEmitter(BiometricBridge);

export interface BiometricSample {
  source: 'apple_watch' | 'garmin' | 'polar' | 'healthkit';
  type: 'heart_rate' | 'hrv' | 'cadence' | 'power';
  value: number;
  unit: string;
  timestamp: number; // Unix ms, normalised from all source formats
}

export function subscribeBiometrics(
  onSample: (sample: BiometricSample) => void
) {
  const sub = emitter.addListener('BiometricSample', onSample);
  BiometricBridge.startScan(); // starts BLE + HealthKit stream
  return () => { sub.remove(); BiometricBridge.stopScan(); };
}` },
      { type: "callout", variant: "tip", title: "HealthKit vs BLE: Use Both", content: "HealthKit gives you historical data and background delivery. BLE gives you sub-second real-time samples during a workout. The right pattern is: use HealthKit for daily summaries and HRV history, use direct BLE connection for live workout metrics. Trying to use HealthKit for real-time HR during a workout introduces 10-15 second delays from Apple's averaging logic." },
      { type: "heading", content: "On-Device ML: TFLite Workout Classification" },
      { type: "text", content: "The workout classifier runs entirely on-device using TensorFlow Lite. We could not use a server-side model: gyms have patchy cellular coverage, and a 300ms round-trip to a cloud API produces feedback that feels laggy when you're mid-set. The TFLite model runs MoveNet for pose estimation (17 keypoints at 30fps), feeds the keypoint time-series into a 1D CNN that classifies the exercise and counts reps, and simultaneously outputs a form score (0-100) with specific feedback strings ('Left knee tracking inward — push knee out')." },
      { type: "code", language: "typescript", content: `// TFLite inference hook — runs at 30fps on the camera feed
import { useTensorflowModel } from 'react-native-fast-tflite';
import { useFrameProcessor } from 'react-native-vision-camera';

export function useWorkoutClassifier() {
  const model = useTensorflowModel(
    require('./assets/models/workout_classifier_v3.tflite')
  );

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';
    if (!model.state.isLoaded) return;

    const result = model.runSync([frame]);
    // result[0]: exercise class probabilities (20 classes)
    // result[1]: rep count delta
    // result[2]: form score (0-1)
    // result[3]: form feedback index

    const classIdx = result[0].indexOf(Math.max(...result[0]));
    const formScore = Math.round(result[2][0] * 100);

    runOnJS(onInferenceResult)({
      exercise: EXERCISE_LABELS[classIdx],
      repDelta: result[1][0] > 0.5 ? 1 : 0,
      formScore,
    });
  }, [model]);

  return frameProcessor;
}` },
      { type: "callout", variant: "success", title: "Inference Latency: 33ms on iPhone 12+", content: "Running MoveNet + custom 1D CNN at 30fps: 33ms average inference on iPhone 12, 22ms on iPhone 15 Pro (Neural Engine). Android P50 device: 48ms. This was fast enough for real-time rep counting and form feedback that genuinely feels instantaneous." },
      { type: "heading", content: "Real-Time Sync with Firebase RTDB" },
      { type: "text", content: "Firebase Realtime Database (not Firestore) was the right choice for live workout data. During an active session, the app writes biometric samples at 1Hz and receives coaching cues pushed from a Cloud Function that monitors workout progress. RTDB's low-latency WebSocket connection versus Firestore's optimistic batching made a measurable UX difference: coaching cues appeared within 200ms of a form issue versus 800ms with Firestore. We only use Firestore for long-term workout history and user profile data where latency is not critical." },
      { type: "heading", content: "60fps Animations with Reanimated 3 + Skia" },
      { type: "text", content: "The muscle activation map — a 3D body model showing which muscles are working during each exercise — is built with React Native Skia and driven by Reanimated 3 shared values. The map updates at 60fps in response to the pose estimation output, with animated opacity and colour gradients per muscle group showing activation intensity. Running Skia drawing on the UI thread and using shared values to pass data from the worklet avoids the bridge entirely, achieving consistently smooth 60fps even on mid-range Android devices." },
      { type: "callout", variant: "tip", title: "Reanimated 3 + Skia: The Right Stack for 60fps", content: "If you need complex custom animations that must run at 60fps on Android mid-range, this is the only viable path right now. React Native's Animated API on the JS thread will drop frames the moment the JS thread is busy. Reanimated 3 worklets run on a dedicated UI thread — no JS bridge, no frame drops." },
      { type: "heading", content: "Zero-Crash Launch Strategy" },
      { type: "text", content: "FitFlow launched with a 0.04% crash rate — better than any app we had shipped previously. The key changes: comprehensive error boundaries on every screen (we had 14 from day one), Zustand for state management replacing an inconsistent mix of useReducer and Context, structured async error handling with a global unhandledRejection logger, and a Detox E2E test suite covering all 22 critical user flows run against a matrix of 14 real devices on BrowserStack before every release candidate." },
      { type: "heading", content: "From 2.4 to 4.8 Stars in 6 Weeks" },
      { type: "text", content: "The initial TestFlight build had a 2.4-star equivalent rating from beta testers. The issues were not bugs — the app was stable. They were UX friction points: the wearable pairing flow was 11 steps (down to 3 after a redesign), the workout summary screen showed raw numbers without context (added 'Better than 87% of your sessions this month'), and the AI coaching cues were arriving too late in the rep (fixed by moving inference 8 frames earlier in the motion cycle). Six weeks post-launch in the App Store: 4.8 stars, 12,400 active users, top 42 in Health & Fitness in the US. The Series A closed at $4M." },
    ],
    relatedSlugs: ["react-native-rebuild-cut-crashes-92", "zero-to-app-store-90-days"],
  },
};

export const getBlogPost = (slug: string): BlogPost | null => posts[slug] ?? null;
export const getAllBlogPosts = (): BlogPost[] => Object.values(posts);
export const getRelatedPosts = (slugs: string[]): BlogPost[] =>
  slugs.map(s => posts[s]).filter(Boolean) as BlogPost[];