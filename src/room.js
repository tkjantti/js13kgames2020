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

export const ROOM_WIDTH = 300;
export const ROOM_HEIGHT = 300;

const DOOR_WIDTH = 80;
const DOOR_HEIGHT = 100;

const WALL_TO_DOOR_WIDTH = (ROOM_WIDTH - DOOR_WIDTH) / 2;
const WALL_TO_DOOR_HEIGHT = (ROOM_HEIGHT - DOOR_HEIGHT) / 2;

const DOOR_PASSING_MARGIN = 13;

export class Room {
  constructor(x, y, ix, iy, doors) {
    this.x = x;
    this.y = y;
    this.ix = ix;
    this.iy = iy;
    this.doors = doors;
    this.right = this.x + ROOM_WIDTH;
    this.bottom = this.y + ROOM_HEIGHT;
    this.width = ROOM_WIDTH;
    this.height = ROOM_HEIGHT;
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
      sprite.y - this.y < 10 &&
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

    const Z = 40;

    context.lineWidth = 8;

    // top
    context.strokeStyle = "#101010";
    context.beginPath();
    context.moveTo(this.x, this.y);
    context.lineTo(this.x + Z, this.y + Z);
    context.stroke();

    context.strokeStyle = "#202020";
    context.beginPath();
    context.moveTo(this.x + Z, this.y + Z);
    context.lineTo(this.x + ROOM_WIDTH - Z, this.y + Z);
    context.stroke();

    context.strokeStyle = "#303030";
    context.beginPath();
    context.moveTo(this.x + ROOM_WIDTH - Z, this.y + Z);
    context.lineTo(this.x + ROOM_WIDTH, this.y);
    context.stroke();

    // bottom
    context.strokeStyle = "#101010";
    context.beginPath();
    context.moveTo(this.x, this.y + ROOM_HEIGHT);
    context.lineTo(this.x + Z, this.y + ROOM_HEIGHT - Z);
    context.stroke();

    context.strokeStyle = "#202020";
    context.beginPath();
    context.moveTo(this.x + Z, this.y + ROOM_HEIGHT - Z);
    context.lineTo(this.x + ROOM_WIDTH - Z, this.y + ROOM_HEIGHT - Z);
    context.stroke();

    context.strokeStyle = "#303030";
    context.beginPath();
    context.moveTo(this.x + ROOM_WIDTH - Z, this.y + ROOM_HEIGHT - Z);
    context.lineTo(this.x + ROOM_WIDTH, this.y + ROOM_HEIGHT);
    context.stroke();

    //left
    context.strokeStyle = "#202020";
    context.beginPath();
    context.moveTo(this.x + Z, this.y + Z);
    context.lineTo(this.x + Z, this.y + ROOM_HEIGHT - Z);
    context.stroke();

    // right
    context.beginPath();
    context.moveTo(this.x + ROOM_WIDTH - Z, this.y + Z);
    context.lineTo(this.x + ROOM_WIDTH - Z, this.y + ROOM_HEIGHT - Z);
    context.stroke();

    //texture
    context.lineWidth = 4;

    //end
    //top
    context.beginPath();
    context.moveTo(this.x + ROOM_WIDTH / 2, this.y + Z);
    context.lineTo(this.x + ROOM_WIDTH / 2, this.y + ROOM_HEIGHT - Z);
    context.stroke();
    // right
    context.beginPath();
    context.moveTo(this.x + Z, this.y + ROOM_WIDTH / 2);
    context.lineTo(this.x + ROOM_WIDTH - Z, this.y + ROOM_HEIGHT / 2);
    context.stroke();

    // ceiling/sides
    context.strokeStyle = "#101010";
    //top
    context.beginPath();
    context.moveTo(this.x + ROOM_WIDTH / 2, this.y);
    context.lineTo(this.x + ROOM_WIDTH / 2, this.y + Z);
    context.stroke();
    //bottom
    context.strokeStyle = "#303030";
    context.beginPath();
    context.moveTo(this.x + ROOM_WIDTH / 2, this.y + ROOM_HEIGHT - Z);
    context.lineTo(this.x + ROOM_WIDTH / 2, this.y + ROOM_HEIGHT);
    context.stroke();
    // left
    context.strokeStyle = "#101010";
    context.beginPath();
    context.moveTo(this.x, this.y + ROOM_HEIGHT / 2);
    context.lineTo(this.x + Z, this.y + ROOM_HEIGHT / 2);
    context.stroke();
    // right
    context.strokeStyle = "#303030";
    context.beginPath();
    context.moveTo(this.x + ROOM_WIDTH - Z, this.y + ROOM_HEIGHT / 2);
    context.lineTo(this.x + ROOM_WIDTH, this.y + ROOM_HEIGHT / 2);
    context.stroke();

    // borders
    context.strokeStyle = "white";
    context.lineWidth = 5;
    context.beginPath();
    context.lineTo(this.x, this.y);
    context.lineTo(this.x + ROOM_WIDTH, this.y);
    context.lineTo(this.x + ROOM_WIDTH, this.y + ROOM_HEIGHT);
    context.lineTo(this.x, this.y + ROOM_HEIGHT);
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
    context.fillText(text, this.x + 30, this.y + 30);

    context.restore();
  }
}
