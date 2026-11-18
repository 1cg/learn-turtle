# Learn Turtle

Learn Python with a turtle. The site runs in the browser. You do not install anything.

## Start

1. Open a terminal in this folder.
2. Run `python3 serve.py`. This server turns off the browser cache.
3. Open http://127.0.0.1:8765/ in a browser.

The page needs a web server. It does not work from `file://`.

## Parts

- `py/turtle.py`: turtle commands (CodeHS Tracy API). Each call records a command.
- `py/tracer.py`: runs the code and records each step for the debugger.
- `js/worker.js`: loads Pyodide (Python for the browser) and runs the tracer.
- `js/runner.js`: sends code to the worker and gets the recording.
- `py/explain.py`: plain-word text for each step (the ghost comment).
- `js/debugger.js`: steps through the recording (next, back, skip, stop signs).
- `js/editor.js`: Monaco editor, completion, stop signs, line marks.
- `js/renderer.js`: draws the turtle commands on the canvas.

## Tests

- Run `python3 test/test_explain.py`.
- Open each page in `test/` that ends in `-test.html`, for example http://127.0.0.1:8765/test/runner-test.html.
- All cases must show PASS.

## License

BSD 3-Clause. See `LICENSE`. Pyodide (MPL-2.0) and Monaco Editor (MIT) load from a CDN and are not in this repo.
