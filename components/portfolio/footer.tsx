"use client";

import { useState, useEffect, useRef } from "react";
import { Heart, Trophy } from "lucide-react";
import { motion, AnimatePresence, useInView } from "framer-motion";

export function Footer() {
  const [showExplorerBadge, setShowExplorerBadge] = useState(false);
  const [eggFound, setEggFound] = useState(false);
  const footerRef = useRef<HTMLElement>(null);
  const isInView = useInView(footerRef, { once: true, amount: 0.5 });

  // Check if already found from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("portfolio-eggs-found");
      if (saved) {
        const found = new Set(JSON.parse(saved));
        if (found.has(2)) {
          setEggFound(true);
        }
      }
    }
  }, []);

  // Trigger explorer egg when footer comes into view
  useEffect(() => {
    if (isInView && !eggFound) {
      setShowExplorerBadge(true);
      setEggFound(true);

      // Dispatch custom event to notify chatbot
      window.dispatchEvent(
        new CustomEvent("easterEggFound", {
          detail: { eggId: 2, eggName: "EXPLORER" },
        })
      );

      // Hide badge after 5 seconds
      setTimeout(() => {
        setShowExplorerBadge(false);
      }, 5000);
    }
  }, [isInView, eggFound]);

  return (
    <>
      {/* Explorer achievement overlay */}
      <AnimatePresence>
        {showExplorerBadge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-40 flex items-center justify-center"
          >
            {/* Confetti */}
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: typeof window !== "undefined" ? window.innerWidth / 2 : 500,
                  y: typeof window !== "undefined" ? window.innerHeight / 2 : 400,
                  scale: 0,
                }}
                animate={{
                  x: (typeof window !== "undefined" ? window.innerWidth / 2 : 500) + (Math.random() - 0.5) * 600,
                  y: (typeof window !== "undefined" ? window.innerHeight / 2 : 400) + (Math.random() - 0.5) * 600,
                  scale: [0, 1, 0.5],
                  rotate: Math.random() * 720,
                }}
                transition={{ duration: 1.5 + Math.random(), delay: Math.random() * 0.3 }}
                className="absolute w-3 h-3 rounded-sm"
                style={{
                  backgroundColor: ["#8b5cf6", "#ec4899", "#06b6d4", "#22c55e", "#f59e0b"][Math.floor(Math.random() * 5)]
                }}
              />
            ))}
            {/* Badge */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
              className="flex flex-col items-center gap-3 p-8 rounded-3xl"
              style={{
                background: "rgba(15, 23, 42, 0.95)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(139, 92, 246, 0.5)",
                boxShadow: "0 0 60px rgba(139, 92, 246, 0.3)",
              }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <Trophy className="w-12 h-12 text-yellow-400" />
              </motion.div>
              <p className="text-xl font-bold text-foreground">Explorer Achievement!</p>
              <p className="text-sm text-muted-foreground">You scrolled to the very bottom!</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer ref={footerRef} className="py-12 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <span>&copy; 2026 Ananya Chandraker. Designed with</span>
            <Heart className="w-4 h-4 text-primary fill-primary" />
            <span>for human-centered experiences.</span>
          </div>
        </div>
      </footer>
    </>
  );
}
