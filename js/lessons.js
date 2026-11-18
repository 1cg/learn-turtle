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
// Short lesson text: `code` becomes <code>. Nothing else.
const md = (s) => esc(s).replace(/`([^`]+)`/g, "<code>$1</code>");
const $ = (id) => document.getElementById(id);

const UNITS = { 1: "Steps", 2: "Errors", 3: "Comments", 4: "Variables", 5: "Types", 6: "Loops", 7: "Functions",
  8: "If", 9: "While", 10: "Lists", 11: "Objects", 12: "Projects" };
const KIND = { watch: "Watch", try: "Try", extend: "Extend" };

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
  let seenMax = -1;    // furthest debugger step seen in a watch step
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

  function renderSteps() {
    $("lSteps").innerHTML = cur.steps.map((st, i) => {
      const cls = i === si ? "now" : stepDone(cur, i) ? "done" : "";
      const n = stepDone(cur, i) && i !== si ? "&#10003;" : i + 1;
      return (i ? '<span class="line"></span>' : "") +
        `<button class="${cls}" data-i="${i}"><span class="n">${n}</span>${KIND[st.kind] || st.kind}</button>`;
    }).join("");
  }

  function renderStrip() {
    const st = step();
    $("lConcept").textContent = cur.concept || cur.title;
    renderSteps();
    $("lText").innerHTML = md(st.text);
    const watch = st.kind === "watch";
    $("lLook").hidden = !watch || !st.look;
    $("lLook").innerHTML = md(st.look);
    $("lTask").hidden = watch;
    $("lTask").innerHTML = "<b>Task:</b> " + md(st.task);
    $("lSeen").hidden = !watch;
    $("lTurn").hidden = !watch || si + 1 >= cur.steps.length;
    $("lWatch").hidden = watch || !cur.steps.some((x) => x.kind === "watch");
    $("lReset").hidden = watch;
    $("lReset").textContent = st.kind === "extend" ? "Reset to my last step" : "Reset code";
    hintsShown = 0;
    renderHints();
    renderSeen();
    setFold(store.get("lt:fold") === "1");
  }

  function renderHints() {
    const hints = step().hints || [];
    $("lHints").innerHTML = hints.slice(0, hintsShown).map((h) => `<div class="hint">${md(h)}</div>`).join("");
    $("lHint").hidden = !hints.length;
    $("lHint").disabled = hintsShown >= hints.length;
    $("lHint").textContent = hintsShown >= hints.length ? "No more hints" : `Hint (${hintsShown + 1} of ${hints.length})`;
  }

  function renderSeen(stepper) {
    if (!cur || step().kind !== "watch") return;
    const total = stepper ? stepper.steps.length : 0;
    const seen = Math.max(0, seenMax + 1);
    $("lSeen").textContent = total ? `seen ${Math.min(seen, total)} of ${total} steps` : "Press Next to start";
    $("lTurn").disabled = !(stepDone(cur, si));
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
    let next = "";
    if (ok && si + 1 < cur.steps.length) next = ` <a href="#lesson=${esc(cur.id)}&step=${si + 1}">Next: ${KIND[cur.steps[si + 1].kind]}</a>`;
    else if (ok && LESSONS[index() + 1]) next = ` <a href="#lesson=${esc(LESSONS[index() + 1].id)}">Next lesson: ${esc(LESSONS[index() + 1].title)}</a>`;
    else if (ok) next = ' <a href="#home">All lessons</a>';
    b.innerHTML = esc(text) + next;
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
      start.textContent = started ? `Go on: Lesson ${LESSONS.indexOf(next) + 1}, ${next.title}` : "Start lesson 1";
      start.href = "#lesson=" + next.id;
    }
    $("hProgress").hidden = !started;
    const byUnit = new Map();
    LESSONS.forEach((l, i) => { if (!byUnit.has(l.unit)) byUnit.set(l.unit, []); byUnit.get(l.unit).push([l, i]); });
    $("hMap").innerHTML = [...byUnit].map(([u, ls]) => `
      <div class="unit"><div class="uname">${u}. ${esc(UNITS[u] || "")}<small>${ls.length} lesson${ls.length > 1 ? "s" : ""}</small></div>
      <div class="tiles">${ls.map(([l, i]) => `<a class="tile ${isDone(l) ? "done" : l === next ? "next" : ""}" href="#lesson=${esc(l.id)}">` +
        `<canvas data-id="${esc(l.id)}"></canvas><div class="t">${i + 1}. ${esc(l.title)}</div></a>`).join("")}</div></div>`).join("");
    drawThumbs();
  }

  let thumbsBusy = false;
  async function drawThumbs() {
    if (thumbsBusy) return;
    thumbsBusy = true;
    for (const cv of document.querySelectorAll("#hMap canvas[data-id]")) {
      const l = LESSONS.find((x) => x.id === cv.dataset.id);
      if (!thumbs.has(l.id)) {
        const last = [...l.steps].reverse().find((s) => s.solution);
        thumbs.set(l.id, last ? await goalFor(last.solution) : []);
      }
      if (!document.contains(cv)) continue;
      drawThumb(cv, thumbs.get(l.id));
    }
    thumbsBusy = false;
  }

  // Fit the drawing in a small canvas: no grid, no turtle.
  function drawThumb(cv, paths) {
    const r = new Renderer(cv);
    r.grid = false;
    const pts = paths.flat();
    if (!pts.length) return r.draw([], 0, { noDefault: true });
    const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
    const cx = (Math.max(...xs) + Math.min(...xs)) / 2, cy = (Math.max(...ys) + Math.min(...ys)) / 2;
    const k = Math.min(3, 330 / Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys), 1));
    const after = { t: 0, x: 0, y: 0, h: 0, pen: true, color: "#1d2330", fill: "#1d2330", width: 7, visible: false };
    r.draw(paths.map((p) => ({ op: "move", draw: true, pts: p.map(([x, y]) => [(x - cx) * k, (y - cy) * k]), after })), paths.length, { noDefault: true });
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
    seenMax = -1;
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
      if (l) return openStep(l, m[2] ? +m[2] : firstOpen(l));
    }
    if (h === "#free" || !LESSONS.length) return openFree();
    openHome();
  }

  // The first step that is not done yet (or the last step).
  function firstOpen(l) {
    const i = l.steps.findIndex((_, k) => !stepDone(l, k));
    return i < 0 ? l.steps.length - 1 : i;
  }

  window.addEventListener("hashchange", () => { homeMsg(""); route(); });
  $("lSteps").onclick = (e) => {
    const b = e.target.closest("button");
    if (b) location.hash = `lesson=${cur.id}&step=${b.dataset.i}`;
  };
  $("lFold").onclick = () => setFold(!$("lBody").hidden);
  $("lHint").onclick = () => { hintsShown++; renderHints(); };
  $("lTurn").onclick = () => { location.hash = `lesson=${cur.id}&step=${si + 1}`; };
  $("lWatch").onclick = () => {
    const w = cur.steps.findIndex((x) => x.kind === "watch");
    location.hash = `lesson=${cur.id}&step=${w}`;
  };
  let resetArmed = false;
  $("lReset").onclick = () => {
    // Two clicks, so a child does not lose code by mistake. No browser dialog.
    if (!resetArmed) {
      resetArmed = true;
      $("lReset").textContent = "Sure? Click again";
      setTimeout(() => { resetArmed = false; renderStrip(); }, 3000);
      return;
    }
    resetArmed = false;
    editor.setValue(startFor(cur, si));
    renderStrip();
  };

  await route();

  // Called by the app before each draw.
  return function lessonHook(stepper) {
    renderer.missing = null;
    if (!cur || !stepper) { badge(null); return; }
    const st = step();
    if (st.kind === "watch") {
      seenMax = Math.max(seenMax, stepper.pos);
      if (stepper.atEnd() && !stepDone(cur, si)) { store.set(`lt:done:${cur.id}:${si}`, "1"); renderSteps(); }
      renderSeen(stepper);
      return;
    }
    if (!goal || !stepper.atEnd() || stepper.rec.error) { badge(null); return; }
    const r = compare(goal, drawnPaths(stepper.rec.cmds));
    if (!r.ok) renderer.missing = r.missing;
    if (r.ok && !stepDone(cur, si)) {
      store.set(`lt:done:${cur.id}:${si}`, "1");
      if (cur.steps.every((x, k) => x.kind === "watch" || stepDone(cur, k))) store.set("lt:done:" + cur.id, "1");
      renderSteps();
    }
    badge(verdict(r), r.ok);
  };
}
