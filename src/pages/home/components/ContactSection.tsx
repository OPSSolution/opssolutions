import { useState, FormEvent } from "react";
import { motion } from "framer-motion";

const services = ["Web Development", "Mobile App", "Cloud Architecture", "UI/UX Design", "AI Integration", "DevOps", "Other"];

const FORM_URL = "https://readdy.ai/api/form/d8297g5979rtuqs72ja0";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    service: "",
    budget: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [charCount, setCharCount] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "message") setCharCount(value.length);
    if (name === "message" && value.length > 500) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    if (charCount > 500) return;

    setStatus("loading");
    try {
      const params = new URLSearchParams();
      Object.entries(formData).forEach(([key, val]) => {
        if (val) params.append(key, val);
      });
      const res = await fetch(FORM_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      });
      if (res.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", company: "", service: "", budget: "", message: "" });
        setCharCount(0);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="bg-dc-bg py-28 md:py-36">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-accent text-sm font-mono tracking-widest mb-4">GET IN TOUCH</p>
          <h2 className="text-4xl md:text-6xl font-bold text-dc-text">
            Start Your <span className="text-accent">Project</span>
          </h2>
          <p className="text-dc-text/30 text-base mt-4 max-w-md mx-auto">
            Tell us about your project. We respond within 24 hours.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16">
          {/* Left Info */}
          <motion.div
            className="lg:col-span-2 flex flex-col gap-8"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div>
              <h3 className="text-dc-text font-semibold text-xl mb-2">Let&apos;s build something great.</h3>
              <p className="text-dc-text/40 text-sm leading-relaxed">
                Whether you have a fully-formed idea or just a vague direction, we&apos;re here to help you shape it into a world-class product.
              </p>
            </div>

            <div className="flex flex-col gap-5">
              {[
                { icon: "ri-mail-line", label: "Email Us", value: "info@ballangkmall.com" },
                { icon: "ri-phone-line", label: "Call Us", value: "+855 10 660 661" },
                { icon: "ri-map-pin-2-line", label: "Our Office", value: "TK Roundabout, 2nd Floor, Street 289, Sangkat Boeng Kak Ti Pir, Khan Toul Kork, Phnom Penh, Cambodia" },
                { icon: "ri-time-line", label: "Response Time", value: "Within 24 hours" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="w-10 h-10 flex items-center justify-center shrink-0 rounded-xl bg-accent/10 border border-accent/20">
                    <i className={`${item.icon} text-accent text-base`}></i>
                  </div>
                  <div>
                    <p className="text-dc-text/30 text-xs font-mono mb-0.5">{item.label}</p>
                    <p className="text-dc-text text-sm font-medium">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Trusted By */}
            <div className="pt-6 border-t border-dc-text/5">
              <p className="text-dc-text/20 text-xs font-mono mb-4 tracking-widest">TRUSTED BY TEAMS AT</p>
              <div className="flex flex-wrap gap-3">
                {["Stripe", "Shopify", "HubSpot", "Vercel", "Notion"].map((company) => (
                  <span key={company} className="text-dc-text/30 text-xs bg-dc-text/5 px-3 py-1.5 rounded-lg font-mono">
                    {company}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Form */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            {status === "success" ? (
              <motion.div
                className="flex flex-col items-center justify-center h-full min-h-[400px] bg-dc-card border border-accent/20 rounded-2xl p-12 text-center"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-accent/10 border border-accent/30 mb-6">
                  <i className="ri-check-line text-accent text-3xl"></i>
                </div>
                <h3 className="text-dc-text font-bold text-2xl mb-2">Message Sent!</h3>
                <p className="text-dc-text/40 text-sm max-w-xs">
                  Thanks for reaching out. Our team will get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="mt-8 text-accent text-sm font-medium hover:underline cursor-pointer"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <form
                data-readdy-form
                id="contact-form"
                onSubmit={handleSubmit}
                className="bg-dc-card border border-dc-text/5 rounded-2xl p-8 md:p-10 flex flex-col gap-5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-dc-text/40 text-xs font-mono">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="John Smith"
                      className="bg-dc-input border border-dc-text/8 text-dc-text text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-accent/50 transition-colors placeholder-dc-text/20"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-dc-text/40 text-xs font-mono">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="john@company.com"
                      className="bg-dc-input border border-dc-text/8 text-dc-text text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-accent/50 transition-colors placeholder-dc-text/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-dc-text/40 text-xs font-mono">Company</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Acme Corp"
                      className="bg-dc-input border border-dc-text/8 text-dc-text text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-accent/50 transition-colors placeholder-dc-text/20"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-dc-text/40 text-xs font-mono">Service Needed</label>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="bg-dc-input border border-dc-text/8 text-dc-text text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-accent/50 transition-colors appearance-none cursor-pointer"
                    >
                      <option value="">Select a service</option>
                      {services.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-dc-text/40 text-xs font-mono">Project Budget</label>
                  <div className="flex flex-wrap gap-2">
                    {["$10k–$25k", "$25k–$50k", "$50k–$100k", "$100k+"].map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, budget: b }))}
                        className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer whitespace-nowrap ${
                          formData.budget === b
                            ? "bg-accent text-black"
                            : "bg-dc-text/5 text-dc-text/40 border border-dc-text/10 hover:border-dc-text/20 hover:text-dc-text"
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex justify-between">
                    <label className="text-dc-text/40 text-xs font-mono">Your Message *</label>
                    <span className={`text-xs font-mono ${charCount > 450 ? "text-red-400" : "text-dc-text/20"}`}>
                      {charCount}/500
                    </span>
                  </div>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    maxLength={500}
                    rows={4}
                    placeholder="Tell us about your project, goals, and timeline..."
                    className="bg-dc-text/5 border border-dc-text/10 text-dc-text text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-accent/50 transition-colors resize-none placeholder-dc-text/20"
                  />
                </div>

                {status === "error" && (
                  <p className="text-red-400 text-xs flex items-center gap-2">
                    <i className="ri-error-warning-line"></i>
                    Something went wrong. Please try again.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading" || charCount > 500}
                  className="flex items-center justify-center gap-2 bg-accent text-black font-semibold py-4 rounded-xl text-sm hover:bg-white transition-colors duration-300 disabled:opacity-60 cursor-pointer whitespace-nowrap mt-1"
                >
                  {status === "loading" ? (
                    <>
                      <i className="ri-loader-4-line animate-spin"></i>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <i className="ri-arrow-right-line text-base"></i>
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}