// Draws recorded turtle commands on a canvas.
// World: 400 x 400, origin at center, y up. Commands come from py/turtle.py.

export const SIZE = 400;
const fmt = (v) => Math.round(v * 10) / 10;

// Turtle state after the first n commands, one entry per turtle id.
export function turtlesAt(cmds, n) {
  const ts = [];
  for (let i = 0; i < n && i < cmds.length; i++) ts[cmds[i].after.t] = cmds[i].after;
  return ts.filter(Boolean);
}

// Drawing items (lines, fills, dots, text) after the first n commands.
function itemsAt(cmds, n) {
  let items = [];
  let bg = "#ffffff";
  const fillAt = new Map(); // begin_fill index -> fill command
  const open = {};
  for (let i = 0; i < n && i < cmds.length; i++) {
    const c = cmds[i];
    if (c.op === "begin_fill") open[c.after.t] = i;
    if (c.op === "fill" && open[c.after.t] !== undefined) {
      fillAt.set(open[c.after.t], c);
      delete open[c.after.t];
    }
  }
  for (let i = 0; i < n && i < cmds.length; i++) {
    const c = cmds[i], a = c.after;
    switch (c.op) {
      case "move":
      case "circle":
        if (c.draw) items.push({ kind: "path", t: a.t, i, pts: c.pts, color: a.color, width: a.width });
        break;
      case "begin_fill": {
        // The fill goes under the lines drawn after begin_fill.
        const f = fillAt.get(i);
        if (f && f.pts.length > 2) items.push({ kind: "fill", t: a.t, i, pts: f.pts, color: f.fillcolor });
        break;
      }
      case "dot":
        items.push({ kind: "dot", t: a.t, i, x: a.x, y: a.y, size: c.size, color: c.dotcolor });
        break;
      case "write":
        items.push({ kind: "text", t: a.t, i, x: a.x, y: a.y, text: c.text, align: c.align, size: c.size, color: a.color });
        break;
      case "clear":
        items = items.filter((it) => it.t !== a.t);
        break;
      case "bg":
        bg = c.bg;
        break;
    }
  }
  return { items, bg };
}

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.g = canvas.getContext("2d");
    this.grid = true;
    this.resize();
  }

  resize() {
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = SIZE * dpr;
    this.canvas.height = SIZE * dpr;
    this.dpr = dpr;
  }

  // Draw the state after n commands. opts.highlight: command index to draw bold.
  // opts.ghost: a command to show as a dashed preview. opts.active: active turtle id.
  draw(cmds, n, opts = {}) {
    const g = this.g;
    const { items, bg } = itemsAt(cmds, n);
    g.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    g.fillStyle = bg;
    g.fillRect(0, 0, SIZE, SIZE);
    if (this.grid) this.drawGrid();
    g.translate(SIZE / 2, SIZE / 2);
    g.scale(1, -1);
    g.lineCap = "round";
    g.lineJoin = "round";
    for (const it of items) this.drawItem(it, it.i === opts.highlight);
    if (opts.ghost && (opts.ghost.op === "move" || opts.ghost.op === "circle")) {
      g.setLineDash([6, 6]);
      g.strokeStyle = "#999";
      g.lineWidth = 2;
      this.path(opts.ghost.pts);
      g.setLineDash([]);
    }
    for (const t of turtlesAt(cmds, n)) {
      if (t.visible) this.drawTurtle(t, t.t === opts.active);
    }
  }

  drawGrid() {
    const g = this.g;
    g.lineWidth = 1;
    g.strokeStyle = "#0000000f";
    g.beginPath();
    for (let v = 0; v <= SIZE; v += 50) {
      g.moveTo(v + 0.5, 0); g.lineTo(v + 0.5, SIZE);
      g.moveTo(0, v + 0.5); g.lineTo(SIZE, v + 0.5);
    }
    g.stroke();
    g.strokeStyle = "#00000026";
    g.beginPath();
    g.moveTo(SIZE / 2 + 0.5, 0); g.lineTo(SIZE / 2 + 0.5, SIZE);
    g.moveTo(0, SIZE / 2 + 0.5); g.lineTo(SIZE, SIZE / 2 + 0.5);
    g.stroke();
  }

  path(pts) {
    const g = this.g;
    g.beginPath();
    g.moveTo(pts[0][0], pts[0][1]);
    for (let k = 1; k < pts.length; k++) g.lineTo(pts[k][0], pts[k][1]);
    g.stroke();
  }

  drawItem(it, bold) {
    const g = this.g;
    if (it.kind === "path") {
      g.strokeStyle = it.color;
      g.lineWidth = bold ? it.width + 3 : it.width;
      this.path(it.pts);
    } else if (it.kind === "fill") {
      g.fillStyle = it.color;
      g.beginPath();
      g.moveTo(it.pts[0][0], it.pts[0][1]);
      for (const p of it.pts.slice(1)) g.lineTo(p[0], p[1]);
      g.closePath();
      g.fill();
    } else if (it.kind === "dot") {
      g.fillStyle = it.color;
      g.beginPath();
      g.arc(it.x, it.y, it.size / 2, 0, Math.PI * 2);
      g.fill();
    } else if (it.kind === "text") {
      g.save();
      g.scale(1, -1);
      g.fillStyle = it.color;
      g.font = `${it.size}px sans-serif`;
      g.textAlign = it.align === "center" ? "center" : it.align === "right" ? "right" : "left";
      g.fillText(it.text, it.x, -it.y);
      g.restore();
    }
  }

  // Turtle in its pen color, facing its heading, size grows with pen size.
  drawTurtle(t, active) {
    const g = this.g;
    const k = 0.8 + Math.min(t.width, 10) * 0.1;
    g.save();
    g.translate(t.x, t.y);
    if (active) {
      g.fillStyle = "#ffe06688";
      g.beginPath(); g.arc(0, 0, 20 * k, 0, Math.PI * 2); g.fill();
    }
    g.save();
    g.rotate((t.h * Math.PI) / 180);
    g.scale(k, k);
    g.fillStyle = t.color;
    g.strokeStyle = "#0006";
    g.lineWidth = 1.5;
    for (const [lx, ly] of [[6, 8], [6, -8], [-6, 8], [-6, -8]]) {
      g.beginPath(); g.arc(lx, ly, 3, 0, Math.PI * 2); g.fill();
    }
    g.beginPath(); g.ellipse(0, 0, 11, 8, 0, 0, Math.PI * 2); g.fill(); g.stroke();
    g.beginPath(); g.arc(13, 0, 4.5, 0, Math.PI * 2); g.fill(); g.stroke();
    g.restore();
    g.scale(1, -1);
    g.fillStyle = "#6b7280";
    g.font = "11px ui-monospace, monospace";
    g.fillText(`(${fmt(t.x)}, ${fmt(t.y)})`, 14, 20);
    g.restore();
  }

  // Canvas pixel -> turtle world coordinates.
  toWorld(ev) {
    const r = this.canvas.getBoundingClientRect();
    const x = ((ev.clientX - r.left) / r.width) * SIZE - SIZE / 2;
    const y = SIZE / 2 - ((ev.clientY - r.top) / r.height) * SIZE;
    return { x: Math.round(x), y: Math.round(y) };
  }
}
