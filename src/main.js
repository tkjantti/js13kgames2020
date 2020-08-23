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

import { init, initKeys, Sprite, GameLoop, keyPressed } from "kontra";

const PLAYER_SPEED = 5;

let { canvas } = init();
initKeys();

const resize = () => {
  canvas.width = window.innerWidth - 10;
  canvas.height = window.innerHeight - 10;
};

window.addEventListener("resize", resize, false);
resize();

let player = Sprite({
  x: 100,
  y: 80,
  color: "red",
  width: 20,
  height: 40
});

let loop = GameLoop({
  update: function() {
    player.update();

    if (keyPressed("left")) {
      player.x -= PLAYER_SPEED;
    } else if (keyPressed("right")) {
      player.x += PLAYER_SPEED;
    }

    if (keyPressed("up")) {
      player.y -= PLAYER_SPEED;
    } else if (keyPressed("down")) {
      player.y += PLAYER_SPEED;
    }
  },
  render: function() {
    player.render();
  }
});

loop.start();
