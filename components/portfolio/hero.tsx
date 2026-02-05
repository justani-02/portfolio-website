"use client";

import { useEffect, useRef, useState, Suspense, createContext, useContext } from "react";
import { Github, Linkedin, Mail, ChevronDown, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

// Dynamically import Three.js components to avoid SSR issues with ProgressEvent
const Canvas = dynamic(
  () => import("@react-three/fiber").then((mod) => mod.Canvas),
  { ssr: false }
);
const OrbitControls = dynamic(
  () => import("@react-three/drei").then((mod) => mod.OrbitControls),
  { ssr: false }
);
const Environment = dynamic(
  () => import("@react-three/drei").then((mod) => mod.Environment),
  { ssr: false }
);

// Import hooks directly since they're only used in client components
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const AVATAR_URL = "https://models.readyplayer.me/695ab54e8f9c70cbc92c8821.glb";

// Context to share mouse position with 3D scene
const MouseContext = createContext({ x: 0, y: 0 });

function Avatar() {
  const { scene } = useGLTF(AVATAR_URL);
  const avatarRef = useRef<THREE.Group>(null);
  const mouse = useContext(MouseContext);
  const targetRotation = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    if (avatarRef.current) {
      // Floating animation
      avatarRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.08 - 0.9;
      
      // Calculate target rotation based on mouse position
      targetRotation.current.y = mouse.x * 0.5; // Horizontal rotation follows mouse X
      targetRotation.current.x = mouse.y * 0.15; // Slight vertical tilt follows mouse Y
      
      // Smooth interpolation (lerp) for natural movement
      avatarRef.current.rotation.y = THREE.MathUtils.lerp(
        avatarRef.current.rotation.y,
        targetRotation.current.y,
        0.05
      );
      avatarRef.current.rotation.x = THREE.MathUtils.lerp(
        avatarRef.current.rotation.x,
        targetRotation.current.x,
        0.05
      );
    }
  });

  return (
    <group ref={avatarRef} position={[0, -0.9, 0]} scale={0.95}>
      <primitive object={scene} />
    </group>
  );
}

function AvatarScene({ mousePosition }: { mousePosition: { x: number; y: number } }) {
  return (
    <MouseContext.Provider value={mousePosition}>
      <Canvas
        camera={{ position: [0, 0.8, 2.8], fov: 50 }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <directionalLight position={[-5, 3, -5]} intensity={0.5} color="#8b5cf6" />
        <spotLight position={[0, 5, 0]} intensity={0.6} angle={0.5} penumbra={1} />
        <Suspense fallback={null}>
          <Avatar />
          <Environment preset="city" />
        </Suspense>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={true}
          rotateSpeed={0.5}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.8}
          minAzimuthAngle={-Math.PI / 3}
          maxAzimuthAngle={Math.PI / 3}
        />
      </Canvas>
    </MouseContext.Provider>
  );
}

export function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const avatarContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(true);
    setIsClient(true);
  }, []);

  // Track mouse position relative to avatar container
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (avatarContainerRef.current) {
        const rect = avatarContainerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Normalize to -1 to 1 range
        const x = (e.clientX - centerX) / (window.innerWidth / 2);
        const y = (e.clientY - centerY) / (window.innerHeight / 2);
        
        setMousePosition({ x: Math.max(-1, Math.min(1, x)), y: Math.max(-1, Math.min(1, y)) });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 md:pt-20"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-6 text-center lg:text-left"
          >
            <div className="space-y-2">
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-primary font-medium tracking-wide uppercase text-sm"
              >
                Welcome to my portfolio
              </motion.p>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-tight text-balance"
              >
                Ananya{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                  Chandraker
                </span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-lg sm:text-xl text-muted-foreground"
              >
                MSc HCI Student | AR/VR Developer | UX Designer
              </motion.p>
            </div>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={isVisible ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed text-pretty"
            >
              Creating immersive experiences that bridge the digital and
              physical worlds. Currently pursuing Human-Computer Interaction at
              University College Dublin. Specializing in AR/VR development, user
              research, and designing solutions that create meaningful social
              impact.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start flex-wrap"
            >
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground transition-transform hover:scale-105"
                asChild
              >
                <a href="#projects">View Projects</a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-border hover:bg-secondary bg-transparent transition-transform hover:scale-105"
                asChild
              >
                <a href="#contact">Contact Me</a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary/50 hover:bg-primary/10 bg-transparent group/resume transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20"
                asChild
              >
                <a href="/Ananya_Chandraker_Resume.pdf" download="Ananya_Chandraker_Resume.pdf">
                  <Download className="w-4 h-4 mr-2 group-hover/resume:animate-bounce" />
                  Download Resume
                </a>
              </Button>
            </motion.div>

            {/* Social Links */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex items-center gap-4 justify-center lg:justify-start pt-4 relative z-20"
            >
              {[
                { href: "https://www.linkedin.com/in/ananya-chandraker/", Icon: Linkedin, label: "LinkedIn" },
                { href: "https://github.com/justani-02", Icon: Github, label: "GitHub" },
                { href: "mailto:ananyachandraker02@gmail.com", Icon: Mail, label: "Email" },
              ].map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target={social.label !== "Email" ? "_blank" : undefined}
                  rel={social.label !== "Email" ? "noopener noreferrer" : undefined}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 rounded-full bg-card border border-border hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 relative z-20"
                  aria-label={social.label}
                >
                  <social.Icon className="w-5 h-5 text-muted-foreground pointer-events-none" />
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - 3D Avatar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="relative"
          >
            <div 
              ref={avatarContainerRef}
              data-avatar-container
              className="relative w-full max-w-[400px] h-[500px] lg:max-w-[450px] lg:h-[580px] mx-auto"
            >
              {/* Glow effect behind avatar */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={isVisible ? { opacity: 1 } : {}}
                transition={{ duration: 1, delay: 0.5 }}
                className="absolute inset-0 bg-gradient-to-t from-primary/20 via-primary/5 to-transparent rounded-full blur-3xl" 
              />
              
              {/* Interaction hint */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 1 }}
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-xs text-muted-foreground/60 flex items-center gap-2 z-20"
              >
                <span className="inline-block w-4 h-4 border border-muted-foreground/40 rounded-sm" />
                <span>Drag to rotate</span>
              </motion.div>
              
              {/* 3D Avatar with React Three Fiber */}
              <div className="relative z-10 w-full h-full">
                {isClient && <AvatarScene mousePosition={mousePosition} />}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <a
            href="#about"
            className="flex flex-col items-center gap-1 group"
            aria-label="Scroll to About section"
          >
            <ChevronDown className="w-6 h-6 text-muted-foreground group-hover:text-primary animate-bounce transition-colors" />
            <ChevronDown className="w-6 h-6 text-muted-foreground/50 group-hover:text-primary/50 -mt-4 animate-bounce transition-colors" style={{ animationDelay: "0.15s" }} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

// Preload the avatar model - only on client side
if (typeof window !== "undefined") {
  useGLTF.preload(AVATAR_URL);
}
