import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

// ── Ticker CSS injection ───────────────────────────────────────────────────────────────────────────────
const TICKER_STYLE_ID = "ldm-ticker";
function injectTickerStyles() {
  if (document.getElementById(TICKER_STYLE_ID)) return;
  const el = document.createElement("style");
  el.id = TICKER_STYLE_ID;
  el.textContent = `
    @keyframes ldm-scroll {
      0%   { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    @keyframes ldm-price-flip {
      0%  { opacity: 1; transform: translateY(0); }
      40% { opacity: 0; transform: translateY(-6px); }
      60% { opacity: 0; transform: translateY(6px); }
      100%{ opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(el);
}

// ── Scrolling price ticker ─────────────────────────────────────────────────────────────────────────────
const SEED_TICKERS = [
  { pair: "BTC/USD",  price: 67842.50, dp: 2 },
  { pair: "ETH/USD",  price: 3421.80,  dp: 2 },
  { pair: "SOL/USD",  price: 178.45,   dp: 2 },
  { pair: "BNB/USD",  price: 612.30,   dp: 2 },
  { pair: "AAPL",     price: 189.22,   dp: 2 },
  { pair: "NVDA",     price: 892.44,   dp: 2 },
  { pair: "TSLA",     price: 248.12,   dp: 2 },
  { pair: "SPX",      price: 5248.60,  dp: 2 },
  { pair: "XAU/USD",  price: 2318.50,  dp: 2 },
  { pair: "EUR/USD",  price: 1.0842,   dp: 4 },
  { pair: "GBP/USD",  price: 1.2651,   dp: 4 },
  { pair: "DXY",      price: 104.32,   dp: 2 },
];

function TickerStrip({ isOpen }: { isOpen: boolean }) {
  const injectedRef = useRef(false);
  const [tickers, setTickers] = useState(
    SEED_TICKERS.map(t => ({ ...t, up: Math.random() > 0.4, flip: false }))
  );

  useEffect(() => {
    if (!injectedRef.current) { injectTickerStyles(); injectedRef.current = true; }
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const t = setInterval(() => {
      setTickers(prev => prev.map(tk => {
        const delta = tk.price * (Math.random() - 0.499) * 0.0012;
        const newPrice = Math.max(0.0001, tk.price + delta);
        const up = delta >= 0;
        return { ...tk, price: newPrice, up, flip: !tk.flip };
      }));
    }, 1800);
    return () => clearInterval(t);
  }, [isOpen]);

  const doubled = [...tickers, ...tickers];

  return (
    <motion.div
      className="overflow-hidden shrink-0 border-b border-white/5"
      style={{ background: "rgba(0,0,0,0.4)" }}
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
    >
      <div className="py-2" style={{ animation: "ldm-scroll 30s linear infinite" }}>
        <div className="flex items-center">
          {doubled.map((tk, i) => (
            <div
              key={i}
              className="flex items-center gap-1.5 px-3.5 shrink-0 border-r border-white/6 last:border-0"
            >
              <span className="text-white/35 text-[9px] font-mono tracking-wide">{tk.pair}</span>
              <span
                key={`${i}-${tk.flip}`}
                className={`text-[9px] font-mono font-semibold ${tk.up ? "text-emerald-400" : "text-red-400"}`}
                style={{ animation: "ldm-price-flip 0.35s ease-out" }}
              >
                {tk.price.toLocaleString("en-US", { minimumFractionDigits: tk.dp, maximumFractionDigits: tk.dp })}
              </span>
              <div className={`flex items-center justify-center w-3 h-3`}>
                <i className={`${tk.up ? "ri-arrow-up-s-fill text-emerald-400" : "ri-arrow-down-s-fill text-red-400"} text-[9px]`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

type TF = "1M" | "5M" | "15M" | "1H";

// ── Candle seed ────────────────────────────────────────────────────────────────
function buildCandles(tf: TF) {
  const cfg: Record<TF, { n: number; vol: number; start: number }> = {
    "1M":  { n: 60, vol:  45, start: 67200 },
    "5M":  { n: 48, vol: 110, start: 67400 },
    "15M": { n: 32, vol: 170, start: 67600 },
    "1H":  { n: 24, vol: 240, start: 67800 },
  };
  const { n, vol, start } = cfg[tf];
  let p = start;
  return Array.from({ length: n }, () => {
    const o = p;
    const body = (Math.random() - 0.44) * vol;
    const c = o + body;
    const wick = Math.random() * vol * 0.38;
    const h = Math.max(o, c) + wick;
    const l = Math.min(o, c) - wick * 0.55;
    const v = 0.05 + Math.random() * 0.22;
    p = c;
    return { o, c, h, l, v };
  });
}

// ── Animated chart canvas ──────────────────────────────────────────────────────
function ChartCanvas({ tf }: { tf: TF }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef  = useRef<number>(0);
  const candlesRef = useRef(buildCandles(tf));

  useEffect(() => { candlesRef.current = buildCandles(tf); }, [tf]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let tick = 0;

    const draw = () => {
      const cs = candlesRef.current;
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      ctx.fillStyle = "#0d0c09";
      ctx.fillRect(0, 0, W, H);

      ctx.strokeStyle = "rgba(255,255,255,0.032)";
      ctx.lineWidth = 0.5;
      for (let i = 0; i <= 4; i++) { ctx.beginPath(); ctx.moveTo(0, H * 0.82 * i / 4); ctx.lineTo(W, H * 0.82 * i / 4); ctx.stroke(); }
      for (let i = 0; i <= 7; i++) { ctx.beginPath(); ctx.moveTo(W * i / 7, 0);          ctx.lineTo(W * i / 7, H * 0.82);  ctx.stroke(); }

      const lo   = Math.min(...cs.map(c => c.l)) - 60;
      const hi   = Math.max(...cs.map(c => c.h)) + 60;
      const span = hi - lo;
      const CH   = H * 0.82;
      const py   = (v: number) => CH - ((v - lo) / span) * CH * 0.92 - CH * 0.02;
      const n    = cs.length;
      const cw   = W / (n + 2);
      const bw   = cw * 0.58;

      ctx.fillStyle  = "rgba(255,255,255,0.18)";
      ctx.font       = "10px monospace";
      ctx.textAlign  = "right";
      for (let i = 0; i <= 4; i++) {
        const pv = lo + span * i / 4;
        ctx.fillText(pv.toFixed(0), W - 5, py(pv) + 3);
      }
      ctx.textAlign = "left";

      cs.forEach((c, i) => {
        const x    = cw * (i + 1);
        const bull = c.c >= c.o;
        const col  = bull ? "#22c55e" : "#ef4444";
        const isL  = i === n - 1;
        const pct  = isL ? Math.min(1, (tick % 80) / 40) : 1;

        ctx.fillStyle = col; ctx.globalAlpha = 0.11;
        ctx.fillRect(x - bw / 2, CH + 5, bw, c.v * (H - CH - 9));
        ctx.globalAlpha = 1;

        ctx.strokeStyle = col; ctx.lineWidth = 0.9; ctx.globalAlpha = 0.7;
        ctx.beginPath(); ctx.moveTo(x, py(c.h)); ctx.lineTo(x, py(c.l)); ctx.stroke();

        const bt = Math.min(py(c.o), py(c.c));
        const bh = Math.max(1.5, Math.abs(py(c.o) - py(c.c)) * pct);
        ctx.globalAlpha = isL ? 0.55 + Math.sin(tick * 0.1) * 0.45 : 0.85;
        ctx.fillStyle = col;
        ctx.fillRect(x - bw / 2, bt, bw, bh);
        if (isL) {
          ctx.shadowColor = col; ctx.shadowBlur = 12;
          ctx.fillRect(x - bw / 2, bt, bw, bh);
          ctx.shadowBlur = 0;
        }
        ctx.globalAlpha = 1;
      });

      // EMA
      ctx.beginPath(); ctx.strokeStyle = "rgba(74,222,128,0.55)"; ctx.lineWidth = 1.5;
      ctx.shadowColor = "#4ade80"; ctx.shadowBlur = 5;
      cs.forEach((c, i) => { const x = cw*(i+1); i===0 ? ctx.moveTo(x,py((c.o+c.c)/2)) : ctx.lineTo(x,py((c.o+c.c)/2)); });
      ctx.stroke(); ctx.shadowBlur = 0;

      // Bollinger bands
      [1, -1].forEach(sign => {
        ctx.beginPath(); ctx.strokeStyle = "rgba(251,191,36,0.18)"; ctx.lineWidth = 0.8;
        cs.forEach((c, i) => {
          const x = cw*(i+1);
          const off = 75 + Math.sin(i * 0.25) * 25;
          i===0 ? ctx.moveTo(x, py((c.o+c.c)/2 + sign*off)) : ctx.lineTo(x, py((c.o+c.c)/2 + sign*off));
        });
        ctx.stroke();
      });

      // Dashed price line
      const lastY = py(cs[n - 1].c);
      ctx.beginPath(); ctx.strokeStyle = "rgba(74,222,128,0.28)"; ctx.lineWidth = 0.7; ctx.setLineDash([3, 5]);
      ctx.moveTo(0, lastY); ctx.lineTo(W, lastY); ctx.stroke(); ctx.setLineDash([]);

      // Price label
      ctx.fillStyle = "rgba(34,197,94,0.18)";
      ctx.fillRect(4, lastY - 8, 58, 16);
      ctx.fillStyle = "rgba(74,222,128,0.9)"; ctx.font = "bold 9px monospace"; ctx.textAlign = "left";
      ctx.fillText(cs[n-1].c.toFixed(0), 8, lastY + 3.5);

      tick++;
      frameRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full block" width={820} height={370} />;
}

// ── Main modal ──────────────────────────────────────────────────────────────────
export default function LiveDemoModal({ isOpen, onClose }: Props) {
  const [tf, setTf]       = useState<TF>("5M");
  const [price, setPrice] = useState(67842.50);
  const priceRef          = useRef(67842.50);
  const [activePair, setActivePair] = useState(0);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const t = setInterval(() => {
      priceRef.current += (Math.random() - 0.47) * 30;
      setPrice(+priceRef.current.toFixed(2));
    }, 900);
    return () => clearInterval(t);
  }, [isOpen]);

  const up   = price >= 67842.50;
  const pnl  = ((price - 67420) * 0.5).toFixed(2);
  const pnlPct = (((price - 67420) / 67420) * 100).toFixed(2);

  const asks = [
    ["68,240", "0.42", 18], ["68,195", "1.15", 46],
    ["68,140", "0.78", 31], ["68,082", "2.33", 93],
    ["68,021", "0.96", 38],
  ];
  const bids = [
    ["67,998", "2.31", 92], ["67,952", "0.96", 38],
    ["67,910", "1.88", 75], ["67,848", "3.12", 100],
    ["67,791", "0.74", 29],
  ];

  const pairs = ["BTC/USD", "ETH/USD", "SPX"];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/93 backdrop-blur-sm" onClick={onClose} />

          {/* Panel */}
          <motion.div
            className="relative w-full max-w-5xl bg-[#0d0c09] border border-white/8 rounded-2xl overflow-hidden flex flex-col"
            style={{ maxHeight: "calc(100vh - 3rem)", height: "640px" }}
            initial={{ scale: 0.94, y: 28, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.93, y: 20, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Live price ticker strip */}
            <TickerStrip isOpen={isOpen} />

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" style={{ boxShadow: "0 0 6px #4ade80" }} />
                <span className="text-emerald-400/80 text-xs font-mono tracking-widest">FINANCEFLOW · LIVE DEMO</span>
                <span className="text-white/15 text-xs">|</span>
                {pairs.map((pair, i) => (
                  <button
                    key={pair}
                    onClick={() => setActivePair(i)}
                    className={`text-xs font-mono px-2 py-0.5 rounded-md transition-all cursor-pointer whitespace-nowrap ${
                      activePair === i
                        ? "bg-white/8 text-white/85 border border-white/10"
                        : "text-white/30 hover:text-white/60"
                    }`}
                  >
                    {pair}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-white/30 text-xs font-mono">BTC/USD  </span>
                  <span
                    className="text-lg font-mono font-extrabold"
                    style={{
                      color: up ? "#4ade80" : "#f87171",
                      textShadow: up ? "0 0 14px rgba(74,222,128,0.55)" : "0 0 14px rgba(248,113,113,0.55)",
                    }}
                  >
                    {price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span className={`ml-2 text-xs font-mono ${up ? "text-emerald-400" : "text-red-400"}`}>
                    {up ? "+1.24%" : "-0.58%"}
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 border border-white/8 text-white/50 hover:text-white hover:border-white/20 transition-colors cursor-pointer"
                >
                  <i className="ri-close-line text-sm" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex flex-1 min-h-0">

              {/* Chart area */}
              <div className="flex-1 flex flex-col min-w-0 border-r border-white/5">
                {/* Timeframe + indicator row */}
                <div className="flex items-center gap-1 px-4 py-2 border-b border-white/5 shrink-0">
                  {(["1M", "5M", "15M", "1H"] as TF[]).map(t => (
                    <button
                      key={t}
                      onClick={() => setTf(t)}
                      className={`text-[11px] font-mono px-2.5 py-1 rounded transition-all cursor-pointer whitespace-nowrap ${
                        tf === t
                          ? "bg-emerald-400/10 text-emerald-400 border border-emerald-400/25"
                          : "text-white/30 hover:text-white/60"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                  <div className="ml-auto flex items-center gap-3 text-[10px] font-mono">
                    <span className="text-amber-400/50">BB(20,2)</span>
                    <span className="text-emerald-400/50">EMA(9)</span>
                    <span className="text-white/20">VOL</span>
                    <span className="text-white/15">|</span>
                    <span className="text-red-400/50 animate-pulse">● LIVE</span>
                  </div>
                </div>

                {/* Canvas */}
                <div className="flex-1 relative min-h-0">
                  <ChartCanvas tf={tf} />
                  <div className="absolute bottom-2 right-4 text-[9px] font-mono text-white/12 select-none">
                    Powered by Solutions Studio
                  </div>
                </div>
              </div>

              {/* Order book + stats */}
              <div className="w-52 shrink-0 flex flex-col">
                <div className="flex-1 p-3 overflow-hidden">
                  <p className="text-white/22 text-[9px] font-mono tracking-widest mb-2">ORDER BOOK</p>

                  {/* Asks */}
                  <div className="space-y-0.5 mb-1.5">
                    {asks.map(([p, v, depth], i) => (
                      <div key={i} className="flex items-center gap-1 relative overflow-hidden rounded-sm">
                        <div
                          className="absolute inset-y-0 left-0 rounded-sm"
                          style={{ width: `${depth}%`, background: "rgba(239,68,68,0.07)" }}
                        />
                        <span className="text-red-400/60 text-[8px] font-mono flex-1 relative z-10">{p}</span>
                        <span className="text-white/22 text-[8px] font-mono relative z-10">{v}</span>
                      </div>
                    ))}
                  </div>

                  {/* Spread */}
                  <div className="flex items-center justify-between py-1 border-y border-white/5 mb-1.5">
                    <span className="text-white/20 text-[8px] font-mono">SPREAD</span>
                    <span className="text-white/40 text-[8px] font-mono">$2.5 · 0.004%</span>
                  </div>

                  {/* Bids */}
                  <div className="space-y-0.5">
                    {bids.map(([p, v, depth], i) => (
                      <div key={i} className="flex items-center gap-1 relative overflow-hidden rounded-sm">
                        <div
                          className="absolute inset-y-0 left-0 rounded-sm"
                          style={{ width: `${depth}%`, background: "rgba(34,197,94,0.08)" }}
                        />
                        <span className="text-emerald-400/60 text-[8px] font-mono flex-1 relative z-10">{p}</span>
                        <span className="text-white/22 text-[8px] font-mono relative z-10">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Market stats */}
                <div className="px-3 pb-3 border-t border-white/5 pt-2 space-y-1.5 shrink-0">
                  {[
                    ["24H Volume", "$2.14B"],
                    ["24H High",   "68,921"],
                    ["24H Low",    "66,842"],
                    ["Open Int",   "$18.3B"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="text-white/22 text-[9px] font-mono">{k}</span>
                      <span className="text-white/55 text-[9px] font-mono">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer position bar */}
            <div className="flex items-center gap-6 px-5 py-2.5 border-t border-white/5 bg-white/[0.015] shrink-0">
              <div>
                <span className="text-white/25 text-[9px] font-mono block">OPEN POSITION</span>
                <span className="text-white/65 text-xs font-mono font-medium">BTC/USD LONG 0.5 @ 67,420.00</span>
              </div>
              <div>
                <span className="text-white/25 text-[9px] font-mono block">UNREALISED P&amp;L</span>
                <span
                  className="text-xs font-mono font-bold"
                  style={{
                    color: parseFloat(pnl) >= 0 ? "#4ade80" : "#f87171",
                    textShadow: parseFloat(pnl) >= 0
                      ? "0 0 8px rgba(74,222,128,0.4)"
                      : "0 0 8px rgba(248,113,113,0.4)",
                  }}
                >
                  {parseFloat(pnl) >= 0 ? "+" : ""}${pnl}  ({parseFloat(pnlPct) >= 0 ? "+" : ""}{pnlPct}%)
                </span>
              </div>
              <div>
                <span className="text-white/25 text-[9px] font-mono block">MARGIN</span>
                <span className="text-white/55 text-xs font-mono">$6,742.00</span>
              </div>
              <div>
                <span className="text-white/25 text-[9px] font-mono block">LIQ PRICE</span>
                <span className="text-white/55 text-xs font-mono">$54,218.40</span>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <span className="text-white/18 text-[9px] font-mono">DEMO · Solutions Studio</span>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ boxShadow: "0 0 4px #4ade80", animation: "pulse 2s ease-in-out infinite" }} />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}