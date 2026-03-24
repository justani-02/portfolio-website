"use client";

import { useRef, Suspense, createContext, useContext, useState, useEffect, Component, ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF } from "@react-three/drei";
import * as THREE from "three";

const AVATAR_URL = "https://models.readyplayer.me/695ab54e8f9c70cbc92c8821.glb";

// Context to share mouse position with 3D scene
const MouseContext = createContext({ x: 0, y: 0 });

// Error boundary for Three.js
interface ErrorBoundaryState {
  hasError: boolean;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

class ThreeErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.log("[v0] Three.js Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

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
      targetRotation.current.y = mouse.x * 0.5;
      targetRotation.current.x = mouse.y * 0.15;

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

function AvatarFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-center text-muted-foreground">
        <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 animate-pulse" />
        <p className="text-sm">3D Avatar</p>
      </div>
    </div>
  );
}

export function AvatarScene({ mousePosition }: { mousePosition: { x: number; y: number } }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Small delay to ensure proper hydration
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return <AvatarFallback />;
  }

  return (
    <ThreeErrorBoundary fallback={<AvatarFallback />}>
      <MouseContext.Provider value={mousePosition}>
        <Canvas
          camera={{ position: [0, 0.8, 2.8], fov: 50 }}
          style={{ background: "transparent" }}
          gl={{ antialias: true, alpha: true }}
          onCreated={() => {
            console.log("[v0] Canvas created successfully");
          }}
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
    </ThreeErrorBoundary>
  );
}
