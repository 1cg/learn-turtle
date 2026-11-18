// Home page, lesson map, lesson steps (watch, try, extend), goal check, progress link.
// Intent: src/md/features/lessons.md and src/md/features/home.md. The markup is in index.html.
import { drawnPaths, compare, verdict } from "./check.js";
import { Renderer } from "./renderer.js";
import { collect, encode, decode, merge, startCode } from "./progress.js";

const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch { /* private mode: no saving */ } },
};
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
// Short lesson text: `code` becomes <code>, *word* becomes <em>. Nothing else.
const md = (s) => esc(s).replace(/`([^`]+)`/g, "<code>$1</code>").replace(/\*([^*\n]+)\*/g, "<em>$1</em>");
const $ = (id) => document.getElementById(id);

// Short words under each unit name on the home page. Placeholder text: the human writes the final words.
const UNIT_NOTES = {
  1: "Learn the basics of turtle: how to move around the screen and draw, etc.",
  2: "Read an error message and fix the line.",
  3: "Notes in your code that Python skips.",
  4: "Boxes with names that hold values.",
  5: "Numbers and text are not the same thing.",
  6: "Repeat lines with `for`.",
  7: "Make your own commands with `def`.",
  8: "Pick what runs with `if` and `else`.",
  9: "Repeat while a test is True.",
  10: "Keep many values in one box.",
  11: "More than one turtle, each with a name.",
  12: "Put it all together.",
};
const UNITS = { 1: "Steps", 2: "Errors", 3: "Comments", 4: "Variables", 5: "Types", 6: "Loops", 7: "Functions",
  8: "If", 9: "While", 10: "Lists", 11: "Objects", 12: "Projects" };
const KIND = { watch: "Learn", try: "Try", extend: "Do" }; // labels the child sees; the data keeps "watch"
// Step names: a second "extend" step is "Do more".
const stepName = (l, i) => l.steps[i].kind === "extend" && l.steps.slice(0, i).some((x) => x.kind === "extend") ? "Do more" : KIND[l.steps[i].kind] || l.steps[i].kind;

export async function initLessons({ editor, runner, renderer, play, forget, freeStarter }) {
  const fixture = new URLSearchParams(location.search).has("fixture");
  let LESSONS = [];
  try {
    LESSONS = (await import(fixture ? "../test/lessons-fixture.js" : "../lessons/lessons.js")).LESSONS || [];
  } catch {
    LESSONS = []; // no lessons: free draw only
  }

  // ---- state ----
  let cur = null;      // lesson, or null
  let si = 0;          // step index
  let goal = null;     // goal polylines of the step
  let lastOk = false;  // the last run of this step matched the goal
  let hintsShown = 0;
  const goals = new Map();
  const step = () => cur && cur.steps[si];
  const editable = () => !!cur ? step().kind !== "watch" : true;
  const codeKey = () => "lt:code:" + (cur ? `${cur.id}:${si}` : "free");
  const stepDone = (l, i) => store.get(`lt:done:${l.id}:${i}`) === "1";
  const isDone = (l) => store.get("lt:done:" + l.id) === "1";
  const index = () => LESSONS.indexOf(cur);

  // Start code for a step. Extend starts from the child's own code of the step before.
  function startFor(l, i) {
    if (l.steps[i].kind === "extend") {
      const prev = store.get(`lt:code:${l.id}:${i - 1}`);
      if (prev && prev.trim()) return prev;
    }
    return startCode(l, i);
  }

  let saveTimer = null;
  function saveNow() {
    clearTimeout(saveTimer);
    if (editable()) store.set(codeKey(), editor.getValue());
  }
  editor.onChange(() => {
    if (!editable()) return;
    clearTimeout(saveTimer);
    const key = codeKey(), value = editor.getValue();
    saveTimer = setTimeout(() => store.set(key, value), 300);
    markChanged();
  });

  function markChanged() {
    if (!cur || !editable()) return editor.setChanged([]);
    const base = new Set(startFor(cur, si).split("\n").map((x) => x.trimEnd()));
    const lines = editor.getValue().split("\n");
    editor.setChanged(lines.map((x, k) => (x.trim() && !base.has(x.trimEnd()) ? k + 1 : 0)).filter(Boolean));
  }

  async function goalFor(code) {
    if (!goals.has(code)) goals.set(code, drawnPaths((await runner.run(code)).cmds));
    return goals.get(code);
  }

  // ---- views ----
  function show(view) {
    $("home").hidden = view !== "home";
    $("work").hidden = view === "home";
    $("lhead").hidden = view === "home" || !LESSONS.length;
    $("lesson").hidden = view !== "lesson";
  }

  function renderHead() {
    if (!cur) {
      $("lTitle").textContent = "Free draw";
      $("lOf").textContent = "";
      return;
    }
    $("lTitle").textContent = cur.title;
    $("lOf").textContent = `Lesson ${index() + 1} of ${LESSONS.length}, ${UNITS[cur.unit] || ""}`;
  }

  // One centered line: Watch - Try - Do. Done steps are green, the current step is bold.
  function renderSteps() {
    $("lSteps").innerHTML = cur.steps.map((st, i) => {
      const cls = i === si ? "now" : stepDone(cur, i) ? "done" : "";
      return (i ? '<span class="sep">-</span>' : "") +
        `<button class="${cls}" data-i="${i}"${i === si ? ' aria-current="step"' : ""}>${stepName(cur, i)}</button>`;
    }).join("");
  }


  function renderStrip() {
    const st = step();
    $("lConcept").textContent = cur.concept || cur.title;
    renderSteps();
    // Prose: the step text, then the task (until all lessons fold the task into the text).
    const prose = [st.text, st.task].filter(Boolean).join("\n\n");
    $("lText").innerHTML = prose.split(/\n\n+/).map((p) => `<p>${md(p)}</p>`).join("");
    const watch = st.kind === "watch";
    $("lLook").hidden = !watch || !st.look;
    $("lLook").innerHTML = md(st.look);
    // More menu: hint, watch the example again, reset.
    $("bMore").hidden = false;
    $("mWatch").hidden = watch || !cur.steps.some((x) => x.kind === "watch");
    $("mReset").hidden = watch;
    $("mReset").textContent = st.kind === "extend" ? "Reset to my code from the last step" : "Reset code";
    hintsShown = 0;
    lastOk = false;
    renderHints();
    setFold(store.get("lt:fold") === "1");
  }

  function renderHints() {
    const hints = step().hints || [];
    $("lHints").innerHTML = hints.slice(0, hintsShown).map((h) => `<div class="hint">${md(h)}</div>`).join("");
    $("mHint").hidden = !hints.length;
    $("mHint").disabled = hintsShown >= hints.length;
    $("mHint").textContent = hintsShown >= hints.length ? "No more hints" : `Hint (${hintsShown + 1} of ${hints.length})`;
  }

  function setFold(folded) {
    $("lBody").hidden = folded;
    $("lFold").textContent = folded ? "show" : "hide";
    store.set("lt:fold", folded ? "1" : "0");
  }

  function badge(text, ok) {
    const b = $("lBadge");
    if (!text) { b.hidden = true; return; }
    b.hidden = false;
    b.className = "badge " + (ok ? "yes" : "no");
    b.textContent = text;
  }

  // The way forward when a run is at its end, for the Next button.
  function forward(stepper) {
    if (!cur) return null;
    const st = step();
    const ready = st.kind === "watch" ? stepper.atEnd() : lastOk;
    if (!ready) return null;
    if (si + 1 < cur.steps.length) {
      const label = st.kind === "watch" ? "Your turn" : `Next: ${stepName(cur, si + 1)}`;
      return { label, go: () => { location.hash = `lesson=${cur.id}&step=${si + 1}`; } };
    }
    const nextLesson = LESSONS[index() + 1];
    if (nextLesson) return { label: "Next lesson", go: () => { location.hash = "lesson=" + nextLesson.id; } };
    return { label: "All lessons", go: () => { location.hash = "home"; } };
  }

  // ---- home ----
  const thumbs = new Map(); // lesson id -> drawn paths of its last solution
  function renderHome() {
    const next = LESSONS.find((l) => !isDone(l));
    const started = LESSONS.some((l) => isDone(l) || l.steps.some((_, i) => stepDone(l, i)));
    const start = $("hStart");
    if (!LESSONS.length) { start.hidden = true; }
    else if (!next) { start.textContent = "All lessons done! Pick one"; start.href = "#lesson=" + LESSONS[0].id; }
    else {
      start.textContent = "Let's Get Started!"; // the human's words; the map shows which lesson is next
      start.href = "#lesson=" + next.id;
    }
    $("hProgress").hidden = !started;
    const byUnit = new Map();
    LESSONS.forEach((l, i) => { if (!byUnit.has(l.unit)) byUnit.set(l.unit, []); byUnit.get(l.unit).push([l, i]); });
    $("hMap").innerHTML = [...byUnit].map(([u, ls]) => `
      <div class="unit"><div class="uname">${u}. ${esc(UNITS[u] || "")}<p class="unote">${md(UNIT_NOTES[u] || "")}</p><small>${ls.length} lesson${ls.length > 1 ? "s" : ""}</small></div>
      <div class="tiles">${ls.map(([l, i]) => `<a class="tile ${isDone(l) ? "done" : l === next ? "next" : ""}" href="#lesson=${esc(l.id)}">` +
        `<canvas data-id="${esc(l.id)}"></canvas><div class="t">${i + 1}. ${esc(l.title)}</div></a>`).join("")}</div></div>`).join("");
    drawThumbs();
  }

  // Snapshot of the tile pictures (tools/make_thumbs.py). An entry is used only if its
  // solution code is the same as in lessons.js; else the tile runs Python.
  const snapshot = fetch(new URL("../lessons/thumbs.json", import.meta.url))
    .then((r) => (r.ok ? r.json() : {})).catch(() => ({}));

  let thumbsBusy = false, thumbsAgain = false;
  async function drawThumbs() {
    if (thumbsBusy) { thumbsAgain = true; return; } // the map was drawn again: redo when done
    thumbsBusy = true;
    const snap = await snapshot;
    const canvases = [...document.querySelectorAll("#hMap canvas[data-id]")];
    // First pass: tiles with a fresh snapshot draw at once, with no Python.
    const later = [];
    for (const cv of canvases) {
      const l = LESSONS.find((x) => x.id === cv.dataset.id);
      const last = [...l.steps].reverse().find((s) => s.solution);
      if (!thumbs.has(l.id)) {
        if (!last) thumbs.set(l.id, []);
        else if (snap[l.id] && snap[l.id].src === last.solution) thumbs.set(l.id, snap[l.id].cmds);
      }
      if (thumbs.has(l.id)) drawThumb(cv, thumbs.get(l.id));
      else later.push([cv, l, last]);
    }
    // Second pass: the rest wait for Python.
    for (const [cv, l, last] of later) {
      if (!thumbs.has(l.id)) thumbs.set(l.id, (await runner.run(last.solution)).cmds);
      if (document.contains(cv)) drawThumb(cv, thumbs.get(l.id));
    }
    thumbsBusy = false;
    if (thumbsAgain) { thumbsAgain = false; drawThumbs(); }
  }

  // A small picture of the goal: real colors, a light grid, and the turtle where it ends.
  function drawThumb(cv, cmds) {
    const r = new Renderer(cv);
    const g = r.g;
    const lines = cmds.filter((c) => (c.op === "move" || c.op === "circle") && c.draw);
    const turtles = [...new Map(cmds.map((c) => [c.after.t, c.after])).values()].filter((t) => t.visible);
    const pts = [...lines.flatMap((c) => c.pts), ...turtles.map((t) => [t.x, t.y])];
    if (!pts.length) pts.push([0, 0]);
    const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
    const cx = (Math.max(...xs) + Math.min(...xs)) / 2, cy = (Math.max(...ys) + Math.min(...ys)) / 2;
    const span = Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys), 40);
    const k = Math.min(2.5, 300 / span);
    g.setTransform(r.dpr, 0, 0, r.dpr, 0, 0);
    g.fillStyle = "#fff";
    g.fillRect(0, 0, 400, 400);
    g.translate(200, 200);
    g.scale(k, -k);
    g.translate(-cx, -cy);
    // light grid every 50 steps, darker axes
    const x0 = cx - 200 / k, x1 = cx + 200 / k, y0 = cy - 200 / k, y1 = cy + 200 / k;
    g.lineWidth = 2 / k;
    g.strokeStyle = "#0000000d";
    g.beginPath();
    for (let v = Math.ceil(x0 / 50) * 50; v <= x1; v += 50) { g.moveTo(v, y0); g.lineTo(v, y1); }
    for (let v = Math.ceil(y0 / 50) * 50; v <= y1; v += 50) { g.moveTo(x0, v); g.lineTo(x1, v); }
    g.stroke();
    g.strokeStyle = "#00000022";
    g.beginPath(); g.moveTo(x0, 0); g.lineTo(x1, 0); g.moveTo(0, y0); g.lineTo(0, y1); g.stroke();
    g.lineCap = "round";
    g.lineJoin = "round";
    for (const c of lines) {
      g.strokeStyle = c.after.color;
      g.lineWidth = Math.max(6, c.after.width * 3) / k;
      r.path(c.pts);
    }
    // The turtle keeps the same size on screen, whatever the zoom.
    for (const t of turtles) {
      g.save();
      g.translate(t.x, t.y);
      g.scale(2.2 / k, 2.2 / k);
      g.translate(-t.x, -t.y);
      const black = /^(black|#000(000)?)$/.test(t.color);
      r.drawTurtle(black ? { ...t, color: "#3f9a63" } : t, false, 1, false);
      g.restore();
    }
  }

  async function progressLink() {
    const text = await encode(collect(store, LESSONS));
    return location.origin + location.pathname + "#p=" + text;
  }

  function homeMsg(text) {
    $("hMsg").hidden = !text;
    $("hMsg").textContent = text || "";
  }

  $("hEmail").onclick = async () => {
    const link = await progressLink();
    const body = `Open this link on the other computer to get your Learn Turtle progress:\n\n${link}\n`;
    location.href = "mailto:?subject=" + encodeURIComponent("My Learn Turtle progress") + "&body=" + encodeURIComponent(body);
    homeMsg("Your mail app opens with the link. If nothing opens, use Copy my progress link.");
  };
  $("hCopy").onclick = async () => {
    const link = await progressLink();
    try {
      await navigator.clipboard.writeText(link);
      homeMsg("Copied! Paste the link in an email or a note to yourself.");
    } catch {
      homeMsg("Copy did not work here. Select this link and copy it: " + link);
    }
  };

  async function loadProgress(text) {
    try {
      const report = merge(store, await decode(text), LESSONS);
      const n = report.done.length, steps = report.code.length;
      const parts = [];
      if (n) parts.push(`${n} lesson${n === 1 ? "" : "s"} done`);
      if (steps) parts.push(`your code for ${steps} step${steps === 1 ? "" : "s"}`);
      homeMsg(parts.length ? `Loaded your progress: ${parts.join(", and ")}.` : "This computer already has all of that progress.");
    } catch (e) {
      homeMsg(e.message);
    }
    history.replaceState(null, "", location.pathname + location.search + "#home");
  }

  // ---- open a step ----
  async function openStep(l, i) {
    saveNow();
    cur = l;
    si = Math.max(0, Math.min(l.steps.length - 1, i || 0));
    goal = null;
    renderer.goal = null;
    renderer.missing = null;
    badge(null);
    const st = step();
    editor.setReadOnly(st.kind === "watch");
    editor.setValue(st.kind === "watch" ? st.code : store.get(codeKey()) ?? startFor(l, si));
    markChanged();
    show("lesson");
    renderHead();
    renderStrip();
    forget();
    if (st.solution) {
      const want = `${l.id}:${si}`;
      const g = await goalFor(st.solution);
      if (want !== `${cur?.id}:${si}`) return;
      goal = renderer.goal = g;
      forget();
    }
  }

  function openFree() {
    saveNow();
    cur = null;
    goal = renderer.goal = renderer.missing = null;
    badge(null);
    editor.setReadOnly(false);
    editor.setChanged([]);
    $("bMore").hidden = true;
    editor.setValue(store.get(codeKey()) ?? freeStarter);
    show("free");
    renderHead();
    forget();
  }

  function openHome() {
    saveNow();
    cur = null;
    editor.setReadOnly(false);
    show("home");
    renderHome();
  }

  async function route() {
    const h = location.hash;
    const p = h.match(/^#p=([\w-]+)/);
    if (p) { await loadProgress(p[1]); return openHome(); }
    const m = h.match(/lesson=([\w-]*)(?:&step=(\d+))?/);
    if (m) {
      const l = LESSONS.find((x) => x.id === m[1]) || LESSONS.find((x) => !isDone(x)) || LESSONS[0];
      // A lesson always opens at its first step (Watch). The human asked for this: Watch first, every time.
      if (l) return openStep(l, m[2] ? +m[2] : 0);
    }
    if (h === "#free" || !LESSONS.length) return openFree();
    openHome();
  }



  window.addEventListener("hashchange", () => { homeMsg(""); route(); });
  $("lSteps").onclick = (e) => {
    const b = e.target.closest("button");
    if (b) location.hash = `lesson=${cur.id}&step=${b.dataset.i}`;
  };
  $("lFold").onclick = () => setFold(!$("lBody").hidden);
  // More menu
  const closeMore = () => { $("morePop").hidden = true; $("bMore").setAttribute("aria-expanded", "false"); };
  $("bMore").onclick = () => {
    const open = $("morePop").hidden;
    $("morePop").hidden = !open;
    $("bMore").setAttribute("aria-expanded", open);
  };
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMore(); });
  document.addEventListener("click", (e) => { if (!e.target.closest("#bMore, #morePop")) closeMore(); });
  $("mHint").onclick = () => { hintsShown++; renderHints(); closeMore(); };
  $("mWatch").onclick = () => {
    closeMore();
    const w = cur.steps.findIndex((x) => x.kind === "watch");
    location.hash = `lesson=${cur.id}&step=${w}`;
  };
  let resetArmed = false;
  $("mReset").onclick = () => {
    // Two clicks, so a child does not lose code by mistake. No browser dialog.
    if (!resetArmed) {
      resetArmed = true;
      $("mReset").textContent = "Sure? Click again";
      setTimeout(() => { resetArmed = false; renderStrip(); }, 3000);
      return;
    }
    resetArmed = false;
    closeMore();
    editor.setValue(startFor(cur, si));
    renderStrip();
  };

  await route();

  // Called by the app before each draw.
  function hook(stepper) {
    renderer.missing = null;
    if (!cur || !stepper) { badge(null); return; }
    const st = step();
    if (st.kind === "watch") {
      if (stepper.atEnd() && !stepDone(cur, si)) { store.set(`lt:done:${cur.id}:${si}`, "1"); renderSteps(); }
      return;
    }
    lastOk = false;
    if (!goal || !stepper.atEnd() || stepper.rec.error) { badge(null); return; }
    const r = compare(goal, drawnPaths(stepper.rec.cmds));
    lastOk = r.ok;
    if (!r.ok) renderer.missing = r.missing;
    if (r.ok && !stepDone(cur, si)) {
      store.set(`lt:done:${cur.id}:${si}`, "1");
      if (cur.steps.every((x, k) => x.kind === "watch" || stepDone(cur, k))) store.set("lt:done:" + cur.id, "1");
      renderSteps();
    }
    badge(r.ok ? "It matches!" : verdict(r), r.ok);
  }

  return { hook, next: forward };
}
