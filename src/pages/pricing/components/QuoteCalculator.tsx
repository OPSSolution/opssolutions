import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence, animate } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface Option {
  id: string;
  label: string;
  icon: string;
  description: string;
  base: number;
}

interface Feature {
  id: string;
  label: string;
  icon: string;
  cost: number;
  category: string;
}

const projectTypes: Option[] = [
  { id: "web-app", label: "Web Application", icon: "ri-window-line", description: "Dashboard, SaaS tool, or web platform", base: 18000 },
  { id: "mobile-app", label: "Mobile App", icon: "ri-smartphone-line", description: "iOS & Android native or cross-platform", base: 22000 },
  { id: "ecommerce", label: "E-Commerce Store", icon: "ri-shopping-cart-2-line", description: "Custom storefront or Shopify Plus", base: 14000 },
  { id: "ai-product", label: "AI / ML Product", icon: "ri-robot-line", description: "LLM integration, recommendation engine", base: 28000 },
  { id: "redesign", label: "Design & Redesign", icon: "ri-palette-line", description: "UI/UX overhaul of existing product", base: 10000 },
  { id: "infra", label: "Cloud / DevOps", icon: "ri-cloud-line", description: "Migration, infrastructure, CI/CD setup", base: 15000 },
];

const timelines: Option[] = [
  { id: "8wk", label: "8 Weeks", icon: "ri-speed-up-line", description: "MVP / fast-track sprint", base: 1.35 },
  { id: "12wk", label: "12 Weeks", icon: "ri-calendar-check-line", description: "Standard delivery cadence", base: 1.0 },
  { id: "16wk", label: "16 Weeks", icon: "ri-time-line", description: "Complex scope, thorough QA", base: 0.92 },
  { id: "ongoing", label: "Ongoing Retainer", icon: "ri-refresh-line", description: "Monthly rolling engagement", base: 0.88 },
];

const features: Feature[] = [
  { id: "auth", label: "Auth & User Management", icon: "ri-shield-user-line", cost: 3500, category: "Core" },
  { id: "payments", label: "Payments Integration", icon: "ri-bank-card-line", cost: 4000, category: "Core" },
  { id: "realtime", label: "Real-Time Features", icon: "ri-live-line", cost: 5500, category: "Core" },
  { id: "notifications", label: "Push Notifications", icon: "ri-notification-3-line", cost: 2500, category: "Core" },
  { id: "ai-search", label: "AI-Powered Search", icon: "ri-search-eye-line", cost: 6000, category: "AI" },
  { id: "ai-chat", label: "AI Chat / Copilot", icon: "ri-chat-ai-line", cost: 8000, category: "AI" },
  { id: "analytics", label: "Analytics Dashboard", icon: "ri-bar-chart-2-line", cost: 4500, category: "Data" },
  { id: "cms", label: "Admin & CMS", icon: "ri-dashboard-3-line", cost: 3500, category: "Data" },
  { id: "i18n", label: "Multi-Language (i18n)", icon: "ri-translate-2", cost: 2000, category: "Extra" },
  { id: "a11y", label: "Accessibility (WCAG)", icon: "ri-eye-line", cost: 2500, category: "Extra" },
  { id: "seo", label: "Advanced SEO Setup", icon: "ri-seo-line", cost: 1800, category: "Extra" },
  { id: "api", label: "Third-Party API Suite", icon: "ri-plug-2-line", cost: 3000, category: "Extra" },
];

const featureCategories = ["Core", "AI", "Data", "Extra"];

const complexityMultipliers: Record<number, { label: string; mult: number; color: string }> = {
  0: { label: "Simple", mult: 0.85, color: "text-green-400" },
  1: { label: "Medium", mult: 1.0, color: "text-accent" },
  2: { label: "Complex", mult: 1.28, color: "text-orange-400" },
  3: { label: "Enterprise", mult: 1.65, color: "text-red-400" },
};

function formatK(n: number): string {
  return `$${Math.round(n / 1000)}k`;
}

// Animated counter hook
function useAnimatedNumber(target: number, duration = 0.7) {
  const [display, setDisplay] = useState(target);
  const prevRef = useRef(target);
  useEffect(() => {
    const from = prevRef.current;
    prevRef.current = target;
    const ctrl = animate(from, target, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => ctrl.stop();
  }, [target, duration]);
  return display;
}

export default function QuoteCalculator() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedTimeline, setSelectedTimeline] = useState<string>("12wk");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [complexity, setComplexity] = useState<number>(1);
  const [activeCategory, setActiveCategory] = useState<string>("Core");
  const [copied, setCopied] = useState(false);
  const [pulseKey, setPulseKey] = useState(0);

  const toggleFeature = (id: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const estimate = useMemo(() => {
    if (!selectedType) return null;
    const type = projectTypes.find((t) => t.id === selectedType);
    const timeline = timelines.find((t) => t.id === selectedTimeline);
    if (!type || !timeline) return null;

    const featureCost = selectedFeatures.reduce((acc, fid) => {
      const f = features.find((feat) => feat.id === fid);
      return acc + (f?.cost ?? 0);
    }, 0);

    const cm = complexityMultipliers[complexity];
    const base = (type.base + featureCost) * (timeline.base as number) * cm.mult;
    const low = Math.round(base * 0.9);
    const high = Math.round(base * 1.15);
    return { low, high, cm };
  }, [selectedType, selectedTimeline, selectedFeatures, complexity]);

  // Animated display numbers
  const displayLow = useAnimatedNumber(estimate?.low ?? 0);
  const displayHigh = useAnimatedNumber(estimate?.high ?? 0);

  // Trigger pulse on any estimate change
  useEffect(() => {
    if (estimate) setPulseKey((k) => k + 1);
  }, [estimate?.low, estimate?.high]);

  const handleCopy = () => {
    if (!estimate) return;
    const typeName = projectTypes.find((t) => t.id === selectedType)?.label ?? "";
    const timelineName = timelines.find((t) => t.id === selectedTimeline)?.label ?? "";
    const featureNames = selectedFeatures.map((fid) => features.find((f) => f.id === fid)?.label ?? "").filter(Boolean);
    const text = [
      `Project Quote Estimate`,
      `Type: ${typeName}`,
      `Timeline: ${timelineName}`,
      `Complexity: ${estimate.cm.label}`,
      featureNames.length > 0 ? `Features: ${featureNames.join(", ")}` : "",
      `Estimate: ${formatK(estimate.low)} – ${formatK(estimate.high)}`,
    ].filter(Boolean).join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const progressSteps = [
    { done: !!selectedType, label: "Project Type" },
    { done: true, label: "Timeline" },
    { done: selectedFeatures.length > 0, label: "Features" },
    { done: !!estimate, label: "Your Estimate" },
  ];

  return (
    <section className="py-24 px-6 md:px-10 border-t border-dc-text/5">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-accent text-xs font-mono tracking-widest mb-3">INSTANT ESTIMATOR</p>
          <h2 className="text-3xl md:text-5xl font-bold text-dc-text mb-4">
            Get a <span className="text-accent">Quote</span> in 60 Seconds
          </h2>
          <p className="text-dc-text/50 text-sm max-w-xl mx-auto">
            Select your project type, timeline, and desired features to see an instant ballpark estimate.
            Real scoped quotes come from our 30-min discovery call.
          </p>
        </motion.div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-12">
          {progressSteps.map((step, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${step.done ? "bg-accent/15 border border-accent/35 text-accent" : "bg-dc-card border border-dc-text/8 text-dc-text/40"}`}>
                {step.done && <i className="ri-check-line text-xs"></i>}
                {step.label}
              </div>
              {i < progressSteps.length - 1 && (
                <div className={`w-6 h-px transition-colors duration-300 ${progressSteps[i + 1].done ? "bg-accent/40" : "bg-dc-text/10"}`}></div>
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left — Inputs */}
          <div className="xl:col-span-2 flex flex-col gap-8">

            {/* Step 1: Project Type */}
            <div className="bg-dc-card border border-dc-text/8 rounded-2xl p-7">
              <div className="flex items-center gap-2 mb-6">
                <span className="w-6 h-6 flex items-center justify-center rounded-full bg-accent text-black text-xs font-bold shrink-0">1</span>
                <h3 className="text-dc-text font-bold text-base">What are you building?</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {projectTypes.map((type) => {
                  const isActive = selectedType === type.id;
                  return (
                    <motion.button
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={`relative flex flex-col items-start gap-3 p-4 rounded-xl border text-left cursor-pointer transition-all duration-250 ${
                        isActive
                          ? "bg-accent/12 border-accent/45"
                          : "bg-dc-surface border-dc-text/8 hover:border-dc-text/20"
                      }`}
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors duration-250 ${isActive ? "bg-accent/20" : "bg-dc-text/5"}`}>
                        <i className={`${type.icon} text-sm ${isActive ? "text-accent" : "text-dc-text/40"}`}></i>
                      </div>
                      <div>
                        <p className={`text-xs font-bold leading-tight ${isActive ? "text-accent" : "text-dc-text/70"}`}>{type.label}</p>
                        <p className={`text-[11px] mt-0.5 leading-tight ${isActive ? "text-accent/60" : "text-dc-text/35"}`}>{type.description}</p>
                      </div>
                      {isActive && (
                        <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-accent flex items-center justify-center">
                          <i className="ri-check-line text-black text-[10px]"></i>
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Timeline */}
            <div className="bg-dc-card border border-dc-text/8 rounded-2xl p-7">
              <div className="flex items-center gap-2 mb-6">
                <span className="w-6 h-6 flex items-center justify-center rounded-full bg-accent text-black text-xs font-bold shrink-0">2</span>
                <h3 className="text-dc-text font-bold text-base">What&apos;s your ideal timeline?</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {timelines.map((tl) => {
                  const isActive = selectedTimeline === tl.id;
                  return (
                    <motion.button
                      key={tl.id}
                      onClick={() => setSelectedTimeline(tl.id)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border text-center cursor-pointer transition-all duration-250 ${
                        isActive
                          ? "bg-accent/12 border-accent/45"
                          : "bg-dc-surface border-dc-text/8 hover:border-dc-text/20"
                      }`}
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className={`w-9 h-9 flex items-center justify-center rounded-xl transition-colors duration-250 ${isActive ? "bg-accent/20" : "bg-dc-text/5"}`}>
                        <i className={`${tl.icon} text-base ${isActive ? "text-accent" : "text-dc-text/40"}`}></i>
                      </div>
                      <p className={`text-xs font-bold ${isActive ? "text-accent" : "text-dc-text/65"}`}>{tl.label}</p>
                      <p className={`text-[10px] leading-tight ${isActive ? "text-accent/55" : "text-dc-text/35"}`}>{tl.description}</p>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Complexity */}
            <div className="bg-dc-card border border-dc-text/8 rounded-2xl p-7">
              <div className="flex items-center gap-2 mb-6">
                <span className="w-6 h-6 flex items-center justify-center rounded-full bg-accent text-black text-xs font-bold shrink-0">3</span>
                <h3 className="text-dc-text font-bold text-base">Project complexity</h3>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={0}
                    max={3}
                    step={1}
                    value={complexity}
                    onChange={(e) => setComplexity(Number(e.target.value))}
                    className="flex-1 h-2 rounded-full accent-[#4f9cf9] cursor-pointer"
                    style={{ accentColor: "#4f9cf9" }}
                  />
                  <span className={`text-sm font-bold w-24 text-right ${complexityMultipliers[complexity].color}`}>
                    {complexityMultipliers[complexity].label}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1 text-center">
                  {Object.entries(complexityMultipliers).map(([k, v]) => (
                    <button
                      key={k}
                      onClick={() => setComplexity(Number(k))}
                      className={`text-[10px] font-medium py-1.5 px-2 rounded-lg transition-all duration-200 cursor-pointer ${
                        complexity === Number(k)
                          ? "bg-accent/15 border border-accent/35 text-accent"
                          : "text-dc-text/35 hover:text-dc-text/60"
                      }`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
                <div className="bg-dc-surface border border-dc-text/5 rounded-xl p-3 text-[11px] text-dc-text/45 leading-relaxed">
                  <strong className="text-dc-text/60">Simple:</strong> standard CRUD + auth &nbsp;|&nbsp;
                  <strong className="text-dc-text/60">Medium:</strong> custom logic + 3rd-party APIs &nbsp;|&nbsp;
                  <strong className="text-dc-text/60">Complex:</strong> real-time, multi-tenant &nbsp;|&nbsp;
                  <strong className="text-dc-text/60">Enterprise:</strong> compliance + scale
                </div>
              </div>
            </div>

            {/* Step 4: Features */}
            <div className="bg-dc-card border border-dc-text/8 rounded-2xl p-7">
              <div className="flex items-center justify-between gap-2 mb-6">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 flex items-center justify-center rounded-full bg-accent text-black text-xs font-bold shrink-0">4</span>
                  <h3 className="text-dc-text font-bold text-base">Select features</h3>
                </div>
                {selectedFeatures.length > 0 && (
                  <button
                    onClick={() => setSelectedFeatures([])}
                    className="text-dc-text/35 hover:text-dc-text/60 text-xs transition-colors cursor-pointer"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Category tabs */}
              <div className="flex gap-1.5 mb-5 flex-wrap">
                {featureCategories.map((cat) => {
                  const count = selectedFeatures.filter((fid) =>
                    features.find((f) => f.id === fid && f.category === cat)
                  ).length;
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer whitespace-nowrap ${
                        activeCategory === cat
                          ? "bg-accent/15 border border-accent/35 text-accent"
                          : "bg-dc-surface border border-dc-text/8 text-dc-text/50 hover:border-dc-text/20"
                      }`}
                    >
                      {cat}
                      {count > 0 && (
                        <span className="w-4 h-4 flex items-center justify-center rounded-full bg-accent text-black text-[9px] font-bold">{count}</span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {features.filter((f) => f.category === activeCategory).map((feat) => {
                  const isActive = selectedFeatures.includes(feat.id);
                  return (
                    <motion.button
                      key={feat.id}
                      onClick={() => toggleFeature(feat.id)}
                      className={`flex items-center justify-between gap-3 p-3.5 rounded-xl border text-left cursor-pointer transition-all duration-200 ${
                        isActive
                          ? "bg-accent/10 border-accent/40"
                          : "bg-dc-surface border-dc-text/8 hover:border-dc-text/20"
                      }`}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 flex items-center justify-center rounded-lg shrink-0 transition-colors duration-200 ${isActive ? "bg-accent/20" : "bg-dc-text/5"}`}>
                          <i className={`${feat.icon} text-sm ${isActive ? "text-accent" : "text-dc-text/40"}`}></i>
                        </div>
                        <span className={`text-xs font-semibold ${isActive ? "text-accent" : "text-dc-text/65"}`}>{feat.label}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-[10px] font-mono ${isActive ? "text-accent/70" : "text-dc-text/30"}`}>
                          +{formatK(feat.cost)}
                        </span>
                        <div className={`w-4 h-4 rounded flex items-center justify-center border transition-all duration-200 ${isActive ? "bg-accent border-accent" : "border-dc-text/20"}`}>
                          {isActive && <i className="ri-check-line text-black text-[10px]"></i>}
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right — Estimate Panel */}
          <div className="xl:col-span-1">
            <div className="sticky top-28">
              <div className={`rounded-2xl border overflow-hidden transition-all duration-500 ${estimate ? "border-accent/30 bg-dc-card" : "border-dc-text/8 bg-dc-card opacity-75"}`}>
                {/* Panel header */}
                <div className="p-6 border-b border-dc-text/8 bg-dc-surface relative overflow-hidden">
                  {/* Live pulse ring on update */}
                  <AnimatePresence>
                    {estimate && (
                      <motion.div
                        key={`pulse-${pulseKey}`}
                        className="absolute inset-0 border-2 border-accent/30 rounded-t-2xl pointer-events-none"
                        initial={{ opacity: 0.8, scale: 1 }}
                        animate={{ opacity: 0, scale: 1.04 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                      />
                    )}
                  </AnimatePresence>

                  {/* Live indicator dot */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="relative w-2 h-2">
                      <span className={`absolute inset-0 rounded-full ${estimate ? "bg-accent" : "bg-dc-text/20"}`} />
                      {estimate && (
                        <motion.span
                          className="absolute inset-0 rounded-full bg-accent"
                          animate={{ scale: [1, 2.2, 1], opacity: [0.7, 0, 0.7] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                    </div>
                    <p className="text-dc-text/40 text-xs font-mono tracking-widest">
                      {estimate ? "LIVE ESTIMATE" : "YOUR ESTIMATE"}
                    </p>
                  </div>

                  <AnimatePresence mode="wait">
                    {estimate ? (
                      <motion.div
                        key="has-estimate"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex items-baseline gap-1 font-mono">
                          <motion.span
                            className="text-3xl md:text-4xl font-bold text-dc-text"
                            key={`low-${displayLow}`}
                          >
                            {formatK(displayLow)}
                          </motion.span>
                          <span className="text-dc-text/30 text-2xl">–</span>
                          <motion.span
                            className="text-3xl md:text-4xl font-bold text-accent"
                            key={`high-${displayHigh}`}
                          >
                            {formatK(displayHigh)}
                          </motion.span>
                        </div>
                        <p className={`text-xs font-medium mt-1.5 ${estimate.cm.color}`}>
                          {estimate.cm.label} complexity &middot; {timelines.find(t => t.id === selectedTimeline)?.label}
                        </p>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="no-estimate"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <p className="text-2xl font-bold text-dc-text/20 font-mono">Select options</p>
                        <p className="text-dc-text/30 text-xs mt-1">Choose a project type to begin</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Mini bar chart showing cost breakdown */}
                  {estimate && selectedFeatures.length > 0 && (
                    <motion.div
                      className="mt-4 flex items-end gap-1 h-8"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      {/* Base bar */}
                      <motion.div
                        className="flex-1 bg-dc-text/20 rounded-sm relative group cursor-default"
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        style={{ originY: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        title="Base cost"
                      >
                        <div className="absolute bottom-0 w-full bg-dc-text/25 rounded-sm" style={{ height: "100%" }} />
                      </motion.div>
                      {/* Feature bars */}
                      {selectedFeatures.slice(0, 5).map((fid, i) => {
                        const f = features.find((feat) => feat.id === fid);
                        const type = projectTypes.find((t) => t.id === selectedType);
                        const pct = type ? Math.min((f?.cost ?? 0) / type.base, 0.85) : 0.2;
                        return (
                          <motion.div
                            key={fid}
                            className="w-3 rounded-sm bg-accent/60"
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: 1 }}
                            style={{ height: `${Math.max(pct * 100, 20)}%`, originY: 1 }}
                            transition={{ duration: 0.4, delay: 0.15 + i * 0.06 }}
                            title={f?.label}
                          />
                        );
                      })}
                      {selectedFeatures.length > 5 && (
                        <span className="text-[9px] text-dc-text/30 self-end ml-0.5 font-mono">+{selectedFeatures.length - 5}</span>
                      )}
                    </motion.div>
                  )}
                </div>

                {/* Breakdown */}
                <div className="p-6 flex flex-col gap-3">
                  {/* Selected type */}
                  {selectedType && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-dc-text/45">Project type</span>
                      <span className="text-dc-text/70 font-medium">{projectTypes.find((t) => t.id === selectedType)?.label}</span>
                    </div>
                  )}

                  {/* Timeline */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-dc-text/45">Timeline</span>
                    <span className="text-dc-text/70 font-medium">{timelines.find((t) => t.id === selectedTimeline)?.label}</span>
                  </div>

                  {/* Features */}
                  {selectedFeatures.length > 0 && (
                    <div className="flex flex-col gap-1.5 border-t border-dc-text/5 pt-3 mt-1">
                      <p className="text-dc-text/35 text-[10px] font-mono tracking-widest mb-1">FEATURES</p>
                      {selectedFeatures.map((fid) => {
                        const f = features.find((feat) => feat.id === fid);
                        if (!f) return null;
                        return (
                          <div key={fid} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1.5">
                              <i className={`${f.icon} text-accent/60 text-xs`}></i>
                              <span className="text-dc-text/55">{f.label}</span>
                            </div>
                            <span className="text-dc-text/40 font-mono">+{formatK(f.cost)}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Disclaimer */}
                  <div className="bg-dc-surface border border-dc-text/5 rounded-xl p-3 mt-2">
                    <p className="text-dc-text/35 text-[11px] leading-relaxed">
                      This is a rough ballpark based on typical project profiles. Actual scoped estimates are provided after a free 30-min discovery call.
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2.5 mt-2">
                    <motion.button
                      onClick={() => navigate("/contact")}
                      disabled={!estimate}
                      className={`flex items-center justify-center gap-2 font-bold px-6 py-3.5 rounded-full text-sm whitespace-nowrap transition-all duration-300 cursor-pointer ${
                        estimate
                          ? "bg-accent text-black hover:bg-white"
                          : "bg-dc-text/8 text-dc-text/30 cursor-not-allowed"
                      }`}
                      whileHover={estimate ? { scale: 1.02 } : {}}
                      whileTap={estimate ? { scale: 0.97 } : {}}
                    >
                      Get a Real Scope
                      <i className="ri-arrow-right-line"></i>
                    </motion.button>

                    <button
                      onClick={handleCopy}
                      disabled={!estimate}
                      className={`flex items-center justify-center gap-2 border font-medium px-6 py-3 rounded-full text-sm whitespace-nowrap transition-all duration-300 cursor-pointer ${
                        estimate
                          ? copied
                            ? "border-accent/40 text-accent bg-accent/8"
                            : "border-dc-text/15 text-dc-text/60 hover:border-accent hover:text-accent"
                          : "border-dc-text/8 text-dc-text/20 cursor-not-allowed"
                      }`}
                    >
                      <i className={copied ? "ri-check-line" : "ri-clipboard-line"}></i>
                      {copied ? "Copied!" : "Copy Estimate"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick guide */}
              <div className="mt-4 p-5 bg-dc-card border border-dc-text/8 rounded-2xl">
                <p className="text-dc-text/40 text-xs font-mono tracking-widest mb-4">WHAT AFFECTS COST?</p>
                <div className="flex flex-col gap-2.5">
                  {[
                    { icon: "ri-code-s-slash-line", text: "Custom features vs. off-the-shelf" },
                    { icon: "ri-time-line", text: "Tighter deadlines = sprint surcharge" },
                    { icon: "ri-shield-check-line", text: "Compliance (HIPAA, PCI, SOC2)" },
                    { icon: "ri-stack-line", text: "Number of platforms (web + mobile)" },
                    { icon: "ri-loop-right-line", text: "Number of revision cycles" },
                  ].map((item) => (
                    <div key={item.text} className="flex items-center gap-2.5">
                      <div className="w-6 h-6 flex items-center justify-center shrink-0">
                        <i className={`${item.icon} text-accent/50 text-sm`}></i>
                      </div>
                      <span className="text-dc-text/45 text-xs leading-snug">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}