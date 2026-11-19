// Monaco editor setup: kid settings, completion, parameter hints, hover help,
// breakpoints (stop signs), and line marks for the debugger.
import { TURTLE_API, GLOBAL_ONLY, PY_BUILTINS, PY_SNIPPETS, PY_KEYWORDS, API_BY_NAME, COLORS, COLOR_FNS } from "./turtle-api.js";
import { diagram } from "./diagrams.js";

const MONACO = "https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min";
const GHOST_MAX = 70;

function loadMonaco() {
  if (window.monaco) return Promise.resolve(window.monaco);
  window.MonacoEnvironment = {
    getWorkerUrl: () => "data:text/javascript;charset=utf-8," + encodeURIComponent(
      `self.MonacoEnvironment = { baseUrl: "${MONACO}/" }; importScripts("${MONACO}/vs/base/worker/workerMain.js");`),
  };
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = MONACO + "/vs/loader.js";
    s.onload = () => {
      window.require.config({ paths: { vs: MONACO + "/vs" } });
      window.require(["vs/editor/editor.main"], () => resolve(window.monaco), reject);
    };
    s.onerror = reject;
    document.head.append(s);
  });
}

// Names the kid made: functions, variables, loop variables, parameters.
function userNames(text, skipLine = 0) {
  const names = new Map();
  if (skipLine) text = text.split("\n").map((l, i) => (i + 1 === skipLine ? "" : l)).join("\n");
  for (const m of text.matchAll(/^\s*def\s+(\w+)\s*\(([^)]*)\)/gm)) {
    names.set(m[1], { kind: "function", params: m[2].split(",").map((p) => p.trim().split("=")[0].trim()).filter(Boolean) });
    for (const p of m[2].split(",")) {
      const n = p.trim().split("=")[0].trim();
      if (n && !names.has(n)) names.set(n, { kind: "variable" });
    }
  }
  for (const m of text.matchAll(/^\s*(\w+)\s*(?:=(?!=)|\+=|-=|\*=|\/=)/gm)) if (!names.has(m[1])) names.set(m[1], { kind: "variable" });
  for (const m of text.matchAll(/\bfor\s+(\w+)\s+in\b/g)) if (!names.has(m[1])) names.set(m[1], { kind: "variable" });
  return names;
}

function docMarkdown(f) {
  const sig = `${f.name}(${f.params.map((p) => p[0]).join(", ")})`;
  const params = f.params.map((p) => `- \`${p[0]}\`: ${p[1]}`).join("\n");
  return { value: "```python\n" + sig + "\n```\n" + f.doc + (params ? "\n\n" + params : "") };
}

let providersReady = false;
let varLookup = () => null; // set by the app: name -> markdown or null
function registerProviders(monaco) {
  if (providersReady) return;
  providersReady = true;
  const K = monaco.languages.CompletionItemKind;
  const SNIP = monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet;

  const SUGGEST = { id: "editor.action.triggerSuggest", title: "colors" };
  // A call goes in as the name and empty brackets, cursor inside. No sample value.
  // Only the name if a "(" already follows.
  const call = (name, nParams, parenAfter) => {
    if (parenAfter) return { insertText: name };
    if (!nParams) return { insertText: name + "()" };
    if (COLOR_FNS.includes(name)) return { insertText: name + '("$0")', insertTextRules: SNIP, command: SUGGEST };
    return { insertText: name + "($0)", insertTextRules: SNIP };
  };
  const fnItem = (f, range, sort, parenAfter) => ({
    label: f.name, kind: f.name === "Turtle" ? K.Class : K.Function, documentation: docMarkdown(f), detail: f.doc,
    range, sortText: sort + f.name, ...call(f.name, f.params.length, parenAfter),
  });
  const COLOR_ARG = String.raw`(?:\b(?:${COLOR_FNS.join("|")})\(\s*|\bdot\([^,()]*,\s*)`;
  const IN_COLOR = new RegExp(COLOR_ARG + String.raw`["'](\w*)$`);

  monaco.languages.registerCompletionItemProvider("python", {
    triggerCharacters: [".", '"', "'"],
    provideCompletionItems(model, pos) {
      const word = model.getWordUntilPosition(pos);
      const whole = model.getWordAtPosition(pos);
      const end = whole ? whole.endColumn : word.endColumn;
      const range = { startLineNumber: pos.lineNumber, endLineNumber: pos.lineNumber, startColumn: word.startColumn, endColumn: end };
      const line = model.getLineContent(pos.lineNumber);
      const before = line.slice(0, word.startColumn - 1);
      const typed = word.word.toLowerCase();
      // Inside the quotes of a color: the color list.
      const cm = line.slice(0, pos.column - 1).match(IN_COLOR);
      if (cm) {
        return { incomplete: true, suggestions: Object.entries(COLORS).filter(([n]) => n.startsWith(typed) && n !== typed)
          .map(([n, hex], i) => ({ label: n, kind: K.Color, documentation: hex, insertText: n, range, sortText: String(i).padStart(2, "0") })) };
      }
      if (before.includes("#") || (before.split('"').length % 2 === 0) || (before.split("'").length % 2 === 0)) return { suggestions: [] };
      const parenAfter = /^\s*\(/.test(line.slice(end - 1));
      // Prefix match only, asked again on each letter. A full function or variable name closes the list.
      const keep = (items) => items.some((i) => i.label.toLowerCase() === typed && (i.kind === K.Function || i.kind === K.Variable || i.kind === K.Class))
        ? { suggestions: [], incomplete: true }
        : { suggestions: items.filter((i) => (i.filterText || i.label).toLowerCase().startsWith(typed)), incomplete: true };
      if (/\w\.$/.test(before)) return keep(TURTLE_API.map((f) => fnItem(f, range, "0", parenAfter)));
      if (/[.\w]$/.test(before)) return { suggestions: [] };
      if (typed.length < 2) return { suggestions: [], incomplete: true };
      const out = [];
      TURTLE_API.forEach((f) => out.push(fnItem(f, range, "1", parenAfter)));
      GLOBAL_ONLY.forEach((f) => out.push(fnItem(f, range, "2", parenAfter)));
      PY_BUILTINS.forEach((f) => out.push(fnItem(f, range, "2", parenAfter)));
      if (!parenAfter) {
        for (const s of PY_SNIPPETS) {
          out.push({ label: s.label, kind: K.Snippet, insertText: s.insert, insertTextRules: SNIP,
            documentation: s.doc, detail: s.doc, range, sortText: "0" + s.label, filterText: s.label.split(" ")[0] });
        }
      }
      for (const k of PY_KEYWORDS) {
        if (!API_BY_NAME[k]) out.push({ label: k, kind: K.Keyword, insertText: k, range, sortText: "3" + k });
      }
      for (const [n, info] of userNames(model.getValue(), pos.lineNumber)) {
        if (API_BY_NAME[n] || PY_KEYWORDS.includes(n)) continue;
        const fn = info.kind === "function";
        out.push({ label: n, kind: fn ? K.Function : K.Variable, range, sortText: "0" + n,
          detail: fn ? "your function" : "your variable", ...(fn ? call(n, info.params.length, parenAfter) : { insertText: n }) });
      }
      return keep(out);
    },
  });

  monaco.languages.registerHoverProvider("python", {
    provideHover(model, pos) {
      const w = model.getWordAtPosition(pos);
      if (!w) return null;
      const f = API_BY_NAME[w.word];
      if (!f) {
        const text = varLookup(w.word);
        return text ? { range: new monaco.Range(pos.lineNumber, w.startColumn, pos.lineNumber, w.endColumn), contents: [{ value: text }] } : null;
      }
      const contents = [docMarkdown(f)];
      // A picture when the call on this line has number values, for example left(90).
      for (const m of model.getLineContent(pos.lineNumber).matchAll(/(\w+)\s*\(([^()]*)\)/g)) {
        if (m[1] !== w.word || m.index + 1 !== w.startColumn) continue;
        const nums = m[2].split(",").map((s) => (/^\s*-?\d+(\.\d+)?\s*$/.test(s) ? parseFloat(s) : undefined));
        const svg = diagram(w.word, nums);
        if (svg) contents.push({ value: `![picture of ${w.word}](data:image/svg+xml;base64,${btoa(svg)})` });
      }
      return { range: new monaco.Range(pos.lineNumber, w.startColumn, pos.lineNumber, w.endColumn), contents };
    },
  });
}

export async function createEditor(el, value) {
  const monaco = await loadMonaco();
  registerProviders(monaco);
  monaco.editor.defineTheme("kid", {
    base: "vs", inherit: true, rules: [],
    colors: { "editor.background": "#fbfaf7", "editorLineNumber.foreground": "#9ca3af", "editorGutter.background": "#fbfaf7" },
  });
  const ed = monaco.editor.create(el, {
    value, language: "python", theme: "kid", fontSize: 17, lineHeight: 28,
    fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
    minimap: { enabled: false }, scrollBeyondLastLine: false, automaticLayout: true,
    glyphMargin: true, lineNumbersMinChars: 2, tabSize: 4, insertSpaces: true, detectIndentation: false,
    wordBasedSuggestions: "off", quickSuggestions: { other: true, comments: false, strings: true },
    suggest: { showWords: false, preview: false, snippetsPreventQuickSuggestions: false },
    acceptSuggestionOnEnter: "on", tabCompletion: "off", parameterHints: { enabled: false },
    occurrencesHighlight: "off", selectionHighlight: false,
    bracketPairColorization: { enabled: false }, matchBrackets: "never", guides: { bracketPairs: false },
    renderLineHighlight: "none", overviewRulerLanes: 0, hideCursorInOverviewRuler: true,
    scrollbar: { verticalScrollbarSize: 10, horizontalScrollbarSize: 10 }, padding: { top: 8, bottom: 8 },
    stickyScroll: { enabled: false }, folding: false, contextmenu: false,
  });
  const model = ed.getModel();

  // ---- grey words: empty brackets show the names of the values they need ----
  const greyDeco = ed.createDecorationsCollection([]);
  const greyWords = () => {
    const d = [];
    const users = userNames(model.getValue());
    for (let n = 1; n <= model.getLineCount(); n++) {
      for (const m of model.getLineContent(n).matchAll(/(\w+)\(\s*\)/g)) {
        const f = API_BY_NAME[m[1]];
        const u = users.get(m[1]);
        const need = f ? f.params.filter((p) => !p[1].startsWith("optional")) : u && u.kind === "function" ? u.params.map((p) => [p, ""]) : [];
        if (!need.length) continue;
        const col = m.index + m[0].length; // the ")" column
        d.push({ range: new monaco.Range(n, col, n, col + 1), options: {
          before: { content: need.map((p) => p[0]).join(", "), inlineClassName: "argph" },
          hoverMessage: { value: need.filter((p) => p[1]).map((p) => `\`${p[0]}\`: ${p[1]}`).join("\n\n") } } });
      }
    }
    greyDeco.set(d);
  };
  model.onDidChangeContent(greyWords);
  greyWords();

  // ---- breakpoints (stop signs) ----
  const stops = ed.createDecorationsCollection([]);
  const stopDeco = { isWholeLine: false, glyphMarginClassName: "stop-sign", glyphMarginHoverMessage: { value: "Stop sign: the program pauses here" }, stickiness: monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges };
  const stopLines = () => stops.getRanges().map((r) => r.startLineNumber);
  const setStops = (lines) => {
    stops.set([...new Set(lines)].map((n) => ({ range: new monaco.Range(n, 1, n, 1), options: stopDeco })));
    api.onStopsChange(stopLines());
  };
  const T = monaco.editor.MouseTargetType;
  ed.onMouseDown((e) => {
    if (e.target.type !== T.GUTTER_GLYPH_MARGIN && e.target.type !== T.GUTTER_LINE_NUMBERS) return;
    const n = e.target.position.lineNumber;
    if (!model.getLineContent(n).trim()) return;
    const lines = stopLines();
    setStops(lines.includes(n) ? lines.filter((x) => x !== n) : [...lines, n]);
  });

  // ---- debugger line marks ----
  const marks = ed.createDecorationsCollection([]);
  const changed = ed.createDecorationsCollection([]);
  const api = {
    monaco, editor: ed, model,
    onStopsChange: () => {},
    getValue: () => ed.getValue(),
    setValue: (v) => ed.setValue(v),
    focus: () => ed.focus(),
    getStops: stopLines,
    setStops,
    onChange: (fn) => model.onDidChangeContent(() => fn()),
    onRunKey: (fn) => ed.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, fn),
    // ran: line that just ran; next: line that runs next; ghost: plain text for the ran line.
    setLines({ ran = 0, next = 0, ghost = "", inFunc = null } = {}) {
      const d = [];
      if (inFunc) d.push({ range: new monaco.Range(inFunc[0], 1, inFunc[1], 1), options: { isWholeLine: true, linesDecorationsClassName: "ln-infunc" } });
      if (next && next !== ran) d.push({ range: new monaco.Range(next, 1, next, 1), options: { isWholeLine: true, className: "ln-next" } });
      if (ran) {
        d.push({ range: new monaco.Range(ran, 1, ran, 1), options: { isWholeLine: true, className: "ln-ran", linesDecorationsClassName: "ln-ran-edge" } });
        if (ghost) {
          const end = model.getLineMaxColumn(ran);
          // Fit the ghost text in the visible width, so it never makes a scroll bar.
          const charW = ed.getOption(monaco.editor.EditorOption.fontInfo).typicalHalfwidthCharacterWidth;
          const room = Math.floor(ed.getLayoutInfo().contentWidth / charW) - (end - 1) - 8;
          const max = Math.max(12, Math.min(GHOST_MAX, room));
          const short = ghost.length > max ? ghost.slice(0, max - 3) + "..." : ghost;
          d.push({ range: new monaco.Range(ran, 1, ran, end), options: {
            after: { content: "    # " + short, inlineClassName: "ghost-text" }, hoverMessage: { value: ghost } } });
        }
        ed.revealLineInCenterIfOutsideViewport(ran);
      }
      marks.set(d);
    },
    clearLines() { marks.set([]); },
    showError(line, msg) {
      monaco.editor.setModelMarkers(model, "run", line ? [{ severity: monaco.MarkerSeverity.Error, message: msg,
        startLineNumber: line, startColumn: 1, endLineNumber: line, endColumn: model.getLineMaxColumn(line) }] : []);
      if (line) ed.revealLineInCenterIfOutsideViewport(line);
    },
    clearError() { monaco.editor.setModelMarkers(model, "run", []); },
    setVarLookup(fn) { varLookup = fn; },
    // Green bar on lines that differ from the start code of a lesson step.
    setChanged(lines) {
      changed.set(lines.map((n) => ({ range: new monaco.Range(n, 1, n, 1), options: { isWholeLine: true, linesDecorationsClassName: "ln-changed" } })));
    },
    setReadOnly(on) { ed.updateOptions({ readOnly: on, readOnlyMessage: { value: "This is the example. Press Your turn to write code." } }); },
  };
  return api;
}
