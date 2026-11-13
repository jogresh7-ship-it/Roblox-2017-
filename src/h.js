/* ================= LOCAL ASSET PACK (optional) =================
   When index.html is opened from your own computer with an "assets" folder next to it,
   these files are used instead of the built-in drawings and synthesized sounds:
     assets/Topbar/...   assets/ui/...   assets/Sounds/...
   Nothing here is bundled; if a file is missing, the built-in version is used. */
const AIMG={menu:"assets/Topbar/coloredlogo.png",menuOn:"assets/Topbar/coloredlogo.png",chat:"assets/Topbar/chatOff.png",chatOn:"assets/Topbar/chatOn.png",bp:"assets/Topbar/inventoryOff.png",bpOn:"assets/Topbar/inventoryOn.png",pl:"assets/Topbar/leaderboardOn.png",plOn:"assets/Topbar/leaderboardOn.png",
 hpBase:"assets/Topbar/HealthBarBase.png",hpFill:"assets/Topbar/HealthBar.png",lock:"assets/ui/mouseLock_on.png",gear:"assets/ui/Gear.png",friend:"assets/ui/PlayerlistFriendIcon.png",bc1:"assets/ui/TinyBcIcon.png",bc2:"assets/ui/TinyTbcIcon.png",bc3:"assets/ui/TinyObcIcon.png"};
const ASND={oof:"assets/Sounds/uuhhh.mp3",jump:"assets/Sounds/action_jump.mp3",land:"assets/Sounds/action_jump_land.mp3",steps:"assets/Sounds/action_footsteps_plastic.mp3",swing:"assets/Sounds/swordslash.mp3",lunge:"assets/Sounds/swordlunge.mp3",equip:"assets/Sounds/unsheath.mp3",boom:"assets/Sounds/impact_explosion_01.mp3",badge:"assets/Sounds/victory.mp3",coin:"assets/Sounds/electronicpingshort.mp3",click:"assets/Sounds/button.mp3",hit:"assets/Sounds/hit.mp3",shoot:"assets/Sounds/Rubber band sling shot.mp3",splat:"assets/Sounds/splat.mp3",fall:"assets/Sounds/action_falling.mp3"};
const AOK={},SOK={};
(function probe(){if(location.protocol!="file:"&&!/^(localhost|127\.)/.test(location.hostname))return;
 for(const k in AIMG){const im=new Image();im.onload=()=>{AOK[k]=AIMG[k];applyAssets()};im.src=encodeURI(AIMG[k])}
 for(const k in ASND){const a=new Audio();a.preload="auto";a.oncanplaythrough=()=>{if(!SOK[k]){SOK[k]=a}};a.src=encodeURI(ASND[k])}})();
const aimg=(k,s=28)=>AOK[k]?`<img src="${encodeURI(AOK[k])}" style="width:${s}px;height:${s}px;object-fit:contain;display:block">`:null;
function applyAssets(){
 $$(".tbi[data-a]").forEach(el=>{const k=el.dataset.a+(el.classList.contains("on")?"On":"");const h=aimg(k)||aimg(el.dataset.a);if(!h)return;const dot=el.querySelector("#cdot");const svg=el.querySelector("svg");if(svg)svg.style.display="none";let im=el.querySelector("img.ast");if(!im){el.insertAdjacentHTML("afterbegin",h.replace("<img","<img class=\"ast\""));im=el.querySelector("img.ast")}else im.src=encodeURI(AOK[k]||AOK[el.dataset.a]);if(dot)el.appendChild(dot)});
 const hp=$("#hp");if(hp&&AOK.hpBase&&!hp.dataset.ast){hp.dataset.ast=1;hp.style.background=`url("${encodeURI(AOK.hpBase)}") center/100% 100%`;hp.style.border="0";if(AOK.hpFill){hp.firstChild.style.backgroundImage=`url("${encodeURI(AOK.hpFill)}")`;hp.firstChild.style.backgroundSize="100% 100%";hp.firstChild.dataset.img=1}}
 const xh=$("#xhair");if(xh&&AOK.lock&&xh.tagName!="IMG"){xh.outerHTML=`<img id="xhair" src="${encodeURI(AOK.lock)}" style="position:absolute;left:50%;top:50%;width:32px;height:32px;margin:-16px;display:${xh.style.display||"none"};pointer-events:none">`}
 const hg=$("#hgear");if(hg&&AOK.gear&&!hg.querySelector("img"))hg.innerHTML=aimg("gear",22)}
function playAsset(kind,vol){const a=SOK[kind];if(!a)return false;try{const c=a.cloneNode();c.volume=Math.max(0,Math.min(1,vol));c.play().catch(()=>{})}catch(e){return false}return true}
let stepAudio=null;
function footsteps(on,vol){if(!SOK.steps)return;if(!stepAudio){stepAudio=SOK.steps.cloneNode();stepAudio.loop=true}stepAudio.volume=Math.max(0,Math.min(1,vol));if(on&&stepAudio.paused)stepAudio.play().catch(()=>{});else if(!on&&!stepAudio.paused)stepAudio.pause()}
