# Explanations

Each step can have a short text, for example `# the turtle moves forward 50 (size)`.
The text shows as a gray italic comment at the end of the line that just ran.

## Decisions

- The text looks like a Python comment. It does not move the code, and it teaches what a comment is.
- The text is cut with "..." to fit the editor width. Hover shows all of it.
- A toolbar button turns all explanations off.
- The text comes from templates in `py/explain.py`, not from an AI model. It must be the same each time and must work offline.

## How

- `explain.py` parses the code with `ast` and finds the statement at each line.
- It fills a template with values from the recording: the variables before and after the line, the turtle commands that the line made, and the output.
- The recording holds the whole run. So a loop header can say "round 2 of 4", and an `if` can say which branch ran.
- An unknown kind of line gets "run line N".

## Kinds

Turtle call, assignment (new, changed, same), `Turtle()`, call and jump into a function, return and "done", `def`, `for`, `while`, `if` / `elif` / `else`, `print`, `pass`, `break`, `continue`.

## Not done yet

- Kid text for errors (for example "foward is not a command. Did you mean forward?").
- Hand-written text from a lesson for one line. The template text replaces it when the child edits that line.
