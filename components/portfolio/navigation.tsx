"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Publications", href: "#publications" },
  { label: "Contact", href: "#contact" },
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a
            href="#"
            className="group flex items-center gap-2"
          >
            {/* Abstract AC Monogram */}
            <div className="relative w-11 h-11">
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
            </div>
            
            {/* Text */}
            <span className="hidden sm:block text-base font-medium text-foreground group-hover:text-primary transition-colors duration-300">
              ananya
            </span>
          </a>

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
        </div>
      </div>
    </nav>
  );
}
