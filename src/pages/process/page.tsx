import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { usePageMeta } from "@/hooks/usePageMeta";
import FloatingBookCTA from "@/pages/home/components/FloatingBookCTA";
import ProcessTunnelCanvas from "./components/ProcessTunnelCanvas";
import ProcessStepSection, { type ProcessStep } from "./components/ProcessStepSection";

// ── Data ────────────────────────────────────────────────────────────────────
const steps: ProcessStep[] = [
  {
    number: "01",
    phase: "Discovery",
    title: "Discover & Strategize",
    subtitle: "We dig deep before writing a single line of code.",
    duration: "Weeks 1–2",
    icon: "ri-search-eye-line",
    description:
      "Every great product starts with relentless curiosity. We run stakeholder interviews, analyze your competitive landscape, study your users, and stress-test assumptions. Nothing enters the backlog that hasn't earned its place through evidence.",
    activities: [
      "5-day intensive discovery sprint with key stakeholders",
      "User persona development and empathy mapping",
      "Competitive landscape and market gap analysis",
      "Technical feasibility study for proposed solutions",
      "Risk matrix: technical, product, and timeline risks",
    ],
    deliverables: ["Project Brief & Scope", "Architecture Blueprint", "User Story Map", "Sprint Roadmap"],
    tools: ["Miro", "Notion", "Linear", "Figma"],
    outcome: "You get a bulletproof plan — no surprises, no scope creep, just clarity.",
  },
  {
    number: "02",
    phase: "Design",
    title: "Design & Prototype",
    subtitle: "Your product takes shape before any code is written.",
    duration: "Weeks 2–5",
    icon: "ri-artboard-line",
    description:
      "Design at Solutions is not decoration — it is product thinking made visual. We build a complete design system, validate interactions through user testing, and hand engineers designs so polished that implementation is a joy, not a guessing game.",
    activities: [
      "Information architecture and user flow mapping",
      "Rapid lo-fi wireframing for all core screens",
      "Hi-fidelity UI design with full design system",
      "Interactive Figma prototype with realistic interactions",
      "Usability testing with real users (min 5 sessions)",
    ],
    deliverables: ["Complete Design System", "All UI screens hi-fi", "Clickable prototype", "Usability test report"],
    tools: ["Figma", "FigJam", "Maze", "Lottie"],
    outcome: "A prototype so polished you can show it to investors before we write a line of code.",
  },
  {
    number: "03",
    phase: "Development",
    title: "Build in Agile Sprints",
    subtitle: "Shipping working software every two weeks, without fail.",
    duration: "Weeks 4–16+",
    icon: "ri-code-s-slash-line",
    description:
      "Two-week sprints with a relentless focus on shipping working software — not just code. Every feature goes through design review, code review, automated testing, and performance validation before it ships. You see real progress at every sprint demo.",
    activities: [
      "Two-week sprint cycles with planning & retrospectives",
      "Daily async standups via Slack + weekly video syncs",
      "Peer code review on all pull requests (no solo merges)",
      "Automated test suites: unit, integration, and E2E",
      "Bi-weekly sprint demos — live working software, every time",
    ],
    deliverables: ["Working software every 2 weeks", "Sprint velocity reports", "Full Git history", "CI/CD pipeline"],
    tools: ["GitHub", "Linear", "Slack", "Datadog"],
    outcome: "You see real features shipping to a staging environment every two weeks.",
  },
  {
    number: "04",
    phase: "Quality",
    title: "Test, Harden & Audit",
    subtitle: "We do not ship until it is airtight.",
    duration: "Final 2–3 Weeks",
    icon: "ri-shield-check-line",
    description:
      "Quality is embedded from day one but the final stretch runs a full-spectrum audit: performance, security, accessibility, and real-device QA. We simulate production load, run automated vulnerability scans, and squash every edge case.",
    activities: [
      "Full regression test suite across all features",
      "Load testing and stress testing (10× expected traffic)",
      "OWASP Top 10 security vulnerability scan",
      "Core Web Vitals audit (LCP, FID, CLS targets)",
      "User Acceptance Testing (UAT) with client team",
    ],
    deliverables: ["QA Test Report", "Performance Audit", "Security Scan Report", "Accessibility Audit"],
    tools: ["Playwright", "k6", "Snyk", "Lighthouse"],
    outcome: "Every metric green. Every edge case handled. Zero known issues at launch.",
  },
  {
    number: "05",
    phase: "Launch",
    title: "Launch, Monitor & Grow",
    subtitle: "Launch day is the beginning, not the finish line.",
    duration: "Week 14+ & Ongoing",
    icon: "ri-rocket-2-line",
    description:
      "We treat launch as the start of the product journey, not the end of the project. Our team executes a phased rollout, monitors real-time performance from the first request, and provides hypercare support for 14 days post-go-live.",
    activities: [
      "Zero-downtime blue/green production deployment",
      "Real-time monitoring setup (errors, latency, uptime)",
      "14-day hypercare period with priority response SLA",
      "Complete technical documentation and runbooks",
      "Post-launch growth roadmap planning for v2",
    ],
    deliverables: ["Production deployment", "Monitoring infrastructure", "Technical docs", "Post-launch roadmap"],
    tools: ["Datadog", "PagerDuty", "Notion", "Loom"],
    outcome: "Your product is live. Your team is empowered. Your roadmap is clear.",
  },
];

// ── Hero ─────────────────────────────────────────────────────────────────────
function ProcessHero({ onDiscover }: { onDiscover: () => void }) {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden"
    >
      {/* Gradient floor so tunnel is subtly visible above it */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(to bottom, rgba(8,10,14,0.97) 0%, rgba(8,10,14,0.88) 60%, rgba(8,10,14,0.2) 100%)" }}
      />

      <motion.div className="relative z-10 max-w-4xl mx-auto" style={{ y: textY, opacity }}>
        <motion.div
          className="inline-flex items-center gap-2 bg-accent/10 border border-accent/25 text-accent text-xs font-mono px-5 py-2.5 rounded-full mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <i className="ri-route-line" />
          Battle-tested · 5 Phases · 10+ years refined
        </motion.div>

        <motion.h1
          className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[1.0] mb-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          How We Turn
          <br />
          Vision Into{" "}
          <span className="text-accent">Reality.</span>
        </motion.h1>

        <motion.p
          className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-14"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          A structured 5-phase framework built from 10 years of shipping software for
          companies of every size — from seed-stage startups to Fortune 500 enterprises.
          No surprises, no scope creep.
        </motion.p>

        {/* Phase pills */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-12"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
        >
          {steps.map((s) => (
            <div
              key={s.number}
              className="flex items-center gap-2 bg-white/5 border border-white/10 text-white/60 text-sm px-4 py-2 rounded-full font-medium backdrop-blur-sm"
            >
              <i className={`${s.icon} text-accent text-sm`} />
              {s.phase}
            </div>
          ))}
        </motion.div>

        <motion.button
          onClick={onDiscover}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center gap-3 bg-accent text-black font-black px-10 py-4 rounded-full text-base hover:bg-white transition-colors cursor-pointer whitespace-nowrap"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <i className="ri-play-circle-line text-xl" />
          Begin the Journey
        </motion.button>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
      >
        <span className="text-white/25 text-[10px] font-mono tracking-[0.25em]">SCROLL TO EXPLORE</span>
        <i className="ri-arrow-down-line text-white/25 text-lg" />
      </motion.div>
    </section>
  );
}

// ── CTA section ───────────────────────────────────────────────────────────────
function ProcessCTA({ onContact }: { onContact: () => void }) {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center px-6 py-24">
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(to top, rgba(8,10,14,0.98) 0%, rgba(8,10,14,0.5) 60%, transparent 100%)" }}
      />
      <motion.div
        className="relative z-10 max-w-3xl mx-auto text-center"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <div
          className="inline-flex flex-col items-center gap-8 rounded-3xl p-12"
          style={{
            background: "rgba(10,12,16,0.88)",
            backdropFilter: "blur(32px)",
            WebkitBackdropFilter: "blur(32px)",
            border: "1px solid rgba(185,255,75,0.15)",
            boxShadow: "0 0 80px rgba(185,255,75,0.06), 0 40px 80px rgba(0,0,0,0.5)",
          }}
        >
          <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-accent/12 border border-accent/25">
            <i className="ri-calendar-check-line text-accent text-3xl" />
          </div>
          <div>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
              Ready to kick off your{" "}
              <span className="text-accent">Discovery Sprint?</span>
            </h2>
            <p className="text-white/50 text-base leading-relaxed max-w-lg mx-auto">
              A 5-day, fixed-cost Discovery Sprint gives you a bulletproof roadmap and
              architecture blueprint — before we write a line of production code.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 justify-center">
            <motion.button
              onClick={onContact}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 bg-accent text-black font-black px-10 py-4 rounded-full hover:bg-white transition-colors cursor-pointer whitespace-nowrap text-base"
            >
              Book a Discovery Call <i className="ri-arrow-right-line text-lg" />
            </motion.button>
            <Link
              to="/case-studies"
              className="flex items-center gap-2 border border-white/15 text-white/70 font-medium px-8 py-4 rounded-full hover:border-accent hover:text-accent transition-colors cursor-pointer whitespace-nowrap"
            >
              Browse Case Studies <i className="ri-bar-chart-box-line" />
            </Link>
          </div>
          {/* Stats strip */}
          <div className="flex flex-wrap justify-center gap-8 pt-6 border-t border-white/6 w-full">
            {[
              { value: "180+", label: "Projects shipped" },
              { value: "98%", label: "On-time milestones" },
              { value: "4.9★", label: "Client satisfaction" },
              { value: "< 48h", label: "First estimate" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-accent text-xl font-black font-mono">{s.value}</p>
                <p className="text-white/35 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function ProcessPage() {
  const navigate = useNavigate();
  const stepRefs = useRef<(HTMLElement | null)[]>([]);

  usePageMeta({
    title: "How We Work — Our 5-Phase Development Process",
    description:
      "Solutions Studio's battle-tested 5-phase project delivery framework: Discovery, Design, Development, Quality, and Launch. Fixed-scope contracts, 2-week sprints, zero surprises.",
    canonical: "https://devcraftstudio.io/process",
    ogImage:
      "https://readdy.ai/api/search-image?query=abstract%20glowing%203D%20tunnel%20corridor%20with%20green%20neon%20rings%20leading%20to%20infinite%20depth%20dark%20space%20technology%20corridor%20premium%20agency%20cinematic&width=1200&height=630&seq=og_process_v3&orientation=landscape",
  });

  const scrollToStep = (index: number) => {
    const sectionEl = document.getElementById(`process-step-${index}`);
    if (sectionEl) sectionEl.scrollIntoView({ behavior: "smooth" });
  };

  const handleDiscover = () => scrollToStep(0);
  const handleContact = () => navigate("/contact");

  return (
    <div className="relative" style={{ background: "rgb(8,10,14)" }}>
      {/* Three.js tunnel — fixed behind everything */}
      <ProcessTunnelCanvas />

      {/* Sticky translucent header */}
      <motion.header
        className="fixed top-0 left-0 w-full z-50 border-b border-white/6"
        style={{
          background: "rgba(8,10,14,0.88)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-18 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-white/50 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-arrow-left-line" />
            <span className="text-sm font-medium hidden sm:block">Back to Site</span>
          </button>

          <button onClick={() => navigate("/")} className="flex items-center gap-2 cursor-pointer">
            <img
              src="https://static.readdy.ai/image/27f36426f3cab7c4efebb6eb9e24cb04/3338f66b55262222ff9be144548b1ced.png"
              alt="Solutions"
              className="h-8 w-auto"
            />
            <span className="text-white font-bold text-base hidden sm:block">
              Solutions<span className="text-accent">.</span>
            </span>
          </button>

          {/* Phase nav (desktop) */}
          <div className="hidden lg:flex items-center gap-1">
            {steps.map((s, i) => (
              <button
                key={s.number}
                onClick={() => scrollToStep(i)}
                className="text-xs font-mono text-white/35 hover:text-accent transition-colors cursor-pointer px-3 py-1.5 rounded-full hover:bg-accent/8 whitespace-nowrap"
              >
                {s.number} {s.phase}
              </button>
            ))}
          </div>

          <motion.button
            onClick={handleContact}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="hidden sm:flex items-center gap-2 bg-accent text-black text-sm font-bold px-5 py-2.5 rounded-full hover:bg-white transition-colors cursor-pointer whitespace-nowrap"
          >
            Start a Project <i className="ri-arrow-right-line" />
          </motion.button>
        </div>
      </motion.header>

      {/* Scrollable content — sits above the fixed tunnel */}
      <div className="relative z-10 pt-0">
        <ProcessHero onDiscover={handleDiscover} />

        {/* Step sections */}
        {steps.map((step, i) => (
          <div
            key={step.number}
            id={`process-step-${i}`}
            ref={(el) => { stepRefs.current[i] = el; }}
          >
            <ProcessStepSection
              step={step}
              index={i}
              total={steps.length}
              onNext={() => scrollToStep(i + 1)}
              onContact={handleContact}
            />
          </div>
        ))}

        <ProcessCTA onContact={handleContact} />

        {/* Footer strip */}
        <footer
          className="border-t border-white/6 py-8 px-6 md:px-10"
          style={{ background: "rgba(8,10,14,0.95)" }}
        >
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <button onClick={() => navigate("/")} className="flex items-center gap-2 cursor-pointer">
              <img
                src="https://static.readdy.ai/image/27f36426f3cab7c4efebb6eb9e24cb04/3338f66b55262222ff9be144548b1ced.png"
                alt="Solutions"
                className="h-8 w-auto"
              />
              <span className="text-white font-semibold text-sm">
                Solutions<span className="text-accent">.</span>
              </span>
            </button>
            <p className="text-white/20 text-xs font-mono">
              &copy; 2026 Solutions Studio. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-white/20 text-xs">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse inline-block" />
              All systems operational
            </div>
          </div>
        </footer>
      </div>

      <FloatingBookCTA />
    </div>
  );
}