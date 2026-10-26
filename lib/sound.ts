// Tiny synthesized sound effects for games (no audio files, no dependency).
// OFF by default; the choice is shared by every game that uses it
// (localStorage["hottogol:sound"] = "1"). The AudioContext is only created
// after the player turns sound on (a user gesture), and every call is a no-op
// when sound is off, blocked or unsupported.

const KEY = "hottogol:sound";
const listeners = new Set<() => void>();
let ctx: AudioContext | null = null;
let memory = false;

export type SoundKind = "clack" | "drop" | "foul" | "win" | "whoosh" | "crash";

export const soundStore = {
  subscribe(cb: () => void) {
    listeners.add(cb);
    return () => listeners.delete(cb);
  },
  read(): boolean {
    try {
      return window.localStorage.getItem(KEY) === "1";
    } catch {
      return memory;
    }
  },
  write(on: boolean) {
    memory = on;
    try {
      window.localStorage.setItem(KEY, on ? "1" : "0");
    } catch {
      // in-memory fallback above
    }
    if (on) audio();
    listeners.forEach((l) => l());
  },
};

function audio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    ctx ??= new AudioContext();
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone(a: AudioContext, type: OscillatorType, from: number, to: number, ms: number, gain: number, delay = 0) {
  const t = a.currentTime + delay;
  const o = a.createOscillator();
  const g = a.createGain();
  o.type = type;
  o.frequency.setValueAtTime(from, t);
  o.frequency.exponentialRampToValueAtTime(to, t + ms / 1000);
  g.gain.setValueAtTime(gain, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + ms / 1000);
  o.connect(g).connect(a.destination);
  o.start(t);
  o.stop(t + ms / 1000 + 0.02);
}

function noise(a: AudioContext, ms: number, gain: number) {
  const len = Math.floor((a.sampleRate * ms) / 1000);
  const buf = a.createBuffer(1, len, a.sampleRate);
  const data = buf.getChannelData(0);
  // Visual/audio flavour only — not gameplay, so Math.random is fine here.
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len) ** 2;
  const src = a.createBufferSource();
  const g = a.createGain();
  g.gain.value = gain;
  src.buffer = buf;
  src.connect(g).connect(a.destination);
  src.start();
}

/** Play a short effect if sound is on. `strength` 0–1 scales the volume. */
export function playSound(kind: SoundKind, strength = 1): void {
  if (!soundStore.read()) return;
  const a = audio();
  if (!a) return;
  const v = 0.05 + 0.2 * Math.max(0, Math.min(1, strength));
  switch (kind) {
    case "clack":
      return tone(a, "triangle", 2400, 1500, 60, v);
    case "drop":
      tone(a, "sine", 520, 260, 140, 0.15);
      return tone(a, "sine", 300, 180, 160, 0.1, 0.09);
    case "foul":
      return tone(a, "square", 220, 140, 220, 0.06);
    case "win":
      return [523, 659, 784].forEach((f, i) => tone(a, "triangle", f, f, 140, 0.12, i * 0.1));
    case "whoosh":
      return noise(a, 160, 0.05);
    case "crash":
      noise(a, 260, v);
      return tone(a, "sawtooth", 180, 60, 200, v / 2);
  }
}
