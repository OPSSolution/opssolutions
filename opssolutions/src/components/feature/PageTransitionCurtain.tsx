import { useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { useLocation } from "react-router-dom";

const PATH_LABELS: Record<string, string> = {
  "/": "Home",
  "/blog": "Blog",
  "/case-studies": "Case Studies",
  "/process": "Process",
  "/careers": "Careers",
  "/pricing": "Pricing",
  "/industries": "Industries",
  "/contact": "Contact",
};

function getLabel(pathname: string): string {
  if (PATH_LABELS[pathname]) return PATH_LABELS[pathname];
  if (pathname.startsWith("/blog/")) return "Article";
  if (pathname.startsWith("/case-study/")) return "Case Study";
  if (pathname.startsWith("/services/")) return "Service";
  if (pathname.startsWith("/industries/")) return "Industry";
  return "Page";
}

export default function PageTransitionCurtain() {
  const location = useLocation();
  const controls = useAnimation();
  const [label, setLabel] = useState("");
  const [showLabel, setShowLabel] = useState(false);
  const prevPathRef = useRef(location.pathname);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (prevPathRef.current === location.pathname) return;
    prevPathRef.current = location.pathname;

    const pageLabel = getLabel(location.pathname);
    setLabel(pageLabel);

    const run = async () => {
      // Phase 1: Curtain slides in from the LEFT covering the screen
      await controls.start({
        x: 0,
        transition: { duration: 0.38, ease: [0.76, 0, 0.24, 1] },
      });

      // Show label briefly
      setShowLabel(true);
      await new Promise((r) => setTimeout(r, 160));
      setShowLabel(false);

      // Phase 2: Curtain slides OUT to the RIGHT revealing new page
      await controls.start({
        x: "101%",
        transition: { duration: 0.42, ease: [0.76, 0, 0.24, 1] },
      });

      // Reset off-screen to the left for next use
      controls.set({ x: "-101%" });
    };

    run();
  }, [location.pathname, controls]);

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none"
      initial={{ x: "-101%" }}
      animate={controls}
      aria-hidden="true"
    >
      {/* Main curtain */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, #0a0a0a 0%, #0d1a00 50%, #0a0a0a 100%)",
        }}
      />

      {/* Accent stripe */}
      <div
        className="absolute inset-y-0 left-0 w-1"
        style={{ background: "rgba(41,171,226,0.8)" }}
      />

      {/* Center label */}
      <motion.div
        className="relative z-10 flex flex-col items-center gap-2"
        animate={{ opacity: showLabel ? 1 : 0, y: showLabel ? 0 : 12 }}
        transition={{ duration: 0.2 }}
      >
        <span className="text-accent text-xs font-mono tracking-[0.35em] uppercase opacity-60">
          Loading
        </span>
        <span className="text-white text-3xl font-bold tracking-tight">{label}</span>
        <div className="flex gap-1.5 mt-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1 h-1 rounded-full bg-accent/60"
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.18, ease: "easeInOut" }}
            />
          ))}
        </div>
      </motion.div>

      {/* Grid decoration */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(41,171,226,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(41,171,226,0.8) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
    </motion.div>
  );
}