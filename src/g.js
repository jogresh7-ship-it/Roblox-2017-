/* ================= ANIMATED R6 MODEL (GLTF) ================= */
// Model: "R6 Roblox Noob [Animated]" by Fog (sketchfab.com/fog_), CC-BY-4.0
let NOOB=null;
function loadNoob(){if(NOOB||!window.THREE||!THREE.GLTFLoader||!THREE.SkeletonUtils)return;
 try{new THREE.GLTFLoader().parse(NOOB_GLTF,"",gl=>{const T=THREE;const wrap=new T.Group();const inner=gl.scene;wrap.add(inner);
   inner.rotation.y=Math.PI;
   // measure the real skinned pose (Idle) so the feet sit exactly on the ground
   const idle=gl.animations.find(x=>/Idle$/.test(x.name));const mx=new T.AnimationMixer(inner);if(idle){mx.clipAction(idle).play();mx.update(.01)}
   const meas=()=>{inner.updateMatrixWorld(true);let lo=1e9,hi=-1e9;const v=new T.Vector3();inner.traverse(o=>{if(o.isSkinnedMesh){o.skeleton.update();const p=o.geometry.attributes.position;for(let i=0;i<p.count;i+=3){v.fromBufferAttribute(p,i);if(o.boneTransform)o.boneTransform(i,v);v.applyMatrix4(o.matrixWorld);lo=Math.min(lo,v.y);hi=Math.max(hi,v.y)}}});return[lo,hi]};
   let [lo,hi]=meas();const s=5.1/((hi-lo)||1);inner.scale.multiplyScalar(s);[lo,hi]=meas();inner.position.y-=lo;mx.stopAllAction();mx.uncacheRoot(inner);
   let img=null;inner.traverse(o=>{if(o.isMesh&&o.material.map)img=o.material.map.image});
   NOOB={wrap,anims:gl.animations,img};onNoobReady();},e=>console.warn("model failed",e))}catch(e){console.warn(e)}}
const texCache={};
function noobTexture(head,torso,legs,face){const k=head+torso+legs+(face||"");if(texCache[k])return texCache[k];const img=NOOB.img;const c=document.createElement("canvas");c.width=img.width;c.height=img.height;const x=c.getContext("2d");x.drawImage(img,0,0);
 const d=x.getImageData(0,0,c.width,c.height),p=d.data;const hx=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];const H=hx(head),Tt=hx(torso),L=hx(legs);
 const near=(i,r,g,b)=>Math.abs(p[i]-r)+Math.abs(p[i+1]-g)+Math.abs(p[i+2]-b)<40;
 for(let i=0;i<p.length;i+=4){let t=null;if(near(i,245,205,48))t=H;else if(near(i,13,105,172))t=Tt;else if(near(i,164,189,71))t=L;if(t){p[i]=t[0];p[i+1]=t[1];p[i+2]=t[2]}}
 x.putImageData(d,0,0);
 if(face&&AEL[face]){/* front of the head on this model's texture: u 935-985, v 409-487, stored upside-down */const fx=932,fy=405,fw=56,fh=86;x.fillStyle=head;x.fillRect(fx,fy,fw,fh);const s=Math.min(fw,fh*0.8);x.save();x.translate(fx+fw/2,fy+fh/2);x.scale(1,-1);x.drawImage(AEL[face],-s/2,-s/2,s,s);x.restore()}const tx=new THREE.CanvasTexture(c);tx.flipY=false;return texCache[k]=tx}
function makeNoob(colors,items){const T=THREE;const it=eqItems(items);const by=s=>it.find(x=>x.sub==s);const shirt=by("Shirts")||by("Packages"),pants=by("Pants")||by("Packages");
 const m=T.SkeletonUtils.clone(NOOB.wrap);const fc=by("Faces");const tex=noobTexture(colors.head,shirt?shirt.color:colors.torso,pants?pants.color:colors.ll,fc&&fc.faceImg&&AEL[fc.faceImg]?fc.faceImg:"");
 let skin=null;const bones={};m.traverse(o=>{if(o.isSkinnedMesh)skin=o;if(o.isMesh){o.material=o.material.clone();o.material.map=tex;o.castShadow=true;o.frustumCulled=false}if(o.isBone||/_0\d|_end/.test(o.name))bones[o.name]=o});
 const find=n=>Object.values(bones).find(b=>b.name.startsWith(n));
 const mixer=new T.AnimationMixer(m);const acts={};NOOB.anims.forEach(a=>{acts[a.name.split("|").pop()]=mixer.clipAction(a)});
 m.userData={skinned:true,skin,mixer,acts,cur:null,last:performance.now(),colors:{head:colors.head,torso:shirt?shirt.color:colors.torso,arm:colors.la,leg:pants?pants.color:colors.ll},
  bones:{head:find("Head_01"),headEnd:find("Head_end"),ra:find("Right Arm_end")||find("Right Arm"),torso:find("Torso"),la:find("Left Arm_end"),ll:find("Left Leg_end"),rl:find("Right Leg_end")},att:[]};
 m.userData.ra=new T.Group();m.add(m.userData.ra); // tool holder that follows the right hand
 const hatHolder=new T.Group();m.add(hatHolder);m.userData.hat=hatHolder;
 it.filter(x=>x.top=="Accessories"&&!x.acc).forEach(h=>{let g;const M=new T.MeshLambertMaterial({color:h.color});if(h.sub=="Hats"){g=new T.Mesh(new T.BoxGeometry(1.4,.6,1.4),M);g.position.y=.9}else if(h.sub=="Hair"){g=new T.Mesh(new T.BoxGeometry(1.3,.4,1.3),M);g.position.y=.7}else if(h.sub=="Face"){g=new T.Mesh(new T.BoxGeometry(1,.25,.1),new T.MeshLambertMaterial({color:0x111111}));g.position.set(0,.15,-.62)}else if(h.sub=="Back"){g=new T.Mesh(new T.BoxGeometry(2.4,1.6,.2),M);g.position.set(0,-1.3,.6)}else{g=new T.Mesh(new T.BoxGeometry(.5,.5,.5),M);g.position.set(.6,-.6,0)}g.castShadow=true;hatHolder.add(g)});
 addAccessories(m,items,window._accOpts||{});noobPlay(m,"Idle");return m}
function noobPlay(m,name){const u=m.userData;if(u.cur==name||!u.acts[name])return;const a=u.acts[name];a.reset();a.setLoop(name=="Jump"?THREE.LoopOnce:THREE.LoopRepeat);a.clampWhenFinished=true;a.play();if(u.cur&&u.acts[u.cur])a.crossFadeFrom(u.acts[u.cur],.25,true);u.cur=name}
const _v=()=>new THREE.Vector3();
function noobAnim(m,moving,ground,emote,sw,tool){const u=m.userData;const t=performance.now();const dt=Math.min(.1,(t-u.last)/1000);u.last=t;
 let a=!ground?(u.vy>0?"Jump":"Fall"):moving?(u.speed>20?"RunAnim":"WalkAnim"):emote=="dance"?"Idle2":(emote=="wave"||emote=="point"||emote=="cheer"||tool||sw)?"Tool":"Idle";
 noobPlay(m,a);u.mixer.update(dt*(a=="WalkAnim"?1.4:1));if(emote=="dance")m.rotation.y+=.05;
 m.updateMatrixWorld(true);const inv=new THREE.Matrix4().copy(m.matrixWorld).invert();
 if(u.bones.headEnd||u.bones.head){const p=(u.bones.head||u.bones.headEnd).getWorldPosition(_v()).applyMatrix4(inv);u.hat.position.copy(p)}
 if(u.bones.ra){const p=u.bones.ra.getWorldPosition(_v()).applyMatrix4(inv);u.ra.position.copy(p);u.ra.rotation.x=sw?-Math.sin(sw*Math.PI)*1.4:0}}
function noobBreak(m,scene,debris){const T=THREE,u=m.userData,sk=u.skin;m.updateMatrixWorld(true);const ctr=m.position.clone().add(new T.Vector3(0,2.5,0));
 const launch=(mesh,h)=>{const out=mesh.position.clone().sub(ctr);out.y=0;if(out.length()<.01)out.set(Math.random()-.5,0,Math.random()-.5);out.normalize().multiplyScalar(2+Math.random()*3);out.x+=(Math.random()-.5)*2;out.z+=(Math.random()-.5)*2;
  scene.add(mesh);debris.push({m:mesh,h,v:new T.Vector3(out.x,4+Math.random()*5,out.z),r:new T.Vector3((Math.random()-.5)*8,(Math.random()-.5)*8,(Math.random()-.5)*8),t:now()})};
 if(sk&&sk.boneTransform){sk.skeleton.update();const geo=sk.geometry,P=geo.attributes.position,UV=geo.attributes.uv,SI=geo.attributes.skinIndex,SW=geo.attributes.skinWeight,ID=geo.index;
  const n=P.count,bk=new Float32Array(n*3),dom=new Int16Array(n),v=new T.Vector3();
  for(let i=0;i<n;i++){v.fromBufferAttribute(P,i);sk.boneTransform(i,v);v.applyMatrix4(sk.matrixWorld);bk[i*3]=v.x;bk[i*3+1]=v.y;bk[i*3+2]=v.z;let b=0,w=-1;for(let k=0;k<4;k++){const ww=SW.getComponent(i,k);if(ww>w){w=ww;b=SI.getComponent(i,k)}}dom[i]=b}
  const parts={};const tri=ID?ID.count/3:n/3;for(let t=0;t<tri;t++){const a=ID?ID.getX(t*3):t*3,b=ID?ID.getX(t*3+1):t*3+1,c=ID?ID.getX(t*3+2):t*3+2;const j=dom[a];const pp=parts[j]||(parts[j]={p:[],uv:[]});for(const q of[a,b,c]){pp.p.push(bk[q*3],bk[q*3+1],bk[q*3+2]);if(UV)pp.uv.push(UV.getX(q),UV.getY(q))}}
  for(const j in parts){const pp=parts[j];const bg=new T.BufferGeometry();bg.setAttribute("position",new T.Float32BufferAttribute(pp.p,3));if(pp.uv.length)bg.setAttribute("uv",new T.Float32BufferAttribute(pp.uv,2));bg.computeBoundingBox();const c=new T.Vector3();bg.boundingBox.getCenter(c);bg.translate(-c.x,-c.y,-c.z);bg.computeVertexNormals();bg.computeBoundingSphere();
   const mesh=new T.Mesh(bg,new T.MeshLambertMaterial({map:sk.material.map,side:T.DoubleSide}));mesh.castShadow=true;mesh.position.copy(c);launch(mesh,bg.boundingSphere.radius*.6)}}
 else{[[1.2,1.2,1.2,u.colors.head,4.6,0],[2,2,1,u.colors.torso,3,0],[1,2,1,u.colors.arm,3,-1.5],[1,2,1,u.colors.arm,3,1.5],[1,2,1,u.colors.leg,1,-.5],[1,2,1,u.colors.leg,1,.5]].forEach(([a,b,c,col,y,x])=>{const mesh=new T.Mesh(new T.BoxGeometry(a,b,c),new T.MeshLambertMaterial({color:col}));mesh.position.set(m.position.x+x,m.position.y+y,m.position.z);launch(mesh,b/2)})}
 [u.hat,u.ra].forEach(hold=>hold&&hold.children.slice().forEach(ch=>{const wp=ch.getWorldPosition(new T.Vector3());const cl=ch.clone();cl.position.copy(wp);launch(cl,.4)}));
 m.visible=false}

/* offscreen renderer: every avatar picture on the site is a render of the model */
const AVPH="data:image/svg+xml;charset=utf-8,"+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><rect width="10" height="10" fill="#dfe3e6"/></svg>');
const avCache={};let AVR=null;
function renderAvatar(o){if(!NOOB||!window.THREE)return AVPH;const key=JSON.stringify([!!o.thumb,Object.values(accTex).filter(t=>t.ok).length,o.model||S.bodyModel,(modelById(o.model||S.bodyModel)||{})._ready?1:0,o.colors,o.items,!!o.head,o.bg||""]);if(avCache[key])return avCache[key];
 try{const T=THREE;if(!AVR){const r=new T.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true});r.setSize(300,300,false);const sc=new T.Scene();sc.add(new T.HemisphereLight(0xffffff,0x888888,.95));const d=new T.DirectionalLight(0xffffff,.55);d.position.set(-4,6,-8);sc.add(d);AVR={r,sc,cam:new T.PerspectiveCamera(30,1,.1,100)}}
  window._accOpts={thumb:!!o.thumb};const m=makeBody(o.model||S.bodyModel,o.colors,o.items||[]);window._accOpts={};m.rotation.y=.4;if(m.userData.skinned){m.userData.mixer.update(.6);m.updateMatrixWorld(true);noobAnim(m,false,true,null,0,false)}AVR.sc.add(m);
  const c=AVR.cam;if(o.head){c.position.set(-1.5,5.1,-6.6);c.lookAt(0,4.75,0)}else{c.position.set(-3,2.9,-12.5);c.lookAt(0,2.55,0)}
  AVR.r.setClearColor(o.bg||"#000000",o.bg?1:0);AVR.r.render(AVR.sc,c);const url=AVR.r.domElement.toDataURL("image/png");AVR.sc.remove(m);m.traverse(x=>{if(x.isMesh)x.material.dispose()});return avCache[key]=url}catch(e){console.warn(e);return AVPH}}
function onNoobReady(){for(const k in thumbCache)if(k[0]=="i")delete thumbCache[k];if(!GM&&!SD&&typeof route=="function")route();renderHeader()}

function onFaceAsset(){for(const k in avCache)delete avCache[k];for(const k in texCache)delete texCache[k];for(const k in thumbCache)if(k[0]=="i")delete thumbCache[k];clearTimeout(window._faT);window._faT=setTimeout(()=>{if(!GM&&!SD&&typeof route=="function")route()},150)}
/* ================= BODY MODELS =================
   "noob" = the animated glTF model (built in).
   Extra models come from assets/models/models.js (window.BLOX_MODELS): OBJ + texture,
   split into head/torso/arms/legs and animated per part. */
function objModels(){return window.BLOX_MODELS||[]}
function bodyModels(){return [{id:"noob",name:"Noob",rig:"R6",note:"Rigged + animated",_ready:!!NOOB}].concat(objModels().map(m=>Object.assign(m,{note:m.note||"Part-animated"})))}
function modelById(id){return bodyModels().find(m=>m.id==id)||bodyModels()[0]}
function loadObjModels(){objModels().forEach(m=>{if(m._img)return;const im=new Image();im.onload=()=>{m._ready=true;onFaceAsset()};im.src=encodeURI(m.tex);m._img=im})}
function objParts(m){if(m._parts)return m._parts;const T=THREE,V=[],VT=[],parts={head:[],torso:[],la:[],ra:[],ll:[],rl:[]};
 const sy=m.shoulderY||3.3,hy=m.hipY||1.9;
 for(const l of m.obj.split("\n")){const p=l.trim().split(/\s+/);if(p[0]=="v")V.push(p.slice(1,4).map(Number));else if(p[0]=="vt")VT.push(p.slice(1,3).map(Number));else if(p[0]=="f"){const ix=p.slice(1).map(t=>t.split("/").map(n=>parseInt(n)-1));
   for(let k=1;k<ix.length-1;k++){const tri=[ix[0],ix[k],ix[k+1]];const c=[0,1,2].map(a=>tri.reduce((s,q)=>s+V[q[0]][a],0)/3);
    const part=Math.abs(c[0])>1.02&&c[1]>hy-.3?(c[0]>0?"la":"ra"):c[1]>sy+.5&&Math.abs(c[0])<.9?"head":c[1]<hy?(c[0]>0?"ll":"rl"):"torso";parts[part].push(tri)}}}
 const piv={head:[0,sy+.6,0],torso:[0,0,0],la:[1.32,sy,0],ra:[-1.32,sy,0],ll:[.5,hy,0],rl:[-.5,hy,0]};const out={};
 for(const k in parts){if(!parts[k].length)continue;const pos=[],uv=[];for(const tri of parts[k])for(const q of tri){const v=V[q[0]];pos.push(v[0]-piv[k][0],v[1]-piv[k][1],v[2]-piv[k][2]);const t=VT[q[1]]||[0,0];uv.push(t[0],t[1])}
  const g=new T.BufferGeometry();g.setAttribute("position",new T.Float32BufferAttribute(pos,3));g.setAttribute("uv",new T.Float32BufferAttribute(uv,2));g.computeVertexNormals();out[k]={g,p:piv[k]}}
 return m._parts=out}
const objTexCache={};
function objTexture(m,faceKey){const k=m.id+"|"+(faceKey||"");if(objTexCache[k])return objTexCache[k];const im=m._img,c=document.createElement("canvas");c.width=im.width;c.height=im.height;const x=c.getContext("2d");x.drawImage(im,0,0);
 if(faceKey&&AEL[faceKey]&&m.faceRect){const[fx,fy,fw,fh]=m.faceRect,sx=im.width/1024,sy2=im.height/1024;const p=x.getImageData(Math.round((fx-20)*sx),Math.round((fy-20)*sy2),1,1).data;x.fillStyle=`rgb(${p[0]},${p[1]},${p[2]})`;x.fillRect(fx*sx,fy*sy2,fw*sx,fh*sy2);x.drawImage(AEL[faceKey],fx*sx,fy*sy2,fw*sx,fh*sy2)}
 const t=new THREE.CanvasTexture(c);return objTexCache[k]=t}
function makeObjChar(m,colors,items){const T=THREE,parts=objParts(m),it=eqItems(items),fc=it.find(x=>x.sub=="Faces");const tex=objTexture(m,fc&&fc.faceImg);
 const outer=new T.Group(),grp=new T.Group();grp.rotation.y=Math.PI;outer.add(grp);const ud={skinned:false,model:m.id};
 const colOf={head:colors.head,torso:colors.torso,la:colors.la,ra:colors.ra,ll:colors.ll,rl:colors.rl};
 for(const k in parts){const piv=new T.Group();piv.position.set(...parts[k].p);const mat=new T.MeshLambertMaterial({map:tex});mat.color.set(colOf[k]||"#ffffff").multiplyScalar(1.25);const mesh=new T.Mesh(parts[k].g,mat);mesh.castShadow=true;piv.add(mesh);grp.add(piv);ud[k]=piv}
 ['la','ra','ll','rl','head','torso'].forEach(k=>{if(!ud[k]){ud[k]=new T.Group();grp.add(ud[k])}});
 it.filter(x=>x.top=="Accessories"&&!x.acc).forEach(h=>{const b=new T.Mesh(new T.BoxGeometry(1.4,.6,1.4),new T.MeshLambertMaterial({color:h.color}));b.position.y=.9;ud.head.add(b)});
 outer.userData=ud;addAccessories(outer,items,window._accOpts||{});return outer}
function makeBody(id,colors,items){const m=modelById(id);if(m&&m.id!="noob"&&m._ready)return makeObjChar(m,colors,items);return makeNoob(colors,items)}
setTimeout(loadObjModels,0);

/* ================= OBJ ACCESSORIES (hats, hair, back, carpet gear) ================= */
const accGeo={},accTex={};
function accReady(a){if(!accTex[a.tex]){const im=new Image();accTex[a.tex]={im,ok:false,t:null};im.onload=()=>{accTex[a.tex].ok=true;const t=new THREE.CanvasTexture(im);accTex[a.tex].t=t;onFaceAsset()};im.src=encodeURI(a.tex)}return accTex[a.tex].ok}
function accGeometry(key){if(accGeo[key])return accGeo[key];const src=(window.BLOX_ACCESSORY_OBJS||{})[key];if(!src)return null;const V=[],VT=[],pos=[],uv=[];
 for(const l of src.split("\n")){const p=l.trim().split(/\s+/);if(p[0]=="v")V.push(p.slice(1,4).map(Number));else if(p[0]=="vt")VT.push(p.slice(1,3).map(Number));else if(p[0]=="f"){const ix=p.slice(1).map(t=>t.split("/").map(n=>parseInt(n)-1));for(let k=1;k<ix.length-1;k++)for(const q of[ix[0],ix[k],ix[k+1]]){const v=V[q[0]];pos.push(v[0],v[1],v[2]);const t=VT[q[1]]||[0,0];uv.push(t[0],t[1])}}}
 const g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.Float32BufferAttribute(pos,3));g.setAttribute("uv",new THREE.Float32BufferAttribute(uv,2));g.computeVertexNormals();return accGeo[key]=g}
function accMesh(a){accReady(a);const g=accGeometry(a.obj);if(!g)return null;const t=accTex[a.tex];const m=new THREE.Mesh(g,new THREE.MeshLambertMaterial({map:t&&t.t||null,color:t&&t.t?0xffffff:0x999999,side:THREE.DoubleSide}));m.castShadow=true;return m}
const HEAD_C=4.45,TORSO_C=3.0;
function addAccessories(root,items,opts={}){eqItems(items).forEach(it=>{const a=it.acc;if(!a)return;if(a.attach=="carpet"&&!opts.thumb)return;const m=accMesh(a);if(!m)return;const o=a.offset||[0,0,0];
 if(a.attach=="head")m.position.set(o[0],HEAD_C+o[1],o[2]);else if(a.attach=="back")m.position.set(o[0],TORSO_C+o[1],o[2]);else m.position.set(0,.05,0);m.userData.acc=1;root.add(m)})}
