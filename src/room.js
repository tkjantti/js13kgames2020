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

import { Sprite } from "kontra";

// No door at missing rooms, can pass
export const DOOR_NONE = 0;

// No door at missing rooms, can not pass
export const DOOR_NONE_EDGE = 1;

// Door at the edge of the level
export const DOOR_EDGE = 2;

// Open door, can pass
export const DOOR_OPEN = 3;

// Door to a missing room
export const DOOR_404 = 404;

// The outmost width and height of the room that is drawn when
// applying the 3D perspective.
export const ROOM_OUTER_WIDTH = 300;
export const ROOM_OUTER_HEIGHT = 300;

const Z = 40;

// Distance from the outmost perspective square to the actual 2D square
// that appears halfway in the depth direction.
const ROOM_EDGE_WIDTH = Z / 2;
const ROOM_EDGE_HEIGHT = Z / 2;

// The actual width and height of the room that affects gameplay.
// the objects within the room appear halfway in the depth direction.
const ROOM_WIDTH = ROOM_OUTER_WIDTH - 2 * ROOM_EDGE_WIDTH;
const ROOM_HEIGHT = ROOM_OUTER_HEIGHT - 2 * ROOM_EDGE_HEIGHT;

const DOOR_WIDTH = 80;
const DOOR_HEIGHT = 80;

const WALL_TO_DOOR_WIDTH = (ROOM_WIDTH - DOOR_WIDTH) / 2;
const WALL_TO_DOOR_HEIGHT = (ROOM_HEIGHT - DOOR_HEIGHT) / 2;

const DOOR_PASSING_MARGIN = 13;

const LADDER_WIDTH = 10;

const LADDER_PERSPECTIVE_LEFT = 0;
const LADDER_PERSPECTIVE_BACK = 1;
const LADDER_PERSPECTIVE_RIGHT = 2;

// drawHeight parameter when ladder needs to be drawn shorter
// than it actually is.
const createLadder = (height, perspective, drawHeight) => {
  return Sprite({
    width: LADDER_WIDTH,
    height: height,
    drawHeight: drawHeight || height,
    perspective: perspective,

    render() {
      const stepGap = 5;
      const stepCount = this.drawHeight / stepGap;
      const color = "rgb(60,30,30)";
      const color2 = "rgb(60,60,60)";
      const width =
        this.perspective === LADDER_PERSPECTIVE_BACK
          ? this.width
          : LADDER_WIDTH / 2;
      const y =
        this.perspective === LADDER_PERSPECTIVE_BACK
          ? (this.height - this.drawHeight) / 2
          : this.height - this.drawHeight;

      let rodX = width / 3;
      if (this.perspective === LADDER_PERSPECTIVE_LEFT) {
        rodX = 0;
      } else if (this.perspective === LADDER_PERSPECTIVE_RIGHT) {
        rodX = (2 * width) / 3;
      }

      let cx = this.context;
      cx.save();

      cx.fillStyle = color2;
      cx.fillRect(rodX, y, width / 3, this.drawHeight);

      for (let i = 0; i < stepCount; i++) {
        cx.fillStyle = color;
        cx.fillRect(0, y + i * stepGap + stepGap / 2, width, stepGap / 2);
      }

      cx.restore();
    }
  });
};

const canPassDoor = doorState => {
  return (
    doorState === DOOR_OPEN || doorState === DOOR_404 || doorState === DOOR_NONE
  );
};

export class Room {
  constructor(x, y, ix, iy, isMissing) {
    this.ladders = [];
    this.setPosition(x, y, ix, iy);
    this.isMissing = isMissing;

    this.doors = {
      left: DOOR_EDGE,
      right: DOOR_EDGE,
      top: DOOR_EDGE,
      bottom: DOOR_EDGE
    };

    if (!this.isMissing) {
      this.addLadders();
    }
  }

  setPosition(x, y, ix, iy) {
    const previousX = this.x;
    const previousY = this.y;

    this.outerX = x;
    this.outerY = y;
    this.x = x + ROOM_EDGE_WIDTH;
    this.y = y + ROOM_EDGE_HEIGHT;
    this.ix = ix;
    this.iy = iy;
    this.right = this.x + ROOM_WIDTH;
    this.bottom = this.y + ROOM_HEIGHT;
    this.width = ROOM_WIDTH;
    this.height = ROOM_HEIGHT;

    const xDiff = this.x - previousX;
    const yDiff = this.y - previousY;

    for (let i = 0; i < this.ladders.length; i++) {
      const ladder = this.ladders[i];
      ladder.x += xDiff;
      ladder.y += yDiff;
    }
  }

  addLadders() {
    const ladder = createLadder(
      ROOM_HEIGHT,
      LADDER_PERSPECTIVE_BACK,
      // Make ladder appear as tall as the back wall is.
      ROOM_HEIGHT - 2 * ROOM_EDGE_HEIGHT
    );
    ladder.x = this.x + ROOM_WIDTH / 2 - ladder.width / 2;
    ladder.y = this.y;
    this.ladders.push(ladder);

    const leftLadder = createLadder(
      ROOM_HEIGHT / 2,
      LADDER_PERSPECTIVE_LEFT,
      ROOM_HEIGHT / 2 - DOOR_HEIGHT / 2
    );
    leftLadder.x = this.x;
    leftLadder.y = this.y + ROOM_HEIGHT / 2 - 5;
    this.ladders.push(leftLadder);

    const rightLadder = createLadder(
      ROOM_HEIGHT / 2,
      LADDER_PERSPECTIVE_RIGHT,
      ROOM_HEIGHT / 2 - DOOR_HEIGHT / 2
    );
    rightLadder.x = this.x + ROOM_WIDTH - rightLadder.width + 5;
    rightLadder.y = this.y + ROOM_HEIGHT / 2 - 5;
    this.ladders.push(rightLadder);
  }

  getOuterBoundingBox() {
    return {
      x: this.outerX,
      y: this.outerY,
      width: ROOM_OUTER_WIDTH,
      height: ROOM_OUTER_HEIGHT
    };
  }

  isAtLeftDoor(sprite) {
    return (
      canPassDoor(this.doors.left) &&
      sprite.x - this.x < 10 &&
      (this.doors.left === DOOR_NONE || this.atDoorY(sprite))
    );
  }

  isAtRightDoor(sprite) {
    return (
      canPassDoor(this.doors.right) &&
      this.right - (sprite.x + sprite.width) < 10 &&
      (this.doors.right === DOOR_NONE || this.atDoorY(sprite))
    );
  }

  isAtTopDoor(sprite) {
    return (
      canPassDoor(this.doors.top) &&
      sprite.y - this.y < -10 &&
      (this.doors.top === DOOR_NONE || this.atDoorX(sprite))
    );
  }

  isAtBottomDoor(sprite) {
    return (
      canPassDoor(this.doors.bottom) &&
      this.bottom - (sprite.y + sprite.height) < 10 &&
      (this.doors.bottom === DOOR_NONE || this.atDoorX(sprite))
    );
  }

  atDoorX(sprite) {
    return (
      this.x + WALL_TO_DOOR_WIDTH - DOOR_PASSING_MARGIN < sprite.x &&
      sprite.x + sprite.width <
        this.right - WALL_TO_DOOR_WIDTH + DOOR_PASSING_MARGIN
    );
  }

  atDoorY(sprite) {
    return (
      this.y + WALL_TO_DOOR_HEIGHT - DOOR_PASSING_MARGIN < sprite.y &&
      sprite.y + sprite.height <
        this.bottom - WALL_TO_DOOR_HEIGHT + DOOR_PASSING_MARGIN
    );
  }

  render(context) {
    context.save();

    if (!this.isMissing) {
      this.renderId(context);
      this.renderRoom(context);
    }

    this.renderDoors(context);

    for (let i = 0; i < this.ladders.length; i++) {
      this.ladders[i].render();
    }

    context.restore();
  }

  renderRoom(context) {
    //  ceiling/bottom/sides

    context.lineWidth = 8;

    // top
    context.strokeStyle = "#101010";
    context.beginPath();
    context.moveTo(this.outerX, this.outerY);
    context.lineTo(this.outerX + Z, this.outerY + Z);
    context.stroke();

    context.strokeStyle = "#202020";
    context.beginPath();
    context.moveTo(this.outerX + Z, this.outerY + Z);
    context.lineTo(this.outerX + ROOM_OUTER_WIDTH - Z, this.outerY + Z);
    context.stroke();

    context.strokeStyle = "#303030";
    context.beginPath();
    context.moveTo(this.outerX + ROOM_OUTER_WIDTH - Z, this.outerY + Z);
    context.lineTo(this.outerX + ROOM_OUTER_WIDTH, this.outerY);
    context.stroke();

    // bottom
    context.strokeStyle = "#101010";
    context.beginPath();
    context.moveTo(this.outerX, this.outerY + ROOM_OUTER_HEIGHT);
    context.lineTo(this.outerX + Z, this.outerY + ROOM_OUTER_HEIGHT - Z);
    context.stroke();

    context.strokeStyle = "#202020";
    context.beginPath();
    context.moveTo(this.outerX + Z, this.outerY + ROOM_OUTER_HEIGHT - Z);
    context.lineTo(
      this.outerX + ROOM_OUTER_WIDTH - Z,
      this.outerY + ROOM_OUTER_HEIGHT - Z
    );
    context.stroke();

    context.strokeStyle = "#303030";
    context.beginPath();
    context.moveTo(
      this.outerX + ROOM_OUTER_WIDTH - Z,
      this.outerY + ROOM_OUTER_HEIGHT - Z
    );
    context.lineTo(
      this.outerX + ROOM_OUTER_WIDTH,
      this.outerY + ROOM_OUTER_HEIGHT
    );
    context.stroke();

    //left
    context.strokeStyle = "#202020";
    context.beginPath();
    context.moveTo(this.outerX + Z, this.outerY + Z);
    context.lineTo(this.outerX + Z, this.outerY + ROOM_OUTER_HEIGHT - Z);
    context.stroke();

    // right
    context.beginPath();
    context.moveTo(this.outerX + ROOM_OUTER_WIDTH - Z, this.outerY + Z);
    context.lineTo(
      this.outerX + ROOM_OUTER_WIDTH - Z,
      this.outerY + ROOM_OUTER_HEIGHT - Z
    );
    context.stroke();

    //texture
    context.lineWidth = 4;

    //end
    //top
    context.beginPath();
    context.moveTo(this.outerX + ROOM_OUTER_WIDTH / 2, this.outerY + Z);
    context.lineTo(
      this.outerX + ROOM_OUTER_WIDTH / 2,
      this.outerY + ROOM_OUTER_HEIGHT - Z
    );
    context.stroke();
    // right
    context.beginPath();
    context.moveTo(this.outerX + Z, this.outerY + ROOM_OUTER_WIDTH / 2);
    context.lineTo(
      this.outerX + ROOM_OUTER_WIDTH - Z,
      this.outerY + ROOM_OUTER_HEIGHT / 2
    );
    context.stroke();

    // ceiling/sides
    context.strokeStyle = "#101010";
    //top
    context.beginPath();
    context.moveTo(this.outerX + ROOM_OUTER_WIDTH / 2, this.outerY);
    context.lineTo(this.outerX + ROOM_OUTER_WIDTH / 2, this.outerY + Z);
    context.stroke();
    //bottom
    context.strokeStyle = "#303030";
    context.beginPath();
    context.moveTo(
      this.outerX + ROOM_OUTER_WIDTH / 2,
      this.outerY + ROOM_OUTER_HEIGHT - Z
    );
    context.lineTo(
      this.outerX + ROOM_OUTER_WIDTH / 2,
      this.outerY + ROOM_OUTER_HEIGHT
    );
    context.stroke();
    // left
    context.strokeStyle = "#101010";
    context.beginPath();
    context.moveTo(this.outerX, this.outerY + ROOM_OUTER_HEIGHT / 2);
    context.lineTo(this.outerX + Z, this.outerY + ROOM_OUTER_HEIGHT / 2);
    context.stroke();
    // right
    context.strokeStyle = "#303030";
    context.beginPath();
    context.moveTo(
      this.outerX + ROOM_OUTER_WIDTH - Z,
      this.outerY + ROOM_OUTER_HEIGHT / 2
    );
    context.lineTo(
      this.outerX + ROOM_OUTER_WIDTH,
      this.outerY + ROOM_OUTER_HEIGHT / 2
    );
    context.stroke();

    // borders
    context.strokeStyle = "white";
    context.lineWidth = 5;
    context.beginPath();
    context.lineTo(this.outerX, this.outerY);
    context.lineTo(this.outerX + ROOM_OUTER_WIDTH, this.outerY);
    context.lineTo(
      this.outerX + ROOM_OUTER_WIDTH,
      this.outerY + ROOM_OUTER_HEIGHT
    );
    context.lineTo(this.outerX, this.outerY + ROOM_OUTER_HEIGHT);
    context.closePath();
    context.stroke();
  }

  renderId(context) {
    context.fillStyle = "green";
    context.font = "bold 18px Sans-serif";
    const text = "" + this.ix + ", " + this.iy;
    context.fillText(text, this.outerX + Z + 30, this.outerY + Z + 35);
  }

  renderDoors(context) {
    const DOOR_OUTER_WIDTH = DOOR_WIDTH * (ROOM_OUTER_WIDTH / ROOM_WIDTH);
    const DOOR_OUTER_HEIGHT = DOOR_HEIGHT * (ROOM_OUTER_HEIGHT / ROOM_HEIGHT);

    // Top
    context.fillStyle = this.getDoorColor(this.doors.top);
    context.beginPath();
    context.moveTo(
      this.x + ROOM_WIDTH / 2 - DOOR_OUTER_WIDTH / 2,
      this.y - ROOM_EDGE_HEIGHT / 2
    );
    context.lineTo(
      this.x + ROOM_WIDTH / 2 + DOOR_OUTER_WIDTH / 2,
      this.y - ROOM_EDGE_HEIGHT / 2
    );
    context.lineTo(
      this.x + ROOM_WIDTH / 2 + DOOR_WIDTH / 2,
      this.y + ROOM_EDGE_HEIGHT / 4
    );
    context.lineTo(
      this.x + ROOM_WIDTH / 2 - DOOR_WIDTH / 2,
      this.y + ROOM_EDGE_HEIGHT / 4
    );
    context.fill();

    // Bottom
    context.fillStyle = this.getDoorColor(this.doors.bottom);
    context.beginPath();
    context.moveTo(
      this.x + ROOM_WIDTH / 2 - DOOR_OUTER_WIDTH / 2,
      this.bottom + ROOM_EDGE_HEIGHT / 2
    );
    context.lineTo(
      this.x + ROOM_WIDTH / 2 + DOOR_OUTER_WIDTH / 2,
      this.bottom + ROOM_EDGE_HEIGHT / 2
    );
    context.lineTo(
      this.x + ROOM_WIDTH / 2 + DOOR_WIDTH / 2,
      this.bottom - ROOM_EDGE_HEIGHT / 4
    );
    context.lineTo(
      this.x + ROOM_WIDTH / 2 - DOOR_WIDTH / 2,
      this.bottom - ROOM_EDGE_HEIGHT / 4
    );
    context.fill();

    // Left
    context.fillStyle = this.getDoorColor(this.doors.left);
    context.beginPath();
    context.moveTo(
      this.x - ROOM_EDGE_WIDTH / 2,
      this.y + ROOM_HEIGHT / 2 - DOOR_OUTER_HEIGHT / 2
    );
    context.lineTo(
      this.x - ROOM_EDGE_WIDTH / 2,
      this.y + ROOM_HEIGHT / 2 + DOOR_OUTER_HEIGHT / 2
    );
    context.lineTo(
      this.x + ROOM_EDGE_WIDTH / 2,
      this.y + ROOM_HEIGHT / 2 + DOOR_HEIGHT / 2
    );
    context.lineTo(
      this.x + ROOM_EDGE_WIDTH / 2,
      this.y + ROOM_HEIGHT / 2 - DOOR_HEIGHT / 2
    );
    context.fill();

    // Right
    context.fillStyle = this.getDoorColor(this.doors.right);
    context.beginPath();
    context.moveTo(
      this.right + ROOM_EDGE_WIDTH / 2,
      this.y + ROOM_HEIGHT / 2 - DOOR_OUTER_HEIGHT / 2
    );
    context.lineTo(
      this.right + ROOM_EDGE_WIDTH / 2,
      this.y + ROOM_HEIGHT / 2 + DOOR_OUTER_HEIGHT / 2
    );
    context.lineTo(
      this.right - ROOM_EDGE_WIDTH / 2,
      this.y + ROOM_HEIGHT / 2 + DOOR_HEIGHT / 2
    );
    context.lineTo(
      this.right - ROOM_EDGE_WIDTH / 2,
      this.y + ROOM_HEIGHT / 2 - DOOR_HEIGHT / 2
    );
    context.fill();
  }

  getDoorColor(doorState) {
    switch (doorState) {
      case DOOR_OPEN: {
        return "green";
      }
      case DOOR_EDGE: {
        return "red";
      }
      case DOOR_404: {
        // blinking colors
        const blink = Math.floor(performance.now() / 1000) % 2 === 0;

        if (this.isMissing) {
          return blink ? "rgb(60, 0, 0)" : "transparent";
        } else {
          return blink ? "red" : "gray";
        }
      }
      default: {
        return "transparent";
      }
    }
  }
}
