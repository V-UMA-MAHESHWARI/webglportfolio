"use client";

import React from "react";
import Link from "next/link";

export default function ResumePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0a0804", // strict dark matching root layout
        color: "#fef9f0",
        padding: "40px",
        position: "relative",
      }}
    >
      {/* Background grain noise matching the main site */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          opacity: 0.35,
          background: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
          mixBlendMode: "overlay",
          zIndex: 0,
        }}
      />
      
      {/* Top Left Navigation back to home */}
      <Link
        href="/"
        style={{
          position: "absolute",
          top: "40px",
          left: "6vw",
          fontFamily: "'Space Mono', monospace",
          fontSize: "12px",
          color: "#f97316",
          textDecoration: "none",
          letterSpacing: "0.1em",
          borderBottom: "1px solid rgba(249,115,22,0.4)",
          paddingBottom: "4px",
          transition: "all 0.3s ease",
          zIndex: 10,
        }}
      >
        ← Back to Portfolio
      </Link>

      <div style={{ position: "relative", zIndex: 10, maxWidth: "800px", width: "100%", textAlign: "center" }}>
        <h1
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(60px, 10vw, 120px)",
            letterSpacing: "0.05em",
            marginBottom: "16px",
            background: "linear-gradient(135deg, #fef9f0 0%, #facc15 50%, #f97316 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            lineHeight: 1,
          }}
        >
          Resume
        </h1>
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "18px",
            color: "rgba(254,249,240,0.6)",
            marginBottom: "48px",
          }}
        >
          My full professional history, skills, and qualifications.
        </p>

        <div style={{ display: "flex", gap: "24px", justifyContent: "center", flexWrap: "wrap" }}>
          <a
            href="/resume.pdf"
            download
            className="mag-btn"
            style={{
              padding: "20px 48px",
              borderRadius: "999px",
              background: "rgba(249,115,22,0.1)",
              border: "1px solid rgba(249,115,22,0.4)",
              color: "#f97316",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 700,
              fontSize: "16px",
              textDecoration: "none",
              display: "inline-block",
              transition: "all 0.4s ease",
              boxShadow: "0 0 24px rgba(249,115,22,0.15)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(249,115,22,0.2)";
              e.currentTarget.style.boxShadow = "0 0 42px rgba(249,115,22,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(249,115,22,0.1)";
              e.currentTarget.style.boxShadow = "0 0 24px rgba(249,115,22,0.15)";
            }}
          >
            Download PDF ↓
          </a>
        </div>
        
        {/* Glitch-Free PDF Access */}
        <div 
          style={{ 
            marginTop: "64px", 
            width: "100%", 
            height: "40vh",
            minHeight: "300px", 
            background: "rgba(254,249,240,0.03)", 
            borderRadius: "16px", 
            border: "1px solid rgba(254,249,240,0.1)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            gap: "24px"
          }}
        >
          <div style={{ fontSize: "48px", opacity: 0.6 }}>📄</div>
          <p style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(254,249,240,0.6)", fontSize: "16px" }}>
            PDF preview disabled to maintain site performance.
          </p>
          <a 
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "14px 32px",
              borderRadius: "999px",
              border: "1px solid rgba(254,249,240,0.2)",
              color: "#fef9f0",
              fontFamily: "'Space Mono', monospace",
              fontSize: "14px",
              textDecoration: "none",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(254,249,240,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            Open in New Tab ↗
          </a>
        </div>

      </div>
    </main>
  );
}
