"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Wireframe } from "@react-three/drei";
import * as THREE from "three";

function FloatingIcosahedron() {
  const outerRef = useRef<THREE.Mesh>(null!);
  const innerRef = useRef<THREE.Mesh>(null!);
  const groupRef = useRef<THREE.Group>(null!);

  const matRef = useRef<THREE.ShaderMaterial>(null!);

  const vertexShader = /* glsl */ `
    uniform float uTime;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vec3 pos = position;
      pos += normal * sin(pos.x * 3.0 + uTime) * 0.06;
      pos += normal * cos(pos.y * 2.5 - uTime * 0.8) * 0.04;
      vPosition = pos;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `;

  const fragmentShader = /* glsl */ `
    uniform float uTime;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      vec3 viewDir = normalize(cameraPosition - vPosition);
      float fresnel = pow(1.0 - dot(viewDir, vNormal), 3.0);

      vec3 orange = vec3(0.976, 0.451, 0.086);
      vec3 yellow = vec3(0.980, 0.800, 0.082);

      float t = (sin(vPosition.y * 2.0 + uTime * 0.6) + 1.0) * 0.5;
      vec3 col = mix(orange, yellow, t);
      col += fresnel * yellow * 0.8;

      gl_FragColor = vec4(col, 0.6 + fresnel * 0.4);
    }
  `;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.25;
      groupRef.current.rotation.x = Math.sin(t * 0.3) * 0.2;
      groupRef.current.position.y = Math.sin(t * 0.5) * 0.2;
    }
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = t;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Outer glowing shell */}
      <mesh ref={outerRef}>
        <icosahedronGeometry args={[1.4, 4]} />
        <shaderMaterial
          ref={matRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={{ uTime: { value: 0 } }}
          transparent
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Inner wireframe */}
      <mesh ref={innerRef} scale={0.85}>
        <icosahedronGeometry args={[1.4, 1]} />
        <meshBasicMaterial
          color="#f97316"
          wireframe
          transparent
          opacity={0.25}
        />
      </mesh>

      {/* Core glow */}
      <mesh scale={0.5}>
        <sphereGeometry args={[1.4, 16, 16]} />
        <meshBasicMaterial
          color="#facc15"
          transparent
          opacity={0.12}
        />
      </mesh>
    </group>
  );
}

export default function FloatingObject() {
  return (
    <div style={{ width: "100%", height: "420px" }}>
      <Canvas
        camera={{ position: [0, 0, 4], fov: 50 }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.15} />
        <pointLight
          position={[3, 2, 2]}
          intensity={3}
          color="#f97316"
          distance={12}
        />
        <pointLight
          position={[-2, -2, 1]}
          intensity={2}
          color="#facc15"
          distance={10}
        />
        <FloatingIcosahedron />
      </Canvas>
    </div>
  );
}
