import progressions from "./utilities/chord-progressions";
import noteCalculator from "./utilities/note-calculator";

// HTML elements
const dotA: HTMLSpanElement = document.querySelector(".dotA");
const dotB: HTMLSpanElement = document.querySelector(".dotB");
const spanA = document.querySelector(".polyOne");
const spanB = document.querySelector(".polyTwo");
const spanC = document.querySelector(".tempo");
const spanD = document.querySelector(".volume");
const polyOne: HTMLInputElement = document.querySelector("input#polyOne");
const polyTwo: HTMLInputElement = document.querySelector("input#polyTwo");
const tempoButton: HTMLInputElement = document.querySelector("input#tempo");
const volumeButton: HTMLInputElement = document.querySelector("input#volume");
const playButton: HTMLButtonElement = document.querySelector("#play");
const droneButton: HTMLInputElement = document.querySelector("#check");
const progressionButtons = document.querySelectorAll<HTMLInputElement>(
  'input[name="progression"]',
);

const resetControlsToDefaults = () => {
  polyOne.value = polyOne.defaultValue;
  polyTwo.value = polyTwo.defaultValue;
  tempoButton.value = tempoButton.defaultValue;
  volumeButton.value = volumeButton.defaultValue;
  droneButton.checked = droneButton.defaultChecked;
  progressionButtons.forEach((input) => {
    input.checked = input.defaultChecked;
  });
};

const syncControlLabels = () => {
  spanA.textContent = polyOne.value;
  spanB.textContent = polyTwo.value;
  spanC.textContent = tempoButton.value;
  spanD.textContent = volumeButton.value;
};

resetControlsToDefaults();
syncControlLabels();

// Variables and such
const BEATS_PER_BAR = 4;
const LOOKAHEAD = 0.1;
const START_DELAY = 0.05;
const TICK_MS = 25;
const SCHEDULE_EPSILON = 0.001;
const UNITY_VOLUME_LEVEL = 7;
const NOTE_HEADROOM_GAIN = 0.5;

type BarState = {
  number: number;
  startTime: number;
  duration: number;
  scale: number[];
  noteOne: number;
  noteTwo: number;
};

type ScheduledNote = {
  time: number;
  stopTime: number;
  oscillator: OscillatorNode;
  output: GainNode;
};

let audioContext: AudioContext;
let masterGainNode: GainNode;
let currentBar: BarState;
let nextBar: BarState;
let scheduledNotes: ScheduledNote[] = [];
let volume: number = +volumeButton.value;
let schedulerTimer: number, scheduledThrough: number;
// "drone" acts as this strange multiplier to note length but not overall tempo
// reminiscent of a distorted dulcimer of sorts
let drone: number = 0.01995;
let isPlaying = false;

// Dot boops and beeps
setInterval(() => {
  dotA.style.backgroundColor = "#22c1c3ba";
  dotB.style.backgroundColor = "#d69916";
}, 3000);
setInterval(() => {
  dotA.style.backgroundColor = "#d69916";
  dotB.style.backgroundColor = "#22c1c3ba";
}, 4000);

const createAudioContext = () => {
  audioContext = new window.AudioContext();
  masterGainNode = audioContext.createGain();
  masterGainNode.gain.value = getVolumeGain();
  masterGainNode.connect(audioContext.destination);
};

const getSelectedProgression = () => {
  const choice: HTMLInputElement = document.querySelector(
    'input[name="progression"]:checked',
  );

  if (!choice?.value) return null;

  return progressions[+choice.value] || null;
};

const getBarDuration = () => (60 / +tempoButton.value) * BEATS_PER_BAR;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const getVolumeGain = () => volume / UNITY_VOLUME_LEVEL;

const wrapBarNumber = (barNumber: number, progressionLength: number) =>
  ((barNumber - 1) % progressionLength) + 1;

const chooseNote = (activeScale: number[]) => {
  if (!activeScale.length) return 440;

  return noteCalculator(
    activeScale[Math.floor(Math.random() * activeScale.length)],
  );
};

const createBarState = (
  barNumber: number,
  startTime: number,
  duration: number,
  previousScale: number[] = [],
): BarState => {
  const progression = getSelectedProgression();
  const number = progression
    ? wrapBarNumber(barNumber, progression.length)
    : barNumber;
  const scale = progression?.bars[number] || previousScale;

  return {
    number,
    startTime,
    duration,
    scale,
    noteOne: chooseNote(scale),
    noteTwo: chooseNote(scale),
  };
};

const getNextBarNumber = (barState: BarState) => {
  const progression = getSelectedProgression();
  if (!progression) return barState.number + 1;

  return barState.number >= progression.length ? 1 : barState.number + 1;
};

const getFollowingBar = (barState: BarState) => {
  const startTime = barState.startTime + barState.duration;
  const number = getNextBarNumber(barState);

  if (
    barState === currentBar &&
    nextBar &&
    nextBar.number === number &&
    nextBar.duration === barState.duration &&
    Math.abs(nextBar.startTime - startTime) < SCHEDULE_EPSILON
  ) {
    return nextBar;
  }

  const followingBar = createBarState(
    number,
    startTime,
    barState.duration,
    barState.scale,
  );

  if (barState === currentBar) nextBar = followingBar;

  return followingBar;
};

const advanceCurrentBar = (time: number) => {
  while (currentBar && time >= currentBar.startTime + currentBar.duration) {
    currentBar = getFollowingBar(currentBar);
    nextBar = null;
  }
};

const cleanupScheduledNotes = (time: number) => {
  scheduledNotes = scheduledNotes.filter((note) => note.stopTime > time);
};

const cancelScheduledNote = (note: ScheduledNote, time: number) => {
  note.output.gain.cancelScheduledValues(time);
  note.output.gain.setValueAtTime(0, time);

  try {
    note.oscillator.stop(time);
  } catch {
    // Honestly I don't know what to do here, so just skip
  }
};

const cancelPendingNotes = (time: number) => {
  scheduledNotes = scheduledNotes.filter((note) => {
    if (note.time <= time) return true;

    cancelScheduledNote(note, time);

    return false;
  });
};

const cancelAllScheduledNotes = () => {
  if (!audioContext) return;

  const now = audioContext.currentTime;
  for (const note of scheduledNotes) {
    cancelScheduledNote(note, now);
  }
  scheduledNotes = [];
};

const setMasterGain = () => {
  if (!masterGainNode) return;

  const now = audioContext.currentTime;
  masterGainNode.gain.cancelScheduledValues(now);
  masterGainNode.gain.setTargetAtTime(getVolumeGain(), now, 0.005);
};

const scheduleNote = (
  time: number,
  freq: number,
  pan: number,
  barDuration: number,
) => {
  const noteGainNode = audioContext.createGain();
  noteGainNode.gain.value = NOTE_HEADROOM_GAIN;
  noteGainNode.connect(masterGainNode);

  const panNode = audioContext.createStereoPanner();
  panNode.pan.value = pan;
  panNode.connect(noteGainNode);

  const osc = audioContext.createOscillator();
  const stopTime = time + barDuration * drone;
  osc.type = "square";
  osc.frequency.setValueAtTime(freq, time);
  osc.connect(panNode);
  osc.start(time);
  osc.stop(stopTime);
  osc.onended = () => {
    osc.disconnect();
    panNode.disconnect();
    noteGainNode.disconnect();
  };

  scheduledNotes.push({
    time,
    stopTime,
    oscillator: osc,
    output: noteGainNode,
  });
};

const scheduleVoice = (
  barState: BarState,
  division: number,
  freq: number,
  pan: number,
  windowStart: number,
  windowEnd: number,
) => {
  const step = barState.duration / division;
  let index = Math.max(
    0,
    Math.ceil((windowStart - barState.startTime - SCHEDULE_EPSILON) / step),
  );

  for (; index < division; index++) {
    const time = barState.startTime + index * step;
    if (time < windowStart || time < audioContext.currentTime) continue;
    if (time >= windowEnd) break;

    scheduleNote(time, freq, pan, barState.duration);
  }
};

const scheduleBarWindow = (
  barState: BarState,
  windowStart: number,
  windowEnd: number,
) => {
  scheduleVoice(
    barState,
    +polyOne.value,
    barState.noteOne,
    -0.5,
    windowStart,
    windowEnd,
  );
  scheduleVoice(
    barState,
    +polyTwo.value,
    barState.noteTwo,
    0.5,
    windowStart,
    windowEnd,
  );
};

const scheduleWindow = (windowStart: number, windowEnd: number) => {
  let barState = currentBar;
  let cursor = windowStart;

  while (barState && cursor < windowEnd) {
    const barEnd = barState.startTime + barState.duration;
    if (cursor >= barEnd) {
      barState = getFollowingBar(barState);
      continue;
    }

    const rangeEnd = Math.min(windowEnd, barEnd);
    scheduleBarWindow(barState, cursor, rangeEnd);
    cursor = rangeEnd;
  }
};

const scheduler = () => {
  const now = audioContext.currentTime;
  const horizon = now + LOOKAHEAD;

  advanceCurrentBar(now);
  cleanupScheduledNotes(now);

  if (scheduledThrough < now) scheduledThrough = now;

  scheduleWindow(scheduledThrough, horizon);
  scheduledThrough = horizon;
};

const rescheduleUpcoming = () => {
  if (!isPlaying || !audioContext || !currentBar) return;

  const now = audioContext.currentTime;
  advanceCurrentBar(now);
  cancelPendingNotes(now);
  nextBar = null;
  scheduledThrough = now;
  scheduler();
};

const updateTempo = () => {
  if (!isPlaying || !audioContext || !currentBar) return;

  const now = audioContext.currentTime;
  advanceCurrentBar(now);

  const progress = clamp(
    (now - currentBar.startTime) / currentBar.duration,
    0,
    0.999999,
  );
  const duration = getBarDuration();

  currentBar = {
    ...currentBar,
    startTime: now - progress * duration,
    duration,
  };

  rescheduleUpcoming();
};

const start = () => {
  playButton.classList.add("playing");
  currentBar = createBarState(
    1,
    audioContext.currentTime + START_DELAY,
    getBarDuration(),
  );
  nextBar = null;
  scheduledNotes = [];
  scheduledThrough = currentBar.startTime;
  scheduler();
  schedulerTimer = setInterval(scheduler, TICK_MS);
  playButton.innerText = "Stop";
};

const stop = () => {
  playButton.classList.remove("playing");
  clearInterval(schedulerTimer);
  cancelAllScheduledNotes();
  currentBar = null;
  nextBar = null;
  scheduledThrough = 0;
  playButton.innerText = "Play";
};

playButton.addEventListener("click", () => {
  if (!audioContext) createAudioContext();
  if (audioContext.state === "suspended") audioContext.resume();

  isPlaying = !isPlaying;

  if (isPlaying) start();
  else stop();
});

droneButton.addEventListener("click", () => {
  if (drone === 0.01995) drone = drone * 40;
  else drone = 0.01995;
  rescheduleUpcoming();
});

polyOne.oninput = () => {
  spanA.textContent = polyOne.value;
  rescheduleUpcoming();
};

polyTwo.oninput = () => {
  spanB.textContent = polyTwo.value;
  rescheduleUpcoming();
};

tempoButton.oninput = () => {
  spanC.textContent = tempoButton.value;
  updateTempo();
};

volumeButton.oninput = () => {
  spanD.textContent = volumeButton.value;
  volume = +volumeButton.value;
  setMasterGain();
};

progressionButtons.forEach((input) =>
  input.addEventListener("change", rescheduleUpcoming),
);
