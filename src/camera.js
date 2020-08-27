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

import { getCanvas } from "kontra";

const PAN_SPEED = 15;

export class Camera {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.zoom = 1;
  }

  zoomTo(area) {
    this.area = area;
    if (!area) {
      return;
    }

    this.x = area.x + area.width / 2;
    this.y = area.y + area.height / 2;

    const canvas = getCanvas();

    if (area.width / area.height >= canvas.width / canvas.height) {
      this.zoom = canvas.width / area.width;
    } else {
      this.zoom = canvas.height / area.height;
    }
  }

  panTo(area) {
    this.area = area;
  }

  update() {
    if (!this.area) {
      return;
    }

    const area = this.area;
    const centerX = area.x + area.width / 2;
    const centerY = area.y + area.height / 2;

    if (this.x < centerX - PAN_SPEED) {
      this.x += PAN_SPEED;
    } else if (this.x > centerX + PAN_SPEED) {
      this.x -= PAN_SPEED;
    } else {
      this.x = centerX;
    }

    if (this.y < centerY - PAN_SPEED) {
      this.y += PAN_SPEED;
    } else if (this.y > centerY + PAN_SPEED) {
      this.y -= PAN_SPEED;
    } else {
      this.y = centerY;
    }
  }
}
