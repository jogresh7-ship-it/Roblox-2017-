/* ================= BLOX ENGINE ADD-ONS: particles, sky, lighting ================= */
function makeSprite(){const c=document.createElement("canvas");c.width=c.height=64;const x=c.getContext("2d");const g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,"rgba(255,255,255,1)");g.addColorStop(.4,"rgba(255,255,255,.6)");g.addColorStop(1,"rgba(255,255,255,0)");x.fillStyle=g;x.fillRect(0,0,64,64);return new THREE.CanvasTexture(c)}
/* Pooled GPU particle system: one draw call per blend mode */
function makeParticles(scene,N=1500){const T=THREE,tex=makeSprite();
 const pool=add=>{const geo=new T.BufferGeometry();const pos=new Float32Array(N*3),col=new Float32Array(N*3),size=new Float32Array(N),alpha=new Float32Array(N);
  geo.setAttribute("position",new T.BufferAttribute(pos,3));geo.setAttribute("color",new T.BufferAttribute(col,3));geo.setAttribute("size",new T.BufferAttribute(size,1));geo.setAttribute("alpha",new T.BufferAttribute(alpha,1));
  const mat=new T.ShaderMaterial({uniforms:{map:{value:tex},scale:{value:innerHeight/2}},transparent:true,depthWrite:false,blending:add?T.AdditiveBlending:T.NormalBlending,
   vertexShader:"attribute float size;attribute float alpha;attribute vec3 color;varying vec3 vC;varying float vA;uniform float scale;void main(){vC=color;vA=alpha;vec4 mv=modelViewMatrix*vec4(position,1.0);gl_PointSize=size*scale/max(.1,-mv.z);gl_Position=projectionMatrix*mv;}",
   fragmentShader:"uniform sampler2D map;varying vec3 vC;varying float vA;void main(){vec4 t=texture2D(map,gl_PointCoord);if(t.a*vA<.01)discard;gl_FragColor=vec4(vC,t.a*vA);}"});
  const pts=new T.Points(geo,mat);pts.frustumCulled=false;scene.add(pts);
  const P=Array.from({length:N},()=>({life:0,max:1,x:0,y:-999,z:0,vx:0,vy:0,vz:0,g:0,drag:0,s0:1,s1:1,r:1,gg:1,b:1,a0:1}));return{geo,mat,P,next:0}};
 const pools={add:pool(true),norm:pool(false)};let mult=1;
 function spawn(blend,o){const pl=pools[blend];const p=pl.P[pl.next];pl.next=(pl.next+1)%N;Object.assign(p,{life:o.life,max:o.life,x:o.x,y:o.y,z:o.z,vx:o.vx||0,vy:o.vy||0,vz:o.vz||0,g:o.g||0,drag:o.drag||0,s0:o.s0,s1:o.s1??o.s0,r:o.c[0],gg:o.c[1],b:o.c[2],a0:o.a??1})}
 const R=Math.random,rs=s=>(R()-.5)*2*s;
 const FX={
  dust:(p,n=10)=>{for(let i=0;i<n;i++)spawn("norm",{x:p.x+rs(1),y:p.y+.2,z:p.z+rs(1),vx:rs(4),vy:1+R()*2,vz:rs(4),drag:2.5,life:.6+R()*.4,s0:.8,s1:2.2,c:[.78,.76,.72],a:.55})},
  boom:p=>{for(let i=0;i<70;i++){const a=R()*6.28,e=R()*1.4-.2,s=8+R()*22;spawn("add",{x:p.x,y:p.y,z:p.z,vx:Math.cos(a)*Math.cos(e)*s,vy:Math.sin(e)*s+4,vz:Math.sin(a)*Math.cos(e)*s,drag:3,g:-6,life:.35+R()*.45,s0:2.6,s1:.4,c:R()<.5?[1,.75,.2]:[1,.35,.05]})}
   for(let i=0;i<40;i++)spawn("norm",{x:p.x+rs(2),y:p.y+rs(1),z:p.z+rs(2),vx:rs(6),vy:3+R()*6,vz:rs(6),drag:1.5,life:1.2+R()*1.2,s0:2,s1:6,c:[.35,.35,.37],a:.5})},
  sparks:(p,c=[1,.9,.4],n=14)=>{for(let i=0;i<n;i++)spawn("add",{x:p.x,y:p.y,z:p.z,vx:rs(10),vy:R()*10,vz:rs(10),g:30,drag:1,life:.3+R()*.3,s0:.5,s1:.1,c})},
  splat:(p,c)=>{for(let i=0;i<16;i++)spawn("norm",{x:p.x,y:p.y,z:p.z,vx:rs(7),vy:R()*7,vz:rs(7),g:40,life:.4+R()*.3,s0:.6,s1:.3,c})},
  forcefield:p=>{for(let i=0;i<3;i++){const a=R()*6.28,h=R()*5.2;spawn("add",{x:p.x+Math.cos(a)*1.8,y:p.y+h,z:p.z+Math.sin(a)*1.8,vy:1.5,life:.6+R()*.5,s0:.7,s1:.05,c:[.3,.55,1]})}},
  badge:p=>{for(let i=0;i<50;i++)spawn("add",{x:p.x+rs(1.5),y:p.y+3+rs(1.5),z:p.z+rs(1.5),vx:rs(6),vy:4+R()*8,vz:rs(6),g:10,drag:.6,life:1+R()*.8,s0:.7,s1:.1,c:R()<.5?[1,.85,.2]:[1,1,1]})},
  smoke:(p,n=1)=>{for(let i=0;i<n;i++)spawn("norm",{x:p.x+rs(.2),y:p.y,z:p.z+rs(.2),vx:rs(.6),vy:1+R(),vz:rs(.6),drag:.5,life:1+R()*.6,s0:.6,s1:2,c:[.5,.5,.52],a:.4})}};
 return{emit(kind,pos,...a){if(R()>Math.max(.15,mult))return;FX[kind]&&FX[kind](pos,...a)},setQuality(q){mult=q/10},
  update(dt){for(const k in pools){const pl=pools[k],g=pl.geo,pos=g.attributes.position.array,col=g.attributes.color.array,sz=g.attributes.size.array,al=g.attributes.alpha.array;pl.mat.uniforms.scale.value=innerHeight/2;
   for(let i=0;i<N;i++){const p=pl.P[i];if(p.life<=0){al[i]=0;continue}p.life-=dt;const t=1-Math.max(0,p.life)/p.max,dr=Math.exp(-p.drag*dt);p.vx*=dr;p.vz*=dr;p.vy=p.vy*dr-p.g*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.z+=p.vz*dt;
    pos[i*3]=p.x;pos[i*3+1]=p.y;pos[i*3+2]=p.z;col[i*3]=p.r;col[i*3+1]=p.gg;col[i*3+2]=p.b;sz[i]=p.s0+(p.s1-p.s0)*t;al[i]=p.a0*(t<.1?t/.1:1-(t-.1)/.9)}
   for(const n of["position","color","size","alpha"])g.attributes[n].needsUpdate=true}}}}
/* Gradient sky dome with a sun disc, drawn behind everything */
function makeSky(scene){const T=THREE;const m=new T.ShaderMaterial({side:T.BackSide,depthWrite:false,fog:false,uniforms:{sunDir:{value:new T.Vector3(.4,.75,.3).normalize()}},
 vertexShader:"varying vec3 vD;void main(){vD=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}",
 fragmentShader:"varying vec3 vD;uniform vec3 sunDir;void main(){float h=clamp(vD.y,-.2,1.);vec3 top=vec3(.24,.52,.86),hor=vec3(.72,.85,.97),gnd=vec3(.55,.6,.65);vec3 c=h>0.?mix(hor,top,pow(h,.55)):mix(hor,gnd,-h*4.);float s=max(dot(vD,sunDir),0.);c+=vec3(1.,.95,.8)*(pow(s,800.)*1.5+pow(s,12.)*.18);gl_FragColor=vec4(c,1.);}"});
 const sky=new T.Mesh(new T.SphereGeometry(1500,32,16),m);sky.renderOrder=-1;scene.add(sky);return sky}
