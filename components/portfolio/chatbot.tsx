"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, Sparkles, Gift, HelpCircle, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

// Easter eggs data - 4 simple click-based eggs
const EASTER_EGGS = [
  { 
    id: 1, 
    name: "SECRET MENU", 
    hint: "Try clicking my name or logo multiple times!",
    funHint: "See that AC logo in the navigation? Give it 3 clicks and see what happens!"
  },
  { 
    id: 2, 
    name: "EXPLORER", 
    hint: "Have you explored the entire page? Try scrolling all the way down!",
    funHint: "True explorers see everything! Scroll to the very bottom of the page..."
  },
  { 
    id: 3, 
    name: "SKILL MASTER", 
    hint: "Check out my skills in the About section... try clicking each one!",
    funHint: "There are 6 skill cards in the About section. Click ALL of them to become a Skill Master!"
  },
  { 
    id: 4, 
    name: "SOCIAL BUTTERFLY", 
    hint: "Want to connect? Try clicking all my social media icons!",
    funHint: "In the hero section, there are 3 social icons (LinkedIn, GitHub, Email). Click all 3!"
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

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hey there! I'm Ananya's portfolio buddy. I know all about her amazing work in AR/VR, healthcare tech, and UX design. Also... there are 4 hidden easter eggs in this portfolio. Want to find them all?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [eggsFound, setEggsFound] = useState<Set<number>>(new Set());
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [conversationState, setConversationState] = useState<ConversationState>({
    awaitingHintConfirmation: false,
    lastTopic: null,
  });
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
        const remaining = 4 - eggsFound.size - 1;
        const newMessage: Message = {
          id: Date.now(),
          text: `Amazing! You found ${eggName}! ${remaining > 0 ? `${remaining} more to go! Keep hunting!` : "That's all 4! You're a Master Explorer!"}`,
          isUser: false,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, newMessage]);
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

  const getUnfoundHint = useCallback(() => {
    // Get hints for eggs not yet found
    const unfoundEggs = EASTER_EGGS.filter(egg => !eggsFound.has(egg.id));
    if (unfoundEggs.length === 0) {
      return "You've found them all! You're amazing!";
    }
    const randomEgg = unfoundEggs[Math.floor(Math.random() * unfoundEggs.length)];
    return `Hint for "${randomEgg.name}": ${randomEgg.funHint}`;
  }, [eggsFound]);

  const getBotResponse = useCallback((userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase().trim();
    
    // Check for yes/confirmation when awaiting hint
    if (conversationState.awaitingHintConfirmation) {
      if (lowerMessage.match(/^(yes|yeah|yep|sure|ok|okay|please|yea|y|definitely|absolutely)$/)) {
        setConversationState({ awaitingHintConfirmation: false, lastTopic: "hint" });
        return getUnfoundHint();
      }
      if (lowerMessage.match(/^(no|nope|nah|n|not now|later)$/)) {
        setConversationState({ awaitingHintConfirmation: false, lastTopic: null });
        return "No worries! Ask me about Ananya's projects, skills, or publications instead!";
      }
    }
    
    // Help requests
    if (lowerMessage.match(/^help$|how do i|what can/)) {
      return "Find 4 hidden surprises in this portfolio! Want a hint? Just ask! You can also ask me about Ananya's projects, skills, experience, or publications.";
    }
    
    // Easter eggs inquiry
    if (lowerMessage.match(/easter|eggs?|hidden|secret|hunt|surprise/)) {
      const found = eggsFound.size;
      if (found === 4) {
        return "WOW! You found them all! Master Explorer! Want to know more about Ananya's work?";
      }
      setConversationState({ awaitingHintConfirmation: true, lastTopic: "easter" });
      return `There are 4 hidden gems in this portfolio! You've found ${found}/4 so far. Want a hint?`;
    }
    
    // Hint requests
    if (lowerMessage.match(/hint|clue|help me find|give me/)) {
      return getUnfoundHint();
    }
    
    // Progress check
    if (lowerMessage.match(/progress|how many|found|status|score/)) {
      const found = eggsFound.size;
      if (found === 0) {
        return "You haven't found any easter eggs yet! There are 4 hidden around the portfolio. Want a hint to get started?";
      }
      if (found === 4) {
        return "You found ALL 4 easter eggs! Master Explorer status achieved! What else can I help you with?";
      }
      const foundNames = EASTER_EGGS.filter(e => eggsFound.has(e.id)).map(e => e.name).join(", ");
      return `You've found ${found}/4 easter eggs! (${foundNames}) Keep exploring!`;
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
      return "Ananya has some incredible projects! Check out Adaptive MR for healthcare accessibility, her work on the official Lens Studio Guide at Snap, or the award-winning Blood-Organ Donation app. Scroll down to Projects to explore!";
    }
    
    // Skills
    if (lowerMessage.match(/skill|tech|stack|know|language|tool/)) {
      return "Ananya's a powerhouse! Unity 6 for XR, React & Next.js for web, Python for AI/ML, Figma for design, and she's certified in Lens Studio. Check out the About section for more!";
    }
    
    // Experience
    if (lowerMessage.match(/experience|job|work|career|company|intern/)) {
      return "She's worked at Snap Inc. as a Lens Studio Specialist, conducted research at ADAPT Centre on adaptive interfaces, and has 4+ years in the XR space!";
    }
    
    // Education
    if (lowerMessage.match(/education|study|university|college|degree|school/)) {
      return "Ananya is pursuing her MSc in Human-Computer Interaction at University College Dublin. She's combining tech skills with deep UX understanding!";
    }
    
    // Publications/Research
    if (lowerMessage.match(/publication|research|paper|published|academic/)) {
      return "She's got published research on adaptive MR interfaces for motor impairments and multimodal feedback in XR environments. Real cutting-edge stuff!";
    }
    
    // Contact
    if (lowerMessage.match(/contact|email|reach|hire|connect|linkedin/)) {
      return "Want to connect with Ananya? Email her at ananyachandraker02@gmail.com or find her on LinkedIn! She'd love to hear from you!";
    }
    
    // AR/VR/XR specific
    if (lowerMessage.match(/ar|vr|xr|mixed reality|augmented|virtual|metaverse|lens/)) {
      return "AR/VR is Ananya's jam! From Snap Lens creation to Unity-based mixed reality healthcare apps, she's all about immersive experiences.";
    }
    
    // Who/About Ananya
    if (lowerMessage.match(/who|about|ananya|herself|tell me/)) {
      return "Ananya is an MSc HCI student, AR/VR developer, and UX designer passionate about creating tech that makes a real difference!";
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
      "Good question! I specialize in Ananya's portfolio though. Ask about her skills, projects, or try to find the 4 hidden secrets!",
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  }, [conversationState, eggsFound, getUnfoundHint]);

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
    }, typingDelay);
  }, [inputValue, getBotResponse]);

  const handleQuickAction = (action: string) => {
    let responseText = "";
    
    switch (action) {
      case "hint":
        responseText = getUnfoundHint();
        break;
      case "progress":
        const found = eggsFound.size;
        if (found === 0) {
          responseText = "You haven't found any easter eggs yet! There are 4 hidden around the portfolio. Want a hint?";
        } else if (found === 4) {
          responseText = "You found ALL 4 easter eggs! Master Explorer!";
        } else {
          const foundNames = EASTER_EGGS.filter(e => eggsFound.has(e.id)).map(e => e.name).join(", ");
          responseText = `You've found ${found}/4! (${foundNames})`;
        }
        break;
      default:
        return;
    }
    
    const botMessage: Message = {
      id: Date.now(),
      text: responseText,
      isUser: false,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, botMessage]);
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
              className="relative"
            >
              <Sparkles className="w-6 h-6 text-white" />
              {/* Notification dot for eggs */}
              {eggsFoundCount > 0 && eggsFoundCount < 4 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-[10px] font-bold rounded-full flex items-center justify-center text-white">
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
            className="fixed z-50 overflow-hidden bottom-24 right-6 w-[360px] sm:w-[400px] h-[500px] rounded-3xl max-sm:inset-0 max-sm:w-full max-sm:h-full max-sm:rounded-none max-sm:bottom-0 max-sm:right-0"
            style={{
              background: "rgba(15, 23, 42, 0.97)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(139, 92, 246, 0.3)",
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

            {/* Header */}
            <div className="relative p-4 border-b border-border/30 bg-gradient-to-r from-primary/10 to-accent/10">
              <div className="flex items-center gap-3">
                <motion.div 
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center"
                  animate={isTyping ? { 
                    rotate: [-5, 5, -5],
                    transition: { repeat: Infinity, duration: 0.4 }
                  } : {}}
                >
                  <Sparkles className="w-5 h-5 text-white" />
                </motion.div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-foreground">Portfolio Assistant</h3>
                  <p className="text-xs text-muted-foreground">
                    {isTyping ? "Thinking..." : "Ask me anything!"}
                  </p>
                </div>
                {/* Easter eggs counter with progress bar */}
                <motion.div 
                  className="flex flex-col items-end gap-1"
                  animate={eggsFoundCount > 0 ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.3 }}
                  key={eggsFoundCount}
                >
                  <div className="px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-xs text-primary-foreground flex items-center gap-1">
                    <Gift className="w-3 h-3" />
                    <span>Found: {eggsFoundCount}/4</span>
                  </div>
                  {/* Mini progress bar */}
                  <div className="w-20 h-1.5 bg-secondary/50 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary to-accent"
                      initial={{ width: 0 }}
                      animate={{ width: `${(eggsFoundCount / 4) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Messages area */}
            <div className="h-[280px] max-sm:h-[calc(100%-200px)] overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
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
            <div className="px-4 py-2 flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1 text-xs rounded-full border-primary/30 hover:bg-primary/20 hover:border-primary/50 whitespace-nowrap transition-all"
                onClick={() => handleQuickAction("hint")}
              >
                <HelpCircle className="w-3.5 h-3.5 mr-1.5" />
                Give Hint
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 text-xs rounded-full border-primary/30 hover:bg-primary/20 hover:border-primary/50 whitespace-nowrap transition-all"
                onClick={() => handleQuickAction("progress")}
              >
                <BarChart3 className="w-3.5 h-3.5 mr-1.5" />
                Show Progress
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
                  placeholder="Ask about projects, skills, easter eggs..."
                  className="flex-1 px-4 py-2.5 rounded-full bg-secondary/50 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                />
                <Button
                  size="icon"
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  className="rounded-full bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
