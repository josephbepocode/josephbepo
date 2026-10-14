const GH='https://github.com/josephbepocode/';
const COL={web:'#4da3ff',games:'#ff7a45',fintech:'#2fd38a',ai:'#b07cff',tools:'#ffc23d'};
const NAME={web:'Web',games:'Games',fintech:'Fintech',ai:'AI',tools:'Tools'};
// Every entry is described only from its README or source code.
const P=[
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
const grid=document.getElementById('grid');
const esc=s=>s.replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
function card(p){const c=COL[p.c[0]];
 const thumb=p.img?`<img src="assets/projects/${p.img}.webp" alt="Screenshot of ${esc(p.t)}" decoding="async" width="800" height="500">`
  :`<div class="cover" aria-hidden="true"><i>${esc(p.glyph||'*')}</i><b>${esc(p.t)}</b><small>${p.s.slice(0,3).map(esc).join(' · ')}</small></div>`;
 const badge=p.live?'<span class="badge live">Live</span>':p.priv?'<span class="badge">Private</span>':p.status?`<span class="badge">${esc(p.status)}</span>`:'';
 const links=[p.live&&`<a href="${p.live}" target="_blank" rel="noopener">Live site ↗</a>`,p.repo&&`<a href="${GH+p.repo}" target="_blank" rel="noopener">Code ↗</a>`].filter(Boolean);
 if(!links.length)links.push(`<span class="na">${p.priv?'Code is private':'Demo on request'}</span>`);
 return `<article class="card${p.feat?' feat':''}" style="--c:${c}" data-c="${p.c.join(' ')}"><div class="thumb">${badge}${thumb}</div><div class="body"><span class="cat">${p.c.map(x=>NAME[x]).join(' / ')}</span><h3>${esc(p.t)}</h3><p>${esc(p.d)}</p><ul class="stack">${p.s.map(x=>`<li>${esc(x)}</li>`).join('')}</ul><div class="links">${links.join('')}</div></div></article>`}
function render(f){grid.innerHTML=P.filter(p=>f==='all'||p.c.includes(f)).map(card).join('')}
render('all');document.getElementById('count').textContent=P.length;
document.querySelectorAll('.filters button').forEach(b=>{const f=b.dataset.f;b.insertAdjacentHTML('beforeend',`<sup>${f==='all'?P.length:P.filter(p=>p.c.includes(f)).length}</sup>`);
 b.onclick=()=>{document.querySelectorAll('.filters button').forEach(x=>x.setAttribute('aria-pressed',x===b));render(f)}});
const root=document.documentElement;
document.getElementById('theme').onclick=()=>{const dark=root.dataset.theme?root.dataset.theme==='dark':!matchMedia('(prefers-color-scheme: light)').matches;root.dataset.theme=dark?'light':'dark';try{localStorage.setItem('theme',root.dataset.theme)}catch(e){}};
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('on');io.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
document.getElementById('yr').textContent=new Date().getFullYear();
const form=document.getElementById('form'),st=document.getElementById('status');
form.addEventListener('submit',async e=>{e.preventDefault();st.textContent='Sending...';
 try{const r=await fetch(form.action,{method:'POST',body:new FormData(form),headers:{Accept:'application/json'}});st.textContent=r.ok?'Thanks! I will get back to you soon.':'Something went wrong. Please email me directly.';if(r.ok)form.reset()}catch(_){st.textContent='Network error. Please email me directly.'}});
