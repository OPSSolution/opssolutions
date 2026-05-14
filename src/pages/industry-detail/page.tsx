import { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getIndustryBySlug, industries } from "@/pages/industries/data";
import { usePageMeta } from "@/hooks/usePageMeta";
import FloatingBookCTA from "@/pages/home/components/FloatingBookCTA";

export default function IndustryDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const industry = slug ? getIndustryBySlug(slug) : undefined;

  usePageMeta({
    title: industry
      ? `${industry.name} Software Development | Solutions Studio`
      : "Industry Not Found | Solutions Studio",
    description: industry
      ? `${industry.description.slice(0, 155)}...`
      : "Industry page not found.",
    canonical: `https://devcraftstudio.io/industries/${slug}`,
    ogImage: industry?.heroImage,
  });

  useEffect(() => {
    if (!industry) return;
    const schema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://devcraftstudio.io" },
            { "@type": "ListItem", position: 2, name: "Industries", item: "https://devcraftstudio.io/industries" },
            { "@type": "ListItem", position: 3, name: industry.name, item: `https://devcraftstudio.io/industries/${slug}` },
          ],
        },
        {
          "@type": "Service",
          name: `${industry.name} Software Development — Solutions Studio`,
          description: industry.description,
          provider: { "@type": "Organization", name: "Solutions Studio", url: "https://devcraftstudio.io" },
          serviceType: `${industry.name} Software Development`,
          areaServed: "Worldwide",
          url: `https://devcraftstudio.io/industries/${slug}`,
          review: {
            "@type": "Review",
            author: { "@type": "Person", name: industry.testimonial.name, jobTitle: industry.testimonial.title },
            reviewBody: industry.testimonial.quote,
            reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
            publisher: { "@type": "Organization", name: industry.testimonial.company },
          },
        },
        {
          "@type": "FAQPage",
          mainEntity: industry.challenges.map((ch) => ({
            "@type": "Question",
            name: `How does Solutions solve ${ch.title} in ${industry.name}?`,
            acceptedAnswer: { "@type": "Answer", text: ch.body },
          })),
        },
      ],
    };
    const existing = document.getElementById("industry-detail-schema");
    if (existing) { existing.textContent = JSON.stringify(schema); } else {
      const script = document.createElement("script");
      script.id = "industry-detail-schema";
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    }
    return () => { document.getElementById("industry-detail-schema")?.remove(); };
  }, [industry, slug]);

  if (!industry) {
    return (
      <div className="bg-dc-bg min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-dc-text/40 text-sm font-mono mb-4">404</p>
          <h1 className="text-dc-text font-bold text-3xl mb-6">Industry not found</h1>
          <button
            onClick={() => navigate("/industries")}
            className="bg-accent text-black font-bold px-6 py-3 rounded-full cursor-pointer"
          >
            Browse All Industries
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-dc-bg min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-dc-bg/95 backdrop-blur-md border-b border-dc-text/8">
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-20 flex items-center justify-between">
          <button
            onClick={() => navigate("/industries")}
            className="flex items-center gap-2 text-dc-text/50 hover:text-dc-text transition-colors duration-200 cursor-pointer whitespace-nowrap"
          >
            <i className="ri-arrow-left-line text-base"></i>
            <span className="text-sm font-medium">All Industries</span>
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
            onClick={() => navigate("/contact")}
            className="hidden sm:flex items-center gap-2 bg-accent text-black text-sm font-bold px-5 py-2.5 rounded-full whitespace-nowrap hover:bg-white transition-colors duration-300 cursor-pointer"
          >
            Start a Project
            <i className="ri-arrow-right-line"></i>
          </button>
        </div>
      </header>

      {/* Hero Image */}
      <div className="relative w-full h-[420px] md:h-[520px] overflow-hidden">
        <img
          src={industry.heroImage}
          alt={industry.name}
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dc-bg via-dc-bg/55 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-dc-bg/75 via-transparent to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-6 md:px-10 w-full pb-16 pt-24">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-white/50 text-xs mb-5">
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
                <i className="ri-arrow-right-s-line"></i>
                <Link to="/industries" className="hover:text-white transition-colors">Industries</Link>
                <i className="ri-arrow-right-s-line"></i>
                <span className="text-accent">{industry.name}</span>
              </nav>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-accent/20 border border-accent/40">
                  <i className={`${industry.icon} text-accent text-lg`}></i>
                </div>
                <p className="text-accent text-xs font-mono tracking-widest">{industry.name.toUpperCase()}</p>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white max-w-3xl leading-tight">
                {industry.headline}
              </h1>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats + Description */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <p className="text-dc-text/65 text-base leading-relaxed mb-10">{industry.description}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {industry.stats.map((stat, i) => (
                <motion.div
                  key={i}
                  className="bg-dc-card border border-dc-text/8 rounded-2xl p-5 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                >
                  <p className="text-2xl font-bold text-accent font-mono">{stat.value}</p>
                  <p className="text-dc-text/50 text-xs mt-1 leading-tight">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Services used */}
          <div>
            <p className="text-dc-text/40 text-xs font-mono tracking-widest mb-5">SERVICES APPLIED</p>
            <div className="flex flex-col gap-3">
              {industry.servicesUsed.map((svc) => (
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
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-accent text-xs font-mono tracking-widest mb-3">DOMAIN CHALLENGES WE SOLVE</p>
            <h2 className="text-3xl md:text-4xl font-bold text-dc-text">
              The hard problems in <span className="text-accent">{industry.name}</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {industry.challenges.map((ch, i) => (
              <motion.div
                key={i}
                className="bg-dc-card border border-dc-text/8 rounded-2xl p-7 hover:border-accent/20 transition-all duration-300"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-accent/10 border border-accent/20 mb-5">
                  <span className="text-accent font-bold text-sm font-mono">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="text-dc-text font-bold text-lg mb-3">{ch.title}</h3>
                <p className="text-dc-text/55 text-sm leading-relaxed">{ch.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 px-6 md:px-10 border-t border-dc-text/5">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-accent text-xs font-mono tracking-widest mb-3">
              TYPICAL TECH STACK FOR {industry.name.toUpperCase()}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-dc-text">
              Tools we bring to <span className="text-accent">{industry.name}</span> projects
            </h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {industry.techStack.map((layer, i) => (
              <motion.div
                key={i}
                className="bg-dc-card border border-dc-text/8 rounded-2xl p-6 hover:border-accent/20 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
              >
                <p className="text-dc-text/40 text-xs font-mono tracking-widest mb-4">{layer.category.toUpperCase()}</p>
                <div className="flex flex-col gap-2.5">
                  {layer.items.map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0"></span>
                      <span className="text-dc-text/70 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="bg-dc-surface border-t border-dc-text/5 py-20 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-accent text-xs font-mono tracking-widest mb-3">CASE STUDIES</p>
            <h2 className="text-3xl md:text-4xl font-bold text-dc-text">
              Real {industry.name} work, <span className="text-accent">real results</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {industry.caseStudies.map((cs, i) => (
              <motion.article
                key={i}
                className="bg-dc-card border border-dc-text/8 rounded-2xl overflow-hidden hover:border-accent/25 transition-all duration-300 cursor-pointer group"
                whileHover={{ y: -4 }}
                onClick={() => navigate(`/case-study/${cs.slug}`)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="relative w-full h-52 overflow-hidden">
                  <img src={cs.image} alt={cs.title} className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-dc-card via-transparent to-transparent" />
                </div>
                <div className="p-7">
                  <h3 className="text-dc-text font-bold text-lg mb-3 group-hover:text-accent transition-colors duration-300">{cs.title}</h3>
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
          <div className="mt-8 text-center">
            <Link
              to="/case-studies"
              className="inline-flex items-center gap-2 border border-dc-text/15 text-dc-text font-medium px-7 py-3.5 rounded-full hover:border-accent hover:text-accent transition-colors duration-300 cursor-pointer"
            >
              View All Case Studies
              <i className="ri-arrow-right-line"></i>
            </Link>
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
            &ldquo;{industry.testimonial.quote}&rdquo;
          </p>
          <div className="flex items-center justify-center gap-4">
            <img
              src={industry.testimonial.avatar}
              alt={industry.testimonial.name}
              className="w-12 h-12 rounded-full object-cover object-top"
            />
            <div className="text-left">
              <p className="text-dc-text font-semibold text-sm">{industry.testimonial.name}</p>
              <p className="text-dc-text/50 text-xs">{industry.testimonial.title} &middot; {industry.testimonial.company}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Industries */}
      <section className="bg-dc-surface border-t border-dc-text/5 py-16 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <p className="text-dc-text/40 text-xs font-mono tracking-widest mb-8">ALSO EXPLORE</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {industries
              .filter((ind) => ind.slug !== slug)
              .slice(0, 5)
              .map((ind) => (
                <Link
                  key={ind.slug}
                  to={`/industries/${ind.slug}`}
                  className="flex flex-col items-center gap-2.5 p-5 bg-dc-card border border-dc-text/8 rounded-2xl hover:border-accent/30 hover:bg-accent/5 transition-all duration-300 group text-center cursor-pointer"
                >
                  <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-dc-text/5 group-hover:bg-accent/15 transition-colors duration-300">
                    <i className={`${ind.icon} text-dc-text/40 group-hover:text-accent text-base transition-colors duration-300`}></i>
                  </div>
                  <span className="text-dc-text/60 group-hover:text-dc-text text-xs font-semibold transition-colors duration-300">{ind.name}</span>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 md:px-10 border-t border-dc-text/5">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-accent text-xs font-mono tracking-widest mb-4">LET&apos;S BUILD IN {industry.name.toUpperCase()}</p>
          <h2 className="text-3xl md:text-4xl font-bold text-dc-text mb-5">
            Ready to start your{" "}
            <span className="text-accent">{industry.name} project?</span>
          </h2>
          <p className="text-dc-text/55 text-base mb-8 max-w-xl mx-auto">
            Book a free 30-minute discovery call. We&apos;ll ask the right domain-specific questions and give you a scoped estimate within 48 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/contact")}
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

      <FloatingBookCTA />
    </div>
  );
}