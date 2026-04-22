"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const SKILLS = [
  { label: "React / Next.js", icon: "⚛️", category: "Frontend" },
  { label: "TypeScript", icon: "📘", category: "Frontend" },
  { label: "Three.js / R3F", icon: "🔮", category: "3D/WebGL" },
  { label: "GLSL Shaders", icon: "✨", category: "3D/WebGL" },
  { label: "Figma / Design", icon: "🎨", category: "Design" },
  { label: "Node.js", icon: "🟢", category: "Frontend" },
  { label: "WebGL", icon: "🌐", category: "3D/WebGL" },
  { label: "AI Automation", icon: "🤖", category: "AI" },
  { label: "Prompt Engineering", icon: "📝", category: "AI" },
];

// HTML cards laid out in CSS orbit — no Three.js Html needed
// Pure CSS 3D orbital animation, no WebGL needed for this section

export default function SkillOrbit() {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        minHeight: "520px",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        gap: "16px",
        padding: "48px 24px",
      }}
    >
      {SKILLS.map((skill, i) => (
        <div
          key={skill.label}
          className="skill-card"
          style={{
            background: "rgba(10,8,4,0.75)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            border: "1px solid rgba(249,115,22,0.22)",
            borderRadius: "18px",
            padding: "20px 24px",
            minWidth: "150px",
            textAlign: "center",
            cursor: "default",
            transition: "all 0.35s cubic-bezier(0.23,1,0.32,1)",
            animation: `floatCard ${3 + (i % 3)}s ${i * 0.2}s ease-in-out infinite alternate`,
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.border = "1px solid rgba(249,115,22,0.8)";
            el.style.boxShadow = "0 0 32px rgba(249,115,22,0.3), 0 0 64px rgba(250,204,21,0.12)";
            el.style.transform = "translateY(-10px) scale(1.08)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.border = "1px solid rgba(249,115,22,0.22)";
            el.style.boxShadow = "none";
            el.style.transform = "translateY(0) scale(1)";
          }}
        >
          <div style={{ fontSize: "26px", marginBottom: "8px" }}>{skill.icon}</div>
          <div
            style={{
              color: "#fef9f0",
              fontSize: "13px",
              fontWeight: 700,
              fontFamily: "'DM Sans', sans-serif",
              letterSpacing: "0.03em",
              marginBottom: "4px",
            }}
          >
            {skill.label}
          </div>
          <div
            style={{
              color: "#f97316",
              fontSize: "10px",
              fontFamily: "'Space Mono', monospace",
              letterSpacing: "0.12em",
              textTransform: "uppercase" as const,
            }}
          >
            {skill.category}
          </div>
        </div>
      ))}

      <style>{`
        @keyframes floatCard {
          from { transform: translateY(0px); }
          to   { transform: translateY(-14px); }
        }
      `}</style>
    </div>
  );
}
