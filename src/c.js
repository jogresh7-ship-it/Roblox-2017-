/* ================= SHELL ================= */
function go(h){location.hash=h}
function modal(html,cls){const m=$("#modal");m.querySelector(".box").innerHTML=`<span class="x" onclick="closeModal()">×</span>`+html;m.classList.add("show")}
function closeModal(){$("#modal").classList.remove("show")}
$("#modal").addEventListener("click",e=>{if(e.target.id=="modal")closeModal()});
function toast(html,icon){const t=document.createElement("div");t.className="toast";t.innerHTML=(icon||"")+`<div>${html}</div>`;$("#toasts").appendChild(t);setTimeout(()=>t.remove(),4500)}
function notify(text,kind="text",extra={}){S.notifs.unshift({id:nid(),kind,text,t:now(),read:false,...extra});save();toast(text,extra.uid?headshot(userById(extra.uid),32,false):ico("bell",24,"#00A2FF"));renderHeader();if($("#notif").classList.contains("open"))renderNotif()}
function addTxn(desc,amt,type){S.txns.unshift({t:now(),desc,amt,type,member:S.me.name});}
let ddOpen=null;
document.addEventListener("click",e=>{if(!e.target.closest(".hb")&&!e.target.closest(".dd")){$$(".dd").forEach(d=>d.remove());ddOpen=null}});
function renderHeader(){const unread=S.notifs.filter(n=>!n.read).length;
 $("#hdr").innerHTML=`<a onclick="go('#/home')" class="logo">BLOX</a>
 <a class="navl hidesm" href="#/games">Games</a><a class="navl hidesm" href="#/catalog">Catalog</a><a class="navl hidesm" href="#/develop">Develop</a>
 <div id="search"><svg width="14" height="14" viewBox="0 0 24 24" style="color:#fff">${IC.search}</svg><input placeholder="Search" id="sq"></div>
 <span class="spacer"></span>
 <a class="hidesm" style="font-weight:600;cursor:default">${esc(S.me.name)}<span class="small" style="opacity:.7;margin-left:6px">13+</span></a>
 ${S.me.bc?`<span class="hb">${bcIcon(S.me.bc,20)}</span>`:""}
 <span class="hb" id="hgear">${ico("gear",20,"#fff")}</span>
 <span class="hb" id="hbell">${ico("bell",20,"#fff")}${unread?`<span class="bubble">${unread}</span>`:""}</span>`;
 const sq=$("#sq");sq.oninput=()=>{$$(".dd").forEach(d=>d.remove());const v=sq.value.trim();if(!v)return;const d=document.createElement("div");d.className="dd";d.style.left="0";
  d.innerHTML=["Games","Catalog","Library"].map(k=>`<div data-k="${k}">Search "${esc(v)}" in ${k}</div>`).join("");$("#search").appendChild(d);
  d.onclick=e=>{const k=e.target.dataset.k;doSearch(k,v)}};
 sq.onkeydown=e=>{if(e.key=="Enter")doSearch("Games",sq.value.trim())};
 const dd=(id,html)=>{$("#"+id).onclick=e=>{e.stopPropagation();$$(".dd").forEach(d=>d.remove());if(ddOpen==id){ddOpen=null;return}ddOpen=id;const d=document.createElement("div");d.className="dd";d.style.right="0";d.innerHTML=html;$("#"+id).appendChild(d)}};
/*bux removed*/ 0&&dd("hbux",`<div style="cursor:default"><b>${comma(S.bux)}</b> Bux</div><div onclick="go('#/upgrades/robux')">Buy Bux</div><div onclick="go('#/transactions')">My Transactions</div>`);
 dd("hgear",`<div onclick="go('#/settings')">Settings</div><div onclick="go('#/help')">Help</div><div onclick="showLogin()">Switch Account</div>`);
 $("#hbell").onclick=e=>{e.stopPropagation();$("#notif").classList.toggle("open");renderNotif()};}
function doSearch(k,v){$$(".dd").forEach(d=>d.remove());const q=encodeURIComponent(v);
 if(k=="Games")go("#/games?q="+q);else if(k=="Catalog")go("#/catalog?q="+q);else if(k=="Players")go("#/search/users?q="+q);else if(k=="Groups")go("#/groups?q="+q);else go("#/develop?tab=Library&q="+q)}
function toggleSide(){const w=innerWidth<=1300;if(w)document.body.classList.toggle("sideopen");else document.body.classList.toggle("sideclosed")}
function renderSide(){$("#side").style.display="none";return;const route=location.hash;const unreadM=S.messages.filter(m=>!m.read&&m.box!="sent"&&m.box!="archive").length;
 const L=[["home","Home","#/home"],["profile","Profile","#/users/0/profile"],["msg","Messages","#/messages",unreadM],["friends","Friends","#/friends",S.requests.length],["avatar","Avatar","#/avatar"],["inv","Inventory","#/inventory"],["trade","Trade","#/trade"],["groups","Groups","#/groups"],["forum","Forum","#/forum"],["blog","Blog","#/blog"],["shop","Shop","#/shop"]];
 $("#side").innerHTML=`<a class="me" href="#/users/0/profile">${headshot(meUser(),40,false)}<span>${esc(S.me.name)}</span></a>`+
 L.map(([i,n,h,b])=>`<a class="it ${route.startsWith(h)?"act":""}" href="${h}">${ico(i,18)}${n}${b?`<span class="bubble">${b}</span>`:""}</a>`).join("")+
 `<div style="padding:12px"><button class="btn-green" style="width:100%" onclick="go('#/premium/membership')">Upgrade Now</button></div>
 <div class="meta" style="padding:0 12px">Events</div>${[0,1].map(k=>`<a href="#/games/${k*7+4}" style="display:block;padding:6px 12px"><img src="${gameThumb(G[k*7+3],150,60)}" style="width:150px;height:60px;border-radius:3px"></a>`).join("")}`}
function renderNotif(){S.notifs.forEach(n=>{});
 $("#notif").innerHTML=`<div class="row between" style="padding:10px;border-bottom:1px solid var(--bd)"><h3 style="margin:0">Notifications</h3><a onclick="go('#/settings?tab=Notifications')">${ico("gear",18)}</a></div>`+
 (S.notifs.length?S.notifs.slice(0,40).map(n=>`<div class="nrow ${n.read?"":"unread"}">${n.uid!=null?headshot(userById(n.uid)||meUser(),40,false):ico("bell",32,"#00A2FF")}<div style="flex:1"><div>${n.text}</div><div class="small muted">${ago(n.t)}</div>
 ${n.kind=="freq"&&S.requests.includes(n.uid)?`<div class="row" style="margin-top:4px"><button class="btn-blue" onclick="acceptFR(${n.uid})">Accept</button><button onclick="ignoreFR(${n.uid})">Ignore</button></div>`:""}</div></div>`).join(""):`<p class="muted" style="padding:12px">No notifications.</p>`);
 setTimeout(()=>{S.notifs.forEach(n=>n.read=true);save();renderHeader()},1500)}
function acceptFR(id){S.requests=S.requests.filter(x=>x!=id);if(!S.friends.includes(id))S.friends.push(id);save();toast("You are now friends with "+esc(userById(id).name)+"!");refresh()}
function ignoreFR(id){S.requests=S.requests.filter(x=>x!=id);save();refresh()}
function refresh(){renderHeader();renderSide();route();renderDock()}

/* ---- purchase ---- */
function buyFlow(o){ // o:{name,creator,price,thumb,onBuy}
 if(S.bux<o.price){modal(`<h3>Insufficient Funds</h3><p>You need <b>B$ ${comma(o.price-S.bux)}</b> more to purchase this item.</p><div class="row"><button class="btn-green" onclick="closeModal();go('#/upgrades/robux')">Buy Bux</button><button onclick="closeModal()">Cancel</button></div>`);return}
 modal(`<h3>Buy Item</h3><div class="row"><img src="${o.thumb}" width="110" height="110" style="border-radius:3px"><p>Would you like to buy <b>${esc(o.name)}</b> from <b>${esc(o.creator)}</b> for ${o.price?`<b>${buxIco(14)} B$ ${comma(o.price)}</b>`:"<b class='price'>Free</b>"}?</p></div>
 <div class="row" style="margin-top:12px"><button class="btn-green" id="buynow">Buy Now</button><button onclick="closeModal()">Cancel</button></div><p class="small muted">Your balance after this transaction will be B$ ${comma(S.bux-o.price)}.</p>`);
 $("#buynow").onclick=()=>{S.bux-=o.price;addTxn("Purchased "+o.name,-o.price,"Purchases");o.onBuy();save();renderHeader();
  modal(`<h3>Purchase Complete!</h3><p>You have successfully bought <b>${esc(o.name)}</b>.</p><div class="row"><button class="btn-blue" onclick="closeModal();refresh()">Continue Shopping</button></div>`)}}
function buyItem(id,price,seller){const it=itemById(id);buyFlow({name:it.name,creator:seller?userById(seller).name:userById(it.creator).name,price:price??it.price,thumb:itemThumb(it),onBuy:()=>{S.inv.push(it.id);it.sales++;if(it.limited==2&&it.remaining>0)it.remaining--}})}
function buyPass(gid,pid){const g=gameById(gid),p=g.passes.find(x=>x.id==pid);buyFlow({name:p.name,creator:userById(g.creator)?.name||S.me.name,price:p.price,thumb:passIcon(p),onBuy:()=>S.passes.push(p.id)})}
function passIcon(p){return "data:image/svg+xml;charset=utf-8,"+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="#${(p.price*7919%0xaaaaaa+0x333333).toString(16).slice(0,6)}"/><text x="50" y="60" font-size="28" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="700">${esc(p.name.slice(0,4))}</text></svg>`)}

/* ---- play flow ---- */
function play(gid){const g=gameById(gid);
 modal(`<div style="text-align:center"><div class="spin"><i></i><i></i><i></i><i></i></div><h3 id="pst" style="border:0">Starting BLOX...</h3><div class="bar"><div id="pbar" style="width:0"></div></div></div>`);
 let p=0;setTimeout(()=>{$("#pst")&&($("#pst").textContent="Checking for updates...");const iv=setInterval(()=>{p+=12;if($("#pbar"))$("#pbar").style.width=p+"%";if(p>=100){clearInterval(iv);
   if(!S.installed){modal(`<h3>BLOX is now loading. Get ready to play!</h3><div class="row"><svg width="120" height="90" viewBox="0 0 120 90"><rect x="5" y="5" width="110" height="80" rx="4" fill="#eee" stroke="#999"/><rect x="5" y="5" width="110" height="14" fill="#00A2FF"/><rect x="20" y="35" width="80" height="10" fill="#ccc"/><rect x="20" y="35" width="50" height="10" fill="#02B757"/><rect x="40" y="58" width="40" height="14" rx="2" fill="#00A2FF"/><text x="60" y="68" font-size="9" fill="#fff" text-anchor="middle">RUN</text></svg><p>Click <b>RUN</b> when prompted by your browser to start BLOX.</p></div>
    <div class="row"><button class="btn-green" onclick="fakeInstall(${gid})">Download and Install</button><button onclick="S.installed=true;save();closeModal();go('#/play/${gid}')">I've already installed</button></div>`)}
   else{closeModal();go("#/play/"+gid)}}},120)},1000)}
function fakeInstall(gid){modal(`<div style="text-align:center"><h3>Installing BLOX...</h3><div class="spin"><i></i><i></i><i></i><i></i></div><div class="bar"><div id="ib" style="width:0"></div></div></div>`);let p=0;const iv=setInterval(()=>{p+=10;$("#ib")&&($("#ib").style.width=p+"%");if(p>=100){clearInterval(iv);S.installed=true;save();closeModal();go("#/play/"+gid)}},150)}

/* ---- chat dock ---- */
let dockOpen=false,openChats=[];
function renderDock(){if(true){$("#chatdock").innerHTML="";return}
 const fr=S.friends.map(userById).filter(Boolean).sort((a,b)=>(b.pres?1:0)-(a.pres?1:0));const unread=Object.values(S.chatlogs).reduce((a,l)=>a+l.filter(m=>!m.me&&!m.read).length,0);
 let h=`<div class="cpanel"><div class="ch" onclick="dockOpen=!dockOpen;renderDock()"><span>Chat &amp; Party ${unread?`<span class="bubble">${unread}</span>`:""}</span><span>${dockOpen?"▾":"▴"}</span></div>`;
 if(dockOpen)h+=`<div style="padding:6px"><input id="dsrch" placeholder="Search friends" style="width:100%" oninput="$$('.dfr').forEach(r=>r.style.display=r.dataset.n.toLowerCase().includes(this.value.toLowerCase())?'flex':'none')"></div><div style="padding:0 6px 6px"><button class="btn-blue" style="width:100%" onclick="createParty()">Create Party</button></div>${S.party?`<div style="padding:6px;background:var(--bg);font-size:13px"><b>Party:</b> ${S.party.map(i=>esc(userById(i).name)).join(", ")} <a onclick="play(${S.party.length+2})">Join Party Game</a> · <a onclick="S.party=null;save();renderDock()">Leave</a></div>`:""}<div class="cb">${fr.map(u=>`<div class="row dfr" data-n="${esc(u.name)}" style="padding:5px 8px;cursor:pointer" onclick="openChat(${u.id})">${headshot(u,30)}<div><div style="font-size:14px">${esc(u.name)}</div><div class="small muted">${esc(presText(u))}</div></div></div>`).join("")}</div>`;
 h+="</div>";
 openChats.forEach(id=>{const u=userById(id),log=S.chatlogs[id]||[];log.forEach(m=>m.read=true);
  h+=`<div class="cpanel"><div class="ch"><span onclick="go('#/users/${id}/profile')">${esc(u.name)}</span><span onclick="openChats=openChats.filter(x=>x!=${id});renderDock()">×</span></div><div class="cb" id="cb${id}" style="height:240px">${log.map(m=>`<div class="cmsg ${m.me?"me":"them"}">${esc(m.text)}<div style="font-size:10px;opacity:.6">${new Date(m.t).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"})}</div></div>`).join("")}<div id="typ${id}" class="small muted" style="padding:4px 8px"></div></div><input style="width:100%;border-radius:0" placeholder="Send a message" onkeydown="if(event.key=='Enter'&&this.value.trim()){sendChat(${id},this.value);this.value=''}"></div>`});
 $("#chatdock").innerHTML=h;openChats.forEach(id=>{const b=$("#cb"+id);if(b)b.scrollTop=1e6})}
function openChat(id){if(!openChats.includes(id)){openChats.unshift(id);if(openChats.length>3)openChats.pop()}save();renderDock()}
function sendChat(id,text){(S.chatlogs[id]=S.chatlogs[id]||[]).push({me:true,text,t:now()});save();renderDock();
 setTimeout(()=>{const t=$("#typ"+id);if(t)t.textContent=userById(id).name+" is typing…"},500);
 setTimeout(()=>{S.chatlogs[id].push({me:false,text:pick(["lol","yeah!","sure","wanna play?","brb","cool","what game?","haha nice","ok","hi :)"],Math.random),t:now(),read:openChats.includes(id)});save();renderDock()},1000+Math.random()*2000)}
function createParty(){const on=S.friends.map(userById).filter(u=>u.pres);modal(`<h3>Create Party</h3><p>Invite friends:</p>${on.map(u=>`<label class="row" style="padding:3px"><input type="checkbox" value="${u.id}" class="pinv">${headshot(u,28)}${esc(u.name)}</label>`).join("")||"<p class=muted>No friends online.</p>"}<button class="btn-blue" onclick="S.party=$$('.pinv').filter(c=>c.checked).map(c=>+c.value);if(!S.party.length)S.party=null;save();closeModal();renderDock();S.party&&toast('Party created!')">Create</button>`)}

/* ---- events ---- */
setInterval(()=>{if(!S.loggedIn||$("#game").classList.contains("on"))return;const r=Math.random;const u=pick(U.slice(1),r);const k=1;
 if(k==0&&!isFriend(u.id)&&!S.requests.includes(u.id)){S.requests.push(u.id);notify(`<b>${esc(u.name)}</b> sent you a friend request.`,"freq",{uid:u.id})}
 else if(k==1)notify(`<b>${esc(pick(G,r).name)}</b> was updated.`,"text");
 else if(k==2){const g=pick(GRP,r);notify(`Group shout from <b>${esc(g.name)}</b>: ${esc(g.shout.text)}`,"text")}
 else{S.messages.unshift({id:nid(),from:u.id,subj:"hey!",body:"Hey, want to play "+pick(G,r).name+" with me?",t:now(),read:false,box:"inbox"});notify(`New message from <b>${esc(u.name)}</b>`,"text",{uid:u.id})}
 renderSide()},45000);

/* ================= ROUTER ================= */
let curTimer=null;
function parseHash(){const h=location.hash.slice(1)||"/home";const [p,q]=h.split("?");const qs={};(q||"").split("&").forEach(kv=>{if(kv){const [k,v]=kv.split("=");qs[k]=decodeURIComponent(v||"")}});return{parts:p.split("/").filter(Boolean),qs}}
function route(){clearInterval(curTimer);window.onscroll=null;const {parts,qs}=parseHash();const m=$("#main");
 document.body.classList.toggle("dark",S.settings.theme=="dark");
 S.loggedIn=true;if(false){$("#hdr").style.display=$("#side").style.display="none";m.style.margin="0";m.style.padding="0";m.innerHTML=pageLanding();bindLanding();return}
 $("#hdr").style.display="";m.style.margin="";m.style.marginLeft="0";m.style.padding="";
 if(parts[0]!="play")stopGame();if(parts[0]!="studio")closeStudio();
 const P={home:pageHome,games:pageGames,catalog:pageCatalog,develop:pageDevelop,upgrades:pageBux,premium:pageBC,transactions:pageTxn,settings:pageSettings,play:pagePlay,help:pageText,about:pageText,jobs:pageText,parents:pageText,terms:pageText,privacy:pageText,studio:pageStudio};
 const f=P[parts[0]];let html;try{html=f?f(parts,qs):page404()}catch(e){console.error(e);html=page404()}
 if(html!=null){m.innerHTML=html+footer();scrollTo(0,0)}
 renderSide();const af=window._after;window._after=null;af&&af()}
const after=fn=>window._after=fn;
window.addEventListener("hashchange",route);
function footer(){return `<footer><div><a href="#/about">About Us</a><a href="#/jobs">Jobs</a><a href="#/parents">Parents</a><a href="#/help">Help</a><a href="#/terms">Terms</a><a href="#/privacy">Privacy</a></div><div style="margin-top:10px"><select onchange="S.settings.lang=this.value;save();toast('Language set to '+this.value)">${["English","Español","Français","Deutsch","Português"].map(l=>`<option ${S.settings.lang==l?"selected":""}>${l}</option>`).join("")}</select></div><p class="small">Character model: "R6 Roblox Noob [Animated]" by Fog (<a href="https://sketchfab.com/fog_">sketchfab.com/fog_</a>), licensed under <a href="http://creativecommons.org/licenses/by/4.0/">CC-BY-4.0</a>. Font: BobloxClassic.</p><p>©2017 BLOX Corporation (fictional). BLOX, the BLOX logo and Powering Imagination are placeholder marks for this demo.</p></footer>`}
function page404(){return `<div class="wrap card" style="text-align:center;padding:40px"><svg width="160" height="120" viewBox="0 0 160 120"><rect x="50" y="20" width="60" height="50" fill="#F5CD30"/><circle cx="68" cy="40" r="4"/><circle cx="92" cy="40" r="4"/><path d="M66 58 Q80 48 94 58" stroke="#111" stroke-width="3" fill="none"/><rect x="30" y="80" width="100" height="10" fill="#A1A5A2"/></svg><h2>Page cannot be found or no longer exists</h2><div class="row" style="justify-content:center"><button onclick="history.back()">Go to Previous Page</button><button class="btn-blue" onclick="go('#/home')">Return Home</button></div></div>`}
function carousel(cards){const id="c"+Math.random().toString(36).slice(2,7);return `<div class="car"><button class="arr l" onclick="$('#${id}').scrollLeft-=600">‹</button><div class="track" id="${id}">${cards}</div><button class="arr r" onclick="$('#${id}').scrollLeft+=600">›</button></div>`}
function gcard(g){const pct=Math.round(g.up/(g.up+g.dn)*100);return `<div class="gcard" onclick="go('#/games/${g.id}')"><img src="${gameThumb(g)}" loading="lazy"><div class="t">${esc(g.name)}</div><div class="s"><span>${ico("up",11)} ${pct}%</span><span>${fmt(g.playing)} Playing</span></div><div class="tip">By ${esc(userById(g.creator)?.name||S.me.name)}</div></div>`}
function icard(it,extra=""){return `<div class="icard" onclick="go('#/catalog/${it.id}')"><img src="${itemThumb(it)}" loading="lazy">${it.limited?`<span class="ltd">LIMITED${it.limited==2?" <b>U</b>":""}</span>`:""}<div class="n">${esc(it.name)}</div><div class="small muted">By ${esc(userById(it.creator).name)}</div>${it.offsale?`<div class="small muted">Off Sale</div>`:`<div class="price ${it.price?"paid":""}">${it.price?buxIco(12)+" "+comma(it.price):"Free"}</div>`}${it.limited==2?`<div class="small muted">Remaining: ${comma(it.remaining)}</div>`:""}${extra}</div>`}
function pager(cur,total,fn){if(total<=1)return"";let h=`<div class="row" style="justify-content:center;margin:12px 0"><button ${cur<=1?"disabled":""} onclick="${fn}(${cur-1})">‹</button>`;for(let i=1;i<=total;i++)if(i<=2||i>total-2||Math.abs(i-cur)<=1)h+=`<button class="${i==cur?"btn-blue":""}" onclick="${fn}(${i})">${i}</button>`;else if(Math.abs(i-cur)==2)h+="…";return h+`<button ${cur>=total?"disabled":""} onclick="${fn}(${cur+1})">›</button></div>`}
function setQ(k,v){const {parts,qs}=parseHash();qs[k]=v;go("#/"+parts.join("/")+"?"+Object.entries(qs).filter(([a,b])=>b!==""&&b!=null).map(([a,b])=>a+"="+encodeURIComponent(b)).join("&"))}
