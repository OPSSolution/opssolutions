import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";

// ─── Data ──────────────────────────────────────────────────────────────────────

interface ServiceNode {
  id: string;
  label: string;
  sub: string;
  icon: string;
  color: string;
  /** 0-100 percentage within the SVG/container coordinate space */
  xPct: number;
  yPct: number;
}

const SERVICES: ServiceNode[] = [
  { id: "gateway",   label: "API Gateway",    sub: "Nginx + Istio",     icon: "ri-router-line",             color: "#b9ff4b", xPct: 50, yPct:  7 },
  { id: "auth",      label: "Auth Service",   sub: "JWT + OAuth2",      icon: "ri-shield-check-line",        color: "#4ade80", xPct: 12, yPct: 37 },
  { id: "orders",    label: "Order Service",  sub: "CQRS / Event-src",  icon: "ri-shopping-bag-3-line",      color: "#fbbf24", xPct: 33, yPct: 37 },
  { id: "notifs",    label: "Notifications",  sub: "Extracted first",   icon: "ri-notification-3-line",      color: "#38bdf8", xPct: 65, yPct: 37 },
  { id: "users",     label: "User Service",   sub: "Profile + prefs",   icon: "ri-user-settings-line",       color: "#a78bfa", xPct: 87, yPct: 37 },
  { id: "payments",  label: "Payments",       sub: "PCI isolated",      icon: "ri-bank-card-2-line",         color: "#f472b6", xPct: 21, yPct: 70 },
  { id: "shipping",  label: "Shipping Svc",   sub: "Event-driven",      icon: "ri-truck-line",               color: "#fb923c", xPct: 44, yPct: 70 },
  { id: "inventory", label: "Inventory",      sub: "DB per service",    icon: "ri-archive-stack-line",       color: "#34d399", xPct: 67, yPct: 70 },
  { id: "analytics", label: "Analytics",      sub: "Read replica",      icon: "ri-bar-chart-grouped-line",   color: "#60a5fa", xPct: 87, yPct: 70 },
];

/** SVG coordinate space: 1000 × 560 */
const W = 1000;
const H = 560;
const toSvgX = (pct: number) => (pct / 100) * W;
const toSvgY = (pct: number) => (pct / 100) * H;

/** Service-to-service connections */
const EDGES: [string, string][] = [
  ["gateway", "auth"],
  ["gateway", "orders"],
  ["gateway", "notifs"],
  ["gateway", "users"],
  ["orders",  "payments"],
  ["orders",  "shipping"],
  ["orders",  "inventory"],
  ["orders",  "notifs"],
  ["users",   "analytics"],
  ["auth",    "users"],
];

// Monolith internal modules list
const MODULES = [
  { icon: "ri-shield-user-line",      label: "AuthModule" },
  { icon: "ri-shopping-bag-3-line",   label: "OrderModule" },
  { icon: "ri-notification-3-line",   label: "NotifModule" },
  { icon: "ri-bank-card-2-line",      label: "PaymentModule" },
  { icon: "ri-user-settings-line",    label: "UserModule" },
  { icon: "ri-truck-line",            label: "ShipModule" },
  { icon: "ri-archive-stack-line",    label: "InvModule" },
  { icon: "ri-bar-chart-grouped-line",label: "AnalyticsModule" },
];

// ─── Phase types ────────────────────────────────────────────────────────────────
type Phase = "monolith" | "cracking" | "emerging" | "mesh";

// ─── Helpers ───────────────────────────────────────────────────────────────────
function serviceById(id: string) {
  return SERVICES.find(s => s.id === id)!;
}

// ─── Sub-components ────────────────────────────────────────────────────────────

/** Single animated service card */
function ServiceCard({
  node,
  delayOffset,
  phase,
}: {
  node: ServiceNode;
  delayOffset: number;
  phase: Phase;
}) {
  const visible = phase === "emerging" || phase === "mesh";
  return (
    <motion.div
      className="absolute z-10 flex flex-col items-center"
      style={{
        left: `${node.xPct}%`,
        top: `${node.yPct}%`,
        transform: "translate(-50%, -50%)",
      }}
      initial={{ opacity: 0, scale: 0.2, y: 40 }}
      animate={visible ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.2, y: 40 }}
      transition={{ duration: 0.55, delay: delayOffset, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Glow ring on "mesh" phase */}
      {phase === "mesh" && (
        <motion.div
          className="absolute w-14 h-14 rounded-2xl"
          animate={{ opacity: [0.15, 0.35, 0.15] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: delayOffset }}
          style={{ background: `radial-gradient(circle, ${node.color}55, transparent 70%)`, filter: "blur(6px)" }}
        />
      )}

      <div
        className="relative flex items-center justify-center w-12 h-12 rounded-2xl border"
        style={{
          background: `${node.color}18`,
          borderColor: `${node.color}50`,
        }}
      >
        <i className={`${node.icon} text-xl`} style={{ color: node.color }} />
      </div>
      <p className="mt-1.5 text-white text-[11px] font-semibold leading-none text-center whitespace-nowrap">
        {node.label}
      </p>
      <p className="mt-0.5 font-mono text-[9px] leading-none text-center whitespace-nowrap" style={{ color: `${node.color}80` }}>
        {node.sub}
      </p>
    </motion.div>
  );
}

/** SVG layer: connection lines + traffic flow */
function ConnectionLayer({ phase }: { phase: Phase }) {
  const showLines = phase === "mesh";
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none z-[5]"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
    >
      <defs>
        {SERVICES.map(s => (
          <radialGradient key={`grad-${s.id}`} id={`grad-${s.id}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={s.color} stopOpacity="0.8" />
            <stop offset="100%" stopColor={s.color} stopOpacity="0" />
          </radialGradient>
        ))}
      </defs>

      {EDGES.map(([fromId, toId], idx) => {
        const from = serviceById(fromId);
        const to = serviceById(toId);
        const x1 = toSvgX(from.xPct);
        const y1 = toSvgY(from.yPct);
        const x2 = toSvgX(to.xPct);
        const y2 = toSvgY(to.yPct);
        const pathId = `path-${fromId}-${toId}`;
        const dx = (x2 - x1) * 0.45;
        const d = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
        const lineLen = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2) * 1.2;

        return (
          <g key={pathId}>
            {/* Base path */}
            <motion.path
              id={pathId}
              d={d}
              fill="none"
              stroke={`${from.color}30`}
              strokeWidth="1.5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={showLines ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
              transition={{ duration: 0.7, delay: idx * 0.08, ease: "easeOut" }}
            />
            {/* Crawling traffic flow dashes */}
            {showLines && (
              <motion.path
                d={d}
                fill="none"
                stroke={from.color}
                strokeWidth="2"
                strokeDasharray="14 18"
                strokeLinecap="round"
                opacity={0.55}
                initial={{ strokeDashoffset: 0 }}
                animate={{ strokeDashoffset: -lineLen }}
                transition={{ duration: 2.2 + idx * 0.15, repeat: Infinity, ease: "linear", delay: idx * 0.12 }}
              />
            )}
          </g>
        );
      })}

      {/* Service node halo dots on mesh */}
      {showLines && SERVICES.map((s, i) => (
        <motion.circle
          key={`halo-${s.id}`}
          cx={toSvgX(s.xPct)}
          cy={toSvgY(s.yPct)}
          r="26"
          fill="none"
          stroke={s.color}
          strokeWidth="1"
          initial={{ opacity: 0, r: 20 }}
          animate={{ opacity: [0, 0.35, 0], r: [20, 38, 20] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeOut", delay: i * 0.22 }}
        />
      ))}
    </svg>
  );
}

/** Monolith block shown in phase === 'monolith' or 'cracking' */
function MonolithBlock({ phase }: { phase: Phase }) {
  const visible = phase === "monolith" || phase === "cracking";
  const cracking = phase === "cracking";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.7, filter: "blur(16px)" }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="relative flex flex-col items-center"
            animate={cracking ? { x: [0, -4, 5, -5, 4, -2, 3, 0], rotate: [0, -0.5, 0.7, -0.7, 0.5, 0] } : {}}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          >
            {/* Outer container */}
            <div
              className="relative flex flex-col items-center rounded-2xl border-2 px-8 pt-6 pb-6"
              style={{
                background: "linear-gradient(135deg, #1a1500 0%, #0f0d00 100%)",
                borderColor: cracking ? "#ef4444" : "#d97706",
                boxShadow: cracking
                  ? "0 0 40px rgba(239,68,68,0.25), inset 0 0 30px rgba(239,68,68,0.05)"
                  : "0 0 40px rgba(217,119,6,0.2), inset 0 0 30px rgba(217,119,6,0.05)",
                minWidth: 320,
              }}
            >
              {/* Crack lines — shown only when cracking */}
              {cracking && (
                <>
                  <motion.div
                    className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Vertical crack */}
                    <motion.div
                      className="absolute top-0 w-[2px] bg-red-500/60"
                      style={{ left: "38%", height: "100%" }}
                      initial={{ scaleY: 0, transformOrigin: "top" }}
                      animate={{ scaleY: 1 }}
                      transition={{ duration: 0.6, ease: "easeIn" }}
                    />
                    <motion.div
                      className="absolute top-0 w-[1px] bg-red-400/40"
                      style={{ left: "63%", height: "100%" }}
                      initial={{ scaleY: 0, transformOrigin: "bottom" }}
                      animate={{ scaleY: 1 }}
                      transition={{ duration: 0.7, ease: "easeIn", delay: 0.15 }}
                    />
                    {/* Horizontal crack */}
                    <motion.div
                      className="absolute left-0 h-[1px] bg-red-500/50"
                      style={{ top: "55%", width: "100%" }}
                      initial={{ scaleX: 0, transformOrigin: "left" }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.5, ease: "easeIn", delay: 0.2 }}
                    />
                  </motion.div>
                </>
              )}

              {/* Header label */}
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-8 h-8 flex items-center justify-center rounded-xl"
                  style={{ background: cracking ? "#ef444420" : "#d9770620", border: `1px solid ${cracking ? "#ef4444" : "#d97706"}50` }}
                >
                  <i className={`${cracking ? "ri-error-warning-line text-red-400" : "ri-server-line text-amber-400"} text-base`} />
                </div>
                <div>
                  <p className="text-white font-bold text-sm leading-none">Rails Monolith</p>
                  <p className="font-mono text-[10px] mt-0.5" style={{ color: cracking ? "#ef444470" : "#d9770670" }}>
                    {cracking ? "DECOMPOSING..." : "180,000 LOC · 6 years old"}
                  </p>
                </div>
              </div>

              {/* Module list */}
              <div className="grid grid-cols-2 gap-2 w-full">
                {MODULES.map((m, i) => (
                  <motion.div
                    key={m.label}
                    className="flex items-center gap-1.5 bg-white/4 rounded-lg px-2.5 py-1.5 border border-white/6"
                    animate={cracking ? { opacity: [1, 0.4, 1], x: [0, i % 2 === 0 ? -3 : 3, 0] } : {}}
                    transition={{ duration: 0.8, delay: i * 0.08, repeat: cracking ? Infinity : 0 }}
                  >
                    <i className={`${m.icon} text-amber-400/60 text-xs`} />
                    <span className="text-white/50 font-mono text-[10px]">{m.label}</span>
                  </motion.div>
                ))}
              </div>

              {/* Bottom stats */}
              <div className="flex items-center gap-4 mt-4 pt-3 border-t border-white/5 w-full">
                <div className="text-center">
                  <p className="text-amber-400 font-bold text-sm">2h</p>
                  <p className="text-white/30 text-[9px] font-mono">deploy time</p>
                </div>
                <div className="text-center">
                  <p className="text-red-400 font-bold text-sm">2×/wk</p>
                  <p className="text-white/30 text-[9px] font-mono">releases</p>
                </div>
                <div className="text-center">
                  <p className="text-white/40 font-bold text-sm">1</p>
                  <p className="text-white/30 text-[9px] font-mono">DB instance</p>
                </div>
                <div className="text-center ml-auto">
                  <p className={`font-bold text-sm ${cracking ? "text-red-400" : "text-amber-400"}`}>
                    {cracking ? "💥" : "🚨"}
                  </p>
                  <p className="text-white/30 text-[9px] font-mono">{cracking ? "breaking" : "bottleneck"}</p>
                </div>
              </div>
            </div>

            {/* Down arrow during cracking */}
            {!cracking && (
              <motion.div
                className="mt-4 flex items-center gap-2 text-amber-400/60"
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              >
                <i className="ri-arrow-down-line text-base" />
                <span className="text-xs font-mono">Transformation starting…</span>
                <i className="ri-arrow-down-line text-base" />
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Top section header with phase status */
function PhaseHeader({ phase }: { phase: Phase }) {
  const labels: Record<Phase, { text: string; color: string; icon: string }> = {
    monolith:   { text: "BEFORE: Rails Monolith",        color: "#d97706", icon: "ri-building-line" },
    cracking:   { text: "DECOMPOSING: Breaking Apart",   color: "#ef4444", icon: "ri-error-warning-line" },
    emerging:   { text: "EXTRACTING: Services Emerging", color: "#38bdf8", icon: "ri-git-branch-line" },
    mesh:       { text: "AFTER: Live Microservices Mesh", color: "#b9ff4b", icon: "ri-node-tree" },
  };
  const cfg = labels[phase];

  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <div
          className="w-7 h-7 flex items-center justify-center rounded-lg"
          style={{ background: `${cfg.color}20`, border: `1px solid ${cfg.color}40` }}
        >
          <i className={`${cfg.icon} text-sm`} style={{ color: cfg.color }} />
        </div>
        <motion.span
          key={phase}
          className="font-mono text-xs font-semibold"
          style={{ color: cfg.color }}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          {cfg.text}
        </motion.span>
      </div>

      {/* Mesh-phase stats */}
      {phase === "mesh" && (
        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="text-center">
            <p className="text-[#b9ff4b] font-bold text-sm leading-none">12×</p>
            <p className="text-white/30 text-[9px] font-mono mt-0.5">faster deploys</p>
          </div>
          <div className="text-center">
            <p className="text-emerald-400 font-bold text-sm leading-none">0s</p>
            <p className="text-white/30 text-[9px] font-mono mt-0.5">downtime</p>
          </div>
          <div className="text-center">
            <p className="text-sky-400 font-bold text-sm leading-none">−78%</p>
            <p className="text-white/30 text-[9px] font-mono mt-0.5">incidents</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────────

export default function MonolithTransformAnimation() {
  const [phase, setPhase] = useState<Phase>("monolith");
  const [key, setKey] = useState(0);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearAll = () => timeoutsRef.current.forEach(clearTimeout);

  const runSequence = useCallback(() => {
    clearAll();
    setPhase("monolith");

    const t1 = setTimeout(() => setPhase("cracking"),  2000);
    const t2 = setTimeout(() => setPhase("emerging"),  3600);
    const t3 = setTimeout(() => setPhase("mesh"),      5800);

    timeoutsRef.current = [t1, t2, t3];
  }, []);

  useEffect(() => {
    runSequence();
    return clearAll;
  }, [key, runSequence]);

  const replay = () => {
    clearAll();
    setKey(k => k + 1);
  };

  return (
    <div className="w-full rounded-2xl border border-white/6 bg-[#09080a] overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-5 pb-0">
        <PhaseHeader phase={phase} />
      </div>

      {/* Animation stage */}
      <div className="relative w-full" style={{ height: 480 }}>
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "linear-gradient(#b9ff4b 1px, transparent 1px), linear-gradient(90deg, #b9ff4b 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#09080a] pointer-events-none z-30" />

        {/* Monolith */}
        <MonolithBlock phase={phase} />

        {/* Connection SVG layer */}
        <ConnectionLayer phase={phase} />

        {/* Service cards */}
        {SERVICES.map((node, i) => (
          <ServiceCard key={node.id} node={node} delayOffset={i * 0.09} phase={phase} />
        ))}

        {/* Replay button */}
        {phase === "mesh" && (
          <motion.button
            className="absolute bottom-16 right-4 z-40 flex items-center gap-1.5 bg-white/6 border border-white/12 text-white/50 hover:text-white hover:border-white/25 text-xs px-3 py-2 rounded-full transition-all duration-200 cursor-pointer whitespace-nowrap"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            onClick={replay}
          >
            <i className="ri-play-circle-line text-sm" />
            Replay animation
          </motion.button>
        )}
      </div>

      {/* Bottom legend */}
      <div className="px-5 pb-5">
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-white/5">
          <span className="text-white/25 text-[10px] font-mono tracking-widest">SERVICE MESH</span>
          <div className="flex flex-wrap gap-2 ml-2">
            {SERVICES.slice(0, 6).map(s => (
              <span
                key={s.id}
                className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full"
                style={{ color: s.color, background: `${s.color}12`, border: `1px solid ${s.color}25` }}
              >
                <i className={`${s.icon} text-[10px]`} />
                {s.label}
              </span>
            ))}
            <span className="text-white/20 text-[10px] font-mono px-2 py-0.5">+3 more</span>
          </div>
        </div>
      </div>
    </div>
  );
}