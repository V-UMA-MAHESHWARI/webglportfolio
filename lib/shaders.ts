// ─── Liquid Blob Vertex Shader ───────────────────────────────────────────────
export const blobVertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec2  uMouse;
  varying vec2  vUv;
  varying vec3  vNormal;
  varying vec3  vPosition;

  // 3D Simplex noise helpers (vec3/vec4 only, no overloads)
  vec3 mod289_3(vec3 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
  vec4 mod289_4(vec4 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
  vec4 permute4(vec4 x) { return mod289_4(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt4(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289_3(i);
    vec4 p = permute4(permute4(permute4(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3  ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x4 = x_ *ns.x + ns.yyyy;
    vec4 y4 = y_ *ns.x + ns.yyyy;
    vec4 h  = 1.0 - abs(x4) - abs(y4);
    vec4 b0 = vec4(x4.xy, y4.xy);
    vec4 b1 = vec4(x4.zw, y4.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt4(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }

  void main() {
    vUv     = uv;
    vNormal = normal;
    vec3 pos = position;

    float mx = uMouse.x * 0.4;
    float my = uMouse.y * 0.4;
    float n  = snoise(vec3(pos.x * 0.8 + mx, pos.y * 0.8 + my, uTime * 0.25));
    float n2 = snoise(vec3(pos.x * 1.4,      pos.y * 1.4,      uTime * 0.18 + 5.0));

    pos       += normal * (n * 0.55 + n2 * 0.25);
    vPosition  = pos;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

// ─── Liquid Blob Fragment Shader ─────────────────────────────────────────────
export const blobFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec3  uColorA;
  uniform vec3  uColorB;
  varying vec2  vUv;
  varying vec3  vNormal;
  varying vec3  vPosition;

  void main() {
    vec3 viewDir = normalize(cameraPosition - vPosition);
    float fresnel = pow(1.0 - abs(dot(viewDir, normalize(vNormal))), 2.5);

    float t = sin(vPosition.x * 1.2 + uTime * 0.4) * 0.5 + 0.5;
    t += sin(vPosition.y * 0.9 - uTime * 0.3) * 0.3;
    t = clamp(t, 0.0, 1.0);

    vec3 col = mix(uColorA, uColorB, t);
    col += fresnel * uColorB * 0.6;
    col = pow(col, vec3(0.85));

    gl_FragColor = vec4(col, 0.35 + fresnel * 0.15);
  }
`;

// ─── Particle Vertex Shader ───────────────────────────────────────────────────
export const particleVertexShader = /* glsl */ `
  attribute float aSize;
  attribute float aSpeed;
  attribute float aOffset;
  uniform  float  uTime;
  varying  float  vAlpha;

  void main() {
    vec3  pos = position;
    float t   = mod(uTime * aSpeed + aOffset, 1.0);
    pos.y    += t * 8.0 - 4.0;
    pos.x    += sin(t * 6.2832 + aOffset) * 0.5;
    pos.z    += cos(t * 6.2832 + aOffset * 1.3) * 0.5;

    vAlpha = sin(t * 3.14159) * 0.85;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize    = aSize * (300.0 / -mvPosition.z);
    gl_Position     = projectionMatrix * mvPosition;
  }
`;

// ─── Particle Fragment Shader ─────────────────────────────────────────────────
export const particleFragmentShader = /* glsl */ `
  uniform vec3  uColorA;
  uniform vec3  uColorB;
  varying float vAlpha;

  void main() {
    vec2  uv   = gl_PointCoord - vec2(0.5);
    float dist = length(uv);
    if (dist > 0.5) discard;
    float alpha = (1.0 - dist * 2.0) * vAlpha;
    vec3  col   = mix(uColorA, uColorB, gl_PointCoord.x);
    gl_FragColor = vec4(col, alpha);
  }
`;

// ─── Background Mesh Gradient Vertex ─────────────────────────────────────────
export const bgVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// ─── Background Mesh Gradient Fragment ───────────────────────────────────────
// Uses uniquely named helpers to avoid overload ambiguity on all GLSL ES drivers
export const bgFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec2  uMouse;
  varying vec2  vUv;

  vec2 m289v2(vec2 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
  vec3 m289v3(vec3 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
  vec3 perm3(vec3 x)  { return m289v3(((x * 34.0) + 10.0) * x); }

  float snoise2(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1  = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy  -= i1;
    i = m289v2(i);
    vec3 p = perm3(perm3(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m  = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m * m; m = m * m;
    vec3 x2 = 2.0 * fract(p * C.www) - 1.0;
    vec3 h  = abs(x2) - 0.5;
    vec3 ox = floor(x2 + 0.5);
    vec3 a0 = x2 - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 gv;
    gv.x  = a0.x  * x0.x   + h.x  * x0.y;
    gv.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, gv);
  }

  void main() {
    vec2 mouse = uMouse * 0.22;
    float n  = snoise2(vUv * 2.5 + mouse        + uTime * 0.06) * 0.5 + 0.5;
    float n2 = snoise2(vUv * 4.2 - mouse * 0.5  + uTime * 0.04) * 0.5 + 0.5;

    vec3 bg    = vec3(0.039, 0.031, 0.016);  // #0a0804 warm dark
    vec3 glow1 = vec3(0.976, 0.451, 0.086);  // orange
    vec3 glow2 = vec3(0.980, 0.800, 0.082);  // yellow

    // Keep base dark — only subtle warmth bleeds through
    vec3 col = bg;
    col = mix(col, glow1, n  * 0.035);
    col = mix(col, glow2, n2 * 0.02);

    gl_FragColor = vec4(col, 1.0);
  }
`;

// ─── Ribbon / Timeline Vertex ─────────────────────────────────────────────────
export const ribbonVertexShader = /* glsl */ `
  attribute float aT;
  uniform  float  uProgress;
  varying  float  vT;
  varying  float  vAlpha;

  void main() {
    vT     = aT;
    // Smooth ramp: fully opaque at head, fades behind
    vAlpha = smoothstep(0.0, 0.6, uProgress - aT + 0.1) *
             (1.0 - smoothstep(uProgress - 0.02, uProgress + 0.0, aT));
    vAlpha = clamp(step(aT, uProgress) * 0.9, 0.0, 1.0);

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize    = 3.0 * (200.0 / -mvPosition.z);
    gl_Position     = projectionMatrix * mvPosition;
  }
`;

export const ribbonFragmentShader = /* glsl */ `
  uniform vec3  uColorA;
  uniform vec3  uColorB;
  varying float vT;
  varying float vAlpha;

  void main() {
    vec2  uv   = gl_PointCoord - 0.5;
    float d    = length(uv);
    if (d > 0.5) discard;
    float soft = 1.0 - d * 2.0;
    vec3  col  = mix(uColorA, uColorB, vT);
    gl_FragColor = vec4(col, soft * vAlpha);
  }
`;
