import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useInView } from "framer-motion";

const HERO_IMAGE =
  "https://readdy.ai/api/search-image?query=creative%20branding%20and%20content%20production%20studio%2C%20KOL%20influencer%20filming%20setup%20with%20camera%20and%20ring%20light%2C%20dark%20cinematic%20professional%20photography%2C%20talent%20management%20and%20media%20production%20aesthetic%20with%20blue%20accent%20lighting&width=1400&height=700&seq=pinexpro_hero&orientation=landscape";

// ─── Reveal wrapper ─────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-accent text-xs font-mono tracking-widest mb-2">{children}</p>;
}

// ─── Service item ─────────────────────────────────────────────────────────
function ServiceCard({ icon, title, index }: { icon: string; title: string; index: number }) {
  return (
    <Reveal delay={index * 0.06} className="flex items-center gap-3.5 bg-white/[0.03] border border-white/[0.06] rounded-xl px-5 py-4 hover:border-accent/25 transition-colors duration-300">
      <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-accent/10 border border-accent/20 shrink-0">
        <i className={`${icon} text-accent text-sm`}></i>
      </div>
      <span className="text-white/70 text-sm font-medium">{title}</span>
    </Reveal>
  );
}

// ─── App module card ────────────────────────────────────────────────────────
function ModuleCard({ icon, title, description, index }: { icon: string; title: string; description: string; index: number }) {
  return (
    <Reveal delay={index * 0.08} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 hover:border-accent/25 transition-colors duration-300">
      <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-accent/10 border border-accent/20 mb-4">
        <i className={`${icon} text-accent text-lg`}></i>
      </div>
      <h3 className="text-white font-semibold text-base mb-2">{title}</h3>
      <p className="text-white/45 text-sm leading-relaxed">{description}</p>
    </Reveal>
  );
}

export default function PinexProPage() {
  const navigate = useNavigate();

  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, []);

  return (
    <div className="bg-[#080d1a] min-h-screen">
      {/* ── Nav ── */}
      <header className="fixed top-0 left-0 w-full z-50 bg-[#080d1a]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between h-[68px]">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/40 hover:text-white transition-colors cursor-pointer whitespace-nowrap">
            <i className="ri-arrow-left-line text-sm"></i>
            <span className="text-sm font-medium hidden sm:block">Back</span>
          </button>
          <a href="/" onClick={(e) => { e.preventDefault(); navigate("/"); }} className="flex items-center gap-2 cursor-pointer">
            <span className="text-white font-bold">Solutions<span className="text-accent">.</span></span>
          </a>
          <button onClick={() => navigate("/#contact")} className="flex items-center gap-2 bg-accent text-black text-sm font-bold px-4 py-2 rounded-full hover:bg-white transition-colors cursor-pointer whitespace-nowrap">
            Start a Project <i className="ri-arrow-right-line text-xs"></i>
          </button>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative h-[70vh] min-h-[480px] overflow-hidden flex items-end">
        <div className="absolute inset-0">
          <img src={HERO_IMAGE} alt="Pinex Pro" className="w-full h-full object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080d1a] via-[#080d1a]/70 to-[#080d1a]/25" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080d1a]/40 to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-10 pb-16 md:pb-20">
          <motion.div className="flex flex-wrap items-center gap-3 mb-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
            <span className="bg-accent text-black text-xs font-bold px-3 py-1.5 rounded-full">Web &amp; App</span>
            <span className="text-white/35 text-xs font-mono border border-white/10 px-2.5 py-1 rounded-lg">2025</span>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-6xl font-bold text-white leading-tight max-w-3xl mb-5"
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            Pinex Pro
          </motion.h1>

          <motion.p
            className="text-white/55 text-lg md:text-xl max-w-2xl leading-relaxed mb-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.28 }}
          >
            Strategic branding, KOL network, and production partner — now powered by the Pinex Pro App.
          </motion.p>

          <motion.p
            className="text-white/40 text-sm font-mono"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.36 }}
          >
            Developed &amp; operated by OPS Solutions
          </motion.p>
        </div>
      </section>

      {/* ── Overview ── */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-20">
        <div className="max-w-3xl">
          <Reveal>
            <SectionLabel>OVERVIEW</SectionLabel>
            <p className="text-white/55 text-lg leading-loose">
              Pinex Pro is the group&apos;s strategic branding and marketing arm, connecting brands with talent, audiences, and original content. It complements Ballangk Mall by supplying the creative firepower — KOLs, influencers, and professional production — that turns products into stories and stories into sales.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Services ── */}
      <section className="bg-[#0a0f1e] border-y border-white/5 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <Reveal className="mb-10">
            <SectionLabel>WHAT WE DO</SectionLabel>
            <h2 className="text-white font-bold text-2xl md:text-3xl">Services</h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <ServiceCard index={0} icon="ri-line-chart-line" title="Full-service branding & marketing strategy" />
            <ServiceCard index={1} icon="ri-user-star-line" title="KOL & influencer network management" />
            <ServiceCard index={2} icon="ri-clapperboard-line" title="Short film, drama series & TVC production" />
            <ServiceCard index={3} icon="ri-contacts-book-line" title="Talent directory & talent management" />
            <ServiceCard index={4} icon="ri-mic-2-line" title="SME Podcast production partner" />
            <ServiceCard index={5} icon="ri-broadcast-line" title="Digital campaign planning & execution" />
          </div>
        </div>
      </section>

      {/* ── The Pinex Pro App ── */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-20">
        <Reveal className="mb-10 max-w-2xl">
          <SectionLabel>THE PRODUCT</SectionLabel>
          <h2 className="text-white font-bold text-2xl md:text-3xl mb-4">The Pinex Pro App</h2>
          <p className="text-white/50 text-sm leading-relaxed">
            A dedicated platform extending Pinex Pro into a digital product — connecting talent, audiences, and original entertainment in one place, while feeding promotion and content back into the wider ecosystem.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ModuleCard index={0} icon="ri-contacts-book-2-line" title="Talent Directory" description="A searchable hub connecting talents, models, actors, creators & KOLs with brands and projects — discovery, profiles, and booking in one place." />
          <ModuleCard index={1} icon="ri-live-line" title="Video Stream" description="A streaming channel for original content, livestreams, and brand shows — giving SMEs and creators a stage to reach audiences directly." />
          <ModuleCard index={2} icon="ri-book-open-line" title="Comic Drama" description="Original digital comics and dramatized series — entertainment that doubles as a powerful brand-storytelling and audience-building format." />
        </div>
      </section>

      {/* ── Ecosystem fit ── */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 pb-16 md:pb-20">
        <Reveal className="relative bg-gradient-to-br from-accent/15 via-[#0f1c36] to-[#080d1a] border border-accent/20 rounded-3xl px-8 py-10 md:px-14 md:py-12 overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 pointer-events-none" style={{ background: "radial-gradient(circle at top right, rgba(41,171,226,0.12) 0%, transparent 65%)" }} />
          <p className="text-accent text-xs font-mono tracking-widest mb-3 relative z-10">ECOSYSTEM FIT</p>
          <p className="text-white/65 text-base md:text-lg leading-relaxed max-w-3xl relative z-10 mb-6">
            The Pinex Pro App monetizes talent, amplifies merchants and SMEs through original content, and channels engaged audiences toward Ballangk Mall — closing the loop between content, commerce, and community.
          </p>
          <button
            onClick={() => navigate("/work/ballangk-mall")}
            className="relative z-10 flex items-center gap-2 text-accent text-sm font-semibold hover:text-white transition-colors cursor-pointer"
          >
            See how it powers Ballangk Mall <i className="ri-arrow-right-line"></i>
          </button>
        </Reveal>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 pb-20">
        <Reveal className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-accent/8 border border-accent/20 rounded-2xl px-7 py-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-1">Need a branding & content partner like Pinex Pro?</h3>
            <p className="text-white/40 text-sm">We&apos;re accepting projects. Let&apos;s talk.</p>
          </div>
          <button onClick={() => navigate("/#contact")} className="flex items-center gap-2 bg-accent text-black font-bold px-7 py-3.5 rounded-xl hover:bg-white transition-colors duration-300 cursor-pointer whitespace-nowrap">
            Start Your Project <i className="ri-arrow-right-line"></i>
          </button>
        </Reveal>
      </section>
    </div>
  );
}
