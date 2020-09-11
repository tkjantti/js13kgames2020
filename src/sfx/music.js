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
import { song, jumpSfx, endSfx, endSong, emptySfx } from "./data.js";
import CPlayer from "./musicplayer.js";

const mainTune = document.createElement("audio");
const jumpfx = document.createElement("audio");
const endfx = document.createElement("audio");
const endTune = document.createElement("audio");
const emptyFx = document.createElement("audio");

export const initMusicPlayer = (audioTrack, tune, isLooped) => {
  return new Promise(resolve => {
    var songplayer = new CPlayer();
    // Initialize music generation (player).
    songplayer.init(tune);
    // Generate music...
    var done = false;
    setInterval(function() {
      if (done) {
        return;
      }
      done = songplayer.generate() >= 1;
      if (done) {
        // Put the generated song in an Audio element.
        var wave = songplayer.createWave();
        audioTrack.src = URL.createObjectURL(
          new Blob([wave], { type: "audio/wav" })
        );
        audioTrack.loop = isLooped;
        resolve();
      }
    }, 0);
  });
};

export const initialize = () => {
  return Promise.all([
    initMusicPlayer(mainTune, song, true),
    initMusicPlayer(jumpfx, jumpSfx, false),
    initMusicPlayer(endfx, endSfx, false),
    initMusicPlayer(endTune, endSong, true),
    initMusicPlayer(emptyFx, emptySfx, true)
  ]);
};

const FadeOut = tune => {
  var currentVolume = tune.volume;
  var fadeOutInterval = setInterval(function() {
    currentVolume = (parseFloat(currentVolume) - 0.1).toFixed(1);
    if (currentVolume >= 0) {
      tune.volume = currentVolume;
    } else {
      tune.volume = 0;
      tune.pause();
      clearInterval(fadeOutInterval);
    }
  }, 100);
};

export const playTune = tune => {
  switch (tune) {
    case "main": {
      emptyFx.play();
      emptyFx.volume = 0.1;

      if (endTune.volume > 0) {
        FadeOut(endTune);
      }
      mainTune.volume = 0.9;
      var promise = mainTune.play();
      if (promise !== undefined) {
        promise
          .then(() => {
            // Autoplay started!
          })
          .catch(error => {
            console.log("No for autoplay!" + error);
            // Autoplay was prevented.
          });
      }
      break;
    }
    case "end": {
      endfx.play();
      endfx.volume = 0.5;

      emptyFx.volume = 0.5;

      endTune.currentTime = 0;
      endTune.volume = 0.8;
      endTune.play();

      FadeOut(mainTune);

      break;
    }
    case "jump": {
      jumpfx.currentTime = 0;
      jumpfx.play();

      break;
    }
    case "empty": {
      FadeOut(mainTune);
      break;
    }
  }
};

export const stopTune = tune => {
  switch (tune) {
    case "main": {
      FadeOut(mainTune);
      break;
    }
    case "end": {
      FadeOut(endTune);
      FadeOut(emptyFx);
      break;
    }
    case "empty": {
      FadeOut(emptyFx);
      break;
    }
  }
};
