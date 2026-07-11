import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface StatItem {
  value: number;
  suffix: string;
  prefix?: string;
  label: string;
  sublabel: string;
  icon: string;
  accentColor?: string;
}

const stats: StatItem[] = [
  { value: 6, suffix: "", label: "Projects This Year", sublabel: "Shipped to production", icon: "ri-rocket-2-line" },
  { value: 100, suffix: "%",label: "Custom Solutions", sublabel: "Built to client needs", icon: "ri-code-s-slash-line",},
  { value: 98, suffix: "%", label: "Client Retention", sublabel: "Clients who come back", icon: "ri-heart-3-line" },
  { value: 1, suffix: "", label: "Mission", sublabel: "Building reliable software", icon: "ri-lightbulb-line",},
  { value: 10,suffix: "+", label: "Technologies", sublabel: "Laravel, React, Flutter & more", icon: "ri-stack-line",},
  { value: 100,suffix: "%", label: "Commitment", sublabel: "Focused on client success", icon: "ri-customer-service-2-line",},
];

// ─── Odometer digit reel ─────────────────────────────────────────────────────
interface DigitReelProps {
  digit: number;
  delay: number;
  inView: boolean;
  digitHeight: number;
}

function DigitReel({ digit, delay, inView, digitHeight }: DigitReelProps) {
  return (
    <span
      className="inline-block overflow-hidden relative"
      style={{ height: digitHeight, verticalAlign: "bottom" }}
    >
      <motion.span
        className="flex flex-col"
        style={{ lineHeight: `${digitHeight}px` }}
        initial={{ y: 0 }}
        animate={inView ? { y: -(digit * digitHeight) } : { y: 0 }}
        transition={{
          duration: 1.3 + digit * 0.04,
          delay,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
          <span
            key={d}
            className="block tabular-nums"
            style={{ height: digitHeight, lineHeight: `${digitHeight}px` }}
          >
            {d}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

// ─── Full animated number ─────────────────────────────────────────────────────
interface OdometerNumberProps {
  value: number;
  suffix: string;
  prefix?: string;
  inView: boolean;
  baseDelay: number;
}

function OdometerNumber({ value, suffix, prefix, inView, baseDelay }: OdometerNumberProps) {
  const digits = String(value).split("").map(Number);
  const DIGIT_H = 52; // px — matches roughly text-5xl with leading-none

  return (
    <div className="flex items-end leading-none select-none" style={{ lineHeight: `${DIGIT_H}px` }}>
      {prefix && (
        <span
          className="text-dc-text/50 font-bold pb-0.5 mr-0.5"
          style={{ fontSize: DIGIT_H * 0.52, lineHeight: `${DIGIT_H}px` }}
        >
          {prefix}
        </span>
      )}

      {/* Digit reels */}
      <span
        className="font-bold text-dc-text"
        style={{ fontSize: DIGIT_H, lineHeight: `${DIGIT_H}px` }}
      >
        {digits.map((d, i) => (
          <DigitReel
            key={i}
            digit={d}
            delay={baseDelay + (digits.length - 1 - i) * 0.07}
            inView={inView}
            digitHeight={DIGIT_H}
          />
        ))}
      </span>

      {/* Suffix */}
      {suffix && (
        <motion.span
          className="text-accent font-bold ml-0.5"
          style={{ fontSize: DIGIT_H * 0.58, lineHeight: `${DIGIT_H}px`, paddingBottom: 2 }}
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.5, delay: baseDelay + digits.length * 0.07 + 0.2 }}
        >
          {suffix}
        </motion.span>
      )}
    </div>
  );
}

// ─── Individual stat card ─────────────────────────────────────────────────────
function StatCard({ item, index }: { item: StatItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  const yOffset = index % 2 === 0 ? 60 : 40;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: yOffset, rotateX: 18 }}
      animate={
        inView
          ? { opacity: 1, y: 0, rotateX: 0 }
          : {}
      }
      transition={{
        duration: 0.75,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: -6,
        rotateX: -3,
        transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
      }}
      className="group relative flex flex-col items-center text-center px-4 py-8 rounded-2xl bg-dc-text/[0.03] border border-dc-text/[0.06] hover:border-accent/30 transition-colors duration-400 cursor-default overflow-hidden"
      style={{ transformPerspective: 800, transformStyle: "preserve-3d" }}
    >
      {/* Hover radial glow */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
        style={{ background: "radial-gradient(circle at 50% 90%, rgba(41,171,226,0.06) 0%, transparent 70%)" }}
      />

      {/* Icon */}
      <motion.div
        className="w-12 h-12 flex items-center justify-center rounded-xl bg-accent/10 border border-accent/20 mb-5 group-hover:bg-accent/18 transition-colors duration-300"
        whileHover={{ scale: 1.14, rotate: -8 }}
        transition={{ type: "spring", stiffness: 350, damping: 18 }}
      >
        <i className={`${item.icon} text-accent text-xl`}></i>
      </motion.div>

      {/* Odometer number */}
      <div className="mb-2">
        <OdometerNumber
          value={item.value}
          suffix={item.suffix}
          prefix={item.prefix}
          inView={inView}
          baseDelay={index * 0.1 + 0.15}
        />
      </div>

      {/* Land flash — brief green underline when digits settle */}
      <motion.div
        className="h-px w-0 bg-accent/50 mb-3"
        animate={inView ? { width: "2.5rem" } : { width: 0 }}
        transition={{
          duration: 0.35,
          delay: index * 0.1 + 1.5,
          ease: "easeOut",
        }}
      />

      <p className="text-dc-text font-semibold text-sm mb-0.5 group-hover:text-accent transition-colors duration-300">
        {item.label}
      </p>
      <p className="text-dc-text/35 text-xs">{item.sublabel}</p>

      {/* Corner glow burst on landing */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        initial={{ boxShadow: "inset 0 0 0 1px rgba(41,171,226,0.55)" }}
        animate={
          inView
            ? { boxShadow: "inset 0 0 0 1px rgba(41,171,226,0)" }
            : { boxShadow: "inset 0 0 0 1px rgba(41,171,226,0)" }
        }
        transition={{ duration: 1.4, delay: index * 0.1 + 1.3, ease: "easeOut" }}
      />
    </motion.div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
export default function StatsSection() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });

  return (
    <section className="relative bg-dc-surface py-20 md:py-28 overflow-hidden">
      {/* Ambient blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-1/2 left-[12%] w-72 h-72 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(41,171,226,0.05) 0%, transparent 70%)" }}
          animate={{ x: [0, 22, 0], y: [0, -18, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/3 right-[8%] w-80 h-80 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(41,171,226,0.04) 0%, transparent 70%)" }}
          animate={{ x: [0, -20, 0], y: [0, 22, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-10">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-14">
          <motion.p
            className="text-accent text-xs font-mono tracking-widest mb-3"
            initial={{ opacity: 0, y: 16 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            BY THE NUMBERS
          </motion.p>
          <div className="overflow-hidden">
            <motion.h2
              className="text-3xl md:text-5xl font-bold text-dc-text"
              initial={{ y: "110%" }}
              animate={headerInView ? { y: 0 } : {}}
              transition={{ duration: 0.75, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            >
              Real metrics.{" "}
              <span className="text-accent">Real impact.</span>
            </motion.h2>
          </div>
          <motion.p
            className="text-dc-text/45 text-sm mt-3 max-w-sm mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={headerInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
          >
            We measure our success by the results we deliver — not the promises we make.
          </motion.p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {stats.map((item, i) => (
            <StatCard key={item.label} item={item} index={i} />
          ))}
        </div>

        {/* Marquee strip — pure CSS animation, no JS frame cost */}
        <div className="mt-16 overflow-hidden">
          <div
            className="flex gap-10 whitespace-nowrap w-max"
            style={{ animation: "stats-marquee 22s linear infinite" }}
          >
            {[...Array(3)].map((_, outerIdx) => (
              <div key={outerIdx} className="flex gap-10 shrink-0">
                {[
                  ["ri-trophy-line", "97% On-Time Delivery"],
                  ["ri-shield-check-line", "Zero Critical CVEs"],
                  ["ri-star-fill", "4.9★ Average Rating"],
                  ["ri-code-box-line", "100% Code Ownership"],
                  ["ri-customer-service-2-line", "24/7 Post-Launch Support"],
                  ["ri-award-line", "23 Industry Awards"],
                ].map(([icon, text]) => (
                  <span
                    key={text}
                    className="flex items-center gap-2.5 text-dc-text/20 text-xs font-mono tracking-widest uppercase shrink-0"
                  >
                    <i className={`${icon} text-accent/50 text-sm`}></i>
                    {text}
                    <span className="text-accent/30 ml-2">✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
          <style>{`
            @keyframes stats-marquee {
              0% { transform: translateX(0); }
              100% { transform: translateX(-33.333%); }
            }
          `}</style>
        </div>
      </div>
    </section>
  );
}