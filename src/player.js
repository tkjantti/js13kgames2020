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

import { Sprite, keyPressed } from "kontra";

const GRAVITY = 1;

const PLAYER_SPEED = 5;
const JUMP_VELOCITY = -15;
const CLIMB_SPEED = 2;

const OFF_LEDGE_JUMP_DELAY_MS = 200;

const STANDING_WIDTH = 20;
const STANDING_HEIGHT = 40;

const STATE_ON_PLATFORM = 0;
const STATE_FALLING = 1;
const STATE_CLIMBING = 2;

export const createPlayer = () => {
  return Sprite({
    x: 100,
    y: 80,
    color: "red",
    width: STANDING_WIDTH,
    height: STANDING_HEIGHT,
    xVel: 0, // Horizontal velocity
    yVel: 0, // Vertical velocity, affected by jumping and gravity
    latestOnPlatformTime: 0,
    state: STATE_ON_PLATFORM,
    stopClimbing: false,

    _isOnGround(room) {
      const margin = 5;
      return this.y + this.height > room.height - margin;
    },

    _findLadderCollision(ladders) {
      let collision, collidesHigh;

      for (let i = 0; i < ladders.length; i++) {
        let ladder = ladders[i];

        if (ladder.collidesWith(this)) {
          collision = true;

          if (ladder.y < this.y && this.y < ladder.y + ladder.height) {
            // Top of the player sprite is on ladder
            collidesHigh = true;
          }
        }
      }

      return { collision, collidesHigh };
    },

    // Custom update method to replace Kontra GameObject update
    // which takes different parameters
    do_update(room, ladders, platforms) {
      const now = performance.now();

      const platform = this._findPlatform(platforms);
      if (platform) {
        this.latestOnPlatformTime = now;
      }

      let movement = { dx: 0, dy: 0 };

      let ladderCollision = this._findLadderCollision(ladders);

      if (!ladderCollision.collision && this.state === STATE_CLIMBING) {
        this.state = STATE_FALLING;
      } else {
        movement = this._handleControls(now, room, ladderCollision, platform);
      }

      let { dx, dy } = movement;

      if (this.xVel !== 0) {
        dx += this.xVel;
        if (Math.abs(this.xVel) > 4) {
          this.xVel *= 0.97; // friction
        } else {
          this.xVel = 0;
        }
      }

      if (this.state === STATE_FALLING) {
        this.yVel += GRAVITY;
        dy += this.yVel;
      }

      this._updateHorizontalPosition(room, dx);
      this._updateVerticalPosition(room, platform, dy);
    },

    _handleControls(now, room, ladderCollision, platform) {
      let dx = 0;
      let dy = 0;

      if ((keyPressed("left") || keyPressed("a")) && this.x > 0) {
        dx = -PLAYER_SPEED;
      } else if (
        (keyPressed("right") || keyPressed("d")) &&
        this.x < room.width - this.width
      ) {
        dx = PLAYER_SPEED;
      }

      const upPressed = keyPressed("up") || keyPressed("w");
      if (!upPressed) {
        // Up key must be released to jump after reaching the top of
        // the stairs.
        this.stopClimbing = false;
      }
      if (
        (upPressed && !this.stopClimbing) ||
        keyPressed("space") ||
        keyPressed("g")
      ) {
        if (
          this.state === STATE_CLIMBING &&
          dx === 0 &&
          platform &&
          !ladderCollision.collidesHigh
        ) {
          // Prevent jumping when reaching the top of the ladder,
          // unless another ladder continues from there.
          this.state = STATE_ON_PLATFORM;
          this.stopClimbing = true;
        } else if (
          (platform ||
            now - this.latestOnPlatformTime < OFF_LEDGE_JUMP_DELAY_MS ||
            this._isOnGround(room)) &&
          !(dx === 0 && ladderCollision.collidesHigh)
        ) {
          this.yVel = JUMP_VELOCITY;
          this.state = STATE_FALLING;
          this.latestOnPlatformTime = 0;
        } else if (this.yVel >= 0 && ladderCollision.collision) {
          // Climb when not jumping
          this.state = STATE_CLIMBING;
          this.yVel = 0;
          dy -= CLIMB_SPEED;
        }
      } else if (
        (keyPressed("down") || keyPressed("s")) &&
        ladderCollision.collision
      ) {
        this.state = STATE_CLIMBING;
        this.yVel = 0;
        dy += CLIMB_SPEED;
      }

      return { dx, dy };
    },

    _updateHorizontalPosition(room, dx) {
      if (this.x + dx > room.width - this.width) {
        this.x = room.width - this.width;
        this.xVel = 0;
      } else if (this.x + dx < room.x) {
        this.x = room.x;
        this.xVel = 0;
      } else if (dx !== 0) {
        this.x += dx;
      }
    },

    _updateVerticalPosition(room, platform, dy) {
      if (this.y + dy > room.height - this.height) {
        // hits ground
        this.y = room.height - this.height;
        this.state = STATE_ON_PLATFORM;
        this.yVel = 0;
      } else if (this.fallingToGround) {
        this.state = STATE_FALLING;
        this.y += dy;
      } else if (this.state === STATE_CLIMBING) {
        this.y += dy;
      } else if (dy > 0 && platform) {
        // Margin so that the player does not constantly toggle
        // between standing and free falling.
        const margin = 5;
        this.y = platform.y - this.height + margin;
        this.yVel = 0;
        this.state = STATE_ON_PLATFORM;
      } else {
        this.state = STATE_FALLING;
        this.y += dy;
      }
    },

    _findPlatform(platforms) {
      for (let i = 0; i < platforms.length; i++) {
        let platform = platforms[i];
        if (this.collidesWith(platform)) {
          if (this.y + this.height < platform.y + platform.height) {
            return platform;
          }
        }
      }

      return null;
    }
  });
};
