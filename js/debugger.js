// Step through a recording. Position pos = index of the step that just ran
// (-1 = nothing ran yet). The view shows the state after that step.

export class Stepper {
  constructor(rec) {
    this.rec = rec;
    // Hide raw exception events and the first "call" of the main program.
    this.steps = rec.steps.filter((s) => s.event !== "exception" && !(s.event === "call" && s.frames.length === 1));
    this.pos = -1;
  }

  get last() { return this.steps.length - 1; }
  atEnd() { return this.pos >= this.last; }
  go(p) { this.pos = Math.max(-1, Math.min(this.last, p)); }
  next() { this.go(this.pos + 1); }
  back() { this.go(this.pos - 1); }

  // Run a whole function call in one jump.
  skip() {
    const S = this.steps, nx = S[this.pos + 1];
    if (!nx || nx.event !== "call") return this.next();
    const d = nx.frames.length;
    for (let j = this.pos + 2; j <= this.last; j++) {
      if (S[j].event === "return" && S[j].frames.length === d) return this.go(j);
    }
    this.go(this.last);
  }

  canSkip() { return this.steps[this.pos + 1]?.event === "call"; }

  // Stop just before a stop-sign line runs. The current stop is not counted.
  isStopNext(stops, p = this.pos) {
    const nx = this.steps[p + 1];
    return !!nx && nx.event === "line" && stops.has(nx.line);
  }

  toStop(stops) {
    for (let j = this.pos + 1; j < this.last; j++) {
      if (this.isStopNext(stops, j)) return this.go(j);
    }
    this.go(this.last);
  }

  view() {
    const S = this.steps, rec = this.rec, p = this.pos;
    const cur = p >= 0 ? S[p] : null;
    const after = S[p + 1];
    const cmdN = after ? after.cmd : rec.cmds.length;
    let frames = [];
    if (cur) {
      frames = after ? after.frames : cur.frames;
      // A call starts in the next step; keep the old frames until then.
      if (after && after.frames.length > cur.frames.length) frames = after.frames.slice(0, cur.frames.length);
    }
    const first = cur ? cur.cmd : 0;
    const made = cmdN > first ? rec.cmds[cmdN - 1] : null;
    const nextEnd = S[p + 2] ? S[p + 2].cmd : rec.cmds.length;
    const ghost = rec.cmds.slice(cmdN, after ? nextEnd : cmdN).find((c) => (c.op === "move" || c.op === "circle") && c.draw);
    return {
      pos: p, cur, after, cmdN, frames, made, ghost,
      // "done" step of a function: mark the line that called it.
      ran: !cur ? 0 : cur.event === "return" && cur.frames.length > 1 ? cur.frames[cur.frames.length - 2].line : cur.line,
      next: after ? after.line : 0,
      say: !cur ? "" : !after && rec.error ? `Python stops here: ${rec.error.type}` : cur.say,
      out: rec.out.slice(0, after ? after.out : rec.out.length),
      error: !after && cur ? rec.error : null,
    };
  }
}

// ---- small views ----

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

function shown(v) {
  if (v.type === "function") return "function";
  if (v.type === "Turtle") return "Turtle";
  return v.repr ?? v.type;
}

// Variables as labeled boxes, one group for each running function.
export function framesHTML(frames, prev) {
  const now = {};
  if (!frames.length) return { html: '<span class="empty">no boxes yet</span>', now };
  const html = frames.map((f, fi) => {
    const names = Object.keys(f.vars);
    const boxes = names.length ? names.map((k) => {
      const id = fi + ":" + f.name + ":" + k;
      const val = shown(f.vars[k]);
      now[id] = val;
      const changed = prev[id] !== val;
      return `<div class="box${changed ? " changed" : ""}"><div class="label">${esc(k)}</div><div class="val">${esc(val)}</div></div>`;
    }).join("") : '<span class="empty">no boxes yet</span>';
    const top = fi === frames.length - 1 && fi > 0;
    const sub = fi > 0 ? ` <small>called from line ${frames[fi - 1].line}</small>` : "";
    return `<div class="frame${top ? " top" : ""}"><div class="fname">${esc(f.name)}${sub}</div><div class="boxes">${boxes}</div></div>`;
  }).join("");
  return { html, now };
}

const fmt = (v) => Math.round(v * 10) / 10;

function turtleIcon(t) {
  const k = 0.8 + Math.min(t.width, 10) * 0.1;
  return `<svg viewBox="-16 -16 32 32"><g transform="rotate(${-t.h}) scale(${k})" fill="${esc(t.color)}" stroke="#0006" stroke-width="1.5">
    <circle cx="6" cy="8" r="3" stroke="none"/><circle cx="6" cy="-8" r="3" stroke="none"/><circle cx="-6" cy="8" r="3" stroke="none"/><circle cx="-6" cy="-8" r="3" stroke="none"/>
    <ellipse rx="11" ry="8"/><circle cx="13" r="4.5"/></g></svg>`;
}
const PEN_DOWN = '<svg class="pen" viewBox="0 0 24 24"><title>pen down: drawing</title><path d="M4 20l2-6L16 4l4 4L10 18z" fill="#1d2330"/><path d="M2 22h20" stroke="#1d2330" stroke-width="2"/></svg>';
const PEN_UP = '<svg class="pen" viewBox="0 0 24 24"><title>pen up: not drawing</title><path d="M4 14l2-6L16-2l4 4L10 12z" fill="#9ca3af" transform="translate(0 2)"/><path d="M2 22h20" stroke="#9ca3af" stroke-width="2" stroke-dasharray="3 3"/></svg>';

// One small chip for each turtle: icon in pen color, facing its heading, pen up/down.
export function chipsHTML(turtles, activeId) {
  return turtles.map((t) => {
    const tip = `at (${fmt(t.x)}, ${fmt(t.y)}), facing ${fmt(t.h)} degrees, ${t.color} pen, size ${t.width}`;
    return `<span class="tchip${t.t === activeId ? " active" : ""}" title="${esc(tip)}">${turtleIcon(t)}${t.pen ? PEN_DOWN : PEN_UP}</span>`;
  }).join("");
}
