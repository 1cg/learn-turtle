# Runtime

## Python

- Pyodide 0.29.5 from cdn.jsdelivr.net runs in a Web Worker (`js/worker.js`).
- The worker writes `turtle.py`, `explain.py` and `tracer.py` into the Pyodide file system and imports `tracer`.
- `js/runner.js` gives a promise API. Stop and the 15 s timeout kill the worker and start a new one.
- 0.29.5 is used because the newer 314.x line is not known well yet.
- The page starts the worker first, before it loads Monaco. Python loads in the background on every page, also on the home page, so it is ready when the child opens a lesson.
- Until Python is ready, the run buttons are off, the Next button says "Loading Python...", and the canvas is dim.
- First load, cold cache, measured on learnturtle.org (card-27): see the card for the numbers.

## Recording

`tracer.run(code)` returns JSON: `{steps, cmds, out, error}`.

- A step is `{event, line, cmd, out, frames, say, fn?, ret?}`.
- `event` is `line`, `call`, `return` or `exception`. The page hides `exception` and the first `call`.
- `cmd` and `out` are the command count and the output length before the step.
- `frames` lists the running functions from the main program down. Each has `name`, `line` and `vars`.
- A variable is `{type, repr}`. Lists also have `items` and `len`. Functions have `def` (the line).
- The step cap is 20000. Then the error is `StepLimit` (an endless loop).

## Editor

- Monaco 0.52.2 from cdn.jsdelivr.net, loaded with its AMD loader. Newer versions may drop the AMD loader.
- `js/turtle-api.js` holds the command list for completion, parameter hints and hover help.

## Local work and tests

- `python3 serve.py` serves the folder with the browser cache off. Without it, the browser can keep old modules.
- `python3 test/test_explain.py` tests the explanations in CPython.
- The pages in `test/*-test.html` test the runner, renderer, editor and debugger in a browser.
