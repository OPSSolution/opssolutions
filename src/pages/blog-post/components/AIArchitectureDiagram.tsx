import { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

// ─── Constants ────────────────────────────────────────────────────────────────
const SVG_W = 900;
const SVG_H = 500;
const CW = 130; // card width
const CH = 68;  // card height

// ─── Node Definitions ─────────────────────────────────────────────────────────
const NODES = [
  {
    id: "data", label: "Data Pipeline", sub: "BigQuery · S3 · Kafka",
    icon: "ri-database-2-line", accent: "#f59e0b",
    cx: 83, cy: 235, metrics: "2.4TB / day", status: "streaming",
  },
  {
    id: "ray", label: "Ray Train", sub: "8× A100 · DDP",
    icon: "ri-cpu-line", accent: "#22c55e",
    cx: 260, cy: 125, metrics: "7B params", status: "training",
  },
  {
    id: "mlflow", label: "MLflow Registry", sub: "Versioning · Staging",
    icon: "ri-git-merge-line", accent: "#f97316",
    cx: 515, cy: 125, metrics: "v2.4.1", status: "promoted",
  },
  {
    id: "triton", label: "Triton Server", sub: "TensorRT INT8 · Batch",
    icon: "ri-flashlight-line", accent: "#22c55e",
    cx: 770, cy: 235, metrics: "48ms p95", status: "serving",
  },
  {
    id: "feast", label: "Feature Store", sub: "Feast · Redis Online",
    icon: "ri-stack-line", accent: "#f59e0b",
    cx: 390, cy: 395, metrics: "4ms lookup", status: "online",
  },
  {
    id: "api", label: "API Gateway", sub: "REST · gRPC · CDN",
    icon: "ri-global-line", accent: "#22c55e",
    cx: 705, cy: 395, metrics: "99.97% uptime", status: "live",
  },
];

// ─── Connection Definitions ────────────────────────────────────────────────────
// Path coordinates: from card edge → to card edge (SVG 900×500 space)
const CONNECTIONS = [
  { id: "d-r",  path: "M 148,235 C 180,220 185,148 195,125", color: "#f59e0b", label: "raw features", dur: 2.6, begin: 0.0 },
  { id: "r-m",  path: "M 325,125 C 375,112 410,112 450,125", color: "#22c55e", label: "artifacts",     dur: 2.2, begin: 0.4 },
  { id: "m-t",  path: "M 580,125 C 636,125 685,200 705,235", color: "#f97316", label: "model v2.4",   dur: 2.0, begin: 0.8 },
  { id: "t-a",  path: "M 770,269 C 770,322 740,361 705,361", color: "#22c55e", label: "inference",    dur: 1.8, begin: 0.2 },
  { id: "f-r",  path: "M 325,395 C 215,390 205,215 260,159", color: "#f59e0b", label: "train feats",  dur: 3.2, begin: 0.6, dashed: true },
  { id: "t-f",  path: "M 770,269 C 810,340 565,400 455,395", color: "#22c55e", label: "feedback",     dur: 3.4, begin: 1.2, dashed: true },
  { id: "d-f",  path: "M 83,269 C 83,345 225,395 325,395",   color: "#f59e0b", label: "offline",      dur: 2.9, begin: 0.9 },
];

// ─── Scan-line sweep animation CSS ───────────────────────────────────────────
const SCAN_CSS = `
@keyframes scanSweep {
  0%   { transform: translateX(-100%); opacity: 0; }
  10%  { opacity: 0.6; }
  90%  { opacity: 0.6; }
  100% { transform: translateX(110%); opacity: 0; }
}
@keyframes nodePulse {
  0%, 100% { opacity: 0.25; transform: scale(1); }
  50%       { opacity: 0.55; transform: scale(1.15); }
}
@keyframes packetGlow {
  0%, 100% { filter: blur(0px); opacity: 1; }
  50%       { filter: blur(1.5px); opacity: 0.7; }
}
`;

// ─── Helper: card top-left from center ───────────────────────────────────────
function cardLeft(cx: number) { return `${((cx - CW / 2) / SVG_W) * 100}%`; }
function cardTop(cy: number)  { return `${((cy - CH / 2) / SVG_H) * 100}%`; }

// ─── NodeCard ─────────────────────────────────────────────────────────────────
interface NodeCardProps {
  node: typeof NODES[number];
  active: boolean;
  idx: number;
}

function NodeCard({ node, active, idx }: NodeCardProps) {
  return (
    <motion.div
      className="absolute"
      style={{
        left: cardLeft(node.cx),
        top: cardTop(node.cy),
        width: CW,
        height: CH,
        willChange: "transform",
      }}
      initial={{ opacity: 0, scale: 0.7, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.15 + idx * 0.12, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
    >
      {/* Glow ring */}
      <div
        className="absolute inset-0 rounded-xl"
        style={{
          boxShadow: `0 0 ${active ? 28 : 14}px ${active ? 10 : 4}px ${node.accent}${active ? "55" : "22"}`,
          transition: "box-shadow 0.4s ease",
        }}
      />
      {/* Pulse ring */}
      <div
        className="absolute inset-[-4px] rounded-xl border"
        style={{
          borderColor: `${node.accent}44`,
          animation: `nodePulse 2.4s ease-in-out infinite`,
          animationDelay: `${idx * 0.35}s`,
        }}
      />
      {/* Card body */}
      <div
        className="relative w-full h-full rounded-xl border flex flex-col justify-between p-2.5 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #16140f 0%, #0f0e0b 100%)",
          borderColor: `${node.accent}30`,
          borderTopWidth: 2,
          borderTopColor: node.accent,
        }}
      >
        {/* Top row: icon + status dot */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div
              className="w-5 h-5 flex items-center justify-center rounded-md"
              style={{ background: `${node.accent}18` }}
            >
              <i className={`${node.icon} text-[11px]`} style={{ color: node.accent }} />
            </div>
            <span className="text-[10px] font-bold text-white leading-none tracking-tight">{node.label}</span>
          </div>
          <div className="flex items-center gap-1">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: node.accent, boxShadow: `0 0 4px ${node.accent}` }}
            />
          </div>
        </div>

        {/* Bottom row: sub + metric */}
        <div className="flex items-end justify-between">
          <p className="text-[9px] leading-none" style={{ color: "rgba(255,255,255,0.3)" }}>{node.sub}</p>
          <span
            className="text-[9px] font-mono font-bold leading-none"
            style={{ color: node.accent }}
          >
            {node.metrics}
          </span>
        </div>

        {/* Corner circuit decoration */}
        <div
          className="absolute top-0 right-0 w-8 h-8 rounded-bl-xl opacity-20"
          style={{ background: `linear-gradient(225deg, ${node.accent}40 0%, transparent 70%)` }}
        />
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AIArchitectureDiagram() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  // Intersection observer for entrance
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // 3D tilt on mouse move
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    setTilt({ rx: -dy * 9, ry: dx * 9 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({ rx: 0, ry: 0 });
    setActiveNode(null);
  }, []);

  return (
    <div className="my-10 rounded-2xl overflow-hidden border border-white/8 bg-[#0c0b09]">
      <style>{SCAN_CSS}</style>

      {/* Header bar */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/6 bg-[#111009]">
        <div className="flex items-center gap-2.5">
          <div className="w-5 h-5 flex items-center justify-center rounded-md bg-accent/15">
            <i className="ri-node-tree text-accent text-[11px]" />
          </div>
          <span className="text-white/70 text-xs font-mono tracking-widest">AI FRAMEWORK INFRASTRUCTURE</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span
              className="inline-block w-1.5 h-1.5 rounded-full bg-accent"
              style={{ boxShadow: "0 0 5px #22c55e", animation: "nodePulse 1.4s ease-in-out infinite" }}
            />
            <span className="text-accent text-[10px] font-mono">LIVE</span>
          </div>
          <div className="hidden sm:flex gap-1">
            {["HEALTHY", "48ms", "71% GPU"].map(t => (
              <span key={t} className="text-[9px] font-mono text-white/25 bg-white/5 border border-white/8 px-2 py-0.5 rounded-full">{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Diagram area with 3D tilt */}
      <div
        ref={containerRef}
        className="relative overflow-hidden select-none"
        style={{
          paddingBottom: `${(SVG_H / SVG_W) * 100}%`,
          perspective: "1400px",
          cursor: "crosshair",
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Inner 3D card */}
        <motion.div
          className="absolute inset-0"
          animate={{ rotateX: tilt.rx, rotateY: tilt.ry }}
          transition={{ type: "spring", stiffness: 280, damping: 28, mass: 0.6 }}
          style={{ transformStyle: "preserve-3d", transformOrigin: "center center" }}
        >
          {/* Grid background */}
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)
              `,
              backgroundSize: "45px 45px",
            }}
          />

          {/* Ambient radial glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 70% 55% at 50% 40%, rgba(34,197,94,0.04) 0%, transparent 70%)",
            }}
          />

          {/* Scan line sweep */}
          {visible && (
            <div
              className="absolute inset-0 pointer-events-none overflow-hidden"
              style={{ zIndex: 1 }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0, bottom: 0,
                  width: "35%",
                  background: "linear-gradient(90deg, transparent 0%, rgba(34,197,94,0.06) 50%, transparent 100%)",
                  animation: "scanSweep 5s ease-in-out infinite",
                  animationDelay: "1.2s",
                }}
              />
            </div>
          )}

          {/* SVG layer: connections */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            preserveAspectRatio="xMidYMid meet"
            style={{ zIndex: 2 }}
          >
            <defs>
              {CONNECTIONS.map(c => (
                <path key={`def-${c.id}`} id={`path-${c.id}`} d={c.path} fill="none" />
              ))}
              {/* Arrow markers */}
              {CONNECTIONS.map(c => (
                <marker
                  key={`marker-${c.id}`}
                  id={`arrow-${c.id}`}
                  viewBox="0 0 8 8"
                  refX="6"
                  refY="4"
                  markerWidth="5"
                  markerHeight="5"
                  orient="auto"
                >
                  <path d="M 0,0 L 8,4 L 0,8 Z" fill={c.color} opacity={0.7} />
                </marker>
              ))}
            </defs>

            {/* Connection paths */}
            {CONNECTIONS.map((c, idx) => (
              <motion.path
                key={c.id}
                d={c.path}
                fill="none"
                stroke={c.color}
                strokeWidth={c.dashed ? 1.2 : 1.5}
                strokeDasharray={c.dashed ? "5 4" : undefined}
                strokeOpacity={0.35}
                markerEnd={`url(#arrow-${c.id})`}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={visible ? { pathLength: 1, opacity: 1 } : {}}
                transition={{ delay: 0.6 + idx * 0.1, duration: 0.8, ease: "easeOut" }}
              />
            ))}

            {/* Glow path overlay */}
            {CONNECTIONS.map(c => (
              <path
                key={`glow-${c.id}`}
                d={c.path}
                fill="none"
                stroke={c.color}
                strokeWidth={4}
                strokeOpacity={0.06}
                strokeLinecap="round"
              />
            ))}

            {/* Animated data packets — each connection has 2 traveling dots */}
            {visible && CONNECTIONS.map(c => (
              <g key={`packets-${c.id}`} style={{ animation: "packetGlow 1.2s ease-in-out infinite" }}>
                {/* Packet 1 */}
                <circle r={3.5} fill={c.color} opacity={0.9}>
                  <animateMotion dur={`${c.dur}s`} repeatCount="indefinite" begin={`${c.begin}s`}>
                    <mpath href={`#path-${c.id}`} />
                  </animateMotion>
                </circle>
                <circle r={5.5} fill={c.color} opacity={0.2}>
                  <animateMotion dur={`${c.dur}s`} repeatCount="indefinite" begin={`${c.begin}s`}>
                    <mpath href={`#path-${c.id}`} />
                  </animateMotion>
                </circle>
                {/* Packet 2 (offset) */}
                <circle r={3} fill={c.color} opacity={0.6}>
                  <animateMotion dur={`${c.dur}s`} repeatCount="indefinite" begin={`${c.begin + c.dur * 0.5}s`}>
                    <mpath href={`#path-${c.id}`} />
                  </animateMotion>
                </circle>
              </g>
            ))}

            {/* Connection labels */}
            {visible && CONNECTIONS.filter(c => !c.dashed).map(c => (
              <motion.text
                key={`label-${c.id}`}
                fill={c.color}
                fontSize={8}
                fontFamily="monospace"
                opacity={0.5}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ delay: 1.6, duration: 0.4 }}
              >
                <textPath href={`#path-${c.id}`} startOffset="38%">
                  {c.label}
                </textPath>
              </motion.text>
            ))}
          </svg>

          {/* Node cards */}
          <div className="absolute inset-0" style={{ zIndex: 3 }}>
            {NODES.map((node, idx) => (
              <div
                key={node.id}
                onMouseEnter={() => setActiveNode(node.id)}
                onMouseLeave={() => setActiveNode(null)}
              >
                {visible && (
                  <NodeCard node={node} active={activeNode === node.id} idx={idx} />
                )}
              </div>
            ))}
          </div>

          {/* Layer labels */}
          {visible && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{ zIndex: 4 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8, duration: 0.6 }}
            >
              {[
                { label: "INGESTION", x: "3%",  y: "5%",  color: "#f59e0b" },
                { label: "TRAINING",  x: "22%", y: "5%",  color: "#22c55e" },
                { label: "REGISTRY",  x: "46%", y: "5%",  color: "#f97316" },
                { label: "SERVING",   x: "71%", y: "5%",  color: "#22c55e" },
                { label: "FEATURES",  x: "33%", y: "87%", color: "#f59e0b" },
                { label: "GATEWAY",   x: "63%", y: "87%", color: "#22c55e" },
              ].map(l => (
                <span
                  key={l.label}
                  className="absolute text-[8px] font-mono tracking-[0.15em] font-bold"
                  style={{ left: l.x, top: l.y, color: l.color, opacity: 0.4 }}
                >
                  {l.label}
                </span>
              ))}
            </motion.div>
          )}

          {/* 3D depth layer hint */}
          <div
            className="absolute inset-0 pointer-events-none rounded-xl"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.015) 0%, transparent 50%, rgba(0,0,0,0.06) 100%)",
              zIndex: 5,
            }}
          />
        </motion.div>
      </div>

      {/* Footer legend */}
      <div className="flex flex-wrap items-center gap-4 px-5 py-3 border-t border-white/5 bg-[#0e0d0a]">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-px bg-accent/60" />
          <span className="text-[9px] font-mono text-white/30">data flow</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-px border-t border-dashed border-white/30" />
          <span className="text-[9px] font-mono text-white/30">feedback loop</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-accent/60" style={{ boxShadow: "0 0 4px #22c55e" }} />
          <span className="text-[9px] font-mono text-white/30">live packet</span>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <i className="ri-cursor-line text-white/20 text-[10px]" />
          <span className="text-[9px] font-mono text-white/20">hover to tilt</span>
        </div>
      </div>
    </div>
  );
}