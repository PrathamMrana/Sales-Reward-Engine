import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import {
  Zap, Lock, PlayCircle, Cpu, ShieldCheck, Network,
  Activity, Database, Code2, X, Workflow, Orbit,
  Globe, LineChart, Sparkles, Layers
} from 'lucide-react';
import AppIcon from '../components/common/AppIcon';

// --- EYE-PLEASING BACKGROUND (Aurora Mesh) ---
const AuroraBackground = () => (
  <div className="aurora-container">
    <div className="aurora-blob bg-blue-500 w-[60vw] h-[60vw] top-[-10%] left-[-10%]" style={{ '--duration': '25s' }} />
    <div className="aurora-blob bg-violet-600 w-[70vw] h-[70vw] top-[20%] right-[-20%]" style={{ '--duration': '35s', animationDirection: 'reverse' }} />
    <div className="aurora-blob bg-cyan-400 w-[50vw] h-[50vw] bottom-[-20%] left-[20%]" style={{ '--duration': '30s' }} />
    <div className="aurora-blob bg-pink-500 w-[40vw] h-[40vw] bottom-[10%] right-[30%] opacity-40" style={{ '--duration': '28s' }} />
    <div className="absolute inset-0 stars-overlay z-10" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0f172a_100%)] z-20 pointer-events-none opacity-80" />
  </div>
);

// --- 3D MOUSE-REACTIVE TILT COMPONENT ---
const TiltCard = ({ children, className }) => {
  const ref = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Calculate rotation (-5 to 5 degrees)
    const rX = ((mouseY / height) - 0.5) * -10;
    const rY = ((mouseX / width) - 0.5) * 10;

    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ rotateX, rotateY }}
      transition={{ type: "spring", stiffness: 300, damping: 30, mass: 0.5 }}
      style={{ perspective: 1000 }}
      className={`relative ${className}`}
    >
      {children}
    </motion.div>
  );
};

// --- VIBRANT & ADVANCED HOLOGRAPHIC GUIDE ---
const ElegantGuide = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
          animate={{ opacity: 1, backdropFilter: "blur(30px)" }}
          exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-8 bg-[#0f172a]/60"
        >
          <motion.div
            initial={{ scale: 0.9, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 30, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="w-full max-w-[1300px] hyper-glass p-[2px] relative overflow-visible"
          >
            {/* Animated Gradient Border Wrap */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-pink-500 to-cyan-500 rounded-3xl opacity-50 blur-[2px] animate-pulse" />

            <div className="bg-[#0f172a]/95 backdrop-blur-3xl rounded-[23px] relative z-10 p-8 md:p-14 h-full flex flex-col overflow-hidden">

              {/* Massive Ambient Internal Glow */}
              <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-pink-500/20 to-violet-500/20 blur-[120px] rounded-full pointer-events-none animate-pulse" />
              <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-tr from-cyan-400/20 to-blue-500/20 blur-[100px] rounded-full pointer-events-none" />

              {/* Header */}
              <div className="flex justify-between items-center mb-12 lg:mb-16 relative z-20">
                <div className="flex items-center gap-6">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-blue-500 blur-xl opacity-50 group-hover:opacity-100 transition-opacity" />
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/20 shadow-xl backdrop-blur-md relative z-10 flex items-center justify-center">
                      <Zap className="w-10 h-10 text-cyan-400 animate-pulse" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-widest text-glow-soft">
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Quick</span> Start
                    </h2>
                    <p className="text-cyan-300 font-mono text-sm uppercase tracking-widest mt-2 flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                      App Initialization Sequence
                    </p>
                  </div>
                </div>
                <button onClick={onClose} className="p-4 bg-white/5 hover:bg-white/20 hover:scale-110 rounded-full transition-all border border-white/10 group">
                  <X className="w-8 h-8 text-slate-300 group-hover:text-white" />
                </button>
              </div>

              {/* Four Steps Configuration */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 relative z-20">
                {[
                  {
                    i: ShieldCheck, t: "1. Register Admin",
                    d: "Create your secure admin profile and initialize your isolated workspace ecosystem.",
                    color: "from-blue-400 to-cyan-400", bg: "bg-blue-500/10", borderHover: "group-hover:border-blue-400/50", iconColor: "text-blue-400"
                  },
                  {
                    i: Database, t: "2. Connect Data",
                    d: "Import sales quotas, establish metrics, and link foundational performance nodes.",
                    color: "from-violet-400 to-fuchsia-400", bg: "bg-violet-500/10", borderHover: "group-hover:border-violet-400/50", iconColor: "text-violet-400"
                  },
                  {
                    i: Workflow, t: "3. Build Logic",
                    d: "Construct dynamic incentive rule-sets using our zero-code visual policy engine.",
                    color: "from-pink-400 to-rose-400", bg: "bg-pink-500/10", borderHover: "group-hover:border-pink-400/50", iconColor: "text-pink-400"
                  },
                  {
                    i: LineChart, t: "4. Run & Reward",
                    d: "Activate the engine to instantly calculate commissions and drive revenue growth.",
                    color: "from-emerald-400 to-teal-400", bg: "bg-emerald-500/10", borderHover: "group-hover:border-emerald-400/50", iconColor: "text-emerald-400"
                  }
                ].map((step, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 + (idx * 0.15) }}
                    className={`bg-white/5 p-6 rounded-[2rem] border border-white/10 transition-all duration-300 group hover:-translate-y-2 hover:bg-white/10 ${step.borderHover} relative overflow-hidden flex flex-col`}
                  >
                    {/* Hover Glow Background */}
                    <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500 z-0" style={{ backgroundImage: `var(--tw-gradient-stops)` }} />

                    <div className="relative z-10 flex-1 flex flex-col">
                      <div className="flex items-center justify-between mb-6">
                        <div className={`p-4 ${step.bg} rounded-2xl border border-white/10 group-hover:scale-110 transition-transform`}>
                          <step.i className={`w-8 h-8 ${step.iconColor}`} />
                        </div>
                        <span className="text-4xl font-black text-white/5 group-hover:text-white/10 transition-colors">0{idx + 1}</span>
                      </div>
                      <h3 className={`text-xl font-black uppercase tracking-wider mb-4 text-transparent bg-clip-text bg-gradient-to-r ${step.color}`}>
                        {step.t}
                      </h3>
                      <p className="text-slate-300 leading-relaxed font-bold text-sm flex-1">{step.d}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Footer Button */}
              <div className="flex justify-center mt-auto relative z-20">
                <button onClick={() => { onClose(); navigate('/register'); }} className="btn-vibrant px-16 py-6 text-xl tracking-[0.2em] shadow-[0_0_40px_rgba(59,130,246,0.3)] hover:shadow-[0_0_60px_rgba(59,130,246,0.5)]">
                  Begin Free Initialization
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};


// --- ADVANCED ASYMMETRICAL BENTO BOX FEATURES ---
const FeaturesSection = () => {
  return (
    <section className="px-6 py-40 relative z-20 max-w-[1400px] mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        className="text-center mb-24"
      >
        <h2 className="text-5xl md:text-7xl font-black uppercase text-glow-soft mb-6">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-violet-400 to-cyan-400">
            Unrivaled Advanced Features.
          </span>
        </h2>
        <p className="text-xl md:text-2xl text-slate-300 font-bold max-w-4xl mx-auto uppercase tracking-wide opacity-80">
          We rebuilt the concept of incentive software from the absolute foundation, engineering a masterpiece of computational perfection.
        </p>
      </motion.div>

      {/* Bento Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-3 gap-6 auto-rows-[400px]">

        {/* 1. WIDE CARD: Quantum Sync (Spans 2 columns) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="md:col-span-2 md:row-span-1 hyper-glass p-10 relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500 flex flex-col justify-between"
        >
          <div className="absolute top-[-50%] right-[-10%] w-[500px] h-[500px] border-[40px] border-blue-500/10 rounded-full blur-[10px] group-hover:border-blue-500/30 transition-colors duration-700" />
          <div className="absolute top-[-30%] right-[10%] w-[300px] h-[300px] border-[2px] border-dashed border-cyan-400/20 rounded-full animate-[spin_40s_linear_infinite]" />

          <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(56,189,248,0.5)]">
            <Network className="w-8 h-8 text-white" />
          </div>
          <div className="relative z-10 max-w-lg">
            <h3 className="text-4xl font-black text-white uppercase tracking-widest mb-4">Quantum Sync Engine</h3>
            <p className="text-slate-300 text-lg leading-relaxed font-bold">
              Achieve instantaneous data harmony. Connect unlimited CRM sources and bespoke data pipelines via our zero-latency API gateways.
            </p>
          </div>
        </motion.div>

        {/* 2. TALL CARD: Neural Logic (Spans 2 rows) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
          className="md:col-span-1 md:row-span-2 hyper-glass p-10 relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500 flex flex-col"
        >
          <div className="absolute bottom-[-10%] left-[-20%] w-[400px] h-[400px] bg-gradient-to-t from-violet-600/30 to-fuchsia-500/10 rounded-full blur-[50px] group-hover:opacity-100 transition-opacity duration-700" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_100%)]" />

          <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-400 to-fuchsia-400 flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(167,139,250,0.5)]">
            <Cpu className="w-8 h-8 text-white" />
          </div>
          <div className="relative z-10 flex-1">
            <h3 className="text-3xl font-black text-white uppercase tracking-widest mb-6 border-l-4 border-violet-500 pl-4">Neural Logic Matrix</h3>
            <p className="text-slate-300 text-lg leading-relaxed font-bold">
              Transcend basic commission flat-rates. Construct hyper-complex, multi-variable incentive architectures including recursive tiers, team-splits, and time-gated gates using a purely visual interface.
            </p>
          </div>
        </motion.div>

        {/* 3. SQUARE CARD: Immutable Ledger */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
          className="md:col-span-1 md:row-span-1 hyper-glass p-8 relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-teal-500/0 to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center shadow-lg">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-white uppercase tracking-widest mb-3">Immutable Ledger</h3>
              <p className="text-slate-300 font-bold leading-relaxed text-sm">
                Cryptographically secure ledgers ensure zero disputes, total auditability, and perfect historical recall.
              </p>
            </div>
          </div>
        </motion.div>

        {/* 4. SQUARE CARD: Predictive AI */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
          className="md:col-span-1 md:row-span-1 hyper-glass p-8 relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500"
        >
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-amber-500/20 blur-[40px] rounded-full group-hover:scale-150 transition-transform duration-700" />
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center shadow-lg">
              <LineChart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-white uppercase tracking-widest mb-3">Predictive AI</h3>
              <p className="text-slate-300 font-bold leading-relaxed text-sm">
                Run trillion-parameter monte-carlo simulations to forecast financial outcomes before deploying policies.
              </p>
            </div>
          </div>
        </motion.div>

        {/* 5. TALL WIDE CARD: Global Currency Routing (Spans 2 columns) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
          className="md:col-span-2 md:row-span-1 hyper-glass p-10 relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500 flex flex-col md:flex-row items-center gap-10"
        >
          {/* Abstract Globe Visual */}
          <div className="w-48 h-48 shrink-0 relative flex items-center justify-center">
            <div className="absolute inset-0 bg-pink-500/20 rounded-full blur-[30px] group-hover:bg-pink-500/40 transition-colors duration-700" />
            <Globe className="w-32 h-32 text-pink-400 absolute animate-[spin_20s_linear_infinite]" />
            <div className="w-40 h-40 border border-white/20 rounded-full absolute border-dashed animate-[spin_15s_linear_infinite_reverse]" />
            <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-red-500 rounded-full absolute shadow-[0_0_40px_rgba(244,114,182,0.8)] z-10" />
          </div>

          <div className="relative z-10">
            <h3 className="text-4xl font-black text-white uppercase tracking-widest mb-4">Global Currency Routing</h3>
            <p className="text-slate-300 text-lg leading-relaxed font-bold">
              Deploy to international teams effortlessly. The engine automatically handles real-time FX conversions, localized tax implications, and multi-territory payout routing intelligently.
            </p>
          </div>
        </motion.div>

        {/* 6. SQUARE CARD: Zero-Latency Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.5 }}
          className="md:col-span-1 md:row-span-1 hyper-glass p-8 relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500 flex flex-col justify-between border-t-4 border-t-yellow-400"
        >
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-[0_0_30px_rgba(250,204,21,0.4)] mb-6">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white uppercase tracking-widest mb-3">Zero-Latency Speed</h3>
            <p className="text-slate-300 font-bold leading-relaxed text-sm">
              Empower your workforce with absolute clarity via ultra-premium, real-time dashboards detailing exact earnings velocity.
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
};


// --- MAIN APPLICATION LANDING PAGE ---

const LandingPage = () => {
  const navigate = useNavigate();
  const [guideOpen, setGuideOpen] = useState(false);
  const { scrollYProgress } = useScroll();

  const handleGetStarted = () => navigate('/register');
  const handleSignIn = () => navigate('/login');

  return (
    <div className="dark min-h-screen bg-[#0f172a] text-slate-100 font-sans overflow-x-hidden relative selection:bg-cyan-500/40">

      <AuroraBackground />

      {/* --- PREMIUM NAVBAR --- */}
      <nav className="fixed top-0 left-0 right-0 z-[100] px-8 py-6 flex items-center justify-between border-b border-white/10 bg-white/[0.02] backdrop-blur-2xl">
        <div className="flex items-center gap-4 cursor-pointer">
          <AppIcon size="w-10 h-10" />
          <span className="text-2xl font-black tracking-widest text-white uppercase text-glow-soft hidden sm:block">
            Sales Reward Engine
          </span>
        </div>
        <div className="flex items-center gap-6">
          <button onClick={handleSignIn} className="text-sm font-black uppercase tracking-widest text-slate-300 hover:text-white transition-colors">Log In</button>
          <button onClick={handleGetStarted} className="btn-vibrant px-6 py-2.5 text-xs">Initialize System</button>
        </div>
      </nav>

      <main className="relative z-30 pt-32">

        {/* --- 3D INTERACTIVE HERO --- */}
        <motion.section
          className="min-h-[90vh] flex flex-col items-center justify-center px-6 relative"
        >
          {/* Mouse-Reactive Glass Panel containing the core hero content */}
          <TiltCard className="max-w-7xl mx-auto w-full text-center relative z-20">

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="py-16 md:py-24"
            >
              {/* Refined Badge */}
              <div className="inline-flex items-center gap-3 px-6 py-2 mb-12 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-white font-black text-sm uppercase tracking-widest shadow-xl">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                The Benchmark of Enterprise Incentive Software
              </div>

              {/* Eye-Pleasing Continuous Gradient Text */}
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[7.5rem] font-black uppercase leading-[0.9] tracking-tighter mb-8 text-glow-soft">
                <span className="text-white">Orchestrate</span> <br />
                <span className="text-gradient-vibrant drop-shadow-2xl">
                  Flawless Growth.
                </span>
              </h1>

              <p className="text-lg md:text-xl text-slate-200 font-bold uppercase tracking-widest max-w-4xl mx-auto mb-16 leading-relaxed text-balance">
                Design, execute, and scale the most complex commission architectures imaginable through an interface of absolute pure clarity.
              </p>

              {/* --- ELEGANT CTAS --- */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12 w-full max-w-4xl mx-auto">

                {/* 1. Get Started (Vibrant) */}
                <button
                  onClick={handleGetStarted}
                  className="btn-vibrant px-8 py-4 group min-w-[200px]"
                >
                  <Zap className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  <span className="text-lg mt-0.5">Get Started</span>
                </button>

                {/* 2. Sign In (Glass) */}
                <button
                  onClick={handleSignIn}
                  className="btn-glass-outline px-8 py-4 group min-w-[200px]"
                >
                  <Lock className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  <span className="text-lg mt-0.5">Sign In</span>
                </button>

                {/* 3. How to Use (Glass) */}
                <button
                  onClick={() => setGuideOpen(true)}
                  className="btn-glass-outline px-8 py-4 group min-w-[200px]"
                >
                  <PlayCircle className="w-6 h-6 group-hover:scale-110 transition-transform text-cyan-400" />
                  <span className="text-lg mt-0.5 text-cyan-400">How It Works</span>
                </button>

              </div>
            </motion.div>
          </TiltCard>
        </motion.section>

        {/* --- MASSIVELY EXPANDED ADVANCED FEATURES SECTION --- */}
        <FeaturesSection />

      </main>

      <ElegantGuide isOpen={guideOpen} onClose={() => setGuideOpen(false)} />

      {/* --- FOOTER --- */}
      <footer className="py-20 border-t border-white/10 relative z-30 bg-white/[0.02] backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-6">
            <AppIcon size="w-10 h-10" opacity="1" />
            <span className="text-2xl font-black tracking-widest text-slate-300 uppercase">Sales Reward Engine</span>
          </div>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">
            Designed for absolute performance.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
