"use client";

import { useEffect, useRef, useState } from "react";

const skills = [
  { name: "AR/VR Development", percentage: 90 },
  { name: "Web Development", percentage: 85 },
  { name: "UX/UI Design", percentage: 88 },
  { name: "Research & Analysis", percentage: 92 },
  { name: "Graphic Design", percentage: 80 },
  { name: "Community Leadership", percentage: 85 },
];

export function About() {
  const [isVisible, setIsVisible] = useState(false);
  const [animateSkills, setAnimateSkills] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setTimeout(() => setAnimateSkills(true), 500);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="py-20 md:py-32 relative overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Column - Bio */}
          <div
            className={`space-y-8 transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="space-y-4">
              <p className="text-primary font-medium tracking-wide uppercase text-sm">
                About Me
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground text-balance">
                Bridging Technology & Human Experience
              </h2>
            </div>

            <div className="space-y-6 text-muted-foreground leading-relaxed">
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
                UX design, I bring a multidisciplinary approach to every
                project. My work has been recognized through publications in
                prestigious conferences including IEEE and Springer, reflecting
                my commitment to rigorous research and innovation.
              </p>
              <p className="text-base lg:text-lg">
                Beyond technical skills, I&apos;m driven by the belief that
                technology should serve humanity. Whether it&apos;s developing
                healthcare solutions, creating immersive experiences, or
                mentoring youth, I strive to make a positive impact through
                every endeavor.
              </p>
            </div>
          </div>

          {/* Right Column - Skills */}
          <div
            className={`flex items-center justify-center transition-all duration-1000 delay-200 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            {/* Glassmorphism card */}
            <div className="relative p-8 lg:p-10 rounded-3xl bg-card/50 backdrop-blur-xl border border-border/50 shadow-2xl w-full max-w-lg">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20 rounded-3xl blur-xl opacity-50 pointer-events-none" />
              
              <div className="relative space-y-8">
                <h3 className="text-2xl lg:text-3xl font-bold text-foreground">
                  Skills & Expertise
                </h3>
                
                <div className="space-y-6">
                  {skills.map((skill, index) => (
                    <div key={skill.name} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-foreground font-medium">
                          {skill.name}
                        </span>
                        <span className="text-primary font-semibold text-sm px-2 py-1 rounded-full bg-primary/10">
                          {skill.percentage}%
                        </span>
                      </div>
                      <div className="h-3 bg-secondary/80 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary via-primary to-accent rounded-full transition-all duration-1000 ease-out relative"
                          style={{
                            width: animateSkills ? `${skill.percentage}%` : "0%",
                            transitionDelay: `${index * 100}ms`,
                          }}
                        >
                          {/* Shimmer effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                        </div>
                      </div>
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
