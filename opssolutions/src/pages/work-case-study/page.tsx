import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import workCaseStudies, { WorkCaseStudy } from "./data";

// ─── Animated Metric Card ─────────────────────────────────────────────────────
function MetricCard({ metric, index }: { metric: WorkCaseStudy["metrics"][0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col items-center text-center p-5 bg-white/[0.03] border border-white/[0.06] rounded-2xl hover:border-accent/30 transition-colors duration-300"
    >
      <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-accent/10 border border-accent/20 mb-4 group-hover:bg-accent/18 transition-colors">
        <i className={`${metric.icon} text-accent text-base`}></i>
      </div>
      <motion.p
        className="text-2xl md:text-3xl font-bold text-white mb-0.5"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: index * 0.08 + 0.2 }}
      >
        {metric.value}
      </motion.p>
      <p className="text-xs font-semibold text-dc-text/60 mb-1">{metric.label}</p>
      {metric.subvalue && <p className="text-[10px] text-accent/50 font-mono">{metric.subvalue}</p>}
    </motion.div>
  );
}

// ─── Timeline Step ────────────────────────────────────────────────────────────
function TimelineStep({ step, index, total }: { step: WorkCaseStudy["timeline"][0]; index: number; total: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });
  return (
    <motion.div
      ref={ref}
      className="flex gap-5"
      initial={{ opacity: 0, x: -24 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex flex-col items-center shrink-0">
        <div className="w-9 h-9 flex items-center justify-center rounded-full bg-accent/10 border border-accent/25">
          <span className="text-accent text-xs font-bold font-mono">{String(index + 1).padStart(2, "0")}</span>
        </div>
        {index < total - 1 && <div className="w-px flex-1 bg-white/5 mt-2 min-h-4" />}
      </div>
      <div className="pb-7">
        <div className="flex flex-wrap items-center gap-2 mb-1.5">
          <span className="text-accent/60 text-[10px] font-mono">{step.week}</span>
        </div>
        <h4 className="text-white font-semibold text-base mb-1.5">{step.title}</h4>
        <p className="text-white/40 text-sm leading-relaxed mb-3">{step.description}</p>
        <div className="flex flex-wrap gap-1.5">
          {step.tags.map((tag) => (
            <span key={tag} className="text-[10px] font-mono text-accent/60 bg-accent/8 border border-accent/15 px-2 py-0.5 rounded-md">{tag}</span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Gallery Image ────────────────────────────────────────────────────────────
function GalleryItem({ src, index }: { src: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      className="rounded-xl overflow-hidden border border-white/5 aspect-video"
      initial={{ opacity: 0, y: 28, scale: 0.96 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.65, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
    >
      <img src={src} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover object-top" />
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function WorkCaseStudyPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const [activeTab, setActiveTab] = useState<"challenge" | "solution">("challenge");

  const study = slug ? workCaseStudies[slug] : null;

  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, [slug]);

  if (!study) {
    return (
      <div className="bg-[#080d1a] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/40 mb-4">Project not found.</p>
          <button onClick={() => navigate("/")} className="text-accent hover:underline cursor-pointer">Back to Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#080d1a] min-h-screen">
      {/* ── Nav ── */}
      <header className="fixed top-0 left-0 w-full z-50 bg-[#080d1a]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-18 flex items-center justify-between h-[68px]">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/40 hover:text-white transition-colors cursor-pointer whitespace-nowrap">
            <i className="ri-arrow-left-line text-sm"></i>
            <span className="text-sm font-medium hidden sm:block">Back</span>
          </button>
          <a href="/" onClick={(e) => { e.preventDefault(); navigate("/"); }} className="flex items-center gap-2 cursor-pointer">
            <span className="text-white font-bold">Solutions<span className="text-accent">.</span></span>
          </a>
          <button onClick={() => navigate("/#contact")} className="flex items-center gap-2 bg-accent text-black text-sm font-bold px-4 py-2 rounded-full hover:bg-white transition-colors cursor-pointer whitespace-nowrap">
            Start a Project <i className="ri-arrow-right-line text-xs"></i>
          </button>
        </div>
      </header>

      {/* ── Hero ── */}
      <section ref={heroRef} className="relative h-[85vh] min-h-[560px] overflow-hidden flex items-end">
        <motion.div className="absolute inset-0" style={{ y: heroY }}>
          <img src={study.heroImage} alt={study.title} className="w-full h-full object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080d1a] via-[#080d1a]/60 to-[#080d1a]/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080d1a]/30 to-transparent" />
        </motion.div>

        <motion.div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-10 pb-16 md:pb-20" style={{ opacity: heroOpacity }}>
          <motion.div className="flex flex-wrap items-center gap-3 mb-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
            <span className="bg-accent text-black text-xs font-bold px-3 py-1.5 rounded-full">{study.category}</span>
            <span className="text-white/35 text-xs font-mono border border-white/10 px-2.5 py-1 rounded-lg">{study.year}</span>
            <span className="text-white/35 text-xs">{study.duration}</span>
            <span className="text-white/15">·</span>
            <span className="text-white/35 text-xs">{study.team}</span>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight max-w-4xl mb-5"
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            {study.title}
          </motion.h1>

          <motion.p
            className="text-white/50 text-lg md:text-xl max-w-2xl leading-relaxed mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.28 }}
          >
            {study.tagline}
          </motion.p>

          <motion.div className="flex flex-wrap gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            {study.tags.map((tag) => (
              <span key={tag} className="text-xs font-mono text-white/40 bg-white/5 border border-white/8 px-3 py-1.5 rounded-full">{tag}</span>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div className="absolute bottom-8 right-8 z-10 hidden md:flex flex-col items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
          <motion.div className="w-px h-12 bg-gradient-to-b from-transparent to-accent/40" animate={{ scaleY: [1, 0.6, 1] }} transition={{ duration: 1.8, repeat: Infinity }} />
          <span className="text-white/20 text-[10px] font-mono tracking-widest rotate-90 origin-center mt-2">SCROLL</span>
        </motion.div>
      </section>

      {/* ── Metrics ── */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-20">
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {study.metrics.map((m, i) => <MetricCard key={m.label} metric={m} index={i} />)}
        </motion.div>
      </section>

      {/* ── Overview ── */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 pb-16">
        <div className="max-w-3xl">
          <motion.p className="text-accent text-xs font-mono tracking-widest mb-4" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>OVERVIEW</motion.p>
          <motion.p
            className="text-white/55 text-lg leading-loose"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {study.overview}
          </motion.p>
        </div>
      </section>

      {/* ── Challenge / Solution Tabs ── */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 pb-16">
        <div className="flex gap-1 bg-white/[0.04] border border-white/8 rounded-xl p-1 w-fit mb-8">
          {(["challenge", "solution"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-250 cursor-pointer capitalize whitespace-nowrap ${activeTab === tab ? "bg-accent text-black" : "text-white/40 hover:text-white/70"}`}
            >
              {tab === "challenge" ? "The Challenge" : "Our Solution"}
            </button>
          ))}
        </div>

        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">
            <div>
              <motion.p className="text-white/50 text-base leading-relaxed mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                {activeTab === "challenge" ? study.challenge : study.solution}
              </motion.p>
            </div>
            <div className="flex flex-col gap-3">
              {(activeTab === "challenge" ? study.challengePoints : study.solutionPoints).map((point, i) => (
                <motion.div
                  key={i}
                  className="flex items-start gap-3 bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 py-3.5"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                >
                  <div className="w-5 h-5 flex items-center justify-center rounded-full mt-0.5 shrink-0" style={{ background: activeTab === "challenge" ? "rgba(239,68,68,0.12)" : "rgba(41,171,226,0.12)" }}>
                    <i className={`text-[10px] ${activeTab === "challenge" ? "ri-close-line text-red-400" : "ri-check-line text-accent"}`}></i>
                  </div>
                  <p className="text-white/55 text-sm leading-relaxed">{point}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Timeline ── */}
      <section className="bg-[#0f0e0c] border-y border-white/5 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <motion.div className="mb-10" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <p className="text-accent text-xs font-mono tracking-widest mb-2">PROCESS</p>
            <h2 className="text-white font-bold text-2xl md:text-3xl">How we built it</h2>
          </motion.div>
          <div className="max-w-2xl">
            {study.timeline.map((step, i) => (
              <TimelineStep key={i} step={step} index={i} total={study.timeline.length} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Tech Stack ── */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-16">
        <motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-accent text-xs font-mono tracking-widest mb-2">TECH STACK</p>
          <h2 className="text-white font-bold text-2xl md:text-3xl">What we shipped with</h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {study.techStack.map((group, gi) => (
            <motion.div
              key={group.category}
              className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: gi * 0.07 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-accent/10">
                  <i className={`${group.icon} text-accent text-sm`}></i>
                </div>
                <span className="text-white/50 text-xs font-mono">{group.category}</span>
              </div>
              <div className="flex flex-col gap-1.5">
                {group.items.map((item) => (
                  <span key={item} className="text-xs font-mono text-accent/65 bg-accent/8 border border-accent/12 px-2.5 py-1.5 rounded-lg">{item}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Gallery ── */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 pb-16">
        <motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-accent text-xs font-mono tracking-widest mb-2">GALLERY</p>
          <h2 className="text-white font-bold text-2xl md:text-3xl">Project screenshots</h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {study.gallery.map((src, i) => <GalleryItem key={i} src={src} index={i} />)}
        </div>
      </section>

      {/* ── Quote ── */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 pb-16">
        <motion.blockquote
          className="relative bg-[#0f0e0c] border border-accent/15 rounded-3xl px-8 py-10 md:px-12 md:py-12 overflow-hidden"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none" style={{ background: "radial-gradient(circle at top right, rgba(41,171,226,0.05) 0%, transparent 65%)" }} />
          <i className="ri-double-quotes-l text-accent/20 text-6xl absolute top-6 left-8 leading-none"></i>
          <p className="text-white/75 text-xl md:text-2xl leading-relaxed italic mb-8 relative z-10 mt-6">{study.quote.text}</p>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-accent/15 border border-accent/25 flex items-center justify-center">
              <i className="ri-user-line text-accent text-lg"></i>
            </div>
            <div>
              <p className="text-white font-semibold">{study.quote.name}</p>
              <p className="text-white/35 text-sm">{study.quote.role} · {study.quote.company}</p>
            </div>
          </div>
        </motion.blockquote>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 pb-16">
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-accent/8 border border-accent/20 rounded-2xl px-7 py-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h3 className="text-white font-bold text-lg mb-1">Ready to build something like this?</h3>
            <p className="text-white/40 text-sm">We&apos;re accepting projects. Let&apos;s talk.</p>
          </div>
          <button onClick={() => navigate("/#contact")} className="flex items-center gap-2 bg-accent text-black font-bold px-7 py-3.5 rounded-xl hover:bg-white transition-colors duration-300 cursor-pointer whitespace-nowrap">
            Start Your Project <i className="ri-arrow-right-line"></i>
          </button>
        </motion.div>
      </section>

      {/* ── Next Project ── */}
      <section className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div className="flex items-center gap-5">
              {study.nextImage && (
                <div className="w-16 h-12 rounded-xl overflow-hidden shrink-0 hidden sm:block">
                  <img src={study.nextImage} alt={study.nextTitle} className="w-full h-full object-cover" />
                </div>
              )}
              <div>
                <p className="text-white/20 text-[10px] font-mono mb-1">NEXT PROJECT</p>
                <p className="text-white font-semibold">{study.nextTitle}</p>
              </div>
            </div>
            <button onClick={() => navigate(`/work/${study.nextSlug}`)} className="flex items-center gap-2 bg-[#1a1814] border border-white/8 text-white font-medium px-6 py-3 rounded-full hover:border-accent hover:text-accent transition-colors cursor-pointer whitespace-nowrap text-sm">
              View Project <i className="ri-arrow-right-line"></i>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}