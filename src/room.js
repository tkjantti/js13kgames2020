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

export class Room {
  constructor(x, y, ix, iy) {
    this.x = x;
    this.y = y;
    this.ix = ix;
    this.iy = iy;
    this.right = this.x + ROOM_WIDTH;
    this.bottom = this.y + ROOM_HEIGHT;
  }

  isCloseToLeftWall(sprite) {
    return sprite.x - this.x < 10;
  }

  isCloseToRightWall(sprite) {
    return this.right - (sprite.x + sprite.width) < 10;
  }

  isCloseToTopWall(sprite) {
    return sprite.y - this.y < 10;
  }

  isCloseToBottomWall(sprite) {
    return this.bottom - (sprite.y + sprite.height) < 10;
  }

  render(context) {
    context.save();
    context.strokeStyle = "white";
    context.lineWidth = 5;
    context.beginPath();
    context.lineTo(this.x, this.y);
    context.lineTo(this.x + ROOM_WIDTH, this.y);
    context.lineTo(this.x + ROOM_WIDTH, this.y + ROOM_HEIGHT);
    context.lineTo(this.x, this.y + ROOM_HEIGHT);
    context.closePath();
    context.stroke();

    context.fillStyle = "white";
    context.font = "22px Sans-serif";
    const text = "" + this.ix + ", " + this.iy;
    context.fillText(text, this.x + 30, this.y + 30);
    context.restore();
  }
}
