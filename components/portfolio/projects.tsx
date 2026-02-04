"use client";

import { useEffect, useRef, useState } from "react";
import { ExternalLink, Github, Sparkles, Brain, Activity, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const projects = [
  {
    id: 0,
    title: "Adaptive and Invisible Interfaces in Mixed Reality",
    category: "HCI Research | Mixed Reality",
    description:
      "Novel mixed reality system reducing cognitive friction through physiologically-adaptive interfaces. Three-pillar framework: (1) Spatial Representation using 3D Gaussian Splatting, (2) Embodied Inputs via natural hand tracking, (3) Emotional Awareness through real-time HRV monitoring. System dynamically simplifies interface complexity when cognitive overload is detected. Built in Unity 6 for Meta Quest 3 with Polar H10 Bluetooth integration. Research compares static vs adaptive interfaces measuring completion time, error rates, and NASA-TLX scores.",
    tags: ["Unity 6", "Meta Quest 3", "3D Gaussian Splatting", "Hand Tracking", "Physiological Computing", "HRV Monitoring", "Affective Computing", "Mixed Reality", "Adaptive Interfaces"],
    status: "In Development",
    badge: "CHI 2027",
    gradient: "from-teal-500/30 via-cyan-500/20 to-emerald-500/20",
    borderColor: "hover:border-teal-400/60",
    accentColor: "teal",
    size: "featured",
    highlights: [
      { icon: "pillars", label: "3-Pillar Framework" },
      { icon: "brain", label: "Cognitive Load Detection" },
      { icon: "activity", label: "Physiological Monitoring" },
    ],
    actions: [
      { label: "Research Details", type: "primary" },
      { label: "Collaborate", type: "secondary" },
    ],
  },
  {
    id: 1,
    title: "MemFusion-Tformer",
    category: "AI Research",
    description:
      "Memory-Driven Cross-Attention for Dynamic Congestion Prediction in Urban Networks. Advanced transformer architecture using memory-driven mechanisms for urban traffic prediction.",
    tags: ["Deep Learning", "Transformer Architecture", "Urban Analytics", "AI"],
    status: "Accepted - IEEE iMETA2025",
    gradient: "from-violet-500/20 to-purple-500/20",
    borderColor: "hover:border-violet-500/50",
    size: "large",
  },
  {
    id: 2,
    title: "Mobile Health Apps & Network Integration",
    category: "Healthcare Technology",
    description:
      "Research on integrating mobile health applications with network systems to revolutionize healthcare delivery. Presented at NIT Kurukshetra international conference.",
    tags: ["Mobile Health", "Network Integration", "Healthcare Systems"],
    status: "Published - Springer RASESIA 2024",
    gradient: "from-cyan-500/20 to-blue-500/20",
    borderColor: "hover:border-cyan-500/50",
    size: "medium",
  },
  {
    id: 3,
    title: "Lens Studio Beginners' Guide",
    category: "Augmented Reality",
    description:
      "Comprehensive tutorial repository for creating Snapchat AR lenses. Features public Headspin Tiara lens with detailed Notion documentation.",
    tags: ["Snapchat", "Lens Studio", "AR", "Tutorial"],
    status: "Live & Public",
    gradient: "from-pink-500/20 to-rose-500/20",
    borderColor: "hover:border-pink-500/50",
    size: "medium",
    links: [
      {
        label: "Try Lens",
        url: "https://www.snapchat.com/lens/9cc9beb63b6a404583096ff3838a71d9",
      },
    ],
  },
  {
    id: 4,
    title: "Blood-Organ Donation System",
    category: "Healthcare Development",
    description:
      "Web-based management system streamlining blood and organ donations, coordinating donors, recipients, and healthcare organizations.",
    tags: ["PHP", "JavaScript", "MySQL"],
    status: "Completed - July 2023",
    gradient: "from-emerald-500/20 to-green-500/20",
    borderColor: "hover:border-emerald-500/50",
    size: "small",
    github: "https://github.com/justani02/beyond-1-life",
  },
  {
    id: 5,
    title: "Web Vulnerability Analysis",
    category: "Cybersecurity",
    description:
      "Specialized security risk identification in web applications using automated and manual tools to prevent data theft and unauthorized access.",
    tags: ["Nessus", "OWASP ZAP", "Burp Suite"],
    status: "Ongoing Research",
    gradient: "from-purple-500/20 to-indigo-500/20",
    borderColor: "hover:border-purple-500/50",
    size: "small",
  },
  {
    id: 6,
    title: "Sexual Harassment Awareness Campaign",
    category: "Social Impact Design",
    description:
      "Visual narrative series of 3 digital artworks depicting journey through trauma and resilience, raising awareness about lasting impacts.",
    tags: ["Digital Art", "Social Impact", "Visual Storytelling"],
    status: "Completed - 2022",
    gradient: "from-orange-500/20 to-amber-500/20",
    borderColor: "hover:border-orange-500/50",
    size: "small",
  },
];

export function Projects() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="py-20 md:py-32 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <p className="text-primary font-medium tracking-wide uppercase text-sm mb-4">
            Portfolio
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground text-balance">
            Featured Projects
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            A collection of my work spanning AI research, healthcare technology,
            augmented reality, and social impact design.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => {
            const isFeatured = project.size === "featured";
            
            return (
              <div
                key={project.id}
                className={`group relative rounded-3xl bg-card backdrop-blur-sm border transition-all duration-500 hover:-translate-y-2 overflow-hidden ${
                  isFeatured
                    ? "col-span-1 md:col-span-2 lg:col-span-3 border-teal-500/30 hover:border-teal-400/60"
                    : `border-border ${project.borderColor}`
                } ${
                  project.size === "large"
                    ? "md:col-span-2 lg:col-span-2"
                    : project.size === "medium"
                    ? "md:col-span-1"
                    : ""
                } ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Gradient Background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${project.gradient} ${
                    isFeatured ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  } transition-opacity duration-500`}
                />
                
                {/* Featured glow effect */}
                {isFeatured && (
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 via-cyan-500/10 to-teal-500/5 animate-pulse" />
                )}

                {/* Content */}
                <div className={`relative z-10 h-full flex flex-col ${isFeatured ? "p-8 sm:p-10 lg:p-12" : "p-6 sm:p-8"}`}>
                  <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        isFeatured 
                          ? "text-teal-300 bg-teal-500/20 border border-teal-500/30" 
                          : "text-primary bg-primary/10"
                      }`}>
                        {project.category}
                      </span>
                      {project.badge && (
                        <span className="px-3 py-1 text-xs font-bold text-cyan-200 bg-cyan-500/20 border border-cyan-400/40 rounded-full flex items-center gap-1.5">
                          <Sparkles className="w-3 h-3" />
                          {project.badge}
                        </span>
                      )}
                    </div>
                    <span className={`text-xs ${isFeatured ? "text-teal-300/80" : "text-muted-foreground"}`}>
                      {project.status}
                    </span>
                  </div>

                  <h3 className={`font-bold text-foreground mb-3 transition-colors text-balance ${
                    isFeatured 
                      ? "text-2xl sm:text-3xl lg:text-4xl group-hover:text-teal-300" 
                      : "text-xl sm:text-2xl group-hover:text-primary"
                  }`}>
                    {project.title}
                  </h3>

                  <p className={`text-muted-foreground leading-relaxed mb-6 ${
                    isFeatured ? "text-base lg:text-lg max-w-4xl" : "text-sm flex-grow"
                  }`}>
                    {project.description}
                  </p>

                  {/* Highlights for featured project */}
                  {isFeatured && project.highlights && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                      {project.highlights.map((highlight) => (
                        <div
                          key={highlight.label}
                          className="flex items-center gap-3 p-4 rounded-xl bg-teal-500/10 border border-teal-500/20"
                        >
                          {highlight.icon === "pillars" && <Sparkles className="w-5 h-5 text-teal-400" />}
                          {highlight.icon === "brain" && <Brain className="w-5 h-5 text-cyan-400" />}
                          {highlight.icon === "activity" && <Activity className="w-5 h-5 text-emerald-400" />}
                          <span className="text-sm font-medium text-foreground">{highlight.label}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className={`space-y-4 ${isFeatured ? "" : "mt-auto"}`}>
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {project.tags.slice(0, isFeatured ? undefined : project.tags.length).map((tag) => (
                        <span
                          key={tag}
                          className={`px-2 py-1 text-xs rounded-md ${
                            isFeatured 
                              ? "text-teal-200/80 bg-teal-500/10 border border-teal-500/20" 
                              : "text-muted-foreground bg-secondary"
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3 pt-2">
                      {/* Featured project actions */}
                      {isFeatured && project.actions?.map((action) => (
                        <Button
                          key={action.label}
                          size={isFeatured ? "default" : "sm"}
                          variant={action.type === "primary" ? "default" : "outline"}
                          className={
                            action.type === "primary"
                              ? "bg-teal-500 hover:bg-teal-400 text-background font-medium"
                              : "border-teal-500/40 hover:bg-teal-500/10 hover:border-teal-400/60 bg-transparent text-teal-300"
                          }
                        >
                          {action.type === "secondary" && <Users className="w-4 h-4 mr-2" />}
                          {action.label}
                        </Button>
                      ))}
                      
                      {/* Regular project links */}
                      {project.links?.map((link) => (
                        <Button
                          key={link.label}
                          size="sm"
                          variant="outline"
                          className="border-border hover:bg-primary/10 hover:border-primary/50 bg-transparent"
                          asChild
                        >
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            {link.label}
                          </a>
                        </Button>
                      ))}
                      {project.github && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-border hover:bg-primary/10 hover:border-primary/50 bg-transparent"
                          asChild
                        >
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Github className="w-4 h-4 mr-2" />
                            GitHub
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
