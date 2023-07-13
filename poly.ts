import chordLibrary from "./utilities/chord-library";
import noteCalculator from "./utilities/note-calculator";

// HTML elements
const dotA: HTMLSpanElement = document.querySelector(".dotA");
const dotB: HTMLSpanElement = document.querySelector(".dotB");
const spanA = document.querySelector(".polyOne");
const spanB = document.querySelector(".polyOne");
const spanC = document.querySelector(".tempo");
const spanD = document.querySelector(".volume");
const polyOne: HTMLInputElement = document.querySelector("input#polyOne");
const polyTwo: HTMLInputElement = document.querySelector("input#polyTwo");
const tempoButton: HTMLInputElement = document.querySelector("input#tempo");
const volumeButton: HTMLInputElement = document.querySelector("input#volume");
const playButton: HTMLButtonElement = document.querySelector("#play");
const droneButton: HTMLInputElement = document.querySelector("#check");
const midiButton: HTMLInputElement = document.querySelector("#midi");

// Variables and such
let audioContext: AudioContext;
let scale: Array<number> = [1],
  noteOne: number = 440,
  noteTwo: number = 440;
let bar: number = 1;
let volume: number = +volumeButton.value;
let rhythmOne: number, rhythmTwo: number, barUtility: number, speed: number;
// "drone" acts as this strange multiplier to note length but not overall tempo
// reminiscent of a distorted dulcimer of sorts
let drone: number = 0.01995;
let isPlaying = false;
let midiRequested = false;
let midi = false;

// Dot boops and beeps
setInterval(() => {
  dotA.style.backgroundColor = "#22c1c3ba";
  dotB.style.backgroundColor = "#d69916";
}, 3000);
setInterval(() => {
  dotA.style.backgroundColor = "#d69916";
  dotB.style.backgroundColor = "#22c1c3ba";
}, 4000);

const handleMidi = () => {
  navigator?.requestMIDIAccess({ sysex: true })?.then(
    (midiAccess: any): void | PromiseLike<void> => {
      type MIDIResponse = { data: [number, number, number?] };

      setSpeed();

      midiAccess.inputs.forEach(
        (input: any) =>
          (input.onmidimessage = (event: MIDIResponse) => {
            const note = event.data.length === 3;
            const roliSlide = event.data[0] > 175;
            const knob = event.data[1];
            const on = event.data[2] !== 0;

            if (midi === true && note && on) {
              if (+knob === 22) {
                polyOne.value = (event.data[2] / 6.35).toString();
                spanA.innerHTML = polyOne.value;
                return;
              }
              if (+knob === 23) {
                polyTwo.value = (event.data[2] / 6.35).toString();
                spanB.innerHTML = polyTwo.value;
                return;
              }
              if (+knob === 24) {
                tempoButton.value = (event.data[2] * 1.716535).toString();
                spanC.innerHTML = tempoButton.value;
                return;
              }
              if (+knob === 25) {
                volumeButton.value = (event.data[2] / 12.7).toString();
                spanD.innerHTML = volumeButton.value;
                volume = +volumeButton.value;
                return;
              }

              if (roliSlide) return;

              beep(noteCalculator(+event.data[1] - 47), "center");
            }
          })
      );
    },
    () => {
      return;
    }
  );
};

const createAudioContext = async () => {
  audioContext = new window.AudioContext();
};

const shiftNotes = () => {
  noteOne = noteCalculator(scale[Math.floor(Math.random() * scale.length)]);
  noteTwo = noteCalculator(scale[Math.floor(Math.random() * scale.length)]);
};

const folsomBlues = () => {
  if (bar > 12) bar = 1;
  if (bar === 1 || bar === 7 || bar === 11) scale = chordLibrary.emajor;
  if (bar === 5) scale = chordLibrary.amajor;
  if (bar === 9) scale = chordLibrary.b7;
  shiftNotes();
};

const wonderwall = () => {
  if (bar > 4) bar = 1;
  if (bar === 1) scale = chordLibrary.eminor;
  if (bar === 2) scale = chordLibrary.gmajor;
  if (bar === 3) scale = chordLibrary.dmajor;
  if (bar === 4) scale = chordLibrary.asus4;
  shiftNotes();
};

const creep = () => {
  if (bar > 8) bar = 1;
  if (bar === 1) scale = chordLibrary.gmajor;
  if (bar === 3) scale = chordLibrary.bmajor;
  if (bar === 5) scale = chordLibrary.cmajor.map((n) => n + 12);
  if (bar === 7) scale = chordLibrary.cminor.map((n) => n + 12);
  shiftNotes();
};

const whatsup = () => {
  if (bar > 8) bar = 1;
  if (bar === 1 || bar === 7) scale = chordLibrary.cmajor;
  if (bar === 3) scale = chordLibrary.dminor;
  if (bar === 5) scale = chordLibrary.fmajor;
  shiftNotes();
};

const seal = () => {
  if (bar > 4) bar = 1;
  if (bar === 1) scale = chordLibrary.ebmajor;
  if (bar === 2) scale = chordLibrary.fmajor;
  if (bar === 3) scale = chordLibrary.gmajor;
  shiftNotes();
};

const chordProgression = () => {
  const progression: HTMLInputElement = document.querySelector("input:checked");

  if (progression?.value) {
    if (+progression.value === 1) folsomBlues();
    if (+progression.value === 2) wonderwall();
    if (+progression.value === 3) creep();
    if (+progression.value === 4) whatsup();
    if (+progression.value === 5) seal();
  }
};

const setSpeed = () => {
  speed = (60 / +tempoButton.value) * 4 * 1000 - 5;
};

const beep = async (freq: number, panning: string) => {
  const gainNode = audioContext.createGain();
  gainNode.gain.value = volume / 10;
  gainNode.connect(audioContext.destination);

  const panNode = audioContext.createStereoPanner();
  panNode.pan.value = panning === "left" ? -0.5 : panning === "right" ? 0.5 : 0;
  panNode.connect(gainNode);

  const oscillatorEngine = audioContext.createOscillator();
  oscillatorEngine.type = "square" as OscillatorType;
  oscillatorEngine.frequency.setValueAtTime(freq, audioContext.currentTime);
  oscillatorEngine.connect(panNode);

  oscillatorEngine.start();

  const noteBuffer = new Promise((res) => setTimeout(res, speed * drone));
  await noteBuffer.then(() => {
    oscillatorEngine.stop();
    oscillatorEngine.disconnect();
  });
};

const activateBeep = (beepFrequency: number, pan: string) => {
  beep(beepFrequency, pan);
};

const loopBeep = () => {
  barUtility = setTimeout(() => {
    clearBeep();
    ++bar;

    if (isPlaying === true) {
      loopBeep();
    } else {
      stop();
    }
  }, speed);

  chordProgression();
  activateBeep(noteOne, "left");
  activateBeep(noteTwo, "right");

  rhythmOne = setInterval(() => {
    activateBeep(noteOne, "left");
  }, speed / +polyOne.value);

  rhythmTwo = setInterval(() => {
    activateBeep(noteTwo, "right");
  }, speed / +polyTwo.value);
};

const clearBeep = () => {
  clearInterval(rhythmOne);
  clearInterval(rhythmTwo);
  setSpeed();
};

const start = () => {
  playButton.classList.add("playing");

  setSpeed();
  loopBeep();
  playButton.innerText = "Stop";
};

const stop = () => {
  playButton.classList.remove("playing");

  clearBeep();
  clearInterval(barUtility);
  bar = 1;
  playButton.innerText = "Play";
};

playButton.addEventListener("click", () => {
  if (!audioContext) createAudioContext();

  isPlaying = !isPlaying;

  if (isPlaying) start();
  else if (!isPlaying) stop();
});

droneButton.addEventListener("click", () => {
  if (drone === 0.01995) drone = drone * 40;
  else drone = 0.01995;
});

midiButton.addEventListener("click", () => {
  if (!audioContext) createAudioContext();
  if (!midiRequested) {
    handleMidi();
    midiRequested = true;
  }

  midi = !midi;
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
