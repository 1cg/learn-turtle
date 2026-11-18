// Progress link: pure functions, no DOM. Intent: src/md/features/lessons.md (Progress link).
// storage: an object with get(key) and set(key, value), as `store` in js/lessons.js.

const doneKey = (id) => "lt:done:" + id;
const codeKey = (id) => "lt:code:" + id;

// True when the code is empty or only the starter of the lesson.
function isBlank(code, lesson) {
  return code == null || code.trim() === "" || code.trim() === (lesson.starter || "").trim();
}

export function collect(storage, lessons) {
  const progress = { v: 1, done: [], code: {} };
  for (const l of lessons) {
    if (storage.get(doneKey(l.id)) === "1") progress.done.push(l.id);
    const code = storage.get(codeKey(l.id));
    if (!isBlank(code, l)) progress.code[l.id] = code;
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
  const ok = p && p.v === 1 && Array.isArray(p.done) && p.code && typeof p.code === "object" && !Array.isArray(p.code)
    && p.done.every((id) => typeof id === "string")
    && Object.values(p.code).every((c) => typeof c === "string");
  if (!ok) throw new Error("The progress link has data this site does not know. Make a new link on the old computer.");
  return { v: 1, done: p.done, code: p.code };
}

export function merge(storage, progress, lessons) {
  const report = { done: [], code: [] };
  const byId = new Map(lessons.map((l) => [l.id, l]));
  for (const id of progress.done) {
    if (!byId.has(id) || storage.get(doneKey(id)) === "1") continue;
    storage.set(doneKey(id), "1");
    report.done.push(id);
  }
  for (const [id, code] of Object.entries(progress.code)) {
    const lesson = byId.get(id);
    if (!lesson || isBlank(code, lesson)) continue;
    if (!isBlank(storage.get(codeKey(id)), lesson)) continue;
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
