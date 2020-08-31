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

import { Sprite, keyPressed, collides } from "kontra";
import { imageFromSvg, VectorAnimation } from "./svg.js";

import playerSvg from "./images/player.svg";
import playerLeftfootSvg from "./images/player-leftfoot.svg";
import climb1Svg from "./images/player-vertical.svg";
import climb2Svg from "./images/player-vertical-leftfoot.svg";

const GRAVITY = 1;

const PLAYER_SPEED = 4;
const JUMP_VELOCITY = -15;
const CLIMB_SPEED = 2;

const OFF_LEDGE_JUMP_DELAY_MS = 200;

const STANDING_WIDTH = 15;
const STANDING_HEIGHT = 45;

// Vertical states
const STATE_ON_PLATFORM = 0;
const STATE_FALLING = 1;
const STATE_CLIMBING = 2;

// Horizontal states
const HSTATE_FACING_LEFT = 0;
const HSTATE_FACING_RIGHT = 1,
  HSTATE_MAX_FACING = 1;
const HSTATE_WALKING_LEFT = 2;
const HSTATE_WALKING_RIGHT = 3;

const playerImage = imageFromSvg(playerSvg);

const standingAnimation = new VectorAnimation([playerImage]);
const walkingAnimation = new VectorAnimation(
  [playerImage, imageFromSvg(playerLeftfootSvg)],
  10
);
const climbingAnimation = new VectorAnimation(
  [imageFromSvg(climb1Svg), imageFromSvg(climb2Svg)],
  10
);

export const createPlayer = () => {
  return Sprite({
    x: 100,
    y: 80,
    width: STANDING_WIDTH,
    height: STANDING_HEIGHT,
    xVel: 0, // Horizontal velocity
    yVel: 0, // Vertical velocity, affected by jumping and gravity
    latestOnPlatformTime: 0,
    state: STATE_ON_PLATFORM,
    hstate: HSTATE_FACING_RIGHT, // Horizontal state
    stopClimbing: false,
    animation: standingAnimation,

    render() {
      // Translate to (x, y) position is done by kontra

      this.context.save();

      const image = this.animation.getImage();

      // scale image to player size
      this.context.scale(
        STANDING_WIDTH / image.width,
        STANDING_HEIGHT / image.height
      );

      if (
        this.hstate === HSTATE_WALKING_LEFT ||
        this.hstate === HSTATE_FACING_LEFT
      ) {
        // mirror image
        this.context.translate(image.width / 2, 0);
        this.context.scale(-1, 1);
        this.context.translate(-image.width / 2, 0);
      }

      this.context.drawImage(image, 0, 0);

      this.context.restore();
    },

    _isOnGround(room) {
      const margin = 5;
      return this.y + this.height > room.bottom - margin;
    },

    _findLadderCollision(ladders) {
      let collision, collidesHigh;

      for (let i = 0; i < ladders.length; i++) {
        let ladder = ladders[i];

        if (collides(ladder, this)) {
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
        this.animation = standingAnimation;
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

      this._updateVerticalPosition(room, platform, dy);
      this._updateHorizontalPosition(room, dx);
    },

    isMovingLeft() {
      return keyPressed("left") || keyPressed("a");
    },

    isMovingRight() {
      return keyPressed("right") || keyPressed("d");
    },

    isMovingDown() {
      return keyPressed("down") || keyPressed("s");
    },

    _handleControls(now, room, ladderCollision, platform) {
      const previousHorizontalState = this.hstate;
      let dx = 0;
      let dy = 0;

      if (this.isMovingLeft()) {
        dx = -PLAYER_SPEED;
        if (previousHorizontalState !== HSTATE_WALKING_LEFT) {
          this.hstate = HSTATE_WALKING_LEFT;
          this.animation = walkingAnimation;
        }
        this.animation.advance();
      } else if (this.isMovingRight()) {
        dx = PLAYER_SPEED;
        if (previousHorizontalState !== HSTATE_WALKING_RIGHT) {
          this.hstate = HSTATE_WALKING_RIGHT;
          this.animation = walkingAnimation;
        }
        this.animation.advance();
      } else if (previousHorizontalState > HSTATE_MAX_FACING) {
        this.hstate =
          previousHorizontalState === HSTATE_WALKING_LEFT
            ? HSTATE_FACING_LEFT
            : HSTATE_FACING_RIGHT;
      }

      const upPressed = keyPressed("up") || keyPressed("w");
      if (!upPressed) {
        // Up key must be released to jump after reaching the top of
        // the stairs.
        this.stopClimbing = false;
      }

      const previousState = this.state;

      if ((upPressed && !this.stopClimbing) || keyPressed("g")) {
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
          if (previousState !== STATE_CLIMBING) {
            this.animation = climbingAnimation;
          }
        }

        if (this.state === STATE_CLIMBING) {
          this.animation.advance();
        }
      } else if (this.isMovingDown() && ladderCollision.collision) {
        this.state = STATE_CLIMBING;
        this.yVel = 0;
        dy += CLIMB_SPEED;

        if (previousState !== STATE_CLIMBING) {
          this.animation = climbingAnimation;
        }
        this.animation.advance();
      }

      return { dx, dy };
    },

    _updateHorizontalPosition(room, dx) {
      if (this.x + this.width + dx > room.right && !room.isAtRightDoor(this)) {
        this.x = room.right - this.width;
        this.xVel = 0;
      } else if (this.x + dx < room.x && !room.isAtLeftDoor(this)) {
        this.x = room.x;
        this.xVel = 0;
      } else if (dx !== 0) {
        this.x += dx;
      }
    },

    _updateVerticalPosition(room, platform, dy) {
      if (this.y + this.height + dy > room.bottom) {
        // hits ground
        this.y = room.bottom - this.height;
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
        if (collides(this, platform)) {
          if (this.y + this.height < platform.y + platform.height) {
            return platform;
          }
        }
      }

      return null;
    }
  });
};
