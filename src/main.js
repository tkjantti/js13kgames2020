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

const ROOM_WIDTH = 300;
const ROOM_HEIGHT = 300;

const { canvas, context } = init();
initKeys();

const resize = () => {
  canvas.width = window.innerWidth - 10;
  canvas.height = window.innerHeight - 10;
};

window.addEventListener("resize", resize, false);
resize();

class Room {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.right = this.x + ROOM_WIDTH;
    this.bottom = this.y + ROOM_HEIGHT;
  }

  render() {
    context.save();
    context.strokeStyle = "white";
    context.lineWidth = 5;
    context.beginPath();
    context.lineTo(this.x, this.y);
    context.lineTo(this.x + ROOM_WIDTH, this.y);
    context.lineTo(this.x + ROOM_WIDTH, this.y + ROOM_HEIGHT);
    context.lineTo(this.x, this.y + ROOM_HEIGHT);
    context.closePath();
    context.stroke();
    context.restore();
  }
}

const player = Sprite({
  x: 100,
  y: 80,
  color: "red",
  width: 20,
  height: 40,

  update(room) {
    let dx = 0,
      dy = 0;

    if (keyPressed("left")) {
      dx -= PLAYER_SPEED;
    } else if (keyPressed("right")) {
      dx += PLAYER_SPEED;
    }

    if (keyPressed("up")) {
      dy -= PLAYER_SPEED;
    } else if (keyPressed("down")) {
      dy += PLAYER_SPEED;
    }

    if (this.x + dx < room.x) {
      this.x = room.x;
    } else if (room.right < this.x + dx + this.width) {
      this.x = room.right - this.width;
    } else {
      this.x += dx;
    }

    if (this.y + dy < room.y) {
      this.y = room.y;
    } else if (room.bottom < this.y + dy + this.height) {
      this.y = room.bottom - this.height;
    } else {
      this.y += dy;
    }
  }
});

const room = new Room(30, 30);

const loop = GameLoop({
  update: function() {
    player.update(room);
  },
  render: function() {
    room.render();
    player.render();
  }
});

loop.start();
