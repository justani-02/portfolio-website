"use client";

import { useState, useRef, useEffect, Suspense, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, Sparkles, BookOpen, FolderOpen, Gift } from "lucide-react";
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

// Easter eggs data with fun hints
const EASTER_EGGS = [
  { 
    id: 1, 
    name: "KONAMI MASTER", 
    hint: "A classic gamer knows the code... Up Up Down Down Left Right Left Right B A. Try it anywhere!",
    funHint: "Old school gamers know this one! Think Contra, think 30 lives..."
  },
  { 
    id: 2, 
    name: "AVATAR WHISPERER", 
    hint: "My 3D avatar in the hero section loves attention. Give it some clicks and see what happens!",
    funHint: "That 3D avatar up top? She's ticklish... try clicking multiple times!"
  },
  { 
    id: 3, 
    name: "FOOTER DETECTIVE", 
    hint: "The footer holds secrets. Hover over my name for a few seconds and wait...",
    funHint: "Patience is a virtue! The footer rewards those who linger..."
  },
  { 
    id: 4, 
    name: "RAINBOW CODER", 
    hint: "Type something colorful in this chat! Think Roy G. Biv...",
    funHint: "What word describes all the colors together? Type it right here!"
  },
  { 
    id: 5, 
    name: "NIGHT OWL", 
    hint: "Some secrets only reveal themselves when the clock strikes midnight (00:00)!",
    funHint: "Are you a night owl? Visit at the witching hour for a surprise!"
  },
];

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ConversationState {
  awaitingHintConfirmation: boolean;
  lastTopic: string | null;
}

// Animated avatar HEAD ONLY component - cropped to show face + hair
function AvatarHead({ expression, isBlinking }: { expression: "happy" | "thinking" | "idle"; isBlinking: boolean }) {
  const { scene } = useGLTF(AVATAR_URL);
  const headRef = useRef<THREE.Group>(null);
  const baseRotationY = useRef(0);
  
  useFrame((state) => {
    if (headRef.current) {
      const time = state.clock.elapsedTime;
      
      // Subtle base breathing/floating motion
      headRef.current.position.y = Math.sin(time * 1.2) * 0.008 - 1.35;
      
      // Expression-based head movements
      if (expression === "thinking") {
        // Head tilts side to side while thinking (5-10 degrees = 0.087-0.175 radians)
        headRef.current.rotation.z = Math.sin(time * 2.5) * 0.12; // ~7 degrees
        headRef.current.rotation.x = Math.sin(time * 1.8) * 0.05; // slight nod
        // Smooth rotation towards thinking direction
        baseRotationY.current += (Math.sin(time * 1.5) * 0.08 - baseRotationY.current) * 0.05;
      } else if (expression === "happy") {
        // Happy bounce and nod
        headRef.current.rotation.z = Math.sin(time * 3) * 0.06;
        headRef.current.position.y = Math.sin(time * 4) * 0.015 - 1.35; // bouncy
        // Slight wink-like tilt
        baseRotationY.current += (Math.sin(time * 2) * 0.1 - baseRotationY.current) * 0.08;
      } else {
        // Idle: very subtle gentle sway
        headRef.current.rotation.z = Math.sin(time * 0.8) * 0.03;
        baseRotationY.current += (Math.sin(time * 0.5) * 0.04 - baseRotationY.current) * 0.03;
      }
      
      headRef.current.rotation.y = baseRotationY.current;
      
      // Blink simulation - slightly close eyes area (scale Y trick)
      if (isBlinking) {
        headRef.current.scale.y = 0.98;
      } else {
        headRef.current.scale.y = 1;
      }
    }
  });

  return (
    <group ref={headRef} position={[0, -1.35, 0]} scale={2.8}>
      <primitive object={scene.clone()} />
    </group>
  );
}

function AvatarScene({ expression, isBlinking }: { expression: "happy" | "thinking" | "idle"; isBlinking: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 0.15, 1.2], fov: 35 }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 3, 5]} intensity={0.9} />
      <pointLight position={[-3, 2, 4]} intensity={0.5} color="#8b5cf6" />
      <pointLight position={[0, -1, 3]} intensity={0.3} color="#06b6d4" />
      <Suspense fallback={null}>
        <AvatarHead expression={expression} isBlinking={isBlinking} />
      </Suspense>
    </Canvas>
  );
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hey there! I'm Ananya's portfolio buddy. I know all about her amazing work in AR/VR, healthcare tech, and UX design. Also... there are 5 hidden easter eggs in this portfolio. Want to find them all?",
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
  const [conversationState, setConversationState] = useState<ConversationState>({
    awaitingHintConfirmation: false,
    lastTopic: null,
  });
  const [isClient, setIsClient] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize client-side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Blink animation every 3-5 seconds
  useEffect(() => {
    if (!isOpen) return;
    
    const triggerBlink = () => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150); // Quick blink
    };

    // Random interval between 3-5 seconds
    const scheduleNextBlink = () => {
      const delay = 3000 + Math.random() * 2000;
      return setTimeout(() => {
        triggerBlink();
        blinkTimeout.current = scheduleNextBlink();
      }, delay);
    };

    const blinkTimeout = { current: scheduleNextBlink() };

    return () => {
      if (blinkTimeout.current) clearTimeout(blinkTimeout.current);
    };
  }, [isOpen]);

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

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Listen for easter egg discoveries from other parts of the portfolio
  useEffect(() => {
    const handleEggFound = (e: CustomEvent<{ eggId: number; eggName: string }>) => {
      const { eggId, eggName } = e.detail;
      if (!eggsFound.has(eggId)) {
        setEggsFound((prev) => new Set([...prev, eggId]));
        // Auto-open chat and announce
        setIsOpen(true);
        const remaining = 5 - eggsFound.size - 1;
        const newMessage: Message = {
          id: Date.now(),
          text: `Woohoo! You found ${eggName}! ${remaining > 0 ? `${remaining} more to go! Keep hunting!` : "That's all 5! You're a true explorer!"}`,
          isUser: false,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, newMessage]);
        setExpression("happy");
        setTimeout(() => setExpression("idle"), 3000);
      }
    };

    window.addEventListener("easterEggFound" as any, handleEggFound as any);
    return () => window.removeEventListener("easterEggFound" as any, handleEggFound as any);
  }, [eggsFound]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = useCallback((userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase().trim();
    
    // Check for rainbow easter egg
    if (lowerMessage === "rainbow" || lowerMessage.includes("rainbow")) {
      setShowRainbow(true);
      setTimeout(() => setShowRainbow(false), 5000);
      if (!eggsFound.has(4)) {
        setEggsFound((prev) => new Set([...prev, 4]));
        const remaining = 5 - eggsFound.size - 1;
        return `AMAZING! You found RAINBOW CODER! Watch the magic... ${remaining > 0 ? `${remaining} more eggs to discover!` : "That's all 5! You're legendary!"}`;
      }
      return "Ooh, pretty colors! You've already found this one though. Try the other hints!";
    }
    
    // Check for yes/confirmation when awaiting hint
    if (conversationState.awaitingHintConfirmation) {
      if (lowerMessage.match(/^(yes|yeah|yep|sure|ok|okay|please|yea|y|definitely|absolutely)$/)) {
        setConversationState({ awaitingHintConfirmation: false, lastTopic: "hint" });
        const egg = EASTER_EGGS[currentHintIndex];
        setCurrentHintIndex((prev) => (prev + 1) % EASTER_EGGS.length);
        return `Here's a clue for "${egg.name}": ${egg.funHint}`;
      }
      if (lowerMessage.match(/^(no|nope|nah|n|not now|later)$/)) {
        setConversationState({ awaitingHintConfirmation: false, lastTopic: null });
        return "No worries! Ask me about Ananya's projects, skills, or publications instead!";
      }
    }
    
    // Easter eggs inquiry
    if (lowerMessage.match(/easter|eggs?|hidden|secret|hunt/)) {
      const found = eggsFound.size;
      if (found === 5) {
        return "You found ALL 5 easter eggs! You're amazing! Want to know more about Ananya's work?";
      }
      setConversationState({ awaitingHintConfirmation: true, lastTopic: "easter" });
      return `There are 5 hidden gems in this portfolio! You've found ${found}/5 so far. Want a hint?`;
    }
    
    // Hint requests
    if (lowerMessage.match(/hint|clue|help me find|give me/)) {
      const egg = EASTER_EGGS[currentHintIndex];
      setCurrentHintIndex((prev) => (prev + 1) % EASTER_EGGS.length);
      return `Alright, here's one: ${egg.funHint}`;
    }
    
    // Greetings
    if (lowerMessage.match(/^(hi|hello|hey|howdy|hola|yo|sup|greetings)/)) {
      const greetings = [
        "Hey there! Great to see you! I'm here to help you explore Ananya's portfolio. What interests you?",
        "Hello! Welcome to Ananya's digital space! Ask me about her AR/VR projects or try to find some easter eggs!",
        "Hi! I'm so glad you're here! Ananya's got some amazing work to show. Where should we start?",
      ];
      return greetings[Math.floor(Math.random() * greetings.length)];
    }
    
    // Projects
    if (lowerMessage.match(/project|work|portfolio|built|created|made/)) {
      return "Ananya has some incredible projects! Check out Adaptive MR for healthcare accessibility, her work on the official Lens Studio Guide at Snap, or the award-winning Blood-Organ Donation app. Scroll down to Projects or click the button below!";
    }
    
    // Skills
    if (lowerMessage.match(/skill|tech|stack|know|language|tool/)) {
      return "Ananya's a powerhouse! Unity 6 for XR, React & Next.js for web, Python for AI/ML, Figma for design, and she's certified in Lens Studio. She bridges tech and design beautifully!";
    }
    
    // Experience
    if (lowerMessage.match(/experience|job|work|career|company|intern/)) {
      return "She's worked at Snap Inc. as a Lens Studio Specialist (how cool is that?!), conducted research at ADAPT Centre on adaptive interfaces, and has 4+ years in the XR space!";
    }
    
    // Education
    if (lowerMessage.match(/education|study|university|college|degree|school/)) {
      return "Ananya is pursuing her MSc in Human-Computer Interaction at University College Dublin. She's combining tech skills with deep UX understanding!";
    }
    
    // Publications/Research
    if (lowerMessage.match(/publication|research|paper|published|academic/)) {
      return "She's got published research on adaptive MR interfaces for motor impairments and multimodal feedback in XR environments. Real cutting-edge stuff! Check the Publications section!";
    }
    
    // Contact
    if (lowerMessage.match(/contact|email|reach|hire|connect|linkedin/)) {
      return "Want to connect with Ananya? Email her at ananyachandraker02@gmail.com or find her on LinkedIn! She'd love to hear from you!";
    }
    
    // AR/VR/XR specific
    if (lowerMessage.match(/ar|vr|xr|mixed reality|augmented|virtual|metaverse|lens/)) {
      return "AR/VR is Ananya's jam! From Snap Lens creation to Unity-based mixed reality healthcare apps, she's all about immersive experiences. Her Adaptive MR project is particularly groundbreaking!";
    }
    
    // Who/About Ananya
    if (lowerMessage.match(/who|about|ananya|herself|tell me/)) {
      return "Ananya is an MSc HCI student, AR/VR developer, and UX designer passionate about creating tech that makes a real difference. She's worked at Snap, published research, and builds healthcare solutions!";
    }
    
    // Thanks
    if (lowerMessage.match(/thank|thanks|thx|appreciate/)) {
      const responses = [
        "You're welcome! Happy to help! Anything else you'd like to know?",
        "Anytime! That's what I'm here for! Need anything else?",
        "My pleasure! Keep exploring, there's lots to discover here!",
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Default responses with personality
    const defaultResponses = [
      "Hmm, not sure about that one! But hey, have you checked out the Projects section? Some really cool AR/VR stuff there!",
      "I might not have the answer to that, but I DO know there are easter eggs hidden around... want a hint?",
      "Good question! I specialize in Ananya's portfolio though. Ask about her skills, projects, or try to find the 5 hidden secrets!",
      "That's a thinker! While I ponder that, why not explore the Publications section? Some fascinating research there!",
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  }, [conversationState, currentHintIndex, eggsFound]);

  const handleSendMessage = useCallback(() => {
    if (!inputValue.trim()) return;
    
    const userMessage: Message = {
      id: Date.now(),
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    const userInput = inputValue;
    setInputValue("");
    setIsTyping(true);
    setExpression("thinking");
    
    // Simulate typing delay with variable timing
    const typingDelay = 800 + Math.random() * 700;
    setTimeout(() => {
      const botResponse: Message = {
        id: Date.now() + 1,
        text: getBotResponse(userInput),
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
      setExpression("happy");
      
      // Reset to idle after celebrating
      setTimeout(() => setExpression("idle"), 2500);
    }, typingDelay);
  }, [inputValue, getBotResponse]);

  const handleQuickAction = (action: string) => {
    let message = "";
    switch (action) {
      case "projects":
        message = "Tell me about the projects";
        break;
      case "publications":
        message = "What research has Ananya published?";
        break;
      case "easter":
        message = "Easter eggs?";
        break;
    }
    setInputValue(message);
    setTimeout(() => {
      const userMessage: Message = {
        id: Date.now(),
        text: message,
        isUser: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setIsTyping(true);
      setExpression("thinking");
      
      setTimeout(() => {
        const botResponse: Message = {
          id: Date.now() + 1,
          text: getBotResponse(message),
          isUser: false,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botResponse]);
        setIsTyping(false);
        setExpression("happy");
        setTimeout(() => setExpression("idle"), 2500);
      }, 1000);
      
      setInputValue("");
    }, 50);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const eggsFoundCount = eggsFound.size;

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
              background: "linear-gradient(45deg, rgba(255,0,0,0.15), rgba(255,165,0,0.15), rgba(255,255,0,0.15), rgba(0,128,0,0.15), rgba(0,0,255,0.15), rgba(75,0,130,0.15), rgba(238,130,238,0.15))",
              animation: "rainbow-shift 2s linear infinite",
            }}
          />
        )}
      </AnimatePresence>

      {/* Floating chat button with avatar head thumbnail */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-primary/80 to-accent/80 shadow-lg shadow-primary/30 flex items-center justify-center overflow-hidden border-2 border-primary/50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: isOpen
            ? "0 0 20px rgba(139, 92, 246, 0.5)"
            : [
                "0 0 20px rgba(139, 92, 246, 0.3)",
                "0 0 40px rgba(139, 92, 246, 0.6)",
                "0 0 20px rgba(139, 92, 246, 0.3)",
              ],
        }}
        transition={{
          boxShadow: {
            repeat: isOpen ? 0 : Infinity,
            duration: 2,
          },
        }}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="relative w-full h-full"
            >
              {/* Avatar head thumbnail */}
              <div className="absolute inset-0 w-full h-full">
                {isClient && (
                  <Canvas
                    camera={{ position: [0, 0.15, 1.2], fov: 35 }}
                    style={{ background: "transparent" }}
                  >
                    <ambientLight intensity={0.8} />
                    <directionalLight position={[3, 3, 5]} intensity={0.7} />
                    <Suspense fallback={null}>
                      <AvatarHead expression="idle" isBlinking={isBlinking} />
                    </Suspense>
                  </Canvas>
                )}
              </div>
              {/* Notification dot for eggs */}
              {eggsFoundCount > 0 && eggsFoundCount < 5 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-[10px] font-bold rounded-full flex items-center justify-center text-white border border-white/30 z-10">
                  {eggsFoundCount}
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        {/* Pulse ring when closed */}
        {!isOpen && (
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
            className={`fixed z-50 overflow-hidden
              bottom-24 right-6 w-[360px] sm:w-[400px] h-[500px] rounded-3xl
              max-sm:inset-0 max-sm:w-full max-sm:h-full max-sm:rounded-none max-sm:bottom-0 max-sm:right-0
              ${showRainbow ? "animate-rainbow-border" : ""}`}
            style={{
              background: "rgba(15, 23, 42, 0.97)",
              backdropFilter: "blur(20px)",
              border: showRainbow
                ? "2px solid transparent"
                : "1px solid rgba(139, 92, 246, 0.3)",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(139, 92, 246, 0.2)",
            }}
          >
            {/* Mobile close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="sm:hidden absolute top-4 right-4 z-10 p-2 rounded-full bg-secondary/50 hover:bg-secondary"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header with avatar */}
            <div className="relative h-32 bg-gradient-to-b from-primary/20 to-transparent">
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div 
                  className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-primary/30 to-accent/30 border-2 border-primary/40"
                  animate={isTyping ? { 
                    rotate: [-2, 2, -2],
                    transition: { repeat: Infinity, duration: 0.3 }
                  } : {}}
                >
                  {isClient && <AvatarScene expression={expression} isBlinking={isBlinking} />}
                </motion.div>
              </div>
              {/* Easter eggs counter */}
              <motion.div 
                className="absolute top-3 right-3 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-xs text-primary-foreground flex items-center gap-1"
                animate={eggsFoundCount > 0 ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.3 }}
                key={eggsFoundCount}
              >
                <Gift className="w-3 h-3" />
                <span>{eggsFoundCount}/5 found!</span>
              </motion.div>
              {/* Expression indicator */}
              <motion.div 
                className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-muted-foreground"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                {isTyping ? "Thinking..." : expression === "happy" ? "Happy to help!" : "Ask me anything!"}
              </motion.div>
            </div>

            {/* Messages area */}
            <div className="h-[260px] max-sm:h-[calc(100%-220px)] overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10, x: message.isUser ? 10 : -10 }}
                  animate={{ opacity: 1, y: 0, x: 0 }}
                  transition={{ delay: index === messages.length - 1 ? 0 : 0 }}
                  className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
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
                  <div className="bg-secondary/50 px-4 py-3 rounded-2xl rounded-bl-md border border-border/50">
                    <div className="flex gap-1.5">
                      <motion.span 
                        className="w-2 h-2 bg-primary/60 rounded-full"
                        animate={{ y: [0, -6, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                      />
                      <motion.span 
                        className="w-2 h-2 bg-primary/60 rounded-full"
                        animate={{ y: [0, -6, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0.15 }}
                      />
                      <motion.span 
                        className="w-2 h-2 bg-primary/60 rounded-full"
                        animate={{ y: [0, -6, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0.3 }}
                      />
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
                className="text-xs rounded-full border-primary/30 hover:bg-primary/20 hover:border-primary/50 whitespace-nowrap transition-all"
                onClick={() => handleQuickAction("projects")}
              >
                <FolderOpen className="w-3 h-3 mr-1" />
                Projects
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-xs rounded-full border-primary/30 hover:bg-primary/20 hover:border-primary/50 whitespace-nowrap transition-all"
                onClick={() => handleQuickAction("publications")}
              >
                <BookOpen className="w-3 h-3 mr-1" />
                Publications
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-xs rounded-full border-primary/30 hover:bg-primary/20 hover:border-primary/50 whitespace-nowrap transition-all group"
                onClick={() => handleQuickAction("easter")}
              >
                <Gift className="w-3 h-3 mr-1 group-hover:animate-bounce" />
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
                  className="flex-1 px-4 py-2.5 rounded-full bg-secondary/50 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                />
                <Button
                  size="icon"
                  className="rounded-full bg-primary hover:bg-primary/90 w-10 h-10 transition-transform hover:scale-105"
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground/50 text-center mt-2">
                Press ESC to close
              </p>
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
          background: linear-gradient(rgba(15, 23, 42, 0.97), rgba(15, 23, 42, 0.97)) padding-box,
                      linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #ee82ee) border-box !important;
          border: 2px solid transparent !important;
          animation: rainbow-shift 2s linear infinite;
        }
      `}</style>
    </>
  );
}
