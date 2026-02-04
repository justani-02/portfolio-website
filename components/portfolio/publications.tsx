"use client";

import { useEffect, useRef, useState } from "react";
import { Calendar, MapPin, Award } from "lucide-react";

const publications = [
  {
    id: 1,
    title:
      "MemFusion-Tformer: Memory-Driven Cross-Attention for Dynamic Congestion Prediction in Urban Networks",
    conference: "IEEE iMETA2025",
    date: "October 14-17, 2025",
    location: "Dubrovnik, Croatia",
    status: "Accepted",
    statusColor: "emerald",
    description:
      "Selected through highly competitive review process with limited paper acceptance, recognizing the significance of the contribution.",
  },
  {
    id: 2,
    title:
      "Mobile Health Apps and Network Integration: Transforming Healthcare Delivery",
    conference: "Springer RASESIA 2024",
    date: "June 14-15, 2024",
    location: "NIT Kurukshetra, India",
    status: "Published",
    statusColor: "cyan",
    description:
      "Published in Springer Volume 2 as part of thematic segregation. Presented at hybrid conference on Recent Advances in Smart Energy Systems.",
  },
];

const statusColorMap: Record<string, string> = {
  emerald: "bg-emerald-500",
  cyan: "bg-cyan-500",
};

export function Publications() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

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
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {pub.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
