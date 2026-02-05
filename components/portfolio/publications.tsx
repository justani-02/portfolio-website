"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Award, FileCheck, ChevronDown } from "lucide-react";

const publications = [
  {
    id: 1,
    title:
      "MemFusion-Tformer: Memory-Driven Cross-Attention for Dynamic Congestion Prediction in Urban Networks",
    conference: "IEEE iMETA2025",
    date: "October 14-17, 2025",
    location: "Hotel Dubrovnik Palace, Dubrovnik, Croatia",
    status: "Accepted",
    statusColor: "emerald",
    description:
      "Selected through highly competitive review process with limited paper acceptance, recognizing the significance of the contribution.",
    acceptanceImage: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Acceptance-TPo2UHwtX9HFWmeELQ40dRUyj4DLFj.png",
  },
  {
    id: 2,
    title:
      "Mobile Health Apps and Network Integration: Transforming Healthcare Delivery",
    conference: "Springer RASESIA 2024",
    date: "June 14-15, 2024",
    location: "NIT Kurukshetra, Haryana, India",
    status: "Published & Presented",
    statusColor: "cyan",
    description:
      "Published in Springer Volume 2. Presented at First International Conference on Recent Advances in Smart Energy Systems & Intelligent Automation (RASESIA 2024).",
    certificateImage: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/paper%20presentation-4N8xWYxRjO8NxL8xISBxFlf7J5MAly.jpg",
  },
];

const statusColorMap: Record<string, string> = {
  emerald: "bg-emerald-500",
  cyan: "bg-cyan-500",
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

const cardVariants = {
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

export function Publications() {
  const [expandedPubs, setExpandedPubs] = useState<Set<number>>(new Set());
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const toggleExpanded = (pubId: number) => {
    setExpandedPubs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(pubId)) {
        newSet.delete(pubId);
      } else {
        newSet.add(pubId);
      }
      return newSet;
    });
  };

  return (
    <section
      ref={sectionRef}
      id="publications"
      className="py-20 md:py-32 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute bottom-1/4 left-0 w-1/3 h-1/3 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
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
            Research
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground text-balance"
          >
            Publications
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-4 text-muted-foreground max-w-2xl mx-auto"
          >
            Academic contributions to the fields of AI, healthcare technology,
            and urban systems.
          </motion.p>
        </motion.div>

        {/* Publications Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 gap-6"
        >
          {publications.map((pub) => (
            <motion.div
              key={pub.id}
              variants={cardVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group relative p-6 sm:p-8 rounded-3xl bg-card backdrop-blur-sm border border-border hover:border-primary/30 transition-all duration-500"
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                {/* Status Badge */}
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  className="flex items-center gap-2 mb-4"
                >
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className={`w-2 h-2 rounded-full ${
                      statusColorMap[pub.statusColor]
                    }`}
                  />
                  <span className="text-sm font-medium text-foreground">
                    {pub.status}
                  </span>
                </motion.div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-4 leading-tight group-hover:text-primary transition-colors">
                  {pub.title}
                </h3>

                {/* Meta Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Award className="w-4 h-4 text-primary" />
                    <span>{pub.conference}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>{pub.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>{pub.location}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {pub.description}
                </p>

                {/* Expandable Certificate/Acceptance Image */}
                {(pub.certificateImage || pub.acceptanceImage) && (
                  <div>
                    <button
                      onClick={() => toggleExpanded(pub.id)}
                      className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                      <FileCheck className="w-4 h-4" />
                      <span>{pub.certificateImage ? "View Certificate" : "View Acceptance"}</span>
                      <motion.span
                        animate={{ rotate: expandedPubs.has(pub.id) ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </motion.span>
                    </button>
                    
                    <AnimatePresence>
                      {expandedPubs.has(pub.id) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.4, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="pt-4">
                            <div className="rounded-xl overflow-hidden border border-border/50 bg-black/20">
                              <img
                                src={pub.certificateImage || pub.acceptanceImage}
                                alt={pub.certificateImage ? `Certificate for ${pub.title}` : `Acceptance letter for ${pub.title}`}
                                className="w-full h-auto object-contain"
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
