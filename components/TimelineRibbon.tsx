"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { ribbonVertexShader, ribbonFragmentShader } from "@/lib/shaders";
import { TIMELINE } from "@/lib/constants";

function RibbonPath({ progress }: { progress: number }) {
  const matRef = useRef<THREE.ShaderMaterial>(null!);

  const geometry = useMemo(() => {
    const count = 300;
    const positions = new Float32Array(count * 3);
    const ts = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const t = i / (count - 1);
      positions[i * 3 + 0] = (t - 0.5) * 14;
      positions[i * 3 + 1] = Math.sin(t * Math.PI * 2.5) * 0.7;
      positions[i * 3 + 2] = Math.cos(t * Math.PI * 1.8) * 0.4;
      ts[i] = t;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aT", new THREE.BufferAttribute(ts, 1));
    return geo;
  }, []);

  const uniforms = useMemo(
    () => ({
      uProgress: { value: progress },
      uColorA: { value: new THREE.Color("#f97316") },
      uColorB: { value: new THREE.Color("#facc15") },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useFrame(() => {
    if (matRef.current) {
      matRef.current.uniforms.uProgress.value = progress;
    }
  });

  return (
    <points geometry={geometry}>
      <shaderMaterial
        ref={matRef}
        vertexShader={ribbonVertexShader}
        fragmentShader={ribbonFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function TimelineRibbon({ progress = 0.7 }: { progress?: number }) {
  return (
    <section
      id="process"
      style={{ position: "relative", padding: "120px 0 80px", overflow: "hidden" }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "48px", position: "relative", zIndex: 10 }}>
        <span
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "11px",
            color: "#f97316",
            letterSpacing: "0.3em",
            textTransform: "uppercase" as const,
          }}
        >
          ACT 05
        </span>
        <h2
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(56px, 8vw, 100px)",
            color: "#fef9f0",
            letterSpacing: "0.05em",
            margin: "12px 0 0",
            lineHeight: 1,
          }}
        >
          The Journey
        </h2>

        {/* act label top-right */}
        <span
          style={{
            position: "absolute",
            top: 0,
            right: "6vw",
            fontFamily: "'Space Mono', monospace",
            fontSize: "11px",
            color: "rgba(249,115,22,0.6)",
            letterSpacing: "0.25em",
          }}
        >
          ACT 05 / PROCESS
        </span>
      </div>

      {/* 3D ribbon canvas */}
      <div style={{ height: "160px", position: "relative" }}>
        <Canvas
          camera={{ position: [0, 1.5, 8], fov: 48 }}
          dpr={[1, 1.5]}
          gl={{ alpha: true, antialias: false }}
          style={{ position: "absolute", inset: 0 }}
        >
          <RibbonPath progress={progress} />
        </Canvas>
      </div>

      {/* Internships List */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          position: "relative",
          zIndex: 10,
          padding: "0 4vw",
          maxWidth: "800px",
          margin: "0 auto",
          gap: "48px",
        }}
      >
        {[
          {
            date: "Dec 2024 - Apr 2025",
            role: "Full-Stack Developer",
            company: "Karnataka Lions Cricket Academy",
            desc: "Created dynamic website with HTML, CSS, SQL, XAMPP. Managed player registration systems and handled local deployment architectures.",
          },
          {
            date: "Aug 2024 - Sep 2024",
            role: "Python Data Engineer",
            company: "EGAI SOFT",
            desc: "Optimized Python data structures for 20% faster retrieval. Improved data processing pipelines by 30% and successfully automated 5+ complex workflows.",
          },
          {
            date: "Dec 2023 - Jan 2024",
            role: "AI Product Creator",
            company: "OctaNet Services Pvt Ltd",
            desc: "Conceptualized 4 AI projects resulting in a 40% output boost. Contributed to an AI chatbot achieving 95% accuracy and developed a comprehensive AI dashboard using Flask.",
          },
          {
            date: "Jun 2023 - Jul 2023",
            role: "Database Analyst",
            company: "Bolt IoT",
            desc: "Improved database query execution time by 25%. Enhanced data accuracy metrics by 15% and maintained a 100% on-schedule delivery record.",
          },
        ].map((item, i, arr) => {
          const active = i / arr.length <= progress;
          return (
            <div
              key={item.company + item.date}
              style={{
                display: "flex",
                gap: "32px",
                alignItems: "flex-start",
                opacity: active ? 1 : 0.4,
                transform: active ? "translateY(0)" : "translateY(20px)",
                transition: "all 0.8s cubic-bezier(0.23,1,0.32,1)",
              }}
            >
              {/* Left timeline connector */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  minHeight: "100%",
                }}
              >
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    background: active
                      ? "linear-gradient(135deg,#f97316,#facc15)"
                      : "rgba(254,249,240,0.12)",
                    boxShadow: active ? "0 0 16px rgba(249,115,22,0.6)" : "none",
                    marginTop: "6px",
                    flexShrink: 0,
                    transition: "all 0.6s ease",
                  }}
                />
                {i !== arr.length - 1 && (
                  <div
                    style={{
                      width: "1px",
                      flexGrow: 1,
                      minHeight: "40px",
                      background: active
                        ? "linear-gradient(to bottom, rgba(249,115,22,0.4), rgba(249,115,22,0.05))"
                        : "rgba(254,249,240,0.05)",
                      margin: "8px 0",
                      transition: "all 0.6s ease",
                    }}
                  />
                )}
              </div>

              {/* Right content */}
              <div style={{ paddingBottom: i !== arr.length - 1 ? "24px" : "0" }}>
                <span
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "12px",
                    color: "#f97316",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    display: "block",
                    marginBottom: "8px",
                  }}
                >
                  {item.date}
                </span>
                <h3
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 700,
                    fontSize: "20px",
                    color: "#fef9f0",
                    marginBottom: "4px",
                    letterSpacing: "0.01em",
                  }}
                >
                  {item.role}
                </h3>
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 500,
                    fontSize: "14px",
                    color: "rgba(254,249,240,0.7)",
                    display: "block",
                    marginBottom: "16px",
                  }}
                >
                  @ {item.company}
                </span>
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "14px",
                    color: "rgba(254,249,240,0.5)",
                    lineHeight: 1.6,
                    maxWidth: "600px",
                  }}
                >
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
