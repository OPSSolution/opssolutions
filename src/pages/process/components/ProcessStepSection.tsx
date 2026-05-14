import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export interface ProcessStep {
  number: string;
  phase: string;
  title: string;
  subtitle: string;
  duration: string;
  icon: string;
  description: string;
  activities: string[];
  deliverables: string[];
  tools: string[];
  outcome: string;
}

interface Props {
  step: ProcessStep;
  index: number;
  total: number;
  onNext: () => void;
  onContact: () => void;
}

export default function ProcessStepSection({ step, index, total, onNext, onContact }: Props) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: false, margin: "-30%" });
  const isLast = index === total - 1;

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center px-6 md:px-10 py-24"
    >
      {/* Giant phase number in background */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1 }}
      >
        <span
          className="text-[28vw] font-black text-white/[0.02] leading-none"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {step.number}
        </span>
      </motion.div>

      {/* Glowing accent orb behind card */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(185,255,75,0.06) 0%, transparent 70%)" }}
        animate={inView ? { scale: [1, 1.15, 1], opacity: [0.4, 0.8, 0.4] } : {}}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Glass card */}
      <motion.div
        className="relative w-full max-w-4xl"
        initial={{ opacity: 0, y: 60, rotateX: 8 }}
        animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 60, rotateX: 8 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformPerspective: 1400 }}
      >
        <div
          className="rounded-3xl border border-white/10 overflow-hidden"
          style={{
            background: "rgba(10, 12, 16, 0.82)",
            backdropFilter: "blur(28px)",
            WebkitBackdropFilter: "blur(28px)",
            boxShadow: "0 0 0 1px rgba(185,255,75,0.08), 0 40px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)",
          }}
        >
          {/* Top bar */}
          <div className="flex items-center justify-between px-8 py-5 border-b border-white/6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-accent/12 border border-accent/22">
                <i className={`${step.icon} text-accent text-lg`} />
              </div>
              <div>
                <p className="text-accent text-[10px] font-mono tracking-widest">
                  PHASE {step.number} · {step.duration}
                </p>
                <p className="text-white/60 text-xs mt-0.5">{step.subtitle}</p>
              </div>
            </div>
            {/* Progress pips */}
            <div className="hidden sm:flex items-center gap-1.5">
              {Array.from({ length: total }).map((_, i) => (
                <motion.div
                  key={i}
                  className="rounded-full"
                  animate={{
                    width: i === index ? 20 : 6,
                    backgroundColor: i === index ? "#b9ff4b" : i < index ? "rgba(185,255,75,0.35)" : "rgba(255,255,255,0.1)",
                  }}
                  transition={{ duration: 0.4 }}
                  style={{ height: 6 }}
                />
              ))}
            </div>
          </div>

          {/* Body */}
          <div className="p-8 md:p-10">
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              {step.title}
            </motion.h2>

            <motion.p
              className="text-white/55 text-sm md:text-base leading-relaxed mb-8 max-w-2xl"
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ duration: 0.7, delay: 0.25 }}
            >
              {step.description}
            </motion.p>

            {/* Three-column detail grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {/* Activities */}
              <motion.div
                className="rounded-2xl p-5"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <p className="text-accent text-[10px] font-mono tracking-widest mb-3">ACTIVITIES</p>
                <ul className="flex flex-col gap-2">
                  {step.activities.slice(0, 4).map((act, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <i className="ri-check-line text-accent/60 text-xs mt-0.5 shrink-0" />
                      <span className="text-white/50 text-xs leading-relaxed">{act}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Deliverables */}
              <motion.div
                className="rounded-2xl p-5"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <p className="text-accent text-[10px] font-mono tracking-widest mb-3">DELIVERABLES</p>
                <ul className="flex flex-col gap-2">
                  {step.deliverables.map((d, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <i className="ri-file-check-line text-accent/50 text-xs mt-0.5 shrink-0" />
                      <span className="text-white/50 text-xs leading-relaxed">{d}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Tools + outcome */}
              <motion.div
                className="rounded-2xl p-5 flex flex-col gap-4"
                style={{ background: "rgba(185,255,75,0.04)", border: "1px solid rgba(185,255,75,0.12)" }}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <div>
                  <p className="text-accent text-[10px] font-mono tracking-widest mb-3">TOOLS</p>
                  <div className="flex flex-wrap gap-1.5">
                    {step.tools.map((tool) => (
                      <span key={tool} className="text-[10px] font-mono text-accent/70 bg-accent/8 border border-accent/15 px-2 py-1 rounded-full">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-accent text-[10px] font-mono tracking-widest mb-2">OUTCOME</p>
                  <p className="text-white/70 text-xs leading-relaxed italic">&ldquo;{step.outcome}&rdquo;</p>
                </div>
              </motion.div>
            </div>

            {/* Action row */}
            <motion.div
              className="flex items-center justify-between gap-4"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <div className="flex items-center gap-2 text-white/30 text-xs font-mono">
                <i className="ri-mouse-line text-accent/50 text-sm" />
                Scroll to advance
              </div>
              <div className="flex gap-3">
                <button
                  onClick={onContact}
                  className="flex items-center gap-2 border border-white/12 text-white/50 text-xs px-5 py-2.5 rounded-xl hover:border-accent/30 hover:text-accent transition-colors cursor-pointer whitespace-nowrap"
                >
                  Start a Project
                </button>
                {!isLast && (
                  <button
                    onClick={onNext}
                    className="flex items-center gap-2 bg-accent text-black text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-white transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Next: Phase {String(index + 2).padStart(2, "0")} <i className="ri-arrow-right-line" />
                  </button>
                )}
                {isLast && (
                  <button
                    onClick={onContact}
                    className="flex items-center gap-2 bg-accent text-black text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-white transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Start Your Project <i className="ri-rocket-2-line" />
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}