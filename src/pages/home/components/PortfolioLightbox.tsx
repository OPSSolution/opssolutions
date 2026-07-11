import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { use3DTilt } from "@/hooks/use3DTilt";

export interface LightboxProject {
  id: number;
  title: string;
  category: string;
  description: string;
  tags: string[];
  year: string;
  slug: string;
  image: string;
  result: string;
  number: string;
  challenge?: string;
  approach?: string;
  metrics?: { label: string; value: string }[];
}

interface PortfolioLightboxProps {
  project: LightboxProject | null;
  onClose: () => void;
}

const DEFAULT_METRICS = [
  { label: "Timeline", value: "12 wks" },
  { label: "Team", value: "8 devs" },
  { label: "Uptime", value: "99.99%" },
];

function FloatingBadge({
  text,
  icon,
  style,
  delay,
}: {
  text: string;
  icon: string;
  style: React.CSSProperties;
  delay: number;
}) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const dx = useSpring(useTransform(mouseX, [-300, 300], [-10, 10]), { stiffness: 80, damping: 22 });
  const dy = useSpring(useTransform(mouseY, [-300, 300], [-8, 8]), { stiffness: 80, damping: 22 });

  const handleMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX - window.innerWidth / 2);
    mouseY.set(e.clientY - window.innerHeight / 2);
  };

  return (
    <motion.div
      className="absolute z-20 pointer-events-none hidden lg:flex"
      style={{ ...style, x: dx, y: dy }}
      initial={{ opacity: 0, scale: 0.6, y: 20 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: [0, -8, 0],
      }}
      transition={{
        opacity: { duration: 0.5, delay },
        scale: { duration: 0.5, delay },
        y: { duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: delay * 0.5 },
      }}
      onMouseMove={handleMove}
    >
      <div className="flex items-center gap-2 bg-dc-bg/90 border border-accent/25 backdrop-blur-sm rounded-xl px-3.5 py-2.5">
        <i className={`${icon} text-accent text-sm`}></i>
        <span className="text-dc-text/80 text-xs font-mono whitespace-nowrap">{text}</span>
      </div>
    </motion.div>
  );
}

function MetricPill({
  metric,
  index,
}: {
  metric: { label: string; value: string };
  index: number;
}) {
  const { cardRef, rotateX, rotateY, handleMouseMove, handleMouseLeave } = use3DTilt({
    maxRotateX: 8,
    maxRotateY: 12,
  });

  return (
    <motion.div
      ref={cardRef as React.RefObject<HTMLDivElement>}
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.35 + index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="flex flex-col items-center text-center bg-dc-bg/50 border border-dc-text/8 rounded-xl p-4 gap-1"
      style={{ rotateX, rotateY, transformPerspective: 600, transformStyle: "preserve-3d" }}
    >
      <span className="text-2xl font-bold text-dc-text">{metric.value}</span>
      <span className="text-dc-text/35 text-xs">{metric.label}</span>
    </motion.div>
  );
}

export default function PortfolioLightbox({ project, onClose }: PortfolioLightboxProps) {
  const navigate = useNavigate();
  const overlayRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when open
  useEffect(() => {
    if (project) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [project]);

  // Escape key to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const metrics = project?.metrics ?? DEFAULT_METRICS;

  return createPortal(
    <AnimatePresence>
      {project && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[80] bg-black/85"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            ref={overlayRef}
            className="fixed inset-0 z-[81] flex items-center justify-center p-4 md:p-8 pointer-events-none"
          >
            <motion.div
              className="relative w-full max-w-6xl max-h-[90vh] bg-dc-bg border border-dc-text/10 rounded-3xl overflow-hidden pointer-events-auto flex flex-col lg:flex-row"
              initial={{ opacity: 0, y: 60, scale: 0.93 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{ boxShadow: "0 40px 120px rgba(0,0,0,0.7), 0 0 0 1px rgba(41,171,226,0.08)" }}
            >
              {/* ─── Left: Image pane ─────────────────────────────── */}
              <div className="relative w-full h-[220px] sm:h-[260px] lg:h-auto lg:w-[55%] lg:min-h-[260px] lg:max-h-[90vh] shrink-0 overflow-hidden bg-white">
                <motion.img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-contain"
                  initial={{ scale: 1.08 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-dc-bg/80 via-dc-bg/15 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-dc-bg/60 hidden lg:block" />

                {/* Category pill */}
                <motion.div
                  className="absolute top-5 left-5"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.45, delay: 0.2 }}
                >
                  <span className="flex items-center gap-2 bg-accent text-black text-xs font-bold px-3.5 py-1.5 rounded-full">
                    <i className="ri-folder-line text-xs"></i>
                    {project.category}
                  </span>
                </motion.div>

                {/* Year badge */}
                <motion.div
                  className="absolute top-5 right-5"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.45, delay: 0.25 }}
                >
                  <span className="text-white/50 text-xs font-mono bg-black/40 backdrop-blur-sm border border-white/10 px-2.5 py-1.5 rounded-lg">
                    {project.year}
                  </span>
                </motion.div>

                {/* Decorative number */}
                <motion.span
                  className="absolute bottom-5 left-6 text-8xl font-bold font-mono text-white/[0.06] select-none leading-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  {project.number}
                </motion.span>

                {/* Result ribbon */}
                <motion.div
                  className="absolute bottom-5 right-5"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <div className="flex items-center gap-2 bg-accent/15 border border-accent/30 backdrop-blur-sm text-accent text-xs font-mono px-3 py-2 rounded-xl">
                    <i className="ri-bar-chart-fill text-sm"></i>
                    {project.result}
                  </div>
                </motion.div>
              </div>

              {/* ─── Right: Details pane ──────────────────────────── */}
              <div className="flex flex-col flex-1 min-h-0 overflow-y-auto p-7 md:p-10 gap-6 relative">
                {/* Close button */}
                <motion.button
                  onClick={onClose}
                  className="absolute top-5 right-5 w-9 h-9 flex items-center justify-center rounded-full bg-dc-text/8 border border-dc-text/12 text-dc-text/50 hover:text-dc-text hover:bg-dc-text/15 hover:border-dc-text/25 transition-all duration-200 cursor-pointer z-10"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.92 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <i className="ri-close-line text-base"></i>
                </motion.button>

                {/* Label */}
                <motion.p
                  className="text-accent text-xs font-mono tracking-widest"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.15 }}
                >
                  CASE STUDY PREVIEW
                </motion.p>

                {/* Title */}
                <motion.h2
                  className="text-3xl md:text-4xl font-bold text-dc-text leading-tight -mt-2"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                >
                  {project.title}
                </motion.h2>

                {/* Description */}
                <motion.p
                  className="text-dc-text/55 text-sm leading-relaxed"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.27 }}
                >
                  {project.description}
                </motion.p>

                {/* Challenge block */}
                <motion.div
                  className="bg-dc-card/60 border border-dc-text/8 rounded-xl p-4"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.32 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <i className="ri-lightbulb-flash-line text-accent text-sm"></i>
                    <span className="text-dc-text/50 text-xs font-mono tracking-wider">THE CHALLENGE</span>
                  </div>
                  <p className="text-dc-text/65 text-xs leading-relaxed">
                    {project.challenge ??
                      "The client needed a complete overhaul of their platform, balancing performance at scale with a seamless user experience and tight delivery timelines."}
                  </p>
                </motion.div>

                {/* Metrics row */}
                <div className="grid grid-cols-3 gap-3">
                  {metrics.map((m, i) => (
                    <MetricPill key={m.label} metric={m} index={i} />
                  ))}
                </div>

                {/* Tags */}
                <motion.div
                  className="flex flex-wrap gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.45, delay: 0.42 }}
                >
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-mono text-accent/70 bg-accent/8 border border-accent/18 px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </motion.div>

                {/* Divider */}
                <motion.div
                  className="h-px bg-dc-text/8"
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.45 }}
                  style={{ transformOrigin: "left" }}
                />

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                  <motion.button
                    onClick={() => navigate(`/work/${project.slug}`)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex-1 flex items-center justify-center gap-2 bg-accent text-black text-sm font-bold py-3.5 rounded-xl hover:bg-white transition-colors duration-300 cursor-pointer whitespace-nowrap"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.5 }}
                  >
                    View Full Case Study
                    <i className="ri-arrow-right-line"></i>
                  </motion.button>
                  <motion.button
                    onClick={onClose}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center justify-center gap-2 border border-dc-text/15 text-dc-text/60 text-sm font-medium px-6 py-3.5 rounded-xl hover:border-dc-text/30 hover:text-dc-text transition-colors duration-300 cursor-pointer whitespace-nowrap"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.55 }}
                  >
                    <i className="ri-arrow-left-line text-sm"></i>
                    Back to Portfolio
                  </motion.button>
                </div>
              </div>

              {/* Decorative glow */}
              <div
                className="absolute top-0 right-0 w-72 h-72 pointer-events-none"
                style={{ background: "radial-gradient(circle at top right, rgba(41,171,226,0.04) 0%, transparent 65%)" }}
              />
              <div
                className="absolute bottom-0 left-0 w-48 h-48 pointer-events-none"
                style={{ background: "radial-gradient(circle at bottom left, rgba(41,171,226,0.03) 0%, transparent 65%)" }}
              />
            </motion.div>
          </motion.div>

          {/* Floating depth badges */}
          <FloatingBadge
            text="Deployed to production"
            icon="ri-rocket-line"
            style={{ top: "12%", right: "4%" }}
            delay={0.6}
          />
          <FloatingBadge
            text="99.99% uptime"
            icon="ri-server-line"
            style={{ bottom: "18%", right: "3%" }}
            delay={0.75}
          />
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}