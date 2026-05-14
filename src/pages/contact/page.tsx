import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { usePageMeta } from "@/hooks/usePageMeta";

const offices = [
  {
    city: "San Francisco",
    country: "United States",
    address: "548 Market St, Suite 29001, San Francisco, CA 94104",
    phone: "+1 (415) 800-4200",
    email: "sf@devcraftstudio.io",
    timezone: "PST / UTC-8",
    flag: "ri-map-pin-line",
    mapSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.2051695706016!2d-122.4009!3d37.7906!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085806b0b0b0b0b%3A0x0!2sSan+Francisco%2C+CA!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus",
  },
  {
    city: "London",
    country: "United Kingdom",
    address: "20 Farringdon Rd, London, EC1M 3HE",
    phone: "+44 20 3808 9400",
    email: "london@devcraftstudio.io",
    timezone: "GMT / UTC+0",
    flag: "ri-map-pin-line",
    mapSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2483.1!2d-0.105!3d51.52!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sLondon!5e0!3m2!1sen!2suk!4v1700000000001!5m2!1sen!2suk",
  },
  {
    city: "Singapore",
    country: "Singapore",
    address: "1 Raffles Place, #20-61 One Raffles Place, Singapore 048616",
    phone: "+65 6977 4800",
    email: "sg@devcraftstudio.io",
    timezone: "SGT / UTC+8",
    flag: "ri-map-pin-line",
    mapSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8!2d103.851!3d1.284!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sSingapore!5e0!3m2!1sen!2ssg!4v1700000000002!5m2!1sen!2ssg",
  },
];

const services = [
  "Web Development",
  "Mobile Development",
  "Cloud Architecture",
  "UI/UX Design",
  "AI & ML Integration",
  "DevOps & CI/CD",
  "Not sure yet",
];

const budgets = [
  "Under $25k",
  "$25k – $60k",
  "$60k – $150k",
  "$150k – $300k",
  "$300k+",
  "Ongoing retainer",
];

const timelines = ["ASAP (< 4 weeks)", "1–3 months", "3–6 months", "6–12 months", "Flexible"];

export default function ContactPage() {
  const navigate = useNavigate();
  const [activeOffice, setActiveOffice] = useState(0);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [submitState, setSubmitState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const formRef = useRef<HTMLFormElement>(null);

  usePageMeta({
    title: "Contact — Start a Project with Solutions Studio",
    description: "Get in touch with Solutions Studio. Send your project brief and receive a scoped estimate within 48 hours. Offices in San Francisco, London and Singapore.",
    canonical: "https://devcraftstudio.io/contact",
    ogImage: "https://readdy.ai/api/search-image?query=modern%20tech%20startup%20office%20contact%20page%20three%20global%20offices%20map%20dark%20minimal%20professional%20studio%20interior&width=1200&height=630&seq=og_contact_v2&orientation=landscape",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Schema.org LocalBusiness + ContactPage
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "ContactPage",
          "name": "Contact Solutions Studio",
          "description": "Contact Solutions Studio for web development, mobile apps, AI integration, cloud architecture and UI/UX design services",
          "url": "https://devcraftstudio.io/contact",
          "mainEntity": {
            "@type": "Organization",
            "name": "Solutions Studio",
            "url": "https://devcraftstudio.io",
            "logo": "https://static.readdy.ai/image/27f36426f3cab7c4efebb6eb9e24cb04/3338f66b55262222ff9be144548b1ced.png",
            "contactPoint": [
              { "@type": "ContactPoint", "telephone": "+1-415-800-4200", "contactType": "customer service", "areaServed": "US", "availableLanguage": "English" },
              { "@type": "ContactPoint", "telephone": "+44-20-3808-9400", "contactType": "customer service", "areaServed": "GB", "availableLanguage": "English" },
              { "@type": "ContactPoint", "telephone": "+65-6977-4800", "contactType": "customer service", "areaServed": "SG", "availableLanguage": "English" },
            ],
            "address": [
              { "@type": "PostalAddress", "streetAddress": "548 Market St, Suite 29001", "addressLocality": "San Francisco", "addressRegion": "CA", "postalCode": "94104", "addressCountry": "US" },
              { "@type": "PostalAddress", "streetAddress": "20 Farringdon Rd", "addressLocality": "London", "postalCode": "EC1M 3HE", "addressCountry": "GB" },
              { "@type": "PostalAddress", "streetAddress": "1 Raffles Place, #20-61", "addressLocality": "Singapore", "postalCode": "048616", "addressCountry": "SG" },
            ],
          },
        },
      ],
    };
    const el = document.getElementById("contact-schema");
    if (el) { el.textContent = JSON.stringify(schema); } else {
      const script = document.createElement("script");
      script.id = "contact-schema";
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    }
    return () => { document.getElementById("contact-schema")?.remove(); };
  }, []);

  const toggleService = (svc: string) => {
    setSelectedServices((prev) =>
      prev.includes(svc) ? prev.filter((s) => s !== svc) : [...prev, svc]
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitState === "loading") return;
    setSubmitState("loading");

    const form = e.currentTarget;
    const data = new URLSearchParams();
    const formData = new FormData(form);
    formData.forEach((value, key) => {
      if (key !== "services") data.append(key, value.toString());
    });
    if (selectedServices.length > 0) {
      data.append("services", selectedServices.join(", "));
    }

    try {
      const res = await fetch("https://readdy.ai/api/form/d82asct2rv787lut0r2g", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: data.toString(),
      });
      if (res.ok) {
        setSubmitState("success");
        form.reset();
        setSelectedServices([]);
      } else {
        setSubmitState("error");
      }
    } catch {
      setSubmitState("error");
    }
  };

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
          <div className="hidden sm:flex items-center gap-2 text-dc-text/50 text-sm">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse-slow inline-block"></span>
            We respond in &lt; 48 hours
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-14 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="max-w-3xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-accent text-xs font-mono tracking-widest mb-4">GET IN TOUCH</p>
            <h1 className="text-5xl md:text-7xl font-bold text-dc-text leading-[1.0] mb-5">
              Let&apos;s build<br />
              <span className="text-accent">something great.</span>
            </h1>
            <p className="text-dc-text/65 text-lg leading-relaxed max-w-xl">
              Tell us about your project. We&apos;ll review it, ask the right questions, and get back to you with a scoped estimate within 48 hours. No pitch decks. No fluff.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-6 md:px-10 pb-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Form */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            {submitState === "success" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-dc-card border border-accent/25 rounded-3xl p-12 text-center"
              >
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-accent/15 border border-accent/30 mx-auto mb-6">
                  <i className="ri-check-line text-3xl text-accent"></i>
                </div>
                <h2 className="text-dc-text font-bold text-2xl mb-3">Message received!</h2>
                <p className="text-dc-text/65 text-base leading-relaxed max-w-sm mx-auto mb-8">
                  We&apos;ve got your inquiry and will have a real human review it within a few hours. Expect a reply with scoped next steps within 48 hours.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => setSubmitState("idle")}
                    className="flex items-center justify-center gap-2 border border-dc-text/15 text-dc-text font-medium px-6 py-3 rounded-full hover:border-accent hover:text-accent transition-colors duration-300 cursor-pointer whitespace-nowrap text-sm"
                  >
                    Send another message
                  </button>
                  <Link
                    to="/case-studies"
                    className="flex items-center justify-center gap-2 bg-accent text-black font-bold px-6 py-3 rounded-full hover:bg-white transition-colors duration-300 cursor-pointer whitespace-nowrap text-sm"
                  >
                    Browse case studies
                    <i className="ri-arrow-right-line"></i>
                  </Link>
                </div>
              </motion.div>
            ) : (
              <form
                ref={formRef}
                id="contact-inquiry-form"
                data-readdy-form
                onSubmit={handleSubmit}
                className="bg-dc-card border border-dc-text/8 rounded-3xl p-8 md:p-10 flex flex-col gap-7"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-dc-text/70 text-xs font-semibold tracking-wide">First Name *</label>
                    <input
                      name="first_name"
                      type="text"
                      required
                      placeholder="Alex"
                      className="bg-dc-input border border-dc-text/10 rounded-xl px-4 py-3 text-dc-text text-sm placeholder:text-dc-text/35 focus:outline-none focus:border-accent/40 transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-dc-text/70 text-xs font-semibold tracking-wide">Last Name *</label>
                    <input
                      name="last_name"
                      type="text"
                      required
                      placeholder="Johnson"
                      className="bg-dc-input border border-dc-text/10 rounded-xl px-4 py-3 text-dc-text text-sm placeholder:text-dc-text/35 focus:outline-none focus:border-accent/40 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-dc-text/70 text-xs font-semibold tracking-wide">Work Email *</label>
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="alex@company.com"
                      className="bg-dc-input border border-dc-text/10 rounded-xl px-4 py-3 text-dc-text text-sm placeholder:text-dc-text/35 focus:outline-none focus:border-accent/40 transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-dc-text/70 text-xs font-semibold tracking-wide">Company</label>
                    <input
                      name="company"
                      type="text"
                      placeholder="Acme Inc."
                      className="bg-dc-input border border-dc-text/10 rounded-xl px-4 py-3 text-dc-text text-sm placeholder:text-dc-text/35 focus:outline-none focus:border-accent/40 transition-colors"
                    />
                  </div>
                </div>

                {/* Services multi-select */}
                <div className="flex flex-col gap-3">
                  <label className="text-dc-text/70 text-xs font-semibold tracking-wide">Services Needed</label>
                  <div className="flex flex-wrap gap-2">
                    {services.map((svc) => {
                      const isActive = selectedServices.includes(svc);
                      return (
                        <button
                          key={svc}
                          type="button"
                          onClick={() => toggleService(svc)}
                          className={`px-3.5 py-2 rounded-lg text-xs font-medium border transition-all duration-250 cursor-pointer whitespace-nowrap ${
                            isActive
                              ? "bg-accent/15 border-accent/50 text-accent"
                              : "bg-dc-input border-dc-text/10 text-dc-text/60 hover:border-dc-text/20"
                          }`}
                        >
                          {isActive && <i className="ri-check-line mr-1 text-xs"></i>}
                          {svc}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-dc-text/70 text-xs font-semibold tracking-wide">Budget Range</label>
                    <select
                      name="budget"
                      className="bg-dc-input border border-dc-text/10 rounded-xl px-4 py-3 text-dc-text text-sm focus:outline-none focus:border-accent/40 transition-colors cursor-pointer appearance-none"
                    >
                      <option value="">Select range...</option>
                      {budgets.map((b) => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-dc-text/70 text-xs font-semibold tracking-wide">Timeline</label>
                    <select
                      name="timeline"
                      className="bg-dc-input border border-dc-text/10 rounded-xl px-4 py-3 text-dc-text text-sm focus:outline-none focus:border-accent/40 transition-colors cursor-pointer appearance-none"
                    >
                      <option value="">Select timeline...</option>
                      {timelines.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-dc-text/70 text-xs font-semibold tracking-wide">Tell us about your project *</label>
                  <textarea
                    name="message"
                    required
                    maxLength={500}
                    rows={5}
                    placeholder="Briefly describe what you're building, any existing tech stack, key challenges, and what success looks like for you..."
                    className="bg-dc-input border border-dc-text/10 rounded-xl px-4 py-3 text-dc-text text-sm placeholder:text-dc-text/35 focus:outline-none focus:border-accent/40 transition-colors resize-none leading-relaxed"
                  />
                  <p className="text-dc-text/35 text-xs text-right">Max 500 characters</p>
                </div>

                {submitState === "error" && (
                  <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                    <i className="ri-error-warning-line text-red-400 text-sm"></i>
                    <p className="text-red-400 text-sm">Something went wrong. Please try again or email us directly.</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitState === "loading"}
                  className="flex items-center justify-center gap-2 bg-accent text-black font-bold px-8 py-4 rounded-full hover:bg-white transition-colors duration-300 cursor-pointer whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitState === "loading" ? (
                    <>
                      <i className="ri-loader-4-line animate-spin text-base"></i>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Project Brief
                      <i className="ri-send-plane-line text-base"></i>
                    </>
                  )}
                </button>

                <p className="text-dc-text/35 text-xs text-center">
                  We respond to every inquiry within 48 hours. No spam, no automated responses.
                </p>
              </form>
            )}
          </motion.div>

          {/* Sidebar info */}
          <motion.div
            className="lg:col-span-2 flex flex-col gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7 }}
          >
            {/* Response guarantee */}
            <div className="bg-dc-card border border-dc-text/8 rounded-2xl p-6">
              <p className="text-accent text-xs font-mono tracking-widest mb-4">WHAT HAPPENS NEXT</p>
              <div className="flex flex-col gap-5">
                {[
                  { num: "01", title: "We review your brief", body: "A senior engineer reads your message, not a bot." },
                  { num: "02", title: "Discovery call scheduled", body: "30 minutes. We ask the technical and business questions that matter." },
                  { num: "03", title: "Scoped estimate delivered", body: "Detailed proposal with timeline, milestones, and fixed price — within 48hrs." },
                  { num: "04", title: "Kickoff", body: "Discovery sprint starts. No waiting, no committee approvals." },
                ].map((step) => (
                  <div key={step.num} className="flex items-start gap-4">
                    <span className="text-accent font-bold font-mono text-sm shrink-0 mt-0.5">{step.num}</span>
                    <div>
                      <p className="text-dc-text font-semibold text-sm">{step.title}</p>
                      <p className="text-dc-text/55 text-xs mt-0.5 leading-relaxed">{step.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust signals */}
            <div className="bg-dc-card border border-dc-text/8 rounded-2xl p-6">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: "ri-shield-check-line", label: "NDA on request" },
                  { icon: "ri-time-line", label: "Reply in < 48hrs" },
                  { icon: "ri-global-line", label: "28 countries served" },
                  { icon: "ri-star-line", label: "4.9/5 client rating" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2.5">
                    <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-accent/10 shrink-0">
                      <i className={`${item.icon} text-accent text-sm`}></i>
                    </div>
                    <p className="text-dc-text/70 text-xs font-medium leading-tight">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Offices */}
            <div className="bg-dc-card border border-dc-text/8 rounded-2xl overflow-hidden">
              <div className="flex border-b border-dc-text/8">
                {offices.map((office, i) => (
                  <button
                    key={office.city}
                    onClick={() => setActiveOffice(i)}
                    className={`flex-1 py-3 text-xs font-semibold transition-all duration-250 cursor-pointer border-r border-dc-text/8 last:border-r-0 ${
                      activeOffice === i
                        ? "bg-accent/10 text-accent"
                        : "text-dc-text/50 hover:text-dc-text"
                    }`}
                  >
                    {office.city}
                  </button>
                ))}
              </div>
              <div className="p-6">
                <div className="flex flex-col gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 flex items-center justify-center shrink-0 mt-0.5">
                      <i className="ri-map-pin-line text-accent text-sm"></i>
                    </div>
                    <p className="text-dc-text/70 text-xs leading-relaxed">{offices[activeOffice].address}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 flex items-center justify-center shrink-0">
                      <i className="ri-phone-line text-accent text-sm"></i>
                    </div>
                    <a href={`tel:${offices[activeOffice].phone}`} className="text-dc-text/70 text-xs hover:text-accent transition-colors">
                      {offices[activeOffice].phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 flex items-center justify-center shrink-0">
                      <i className="ri-mail-line text-accent text-sm"></i>
                    </div>
                    <a href={`mailto:${offices[activeOffice].email}`} className="text-dc-text/70 text-xs hover:text-accent transition-colors">
                      {offices[activeOffice].email}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 flex items-center justify-center shrink-0">
                      <i className="ri-time-line text-accent text-sm"></i>
                    </div>
                    <p className="text-dc-text/70 text-xs">{offices[activeOffice].timezone}</p>
                  </div>
                </div>

                {/* Map */}
                <div className="mt-5 rounded-xl overflow-hidden border border-dc-text/8 h-44">
                  <iframe
                    title={`${offices[activeOffice].city} office map`}
                    src={offices[activeOffice].mapSrc}
                    className="w-full h-full"
                    style={{ border: 0 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ strip */}
      <section className="bg-dc-surface border-t border-dc-text/8 py-20 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <p className="text-accent text-xs font-mono tracking-widest mb-10 text-center">BEFORE YOU REACH OUT</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { q: "Do you sign NDAs?", a: "Yes, on request before any calls or information sharing. We take client confidentiality seriously." },
              { q: "Can I see more case studies?", a: "Absolutely — browse /case-studies for all our public work, or ask us to share relevant non-public case studies during the call." },
              { q: "What if I just have a rough idea?", a: "Perfect. Discovery calls are designed exactly for that. We help you shape the brief — you don't need a perfect spec." },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="bg-dc-card border border-dc-text/8 rounded-2xl p-6"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <h4 className="text-dc-text font-bold text-sm mb-3">
                  <a href="#contact-inquiry-form" className="hover:text-accent transition-colors">{item.q}</a>
                </h4>
                <p className="text-dc-text/65 text-xs leading-relaxed">{item.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}