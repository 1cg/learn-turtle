# Debugger

The debugger is the main way to run code. There is no separate Run button.

## Controls

The controls are one row at the top of the code panel, in this order:

- Start: go back to before the first step.
- Back: one step back. The drawing and the variables go back too.
- Next: one step forward. This is the only button with a word.
- Skip function: run a whole function call in one step. It is on only when the next step is a call.
- To stop sign: go to the next stop sign.
- Play / Pause: play the steps at the chosen speed. It pauses before a stop-sign line and at the end.
- Variables: open or close the variables dropdown.
- Explanations on / off: show or hide the gray `# ...` text.
- Speed menu: shows the current speed (0.5x to max).

Keyboard: Left and Right arrows step when the editor does not have focus. Cmd+Enter plays.

## Decisions

- No timeline bar. The length of a program is not known before it runs, and Back is enough.
- Icon buttons with tooltips keep the row tight. The human said the first versions were too busy.
- Stop signs are breakpoints. Click a line number or the gutter to set one. They follow the line when the code changes.
- A stop sign pauses before its line runs, so the child sees the line that comes next.

## Line marks

- Yellow line: the line that just ran.
- Blue line: the line that runs next.
- A function's "done" step marks the line that called it, not the last line of the function.

## Panels

- Turtles: one small chip per turtle under the code. The icon has the pen color, faces the heading, and grows with the pen size. A pen icon shows up or down. Hover shows position and heading. There is no name.
- Canvas: the turtle shows its `(x, y)` next to it. A dashed line shows the next move. An arc shows the last turn.
- Variables: an `x=` button in the toolbar opens a dropdown. The button shows the number of variables and flashes when a value changes. The dropdown groups variables by running function, the innermost first, with the caller line.
- Each variable is a chip. The color shows the type: blue number, green text, orange list, purple True/False, gray function. A small tag names the type (`int`, `str`, `list`). Text keeps its quotes.
- Hover a name in the code to see its type in words and its value at the current step.
- Why: the human wanted types visible but quiet. A closed dropdown takes no space. Option mockups: `tmp/mockups/variables.html` (not in git).
