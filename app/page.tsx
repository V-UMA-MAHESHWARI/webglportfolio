"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { PROJECTS } from "@/lib/constants";
import ProjectCard from "@/components/ProjectCard";
import TimelineRibbon from "@/components/TimelineRibbon";

// Dynamic imports — Three.js is client-only
const WebGLBackground = dynamic(() => import("@/components/WebGLBackground"), {
  ssr: false,
});
const CustomCursor = dynamic(() => import("@/components/CustomCursor"), {
  ssr: false,
});
const FloatingObject = dynamic(() => import("@/components/FloatingObject"), {
  ssr: false,
});
const SkillOrbit = dynamic(() => import("@/components/SkillOrbit"), {
  ssr: false,
});

// ─── Intersection Observer hook ───────────────────────────────────────────────
function useInView(ref: React.RefObject<Element | null>, threshold = 0.15) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return inView;
}

// ─── Magnetic button hook ─────────────────────────────────────────────────────
function useMagnetic(strength = 0.4) {
  const ref = useRef<HTMLAnchorElement>(null!);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
      } else {
        el.style.transform = "translate(0,0)";
      }
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [strength]);
  return ref;
}

// ─── Word-by-word reveal ──────────────────────────────────────────────────────
function WordReveal({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null!);
  const inView = useInView(ref, 0.2);
  const words = text.split(" ");

  return (
    <p ref={ref} style={{ overflow: "hidden" }} className={className}>
      {words.map((word, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            marginRight: "0.28em",
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(30px)",
            transition: `opacity 0.6s ease ${i * 0.06}s, transform 0.6s cubic-bezier(0.23,1,0.32,1) ${i * 0.06}s`,
          }}
        >
          {word}
        </span>
      ))}
    </p>
  );
}

// ─── Section fade wrapper ─────────────────────────────────────────────────────
function FadeUp({
  children,
  delay = 0,
  className = "",
  style = {},
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null!);
  const inView = useInView(ref, 0.1);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(50px)",
        transition: `opacity 0.9s cubic-bezier(0.23,1,0.32,1) ${delay}s, transform 0.9s cubic-bezier(0.23,1,0.32,1) ${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── Gradient separator ───────────────────────────────────────────────────────
function GradientLine() {
  return (
    <div
      style={{
        height: "1px",
        background:
          "linear-gradient(90deg, transparent, #f97316, #facc15, transparent)",
        opacity: 0.3,
        margin: "0 6vw",
      }}
    />
  );
}

// ─── Social link ──────────────────────────────────────────────────────────────
function SocialLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: "12px",
        color: "rgba(254,249,240,0.5)",
        textDecoration: "none",
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        transition: "color 0.3s ease",
        padding: "6px 0",
        display: "inline-block",
      }}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLElement).style.color = "#f97316")
      }
      onMouseLeave={(e) =>
      ((e.currentTarget as HTMLElement).style.color =
        "rgba(254,249,240,0.5)")
      }
    >
      {label}
    </a>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ══════════════════════════════════════════════════════════════════════════════
export default function Home() {
  const magnetRef = useMagnetic(0.45);
  const [lenis, setLenis] = useState<unknown>(null);

  // ── Lenis smooth scroll setup ──────────────────────────────────────────────
  useEffect(() => {
    let lenisInstance: { raf: (t: number) => void; destroy: () => void } | null = null;
    let rafId: number;

    import("lenis").then(({ default: Lenis }) => {
      lenisInstance = new Lenis({
        duration: 1.3,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      }) as { raf: (t: number) => void; destroy: () => void };

      setLenis(lenisInstance);

      const raf = (time: number) => {
        lenisInstance?.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);
    });

    return () => {
      cancelAnimationFrame(rafId);
      lenisInstance?.destroy();
    };
  }, []);

  return (
    <>
      {/* ── Fixed WebGL canvas background ────────────────────────────────── */}
      <WebGLBackground />

      {/* ── Custom cursor ─────────────────────────────────────────────────── */}
      <CustomCursor />

      {/* ── Main scroll container ─────────────────────────────────────────── */}
      <main style={{ position: "relative", zIndex: 10 }}>

        {/* ════════════════════════════════════════════════════════════════
            ACT 1 — HERO
        ════════════════════════════════════════════════════════════════ */}
        <section
          id="hero"
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 6vw",
            position: "relative",
          }}
        >
          {/* Act label */}
          <div
            style={{
              position: "absolute",
              top: "40px",
              right: "6vw",
              fontFamily: "'Space Mono', monospace",
              fontSize: "11px",
              color: "rgba(249,115,22,0.6)",
              letterSpacing: "0.25em",
            }}
          >
            ACT 01 / HERO
          </div>

          {/* Big name */}
          <div style={{ overflow: "hidden" }}>
            <h1
              className="hero-name"
              style={{
                animation: "heroReveal 1.2s cubic-bezier(0.23,1,0.32,1) forwards",
                opacity: 0,
              }}
            >
              Uma<br />Maheshwari
            </h1>
          </div>

          {/* Subtitle */}
          <div
            style={{
              marginTop: "28px",
              animation: "fadeSlideUp 0.9s 0.5s cubic-bezier(0.23,1,0.32,1) forwards",
              opacity: 0,
            }}
          >
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "clamp(16px, 2vw, 22px)",
                color: "rgba(254,249,240,0.65)",
                letterSpacing: "0.05em",
                fontWeight: 300,
              }}
            >
              Developer.&nbsp;&nbsp;Creator.&nbsp;&nbsp;Architect of experiences.
            </p>
          </div>

          {/* CTA buttons */}
          <div
            style={{
              display: "flex",
              gap: "16px",
              marginTop: "48px",
              flexWrap: "wrap",
              animation: "fadeSlideUp 0.9s 0.8s cubic-bezier(0.23,1,0.32,1) forwards",
              opacity: 0,
            }}
          >
            <a
              href="#projects"
              className="mag-btn"
              style={{ textDecoration: "none" }}
              onClick={(e) => {
                e.preventDefault();
                document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              View Work ↓
            </a>
            <a
              href="#contact"
              style={{
                display: "inline-block",
                padding: "22px 48px",
                borderRadius: "999px",
                border: "1px solid rgba(254,249,240,0.18)",
                color: "#fef9f0",
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 500,
                fontSize: "16px",
                textDecoration: "none",
                transition: "all 0.3s ease",
                backdropFilter: "blur(8px)",
              }}
              onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.background =
                "rgba(254,249,240,0.06)")
              }
              onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.background =
                "transparent")
              }
              onClick={(e) => {
                e.preventDefault();
                document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Let's Talk →
            </a>
            <a
              href="/resume"
              style={{
                display: "inline-block",
                padding: "22px 48px",
                borderRadius: "999px",
                border: "1px solid rgba(249,115,22,0.4)",
                color: "#f97316",
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 500,
                fontSize: "16px",
                textDecoration: "none",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "rgba(249,115,22,0.1)";
                el.style.boxShadow = "0 0 24px rgba(249,115,22,0.2)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "transparent";
                el.style.boxShadow = "none";
              }}
            >
              Resume ↗
            </a>
          </div>

          {/* Scroll arrow */}
          <div
            style={{
              position: "absolute",
              bottom: "48px",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
              animation: "fadeSlideUp 0.9s 1.2s cubic-bezier(0.23,1,0.32,1) forwards",
              opacity: 0,
            }}
          >
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "10px",
                color: "rgba(249,115,22,0.6)",
                letterSpacing: "0.2em",
              }}
            >
              SCROLL
            </span>
            <div className="scroll-arrow" style={{ fontSize: "20px", color: "#f97316" }}>
              ↓
            </div>
          </div>
        </section>

        <GradientLine />

        {/* ════════════════════════════════════════════════════════════════
            ACT 2 — WHO I AM
        ════════════════════════════════════════════════════════════════ */}
        <section
          id="about"
          style={{
            minHeight: "100vh",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            alignItems: "center",
            padding: "120px 6vw",
            gap: "60px",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "16px",
              right: "6vw",
              fontFamily: "'Space Mono', monospace",
              fontSize: "11px",
              color: "rgba(249,115,22,0.6)",
              letterSpacing: "0.25em",
            }}
          >
            ACT 02 / WHO I AM
          </div>

          {/* 3D Object – left */}
          <FadeUp delay={0}>
            <FloatingObject />
          </FadeUp>

          {/* Bio text – right */}
          <div>
            <FadeUp delay={0.1}>
              <span
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "11px",
                  color: "#f97316",
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  display: "block",
                  marginBottom: "24px",
                }}
              >
                About
              </span>
            </FadeUp>

            <FadeUp delay={0.2}>
              <h2
                className="font-display text-gradient"
                style={{
                  fontSize: "clamp(48px, 6vw, 80px)",
                  lineHeight: 1,
                  letterSpacing: "0.03em",
                  marginBottom: "32px",
                }}
              >
                I build classy, animated web experiences that shouldn't work, but somehow do.
              </h2>
            </FadeUp>

            <WordReveal
              text="I'm a developer obsessed with the intersection of code and sensory experience. Three.js at midnight, Python by day, and a constant obsession with making pixels feel physical."
              className="font-body"
            />

            <FadeUp delay={0.5}>
              <div
                style={{
                  marginTop: "40px",
                  paddingTop: "24px",
                  borderTop: "1px solid rgba(249,115,22,0.2)",
                  display: "flex",
                  gap: "40px",
                  flexWrap: "wrap",
                }}
              >
                {[
                  { label: "Years Coding", value: "2+" },
                  { label: "Projects Shipped", value: "5+" },
                  { label: "3D Experiences", value: "2" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div
                      className="text-gradient font-display"
                      style={{ fontSize: "48px", lineHeight: 1 }}
                    >
                      {stat.value}
                    </div>
                    <div
                      style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: "11px",
                        color: "rgba(254,249,240,0.45)",
                        letterSpacing: "0.1em",
                        marginTop: "6px",
                      }}
                    >
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>

          {/* Mobile: stack vertically */}
          <style>{`
            @media (max-width: 768px) {
              #about { grid-template-columns: 1fr !important; }
            }
          `}</style>
        </section>

        <GradientLine />

        {/* ════════════════════════════════════════════════════════════════
            ACT 3 — SKILLS
        ════════════════════════════════════════════════════════════════ */}
        <section
          id="skills"
          style={{
            minHeight: "100vh",
            padding: "120px 6vw",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "16px",
              right: "6vw",
              fontFamily: "'Space Mono', monospace",
              fontSize: "11px",
              color: "rgba(249,115,22,0.6)",
              letterSpacing: "0.25em",
            }}
          >
            ACT 03 / SKILLS
          </div>

          <FadeUp delay={0}>
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "11px",
                color: "#f97316",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                display: "block",
                marginBottom: "16px",
                textAlign: "center",
              }}
            >
              Capabilities
            </span>
            <h2
              className="font-display"
              style={{
                fontSize: "clamp(56px, 8vw, 110px)",
                color: "#fef9f0",
                letterSpacing: "0.05em",
                textAlign: "center",
                lineHeight: 1,
                marginBottom: "16px",
              }}
            >
              The{" "}
              <span className="text-gradient">Toolbox</span>
            </h2>
            <p
              style={{
                textAlign: "center",
                color: "rgba(254,249,240,0.45)",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "16px",
                marginBottom: "0",
              }}
            >
              Hover to inspect. Orbit to explore.
            </p>
          </FadeUp>

          {/* 3D orbit canvas */}
          <SkillOrbit />
        </section>

        <GradientLine />

        {/* ════════════════════════════════════════════════════════════════
            ACT 4 — PROJECTS
        ════════════════════════════════════════════════════════════════ */}
        <section
          id="projects"
          style={{
            minHeight: "100vh",
            padding: "120px 6vw",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "16px",
              right: "6vw",
              fontFamily: "'Space Mono', monospace",
              fontSize: "11px",
              color: "rgba(249,115,22,0.6)",
              letterSpacing: "0.25em",
            }}
          >
            ACT 04 / PROJECTS
          </div>

          <FadeUp delay={0} style={{ marginBottom: "64px" }}>
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "11px",
                color: "#f97316",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                display: "block",
                marginBottom: "16px",
              }}
            >
              Selected Work
            </span>
            <h2
              className="font-display"
              style={{
                fontSize: "clamp(56px, 8vw, 110px)",
                color: "#fef9f0",
                letterSpacing: "0.05em",
                lineHeight: 1,
              }}
            >
              Featured{" "}
              <span className="text-gradient">Projects</span>
            </h2>
          </FadeUp>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "32px",
              maxWidth: "860px",
            }}
          >
            {PROJECTS.map((project, i) => (
              <FadeUp key={project.id} delay={i * 0.15}>
                <ProjectCard project={project} index={i} />
              </FadeUp>
            ))}
          </div>
        </section>

        <GradientLine />

        {/* ════════════════════════════════════════════════════════════════
            ACT 5 — PROCESS / TIMELINE
        ════════════════════════════════════════════════════════════════ */}
        <TimelineRibbon progress={0.7} />

        <GradientLine />

        {/* ════════════════════════════════════════════════════════════════
            ACT 6 — CONTACT
        ════════════════════════════════════════════════════════════════ */}
        <section
          id="contact"
          style={{
            minHeight: "100vh",
            padding: "120px 6vw 80px",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "16px",
              right: "6vw",
              fontFamily: "'Space Mono', monospace",
              fontSize: "11px",
              color: "rgba(249,115,22,0.6)",
              letterSpacing: "0.25em",
            }}
          >
            ACT 06 / CONTACT
          </div>

          {/* Ambient glow */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
              width: "600px",
              height: "600px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)",
              filter: "blur(60px)",
              pointerEvents: "none",
            }}
          />

          <FadeUp delay={0}>
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "11px",
                color: "#f97316",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                display: "block",
                marginBottom: "24px",
              }}
            >
              Ready when you are
            </span>
          </FadeUp>

          <FadeUp delay={0.1}>
            <h2
              className="font-display"
              style={{
                fontSize: "clamp(80px, 14vw, 180px)",
                lineHeight: 0.9,
                letterSpacing: "0.02em",
                background:
                  "linear-gradient(135deg, #fef9f0 0%, #facc15 50%, #f97316 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                marginBottom: "60px",
              }}
            >
              Let's<br />Build.
            </h2>
          </FadeUp>

          <FadeUp delay={0.25}>
            <a
              ref={magnetRef}
              href="mailto:we.unite.at.here@gmail.com"
              className="mag-btn"
              style={{
                display: "inline-block",
                transition: "all 0.4s cubic-bezier(0.23,1,0.32,1)",
              }}
            >
              Start a Conversation →
            </a>
          </FadeUp>

          {/* Social links */}
          <FadeUp delay={0.4}>
            <div
              style={{
                display: "flex",
                gap: "40px",
                marginTop: "60px",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <SocialLink href="https://mail.google.com/mail/?view=cm&fs=1&to=we.unite.at.here@gmail.com" label="Gmail" />
              <SocialLink href="https://github.com/V-UMA-MAHESHWARI" label="GitHub" />
              <SocialLink href="https://www.linkedin.com/in/uma-maheshwari-v/" label="LinkedIn" />
            </div>
          </FadeUp>

          {/* Footer */}
          <FadeUp delay={0.55}>
            <div
              style={{
                marginTop: "80px",
                paddingTop: "32px",
                borderTop: "1px solid rgba(249,115,22,0.15)",
                width: "100%",
                maxWidth: "600px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              <span
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "11px",
                  color: "rgba(254,249,240,0.3)",
                  letterSpacing: "0.1em",
                }}
              >
                © 2025 Uma Maheshwari
              </span>
              <span
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "11px",
                  color: "rgba(254,249,240,0.3)",
                  letterSpacing: "0.1em",
                }}
              >
                Built with Next.js + Three.js
              </span>
            </div>
          </FadeUp>
        </section>
      </main>

      {/* ── Global keyframes ──────────────────────────────────────────────── */}
      <style>{`
        @keyframes heroReveal {
          from {
            opacity: 0;
            transform: translateY(60px) skewY(2deg);
            filter: blur(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0) skewY(0deg);
            filter: blur(0);
          }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}