import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ApplicationModal from "./components/ApplicationModal";

const openRoles = [
  {
    id: 1,
    title: "Senior Full-Stack Engineer",
    department: "Engineering",
    location: "Remote (US/EU)",
    type: "Full-time",
    level: "Senior",
    salary: "$140k – $190k",
    description:
      "Own end-to-end features across complex client projects. You'll architect, build, and ship production code used by millions daily. Strong React, Node.js, and PostgreSQL chops required.",
    requirements: [
      "5+ years professional experience",
      "Deep expertise in React 18+ and TypeScript",
      "Strong Node.js / REST / GraphQL API design",
      "Experience with PostgreSQL and Redis",
      "Cloud deployment (AWS/GCP) experience",
    ],
    niceToHave: [
      "Experience with WebSockets and real-time systems",
      "Kubernetes / Docker production experience",
      "Open-source contributions",
    ],
    tags: ["React", "Node.js", "TypeScript", "PostgreSQL", "AWS"],
  },
  {
    id: 2,
    title: "React Native Mobile Engineer",
    department: "Mobile",
    location: "Remote (Global)",
    type: "Full-time",
    level: "Mid–Senior",
    salary: "$120k – $160k",
    description:
      "Build delightful, high-performance mobile apps from scratch for clients across healthcare, fintech, and consumer verticals. You obsess over native feel and animation quality.",
    requirements: [
      "3+ years with React Native in production",
      "Strong TypeScript skills",
      "Experience with Expo and bare workflow",
      "Familiarity with iOS and Android native modules",
      "Proficiency with animations (Reanimated v3)",
    ],
    niceToHave: [
      "Native iOS (Swift) or Android (Kotlin) experience",
      "App performance profiling and optimization",
      "App Store / Play Store deployment experience",
    ],
    tags: ["React Native", "TypeScript", "Expo", "iOS", "Android"],
  },
  {
    id: 3,
    title: "Cloud & DevOps Engineer",
    department: "Infrastructure",
    location: "Remote (US/EU)",
    type: "Full-time",
    level: "Senior",
    salary: "$130k – $175k",
    description:
      "Design and manage multi-cloud, auto-scaling infrastructure for high-traffic client systems. You'll define CI/CD pipelines, cost structures, and SLAs across 30+ active projects.",
    requirements: [
      "4+ years in cloud infrastructure roles",
      "AWS Solutions Architect Pro or equivalent",
      "Terraform IaC expertise",
      "Kubernetes (EKS/GKE) at scale",
      "GitOps / GitHub Actions / ArgoCD",
    ],
    niceToHave: [
      "Multi-cloud experience (AWS + GCP)",
      "Cost optimization and FinOps exposure",
      "Security hardening (SOC2, ISO27001)",
    ],
    tags: ["AWS", "Terraform", "Kubernetes", "Docker", "CI/CD"],
  },
  {
    id: 4,
    title: "AI / ML Engineer",
    department: "AI Labs",
    location: "Remote (US/EU/APAC)",
    type: "Full-time",
    level: "Senior",
    salary: "$150k – $200k",
    description:
      "Build LLM-powered products, RAG pipelines, and custom ML models for enterprise clients. You'll push the boundaries of what's possible with AI in production environments.",
    requirements: [
      "3+ years in ML engineering or applied AI",
      "Strong Python, PyTorch, and FastAPI",
      "Experience with LangChain, LlamaIndex, or similar",
      "LLM fine-tuning and evaluation pipelines",
      "Vector databases (Pinecone, Weaviate, pgvector)",
    ],
    niceToHave: [
      "Published research or patents",
      "Experience with Hugging Face model hub",
      "MLOps / model monitoring at scale",
    ],
    tags: ["Python", "LangChain", "GPT-4", "PyTorch", "FastAPI"],
  },
  {
    id: 5,
    title: "Product Designer (UI/UX)",
    department: "Design",
    location: "Remote (US/EU)",
    type: "Full-time",
    level: "Senior",
    salary: "$110k – $150k",
    description:
      "Lead design for 3–4 active client projects at any time — from discovery workshops to polished design systems. You speak fluently in both user empathy and developer handoff.",
    requirements: [
      "5+ years in product design roles",
      "Expert Figma skills (variables, auto layout, components)",
      "Experience building and maintaining design systems",
      "Strong user research and usability testing background",
      "Motion design and micro-interaction experience",
    ],
    niceToHave: [
      "Basic React / CSS ability to prototype in code",
      "Experience designing AI-powered products",
      "Design tokens and multi-brand theming",
    ],
    tags: ["Figma", "Design Systems", "UX Research", "Prototyping", "Motion"],
  },
  {
    id: 6,
    title: "Technical Project Manager",
    department: "Operations",
    location: "Remote (US/EU)",
    type: "Full-time",
    level: "Senior",
    salary: "$100k – $135k",
    description:
      "Own client relationships and delivery for 4–6 concurrent projects. You're the connective tissue between engineers and clients — technically fluent, but client-obsessed.",
    requirements: [
      "3+ years in technical PM / delivery manager roles",
      "Agile/Scrum certification or equivalent experience",
      "Proven track record managing $500k+ engagements",
      "Strong written and verbal communication",
      "Experience with Jira, Linear, or equivalent tools",
    ],
    niceToHave: [
      "Background in software development",
      "PMP or equivalent formal certification",
      "Experience at a software agency",
    ],
    tags: ["Agile", "Scrum", "Client Management", "Linear", "Delivery"],
  },
];

const departments = ["All", "Engineering", "Mobile", "Infrastructure", "AI Labs", "Design", "Operations"];

const perks = [
  { icon: "ri-global-line", title: "100% Remote", description: "Work from anywhere in the world. We have teammates across 28 countries and counting." },
  { icon: "ri-money-dollar-circle-line", title: "Top-Tier Pay", description: "Salaries benchmarked to top 15% globally. We pay for excellence, not geography." },
  { icon: "ri-rocket-line", title: "Work That Ships", description: "Real products, real clients, real impact. No mock projects or endless internal tools." },
  { icon: "ri-book-open-line", title: "$3,000 / Year L&D", description: "Annual budget for courses, conferences, certifications, and books. No questions asked." },
  { icon: "ri-heart-pulse-line", title: "Full Health Coverage", description: "Medical, dental, and vision — fully covered for you and your family, globally." },
  { icon: "ri-time-line", title: "Async-First Culture", description: "Deep work over meetings. We overlap ~3 hours/day for collaboration, rest is yours." },
  { icon: "ri-medal-line", title: "Equity & Profit Share", description: "Senior roles include equity. Bi-annual performance bonuses tied to company growth." },
  { icon: "ri-macbook-line", title: "Full Home Office Setup", description: "$2,500 equipment budget plus annual $600 upgrade stipend. Best tools, always." },
];

const values = [
  { number: "01", title: "Craft Over Speed", body: "We move fast, but we don't cut corners. Quality is the constant — timelines bend around it, not the other way around." },
  { number: "02", title: "Radical Transparency", body: "We say what we think — to clients, to each other, to leadership. No politics, no passive-aggression, no back-channels." },
  { number: "03", title: "Ownership Mentality", body: "If you see something broken, you fix it. We don't wait for permission. Every team member is empowered to act." },
  { number: "04", title: "Deep Before Wide", body: "We hire specialists, not generalists. We'd rather have one genuinely world-class engineer than three average ones." },
];

export default function CareersPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [expandedRole, setExpandedRole] = useState<number | null>(null);
  const [applyRole, setApplyRole] = useState<string | null>(null);
  const navigate = useNavigate();

  const filtered = activeFilter === "All" ? openRoles : openRoles.filter((r) => r.department === activeFilter);

  return (
    <div className="bg-[#080d1a] min-h-screen">
      {applyRole && <ApplicationModal roleTitle={applyRole} onClose={() => setApplyRole(null)} />}
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-[#080d1a]/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-20 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-white/50 hover:text-white transition-colors duration-200 cursor-pointer whitespace-nowrap"
          >
            <i className="ri-arrow-left-line text-base"></i>
            <span className="text-sm font-medium">Back to Home</span>
          </button>
          <a href="/" className="flex items-center gap-2 cursor-pointer">
            <img
              src="https://static.readdy.ai/image/27f36426f3cab7c4efebb6eb9e24cb04/3338f66b55262222ff9be144548b1ced.png"
              alt="Solutions Studio"
              className="h-9 w-auto object-contain"
            />
            <span className="text-white font-bold text-lg hidden sm:block">
              Solutions<span className="text-[#a3e635]">.</span>
            </span>
          </a>
          <button
            onClick={() => navigate("/#contact")}
            className="hidden sm:flex items-center gap-2 bg-[#a3e635] text-black text-sm font-bold px-5 py-2.5 rounded-full whitespace-nowrap hover:bg-white transition-colors duration-300 cursor-pointer"
          >
            Get in Touch
            <i className="ri-arrow-right-line"></i>
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-36 pb-20 px-6 md:px-10 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://readdy.ai/api/search-image?query=modern%20tech%20startup%20office%20with%20warm%20golden%20amber%20lighting%20wide%20open%20floor%20plan%20developers%20working%20at%20sleek%20desks%20large%20floor%20to%20ceiling%20windows%20lush%20indoor%20plants%20collaborative%20whiteboard%20walls%20minimalist%20industrial%20aesthetic%20professional%20creative%20studio%20environment%20vibrant%20yet%20calm%20atmosphere&width=1440&height=700&seq=careers_hero_v2&orientation=landscape"
            alt="Solutions Studio office culture"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#080d1a]/75 via-[#080d1a]/65 to-[#080d1a]"></div>
        </div>
        <div className="relative max-w-7xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <p className="text-[#a3e635] text-xs font-mono tracking-widest mb-5">WE&apos;RE HIRING</p>
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-[0.95] mb-6">
              Build the future.<br />
              <span className="text-[#a3e635]">With us.</span>
            </h1>
            <p className="text-white/50 text-lg leading-relaxed max-w-xl mb-10">
              Join a team of 60+ world-class engineers, designers, and strategists building products that millions of people use. Async-first, top-of-market pay, work that actually ships.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#open-roles"
                onClick={(e) => { e.preventDefault(); document.getElementById("open-roles")?.scrollIntoView({ behavior: "smooth" }); }}
                className="inline-flex items-center gap-2 bg-[#a3e635] text-black font-bold px-7 py-4 rounded-full hover:bg-white transition-colors duration-300 cursor-pointer whitespace-nowrap"
              >
                Work With Us
                <i className="ri-team-line"></i>
              </a>
              <a
                href="#open-roles"
                onClick={(e) => { e.preventDefault(); document.getElementById("open-roles")?.scrollIntoView({ behavior: "smooth" }); }}
                className="inline-flex items-center gap-2 border border-white/20 text-white font-medium px-7 py-4 rounded-full hover:border-[#a3e635] hover:text-[#a3e635] transition-colors duration-300 cursor-pointer whitespace-nowrap"
              >
                See Open Roles
                <i className="ri-arrow-down-line"></i>
              </a>
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-6 py-4">
                <span className="w-2 h-2 rounded-full bg-[#a3e635] animate-pulse inline-block"></span>
                <span className="text-white/50 text-sm font-medium">{openRoles.length} positions open right now</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-6 md:px-10 max-w-7xl mx-auto py-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { value: "60+", label: "Team members worldwide", icon: "ri-team-line" },
            { value: "28", label: "Countries represented", icon: "ri-global-line" },
            { value: "4.9/5", label: "Glassdoor rating", icon: "ri-star-fill" },
            { value: "94%", label: "Employee retention rate", icon: "ri-heart-line" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="bg-[#131009] border border-white/5 rounded-2xl p-6 flex items-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <div className="w-10 h-10 flex items-center justify-center bg-[#a3e635]/10 rounded-xl shrink-0">
                <i className={`${stat.icon} text-[#a3e635] text-lg`}></i>
              </div>
              <div>
                <p className="text-white font-bold text-xl leading-none">{stat.value}</p>
                <p className="text-white/35 text-xs mt-1">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="px-6 md:px-10 max-w-7xl mx-auto py-16 border-t border-white/5">
        <motion.div className="mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-[#a3e635] text-xs font-mono tracking-widest mb-3">HOW WE OPERATE</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">The principles that guide us</h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {values.map((v, i) => (
            <motion.div
              key={v.number}
              className="bg-[#131009] border border-white/5 rounded-2xl p-8 hover:border-[#a3e635]/20 transition-colors duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <span className="text-[#a3e635]/25 text-5xl font-bold font-mono block mb-4">{v.number}</span>
              <h3 className="text-white font-bold text-lg mb-3">{v.title}</h3>
              <p className="text-white/35 text-sm leading-relaxed">{v.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Life at Solutions — Photo Grid */}
      <section className="px-6 md:px-10 max-w-7xl mx-auto py-16 border-t border-white/5">
        <motion.div className="mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-[#a3e635] text-xs font-mono tracking-widest mb-3">LIFE AT DEVCRAFT</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">Where craft meets culture</h2>
        </motion.div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { src: "https://readdy.ai/api/search-image?query=joyful%20remote%20software%20team%20on%20group%20video%20call%20celebrating%20a%20product%20launch%20with%20wide%20smiles%20modern%20cozy%20home%20offices%20visible%20warm%20ambient%20lighting%20genuine%20team%20chemistry%20authentic%20collaboration%20moment%20professional&width=600&height=420&seq=careers_c1&orientation=landscape", cls: "col-span-2 row-span-2 h-60 lg:h-auto" },
            { src: "https://readdy.ai/api/search-image?query=focused%20developer%20coding%20on%20multiple%20monitors%20cozy%20warm%20home%20office%20golden%20hour%20sunlight%20plants%20on%20wooden%20desk%20books%20stacked%20coffee%20mug%20creative%20productive%20workspace%20calm%20atmosphere&width=400&height=300&seq=careers_c2&orientation=landscape", cls: "h-44" },
            { src: "https://readdy.ai/api/search-image?query=tech%20team%20annual%20offsite%20retreat%20outdoor%20tropical%20venue%20professionals%20collaborating%20at%20long%20wooden%20table%20with%20laptops%20relaxed%20laughter%20lush%20green%20foliage%20casual%20atmosphere%20sunny%20day&width=400&height=300&seq=careers_c3&orientation=landscape", cls: "h-44" },
            { src: "https://readdy.ai/api/search-image?query=engineering%20conference%20stage%20speaker%20presenting%20technical%20architecture%20diagram%20large%20screen%20attentive%20audience%20modern%20conference%20auditorium%20professional%20development%20event%20warm%20stage%20lighting&width=400&height=300&seq=careers_c4&orientation=landscape", cls: "h-44" },
            { src: "https://readdy.ai/api/search-image?query=mobile%20UX%20design%20critique%20session%20two%20designers%20reviewing%20wireframes%20on%20large%20touchscreen%20display%20bright%20collaborative%20studio%20space%20minimalist%20interior%20natural%20light%20authentic%20creative%20process&width=400&height=300&seq=careers_c5&orientation=landscape", cls: "h-44" },
          ].map((img, i) => (
            <motion.div
              key={i}
              className={`relative overflow-hidden rounded-xl ${img.cls}`}
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <img src={img.src} alt="Life at Solutions Studio" className="w-full h-full object-cover object-top" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Perks */}
      <section className="px-6 md:px-10 max-w-7xl mx-auto py-16 border-t border-white/5">
        <motion.div className="mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-[#a3e635] text-xs font-mono tracking-widest mb-3">BENEFITS & PERKS</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">We take care of our people</h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {perks.map((perk, i) => (
            <motion.div
              key={perk.title}
              className="bg-[#131009] border border-white/5 rounded-2xl p-6 hover:border-[#a3e635]/20 transition-colors duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <div className="w-10 h-10 flex items-center justify-center bg-[#a3e635]/10 rounded-xl mb-4">
                <i className={`${perk.icon} text-[#a3e635] text-lg`}></i>
              </div>
              <h4 className="text-white font-bold text-sm mb-2">{perk.title}</h4>
              <p className="text-white/35 text-xs leading-relaxed">{perk.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Open Roles */}
      <section id="open-roles" className="px-6 md:px-10 max-w-7xl mx-auto py-16 border-t border-white/5">
        <motion.div className="mb-10" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-[#a3e635] text-xs font-mono tracking-widest mb-3">OPEN POSITIONS</p>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Find your role</h2>
            <div className="flex flex-wrap gap-2">
              {departments.map((dep) => (
                <button
                  key={dep}
                  onClick={() => setActiveFilter(dep)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap cursor-pointer ${
                    activeFilter === dep
                      ? "bg-[#a3e635] text-black"
                      : "bg-white/5 text-white/50 border border-white/10 hover:text-white hover:border-white/20"
                  }`}
                >
                  {dep}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="space-y-3">
          {filtered.map((role, i) => (
            <motion.div
              key={role.id}
              className="bg-[#131009] border border-white/5 rounded-2xl overflow-hidden hover:border-[#a3e635]/20 transition-colors duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
            >
              <button
                className="w-full text-left p-6 md:p-8 cursor-pointer"
                onClick={() => setExpandedRole(expandedRole === role.id ? null : role.id)}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-[#a3e635]/70 text-xs font-mono bg-[#a3e635]/10 border border-[#a3e635]/15 px-3 py-1 rounded-full">
                        {role.department}
                      </span>
                      <span className="text-white/30 text-xs bg-white/5 px-3 py-1 rounded-full border border-white/10">{role.level}</span>
                      <span className="text-white/30 text-xs bg-white/5 px-3 py-1 rounded-full border border-white/10">{role.type}</span>
                    </div>
                    <h3 className="text-white font-bold text-xl">{role.title}</h3>
                    <div className="flex flex-wrap gap-4 mt-2">
                      <span className="flex items-center gap-1.5 text-white/35 text-sm">
                        <i className="ri-map-pin-line text-xs"></i>{role.location}
                      </span>
                      <span className="flex items-center gap-1.5 text-white/35 text-sm">
                        <i className="ri-money-dollar-circle-line text-xs"></i>{role.salary}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="hidden md:flex flex-wrap gap-1.5">
                      {role.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-xs font-mono text-white/25 bg-white/5 px-2.5 py-1 rounded-md">{tag}</span>
                      ))}
                    </div>
                    <div className={`w-8 h-8 flex items-center justify-center rounded-full border border-white/10 text-white/40 transition-transform duration-300 ${expandedRole === role.id ? "rotate-180" : ""}`}>
                      <i className="ri-arrow-down-s-line text-lg"></i>
                    </div>
                  </div>
                </div>
              </button>

              <AnimatePresence>
                {expandedRole === role.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden border-t border-white/5"
                  >
                    <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                      <div className="lg:col-span-2 space-y-6">
                        <div>
                          <h4 className="text-white font-semibold text-sm mb-3">About the Role</h4>
                          <p className="text-white/40 text-sm leading-relaxed">{role.description}</p>
                        </div>
                        <div>
                          <h4 className="text-white font-semibold text-sm mb-3">Requirements</h4>
                          <ul className="space-y-2">
                            {role.requirements.map((req) => (
                              <li key={req} className="flex items-start gap-2.5 text-white/40 text-sm">
                                <i className="ri-check-line text-[#a3e635] text-xs mt-0.5 shrink-0"></i>{req}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-white font-semibold text-sm mb-3">Nice to Have</h4>
                          <ul className="space-y-2">
                            {role.niceToHave.map((n) => (
                              <li key={n} className="flex items-start gap-2.5 text-white/30 text-sm">
                                <i className="ri-add-line text-white/20 text-xs mt-0.5 shrink-0"></i>{n}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="space-y-5">
                        <div className="bg-[#080d1a] border border-white/5 rounded-xl p-6">
                          <h4 className="text-white font-semibold text-sm mb-4">Quick Facts</h4>
                          <div className="space-y-3">
                            {[
                              { icon: "ri-building-line", label: "Department", value: role.department },
                              { icon: "ri-map-pin-line", label: "Location", value: role.location },
                              { icon: "ri-time-line", label: "Type", value: role.type },
                              { icon: "ri-bar-chart-line", label: "Level", value: role.level },
                              { icon: "ri-money-dollar-circle-line", label: "Salary", value: role.salary },
                            ].map((item) => (
                              <div key={item.label} className="flex items-center justify-between">
                                <span className="flex items-center gap-2 text-white/30 text-xs">
                                  <i className={`${item.icon} text-xs`}></i>{item.label}
                                </span>
                                <span className="text-white/60 text-xs font-medium">{item.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <button
                          onClick={() => setApplyRole(role.title)}
                          className="w-full flex items-center justify-center gap-2 bg-[#a3e635] text-black font-bold px-6 py-4 rounded-xl hover:bg-white transition-colors duration-300 cursor-pointer whitespace-nowrap text-sm"
                        >
                          Apply for This Role
                          <i className="ri-arrow-right-line"></i>
                        </button>
                        <p className="text-white/20 text-xs text-center">
                          Or email directly:<br />
                          <span className="text-white/35">careers@ballangkmall.com</span>
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Hiring Process */}
      <section className="px-6 md:px-10 max-w-7xl mx-auto py-16 border-t border-white/5">
        <motion.div className="mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-[#a3e635] text-xs font-mono tracking-widest mb-3">HOW WE HIRE</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">Our hiring process</h2>
          <p className="text-white/35 text-sm mt-2">Fast, fair, and transparent. No trick questions, no whiteboard hazing.</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { step: "01", title: "Apply", desc: "Send your resume and a short intro. We respond within 48 hours — no black holes, ever." },
            { step: "02", title: "Intro Call", desc: "30-min video chat with your future team lead. Mostly about you — your work, goals, questions." },
            { step: "03", title: "Technical Review", desc: "A real-world take-home challenge (~3 hrs) or a review of your existing work. Your choice." },
            { step: "04", title: "Offer", desc: "Final 45-min call with leadership, then a competitive written offer within 24 hours." },
          ].map((step, i) => (
            <motion.div
              key={step.step}
              className="bg-[#131009] border border-white/5 rounded-2xl p-6 relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <span className="absolute top-4 right-5 text-5xl font-bold text-white/[0.03] font-mono">{step.step}</span>
              <div className="w-9 h-9 flex items-center justify-center bg-[#a3e635]/10 rounded-lg mb-4">
                <span className="text-[#a3e635] text-xs font-bold font-mono">{step.step}</span>
              </div>
              <h4 className="text-white font-bold text-base mb-2">{step.title}</h4>
              <p className="text-white/35 text-xs leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Open Application CTA */}
      <section className="px-6 md:px-10 max-w-7xl mx-auto pb-24 pt-4">
        <motion.div
          className="bg-[#131009] border border-[#a3e635]/15 rounded-2xl p-10 md:p-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-[#a3e635] text-xs font-mono tracking-widest mb-4">DON&apos;T SEE YOUR ROLE?</p>
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
            We&apos;re always looking for exceptional talent.
          </h3>
          <p className="text-white/35 text-base max-w-lg mx-auto mb-8">
            If you&apos;re genuinely world-class at what you do and believe in building great software, we want to hear from you — role or no role.
          </p>
          <a
            href="mailto:careers@ballangkmall.com"
            rel="nofollow"
            className="inline-flex items-center gap-2 bg-[#a3e635] text-black font-bold px-8 py-4 rounded-full hover:bg-white transition-colors duration-300 cursor-pointer whitespace-nowrap"
          >
            Send an Open Application
            <i className="ri-arrow-right-line"></i>
          </a>
        </motion.div>
      </section>
    </div>
  );
}