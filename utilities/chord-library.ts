const major = [1, 5, 8, 13];
const minor = [1, 4, 8, 13];

const flat7 = [1, 1, 5, 8, 11];
const sus4 = [1, 1, 6, 8, 11];
const maj7 = [1, 5, 8, 12];

const transpositionmap = {
  e: 4,
  f: 5,
  gb: 6,
  g: 7,
  ab: 8,
  a: 9,
  bb: 10,
  b: 11,
  c: 0,
  db: 1,
  d: 2,
  eb: 3,
};

const { e, f, gb, g, ab, a, bb, b, c, db, d, eb } = transpositionmap;

const chordLibrary = {
  cmajor: major,
  cminor: minor,
  c7: flat7,
  cmaj7: maj7,
  //
  dmajor: major.map((n) => n + d),
  dminor: minor.map((n) => n + d),
  d7: flat7.map((n) => n + d),
  //
  ebmajor: major.map((n) => n + eb),
  ebminor: minor.map((n) => n + eb),
  eb7: flat7.map((n) => n + eb),
  //
  emajor: major.map((n) => n + e),
  eminor: minor.map((n) => n + e),
  e7: flat7.map((n) => n + e),
  //
  fmajor: major.map((n) => n + f),
  fminor: minor.map((n) => n + f),
  fmaj7: maj7.map((n) => n + f),
  //
  gmajor: major.map((n) => n + g),
  gminor: minor.map((n) => n + g),
  g7: flat7.map((n) => n + g),
  //
  amajor: major.map((n) => n + a),
  aminor: minor.map((n) => n + a),
  a7: flat7.map((n) => n + a),
  amaj7: maj7.map((n) => n + a),
  asus4: sus4.map((n) => n + a),
  //
  bbmajor: major.map((n) => n + bb),
  //
  bmajor: major.map((n) => n + b),
  bminor: minor.map((n) => n + b),
  b7: flat7.map((n) => n + b),
};

export default chordLibrary;
