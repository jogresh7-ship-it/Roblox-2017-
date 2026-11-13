/* ================= ANIMATED R6 MODEL (GLTF) ================= */
// Model: "R6 Roblox Noob [Animated]" by Fog (sketchfab.com/fog_), CC-BY-4.0
let NOOB=null;
function loadNoob(){if(NOOB||!window.THREE||!THREE.GLTFLoader||!THREE.SkeletonUtils)return;
 try{new THREE.GLTFLoader().parse(NOOB_GLTF,"",gl=>{const T=THREE;const wrap=new T.Group();const inner=gl.scene;wrap.add(inner);
   inner.updateMatrixWorld(true);const by=n=>{let f=null;inner.traverse(o=>{if(!f&&o.name.startsWith(n))f=o});return f};const hb=by("Head_end"),lb=by("Left Leg_end"),rb=by("Right Leg_end");let top,bot;
   if(hb&&lb&&rb){top=hb.getWorldPosition(new T.Vector3()).y;bot=Math.min(lb.getWorldPosition(new T.Vector3()).y,rb.getWorldPosition(new T.Vector3()).y)}if(!(top>bot)){const bb=new T.Box3().setFromObject(inner);top=bb.max.y;bot=bb.min.y}
   const s=5.1/((top-bot)||1);inner.scale.multiplyScalar(s);inner.position.y=-bot*s;inner.rotation.y=Math.PI;
   let img=null;inner.traverse(o=>{if(o.isMesh&&o.material.map)img=o.material.map.image});
   NOOB={wrap,anims:gl.animations,img};onNoobReady();},e=>console.warn("model failed",e))}catch(e){console.warn(e)}}
const texCache={};
function noobTexture(head,torso,legs){const k=head+torso+legs;if(texCache[k])return texCache[k];const img=NOOB.img;const c=document.createElement("canvas");c.width=img.width;c.height=img.height;const x=c.getContext("2d");x.drawImage(img,0,0);
 const d=x.getImageData(0,0,c.width,c.height),p=d.data;const hx=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];const H=hx(head),Tt=hx(torso),L=hx(legs);
 const near=(i,r,g,b)=>Math.abs(p[i]-r)+Math.abs(p[i+1]-g)+Math.abs(p[i+2]-b)<40;
 for(let i=0;i<p.length;i+=4){let t=null;if(near(i,245,205,48))t=H;else if(near(i,13,105,172))t=Tt;else if(near(i,164,189,71))t=L;if(t){p[i]=t[0];p[i+1]=t[1];p[i+2]=t[2]}}
 x.putImageData(d,0,0);const tx=new THREE.CanvasTexture(c);tx.flipY=false;return texCache[k]=tx}
function makeNoob(colors,items){const T=THREE;const it=eqItems(items);const by=s=>it.find(x=>x.sub==s);const shirt=by("Shirts")||by("Packages"),pants=by("Pants")||by("Packages");
 const m=T.SkeletonUtils.clone(NOOB.wrap);const tex=noobTexture(colors.head,shirt?shirt.color:colors.torso,pants?pants.color:colors.ll);
 const bones={};m.traverse(o=>{if(o.isMesh){o.material=o.material.clone();o.material.map=tex;o.castShadow=true;o.frustumCulled=false}if(o.isBone||/_0\d|_end/.test(o.name))bones[o.name]=o});
 const find=n=>Object.values(bones).find(b=>b.name.startsWith(n));
 const mixer=new T.AnimationMixer(m);const acts={};NOOB.anims.forEach(a=>{acts[a.name.split("|").pop()]=mixer.clipAction(a)});
 m.userData={skinned:true,mixer,acts,cur:null,last:performance.now(),colors:{head:colors.head,torso:shirt?shirt.color:colors.torso,arm:colors.la,leg:pants?pants.color:colors.ll},
  bones:{head:find("Head_01"),headEnd:find("Head_end"),ra:find("Right Arm_end")||find("Right Arm"),torso:find("Torso"),la:find("Left Arm_end"),ll:find("Left Leg_end"),rl:find("Right Leg_end")},att:[]};
 m.userData.ra=new T.Group();m.add(m.userData.ra); // tool holder that follows the right hand
 const hatHolder=new T.Group();m.add(hatHolder);m.userData.hat=hatHolder;
 it.filter(x=>x.top=="Accessories").forEach(h=>{let g;const M=new T.MeshLambertMaterial({color:h.color});if(h.sub=="Hats"){g=new T.Mesh(new T.BoxGeometry(1.4,.6,1.4),M);g.position.y=.9}else if(h.sub=="Hair"){g=new T.Mesh(new T.BoxGeometry(1.3,.4,1.3),M);g.position.y=.7}else if(h.sub=="Face"){g=new T.Mesh(new T.BoxGeometry(1,.25,.1),new T.MeshLambertMaterial({color:0x111111}));g.position.set(0,.15,-.62)}else if(h.sub=="Back"){g=new T.Mesh(new T.BoxGeometry(2.4,1.6,.2),M);g.position.set(0,-1.3,.6)}else{g=new T.Mesh(new T.BoxGeometry(.5,.5,.5),M);g.position.set(.6,-.6,0)}g.castShadow=true;hatHolder.add(g)});
 noobPlay(m,"Idle");return m}
function noobPlay(m,name){const u=m.userData;if(u.cur==name||!u.acts[name])return;const a=u.acts[name];a.reset();a.setLoop(name=="Jump"?THREE.LoopOnce:THREE.LoopRepeat);a.clampWhenFinished=true;a.play();if(u.cur&&u.acts[u.cur])a.crossFadeFrom(u.acts[u.cur],.15,false);u.cur=name}
const _v=()=>new THREE.Vector3();
function noobAnim(m,moving,ground,emote,sw,tool){const u=m.userData;const t=performance.now();const dt=Math.min(.1,(t-u.last)/1000);u.last=t;
 let a=!ground?(u.vy>0?"Jump":"Fall"):moving?(u.speed>20?"RunAnim":"WalkAnim"):emote=="dance"?"Idle2":(emote=="wave"||emote=="point"||emote=="cheer"||tool||sw)?"Tool":"Idle";
 noobPlay(m,a);u.mixer.update(dt*(a=="WalkAnim"?1.4:1));if(emote=="dance")m.rotation.y+=.05;
 m.updateMatrixWorld(true);const inv=new THREE.Matrix4().copy(m.matrixWorld).invert();
 if(u.bones.headEnd||u.bones.head){const p=(u.bones.head||u.bones.headEnd).getWorldPosition(_v()).applyMatrix4(inv);u.hat.position.copy(p)}
 if(u.bones.ra){const p=u.bones.ra.getWorldPosition(_v()).applyMatrix4(inv);u.ra.position.copy(p);u.ra.rotation.x=sw?-Math.sin(sw*Math.PI)*1.4:0}}
function noobBreak(m,scene,debris){const T=THREE,u=m.userData;m.updateMatrixWorld(true);const base=m.position.clone();
 [["head",[1.2,1.2,1.2],u.colors.head,4.6],["torso",[2,2,1],u.colors.torso,3],["la",[1,2,1],u.colors.arm,3],["ra",[1,2,1],u.colors.arm,3],["ll",[1,2,1],u.colors.leg,1],["rl",[1,2,1],u.colors.leg,1]].forEach(([k,s,c,y],i)=>{
  const b=new T.Mesh(new T.BoxGeometry(...s),new T.MeshLambertMaterial({color:c}));const bn=u.bones[k];if(bn&&k!="ra"&&k!="la"&&k!="ll"&&k!="rl")bn.getWorldPosition(b.position);else b.position.set(base.x+(i==2?-1.5:i==3?1.5:i==4?-.5:i==5?.5:0),base.y+y,base.z);
  b.rotation.y=m.rotation.y;scene.add(b);debris.push({m:b,v:new T.Vector3((Math.random()-.5)*14,8+Math.random()*8,(Math.random()-.5)*14),r:new T.Vector3(Math.random()*5,Math.random()*5,0),t:now()})});m.visible=false}

/* offscreen renderer: every avatar picture on the site is a render of the model */
const AVPH="data:image/svg+xml;charset=utf-8,"+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><rect width="10" height="10" fill="#dfe3e6"/></svg>');
const avCache={};let AVR=null;
function renderAvatar(o){if(!NOOB||!window.THREE)return AVPH;const key=JSON.stringify([o.colors,o.items,!!o.head,o.bg||""]);if(avCache[key])return avCache[key];
 try{const T=THREE;if(!AVR){const r=new T.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true});r.setSize(300,300,false);const sc=new T.Scene();sc.add(new T.HemisphereLight(0xffffff,0x888888,.95));const d=new T.DirectionalLight(0xffffff,.55);d.position.set(-4,6,-8);sc.add(d);AVR={r,sc,cam:new T.PerspectiveCamera(30,1,.1,100)}}
  const m=makeNoob(o.colors,o.items||[]);m.rotation.y=.4;m.userData.mixer.update(.6);m.updateMatrixWorld(true);noobAnim(m,false,true,null,0,false);AVR.sc.add(m);
  const c=AVR.cam;if(o.head){c.position.set(-1.1,4.75,-4.6);c.lookAt(0,4.5,0)}else{c.position.set(-3,2.9,-12.5);c.lookAt(0,2.55,0)}
  AVR.r.setClearColor(o.bg||"#000000",o.bg?1:0);AVR.r.render(AVR.sc,c);const url=AVR.r.domElement.toDataURL("image/png");AVR.sc.remove(m);m.traverse(x=>{if(x.isMesh)x.material.dispose()});return avCache[key]=url}catch(e){console.warn(e);return AVPH}}
function onNoobReady(){for(const k in thumbCache)if(k[0]=="i")delete thumbCache[k];if(!GM&&!SD&&typeof route=="function")route();renderHeader()}
