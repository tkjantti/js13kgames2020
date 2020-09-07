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
  GAME_OK,
  GAME_OVER_CRUSH,
  GAME_OVER_FALL,
  ACTION_MOVE,
  ACTION_LASER
} from "./room.js";
import { Camera } from "./camera.js";
import { Player } from "./player.js";

const ROOM_GAP = 30;

const ROOM_MOVE_DELAY_MS = 3000;

/*
 * Level format:
 *
 * # - plain room
 * . - missing (non-existing) room
 * - - switch off
 * / - switch on
 * H - horizontally moving room
 * L - laser
 * l - wire left
 * r - wire right
 * t - wire top
 * b - wire bottom
 */

// prettier-ignore
const level = [
  "/r   lb   .    #    .    #    #    #    #    #    #    #    #    #    #",
  "#    Lt   #    #-b  .    #    #    #    #    #    #    #    #    #    #",
  ".    .    #    #Ht  .    .    #    #    #    #    #    #    #    #    #",
  "#    #    #    #    .    #    #    #    #    #    #    #    #    #    #",
  ".    .    #    #    .    #    .    #    #    #    #    #    #    #    #",
  ".    .    #    #    .    .    .    #    #    #    #    #    #    #    #",
  ".    .    #    #    #    #    #    #    #    #    #    #    #    #    #",
  ".    .    #    #    #    #    #    #    #    #    #    #    #    #    #",
  ".    .    #    #    #    #    #    #    #    #    #    #    #    #    #",
  ".    .    #    #    #    #    #    #    #    #    #    #    #    #    #",
  ".    .    #    #    #    #    #    #    #    #    #    #    #    #    #",
  ".    .    #    #    #    #    #    #    #    #    #    #    #    #    #",
  ".    .    #    #    #    #    #    #    #    #    #    #    #    #    #"
];

const parseLevel = () => {
  const rooms = new Array2D(level[0].split(/ +/).length, level.length);

  for (let iy = 0; iy < level.length; iy++) {
    const row = level[iy].split(/ +/);
    for (let ix = 0; ix < row.length; ix++) {
      const str = row[ix];
      const properties = {
        wires: {
          left: false,
          right: false,
          top: false,
          bottom: false
        }
      };

      properties.isMissing = str.includes(".");

      properties.switch = str.includes("/")
        ? true
        : str.includes("-")
        ? false
        : undefined;

      if (str.includes("L")) {
        properties.action = ACTION_LASER;
      }
      if (str.includes("H")) {
        properties.action = ACTION_MOVE;
      }

      properties.wires.left = str.includes("l");
      properties.wires.right = str.includes("r");
      properties.wires.top = str.includes("t");
      properties.wires.bottom = str.includes("b");

      const x = ix * (ROOM_OUTER_WIDTH + ROOM_GAP);
      const y = iy * (ROOM_OUTER_HEIGHT + ROOM_GAP);
      rooms.setValue(ix, iy, new Room(x, y, ix, iy, properties));
    }
  }

  return rooms;
};

const findRight = (room, rooms) => {
  const rightRoom = rooms.getValue(room.ix + 1, room.iy);
  const topRoom = rooms.getValue(room.ix, room.iy - 1);
  const bottomRoom = rooms.getValue(room.ix, room.iy + 1);

  const right = room.wires.right && rightRoom && findRight(rightRoom, rooms);
  const top = room.wires.top && topRoom && findTop(topRoom, rooms);
  const bottom =
    room.wires.bottom && bottomRoom && findBottom(bottomRoom, rooms);

  return room.wires.left && (room.action ? room : right || top || bottom);
};

const findLeft = (room, rooms) => {
  const leftRoom = rooms.getValue(room.ix - 1, room.iy);
  const topRoom = rooms.getValue(room.ix, room.iy - 1);
  const bottomRoom = rooms.getValue(room.ix, room.iy + 1);

  const left = room.wires.left && leftRoom && findLeft(leftRoom, rooms);
  const top = room.wires.top && topRoom && findTop(topRoom, rooms);
  const bottom =
    room.wires.bottom && bottomRoom && findBottom(bottomRoom, rooms);

  return room.wires.right && (room.action ? room : left || top || bottom);
};

const findTop = (room, rooms) => {
  const leftRoom = rooms.getValue(room.ix - 1, room.iy);
  const rightRoom = rooms.getValue(room.ix + 1, room.iy);
  const topRoom = rooms.getValue(room.ix, room.iy - 1);

  const right = room.wires.right && rightRoom && findRight(rightRoom, rooms);
  const left = room.wires.left && leftRoom && findLeft(leftRoom, rooms);
  const top = room.wires.top && topRoom && findTop(topRoom, rooms);

  return room.wires.bottom && (room.action ? room : right || left || top);
};

const findBottom = (room, rooms) => {
  const leftRoom = rooms.getValue(room.ix - 1, room.iy);
  const rightRoom = rooms.getValue(room.ix + 1, room.iy);
  const bottomRoom = rooms.getValue(room.ix, room.iy + 1);

  const right = room.wires.right && rightRoom && findRight(rightRoom, rooms);
  const left = room.wires.left && leftRoom && findLeft(leftRoom, rooms);
  const bottom =
    room.wires.bottom && bottomRoom && findBottom(bottomRoom, rooms);

  return room.wires.top && (room.action ? room : right || left || bottom);
};

const findConnection = (room, rooms) => {
  const leftRoom = rooms.getValue(room.ix - 1, room.iy);
  const rightRoom = rooms.getValue(room.ix + 1, room.iy);
  const topRoom = rooms.getValue(room.ix, room.iy - 1);
  const bottomRoom = rooms.getValue(room.ix, room.iy + 1);

  const right = room.wires.right && rightRoom && findRight(rightRoom, rooms);
  const left = room.wires.left && leftRoom && findLeft(leftRoom, rooms);
  const top = room.wires.top && topRoom && findTop(topRoom, rooms);
  const bottom =
    room.wires.bottom && bottomRoom && findBottom(bottomRoom, rooms);

  return right || left || top || bottom;
};

export class Level {
  constructor() {
    this.rooms = parseLevel();

    // For level to work with camera.zoomTo()
    this.x = 0;
    this.y = 0;
    this.width = this.rooms.xCount * (ROOM_OUTER_WIDTH + ROOM_GAP);
    this.height = this.rooms.yCount * (ROOM_OUTER_HEIGHT + ROOM_GAP);

    this.updateDoors();
    this.currentRoom = this.rooms.getValue(0, 1);
    this.lastAutoMoveTime = performance.now();

    this.player = new Player();
    this.player.x = this.currentRoom.x + 30;
    this.player.y = this.currentRoom.bottom - this.player.height;

    this.camera = new Camera();
    this.camera.zoomTo(this.currentRoom.getOuterBoundingBox());

    this.gameOverState = GAME_OK;

    // For switches in on state, set linked action:
    for (let ix = 0; ix < this.rooms.xCount; ix++) {
      for (let iy = 0; iy < this.rooms.yCount; iy++) {
        const room = this.rooms.getValue(ix, iy);

        if (room && room.switch && room.switch.on) {
          const otherRoom = findConnection(room, this.rooms);
          if (otherRoom) {
            otherRoom.toggleAction(true);
          }
        }
      }
    }
  }

  autoMoveRooms() {
    const now = performance.now();

    for (let ix = 0; ix < this.rooms.xCount; ix++) {
      for (let iy = 0; iy < this.rooms.yCount; iy++) {
        const room = this.rooms.getValue(ix, iy);

        if (!room.xMoveDirection) {
          continue;
        }

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
        new Room(oldX, oldY, oldIx, oldIy, { isMissing: true })
      );
      this.updateDoors();

      if (room === this.currentRoom) {
        this.player.x += xDiff;
        this.player.y += yDiff;
        this.moveCameraTo(room);
        this.camera.shake(xAmount * 20, yAmount * 20);
      } else if (roomAtNextPosition === this.currentRoom) {
        // Player is crushed by the room.
        this.gameOverState = GAME_OVER_CRUSH;
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

  toggleSwitch(isOn) {
    const otherRoom = findConnection(this.currentRoom, this.rooms);
    if (otherRoom) {
      otherRoom.toggleAction(isOn);
    }
  }

  update() {
    this.autoMoveRooms();

    const gameOverState = this.currentRoom.update(
      this.player,
      this.toggleSwitch.bind(this)
    );
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
      this.enterRoom(this.player, 1, 0);
    } else if (
      this.player.x + this.player.width < this.currentRoom.x &&
      this.player.isMovingLeft()
    ) {
      this.enterRoom(this.player, -1, 0);
    } else if (
      (this.player.isMovingDown() ||
        this.isEmptyHereAndBelow(this.currentRoom)) &&
      this.currentRoom.isAtBottomDoor(this.player)
    ) {
      this.enterRoom(this.player, 0, 1);
    } else if (
      this.currentRoom.isMissing &&
      this.currentRoom.iy >= this.rooms.yCount - 1
    ) {
      this.gameOverState = GAME_OVER_FALL;
    } else if (
      this.player.isMovingUp() &&
      this.currentRoom.isAtTopDoor(this.player)
    ) {
      this.enterRoom(this.player, 0, -1);
    }
  }

  isEmptyHereAndBelow(room) {
    const roomBelow = this.rooms.getValue(room.ix, room.iy + 1);
    return room.isMissing && roomBelow && roomBelow.isMissing;
  }

  enterRoom(sprite, xDirection, yDirection) {
    const previousRoom = this.currentRoom;
    const ix = previousRoom.ix + xDirection;
    const iy = previousRoom.iy + yDirection;
    const nextRoom = this.rooms.getValue(ix, iy);

    if (!nextRoom) {
      return;
    }

    this.currentRoom = nextRoom;

    if (xDirection > 0) {
      if (sprite.x < nextRoom.x) {
        sprite.x = nextRoom.x;
      }
    } else if (xDirection < 0) {
      if (nextRoom.right < sprite.x + sprite.width) {
        sprite.x = nextRoom.right - sprite.width;
      }
    }

    if (yDirection > 0) {
      sprite.y = nextRoom.y;
    } else if (yDirection < 0) {
      sprite.y = nextRoom.bottom - sprite.height;
    }

    nextRoom.resetTraps(sprite);

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
      this.player.render(context);
    }

    context.restore();
  }
}
