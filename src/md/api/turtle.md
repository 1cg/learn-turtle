# Turtle API

`py/turtle.py` replaces the standard `turtle` module. It does not draw. It records a command for each call.

## Rules

- Follow the CodeHS "Tracy" API: canvas 400 x 400, origin at the center, y up, heading 0 is east.
- The code of the child gets `from turtle import *` before it runs, so `forward(50)` works with no import.
- `Turtle()` makes more turtles. Each command records the id of its turtle.
- One program must not mix global calls (`forward`) and object calls (`bob.forward`). The human dislikes this mix in standard turtle. The global functions are wrappers that mark the "global" style, and `Turtle()` marks the "object" style. If a run has both, the result has `warnings: ["mix"]` and the page shows a warning.
- `speed()` has no effect. The speed menu controls play speed.
- `input()` does not work yet.

## Command record

Each command is `{op, line, after, ...}`.

- `op`: `new`, `move`, `circle`, `turn`, `pen`, `begin_fill`, `fill`, `dot`, `write`, `clear`, `bg`.
- `line`: the line of the child's code that made the command.
- `after`: the turtle state after the command: `t` (turtle id), `x`, `y`, `h`, `pen`, `color`, `fill`, `width`, `visible`.
- `move` and `circle` have `pts` (a polyline) and `draw` (pen down).
- `turn` has `by` (signed degrees).

## Open questions

- Default pen size, circle step count, and fill rule may differ from CodeHS. Compare with CodeHS output side by side.
