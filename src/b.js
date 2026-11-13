"use strict";
/* ================= CORE: RNG, DATA, STORE ================= */
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
function rng(seed){let s=seed>>>0||1;return()=>{s^=s<<13;s>>>=0;s^=s>>17;s^=s<<5;s>>>=0;return s/4294967296}}
const R=rng(20170812);const pick=(a,r=R)=>a[Math.floor(r()*a.length)];const ri=(a,b,r=R)=>a+Math.floor(r()*(b-a+1));
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const fmt=n=>n>=1e9?(n/1e9).toFixed(1)+"B":n>=1e6?(n/1e6).toFixed(1)+"M":n>=1e4?(n/1e3).toFixed(1)+"K":Number(n).toLocaleString();
const comma=n=>Number(n).toLocaleString();
const DAY=864e5,NOW0=new Date(2017,9,14,15,0).getTime();
const now=()=>Date.now();
function ago(t){const d=(now()-t)/1000;if(d<60)return"just now";if(d<3600)return Math.floor(d/60)+" minutes ago";if(d<86400)return Math.floor(d/3600)+" hours ago";if(d<86400*30)return Math.floor(d/86400)+" days ago";return new Date(t).toLocaleDateString()}
const dstr=t=>new Date(t).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});

const BRICK=["#F2F3F3","#A1A5A2","#F9E999","#D7C59A","#C2DAB8","#E8BAC8","#80BBDB","#CB8442","#CC8E69","#C4281C","#C470A0","#0D69AC","#F5CD30","#624732","#635F62","#1B2A35","#4B974B","#A34B4B","#DA8541","#287F47","#A5BCDE","#E29B40","#7B2E2F","#B4D2E4","#923978","#6E99CA","#9FC3E9","#2154B9","#1E1E1E","#1C281C","#FFFFFF","#000000","#11FF00","#00FFFF","#FF00BF","#FFFF00","#FF0000","#0010B0","#5A4C42","#A05F35","#CDCDCD","#E5E4DF","#B1E5A6","#98C2DB","#FFC9C9","#B1A7FF","#D3BE96","#8F4C2A","#FD8EBC","#AA5500","#D4C4A8","#AF9483","#3A7D15","#467C47","#5B9A4C","#8DB78E","#7C9C6B","#E8AB2D","#FFB000","#C7D4E4","#9CA3A8","#575857","#8A6F49","#69403C"];
const SKIN="#F5CD30";
const ADJ=["Epic","Super","Mega","Classic","Ultimate","Crazy","Haunted","Ninja","Pirate","Space","Medieval","Speed","Retro","Mystery","Lava","Ice","Neon","Tiny","Giant","Secret"];
const NOUN=["Obby","Tycoon","Town","Simulator","Escape","Wars","Island","Roleplay","Castle","Racing","Paintball","Survival","Hide and Seek","Prison Life","Pizza Place","Elevator","Disaster","Sword Fight","Parkour","Theme Park"];
const GENRES=["Building","Horror","Town and City","Military","Comedy","Medieval","Adventure","Sci-Fi","Naval","FPS","RPG","Sports","Fighting","Western"];
const UN1=["xX","","","epic","Noob","Pro","Cool","Mr","Builder","Dark","Super","Blox","Mega","Iron","Shadow","Lil"];
const UN2=["Builder","Master","Gamer","Ninja","Dragon","Knight","Player","Guy","Girl","Wolf","Creeper","Pickle","Brick","Cookie","Pizza","Kitten","Racer","Blaster","Coder","Panda"];
const UN3=["Xx","2009","44","123","99","_YT","2007","","x","777","2010","_RBX","42","2016","Pro","_"];

const CAT={ "Clothing":["Shirts","T-Shirts","Pants","Packages"],"Body Parts":["Heads","Faces","Packages"],
 "Gear":["Melee","Ranged","Explosive","Power Up","Navigation","Musical","Social","Transport","Building"],
 "Accessories":["Hats","Hair","Face","Neck","Shoulder","Front","Back","Waist"],"Avatar Animations":["Animations"]};
const ITEMWORDS={Hats:["Fedora","Top Hat","Cap","Crown","Viking Helm","Party Hat","Beanie","Cowboy Hat","Tiara","Traffic Cone"],Hair:["Brown Hair","Blonde Spikes","Black Ponytail","Pal Hair","Red Swoop","Messy Hair"],Face:["Shades","Eyepatch","Goggles","Monocle","Mask"],Neck:["Scarf","Bow Tie","Chain","Cape Collar"],Shoulder:["Parrot","Shoulder Pet","Pauldron"],Front:["Badge","Medal"],Back:["Wings","Backpack","Jetpack","Sword Sheath"],Waist:["Belt","Pouch"],
 Shirts:["Hoodie","Suit","Plaid Shirt","Jersey","Tuxedo","Armor"],"T-Shirts":["Smile Tee","Bacon Tee","Logo Tee","Pizza Tee","Star Tee"],Pants:["Jeans","Shorts","Cargo Pants","Suit Pants","Track Pants"],Packages:["Ninja Package","Knight Package","Robot Package"],
 Heads:["Blockhead","Roundy","Trim","Peabrain","Cylinder Head"],Faces:["Smile","Winning Smile","Chill","Freckles","Super Happy","Silly Fun","Man Face","Epic Face","Check It"],
 Melee:["Sword","Katana","Hammer","Battle Axe"],Ranged:["Slingshot","Laser Gun","Paintball Gun","Bow"],Explosive:["Rocket Launcher","Bomb","Grenade"],"Power Up":["Gravity Coil","Speed Coil","Fusion Coil"],Navigation:["Grapple Hook","Magic Carpet"],Musical:["Guitar","Boombox"],Social:["Cheezburger","Pizza Slice","Cola"],Transport:["Hoverboard","Skateboard"],Building:["Build Tool","Brick Wand"],
 Animations:["Ninja Animation","Zombie Animation","Robot Animation","Levitation","Stylish"]};
const MSGS_CHAT=["can someone give me admin","lol","follow me","who wants to be friends","noob","oof","how do u jump that","gg","brb","free bux at my profile!!1 (scam dont click)","anyone wanna trade","im lagging","this game is epic","whats ur fav game","stop following me","pls donate","sub to my channel","my mom is calling me","teamwork!","Yay!"];

const U=[];
(function seedUsers(){const used={};for(let i=2;i<=40;i++){let n;do{n=pick(UN1)+pick(UN2)+pick(UN3)}while(used[n]||n.length<5);used[n]=1;
 const c={head:SKIN,torso:pick(BRICK),la:SKIN,ra:SKIN,ll:pick(BRICK),rl:pick(BRICK)};c.rl=c.ll;
 U.push({id:i,name:n,bc:R()<.3?ri(1,3):0,blurb:pick(["I love building!","Add me :)","Pro obby player","Dont send me friend requests unless we played","Scripter | Builder","Making my first game!","Trade me limiteds","Just here to have fun"]),colors:c,hat:R()<.6?ri(0,9):-1,face:ri(0,8),
  pres:R()<.25?2:R()<.45?1:R()<.05?3:0,last:NOW0-ri(1,500)*36e5,joined:NOW0-ri(100,3500)*DAY,posts:ri(0,5000),followers:ri(0,20000),following:ri(0,300),friendsN:ri(5,200)})}})();
U.unshift({id:1,name:"BLOX",bc:3,blurb:"Official BLOX account.",colors:{head:SKIN,torso:"#1B2A35",la:SKIN,ra:SKIN,ll:"#1B2A35",rl:"#1B2A35"},hat:1,face:1,pres:1,last:NOW0,joined:NOW0-4000*DAY,posts:12,followers:9e6,following:0,friendsN:0});
const userById=id=>U.find(u=>u.id==id);
const G=[];
(function seedGames(){const gr=rng(77);for(let i=1;i<=46;i++){const up=ri(200,90000,gr),dn=Math.floor(up*(0.03+gr()*.3));
 G.push({id:i,name:i==1?"Classic Obby Course":pick(ADJ,gr)+" "+pick(NOUN,gr)+(gr()<.2?" ["+pick(["UPDATE!","BETA","NEW!","2X COINS"],gr)+"]":""),creator:pick(U,gr).id,genre:pick(GENRES,gr),playing:Math.floor(Math.pow(gr(),3)*60000),visits:ri(1e4,9e8,gr),up,dn,fav:ri(100,2e6,gr),created:NOW0-ri(30,2500,gr)*DAY,updated:NOW0-ri(0,60,gr)*DAY,maxp:pick([6,8,10,12,15,20,30,50],gr),seed:ri(1,1e9,gr),sponsored:gr()<.1,paid:gr()<.08?ri(5,100,gr):0,
  desc:"Welcome to "+"the game! "+pick(["Beat all the stages to win a badge!","Build the best base and earn coins.","Survive the night with your friends.","Escape before time runs out!","Thumbs up and favorite for more updates!"],gr)+" Join our group for a free shirt.",
  passes:[{id:"p"+i+"a",name:"VIP",price:ri(50,400,gr)},{id:"p"+i+"b",name:"2x Coins",price:ri(25,250,gr)},{id:"p"+i+"c",name:"Speed Boost",price:ri(15,150,gr)}],
  badges:[{n:"Welcome!",d:"You joined the game.",r:ri(40,90,gr)},{n:"Halfway There",d:"Reach stage 5.",r:ri(10,40,gr)},{n:"Obby Master",d:"Finish the obby!",r:ri(1,10,gr)}],gear:gr()<.6})}})();
const I=[];
(function seedItems(){const ir=rng(99);let id=1;for(const top in CAT)for(const sub of CAT[top]){for(const w of ITEMWORDS[sub]){const lim=ir()<.12?(ir()<.5?2:1):0;const base=pick([0,0,5,10,25,50,75,100,150,250,400,1000],ir);
 I.push({id:id++,name:(ir()<.4?pick(["Red","Blue","Golden","Dark","Sparkle","Classic","Domino","Neon","Bling"],ir)+" ":"")+w,top,sub,creator:ir()<.7?1:pick(U,ir).id,price:lim?ri(500,30000,ir):base,limited:lim,remaining:lim==2?ri(0,2000,ir):0,orig:base||ri(50,500,ir),offsale:!lim&&ir()<.05,fav:ri(10,80000,ir),sales:ri(0,90000,ir),color:pick(BRICK.slice(0,30),ir),color2:pick(BRICK,ir),updated:NOW0-ri(0,1500,ir)*DAY,seed:ri(1,1e9,ir)})}}
 while(I.length<130){const t=I[ri(0,I.length-1,ir)];I.push({...t,id:id++,name:pick(["Super ","Epic ","Mini ","Ultra "],ir)+t.name,color:pick(BRICK,ir),seed:ri(1,1e9,ir),price:t.limited?t.price:pick([0,10,35,80,120],ir),fav:ri(10,5000,ir)})}})();
const itemById=id=>I.find(x=>x.id==id);
const GRP=[];["Builders Guild","Obby Makers Inc","The Pizza Crew","Knights of BLOX","Space Explorers","Scripting Academy","Trade Hub","Anime Fans","Military Academy","Fashion Designers"].forEach((n,i)=>{const gr=rng(500+i);GRP.push({id:i+1,name:n,owner:pick(U,gr).id,members:ri(50,900000,gr),color:pick(BRICK.slice(5,30),gr),desc:"Welcome to "+n+"! Be respectful, follow the rules and have fun.",shout:{by:pick(U,gr).id,t:NOW0-ri(1,90,gr)*36e5,text:pick(["Meeting at the HQ at 5pm!","New uniforms in the store.","Rank tryouts this Saturday.","Thanks for 10k members!!"],gr)},allies:[ (i+1)%10+1],enemies:[(i+4)%10+1],wall:Array.from({length:14},(_,k)=>({by:pick(U,gr).id,t:NOW0-k*5e6,text:pick(["hi","can i get a rank","when is the next event","this group is awesome","lol","who wants to play"],gr)}))})});
const FCATS=[["Help (Technical Support and Account Issues)","Help"],["Game Design","Development"],["Scripting Helpers","Development"],["Clan Discussion","Club Houses"],["Off Topic","Club Houses"],["Let's Make a Deal","Club Houses"]];

/* ================= STORE ================= */
const KEY="blox2017_store_v2";
function defaultStore(){const fr=[],rq=[];U.slice(1).forEach((u,i)=>{if(i<14)fr.push(u.id);else if(i<17)rq.push(u.id)});
 const msgs=[];const mr=rng(3);for(let i=0;i<25;i++){const f=i<3?1:pick(U,mr).id;msgs.push({id:i+1,from:f,to:0,subj:i<3?pick(["Welcome to BLOX!","Your account security","New features!"],mr):pick(["hey","trade?","Can you play with me","Join my group","re: my game","Thanks!","question about your game"],mr),body:pick(["Hello! Want to play together sometime?","I saw your avatar, its so cool. Wanna trade?","Hey can you check out my new game? Its called Super Obby.","Thank you for being part of the BLOX community! Have fun and stay safe.","Do you want to join our group? We have events every week."],mr),t:NOW0-i*7e6,read:i>5,box:i<3?"news":"inbox"})}
 const threads=[];const tr=rng(4);for(let i=0;i<50;i++){const c=i%FCATS.length;threads.push({id:i+1,cat:c,title:pick(["How do I make a door that opens?","Rate my game 1-10","Best obby ever???","Selling limiteds cheap","My account got hacked help","Whats your favorite hat","Scripting question: loops","Clan recruitment!","Idea for a new game","Is BLOX down?","I made a sword script","Post your avatar"],tr)+(i>11?" #"+i:""),by:pick(U,tr).id,sticky:i<3,locked:i==2,views:ri(10,9000,tr),posts:Array.from({length:ri(1,8,tr)},(_,k)=>({by:pick(U,tr).id,t:NOW0-(50-i)*36e5+k*6e5,text:pick(["Can someone help me with this?","I think you need to use a script for that.","bump","lol same","Nice work! keep it up","Did you try turning it off and on again?","Try using a while loop with wait().","Thats so cool!!"],tr)}))})}
 const trades=[];[["inbound",2],["inbound",3],["outbound",4],["completed",5],["inactive",6]].forEach(([s,u],k)=>trades.push({id:k+1,with:U[u+2].id,status:s,t:NOW0-k*DAY,mine:[],theirs:[I.find(x=>x.limited).id],myBux:0,theirBux:k*100}));
 return {loggedIn:true,me:{name:"Player",id:0,bc:0,blurb:"Hi! I love BLOX.",status:"",joined:now()},bux:1250,inv:[I.find(x=>x.sub=="Faces").id,I.find(x=>x.sub=="T-Shirts").id,I.find(x=>x.limited).id],passes:[],
  equipped:[],colors:{head:SKIN,torso:"#0D69AC",la:SKIN,ra:SKIN,ll:"#A34B4B",rl:"#A34B4B"},rig:"R6",scale:{h:100,w:100,hd:100,p:0,bt:0},outfits:[],
  friends:[],requests:[],following:[],followers:[],messages:[],favGames:[],votes:{},played:[],recent:[],groups:[],primaryGroup:null,trades:[],threads,
  settings:{theme:"light",twofa:false,privMsg:"Everyone",privChat:"Everyone",privInvite:"Friends",privTrade:"Everyone",birthday:"2005-06-15",gender:"",lang:"English",shiftlock:true,quality:7,volume:60,sens:50,invert:false,camMode:"Default (Classic)",moveMode:"Default (Keyboard)",perf:false,gfxMode:"Automatic",notifs:true},
  notifs:[{id:1,kind:"text",text:"Welcome to BLOX! Customize your avatar to get started.",t:now()-6e5,read:false}],txns:[],badges:[],feed:[],comments:{},creations:[],chatlogs:{},myGroupsOwned:[],gameFavs:{},itemFavs:{},blocked:[],nextId:1000}}
let S;try{S=JSON.parse(localStorage.getItem(KEY))}catch(e){S=null}
if(!S||!S.me)S=defaultStore();
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
const nid=()=>++S.nextId;
const owns=id=>S.inv.includes(+id);
const meUser=()=>({id:0,name:S.me.name,bc:S.me.bc,colors:S.colors,equipped:S.equipped});
function allGames(){return G.concat(S.creations.filter(c=>c.kind=="game"))}
const gameById=id=>allGames().find(g=>g.id==id);
const isFriend=id=>S.friends.includes(+id);
function presText(u){if(u.id===0)return"Online";return u.pres==2?"Playing "+gameById((u.id%40)+1).name:u.pres==1?"Online":u.pres==3?"In Studio":"Last online "+ago(u.last)}
const presColor=p=>p==2?"#00A2FF":p==1?"#02B757":p==3?"#F68802":"";

/* ================= GRAPHICS: avatar & thumbs ================= */
function eqItems(list){return(list||[]).map(itemById).filter(Boolean)}
function avatarSVG(o={}){const sz=o.size||150;return `<img src="${renderAvatar({colors:o.colors||S.colors,items:o.items||S.equipped,head:o.head,bg:o.bg})}" width="${sz}" height="${sz}" style="display:block;${o.bg?"background:"+o.bg:""}">`}
function uAv(u,size,head){if(!u||u.id===0)return avatarSVG({size,head,bg:head?"#dfe3e6":undefined});
 const items=[];if(u.hat>=0)items.push(I.filter(x=>x.sub=="Hats")[u.hat%10]?.id);if(u.face>=0)items.push(I.filter(x=>x.sub=="Faces")[u.face%9]?.id);
 return avatarSVG({colors:u.colors,items,size,head,bg:head?"#dfe3e6":undefined})}
function headshot(u,size=48,pres=true){const p=u.id===0?1:u.pres;return `<div style="position:relative;width:${size}px;height:${size}px;flex:0 0 ${size}px"><div style="border-radius:50%;overflow:hidden;width:${size}px;height:${size}px;background:#dfe3e6">${uAv(u,size,true)}</div>${pres&&presColor(p)?`<span class="pres" style="background:${presColor(p)}"></span>`:""}</div>`}
const thumbCache={};
function gameThumb(g,w=150,h=150,v=0){const k=g.seed+"_"+w+"_"+h+"_"+v;if(thumbCache[k])return thumbCache[k];
 const c=document.createElement("canvas");c.width=w;c.height=h;const x=c.getContext("2d");const r=rng(g.seed+v*31);
 const sky=x.createLinearGradient(0,0,0,h);const hue=ri(180,230,r);sky.addColorStop(0,`hsl(${hue},70%,55%)`);sky.addColorStop(1,`hsl(${hue},70%,85%)`);x.fillStyle=sky;x.fillRect(0,0,w,h);
 x.fillStyle="#fff8";for(let i=0;i<3;i++){const cx=r()*w,cy=r()*h*.3;x.fillRect(cx,cy,w*.2,h*.05);x.fillRect(cx+w*.04,cy-h*.03,w*.1,h*.04)}
 const gy=h*(.6+r()*.15);x.fillStyle=pick(["#4B974B","#3A7D15","#A1A5A2","#D7C59A","#635F62"],r);x.fillRect(0,gy,w,h-gy);
 x.strokeStyle="#0001";for(let i=0;i<w;i+=w/15){x.beginPath();x.moveTo(i,gy);x.lineTo(i,h);x.stroke()}
 const n=ri(4,9,r);for(let i=0;i<n;i++){const bw=w*(.08+r()*.2),bh=h*(.05+r()*.35),bx=r()*(w-bw),by=gy-bh+h*.02*i;x.fillStyle=pick(BRICK.slice(5,30),r);x.fillRect(bx,by,bw,bh);x.fillStyle="#0002";x.fillRect(bx+bw*.75,by,bw*.25,bh);x.fillStyle="#fff3";x.fillRect(bx,by,bw,bh*.12)}
 // little avatar
 const ax=w*(.3+r()*.4),ay=gy-h*.18,s=h/150;x.fillStyle=SKIN;x.fillRect(ax+3*s,ay,8*s,8*s);x.fillStyle=pick(BRICK,r);x.fillRect(ax,ay+8*s,14*s,12*s);x.fillStyle="#333";x.fillRect(ax+1*s,ay+20*s,12*s,10*s);
 return thumbCache[k]=c.toDataURL()}
function itemThumb(it,size=110){const k="i"+it.id+"_"+size;if(thumbCache[k])return thumbCache[k];
 if(it.top=="Accessories"||it.top=="Clothing"||it.sub=="Faces"||it.sub=="Heads"){const r=renderAvatar({colors:{head:SKIN,torso:"#A1A5A2",la:SKIN,ra:SKIN,ll:"#A1A5A2",rl:"#A1A5A2"},items:[it.id],head:it.top=="Accessories"||it.sub=="Faces"||it.sub=="Heads",bg:"#eef0f2"});if(NOOB)thumbCache[k]=r;return r}
 const inner=it.top=="Gear"?`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${size}" height="${size}" style="background:#eef0f2"><g transform="rotate(${it.seed%60-30} 50 50)"><rect x="45" y="12" width="10" height="56" fill="${it.color}" stroke="#0004"/><rect x="34" y="66" width="32" height="7" fill="#555"/><rect x="46" y="72" width="8" height="16" fill="#624732"/></g></svg>`:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${size}" height="${size}" style="background:#eef0f2"><circle cx="50" cy="30" r="10" fill="${it.color}"/><path d="M50 40 L35 70 M50 40 L65 60 M50 40 L50 75 L40 95 M50 75 L62 92" stroke="${it.color}" stroke-width="6" fill="none"/></svg>`;
 return thumbCache[k]="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(inner)}
function groupEmblem(g,size=64){return `<svg width="${size}" height="${size}" viewBox="0 0 64 64" style="display:block;border-radius:3px"><rect width="64" height="64" fill="${g.color}"/><path d="M32 8 L54 18 V34 Q54 50 32 58 Q10 50 10 34 V18Z" fill="#fff3" stroke="#fff" stroke-width="2"/><text x="32" y="40" text-anchor="middle" font-size="22" font-weight="700" fill="#fff" font-family="Arial">${esc(g.name[0])}</text></svg>`}
const IC={
 home:'<path d="M3 11 L12 3 L21 11 V21 H15 V14 H9 V21 H3Z"/>',profile:'<circle cx="12" cy="8" r="5"/><path d="M3 22 Q12 10 21 22Z"/>',msg:'<path d="M2 5h20v14H2z M2 5l10 8 10-8" fill="none" stroke="currentColor" stroke-width="2"/>',
 friends:'<circle cx="8" cy="8" r="4"/><circle cx="17" cy="9" r="3"/><path d="M1 21 Q8 11 15 21Z M13 21 Q17 13 23 21Z"/>',avatar:'<rect x="8" y="2" width="8" height="7"/><rect x="6" y="10" width="12" height="7"/><rect x="7" y="17" width="4" height="6"/><rect x="13" y="17" width="4" height="6"/>',
 inv:'<path d="M3 7h18v14H3z M8 7V4h8v3" fill="none" stroke="currentColor" stroke-width="2"/>',trade:'<path d="M4 8h14l-4-4 M20 16H6l4 4" fill="none" stroke="currentColor" stroke-width="2"/>',groups:'<path d="M12 2 L21 6 V12 Q21 19 12 22 Q3 19 3 12 V6Z"/>',
 forum:'<path d="M2 3h15v10H7l-5 4z M19 7h3v13l-4-3h-8v-2" />',blog:'<path d="M4 3h16v18H4z M7 7h10M7 11h10M7 15h6" fill="none" stroke="currentColor" stroke-width="2"/>',shop:'<path d="M3 8h18l-2 13H5z M8 8a4 4 0 0 1 8 0" fill="none" stroke="currentColor" stroke-width="2"/>',
 gear:'<circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="3"/><path d="M12 1v5M12 18v5M1 12h5M18 12h5M4 4l3.5 3.5M16.5 16.5L20 20M4 20l3.5-3.5M16.5 7.5L20 4" stroke="currentColor" stroke-width="3"/>',
 bell:'<path d="M12 2a6 6 0 0 1 6 6v6l2 3H4l2-3V8a6 6 0 0 1 6-6z M9 19a3 3 0 0 0 6 0"/>',bux:'<path d="M12 2 L21 7 V17 L12 22 L3 17 V7Z" fill="none" stroke="currentColor" stroke-width="2.5"/><rect x="9" y="9" width="6" height="6"/>',
 search:'<circle cx="10" cy="10" r="6" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M14.5 14.5 L21 21" stroke="currentColor" stroke-width="2.5"/>',chat:'<path d="M2 4h20v13H8l-5 4v-4H2z"/>',bp:'<path d="M5 6h14v16H5z M9 6V3h6v3" fill="none" stroke="currentColor" stroke-width="2"/><rect x="8" y="12" width="8" height="4"/>',
 star:'<path d="M12 2l3 7 7 .5-5.5 4.5 2 7-6.5-4-6.5 4 2-7L2 9.5 9 9z"/>',up:'<path d="M2 10h4v11H2z M8 21h10l3-9v-2h-7l1-6-2-1-5 7z"/>',menu:'<path d="M3 5h18M3 12h18M3 19h18" stroke="currentColor" stroke-width="2.5"/>'};
const ico=(n,s=20,col="currentColor")=>`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="${col}" style="color:${col};flex:0 0 ${s}px">${IC[n]||""}</svg>`;
const bcIcon=(t,s=20)=>t?`<svg class="badgeBC" width="${s}" height="${s}" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="3" fill="${["","#5B9A4C","#E8AB2D","#111"][t]}"/><text x="12" y="17" font-size="12" text-anchor="middle" fill="#fff" font-weight="700" font-family="Arial">${["","BC","TBC","OBC"][t].slice(0,t==1?2:3)}</text></svg>`:"";
const buxIco=(s=16)=>ico("bux",s);
