// Liquid Chrome Monogram: one fixed three.js canvas behind the HTML.
// The blob is an icosphere with simplex-noise displacement that can morph into a "J" tube.
import * as THREE from 'three';
import { RoomEnvironment } from './vendor/RoomEnvironment.js';

const root = document.documentElement;
const canvas = document.getElementById('gl');
const mobile = matchMedia('(max-width: 760px), (pointer: coarse)').matches;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const lowEnd = (navigator.deviceMemory && navigator.deviceMemory <= 2) ||
  (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) ||
  (navigator.connection && navigator.connection.saveData);
const fallback = why => { root.classList.add('no-gl'); root.dataset.gl = why; canvas.remove(); };

function hasWebGL() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; }
}

if (reduce) fallback('reduced-motion');
else if (lowEnd) fallback('low-end');
else if (!hasWebGL()) fallback('no-webgl');
else { try { init(); } catch (e) { console.warn('WebGL init failed', e); fallback('error'); } }

/* ---------- J monogram target: map sphere (lat, lon) onto a tube along a J curve ---------- */
function jCurve() {
  const pts = [];
  const line = (a, b, n) => { for (let i = 0; i < n; i++) { const k = i / n; pts.push([a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k]); } };
  const arc = (cx, cy, r, a0, a1, n) => { for (let i = 0; i < n; i++) { const a = a0 + (a1 - a0) * i / n; pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); } };
  line([-0.42, 1.0], [0.12, 1.0], 30);
  arc(0.12, 0.78, 0.22, Math.PI / 2, 0, 20);
  line([0.34, 0.78], [0.34, -0.3], 50);
  arc(-0.14, -0.3, 0.48, 0, -Math.PI, 60);
  pts.push([-0.62, -0.3]);
  // centre it
  let mx = 0, my = 0; pts.forEach(p => { mx += p[0]; my += p[1]; }); mx /= pts.length; my /= pts.length;
  const P = pts.map(p => [(p[0] - mx) * 1.15, (p[1] - my) * 1.15]);
  const L = [0]; for (let i = 1; i < P.length; i++) L.push(L[i - 1] + Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]));
  const total = L[L.length - 1];
  return t => { // t in [0,1] -> {x,y,tx,ty}
    const d = t * total; let i = 1; while (i < L.length - 1 && L[i] < d) i++;
    const k = (d - L[i - 1]) / ((L[i] - L[i - 1]) || 1);
    const x = P[i - 1][0] + (P[i][0] - P[i - 1][0]) * k, y = P[i - 1][1] + (P[i][1] - P[i - 1][1]) * k;
    let tx = P[i][0] - P[i - 1][0], ty = P[i][1] - P[i - 1][1]; const l = Math.hypot(tx, ty) || 1;
    return { x, y, tx: tx / l, ty: ty / l };
  };
}

function buildGeometry(detail) {
  const g = new THREE.IcosahedronGeometry(1, detail);
  const pos = g.attributes.position, n = pos.count;
  const tgt = new Float32Array(n * 3), tn = new Float32Array(n * 3);
  const curve = jCurve(), R = 0.21;
  for (let i = 0; i < n; i++) {
    const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    const yc = Math.max(-1, Math.min(1, y));
    const t = (1 - yc) / 2;                 // top of sphere -> start of J
    const phi = Math.atan2(z, x);           // around the tube
    const cap = Math.sqrt(Math.max(0, 1 - yc * yc)); // closes the tube ends
    const c = curve(t);
    const nx = -c.ty, ny = c.tx;            // in-plane normal
    const ox = nx * Math.cos(phi), oy = ny * Math.cos(phi), oz = Math.sin(phi);
    const r = R * Math.pow(cap, 0.35);
    tgt[i * 3] = c.x + ox * r; tgt[i * 3 + 1] = c.y + oy * r; tgt[i * 3 + 2] = oz * r;
    // cap normals lean along the curve tangent
    const e = 1 - Math.pow(cap, 0.35), s = yc > 0 ? -1 : 1;
    let mx = ox * (1 - e) + c.tx * s * e, my = oy * (1 - e) + c.ty * s * e, mz = oz * (1 - e);
    const ml = Math.hypot(mx, my, mz) || 1; tn[i * 3] = mx / ml; tn[i * 3 + 1] = my / ml; tn[i * 3 + 2] = mz / ml;
  }
  g.setAttribute('aTarget', new THREE.BufferAttribute(tgt, 3));
  g.setAttribute('aTargetN', new THREE.BufferAttribute(tn, 3));
  return g;
}

/* ---------- GLSL: 3D simplex noise (standard formulation) ---------- */
const NOISE = `
vec3 m289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 m289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 perm(vec4 x){return m289(((x*34.0)+1.0)*x);}
vec4 tis(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0); const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy)); vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz); vec3 l=1.0-g; vec3 i1=min(g.xyz,l.zxy); vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx; vec3 x2=x0-i2+C.yyy; vec3 x3=x0-D.yyy;
  i=m289(i);
  vec4 p=perm(perm(perm(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857; vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z); vec4 x_=floor(j*ns.z); vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy; vec4 y=y_*ns.x+ns.yyyy; vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy); vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0; vec4 s1=floor(b1)*2.0+1.0; vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy; vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x); vec3 p1=vec3(a0.zw,h.y); vec3 p2=vec3(a1.xy,h.z); vec3 p3=vec3(a1.zw,h.w);
  vec4 nr=tis(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3))); p0*=nr.x;p1*=nr.y;p2*=nr.z;p3*=nr.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0); m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
uniform float uTime; uniform float uMorph; uniform float uAmp; uniform float uRipple;
attribute vec3 aTarget; attribute vec3 aTargetN;
vec3 dispP(vec3 p, vec3 n, float amp){
  float d = snoise(p*1.35 + vec3(0.0, uTime*0.22, uTime*0.12))*amp
          + snoise(p*3.1 - uTime*0.18)*amp*0.28;
  d += uRipple*0.075*sin(length(p.xy)*13.0 - uTime*7.0);
  return p + n*d;
}`;

function init() {
  const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1 : 1.5);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !mobile, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(dpr);
  renderer.setSize(innerWidth, innerHeight, false);
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, innerWidth / innerHeight, 0.1, 50);
  camera.position.set(0, 0, 6);

  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const lime = new THREE.Color('#C6FF3D'), white = new THREE.Color('#ffffff');
  const mat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff, metalness: 0.55, roughness: 0.1,
    transmission: 0.35, thickness: 1.4, ior: 1.6,
    iridescence: 1, iridescenceIOR: 1.35, iridescenceThicknessRange: [180, 820],
    clearcoat: 1, clearcoatRoughness: 0.06, envMapIntensity: 1.25,
  });
  const U = { uTime: { value: 0 }, uMorph: { value: 0 }, uAmp: { value: 0.22 }, uRipple: { value: 0 } };
  mat.onBeforeCompile = sh => {
    Object.assign(sh.uniforms, U);
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\n' + NOISE)
      .replace('#include <beginnormal_vertex>', `
        vec3 bP = mix(position, aTarget, uMorph);
        vec3 bN = normalize(mix(normal, aTargetN, uMorph));
        float amp = uAmp * (1.0 - 0.8 * uMorph);
        vec3 dP = dispP(bP, bN, amp);
        vec3 tA = normalize(cross(bN, abs(bN.y) < 0.99 ? vec3(0.0,1.0,0.0) : vec3(1.0,0.0,0.0)));
        vec3 tB = normalize(cross(bN, tA));
        vec3 q1 = dispP(bP + tA*0.012, bN, amp);
        vec3 q2 = dispP(bP + tB*0.012, bN, amp);
        vec3 objectNormal = normalize(cross(q1 - dP, q2 - dP));
        if (dot(objectNormal, bN) < 0.0) objectNormal = -objectNormal;
      `)
      .replace('#include <begin_vertex>', 'vec3 transformed = dP;');
  };

  const mesh = new THREE.Mesh(buildGeometry(mobile ? 24 : 64), mat);
  scene.add(mesh);
  const key = new THREE.DirectionalLight(0xffffff, 1.6); key.position.set(3, 4, 5); scene.add(key);
  const rim = new THREE.PointLight(0xc6ff3d, 18, 12); rim.position.set(-3, -1.5, 2.5); scene.add(rim);

  // Scroll choreography state (x, y as fractions of the viewport from centre)
  const S = { x: mobile ? 0.3 : 0, y: mobile ? 0.2 : 0.02, s: mobile ? 0.5 : 1, morph: 1, tint: 0 };
  const states = [
    ['#home',     { x: mobile ? 0.3 : 0,  y: mobile ? 0.2 : 0.02, s: mobile ? 0.5 : 1, morph: 1, tint: 0 }],
    ['#toolkit',  { x: mobile ? 0.22 : 0.3, y: -0.05, s: mobile ? 0.34 : 0.42, morph: 0, tint: 0 }],
    ['#about',    { x: mobile ? 0.3 : -0.34, y: 0.18, s: mobile ? 0.3 : 0.5,  morph: 0, tint: 0.2 }],
    ['#services', { x: mobile ? 0.34 : 0.31, y: 0,    s: mobile ? 0.26 : 0.52, morph: 0, tint: 1 }],
    ['#work',     { x: mobile ? 0.36 : 0.4,  y: -0.32, s: mobile ? 0.22 : 0.34, morph: 0.15, tint: 0 }],
    ['#contact',  { x: mobile ? 0 : 0.27,   y: mobile ? -0.18 : 0.02, s: mobile ? 0.6 : 0.95, morph: 1, tint: 0.35 }],
  ];
  const gsap = window.gsap, ST = window.ScrollTrigger;
  if (gsap && ST) {
    gsap.registerPlugin(ST);
    for (let i = 1; i < states.length; i++) {
      const [sel, to] = states[i], from = states[i - 1][1];
      if (!document.querySelector(sel)) continue;
      gsap.fromTo(S, { ...from }, { ...to, ease: 'none', immediateRender: false,
        scrollTrigger: { trigger: sel, start: 'top bottom', end: i === states.length - 1 ? 'center center' : 'top 25%', scrub: 1 } });
    }
  }

  // Intro: blob forms into the monogram once the loader finishes
  const intro = { v: 0 };
  if (gsap) gsap.to(intro, { v: 1, duration: 2.2, delay: 1.0, ease: 'power3.inOut' }); else intro.v = 1;

  // Pointer tilt
  const ptr = { x: 0, y: 0 }, tilt = { x: 0, y: 0 };
  addEventListener('pointermove', e => { ptr.x = e.clientX / innerWidth * 2 - 1; ptr.y = e.clientY / innerHeight * 2 - 1; }, { passive: true });

  // Hovering a project card ripples the blob (desktop)
  if (!mobile && gsap) document.querySelectorAll('.fcard').forEach(c => {
    c.addEventListener('mouseenter', () => { gsap.to(U.uRipple, { value: 1, duration: 0.6, ease: 'power2.out' }); gsap.to(U.uAmp, { value: 0.34, duration: 0.6 }); });
    c.addEventListener('mouseleave', () => { gsap.to(U.uRipple, { value: 0, duration: 1.2, ease: 'power2.out' }); gsap.to(U.uAmp, { value: 0.22, duration: 1.2 }); });
  });

  const tmpC = new THREE.Color();
  let fy = 0, running = false, onScreen = true, last = performance.now(), t = 0;
  function frame(now) {
    if (!running) return;
    requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000); last = now; t += dt;
    U.uTime.value = t;
    U.uMorph.value = Math.min(S.morph, intro.v);
    // in services, follow the active item vertically
    const a = window.__active; let ty = 0;
    if (a) { const r = a.getBoundingClientRect(); ty = 0.5 - (r.top + r.height / 2) / innerHeight; }
    fy += (ty - fy) * 0.08;
    const visH = 2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)), visW = visH * camera.aspect;
    mesh.position.set(S.x * visW, (S.y + fy * S.tint) * visH, 0);
    mesh.scale.setScalar(S.s * Math.min(1, visW / 3.2 + 0.35));
    tilt.x += (ptr.y * 0.35 - tilt.x) * 0.06; tilt.y += (ptr.x * 0.5 - tilt.y) * 0.06;
    mesh.rotation.set(tilt.x, tilt.y + Math.sin(t * 0.35) * 0.25 * (1 - U.uMorph.value * 0.6), Math.sin(t * 0.2) * 0.05);
    tmpC.copy(white).lerp(lime, S.tint * 0.55); mat.color.copy(tmpC);
    mat.iridescenceThicknessRange[1] = 820 - S.tint * 300;
    renderer.render(scene, camera);
  }
  const start = () => { if (!running && !document.hidden && onScreen) { running = true; last = performance.now(); requestAnimationFrame(frame); } };
  const stop = () => { running = false; };
  document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
  new IntersectionObserver(es => { onScreen = es[0].isIntersecting; onScreen ? start() : stop(); }).observe(canvas);
  addEventListener('resize', () => { renderer.setSize(innerWidth, innerHeight, false); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); });
  root.classList.add('gl-on');
  start();
}
