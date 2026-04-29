import chordLibrary from "./chord-library";

type Progression = {
  length: number;
  bars: Record<number, number[]>;
};

const folsomBlues: Progression = {
  length: 12,
  bars: {
    1: chordLibrary.emajor,
    5: chordLibrary.amajor,
    7: chordLibrary.emajor,
    9: chordLibrary.b7,
    11: chordLibrary.emajor,
  },
};

const wonderwall: Progression = {
  length: 4,
  bars: {
    1: chordLibrary.eminor,
    2: chordLibrary.gmajor,
    3: chordLibrary.dmajor,
    4: chordLibrary.asus4,
  },
};

const creep: Progression = {
  length: 8,
  bars: {
    1: chordLibrary.gmajor,
    3: chordLibrary.bmajor,
    5: chordLibrary.cmajor.map((n) => n + 12),
    7: chordLibrary.cminor.map((n) => n + 12),
  },
};

const whatsup: Progression = {
  length: 8,
  bars: {
    1: chordLibrary.cmajor,
    3: chordLibrary.dminor,
    5: chordLibrary.fmajor,
    7: chordLibrary.cmajor,
  },
};

const seal: Progression = {
  length: 4,
  bars: {
    1: chordLibrary.ebmajor,
    2: chordLibrary.fmajor,
    3: chordLibrary.gmajor,
  },
};

// ii-V-I in C: the most fundamental jazz cadence.
const jazzCadence: Progression = {
  length: 4,
  bars: {
    1: chordLibrary.dminor,
    2: chordLibrary.g7,
    3: chordLibrary.cmaj7,
  },
};

// Tritone-substituted ii-V-I: Db7 stands in for G7, sharing the B/F tritone.
const tritoneSub: Progression = {
  length: 4,
  bars: {
    1: chordLibrary.dminor,
    2: chordLibrary.db7,
    3: chordLibrary.cmaj7,
  },
};

// Standard 12-bar minor blues in A.
const minorBlues: Progression = {
  length: 12,
  bars: {
    1: chordLibrary.aminor,
    2: chordLibrary.dminor,
    3: chordLibrary.aminor,
    5: chordLibrary.dminor,
    7: chordLibrary.aminor,
    9: chordLibrary.e7,
    10: chordLibrary.dminor,
    11: chordLibrary.aminor,
    12: chordLibrary.e7,
  },
};

// Walking the cycle of fifths: i → iv → bVII → bIII → bVI → bII → V → i.
const cycleOfFifths: Progression = {
  length: 8,
  bars: {
    1: chordLibrary.aminor,
    2: chordLibrary.dminor,
    3: chordLibrary.gmajor,
    4: chordLibrary.cmajor,
    5: chordLibrary.fmajor,
    6: chordLibrary.bbmajor,
    7: chordLibrary.emajor,
    8: chordLibrary.aminor,
  },
};

// Pachelbel's Canon in D: I-V-vi-iii-IV-I-IV-V.
const pachelbel: Progression = {
  length: 8,
  bars: {
    1: chordLibrary.dmajor,
    2: chordLibrary.amajor,
    3: chordLibrary.bminor,
    4: chordLibrary.gbminor,
    5: chordLibrary.gmajor,
    6: chordLibrary.dmajor,
    7: chordLibrary.gmajor,
    8: chordLibrary.amajor,
  },
};

// House of the Rising Sun: i-III-IV-VI-i-III-V-V.
const risingSun: Progression = {
  length: 8,
  bars: {
    1: chordLibrary.aminor,
    2: chordLibrary.cmajor,
    3: chordLibrary.dmajor,
    4: chordLibrary.fmajor,
    5: chordLibrary.aminor,
    6: chordLibrary.cmajor,
    7: chordLibrary.emajor,
  },
};

// Hotel California verse: i-V-bVII-IV-VI-III-iv-V in Bm.
const hotelCalifornia: Progression = {
  length: 8,
  bars: {
    1: chordLibrary.bminor,
    2: chordLibrary.gbmajor,
    3: chordLibrary.amajor,
    4: chordLibrary.emajor,
    5: chordLibrary.gmajor,
    6: chordLibrary.dmajor,
    7: chordLibrary.eminor,
    8: chordLibrary.gbmajor,
  },
};

// All Along the Watchtower: i-bVII-bVI-bVII Aeolian vamp.
const watchtower: Progression = {
  length: 4,
  bars: {
    1: chordLibrary.aminor,
    2: chordLibrary.gmajor,
    3: chordLibrary.fmajor,
    4: chordLibrary.gmajor,
  },
};

// Andalusian cadence: i-bVII-bVI-V, the flamenco staircase.
const andalusian: Progression = {
  length: 4,
  bars: {
    1: chordLibrary.aminor,
    2: chordLibrary.gmajor,
    3: chordLibrary.fmajor,
    4: chordLibrary.emajor,
  },
};

// Phrygian vamp: i-bII-bIII-bII, dark/Spanish color.
const phrygianVamp: Progression = {
  length: 4,
  bars: {
    1: chordLibrary.eminor,
    2: chordLibrary.fmajor,
    3: chordLibrary.gmajor,
    4: chordLibrary.fmajor,
  },
};

// Mixolydian rock: I-bVII-IV-I (Sympathy for the Devil flavor).
const mixolydianRock: Progression = {
  length: 4,
  bars: {
    1: chordLibrary.gmajor,
    2: chordLibrary.fmajor,
    3: chordLibrary.cmajor,
    4: chordLibrary.gmajor,
  },
};

// "So What" modal jazz: 8 bars Dorian on D, lifted to Eb Dorian, then back.
const soWhat: Progression = {
  length: 8,
  bars: {
    1: chordLibrary.dminor,
    5: chordLibrary.ebminor,
    7: chordLibrary.dminor,
  },
};

// Royal Road (J-pop / anime staple): IV-V-iii-vi.
const royalRoad: Progression = {
  length: 4,
  bars: {
    1: chordLibrary.fmajor,
    2: chordLibrary.gmajor,
    3: chordLibrary.eminor,
    4: chordLibrary.aminor,
  },
};

const progressions: Record<number, Progression> = {
  1: folsomBlues,
  2: wonderwall,
  3: creep,
  4: whatsup,
  5: seal,
  6: jazzCadence,
  7: tritoneSub,
  8: minorBlues,
  9: cycleOfFifths,
  10: pachelbel,
  11: risingSun,
  12: hotelCalifornia,
  13: watchtower,
  14: andalusian,
  15: phrygianVamp,
  16: mixolydianRock,
  17: soWhat,
  18: royalRoad,
};

export default progressions;
