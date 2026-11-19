# Learn Turtle

Learn Turtle teaches Python to children with turtle drawings.
The site runs fully in the browser. The child installs nothing and makes no account.

## Goals

- Teach Python concepts (call, variable, loop, function, condition), not only turtle commands.
- Show what the program does, one step at a time, in plain words.
- Keep the screen quiet. A child must not see more controls or text than the current task needs.
- Match the CodeHS "Tracy" turtle API, so that work from school carries over.

## Overview

1. The child writes Python in a Monaco editor.
2. A Web Worker runs the code in Pyodide under `sys.settrace` and records every step.
3. The page replays the recording. The child can go forward and back.
4. Each step shows: the line that ran, a gray `# ...` explanation, the variables, and the drawing at that moment.

## Subtleties

- The debugger is record and replay, not live. The program runs to the end (or to the step cap) before the first step shows. This gives "Back" for free and lets an explanation use later values ("round 2 of 4").
- A tracer "line" event fires before the line runs. The page shows step `p` as "just ran" and the state from step `p + 1`.
- Any edit in the editor drops the recording. The next Play or Next records again.
- The site has no build step. Libraries come from a CDN at pinned versions.
- Workers do not load from `file://`. Use `python3 serve.py` for local work.

## File Index

- [features/debugger.md](features/debugger.md): step debugger, controls, and the UI decisions behind them
- [features/editor.md](features/editor.md): completion, grey words for values, color list, quiet editor settings
- [features/explanations.md](features/explanations.md): the gray `# ...` text for each step
- [features/lessons.md](features/lessons.md): lesson track and the order of concepts
- [features/home.md](features/home.md): home page, lesson map, progress buttons, lesson header
- [features/feedback.md](features/feedback.md): Feedback button, the Worker endpoint, checks and storage
- [api/turtle.md](api/turtle.md): turtle commands, the global versus object rule, and the command record
- [infrastructure/runtime.md](infrastructure/runtime.md): Pyodide worker, recording format, CDN versions, tests
- [infrastructure/hosting.md](infrastructure/hosting.md): Cloudflare Worker with static assets, deploy on push to master (Workers Builds), routes, rollback
