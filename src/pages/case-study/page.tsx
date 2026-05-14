import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface CaseStudy {
  title: string;
  client: string;
  category: string;
  year: string;
  duration: string;
  team: string;
  author: string;
  authorRole: string;
  heroImage: string;
  overview: string;
  challenge: string;
  solution: string;
  techStack: { category: string; items: string[] }[];
  results: { label: string; value: string; icon: string }[];
  steps: { title: string; description: string }[];
  quote: { text: string; name: string; role: string; company: string };
  tags: string[];
  nextSlug: string;
  nextTitle: string;
}

const caseStudies: Record<string, CaseStudy> = {
  "trading-platform-2m-daily": {
    title: "Real-Time Trading Platform Processing $2M Daily",
    client: "FinanceFlow Inc.",
    category: "Web Dev",
    year: "2025",
    duration: "4 months",
    team: "6 engineers, 1 designer",
    author: "Yuki Tanaka",
    authorRole: "Principal Engineer",
    heroImage: "https://readdy.ai/api/search-image?query=dark%20cinematic%20financial%20trading%20platform%20UI%20on%20multiple%20monitors%20with%20real-time%20data%20charts%2C%20neon%20green%20accent%20lines%2C%20professional%20tech%20workspace%2C%20dramatic%20studio%20lighting%2C%20modern%20fintech%20dashboard&width=800&height=480&seq=blog_01&orientation=landscape",
    overview: "FinanceFlow Inc. came to us with a legacy PHP monolith that was falling apart under real-time market data pressure. The platform was crashing during peak hours, losing traders money and the company credibility. We rebuilt it from the ground up into a high-performance, real-time trading system that now handles $2M+ in daily transactions with 99.99% uptime.",
    challenge: "The existing PHP monolith couldn't maintain WebSocket connections under load, causing UI freezes during high-volatility market events — exactly when traders needed it most. The database was a single Postgres instance running on an underpowered server with no caching layer, resulting in 4–6 second query times for portfolio calculations. The deployment process required 2 hours of downtime weekly.",
    solution: "We adopted a microservices architecture with a dedicated real-time data service using Node.js and Socket.io, a separate portfolio calculation service with Redis caching, and a React frontend rebuilt for sub-100ms UI updates. We introduced event-driven architecture with a message queue to decouple order processing from UI updates. Database sharding and read replicas brought query times from 4 seconds to under 80ms.",
    techStack: [
      { category: "Frontend", items: ["React 19", "TypeScript", "TailwindCSS", "Recharts", "Socket.io-client"] },
      { category: "Backend", items: ["Node.js", "Socket.io", "PostgreSQL", "Redis", "RabbitMQ"] },
      { category: "Infrastructure", items: ["AWS EC2", "AWS ElastiCache", "AWS RDS", "CloudFront", "GitHub Actions"] },
    ],
    results: [
      { label: "Daily Transaction Volume", value: "$2M+", icon: "ri-money-dollar-circle-line" },
      { label: "Platform Uptime", value: "99.99%", icon: "ri-shield-check-line" },
      { label: "API Response Time", value: "< 80ms", icon: "ri-speed-up-line" },
      { label: "Deployment Downtime", value: "0 sec", icon: "ri-rocket-line" },
    ],
    steps: [
      { title: "Discovery & Architecture Design", description: "5-day intensive sprint mapping current system failure points, designing the new event-driven microservices architecture and data flow diagrams." },
      { title: "Real-Time Data Layer", description: "Built the WebSocket service with auto-reconnect, heartbeat monitoring, and graceful degradation so traders never see a broken state." },
      { title: "Portfolio Calculation Engine", description: "Rebuilt the math-heavy portfolio service in Node.js with Redis caching. 4-second queries became sub-80ms calculations." },
      { title: "React Frontend Rebuild", description: "New trading UI with virtualized order books, real-time price feeds, and optimistic UI updates for instant feedback on order placement." },
      { title: "Zero-Downtime Migration", description: "Used the strangler fig pattern to migrate live traffic progressively — 10% → 30% → 100% over two weeks with zero trader-facing downtime." },
    ],
    quote: {
      text: "Solutions delivered our entire trading platform in under 4 months. The code quality is exceptional — zero critical bugs in production after 8 months live. These engineers are the real deal.",
      name: "James Carter",
      role: "CTO",
      company: "FinanceFlow Inc.",
    },
    tags: ["React", "WebSocket", "PostgreSQL", "Redis", "Node.js", "AWS"],
    nextSlug: "scale-50k-concurrent-users",
    nextTitle: "Scaling to 50,000 Concurrent Users",
  },
  "scale-50k-concurrent-users": {
    title: "Scaling to 50,000 Concurrent Users Without a Single Minute of Downtime",
    client: "RetailMax",
    category: "Cloud",
    year: "2024",
    duration: "3 months",
    team: "4 engineers, 1 architect",
    author: "Anya Volkov",
    authorRole: "Cloud Infrastructure Lead",
    heroImage: "https://readdy.ai/api/search-image?query=server%20infrastructure%20data%20center%20with%20glowing%20rack%20servers%2C%20blue%20and%20green%20LED%20lights%2C%20dark%20environment%2C%20cloud%20computing%20architecture%20diagram%20overlay%2C%20professional%20tech%20photography&width=800&height=480&seq=blog_02&orientation=landscape",
    overview: "RetailMax, a mid-market e-commerce retailer, was losing $400k+ annually in revenue due to Black Friday infrastructure failures. Three consecutive years of major downtime during peak events had damaged customer trust and brand reputation. We rebuilt their entire cloud infrastructure for horizontal scalability, cutting infra costs by 60% while handling 50x their normal traffic load.",
    challenge: "The existing infrastructure was a single-region monolithic deployment on outdated AWS EC2 instances with no auto-scaling and a database that hit 100% CPU within minutes of traffic spikes. Deployments required manual intervention and had a 45-minute rollback time. Black Friday 2024 resulted in 11 hours of downtime and $620k in lost revenue.",
    solution: "We designed a multi-region AWS architecture using ECS Fargate for containerized workloads, Aurora Serverless for the database layer, and CloudFront as a global CDN edge. Auto-scaling policies were tuned with predictive scaling enabled 2 hours before known traffic peaks. Blue-green deployments replaced the dangerous manual process, reducing deployment risk to near zero.",
    techStack: [
      { category: "Cloud Services", items: ["AWS ECS Fargate", "Aurora Serverless", "CloudFront", "ElastiCache", "SQS"] },
      { category: "Infrastructure as Code", items: ["Terraform", "AWS CDK", "GitHub Actions", "AWS CodePipeline"] },
      { category: "Observability", items: ["Datadog", "AWS CloudWatch", "PagerDuty", "Grafana"] },
    ],
    results: [
      { label: "Peak Concurrent Users", value: "50,000", icon: "ri-team-line" },
      { label: "Infrastructure Cost Savings", value: "60%", icon: "ri-money-dollar-circle-line" },
      { label: "Black Friday Downtime", value: "0 sec", icon: "ri-shield-check-line" },
      { label: "Deployment Time", value: "4 min", icon: "ri-rocket-line" },
    ],
    steps: [
      { title: "Infrastructure Audit", description: "Comprehensive review of existing AWS setup, identifying 14 single points of failure and cost optimization opportunities." },
      { title: "Multi-Region Architecture Design", description: "Designed active-active setup across us-east-1 and us-west-2 with Route 53 latency-based routing and health check failover." },
      { title: "Container Migration", description: "Migrated 12 application services from EC2 to ECS Fargate, enabling per-service scaling and eliminating idle instance costs." },
      { title: "Database Layer Overhaul", description: "Migrated from RDS to Aurora Serverless with 5 read replicas and ElastiCache Redis for session and catalog caching." },
      { title: "Load Testing & Game Day", description: "Ran simulated 100k-user load tests across 3 weeks, tuned auto-scaling triggers, and ran a full game day rehearsal before Black Friday." },
    ],
    quote: {
      text: "The platform Solutions built handled Black Friday without a single second of downtime — 50,000 concurrent users and our site didn't even flinch. Their infrastructure work saved us six figures annually.",
      name: "Robert Klein",
      role: "VP of Engineering",
      company: "RetailMax",
    },
    tags: ["AWS", "Kubernetes", "Terraform", "CloudFront", "Datadog"],
    nextSlug: "react-native-rebuild-cut-crashes-92",
    nextTitle: "The React Native Rebuild That Cut Crashes by 92%",
  },
  "react-native-rebuild-cut-crashes-92": {
    title: "The React Native Rebuild That Cut App Crashes by 92%",
    client: "MediSynth",
    category: "Mobile",
    year: "2025",
    duration: "10 weeks",
    team: "3 engineers, 1 designer",
    author: "Kai Nakamura",
    authorRole: "Mobile Engineering Lead",
    heroImage: "https://readdy.ai/api/search-image?query=mobile%20app%20development%20on%20smartphone%20mockup%2C%20healthcare%20application%20dark%20theme%20interface%2C%20code%20editor%20on%20dual%20monitor%20setup%20in%20background%2C%20professional%20developer%20workspace%2C%20warm%20ambient%20lighting&width=800&height=480&seq=blog_03&orientation=landscape",
    overview: "MediSynth's healthcare app was in crisis — 15% of sessions ended in a crash, App Store rating had fallen to 2.8, and the company was haemorrhaging users at an alarming rate. The original build was a rushed React Native project with no error boundaries, poor state management, and a memory leak that compounded over time. We rebuilt it entirely in 10 weeks.",
    challenge: "The original app had been built in 6 weeks by a team of two junior developers who had never shipped a React Native app before. Critical issues: no error boundaries anywhere in the app, unmanaged async state updates causing null pointer crashes, a memory leak from unsubscribed Firebase listeners, and a navigation stack that grew indefinitely without cleanup.",
    solution: "Complete rebuild using React Native 0.74 with TypeScript strict mode, Zustand for state management, and a comprehensive error boundary strategy. Every async operation was wrapped in try/catch with graceful degradation. Firebase listeners were systematically managed with cleanup functions. Sentry was integrated for crash reporting with full symbolication. The new architecture prevented the entire class of bugs that had been causing crashes.",
    techStack: [
      { category: "Mobile", items: ["React Native 0.74", "TypeScript", "Expo SDK 51", "React Navigation 7"] },
      { category: "State & Data", items: ["Zustand", "React Query", "Firebase SDK", "AsyncStorage"] },
      { category: "Quality & Monitoring", items: ["Sentry", "Jest", "Detox E2E", "TestFlight", "Firebase Crashlytics"] },
    ],
    results: [
      { label: "Crash Rate Reduction", value: "92%", icon: "ri-bug-line" },
      { label: "App Store Rating", value: "4.9 ★", icon: "ri-star-fill" },
      { label: "Session Retention (Day 1)", value: "+120%", icon: "ri-user-follow-line" },
      { label: "Delivery Time", value: "10 wks", icon: "ri-calendar-check-line" },
    ],
    steps: [
      { title: "Crash Analysis & Triage", description: "Spent the first 3 days analysing 10,000+ Crashlytics reports, categorising crash types, and identifying the root causes." },
      { title: "Architecture Blueprint", description: "Designed the new app architecture with error boundaries at every navigation level, typed API contracts, and predictable state flows." },
      { title: "Core Rebuild (Weeks 2–7)", description: "Rebuilt all screens in parallel across two engineer streams, with daily integration syncs to prevent merge conflicts." },
      { title: "QA & Load Testing", description: "3,000+ automated test cases via Jest and Detox E2E. Tested on 40+ physical device configurations via BrowserStack." },
      { title: "Phased Store Rollout", description: "Rolled out to 5% → 25% → 100% of users via Firebase Remote Config, monitoring crash rate at each threshold before proceeding." },
    ],
    quote: {
      text: "They rebuilt our entire healthcare app from scratch in 10 weeks. Our crash rate dropped from 15% to 0.2% and our App Store rating jumped from 2.8 to 4.9. Absolutely transformed our product.",
      name: "Priya Sharma",
      role: "Founder & CEO",
      company: "MediSynth",
    },
    tags: ["React Native", "TypeScript", "Firebase", "Sentry", "Zustand"],
    nextSlug: "ai-content-engine-langchain-gpt4",
    nextTitle: "Building an AI Content Engine with LangChain and GPT-4",
  },
  "ai-content-engine-langchain-gpt4": {
    title: "Building an AI Content Engine That Generates 10,000+ Pieces Monthly",
    client: "AuraAI",
    category: "AI/ML",
    year: "2025",
    duration: "6 months",
    team: "5 engineers, 1 ML researcher",
    author: "Dr. Nadia Hassan",
    authorRole: "AI/ML Lead",
    heroImage: "https://readdy.ai/api/search-image?query=artificial%20intelligence%20neural%20network%20visualization%2C%20glowing%20green%20nodes%20and%20connections%20on%20dark%20background%2C%20machine%20learning%20concept%20art%2C%20futuristic%20AI%20technology%20interface%2C%20cinematic%20lighting%2C%20abstract%20digital%20art&width=800&height=480&seq=blog_04&orientation=landscape",
    overview: "AuraAI needed to scale their content marketing offering from 500 manually-written pieces per month to 10,000+ without sacrificing brand voice consistency. The solution was a custom AI content pipeline using LangChain orchestration, GPT-4 fine-tuning, and a sophisticated RAG system for brand-specific context injection — generating human-quality content across 14 languages.",
    challenge: "Generic LLM output consistently failed brand voice tests. Early experiments with vanilla GPT-4 prompting produced content that was factually acceptable but tonally wrong — too formal, too generic, or inconsistent across different content types. The system also needed to handle 14 languages with equivalent quality, enforce brand guidelines programmatically, and integrate into existing CMS workflows without friction.",
    solution: "We built a multi-stage LangChain pipeline: a brand voice analyser that extracted style patterns from historical approved content, a RAG system using Pinecone to inject brand-specific context, a fine-tuned GPT-4 model for each of 6 content categories, and a quality scoring model that automatically rejected sub-threshold output. The entire system was wrapped in a FastAPI service with async processing.",
    techStack: [
      { category: "AI & ML", items: ["OpenAI GPT-4", "LangChain", "HuggingFace", "Pinecone", "Weights & Biases"] },
      { category: "Backend", items: ["Python 3.12", "FastAPI", "Celery", "Redis", "PostgreSQL"] },
      { category: "Infrastructure", items: ["AWS Lambda", "SQS", "S3", "Docker", "GitHub Actions"] },
    ],
    results: [
      { label: "Monthly Content Volume", value: "10,000+", icon: "ri-article-line" },
      { label: "Languages Supported", value: "14", icon: "ri-translate-2" },
      { label: "Content Production Cost", value: "−85%", icon: "ri-money-dollar-circle-line" },
      { label: "Brand Voice Accuracy", value: "96%", icon: "ri-award-line" },
    ],
    steps: [
      { title: "Brand Voice Extraction", description: "Analysed 5,000+ approved pieces of existing content to extract tone, sentence structure, vocabulary patterns, and brand-specific terminology." },
      { title: "RAG Knowledge Base", description: "Built a Pinecone vector store containing brand guidelines, tone-of-voice documents, product facts, and competitor exclusions for context injection." },
      { title: "Fine-Tuning Pipeline", description: "Fine-tuned separate GPT-4 models for blog posts, social media, product descriptions, email, ad copy, and long-form articles using curated training sets." },
      { title: "Quality Scoring System", description: "Trained a classifier to score content across 8 brand dimensions. Content below 0.8 threshold is automatically regenerated with adjusted parameters." },
      { title: "CMS Integration", description: "Built connectors for WordPress, Contentful, and HubSpot so generated content flows directly into editorial workflows without copy-paste friction." },
    ],
    quote: {
      text: "Solutions built us an AI content engine we didn't believe was possible. 10,000 pieces a month that actually sound like us — across 14 languages. Our content team now focuses on strategy instead of production.",
      name: "Elena Vasquez",
      role: "CMO",
      company: "AuraAI",
    },
    tags: ["LangChain", "OpenAI", "Python", "FastAPI", "Pinecone"],
    nextSlug: "zero-downtime-monolith-to-microservices",
    nextTitle: "Zero-Downtime Monolith to Microservices Migration",
  },
  "zero-downtime-monolith-to-microservices": {
    title: "Zero-Downtime Migration: Moving a 6-Year Monolith to Microservices",
    client: "LogiChain",
    category: "DevOps",
    year: "2024",
    duration: "8 months",
    team: "7 engineers, 2 DevOps",
    author: "Anya Volkov",
    authorRole: "Cloud Infrastructure Lead",
    heroImage: "https://readdy.ai/api/search-image?query=containerization%20microservices%20architecture%20diagram%20visualization%2C%20dark%20background%20with%20interconnected%20service%20nodes%20and%20network%20topology%2C%20DevOps%20infrastructure%20concept%2C%20professional%20tech%20illustration%20with%20green%20circuit%20lines&width=800&height=480&seq=blog_05&orientation=landscape",
    overview: "LogiChain's 6-year-old Rails monolith had become a deployment liability — a single bug fix required a 2-hour full-system deployment that touched all 180,000 lines of code. We executed a zero-downtime migration to a containerized microservices architecture over 8 months using the strangler fig pattern, ending with a modern system where any service deploys independently in under 4 minutes.",
    challenge: "The monolith had 180,000 lines of tightly coupled Ruby, 0% test coverage for critical payment flows, deployment to production taking 2+ hours and frequently failing mid-deploy, 6 database tables with circular foreign key relationships that blocked any attempt at service extraction, and a team of 12 engineers who couldn't move fast because every change risked breaking everything.",
    solution: "The strangler fig pattern allowed us to introduce new microservices alongside the monolith, gradually intercepting routes rather than cutting over all at once. We started with the most independently deployable domain — the notification service — to prove the pattern and build team confidence. Critical payment flows got comprehensive test coverage before being extracted. Istio service mesh provided traffic management, observability, and graceful degradation between services.",
    techStack: [
      { category: "Services & Runtime", items: ["Docker", "Kubernetes", "Istio Service Mesh", "Node.js", "Go"] },
      { category: "CI/CD", items: ["GitHub Actions", "ArgoCD", "Helm Charts", "Semantic Release"] },
      { category: "Observability", items: ["Datadog APM", "Jaeger Tracing", "Prometheus", "Grafana", "PagerDuty"] },
    ],
    results: [
      { label: "Migration Downtime", value: "0 sec", icon: "ri-shield-check-line" },
      { label: "Deployment Time", value: "4 min", icon: "ri-rocket-line" },
      { label: "Services Extracted", value: "18", icon: "ri-git-branch-line" },
      { label: "Team Deploy Frequency", value: "12× /day", icon: "ri-loop-right-line" },
    ],
    steps: [
      { title: "Domain Mapping & Dependency Graph", description: "Mapped all 180k lines into 18 bounded contexts, identified coupling points, and ranked domains by extraction complexity." },
      { title: "Test Coverage Sprint", description: "Before touching any domain, wrote comprehensive integration tests for the critical payment and order management flows." },
      { title: "First Extraction: Notifications", description: "Extracted the notification service as our proof of concept, validating the pattern, tooling, and team workflow before tackling harder domains." },
      { title: "Service Mesh Implementation", description: "Deployed Istio to manage service-to-service traffic, enable circuit breaking, and provide distributed tracing across the hybrid monolith/microservices state." },
      { title: "Progressive Traffic Migration", description: "Used Istio traffic weights to gradually shift load from monolith routes to extracted services — 5% → 25% → 50% → 100% with automated rollback triggers." },
    ],
    quote: {
      text: "Our IoT dashboard processes 10M events a day and the deployment process went from a 2-hour nightmare to 4 minutes. DevCraft's architecture is rock-solid and the documentation is the best I have ever seen.",
      name: "Marcus Lee",
      role: "Co-Founder",
      company: "LogiChain",
    },
    tags: ["Docker", "Kubernetes", "GitHub Actions", "Datadog", "Istio"],
    nextSlug: "zero-to-app-store-90-days",
    nextTitle: "From 0 to App Store in 90 Days",
  },
  "zero-to-app-store-90-days": {
    title: "From Zero to App Store in 90 Days: The EduBridge Story",
    client: "EduBridge",
    category: "Mobile",
    year: "2025",
    duration: "90 days",
    team: "3 engineers, 1 designer",
    author: "Kai Nakamura",
    authorRole: "Mobile Engineering Lead",
    heroImage: "https://readdy.ai/api/search-image?query=mobile%20app%20launch%20on%20smartphone%20screens%2C%20iOS%20and%20Android%20mockups%20on%20dark%20background%2C%20startup%20product%20development%20workspace%2C%20professional%20product%20photography%20with%20ambient%20glow%2C%20modern%20mobile%20UI%20showcase&width=800&height=480&seq=blog_06&orientation=landscape",
    overview: "EduBridge's founders came to us with a compelling EdTech concept, no technical co-founder, and $180k in pre-seed funding. They needed to ship a cross-platform mobile app to both iOS and Android stores in 90 days to hit their investor milestone. We delivered — on day 87. The app onboarded 12,000 users in its first month and directly contributed to a $250k seed round raise.",
    challenge: "Non-technical founders with a tight budget meant every architectural decision had to balance capability with maintainability — they needed to be able to hire a junior developer to maintain the codebase post-launch. The 90-day constraint ruled out any bespoke backend work. App store review processes for healthcare-adjacent EdTech apps notoriously take 5–14 days, meaning first submission had to pass on attempt one.",
    solution: "Flutter for cross-platform development gave us a single codebase for both iOS and Android with native performance. Firebase provided backend services (auth, Firestore, Storage, Analytics) without the need to build and maintain a custom backend. We pre-submitted the app privacy policy, age rating, and content descriptions to both stores 3 weeks early, and engaged in a pre-review conversation with Apple's App Review team to flag edge cases.",
    techStack: [
      { category: "Mobile", items: ["Flutter 3.22", "Dart 3.4", "Riverpod", "go_router"] },
      { category: "Backend & Services", items: ["Firebase Auth", "Cloud Firestore", "Firebase Storage", "Cloud Functions"] },
      { category: "Tooling & Launch", items: ["Fastlane", "GitHub Actions", "TestFlight", "Firebase App Distribution"] },
    ],
    results: [
      { label: "Time to Both Stores", value: "87 days", icon: "ri-calendar-check-line" },
      { label: "Month-1 User Signups", value: "12,000", icon: "ri-user-add-line" },
      { label: "App Store Rating", value: "4.8 ★", icon: "ri-star-fill" },
      { label: "Seed Round Raised", value: "$250k", icon: "ri-money-dollar-circle-line" },
    ],
    steps: [
      { title: "1-Week Design Sprint", description: "Running design and architecture in parallel: 3 rounds of Figma prototyping with founders, locking the feature set to an MVF (minimum viable feature) list." },
      { title: "Firebase Architecture", description: "Designed the Firestore data model and Firebase Security Rules to be extensible — structured so a future backend migration wouldn't require app updates." },
      { title: "Flutter Development (Weeks 2–10)", description: "8 weeks of focused development with daily builds pushed to TestFlight and Firebase App Distribution for founder review and feedback." },
      { title: "App Store Pre-Submission Work", description: "Privacy policy, screenshots, age rating, App Privacy declarations, and review notes prepared 3 weeks before code completion to eliminate review surprises." },
      { title: "Launch & Growth Instrumentation", description: "Integrated Firebase Analytics, Crashlytics, and in-app referral tracking before launch day so the team had full visibility from day one." },
    ],
    quote: {
      text: "DevCraft turned our vague idea into a polished, market-ready product in 90 days. They thought about things we never would have — like pre-engaging with App Store review. Day 87 we were live on both stores.",
      name: "Aiyana Torres",
      role: "CEO",
      company: "EduBridge",
    },
    tags: ["Flutter", "Firebase", "Dart", "Fastlane", "CI/CD"],
    nextSlug: "trading-platform-2m-daily",
    nextTitle: "Real-Time Trading Platform Processing $2M Daily",
  },
};

export default function CaseStudyPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const study = slug ? caseStudies[slug] : null;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [slug]);

  if (!study) {
    return (
      <div className="bg-[#0b0a08] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/40 text-lg mb-4">Case study not found.</p>
          <button onClick={() => navigate("/blog")} className="text-accent hover:underline cursor-pointer">
            Back to Blog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0b0a08] min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-[#0b0a08]/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-20 flex items-center justify-between">
          <button
            onClick={() => navigate("/blog")}
            className="flex items-center gap-2 text-white/50 hover:text-white transition-colors duration-200 cursor-pointer whitespace-nowrap"
          >
            <i className="ri-arrow-left-line"></i>
            <span className="text-sm font-medium">All Case Studies</span>
          </button>
          <a href="/" onClick={(e) => { e.preventDefault(); navigate("/"); }} className="flex items-center gap-2 cursor-pointer">
            <img
              src="https://static.readdy.ai/image/27f36426f3cab7c4efebb6eb9e24cb04/3338f66b55262222ff9be144548b1ced.png"
              alt="Solutions Studio"
              className="h-9 w-auto object-contain"
            />
            <span className="text-white font-bold text-lg hidden sm:block">
              Solutions<span className="text-accent">.</span>
            </span>
          </a>
          <button
            onClick={() => navigate("/")}
            className="hidden sm:flex items-center gap-2 bg-accent text-black text-sm font-bold px-5 py-2.5 rounded-full whitespace-nowrap hover:bg-white transition-colors duration-300 cursor-pointer"
          >
            Start a Project
            <i className="ri-arrow-right-line"></i>
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-0">
        <div className="max-w-7xl mx-auto px-6 md:px-10 pt-10 pb-12">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="bg-accent text-black text-xs font-bold px-3 py-1 rounded-full">{study.category}</span>
              <span className="text-white/30 text-xs font-mono">{study.year}</span>
              <span className="text-white/15 text-xs">·</span>
              <span className="text-white/30 text-xs">{study.duration}</span>
              <span className="text-white/15 text-xs">·</span>
              <span className="text-white/30 text-xs">{study.team}</span>
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-4xl mb-6">
              {study.title}
            </h1>
            <p className="text-white/40 text-lg max-w-2xl leading-relaxed">{study.overview}</p>
          </motion.div>
        </div>

        {/* Hero Image */}
        <motion.div
          className="max-w-7xl mx-auto px-6 md:px-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className="w-full h-64 md:h-[480px] rounded-2xl overflow-hidden border border-white/5">
            <img src={study.heroImage} alt={study.title} className="w-full h-full object-cover object-top" />
          </div>
        </motion.div>
      </section>

      {/* Results Strip */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-12">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {study.results.map((result, i) => (
            <motion.div
              key={result.label}
              className="bg-[#161310] border border-white/5 rounded-2xl p-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-accent/10 mx-auto mb-3">
                <i className={`${result.icon} text-accent text-base`}></i>
              </div>
              <p className="text-accent font-bold text-2xl md:text-3xl mb-1">{result.value}</p>
              <p className="text-white/35 text-xs">{result.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">
          {/* Left column — Challenge & Solution */}
          <div className="lg:col-span-2 flex flex-col gap-12">
            {/* Challenge */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-500/10 border border-red-500/20">
                  <i className="ri-error-warning-line text-red-400 text-sm"></i>
                </div>
                <h2 className="text-white font-bold text-2xl">The Challenge</h2>
              </div>
              <p className="text-white/50 text-base leading-relaxed">{study.challenge}</p>
            </motion.div>

            {/* Solution */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-accent/10 border border-accent/20">
                  <i className="ri-lightbulb-flash-line text-accent text-sm"></i>
                </div>
                <h2 className="text-white font-bold text-2xl">Our Solution</h2>
              </div>
              <p className="text-white/50 text-base leading-relaxed">{study.solution}</p>
            </motion.div>

            {/* Steps */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-white font-bold text-2xl mb-6">How We Did It</h2>
              <div className="flex flex-col gap-4">
                {study.steps.map((step, i) => (
                  <motion.div
                    key={i}
                    className="flex gap-5"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-9 h-9 flex items-center justify-center rounded-full bg-accent/10 border border-accent/25 shrink-0">
                        <span className="text-accent text-xs font-bold font-mono">{String(i + 1).padStart(2, "0")}</span>
                      </div>
                      {i < study.steps.length - 1 && (
                        <div className="w-px flex-1 bg-white/5 mt-2 mb-0 min-h-4" />
                      )}
                    </div>
                    <div className="pb-6">
                      <h3 className="text-white font-semibold text-base mb-1.5">{step.title}</h3>
                      <p className="text-white/40 text-sm leading-relaxed">{step.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Quote */}
            <motion.blockquote
              className="bg-[#1e1a14] border-l-2 border-accent rounded-r-2xl p-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-white/75 text-lg leading-relaxed italic mb-6">&ldquo;{study.quote.text}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <i className="ri-user-line text-accent text-base"></i>
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{study.quote.name}</p>
                  <p className="text-white/35 text-xs">{study.quote.role} · {study.quote.company}</p>
                </div>
              </div>
            </motion.blockquote>
          </div>

          {/* Right sidebar */}
          <div className="flex flex-col gap-6">
            {/* Client Info */}
            <motion.div
              className="bg-[#161310] border border-white/5 rounded-2xl p-6"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-white/25 text-xs font-mono mb-4 tracking-widest">PROJECT INFO</p>
              <div className="flex flex-col gap-4">
                {[
                  { label: "Client", value: study.client },
                  { label: "Duration", value: study.duration },
                  { label: "Team Size", value: study.team },
                  { label: "Delivered", value: study.year },
                  { label: "Written by", value: `${study.author} — ${study.authorRole}` },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="text-white/30 text-xs mb-0.5">{item.label}</p>
                    <p className="text-white text-sm font-medium">{item.value}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Tech Stack */}
            <motion.div
              className="bg-[#161310] border border-white/5 rounded-2xl p-6"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <p className="text-white/25 text-xs font-mono mb-5 tracking-widest">TECH STACK</p>
              <div className="flex flex-col gap-5">
                {study.techStack.map((group) => (
                  <div key={group.category}>
                    <p className="text-white/40 text-xs mb-2">{group.category}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {group.items.map((item) => (
                        <span key={item} className="text-xs font-mono text-accent/70 bg-accent/8 border border-accent/12 px-2.5 py-1 rounded-lg">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div
              className="bg-accent/8 border border-accent/20 rounded-2xl p-6 text-center"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <p className="text-white font-semibold mb-2">Like what you see?</p>
              <p className="text-white/35 text-xs mb-4 leading-relaxed">
                Let&apos;s talk about what we can build for you.
              </p>
              <button
                onClick={() => navigate("/#contact")}
                className="w-full flex items-center justify-center gap-2 bg-accent text-black font-bold py-3 rounded-xl hover:bg-white transition-colors duration-300 cursor-pointer whitespace-nowrap text-sm"
              >
                Start Your Project
                <i className="ri-arrow-right-line"></i>
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Next Case Study */}
      <section className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-white/25 text-xs font-mono mb-1">NEXT CASE STUDY</p>
              <p className="text-white font-semibold text-lg">{study.nextTitle}</p>
            </div>
            <button
              onClick={() => navigate(`/case-study/${study.nextSlug}`)}
              className="flex items-center gap-2 bg-[#161310] border border-white/10 text-white font-medium px-6 py-3 rounded-full hover:border-accent hover:text-accent transition-colors duration-300 cursor-pointer whitespace-nowrap text-sm"
            >
              Read Next <i className="ri-arrow-right-line"></i>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}