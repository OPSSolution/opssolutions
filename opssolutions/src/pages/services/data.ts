export interface ServiceDetail {
  slug: string;
  title: string;
  subtitle: string;
  icon: string;
  description: string;
  heroImage: string;
  tagline: string;
  stats: { value: string; label: string }[];
  approach: { title: string; body: string }[];
  techStack: { category: string; items: string[] }[];
  industries: { icon: string; name: string; example: string }[];
  caseStudies: {
    title: string;
    result: string;
    tags: string[];
    image: string;
    slug: string;
  }[];
  pricing: { tier: string; range: string; ideal: string }[];
  testimonials: {
    quote: string;
    name: string;
    title: string;
    company: string;
    avatar: string;
  }[];
}

export const services: ServiceDetail[] = [
  {
    slug: "web-development",
    title: "Web Development",
    subtitle: "Full-stack web applications that scale",
    icon: "ri-code-s-slash-line",
    description:
      "We build high-performance web applications used by millions — from fast-loading marketing sites to complex SaaS platforms with real-time capabilities, multi-tenant architectures, and payment infrastructure.",
    tagline: "From MVP to 10M users — we've done it.",
    heroImage:
      "https://readdy.ai/api/search-image?query=modern%20web%20development%20workspace%20with%20dual%20monitors%20showing%20React%20code%20and%20live%20preview%2C%20dark%20professional%20setup%20with%20green%20accent%20lighting%2C%20keyboard%20and%20coffee%2C%20cinematic%20depth%20of%20field%2C%20premium%20software%20engineering%20environment%2C%20authentic%20developer%20workspace&width=1440&height=700&seq=svc_web_hero&orientation=landscape",
    stats: [
      { value: "80+", label: "Web Apps Shipped" },
      { value: "10M+", label: "Daily Active Users" },
      { value: "< 1.2s", label: "Avg Load Time" },
      { value: "99.98%", label: "Uptime SLA" },
    ],
    approach: [
      {
        title: "Architecture First",
        body: "We spend the first sprint designing your data model, API contracts, and component hierarchy before writing a line of product code. This prevents costly rewrites later.",
      },
      {
        title: "Performance is Non-Negotiable",
        body: "Every release is audited against Core Web Vitals. We target a 90+ Lighthouse score in production — SSR, code splitting, edge caching — whatever it takes.",
      },
      {
        title: "Built to Hand Off",
        body: "Clean TypeScript, documented APIs, Storybook component libraries. When you bring in an internal team, they'll love the codebase — not curse it.",
      },
      {
        title: "Tested at Every Layer",
        body: "Unit tests, integration tests, end-to-end Playwright flows. Our CI pipeline catches regressions before they reach staging.",
      },
    ],
    techStack: [
      { category: "Frontend", items: ["React 19", "Next.js 15", "TypeScript", "TailwindCSS", "Framer Motion"] },
      { category: "Backend", items: ["Node.js", "Express", "NestJS", "GraphQL", "REST APIs"] },
      { category: "Database", items: ["PostgreSQL", "Redis", "MongoDB", "Prisma ORM", "Supabase"] },
      { category: "Infrastructure", items: ["AWS", "Vercel", "Cloudflare", "Docker", "GitHub Actions"] },
      { category: "Testing", items: ["Vitest", "Playwright", "Testing Library", "Storybook"] },
    ],
    industries: [
      { icon: "ri-shopping-cart-line", name: "E-Commerce", example: "Custom storefronts with sub-100ms product search and AI upsells" },
      { icon: "ri-bank-line", name: "Fintech", example: "Real-time transaction dashboards and compliance-ready reporting" },
      { icon: "ri-cloud-line", name: "SaaS", example: "Multi-tenant B2B platforms with role-based access and billing" },
      { icon: "ri-stethoscope-line", name: "Healthcare", example: "HIPAA-compliant patient portals with EHR integrations" },
      { icon: "ri-newspaper-line", name: "Media", example: "High-traffic publishing platforms with CDN-optimized delivery" },
      { icon: "ri-graduation-cap-line", name: "EdTech", example: "Interactive learning platforms with real-time collaboration" },
    ],
    caseStudies: [
      {
        title: "NexaShop Platform",
        result: "$2M+ daily transactions, 400ms avg page load",
        tags: ["React", "Node.js", "AWS"],
        image: "https://readdy.ai/api/search-image?query=sleek%20dark%20e-commerce%20web%20platform%20dashboard%20on%20multiple%20screens%2C%20modern%20UI%20with%20product%20grids%20and%20analytics%20charts%2C%20dark%20theme%20interface%20with%20green%20accents%2C%20professional%20tech%20photography%20studio%20lighting%2C%20minimalist%20digital%20product%20design&width=800&height=500&seq=portfolio_01b&orientation=landscape",
        slug: "nexashop-platform",
      },
      {
        title: "FinFlow Dashboard",
        result: "Series B startup, 50k active users at launch",
        tags: ["Vue.js", "D3.js", "PostgreSQL"],
        image: "https://readdy.ai/api/search-image?query=financial%20analytics%20dashboard%20on%20widescreen%20monitor%2C%20dark%20interface%20with%20green%20neon%20data%20charts%20and%20graphs%2C%20cryptocurrency%20and%20finance%20metrics%2C%20cinematic%20studio%20setup%2C%20high-tech%20trading%20platform%20aesthetic%2C%20dramatic%20lighting&width=800&height=500&seq=portfolio_03b&orientation=landscape",
        slug: "finflow-dashboard",
      },
    ],
    pricing: [
      { tier: "MVP", range: "$25k – $60k", ideal: "Early-stage startups needing fast validation" },
      { tier: "Growth", range: "$60k – $150k", ideal: "Scaling products adding core feature sets" },
      { tier: "Enterprise", range: "$150k+", ideal: "Complex platforms with compliance and scale needs" },
    ],
    testimonials: [
      {
        quote: "Solutions rebuilt our entire commerce platform in 14 weeks. It now handles 4x the traffic at half the server costs. The codebase was so clean our in-house team hit the ground running on day one.",
        name: "Sarah Chen",
        title: "CTO",
        company: "NexaShop",
        avatar: "https://readdy.ai/api/search-image?query=professional%20headshot%20of%20Asian%20female%20tech%20executive%2C%20warm%20studio%20lighting%2C%20confident%20smile%2C%20business%20casual%20attire%2C%20shallow%20depth%20of%20field%2C%20clean%20neutral%20background%2C%20portrait%20photography&width=100&height=100&seq=ava_sarah_chen&orientation=squarish",
      },
      {
        quote: "We had a 3-year-old monolith nobody wanted to touch. Solutions migrated it to microservices without a single hour of downtime. That's pure engineering craft.",
        name: "Marcus Riley",
        title: "VP Engineering",
        company: "FinFlow Inc",
        avatar: "https://readdy.ai/api/search-image?query=professional%20headshot%20of%20African%20American%20male%20software%20engineering%20VP%2C%20warm%20studio%20lighting%2C%20confident%20smile%2C%20business%20casual%2C%20shallow%20depth%20of%20field%2C%20clean%20neutral%20background%2C%20portrait%20photography&width=100&height=100&seq=ava_marcus_riley&orientation=squarish",
      },
    ],
  },
  {
    slug: "mobile-development",
    title: "Mobile Development",
    subtitle: "Cross-platform apps with native performance",
    icon: "ri-smartphone-line",
    description:
      "We build iOS and Android apps that feel truly native — buttery animations, offline-first architecture, and deep platform integrations. From consumer apps to enterprise mobility solutions.",
    tagline: "5-star apps from App Store to the enterprise.",
    heroImage:
      "https://readdy.ai/api/search-image?query=mobile%20app%20development%20setup%20with%20iPhone%20and%20Android%20phone%20showing%20polished%20UI%20designs%2C%20developer%20laptop%20with%20React%20Native%20code%2C%20minimal%20dark%20studio%20photography%2C%20professional%20product%20photography%20on%20clean%20background%2C%20modern%20mobile%20engineering%20workspace&width=1440&height=700&seq=svc_mobile_hero&orientation=landscape",
    stats: [
      { value: "35+", label: "Apps Shipped" },
      { value: "5M+", label: "Downloads" },
      { value: "4.8★", label: "Avg App Rating" },
      { value: "iOS + Android", label: "Platform Coverage" },
    ],
    approach: [
      {
        title: "Cross-Platform without Compromise",
        body: "React Native and Flutter give you 95% code reuse while still allowing native modules when you need them. No Frankenstein hybrid apps.",
      },
      {
        title: "Offline-First Architecture",
        body: "We design data flows assuming poor connectivity. Local storage, optimistic updates, and conflict resolution — apps that work on the subway.",
      },
      {
        title: "Animation Quality Obsession",
        body: "60fps animations using Reanimated v3 and Skia. The micro-interactions that turn a good app into a loved app.",
      },
      {
        title: "App Store Ready",
        body: "We handle the full submission process — metadata, screenshots, review responses. We've shipped to 28 countries and know the gotchas.",
      },
    ],
    techStack: [
      { category: "Cross-Platform", items: ["React Native", "Expo", "Flutter", "Reanimated v3", "Skia"] },
      { category: "Native", items: ["Swift (iOS)", "Kotlin (Android)", "Native Modules", "Bridging"] },
      { category: "State & Data", items: ["Zustand", "React Query", "WatermelonDB", "MMKV"] },
      { category: "Backend Services", items: ["Firebase", "Supabase", "REST APIs", "GraphQL", "WebSockets"] },
      { category: "DevOps", items: ["EAS Build", "Fastlane", "GitHub Actions", "TestFlight"] },
    ],
    industries: [
      { icon: "ri-heart-pulse-line", name: "Healthcare", example: "HIPAA-compliant patient apps with wearable integration" },
      { icon: "ri-home-wifi-line", name: "IoT / Smart Home", example: "Bluetooth and MQTT-connected device management apps" },
      { icon: "ri-shopping-bag-line", name: "Retail", example: "Mobile-first shopping with AR product previews" },
      { icon: "ri-bank-line", name: "Fintech", example: "Secure banking apps with biometric auth and real-time data" },
      { icon: "ri-truck-line", name: "Logistics", example: "Driver and field ops apps with offline GPS tracking" },
      { icon: "ri-gamepad-line", name: "Consumer", example: "Social and lifestyle apps with viral growth mechanics" },
    ],
    caseStudies: [
      {
        title: "MediTrack Mobile",
        result: "300+ clinics onboarded, 4.9★ on both stores",
        tags: ["React Native", "Firebase", "TypeScript"],
        image: "https://readdy.ai/api/search-image?query=mobile%20healthcare%20app%20mockup%20on%20smartphone%2C%20clean%20white%20and%20dark%20interface%20with%20medical%20data%20charts%2C%20appointment%20scheduling%20UI%2C%20professional%20product%20photography%20on%20dark%20background%2C%20minimal%20health%20tech%20design&width=800&height=500&seq=portfolio_02b&orientation=landscape",
        slug: "meditrack-mobile",
      },
      {
        title: "SmartHome Connect",
        result: "200+ device types, 50k active homes",
        tags: ["Flutter", "MQTT", "Golang"],
        image: "https://readdy.ai/api/search-image?query=smart%20home%20IoT%20app%20interface%20on%20tablet%20and%20phone%20mockups%2C%20modern%20living%20room%20with%20ambient%20lighting%20controls%2C%20dark%20themed%20mobile%20interface%20with%20device%20management%2C%20home%20automation%20dashboard%2C%20tech%20product%20photography%20with%20soft%20ambient%20glow&width=800&height=500&seq=portfolio_06b&orientation=landscape",
        slug: "smarthome-connect",
      },
    ],
    pricing: [
      { tier: "Single Platform", range: "$30k – $70k", ideal: "iOS or Android only for faster validation" },
      { tier: "Cross-Platform", range: "$50k – $120k", ideal: "Both platforms from a single codebase" },
      { tier: "Enterprise Suite", range: "$120k+", ideal: "Complex integrations and compliance requirements" },
    ],
    testimonials: [
      {
        quote: "We went from zero to 4.9 stars on both stores. The animation quality is what users comment on most — it genuinely feels like a product from Apple, not a startup.",
        name: "Dr. Priya Nair",
        title: "CEO & Co-founder",
        company: "MediTrack",
        avatar: "https://readdy.ai/api/search-image?query=professional%20headshot%20of%20South%20Asian%20female%20doctor%20entrepreneur%2C%20warm%20studio%20lighting%2C%20confident%20professional%20smile%2C%20business%20casual%2C%20clean%20neutral%20background%2C%20portrait%20photography&width=100&height=100&seq=ava_priya_nair&orientation=squarish",
      },
      {
        quote: "Our field ops team went from paper forms to a slick offline-capable app in 4 months. Drivers call it the best thing about working for us — not what we expected.",
        name: "James Wu",
        title: "COO",
        company: "FleetPrime Logistics",
        avatar: "https://readdy.ai/api/search-image?query=professional%20headshot%20of%20East%20Asian%20male%20operations%20executive%2C%20warm%20studio%20lighting%2C%20confident%20smile%2C%20business%20casual%2C%20clean%20neutral%20background%2C%20portrait%20photography&width=100&height=100&seq=ava_james_wu&orientation=squarish",
      },
    ],
  },
  {
    slug: "cloud-architecture",
    title: "Cloud Architecture",
    subtitle: "Infrastructure that scales without drama",
    icon: "ri-cloud-line",
    description:
      "We design and operate cloud infrastructure that handles millions of requests a day without breaking a sweat. From day-one startups to enterprise migrations, our clouds run lean, fast, and resilient.",
    tagline: "99.99% uptime. Period.",
    heroImage:
      "https://readdy.ai/api/search-image?query=dramatic%20data%20center%20interior%20with%20rows%20of%20illuminated%20servers%20glowing%20blue%20and%20green%2C%20wide%20angle%20cinematic%20shot%20showing%20infrastructure%20scale%2C%20professional%20photography%2C%20dark%20atmosphere%20with%20LED%20lighting%20strips%2C%20cloud%20computing%20technology%20environment&width=1440&height=700&seq=svc_cloud_hero&orientation=landscape",
    stats: [
      { value: "99.99%", label: "Uptime SLA" },
      { value: "80%", label: "Avg Deployment Speed Gain" },
      { value: "40%", label: "Typical Cost Reduction" },
      { value: "AWS + GCP + Azure", label: "Multi-cloud" },
    ],
    approach: [
      {
        title: "Infrastructure as Code from Day One",
        body: "Every resource defined in Terraform. No manual console clicking, no configuration drift — your infra is reproducible, auditable, and version-controlled.",
      },
      {
        title: "FinOps Built In",
        body: "We run cost analysis in every sprint review. Auto-scaling, reserved instances, spot workers — we design infra that grows with you without billing surprises.",
      },
      {
        title: "Zero-Trust Security by Default",
        body: "Least-privilege IAM, VPC isolation, secrets management via Vault or AWS Secrets Manager. We design as if every service is potentially compromised.",
      },
      {
        title: "Observability Stack Included",
        body: "Datadog or Grafana + Prometheus dashboards, alerting, distributed tracing. You'll know about issues before your users do.",
      },
    ],
    techStack: [
      { category: "Cloud Providers", items: ["AWS", "Google Cloud", "Azure", "Cloudflare", "Hetzner"] },
      { category: "IaC & Config", items: ["Terraform", "Pulumi", "Ansible", "Helm Charts"] },
      { category: "Containers & Orchestration", items: ["Docker", "Kubernetes (EKS/GKE)", "ArgoCD", "Helm"] },
      { category: "CI/CD", items: ["GitHub Actions", "GitLab CI", "CircleCI", "Flux", "Spinnaker"] },
      { category: "Observability", items: ["Datadog", "Prometheus", "Grafana", "OpenTelemetry", "PagerDuty"] },
    ],
    industries: [
      { icon: "ri-truck-line", name: "Logistics", example: "Auto-scaling fleets handling 10k+ daily shipment events" },
      { icon: "ri-bank-line", name: "Fintech", example: "PCI-DSS compliant payment infrastructure with multi-region failover" },
      { icon: "ri-stethoscope-line", name: "Healthcare", example: "HIPAA-compliant FHIR-ready cloud with full audit trails" },
      { icon: "ri-building-line", name: "Enterprise", example: "Legacy-to-cloud migrations with zero downtime cutovers" },
      { icon: "ri-game-line", name: "Gaming", example: "Low-latency game server infrastructure across 6 global regions" },
      { icon: "ri-shopping-cart-line", name: "E-Commerce", example: "Black Friday-proof auto-scaling for 50x traffic spikes" },
    ],
    caseStudies: [
      {
        title: "CloudSync Infrastructure",
        result: "80% faster deploys, $180k/year cloud cost savings",
        tags: ["AWS", "Terraform", "Kubernetes"],
        image: "https://readdy.ai/api/search-image?query=cloud%20infrastructure%20architecture%20diagram%20on%20dark%20background%2C%20server%20rooms%20with%20glowing%20cables%20and%20LED%20lights%2C%20data%20center%20technology%20visualization%2C%20network%20topology%20with%20green%20connection%20nodes%2C%20futuristic%20server%20management%20interface&width=800&height=500&seq=portfolio_04b&orientation=landscape",
        slug: "cloudsync-infrastructure",
      },
      {
        title: "NexaShop Platform",
        result: "Handles 2M+ daily transactions, zero incidents in 18 months",
        tags: ["AWS", "Docker", "Redis"],
        image: "https://readdy.ai/api/search-image?query=cloud%20server%20infrastructure%20monitoring%20dashboard%20with%20uptime%20graphs%2C%20latency%20metrics%20and%20system%20health%20indicators%2C%20dark%20professional%20interface%20with%20glowing%20green%20status%20indicators%2C%20devops%20operations%20command%20center&width=800&height=500&seq=svc_cloud_cs2&orientation=landscape",
        slug: "nexashop-platform",
      },
    ],
    pricing: [
      { tier: "Audit & Optimize", range: "$8k – $25k", ideal: "Review and improve your existing cloud setup" },
      { tier: "Full Build-Out", range: "$40k – $100k", ideal: "Design and implement from scratch" },
      { tier: "Managed Ops", range: "$5k – $15k/mo", ideal: "Ongoing management, monitoring, and optimization" },
    ],
    testimonials: [
      {
        quote: "We survived our first Black Friday at 40x normal traffic. Zero incidents. The auto-scaling infra paid for itself in the first hour of peak sales alone.",
        name: "Tommy Bergström",
        title: "Engineering Lead",
        company: "NordShop",
        avatar: "https://readdy.ai/api/search-image?query=professional%20headshot%20of%20Scandinavian%20male%20engineering%20lead%2C%20warm%20studio%20lighting%2C%20confident%20smile%2C%20casual%20tech%20attire%2C%20clean%20neutral%20background%2C%20portrait%20photography&width=100&height=100&seq=ava_tommy_berg&orientation=squarish",
      },
      {
        quote: "The infrastructure migration had zero downtime. Not planned downtime — actual zero. For a fintech platform processing $50M/day, that's the only acceptable outcome.",
        name: "Diana Cole",
        title: "Infrastructure Director",
        company: "PayCore",
        avatar: "https://readdy.ai/api/search-image?query=professional%20headshot%20of%20professional%20female%20infrastructure%20director%2C%20warm%20studio%20lighting%2C%20confident%20smile%2C%20business%20attire%2C%20clean%20neutral%20background%2C%20portrait%20photography&width=100&height=100&seq=ava_diana_cole&orientation=squarish",
      },
    ],
  },
  {
    slug: "ui-ux-design",
    title: "UI/UX Design",
    subtitle: "Interfaces that convert and delight",
    icon: "ri-palette-line",
    description:
      "We design products people actually want to use — grounded in user research, validated through prototyping, and polished to pixel-perfect precision. Design systems that scale across every surface.",
    tagline: "Design is where revenue hides.",
    heroImage:
      "https://readdy.ai/api/search-image?query=UX%20designer%20working%20at%20large%204K%20monitor%20displaying%20Figma%20interface%20with%20component%20library%2C%20clean%20bright%20studio%20workspace%20with%20sticky%20notes%20and%20wireframes%20on%20wall%2C%20natural%20light%20streaming%20in%2C%20professional%20product%20design%20environment%2C%20modern%20creative%20office%20aesthetic&width=1440&height=700&seq=svc_design_hero&orientation=landscape",
    stats: [
      { value: "38%", label: "Avg Conversion Uplift" },
      { value: "50+", label: "Design Systems Built" },
      { value: "< 2wks", label: "First Prototype" },
      { value: "NPS 72", label: "User Satisfaction" },
    ],
    approach: [
      {
        title: "Research Before Pixels",
        body: "Every project starts with user interviews, competitive analysis, and journey mapping. We design what users need, not what we assume they want.",
      },
      {
        title: "Prototype Fast, Validate Faster",
        body: "Interactive Figma prototypes are in users' hands within two weeks. We iterate on feedback before a single line of code is written.",
      },
      {
        title: "Design Systems That Scale",
        body: "Atomic component libraries with Figma variables, design tokens, and detailed developer documentation. Your brand stays consistent at scale.",
      },
      {
        title: "Motion & Micro-interactions",
        body: "Every transition, loading state, and hover effect is intentionally designed. The details are what separates good products from loved ones.",
      },
    ],
    techStack: [
      { category: "Design Tools", items: ["Figma", "FigJam", "Framer", "Principle", "ProtoPie"] },
      { category: "Research", items: ["Maze", "Hotjar", "UserTesting", "Optimal Workshop"] },
      { category: "Design Systems", items: ["Figma Variables", "Design Tokens", "Storybook", "Style Dictionary"] },
      { category: "Collaboration", items: ["Notion", "Linear", "Zeplin", "Abstract"] },
    ],
    industries: [
      { icon: "ri-cloud-line", name: "SaaS", example: "Complex B2B dashboards simplified into intuitive workflows" },
      { icon: "ri-smartphone-line", name: "Mobile Apps", example: "Gesture-native mobile experiences with delightful animations" },
      { icon: "ri-shopping-cart-line", name: "E-Commerce", example: "Conversion-optimized checkout flows and product discovery" },
      { icon: "ri-bank-line", name: "Fintech", example: "Trust-first designs for sensitive financial data" },
      { icon: "ri-stethoscope-line", name: "Healthcare", example: "Accessible, anxiety-reducing patient-facing interfaces" },
      { icon: "ri-building-line", name: "Enterprise", example: "Modernizing legacy software with design system overhauls" },
    ],
    caseStudies: [
      {
        title: "MediTrack Mobile",
        result: "62% reduction in task completion time post-redesign",
        tags: ["Figma", "Design System", "Usability Testing"],
        image: "https://readdy.ai/api/search-image?query=mobile%20healthcare%20app%20mockup%20on%20smartphone%2C%20clean%20white%20and%20dark%20interface%20with%20medical%20data%20charts%2C%20appointment%20scheduling%20UI%2C%20professional%20product%20photography%20on%20dark%20background%2C%20minimal%20health%20tech%20design&width=800&height=500&seq=portfolio_02c&orientation=landscape",
        slug: "meditrack-mobile",
      },
      {
        title: "NexaShop Platform",
        result: "31% checkout conversion uplift after redesign",
        tags: ["Figma", "A/B Testing", "Design Tokens"],
        image: "https://readdy.ai/api/search-image?query=e-commerce%20product%20design%20mockup%20on%20large%20monitor%20showing%20polished%20checkout%20flow%20and%20product%20cards%2C%20warm%20studio%20lighting%2C%20clean%20minimal%20aesthetic%2C%20design%20system%20component%20showcase&width=800&height=500&seq=svc_design_cs2&orientation=landscape",
        slug: "nexashop-platform",
      },
    ],
    pricing: [
      { tier: "Audit & Sprint", range: "$8k – $20k", ideal: "UX audit + 2-week design sprint" },
      { tier: "Full Product Design", range: "$25k – $75k", ideal: "End-to-end design from research to handoff" },
      { tier: "Design System", range: "$30k – $80k", ideal: "Complete component library with documentation" },
    ],
    testimonials: [
      {
        quote: "Checkout conversion went up 31% the month after launch. Every stakeholder immediately asked why we didn't build this years ago. The ROI was immediate and undeniable.",
        name: "Rob Kasinski",
        title: "CMO",
        company: "NexaShop",
        avatar: "https://readdy.ai/api/search-image?query=professional%20headshot%20of%20male%20marketing%20CMO%20executive%2C%20warm%20studio%20lighting%2C%20confident%20friendly%20smile%2C%20business%20casual%2C%20clean%20neutral%20background%2C%20portrait%20photography&width=100&height=100&seq=ava_rob_kasinski&orientation=squarish",
      },
      {
        quote: "Users went from dreading our interface to recommending it. Net Promoter Score jumped 22 points in three months. Their research process uncovered problems we didn't know we had.",
        name: "Elise Fontaine",
        title: "Product Director",
        company: "CloudSuite B2B",
        avatar: "https://readdy.ai/api/search-image?query=professional%20headshot%20of%20French%20female%20product%20director%2C%20warm%20studio%20lighting%2C%20friendly%20smart%20smile%2C%20business%20casual%2C%20clean%20neutral%20background%2C%20portrait%20photography&width=100&height=100&seq=ava_elise_fontaine&orientation=squarish",
      },
    ],
  },
  {
    slug: "ai-ml-integration",
    title: "AI & ML Integration",
    subtitle: "Real intelligence, shipped to production",
    icon: "ri-robot-line",
    description:
      "We integrate AI that actually works in production — not demos. LLM-powered features, custom fine-tuned models, RAG pipelines, and computer vision systems that drive measurable business outcomes.",
    tagline: "AI that works in the real world.",
    heroImage:
      "https://readdy.ai/api/search-image?query=artificial%20intelligence%20neural%20network%20visualization%20with%20glowing%20interconnected%20nodes%20on%20deep%20dark%20background%2C%20data%20streams%20flowing%20through%20graph%20structures%2C%20machine%20learning%20concept%20art%20with%20lime%20green%20and%20teal%20accents%2C%20cinematic%20sci-fi%20digital%20art%2C%20ultra%20detailed&width=1440&height=700&seq=svc_ai_hero&orientation=landscape",
    stats: [
      { value: "20+", label: "AI Products in Production" },
      { value: "10M+", label: "AI Inferences / Month" },
      { value: "< 800ms", label: "Avg Inference Latency" },
      { value: "GPT-4 to Custom", label: "Model Range" },
    ],
    approach: [
      {
        title: "Problem-First, Not Model-First",
        body: "We start with the business problem, not the latest model. Sometimes a fine-tuned small model beats GPT-4 at a fraction of the cost. We find the right fit.",
      },
      {
        title: "RAG Architecture for Accuracy",
        body: "We build retrieval-augmented generation pipelines that ground LLMs in your data — dramatically reducing hallucinations and improving answer quality.",
      },
      {
        title: "Evaluation Pipelines Built In",
        body: "Every AI feature ships with evaluation harnesses — RAGAS scores, human eval frameworks, and automated regression detection. We know when quality degrades.",
      },
      {
        title: "Cost-Optimized from the Start",
        body: "Smart caching, model routing (fast cheap model for simple queries, powerful for complex), and async processing — AI features that don't bankrupt the unit economics.",
      },
    ],
    techStack: [
      { category: "LLM Frameworks", items: ["LangChain", "LlamaIndex", "Semantic Kernel", "DSPy"] },
      { category: "Models", items: ["GPT-4o", "Claude 3.5", "Gemini 2.0", "Mistral", "Custom Fine-tunes"] },
      { category: "Vector Stores", items: ["Pinecone", "Weaviate", "pgvector", "Qdrant", "ChromaDB"] },
      { category: "ML Engineering", items: ["PyTorch", "HuggingFace", "FastAPI", "Triton Inference"] },
      { category: "MLOps", items: ["MLflow", "W&B", "BentoML", "Arize", "LangSmith"] },
    ],
    industries: [
      { icon: "ri-newspaper-line", name: "Media & Content", example: "Branded content engines generating 10k+ pieces/month" },
      { icon: "ri-customer-service-2-line", name: "Customer Support", example: "AI agents resolving 65% of tickets without human escalation" },
      { icon: "ri-stethoscope-line", name: "Healthcare", example: "Clinical document summarization and coding assistance" },
      { icon: "ri-bank-line", name: "Fintech", example: "Fraud detection and AI-powered risk scoring systems" },
      { icon: "ri-shopping-cart-line", name: "E-Commerce", example: "Personalized recommendation engines and smart search" },
      { icon: "ri-building-line", name: "Enterprise", example: "Internal knowledge base assistants and process automation" },
    ],
    caseStudies: [
      {
        title: "AuraAI Content Engine",
        result: "10k+ pieces/month, 14 languages, 3.2x content ROI",
        tags: ["LangChain", "GPT-4", "FastAPI"],
        image: "https://readdy.ai/api/search-image?query=artificial%20intelligence%20content%20generation%20interface%2C%20neural%20network%20visualization%20with%20glowing%20nodes%20on%20dark%20background%2C%20AI%20text%20generation%20UI%20with%20code%20and%20language%20models%2C%20futuristic%20machine%20learning%20platform%2C%20lime%20green%20accent%20colors%2C%20cinematic%20digital%20art&width=800&height=500&seq=portfolio_05b&orientation=landscape",
        slug: "auraai-content-engine",
      },
      {
        title: "FinFlow AI Insights",
        result: "Anomaly detection catching $2M+ in fraud annually",
        tags: ["Python", "PyTorch", "pgvector"],
        image: "https://readdy.ai/api/search-image?query=AI%20fraud%20detection%20dashboard%20with%20neural%20network%20anomaly%20visualization%2C%20financial%20data%20streams%2C%20dark%20high-tech%20interface%20with%20warning%20indicators%20and%20machine%20learning%20model%20metrics%2C%20professional%20analytics%20command%20center&width=800&height=500&seq=svc_ai_cs2&orientation=landscape",
        slug: "finflow-dashboard",
      },
    ],
    pricing: [
      { tier: "AI Feature Sprint", range: "$15k – $40k", ideal: "Single AI-powered feature in your existing product" },
      { tier: "Full AI Platform", range: "$60k – $150k", ideal: "End-to-end AI product with evaluation pipelines" },
      { tier: "Ongoing MLOps", range: "$6k – $20k/mo", ideal: "Continuous monitoring, retraining, and optimization" },
    ],
    testimonials: [
      {
        quote: "The RAG pipeline replaced entire content workflows. We generate 10,000+ pieces/month across 14 languages with human-level quality. ROI was positive by month two.",
        name: "Jason Park",
        title: "Head of AI",
        company: "AuraMedia",
        avatar: "https://readdy.ai/api/search-image?query=professional%20headshot%20of%20Korean%20American%20male%20AI%20executive%2C%20warm%20studio%20lighting%2C%20intelligent%20smile%2C%20tech%20casual%20attire%2C%20clean%20neutral%20background%2C%20portrait%20photography&width=100&height=100&seq=ava_jason_park&orientation=squarish",
      },
      {
        quote: "Their fraud model catches $2M+ annually that slipped through our rule-based systems. It's the single best ROI tech investment we've ever made — and it keeps improving.",
        name: "Victoria Hanson",
        title: "Risk Director",
        company: "ClearPay",
        avatar: "https://readdy.ai/api/search-image?query=professional%20headshot%20of%20blonde%20professional%20female%20risk%20director%2C%20warm%20studio%20lighting%2C%20confident%20smile%2C%20business%20formal%2C%20clean%20neutral%20background%2C%20portrait%20photography&width=100&height=100&seq=ava_victoria_h&orientation=squarish",
      },
    ],
  },
  {
    slug: "devops-cicd",
    title: "DevOps & CI/CD",
    subtitle: "Ship faster with confidence, every time",
    icon: "ri-git-branch-line",
    description:
      "We eliminate the friction between writing code and having it in production. Automated pipelines, bulletproof testing, infrastructure as code, and monitoring that gives your team back hours every week.",
    tagline: "Deploy 10x a day without breaking a sweat.",
    heroImage:
      "https://readdy.ai/api/search-image?query=devops%20pipeline%20visualization%20on%20multiple%20monitors%20in%20dark%20operations%20center%2C%20CI%20CD%20workflow%20diagram%20with%20green%20checkmarks%20and%20deployment%20stages%2C%20professional%20engineering%20workspace%20with%20code%20on%20screens%2C%20terminal%20windows%2C%20monitoring%20dashboards%2C%20atmospheric%20lighting&width=1440&height=700&seq=svc_devops_hero&orientation=landscape",
    stats: [
      { value: "10x", label: "Deployment Frequency Increase" },
      { value: "< 5 min", label: "Average Pipeline Duration" },
      { value: "99.7%", label: "Build Success Rate" },
      { value: "3hr → 8min", label: "Avg Deploy Time Reduction" },
    ],
    approach: [
      {
        title: "GitOps Everything",
        body: "Every change to infrastructure and deployments flows through pull requests. Full auditability, easy rollbacks, and no surprise midnight changes.",
      },
      {
        title: "Progressive Delivery",
        body: "Feature flags, canary releases, and blue/green deployments mean you ship to 1% of users first. Confidence, not chaos.",
      },
      {
        title: "Testing Pyramid Enforced",
        body: "We configure test gates at every pipeline stage — unit, integration, e2e, and contract tests. Nothing reaches production without passing the gauntlet.",
      },
      {
        title: "On-Call Made Tolerable",
        body: "Runbooks, auto-remediation scripts, and sane alerting thresholds mean your engineers sleep better. We write SLOs that actually mean something.",
      },
    ],
    techStack: [
      { category: "CI/CD Platforms", items: ["GitHub Actions", "GitLab CI", "CircleCI", "Jenkins", "Buildkite"] },
      { category: "GitOps & Delivery", items: ["ArgoCD", "Flux", "Spinnaker", "Argo Rollouts"] },
      { category: "IaC", items: ["Terraform", "Pulumi", "CDK", "Ansible", "Packer"] },
      { category: "Security", items: ["SAST / DAST", "Snyk", "Trivy", "OWASP ZAP", "HashiCorp Vault"] },
      { category: "Monitoring", items: ["Datadog", "Grafana", "Prometheus", "Loki", "PagerDuty"] },
    ],
    industries: [
      { icon: "ri-cloud-line", name: "SaaS", example: "50+ deploys/day with zero-downtime blue/green releases" },
      { icon: "ri-bank-line", name: "Fintech", example: "SOC2-compliant pipelines with full change audit trails" },
      { icon: "ri-stethoscope-line", name: "Healthcare", example: "FDA-aligned software development lifecycles" },
      { icon: "ri-shopping-cart-line", name: "E-Commerce", example: "Automated performance testing preventing production regressions" },
      { icon: "ri-building-line", name: "Enterprise", example: "Monolith-to-microservices migration with CI/CD modernization" },
      { icon: "ri-gamepad-line", name: "Gaming", example: "Live service pipelines with rollback in under 60 seconds" },
    ],
    caseStudies: [
      {
        title: "CloudSync Infrastructure",
        result: "Deploy time: 3 hours → 8 minutes, 99.7% pipeline success rate",
        tags: ["GitHub Actions", "Terraform", "ArgoCD"],
        image: "https://readdy.ai/api/search-image?query=cloud%20infrastructure%20architecture%20diagram%20on%20dark%20background%2C%20server%20rooms%20with%20glowing%20cables%20and%20LED%20lights%2C%20data%20center%20technology%20visualization%2C%20network%20topology%20with%20green%20connection%20nodes%2C%20futuristic%20server%20management%20interface&width=800&height=500&seq=portfolio_04c&orientation=landscape",
        slug: "cloudsync-infrastructure",
      },
      {
        title: "NexaShop Platform",
        result: "Eliminated 100% of production incidents from configuration drift",
        tags: ["Terraform", "Datadog", "GitHub Actions"],
        image: "https://readdy.ai/api/search-image?query=deployment%20pipeline%20monitoring%20dashboard%20showing%20green%20CI%20CD%20builds%2C%20staging%20and%20production%20environment%20health%20metrics%2C%20automated%20test%20results%2C%20professional%20dark%20devops%20command%20center%20interface&width=800&height=500&seq=svc_devops_cs2&orientation=landscape",
        slug: "nexashop-platform",
      },
    ],
    pricing: [
      { tier: "Pipeline Audit", range: "$5k – $15k", ideal: "Review and optimize your existing CI/CD setup" },
      { tier: "Full Setup", range: "$20k – $60k", ideal: "Build pipelines from scratch for a new or existing project" },
      { tier: "Retainer", range: "$3k – $8k/mo", ideal: "Ongoing DevOps support, on-call, and continuous improvement" },
    ],
    testimonials: [
      {
        quote: "Deploy time went from 3 hours to 8 minutes. Engineering morale literally went through the roof — people stopped dreading release day. That's worth more than any metric.",
        name: "Chris Nakamura",
        title: "CTO",
        company: "CloudSync",
        avatar: "https://readdy.ai/api/search-image?query=professional%20headshot%20of%20Japanese%20American%20male%20CTO%2C%20warm%20studio%20lighting%2C%20confident%20tech%20smile%2C%20casual%20attire%2C%20clean%20neutral%20background%2C%20portrait%20photography&width=100&height=100&seq=ava_chris_naka&orientation=squarish",
      },
      {
        quote: "They set up our CI/CD in a way that taught our whole team better habits. We ship faster, onboarding takes half the time, and two years later it still runs perfectly.",
        name: "Beth Omondi",
        title: "Lead DevOps Engineer",
        company: "RapidBuild SaaS",
        avatar: "https://readdy.ai/api/search-image?query=professional%20headshot%20of%20African%20female%20DevOps%20engineer%2C%20warm%20studio%20lighting%2C%20confident%20smile%2C%20tech%20casual%2C%20clean%20neutral%20background%2C%20portrait%20photography&width=100&height=100&seq=ava_beth_omondi&orientation=squarish",
      },
    ],
  },
];

export function getServiceBySlug(slug: string): ServiceDetail | undefined {
  return services.find((s) => s.slug === slug);
}