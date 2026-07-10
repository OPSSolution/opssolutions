import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

interface Command {
  id: string;
  label: string;
  description?: string;
  icon: string;
  category: "Pages" | "Sections" | "Actions" | "Services";
  action: () => void;
  keywords?: string[];
}

function useCommandPalette() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return { open, setOpen };
}

export default function CommandPalette() {
  const navigate = useNavigate();
  const location = useLocation();
  const { open, setOpen } = useCommandPalette();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const scrollToSection = useCallback(
    (hash: string) => {
      setOpen(false);
      if (location.pathname !== "/") {
        navigate(`/${hash}`);
      } else {
        const el = document.querySelector(hash);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }
    },
    [location.pathname, navigate, setOpen]
  );

  const goTo = useCallback(
    (path: string) => {
      setOpen(false);
      navigate(path);
    },
    [navigate, setOpen]
  );

  const commands: Command[] = [
    // Pages
    { id: "home", label: "Home", description: "Go to the homepage", icon: "ri-home-4-line", category: "Pages", action: () => goTo("/"), keywords: ["main", "start"] },
    { id: "pricing", label: "Pricing", description: "View our transparent pricing", icon: "ri-price-tag-3-line", category: "Pages", action: () => goTo("/pricing"), keywords: ["cost", "quote", "estimate", "budget"] },
    { id: "blog", label: "Blog", description: "Read our latest articles", icon: "ri-article-line", category: "Pages", action: () => goTo("/blog"), keywords: ["articles", "posts", "news"] },
    { id: "case-studies", label: "Case Studies", description: "Browse all project case studies", icon: "ri-folder-chart-line", category: "Pages", action: () => goTo("/case-studies"), keywords: ["work", "portfolio", "results"] },
    { id: "careers", label: "Careers", description: "Join our team — we're hiring", icon: "ri-briefcase-line", category: "Pages", action: () => goTo("/careers"), keywords: ["jobs", "hiring", "work"] },
    { id: "contact", label: "Contact", description: "Get in touch with us", icon: "ri-mail-send-line", category: "Pages", action: () => goTo("/contact"), keywords: ["email", "reach", "talk"] },
    // Sections
    { id: "sec-services", label: "Services Section", description: "Jump to what we build", icon: "ri-stack-line", category: "Sections", action: () => scrollToSection("#services"), keywords: ["what we do", "capabilities"] },
    { id: "sec-portfolio", label: "Portfolio Section", description: "See selected projects", icon: "ri-gallery-line", category: "Sections", action: () => scrollToSection("#portfolio"), keywords: ["work", "projects"] },
    { id: "sec-features", label: "Features Section", description: "Why choose us", icon: "ri-award-line", category: "Sections", action: () => scrollToSection("#features"), keywords: ["why", "advantages"] },
    { id: "sec-testimonials", label: "Testimonials", description: "What clients say", icon: "ri-chat-quote-line", category: "Sections", action: () => scrollToSection("#testimonials"), keywords: ["reviews", "feedback"] },
    { id: "sec-stats", label: "Stats & Numbers", description: "Our impact by the numbers", icon: "ri-bar-chart-grouped-line", category: "Sections", action: () => scrollToSection("#stats"), keywords: ["metrics", "results"] },
    { id: "sec-team", label: "Meet the Team", description: "The people behind the work", icon: "ri-team-line", category: "Sections", action: () => scrollToSection("#team"), keywords: ["people", "founders", "engineers"] },
    { id: "sec-faq", label: "FAQ", description: "Common questions answered", icon: "ri-questionnaire-line", category: "Sections", action: () => scrollToSection("#faq"), keywords: ["questions", "help"] },
    // Services
    { id: "svc-web", label: "Web Development", description: "Scalable web apps & platforms", icon: "ri-window-line", category: "Services", action: () => goTo("/services/web-development") },
    { id: "svc-mobile", label: "Mobile Development", description: "iOS & Android apps", icon: "ri-smartphone-line", category: "Services", action: () => goTo("/services/mobile-development") },
    { id: "svc-cloud", label: "Cloud & DevOps", description: "Infrastructure & CI/CD", icon: "ri-cloud-line", category: "Services", action: () => goTo("/services/cloud-devops") },
    { id: "svc-ai", label: "AI Integration", description: "LLM & ML products", icon: "ri-robot-line", category: "Services", action: () => goTo("/services/ai-integration") },
    { id: "svc-design", label: "UI/UX Design", description: "Product design systems", icon: "ri-palette-line", category: "Services", action: () => goTo("/services/ui-ux-design") },
    // Actions
    { id: "act-project", label: "Start a Project", description: "Tell us about your idea", icon: "ri-rocket-line", category: "Actions", action: () => scrollToSection("#contact"), keywords: ["hire", "build", "work with us"] },
    { id: "act-quote", label: "Get a Quote", description: "Instant price estimate", icon: "ri-calculator-line", category: "Actions", action: () => goTo("/pricing"), keywords: ["price", "cost", "how much"] },
    { id: "act-call", label: "Book a Discovery Call", description: "Free 30-min strategy call", icon: "ri-phone-line", category: "Actions", action: () => scrollToSection("#contact"), keywords: ["call", "meeting", "book"] },
    { id: "act-portfolio", label: "Request Full Portfolio", description: "See all our work", icon: "ri-file-list-3-line", category: "Actions", action: () => scrollToSection("#contact"), keywords: ["portfolio", "past work", "examples"] },
  ];

  const filtered = query.trim()
    ? commands.filter((cmd) => {
        const q = query.toLowerCase();
        return (
          cmd.label.toLowerCase().includes(q) ||
          (cmd.description?.toLowerCase().includes(q)) ||
          cmd.category.toLowerCase().includes(q) ||
          cmd.keywords?.some((k) => k.toLowerCase().includes(q))
        );
      })
    : commands;

  const grouped = filtered.reduce<Record<string, Command[]>>((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = [];
    acc[cmd.category].push(cmd);
    return acc;
  }, {});

  const flatFiltered = filtered;

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 60);
      setQuery("");
      setActiveIndex(0);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const handleNav = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, flatFiltered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        flatFiltered[activeIndex]?.action();
      }
    };
    window.addEventListener("keydown", handleNav);
    return () => window.removeEventListener("keydown", handleNav);
  }, [open, flatFiltered, activeIndex]);

  // Scroll active item into view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-cmd-index="${activeIndex}"]`);
    if (el) el.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const categoryColors: Record<string, string> = {
    Pages: "text-accent",
    Sections: "text-sky-400",
    Actions: "text-orange-400",
    Services: "text-violet-400",
  };

  const categoryIcons: Record<string, string> = {
    Pages: "ri-pages-line",
    Sections: "ri-layout-grid-line",
    Actions: "ri-flashlight-line",
    Services: "ri-code-box-line",
  };

  let flatIdx = 0;

  return (
    <>
      {/* Trigger hint — shown in Navbar region via portal approach  */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[9000] flex items-start justify-center pt-[12vh] px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
              onClick={() => setOpen(false)}
            />

            {/* Panel */}
            <motion.div
              className="relative z-10 w-full max-w-2xl"
              initial={{ opacity: 0, y: -24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.97 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              style={{ perspective: 1000 }}
            >
              <div className="bg-[#0f1117] border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/60">
                {/* Search input */}
                <div className="flex items-center gap-3 px-5 py-4 border-b border-white/8">
                  <div className="w-5 h-5 flex items-center justify-center shrink-0">
                    <i className="ri-search-line text-white/40 text-base"></i>
                  </div>
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search pages, sections, actions..."
                    className="flex-1 bg-transparent text-white text-sm placeholder-white/25 outline-none font-medium"
                  />
                  {query && (
                    <button
                      onClick={() => setQuery("")}
                      className="w-5 h-5 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer shrink-0"
                    >
                      <i className="ri-close-line text-white/60 text-xs"></i>
                    </button>
                  )}
                  <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-md bg-white/5 border border-white/8 text-white/30 text-xs font-mono shrink-0">
                    ESC
                  </kbd>
                </div>

                {/* Results */}
                <div ref={listRef} className="max-h-[420px] overflow-y-auto overscroll-contain">
                  {Object.keys(grouped).length === 0 ? (
                    <div className="flex flex-col items-center gap-3 py-14 text-white/30">
                      <div className="w-10 h-10 flex items-center justify-center">
                        <i className="ri-search-2-line text-3xl"></i>
                      </div>
                      <p className="text-sm">No results for &ldquo;{query}&rdquo;</p>
                    </div>
                  ) : (
                    <div className="py-2">
                      {Object.entries(grouped).map(([category, cmds]) => (
                        <div key={category}>
                          {/* Category label */}
                          <div className="flex items-center gap-2 px-5 py-2 mt-1">
                            <div className="w-4 h-4 flex items-center justify-center">
                              <i className={`${categoryIcons[category]} text-xs ${categoryColors[category]}`}></i>
                            </div>
                            <span className={`text-[10px] font-bold tracking-widest font-mono ${categoryColors[category]}`}>
                              {category.toUpperCase()}
                            </span>
                          </div>

                          {cmds.map((cmd) => {
                            const myIdx = flatIdx++;
                            const isActive = activeIndex === myIdx;
                            return (
                              <motion.button
                                key={cmd.id}
                                data-cmd-index={myIdx}
                                onClick={cmd.action}
                                onMouseEnter={() => setActiveIndex(myIdx)}
                                className={`w-full flex items-center gap-3.5 px-5 py-3 text-left cursor-pointer transition-all duration-150 ${
                                  isActive ? "bg-white/7" : "hover:bg-white/4"
                                }`}
                                whileTap={{ scale: 0.99 }}
                              >
                                {/* Icon */}
                                <div className={`w-8 h-8 flex items-center justify-center rounded-lg shrink-0 transition-colors duration-150 ${
                                  isActive ? "bg-accent/20 border border-accent/30" : "bg-white/5 border border-white/8"
                                }`}>
                                  <i className={`${cmd.icon} text-sm ${isActive ? "text-accent" : "text-white/40"}`}></i>
                                </div>

                                {/* Text */}
                                <div className="flex-1 min-w-0">
                                  <p className={`text-sm font-medium ${isActive ? "text-white" : "text-white/70"}`}>
                                    {cmd.label}
                                  </p>
                                  {cmd.description && (
                                    <p className="text-xs text-white/30 truncate">{cmd.description}</p>
                                  )}
                                </div>

                                {/* Arrow hint */}
                                {isActive && (
                                  <motion.div
                                    className="w-6 h-6 flex items-center justify-center rounded-md bg-accent/10 border border-accent/20 shrink-0"
                                    initial={{ opacity: 0, x: 8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.15 }}
                                  >
                                    <i className="ri-corner-down-left-line text-accent/60 text-xs"></i>
                                  </motion.div>
                                )}
                              </motion.button>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="px-5 py-3 border-t border-white/8 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {[
                      { keys: ["↑", "↓"], label: "navigate" },
                      { keys: ["↵"], label: "open" },
                      { keys: ["Esc"], label: "close" },
                    ].map(({ keys, label }) => (
                      <div key={label} className="hidden sm:flex items-center gap-1.5">
                        {keys.map((k) => (
                          <kbd key={k} className="px-1.5 py-0.5 rounded bg-white/7 border border-white/10 text-white/35 text-[10px] font-mono">
                            {k}
                          </kbd>
                        ))}
                        <span className="text-white/25 text-[10px]">{label}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-white/20 text-[10px]">powered by</span>
                    <span className="text-accent/50 text-[10px] font-bold font-mono">Solutions</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Export a hook to trigger the palette from anywhere
export { useCommandPalette };