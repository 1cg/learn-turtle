import { Runner } from "./runner.js";
import { Renderer } from "./renderer.js";

const $ = (id) => document.getElementById(id);
const STARTER = `# Draw a square
for i in range(4):
    forward(100)
    left(90)
`;

const editor = $("editor");
editor.value = STARTER;
const renderer = new Renderer($("cv"));
renderer.draw([], 0);

let rec = null;   // last recording
let shown = 0;    // commands drawn so far
let anim = null;

const runner = new Runner((s, msg) => {
  $("status").textContent = { loading: "Loading Python...", ready: "Ready", running: "Running...", error: "Python failed to load: " + msg }[s] || s;
  $("bRun").disabled = s === "loading" || s === "error";
});

function stopAnim() {
  if (anim) cancelAnimationFrame(anim);
  anim = null;
  $("bStop").disabled = true;
}

function showError(err) {
  const box = $("error");
  if (!err) { box.hidden = true; return; }
  box.hidden = false;
  box.textContent = (err.line ? `Line ${err.line}: ` : "") + `${err.type}: ${err.msg}`;
}

// Play the drawing: more commands per frame when the speed is high.
function play() {
  stopAnim();
  $("bStop").disabled = false;
  shown = 0;
  let acc = 0;
  const frame = () => {
    const v = +$("speed").value;
    acc += v >= 10 ? Infinity : Math.pow(1.6, v) / 12;
    const n = Math.floor(acc);
    if (n > 0) { shown = Math.min(rec.cmds.length, shown + n); acc -= n; }
    renderer.draw(rec.cmds, shown);
    if (shown < rec.cmds.length) anim = requestAnimationFrame(frame);
    else { stopAnim(); showError(rec.error); }
  };
  frame();
}

$("bRun").onclick = async () => {
  stopAnim();
  showError(null);
  $("outBox").hidden = true;
  rec = await runner.run(editor.value);
  $("out").textContent = rec.out;
  $("outBox").hidden = !rec.out;
  if (rec.cmds.length) play();
  else showError(rec.error);
};

$("bStop").onclick = () => {
  stopAnim();
  if (rec) renderer.draw(rec.cmds, shown);
};

$("grid").onchange = (e) => {
  renderer.grid = e.target.checked;
  renderer.draw(rec ? rec.cmds : [], rec ? shown : 0);
};

$("cv").onmousemove = (e) => {
  const p = renderer.toWorld(e);
  $("coords").textContent = `x ${p.x}, y ${p.y}`;
};
$("cv").onmouseleave = () => { $("coords").textContent = ""; };

editor.addEventListener("keydown", (e) => {
  if (e.key === "Tab") {
    e.preventDefault();
    editor.setRangeText("    ", editor.selectionStart, editor.selectionEnd, "end");
  }
  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) $("bRun").click();
});
