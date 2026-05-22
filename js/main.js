/* ============================================================
   THREE.JS — animated background (particles + wireframe shapes)
   ============================================================ */
(function () {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas || !window.THREE) return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  /* --- Particle field --- */
  const count = window.innerWidth < 768 ? 600 : 1400;
  const pos   = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    pos[i * 3]     = (Math.random() - 0.5) * 22;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 22;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const pMat = new THREE.PointsMaterial({ color: 0x6c63ff, size: 0.032, transparent: true, opacity: 0.55 });
  scene.add(new THREE.Points(pGeo, pMat));

  /* --- Wireframe geometric shapes --- */
  const shapes = [];
  function addShape(type, size, x, y, z, col) {
    const geos = {
      ico: new THREE.IcosahedronGeometry(size, 0),
      oct: new THREE.OctahedronGeometry(size, 0),
      tet: new THREE.TetrahedronGeometry(size, 0),
    };
    const wf  = new THREE.WireframeGeometry(geos[type]);
    const mat = new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: 0.18 });
    const obj = new THREE.LineSegments(wf, mat);
    obj.position.set(x, y, z);
    obj.userData.rx = (Math.random() - 0.5) * 0.006;
    obj.userData.ry = (Math.random() - 0.5) * 0.006;
    scene.add(obj);
    shapes.push(obj);
  }
  addShape('ico', 1.3, -4.5,  2,   -2, 0x6c63ff);
  addShape('oct', 0.9,  4.5, -1.5, -1, 0x3ecfff);
  addShape('tet', 1.0,  2.5,  3,   -3, 0x9b89ff);
  addShape('ico', 0.55,-3.5, -3,    0, 0x3ecfff);
  addShape('oct', 1.5,  0,   -3.5, -4, 0x6c63ff);

  /* --- Mouse parallax --- */
  const mouse = { x: 0, y: 0 };
  document.addEventListener('mousemove', e => {
    mouse.x = (e.clientX / window.innerWidth  - 0.5) * 0.4;
    mouse.y = (e.clientY / window.innerHeight - 0.5) * 0.4;
  });

  /* --- Animate --- */
  let t = 0;
  (function tick() {
    requestAnimationFrame(tick);
    t += 0.004;
    scene.children[0].rotation.y = t * 0.04;
    scene.children[0].rotation.x = t * 0.018;
    shapes.forEach(s => { s.rotation.x += s.userData.rx; s.rotation.y += s.userData.ry; });
    camera.position.x += (mouse.x - camera.position.x) * 0.04;
    camera.position.y += (-mouse.y - camera.position.y) * 0.04;
    renderer.render(scene, camera);
  })();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();

/* ============================================================
   PRELOADER
   ============================================================ */
window.addEventListener('load', () => {
  setTimeout(() => document.getElementById('preloader').classList.add('hidden'), 700);
});

/* ============================================================
   NAVBAR
   ============================================================ */
const navbar    = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navMenu   = document.getElementById('nav-menu');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  document.getElementById('btt').classList.toggle('vis', window.scrollY > 500);

  /* Active link highlight */
  const scrollY = window.scrollY + 120;
  document.querySelectorAll('section[id]').forEach(sec => {
    const link = document.querySelector(`.nav-link[href="#${sec.id}"]`);
    if (!link) return;
    link.classList.toggle('active', scrollY >= sec.offsetTop && scrollY < sec.offsetTop + sec.offsetHeight);
  });
});

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  navMenu.classList.toggle('open');
});
document.querySelectorAll('.nav-link').forEach(l => {
  l.addEventListener('click', () => { navToggle.classList.remove('open'); navMenu.classList.remove('open'); });
});

/* ============================================================
   TYPED TEXT
   ============================================================ */
(function () {
  const el      = document.querySelector('.typed-text');
  const strings = ['Full-Stack Developer', 'Data Analyst', 'Blockchain Developer', 'Backend Engineer'];
  let si = 0, ci = 0, del = false, speed = 100;

  function tick() {
    const cur = strings[si];
    el.textContent = del ? cur.slice(0, --ci) : cur.slice(0, ++ci);
    speed = del ? 45 : 100;
    if (!del && ci === cur.length) { speed = 2200; del = true; }
    else if (del && ci === 0)      { del = false; si = (si + 1) % strings.length; speed = 450; }
    setTimeout(tick, speed);
  }
  tick();
})();

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
const revObs = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('shown'), i * 70);
      revObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revObs.observe(el));

/* ============================================================
   SKILL BAR ANIMATION
   ============================================================ */
const skillObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.skill-fill').forEach(f => f.classList.add('go'));
      skillObs.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });

const sw = document.querySelector('.skills-wrap');
if (sw) skillObs.observe(sw);

/* ============================================================
   COUNTER ANIMATION
   ============================================================ */
const cntObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.counter').forEach(c => {
        const tgt = +c.dataset.target;
        let cur = 0;
        const step = tgt / 55;
        const run = () => {
          cur = Math.min(cur + step, tgt);
          c.textContent = Math.floor(cur);
          if (cur < tgt) requestAnimationFrame(run);
        };
        run();
      });
      cntObs.unobserve(e.target);
    }
  });
}, { threshold: 0.4 });

const statsEl = document.querySelector('.stats');
if (statsEl) cntObs.observe(statsEl);

/* ============================================================
   PORTFOLIO FILTER
   ============================================================ */
document.querySelectorAll('.f-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.f-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.proj-card').forEach(card => {
      card.classList.toggle('hidden', filter !== 'all' && card.dataset.cat !== filter);
    });
  });
});

/* ============================================================
   3D TILT on service cards
   ============================================================ */
document.querySelectorAll('.tilt').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r   = card.getBoundingClientRect();
    const cx  = r.width / 2, cy = r.height / 2;
    const rx  = ((e.clientY - r.top)  - cy) / cy * -8;
    const ry  = ((e.clientX - r.left) - cx) / cx *  8;
    card.style.transition = 'transform 0.1s ease, box-shadow 0.4s ease, border-color 0.4s ease';
    card.style.transform  = `translateY(-8px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transition = 'transform 0.5s ease, box-shadow 0.4s ease, border-color 0.4s ease';
    card.style.transform  = 'translateY(0) rotateX(0) rotateY(0)';
  });
});

/* ============================================================
   CONTACT FORM — fetch to Formspree endpoint
   ============================================================ */
(function () {
  var form   = document.getElementById('contact-form');
  var status = document.getElementById('form-status');
  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    var btnText = document.getElementById('btn-text');
    btnText.textContent = 'Sending…';

    try {
      var res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });
      if (res.ok) {
        status.className = 'form-status ok';
        status.textContent = "Message sent! I'll get back to you soon.";
        form.reset();
      } else {
        throw new Error('failed');
      }
    } catch (_) {
      status.className = 'form-status err';
      status.textContent = 'Something went wrong. Please email me directly.';
    }

    btnText.textContent = 'Send Message';
  });
})();

/* ============================================================
   BACK TO TOP
   ============================================================ */
document.getElementById('btt').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ============================================================
   FOOTER YEAR
   ============================================================ */
document.getElementById('year').textContent = new Date().getFullYear();
