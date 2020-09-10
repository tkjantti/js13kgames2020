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
      // Instrument 0
      i: [
        0, // OSC1_WAVEFORM
        91, // OSC1_VOL
        128, // OSC1_SEMI
        0, // OSC1_XENV
        0, // OSC2_WAVEFORM
        95, // OSC2_VOL
        128, // OSC2_SEMI
        12, // OSC2_DETUNE
        0, // OSC2_XENV
        0, // NOISE_VOL
        12, // ENV_ATTACK
        0, // ENV_SUSTAIN
        72, // ENV_RELEASE
        0, // ARP_CHORD
        0, // ARP_SPEED
        0, // LFO_WAVEFORM
        0, // LFO_AMT
        0, // LFO_FREQ
        0, // LFO_FX_FREQ
        2, // FX_FILTER
        255, // FX_FREQ
        0, // FX_RESONANCE
        0, // FX_DIST
        32, // FX_DRIVE
        83, // FX_PAN_AMT
        3, // FX_PAN_FREQ
        130, // FX_DELAY_AMT
        4 // FX_DELAY_TIME
      ],
      // Patterns
      p: [
        ,
        ,
        ,
        ,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        ,
        ,
        ,
        ,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1
      ],
      // Columns
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
      // Instrument 1
      i: [
        2, // OSC1_WAVEFORM
        192, // OSC1_VOL
        128, // OSC1_SEMI
        0, // OSC1_XENV
        2, // OSC2_WAVEFORM
        192, // OSC2_VOL
        140, // OSC2_SEMI
        18, // OSC2_DETUNE
        0, // OSC2_XENV
        0, // NOISE_VOL
        158, // ENV_ATTACK
        119, // ENV_SUSTAIN
        158, // ENV_RELEASE
        6, // ARP_CHORD
        2, // ARP_SPEED
        0, // LFO_WAVEFORM
        0, // LFO_AMT
        0, // LFO_FREQ
        0, // LFO_FX_FREQ
        2, // FX_FILTER
        5, // FX_FREQ
        0, // FX_RESONANCE
        0, // FX_DIST
        32, // FX_DRIVE
        0, // FX_PAN_AMT
        0, // FX_PAN_FREQ
        24, // FX_DELAY_AMT
        8 // FX_DELAY_TIME
      ],
      // Patterns
      p: [
        1,
        2,
        1,
        2,
        1,
        2,
        1,
        2,
        1,
        2,
        1,
        ,
        1,
        2,
        1,
        2,
        1,
        2,
        1,
        2,
        1,
        2,
        1,
        2,
        1,
        2,
        1,
        2,
        1,
        2,
        1,
        2
      ],
      // Columns
      c: [
        { n: [134], f: [] },
        { n: [127], f: [] }
      ]
    },
    {
      // Instrument 2
      i: [
        0, // OSC1_WAVEFORM
        255, // OSC1_VOL
        117, // OSC1_SEMI
        1, // OSC1_XENV
        0, // OSC2_WAVEFORM
        255, // OSC2_VOL
        110, // OSC2_SEMI
        0, // OSC2_DETUNE
        1, // OSC2_XENV
        0, // NOISE_VOL
        4, // ENV_ATTACK
        6, // ENV_SUSTAIN
        35, // ENV_RELEASE
        0, // ARP_CHORD
        0, // ARP_SPEED
        0, // LFO_WAVEFORM
        0, // LFO_AMT
        0, // LFO_FREQ
        0, // LFO_FX_FREQ
        2, // FX_FILTER
        14, // FX_FREQ
        0, // FX_RESONANCE
        1, // FX_DIST
        39, // FX_DRIVE
        76, // FX_PAN_AMT
        5, // FX_PAN_FREQ
        0, // FX_DELAY_AMT
        0 // FX_DELAY_TIME
      ],
      // Patterns
      p: [
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
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1
      ],
      // Columns
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
      // Instrument 3
      i: [
        0, // OSC1_WAVEFORM
        25, // OSC1_VOL
        128, // OSC1_SEMI
        1, // OSC1_XENV
        0, // OSC2_WAVEFORM
        29, // OSC2_VOL
        128, // OSC2_SEMI
        0, // OSC2_DETUNE
        1, // OSC2_XENV
        23, // NOISE_VOL
        4, // ENV_ATTACK
        7, // ENV_SUSTAIN
        41, // ENV_RELEASE
        0, // ARP_CHORD
        0, // ARP_SPEED
        0, // LFO_WAVEFORM
        60, // LFO_AMT
        4, // LFO_FREQ
        1, // LFO_FX_FREQ
        2, // FX_FILTER
        255, // FX_FREQ
        0, // FX_RESONANCE
        0, // FX_DIST
        32, // FX_DRIVE
        61, // FX_PAN_AMT
        5, // FX_PAN_FREQ
        32, // FX_DELAY_AMT
        6 // FX_DELAY_TIME
      ],
      // Patterns
      p: [
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
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1
      ],
      // Columns
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
      // Instrument 4
      i: [
        3, // OSC1_WAVEFORM
        255, // OSC1_VOL
        128, // OSC1_SEMI
        0, // OSC1_XENV
        0, // OSC2_WAVEFORM
        255, // OSC2_VOL
        140, // OSC2_SEMI
        0, // OSC2_DETUNE
        0, // OSC2_XENV
        127, // NOISE_VOL
        2, // ENV_ATTACK
        2, // ENV_SUSTAIN
        23, // ENV_RELEASE
        0, // ARP_CHORD
        0, // ARP_SPEED
        0, // LFO_WAVEFORM
        96, // LFO_AMT
        3, // LFO_FREQ
        1, // LFO_FX_FREQ
        3, // FX_FILTER
        94, // FX_FREQ
        79, // FX_RESONANCE
        0, // FX_DIST
        32, // FX_DRIVE
        84, // FX_PAN_AMT
        2, // FX_PAN_FREQ
        12, // FX_DELAY_AMT
        4 // FX_DELAY_TIME
      ],
      // Patterns
      p: [, , , , , , , , , , , , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, , 1, 1, 1],
      // Columns
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
    },
    {
      // Instrument 5
      i: [
        0, // OSC1_WAVEFORM
        61, // OSC1_VOL
        104, // OSC1_SEMI
        1, // OSC1_XENV
        0, // OSC2_WAVEFORM
        61, // OSC2_VOL
        104, // OSC2_SEMI
        0, // OSC2_DETUNE
        1, // OSC2_XENV
        8, // NOISE_VOL
        4, // ENV_ATTACK
        40, // ENV_SUSTAIN
        21, // ENV_RELEASE
        0, // ARP_CHORD
        0, // ARP_SPEED
        0, // LFO_WAVEFORM
        231, // LFO_AMT
        6, // LFO_FREQ
        1, // LFO_FX_FREQ
        3, // FX_FILTER
        183, // FX_FREQ
        15, // FX_RESONANCE
        0, // FX_DIST
        32, // FX_DRIVE
        232, // FX_PAN_AMT
        4, // FX_PAN_FREQ
        74, // FX_DELAY_AMT
        6 // FX_DELAY_TIME
      ],
      // Patterns
      p: [, , , , , , , , , , , 1],
      // Columns
      c: [
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
            140,
            139,
            137,
            135
          ],
          f: [
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
            10,
            10,
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
            8,
            25,
            60
          ]
        }
      ]
    }
  ],
  rowLen: 5513, // In sample lengths
  patternLen: 32, // Rows per pattern
  endPattern: 31, // End pattern
  numChannels: 6 // Number of channels
};
