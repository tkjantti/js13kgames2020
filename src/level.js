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
import {
  Room,
  ROOM_OUTER_WIDTH,
  ROOM_OUTER_HEIGHT,
  DOOR_NONE,
  DOOR_NONE_EDGE,
  DOOR_EDGE,
  DOOR_404,
  DOOR_OPEN
} from "./room.js";
import { createPlayer } from "./player.js";

const ROOM_GAP = 30;

const createRooms = (xCount, yCount) => {
  const rooms = new Array2D(xCount, yCount);

  for (let ix = 0; ix < rooms.xCount; ix++) {
    for (let iy = 0; iy < rooms.yCount; iy++) {
      const isMissing =
        ix === 5 ||
        (ix === 1 && iy === 2) ||
        (ix === 4 && iy === 4) ||
        (ix === 3 && iy === 6);

      const x = ix * (ROOM_OUTER_WIDTH + ROOM_GAP);
      const y = iy * (ROOM_OUTER_HEIGHT + ROOM_GAP);
      rooms.setValue(ix, iy, new Room(x, y, ix, iy, isMissing));
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

    this.rooms = createRooms(xCount, yCount);
    this.updateDoors();
    this.currentRoom = this.rooms.getValue(3, 4);

    this.player = createPlayer();
    this.player.x = this.currentRoom.x + 30;
    this.player.y = this.currentRoom.bottom - this.player.height;

    this.roomChanged = () => {};
  }

  moveRoomRight() {
    const oldIx = this.currentRoom.ix;
    const oldIy = this.currentRoom.iy;
    const ix = this.currentRoom.ix + 1;
    const iy = this.currentRoom.iy;
    const oldX = this.currentRoom.outerX;
    const oldY = this.currentRoom.outerY;

    const rightRoom = this.rooms.getValue(ix, iy);

    if (rightRoom && rightRoom.isMissing) {
      const xDiff = ROOM_OUTER_WIDTH + ROOM_GAP;
      const x = ix * (ROOM_OUTER_WIDTH + ROOM_GAP);
      const y = iy * (ROOM_OUTER_HEIGHT + ROOM_GAP);

      this.rooms.setValue(ix, iy, this.currentRoom);
      this.currentRoom.setPosition(x, y, ix, iy);
      this.rooms.setValue(
        oldIx,
        oldIy,
        new Room(oldX, oldY, oldIx, oldIy, true)
      );

      this.updateDoors();
      this.player.x += xDiff;
    }
  }

  updateDoors() {
    const rooms = this.rooms;

    const getDoor = (room, otherRoom) => {
      if (room.isMissing && !otherRoom) {
        return DOOR_NONE_EDGE;
      }
      if (room.isMissing && otherRoom.isMissing) {
        return DOOR_NONE;
      }
      if (!otherRoom) {
        return DOOR_EDGE;
      }
      if (otherRoom.isMissing) {
        return DOOR_404;
      }
      if (room.isMissing && !otherRoom.isMissing) {
        // A 404 door when looking at it from the missing room.
        return DOOR_404;
      }
      return DOOR_OPEN;
    };

    for (let ix = 0; ix < rooms.xCount; ix++) {
      for (let iy = 0; iy < rooms.yCount; iy++) {
        const room = rooms.getValue(ix, iy);
        if (!room) {
          continue;
        }

        room.doors.left = getDoor(room, rooms.getValue(ix - 1, iy));
        room.doors.right = getDoor(room, rooms.getValue(ix + 1, iy));
        room.doors.top = getDoor(room, rooms.getValue(ix, iy - 1));
        room.doors.bottom = getDoor(room, rooms.getValue(ix, iy + 1));
      }
    }
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
          const room = this.rooms.getValue(ix, iy);
          if (room) {
            room.render(context);
          }
        }
      }
    } else {
      this.currentRoom.render(context);
    }

    this.player.render();
  }
}
