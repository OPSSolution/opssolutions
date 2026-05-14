import { useRef, useEffect, useState } from "react";

interface BlogCardImageProps {
  src: string;
  alt: string;
  postId: number;
  className?: string;
}

// ─── Inline keyframes injected once ─────────────────────────────────────────
const STYLES_ID = "blog-card-image-styles";

function injectStyles() {
  if (document.getElementById(STYLES_ID)) return;
  const el = document.createElement("style");
  el.id = STYLES_ID;
  el.textContent = `
    /* ── Effect 1: RGB Glitch Slice ─────────────────────────── */
    @keyframes bci-glitch-shift {
      0%,90%,100%   { transform: translateX(0); opacity: 0; }
      92%            { transform: translateX(-6px); opacity: 0.55; }
      94%            { transform: translateX(8px);  opacity: 0.55; }
      96%            { transform: translateX(-4px); opacity: 0.45; }
      98%            { transform: translateX(0);    opacity: 0; }
    }
    @keyframes bci-glitch-r {
      0%,88%,100%   { transform: translateX(0) translateY(0); opacity: 0; }
      90%            { transform: translateX(5px) translateY(-2px); opacity: 0.4; }
      95%            { transform: translateX(-4px) translateY(1px); opacity: 0.3; }
    }
    @keyframes bci-glitch-b {
      0%,88%,100%   { transform: translateX(0) translateY(0); opacity: 0; }
      91%            { transform: translateX(-6px) translateY(2px); opacity: 0.35; }
      96%            { transform: translateX(3px) translateY(-1px); opacity: 0.25; }
    }
    @keyframes bci-scanline-v {
      0%   { top: -8px; opacity: 0; }
      5%   { opacity: 1; }
      95%  { opacity: 1; }
      100% { top: 100%; opacity: 0; }
    }
    @keyframes bci-scanline-h {
      0%   { clip-path: inset(0 0 100% 0); opacity: 0; }
      3%   { opacity: 1; }
      97%  { opacity: 1; }
      100% { clip-path: inset(0 0 0% 0); opacity: 0; }
    }

    /* ── Effect 2: Radar Scan Beam ───────────────────────────── */
    @keyframes bci-scan-beam {
      0%   { transform: translateY(-100%); }
      100% { transform: translateY(350%); }
    }
    @keyframes bci-scan-grid {
      0%, 100% { opacity: 0.08; }
      50%       { opacity: 0.18; }
    }

    /* ── Effect 3: Liquid Wave Hue ───────────────────────────── */
    @keyframes bci-wave-hue {
      0%   { filter: hue-rotate(0deg)   saturate(1)    brightness(1); }
      25%  { filter: hue-rotate(15deg)  saturate(1.3)  brightness(1.05); }
      50%  { filter: hue-rotate(-10deg) saturate(0.85) brightness(0.97); }
      75%  { filter: hue-rotate(20deg)  saturate(1.2)  brightness(1.08); }
      100% { filter: hue-rotate(0deg)   saturate(1)    brightness(1); }
    }
    @keyframes bci-wave-distort {
      0%,100% { border-radius: 0; transform: scale(1.01) skewX(0deg); }
      33%     { transform: scale(1.025) skewX(0.4deg); }
      66%     { transform: scale(1.01) skewX(-0.3deg); }
    }
    @keyframes bci-ripple {
      0%   { transform: scale(0.2); opacity: 0.6; }
      100% { transform: scale(2.5); opacity: 0; }
    }

    /* ── Effect 4: AI Noise Grain ────────────────────────────── */
    @keyframes bci-grain {
      0%,100% { transform: translate(0, 0); }
      10%     { transform: translate(-3%, -2%); }
      20%     { transform: translate(2%, 3%); }
      30%     { transform: translate(-1%, -4%); }
      40%     { transform: translate(3%, 1%); }
      50%     { transform: translate(-2%, 2%); }
      60%     { transform: translate(1%, -3%); }
      70%     { transform: translate(-3%, 0%); }
      80%     { transform: translate(2%, -1%); }
      90%     { transform: translate(-1%, 3%); }
    }
    @keyframes bci-satburst {
      0%,100% { filter: saturate(1) brightness(1) contrast(1); }
      25%     { filter: saturate(1.6) brightness(1.05) contrast(1.1); }
      50%     { filter: saturate(0.7) brightness(0.95) contrast(1.15); }
      75%     { filter: saturate(1.8) brightness(1.1)  contrast(0.95); }
    }
    @keyframes bci-pixel-flash {
      0%,94%,100% { opacity: 0; }
      95%          { opacity: 0.5; }
      97%          { opacity: 0.2; }
    }

    /* ── Effect 5: Matrix Data Rain ──────────────────────────── */
    @keyframes bci-rain-col-a {
      0%   { transform: translateY(-100%); opacity: 0.7; }
      100% { transform: translateY(400%); opacity: 0; }
    }
    @keyframes bci-rain-col-b {
      0%   { transform: translateY(-100%); opacity: 0.5; }
      100% { transform: translateY(400%); opacity: 0; }
    }
    @keyframes bci-rain-col-c {
      0%   { transform: translateY(-100%); opacity: 0.6; }
      100% { transform: translateY(400%); opacity: 0; }
    }
    @keyframes bci-matrix-fade {
      0%,100% { opacity: 0.12; }
      50%     { opacity: 0.22; }
    }

    /* ── Effect 6: Color Bloom Pulse ─────────────────────────── */
    @keyframes bci-bloom {
      0%,100% { filter: brightness(1) saturate(1) hue-rotate(0deg); }
      30%     { filter: brightness(1.12) saturate(1.5) hue-rotate(8deg); }
      60%     { filter: brightness(0.92) saturate(1.1) hue-rotate(-5deg); }
    }
    @keyframes bci-bloom-glow {
      0%,100% { opacity: 0; transform: scale(0.9); }
      50%     { opacity: 0.35; transform: scale(1.05); }
    }
    @keyframes bci-bloom-ring {
      0%   { transform: scale(0.5); opacity: 0.5; }
      100% { transform: scale(1.8); opacity: 0; }
    }
  `;
  document.head.appendChild(el);
}

// ─── Effect 1: AI Trading Terminal (3D Live Market) ─────────────────────────
function TradingAIEffect({ src, alt }: { src: string; alt: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [price, setPrice] = useState(67842.50);
  const [signal, setSignal] = useState<"BUY" | "SELL" | null>("BUY");
  const priceRef = useRef(67842.50);
  const frameRef = useRef<number>(0);
  const candlesRef = useRef<{ open: number; close: number; high: number; low: number; vol: number }[]>([]);

  // Seed candles once
  useEffect(() => {
    let p = 67300;
    candlesRef.current = Array.from({ length: 20 }, () => {
      const open = p;
      const body = (Math.random() - 0.45) * 240;
      const close = open + body;
      const wick = Math.random() * 100;
      const high = Math.max(open, close) + wick;
      const low = Math.min(open, close) - wick * 0.6;
      const vol = 0.06 + Math.random() * 0.14;
      p = close;
      return { open, close, high, low, vol };
    });
  }, []);

  // 3D mouse tilt
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      setTilt({ x: dx * 10, y: -dy * 7 });
    };
    const onLeave = () => setTilt({ x: 0, y: 0 });
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => { el.removeEventListener("mousemove", onMove); el.removeEventListener("mouseleave", onLeave); };
  }, []);

  // Animate price
  useEffect(() => {
    const t = setInterval(() => {
      priceRef.current += (Math.random() - 0.47) * 32;
      setPrice(+priceRef.current.toFixed(2));
    }, 850);
    return () => clearInterval(t);
  }, []);

  // Cycle AI signals
  useEffect(() => {
    const seq: ("BUY" | "SELL" | null)[] = ["BUY", "BUY", null, "BUY", "SELL", null, "BUY"];
    let i = 0;
    const t = setInterval(() => { setSignal(seq[i++ % seq.length]); }, 2300);
    return () => clearInterval(t);
  }, []);

  // Canvas rAF chart
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let tick = 0;

    const draw = () => {
      const candles = candlesRef.current;
      if (!candles.length) { frameRef.current = requestAnimationFrame(draw); return; }
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // Grid
      ctx.strokeStyle = "rgba(34,197,94,0.055)";
      ctx.lineWidth = 0.5;
      for (let r = 0; r <= 4; r++) { ctx.beginPath(); ctx.moveTo(0, H * r / 4); ctx.lineTo(W, H * r / 4); ctx.stroke(); }
      for (let c = 0; c <= 8; c++) { ctx.beginPath(); ctx.moveTo(W * c / 8, 0); ctx.lineTo(W * c / 8, H); ctx.stroke(); }

      const lo = Math.min(...candles.map(c => c.low)) - 40;
      const hi = Math.max(...candles.map(c => c.high)) + 40;
      const span = hi - lo;
      const py = (v: number) => H - ((v - lo) / span) * H * 0.83 - H * 0.05;

      const cw = W / (candles.length + 2);
      const bw = cw * 0.52;

      // Volume bars + candle bodies + wicks
      candles.forEach((c, i) => {
        const x = cw * (i + 1);
        const bull = c.close >= c.open;
        const col = bull ? "#22c55e" : "#ef4444";
        const isLast = i === candles.length - 1;
        const formPct = isLast ? Math.min(1, (tick % 90) / 45) : 1;

        // Volume bar
        ctx.fillStyle = col;
        ctx.globalAlpha = 0.15;
        ctx.fillRect(x - bw / 2, H - c.vol * H, bw, c.vol * H);
        ctx.globalAlpha = 1;

        // Wick
        ctx.strokeStyle = col;
        ctx.lineWidth = 0.8;
        ctx.globalAlpha = 0.75;
        ctx.beginPath(); ctx.moveTo(x, py(c.high)); ctx.lineTo(x, py(c.low)); ctx.stroke();

        // Body
        const bodyTop = Math.min(py(c.open), py(c.close));
        const bodyH = Math.max(1.5, Math.abs(py(c.open) - py(c.close)) * formPct);
        ctx.globalAlpha = isLast ? 0.55 + Math.sin(tick * 0.1) * 0.45 : 0.88;
        ctx.fillStyle = col;
        if (bull) {
          ctx.fillRect(x - bw / 2, bodyTop, bw, bodyH);
        } else {
          ctx.fillRect(x - bw / 2, bodyTop, bw, bodyH);
        }
        // Glow on last candle
        if (isLast) {
          ctx.shadowColor = col;
          ctx.shadowBlur = 8 + Math.sin(tick * 0.12) * 4;
          ctx.fillRect(x - bw / 2, bodyTop, bw, bodyH);
          ctx.shadowBlur = 0;
        }
        ctx.globalAlpha = 1;
      });

      // EMA line
      ctx.beginPath();
      ctx.strokeStyle = "rgba(74,222,128,0.7)";
      ctx.lineWidth = 1.5;
      ctx.shadowColor = "#4ade80";
      ctx.shadowBlur = 6;
      candles.forEach((c, i) => {
        const x = cw * (i + 1);
        const y = py((c.open + c.close) / 2);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Dashed current price line
      const lastY = py(candles[candles.length - 1].close);
      ctx.beginPath();
      ctx.strokeStyle = "rgba(74,222,128,0.32)";
      ctx.lineWidth = 0.7;
      ctx.setLineDash([3, 5]);
      ctx.moveTo(0, lastY); ctx.lineTo(W, lastY);
      ctx.stroke(); ctx.setLineDash([]);

      // Glowing price label on right edge
      const lastP = candles[candles.length - 1].close;
      ctx.fillStyle = "rgba(34,197,94,0.18)";
      ctx.fillRect(W - 62, lastY - 8, 60, 16);
      ctx.fillStyle = "rgba(74,222,128,0.9)";
      ctx.font = "bold 9px monospace";
      ctx.fillText(lastP.toFixed(0), W - 56, lastY + 3.5);

      tick++;
      frameRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  const up = price >= 67842.50;
  const tickers = [
    { pair: "ETH/USD", p: "3,421.8", up: true },
    { pair: "EUR/USD", p: "1.0842", up: false },
    { pair: "NVDA", p: "892.44", up: true },
    { pair: "AAPL", p: "189.22", up: true },
    { pair: "GBP/USD", p: "1.2651", up: false },
    { pair: "SPX", p: "5,248.6", up: true },
    { pair: "XAU/USD", p: "2,318.5", up: true },
  ];

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden select-none"
      style={{ perspective: "900px" }}
    >
      {/* Dimmed base image */}
      <img
        src={src} alt={alt}
        className="absolute inset-0 w-full h-full object-cover object-top"
        style={{ filter: "brightness(0.20) saturate(1.8) hue-rotate(-8deg)" }}
      />
      {/* Colour grade */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-transparent to-emerald-950/40 pointer-events-none" />

      {/* 3D tilt wrapper — preserve-3d for depth layers */}
      <div
        className="absolute inset-0 flex flex-col"
        style={{
          transform: `rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) translateZ(0)`,
          transformStyle: "preserve-3d",
          transition: "transform 0.12s ease-out",
        }}
      >
        {/* ── Top status bar ── */}
        <div className="flex items-center justify-between px-4 pt-3 pb-1.5 shrink-0">
          <div className="flex items-center gap-2">
            <div
              className="w-1.5 h-1.5 rounded-full bg-emerald-400"
              style={{ boxShadow: "0 0 6px #4ade80", animation: "bci-bloom-glow 1.2s ease-in-out infinite" }}
            />
            <span className="text-emerald-400/85 text-[9px] font-mono tracking-widest">NEURAL-FX · TRADING AI</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-red-400/70 text-[9px] font-mono">● REC</span>
            <span className="text-white/25 text-[9px] font-mono">09:34:12 EST</span>
          </div>
        </div>

        {/* ── Main row: chart + order book ── */}
        <div className="flex flex-1 gap-2 px-4 pb-1 min-h-0">

          {/* Chart column */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Price + signal row */}
            <div className="flex items-end gap-2 mb-1.5 flex-wrap">
              <div>
                <span className="text-white/35 text-[8px] font-mono block tracking-wider">BTC / USD  ·  SPOT</span>
                <span
                  className="font-mono font-extrabold leading-none block"
                  style={{
                    fontSize: "clamp(13px, 2.8vw, 20px)",
                    color: up ? "#4ade80" : "#f87171",
                    textShadow: up
                      ? "0 0 18px rgba(74,222,128,0.75), 0 0 40px rgba(74,222,128,0.3)"
                      : "0 0 18px rgba(248,113,113,0.75), 0 0 40px rgba(248,113,113,0.3)",
                  }}
                >
                  {price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex items-center gap-1 mb-0.5">
                <i className={`text-[10px] ${up ? "ri-arrow-up-line text-emerald-400" : "ri-arrow-down-line text-red-400"}`} />
                <span className={`text-[9px] font-mono font-semibold ${up ? "text-emerald-400" : "text-red-400"}`}>
                  {up ? "+1.24%" : "-0.58%"}
                </span>
              </div>
              {signal && (
                <div
                  className="ml-auto flex items-center gap-1 px-2 py-0.5 rounded-sm text-[8px] font-bold font-mono shrink-0"
                  style={{
                    background: signal === "BUY" ? "rgba(34,197,94,0.14)" : "rgba(239,68,68,0.14)",
                    border: `1px solid ${signal === "BUY" ? "rgba(74,222,128,0.45)" : "rgba(248,113,113,0.45)"}`,
                    color: signal === "BUY" ? "#4ade80" : "#f87171",
                    boxShadow: signal === "BUY"
                      ? "0 0 12px rgba(74,222,128,0.28), inset 0 0 6px rgba(74,222,128,0.08)"
                      : "0 0 12px rgba(248,113,113,0.28), inset 0 0 6px rgba(248,113,113,0.08)",
                  }}
                >
                  ⚡ AI {signal}
                </div>
              )}
            </div>

            {/* Canvas */}
            <div className="flex-1 relative" style={{ minHeight: "60px" }}>
              <canvas
                ref={canvasRef}
                className="w-full h-full block"
                width={540}
                height={180}
              />
              {/* Edge fade */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "linear-gradient(to right, rgba(0,0,0,0.28) 0%, transparent 6%, transparent 92%, rgba(0,0,0,0.28) 100%)",
                  transform: "translateZ(6px)",
                }}
              />
            </div>
          </div>

          {/* Order book column */}
          <div className="w-[68px] shrink-0 flex flex-col justify-center pt-4">
            <span className="text-white/20 text-[7px] font-mono mb-1.5 tracking-widest block">ORDER BOOK</span>
            {[["68,240","0.42"],["68,190","1.15"],["68,120","0.78"]].map(([p, v], i) => (
              <div key={i} className="flex justify-between mb-0.5">
                <span className="text-red-400/60 text-[7px] font-mono">{p}</span>
                <span className="text-white/25 text-[7px] font-mono">{v}</span>
              </div>
            ))}
            <div className="h-px bg-emerald-500/25 my-1" />
            {[["67,998","2.31"],["67,952","0.96"],["67,910","1.88"]].map(([p, v], i) => (
              <div key={i} className="flex justify-between mb-0.5">
                <span className="text-emerald-400/60 text-[7px] font-mono">{p}</span>
                <span className="text-white/25 text-[7px] font-mono">{v}</span>
              </div>
            ))}
            <div className="mt-2 pt-1.5 border-t border-white/5">
              <span className="text-white/20 text-[7px] font-mono block">P&amp;L TODAY</span>
              <span
                className="text-emerald-400 font-bold font-mono block"
                style={{ fontSize: "9px", textShadow: "0 0 8px rgba(74,222,128,0.5)" }}
              >
                +$24,182
              </span>
            </div>
          </div>
        </div>

        {/* ── Bottom ticker strip ── */}
        <div className="px-4 pb-2.5 overflow-hidden shrink-0">
          <div className="flex items-center gap-4">
            {tickers.map((t, i) => (
              <div key={i} className="flex items-center gap-1 shrink-0">
                <span className="text-white/30 text-[7px] font-mono">{t.pair}</span>
                <span className={`text-[7px] font-mono font-medium ${t.up ? "text-emerald-400/75" : "text-red-400/75"}`}>{t.p}</span>
                <i className={`text-[7px] ${t.up ? "ri-arrow-up-s-fill text-emerald-400/50" : "ri-arrow-down-s-fill text-red-400/50"}`} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Corner brackets (outside the tilt so they stay fixed on the frame) */}
      <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-emerald-400/50 pointer-events-none" />
      <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-emerald-400/50 pointer-events-none" />
      <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-emerald-400/50 pointer-events-none" />
      <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-emerald-400/50 pointer-events-none" />

      {/* Scan sweep */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent 40%, rgba(34,197,94,0.022) 50%, transparent 60%)",
          animation: "bci-scan-beam 6s linear infinite",
        }}
      />
      {/* Scanlines texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.1) 0px, rgba(0,0,0,0.1) 1px, transparent 1px, transparent 3px)" }}
      />
    </div>
  );
}

// ─── Effect 2: Radar Scan Beam ───────────────────────────────────────────────
function ScanBeamEffect({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative w-full h-full overflow-hidden">
      <img src={src} alt={alt} className="w-full h-full object-cover object-top" />
      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(96,165,250,0.07) 1px,transparent 1px),linear-gradient(90deg,rgba(96,165,250,0.07) 1px,transparent 1px)",
          backgroundSize: "24px 24px",
          animation: "bci-scan-grid 3s ease-in-out infinite",
        }}
      />
      {/* Scan beam */}
      <div
        className="absolute left-0 w-full pointer-events-none"
        style={{
          height: "40px",
          background: "linear-gradient(to bottom, transparent, rgba(96,165,250,0.35) 30%, rgba(96,165,250,0.55) 50%, rgba(96,165,250,0.35) 70%, transparent)",
          animation: "bci-scan-beam 2.8s linear infinite",
          top: 0,
        }}
      />
      {/* Secondary faint beam */}
      <div
        className="absolute left-0 w-full pointer-events-none"
        style={{
          height: "20px",
          background: "linear-gradient(to bottom, transparent, rgba(96,165,250,0.2) 50%, transparent)",
          animation: "bci-scan-beam 2.8s linear infinite 1.4s",
          top: 0,
        }}
      />
      {/* Top label */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5 pointer-events-none">
        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
        <span className="text-blue-300/70 text-xs font-mono">SCANNING</span>
      </div>
    </div>
  );
}

// ─── Effect 3: Liquid Wave Hue ───────────────────────────────────────────────
function LiquidWaveEffect({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative w-full h-full overflow-hidden">
      <img
        src={src} alt={alt}
        className="w-full h-full object-cover object-top"
        style={{ animation: "bci-wave-hue 6s ease-in-out infinite, bci-wave-distort 5s ease-in-out infinite" }}
      />
      {/* Ripple rings */}
      {[0, 0.8, 1.6].map((delay, i) => (
        <div
          key={i}
          className="absolute pointer-events-none"
          style={{
            width: "60px", height: "60px",
            left: "50%", top: "50%",
            marginLeft: "-30px", marginTop: "-30px",
            borderRadius: "50%",
            border: "2px solid rgba(52,211,153,0.5)",
            animation: `bci-ripple 2.4s ease-out infinite ${delay}s`,
          }}
        />
      ))}
      {/* Color overlay pulse */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(52,211,153,0.12) 0%, transparent 70%)",
          animation: "bci-bloom-glow 3s ease-in-out infinite",
        }}
      />
    </div>
  );
}

// ─── Effect 4: AI Noise Grain + Sat Burst ────────────────────────────────────
function AINoiseEffect({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative w-full h-full overflow-hidden">
      <img
        src={src} alt={alt}
        className="w-full h-full object-cover object-top"
        style={{ animation: "bci-satburst 3.5s ease-in-out infinite" }}
      />
      {/* Grain texture */}
      <div
        className="absolute pointer-events-none"
        style={{
          inset: "-10%",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
          animation: "bci-grain 0.3s steps(1) infinite",
          mixBlendMode: "overlay",
        }}
      />
      {/* Neural node sparkles */}
      {[
        { x: "20%", y: "30%", d: "0s" }, { x: "75%", y: "20%", d: "0.6s" },
        { x: "50%", y: "65%", d: "1.2s" }, { x: "85%", y: "55%", d: "1.8s" },
        { x: "35%", y: "80%", d: "0.9s" },
      ].map((n, i) => (
        <div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-violet-400 pointer-events-none"
          style={{
            left: n.x, top: n.y,
            boxShadow: "0 0 6px 2px rgba(167,139,250,0.6)",
            animation: `bci-pixel-flash 2.5s ease-in-out infinite ${n.d}`,
          }}
        />
      ))}
      {/* Pixel flash overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(135deg, rgba(167,139,250,0.15) 0%, transparent 60%)",
          animation: "bci-pixel-flash 3s ease-in-out infinite",
        }}
      />
      {/* HUD label */}
      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 pointer-events-none">
        <span className="text-violet-300/60 text-xs font-mono">AI_GEN_v4</span>
        <div className="w-8 h-0.5 bg-gradient-to-r from-violet-400/60 to-transparent" />
      </div>
    </div>
  );
}

// ─── Effect 5: Matrix Data Rain ───────────────────────────────────────────────
const MATRIX_CHARS = "01アイウエオカキク10サシスセソタチツテトナニヌネノ01".split("");

function MatrixRainEffect({ src, alt }: { src: string; alt: string }) {
  const cols = 10;
  const colItems = Array.from({ length: cols }, (_, i) => i);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <img src={src} alt={alt} className="w-full h-full object-cover object-top" />
      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-black/30 pointer-events-none" />
      {/* Matrix columns */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ animation: "bci-matrix-fade 2s ease-in-out infinite" }}
      >
        {colItems.map(i => {
          const delay = (i * 0.31) % 2.5;
          const dur = 1.8 + (i % 3) * 0.4;
          const anim = i % 3 === 0 ? "bci-rain-col-a" : i % 3 === 1 ? "bci-rain-col-b" : "bci-rain-col-c";
          return (
            <div
              key={i}
              className="absolute flex flex-col gap-0.5"
              style={{
                left: `${i * 10}%`,
                width: "10%",
                top: 0,
                animation: `${anim} ${dur}s linear infinite ${delay}s`,
              }}
            >
              {Array.from({ length: 8 }, (_, j) => (
                <span
                  key={j}
                  className="text-emerald-400 text-xs font-mono text-center block"
                  style={{
                    opacity: 1 - j * 0.11,
                    textShadow: j === 0 ? "0 0 8px #34d399" : "none",
                    fontSize: "10px",
                  }}
                >
                  {MATRIX_CHARS[(i * 3 + j * 7) % MATRIX_CHARS.length]}
                </span>
              ))}
            </div>
          );
        })}
      </div>
      {/* Corner HUD */}
      <div className="absolute top-3 left-3 pointer-events-none">
        <span className="text-emerald-400/50 text-xs font-mono block">SYS_MIGRATE</span>
        <span className="text-emerald-400/30 text-xs font-mono block">0x{Math.floor(Math.random() * 0xFFFF).toString(16).toUpperCase().padStart(4, "0")}</span>
      </div>
    </div>
  );
}

// ─── Effect 6: Color Bloom Pulse ─────────────────────────────────────────────
function ColorBloomEffect({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative w-full h-full overflow-hidden">
      <img
        src={src} alt={alt}
        className="w-full h-full object-cover object-top"
        style={{ animation: "bci-bloom 4s ease-in-out infinite" }}
      />
      {/* Bloom glow overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 60% 40%, rgba(251,191,36,0.2) 0%, rgba(239,68,68,0.1) 40%, transparent 70%)",
          animation: "bci-bloom-glow 2.5s ease-in-out infinite",
        }}
      />
      {/* Bloom rings */}
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className="absolute pointer-events-none"
          style={{
            width: "40px", height: "40px",
            left: "60%", top: "40%",
            marginLeft: "-20px", marginTop: "-20px",
            borderRadius: "50%",
            border: `2px solid rgba(251,191,36,${0.6 - i * 0.15})`,
            animation: `bci-bloom-ring 2s ease-out infinite ${i * 0.65}s`,
          }}
        />
      ))}
      {/* Speed lines */}
      <div className="absolute bottom-3 right-3 flex items-center gap-1 pointer-events-none">
        {[1, 0.7, 0.4].map((o, i) => (
          <div key={i} className="h-0.5 rounded-full bg-amber-400" style={{ width: `${20 - i * 5}px`, opacity: o }} />
        ))}
        <span className="text-amber-300/60 text-xs font-mono ml-1">LAUNCH</span>
      </div>
    </div>
  );
}

// ─── Effect 7: GPU Cluster Visualization ────────────────────────────────────
function GPUClusterEffect({ src, alt }: { src: string; alt: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [gpus, setGpus] = useState([
    { id: 0, util: 91, vram: 74, temp: 84, status: "TRAIN" },
    { id: 1, util: 78, vram: 62, temp: 79, status: "TRAIN" },
    { id: 2, util: 96, vram: 76, temp: 87, status: "TRAIN" },
    { id: 3, util: 43, vram: 31, temp: 68, status: "IDLE"  },
  ]);
  const [jobPct, setJobPct] = useState(67.4);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      setTilt({
        x:  ((e.clientX - (r.left + r.width  / 2)) / (r.width  / 2)) * 10,
        y: -((e.clientY - (r.top  + r.height / 2)) / (r.height / 2)) *  7,
      });
    };
    const onLeave = () => setTilt({ x: 0, y: 0 });
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => { el.removeEventListener("mousemove", onMove); el.removeEventListener("mouseleave", onLeave); };
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setGpus(prev => prev.map(g => ({
        ...g,
        util: Math.max(35, Math.min(99, g.util + (Math.random() - 0.48) * 7)),
        vram: Math.max(24, Math.min(79, g.vram + (Math.random() - 0.5)  * 3)),
        temp: Math.max(65, Math.min(92, g.temp + Math.round((Math.random() - 0.5) * 2))),
      })));
      setJobPct(p => Math.min(99.9, p + Math.random() * 0.28));
    }, 1100);
    return () => clearInterval(t);
  }, []);

  const avgUtil = gpus.reduce((s, g) => s + g.util, 0) / gpus.length;
  const getUC = (u: number) => u > 85 ? "#f87171" : u > 65 ? "#fbbf24" : "#4ade80";
  const getSC = (s: string) => s === "TRAIN" ? "#fbbf24" : s === "INFER" ? "#4ade80" : "#6b7280";

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden select-none" style={{ perspective: "900px" }}>
      <img src={src} alt={alt} className="absolute inset-0 w-full h-full object-cover object-top"
        style={{ filter: "brightness(0.17) saturate(1.3) hue-rotate(178deg)" }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-black/55 via-transparent to-amber-950/25 pointer-events-none" />

      {/* 3D tilt wrapper */}
      <div
        className="absolute inset-0 flex flex-col p-3"
        style={{
          transform: `rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) translateZ(0)`,
          transformStyle: "preserve-3d",
          transition: "transform 0.12s ease-out",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-2 shrink-0">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400"
              style={{ boxShadow: "0 0 6px #fbbf24", animation: "bci-bloom-glow 1.3s ease-in-out infinite" }}
            />
            <span className="text-amber-400/85 text-[9px] font-mono tracking-widest">GPU CLUSTER · K8S-PROD</span>
          </div>
          <span className="text-amber-400/80 text-[9px] font-mono font-bold"
            style={{ textShadow: "0 0 8px rgba(251,191,36,0.5)" }}
          >
            {avgUtil.toFixed(0)}% AVG
          </span>
        </div>

        {/* 2×2 GPU node grid */}
        <div className="grid grid-cols-2 gap-1.5 flex-1">
          {gpus.map(gpu => (
            <div
              key={gpu.id}
              className="rounded px-2 py-1.5 relative overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.035)",
                border: `1px solid ${gpu.status === "TRAIN" ? "rgba(251,191,36,0.16)" : "rgba(255,255,255,0.05)"}`,
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-white/45 text-[7px] font-mono">A100-80G #{gpu.id}</span>
                <span className="text-[6px] font-mono font-bold px-1 rounded"
                  style={{ color: getSC(gpu.status), background: `${getSC(gpu.status)}18`, border: `1px solid ${getSC(gpu.status)}28` }}
                >{gpu.status}</span>
              </div>
              {/* Util bar */}
              <div className="mb-1">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-white/22 text-[6px] font-mono">UTIL</span>
                  <span className="text-[6px] font-mono font-medium" style={{ color: getUC(gpu.util) }}>{gpu.util.toFixed(0)}%</span>
                </div>
                <div className="w-full h-[3px] bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${gpu.util}%`, background: `linear-gradient(90deg,${getUC(gpu.util)}99,${getUC(gpu.util)})`, boxShadow: `0 0 4px ${getUC(gpu.util)}55` }}
                  />
                </div>
              </div>
              {/* VRAM bar */}
              <div className="mb-1">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-white/22 text-[6px] font-mono">VRAM</span>
                  <span className="text-white/35 text-[6px] font-mono">{gpu.vram.toFixed(0)}/80GB</span>
                </div>
                <div className="w-full h-[2px] bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${(gpu.vram / 80) * 100}%`, background: "rgba(96,165,250,0.65)" }}
                  />
                </div>
              </div>
              {/* Temp */}
              <div className="flex items-center gap-1">
                <i className="ri-temp-hot-line" style={{ fontSize: "6px", color: "rgba(251,146,60,0.6)" }} />
                <span className="text-[6px] font-mono" style={{ color: "rgba(251,146,60,0.6)" }}>{gpu.temp}°C</span>
              </div>
              {gpu.status === "TRAIN" && (
                <div className="absolute inset-0 pointer-events-none rounded"
                  style={{ background: "radial-gradient(circle at 50% 50%, rgba(251,191,36,0.04) 0%, transparent 70%)", animation: "bci-bloom-glow 2s ease-in-out infinite", animationDelay: `${gpu.id * 0.5}s` }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Training job progress */}
        <div className="mt-1.5 shrink-0">
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-white/22 text-[6.5px] font-mono">LLM-7B TRAIN · EPOCH 2/3</span>
            <span className="text-amber-400/65 text-[6.5px] font-mono">{jobPct.toFixed(1)}%</span>
          </div>
          <div className="w-full h-[2px] bg-white/5 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${jobPct}%`, background: "linear-gradient(90deg,#d97706,#fbbf24)", boxShadow: "0 0 6px rgba(251,191,36,0.4)" }}
            />
          </div>
          <div className="flex items-center justify-between mt-1">
            {[["BW","2.4TB/s"],["FLOPS","28.3P"],["ETA","2h14m"]].map(([k,v]) => (
              <span key={k} className="text-white/18 font-mono" style={{ fontSize: "5.5px" }}>{k}: {v}</span>
            ))}
          </div>
        </div>
      </div>

      {/* NVLink data flow dots */}
      {[{t:"41%",l:"49%",d:"0s"},{t:"43%",l:"51%",d:"0.5s"},{t:"37%",l:"25%",d:"1s"},{t:"55%",l:"75%",d:"1.4s"},{t:"51%",l:"48%",d:"0.8s"}].map((dot,i) => (
        <div key={i} className="absolute w-1 h-1 rounded-full bg-amber-400 pointer-events-none"
          style={{ top: dot.t, left: dot.l, opacity: 0, boxShadow: "0 0 4px #fbbf24", animation: `bci-pixel-flash 2s ease-in-out infinite ${dot.d}` }}
        />
      ))}

      {/* Corner brackets */}
      {[["top-2 left-2","border-t border-l"],["top-2 right-2","border-t border-r"],["bottom-2 left-2","border-b border-l"],["bottom-2 right-2","border-b border-r"]].map(([p,c],i) => (
        <div key={i} className={`absolute ${p} w-4 h-4 ${c} border-amber-400/45 pointer-events-none`} />
      ))}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent 40%, rgba(251,191,36,0.018) 50%, transparent 60%)", animation: "bci-scan-beam 5.5s linear infinite" }}
      />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.1) 0px, rgba(0,0,0,0.1) 1px, transparent 1px, transparent 3px)" }}
      />
    </div>
  );
}

// ─── Main export ─────────────────────────────────────────────────────────────
const effects = [
  TradingAIEffect,     // 1 — live AI trading terminal
  ScanBeamEffect,      // 2
  LiquidWaveEffect,    // 3
  AINoiseEffect,       // 4
  MatrixRainEffect,    // 5
  ColorBloomEffect,    // 6
  GPUClusterEffect,    // 7 — GPU cluster visualization (amber)
];

export default function BlogCardImage({ src, alt, postId, className }: BlogCardImageProps) {
  const injected = useRef(false);
  useEffect(() => {
    if (!injected.current) { injectStyles(); injected.current = true; }
  }, []);

  const idx = ((postId - 1) % effects.length);
  const EffectComponent = effects[idx];

  return (
    <div className={`w-full h-full ${className ?? ""}`}>
      <EffectComponent src={src} alt={alt} />
    </div>
  );
}