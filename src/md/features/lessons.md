# Lessons

The engine is `js/lessons.js`. The content is `lessons/lessons.js`.

## Goals

- Each lesson teaches one Python concept and shows it with the debugger.
- A lesson has a short text, a concept picture, starter code, a "watch it run" example, and a task.
- The task has a target drawing. The site checks the drawing of the child against the target.
- Progress and code stay in the browser (localStorage). There are no accounts.

## Order of concepts

1. A program is steps in order. Call a function: `forward(50)`. An argument.
2. Read an error and fix it.
3. Comments. Order of steps.
4. Variables: a named box. Change a variable. Math.
5. Types: numbers, strings, `print`.
6. `for` loops. Nested loops.
7. Define your own function. Call versus define. Parameters. Return values.
8. `if` / `else`, comparisons, booleans.
9. `while` loops.
10. Lists. Loop over a list.
11. Objects: `Turtle()`, more than one turtle.
12. Projects: house, flower, spiral.

## Decisions

- Lessons before the objects unit use only global calls (`forward(50)`). They do not allow `Turtle()`.
- After the objects unit, lessons use only the object style (`tracy.forward(50)`).
- Lesson text is short placeholder text. The human writes the final text.

## Engine

- The URL hash picks the view: `#home` (or no hash), `#free`, `#lesson=<id>`, `#lesson=<id>&step=<n>`, `#p=<progress>`.
- Without `&step`, a lesson opens at its first step that is not done.
- The strip above the code shows the concept, the step pills (Watch, Try, Extend), the text, and the actions of the step. "hide" folds the strip.
- Watch: the editor is read only and shows the step `code`. A purple "Look for" box asks one question. "seen N of M steps" counts the debugger steps. "Your turn" opens when the run reaches its end (also at an error in an error lesson). Then the watch step is done.
- Try and Extend: the editor is the child's. The goal shows under the drawing. A green bar marks lines that differ from the start code. "Watch again" goes back to the watch step. "Reset code" (two clicks, no browser dialog) goes back to the start code.
- Start code: try = the watch code (or `starter`); extend = the child's saved code of the step before (or the solution before). `startCode` in `js/progress.js` is the rule without the saved code.
- A matched step is done. A lesson is done when all its try and extend steps are done. The badge then links to the next step, the next lesson, or the home page.

## Check

- The check runs when the program reaches its last step with no error. It compares the pen lines, not the code, so any correct program passes.
- `js/check.js` takes points every 4 units along each line. A point matches when it is 5 units or less from a line of the other drawing.
- Pass: 97% of the goal is covered and 95% of the child's lines are on the goal. Order and direction of drawing do not matter.
- Goal parts with no line show as red dashes. Fills, dots and text are not checked yet.

## Storage

- `localStorage` keys: `lt:code:<id>:<step>` (code of a step), `lt:code:free`, `lt:done:<id>:<step>` and `lt:done:<id>` ("1"), `lt:fold`.
- All reads and writes are in try/catch. Without storage the site works but forgets.

## Progress link

- A link moves the progress of a child to another computer. There is no account and no server: the data is in the URL fragment after `#p=`. The browser does not send a fragment to the server.
- The link holds the done lessons and the code of each lesson. It does not hold free draw code.
- `js/progress.js` has pure functions (no DOM). `storage` is an object with `get(key)` and `set(key, value)`, as `store` in `js/lessons.js`.
  - `collect(storage, lessons)` gives `{v: 2, done: [id, ...], code: {"<id>:<step>": code}}`. `done` has lesson ids and step ids. It skips code that is empty or the same as the start code of the step (`startCode`).
  - `encode(progress)` gives the text after `#p=`: JSON, deflate-raw (`CompressionStream`), then base64url with no padding.
  - `decode(text)` reverses `encode`. If the text is bad, it throws an `Error` with a plain message.
  - `merge(storage, progress, lessons)` changes `storage` and gives `{done: [id, ...], code: [id, ...]}`: the lessons it marked done and the lessons whose code it wrote.
- Merge rules:
  - Done adds up. The merge never removes a done mark.
  - Code from the link goes in only if this computer has no code for the step, or only its start code. Else the code on this computer stays.
  - The merge ignores lesson ids that are not in `lessons`.
- The UI (buttons, `mailto`, reading `#p=`) is on the home page: see `home.md`.
- `test/progress-test.html` tests the functions and shows the link length with all 24 solutions as code.
- Link length (2026-11-18): all 24 lessons done with each solution as code is 2988 characters of JSON and a 1062-character link. Real child code is longer than a solution, so a link can be some thousand characters.

## Lesson format

```
{ id, unit, title, concept, objects,
  steps: [
    { kind: "watch", text, look, code, expectError? },
    { kind: "try", text, task, solution, hints, starter? },
    { kind: "extend", text, task, solution, hints },
  ] }
```

- `watch`: `code` runs read only in the debugger. `look` is one question that starts with "Look for:". There is no check and no goal. `expectError: true` marks a watch that shows an error on purpose (unit 2).
- `try`: the starter is the watch `code`. Give `starter` only if it must be different. The task changes the watch code. The goal is the drawing of `solution`.
- `extend`: the engine starts it from the child's own code of the step before. The task builds on that code, and `solution` extends the solution of the step before.
- Most lessons have watch, try, extend. Error lessons: the watch shows the error, the try fixes it. Projects can have 2 extends.
- In `text`, `task`, `look` and `hints`, only `` `code` `` is formatted.
- `?fixture` in the URL loads `test/lessons-fixture.js` instead of the real lessons.

## Lesson file

- `lessons/lessons.js` is `export const LESSONS = [...];` with a JSON body (keys in double quotes, no comments). A Python test reads it with `json`.
- The `id` is `<topic>-<n>`, for example `variables-1`. Do not change an `id`: progress and code in `localStorage` use it.
- `objects` is `true` from unit 11 on.
- A watch `code` can have an error only with `expectError: true`. Each `solution` must run with no error.
- Each `solution` must draw at least one line: the check compares lines only.

## Lesson test

`python3 test/test_lessons.py` runs every watch `code`, try `starter` and step `solution` with `py/tracer.py` in CPython. It also checks:

- the fields, the step kinds and order (watch, try, then extends), and the unique `id`s,
- a watch has an error if and only if it has `expectError: true`,
- no `Turtle()` before unit 11, and no global turtle calls from unit 11 on,
- each `solution` draws a line, and each step's start code does not draw its goal already.
