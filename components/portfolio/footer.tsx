"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Running shoe SVG icon
function RunningShoeIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M2 19h18a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2h-1l-2-4h-3l-1 2H8l-2-4H4l-2 4v5a2 2 0 0 0 2 2z" />
      <path d="M6 15h1" />
      <path d="M10 15h1" />
      <path d="M14 15h1" />
    </svg>
  );
}

export function Footer() {
  const [shoeClicks, setShoeClicks] = useState(0);
  const [showRunnerMode, setShowRunnerMode] = useState(false);
  const [eggFound, setEggFound] = useState(false);

  // Check if already found from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("portfolio-eggs-found");
      if (saved) {
        const found = new Set(JSON.parse(saved));
        if (found.has(1)) {
          setEggFound(true);
        }
      }
    }
  }, []);

  const handleShoeClick = () => {
    if (eggFound) return;
    
    const newCount = shoeClicks + 1;
    setShoeClicks(newCount);
    
    if (newCount >= 3) {
      // Trigger easter egg
      setShowRunnerMode(true);
      setEggFound(true);
      
      // Dispatch custom event to notify chatbot
      window.dispatchEvent(
        new CustomEvent("easterEggFound", {
          detail: { eggId: 1, eggName: "RUNNER MODE" },
        })
      );
      
      // Speed up page animations
      document.documentElement.style.setProperty("--animation-speed", "0.5");
      
      // Hide effect after 5 seconds
      setTimeout(() => {
        setShowRunnerMode(false);
        document.documentElement.style.removeProperty("--animation-speed");
      }, 5000);
    }
  };

  return (
    <>
      {/* Runner mode overlay */}
      <AnimatePresence>
        {showRunnerMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-40 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              className="text-6xl sm:text-8xl"
            >
              🏃‍♀️
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="absolute bottom-1/3 text-2xl font-bold text-primary"
            >
              Marathon Champion!
            </motion.p>
            {/* Shoe trail effect */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ x: -100, y: Math.random() * window.innerHeight }}
                  animate={{ x: window.innerWidth + 100 }}
                  transition={{ duration: 1 + Math.random(), delay: i * 0.2, repeat: 2 }}
                  className="absolute text-3xl"
                  style={{ top: `${10 + i * 8}%` }}
                >
                  👟
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="py-12 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <span>&copy; 2026 Ananya Chandraker. Designed with</span>
            <Heart className="w-4 h-4 text-primary fill-primary" />
            <span>for human-centered experiences.</span>
            
            {/* Running shoe easter egg trigger */}
            <motion.button
              onClick={handleShoeClick}
              className={`ml-2 p-1 rounded-full transition-all duration-300 ${
                eggFound 
                  ? "text-primary cursor-default" 
                  : "text-muted-foreground/50 hover:text-primary hover:bg-primary/10 cursor-pointer"
              }`}
              whileHover={!eggFound ? { scale: 1.2 } : {}}
              whileTap={!eggFound ? { scale: 0.9 } : {}}
              aria-label="Running shoe"
              title={eggFound ? "Runner Mode unlocked!" : `Click me! (${shoeClicks}/3)`}
            >
              <RunningShoeIcon className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </footer>
    </>
  );
}
