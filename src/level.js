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
import { Room, ROOM_OUTER_WIDTH, ROOM_OUTER_HEIGHT } from "./room.js";
import { createPlayer } from "./player.js";

const ROOM_GAP = 30;

const createRooms = (xCount, yCount) => {
  const rooms = new Array2D(xCount, yCount);

  for (let ix = 0; ix < rooms.xCount; ix++) {
    for (let iy = 0; iy < rooms.yCount; iy++) {
      const x = ix * (ROOM_OUTER_WIDTH + ROOM_GAP);
      const y = iy * (ROOM_OUTER_HEIGHT + ROOM_GAP);
      const doors = {
        // Make doors at edges not passable
        left: ix !== 0,
        right: ix !== xCount - 1,
        top: iy !== 0,
        bottom: iy !== yCount - 1
      };
      rooms.setValue(ix, iy, new Room(x, y, ix, iy, doors));
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
    this.width = xCount * (ROOM_OUTER_WIDTH + ROOM_GAP);
    this.height = yCount * (ROOM_OUTER_HEIGHT + ROOM_GAP);

    const rooms = createRooms(xCount, yCount);
    this.rooms = rooms;
    this.currentRoom = this.rooms.getValue(0, 0);

    this.player = createPlayer();

    this.roomChanged = () => {};
  }

  update() {
    this.player.do_update(this.currentRoom, this.currentRoom.ladders, []);

    if (this.player.x > this.currentRoom.right && this.player.isMovingRight()) {
      this.moveHorizontally(this.player, 1);
    } else if (
      this.player.x + this.player.width < this.currentRoom.x &&
      this.player.isMovingLeft()
    ) {
      this.moveHorizontally(this.player, -1);
    } else if (
      this.player.isMovingDown() &&
      this.currentRoom.isAtBottomDoor(this.player)
    ) {
      this.moveVertically(this.player, 1);
    } else if (
      this.player.isMovingUp() &&
      this.currentRoom.isAtTopDoor(this.player)
    ) {
      this.moveVertically(this.player, -1);
    }
  }

  moveHorizontally(sprite, direction) {
    const previousRoom = this.currentRoom;
    const newix = previousRoom.ix + direction;
    const nextRoom = this.rooms.getValue(newix, previousRoom.iy);

    if (!nextRoom) {
      return;
    }

    this.currentRoom = nextRoom;
    this.roomChanged(previousRoom, nextRoom);

    if (direction >= 0) {
      if (sprite.x < nextRoom.x) {
        sprite.x = nextRoom.x;
      }
    } else {
      if (nextRoom.right < sprite.x + sprite.width) {
        sprite.x = nextRoom.right - sprite.width;
      }
    }
  }

  moveVertically(sprite, direction) {
    const previousRoom = this.currentRoom;
    const newiy = previousRoom.iy + direction;
    const nextRoom = this.rooms.getValue(previousRoom.ix, newiy);

    if (!nextRoom) {
      return;
    }

    this.currentRoom = nextRoom;
    this.roomChanged(previousRoom, nextRoom);

    if (direction >= 0) {
      sprite.y = nextRoom.y;
    } else {
      sprite.y = nextRoom.bottom - sprite.height;
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
