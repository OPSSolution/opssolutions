import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Project {
  id: number;
  title: string;
  category: string;
  slug: string;
  image: string;
  tags: string[];
  result: string;
  year: string;
}

interface LivePreviewModalProps {
  project: Project | null;
  onClose: () => void;
}

// ─── Project-specific demo overlays ──────────────────────────────────────────

function NexaShopDemo() {
  const [cart, setCart] = useState(3);
  const [added, setAdded] = useState<number | null>(null);
  const products = [
    { id: 1, name: "Wireless ANC Headphones", price: "$149", stock: 12 },
    { id: 2, name: "Mechanical Keyboard Pro", price: "$229", stock: 5 },
    { id: 3, name: "4K Webcam Ultra", price: "$89", stock: 28 },
    { id: 4, name: "USB-C Hub 12-in-1", price: "$79", stock: 7 },
  ];

  const handleAdd = (id: number) => {
    setCart((c) => c + 1);
    setAdded(id);
    setTimeout(() => setAdded(null), 1200);
  };

  return (
    <div className="flex flex-col h-full bg-[#0f0f0f] text-white overflow-y-auto">
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <span className="font-bold text-lg">NexaShop</span>
        <div className="flex items-center gap-4">
          <span className="text-white/40 text-sm">Electronics</span>
          <div className="relative">
            <i className="ri-shopping-cart-2-line text-xl"></i>
            <motion.span
              key={cart}
              className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#b9ff4b] text-black text-[9px] font-bold rounded-full flex items-center justify-center"
              initial={{ scale: 1.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              {cart}
            </motion.span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 p-5">
        {products.map((p) => (
          <motion.div
            key={p.id}
            className="bg-white/[0.04] border border-white/8 rounded-xl overflow-hidden"
            whileHover={{ scale: 1.02 }}
          >
            <div className="h-24 bg-gradient-to-br from-[#b9ff4b]/10 to-transparent flex items-center justify-center">
              <i className="ri-cpu-line text-[#b9ff4b]/60 text-3xl"></i>
            </div>
            <div className="p-3">
              <p className="text-xs font-medium text-white/85 mb-1 leading-tight">{p.name}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[#b9ff4b] font-bold text-sm">{p.price}</span>
                <motion.button
                  onClick={() => handleAdd(p.id)}
                  className="text-[10px] bg-[#b9ff4b] text-black font-bold px-2.5 py-1 rounded-lg cursor-pointer whitespace-nowrap"
                  whileTap={{ scale: 0.9 }}
                >
                  {added === p.id ? "Added!" : "+ Cart"}
                </motion.button>
              </div>
              <p className="text-white/25 text-[10px] mt-1">{p.stock} left in stock</p>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="px-5 pb-4 flex items-center gap-2 text-[10px] text-white/25">
        <i className="ri-bar-chart-line text-[#b9ff4b]/50"></i>
        Live: $2.1M processed today · 847 orders
      </div>
    </div>
  );
}

function FinFlowDemo() {
  const [values] = useState([42, 68, 55, 81, 61, 92, 74, 88, 65, 95, 79, 100]);
  return (
    <div className="flex flex-col h-full bg-[#090c0e] text-white overflow-y-auto">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
        <span className="font-bold">FinFlow Dashboard</span>
        <span className="text-[#b9ff4b] text-xs font-mono flex items-center gap-1.5">
          <motion.span
            className="w-1.5 h-1.5 bg-[#b9ff4b] rounded-full"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
          LIVE
        </span>
      </div>
      <div className="grid grid-cols-3 gap-3 p-4">
        {[
          { label: "Portfolio Value", val: "$847,220", delta: "+3.4%", up: true },
          { label: "Today P&L", val: "+$12,443", delta: "+1.5%", up: true },
          { label: "Open Positions", val: "14", delta: "-2", up: false },
        ].map((m) => (
          <div key={m.label} className="bg-white/[0.04] border border-white/8 rounded-xl p-3">
            <p className="text-white/30 text-[10px] mb-1">{m.label}</p>
            <p className="text-white font-bold text-sm">{m.val}</p>
            <p className={`text-[10px] font-mono mt-0.5 ${m.up ? "text-[#b9ff4b]" : "text-red-400"}`}>{m.delta}</p>
          </div>
        ))}
      </div>
      <div className="mx-4 rounded-xl bg-white/[0.03] border border-white/5 p-4">
        <p className="text-white/30 text-[10px] mb-3 font-mono">PORTFOLIO PERFORMANCE — 12 MONTHS</p>
        <div className="flex items-end gap-1 h-20">
          {values.map((v, i) => (
            <motion.div
              key={i}
              className="flex-1 rounded-sm bg-[#b9ff4b]/80"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              style={{ height: `${v}%`, originY: 1 }}
              transition={{ duration: 0.6, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
            />
          ))}
        </div>
        <div className="flex justify-between mt-2 text-[9px] text-white/20 font-mono">
          {["Jan", "Mar", "May", "Jul", "Sep", "Nov"].map((m) => <span key={m}>{m}</span>)}
        </div>
      </div>
    </div>
  );
}

function CloudSyncDemo() {
  const [status] = useState([
    { region: "us-east-1", health: 100, pods: 24, cpu: 42 },
    { region: "eu-west-1", health: 100, pods: 18, cpu: 38 },
    { region: "ap-south-1", health: 99.8, pods: 12, cpu: 55 },
  ]);
  const [deployPct, setDeployPct] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setDeployPct((v) => v >= 100 ? 0 : v + 2), 80);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="flex flex-col h-full bg-[#060810] text-white overflow-y-auto">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
        <span className="font-bold">CloudSync Infrastructure</span>
        <span className="text-[#b9ff4b] text-xs font-mono">3 regions · 99.99% uptime</span>
      </div>
      <div className="flex flex-col gap-3 p-4">
        {status.map((s) => (
          <div key={s.region} className="bg-white/[0.04] border border-white/8 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-mono text-white/60">{s.region}</span>
              <span className="text-[#b9ff4b] text-[10px] font-mono">{s.health}% healthy</span>
            </div>
            <div className="flex gap-4 text-[10px] text-white/35 mb-2">
              <span>{s.pods} pods running</span>
              <span>CPU: {s.cpu}%</span>
            </div>
            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#b9ff4b]/80 rounded-full"
                style={{ width: `${s.cpu}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${s.cpu}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        ))}
        <div className="bg-[#b9ff4b]/5 border border-[#b9ff4b]/20 rounded-xl p-4">
          <div className="flex justify-between text-xs mb-2">
            <span className="text-[#b9ff4b] font-mono">Deploying v2.14.1...</span>
            <span className="text-white/40 font-mono">{deployPct}%</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div className="h-full bg-[#b9ff4b] rounded-full" style={{ width: `${deployPct}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function AuraAIDemo() {
  const [typed, setTyped] = useState("");
  const fullText = "Introducing our revolutionary new product line — crafted for the modern professional who demands performance without compromise. Trusted by 10,000+ teams worldwide.";
  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      if (i < fullText.length) { setTyped(fullText.slice(0, i + 1)); i++; }
      else { setTimeout(() => { setTyped(""); i = 0; }, 1500); }
    }, 45);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="flex flex-col h-full bg-[#0a0b0d] text-white overflow-y-auto">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
        <span className="font-bold">AuraAI Content Engine</span>
        <span className="text-[#b9ff4b] text-xs font-mono">GPT-4 · 14 languages</span>
      </div>
      <div className="flex flex-col gap-4 p-4">
        <div className="bg-white/[0.04] border border-white/8 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <i className="ri-magic-line text-[#b9ff4b] text-sm"></i>
            <span className="text-[10px] font-mono text-white/40">GENERATING · BRAND VOICE: PROFESSIONAL</span>
          </div>
          <p className="text-white/75 text-sm leading-relaxed min-h-[80px]">
            {typed}
            <motion.span
              className="inline-block w-0.5 h-4 bg-[#b9ff4b] ml-0.5 align-middle"
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {["10,247", "14", "96%"].map((v, i) => (
            <div key={i} className="bg-white/[0.03] border border-white/5 rounded-xl p-3 text-center">
              <p className="text-[#b9ff4b] font-bold text-base">{v}</p>
              <p className="text-white/25 text-[9px] mt-0.5">{["pieces/mo", "languages", "brand match"][i]}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {["EN", "ES", "FR", "DE", "JA", "ZH", "AR", "PT"].map((lang) => (
            <span key={lang} className="text-[9px] font-mono bg-[#b9ff4b]/10 text-[#b9ff4b]/70 border border-[#b9ff4b]/20 px-2 py-0.5 rounded-md">
              {lang}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function MediTrackDemo() {
  const [pulse] = useState(72);
  const wavePoints = Array.from({ length: 30 }, (_, i) => {
    const x = (i / 29) * 100;
    const base = 50;
    const spike = i === 10 || i === 22 ? -30 : i === 11 || i === 23 ? 20 : 0;
    const noise = Math.sin(i * 0.8) * 5;
    return `${x},${base + spike + noise}`;
  }).join(" ");

  return (
    <div className="flex flex-col h-full bg-[#080a0c] text-white overflow-y-auto">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
        <span className="font-bold">MediTrack</span>
        <span className="text-[#b9ff4b] text-xs flex items-center gap-1.5 font-mono">
          <motion.span className="w-1.5 h-1.5 bg-[#b9ff4b] rounded-full" animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.8, repeat: Infinity }} />
          300+ clinics online
        </span>
      </div>
      <div className="flex flex-col gap-3 p-4">
        <div className="bg-white/[0.04] border border-white/8 rounded-xl p-4">
          <p className="text-[10px] font-mono text-white/30 mb-2">PATIENT VITALS · REAL-TIME</p>
          <div className="flex items-end gap-4 mb-3">
            <div>
              <p className="text-3xl font-bold text-[#b9ff4b]">{pulse}</p>
              <p className="text-white/35 text-[10px]">bpm · Normal</p>
            </div>
            <svg viewBox="0 0 100 100" className="flex-1 h-14" preserveAspectRatio="none">
              <motion.polyline
                fill="none"
                stroke="#b9ff4b"
                strokeWidth="2"
                points={wavePoints}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity, repeatType: "loop" }}
              />
            </svg>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "Today's Appointments", val: "24", icon: "ri-calendar-check-line" },
            { label: "Active Patients", val: "1,284", icon: "ri-user-heart-line" },
          ].map((m) => (
            <div key={m.label} className="bg-white/[0.04] border border-white/8 rounded-xl p-3 flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#b9ff4b]/10 shrink-0">
                <i className={`${m.icon} text-[#b9ff4b] text-sm`}></i>
              </div>
              <div>
                <p className="text-white font-bold text-sm">{m.val}</p>
                <p className="text-white/30 text-[9px]">{m.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SmartHomeDemo() {
  const [lights, setLights] = useState({ living: true, kitchen: false, bedroom: true });
  const [temp, setTemp] = useState(22);
  return (
    <div className="flex flex-col h-full bg-[#080910] text-white overflow-y-auto">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
        <span className="font-bold">SmartHome Connect</span>
        <span className="text-[#b9ff4b] text-xs font-mono">12 devices online</span>
      </div>
      <div className="flex flex-col gap-3 p-4">
        <div className="bg-white/[0.04] border border-white/8 rounded-xl p-4">
          <p className="text-[10px] font-mono text-white/30 mb-3">LIGHTING CONTROL</p>
          <div className="flex flex-col gap-2.5">
            {(Object.entries(lights) as [keyof typeof lights, boolean][]).map(([room, on]) => (
              <div key={room} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <i className={`ri-lightbulb-line text-sm ${on ? "text-[#b9ff4b]" : "text-white/20"}`}></i>
                  <span className="text-sm capitalize text-white/75">{room} Room</span>
                </div>
                <motion.button
                  onClick={() => setLights((l) => ({ ...l, [room]: !l[room] }))}
                  className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors duration-200 ${on ? "bg-[#b9ff4b]" : "bg-white/10"}`}
                  whileTap={{ scale: 0.92 }}
                >
                  <motion.span
                    className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow"
                    animate={{ left: on ? "calc(100% - 18px)" : "2px" }}
                    transition={{ type: "spring", stiffness: 400, damping: 22 }}
                  />
                </motion.button>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white/[0.04] border border-white/8 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono text-white/30 mb-1">THERMOSTAT</p>
            <p className="text-3xl font-bold">{temp}°C</p>
            <p className="text-white/30 text-[10px]">Target: {temp}°C</p>
          </div>
          <div className="flex flex-col gap-2">
            <button onClick={() => setTemp((t) => Math.min(30, t + 1))} className="w-8 h-8 bg-white/8 rounded-lg flex items-center justify-center cursor-pointer hover:bg-[#b9ff4b]/20 transition-colors">
              <i className="ri-add-line text-white/60 text-sm"></i>
            </button>
            <button onClick={() => setTemp((t) => Math.max(16, t - 1))} className="w-8 h-8 bg-white/8 rounded-lg flex items-center justify-center cursor-pointer hover:bg-[#b9ff4b]/20 transition-colors">
              <i className="ri-subtract-line text-white/60 text-sm"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const demoMap: Record<number, () => JSX.Element> = {
  1: NexaShopDemo,
  2: MediTrackDemo,
  3: FinFlowDemo,
  4: CloudSyncDemo,
  5: AuraAIDemo,
  6: SmartHomeDemo,
};

const slugMap: Record<number, string> = {
  1: "nexashop-demo.devcraft.studio",
  2: "meditrack.devcraft.studio",
  3: "finflow.devcraft.studio",
  4: "cloudsync.devcraft.studio",
  5: "auraai.devcraft.studio",
  6: "smarthome.devcraft.studio",
};

// ─── Main Modal ───────────────────────────────────────────────────────────────

export default function LivePreviewModal({ project, onClose }: LivePreviewModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (project) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [project]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const DemoComponent = project ? demoMap[project.id] : null;
  const demoSlug = project ? slugMap[project.id] : "";

  return (
    <AnimatePresence>
      {project && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[95] bg-black/85 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            ref={containerRef}
            className="fixed inset-0 z-[96] flex items-center justify-center p-4 md:p-8 pointer-events-none"
          >
            <motion.div
              className="relative w-full max-w-3xl pointer-events-auto"
              initial={{ opacity: 0, y: 40, scale: 0.93 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Outer glow */}
              <div
                className="absolute -inset-px rounded-2xl pointer-events-none z-0"
                style={{ background: "linear-gradient(135deg, rgba(185,255,75,0.35) 0%, rgba(185,255,75,0.05) 50%, rgba(185,255,75,0.12) 100%)", filter: "blur(1px)" }}
              />

              {/* Browser Chrome */}
              <div className="relative z-10 bg-[#141414] rounded-2xl overflow-hidden border border-white/10" style={{ boxShadow: "0 30px 90px rgba(0,0,0,0.7), 0 0 0 1px rgba(185,255,75,0.15)" }}>
                {/* Title bar */}
                <div className="flex items-center gap-3 px-4 py-3.5 bg-[#1c1c1c] border-b border-white/5">
                  {/* Traffic lights */}
                  <div className="flex gap-1.5 shrink-0">
                    <button onClick={onClose} className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors cursor-pointer" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                    <div className="w-3 h-3 rounded-full bg-green-500/60" />
                  </div>

                  {/* URL bar */}
                  <div className="flex-1 flex items-center gap-2 bg-black/40 border border-white/8 rounded-lg px-3 py-1.5">
                    <motion.span
                      className="w-1.5 h-1.5 rounded-full bg-[#b9ff4b] shrink-0"
                      animate={{ opacity: [1, 0.4, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    <span className="text-white/40 text-xs font-mono truncate">{demoSlug}</span>
                    <i className="ri-refresh-line text-white/20 text-xs ml-auto shrink-0"></i>
                  </div>

                  {/* Live badge */}
                  <div className="flex items-center gap-1.5 bg-[#b9ff4b]/10 border border-[#b9ff4b]/30 rounded-lg px-2.5 py-1.5 shrink-0">
                    <motion.span
                      className="w-1.5 h-1.5 rounded-full bg-[#b9ff4b]"
                      animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                    <span className="text-[#b9ff4b] text-[10px] font-bold font-mono tracking-wider">LIVE</span>
                  </div>

                  {/* Close */}
                  <button
                    onClick={onClose}
                    className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 border border-white/8 text-white/40 hover:text-white hover:bg-white/10 transition-all cursor-pointer shrink-0"
                  >
                    <i className="ri-close-line text-sm"></i>
                  </button>
                </div>

                {/* Demo content */}
                <div className="h-[460px] md:h-[520px] overflow-hidden">
                  {DemoComponent && <DemoComponent />}
                </div>

                {/* Footer bar */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-[#111]/80 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="text-white/25 text-[10px] font-mono">{project.title}</span>
                    <span className="text-white/10 text-[10px]">·</span>
                    <span className="text-[#b9ff4b]/40 text-[10px] font-mono">{project.result}</span>
                  </div>
                  <div className="flex gap-1">
                    {project.tags.slice(0, 3).map((t) => (
                      <span key={t} className="text-[9px] font-mono text-white/20 bg-white/5 px-1.5 py-0.5 rounded">{t}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Project info below */}
              <div className="flex items-center justify-between mt-4 px-1">
                <div className="flex items-center gap-3">
                  <span className="bg-[#b9ff4b] text-black text-[10px] font-bold px-2.5 py-1 rounded-full">{project.category}</span>
                  <span className="text-white/30 text-xs font-mono">{project.year}</span>
                </div>
                <motion.button
                  onClick={onClose}
                  className="flex items-center gap-1.5 text-white/30 text-xs hover:text-white/60 transition-colors cursor-pointer whitespace-nowrap"
                  whileHover={{ scale: 1.05 }}
                >
                  <i className="ri-close-line text-sm"></i>
                  Press ESC to close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}