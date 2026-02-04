"use client";

import { useEffect, useState } from "react";

export function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isGrabbing, setIsGrabbing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    // Check for interactive elements
    const handleElementCheck = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Check if hovering over avatar container
      const avatarContainer = target.closest('[data-avatar-container]');
      if (avatarContainer) {
        setIsGrabbing(true);
        setIsHovering(false);
        return;
      }
      
      // Check if hovering over clickable elements
      const isClickable = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('a') || 
        target.closest('button') ||
        target.closest('[role="button"]') ||
        window.getComputedStyle(target).cursor === 'pointer';
      
      setIsHovering(isClickable);
      setIsGrabbing(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousemove", handleElementCheck);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousemove", handleElementCheck);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      className={`custom-cursor ${isHovering ? "hovering" : ""} ${isGrabbing ? "grabbing" : ""}`}
      style={{
        left: position.x,
        top: position.y,
      }}
    />
  );
}
