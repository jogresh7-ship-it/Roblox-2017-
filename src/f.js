/* ================= IN-GAME CLIENT ================= */
let GM=null; // game state
function pagePlay(parts){const id=+parts[1];const g=gameById(id);if(!g)return page404();if(!window.THREE){$("#main").innerHTML=`<div class="wrap card"><h2>3D engine failed to load</h2><p>The game needs Three.js from cdnjs.cloudflare.com. Check your connection and reload.</p><button onclick="go('#/games/${id}')">Back</button></div>`;return null}
 if(GM&&GM.gid==id)return null;stopGame();loadNoob();
 if(!NOOB){let n=0;$("#main").innerHTML=`<div class="wrap card" style="text-align:center"><div class="spin"><i></i><i></i><i></i><i></i></div><p>Loading character model…</p></div>`;const iv=setInterval(()=>{n++;if(NOOB){clearInterval(iv);if(location.hash=="#/play/"+id)startGame(g)}else if(n>150){clearInterval(iv);$("#main").innerHTML=`<div class="wrap card"><h2>The character model couldn't load</h2><p>It needs the 3D loader from cdn.jsdelivr.net. Check your connection and reload.</p><button onclick="go('#/games/${id}')">Back</button></div>`}},100);return null}
 startGame(g);return null}
function stopGame(){if(!GM)return;GM.dead2=true;cancelAnimationFrame(GM.raf);clearInterval(GM.iv);GM.ren.dispose();document.removeEventListener("keydown",GM.kd);document.removeEventListener("keyup",GM.ku);window.removeEventListener("resize",GM.rs);try{document.exitPointerLock&&document.exitPointerLock()}catch(e){}$("#game").classList.remove("on");$("#game").innerHTML="";GM=null}
function leaveGame(){const id=GM.gid;stopGame();go("#/games/"+id)}
let AC=null;function sfx(kind){try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();const vol=S.settings.volume/100;if(!vol)return;const t=AC.currentTime,o=AC.createOscillator(),g=AC.createGain();o.connect(g);g.connect(AC.destination);
 if(kind=="oof"){o.type="sawtooth";o.frequency.setValueAtTime(260,t);o.frequency.exponentialRampToValueAtTime(110,t+.28);g.gain.setValueAtTime(.35*vol,t);g.gain.exponentialRampToValueAtTime(.001,t+.32);const f=AC.createBiquadFilter();f.type="lowpass";f.frequency.value=900;o.disconnect();o.connect(f);f.connect(g);o.start(t);o.stop(t+.33)}
 else{const m={jump:[500,800,.08],coin:[900,1400,.12],swing:[300,150,.1],boom:[80,30,.4],hit:[200,120,.08],badge:[600,1200,.4],shoot:[700,300,.06]}[kind]||[400,400,.1];o.type=kind=="boom"?"square":"triangle";o.frequency.setValueAtTime(m[0],t);o.frequency.exponentialRampToValueAtTime(m[1],t+m[2]);g.gain.setValueAtTime(.2*vol,t);g.gain.exponentialRampToValueAtTime(.001,t+m[2]+.02);o.start(t);o.stop(t+m[2]+.03)}}catch(e){}}
const NAMECOL=["#FD2943","#01A2FF","#02B857","#6B327C","#DA8541","#F5CD30","#E8BAC8","#D7C59A"];
const nameColor=n=>{let h=0;for(const c of n)h=(h*31+c.charCodeAt(0))|0;return NAMECOL[Math.abs(h)%8]};
const BADWORDS=["noob","stupid","dumb","idiot","scam","hate"];
const filt=t=>t.replace(new RegExp("\\b("+BADWORDS.join("|")+")\\b","gi"),m=>"#".repeat(m.length));
function studTex(){const c=document.createElement("canvas");c.width=c.height=64;const x=c.getContext("2d");x.fillStyle="#8c8f8d";x.fillRect(0,0,64,64);x.fillStyle="#9fa3a0";x.beginPath();x.arc(32,32,14,0,7);x.fill();x.strokeStyle="#6e716f";x.lineWidth=3;x.beginPath();x.arc(32,34,14,0.2,3);x.stroke();x.strokeStyle="#7a7d7b";x.strokeRect(0,0,64,64);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;return t}
function makeChar(colors,items,opts={}){const T=THREE;return makeNoob(colors,items);const grp=new T.Group();const it=eqItems(items);const by=s=>it.find(x=>x.sub==s);const shirt=by("Shirts")||by("Packages"),pants=by("Pants")||by("Packages"),tee=by("T-Shirts");
 const M=c=>new T.MeshLambertMaterial({color:c});const box=(w,h,d,c)=>{const m=new T.Mesh(new T.BoxGeometry(w,h,d),M(c));m.castShadow=true;return m};
 const torso=box(2,2,1,shirt?shirt.color:colors.torso);torso.position.y=3;grp.add(torso);
 if(tee){const d=box(.8,.8,.02,tee.color);d.position.set(0,3.2,-.51);grp.add(d)}
 const head=box(1.2,1.2,1.2,colors.head);head.position.y=4.6;grp.add(head);
 const fc=document.createElement("canvas");fc.width=fc.height=64;const fx=fc.getContext("2d");fx.fillStyle=colors.head;fx.fillRect(0,0,64,64);fx.fillStyle="#111";fx.fillRect(20,20,6,10);fx.fillRect(38,20,6,10);fx.lineWidth=4;fx.beginPath();fx.arc(32,34,12,.3,2.84);fx.stroke();
 const face=new T.Mesh(new T.PlaneGeometry(1.2,1.2),new T.MeshLambertMaterial({map:new T.CanvasTexture(fc)}));face.position.set(0,4.6,-.61);face.rotation.y=Math.PI;grp.add(face);
 it.filter(x=>x.top=="Accessories").forEach((h,k)=>{let m;if(h.sub=="Hats"){m=box(1.4,.6,1.4,h.color);m.position.y=5.5}else if(h.sub=="Hair"){m=box(1.3,.4,1.3,h.color);m.position.y=5.3}else if(h.sub=="Back"){m=box(2.4,1.6,.2,h.color);m.position.set(0,3.3,.6)}else if(h.sub=="Face"){m=box(1,.25,.1,"#111");m.position.set(0,4.75,-.65)}else{m=box(.5,.5,.5,h.color);m.position.set(.6,4,0)}grp.add(m)});
 const limb=(x,y,c,top)=>{const p=new T.Group();p.position.set(x,y,0);const m=box(1,2,1,c);m.position.y=-1;p.add(m);if(top){const s=box(1.02,1,1.02,top);s.position.y=-.5;p.add(s)}grp.add(p);return p};
 const la=limb(-1.5,4,colors.la,shirt&&shirt.color),ra=limb(1.5,4,colors.ra,shirt&&shirt.color),ll=limb(-.5,2,pants?pants.color:colors.ll),rl=limb(.5,2,pants?pants.color:colors.rl);
 grp.userData={la,ra,ll,rl,head,torso};return grp}
function startGame(g){const T=THREE;loadNoob();S.played.includes(g.id)||S.played.push(g.id);S.recent=[g.id,...S.recent.filter(x=>x!=g.id)].slice(0,20);save();
 const root=$("#game");root.classList.add("on");
 root.innerHTML=`<div id="loadscr"><span style="position:absolute;top:14px;right:18px;font-size:26px;cursor:pointer" id="lcancel">✕</span><img src="${gameThumb(g,150,150)}" style="border-radius:6px"><h2 class="gfont">${esc(g.name)}</h2><div>By ${esc((userById(g.creator)||meUser()).name)}</div><div class="spin"><i style="background:#fff"></i><i style="background:#fff"></i><i style="background:#fff"></i><i style="background:#fff"></i></div><div id="lstat">Requesting Server...</div></div>
 <div class="gtop"><div class="gbtn" id="bmenu" title="Menu"><svg width="18" height="18" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="4" fill="none" stroke="#fff" stroke-width="2.5"/><rect x="9" y="9" width="6" height="6" fill="#fff" transform="rotate(15 12 12)"/></svg></div><div class="gbtn" id="bchat">${ico("chat",18,"#fff")}<span id="cdot" style="display:none;position:absolute;top:3px;right:3px;width:7px;height:7px;border-radius:50%;background:#E2231A"></span></div><div class="gbtn" id="bbp">${ico("bp",18,"#fff")}</div><span class="spacer"></span><div style="padding-right:10px;cursor:pointer" id="bpl"><b>${esc(S.me.name)}</b> <span class="small" style="opacity:.7">${S.me.bc?"Builders Club":"Account: 13+"}</span></div></div>
 <div id="gchat"><div class="lines" id="clines"></div><input id="cin2" maxlength="200" placeholder='To chat click here or press "/" key'></div>
 <div id="plist"></div><div id="hotbar"></div><div id="hp"><div></div></div><div id="vign"></div><div id="perf"></div><div id="badgepop"></div>
 <svg id="xhair" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" fill="none" stroke="#fff" stroke-width="2"/><path d="M12 2v5M12 17v5M2 12h5M17 12h5" stroke="#fff" stroke-width="2"/></svg>
 <div id="stick"><i></i></div><div id="jumpb"></div><div id="bubbles"></div>
 <div class="gover" id="esc"></div><div class="gover" id="bpfull"></div><div class="gover" id="dlg"></div><div id="rec" style="display:none;position:absolute;top:44px;right:310px;color:#f44;font-weight:700;cursor:pointer">● Recording…</div>`;
 const st=S.settings;
 const ren=new T.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});ren.setSize(innerWidth,innerHeight);ren.shadowMap.enabled=true;root.prepend(ren.domElement);
 const scene=new T.Scene();const sc=document.createElement("canvas");sc.width=2;sc.height=256;const sx=sc.getContext("2d");const gr=sx.createLinearGradient(0,0,0,256);gr.addColorStop(0,"#3b8fe0");gr.addColorStop(.5,"#9cd0ff");gr.addColorStop(1,"#e9f5ff");sx.fillStyle=gr;sx.fillRect(0,0,2,256);scene.background=new T.CanvasTexture(sc);
 const cam=new T.PerspectiveCamera(70,innerWidth/innerHeight,.1,2000);
 scene.add(new T.HemisphereLight(0xffffff,0x667766,.65));const sun=new T.DirectionalLight(0xffffff,.8);sun.position.set(80,150,60);sun.castShadow=true;sun.shadow.camera.left=sun.shadow.camera.bottom=-120;sun.shadow.camera.right=sun.shadow.camera.top=120;sun.shadow.mapSize.set(2048,2048);scene.add(sun);
 const sunball=new T.Mesh(new T.SphereGeometry(30,16,16),new T.MeshBasicMaterial({color:0xfff6c0}));sunball.position.set(400,600,300);scene.add(sunball);
 const tx=studTex();tx.repeat.set(256,256);const base=new T.Mesh(new T.BoxGeometry(512,1,512),new T.MeshLambertMaterial({map:tx,color:0x8a9a8a}));base.position.y=-.5;base.receiveShadow=true;scene.add(base);
 const solids=[{min:new T.Vector3(-256,-1,-256),max:new T.Vector3(256,0,256)}];
 const addBox=(x,y,z,w,h,d,c,kind)=>{const m=new T.Mesh(new T.BoxGeometry(w,h,d),new T.MeshLambertMaterial({color:c}));m.position.set(x,y+h/2,z);m.castShadow=m.receiveShadow=true;scene.add(m);const s={min:new T.Vector3(x-w/2,y,z-d/2),max:new T.Vector3(x+w/2,y+h,z+d/2),kind,mesh:m};solids.push(s);return s};
 addBox(0,0,0,12,1,12,0x5a5a5a,"spawn");const sl=new T.Mesh(new T.PlaneGeometry(6,6),new T.MeshBasicMaterial({color:0x2154B9}));sl.rotation.x=-Math.PI/2;sl.position.y=1.02;scene.add(sl);
 const r=rng(g.seed);for(let i=0;i<14;i++){const a=r()*6.28,d=30+r()*90;addBox(Math.cos(a)*d,0,Math.sin(a)*d,ri(4,16,r),ri(2,14,r),ri(4,16,r),new T.Color(pick(BRICK.slice(5,30),r)).getHex())}
 (g.parts||[]).forEach(p=>addBox(p.x,p.y,p.z,p.sx,p.sy,p.sz,new T.Color(p.color).getHex()));
 // obby
 const stages=[];let ox=0,oy=1,oz=-20;for(let i=0;i<10;i++){const cp=i%3==0;for(let k=0;k<3;k++){oz-=7+ri(0,2,r);ox+=ri(-3,3,r);oy+=ri(0,2,r);const kl=k==1&&i%2==1;addBox(ox,oy-1,oz,4,1,4,kl?0xff2020:new T.Color(pick(["#0D69AC","#F5CD30","#4B974B","#DA8541"],r)).getHex(),kl?"kill":null)}
  oz-=8;const s=addBox(ox,oy-1,oz,8,1,8,i==9?0xF5CD30:0x8DB78E,"check");s.stage=i+1;stages.push(s)}
 const coins=[];for(let i=0;i<25;i++){const m=new T.Mesh(new T.CylinderGeometry(.8,.8,.2,16),new T.MeshLambertMaterial({color:0xFFD700,emissive:0x664400}));m.rotation.x=Math.PI/2;const a=r()*6.28,d=10+r()*80;m.position.set(Math.cos(a)*d,1.5,Math.sin(a)*d);scene.add(m);coins.push(m)}
 // player
 const me=makeChar(S.colors,S.equipped);scene.add(me);
 const P={pos:new T.Vector3(0,1,0),vel:new T.Vector3(),yaw:0,ground:false,hp:100,dead:false,spawn:new T.Vector3(0,1,0),stage:0,coins:0,emote:null,emoteT:0};
 // npcs
 const npcs=U.slice(2,2+ri(6,10,r)).map((u,k)=>{const items=[];if(u.hat>=0)items.push(I.filter(x=>x.sub=="Hats")[u.hat%10].id);const m=makeChar(u.colors,items);scene.add(m);const a=k*.8;return{u,m,pos:new T.Vector3(Math.cos(a)*20,1,Math.sin(a)*20),vel:new T.Vector3(),yaw:0,tgt:null,hp:100,dead:false,stage:ri(0,5,r),coins:ri(0,20,r),t:0}});
 const keys={},tools=[{n:"Sword",c:"#A1A5A2",k:"sword"},{n:"Rocket Launcher",c:"#4B974B",k:"rocket"},{n:"Paintball Gun",c:"#0D69AC",k:"paint"},{n:"Gravity Coil",c:"#6E99CA",k:"grav"},{n:"Speed Coil",c:"#C4281C",k:"speed"},...S.inv.map(itemById).filter(i=>i&&i.top=="Gear").filter((v,i,a)=>a.indexOf(v)==i).map(i=>({n:i.name,c:i.color,k:i.name.includes("Coil")?(i.name.includes("Speed")?"speed":"grav"):i.sub=="Ranged"?"paint":i.sub=="Explosive"?"rocket":"sword"}))];
 const slots=tools.slice(0,10).map((t,i)=>i);let eq=-1,toolMesh=null;const proj=[],debris=[],bubbles=[];
 let yaw=0,pitch=.35,dist=18,lastAct=now(),shiftLock=false,rdrag=false,lastX=0,lastY=0,chatOpen=true,chatT=now(),plOpen=innerWidth>700,unread=0,swing=0,recording=false,clickTarget=null,frames=0,fpsT=performance.now(),fps=60;
 GM={gid:g.id,ren,raf:0,iv:0};
 const ui={lines:$("#clines"),cin:$("#cin2")};
 function applyQuality(){const q=st.quality;ren.setPixelRatio(Math.min(devicePixelRatio,.5+q*.15));ren.shadowMap.enabled=q>=4;sun.castShadow=q>=4;scene.fog=new T.Fog(0xcfe8ff,60+q*40,150+q*80);cam.far=200+q*180;cam.updateProjectionMatrix();scene.traverse(o=>{if(o.material)o.material.needsUpdate=true})}
 applyQuality();
 // chat
 function chat(name,text,sys,col){const d=document.createElement("div");d.innerHTML=sys?`<span style="color:#ccc">${esc(text)}</span>`:`<span style="color:${col||nameColor(name)};font-weight:700">[${esc(name)}]:</span> ${esc(filt(text))}`;ui.lines.appendChild(d);ui.lines.scrollTop=1e6;chatT=now();$("#gchat").style.opacity=1;if(!chatOpen&&!sys){unread++;$("#cdot").style.display="block"}}
 function bubble(obj,text){bubbles.push({obj,text:filt(text),t:now(),el:Object.assign(document.createElement("div"),{className:"bubblechat",textContent:filt(text)})});$("#bubbles").appendChild(bubbles[bubbles.length-1].el)}
 function say(text){text=text.slice(0,200);if(text.startsWith("/")){const [c,...a]=text.split(" ");
   if(c=="/e"&&["dance","wave","point","cheer","laugh"].includes(a[0])){P.emote=a[0];P.emoteT=now();return}
   if(c=="/w"||c=="/whisper"){const u=npcs.find(n=>n.u.name.toLowerCase()==(a[0]||"").toLowerCase());if(u){chat(S.me.name,"(to "+u.u.name+") "+a.slice(1).join(" "),false,"#aaa");setTimeout(()=>chat(u.u.name,"(whisper) "+pick(["hi","what","ok","lol"],Math.random)),1500)}else chat("","Player not found.",true);return}
   if(c=="/mute"){const u=npcs.find(n=>n.u.name.toLowerCase()==(a[0]||"").toLowerCase());if(u){u.muted=true;chat("","Muted "+u.u.name,true)}return}
   if(c=="/unmute"){npcs.forEach(n=>{if(n.u.name.toLowerCase()==(a[0]||"").toLowerCase())n.muted=false});chat("","Unmuted.",true);return}
   if(c=="/help"){chat("","Commands: /e dance|wave|point|cheer|laugh, /w [name] [msg], /mute [name], /unmute [name], /help",true);return}
   chat("","Unknown command. Type /help.",true);return}
  chat(S.me.name,text,false);bubble(me,text)}
 ui.cin.onkeydown=e=>{e.stopPropagation();if(e.key=="Enter"){if(ui.cin.value.trim())say(ui.cin.value.trim());ui.cin.value="";ui.cin.blur()}else if(e.key=="Escape"){ui.cin.value="";ui.cin.blur()}};
 $("#gchat").onmouseenter=()=>{$("#gchat").style.opacity=1;chatT=now()};
 $("#bchat").onclick=()=>{chatOpen=!chatOpen;$("#gchat").style.display=chatOpen?"":"none";unread=0;$("#cdot").style.display="none"};
 $("#bpl").onclick=()=>{plOpen=!plOpen;renderPL()};$("#bmenu").onclick=()=>openEsc();$("#bbp").onclick=()=>toggleBP();
 chat("","Welcome to "+g.name+"! Type /help for chat commands.",true);
 function renderPL(){const pl=$("#plist");if(!plOpen){pl.style.display="none";return}pl.style.display="block";const all=[{u:meUser(),stage:P.stage,coins:P.coins,me:1},...npcs.map(n=>({u:n.u,stage:n.stage,coins:n.coins,n}))];
  pl.innerHTML=`<div class="row between" style="padding:6px 8px;font-weight:700"><span>${esc(g.name.slice(0,22))}</span><span class="row" style="gap:0"><span style="width:50px;text-align:right">Stage</span><span style="width:50px;text-align:right">Coins</span></span></div>`+all.map((p,k)=>`<div class="r" data-k="${k}"><span style="flex:1">${p.u.bc?bcIcon(p.u.bc,14):""} ${isFriend(p.u.id)?"👥 ":""}${esc(p.u.name)}</span><span class="st">${p.stage}</span><span class="st">${p.coins}</span></div>`).join("");
  $$("#plist .r").forEach(r=>r.onclick=e=>{const p=all[+r.dataset.k];if(p.me)return;$$(".plpop").forEach(x=>x.remove());const d=document.createElement("div");d.className="plpop";d.style.cssText="background:#222;padding:6px;margin:0 8px 6px;border-radius:3px;display:flex;gap:4px;flex-wrap:wrap";const fr=isFriend(p.u.id);
   d.innerHTML=`<button>${fr?"Unfriend":"Add Friend"}</button><button>Follow</button><button>Block</button><button>Report</button>`;r.after(d);const b=$$("button",d);b.forEach(x=>{x.style.cssText="background:#444;color:#fff;border:0;font-size:12px"});
   b[0].onclick=()=>{friendBtn(p.u.id);chat("",fr?"Unfriended "+p.u.name:"Friend request sent to "+p.u.name,true);setTimeout(renderPL,50)};b[1].onclick=()=>{if(!S.following.includes(p.u.id))S.following.push(p.u.id);save();chat("","Following "+p.u.name,true)};b[2].onclick=()=>{S.blocked.push(p.u.id);p.n.muted=true;save();chat("","Blocked "+p.u.name,true)};b[3].onclick=()=>{openEsc("Report",p.u.name)}})}
 renderPL();
 function renderHot(){$("#hotbar").innerHTML=slots.map((ti,i)=>{const t=tools[ti];return `<div class="slot ${eq==ti?"on":""}" data-i="${i}" draggable="true"><span class="k">${(i+1)%10}</span><div style="width:22px;height:22px;background:${t.c};transform:rotate(45deg);margin-bottom:6px"></div>${esc(t.n.slice(0,10))}</div>`}).join("");
  $$("#hotbar .slot").forEach(s=>{s.onclick=()=>equip(slots[+s.dataset.i]);s.ondragover=e=>e.preventDefault();s.ondrop=e=>{e.preventDefault();const ti=+e.dataTransfer.getData("t");const i=+s.dataset.i;const j=slots.indexOf(ti);if(j>=0)slots[j]=slots[i];slots[i]=ti;renderHot()};s.ondragstart=e=>e.dataTransfer.setData("t",slots[+s.dataset.i])})}
 function equip(ti){if(toolMesh){me.userData.ra.remove(toolMesh);toolMesh=null}if(eq==ti||ti==null){eq=-1;renderHot();return}eq=ti;const t=tools[ti];
  toolMesh=new T.Mesh(t.k=="sword"?new T.BoxGeometry(.3,4,.15):t.k=="grav"||t.k=="speed"?new T.TorusGeometry(.5,.12,8,16):new T.BoxGeometry(.5,.6,2.5),new T.MeshLambertMaterial({color:t.c}));toolMesh.position.set(0,me.userData.skinned?0:-2,t.k=="sword"?-1.5:-.8);if(t.k=="sword")toolMesh.rotation.x=Math.PI/2;me.userData.ra.add(toolMesh);renderHot()}
 renderHot();
 function toggleBP(){const o=$("#bpfull");if(o.classList.contains("on")){o.classList.remove("on");return}o.classList.add("on");
  o.innerHTML=`<div class="gpanel"><div class="row between"><h3 style="margin:0">Backpack</h3><input id="bps" placeholder="Search" style="width:200px"><button id="bpx">Close</button></div><p class="small" style="opacity:.7">Drag a tool onto a hotbar slot below.</p><div class="row wrapflex" id="bpg" style="gap:6px"></div></div>`;
  const draw=()=>{const q=$("#bps").value.toLowerCase();$("#bpg").innerHTML=tools.map((t,i)=>t.n.toLowerCase().includes(q)?`<div class="slot" draggable="true" data-t="${i}" style="position:relative"><div style="width:22px;height:22px;background:${t.c};transform:rotate(45deg);margin-bottom:6px"></div>${esc(t.n.slice(0,10))}</div>`:"").join("");$$("#bpg .slot").forEach(s=>{s.ondragstart=e=>e.dataTransfer.setData("t",s.dataset.t);s.onclick=()=>equip(+s.dataset.t)})};
  $("#bps").oninput=draw;$("#bps").onkeydown=e=>e.stopPropagation();$("#bpx").onclick=toggleBP;draw()}
 // esc menu
 function openEsc(tab="Players",reportName){const o=$("#esc");o.classList.add("on");try{document.exitPointerLock()}catch(e){}
  const tabs=["Players","Settings","Report","Help","Record"];let b="";
  const tog=(k,lab)=>`<div class="srow"><span>${lab}</span><span><button data-set="${k}" data-v="1" style="${st[k]?"background:#00A2FF":""}">On</button><button data-set="${k}" data-v="0" style="${!st[k]?"background:#00A2FF":""}">Off</button></span></div>`;
  const sel=(k,lab,opts)=>`<div class="srow"><span>${lab}</span><select data-sel="${k}">${opts.map(x=>`<option ${st[k]==x?"selected":""}>${x}</option>`).join("")}</select></div>`;
  const rng2=(k,lab,a,b2)=>`<div class="srow"><span>${lab}</span><span><input type="range" min="${a}" max="${b2}" value="${st[k]}" data-rng="${k}"> <b id="rv_${k}">${st[k]}</b></span></div>`;
  if(tab=="Players")b=[{u:meUser()},...npcs].map(n=>`<div class="srow"><span class="row">${headshot(n.u,36,false)} ${esc(n.u.name)}</span>${n.u.id===0?"":`<span><button onclick="friendBtn(${n.u.id})">${isFriend(n.u.id)?"Friends":"Add Friend"}</button><button data-rep="${esc(n.u.name)}">Report</button><button onclick="S.blocked.push(${n.u.id});save();this.textContent='Blocked'">Block</button></span>`}</div>`).join("");
  else if(tab=="Settings")b=tog("shiftlock","Shift Lock Switch")+sel("camMode","Camera Mode",["Default (Classic)","Follow"])+sel("moveMode","Movement Mode",["Default (Keyboard)","Click to Move"])+sel("gfxMode","Graphics Mode",["Automatic","Manual"])+rng2("quality","Graphics Quality",1,10)+rng2("volume","Volume",0,100)+tog("invert","Camera Inverted")+rng2("sens","Mouse Sensitivity",1,100)+`<div class="srow"><span>Fullscreen</span><button id="fsb">${document.fullscreenElement?"Exit":"Enter"} Fullscreen</button></div>`+tog("perf","Performance Stats");
  else if(tab=="Report")b=`<div class="srow"><span>Game or Player?</span><select id="rgp"><option>Game</option><option ${reportName?"selected":""}>Player</option></select></div><div class="srow"><span>Which player?</span><select id="rpl">${npcs.map(n=>`<option ${n.u.name==reportName?"selected":""}>${esc(n.u.name)}</option>`).join("")}</select></div><div class="srow"><span>Type of Abuse</span><select><option>Swearing</option><option>Bullying</option><option>Scamming</option><option>Exploiting</option><option>Inappropriate Username</option></select></div><textarea rows="4" style="width:100%;margin-top:8px" placeholder="Short description (optional)"></textarea><button id="rsub" style="background:#00A2FF">Submit</button><div id="rthx"></div>`;
  else if(tab=="Help"){const ht=window._ht||"Keyboard";b=`<div class="tabs">${["Keyboard","Mouse","Gamepad","Touch"].map(t=>`<div class="${t==ht?"on":""}" data-ht="${t}">${t}</div>`).join("")}</div>`+{Keyboard:`<svg viewBox="0 0 500 160" width="100%">${[["W",60,10],["A",20,50],["S",60,50],["D",100,50]].map(([k,x,y])=>`<rect x="${x}" y="${y}" width="36" height="36" rx="4" fill="#444"/><text x="${x+18}" y="${y+24}" fill="#fff" text-anchor="middle">${k}</text>`).join("")}<text x="150" y="50" fill="#fff">Move</text><rect x="20" y="110" width="200" height="36" rx="4" fill="#444"/><text x="120" y="134" fill="#fff" text-anchor="middle">Space — Jump</text><text x="260" y="30" fill="#fff">Shift — Shift Lock</text><text x="260" y="55" fill="#fff">I / O — Zoom</text><text x="260" y="80" fill="#fff">/ — Chat   Tab — Player List</text><text x="260" y="105" fill="#fff">1-0 — Tools   \` — Backpack</text><text x="260" y="130" fill="#fff">Esc — Menu   R/L — Reset/Leave</text></svg>`,Mouse:`<svg viewBox="0 0 400 140" width="100%"><rect x="40" y="10" width="80" height="120" rx="40" fill="#444"/><path d="M80 10v50" stroke="#888"/><text x="150" y="40" fill="#fff">Left click — use tool</text><text x="150" y="70" fill="#fff">Right drag — rotate camera</text><text x="150" y="100" fill="#fff">Wheel — zoom</text></svg>`,Gamepad:`<svg viewBox="0 0 400 140" width="100%"><rect x="40" y="30" width="200" height="90" rx="40" fill="#444"/><circle cx="90" cy="70" r="16" fill="#666"/><circle cx="190" cy="80" r="16" fill="#666"/><text x="260" y="60" fill="#fff">Left stick — move</text><text x="260" y="85" fill="#fff">Right stick — camera</text><text x="260" y="110" fill="#fff">A — jump</text></svg>`,Touch:`<svg viewBox="0 0 400 140" width="100%"><circle cx="70" cy="80" r="40" fill="#444"/><circle cx="330" cy="80" r="26" fill="#444"/><text x="40" y="20" fill="#fff">Thumbstick — move</text><text x="250" y="20" fill="#fff">Button — jump</text><text x="120" y="130" fill="#fff">Drag screen — camera</text></svg>`}[ht]}
  else b=`<div class="srow"><span>Screenshot</span><button id="shot">Take Screenshot</button></div><div class="srow"><span>Record Video</span><button id="recb">${recording?"Stop Recording":"Record Video"}</button></div><div id="shotout"></div>`;
  o.innerHTML=`<div class="gpanel"><div class="tabs">${tabs.map(t=>`<div class="${t==tab?"on":""}" data-tab="${t}">${t}</div>`).join("")}</div><div style="min-height:240px">${b}</div><div class="row" style="justify-content:center;margin-top:14px"><button id="mreset">Reset Character <b>R</b></button><button id="mleave">Leave Game <b>L</b></button><button id="mresume" style="background:#fff;color:#111">Resume Game <b>ESC</b></button></div></div>`;
  $$("[data-tab]",o).forEach(t=>t.onclick=()=>openEsc(t.dataset.tab));$$("[data-ht]",o).forEach(t=>t.onclick=()=>{window._ht=t.dataset.ht;openEsc("Help")});$$("[data-rep]",o).forEach(t=>t.onclick=()=>openEsc("Report",t.dataset.rep));
  $$("[data-set]",o).forEach(x=>x.onclick=()=>{st[x.dataset.set]=x.dataset.v=="1";save();openEsc("Settings")});
  $$("[data-sel]",o).forEach(x=>x.onchange=()=>{st[x.dataset.sel]=x.value;save()});
  $$("[data-rng]",o).forEach(x=>{x.onkeydown=e=>e.stopPropagation();x.oninput=()=>{st[x.dataset.rng]=+x.value;$("#rv_"+x.dataset.rng).textContent=x.value;if(x.dataset.rng=="quality"){st.gfxMode="Manual";applyQuality()}save()}});
  $$("textarea,select",o).forEach(x=>x.onkeydown=e=>e.stopPropagation());
  if($("#fsb"))$("#fsb").onclick=()=>{try{document.fullscreenElement?document.exitFullscreen():root.requestFullscreen().catch(()=>chat("","Fullscreen isn't allowed here.",true))}catch(e){}setTimeout(()=>openEsc("Settings"),300)};
  if($("#rsub"))$("#rsub").onclick=()=>{$("#rthx").innerHTML="<p><b>Thanks for your report!</b> Our moderators will review it.</p>"};
  if($("#shot"))$("#shot").onclick=()=>{ren.render(scene,cam);const u=ren.domElement.toDataURL("image/png");const a=document.createElement("a");a.href=u;a.download="BLOX_screenshot.png";try{a.click()}catch(e){}$("#shotout").innerHTML=`<p class="small">Screenshot taken. If your browser blocked the download, right-click the image to save it.</p><img src="${u}" style="width:100%">`};
  if($("#recb"))$("#recb").onclick=()=>{recording=!recording;$("#rec").style.display=recording?"block":"none";openEsc("Record")};
  $("#mreset").onclick=confirmReset;$("#mleave").onclick=confirmLeave;$("#mresume").onclick=closeEsc}
 $("#rec").onclick=()=>{recording=false;$("#rec").style.display="none";chat("","Recording saved (demo).",true)};
 function closeEsc(){$("#esc").classList.remove("on")}
 function dialog(title,text,btns){const d=$("#dlg");d.classList.add("on");d.innerHTML=`<div class="gpanel" style="width:400px;text-align:center"><h3>${title}</h3><p>${text}</p><div class="row" style="justify-content:center">${btns.map((b,i)=>`<button data-i="${i}" style="${i==0?"background:#00A2FF":""}">${b[0]}</button>`).join("")}</div></div>`;$$("#dlg button").forEach(b=>b.onclick=()=>{d.classList.remove("on");btns[+b.dataset.i][1]()})}
 function confirmReset(){closeEsc();dialog("Reset Character?","Are you sure you want to reset your character?",[["Reset",()=>die()],["Don't Reset",()=>{}]])}
 function confirmLeave(){closeEsc();dialog("Leave Game?","Are you sure you want to leave the game?",[["Leave",leaveGame],["Don't Leave",()=>{}]])}
 // input
 GM.kd=e=>{lastAct=now();if(document.activeElement&&["INPUT","TEXTAREA","SELECT"].includes(document.activeElement.tagName))return;const k=e.key;
  if($("#dlg").classList.contains("on"))return;
  if($("#esc").classList.contains("on")){if(k=="Escape")closeEsc();else if(k=="r"||k=="R")confirmReset();else if(k=="l"||k=="L")confirmLeave();return}
  if(k=="Escape"){openEsc();return}if(k=="/"){e.preventDefault();if(!chatOpen)$("#bchat").click();ui.cin.focus();return}if(k=="Tab"){e.preventDefault();plOpen=!plOpen;renderPL();return}if(k=="`"){toggleBP();return}
  if(k=="F9"){e.preventDefault();dialog("Connection lost","Lost connection to the game server, please reconnect. (Error Code: 277)",[["Reconnect",()=>chat("","Reconnected.",true)],["Leave",leaveGame]]);return}
  if(k=="Shift"&&st.shiftlock){shiftLock=!shiftLock;$("#xhair").style.display=shiftLock?"block":"none";if(shiftLock)try{ren.domElement.requestPointerLock()}catch(e){}else try{document.exitPointerLock()}catch(e){}}
  if(/^[0-9]$/.test(k)){const i=(+k+9)%10;if(slots[i]!=null)equip(slots[i])}
  if(k=="i"||k=="I")dist=Math.max(.5,dist-3);if(k=="o"||k=="O")dist=Math.min(60,dist+3);
  if(k==" ")e.preventDefault();keys[k.toLowerCase()]=true};
 GM.ku=e=>{keys[e.key.toLowerCase()]=false};document.addEventListener("keydown",GM.kd);document.addEventListener("keyup",GM.ku);
 const cv=ren.domElement;cv.oncontextmenu=e=>e.preventDefault();
 cv.onmousedown=e=>{lastAct=now();if(e.button==2){rdrag=true;lastX=e.clientX;lastY=e.clientY}else if(e.button==0){if(st.moveMode=="Click to Move"&&eq<0){const rc=new T.Raycaster();rc.setFromCamera({x:e.clientX/innerWidth*2-1,y:-e.clientY/innerHeight*2+1},cam);const h=rc.intersectObjects(scene.children.filter(o=>o.isMesh));if(h[0])clickTarget=h[0].point.clone()}else useTool()}};
 addEventListener("mouseup",()=>rdrag=false);
 cv.onmousemove=e=>{const s=st.sens/50*.006,inv=st.invert?-1:1;if(document.pointerLockElement==cv){yaw-=e.movementX*s;pitch=Math.max(-1.2,Math.min(1.4,pitch+e.movementY*s*inv))}else if(rdrag||shiftLock){yaw-=(e.clientX-lastX)*s;pitch=Math.max(-1.2,Math.min(1.4,pitch+(e.clientY-lastY)*s*inv));lastX=e.clientX;lastY=e.clientY}else{lastX=e.clientX;lastY=e.clientY}};
 cv.onwheel=e=>{dist=Math.max(.5,Math.min(60,dist*(e.deltaY>0?1.12:.89)))};
 GM.rs=()=>{ren.setSize(innerWidth,innerHeight);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix()};addEventListener("resize",GM.rs);
 // touch
 let stickV={x:0,y:0};if("ontouchstart" in window){$("#stick").style.display=$("#jumpb").style.display="block";const sk=$("#stick");
  sk.ontouchmove=e=>{e.preventDefault();const t=e.touches[0],r=sk.getBoundingClientRect();let x=(t.clientX-r.left-55)/55,y=(t.clientY-r.top-55)/55;const l=Math.hypot(x,y);if(l>1){x/=l;y/=l}stickV={x,y};$("#stick i").style.transform=`translate(${x*35}px,${y*35}px)`};
  sk.ontouchend=()=>{stickV={x:0,y:0};$("#stick i").style.transform=""};$("#jumpb").ontouchstart=e=>{e.preventDefault();keys[" "]=true;setTimeout(()=>keys[" "]=false,150)};
  let tl=null;cv.ontouchstart=e=>{tl=e.touches[0]};cv.ontouchmove=e=>{const t=e.touches[0];if(tl){yaw-=(t.clientX-tl.clientX)*.008;pitch=Math.max(-1.2,Math.min(1.4,pitch+(t.clientY-tl.clientY)*.008))}tl=t};cv.ontouchend=()=>{useTool()}}
 function fwd(){return new T.Vector3(-Math.sin(P.yaw),0,-Math.cos(P.yaw))}
 function useTool(){if(eq<0||P.dead)return;const t=tools[eq];lastAct=now();const f=fwd();const o=P.pos.clone().add(new T.Vector3(0,3.5,0)).addScaledVector(f,2);
  if(t.k=="sword"){swing=now();sfx("swing");P.vel.addScaledVector(f,25);npcs.forEach(n=>{if(!n.dead&&n.pos.distanceTo(P.pos)<7){const to=n.pos.clone().sub(P.pos).normalize();if(to.dot(f)>.2)hurtNPC(n,35)}})}
  else if(t.k=="rocket"||t.k=="paint"){sfx("shoot");const m=new T.Mesh(t.k=="rocket"?new T.BoxGeometry(.6,.6,1.6):new T.SphereGeometry(.3,8,8),new T.MeshLambertMaterial({color:t.k=="rocket"?0x333333:new T.Color().setHSL(Math.random(),1,.5)}));const dir=new T.Vector3(-Math.sin(yaw)*Math.cos(pitch),-Math.sin(pitch)+.15,-Math.cos(yaw)*Math.cos(pitch)).normalize();if(!shiftLock&&dist>1)dir.copy(f).setY(.05).normalize();m.position.copy(o);m.lookAt(o.clone().add(dir));scene.add(m);proj.push({m,dir,sp:t.k=="rocket"?60:120,k:t.k,t:now()})}
  else swing=now()}
 function hurtNPC(n,d){n.hp-=d;sfx("hit");if(n.hp<=0&&!n.dead){n.dead=true;breakApart(n.m);chat("",n.u.name+" was knocked out!",true);setTimeout(()=>{n.dead=false;n.hp=100;n.m.visible=true;resetChar(n.m);n.pos.set(ri(-20,20,Math.random),1,ri(-20,20,Math.random))},5000)}}
 function breakApart(m){if(m.userData.skinned){noobBreak(m,scene,debris);return}m.traverse(c=>{if(c.isMesh){const wp=new T.Vector3();c.getWorldPosition(wp);const cl=c.clone();cl.position.copy(wp);cl.quaternion.copy(c.getWorldQuaternion(new T.Quaternion()));scene.add(cl);debris.push({m:cl,h:.5,v:new T.Vector3((Math.random()-.5)*14,8+Math.random()*8,(Math.random()-.5)*14),r:new T.Vector3(Math.random()*5,Math.random()*5,0),t:now()})}});m.visible=false}
 function resetChar(m){m.visible=true}
 function damage(d){if(P.dead)return;P.hp-=d;$("#vign").style.opacity=.7;setTimeout(()=>$("#vign").style.opacity=0,300);if(P.hp<=0)die()}
 function die(){if(P.dead)return;P.dead=true;P.hp=0;sfx("oof");breakApart(me);setTimeout(()=>{if(!GM||GM.dead2)return;P.dead=false;P.hp=100;P.pos.copy(P.spawn);P.vel.set(0,0,0);me.visible=true;debris.forEach(d=>scene.remove(d.m));debris.length=0},5000)}
 function collide(pos,axis,vel,half,h){for(const s of solids){if(pos.x+half>s.min.x&&pos.x-half<s.max.x&&pos.z+half>s.min.z&&pos.z-half<s.max.z&&pos.y+h>s.min.y&&pos.y<s.max.y){
   if(axis=="y"){if(vel.y<=0){pos.y=s.max.y;vel.y=0;return s}else{pos.y=s.min.y-h;vel.y=0}}else if(axis=="x"){if(s.max.y-pos.y<1.1&&vel.x){pos.y=s.max.y}else pos.x=vel.x>0?s.min.x-half:s.max.x+half}else{if(s.max.y-pos.y<1.1&&vel.z){pos.y=s.max.y}else pos.z=vel.z>0?s.min.z-half:s.max.z+half}}}return null}
 function physics(ent,dt,grav){ent.vel.y-=grav*dt;let g=null;ent.pos.x+=ent.vel.x*dt;collide(ent.pos,"x",ent.vel,.9,5);ent.pos.z+=ent.vel.z*dt;collide(ent.pos,"z",ent.vel,.9,5);ent.pos.y+=ent.vel.y*dt;g=collide(ent.pos,"y",ent.vel,.9,5);ent.ground=!!g;return g}
 function animate(m,moving,ground,t,emote,sw){const u=m.userData;if(u.skinned){noobAnim(m,moving,ground,emote,sw,m===me&&eq>=0);return}let a=moving&&ground?Math.sin(t*10)*.9:0;u.la.rotation.set(a,0,0);u.ra.rotation.set(-a,0,0);u.ll.rotation.set(-a,0,0);u.rl.rotation.set(a,0,0);
  if(!ground){u.la.rotation.x=u.ra.rotation.x=Math.PI;u.ll.rotation.x=u.rl.rotation.x=0}
  if(emote=="wave")u.ra.rotation.set(Math.PI,0,Math.sin(t*12)*.5);else if(emote=="point")u.ra.rotation.x=Math.PI/2;else if(emote=="cheer"){u.la.rotation.x=u.ra.rotation.x=Math.PI+Math.sin(t*14)*.3}else if(emote=="dance"){u.la.rotation.z=Math.sin(t*8)*1.5;u.ra.rotation.z=-Math.sin(t*8)*1.5;u.ll.rotation.x=Math.sin(t*8)*.6;u.rl.rotation.x=-Math.sin(t*8)*.6;m.rotation.y+=.05}else if(emote=="laugh"){u.head.rotation.x=Math.sin(t*20)*.2}
  if(sw){u.ra.rotation.x=Math.PI/2+Math.sin(sw*Math.PI)*1.2}else if(m===me&&eq>=0&&!emote)u.ra.rotation.x=Math.PI/2}
 let last=performance.now(),loaded=false;
 const ls=["Requesting Server...","Joining Server...","Loading Game..."];let li=0;const lsi=setInterval(()=>{li++;if(li<3)$("#lstat").textContent=ls[li];else{clearInterval(lsi);$("#loadscr").remove();loaded=true}},900);$("#lcancel").onclick=()=>{clearInterval(lsi);leaveGame()};
 GM.iv=setInterval(()=>{if(!loaded)return;if(P.hp<100&&!P.dead)P.hp=Math.min(100,P.hp+1);
  npcs.forEach(n=>{if(!n.muted&&!n.dead&&Math.random()<.04){const m=pick(MSGS_CHAT,Math.random);chat(n.u.name,m);bubble(n.m,m)}});
  if(now()-lastAct>20*60e3){lastAct=now()+1e12;dialog("Disconnected","You were kicked for being idle 20 minutes. (Error Code: 272)",[["Leave",leaveGame]])}
  renderPL()},1000);
 function frame(){if(!GM||GM.dead2)return;GM.raf=requestAnimationFrame(frame);const tnow=performance.now();const dt=Math.min(.05,(tnow-last)/1000);last=tnow;const t=tnow/1000;
  frames++;if(tnow-fpsT>500){fps=Math.round(frames*1000/(tnow-fpsT));frames=0;fpsT=tnow;if(st.gfxMode=="Automatic"){if(fps<35&&st.quality>2){st.quality--;applyQuality()}else if(fps>58&&st.quality<8){st.quality++;applyQuality()}}}
  $("#perf").style.display=st.perf?"block":"none";if(st.perf)$("#perf").textContent=`FPS ${fps} | Ping ${40+Math.floor(Math.random()*15)} ms | Mem ${(performance.memory?performance.memory.usedJSHeapSize/1048576:180+Math.random()*5).toFixed(0)} MB | Q${st.quality}`;
  if(!$("#esc").classList.contains("on")&&loaded&&!P.dead){
   // movement
   let ix=(keys["d"]||keys["arrowright"]?1:0)-(keys["a"]||keys["arrowleft"]?1:0)+stickV.x,iz=(keys["s"]||keys["arrowdown"]?1:0)-(keys["w"]||keys["arrowup"]?1:0)+stickV.y;
   const speed=16*(eq>=0&&tools[eq].k=="speed"?1.6:1);const cy=Math.cos(yaw),sy=Math.sin(yaw);let mx=ix*cy+iz*sy,mz=-ix*sy+iz*cy;
   if(clickTarget&&!ix&&!iz){const d=clickTarget.clone().sub(P.pos);d.y=0;if(d.length()<1)clickTarget=null;else{d.normalize();mx=d.x;mz=d.z}}else if(ix||iz)clickTarget=null;
   const ml=Math.hypot(mx,mz);if(ml>0){mx/=Math.max(1,ml);mz/=Math.max(1,ml)}
   P.vel.x+=(mx*speed-P.vel.x)*Math.min(1,dt*12);P.vel.z+=(mz*speed-P.vel.z)*Math.min(1,dt*12);
   if(keys[" "]&&P.ground){P.vel.y=eq>=0&&tools[eq].k=="grav"?70:50;sfx("jump")}
   if(ml>0&&!shiftLock)P.yaw=Math.atan2(-mx,-mz);if(shiftLock||dist<1)P.yaw=yaw;
   if(ml>0&&P.emote)P.emote=null;
   const gnd=physics(P,dt,eq>=0&&tools[eq].k=="grav"?60:196);
   if(gnd&&gnd.kind=="kill")damage(100);
   if(gnd&&gnd.kind=="check"&&gnd.stage>P.stage){P.stage=gnd.stage;P.spawn.set((gnd.min.x+gnd.max.x)/2,gnd.max.y,(gnd.min.z+gnd.max.z)/2);sfx("coin");chat("","Checkpoint! Stage "+P.stage,true);
    if(gnd.stage==10)awardBadge("Obby Master")}
   if(P.pos.y<-50)die();
   coins.forEach(c=>{if(c.visible&&c.position.distanceTo(P.pos.clone().add(new T.Vector3(0,1.5,0)))<2.5){c.visible=false;P.coins++;sfx("coin");setTimeout(()=>c.visible=true,30000)}});
   if(st.camMode=="Follow"&&ml>0&&!rdrag&&!shiftLock){let d=P.yaw-yaw;while(d>Math.PI)d-=6.283;while(d<-Math.PI)d+=6.283;yaw+=d*dt*1.5}
  }
  me.position.copy(P.pos);me.rotation.y=P.yaw;
  const sw=now()-swing<300?(now()-swing)/300:0;if(P.emote&&now()-P.emoteT>4000)P.emote=null;
  me.userData.vy=P.vel.y;me.userData.speed=Math.hypot(P.vel.x,P.vel.z);animate(me,Math.hypot(P.vel.x,P.vel.z)>1,P.ground,t,P.emote,sw);
  // npcs
  npcs.forEach(n=>{if(n.dead)return;n.t-=dt;if(n.t<=0){n.t=1+Math.random()*4;n.tgt=Math.random()<.3?null:new T.Vector3(n.pos.x+(Math.random()-.5)*40,0,n.pos.z+(Math.random()-.5)*40);if(Math.random()<.25&&n.ground)n.vel.y=50}
   if(n.tgt){const d=n.tgt.clone().sub(n.pos);d.y=0;if(d.length()<2)n.tgt=null;else{d.normalize();n.vel.x=d.x*12;n.vel.z=d.z*12;n.yaw=Math.atan2(-d.x,-d.z)}}else{n.vel.x*=.8;n.vel.z*=.8}
   physics(n,dt,196);if(n.pos.y<-50)n.pos.set(0,5,0);n.m.userData.vy=n.vel.y;n.m.userData.speed=12;n.m.position.copy(n.pos);n.m.rotation.y=n.yaw;animate(n.m,Math.hypot(n.vel.x,n.vel.z)>1,n.ground,t+n.u.id,null,0)});
  // projectiles
  for(let i=proj.length-1;i>=0;i--){const p=proj[i];p.m.position.addScaledVector(p.dir,p.sp*dt);let hit=now()-p.t>4000;const pp=p.m.position;
   for(const s of solids)if(pp.x>s.min.x&&pp.x<s.max.x&&pp.y>s.min.y&&pp.y<s.max.y&&pp.z>s.min.z&&pp.z<s.max.z){hit=true;if(p.k=="paint"&&s.mesh)s.mesh.material.color.copy(p.m.material.color);break}
   npcs.forEach(n=>{if(!n.dead&&n.pos.clone().add(new T.Vector3(0,2.5,0)).distanceTo(pp)<2){hit=true;if(p.k=="paint")hurtNPC(n,15)}});
   if(hit){scene.remove(p.m);proj.splice(i,1);if(p.k=="rocket"){sfx("boom");const ex=new T.Mesh(new T.SphereGeometry(6,16,16),new T.MeshBasicMaterial({color:0xff8800,transparent:true,opacity:.7}));ex.position.copy(pp);scene.add(ex);setTimeout(()=>scene.remove(ex),250);npcs.forEach(n=>{if(!n.dead&&n.pos.distanceTo(pp)<8)hurtNPC(n,60)});const dme=P.pos.distanceTo(pp);if(dme<8){damage(40);P.vel.add(P.pos.clone().sub(pp).normalize().multiplyScalar(40)).setY(40)}}}}
  debris.forEach(d=>{if(d.rest)return;d.v.y-=60*dt;d.m.position.addScaledVector(d.v,dt);d.m.rotation.x+=d.r.x*dt;d.m.rotation.y+=d.r.y*dt;d.m.rotation.z+=d.r.z*dt;
   const p=d.m.position,h=d.h||.5;let fl=-1e9;for(const s of solids)if(p.x>s.min.x&&p.x<s.max.x&&p.z>s.min.z&&p.z<s.max.z&&s.max.y<=p.y+h+.6&&s.max.y>fl)fl=s.max.y;
   if(p.y-h<fl){p.y=fl+h;if(Math.abs(d.v.y)<3){d.v.set(0,0,0);d.r.multiplyScalar(0);d.rest=true}else{d.v.y=-d.v.y*.3;d.v.x*=.5;d.v.z*=.5;d.r.multiplyScalar(.5)}}});
  for(let i=debris.length-1;i>=0;i--)if(now()-debris[i].t>6000&&!P.dead){scene.remove(debris[i].m);debris.splice(i,1)}
  coins.forEach(c=>c.rotation.z+=dt*3);
  // camera
  const head=P.pos.clone().add(new T.Vector3(0,4.5,0));if(shiftLock){head.add(new T.Vector3(Math.cos(yaw),0,-Math.sin(yaw)).multiplyScalar(1.7))}
  const fp=dist<1;if(fp&&!P.dead)me.visible=false;else if(!P.dead)me.visible=true;
  const off=new T.Vector3(Math.sin(yaw)*Math.cos(pitch),Math.sin(pitch),Math.cos(yaw)*Math.cos(pitch)).multiplyScalar(fp?.01:dist);cam.position.copy(head).add(off);cam.lookAt(head);if(fp)P.yaw=yaw;
  // hp
  const hp=$("#hp");hp.style.display=P.hp<100?"block":"none";hp.firstChild.style.width=P.hp+"%";hp.firstChild.style.background=P.hp>60?"#2ecc40":P.hp>30?"#F5CD30":"#E2231A";
  if(chatOpen&&now()-chatT>30000)$("#gchat").style.opacity=.15;
  // bubbles
  for(let i=bubbles.length-1;i>=0;i--){const b=bubbles[i];if(now()-b.t>6000||!b.obj.visible){b.el.remove();bubbles.splice(i,1);continue}const v=b.obj.position.clone().add(new T.Vector3(0,7,0)).project(cam);b.el.style.display=v.z<1?"block":"none";b.el.style.left=(v.x+1)/2*innerWidth+"px";b.el.style.top=(1-v.y)/2*innerHeight+"px";b.el.style.opacity=1-(now()-b.t)/6000}
  ren.render(scene,cam)}
 function awardBadge(n){if(S.badges.some(b=>b.game==g.id&&b.n==n))return;S.badges.push({game:g.id,n,t:now()});save();sfx("badge");const bp=$("#badgepop");bp.style.display="flex";bp.innerHTML=`<div style="width:50px;height:50px;border-radius:50%;background:#E8AB2D;display:flex;align-items:center;justify-content:center">${ico("star",28,"#fff")}</div><div>You've been awarded the '${n}' badge!</div>`;setTimeout(()=>bp.style.display="none",6000);chat("",S.me.name+" won the "+n+" badge!",true)}
 frame()}

/* ================= STUDIO ================= */
function openStudio(id){modal(`<div style="text-align:center"><h3 style="border:0">Launching BLOX Studio...</h3><div class="spin"><i></i><i></i><i></i><i></i></div></div>`);setTimeout(()=>{closeModal();go("#/studio/"+id)},1500)}
let SD=null;
function pageStudio(parts){const g=gameById(+parts[1]);if(!g)return page404();if(!window.THREE)return page404();if(SD&&SD.gid==g.id)return null;const T=THREE;g.parts=g.parts||[];
 const root=$("#studio");root.classList.add("on");
 root.innerHTML=`<div style="background:#2b2b2b;color:#fff;padding:4px 10px;display:flex;justify-content:space-between"><span>BLOX Studio — ${esc(g.name)}</span><span style="cursor:pointer" id="sclose">✕</span></div>
 <div class="ribtabs">${["Home","Model","Test","View","Plugins"].map((t,i)=>`<div class="${i?"":"on"}" data-rt="${t}">${t}</div>`).join("")}</div><div class="ribbon" id="ribbon"></div>
 <div style="flex:1;display:flex;min-height:0"><div class="spane" style="width:200px"><b style="display:block;padding:4px;background:#eee">Toolbox</b><div id="tbox"></div></div><div style="flex:1;display:flex;flex-direction:column;min-width:0"><div id="vp" style="flex:1;position:relative;min-height:0"></div><div class="spane" style="height:110px"><b style="display:block;padding:2px 4px;background:#eee">Output</b><div id="out" style="font-family:monospace;font-size:12px;padding:4px"></div></div></div>
 <div style="width:240px;display:flex;flex-direction:column"><div class="spane" style="flex:1"><b style="display:block;padding:4px;background:#eee">Explorer</b><div class="etree" id="exp"></div></div><div class="spane" style="flex:1"><b style="display:block;padding:4px;background:#eee">Properties</b><div id="props" style="padding:4px"></div></div></div></div>`;
 const vp=$("#vp");const ren=new T.WebGLRenderer({antialias:true});vp.appendChild(ren.domElement);const scene=new T.Scene();scene.background=new T.Color(0xa9d4ff);const cam=new T.PerspectiveCamera(60,1,.1,2000);
 scene.add(new T.HemisphereLight(0xffffff,0x666666,.8));const dl=new T.DirectionalLight(0xffffff,.6);dl.position.set(50,100,30);scene.add(dl);
 const tx=studTex();tx.repeat.set(128,128);const base=new T.Mesh(new T.BoxGeometry(256,1,256),new T.MeshLambertMaterial({map:tx}));base.position.y=-.5;scene.add(base);
 let tool="Select",sel=null,drag=null,cy=.6,cp=1,cd=60;const meshes=new Map();
 const log=t=>{$("#out").innerHTML+=esc(t)+"<br>";$("#out").parentNode.scrollTop=1e6};
 function mk(p){const m=new T.Mesh(new T.BoxGeometry(1,1,1),new T.MeshLambertMaterial({color:p.color}));upd(m,p);scene.add(m);meshes.set(p,m)}
 function upd(m,p){m.scale.set(p.sx,p.sy,p.sz);m.position.set(p.x,p.y+p.sy/2,p.z);m.rotation.y=p.ry||0;m.material.color.set(p.color);m.material.emissive=new T.Color(sel===p?0x224466:0)}
 g.parts.forEach(mk);
 function persist(){g.updated=now();save()}
 function rib(t){const B={Home:["Select","Move","Scale","Rotate","Part","Play","Run","Stop"],Model:["Select","Move","Scale","Rotate","Part","Group","Anchor"],Test:["Play","Run","Stop"],View:["Explorer","Properties","Output","Toolbox"],Plugins:["Manage Plugins","Terrain Tools"]}[t];
  $("#ribbon").innerHTML=B.map(b=>`<button class="${b==tool?"on":""}" data-b="${b}"><svg width="26" height="26" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="3" fill="${{Play:"#02B757",Run:"#02B757",Stop:"#E2231A",Part:"#A1A5A2"}[b]||"#00A2FF"}"/></svg>${b}</button>`).join("");
  $$("#ribbon button").forEach(b=>b.onclick=()=>act(b.dataset.b,t))}
 function act(b,t){if(["Select","Move","Scale","Rotate"].includes(b)){tool=b;rib(t);return}
  if(b=="Part"){const p={name:"Part",x:Math.round(Math.random()*20-10),y:0,z:Math.round(Math.random()*20-10),sx:4,sy:1.2,sz:2,color:"#A1A5A2",anchored:true,ry:0};g.parts.push(p);mk(p);select(p);persist();log("Inserted Part")}
  else if(b=="Play"||b=="Run"){persist();log("Running place in client...");closeStudio();play(g.id)}else if(b=="Stop")log("Stopped.");
  else if(b=="Anchor"&&sel){sel.anchored=!sel.anchored;select(sel)}else log(b+" (not available in this demo)")}
 $$(".ribtabs div").forEach(d=>d.onclick=()=>{$$(".ribtabs div").forEach(x=>x.classList.remove("on"));d.classList.add("on");rib(d.dataset.rt)});rib("Home");
 $("#tbox").innerHTML=["Tree","House","Spawn","Brick Wall","Tower","Ramp"].map(n=>`<div style="padding:6px;cursor:pointer;border-bottom:1px solid #eee" data-n="${n}">▣ ${n}</div>`).join("");
 $$("#tbox div").forEach(d=>d.onclick=()=>{const n=d.dataset.n;const x=Math.round(Math.random()*30-15),z=Math.round(Math.random()*30-15);const add=(o)=>{const p={name:n,x,z,y:0,ry:0,anchored:true,...o};g.parts.push(p);mk(p);return p};
  if(n=="Tree"){add({sx:1,sy:6,sz:1,color:"#624732"});add({y:6,sx:5,sy:4,sz:5,color:"#4B974B"})}else if(n=="House"){add({sx:10,sy:6,sz:10,color:"#C4281C"});add({y:6,sx:11,sy:1,sz:11,color:"#624732"})}else if(n=="Spawn")add({sx:6,sy:1,sz:6,color:"#2154B9"});else if(n=="Brick Wall")add({sx:16,sy:6,sz:1,color:"#A34B4B"});else if(n=="Tower")add({sx:4,sy:20,sz:4,color:"#635F62"});else add({sx:4,sy:2,sz:8,color:"#F5CD30"});persist();drawExp();log("Inserted "+n+" from Toolbox")});
 function drawExp(){$("#exp").innerHTML=`<div>▾ Workspace</div><div style="padding-left:18px">Camera</div><div style="padding-left:18px">Baseplate</div>`+g.parts.map((p,i)=>`<div style="padding-left:18px" class="${p===sel?"sel":""}" data-i="${i}">▣ ${esc(p.name)}</div>`).join("")+["Players","Lighting","ReplicatedFirst","ReplicatedStorage","ServerScriptService","ServerStorage","StarterGui","StarterPack","StarterPlayer","SoundService","Chat"].map(s=>`<div>▸ ${s}</div>`).join("");$$("#exp [data-i]").forEach(d=>d.onclick=()=>select(g.parts[+d.dataset.i]))}
 function select(p){const old=sel;sel=p;if(old&&meshes.get(old))upd(meshes.get(old),old);if(p)upd(meshes.get(p),p);drawExp();
  $("#props").innerHTML=p?`<table style="font-size:12px">${[["Name","name","text"],["BrickColor","color","color"],["Position X","x"],["Position Y","y"],["Position Z","z"],["Size X","sx"],["Size Y","sy"],["Size Z","sz"]].map(([l,k,ty])=>`<tr><td>${l}</td><td><input data-k="${k}" type="${ty||"number"}" value="${esc(p[k])}" style="width:100px;font-size:12px;padding:1px"></td></tr>`).join("")}<tr><td>Anchored</td><td><input type="checkbox" id="panc" ${p.anchored?"checked":""}></td></tr></table><button id="pdel" style="font-size:12px">Delete</button>`:"<p style='color:#888'>Select an object.</p>";
  if(p){$$("#props [data-k]").forEach(i=>i.onchange=()=>{const k=i.dataset.k;p[k]=i.type=="number"?Math.max(k[0]=="s"?.2:-999,+i.value):i.value;upd(meshes.get(p),p);persist();drawExp()});$("#panc").onchange=e=>{p.anchored=e.target.checked;persist()};$("#pdel").onclick=()=>{scene.remove(meshes.get(p));meshes.delete(p);g.parts.splice(g.parts.indexOf(p),1);sel=null;select(null);persist();log("Deleted "+p.name)}}}
 select(null);
 const rc=new T.Raycaster(),plane=new T.Plane(new T.Vector3(0,1,0),0);
 const ndc=e=>{const r=ren.domElement.getBoundingClientRect();return{x:(e.clientX-r.left)/r.width*2-1,y:-(e.clientY-r.top)/r.height*2+1}};
 ren.domElement.oncontextmenu=e=>e.preventDefault();let rd=null;
 ren.domElement.onmousedown=e=>{if(e.button==2){rd={x:e.clientX,y:e.clientY};return}rc.setFromCamera(ndc(e),cam);const hits=rc.intersectObjects([...meshes.values()]);if(hits[0]){const p=[...meshes].find(([k,v])=>v===hits[0].object)[0];select(p);if(tool!="Select"){drag={p,sx:e.clientX,sy:e.clientY,o:{...p}};const pt=new T.Vector3();rc.ray.intersectPlane(plane,pt);drag.pt=pt}}else select(null)};
 window.onmousemove=e=>{if(rd){cy-=(e.clientX-rd.x)*.01;cp=Math.max(.1,Math.min(1.5,cp+(e.clientY-rd.y)*.01));rd={x:e.clientX,y:e.clientY};return}if(!drag)return;const p=drag.p;
  if(tool=="Move"){rc.setFromCamera(ndc(e),cam);const pt=new T.Vector3();if(rc.ray.intersectPlane(plane,pt)){p.x=Math.round(drag.o.x+pt.x-drag.pt.x);p.z=Math.round(drag.o.z+pt.z-drag.pt.z);if(e.shiftKey)p.y=Math.max(0,Math.round(drag.o.y-(e.clientY-drag.sy)*.1))}}
  else if(tool=="Scale"){p.sx=Math.max(1,Math.round(drag.o.sx+(e.clientX-drag.sx)*.1));p.sy=Math.max(.2,Math.round((drag.o.sy-(e.clientY-drag.sy)*.1)*5)/5)}
  else if(tool=="Rotate")p.ry=drag.o.ry+(e.clientX-drag.sx)*.02;
  upd(meshes.get(p),p)};
 window.onmouseup=()=>{if(drag){persist();select(drag.p);log(tool+" "+drag.p.name)}drag=null;rd=null};
 ren.domElement.onwheel=e=>{e.preventDefault();cd=Math.max(10,Math.min(300,cd*(e.deltaY>0?1.1:.9)))};
 $("#sclose").onclick=()=>{closeStudio();go("#/develop")};
 log("BLOX Studio ready. Right-drag to orbit, wheel to zoom. Move tool: drag (Shift+drag = up/down).");
 SD={gid:g.id,raf:0,ren};
 (function loop(){if(!SD)return;SD.raf=requestAnimationFrame(loop);const w=vp.clientWidth,h=vp.clientHeight;if(ren.domElement.width!=w*devicePixelRatio||ren.domElement.height!=h*devicePixelRatio){ren.setPixelRatio(devicePixelRatio);ren.setSize(w,h);cam.aspect=w/h;cam.updateProjectionMatrix()}
  cam.position.set(Math.sin(cy)*Math.cos(cp)*cd,Math.sin(cp)*cd,Math.cos(cy)*Math.cos(cp)*cd);cam.lookAt(0,0,0);ren.render(scene,cam)})();
 return null}
function closeStudio(){if(SD){cancelAnimationFrame(SD.raf);SD.ren.dispose();SD=null}window.onmousemove=window.onmouseup=null;$("#studio").classList.remove("on");$("#studio").innerHTML=""}

/* ================= BOOT ================= */
if(S.settings.theme=="dark")document.body.classList.add("dark");
refresh();
loadNoob();
