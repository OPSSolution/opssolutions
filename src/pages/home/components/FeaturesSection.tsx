import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { use3DTilt } from "@/hooks/use3DTilt";
import AnimatedText from "@/components/base/AnimatedText";
import FeatureCrystalCanvas from "@/pages/home/components/FeatureCrystalCanvas";

const features = [
  {
    number: "01",
    title: "Agile by Default",
    description: "We ship in two-week sprints with full transparency. Daily standups, bi-weekly demos, and a dedicated Slack channel so you always know what's happening.",
    icon: "ri-loop-right-line",
  },
  {
    number: "02",
    title: "Performance-First Engineering",
    description: "Every line of code is reviewed for performance impact. We obsess over Core Web Vitals, load times, and scalability so your product handles millions of users.",
    icon: "ri-speed-up-line",
  },
  {
    number: "03",
    title: "Security at Every Layer",
    description: "Security isn't an afterthought — it's baked in. Automated vulnerability scanning, OWASP compliance, and zero-trust architecture patterns by default.",
    icon: "ri-shield-check-line",
  },
  {
    number: "04",
    title: "Lifetime Code Ownership",
    description: "You own 100% of the code, forever. No vendor lock-in, clean documentation, and a smooth handoff process so your internal team can take over anytime.",
    icon: "ri-key-2-line",
  },
];

const whyUs = [
  { icon: "ri-team-line", label: "Senior-only engineers", value: "Top 5%" },
  { icon: "ri-calendar-check-line", label: "On-time delivery rate", value: "97%" },
  { icon: "ri-translate-2", label: "Languages & timezones", value: "12+" },
  { icon: "ri-award-line", label: "Industry awards", value: "23" },
  { icon: "ri-code-box-line", label: "Lines of code shipped", value: "50M+" },
  { icon: "ri-customer-service-2-line", label: "Post-launch support", value: "24/7" },
];

function FeatureCard({ feat, index }: { feat: typeof features[0]; index: number }) {
  const inViewRef = useRef<HTMLDivElement>(null);
  const inView = useInView(inViewRef, { once: true, margin: "-70px" });
  const { cardRef, rotateX, rotateY, handleMouseMove, handleMouseLeave } = use3DTilt({ maxRotateX: 7, maxRotateY: 10 });

  return (
    <motion.div
      ref={(el) => {
        (inViewRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
        (cardRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
      }}
      initial={{ opacity: 0, y: 50, filter: "blur(8px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative bg-dc-card border border-dc-text/6 rounded-2xl p-8 overflow-hidden hover:border-accent/25 transition-colors duration-400 cursor-pointer"
      style={{ rotateX, rotateY, transformPerspective: 900, transformStyle: "preserve-3d" }}
    >
      {/* Hover bg sweep */}
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: "radial-gradient(ellipse at 20% 20%, rgba(185,255,75,0.04) 0%, transparent 60%)" }}
      />

      {/* Background number */}
      <span className="absolute top-4 right-6 text-7xl font-bold text-dc-text/[0.03] select-none font-mono">
        {feat.number}
      </span>

      <div className="flex items-start gap-5">
        <motion.div
          className="w-12 h-12 flex items-center justify-center shrink-0 rounded-xl bg-accent/10 border border-accent/20"
          whileHover={{ scale: 1.14, rotate: -8 }}
          transition={{ type: "spring", stiffness: 350, damping: 18 }}
        >
          <i className={`${feat.icon} text-accent text-xl`}></i>
        </motion.div>
        <div>
          <h3 className="text-dc-text font-semibold text-xl mb-3 group-hover:text-accent transition-colors duration-300">
            {feat.title}
          </h3>
          <p className="text-dc-text/45 text-sm leading-relaxed">{feat.description}</p>
        </div>
      </div>

      {/* Bottom reveal line */}
      <motion.div
        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-accent/0 via-accent/60 to-accent/0"
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.4 }}
        style={{ transformOrigin: "left" }}
      />
    </motion.div>
  );
}

export default function FeaturesSection() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });
  const metricsRef = useRef<HTMLDivElement>(null);
  const metricsInView = useInView(metricsRef, { once: true, margin: "-60px" });

  return (
    <section id="features" className="bg-dc-surface py-28 md:py-36 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-20">
          {/* Label */}
          <div className="overflow-hidden mb-4">
            <motion.p
              className="text-accent text-sm font-mono tracking-widest"
              initial={{ y: 20, opacity: 0 }}
              animate={headerInView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.55 }}
            >
              WHY CHOOSE US
            </motion.p>
          </div>
          {/* Headline word-by-word */}
          <h2 className="text-4xl md:text-6xl font-bold inline-flex flex-wrap justify-center gap-x-[0.25em]">
            <AnimatedText
              text="Features"
              as="span"
              className="text-dc-text text-4xl md:text-6xl font-bold"
              delay={0.1}
              stagger={0.065}
              mode="chars"
            />
            <AnimatedText
              text="that"
              as="span"
              className="text-dc-text text-4xl md:text-6xl font-bold"
              delay={0.52}
              stagger={0.07}
            />
            <AnimatedText
              text="Matter"
              as="span"
              className="text-accent text-4xl md:text-6xl font-bold"
              delay={0.64}
              stagger={0.06}
              mode="chars"
            />
          </h2>
        </div>

        {/* 3D Crystal Centerpiece */}
        <div className="relative mb-8 flex flex-col items-center">
          <FeatureCrystalCanvas />
          {/* Label badge */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-dc-text/8 border border-accent/20 text-accent text-xs font-mono px-4 py-2 rounded-full backdrop-blur-sm pointer-events-none">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse inline-block" />
            Core capabilities — rendered in real-time 3D
          </div>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-20">
          {features.map((feat, i) => (
            <FeatureCard key={feat.number} feat={feat} index={i} />
          ))}
        </div>

        {/* Metrics strip */}
        <motion.div
          ref={metricsRef}
          className="bg-dc-card border border-dc-text/6 rounded-2xl p-8 md:p-12 overflow-hidden relative"
          initial={{ opacity: 0, y: 40, filter: "blur(6px)" }}
          animate={metricsInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.7 }}
        >
          {/* Decorative bg */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(185,255,75,0.04) 0%, transparent 70%)" }} />

          <p className="text-dc-text/30 text-xs font-mono tracking-widest mb-8 text-center">BY THE NUMBERS</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-4">
            {whyUs.map((item, i) => (
              <motion.div
                key={item.label}
                className="flex flex-col items-center text-center gap-3"
                initial={{ opacity: 0, y: 28, scale: 0.9 }}
                animate={metricsInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ duration: 0.55, delay: 0.1 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.div
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-dc-text/5"
                  whileHover={{ scale: 1.15, backgroundColor: "rgba(185,255,75,0.12)" }}
                  transition={{ type: "spring", stiffness: 350 }}
                >
                  <i className={`${item.icon} text-accent text-base`}></i>
                </motion.div>
                <span className="text-2xl font-bold text-dc-text">{item.value}</span>
                <span className="text-dc-text/30 text-xs leading-snug">{item.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Marquee */}
        <div className="mt-16 overflow-hidden">
          <motion.div
            className="flex gap-12 whitespace-nowrap"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          >
            {[...Array(2)].map((_, outerIdx) => (
              <div key={outerIdx} className="flex gap-12">
                {["React", "TypeScript", "Node.js", "AWS", "Docker", "Flutter", "GraphQL", "PostgreSQL", "Kubernetes", "TensorFlow"].map((tech) => (
                  <span key={tech} className="text-dc-text/20 text-sm font-mono tracking-widest uppercase shrink-0">
                    {tech} <span className="text-accent">✦</span>
                  </span>
                ))}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}