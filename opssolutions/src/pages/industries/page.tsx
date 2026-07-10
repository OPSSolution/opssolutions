import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { industries } from "./data";

export default function IndustriesPage() {
  const navigate = useNavigate();
  const [activeSlug, setActiveSlug] = useState(industries[0].slug);
  const active = industries.find((i) => i.slug === activeSlug) ?? industries[0];

  // Schema.org: Service (industry vertical) + Review + BreadcrumbList
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://devcraftstudio.io" },
            { "@type": "ListItem", "position": 2, "name": "Industries", "item": "https://devcraftstudio.io/industries" },
            { "@type": "ListItem", "position": 3, "name": active.name, "item": `https://devcraftstudio.io/industries#${active.slug}` },
          ],
        },
        {
          "@type": "Service",
          "name": `${active.name} Software Development — Solutions Studio`,
          "description": active.description,
          "provider": {
            "@type": "Organization",
            "name": "Solutions Studio",
            "url": "https://devcraftstudio.io",
          },
          "serviceType": `${active.name} Software Development`,
          "areaServed": "Worldwide",
          "url": `https://devcraftstudio.io/industries#${active.slug}`,
          "review": {
            "@type": "Review",
            "author": {
              "@type": "Person",
              "name": active.testimonial.name,
              "jobTitle": active.testimonial.title,
            },
            "reviewBody": active.testimonial.quote,
            "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
            "publisher": { "@type": "Organization", "name": active.testimonial.company },
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "reviewCount": "1",
            "bestRating": "5",
          },
        },
        {
          "@type": "FAQPage",
          "mainEntity": active.challenges.map((ch) => ({
            "@type": "Question",
            "name": `How does Solutions solve ${ch.title} challenges in ${active.name}?`,
            "acceptedAnswer": { "@type": "Answer", "text": ch.body },
          })),
        },
      ],
    };
    const el = document.getElementById("industries-schema");
    if (el) { el.textContent = JSON.stringify(schema); } else {
      const script = document.createElement("script");
      script.id = "industries-schema";
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    }
    return () => { document.getElementById("industries-schema")?.remove(); };
  }, [active]);

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
            Start a Project
            <i className="ri-arrow-right-line"></i>
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-16 px-6 md:px-10 border-b border-dc-text/5">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="max-w-3xl mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-accent text-xs font-mono tracking-widest mb-4">INDUSTRIES WE SERVE</p>
            <h1 className="text-5xl md:text-7xl font-bold text-dc-text leading-[1.0] mb-5">
              Deep domain<br />
              <span className="text-accent">expertise.</span>
            </h1>
            <p className="text-dc-text/55 text-lg leading-relaxed">
              We&apos;re not generalists. Every industry has its own compliance requirements, user expectations, and technical constraints. We&apos;ve spent years building deep expertise in six verticals — and it shows in the work.
            </p>
          </motion.div>

          {/* Industry selector */}
          <div className="flex flex-wrap gap-2 items-center">
            {industries.map((ind, i) => (
              <motion.button
                key={ind.slug}
                onClick={() => setActiveSlug(ind.slug)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm font-medium transition-all duration-300 cursor-pointer whitespace-nowrap ${
                  activeSlug === ind.slug
                    ? "bg-accent border-accent text-black"
                    : "bg-dc-card border-dc-text/8 text-dc-text/60 hover:border-dc-text/20 hover:text-dc-text"
                }`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <i className={`${ind.icon} text-sm`}></i>
                {ind.name}
              </motion.button>
            ))}
            <Link
              to={`/industries/${activeSlug}`}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-accent/35 text-accent text-sm font-medium hover:bg-accent/10 transition-all duration-300 cursor-pointer whitespace-nowrap ml-auto"
            >
              View Full Page
              <i className="ri-external-link-line text-sm"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* Industry Detail Panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSlug}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Industry Hero Image */}
          <div className="relative w-full h-[360px] md:h-[480px] overflow-hidden">
            <img
              src={active.heroImage}
              alt={active.name}
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dc-bg via-dc-bg/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-dc-bg/70 via-transparent to-transparent" />
            <div className="absolute inset-0 flex items-end">
              <div className="max-w-7xl mx-auto px-6 md:px-10 w-full pb-14">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-accent/20 border border-accent/30">
                    <i className={`${active.icon} text-accent text-lg`}></i>
                  </div>
                  <p className="text-accent text-xs font-mono tracking-widest">{active.name.toUpperCase()}</p>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold text-white max-w-2xl leading-tight">
                  {active.headline}
                </h2>
              </div>
            </div>
          </div>

          {/* Stats + Description */}
          <section className="max-w-7xl mx-auto px-6 md:px-10 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <p className="text-dc-text/65 text-base leading-relaxed mb-8">{active.description}</p>
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {active.stats.map((stat, i) => (
                    <div key={i} className="bg-dc-card border border-dc-text/8 rounded-2xl p-5 text-center">
                      <p className="text-2xl font-bold text-accent font-mono">{stat.value}</p>
                      <p className="text-dc-text/50 text-xs mt-1">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Services used */}
              <div>
                <p className="text-dc-text/40 text-xs font-mono tracking-widest mb-5">SERVICES APPLIED</p>
                <div className="flex flex-col gap-3">
                  {active.servicesUsed.map((svc) => (
                    <Link
                      key={svc.slug}
                      to={`/services/${svc.slug}`}
                      className="flex items-start gap-3 p-4 bg-dc-card border border-dc-text/8 rounded-xl hover:border-accent/30 transition-all duration-300 cursor-pointer group"
                    >
                      <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-accent/10 shrink-0 mt-0.5">
                        <i className={`${svc.icon} text-accent text-sm`}></i>
                      </div>
                      <div>
                        <p className="text-dc-text text-sm font-semibold group-hover:text-accent transition-colors duration-300">{svc.title}</p>
                        <p className="text-dc-text/45 text-xs mt-0.5 leading-relaxed">{svc.relevance}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Challenges */}
          <section className="bg-dc-surface border-t border-dc-text/5 py-20 px-6 md:px-10">
            <div className="max-w-7xl mx-auto">
              <p className="text-accent text-xs font-mono tracking-widest mb-10">DOMAIN CHALLENGES WE SOLVE</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {active.challenges.map((ch, i) => (
                  <div key={i} className="bg-dc-card border border-dc-text/8 rounded-2xl p-7">
                    <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-accent/10 border border-accent/20 mb-5">
                      <span className="text-accent font-bold text-sm font-mono">{String(i + 1).padStart(2, "0")}</span>
                    </div>
                    <h3 className="text-dc-text font-bold text-lg mb-3">{ch.title}</h3>
                    <p className="text-dc-text/55 text-sm leading-relaxed">{ch.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Tech Stack */}
          <section className="py-20 px-6 md:px-10 border-t border-dc-text/5">
            <div className="max-w-7xl mx-auto">
              <p className="text-accent text-xs font-mono tracking-widest mb-10">TYPICAL TECH STACK FOR {active.name.toUpperCase()}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                {active.techStack.map((layer, i) => (
                  <div key={i} className="bg-dc-card border border-dc-text/8 rounded-2xl p-6">
                    <p className="text-dc-text/40 text-xs font-mono tracking-widest mb-4">{layer.category.toUpperCase()}</p>
                    <div className="flex flex-col gap-2">
                      {layer.items.map((item) => (
                        <div key={item} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0"></span>
                          <span className="text-dc-text/70 text-xs">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Case Studies */}
          <section className="bg-dc-surface border-t border-dc-text/5 py-20 px-6 md:px-10">
            <div className="max-w-7xl mx-auto">
              <p className="text-accent text-xs font-mono tracking-widest mb-10">CASE STUDIES IN {active.name.toUpperCase()}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {active.caseStudies.map((cs, i) => (
                  <motion.article
                    key={i}
                    className="bg-dc-card border border-dc-text/8 rounded-2xl overflow-hidden hover:border-accent/25 transition-all duration-300 cursor-pointer group"
                    whileHover={{ y: -4 }}
                    onClick={() => navigate(`/case-study/${cs.slug}`)}
                  >
                    <div className="relative w-full h-48 overflow-hidden">
                      <img src={cs.image} alt={cs.title} className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-dc-card via-transparent to-transparent" />
                    </div>
                    <div className="p-7">
                      <h3 className="text-dc-text font-bold text-lg mb-2 group-hover:text-accent transition-colors duration-300">{cs.title}</h3>
                      <div className="flex items-start gap-2 mb-4 bg-accent/8 border border-accent/15 rounded-xl p-3">
                        <i className="ri-check-double-line text-accent text-sm mt-0.5 shrink-0"></i>
                        <p className="text-accent/80 text-sm font-medium">{cs.result}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {cs.tags.map((tag) => (
                          <span key={tag} className="text-xs font-mono text-dc-text/40 bg-dc-text/5 px-2.5 py-1 rounded-md">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>
          </section>

          {/* Testimonial */}
          <section className="py-20 px-6 md:px-10 border-t border-dc-text/5">
            <div className="max-w-4xl mx-auto text-center">
              <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-accent/10 border border-accent/20 mx-auto mb-8">
                <i className="ri-double-quotes-l text-3xl text-accent"></i>
              </div>
              <p className="text-dc-text text-xl md:text-2xl font-medium leading-relaxed mb-8 max-w-3xl mx-auto">
                &ldquo;{active.testimonial.quote}&rdquo;
              </p>
              <div className="flex items-center justify-center gap-4">
                <img
                  src={active.testimonial.avatar}
                  alt={active.testimonial.name}
                  className="w-12 h-12 rounded-full object-cover object-top"
                />
                <div className="text-left">
                  <p className="text-dc-text font-semibold text-sm">{active.testimonial.name}</p>
                  <p className="text-dc-text/50 text-xs">{active.testimonial.title} · {active.testimonial.company}</p>
                </div>
              </div>
            </div>
          </section>
        </motion.div>
      </AnimatePresence>

      {/* CTA */}
      <section className="bg-dc-surface border-t border-dc-text/5 py-24 px-6 md:px-10">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-accent text-xs font-mono tracking-widest mb-4">LET&apos;S BUILD IN {active.name.toUpperCase()}</p>
          <h2 className="text-3xl md:text-4xl font-bold text-dc-text mb-5">
            Ready to start your{" "}
            <span className="text-accent">{active.name} project?</span>
          </h2>
          <p className="text-dc-text/55 text-base mb-8 max-w-xl mx-auto">
            Book a free 30-minute discovery call. We&apos;ll ask the right domain-specific questions and give you a scoped estimate within 48 hours.
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
              to="/pricing"
              className="flex items-center justify-center gap-2 border border-dc-text/15 text-dc-text font-medium px-8 py-4 rounded-full hover:border-accent hover:text-accent transition-colors duration-300 cursor-pointer whitespace-nowrap"
            >
              View Pricing
              <i className="ri-price-tag-3-line"></i>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}