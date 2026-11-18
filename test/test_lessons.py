"""Tests for lessons/lessons.js. Run: python3 test/test_lessons.py
Intent: src/md/features/lessons.md (Lesson file, Lesson test)."""
import json
import os
import re
import sys

ROOT = os.path.join(os.path.dirname(__file__), "..")
sys.path.insert(0, os.path.join(ROOT, "py"))
import tracer   # noqa: E402
import turtle   # noqa: E402  (py/turtle.py, not the standard library)

FIELDS = ["id", "unit", "title", "concept", "text", "task", "starter", "solution", "hints", "example", "objects"]
OBJECTS_UNIT = 11
COMMANDS = sorted(m for m in dir(turtle.Turtle) if not m.startswith("_"))
GLOBAL_CALL = re.compile(r"^\s*(?:" + "|".join(COMMANDS) + r")\s*\(", re.M)


def load():
    src = open(os.path.join(ROOT, "lessons", "lessons.js")).read()
    m = re.search(r"export const LESSONS = (\[.*\]);\s*$", src, re.S)
    assert m, "lessons/lessons.js: no 'export const LESSONS = [...];' found"
    return json.loads(m.group(1))


def run(code):
    return json.loads(tracer.run(code))


def lines(result):
    """The drawn segments, rounded, as a set. Order and direction do not matter."""
    segs = set()
    for c in result["cmds"]:
        if c.get("draw") and c.get("pts"):
            pts = c["pts"]
            for a, b in zip(pts, pts[1:]):
                a, b = tuple(round(v) for v in a), tuple(round(v) for v in b)
                if a != b:
                    segs.add(tuple(sorted([a, b])))
    return segs


def check(lesson):
    errs = []
    lid = lesson.get("id", "?")
    for f in FIELDS:
        if f not in lesson:
            errs.append(f"missing field {f}")
    if errs:
        return errs
    for f in ["title", "concept", "text", "task", "solution", "example"]:
        if not lesson[f].strip():
            errs.append(f"{f} is empty")
    if not lesson["hints"]:
        errs.append("no hints")
    if lesson["objects"] != (lesson["unit"] >= OBJECTS_UNIT):
        errs.append(f"objects must be {lesson['unit'] >= OBJECTS_UNIT} in unit {lesson['unit']}")

    for name in ["solution", "example", "starter"]:
        code = lesson[name]
        if lesson["objects"]:
            m = GLOBAL_CALL.search(code)
            if m:
                errs.append(f"{name}: global call {m.group(0).strip()!r} in an objects lesson")
        elif "Turtle(" in code:
            errs.append(f"{name}: Turtle() before unit {OBJECTS_UNIT}")
        r = run(code)
        if name != "starter" and r["error"]:
            errs.append(f"{name}: {r['error'].get('type')}: {r['error'].get('msg')}")

    goal = lines(run(lesson["solution"]))
    if not goal:
        errs.append("solution draws no line")
    if lesson["starter"].strip() == lesson["solution"].strip():
        errs.append("starter is the solution")
    elif lines(run(lesson["starter"])) == goal:
        errs.append("starter already draws the goal")
    return [f"{lid}: {e}" for e in errs]


def main():
    lessons = load()
    errs = []
    ids = [ls.get("id") for ls in lessons]
    for i in sorted(set(i for i in ids if ids.count(i) > 1)):
        errs.append(f"duplicate id {i}")
    units = [ls.get("unit", 0) for ls in lessons]
    if units != sorted(units):
        errs.append("lessons are not in unit order")
    for lesson in lessons:
        errs += check(lesson)
    for e in errs:
        print("FAIL", e)
    print(f"{len(lessons)} lessons, {len(errs)} failures")
    sys.exit(1 if errs else 0)


if __name__ == "__main__":
    main()
