// Web Worker: loads Pyodide, runs kid code with the tracer, posts the recording.
const PYODIDE_URL = "https://cdn.jsdelivr.net/pyodide/v0.29.5/full/";
importScripts(PYODIDE_URL + "pyodide.js");

let py = null;

async function boot() {
  py = await loadPyodide({ indexURL: PYODIDE_URL });
  const base = new URL("../py/", self.location.href);
  for (const name of ["turtle.py", "tracer.py"]) {
    const src = await (await fetch(new URL(name, base))).text();
    py.FS.writeFile("/home/pyodide/" + name, src);
  }
  py.runPython("import sys; sys.path.insert(0, '/home/pyodide'); import tracer");
  postMessage({ type: "ready" });
}

const booting = boot().catch((e) => postMessage({ type: "fatal", msg: String(e) }));

self.onmessage = async (ev) => {
  const msg = ev.data;
  if (msg.type !== "run") return;
  await booting;
  const run = py.globals.get("tracer").run;
  try {
    const json = run(msg.code);
    postMessage({ type: "result", id: msg.id, result: JSON.parse(json) });
  } catch (e) {
    postMessage({ type: "result", id: msg.id,
      result: { steps: [], cmds: [], out: "", error: { type: "InternalError", msg: String(e), line: 0 } } });
  }
};
