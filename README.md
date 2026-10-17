# josephbepo

Portfolio of Joseph Bepo. Static site (HTML, CSS, vanilla JS), served by GitHub Pages from the repo root.

- `index.html`: markup; hero text renders before any WebGL loads.
- `assets/main.js`: project data (the `P` array), featured order (`FEAT`), toolkit lists, Lenis smooth scroll, cursor, loader.
- `assets/scene.js`: the fixed three.js "liquid chrome monogram" canvas (GSAP ScrollTrigger choreography). Falls back to `assets/monogram.svg` on reduced motion, no WebGL or low-end devices.
- `assets/vendor/`: three.js r169, GSAP 3.12.5 + ScrollTrigger, Lenis 1.1.13 (vendored, relative paths).
- `assets/Joseph_Bepo_Resume.pdf`: web copy of the resume (city only, no street address).
- Run locally: `python3 -m http.server` then open http://localhost:8000
