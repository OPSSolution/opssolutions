import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const testimonials = [
  {
    id: 1,
    name: "James Carter",
    role: "CTO",
    company: "FinanceFlow Inc.",
    avatar: "https://readdy.ai/api/search-image?query=professional%20business%20headshot%20male%20executive%2C%2040s%2C%20confident%20expression%2C%20neutral%20dark%20background%2C%20sharp%20focus%2C%20corporate%20portrait%20photography&width=120&height=120&seq=testi_01&orientation=squarish",
    quote: "Solutions delivered our entire trading platform in under 4 months. The code quality is exceptional — zero critical bugs in production after 8 months live. These engineers are the real deal.",
    rating: 5,
    tag: "FinTech Platform",
    metric: "$2M+ processed daily",
  },
  {
    id: 2,
    name: "Priya Sharma",
    role: "Founder & CEO",
    company: "MediSynth",
    avatar: "https://readdy.ai/api/search-image?query=professional%20business%20headshot%20Indian%20woman%20founder%2C%2030s%2C%20warm%20confident%20smile%2C%20clean%20studio%20background%2C%20sharp%20focus%2C%20premium%20portrait%20photography&width=120&height=120&seq=testi_02&orientation=squarish",
    quote: "They rebuilt our entire healthcare app from scratch in React Native. Our crash rate dropped from 15% to 0.2%, and App Store rating jumped from 2.8 to 4.9. Absolutely transformed our product.",
    rating: 5,
    tag: "Mobile App Rebuild",
    metric: "App Store rating: 4.9★",
  },
  {
    id: 3,
    name: "Robert Klein",
    role: "VP of Engineering",
    company: "RetailMax",
    avatar: "https://readdy.ai/api/search-image?query=professional%20corporate%20headshot%20European%20male%20VP%20engineering%2C%2045s%2C%20smart%20attire%2C%20neutral%20background%2C%20confident%20expression%2C%20premium%20business%20portrait&width=120&height=120&seq=testi_03&orientation=squarish",
    quote: "The e-commerce platform Solutions built handles our Black Friday traffic effortlessly — 50,000 concurrent users with zero downtime. Their infrastructure work alone saved us six figures annually.",
    rating: 5,
    tag: "E-Commerce Platform",
    metric: "50k concurrent users, 0 downtime",
  },
  {
    id: 4,
    name: "Aiyana Torres",
    role: "CEO",
    company: "EduBridge",
    avatar: "https://readdy.ai/api/search-image?query=professional%20headshot%20woman%20CEO%20startup%20founder%2C%2030s%2C%20warm%20studio%20lighting%2C%20confident%20approachable%20expression%2C%20minimal%20background%2C%20high%20quality%20portrait&width=120&height=120&seq=testi_04&orientation=squarish",
    quote: "Solutions turned our vague EdTech idea into a polished, market-ready product in 3 months. Their designers and engineers worked as one seamless team. The result exceeded every expectation.",
    rating: 5,
    tag: "EdTech MVP",
    metric: "3-month delivery, 12k users",
  },
  {
    id: 5,
    name: "Marcus Lee",
    role: "Co-Founder",
    company: "LogiChain",
    avatar: "https://readdy.ai/api/search-image?query=professional%20business%20headshot%20male%20tech%20co-founder%2C%2035s%2C%20smart%20casual%20attire%2C%20minimal%20studio%20background%2C%20confident%20direct%20expression%2C%20sharp%20focus&width=120&height=120&seq=testi_05&orientation=squarish",
    quote: "The IoT dashboard Solutions built processes 10 million events per day without breaking a sweat. Their architecture is rock-solid and the documentation is the best I have ever seen from an agency.",
    rating: 5,
    tag: "IoT Dashboard",
    metric: "10M events/day processed",
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <i key={i} className="ri-star-fill text-accent text-sm"></i>
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 5000);
  };

  useEffect(() => {
    if (!paused) startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [paused]);

  const goTo = (index: number) => {
    setActive(index);
    if (timerRef.current) clearInterval(timerRef.current);
    if (!paused) startTimer();
  };

  const current = testimonials[active];

  return (
    <section id="testimonials" className="bg-dc-bg py-28 md:py-36 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-accent text-sm font-mono tracking-widest mb-4">CLIENT LOVE</p>
          <h2 className="text-4xl md:text-6xl font-bold text-dc-text">
            What Our <span className="text-accent">Clients</span> Say
          </h2>
          <p className="text-dc-text/30 text-base mt-4 max-w-md mx-auto">
            Don&apos;t take our word for it — here&apos;s what the people who hired us have to say.
          </p>
        </motion.div>

        {/* Main Featured Quote */}
        <div
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
            {/* Quote Area */}
            <div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="bg-dc-card border border-dc-text/5 rounded-2xl p-8 md:p-10"
                >
                  <div className="flex items-start justify-between mb-6">
                    <StarRating count={current.rating} />
                    <span className="text-accent/60 text-xs font-mono bg-accent/10 px-3 py-1 rounded-full border border-accent/15">
                      {current.tag}
                    </span>
                  </div>

                  <p className="text-accent/20 text-7xl font-serif leading-none mb-0 -mt-2 select-none">&ldquo;</p>

                  <p className="text-dc-text/80 text-lg md:text-xl leading-relaxed font-medium -mt-4">
                    {current.quote}
                  </p>

                  <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 text-accent text-xs font-mono px-4 py-2 rounded-full mt-6">
                    <i className="ri-bar-chart-2-line text-sm"></i>
                    {current.metric}
                  </div>

                  <div className="flex items-center gap-4 mt-8 pt-6 border-t border-dc-text/5">
                    <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-accent/20">
                      <img src={current.avatar} alt={current.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-dc-text font-semibold text-sm">{current.name}</p>
                      <p className="text-dc-text/40 text-xs">{current.role} · {current.company}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Dots */}
              <div className="flex items-center gap-2 mt-6">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      i === active ? "bg-accent w-8" : "bg-dc-text/15 w-4 hover:bg-dc-text/30"
                    }`}
                    aria-label={`Testimonial ${i + 1}`}
                  />
                ))}
                <div className="ml-auto flex gap-2">
                  <button
                    onClick={() => goTo((active - 1 + testimonials.length) % testimonials.length)}
                    className="w-9 h-9 flex items-center justify-center rounded-full border border-dc-text/10 text-dc-text/40 hover:border-accent hover:text-accent transition-colors duration-300 cursor-pointer"
                    aria-label="Previous"
                  >
                    <i className="ri-arrow-left-line text-sm"></i>
                  </button>
                  <button
                    onClick={() => goTo((active + 1) % testimonials.length)}
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-accent text-black hover:bg-white transition-colors duration-300 cursor-pointer"
                    aria-label="Next"
                  >
                    <i className="ri-arrow-right-line text-sm"></i>
                  </button>
                </div>
              </div>
            </div>

            {/* Stacked Cards Panel */}
            <div className="hidden lg:flex lg:col-span-2 flex-col gap-3">
              {testimonials.map((t, i) => (
                <motion.button
                  key={t.id}
                  onClick={() => goTo(i)}
                  className={`text-left p-5 rounded-xl border transition-all duration-300 cursor-pointer w-full ${
                    i === active
                      ? "bg-dc-input border-accent/30"
                      : "bg-dc-card border-dc-text/5 hover:border-dc-text/15"
                  }`}
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full overflow-hidden shrink-0">
                      <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold text-sm truncate ${i === active ? "text-dc-text" : "text-dc-text/50"}`}>
                        {t.name}
                      </p>
                      <p className="text-dc-text/30 text-xs truncate">{t.company}</p>
                    </div>
                    {i === active && <i className="ri-play-fill text-accent text-xs shrink-0"></i>}
                  </div>
                </motion.button>
              ))}

              {/* Trust Bar */}
              <div className="mt-4 p-5 rounded-xl bg-dc-card border border-dc-text/5">
                <p className="text-dc-text/20 text-xs font-mono mb-3 tracking-widest">OVERALL RATING</p>
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-dc-text">4.9</span>
                  <div>
                    <StarRating count={5} />
                    <p className="text-dc-text/30 text-xs mt-0.5">Based on 127 reviews</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}