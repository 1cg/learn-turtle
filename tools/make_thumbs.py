"""Write lessons/thumbs.json: the drawing of the last solution of each lesson, for the home map.
Run: python3 tools/make_thumbs.py
Intent: src/md/features/home.md (Decisions). test/test_lessons.py checks that the file is up to date."""
import json
import os
import re
import sys

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
sys.path.insert(0, os.path.join(ROOT, "py"))
import tracer  # noqa: E402

OUT = os.path.join(ROOT, "lessons", "thumbs.json")
AFTER = ["t", "x", "y", "color", "width", "visible"]  # the turtle fields drawThumb uses


def load_lessons():
    src = open(os.path.join(ROOT, "lessons", "lessons.js")).read()
    return json.loads(re.search(r"export const LESSONS = (\[.*\]);\s*$", src, re.S).group(1))


def slim(cmd):
    """Only the fields that drawThumb in js/lessons.js reads."""
    out = {"op": cmd["op"], "after": {k: cmd["after"][k] for k in AFTER}}
    if "pts" in cmd:
        out["pts"] = cmd["pts"]
        out["draw"] = cmd["draw"]
    return out


def build():
    thumbs = {}
    for lesson in load_lessons():
        last = next((s for s in reversed(lesson["steps"]) if s.get("solution")), None)
        if not last:
            continue
        r = json.loads(tracer.run(last["solution"]))
        thumbs[lesson["id"]] = {"src": last["solution"], "cmds": [slim(c) for c in r["cmds"]]}
    return json.dumps(thumbs, separators=(",", ":"), sort_keys=True) + "\n"


if __name__ == "__main__":
    text = build()
    open(OUT, "w").write(text)
    print(f"wrote {OUT}: {len(text)} bytes")
