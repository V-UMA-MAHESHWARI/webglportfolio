"use client";

import { PROJECTS } from "@/lib/constants";

interface ProjectCardProps {
  project: (typeof PROJECTS)[0];
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <div
      style={{
        position: "relative",
        background: "rgba(254,249,240,0.03)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1px solid rgba(249,115,22,0.18)",
        borderRadius: "24px",
        padding: "40px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        overflow: "hidden",
        transition: "all 0.4s cubic-bezier(0.23, 1, 0.32, 1)",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.border = "1px solid rgba(249,115,22,0.55)";
        el.style.boxShadow =
          "0 8px 60px rgba(249,115,22,0.2), 0 0 120px rgba(250,204,21,0.08)";
        el.style.transform = "translateY(-6px)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.border = "1px solid rgba(249,115,22,0.18)";
        el.style.boxShadow = "none";
        el.style.transform = "translateY(0)";
      }}
    >
      {/* Ambient glow top-right */}
      <div
        style={{
          position: "absolute",
          top: "-60px",
          right: "-60px",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(249,115,22,0.18) 0%, transparent 70%)`,
          filter: "blur(30px)",
          pointerEvents: "none",
        }}
      />

      {/* Index label */}
      <span
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: "11px",
          color: "#f97316",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
        }}
      >
        {String(index + 1).padStart(2, "0")} / Featured Project
      </span>

      {/* Title */}
      <h3
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "clamp(36px, 4vw, 56px)",
          color: "#fef9f0",
          letterSpacing: "0.03em",
          lineHeight: 1,
          margin: 0,
        }}
      >
        {project.title}
      </h3>

      {/* Description */}
      <p
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "16px",
          color: "rgba(254,249,240,0.65)",
          lineHeight: 1.7,
          margin: 0,
          maxWidth: "480px",
        }}
      >
        {project.description}
      </p>

      {/* Tech pills */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {project.tech.map((t) => (
          <span
            key={t}
            style={{
              padding: "5px 14px",
              borderRadius: "999px",
              border: "1px solid rgba(249,115,22,0.3)",
              fontSize: "12px",
              fontFamily: "'Space Mono', monospace",
              color: "#facc15",
              background: "rgba(249,115,22,0.08)",
              letterSpacing: "0.05em",
            }}
          >
            {t}
          </span>
        ))}
      </div>

      {/* Links */}
      <div style={{ display: "flex", gap: "16px", marginTop: "8px" }}>
        <a
          href={project.live}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 24px",
            borderRadius: "999px",
            background: "linear-gradient(135deg, #f97316, #facc15)",
            color: "#0a0804",
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 700,
            fontSize: "14px",
            textDecoration: "none",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.boxShadow =
              "0 0 30px rgba(249,115,22,0.5)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.boxShadow = "none")
          }
        >
          Live ↗
        </a>
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 24px",
            borderRadius: "999px",
            border: "1px solid rgba(254,249,240,0.2)",
            color: "#fef9f0",
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 500,
            fontSize: "14px",
            textDecoration: "none",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.background =
              "rgba(254,249,240,0.06)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.background =
              "transparent")
          }
        >
          GitHub →
        </a>
      </div>
    </div>
  );
}
