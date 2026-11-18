# Lessons

Not built yet. This file holds the intent.

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
