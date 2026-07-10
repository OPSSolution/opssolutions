import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { services } from "@/pages/services/data";
import { usePageMeta } from "@/hooks/usePageMeta";
import FloatingBookCTA from "@/pages/home/components/FloatingBookCTA";

interface CaseStudyItem {
  title: string;
  result: string;
  tags: string[];
  image: string;
  slug: string;
  serviceTitle: string;
  serviceSlug: string;
  serviceIcon: string;
}

function buildCaseStudies(): CaseStudyItem[] {
  const seen = new Set<string>();
  const items: CaseStudyItem[] = [];
  for (const svc of services) {
    for (const cs of svc.caseStudies) {
      const key = cs.slug + ":" + svc.slug;
      if (seen.has(key)) continue;
      seen.add(key);
      items.push({
        ...cs,
        serviceTitle: svc.title,
        serviceSlug: svc.slug,
        serviceIcon: svc.icon,
      });
    }
  }
  return items;
}

const ALL_CASES = buildCaseStudies();

const SERVICE_FILTERS = [
  { label: "All Services", value: "" },
  { label: "Web Development", value: "web-development" },
  { label: "Mobile Development", value: "mobile-development" },
  { label: "Cloud Architecture", value: "cloud-architecture" },
  { label: "UI/UX Design", value: "ui-ux-design" },
  { label: "AI & ML", value: "ai-ml-integration" },
  { label: "DevOps & CI/CD", value: "devops-cicd" },
];

const INDUSTRY_FILTERS = [
  { label: "All Industries", value: "" },
  { label: "Fintech", value: "Fintech" },
  { label: "Healthcare", value: "Healthcare" },
  { label: "E-Commerce", value: "E-Commerce" },
  { label: "SaaS", value: "SaaS" },
  { label: "Logistics", value: "Logistics" },
  { label: "Enterprise", value: "Enterprise" },
  { label: "AI / ML", value: "AI" },
  { label: "Media", value: "Media" },
];

const TAG_FILTERS = [
  { label: "All Tech", value: "" },
  { label: "React", value: "React" },
  { label: "React Native", value: "React Native" },
  { label: "Node.js", value: "Node.js" },
  { label: "AWS", value: "AWS" },
  { label: "Python", value: "Python" },
  { label: "Terraform", value: "Terraform" },
  { label: "PostgreSQL", value: "PostgreSQL" },
  { label: "Firebase", value: "Firebase" },
];

function FilterPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-250 cursor-pointer whitespace-nowrap ${
        active
          ? "bg-accent border-accent text-black"
          : "bg-dc-card border-dc-text/8 text-dc-text/60 hover:border-dc-text/20 hover:text-dc-text"
      }`}
    >
      {label}
    </button>
  );
}

export default function CaseStudiesPage() {
  const navigate = useNavigate();
  const [serviceFilter, setServiceFilter] = useState("");
  const [industryFilter, setIndustryFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  usePageMeta({
    title: "Case Studies — Real Projects, Real Results",
    description: "Browse Solutions Studio's client case studies. Filter by service type, industry and tech stack. From fintech to healthcare, SaaS to e-commerce — $12B+ in transaction volume across 60+ shipped projects.",
    canonical: "https://devcraftstudio.io/case-studies",
    ogImage: "https://readdy.ai/api/search-image?query=portfolio%20grid%20of%20successful%20digital%20product%20screenshots%20dark%20background%20with%20green%20accent%20highlights%20professional%20software%20case%20studies%20technology&width=1200&height=630&seq=og_casestudies_v2&orientation=landscape",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filtered = useMemo(() => {
    return ALL_CASES.filter((cs) => {
      if (serviceFilter && cs.serviceSlug !== serviceFilter) return false;
      if (industryFilter && !cs.tags.some((t) => t.includes(industryFilter)) && !cs.title.toLowerCase().includes(industryFilter.toLowerCase()) && !cs.result.toLowerCase().includes(industryFilter.toLowerCase())) return false;
      if (tagFilter && !cs.tags.some((t) => t.toLowerCase().includes(tagFilter.toLowerCase()))) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return cs.title.toLowerCase().includes(q) || cs.result.toLowerCase().includes(q) || cs.tags.some((t) => t.toLowerCase().includes(q));
      }
      return true;
    });
  }, [serviceFilter, industryFilter, tagFilter, searchQuery]);

  const clearFilters = () => {
    setServiceFilter("");
    setIndustryFilter("");
    setTagFilter("");
    setSearchQuery("");
  };

  const hasActiveFilters = serviceFilter || industryFilter || tagFilter || searchQuery;

  // Schema.org BreadcrumbList + ItemList
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Solutions Studio Case Studies",
      "description": "Client case studies from Solutions Studio covering web development, mobile apps, AI integration, cloud architecture and more",
      "numberOfItems": ALL_CASES.length,
      "itemListElement": ALL_CASES.map((cs, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "name": cs.title,
        "description": cs.result,
        "url": `https://devcraftstudio.io/case-study/${cs.slug}`,
      })),
    };
    const el = document.getElementById("case-studies-schema");
    if (el) { el.textContent = JSON.stringify(schema); } else {
      const script = document.createElement("script");
      script.id = "case-studies-schema";
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    }
    return () => { document.getElementById("case-studies-schema")?.remove(); };
  }, []);

  return (
    <div className="bg-dc-bg min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-dc-bg/95 backdrop-blur-md border-b border-dc-text/8">
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-20 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-dc-text/60 hover:text-dc-text transition-colors duration-200 cursor-pointer whitespace-nowrap"
          >
            <i className="ri-arrow-left-line text-base"></i>
            <span className="text-sm font-medium">Back to Home</span>
          </button>
          <button onClick={() => navigate("/")} className="flex items-center gap-2 cursor-pointer">
            <img
              src="https://static.readdy.ai/image/27f36426f3cab7c4efebb6eb9e24cb04/3338f66b55262222ff9be144548b1ced.png"
              alt="Solutions Studio"
              className="h-9 w-auto object-contain"
            />
            <span className="text-dc-text font-bold text-lg hidden sm:block">
              Solutions<span className="text-accent">.</span>
            </span>
          </button>
          <Link
            to="/contact"
            className="hidden sm:flex items-center gap-2 bg-accent text-black text-sm font-bold px-5 py-2.5 rounded-full whitespace-nowrap hover:bg-white transition-colors duration-300 cursor-pointer"
          >
            Start a Project
            <i className="ri-arrow-right-line"></i>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-16 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="max-w-3xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-accent text-xs font-mono tracking-widest mb-4">CLIENT CASE STUDIES</p>
            <h1 className="text-5xl md:text-7xl font-bold text-dc-text leading-[1.0] mb-5">
              Real work.<br />
              <span className="text-accent">Real results.</span>
            </h1>
            <p className="text-dc-text/65 text-lg leading-relaxed max-w-2xl">
              Not mock-ups or side projects. These are production products used by real businesses — from scrappy startups to Fortune 500 enterprises. Browse by service, industry, or tech stack.
            </p>
          </motion.div>

          {/* Stats row */}
          <motion.div
            className="flex flex-wrap gap-8 mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {[
              { value: "60+", label: "Projects Shipped" },
              { value: "$12B+", label: "Transaction Volume Handled" },
              { value: "28", label: "Countries Deployed" },
              { value: "4.9/5", label: "Client Satisfaction" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <span className="text-2xl font-bold font-mono text-accent">{stat.value}</span>
                <span className="text-dc-text/55 text-xs mt-0.5">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-20 z-40 bg-dc-bg/95 backdrop-blur-md border-b border-dc-text/8 px-6 md:px-10 py-5">
        <div className="max-w-7xl mx-auto flex flex-col gap-4">
          {/* Search bar */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center">
                <i className="ri-search-line text-dc-text/40 text-sm"></i>
              </div>
              <input
                type="text"
                placeholder="Search case studies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-dc-card border border-dc-text/10 rounded-full pl-10 pr-4 py-2.5 text-sm text-dc-text placeholder:text-dc-text/40 focus:outline-none focus:border-accent/40 transition-colors"
              />
            </div>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 text-xs text-dc-text/50 hover:text-accent transition-colors cursor-pointer whitespace-nowrap"
              >
                <i className="ri-close-circle-line text-sm"></i>
                Clear filters
              </button>
            )}
            <span className="ml-auto text-dc-text/40 text-xs font-mono whitespace-nowrap">
              {filtered.length} / {ALL_CASES.length} projects
            </span>
          </div>

          {/* Filter rows */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-dc-text/40 text-[10px] font-mono tracking-widest w-16 shrink-0">SERVICE</span>
              {SERVICE_FILTERS.map((f) => (
                <FilterPill key={f.value} label={f.label} active={serviceFilter === f.value} onClick={() => setServiceFilter(f.value)} />
              ))}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-dc-text/40 text-[10px] font-mono tracking-widest w-16 shrink-0">INDUSTRY</span>
              {INDUSTRY_FILTERS.map((f) => (
                <FilterPill key={f.value} label={f.label} active={industryFilter === f.value} onClick={() => setIndustryFilter(f.value)} />
              ))}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-dc-text/40 text-[10px] font-mono tracking-widest w-16 shrink-0">TECH</span>
              {TAG_FILTERS.map((f) => (
                <FilterPill key={f.value} label={f.label} active={tagFilter === f.value} onClick={() => setTagFilter(f.value)} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="px-6 md:px-10 py-14">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-24"
              >
                <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-dc-card border border-dc-text/8 mx-auto mb-5">
                  <i className="ri-search-line text-2xl text-dc-text/30"></i>
                </div>
                <p className="text-dc-text font-semibold text-lg mb-2">No case studies found</p>
                <p className="text-dc-text/50 text-sm mb-6">Try adjusting your filters or search query</p>
                <button onClick={clearFilters} className="bg-accent text-black font-bold px-6 py-2.5 rounded-full text-sm cursor-pointer whitespace-nowrap">
                  Clear All Filters
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="grid"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filtered.map((cs, i) => (
                  <motion.article
                    key={cs.slug + cs.serviceSlug}
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="bg-dc-card border border-dc-text/8 rounded-2xl overflow-hidden hover:border-accent/30 transition-all duration-350 cursor-pointer group"
                    onClick={() => navigate(`/case-study/${cs.slug}`)}
                    whileHover={{ y: -4 }}
                  >
                    {/* Image */}
                    <div className="relative w-full h-52 overflow-hidden">
                      <img
                        src={cs.image}
                        alt={cs.title}
                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-dc-card via-transparent to-transparent opacity-70" />
                      {/* Service badge */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
                        <i className={`${cs.serviceIcon} text-accent text-xs`}></i>
                        <span className="text-white/90 text-[10px] font-medium">{cs.serviceTitle}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h2 className="text-dc-text font-bold text-base mb-2 group-hover:text-accent transition-colors duration-300 leading-snug">
                        {cs.title}
                      </h2>
                      <div className="flex items-start gap-2 mb-4 bg-accent/8 border border-accent/15 rounded-xl p-3">
                        <i className="ri-check-double-line text-accent text-sm mt-0.5 shrink-0"></i>
                        <p className="text-accent/90 text-xs font-medium leading-relaxed">{cs.result}</p>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {cs.tags.map((tag) => (
                          <span key={tag} className="text-[10px] font-mono text-dc-text/50 bg-dc-text/5 px-2 py-1 rounded-md border border-dc-text/8">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 pb-5 flex items-center justify-between">
                      <Link
                        to={`/services/${cs.serviceSlug}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-dc-text/40 hover:text-accent text-xs flex items-center gap-1 transition-colors duration-200 cursor-pointer"
                      >
                        <i className="ri-arrow-right-up-line text-sm"></i>
                        View service
                      </Link>
                      <div className="flex items-center gap-1 text-accent text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Case Study <i className="ri-arrow-right-line text-sm"></i>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-dc-surface border-t border-dc-text/8 py-24 px-6 md:px-10">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-accent text-xs font-mono tracking-widest mb-4">YOUR PROJECT NEXT?</p>
          <h2 className="text-3xl md:text-5xl font-bold text-dc-text mb-5">
            Ready to become our<br />
            <span className="text-accent">next case study?</span>
          </h2>
          <p className="text-dc-text/65 text-base mb-8 max-w-xl mx-auto">
            Book a free 30-minute discovery call. We&apos;ll scope your project, answer technical questions, and send an honest estimate within 48 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="flex items-center justify-center gap-2 bg-accent text-black font-bold px-8 py-4 rounded-full hover:bg-white transition-colors duration-300 cursor-pointer whitespace-nowrap"
            >
              Start a Project
              <i className="ri-arrow-right-line"></i>
            </Link>
            <Link
              to="/pricing"
              className="flex items-center justify-center gap-2 border border-dc-text/15 text-dc-text font-medium px-8 py-4 rounded-full hover:border-accent hover:text-accent transition-colors duration-300 cursor-pointer whitespace-nowrap"
            >
              View Pricing
              <i className="ri-price-tag-3-line"></i>
            </Link>
          </div>
        </div>
      </section>
      <FloatingBookCTA />
    </div>
  );
}