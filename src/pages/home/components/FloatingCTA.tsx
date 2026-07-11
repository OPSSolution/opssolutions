import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useSpring, useMotionValue } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

type PillState = "hidden" | "icon" | "full";

export default function FloatingCTA() {
  const [pillState, setPillState] = useState<PillState>("hidden");
  const navigate = useNavigate();
  const location = useLocation();
  const morphTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 3D tilt on the pill
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const tiltX = useSpring(mouseX, { stiffness: 180, damping: 22 });
  const tiltY = useSpring(mouseY, { stiffness: 180, damping: 22 });

  useEffect(() => {
    const heroEl = document.querySelector("#home") as HTMLElement | null;

    const handleScroll = () => {
      const heroHeight = heroEl
        ? heroEl.offsetTop + heroEl.offsetHeight
        : window.innerHeight * 0.9;

      if (window.scrollY > heroHeight) {
        if (pillState === "hidden") {
          setPillState("icon");
          // After 1.4s, morph to full pill
          morphTimerRef.current = setTimeout(() => {
            setPillState("full");
          }, 1400);
        }
      } else {
        if (morphTimerRef.current) clearTimeout(morphTimerRef.current);
        setPillState("hidden");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (morphTimerRef.current) clearTimeout(morphTimerRef.current);
    };
  }, [pillState]);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    mouseX.set(((e.clientX - cx) / rect.width) * 10);
    mouseY.set(((e.clientY - cy) / rect.height) * -8);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleClick = () => {
    const el = document.getElementById("contact");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/contact");
    }
  };

  // Hide on contact page
  if (location.pathname === "/contact") return null;

  return createPortal(
    <AnimatePresence>
      {pillState !== "hidden" && (
        <motion.div
          className="fixed bottom-28 right-6 md:right-8 z-50"
          initial={{ opacity: 0, scale: 0.4, x: 30 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.5, x: 20 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Outer glow ring — only on icon state */}
          <AnimatePresence>
            {pillState === "icon" && (
              <motion.div
                className="absolute inset-0 rounded-full pointer-events-none"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.35, 1] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                style={{ background: "radial-gradient(circle, rgba(41,171,226,0.3) 0%, transparent 75%)" }}
              />
            )}
          </AnimatePresence>

          {/* The morphing button */}
          <motion.button
            layout
            onClick={handleClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative flex items-center justify-center gap-0 bg-accent text-black font-bold cursor-pointer whitespace-nowrap overflow-hidden"
            style={{
              borderRadius: "9999px",
              boxShadow: "0 8px 32px rgba(41,171,226,0.35), 0 2px 8px rgba(0,0,0,0.3)",
              rotateX: tiltY,
              rotateY: tiltX,
              transformPerspective: 600,
              // Size for icon state
              width: pillState === "icon" ? "48px" : "auto",
              height: "48px",
              paddingLeft: pillState === "icon" ? 0 : "20px",
              paddingRight: pillState === "icon" ? 0 : "20px",
            }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            transition={{ layout: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } }}
            aria-label="Start a Project"
          >
            {/* Icon — always present */}
            <motion.span
              className="flex items-center justify-center shrink-0"
              layout
              style={{ width: "20px", height: "20px" }}
            >
              <i className="ri-send-plane-line text-base leading-none"></i>
            </motion.span>

            {/* Text — fades in when full */}
            <AnimatePresence>
              {pillState === "full" && (
                <motion.span
                  className="text-sm font-bold leading-none ml-2"
                  initial={{ opacity: 0, width: 0, x: -6 }}
                  animate={{ opacity: 1, width: "auto", x: 0 }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                  style={{ overflow: "hidden", whiteSpace: "nowrap" }}
                >
                  Start a Project
                </motion.span>
              )}
            </AnimatePresence>

            {/* Shimmer sweep on morph */}
            <AnimatePresence>
              {pillState === "full" && (
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  initial={{ x: "-100%" }}
                  animate={{ x: "180%" }}
                  transition={{ duration: 0.65, ease: "easeInOut" }}
                  style={{
                    background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%)",
                    skewX: "-15deg",
                  }}
                />
              )}
            </AnimatePresence>
          </motion.button>

          {/* Tooltip when icon-only */}
          <AnimatePresence>
            {pillState === "icon" && (
              <motion.div
                className="absolute right-full mr-3 top-1/2 -translate-y-1/2 pointer-events-none"
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <span className="bg-dc-bg/90 border border-dc-text/15 backdrop-blur-sm text-dc-text/70 text-xs font-medium px-2.5 py-1.5 rounded-lg whitespace-nowrap">
                  Start a Project
                </span>
                {/* Arrow */}
                <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full w-0 h-0 border-y-4 border-y-transparent border-l-4 border-l-dc-text/15" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}