const shapes = {
  major: [1, 5, 8, 13],
  minor: [1, 4, 8, 13],
  7: [1, 1, 5, 8, 11],
  maj7: [1, 5, 8, 12],
  sus4: [1, 1, 6, 8, 11],
} as const;

const transpositionMap = {
  c: 0,
  db: 1,
  d: 2,
  eb: 3,
  e: 4,
  f: 5,
  gb: 6,
  g: 7,
  ab: 8,
  a: 9,
  bb: 10,
  b: 11,
} as const;

type Root = keyof typeof transpositionMap;
type Shape = keyof typeof shapes;
type ChordName = `${Root}${Shape}`;

const chordLibrary = {} as Record<ChordName, number[]>;
for (const root of Object.keys(transpositionMap) as Root[]) {
  const offset = transpositionMap[root];
  for (const shape of Object.keys(shapes) as Shape[]) {
    chordLibrary[`${root}${shape}`] = shapes[shape].map((n) => n + offset);
  }
}

export default chordLibrary;
