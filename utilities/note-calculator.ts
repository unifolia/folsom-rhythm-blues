const noteCalculator = (noteNum: number) => {
  const tuning = 440;
  const A440 = Math.pow(2, 1 / 12);
  const transposer = -22;
  return +(tuning * Math.pow(A440, noteNum + transposer)).toFixed(4);
};

export default noteCalculator;
