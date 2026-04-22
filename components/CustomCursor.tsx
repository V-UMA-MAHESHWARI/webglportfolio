"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const orb = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);
  const mounted = useRef(false);

  useEffect(() => {
    // Skip on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;
    mounted.current = true;

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove);

    const loop = () => {
      orb.current.x += (mouse.current.x - orb.current.x) * 0.09;
      orb.current.y += (mouse.current.y - orb.current.y) * 0.09;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouse.current.x - 4}px, ${mouse.current.y - 4}px)`;
      }
      if (orbRef.current) {
        orbRef.current.style.transform = `translate(${orb.current.x - 20}px, ${orb.current.y - 20}px)`;
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      {/* Inner dot — sharp precision */}
      <div
        ref={dotRef}
        aria-hidden
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "#f3e097ff",
          zIndex: 9999,
          pointerEvents: "none",
          mixBlendMode: "difference",
          willChange: "transform",
        }}
      />
      {/* Outer orb — lerp follower */}
      <div
        ref={orbRef}
        aria-hidden
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 40,
          height: 40,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(249,115,22,0.30) 0%, transparent 70%)",
          border: "1px solid rgba(249,115,22,0.4)",
          zIndex: 9998,
          pointerEvents: "none",
          willChange: "transform",
        }}
      />
    </>
  );
}
