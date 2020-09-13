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
import {
  song,
  jumpSfx,
  endSfx,
  endSong,
  emptySfx,
  laserSfx,
  switchSfx
} from "./data.js";
import CPlayer from "./musicplayer.js";

export const SFX_START = "start";
export const SFX_MAIN = "main";
export const SFX_END = "end";
export const SFX_EMPTY = "empty";
export const SFX_LASER = "laser";
export const SFX_JUMP = "jump";
export const SFX_SWITCH = "switch";
export const SFX_FINISHED = "finished";

const mainTune = document.createElement("audio");
const jumpfx = document.createElement("audio");
const endfx = document.createElement("audio");
const endTune = document.createElement("audio");
const emptyFx = document.createElement("audio");
const laserFx = document.createElement("audio");
const switchFx = document.createElement("audio");

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
    initMusicPlayer(emptyFx, emptySfx, true),
    initMusicPlayer(laserFx, laserSfx, true),
    initMusicPlayer(switchFx, switchSfx, false)
  ]);
};

const FadeOut = (tune, vol = 0) => {
  var currentVolume = tune.volume;
  if (tune.volume > vol) {
    var fadeOutInterval = setInterval(function() {
      currentVolume = (parseFloat(currentVolume) - 0.1).toFixed(1);
      if (currentVolume > vol) {
        tune.volume = currentVolume;
      } else {
        tune.volume = vol;
        if (vol === 0) tune.pause();
        clearInterval(fadeOutInterval);
      }
    }, 100);
  }
};

const FadeIn = (tune, vol = 1) => {
  tune.play();
  var currentVolume = tune.volume;
  if (tune.volume < vol) {
    var fadeOutInterval = setInterval(function() {
      currentVolume = (parseFloat(currentVolume) + 0.1).toFixed(1);
      if (currentVolume < vol) {
        tune.volume = currentVolume;
      } else {
        tune.volume = vol;
        clearInterval(fadeOutInterval);
      }
    }, 100);
  }
};

export const playTune = tune => {
  switch (tune) {
    case SFX_MAIN: {
      if (endTune.volume > 0) {
        FadeOut(endTune);
      }
      if (emptyFx.volume > 0) {
        FadeOut(emptyFx);
      }
      FadeIn(mainTune, 0.9);
      break;
    }
    case SFX_END: {
      FadeIn(endfx, 0.5);
      FadeIn(emptyFx, 0.2);
      endTune.currentTime = 0;
      FadeIn(endTune, 0.8);
      FadeOut(mainTune);
      break;
    }
    case SFX_JUMP: {
      jumpfx.currentTime = 0;
      jumpfx.play();
      break;
    }
    case SFX_EMPTY: {
      FadeIn(emptyFx, 0.2);
      FadeOut(mainTune, 0.05);
      break;
    }
    case SFX_LASER: {
      FadeIn(laserFx, 0.2);
      break;
    }
    case SFX_SWITCH: {
      switchFx.currentTime = 0;
      switchFx.volume = 0.4;
      switchFx.play();
      break;
    }
    case SFX_FINISHED: {
      FadeIn(emptyFx, 0.2);
      FadeOut(mainTune, 0.05);
      break;
    }
    case SFX_START: {
      emptyFx.volume = 0;
      FadeIn(emptyFx, 0.2);
      var promise = emptyFx.play();
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
      FadeOut(laserFx);
      FadeOut(mainTune);
      FadeOut(endTune);
      mainTune.currentTime = 0;
      break;
    }
  }
};

export const stopTune = tune => {
  switch (tune) {
    case SFX_MAIN: {
      FadeOut(mainTune);
      break;
    }
    case SFX_END: {
      FadeOut(endTune);
      FadeOut(emptyFx);
      break;
    }
    case SFX_EMPTY: {
      FadeOut(emptyFx);
      break;
    }
    case SFX_LASER: {
      FadeOut(laserFx);
      break;
    }
  }
};
