# BLOX — 2017 platform recreation

Open `index.html` in a browser (needs internet for Three.js and the Source Sans Pro font).
Everything is saved in your browser's localStorage. Settings → Reset Demo Data starts over.

`src/` holds the pieces `index.html` is built from: `a.html` (markup + CSS), then `noob_data.js` (embedded model, generated), `b.js`, `h.js`, `c.js` … `g.js`, `p.js`, `f.js`.

## Credits
- Character model: "R6 Roblox Noob [Animated]" by Fog (https://sketchfab.com/fog_), licensed CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/). Recolored at runtime.
- Font: BobloxClassic.

## Optional local asset pack
If you open `index.html` from your own computer with an `assets` folder next to it, the game uses those files instead of the built-in icons and sounds:

    index.html
    assets/Topbar/   (chatOff.png, chatOn.png, inventoryOff.png, inventoryOn.png, leaderboardOn.png, coloredlogo.png, HealthBarBase.png, HealthBar.png)
    assets/ui/       (mouseLock_on.png, Gear.png, PlayerlistFriendIcon.png, TinyBcIcon.png, TinyTbcIcon.png, TinyObcIcon.png)
    assets/Sounds/   (uuhhh.mp3, action_jump.mp3, action_jump_land.mp3, action_footsteps_plastic.mp3, swordslash.mp3, swordlunge.mp3, unsheath.mp3, impact_explosion_01.mp3, victory.mp3, electronicpingshort.mp3, button.mp3, hit.mp3, splat.mp3, action_falling.mp3, "Rubber band sling shot.mp3")

`assets/` is git-ignored and is never uploaded. Missing files fall back to the built-in versions.
