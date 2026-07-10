import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { services, getServiceBySlug } from "./data";
import ServiceHero from "./components/ServiceHero";
import ServiceApproach from "./components/ServiceApproach";
import ServiceTechStack from "./components/ServiceTechStack";
import ServiceIndustries from "./components/ServiceIndustries";
import ServiceCaseStudies from "./components/ServiceCaseStudies";
import ServiceTestimonials from "./components/ServiceTestimonials";
import ServicePricing from "./components/ServicePricing";

export default function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const service = getServiceBySlug(slug ?? "");

  // Schema.org: Service + AggregateRating + Review markup
  useEffect(() => {
    if (!service) return;
    const schema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Service",
          "name": `${service.title} - Solutions Studio`,
          "description": service.description,
          "provider": {
            "@type": "Organization",
            "name": "Solutions Studio",
            "url": "https://devcraftstudio.io",
          },
          "serviceType": service.title,
          "url": `https://devcraftstudio.io/services/${service.slug}`,
          "offers": service.pricing.map((tier) => ({
            "@type": "Offer",
            "name": `${service.title} — ${tier.tier}`,
            "description": tier.ideal,
            "priceCurrency": "USD",
            "price": tier.range,
            "eligibleCustomerType": "https://schema.org/Business",
          })),
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "reviewCount": service.testimonials.length,
            "bestRating": "5",
            "worstRating": "1",
          },
          "review": service.testimonials.map((t) => ({
            "@type": "Review",
            "author": { "@type": "Person", "name": t.name, "jobTitle": t.title },
            "reviewBody": t.quote,
            "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
            "publisher": { "@type": "Organization", "name": t.company },
          })),
        },
      ],
    };
    const scriptId = "service-detail-schema";
    const el = document.getElementById(scriptId);
    if (el) { el.textContent = JSON.stringify(schema); } else {
      const script = document.createElement("script");
      script.id = scriptId;
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    }
    return () => { document.getElementById(scriptId)?.remove(); };
  }, [service, location.pathname]);

  if (!service) {
    return (
      <div className="min-h-screen bg-dc-bg flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-dc-text mb-4">Service not found</h1>
          <button
            onClick={() => navigate("/")}
            className="text-accent hover:underline cursor-pointer"
          >
            Back to home
          </button>
        </div>
      </div>
    );
  }

  const currentIndex = services.findIndex((s) => s.slug === slug);
  const nextService = services[(currentIndex + 1) % services.length];

  return (
    <div className="bg-dc-bg min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-dc-bg/95 backdrop-blur-md border-b border-dc-text/5">
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

      {/* Service Navigation Strip */}
      <div className="pt-20 border-b border-dc-text/5 bg-dc-surface overflow-x-auto">
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex gap-1 py-3">
          {services.map((s) => (
            <Link
              key={s.slug}
              to={`/services/${s.slug}`}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                s.slug === slug
                  ? "bg-accent text-black"
                  : "text-dc-text/40 hover:text-dc-text hover:bg-dc-text/5"
              }`}
            >
              <i className={`${s.icon} text-sm`}></i>
              {s.title}
            </Link>
          ))}
        </div>
      </div>

      {/* Hero */}
      <ServiceHero service={service} />

      {/* Approach */}
      <ServiceApproach service={service} />

      {/* Tech Stack */}
      <ServiceTechStack service={service} />

      {/* Industries */}
      <ServiceIndustries service={service} />

      {/* Case Studies */}
      <ServiceCaseStudies service={service} />

      {/* Testimonials */}
      <ServiceTestimonials service={service} />

      {/* Pricing */}
      <ServicePricing service={service} />

      {/* Next Service */}
      <section className="px-6 md:px-10 max-w-7xl mx-auto pb-24">
        <motion.div
          className="bg-dc-card border border-dc-text/5 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div>
            <p className="text-dc-text/30 text-xs font-mono tracking-widest mb-2">NEXT SERVICE</p>
            <h3 className="text-dc-text font-bold text-2xl">{nextService.title}</h3>
            <p className="text-dc-text/40 text-sm mt-1">{nextService.subtitle}</p>
          </div>
          <Link
            to={`/services/${nextService.slug}`}
            className="flex items-center gap-2 bg-accent text-black font-bold px-7 py-4 rounded-full hover:bg-white transition-colors duration-300 cursor-pointer whitespace-nowrap shrink-0"
          >
            Explore {nextService.title}
            <i className="ri-arrow-right-line"></i>
          </Link>
        </motion.div>
      </section>

      {/* Footer CTA */}
      <section className="bg-dc-surface py-20 px-6 md:px-10">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-accent text-xs font-mono tracking-widest mb-4">READY TO BUILD?</p>
          <h2 className="text-3xl md:text-5xl font-bold text-dc-text mb-6">
            Let&apos;s talk about your project
          </h2>
          <p className="text-dc-text/40 text-base mb-8 max-w-xl mx-auto">
            Book a free 30-minute discovery call. No pitch deck, no pressure — just a direct conversation about your goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/#contact")}
              className="flex items-center justify-center gap-2 bg-accent text-black font-bold px-8 py-4 rounded-full hover:bg-white transition-colors duration-300 cursor-pointer whitespace-nowrap"
            >
              Book a Discovery Call
              <i className="ri-arrow-right-line"></i>
            </button>
            <button
              onClick={() => navigate("/case-study/nexashop-platform")}
              className="flex items-center justify-center gap-2 border border-dc-text/15 text-dc-text font-medium px-8 py-4 rounded-full hover:border-accent hover:text-accent transition-colors duration-300 cursor-pointer whitespace-nowrap"
            >
              View Our Work
              <i className="ri-external-link-line"></i>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}