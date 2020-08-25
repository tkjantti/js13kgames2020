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

import { init, initKeys, GameLoop } from "kontra";
import { Array2D } from "./Array2D.js";
import { Room, ROOM_WIDTH, ROOM_HEIGHT } from "./room.js";
import { createPlayer } from "./player.js";

const { canvas, context } = init();
initKeys();

const resize = () => {
  canvas.width = window.innerWidth - 10;
  canvas.height = window.innerHeight - 10;
};

window.addEventListener("resize", resize, false);
resize();

const createRooms = () => {
  const rooms = new Array2D(2, 2);

  for (let ix = 0; ix < rooms.xCount; ix++) {
    for (let iy = 0; iy < rooms.yCount; iy++) {
      const x = ix * (ROOM_WIDTH + 30);
      const y = iy * (ROOM_HEIGHT + 30);
      rooms.setValue(ix, iy, new Room(x, y, ix, iy));
    }
  }

  return rooms;
};

const rooms = createRooms();
let currentRoom = rooms.getValue(0, 0);

const player = createPlayer();

const loop = GameLoop({
  update: function() {
    player.update(currentRoom);
  },

  render: function() {
    // currentRoom.render(context);
    for (let ix = 0; ix < rooms.xCount; ix++) {
      for (let iy = 0; iy < rooms.yCount; iy++) {
        const room = rooms.getValue(ix, iy);
        room.render(context);
      }
    }

    player.render();
  }
});

loop.start();
