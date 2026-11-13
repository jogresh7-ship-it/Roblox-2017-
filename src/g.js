/* ================= ANIMATED R6 MODEL (GLTF) ================= */
// Model: "R6 Roblox Noob [Animated]" by Fog (sketchfab.com/fog_), CC-BY-4.0
let NOOB=null;
function loadNoob(){if(NOOB||!window.THREE||!THREE.GLTFLoader||!THREE.SkeletonUtils)return;
 try{new THREE.GLTFLoader().parse(NOOB_GLTF,"",gl=>{const T=THREE;const wrap=new T.Group();const inner=gl.scene;wrap.add(inner);
   inner.updateMatrixWorld(true);const bb=new T.Box3().setFromObject(inner);const h=bb.max.y-bb.min.y||1;const s=5/h;inner.scale.multiplyScalar(s);inner.position.y=-bb.min.y*s;inner.rotation.y=Math.PI;
   let img=null;inner.traverse(o=>{if(o.isMesh&&o.material.map)img=o.material.map.image});
   NOOB={wrap,anims:gl.animations,img};},e=>console.warn("model failed",e))}catch(e){console.warn(e)}}
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
