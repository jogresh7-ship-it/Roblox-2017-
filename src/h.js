/* ================= LOCAL ASSET PACK (optional) =================
   When index.html is opened from your own computer with an "assets" folder next to it,
   these files are used instead of the built-in drawings and synthesized sounds:
     assets/Topbar/...   assets/ui/...   assets/Sounds/...
   Nothing here is bundled; if a file is missing, the built-in version is used. */
const AIMG={menu:"assets/Topbar/coloredlogo.png",menuOn:"assets/Topbar/coloredlogo.png",chat:"assets/Topbar/chatOff.png",chatOn:"assets/Topbar/chatOn.png",bp:"assets/Topbar/inventoryOff.png",bpOn:"assets/Topbar/inventoryOn.png",pl:"assets/Topbar/leaderboardOn.png",plOn:"assets/Topbar/leaderboardOn.png",
 hpBase:"assets/Topbar/HealthBarBase.png",hpFill:"assets/Topbar/HealthBar.png",lock:"assets/ui/mouseLock_on.png",gear:"assets/ui/Gear.png",friend:"assets/ui/PlayerlistFriendIcon.png",bc1:"assets/ui/TinyBcIcon.png",bc2:"assets/ui/TinyTbcIcon.png",bc3:"assets/ui/TinyObcIcon.png",
 tabPlayers:"assets/ui/Settings/MenuBarIcons/PlayersTabIcon.png",tabSettings:"assets/ui/Settings/MenuBarIcons/GameSettingsTab.png",tabReport:"assets/ui/Settings/MenuBarIcons/ReportAbuseTab.png",tabHelp:"assets/ui/Settings/MenuBarIcons/HelpTab.png",tabRecord:"assets/ui/Settings/MenuBarIcons/RecordTab.png",
 mbtn:"assets/ui/Settings/MenuBarAssets/MenuButton.png",mbtnSel:"assets/ui/Settings/MenuBarAssets/MenuButtonSelected.png",msel:"assets/ui/Settings/MenuBarAssets/MenuSelection.png",
 kR:"assets/ui/Settings/Help/ResetIcon.png",kL:"assets/ui/Settings/Help/LeaveIcon.png",kESC:"assets/ui/Settings/Help/EscapeIcon.png",addFriend:"assets/ui/Settings/Players/AddFriendIcon.png",isFriend:"assets/ui/Settings/Players/FriendIcon.png",reportFlag:"assets/ui/Settings/Players/ReportFlagIcon.png",studs:"assets/ui/Studs.png"};
const ASND={oof:"assets/Sounds/uuhhh.mp3",jump:"assets/Sounds/action_jump.mp3",land:"assets/Sounds/action_jump_land.mp3",steps:"assets/Sounds/action_footsteps_plastic.mp3",swing:"assets/Sounds/swordslash.mp3",lunge:"assets/Sounds/swordlunge.mp3",equip:"assets/Sounds/unsheath.mp3",boom:"assets/Sounds/impact_explosion_01.mp3",badge:"assets/Sounds/victory.mp3",coin:"assets/Sounds/electronicpingshort.mp3",click:"assets/Sounds/button.mp3",hit:"assets/Sounds/hit.mp3",shoot:"assets/Sounds/Rubber band sling shot.mp3",splat:"assets/Sounds/splat.mp3",fall:"assets/Sounds/action_falling.mp3"};
const AOK={},SOK={};
const ADIRS={Topbar:["assets/Topbar/","assets/ui/Topbar/","assets/Topbar/ui/Topbar/","assets/Topbar/Topbar/","assets/AnSonicGuy's Old Roblox Topbar/ui/Topbar/","AnSonicGuy's Old Roblox Topbar/ui/Topbar/","assets/","Topbar/","ui/Topbar/",""],
 ui:["assets/ui/","assets/ui/ui/","assets/","ui/",""],Sounds:["assets/Sounds/","assets/Sounds/Sounds/","assets/sounds/","assets/","Sounds/",""]};
function candidates(p){const m=p.match(/^assets\/(Topbar|ui|Sounds)\/(.*)$/);if(!m)return[p];return ADIRS[m[1]].map(d=>d+m[2])}
(function probe(){if(location.hostname.endsWith("claude.ai")||location.hostname.endsWith("claudeusercontent.com"))return;
 for(const k in AIMG){const c=candidates(AIMG[k]);let i=0;const tryN=()=>{if(i>=c.length)return;const p=c[i++];const im=new Image();im.onload=()=>{AOK[k]=p;applyAssets();assetCSS();if(k=='studs'&&window.onStuds)onStuds()};im.onerror=tryN;im.src=encodeURI(p)};tryN()}
 for(const k in ASND){const c=candidates(ASND[k]);let i=0;const tryN=()=>{if(i>=c.length)return;const p=c[i++];const a=new Audio();a.preload="auto";a.oncanplaythrough=()=>{if(!SOK[k])SOK[k]=a};a.onerror=tryN;a.src=encodeURI(p)};tryN()}})();
function assetStatus(){return `${Object.keys(AOK).length} of ${Object.keys(AIMG).length} images, ${Object.keys(SOK).length} of ${Object.keys(ASND).length} sounds`}
const aimg=(k,s=28)=>AOK[k]?`<img src="${encodeURI(AOK[k])}" style="width:${s}px;height:${s}px;object-fit:contain;display:block">`:null;
function applyAssets(){
 $$(".tbi[data-a]").forEach(el=>{const k=el.dataset.a+(el.classList.contains("on")?"On":"");const h=aimg(k)||aimg(el.dataset.a);if(!h)return;const dot=el.querySelector("#cdot");const svg=el.querySelector("svg");if(svg)svg.style.display="none";let im=el.querySelector("img.ast");if(!im){el.insertAdjacentHTML("afterbegin",h.replace("<img","<img class=\"ast\""));im=el.querySelector("img.ast")}else im.src=encodeURI(AOK[k]||AOK[el.dataset.a]);if(dot)el.appendChild(dot)});
 const hp=$("#hp");if(hp&&AOK.hpBase&&!hp.dataset.ast){hp.dataset.ast=1;hp.style.background=`url("${encodeURI(AOK.hpBase)}") center/100% 100%`;hp.style.border="0";if(AOK.hpFill){hp.firstChild.style.backgroundImage=`url("${encodeURI(AOK.hpFill)}")`;hp.firstChild.style.backgroundSize="100% 100%";hp.firstChild.dataset.img=1}}
 const xh=$("#xhair");if(xh&&AOK.lock&&xh.tagName!="IMG"){xh.outerHTML=`<img id="xhair" src="${encodeURI(AOK.lock)}" style="position:absolute;left:50%;top:50%;width:32px;height:32px;margin:-16px;display:${xh.style.display||"none"};pointer-events:none">`}
 const hg=$("#hgear");if(hg&&AOK.gear&&!hg.querySelector("img"))hg.innerHTML=aimg("gear",22)}
function playAsset(kind,vol){const a=SOK[kind];if(!a)return false;try{const c=a.cloneNode();c.volume=Math.max(0,Math.min(1,vol));c.play().catch(()=>{})}catch(e){return false}return true}
let stepAudio=null;
function footsteps(on,vol){if(!SOK.steps)return;if(!stepAudio){stepAudio=SOK.steps.cloneNode();stepAudio.loop=true}stepAudio.volume=Math.max(0,Math.min(1,vol));if(on&&stepAudio.paused)stepAudio.play().catch(()=>{});else if(!on&&!stepAudio.paused)stepAudio.pause()}

const ai=(k,s,fb)=>AOK[k]?`<img src="${encodeURI(AOK[k])}" style="width:${s}px;height:${s}px;object-fit:contain;display:block">`:fb;
function assetCSS(){let st=document.getElementById("astcss");if(!st){st=document.createElement("style");st.id="astcss";document.head.appendChild(st)}const u=k=>`url("${encodeURI(AOK[k])}")`;let c="";
 if(AOK.mbtn)c+=`.ebtn{background:none!important;border:8px solid transparent;border-image:${u("mbtn")} 16 fill / 8px stretch;border-radius:0;padding:0 10px 0 0}`;
 if(AOK.mbtnSel)c+=`.ebtn:hover{border-image:${u("mbtnSel")} 16 fill / 8px stretch}`;
 if(AOK.msel)c+=`.esctabs div.on{border-bottom-color:transparent;background:${u("msel")} bottom/100% 4px no-repeat}`;
 st.textContent=c}
