"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

// Skill icons as SVG components
const skillIcons: Record<string, React.ReactNode> = {
  Unity: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <path d="M10.4 17.8l-6.2-4.5 2.5-4.4 5.6 1 4.4-7.6h5L17 10l4.6 7.7h-5l-4.3-7.6-5.5.9 2.6 4.6z" />
    </svg>
  ),
  React: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <path d="M12 13.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
      <path
        fillRule="evenodd"
        d="M12 9.5c4.14 0 7.5-1.93 7.5-3.5 0-1.57-3.36-3.5-7.5-3.5S4.5 4.43 4.5 6c0 1.57 3.36 3.5 7.5 3.5z"
        clipRule="evenodd"
      />
      <path d="M6.5 12c2.07 3.58 5.93 5.57 7.5 4.79 1.57-.78 1.57-4.79 0-9-1.57-4.21-5.43-6.21-7-4.79-1.57 1.42-2.57 5.42-.5 9z" />
      <path d="M17.5 12c-2.07 3.58-5.93 5.57-7.5 4.79-1.57-.78-1.57-4.79 0-9 1.57-4.21 5.43-6.21 7-4.79 1.57 1.42 2.57 5.42.5 9z" />
    </svg>
  ),
  Figma: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <path d="M8 24c2.2 0 4-1.8 4-4v-4H8c-2.2 0-4 1.8-4 4s1.8 4 4 4z" />
      <path d="M4 12c0-2.2 1.8-4 4-4h4v8H8c-2.2 0-4-1.8-4-4z" />
      <path d="M4 4c0-2.2 1.8-4 4-4h4v8H8C5.8 8 4 6.2 4 4z" />
      <path d="M12 0h4c2.2 0 4 1.8 4 4s-1.8 4-4 4h-4V0z" />
      <path d="M20 12c0 2.2-1.8 4-4 4s-4-1.8-4-4 1.8-4 4-4 4 1.8 4 4z" />
    </svg>
  ),
  Python: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <path d="M11.8 0c-.7 0-1.3.5-1.3 1.2v3.3c0 .7.6 1.2 1.3 1.2h.4c.7 0 1.3-.5 1.3-1.2V1.2c0-.7-.6-1.2-1.3-1.2h-.4zM6.2 5.3c-2.9 0-5.2 2.3-5.2 5.2v2.8c0 2.9 2.3 5.2 5.2 5.2h2.1v-3.9c0-1.7 1.4-3.1 3.1-3.1h5.2c1.6 0 2.9-1.3 2.9-2.9V5.5c0-1.6-1.3-2.9-2.9-2.9H6.2v2.7z" />
      <path d="M12.2 24c.7 0 1.3-.5 1.3-1.2v-3.3c0-.7-.6-1.2-1.3-1.2h-.4c-.7 0-1.3.5-1.3 1.2v3.3c0 .7.6 1.2 1.3 1.2h.4zM17.8 18.7c2.9 0 5.2-2.3 5.2-5.2v-2.8c0-2.9-2.3-5.2-5.2-5.2h-2.1v3.9c0 1.7-1.4 3.1-3.1 3.1H7.4c-1.6 0-2.9 1.3-2.9 2.9v3.1c0 1.6 1.3 2.9 2.9 2.9h10.4v-2.7z" />
    </svg>
  ),
  "AI/ML": (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <path d="M12 2a2 2 0 012 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 017 7h1.27c.34-.6.99-1 1.73-1a2 2 0 110 4c-.74 0-1.39-.4-1.73-1H19v1a7 7 0 01-7 7v1.27c.6.34 1 .99 1 1.73a2 2 0 11-4 0c0-.74.4-1.39 1-1.73V17a7 7 0 01-7-7H1.73c-.34.6-.99 1-1.73 1a2 2 0 110-4c.74 0 1.39.4 1.73 1H5a7 7 0 017-7V5.73c-.6-.34-1-.99-1-1.73a2 2 0 012-2zm0 7a5 5 0 100 10 5 5 0 000-10z" />
    </svg>
  ),
  Research: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0A4.5 4.5 0 1114 9.5 4.5 4.5 0 019.5 14z" />
    </svg>
  ),
};

// Skills data with project connections
const skills = [
  {
    name: "AR/VR Development",
    percentage: 90,
    icon: "Unity",
    projects: ["Adaptive MR Interfaces", "Lens Studio Guide"],
    color: "from-teal-500 to-cyan-500",
  },
  {
    name: "Web Development",
    percentage: 85,
    icon: "React",
    projects: ["Blood-Organ Donation System", "Portfolio Website"],
    color: "from-blue-500 to-indigo-500",
  },
  {
    name: "UX/UI Design",
    percentage: 88,
    icon: "Figma",
    projects: ["Mobile Health Apps", "Awareness Campaign"],
    color: "from-pink-500 to-rose-500",
  },
  {
    name: "AI & Machine Learning",
    percentage: 87,
    icon: "AI/ML",
    projects: ["MemFusion-Tformer", "Traffic Prediction"],
    color: "from-violet-500 to-purple-500",
  },
  {
    name: "Research & Analysis",
    percentage: 92,
    icon: "Research",
    projects: ["IEEE iMETA2025", "Springer RASESIA 2024"],
    color: "from-emerald-500 to-green-500",
  },
  {
    name: "Graphic Design",
    percentage: 80,
    icon: "Graphics",
    projects: ["Awareness Campaign", "i3 minds Branding"],
    color: "from-orange-500 to-amber-500",
  },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

// Animated counter component
function AnimatedCounter({
  value,
  duration = 2,
}: {
  value: number;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min(
        (timestamp - startTime) / (duration * 1000),
        1
      );
      setCount(Math.floor(progress * value));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [isInView, value, duration]);

  return <span ref={ref}>{count}</span>;
}

// Sparkle particle for the skill master effect
function SparkleParticle({ index }: { index: number }) {
  const size = 4 + Math.random() * 8;
  const startX = Math.random() * 100;
  const startY = Math.random() * 100;
  const delay = Math.random() * 0.8;
  const duration = 0.8 + Math.random() * 1;

  return (
    <motion.div
      className="absolute rounded-full bg-primary"
      style={{
        width: size,
        height: size,
        left: `${startX}%`,
        top: `${startY}%`,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 0],
        scale: [0, 1.5, 0],
      }}
      transition={{
        duration,
        delay,
        ease: "easeOut",
      }}
    />
  );
}

// Interactive Skill Card Component
function SkillCard({
  skill,
  index,
  isActive,
  isClicked,
  isGlowing,
  onHover,
  onLeave,
  onClick,
}: {
  skill: (typeof skills)[0];
  index: number;
  isActive: boolean;
  isClicked: boolean;
  isGlowing: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [fillWidth, setFillWidth] = useState(0);

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        setFillWidth(skill.percentage);
      }, index * 100);
      return () => clearTimeout(timer);
    }
  }, [isInView, skill.percentage, index]);

  return (
    <motion.div
      ref={ref}
      variants={itemVariants}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onClick}
      className={`group relative p-5 rounded-2xl bg-card/50 backdrop-blur-sm border cursor-pointer transition-all duration-300 ${
        isGlowing
          ? "border-primary shadow-lg shadow-primary/30 scale-[1.03]"
          : isActive
            ? "border-primary/50 shadow-lg shadow-primary/10 scale-[1.02]"
            : "border-border/50 hover:border-primary/30"
      }`}
      animate={
        isGlowing
          ? {
              boxShadow: [
                "0 0 10px rgba(139, 92, 246, 0.3)",
                "0 0 25px rgba(139, 92, 246, 0.6)",
                "0 0 10px rgba(139, 92, 246, 0.3)",
              ],
            }
          : {}
      }
      transition={
        isGlowing
          ? { boxShadow: { repeat: Infinity, duration: 1.5 } }
          : undefined
      }
    >
      {/* Gradient background on hover */}
      <div
        className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${skill.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${isGlowing ? "!opacity-20" : ""}`}
      />

      {/* Clicked indicator */}
      {isClicked && !isGlowing && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center"
        >
          <svg
            viewBox="0 0 24 24"
            className="w-3 h-3 text-primary"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </motion.div>
      )}

      <div className="relative z-10">
        {/* Icon and name */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`p-2.5 rounded-xl bg-gradient-to-br ${skill.color} text-foreground`}
          >
            {skillIcons[skill.icon]}
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-foreground text-sm">
              {skill.name}
            </h4>
          </div>
          <span
            className={`text-lg font-bold bg-gradient-to-r ${skill.color} bg-clip-text text-transparent`}
          >
            <AnimatedCounter value={skill.percentage} />%
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-secondary/80 rounded-full overflow-hidden">
          <motion.div
            className={`h-full bg-gradient-to-r ${skill.color} rounded-full relative`}
            initial={{ width: 0 }}
            animate={{ width: `${fillWidth}%` }}
            transition={{
              duration: 1,
              delay: index * 0.1,
              ease: "easeOut",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
          </motion.div>
        </div>

        {/* Project connections - shown on hover/active */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-4 mt-4 border-t border-border/30">
                <p className="text-xs text-muted-foreground mb-2 font-medium">
                  Used in projects:
                </p>
                <div className="flex flex-wrap gap-2">
                  {skill.projects.map((project) => (
                    <span
                      key={project}
                      className={`px-2.5 py-1 text-xs font-medium rounded-full bg-gradient-to-r ${skill.color} text-foreground`}
                    >
                      {project}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [activeSkill, setActiveSkill] = useState<number | null>(null);
  const [clickedSkills, setClickedSkills] = useState<Set<number>>(new Set());
  const [skillMasterFound, setSkillMasterFound] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);
  const [showBadge, setShowBadge] = useState(false);

  // Check if already found from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("portfolio-eggs-found");
      if (saved) {
        try {
          const found = new Set(JSON.parse(saved));
          if (found.has(3)) {
            setSkillMasterFound(true);
          }
        } catch {
          // ignore
        }
      }
    }
  }, []);

  const handleSkillHover = useCallback((index: number) => {
    setActiveSkill(index);
  }, []);

  const handleSkillLeave = useCallback(() => {
    setActiveSkill(null);
  }, []);

  const handleSkillClick = useCallback(
    (index: number) => {
      setActiveSkill((prev) => (prev === index ? null : index));

      if (skillMasterFound) return;

      setClickedSkills((prev) => {
        const next = new Set([...prev, index]);
        // Check if all 6 skills have been clicked
        if (next.size === skills.length) {
          setSkillMasterFound(true);
          setShowSparkles(true);
          setShowBadge(true);

          // Dispatch custom event to notify chatbot
          window.dispatchEvent(
            new CustomEvent("easterEggFound", {
              detail: { eggId: 3, eggName: "SKILL MASTER" },
            })
          );

          // Hide sparkles after 4 seconds
          setTimeout(() => {
            setShowSparkles(false);
          }, 4000);

          // Hide badge after 6 seconds
          setTimeout(() => {
            setShowBadge(false);
          }, 6000);
        }
        return next;
      });
    },
    [skillMasterFound]
  );

  return (
    <section
      ref={sectionRef}
      id="about"
      className="py-20 md:py-32 relative overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      {/* Skill Master badge */}
      <AnimatePresence>
        {showBadge && (
          <motion.div
            initial={{ opacity: 0, scale: 0, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] pointer-events-none"
          >
            <div className="px-8 py-5 rounded-2xl bg-gradient-to-br from-primary/90 to-accent/90 backdrop-blur-sm border border-primary/50 shadow-2xl shadow-primary/30">
              <div className="flex items-center gap-3">
                <span className="text-3xl" role="img" aria-label="lightning">
                  {"⚡"}
                </span>
                <div>
                  <p className="text-lg font-bold text-primary-foreground">
                    Skill Master!
                  </p>
                  <p className="text-xs text-primary-foreground/80">
                    You clicked all 6 skills!
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Column - Bio */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-primary font-medium tracking-wide uppercase text-sm"
              >
                About Me
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground text-balance"
              >
                Bridging Technology & Human Experience
              </motion.h2>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-6 text-muted-foreground leading-relaxed"
            >
              <p className="text-base lg:text-lg">
                My journey in Human-Computer Interaction began with a deep
                fascination for how technology can enhance and transform human
                experiences. Currently pursuing my MSc in HCI at University
                College Dublin, I&apos;m passionate about creating digital
                solutions that are not only functional but also deeply
                meaningful.
              </p>
              <p className="text-base lg:text-lg">
                With a background spanning AR/VR development, AI research, and
                UX design, I bring a multidisciplinary approach to every project.
                My work has been recognized through publications in prestigious
                conferences including IEEE and Springer, reflecting my commitment
                to rigorous research and innovation.
              </p>
              <p className="text-base lg:text-lg">
                Beyond technical skills, I&apos;m driven by the belief that
                technology should serve humanity. Whether it&apos;s developing
                healthcare solutions, creating immersive experiences, or
                mentoring youth, I strive to make a positive impact through every
                endeavor.
              </p>
            </motion.div>
          </motion.div>

          {/* Right Column - Interactive Skills */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-start justify-center"
          >
            {/* Glassmorphism card */}
            <div className="relative p-6 lg:p-8 rounded-3xl bg-card/50 backdrop-blur-xl border border-border/50 shadow-2xl w-full max-w-lg">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20 rounded-3xl blur-xl opacity-50 pointer-events-none" />

              {/* Sparkles overlay on skill master */}
              <AnimatePresence>
                {showSparkles && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-20 pointer-events-none overflow-hidden rounded-3xl"
                  >
                    {Array.from({ length: 30 }).map((_, i) => (
                      <SparkleParticle key={i} index={i} />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="relative space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl lg:text-3xl font-bold text-foreground">
                    Skills & Expertise
                  </h3>
                  <span className="text-xs text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full">
                    {skillMasterFound
                      ? "Skill Master!"
                      : `Tap to explore (${clickedSkills.size}/${skills.length})`}
                  </span>
                </div>

                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                  className="space-y-4"
                >
                  {skills.map((skill, index) => (
                    <SkillCard
                      key={skill.name}
                      skill={skill}
                      index={index}
                      isActive={activeSkill === index}
                      isClicked={clickedSkills.has(index)}
                      isGlowing={skillMasterFound}
                      onHover={() => handleSkillHover(index)}
                      onLeave={handleSkillLeave}
                      onClick={() => handleSkillClick(index)}
                    />
                  ))}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
