export interface CaseStudyMetric {
  label: string;
  value: string;
  subvalue?: string;
  icon: string;
}

export interface TimelineStep {
  week: string;
  title: string;
  description: string;
  tags: string[];
}

export interface TechGroup {
  category: string;
  icon: string;
  items: string[];
}

export interface WorkCaseStudy {
  slug: string;
  title: string;
  tagline: string;
  client: string;
  category: string;
  year: string;
  duration: string;
  team: string;
  heroImage: string;
  heroVideo?: string;
  accentColor: string;
  overview: string;
  challenge: string;
  challengePoints: string[];
  solution: string;
  solutionPoints: string[];
  metrics: CaseStudyMetric[];
  timeline: TimelineStep[];
  techStack: TechGroup[];
  gallery: string[];
  quote: { text: string; name: string; role: string; company: string; avatar?: string };
  tags: string[];
  result: string;
  nextSlug: string;
  nextTitle: string;
  nextImage: string;
}

const workCaseStudies: Record<string, WorkCaseStudy> = {
  "nexashop-platform": {
    slug: "nexashop-platform",
    title: "NexaShop Platform",
    tagline: "An e-commerce engine that turned $200k/day into $2M+ — without rebuilding from scratch.",
    client: "NexaShop Inc.",
    category: "Web",
    year: "2025",
    duration: "14 weeks",
    team: "7 engineers, 2 designers",
    accentColor: "#b9ff4b",
    heroImage: "https://readdy.ai/api/search-image?query=dark%20cinematic%20e-commerce%20platform%20dashboard%20on%20widescreen%20curved%20monitor%2C%20product%20grid%20with%20green%20accent%20UI%20elements%2C%20real-time%20order%20notifications%2C%20professional%20studio%20photography%2C%20dark%20theme%20interface%20with%20lime%20green%20highlights%20and%20subtle%20glow%20effects%2C%20high%20contrast%20product%20showcase&width=1400&height=700&seq=wcs_nexashop_hero&orientation=landscape",
    overview: "NexaShop was processing $200k per day on a brittle Magento 1 setup held together with duct tape and prayer. Flash sales would send the server into meltdown within minutes, support tickets would flood in, and the engineering team had developed a deep institutional fear of deploy Fridays. We rebuilt their entire commerce engine — platform, APIs, and infrastructure — and now they're processing over $2M daily without breaking a sweat.",
    challenge: "NexaShop's Magento 1 platform was architecturally incapable of handling the order volumes their marketing team was generating. The database ran on a single MySQL instance with no read replicas, the session layer was entirely cookie-based, and the product catalogue had grown to 85,000 SKUs with no indexing strategy whatsoever.",
    challengePoints: [
      "Single MySQL instance hitting 100% CPU within 90 seconds of any flash sale or marketing push",
      "No CDN — all static assets served directly from the origin server, amplifying load during peak traffic",
      "Cart abandonment at 34% due to checkout page loading over 8 seconds on mobile",
      "Zero automated testing — every deployment required 4 hours of manual QA by 3 engineers",
      "Payment processing vendor locked into a deprecated Magento 1 extension with no PCI compliance path",
    ],
    solution: "We adopted a headless commerce architecture with a React storefront, a custom Node.js API layer, and a Postgres + Redis data stack designed for horizontal scale. The checkout flow was rebuilt as a standalone service running on serverless infrastructure, making it immune to platform-wide load spikes.",
    solutionPoints: [
      "Headless React storefront with edge-cached static generation — page loads dropped from 8s to under 0.9s",
      "Custom Node.js GraphQL API with DataLoader batching eliminated N+1 queries across all product endpoints",
      "Redis-backed cart service with optimistic locking — supports 50,000 concurrent carts without collision",
      "Stripe Elements integration for PCI-compliant checkout with 3DS2 support out of the box",
      "GitHub Actions CI/CD pipeline with Playwright E2E tests — deployment time from 4 hours to 12 minutes",
    ],
    metrics: [
      { label: "Daily Transaction Volume", value: "$2M+", subvalue: "up from $200k", icon: "ri-money-dollar-circle-line" },
      { label: "Mobile Checkout Speed", value: "0.9s", subvalue: "was 8+ seconds", icon: "ri-speed-up-line" },
      { label: "Peak Concurrent Users", value: "25,000", subvalue: "tested and verified", icon: "ri-group-line" },
      { label: "Cart Abandonment Rate", value: "−62%", subvalue: "now at 13%", icon: "ri-shopping-cart-line" },
      { label: "Platform Uptime", value: "99.99%", subvalue: "last 6 months", icon: "ri-shield-check-line" },
      { label: "Deploy Frequency", value: "8×/day", subvalue: "was 1×/week", icon: "ri-rocket-line" },
    ],
    timeline: [
      { week: "Week 1–2", title: "Architecture Design & Data Migration Plan", description: "Mapped the entire existing data model, designed the new schema, and built automated migration scripts for 85,000 SKUs and 3 years of order history.", tags: ["Architecture", "Data Migration", "Planning"] },
      { week: "Week 3–6", title: "API Layer & Storefront Core", description: "Built the GraphQL API with full product catalogue, cart, and user auth endpoints. Built the core storefront pages with React and implemented static generation for all product pages.", tags: ["Node.js", "GraphQL", "React", "Next.js"] },
      { week: "Week 7–10", title: "Checkout Engine & Payment Integration", description: "Rebuilt checkout as a standalone microservice. Integrated Stripe Elements, implemented 3DS2 authentication, and added Apple Pay + Google Pay support.", tags: ["Stripe", "Serverless", "PCI Compliance"] },
      { week: "Week 11–12", title: "Performance Engineering & CDN Setup", description: "Implemented edge caching for all static assets via CloudFront, tuned Redis connection pooling, and ran load tests simulating 25,000 concurrent users.", tags: ["CloudFront", "Redis", "Load Testing"] },
      { week: "Week 13–14", title: "Migration, Testing & Launch", description: "Zero-downtime migration using DNS switching. Full Playwright E2E test suite passed. Launched with monitoring dashboards live in Datadog.", tags: ["Deployment", "E2E Testing", "Monitoring"] },
    ],
    techStack: [
      { category: "Frontend", icon: "ri-layout-line", items: ["React 19", "Next.js 14", "TypeScript", "TailwindCSS", "Framer Motion"] },
      { category: "Backend", icon: "ri-server-line", items: ["Node.js", "GraphQL", "PostgreSQL", "Redis", "Elasticsearch"] },
      { category: "Payments & Commerce", icon: "ri-bank-card-line", items: ["Stripe Elements", "3DS2", "Apple Pay", "Google Pay"] },
      { category: "Infrastructure", icon: "ri-cloud-line", items: ["AWS ECS", "CloudFront", "RDS", "ElastiCache", "GitHub Actions"] },
    ],
    gallery: [
      "https://readdy.ai/api/search-image?query=modern%20e-commerce%20product%20listing%20page%20dark%20theme%20multiple%20product%20cards%20with%20green%20highlights%2C%20clean%20UI%20components%2C%20professional%20web%20design%20screenshot%20mockup&width=800&height=500&seq=wcs_nexashop_g1&orientation=landscape",
      "https://readdy.ai/api/search-image?query=e-commerce%20checkout%20page%20dark%20interface%20with%20payment%20form%2C%20cart%20summary%2C%20clean%20minimal%20design%20with%20lime%20green%20accent%20colors%2C%20professional%20UI%20screenshot&width=800&height=500&seq=wcs_nexashop_g2&orientation=landscape",
      "https://readdy.ai/api/search-image?query=admin%20analytics%20dashboard%20for%20e-commerce%20platform%20showing%20revenue%20graphs%2C%20order%20management%2C%20dark%20professional%20interface%20with%20data%20visualizations&width=800&height=500&seq=wcs_nexashop_g3&orientation=landscape",
    ],
    quote: { text: "We went from dreading every marketing campaign to being excited for them. DevCraft didn't just build us a faster site — they built us a platform that can grow with us. We've done three flash sales since launch, each one bigger than the last, zero issues.", name: "Sarah Chen", role: "CTO", company: "NexaShop Inc." },
    tags: ["React", "Node.js", "Redis", "AWS", "Stripe", "GraphQL"],
    result: "$2M+ daily transactions",
    nextSlug: "meditrack-mobile",
    nextTitle: "MediTrack Mobile",
    nextImage: "https://readdy.ai/api/search-image?query=mobile%20healthcare%20app%20mockup%20on%20smartphone%20clean%20medical%20interface&width=400&height=280&seq=wcs_next_meditrack&orientation=landscape",
  },

  "meditrack-mobile": {
    slug: "meditrack-mobile",
    title: "MediTrack Mobile",
    tagline: "HIPAA-compliant healthcare app now trusted by 300+ clinics across 18 countries.",
    client: "MediTrack Health Systems",
    category: "Mobile",
    year: "2025",
    duration: "18 weeks",
    team: "5 engineers, 1 designer, 1 compliance specialist",
    accentColor: "#b9ff4b",
    heroImage: "https://readdy.ai/api/search-image?query=healthcare%20mobile%20app%20on%20multiple%20phone%20mockups%20dark%20background%2C%20clinical%20interface%20showing%20patient%20vitals%20heartbeat%20monitor%2C%20appointment%20scheduling%20calendar%2C%20clean%20medical%20UI%20with%20soft%20green%20accents%2C%20professional%20product%20photography%20studio%20lighting&width=1400&height=700&seq=wcs_meditrack_hero&orientation=landscape",
    overview: "MediTrack Health Systems needed a mobile-first platform to replace a desktop web app that was so cumbersome, doctors were keeping paper notes alongside it. The new app needed to handle everything from patient check-in and appointment management to remote teleconsultation — all while meeting HIPAA, GDPR, and ISO 27001 compliance requirements. We delivered a 4.9-star app that's now used by over 1,200 clinicians across 300 clinics.",
    challenge: "The existing system was a 2012-era desktop web app with no responsive design, no offline capability, and data stored in an on-premise SQL Server that had never been audited for HIPAA compliance. Clinics in rural areas faced 3-5 second load times for patient records due to no caching or CDN.",
    challengePoints: [
      "Existing app was desktop-only — doctors were routinely seen holding laptops while seeing patients",
      "Zero offline capability — in areas with poor connectivity, the app was completely unusable",
      "No audit logging — no way to prove who accessed which patient records, a critical HIPAA requirement",
      "Patient data stored without field-level encryption — a compliance nightmare waiting to happen",
      "No telemedicine capability despite 78% of surveyed clinics saying it was their top feature request",
    ],
    solution: "React Native with an offline-first architecture using a local SQLite database that syncs to the cloud when connectivity is restored. All patient data encrypted at rest using AES-256 and in transit using TLS 1.3. Built-in teleconsultation using WebRTC with E2E encryption, and a comprehensive audit log system satisfying HIPAA requirements.",
    solutionPoints: [
      "Offline-first architecture using WatermelonDB (SQLite) with conflict-free sync when connectivity restores",
      "Field-level AES-256 encryption for all PII with key management through AWS KMS",
      "WebRTC telemedicine with E2E encryption — no video data passes through our servers",
      "Full HIPAA audit trail: every record access, modification, and view is logged with user, timestamp, and device ID",
      "Biometric authentication (FaceID/TouchID) as primary login method with PIN fallback",
    ],
    metrics: [
      { label: "Clinics Onboarded", value: "300+", subvalue: "across 18 countries", icon: "ri-hospital-line" },
      { label: "App Store Rating", value: "4.9★", subvalue: "2,847 reviews", icon: "ri-star-fill" },
      { label: "Offline Reliability", value: "100%", subvalue: "functionality offline", icon: "ri-wifi-off-line" },
      { label: "Data Load Time", value: "< 200ms", subvalue: "patient record open", icon: "ri-speed-up-line" },
      { label: "HIPAA Compliance", value: "100%", subvalue: "audit passed", icon: "ri-shield-check-line" },
      { label: "Time Saved", value: "4.2 hrs", subvalue: "per doctor per week", icon: "ri-time-line" },
    ],
    timeline: [
      { week: "Week 1–3", title: "Compliance Architecture & Design System", description: "Designed the HIPAA-compliant data architecture with field-level encryption, audit log schema, and built the clinical design system with accessibility at AA standard.", tags: ["HIPAA", "Architecture", "Design System"] },
      { week: "Week 4–8", title: "Core App & Offline Engine", description: "Built the patient records module, appointment system, and offline-first sync engine using WatermelonDB. Implemented conflict resolution for concurrent clinic use cases.", tags: ["React Native", "WatermelonDB", "Offline-First"] },
      { week: "Week 9–12", title: "Telemedicine & Notifications", description: "Implemented WebRTC-based video consultation with waiting rooms, E2E encryption, and screen sharing. Built the push notification system for appointment reminders.", tags: ["WebRTC", "Firebase Cloud Messaging", "E2E Encryption"] },
      { week: "Week 13–16", title: "Security Audit & Compliance Testing", description: "Brought in external security auditors. Conducted full penetration testing, HIPAA gap analysis, and remediated all findings. Obtained compliance certification.", tags: ["Penetration Testing", "HIPAA Audit", "ISO 27001"] },
      { week: "Week 17–18", title: "Beta Program & Launch", description: "12-clinic beta program across 3 countries, collected 450+ pieces of feedback. Iterated on UX pain points. Launched globally on App Store and Google Play.", tags: ["Beta Testing", "App Store", "Google Play"] },
    ],
    techStack: [
      { category: "Mobile", icon: "ri-smartphone-line", items: ["React Native", "TypeScript", "Expo SDK 51", "React Navigation 7"] },
      { category: "Offline & Data", icon: "ri-database-2-line", items: ["WatermelonDB", "SQLite", "React Query", "Zustand"] },
      { category: "Security", icon: "ri-lock-line", items: ["AES-256 Encryption", "AWS KMS", "TLS 1.3", "Biometric Auth"] },
      { category: "Backend & Cloud", icon: "ri-cloud-line", items: ["Node.js", "PostgreSQL", "Firebase", "AWS", "WebRTC"] },
    ],
    gallery: [
      "https://readdy.ai/api/search-image?query=healthcare%20app%20patient%20list%20screen%20on%20mobile%20phone%20dark%20clinical%20interface%20clean%20medical%20data%20layout%20professional%20product%20mockup&width=800&height=500&seq=wcs_meditrack_g1&orientation=landscape",
      "https://readdy.ai/api/search-image?query=telemedicine%20video%20call%20screen%20on%20mobile%20app%20doctor%20patient%20consultation%20interface%20dark%20professional%20medical%20UI&width=800&height=500&seq=wcs_meditrack_g2&orientation=landscape",
      "https://readdy.ai/api/search-image?query=medical%20appointment%20scheduling%20calendar%20mobile%20app%20interface%20clean%20dark%20theme%20with%20booking%20slots%20and%20availability&width=800&height=500&seq=wcs_meditrack_g3&orientation=landscape",
    ],
    quote: { text: "The offline capability alone was transformative for our rural clinics. Our doctors in low-connectivity areas went from 40% of their time fighting the system to 100% focused on patients. The HIPAA audit was the smoothest we&apos;ve ever had — the audit trail Solutions built is genuinely best-in-class.", name: "Dr. Amara Osei", role: "Chief Medical Officer", company: "MediTrack Health Systems" },
    tags: ["React Native", "Firebase", "TypeScript", "HIPAA", "WebRTC"],
    result: "300+ clinics · 4.9★",
    nextSlug: "finflow-dashboard",
    nextTitle: "FinFlow Dashboard",
    nextImage: "https://readdy.ai/api/search-image?query=financial%20analytics%20dashboard%20dark%20interface%20with%20green%20data%20charts&width=400&height=280&seq=wcs_next_finflow&orientation=landscape",
  },

  "finflow-dashboard": {
    slug: "finflow-dashboard",
    title: "FinFlow Dashboard",
    tagline: "Real-time financial analytics for a Series B fintech that went from 0 to 50k users at launch.",
    client: "FinFlow Capital",
    category: "Web",
    year: "2024",
    duration: "16 weeks",
    team: "6 engineers, 1 data scientist, 1 designer",
    accentColor: "#b9ff4b",
    heroImage: "https://readdy.ai/api/search-image?query=cinematic%20financial%20trading%20dashboard%20on%20large%20curved%20ultrawide%20monitor%20dark%20background%20with%20neon%20green%20data%20visualizations%20candlestick%20charts%20portfolio%20analytics%20real-time%20data%20feeds%20professional%20fintech%20workstation%20dramatic%20lighting&width=1400&height=700&seq=wcs_finflow_hero&orientation=landscape",
    overview: "FinFlow Capital's founding team had a brilliant product vision for democratizing access to institutional-grade portfolio analytics — but their prototype was a Jupyter notebook connected to a spreadsheet. We designed and built the entire platform from scratch: real-time data ingestion, a D3.js visualization layer that renders 1M+ datapoints at 60fps, and a multi-currency engine that handles portfolios across 47 asset classes. They launched to 50,000 users and closed their Series B 6 weeks later.",
    challenge: "FinFlow needed to visualize live market data updating every 250ms across portfolios containing hundreds of positions. Their Jupyter notebook prototype ran calculations that took 12 seconds to update — completely unusable at the expected real-time standard.",
    challengePoints: [
      "Portfolio calculations involving 200+ positions took 12 seconds on the prototype — needed to run in < 100ms",
      "Multi-currency handling was hardcoded for USD — needed to support 47 asset classes including crypto, ETFs, futures",
      "No WebSocket infrastructure — all data polling over HTTP, causing 4-second data delay in the prototype",
      "D3.js charts needed to render 1M+ datapoints smoothly — brute force approaches would kill the browser",
      "Regulatory requirement for an immutable audit trail of all portfolio changes",
    ],
    solution: "A Python calculation engine running behind a FastAPI/WebSocket layer, feeding a React frontend with a custom WebGL-accelerated D3.js chart library. Portfolio calculations are pre-computed using Apache Kafka event streaming, making real-time updates instant rather than calculated on demand.",
    solutionPoints: [
      "Apache Kafka event-driven architecture pre-computes portfolio state on every price tick — UI updates are O(1) not O(n)",
      "Custom WebGL rendering layer on top of D3.js handles 1M+ datapoints at 60fps with no visible jank",
      "WebSocket connection manager with automatic reconnection and message replay for network interruptions",
      "Multi-currency engine with configurable base currency and real-time FX rates from ECB and Coinbase Pro",
      "PostgreSQL append-only ledger for the audit trail — every portfolio change is stored as an immutable event",
    ],
    metrics: [
      { label: "Users at Launch", value: "50,000", subvalue: "in first 48 hours", icon: "ri-group-line" },
      { label: "Portfolio Calc Speed", value: "< 80ms", subvalue: "was 12 seconds", icon: "ri-speed-up-line" },
      { label: "Chart Render Performance", value: "60fps", subvalue: "1M+ datapoints", icon: "ri-line-chart-line" },
      { label: "Data Freshness", value: "250ms", subvalue: "tick-to-screen latency", icon: "ri-timer-flash-line" },
      { label: "Asset Classes", value: "47", subvalue: "stocks, crypto, ETFs, futures", icon: "ri-pie-chart-line" },
      { label: "Series B Raised", value: "$18M", subvalue: "6 weeks post-launch", icon: "ri-funds-line" },
    ],
    timeline: [
      { week: "Week 1–3", title: "Data Architecture & Market Data Pipeline", description: "Designed the Kafka event streaming pipeline, integrated with 4 market data providers, and built the multi-currency calculation engine in Python.", tags: ["Apache Kafka", "Python", "Market Data"] },
      { week: "Week 4–7", title: "Visualization Engine", description: "Built the custom WebGL-accelerated D3.js layer for high-performance chart rendering. Designed the full chart component library with 12 chart types.", tags: ["D3.js", "WebGL", "React", "Canvas API"] },
      { week: "Week 8–11", title: "Portfolio Management Core", description: "Built position management, transaction ledger, performance attribution, and risk metrics. Implemented the append-only audit trail in PostgreSQL.", tags: ["PostgreSQL", "Event Sourcing", "Risk Engine"] },
      { week: "Week 12–14", title: "Real-Time WebSocket Layer", description: "Implemented the WebSocket manager, connection pooling for 50k concurrent clients, and the message replay system for network recovery.", tags: ["WebSocket", "FastAPI", "Connection Pooling"] },
      { week: "Week 15–16", title: "Load Testing & Launch Readiness", description: "Simulated 100k concurrent users. Tuned Kafka partition strategy and Redis caching. Coordinated with FinFlow&apos;s marketing team on the product launch.", tags: ["Load Testing", "Performance Tuning", "Launch"] },
    ],
    techStack: [
      { category: "Frontend", icon: "ri-layout-line", items: ["React 19", "TypeScript", "D3.js", "WebGL", "Framer Motion"] },
      { category: "Backend", icon: "ri-server-line", items: ["Python 3.12", "FastAPI", "PostgreSQL", "Redis", "Vue.js"] },
      { category: "Streaming", icon: "ri-broadcast-line", items: ["Apache Kafka", "WebSocket", "Server-Sent Events"] },
      { category: "Infrastructure", icon: "ri-cloud-line", items: ["AWS ECS", "MSK (Kafka)", "ElastiCache", "CloudFront"] },
    ],
    gallery: [
      "https://readdy.ai/api/search-image?query=financial%20portfolio%20dashboard%20with%20multi-chart%20layout%20showing%20performance%20attribution%20risk%20metrics%20dark%20professional%20fintech%20UI&width=800&height=500&seq=wcs_finflow_g1&orientation=landscape",
      "https://readdy.ai/api/search-image?query=candlestick%20chart%20with%20technical%20analysis%20indicators%20dark%20trading%20interface%20green%20and%20red%20candles%20professional%20finance%20app&width=800&height=500&seq=wcs_finflow_g2&orientation=landscape",
      "https://readdy.ai/api/search-image?query=portfolio%20summary%20page%20showing%20asset%20allocation%20pie%20chart%20performance%20metrics%20multi%20currency%20dark%20fintech%20dashboard&width=800&height=500&seq=wcs_finflow_g3&orientation=landscape",
    ],
    quote: { text: "The chart rendering performance is genuinely something I&apos;ve never seen before — 1 million points at 60fps without a single frame drop. Solutions didn&apos;t just build a dashboard, they built us a competitive moat. Our Series B investors specifically called out the product quality.", name: "Alex Mercer", role: "CEO & Co-Founder", company: "FinFlow Capital" },
    tags: ["Vue.js", "D3.js", "Python", "PostgreSQL", "Kafka"],
    result: "50k users at launch",
    nextSlug: "cloudsync-infrastructure",
    nextTitle: "CloudSync Infrastructure",
    nextImage: "https://readdy.ai/api/search-image?query=cloud%20infrastructure%20server%20rooms%20glowing%20LED%20data%20center%20architecture&width=400&height=280&seq=wcs_next_cloudsync&orientation=landscape",
  },

  "cloudsync-infrastructure": {
    slug: "cloudsync-infrastructure",
    title: "CloudSync Infrastructure",
    tagline: "80% faster deployments, 99.99% uptime — zero drama on Black Friday or any other day.",
    client: "LogiRoute Logistics",
    category: "Cloud",
    year: "2024",
    duration: "20 weeks",
    team: "4 cloud engineers, 2 DevOps specialists",
    accentColor: "#b9ff4b",
    heroImage: "https://readdy.ai/api/search-image?query=dramatic%20cinematic%20data%20center%20with%20glowing%20server%20racks%20green%20LED%20ambient%20lighting%20cloud%20infrastructure%20architecture%20visualization%20network%20topology%20nodes%20and%20connections%20dark%20futuristic%20technology&width=1400&height=700&seq=wcs_cloudsync_hero&orientation=landscape",
    overview: "LogiRoute's logistics platform was running on a single-region AWS setup that had accumulated 4 years of technical debt. Manual deployments took 3 hours and frequently failed, every major client integration required a weekend maintenance window, and a single ECS service restart could cascade into a 40-minute platform outage. We redesigned their entire cloud architecture, implemented infrastructure as code, and built a deployment pipeline that deploys 6 times per day with zero downtime.",
    challenge: "LogiRoute's infrastructure had grown organically with no governing architecture. 14 microservices were deployed with different methods (some via console click, some via scripts), no service mesh, no distributed tracing, and a shared database that made it impossible to scale individual services independently.",
    challengePoints: [
      "14 microservices deployed via 14 different methods — no consistency, no automation, no rollback capability",
      "Shared RDS instance across all services — a slow query in one service degraded the entire platform",
      "No distributed tracing — debugging a cross-service failure meant manually grepping through 14 CloudWatch log streams",
      "Manual deploy process took 3 hours — engineers dreaded releases and were avoiding shipping features",
      "No auto-scaling — the platform was constantly over-provisioned by 300% to handle rare traffic spikes",
    ],
    solution: "Complete infrastructure as code using Terraform, containerized all 14 services in ECS Fargate, introduced Istio service mesh for traffic management and tracing, migrated to per-service Aurora Serverless databases, and built a GitHub Actions pipeline delivering sub-20-minute deployments with automatic canary rollout.",
    solutionPoints: [
      "All 14 services codified in Terraform — infrastructure is now version-controlled, reviewable, and reproducible",
      "Per-service Aurora Serverless databases with read replicas — services now scale and fail independently",
      "Istio service mesh provides automatic mTLS, traffic splitting for canary deployments, and Jaeger distributed tracing",
      "GitHub Actions + ArgoCD pipeline with automatic canary rollout: 10% → 30% → 100% with error rate monitoring",
      "Predictive auto-scaling tuned on LogiRoute&apos;s traffic patterns — infrastructure cost reduced by 55%",
    ],
    metrics: [
      { label: "Deployment Speed", value: "−80%", subvalue: "3 hrs → 18 mins", icon: "ri-rocket-line" },
      { label: "Platform Uptime", value: "99.99%", subvalue: "last 8 months", icon: "ri-shield-check-line" },
      { label: "Infrastructure Cost", value: "−55%", subvalue: "$180k saved/year", icon: "ri-money-dollar-circle-line" },
      { label: "Deploy Frequency", value: "6×/day", subvalue: "was once/week", icon: "ri-refresh-line" },
      { label: "MTTR", value: "4 min", subvalue: "mean time to recover", icon: "ri-timer-flash-line" },
      { label: "Canary Rollbacks", value: "0", subvalue: "incidents post-launch", icon: "ri-error-warning-line" },
    ],
    timeline: [
      { week: "Week 1–4", title: "Infrastructure Audit & IaC Migration", description: "Audited all 14 services, documented dependencies, and codified the existing architecture in Terraform as a baseline before making any changes.", tags: ["Terraform", "AWS Audit", "Documentation"] },
      { week: "Week 5–8", title: "Service Mesh & Database Isolation", description: "Deployed Istio service mesh, implemented mTLS between all services, and executed the database split — each service now owns its Aurora Serverless instance.", tags: ["Istio", "Aurora Serverless", "mTLS"] },
      { week: "Week 9–14", title: "CI/CD Pipeline & Canary Deployment", description: "Built the GitHub Actions pipeline, integrated ArgoCD for GitOps, and implemented canary deployment with automatic rollback triggers on error rate spikes.", tags: ["GitHub Actions", "ArgoCD", "Canary Deploy"] },
      { week: "Week 15–18", title: "Observability Stack", description: "Deployed full Datadog APM integration, Jaeger distributed tracing, custom dashboards for each service owner, and PagerDuty incident routing.", tags: ["Datadog", "Jaeger", "PagerDuty"] },
      { week: "Week 19–20", title: "Load Testing & Runbook Documentation", description: "Ran Game Day scenarios including region failover, database failure, and traffic spike simulations. Wrote comprehensive runbooks for every scenario.", tags: ["Game Day", "Runbooks", "Chaos Engineering"] },
    ],
    techStack: [
      { category: "Infrastructure as Code", icon: "ri-code-s-slash-line", items: ["Terraform", "AWS CDK", "Helm Charts", "ArgoCD"] },
      { category: "Container Orchestration", icon: "ri-box-3-line", items: ["ECS Fargate", "Docker", "Istio Service Mesh", "Kubernetes"] },
      { category: "CI/CD", icon: "ri-git-branch-line", items: ["GitHub Actions", "ArgoCD", "Semantic Release", "Automated Canary"] },
      { category: "Observability", icon: "ri-eye-line", items: ["Datadog APM", "Jaeger Tracing", "Prometheus", "PagerDuty"] },
    ],
    gallery: [
      "https://readdy.ai/api/search-image?query=cloud%20infrastructure%20monitoring%20dashboard%20dark%20interface%20showing%20service%20health%20metrics%20uptime%20graphs%20microservices%20status%20professional%20devops%20UI&width=800&height=500&seq=wcs_cloudsync_g1&orientation=landscape",
      "https://readdy.ai/api/search-image?query=deployment%20pipeline%20visualization%20CI%2FCD%20flow%20diagram%20dark%20interface%20with%20green%20success%20indicators%20automated%20build%20stages%20professional%20tech%20UI&width=800&height=500&seq=wcs_cloudsync_g2&orientation=landscape",
      "https://readdy.ai/api/search-image?query=distributed%20tracing%20visualization%20service%20mesh%20diagram%20dark%20background%20showing%20request%20flows%20between%20microservices%20professional%20observability%20dashboard&width=800&height=500&seq=wcs_cloudsync_g3&orientation=landscape",
    ],
    quote: { text: "Three months after go-live, we deployed 6 times in one day for the first time in company history. Engineers who were scared to merge PRs are now pushing features with confidence. The infrastructure Solutions built is the foundation our engineering culture needed.", name: "Daniel Park", role: "VP of Engineering", company: "LogiRoute Logistics" },
    tags: ["AWS", "Terraform", "Docker", "Datadog", "Istio"],
    result: "80% faster deploys",
    nextSlug: "auraai-content-engine",
    nextTitle: "AuraAI Content Engine",
    nextImage: "https://readdy.ai/api/search-image?query=AI%20neural%20network%20content%20generation%20interface%20glowing%20nodes%20dark%20background&width=400&height=280&seq=wcs_next_auraai&orientation=landscape",
  },

  "auraai-content-engine": {
    slug: "auraai-content-engine",
    title: "AuraAI Content Engine",
    tagline: "10,000+ pieces of branded content per month, across 14 languages, that actually sounds like them.",
    client: "AuraAI",
    category: "AI",
    year: "2025",
    duration: "24 weeks",
    team: "5 engineers, 1 ML researcher, 1 content strategist",
    accentColor: "#b9ff4b",
    heroImage: "https://readdy.ai/api/search-image?query=artificial%20intelligence%20content%20generation%20studio%20dark%20cinematic%20interface%20neural%20network%20visualization%20with%20lime%20green%20glowing%20connection%20nodes%20language%20model%20inference%20UI%20futuristic%20machine%20learning%20platform%20dramatic%20atmospheric%20lighting&width=1400&height=700&seq=wcs_auraai_hero&orientation=landscape",
    overview: "AuraAI had a simple but brutal problem: they'd sold an AI content platform to enterprise clients who expected the output to match their brand voices, but vanilla GPT-4 prompting produced content that was technically correct and tonally unrecognizable. We built a custom multi-stage LangChain pipeline with brand voice extraction, RAG context injection, fine-tuned models per content category, and an automated quality gate — taking monthly output from 500 human-written pieces to 10,000+ AI-generated pieces that pass brand voice audits.",
    challenge: "Enterprise clients with highly distinctive brand voices — legal firms, luxury retailers, B2B SaaS companies — demanded content that read as unmistakably 'them'. A legal firm's brand voice is nothing like a luxury fashion brand's. Generic prompt engineering couldn't bridge these gaps at scale.",
    challengePoints: [
      "GPT-4 vanilla prompting produced tonally generic content that failed brand voice reviews 65% of the time",
      "14-language requirement with equivalent quality standards — not just translation, but original content in each language",
      "Content had to pass through multiple human review stages, defeating the cost-reduction purpose of AI generation",
      "No systematic way to encode brand voice — clients had informal style guides not suitable for LLM consumption",
      "Content generation latency of 45+ seconds per piece made real-time generation for high-volume clients impractical",
    ],
    solution: "A 5-stage LangChain pipeline: brand voice extraction (converting informal guides to structured embeddings), Pinecone RAG for context retrieval, fine-tuned GPT-4 models per content category (6 categories), automated quality scoring, and async batch processing for high-volume generation.",
    solutionPoints: [
      "Brand voice analyser processes historical approved content to extract tone, vocabulary, sentence structure patterns as embeddings",
      "Pinecone vector store with per-client knowledge bases — brand guidelines, product facts, competitor exclusions all retrieved at generation time",
      "6 fine-tuned GPT-4 models: blog, social, email, product descriptions, ad copy, long-form — each trained on 3,000+ approved examples",
      "Quality scoring classifier trained on 25,000 labeled examples scores content on 8 brand dimensions — sub-0.8 pieces auto-regenerated",
      "Celery async processing with Redis queue — peak throughput of 400 pieces/hour with auto-scaling worker pool",
    ],
    metrics: [
      { label: "Monthly Content Volume", value: "10,000+", subvalue: "up from 500", icon: "ri-article-line" },
      { label: "Languages Supported", value: "14", subvalue: "original, not translated", icon: "ri-translate-2" },
      { label: "Brand Voice Accuracy", value: "96%", subvalue: "human audit pass rate", icon: "ri-award-line" },
      { label: "Content Cost Reduction", value: "−85%", subvalue: "per piece produced", icon: "ri-money-dollar-circle-line" },
      { label: "Generation Speed", value: "< 4 sec", subvalue: "per piece average", icon: "ri-speed-up-line" },
      { label: "Client Retention", value: "100%", subvalue: "zero churn after launch", icon: "ri-heart-3-line" },
    ],
    timeline: [
      { week: "Week 1–4", title: "Brand Voice Extraction Framework", description: "Designed the brand voice analysis pipeline. Processed 50,000+ approved content pieces across 8 clients. Built the structured embedding system for brand voice representation.", tags: ["NLP", "Embeddings", "Brand Analysis"] },
      { week: "Week 5–10", title: "RAG Knowledge Base Infrastructure", description: "Built the Pinecone vector store architecture, designed per-client knowledge base structure, and implemented the context retrieval and injection pipeline.", tags: ["Pinecone", "RAG", "LangChain"] },
      { week: "Week 11–16", title: "Model Fine-Tuning", description: "Fine-tuned 6 GPT-4 models on category-specific datasets. Built the fine-tuning evaluation framework to measure brand voice accuracy before deployment.", tags: ["GPT-4 Fine-Tuning", "Evaluation Framework"] },
      { week: "Week 17–20", title: "Quality Gate & Scoring System", description: "Trained the quality scoring classifier on 25,000 labeled examples. Integrated auto-regeneration for sub-threshold pieces with parameter adjustment.", tags: ["Quality Scoring", "Active Learning"] },
      { week: "Week 21–24", title: "Scale Infrastructure & CMS Integration", description: "Built Celery async processing, scaled to 400 pieces/hour. Built CMS connectors for WordPress, Contentful, and HubSpot.", tags: ["Celery", "Redis", "CMS Integration"] },
    ],
    techStack: [
      { category: "AI & ML", icon: "ri-robot-line", items: ["OpenAI GPT-4", "LangChain", "HuggingFace", "Pinecone", "Weights & Biases"] },
      { category: "Backend", icon: "ri-server-line", items: ["Python 3.12", "FastAPI", "Celery", "Redis", "PostgreSQL"] },
      { category: "Infrastructure", icon: "ri-cloud-line", items: ["AWS Lambda", "SQS", "S3", "Docker", "GitHub Actions"] },
    ],
    gallery: [
      "https://readdy.ai/api/search-image?query=AI%20content%20generation%20dashboard%20showing%20content%20pieces%20with%20brand%20voice%20score%20quality%20metrics%20dark%20professional%20interface&width=800&height=500&seq=wcs_auraai_g1&orientation=landscape",
      "https://readdy.ai/api/search-image?query=machine%20learning%20model%20training%20visualization%20loss%20curves%20accuracy%20metrics%20professional%20dark%20ML%20dashboard%20interface&width=800&height=500&seq=wcs_auraai_g2&orientation=landscape",
      "https://readdy.ai/api/search-image?query=multilingual%20content%20management%20interface%20showing%20content%20in%20multiple%20languages%20dark%20professional%20editorial%20dashboard&width=800&height=500&seq=wcs_auraai_g3&orientation=landscape",
    ],
    quote: { text: "Our content team now has one job: strategy. Everything else is AuraAI. DevCraft&apos;s pipeline generates content that our most senior copywriter couldn&apos;t distinguish from human-written in our double-blind tests. That&apos;s not a tool — that&apos;s a superpower.", name: "Priya Nair", role: "Head of Product", company: "AuraAI" },
    tags: ["Python", "LangChain", "OpenAI", "FastAPI", "Pinecone"],
    result: "10k+ pieces/month",
    nextSlug: "smarthome-connect",
    nextTitle: "SmartHome Connect",
    nextImage: "https://readdy.ai/api/search-image?query=smart%20home%20IoT%20app%20interface%20mobile%20tablet%20ambient%20lighting%20controls&width=400&height=280&seq=wcs_next_smarthome&orientation=landscape",
  },

  "smarthome-connect": {
    slug: "smarthome-connect",
    title: "SmartHome Connect",
    tagline: "200+ device types, voice control, geofencing, and energy analytics — all in one app.",
    client: "SmartHome Technologies",
    category: "Mobile",
    year: "2025",
    duration: "22 weeks",
    team: "6 engineers, 1 IoT specialist, 1 designer",
    accentColor: "#b9ff4b",
    heroImage: "https://readdy.ai/api/search-image?query=smart%20home%20IoT%20control%20app%20on%20multiple%20devices%20tablet%20phone%20dark%20interface%20ambient%20living%20room%20scene%20with%20device%20controls%20glowing%20UI%20panels%20home%20automation%20dashboard%20professional%20product%20photography%20soft%20atmospheric%20lighting&width=1400&height=700&seq=wcs_smarthome_hero&orientation=landscape",
    overview: "SmartHome Technologies had built proprietary firmware for 200+ device types across lighting, HVAC, security, and appliances — but their companion app was a disaster. Separate apps for different device categories, no cross-device automation, no energy analytics, and a pairing process so painful that their customer support team fielded 2,000+ calls per month just about device setup. We built one unified app that talks to all 200+ device types and makes the smart home experience actually smart.",
    challenge: "The fragmented app ecosystem was destroying customer satisfaction. Users needed 4-7 different apps to control their SmartHome ecosystem. Cross-device automation (when motion sensor triggers, turn on lights and set thermostat) was completely impossible.",
    challengePoints: [
      "7 separate apps for different device categories — users routinely gave 1-star reviews just about the fragmentation",
      "MQTT, Zigbee, Z-Wave, and proprietary protocols — no unified device abstraction layer existed",
      "Device pairing averaged 11 minutes and required consulting a printed manual — 40% of users failed unassisted",
      "No automation engine — customers were paying premium prices for devices that couldn't talk to each other",
      "Energy analytics were Excel exports emailed monthly — no real-time visibility into consumption",
    ],
    solution: "Flutter app with a custom device abstraction layer that normalizes MQTT, Zigbee, Z-Wave, and REST into a single device API. Built-in automation engine with a no-code visual rule builder, voice commands via Google Assistant and Siri, geofencing for arrival/departure triggers, and real-time energy analytics powered by InfluxDB.",
    solutionPoints: [
      "Device abstraction layer normalizes 4 different protocols — app code never touches protocol specifics",
      "No-code visual automation rule builder: IF sensor X triggers THEN device Y does Z, supporting complex multi-condition chains",
      "Voice command integration with Google Assistant and Siri via Actions on Google and SiriKit",
      "Geofencing using CoreLocation/Fused Location — triggers automations on arrival and departure",
      "InfluxDB time-series database with Grafana-style energy dashboards — real-time consumption down to circuit level",
    ],
    metrics: [
      { label: "Device Types Supported", value: "200+", subvalue: "MQTT, Zigbee, Z-Wave", icon: "ri-cpu-line" },
      { label: "App Store Rating", value: "4.8★", subvalue: "vs 2.1★ old apps", icon: "ri-star-fill" },
      { label: "Device Pairing Time", value: "< 2 min", subvalue: "was 11+ minutes", icon: "ri-time-line" },
      { label: "Support Calls", value: "−87%", subvalue: "2,000 → 260/month", icon: "ri-customer-service-2-line" },
      { label: "Energy Insights", value: "Real-time", subvalue: "down to circuit level", icon: "ri-flashlight-line" },
      { label: "Active Automations", value: "3.2M", subvalue: "running across users", icon: "ri-settings-3-line" },
    ],
    timeline: [
      { week: "Week 1–4", title: "Protocol Abstraction Layer", description: "Built the device abstraction layer normalizing MQTT, Zigbee, Z-Wave, and REST protocols. Designed the universal device state model.", tags: ["MQTT", "Zigbee", "Z-Wave", "Protocol Design"] },
      { week: "Week 5–9", title: "Core App & Device Management", description: "Built the Flutter app core: device discovery, pairing flow (reduced to 5 steps), room organization, real-time status updates via WebSocket.", tags: ["Flutter", "WebSocket", "UX Design"] },
      { week: "Week 10–14", title: "Automation Engine", description: "Built the visual rule builder, automation execution engine, and the geofencing system. Implemented voice command integrations.", tags: ["Automation Engine", "Geofencing", "Voice Control"] },
      { week: "Week 15–18", title: "Energy Analytics Platform", description: "Designed the InfluxDB schema for time-series energy data, built real-time dashboards, energy budgeting, and predictive analytics.", tags: ["InfluxDB", "Analytics", "Golang"] },
      { week: "Week 19–22", title: "Beta Testing & Launch", description: "4-week beta with 500 households across 12 device configurations. Resolved 340+ edge cases in device behavior. Coordinated app store submissions.", tags: ["Beta Testing", "Edge Cases", "App Store"] },
    ],
    techStack: [
      { category: "Mobile", icon: "ri-smartphone-line", items: ["Flutter 3.22", "Dart 3", "Riverpod", "go_router"] },
      { category: "IoT & Protocols", icon: "ri-cpu-line", items: ["MQTT", "Zigbee", "Z-Wave", "Golang Gateway"] },
      { category: "Backend & Data", icon: "ri-database-2-line", items: ["Golang", "InfluxDB", "PostgreSQL", "Redis", "WebSocket"] },
      { category: "Integrations", icon: "ri-voice-recognition-line", items: ["Google Assistant", "Siri / SiriKit", "Geofencing", "Push Notifications"] },
    ],
    gallery: [
      "https://readdy.ai/api/search-image?query=smart%20home%20device%20control%20dashboard%20on%20tablet%20showing%20room%20overview%20with%20lights%20temperature%20security%20controls%20dark%20ambient%20interface&width=800&height=500&seq=wcs_smarthome_g1&orientation=landscape",
      "https://readdy.ai/api/search-image?query=home%20automation%20rule%20builder%20no-code%20visual%20interface%20on%20mobile%20dark%20clean%20UI%20with%20device%20triggers%20and%20actions&width=800&height=500&seq=wcs_smarthome_g2&orientation=landscape",
      "https://readdy.ai/api/search-image?query=energy%20consumption%20analytics%20dashboard%20real-time%20power%20usage%20charts%20solar%20generation%20data%20home%20management%20dark%20professional%20interface&width=800&height=500&seq=wcs_smarthome_g3&orientation=landscape",
    ],
    quote: { text: "The pairing experience alone was worth the project. We went from our biggest support headache to our biggest source of organic app store reviews. DevCraft understood that for smart home to work, it has to feel dumb-simple — and they nailed it.", name: "James Okafor", role: "CPO", company: "SmartHome Technologies" },
    tags: ["Flutter", "MQTT", "Golang", "InfluxDB", "IoT"],
    result: "200+ device types",
    nextSlug: "nexashop-platform",
    nextTitle: "NexaShop Platform",
    nextImage: "https://readdy.ai/api/search-image?query=dark%20e-commerce%20web%20platform%20dashboard%20multiple%20screens%20product%20grids&width=400&height=280&seq=wcs_next_nexashop&orientation=landscape",
  },
};

export default workCaseStudies;