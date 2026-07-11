import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";


const homeLinks = [
  { label: "Home", href: "#home" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Team", href: "#team" },
  { label: "FAQ", href: "#faq" },
];

interface DropItem { label: string; path: string; icon: string; desc: string }

const workItems: DropItem[] = [
  { label: "Services", path: "/services/web-development", icon: "ri-service-line", desc: "Web, mobile, AI, cloud & more" },
  { label: "Case Studies", path: "/case-studies", icon: "ri-bar-chart-box-line", desc: "Real projects, real results" },
  { label: "Industries", path: "/industries", icon: "ri-building-4-line", desc: "Fintech, health, SaaS & more" },
  { label: "Pricing", path: "/pricing", icon: "ri-price-tag-3-line", desc: "Transparent fixed-scope pricing" },
];

const companyItems: DropItem[] = [
  { label: "How We Work", path: "/process", icon: "ri-route-line", desc: "Our 5-phase delivery process" },
  { label: "Blog", path: "/blog", icon: "ri-article-line", desc: "Insights, tutorials & updates" },
  { label: "Careers", path: "/careers", icon: "ri-team-line", desc: "Join our team of 60+ engineers" },
  { label: "Contact", path: "/contact", icon: "ri-mail-send-line", desc: "Start a project conversation" },
];

function DropdownMenu({
  items,
  onClose,
}: {
  items: DropItem[];
  onClose: () => void;
}) {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.97 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 bg-dc-bg/98 backdrop-blur-xl border border-dc-text/10 rounded-2xl overflow-hidden z-50"
      style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.35), 0 0 0 1px rgba(41,171,226,0.06)" }}
    >
      <div className="p-2 flex flex-col gap-0.5">
        {items.map((item) => (
          <button
            key={item.path}
            onClick={() => { navigate(item.path); onClose(); }}
            className="flex items-start gap-3 px-4 py-3 rounded-xl hover:bg-accent/8 group transition-all duration-200 cursor-pointer text-left w-full"
          >
            <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-dc-text/5 group-hover:bg-accent/15 border border-dc-text/8 group-hover:border-accent/25 shrink-0 mt-0.5 transition-all duration-200">
              <i className={`${item.icon} text-dc-text/50 group-hover:text-accent text-sm transition-colors duration-200`}></i>
            </div>
            <div>
              <p className="text-dc-text/85 text-sm font-semibold group-hover:text-accent transition-colors duration-200 leading-tight">{item.label}</p>
              <p className="text-dc-text/40 text-xs mt-0.5 leading-snug">{item.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [openDropdown, setOpenDropdown] = useState<null | "work" | "company">(null);
  const workRef = useRef<HTMLDivElement>(null);
  const companyRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Scroll progress bar
  const { scrollYProgress } = useScroll();
  const progressScaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });

  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
      if (!isHome) return;
      const sections = homeLinks.map((l) => l.href.replace("#", ""));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el) {
          const absoluteTop = el.getBoundingClientRect().top + window.scrollY;
          if (window.scrollY >= absoluteTop - 120) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        workRef.current && !workRef.current.contains(e.target as Node) &&
        companyRef.current && !companyRef.current.contains(e.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    setOpenDropdown(null);
    const id = href.replace("#", "");
    if (isHome) {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/", { state: { scrollTo: id } });
    }
  };

  const toggleDropdown = (key: "work" | "company") => {
    setOpenDropdown(openDropdown === key ? null : key);
  };

  const isWorkActive = location.pathname.startsWith("/services") ||
    location.pathname === "/case-studies" ||
    location.pathname === "/industries" ||
    location.pathname === "/pricing";

  const isCompanyActive = location.pathname === "/process" ||
    location.pathname === "/blog" ||
    location.pathname === "/careers" ||
    location.pathname === "/contact";

  return createPortal(
    <>
      {/* ── Scroll Progress Bar ── */}
      <motion.div
        className="fixed top-0 left-0 w-full h-[3px] z-[60] origin-left will-change-transform"
        style={{
          scaleX: progressScaleX,
          background: "linear-gradient(90deg, #29abe2 0%, #1e9fd8 50%, #29abe2 100%)",
          boxShadow: "0 0 12px 2px rgba(41,171,226,0.55)",
        }}
      />

      <motion.nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? "bg-dc-bg/95 backdrop-blur-md border-b border-dc-text/8"
            : "bg-dc-bg/40 backdrop-blur-sm border-b border-transparent"
        }`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between h-20">
          {/* Logo */}
          <button onClick={() => navigate("/")} className="flex items-center gap-3 cursor-pointer shrink-0">
            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
              <img
                src="/images/logo.jpg"
                alt="Solutions Studio Logo"
                className="h-16 w-16 object-cover rounded-full"
              />
            </motion.div>
            <span className="hidden sm:flex flex-col gap-1">
              <span className="text-dc-text font-bold text-xl leading-none tracking-tight">
                OPS <span className="text-accent">Solutions</span>
              </span>
              <span className="text-dc-text/40 text-[10px] font-mono tracking-[0.2em] uppercase leading-none">
                Co., Ltd. · Cambodia
              </span>
            </span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {/* Home links */}
            {homeLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className={`relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-250 cursor-pointer whitespace-nowrap group ${
                  isHome && activeSection === link.href.replace("#", "")
                    ? "text-accent"
                    : "text-dc-text/55 hover:text-dc-text hover:bg-dc-text/5"
                }`}
              >
                {link.label}
                {isHome && activeSection === link.href.replace("#", "") && (
                  <motion.span layoutId="navActive" className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent" />
                )}
              </button>
            ))}

            {/* Work Dropdown */}
            <div ref={workRef} className="relative">
              <button
                onClick={() => toggleDropdown("work")}
                className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-full transition-all duration-250 cursor-pointer whitespace-nowrap ${
                  isWorkActive || openDropdown === "work"
                    ? "text-accent bg-accent/8"
                    : "text-dc-text/55 hover:text-dc-text hover:bg-dc-text/5"
                }`}
              >
                Work
                <motion.i
                  className="ri-arrow-down-s-line text-sm"
                  animate={{ rotate: openDropdown === "work" ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                />
              </button>
              <AnimatePresence>
                {openDropdown === "work" && (
                  <DropdownMenu items={workItems} onClose={() => setOpenDropdown(null)} />
                )}
              </AnimatePresence>
            </div>

            {/* Company Dropdown */}
            <div ref={companyRef} className="relative">
              <button
                onClick={() => toggleDropdown("company")}
                className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-full transition-all duration-250 cursor-pointer whitespace-nowrap ${
                  isCompanyActive || openDropdown === "company"
                    ? "text-accent bg-accent/8"
                    : "text-dc-text/55 hover:text-dc-text hover:bg-dc-text/5"
                }`}
              >
                Company
                <motion.i
                  className="ri-arrow-down-s-line text-sm"
                  animate={{ rotate: openDropdown === "company" ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                />
              </button>
              <AnimatePresence>
                {openDropdown === "company" && (
                  <DropdownMenu items={companyItems} onClose={() => setOpenDropdown(null)} />
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Cmd+K hint */}
            <motion.button
              onClick={() => {
                const ev = new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true });
                window.dispatchEvent(ev);
              }}
              className="hidden lg:flex items-center gap-2 border border-dc-text/12 text-dc-text/40 hover:text-dc-text/70 hover:border-dc-text/20 text-xs font-mono px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer whitespace-nowrap"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              title="Open command palette"
            >
              <i className="ri-search-line text-sm"></i>
              <span className="hidden xl:inline">Search</span>
              <div className="hidden xl:flex items-center gap-0.5">
                <kbd className="px-1.5 py-0.5 rounded bg-dc-text/8 text-[10px] border border-dc-text/10">⌘</kbd>
                <kbd className="px-1.5 py-0.5 rounded bg-dc-text/8 text-[10px] border border-dc-text/10">K</kbd>
              </div>
            </motion.button>

            <motion.button
              onClick={() => navigate("/contact")}
              className="hidden md:flex items-center gap-2 bg-accent text-black text-sm font-bold px-5 py-2.5 rounded-full whitespace-nowrap hover:bg-white transition-colors duration-300 cursor-pointer"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              Get Started
              <i className="ri-arrow-right-line text-base"></i>
            </motion.button>
            <button
              className="md:hidden w-10 h-10 flex items-center justify-center text-dc-text cursor-pointer"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <motion.i
                key={menuOpen ? "close" : "open"}
                className={`text-xl ${menuOpen ? "ri-close-line" : "ri-menu-3-line"}`}
                initial={{ rotate: -15, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Full-Screen Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-dc-bg flex flex-col pt-24 px-8 overflow-y-auto"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Home section links */}
            <div className="flex flex-col gap-1 mb-6">
              <p className="text-dc-text/30 text-xs font-mono tracking-widest mb-3">NAVIGATE</p>
              {homeLinks.map((link, i) => (
                <motion.button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="text-2xl font-bold text-dc-text hover:text-accent transition-colors cursor-pointer text-left py-2"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  {link.label}
                </motion.button>
              ))}
            </div>

            {/* Work group */}
            <div className="flex flex-col gap-1 mb-6">
              <p className="text-dc-text/30 text-xs font-mono tracking-widest mb-3">WORK</p>
              {workItems.map((item, i) => (
                <motion.button
                  key={item.path}
                  onClick={() => { setMenuOpen(false); navigate(item.path); }}
                  className="flex items-center gap-3 text-xl font-bold text-dc-text hover:text-accent transition-colors cursor-pointer text-left py-2"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (homeLinks.length + i) * 0.05 }}
                >
                  <i className={`${item.icon} text-accent/60 text-lg`}></i>
                  {item.label}
                </motion.button>
              ))}
            </div>

            {/* Company group */}
            <div className="flex flex-col gap-1 mb-6">
              <p className="text-dc-text/30 text-xs font-mono tracking-widest mb-3">COMPANY</p>
              {companyItems.map((item, i) => (
                <motion.button
                  key={item.path}
                  onClick={() => { setMenuOpen(false); navigate(item.path); }}
                  className="flex items-center gap-3 text-xl font-bold text-dc-text hover:text-accent transition-colors cursor-pointer text-left py-2"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (homeLinks.length + workItems.length + i) * 0.05 }}
                >
                  <i className={`${item.icon} text-accent/60 text-lg`}></i>
                  {item.label}
                </motion.button>
              ))}
            </div>



            <div className="mt-auto pb-12 pt-8">
              <button
                onClick={() => { navigate("/contact"); setMenuOpen(false); }}
                className="inline-flex items-center gap-2 bg-accent text-black font-bold px-8 py-4 rounded-full text-lg whitespace-nowrap cursor-pointer"
              >
                Get Started <i className="ri-arrow-right-line"></i>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>,
    document.body
  );
}