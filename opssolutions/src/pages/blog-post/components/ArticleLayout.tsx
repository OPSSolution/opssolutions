import { useState, useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import LiveDemoModal from "./LiveDemoModal";
import BlogMobileNav from "./BlogMobileNav";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import type { BlogPost, ContentBlock } from "../data";
import { getRelatedPosts } from "../data";
import AIArchitectureDiagram from "./AIArchitectureDiagram";
import MonolithTransformAnimation from "./MonolithTransformAnimation";
import BlogCardImage from "@/pages/blog/components/BlogCardImage";
import { use3DTilt } from "@/hooks/use3DTilt";

// Maps blog slug → postId (drives which BlogCardImage animation is used)
// With 7 effects: (postId-1) % 7 selects the effect index
const SLUG_TO_POST_ID: Record<string, number> = {
  "trading-platform-2m-daily":           1, // TradingAIEffect
  "scale-50k-concurrent-users":          7, // GPUClusterEffect
  "react-native-rebuild-cut-crashes-92": 3, // LiquidWaveEffect
  "ai-content-engine-langchain-gpt4":    4, // AINoiseEffect
  "zero-downtime-monolith-to-microservices": 5, // MatrixRainEffect
  "zero-to-app-store-90-days":           6, // ColorBloomEffect
  "fitness-app-ai-coaching-11-weeks":    3, // LiquidWaveEffect
};

interface Props {
  post: BlogPost;
}

// ──── Reading Progress Bar ────────────────────────────────────────────────────
function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] bg-accent origin-left z-[60]"
      style={{ scaleX }}
    />
  );
}

// ──── Block Renderer ──────────────────────────────────────────────────────────
function renderBlock(block: ContentBlock, idx: number) {
  switch (block.type) {
    case "heading":
      return (
        <h2
          key={idx}
          id={block.content.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
          className="text-white font-bold text-2xl md:text-3xl mt-12 mb-5 leading-snug scroll-mt-28"
        >
          {block.content}
        </h2>
      );
    case "text":
      return (
        <p key={idx} className="text-white/55 text-base leading-relaxed mb-6">
          {block.content}
        </p>
      );
    case "list":
      return (
        <ul key={idx} className="space-y-2.5 mb-6">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-3 text-white/55 text-base leading-relaxed">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      );
    case "code":
      return (
        <div key={idx} className="mb-6 rounded-xl overflow-hidden border border-white/8">
          <div className="flex items-center justify-between bg-[#1a1714] px-5 py-3 border-b border-white/5">
            <span className="text-white/30 text-xs font-mono">{block.language}</span>
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-white/10" />
              <div className="w-3 h-3 rounded-full bg-white/10" />
              <div className="w-3 h-3 rounded-full bg-white/10" />
            </div>
          </div>
          <pre className="bg-[#111009] p-5 overflow-x-auto text-sm leading-relaxed">
            <code className="text-accent/85 font-mono whitespace-pre">{block.content}</code>
          </pre>
        </div>
      );
    case "callout": {
      const variants = {
        info: { bg: "bg-accent/8", border: "border-accent/20", icon: "ri-information-line", iconColor: "text-accent", titleColor: "text-accent" },
        warning: { bg: "bg-amber-500/8", border: "border-amber-500/20", icon: "ri-alert-line", iconColor: "text-amber-400", titleColor: "text-amber-400" },
        success: { bg: "bg-accent/8", border: "border-accent/20", icon: "ri-checkbox-circle-line", iconColor: "text-accent", titleColor: "text-accent" },
        tip: { bg: "bg-violet-500/8", border: "border-violet-500/20", icon: "ri-lightbulb-flash-line", iconColor: "text-violet-400", titleColor: "text-violet-400" },
      };
      const v = variants[block.variant];
      return (
        <div key={idx} className={`${v.bg} ${v.border} border rounded-xl p-5 mb-6`}>
          <div className="flex gap-3 items-start">
            <div className={`w-5 h-5 flex items-center justify-center shrink-0 mt-0.5`}>
              <i className={`${v.icon} ${v.iconColor} text-base`} />
            </div>
            <div>
              <p className={`${v.titleColor} font-semibold text-sm mb-1`}>{block.title}</p>
              <p className="text-white/50 text-sm leading-relaxed">{block.content}</p>
            </div>
          </div>
        </div>
      );
    }
    default:
      return null;
  }
}

// ──── Sticky TOC Sidebar ───────────────────────────────────────────────────────
function TableOfContents({ post }: { post: BlogPost }) {
  const [active, setActive] = useState("");

  useEffect(() => {
    const headings = post.body
      .filter(b => b.type === "heading")
      .map(b => (b as { type: "heading"; content: string }).content.toLowerCase().replace(/[^a-z0-9]+/g, "-"));

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
      },
      { rootMargin: "-80px 0px -60% 0px" }
    );
    headings.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [post]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="sticky top-28">
      <p className="text-white/25 text-xs font-mono tracking-widest mb-4">TABLE OF CONTENTS</p>
      <nav className="flex flex-col gap-1">
        {post.toc.map(item => (
          <button
            key={item.id}
            onClick={() => scrollTo(item.id)}
            className={`text-left text-sm px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer whitespace-normal ${
              active === item.id
                ? "text-accent bg-accent/8 border-l-2 border-accent pl-3"
                : "text-white/35 hover:text-white/70 border-l-2 border-white/8 pl-3"
            }`}
          >
            {item.title}
          </button>
        ))}
      </nav>
    </div>
  );
}

// ──── Related Posts ───────────────────────────────────────────────────────────
function RelatedPosts({ slugs }: { slugs: string[] }) {
  const navigate = useNavigate();
  const related = getRelatedPosts(slugs);
  if (!related.length) return null;

  return (
    <section className="border-t border-white/5 pt-14 mt-14">
      <p className="text-white/25 text-xs font-mono tracking-widest mb-6">RELATED READING</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {related.map(rp => (
          <motion.article
            key={rp.slug}
            className="group bg-[#131009] border border-white/5 rounded-2xl overflow-hidden cursor-pointer hover:border-accent/25 transition-colors duration-300"
            whileHover={{ y: -3 }}
            onClick={() => { navigate(`/blog/${rp.slug}`); window.scrollTo({ top: 0, behavior: "instant" }); }}
          >
            <div className="w-full h-40 overflow-hidden">
              <BlogCardImage
              src={rp.image}
              alt={rp.title}
              postId={SLUG_TO_POST_ID[rp.slug] ?? 1}
              className="transition-transform duration-700 group-hover:scale-105"
            />
            </div>
            <div className="p-5">
              <span className="text-accent/70 text-xs font-mono bg-accent/8 px-2.5 py-1 rounded-full border border-accent/15">{rp.category}</span>
              <h3 className="text-white font-semibold text-sm leading-snug mt-3 mb-1 group-hover:text-accent transition-colors duration-300">{rp.title}</h3>
              <p className="text-white/30 text-xs">{rp.readTime} · {rp.date}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

// ──── Hero Image Stat Badge ───────────────────────────────────────────────────
interface HeroBadgeProps {
  posClass: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  label: string;
  value: string;
  valueColor?: string;
  borderClass?: string;
  glowStyle?: CSSProperties;
  delay: number;
  initX?: number;
  initY?: number;
  pulse?: boolean;
}

function HeroBadge({
  posClass, icon, iconBg, iconColor, label, value,
  valueColor = "text-white", borderClass = "border-white/15",
  glowStyle, delay, initX = 0, initY = 12, pulse = false,
}: HeroBadgeProps) {
  return (
    <motion.div
      className={`absolute ${posClass} z-10 flex items-center gap-2.5 bg-black/55 border ${borderClass} backdrop-blur-md rounded-2xl px-4 py-2.5`}
      initial={{ opacity: 0, x: initX, y: initY }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      style={glowStyle}
    >
      <div className={`relative w-8 h-8 flex items-center justify-center rounded-xl ${iconBg} shrink-0`}>
        {pulse && (
          <span className={`absolute inline-flex w-full h-full rounded-xl ${iconBg} animate-ping opacity-70`} />
        )}
        <i className={`${icon} ${iconColor} text-base relative`} />
      </div>
      <div>
        <p className="text-white/40 text-[10px] font-mono leading-none mb-0.5">{label}</p>
        <p className={`${valueColor} font-bold text-sm leading-none`}>{value}</p>
      </div>
    </motion.div>
  );
}

// ──── Share Buttons ───────────────────────────────────────────────────────────
function ShareButtons({ title }: { title: string }) {
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent(title);

  const links = [
    { icon: "ri-twitter-x-line", label: "X", href: `https://twitter.com/intent/tweet?url=${url}&text=${text}` },
    { icon: "ri-linkedin-box-line", label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${url}` },
  ];

  return (
    <div className="flex items-center gap-2 mt-6">
      <span className="text-white/25 text-xs mr-1">Share:</span>
      {links.map(l => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="nofollow noopener noreferrer"
          className="flex items-center gap-1.5 bg-white/5 border border-white/8 text-white/40 hover:text-white hover:border-white/20 text-xs px-3 py-1.5 rounded-full transition-colors duration-200"
        >
          <i className={`${l.icon} text-sm`} />
          {l.label}
        </a>
      ))}
    </div>
  );
}

// ──── Main Layout ─────────────────────────────────────────────────────────────
export default function ArticleLayout({ post }: Props) {
  const navigate = useNavigate();
  const bodyRef = useRef<HTMLDivElement>(null);
  const [showDemo, setShowDemo] = useState(false);
  const [readProgress, setReadProgress] = useState(0);

  // Hero image parallax tilt
  const heroTilt = use3DTilt({ maxRotateX: 3.5, maxRotateY: 5.5, stiffness: 160, damping: 26 });
  const imageX = useTransform(heroTilt.rotateY, [-5.5, 5.5], [14, -14]);
  const imageY = useTransform(heroTilt.rotateX, [-3.5, 3.5], [-9, 9]);
  const glareX = useTransform(heroTilt.rotateY, [-5.5, 5.5], ["15%", "85%"]);
  const glareY = useTransform(heroTilt.rotateX, [-3.5, 3.5], ["85%", "15%"]);

  // Reading progress for header time-remaining
  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setReadProgress(Math.min(1, scrollTop / Math.max(1, docH)));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [post.slug]);

  return (
    <div className="bg-[#080d1a] min-h-screen pb-20 md:pb-0">
      <ReadingProgress />

      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-[#080d1a]/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-20 flex items-center justify-between">
          <button
            onClick={() => navigate("/blog")}
            className="flex items-center gap-2 text-white/50 hover:text-white transition-colors duration-200 cursor-pointer whitespace-nowrap"
          >
            <i className="ri-arrow-left-line text-base" />
            <span className="text-sm font-medium hidden sm:block">All Articles</span>
            <span className="text-sm font-medium sm:hidden">Back</span>
          </button>
          {/* Reading time remaining — desktop only */}
          {readProgress > 0.02 && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden sm:flex items-center gap-1.5 pl-4 border-l border-white/8"
            >
              <i className="ri-time-line text-white/25 text-xs" />
              <span className="text-white/30 text-xs font-mono">
                {readProgress >= 0.98
                  ? "Done ✓"
                  : `${Math.max(1, Math.ceil(parseInt(post.readTime) * (1 - readProgress)))} min left`
                }
              </span>
              {/* Micro progress arc */}
              <div className="relative w-4 h-4 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16" style={{ transform: "rotate(-90deg)" }}>
                  <circle cx="8" cy="8" r="6" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
                  <circle
                    cx="8" cy="8" r="6"
                    fill="none"
                    stroke="rgba(41,171,226,0.7)"
                    strokeWidth="1.5"
                    strokeDasharray={`${2 * Math.PI * 6}`}
                    strokeDashoffset={`${2 * Math.PI * 6 * (1 - readProgress)}`}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 0.3s ease" }}
                  />
                </svg>
              </div>
            </motion.div>
          )}
          <a href="/" onClick={(e) => { e.preventDefault(); navigate("/"); }} className="flex items-center gap-2 cursor-pointer">
            <img
              src="https://static.readdy.ai/image/27f36426f3cab7c4efebb6eb9e24cb04/3338f66b55262222ff9be144548b1ced.png"
              alt="Solutions Studio"
              className="h-9 w-auto object-contain"
            />
            <span className="text-white font-bold text-lg hidden sm:block">
              Solutions<span className="text-accent">.</span>
            </span>
          </a>
          <button
            onClick={() => navigate("/#contact")}
            className="hidden sm:flex items-center gap-2 bg-accent text-black text-sm font-bold px-5 py-2.5 rounded-full whitespace-nowrap hover:bg-white transition-colors duration-300 cursor-pointer"
          >
            Start a Project
            <i className="ri-arrow-right-line" />
          </button>
        </div>
      </header>

      {/* Article Hero */}
      <section className="pt-32 pb-0">
        <motion.div
          className="max-w-7xl mx-auto px-6 md:px-10 pt-10 pb-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="bg-accent text-black text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">{post.category}</span>
              <span className="text-white/30 text-xs">{post.date}</span>
              <span className="text-white/15 text-xs">·</span>
              <span className="text-white/30 text-xs">{post.readTime}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-5">{post.title}</h1>
            <p className="text-white/40 text-lg leading-relaxed mb-8">{post.excerpt}</p>
            <div className="flex items-center gap-4 pb-8 border-b border-white/5">
              <div className="w-11 h-11 rounded-full bg-accent/15 flex items-center justify-center shrink-0">
                <i className="ri-user-line text-accent text-base" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{post.author}</p>
                <p className="text-white/35 text-xs">{post.authorRole}</p>
              </div>
              <div className="ml-auto flex flex-wrap gap-1.5">
                {post.tags.slice(0, 4).map(tag => (
                  <span key={tag} className="text-xs font-mono text-white/25 bg-white/5 px-2.5 py-1 rounded-lg border border-white/8">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Hero Image — animated BlogCardImage effect */}
        <motion.div
          className="max-w-7xl mx-auto px-6 md:px-10"
          initial={{ opacity: 0, scale: 0.96, y: 32 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
          style={{ perspective: 1400 }}
        >
          <motion.div
            ref={heroTilt.cardRef}
            className="relative w-full h-64 md:h-[440px] rounded-2xl overflow-hidden border border-white/5"
            style={{ rotateX: heroTilt.rotateX, rotateY: heroTilt.rotateY }}
            onMouseMove={heroTilt.handleMouseMove}
            onMouseLeave={heroTilt.handleMouseLeave}
          >
            {/* Inner image with counter-parallax shift */}
            <motion.div
              className="w-full h-full"
              style={{ x: imageX, y: imageY, scale: 1.07 }}
            >
              <BlogCardImage
                src={post.image}
                alt={post.title}
                postId={SLUG_TO_POST_ID[post.slug] ?? 1}
                className="w-full h-full"
              />
            </motion.div>

            {/* Glare highlight */}
            <motion.div
              className="absolute pointer-events-none z-20 w-[360px] h-[360px] rounded-full"
              style={{
                left: glareX,
                top: glareY,
                translateX: "-50%",
                translateY: "-50%",
                background: "radial-gradient(circle, rgba(255,255,255,1) 0%, transparent 65%)",
                opacity: 0.055,
              }}
            />

            {/* ── Per-article hero badges & CTAs ─────────────────────── */}

            {/* trading-platform-2m-daily */}
            {post.slug === "trading-platform-2m-daily" && (
              <>
                <HeroBadge
                  posClass="top-4 left-4"
                  icon="ri-line-chart-line" iconBg="bg-accent/20" iconColor="text-accent"
                  label="Daily Volume" value="$2M+"
                  delay={0.5} initX={-20} initY={-8}
                />
                <HeroBadge
                  posClass="top-4 right-4"
                  icon="ri-shield-check-line" iconBg="bg-[#29abe2]/15" iconColor="text-[#29abe2]"
                  label="Platform Uptime" value="99.99%"
                  valueColor="text-[#29abe2]" borderClass="border-[#29abe2]/20"
                  delay={0.7} initX={20} initY={-8}
                />
                <motion.div
                  className="absolute bottom-4 right-4 z-10"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
                >
                  <button
                    onClick={() => setShowDemo(true)}
                    className="relative flex items-center gap-2 bg-accent/20 border border-accent/45 text-accent text-sm font-bold px-4 py-2 rounded-full backdrop-blur-sm hover:bg-accent/32 hover:border-accent/70 transition-all cursor-pointer whitespace-nowrap"
                    style={{ boxShadow: "0 0 16px rgba(74,222,128,0.25)" }}
                  >
                    <span className="relative flex items-center justify-center w-2 h-2">
                      <span className="absolute inline-flex w-full h-full rounded-full bg-accent opacity-75 animate-ping" />
                      <span className="relative inline-flex w-2 h-2 rounded-full bg-accent" />
                    </span>
                    Launch Live Demo
                  </button>
                </motion.div>
              </>
            )}

            {/* scale-50k-concurrent-users — AI Infrastructure */}
            {post.slug === "scale-50k-concurrent-users" && (
              <>
                <HeroBadge
                  posClass="top-4 left-4"
                  icon="ri-timer-flash-line" iconBg="bg-amber-500/20" iconColor="text-amber-400"
                  label="Inference Latency" value="780ms → 48ms"
                  delay={0.5} initX={-20} initY={-8}
                />
                <HeroBadge
                  posClass="bottom-4 left-4"
                  icon="ri-money-dollar-circle-line" iconBg="bg-accent/20" iconColor="text-accent"
                  label="Annual GPU Saving" value="$2.3M / yr"
                  delay={0.7} initX={-20}
                />
                <HeroBadge
                  posClass="bottom-4 right-4"
                  icon="ri-cpu-line" iconBg="bg-[#29abe2]/20" iconColor="text-[#29abe2]"
                  label="GPU Utilization" value="23% → 71%"
                  valueColor="text-[#29abe2]" borderClass="border-[#29abe2]/25"
                  glowStyle={{ boxShadow: "0 0 20px rgba(41,171,226,0.12)" }}
                  delay={0.9} initX={20} pulse
                />
              </>
            )}

            {/* react-native-rebuild-cut-crashes-92 */}
            {post.slug === "react-native-rebuild-cut-crashes-92" && (
              <>
                <HeroBadge
                  posClass="top-4 left-4"
                  icon="ri-bug-line" iconBg="bg-rose-500/20" iconColor="text-rose-400"
                  label="Crash Rate" value="15% → 0.2%"
                  delay={0.5} initX={-20} initY={-8}
                />
                <HeroBadge
                  posClass="bottom-4 left-4"
                  icon="ri-star-fill" iconBg="bg-amber-500/20" iconColor="text-amber-400"
                  label="App Store Rating" value="2.8 → 4.9 ★"
                  delay={0.7} initX={-20}
                />
                <HeroBadge
                  posClass="bottom-4 right-4"
                  icon="ri-shield-check-line" iconBg="bg-[#29abe2]/20" iconColor="text-[#29abe2]"
                  label="Crash Reduction" value="−92%"
                  valueColor="text-[#29abe2]" borderClass="border-[#29abe2]/25"
                  glowStyle={{ boxShadow: "0 0 20px rgba(41,171,226,0.12)" }}
                  delay={0.9} initX={20} pulse
                />
              </>
            )}

            {/* ai-content-engine-langchain-gpt4 */}
            {post.slug === "ai-content-engine-langchain-gpt4" && (
              <>
                <HeroBadge
                  posClass="top-4 left-4"
                  icon="ri-translate-2" iconBg="bg-violet-500/20" iconColor="text-violet-400"
                  label="Markets Served" value="14 Languages"
                  delay={0.5} initX={-20} initY={-8}
                />
                <HeroBadge
                  posClass="bottom-4 left-4"
                  icon="ri-article-line" iconBg="bg-sky-500/20" iconColor="text-sky-400"
                  label="Monthly Output" value="10K+ Pieces"
                  delay={0.7} initX={-20}
                />
                <HeroBadge
                  posClass="bottom-4 right-4"
                  icon="ri-check-double-line" iconBg="bg-[#29abe2]/20" iconColor="text-[#29abe2]"
                  label="Brand Accuracy" value="96.3%"
                  valueColor="text-[#29abe2]" borderClass="border-[#29abe2]/25"
                  glowStyle={{ boxShadow: "0 0 20px rgba(41,171,226,0.12)" }}
                  delay={0.9} initX={20} pulse
                />
              </>
            )}

            {/* zero-downtime-monolith-to-microservices */}
            {post.slug === "zero-downtime-monolith-to-microservices" && (
              <>
                <HeroBadge
                  posClass="top-4 left-4"
                  icon="ri-time-line" iconBg="bg-accent/20" iconColor="text-accent"
                  label="Migration Downtime" value="0 Seconds"
                  delay={0.5} initX={-20} initY={-8}
                />
                <HeroBadge
                  posClass="bottom-4 left-4"
                  icon="ri-git-branch-line" iconBg="bg-sky-500/20" iconColor="text-sky-400"
                  label="Deploys / Day" value="12× Faster"
                  delay={0.7} initX={-20}
                />
                <HeroBadge
                  posClass="bottom-4 right-4"
                  icon="ri-alarm-warning-line" iconBg="bg-[#29abe2]/20" iconColor="text-[#29abe2]"
                  label="Fewer Incidents" value="−78%"
                  valueColor="text-[#29abe2]" borderClass="border-[#29abe2]/25"
                  glowStyle={{ boxShadow: "0 0 20px rgba(41,171,226,0.12)" }}
                  delay={0.9} initX={20} pulse
                />
              </>
            )}

            {/* zero-to-app-store-90-days */}
            {post.slug === "zero-to-app-store-90-days" && (
              <>
                <HeroBadge
                  posClass="top-4 left-4"
                  icon="ri-apple-line" iconBg="bg-[#29abe2]/15" iconColor="text-[#29abe2]"
                  label="App Store" value="Top 42 Health"
                  delay={0.5} initX={-20} initY={-8}
                />
                <HeroBadge
                  posClass="bottom-4 left-4"
                  icon="ri-user-smile-line" iconBg="bg-sky-400/20" iconColor="text-sky-400"
                  label="Month 1 Users" value="12,000+"
                  delay={0.7} initX={-20}
                />
                <HeroBadge
                  posClass="bottom-4 right-4"
                  icon="ri-rocket-2-line" iconBg="bg-[#29abe2]/20" iconColor="text-[#29abe2]"
                  label="Shipped In" value="87 Days"
                  valueColor="text-[#29abe2]" borderClass="border-[#29abe2]/25"
                  glowStyle={{ boxShadow: "0 0 20px rgba(41,171,226,0.12)" }}
                  delay={0.9} initX={20} pulse
                />
              </>
            )}

            {/* fitness-app-ai-coaching-11-weeks */}
            {post.slug === "fitness-app-ai-coaching-11-weeks" && (
              <>
                <HeroBadge
                  posClass="top-4 left-4"
                  icon="ri-star-fill" iconBg="bg-amber-500/20" iconColor="text-amber-400"
                  label="App Store Rating" value="4.8 ★ Stars"
                  delay={0.5} initX={-20} initY={-8}
                />
                <HeroBadge
                  posClass="bottom-4 left-4"
                  icon="ri-flashlight-line" iconBg="bg-sky-500/20" iconColor="text-sky-400"
                  label="On-Device ML" value="33ms Live"
                  delay={0.7} initX={-20}
                />
                <HeroBadge
                  posClass="bottom-4 right-4"
                  icon="ri-funds-line" iconBg="bg-[#29abe2]/20" iconColor="text-[#29abe2]"
                  label="Series A Raised" value="$4M Closed"
                  valueColor="text-[#29abe2]" borderClass="border-[#29abe2]/25"
                  glowStyle={{ boxShadow: "0 0 20px rgba(41,171,226,0.12)" }}
                  delay={0.9} initX={20} pulse
                />
              </>
            )}
          </motion.div>
        </motion.div>

        {/* AI Architecture Diagram — only for the AI infra article */}
        {post.slug === "scale-50k-concurrent-users" && (
          <motion.div
            className="max-w-7xl mx-auto px-6 md:px-10 mt-8"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-white/25 text-xs font-mono tracking-widest">INTERACTIVE ARCHITECTURE MAP</span>
              <div className="h-px flex-1 bg-white/5" />
            </div>
            <AIArchitectureDiagram />
          </motion.div>
        )}

        {/* Monolith → Microservices Transformer Animation */}
        {post.slug === "zero-downtime-monolith-to-microservices" && (
          <motion.div
            className="max-w-7xl mx-auto px-6 md:px-10 mt-8"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-white/25 text-xs font-mono tracking-widest">LIVE ARCHITECTURE TRANSFORMATION</span>
              <div className="h-px flex-1 bg-white/5" />
            </div>
            <MonolithTransformAnimation />
          </motion.div>
        )}
      </section>

      {/* Article Body + Sidebar */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12 lg:gap-16 items-start">
          {/* Main article body */}
          <motion.div
            ref={bodyRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="min-w-0"
          >
            {post.body.map((block, idx) => renderBlock(block, idx))}

            {/* Author Bio */}
            <div className="mt-14 pt-10 border-t border-white/5">
              <div className="flex gap-5 items-start bg-[#131009] border border-white/5 rounded-2xl p-6">
                <div className="w-14 h-14 rounded-full bg-accent/15 flex items-center justify-center shrink-0">
                  <i className="ri-user-line text-accent text-xl" />
                </div>
                <div>
                  <p className="text-white font-bold text-base mb-0.5">{post.author}</p>
                  <p className="text-accent text-xs font-mono mb-3">{post.authorRole}</p>
                  <p className="text-white/40 text-sm leading-relaxed">{post.authorBio}</p>
                </div>
              </div>
              <ShareButtons title={post.title} />
            </div>

            {/* Related posts */}
            <RelatedPosts slugs={post.relatedSlugs} />
          </motion.div>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <TableOfContents post={post} />

            {/* CTA Card */}
            <div className="mt-8 bg-accent/8 border border-accent/20 rounded-2xl p-6 text-center">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-accent/15 mx-auto mb-3">
                <i className="ri-rocket-line text-accent text-base" />
              </div>
              <p className="text-white font-semibold text-sm mb-2">Build something great?</p>
              <p className="text-white/35 text-xs mb-4 leading-relaxed">Let&apos;s talk about what we can ship for you.</p>
              <button
                onClick={() => navigate("/#contact")}
                className="w-full flex items-center justify-center gap-2 bg-accent text-black font-bold py-3 rounded-xl hover:bg-white transition-colors duration-300 cursor-pointer whitespace-nowrap text-sm"
              >
                Start Your Project
                <i className="ri-arrow-right-line" />
              </button>
            </div>

            {/* Tags */}
            <div className="mt-6">
              <p className="text-white/25 text-xs font-mono tracking-widest mb-3">TAGS</p>
              <div className="flex flex-wrap gap-2">
                {post.tags.map(tag => (
                  <span key={tag} className="text-xs font-mono text-white/40 bg-white/5 border border-white/8 px-3 py-1.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Mobile sticky nav — hidden on desktop */}
      <BlogMobileNav post={post} />

      {/* Live Demo Modal — trading article */}
      <LiveDemoModal isOpen={showDemo} onClose={() => setShowDemo(false)} />
    </div>
  );
}