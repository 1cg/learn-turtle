// Client for the Python worker. One run at a time.
const TIMEOUT_MS = 15000;

export class Runner {
  constructor(onStatus = () => {}) {
    this.onStatus = onStatus;
    this.nextId = 1;
    this.pending = null;
    this.start();
  }

  start() {
    this.ready = false;
    this.onStatus("loading");
    this.worker = new Worker(new URL("./worker.js", import.meta.url));
    this.worker.onmessage = (ev) => this.handle(ev.data);
  }

  handle(msg) {
    if (msg.type === "ready") {
      this.ready = true;
      this.onStatus("ready");
    } else if (msg.type === "fatal") {
      this.onStatus("error", msg.msg);
    } else if (msg.type === "result" && this.pending && this.pending.id === msg.id) {
      const p = this.pending;
      this.pending = null;
      clearTimeout(p.timer);
      this.onStatus("ready");
      p.resolve(msg.result);
    }
  }

  run(code) {
    if (this.pending) this.stop();
    const id = this.nextId++;
    this.onStatus("running");
    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        this.stop({ type: "Timeout", msg: "program ran too long", line: 0 });
      }, TIMEOUT_MS + (this.ready ? 0 : 30000));
      this.pending = { id, resolve, timer };
      this.worker.postMessage({ type: "run", id, code });
    });
  }

  // Kill the worker. A pending run resolves with the given error.
  stop(error = { type: "Stopped", msg: "you stopped the program", line: 0 }) {
    this.worker.terminate();
    const p = this.pending;
    this.pending = null;
    if (p) {
      clearTimeout(p.timer);
      p.resolve({ steps: [], cmds: [], out: "", error });
    }
    this.start();
  }
}
