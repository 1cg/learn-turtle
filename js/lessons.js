// Lesson track: header nav, lesson strip above the code, goal drawing, check, progress.
// The page markup is made here, because index.html is on another card now (see card-14).
import { drawnPaths, compare, verdict } from "./check.js";

const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch { /* private mode: no saving */ } },
};
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
// Short lesson text: `code` becomes <code>. Nothing else.
const md = (s) => esc(s).replace(/`([^`]+)`/g, "<code>$1</code>");
const $ = (id) => document.getElementById(id);

export async function initLessons({ editor, runner, renderer, play, forget, freeStarter }) {
  const fixture = new URLSearchParams(location.search).has("fixture");
  let LESSONS = [];
  try {
    LESSONS = (await import(fixture ? "../test/lessons-fixture.js" : "../lessons/lessons.js")).LESSONS || [];
  } catch {
    LESSONS = []; // no lessons yet: free draw only
  }

  // ---- markup ----
  document.querySelector("header h1").insertAdjacentHTML("afterend", `
    <div class="lnav" id="lnav" hidden>
      <button id="lPrev" title="Last lesson"><svg viewBox="0 0 24 24"><path d="M16 5v14L5 12z" fill="currentColor"/></svg></button>
      <span class="ltitle" id="lTitle"></span>
      <button id="lNext" title="Next lesson"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="currentColor"/></svg></button>
      <span class="dots" id="lDots"></span>
    </div>`);
  $("status").insertAdjacentHTML("afterend", '<a class="modelink" id="modeLink" href="#"></a>');
  document.querySelector(".codepanel").insertAdjacentHTML("beforebegin", `
    <div class="panel lesson" id="lesson" hidden>
      <h2><span id="lConcept"></span><span class="fold" id="lFold">hide</span></h2>
      <div class="lbody" id="lBody">
        <p id="lText"></p>
        <div class="task" id="lTask"></div>
        <div class="acts">
          <button id="lHint">Hint</button>
          <button id="lExample">Watch an example</button>
          <button id="lReset">Reset code</button>
        </div>
        <div class="hints" id="lHints"></div>
      </div>
    </div>`);
  document.querySelector(".canvasbar").insertAdjacentHTML("afterend", '<div class="badge" id="lBadge" hidden></div>');

  // ---- state ----
  let cur = null;          // current lesson, or null in free draw
  let goal = null;         // goal polylines of the current lesson
  let mine = null;         // the child's code while an example shows
  let hintsShown = 0;
  const goals = new Map();
  const codeKey = () => "lt:code:" + (cur ? cur.id : "free");
  const isDone = (l) => store.get("lt:done:" + l.id) === "1";
  const index = () => LESSONS.indexOf(cur);

  let saveTimer = null;
  editor.onChange(() => {
    if (mine !== null) return; // do not save the example over the child's code
    clearTimeout(saveTimer);
    const key = codeKey(), value = editor.getValue();
    saveTimer = setTimeout(() => store.set(key, value), 300);
  });

  async function goalFor(l) {
    if (!goals.has(l.id)) {
      const rec = await runner.run(l.solution);
      goals.set(l.id, drawnPaths(rec.cmds));
    }
    return goals.get(l.id);
  }

  // ---- views ----
  function renderNav() {
    $("lnav").hidden = !cur;
    $("modeLink").hidden = !LESSONS.length;
    if (!cur) {
      const next = LESSONS.find((l) => !isDone(l)) || LESSONS[0];
      $("modeLink").textContent = "Lessons";
      $("modeLink").href = next ? "#lesson=" + next.id : "#";
      return;
    }
    $("modeLink").textContent = "Free draw";
    $("modeLink").href = "#";
    const i = index();
    $("lTitle").textContent = `${i + 1}. ${cur.title}`;
    $("lPrev").disabled = i <= 0;
    $("lNext").disabled = i >= LESSONS.length - 1;
    $("lDots").innerHTML = LESSONS.map((l, k) =>
      `<a href="#lesson=${esc(l.id)}" class="${l === cur ? "now" : isDone(l) ? "done" : ""}" title="${k + 1}. ${esc(l.title)}"></a>`).join("");
  }

  function renderStrip() {
    $("lesson").hidden = !cur;
    if (!cur) return;
    $("lConcept").textContent = cur.concept || cur.title;
    $("lText").innerHTML = md(cur.text);
    $("lTask").innerHTML = "<b>Task:</b> " + md(cur.task);
    hintsShown = 0;
    renderHints();
    $("lExample").hidden = !cur.example;
    $("lExample").textContent = "Watch an example";
    setFold(store.get("lt:fold") === "1");
  }

  function renderHints() {
    const hints = cur.hints || [];
    $("lHints").innerHTML = hints.slice(0, hintsShown).map((h) => `<div class="hint">${md(h)}</div>`).join("");
    $("lHint").hidden = !hints.length;
    $("lHint").disabled = hintsShown >= hints.length;
    $("lHint").textContent = hintsShown >= hints.length ? "No more hints" : `Hint (${hintsShown + 1} of ${hints.length})`;
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
    const next = LESSONS[index() + 1];
    b.innerHTML = esc(text) + (ok && next ? ` <a href="#lesson=${esc(next.id)}">Next: ${esc(next.title)}</a>` : "");
  }

  // ---- example mode ----
  function leaveExample() {
    if (mine === null) return;
    const code = mine;
    mine = null;
    editor.editor.updateOptions({ readOnly: false });
    editor.setValue(code);
    renderer.goal = goal;
    $("lExample").textContent = "Watch an example";
    forget();
  }

  function showExample() {
    if (mine !== null) return leaveExample();
    mine = editor.getValue();
    editor.setValue(cur.example);
    editor.editor.updateOptions({ readOnly: true });
    renderer.goal = null;
    $("lExample").textContent = "Back to my code";
    play();
  }

  // ---- open a lesson ----
  async function open(id) {
    leaveExample();
    clearTimeout(saveTimer);
    store.set(codeKey(), editor.getValue());
    cur = LESSONS.find((l) => l.id === id) || null;
    goal = null;
    renderer.goal = null;
    renderer.missing = null;
    badge(null);
    editor.setValue(store.get(codeKey()) ?? (cur ? cur.starter : freeStarter));
    renderNav();
    renderStrip();
    forget();
    if (cur) {
      const want = cur;
      const g = await goalFor(cur);
      if (cur !== want) return;
      goal = renderer.goal = g;
      forget();
    }
  }

  const route = () => open((location.hash.match(/lesson=([\w-]+)/) || [])[1]);
  window.addEventListener("hashchange", route);
  $("lPrev").onclick = () => { location.hash = "lesson=" + LESSONS[index() - 1].id; };
  $("lNext").onclick = () => { location.hash = "lesson=" + LESSONS[index() + 1].id; };
  $("lFold").onclick = () => setFold(!$("lBody").hidden);
  $("lHint").onclick = () => { hintsShown++; renderHints(); };
  $("lExample").onclick = showExample;
  let resetArmed = false;
  $("lReset").onclick = () => {
    // Two clicks, so a child does not lose code by mistake. No browser dialog.
    if (!resetArmed) {
      resetArmed = true;
      $("lReset").textContent = "Sure? Click again";
      setTimeout(() => { resetArmed = false; $("lReset").textContent = "Reset code"; }, 3000);
      return;
    }
    resetArmed = false;
    $("lReset").textContent = "Reset code";
    leaveExample();
    editor.setValue(cur.starter);
  };

  await route();

  // Called by the app before each draw.
  return function lessonHook(stepper) {
    renderer.missing = null;
    if (!cur || !goal || mine !== null || !stepper || !stepper.atEnd() || stepper.rec.error) {
      badge(null);
      return;
    }
    const r = compare(goal, drawnPaths(stepper.rec.cmds));
    if (!r.ok) renderer.missing = r.missing;
    if (r.ok && !isDone(cur)) { store.set("lt:done:" + cur.id, "1"); renderNav(); }
    badge(verdict(r) + (r.ok ? ` Lesson ${index() + 1} is done.` : ""), r.ok);
  };
}
