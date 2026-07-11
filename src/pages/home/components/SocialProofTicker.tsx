import { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { use3DTilt } from "@/hooks/use3DTilt";

// ─── Animated Counter ────────────────────────────────────────────────
function AnimatedNumber({
  target,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 2200,
}: {
  target: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
}) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    const steps = 70;
    const stepTime = duration / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = target * eased;
      setVal(current);
      if (step >= steps) { setVal(target); clearInterval(timer); }
    }, stepTime);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  const display = decimals > 0 ? val.toFixed(decimals) : Math.round(val).toLocaleString();

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{display}{suffix}
    </span>
  );
}

// ─── 3D Stat Card ────────────────────────────────────────────────────
interface StatCardProps {
  icon: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label: string;
  sub: string;
  color: string;
  delay: number;
}

function StatCard({ icon, value, prefix, suffix, decimals, label, sub, color, delay }: StatCardProps) {
  const { cardRef: tiltRef, rotateX, rotateY, handleMouseMove, handleMouseLeave } = use3DTilt({ maxRotateX: 10, maxRotateY: 10 });
  const cardRef = useRef<HTMLDivElement>(null);
  const inView = useInView(cardRef, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        ref={tiltRef as React.RefObject<HTMLDivElement>}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformPerspective: 800, transformStyle: "preserve-3d" }}
        className="relative group bg-dc-card/60 border border-dc-text/8 rounded-2xl p-6 cursor-default overflow-hidden hover:border-accent/30 transition-colors duration-300"
      >
        {/* Background glow on hover */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
          style={{ background: `radial-gradient(circle at 50% 110%, ${color}12 0%, transparent 65%)` }}
        />

        {/* Icon */}
        <div
          className="w-11 h-11 flex items-center justify-center rounded-xl mb-4 border transition-all duration-300"
          style={{
            background: `${color}12`,
            borderColor: `${color}25`,
          }}
        >
          <i className={`${icon} text-xl`} style={{ color }} />
        </div>

        {/* Number */}
        <p className="text-3xl md:text-4xl font-bold text-dc-text leading-none mb-1">
          <AnimatedNumber
            target={value}
            prefix={prefix}
            suffix={suffix}
            decimals={decimals}
            duration={2000 + delay * 400}
          />
        </p>

        {/* Label */}
        <p className="text-dc-text/80 font-semibold text-sm mt-2 group-hover:text-accent transition-colors duration-300">{label}</p>
        <p className="text-dc-text/35 text-xs mt-0.5 leading-snug">{sub}</p>

        {/* Corner accent */}
        <div
          className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full opacity-40 group-hover:opacity-90 transition-opacity duration-300"
          style={{ background: color, boxShadow: `0 0 8px 2px ${color}60` }}
        />
      </motion.div>
    </motion.div>
  );
}

// ─── Ticker Dot Indicators ─────────────────────────────────────────
function TickerDots({ active, count }: { active: number; count: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="rounded-full"
          animate={{
            width: i === active ? 14 : 4,
            background: i === active ? "#29abe2" : "rgba(41,171,226,0.2)",
          }}
          transition={{ duration: 0.3 }}
          style={{ height: 4 }}
        />
      ))}
    </div>
  );
}

// ─── Live Activity Ticker ────────────────────────────────────────────
const tickerItems = [
  { icon: "ri-rocket-2-line", text: "E-commerce platform shipped", client: "FreshCart Inc.", time: "2 mins ago", color: "#29abe2" },
  { icon: "ri-star-fill", text: "5-star review received", client: "NovaTech Solutions", time: "18 mins ago", color: "#ffd93d" },
  { icon: "ri-code-s-slash-line", text: "AI dashboard deployed", client: "Lumina Analytics", time: "1 hr ago", color: "#6cffcb" },
  { icon: "ri-shield-check-line", text: "Security audit passed", client: "FinVault Bank", time: "2 hrs ago", color: "#29abe2" },
  { icon: "ri-user-add-line", text: "New client onboarded", client: "PulseHealth App", time: "4 hrs ago", color: "#ff9f43" },
  { icon: "ri-trophy-line", text: "Best Startup Tool — Awarded", client: "WebExcellence 2026", time: "Yesterday", color: "#ffd93d" },
  { icon: "ri-rocket-2-line", text: "Mobile app v2.0 released", client: "StrideRun Co.", time: "Yesterday", color: "#29abe2" },
  { icon: "ri-bar-chart-2-line", text: "SaaS dashboard launched", client: "OpsIQ Enterprise", time: "2 days ago", color: "#6cffcb" },
];

function LiveTicker() {
  const [active, setActive] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: false, margin: "-80px" });

  useEffect(() => {
    if (!inView) return;
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % tickerItems.length);
    }, 2600);
    return () => clearInterval(timer);
  }, [inView]);

  const currentItem = tickerItems[active];

  return (
    <div ref={containerRef}>
      {/* Ticker Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-dc-text/6">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-dc-text/60 text-xs font-mono tracking-widest">LIVE ACTIVITY</span>
        </div>
        <TickerDots active={active} count={tickerItems.length} />
      </div>

      {/* Ticker Rows */}
      <div className="relative overflow-hidden h-14">
        {tickerItems.map((t, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 flex items-center gap-3 px-4"
            initial={false}
            animate={{
              y: i === active ? 0 : i === (active - 1 + tickerItems.length) % tickerItems.length ? -56 : 56,
              opacity: i === active ? 1 : 0,
            }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="w-8 h-8 shrink-0 flex items-center justify-center rounded-full"
              style={{ background: `${t.color}15`, border: `1px solid ${t.color}30` }}
            >
              <i className={`${t.icon} text-sm`} style={{ color: t.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-dc-text/80 text-sm font-medium truncate">{t.text}</span>
              <span className="text-dc-text/35 text-sm"> · {t.client}</span>
            </div>
            <span className="text-dc-text/25 text-xs font-mono shrink-0">{t.time}</span>
            <span className="w-2 h-2 rounded-full shrink-0 animate-pulse" style={{ background: currentItem.color }} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Scrolling Proof Strip ────────────────────────────────────────────
const proofItems = [
  ["ri-user-star-line", "4.9★ on Clutch"],
  ["ri-shield-star-line", "ISO 27001 Certified"],
  ["ri-award-line", "Top Agency 2025 — Awwwards"],
  ["ri-trophy-line", "#1 React Agency — G2"],
  ["ri-verified-badge-line", "Google Partner"],
  ["ri-building-4-line", "180+ Enterprise Clients"],
  ["ri-code-box-line", "100% Code Ownership"],
  ["ri-24-hours-line", "24/7 Support SLA"],
  ["ri-global-line", "28 Countries Served"],
  ["ri-customer-service-2-line", "97% On-Time Delivery"],
];

const stats = [
  { icon: "ri-rocket-2-line", value: 4, suffix: "+", label: "Projects Shipped", sub: "Across all verticals", color: "#29abe2" },
  { icon: "ri-timer-flash-line", value: 7.4, suffix: " wks", decimals: 1, label: "Avg. Launch Time", sub: "From kickoff to live", color: "#6cffcb" },
  { icon: "ri-heart-3-line", value: 98, suffix: "%", label: "Client Retention", sub: "Clients who come back", color: "#ff9f43" },
  { icon: "ri-global-line", value: 1, suffix: "", label: "Countries Served", sub: "Global client base", color: "#29abe2" },
  { icon: "ri-code-s-slash-line", value: 50, suffix: "M+", label: "Lines Shipped", sub: "In production codebases", color: "#6cffcb" },
  { icon: "ri-team-line", value: 60, suffix: "+", label: "Expert Engineers", sub: "Across 12 timezones", color: "#ffd93d" },
];

// ─── Floating 3D Background Orbs ─────────────────────────────────────
function DepthOrb({ className, color, size, duration }: { className: string; color: string; size: number; duration: number }) {
  return (
    <motion.div
      className={`absolute pointer-events-none rounded-full ${className}`}
      style={{ width: size, height: size, background: `radial-gradient(circle, ${color}18 0%, transparent 70%)` }}
      animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.8, 0.4] }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

// ─── Mouse parallax hook for section ─────────────────────────────────
function useMouseParallax() {
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  const handleMouseLeave = () => { mouseX.set(0.5); mouseY.set(0.5); };

  return { mouseX, mouseY, handleMouseMove, handleMouseLeave };
}

// ─── Main Export ─────────────────────────────────────────────────────
export default function SocialProofTicker() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const { mouseX, mouseY, handleMouseMove, handleMouseLeave } = useMouseParallax();

  const floatX = useSpring(useTransform(mouseX, [0, 1], [-18, 18]), { stiffness: 50, damping: 18 });
  const floatY = useSpring(useTransform(mouseY, [0, 1], [-10, 10]), { stiffness: 50, damping: 18 });
  const floatXLeft = useSpring(useTransform(mouseX, [0, 1], [12, -12]), { stiffness: 45, damping: 16 });

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative bg-dc-bg py-20 md:py-28 overflow-hidden"
      style={{ perspective: "1200px" }}
    >
      {/* Background depth orbs */}
      <DepthOrb className="top-0 left-[8%]" color="#29abe2" size={400} duration={9} />
      <DepthOrb className="bottom-0 right-[5%]" color="#6cffcb" size={320} duration={12} />
      <DepthOrb className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" color="#29abe2" size={500} duration={15} />

      {/* 3D floating badge — top right */}
      <motion.div
        className="absolute top-10 right-10 hidden xl:block pointer-events-none"
        style={{ x: floatX, y: floatY, transformStyle: "preserve-3d" }}
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <div
          className="bg-dc-card/80 border border-accent/20 rounded-2xl px-4 py-3 flex items-center gap-3"
          style={{ boxShadow: "0 20px 50px rgba(0,0,0,0.3), 0 0 0 1px rgba(41,171,226,0.1), inset 0 1px 0 rgba(255,255,255,0.04)" }}
        >
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-accent/15 border border-accent/25">
            <i className="ri-verified-badge-line text-accent text-sm" />
          </div>
          <div>
            <p className="text-dc-text/85 text-xs font-semibold leading-tight">Trusted by 180+ teams</p>
            <p className="text-accent text-[10px] font-mono mt-0.5">worldwide</p>
          </div>
        </div>
      </motion.div>

      {/* 3D floating ticker badge — left */}
      <motion.div
        className="absolute bottom-24 left-8 hidden xl:block pointer-events-none"
        style={{ x: floatXLeft }}
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 7, delay: 1, repeat: Infinity, ease: "easeInOut" }}
      >
        <div
          className="bg-dc-card/75 border border-dc-text/10 rounded-xl px-4 py-3"
          style={{ boxShadow: "0 12px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)" }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-white/40 text-[10px] font-mono">LIVE FEED</span>
          </div>
          <p className="text-dc-text/70 text-xs font-medium">Real-time activity</p>
        </div>
      </motion.div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-10">

        {/* Header */}
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-accent/8 border border-accent/18 text-accent text-[11px] font-mono tracking-widest px-4 py-2 rounded-full mb-5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            LIVE RESULTS
          </motion.div>

          <div className="overflow-hidden">
            <motion.h2
              className="text-3xl md:text-5xl font-bold text-dc-text"
              initial={{ y: "110%" }}
              animate={headerInView ? { y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              Numbers don't lie.
            </motion.h2>
          </div>
          <motion.p
            className="text-dc-text/40 text-base mt-3 max-w-md mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={headerInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
          >
            Every metric here is real, tracked, and updated continuously as we keep shipping.
          </motion.p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mb-10">
          {stats.map((s, i) => (
            <StatCard
              key={s.label}
              icon={s.icon}
              value={s.value}
              suffix={s.suffix}
              decimals={s.decimals}
              label={s.label}
              sub={s.sub}
              color={s.color}
              delay={i * 0.08}
            />
          ))}
        </div>

        {/* Live Activity Ticker Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="bg-dc-card/50 border border-dc-text/8 rounded-2xl overflow-hidden mb-10"
          style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.03)" }}
        >
          <LiveTicker />
        </motion.div>

        {/* Scrolling proof strip */}
        <motion.div
          className="overflow-hidden"
          initial={{ opacity: 0 }}
          animate={headerInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.7 }}
        >
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
              style={{ background: "linear-gradient(90deg, var(--color-dc-bg, #0a0a0a) 0%, transparent 100%)" }} />
            <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
              style={{ background: "linear-gradient(270deg, var(--color-dc-bg, #0a0a0a) 0%, transparent 100%)" }} />
            <div
              className="flex gap-8 whitespace-nowrap w-max"
              style={{ animation: "social-proof-marquee 30s linear infinite" }}
            >
              {[0, 1, 2].map((outerIdx) => (
                <div key={outerIdx} className="flex gap-8 shrink-0">
                  {proofItems.map(([icon, text]) => (
                    <span
                      key={`${outerIdx}-${text}`}
                      className="flex items-center gap-2.5 text-dc-text/20 text-xs font-mono tracking-widest uppercase shrink-0"
                    >
                      <i className={`${icon} text-accent/40 text-sm`} />
                      {text}
                      <span className="text-accent/20 ml-1">✦</span>
                    </span>
                  ))}
                </div>
              ))}
            </div>
            <style>{`
              @keyframes social-proof-marquee {
                0% { transform: translateX(0); }
                100% { transform: translateX(-33.333%); }
              }
            `}</style>
          </div>
        </motion.div>
      </div>
    </section>
  );
}