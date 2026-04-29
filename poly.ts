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

// Variables and such
const LOOKAHEAD = 0.1;
const TICK_MS = 25;

let audioContext: AudioContext;
let scale: number[] = [],
  noteOne: number = 440,
  noteTwo: number = 440;
let bar: number = 1;
let volume: number = +volumeButton.value;
let speed: number;
let schedulerTimer: number, nextBarTime: number;
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
};

const shiftNotes = () => {
  noteOne = noteCalculator(scale[Math.floor(Math.random() * scale.length)]);
  noteTwo = noteCalculator(scale[Math.floor(Math.random() * scale.length)]);
};

const chordProgression = () => {
  const choice: HTMLInputElement = document.querySelector("input:checked");
  if (!choice?.value) return;

  const progression = progressions[+choice.value];
  if (!progression) return;

  if (bar > progression.length) bar = 1;
  const newScale = progression.bars[bar];
  if (newScale) scale = newScale;
  shiftNotes();
};

const setSpeed = () => {
  speed = (60 / +tempoButton.value) * 4 * 1000;
};

const scheduleNote = (time: number, freq: number, pan: number) => {
  const gainNode = audioContext.createGain();
  gainNode.gain.value = volume / 10;
  gainNode.connect(audioContext.destination);

  const panNode = audioContext.createStereoPanner();
  panNode.pan.value = pan;
  panNode.connect(gainNode);

  const osc = audioContext.createOscillator();
  osc.type = "square";
  osc.frequency.setValueAtTime(freq, time);
  osc.connect(panNode);
  osc.start(time);
  osc.stop(time + (speed / 1000) * drone);
};

const scheduleBar = (barStart: number) => {
  const barLen = speed / 1000;
  const n1 = +polyOne.value;
  const n2 = +polyTwo.value;
  for (let i = 0; i < n1; i++) {
    scheduleNote(barStart + (i * barLen) / n1, noteOne, -0.5);
  }
  for (let i = 0; i < n2; i++) {
    scheduleNote(barStart + (i * barLen) / n2, noteTwo, 0.5);
  }
};

const scheduler = () => {
  setSpeed();
  while (nextBarTime < audioContext.currentTime + LOOKAHEAD) {
    chordProgression();
    scheduleBar(nextBarTime);
    bar++;
    nextBarTime += speed / 1000;
  }
};

const start = () => {
  playButton.classList.add("playing");
  setSpeed();
  nextBarTime = audioContext.currentTime + 0.05;
  schedulerTimer = setInterval(scheduler, TICK_MS);
  playButton.innerText = "Stop";
};

const stop = () => {
  playButton.classList.remove("playing");
  clearInterval(schedulerTimer);
  bar = 1;
  playButton.innerText = "Play";
};

playButton.addEventListener("click", () => {
  if (!audioContext) createAudioContext();

  isPlaying = !isPlaying;

  if (isPlaying) start();
  else stop();
});

droneButton.addEventListener("click", () => {
  if (drone === 0.01995) drone = drone * 40;
  else drone = 0.01995;
});

polyOne.oninput = () => {
  spanA.innerHTML = polyOne.value;
};

polyTwo.oninput = () => {
  spanB.innerHTML = polyTwo.value;
};

tempoButton.oninput = () => {
  spanC.innerHTML = tempoButton.value;
};

volumeButton.oninput = () => {
  spanD.innerHTML = volumeButton.value;
  volume = +volumeButton.value;
};
