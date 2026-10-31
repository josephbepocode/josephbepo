const L=`
attribute vec2 a_pos;
void main(){ gl_Position = vec4(a_pos, 0.0, 1.0); }
`,P=`
precision mediump float;
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse;
void main(){
  vec2 uv = gl_FragCoord.xy / u_res;
  uv.y = 1.0 - uv.y;
  vec2 m = u_mouse;
  float t = u_time * 0.22;

  vec2 c1 = vec2(0.22 + 0.08*sin(t), 0.35 + 0.1*cos(t*0.9)) + (m - 0.5) * 0.12;
  vec2 c2 = vec2(0.78 + 0.1*cos(t*0.8), 0.28 + 0.08*sin(t*1.1)) + (m - 0.5) * -0.1;
  vec2 c3 = vec2(0.5 + 0.12*sin(t*0.7), 0.78 + 0.06*cos(t)) + (m - 0.5) * 0.08;

  float d1 = length(uv - c1);
  float d2 = length(uv - c2);
  float d3 = length(uv - c3);

  // Cobalt #2D5BFF, orange #FF6B1A, sky #E8F1FF, off-white #F7F5F0
  vec3 cobalt = vec3(0.176, 0.357, 1.0);
  vec3 orange = vec3(1.0, 0.420, 0.102);
  vec3 sky    = vec3(0.910, 0.945, 1.0);
  vec3 cream  = vec3(0.969, 0.961, 0.941);

  vec3 col = cream;
  col = mix(col, sky,    smoothstep(0.55, 0.05, d3));
  col = mix(col, cobalt, smoothstep(0.62, 0.08, d1) * 0.85);
  col = mix(col, orange, smoothstep(0.55, 0.06, d2) * 0.75);
  col = mix(col, sky,    0.12 + 0.08*sin(t + uv.x*3.0));

  // Soft vignette so content stays readable
  float vig = smoothstep(1.15, 0.35, length(uv - vec2(0.5)));
  col = mix(cream * 0.96, col, vig);

  gl_FragColor = vec4(col, 0.92);
}
`;function T(i){var F,A;const{canvas:o,reduced:R}=i;let d=!1,m=0;const e=o.getContext("webgl",{alpha:!0,antialias:!1,depth:!1,stencil:!1,powerPreference:"low-power"});if(!e)return(F=i.onReady)==null||F.call(i),()=>{};const v=(t,s)=>{const c=e.createShader(t);return e.shaderSource(c,s),e.compileShader(c),c},u=v(e.VERTEX_SHADER,L),f=v(e.FRAGMENT_SHADER,P),n=e.createProgram();e.attachShader(n,u),e.attachShader(n,f),e.linkProgram(n),e.useProgram(n);const h=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,h),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),e.STATIC_DRAW);const g=e.getAttribLocation(n,"a_pos");e.enableVertexAttribArray(g),e.vertexAttribPointer(g,2,e.FLOAT,!1,0,0);const b=e.getUniformLocation(n,"u_res"),E=e.getUniformLocation(n,"u_time"),p=e.getUniformLocation(n,"u_mouse");let r={x:.5,y:.5},a={x:.5,y:.5};const w=t=>{a.x=t.clientX/window.innerWidth,a.y=t.clientY/window.innerHeight};window.addEventListener("pointermove",w,{passive:!0});const l=()=>{const t=Math.min(window.devicePixelRatio||1,1.5),s=window.innerWidth,c=window.innerHeight;o.width=Math.floor(s*t),o.height=Math.floor(c*t),o.style.width=s+"px",o.style.height=c+"px",e.viewport(0,0,o.width,o.height)};l(),window.addEventListener("resize",l);let y=!0;const x=()=>{y=document.visibilityState==="visible"};document.addEventListener("visibilitychange",x);const S=performance.now(),_=()=>{if(d||(m=requestAnimationFrame(_),!y))return;r.x+=(a.x-r.x)*.06,r.y+=(a.y-r.y)*.06;const t=R?0:(performance.now()-S)/1e3;e.uniform2f(b,o.width,o.height),e.uniform1f(E,t),e.uniform2f(p,r.x,r.y),e.drawArrays(e.TRIANGLE_STRIP,0,4)};return _(),(A=i.onReady)==null||A.call(i),()=>{d=!0,cancelAnimationFrame(m),window.removeEventListener("pointermove",w),window.removeEventListener("resize",l),document.removeEventListener("visibilitychange",x),e.deleteProgram(n),e.deleteShader(u),e.deleteShader(f),e.deleteBuffer(h);const t=e.getExtension("WEBGL_lose_context");t==null||t.loseContext()}}export{T as mountGradientShader};
