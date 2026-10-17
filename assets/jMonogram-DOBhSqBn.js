function q(){const o=[],u=(e,c,a)=>{for(let x=0;x<a;x++){const n=x/a;o.push([e[0]+(c[0]-e[0])*n,e[1]+(c[1]-e[1])*n])}},v=(e,c,a,x,n,i)=>{for(let h=0;h<i;h++){const f=x+(n-x)*h/i;o.push([e+a*Math.cos(f),c+a*Math.sin(f)])}};u([-.36,1],[.04,1],120),v(.04,.7,.3,Math.PI/2,0,160),u([.34,.7],[.34,-.3],260),v(-.14,-.3,.48,0,-Math.PI*.98,420);for(let e=0;e<6;e++)for(let c=1;c<o.length-1;c++)o[c]=[(o[c-1][0]+2*o[c][0]+o[c+1][0])/4,(o[c-1][1]+2*o[c][1]+o[c+1][1])/4];let s=1e9,y=-1e9,l=1e9,p=-1e9;o.forEach(e=>{s=Math.min(s,e[0]),y=Math.max(y,e[0]),l=Math.min(l,e[1]),p=Math.max(p,e[1])});const w=(s+y)/2,z=(l+p)/2,t=o.map(e=>[(e[0]-w)*1.1,(e[1]-z)*1.1]),r=[0];for(let e=1;e<t.length;e++)r.push(r[e-1]+Math.hypot(t[e][0]-t[e-1][0],t[e][1]-t[e-1][1]));const _=r[r.length-1];return e=>{const c=e*_;let a=1,x=r.length-1;for(;a<x;){const M=a+x>>1;r[M]<c?a=M+1:x=M}const n=a,i=(c-r[n-1])/(r[n]-r[n-1]||1),h=t[n-1][0]+(t[n][0]-t[n-1][0])*i,f=t[n-1][1]+(t[n][1]-t[n-1][1])*i,g=Math.max(0,n-3),b=Math.min(t.length-1,n+2);let A=t[b][0]-t[g][0],d=t[b][1]-t[g][1];const m=Math.hypot(A,d)||1;return{x:h,y:f,tx:A/m,ty:d/m}}}function D(o,u){const v=new o.IcosahedronGeometry(1,u),s=v.attributes.position,y=s.count,l=new Float32Array(y*3),p=new Float32Array(y*3),w=q(),z=.2;for(let t=0;t<y;t++){const r=s.getX(t),_=s.getY(t),e=s.getZ(t),c=Math.max(-1,Math.min(1,_)),a=(1-c)/2,x=Math.atan2(e,r),n=Math.sqrt(Math.max(0,1-c*c)),i=w(a),h=-i.ty,f=i.tx,g=h*Math.cos(x),b=f*Math.cos(x),A=Math.sin(x),d=z*Math.pow(n,.35);l[t*3]=i.x+g*d,l[t*3+1]=i.y+b*d,l[t*3+2]=A*d;const m=1-Math.pow(n,.35),M=c>0?-1:1;let j=g*(1-m)+i.tx*M*m,B=b*(1-m)+i.ty*M*m,P=A*(1-m);const C=Math.hypot(j,B,P)||1;p[t*3]=j/C,p[t*3+1]=B/C,p[t*3+2]=P/C}return v.setAttribute("aTarget",new o.BufferAttribute(l,3)),v.setAttribute("aTargetN",new o.BufferAttribute(p,3)),v}const G=`
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
}`;function S(o,u){const v=new o.Scene;v.add(new o.Mesh(new o.BoxGeometry(30,30,30),new o.MeshBasicMaterial({color:131586,side:o.BackSide})));const s=(p,w,z,t)=>{const r=new o.Mesh(new o.PlaneGeometry(p,w),new o.MeshBasicMaterial({color:new o.Color(t,t,t),side:o.DoubleSide}));r.position.set(...z),r.lookAt(0,0,0),v.add(r)};s(24,24,[0,0,14],.1),s(2.4,18,[-6,1,6],7),s(1.4,18,[3.5,0,9],5),s(1.2,18,[8,0,0],4),s(18,1.6,[0,9,2],3.5),s(40,40,[0,-9,0],.35);const y=new o.PMREMGenerator(u),l=y.fromScene(v,.02).texture;return y.dispose(),l}const k=2.42;export{k as J_H,G as NOISE,D as buildGeometry,q as jCurve,S as studioEnvironment};
