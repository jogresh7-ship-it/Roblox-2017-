/* ================= LOCAL ASSET PACK (optional) =================
   When index.html is opened from your own computer with an "assets" folder next to it,
   these files are used instead of the built-in drawings and synthesized sounds:
     assets/Topbar/...   assets/ui/...   assets/Sounds/...
   Nothing here is bundled; if a file is missing, the built-in version is used. */
const AIMG={menu:"assets/ui/Menu/Hamburger.png",menuOn:"assets/ui/Menu/HamburgerDown.png",chat:"assets/ui/Chat/Chat.png",chatOn:"assets/ui/Chat/ChatDown.png",bp:"assets/ui/Backpack/Backpack.png",bpOn:"assets/ui/Backpack/Backpack_Down.png",counter:"assets/ui/Chat/MessageCounter.png",
lock:"assets/ui/mouseLock_on.png",gear:"assets/ui/Settings/MenuBarIcons/GameSettingsTab.png",notif:"assets/ui/VR/notifications.png",rowBg:"assets/ui/dialog_white.png",helpPad:"assets/ui/Settings/Help/GenericController.png",helpRot:"assets/ui/Settings/Help/RotateCameraGesture.png",helpZoom:"assets/ui/Settings/Help/ZoomGesture.png",helpTool:"assets/ui/Settings/Help/UseToolGesture.png",bpOpen:"assets/ui/Backpack_Open.png",bpClose:"assets/ui/Backpack_Close.png",friend:"assets/ui/icon_friends_16.png",bc1:"assets/ui/icon_BC-16.png",bc2:"assets/ui/icon_TBC-16.png",bc3:"assets/ui/icon_OBC-16.png",
 tabPlayers:"assets/ui/Settings/MenuBarIcons/PlayersTabIcon.png",tabSettings:"assets/ui/Settings/MenuBarIcons/GameSettingsTab.png",tabReport:"assets/ui/Settings/MenuBarIcons/ReportAbuseTab.png",tabHelp:"assets/ui/Settings/MenuBarIcons/HelpTab.png",tabRecord:"assets/ui/Settings/MenuBarIcons/RecordTab.png",
 mbtn:"assets/ui/Settings/MenuBarAssets/MenuButton.png",mbtnSel:"assets/ui/Settings/MenuBarAssets/MenuButtonSelected.png",msel:"assets/ui/Settings/MenuBarAssets/MenuSelection.png",
 kR:"assets/ui/Settings/Help/ResetIcon.png",kL:"assets/ui/Settings/Help/LeaveIcon.png",kESC:"assets/ui/Settings/Help/EscapeIcon.png",addFriend:"assets/ui/Settings/Players/AddFriendIcon.png",isFriend:"assets/ui/Settings/Players/FriendIcon.png",reportFlag:"assets/ui/Settings/Players/ReportFlagIcon.png",studs:"assets/ui/Studs.png",classicFace:"assets/faces/ClassicSmile.png",face0:"assets/faces/PC _ Computer - Roblox - Faces - Sad.png",face1:"assets/faces/PC _ Computer - Roblox - Faces - Sad Zombie.png",face2:"assets/faces/PC _ Computer - Roblox - Faces - Sad Clown.png",face3:"assets/faces/PC _ Computer - Roblox - Faces - Sadfaic.png",face4:"assets/faces/PC _ Computer - Roblox - Faces - Teal Rock Star Smile.png",arrL:"assets/ui/Settings/Slider/Left.png",arrR:"assets/ui/Settings/Slider/Right.png",barL:"assets/ui/Settings/Slider/BarLeft.png",barR:"assets/ui/Settings/Slider/BarRight.png",barLs:"assets/ui/Settings/Slider/SelectedBarLeft.png",barRs:"assets/ui/Settings/Slider/SelectedBarRight.png",less:"assets/ui/Settings/Slider/Less.png",more:"assets/ui/Settings/Slider/More.png",ddArrow:"assets/ui/Settings/DropDown/DropDown.png"};
const ASND={oof:"assets/Sounds/uuhhh.mp3",jump:"assets/Sounds/action_jump.mp3",land:"assets/Sounds/action_jump_land.mp3",steps:"assets/Sounds/action_footsteps_plastic.mp3",swing:"assets/Sounds/swordslash.mp3",lunge:"assets/Sounds/swordlunge.mp3",equip:"assets/Sounds/unsheath.mp3",boom:"assets/Sounds/impact_explosion_01.mp3",badge:"assets/Sounds/victory.mp3",coin:"assets/Sounds/electronicpingshort.mp3",click:"assets/Sounds/button.mp3",hit:"assets/Sounds/hit.mp3",shoot:"assets/Sounds/Rubber band sling shot.mp3",splat:"assets/Sounds/splat.mp3",fall:"assets/Sounds/action_falling.mp3"};
(window.BLOX_FACES||[]).forEach((f,i)=>{AIMG["face"+i]="assets/faces/"+f.file});
const AOK={},SOK={},AEL={};
/* 3D textures must come from data URLs: browsers refuse images opened from disk inside WebGL/canvas */
function texURL(p){const T=window.BLOX_TEX||{};return T[p]||(window.BLOX_INLINE||{})[p]||encodeURI(p)}
const ADIRS={Topbar:["assets/Topbar/","assets/ui/Topbar/","assets/Topbar/ui/Topbar/","assets/Topbar/Topbar/","assets/AnSonicGuy's Old Roblox Topbar/ui/Topbar/","AnSonicGuy's Old Roblox Topbar/ui/Topbar/","assets/","Topbar/","ui/Topbar/",""],
 ui:["assets/ui/","assets/ui/ui/","assets/","ui/",""],faces:["assets/faces/","assets/","assets/games/","faces/","games/",""],Sounds:["assets/Sounds/","assets/Sounds/Sounds/","assets/sounds/","assets/","Sounds/",""]};
function candidates(p){const m=p.match(/^assets\/(Topbar|ui|Sounds|faces)\/(.*)$/);if(!m)return[p];return ADIRS[m[1]].map(d=>d+m[2])}
(function probe(){if(!window.BLOX_INLINE&&(location.hostname.endsWith("claude.ai")||location.hostname.endsWith("claudeusercontent.com")))return;
 const INL=window.BLOX_INLINE||{};for(const k in AIMG){const c=INL[AIMG[k]]?[AIMG[k]]:candidates(AIMG[k]);let i=0;const tryN=()=>{if(i>=c.length)return;const p=c[i++];const im=new Image();im.onload=()=>{AOK[k]=p;const T=window.BLOX_TEX||{};if(T[AIMG[k]]){const g=new Image();g.onload=()=>{AEL[k]=g;if(window.onFaceAsset)onFaceAsset()};g.src=T[AIMG[k]]}else AEL[k]=im;if(k.startsWith('face')&&window.onFaceAsset)onFaceAsset();applyAssets();assetCSS();if(k=='studs'&&window.onStuds)onStuds()};im.onerror=tryN;im.src=INL[p]||encodeURI(p)};tryN()}
 for(const k in ASND){const c=INL[ASND[k]]?[ASND[k]]:candidates(ASND[k]);let i=0;const tryN=()=>{if(i>=c.length)return;const p=c[i++];const a=new Audio();a.preload="auto";a.oncanplaythrough=()=>{if(!SOK[k])SOK[k]=a};a.onerror=tryN;a.src=INL[p]||encodeURI(p)};tryN()}})();
function assetStatus(){return `${Object.keys(AOK).length} of ${Object.keys(AIMG).length} images, ${Object.keys(SOK).length} of ${Object.keys(ASND).length} sounds`}
const ASZ={menu:[32,25],menuOn:[32,25],chat:[28,27],chatOn:[28,27],bp:[22,28],bpOn:[22,28]};
const _src=p=>(window.BLOX_INLINE||{})[p]||encodeURI(p);
const aimg=(k,s=28)=>{if(!AOK[k])return null;const z=ASZ[k]||[s,s];return `<img src="${_src(AOK[k])}" style="width:${z[0]}px;height:${z[1]}px;object-fit:contain;display:block">`};
function applyAssets(){
 $$(".tbi[data-a]").forEach(el=>{const k=el.dataset.a+(el.classList.contains("on")?"On":"");const h=aimg(k)||aimg(el.dataset.a);if(!h)return;const dot=el.querySelector("#cdot");const svg=el.querySelector("svg");if(svg)svg.style.display="none";let im=el.querySelector("img.ast");if(!im){el.insertAdjacentHTML("afterbegin",h.replace("<img","<img class=\"ast\""));im=el.querySelector("img.ast")}else{const kk=AOK[k]?k:el.dataset.a;im.src=_src(AOK[kk]);const z=ASZ[kk];if(z){im.style.width=z[0]+"px";im.style.height=z[1]+"px"}}if(dot)el.appendChild(dot)});
 const cd=$("#cdot");if(cd&&AOK.counter&&!cd.dataset.ast){cd.dataset.ast=1;cd.style.background=`url("${_src(AOK.counter)}") center/100% 100%`}
 const xh=$("#xhair");if(xh&&AOK.lock&&xh.tagName!="IMG"){xh.outerHTML=`<img id="xhair" src="${_src(AOK.lock)}" style="position:absolute;left:50%;top:50%;width:32px;height:32px;margin:-16px;display:${xh.style.display||"none"};pointer-events:none">`}
 const hg=$("#hgear");if(hg&&AOK.gear&&!hg.querySelector("img.ast")){const s=hg.querySelector("svg");if(s)s.outerHTML=`<img class="ast" src="${_src(AOK.gear)}" style="width:24px;height:24px;object-fit:contain">`}
 const hb=$("#hbell");if(hb&&AOK.notif&&!hb.querySelector("img.ast")){const s=hb.querySelector("svg");if(s)s.outerHTML=`<img class="ast" src="${_src(AOK.notif)}" style="width:16px;height:22px;object-fit:contain">`}
 const ar=$("#bparrow");if(ar&&AOK.bpOpen){const open=$("#bpfull")&&$("#bpfull").classList.contains("on");ar.innerHTML=`<img src="${encodeURI(open?AOK.bpClose||AOK.bpOpen:AOK.bpOpen)}" style="width:14px;height:9px;display:block">`}}
function playAsset(kind,vol){const a=SOK[kind];if(!a)return false;try{const c=a.cloneNode();c.volume=Math.max(0,Math.min(1,vol));c.play().catch(()=>{})}catch(e){return false}return true}
let stepAudio=null;
function footsteps(on,vol){if(!SOK.steps)return;if(!stepAudio){stepAudio=SOK.steps.cloneNode();stepAudio.loop=true}stepAudio.volume=Math.max(0,Math.min(1,vol));if(on&&stepAudio.paused)stepAudio.play().catch(()=>{});else if(!on&&!stepAudio.paused)stepAudio.pause()}

const ai=(k,s,fb)=>AOK[k]?`<img src="${_src(AOK[k])}" style="width:${s}px;height:${s}px;object-fit:contain;display:block">`:fb;
function assetCSS(){let st=document.getElementById("astcss");if(!st){st=document.createElement("style");st.id="astcss";document.head.appendChild(st)}const u=k=>`url("${_src(AOK[k])}")`;let c="";
 if(AOK.mbtn)c+=`.ebtn{background:none!important;border:8px solid transparent;border-image:${u("mbtn")} 16 fill / 8px stretch;border-radius:0;padding:0 10px 0 0}`;
 if(AOK.mbtnSel)c+=`.ebtn:hover{border-image:${u("mbtnSel")} 16 fill / 8px stretch}`;
 if(AOK.msel)c+=`.esctabs div.on{border-bottom-color:transparent;background:${u("msel")} bottom/100% 4px no-repeat}`;
 if(AOK.mbtn)c+=`.mbtn{background:none!important;border:8px solid transparent!important;border-image:${u("mbtn")} 8 fill / 8px stretch!important;border-radius:0!important}`;
 if(AOK.mbtnSel)c+=`.mbtn:hover,.mbtn.sel{border-image:${u("mbtnSel")} 8 fill / 8px stretch!important}`;
 if(AOK.arrL)c+=`.selr .arr:before{display:none}`;if(AOK.arrL)c+=`.selr .arr.l{background:${u("arrL")} center/9px 15px no-repeat!important}`;if(AOK.arrR)c+=`.selr .arr.r{background:${u("arrR")} center/9px 15px no-repeat!important}`;
 if(AOK.barL)c+=`.sldr i{background:${u("barL")} center/100% 100%!important}`;if(AOK.barLs)c+=`.sldr i.on{background:${u("barLs")} center/100% 100%!important}`;
 if(AOK.less)c+=`.sldr .less:before,.sldr .more:before,.sldr .more:after{display:none}`;if(AOK.less)c+=`.sldr .less{background:${u("less")} center/18px 18px no-repeat!important}`;if(AOK.more)c+=`.sldr .more{background:${u("more")} center/18px 18px no-repeat!important}`;
 if(AOK.rowBg)c+=`.escbody .prow:before{background:none!important;border:10px solid transparent;border-image:${u("rowBg")} 9 fill / 10px stretch;border-radius:0!important}`;
 st.textContent=c}

/* Optional UI font from the local asset pack (assets/fonts/font.js sets window.BLOX_FONT to a data: URL).
   Loaded through a script because browsers block font files opened straight from disk. */
(function(){if(!window.BLOX_FONT)return;const st=document.createElement("style");st.id="bloxfont";
 st.textContent=`@font-face{font-family:"BloxUI";src:url(${window.BLOX_FONT}) format("truetype");font-display:swap}
 body *:not(.logo):not(h1):not(h2):not(.gfont):not(.logo *):not(h1 *):not(h2 *){font-family:"BloxUI","Source Sans Pro",Helvetica,Arial,sans-serif!important}
 body{font-family:"BloxUI","Source Sans Pro",Helvetica,Arial,sans-serif}
 .ebtn{white-space:nowrap;font-size:19px!important}.esctabs div{font-size:21px!important}.srow2 .lab{font-size:21px!important}`;document.head.appendChild(st)})();
