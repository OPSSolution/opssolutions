export interface IndustryDetail {
  slug: string;
  name: string;
  icon: string;
  headline: string;
  description: string;
  heroImage: string;
  stats: { value: string; label: string }[];
  challenges: { title: string; body: string }[];
  servicesUsed: { slug: string; icon: string; title: string; relevance: string }[];
  techStack: { category: string; items: string[] }[];
  caseStudies: { title: string; result: string; tags: string[]; image: string; slug: string }[];
  testimonial: { quote: string; name: string; title: string; company: string; avatar: string };
}

export const industries: IndustryDetail[] = [
  {
    slug: "fintech",
    name: "Fintech",
    icon: "ri-bank-line",
    headline: "Building financial products regulators and users both love",
    description: "We've built payment rails, lending engines, wealth management platforms, and fraud detection systems handling billions in transactions. We understand the intersection of regulatory compliance, security-first design, and the exceptional UX standards fintech users demand.",
    heroImage: "https://readdy.ai/api/search-image?query=modern%20fintech%20office%20with%20financial%20data%20dashboards%20on%20large%20screens%2C%20trading%20terminal%20aesthetic%2C%20dark%20professional%20workspace%20with%20gold%20and%20green%20lighting%20accents%2C%20financial%20technology%20company%20interior%2C%20professional%20cinematic%20photography%20with%20atmospheric%20lighting&width=1440&height=600&seq=ind_fintech_hero&orientation=landscape",
    stats: [
      { value: "$8B+", label: "Transaction Volume" },
      { value: "PCI-DSS", label: "Compliance Level" },
      { value: "12+", label: "Fintech Products" },
      { value: "99.99%", label: "Uptime on Payment Systems" },
    ],
    challenges: [
      { title: "Regulatory Complexity", body: "PCI-DSS, SOC2, GDPR, and increasingly MiCA for crypto products. We build compliance from day one — audit trails, data residency, encryption at rest and in transit, and consent management that actually works." },
      { title: "Real-Time Data Requirements", body: "Transactions, balances, fraud signals — users expect millisecond updates. We architect event-driven systems with WebSocket live feeds, optimistic UI, and graceful rollback patterns." },
      { title: "Trust as a Product Feature", body: "Financial products live and die by trust signals. Every interaction, loading state, and error message is a trust signal. We design experiences that communicate safety and clarity at every touchpoint." },
    ],
    servicesUsed: [
      { slug: "web-development", icon: "ri-code-s-slash-line", title: "Web Development", relevance: "Secure multi-tenant banking platforms with real-time data feeds" },
      { slug: "mobile-development", icon: "ri-smartphone-line", title: "Mobile Development", relevance: "Biometric auth, NFC payments, and instant push notifications" },
      { slug: "cloud-architecture", icon: "ri-cloud-line", title: "Cloud Architecture", relevance: "PCI-DSS compliant multi-region infra with full audit trails" },
      { slug: "ai-ml-integration", icon: "ri-robot-line", title: "AI & ML", relevance: "Fraud detection, risk scoring, and AI credit underwriting" },
    ],
    techStack: [
      { category: "Security", items: ["HashiCorp Vault", "AWS KMS", "TLS 1.3", "OWASP Top 10"] },
      { category: "Real-Time", items: ["WebSockets", "Apache Kafka", "Redis Pub/Sub", "SSE"] },
      { category: "Payments", items: ["Stripe", "Plaid", "Dwolla", "Marqeta", "Finix"] },
      { category: "Compliance", items: ["Datadog Audit", "OpenTelemetry", "SIEM", "ISO 27001"] },
    ],
    caseStudies: [
      { title: "FinFlow Analytics Platform", result: "AI fraud detection catching $2M+ annually", tags: ["PyTorch", "pgvector", "Kafka"], image: "https://readdy.ai/api/search-image?query=financial%20analytics%20platform%20dark%20background%2C%20fraud%20detection%20dashboard%20with%20neural%20network%20visualization%20and%20anomaly%20graphs%2C%20professional%20dark%20fintech%20interface%20with%20green%20indicators%2C%20data%20streams%2C%20cinematic%20lighting&width=800&height=500&seq=ind_fin_cs1&orientation=landscape", slug: "finflow-dashboard" },
      { title: "ClearPay Lending Engine", result: "Loans originated in < 4 min, 3x industry approval speed", tags: ["NestJS", "PostgreSQL", "AWS"], image: "https://readdy.ai/api/search-image?query=mobile%20banking%20loan%20application%20on%20smartphone%2C%20clean%20professional%20fintech%20UI%2C%20modern%20dark%20interface%20with%20approval%20flow%20and%20financial%20metrics%2C%20warm%20studio%20product%20photography%20with%20dark%20background&width=800&height=500&seq=ind_fin_cs2&orientation=landscape", slug: "nexashop-platform" },
    ],
    testimonial: { quote: "Their fraud model catches $2M+ annually that was slipping through our rule-based systems. Best ROI tech investment we've ever made — and it keeps improving with each training run.", name: "Victoria Hanson", title: "Risk Director", company: "ClearPay", avatar: "https://readdy.ai/api/search-image?query=professional%20headshot%20of%20professional%20female%20risk%20director%2C%20warm%20studio%20lighting%2C%20confident%20smile%2C%20business%20formal%20attire%2C%20clean%20neutral%20background%2C%20portrait%20photography&width=100&height=100&seq=ind_ava_victoria&orientation=squarish" },
  },
  {
    slug: "healthcare",
    name: "Healthcare",
    icon: "ri-stethoscope-line",
    headline: "Healthcare software that clinicians trust and patients actually use",
    description: "From HIPAA-compliant patient portals to AI-assisted clinical documentation, we've shipped healthcare technology used by 300+ clinics and 500k+ patients. We know the difference between building healthcare software and building healthcare software correctly.",
    heroImage: "https://readdy.ai/api/search-image?query=modern%20hospital%20digital%20health%20interface%2C%20doctor%20using%20tablet%20with%20medical%20dashboard%2C%20clean%20professional%20healthcare%20technology%20environment%2C%20warm%20clinical%20lighting%2C%20patient%20data%20visualization%20on%20screens%2C%20professional%20medical%20technology%20photography&width=1440&height=600&seq=ind_health_hero&orientation=landscape",
    stats: [
      { value: "300+", label: "Clinics Onboarded" },
      { value: "HIPAA", label: "Full Compliance" },
      { value: "500k+", label: "Patients Served" },
      { value: "4.9★", label: "Clinician Satisfaction" },
    ],
    challenges: [
      { title: "HIPAA & Data Privacy", body: "PHI handling, audit logs, minimum necessary access, BAA agreements. We've been through multiple HIPAA audits with clients and know where auditors look first." },
      { title: "EHR Integration Hell", body: "HL7 FHIR, HL7 v2, SMART on FHIR, Epic APIs. We've built production integrations with Epic, Cerner, Athena, and a dozen smaller EHR systems. We know which ones have undocumented quirks." },
      { title: "Clinician Adoption", body: "Software that adds friction to clinical workflows gets abandoned — fast. We design healthcare tools around clinical workflows first, and technology second. Usability testing with actual clinicians is non-negotiable." },
    ],
    servicesUsed: [
      { slug: "web-development", icon: "ri-code-s-slash-line", title: "Web Development", relevance: "HIPAA-compliant patient portals and clinical dashboards" },
      { slug: "mobile-development", icon: "ri-smartphone-line", title: "Mobile Development", relevance: "Wearable integrations, appointment apps, remote monitoring" },
      { slug: "ai-ml-integration", icon: "ri-robot-line", title: "AI & ML", relevance: "Clinical note summarization, coding assistance, diagnostics" },
      { slug: "ui-ux-design", icon: "ri-palette-line", title: "UI/UX Design", relevance: "Accessible, anxiety-reducing patient-facing interfaces" },
    ],
    techStack: [
      { category: "Interoperability", items: ["HL7 FHIR R4", "SMART on FHIR", "Epic API", "CDS Hooks"] },
      { category: "Compliance", items: ["PHI Encryption", "Audit Logging", "BAA Framework", "SOC2 Type II"] },
      { category: "Infrastructure", items: ["AWS GovCloud", "Azure Healthcare APIs", "HIPAA-ready Supabase"] },
      { category: "AI/Clinical", items: ["Med-PaLM 2", "Custom NLP models", "ICD-10 Coding AI", "Voice-to-text"] },
    ],
    caseStudies: [
      { title: "MediTrack Mobile Platform", result: "300+ clinics, 62% reduction in task completion time", tags: ["React Native", "Firebase", "FHIR"], image: "https://readdy.ai/api/search-image?query=mobile%20healthcare%20app%20mockup%20on%20smartphone%2C%20clean%20white%20and%20dark%20interface%20with%20medical%20data%20charts%20and%20appointment%20scheduling%2C%20professional%20product%20photography%20on%20dark%20background%2C%20minimal%20health%20tech%20design&width=800&height=500&seq=ind_health_cs1&orientation=landscape", slug: "meditrack-mobile" },
      { title: "TeleCare Patient Portal", result: "4.9★ patient satisfaction, 40% reduced no-show rate", tags: ["Next.js", "Twilio", "PostgreSQL"], image: "https://readdy.ai/api/search-image?query=telemedicine%20video%20consultation%20interface%20on%20laptop%2C%20doctor%20patient%20virtual%20appointment%20screen%2C%20clean%20healthcare%20UI%20with%20video%20call%20and%20medical%20information%20panels%2C%20professional%20dark%20themed%20health%20tech%20platform&width=800&height=500&seq=ind_health_cs2&orientation=landscape", slug: "meditrack-mobile" },
    ],
    testimonial: { quote: "Our clinicians went from refusing to use the old system to requesting new features in the new one. In healthcare IT, that's the equivalent of a standing ovation. Solutions actually talked to our nurses before writing a line of code.", name: "Dr. Priya Nair", title: "CEO & Co-founder", company: "MediTrack", avatar: "https://readdy.ai/api/search-image?query=professional%20headshot%20of%20South%20Asian%20female%20doctor%20entrepreneur%2C%20warm%20studio%20lighting%2C%20confident%20smile%2C%20business%20casual%2C%20clean%20neutral%20background%2C%20portrait%20photography&width=100&height=100&seq=ind_ava_priya&orientation=squarish" },
  },
  {
    slug: "ecommerce",
    name: "E-Commerce",
    icon: "ri-shopping-cart-line",
    headline: "Commerce platforms built for conversion, scale, and the day after Black Friday",
    description: "We've built custom storefronts, marketplace engines, and DTC brand platforms processing $2M+ daily. From Shopify Plus customizations to fully custom commerce backends — we build the infrastructure that keeps the checkout flowing when traffic spikes 40x overnight.",
    heroImage: "https://readdy.ai/api/search-image?query=modern%20e-commerce%20fulfillment%20center%20with%20digital%20order%20screens%20and%20packing%20stations%2C%20warm%20golden%20overhead%20lighting%2C%20commerce%20operations%20environment%2C%20professional%20photography%20showing%20technology%20and%20logistics%20intersection%2C%20cinematic%20depth%20of%20field&width=1440&height=600&seq=ind_ecom_hero&orientation=landscape",
    stats: [
      { value: "$2M+", label: "Daily Transaction Volume" },
      { value: "< 400ms", label: "Avg Page Load" },
      { value: "40x", label: "Peak Traffic Handled" },
      { value: "31%", label: "Avg Checkout Uplift" },
    ],
    challenges: [
      { title: "Performance Under Pressure", body: "Commerce sites have exactly one job: don't go down when everyone wants to buy. We architect auto-scaling backend systems and edge-cached frontends that handle 50x traffic spikes without breaking a sweat." },
      { title: "Conversion Optimization", body: "A 100ms page load improvement can mean 1% conversion uplift. We obsess over Core Web Vitals, checkout UX, and the micro-interactions that remove friction between intent and purchase." },
      { title: "Third-Party Integration Sprawl", body: "Modern commerce stacks have 20+ tools. We architect clean data layers and event systems that keep your order management, inventory, shipping, and marketing tools talking to each other without creating a brittle house of cards." },
    ],
    servicesUsed: [
      { slug: "web-development", icon: "ri-code-s-slash-line", title: "Web Development", relevance: "Custom storefronts with sub-100ms search and AI recommendations" },
      { slug: "ui-ux-design", icon: "ri-palette-line", title: "UI/UX Design", relevance: "Conversion-optimized checkout flows and product discovery UX" },
      { slug: "cloud-architecture", icon: "ri-cloud-line", title: "Cloud Architecture", relevance: "Black Friday-proof auto-scaling for 40-50x traffic spikes" },
      { slug: "ai-ml-integration", icon: "ri-robot-line", title: "AI & ML", relevance: "Personalized product recommendations and smart search" },
    ],
    techStack: [
      { category: "Frontend", items: ["Next.js", "Remix", "Hydrogen", "React 19", "TailwindCSS"] },
      { category: "Commerce", items: ["Shopify Plus", "Medusa.js", "Stripe", "Adyen", "Algolia"] },
      { category: "Performance", items: ["Vercel Edge", "Cloudflare CDN", "Redis Cache", "ISR"] },
      { category: "Analytics", items: ["GA4", "PostHog", "Segment", "Hotjar", "Klaviyo"] },
    ],
    caseStudies: [
      { title: "NexaShop Commerce Platform", result: "$2M+ daily transactions, 400ms avg page load", tags: ["React", "Node.js", "AWS"], image: "https://readdy.ai/api/search-image?query=dark%20e-commerce%20web%20platform%20dashboard%20on%20multiple%20screens%2C%20modern%20UI%20with%20product%20grids%20and%20analytics%20charts%2C%20dark%20theme%20interface%20with%20green%20accents%2C%20professional%20tech%20studio%20photography%2C%20minimalist%20digital%20commerce%20design&width=800&height=500&seq=ind_ecom_cs1&orientation=landscape", slug: "nexashop-platform" },
      { title: "LuxeBrand Flagship Store", result: "31% checkout conversion uplift, 8s to 1.8s load time", tags: ["Next.js", "Shopify Plus", "Vercel"], image: "https://readdy.ai/api/search-image?query=luxury%20brand%20e-commerce%20website%20on%20laptop%20screen%2C%20elegant%20dark%20minimalist%20product%20page%20with%20large%20product%20photography%2C%20premium%20fashion%20DTC%20brand%20website%20design%2C%20professional%20studio%20lighting%20with%20product%20cards&width=800&height=500&seq=ind_ecom_cs2&orientation=landscape", slug: "nexashop-platform" },
    ],
    testimonial: { quote: "Solutions rebuilt our entire platform in 14 weeks. It now handles 4x the traffic at half the server costs. When our biggest sale event hit, we didn't even get an alert — it just worked.", name: "Sarah Chen", title: "CTO", company: "NexaShop", avatar: "https://readdy.ai/api/search-image?query=professional%20headshot%20of%20Asian%20female%20CTO%20tech%20executive%2C%20warm%20studio%20lighting%2C%20confident%20smile%2C%20business%20casual%2C%20clean%20neutral%20background%2C%20portrait%20photography&width=100&height=100&seq=ind_ava_sarah&orientation=squarish" },
  },
  {
    slug: "saas",
    name: "SaaS / B2B",
    icon: "ri-cloud-line",
    headline: "B2B SaaS platforms that enterprise buyers actually want to pay for",
    description: "We've built multi-tenant B2B platforms from MVP to Series B scale. Role-based access, white-labeling, usage-based billing, Salesforce integrations — we know the patterns that make enterprise buyers say yes, and the technical foundations that let you add seats without refactoring.",
    heroImage: "https://readdy.ai/api/search-image?query=modern%20B2B%20SaaS%20dashboard%20interface%20on%20multiple%20monitors%2C%20collaborative%20workspace%20showing%20analytics%20and%20team%20productivity%20tools%2C%20professional%20tech%20office%20with%20natural%20light%20and%20clean%20desk%20setup%2C%20software%20company%20environment%20photography&width=1440&height=600&seq=ind_saas_hero&orientation=landscape",
    stats: [
      { value: "20+", label: "SaaS Platforms Shipped" },
      { value: "Multi-tenant", label: "Architecture Expertise" },
      { value: "$0 → $5M ARR", label: "Client Range" },
      { value: "SOC2", label: "Compliance Ready" },
    ],
    challenges: [
      { title: "Multi-Tenancy Without Compromise", body: "True data isolation, per-tenant customization, and white-labeling without code branching chaos. We build SaaS architectures where adding a 100-seat enterprise account is a database row, not a deployment." },
      { title: "Enterprise Sales Requirements", body: "SSO/SAML, audit logs, admin dashboards, SOC2 documentation, and security questionnaire answers. We build what enterprise buyers check off during procurement." },
      { title: "Pricing Model Flexibility", body: "Seat-based, usage-based, feature-gated, annual vs. monthly. We implement billing infrastructure that can evolve with your go-to-market strategy without requiring a backend rewrite every time." },
    ],
    servicesUsed: [
      { slug: "web-development", icon: "ri-code-s-slash-line", title: "Web Development", relevance: "Multi-tenant platforms with role-based access and SSO" },
      { slug: "ui-ux-design", icon: "ri-palette-line", title: "UI/UX Design", relevance: "Complex B2B dashboards simplified into intuitive workflows" },
      { slug: "cloud-architecture", icon: "ri-cloud-line", title: "Cloud Architecture", relevance: "SOC2-ready infrastructure with tenant isolation" },
      { slug: "devops-cicd", icon: "ri-git-branch-line", title: "DevOps & CI/CD", relevance: "50+ deploys/day with feature flags and canary releases" },
    ],
    techStack: [
      { category: "Multi-tenancy", items: ["Row-Level Security", "Tenant Isolation", "Schema-per-tenant", "Shared DB"] },
      { category: "Auth & Identity", items: ["Auth0", "Okta", "SAML 2.0", "SCIM", "Supabase Auth"] },
      { category: "Billing", items: ["Stripe Billing", "Chargebee", "Usage Metering", "Lago"] },
      { category: "Integrations", items: ["Salesforce API", "HubSpot", "Zapier", "Webhooks", "REST APIs"] },
    ],
    caseStudies: [
      { title: "CloudSuite B2B Analytics", result: "0 to $2.8M ARR in 14 months post-launch", tags: ["React", "NestJS", "PostgreSQL"], image: "https://readdy.ai/api/search-image?query=B2B%20SaaS%20analytics%20dashboard%20dark%20interface%20on%20widescreen%20monitor%20showing%20business%20metrics%20charts%20and%20team%20management%20panels%2C%20professional%20software%20product%20screenshot%2C%20modern%20minimal%20enterprise%20software%20design&width=800&height=500&seq=ind_saas_cs1&orientation=landscape", slug: "finflow-dashboard" },
      { title: "WorkflowAI Platform", result: "SOC2 Type II achieved in 90 days, 150 enterprise clients", tags: ["Next.js", "Supabase", "OpenAI"], image: "https://readdy.ai/api/search-image?query=workflow%20automation%20SaaS%20platform%20interface%20showing%20process%20builder%20and%20integration%20settings%2C%20dark%20professional%20software%20dashboard%2C%20AI-powered%20workflow%20tool%20with%20modern%20clean%20design%20and%20green%20accents&width=800&height=500&seq=ind_saas_cs2&orientation=landscape", slug: "auraai-content-engine" },
    ],
    testimonial: { quote: "Users went from dreading our interface to actively recommending it. Net Promoter Score jumped 22 points in three months. Solutions' research process found problems we didn't know existed — and fixed them.", name: "Elise Fontaine", title: "Product Director", company: "CloudSuite B2B", avatar: "https://readdy.ai/api/search-image?query=professional%20headshot%20of%20female%20product%20director%2C%20warm%20studio%20lighting%2C%20friendly%20confident%20smile%2C%20business%20casual%2C%20clean%20neutral%20background%2C%20portrait%20photography&width=100&height=100&seq=ind_ava_elise&orientation=squarish" },
  },
  {
    slug: "logistics",
    name: "Logistics",
    icon: "ri-truck-line",
    headline: "Operations technology that keeps supply chains moving in any condition",
    description: "We build fleet management systems, supply chain visibility platforms, and last-mile delivery apps that work offline in dead zones and scale from 100 to 100,000 shipments/day. We've shipped software that runs 24/7/365 across 15 countries.",
    heroImage: "https://readdy.ai/api/search-image?query=logistics%20operations%20center%20with%20tracking%20screens%20showing%20global%20shipment%20maps%20and%20fleet%20management%20dashboards%2C%20professional%20warehouse%20and%20distribution%20center%20technology%2C%20multiple%20monitor%20wall%20with%20route%20optimization%20maps%20and%20delivery%20metrics&width=1440&height=600&seq=ind_log_hero&orientation=landscape",
    stats: [
      { value: "100k+", label: "Daily Shipments Tracked" },
      { value: "15", label: "Countries Deployed" },
      { value: "99.97%", label: "System Uptime" },
      { value: "Offline-first", label: "Architecture" },
    ],
    challenges: [
      { title: "Offline-First in Dead Zones", body: "Drivers lose connectivity in warehouses, tunnels, and rural areas. We build apps that queue operations locally, sync on reconnect, and handle conflicts gracefully — because your drivers can't wait for a signal." },
      { title: "Real-Time Tracking at Scale", body: "10,000 vehicles reporting GPS every 30 seconds. We architect event streams that ingest, process, and deliver tracking data to dashboards in under 500ms, without melting your database." },
      { title: "Complex Route Optimization", body: "Multi-stop routing with time windows, vehicle capacities, driver hours-of-service rules, and traffic conditions. We integrate third-party routing engines and build intuitive dispatch UIs around them." },
    ],
    servicesUsed: [
      { slug: "mobile-development", icon: "ri-smartphone-line", title: "Mobile Development", relevance: "Offline-first driver apps with GPS tracking and task management" },
      { slug: "web-development", icon: "ri-code-s-slash-line", title: "Web Development", relevance: "Real-time operations dashboards with live fleet tracking" },
      { slug: "cloud-architecture", icon: "ri-cloud-line", title: "Cloud Architecture", relevance: "Event-driven IoT data pipelines handling 10k+ GPS events/min" },
      { slug: "ai-ml-integration", icon: "ri-robot-line", title: "AI & ML", relevance: "ETA prediction, route optimization, demand forecasting" },
    ],
    techStack: [
      { category: "Mobile", items: ["React Native", "Expo", "WatermelonDB", "Background GPS"] },
      { category: "Real-Time", items: ["Kafka", "WebSockets", "Geospatial DB", "Redis Streams"] },
      { category: "Mapping", items: ["Google Maps Platform", "HERE API", "Mapbox", "OpenRouteService"] },
      { category: "Infrastructure", items: ["AWS IoT Core", "TimescaleDB", "PostGIS", "Kubernetes"] },
    ],
    caseStudies: [
      { title: "FleetPrime Driver App", result: "Paper to digital in 4 months, 40% ops cost reduction", tags: ["React Native", "MQTT", "PostgreSQL"], image: "https://readdy.ai/api/search-image?query=logistics%20fleet%20management%20app%20on%20tablet%20showing%20driver%20route%20map%20and%20delivery%20task%20list%2C%20dark%20interface%20with%20GPS%20tracking%20and%20delivery%20status%20indicators%2C%20professional%20product%20photography%20with%20logistics%20equipment%20in%20background&width=800&height=500&seq=ind_log_cs1&orientation=landscape", slug: "smarthome-connect" },
      { title: "SupplyVis Tracking Platform", result: "100k+ daily shipments, 500ms live update latency", tags: ["Kafka", "TimescaleDB", "React"], image: "https://readdy.ai/api/search-image?query=supply%20chain%20visibility%20dashboard%20showing%20global%20shipment%20tracking%20map%20with%20route%20paths%20and%20delivery%20status%2C%20professional%20dark%20operations%20center%20interface%20with%20animated%20data%20and%20logistics%20metrics%20on%20large%20screens&width=800&height=500&seq=ind_log_cs2&orientation=landscape", slug: "cloudsync-infrastructure" },
    ],
    testimonial: { quote: "Our field ops team went from paper forms to a slick offline-capable app in 4 months. Drivers now call it the best thing about working for us. We genuinely did not expect that kind of reaction to enterprise software.", name: "James Wu", title: "COO", company: "FleetPrime Logistics", avatar: "https://readdy.ai/api/search-image?query=professional%20headshot%20of%20East%20Asian%20male%20operations%20COO%20executive%2C%20warm%20studio%20lighting%2C%20confident%20smile%2C%20business%20casual%2C%20clean%20neutral%20background%2C%20portrait%20photography&width=100&height=100&seq=ind_ava_james&orientation=squarish" },
  },
  {
    slug: "enterprise",
    name: "Enterprise",
    icon: "ri-building-line",
    headline: "Digital transformation that actually transforms — not just consulting",
    description: "We partner with enterprise organizations to modernize legacy systems, migrate to cloud-native architectures, and build internal platforms that improve how thousands of employees work every day. No PowerPoint transformation roadmaps — we write the code.",
    heroImage: "https://readdy.ai/api/search-image?query=modern%20enterprise%20technology%20headquarters%20lobby%20with%20digital%20displays%20showing%20company%20dashboards%2C%20large%20open%20plan%20office%20with%20collaborative%20workspaces%20and%20screens%20showing%20operational%20data%2C%20professional%20corporate%20technology%20environment%2C%20architectural%20photography%20with%20warm%20lighting&width=1440&height=600&seq=ind_ent_hero&orientation=landscape",
    stats: [
      { value: "0 hrs", label: "Avg Migration Downtime" },
      { value: "$180k+", label: "Avg Annual Cloud Savings" },
      { value: "10+", label: "Enterprise Transformations" },
      { value: "SOC2 + ISO27001", label: "Compliance Delivered" },
    ],
    challenges: [
      { title: "Legacy Modernization Without Disruption", body: "Strangler fig patterns, blue/green deployments, and event-based decoupling let us migrate legacy systems incrementally — feature by feature, with zero big bang cutover risk." },
      { title: "Change Management at Scale", body: "Technology is the easy part. Getting 2,000 employees to adopt a new system is the hard part. We design for adoption — intuitive interfaces, in-app onboarding, and phased rollouts." },
      { title: "Procurement and Compliance Gauntlets", body: "Security questionnaires, architecture review boards, legal review, vendor assessments. We've been through enterprise procurement at Fortune 500 companies and know how to navigate it efficiently." },
    ],
    servicesUsed: [
      { slug: "cloud-architecture", icon: "ri-cloud-line", title: "Cloud Architecture", relevance: "Legacy-to-cloud migrations with zero-downtime cutovers" },
      { slug: "devops-cicd", icon: "ri-git-branch-line", title: "DevOps & CI/CD", relevance: "Monolith-to-microservices with CI/CD modernization" },
      { slug: "web-development", icon: "ri-code-s-slash-line", title: "Web Development", relevance: "Internal tools, portals, and data platforms for enterprise users" },
      { slug: "ui-ux-design", icon: "ri-palette-line", title: "UI/UX Design", relevance: "Enterprise design system overhauls that improve adoption" },
    ],
    techStack: [
      { category: "Migration", items: ["Strangler Fig Pattern", "Event Sourcing", "API Gateways", "CDC Tools"] },
      { category: "Enterprise Infra", items: ["Terraform Enterprise", "AWS Landing Zone", "Azure Arc"] },
      { category: "Observability", items: ["Datadog", "Splunk", "OpenTelemetry", "PagerDuty"] },
      { category: "Security", items: ["Zero Trust Network", "IAM", "PAM", "Vault Enterprise"] },
    ],
    caseStudies: [
      { title: "GlobalBank Core Migration", result: "3-year legacy system migrated, zero downtime, $180k/yr saved", tags: ["Terraform", "Kubernetes", "AWS"], image: "https://readdy.ai/api/search-image?query=enterprise%20technology%20transformation%20dashboard%20showing%20cloud%20migration%20progress%20and%20system%20health%20metrics%2C%20dark%20professional%20operations%20interface%2C%20infrastructure%20modernization%20visualization%20with%20charts%20and%20status%20indicators%2C%20corporate%20technology%20environment&width=800&height=500&seq=ind_ent_cs1&orientation=landscape", slug: "cloudsync-infrastructure" },
      { title: "RetailCorp Internal Platform", result: "8,000 employees onboarded, 60% reduction in IT tickets", tags: ["React", "NestJS", "Azure"], image: "https://readdy.ai/api/search-image?query=enterprise%20internal%20employee%20platform%20showing%20HR%20tools%20and%20business%20processes%20on%20modern%20dashboard%2C%20professional%20dark%20corporate%20software%20interface%2C%20internal%20tools%20platform%20with%20team%20collaboration%20features%20and%20metrics&width=800&height=500&seq=ind_ent_cs2&orientation=landscape", slug: "nexashop-platform" },
    ],
    testimonial: { quote: "The infrastructure migration had zero downtime. Not planned downtime — actual zero. For a financial platform processing $50M/day, that's the only acceptable outcome, and DevCraft delivered it exactly as promised.", name: "Diana Cole", title: "Infrastructure Director", company: "PayCore", avatar: "https://readdy.ai/api/search-image?query=professional%20headshot%20of%20female%20infrastructure%20director%2C%20warm%20studio%20lighting%2C%20confident%20smile%2C%20business%20formal%20attire%2C%20clean%20neutral%20background%2C%20portrait%20photography&width=100&height=100&seq=ind_ava_diana&orientation=squarish" },
  },
];

export function getIndustryBySlug(slug: string): IndustryDetail | undefined {
  return industries.find((i) => i.slug === slug);
}