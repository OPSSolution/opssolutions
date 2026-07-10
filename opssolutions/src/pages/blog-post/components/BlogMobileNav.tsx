import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { BlogPost } from "../data";

interface Props {
  post: BlogPost;
}

export default function BlogMobileNav({ post }: Props) {
  const [progress, setProgress]           = useState(0);
  const [tocOpen, setTocOpen]             = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [hasScrolled, setHasScrolled]     = useState(false);
  const rafRef = useRef<number>(0);

  // ── scroll progress tracking ───────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docH = document.documentElement.scrollHeight - window.innerHeight;
        const pct  = Math.min(100, (scrollTop / Math.max(1, docH)) * 100);
        setProgress(pct);
        if (scrollTop > 80) setHasScrolled(true);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(rafRef.current); };
  }, []);

  // ── active section via IntersectionObserver ────────────────────────────────
  useEffect(() => {
    const headings = post.toc
      .map(t => document.getElementById(t.id))
      .filter(Boolean) as HTMLElement[];
    if (!headings.length) return;

    const observer = new IntersectionObserver(
      entries => {
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length) setActiveSection(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -55% 0px" }
    );
    headings.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [post]);

  // ── ESC closes TOC ─────────────────────────────────────────────────────────
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") setTocOpen(false); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setTocOpen(false);
  };

  const totalMins = parseInt(post.readTime) || 8;
  const minsLeft  = Math.max(0, Math.ceil(totalMins * (1 - progress / 100)));
  const timeLabel = progress >= 98 ? "Finished ✓" : `${minsLeft} min left`;

  const currentSection = post.toc.find(t => t.id === activeSection)?.title;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] md:hidden">

      {/* ── TOC drawer (slides up above the bar) ─────────────────────────── */}
      <AnimatePresence>
        {tocOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-[-1]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setTocOpen(false)}
            />

            {/* Drawer panel */}
            <motion.div
              className="bg-[#0c0b08]/98 backdrop-blur-xl border-t border-white/8 overflow-hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="px-5 pt-4 pb-2">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white/25 text-[9px] font-mono tracking-widest">
                    TABLE OF CONTENTS
                  </span>
                  <span className="text-white/20 text-[9px] font-mono">{progress.toFixed(0)}% read</span>
                </div>

                {/* Progress mini bar */}
                <div className="w-full h-[1.5px] bg-white/6 rounded-full overflow-hidden mb-3">
                  <div
                    className="h-full bg-accent rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <nav className="flex flex-col gap-0.5 max-h-[50vh] overflow-y-auto pb-1">
                  {post.toc.map(item => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`text-left text-sm px-3 py-2.5 rounded-xl transition-all duration-150 cursor-pointer whitespace-normal ${
                        activeSection === item.id
                          ? "text-accent bg-accent/8 border-l-2 border-accent"
                          : "text-white/45 hover:text-white/80 border-l-2 border-white/8"
                      }`}
                    >
                      {item.title}
                    </button>
                  ))}
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Progress bar strip ─────────────────────────────────────────────── */}
      <div className="h-[2px] bg-white/5 w-full">
        <div
          className="h-full bg-accent transition-all duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* ── Bottom nav bar ────────────────────────────────────────────────── */}
      <motion.div
        className="flex items-center gap-3 px-4 py-3 bg-[#080d1a]/97 backdrop-blur-md border-t border-white/5"
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: hasScrolled ? 0 : 80, opacity: hasScrolled ? 1 : 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Time remaining */}
        <div className="flex items-center gap-1.5 shrink-0">
          <i className="ri-time-line text-white/35 text-xs" />
          <span className={`text-xs font-mono whitespace-nowrap ${progress >= 98 ? "text-accent/80" : "text-white/40"}`}>
            {timeLabel}
          </span>
        </div>

        {/* Current section label */}
        <div className="flex-1 min-w-0 px-1">
          {currentSection ? (
            <motion.p
              key={currentSection}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-white/30 text-[11px] truncate font-medium"
            >
              {currentSection}
            </motion.p>
          ) : (
            <p className="text-white/20 text-[11px] truncate">{post.category}</p>
          )}
        </div>

        {/* Percent + TOC toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-white/22 text-[10px] font-mono">{Math.round(progress)}%</span>
          <button
            onClick={() => setTocOpen(v => !v)}
            className={`w-8 h-8 flex items-center justify-center rounded-xl border transition-all duration-200 cursor-pointer ${
              tocOpen
                ? "bg-accent/15 border-accent/35 text-accent"
                : "bg-white/5 border-white/8 text-white/45 hover:text-white hover:border-white/18"
            }`}
          >
            <i className={`${tocOpen ? "ri-close-line" : "ri-list-check-2"} text-sm`} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}