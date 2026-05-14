import { useState, useRef, useCallback } from "react";
import BlogCardImage from "./components/BlogCardImage";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const categories = ["All", "Web Dev", "Mobile", "Cloud", "AI/ML", "DevOps"];

const posts = [
  {
    id: 1, slug: "trading-platform-2m-daily", category: "Web Dev",
    title: "How We Built a Real-Time Trading Platform Processing $2M Daily",
    excerpt: "Deep dive into the architecture decisions, database design, and WebSocket infrastructure behind a high-frequency fintech platform — and how we hit 99.99% uptime from day one.",
    author: "Yuki Tanaka", authorRole: "Principal Engineer", date: "May 8, 2026",
    readTime: "12 min read", wordCount: 2400,
    tags: ["React", "WebSocket", "PostgreSQL", "Redis"],
    image: "https://readdy.ai/api/search-image?query=dark%20cinematic%20financial%20trading%20platform%20UI%20on%20multiple%20monitors%20with%20real-time%20data%20charts%2C%20neon%20green%20accent%20lines%2C%20professional%20tech%20workspace%2C%20dramatic%20studio%20lighting%2C%20modern%20fintech%20dashboard&width=800&height=480&seq=blog_01&orientation=landscape",
    featured: true,
  },
  {
    id: 2, slug: "scale-50k-concurrent-users", category: "Cloud",
    title: "Scaling to 50,000 Concurrent Users: Our Infrastructure Breakdown",
    excerpt: "A step-by-step breakdown of how we architected a multi-region AWS setup with auto-scaling, CDN edge caching, and zero-downtime deployments for a retail giant's Black Friday launch.",
    author: "Anya Volkov", authorRole: "Cloud Infrastructure Lead", date: "Apr 24, 2026",
    readTime: "10 min read", wordCount: 2000,
    tags: ["AWS", "Kubernetes", "Terraform", "CDN"],
    image: "https://readdy.ai/api/search-image?query=server%20infrastructure%20data%20center%20with%20glowing%20rack%20servers%2C%20blue%20and%20green%20LED%20lights%2C%20dark%20environment%2C%20cloud%20computing%20architecture%20diagram%20overlay%2C%20professional%20tech%20photography&width=800&height=480&seq=blog_02&orientation=landscape",
    featured: false,
  },
  {
    id: 3, slug: "react-native-rebuild-cut-crashes-92", category: "Mobile",
    title: "The React Native Rebuild That Cut App Crashes by 92%",
    excerpt: "When MediSynth came to us with a healthcare app crashing on 15% of sessions, we rebuilt it from scratch in 10 weeks. Here is every decision we made and why.",
    author: "Kai Nakamura", authorRole: "Mobile Engineering Lead", date: "Apr 11, 2026",
    readTime: "9 min read", wordCount: 1800,
    tags: ["React Native", "TypeScript", "Firebase", "Sentry"],
    image: "https://readdy.ai/api/search-image?query=mobile%20app%20development%20on%20smartphone%20mockup%2C%20healthcare%20application%20dark%20theme%20interface%2C%20code%20editor%20on%20dual%20monitor%20setup%20in%20background%2C%20professional%20developer%20workspace%2C%20warm%20ambient%20lighting&width=800&height=480&seq=blog_03&orientation=landscape",
    featured: false,
  },
  {
    id: 4, slug: "ai-content-engine-langchain-gpt4", category: "AI/ML",
    title: "Building an AI Content Engine with LangChain and GPT-4",
    excerpt: "We built an AI platform that generates 10,000+ pieces of branded content per month across 14 languages. Here is the full architecture — RAG pipelines, fine-tuning, and prompt engineering strategies.",
    author: "Dr. Nadia Hassan", authorRole: "AI/ML Lead", date: "Mar 28, 2026",
    readTime: "15 min read", wordCount: 3000,
    tags: ["LangChain", "OpenAI", "Python", "FastAPI"],
    image: "https://readdy.ai/api/search-image?query=artificial%20intelligence%20neural%20network%20visualization%2C%20glowing%20green%20nodes%20and%20connections%20on%20dark%20background%2C%20machine%20learning%20concept%20art%2C%20futuristic%20AI%20technology%20interface%2C%20cinematic%20lighting%2C%20abstract%20digital%20art&width=800&height=480&seq=blog_04&orientation=landscape",
    featured: false,
  },
  {
    id: 5, slug: "zero-downtime-monolith-to-microservices", category: "DevOps",
    title: "Zero-Downtime Migration: Monolith to Microservices in Production",
    excerpt: "We migrated a 6-year-old Rails monolith to a containerized microservices architecture without a single second of downtime. The strangler fig pattern, service mesh setup, and lessons learned.",
    author: "Anya Volkov", authorRole: "Cloud Infrastructure Lead", date: "Mar 15, 2026",
    readTime: "11 min read", wordCount: 2200,
    tags: ["Docker", "Kubernetes", "GitHub Actions", "Datadog"],
    image: "https://readdy.ai/api/search-image?query=containerization%20microservices%20architecture%20diagram%20visualization%2C%20dark%20background%20with%20interconnected%20service%20nodes%20and%20network%20topology%2C%20DevOps%20infrastructure%20concept%2C%20professional%20tech%20illustration%20with%20green%20circuit%20lines&width=800&height=480&seq=blog_05&orientation=landscape",
    featured: false,
  },
  {
    id: 10, slug: "fitness-app-ai-coaching-11-weeks", category: "Mobile",
    title: "11 Weeks to App Store: Building an AI Fitness Coach with React Native",
    excerpt: "How we designed, built, and shipped a real-time AI fitness coaching app with wearable device sync, on-device ML workout generation, and a zero-crash launch — straight into the top 50 Health charts.",
    author: "Kai Nakamura", authorRole: "Mobile Engineering Lead", date: "Jun 2, 2026",
    readTime: "11 min read", wordCount: 2200,
    tags: ["React Native", "TensorFlow Lite", "HealthKit", "Reanimated 3"],
    image: "https://readdy.ai/api/search-image?query=sleek%20AI%20fitness%20coaching%20app%20on%20iPhone%2015%20Pro%20mockup%2C%20dark%20premium%20mobile%20UI%20with%20real-time%20biometric%20dashboard%20and%20animated%20heart%20rate%20waveform%2C%20vibrant%20emerald%20health%20metrics%20overlaid%20on%20a%20deep%20black%20background%2C%20wearable%20smartwatch%20sync%20visualization%2C%20professional%20product%20photography%20studio%20setup%2C%20premium%20mobile%20UI%20design%2C%20cinematic%20lighting&width=800&height=480&seq=blog_10_fitness&orientation=landscape",
    featured: false,
  },
  {
    id: 6, slug: "zero-to-app-store-90-days", category: "Mobile",
    title: "From 0 to App Store in 90 Days: Our Mobile Playbook",
    excerpt: "How we help early-stage startups ship their first mobile app in 90 days without cutting corners on quality. Sprint structure, tooling choices, and the decisions that actually matter.",
    author: "Kai Nakamura", authorRole: "Mobile Engineering Lead", date: "Feb 28, 2026",
    readTime: "8 min read", wordCount: 1600,
    tags: ["Flutter", "Dart", "CI/CD", "TestFlight"],
    image: "https://readdy.ai/api/search-image?query=mobile%20app%20launch%20on%20smartphone%20screens%2C%20iOS%20and%20Android%20mockups%20on%20dark%20background%2C%20startup%20product%20development%20workspace%2C%20professional%20product%20photography%20with%20ambient%20glow%2C%20modern%20mobile%20UI%20showcase&width=800&height=480&seq=blog_06&orientation=landscape",
    featured: false,
  },
];

// ──────────────────────────────────────────────────────────────────────────────

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("dc_reading_list") || "[]"); } catch { return []; }
  });
  const [saveFlash, setSaveFlash] = useState<string | null>(null);
  const [exitingSlug, setExitingSlug] = useState<string | null>(null);
  const navigate = useNavigate();

  // Staggered card exit then navigate
  const handleCardClick = useCallback((slug: string) => {
    if (exitingSlug) return;
    setExitingSlug(slug);
    setTimeout(() => navigate(`/blog/${slug}`), 320);
  }, [exitingSlug, navigate]);

  const toggleBookmark = useCallback((slug: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarks(prev => {
      const next = prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug];
      localStorage.setItem("dc_reading_list", JSON.stringify(next));
      return next;
    });
    setSaveFlash(slug);
    setTimeout(() => setSaveFlash(null), 1200);
  }, []);

  // Combined filter: search + category + saved-only
  const filtered = posts.filter(p => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || (
      p.title.toLowerCase().includes(q) ||
      p.excerpt.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q)) ||
      p.author.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    const matchesSaved = !showSavedOnly || bookmarks.includes(p.slug);
    return matchesSearch && matchesCategory && matchesSaved;
  });

  const featured = posts.find(p => p.featured);
  const showFeatured = activeCategory === "All" && !searchQuery && !showSavedOnly && !!featured;
  const rest = showFeatured ? filtered.filter(p => !p.featured) : filtered;

  return (
    <div className="bg-[#0b0a08] min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-[#0b0a08]/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-20 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-white/50 hover:text-white transition-colors duration-200 cursor-pointer whitespace-nowrap">
            <i className="ri-arrow-left-line text-base" />
            <span className="text-sm font-medium">Back to Home</span>
          </button>
          <a href="/" className="flex items-center gap-2 cursor-pointer">
            <img src="https://static.readdy.ai/image/27f36426f3cab7c4efebb6eb9e24cb04/3338f66b55262222ff9be144548b1ced.png" alt="Solutions Studio" className="h-9 w-auto object-contain" />
            <span className="text-white font-bold text-lg hidden sm:block">Solutions<span className="text-accent">.</span></span>
          </a>
          <button onClick={() => navigate("/#contact")} className="hidden sm:flex items-center gap-2 bg-accent text-black text-sm font-bold px-5 py-2.5 rounded-full whitespace-nowrap hover:bg-white transition-colors duration-300 cursor-pointer">
            Start a Project <i className="ri-arrow-right-line" />
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-36 pb-10 px-6 md:px-10 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <p className="text-accent text-sm font-mono tracking-widest mb-4">INSIGHTS &amp; CASE STUDIES</p>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-3">
                The <span className="text-accent">Solutions</span> Blog
              </h1>
              <p className="text-white/40 text-lg max-w-xl">
                Real engineering decisions, architecture breakdowns, and lessons learned from building software for the world&apos;s most ambitious teams.
              </p>
            </div>
            {/* Reading List Badge */}
            <button
              onClick={() => { setShowSavedOnly(v => !v); setActiveCategory("All"); }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm font-medium transition-all duration-300 whitespace-nowrap cursor-pointer shrink-0 ${
                showSavedOnly
                  ? "bg-accent text-black border-accent"
                  : "bg-white/5 border-white/10 text-white/50 hover:text-white hover:border-white/20"
              }`}
            >
              <i className={`${showSavedOnly ? "ri-bookmark-fill" : "ri-bookmark-line"} text-sm`} />
              Reading List
              {bookmarks.length > 0 && (
                <span className={`text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full ${showSavedOnly ? "bg-black/20" : "bg-accent/20 text-accent"}`}>
                  {bookmarks.length}
                </span>
              )}
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-white/30">
              <i className="ri-search-line text-base" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by title, technology, author, or topic..."
              className="w-full bg-white/5 border border-white/10 focus:border-accent/40 text-white text-sm placeholder:text-white/25 rounded-xl pl-11 pr-11 py-4 outline-none transition-colors duration-300"
            />
            <AnimatePresence>
              {searchQuery && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-white/30 hover:text-white transition-colors cursor-pointer"
                >
                  <i className="ri-close-line text-base" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Search results count */}
          <AnimatePresence>
            {(searchQuery || showSavedOnly) && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-white/30 text-sm mt-3"
              >
                {showSavedOnly
                  ? `${filtered.length} saved article${filtered.length !== 1 ? "s" : ""}`
                  : `${filtered.length} result${filtered.length !== 1 ? "s" : ""} for "${searchQuery}"`}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* Featured Post */}
      {showFeatured && featured && (
        <section className="px-6 md:px-10 max-w-7xl mx-auto mb-12">
          <motion.article
            className="group relative bg-[#131009] border border-white/5 rounded-2xl overflow-hidden hover:border-accent/20 transition-colors duration-300 cursor-pointer grid grid-cols-1 lg:grid-cols-2"
            initial={{ opacity: 0, y: 30 }}
            animate={exitingSlug
              ? exitingSlug === featured.slug
                ? { opacity: 0, scale: 1.03, y: -8, transition: { duration: 0.28, ease: [0.76, 0, 0.24, 1] } }
                : { opacity: 0, scale: 0.95, y: -6, transition: { duration: 0.25, delay: 0.04, ease: [0.76, 0, 0.24, 1] } }
              : { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, delay: 0.1 } }}
            whileHover={exitingSlug ? {} : { y: -3 }}
            onClick={() => handleCardClick(featured.slug)}
          >
            <div className="relative w-full h-64 lg:h-auto overflow-hidden">
              <BlogCardImage src={featured.image} alt={featured.title} postId={featured.id} className="transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#131009] hidden lg:block" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#131009] to-transparent lg:hidden" />
              <span className="absolute top-5 left-5 bg-accent text-black text-xs font-bold px-3 py-1 rounded-full">Featured</span>
              {/* Bookmark button on featured */}
              <button
                onClick={(e) => toggleBookmark(featured.slug, e)}
                className={`absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full border transition-all duration-200 cursor-pointer ${
                  bookmarks.includes(featured.slug)
                    ? "bg-accent border-accent text-black"
                    : "bg-black/40 border-white/20 text-white/60 hover:text-white hover:border-white/40"
                }`}
              >
                <i className={`${bookmarks.includes(featured.slug) ? "ri-bookmark-fill" : "ri-bookmark-line"} text-sm`} />
              </button>
            </div>
            <div className="p-8 md:p-10 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-accent/70 text-xs font-mono bg-accent/10 px-3 py-1 rounded-full border border-accent/15">{featured.category}</span>
                <span className="text-white/25 text-xs">{featured.readTime}</span>
                <span className="text-white/15 text-xs">·</span>
                <span className="text-white/25 text-xs">{featured.wordCount.toLocaleString()} words</span>
              </div>
              <h2 className="text-white font-bold text-2xl md:text-3xl leading-snug mb-4 group-hover:text-accent transition-colors duration-300">{featured.title}</h2>
              <p className="text-white/40 text-sm leading-relaxed mb-6">{featured.excerpt}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {featured.tags.map(tag => (
                  <span key={tag} className="text-xs font-mono text-white/25 bg-white/5 px-2.5 py-1 rounded-md">{tag}</span>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white text-sm font-medium">{featured.author}</p>
                  <p className="text-white/30 text-xs">{featured.date}</p>
                </div>
                <span className="flex items-center gap-1.5 text-accent text-sm font-medium">
                  Read Article <i className="ri-arrow-right-line group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          </motion.article>
        </section>
      )}

      {/* Filters */}
      {!showSavedOnly && (
        <section className="px-6 md:px-10 max-w-7xl mx-auto mb-10">
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap cursor-pointer ${
                  activeCategory === cat
                    ? "bg-accent text-black"
                    : "bg-white/5 text-white/50 border border-white/10 hover:text-white hover:border-white/20"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Posts Grid */}
      <section className="px-6 md:px-10 max-w-7xl mx-auto pb-24">
        {rest.length === 0 ? (
          <motion.div className="text-center py-24" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="w-14 h-14 flex items-center justify-center bg-white/5 rounded-full mx-auto mb-4">
              <i className={`${showSavedOnly ? "ri-bookmark-line" : "ri-search-line"} text-white/25 text-xl`} />
            </div>
            <p className="text-white/30 text-base">
              {showSavedOnly ? "No saved articles yet. Bookmark articles to save them here." : `No articles found for "${searchQuery}"`}
            </p>
            {showSavedOnly ? (
              <button onClick={() => setShowSavedOnly(false)} className="mt-4 text-accent text-sm hover:underline cursor-pointer">Browse all articles</button>
            ) : (
              <button onClick={() => setSearchQuery("")} className="mt-4 text-accent text-sm hover:underline cursor-pointer">Clear search</button>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {rest.map((post, i) => (
              <motion.article
                key={post.id}
                className="group bg-[#131009] border border-white/5 rounded-2xl overflow-hidden hover:border-accent/20 transition-colors duration-300 cursor-pointer flex flex-col"
                initial={{ opacity: 0, y: 30 }}
                animate={exitingSlug
                  ? exitingSlug === post.slug
                    ? { opacity: 0, scale: 1.04, y: -10, transition: { duration: 0.28, ease: [0.76, 0, 0.24, 1] } }
                    : { opacity: 0, scale: 0.93, y: -6, transition: { duration: 0.22, delay: 0.03 + i * 0.025, ease: "easeIn" } }
                  : { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, delay: i * 0.06 } }}
                whileHover={exitingSlug ? {} : { y: -4 }}
                onClick={() => handleCardClick(post.slug)}
              >
                <div className="relative w-full h-48 overflow-hidden">
                  <BlogCardImage src={post.image} alt={post.title} postId={post.id} className="transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#131009] to-transparent" />
                  <span className="absolute top-4 left-4 bg-white/10 text-white/60 text-xs font-mono px-3 py-1 rounded-full border border-white/10">{post.category}</span>
                  {/* Bookmark btn */}
                  <button
                    onClick={(e) => toggleBookmark(post.slug, e)}
                    className={`absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full border transition-all duration-200 cursor-pointer ${
                      bookmarks.includes(post.slug)
                        ? "bg-accent border-accent text-black"
                        : "bg-black/40 border-white/15 text-white/50 hover:text-white hover:border-white/40"
                    }`}
                  >
                    <AnimatePresence mode="wait">
                      <motion.i
                        key={bookmarks.includes(post.slug) ? "fill" : "line"}
                        className={`${bookmarks.includes(post.slug) ? "ri-bookmark-fill" : "ri-bookmark-line"} text-sm`}
                        initial={{ scale: 0.7 }}
                        animate={{ scale: saveFlash === post.slug ? [1, 1.3, 1] : 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    </AnimatePresence>
                  </button>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-white/25 text-xs mb-3">
                    <span>{post.date}</span>
                    <span>·</span>
                    <span>{post.readTime}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <i className="ri-file-text-line text-[10px]" />{post.wordCount.toLocaleString()} words
                    </span>
                  </div>

                  <h3 className="text-white font-bold text-base leading-snug mb-3 group-hover:text-accent transition-colors duration-300 flex-1">{post.title}</h3>
                  <p className="text-white/35 text-xs leading-relaxed mb-4">{post.excerpt}</p>

                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {post.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="text-xs font-mono text-white/25 bg-white/5 px-2 py-0.5 rounded-md">{tag}</span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                    <div>
                      <p className="text-white/60 text-xs font-medium">{post.author}</p>
                      <p className="text-white/25 text-xs">{post.authorRole}</p>
                    </div>
                    <span className="flex items-center gap-1 text-accent/60 text-xs group-hover:text-accent transition-colors duration-300 whitespace-nowrap">
                      Read Article <i className="ri-arrow-right-line" />
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </section>

      {/* Newsletter CTA */}
      {!showSavedOnly && (
        <section className="px-6 md:px-10 max-w-7xl mx-auto pb-24">
          <NewsletterSection />
        </section>
      )}
    </div>
  );
}

// ──── Newsletter ──────────────────────────────────────────────────────────────
function NewsletterSection() {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    try {
      const body = new URLSearchParams();
      body.append("email", email.trim());
      const res = await fetch("https://readdy.ai/api/form/d82a2it2rv787lut0qkg", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });
      if (res.ok) { setStatus("success"); setEmail(""); formRef.current?.reset(); }
      else setStatus("error");
    } catch { setStatus("error"); }
  };

  return (
    <motion.div className="bg-[#161310] border border-accent/15 rounded-2xl p-10 md:p-14"
      initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.7 }}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div>
          <p className="text-accent text-xs font-mono tracking-widest mb-3">STAY SHARP</p>
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">
            Engineering insights,<br /><span className="text-accent">straight to your inbox.</span>
          </h3>
          <p className="text-white/35 text-sm leading-relaxed max-w-sm">No fluff. No spam. Deep-dive architecture breakdowns, performance tips, and exclusive case studies — delivered monthly.</p>
          <div className="flex flex-col gap-2.5 mt-6">
            {["Architecture deep-dives", "Performance tips", "Exclusive case studies", "Tool recommendations"].map(item => (
              <div key={item} className="flex items-center gap-2 text-white/40 text-xs">
                <i className="ri-check-line text-accent text-xs" />{item}
              </div>
            ))}
          </div>
        </div>
        <div>
          {status === "success" ? (
            <motion.div className="bg-accent/10 border border-accent/20 rounded-xl p-8 text-center" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="w-14 h-14 flex items-center justify-center bg-accent/20 rounded-full mx-auto mb-4">
                <i className="ri-check-line text-accent text-2xl" />
              </div>
              <h4 className="text-white font-bold text-lg mb-1">You&apos;re in!</h4>
              <p className="text-white/40 text-sm">Thanks for subscribing. Expect your first insight shortly.</p>
            </motion.div>
          ) : (
            <form ref={formRef} data-readdy-form id="newsletter-blog" onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-white/40 text-xs font-mono mb-2 block tracking-wide">YOUR EMAIL</label>
                <input type="email" name="email" required value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full bg-white/5 border border-white/10 focus:border-accent/40 text-white text-sm placeholder:text-white/20 rounded-xl px-5 py-4 outline-none transition-colors duration-300" />
              </div>
              <button type="submit" disabled={status === "loading"}
                className="w-full flex items-center justify-center gap-2 bg-accent text-black font-bold px-8 py-4 rounded-xl hover:bg-white transition-colors duration-300 cursor-pointer whitespace-nowrap disabled:opacity-60">
                {status === "loading" ? <><i className="ri-loader-4-line animate-spin" />Subscribing...</> : <>Subscribe Free<i className="ri-arrow-right-line text-base" /></>}
              </button>
              {status === "error" && <p className="text-red-400/80 text-xs text-center">Something went wrong. Please try again.</p>}
              <p className="text-white/20 text-xs text-center">Join 2,400+ engineers. Unsubscribe anytime.</p>
            </form>
          )}
        </div>
      </div>
    </motion.div>
  );
}