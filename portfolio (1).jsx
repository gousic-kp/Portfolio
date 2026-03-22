import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from "framer-motion";

// ── Utility: 3D tilt hook ──────────────────────────────────────────────────
function useTilt() {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = -((e.clientY - rect.top) / rect.height - 0.5) * 20;
    setTilt({ x, y });
  };
  const reset = () => setTilt({ x: 0, y: 0 });

  return { ref, tilt, handleMove, reset };
}

// ── Section reveal wrapper ─────────────────────────────────────────────────
function Reveal({ children, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ── Tilt card ──────────────────────────────────────────────────────────────
function TiltCard({ children, className = "" }) {
  const { ref, tilt, handleMove, reset } = useTilt();
  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{
        transform: `perspective(800px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
        transition: "transform 0.1s ease",
      }}
      whileHover={{ scale: 1.02 }}
      className={`glass-card rounded-2xl p-6 cursor-default ${className}`}
    >
      {children}
    </motion.div>
  );
}

// ── Floating blob ──────────────────────────────────────────────────────────
function Blob({ style, className }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl opacity-20 pointer-events-none ${className}`}
      style={style}
      animate={{
        x: [0, 40, -20, 0],
        y: [0, -30, 20, 0],
        scale: [1, 1.1, 0.95, 1],
      }}
      transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

// ── Particle grid overlay ──────────────────────────────────────────────────
function ParticleGrid() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0"
      style={{
        backgroundImage: `radial-gradient(rgba(99,179,237,0.07) 1px, transparent 1px)`,
        backgroundSize: "40px 40px",
      }}
    />
  );
}

// ── Nav ────────────────────────────────────────────────────────────────────
const NAV = ["About", "Skills", "Education", "Projects", "Certifications", "Contact"];

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
    setActive(id);
  };

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 flex justify-center py-4 transition-all duration-500 ${
        scrolled ? "backdrop-blur-xl bg-black/40 border-b border-white/5" : ""
      }`}
    >
      <div className="flex gap-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-2 py-2">
        {NAV.map((item) => (
          <button
            key={item}
            onClick={() => scrollTo(item)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
              active === item
                ? "bg-white/20 text-white"
                : "text-white/50 hover:text-white hover:bg-white/10"
            }`}
            style={{ fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif" }}
          >
            {item}
          </button>
        ))}
      </div>
    </motion.nav>
  );
}

// ── HERO ───────────────────────────────────────────────────────────────────
function Hero() {
  const letters = "Gousic KP".split("");

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
      {/* Animated gradient ring */}
      <motion.div
        className="absolute w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{
          background: "conic-gradient(from 0deg, #0ea5e9, #6366f1, #8b5cf6, #ec4899, #0ea5e9)",
          filter: "blur(80px)",
          opacity: 0.12,
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      {/* Floating chips */}
      {[
        { label: "Python", x: -280, y: -120 },
        { label: "JavaScript", x: 280, y: -80 },
        { label: "React", x: -200, y: 160 },
        { label: "MongoDB", x: 240, y: 140 },
        { label: "C++", x: -320, y: 40 },
        { label: "IoT", x: 330, y: 20 },
      ].map(({ label, x, y }, i) => (
        <motion.div
          key={label}
          className="absolute glass-card text-xs text-white/60 px-3 py-1.5 rounded-full border border-white/10"
          style={{ x, y }}
          animate={{ y: [y, y - 12, y] }}
          transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
        >
          {label}
        </motion.div>
      ))}

      <div className="relative z-10 max-w-4xl">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="inline-flex items-center gap-2 glass-card border border-cyan-500/30 rounded-full px-4 py-2 mb-8"
        >
          <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
          <span className="text-cyan-300 text-sm font-medium tracking-widest uppercase">
            Available for Opportunities
          </span>
        </motion.div>

        {/* Name */}
        <div className="flex justify-center flex-wrap mb-4 overflow-hidden">
          {letters.map((l, i) => (
            <motion.span
              key={i}
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.04, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className={`text-7xl md:text-9xl font-black tracking-tight ${
                l === " " ? "w-8" : "gradient-text"
              }`}
              style={{ fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif" }}
            >
              {l === " " ? "\u00A0" : l}
            </motion.span>
          ))}
        </div>

        {/* Role */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.7 }}
          className="text-xl md:text-2xl text-white/50 font-light tracking-[0.15em] uppercase mb-10"
          style={{ fontFamily: "'SF Pro Text', -apple-system, sans-serif" }}
        >
          Computer Science Engineering Student
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.7 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <motion.a
            href="#projects"
            onClick={(e) => { e.preventDefault(); document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" }); }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-3.5 rounded-full font-semibold text-sm tracking-wide text-white"
            style={{ background: "linear-gradient(135deg, #0ea5e9, #6366f1)", boxShadow: "0 0 40px rgba(99,102,241,0.4)" }}
          >
            View Projects
          </motion.a>
          <motion.a
            href="mailto:kpgn1982@gmail.com"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-3.5 rounded-full font-semibold text-sm tracking-wide text-white glass-card border border-white/20 hover:border-white/40 transition-colors"
          >
            Get In Touch
          </motion.a>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 flex flex-col items-center gap-2"
      >
        <span className="text-white/30 text-xs tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-5 h-8 rounded-full border border-white/20 flex justify-center pt-1.5"
        >
          <div className="w-1 h-1.5 bg-white/40 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}

// ── ABOUT ──────────────────────────────────────────────────────────────────
function About() {
  return (
    <section id="about" className="relative py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <p className="text-cyan-400 text-sm font-semibold tracking-[0.25em] uppercase mb-4">About Me</p>
          <h2 className="text-5xl md:text-6xl font-black text-white mb-12 leading-tight">
            Building the future,<br />
            <span className="gradient-text">one line at a time.</span>
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-8">
          <Reveal delay={0.1}>
            <TiltCard>
              <p className="text-white/70 text-lg leading-relaxed">
                I am a motivated and detail-oriented Computer Science student passionate about
                programming, problem-solving, and building innovative solutions. I enjoy working
                with modern technologies, developing real-world applications, and continuously
                improving my skills.
              </p>
            </TiltCard>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Projects Built", value: "3+" },
                { label: "Certifications", value: "5+" },
                { label: "Tech Stack", value: "10+" },
                { label: "Grad Year", value: "2027" },
              ].map(({ label, value }) => (
                <TiltCard key={label} className="text-center">
                  <div className="text-3xl font-black gradient-text mb-1">{value}</div>
                  <div className="text-white/40 text-xs tracking-widest uppercase">{label}</div>
                </TiltCard>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ── SKILLS ─────────────────────────────────────────────────────────────────
const SKILLS = [
  { name: "Python", icon: "🐍", color: "#3b82f6" },
  { name: "C", icon: "⚙️", color: "#6366f1" },
  { name: "C++", icon: "🔧", color: "#8b5cf6" },
  { name: "HTML", icon: "🌐", color: "#f97316" },
  { name: "CSS", icon: "🎨", color: "#0ea5e9" },
  { name: "JavaScript", icon: "⚡", color: "#eab308" },
  { name: "MongoDB", icon: "🍃", color: "#22c55e" },
  { name: "GitHub", icon: "🐙", color: "#a855f7" },
  { name: "VS Code", icon: "💻", color: "#0ea5e9" },
  { name: "Jupyter", icon: "📓", color: "#f97316" },
];

function Skills() {
  return (
    <section id="skills" className="relative py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <p className="text-cyan-400 text-sm font-semibold tracking-[0.25em] uppercase mb-4">Skills</p>
          <h2 className="text-5xl md:text-6xl font-black text-white mb-16">My Toolkit</h2>
        </Reveal>

        <div className="flex flex-wrap gap-4">
          {SKILLS.map((skill, i) => (
            <Reveal key={skill.name} delay={i * 0.05}>
              <motion.div
                whileHover={{ scale: 1.1, y: -4 }}
                className="glass-card border border-white/10 rounded-2xl px-5 py-4 flex items-center gap-3 cursor-default group"
                style={{
                  "--glow": skill.color,
                  boxShadow: "0 0 0 transparent",
                  transition: "box-shadow 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 0 24px ${skill.color}40, 0 0 1px ${skill.color}60`;
                  e.currentTarget.style.borderColor = `${skill.color}50`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                }}
              >
                <span className="text-2xl">{skill.icon}</span>
                <span className="text-white font-semibold text-sm">{skill.name}</span>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── EDUCATION ──────────────────────────────────────────────────────────────
const EDU = [
  {
    degree: "B.Tech Computer Science Engineering",
    school: "SRM Institute of Science and Technology",
    year: "Expected 2027",
    detail: "Current Undergraduate",
    icon: "🎓",
    color: "#6366f1",
  },
  {
    degree: "Higher Secondary Certificate",
    school: "Sri Venkateshwara Matric Hr Sec School",
    year: "2023",
    detail: "70%",
    icon: "📚",
    color: "#0ea5e9",
  },
  {
    degree: "Secondary School Certificate",
    school: "Karpaga Vinay Matric Hr Sec School",
    year: "2021",
    detail: "100% — Perfect Score",
    icon: "⭐",
    color: "#22c55e",
  },
];

function Education() {
  return (
    <section id="education" className="relative py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <p className="text-cyan-400 text-sm font-semibold tracking-[0.25em] uppercase mb-4">Education</p>
          <h2 className="text-5xl md:text-6xl font-black text-white mb-16">Academic Journey</h2>
        </Reveal>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/50 via-indigo-500/30 to-transparent" />

          <div className="space-y-8">
            {EDU.map((e, i) => (
              <Reveal key={e.school} delay={i * 0.1}>
                <div className="flex gap-8 items-start">
                  {/* Dot */}
                  <div className="relative z-10 flex-shrink-0">
                    <motion.div
                      className="w-12 h-12 rounded-full glass-card border border-white/20 flex items-center justify-center text-xl"
                      style={{ boxShadow: `0 0 20px ${e.color}40` }}
                      whileHover={{ scale: 1.2 }}
                    >
                      {e.icon}
                    </motion.div>
                  </div>

                  <TiltCard className="flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h3 className="text-white font-bold text-lg mb-1">{e.degree}</h3>
                        <p className="text-white/50 text-sm mb-2">{e.school}</p>
                        <span
                          className="text-xs font-bold px-3 py-1 rounded-full"
                          style={{ background: `${e.color}20`, color: e.color, border: `1px solid ${e.color}40` }}
                        >
                          {e.detail}
                        </span>
                      </div>
                      <span className="text-white/30 text-sm font-mono">{e.year}</span>
                    </div>
                  </TiltCard>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── PROJECTS ───────────────────────────────────────────────────────────────
const PROJECTS = [
  {
    title: "Smart Home Electricity Management",
    desc: "IoT-based system to monitor and control electricity usage with real-time tracking and intelligent automation.",
    tags: ["IoT", "Automation", "Real-time"],
    icon: "🏠",
    color: "#0ea5e9",
    gradient: "from-cyan-500/20 to-blue-600/10",
  },
  {
    title: "Exam Hall Seating Arrangement Manager",
    desc: "SQL-based system for automated seat allocation, duplicate prevention, and capacity management across exam halls.",
    tags: ["SQL", "Database", "Automation"],
    icon: "📋",
    color: "#8b5cf6",
    gradient: "from-violet-500/20 to-purple-600/10",
  },
  {
    title: "AI Chatbot for E-Commerce",
    desc: "NLP-powered chatbot delivering intelligent product suggestions, FAQ handling, and seamless customer support.",
    tags: ["NLP", "AI", "E-Commerce"],
    icon: "🤖",
    color: "#22c55e",
    gradient: "from-emerald-500/20 to-green-600/10",
  },
];

function Projects() {
  return (
    <section id="projects" className="relative py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <p className="text-cyan-400 text-sm font-semibold tracking-[0.25em] uppercase mb-4">Projects</p>
          <h2 className="text-5xl md:text-6xl font-black text-white mb-16">What I've Built</h2>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-6">
          {PROJECTS.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.12}>
              <TiltCard className={`h-full bg-gradient-to-br ${p.gradient} relative overflow-hidden group`}>
                {/* Glow */}
                <div
                  className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500"
                  style={{ background: p.color }}
                />
                <div className="relative z-10">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
                    style={{ background: `${p.color}20`, border: `1px solid ${p.color}30` }}
                  >
                    {p.icon}
                  </div>
                  <h3 className="text-white font-bold text-lg mb-3 leading-snug">{p.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed mb-4">{p.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {p.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2.5 py-1 rounded-full font-medium"
                        style={{ background: `${p.color}15`, color: p.color, border: `1px solid ${p.color}30` }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── CERTIFICATIONS ─────────────────────────────────────────────────────────
const CERTS = [
  { title: "MongoDB Developer", platform: "MongoDB University", icon: "🍃", color: "#22c55e" },
  { title: "Web Development", platform: "Coursera", icon: "🌐", color: "#0ea5e9" },
  { title: "Data Structures", platform: "HackerRank", icon: "🧠", color: "#f97316" },
  { title: "Python Programming", platform: "HackerRank", icon: "🐍", color: "#6366f1" },
  { title: "Real-World Applications", platform: "Coursera", icon: "🚀", color: "#8b5cf6" },
];

function Certifications() {
  return (
    <section id="certifications" className="relative py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <p className="text-cyan-400 text-sm font-semibold tracking-[0.25em] uppercase mb-4">Certifications</p>
          <h2 className="text-5xl md:text-6xl font-black text-white mb-16">Credentials</h2>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CERTS.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.08}>
              <motion.div
                whileHover={{ scale: 1.03, y: -4 }}
                className="glass-card rounded-2xl p-5 flex items-center gap-4 border border-white/10 group"
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 0 30px ${c.color}30`;
                  e.currentTarget.style.borderColor = `${c.color}40`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                }}
                style={{ transition: "box-shadow 0.3s, border-color 0.3s" }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: `${c.color}20` }}
                >
                  {c.icon}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{c.title}</p>
                  <p className="text-white/40 text-xs mt-0.5">{c.platform}</p>
                </div>
                <div
                  className="ml-auto w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: `${c.color}20`, color: c.color }}
                >
                  <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── CONTACT ────────────────────────────────────────────────────────────────
function Contact() {
  return (
    <section id="contact" className="relative py-32 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <Reveal>
          <p className="text-cyan-400 text-sm font-semibold tracking-[0.25em] uppercase mb-4">Contact</p>
          <h2 className="text-5xl md:text-7xl font-black text-white mb-6">
            Let's <span className="gradient-text">Connect</span>
          </h2>
          <p className="text-white/40 text-lg mb-12 max-w-xl mx-auto">
            Open to internships, collaborations, and exciting projects. Feel free to reach out!
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <motion.a
              href="mailto:kpgn1982@gmail.com"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-3 px-8 py-4 rounded-2xl text-white font-semibold"
              style={{ background: "linear-gradient(135deg, #0ea5e9, #6366f1)", boxShadow: "0 0 40px rgba(99,102,241,0.35)" }}
            >
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2">
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              kpgn1982@gmail.com
            </motion.a>

            <motion.a
              href="https://www.linkedin.com/in/gosuic-kp-02511a29b"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-3 px-8 py-4 rounded-2xl text-white font-semibold glass-card border border-white/20 hover:border-cyan-500/40 transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-cyan-400">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              LinkedIn Profile
            </motion.a>
          </div>

          <div className="flex flex-wrap gap-6 justify-center text-white/30 text-sm">
            <span>📞 +91 9360386495</span>
            <span>📍 Tamil Nadu, India</span>
            <span>🎓 SRM IST — Class of 2027</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ── FOOTER ─────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="py-8 text-center border-t border-white/5">
      <p className="text-white/20 text-sm">
        © 2025 Gousic KP — Crafted with passion & precision
      </p>
    </footer>
  );
}

// ── ROOT ───────────────────────────────────────────────────────────────────
export default function Portfolio() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }

        body {
          background: #020408;
          color: white;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          overflow-x: hidden;
        }

        .gradient-text {
          background: linear-gradient(135deg, #38bdf8, #818cf8, #c084fc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .glass-card {
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.08);
        }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.4); border-radius: 2px; }
      `}</style>

      <div className="relative min-h-screen">
        {/* Background effects */}
        <ParticleGrid />

        {/* Animated gradient bg */}
        <motion.div
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(99,102,241,0.12) 0%, transparent 70%)",
          }}
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Blobs */}
        <Blob className="w-96 h-96 bg-indigo-600" style={{ top: "10%", left: "-5%" }} />
        <Blob className="w-80 h-80 bg-cyan-500" style={{ top: "20%", right: "-5%" }} />
        <Blob className="w-72 h-72 bg-violet-600" style={{ top: "60%", left: "30%" }} />
        <Blob className="w-64 h-64 bg-blue-500" style={{ bottom: "10%", right: "10%" }} />

        {/* Content */}
        <div className="relative z-10">
          <Nav />
          <Hero />
          <About />
          <Skills />
          <Education />
          <Projects />
          <Certifications />
          <Contact />
          <Footer />
        </div>
      </div>
    </>
  );
}
