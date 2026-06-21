// A tiny Web Audio "quack" synthesizer.
// No audio files needed — every quack is generated on the fly, so the duck
// never repeats itself in quite the same way. Higher `excitement` (0..1)
// makes the duck quack faster and higher, like it's getting really happy.

let ctx = null;

function getCtx() {
  if (!ctx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    ctx = new AudioCtx();
  }
  // Browsers start the context "suspended" until a user gesture; resume on tap.
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

// Call once from a user gesture (e.g. first pet) to unlock audio on mobile.
export function primeAudio() {
  getCtx();
}

export function playQuack(excitement = 0) {
  const ac = getCtx();
  const now = ac.currentTime;

  // Pitch rises with excitement, plus a little random wobble for variety.
  const base = 300 + excitement * 220 + (Math.random() * 60 - 30);
  const dur = 0.16 - excitement * 0.04; // excited ducks quack quicker

  // The "honk" tone: a sawtooth gives the buzzy reedy character of a quack.
  const osc = ac.createOscillator();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(base * 1.15, now);
  osc.frequency.exponentialRampToValueAtTime(base * 0.7, now + dur);

  // A bandpass "formant" sweep shapes it from "kw" into "aack".
  const formant = ac.createBiquadFilter();
  formant.type = "bandpass";
  formant.Q.value = 6;
  formant.frequency.setValueAtTime(700, now);
  formant.frequency.linearRampToValueAtTime(1600, now + dur * 0.4);
  formant.frequency.linearRampToValueAtTime(900, now + dur);

  // Amplitude envelope: snappy attack, quick decay.
  const gain = ac.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.9, now + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

  osc.connect(formant);
  formant.connect(gain);
  gain.connect(ac.destination);

  osc.start(now);
  osc.stop(now + dur + 0.02);
}

// A big, silly "MEGA QUACK" — a layered, lower, longer honk for milestones.
export function playMegaQuack() {
  const ac = getCtx();
  const now = ac.currentTime;
  [220, 160, 110].forEach((base, i) => {
    const osc = ac.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(base * 1.2, now);
    osc.frequency.exponentialRampToValueAtTime(base * 0.6, now + 0.5);

    const filter = ac.createBiquadFilter();
    filter.type = "bandpass";
    filter.Q.value = 5;
    filter.frequency.setValueAtTime(500, now);
    filter.frequency.linearRampToValueAtTime(1400, now + 0.2);
    filter.frequency.linearRampToValueAtTime(700, now + 0.5);

    const gain = ac.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.5, now + 0.02 + i * 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ac.destination);
    osc.start(now);
    osc.stop(now + 0.6);
  });
}
