# Lessons

The engine is built (`js/lessons.js`). The lesson content (`lessons/lessons.js`) is card-7.

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

- The URL hash picks the lesson: `#lesson=<id>`. No hash is free draw.
- The header shows the lesson picker and progress dots. A link switches between lessons and free draw.
- A strip above the code shows the concept, the text, the task, hints (one at a time), "Watch an example" and "Reset code". The strip folds with "hide".
- "Watch an example" puts the example in the editor as read only and plays it. "Back to my code" puts the child's code back.
- "Reset code" needs two clicks. The site uses no browser dialogs.
- The goal is the drawing of `solution`. It shows as a wide light dashed line under the child's drawing.

## Check

- The check runs when the program reaches its last step with no error. It compares the pen lines, not the code, so any correct program passes.
- `js/check.js` takes points every 4 units along each line. A point matches when it is 5 units or less from a line of the other drawing.
- Pass: 97% of the goal is covered and 95% of the child's lines are on the goal. Order and direction of drawing do not matter.
- Goal parts with no line show as red dashes. Fills, dots and text are not checked yet.

## Storage

- `localStorage` keys: `lt:code:<id>` (code, `free` for free draw), `lt:done:<id>` ("1"), `lt:fold`.
- All reads and writes are in try/catch. Without storage the site works but forgets.

## Lesson format

`{ id, unit, title, concept, text, task, starter, solution, hints, example, objects }`. In `text`, `task` and `hints`, only `` `code` `` is formatted. `?fixture` in the URL loads `test/lessons-fixture.js` instead of the real lessons.
