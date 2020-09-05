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
  DOOR_OPEN,
  GAME_OK
} from "./room.js";
import { Camera } from "./camera.js";
import { createPlayer } from "./player.js";

const ROOM_GAP = 30;

const ROOM_MOVE_DELAY_MS = 3000;

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

    this.movingRoom = this.rooms.getValue(3, 4);
    this.movingRoom.xMoveDirection = 1;
    this.lastAutoMoveTime = performance.now();

    this.player = createPlayer();
    this.player.x = this.currentRoom.x + 30;
    this.player.y = this.currentRoom.bottom - this.player.height;

    this.camera = new Camera();
    this.camera.zoomTo(this.currentRoom.getOuterBoundingBox());

    this.gameOverState = GAME_OK;
  }

  autoMoveRooms() {
    if (!this.movingRoom) {
      return;
    }

    const room = this.movingRoom;
    const now = performance.now();

    if (now - this.lastAutoMoveTime > ROOM_MOVE_DELAY_MS) {
      const roomAtNextPosition = this.rooms.getValue(
        room.ix + room.xMoveDirection,
        room.iy
      );
      if (!(roomAtNextPosition && roomAtNextPosition.isMissing)) {
        room.xMoveDirection = -room.xMoveDirection;
      }

      this.moveRoom(room, room.xMoveDirection, 0);
      this.lastAutoMoveTime = now;
    }
  }

  moveRoom(room, xAmount, yAmount) {
    if (room.isMissing) {
      return;
    }

    const oldIx = room.ix;
    const oldIy = room.iy;
    const ix = room.ix + xAmount;
    const iy = room.iy + yAmount;
    const oldX = room.outerX;
    const oldY = room.outerY;

    const roomAtNextPosition = this.rooms.getValue(ix, iy);

    if (roomAtNextPosition && roomAtNextPosition.isMissing) {
      const x = ix * (ROOM_OUTER_WIDTH + ROOM_GAP);
      const y = iy * (ROOM_OUTER_HEIGHT + ROOM_GAP);
      const xDiff = x - oldX;
      const yDiff = y - oldY;

      this.rooms.setValue(ix, iy, room);
      room.setPosition(x, y, ix, iy);
      this.rooms.setValue(
        oldIx,
        oldIy,
        new Room(oldX, oldY, oldIx, oldIy, true)
      );
      this.updateDoors();

      if (room === this.currentRoom) {
        this.player.x += xDiff;
        this.player.y += yDiff;
        this.moveCameraTo(room);
        this.camera.shake(xAmount * 20, yAmount * 20);
      } else if (roomAtNextPosition === this.currentRoom) {
        // Player is crushed by the room.
        this.gameOver = true;
        return;
      }
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
    this.autoMoveRooms();
    const gameOverState = this.currentRoom.update(this.player);
    if (gameOverState !== GAME_OK && gameOverState !== this.gameOverState) {
      this.gameOverState = gameOverState;
    }

    if (this.gameOverState === GAME_OK) {
      this.player.do_update(this.currentRoom, this.currentRoom.ladders, []);
      this.checkRoomChange();
    }
    this.camera.update();
  }

  checkRoomChange() {
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

    if (direction >= 0) {
      if (sprite.x < nextRoom.x) {
        sprite.x = nextRoom.x;
      }
    } else {
      if (nextRoom.right < sprite.x + sprite.width) {
        sprite.x = nextRoom.right - sprite.width;
      }
    }

    this.panCameraTo(nextRoom);
  }

  moveVertically(sprite, direction) {
    const previousRoom = this.currentRoom;
    const newiy = previousRoom.iy + direction;
    const nextRoom = this.rooms.getValue(previousRoom.ix, newiy);

    if (!nextRoom) {
      return;
    }

    this.currentRoom = nextRoom;

    if (direction >= 0) {
      sprite.y = nextRoom.y;
    } else {
      sprite.y = nextRoom.bottom - sprite.height;
    }

    this.panCameraTo(nextRoom);
  }

  moveCameraTo(room) {
    if (this.camera.area !== this) {
      this.camera.zoomTo(room.getOuterBoundingBox());
    }
  }

  panCameraTo(room) {
    if (this.camera.area !== this) {
      this.camera.panTo(room);
    }
  }

  render(canvas, context) {
    const camera = this.camera;

    context.save();
    context.translate(canvas.width / 2, canvas.height / 2);
    context.scale(camera.zoom, camera.zoom);
    context.translate(-camera.x, -camera.y);

    const drawAllRooms = camera.area === this;

    if (drawAllRooms) {
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

    if (this.gameOverState === GAME_OK) {
      this.player.render();
    }

    context.restore();
  }
}
