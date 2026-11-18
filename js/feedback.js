// Feedback button and dialog. Intent: src/md/features/feedback.md
// Self-contained: it adds its own button, dialog and styles. It does not use js/app.js.
(() => {
  const ENDPOINT = location.hostname.endsWith("learnturtle.org")
    ? "/api/feedback"
    : "http://127.0.0.1:8787/api/feedback";

  const css = `
    .fb-open { margin-left: 12px; }
    .fb-dialog { border: 1px solid var(--line); border-radius: 10px; padding: 18px; width: min(440px, calc(100vw - 32px));
      background: var(--panel); color: var(--ink); }
    .fb-dialog::backdrop { background: rgba(0, 0, 0, .3); }
    .fb-dialog h2 { margin: 0 0 8px; font-size: 18px; }
    .fb-dialog p { margin: 0 0 10px; color: var(--muted); font-size: 14px; }
    .fb-dialog textarea, .fb-dialog input[type=text] { width: 100%; box-sizing: border-box; font: inherit;
      padding: 8px; border: 1px solid var(--line); border-radius: 6px; margin-bottom: 10px; }
    .fb-dialog textarea { height: 120px; resize: vertical; }
    .fb-dialog .fb-trap { position: absolute; left: -9999px; }
    .fb-dialog .fb-row { display: flex; gap: 8px; justify-content: flex-end; margin-top: 6px; }
    .fb-dialog .fb-msg { min-height: 1.2em; margin: 6px 0 0; }
    .fb-dialog .fb-msg.bad { color: var(--bad); }
  `;

  const html = `
    <form method="dialog">
      <h2>Feedback</h2>
      <p>Tell us what you like, what is hard, or what is broken. Do not write your full name or address.</p>
      <textarea name="text" maxlength="2000" required aria-label="Your note"></textarea>
      <label class="check"><input type="checkbox" name="withCode"> Send my code too</label>
      <input type="text" name="contact" maxlength="200" placeholder="Email for an answer (optional)" aria-label="Contact">
      <input type="text" name="website" class="fb-trap" tabindex="-1" autocomplete="off" aria-hidden="true">
      <p class="fb-msg" role="status"></p>
      <div class="fb-row">
        <button type="button" value="cancel" class="fb-cancel">Cancel</button>
        <button type="submit" class="primary fb-send">Send</button>
      </div>
    </form>
  `;

  function editorCode() {
    const model = window.monaco?.editor?.getModels?.()[0];
    return model ? model.getValue() : "";
  }

  function setup() {
    const style = document.createElement("style");
    style.textContent = css;
    document.head.append(style);

    const dialog = document.createElement("dialog");
    dialog.className = "fb-dialog";
    dialog.innerHTML = html;
    document.body.append(dialog);

    const open = document.createElement("button");
    open.className = "fb-open";
    open.textContent = "Feedback";
    open.title = "Send us a note";
    document.querySelector("header").append(open);

    const form = dialog.querySelector("form");
    const msg = dialog.querySelector(".fb-msg");
    const send = dialog.querySelector(".fb-send");

    const say = (text, bad) => { msg.textContent = text; msg.classList.toggle("bad", !!bad); };

    open.addEventListener("click", () => { say(""); send.disabled = false; dialog.showModal(); });
    dialog.querySelector(".fb-cancel").addEventListener("click", () => dialog.close());

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const f = form.elements;
      const body = { text: f.text.value, page: location.pathname + location.search, website: f.website.value };
      if (f.contact.value.trim()) body.contact = f.contact.value.trim();
      if (f.withCode.checked) body.code = editorCode();
      send.disabled = true;
      say("Sending...");
      try {
        const res = await fetch(ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || `The server answered ${res.status}.`);
        form.reset();
        say("Thank you!");
        setTimeout(() => dialog.close(), 1200);
      } catch (err) {
        say(`The note did not send. ${err.message} Try again later.`, true);
        send.disabled = false;
      }
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", setup);
  else setup();
})();
