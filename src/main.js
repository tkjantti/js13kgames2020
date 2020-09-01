/*
 * MIT License
 *
 * Copyright (c) 2020 Tero Jäntti, Sami H
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use, copy,
 * modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
 * BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { init, initKeys, bindKeys, GameLoop } from "kontra";
import { Level } from "./level.js";
import { Camera } from "./camera.js";

const { canvas, context } = init();
initKeys();

const resize = () => {
  canvas.width = window.innerWidth - 10;
  canvas.height = window.innerHeight - 10;
};

window.addEventListener("resize", resize, false);
resize();

const level = new Level(8, 8);

const camera = new Camera();
camera.zoomTo(level.currentRoom.getOuterBoundingBox());

level.roomChanged = (previousRoom, nextRoom) => {
  if (camera.area !== level) {
    camera.panTo(nextRoom);
  }
};

// Debug keys
bindKeys("1", () => {
  camera.zoomTo(level);
});
bindKeys("2", () => {
  camera.zoomTo(level.currentRoom.getOuterBoundingBox());
});

const loop = GameLoop({
  update: function() {
    level.update();
    camera.update();
  },

  render: function() {
    context.save();
    context.translate(canvas.width / 2, canvas.height / 2);
    context.scale(camera.zoom, camera.zoom);
    context.translate(-camera.x, -camera.y);

    const drawAllRooms = camera.area === level;
    level.render(context, drawAllRooms);

    context.restore();
  }
});

loop.start();
