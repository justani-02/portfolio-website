"use client";

import React from "react"

import { useEffect, useRef, useState } from "react";
import { Mail, Linkedin, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "ananyachandraker02@gmail.com",
    href: "mailto:ananyachandraker02@gmail.com",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "linkedin.com/in/ananya-chandraker",
    href: "https://www.linkedin.com/in/ananya-chandraker/",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Dublin, Ireland",
    href: null,
  },
];

export function Contact() {
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset after 3 seconds
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="py-20 md:py-32 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-1/4 w-1/3 h-1/3 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-1/4 h-1/4 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <p className="text-primary font-medium tracking-wide uppercase text-sm mb-4">
            Get In Touch
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground text-balance">
            {"Let's Create Something Amazing"}
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Open to collaborations, research opportunities, and innovative
            projects.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact Form */}
          <div
            className={`transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <form
              onSubmit={handleSubmit}
              className="p-6 sm:p-8 rounded-3xl bg-card backdrop-blur-sm border border-border space-y-6"
            >
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground">
                    Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    required
                    className="bg-input border-border focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    required
                    className="bg-input border-border focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject" className="text-foreground">
                  Subject
                </Label>
                <Input
                  id="subject"
                  placeholder="What's this about?"
                  required
                  className="bg-input border-border focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-foreground">
                  Message
                </Label>
                <Textarea
                  id="message"
                  placeholder="Tell me about your project or inquiry..."
                  rows={5}
                  required
                  className="bg-input border-border focus:border-primary resize-none"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={isSubmitting || isSubmitted}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </span>
                ) : isSubmitted ? (
                  <span className="flex items-center gap-2">
                    Message Sent!
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    Send Message
                  </span>
                )}
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div
            className={`space-y-6 transition-all duration-1000 delay-200 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            {contactInfo.map((info) => (
              <div
                key={info.label}
                className="group p-6 rounded-2xl bg-card backdrop-blur-sm border border-border hover:border-primary/30 transition-all duration-300"
              >
                {info.href ? (
                  <a
                    href={info.href}
                    target={info.href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      info.href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="flex items-center gap-4"
                  >
                    <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <info.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {info.label}
                      </p>
                      <p className="text-foreground font-medium group-hover:text-primary transition-colors">
                        {info.value}
                      </p>
                    </div>
                  </a>
                ) : (
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-primary/10 text-primary">
                      <info.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {info.label}
                      </p>
                      <p className="text-foreground font-medium">{info.value}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}

            
          </div>
        </div>
      </div>
    </section>
  );
}
