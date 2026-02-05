"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const experiences = [
  {
    id: 1,
    title: "MSc HCI - University College Dublin",
    period: "Sept 2025 - Sept 2026",
    description:
      "Deepening expertise in design thinking, user research, AR/VR development, and human-centered design for social impact.",
    tags: ["UX Research", "Design Thinking", "AR/VR Development"],
    color: "violet",
  },
  {
    id: 2,
    title: "Research Intern - Malaviya National Institute of Technology Jaipur",
    period: "Jan 2024 - July 2024",
    description:
      "AI-driven traffic and emergency healthcare prediction system for AMRUT Government Project. Published research on memory-driven transformer architecture.",
    tags: ["Deep Learning", "AI", "System Design"],
    color: "cyan",
  },
  {
    id: 3,
    title: "Snapchat Opinion Leader - Under 25 Universe",
    period: "Oct 2023 - Sept 2025",
    description:
      "Creating social impact content and leading community conversations as Snapchat Opinion Leader through creative storytelling and digital media.",
    tags: ["Content Creation", "Social Impact", "Community Leadership"],
    color: "emerald",
  },
  {
    id: 4,
    title: "Industrial Training - Mangalore Refinery & Petrochemicals LTD",
    period: "June 2023 - July 2023",
    description:
      "Developed web-based food order management system for business meetings. Streamlined vendor coordination with intuitive interface using Java, HTML, CSS, JavaScript.",
    tags: ["Full-Stack Development", "UX Design", "System Integration"],
    color: "pink",
  },
  {
    id: 5,
    title: "General Secretary - Humans of Manipal Jaipur",
    period: "Oct 2022 - April 2023",
    description:
      "Led storytelling initiative capturing human experiences across campus. Previously served as Head of Design, Interview Head, and Working Team member.",
    tags: ["Team Leadership", "Content Strategy", "Design Direction"],
    color: "violet",
  },
  {
    id: 6,
    title: "Design Internship - i3 minds LLP",
    period: "Dec 2022 - Jan 2023",
    description:
      "Visual redesign of company branding and digital presence including logo upgrade, website graphics design, and social media pages redesign.",
    tags: ["Graphic Design", "Brand Identity", "Social Media Design"],
    color: "cyan",
  },
  {
    id: 7,
    title: "Transitional Readiness Wingman - Make A Difference",
    period: "Nov 2021 - Sept 2025",
    description:
      "Mentoring and supporting youth in their personal growth journey. Helping individuals navigate life challenges and achieve their goals through guidance and support.",
    tags: ["Youth Mentorship", "Social Impact", "Community Support"],
    color: "emerald",
  },
];

const colorMap: Record<string, { dot: string; border: string; bg: string; glow: string }> = {
  violet: {
    dot: "bg-violet-500",
    border: "border-violet-500/30",
    bg: "bg-violet-500/10",
    glow: "shadow-violet-500/30",
  },
  cyan: {
    dot: "bg-cyan-500",
    border: "border-cyan-500/30",
    bg: "bg-cyan-500/10",
    glow: "shadow-cyan-500/30",
  },
  emerald: {
    dot: "bg-emerald-500",
    border: "border-emerald-500/30",
    bg: "bg-emerald-500/10",
    glow: "shadow-emerald-500/30",
  },
  pink: {
    dot: "bg-pink-500",
    border: "border-pink-500/30",
    bg: "bg-pink-500/10",
    glow: "shadow-pink-500/30",
  },
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

// Timeline dot component with pulse animation
function TimelineDot({ color, isInView }: { color: string; isInView: boolean }) {
  const colors = colorMap[color];
  
  return (
    <div className="absolute left-4 md:left-1/2 w-8 h-8 -ml-2 md:-translate-x-1/2 z-10 flex items-center justify-center">
      {/* Outer pulse ring */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={isInView ? { 
          scale: [1, 1.5, 1], 
          opacity: [0.3, 0, 0.3]
        } : {}}
        transition={{ 
          duration: 2, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className={`absolute inset-0 rounded-full ${colors.dot}`}
      />
      
      {/* Inner dot */}
      <motion.div
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : {}}
        transition={{ duration: 0.4, delay: 0.2, type: "spring", stiffness: 200 }}
        className={`w-4 h-4 rounded-full ${colors.dot} ring-4 ring-background shadow-lg ${colors.glow}`}
      />
    </div>
  );
}

export function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="py-20 md:py-32 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-1/2 right-0 w-1/4 h-1/4 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-primary font-medium tracking-wide uppercase text-sm mb-4"
          >
            Journey
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground text-balance"
          >
            Experience & Education
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-4 text-muted-foreground max-w-2xl mx-auto"
          >
            A timeline of my professional journey, academic pursuits, and
            community involvement.
          </motion.p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Glowing vertical line */}
          <motion.div 
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : {}}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{ transformOrigin: "top" }}
            className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 md:-translate-x-1/2"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-primary via-accent to-primary opacity-50" />
            <div className="absolute inset-0 bg-gradient-to-b from-primary via-accent to-primary blur-sm" />
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="space-y-8 md:space-y-16"
          >
            {experiences.map((exp, index) => {
              const colors = colorMap[exp.color];
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={exp.id}
                  variants={itemVariants}
                  className="relative flex flex-col md:flex-row items-start"
                >
                  {/* Enhanced Dot with pulse animation */}
                  <TimelineDot color={exp.color} isInView={isInView} />

                  {/* Connector line to card */}
                  <motion.div 
                    initial={{ scaleX: 0 }}
                    animate={isInView ? { scaleX: 1 } : {}}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                    style={{ transformOrigin: isEven ? "right" : "left" }}
                    className={`hidden md:block absolute top-4 w-8 h-px ${colors.dot} opacity-50 ${
                      isEven ? "right-1/2 mr-4" : "left-1/2 ml-4"
                    }`}
                  />

                  {/* Content */}
                  <div
                    className={`ml-14 md:ml-0 md:w-[calc(50%-2rem)] ${
                      isEven ? "md:pr-4 md:text-right md:mr-auto" : "md:pl-4 md:ml-auto"
                    }`}
                  >
                    <motion.div
                      whileHover={{ scale: 1.02, y: -4 }}
                      transition={{ duration: 0.3 }}
                      className={`relative p-6 rounded-2xl bg-card/80 backdrop-blur-md border ${colors.border} group
                        hover:bg-card hover:shadow-xl hover:${colors.glow}
                        transition-all duration-300 cursor-default overflow-hidden`}
                    >
                      {/* Gradient accent */}
                      <div className={`absolute top-0 ${isEven ? 'right-0' : 'left-0'} w-1 h-full ${colors.dot}`} />
                      
                      {/* Date badge */}
                      <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${colors.bg} text-foreground mb-3`}>
                        {exp.period}
                      </span>
                      
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors leading-tight">
                        {exp.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mt-3 leading-relaxed">
                        {exp.description}
                      </p>
                      <div
                        className={`flex flex-wrap gap-2 mt-4 ${
                          isEven ? "md:justify-end" : ""
                        }`}
                      >
                        {exp.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2.5 py-1 text-xs font-medium text-muted-foreground bg-secondary/80 rounded-full border border-border/50 hover:border-primary/30 hover:text-foreground transition-colors"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
