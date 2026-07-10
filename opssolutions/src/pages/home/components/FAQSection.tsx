import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    q: "What does your development process look like from start to finish?",
    a: "We run in two-week Agile sprints. Every project starts with a Discovery Sprint — 5 days of requirements gathering, wireframing, and architecture design. After sign-off, we move into development sprints with daily standups, a shared Slack channel, and bi-weekly demos. You always know exactly what's shipping next and why.",
  },
  {
    q: "How much does a typical software project cost?",
    a: "Project costs vary based on scope and complexity. A well-scoped MVP typically runs $25k–$60k. A full-featured SaaS platform is usually $80k–$200k+. Enterprise integrations and AI systems are priced after a paid discovery sprint. We provide a fixed-price proposal after scoping, so there are no surprises mid-project.",
  },
  {
    q: "How long does it take to build and ship a product?",
    a: "A focused MVP takes 8–14 weeks. A full production platform typically takes 4–7 months. Timeline depends heavily on scope, integration complexity, and how quickly feedback is provided. We've shipped apps in as few as 10 weeks when everything is aligned — and we'll be upfront if your expectations need calibrating.",
  },
  {
    q: "Do you work with early-stage startups or only established companies?",
    a: "Both. We work with pre-seed founders building their first product, Series A/B teams scaling their platform, and enterprise engineering orgs that need specialist reinforcement. Our process adapts to your stage — we're more hands-on with startups and more collaborative with in-house teams.",
  },
  {
    q: "Who owns the code, designs, and IP after the project is done?",
    a: "You do — 100%, full stop. On contract signing, all code, assets, designs, and documentation are yours. We provide a clean handoff with a full Git repository, deployment runbooks, architectural documentation, and a 30-day Q&A period. There is no vendor lock-in of any kind.",
  },
  {
    q: "What happens after launch — do you provide maintenance and support?",
    a: "Yes. We offer tiered post-launch retainers: a Monitoring plan ($1,500/month) for uptime, security patches, and critical fixes; a Growth plan ($4,000/month) that adds feature development hours; and a Dedicated plan ($8,000/month) with a named engineer on-call. About 60% of our clients stay on retainer after launch.",
  },
  {
    q: "What technology stack do you specialize in?",
    a: "Frontend: React, Next.js, Vue, TypeScript, React Native, Flutter. Backend: Node.js, Python (FastAPI/Django), Go, Ruby on Rails. Data: PostgreSQL, MongoDB, Redis, ClickHouse. Cloud: AWS, GCP, Azure, Docker, Kubernetes, Terraform. AI: OpenAI, LangChain, HuggingFace, TensorFlow. We recommend the right tool for each job — not the same stack for every client.",
  },
  {
    q: "How do you handle project communication and transparency?",
    a: "You get a dedicated Slack channel, a shared Linear board with full sprint visibility, weekly written status updates, and bi-weekly video demos of working software. Your project manager is always reachable within 2 business hours. We believe in radical transparency — if something is at risk, we tell you before it becomes a problem.",
  },
  {
    q: "Can you work with our existing in-house engineering team?",
    a: "Absolutely — this is actually one of our most common engagement models. We integrate directly into your team's workflow, use your existing tools and conventions, and act as a senior technical extension of your org. We've done this with teams at companies like Shopify, HubSpot, and several Fortune 500 subsidiaries.",
  },
  {
    q: "What information do I need to get started?",
    a: "You don't need a finished spec — just a clear problem to solve and a rough sense of budget. Fill out our contact form with a brief description of what you're building and we'll schedule a 30-minute scoping call. From there, we'll put together a detailed proposal within 3 business days.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: { "@type": "Answer", text: faq.a },
      })),
    };
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(schema);
    script.id = "faq-schema";
    document.head.appendChild(script);
    return () => {
      const el = document.getElementById("faq-schema");
      if (el) document.head.removeChild(el);
    };
  }, []);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section id="faq" className="bg-dc-surface py-28 md:py-36">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-20">
          {/* Left — sticky title */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="lg:sticky lg:top-28">
              <p className="text-accent text-sm font-mono tracking-widest mb-4">FAQ</p>
              <h2 className="text-4xl md:text-5xl font-bold text-dc-text leading-tight mb-6">
                Questions <br />
                <span className="text-accent">Answered.</span>
              </h2>
              <p className="text-dc-text/35 text-base leading-relaxed mb-8">
                Everything you need to know before hiring us. Can&apos;t find what you&apos;re looking for? Reach out directly.
              </p>
              <button
                onClick={() => { const el = document.getElementById("contact"); if (el) el.scrollIntoView({ behavior: "smooth" }); }}
                className="inline-flex items-center gap-2 border border-dc-text/15 text-dc-text/60 text-sm font-medium px-5 py-3 rounded-full hover:border-accent hover:text-accent transition-colors duration-300 cursor-pointer whitespace-nowrap"
              >
                <i className="ri-message-3-line"></i>
                Ask Us Directly
              </button>

              {/* Quick stats */}
              <div className="mt-12 grid grid-cols-2 gap-4">
                {[
                  { value: "< 24h", label: "Average response time" },
                  { value: "10 yrs", label: "In business" },
                  { value: "3 days", label: "Proposal turnaround" },
                  { value: "127+", label: "Happy clients" },
                ].map((s) => (
                  <div key={s.label} className="bg-dc-card border border-dc-text/5 rounded-xl p-4">
                    <p className="text-accent font-bold text-xl mb-0.5">{s.value}</p>
                    <p className="text-dc-text/30 text-xs leading-snug">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right — accordion */}
          <motion.div
            className="lg:col-span-3 flex flex-col gap-2"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                className={`rounded-2xl border transition-colors duration-300 overflow-hidden ${
                  openIndex === i
                    ? "bg-dc-input border-accent/25"
                    : "bg-dc-card border-dc-text/5 hover:border-dc-text/12"
                }`}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: i * 0.04 }}
              >
                <button
                  className="w-full flex items-start justify-between gap-4 p-6 text-left cursor-pointer"
                  onClick={() => toggle(i)}
                  aria-expanded={openIndex === i}
                >
                  <span className={`font-semibold text-base leading-snug transition-colors duration-300 ${openIndex === i ? "text-accent" : "text-dc-text/85"}`}>
                    {faq.q}
                  </span>
                  <span
                    className={`w-7 h-7 flex items-center justify-center rounded-full border shrink-0 mt-0.5 transition-all duration-300 ${
                      openIndex === i
                        ? "bg-accent border-accent text-black rotate-45"
                        : "border-dc-text/15 text-dc-text/40"
                    }`}
                  >
                    <i className="ri-add-line text-sm"></i>
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <p className="text-dc-text/50 text-sm leading-relaxed px-6 pb-6 -mt-1">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}