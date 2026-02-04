"use client";

import { useEffect, useRef, useState } from "react";
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

export function Publications() {
  const [isVisible, setIsVisible] = useState(false);
  const [expandedPubs, setExpandedPubs] = useState<Set<number>>(new Set());
  const sectionRef = useRef<HTMLElement>(null);

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
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
      id="publications"
      className="py-20 md:py-32 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute bottom-1/4 left-0 w-1/3 h-1/3 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <p className="text-primary font-medium tracking-wide uppercase text-sm mb-4">
            Research
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground text-balance">
            Publications
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Academic contributions to the fields of AI, healthcare technology,
            and urban systems.
          </p>
        </div>

        {/* Publications Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {publications.map((pub, index) => (
            <div
              key={pub.id}
              className={`group relative p-6 sm:p-8 rounded-3xl bg-card backdrop-blur-sm border border-border hover:border-primary/30 transition-all duration-500 hover:-translate-y-2 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                {/* Status Badge */}
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      statusColorMap[pub.statusColor]
                    }`}
                  />
                  <span className="text-sm font-medium text-foreground">
                    {pub.status}
                  </span>
                </div>

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
                      <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${expandedPubs.has(pub.id) ? "rotate-180" : ""}`} />
                    </button>
                    
                    <div className={`grid transition-all duration-500 ease-in-out ${
                      expandedPubs.has(pub.id) ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0"
                    }`}>
                      <div className="overflow-hidden">
                        <div className="rounded-xl overflow-hidden border border-border/50 bg-black/20">
                          <img
                            src={pub.certificateImage || pub.acceptanceImage}
                            alt={pub.certificateImage ? `Certificate for ${pub.title}` : `Acceptance letter for ${pub.title}`}
                            className="w-full h-auto object-contain"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
