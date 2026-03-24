"use client";

import { useRef, Suspense, createContext, useContext, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF, Center } from "@react-three/drei";
import * as THREE from "three";

const AVATAR_URL = "https://models.readyplayer.me/695ab54e8f9c70cbc92c8821.glb";

// Context to share mouse position with 3D scene
const MouseContext = createContext({ x: 0, y: 0 });

// Preload the model
useGLTF.preload(AVATAR_URL);

function Avatar() {
  const { scene } = useGLTF(AVATAR_URL);
  const avatarRef = useRef<THREE.Group>(null);
  const mouse = useContext(MouseContext);
  const targetRotation = useRef({ x: 0, y: 0 });

  // Clone the scene to avoid issues with reusing
  const clonedScene = scene.clone();

  useFrame((state) => {
    if (avatarRef.current) {
      // Floating animation
      avatarRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.08;

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
    <Center>
      <group ref={avatarRef} scale={1.8}>
        <primitive object={clonedScene} />
      </group>
    </Center>
  );
}

function LoadingFallback() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshStandardMaterial color="#8b5cf6" wireframe />
    </mesh>
  );
}

function AvatarFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl">
      <div className="text-center text-muted-foreground">
        <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 animate-pulse flex items-center justify-center">
          <svg className="w-16 h-16 text-primary/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <p className="text-sm font-medium">Loading Avatar...</p>
      </div>
    </div>
  );
}

export function AvatarScene({ mousePosition }: { mousePosition: { x: number; y: number } }) {
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return <AvatarFallback />;
  }

  if (hasError) {
    return <AvatarFallback />;
  }

  return (
    <MouseContext.Provider value={mousePosition}>
      <Canvas
        camera={{ position: [0, 0.2, 3], fov: 45 }}
        style={{ background: "transparent", width: "100%", height: "100%" }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance"
        }}
        dpr={[1, 2]}
        onError={() => setHasError(true)}
      >
        <color attach="background" args={["transparent"]} />
        <ambientLight intensity={1} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} castShadow />
        <directionalLight position={[-5, 3, -5]} intensity={0.8} color="#8b5cf6" />
        <spotLight position={[0, 5, 0]} intensity={0.8} angle={0.5} penumbra={1} />
        <pointLight position={[0, 0, 3]} intensity={0.5} color="#ffffff" />
        <Suspense fallback={<LoadingFallback />}>
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
