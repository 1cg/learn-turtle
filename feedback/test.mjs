// Run: node feedback/test.mjs
import assert from "node:assert/strict";
import worker, { clean } from "./src/index.js";

assert.deepEqual(clean({ text: "hi", page: "/" }), { note: { text: "hi", page: "/" } });
assert.deepEqual(clean({ text: "hi", extra: "x" }), { note: { text: "hi" } });
assert.ok(clean({ text: "  " }).error);
assert.ok(clean({}).error);
assert.ok(clean([]).error);
assert.ok(clean({ text: 5 }).error);
assert.ok(clean({ text: "x".repeat(2001) }).error);
assert.ok(clean({ text: "hi", code: "x".repeat(50001) }).error);
assert.deepEqual(clean({ text: "hi", website: "spam" }), { bot: true });

const rows = [];
const DB = { prepare: (sql) => ({ bind: (...args) => ({ run: async () => { rows.push({ sql, args }); } }) }) };
const post = (body, headers = {}) =>
  worker.fetch(new Request("https://learnturtle.org/api/feedback", { method: "POST", body, headers }), { DB });
assert.equal((await post(JSON.stringify({ text: "hi", code: "forward(1)" }))).status, 200);
assert.equal(rows.length, 1);
assert.deepEqual(rows[0].args.slice(2), [null, "hi", "forward(1)", null]);
assert.equal((await post(JSON.stringify({ text: "x", website: "bot" }))).status, 200);
assert.equal(rows.length, 1);
assert.equal((await post("not json")).status, 400);
assert.equal((await post("x".repeat(70000))).status, 413);
assert.equal((await worker.fetch(new Request("https://learnturtle.org/api/feedback"), {})).status, 405);

let calls = 0;
const env = { DB, LIMITER: { limit: async () => ({ success: ++calls <= 5 }) } };
for (let i = 0; i < 5; i++) assert.equal((await worker.fetch(new Request("https://x/", { method: "POST", body: '{"text":"a"}' }), env)).status, 200);
assert.equal((await worker.fetch(new Request("https://x/", { method: "POST", body: '{"text":"a"}' }), env)).status, 429);

const pre = await worker.fetch(new Request("https://x/", { method: "OPTIONS", headers: { Origin: "http://127.0.0.1:8765" } }), {});
assert.equal(pre.headers.get("Access-Control-Allow-Origin"), "http://127.0.0.1:8765");
const evil = await worker.fetch(new Request("https://x/", { method: "OPTIONS", headers: { Origin: "https://evil.example" } }), {});
assert.equal(evil.headers.get("Access-Control-Allow-Origin"), null);
console.log("feedback tests: pass");
