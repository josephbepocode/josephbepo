const GH='https://github.com/josephbepocode/';
const NAME={featured:'Featured',web:'Web',games:'Games',fintech:'Fintech',ai:'AI',tools:'Tools'};
// Every entry is described only from its README or source code.
const P=[
{t:'Agent Forge',c:['featured','ai','tools'],img:'agent-forge',feat:1,live:'https://josephbepocode.github.io/agent-app-builder/',repo:'agent-app-builder',
 d:'A multi-agent app builder that runs entirely in your browser. A planner writes a spec, a coder writes a single-file HTML app and a reviewer fixes bugs, all on a local LLM (Qwen2.5 Coder) through WebLLM, with a live sandboxed preview. Needs a WebGPU browser such as desktop Chrome or Edge; others get sample output.',
 s:['WebLLM','WebGPU','JavaScript','Sandboxed iframe']},
{t:'Football Lab',c:['featured','web','tools'],img:'football-lab',live:'https://josephbepocode.github.io/football-lab/',repo:'football-lab',
 d:'A football analytics app for six European leagues: live tables, team form and points races from openfootball results, plus StatsBomb shot maps, xG, expected points and percentile pizzas for real players, with player-vs-player comparison. Eredivisie and Liga Portugal player data is synthetic and badged as demo.',
 s:['D3.js','JavaScript','Python','Open data']},
{t:'Echo',c:['featured','ai'],img:'echo',live:'https://josephbepocode.github.io/voice-ai-assistant/',repo:'voice-ai-assistant',
 d:'A private, on-device voice assistant. Whisper transcribes your voice, SmolLM2 replies and the browser reads the answer aloud. The models run in the browser (WebGPU with a WASM fallback), downloading about 300 MB on first run.',
 s:['transformers.js','Whisper','SmolLM2','Web Speech API']},
{t:'Warehouse Digital Twin',c:['featured','ai','games'],img:'warehouse-twin',live:'https://josephbepocode.github.io/warehouse-digital-twin/',repo:'warehouse-digital-twin',
 d:'A 3D warehouse floor where autonomous robots take orders, plan routes with A*, pick from racks and deliver to packing stations without colliding. Live KPIs cover throughput, cycle time and utilisation. All data is simulated in the browser.',
 s:['three.js','A* pathfinding','JavaScript']},
{t:'Pixel2Page',c:['featured','ai','tools'],img:'pixel2page',live:'https://josephbepocode.github.io/screenshot-to-site/',repo:'screenshot-to-site',
 d:'Turn a UI screenshot into a starter website. SmolVLM, a small vision model, reads the image in your browser while a layout analyser measures sections and colours, producing editable HTML and CSS. Images never leave your device; treat the output as a starting point.',
 s:['transformers.js','SmolVLM','WebGPU / WASM','Canvas']},
{t:'Signal Terminal',c:['featured','ai','fintech'],img:'signal-terminal',live:'https://josephbepocode.github.io/ai-markets-terminal/',repo:'ai-markets-terminal',
 d:'A terminal-style crypto dashboard with live CoinGecko data, price charts and risk stats such as max drawdown, plus plain-language briefs from SmolLM2 running on your device. Educational demo only, not financial advice.',
 s:['CoinGecko API','SmolLM2','transformers.js','Canvas']},
{t:'AI Vision Studio',c:['featured','ai','web'],img:'vision-studio',feat:1,live:'https://josephbepocode.github.io/ai-vision-studio/',repo:'ai-vision-studio',
 d:'Real-time webcam AI effects in the browser. MediaPipe handles person segmentation, pose tracking and a 478-point face mesh, powering background effects, overlays and color grades. Save PNG snapshots or WebM recordings, or try the demo scene without a camera.',
 s:['MediaPipe','Canvas','MediaRecorder','JavaScript']},
{t:'AI Music Lab',c:['featured','ai','tools'],img:'music-lab',live:'https://josephbepocode.github.io/ai-music-lab/',repo:'ai-music-lab',
 d:'A beat and melody composer: a 16-step drum machine and piano roll, where Magenta DrumsRNN and MelodyRNN continue your patterns. Tone.js plays them, with style seeds, live visualizers and WAV and MIDI export.',
 s:['Tone.js','Magenta','Web Audio']},
{t:'City Traffic Sim',c:['featured','ai','games'],img:'traffic-sim',live:'https://josephbepocode.github.io/city-traffic-sim/',repo:'city-traffic-sim',
 d:'A 3D agent-based traffic simulation where every car follows the Intelligent Driver Model. Compare fixed-time, adaptive max-pressure and green-wave signal timing with live KPIs and a built-in benchmark.',
 s:['three.js','Agent-based sim','JavaScript']},
{t:'Browser Code Agent',c:['featured','ai','tools'],img:'code-agent',live:'https://josephbepocode.github.io/browser-code-agent/',repo:'browser-code-agent',
 d:'Describe a task and a small local LLM (Qwen2.5 Coder or SmolLM2) writes Python, runs it in Pyodide and feeds errors back so it can fix its own code. Everything runs in your browser, on WebGPU when available with a WebAssembly fallback.',
 s:['Pyodide','transformers.js','WebGPU / WASM','Web Workers']},
{t:'Deji Design Studio',c:['featured','ai','web'],img:'design-studio',live:'https://josephbepocode.github.io/deji-design-studio/',repo:'deji-design-studio',
 d:'A fashion design tool for the Deji brand. Type a brief and a rule-based style lexicon (not a large model) turns it into a palette, pattern, fabric and silhouette, with six variations and a live drape preview on garment templates.',
 s:['JavaScript','Canvas','Generative design']},
{t:'Ontario Life',c:['games','web'],img:'ontario-life',feat:1,live:'https://josephbepocode.github.io/ontario-life/',repo:'ontario-life',
 d:"A Sims-style life sim across Ontario's 401 corridor, from Ottawa to Kitchener-Waterloo. Ride GO trains, VIA Rail or drive the 401, work shifts, make friends and pay rent on the 1st. Plays offline, with an optional Node server for accounts, cloud saves, DMs and leaderboards.",
 s:['HTML/CSS/JS','Node.js','localStorage','PWA']},
{t:'JJ Fit',c:['fintech','web'],img:'jjfit',feat:1,status:'Not deployed yet',
 d:'A subscription platform for quarterly weight-loss routines. Server-rendered Node and Express with Paystack and Stripe checkout, an admin area, CSRF protection, rate limits, a strict CSP and bcrypt-hashed accounts.',
 s:['Node.js','Express','SQLite (sql.js)','Stripe','Paystack','Playwright']},
{t:'Polymarket Backtest Sandbox',c:['fintech','tools'],glyph:'%',status:'Research project',
 d:'An offline backtest of longshot and favorite strategies on a sample of Polymarket trade data. Models slippage and fee scenarios and uses bootstrap confidence intervals clustered by market.',
 s:['Python','pandas','NumPy','DuckDB','Parquet']},
{t:'Ontario Gas Prices',c:['tools','web'],img:'gas-price-finder',live:'https://josephbepocode.github.io/gas-price-finder/',repo:'gas-price-finder',
 d:"Compares fuel prices across Ontario cities by fuel grade, using Ontario Ministry of Energy data. An Express proxy fetches the province's CSV to get around CORS.",
 s:['JavaScript','Express','Open data']},
{t:'Gym Progress Tracker',c:['tools','web'],img:'gymwatch',live:'https://josephbepocode.github.io/gymwatch/',repo:'gymwatch',
 d:'Track weight gain and daily protein intake against your own goals, with meal logging, weight history and a streak of protein-goal days.',
 s:['HTML','CSS','JavaScript']},
{t:'Deji Drop 01',c:['web'],img:'pb',feat:1,live:'https://bepojoseph.xyz/',repo:'pb',
 d:'An editorial storefront for a limited clothing drop, with shop, build, lookbook and about sections and a video hero that falls back to a still-frame sequence.',
 s:['HTML','CSS','JavaScript']},
{t:'Braids By Tete',c:['web'],img:'booktete',live:'https://josephbepocode.github.io/booktete/',repo:'booktete',
 d:'A booking site for a braiding studio, listing services with durations and prices, a gallery and calls to book an appointment.',
 s:['HTML','CSS']},
{t:'AI Bookkeeper',c:['fintech','ai','web'],img:'aibookkeeper',repo:'AIBookkeeper',
 d:'A product landing page for an AI bookkeeping concept: automated expense tracking, real-time reports, a how-it-works flow and pricing.',
 s:['HTML','CSS','JavaScript']},
{t:'Resume Builder',feat:1,c:['ai','tools'],glyph:'¶',priv:1,
 d:'Paste a job posting and get a tailored PDF resume. A Flask API pulls keywords from the posting with NLTK and lays out the document with ReportLab, behind a React client.',
 s:['Python','Flask','NLTK','ReportLab','React']},
{t:'ScanWithBepo',c:['fintech','tools'],glyph:'#',priv:1,
 d:'A blockchain explorer with pages for blocks, transactions, accounts and contracts, built on ethers.',
 s:['Next.js','ethers','Tailwind CSS']},
{t:'EduChain',c:['fintech','web'],glyph:'∆',priv:1,
 d:'A React frontend for a Web3 education app with registration, login and a wallet connection module.',
 s:['React','web3']},
{t:'TimelessNFT',c:['fintech','web'],glyph:'◆',priv:1,
 d:'An NFT marketplace with Solidity contracts, MetaMask and in-app chat, built by following the Daltonic tutorial on React, Solidity and CometChat.',
 s:['Solidity','Truffle','React','Tailwind CSS','CometChat']},
{t:'Storex',c:['web'],glyph:'$',priv:1,
 d:'A Shopify-backed storefront set up on the Next.js Commerce starter.',
 s:['Next.js','TypeScript','Shopify']},
{t:'SvelteKit Starter',c:['web'],glyph:'S',priv:1,
 d:'A SvelteKit app with home, about and todos routes, configured for Vercel deployment.',
 s:['SvelteKit','Vite','Vercel']},
{t:'Little Lemon',c:['web'],glyph:'L',repo:'djangoproj',
 d:'A Django restaurant site with models, forms, admin and templates.',
 s:['Python','Django','SQLite']},
{t:'Hot Dog Profit Calculator',c:['tools'],glyph:'∑',repo:'snakeweb',
 d:'A Flask web app that works out revenue, production cost and profit per hot dog type from sales numbers.',
 s:['Python','Flask']},
{t:'Python Apps',c:['tools','games'],glyph:'>_',repo:'python-apps',
 d:'A growing library of small Python programs, including a sales calculator and a playful snake that paints random ASCII art.',
 s:['Python']},
];
// Year = repo creation year on GitHub (blank when there is no repo to check).
const YEAR={'Agent Forge':2026,'Echo':2026,'Warehouse Digital Twin':2026,'Pixel2Page':2026,'Signal Terminal':2026,'AI Vision Studio':2026,'AI Music Lab':2026,'City Traffic Sim':2026,'Browser Code Agent':2026,'Deji Design Studio':2026,'Ontario Life':2026,'Ontario Gas Prices':2026,'Gym Progress Tracker':2026,'Deji Drop 01':2026,'Braids By Tete':2025,'AI Bookkeeper':2026,'Resume Builder':2025,'ScanWithBepo':2024,'EduChain':2024,'TimelessNFT':2024,'Storex':2025,'SvelteKit Starter':2025,'Little Lemon':2024,'Hot Dog Profit Calculator':2024,'Python Apps':2024};
// Editorial category line for each project.
const CAT={'Agent Forge':'AI Agents · Dev Tools','Echo':'Voice AI · On-Device','Warehouse Digital Twin':'3D Simulation · Robotics','Pixel2Page':'Vision AI · Web','Signal Terminal':'Fintech · AI','AI Vision Studio':'Computer Vision','AI Music Lab':'Generative Audio','City Traffic Sim':'3D Simulation · Urban','Browser Code Agent':'AI Agents · Python','Deji Design Studio':'Generative Design · Fashion','Ontario Life':'Game · Life Sim'};
// Top three = the most technically demanding builds; then three more strong ones.
const FEAT=['Agent Forge','Browser Code Agent','Warehouse Digital Twin','City Traffic Sim'];
// Toolkit: only tech that appears in the projects above.
const TOOLS_A=['three.js','WebGPU','WebLLM','transformers.js','Pyodide','MediaPipe','Tone.js','Magenta','Canvas','Web Audio'];
const TOOLS_B=['React','Next.js','Node.js','Express','Python','Flask','Django','D3.js','pandas','DuckDB','Solidity','Tailwind CSS','Git'];

const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
P.forEach(p=>{p.y=YEAR[p.t]||'';p.cat=CAT[p.t]||p.c.filter(c=>c!=='featured').map(c=>NAME[c]).join(' · ')});

// Marquee: duplicate the list so the CSS loop is seamless.
const fill=(id,arr)=>{const h=arr.map(t=>`<li>${esc(t)}</li><li class="star" aria-hidden="true">✳</li>`).join('');$(id).innerHTML=h+h.replace(/<li>/g,'<li aria-hidden="true">')};
fill('#track-a',TOOLS_A);fill('#track-b',TOOLS_B);

// Featured cards
const fp=FEAT.map(t=>P.find(p=>p.t===t)).filter(Boolean);
$('#featured').innerHTML=fp.map((p,i)=>{
 const href=p.live||(p.repo&&GH+p.repo)||'#';
 const url=(p.live||GH+p.repo).replace(/^https?:\/\//,'').replace(/\/$/,'');
 return `<article class="fcard reveal${i%2?' flip':''}">
  <a class="frame" href="${href}" target="_blank" rel="noopener">
   <span class="bar" aria-hidden="true"><i></i><i></i><i></i><span class="mono">${esc(url)}</span></span>
   <span class="screen"><img src="assets/projects/${p.img}.webp" alt="Screenshot of ${esc(p.t)}" loading="lazy" decoding="async" width="800" height="500"></span>
   <span class="view mono">${p.live?'Live Project':'View Code'} ↗</span></a>
  <div class="fmeta">
   <span class="num mono">${String(i+1).padStart(2,'0')}</span>
   <p class="cat mono">${esc(p.cat)} · ${p.y}</p>
   <h3>${esc(p.t)}</h3>
   <p class="desc">${esc(p.d)}</p>
   <ul class="tags mono">${p.s.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>
   <div class="links mono">${p.live?`<a href="${p.live}" target="_blank" rel="noopener">Live ↗</a>`:''}${p.repo?`<a href="${GH+p.repo}" target="_blank" rel="noopener">Code ↗</a>`:''}</div>
  </div></article>`}).join('');
// Hover tilt on the browser frames (desktop, fine pointer only)
if(matchMedia('(hover: hover) and (pointer: fine)').matches&&!matchMedia('(prefers-reduced-motion: reduce)').matches)
 $$('.frame').forEach(f=>{f.addEventListener('pointermove',e=>{const r=f.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
  f.style.transform=`perspective(1200px) rotateY(${x*7}deg) rotateX(${-y*6}deg) translateZ(0)`});
  f.addEventListener('pointerleave',()=>{f.style.transform=''})});

// All projects list
$('#all-n').textContent=P.length;
const cats=['all','ai','web','games','fintech','tools'];
$('#filters').innerHTML=cats.map(c=>`<button type="button" data-f="${c}" aria-pressed="${c==='all'}">${c==='all'?'All':NAME[c]}<sup>${c==='all'?P.length:P.filter(p=>p.c.includes(c)).length}</sup></button>`).join('');
function row(p,i){
 const href=p.live||(p.repo&&GH+p.repo);
 const thumb=p.img?`<img src="assets/projects/${p.img}.webp" alt="" loading="lazy" decoding="async">`:`<i aria-hidden="true">${esc(p.glyph||'*')}</i>`;
 const tag=p.live?'Live':p.repo?'Code':p.priv?'Private':(p.status||'');
 const inner=`<span class="ri mono">${String(i+1).padStart(2,'0')}</span><span class="rt">${thumb}</span><span class="rn"><b>${esc(p.t)}</b><small>${esc(p.d)}</small></span><span class="rc mono">${esc(p.cat)}</span><span class="ry mono">${p.y}</span><span class="rs mono">${esc(tag)}${href?' ↗':''}</span>`;
 return `<li>${href?`<a href="${href}" target="_blank" rel="noopener">${inner}</a>`:`<div>${inner}</div>`}</li>`}
function render(f){$('#list').innerHTML=P.filter(p=>f==='all'||p.c.includes(f)).map(row).join('')}
render('all');
$$('#filters button').forEach(b=>b.onclick=()=>{$$('#filters button').forEach(x=>x.setAttribute('aria-pressed',x===b));render(b.dataset.f)});
$('#all-btn').onclick=e=>{const b=e.currentTarget,o=b.getAttribute('aria-expanded')==='true';b.setAttribute('aria-expanded',!o);$('#all').hidden=o;if(!o)$('#all').classList.add('on')};

// Stats
$('#st-all').dataset.to=P.length;$('#st-ai').dataset.to=P.filter(p=>p.c.includes('ai')).length;$('#st-live').dataset.to=P.filter(p=>p.live).length;

// Menu
const mb=$('#menu-btn'),bar=$('#top-bar');
mb.onclick=()=>{const o=mb.getAttribute('aria-expanded')==='true';mb.setAttribute('aria-expanded',!o);bar.classList.toggle('open',!o);document.body.classList.toggle('lock',!o)};
$$('#menu a[href^="#"]').forEach(a=>a.addEventListener('click',()=>{mb.setAttribute('aria-expanded','false');bar.classList.remove('open');document.body.classList.remove('lock')}));

// About statement: word-by-word highlight tied to scroll
const st=$('#statement');st.innerHTML=st.textContent.trim().split(/\s+/).map(w=>`<span>${esc(w)} </span>`).join('');
const words=[...st.children];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

// Reveal on scroll
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('on');io.unobserve(e.target);
 if(e.target.matches('.stats'))countUp()}}),{threshold:.15,rootMargin:'0px 0px -5% 0px'});
$$('.reveal,.stats,.sec-head,.talk,.toolkit').forEach(el=>io.observe(el));
function countUp(){$$('.stats b').forEach(b=>{const to=+b.dataset.to,t0=performance.now();
 if(reduce){b.textContent=to;return}
 const f=t=>{const k=Math.min(1,(t-t0)/1200);b.textContent=Math.round(to*(1-Math.pow(1-k,3)));if(k<1)requestAnimationFrame(f)};requestAnimationFrame(f)})}

// Scroll-linked effects (progress bar, header state, about word highlight)
let ticking=false,lastY=0;
function onScroll(){ticking=false;const y=scrollY,h=document.documentElement.scrollHeight-innerHeight;
 $('#bar').style.transform=`scaleX(${h>0?y/h:0})`;bar.classList.toggle('scrolled',y>40);
 if(!bar.classList.contains('open')){if(y>lastY+4&&y>140)bar.classList.add('hide');else if(y<lastY-4||y<140)bar.classList.remove('hide')}lastY=y;
 const r=st.getBoundingClientRect(),k=Math.min(1,Math.max(0,(innerHeight*.85-r.top)/(r.height+innerHeight*.35)));
 const n=Math.round(words.length*k);words.forEach((w,i)=>w.classList.toggle('lit',reduce||i<n));
 // active service = the one closest to the viewport centre
 let best=null,bd=1e9;svcItems.forEach(li=>{const b=li.getBoundingClientRect(),d=Math.abs(b.top+b.height/2-innerHeight/2);if(d<bd){bd=d;best=li}});
 svcItems.forEach(li=>li.classList.toggle('active',li===best&&bd<innerHeight*.4));
 window.__active=best&&bd<innerHeight*.4?best:null}
const svcItems=$$('#svc li');
addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(onScroll)}},{passive:true});onScroll();

// Smooth scrolling (Lenis) wired to GSAP ScrollTrigger
window.__reduce=reduce;
if(!reduce&&window.Lenis&&!matchMedia('(max-width: 767px), (pointer: coarse)').matches){const lenis=new Lenis({lerp:.1,smoothWheel:true});window.__lenis=lenis;
 if(window.gsap&&window.ScrollTrigger){gsap.registerPlugin(ScrollTrigger);lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(t=>lenis.raf(t*1000));gsap.ticker.lagSmoothing(0)}
 else{const raf=t=>{lenis.raf(t);requestAnimationFrame(raf)};requestAnimationFrame(raf)}
 $$('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const id=a.getAttribute('href');if(id.length<2)return;const t=$(id);if(!t)return;e.preventDefault();lenis.scrollTo(t,{offset:0,duration:1.4});history.replaceState(null,'',id)}))}

// Custom cursor dot (fine pointers only)
const cur=$('#cursor');
if(matchMedia('(hover: hover) and (pointer: fine)').matches&&!reduce){document.body.classList.add('has-cursor');let cx=innerWidth/2,cy=innerHeight/2,tx=cx,ty=cy;
 addEventListener('pointermove',e=>{tx=e.clientX;ty=e.clientY;cur.classList.add('show')},{passive:true});
 document.addEventListener('pointerleave',()=>cur.classList.remove('show'));
 document.addEventListener('pointerover',e=>cur.classList.toggle('big',!!e.target.closest('a,button,[tabindex],.fcard')));
 const loop=()=>{cx+=(tx-cx)*.25;cy+=(ty-cy)*.25;cur.style.transform=`translate(${cx}px,${cy}px)`;requestAnimationFrame(loop)};loop()}

// Load counter 0 to 100: cosmetic, never waits for WebGL, capped at ~1.1s
(()=>{const L=$('#loader'),N=$('#load-n');if(reduce){L.remove();document.body.classList.add('loaded');return}
 const t0=performance.now(),D=1100;const f=t=>{const k=Math.min(1,(t-t0)/D);N.textContent=Math.round(100*(1-Math.pow(1-k,2)));
  if(k<1)requestAnimationFrame(f);else finish()};let fin=0;
 const finish=()=>{if(fin)return;fin=1;N.textContent=100;L.classList.add('done');document.body.classList.add('loaded');setTimeout(()=>L.remove(),1000)};
 requestAnimationFrame(f);setTimeout(finish,D+500)})();

// Clock + year
const clk=$('#clock');const tick=()=>{clk.textContent=new Date().toLocaleTimeString('en-CA',{timeZone:'America/Toronto',hour:'2-digit',minute:'2-digit'})+' Toronto'};tick();setInterval(tick,30000);
$('#yr').textContent=new Date().getFullYear();

