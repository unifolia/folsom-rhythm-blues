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

const jazzCadence: Progression = {
  length: 4,
  bars: {
    1: chordLibrary.dminor,
    2: chordLibrary.g7,
    3: chordLibrary.cmaj7,
  },
};

const tritoneSub: Progression = {
  length: 4,
  bars: {
    1: chordLibrary.dminor,
    2: chordLibrary.db7,
    3: chordLibrary.cmaj7,
  },
};

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

const watchtower: Progression = {
  length: 4,
  bars: {
    1: chordLibrary.aminor,
    2: chordLibrary.gmajor,
    3: chordLibrary.fmajor,
    4: chordLibrary.gmajor,
  },
};

const andalusian: Progression = {
  length: 4,
  bars: {
    1: chordLibrary.aminor,
    2: chordLibrary.gmajor,
    3: chordLibrary.fmajor,
    4: chordLibrary.emajor,
  },
};

const phrygianVamp: Progression = {
  length: 4,
  bars: {
    1: chordLibrary.eminor,
    2: chordLibrary.fmajor,
    3: chordLibrary.gmajor,
    4: chordLibrary.fmajor,
  },
};

const mixolydianRock: Progression = {
  length: 4,
  bars: {
    1: chordLibrary.gmajor,
    2: chordLibrary.fmajor,
    3: chordLibrary.cmajor,
    4: chordLibrary.gmajor,
  },
};

const soWhat: Progression = {
  length: 8,
  bars: {
    1: chordLibrary.dminor,
    5: chordLibrary.ebminor,
    7: chordLibrary.dminor,
  },
};

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
