"use client";

import { useState, useEffect } from "react";
import { Menu, X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Publications", href: "#publications" },
  { label: "Contact", href: "#contact" },
];

// Fun facts for secret menu
const funFacts = [
  { icon: "🏃‍♀️", text: "5-time Marathon Champion" },
  { icon: "📚", text: "Published in IEEE & Springer" },
  { icon: "💜", text: "4 Years Youth Mentor" },
  { icon: "🎮", text: "Snap Lens Studio Certified" },
  { icon: "🌍", text: "Designed for Social Impact" },
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);
  const [showSecretMenu, setShowSecretMenu] = useState(false);
  const [secretEggFound, setSecretEggFound] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check if already found from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("portfolio-eggs-found");
      if (saved) {
        const found = new Set(JSON.parse(saved));
        if (found.has(1)) {
          setSecretEggFound(true);
        }
      }
    }
  }, []);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (secretEggFound) {
      // If already found, just toggle the menu
      setShowSecretMenu(prev => !prev);
      return;
    }
    
    const newCount = logoClicks + 1;
    setLogoClicks(newCount);
    
    if (newCount >= 3) {
      // Trigger secret menu easter egg
      setShowSecretMenu(true);
      setSecretEggFound(true);
      
      // Dispatch custom event to notify chatbot
      window.dispatchEvent(
        new CustomEvent("easterEggFound", {
          detail: { eggId: 1, eggName: "SECRET MENU" },
        })
      );
    }
  };

  return (
    <>
      {/* Secret Menu Overlay */}
      <AnimatePresence>
        {showSecretMenu && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSecretMenu(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
            />
            
            {/* Secret Panel */}
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 h-full w-[280px] sm:w-[320px] z-[70] p-6 flex flex-col"
              style={{
                background: "rgba(15, 23, 42, 0.98)",
                backdropFilter: "blur(20px)",
                borderRight: "1px solid rgba(139, 92, 246, 0.3)",
                boxShadow: "10px 0 40px rgba(139, 92, 246, 0.2)",
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <motion.h2
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-xl font-bold text-foreground"
                >
                  Secret Menu Unlocked!
                </motion.h2>
                <button
                  onClick={() => setShowSecretMenu(false)}
                  className="p-2 rounded-full hover:bg-secondary/50 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Fun Facts */}
              <div className="space-y-4 flex-1">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-sm text-muted-foreground mb-6"
                >
                  Fun facts about Ananya you might not know:
                </motion.p>
                
                {funFacts.map((fact, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20"
                  >
                    <span className="text-2xl">{fact.icon}</span>
                    <span className="text-sm font-medium text-foreground">{fact.text}</span>
                  </motion.div>
                ))}
              </div>

              {/* Footer */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-xs text-muted-foreground text-center mt-4"
              >
                Click anywhere outside to close
              </motion.p>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-background/80 backdrop-blur-xl border-b border-border"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo - clickable for easter egg */}
            <button
              onClick={handleLogoClick}
              className="group flex items-center gap-2 cursor-pointer"
              title={secretEggFound ? "Click to open Secret Menu" : `Click me! (${logoClicks}/3)`}
            >
              {/* Abstract AC Monogram */}
              <motion.div 
                className="relative w-11 h-11"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg 
                  viewBox="0 0 44 44" 
                  className="w-full h-full"
                  aria-hidden="true"
                >
                  <defs>
                    <linearGradient id="acGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#c084fc" />
                    </linearGradient>
                  </defs>
                  
                  {/* Abstract A - Triangle form */}
                  <path 
                    d="M12 34 L22 8 L26 8 L26 34" 
                    fill="none"
                    stroke="url(#acGrad)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="group-hover:stroke-[#c084fc] transition-all duration-300"
                  />
                  {/* A crossbar */}
                  <line 
                    x1="15" y1="24" x2="26" y2="24" 
                    stroke="url(#acGrad)" 
                    strokeWidth="2.5" 
                    strokeLinecap="round"
                    className="group-hover:stroke-[#c084fc] transition-all duration-300"
                  />
                  
                  {/* Abstract C - Open arc merging with A */}
                  <path 
                    d="M36 12 C28 8, 22 14, 22 22 C22 30, 28 36, 36 32" 
                    fill="none"
                    stroke="url(#acGrad)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="group-hover:stroke-[#a855f7] transition-all duration-300"
                  />
                </svg>
                
                {/* Glow on hover */}
                <div className="absolute inset-0 rounded-xl bg-primary/0 group-hover:bg-primary/10 blur-xl transition-all duration-300" />
                
                {/* Click indicator for easter egg */}
                {!secretEggFound && logoClicks > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-[10px] font-bold rounded-full flex items-center justify-center text-white"
                  >
                    {logoClicks}
                  </motion.div>
                )}
              </motion.div>
              
              {/* Text */}
              <span className="hidden sm:block text-base font-medium text-foreground group-hover:text-primary transition-colors duration-300">
                ananya
              </span>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors relative group"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
              <a
                href="/Ananya_Chandraker_Resume.pdf"
                download="Ananya_Chandraker_Resume.pdf"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/30 group"
              >
                <Download className="w-4 h-4 group-hover:animate-bounce" />
                Resume
              </a>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border transition-all duration-300 ${
            isMobileMenuOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-4 pointer-events-none"
          }`}
        >
          <div className="px-4 py-6 space-y-4">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="block text-lg text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <a
              href="/Ananya_Chandraker_Resume.pdf"
              download="Ananya_Chandraker_Resume.pdf"
              className="flex items-center justify-center gap-2 w-full px-4 py-3 text-base font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-xl transition-all duration-300"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Download className="w-5 h-5" />
              Download Resume
            </a>
          </div>
        </div>
      </nav>
    </>
  );
}
