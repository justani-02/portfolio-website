"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ExternalLink, Github, Sparkles, Brain, Activity, Users, ChevronDown, MapPin, Award, TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";
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
    title: "MemFusion-Tformer: Memory-Driven Cross-Attention for Dynamic Congestion Prediction",
    category: "AI Research | Urban Computing",
    description:
      "Novel deep learning architecture for urban traffic prediction using memory-driven transformer mechanisms. Developed for India's AMRUT Government Project. Predicts congestion 30-60 minutes ahead with 87% accuracy across urban networks.",
    expandedDetails: {
      keyFeatures: [
        "Multi-head cross-attention with temporal memory bank",
        "Graph neural network for road topology modeling",
        "Trained on 10,000+ vehicle trajectories, 500+ sensors",
        "Enables emergency vehicle routing optimization",
      ],
      technical: "Compared against 7 baseline models (LSTM, GRU, TCN, vanilla Transformers). Metrics: MAE, RMSE, prediction accuracy.",
      future: "Extending to emergency healthcare routing, pilot deployment in smart cities.",
      venue: "IEEE iMETA2025, Dubrovnik, Croatia (Oct 14-17, 2025)",
    },
    tags: ["Deep Learning", "Transformer", "Graph Neural Networks", "Urban Analytics", "Traffic Prediction", "Python", "PyTorch", "Unity"],
    status: "Accepted",
    badge: "IEEE iMETA2025",
    gradient: "from-violet-500/20 to-purple-500/20",
    borderColor: "hover:border-violet-500/50",
    size: "large",
    hasExpandedView: true,
    hasCarousel: true,
    carouselImages: [
      {
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1%20%281%29-zgNhp3Cg2e4MiYQ7W8eYfekUEGFGGj.png",
        caption: "Aerial view of the complete urban simulation environment",
        alt: "Wide aerial view of Unity 3D city simulation with skyscrapers, roads, and residential areas"
      },
      {
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2%20%281%29-LTjq8B6Vj9rPLScTFwQSLBh2LHuKMn.png",
        caption: "Dense urban infrastructure with roundabouts and mixed-use zones",
        alt: "Detailed Unity 3D view showing roundabouts, commercial and residential buildings"
      },
      {
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/4-rZvkIAJF1iK9nqJ4hR3rlueB9C6EBU.png",
        caption: "Street-level traffic simulation with vehicle trajectories",
        alt: "Street-level view of intersection with vehicles, pedestrian crossings, and traffic flow"
      },
    ],
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
      "A three-part visual narrative using color psychology and abstract portraiture to depict trauma's lasting impact. The progression creates visceral understanding while maintaining artistic dignity through carefully chosen symbolism.",
    tags: ["Digital Art", "Social Impact", "Visual Storytelling", "Color Psychology"],
    status: "Completed - 2022",
    gradient: "from-orange-500/20 to-amber-500/20",
    borderColor: "hover:border-orange-500/50",
    size: "large",
    hasCarousel: true,
    carouselImages: [
      {
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/awareness-1-before-F0O0rqhDJHfAKrQOhXWj82cI7tJZwC.png",
        caption: "Colourful: Vibrant blues, greens, pinks representing joy, trust, and freedom",
        alt: "Vibrant pop-art portrait with colorful face depicting joy and innocence before trauma"
      },
      {
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/awareness-2-during-TlUv1ZLf5oaQ665oLZknCdD1evQRzF.png",
        caption: "During the Act: Bright colors clash with darkness, showing violation and confusion",
        alt: "Chaotic abstract portrait where vivid colors violently clash with encroaching darkness"
      },
      {
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/awareness-3-after-XPGzGODOzZPgknaqLfMA0ZOSqplzYh.png",
        caption: "Darkness: Predominantly dark tones with fragments of color showing resilience",
        alt: "Somber portrait with muted, dark tones and scattered color fragments representing cautious hope"
      },
    ],
  },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const headerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};

export function Projects() {
  const [expandedProjects, setExpandedProjects] = useState<Set<number>>(new Set());
  const [carouselIndexes, setCarouselIndexes] = useState<Record<number, number>>({});
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const handleCarouselNav = (projectId: number, direction: "prev" | "next", totalImages: number) => {
    setCarouselIndexes((prev) => {
      const currentIndex = prev[projectId] || 0;
      let newIndex: number;
      if (direction === "next") {
        newIndex = (currentIndex + 1) % totalImages;
      } else {
        newIndex = (currentIndex - 1 + totalImages) % totalImages;
      }
      return { ...prev, [projectId]: newIndex };
    });
  };

  const setCarouselIndex = (projectId: number, index: number) => {
    setCarouselIndexes((prev) => ({ ...prev, [projectId]: index }));
  };

  const toggleExpanded = (projectId: number) => {
    setExpandedProjects((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(projectId)) {
        newSet.delete(projectId);
      } else {
        newSet.add(projectId);
      }
      return newSet;
    });
  };

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="py-20 md:py-32 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center mb-16"
        >
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-primary font-medium tracking-wide uppercase text-sm mb-4"
          >
            Portfolio
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground text-balance"
          >
            Featured Projects
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-4 text-muted-foreground max-w-2xl mx-auto"
          >
            A collection of my work spanning AI research, healthcare technology,
            augmented reality, and social impact design.
          </motion.p>
        </motion.div>

        {/* Bento Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {projects.map((project) => {
            const isFeatured = project.size === "featured";
            const isExpanded = expandedProjects.has(project.id);
            const hasExpandedDetails = project.hasExpandedView && project.expandedDetails;
            
            return (
              <motion.div
                key={project.id}
                variants={itemVariants}
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
                }`}
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
                        <span className={`px-3 py-1 text-xs font-bold rounded-full flex items-center gap-1.5 ${
                          isFeatured 
                            ? "text-cyan-200 bg-cyan-500/20 border border-cyan-400/40"
                            : "text-violet-200 bg-violet-500/20 border border-violet-400/40"
                        }`}>
                          <Award className="w-3 h-3" />
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

                  <p className={`text-muted-foreground leading-relaxed ${
                    isFeatured ? "text-base lg:text-lg max-w-4xl mb-6" : `text-sm ${hasExpandedDetails || project.hasCarousel ? "mb-4" : "flex-grow mb-6"}`
                  }`}>
                    {project.description}
                  </p>

                  {/* Image Carousel for Awareness Project */}
                  {project.hasCarousel && project.carouselImages && (
                    <div className="mb-6">
                      <div className="relative rounded-xl overflow-hidden bg-black/50 aspect-square max-w-md mx-auto group/carousel">
                        {/* Images */}
                        {project.carouselImages.map((image, imgIndex) => {
                          const currentIndex = carouselIndexes[project.id] || 0;
                          return (
                            <div
                              key={imgIndex}
                              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                                imgIndex === currentIndex ? "opacity-100" : "opacity-0"
                              }`}
                            >
                              <img
                                src={image.src}
                                alt={image.alt}
                                className="w-full h-full object-cover"
                              />
                              {/* Caption Overlay */}
                              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 pt-12">
                                <p className="text-sm sm:text-base font-medium text-white text-center">
                                  {image.caption}
                                </p>
                              </div>
                            </div>
                          );
                        })}

                        {/* Navigation Arrows */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCarouselNav(project.id, "prev", project.carouselImages!.length);
                          }}
                          className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 backdrop-blur-sm border border-white/20"
                          aria-label="Previous image"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCarouselNav(project.id, "next", project.carouselImages!.length);
                          }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 backdrop-blur-sm border border-white/20"
                          aria-label="Next image"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>

                        {/* Dot Indicators */}
                        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2">
                          {project.carouselImages.map((_, dotIndex) => {
                            const currentIndex = carouselIndexes[project.id] || 0;
                            return (
                              <button
                                key={dotIndex}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCarouselIndex(project.id, dotIndex);
                                }}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                  dotIndex === currentIndex
                                    ? "bg-white w-6"
                                    : "bg-white/50 hover:bg-white/80"
                                }`}
                                aria-label={`Go to image ${dotIndex + 1}`}
                              />
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Expandable Details Section */}
                  {hasExpandedDetails && (
                    <div className="mb-6">
                      <button
                        onClick={() => toggleExpanded(project.id)}
                        className="flex items-center gap-2 text-sm font-medium text-violet-300 hover:text-violet-200 transition-colors mb-4"
                      >
                        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
                        {isExpanded ? "Show Less" : "Read More"}
                      </button>
                      
                      <div className={`grid transition-all duration-500 ease-in-out ${
                        isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      }`}>
                        <div className="overflow-hidden">
                          <div className="space-y-4 pt-2 pb-4">
                            {/* Key Features */}
                            <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/20">
                              <h4 className="text-sm font-semibold text-violet-300 mb-3 flex items-center gap-2">
                                <Sparkles className="w-4 h-4" />
                                Key Features
                              </h4>
                              <ul className="space-y-2">
                                {project.expandedDetails?.keyFeatures.map((feature, i) => (
                                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                    <span className="text-violet-400 mt-1">{">"}</span>
                                    {feature}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Technical & Venue */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                                <h4 className="text-sm font-semibold text-purple-300 mb-2 flex items-center gap-2">
                                  <Brain className="w-4 h-4" />
                                  Technical Evaluation
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {project.expandedDetails?.technical}
                                </p>
                              </div>
                              
                              <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                                <h4 className="text-sm font-semibold text-indigo-300 mb-2 flex items-center gap-2">
                                  <Award className="w-4 h-4" />
                                  Accepted At
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {project.expandedDetails?.venue}
                                </p>
                              </div>
                            </div>

                            {/* Future Work */}
                            <div className="p-4 rounded-xl bg-pink-500/10 border border-pink-500/20">
                              <h4 className="text-sm font-semibold text-pink-300 mb-2 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4" />
                                Future Directions
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {project.expandedDetails?.future}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

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
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
