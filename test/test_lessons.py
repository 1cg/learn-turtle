"""Tests for lessons/lessons.js. Run: python3 test/test_lessons.py
Intent: src/md/features/lessons.md (Lesson format, Lesson file, Lesson test)."""
import json
import os
import re
import sys

ROOT = os.path.join(os.path.dirname(__file__), "..")
sys.path.insert(0, os.path.join(ROOT, "py"))
import tracer   # noqa: E402
import turtle   # noqa: E402  (py/turtle.py, not the standard library)

LESSON_FIELDS = ["id", "unit", "title", "concept", "objects", "steps"]
STEP_FIELDS = {
    "watch": ["text", "look", "code"],
    "try": ["text", "solution", "hints"],
    "extend": ["text", "solution", "hints"],
}
OBJECTS_UNIT = 11
COMMANDS = sorted(m for m in dir(turtle.Turtle) if not m.startswith("_"))
GLOBAL_CALL = re.compile(r"^\s*(?:" + "|".join(COMMANDS) + r")\s*\(", re.M)


def load(path=os.path.join(ROOT, "lessons", "lessons.js")):
    src = open(path).read()
    m = re.search(r"export const LESSONS = (\[.*\]);\s*$", src, re.S)
    assert m, f"{path}: no 'export const LESSONS = [...];' found"
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


def style_errors(name, code, objects):
    if objects:
        m = GLOBAL_CALL.search(code)
        if m:
            return [f"{name}: global call {m.group(0).strip()!r} in an objects lesson"]
    elif "Turtle(" in code:
        return [f"{name}: Turtle() before unit {OBJECTS_UNIT}"]
    return []


def check(lesson):
    lid = lesson.get("id", "?")
    errs = [f"missing field {f}" for f in LESSON_FIELDS if f not in lesson]
    if errs:
        return [f"{lid}: {e}" for e in errs]
    if lesson["objects"] != (lesson["unit"] >= OBJECTS_UNIT):
        errs.append(f"objects must be {lesson['unit'] >= OBJECTS_UNIT} in unit {lesson['unit']}")
    steps = lesson["steps"]
    kinds = [s.get("kind") for s in steps]
    if len(kinds) < 2 or kinds[0] != "watch" or kinds[1] != "try" or any(k != "extend" for k in kinds[2:]):
        errs.append(f"steps must be watch, try, then extends: {kinds}")
        return [f"{lid}: {e}" for e in errs]

    prev = None  # the code the step starts from
    for i, s in enumerate(steps):
        name = f"step {i + 1} ({s['kind']})"
        for f in STEP_FIELDS[s["kind"]]:
            if f not in s or (isinstance(s[f], str) and not s[f].strip()) or (f == "hints" and not s[f]):
                errs.append(f"{name}: {f} is missing or empty")
        if "task" in s:
            errs.append(f"{name}: task is folded into text; remove the task field")
        for f in ["text", "look"]:
            if f in s and not s[f].isascii():
                errs.append(f"{name}: {f} has non-ASCII characters")
        if errs:
            continue
        if s["kind"] == "watch":
            if not s["look"].startswith("Look for: "):
                errs.append(f"{name}: look must start with 'Look for: '")
            errs += style_errors(name + " code", s["code"], lesson["objects"])
            r = run(s["code"])
            if bool(r["error"]) != bool(s.get("expectError")):
                got = r["error"] and f"{r['error'].get('type')}: {r['error'].get('msg')}"
                errs.append(f"{name}: expectError is {bool(s.get('expectError'))}, error is {got}")
            prev = s["code"]
            continue
        start = s.get("starter", prev) if s["kind"] == "try" else prev
        for key, code in [("solution", s["solution"])] + ([("starter", s["starter"])] if "starter" in s else []):
            errs += style_errors(f"{name} {key}", code, lesson["objects"])
        r = run(s["solution"])
        if r["error"]:
            errs.append(f"{name}: solution: {r['error'].get('type')}: {r['error'].get('msg')}")
        goal = lines(r)
        if not goal:
            errs.append(f"{name}: solution draws no line")
        elif lines(run(start)) == goal:
            errs.append(f"{name}: the start code already draws the goal")
        prev = s["solution"]
    return [f"{lid}: {e}" for e in errs]


def check_all(lessons):
    errs = []
    ids = [ls.get("id") for ls in lessons]
    for i in sorted(set(i for i in ids if ids.count(i) > 1)):
        errs.append(f"duplicate id {i}")
    units = [ls.get("unit", 0) for ls in lessons]
    if units != sorted(units):
        errs.append("lessons are not in unit order")
    for lesson in lessons:
        errs += check(lesson)
    return errs


def check_thumbs():
    """lessons/thumbs.json must equal a fresh run of tools/make_thumbs.py."""
    sys.path.insert(0, os.path.join(ROOT, "tools"))
    import make_thumbs
    if open(make_thumbs.OUT).read() != make_thumbs.build():
        return ["lessons/thumbs.json is out of date: run python3 tools/make_thumbs.py"]
    return []


def main():
    failed = False
    for e in check_thumbs():
        print("FAIL", e)
        failed = True
    for label, path in [("lessons", os.path.join(ROOT, "lessons", "lessons.js")),
                        ("fixture", os.path.join(ROOT, "test", "lessons-fixture.js"))]:
        lessons = load(path)
        errs = check_all(lessons)
        for e in errs:
            print("FAIL", label, e)
        steps = sum(len(ls["steps"]) for ls in lessons)
        print(f"{label}: {len(lessons)} lessons, {steps} steps, {len(errs)} failures")
        failed = failed or bool(errs)
    sys.exit(1 if failed else 0)


if __name__ == "__main__":
    main()
