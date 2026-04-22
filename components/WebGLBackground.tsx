"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import * as THREE from "three";
import {
  blobVertexShader,
  blobFragmentShader,
  particleVertexShader,
  particleFragmentShader,
  bgVertexShader,
  bgFragmentShader,
} from "@/lib/shaders";

// ─── Shared mouse state ───────────────────────────────────────────────────────
const globalMouse = { x: 0, y: 0 };
if (typeof window !== "undefined") {
  window.addEventListener("mousemove", (e) => {
    globalMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    globalMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  });
}

// ─── Background mesh gradient ─────────────────────────────────────────────────
function BackgroundMesh() {
  const matRef = useRef<THREE.ShaderMaterial>(null!);
  const lerpX = useRef(0);
  const lerpY = useRef(0);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
    }),
    []
  );

  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.getElapsedTime();
    lerpX.current += (globalMouse.x - lerpX.current) * 0.04;
    lerpY.current += (globalMouse.y - lerpY.current) * 0.04;
    uniforms.uMouse.value.set(lerpX.current, lerpY.current);
  });

  return (
    <mesh position={[0, 0, -5]}>
      <planeGeometry args={[30, 20]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={bgVertexShader}
        fragmentShader={bgFragmentShader}
        uniforms={uniforms}
        depthWrite={false}
      />
    </mesh>
  );
}

// ─── Liquid blob ──────────────────────────────────────────────────────────────
function LiquidBlob({
  position,
  scale,
  colorA,
  colorB,
  timeOffset = 0,
}: {
  position: [number, number, number];
  scale: number;
  colorA: THREE.Color;
  colorB: THREE.Color;
  timeOffset?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const lerpX = useRef(0);
  const lerpY = useRef(0);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uColorA: { value: colorA },
      uColorB: { value: colorB },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() + timeOffset;
    uniforms.uTime.value = t;
    lerpX.current += (globalMouse.x - lerpX.current) * 0.05;
    lerpY.current += (globalMouse.y - lerpY.current) * 0.05;
    uniforms.uMouse.value.set(lerpX.current, lerpY.current);

    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(t * 0.15) * 0.2;
      meshRef.current.rotation.y = t * 0.1;
      meshRef.current.rotation.z = Math.cos(t * 0.12) * 0.15;
    }
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <icosahedronGeometry args={[1, 64]} />
      <shaderMaterial
        vertexShader={blobVertexShader}
        fragmentShader={blobFragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

// ─── Particles ────────────────────────────────────────────────────────────────
function Particles({ count = 2000 }: { count?: number }) {
  const matRef = useRef<THREE.ShaderMaterial>(null!);

  const { geometry } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const speeds = new Float32Array(count);
    const offsets = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
      sizes[i] = Math.random() * 3 + 1;
      speeds[i] = Math.random() * 0.3 + 0.1;
      offsets[i] = Math.random();
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute("aSpeed", new THREE.BufferAttribute(speeds, 1));
    geo.setAttribute("aOffset", new THREE.BufferAttribute(offsets, 1));
    return { geometry: geo };
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color("#f97316") },
      uColorB: { value: new THREE.Color("#facc15") },
    }),
    []
  );

  useFrame(({ clock }) => {
    if (matRef.current) matRef.current.uniforms.uTime.value = clock.getElapsedTime();
  });

  return (
    <points geometry={geometry}>
      <shaderMaterial
        ref={matRef}
        vertexShader={particleVertexShader}
        fragmentShader={particleFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ─── Scene root ───────────────────────────────────────────────────────────────
function Scene({ mobile }: { mobile: boolean }) {
  const orange = useMemo(() => new THREE.Color("#f97316"), []);
  const yellow = useMemo(() => new THREE.Color("#facc15"), []);
  const deep   = useMemo(() => new THREE.Color("#ea580c"), []);

  return (
    <>
      <BackgroundMesh />
      <LiquidBlob position={[-3.5, 1.2, -3]}  scale={1.5} colorA={orange} colorB={yellow} timeOffset={0} />
      <LiquidBlob position={[3.5, -0.8, -4]}  scale={1.2} colorA={yellow} colorB={deep}   timeOffset={3} />
      <LiquidBlob position={[0.5, -2.5, -5]}  scale={1.0} colorA={deep}   colorB={orange} timeOffset={6} />
      <Particles count={mobile ? 300 : 800} />
    </>
  );
}

// ─── Exported canvas ──────────────────────────────────────────────────────────
export default function WebGLBackground() {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={[1, 1.5]} /* Capped at 1.5 to prevent high-DPI displays from choking the GPU */
        gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }} /* Disabled antialias for speed */
        style={{ background: "#0a0804" }}
      >
        <PerformanceMonitor onDecline={() => {}} />
        <Scene mobile={isMobile} />
      </Canvas>
      
      {/* Dark Vignette / Dimming Overlay to ensure text pops */}
      <div 
        style={{ 
          position: "absolute", 
          inset: 0, 
          background: "linear-gradient(to bottom, rgba(10,8,4,0.6) 0%, rgba(10,8,4,0.85) 100%)",
          pointerEvents: "none"
        }} 
      />
    </div>
  );
}
