import { useCallback, useEffect, useRef, useState } from "react";
import duckPhoto from "./assets/duck.jpeg";
import { playQuack, playMegaQuack, primeAudio } from "./quack.js";
import "./App.css";

const QUACK_WORDS = ["Quack!", "Quack quack!", "Quaaack~", "Honk?", "Quack? 💛", "*happy quack*"];
const EXCITED_WORDS = ["QUACK!", "QUACK QUACK!", "QUAAACK!!", "MAXIMUM QUACK!"];
const PET_EMOJI = ["❤️", "💛", "✨", "🎵", "💕", "⭐", "🫧", "🌟"];

const MILESTONES = [
  { at: 10, msg: "The duck is warming up to you 🥰" },
  { at: 25, msg: "Certified Good Duck Friend 🏅" },
  { at: 50, msg: "This duck would take a bullet for you 💛" },
  { at: 100, msg: "DUCK BEST FRIEND FOREVER 👑" },
  { at: 200, msg: "You have transcended. You ARE the duck. 🦆" },
  { at: 500, msg: "Okay you really like petting this duck huh 😅" },
];

let floaterId = 0;

export default function App() {
  const [quacks, setQuacks] = useState(0);
  const [best, setBest] = useState(() => Number(localStorage.getItem("duck-best")) || 0);
  const [excitement, setExcitement] = useState(0);
  const [floaters, setFloaters] = useState([]);
  const [bubble, setBubble] = useState(null);
  const [banner, setBanner] = useState(null);
  const [squish, setSquish] = useState(false);
  const [confetti, setConfetti] = useState([]);

  const excitementRef = useRef(0);
  const lastPetRef = useRef(0);
  const pettingRef = useRef(false);

  // Excitement gently cools down when you stop petting.
  useEffect(() => {
    const t = setInterval(() => {
      excitementRef.current = Math.max(0, excitementRef.current - 0.06);
      setExcitement(excitementRef.current);
    }, 180);
    return () => clearInterval(t);
  }, []);

  const spawnFloater = useCallback((excited) => {
    const id = ++floaterId;
    const emoji = excited ? "💛" : PET_EMOJI[(Math.random() * PET_EMOJI.length) | 0];
    const x = 50 + (Math.random() * 50 - 25); // % across the duck
    const drift = Math.random() * 40 - 20;
    setFloaters((f) => [...f, { id, emoji, x, drift }]);
    setTimeout(() => setFloaters((f) => f.filter((n) => n.id !== id)), 1300);
  }, []);

  const fireConfetti = useCallback(() => {
    const burst = Array.from({ length: 36 }, () => ({
      id: ++floaterId,
      emoji: ["🦆", "💛", "✨", "🎉", "⭐"][(Math.random() * 5) | 0],
      left: Math.random() * 100,
      delay: Math.random() * 0.4,
      duration: 1.6 + Math.random() * 1.4,
      rotate: Math.random() * 720 - 360,
    }));
    setConfetti(burst);
    setTimeout(() => setConfetti([]), 3400);
  }, []);

  const pet = useCallback(() => {
    const now = performance.now();
    if (now - lastPetRef.current < 90) return; // throttle frantic petting
    lastPetRef.current = now;

    primeAudio();

    // Build excitement; petting fast keeps it high.
    excitementRef.current = Math.min(1, excitementRef.current + 0.16);
    const ex = excitementRef.current;
    setExcitement(ex);

    playQuack(ex);

    setSquish(true);
    setTimeout(() => setSquish(false), 140);

    spawnFloater(ex > 0.7);

    const excited = ex > 0.7;
    const words = excited ? EXCITED_WORDS : QUACK_WORDS;
    setBubble({ text: words[(Math.random() * words.length) | 0], key: now });

    setQuacks((q) => {
      const next = q + 1;

      const milestone = MILESTONES.find((m) => m.at === next);
      if (milestone) {
        setBanner({ msg: milestone.msg, key: next });
        setTimeout(() => setBanner((b) => (b && b.key === next ? null : b)), 2600);
      }

      // Every 50 quacks: a glorious MEGA QUACK + confetti.
      if (next % 50 === 0) {
        playMegaQuack();
        fireConfetti();
      }

      if (next > best) {
        setBest(next);
        localStorage.setItem("duck-best", String(next));
      }
      return next;
    });
  }, [best, spawnFloater, fireConfetti]);

  // Pointer handling: tap OR drag across the duck to pet it.
  const onPointerDown = useCallback((e) => {
    e.preventDefault();
    pettingRef.current = true;
    pet();
  }, [pet]);

  const onPointerMove = useCallback((e) => {
    if (!pettingRef.current) return;
    e.preventDefault();
    pet();
  }, [pet]);

  useEffect(() => {
    const stop = () => (pettingRef.current = false);
    window.addEventListener("pointerup", stop);
    window.addEventListener("pointercancel", stop);
    return () => {
      window.removeEventListener("pointerup", stop);
      window.removeEventListener("pointercancel", stop);
    };
  }, []);

  // Keyboard: space / enter pets too, for accessibility & fun.
  const onKeyDown = useCallback((e) => {
    if (e.code === "Space" || e.code === "Enter") {
      e.preventDefault();
      pet();
    }
  }, [pet]);

  const mood =
    excitement > 0.7 ? "ECSTATIC 🤩" : excitement > 0.35 ? "Happy 😊" : quacks > 0 ? "Content 🙂" : "Waiting to be pet… 🥺";

  return (
    <div className="app">
      <h1 className="title">🦆 Pet the Duck</h1>
      <p className="subtitle">…and make it quack!</p>

      <div className="scoreboard">
        <div className="stat">
          <span className="stat-num">{quacks}</span>
          <span className="stat-label">quacks</span>
        </div>
        <div className="stat">
          <span className="stat-num">{best}</span>
          <span className="stat-label">best</span>
        </div>
      </div>

      <div className="mood">{mood}</div>

      <div className="happiness">
        <div className="happiness-fill" style={{ width: `${Math.round(excitement * 100)}%` }} />
      </div>

      <div
        className={`duck-stage${squish ? " squish" : ""}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onKeyDown={onKeyDown}
        role="button"
        tabIndex={0}
        aria-label="Pet the duck"
        title="Pet me! 🫳"
      >
        <img
          className="duck-img"
          src={duckPhoto}
          alt="A mallard duck standing in shallow water"
          draggable="false"
        />

        {bubble && (
          <div className="speech-bubble" key={bubble.key}>
            {bubble.text}
          </div>
        )}

        {floaters.map((f) => (
          <span
            key={f.id}
            className="floater"
            style={{ left: `${f.x}%`, "--drift": `${f.drift}px` }}
          >
            {f.emoji}
          </span>
        ))}
      </div>

      <p className="hint">👆 Tap, click, or drag across the duck to pet it. (Spacebar works too!)</p>

      {banner && <div className="banner" key={banner.key}>{banner.msg}</div>}

      {confetti.map((c) => (
        <span
          key={c.id}
          className="confetti"
          style={{
            left: `${c.left}%`,
            animationDelay: `${c.delay}s`,
            animationDuration: `${c.duration}s`,
            "--spin": `${c.rotate}deg`,
          }}
        >
          {c.emoji}
        </span>
      ))}

      <footer className="footer">Made with love &amp; quacks 🦆</footer>
    </div>
  );
}
