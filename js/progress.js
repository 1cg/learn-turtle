// Progress link: pure functions, no DOM. Intent: src/md/features/lessons.md (Progress link).
// storage: an object with get(key) and set(key, value), as `store` in js/lessons.js.

const doneKey = (id) => "lt:done:" + id;
const codeKey = (id) => "lt:code:" + id;

// Start code of a step, the same rule as js/lessons.js: watch shows its code,
// try starts from the watch code, extend starts from the solution of the step before.
export function startCode(lesson, i) {
  const st = lesson.steps[i];
  if (st.kind === "watch") return st.code || "";
  if (st.kind === "try") return st.starter ?? (lesson.steps.find((x) => x.kind === "watch")?.code || "");
  return lesson.steps[i - 1]?.solution || "";
}

// Ids for progress: the lesson id, and "<id>:<step>" for each step that has code.
function stepIds(lesson) {
  return lesson.steps.map((st, i) => ({ id: lesson.id + ":" + i, i, watch: st.kind === "watch" }));
}

// True when the code is empty or only the start code of the step.
function isBlank(code, lesson, i) {
  return code == null || code.trim() === "" || code.trim() === startCode(lesson, i).trim();
}

export function collect(storage, lessons) {
  const progress = { v: 2, done: [], code: {} };
  for (const l of lessons) {
    if (storage.get(doneKey(l.id)) === "1") progress.done.push(l.id);
    for (const s of stepIds(l)) {
      if (storage.get(doneKey(s.id)) === "1") progress.done.push(s.id);
      if (s.watch) continue;
      const code = storage.get(codeKey(s.id));
      if (!isBlank(code, l, s.i)) progress.code[s.id] = code;
    }
  }
  return progress;
}

export async function encode(progress) {
  const bytes = new TextEncoder().encode(JSON.stringify(progress));
  const packed = await pipe(bytes, new CompressionStream("deflate-raw"));
  return toBase64url(packed);
}

export async function decode(text) {
  let bytes;
  try {
    bytes = fromBase64url(String(text).trim());
  } catch {
    throw new Error("The progress link is broken: it has letters that do not belong. Copy the full link again.");
  }
  let json;
  try {
    json = new TextDecoder().decode(await pipe(bytes, new DecompressionStream("deflate-raw")));
  } catch {
    throw new Error("The progress link is broken or cut short. Copy the full link again.");
  }
  let p;
  try { p = JSON.parse(json); } catch { p = null; }
  const ok = p && (p.v === 1 || p.v === 2) && Array.isArray(p.done) && p.code && typeof p.code === "object" && !Array.isArray(p.code)
    && p.done.every((id) => typeof id === "string")
    && Object.values(p.code).every((c) => typeof c === "string");
  if (!ok) throw new Error("The progress link has data this site does not know. Make a new link on the old computer.");
  return { v: p.v, done: p.done, code: p.code };
}

export function merge(storage, progress, lessons) {
  const report = { done: [], code: [] };
  const known = new Map();
  for (const l of lessons) {
    known.set(l.id, { l, i: -1 });
    l.steps.forEach((_, i) => known.set(l.id + ":" + i, { l, i }));
  }
  for (const id of progress.done) {
    if (!known.has(id) || storage.get(doneKey(id)) === "1") continue;
    storage.set(doneKey(id), "1");
    if (known.get(id).i < 0) report.done.push(id);
  }
  for (const [id, code] of Object.entries(progress.code)) {
    const k = known.get(id);
    if (!k || k.i < 0 || isBlank(code, k.l, k.i)) continue;
    if (!isBlank(storage.get(codeKey(id)), k.l, k.i)) continue;
    storage.set(codeKey(id), code);
    report.code.push(id);
  }
  return report;
}

// ---- helpers ----
async function pipe(bytes, stream) {
  const out = new Response(new Blob([bytes]).stream().pipeThrough(stream));
  return new Uint8Array(await out.arrayBuffer());
}

function toBase64url(bytes) {
  let bin = "";
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64url(text) {
  if (!/^[A-Za-z0-9_-]*$/.test(text)) throw new Error("bad base64url");
  const b64 = text.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((text.length + 3) % 4);
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}
