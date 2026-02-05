"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, Sparkles, BookOpen, FolderOpen, Egg } from "lucide-react";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";

// Dynamically import Three.js components
const Canvas = dynamic(
  () => import("@react-three/fiber").then((mod) => mod.Canvas),
  { ssr: false }
);

import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const AVATAR_URL = "https://models.readyplayer.me/695ab54e8f9c70cbc92c8821.glb";

// Easter eggs data
const EASTER_EGGS = [
  { id: 1, name: "Konami Code", hint: "Try the classic gaming cheat code... Up, Up, Down, Down, Left, Right, Left, Right, B, A", location: "Anywhere on the page" },
  { id: 2, name: "Secret Click", hint: "My avatar in the hero section holds a secret. Try clicking on it multiple times!", location: "Hero section" },
  { id: 3, name: "Hidden Message", hint: "The footer might have something special if you hover over my name for a while...", location: "Footer" },
  { id: 4, name: "Color Shifter", hint: "Try typing 'rainbow' in this chat to see something magical happen!", location: "This chatbot" },
  { id: 5, name: "Time Traveler", hint: "Visit the site at exactly midnight (00:00) for a special surprise!", location: "Any time" },
];

// Bot responses for portfolio questions
const PORTFOLIO_RESPONSES: Record<string, string> = {
  "skills": "Ananya is skilled in Unity 6, AR/VR development, UX Design, React, Python, and AI/ML. She's particularly passionate about creating immersive XR experiences!",
  "projects": "Check out the Projects section! Highlights include Adaptive MR for healthcare, an award-winning Blood-Organ Donation app, and the official Lens Studio documentation guide.",
  "experience": "Ananya has worked at Snap Inc. as a Lens Studio Specialist, conducted research at ADAPT Centre, and has 4+ years of experience in XR development.",
  "education": "She's currently pursuing an MSc in Human-Computer Interaction at University College Dublin, Ireland.",
  "contact": "You can reach Ananya via email at ananyachandraker02@gmail.com or connect on LinkedIn!",
  "publications": "Ananya has published research on adaptive MR interfaces for motor impairments and multimodal feedback in XR. Check the Publications section for more!",
  "hello": "Hey there! I'm Ananya's portfolio assistant. Ask me about her skills, projects, or try to find all 5 easter eggs hidden in this portfolio!",
  "hi": "Hello! Welcome to Ananya's portfolio. I can help you navigate around or give you hints about hidden easter eggs. What would you like to know?",
  "easter": "There are 5 secret easter eggs hidden throughout this portfolio! Want me to give you a hint for one of them?",
  "hint": "Here's a hint: One of the easter eggs involves a classic gaming cheat code. Try pressing some arrow keys in a specific pattern...",
  "rainbow": "You found one! Watch the magic happen...",
};

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

// Animated avatar head component
function AvatarHead({ expression }: { expression: "happy" | "thinking" | "idle" }) {
  const { scene } = useGLTF(AVATAR_URL);
  const headRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (headRef.current) {
      // Subtle floating animation
      headRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.02;
      
      // Expression-based animations
      if (expression === "thinking") {
        headRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2) * 0.05;
      } else if (expression === "happy") {
        headRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 3) * 0.1;
      } else {
        headRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
      }
    }
  });

  return (
    <group ref={headRef} position={[0, -0.3, 0]} scale={1.8}>
      <primitive object={scene.clone()} />
    </group>
  );
}

function AvatarScene({ expression }: { expression: "happy" | "thinking" | "idle" }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 2], fov: 30 }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[-5, 5, 5]} intensity={0.4} color="#8b5cf6" />
      <Suspense fallback={null}>
        <AvatarHead expression={expression} />
      </Suspense>
    </Canvas>
  );
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hey! I'm Ananya's portfolio assistant. Ask me anything about her work, or try to find the 5 hidden easter eggs!",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [expression, setExpression] = useState<"happy" | "thinking" | "idle">("idle");
  const [eggsFound, setEggsFound] = useState<Set<number>>(new Set());
  const [showRainbow, setShowRainbow] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load found eggs from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("portfolio-eggs-found");
      if (saved) {
        setEggsFound(new Set(JSON.parse(saved)));
      }
    }
  }, []);

  // Save found eggs to localStorage
  useEffect(() => {
    if (typeof window !== "undefined" && eggsFound.size > 0) {
      localStorage.setItem("portfolio-eggs-found", JSON.stringify([...eggsFound]));
    }
  }, [eggsFound]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check for rainbow easter egg
    if (lowerMessage.includes("rainbow")) {
      setShowRainbow(true);
      setTimeout(() => setShowRainbow(false), 5000);
      if (!eggsFound.has(4)) {
        setEggsFound((prev) => new Set([...prev, 4]));
      }
      return "You found the Color Shifter easter egg! Watch the chat glow with rainbow colors!";
    }
    
    // Check for specific keywords
    for (const [keyword, response] of Object.entries(PORTFOLIO_RESPONSES)) {
      if (lowerMessage.includes(keyword)) {
        return response;
      }
    }
    
    // Check for easter egg hints request
    if (lowerMessage.includes("egg") || lowerMessage.includes("hint") || lowerMessage.includes("secret")) {
      const nextHint = EASTER_EGGS[currentHintIndex];
      setCurrentHintIndex((prev) => (prev + 1) % EASTER_EGGS.length);
      return `Hint for "${nextHint.name}": ${nextHint.hint} (Location: ${nextHint.location})`;
    }
    
    // Default responses
    const defaultResponses = [
      "That's interesting! Try asking about Ananya's projects, skills, or experience.",
      "I'd love to help! You can ask about publications, education, or how to contact Ananya.",
      "Hmm, I'm not sure about that. But did you know there are 5 easter eggs hidden in this portfolio?",
      "Great question! Check out the Projects section for Ananya's amazing work in AR/VR and healthcare tech.",
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);
    setExpression("thinking");
    
    // Simulate typing delay
    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        text: getBotResponse(inputValue),
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
      setExpression("happy");
      
      // Reset to idle after a moment
      setTimeout(() => setExpression("idle"), 2000);
    }, 1000 + Math.random() * 500);
  };

  const handleQuickAction = (action: string) => {
    let message = "";
    switch (action) {
      case "projects":
        message = "Tell me about the projects";
        break;
      case "publications":
        message = "What are the publications?";
        break;
      case "easter":
        message = "Give me an easter egg hint";
        break;
    }
    setInputValue(message);
    setTimeout(() => handleSendMessage(), 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Rainbow overlay for easter egg */}
      <AnimatePresence>
        {showRainbow && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-40"
            style={{
              background: "linear-gradient(45deg, rgba(255,0,0,0.1), rgba(255,165,0,0.1), rgba(255,255,0,0.1), rgba(0,128,0,0.1), rgba(0,0,255,0.1), rgba(75,0,130,0.1), rgba(238,130,238,0.1))",
              animation: "rainbow-shift 2s linear infinite",
            }}
          />
        )}
      </AnimatePresence>

      {/* Floating chat button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/30 flex items-center justify-center overflow-hidden border-2 border-primary/30"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: isOpen
            ? "0 0 20px rgba(139, 92, 246, 0.5)"
            : [
                "0 0 20px rgba(139, 92, 246, 0.3)",
                "0 0 40px rgba(139, 92, 246, 0.5)",
                "0 0 20px rgba(139, 92, 246, 0.3)",
              ],
        }}
        transition={{
          boxShadow: {
            repeat: isOpen ? 0 : Infinity,
            duration: 2,
          },
        }}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <div className="w-full h-full relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white animate-pulse" />
            </div>
            {/* Pulse ring */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-primary"
              animate={{
                scale: [1, 1.5, 1.5],
                opacity: [0.5, 0, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: "easeOut",
              }}
            />
          </div>
        )}
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`fixed bottom-24 right-6 z-50 w-[360px] sm:w-[400px] h-[500px] rounded-3xl overflow-hidden ${
              showRainbow ? "animate-rainbow-border" : ""
            }`}
            style={{
              background: "rgba(15, 23, 42, 0.95)",
              backdropFilter: "blur(20px)",
              border: showRainbow
                ? "2px solid transparent"
                : "1px solid rgba(139, 92, 246, 0.3)",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(139, 92, 246, 0.2)",
            }}
          >
            {/* Header with avatar */}
            <div className="relative h-32 bg-gradient-to-b from-primary/20 to-transparent">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-primary/30 to-accent/30 border-2 border-primary/40">
                  <AvatarScene expression={expression} />
                </div>
              </div>
              {/* Easter eggs counter */}
              <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-xs text-primary-foreground flex items-center gap-1">
                <Egg className="w-3 h-3" />
                <span>{eggsFound.size}/5 found!</span>
              </div>
              {/* Expression indicator */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">
                {isTyping ? "Thinking..." : expression === "happy" ? "Happy to help!" : "Ask me anything!"}
              </div>
            </div>

            {/* Messages area */}
            <div className="h-[260px] overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                      message.isUser
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-secondary/50 text-foreground rounded-bl-md border border-border/50"
                    }`}
                  >
                    {message.text}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-secondary/50 px-4 py-2 rounded-2xl rounded-bl-md border border-border/50">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick actions */}
            <div className="px-4 py-2 flex gap-2 overflow-x-auto">
              <Button
                size="sm"
                variant="outline"
                className="text-xs rounded-full border-primary/30 hover:bg-primary/20 whitespace-nowrap"
                onClick={() => handleQuickAction("projects")}
              >
                <FolderOpen className="w-3 h-3 mr-1" />
                Projects
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-xs rounded-full border-primary/30 hover:bg-primary/20 whitespace-nowrap"
                onClick={() => handleQuickAction("publications")}
              >
                <BookOpen className="w-3 h-3 mr-1" />
                Publications
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-xs rounded-full border-primary/30 hover:bg-primary/20 whitespace-nowrap"
                onClick={() => handleQuickAction("easter")}
              >
                <Egg className="w-3 h-3 mr-1" />
                Easter Eggs
              </Button>
            </div>

            {/* Input area */}
            <div className="p-4 border-t border-border/30">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask me anything..."
                  className="flex-1 px-4 py-2 rounded-full bg-secondary/50 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                />
                <Button
                  size="icon"
                  className="rounded-full bg-primary hover:bg-primary/90 w-10 h-10"
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rainbow animation styles */}
      <style jsx global>{`
        @keyframes rainbow-shift {
          0% { filter: hue-rotate(0deg); }
          100% { filter: hue-rotate(360deg); }
        }
        .animate-rainbow-border {
          background: linear-gradient(#0f172a, #0f172a) padding-box,
                      linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #ee82ee) border-box;
          animation: rainbow-shift 2s linear infinite;
        }
      `}</style>
    </>
  );
}
