"use client";

import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-12 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
          <span>&copy; 2026 Ananya Chandraker. Designed with</span>
          <Heart className="w-4 h-4 text-primary fill-primary" />
          <span>for human-centered experiences.</span>
        </div>
      </div>
    </footer>
  );
}
