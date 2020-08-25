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

import { Array2D } from "./Array2D.js";
import { Room, ROOM_WIDTH, ROOM_HEIGHT } from "./room.js";
import { createPlayer } from "./player.js";

const createRooms = (width, height) => {
  const rooms = new Array2D(width, height);

  for (let ix = 0; ix < rooms.xCount; ix++) {
    for (let iy = 0; iy < rooms.yCount; iy++) {
      const x = ix * (ROOM_WIDTH + 30);
      const y = iy * (ROOM_HEIGHT + 30);
      rooms.setValue(ix, iy, new Room(x, y, ix, iy));
    }
  }

  return rooms;
};

export class Level {
  constructor(width, height) {
    this.width = width;
    this.height = height;

    const rooms = createRooms(width, height);
    this.rooms = rooms;
    this.currentRoom = this.rooms.getValue(0, 0);

    this.player = createPlayer();
  }

  update() {
    this.player.update(this.currentRoom);

    if (this.currentRoom.isAtRightDoor(this.player)) {
      this.moveHorizontally(this.player, 1);
    } else if (this.currentRoom.isAtLeftDoor(this.player)) {
      this.moveHorizontally(this.player, -1);
    }

    if (this.currentRoom.isAtBottomDoor(this.player)) {
      this.moveVertically(this.player, 1);
    } else if (this.currentRoom.isAtTopDoor(this.player)) {
      this.moveVertically(this.player, -1);
    }
  }

  moveHorizontally(sprite, direction) {
    const newix = this.currentRoom.ix + direction;
    if (newix < 0 || newix >= this.width) {
      return;
    }

    const nextRoom = this.rooms.getValue(newix, this.currentRoom.iy);

    this.currentRoom = nextRoom;

    if (direction >= 0) {
      sprite.x = nextRoom.x + 10;
    } else {
      sprite.x = nextRoom.right - 10 - sprite.width;
    }
  }

  moveVertically(sprite, direction) {
    const newiy = this.currentRoom.iy + direction;
    if (newiy < 0 || newiy >= this.height) {
      return;
    }

    const nextRoom = this.rooms.getValue(this.currentRoom.ix, newiy);

    this.currentRoom = nextRoom;

    if (direction >= 0) {
      sprite.y = nextRoom.y + 10;
    } else {
      sprite.y = nextRoom.bottom - 10 - sprite.height;
    }
  }

  render(context) {
    const rooms = this.rooms;
    for (let ix = 0; ix < rooms.xCount; ix++) {
      for (let iy = 0; iy < rooms.yCount; iy++) {
        const room = rooms.getValue(ix, iy);
        room.render(context);
      }
    }

    this.player.render();
  }
}
