import { Runner } from "./runner.js";
import { Renderer, turtlesAt } from "./renderer.js";
import { createEditor } from "./editor.js";
import { Stepper, framesHTML, chipsHTML } from "./debugger.js";

const $ = (id) => document.getElementById(id);
const STARTER = `# Draw a square
for i in range(4):
    forward(100)
    left(90)
`;
const PLAY_ICON = "M8 5v14l11-7z";
const PAUSE_ICON = "M7 5h4v14H7zM13 5h4v14h-4z";

const editor = await createEditor($("editor"), STARTER);
const renderer = new Renderer($("cv"));

let stepper = null;     // recording of the current code, or null after an edit
let recording = null;   // promise while Python runs
let timer = null;
let explain = true;
let prevBoxes = {};
let pythonReady = false;

const runner = new Runner((s, msg) => {
  pythonReady = s === "ready" || s === "running";
  $("status").textContent = { loading: "Loading Python...", ready: "Ready", running: "Running...", error: "Python failed to load: " + msg }[s] || s;
  updateButtons();
});

// ---- recording ----
async function ensureRecording() {
  if (stepper) return stepper;
  if (!recording) {
    recording = runner.run(editor.getValue()).then((rec) => {
      recording = null;
      stepper = new Stepper(rec);
      prevBoxes = {};
      return stepper;
    });
  }
  return recording;
}

function forget() {
  pause();
  stepper = null;
  editor.clearLines();
  editor.clearError();
  showError(null);
  renderer.draw([], 0);
  $("frames").innerHTML = '<span class="empty">no boxes yet</span>';
  $("turtles").innerHTML = "";
  $("outBox").hidden = true;
  updateButtons();
}

// ---- view ----
function showError(err) {
  const box = $("error");
  editor.clearError();
  if (!err) { box.hidden = true; return; }
  box.hidden = false;
  box.textContent = (err.line ? `Line ${err.line}: ` : "") + `${err.type}: ${err.msg}`;
  if (err.line) editor.showError(err.line, err.msg);
}

function render() {
  if (!stepper) return;
  const v = stepper.view();
  const cmds = stepper.rec.cmds;
  editor.setLines({ ran: v.ran, next: stepper.atEnd() ? 0 : v.next, ghost: explain ? v.say : "" });
  const made = v.made;
  renderer.draw(cmds, v.cmdN, {
    highlight: made && (made.op === "move" || made.op === "circle") ? v.cmdN - 1 : undefined,
    ghost: timer ? null : v.ghost,
    active: made ? made.after.t : undefined,
    turn: made && made.op === "turn" ? made : null,
  });
  const boxes = framesHTML(v.frames, v.pos < 0 ? {} : prevBoxes);
  $("frames").innerHTML = boxes.html;
  prevBoxes = boxes.now;
  $("turtles").innerHTML = chipsHTML(turtlesAt(cmds, Math.max(v.cmdN, 1)), made ? made.after.t : -1);
  $("out").textContent = v.out;
  $("outBox").hidden = !v.out;
  // A syntax error has no steps: show it at once.
  showError(v.error || (stepper.steps.length === 0 ? stepper.rec.error : null));
  updateButtons();
}

function updateButtons() {
  const has = !!stepper;
  const atStart = !has || stepper.pos < 0;
  const atEnd = has && stepper.atEnd();
  $("bStart").disabled = atStart;
  $("bBack").disabled = atStart;
  $("bNext").disabled = !pythonReady || atEnd;
  $("bSkip").disabled = !pythonReady || atEnd || (has && !stepper.canSkip());
  $("bToStop").disabled = !pythonReady || atEnd || editor.getStops().length === 0;
  $("bPlay").disabled = !pythonReady;
  $("bPlay").querySelector("path").setAttribute("d", timer ? PAUSE_ICON : PLAY_ICON);
}

// ---- actions ----
function pause() {
  clearInterval(timer);
  timer = null;
  updateButtons();
}

async function act(fn) {
  pause();
  const s = await ensureRecording();
  fn(s);
  render();
}

async function play() {
  if (timer) { pause(); render(); return; }
  const s = await ensureRecording();
  if (s.atEnd()) { s.go(-1); prevBoxes = {}; }
  const stops = () => new Set(editor.getStops());
  const tick = () => {
    if (s.atEnd()) { pause(); render(); return; }
    s.next();
    render();
    if (s.atEnd() || s.isStopNext(stops())) { pause(); render(); }
  };
  timer = setInterval(tick, 600 / +$("speed").value);
  tick();
}

$("bNext").onclick = () => act((s) => s.next());
$("bBack").onclick = () => act((s) => s.back());
$("bStart").onclick = () => act((s) => { s.go(-1); prevBoxes = {}; });
$("bSkip").onclick = () => act((s) => s.skip());
$("bToStop").onclick = () => act((s) => s.toStop(new Set(editor.getStops())));
$("bPlay").onclick = play;
editor.onRunKey(play);
$("speed").onchange = () => { if (timer) { pause(); play(); } };
$("bExplain").onclick = (e) => {
  explain = !explain;
  e.currentTarget.setAttribute("aria-pressed", explain);
  render();
};

editor.onChange(forget);
editor.onStopsChange = updateButtons;

document.addEventListener("keydown", (e) => {
  if (document.activeElement && document.activeElement.closest(".monaco-editor")) return;
  if (e.key === "ArrowRight") $("bNext").click();
  if (e.key === "ArrowLeft") $("bBack").click();
});

$("grid").onchange = (e) => {
  renderer.grid = e.target.checked;
  if (stepper) render(); else renderer.draw([], 0);
};
$("cv").onmousemove = (e) => {
  const p = renderer.toWorld(e);
  $("coords").textContent = `x ${p.x}, y ${p.y}`;
};
$("cv").onmouseleave = () => { $("coords").textContent = ""; };

window.learnTurtle = { editor, get stepper() { return stepper; } };
forget();
