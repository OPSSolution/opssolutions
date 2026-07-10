import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { services } from "@/pages/services/data";
import { usePageMeta } from "@/hooks/usePageMeta";
import FloatingBookCTA from "@/pages/home/components/FloatingBookCTA";
import QuoteCalculator from "./components/QuoteCalculator";

const faqs = [
  { q: "Do you charge hourly or fixed-price?", a: "We almost always work on fixed-scope contracts with milestones. We scope every project precisely upfront so both sides have cost certainty. For ongoing retainers (Managed Ops, MLOps, DevOps), we bill monthly." },
  { q: "What's included in a project engagement?", a: "Everything: discovery, design, development, testing, deployment, documentation, and a 30-day post-launch support window. No surprise 'additional charges' for things we should have scoped." },
  { q: "Can I bundle multiple services?", a: "Yes, and it typically reduces the overall investment. A web + mobile + design bundle allows shared discovery, design systems, and API work — roughly 15–25% more efficient than sequential projects." },
  { q: "Do you work with early-stage startups?", a: "Absolutely. Our MVP tier across services starts from $15k and is designed for fast validation. We've taken teams from idea to App Store in under 12 weeks." },
  { q: "What happens after launch?", a: "You can engage us on a retainer for ongoing development, or we deliver a clean handoff with full documentation so your internal team can own it. Many clients do both." },
];

export default function PricingPage() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeBundle, setActiveBundle] = useState<string[]>([]);

  usePageMeta({
    title: "Pricing — Transparent Fixed-Scope Software Development Costs",
    description: "See transparent pricing for web development, mobile apps, cloud architecture, AI integration, UI/UX design and DevOps. Fixed-scope contracts from $8k. Free discovery call included.",
    canonical: "https://devcraftstudio.io/pricing",
    ogImage: "https://readdy.ai/api/search-image?query=clean%20minimal%20dark%20pricing%20dashboard%20showing%20software%20development%20service%20tiers%20and%20cost%20breakdowns%20professional%20fintech%20inspired%20layout%20dark%20background%20lime%20green%20accents&width=1200&height=630&seq=og_pricing_v2&orientation=landscape",
  });

  // Schema.org: FAQPage + Service with pricing offers
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "FAQPage",
          "name": "Solutions Studio Pricing FAQ",
          "description": "Frequently asked questions about Solutions Studio software development pricing",
          "mainEntity": faqs.map((faq) => ({
            "@type": "Question",
            "name": faq.q,
            "acceptedAnswer": { "@type": "Answer", "text": faq.a },
          })),
        },
        {
          "@type": "WebPage",
          "name": "Software Development Pricing | Solutions Studio",
          "description": "Transparent pricing for web development, mobile apps, cloud architecture, UI/UX design, AI integration and DevOps — fixed-scope contracts with milestone payments",
          "url": "https://devcraftstudio.io/pricing",
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://devcraftstudio.io" },
              { "@type": "ListItem", "position": 2, "name": "Pricing", "item": "https://devcraftstudio.io/pricing" },
            ],
          },
          "mainEntity": services.map((svc) => ({
            "@type": "Service",
            "name": svc.title,
            "description": svc.subtitle,
            "provider": { "@type": "Organization", "name": "Solutions Studio" },
            "offers": svc.pricing.map((tier) => ({
              "@type": "Offer",
              "name": `${svc.title} — ${tier.tier}`,
              "description": tier.ideal,
              "price": tier.range,
              "priceCurrency": "USD",
            })),
          })),
        },
      ],
    };
    const el = document.getElementById("pricing-schema");
    if (el) { el.textContent = JSON.stringify(schema); } else {
      const script = document.createElement("script");
      script.id = "pricing-schema";
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    }
    return () => { document.getElementById("pricing-schema")?.remove(); };
  }, []);

  const toggleBundle = (slug: string) => {
    setActiveBundle((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const getBundleRange = () => {
    if (activeBundle.length === 0) return null;
    const selected = services.filter((s) => activeBundle.includes(s.slug));
    const lows = selected.map((s) => {
      const match = s.pricing[0].range.match(/\$(\d+)k/);
      return match ? parseInt(match[1]) : 0;
    });
    const highs = selected.map((s) => {
      const match = s.pricing[s.pricing.length - 1].range.match(/\$(\d+)k/);
      return match ? parseInt(match[1]) : 0;
    });
    const totalLow = lows.reduce((a, b) => a + b, 0);
    const totalHigh = highs.reduce((a, b) => a + b, 0);
    const discountedLow = Math.round(totalLow * 0.8);
    const discountedHigh = Math.round(totalHigh * 0.8);
    return `$${discountedLow}k – $${discountedHigh}k`;
  };

  return (
    <div className="bg-dc-bg min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-dc-bg/95 backdrop-blur-md border-b border-dc-text/8">
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-20 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-dc-text/50 hover:text-dc-text transition-colors duration-200 cursor-pointer whitespace-nowrap"
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
          <button
            onClick={() => navigate("/#contact")}
            className="hidden sm:flex items-center gap-2 bg-accent text-black text-sm font-bold px-5 py-2.5 rounded-full whitespace-nowrap hover:bg-white transition-colors duration-300 cursor-pointer"
          >
            Get an Estimate
            <i className="ri-arrow-right-line"></i>
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="max-w-3xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-accent text-xs font-mono tracking-widest mb-4">TRANSPARENT PRICING</p>
            <h1 className="text-5xl md:text-7xl font-bold text-dc-text leading-[1.0] mb-5">
              No surprises.<br />
              <span className="text-accent">Just clarity.</span>
            </h1>
            <p className="text-dc-text/55 text-lg leading-relaxed max-w-2xl">
              Every project is scoped individually, but these ranges give you a realistic baseline before we talk. All prices in USD. Fixed-scope by default.
            </p>
          </motion.div>

          {/* Trust bar */}
          <motion.div
            className="flex flex-wrap items-center gap-6 mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {[
              { icon: "ri-shield-check-line", text: "Fixed-scope contracts" },
              { icon: "ri-time-line", text: "No hidden hourly charges" },
              { icon: "ri-refund-2-line", text: "Milestone-based payments" },
              { icon: "ri-file-text-line", text: "Full IP transfer on delivery" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2 text-dc-text/60 text-sm">
                <div className="w-5 h-5 flex items-center justify-center">
                  <i className={`${item.icon} text-accent text-base`}></i>
                </div>
                {item.text}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services Pricing Grid */}
      <section className="px-6 md:px-10 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {services.map((service, si) => (
              <motion.div
                key={service.slug}
                className="bg-dc-card border border-dc-text/8 rounded-2xl overflow-hidden hover:border-accent/20 transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (si % 2) * 0.1 }}
              >
                {/* Service header */}
                <div className="p-6 border-b border-dc-text/5 flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-accent/10 border border-accent/20 shrink-0">
                      <i className={`${service.icon} text-accent text-lg`}></i>
                    </div>
                    <div>
                      <h3 className="text-dc-text font-bold text-lg">{service.title}</h3>
                      <p className="text-dc-text/50 text-xs">{service.subtitle}</p>
                    </div>
                  </div>
                  <Link
                    to={`/services/${service.slug}`}
                    className="text-accent/60 hover:text-accent text-xs font-medium flex items-center gap-1 whitespace-nowrap transition-colors cursor-pointer shrink-0 mt-1"
                  >
                    Details <i className="ri-arrow-right-up-line text-sm"></i>
                  </Link>
                </div>

                {/* Pricing tiers */}
                <div className="p-6">
                  <div className="grid grid-cols-3 gap-3">
                    {service.pricing.map((tier, ti) => (
                      <div
                        key={tier.tier}
                        className={`rounded-xl p-4 text-center border transition-all duration-300 ${
                          ti === 1
                            ? "bg-accent border-accent/50"
                            : "bg-dc-surface border-dc-text/5 hover:border-dc-text/15"
                        }`}
                      >
                        {ti === 1 && (
                          <span className="text-black text-[10px] font-bold bg-black/15 px-2 py-0.5 rounded-full block mb-2">
                            POPULAR
                          </span>
                        )}
                        <p className={`text-xs font-semibold mb-1 ${ti === 1 ? "text-black/70" : "text-dc-text/50"}`}>
                          {tier.tier}
                        </p>
                        <p className={`text-sm font-bold font-mono leading-tight ${ti === 1 ? "text-black" : "text-accent"}`}>
                          {tier.range}
                        </p>
                        <p className={`text-[10px] mt-2 leading-relaxed ${ti === 1 ? "text-black/55" : "text-dc-text/40"}`}>
                          {tier.ideal}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Calculator */}
      <QuoteCalculator />

      {/* Bundle Builder */}
      <section className="bg-dc-surface border-t border-dc-text/5 py-24 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-accent text-xs font-mono tracking-widest mb-3">BUNDLE & SAVE</p>
            <h2 className="text-3xl md:text-5xl font-bold text-dc-text mb-4">
              Build Your <span className="text-accent">Package</span>
            </h2>
            <p className="text-dc-text/50 text-sm max-w-xl mx-auto">
              Combining services saves 15–25%. Select the services you need and see an estimated bundled range.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
            {services.map((service) => {
              const isActive = activeBundle.includes(service.slug);
              return (
                <motion.button
                  key={service.slug}
                  onClick={() => toggleBundle(service.slug)}
                  className={`flex flex-col items-center gap-3 p-5 rounded-2xl border text-center cursor-pointer transition-all duration-300 ${
                    isActive
                      ? "bg-accent/15 border-accent/50"
                      : "bg-dc-card border-dc-text/8 hover:border-dc-text/20"
                  }`}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <div className={`w-10 h-10 flex items-center justify-center rounded-xl transition-colors duration-300 ${isActive ? "bg-accent/20 border-accent/30 border" : "bg-dc-text/5"}`}>
                    <i className={`${service.icon} text-lg ${isActive ? "text-accent" : "text-dc-text/40"}`}></i>
                  </div>
                  <p className={`text-xs font-semibold leading-tight ${isActive ? "text-accent" : "text-dc-text/60"}`}>
                    {service.title}
                  </p>
                  {isActive && (
                    <div className="w-5 h-5 flex items-center justify-center rounded-full bg-accent">
                      <i className="ri-check-line text-black text-xs"></i>
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Bundle result */}
          <div className={`rounded-2xl border p-8 transition-all duration-500 ${
            activeBundle.length > 0
              ? "bg-dc-card border-accent/25"
              : "bg-dc-card border-dc-text/5 opacity-60"
          }`}>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <p className="text-dc-text/50 text-xs font-mono tracking-widest mb-2">
                  {activeBundle.length === 0 ? "SELECT SERVICES ABOVE" : `${activeBundle.length} SERVICE${activeBundle.length > 1 ? "S" : ""} SELECTED`}
                </p>
                <h3 className="text-dc-text font-bold text-2xl mb-1">
                  {activeBundle.length === 0 ? "Your bundle estimate" : getBundleRange()}
                </h3>
                {activeBundle.length > 1 && (
                  <p className="text-accent text-sm font-medium">
                    Includes ~20% bundle discount applied
                  </p>
                )}
                {activeBundle.length === 0 && (
                  <p className="text-dc-text/40 text-sm">Select 2+ services to see your bundled estimate</p>
                )}
              </div>
              <button
                onClick={() => navigate("/#contact")}
                className="flex items-center gap-2 bg-accent text-black font-bold px-7 py-4 rounded-full hover:bg-white transition-colors duration-300 cursor-pointer whitespace-nowrap shrink-0"
              >
                Discuss This Package
                <i className="ri-arrow-right-line"></i>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6 md:px-10 border-t border-dc-text/5">
        <div className="max-w-3xl mx-auto">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-accent text-xs font-mono tracking-widest mb-3">PRICING FAQ</p>
            <h2 className="text-3xl md:text-4xl font-bold text-dc-text">
              Common <span className="text-accent">Questions</span>
            </h2>
          </motion.div>

          <div className="flex flex-col gap-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                className="bg-dc-card border border-dc-text/8 rounded-2xl overflow-hidden"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
              >
                <button
                  className="w-full flex items-center justify-between gap-4 p-6 text-left cursor-pointer"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <p className="text-dc-text font-semibold text-base">{faq.q}</p>
                  <div className={`w-7 h-7 flex items-center justify-center rounded-full shrink-0 transition-all duration-300 ${openFaq === i ? "bg-accent rotate-45" : "bg-dc-text/8"}`}>
                    <i className={`text-sm ${openFaq === i ? "ri-add-line text-black" : "ri-add-line text-dc-text/50"}`}></i>
                  </div>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-6">
                    <p className="text-dc-text/60 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-dc-surface border-t border-dc-text/5 py-24 px-6 md:px-10">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-accent text-xs font-mono tracking-widest mb-4">READY TO TALK?</p>
          <h2 className="text-3xl md:text-5xl font-bold text-dc-text mb-5">
            Get a real estimate<br />
            <span className="text-accent">in 48 hours</span>
          </h2>
          <p className="text-dc-text/55 text-base mb-8 max-w-xl mx-auto">
            Book a free 30-minute discovery call. We&apos;ll ask the right questions and send you a scoped estimate — no obligation, no pitch deck.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/#contact")}
              className="flex items-center justify-center gap-2 bg-accent text-black font-bold px-8 py-4 rounded-full hover:bg-white transition-colors duration-300 cursor-pointer whitespace-nowrap"
            >
              Book a Discovery Call
              <i className="ri-arrow-right-line"></i>
            </button>
            <Link
              to="/services/web-development"
              className="flex items-center justify-center gap-2 border border-dc-text/15 text-dc-text font-medium px-8 py-4 rounded-full hover:border-accent hover:text-accent transition-colors duration-300 cursor-pointer whitespace-nowrap"
            >
              Explore All Services
              <i className="ri-external-link-line"></i>
            </Link>
          </div>
        </div>
      </section>
      <FloatingBookCTA />
    </div>
  );
}