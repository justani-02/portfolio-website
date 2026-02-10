"use client";

import { useState, useEffect, useRef } from "react";
import { Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Confetti particle component
function ConfettiParticle({ index }: { index: number }) {
  const colors = [
    "bg-primary",
    "bg-accent",
    "bg-emerald-400",
    "bg-amber-400",
    "bg-rose-400",
    "bg-cyan-400",
  ];
  const color = colors[index % colors.length];
  const startX = Math.random() * 100;
  const delay = Math.random() * 0.5;
  const duration = 1.5 + Math.random() * 1.5;
  const rotation = Math.random() * 720 - 360;
  const size = 6 + Math.random() * 6;

  return (
    <motion.div
      className={`absolute rounded-sm ${color}`}
      style={{
        width: size,
        height: size,
        left: `${startX}%`,
        top: -10,
      }}
      initial={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
      animate={{
        opacity: [1, 1, 0],
        y: [0, 200, 400],
        x: [0, (Math.random() - 0.5) * 200],
        rotate: rotation,
        scale: [1, 0.8, 0.4],
      }}
      transition={{
        duration,
        delay,
        ease: "easeOut",
      }}
    />
  );
}

export function Footer() {
  const [eggFound, setEggFound] = useState(false);
  const [showBadge, setShowBadge] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const footerRef = useRef<HTMLElement>(null);
  const hasTriggeredRef = useRef(false);

  // Check if already found from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("portfolio-eggs-found");
      if (saved) {
        try {
          const found = new Set(JSON.parse(saved));
          if (found.has(2)) {
            setEggFound(true);
          }
        } catch {
          // ignore
        }
      }
    }
  }, []);

  // Scroll-to-bottom detection using IntersectionObserver
  useEffect(() => {
    if (eggFound || hasTriggeredRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !hasTriggeredRef.current) {
          hasTriggeredRef.current = true;
          setEggFound(true);
          setShowBadge(true);
          setShowConfetti(true);

          // Dispatch custom event to notify chatbot
          window.dispatchEvent(
            new CustomEvent("easterEggFound", {
              detail: { eggId: 2, eggName: "EXPLORER" },
            })
          );

          // Hide confetti after 4 seconds
          setTimeout(() => {
            setShowConfetti(false);
          }, 4000);

          // Hide badge after 6 seconds
          setTimeout(() => {
            setShowBadge(false);
          }, 6000);
        }
      },
      { threshold: 0.8 }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => observer.disconnect();
  }, [eggFound]);

  return (
    <>
      {/* Confetti overlay */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-[100] overflow-hidden"
          >
            {Array.from({ length: 60 }).map((_, i) => (
              <ConfettiParticle key={i} index={i} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Explorer badge */}
      <AnimatePresence>
        {showBadge && (
          <motion.div
            initial={{ opacity: 0, scale: 0, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="fixed bottom-32 left-1/2 -translate-x-1/2 z-[101] pointer-events-none"
          >
            <div className="px-6 py-4 rounded-2xl bg-gradient-to-br from-primary/90 to-accent/90 backdrop-blur-sm border border-primary/50 shadow-2xl shadow-primary/30">
              <div className="flex items-center gap-3">
                <span className="text-3xl" role="img" aria-label="trophy">
                  {"🏆"}
                </span>
                <div>
                  <p className="text-sm font-bold text-primary-foreground">
                    Explorer Achievement!
                  </p>
                  <p className="text-xs text-primary-foreground/80">
                    You scrolled to the very bottom!
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer ref={footerRef} className="py-12 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <span>{"© 2026 Ananya Chandraker. Designed with"}</span>
            <Heart className="w-4 h-4 text-primary fill-primary" />
            <span>for human-centered experiences.</span>
          </div>
        </div>
      </footer>
    </>
  );
}
