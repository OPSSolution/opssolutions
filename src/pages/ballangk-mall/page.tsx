import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useInView } from "framer-motion";

const LOGO_URL = "/images/pro-bm.png";

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

// ─── Pillar card (Marketplace Hub / Community Driven / Growth Engine) ───────
function PillarCard({ icon, title, description, index }: { icon: string; title: string; description: string; index: number }) {
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

// ─── List card (Vision / Mission / Goals / Objectives) ──────────────────────
function ListCard({ icon, title, items, index }: { icon: string; title: string; items: string[]; index: number }) {
  return (
    <Reveal delay={index * 0.08} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-accent/10">
          <i className={`${icon} text-accent text-sm`}></i>
        </div>
        <h3 className="text-white font-bold text-lg">{title}</h3>
      </div>
      <ul className="flex flex-col gap-2.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5 text-white/50 text-sm leading-relaxed">
            <i className="ri-checkbox-blank-circle-fill text-accent/50 text-[5px] mt-2 shrink-0"></i>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}

// ─── Why Join card ────────────────────────────────────────────────────────
function WhyJoinCard({ icon, title, description, index }: { icon: string; title: string; description: string; index: number }) {
  return (
    <Reveal delay={index * 0.06} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 hover:border-accent/25 transition-colors duration-300">
      <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-accent/10 border border-accent/20 mb-4">
        <i className={`${icon} text-accent text-base`}></i>
      </div>
      <h3 className="text-white font-semibold text-sm mb-1.5">{title}</h3>
      <p className="text-white/45 text-xs leading-relaxed">{description}</p>
    </Reveal>
  );
}

// ─── How to Join step ─────────────────────────────────────────────────────
function JoinStep({ number, title, description, index }: { number: string; title: string; description: string; index: number }) {
  return (
    <Reveal delay={index * 0.1} className="flex gap-5">
      <div className="flex flex-col items-center shrink-0">
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-accent/10 border border-accent/25">
          <span className="text-accent text-sm font-bold font-mono">{number}</span>
        </div>
        {index < 2 && <div className="w-px flex-1 bg-white/8 mt-2 min-h-8" />}
      </div>
      <div className="pb-8">
        <h4 className="text-white font-semibold text-base mb-1.5">{title}</h4>
        <p className="text-white/45 text-sm leading-relaxed">{description}</p>
      </div>
    </Reveal>
  );
}

// ─── Commission split node ────────────────────────────────────────────────
function CommissionNode({ label, sublabel, value, highlight, index }: { label: string; sublabel: string; value: string; highlight?: boolean; index: number }) {
  return (
    <Reveal delay={index * 0.06} className={`flex flex-col items-center text-center rounded-xl p-4 border ${highlight ? "bg-accent/10 border-accent/30" : "bg-white/[0.03] border-white/[0.06]"}`}>
      <span className={`text-xl font-bold mb-1 ${highlight ? "text-accent" : "text-white"}`}>{value}</span>
      <span className="text-white/70 text-xs font-semibold mb-0.5">{label}</span>
      <span className="text-white/35 text-[10px] font-mono">{sublabel}</span>
    </Reveal>
  );
}

// ─── Commission tier ──────────────────────────────────────────────────────
function TierCard({ rate, label, index }: { rate: string; label: string; index: number }) {
  return (
    <Reveal delay={index * 0.07} className="flex flex-col items-center text-center bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 hover:border-accent/25 transition-colors duration-300">
      <span className="text-2xl font-bold text-accent mb-1">{rate}</span>
      <span className="text-white/45 text-xs">{label}</span>
    </Reveal>
  );
}

// ─── Ecosystem flow step ──────────────────────────────────────────────────
function FlowStep({ icon, label, index, last }: { icon: string; label: string; index: number; last?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <Reveal delay={index * 0.08} className="flex flex-col items-center text-center gap-2 w-28 shrink-0">
        <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-accent/10 border border-accent/20">
          <i className={`${icon} text-accent text-base`}></i>
        </div>
        <span className="text-white/55 text-[11px] leading-tight">{label}</span>
      </Reveal>
      {!last && <i className="ri-arrow-right-s-line text-white/15 text-xl shrink-0 hidden sm:block"></i>}
    </div>
  );
}

// ─── Merchant benefit card ────────────────────────────────────────────────
function BenefitCard({ icon, title, description, index }: { icon: string; title: string; description: string; index: number }) {
  return (
    <Reveal delay={index * 0.05} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 hover:border-accent/25 transition-colors duration-300">
      <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-accent/10 border border-accent/20 mb-3">
        <i className={`${icon} text-accent text-sm`}></i>
      </div>
      <h3 className="text-white font-semibold text-sm mb-1.5">{title}</h3>
      <p className="text-white/40 text-xs leading-relaxed">{description}</p>
    </Reveal>
  );
}

// ─── Podcast feature ──────────────────────────────────────────────────────
function PodcastFeature({ icon, title, description, index }: { icon: string; title: string; description: string; index: number }) {
  return (
    <Reveal delay={index * 0.07} className="flex items-start gap-3.5">
      <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/10 border border-white/15 shrink-0">
        <i className={`${icon} text-white text-sm`}></i>
      </div>
      <div>
        <h4 className="text-white font-semibold text-sm mb-1">{title}</h4>
        <p className="text-white/50 text-xs leading-relaxed">{description}</p>
      </div>
    </Reveal>
  );
}

export default function BallangkMallPage() {
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
      <section className="relative pt-40 pb-20 md:pt-48 md:pb-24 overflow-hidden">
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #0f1c36 0%, #0a1226 55%, #080d1a 100%)" }} />
        <div className="absolute top-0 right-0 w-[520px] h-[520px] pointer-events-none" style={{ background: "radial-gradient(circle at top right, rgba(41,171,226,0.10) 0%, transparent 65%)" }} />

        <div className="relative max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-12 items-center">
          <div>
            <motion.div className="flex flex-wrap items-center gap-3 mb-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
              <span className="bg-accent text-black text-xs font-bold px-3 py-1.5 rounded-full">Web &amp; App</span>
              <span className="text-white/35 text-xs font-mono border border-white/10 px-2.5 py-1 rounded-lg">2025</span>
            </motion.div>

            <motion.p
              className="text-accent text-xs font-mono tracking-widest mb-3"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              YOUR SMART MARKETPLACE
            </motion.p>

            <motion.h1
              className="text-4xl md:text-6xl font-bold text-white leading-tight max-w-2xl mb-3"
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              Safe to Shop.<br />Fair to Earn.
            </motion.h1>

            <motion.p
              className="text-white/40 text-sm font-mono mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Developed &amp; operated by OPS Solutions
            </motion.p>

            <motion.p
              className="text-white/55 text-lg max-w-xl leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
            >
              Ballangk Mall is a dynamic online marketplace that connects buyers and sellers across local and international markets. We empower entrepreneurs and SMEs with cutting-edge tools to sell smarter, grow faster, and reach further.
            </motion.p>
          </div>

          <motion.div
            className="bg-white rounded-3xl p-8 md:p-10 shadow-[0_24px_60px_rgba(0,0,0,0.45)] justify-self-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <img src={LOGO_URL} alt="Ballangk Mall" className="w-40 h-40 md:w-48 md:h-48 object-contain" />
          </motion.div>
        </div>
      </section>

      {/* ── Pillars ── */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <PillarCard index={0} icon="ri-store-2-line" title="Marketplace Hub" description="A curated platform for local and international products — easy to browse, easy to buy." />
          <PillarCard index={1} icon="ri-team-line" title="Community Driven" description="Members are partners — a thriving ecosystem of sellers, affiliates & supporters." />
          <PillarCard index={2} icon="ri-rocket-2-line" title="Growth Engine" description="A strong affiliate engine and dedicated marketing support to scale your brand." />
        </div>
      </section>

      {/* ── Vision / Mission / Goals / Objectives ── */}
      <section className="bg-[#0a0f1e] border-y border-white/5 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <Reveal className="mb-10">
            <SectionLabel>THE FOUNDATION</SectionLabel>
            <h2 className="text-white font-bold text-2xl md:text-3xl">Vision, mission &amp; where we&apos;re headed</h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ListCard
              index={0}
              icon="ri-eye-line"
              title="Vision"
              items={[
                "Cambodia's most trusted & innovative e-commerce marketplace.",
                "Connecting local businesses to local and global audiences.",
                "Empowering every individual to join the digital economy.",
              ]}
            />
            <ListCard
              index={1}
              icon="ri-flag-line"
              title="Mission"
              items={[
                "Provide a safe, fair & accessible marketplace for all.",
                "Empower merchants, affiliates, KOLs & buyers together.",
                "Drive growth through technology and strategic partnerships.",
              ]}
            />
            <ListCard
              index={2}
              icon="ri-trophy-line"
              title="Goals"
              items={[
                "Build the #1 social commerce platform in Cambodia.",
                "Onboard 10,000+ merchants & 100,000+ active users.",
                "Enable every seller to grow via Smart Affiliate.",
                "Establish a strong local & international brand presence.",
              ]}
            />
            <ListCard
              index={3}
              icon="ri-list-check-3"
              title="Objectives"
              items={[
                "Launch the Smart Affiliate System & grow the network.",
                "Build strategic partnerships for branding & KOL reach.",
                "Produce the SME Podcast to elevate merchant stories.",
                "Deliver a secure, transparent payment experience.",
                "Expand to regional markets within 3 years.",
              ]}
            />
          </div>
        </div>
      </section>

      {/* ── Why Join ── */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-20">
        <Reveal className="mb-10">
          <SectionLabel>THE OPPORTUNITY</SectionLabel>
          <h2 className="text-white font-bold text-2xl md:text-3xl">Why Join Ballangk Mall?</h2>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <WhyJoinCard index={0} icon="ri-global-line" title="Local & Global Reach" description="Sell to customers in your city and beyond — bridging local charm with global commerce." />
          <WhyJoinCard index={1} icon="ri-links-line" title="Smart Affiliate System" description="Earn passive income by promoting products. The affiliate network grows your earnings 24/7." />
          <WhyJoinCard index={2} icon="ri-megaphone-line" title="Marketing Power" description="Full-service branding support: KOLs, influencers, TVC, and digital campaigns." />
          <WhyJoinCard index={3} icon="ri-shield-check-line" title="Trusted Platform" description="Secure transactions, transparent policies, and dedicated merchant support at every step." />
          <WhyJoinCard index={4} icon="ri-movie-2-line" title="Content Production" description="Access in-house short films, drama series & TVC production to showcase your brand." />
          <WhyJoinCard index={5} icon="ri-mic-2-line" title="SME Spotlight" description="Featured on the SME Podcast — get seen, heard, and known by a growing audience." />
        </div>
      </section>

      {/* ── How to Join ── */}
      <section className="bg-[#0a0f1e] border-y border-white/5 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <Reveal className="mb-10">
            <SectionLabel>GET STARTED</SectionLabel>
            <h2 className="text-white font-bold text-2xl md:text-3xl">How to Join — 3 Simple Steps</h2>
          </Reveal>
          <div className="max-w-2xl">
            <JoinStep index={0} number="01" title="Register as a Member" description="Sign up on Ballangk Mall, complete your seller/affiliate profile, and choose your membership type." />
            <JoinStep index={1} number="02" title="List Your Products" description="Upload products with photos & pricing, set up your store, and activate your Smart Affiliate link." />
            <JoinStep index={2} number="03" title="Promote & Earn" description="Share affiliate links, leverage marketing support (up to 50% discount), and track sales & commissions in real time." />
          </div>
        </div>
      </section>

      {/* ── Smart Affiliate System ── */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-20">
        <Reveal className="mb-4">
          <SectionLabel>HOW EARNING WORKS</SectionLabel>
          <h2 className="text-white font-bold text-2xl md:text-3xl mb-4">Smart Affiliate System</h2>
          <p className="text-white/50 text-sm leading-relaxed max-w-2xl mb-2">
            A social commerce model connecting users, KOLs, and merchants. Every user becomes a promoter — earning commissions by sharing products, while merchants grow sales organically without extra marketing spend.
          </p>
          <p className="text-white/30 text-xs font-mono mb-8">
            3-LEVEL UNILEVEL SYSTEM — EXAMPLE: PRODUCT PRICE $100 · COMMISSION RATE 10% = $10 POOL
          </p>
        </Reveal>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          <CommissionNode index={0} highlight label="Store Owner" sublabel="Receives 90%" value="$90" />
          <CommissionNode index={1} label="Affiliate L1" sublabel="Direct · 3%" value="$3" />
          <CommissionNode index={2} label="Affiliate L2" sublabel="Indirect · 1%" value="$1" />
          <CommissionNode index={3} label="Affiliate L3" sublabel="Extended · 1%" value="$1" />
          <CommissionNode index={4} label="KOL-Promoter" sublabel="Live / Promo · 2%" value="$2" />
          <CommissionNode index={5} label="Platform / Referrer" sublabel="Platform 2% · Referrer 1%" value="$3" />
        </div>

        <Reveal delay={0.1} className="flex items-start gap-2.5 bg-accent/8 border border-accent/20 rounded-xl px-4 py-3.5 max-w-3xl">
          <i className="ri-information-line text-accent text-sm mt-0.5 shrink-0"></i>
          <p className="text-white/50 text-xs leading-relaxed">
            If the buyer is already an affiliate member, the L1 commission shows as a discount at checkout. Commission is paid after the completed transaction. Delivery fee excluded.
          </p>
        </Reveal>
      </section>

      {/* ── Referral Program ── */}
      <section className="bg-[#0a0f1e] border-y border-white/5 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <Reveal className="mb-10">
            <SectionLabel>GROW THE NETWORK</SectionLabel>
            <h2 className="text-white font-bold text-2xl md:text-3xl">Referral Program &amp; Flexible Commissions</h2>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <Reveal delay={0.05} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-accent/10">
                  <i className="ri-user-add-line text-accent text-sm"></i>
                </div>
                <h3 className="text-white font-bold text-base">User Referral</h3>
              </div>
              <p className="text-white/50 text-sm leading-relaxed">
                Invite new users to join Ballangk Mall — reward of <span className="text-accent font-semibold">$0.10 per user</span>, paid after their 1st order.
              </p>
            </Reveal>

            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-accent/10">
                  <i className="ri-price-tag-3-line text-accent text-sm"></i>
                </div>
                <h3 className="text-white font-bold text-base">Merchant Commission Options</h3>
              </div>
              <p className="text-white/40 text-xs leading-relaxed mb-4">Merchants choose their own commission rate — a flexible marketing strategy that attracts more affiliates and KOLs.</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                <TierCard index={0} rate="5%" label="Entry Level" />
                <TierCard index={1} rate="10%" label="Standard" />
                <TierCard index={2} rate="15%" label="Growth" />
                <TierCard index={3} rate="20%" label="Aggressive" />
              </div>
              <p className="text-accent/60 text-xs font-mono">★ Higher commission rate = more affiliate &amp; KOL promotion for your store.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── KOL Monetization ── */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-20">
        <Reveal className="mb-4">
          <SectionLabel>FOR INFLUENCERS</SectionLabel>
          <h2 className="text-white font-bold text-2xl md:text-3xl mb-4">KOL Monetization &amp; Ecosystem Flow</h2>
          <p className="text-white/50 text-sm leading-relaxed max-w-2xl">
            KOLs and influencers earn commissions by promoting products through Ballangk Mall&apos;s Smart Link system — turning their audience directly into sales.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-14">
          <WhyJoinCard index={0} icon="ri-live-line" title="Livestream Selling" description="Sell via live video using smart links; earn 2% commission on all sales." />
          <WhyJoinCard index={1} icon="ri-video-line" title="Post / Video Promotion" description="Share product smart links in posts or videos; earn on every click-through sale." />
          <WhyJoinCard index={2} icon="ri-vip-crown-2-line" title="Exclusive Products" description="Upcoming module — KOLs can access exclusive products at higher rates." />
        </div>

        <Reveal delay={0.1}>
          <p className="text-white/30 text-xs font-mono tracking-widest mb-5">ECOSYSTEM SALES FLOW</p>
          <div className="flex flex-wrap items-center gap-4 overflow-x-auto pb-2">
            <FlowStep index={0} icon="ri-store-2-line" label="Merchants upload products" />
            <FlowStep index={1} icon="ri-user-star-line" label="KOLs & affiliates promote via smart links" />
            <FlowStep index={2} icon="ri-share-forward-line" label="Users share on social media" />
            <FlowStep index={3} icon="ri-secure-payment-line" label="Customers purchase securely" />
            <FlowStep index={4} last icon="ri-hand-coin-line" label="Commission auto-distributed instantly" />
          </div>
        </Reveal>
      </section>

      {/* ── Merchant Benefits ── */}
      <section className="bg-[#0a0f1e] border-y border-white/5 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <Reveal className="mb-10">
            <SectionLabel>FOR MERCHANTS</SectionLabel>
            <h2 className="text-white font-bold text-2xl md:text-3xl">Merchant Benefits</h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <BenefitCard index={0} icon="ri-layout-4-line" title="Dedicated Storefront" description="Your own branded page on Ballangk Mall to showcase products professionally." />
            <BenefitCard index={1} icon="ri-node-tree" title="Affiliate Sales Network" description="Thousands of affiliates actively promoting your products to earn commissions." />
            <BenefitCard index={2} icon="ri-bar-chart-2-line" title="Sales & Analytics Dashboard" description="Real-time data on views, clicks, sales, and affiliate performance." />
            <BenefitCard index={3} icon="ri-mic-2-line" title="SME Podcast Appearance" description="Be featured for authentic brand storytelling & outreach." />
            <BenefitCard index={4} icon="ri-broadcast-line" title="Multi-Channel Promotion" description="Promoted across website, social media, and influencer channels." />
            <BenefitCard index={5} icon="ri-verified-badge-line" title="Verified Merchant Badge" description="Build buyer trust through official Verified Merchant certification." />
            <BenefitCard index={6} icon="ri-clapperboard-line" title="Content Production Support" description="In-house production for TVC, short film & drama series." />
            <BenefitCard index={7} icon="ri-earth-line" title="International Market Access" description="Expand beyond borders with a growing global buyer network." />
          </div>
        </div>
      </section>

      {/* ── SME Podcast ── */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-20">
        <Reveal
          className="relative bg-gradient-to-br from-accent/15 via-[#0f1c36] to-[#080d1a] border border-accent/20 rounded-3xl px-8 py-10 md:px-14 md:py-14 overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-72 h-72 pointer-events-none" style={{ background: "radial-gradient(circle at top right, rgba(41,171,226,0.12) 0%, transparent 65%)" }} />
          <p className="text-accent text-xs font-mono tracking-widest mb-3 relative z-10">SME PODCAST — POWERED BY BALLANGK MALL</p>
          <p className="text-white/60 text-base leading-relaxed max-w-2xl mb-10 relative z-10">
            A program designed to give Small and Medium Enterprises a professional platform to share their stories, products, and vision with a local and international audience.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6 mb-10 relative z-10">
            <PodcastFeature index={0} icon="ri-broadcast-line" title="Professional Broadcast" description="Recorded & produced in-house with broadcast-quality audio & visuals." />
            <PodcastFeature index={1} icon="ri-earth-line" title="Local + Global Distribution" description="Across streaming platforms, social media, and Ballangk Mall channels." />
            <PodcastFeature index={2} icon="ri-user-voice-line" title="Influencer Amplification" description="Episodes promoted by the KOL & influencer network for maximum reach." />
            <PodcastFeature index={3} icon="ri-award-line" title="Brand Authority Building" description="Establish yourself as an industry expert and trusted SME voice." />
          </div>
          <p className="text-white font-bold text-xl md:text-2xl relative z-10">Your Brand. Your Story. Your Stage.</p>
        </Reveal>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 pb-20">
        <Reveal className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-accent/8 border border-accent/20 rounded-2xl px-7 py-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-1">Want a platform like Ballangk Mall?</h3>
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
