import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

const DISMISS_KEY = "dc_floatingcta_dismissed_v2";

export default function FloatingBookCTA() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const wasDismissed = sessionStorage.getItem(DISMISS_KEY);
    if (wasDismissed) { setDismissed(true); return; }

    const handleScroll = () => {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const pct = total > 0 ? scrolled / total : 0;
      if (pct >= 0.4 && !dismissed) {
        setVisible(true);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [dismissed]);

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDismissed(true);
    setVisible(false);
    sessionStorage.setItem(DISMISS_KEY, "1");
  };

  const handleBookCall = () => {
    setExpanded(false);
    navigate("/contact");
  };

  // Don't show on contact page
  if (location.pathname === "/contact") return null;
  if (dismissed) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3"
          initial={{ opacity: 0, y: 40, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.9 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Expanded panel */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, y: 16, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="bg-dc-bg border border-dc-text/15 rounded-2xl p-5 w-72"
                style={{ boxShadow: "0 24px 64px rgba(0,0,0,0.45), 0 0 0 1px rgba(41,171,226,0.1)" }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-accent/15 border border-accent/25">
                      <i className="ri-calendar-check-line text-accent text-base"></i>
                    </div>
                    <div>
                      <p className="text-dc-text font-bold text-sm">Free Discovery Call</p>
                      <p className="text-dc-text/45 text-xs">30 min · No commitment</p>
                    </div>
                  </div>
                  <button onClick={handleDismiss} className="w-7 h-7 flex items-center justify-center rounded-full text-dc-text/40 hover:text-dc-text hover:bg-dc-text/8 transition-all duration-200 cursor-pointer shrink-0 -mt-0.5">
                    <i className="ri-close-line text-sm"></i>
                  </button>
                </div>

                {/* Bullets */}
                <div className="flex flex-col gap-2 mb-5">
                  {[
                    "Scope your project with a senior engineer",
                    "Get a fixed-price estimate in 48 hours",
                    "No pitch decks, no sales pressure",
                  ].map((pt) => (
                    <div key={pt} className="flex items-start gap-2">
                      <i className="ri-check-line text-accent text-xs mt-0.5 shrink-0"></i>
                      <p className="text-dc-text/65 text-xs leading-snug">{pt}</p>
                    </div>
                  ))}
                </div>

                {/* Availability signal */}
                <div className="flex items-center gap-2 bg-accent/8 border border-accent/15 rounded-xl px-3 py-2 mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-slow shrink-0"></span>
                  <p className="text-accent/80 text-xs font-medium">Taking on Q3 projects now</p>
                </div>

                {/* CTA */}
                <motion.button
                  onClick={handleBookCall}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full flex items-center justify-center gap-2 bg-accent text-black font-bold py-3 rounded-xl text-sm hover:bg-white transition-colors duration-300 cursor-pointer whitespace-nowrap"
                >
                  Book My Free Call
                  <i className="ri-arrow-right-line text-sm"></i>
                </motion.button>

                <p className="text-dc-text/25 text-center text-[10px] mt-2.5 font-mono">
                  Replies within 24 hours, guaranteed
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Trigger pill button */}
          <div className="flex items-center gap-2">
            {/* Dismiss on collapsed state */}
            {!expanded && (
              <motion.button
                onClick={handleDismiss}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-dc-bg/90 border border-dc-text/15 text-dc-text/35 hover:text-dc-text hover:border-dc-text/25 transition-all duration-200 cursor-pointer backdrop-blur-sm"
              >
                <i className="ri-close-line text-sm"></i>
              </motion.button>
            )}

            <motion.button
              onClick={() => setExpanded(!expanded)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-2.5 bg-accent text-black font-bold text-sm px-5 py-3 rounded-full cursor-pointer whitespace-nowrap"
              style={{ boxShadow: "0 8px 32px rgba(41,171,226,0.3), 0 2px 8px rgba(0,0,0,0.3)" }}
            >
              <motion.span
                className="w-2 h-2 rounded-full bg-black/30"
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              Book a Discovery Call
              <motion.i
                className="ri-arrow-up-line text-sm"
                animate={{ rotate: expanded ? 180 : 0 }}
                transition={{ duration: 0.25 }}
              />
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}