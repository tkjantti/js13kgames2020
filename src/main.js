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

import { init, initKeys, bindKeys, GameLoop } from "./kontra";
import { Level } from "./level";
import {
  GAME_OK,
  GAME_OVER_LASER,
  GAME_OVER_CRUSH,
  GAME_OVER_FALL,
  GAME_OVER_FINISHED
} from "./room";
import {
  initialize,
  playTune,
  SFX_START,
  SFX_MAIN,
  SFX_END
} from "./sfx/music.js";

let assetsLoaded = false;
let gameEnded = false;
let gameStartScreen = true;

const { canvas, context } = init();
initKeys();

const resize = () => {
  canvas.width = window.innerWidth - 10;
  canvas.height = window.innerHeight - 10;
};

window.addEventListener("resize", resize, false);
resize();

let level;

// Debug keys

// bindKeys("1", () => {
//   level.camera.zoomTo(level);
// });
// bindKeys("2", () => {
//   level.camera.zoomTo(level.currentRoom.getOuterBoundingBox());
// });
// bindKeys("j", () => {
//   level.moveRoom(level.currentRoom, -1, 0);
// });
// bindKeys("l", () => {
//   level.moveRoom(level.currentRoom, 1, 0);
// });
// bindKeys("i", () => {
//   level.moveRoom(level.currentRoom, 0, -1);
// });
// bindKeys("k", () => {
//   level.moveRoom(level.currentRoom, 0, 1);
// });

// FOR DEVELOPMENT: uncomment to show whole level at startup
// level.camera.zoomTo(level);

const renderTexts = (context, ...texts) => {
  context.fillStyle = "white";
  context.font = "32px cursive";

  for (let i = 0; i < texts.length; i++) {
    const text = texts[i];
    let textWidth = text.length * 14;
    const x = canvas.width / 2 - textWidth / 2;
    let y = canvas.height * 0.35 + i * 50;
    context.fillText(text, x, y);
  }
};

const createGameLoop = () => {
  return GameLoop({
    update: function() {
      level.update();
    },

    render: function() {
      level.render(canvas, context);

      if (!gameEnded && level.gameOverState) {
        gameEnded = true;
        if (level.gameOverState !== GAME_OVER_FINISHED) playTune(SFX_END);
      }

      switch (level.gameOverState) {
        case GAME_OVER_LASER:
          renderTexts(context, "You were fried!", "GAME OVER");
          break;
        case GAME_OVER_CRUSH:
          renderTexts(context, "Something heavy crushed you!", "GAME OVER");
          break;
        case GAME_OVER_FALL:
          renderTexts(context, "You fall into the abyss!", "GAME OVER");
          break;
      }
    }
  });
};

const startLevel = number => {
  gameLoop.stop();

  if (number === 0) {
    gameLoop = createStartScreenLoop();
    playTune(SFX_START);
  } else {
    gameLoop = createGameLoop();
    playTune(SFX_MAIN);
  }

  gameLoop.start();
};

const createStartScreenLoop = () => {
  return GameLoop({
    update() {},

    render() {
      const gradient = context.createLinearGradient(
        canvas.width,
        0,
        0,
        canvas.height
      );
      gradient.addColorStop(0, "#303090");
      gradient.addColorStop(0.5, "#000");
      gradient.addColorStop(1, "#000");
      context.fillStyle = gradient;
      context.fillRect(0, 0, canvas.width, canvas.height);

      context.fillStyle = "#10000080";
      context.lineWidth = 12;
      context.fillRect(0, 0, canvas.height, canvas.height);

      context.strokeStyle = "#ffffff20";
      context.beginPath();
      context.lineTo(0, 0);
      context.lineTo(canvas.height, 0);
      context.lineTo(canvas.height, 0);
      context.lineTo(canvas.height, canvas.height);
      context.lineTo(0, canvas.height);
      context.lineTo(0, 0);
      context.moveTo(canvas.height / 4, 0);
      context.lineTo(canvas.height / 4, canvas.height);
      context.moveTo(0, canvas.height / 4);
      context.lineTo(canvas.height, canvas.height / 4);
      context.moveTo(canvas.height / 2, 0);
      context.lineTo(canvas.height / 2, canvas.height);
      context.moveTo(0, canvas.height / 2);
      context.lineTo(canvas.height, canvas.height / 2);
      context.moveTo(canvas.height / 4 + canvas.height / 2, 0);
      context.lineTo(canvas.height / 4 + canvas.height / 2, canvas.height);
      context.moveTo(0, canvas.height / 4 + canvas.height / 2);
      context.lineTo(canvas.height, canvas.height / 4 + canvas.height / 2);
      context.stroke();

      if (!assetsLoaded) {
        renderStartScreen("Loading...");
      } else {
        renderStartScreen("Press ENTER to start");
      }
    }
  });
};

let gameLoop = createStartScreenLoop();

const renderStartScreen = lastText => {
  renderTexts(
    context,
    "THE WAFFLE",
    "",
    "Controls:",
    "Move and jump/climb by ARROWS or W/A/S/D.",
    "Toggle switch by SPACE",
    "",
    "(c) 2020 by Tero J & Sami H",
    "",
    lastText
  );
};

bindKeys(["enter"], () => {
  if (!assetsLoaded) return;
  if (gameStartScreen) {
    level = new Level();
    startLevel(1);
    gameStartScreen = false;
  } else if (
    level &&
    (level.gameOverState === GAME_OVER_LASER ||
      level.gameOverState === GAME_OVER_CRUSH ||
      level.gameOverState === GAME_OVER_FALL ||
      level.gameOverState === GAME_OVER_FINISHED)
  ) {
    level.gameOverState = GAME_OK;
    startLevel(0);
    gameEnded = false;
    gameStartScreen = true;
  }
});

initialize().then(() => {
  assetsLoaded = true;
});

startLevel(0);
