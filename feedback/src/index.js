// Feedback endpoint. Intent: src/md/features/feedback.md
const LIMITS = { text: 2000, code: 50000, contact: 200, page: 500 };
const MAX_BODY = 64 * 1024;
const LOCAL_ORIGIN = /^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?$/;

export default {
  async fetch(request, env) {
    const cors = corsHeaders(request);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (request.method !== "POST") return reply(405, { error: "Use POST." }, cors);

    const ip = request.headers.get("CF-Connecting-IP") || "unknown";
    if (env.LIMITER) {
      const { success } = await env.LIMITER.limit({ key: ip });
      if (!success) return reply(429, { error: "Too many notes. Wait one minute." }, cors);
    }

    const size = Number(request.headers.get("Content-Length") || 0);
    if (size > MAX_BODY) return reply(413, { error: "The note is too large." }, cors);
    const raw = await request.text();
    if (raw.length > MAX_BODY) return reply(413, { error: "The note is too large." }, cors);

    let body;
    try { body = JSON.parse(raw); } catch { return reply(400, { error: "The body is not JSON." }, cors); }
    const result = clean(body);
    if (result.error) return reply(400, { error: result.error }, cors);
    if (result.bot) return reply(200, { ok: true }, cors);

    const note = { ...result.note, time: new Date().toISOString(), country: request.cf?.country || "" };
    await store(env, note);
    return reply(200, { ok: true }, cors);
  },
};

export function clean(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) return { error: "The body must be a JSON object." };
  if (typeof body.website === "string" && body.website !== "") return { bot: true };
  const note = {};
  for (const [key, max] of Object.entries(LIMITS)) {
    const v = body[key];
    if (v === undefined || v === null || v === "") continue;
    if (typeof v !== "string") return { error: `"${key}" must be text.` };
    if (v.length > max) return { error: `"${key}" is longer than ${max} characters.` };
    note[key] = v;
  }
  if (!note.text || !note.text.trim()) return { error: '"text" is empty.' };
  return { note };
}

// Notes go to D1 (table "notes", see schema.sql).
async function store(env, note) {
  await env.DB.prepare(
    "INSERT INTO notes (time, country, page, text, code, contact) VALUES (?, ?, ?, ?, ?, ?)"
  ).bind(note.time, note.country, note.page ?? null, note.text, note.code ?? null, note.contact ?? null).run();
}

function corsHeaders(request) {
  const origin = request.headers.get("Origin");
  if (!origin || !LOCAL_ORIGIN.test(origin)) return {};
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin",
  };
}

function reply(status, data, headers) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...headers },
  });
}
