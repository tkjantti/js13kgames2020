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

// drawHeight parameter when ladder needs to be drawn shorter
// than it actually is.
const createLadder = (height, drawHeight) => {
  return Sprite({
    width: LADDER_WIDTH,
    height: height,
    drawHeight: drawHeight || height,

    render() {
      const stepGap = 5;
      const stepCount = this.drawHeight / stepGap;
      const color = "rgb(60,30,30)";
      const color2 = "rgb(60,60,60)";
      const drawY = (height - this.drawHeight) / 2;

      let cx = this.context;
      cx.save();

      cx.fillStyle = color2;
      cx.fillRect(this.width / 3, drawY, this.width / 3, this.drawHeight);

      for (let i = 0; i < stepCount; i++) {
        cx.fillStyle = color;
        cx.fillRect(
          0,
          drawY + i * stepGap + stepGap / 2,
          this.width,
          stepGap / 2
        );
      }

      cx.restore();
    }
  });
};

export class Room {
  constructor(x, y, ix, iy, doors) {
    this.outerX = x;
    this.outerY = y;
    this.x = x + ROOM_EDGE_WIDTH;
    this.y = y + ROOM_EDGE_HEIGHT;
    this.ix = ix;
    this.iy = iy;
    this.doors = doors;
    this.right = this.x + ROOM_WIDTH;
    this.bottom = this.y + ROOM_HEIGHT;
    this.width = ROOM_WIDTH;
    this.height = ROOM_HEIGHT;

    this.ladders = [];

    const ladder = createLadder(
      ROOM_HEIGHT,
      // Make ladder appear as tall as the back wall is.
      ROOM_HEIGHT - 2 * ROOM_EDGE_HEIGHT
    );
    ladder.x = this.x + ROOM_WIDTH / 2 - ladder.width / 2;
    ladder.y = this.y;
    this.ladders.push(ladder);

    const leftLadder = createLadder(ROOM_HEIGHT / 2);
    leftLadder.x = this.x + 5;
    leftLadder.y = this.y + ROOM_HEIGHT / 2 - 5;
    this.ladders.push(leftLadder);

    const rightLadder = createLadder(ROOM_HEIGHT / 2);
    rightLadder.x = this.x + ROOM_WIDTH - rightLadder.width - 5;
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
      this.doors.left &&
      sprite.x - this.x < 10 &&
      this.y + WALL_TO_DOOR_HEIGHT - DOOR_PASSING_MARGIN < sprite.y &&
      sprite.y + sprite.height <
        this.bottom - WALL_TO_DOOR_HEIGHT + DOOR_PASSING_MARGIN
    );
  }

  isAtRightDoor(sprite) {
    return (
      this.doors.right &&
      this.right - (sprite.x + sprite.width) < 10 &&
      this.y + WALL_TO_DOOR_HEIGHT - DOOR_PASSING_MARGIN < sprite.y &&
      sprite.y + sprite.height <
        this.bottom - WALL_TO_DOOR_HEIGHT + DOOR_PASSING_MARGIN
    );
  }

  isAtTopDoor(sprite) {
    return (
      this.doors.top &&
      sprite.y - this.y < -10 &&
      this.x + WALL_TO_DOOR_WIDTH - DOOR_PASSING_MARGIN < sprite.x &&
      sprite.x + sprite.width <
        this.right - WALL_TO_DOOR_WIDTH + DOOR_PASSING_MARGIN
    );
  }

  isAtBottomDoor(sprite) {
    return (
      this.doors.bottom &&
      this.bottom - (sprite.y + sprite.height) < 10 &&
      this.x + WALL_TO_DOOR_WIDTH - DOOR_PASSING_MARGIN < sprite.x &&
      sprite.x + sprite.width <
        this.right - WALL_TO_DOOR_WIDTH + DOOR_PASSING_MARGIN
    );
  }

  render(context) {
    context.save();

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

    // doors

    // Top
    context.strokeStyle = this.doors.top ? "green" : "red";
    context.beginPath();
    context.moveTo(this.x + WALL_TO_DOOR_WIDTH, this.y);
    context.lineTo(this.x + WALL_TO_DOOR_WIDTH + DOOR_WIDTH, this.y);
    context.stroke();

    // Bottom
    context.strokeStyle = this.doors.bottom ? "green" : "red";
    context.beginPath();
    context.moveTo(this.x + WALL_TO_DOOR_WIDTH, this.bottom);
    context.lineTo(this.x + WALL_TO_DOOR_WIDTH + DOOR_WIDTH, this.bottom);
    context.stroke();

    // Left
    context.strokeStyle = this.doors.left ? "green" : "red";
    context.beginPath();
    context.moveTo(this.x, this.y + WALL_TO_DOOR_HEIGHT);
    context.lineTo(this.x, this.y + WALL_TO_DOOR_HEIGHT + DOOR_HEIGHT);
    context.stroke();

    // Right
    context.strokeStyle = this.doors.right ? "green" : "red";
    context.beginPath();
    context.moveTo(this.right, this.y + WALL_TO_DOOR_HEIGHT);
    context.lineTo(this.right, this.y + WALL_TO_DOOR_HEIGHT + DOOR_HEIGHT);
    context.stroke();

    // id number
    context.fillStyle = "white";
    context.font = "22px Sans-serif";
    const text = "" + this.ix + ", " + this.iy;
    context.fillText(text, this.outerX + 30, this.outerY + 30);

    for (let i = 0; i < this.ladders.length; i++) {
      this.ladders[i].render();
    }

    context.restore();
  }
}
