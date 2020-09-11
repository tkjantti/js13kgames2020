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

import { keyPressed, collides } from "./kontra";

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

export const GAME_OK = 0;
export const GAME_OVER_LASER = 1;
export const GAME_OVER_CRUSH = 2;
export const GAME_OVER_FALL = 3;

export const ACTION_MOVE = 1;
export const ACTION_LASER = 2;
export const ACTION_LASER_HORIZONTAL = 3;

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

const SWITCH_RELATIVE_X = ROOM_WIDTH * 0.7;
const SWITCH_RELATIVE_Y = ROOM_HEIGHT * 0.75;
const SWITCH_WIDTH = 20;
const SWITCH_HEIGHT = 50;

// So that player can the switch even when rendering does not overlap.
const SWITCH_DRAW_HEIGHT = 30;

const LADDER_PERSPECTIVE_LEFT = 0;
const LADDER_PERSPECTIVE_BACK = 1;
const LADDER_PERSPECTIVE_RIGHT = 2;

const LASER_SPEED = 0.5;

// drawHeight parameter when ladder needs to be drawn shorter
// than it actually is.
const createLadder = (height, perspective, drawHeight) => {
  return {
    width: LADDER_WIDTH,
    height: height,
    drawHeight: drawHeight || height,
    perspective: perspective,

    render(context) {
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

      context.save();

      context.translate(this.x, this.y);

      context.fillStyle = color2;
      context.fillRect(rodX, y, width / 3, this.drawHeight);

      for (let i = 0; i < stepCount; i++) {
        context.fillStyle = color;
        context.fillRect(0, y + i * stepGap + stepGap / 2, width, stepGap / 2);
      }

      context.restore();
    }
  };
};

const canPassDoor = doorState => {
  return (
    doorState === DOOR_OPEN || doorState === DOOR_404 || doorState === DOOR_NONE
  );
};

export class Room {
  constructor(x, y, ix, iy, properties) {
    this.ladders = [];
    this.lasers = [];
    this.setPosition(x, y, ix, iy);
    this.isMissing = properties.isMissing;

    this.doors = {
      left: DOOR_EDGE,
      right: DOOR_EDGE,
      top: DOOR_EDGE,
      bottom: DOOR_EDGE
    };

    this.wires = properties.wires || {};
    this.xMoveDirection = 0;
    this.actions = properties.actions || [];

    // switch value true/false/undefined
    if (properties.switch !== undefined) {
      this.switch = {
        x: this.x + SWITCH_RELATIVE_X,
        y: this.y + SWITCH_RELATIVE_Y,
        width: SWITCH_WIDTH,
        height: SWITCH_HEIGHT,
        on: properties.switch,
        lastToggleTime: performance.now()
      };
    }

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

    for (let i = 0; i < this.lasers.length; i++) {
      const laser = this.lasers[i];
      if (laser.x != null) {
        laser.x += xDiff;
      } else {
        laser.y += yDiff;
      }
    }

    if (this.switch) {
      this.switch.x += xDiff;
      this.switch.y += yDiff;
    }
  }

  hasWires() {
    const wires = this.wires;
    return wires && (wires.left || wires.right || wires.top || wires.bottom);
  }

  hasActions() {
    return this.actions && this.actions.length > 0;
  }

  toggleAction(isOn) {
    for (let i = 0; i < this.actions.length; i++) {
      const action = this.actions[i];

      switch (action) {
        case ACTION_MOVE: {
          this.xMoveDirection = isOn ? 1 : 0;
          break;
        }
        case ACTION_LASER: {
          if (isOn) {
            this.lasers.push({
              x: this.x + this.width * 0.75,
              speed: LASER_SPEED
            });
          } else {
            this.lasers = [];
          }

          break;
        }
        case ACTION_LASER_HORIZONTAL:
          if (isOn) {
            this.lasers.push({
              y: this.y + this.height * 0.25,
              speed: -LASER_SPEED
            });
          } else {
            this.lasers = [];
          }
          break;
      }
    }
  }

  /*
   * Makes sure that traps won't hurt player when entering the room.
   */
  resetTraps(player) {
    for (let i = 0; i < this.lasers.length; i++) {
      const laser = this.lasers[i];

      if (laser.x != null) {
        laser.x = this.x + this.width * 0.4;
        if (player.x < this.x + 0.25 * this.width) {
          laser.speed = LASER_SPEED;
        } else {
          laser.speed = -LASER_SPEED;
        }
      } else {
        laser.y = this.y + this.height * 0.4;
        if (player.y < this.y + 0.25 * this.height) {
          laser.speed = LASER_SPEED;
        } else {
          laser.speed = -LASER_SPEED;
        }
      }
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

  update(player, toggleSwitch) {
    const HIT_MARGIN_HORIZONTAL = 3;
    const HIT_MARGIN_VERTICAL = 5;

    // Check for laser hits
    for (let i = 0; i < this.lasers.length; i++) {
      const laser = this.lasers[i];

      if (laser.x != null) {
        laser.x += laser.speed;

        if (laser.x < this.x) {
          laser.speed = LASER_SPEED;
        } else if (this.right < laser.x) {
          laser.speed = -LASER_SPEED;
        }

        if (
          player.x + HIT_MARGIN_HORIZONTAL < laser.x &&
          laser.x < player.x + player.width - HIT_MARGIN_HORIZONTAL
        ) {
          return GAME_OVER_LASER;
        }
      } else {
        laser.y += laser.speed;

        if (laser.y < this.y) {
          laser.speed = LASER_SPEED;
        } else if (this.bottom < laser.y) {
          laser.speed = -LASER_SPEED;
        }

        if (
          player.y + HIT_MARGIN_VERTICAL < laser.y &&
          laser.y < player.y + player.height - HIT_MARGIN_VERTICAL
        ) {
          return GAME_OVER_LASER;
        }
      }
    }

    // Check for switch toggle
    if (this.switch) {
      if (
        collides(player, this.switch) &&
        keyPressed("space") &&
        300 < performance.now() - this.switch.lastToggleTime
      ) {
        this.switch.on = !this.switch.on;
        this.switch.lastToggleTime = performance.now();
        toggleSwitch(this.switch.on);
      }
    }

    return GAME_OK;
  }

  render(context) {
    context.save();

    if (!this.isMissing) {
      this.renderId(context);
      this.renderRoom(context);
    }

    this.renderWires(context);

    this.renderDoors(context);

    for (let i = 0; i < this.ladders.length; i++) {
      this.ladders[i].render(context);
    }

    this.renderConnectionBox(context);

    this.renderLasers(context);

    context.restore();
  }

  renderConnectionBox(context) {
    const wires = this.wires;
    if (this.switch) {
      const sw = this.switch;

      context.fillStyle = "gray";
      context.fillRect(sw.x, sw.y, SWITCH_WIDTH, SWITCH_DRAW_HEIGHT);
      context.fillStyle = "black";
      context.fillRect(
        sw.x + 5,
        sw.y + 5,
        SWITCH_WIDTH - 10,
        SWITCH_DRAW_HEIGHT - 10
      );
      context.fillStyle = "brown";
      const y = sw.on ? sw.y + 3 : sw.y + SWITCH_DRAW_HEIGHT - 8;
      context.fillRect(sw.x, y, SWITCH_WIDTH, 5);
    } else if (wires.left || wires.right || wires.top || wires.bottom) {
      // Box
      context.fillStyle = "rgb(60,60,60)";
      context.fillRect(
        this.x + SWITCH_RELATIVE_X,
        this.y + SWITCH_RELATIVE_Y,
        25,
        25
      );

      for (let i = 0; i < this.actions.length; i++) {
        const action = this.actions[i];
        this.renderActionSymbol(context, action);
      }
    }
  }

  renderActionSymbol(context, action) {
    switch (action) {
      case ACTION_MOVE:
        context.fillStyle = this.xMoveDirection
          ? "rgb(0,220,0)"
          : "rgb(0,50,0)";
        context.beginPath();
        context.moveTo(
          this.x + SWITCH_RELATIVE_X + 11,
          this.y + SWITCH_RELATIVE_Y + 5
        );
        context.lineTo(
          this.x + SWITCH_RELATIVE_X + 11,
          this.y + SWITCH_RELATIVE_Y + 20
        );
        context.lineTo(
          this.x + SWITCH_RELATIVE_X + 3,
          this.y + SWITCH_RELATIVE_Y + 12.5
        );
        context.fill();

        context.beginPath();
        context.moveTo(
          this.x + SWITCH_RELATIVE_X + 14,
          this.y + SWITCH_RELATIVE_Y + 5
        );
        context.lineTo(
          this.x + SWITCH_RELATIVE_X + 14,
          this.y + SWITCH_RELATIVE_Y + 20
        );
        context.lineTo(
          this.x + SWITCH_RELATIVE_X + 22,
          this.y + SWITCH_RELATIVE_Y + 12.5
        );
        context.fill();
        break;
      case ACTION_LASER:
      case ACTION_LASER_HORIZONTAL:
        context.strokeStyle = this.lasers.length
          ? "rgb(0,220,0)"
          : "rgb(0,50,0)";
        context.beginPath();
        context.moveTo(
          this.x + SWITCH_RELATIVE_X + 13,
          this.y + SWITCH_RELATIVE_Y + 5
        );
        context.lineTo(
          this.x + SWITCH_RELATIVE_X + 13,
          this.y + SWITCH_RELATIVE_Y + 20
        );
        context.stroke();
        break;
    }
  }

  renderWires(context) {
    const wires = this.wires;
    context.strokeStyle = "rgb(0,0,150)";
    context.lineWidth = 3;

    if (wires.left) {
      context.beginPath();
      context.moveTo(this.x + Z / 2, this.y + SWITCH_RELATIVE_Y + 10);
      context.lineTo(
        this.x + SWITCH_RELATIVE_X,
        this.y + SWITCH_RELATIVE_Y + 10
      );
      context.stroke();
    }

    if (wires.right) {
      context.beginPath();
      context.moveTo(
        this.x + SWITCH_RELATIVE_X,
        this.y + SWITCH_RELATIVE_Y + 10
      );
      context.lineTo(this.right - Z / 2, this.y + SWITCH_RELATIVE_Y + 10);
      context.stroke();
    }

    if (wires.top) {
      context.beginPath();
      context.moveTo(this.x + SWITCH_RELATIVE_X + 10, this.y + Z / 2);
      context.lineTo(
        this.x + SWITCH_RELATIVE_X + 10,
        this.y + SWITCH_RELATIVE_Y
      );
      context.stroke();
    }

    if (wires.bottom) {
      context.beginPath();
      context.moveTo(
        this.x + SWITCH_RELATIVE_X + 10,
        this.y + SWITCH_RELATIVE_Y
      );
      context.lineTo(this.x + SWITCH_RELATIVE_X + 10, this.bottom - Z / 2);
      context.stroke();
    }
  }

  renderRoom(context) {
    // this.ix + ", " + this.iy;

    let bgcolor1 = "#10000080";
    let bgcolor2 = "#40101080";
    // Change color for every second room to make room change more obvious
    if (
      (this.ix % 2 === 0 && this.iy % 2 !== 0) ||
      (this.ix % 2 !== 0 && this.iy % 2 === 0)
    ) {
      bgcolor1 = "#00001080";
      bgcolor2 = "#00104080";
    }

    const color1 = "#101010";
    const color2 = "#202020";
    const color3 = "#303030";
    const color4 = "#606060";

    //  ceiling/bottom/sides

    context.lineWidth = 8;

    // top
    context.strokeStyle = color1;
    context.beginPath();
    context.moveTo(this.outerX, this.outerY);
    context.lineTo(this.outerX + Z, this.outerY + Z);
    context.stroke();

    context.strokeStyle = color2;
    context.beginPath();
    context.moveTo(this.outerX + Z, this.outerY + Z);
    context.lineTo(this.outerX + ROOM_OUTER_WIDTH - Z, this.outerY + Z);
    context.stroke();

    context.strokeStyle = color3;
    context.beginPath();
    context.moveTo(this.outerX + ROOM_OUTER_WIDTH - Z, this.outerY + Z);
    context.lineTo(this.outerX + ROOM_OUTER_WIDTH, this.outerY);
    context.stroke();

    // bottom
    context.strokeStyle = color1;
    context.fillStyle = color1;
    context.beginPath();
    context.moveTo(this.outerX, this.outerY + ROOM_OUTER_HEIGHT);
    context.lineTo(this.outerX + Z, this.outerY + ROOM_OUTER_HEIGHT - Z);
    context.stroke();

    context.strokeStyle = color2;
    context.beginPath();
    context.moveTo(this.outerX + Z, this.outerY + ROOM_OUTER_HEIGHT - Z);
    context.lineTo(
      this.outerX + ROOM_OUTER_WIDTH - Z,
      this.outerY + ROOM_OUTER_HEIGHT - Z
    );
    context.stroke();

    context.strokeStyle = color3;
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
    context.strokeStyle = color2;
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
    context.fill();
    context.stroke();

    // ceiling/sides
    context.strokeStyle = color1;
    //top
    context.beginPath();
    context.moveTo(this.outerX + ROOM_OUTER_WIDTH / 2, this.outerY);
    context.lineTo(this.outerX + ROOM_OUTER_WIDTH / 2, this.outerY + Z);
    context.stroke();
    //bottom
    context.strokeStyle = color3;
    context.beginPath();
    context.moveTo(
      this.outerX + ROOM_OUTER_WIDTH / 2,
      this.outerY + ROOM_OUTER_HEIGHT - Z
    );
    context.lineTo(
      this.outerX + ROOM_OUTER_WIDTH / 2,
      this.outerY + ROOM_OUTER_HEIGHT
    );
    context.fill();
    context.stroke();
    // left
    context.strokeStyle = color1;
    context.beginPath();
    context.moveTo(this.outerX, this.outerY + ROOM_OUTER_HEIGHT / 2);
    context.lineTo(this.outerX + Z, this.outerY + ROOM_OUTER_HEIGHT / 2);
    context.stroke();
    // right
    context.strokeStyle = color3;
    context.beginPath();
    context.moveTo(
      this.outerX + ROOM_OUTER_WIDTH - Z,
      this.outerY + ROOM_OUTER_HEIGHT / 2
    );
    context.lineTo(
      this.outerX + ROOM_OUTER_WIDTH,
      this.outerY + ROOM_OUTER_HEIGHT / 2
    );
    context.fill();
    context.stroke();

    // borders
    context.strokeStyle = color4;
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

    // background
    const gradient = context.createLinearGradient(
      this.outerX,
      this.outerY,
      this.outerX + ROOM_OUTER_WIDTH,
      this.outerY + ROOM_HEIGHT
    );
    gradient.addColorStop(0, bgcolor1);
    gradient.addColorStop(1, bgcolor2);
    context.fillStyle = gradient;
    context.fillRect(
      this.outerX,
      this.outerY,
      ROOM_OUTER_WIDTH,
      this.outerY + ROOM_HEIGHT
    );
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

  renderLasers(context) {
    for (let i = 0; i < this.lasers.length; i++) {
      const laser = this.lasers[i];
      context.strokeStyle = "red";
      context.lineWidth = Math.random() < 0.1 ? 2 : 1;
      context.beginPath();
      if (laser.x != null) {
        context.moveTo(laser.x, this.y);
        context.lineTo(laser.x, this.bottom);
      } else {
        context.moveTo(this.x, laser.y);
        context.lineTo(this.right, laser.y);
      }
      context.stroke();
    }
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
