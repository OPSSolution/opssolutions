import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { useTheme } from "@/hooks/useTheme";
import HeroCanvas from "@/components/feature/HeroCanvas";

const headlineWords = ["We", "Craft", "Software", "That", "Drives", "Real", "Growth."];

const tagline =
  "From MVPs to enterprise platforms — we build scalable web apps, mobile experiences, and AI-powered systems for companies that refuse to settle for average.";

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let start = 0;
          const step = Math.ceil(target / 60);
          const timer = setInterval(() => {
            start += step;
            if (start >= target) { setCount(target); clearInterval(timer); }
            else setCount(start);
          }, 20);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const wordVariants = {
  hidden: { y: "110%", opacity: 0 },
  visible: {
    y: "0%",
    opacity: 1,
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
  },
};

// ─── Floating 3D Cards ───────────────────────────────────────────────
interface FloatingCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  amplitude?: number;
  mouseX: ReturnType<typeof useMotionValue<number>>;
  mouseY: ReturnType<typeof useMotionValue<number>>;
  depthFactor?: number;
}

function FloatingCard({
  children,
  className = "",
  delay = 0,
  duration = 5,
  amplitude = 14,
  mouseX,
  mouseY,
  depthFactor = 1,
}: FloatingCardProps) {
  const tx = useSpring(useTransform(mouseX, [-0.5, 0.5], [-35 * depthFactor, 35 * depthFactor]), {
    stiffness: 60,
    damping: 18,
  });
  const ty = useSpring(useTransform(mouseY, [-0.5, 0.5], [-20 * depthFactor, 20 * depthFactor]), {
    stiffness: 60,
    damping: 18,
  });

  return (
    <motion.div
      className={`absolute pointer-events-none select-none ${className}`}
      animate={{ y: [0, -amplitude, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
      style={{ x: tx, translateY: ty }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.7, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.9, delay: delay + 1.8, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────
export default function HeroSection() {
  const { isDark } = useTheme();
  const sectionRef = useRef<HTMLElement>(null);

  // ── Scroll parallax ──────────────────────────────────────────────
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const rawParallaxY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const parallaxY = useSpring(rawParallaxY, { stiffness: 55, damping: 22, restDelta: 0.001 });

  // Parallax layers for rings — each at a different speed for depth
  const rawRing1Y = useTransform(scrollYProgress, [0, 1], ["0%", "60%"]);
  const ring1Y = useSpring(rawRing1Y, { stiffness: 40, damping: 20, restDelta: 0.001 });

  const rawRing2Y = useTransform(scrollYProgress, [0, 1], ["0%", "42%"]);
  const ring2Y = useSpring(rawRing2Y, { stiffness: 45, damping: 20, restDelta: 0.001 });

  const rawRing3Y = useTransform(scrollYProgress, [0, 1], ["0%", "80%"]);
  const ring3Y = useSpring(rawRing3Y, { stiffness: 35, damping: 20, restDelta: 0.001 });

  const rawMouseX = useMotionValue(0);
  const rawMouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    rawMouseX.set((e.clientX - rect.left - rect.width / 2) / rect.width);
    rawMouseY.set((e.clientY - rect.top - rect.height / 2) / rect.height);
  };

  const handleMouseLeave = () => {
    rawMouseX.set(0);
    rawMouseY.set(0);
  };

  const handleScroll = () => {
    const el = document.getElementById("services");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-screen w-full flex flex-col justify-end overflow-hidden"
      style={{ perspective: "1400px" }}
    >
      {/* ── Three.js WebGL 3D Scene ── */}
      <HeroCanvas />

      {/* ── Background Image (scroll parallax) ── */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div
          className="absolute inset-x-0 -top-[15%] h-[130%] will-change-transform"
          style={{ y: parallaxY }}
        >
        {isDark ? (
          <img
            src="https://readdy.ai/api/search-image?query=dark%20cinematic%20abstract%20technology%20background%20with%20digital%20code%20streams%2C%20deep%20black%20environment%20with%20glowing%20electric%20blue%20neon%20grid%20lines%20and%20data%20particles%20floating%20in%20the%20atmosphere%2C%20ultra%20wide%20cinematic%20shot%2C%20premium%20software%20development%20aesthetic%2C%20no%20people%2C%208k%20quality%2C%20highly%20detailed%20futuristic%20digital%20landscape&width=1920&height=1080&seq=hero_bg_dark_v2&orientation=landscape"
            alt="Hero background"
            className="w-full h-full object-cover object-center"
          />
        ) : (
          <img
            src="https://readdy.ai/api/search-image?query=bright%20airy%20modern%20technology%20office%20interior%20with%20large%20floor%20to%20ceiling%20windows%2C%20white%20walls%20and%20soft%20warm%20wood%20accents%2C%20abstract%20geometric%20blue%20accent%20shapes%20floating%20in%20clean%20space%2C%20professional%20software%20studio%20environment%2C%20ultra%20wide%20cinematic%20composition%2C%20natural%20daylight%2C%20minimalist%20premium%20design%2C%20no%20people%2C%208k%20quality&width=1920&height=1080&seq=hero_bg_light_v2&orientation=landscape"
            alt="Hero background"
            className="w-full h-full object-cover object-center"
          />
        )}
        </motion.div>
        <div className={`absolute inset-0 ${isDark ? "bg-gradient-to-t from-dc-bg via-dc-bg/75 to-dc-bg/30" : "bg-gradient-to-t from-dc-bg via-dc-bg/80 to-dc-bg/55"}`} />
        <div className={`absolute inset-0 ${isDark ? "bg-gradient-to-r from-dc-bg/85 via-transparent to-dc-bg/40" : "bg-gradient-to-r from-dc-bg/92 via-dc-bg/40 to-dc-bg/60"}`} />
      </div>

      {/* ── Rotating rings (each with own parallax speed for layered depth) ── */}
      {/* Outer ring — slowest parallax, feels most distant */}
      <motion.div
        className="absolute top-1/3 right-[10%] hidden lg:block"
        style={{ y: ring1Y }}
      >
        <motion.div
          className="w-72 h-72 rounded-full border border-accent/10"
          animate={{ rotate: 360 }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          style={{ transformStyle: "preserve-3d" }}
        />
      </motion.div>

      {/* Middle ring — medium parallax */}
      <motion.div
        className="absolute top-[36%] right-[14%] hidden lg:block"
        style={{ y: ring2Y }}
      >
        <motion.div
          className="w-44 h-44 rounded-full border border-accent/20"
          animate={{ rotate: -360 }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          style={{ transformStyle: "preserve-3d" }}
        />
      </motion.div>

      {/* Inner orb — fastest parallax, feels closest */}
      <motion.div
        className="absolute top-[40%] right-[17.5%] hidden lg:block"
        style={{ y: ring3Y }}
      >
        <motion.div
          className="w-20 h-20 rounded-full bg-accent/5"
          animate={{ scale: [1, 1.25, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{ boxShadow: "0 0 30px 8px rgba(185,255,75,0.07)" }}
        />
      </motion.div>

      {/* ── 3D FLOATING CARDS LAYER ── */}
      <div className="absolute inset-0 z-[5] pointer-events-none hidden lg:block" style={{ transformStyle: "preserve-3d" }}>

        {/* Card 1 — Code snippet (deep, left-side) */}
        <FloatingCard
          className="top-[20%] right-[5%]"
          delay={0}
          duration={6}
          amplitude={18}
          mouseX={rawMouseX}
          mouseY={rawMouseY}
          depthFactor={1.4}
        >
          <div className="w-60 bg-[#0d1117]/95 border border-accent/25 rounded-2xl p-4 shadow-2xl"
            style={{ boxShadow: "0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(185,255,75,0.12), inset 0 1px 0 rgba(255,255,255,0.04)" }}>
            <div className="flex items-center gap-1.5 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-accent/70" />
              <span className="ml-2 text-white/20 text-[10px] font-mono">deploy.ts</span>
            </div>
            <pre className="text-[11px] font-mono leading-relaxed">
              <span className="text-purple-400">const</span>
              <span className="text-white/80"> app </span>
              <span className="text-white/40">=</span>
              <span className="text-accent"> new</span>
              <span className="text-sky-400"> Solutions</span>
              <span className="text-white/40">{"({"}</span>
              {"\n"}
              <span className="text-white/40">{"  "}</span>
              <span className="text-orange-300">stack</span>
              <span className="text-white/40">: </span>
              <span className="text-green-400">&quot;React&quot;</span>
              <span className="text-white/40">,</span>
              {"\n"}
              <span className="text-white/40">{"  "}</span>
              <span className="text-orange-300">deploy</span>
              <span className="text-white/40">: </span>
              <span className="text-green-400">&quot;AWS&quot;</span>
              {"\n"}
              <span className="text-white/40">{"});"}</span>
              {"\n"}
              <span className="text-white/30">// ✓ shipped in 2 weeks</span>
            </pre>
          </div>
        </FloatingCard>

        {/* Card 2 — Performance score (front, upper-right) */}
        <FloatingCard
          className="top-[12%] right-[26%]"
          delay={0.8}
          duration={4.5}
          amplitude={12}
          mouseX={rawMouseX}
          mouseY={rawMouseY}
          depthFactor={2.2}
        >
          <div className="bg-dc-card/95 border border-accent/30 rounded-2xl px-5 py-4 flex items-center gap-4 shadow-2xl"
            style={{ boxShadow: "0 20px 50px rgba(0,0,0,0.45), 0 0 0 1px rgba(185,255,75,0.15), inset 0 1px 0 rgba(255,255,255,0.05)" }}>
            <div className="relative w-12 h-12 shrink-0">
              <svg viewBox="0 0 36 36" className="w-12 h-12 -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(185,255,75,0.1)" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#b9ff4b" strokeWidth="3"
                  strokeDasharray="92 100" strokeLinecap="round" />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-accent text-xs font-bold">98</span>
            </div>
            <div>
              <p className="text-white/80 text-sm font-semibold leading-tight">Performance</p>
              <p className="text-accent text-xs font-mono mt-0.5">Core Web Vitals</p>
            </div>
          </div>
        </FloatingCard>

        {/* Card 3 — Deploy status (mid depth) */}
        <FloatingCard
          className="top-[44%] right-[3%]"
          delay={1.5}
          duration={5.5}
          amplitude={16}
          mouseX={rawMouseX}
          mouseY={rawMouseY}
          depthFactor={0.9}
        >
          <div className="bg-dc-card/90 border border-dc-text/10 rounded-xl px-4 py-3 shadow-2xl"
            style={{ boxShadow: "0 16px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)" }}>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-white/60 text-xs font-mono">PRODUCTION</span>
            </div>
            <p className="text-white/85 text-sm font-semibold">v3.4.1 deployed</p>
            <p className="text-white/35 text-[11px] mt-0.5">2 mins ago · 99.99% uptime</p>
          </div>
        </FloatingCard>

        {/* Card 4 — Client rating (back layer, very subtle) */}
        <FloatingCard
          className="top-[58%] right-[22%]"
          delay={2.2}
          duration={7}
          amplitude={10}
          mouseX={rawMouseX}
          mouseY={rawMouseY}
          depthFactor={0.5}
        >
          <div className="bg-dc-card/80 border border-dc-text/8 rounded-xl px-4 py-3 shadow-xl"
            style={{ boxShadow: "0 12px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.03)" }}>
            <div className="flex items-center gap-1 mb-1.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <i key={s} className="ri-star-fill text-accent text-sm" />
              ))}
            </div>
            <p className="text-white/70 text-xs leading-snug max-w-[140px]">
              &ldquo;Shipped in half the time we expected.&rdquo;
            </p>
            <p className="text-white/30 text-[10px] mt-1.5 font-mono">— CTO, Series B startup</p>
          </div>
        </FloatingCard>

        {/* Card 5 — Tech stack badges (mid-front) */}
        <FloatingCard
          className="top-[28%] right-[20%]"
          delay={3}
          duration={5}
          amplitude={20}
          mouseX={rawMouseX}
          mouseY={rawMouseY}
          depthFactor={1.8}
        >
          <div className="flex flex-col gap-1.5">
            {["React", "TypeScript", "AWS", "Docker"].map((tech, i) => (
              <motion.div
                key={tech}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2.4 + i * 0.12, duration: 0.5 }}
                className="flex items-center gap-2 bg-dc-card/85 border border-dc-text/10 rounded-full px-3 py-1.5 shadow-lg"
                style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)" }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                <span className="text-white/65 text-xs font-mono">{tech}</span>
              </motion.div>
            ))}
          </div>
        </FloatingCard>

        {/* Floating geometric accent — glowing orb */}
        <FloatingCard
          className="top-[8%] right-[14%]"
          delay={0.5}
          duration={8}
          amplitude={8}
          mouseX={rawMouseX}
          mouseY={rawMouseY}
          depthFactor={3}
        >
          <div className="w-6 h-6 rounded-full bg-accent/60"
            style={{ boxShadow: "0 0 20px 8px rgba(185,255,75,0.25), 0 0 40px 16px rgba(185,255,75,0.1)" }} />
        </FloatingCard>

        {/* Floating geometric accent — small dot cluster */}
        <FloatingCard
          className="top-[65%] right-[8%]"
          delay={1.2}
          duration={6.5}
          amplitude={6}
          mouseX={rawMouseX}
          mouseY={rawMouseY}
          depthFactor={0.7}
        >
          <div className="grid grid-cols-3 gap-1.5">
            {Array.from({ length: 9 }).map((_, i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-accent/30"
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 2, delay: i * 0.15, repeat: Infinity }}
              />
            ))}
          </div>
        </FloatingCard>
      </div>

      {/* ── Main Content ── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-10 pb-24 pt-44">
        {/* Badge */}
        <motion.div
          className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 text-accent text-xs font-mono px-4 py-2 rounded-full mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse-slow inline-block" />
          Accepting new clients — Q3 2026
        </motion.div>

        {/* Animated Headline */}
        <motion.h2
          className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold text-white leading-[1.04] tracking-tight mb-8 max-w-5xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {headlineWords.map((word, i) => (
            <span
              key={i}
              className="inline-block mr-3 md:mr-5"
              style={{ overflow: "hidden", display: "inline-block", verticalAlign: "bottom" }}
            >
              <motion.span
                variants={wordVariants}
                className="inline-block"
                style={{ color: i === 2 || i === 5 ? "#b9ff4b" : "white" }}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </motion.h2>

        {/* Tagline */}
        <motion.p
          className="text-white/45 text-lg md:text-xl max-w-2xl leading-relaxed mb-12"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
        >
          {tagline}
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-wrap gap-4"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3 }}
        >
          <button
            onClick={() => { const el = document.getElementById("portfolio"); if (el) el.scrollIntoView({ behavior: "smooth" }); }}
            className="flex items-center gap-2 bg-accent text-black font-bold px-8 py-4 rounded-full text-base hover:bg-white transition-colors duration-300 cursor-pointer whitespace-nowrap"
          >
            See Our Work
            <i className="ri-arrow-right-line text-lg"></i>
          </button>
          <button
            onClick={() => { const el = document.getElementById("contact"); if (el) el.scrollIntoView({ behavior: "smooth" }); }}
            className="flex items-center gap-2 border border-white/20 text-white font-medium px-8 py-4 rounded-full text-base hover:border-accent hover:text-accent transition-colors duration-300 cursor-pointer whitespace-nowrap"
          >
            Start a Project
            <i className="ri-message-3-line text-lg"></i>
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="flex flex-wrap gap-8 md:gap-16 mt-20 pt-10 border-t border-white/8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.6 }}
        >
          {[
            { value: 180, suffix: "+", label: "Projects Shipped" },
            { value: 98, suffix: "%", label: "Client Satisfaction" },
            { value: 10, suffix: "+", label: "Years in Business" },
            { value: 60, suffix: "+", label: "Expert Engineers" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl md:text-4xl font-bold text-white">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-white/35 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── Scroll hint ── */}
      <motion.button
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 cursor-pointer"
        onClick={handleScroll}
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        aria-label="Scroll down"
      >
        <span className="text-white/25 text-xs font-mono tracking-widest">SCROLL</span>
        <i className="ri-arrow-down-line text-white/25 text-lg"></i>
      </motion.button>
    </section>
  );
}