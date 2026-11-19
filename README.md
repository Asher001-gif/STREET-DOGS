# Escape the Dog

Cross a dark street full of sleeping dogs without waking them. If they wake, climb to safety.
Low-poly, first-person, built to run on old machines (no build step, no dependencies to install).

## Play
Open `index.html` in a browser, or enable GitHub Pages (Settings → Pages → `main` / root).

## Controls
| Key | Action |
|---|---|
| WASD / arrows | Move |
| Mouse | Look (click to capture, Esc to release) |
| Shift | Sprint (louder, drains stamina) |
| Space or 0 | Jump |
| E or 5 (hold) | Carry a toy or vase; release to drop |
| R | Restart |

### Touch (phones/tablets)
| Control | Action |
|---|---|
| Left thumb joystick | Move (push past the ring to sprint) |
| Drag on the right half | Look around |
| Press and hold on the right half (don't move) | Carry a toy or vase / drag a bed; lift to drop |
| Jump button (bottom right) | Jump |
| ↻ (top right) | Restart |

On a desktop, add `?touch=1` to the URL to preview the touch controls.

## Rules
1. Dogs sleep; get inside a dog's wake distance and it wakes.
2. Noise matters: walking is quiet, sprinting is louder, squeaky toys wake nearby dogs.
3. Awake dogs chase you and are faster than your sprint.
4. Stand on a crate (safe spot) and dogs lose interest after a few seconds.
5. Reach the green gate to win. One bite slows you; a second restarts the level.

## Structure
```
index.html     page shell + HUD markup
css/style.css  HUD and overlay styles
js/config.js    constants
js/assets.js    baked models + textures (generated)
js/engine.js    renderer, scene, camera, mesh helpers
js/audio.js     procedural sounds
js/levels.js    level data (dogs, props, beds, toys, vases)
js/level.js     loads/clears a level
js/world.js     street, lamps, crates, toys
js/dogs.js      dog AI, noise reactions, bites
js/player.js    input, movement, physics
js/touch.js     touch controls (joystick, jump, hold, look)
js/main.js      game loop, HUD
```

assets/ holds the source models (glb/fbx) and textures. After changing them run `python3 tools/bake_assets.py` to regenerate `js/assets.js` (needs Python + numpy).

## Status
- [x] Level 1
- [x] Level 2 (beds to drag or climb, 5 dogs). Open `index.html#2` to jump straight to it
- [x] Level 3 (vase rows to jump over, nets as safe spots, dogs on both sides)
- [ ] Levels 4-5 (gaps, heavy crate to move, long street with everything)
