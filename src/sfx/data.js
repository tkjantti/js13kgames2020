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

/* eslint-disable no-sparse-arrays */

export const endSong = {
  songData: [
    {
      i: [
        2, // OSC1_WAVEFORM
        59, // OSC1_VOL
        116, // OSC1_SEMI
        0, // OSC1_XENV
        2, // OSC2_WAVEFORM
        59, // OSC2_VOL
        128, // OSC2_SEMI
        4, // OSC2_DETUNE
        0, // OSC2_XENV
        0, // NOISE_VOL
        47, // ENV_ATTACK
        48, // ENV_SUSTAIN
        255, // ENV_RELEASE
        156, // ARP_CHORD
        1, // ARP_SPEED
        0, // LFO_WAVEFORM
        139, // LFO_AMT
        4, // LFO_FREQ
        1, // LFO_FX_FREQ
        3, // FX_FILTER
        64, // FX_FREQ
        160, // FX_RESONANCE
        3, // FX_DIST
        32, // FX_DRIVE
        147, // FX_PAN_AMT
        4, // FX_PAN_FREQ
        121, // FX_DELAY_AMT
        5 // FX_DELAY_TIME
      ],
      p: [25, 2],
      c: [
        {
          n: [
            146,
            ,
            ,
            ,
            139,
            ,
            ,
            ,
            137,
            ,
            ,
            ,
            140,
            ,
            ,
            ,
            139,
            ,
            ,
            ,
            142,
            ,
            ,
            ,
            140,
            ,
            ,
            ,
            144
          ],
          f: [
            6,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            27
          ]
        },
        {
          n: [
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            139
          ],
          f: []
        },
        { n: [], f: [] },
        { n: [], f: [] },
        { n: [], f: [] },
        { n: [], f: [] },
        { n: [], f: [] },
        { n: [], f: [] },
        { n: [], f: [] },
        { n: [], f: [] },
        { n: [], f: [] },
        { n: [], f: [] },
        { n: [], f: [] },
        { n: [], f: [] },
        { n: [], f: [] },
        { n: [], f: [] },
        { n: [], f: [] },
        { n: [], f: [] },
        { n: [], f: [] },
        { n: [], f: [] },
        { n: [], f: [] },
        { n: [], f: [] },
        { n: [], f: [] },
        { n: [], f: [] },
        {
          n: [146],
          f: [
            13,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            238
          ]
        }
      ]
    }
  ],
  rowLen: 5513,
  patternLen: 32,
  endPattern: 1,
  numChannels: 1
};

export const endSfx = {
  songData: [
    {
      i: [
        0,
        255,
        106,
        1,
        0,
        255,
        106,
        0,
        1,
        0,
        5,
        7,
        164,
        0,
        0,
        0,
        0,
        0,
        0,
        2,
        255,
        0,
        2,
        32,
        83,
        5,
        25,
        1
      ],
      p: [1],
      c: [{ n: [147], f: [] }]
    }
  ],
  rowLen: 5513,
  patternLen: 20,
  endPattern: 0,
  numChannels: 1
};

export const jumpSfx = {
  songData: [
    {
      i: [
        0,
        192,
        104,
        1,
        0,
        80,
        99,
        0,
        0,
        0,
        4,
        0,
        66,
        0,
        0,
        3,
        0,
        0,
        0,
        1,
        0,
        1,
        2,
        32,
        0,
        12,
        60,
        8
      ],
      p: [1],
      c: [
        {
          n: [137],
          f: [
            27,
            28,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            60,
            8
          ]
        }
      ]
    }
  ],
  rowLen: 5513,
  patternLen: 8,
  endPattern: 0,
  numChannels: 1
};

export const song = {
  songData: [
    {
      i: [
        0,
        91,
        128,
        0,
        0,
        95,
        128,
        12,
        0,
        0,
        12,
        0,
        72,
        0,
        0,
        0,
        0,
        0,
        0,
        2,
        255,
        0,
        0,
        32,
        83,
        3,
        130,
        4
      ],
      p: [, , , , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      c: [
        {
          n: [
            146,
            ,
            ,
            ,
            139,
            ,
            ,
            ,
            137,
            ,
            ,
            ,
            140,
            ,
            ,
            ,
            139,
            ,
            ,
            ,
            142,
            ,
            ,
            ,
            140,
            ,
            ,
            ,
            144
          ],
          f: [
            6,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            27
          ]
        }
      ]
    },
    {
      i: [
        2,
        192,
        128,
        0,
        2,
        192,
        140,
        18,
        0,
        0,
        158,
        119,
        158,
        6,
        2,
        0,
        0,
        0,
        0,
        2,
        5,
        0,
        0,
        32,
        0,
        0,
        24,
        8
      ],
      p: [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, , 1, 2, 1, 2, 1, 2, 1, 2],
      c: [
        { n: [134], f: [] },
        { n: [127], f: [] }
      ]
    },
    {
      i: [
        0,
        255,
        117,
        1,
        0,
        255,
        110,
        0,
        1,
        0,
        4,
        6,
        35,
        0,
        0,
        0,
        0,
        0,
        0,
        2,
        14,
        0,
        1,
        39,
        76,
        5,
        0,
        0
      ],
      p: [, , , , , , , , , , , , 1, 1, 1, 1, 1, 1, 1, 1],
      c: [
        {
          n: [
            125,
            ,
            ,
            ,
            125,
            ,
            ,
            ,
            125,
            ,
            ,
            ,
            125,
            ,
            ,
            ,
            125,
            ,
            ,
            ,
            125,
            ,
            ,
            ,
            125,
            ,
            ,
            ,
            125
          ],
          f: []
        }
      ]
    },
    {
      i: [
        0,
        25,
        128,
        1,
        0,
        29,
        128,
        0,
        1,
        23,
        4,
        7,
        41,
        0,
        0,
        0,
        60,
        4,
        1,
        2,
        255,
        0,
        0,
        32,
        61,
        5,
        32,
        6
      ],
      p: [, , , , , , , , , , , , 1, 1, 1, 1, 1, 1, 1, 1],
      c: [
        {
          n: [
            ,
            ,
            ,
            ,
            125,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            125,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            125,
            ,
            ,
            ,
            ,
            ,
            125,
            ,
            125
          ],
          f: [
            10,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            23
          ]
        }
      ]
    },
    {
      i: [
        3,
        255,
        128,
        0,
        0,
        255,
        140,
        0,
        0,
        127,
        2,
        2,
        23,
        0,
        0,
        0,
        96,
        3,
        1,
        3,
        94,
        79,
        0,
        32,
        84,
        2,
        12,
        4
      ],
      p: [, , , , , , , , , , , , 1, 1, 1, 1, 1, 1, 1, 1],
      c: [
        {
          n: [
            ,
            ,
            123,
            ,
            ,
            ,
            123,
            ,
            ,
            ,
            123,
            ,
            ,
            ,
            123,
            ,
            ,
            ,
            123,
            ,
            ,
            ,
            123,
            ,
            ,
            ,
            123,
            ,
            ,
            ,
            123,
            123
          ],
          f: []
        }
      ]
    }
  ],
  rowLen: 5513,
  patternLen: 32,
  endPattern: 19,
  numChannels: 5
};
