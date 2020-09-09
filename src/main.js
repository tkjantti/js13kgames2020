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
import { GAME_OVER_LASER, GAME_OVER_CRUSH, GAME_OVER_FALL } from "./room";
import { initialize, playTune } from "./sfx/music.js";

let assetsLoaded = false;
let gameEnded = false;

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
bindKeys("1", () => {
  level.camera.zoomTo(level);
});
bindKeys("2", () => {
  level.camera.zoomTo(level.currentRoom.getOuterBoundingBox());
});
bindKeys("j", () => {
  level.moveRoom(level.currentRoom, -1, 0);
});
bindKeys("l", () => {
  level.moveRoom(level.currentRoom, 1, 0);
});
bindKeys("i", () => {
  level.moveRoom(level.currentRoom, 0, -1);
});
bindKeys("k", () => {
  level.moveRoom(level.currentRoom, 0, 1);
});

// FOR DEVELOPMENT: uncomment to show whole level at startup
// level.camera.zoomTo(level);

const renderTexts = (context, ...texts) => {
  context.fillStyle = "white";
  context.font = "32px Sans-serif";

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
        playTune("end");
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
  } else {
    gameLoop = createGameLoop();
    playTune("main");
  }

  gameLoop.start();
};

const createStartScreenLoop = () => {
  return GameLoop({
    update() {},

    render() {
      context.clearRect(0, 0, canvas.width, canvas.height);
      let gradient = context.createLinearGradient(
        0,
        canvas.height / 2,
        0,
        canvas.height
      );
      gradient.addColorStop(0, "rgb(0,0,25");
      gradient.addColorStop(1, "rgb(100,100,255)");

      context.fillStyle = gradient;
      context.fillRect(0, 0, canvas.width, canvas.height);

      if (!assetsLoaded) {
        renderStartScreen("Loading...");
      } else {
        renderStartScreen("Press enter to start");
      }
    }
  });
};

let gameLoop = createStartScreenLoop();

const renderStartScreen = lastText => {
  renderTexts(
    context,
    "404?",
    "",
    "Controls:",
    "Arrors or WASD",
    "",
    "(c) 2020 by Tero J & Sami H",
    "",
    lastText
  );
};

bindKeys(["enter"], () => {
  if (
    (!level ||
      level.gameOverState === GAME_OVER_LASER ||
      level.gameOverState === GAME_OVER_CRUSH ||
      level.gameOverState === GAME_OVER_FALL) &&
    assetsLoaded
  ) {
    level = new Level();
    level.gameOverState = 0;
    level.player;
    playTune("main");
    startLevel(0);
  } else {
    startLevel(1);
  }
  gameEnded = false;
});

initialize().then(() => {
  assetsLoaded = true;
});

startLevel(0);
