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

const ROOM_GAP = 30;

const createRooms = (xCount, yCount) => {
  const rooms = new Array2D(xCount, yCount);

  for (let ix = 0; ix < rooms.xCount; ix++) {
    for (let iy = 0; iy < rooms.yCount; iy++) {
      const x = ix * (ROOM_WIDTH + ROOM_GAP);
      const y = iy * (ROOM_HEIGHT + ROOM_GAP);
      rooms.setValue(ix, iy, new Room(x, y, ix, iy));
    }
  }

  return rooms;
};

export class Level {
  constructor(xCount, yCount) {
    this.xCount = xCount;
    this.yCount = yCount;

    // For level to work with camera.zoomTo()
    this.x = 0;
    this.y = 0;
    this.width = xCount * (ROOM_WIDTH + ROOM_GAP);
    this.height = yCount * (ROOM_HEIGHT + ROOM_GAP);

    const rooms = createRooms(xCount, yCount);
    this.rooms = rooms;
    this.currentRoom = this.rooms.getValue(0, 0);

    this.player = createPlayer();

    this.roomChanged = () => {};
  }

  update() {
    this.player.do_update(this.currentRoom, [], []);

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
    const previousRoom = this.currentRoom;
    const newix = previousRoom.ix + direction;
    if (newix < 0 || newix >= this.xCount) {
      return;
    }

    const nextRoom = this.rooms.getValue(newix, previousRoom.iy);

    this.currentRoom = nextRoom;
    this.roomChanged(previousRoom, nextRoom);

    if (direction >= 0) {
      sprite.x = nextRoom.x + 10;
    } else {
      sprite.x = nextRoom.right - 10 - sprite.width;
    }
  }

  moveVertically(sprite, direction) {
    const previousRoom = this.currentRoom;
    const newiy = previousRoom.iy + direction;
    if (newiy < 0 || newiy >= this.yCount) {
      return;
    }

    const nextRoom = this.rooms.getValue(previousRoom.ix, newiy);

    this.currentRoom = nextRoom;
    this.roomChanged(previousRoom, nextRoom);

    if (direction >= 0) {
      sprite.y = nextRoom.y + 10;
    } else {
      sprite.y = nextRoom.bottom - 10 - sprite.height;
    }
  }

  render(context, drawAll) {
    if (drawAll) {
      for (let ix = 0; ix < this.rooms.xCount; ix++) {
        for (let iy = 0; iy < this.rooms.yCount; iy++) {
          this.rooms.getValue(ix, iy).render(context);
        }
      }
    } else {
      this.currentRoom.render(context);
    }
    this.player.render();
  }
}
