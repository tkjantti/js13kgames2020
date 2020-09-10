export { init, getCanvas, getContext } from "./core.js";
export { on, off, emit } from "./events.js";
export { default as GameLoop } from "./gameLoop.js";
export {
  degToRad,
  radToDeg,
  angleToTarget,
  rotatePoint,
  randInt,
  seedRand,
  lerp,
  inverseLerp,
  clamp,
  setStoreItem,
  getStoreItem,
  collides,
  getWorldRect
} from "./helpers.js";
export {
  keyMap,
  initKeys,
  bindKeys,
  unbindKeys,
  keyPressed
} from "./keyboard.js";
