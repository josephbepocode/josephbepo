// Liquid Chrome Monogram: one fixed three.js canvas behind the HTML.
// The blob is an icosphere with simplex-noise displacement that can morph into a "J" tube.
import * as THREE from 'three';

const root = document.documentElement;
const canvas = document.getElementById('gl');
const mobile = matchMedia('(max-width: 767px)').matches;
const still = new URLSearchParams(location.search).has('still'); // used once to render the static fallback image
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const lowEnd = (navigator.deviceMemory && navigator.deviceMemory <= 2) ||
  (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) ||
  (navigator.connection && navigator.connection.saveData);
const fallback = why => { root.classList.add('no-gl'); root.dataset.gl = why; canvas.remove(); };

const forceGL = new URLSearchParams(location.search).has('forcegl'); // screenshots/video on GPU-less machines
// 'ok', 'none', or 'software' (no GPU: SwiftShader / llvmpipe would make every frame a long main-thread task)
function glSupport() {
  try {
    const c = document.createElement('canvas'), gl = c.getContext('webgl2') || c.getContext('webgl');
    if (!gl) return 'none';
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const r = ext ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : '';
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /swiftshader|llvmpipe|software|basic render/i.test(r) ? 'software' : 'ok';
  } catch (e) { return 'none'; }
}

/* ---------- J monogram target: map sphere (lat, lon) onto a tube along a J curve ---------- */
function jCurve() {
  // Smooth J: short top bar, generous rounded shoulder, straight stem, round hook. Densely sampled.
  const pts = [];
  const line = (a, b, n) => { for (let i = 0; i < n; i++) { const k = i / n; pts.push([a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k]); } };
  const arc = (cx, cy, r, a0, a1, n) => { for (let i = 0; i < n; i++) { const a = a0 + (a1 - a0) * i / n; pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); } };
  line([-0.36, 1.0], [0.04, 1.0], 120);
  arc(0.04, 0.7, 0.3, Math.PI / 2, 0, 160);
  line([0.34, 0.7], [0.34, -0.3], 260);
  arc(-0.14, -0.3, 0.48, 0, -Math.PI * 0.98, 420);
  // light smoothing pass to remove tangent kinks at the joins
  for (let pass = 0; pass < 6; pass++) for (let i = 1; i < pts.length - 1; i++) {
    pts[i] = [(pts[i - 1][0] + 2 * pts[i][0] + pts[i + 1][0]) / 4, (pts[i - 1][1] + 2 * pts[i][1] + pts[i + 1][1]) / 4];
  }
  let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9; pts.forEach(p => { x0 = Math.min(x0, p[0]); x1 = Math.max(x1, p[0]); y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]); });
  const mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
  const P = pts.map(p => [(p[0] - mx) * 1.1, (p[1] - my) * 1.1]);
  const L = [0]; for (let i = 1; i < P.length; i++) L.push(L[i - 1] + Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]));
  const total = L[L.length - 1];
  return t => { // t in [0,1] -> {x,y,tx,ty}
    const d = t * total; let lo = 1, hi = L.length - 1; while (lo < hi) { const m = (lo + hi) >> 1; if (L[m] < d) lo = m + 1; else hi = m; }
    const i = lo, k = (d - L[i - 1]) / ((L[i] - L[i - 1]) || 1);
    const x = P[i - 1][0] + (P[i][0] - P[i - 1][0]) * k, y = P[i - 1][1] + (P[i][1] - P[i - 1][1]) * k;
    const j0 = Math.max(0, i - 3), j1 = Math.min(P.length - 1, i + 2);
    let tx = P[j1][0] - P[j0][0], ty = P[j1][1] - P[j0][1]; const l = Math.hypot(tx, ty) || 1;
    return { x, y, tx: tx / l, ty: ty / l };
  };
}

function buildGeometry(detail) {
  const g = new THREE.IcosahedronGeometry(1, detail);
  const pos = g.attributes.position, n = pos.count;
  const tgt = new Float32Array(n * 3), tn = new Float32Array(n * 3);
  const curve = jCurve(), R = 0.2;
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
uniform float uTime; uniform float uMorph; uniform float uAmp; uniform float uFreq; uniform float uRipple;
attribute vec3 aTarget; attribute vec3 aTargetN;
vec3 dispP(vec3 p, vec3 n, float amp){
  // single low-frequency octave: liquid, not crumpled
  float d = snoise(p*uFreq + vec3(0.0, uTime*0.16, uTime*0.09))*amp;
  d += uRipple*0.035*sin(length(p.xy)*9.0 - uTime*6.0);
  return p + n*d;
}`;

/* ---------- Dark studio environment: black room + 3 soft-edged strip lights ---------- */
function studioEnvironment(renderer) {
  const sc = new THREE.Scene();
  sc.add(new THREE.Mesh(new THREE.BoxGeometry(30, 30, 30), new THREE.MeshBasicMaterial({ color: 0x020202, side: THREE.BackSide })));
  const strip = (w, h, pos, intensity) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(intensity, intensity, intensity), side: THREE.DoubleSide }));
    m.position.set(...pos); m.lookAt(0, 0, 0); sc.add(m);
  };
  strip(24, 24, [0, 0, 14], 0.1);     // faint wall behind the camera: lifts the blacks to graphite
  strip(2.4, 18, [-6, 1, 6], 7);      // tall key strip, left-front
  strip(1.4, 18, [3.5, 0, 9], 5);     // narrow front strip: bright band down the face
  strip(1.2, 18, [8, 0, 0], 4);       // rim strip, right
  strip(18, 1.6, [0, 9, 2], 3.5);     // overhead strip
  strip(40, 40, [0, -9, 0], 0.35);    // soft grey floor: gives the chrome a horizon line
  const pmrem = new THREE.PMREMGenerator(renderer);
  const tex = pmrem.fromScene(sc, 0.02).texture; pmrem.dispose();
  return tex;
}

const J_H = 2.42; // world height of the J at scale 1 (curve + tube)

function init() {
  const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1 : 1.5);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance', preserveDrawingBuffer: still });
  renderer.setPixelRatio(still ? 2 : dpr);
  renderer.setSize(innerWidth, innerHeight, false);
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, innerWidth / innerHeight, 0.1, 60);
  camera.position.set(0, 0, 8);
  scene.environment = studioEnvironment(renderer);

  const lime = new THREE.Color('#C6FF3D'), white = new THREE.Color('#ffffff');
  const mat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff, metalness: 1, roughness: 0.09,
    iridescence: 0.22, iridescenceIOR: 1.3, iridescenceThicknessRange: [120, 380], // faint edge sheen only
    clearcoat: 0.4, clearcoatRoughness: 0.05, envMapIntensity: 1.15,
  });
  const U = { uTime: { value: 0 }, uMorph: { value: 0 }, uAmp: { value: 0.09 }, uFreq: { value: 0.9 }, uRipple: { value: 0 } };
  mat.onBeforeCompile = sh => {
    Object.assign(sh.uniforms, U);
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\n' + NOISE)
      .replace('#include <beginnormal_vertex>', `
        vec3 bP = mix(position, aTarget, uMorph);
        vec3 bN = normalize(mix(normal, aTargetN, uMorph));
        float amp = uAmp * (1.0 - 0.85 * uMorph);
        vec3 dP = dispP(bP, bN, amp);
        vec3 tA = normalize(cross(bN, abs(bN.y) < 0.99 ? vec3(0.0,1.0,0.0) : vec3(1.0,0.0,0.0)));
        vec3 tB = normalize(cross(bN, tA));
        vec3 q1 = dispP(bP + tA*0.01, bN, amp);
        vec3 q2 = dispP(bP + tB*0.01, bN, amp);
        vec3 objectNormal = normalize(cross(q1 - dP, q2 - dP));
        if (dot(objectNormal, bN) < 0.0) objectNormal = -objectNormal;
      `)
      .replace('#include <begin_vertex>', 'vec3 transformed = dP;');
  };
  const mesh = new THREE.Mesh(buildGeometry(mobile ? 24 : 64), mat);
  scene.add(mesh);

  const visH = () => 2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));

  if (still) { // static render of the chrome J for the reduced-motion / no-WebGL fallback
    U.uMorph.value = 1; U.uAmp.value = 0; mesh.scale.setScalar(0.86 * visH() / J_H);
    mesh.rotation.set(0.05, -0.32, 0.02);
    renderer.render(scene, camera); window.__stillReady = true; return;
  }

  // Hero placement: J height = 120% of the headline, centre near the right edge so ~20% is cropped off.
  const H = { x: 0.3, y: 0, s: 0.6 };
  function measureHero() {
    const h1 = document.querySelector('.hero h1'); if (!h1) return;
    const r = h1.getBoundingClientRect(), top = r.top + scrollY;
    const hpx = r.height * 1.2, wpx = hpx * 0.56;
    H.s = hpx / innerHeight;
    H.x = (innerWidth - wpx * 0.6) / innerWidth - 0.5;
    H.y = 0.5 - (top + r.height / 2) / innerHeight;
  }
  measureHero();

  // State: x,y = fractions of the viewport from centre; s = object height as a fraction of viewport height
  const S = { x: H.x, y: H.y, s: H.s, morph: 1, tint: 0, amp: 0.09, freq: 0.9, rx: 0, ry: -0.25 };
  const states = [
    ['#home',     { x: () => H.x, y: () => H.y, s: () => H.s, morph: 1, tint: 0, amp: 0.09, freq: 0.9, ry: -0.25 }],
    ['#toolkit',  { x: 0.34,  y: -0.04, s: 0.3,  morph: 0.88, tint: 0,   amp: 0.09, freq: 0.9, ry: 0 }],
    ['#about',    { x: 0.45,  y: 0.34,  s: 0.22, morph: 0.88, tint: 0,   amp: 0.08, freq: 0.8, ry: 0.3 }],
    ['#services', { x: 0.33,  y: 0,     s: 0.4,  morph: 0.88, tint: 1,   amp: 0.07, freq: 0.55, ry: 0 }], // softened J, lime-tinted chrome
    ['#work',     { x: 0.45,  y: -0.32, s: 0.2,  morph: 0.88, tint: 0,   amp: 0.08, freq: 0.8, ry: 0 }],
    ['#contact',  { x: 0.27,  y: 0.02,  s: 0.62, morph: 1, tint: 0.2, amp: 0.09, freq: 0.9, ry: -0.3 }],
  ];
  const gsap = window.gsap, ST = window.ScrollTrigger;
  // One scrubbed GSAP timeline over the whole page (timeline units = scroll pixels), rebuilt when layout changes.
  let tl = null;
  const val = v => (typeof v === 'function' ? v() : v);
  const snap = st => Object.fromEntries(Object.entries(st).map(([k, v]) => [k, val(v)]));
  function build() {
    if (!gsap || !ST || mobile) return;
    measureHero();
    const prog = tl ? tl.scrollTrigger.progress : 0;
    if (tl) { tl.scrollTrigger.kill(); tl.kill(); }
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    Object.assign(S, snap(states[0][1]));
    tl = gsap.timeline({ paused: true, defaults: { ease: 'none' } });
    let cursor = 0;
    for (let i = 1; i < states.length; i++) {
      const el = document.querySelector(states[i][0]); if (!el) continue;
      const top = el.getBoundingClientRect().top + scrollY;
      let st = Math.max(cursor, top - innerHeight), en = i === states.length - 1 ? top + el.offsetHeight / 2 - innerHeight / 2 : top - innerHeight * 0.25;
      st = Math.min(st, max); en = Math.min(Math.max(en, st + 1), max);
      tl.fromTo(S, snap(states[i - 1][1]), { ...snap(states[i][1]), duration: en - st, immediateRender: false }, st);
      cursor = en;
    }
    tl.set({}, {}, max);
    tl.scrollTrigger = ST.create({ start: 0, end: max, scrub: 1, animation: tl });
    tl.progress(prog);
  }
  const ready = () => { measureHero(); build(); };
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(ready); else ready();
  addEventListener('load', ready);
  setTimeout(ready, 1600);
  let rz; addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(ready, 200); });
  if (!gsap || !ST || mobile) Object.assign(S, snap(states[0][1]));

  addEventListener('resize', () => { if (mobile) { measureHero(); Object.assign(S, snap(states[0][1])); } });

  const intro = { v: 0 };
  intro.v = 1; // the hero still already shows the J, so the live scene starts as the J for a seamless crossfade

  const ptr = { x: 0, y: 0 }, tilt = { x: 0, y: 0 };
  addEventListener('pointermove', e => { ptr.x = e.clientX / innerWidth * 2 - 1; ptr.y = e.clientY / innerHeight * 2 - 1; }, { passive: true });

  if (!mobile && gsap) document.querySelectorAll('.fcard').forEach(c => {
    c.addEventListener('mouseenter', () => gsap.to(U.uRipple, { value: 1, duration: 0.6, ease: 'power2.out' }));
    c.addEventListener('mouseleave', () => gsap.to(U.uRipple, { value: 0, duration: 1.2, ease: 'power2.out' }));
  });

  const tmpC = new THREE.Color();
  let firstFrame = true, running = false, visible = true, last = performance.now(), t = 0;
  function frame(now) {
    if (!running) return;
    requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000); last = now; t += dt;
    U.uTime.value = t; U.uAmp.value = S.amp; U.uFreq.value = S.freq;
    U.uMorph.value = Math.min(S.morph, intro.v);
    const vh = visH(), vw = vh * camera.aspect;
    mesh.position.set(S.x * vw, S.y * vh, 0);
    mesh.scale.setScalar(S.s * vh / J_H);
        tilt.x += (ptr.y * 0.22 - tilt.x) * 0.05; tilt.y += (ptr.x * 0.35 - tilt.y) * 0.05;
    mesh.rotation.set(tilt.x, S.ry + tilt.y + Math.sin(t * 0.3) * 0.12, 0);
    tmpC.copy(white).lerp(lime, S.tint * 0.14); mat.color.copy(tmpC);
    renderer.render(scene, camera);
    if (firstFrame) { firstFrame = false; requestAnimationFrame(() => root.classList.add('gl-ready')); } // crossfade still -> live
  }
  const start = () => { if (!running && !document.hidden && visible) { running = true; last = performance.now(); requestAnimationFrame(frame); } };
  const stop = () => { running = false; };
  document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
  // Desktop: pause when the canvas is off-screen. Mobile: the blob lives in the hero only.
  const watch = mobile ? document.getElementById('home') : canvas;
  new IntersectionObserver(es => {
    visible = es[0].isIntersecting;
    if (mobile) root.classList.toggle('gl-hidden', !visible);
    visible ? start() : (mobile ? setTimeout(() => { if (!visible) stop(); }, 650) : stop());
  }, { threshold: 0 }).observe(watch);
  addEventListener('resize', () => { renderer.setSize(innerWidth, innerHeight, false); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); });
  root.classList.add('gl-on');
  start();
}

// Boot (at the end so every const above is initialised)
const boot = () => { try { init(); } catch (e) { console.warn('WebGL init failed', e); fallback('error'); } };
// Start WebGL only after the page has loaded and the main thread is idle, so the HTML hero paints first.
const whenIdle = fn => { const go = () => ('requestIdleCallback' in window ? requestIdleCallback(fn, { timeout: 1200 }) : setTimeout(fn, 200));
  document.readyState === 'complete' ? go() : addEventListener('load', go, { once: true }); };
if (still) boot();
else if (root.classList.contains('no-gl')) fallback(root.dataset.gl || 'early-check'); // decided by the inline head check
else if (reduce) fallback('reduced-motion');
else if (lowEnd) fallback('low-end');
else whenIdle(() => { const g = glSupport(); // probe after first paint and load, when the main thread is idle
  if (g === 'none') fallback('no-webgl');
  else if (g === 'software' && !forceGL) fallback('software-gl');
  else boot(); });
