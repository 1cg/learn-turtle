// Compare the child's drawing with the goal drawing.
// Both are lists of polylines (arrays of [x, y]). The order of drawing does not matter.

const TOL = 5;     // how far (world units) a line can be from the goal and still match
const STEP = 4;    // sample spacing along lines

function segDist(px, py, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay;
  const len2 = dx * dx + dy * dy;
  let t = len2 ? ((px - ax) * dx + (py - ay) * dy) / len2 : 0;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

function near(p, paths) {
  for (const pts of paths) {
    for (let i = 1; i < pts.length; i++) {
      if (segDist(p[0], p[1], pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1]) <= TOL) return true;
    }
    if (pts.length === 1 && Math.hypot(p[0] - pts[0][0], p[1] - pts[0][1]) <= TOL) return true;
  }
  return false;
}

// Points every STEP units along each segment. Each sample keeps its segment.
function samples(paths) {
  const out = [];
  for (const pts of paths) {
    for (let i = 1; i < pts.length; i++) {
      const [ax, ay] = pts[i - 1], [bx, by] = pts[i];
      const n = Math.max(1, Math.ceil(Math.hypot(bx - ax, by - ay) / STEP));
      const seg = [pts[i - 1], pts[i]];
      for (let k = 0; k <= n; k++) out.push({ p: [ax + ((bx - ax) * k) / n, ay + ((by - ay) * k) / n], seg });
    }
  }
  return out;
}

// Polylines that the pen drew, after clear() is applied.
export function drawnPaths(cmds) {
  let items = [];
  for (const c of cmds) {
    if ((c.op === "move" || c.op === "circle") && c.draw) items.push({ t: c.after.t, pts: c.pts });
    if (c.op === "clear") items = items.filter((it) => it.t !== c.after.t);
  }
  return items.map((it) => it.pts).filter((pts) => pts.length > 1);
}

// ok: the drawings match. missing: goal segments with no line on them.
// extra: number of the child's segments that are not on the goal.
export function compare(goalPaths, kidPaths) {
  const g = samples(goalPaths), k = samples(kidPaths);
  const missingSegs = new Map();
  let covered = 0;
  for (const s of g) {
    if (near(s.p, kidPaths)) covered++;
    else missingSegs.set(s.seg, true);
  }
  const extraSegs = new Set();
  let onGoal = 0;
  for (const s of k) {
    if (near(s.p, goalPaths)) onGoal++;
    else extraSegs.add(s.seg);
  }
  const coverage = g.length ? covered / g.length : 1;
  const precision = k.length ? onGoal / k.length : 0;
  // Join the missing pieces back into polylines that can be drawn.
  const missing = [...missingSegs.keys()].map(([a, b]) => [a, b]);
  return {
    ok: g.length > 0 && coverage >= 0.97 && precision >= 0.95,
    coverage, precision, missing,
    missingCount: countRuns(goalPaths, missingSegs),
    extraCount: extraSegs.size,
  };
}

// Number of goal lines (runs of segments) that have a missing part.
function countRuns(goalPaths, missingSegs) {
  let runs = 0;
  for (const pts of goalPaths) {
    let inRun = false;
    for (let i = 1; i < pts.length; i++) {
      const miss = [...missingSegs.keys()].some(([a, b]) => a === pts[i - 1] && b === pts[i]);
      if (miss && !inRun) runs++;
      inRun = miss;
    }
  }
  return runs;
}

// Words for the badge.
export function verdict(r) {
  if (r.ok) return "It matches!";
  const parts = [];
  if (r.missingCount) parts.push(`${r.missingCount} ${r.missingCount === 1 ? "line is" : "lines are"} missing (red dashes)`);
  if (r.extraCount && r.precision < 0.95) parts.push("some lines are not on the goal");
  if (!parts.length) parts.push("the drawing is close, but not the same");
  return "Not yet: " + parts.join(", and ") + ".";
}
