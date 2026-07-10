import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface Badge {
  name: string;
  icon: string;
  color: string;
}

const row1: Badge[] = [
  { name: "React", icon: "ri-reactjs-line", color: "#61dafb" },
  { name: "TypeScript", icon: "ri-code-s-slash-line", color: "#3178c6" },
  { name: "Node.js", icon: "ri-server-line", color: "#68a063" },
  { name: "AWS", icon: "ri-cloud-line", color: "#ff9900" },
  { name: "Docker", icon: "ri-box-3-line", color: "#2496ed" },
  { name: "PostgreSQL", icon: "ri-database-2-line", color: "#336791" },
  { name: "Python", icon: "ri-braces-line", color: "#3776ab" },
  { name: "Kubernetes", icon: "ri-sailboat-line", color: "#326ce5" },
  { name: "GraphQL", icon: "ri-share-circle-line", color: "#e10098" },
  { name: "Redis", icon: "ri-flashlight-line", color: "#dc382d" },
  { name: "Terraform", icon: "ri-git-branch-line", color: "#7b42bc" },
  { name: "Next.js", icon: "ri-window-line", color: "#d4d4d4" },
];

const row2: Badge[] = [
  { name: "Flutter", icon: "ri-smartphone-line", color: "#54c5f8" },
  { name: "Go", icon: "ri-code-box-line", color: "#00acd7" },
  { name: "OpenAI", icon: "ri-robot-line", color: "#29abe2" },
  { name: "LangChain", icon: "ri-links-line", color: "#7cb9e8" },
  { name: "Datadog", icon: "ri-bar-chart-2-line", color: "#632ca6" },
  { name: "Stripe", icon: "ri-bank-card-line", color: "#9d86e9" },
  { name: "Firebase", icon: "ri-fire-line", color: "#ffca28" },
  { name: "Vue.js", icon: "ri-vuejs-line", color: "#42b883" },
  { name: "MongoDB", icon: "ri-leaf-line", color: "#4db33d" },
  { name: "FastAPI", icon: "ri-speed-up-line", color: "#009688" },
  { name: "GitHub Actions", icon: "ri-github-line", color: "#2dba4e" },
  { name: "D3.js", icon: "ri-line-chart-line", color: "#f9a03c" },
];

function TiltBadge({ badge }: { badge: Badge }) {
  const [tiltX, setTiltX] = useState(0);
  const [tiltY, setTiltY] = useState(0);
  const [hovered, setHovered] = useState(false);
  const badgeRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = badgeRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    setTiltX(-y * 10);
    setTiltY(x * 10);
  };

  const handleMouseLeave = () => {
    setTiltX(0);
    setTiltY(0);
    setHovered(false);
  };

  return (
    <div
      ref={badgeRef}
      className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white/[0.04] border border-white/[0.07] cursor-default select-none shrink-0 relative overflow-hidden transition-all duration-200"
      style={{
        transform: `perspective(400px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(${hovered ? 1.07 : 1})`,
        transition: hovered ? "transform 0.1s ease" : "transform 0.3s ease",
        boxShadow: hovered ? `inset 0 0 0 1px ${badge.color}35` : "none",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* Glow background on hover */}
      <div
        className="absolute inset-0 rounded-full transition-opacity duration-200"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${badge.color}12 0%, transparent 70%)`,
          opacity: hovered ? 1 : 0,
        }}
      />

      <div
        className="w-5 h-5 flex items-center justify-center shrink-0 relative z-10 transition-colors duration-200"
        style={{ color: hovered ? badge.color : "rgba(255,255,255,0.70)" }}
      >
        <i className={`${badge.icon} text-sm`}></i>
      </div>

      <span
        className="text-xs font-medium relative z-10 whitespace-nowrap transition-colors duration-200"
        style={{ color: hovered ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.78)" }}
      >
        {badge.name}
      </span>
    </div>
  );
}

// ─── Pure CSS marquee row ─────────────────────────────────────────────────────
// Uses CSS animation instead of framer-motion for zero JS animation overhead

function MarqueeRow({
  badges,
  direction = "left",
  duration = 40,
}: {
  badges: Badge[];
  direction?: "left" | "right";
  duration?: number;
}) {
  // Triple the badges so there's no gap during infinite scroll
  const items = [...badges, ...badges, ...badges];
  const animationName = direction === "left" ? "marquee-left" : "marquee-right";

  return (
    <div className="relative overflow-hidden py-1.5">
      {/* Edge fades */}
      <div
        className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to right, rgb(12 20 38), transparent)" }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to left, rgb(12 20 38), transparent)" }}
      />

      <div
        className="flex gap-2.5 w-max"
        style={{
          animation: `${animationName} ${duration}s linear infinite`,
        }}
      >
        {items.map((badge, i) => (
          <TiltBadge key={`${badge.name}-${i}`} badge={badge} />
        ))}
      </div>

      <style>{`
        @keyframes marquee-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        @keyframes marquee-right {
          0% { transform: translateX(-33.333%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}

export default function TechBadgesMarquee() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section ref={sectionRef} className="relative bg-dc-surface py-16 md:py-20 overflow-hidden">
      {/* Top border */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, rgba(41,171,226,0.15) 30%, rgba(41,171,226,0.15) 70%, transparent)" }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={inView ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ duration: 0.9 }}
      />
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, rgba(41,171,226,0.08) 30%, rgba(41,171,226,0.08) 70%, transparent)" }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={inView ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ duration: 0.9, delay: 0.1 }}
      />

      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(41,171,226,0.02) 0%, transparent 65%)" }}
      />

      {/* Header */}
      <motion.div
        className="text-center mb-8 md:mb-10 px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <p className="text-white/50 text-xs font-mono tracking-[0.3em] uppercase mb-2">
          Battle-tested stack
        </p>
        <h3 className="text-white/80 text-sm md:text-base font-medium">
          Technologies we deploy in{" "}
          <span className="text-[#29abe2]">production every day</span>
        </h3>
      </motion.div>

      {/* Marquee rows — CSS animated, no JS frame cost */}
      <motion.div
        className="flex flex-col gap-2"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <MarqueeRow badges={row1} direction="left" duration={44} />
        <MarqueeRow badges={row2} direction="right" duration={40} />
      </motion.div>

      {/* Bottom count strip */}
      <motion.div
        className="flex items-center justify-center gap-8 mt-8 px-6"
        initial={{ opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {[
          ["ri-stack-line", "40+", "Technologies"],
          ["ri-award-line", "23", "Certifications"],
          ["ri-shield-check-line", "SOC2", "Compliant"],
        ].map(([icon, val, label]) => (
          <div key={label} className="flex items-center gap-2 text-white/65">
            <i className={`${icon} text-[#29abe2]/40 text-sm`}></i>
            <span className="text-white/70 text-sm font-semibold">{val}</span>
            <span className="text-xs">{label}</span>
          </div>
        ))}
      </motion.div>
    </section>
  );
}